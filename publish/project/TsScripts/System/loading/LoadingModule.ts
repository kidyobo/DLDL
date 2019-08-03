import { Macros } from "System/protocol/Macros";
import { EventDispatcher } from "System/EventDispatcher";
import { ErrorId } from "System/protocol/ErrorId";
import { Global as G } from "System/global";
import { UiElements } from "System/uilib/UiElements"
import { AndroidAssetLoader } from "../utils/AndroidAssetLoader";
export class LoadingModule extends EventDispatcher {
    private obj: UnityEngine.GameObject;
    private request: Game.RequestBase;
    private loadTimer: Game.Timer;
    private canvas: UnityEngine.Canvas;

    private progress: UnityEngine.UI.Slider;
    private text: UnityEngine.UI.Text;
    private _from: number = 0;
    private _to: number = 1;
    private _active: boolean = false;
    public get active() {
        return this._active;
    }
    public get from() {
        return this._from;
    }
    public get to() {
        return this._to;
    }

    private textUpdateCallback: () => void;

    private textTimer: Game.Timer = null;
    private background: UnityEngine.UI.RawImage = null;
    private defaultTexture: { texture: UnityEngine.Texture } = { texture: null };
    private nextPageAssetRequest: Game.AssetRequest = null;
    private nextPageAsset: Game.Asset = null;
    private oldID: number = -1;
    constructor() {
        super();
        this.obj = Game.ResLoader.LoadAsset("ui/LoadingView.prefab").GetLinkedGameObject("LoadingView");
        let elementMapper = this.obj.GetComponent(Game.ElementsMapper.GetType()) as Game.ElementsMapper;
        this.canvas = this.obj.GetComponent(UnityEngine.Canvas.GetType()) as UnityEngine.Canvas;
        let mapper = new UiElements(elementMapper);

        this.progress = mapper.getSlider("progress");
        this.text = mapper.getText("text");
        this.background = mapper.getRawImage("background");
        this.defaultTexture.texture = this.background.texture;
        if (AndroidAssetLoader.exists(AndroidAssetLoader.loadingPageAssetPath)) {
            AndroidAssetLoader.loadImage(AndroidAssetLoader.loadingPageAssetPath, this.defaultTexture, this.obj);
        }
        this.setProgressActive(false);
    }

    private getNewPage() {
        if (this.nextPageAssetRequest != null) {
            return;
        }
        //取出所有满足条件的配置
        let useageList = [];
        let list = G.Cfgmgr.getCfg('data/LoadingPageConfigM.json') as GameConfig.LoadingPageConfigM[];
        let roleLevel = G.DataMgr.heroData.level;
        let dateOver = G.SyncTime.getDateAfterStartServer();
        let date = G.SyncTime.getCurrentTime();
        for (let config of list) {
            if (roleLevel >= config.m_iLevelLimit) {
                if (config.m_iTimeLimit == 0 || (dateOver >= config.m_iTimeLimit)) {
                    if (config.m_szStartDate != "") {
                        let numStart = Date.parse(config.m_szStartDate);
                        if (config.m_szEndtDate != "") {
                            let numEnd = Date.parse(config.m_szEndtDate);
                            if (date >= numStart && date <= numEnd) {
                                useageList.push(config.m_iImageID);
                            }
                        }
                        else if (date >= numStart) {
                            useageList.push(config.m_iImageID);
                        }
                    }
                    else if (config.m_szEndtDate != "") {
                        let numEnd = Date.parse(config.m_szEndtDate);
                        if (date <= numEnd) {
                            useageList.push(config.m_iImageID);
                        }
                    }
                    else {
                        useageList.push(config.m_iImageID);
                    }
                }
            }
        }
        let loadID = -1;
        let len = useageList.length;

        if (len > 0) {
            if (len == 1) {
                loadID = useageList[0];
            }
            else {
                loadID = useageList[Math.floor(Math.random() * len)];
            }
        }
        if (loadID > 0 && this.oldID != loadID) {
            //if (this.nextPageAsset != null) {
            //    this.nextPageAsset.autoCollect = true;
            //    this.nextPageAsset = null;
            //}
            this.oldID = loadID;
            this.nextPageAssetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Low1, uts.format("images/loadingPage/{0}.png", loadID));
            Game.ResLoader.BeginAssetRequest(this.nextPageAssetRequest, delegate(this, this.onLoadNextPage));
        }
    }
    private onLoadNextPage(assetRequest: Game.AssetRequest) {
        this.nextPageAssetRequest = null;
        if (assetRequest.error != null) {
            uts.logWarning(assetRequest.error);
            return;
        }
        this.nextPageAsset = assetRequest.mainAsset;
        this.nextPageAsset.autoCollect = false;
    }

    hideProgress() {
        this.setProgressActive(false);
    }

    setActive(value: boolean, forceUseDefaultPage: boolean = false) {
        this._active = value;
        if (value) {
            if (this.nextPageAsset != null) {
                this.background.texture = this.nextPageAsset.texture;
            }
            else {
                this.background.texture = this.defaultTexture.texture;
            }

            if (forceUseDefaultPage) {
                this.background.texture = this.defaultTexture.texture;
            }
            else {
                this.getNewPage();
            }
        }

        this.obj.SetActive(value);

        if (value == true) {
            if (this.loadTimer != null)
                this.loadTimer.Stop();
            this.loadTimer = new Game.Timer("loadingmodule", 10, 0, delegate(this, this.update));
            this.progress.value = 0;
            this.setProgressActive(false);
        }
        else {
            this._from = 0;
            this.request = null;
            if (this.loadTimer != null)
                this.loadTimer.Stop();
            this.loadTimer = null;

            if (this.textTimer != null) {
                this.textTimer.Stop();
                this.textTimer = null;
            }
            this.setText('');
        }
    }

    enableRandomTip() {
        if (this.loadTimer == null || this.textTimer != null) {
            return;
        }
        this.textTimer = new Game.Timer("randomText", 5000, 0, delegate(this, this.onTimer));
        this.setText(G.DataMgr.guideTipData.getRandomString());
    }
    enableProgress() {
        this.progress.value = 1;
    }
    private onTimer(timer: Game.Timer) {
        this.setText(G.DataMgr.guideTipData.getRandomString());
    }

    linkCameraToUILayer(link: boolean) {
        if (link) {
            this.canvas.renderMode = UnityEngine.RenderMode.ScreenSpaceCamera;
            this.canvas.worldCamera = G.Uimgr.UICamera;
            this.canvas.sortingOrder = 20000;
        }
        else {
            this.canvas.renderMode = UnityEngine.RenderMode.ScreenSpaceOverlay;
            this.canvas.worldCamera = null;
        }
    }

    private update(timer: Game.Timer) {
        if (this.request != null) {
            let progress = this.request.progress;
            this.progress.value = this._from + progress * (this._to - this._from);
        }
        if (this.textUpdateCallback != null) {
            this.textUpdateCallback();
        }
    }

    public loadRequest(request: Game.AssetRequest, from: number, to: number, callback: (r: Game.RequestBase) => void, textUpdateCallback: () => void) {
        //安全锁，取消上一次的加载
        if (this.request != null) {
            this.request.Abort();
        }
        if (from >= 0) {
            this._from = from;
        }
        this._to = to;
        this.request = request;
        this.textUpdateCallback = textUpdateCallback;
        this.progress.value = this._from + this.request.progress * (this._to - this._from);
        this.setProgressActive(true);

        Game.ResLoader.BeginAssetRequest(request, delegate(this, this.onLoadOver, from, to, callback, textUpdateCallback));
    }
    private onLoadOver(request: Game.AssetRequest, from, to, callback, textUpdateCallback) {
        if (request.error != null) {
            uts.logWarning("资源加载：" + request.error);
            Game.FixedMessageBox.Show("资源加载失败，是否重试", delegate(this, this.onConfirmClick, request, from, to, callback, textUpdateCallback));
            return;
        }
        this.textUpdateCallback = null;
        callback(request);
    }
    private onConfirmClick(confirm: boolean, request, from, to, callback, textUpdateCallback) {
        if (confirm) {
            this.loadRequest(request, from, to, callback, textUpdateCallback);
        }
        else {
            UnityEngine.Application.Quit();
        }
    }

    public downloadRequest(request: Game.DownloadRequest, from: number, to: number, callback: (r: Game.RequestBase) => void, textUpdateCallback: () => void) {
        //安全锁，取消上一次的加载
        if (this.request != null) {
            this.request.Abort();
        }
        this._from = from;
        this._to = to;
        this.request = request;
        this.textUpdateCallback = textUpdateCallback;
        this.progress.value = this._from + this.request.progress * (this._to - this._from);
        this.setProgressActive(true);

        Game.ResLoader.BeginDownloadRequest(request, delegate(this, this.onDownloadOver, from, to, callback, textUpdateCallback));
    }
    private onDownloadOver(request: Game.AssetRequest, from, to, callback, textUpdateCallback) {
        if (request.error != null) {
            uts.logWarning("资源加载：" + request.error);
            Game.FixedMessageBox.Show("资源加载失败，是否重试", delegate(this, this.onConfirmClick2, request, from, to, callback, textUpdateCallback));
            return;
        }
        this.textUpdateCallback = null;
        callback(request);
    }
    private onConfirmClick2(confirm: boolean, request, from, to, callback, textUpdateCallback) {
        if (confirm) {
            this.downloadRequest(request, from, to, callback, textUpdateCallback);
        }
        else {
            UnityEngine.Application.Quit();
        }
    }

    public setText(text: string) {
        this.text.text = text;
    }

    private setProgressActive(active: boolean = true) {
        active = G.IsIOSPlatForm ? false : active;
        this.progress.gameObject.SetActive(active);
    }

}
export default LoadingModule;