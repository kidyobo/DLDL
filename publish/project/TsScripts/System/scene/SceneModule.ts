import { Global as G } from "System/global"
import { UnitInputListener } from "System/unit/UnitInputListener"
import { DataManager } from "System/data/datamanager"
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { Macros } from "System/protocol/Macros"
import { EventDispatcher } from "System/EventDispatcher"
import { Events } from "System/Events"
import { ErrorId } from "System/protocol/ErrorId"
import { HeroController } from 'System/unit/hero/HeroController'
import { DropThingController } from 'System/unit/dropThing/DropThingController'
import { GateInfo } from 'System/data/scene/GateInfo'
import { QuestData } from 'System/data/QuestData'
import { PinstanceData } from 'System/data/PinstanceData'
import { KeyWord } from 'System/constants/KeyWord'
import { TaskView } from 'System/quest/TaskView'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { UnitStatus } from 'System/utils/UnitStatus'
import { JumpVar } from 'System/data/Runtime'
import { UnitController } from 'System/unit/UnitController'
import { HeroGotoType, EnumLoginStatus, FindPosStrategy } from 'System/constants/GameEnum'
import { SceneData } from 'System/data/scenedata'
import { GateOperateInfo } from 'System/data/scene/GateOperateInfo'
import { Constants } from 'System/constants/Constants'
import { MapId } from 'System/map/MapId'
import { MapView } from 'System/map/view/MapView'
import { CompareUtil } from 'System/utils/CompareUtil'
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { Weather, WeatherSystem } from "System/WeatherSystem"
import { FuLiDaTingView } from 'System/activity/fldt/FuLiDaTingView'
import { WaitingView } from 'System/uilib/WaitingView'
import { ActHomeView } from 'System/activity/actHome/ActHomeView'
import { SceneConfigLoadUtil } from 'System/scene/SceneConfigLoadUtil'
import { SceneLoader } from 'Diff/SceneLoader'
import { FloatShowType } from 'System/floatTip/FloatTip'
import { EffectPlayer } from "System/unit/EffectPlayer";

/**
 * Module Name(Generate by CodeRobot)
 */
export class SceneModule extends EventDispatcher {

    private m_lastTransportTime: number = 0;

    /**标记位，标记是否第一次进入场景*/
    private m_firstScene: boolean = true;

    /**场景渲染是否正在进行，比如踩上传送点后，会停止running*/
    private running: boolean = false;

    /**能否播放场景音乐。*/
    private m_canPlayBgm: boolean;

    /**背景音乐音量*/
    private m_bgmVolumeQuotiety: number = 0.6;

    /**传送点操作的管理*/
    private m_gateOperateInfoList: { [sceneGateKey: string]: GateOperateInfo } = {};

    /**角色输入等*/
    private inputListener: UnitInputListener;

    /**是否正在等待加载地编数据。*/
    private isWaitingMapData = false;
    public get isLoading() {
        return this.isWaitingMapData || this.isWaitingMapTiles;
    }

    private isWaitingMapTiles = false;

    private landDelayTimer: Game.Timer;

    public sceneLoadUtil: SceneConfigLoadUtil;

    private keepWarmAssets = [];
    private preloadAssets = [];

    loader: SceneLoader;
    private needLoadRsc = true;


    private checkPayTimer: Game.Timer;


    constructor() {
        super();
        this.loader = new SceneLoader();
        this.sceneLoadUtil = new SceneConfigLoadUtil();

        this.addNetListener(Macros.MsgID_Transport_Response, this.onTransportResponse);
        this.addNetListener(Macros.MsgID_ItemTransport_Response, this.onItemTransportResponse);
        this.addNetListener(Macros.MsgID_SpecialTransport_Response, this.onSpecialTransportResponse);
        this.addNetListener(Macros.MsgID_GetSceneMonster_Response, this._onGetSceneMonsterResponse);
        this.addNetListener(Macros.MsgID_EnableWayPoint_Notify, this._enableGateNotify);
        this.addNetListener(Macros.MsgID_GetDroppedThing_Response, this._onGetDroppedThingResponse);
        this.addNetListener(Macros.MsgID_ShowEffect_At_Position_Notify, this._onShowEffectAtPositionNotify);
    }

    onLoginSuccessfully(isFirstLogin: boolean): void {
        if (null == G.Uimgr.getForm<WaitingView>(WaitingView) && !G.ModuleMgr.loadingModule.active) {
            // 如果没有显示断线重连就显示loading板，因为在场景中断线重连，重新进场景的时候不要显示loading板
            G.ModuleMgr.loadingModule.setActive(true);
        }
        // 先清理场景
        this._clearScene();

        // 先创建hero，否则接下来收到很多协议可能会报错
        let hero = G.UnitMgr.hero;
        let heroData = G.DataMgr.heroData;
        if (hero == null) {
            hero = G.UnitMgr.createHero(heroData);
            G.UnitMgr.controlHero(heroData);
            this.inputListener = new UnitInputListener();
            this.inputListener.setTarget(hero);
            //第一次进场景的需要获取下上次游戏退出后 玩家请求的骑乘状态
            if (UnitStatus.isInRide(heroData.unitStatus)) {
                G.DataMgr.runtime.rideStatus = Macros.MountRide_Up;
            }
            G.DataMgr.runtime.needLand = true;
        }
        else {
            hero.updateByHeroData();
            hero.buffProxy.deleteAllBuff();
            // 跨服后unit id会变，需要重新映射
            G.UnitMgr.onHeroUnitIDChange();
        }
        heroData.oldUnitID = heroData.unitID;

        if (isFirstLogin) {
            //if (Game.ResLoader.isGame3D) {
            //    // 先预加载技能动作
            //    //加载玩家所有的特效到内存
            //    let profSkillMap = G.DataMgr.skillData.getSkillsByProf(G.DataMgr.heroData.profession);
            //    let skills = profSkillMap[KeyWord.SKILL_BRANCH_ROLE_NQ];
            //    for (let skill of skills) {
            //        if (skill.m_szPrepareEffect != "") {
            //            this.keepWarmAssets.push("effect/skill/" + skill.m_szPrepareEffect + ".prefab");
            //        }
            //        if (skill.m_szBoyEffectID != "") {
            //            this.keepWarmAssets.push("effect/skill/" + skill.m_szBoyEffectID + ".prefab");
            //        }
            //        if (skill.m_szMonsterHurtEffect != "") {
            //            this.keepWarmAssets.push("effect/skill/" + skill.m_szMonsterHurtEffect + ".prefab");
            //        }
            //    }
            //    skills = profSkillMap[KeyWord.SKILL_BRANCH_ROLE_ZY];
            //    for (let skill of skills) {
            //        if (skill.m_szPrepareEffect != "") {
            //            this.keepWarmAssets.push("effect/skill/" + skill.m_szPrepareEffect + ".prefab");
            //        }
            //        if (skill.m_szBoyEffectID != "") {
            //            this.keepWarmAssets.push("effect/skill/" + skill.m_szBoyEffectID + ".prefab");
            //        }
            //        if (skill.m_szMonsterHurtEffect != "") {
            //            this.keepWarmAssets.push("effect/skill/" + skill.m_szMonsterHurtEffect + ".prefab");
            //        }
            //    }
            //}
            if (G.comformcreaterole) {
                //刚进入场景
                this.preloadAssets.push("ui/system/WelcomeView.prefab");
                this.preloadAssets.push("ui/system/FunctionGuideView.prefab");
            }
        }
        this.startEnterScene();
    }

    /**
	* 重登陆后第一次进入场景
	* 这是在收到loginresponse后做的事情，也就是包括切线等操作也会触发
	*
	*/
    startEnterScene(): void {
        let hero = G.UnitMgr.hero;
        if (UnitStatus.isDead(hero.Data.unitStatus)) {
            G.DataMgr.heroData.isAlive = false;
            hero.kill(null);
        }
        else {
            G.DataMgr.heroData.isAlive = true;
            hero.reborn(); //复活的行为

            if (G.DataMgr.runtime.isHangingUpBeforeDie && G.BattleHelper.shouldConsiderFixed()) {
                G.Mapmgr.goToPos(G.DataMgr.sceneData.curSceneID, G.BattleHelper.fixedPoint.x, G.BattleHelper.fixedPoint.y, false, true, FindPosStrategy.Specified, 0, true);
            }
        }
        this.dispatchEvent(Events.HeroAliveDeadChange);
        this.dispatchEvent(Events.HeroDataChange); //派发伙伴事件

        this._changeScene(true);
        G.ViewCacher.mainView.enableAutoDownload();
        //// 同步物资速度
        //if (null != this.Hero.guoyunGoods) {
        //    this.Hero.guoyunGoods.Data.setPropertyById(Macros.EUAI_SPEED, this.Hero.Data.getPropertyByID(Macros.EUAI_SPEED));
        //}
        ////已进入场景就打坐
        //if (this.Hero.canDazuo()) {
        //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getStartDazuoRequest());
        //}

        if (this.m_firstScene) {
            G.GuideMgr.start();
        }
    }
    private _changeScene(isFirst: boolean): void {
        let sceneData = G.DataMgr.sceneData;
        let config = sceneData.getSceneInfo(sceneData.curSceneID).config;

        // 显示loading页
        if (this.needLoadRsc && !G.ModuleMgr.loadingModule.active) {
            G.ModuleMgr.loadingModule.setActive(true);
            G.ModuleMgr.loadingModule.enableRandomTip();
        }
        G.AudioMgr.stopBgm();
        CachingSystem.onChangeScene();
        this.m_firstScene = isFirst;
        G.DataMgr.settingData.sceneHideFlag = config.m_ucHideLevel;
        G.UnitMgr.processHideRole();

        if (sceneData.curPinstanceID > 0) {
            G.Mapmgr.stopAutoPath();
        }

        // 关闭吟唱
        G.ViewCacher.collectionBar.cancelByPrepareID(0);
        let sceneID: number = sceneData.curSceneID;

        this.dispatchEvent(Events.ChangeScene); //也只有副本那边在处理
        G.BattleHelper.onChangeScene();
        G.ViewCacher.mainView.onChangeScene();

        // 由于本地运行时加载地编是同步的，因此需要在此前设置hero的坐标，而这需要用到新场景地图尺寸进行计算，所以必须先使用新尺寸
        G.Mapmgr.useNewMapSizePixel();
        if (this.needLoadRsc) {
            UnityEngine.Application.backgroundLoadingPriority = UnityEngine.ThreadPriority.High;
            // 不同的场景，需要加载地图数据
            this.isWaitingMapData = true;
            this.isWaitingMapTiles = true;

            //场景清理后清理内存
            Game.ResLoader.ClearMemory(300, true);
            uts.gc();

            //加载场景数据，地图宽度和高度在处理login response时已经存在mapmgr里了
            this.sceneLoadUtil.loadSceneConfigData(sceneID);
            this.onLoadAsset(sceneID);
        } else {
            // 相同的场景，直接检查
            this.checkEnterScene(true);
        }

        // 进入副本关闭活动大厅面板
        if (sceneData.curPinstanceID > 0) {
            G.Uimgr.closeForm(ActHomeView);
        }

    }

    onMapDataComplete(sceneID: number): void {
        uts.log("load over" + "  G.DataMgr.sceneData.curSceneID:" + G.DataMgr.sceneData.curSceneID + "  sceneID:" + sceneID);
        if (sceneID == G.DataMgr.sceneData.curSceneID) {
            this.isWaitingMapData = false;
            this.checkEnterScene(true);
        }
    }
    private lastloadGroup;
    private onLoadAsset(sceneID: number) {
        //场景数据拿到后，检查当前地图的资源是否全部已经在本地，如果不是则下载
        let id = G.DataMgr.sceneData.getSceneRescourceID(sceneID);
        let mapResGroup = this.loader.getSceneRes(id);
        let newGroup = mapResGroup;
        newGroup = newGroup.concat(this.keepWarmAssets, this.preloadAssets);
        this.lastloadGroup = newGroup;
        let request = Game.ResLoader.CreateDownloadRequest(Game.AssetPriority.High1, newGroup, false);
        if (request.maxSize > 0) {
            G.ModuleMgr.loadingModule.downloadRequest(request, 0, 0.6, delegate(this, this.onDownloadAssets, sceneID), null);
        }
        else {
            this.onDownloadAssets(request, sceneID);
        }
    }
    private onDownloadAssets(r: Game.DownloadRequest, sceneID: number) {
        let request = Game.ResLoader.CreateAssetsRequest(Game.AssetPriority.High1, this.lastloadGroup);
        G.ModuleMgr.loadingModule.loadRequest(request, -1, 1, delegate(this, this.onLoadAssets, sceneID), null);
    }
    private onLoadAssets(request: Game.AssetRequest, sceneID: number) {
        if (sceneID == G.DataMgr.sceneData.curSceneID) {
            for (let i of this.keepWarmAssets) {
                let asset = Game.ResLoader.LoadAsset(i);
                asset.autoCollect = false;
            }
            this.keepWarmAssets = [];
            this.preloadAssets = [];

            this.isWaitingMapTiles = false;
            this.checkEnterScene(true);
        }
    }

    private checkEnterScene(waitTiles: boolean) {
        if (this.isWaitingMapData) {
            return;
        }
        if (waitTiles) {
            if (!this.isWaitingMapTiles) {
                this._enterScene();
            }
        }
        else {
            this._enterScene();
        }
    }
    /**
	* 地图数据和缩略图都加载好了后正式进入场景的逻辑处理
	*
	*/
    private _enterScene(): void {
        this.isWaitingMapTiles = false;

        if(this.needLoadRsc) {
            let sceneData: SceneData = G.DataMgr.sceneData;
            let mapResId = G.DataMgr.sceneData.getSceneRescourceID(sceneData.curSceneID);
            if (mapResId == 0) {
                uts.logWarning("场景ID=0 请检查");
            }
            this.loader.load(mapResId);
        } else {
            this.enterScene();
        }
    }

    public enterScene() {

        //if (Game.Tools.DumpCacheCount) {
        //    let dumpCCount = Game.Tools.DumpCacheCount();
        //    if (dumpCCount > 2000) {
        //        if (defines.has("DEVELOP")) {
        //            Game.FixedMessageBox.Show("内存泄漏:dumpCCount" + dumpCCount, null);
        //        }
        //        else {
        //            uts.logErrorReport("内存泄漏:dumpCCount" + dumpCCount);
        //        }
        //    }
        //}
        let sceneData: SceneData = G.DataMgr.sceneData;
        //魂力试炼
        if (sceneData.curPinstanceID == Macros.PINSTANCE_ID_HLSL) {
            //显示副本标题
            G.ViewCacher.mainUIEffectView.showPinstanceTitle(G.DataMgr.pinstanceData.pinstanceTitle, 3);
            //处理屏幕特效
            G.MapCamera.beginScreenDarkness();
        }
        let mapResId = G.DataMgr.sceneData.getSceneRescourceID(sceneData.curSceneID);
        uts.log(uts.format('enter scene, scene id={0}', sceneData.curSceneID));
        G.UnitMgr.hero.onUpdateVisible();
        G.UnitMgr.remapAll();
        G.UnitMgr.remapHero();

        //启动天气系统
        let config = sceneData.getSceneInfo(sceneData.curSceneID).config;
        if(this.needLoadRsc) {
            G.TipMgr.addMainFloatTip(config.m_szSceneName);
        }
        if (!G.DataMgr.runtime.__adVideo) {
            // 录视频时不要天气
            WeatherSystem.change(config.m_iWeatherType);
        }

        if (config.m_ucPopWordSpeed > 0) {
            G.ViewCacher.popWordView.open(config.m_ucPopWordSpeed);
        }
        else {
            G.ViewCacher.popWordView.close();
        }
        var inDynamicPin = !this.needLoadRsc && sceneData.curPinstanceID > 0;
        sceneData.disableAllGate = inDynamicPin;
        //创建NPC
        G.UnitMgr.loadNPCData(sceneData.curSceneConfig.npcInfos, !inDynamicPin);

        //创建传送点(特效<通过表格配的>以及描述)
        this._processGateOperation();
        G.ModuleMgr.unitModule.newSceneTeleport(sceneData.curSceneConfig.gateInfos);
        sceneData.isEnterSceneComplete = true;
        G.DataMgr.runtime.everEnterScene = true;
        G.ModuleMgr.mainModule.onEnterScene();
        G.ActBtnCtrl.onEnterScene();

        G.DataMgr.runtime.lastEnterSceneCompleteAt = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);

        this._start();

        //StoryGuide.ins.start();

        if (Macros.PINSTANCE_ID_WORLDBOSS == sceneData.curPinstanceID) {
            G.ModuleMgr.deputyModule.startEndHangUp(true, -1);
        }

        if (this.m_firstScene) {
            G.ModuleMgr.questModule.onFirstEnterScene();
            //G.GuideMgr.start();
            if (this.checkPayTimer == null) {
                this.checkPayTimer = new Game.Timer("checkPayTimer", 3000, 1, delegate(this, this.onCheckPayTimer));
            }
        }

        G.ModuleMgr.loadingModule.enableProgress();

        G.ViewCacher.mainView.onChangeScene();
        G.ModuleMgr.loadingModule.setActive(false);

        if (!G.comformcreaterole && (G.DataMgr.runtime.needLand && G.DataMgr.settingData.sceneHideFlag != 2)) {
            G.DataMgr.runtime.needLand = false;
            Game.Invoker.BeginInvoke(G.Root, "lateLand", 0.1, delegate(this, this.lateLand));
        } else {
            if (G.comformcreaterole) {
                G.comformcreaterole = false;
                G.DataMgr.runtime.needLand = false;
            }
            this.afterLanded();
        }
        // 隐藏重连提示
        if (G.DataMgr.runtime.loginStatus == EnumLoginStatus.logined) {
            // 只有已经登录好了才能去掉重连提示板，比如切场景显示loading的过程中如果断线了，这时候进入新场景还是要显示断线重连
            G.Uimgr.closeForm(WaitingView);
        }

        if (this.needLoadRsc && sceneData.curSceneID != sceneData.preSceneID && KeyWord.PVP_NONE != config.m_iPVPModel && KeyWord.PVP_PEACE != config.m_iPVPModel) {
            //@jackson  多人boss特殊限制 第一层不需要提示
            //if (!(config.m_iSceneID == 257 && G.DataMgr.heroData.pkMode == KeyWord.PVP_NONE))
            {
                G.TipMgr.addMainFloatTip(uts.format('进入PK场景，已切换为{0}', KeyWord.getDesc(KeyWord.GROUP_PVP_TYPE, config.m_iPVPModel)), FloatShowType.PkScene, 0);
            }
        }

        //播放背景音乐
        this._playSceneBgMusic(sceneData.curSceneID);
    }
    lateLand() {
        G.UnitMgr.hero.land2Floor(delegate(this, this.afterLanded));
    }


    private onCheckPayTimer() {
        this.checkPayTimer = null;
        G.DataMgr.payRecepitData.checkLeakRecepit();
    }


    /**
	* 播放背景音乐
	* @param curSceneID
	*
	*/
    private _playSceneBgMusic(curSceneID: number): void {
        //this.m_canPlayBgm = false;
        let bgMusicID: number = G.DataMgr.sceneData.getSceneInfo(curSceneID).config.m_iMusicID;
        if (0 != bgMusicID) {
            G.AudioMgr.playBgm(uts.format('sound/scene/{0}.mp3', bgMusicID));
            //    let bgmUrl: string = this._buildMp3Url(bgMusicID.toString());
            //    let preSceneID: number = G.DataMgr.sceneData.preSceneID;
            //    if (0 == preSceneID || preSceneID != curSceneID || !SoundManager2.INSTANCE.isSoundPlaying(EnumSoundGroup.BGM, bgmUrl)) {
            //        SoundManager2.INSTANCE.stopSound(EnumSoundGroup.BGM, '*');
            //        // 背景音乐延迟播放
            //        TimerManager.ins.registerTimer(5000, 1, _onPlayBgmTimer, bgmUrl);
        }
        else {
            G.AudioMgr.stopBgm();
        }
    }

    /**清除场景*/
    private _clearScene(): void {
        let sceneData = G.DataMgr.sceneData;
        let config = sceneData.getSceneInfo(sceneData.curSceneID).config;
        this.needLoadRsc = sceneData.preSceneID != sceneData.curSceneID;
        if(sceneData.preSceneID > 0) {
            if(sceneData.curPinstanceID > 0) {
                let pcfg = PinstanceData.getConfigByID(sceneData.curPinstanceID);
                if(pcfg.m_cLoadingType == KeyWord.PIN_LOADING_PART) {
                    // 此类副本若场景资源id和上一次资源id相同的话则不需要重新加载地编
                    this.needLoadRsc = config.m_iSceneFather != sceneData.preSceneID;
                    uts.log('部分加载地编：needLoadRsc = ' + this.needLoadRsc + ', sceneFather = ' + config.m_iSceneFather);
                } else if(pcfg.m_cLoadingType == KeyWord.PIN_LOADING_ALL) {
                    // 此类副本已上次场景创建副本，故不需要重新加载地编
                    this.needLoadRsc = false;
                    uts.log('动态加载地编：curSceneID = ' + sceneData.curSceneID);
                }
            } else if(sceneData.prePinstanceID > 0) {
                let prePcfg = PinstanceData.getConfigByID(sceneData.prePinstanceID);
                if(prePcfg.m_cLoadingType == KeyWord.PIN_LOADING_PART) {
                    // 此类副本若场景资源id和上一次资源id相同的话则不需要重新加载地编
                    let preConfig = sceneData.getSceneInfo(sceneData.preSceneID).config;
                    this.needLoadRsc = preConfig.m_iSceneFather != sceneData.curSceneID;
                    uts.log('前次副本为部分加载地编：needLoadRsc = ' + this.needLoadRsc + ', pre sceneFather = ' + preConfig.m_iSceneFather);
                } else if(prePcfg.m_cLoadingType == KeyWord.PIN_LOADING_ALL) {
                    // 此类副本已上次场景创建副本，故不需要重新加载地编
                    this.needLoadRsc = false;
                    uts.log('前次副本为动态加载地编：curSceneID = ' + sceneData.curSceneID);
                }
            }
        }

        sceneData.isEnterSceneComplete = false;
        // 停止场景更新
        this._stop();
        G.DataMgr.runtime.lastSafeClickTime = 0;
        // 每次场景仅提示一次
        G.DataMgr.runtime.resetGetDrop();
        G.ActionHandler.beAGoodBaby(false, true, true, true, false);

        // 切场景关闭NPC对话框
        G.ViewCacher.taskView.close();
        // 清除NPC状态数据
        G.DataMgr.npcData.dataOper.deleteAllData();
        //清空当前场景上面所有的元素
        G.UnitMgr.clearSceneElements();
        if (this.needLoadRsc) {
            this.loader.unload();
        }
    }

    /**
	* 启动每帧的循环渲染
	*
	*/
    private _start(): void {
        this.running = true;
        //G.ModuleMgr.mainModule.View.setViewEnable(true);
        //监听点击事件
        this.inputListener.setEnabled(true);
        G.ViewCacher.mainView.setJoyStickEnabled(true);

        // 恢复自动战斗
        if (G.DataMgr.sceneData.curPinstanceID > 0 && G.DataMgr.runtime.pauseHangingUpPinstance == G.DataMgr.sceneData.curPinstanceID) {
            G.ModuleMgr.deputyModule.pauseResumeHangUp(false);
        }
    }

    /**
     * 停止每帧的渲染
     *
     */
    private _stop(): void {
        if (this.running) {
            //G.ModuleMgr.mainModule.View.setViewEnable(false);
            //TimerManager.ins.removeEnterFrame(_renderScene);
            // 暂停自动战斗
            if (G.DataMgr.sceneData.isEnterSceneComplete) {
                G.DataMgr.runtime.pauseHangingUpPinstance = G.DataMgr.sceneData.curPinstanceID;
            }
            else {
                G.DataMgr.runtime.pauseHangingUpPinstance = G.DataMgr.sceneData.prePinstanceID;
            }
            G.ModuleMgr.deputyModule.pauseResumeHangUp(true);
        }
        if (null != this.inputListener) {
            this.inputListener.setEnabled(false);
        }
        G.ViewCacher.mainView.setJoyStickEnabled(false);
        this.running = false;
    }

    /**
	* 传送门响应
	* @param body
	*
	*/
    private onTransportResponse(body: Protocol.Transport_Response): void {
        let hero = G.UnitMgr.hero;
        G.DataMgr.runtime.isWaitTransprotResponse = false;
        // 清除路径
        if (body.m_uiResultID == 0) {
            uts.log(uts.format('传送成功！ m_cEnterType = {0}, sceneID={1}, preSceneID={2}, pinstanceID = {3}, prePinstanceID = {4}, pos = ({5}, {6}), time = {7}, sceneIdx = {8}, pinstanceIdx = {9},num={10},body.m_ucExtraType={11}',
                G.DataMgr.systemData.crtLoginEnterType.m_cEnterType, body.m_uiSceneID, G.DataMgr.sceneData.curSceneID, body.m_uiPinstanceID, G.DataMgr.sceneData.curPinstanceID, body.m_stPosition.m_uiX,
                body.m_stPosition.m_uiY, UnityEngine.Time.realtimeSinceStartup, body.m_uiSceneIdx, body.m_uiPinstanceIdx,
                body.m_ucNum, body.m_ucExtraType));

            G.Mapmgr.newMapWidthPixel = body.m_uiWidthPixels;
            G.Mapmgr.newMapHeightPixel = body.m_uiHeightPixels;

            G.DataMgr.sceneData.curSceneIndex = body.m_uiSceneIdx;
            G.DataMgr.sceneData.curPinstanceIndex = body.m_uiPinstanceIdx;
            // 检查是否需要返回原服
            if (G.DataMgr.systemData.isCrtLoginTypeCrossSvr() &&
                G.DataMgr.sceneData.curPinstanceID > 0 && 1 == PinstanceData.getConfigByID(G.DataMgr.sceneData.curPinstanceID).m_ucIsKF &&
                (0 == body.m_uiPinstanceID || 0 == PinstanceData.getConfigByID(body.m_uiPinstanceID).m_ucIsKF)) {
                // 返回原服
                uts.log('cancel cross by tranport response');
                G.ModuleMgr.loginModule.cancelCross();
            }
            else {
                // 本服切场景
                G.DataMgr.sceneData.curPinstanceID = body.m_uiPinstanceID;
                G.DataMgr.pinstanceData.crtPinstanceLayer = body.m_usPinstancePos;
                let isDiffScene = G.DataMgr.sceneData.curSceneID != body.m_uiSceneID;
                G.DataMgr.sceneData.curSceneID = body.m_uiSceneID;
                G.DataMgr.heroData.direction = body.m_ucDirection;
                hero.forceStand(body.m_ucDirection);
                G.DataMgr.heroData.setPosition(body.m_stPosition.m_uiX, body.m_stPosition.m_uiY);

                if (body.m_ucNum > 0) {
                    // 这是跳跃，约定好只能同场景
                    // 新手跳下传送点后自动跑去做第一个任务
                    //let checkFirstTrunk = (CompareUtil.isSimpleArrayEqual(Constants.FresheMemTps, body.m_aiID) && !G.DataMgr.questData.isQuestCompleted(G.DataMgr.questData.firstTrunkId));
                    hero.jumpByTeleports(body.m_aiID, body.m_stPosition, delegate(this, this._afterJumpTeleports, false/*checkFirstTrunk*/));
                    this._start();
                }
                else if (body.m_ucExtraType == Macros.TRANS_TYPE_BIG_JUMP || body.m_ucExtraType == Macros.TRANS_TYPE_QUEST_JUMP) {
                    hero.jumpTo(body.m_stPosition.m_uiX, body.m_stPosition.m_uiY, delegate(this, this.continueQuestOrPinstance, false));
                    this._start();
                }
                else {

                    // 这是切场景
                    this._clearScene();
                    //G.DataMgr.runtime.needLand = body.m_ucExtraType == Macros.TRANS_TYPE_SHOE;
                    G.DataMgr.runtime.needLand = this.needLoadRsc;
                    this._changeScene(false);
                }
            }
        }
        else {
            //  uts.log(uts.format('传送失败：resultID={0}', body.m_uiResultID));
            //如果传送出错，继续启动运行9
            this._start();
        }
    }

    private afterLanded() {
        if (null != this.landDelayTimer) {
            this.landDelayTimer.Stop();
            this.landDelayTimer = null;
        }
        if (!G.Mapmgr.continueCrossPath()) {
            this.continueQuestOrPinstance(true);
        }
        if (this.m_firstScene) {
            G.GuideMgr.enableGuide();
        }
    }

    private continueQuestOrPinstance(hasChangeScene: boolean) {
        G.ModuleMgr.questModule.onEnterSceneComplete(hasChangeScene);
        G.ModuleMgr.pinstanceModule.onEnterSceneComplete();
    }

    /**
	* 后台传送的响应
	* @param msg
	*
	*/
    private onItemTransportResponse(response: Protocol.ItemTransport_Response): void {
        //uts.log(uts.format('onItemTransportResponse, result={0}, npcID={1}, questFeedback={2}', response.m_iResult, response.m_iNPCID, response.m_iQuestFeedback));
        G.DataMgr.runtime.isWaitTransprotResponse = false;
        if (response.m_iResult != ErrorId.EQEC_Success) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResult));
        }
    }

    /**
     * 特殊传送的响应
     * @param msg
     *
     */
    private onSpecialTransportResponse(response: Protocol.SpecialTransport_Response): void {
        uts.log(uts.format('onSpecialTransportResponse, result={0}', response.m_iResult));
        if (ErrorId.EQEC_Success != response.m_iResult) {
            G.DataMgr.runtime.isWaitTransprotResponse = false;
            // 本协议只有失败的时候才发，成功不发response
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResult));

            // 跨服传送失败要恢复
            if (KeyWord.NAVIGATION_CROSS_ACT == response.m_stEnterType.m_cEnterType) {
                G.ModuleMgr.kfModule.quitJoinKfAct();
            }
            else if (ErrorId.EQEC_TRANS_PINCROSS_FAIL == response.m_iResult) {
                // 离开副本解冻所有功能
                G.ModuleMgr.loginModule.cancelCross();
            }
        }
    }

    /**
	* 处理传送点的逻辑
	*
	*/
    processTransport(tpId: number): void {
        let hero = G.UnitMgr.hero;
        if (!this.running || hero.IsJumping || hero.IsLanding || hero.isMoving) {
            return;
        }
        if (UnityEngine.Time.realtimeSinceStartup - this.m_lastTransportTime < 1) {
            return;
        }

        G.ActionHandler.beAGoodBaby(false, false, false, false, false);
        let heroPos: UnityEngine.Vector2 = hero.getPixelPosition();

        let gateInfos: GateInfo[] = G.DataMgr.sceneData.curSceneConfig.gateInfos;
        let gate: GateInfo, gateConfig: GameConfig.TeleportConfigM;
        let questList: number[], questID: number = 0, questConfig: GameConfig.QuestConfigM;
        let questData: QuestData = G.DataMgr.questData;
        let canJump: boolean, questReason: number = 0;
        let len: number = gateInfos.length;
        let sceneData = G.DataMgr.sceneData;
        for (let i: number = 0; i < len; ++i) {
            gate = gateInfos[i];
            if (tpId == gate.gateID && gate.isEnable && !sceneData.disableAllGate) {
                gateConfig = G.DataMgr.sceneData.getTeleportConfig(gate.gateID);
                break;
            }
        }

        if (null == gateConfig) {
            return;
        }
        if (KeyWord.TRANS_HIDE_JUMP == gateConfig.m_ucType) {
            // 隐式传送点
            if (gateConfig.m_iTargetTransportID > 0) {
                // 有目的地，说明是起跳点，但要检查任务ID
                questList = questData.getQuestByJumpID(gate.gateID);
                if (null == questList) {
                    // 没有相关任务，直接跳过
                    return;
                }
                canJump = false;
                for (questID of questList) {
                    questConfig = QuestData.getConfigByQuestID(questID);
                    if (null != questConfig.acceptJumpSeq && questConfig.acceptJumpSeq[0] == gate.gateID) {
                        // 接任务跳，需要检查是否已经接了该任务
                        if (questData.isQuestInDoingList(questConfig.m_iQuestID) && !questData.isQuestCompletingByID(questConfig.m_iQuestID)) {
                            canJump = true;
                            questReason = Macros.QUEST_JUMP_ACCEPT;
                            break;
                        }
                    }
                    else if (null != questConfig.finishJumpSeq && questConfig.finishJumpSeq[0] == gate.gateID) {
                        // 完成任务跳，需要检查是否可以完成该任务
                        if (questData.isQuestCompleted(questID) || G.DataMgr.questData.isQuestCompletingByID(questID)) {
                            canJump = true;
                            questReason = Macros.QUEST_JUMP_FINISH;
                            break;
                        }
                    }
                }

                if (!canJump) {
                    return;
                }
            }
            else {
                // 没有目的地，直接跳过
                return;
            }
        }
        if (!this._canTransport(tpId)) {
            return;
        }

        this.m_lastTransportTime = UnityEngine.Time.realtimeSinceStartup;

        G.DataMgr.runtime.isWaitTransprotResponse = true;
        this._stop();

        // 与任务相关的跳跃点，要告诉后台任务ID、接任务还是交任务跳跃
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTransportResquestMsg(tpId, questID, questReason));
    }
    /**
     * perry: 2012-4-10 根据等级判断是否可以传送
     * @return
     *
     */
    private _canTransport(gateID: number): boolean {
        // 阻止重复发消息
        if (G.DataMgr.runtime.isWaitTransprotResponse || !G.DataMgr.sceneData.isEnterSceneComplete) {
            return false;
        }

        let teleportConfig: GameConfig.TeleportConfigM = G.DataMgr.sceneData.getTeleportConfig(gateID);
        // 普通传送点，要专职后才能传送
        if (teleportConfig.m_ucType == KeyWord.TRANS_NORMAL && G.DataMgr.heroData.profession == KeyWord.PROFTYPE_NONE) {
            G.TipMgr.addMainFloatTip('完成转职任务后才可前往');
            return false;
        }

        let result: boolean = G.DataMgr.sceneData.canEnterScene(teleportConfig.m_iTargetScene, G.DataMgr.runtime.canShowTransportCfmDlg);
        if (!result) {
            G.DataMgr.runtime.canShowTransportCfmDlg = false;
        }
        return result;
    }

    private _canTransportByQuest(gate: number): boolean {
        let questList: number[] = G.DataMgr.questData.getQuestByJumpID(gate);
        if (null == questList) {
            // 没有相关任务，直接跳过
            return false;
        }

        let questConfig: GameConfig.QuestConfigM;
        for (let questID of questList) {
            questConfig = QuestData.getConfigByQuestID(questID);
            if (null != questConfig.acceptJumpSeq && questConfig.acceptJumpSeq[0] == gate) {
                // 接任务跳，需要检查是否已经接了该任务
                if (G.DataMgr.questData.isQuestInDoingList(questConfig.m_iQuestID) && !G.DataMgr.questData.isQuestCompletingByID(questConfig.m_iQuestID)) {
                    return true;
                }
            }
            else if (null != questConfig.finishJumpSeq && questConfig.finishJumpSeq[0] == gate) {
                // 完成任务跳，需要检查是否可以完成该任务
                if (G.DataMgr.questData.isQuestCompleted(questID) || G.DataMgr.questData.isQuestCompletingByID(questID)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
	* 跳跃点跳跃后的回调。
	*
	*/
    private _afterJumpTeleports(checkFirstTrunk): void {
        let hero = G.UnitMgr.hero;
        // 擦掉跳跃状态
        hero.setPixelPosition(G.DataMgr.heroData.x, G.DataMgr.heroData.y);

        // 如果需要继续寻路则继续
        let jumpVar: JumpVar = G.DataMgr.runtime.jumpVar;
        //if (checkFirstTrunk) {
        //    // 第一次跳下来就自动去接任务
        //    let welcomeView = G.Uimgr.getForm<WelcomeView>(WelcomeView);
        //    if (null == welcomeView) {
        //        G.ModuleMgr.questModule.tryAutoDoQuest(G.DataMgr.questData.firstTrunkId);
        //        return;
        //    }
        //}

        if (null != jumpVar.sceneTarget || jumpVar.npcID > 0 || null != jumpVar.gotoPos) {
            let target: UnitController = jumpVar.sceneTarget;
            let gotoType: HeroGotoType = jumpVar.gotoType;
            let gotoSkill: GameConfig.SkillConfigM = jumpVar.gotoSkill;
            let npcID: number = jumpVar.npcID;
            let questID: number = jumpVar.questID;
            let gotoPos: Game.Vector2;

            //uts.log(uts.format('_afterJumpTeleports, target={0}, gotoType={1}, gotoSkill={2}, npcID={3}, questID={4}, gotoPos={5}',
            //    target, gotoType, gotoSkill ? gotoSkill.m_iSkillID : 0, npcID, questID, jumpVar.gotoPos ? jumpVar.gotoPos.ToString() : null));

            //如果有中间跳跃点继续找
            let isEnd: boolean = true;
            if (null != jumpVar.jumpPos && jumpVar.jumpPos.length > 0) {
                gotoPos = jumpVar.jumpPos.shift();
                isEnd = false;
            }
            else if (null != jumpVar.gotoPos) {
                gotoPos = jumpVar.gotoPos;
            }

            if (isEnd) {
                jumpVar.reset();
            }
            G.DataMgr.heroData.gotoType = gotoType;
            if (null != target) {
                G.Mapmgr.moveToTarget(target, gotoSkill);
            }
            else if (npcID > 0) {
                G.Mapmgr.moveHeroToTargetID(G.DataMgr.sceneData.curSceneID, npcID);
            }
            else if (null != gotoPos) {
                G.Mapmgr.moveHeroToPos(gotoPos.x, gotoPos.y, false);
            }

            if (isEnd && questID > 0 && 0 == G.DataMgr.runtime.moveTarget.questID) {
                G.DataMgr.runtime.setMoveQuest(questID);
            }
        }
        else {
            //uts.log('_afterJumpTeleports, no jump vars.');
            hero.processAfterSearchPath();
        }
    }

    /**
     * 处理传送点的开闭
     *
     */
    private _processGateOperation(): void {
        let curSceneID: number = G.DataMgr.sceneData.curSceneID;
        let gateInfoList: GateInfo[] = G.DataMgr.sceneData.curSceneConfig.gateInfos;

        let config: GameConfig.TeleportConfigM = null;
        let effectInfo: GameConfig.TeleportEffectM = null;
        let gateOperateInfo: GateOperateInfo;
        let pos: UnityEngine.Vector2 = null;
        for (let gateInfo of gateInfoList) {
            gateOperateInfo = this.m_gateOperateInfoList[curSceneID + '_' + gateInfo.gateID];
            if (null != gateOperateInfo) {
                gateInfo.isEnable = gateOperateInfo.isEnable;
            }
        }

        for (let sceneGateKey in this.m_gateOperateInfoList) {
            delete this.m_gateOperateInfoList[sceneGateKey];
        }
    }

    /**
     * 开启或者关闭传送点的notify处理
     * @param msg
     *
     */
    private _enableGateNotify(notify: Protocol.EnableWayPoint_Notify): void {
        if (G.DataMgr.sceneData.isEnterSceneComplete) {
            let gateInfo: GateInfo = G.DataMgr.sceneData.getGateInfo(notify.m_uiSceneID, notify.m_iTransportPointID);
            if (null != gateInfo) {
                G.UnitMgr.enableWaypoint(gateInfo, notify.m_ucEnable == 1);
            } else {
                uts.logError(uts.format('在场景{0}上没有找到传送点{1}', notify.m_uiSceneID, notify.m_iTransportPointID));
            }
        }
        else {
            let key: string = notify.m_uiSceneID + '_' + notify.m_iTransportPointID;
            let oldData: GateOperateInfo = this.m_gateOperateInfoList[key];
            if (null == oldData) {
                this.m_gateOperateInfoList[key] = new GateOperateInfo(notify.m_uiSceneID, notify.m_iTransportPointID, notify.m_ucEnable == 1);
            }
            else {
                oldData.isEnable = notify.m_ucEnable == 1;
            }
        }

        if (1 == notify.m_ucEnable) {
            G.BattleHelper.rebuildGateList();
        }
    }

    private _onShowEffectAtPositionNotify(notify: Protocol.ShowEffect_At_Position_Notify) {
        if (G.DataMgr.sceneData.curPinstanceID == Macros.PINSTANCE_ID_HLSL) {
            let vec3 = G.serverPixelToLocalPosition(notify.m_stPosition.m_uiX,
                notify.m_stPosition.m_uiY);
            vec3.y = G.UnitMgr.hero.getWorldPosition().y;
            EffectPlayer.play(vec3, null, uts.format('other/{0}', notify.m_szEffect), 2, true, false);
        } else {
            let pos = new UnityEngine.Vector3(G.serverPixelXToLocalPositionX(notify.m_stPosition.m_uiX), 0,
                G.serverPixelYToLocalPositionY(notify.m_stPosition.m_uiY));
            let qu = UnityEngine.Quaternion.AngleAxis(notify.m_ushAngle, UnityEngine.Vector3.up);
            //let name = uts.format('map/config/{0}/objects/{1}.prefab', G.DataMgr.sceneData.curSceneID, notify.m_szEffect);
            let name = uts.format('effect/other/{0}.prefab', notify.m_szEffect);
            //这个特效正方形，实在是太大了，扩大检查范围
            let factor = notify.m_szEffect == "4300_x" ? 3 : 1;
            //uts.logWarning("  ShowEffect_At_Position_Notify   " + JSON.stringify(notify));
            G.UnitMgr.processScriptEffect(name, pos, qu, null, 0 == notify.m_ucStatus, factor);
        }
    }



    /**
	* 获取掉落物品
	* @param thing
	*
	*/
    getDropThing(dropThing: DropThingController): void {
        if (dropThing == null || dropThing.Data.info == null) {
            return;
        }

        let now: number = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);
        if (G.DataMgr.runtime.lastGetDropTime > 0 && now - G.DataMgr.runtime.lastGetDropTime < Constants.PICKUP_CD) {
            return;
        }

        let gotoType = G.DataMgr.heroData.gotoType;
        if (HeroGotoType.GET_SINGLE_DROP == gotoType) {
            // 拾取单个掉落
            G.DataMgr.runtime.waitingDropRespUnitID = dropThing.Data.info.m_iUnitID;
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDropThingRequest(dropThing.Data.info.m_iUnitID));
        }
        else if (HeroGotoType.GET_MULTI_DROP == gotoType) {
            // 拾取多个掉落
            G.TipMgr.addMainFloatTip('暂不支持！');
        }

        G.DataMgr.runtime.lastGetDropTime = now;
    }

    /**
	* 掉落物品响应
	* @param msg
	*
	*/
    private _onGetDroppedThingResponse(body: Protocol.GetDroppedThing_Response): void {
        G.DataMgr.runtime.waitingDropRespUnitID = 0;

        if (ErrorId.EQEC_Success != body.m_ushResultID) {
            if (ErrorId.EQEC_Pickup_More_Quick == body.m_ushResultID) {
                uts.log('拾取太快');
            }
            else if (ErrorId.EQEC_Default == body.m_ushResultID) {
                // 前后台坐标不一致
                G.UnitMgr.hero.drag2pos(body.m_stRolePos.m_uiX, body.m_stRolePos.m_uiY, Macros.MOVE_MODE_NONE);
            }
            else {
                G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(body.m_ushResultID), Macros.PROMPTMSG_TYPE_MIDDLE);
            }
        }
        else {
            // 拾取成功后飞图标入背包
            //let dropThing: DropThing = this.m_elementModule.getElement(body.m_iUnitID, false) as DropThing;
            //if (null != dropThing && null != dropThing.info) {
            //    this._flyIconFromElement(dropThing, dropThing.info.m_iThingID);
            //}

            //UISoundUtil.play(EnumUISoundName.SOUND_8);
        }
    }

    private _onGetSceneMonsterResponse(body: Protocol.CSGetSceneMonsterResponse) {
        G.DataMgr.sceneData.setSceneMonsters(body.m_iSceneID, body.m_aiID);
        let mapView = G.Uimgr.getForm<MapView>(MapView);
        if (mapView != null) {
            mapView.updateMonsters(body.m_iSceneID, body.m_aiID);
        }
    }
}