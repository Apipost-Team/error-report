declare enum TrackerEvents {
    jsError = "jsError",
    unHandleRejection = "unHandleRejection",
    resourceError = "resourceError",
    reqError = "reqError",
    batchErrors = "batchErrors",
    event = "event",
    _console = "_console",
    _onConsoleTrack = "_onConsoleTrack",
    _offConsoleTrack = "_offConsoleTrack",
    _initOptions = "_initOptions",
    _globalDataChange = "_globalDataChange"
}
declare enum ErrorType {
    jsError = "jsError",
    unHandleRejectionError = "unHandleRejectionError",
    resourceError = "resourceError",
    httpRequestError = "httpError"
}
interface BaseError {
    errorType: ErrorType;
    url?: string | undefined;
    path?: string | undefined;
    hash: number;
    time: number;
}

declare class ErrorObserver extends BaseObserver {
    _options: any;
    constructor(options: ITrackerOptions);
    init(): void;
}

type ErrorList = Array<ErrorCombine>;
interface IReportParams {
    errorList: ErrorList;
}
type ReportData = string | FormData;
declare class Reporter {
    private _options;
    constructor(options: ITrackerOptions);
    private _isMatchMethod;
    private getPureReportData;
    doReport(reportData: ReportData): void;
    reportError(error: ErrorCombine): void;
    reportErrors(errorList: ErrorList): void;
}

type ErrorCombine = IError | IUnHandleRejectionError;
interface IErrorOptions {
    watch: boolean;
    repeat: number;
    delay: number;
}
interface IHttpOptions {
    fetch: boolean;
    ajax: boolean;
}
declare enum ConsoleType {
    log = "log",
    error = "error",
    warn = "warn",
    info = "info",
    debug = "debug"
}
interface IRrwebOption {
    watch: boolean;
    queueLimit: number;
    delay: number;
}
type IData = Record<string | number | symbol, unknown>;
interface ReportOptions {
    url: string;
    method?: string;
    contentType?: string;
}
interface ITrackerOptions {
    error: IErrorOptions;
    data: IData;
    report: Partial<ReportOptions>;
}
type PlainObject = Record<string | number | symbol, unknown>;
type AppVersion = {
    appVersion: string;
    gitHash: string;
};
type EventName = string | symbol;
declare const defaultTrackerOptions: {
    report: {
        url: string;
        method: string;
        contentType: string;
    };
    data: {};
    error: {
        watch: boolean;
        repeat: number;
        delay: number;
    };
};
declare class Monitor {
    static instance: Monitor;
    errObserver: ErrorObserver;
    reporter: Reporter;
    private readonly defaultOptions;
    $options: ITrackerOptions;
    $data: IData;
    constructor(options: Partial<ITrackerOptions | undefined>, appVersion?: Partial<AppVersion> | undefined);
    /**
     *
     * 初始化单例模式
    */
    static init(options?: Partial<ITrackerOptions> | undefined, appVersion?: Partial<AppVersion> | undefined): Monitor;
    initInstances(): void;
    initOptions(options: Partial<ITrackerOptions | undefined>): void;
    getDevice(): void;
    getUserAgent(): void;
    getAppVesionInfo(appVersion: Partial<AppVersion>): void;
    configData(key: string, value: unknown, deepmerge?: boolean): Monitor;
    configData(options: PlainObject, deepmerge?: boolean): Monitor;
    private _on;
    on(event: EventName | Array<EventName>, listener: (...args: any[]) => void): Monitor;
}

interface IError extends BaseError {
    msg: string;
    line: number | undefined;
    column: number | undefined;
    stackTrace: string;
    hash: number;
    time: number;
}
interface IUnHandleRejectionError extends BaseError {
    msg: string;
    hash: number;
    time: number;
}
interface ICacheError {
    [errorMsg: string]: number;
}
declare class BaseObserver {
    options: any;
    cacheError: ICacheError;
    constructor(options: ITrackerOptions);
    /**
     * 发送同样的错误不超过重复的次数，防止一直循环
     *
    */
    safeEmitError(cacheKey: string, errorType: string, errorObj: IError | BaseError | IUnHandleRejectionError): void;
}

export { AppVersion, BaseError, BaseObserver, ConsoleType, ErrorCombine, ErrorList, ErrorObserver, ErrorType, EventName, ICacheError, IData, IError, IErrorOptions, IHttpOptions, IReportParams, IRrwebOption, ITrackerOptions, IUnHandleRejectionError, Monitor, PlainObject, ReportData, ReportOptions, Reporter, TrackerEvents, defaultTrackerOptions };
