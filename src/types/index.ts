
export enum TrackerEvents {
  /* SDK expose events */
  jsError = "jsError",
  unHandleRejection = "unHandleRejection",
  resourceError = "resourceError",
  reqError = "reqError",
  batchErrors = "batchErrors",

  event = "event",

  /* SDK inner events */
  _console = "_console",
  _onConsoleTrack = "_onConsoleTrack",
  _offConsoleTrack = "_offConsoleTrack",
  _initOptions = "_initOptions",
  _globalDataChange = "_globalDataChange"
}

export enum ErrorType {
  jsError = "jsError",
  unHandleRejectionError = "unHandleRejectionError",
  resourceError = "resourceError",
  httpRequestError = "httpError"
}

export interface BaseError {
  errorType: ErrorType;
  url?: string | undefined;
  path?: string | undefined;
}