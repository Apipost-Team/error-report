import { BaseError } from "../types/index";
import { getCurDate } from "../utils/utils";
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
    const localCacheError = localStorage.getItem('cacheError');
    if (localCacheError) {
      const cacheError: ICacheError = JSON.parse(localCacheError);
      const keys = Object.keys(cacheError);
      if (keys.includes(getCurDate())) {
        this.cacheError = {};
      } else {
        this.cacheError = cacheError;
      }
    } else {
      this.cacheError = {};
    }
    
    this.options = options;
  }
  /**
   * 发送同样的错误不超过重复的次数，防止一直循环
   * 
  */
  safeEmitError(cacheKey: string, errorType: string, errorObj:  IError | BaseError | IUnHandleRejectionError) {
    const date = getCurDate();



    if (typeof this.cacheError[cacheKey + date] !== "number") {
      this.cacheError[cacheKey + date] = 1;
    } else {
      this.cacheError[cacheKey + date] += 1;
    }
    
    const repeat = (this.options.error as IErrorOptions).repeat;
    if (this.cacheError[cacheKey + date] < repeat) {
      myEmitter.emitWithGlobalData(errorType, errorObj);
      localStorage.setItem('cacheError', JSON.stringify(this.cacheError));
    } else {
      console.warn(
        "上报错误次数已经到到峰值1",
        errorObj
      );
    }
  }
} 