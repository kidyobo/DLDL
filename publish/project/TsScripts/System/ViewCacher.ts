import { Global as G } from "System/global";
import { UIPathData } from 'System/data/UIPathData'
import { MainView, EnumMainViewChild } from 'System/main/view/MainView';
import { WorldUIElementView } from 'System/main/view/WorldUIElementView';
import { TipMarkView } from 'System/tipMark/TipMarkView'
import { TipsView } from 'System/tip/view/TipsView'
import { ShapeCardTipsView } from 'System/tip/view/ShapeCardTipsView'
import { ChengHaoCardTipsView } from 'System/tip/view/ChengHaoCardTipsView'
import { AboveFloatTip } from 'System/floatTip/AboveFloatTip'
import { BelowFloatTip } from 'System/floatTip/BelowFloatTip'
import { PosTextTipView } from 'System/tip/view/PosTextTipView'
import { StrengthenTipView } from 'System/tip/view/StrengthenTipView'
import { MainUIEffectView } from 'System/main/MainUIEffectView'
import { CollectionBar } from "System/main/view/CollectionBar";
import { TaskView } from 'System/quest/TaskView'
import { ChatView } from 'System/chat/ChatView'
import { EmoijPanel } from 'System/chat/EmoijPanel'
import { MessageBox } from "System/uilib/MessageBox"
import { GuideArrowView } from 'System/guide/GuideArrowView'
import { FunctionGuideView } from 'System/guide/FunctionGuideView'
import { GetThingView } from 'System/guide/GetThingView'
import { GetEquipView } from 'System/guide/GetEquipView'
import { GetHeroEquipView } from 'System/guide/GetHeroEquipView'
import { RoleMenuView } from 'System/main/view/RoleMenuView'
import { PopWordView } from 'System/main/view/PopWordView'
import { DisplayPetView } from 'System/guide/DisplayPetView'
import { DisplaySaiJiView } from 'System/guide/DisplaySaiJiView'
import { FlyIconView } from 'System/main/FlyIconView'
import { ServerSelectView, CommonServerSelectView, XiYouServerSelectView } from 'System/login/view/ServerSelectView'
import { BossTipView } from 'System/tip/view/BossTipView'
import { LevelGuideTipView } from "System/main/view/LevelGuideTipView"
import { PetView } from 'System/pet/PetView'
import { HeroView } from 'System/hero/view/HeroView'
import { FirstRechargeView } from 'System/activity/view/FirstRechargeView'
import { JinjieView } from 'System/jinjie/view/JinjieView'
import { BossView } from 'System/pinstance/boss/BossView'
import { HunLiView } from 'System/hunli/HunLiView'
import { StarsTreasuryView } from "System/activity/xingdoubaoku/StarsTreasuryView";

export class ViewCacher {
    private _mainView: MainView;
    //主界面
    public get mainView() {
        return this._mainView;
    };
    private _worldUIElementView: WorldUIElementView;
    //主界面的特效界面
    public get worldUIElementView() {
        return this._worldUIElementView;
    };
    private _tipMarkView: TipMarkView;
    //主界面我要变强界面
    public get tipMarkView() {
        return this._tipMarkView;
    };
    //系统提示和小喇叭 - 上层
    private _aboveTip: AboveFloatTip;
    public get aboveTip() {
        return this._aboveTip;
    };
    //系统提示和小喇叭 - 下层
    private _belowTip: BelowFloatTip;
    public get belowTip() {
        return this._belowTip;
    };
    //定点飘字
    private _posTextTipView: PosTextTipView;
    public get posTextTipView() {
        return this._posTextTipView;
    };
    //属性提升飘字
    private _strengthenTipView: StrengthenTipView;
    public get strengthenTipView() {
        return this._strengthenTipView;
    };
    //界面上的一些特效展示效果
    private _mainUIEffectView: MainUIEffectView;
    public get mainUIEffectView() {
        return this._mainUIEffectView;
    };
    //获得装备飞装备
    private _flyIconView: FlyIconView;
    public get flyIconView() {
        return this._flyIconView;
    }
    //采集条
    private _collectionBar: CollectionBar;
    public get collectionBar() {
        return this._collectionBar;
    };
    //道具tips界面
    private _tipsView: TipsView;
    public get tipsView() {
        return this._tipsView;
    };
    //模型相关的Tips面板
    private _shapeCardTipsView: ShapeCardTipsView;
    public get shapeCardTipsView() {
        return this._shapeCardTipsView;
    };

    //称号的Tips面板
    private _chengHaoCardTipsView: ChengHaoCardTipsView;
    public get chengHaoCardTipsView() {
        return this._chengHaoCardTipsView;
    };
    //任务面板
    private _taskView: TaskView;
    public get taskView() {
        return this._taskView;
    };
    //菜单界面
    private _roleMenuView: RoleMenuView;
    public get roleMenuView() {
        return this._roleMenuView;
    };
    //主界面左侧聊天面板
    private _chatView: ChatView;
    public get chatView() {
        return this._chatView;
    };
    //主界面左侧聊天面板的表情面板
    private _emoijPanel: EmoijPanel;
    public get emoijPanel() {
        return this._emoijPanel;
    };
    //消息提示框
    private _messageBox: MessageBox;
    public get messageBox() {
        return this._messageBox;
    };
    //教程相关界面
    private _functionGuideView: FunctionGuideView
    public get functionGuideView() {
        return this._functionGuideView;
    };

    private _getThingView: GetThingView;
    public get getThingView() {
        return this._getThingView;
    };

    private _displayPetView: DisplayPetView;
    public get displayPetView() {
        return this._displayPetView;
    }

    private _displaySaiJiView: DisplaySaiJiView;
    public get displaySaiJiView() {
        return this._displaySaiJiView;
    }

    private _getEquipView: GetEquipView;
    public get getEquipView() {
        return this._getEquipView;
    };
    //private _getHeroEquipView: GetHeroEquipView;
    //public get getHeroEquipView() {
    //    return this._getHeroEquipView;
    //};

    //弹幕界面
    private _popWordView: PopWordView;
    public get popWordView() {
        return this._popWordView;
    };

    //服务器选择界面
    private _serverSelectView: ServerSelectView;
    public get serverSelectView() {
        return this._serverSelectView;
    };

    //远古boss横幅
    private _bossTipView: BossTipView;
    public get bossTipView() {
        return this._bossTipView;
    };
   
    //主界面主线任务的升级推荐
    private _levelGuideTipView: LevelGuideTipView;
    public get LevelGuideTipView() {
        return this._levelGuideTipView;
    };

    ////主角
    //private _heroView: HeroView;
    //public get HeroView() {
    //    return this._heroView;
    //};

    //伙伴
    private _petView: PetView;
    public get PetView() {
        return this._petView;
    };

    ////一元首充
    //private _firstRechargeView: FirstRechargeView;
    //public get FirstRechargeView() {
    //    return this._firstRechargeView;
    //};

    ////主功能栏 进阶
    //private _jinJie: JinjieView;
    //public get JinjieView() {
    //    return this._jinJie;
    //};

    ////Boss面板
    //private _bossView: BossView;
    //public get BossView() {
    //    return this._bossView;
    //};

    ////魂力面板
    //private _hunLiView: HunLiView;
    //public get HunLiView() {
    //    return this._hunLiView;
    //};

    ////星斗宝库面板
    //private _starsTreasuryView: StarsTreasuryView;
    //public get StarsTreasuryView() {
    //    return this._starsTreasuryView;
    //};

    initView(): void {
        //确保资源全部缓存完毕

        this._worldUIElementView = G.Uimgr.createForm<WorldUIElementView>(WorldUIElementView, true);
        this._worldUIElementView.open();

        this._bossTipView = G.Uimgr.createForm<BossTipView>(BossTipView);
        this._bossTipView.open();
        //这里打开主界面相关和要缓存的界面
        if (G.ChannelSDK.serVerListFromSdk() && !G.ServerData.isNeiWangOssTest) {
            this._serverSelectView = G.Uimgr.createForm<XiYouServerSelectView>(XiYouServerSelectView, true);
        } else {
            this._serverSelectView = G.Uimgr.createForm<CommonServerSelectView>(CommonServerSelectView, true);
        }

        this._mainView = G.Uimgr.createForm<MainView>(MainView, true);

        this._tipMarkView = G.Uimgr.createForm<TipMarkView>(TipMarkView, true);

        this._aboveTip = G.Uimgr.createForm<AboveFloatTip>(AboveFloatTip, true);
        this._aboveTip.open();

        this._belowTip = G.Uimgr.createForm<BelowFloatTip>(BelowFloatTip, true);
        this._belowTip.open();

        this._posTextTipView = G.Uimgr.createForm<PosTextTipView>(PosTextTipView, true);

        this._strengthenTipView = G.Uimgr.createForm<StrengthenTipView>(StrengthenTipView, true);

        this._mainUIEffectView = G.Uimgr.createForm<MainUIEffectView>(MainUIEffectView, true);
        this._mainUIEffectView.open();

        this._flyIconView = G.Uimgr.createForm<FlyIconView>(FlyIconView, true);
        this._flyIconView.open();

        this._collectionBar = G.Uimgr.createForm<CollectionBar>(CollectionBar, true);

        this._tipsView = G.Uimgr.createForm<TipsView>(TipsView, true);

        this._shapeCardTipsView = G.Uimgr.createForm<ShapeCardTipsView>(ShapeCardTipsView, true);

        this._chengHaoCardTipsView = G.Uimgr.createForm<ChengHaoCardTipsView>(ChengHaoCardTipsView, true);

        this._taskView = G.Uimgr.createForm<TaskView>(TaskView, true);

        this._chatView = G.Uimgr.createForm<ChatView>(ChatView, true);

        this._messageBox = G.Uimgr.createForm<MessageBox>(MessageBox, true);

        this._emoijPanel = G.Uimgr.createForm<EmoijPanel>(EmoijPanel, true);

        this._functionGuideView = G.Uimgr.createForm<FunctionGuideView>(FunctionGuideView, true);

        this._getThingView = G.Uimgr.createForm<GetThingView>(GetThingView, true); 
        this._displayPetView = G.Uimgr.createForm<DisplayPetView>(DisplayPetView, true);
        this._displaySaiJiView = G.Uimgr.createForm<DisplaySaiJiView>(DisplaySaiJiView, true);
        this._getEquipView = G.Uimgr.createForm<GetEquipView>(GetEquipView, true);
        //this._getHeroEquipView = G.Uimgr.createForm<GetHeroEquipView>(GetHeroEquipView, true);

        this._roleMenuView = G.Uimgr.createForm<RoleMenuView>(RoleMenuView, true);

        this._popWordView = G.Uimgr.createForm<PopWordView>(PopWordView, true);

        this._levelGuideTipView = G.Uimgr.createForm<LevelGuideTipView>(LevelGuideTipView, true);

        //this._heroView = G.Uimgr.createForm<HeroView>(HeroView, true);

        this._petView = G.Uimgr.createForm<PetView>(PetView, true);

        //this._firstRechargeView = G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView);

        //this._jinJie = G.Uimgr.createForm<JinjieView>(JinjieView, true);

        //this._bossView = G.Uimgr.createForm<BossView>(BossView, true);

        //this._hunLiView = G.Uimgr.createForm<HunLiView>(HunLiView, true);

        //this._starsTreasuryView = G.Uimgr.createForm<StarsTreasuryView>(HunLiView);

        G.MainBtnCtrl.changeState(false, false);

    }

    getViewPath() {
        return [
            UIPathData.MainView,
            UIPathData.WorldUIElementView,
            UIPathData.TipMarkView,
            UIPathData.FloatTip,
            UIPathData.PosTextTipView,
            UIPathData.StrengthenTipView,
            UIPathData.MainUIEffectView,
            UIPathData.CollectionBar,
            UIPathData.TipsView,
            UIPathData.TaskView,
            UIPathData.ChatView,
            UIPathData.MessageBox,
            UIPathData.EmoijPanel,
            UIPathData.FunctionGuideView,
            UIPathData.GetThingView,
            UIPathData.GetEquipView,
            //UIPathData.GetHeroEquipView,
            UIPathData.RoleMenuView,
            UIPathData.PopWordView,
            UIPathData.ServerView,
            UIPathData.LevelGuideTipView,
            //UIPathData.HeroView,
            UIPathData.PetView,
            //UIPathData.FirstRechargeView,
            //UIPathData.JinjieView,
            //UIPathData.BossView,
            //UIPathData.HunLiView,
        ];
    }
}