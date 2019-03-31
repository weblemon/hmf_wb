/// <reference types="react-scripts" />


declare module 'date-diff' {
    export declare class DateDiff {
        constructor(now: any, d: any) {}
        public seconds(): number; 
        public minutes(): number;
        public days(): number;
        public hours(): number;
    }

    export = DateDiff
}


class WxLogin {
    constructor(opts: WxLoginOptions) {}
}

interface WxLoginOptions {
  self_redirect?: boolean;
  id: string;
  appid: string;
  scope: string;
  redirect_uri: string;
  state?: string;
  style?: string;
  href?: string;
}

global.WxLogin = WxLogin;