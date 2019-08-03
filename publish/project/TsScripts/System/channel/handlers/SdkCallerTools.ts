import { JavaCaller } from "System/utils/JavaCaller";
import { Global as G } from "System/global";

export abstract class SdkCaller {
    abstract start();
    abstract destory();
    abstract initSdk();
    abstract doLogin();
    abstract doLoginOut();
    abstract doPay(params: string, payinfo: string);
    abstract reportData(params: string);
    abstract sdkIsInit(): boolean;
    abstract sdkIsLogined(): boolean;
    abstract exit();
    abstract isShowExitDialog(): boolean;
    abstract getChannelId(): string;
    abstract hasLogout(): boolean;
    abstract showGameCenter(): void;
    abstract hasGameCenter(): boolean;
}

export class WindowsSdkCaller extends SdkCaller {
    start(){}
    destory(){}
    initSdk(){}
    doLogin(){}
    doLoginOut(){}
    doPay(params: string, payinfo: string){}
    reportData(params: string){}
    sdkIsInit(): boolean{return false;}
    sdkIsLogined(): boolean{return false;}
    exit(){}
    isShowExitDialog(): boolean{return false;}
    getChannelId(): string {return '0';}
    hasLogout(): boolean {return false;}
    showGameCenter() {}
    hasGameCenter(): boolean {return false;}
}

export class AndroidSdkCaller extends SdkCaller {
    start() {
        JavaCaller.callRetInt('startGame');
    }
    destory() {
        JavaCaller.callRetInt('destoryGame');
    }
    initSdk() {
        JavaCaller.callRetInt('initSdk', '{}');
    }
    doLogin() {
        JavaCaller.callRetInt('doLogin');
    }
    doLoginOut() {
        JavaCaller.callRetInt('doLogout');
    }
    doPay(params: string, payinfo: string) {
        if (payinfo == null) {
            let has = JavaCaller.callRetString('invokeByMethodName', 'hasGetPayType', '{}', true);
            if (has == 'true') {
                JavaCaller.callRetInt('getPayType', params);
            } else {
                JavaCaller.callRetInt('doPay', params);
            }
        } else {
            let info = decodeURIComponent(payinfo);
            uts.log("payinfo:= " + JSON.stringify(info));
            JavaCaller.callRetInt('doPay', info);
        }
    }
    reportData(params: string) {
        JavaCaller.callRetInt('dataReport', params);
    }
    sdkIsInit(): boolean {
        return JavaCaller.callRetBoolean("isInited");
    }
    sdkIsLogined(): boolean {
        return JavaCaller.callRetBoolean('isLogined');
    }
    exit() {
        JavaCaller.callRetInt('exit');
    }
    isShowExitDialog(): boolean {
        return JavaCaller.callRetBoolean('isShowExitDialog');
    }
    getChannelId(): string {
        return JavaCaller.callRetString('getChannelId');
    }
    hasLogout(): boolean {
        return JavaCaller.callRetBoolean('hasLogout');
    }
    showGameCenter(): void {
        JavaCaller.callRetString('invokeByMethodName', 'showGameCenter', '{}', false);
    }
    hasGameCenter(): boolean {
        let rt = JavaCaller.callRetString('invokeByMethodName', 'hasGameCenter', '{}', true);
        return rt == 'true';
    }
}

export class IosSdkCaller extends SdkCaller {
    start() { }
    destory() { }
    exit() { }
    isShowExitDialog(): boolean { return false }
    initSdk() {
        Game.IosSdk.IosCallSDkFunc("initSdk", '');
    }
    doLogin() {
        Game.IosSdk.IosCallSDkFunc('doLogin', '');
    }
    doLoginOut() {
        Game.IosSdk.IosCallSDkFunc("doLogout", '');
    }
    doPay(params: string, payinfo: string) {
        if (payinfo == null) {
            Game.IosSdk.IosCallSDkFunc("doPay", params);
        } else {
            let info = decodeURIComponent(payinfo);
            uts.log("payinfo:= " + JSON.stringify(info));
            let json = JSON.parse(info);
            let payUrl = json.pay_url;
            uts.log("payurl:= " + payUrl);
            UnityEngine.Application.OpenURL(payUrl);
        }
    }
    reportData(params: string) {
        Game.IosSdk.IosCallSDkFunc("reportData", params);
    }
    sdkIsInit(): boolean {
        return Game.IosSdk.IosCallStringBySDK('isInited') == 'yes';
    }
    sdkIsLogined(): boolean {
        return Game.IosSdk.IosCallStringBySDK('isLogined') == 'yes';
    }
    getChannelId(): string {
        return Game.IosSdk.IosCallStringBySDK('getChannelId');
    }
    hasLogout(): boolean {
        return false;
    }
    showGameCenter(): void {
    }
    hasGameCenter(): boolean {
        return false;
    }
}

