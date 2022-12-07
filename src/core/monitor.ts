import merge from 'deepmerge';
import { TrackerEvents } from '../types';
import { getDeviceInfo, isObject } from '../utils/utils';
import { IError, IUnHandleRejectionError } from "./baseObserver";
import { ErrorObserver } from "./errorObserver";
import { myEmitter } from './event';
import { Reporter } from './report';


export type ErrorCombine =
  | IError
  | IUnHandleRejectionError;

  // | IHttpReqErrorRes;

export interface IErrorOptions {
  watch: boolean;
  repeat: number;
  delay: number;
}

export interface IHttpOptions {
  fetch: boolean;
  ajax: boolean;
}
export enum ConsoleType {
  log = "log",
  error = "error",
  warn = "warn",
  info = "info",
  debug = "debug"
}


export interface IRrwebOption {
  watch: boolean;
  queueLimit: number;
  delay: number;
}

export type IData = Record<string | number | symbol, unknown>;

export interface IHookBeforeSend {
  (data: ErrorCombine, eventName: ErrorCombine["errorType"]): ErrorCombine;
}

export interface ReportOptions {
  url: string;
  method?: string;
  contentType?: string;
  beforeSend?: IHookBeforeSend;
}

export interface ITrackerOptions {
  error: IErrorOptions;
  data: IData;
  report: ReportOptions;
}

export type PlainObject = Record<string | number | symbol, unknown>;

export type AppVersion =  { appVersion: string, gitHash: string }

export type EventName = string | symbol;

export const defaultTrackerOptions =  {
  report: {
    url: "",
    method: "POST",
    contentType: "application/json",
    beforeSend: (data: ErrorCombine) => data
  },
  data: {},
  error: {
    watch: true,
    repeat: 5,
    delay: 1000
  },
};

export class Monitor {
  public static instance: Monitor;

  public errObserver: ErrorObserver;

  public reporter: Reporter;

  private readonly defaultOptions: ITrackerOptions = defaultTrackerOptions;

  public $options: ITrackerOptions = this.defaultOptions;


  public $data: IData = {};

  constructor(options: Partial<ITrackerOptions | undefined>, appVersion: Partial<AppVersion> | undefined = {}) {
    this.initOptions(options);

    this.getUserAgent();
    this.getDevice();
    this.getAppVesionInfo(appVersion);
    this.initInstances();

  }

  /**
   * 
   * 初始化单例模式
  */

  static init(options: Partial<ITrackerOptions> | undefined = {}, appVersion: Partial<AppVersion> | undefined = {}) {
    if (!this.instance) {
      this.instance = new Monitor(options, appVersion);
    }
    return this.instance;
  }

  initInstances() {
    this.reporter = new Reporter(this.$options);

    if (this.$options.error.watch) {
      this.errObserver = new ErrorObserver(this.$options);
      this.errObserver.init();
    }
  }

  initOptions(options: Partial<ITrackerOptions | undefined>): void {
    if (!options) options = {};

    this.$options = merge(this.$options, options)
  }


  getDevice() {
    const deviceInfo = getDeviceInfo();
    this.configData({
      _deviceInfo: deviceInfo
    });
  }

  getUserAgent() {
    this.configData({
      _userAgent: navigator.userAgent
    });
  }

  getAppVesionInfo(appVersion: Partial<AppVersion>) {
    if (!appVersion) {
      this.configData({
        appVersionInfo: {
          appVersion: '',
          gitHash: ''
        }
      });
    };

    this.configData({
      appVersionInfo: appVersion
    });
  }

  configData(key: string, value: unknown, deepmerge?: boolean): Monitor;
  configData(options: PlainObject, deepmerge?: boolean): Monitor;
  configData(
    key: PlainObject | string,
    value: unknown,
    deepmerge = true
  ): Monitor {
    if (typeof key === "string") {
      if (isObject(value) && deepmerge) {
        this.$data = merge(this.$data, value as PlainObject);
      } else {
        this.$data[key as string] = value;
      }
    } else if (isObject(key)) {
      if (typeof value === "boolean") {
        deepmerge = value;
      }
      value = key;

      if (deepmerge) {
        this.$data = merge(this.$data, value as PlainObject);
      } else {
        this.$data = {
          ...this.$data,
          ...(value as PlainObject)
        };
      }
    }

    myEmitter.emit(TrackerEvents._globalDataChange, this.$data);

    return this;
  }

  private _on(
    eventName: EventName,
    listener: (...args: any[]) => void,
    withEventName = false
  ) {
    myEmitter?.on(eventName, async (...args) => {
      if (withEventName) {
        args.unshift(eventName);
      }

      myEmitter?.emit(TrackerEvents._offConsoleTrack);

      await listener(...args);

      myEmitter?.emit(TrackerEvents._onConsoleTrack);
    });

    return this;
  }

  on(
    event: EventName | Array<EventName>,
    listener: (...args: any[]) => void
  ): Monitor {
    if (event instanceof Array) {
      event.forEach((eventName) => {
        this._on(eventName, listener, true);
      });

      return this;
    }

    return this._on(event, listener);
  }
}