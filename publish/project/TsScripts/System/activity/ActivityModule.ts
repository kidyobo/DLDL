import { ShenMiShangDianView } from 'System/activity/view/ShenMiShangDianView';
import { ActHomeView } from "System/activity/actHome/ActHomeView";
import { KuaFu3v3Panel } from "System/activity/actHome/KuaFu3v3Panel";
import { KuaFu3v3RewardView } from "System/activity/actHome/KuaFu3v3RewardView";
import { AfterSevenDayActView } from "System/activity/fanLiDaTing/AfterSevenDayActView";
import { FanLiDaTingView } from "System/activity/fanLiDaTing/FanLiDaTingView";
import { FuLiDaTingView } from "System/activity/fldt/FuLiDaTingView";
import { SevenDayView } from "System/activity/fldt/sevenDayLogin/SevenDayView";
import { KaiFuHuoDongView } from "System/activity/kaifuhuodong/KaiFuHuoDongView";
import { LeiChongFanLiView } from "System/activity/kfhd/LeiChongFanLiView";
import { ChongZhiKuangHuanView } from 'System/activity/newKaiFuAct/ChongZhiKuangHuanView';
import { ActTipView } from "System/activity/view/ActTipView";
import { BoatView } from "System/activity/view/BoatView";
import { CeremonyBoxRewardView } from 'System/activity/view/CeremonyBoxRewardView';
import { DailyRechargeView } from "System/activity/view/DailyRechargeView";
import { DaTiView } from "System/activity/view/DaTiView";
import { FirstRechargeView } from "System/activity/view/FirstRechargeView";
import { KuaiSuShengJiView } from "System/activity/view/KuaiSuShengJiView";
import { LuckyWheelView } from "System/activity/view/LuckyWheelView";
import { LxflView } from 'System/activity/view/LxflView';
import { NewYearActView } from "System/activity/view/NewYearActView";
import { TianChiView } from "System/activity/view/TianChiView";
import { XianShiTeMaiView } from "System/activity/view/XianShiTeMaiView";
import { WorldCupActView } from 'System/activity/worldCupAct/WorldCupActView';
import { KaiFuZhiZunDuoBaoView } from "System/activity/YunYingHuoDong/KaiFuZhiZunDuoBaoView";
import { KuaFuZhiZunDuoBaoView } from "System/activity/YunYingHuoDong/KuaFuZhiZunDuoBaoView";
import { XianShiMiaoShaView } from 'System/activity/YunYingHuoDong/XianShiMiaoShaView';
import { YiYuanDuoBaoView } from "System/activity/YunYingHuoDong/YiYuanDuoBaoView";
import { ZhiZunDuoBaoView } from "System/activity/YunYingHuoDong/ZhiZunDuoBaoView";
import { ConsumeRankView } from 'System/activity/view/ConsumeRankView'
import { Constants } from "System/constants/Constants";
import { EnumGuide, EnumThingID } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { ActivityData } from "System/data/ActivityData";
import { FmtData } from "System/data/FmtData";
import { PinstanceData } from "System/data/PinstanceData";
import { RewardIconItemData } from "System/data/vo/RewardIconItemData";
import { XxddData } from "System/data/XxddData";
import { XXDDMainView } from "System/diandeng/XXDDMainView";
import { EventDispatcher } from "System/EventDispatcher";
import { Events } from "System/Events";
import { Global as G } from "System/global";
import { OpenChestView } from "System/guide/OpenChestView";
import { CityChooseView } from "System/guild/view/CityChooseView";
import { GuildView } from "System/guild/view/GuildView";
import { DownloadView } from "System/main/view/DownloadView";
import { EnumMainViewChild, MainView } from "System/main/view/MainView";
import { HfhdData } from "System/mergeActivity/HfhdData";
import { MergeShopView } from "System/mergeActivity/MergeShopView";
import { MergeView } from "System/mergeActivity/MergeView";
import { DoubleChargeView } from "System/pay/DoubleChargeView";
import { BossView } from "System/pinstance/boss/BossView";
import { PinstanceHallView } from "System/pinstance/hall/PinstanceHallView";
import { SxdscRankView } from "System/pinstance/selfChallenge/SxdscRankView";
import { SxdscZhenRongView } from "System/pinstance/selfChallenge/SxdscZhenRongView";
import { ErrorId } from "System/protocol/ErrorId";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { Color } from "System/utils/ColorUtil";
import { MathUtil } from "System/utils/MathUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { VipView } from "System/vip/VipView";
import { LuckyCatView } from './luckyCat/LuckyCatView';
import { XHCZView } from './view/XHCZView';
import { RiChangView } from 'System/richang/RiChangView'




export class ActivityModule extends EventDispatcher {
    private needCheckDiGong = true;

    constructor() {
        super();
        this.addNetListener(Macros.MsgID_ListActivity_Response, this._onListActivityResponse);
        // 日常活动的
        this.addNetListener(Macros.MsgID_DoActivity_Response, this._onDoActivityResponse);
        // 活动状态变更
        this.addNetListener(Macros.MsgID_ActivityStatusChange_Notify, this._onActivityStatusChangeNotify);
        // 活动数据变更
        this.addNetListener(Macros.MsgID_ActivityDataChange_Notify, this._onActivityDataChangeNotify);
        this.addNetListener(Macros.MsgID_TabStatus_Change_Notify, this._onTabStatusChange);
        //快速升级(祈福)
        this.addNetListener(Macros.MsgID_QiFu_Response, this.onQiFuResponse);
        // 资源找回
        this.addNetListener(Macros.MsgID_ZYZHPannel_Response, this.onZyzhPanelResponse);
        //领取资源找回奖励响应
        this.addNetListener(Macros.MsgID_ZYZHReward_Response, this.onZyzhRewardResponse);
        // 激活码兑换
        this.addNetListener(Macros.MsgID_ChangeCDKey_Response, this.onChangeCDKeyResponse);
        // 等级礼包
        this.addNetListener(Macros.MsgID_GetLevelBag_Response, this.onGetLevelBagResponse);
        // 开发活动
        this.addNetListener(Macros.MsgID_KFActInfo_Response, this._onKfActInfoResponse);
        //答题活动
        this.addNetListener(Macros.MsgID_QuestionActivity_Notify, this._onDatiNotify);
        //首充
        this.addNetListener(Macros.MsgID_SCGetInfo_Response, this._onSCGetInfoResponse);
        this.addNetListener(Macros.MsgID_SCGetReward_Response, this._onSCGetRewardResponse);
        //问卷调查
        this.addNetListener(Macros.MsgID_Survey_Response, this._onWJGetRewardResponse);

        this.addNetListener(Macros.MsgID_SC_CanGetReward_Notify, this._onSCCanGetRewardNotify);
        this.addEvent(Events.ServerOverDay, this.onServerOverDay);
        //开服冲榜具体排名
        this.addNetListener(Macros.MsgID_KFQMCBGetRoleInfo_Response, this.onGetKFCBRankResponse);
        //开服冲榜奖励
        this.addNetListener(Macros.MsgID_KFQMCBGetReward_Response, this.onGetKFCBRewardResponse);
        //开服全民冲榜信息
        this.addNetListener(Macros.MsgID_KFQMCBGetInfo_Response, this.onGetKFCBInfoResponse);
        // 开服首充团购
        this.addNetListener(Macros.MsgID_KFSCTGGetInfo_Response, this.onKFSCTGGetInfoResponse);
        this.addNetListener(Macros.MsgID_KFSCTGGetReward_Response, this.onKFSCTGGetRewardResponse);
        this.addNetListener(Macros.MsgID_FirstOpenChange_Response, this._onFirstOpenChangeResponse);
        this.addNetListener(Macros.MsgID_FirstOpenChange_Notify, this._onFirstOpenChangeNotify);

        // 宝典
        this.addNetListener(Macros.MsgID_BaoDian_Response, this.onBaoDianResponse);

        this.addNetListener(Macros.MsgID_SevenDay_Fund_Response, this.onSevenDayResponse);

        this.addNetListener(Macros.MsgID_KFMRMBGetInfo_Response, this.onKFMRMBGetInfoResponse);
        this.addNetListener(Macros.MsgID_KFMRMBGetReward_Response, this.onKFMRMBGetRewardResponse);

        //合服活动
        this.addNetListener(Macros.MsgID_HFActInfo_Response, this.onHfActInfoResponse);

        //活动面板打开通知
        this.addNetListener(Macros.MsgID_ActivityPannel_Notify, this.onctivityPanelNotify);

        //跨服领地战
        this.addNetListener(Macros.MsgID_ZZHC_Pannel_Response, this._onKfLingDiPanelResponse);
        this.addNetListener(Macros.MsgID_ZZHC_Reward_Response, this._onKfLingDiRewardResponse);
        this.addNetListener(Macros.MsgID_ZZHC_Recommond_Response, this._onKfLingDiRecommondResponse);


        this.addNetListener(Macros.MsgID_Charge_Rebate_Panel_Response, this._onDoubleChargePanelResponse);
        this.addNetListener(Macros.MsgID_Charge_Rebate_Response, this._onDoubleChargeRewardResponse);
        this.addNetListener(Macros.MsgID_Set_Charge_Rebate_Response, this._onDefineDoubleChargeRMBResponse);
        this.addNetListener(Macros.MsgID_MHZZ_Pannel_Response, this.onMohuaZhanzhengOpenpanelResponse);
        this.addNetListener(Macros.MsgID_Preview_Reward_Response, this.onPreviewRewardResponse);

        this.addNetListener(Macros.MsgID_SaiJiPannel_Response, this.onSaiJiPannelResponse);
        this.addNetListener(Macros.MsgID_SaiJiActive_Response, this.onSaiJiActiveResponse);
      
    }

    private _onKfLingDiPanelResponse(res: Protocol.ZZHC_Pannel_Response) {
        if (res.m_uiResult != 0) return;

        G.DataMgr.kfLingDiData.PanelInfo = res.m_stPannel;

        let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
        if (actHomeView) actHomeView.updateKfLindDiPanel();

        let guildView = G.Uimgr.getForm<GuildView>(GuildView);
        if (guildView) guildView.onGuildMonsterPanelUpdate();
    }

    private _onKfLingDiRewardResponse(res: Protocol.ZZHC_Reward_Response) {
        if (res.m_uiResult != 0) return;

        G.DataMgr.kfLingDiData.updateRewardStatus(res.m_ucType);
        let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
        if (actHomeView) actHomeView.updateKfLingDiReward();
    }

    private _onDoubleChargeRewardResponse(res: Protocol.Charge_Rebate_Response) {
        if (res.m_iResult != 0) return;

        G.DataMgr.doubleChargeData.RemainTime--;
        G.DataMgr.doubleChargeData.updateStatusList(null, res.m_uiChargeValue);
        let doubleChargeView = G.Uimgr.getForm<DoubleChargeView>(DoubleChargeView);
        if (doubleChargeView) doubleChargeView.updateView();
    }

    private _onDefineDoubleChargeRMBResponse(res: Protocol.Set_Charge_Rebate_Response) {
        if (res.m_iResult != 0) return;

        G.DataMgr.doubleChargeData.CurChargeRMB = res.m_uiChargeValue;
        let shopData = G.DataMgr.payData.ShopData;
        let productID = 0;
        for (let i = 0; i < shopData.length; i++) {
            if (shopData[i].m_iChargeRMB == res.m_uiChargeValue) {
                productID = shopData[i].m_iProductID;
                break;
            }
        }
        if (productID <= 0) return;
        G.ChannelSDK.pay(productID);
    }

    private _onKfLingDiRecommondResponse(res: Protocol.ZZHC_Recommond_Response) {
        if (res.m_uiResult != 0) return;
        let info = G.DataMgr.kfLingDiData.PanelInfo;
        info.m_bRecommondGrade = res.m_bRecommondGrade;
        info.m_iRecommondCityID = res.m_iRecommondCityID;

        let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
        if (actHomeView) actHomeView.updateKfLindDiPanel();
        let cityChooseView = G.Uimgr.getForm<CityChooseView>(CityChooseView);
        if (cityChooseView) cityChooseView.updatePanel();


    }



    private _onDoubleChargePanelResponse(res: Protocol.Charge_Rebate_Panel_Response) {
        if (res.m_iResult != 0) return;

        G.DataMgr.doubleChargeData.setInfo(res);
        let doubleChargeView = G.Uimgr.getForm<DoubleChargeView>(DoubleChargeView);
        if (doubleChargeView == null) return;
        doubleChargeView.updateView();
    }

    private onctivityPanelNotify(response: Protocol.ActivityPannel_Notify) {

        if (response.m_iActType == Macros.START_ACT_BOSS_SUMMON) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.BOSS_SUMMON_PANEL));
            return;
        }

        if (this.canPrompNormal()) {
            let funId = G.DataMgr.activityData.getFuncIDByActID(response.m_iActID);
            if (funId == 0 || G.DataMgr.funcLimitData.isFuncEntranceVisible(funId)) {
                if (response.m_iActID == Macros.ACTIVITY_ID_WORLDBOSS) {
                    //去掉金属之都的弹窗
                    //let activityData = G.DataMgr.activityData;
                    //let heroData = G.DataMgr.heroData;
                    //let info = activityData.getOneBossInfo(response.m_iBossID);
                    //if (info && info.m_iGetScriptCnt == 0) {//有奖励
                    //    let bossLevel: number = MonsterData.getMonsterConfig(response.m_iBossID).m_usLevel;
                    //    let heroLevel = heroData.level;
                    //    if (bossLevel <= heroLevel) {
                    //        let view = G.Uimgr.getForm<ActTipView>(ActTipView);
                    //        if (!view || !view.isOpened) {
                    //            G.Uimgr.createForm<ActTipView>(ActTipView).open(response.m_iActID, 0);
                    //        }
                    //    }
                    //}
                } else {
                    G.Uimgr.createForm<ActTipView>(ActTipView).open(response.m_iActID, 0);
                }
            }
        }
    }

    private onSevenDayResponse(response: Protocol.SevenDayFund_Response) {
        if (ErrorId.EQEC_Success == response.m_ushResultID) {
            if (response.m_stValue.m_stBuyRsp != null) {
                let data = response.m_stValue.m_stBuyRsp.m_stSevenDayFundData;
                //7天投资
                G.DataMgr.activityData.sevenDayFundData = data;
            }

            if (response.m_stValue.m_stGetRsp != null) {
                let data = response.m_stValue.m_stGetRsp.m_stSevenDayFundData;
                //7天投资
                G.DataMgr.activityData.sevenDayFundData = data;
            }

            // let tzjhGetView = G.Uimgr.createForm<TzjhGetView>(TzjhGetView);
            // if (tzjhGetView.isOpened) {
            //     tzjhGetView.updatePanel();
            // }
            let vipView = G.Uimgr.createForm<VipView>(VipView);
            if (vipView.isOpened) {
                vipView.updateTouziPanel();
            }
            // let touziView = G.Uimgr.createForm<TouziView>(TouziView);
            // if (touziView.isOpened) {
            //     touziView.updateTzPanel();
            // }

            G.ActBtnCtrl.update(false);
        }
    }

    /**
	* 拉取开服活动信息的响应函数。
	* @param msg 拉取开服活动信息的服务器回复消息。
	*
	*/
    private _onListActivityResponse(response: Protocol.ListActivity_Response): void {
        let activityData: ActivityData = G.DataMgr.activityData;
        let oldIsReady: boolean = activityData.isReady;
        activityData.setActivityStatusList(response.m_astActivityStatus);
        activityData.updateActivityPanelInfo(response.m_aucActivityPanelInfo);
        for (let activityStatus of response.m_astActivityStatus) {
            this.handleActStatusChange(activityStatus);
        }
        if (!oldIsReady) {
            G.ActBtnCtrl.update(false);
            G.NoticeCtrl.checkFuLiDaTing();
        }
        this.handleActDataChange(0);
    }

    /**
     * 活动状态变化知会消息的响应函数
     * @param notify 活动状态变化知会消息。
     */
    private _onActivityStatusChangeNotify(notify: Protocol.ActivityStatusChange_Notify): void {
        let activityData: ActivityData = G.DataMgr.activityData;
        let ret: boolean = activityData.updateActivityStatus(notify.m_stActivityStatus);
        if (ret) {
            let status = notify.m_stActivityStatus;
            this.handleActStatusChange(notify.m_stActivityStatus);
            this.checkPromp(notify.m_stActivityStatus.m_iID);
            // 刷新活动按钮
            G.ActBtnCtrl.update(false);
            G.MainBtnCtrl.update(false);
            // 刷新界面
            this.handleActDataChange(status.m_iID);
        }
    }

    /**处理各种活动状态变化*/
    private handleActStatusChange(status: Protocol.ActivityStatus) {
        let isOpen = G.DataMgr.activityData.isActivityOpen(status.m_iID);
        if (!isOpen) {
            return;
        }
        switch (status.m_iID) {
            case Macros.ACTIVITY_ID_JUHSACT:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_JUHSACT, Macros.JUHS_OPENPANEL));
                break;
            case Macros.ACTIVITY_ID_REDBAG:
                //if (status.m_ucStatus != Macros.ACTIVITY_STATUS_RUNNING) {
                //    G.DataMgr.activityData.redbag.clear();
                //}
                break;
            //case Macros.ACTIVITY_ID_PVP_BASE:
            //    if (!isOpen && G.DataMgr.fsbData.isMathing) {
            //        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleCommonRequest(Macros.CROSS_SINGLE_EXIT));
            //    }
            //    break;
            case Macros.ACTIVITY_ID_PVP_MULTI:
                // 跨服3v3
                if (!isOpen && G.DataMgr.kf3v3Data.isMathing) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleCommonRequest(Macros.ACTIVITY_ID_PVP_MULTI));
                }
                break;
            case Macros.ACTIVITY_ID_RMBZC:
                if (!isOpen && G.DataMgr.rmbData.isMathing) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_RMBZC, Macros.ACTIVITY_RMBZC_LIST));
                }
                break;
            case Macros.ACTIVITY_ID_SHENMOZHETIAN:
                if (isOpen && status.m_ucStatus != Macros.ACTIVITY_STATUS_RUNNING) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SHENMOZHETIAN, Macros.ACTIVITY_CROSS_BOSS_LIST));
                }
                break;
            case Macros.ACTIVITY_ID_DUANWU:
                if (isOpen) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_DUANWU, Macros.DUANWU_ACT_PANEL));
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_DUANWU, Macros.ZYJ_CZFL_PANEL));
                }
                break;
            case Macros.ACTIVITY_ID_CHARGE_REDBAG:
                if (isOpen) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CHARGE_REDBAG, Macros.CHARGE_REDBAG_PANEL));
                }
                break;
            case Macros.ACTIVITY_ID_HLZP:
                if (isOpen) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HLZP, Macros.HLZP_PANNEL));
                }
                break;
            case Macros.ACTIVITY_ID_ZZHCMAIN:
            case Macros.ACTIVITY_ID_ZZHCSUB:
                if (isOpen) G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfLingDiPanelRequest());
                break;
            case Macros.ACTIVITY_ID_WORLDCUP:
                if (isOpen) G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUP, Macros.ACTIVITY_WORLDCUP_PANEL));
                break;
            case Macros.ACTIVITY_ID_WORLDCUPCHAMPION:
                if (isOpen) G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUPCHAMPION, Macros.ACTIVITY_WORLDCUP_CHAMPION_PANEL));
                break;
            case Macros.ACTIVITY_ID_KFNS:
                if (isOpen) G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_KFNS, Macros.ACTIVITY_KFNS_OPEN));
                break;
            case Macros.ACTIVITY_ID_RUSH_PURCHASE:
                if (isOpen) G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_RUSH_PURCHASE, Macros.ACT_RUSH_PURCHASE_PANEL));
                break;
            case Macros.ACTIVITY_ID_125XHCZ:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_125XHCZ, Macros.Act125_PANNEL));
                break;
            case Macros.ACTIVITY_ID_124DBCZ:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_124DBCZ, Macros.Act124_PANNEL));
                break;
            case Macros.ACTIVITY_ID_TIANJIANGFUSHEN:
                G.DataMgr.taskRecommendData.onFuShenBaoXiangChange();
                break;
            case Macros.ACTIVITY_ID_QUESTIONACTIVITY:
                G.DataMgr.taskRecommendData.onDaTiChange();
                break;
            case Macros.ACTIVITY_ID_GUILDPVPBATTLE:
                G.DataMgr.taskRecommendData.onGuildPVPBattle();
                break;
            case Macros.ACTIVITY_ID_YMZC:
                G.DataMgr.taskRecommendData.onYMZCChange();
                break;
            case Macros.ACTIVITY_ID_SOUTHERNMAN:
                G.DataMgr.taskRecommendData.onSouthAttackChange();
                break;
            case Macros.ACTIVITY_ID_BFQD:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFQD, Macros.BFQD_ACT_CHARGE_REWARD_PANEL));
                break;
            case Macros.ACTIVITY_ID_BFXYACT:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFXYACT, Macros.ACTIVITY_FMT_LIST));
                break;
            case Macros.ACTIVITY_ID_QMHD:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_QMHD, Macros.ACTIVITY_QMHD_PANEL));
                break;
            case Macros.ACTIVITY_ID_HJXN_CHARGE:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HJXN_CHARGE, Macros.ACTIVITY_HJXN_CHARGE_PANNEL));
                break;
            case Macros.ACTIVITY_ID_HISTORICAL_REMAINS:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_PANEL));
                break;
            case Macros.ACTIVITY_ID_WORLDBOSS:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDBOSS, Macros.ACTIVITY_WORLD_BOSS_LIST));
                break;
            case Macros.ACTIVITY_ID_ONLINEGIFT:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_ONLINEGIFT, Macros.ONLINEGIFTACT_SHOW));
                break;
            case Macros.ACTIVITY_ID_LXFL:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_LXFL, Macros.ACTIVITY_LXFL_OPEN));
                break;
            case Macros.ACTIVITY_ID_FOREST_BOSS:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_FOREST_BOSS, Macros.ACTIVITY_FOREST_BOSS_OPEN));
                break;
            case Macros.ACTIVITY_ID_OPENSIGN:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_OPENSIGN, Macros.ACTIVITY_OPENSVR_SIGN_LIST));
                break;
            case Macros.ACTIVITY_ID_COLLECT_EXCHANGE:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLLECT_EXCHANGE, Macros.ACTIVITY_SJDH_PANNEL));
                break;
            case Macros.ACTIVITY_ID_COLOSSEUM:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLOSSEUM, Macros.COLOSSEUM_ACT_OPEN));
                break;
            case Macros.ACTIVITY_ID_SPRING_LOGIN:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SPRING_LOGIN, Macros.ACTIVITY_SPRING_LOGIN_PANEL));
                break;
            case Macros.ACTIVITY_ID_SPRING_CHARGE:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SPRING_CHARGE, Macros.ACTIVITY_SPRING_CHARGE_PANEL));
                break;
            case Macros.ACTIVITY_ID_SDBX:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SDBX, Macros.ACTIVITY_SDBX_OPEN_PANEL));
                break;
            case Macros.ACTIVITY_ID_HOME_BOSS_ACT:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HOME_BOSS_ACT, Macros.ACTIVITY_HOME_BOSS_OPEN));
                break;
            default:
                break;
        }
    }

    private _onDoActivityResponse(response: Protocol.DoActivity_Response): void {
        let activityData: ActivityData = G.DataMgr.activityData;
        if (ErrorId.EQEC_Success != response.m_ushResult) {
            if (response.m_iID == Macros.ACTIVITY_ID_WORLDCUP || response.m_iID == Macros.ACTIVITY_ID_WORLDCUPCHAMPION) {
                return;
            }
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ushResult));
            return;
        }
        //新服活动可以在这里面处理
        this.doActivityResponse(response);

        if (Macros.ACTIVITY_ID_BATHE == response.m_iID) {
            // 温泉
            let view = G.Uimgr.getChildForm<TianChiView>(MainView, EnumMainViewChild.tianChi);
            if (view != null) {
                if (response.m_ucCommand == Macros.ACTIVITY_BATHE_LIST) {
                    view.updateView(response.m_unResultData.m_stBatheListRsp.m_auiReleaseCnt);
                }
                else if (response.m_ucCommand == Macros.ACTIVITY_BATHE_REQ) {
                    view.updateCnt(response.m_unResultData.m_stBatheRsp.m_ucOperatTpye, 5 - response.m_unResultData.m_stBatheRsp.m_ucReleaseCnt);
                }
            }
        } else if (Macros.ACTIVITY_ID_GUOYUN == response.m_iID) {
            // 国运
            this._handleGuoyunResp(response);
        } else if (Macros.ACTIVITY_ID_WORLDBOSS == response.m_iID) {
            // 世界Boss
            this.handleWorldBossResp(response);
        } else if (Macros.ACTIVITY_ID_HOME_BOSS_ACT == response.m_iID) {
            //Boss之家
            this.handBossHomeResp(response);
        } else if (Macros.ACTIVITY_ID_BFXYACT == response.m_iID) {
            // 黑洞塔boss
            this.handleFmtResponse(response);
        } else if (Macros.ACTIVITY_ID_SHENMOZHETIAN == response.m_iID) {
            // 跨服boss
            this.handleKuafuBossResp(response);
        } else if (Macros.ACTIVITY_ID_ONLINEGIFT == response.m_iID) {
            // 在线奖励
            this.handleOnlineGiftResp(response);
        } else if (Macros.ACTIVITY_ID_FOREST_BOSS == response.m_iID) {
            // 落日森林
            G.DataMgr.pinstanceData.updateForestBossData(response.m_unResultData.m_stForestBossActOpenRsp);
            let view = G.Uimgr.getForm<BossView>(BossView);
            if (view != null) {
                view.updateWoodsBoss();
            }
        } else if (Macros.ACTIVITY_ID_OPENSIGN == response.m_iID) {
            G.DataMgr.activityData.kaifuSignData.updateByResponse(response);

        } else if (Macros.ACTIVITY_ID_RMBZC == response.m_iID) {
            this.handleRmbZc(response);
        } else if (Macros.ACTIVITY_ID_SIGN == response.m_iID) {
            // 每日签到
            this.handleSignResp(response);

        } else if (Macros.ACTIVITY_ID_COLLECT_EXCHANGE == response.m_iID) {
            // 收集兑换
            this.handleCollectExchange(response);
        } else if (Macros.ACTIVITY_ID_HISTORICAL_REMAINS == response.m_iID) {
            // 宝石试炼
            this._handleMingWenShiLian(response);
        } else if (Macros.ACTIVITY_ID_DAILYCONSUME_CONSUME == response.m_iID) {
            //消费送好礼
            //if (Macros.DAILY_CONSUME_PANEL == response.m_ucCommand) {
            //    var m_sDailyConsumePanel: Protocol.DailyConsumeRsp = response.m_unResultData.m_sDailyConsumePanel;
            //    G.DataMgr.activityData.dailyConsumeNum = m_sDailyConsumePanel.m_ulConsume;
            //    let m_iIDList: Vector.<int> = m_sDailyConsumePanel.m_iIDList;
            //    for each (var hasGetId: int in m_iIDList)
            //    {
            //        m_activityData.updateDailyConsumeDate(hasGetId);
            //    }
            //    m_activityData.m_sDailyConsumePanel = m_sDailyConsumePanel.clone(m_activityData.m_sDailyConsumePanel);
            //    sendEvent(EventTypes.updateXFSHLInfo);
            //}
            //else if (Macros.DAILY_CONSUME_GET == response.m_ucCommand) {
            //    let m_ucDailyConsumeGet: number = response.m_unResultData.m_ucDailyConsumeGet;
            //    m_activityData.m_ucDailyConsumeGet = m_ucDailyConsumeGet;
            //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_DAILYCONSUME_CONSUME, Macros.DAILY_CONSUME_PANEL));
            //    sendEvent(EventTypes.updateXFSHLInfo);
            //}
            //消费排行榜
            if (Macros.CONSUME_RANK_PANEL == response.m_ucCommand) {
                let m_stConsumeRankPanel: Protocol.ConsumeRankInfoRsp = response.m_unResultData.m_stConsumeRankPanel;
                G.DataMgr.activityData.m_stConsumeRankPanel = m_stConsumeRankPanel;
                //先注释为刷新消费排行版面板
                //sendEvent(EventTypes.updateXFPHBInfo);
            }
            else if (Macros.CONSUME_RANK_LIST_GET == response.m_ucCommand) {
                let m_stConsumeRankList: Protocol.ConsumeRankListRsp = response.m_unResultData.m_stConsumeRankList;
                G.DataMgr.activityData.m_stConsumeRankList = m_stConsumeRankList;
                //sendEvent(EventTypes.updateXFPHBInfo);
            }
            else if (Macros.CONSUME_RANK_GET_REWARD == response.m_ucCommand) {
                G.DataMgr.activityData.m_stConsumeRankPanel.m_ucFlag = 1;
                //sendEvent(EventTypes.updateXFPHBInfo);
            }
        } else if (Macros.ACTIVITY_ID_JUHSACT == response.m_iID) {
            this.handleTzjhStatus(response);
        } else if (Macros.ACTIVITY_ID_PVP_MULTI == response.m_iID) {
            // 跨服3v3
            G.DataMgr.kf3v3Data.updatePvpV3Data(response);
            let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
            if (actHomeView != null) {
                actHomeView.updateKuaFu3V3TipMark();
            }
            let view = G.Uimgr.getSubFormByID<KuaFu3v3Panel>(ActHomeView, KeyWord.OTHER_FUNCTION_CROSS3V3);
            if (view != null) {
                view.onKuaFu3v3DataChanged();
            }
            if (Macros.ACTIVITY_CROSS3V3_GET_REWARD == response.m_ucCommand) {
                // 领奖了，刷新奖励
                let rewardView = G.Uimgr.getForm<KuaFu3v3RewardView>(KuaFu3v3RewardView);
                if (null != rewardView) {
                    rewardView.onGetReward();
                }
            }
        } else if (Macros.ACTIVITY_ID_CROSS_DDL == response.m_iID) {
            //跨服点灯/星星点灯
            this.handleXxdd(response);
        } else if (Macros.ACTIVITY_ID_COLOSSEUM == response.m_iID) {
            // 斗兽斗兽场
            let siXiangData = G.DataMgr.siXiangData;
            if (Macros.COLOSSEUM_ACT_GET_REWARD == response.m_ucCommand) {
                siXiangData.updateByActResp(response.m_unResultData.m_stColosseumGetRewardRsp);
            }
            else if (Macros.COLOSSEUM_ACT_BUY_TIME == response.m_ucCommand) {
                siXiangData.updateByActResp(response.m_unResultData.m_stColosseumBuyTimeRsp);
            }
            else if (Macros.COLOSSEUM_ACT_CLEAR_TIME == response.m_ucCommand) {
                siXiangData.updateByActResp(response.m_unResultData.m_stColosseumClearTimeRsp);
            }
            else if (Macros.COLOSSEUM_ACT_ON_BATTLE == response.m_ucCommand) {
                siXiangData.updateByActResp(response.m_unResultData.m_stColosseumOnBattleRsp);
            }
            else if (Macros.COLOSSEUM_ACT_OPEN == response.m_ucCommand) {
                siXiangData.updateByActResp(response.m_unResultData.m_stColosseumOpenRsp);
            }
            else if (Macros.COLOSSEUM_ACT_GET_GRADE_REWARD == response.m_ucCommand) {
                siXiangData.updateByActResp(response.m_unResultData.m_stColosseumGetGradeRewardRsp);
            }

            let view = G.Uimgr.getForm<ActHomeView>(ActHomeView);
            if (view != null) {
                view.onSxdscActChange();
            }
            let rankView = G.Uimgr.getForm<SxdscRankView>(SxdscRankView);
            if (rankView != null) {
                rankView.onSxdscActChange();
            }
            let zhenRongView = G.Uimgr.getForm<SxdscZhenRongView>(SxdscZhenRongView);
            if (zhenRongView != null) {
                zhenRongView.onSxdscActChange();
            }
        }

        G.ActBtnCtrl.update(false);
        G.NoticeCtrl.checkFuLiDaTing();
    }


    /**
    * 运营活动返回
    * @param
    */
    private doActivityResponse(response: Protocol.DoActivity_Response): void {
        let activityData = G.DataMgr.activityData;
        if (response.m_iID == Macros.ACTIVITY_ID_ZZZD) {
            //至尊争夺
            if (response.m_ucCommand == Macros.ZZZD_CHARGE_PANEL) {
                activityData.zzzdData = response.m_unResultData.m_stZZZDChargePanelRsp;
                let data = response.m_unResultData.m_stZZZDChargePanelRsp.m_stCfgList;
                if (data != null) {
                    let view = G.Uimgr.getForm<ZhiZunDuoBaoView>(ZhiZunDuoBaoView);
                    if (view != null) {
                        for (let i = 0; i < data.length; i++) {
                            view.updateListData(data[i]);
                        }
                        view.updatePanel();
                    }
                }
            }else if(response.m_ucCommand == Macros.CZJXZD_REWARD){
                let data = response.m_unResultData.m_stZZZDChargePanelRsp.m_stCfgList;
                let view = G.Uimgr.getForm<ZhiZunDuoBaoView>(ZhiZunDuoBaoView);
                    if (view != null) {
                        for (let i = 0; i < data.length; i++) {
                            view.updateListData(data[i]);
                        }
                        view.updatePanel();
                    }
            }
        }
        else if (response.m_iID == Macros.ACTIVITY_ID_CROSS_ZZZD) {
            if (response.m_ucCommand == Macros.CZJXZD_OPEN_PANNEL) {
                //跨服至尊争夺
                activityData.czzzzdData = response.m_unResultData.m_stJXZDPannel;
                let data = response.m_unResultData.m_stJXZDPannel.m_stCfgList;
                 //至尊奖励是否已经领取
                 G.DataMgr.activityData.isGetJojinReward = (response.m_unResultData.m_stJXZDPannel.m_ucRewardGet == 0);
                if (data != null) {
                    let view = G.Uimgr.getForm<KuaFuZhiZunDuoBaoView>(KuaFuZhiZunDuoBaoView);
                    if (view != null) {
                        for (let i = 0; i < data.length; i++) {
                            view.updateListData(data[i]);
                        }
                        view.updatePanel();
                    }
                }
            } else if (response.m_ucCommand == Macros.CZJXZD_REWARD) {
                G.DataMgr.activityData.isGetJojinReward = (response.m_unResultData.m_ucJXZDGetRsp == 0);
                let view = G.Uimgr.getForm<KuaFuZhiZunDuoBaoView>(KuaFuZhiZunDuoBaoView);
                    if (view != null) {
                        view.updatePanel();
                    }
            }
           
        }
        else if (response.m_iID == Macros.ACTIVITY_ID_XYZP) {
            //幸运转盘
            if (response.m_ucCommand == Macros.XYZP_PANNEL) {
                G.DataMgr.luckyWheelData.onUpdatePanel(response.m_unResultData.m_stXYZPPannel);
            }
            else if (response.m_ucCommand == Macros.XYZP_DRAW) {
                G.DataMgr.luckyWheelData.onUpdateDraw(response.m_unResultData.m_stXYZPDraw);
            }
            else if (response.m_ucCommand == Macros.XYZP_RECORD) {
                G.DataMgr.luckyWheelData.onUpdateRecord(response.m_unResultData.m_stXYZPRecordRsp);
            }
            let view = G.Uimgr.getForm<LuckyWheelView>(LuckyWheelView);
            if (view != null) {
                if (response.m_ucCommand == Macros.XYZP_PANNEL) {
                    view.onUpdatePanel(response.m_unResultData.m_stXYZPPannel);
                }
                else if (response.m_ucCommand == Macros.XYZP_DRAW) {
                    view.onUpdateDraw(response.m_unResultData.m_stXYZPDraw);
                }
                else if (response.m_ucCommand == Macros.XYZP_RECORD) {
                    view.onUpdateRecord(response.m_unResultData.m_stXYZPRecordRsp);
                }
            }
        }
        else if (response.m_iID == Macros.ACTIVITY_ID_HLZP) {
            //if (response.m_ucCommand == Macros.HLZP_PANNEL) {
            //    activityData.hlzp.setPanel(response.m_unResultData.m_stHLZPOpenRsp);
            //}
            //else if (response.m_ucCommand == Macros.HLZP_DRAW) {
            //    activityData.hlzp.setDraw(response.m_unResultData.m_stHLZPTrunRsp);
            //}
            //else if (response.m_ucCommand == Macros.HLZP_RECORD) {
            //    activityData.hlzp.setRecord(response.m_unResultData.m_stHLZPRecordRsp);
            //}
            //sendEvent(EventTypes.updateHlzpData);
        }
        else if (response.m_iID == Macros.ACTIVITY_ID_JU_BAO_PENG) {
            //聚宝盆
            if (response.m_ucCommand == Macros.ACTIVITY_JBP_GET_REWARD) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_JU_BAO_PENG, Macros.ACTIVITY_JBP_OPEN_PANEL));
            }
            else if (response.m_ucCommand == Macros.ACTIVITY_JBP_OPEN_PANEL) {
                activityData.jbpStatusValue = response.m_unResultData.m_stJBPOpenPanel;
                activityData.jbpStatusValue.m_uiLeftTime += Math.floor(G.SyncTime.getCurrentTime() / 1000);
                let data = response.m_unResultData.m_stJBPOpenPanel.m_stData;
                if (data != null) {
                    let view = G.Uimgr.getForm<NewYearActView>(NewYearActView);
                    if (view != null) {
                        for (let i = 0; i < data.length; i++) {
                            view.updateListData(data[i]);
                        }
                        view.updateJuBaoPanel();
                    }
                }
            }
        }
        //跨服消费排行活动
        else if (response.m_iID == Macros.ACTIVITY_ID_126CROSSCHARGE) {
            let view = G.Uimgr.getForm<ConsumeRankView>(ConsumeRankView);;
            G.DataMgr.consumeRankData.rewardNotify = false;
            if (response.m_ucCommand == Macros.Act126_PANEL) {  //面板数据
                G.DataMgr.consumeRankData.CSAct126Panel = response.m_unResultData.m_stAct126Panel;     
                if (view) {
                    view.updateView();
                }
            }
            else if (response.m_ucCommand == Macros.Act126_GET_REWARD) {    //领奖通知
                G.DataMgr.consumeRankData.CSAct126Panel.m_ucRewardGet = response.m_unResultData.m_ucAct126GetRewardRsp;
                if (view) {
                    view.updateJoinView();
                }
            }
            else if (response.m_ucCommand == Macros.Act126_REWARD_NOTIFY) {     //红点通知
                G.DataMgr.consumeRankData.rewardNotify = true;
            }

        }
        //图腾活动:图腾祝福
        else if (response.m_iID == Macros.ACTIVITY_ID_TTZF) {
            //if (response.m_ucCommand == Macros.TTZF_ACT_PANEL) {
            //    activityData.ttbz.ttzfValue = response.m_unResultData.m_stTTZFPanelRsp.m_uiZhuFuValue;
            //}
            //else if (response.m_ucCommand == Macros.TTZF_ACT_WISH) {
            //    activityData.ttbz.ttzfValue = response.m_unResultData.m_stTTZFWishRsp.m_uiZhuFuValue;
            //}
            //else if (response.m_ucCommand == Macros.TTZF_ACT_GET_REWARD) {
            //    activityData.ttbz.ttzfValue = response.m_unResultData.m_stTTZFGetRewardRsp.m_uiZhuFuValue;
            //}
            //sendEvent(EventTypes.updateTtbsData);

        }
        //图腾活动:充值大回馈
        else if (response.m_iID == Macros.ACTIVITY_ID_FESTIVAL_CHARGE) {
            //if (response.m_ucCommand == Macros.FESTIVAL_CHARGE_PANEL) {
            //    activityData.ttbz.festivalChargeData = response.m_unResultData.m_stFestivalChargePanel;
            //}
            //else if (response.m_ucCommand == Macros.FESTIVAL_CHARGE_GET) {
            //    activityData.ttbz.festivalChargeData = response.m_unResultData.m_stFestivalChargeGet;
            //}
            //sendEvent(EventTypes.updateTtbsData);
        }
        //图腾活动:消费送豪礼
        else if (response.m_iID == Macros.ACTIVITY_ID_FESTIVAL_CONSUME) {
            //if (response.m_ucCommand == Macros.FESTIVAL_CONSUME_PANEL) {
            //    activityData.ttbz.festivalConsumeData = response.m_unResultData.m_stFestivalConsumePanel;
            //}
            //else if (response.m_ucCommand == Macros.FESTIVAL_CONSUME_GET) {
            //    activityData.ttbz.festivalConsumeData = response.m_unResultData.m_stFestivalConsumeGet;
            //}
            //sendEvent(EventTypes.updateTtbsData);
        }
        //百服活动
        else if (response.m_iID == Macros.ACTIVITY_ID_BFQD) {
            //var bfqd: BfqdData = DataModule.ins.bfqd;
            //if (response.m_ucCommand == Macros.BFQD_ACT_DRAW_PANEL) {
            //    bfqd.setBFQDDrawPanel(response.m_unResultData.m_stBFQDDrawPanelRsp);
            //}
            //else if (response.m_ucCommand == Macros.BFQD_ACT_DRAW) {
            //    bfqd.setBFQDDraw(response.m_unResultData.m_stBFQDDrawRsp);
            //}
            //else if (response.m_ucCommand == Macros.BFQD_ACT_CHARGE_REWARD_PANEL) {
            //    bfqd.BFQDChargePanel(response.m_unResultData.m_stBFQDChargePanelRsp);
            //}
            //else if (response.m_ucCommand == Macros.BFQD_ACT_CHARGE_REWARD) {
            //    bfqd.BFQDChargeReward(response.m_unResultData.m_stBFQDChargeRewardRsp);
            //}
            //else if (response.m_ucCommand == Macros.BFQD_ACT_RANK_PANEL) {
            //    bfqd.setBFQDConsumeRank(response.m_unResultData.m_stBFQDConsumeRankRsp);
            //}

            //else if (response.m_ucCommand == Macros.BFQD_ACT_LOGIN_REWARD_PANEL) {
            //    bfqd.loginRewardStatus = response.m_unResultData.m_ucBFQDLoginPanelRsp;
            //}
            //else if (response.m_ucCommand == Macros.BFQD_ACT_LOGIN_REWARD) {
            //    bfqd.loginRewardStatus = response.m_unResultData.m_ucBFQDLoginRewardRsp;
            //}
            //sendEvent(EventTypes.updateBfqdData);
        }
        //端午活动
        else if (response.m_iID == Macros.ACTIVITY_ID_DUANWU) {
            //if (response.m_ucCommand == Macros.DUANWU_ACT_PANEL) {
            //    activityData.duanwu.updateData(response.m_unResultData.m_stDuanWuPanelRsp);
            //}
            //else if (response.m_ucCommand == Macros.DUANWU_ACT_EXCHANGE) {
            //    activityData.duanwu.updateData(response.m_unResultData.m_stDuanWuExchangeRsp);
            //}
            //else if (response.m_ucCommand == Macros.DUANWU_ACT_GET_REWARD) {
            //    activityData.duanwu.updateData(response.m_unResultData.m_stDWReachGetRsp);
            //}
            //else if (response.m_ucCommand == Macros.ZYJ_CZFL_PANEL) {
            //    activityData.duanwu.updateCzflPanel(response.m_unResultData.m_stZYJ_CZFLPanelRsp)
            //}
            //else if (response.m_ucCommand == Macros.ZYJ_CZFL_GET_REWARD) {
            //    activityData.duanwu.updateCzflGet(response.m_unResultData.m_stZYJ_CZFLGetRsp)
            //}
            //else if (response.m_ucCommand == Macros.DUANWU_ACT_LOGIN_REWARD) {
            //    activityData.duanwu.updateLoginReward(response.m_unResultData.m_ucDWLoginRewardRsp);
            //}

            //sendEvent(EventTypes.updateDuanwuData);
        }
        //猎户座
        else if (response.m_iID == Macros.ACTIVITY_ID_JZXG) {
            //if (response.m_ucCommand == Macros.JZXG_ACT_OPEN) {
            //    activityData.jzxg.updatePanel(response.m_unResultData.m_stJZXGOpen);
            //}
            //else if (response.m_ucCommand == Macros.JZXG_ACT_BUY) {
            //    activityData.jzxg.updateData(response.m_unResultData.m_stJZXGBuy);
            //}
            //sendEvent(EventTypes.updateJzxgInfo);
        }
        else if (response.m_iID == Macros.ACTIVITY_ID_HLFP)//欢乐翻牌
        {
            //if (response.m_ucCommand == Macros.ACT_HLFP_GET) {
            //    activityData.hlfp.updateHlfpByGet();
            //}
            //else if (response.m_ucCommand == Macros.ACT_HLFP_DEAL) {
            //    activityData.hlfp.updateHlfpByDeal(response.m_unResultData.m_stHLFPDealRsp);
            //}
            //else if (response.m_ucCommand == Macros.ACT_HLFP_REFRESH) {
            //    activityData.hlfp.updateHlfpByRefresh(response.m_unResultData.m_stHLFPRefreshRsp);
            //}
            //else if (response.m_ucCommand == Macros.ACT_HLFP_LIST) {
            //    activityData.hlfp.updateList(response.m_unResultData.m_stHLFPListRsp);
            //}
            //sendEvent(EventTypes.updateHlfpData);
        }
        else if (response.m_iID == Macros.ACTIVITY_ID_CHARGE_REDBAG)//激情红包
        {
            //if (response.m_ucCommand == Macros.CHARGE_REDBAG_PANEL) {
            //    activityData.redbag.setChargeRedbagPanel(response.m_unResultData.m_stCharge_RedBagPanelRsp);
            //}
            //else if (response.m_ucCommand == Macros.CHARGE_REDBAG_REWARD) {
            //    activityData.redbag.setChargeRedbagPanel(response.m_unResultData.m_stCharge_RedBagGetRsp);
            //}
            //sendEvent(EventTypes.updateRedbag1Data);
        }
        else if (Macros.ACTIVITY_ID_WORLDCUP == response.m_iID) {
            //世界杯——火热竞猜
            let view = G.Uimgr.getForm<WorldCupActView>(WorldCupActView);

            if (response.m_ucCommand == Macros.ACTIVITY_WORLDCUP_PANEL) {
                G.DataMgr.activityData.worldCupPanelData = response.m_unResultData.m_stWCupPanelRsp;
                if (view != null)
                    view.updateJingCaiPanel();
            }
            else if (response.m_ucCommand == Macros.ACTIVITY_WORLDCUP_BET_SCORE) {
                let WCupBetScoreRsp = response.m_unResultData.m_stWCupBetScoreRsp;
                G.DataMgr.activityData.worldCupPanelData = WCupBetScoreRsp;
                if (view != null)
                    view.updateJingCaiPanel();
            }
            else if (response.m_ucCommand == Macros.ACTIVITY_WORLDCUP_BET_WIN) {
                let WCupBetWinRsp = response.m_unResultData.m_stWCupBetWinRsp;
                G.DataMgr.activityData.worldCupPanelData = WCupBetWinRsp;
                if (view != null)
                    view.updateJingCaiPanel();
            }
            else if (response.m_ucCommand == Macros.ACTIVITY_WORLDCUP_RANK) {
                G.DataMgr.activityData.worldCupRankData = response.m_unResultData.m_stWCupRankRsp;

            }
        }
        //春节活动--充值返利
        else if (response.m_iID == Macros.ACTIVITY_ID_HJXN_CHARGE) {
            if (response.m_ucCommand == Macros.ACTIVITY_HJXN_CHARGE_PANNEL) {
                let info = response.m_unResultData.m_stHJXNChargePannelRsp;
                G.DataMgr.activityData.updateChongZhiZheKouData(info.m_iChargeValue, info.m_iGetRewardTimes)
            } else if (response.m_ucCommand == Macros.ACTIVITY_HJXN_CHARGE_REWARD) {
                let info = response.m_unResultData.m_stHJXNChargeRewardRsp;
                G.DataMgr.activityData.updateChongZhiZheKouData(info.m_iChargeValue, info.m_iGetRewardTimes)
            }

            let view = G.Uimgr.getForm<NewYearActView>(NewYearActView);
            if (view != null) {
                view.updateChongZhiZheKouPanel();
            }

        }

        else if (response.m_iID == Macros.ACTIVITY_ID_KFNS) {
            if (response.m_ucCommand == Macros.ACTIVITY_KFNS_OPEN) {
                activityData.newYearData.kfnsInfo = response.m_unResultData.m_stKFNSActOpenRsp;
                let view = G.Uimgr.getForm<NewYearActView>(NewYearActView);
                if (view) {
                    view.updateKuaFuBoss();
                }
            }

        }
        else if (response.m_iID == Macros.ACTIVITY_ID_LXFL) {
            //连续返利活动         
            if (response.m_ucCommand == Macros.ACTIVITY_LXFL_OPEN) {
                G.DataMgr.activityData.lxflData = response.m_unResultData.m_stLXFLPanelRsp;
                if (G.DataMgr.activityData.lxflFlag) {
                    G.DataMgr.activityData.lxflFlag = false;
                    G.Uimgr.createForm<LxflView>(LxflView).open()
                }
            }
            else if (response.m_ucCommand == Macros.ACTIVITY_LXFL_GET) {
                G.DataMgr.activityData.lxflData = response.m_unResultData.m_stLXFLGetRsp;
                let view = G.Uimgr.getForm<LxflView>(LxflView);
                if (view) {
                    view.updateAwardList();
                }
            }
        }
        else if (Macros.ACTIVITY_ID_WORLDCUPCHAMPION == response.m_iID) {
            //世界杯——冠军之路
            let view = G.Uimgr.getForm<WorldCupActView>(WorldCupActView);
            if (response.m_ucCommand == Macros.ACTIVITY_WORLDCUP_CHAMPION_PANEL) {
                G.DataMgr.activityData.worldCupChampionPanelData = response.m_unResultData.m_stWCupChampionPanelRsp;
                G.DataMgr.activityData.setWorldCupChampionCfgMap();
                if (view != null) {
                    view.updateGuanJunPanel();
                }
            }
            if (response.m_ucCommand == Macros.ACTIVITY_WORLDCUP_CHAMPION_GUESS) {
                G.TipMgr.addMainFloatTip("支持成功");
                G.DataMgr.activityData.worldCupChampionPanelData = response.m_unResultData.m_stWCupChampionGuess;
                if (view != null) {
                    view.updateGuanJunPanel();
                }
            }
            if (response.m_ucCommand == Macros.ACTIVITY_WORLDCUP_CHAMPION_GET) {
                G.DataMgr.activityData.worldCupChampionPanelData = response.m_unResultData.m_stWCupChampionGet;
                if (view != null) {
                    view.updateGuanJunPanel();
                }
            }
        } else if (response.m_iID == Macros.ACTIVITY_ID_QMHD) {
            //全民(｡･∀･)ﾉﾞ嗨
            if (Macros.ACTIVITY_QMHD_PANEL == response.m_ucCommand) {
                //打开面板
                let info = response.m_unResultData.m_stQMHDPanelRsp;
                G.DataMgr.activityData.updateQMHDActPanelRsp(info);
            }
            else if (Macros.ACTIVITY_QMHD_REWARD == response.m_ucCommand) {
                //领取奖励
                let bitFlag = response.m_unResultData.m_uiQMHDRewardRsp;
                G.DataMgr.activityData.udateQMHDActRewardBitFlag(bitFlag);
            }

            let view = G.Uimgr.getForm<NewYearActView>(NewYearActView);
            if (view != null) {
                view.updateQuanMingHaiQiPanel();
            }
        } else if (response.m_iID == Macros.ACTIVITY_ID_SDBX) {
            //盛典宝箱
            let view = G.Uimgr.getForm<CeremonyBoxRewardView>(CeremonyBoxRewardView);

            //盛典宝箱排行奖励
            if (response.m_ucCommand == Macros.ACTIVITY_SDBX_OPEN_PANEL) {
                //打开面板
                activityData.sdbxPanelInfo = response.m_unResultData.m_stSDBXPanelRsp;
                if (view) {
                    view.updataPanel();
                }
            } else if (response.m_ucCommand == Macros.ACTIVITY_SDBX_GET_REWARD) {
                //领奖
                activityData.sdbxPanelInfo.m_uiBitFlag = response.m_unResultData.m_uiSDBXRewardRsp;
                if (view) {
                    view.updateByRewardResponse(response.m_unResultData.m_stSDBXPanelRsp);
                }
            }
            if (response.m_ushResult = 0) {
                let view = G.Uimgr.getForm<NewYearActView>(NewYearActView);
                if (view) {
                    view.updateCeremonyBox();
                }
            }

        }
        //春节活动--充值
        else if (response.m_iID == Macros.ACTIVITY_ID_SPRING_CHARGE) {
            let data = activityData.newYearData;

            if (response.m_ucCommand == Macros.ACTIVITY_SPRING_CHARGE_PANEL) {
                data.cjinfo = response.m_unResultData.m_stSpringChargePannelRsp;
                //data.NewYearChargeRsp();
            }
            else if (response.m_ucCommand == Macros.ACTIVITY_SPRING_CHARGE_REWARD) {
                let info = response.m_unResultData.m_stSpringChargeRewardRsp;
                data.cjinfo.m_iChargeValue = info.m_iChargeValue;
                data.cjinfo.m_uiChargeRewardFlag = info.m_uiChargeRewardFlag;
            }
            let view = G.Uimgr.getForm<NewYearActView>(NewYearActView);
            if (view != null) {
                view.updateLeiJieChongZhiPanel();
            }
        }
        //春节活动--登陆
        else if (response.m_iID == Macros.ACTIVITY_ID_SPRING_LOGIN) {
            let data = activityData.newYearData;

            if (response.m_ucCommand == Macros.ACTIVITY_SPRING_LOGIN_PANEL) {
                data.cjLoginInfo = response.m_unResultData.m_stSpringLoginPannelRsp;
            }
            else if (response.m_ucCommand == Macros.ACTIVITY_SPRING_LOGIN_REWARD) {
                data.cjLoginInfo = response.m_unResultData.m_stSpringLoginRewardRsp;
            }
            let view = G.Uimgr.getForm<NewYearActView>(NewYearActView);
            if (view != null) {
                view.updaterChunJieDengluPanel();
            }
        }
        else if (response.m_iID == Macros.ACTIVITY_ID_RUSH_PURCHASE) {
            let view = G.Uimgr.getForm<XianShiMiaoShaView>(XianShiMiaoShaView);
            let activityData = G.DataMgr.activityData;
            if (Macros.ACT_RUSH_PURCHASE_PANEL == response.m_ucCommand) {
                activityData.xsmsData = response.m_unResultData.m_stRushPurchasePanel;
                if (view != null)
                    view.updateView();
            }
            else if (Macros.ACT_RUSH_PURCHASE_BUY == response.m_ucCommand) {
                if (response.m_unResultData.m_stRushPurchaseRsp.m_ucBuyStatus == 1) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_RUSH_PURCHASE, Macros.ACT_RUSH_PURCHASE_PANEL));
                    if (view != null)
                        view.updateView();
                }
            }
        }
        else if (response.m_iID == Macros.ACTIVITY_ID_124DBCZ) {
            //单笔充值
            if (response.m_ucCommand == Macros.Act124_PANNEL) {
                G.DataMgr.kaifuActData.danBiCzInfo = response.m_unResultData.m_stAct124Pannel;
            }
            else if (response.m_ucCommand == Macros.Act124_REWARD) {
                G.DataMgr.kaifuActData.danBiCzInfo = response.m_unResultData.m_stAct124Reward;
            }
            let view = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
            if (view != null) {
                view.updateDanBiChongZhiPanel();
            }
        }
        else if (response.m_iID == Macros.ACTIVITY_ID_125XHCZ) {
            //循环充值
            if (response.m_ucCommand == Macros.Act125_PANNEL) {
                G.DataMgr.kaifuActData.xunHuanCzInfo = response.m_unResultData.m_stAct125Pannel;
            }
            else if (response.m_ucCommand == Macros.Act125_REWARD) {
                G.DataMgr.kaifuActData.xunHuanCzInfo = response.m_unResultData.m_stAct125Reward;
            }
            let xhczView = G.Uimgr.getForm<XHCZView>(XHCZView);
            if (xhczView != null) {
                xhczView.updateView();
            }
            let view = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
            if (view != null) {
                view.updateXunHuanChongZhiPanel();
            }
            // let view = null;
            // if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNC_FLDT)) {
            //     view = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
            // } else {
            //     view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
            // }
            // if (view != null) {
            //     view.updateXunHuanChongZhiPanel();
            // }
        }
        else if(response.m_iID == Macros.ACTIVITY_ID_BLACK_STORE){
            if(response.m_ucCommand == Macros.Act63_PANEL){
                G.DataMgr.activityData.strotId = response.m_unResultData.m_stAct63Panel.m_iStoreID;
                G.DataMgr.activityData.nextRefreshTime = response.m_unResultData.m_stAct63Panel.m_uiNextRefreshTime;
                G.DataMgr.activityData.refreshTimes = response.m_unResultData.m_stAct63Panel.m_iRefreshTimes;
            } else if (response.m_ucCommand == Macros.Act63_REFRESH) {
                G.DataMgr.activityData.strotId = response.m_unResultData.m_stAct63RefreshRsp.m_iStoreID;
                G.DataMgr.activityData.nextRefreshTime = response.m_unResultData.m_stAct63RefreshRsp.m_uiNextRefreshTime;
                G.DataMgr.activityData.refreshTimes = response.m_unResultData.m_stAct63RefreshRsp.m_iRefreshTimes;
            }
            let view = G.Uimgr.getForm<ShenMiShangDianView>(ShenMiShangDianView);
            if (view != null) {
                view.updateStoreId(Macros.Act63_REFRESH);
            }
        }
        G.ActBtnCtrl.update(false);
    }







    private handleCollectExchange(response: Protocol.DoActivity_Response) {
        let activityData = G.DataMgr.activityData;
        if (response.m_ucCommand == Macros.ACTIVITY_SJDH_PANNEL) //打开集字送好礼面板响应
        {
            activityData.updateCollectExchange(response.m_unResultData.m_stSJDHActPannelRsp);
            let view = G.Uimgr.getForm<NewYearActView>(NewYearActView);
            if (view != null) {
                view.onCollectExchangeChanged();
            }
        }
        else if (response.m_ucCommand == Macros.ACTIVITY_SJDH_START) //领取集字送好礼奖励响应
        {
            activityData.updateCollectExchange(response.m_unResultData.m_stSJDHActStartRsp);
            let view = G.Uimgr.getForm<NewYearActView>(NewYearActView);
            if (view != null) {
                view.onCollectExchangeChanged();
            }
        }
        else if (response.m_ucCommand == Macros.ACTIVITY_SJDH_WARN) {
            activityData.updateCollectExchangeWarn(response.m_unResultData.m_uiSJDHActWarnRsp);
            let view = G.Uimgr.getForm<NewYearActView>(NewYearActView);
            if (view != null) {
                view.checkCollectExchangeTipMark();
            }
        }
    }


    /**
	* 活动数据变化事件的响应函数。
	* @param msg
	*
	*/
    private _onActivityDataChangeNotify(notify: Protocol.ActivityDataChange_Notify): void {
        switch (notify.m_iID) {
            case Macros.ACTIVITY_ID_GUOYUN:
                G.ModuleMgr.unitModule.onRoleGuoyunChange(notify.m_unData.m_stGuoYunNotify.m_stRoleID, notify.m_unData.m_stGuoYunNotify.m_ucQuestLevel);
                break;
            case Macros.ACTIVITY_ID_JUHSACT:
                this._handleJhsDataChange();
                break;
            case Macros.ACTIVITY_ID_KFCB:
                this._handleQmcbDataChange(notify.m_unData.m_stQMCBNotify);
                break;
            case Macros.ACTIVITY_ID_BATHE:
                this._handleBath(notify.m_unData.m_stBatheOperatNotify);
                break;
            case Macros.ACTIVITY_ID_WORLDBOSS:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDBOSS, Macros.ACTIVITY_WORLD_BOSS_LIST));
                break;
            default:
                break;
        }
    }

    private _handleBath(data: Protocol.BatheOperatData): void {
        let heroName: string = G.DataMgr.heroData.name;
        let name1: string;
        let name2: string;
        if (data.m_szDesRoleName == heroName) {
            name1 = TextFieldUtil.getColorText(data.m_szSrcRoleName, Color.GREEN);
            name2 = "你";
        }
        else if (data.m_szSrcRoleName == heroName) {
            name1 = "你";
            name2 = TextFieldUtil.getColorText(data.m_szDesRoleName, Color.GREEN);
        }
        else {
            return;
        }

        let str: string = "";
        if (data.m_uiOperatTpye == 1) {
            str = uts.format("{0}向{1}泼了几下水，抛了个媚眼", name1, name2);
        }
        else if (data.m_uiOperatTpye == 2) {
            str = uts.format("{0}向{1}扔了一块肥皂，露出了不怀好意的笑脸", name1, name2);
        }
        else if (data.m_uiOperatTpye == 3) {
            str = uts.format("{0}帮{1}搓了几下背，{2}发出了舒服的呻吟", name1, name2, name2);
        }
        G.TipMgr.addMainFloatTip(str, Macros.PROMPTMSG_TYPE_ROLL);
    }

    /**
	*部分活动状态变化通知
	* @param response
	*
	*/
    private _onTabStatusChange(response: Protocol.TabStatus_Change_Notify): void {
        let activityData: ActivityData = G.DataMgr.activityData;
        activityData.setTabStatue(response);
        let tabStatue: Protocol.IconStatusOne = activityData.getTabStatue(Macros.ICON_MERGE_ACTIVITY);
        //if (tabStatue) {
        //    for (let id of tabStatue.m_stTabStatusList) {
        //        if (id != 0) {
        //            break;
        //        }
        //    }
        //}
        G.ActBtnCtrl.update(false);
        //this.dispatchEvent(Events.RefreshTabStatus);
        let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        if (view != null) {
            view.updateBossZHTipMark();
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.BOSS_SUMMON_PANEL));
        }
    }



    private handleActDataChange(id: number) {

        let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
        if (actHomeView != null) {
            actHomeView.onActDataChange(id);
        }

        if (id == Macros.ACTIVITY_ID_WORLDBOSS) {
            let bossView = G.Uimgr.getForm<BossView>(BossView);
            if (bossView != null) {
                bossView.onActDataChange(id);
            }
        }
    }

    /**
     * 此接口仅由PinstanceModule调用。
     */
    __onPinstanceChange() {
        this.handleActDataChange(0);
    }

    ///////////////////////////////////////////////////////// 每日签到 /////////////////////////////////////////////////////////

    private handleSignResp(response: Protocol.DoActivity_Response): void {
        let signData = G.DataMgr.activityData.dailySignData;
        if (Macros.SIGN_LIST_QRY == response.m_ucCommand) //查询签到列表
        {
            signData.updateSignData(response.m_unResultData.m_stSignQry);
        }
        else if (Macros.SIGN_IN_REQ == response.m_ucCommand) //如果是签到(包含了签到跟补签)
        {
            let signDay: Protocol.SignDataThing = response.m_unResultData.m_stSignDay;
            signData.updateSignData(signDay.m_stSignData);
        }
        else if (Macros.SIGN_PRIZE_REQ == response.m_ucCommand) //如果是领取奖励
        {
            let signPrize: Protocol.SignDataThing = response.m_unResultData.m_stSignPrize;
            //更新奖励数据
            signData.updateGiftData(signPrize.m_stSignData.m_uiSignPrizeTag);
        }
        let fuLiDaTingView = G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView);
        if (fuLiDaTingView != null) {
            fuLiDaTingView.updateSignByResp(response);
        }
    }

    ////////////////////////////////在线奖励//////////////////////////////////////////////
    private handleOnlineGiftResp(response: Protocol.DoActivity_Response) {
        let activityData = G.DataMgr.activityData;

        if (Macros.ONLINEGIFTACT_SHOW == response.m_ucCommand) {
            activityData.onlineGiftData.update(response.m_unResultData.m_stOnlineGiftShowResponse);
        }
        else if (Macros.ONLINEGIFTACT_GET == response.m_ucCommand) {
            activityData.onlineGiftData.update(response.m_unResultData.m_stOnlineGiftGetResponse);
        }
        let fuLiDaTingView = G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView);
        if (fuLiDaTingView != null) {
            fuLiDaTingView.updateOnlineGift();
        }
    }

    //////////////////////////////////////////////////////////// 宝石试炼 ////////////////////////////////////////////////////////////

    private _handleMingWenShiLian(response: Protocol.DoActivity_Response) {
        let isEvent: boolean = true;
        let mwslData = G.DataMgr.mwslData;
        if (Macros.HISTORICAL_REMAINS_PANEL == response.m_ucCommand) {
            mwslData.setData(response.m_unResultData.m_stHistoricalRemainsPanel);
        }
        else if (Macros.HISTORICAL_REMAINS_THROW_DICE == response.m_ucCommand) {
            mwslData.setPoints(response.m_unResultData.m_stThrowDiceRsp);
        }
        else if (Macros.HISTORICAL_REMAINS_BUY_MAGIC_DICE_TIMES == response.m_ucCommand) {
            mwslData.setBuyMagicDiceTimes(response.m_unResultData.m_stBuyMagicDiceTimesRsp);
        }
        else if (Macros.HISTORICAL_REMAINS_GOTO_POS == response.m_ucCommand) {
            mwslData.setGotoPos(response.m_unResultData.m_stGotoPosRsp);
        }
        else if (Macros.HISTORICAL_REMAINS_ONE_KEY_FINISH == response.m_ucCommand) {
            mwslData.onOnekeyComplete();
        }
        else if (Macros.HISTORICAL_REMAINS_RESET_TIMES == response.m_ucCommand) {
            mwslData.onReset(response.m_unResultData.m_ucResetTimes);
            // 重新拉一下面板
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_PANEL));
        }
        else if (Macros.HISTORICAL_GET_STAGEPASS_GIFT == response.m_ucCommand) {
            mwslData.onGetStagePassGift(response.m_unResultData.m_ucHRGetStagePassGiftRsp);
        }
        else if (Macros.HISTORICAL_ACT_NEXT_STAGE == response.m_ucCommand) {
            // 下一关
            mwslData.setData(response.m_unResultData.m_stHRActNextStageRsp);
        }
        let pinstanceHallView = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
        if (pinstanceHallView != null) {
            pinstanceHallView.onMwslResponse(response.m_ucCommand);
        }
    }

    //////////////////////////////////////////////////////////// 资源找回 ////////////////////////////////////////////////////////////

    private onZyzhRewardResponse(response: Protocol.ZYZHReward_Response): void {
        // 收到回复后重新拉一下
        if (ErrorId.EQEC_Success == response.m_iResultID) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTimeBoxPannelRequest());
        }
    }

    private onZyzhPanelResponse(response: Protocol.ZYZHPannel_Response): void {
        if (response.m_iResultID != ErrorId.EQEC_Success) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
        }
        else {
            G.DataMgr.zyzhData.data = response.m_stZYZHList;
            // 刷新面板
            let fuLiDaTingView = G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView);
            if (fuLiDaTingView != null) {
                fuLiDaTingView.updateResouceBackByResp();
            }
            G.ActBtnCtrl.update(false);
            G.NoticeCtrl.checkFuLiDaTing();
        }
    }

    ///////////////////////////////////////////////////////// 激活码 /////////////////////////////////////////////////////////

    private onChangeCDKeyResponse(response: Protocol.ChangeCDKey_Response) {
        if (Macros.CDKEY_OPERATE_EXCHANGE == response.m_iType) {
            // 兑换cdkey
            if (ErrorId.EQEC_Success == response.m_iResult) {
                G.TipMgr.addMainFloatTip('兑换成功，礼包已通过邮件发送给您。');
            }
            else {
                G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResult));
            }
        }
    }

    ///////////////////////////////////////////////////////// 等级礼包 /////////////////////////////////////////////////////////

    private onGetLevelBagResponse(response: Protocol.GetLevelBag_Response): void {
        if (response.m_ucResultID != ErrorId.EQEC_Success) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ucResultID));
        }
        else {
            G.DataMgr.activityData.levelGiftData.setGetlevel(response.m_usLevelBag);
            let fuLiDaTingView = G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView);
            if (fuLiDaTingView != null) {
                fuLiDaTingView.updateLevelGiftBagByRes();
            }
        }
        G.ActBtnCtrl.update(false);
        G.NoticeCtrl.checkFuLiDaTing();
    }

    ///////////////////////////////////////////////////////// 国运 /////////////////////////////////////////////////////////

    private _handleGuoyunResp(resp: Protocol.DoActivity_Response): void {
        let activityData = G.DataMgr.activityData;
        if (Macros.ACTIVITY_GUOYUN_LIST == resp.m_ucCommand) {
            // 更新国运信息
            activityData.guoyunData = resp.m_unResultData.m_stGuoYunListRsp;
            G.DataMgr.questData.nextGuoYunQuestID = activityData.guoyunData.m_aiQuestId[activityData.guoyunData.m_iCurrentQuestLevel - 1];
        }
        else if (Macros.ACTIVITY_GUOYUN_REFRESH_LEVLE == resp.m_ucCommand) {
            // 刷新物资
            let guoyunRefreshRsp: Protocol.GuoYunRefreshRsp = resp.m_unResultData.m_stGuoYunRefreshRsp;
            activityData.updateGuoyunByRefresh(guoyunRefreshRsp);
            // 刷新国运任务ID
            G.DataMgr.questData.nextGuoYunQuestID = guoyunRefreshRsp.m_iQuestId;
        }
        let boatView = G.Uimgr.getForm<BoatView>(BoatView);
        if (boatView != null) {
            boatView.updateView(resp);
        }

    }

    ///////////////////////////////////////////////////////// boss /////////////////////////////////////////////////////////

    private handleKuafuBossResp(response: Protocol.DoActivity_Response): void {
        let activityData = G.DataMgr.activityData;
        if (Macros.ACTIVITY_CROSS_BOSS_LIST == response.m_ucCommand) {
            activityData.kuafuBossData = response.m_unResultData.m_stCrossBossRsp;
        }
        else if (Macros.ACTIVITY_CROSS_BOSS_REWARD == response.m_ucCommand) {
            let m_kuafuBossRewardRsp: Protocol.CrossBossRewardRsp = response.m_unResultData.m_stCrossBossRewardRsp;
            if (activityData.kuafuBossData != null) {
                let m_kuafuBossList = activityData.kuafuBossData.m_stBossStatusList;
                for (let kuafubossOneInfo of m_kuafuBossList) {
                    if (kuafubossOneInfo.m_iBossID == m_kuafuBossRewardRsp.m_uiBossId) {
                        kuafubossOneInfo.m_iGetRewardCnt = m_kuafuBossRewardRsp.m_iDigNum;
                    }
                }
            }
        }

        let bossView = G.Uimgr.getForm<BossView>(BossView);
        if (bossView != null) {
            bossView.updateKuaFuBoss();
        }
    }

    private handBossHomeResp(response: Protocol.DoActivity_Response) {
        let activityData = G.DataMgr.activityData;
        if (Macros.ACTIVITY_HOME_BOSS_OPEN == response.m_ucCommand) {
            activityData.bossHomeData = response.m_unResultData.m_stHomeBossActOpenRsp.m_astBossList;
            activityData.bossHomeTicketTime = response.m_unResultData.m_stHomeBossActOpenRsp.m_astFreshTimeList;
            if (response.m_unResultData.m_stHomeBossActOpenRsp)
                activityData.bossHomeBugTicketNumber = response.m_unResultData.m_stHomeBossActOpenRsp.m_ucBuyTicketNumber
            activityData.setBossHomeDataInit(true);
        }
        else if (Macros.ACTIVITY_HOME_BOSS_ADDTIME == response.m_ucCommand) {
            if (response.m_unResultData.m_stHomeBossActAddTimeRsp)
                activityData.bossHomeBugTicketNumber = response.m_unResultData.m_stHomeBossActAddTimeRsp.m_ucBuyTicketNumber
            activityData.bossHomeTicketTime = response.m_unResultData.m_stHomeBossActAddTimeRsp.m_astFreshTimeList;
        }
        let view = G.Uimgr.getForm<BossView>(BossView);
        if (view != null) {
            view.updateBossHomePanelTip();
            view.updateBossHome();
        }
    }


    private handleWorldBossResp(response: Protocol.DoActivity_Response): void {
        let activityData = G.DataMgr.activityData;
        let m_astBossList: Protocol.CSBossOneInfo[];
        let bossOneInfo: Protocol.CSBossOneInfo;
        if (Macros.ACTIVITY_WORLD_BOSS_LIST == response.m_ucCommand) {
            activityData.updateWorldBoss(response.m_unResultData.m_stWorldBossRsp);
        }
        else if (Macros.ACTIVITY_WORLD_BOSS_REWARD == response.m_ucCommand) {
            let m_stWorldBossRewardRsp: Protocol.WorldBossRewardRsp = response.m_unResultData.m_stWorldBossRewardRsp;
            if (activityData.m_stBigBossList != null) {
                G.DataMgr.activityData.todayWaBaoAllCount++;
                m_astBossList = activityData.m_stBigBossList.m_astBossList;
                for (bossOneInfo of m_astBossList) {
                    if (bossOneInfo.m_iBossID == m_stWorldBossRewardRsp.m_uiBossId) {
                        bossOneInfo.m_iGetRewardCnt = m_stWorldBossRewardRsp.m_iDigNum;
                    }
                }
            }
        }
        let bossView = G.Uimgr.getForm<BossView>(BossView);
        if (bossView != null) {
            bossView.updateWorldBoss();
        }
        G.DataMgr.taskRecommendData.onWorldBossChange();
    }

    /**处理黑洞塔返回*/
    private handleFmtResponse(response: Protocol.DoActivity_Response): void {
        if (response.m_ucCommand == Macros.ACTIVITY_FMT_LIST) {
            let m_stFMTListRsp: Protocol.CSFMTListRsp = response.m_unResultData.m_stFMTListRsp;
            let fmtData: FmtData = G.DataMgr.fmtData;
            let reborns = fmtData.updateFmtInfo(m_stFMTListRsp);

            let bossView = G.Uimgr.getForm<BossView>(BossView);
            if (bossView != null) {
                bossView.updateFmtBoss();
                bossView.updateDigongBoss();
            }
            //kingsly  注释掉，不让国家Boss弹那么多提示  (激活魂环所需的boss刷新时就弹框)
            if (m_stFMTListRsp.m_ucIsDGBossAliveNtf == 1 && this.canPrompDiGong()) {
                //当前激活所需的bossid和国家boss刷新的id相同时就弹出国家boss弹框(所有魂环都激活了就不需要弹)
                let hunliData = G.DataMgr.hunliData;
                if (hunliData.hunhuanId > 0) {
                    let hunhuanCfg = hunliData.getHunHuanConfigById(hunliData.hunhuanId);
                    if (hunliData.getHunHuanConfigById(hunliData.hunhuanId).m_iRequireHunLiLevel != 9 && m_stFMTListRsp.m_iAliveNtfBossID == hunliData.getHunHuanConfigByIndex(hunhuanCfg.m_iRequireHunLiLevel).m_iBossID) {
                        G.Uimgr.createForm<ActTipView>(ActTipView).open(0, m_stFMTListRsp.m_iAliveNtfBossID);
                    }
                }
            }
        }
        G.DataMgr.taskRecommendData.onDiGongBossChange();
        G.DataMgr.taskRecommendData.onTaoFaChange();
    }

    /**
    * 开服活动数据响应
    * @param msg
    *
    */
    private _onKfActInfoResponse(response: Protocol.KFActInfo_Response): void {

        if (response.m_iResultID == ErrorId.EQEC_Success) {
            let kfhd = G.DataMgr.kfhdData;
            if (response.m_usType == Macros.LJCZ_OPEN_PANEL) //打开累计充值面板
            {
                G.DataMgr.leiJiRechargeData.updateLjczData(response.m_stValue.m_stOpenLJCZPanelRsp);
                let view = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
                if (view != null) {
                    view.onLeiJiChongZhiChange();
                }
            }
            else if (response.m_usType == Macros.GET_LJCZ_REWARD) //领取累计充值奖励
            {
                G.DataMgr.leiJiRechargeData.updateLjczData(response.m_stValue.m_stGetLJCZRewardRsp);
                let view = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
                if (view != null) {
                    view.onLeiJiChongZhiChange();
                }
            }
            else if (response.m_usType == Macros.CHALLENGE_BOSS_OPEN_PANEL) //打开挑战BOSS面板响应
            {
                kfhd.updateBossData(response.m_stValue.m_stOpenCBPanelRsp);
                G.NoticeCtrl.onKfhdBossChanged();

            }
            else if (response.m_usType == Macros.GET_CHALLENGE_BOSS_REWARD) //领取挑战BOSS活动奖励响应
            {
                kfhd.updateBossData(response.m_stValue.m_stGetCBRewardRsp);
                G.NoticeCtrl.onKfhdBossChanged();

            }
            else if (response.m_usType == Macros.STAGEDAY_OPEN_PANEL) //打开进阶日活动面板
            {
                kfhd.updateJJRPanelData(response.m_stValue.m_stStageDayPanelRsp);
                G.DataMgr.heroData.toadyChargeMoney = response.m_stValue.m_stStageDayPanelRsp.m_uiDailyCharge;
                let advanceDailyView = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
                if (advanceDailyView != null) {
                    advanceDailyView._updatePanel();
                }
                let kaifuView = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (kaifuView != null) {
                    kaifuView._updatePanel();
                    //有数据时刷新一下
                    kaifuView.onSellLimitDataChange();
                }
               
                G.NoticeCtrl.checkJinJieRi();
            }
            else if (response.m_usType == Macros.GET_STAGEDAY_REWARD) //领取进阶日活动奖励
            {
                kfhd.updateJJRRewardlData(response.m_stValue.m_stGetStageDayRewardRsp);
                let advanceDailyView = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
                if (advanceDailyView != null) {
                    advanceDailyView.updataViewReward();
                }

                let kaifuView = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (kaifuView != null) {
                    kaifuView.updataViewReward();
                }
                G.NoticeCtrl.checkJinJieRi();
            }
            else if (response.m_usType == Macros.STAGEDAT_RANK_OPEN_PANEL) //进阶排行
            {
                kfhd.updateJinJieRankData(response.m_stValue.m_stStageDayRankPannel);
                let fanLiDaTingView = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
                if (fanLiDaTingView != null) {
                    fanLiDaTingView.onJinJieRankChange();
                }
                let kaifuView = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (kaifuView != null) {
                    kaifuView.onJinJieRankChange();
                }
            }
            else if (response.m_usType == Macros.KFZZZD_OPEN_PANEL) //开服至尊争夺
            {
                G.DataMgr.activityData.kfzzzdData = response.m_stValue.m_stZZZDOpenPanelRsp;
                let data = response.m_stValue.m_stZZZDOpenPanelRsp.m_stCfgList;
                if (data != null) {
                    G.DataMgr.activityData.kfzzzdIsOpen = data[0].m_ucOpen == 1;
                    let view = G.Uimgr.getForm<KaiFuZhiZunDuoBaoView>(KaiFuZhiZunDuoBaoView);
                    if (view != null) {
                        for (let i = 0; i < data.length; i++) {
                            view.updateListData(data[i]);
                        }
                        view.updatePanel();
                    }
                } else {
                    G.DataMgr.activityData.kfzzzdIsOpen = false;
                }
            }
            else if (response.m_usType == Macros.YYDB_OPEN_PANEL) { //一元夺宝
                G.DataMgr.activityData.kfYiYuanDuoBaoData = response.m_stValue.m_stYYDBOpenPanelRsp;
                let view = G.Uimgr.getForm<YiYuanDuoBaoView>(YiYuanDuoBaoView);
                if (view != null) {
                    view.updatePanel();
                }
            }
            else if (response.m_usType == Macros.KFXFFL_OPEN) {
                // 红包有礼
                G.DataMgr.kaifuActData.updateHongBaoYouLi(response.m_stValue.m_stKFXFFLOpenRsp);
                let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (view != null) {
                    view.onHongBaoYouLiChanged();
                }
            }
            else if (response.m_usType == Macros.KFXFFL_GET) {
                // 红包有礼
                G.DataMgr.kaifuActData.updateHongBaoYouLi(response.m_stValue.m_stKFXFFLGetRsp);
                let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (view != null) {
                    view.onHongBaoYouLiChanged();
                }
            }
            else if (response.m_usType == Macros.KF_LUCKYCAT_OPEN_PANNEL) {
                //招财猫 打开面板
                G.DataMgr.luckyCatData.drawNum = response.m_stValue.m_stLuckyCatPannelRsp.m_ucDrawTimes;
                G.DataMgr.luckyCatData.onUpdatePanel(response.m_stValue.m_stLuckyCatPannelRsp);
                let view = G.Uimgr.getForm<LuckyCatView>(LuckyCatView);
                if (view != null) {
                    view.updatePanel();
                }
            }
            else if (response.m_usType == Macros.KF_LUCKYCAT_DRAW) {
                //招财猫 抽奖
                G.DataMgr.luckyCatData.onUpdateDraw(response.m_stValue.m_stLuckyCatDrawRsp);
                G.DataMgr.luckyCatData.drawNum = response.m_stValue.m_stLuckyCatDrawRsp.m_ucDrawTimes;
                let view = G.Uimgr.getForm<LuckyCatView>(LuckyCatView);
                if (view != null) {
                    view.updatePanel();
                }
            }
            else if (response.m_usType == Macros.KF7DAY_LJCZ_OPEN) {
                // 7日累充,打开面板
                G.DataMgr.kaifuActData.updatekf7DayLC(response.m_stValue.m_st7DayLJCZOpen);
                let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (view != null) {
                    view.onUpdateSevenDayLCPanel();
                }

                let afterSevenDayActView = G.Uimgr.getForm<AfterSevenDayActView>(AfterSevenDayActView);
                if (afterSevenDayActView != null) {
                    afterSevenDayActView.onUpdate7DayLeiChongPanel();
                }

            }
            else if (response.m_usType == Macros.KF7DAY_LJCZ_GET) {
                // 7日累充,领取奖励
                G.DataMgr.kaifuActData.updatekf7DayLC(response.m_stValue.m_st7DayLJCZGet);
                let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (view != null) {
                    view.onUpdateSevenDayLCPanel();
                }

                let afterSevenDayActView = G.Uimgr.getForm<AfterSevenDayActView>(AfterSevenDayActView);
                if (afterSevenDayActView != null) {
                    afterSevenDayActView.onUpdate7DayLeiChongPanel();
                }
            }
            else if (response.m_usType == Macros.KF_LCFL_OPEN) {
                // 连充返利,打开面板
                G.DataMgr.kaifuActData.updatekfLCFL(response.m_stValue.m_stKFLCFLOpen);
                let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (view != null) {
                    view.onUpdateLCFLPanel();
                }

                let after7Day = G.Uimgr.getForm<AfterSevenDayActView>(AfterSevenDayActView);
                if (after7Day != null) {
                    after7Day.onUpdateLCFLPanel();
                }
            }
            else if (response.m_usType == Macros.KF_LCFL_GET) {
                // 连充返利,领取奖励
                G.DataMgr.kaifuActData.updatekfLCFL(response.m_stValue.m_stKFLCFLGet);
                let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (view != null) {
                    view.onUpdateLCFLPanel();
                }

                let after7Day = G.Uimgr.getForm<AfterSevenDayActView>(AfterSevenDayActView);
                if (after7Day != null) {
                    after7Day.onUpdateLCFLPanel();
                }

            }

            else if (response.m_usType == Macros.KFXFLB_OPEN) {
                // 消费返利,打开面板
                G.DataMgr.kaifuActData.updateKFXFFLInfo(response.m_stValue.m_stKFXFLBOpenRsp);
                let view = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
                if (view != null) {
                    view.onUpdateXFFLPanel();
                }
            }
            else if (response.m_usType == Macros.KFXFLB_GET) {
                // 消费返利,领取奖励
                G.DataMgr.kaifuActData.updateKFXFFLInfo(response.m_stValue.m_stKFXFLBGetRsp);
                let view = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
                if (view != null) {
                    view.onUpdateXFFLPanel();
                }
            }
            else if (response.m_usType == Macros.BOSS_SUMMON_PANEL) {
                G.DataMgr.activityData.BOSSZhanHuanData.updateBossZhaoHuanInfo(response.m_stValue.m_stBossSummonPanelRsp);
                let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (view != null) {
                    view.updateBossZhaoHuanPanrl()
                }
                G.NoticeCtrl.checkBossZhaoHuan();
            }
            else if (response.m_usType == Macros.BOSS_SUMMON) {
                let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (view != null) {
                    view.ShowZhaoHuanReward(response.m_stValue.m_stBossSummonRsp.m_ucType);
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.BOSS_SUMMON_PANEL));
                }
                G.NoticeCtrl.checkBossZhaoHuan();
            }

            else if (response.m_usType == Macros.BOSS_SUMMON_WARN) {
                G.DataMgr.activityData.BOSSZhanHuanData.BossSummonPanelInfo.m_usWarnSelect = response.m_stValue.m_usBossSummonWarnRsp;
                let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (view != null) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.BOSS_SUMMON_PANEL));
                    view.updateBossZHTipMark();
                }
            }

            //else if (response.m_usType == Macros.YUANBAO_DOUBLE_PANEL) {
            //    //元宝翻倍-打开面板
            //    //uts.log("  元宝翻倍-打开面板  " + JSON.stringify(response.m_stValue.m_stYBDoublePanelRsp))
            //    let info = response.m_stValue.m_stYBDoublePanelRsp;
            //    G.DataMgr.activityData.updateYuanBaoFanBeiData(info.m_uiChargeValue, info.m_uiRewardValue);

            //    let view = G.Uimgr.getForm<YuanBaoFanBeiView>(YuanBaoFanBeiView);
            //    if (null != view) {
            //        view.updatePanel();
            //    }
            //}
            //else if (response.m_usType == Macros.YUANBAO_DOUBLE_REWARD) {
            //    //元宝翻倍-领取奖励
            //    let info = response.m_stValue.m_stYBDoubleRewardRsp;
            //    G.DataMgr.activityData.updateYuanBaoFanBeiData(info.m_uiChargeValue, info.m_uiRewardValue);

            //    let view = G.Uimgr.getForm<YuanBaoFanBeiView>(YuanBaoFanBeiView);
            //    if (null != view) {
            //        view.updatePanel();
            //    }
            //}
            else if (response.m_usType == Macros.HAPPY_CHARGE_REBATE) {
                //充值狂欢-充值折扣
                let view = G.Uimgr.getForm<ChongZhiKuangHuanView>(ChongZhiKuangHuanView);
                if (null != view) {
                    view.updateNewChongZhiZkPanel();
                }

            }
            //else if (response.m_usType == Macros.HAPPY_CHARGE_VIP_PANEL) {
            //    //充值狂欢-VIP专属 打开面板
            //    G.DataMgr.kaifuActData.vipzsRewardFlag = response.m_stValue.m_uiHappyVIPPanelFlag;
            //    let view = G.Uimgr.getForm<ChongZhiKuangHuanView>(ChongZhiKuangHuanView);
            //    if (null != view) {
            //        view.updateVIPZSPanel();
            //    }

            //}
            //else if (response.m_usType == Macros.HAPPY_CHARGE_VIP_REWARD ) {
            //    //充值狂欢-VIP专属 领取奖励
            //    G.DataMgr.kaifuActData.vipzsRewardFlag = response.m_stValue.m_uiHappyVIPRewardFlag;
            //    let view = G.Uimgr.getForm<ChongZhiKuangHuanView>(ChongZhiKuangHuanView);
            //    if (null != view) {
            //        view.updateVIPZSPanel();
            //    }
            //}
            else if (response.m_usType == Macros.ZGLB_OPEN_PANEL) {
                //直购礼包打开面板
                G.DataMgr.kaifuActData.meiRiLiBaoInfo = response.m_stValue.m_stZGLBOpenRsp;
                let view = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
                if (view != null) {
                    view.updateMeirilibaoPanel();
                }
                // let view = G.Uimgr.getForm<MeiRiLiBaoView>(MeiRiLiBaoView);
                // if (view != null) {
                //     view.updateView();
                // }
            }
            else if (response.m_usType == Macros.ZGLB_GET_GIFT) {
                //直购礼包领奖
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.ZGLB_OPEN_PANEL));
            }
            G.ActBtnCtrl.update(false);
            G.NoticeCtrl.checkFuLiDaTing();
        }
        else {
            uts.logWarning("开服活动数据响应错误.操作类型" + response.m_usType + "，操作结果：" + response.m_iResultID);
        }
    }

    private onServerOverDay() {
        // let tzjhGetView = G.Uimgr.getForm<TzjhGetView>(TzjhGetView);
        // if (tzjhGetView != null) {
        //tzjhGetView.onServerOverDay();
        // }

        let leiChongFanLiView = G.Uimgr.getSubFormByID<LeiChongFanLiView>(FanLiDaTingView, KeyWord.OTHER_FUNCTION_LEICHONGFANLI);
        if (leiChongFanLiView != null) {
            leiChongFanLiView.onServerOverDay();
        }

        let xxddView = G.Uimgr.getForm<XXDDMainView>(XXDDMainView);
        if (xxddView != null) {
            xxddView.onServerOverDay();
        }

        // 红包有礼
        let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        if (view != null) {
            view.onHongBaoYouLiChanged();
        }
        //合服活动
        let mergeActView = G.Uimgr.getForm<MergeView>(MergeView);
        if (null != mergeActView) {
            mergeActView.onServerOverDay();
        }
        // 限时特卖
        let xianShiTeMai = G.Uimgr.getForm<XianShiTeMaiView>(XianShiTeMaiView);
        if (null != xianShiTeMai) {
            xianShiTeMai.onServerOverDay();
        }
    }

    /**处理人民币战场协议*/
    private handleRmbZc(response: Protocol.DoActivity_Response): void {
        if (Macros.ACTIVITY_RMBZC_LIST == response.m_ucCommand) {
            G.DataMgr.rmbData.rmbZcInfo = uts.deepcopy(response.m_unResultData.m_stRMBZCListRsp, G.DataMgr.rmbData.rmbZcInfo, true);
            //this.dispatchEvent(Events.updateRmbZcInfo);
        }
        else if (Macros.ACTIVITY_RMBZC_JOIN == response.m_ucCommand) {
            G.DataMgr.rmbData.rmbZcInfo = uts.deepcopy(response.m_unResultData.m_stRMBZCJoinRsp, G.DataMgr.rmbData.rmbZcInfo, true);
            //this.dispatchEvent(Events.updateRmbZcInfo);
        }
        else if (Macros.ACTIVITY_RMBZC_CANCEL == response.m_ucCommand) {
            G.DataMgr.rmbData.rmbZcInfo = uts.deepcopy(response.m_unResultData.m_stRMBZCCancelRsp, G.DataMgr.rmbData.rmbZcInfo, true);
            //this.dispatchEvent(Events.updateRmbZcInfo);
        }
        else if (Macros.ACTIVITY_RMBZC_BUYTIME == response.m_ucCommand) {
            G.DataMgr.rmbData.rmbZcInfo = uts.deepcopy(response.m_unResultData.m_stRMBZCBuyTimeRsp, G.DataMgr.rmbData.rmbZcInfo, true);
            //this.dispatchEvent(Events.updateRmbZcInfo);
        }
    }


    /**
     * 收到答题活动的通知
     * @param msg
     *
     */
    private _onDatiNotify(msg: Protocol.QuestionActivity_Notify): void {

        let view = G.Uimgr.getForm<DaTiView>(DaTiView);
        if (view != null) {
            view.updateView(msg);
        }
        else {
            G.Uimgr.createForm<DaTiView>(DaTiView).open(msg);
        }
    }

    //////////////////////////////////////////////////////////// 首充礼包 ////////////////////////////////////////////////////////////

    /**拉取首充礼包数据*/
    private _onSCGetInfoResponse(msg: Protocol.SCGetInfoResponse): void {
        if (msg.m_iResultID != ErrorId.EQEC_Success) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(msg.m_iResultID));
            return;
        }

        G.DataMgr.firstRechargeData.updateSCGiftBagCfgByResp(msg.m_stData);


        G.ActBtnCtrl.update(false);
        if (G.DataMgr.firstRechargeData.scValue.m_uiSCValue > 0) {
            G.DataMgr.systemData.firstPay = false;
        } else {
            G.DataMgr.systemData.firstPay = true;
        }

        let form1 = G.Uimgr.getForm<FirstRechargeView>(FirstRechargeView);
        if (form1 != null) {
            form1.updateView();
        }
        let form2 = G.Uimgr.getForm<DailyRechargeView>(DailyRechargeView);
        if (form2 != null) {
            form2.updateState();
        }
    }
    /**首充礼包可以领取通知*/
    private _onSCCanGetRewardNotify(notify: Protocol.SCCanGetRewardNotify): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.YYDB_OPEN_PANEL));
        let frData = G.DataMgr.firstRechargeData;
        frData.updateSCGiftBagCfgByResp(notify.m_stData);
        G.ActBtnCtrl.update(false);

        let form = G.Uimgr.getForm<FirstRechargeView>(FirstRechargeView);
        if (form != null) {
            form.updateView();
        } else {
            // 可以领礼包就自动弹开
            if (!frData.isNotShowFirstRechargeIcon()) {
                G.GuideMgr.tryGuide(EnumGuide.RechargeReach, 0, false, 0, false);
            }
        }

        //首次充值弹招财猫
        let severDay = G.SyncTime.getDateAfterStartServer();
        let severLimit: boolean = false;
        if (G.DataMgr.luckyCatData.drawInfo[0]) {
            severLimit = (severDay >= G.DataMgr.luckyCatData.drawInfo[0].m_iStartDay && severDay <= G.DataMgr.luckyCatData.drawInfo[0].m_iEndDay);
        }
        let firstRechargeData = G.DataMgr.firstRechargeData;
        let firstPayValue = firstRechargeData.scValue.m_uiSCValue > 0 && G.DataMgr.systemData.firstPay;
        if (severLimit && firstPayValue) {
            if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_KF_ZHAOCAIMAO)) {
                G.GuideMgr.tryGuide(EnumGuide.CommonOpenView + 7, 0, false, 0, false);
            }
        }
        let drView = G.Uimgr.getForm<DailyRechargeView>(DailyRechargeView);
        if (null != drView) {
            drView.updateState();
        } else {
            if (!frData.isNotShowMrczIcon() && frData.isHasDailyRechargeCanGet()) {
                G.GuideMgr.tryGuide(EnumGuide.DailyRechargeReach, 0, false, 0, false);
            }
        }
        if (G.DataMgr.firstRechargeData.scValue.m_uiSCValue > 0) {
            G.DataMgr.systemData.firstPay = false;
        } else {
            G.DataMgr.systemData.firstPay = true;
        }
    }
    /**领取首充礼包*/
    private _onSCGetRewardResponse(msg: Protocol.SCGetRewardResponse): void {
        if (msg.m_iResultID != ErrorId.EQEC_Success) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(msg.m_iResultID));
            return;
        }
        let frData = G.DataMgr.firstRechargeData;
        frData.updateSCGiftBagCfgByResp(msg.m_stData);
        G.ActBtnCtrl.update(false);
        let scInfo = frData.scValue;
        if (scInfo) {
            let isGetFirstRecharge: Boolean = MathUtil.checkPosIsReach(0, scInfo.m_ucGetRFCBit);
            if (isGetFirstRecharge) {
                G.Uimgr.closeForm(FirstRechargeView);
            }
            let form = G.Uimgr.getForm<DailyRechargeView>(DailyRechargeView);
            if (form != null) {
                let currentLevel = frData.getCurrentLevel(scInfo.m_ucType, scInfo.m_ucDay);
                let maxLevel = frData.getMaxLevel(KeyWord.GIFT_TYPE_SC, scInfo.m_ucType, scInfo.m_ucDay);
                if (currentLevel > maxLevel) {
                    form.close();
                }
                else {
                    form.updateState();
                }
            }

        }
        if (!frData.isNotShowMrczIcon() && frData.isHasDailyRechargeCanGet()) {
            G.GuideMgr.tryGuide(EnumGuide.DailyRechargeReach, 0, false, 0, false);
        }
    }

    /**处理聚划算活动数据改变*/
    private _handleJhsDataChange(): void {
        G.DataMgr.activityData.tzjhCount = 1;
        // let tzjhGetView = G.Uimgr.getForm<TzjhGetView>(TzjhGetView);
        // if (tzjhGetView != null) {
        // tzjhGetView.onTzjhRewardChange();
        // }
    }

    /**处理投资计划协议*/
    private handleTzjhStatus(response: Protocol.DoActivity_Response): void {
        if (Macros.JUHS_OPENPANEL == response.m_ucCommand) {
            G.DataMgr.activityData.updateJhsData(response.m_unResultData.m_stJUHSOpenPannel);
            // let tzjhGetView = G.Uimgr.getForm<TzjhGetView>(TzjhGetView);
            // if (tzjhGetView != null) {
            //  tzjhGetView.updateView();
            // }
        }
        else if (Macros.JUHS_BUY == response.m_ucCommand) {
            uts.logError("JUHS_BUY");
            // let tzjhGetView = G.Uimgr.getForm<TzjhGetView>(TzjhGetView);
            // if (tzjhGetView != null) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_JUHSACT, Macros.JUHS_OPENPANEL));
            //tzjhGetView.updateView();
            // }
        }
        else if (Macros.JUHS_GET == response.m_ucCommand) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_JUHSACT, Macros.JUHS_OPENPANEL));
        }
    }

    private _handleQmcbDataChange(data: Protocol.KFQMCBChangeInfo): void {
        G.DataMgr.kaifuActData.updateQuanminRankInfo(data.m_ucRankType, true);
        let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        if (view != null) {
            view.updateKaiFuChongBangView();
        }
        G.ActBtnCtrl.update(false);
        //sendEvent(EventTypes.UpdateShortCutFunctionBar);

    }

    /**快速升级,祈福response*/
    private onQiFuResponse(response: Protocol.QiFu_Response) {
        if (response.m_usType == Macros.QIFU_OPEN_PANEL) {
            G.DataMgr.activityData.qiFuListInfo = response.m_stValue.m_stOpenPanelRsp;
            G.DataMgr.activityData.isGetQiFuExp = response.m_stValue.m_stOpenPanelRsp.m_ucJingYan == 0;
        }
        let view = G.Uimgr.getForm<KuaiSuShengJiView>(KuaiSuShengJiView);
        if (view != null) {
            view.updateQiFuPanel(response);
        }
        G.DataMgr.taskRecommendData.onQiFuChange();
    }


    /**拉取开服冲榜排行版信息*/
    private onGetKFCBRankResponse(response: Protocol.KFQMCBGetRoleInfo_Response) {
        let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        if (view != null) {
            //view.onGetRoleResponse(response);
            view.onGetKFCBRankResponse(response);
        }
    }

    /**拉取开服冲榜第一名奖励信息*/
    private onGetKFCBRewardResponse(response: Protocol.KFQMCBGetReward_Response) {
        G.DataMgr.kaifuActData.onGetKFCBRewardResponse(response);
        let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        if (view != null) {
            //view.onGetRewardResponse(response);
            view.onGetKFCBRewardResponse(response);
        }
        G.ActBtnCtrl.update(false);
    }


    /**拉取开服冲榜具体信息*/
    private onGetKFCBInfoResponse(response: Protocol.KFQMCBGetInfo_Response) {
        G.DataMgr.kaifuActData.onGetKFCBInfoResponse(response);
        let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        if (view != null) {
            //view.onGetInfoResponse(response);
            view.onGetKFCBInfoResponse(response);

        }
        G.ActBtnCtrl.update(false);
    }

    /**
	* 开服首充团购信息
	* @param msg
	*
	*/
    private onKFSCTGGetInfoResponse(resp: Protocol.KFSCTGGetInfo_Response): void {
        if (resp.m_ucResultID == 0) {
            G.DataMgr.kfhdData.updateGroupBuyInfo(resp.m_stData);
            let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
            if (view != null) {
                view.onShouChongTuanGouChanged();
            }
            G.ActBtnCtrl.update(false);
            G.NoticeCtrl.checkFuLiDaTing();
        }
    }

    /**
     * 开服首充团购领取信息
     * @param msg
     *
     */
    private onKFSCTGGetRewardResponse(resp: Protocol.KFSCTGGetReward_Response): void {
        if (resp.m_ucResultID == 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFSCTGGetInfoRequest());
        }

    }

    private _onFirstOpenChangeResponse(msg: Protocol.FirstOpen_Response): void {
        if (ErrorId.EQEC_Success == msg.m_iResult) {
            G.DataMgr.systemData.onlyOneTimeAllLifeBits = msg.m_uiFristOpenFunc;
            G.DataMgr.systemData.canOpenTagBits = msg.m_uiCanOpenTag;
            let view = G.Uimgr.getForm<DownloadView>(DownloadView);
            if (view != null) {
                view.updateStatus();
            }
            G.ActBtnCtrl.update(false);
            uts.log("msg.m_uiFristOpenFunc:" + msg.m_uiFristOpenFunc);
        }
    }

    private _onFirstOpenChangeNotify(e: Protocol.FirstOpen_Notify): void {
        G.DataMgr.systemData.onlyOneTimeAllLifeBits = e.m_uiFristOpenFunc;
        G.DataMgr.systemData.canOpenTagBits = e.m_uiCanOpenTag;
        G.DataMgr.vipData.isReceivedSVip(e.m_uiFristOpenFunc);
        uts.log("e.m_uiFristOpenFunc:" + e.m_uiFristOpenFunc);
    }

    /**处理星星点灯*/
    private handleXxdd(response: Protocol.DoActivity_Response): void {
        let xxddData: XxddData = G.DataMgr.activityData.xxdd;
        if (Macros.DDL_ACT_PANEL == response.m_ucCommand) {
            xxddData.updatePanelData(response.m_unResultData.m_stDDLPanelRsp);
            this.updateXXDDLightInfo(response.m_unResultData.m_stDDLPanelRsp);
        }
        else if (Macros.DDL_ACT_FRESH == response.m_ucCommand) {
            xxddData.updateFreshData(response.m_unResultData.m_stDDLFreshRsp);
            this.updateXXDDLightInfo(response.m_unResultData.m_stDDLPanelRsp);
        }
        else if (Macros.DDL_ACT_LIGHT == response.m_ucCommand) {
            xxddData.updateMyRecordData(response.m_unResultData.m_stDDLLightRsp);
            this.updateXXDDLightInfo(response.m_unResultData.m_stDDLPanelRsp);
        }
        else if (Macros.DDL_ACT_RANK_PANEL == response.m_ucCommand) {
            xxddData.updateRankPanelData(response.m_unResultData.m_stDDLRankPanelRsp);
            this.updateXXDDRankInfo(response.m_unResultData.m_stDDLRankPanelRsp);
        }
        else if (Macros.DDL_ACT_GET_REWARD == response.m_ucCommand) {
            xxddData.updateRankGetRewardData(response.m_unResultData.m_ucDDLRewardRsp);
            this.updateXXDDRankInfo(response.m_unResultData.m_stDDLRankPanelRsp);
        }
    }


    private updateXXDDLightInfo(data: Protocol.DDLOpenPanelRsp) {
        let xxddMainView = G.Uimgr.getForm<XXDDMainView>(XXDDMainView);
        if (xxddMainView != null) {
            xxddMainView.updateXXDDLightInfo(data);
        }
    }

    private updateXXDDRankInfo(data: Protocol.DDLOpenRankPanelRsp) {
        let xxddMainView = G.Uimgr.getForm<XXDDMainView>(XXDDMainView);
        if (xxddMainView != null) {
            xxddMainView.updateXXDDRankInfo(data);
        }
    }

    onCurrencyChange(id: number) {
        let view = G.Uimgr.getForm<LuckyWheelView>(LuckyWheelView);
        if (view != null) {
            view.onUpdateMoney();
        }
    }

    checkPromp(activityID = 0) {

        if (this.canPrompNormal()) {
            let activityData = G.DataMgr.activityData;
            if (activityID > 0 && !activityData.shouldPrompt(activityID)) {
                return;
            }
            if (activityID <= 0) {
                activityID = activityData.getPromptActivityID();
            }

            let hasPromp = false;

            if (activityID > 0 && activityID != Macros.ACTIVITY_ID_WORLDBOSS) {

                let isNotTip = false;
                if (activityID == Macros.ACTIVITY_ID_XZFM) {
                    if (G.DataMgr.monsterData.getFirstAliveAncientBossId() <= 0
                        || !G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_XZFM)
                        || G.DataMgr.sceneData.curPinstanceID != 0) {
                        isNotTip = true;
                    }

                }

                if (isNotTip) {
                    return;
                }

                G.Uimgr.createForm<ActTipView>(ActTipView).open(activityID, 0);
                hasPromp = true;
            } //取消国家boss每次的登录弹框
            // else if (this.needCheckDiGong) {
            //     if (this.checkDiGong() > 0) {
            //         hasPromp = true;
            //     }
            // }
        }
    }

    private canPrompNormal(): boolean {
        return G.DataMgr.sceneData.curPinstanceID == 0 && G.DataMgr.runtime.everEnterScene && !G.DataMgr.runtime.isAllFuncLocked && !G.GuideMgr.isGuiding(0);
    }

    checkDiGong(): number {
        let bossId = 0;
        if (this.canPrompDiGong()) {
            bossId = G.DataMgr.fmtData.getDiGongTipBoss();
            if (bossId > 0) {
                G.Uimgr.createForm<ActTipView>(ActTipView).open(0, bossId);
            }
            this.needCheckDiGong = false;
        }
        return bossId;
    }

    private canPrompDiGong(): boolean {
        return ActTipView.isOn == false && G.DataMgr.sceneData.curPinstanceID == 0 && G.DataMgr.heroData.level >= Constants.DiGongTipMinLevel &&
            G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_DI_BOSS) &&
            (G.DataMgr.thingData.getThingNum(EnumThingID.DiGongMiYao) > 0 ||
                G.DataMgr.systemData.getPinstanceLeftTimes(PinstanceData.getConfigByID(Macros.PINSTANCE_ID_DIGONG)) > 0);
    }

    ////////////////////////////////// 宝典 ///////////////////////////////////////

    private onBaoDianResponse(response: Protocol.BaoDian_Response) {
        if (response.m_iResultID == ErrorId.EQEC_Success) {
            G.DataMgr.kfhdData.updateBaoDianStatus(response);
            let view = G.Uimgr.getForm<SevenDayView>(SevenDayView);
            if (null != view) {
                view.onBaoDianResponse();
            }
        }
    }


    /**
		 * 开服每日目标信息
		 * @param msg
		 *
		 */
    private onKFMRMBGetInfoResponse(response: Protocol.KFMRMBGetInfo_Response): void {
        if (response.m_uiResultID == 0) {
            G.DataMgr.kaifuActData.updateDailyGoalInfo(response.m_stCSInfo);
            let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
            if (null != view) {
                view.updateEveryDayTargetPanel();
            }
            G.ActBtnCtrl.update(false);
        }
    }

    /**
     * 开服每日目标领取信息
     * @param msg
     *
     */
    private onKFMRMBGetRewardResponse(response: Protocol.KFMRMBGetReward_Response): void {
        if (response.m_uiResultID == 0) {
            G.DataMgr.kaifuActData.updateDailyGoalGet(response.m_stOneStatus);
            let view = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
            if (null != view) {
                view.updateEveryDayTargetPanel();
            }
            G.ActBtnCtrl.update(false);
        }
    }



    /**
		 * 合服活动返回处理
		 * @param	msg
		 */
    private onHfActInfoResponse(response: Protocol.HFActInfo_Response): void {
        if (ErrorId.EQEC_Success != response.m_iResultID) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
            return;
        }
        let hfhd: HfhdData = G.DataMgr.hfhdData;
        hfhd.day = response.m_iMergeDay;

        if (response.m_usType == Macros.HFHD_GET_LJCZ_REWARD) // 领取 累计充值
        {
            hfhd.hfljcz = response.m_stValue.m_stHFHDGetLJCZRewardRsp;
            let view = G.Uimgr.getForm<MergeView>(MergeView);
            if (null != view) {
                view.updateMergerThreeDayLeiChongPanel();
            }
        }
        else if (response.m_usType == Macros.HFHD_LJCZ_OPEN_PANEL) //打开 累计充值
        {
            hfhd.hfljcz = response.m_stValue.m_stHFHDOpenLJCZPanelRsp;
            let view = G.Uimgr.getForm<MergeView>(MergeView);
            if (null != view) {
                view.updateMergerThreeDayLeiChongPanel();
            }
        }
        else if (response.m_usType == Macros.HFHD_GET_QTDL_REWARD)//领取3天登陆
        {
            hfhd.qtdl = response.m_stValue.m_stHFHDGetQTDLReward;
            let view = G.Uimgr.getForm<MergeView>(MergeView);
            if (null != view) {
                view.updateMergerThreeDayLoginPanel();
            }
        }
        else if (response.m_usType == Macros.HFHD_QTDL_OPEN_PANEL)//打开3天登陆
        {
            hfhd.qtdl = response.m_stValue.m_stHFHDOpenQTDLPanelRsp;
            let view = G.Uimgr.getForm<MergeView>(MergeView);
            if (null != view) {
                view.updateMergerThreeDayLoginPanel();
            }
        }

        else if (response.m_usType == Macros.HFHD_GET_LJXF_REWARD)//累计消费 领取
        {
            hfhd.hfljxf = response.m_stValue.m_stHFHDGetLJXFRewardRsp;
            let view = G.Uimgr.getForm<MergeView>(MergeView);
            if (null != view) {
                view.updateMergerLJXFPanel();
            }
        }
        else if (response.m_usType == Macros.HFHD_LJXF_OPEN_PANEL)//累计消费 打开
        {
            hfhd.hfljxf = response.m_stValue.m_stHFHDOpenLJXFPanelRsp;
            let view = G.Uimgr.getForm<MergeView>(MergeView);
            if (null != view) {
                view.updateMergerLJXFPanel();
            }
        }
        else if (response.m_usType == Macros.HFHD_HFZZZD_OPEN_PANEL)//合服至尊夺宝
        {
            G.DataMgr.hfhdData.hfzzdbData = response.m_stValue.m_stHFHDHFZZDBPannel;
            let data = response.m_stValue.m_stHFHDHFZZDBPannel.m_stCfgList;
            if (data != null) {
                G.DataMgr.hfhdData.hfzzzdIsOpen = data[0].m_ucOpen == 1;
                let view = G.Uimgr.getForm<MergeView>(MergeView);
                if (view != null) {
                    for (let i = 0; i < data.length; i++) {
                        view.updateListData(data[i]);
                    }
                    view.updatePanel();
                }
            } else {
                G.DataMgr.hfhdData.hfzzzdIsOpen = false;
            }
        }

        else if (response.m_usType == Macros.HFHD_ZCM_OPEN_PANNEL)//打开面板 招财猫
        {
            hfhd.hfzcmInfo = response.m_stValue.m_stHFHDZCMPannel;
            let view = G.Uimgr.getForm<MergeView>(MergeView);
            if (null != view) {
                view.updateMergerZCMPanel(0);
            }
        }
        else if (response.m_usType == Macros.HFHD_ZCM_GET_REWARD)//领取奖励 招财猫
        {
            hfhd.hfzcmInfo = response.m_stValue.m_stHFHDZCMReward.m_stZCMInfo;
            let view = G.Uimgr.getForm<MergeView>(MergeView);
            if (null != view) {
                view.updateMergerZCMPanel(response.m_stValue.m_stHFHDZCMReward.m_iCurReward);
            }
        }

        else if (response.m_usType == Macros.HFHD_BXYL_OPEN_PANNEL)//打开面板 宝箱有礼
        {
            hfhd.hfBaoxiangInfo = response.m_stValue.m_ucHFHDBXYLOpenPannle;
            let view = G.Uimgr.getForm<MergeView>(MergeView);
            if (null != view) {
                view.updateMergerBaoXiangPanel();
            }
        }
        else if (response.m_usType == Macros.HFHD_BXYL_BUY_CHEST)//领取奖励 宝箱有礼
        {
            hfhd.hfBaoxiangInfo = response.m_stValue.m_ucHFHDBXYLBuyChest.m_stBXYLInfo;
            let view = G.Uimgr.getForm<MergeView>(MergeView);
            if (null != view) {
                view.updateMergerBaoXiangPanel();
            }

            // 奖励列表
            let rewardList = response.m_stValue.m_ucHFHDBXYLBuyChest.m_stList;
            let itemDatas: RewardIconItemData[] = [];
            let bagItemCnt = rewardList.m_ucCount;
            for (let i = 0; i < bagItemCnt; i++) {
                let itemInfo = rewardList.m_astList[i];
                let itemData = new RewardIconItemData();
                itemData.id = itemInfo.iItemID;
                itemData.number = itemInfo.iItemNum;
                itemDatas.push(itemData);
            }
            G.Uimgr.createForm<OpenChestView>(OpenChestView).open(uts.format('您获取了奖励', bagItemCnt), itemDatas);
        }

        else if (response.m_usType == Macros.HFHD_BXYL_SHOP_EXCHANGE)//兑换 宝箱有礼
        {
            hfhd.hfBaoxiangInfo = response.m_stValue.m_ucHFHDBXYLShopExchange;
            let view = G.Uimgr.getForm<MergeShopView>(MergeShopView);
            if (null != view) {
                view.updatePanel();
            }
            //刷新积分
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_BXYL_OPEN_PANNEL));
        }
        G.ActBtnCtrl.update(false);
    }
    /**
     * 魔化战争打开面板回复
     * @param response
     */
    private onMohuaZhanzhengOpenpanelResponse(response: Protocol.MHZZ_Pannel_Response): void {
        if (ErrorId.EQEC_Success != response.m_uiResult) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_uiResult));
            return;
        }

        let view: ActHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
        if (view) {
            view.updateMohuaZhanzhengView(response);
        }
    }
    /**
     * 问卷调查
     */
    private _onWJGetRewardResponse(respone: Protocol.Survey_Response) {
        let view: KaiFuHuoDongView = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        if (view) {
            G.DataMgr.wenjuanData.isShow = false;
            view.updateWenJuanPanel();
        }
    }

    private onPreviewRewardResponse(response: Protocol.PreviewReward_Response) {
        
        G.DataMgr.activityData.m_stPreviewRewardInfo = response.m_stPreviewRewardInfo;
        G.ViewCacher.mainView.newFuncPreCtrl.updateView();
    }


    private onSaiJiPannelResponse(respone: Protocol.SaiJiPannel_Response) {
        //uts.log("onSaiJiPannelResponse ------>>>  " + JSON.stringify(respone));
        G.DataMgr.zhufuData.updateSaiJiInfo(respone.m_stDBSaiJiInfo);
        let view = G.Uimgr.getForm<RiChangView>(RiChangView);
        if (view != null) {
            view.updateSaiJiView();
        }
        G.ViewCacher.mainView.updateSaiJiProgress();
    }

    private onSaiJiActiveResponse(respone: Protocol.SaiJiActive_Response) {
        //uts.log("onSaiJiActiveResponse ------>>>  " + JSON.stringify(respone));
        G.DataMgr.zhufuData.updateSaiJiInfo(respone.m_stDBSaiJiInfo)
        let view = G.Uimgr.getForm<RiChangView>(RiChangView);
        if (view != null) {
            view.updateSaiJiView();
        }
        G.ViewCacher.mainView.updateSaiJiProgress();
    }

}