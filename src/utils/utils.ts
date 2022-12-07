import MobileDetect from "mobile-detect";

export function isObject(input: any): boolean {
  return Object.prototype.toString.call(input) === "[object Object]";
}

export function getPageUrl(): string {
  return window.location.href;
}
export function convertObjToUrlencoded(obj: {
  [key: string]: any;
}): string {
  return new URLSearchParams(Object.entries(obj)).toString();
}


export interface IDeviceInfo {
  mobile: string | null;
  phone: string | null;
  tablet: string | null;
  userAgent: string;
  isPhone: boolean;
  version: number;
  screenW: number;
  screenH: number;
  dpr: number;
}

export function getDeviceInfo(): IDeviceInfo {
  const md = new MobileDetect(window.navigator.userAgent);

  return {
    mobile: md.mobile(),
    phone: md.phone(),
    tablet: md.tablet(),
    userAgent: md.userAgent(),
    isPhone: md.is("iPhone"),
    version: md.version("Webkit"),
    dpr: window.devicePixelRatio,
    screenW: document.documentElement.clientWidth || document.body.clientWidth,
    screenH: document.documentElement.clientHeight || document.body.clientHeight
  };
}