import stringify from 'json-stringify-safe';
import { serialize } from 'object-to-formdata';

import { convertObjToUrlencoded, isObject } from "../utils/utils";
import { ErrorCombine, ITrackerOptions } from "./monitor";

export type ErrorList = Array<ErrorCombine>;

export interface IReportParams {
  errorList: ErrorList;
}

export type ReportData = string | FormData;

export class Reporter {
  private _options: ITrackerOptions;

  constructor(options: ITrackerOptions) {
    this._options = options;
  }

  private _isMatchMethod(input: string, method = "get") {
    return input.toLowerCase() === method;
  }

  private getPureReportData(error: { [key: string]: any }) {
    Reflect.deleteProperty(error, "context");

    Object.keys(error).forEach((key) => {
      const val = error[key];

      if (isObject(val)) {
        error[key] = stringify(val);
      }
    });

    return error;
  }

  doReport(reportData: ReportData): void {
    const { method, contentType } = this._options.report;
    let { url } = this._options.report;
    const isHttpGet = this._isMatchMethod(method, "get");

    if (isHttpGet) {
      url += `?${reportData}`;
    }

    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", contentType);
    xhr.send(reportData);
  }

  reportError(error: ErrorCombine) {
    const { contentType, method } = this._options.report;

    const pureData = this.getPureReportData(error);
    const isHttpGet = this._isMatchMethod(method, "get");

    let reportData: ReportData;

    if (isHttpGet || contentType === "application/x-www-form-urlencoded") {
      reportData = convertObjToUrlencoded(pureData);
    } else if (contentType === "application/form-data") {
      reportData = serialize(pureData);
    } else {
      reportData = stringify(pureData);
    }

    this.doReport(reportData);
  }

  reportErrors(errorList: ErrorList): void {
    if (!errorList.length) return;

    for (const error of errorList) {
      setTimeout(() => {
        this.reportError(error);
      }, 0);
    }
  }
}