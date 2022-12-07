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
    data.time = Date.now();
    data.globalData = this.globalData;

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