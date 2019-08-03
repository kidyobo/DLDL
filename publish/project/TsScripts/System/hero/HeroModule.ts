import { FanLiDaTingView } from "System/activity/fanLiDaTing/FanLiDaTingView";
import { FuLiDaTingView } from "System/activity/fldt/FuLiDaTingView";
import { KuaiSuShengJiView } from "System/activity/view/KuaiSuShengJiView";
import { ReportType } from "System/channel/ChannelDef";
import { KeyWord } from "System/constants/KeyWord";
import { VipData } from "System/data/VipData";
import { RewardIconItemData } from "System/data/vo/RewardIconItemData";
import { EquipView } from "System/equip/EquipView";
import { EventDispatcher } from "System/EventDispatcher";
import { Events } from "System/Events";
import { FaQiView } from "System/faqi/FaQiiView";
import { FaQiJinJiePanel } from "System/faqi/FaQiJinJiePanel";
import { FloatShowType } from "System/floatTip/FloatTip";
import { Global as G } from "System/global";
import { OpenChestView } from "System/guide/OpenChestView";
import { HeroView } from "System/hero/view/HeroView";
import { PropertyView } from "System/hero/view/PropertyView";
import { TitleView } from "System/hero/view/TitleView";
import { WybqView } from "System/hero/view/WybqView";
import { ZhuFuBaseView } from "System/hero/view/ZhuFuBaseView";
import { ShiZhuangPanel } from "System/hero/view/ShiZhuangPanel";
import { AcceptMarryView } from "System/Marry/AcceptMarryView";
import { MainMarryView } from "System/Marry/MainMarryView";
import { SendFlowerView } from "System/Marry/SendFlowerView";
import { ZhuFuZhaoHuiView } from "System/NewZhuFuRule/ZhuFuZhaoHuiView";
import { DoubleChargeView } from "System/pay/DoubleChargeView";
import { PayView } from "System/pay/PayView";
import { ErrorId } from "System/protocol/ErrorId";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { LookRankInfoView } from "System/rank/LookRankInfoView";
import { ShengQiView } from "System/shengqi/ShengQiView";
import { MessageBoxConst } from "System/tip/TipManager";
import { ConfirmCheck } from "System/tip/TipManager";
import { GrowUpDrugTipView } from "System/tip/view/GrowUpDrugTipView";
import { Color } from "System/utils/ColorUtil";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { SpecialTeQuanView } from "System/vip/SpecialTeQuanView";
import { VipTab, VipView } from "System/vip/VipView";
import { WuXiaHuanXingView } from "System/equip/WuXiaHuanXingView";
import { PetView } from 'System/pet/PetView'
import { PetJinJiePanel } from 'System/pet/PetJinJiePanel'
import { EquipCollectPanel } from 'System/equip/EquipCollectPanel'
import { RenameView } from "System/hero/view/RenameView"
import { YuanGuJingPaiView } from 'System/pinstance/boss/YuanGuJingPaiView'
import { MarryQiuYuanRecordView } from 'System/Marry/MarryQiuYuanRecordView'
import { BossView } from 'System/pinstance/boss/BossView'
import { ShenZhuangShouJiView } from 'System/szsj/ShenZhuangShouJiView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { HunLiPanel } from 'System/hunli/HunLiPanel'
import { HunHuanPanel } from 'System/hunli/HunHuanPanel';
import { HunLiView } from 'System/hunli/HunLiView'
import { JinjieView } from 'System/jinjie/view/JinjieView'
import { BigSkillShowView } from "../vip/BigSkillShowView";
import { RiChangView } from 'System/richang/RiChangView'

/**主角数据*/
export class HeroModule extends EventDispatcher {

    constructor() {
        super();
        this.addNetListener(Macros.MsgID_DayOperate_Response, this.onDayOperateResponse);
        this.addNetListener(Macros.MsgID_ChargeMoney_Notify, this._onChargeMoneyNotify);
        this.addNetListener(Macros.MsgID_NewCurrencyChanged_Notify, this._onNewCurrencyChangedNotify);
        //VIP相关
        this.addNetListener(Macros.MsgID_VIPOperate_Response, this._onVIPOperateResponse);
        this.addNetListener(Macros.MsgID_OpenSuperVIP_Response, this._onOpenPlatVIPOperateResponse);
        //称号
        //称号
        this.addNetListener(Macros.MsgID_Title_ActiveChange_Response, this.onTitleActiveChangeResponse);
        this.addNetListener(Macros.MsgID_Friend_RoleInfo_Response, this._onRoleInfoResponse);
        //祝福系统
        this.addNetListener(Macros.MsgID_HeroSub_List_Response, this._onHeroSubListResponse);
        this.addNetListener(Macros.MsgID_WYBQ_Get_Response, this._onWybqGetResponse);
        this.addNetListener(Macros.MsgID_FaBaoPannel_Response, this._onFaBaoPannel_Response);
        this.addNetListener(Macros.MsgID_FaBaoLevelUp_Response, this._onFabaoLevelUpResponse);
        this.addNetListener(Macros.MsgID_FaBaoActive_Response, this._onFabaoActiveResponse);
        this.addNetListener(Macros.MsgID_FaBaoXiangQian_Response, this._onFabaoXQResponse);
        this.addNetListener(Macros.MsgID_FaBaoShow_Response, this._onFabaoHHResponse);
        //时装
        this.addNetListener(Macros.MsgID_DRESS_Response, this._onDressResponse);
        //宝物
        this.addNetListener(Macros.MsgID_FaQiList_Notify, this._onFaqiNotify);
        this.addNetListener(Macros.MsgID_FaQiOperate_Response, this._onFaqiResponse);
        this.addNetListener(Macros.MsgID_FirstOpenChange_Notify, this.onFirstOpenChange);
        // 斗兽
        this.addNetListener(Macros.MsgID_ShenShouOperate_Response, this.onShenShouOperateResponse);
        this.addNetListener(Macros.MsgID_ShenShouList_Notify, this.onShenShouListNotify);
        //时装数据发生变化
        this.addEvent(Events.DressChange, this.onDressChange);
        //击杀被击杀记录
        this.addNetListener(Macros.MsgID_BeKilled_Notify, this.onHeroCsSkillRecord);
        //形象过期提示
        this.addNetListener(Macros.MsgID_Image_OverDue_Notify, this.onImageOverDueNotify);
        //婚姻
        this.addNetListener(Macros.MsgID_Marriage_Response, this.onHunYinResponse);
        //角色改名
        this.addNetListener(Macros.MsgID_Account_ModifyRole_Response, this.onRenameResponse)
        //世界拍卖
        this.addNetListener(Macros.MsgID_WorldPaiMai_Pannel_Response, this.onWorldPaiMaiPannelResponse);
        this.addNetListener(Macros.MsgID_WorldPaiMai_Buy_Response, this.onWorldPaiMaiBuyResponse);
        this.addNetListener(Macros.MsgID_WorldPaiMai_NewAct_Notify, this.onWorldPaiMaiNewActNotify);
        //魂力
        this.addNetListener(Macros.MsgID_HunLi_Response, this.onHunliResponse)
        //打坐
        this.addNetListener(Macros.MsgID_Zazen_Response, this.onZazenResponse)

    }

    /**婚姻系统响应*/
    private onHunYinResponse(response: Protocol.Marriage_Response) {
        if (ErrorId.EQEC_Success != response.m_usResultID) {
            uts.log('hun yin response fault');
        }
        else {
            let heroData = G.DataMgr.heroData;
            if (response.m_usType == Macros.HY_STATUS_NOTIFY) {
                let notify = response.m_stValue.m_stStatusNotify;
                //收到求婚申请了
                if (notify.m_usType == Macros.HY_APPLY_MARRY) {
                    let acceptMarryView = G.Uimgr.getForm<AcceptMarryView>(AcceptMarryView);
                    if (acceptMarryView != null) {
                        acceptMarryView.updateView(notify.m_ucMarryLevel);
                    } else {
                        G.Uimgr.createForm<AcceptMarryView>(AcceptMarryView).open(notify.m_ucMarryLevel);
                    }
                }
                //双方收到了求婚申请结果
                else if (notify.m_usType == Macros.HY_DEAL_MARRY) {
                    if (notify.m_ucDealFlag == 1) {
                        heroData.lover.m_ucXYFlag = 1;
                        if (heroData.roleID.m_uiUin == notify.m_stDealID.m_uiUin && heroData.roleID.m_uiSeq == notify.m_stDealID.m_uiSeq) {
                            heroData.mateName = notify.m_stSenderBase.m_szNickName;
                            heroData.lover.m_stID = notify.m_stSenderID;
                            heroData.lover.m_stBaseProfile = notify.m_stSenderBase;
                        }
                        //我是求婚的
                        else {
                            heroData.mateName = notify.m_stDealBase.m_szNickName;
                            heroData.lover.m_stID = notify.m_stDealID;
                            heroData.lover.m_stBaseProfile = notify.m_stDealBase;
                        }
                    }
                    //我是求婚的
                    else if (heroData.roleID.m_uiUin == notify.m_stSenderID.m_uiUin && heroData.roleID.m_uiSeq == notify.m_stSenderID.m_uiSeq) {
                        G.TipMgr.showConfirm("很遗憾，" + TextFieldUtil.getColorText(notify.m_stDealBase.m_szNickName, Color.GREEN) + "拒绝了您的求婚", ConfirmCheck.noCheck, "确定");
                    }
                }
                // 收到了离婚申请
                else if (notify.m_usType == Macros.HY_DIVORCE_PACT) {
                    let name = G.DataMgr.heroData.mateName;
                    let text: string = TextFieldUtil.getColorText(name, Color.GREEN) + "申请与您解除仙侣关系，同意请点确定，不同意请点取消";
                    G.TipMgr.showConfirm(text, ConfirmCheck.noCheck, "确定|取消", this._onDivorceConfirmCallBack);
                }
                //收到离婚申请处理结果
                else if (notify.m_usType == Macros.HY_DEAL_DIVORCE) {
                    if (notify.m_ucDealFlag == 1) {
                        G.TipMgr.showConfirm("您已经和" + TextFieldUtil.getColorText(heroData.mateName, Color.GREEN) + "解除了仙侣关系", ConfirmCheck.noCheck, "确定");
                        heroData.mateName = "";
                    }
                    else if (heroData.roleID.m_uiUin == notify.m_stSenderID.m_uiUin && heroData.roleID.m_uiSeq == notify.m_stSenderID.m_uiSeq) {
                        G.TipMgr.showConfirm(TextFieldUtil.getColorText(notify.m_stDealBase.m_szNickName, Color.GREEN) + "不同意与您解除仙侣关系", ConfirmCheck.noCheck, "确定");
                    }
                }
            }
            else if (response.m_usType == Macros.HY_DIVORCE_FORCE) {
                //被强制离婚
                if (heroData.roleID.m_uiSeq == response.m_stRoleID.m_uiSeq && heroData.roleID.m_uiUin == response.m_stRoleID.m_uiUin) {
                    G.TipMgr.showConfirm(TextFieldUtil.getColorText(heroData.mateName, Color.GREEN) + "强制和您解除了仙侣关系", ConfirmCheck.noCheck, "确定");
                }
                else {
                    G.TipMgr.showConfirm("您已经和" + TextFieldUtil.getColorText(heroData.mateName, Color.GREEN) + "解除了仙侣关系", ConfirmCheck.noCheck, "确定");
                }
                heroData.mateName = "";
            }
            else if (response.m_usType == Macros.HY_DIVORCE_MISSING) {
                //协议离婚成功
                if (heroData.roleID.m_uiSeq != response.m_stRoleID.m_uiSeq || heroData.roleID.m_uiUin != response.m_stRoleID.m_uiUin) {
                    G.TipMgr.showConfirm("您已经和" + TextFieldUtil.getColorText(heroData.mateName, Color.GREEN) + "解除了仙侣关系", ConfirmCheck.noCheck, "确定");
                }
                heroData.mateName = "";
            }
            else if (response.m_usType == Macros.HY_GIVEFLOWER) {
                //送花
                //dispatchEvent(new ArgsEvent(EventTypes.sendFlowerSuccess));
                let sendFlowerView = G.Uimgr.getForm<SendFlowerView>(SendFlowerView);
                if (sendFlowerView != null) {
                    sendFlowerView.updateView();
                }
            }
            else if (response.m_usType == Macros.HY_QIUYUAN_PANEL) {
                //婚姻求缘面板响应
                let view = G.Uimgr.getForm<MarryQiuYuanRecordView>(MarryQiuYuanRecordView);
                if (view != null) {
                    view.updateView(response.m_stValue.m_stPanelList.m_astQiuYuanRoleInfo);
                }
            }
            else if (response.m_usType == Macros.HY_QIUYUAN_REGIST) {
                //婚姻求缘登记响应
                let view = G.Uimgr.getForm<MarryQiuYuanRecordView>(MarryQiuYuanRecordView);
                if (view != null) {
                    view.updateView(response.m_stValue.m_stRegistList.m_astQiuYuanRoleInfo);
                }
            }
            G.ModuleMgr.unitModule.onHunYinChange();
            let mainMarryView = G.Uimgr.getForm<MainMarryView>(MainMarryView);
            if (mainMarryView != null) {
                mainMarryView.onListResponse(response);
            }
            this.updateHunYinLevel(response);
        }

    }

    /**婚姻等级*/
    private updateHunYinLevel(response: Protocol.Marriage_Response) {
        let xyLevle: number = 0;
        if (response.m_usType == Macros.HY_XIANYUAN_UPLEVEL) {
            xyLevle = response.m_stValue.m_usXYUpLevelRsp;
        }
        else if (response.m_usType == Macros.HY_LIST_XIANYUAN) {
            xyLevle = response.m_stValue.m_usXYLevel;
        }
        let config: GameConfig.XianYuanPropCfgM = G.DataMgr.zhufuData.getXianyuanConfig(xyLevle + 1);
        let cost: number;
        if (config == null) {
            cost = 0;
        }
        else {
            cost = config.m_uiConsumableNum;
        }
        G.DataMgr.heroData.honeyUpCost = cost;
        G.ActBtnCtrl.update(false);
    }


    private _onDivorceConfirmCallBack(stage: number): void {
        if (MessageBoxConst.yes == stage) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(Macros.HY_DEAL_DIVORCE, null, 1));
        }
        else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(Macros.HY_DEAL_DIVORCE, null, 0));
        }
    }


    /**形象过期通知*/
    private onImageOverDueNotify(response: Protocol.ImageOverDue_Response) {
        if (response.m_usType == Macros.JXTZ_TITLE_CHANGE) {
            G.NoticeCtrl.updateJiXianTiaoZhanNotice(response.m_stValue.m_uiTitleLv);
        } else {
            G.DataMgr.heroData.overDueData = response;
            G.NoticeCtrl.checkOverDue();
        }
    }


    /**击杀记录提示*/
    private onHeroCsSkillRecord(notify: Protocol.CSBeKilled_Notify) {
        if (Macros.KILLED_TYPE_NORMAL == notify.m_iType) {
            // 普通杀按钮
            if (notify.m_szBeRoleName == G.DataMgr.heroData.name) {
                // G.NoticeCtrl.addNormalKilledNotify(notify);
                G.DataMgr.heroData.updateKillMeRoleIDList(notify);
                G.NoticeCtrl.checkNormalKilled();
            }
            else {
                // G.NoticeCtrl.addNormalKillNotify(notify);
                G.DataMgr.heroData.updateMyKillRoleIDList(notify);
                G.NoticeCtrl.checkHasNormalKill();

            }
        }
        else {
            // 失败按钮
            G.NoticeCtrl.addFailedNotify(notify);
        }
    }


    private onDressChange() {
        let heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (heroView != null) {
            heroView.updateTipMark();
        }
        let equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (equipView != null) {
            equipView.onDressChange();
        }
        //G.NoticeCtrl.checkEquipCollect();
        G.ActBtnCtrl.update(false);
        G.GuideMgr.tipMarkCtrl.onEquipCollectChange();
    }

    onAvatarChange() {
        let propertyView = G.Uimgr.getSubFormByID<PropertyView>(HeroView, KeyWord.OTHER_FUNCTION_HEROPROPERTY);
        if (propertyView != null) {
            propertyView.onAvatarChange();
        }
    }

    onHeroUpgrade() {
        let kuaiSuShengJiView = G.Uimgr.getForm<KuaiSuShengJiView>(KuaiSuShengJiView);
        if (kuaiSuShengJiView != null) {
            kuaiSuShengJiView.updateView();
        }
       // G.ViewCacher.mainView.newFunctionTrailerCtrl.updateView();
        G.ViewCacher.mainView.onDailyQuestUpdate();
    }

    onZhufuDataChange(id: number, result: number = 0) {
        let heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (heroView != null) {
            heroView.updateTipMark();
            let child = heroView.getCurrentTab() as ZhuFuBaseView;
            if (child.isOpened) {
                if (child.zhufuLevelChange) {
                    child.zhufuLevelChange(result);
                }
                if (child.zhufuDataChange) {
                    child.zhufuDataChange(id);
                }
            }
        }
        let jinjieView = G.Uimgr.getForm<JinjieView>(JinjieView);
        if (jinjieView != null) {
            jinjieView.updateTipMark();
            let child = jinjieView.getCurrentTab() as ZhuFuBaseView;
            if (child.isOpened) {
                if (child.zhufuLevelChange) {
                    child.zhufuLevelChange(result);
                }
                if (child.zhufuDataChange) {
                    child.zhufuDataChange(id);
                }
            }
        }

        let growUpDrugTipView = G.Uimgr.getForm<GrowUpDrugTipView>(GrowUpDrugTipView);
        if (growUpDrugTipView != null) {
            growUpDrugTipView.updateView();
        }

        let view = G.Uimgr.getForm<RiChangView>(RiChangView);
        if (view != null) {
            view.updateSaiJiView();
        }
        //G.ViewCacher.mainView.newFunctionTrailerCtrl.updateView();
    }


    private onDayOperateResponse(response: Protocol.DayOperate_Response) {
        if (ErrorId.EQEC_Success != response.m_iResult) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResult));
        } else {
            G.DataMgr.systemData.dayOperateBits = response.m_uiRecord;
            if (Macros.DAY_QUEST_DAILY == response.m_uiType || Macros.DAY_QUEST_GUILD == response.m_uiType) {
                G.ViewCacher.mainView.taskTrackList.updateView(false);
            }
            else if (Macros.DAY_QQ_SERVICE == response.m_uiType) {
                //激活码每日领奖
                let fuLiDaTingView = G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView);
                if (fuLiDaTingView != null) {
                    fuLiDaTingView.updateActiveCodePanel();
                }
            }
        }
    }

    private onFirstOpenChange(notify: Protocol.FirstOpen_Notify) {
        G.DataMgr.systemData.onlyOneTimeAllLifeBits = notify.m_uiFristOpenFunc;
        G.DataMgr.systemData.canOpenTagBits = notify.m_uiCanOpenTag;
        // let payView = G.Uimgr.getForm<PayView>(PayView);
        // if (payView != null) {
        //     payView.updataPayData();
        // }
        //充值整合到vip面板
        let vipView = G.Uimgr.getForm<VipView>(VipView);
        if (vipView != null) {
            vipView.updatePayPanel();
        }
    }

    /**
    * 货币更新的通知
    * @param msg
    *
    */
    private _onNewCurrencyChangedNotify(notify: Protocol.NewCurrencyChanged_Notify): void {
        let info: Protocol.CurrencyInfo = notify.m_stCurrencyInfo;
        let deltaValue: number = notify.m_iDeltaValue;
        let promptText: string = G.DataMgr.heroData.updateNewCurrencyInfo(info);
        if (deltaValue > 0) {
            // 货币增加飘字显示
            if (promptText != null) {
                deltaValue = GameIDUtil.getShowMoney(deltaValue, info.m_iCurrencyID);
                let str = "获取:" + promptText + deltaValue;
                if (promptText != '宝库积分') { G.TipMgr.addMainFloatTip(str, FloatShowType.GetReward); }
            }
            if (KeyWord.MONEY_TONGQIAN_ID == info.m_iCurrencyID) {
                G.UnitMgr.addDropCoins(deltaValue, notify.m_iTargetUnitID);
            } else {
                if (info.m_iCurrencyID == KeyWord.MONEY_YUANBAO_ID) {
                    if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_DUANWU)) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_DUANWU, Macros.DUANWU_ACT_PANEL));
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_DUANWU, Macros.ZYJ_CZFL_PANEL));
                    }
                    if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_CHARGE_REDBAG)) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CHARGE_REDBAG, Macros.CHARGE_REDBAG_PANEL));
                    }
                    if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_BU_BU_GAO_SHENG)) {
                        // 金玉满堂
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BU_BU_GAO_SHENG, Macros.ACTIVITY_BBGS_OPEN_PANEL));
                    }

                    if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_JU_BAO_PENG)) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_JU_BAO_PENG, Macros.ACTIVITY_JBP_OPEN_PANEL));
                    }
                    if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_SPRING_CHARGE)) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SPRING_CHARGE, Macros.ACTIVITY_SPRING_CHARGE_PANEL));
                    }
                    if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_HJXN_CHARGE)) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HJXN_CHARGE, Macros.ACTIVITY_HJXN_CHARGE_PANNEL));
                    }
                }
            }
        }
        else {//减少了钻石
            if (info.m_iCurrencyID == KeyWord.MONEY_YUANBAO_ID) {
                if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_HLZP)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HLZP, Macros.HLZP_PANNEL));
                }
                //消费返利
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KFXFLB_OPEN));
            }
        }
        this.processCurrencyChange(info.m_iCurrencyID);
        if (info.m_iCurrencyID == KeyWord.MONEY_YUANBAO_ID && notify.m_iFlowType == 101) {
            //充值上报热云数据
            uts.log('充值到账');
            G.ChannelSDK.report(ReportType.RechargeGetMoney);
        }
    }

    processCurrencyChange(id: number) {
        G.ViewCacher.mainView.onCurrencyChange(id);
        G.GuideMgr.tipMarkCtrl.onCurrencyChange(id);
        G.ModuleMgr.bagModule.onCurrencyChange(id);
        G.ModuleMgr.businessModule.onCurrencyChange(id);
        G.ModuleMgr.guildModule.onCurrencyChange(id);
        G.ModuleMgr.activityModule.onCurrencyChange(id);
        G.ModuleMgr.pinstanceModule.onCurrencyChange(id);
        let mainMarryView = G.Uimgr.getForm<MainMarryView>(MainMarryView);
        if (mainMarryView != null) {
            mainMarryView.onMoneyChange(id);
        }

        let doubleChargeView = G.Uimgr.getForm<DoubleChargeView>(DoubleChargeView);
        if (doubleChargeView) doubleChargeView.onCurrencyChange(id);
    }

    /**
     * 充值金额的改变
     * @param msg
     *
     */
    private _onChargeMoneyNotify(msg: Protocol.ChargeMoney_Notify): void {
        let notify: Protocol.ChargeMoney_Notify = msg;
        G.DataMgr.heroData.updateChargeMoney(notify.m_iChargeMoney);
        G.DataMgr.leiJiRechargeData.updateCurCzNum(notify.m_iDeltaMoney);

        let activityData = G.DataMgr.activityData;
        if (activityData.isActivityOpen(Macros.ACTIVITY_ID_124DBCZ)) {
            //单笔充值
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_124DBCZ, Macros.Act124_PANNEL));
        }
        if (activityData.isActivityOpen(Macros.ACTIVITY_ID_125XHCZ)) {
            //循环充值
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_125XHCZ, Macros.Act125_PANNEL));
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.ZGLB_OPEN_PANEL));
    }

    private _onRoleInfoResponse(msg: Protocol.Friend_RoleInfo_Response): void {
        let response: Protocol.Friend_RoleInfo_Response = msg;
        //透传数据大于0表示是排行榜查看数据，和这里无关
        if (response.m_ucTransData > 0) {
            return;
        }

        if (0 != response.m_ushResultID) {
            let errorId: number = response.m_ushResultID;
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(errorId));
            return;
        }
        G.DataMgr.otherPlayerData.roleByRes = response;
        //this.m_heroDialog.showOrCloseDialog(true, null, HeroDialog.PAGE_HERO);

        if (G.DataMgr.runtime.oneRankInfo != null) {
            G.Uimgr.createForm<LookRankInfoView>(LookRankInfoView).open(G.DataMgr.runtime.oneRankInfo);
            G.DataMgr.runtime.oneRankInfo = null;
        } else {
            G.DataMgr.otherPlayerData.otherFight = msg.m_stCacheRoleInfo.m_stRoleInfo.m_stUnitInfo.m_stUnitAttribute.m_allValue[Macros.EUAI_FIGHT];
            //-1表示查看别人的信息，
            G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.OTHER_FUNCTION_HEROPROPERTY, -1);
        }


    }

    /**
     *激活或取消称号响应处理
     * @param msg
     *
     */
    private onTitleActiveChangeResponse(response: Protocol.Title_ActiveChange_Response): void {

        if (ErrorId.EQEC_Success == response.m_usResult) {
            let titleView = G.Uimgr.getSubFormByID<TitleView>(HeroView, KeyWord.OTHER_FUNCTION_HEROTITLE);
            if (response.m_usType == Macros.TITLE_LIST_DATA) {
                G.DataMgr.titleData.updateListData(response.m_stValue.m_stTitleListRsp.m_stFixTitleList, response.m_stValue.m_stTitleListRsp.m_usShowTitleID);
                if (titleView != null) {
                    titleView.updateView();
                }
            }
            else if (response.m_usType == Macros.TITLE_SET_SHOW) {
                G.DataMgr.titleData.updateListData(response.m_stValue.m_stSetTitleRsp.m_stFixTitleList, response.m_stValue.m_stSetTitleRsp.m_usShowTitleID);
                if (titleView != null) {
                    titleView.updatePanel();
                }
            }
        }
    }


    ////////////////////////////////////////////////// VIP相关 //////////////////////////////////////////////////

    private _onOpenPlatVIPOperateResponse(response: Protocol.OpenSuperVIP_Response): void {
        G.DataMgr.vipData.IsOldSvip(response.m_uiFristOpenFunc);
    }



    /**
    * vip特权操作的response
    * @param msg
    *
    */
    private _onVIPOperateResponse(response: Protocol.VIPOperate_Response): void {

        if (ErrorId.EQEC_Success != response.m_ushResultID) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ushResultID));
        }
        else {
            if (Macros.VIP_OPERATE_LIST == response.m_usType) {
                // 拉取Vip数据
                G.DataMgr.vipData.updateListInfo(response.m_stValue.m_stListDataRsp);
                // 副本保留次数发生变化
                G.ModuleMgr.pinstanceModule.onPinstanceChange();
                G.NoticeCtrl.checkVip();
                G.DataMgr.vipData.m_uiVIPSkillTime = response.m_stValue.m_stListDataRsp.m_uiVIPSkillTime;
                G.ViewCacher.mainView.onVipSkillIconDataChange();
                //刷新vip返利面板
                // let vipView = G.Uimgr.getForm<VipView>(VipView);
                // if (vipView != null) {
                //     vipView.updateVipFanLiPanel();
                // }
            }
            else if (Macros.VIP_OPERATE_MONTH_LIST == response.m_usType) {
                //vip月卡查询协议
                G.DataMgr.vipData.updateDailyGiftGetStage(response.m_stValue.m_stMonthListDataRsp);
                G.DataMgr.vipData.updateVipJinJieLv(response.m_stValue.m_stMonthListDataRsp.m_auiExp);
                G.DataMgr.vipData.m_uiVIPSkillTime = response.m_stValue.m_stMonthListDataRsp.m_uiVIPSkillTime;
                G.ViewCacher.mainView.onVipSkillIconDataChange();
                TipMarkUtil.vipReward();
                let vipView = G.Uimgr.getForm<VipView>(VipView);
                if (vipView != null) {
                    vipView.updateZunxiangPanel();
                }
            }
            else if (Macros.VIP_OPERATE_MONTH_GET_GIFT == response.m_usType) {
                G.DataMgr.vipData.updateDailyGiftGetStage(response.m_stValue.m_stMonthGetGiftRsp);
                let vipView = G.Uimgr.getForm<VipView>(VipView);
                if (vipView != null) {
                    vipView.updateZunxiangPanel();
                }
            }
            else if (Macros.VIP_OPERATE_GET_GIFT == response.m_usType) {
                // 领取礼包
                G.DataMgr.vipData.listInfo.m_uiGetFlag = response.m_stValue.m_stGetGiftRsp.m_iGetGiftFlag;
                G.DataMgr.vipData.setVipDailyGiftStatus();
                G.NoticeCtrl.checkVip();
            }
            else if (Macros.VIP_OPERATE_GET_LIFELONG_GIFT == response.m_usType) {
                // Vip玩家领取终生礼包的标识
                G.DataMgr.vipData.listInfo.m_iGetLifeLongGiftFlag = response.m_stValue.m_stGetLifeLongGiftRsp.m_iFlag;
                G.DataMgr.vipData.updateNumVipLevelRewar();
                G.NoticeCtrl.checkVip();
            }
            else if (Macros.VIP_OPERATE_MONTH_BUY == response.m_usType) {
                //月卡购买
                let heroData = G.DataMgr.heroData;
                let oldStates = heroData.getAllPriState();
                heroData.upDateVipMonthLevel(response.m_stValue.m_stMonthBuyRsp.m_iLevel, response.m_stValue.m_stMonthBuyRsp.m_auiTimeOut);
                let newStates = heroData.getAllPriState();
                this._reportVIPReyunData(oldStates, newStates);
                let vipView = G.Uimgr.getForm<VipView>(VipView);
                if (vipView != null) {
                    vipView.updateZunxiangPanel();
                } else {
                    G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
                }
                let bigskill = G.Uimgr.getForm<BigSkillShowView>(BigSkillShowView);
                if (bigskill != null && bigskill.isOpened) {
                    bigskill.close();
                }
                G.ViewCacher.mainView.onVipSkillIconDataChange();
            }
            else if (Macros.VIP_OPERATE_BUY_PINSTANCE == response.m_usType) {
                // 购买副本次数
                G.DataMgr.vipData.updatePinstanceTime(response.m_stValue.m_stBuyPinstanceRsp);
                // 副本保留次数发生变化
                G.ModuleMgr.pinstanceModule.onPinstanceChange();

                //小鸡副本
                if (response.m_stValue.m_stBuyPinstanceRsp.m_iType == Macros.PINSTANCE_ID_DYZSPIN) {
                    G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_DYZSPIN);
                }
                else if (response.m_stValue.m_stBuyPinstanceRsp.m_iType == Macros.PINSTANCE_ID_WORLDBOSS) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_LIST));
                    let view = G.Uimgr.getForm<BossView>(BossView);
                    if (view != null) {
                        view.updateWorldBoss();
                    }
                } else if (response.m_stValue.m_stBuyPinstanceRsp.m_iType == Macros.PINSTANCE_ID_VIP) {
                    let view = G.Uimgr.getForm<BossView>(BossView);
                    if (view != null) {
                        view.updateVIPBoss();
                    }
                }

            }
            else if (Macros.VIP_OPERATE_SPECIAL_BUY == response.m_usType) {
                //特殊特权购买
                let view = G.Uimgr.getForm<SpecialTeQuanView>(SpecialTeQuanView);
                if (view != null) {
                    view.updateView();
                }
            }
            else if (Macros.VIP_OPERATE_SPECIAL_LIST == response.m_usType) {
                //特殊特权查询
                G.DataMgr.vipData.updateSpecialPri(response.m_stValue.m_stSpecialPriListRsp.m_uiStatus);
                let view = G.Uimgr.getForm<SpecialTeQuanView>(SpecialTeQuanView);
                if (view != null) {
                    view.updateView();
                }

                let heroView = G.Uimgr.getForm<HeroView>(HeroView);
                if (heroView != null) {
                    heroView.onSpecialPriChange();
                }
                let petJinJiePanel = G.Uimgr.getChildForm<PetJinJiePanel>(PetView, KeyWord.OTHER_FUNCTION_PET_JINJIE);
                if (petJinJiePanel != null && petJinJiePanel.isOpened) {
                    petJinJiePanel.onSpecialPriChange();
                }
                let equipCollectPanel = G.Uimgr.getSubFormByID<EquipCollectPanel>(EquipView, KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
                if (equipCollectPanel != null && equipCollectPanel.isOpened) {
                    equipCollectPanel.onSpecialPriChange();
                }
            } else if (Macros.VIP_OPERATE_PRIHY_LIST == response.m_usType) {
                //vip活跃查询
                G.DataMgr.vipData.updateVipTeQuanHuoYueData(response.m_stValue.m_stVPIPriHYDataList);
                // let vipView = G.Uimgr.getForm<VipView>(VipView);
                // if (vipView != null) {
                //     vipView.updateVipHuoYuePanel();
                // }
            }
            let vipView = G.Uimgr.getForm<VipView>(VipView);
            if (vipView != null) {
                vipView.updateRewardPanel();
            }
            G.ActBtnCtrl.update(false);
        }
    }

    private _reportVIPReyunData(oldStates: number[], newStates: number[]) {
        let buyLv = 0;
        for (let i = 0; i < oldStates.length; i++) {
            if (oldStates[i] != newStates[i] && newStates[i] >= 0) {
                buyLv = i + 1;
                break;
            }
        }
        if (buyLv <= 1) return;
        //黄金钻石特权卡特殊处理上报热云（没法在获得元宝统一上报）
        if (buyLv == 2) {
            G.DataMgr.heroData.rechargeGetMoney = 45;
        }
        else if (buyLv == 3) {
            G.DataMgr.heroData.rechargeGetMoney = 188;
        }
    }

    //祝福系统
    private _onHeroSubListResponse(response: Protocol.HeroSub_List_Response): void {
        if (response.m_iResult == 0) {
            G.DataMgr.zhufuData.setData(response.m_stList);
        }
        this.onZhufuDataChange(0);
    }


    /**
     * 我要变强
     * @param msg
     *
     */
    private _onWybqGetResponse(msg: Protocol.WYBQ_Get_Response): void {
        let wybqView = G.Uimgr.getForm<WybqView>(WybqView);
        if (wybqView != null) {
            wybqView.updateData(msg.m_stTypeValue);
        }
    }

    /**
     * 法宝面板信息拉取
     * @param msg
     *
     */
    private _onFaBaoPannel_Response(msg: Protocol.FaBaoPannel_Response): void {
        let response: Protocol.FaBaoPannel_Response = msg;

        if (ErrorId.EQEC_Success != response.m_iResultID) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
            return;
        }
        else {
            G.DataMgr.fabaoData.setFabaoShowID(response.m_stFaBaoList.m_ucShowID);
            G.DataMgr.fabaoData.setFabaoInfoList(response.m_stFaBaoList.m_astFaBaoList);
            let shengQiView = G.Uimgr.getForm<ShengQiView>(ShengQiView);
            if (shengQiView != null) {
                shengQiView.updateView();
            }
        }
        G.GuideMgr.tipMarkCtrl.onFabaoChange();
    }

    private _onFabaoActiveResponse(response: Protocol.FaBaoActive_Response): void {
        G.DataMgr.fabaoData.setFabaoShowID(response.m_iShowID);
        G.DataMgr.fabaoData.updateFabaoInfoList(response.m_iID, response.m_stFaBao);
        let shengQiView = G.Uimgr.getForm<ShengQiView>(ShengQiView);
        if (shengQiView != null) {
            shengQiView.updateView();
        }
        G.GuideMgr.tipMarkCtrl.onFabaoChange();
    }
    private _onFabaoXQResponse(response: Protocol.FaBaoXiangQian_Response): void {
        G.DataMgr.fabaoData.updateFabaoInfoList(response.m_iID, response.m_stFaBao);
        let shengQiView = G.Uimgr.getForm<ShengQiView>(ShengQiView);
        if (shengQiView != null) {
            shengQiView.updateView();
        }
        G.GuideMgr.tipMarkCtrl.onFabaoChange();
    }
    private _onFabaoHHResponse(response: Protocol.FaBaoShow_Response): void {
        G.DataMgr.fabaoData.setFabaoShowID(response.m_iShowID);
        let shengQiView = G.Uimgr.getForm<ShengQiView>(ShengQiView);
        if (shengQiView != null) {
            shengQiView.updateView();
        }
    }

    /**
     * 法宝升级
     * @param msg
     *
     */
    private _onFabaoLevelUpResponse(response: Protocol.FaBaoLevelUp_Response): void {
        if (ErrorId.EQEC_Success != response.m_iResultID) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
            return;
        }
        else {
            G.DataMgr.fabaoData.updateFabaoInfoList(response.m_iID, response.m_stFaBao);
            let shengQiView = G.Uimgr.getForm<ShengQiView>(ShengQiView);
            if (shengQiView != null) {
                shengQiView.updateView();
            }
        }
        G.GuideMgr.tipMarkCtrl.onFabaoChange();
    }

    /**
    * 时装数据变动
    * @param msg
    *
    */
    private _onDressResponse(response: Protocol.Dress_Response): void {
        if (response.m_iResultID != 0) {
            return;
        }
        let dressList: Protocol.DressImageListInfo = G.DataMgr.heroData.dressList;
        if (response.m_usType == Macros.DRESS_IMAGE_LIST) {
            G.DataMgr.heroData.dressList = dressList = response.m_stValue.m_stImageList;
            let shiZhuangPanel = G.Uimgr.getSubFormByID<ShiZhuangPanel>(JinjieView, KeyWord.OTHER_FUNCTION_DRESS);
            if (shiZhuangPanel != null) {
                shiZhuangPanel.updatePanel(G.DataMgr.heroData.dressList.m_uiImageID);
            }
        }
        else if (response.m_usType == Macros.DRESS_IMAGE_SHOW) {
            dressList.m_bIsHide = response.m_stValue.m_bIsHide;
        }
        else if (response.m_usType == Macros.DRESS_IMAGE_CHANGE) {
            //时装幻化response
            dressList.m_uiImageID = response.m_stValue.m_stChangeRsp.m_uiImageID;
            dressList.m_ucColorIndex = response.m_stValue.m_stChangeRsp.m_ucColorIndex;
            let shiZhuangPanel = G.Uimgr.getSubFormByID<ShiZhuangPanel>(JinjieView, KeyWord.OTHER_FUNCTION_DRESS);
            if (shiZhuangPanel != null) {
                shiZhuangPanel.updatePanel(dressList.m_uiImageID);

            }
        }
        else if (response.m_usType == Macros.DRESS_TRAIN) {
            //时装培养
            let trainRsp: Protocol.DressTrainRsp = response.m_stValue.m_stTrainRsp;
            if (trainRsp.m_ucType == Macros.IMAGE_TRAIN_DRESS) {
                //时装系统
                for (let dress of dressList.m_astImageList) {
                    if (dress.m_uiImageID == trainRsp.m_uiImageID) {
                        dress.m_uiAddNum = trainRsp.m_uiAddNum;
                        break;
                    }
                }
                let shiZhuangPanel = G.Uimgr.getSubFormByID<ShiZhuangPanel>(JinjieView, KeyWord.OTHER_FUNCTION_DRESS);
                if (shiZhuangPanel != null) {
                    shiZhuangPanel.updatePanel(trainRsp.m_uiImageID);
                }
            }
            else if (trainRsp.m_ucType == Macros.IMAGE_TRAIN_HEROSUB) {
                //祝福系统
                let image: Protocol.HeroSubDressOneImage = G.DataMgr.zhufuData.getTimeItem(trainRsp.m_ucSubType, trainRsp.m_uiImageID);
                uts.log("祝福系统数据改变：" + trainRsp.m_ucSubType);
                this.onZhufuDataChange(trainRsp.m_ucSubType);
                return;
            }
            else if (trainRsp.m_ucType == Macros.IMAGE_TRAIN_TITLE) {
                //称号系统培养
                let title: Protocol.TitleFixOne = G.DataMgr.titleData.getSpecTitleOneInfo(trainRsp.m_uiImageID);
                title.m_uiAddNum = trainRsp.m_uiAddNum;
                let heroView = G.Uimgr.getForm<HeroView>(HeroView);
                if (heroView != null) {
                    heroView.updateTitleTipMark();
                }
                let titleView = G.Uimgr.getSubFormByID<TitleView>(HeroView, KeyWord.OTHER_FUNCTION_HEROTITLE);
                if (null != titleView) {
                    titleView.updatePanel(trainRsp.m_uiImageID);
                }
                return;
            }
        }
        else if (response.m_usType == Macros.DRESS_STRENG) {

            G.DataMgr.heroData.updateHeroDressList(response.m_stValue.m_stStrengRsp);
            //时装强化
            let view = G.Uimgr.getForm<WuXiaHuanXingView>(WuXiaHuanXingView);
            if (view != null) {
                view.updateView();
            }

            let shiZhuangPanel = G.Uimgr.getSubFormByID<ShiZhuangPanel>(JinjieView, KeyWord.OTHER_FUNCTION_DRESS);
            if (shiZhuangPanel != null && shiZhuangPanel.isOpened) {

                //刷新战力
                shiZhuangPanel.updateAttList();
                //刷新红点
                let cfg = shiZhuangPanel.cfg;
                let canStrength = cfg.m_bCanStreng == 1;
                shiZhuangPanel.updateBtnColorStatus(cfg.m_uiImageId, canStrength);
                shiZhuangPanel.updateSpecialSubTipMark(shiZhuangPanel.fashionData, shiZhuangPanel.m_pyMaterialData.id);

                shiZhuangPanel.updatePanel(cfg.m_uiImageId);
            }
        }


        this.dispatchEvent(Events.DressChange);
    }

    /**
     * 宝物数据变化
     * @param msg
     *
     */
    private _onFaqiNotify(notify: Protocol.FaQiList_Notify): void {
        G.DataMgr.fabaoData.setFaqiInfoList(notify);
        this.processFaqiChange();
        let data = notify.m_stFaQiList.m_astFaQiList;
        let saveWish: number = 0;
        let currentWish: number = 0;
        for (let info of data) {
            if (info.m_iID == G.DataMgr.fabaoData.zhuiHuiFaQiId) {
                saveWish = info.m_uiSaveWish;
                currentWish = info.m_uiWish;
                break;
            }
        }
        let zhuFuZhaoHuiView = G.Uimgr.getForm<ZhuFuZhaoHuiView>(ZhuFuZhaoHuiView);
        if (zhuFuZhaoHuiView != null) {
            zhuFuZhaoHuiView.updateView(saveWish, currentWish);
        }
    }

    private _onFaqiResponse(response: Protocol.FaQiOperate_Response): void {
        if (response.m_iResult == 0) {
            G.DataMgr.fabaoData.updateByReponse(response);
            this.processFaqiChange();
        }
    }

    private processFaqiChange() {
        let faqiView = G.Uimgr.getForm<FaQiView>(FaQiView);
        if (faqiView != null) {
            faqiView.onFaQiChange();
        }
        G.GuideMgr.tipMarkCtrl.onFaQiChange();
    }

    /**猎魂响应*/
    private onRecruitAlchemistResponse(msg: Protocol.FyMsg): void {
        let response: Protocol.RecruitAlchemist_Response = msg.m_msgBody as Protocol.RecruitAlchemist_Response;
        if (response.m_iResultID != ErrorId.EQEC_Success) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
            return;
        }

        //if (response.m_iOperateType == Macros.ALCHEMIST_EDWARD_TYPE)
        //{
        G.TipMgr.addMainFloatTip('召唤成功');
        //}
        //else
        //{
        G.TipMgr.addMainFloatTip('猎魂成功');
        //}
    }

    /**猎魂魂珠操作响应*/
    private onOpCrystalResponse(response: Protocol.OpCrystal_Response): void {
        if (response.m_iResultID != ErrorId.EQEC_Success) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
        }
        if (response.m_iOperateType == Macros.CRYSTAL_DECOMPOSE_TYPE) {
            //转化成功
            //this.dispatchEvent(Events.LHTurnSuccess);
        }
    }

    /**猎魂容器通知*/
    private onCrystalContainerChangedNotify(response: Protocol.CrystalContainerChanged_Notify): void {
        // G.DataMgr.lhData.updateLhBagData(response);
        //this.dispatchEvent(Events.updateLHBagData);
    }

    ////////////////////////////////////////////// 斗兽神兽 //////////////////////////////////////////////

    private onShenShouOperateResponse(response: Protocol.ShenShouOperate_Response) {
        if (0 == response.m_iResult) {
            G.DataMgr.siXiangData.updateShenShouList(response.m_stShenShouList);
            this.processSiXiangChange();
        } else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResult));
        }
    }

    private onShenShouListNotify(notify: Protocol.ShenShouList_Notify) {
        G.DataMgr.siXiangData.updateShenShouList(notify.m_stShenShouList);
        this.processSiXiangChange();
    }

    private processSiXiangChange() {
        let faqiView = G.Uimgr.getForm<FaQiView>(FaQiView);
        if (null != faqiView) {
            faqiView.onShenShouChange();
        }
        G.GuideMgr.tipMarkCtrl.onSiXiangChange();
    }

    ////////////////////////////////////////////// 改名卡 //////////////////////////////////////////////
    private onRenameResponse(response: Protocol.ModifyRole_Account_Response) {
        if (0 == response.m_uiResultID) {
            if (response.m_cModifyType = Macros.ROLE_INFO_MODIFY_TYPE_NAME_CARD) {
                //uts.logError("改名成功：" + response.m_szNickName);
                G.DataMgr.heroData.name = response.m_szNickName;
                G.DataMgr.heroData.renameCd = G.SyncTime.getCurrentTime() / 1000; //登录时再校准
                G.ViewCacher.mainView.heroInfoCtrl.onNameChange();//更新主界面


                let hero = G.UnitMgr.getRoleByUIN(G.DataMgr.heroData.roleID.m_uiUin);
                hero.onUpdateNameboard(null);//更新玩家
                if (hero.pet)
                    hero.pet.onUpdateNameboard(null); //更新伙伴

                //重新拉取好友
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFetchGameFriendRequest());

                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamInfoRequest());
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchGuildMembers());

                G.TipMgr.showConfirm("改名成功！", ConfirmCheck.noCheck, "确定", delegate(this, this._onRenameConfirm))
            }

        } else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_uiResultID));

        }

    }

    private _onRenameConfirm(state: MessageBoxConst, isCheckSelected: boolean, isFree: number): void {
        if (state == MessageBoxConst.yes) {

            let form = G.Uimgr.getForm<RenameView>(RenameView);
            if (form != null) {
                form.close();
            }
        }
    }


    ///////////////////////////世界拍卖/////////////////////////

    private onWorldPaiMaiPannelResponse(response: Protocol.WorldPaiMai_Pannel_Response) {
        // uts.log(" 世界拍卖  打开面板   " + JSON.stringify(response));
        if (response.m_iResult == 0) {
            G.DataMgr.monsterData.setWorldPaiMaiItemList(response.m_stItemList)
            G.DataMgr.monsterData.updatePrevActRecord(response.m_stActLog);
            let view = G.Uimgr.getForm<YuanGuJingPaiView>(YuanGuJingPaiView);
            if (view != null) {
                view.updatePanel();
            }

        }
    }


    private onWorldPaiMaiBuyResponse(response: Protocol.WorldPaiMai_Buy_Response) {
        // uts.log(" 世界拍卖  竞拍   " + JSON.stringify(response));
        if (response.m_iResult == 0) {
            G.DataMgr.monsterData.updateWorldPaiMaiItemList(response.m_stItemInfo);
            let view = G.Uimgr.getForm<YuanGuJingPaiView>(YuanGuJingPaiView);
            if (view != null) {
                view.updatePanel();
            }
        } else {
            G.TipMgr.addMainFloatTip("竞拍物品失败，请稍后再试！");
        }
    }

    private onWorldPaiMaiNewActNotify(response: Protocol.WorldPaiMai_NewAct_Notify) {
        if (response.m_iActCount > 0) {
            for (let i = 0; i < response.m_iActCount; i++) {
                let actInfo = response.m_stActLogList[i];
                let leftTime = actInfo.m_uiEndTime - Math.floor(G.SyncTime.getCurrentTime() / 1000);
                if (leftTime > 0) {
                    G.DataMgr.runtime.worldPaiMaiShouldTip = true;
                    break;
                }
            }
        } else {
            G.DataMgr.runtime.worldPaiMaiShouldTip = false;
        }
    }

    private onHunliResponse(response: Protocol.HunLi_Response) {
        if (0 == response.m_iResult) {
            let hunliData = G.DataMgr.hunliData;
            let hero = G.UnitMgr.getRoleByUIN(G.DataMgr.heroData.roleID.m_uiUin);
            hero.onUpdateNameboard(null);//更新玩家
            G.GuideMgr.tipMarkCtrl.onHunliLevelChange();
            if (response.m_usType == Macros.HUNLI_LEVEL_UP) {
                hunliData.level = response.m_stValue.m_stHunLiRsp.m_stHunLiInfo.m_ucHunLiLevel;
                hunliData.conditionInfo = response.m_stValue.m_stHunLiRsp.m_stHunLiInfo.m_stCurConditionList;
                hunliData.hunhuanProgress = response.m_stValue.m_stHunLiRsp.m_stHunLiInfo.m_uiHunHuanProgress;
                hunliData.hunliNode = response.m_stValue.m_stHunLiRsp.m_stHunLiInfo.m_ucHunLiSubLevel;
                // hunliData.levelUpCount = response.m_stValue.m_stHunLiRsp.m_stHunLiInfo.m_ucHunHuanInfoCount;
                // hunliData.hunhuanLevelInfoList = response.m_stValue.m_stHunLiRsp.m_stHunLiInfo.m_stHunHuanInfoList;
                let view = G.Uimgr.getForm<HunLiView>(HunLiView);
                if (view != null) {
                    view.updateHunliPanel(Macros.HUNLI_LEVEL_UP);
                }
                // 通知场景刷新角色头顶信息
                G.ModuleMgr.unitModule.onHunliLevelChange();
                // G.DataMgr.taskRecommendData.updateHnliConditionChange();
            }
            else if (response.m_usType == Macros.HUNLI_HUNHUAN_ZHURU) {
                hunliData.hunhuanProgress = response.m_stValue.m_stHunHuanZhuRuRsp.m_iProgressValue;

                let view = G.Uimgr.getForm<HunLiView>(HunLiView);
                if (view != null) {
                    view.updateHunHuanPanel();

                }

            }
            else if (response.m_usType == Macros.HUNLI_HUNHUAN_ACTIVE) {
                hunliData.hunhuanId = response.m_stValue.m_uiHunHuanActiveID;
                hunliData.hunhuanProgress = 0;
                let view = G.Uimgr.getForm<HunLiView>(HunLiView);
                let cfg = hunliData.getHunHuanConfigById(hunliData.hunhuanId);
                if (view != null) {
                    view.updateHunHuanPanel(true, cfg.m_iRequireHunLiLevel, true);
                }
            }
            else if (response.m_usType == Macros.HUNLI_REWARD) {
                let hunliData = G.DataMgr.hunliData;
                hunliData.level = response.m_stValue.m_stHunLiRewardRsp.m_stHunLiInfo.m_ucHunLiLevel;
                hunliData.conditionInfo = response.m_stValue.m_stHunLiRewardRsp.m_stHunLiInfo.m_stCurConditionList;
                let view = G.Uimgr.getForm<HunLiView>(HunLiView);
                if (view != null) {
                    view.updateHunliPanel(Macros.HUNLI_REWARD);
                }
                // 通知场景刷新角色头顶信息
                G.ModuleMgr.unitModule.onHunliLevelChange();
                // G.DataMgr.taskRecommendData.updateHnliConditionChange();
            }
            else if (response.m_usType == Macros.HUNLI_FINISH_NOTIFY) {
                let hunliData = G.DataMgr.hunliData;
                hunliData.level = response.m_stValue.m_stHunLiFinishNotify.m_stHunLiInfo.m_ucHunLiLevel;
                hunliData.conditionInfo = response.m_stValue.m_stHunLiFinishNotify.m_stHunLiInfo.m_stCurConditionList;
                let view = G.Uimgr.getForm<HunLiView>(HunLiView);
                if (view != null) {
                    view.updateHunliPanel(Macros.HUNLI_FINISH_NOTIFY);
                }
                // 通知场景刷新角色头顶信息
                G.ModuleMgr.unitModule.onHunliLevelChange();
                // G.DataMgr.taskRecommendData.updateHnliConditionChange();
            }
            else if (response.m_usType == Macros.HUNLI_HUNHUAN_LEVEL_UP) {
                hunliData.hunhuanJinShengInfo = response.m_stValue.m_stHunHuanLevelUpRsp;
                //魂环晋升的id 和等级
                hunliData.hunhuanJinShengId = response.m_stValue.m_stHunHuanLevelUpRsp.m_iHunHuanID;
                let cfg = hunliData.getHunHuanConfigById(hunliData.hunhuanJinShengId);
                hunliData.hunhuanLevelInfoList[cfg.m_iRequireHunLiLevel - 1].m_ucLevel = response.m_stValue.m_stHunHuanLevelUpRsp.m_ucLevel;
                let view = G.Uimgr.getForm<HunLiView>(HunLiView);
                if (view != null) {
                    view.updateHunHuanPanel(true, cfg.m_iRequireHunLiLevel);
                }
            }

            G.GuideMgr.tipMarkCtrl.onRebirthChange();
        } else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResult));
        }
    }

    private onZazenResponse(response: Protocol.ZazenResponse) {
        if (response.m_ucType == Macros.ZAZEN_EXP_NOTIFY) {
            G.TipMgr.addMainFloatTip(uts.format("在线经验+{0}", response.m_stValue.m_uiNotifyExpValue));
        }
    }
}
