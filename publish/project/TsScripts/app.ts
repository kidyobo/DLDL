import 'uts/uts'
import 'uts/defines'
import 'System/data/SysDefines'
import { Global as G } from 'System/global'
import { CommonForm } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { EquipUtils } from 'System/utils/EquipUtils'
import { FloatTip } from 'System/floatTip/FloatTip'
import { PosTextTipView } from 'System/tip/view/PosTextTipView'
import { StrengthenTipView } from 'System/tip/view/StrengthenTipView'
import { LoginView } from "System/login/view/LoginView"
import { MessageBox } from "System/uilib/MessageBox"
import { MathUtil } from "System/utils/MathUtil"
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { MsgType, ReportType } from 'System/channel/ChannelDef'
import { BloodEffectPlayer } from "System/unit/BloodEffectPlayer"
import { UnitModel } from "System/unit/UnitModel"
import { SimpleAvatar } from "System/unit/avatar/SimpleAvatar"
import { KeyWord } from "System/constants/KeyWord"
import { EffectPlayer } from "System/unit/EffectPlayer"
import { Constants } from "System/constants/Constants"
import { ConfigManager } from "System/data/configmanager"
import { DownLoadMsgBox } from "System/tip/DownLoadMsgBox"
import { EnumLoadUrl } from "System/constants/GameEnum"
import { Color } from './System/utils/ColorUtil'
import { StringUtil } from 'System/utils/StringUtil'
import { GMRecordManager } from 'Record/GMRecordManager'
import { UnitStatus } from 'System/utils/UnitStatus'
import { BtnGroupCtrl } from 'System/main/BtnGroupCtrl'
import { VersionUtil } from './System/utils/VersionUtil';
class App {
    private readonly DOWNLOAD_TIP_SIZE = 1024 * 1024;
    private loadResList = [
        'ui/altasPrefab/richangIcons.prefab',
        'ui/altasPrefab/actIcons.prefab', 'ui/altasPrefab/iconColor.prefab',
        'ui/altasPrefab/colorEffectAltas.prefab', 'ui/altasPrefab/roleHeadAltas.prefab',
        'ui/altasPrefab/professionAltas.prefab', 'ui/altasPrefab/taskTypeAtlas.prefab',
        'ui/altasPrefab/iconColorExhibitionAltas.prefab', 'ui/altasPrefab/iconZiAtals.prefab',
        'shader', 'misc', 'preload', 'txtdata/downloadRecord.bytes',
        'material/GreyMaterial.mat', 'material/modeladd.mat', 'material/cameraEffect.mat', "material/rainEffect.mat", "material/RadialBlur.mat","material/cameraDarkMaterial.mat",
        'ui/UiManager.prefab', 'net/ss.bytes',
        'effect/other/xuanzhong_red.prefab', 'effect/other/xuanzhong_blue.prefab',
        'effect/other/shubiaodiandi.prefab', 'txtdata/svnver.bytes',
        'effect/other/curves.prefab', 'effect/other/doubleValues.prefab',
        UIPathData.LoginView, UIPathData.LoginTip];
    private newArray = null;
    run() {
        UnityEngine.Application.backgroundLoadingPriority = UnityEngine.ThreadPriority.High;
        Constants.CAST_DISTANCE = 40;
        Constants.LONG_CAST_DISTANCE = 50;
        Constants.BOSS_DISTANCE = 60;
        Constants.TELEPORT_VALID_DISTANCE = 40;
        Game.ThreeDTools.rayDistance = 200;

        this.loadResList = this.loadResList.concat(ConfigManager.DataPath);
        //Android
        Game.SystemSDK.onDestroy = delegate(this, this.onDestroy);
        Game.SystemSDK.onMessage = delegate(this, this.onMessage);
        Game.SystemSDK.onApplicationPause = delegate(this, this.onApplicationPause);
        Game.SystemSDK.onKeyDown = delegate(this, this.onKeyDown);
        //IOS
        Game.IosSdk.onIosSdkToTsMessage = delegate(this, this.onMessage);

        UnityEngine.Screen.sleepTimeout = -1;
        if (Game.ResLoader.isPublish) {
            UnityEngine.Application.targetFrameRate = 60;
        }
        else {
            UnityEngine.Application.targetFrameRate = 0;
        }
        G.ModuleMgr.InitLoadingModule();
        G.ModuleMgr.loadingModule.setActive(true, true);
        G.ChannelSDK.checkApk(delegate(this, this.onReady));
    }
    private onAPKConfirm(c: boolean) {
        if (c) {
            UnityEngine.Application.OpenURL("http://dldlcdn.8ttoo.com/dldl/apks/com.dljx.wf.v1.0.9.2674.apk");
        }
        else {
            UnityEngine.Application.Quit();
        }
    }

    private onReady() {
        let viewPath = G.ViewCacher.getViewPath();
        let newArray = [];
        let downloadArray = [];
        for (let i of this.loadResList) {
            newArray.push(i);
            downloadArray.push(i);
        }
        for (let i of viewPath) {
            newArray.push(i);
            downloadArray.push(i);
        }
        //镜头动画列表，确保在本地，不然不能及时播放
        let cameraAnimRes = Game.ResLoader.GetAssetBundleNameList(["camera"]);
        let count = Game.ArrayHelper.GetArrayLength(cameraAnimRes);
        for (let i = 0; i < count; i++) {
            downloadArray.push(Game.ArrayHelper.GetArrayValue(cameraAnimRes, i));
        }

        let fadingRes = Game.ResLoader.GetAssetBundleNameList(["ui/fading"]);
        count = Game.ArrayHelper.GetArrayLength(fadingRes);
        for (let i = 0; i < count; i++) {
            downloadArray.push(Game.ArrayHelper.GetArrayValue(fadingRes, i));
        }
        //魂力面板相关
        downloadArray.push('ui/system/HunLiView.prefab');
        downloadArray.push('ui/system/HunLiPanel.prefab');
        downloadArray.push('ui/subitem/tabContent.prefab');

        this.newArray = newArray;
        let request = Game.ResLoader.CreateDownloadRequest(Game.AssetPriority.High1, downloadArray, false);
        if (request.maxCount > 0) {
            if (request.maxSize >= this.DOWNLOAD_TIP_SIZE && !G.IsWifi) {
                uts.log('download res in 4G, size:' + request.maxSize);
                let msg = uts.format("检查到{0}新资源\n火速更新后可获得丰厚奖励哦！", G.getDataSizeString(request.maxSize))
                DownLoadMsgBox.ins.open(msg, delegate(this, this.onConfirmDownload, request));
            }
            else {
                this.onConfirmDownload(true, request);
            }
        }
        else {
            this.onDownloadOver(request);
        }
    }
    onConfirmDownload(ok: boolean, request: Game.DownloadRequest) {
        if (ok) {
            G.ModuleMgr.loadingModule.downloadRequest(request, 0, 1, delegate(this, this.onDownloadOver), delegate(this, this.onUpdateText, request));
        }
        else {
            UnityEngine.Application.Quit();
        }
    }
    onUpdateText(request: Game.DownloadRequest) {
        if (request.maxSize < this.DOWNLOAD_TIP_SIZE) {
            let str: string = G.IsIOSPlatForm ? "请稍后,正在读取本地场景ui进入游戏..." : uts.format('请稍候，正在准备游戏资源({0}%)', Math.floor(request.progress * 100));
            G.ModuleMgr.loadingModule.setText(str);
        }
        else {
            G.ModuleMgr.loadingModule.setText(uts.format('请稍候，正在下载资源({0}/{1})', G.getDataSizeString(request.loadSize), G.getDataSizeString(request.maxSize)));
        }
    }

    onDownloadOver(downloadRequest: Game.DownloadRequest) {
        G.ModuleMgr.loadingModule.setActive(true, true);
        G.ModuleMgr.loadingModule.setText(G.IsIOSPlatForm ? '斗罗大陆，畅游新的世界，主宰你的人生...' : '请稍候，正在加载游戏资源...');
        let request = Game.ResLoader.CreateAssetsRequest(Game.AssetPriority.High1, this.newArray);
        G.ModuleMgr.loadingModule.loadRequest(request, 0, 1, delegate(this, this.onLoadGame), null);
    }

    //请不要修改该类中除该函数以外的其他函数
    onLoadGame(assetRequest: Game.AssetRequest) {
        if (assetRequest.error != null) {
            uts.logWarning("加载失败:" + "  error:" + assetRequest.error);
            return;
        }
        G.originWidth = UnityEngine.Screen.width;
        G.orginHeight = UnityEngine.Screen.height;
        if (G.originWidth * G.orginHeight > 2173600) {
            let d = G.originWidth * G.orginHeight / 2173600;
            G.protectedWidth = Math.floor(G.originWidth / d);
            G.protectedHeight = Math.floor(G.orginHeight / d);
        }
        else {
            G.protectedWidth = G.originWidth;
            G.protectedHeight = G.orginHeight;
        }

        let downloadRecord = Game.ResLoader.LoadAsset("txtdata/downloadRecord.bytes");
        downloadRecord.autoCollect = false;
        let curveAsset = Game.ResLoader.LoadAsset("effect/other/curves.prefab");
        curveAsset.autoCollect = false;
        let doubleValuesAsset = Game.ResLoader.LoadAsset("effect/other/doubleValues.prefab");
        doubleValuesAsset.autoCollect = false;

        (curveAsset.gameObject.GetComponent(Game.AnimationCurveList.GetType()) as Game.AnimationCurveList).Init();
        if (Game.DoubleDefineList) {
            (doubleValuesAsset.gameObject.GetComponent(Game.DoubleDefineList.GetType()) as Game.DoubleDefineList).Init();
        }
        let asset = Game.ResLoader.LoadAsset("preload");
        asset.autoCollect = false;
        Game.UIButtonScale.DownCurve = G.getCurve("btnDownCurve");
        Game.UIButtonScale.UpCurve = G.getCurve("btnUpCurve");
        //特殊设置一个preset mat
        Game.ModelMaterialPreset.NewPreset("burn");
        Game.ModelMaterialPreset.SetPresetTexture("burn", "_DisolveGuide", asset.Load("preload/texture/dissolveGuide.png") as UnityEngine.Texture);
        Game.ModelMaterialPreset.SetPresetTexture("burn", "_BurnRamp", asset.Load("preload/texture/burnRamp.png") as UnityEngine.Texture);
        let text = Game.ResLoader.LoadAsset('txtdata/svnver.bytes').textAsset.text;
        Game.Log.svnver = Number(text);
        G.ModuleMgr.loadingModule.hideProgress();
        G.ModuleMgr.loadingModule.setText(G.IsIOSPlatForm ? '探索新世界，极品装备等你来爆...' : '请稍候，正在加载游戏配置...');
        Game.Invoker.BeginInvoke(G.Root, "LATECALL", 1, delegate(this, this.nextFrameDo));
    }
    private nextFrameDo() {
        G.UnitSelectEffectPlayer.initialize();
        G.AltasManager.init();
        G.Uimgr.init();
        G.AudioMgr.initialize();
        G.ShaderMgr.init();
        G.MaterialMgr.init();
        G.UnitMgr.init();
        CachingSystem.init();
        G.ModuleMgr.InitModules();
        G.DataMgr.onCfgReady();
        G.ActBtnCtrl.onCfgReady();
        this.getServerList(0);
        //标记donotdestroy
        Game.DonotDestroyManager.Add(G.Root);
        Game.DonotDestroyManager.Add(G.Uimgr.gameObject);
        Game.DonotDestroyManager.Add(G.UnitMgr.gameObject);
        Game.DonotDestroyManager.Add(G.AudioMgr.root);
        Game.DonotDestroyManager.Add(CachingSystem.root.gameObject);
        G.ModuleMgr.loadingModule.linkCameraToUILayer(true);
    }

    private getServerList(trytimes: number) {
        G.ModuleMgr.loadingModule.setText(G.IsIOSPlatForm ? '获取服务器列表，即将进入登录页面...' : '请稍候，正在获取服务器列表...');
        G.ServerData.onServerDataPrepare(delegate(this, this.onGetServerData, trytimes), trytimes);
    }

    private onGetServerData(error: string, trytimes: number) {
        if (error != null) {
            uts.logWarning('onGetServerData error:' + error + ',trytimes:' + trytimes);
            if (++trytimes < EnumLoadUrl.ServerListTryTimes) {
                this.getServerList(trytimes);
            }
            else {
                Game.FixedMessageBox.Show("拉取服务器配置失败，点击确定重试，取消退出游戏", delegate(this, this.onGetServerList));
            }
            return;
        }
        //缓存部分界面缓存部分界面
        G.ViewCacher.initView();
        // 因退出可能需要弹二次确认框，故在界面初始化后再设置onPressQuitKey
        Game.SystemSDK.onPressQuitKey = delegate(this, this.onPressQuitKey);
        //缓存飘字特效
        BloodEffectPlayer.cacheAll();
        //缓存80个model对象
        for (let i = 0; i < 80; i++) {
            let model = new UnitModel();
            UnitModel.pool.push(model);
        }
        //缓存80个simpleavatar对象
        for (let i = 0; i < 50; i++) {
            let simpleAvatar = new SimpleAvatar(null, null);
            SimpleAvatar.pool.push(simpleAvatar);
        }
        //进入登陆流程
        G.AudioMgr.playBgm(uts.format('sound/scene/{0}.mp3', 81000023));
        G.Uimgr.createForm<LoginView>(LoginView).open(false);

        G.ModuleMgr.loadingModule.setText('账号登录');
        G.ModuleMgr.loadingModule.setActive(false);
        G.ChannelSDK.start();
        G.ChannelSDK.onPlatNoticePrepare(delegate(this, this.onGetNoticeData));
    }

    private onGetNoticeData() {
        uts.log("公告拉取完成")
        G.ChannelSDK.login(delegate(this, this.onSdkLogin));
    }

    private onSdkLogin(result: number) {
        if (result == 0) {
            G.ModuleMgr.loadingModule.setText('请稍候，正在连接服务器...');
            G.ModuleMgr.loginModule.setActive(true);
        }
        else if (result == 1) {
            G.ModuleMgr.loginModule.loginGame();
        }
    }

    private onGetServerList(confirmed: boolean) {
        if (confirmed) {
            this.getServerList(0);
        }
        else {
            UnityEngine.Application.Quit();
        }
    }

    private onMessage(jsonMsg: string) {
        let msg: any;
        if (G.IsAndroidPlatForm) {
            msg = JSON.parse(jsonMsg);
        } else if (G.IsIOSPlatForm) {
            msg = StringUtil.parseParams(jsonMsg);
        }
        if (msg.msgtype < MsgType.MAXCHANNEL) {
            G.ChannelSDK.onMessage(msg);
        }
        if (msg.msgtype != MsgType.REQUESTSERVERS) {
            uts.log('recv on sdk message:' + jsonMsg);
        }
    }

    private onPressQuitKey() {
        uts.log("onPressQuitKey");
        G.ChannelSDK.quit();
    }

    private onApplicationPause(pause: boolean) {
        let runtime = G.DataMgr.runtime;
        let now = UnityEngine.Time.realtimeSinceStartup;
        if (pause) {
            runtime.appPausedAt = now;
        } else {
            if (runtime.everEnterScene && now - runtime.appPausedAt > 60) {
                if (now - runtime.appPausedAt < 300) {
                    G.ModuleMgr.netModule.tryReconnectWhenBack();
                } else {
                    G.reloadGame(false);
                }
            }
        }
    }

    private onKeyDown(key: Game.KeyCode) {
        if (G.freecamera) {
            if (key == Game.KeyCode.Q) {
                G.GuideMgr.pauseAndResume(-1);
                GMRecordManager.toggleManager();
            }
            if (key == Game.KeyCode.Z) {
                G.GuideMgr.pauseAndResume(1);
            }
            if (key == Game.KeyCode.X) {
                G.GuideMgr.pauseAndResume(-1);
            }
            if (key == Game.KeyCode.R) {
                if (UnitStatus.isInRide(G.DataMgr.heroData.unitStatus)) {
                    // 当前上马状态，滑屏下马
                    G.ActionHandler.executeFunction(KeyWord.SUBBAR_FUNCTION_RIDE, 0, 0, -1);
                } else {
                    // 当前下马状态，滑屏上马
                    G.ActionHandler.executeFunction(KeyWord.SUBBAR_FUNCTION_RIDE, 0, 0, 1);
                }
            }
            if (key == Game.KeyCode.RightControl || key == Game.KeyCode.LeftControl) {
                GMRecordManager.toggleLookAt();
            }
            if (key == Game.KeyCode.T) {
                G.ViewCacher.mainView.onAttack();
            }
            if (key == Game.KeyCode.Y) {
                G.ViewCacher.mainView.onClickSkillIcon(0);
            }
            if (key == Game.KeyCode.U) {
                G.ViewCacher.mainView.onClickSkillIcon(1);
            }
            if (key == Game.KeyCode.I) {
                G.ViewCacher.mainView.onClickSkillIcon(2);
            }
            if (key == Game.KeyCode.O) {
                G.ViewCacher.mainView.onClickSkillIcon(3);
            }
            if (key == Game.KeyCode.P) {
                G.ViewCacher.mainView.onClickSkillIcon(4);
            }
            if (key == Game.KeyCode.G) {
                G.ViewCacher.mainView.toggleActiveForAdVideo();
            }
            if (key == Game.KeyCode.H) {
                G.ViewCacher.worldUIElementView.unitBoardRoot.gameObject.SetActive(!G.ViewCacher.worldUIElementView.unitBoardRoot.gameObject.activeSelf);
            }
            if (key == Game.KeyCode.C) {
                G.Uimgr.UICamera.enabled = !G.Uimgr.UICamera.enabled;
            }
            if (key == Game.KeyCode.V) {
                G.DataMgr.settingData.hideMonstersForce = !G.DataMgr.settingData.hideMonstersForce;
                G.UnitMgr.processHideMonster();
            }
            if (key == Game.KeyCode.B) {
                G.DataMgr.settingData.hideNPCsForce = !G.DataMgr.settingData.hideNPCsForce;
                G.UnitMgr.processHideNpc();
            }
            if (key == Game.KeyCode.N) {
                G.DataMgr.settingData.hidePlayerEffectForce = !G.DataMgr.settingData.hidePlayerEffectForce;
                G.UnitMgr.processHideRoleForce();
            }
            if (key == Game.KeyCode.M) {
                G.DataMgr.settingData.hideFollowsForce = !G.DataMgr.settingData.hideFollowsForce;
                G.UnitMgr.processHideRoleForce();
            }
        }
    }

    private onDestroy() {
        Game.IosSdk.onIosSdkToTsMessage = null;
        G.ChannelSDK.destory();
    }
}

new App().run();
