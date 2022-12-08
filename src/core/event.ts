import EventEmitter from 'events';
import { TrackerEvents } from '../types';
import { getPageUrl, isObject } from '../utils/utils';


export class Emitter extends EventEmitter {
  private globalData: any;

  constructor() {
    super();
    this.init();
  }

  public customEmit(event: string | symbol, ...args: any[]): boolean {
    const [data, ...rest] = args;

    if (!isObject(data)) {
      return super.emit(event, ...args);
    }

    if (typeof data.beforeEmit === "function") {
      data.beforeEmit.call(this, data);
      Reflect.deleteProperty(data, "beforeEmit");
    }
    super.emit(TrackerEvents.event, event, data, ...rest);
    return super.emit(event, data, ...rest);
  }

  private decorateData(data: any) {
    data.globalData = this.globalData;
    data.appVersion = this.globalData.appVersion || '';
    data.gitHash = this.globalData.gitHash || '';

    Reflect.deleteProperty(this.globalData, "appVersion");
    Reflect.deleteProperty(this.globalData, "gitHash");

    Reflect.deleteProperty(data.globalData, "appVersion");
    Reflect.deleteProperty(data.globalData, "gitHash");

    data.os = this.globalData._deviceInfo.os;
    Reflect.deleteProperty(data.globalData._deviceInfo, "os");
    Reflect.deleteProperty(this.globalData._deviceInfo, "os");

    if (!data.title) {
      data.title = document.title;
    }

    if (!data.url) {
      data.url = getPageUrl();
    }


  }

  public emitWithGlobalData(event: string | symbol, ...args: any[]): boolean {
    const [data, ...rest] = args;
    return this.customEmit(
      event,
      {
        ...data,
        beforeEmit: (data: any) => {
          this.decorateData(data);
        }
      },
      ...rest
    );
  }

  init() {
    this.globalData = {};
    super.on(TrackerEvents._globalDataChange, (globalData) => {
      this.globalData = globalData;
    });
  }
}

export const myEmitter = new Emitter() as any;