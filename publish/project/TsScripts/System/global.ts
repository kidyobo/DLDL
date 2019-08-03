import { UIManager } from "System/uilib/UIManager"
import { MessageBox } from "System/uilib/MessageBox"
import { CommonForm } from "System/uilib/CommonForm"
import { MapManager } from "System/map/mapmanager"
import { MapCameraSetting } from "System/map/mapCameraSetting"
import { ConfigManager } from "System/data/configmanager"
import { DRManager } from "System/protocol/DRManager"
import { DataManager } from "System/data/datamanager"
import { ModuleManager } from "System/ModuleManager"
import { MaterialManager } from 'System/MaterialManager'
import { ShaderManager } from 'System/ShaderManager'
import { UnitManager } from 'System/unit/UnitManager'
import { TipManager } from "System/tip/TipManager"
import { MapCamera } from "System/map/MapCamera"
import { ResourceManager } from "System/res/ResourceManager"
import { AssistBattleHelper } from "System/skill/AssistBattleHelper"
import { ActionHandler } from 'System/ActionHandler'
import { SyncTime } from 'System/net/SyncTime'
import { GuideMgr } from 'System/guide/GuideMgr'
import { MainFuncsCtrl } from 'System/main/MainFuncsCtrl'
import { ActBtnController } from 'System/main/ActBtnController'
import { NoticeCtrl } from 'System/main/view/NoticeCtrl'
import { AnimationState } from "System/unit/AnimationState"
import { AudioManager } from 'System/audio/AudioManager'
import { XiYouServerData, CommonServerData, ServerData } from 'System/data/ServerData'
import { ViewCacher } from 'System/ViewCacher'
import { ChannelSDK, AppConfig } from 'System/channel/ChannelSDK'
import { XiyouChannelId } from 'System/channel/handlers/xiyou/XiyouPlatHandler'
import { LoadingAnimPlayer } from 'System/LoadingAnimPlayer'
import { VideoPlayer } from 'System/VideoPlayer'
import { ScreenScaleManger } from 'System/uilib/ScreenScaleManger'
import { SdkCaller, AndroidSdkCaller, IosSdkCaller, WindowsSdkCaller } from "System/channel/handlers/SdkCallerTools"
import { AltasManager } from 'System/AltasManager'
import { UnitSelectEffectPlayer } from 'System/unit/UnitSelectEffectPlayer'
export class Global {
    //缓存用的V2
    private static _cacheVec2: UnityEngine.Vector2 = new UnityEngine.Vector2(0, 0);
    //缓存用的V3
    private static _cacheVec3: UnityEngine.Vector3 = new UnityEngine.Vector3(0, 0, 0);
    private static _cacheVec4: UnityEngine.Vector4 = new UnityEngine.Vector4(0, 0, 0);
    private static _cacheColor: UnityEngine.Color = new UnityEngine.Color(0, 0, 0, 0);
    public static get cacheVec2() {
        return this._cacheVec2;
    }
    public static get cacheVec3() {
        return this._cacheVec3;
    }
    public static get cacheColor() {
        return this._cacheColor;
    }
    private static _one: UnityEngine.Vector3 = new UnityEngine.Vector3(1, 1, 1);
    public static get one() {
        return this._one;
    }
    private static _zero: UnityEngine.Vector3 = new UnityEngine.Vector3(0, 0, 0);
    public static get zero() {
        return this._zero;
    }
    public static getCacheV2(x: number, y: number): UnityEngine.Vector2 {
        this._cacheVec2.Set(x, y);
        return this._cacheVec2;
    }
    public static getCacheV3(x: number, y: number, z: number): UnityEngine.Vector3 {
        this._cacheVec3.Set(x, y, z);
        return this._cacheVec3;
    }
    public static getCacheV4(x: number, y: number, z: number, a: number=0): UnityEngine.Vector4 {
        this._cacheVec4.Set(x, y, z, a);
        return this._cacheVec4;
    }
    public static getCacheColor(r: number, g: number, b: number, a: number): UnityEngine.Color {
        this._cacheColor.r = r;
        this._cacheColor.g = r;
        this._cacheColor.b = r;
        this._cacheColor.a = r;
        return this._cacheColor;
    }
    private static effectRootObj: UnityEngine.GameObject = null;
    private static root: UnityEngine.GameObject = null;
    private static moveRoot: UnityEngine.GameObject = null;
    private static appConfig: AppConfig = null;
    private static effectRoot: UnityEngine.Transform = null;
    private static uimgr: UIManager = null;
    private static mapmgr: MapManager = null;
    private static cfgmgr: ConfigManager = null;
    private static drmgr: DRManager = null;
    public static DataMgr: DataManager = new DataManager();
    public static ModuleMgr: ModuleManager = new ModuleManager();
    private static materialMgr: MaterialManager = null;
    private static shaderlMgr: ShaderManager = null;
    private static cameraSetting: MapCameraSetting = null;
    private static mapCamera: MapCamera = null;
    private static tipMgr: TipManager = null;
    private static resourceMgr: ResourceManager = null;
    private static battleHelper: AssistBattleHelper = null;
    private static actionHandler: ActionHandler = null;
    private static syncTime: SyncTime = null;
    private static guideMgr: GuideMgr = null;
    private static animationState: AnimationState = null;
    private static mainBtnCtrl: MainFuncsCtrl = null;
    private static actBtnCtrl: ActBtnController = null;
    private static noticeCtrl: NoticeCtrl = null;
    private static audioManager: AudioManager = null;
    private static channelSDK: ChannelSDK = null;
    private static serverData: ServerData = null;
    private static viewCacher: ViewCacher = null;
    private static loadingAnimPlayer: LoadingAnimPlayer = null;
    private static videoPlayer: VideoPlayer = null;
    public static UnitMgr: UnitManager = new UnitManager();
    private static screenScaleManger: ScreenScaleManger = null;
    private static sdkCaller: SdkCaller = null;


    static get SdkCaller(): SdkCaller {
        if (this.sdkCaller == null) {
            if (this.isAndroidPlatForm) {
                this.sdkCaller = new AndroidSdkCaller();
            }
            else if (this.isIOSPlatForm) {
                this.sdkCaller = new IosSdkCaller();
            } 
            else if (this.isWindowsPlatForm) {
                this.sdkCaller = new WindowsSdkCaller();
            }
        }
        return this.sdkCaller;
    }
    private static altasManager: AltasManager = null;

    static get ScreenScaleMgr(): ScreenScaleManger {
        if (this.screenScaleManger == null) {
            this.screenScaleManger = new ScreenScaleManger();
        }
        return this.screenScaleManger;
    }
    static get AltasManager(): AltasManager {
        if (this.altasManager == null) {
            this.altasManager = new AltasManager();
        }
        return this.altasManager;
    }
    static get LoadingAnimPlayer(): LoadingAnimPlayer {
        if (this.loadingAnimPlayer == null)
            this.loadingAnimPlayer = new LoadingAnimPlayer();
        return this.loadingAnimPlayer;
    }

    static get VideoPlayer(): VideoPlayer {
        if (this.videoPlayer == null)
            this.videoPlayer = new VideoPlayer();
        return this.videoPlayer;
    }

    static get AppCfg(): AppConfig {
        if (this.appConfig == null)
            this.appConfig = new AppConfig();
        return this.appConfig;
    }

    static get Uimgr(): UIManager {
        if (this.uimgr == null)
            this.uimgr = new UIManager();
        return this.uimgr;
    }
    static get Mapmgr(): MapManager {
        if (this.mapmgr == null)
            this.mapmgr = new MapManager();
        return this.mapmgr;
    }
    static get Cfgmgr(): ConfigManager {
        if (this.cfgmgr == null)
            this.cfgmgr = new ConfigManager();
        return this.cfgmgr;
    }
    static get Dr(): DRManager {
        if (this.drmgr == null)
            this.drmgr = new DRManager();
        return this.drmgr;
    }
    //static get DataMgr(): DataManager {
    //    if (this.dataMgr == null)
    //        this.dataMgr = new DataManager();
    //    return this.dataMgr;
    //}
    //static get ModuleMgr(): ModuleManager {
    //    if (this.moduleMgr == null) {
    //        this.moduleMgr = new ModuleManager();
    //    }
    //    return this.moduleMgr;
    //}
    static get TipMgr(): TipManager {
        if (this.tipMgr == null)
            this.tipMgr = new TipManager();
        return this.tipMgr;
    }
    static get ResourceMgr(): ResourceManager {
        if (this.resourceMgr == null)
            this.resourceMgr = new ResourceManager();
        return this.resourceMgr;
    }
    static get MaterialMgr(): MaterialManager {
        if (this.materialMgr == null)
            this.materialMgr = new MaterialManager();
        return this.materialMgr;
    }
    static get ShaderMgr(): ShaderManager {
        if (this.shaderlMgr == null)
            this.shaderlMgr = new ShaderManager();
        return this.shaderlMgr;
    }
    //static get UnitMgr(): UnitManager {
    //    if (this.unitMgr == null)
    //        this.unitMgr = new UnitManager();
    //    return this.unitMgr;
    //}
    static get MapCamera(): MapCamera {
        if (this.mapCamera == null)
            this.mapCamera = new MapCamera(this.getMainCamera());
        return this.mapCamera;
    }
    static get CameraSetting(): MapCameraSetting {
        if (this.cameraSetting == null)
            this.cameraSetting = new MapCameraSetting();
        return this.cameraSetting;
    }
    static get BattleHelper(): AssistBattleHelper {
        if (this.battleHelper == null)
            this.battleHelper = new AssistBattleHelper();
        return this.battleHelper;
    }
    static get ActionHandler(): ActionHandler {
        if (this.actionHandler == null)
            this.actionHandler = new ActionHandler();
        return this.actionHandler;
    }
    static get SyncTime(): SyncTime {
        if (this.syncTime == null)
            this.syncTime = new SyncTime();
        return this.syncTime;
    }
    static get GuideMgr(): GuideMgr {
        if (this.guideMgr == null)
            this.guideMgr = new GuideMgr();
        return this.guideMgr;
    }
    static get MainBtnCtrl(): MainFuncsCtrl {
        if (this.mainBtnCtrl == null)
            this.mainBtnCtrl = new MainFuncsCtrl();
        return this.mainBtnCtrl;
    }
    static get ActBtnCtrl(): ActBtnController {
        if (this.actBtnCtrl == null)
            this.actBtnCtrl = new ActBtnController();
        return this.actBtnCtrl;
    }
    static get NoticeCtrl(): NoticeCtrl {
        if (this.noticeCtrl == null)
            this.noticeCtrl = new NoticeCtrl();
        return this.noticeCtrl;
    }

    static get AnimationStateMgr(): AnimationState {
        if (this.animationState == null)
            this.animationState = new AnimationState();
        return this.animationState;
    }

    static get Root(): UnityEngine.GameObject {
        if (this.root == null)
            this.root = UnityEngine.GameObject.Find("Root");
        return this.root;
    }

    static get MoveRoot(): UnityEngine.GameObject {
        if (this.moveRoot == null)
            this.moveRoot = UnityEngine.GameObject.Find("MoveRoot");
        return this.moveRoot;
    }
    static get EffectRootObj(): UnityEngine.GameObject {
        if (this.effectRootObj == null) {
            let obj = new UnityEngine.GameObject("EffectRoot");
            this.effectRootObj = obj;
            Game.DonotDestroyManager.Add(obj);
        }
        return this.effectRootObj;
    }
    static get EffectRoot(): UnityEngine.Transform {
        if (this.effectRoot == null) {
            let obj = this.EffectRootObj;
            this.effectRoot = obj.transform;
            this.effectRoot.position = this.getCacheV3(0, 0.001, 0);
        }
        return this.effectRoot;
    }
    static get AudioMgr(): AudioManager {
        if (this.audioManager == null)
            this.audioManager = new AudioManager();
        return this.audioManager;
    }
    static get ChannelSDK(): ChannelSDK {
        if (this.channelSDK == null)
            this.channelSDK = new ChannelSDK();
        return this.channelSDK;
    }
    private static isEditor = UnityEngine.Application.platform == UnityEngine.RuntimePlatform.WindowsEditor;
    static get IsEditor(): boolean {
        return this.isEditor;
    }
    private static isAndroidPlatForm = UnityEngine.Application.platform == UnityEngine.RuntimePlatform.Android;
    static get IsAndroidPlatForm(): boolean {
        return this.isAndroidPlatForm;
    }
    private static isIOSPlatForm = UnityEngine.Application.platform == UnityEngine.RuntimePlatform.IPhonePlayer;
    static get IsIOSPlatForm(): boolean {
        return this.isIOSPlatForm;
    }
    private static isWindowsPlatForm = UnityEngine.Application.platform == UnityEngine.RuntimePlatform.WindowsPlayer;
    static get IsWindowsPlatForm(): boolean {
        return this.isWindowsPlatForm;
    }
    static get isXiYouPlatForm(): boolean {
        let currentChannelId: number = 0;
        currentChannelId = Number(this.ChannelSDK.ChannelID);
        if (this.DataMgr.systemData.ossTestPlatId != 0) {
            currentChannelId = Number(this.DataMgr.systemData.ossTestChannel);
        }
        return (currentChannelId == XiyouChannelId.XIYOU || currentChannelId == XiyouChannelId.IOS);
    }

    static get IsXiYouMaiLiangPlat(): boolean {
        let currentChannelId = Number(this.ChannelSDK.ChannelID);
        if (currentChannelId == XiyouChannelId.XIYOU) {
            return true;
        } else {
            return false;
        }
    }

    static get IsIosPlat(): boolean {
        let currentChannelId = Number(this.ChannelSDK.ChannelID);
        if (currentChannelId == XiyouChannelId.IOS) {
            return true;
        } else {
            return false;
        }
    }
    static get needShowCustomQQ(): boolean {
        let plat = this.AppCfg.Plat;
        let customChannel = this.ChannelSDK.ChannelID;
        let str = this.DataMgr.systemData.getCustomQQStr(plat, customChannel);
        return str != '';
    }
    static get IsWifi(): boolean {
        return UnityEngine.Application.internetReachability == UnityEngine.NetworkReachability.ReachableViaLocalAreaNetwork;
    }
    static get ServerData(): ServerData {
        if (this.serverData == null) {
            if (this.channelSDK.serVerListFromSdk()) {
                this.serverData = new XiYouServerData();
            } else {
                this.serverData = new CommonServerData();
            }
        }
        return this.serverData;
    }
    /**是ios提审环境*/
    static get IsIosTiShenEnv(): boolean {
        return Global.channelSDK == null ? false : Global.ServerData.isIosTiShenEnv;
    }
    static get ViewCacher(): ViewCacher {
        if (this.viewCacher == null)
            this.viewCacher = new ViewCacher();
        return this.viewCacher;
    }

    static addUIRaycaster(gameObject: UnityEngine.GameObject) {
        if (Game.Tools.AddUIRaycaster) {
            Game.Tools.AddUIRaycaster(gameObject);
        }
        else {
            let image = gameObject.AddComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
            image.color = Global.getCacheColor(0, 0, 0, 0);
        }
    }

    private static rangeLoader: Game.RangeLoader;
    static addToRangeLoader(onChange: (b: boolean) => void, pos: UnityEngine.Vector3, checkRangeX: number, checkRangeY: number, url: string = null) {
        if (Game.RangeLoader) {
            if (!this.rangeLoader) {
                this.rangeLoader = this.root.AddComponent(Game.RangeLoader.GetType()) as Game.RangeLoader;
            }
            return this.rangeLoader.Add(onChange, pos, checkRangeX, checkRangeY, url);
        }
        else {
            onChange(true);
            return 0;
        }
    }
    static RemoveRangeLoader(dicKey: number) {
        if (Game.RangeLoader) {
            if (this.rangeLoader) {
                this.rangeLoader.Remove(dicKey);
            }
        }
    }
    static clearRangeLoader() {
        if (Game.RangeLoader) {
            if (this.rangeLoader) {
                this.rangeLoader.Clear();
            }
        }
    }

    static setRangeLoaderListener(listener: UnityEngine.Transform) {
        if (Game.RangeLoader) {
            if (!this.rangeLoader) {
                this.rangeLoader = this.root.AddComponent(Game.RangeLoader.GetType()) as Game.RangeLoader;
            }
            this.rangeLoader.listener = listener;
        }
    }

    static reloadGame(clearAssets: boolean = true) {
        Game.Invoker.BeginInvoke(this.Root, "reloadGame", 0, delegate(this, this.onReloadGame, clearAssets));
    }
    private static onReloadGame(clearAssets: boolean) {
        Game.DonotDestroyManager.Clear();
        //重启ts脚本逻辑
        if (Global.ModuleMgr.loadingModule != null) {
            Global.ModuleMgr.loadingModule.linkCameraToUILayer(false);
            Global.ModuleMgr.loadingModule.setText(this.DataMgr.guideTipData.getRandomString());
            Global.ModuleMgr.loadingModule.setActive(true, true);
        }
        Game.ResLoader.clearAllAssetsOnLoad = clearAssets;
        Game.Tools.ChangeScene("root");
    }

    static get csVersion() {
        if (Game.Tools.version) {
            return Game.Tools.version;
        }
        return 0;
    }
    static getDataSizeString(dataSize: number): string {
        let size = "";
        if (dataSize > 1024 * 1024) {
            size = (dataSize / (1024 * 1024)).toFixed(1) + "MB";
        }
        else if (dataSize > 1024) {
            size = (dataSize / 1024).toFixed(1) + "KB";
        } else {
            size = dataSize + "B";
        }
        return size;
    }
    static mapHeight: number = 0;
    static serverPixelXToLocalPositionX(x: number): number {
        return x / 20;
    }
    static localPositionXToServerPixelX(x: number): number {
        return Math.floor(x * 20 + 0.001);
    }
    static serverPixelYToLocalPositionY(y: number): number {
        return (this.mapHeight - y) / 20;
    }
    static localPositionYToServerPixelY(y: number): number {
        return this.mapHeight - Math.round(y * 20);
    }
    static serverPixelUnitToLocalPositionUnit(value: number): number {
        return value / 20;
    }
    static localPositionUnitToServerPixelUnit(value: number): number {
        return Math.round(value * 20);
    }
    static serverPixelToLocalPosition(x: number, y: number): UnityEngine.Vector3 {
        return new UnityEngine.Vector3(this.serverPixelXToLocalPositionX(x), 0, this.serverPixelYToLocalPositionY(y));
    }
    static localPositionToServerPixel(pos: UnityEngine.Vector3): UnityEngine.Vector2 {
        return new UnityEngine.Vector2(this.localPositionXToServerPixelX(pos.x), this.localPositionYToServerPixelY(pos.z));
    }
    public static cacheV3List: UnityEngine.Vector3[] = [];
    static noatttest: boolean = true;
    public static originWidth = 0;
    public static orginHeight = 0;
    public static protectedWidth = 0;
    public static protectedHeight = 0;
    public static freecamera: boolean = false;
    private static curves = {};
    public static getCurve(name: string): UnityEngine.AnimationCurve {
        if (this.IsEditor) {
            return Game.AnimationCurveList.GetCurve(name);
        }
        else {
            let curve = this.curves[name];
            if (!curve) {
                curve = this.curves[name] = Game.AnimationCurveList.GetCurve(name);
            }
            return curve;
        }
    }
    private static doubles = {};
    public static getDouble(name: string): number{
        if (this.IsEditor) {
            return Game.DoubleDefineList.GetValue(name);
        } else {
            let double = this.doubles[name];
            if (!double) {
                double = this.doubles[name] = Game.DoubleDefineList.GetValue(name);
            }
            return double;
        }
    }
    private static _mainCamera: UnityEngine.Camera;
    public static getMainCamera() {
        if (this._mainCamera == null) {
            this._mainCamera = UnityEngine.Camera.main;
        }
        return this._mainCamera;
    }
    private static _unitSelectEffectPlayer: UnitSelectEffectPlayer;
    public static get UnitSelectEffectPlayer() {
        if (this._unitSelectEffectPlayer == null) {
            this._unitSelectEffectPlayer = new UnitSelectEffectPlayer();
        }
        return this._unitSelectEffectPlayer;
    }

    public static comformcreaterole: boolean = false;
}