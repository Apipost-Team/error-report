import ErrorStackParser from "error-stack-parser";
import stringify from 'json-stringify-safe';
import { BaseError, ErrorType, TrackerEvents } from "../types";
import { BaseObserver, IError, IUnHandleRejectionError } from "./baseObserver";
import { ITrackerOptions } from "./monitor";

export class ErrorObserver extends BaseObserver {

  public _options;
  
  constructor(options: ITrackerOptions) {
    super(options);
    this._options = options;
  }

  init() {
    const oldOnError = window.onerror;
    const oldUnHandleRejection = window.onunhandledrejection;
    const self = this;

    window.onerror = function(...args) {
      if (oldOnError) {
        oldOnError(...args);
      }

      const [msg, url, line, column, error] = args;
      const msgText = typeof msg === 'string' ? msg : msg.type;
      const stackTrace = error ? ErrorStackParser.parse(error) : [];

      const errorObj: IError = {
        msg: msgText,
        line,
        url,
        column,
        stackTrace: stringify(stackTrace),
        errorType: ErrorType.jsError
      }
      self.safeEmitError(msgText, TrackerEvents.jsError, errorObj);
    }
    
    window.addEventListener('error', (event) => {
      const target: any = event.target;
      const isElementTarget =
        target instanceof HTMLScriptElement ||
        target instanceof HTMLLinkElement ||
        target instanceof HTMLImageElement;
      // 判断是否已经捕获
      if (!isElementTarget) return false;

      let url: string;

      // 判断是否是资源的标签类的错误
      if (target instanceof HTMLLinkElement) {
        url = target.href;
      } else {
        url = target.src;
      }

      const errorType = ErrorType.resourceError;
      const errorObj: BaseError = {
        url,
        errorType: errorType,
      };

      self.safeEmitError(
        `${errorType}: ${url}`,
        TrackerEvents.resourceError,
        errorObj
      );

    }, true);
    
    window.onunhandledrejection = function (e: PromiseRejectionEvent) {
      if (oldUnHandleRejection) {
        oldUnHandleRejection.call(window, e);
      }

      const error = e.reason;
      const errMsg = error instanceof Error ? error.message : error;

      console.log('promise error', e);

      const errorObj: IUnHandleRejectionError = {
        msg: errMsg,
        errorType: ErrorType.unHandleRejectionError,
      };

      self.safeEmitError(errMsg, TrackerEvents.unHandleRejection, errorObj);
    };

    
  }
}