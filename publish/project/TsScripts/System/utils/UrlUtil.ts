import { SafeJson } from "./SafeJson";
import { LoadingModule } from "../loading/LoadingModule";

class LoadTextFromUrlNode {
    private url: string;
    private callback: (error: string, content: string) => void;
    private timeoutS: number;
    private timer: Game.Timer;
    private postData: string;
    load(url: string, callback: (error: string, content: string) => void, timeoutS: number, postData: string = null) {
        this.url = url;
        this.callback = callback;
        this.timeoutS = timeoutS;
        this.timer = new Game.Timer('loadtextfromurl', this.timeoutS * 1000, 1, delegate(this, this.onTimeOut));
        this.postData = postData;
        if (this.postData == null) {
            Game.ResLoader.LoadTextFromFullUrl(this.url, delegate(this, this.onLoad));
        }
        else {
            Game.ResLoader.LoadTextFromFullUrlByPost(this.url, this.postData, delegate(this, this.onLoad));
        }
    }
    private onTimeOut(timer) {
        this.callback("timeout", "");
    }
    private onLoad(error, content) {
        if (!this.timer.Dead) {
            this.timer.Stop();
            error = (error == '') ? null : error;
            this.callback(error, content);
        }
    }
}

class LoadJsonFromUrlNode {
    private urls: string[];
    private callback: (error: string, jsondata: any) => void;
    private timeoutS: number;
    private trytimes: number;
    private firstLoad: boolean;
    load(url: string, callback: (error: string, jsondata: any) => void, timeoutS: number, trytimes: number) {
        this.loads([url, url], callback, timeoutS, trytimes);
    }
    loads(urls: string[], callback: (error: string, jsondata: any) => void, timeoutS: number, trytimes: number) {
        this.urls = urls;
        this.callback = callback;
        this.timeoutS = timeoutS;
        this.trytimes = trytimes;
        this.firstLoad = true;
        this.startLoad();
    }
    private startLoad() {
        UrlUtil.loadTextFromFullUrl(this.randomUrl, delegate(this, this.onLoad), this.timeoutS);
    }
    private get randomUrl(): string {
        if (this.firstLoad) {
            this.firstLoad = false;
            return this.urls[0];
        }
        let index = Math.floor((this.urls.length - 1) * Math.random());
        return this.urls[index + 1];
    }
    private onLoad(error: string, content: string) {
        let jsondata = SafeJson.parse(content);
        if (error != null || jsondata == null) {
            if ((--this.trytimes) > 0) {
                this.startLoad();
            }
            else {
                if (error != null) this.callback(error, content);
                else this.callback('invalid json format', content);
            }
            return;
        }
        this.callback(null, jsondata);
    }
}

export class UrlUtil {
    public static Combineurl(...parts): string {
        let url = "";
        for (let i = 0; i < parts.length - 1; i++) {
            let p: string = parts[i];
            url = url + p;
            if (url.indexOf("/") != (url.length - 1)) {
                url = url + "/";
            }
        }
        url = url + parts[parts.length - 1];
        return url;
    }

    public static loadTextFromFullUrl(url: string, callback: (error: string, content: string) => void, timeoutS: number, postData: string = null) {
        new LoadTextFromUrlNode().load(url, callback, timeoutS, postData);
    }

    public static loadJsonFromUrl(url: string, callback: (error: string, jsondata: any) => void, timeoutS: number, maxtrytimes: number) {
        new LoadJsonFromUrlNode().load(url, callback, timeoutS, maxtrytimes);
    }

    //首次使用urls[0]来进行连接，如果连接失败则从urls[1-n)随机一个进行连接
    public static loadJsonFromUrls(urls: string[], callback: (error: string, jsondata: any) => void, timeoutS: number, maxtrytimes: number) {
        new LoadJsonFromUrlNode().loads(urls, callback, timeoutS, maxtrytimes);
    }
}