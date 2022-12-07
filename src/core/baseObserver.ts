import { BaseError } from "../types/index";
import { myEmitter } from "./event";
import { IErrorOptions, ITrackerOptions } from "./monitor";


export interface IError extends BaseError {
  msg: string;
  line: number | undefined;
  column: number | undefined;
  stackTrace: string;
}

export interface IUnHandleRejectionError extends BaseError {
  msg: string;
}

export interface ICacheError {
  [errorMsg: string]: number;
}

export class BaseObserver {

  public options;
  public cacheError: ICacheError;

  constructor(options: ITrackerOptions) {
    this.cacheError = {};
    this.options = options;
  }
  /**
   * 发送同样的错误不超过重复的次数，防止一直循环
   * 
  */
  safeEmitError(cacheKey: string, errorType: string, errorObj:  IError | BaseError | IUnHandleRejectionError) {
    if (typeof this.cacheError[cacheKey] !== "number") {
      this.cacheError[cacheKey] = 0;
    } else {
      this.cacheError[cacheKey] = 1;
    }

    const repeat = (this.options.error as IErrorOptions).repeat;
    if (this.cacheError[cacheKey] < repeat) {
      myEmitter.emitWithGlobalData(errorType, errorObj);
    } else {
      console.warn(
        "错误次数已经到到峰值",
        errorObj
      );
    }
  }
} 