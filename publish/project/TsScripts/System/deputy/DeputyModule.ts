import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { HeroData } from 'System/data/RoleData'
import { MonsterData } from 'System/data/MonsterData'
import { SkillData } from 'System/data/SkillData'
import { HeroController } from 'System/unit/hero/HeroController'
import { AutoBuyInfo } from 'System/data/business/AutoBuyInfo'
import { EnumThingID, EnumGuide, EnumMonsterRule } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { MainUIEffectView } from 'System/main/MainUIEffectView'
import { SystemSettingView } from 'System/setting/SystemSettingView'
import { ThingItemData } from "System/data/thing/ThingItemData"
import { ThingData } from 'System/data/thing/ThingData'
import { BagView, EnumBagTab } from "System/bag/view/BagView"
import { DecomposeView } from "System/bag/view/DecomposeView"
import { DeputySetting } from 'System/skill/DeputySetting'
import { FloatShowType } from 'System/floatTip/FloatTip'
import { VipView } from 'System/vip/VipView'
/**
 * 自动挂机系统。原自动战斗功能的升级版。
 * @author xiaojialin
 *
 */
export class DeputyModule extends EventDispatcher {
    /**不再提示\*/
    private static isNotTip: boolean = false;
    /**分解界面是否打开*/
    private isOpenFenJiePanel = false;
    private checkTimer: Game.Timer = null;


    /**是否暂停，不会影响自动战斗按钮状态。切场景的时候会自动暂停，进新场景的时候自动恢复。*/
    private m_isPaused: boolean;

    private m_monsterID = 0;
    private m_monsterRule: EnumMonsterRule;

    private m_hangupTimer: Game.Timer;

    /**上一次检查血包、分解的时间*/
    private lastCheckAutoAt = 0;

    private _hero: HeroController = null;
    private get Hero() {
        if (this._hero == null) {
            this._hero = G.UnitMgr.hero;
        }
        return this._hero;
    }

    constructor() {
        super();
        this.addNetListener(Macros.MsgID_AutoBattleSetting_Notify, this._onAutoBattleSettingNotify);
        this.addNetListener(Macros.MsgID_GetSceneMonster_Response, this._onGetSceneMonsterResponse);
        this.addNetListener(Macros.MsgID_GuajiNormal_Notify, this.onGuajiNormalNotify);
    }

    /**
     * 收到挂机设置消息事件的响应函数，仅响应一次。
     * @param msg 收到挂机设置消息事件。
     *
     */
    private _onAutoBattleSettingNotify(body: Protocol.AutoBattleSetting_Notify): void {
        let setting: Protocol.AutoBattleSetting = body.m_stAutoBattleSetting;
        let ds = G.DataMgr.deputySetting;
        ds.isDefault = 0 == setting.m_ucDefaultFlag;
        if (ds.isDefault) {
            // 没有设置过，使用默认设置
            ds.setDefault();
        }
        else {
            let funcFlag: number = setting.m_uiBattleFunctionList;
            ds.isTeamEnabled = 0 != (funcFlag & Macros.GJ_AUTO_ADD_TEAM);
            ds.isAutoFightBack = 0 != (funcFlag & Macros.GJ_AUTO_PICKUP_SETTING);
            ds.isAutoUseNuqi = 0 != (funcFlag & Macros.GJ_AUTO_NUQI_SKILL);
            ds.isAutoUseWy = 0 != (funcFlag & Macros.GJ_AUTO_BEAUTY_SKILL);
            ds.isRoleReviveEnabled = 0 != (funcFlag & Macros.GJ_AUTO_ROLE_RELIVE);
            ds.isAutoBuyMedicine = 0 != (funcFlag & Macros.GJ_AUTO_BUY_HP);
            ds.autoSkillIDList = setting.m_stAutoBattleSkill.m_ucValue;
            ds.isFixedPoint = 0 != (funcFlag & Macros.GJ_AUTO_HUANG_UP);
            ds.m_stAutoAnalyze = setting.m_stAutoAnalyze;
        }
        //ds.initFollowBoss(setting.m_stBossAttention);
        let systemSettingView = G.Uimgr.getForm<SystemSettingView>(SystemSettingView);
        if (systemSettingView != null && systemSettingView.isOpened) {
            systemSettingView.updateGuaJiInfo();
        }
    }

    /**
     * 拉取到指定场景都有哪些怪物的回复。
     * @param msg
     * @return
     *
     */
    private _onGetSceneMonsterResponse(body: Protocol.CSGetSceneMonsterResponse): void {
        if (G.DataMgr.sceneData.curSceneID == body.m_iSceneID) {
            let list: number[] = G.DataMgr.sceneData.monsters;
            list.length = 0;
            let config: GameConfig.MonsterConfigM;
            for (let id of body.m_aiID) {
                config = MonsterData.getMonsterConfig(id);
                // 剔除掉无效的怪物
                if (KeyWord.MONSTER_TYPE_PICK != config.m_bDignity && 0 != config.m_ucIsBeSelected) {
                    list.push(id);
                }
            }
        }
    }

    /**
     * 离线挂机通知
     * @param body
     */
    private onGuajiNormalNotify(body: Protocol.GuajiNormal_Notify) {
        let info = body.m_stCSOffGuajiInfo;
      //  uts.log("  离线挂机通知  0 表示上次下线没有挂机 " + info.m_iUseTime)
        if (G.DataMgr.systemData.offGuajiInfo != null) {
            let time = Math.floor((info.m_iEnableTime - G.DataMgr.systemData.offGuajiInfo.m_iEnableTime) / 3600);
            if (time > 0) {
                G.TipMgr.addMainFloatTip(uts.format('您获得了{0}小时离线挂机使用时间', time), FloatShowType.GetReward);
            }         
        }
        G.DataMgr.systemData.offGuajiInfo = info;
        let form = G.Uimgr.getForm<SystemSettingView>(SystemSettingView);
        if (null != form) {
            form.updateGuaJiInfo();
        }
        // G.NoticeCtrl.onLiXianGuaJiNotify();
    }

    /**
     * 开始或结束挂机事件的响应函数。
     * @param isStart 是开始还是结束。<CODE>true</CODE>表示开始，<CODE>false</CODE>表示。
     * @param monsterID 挂机的目标ID。
     * @param isBattleOrCollect 是战斗还是采集，默认为战斗。
     * @param cleanQuestInfo 是否清除任务信息。
     *
     */
    startEndHangUp(isStart: boolean, monsterID: number = 0, monsterRule: EnumMonsterRule = 0, setFixedPointRightNow = false): void {
        if (isStart) {
            this.startHangUp(monsterID, monsterRule, setFixedPointRightNow);
        }
        else {
            this.endHangUp();
        }
    }

    /**
     * 切换自动打怪状态。
     *
     */
    onClickHangUpBtn(): void {
        if (G.DataMgr.runtime.isHangingUp && G.DataMgr.runtime.hangUpIsBattleOrCollect) {
            this.endHangUp();
        }
        else {
            // 保存设置并开始，需要保存设置，否则新手玩家在第一次挂机的时候，如果
            // 不是通过挂机面板而是直接按快捷键开启的话会不拣东西，因为后台在玩家
            // 保存设置之前的挂机数据是空的
            this.startHangUp(0, EnumMonsterRule.none, true);
        }
    }

    /**
     * 暂停/恢复自动打怪挂机事件的响应函数。
     *
     */
    pauseResumeHangUp(isPause: boolean): boolean {
        let oldIsPaused: boolean = this.m_isPaused;
        if (isPause) {
            // 请求暂停
            if (G.DataMgr.runtime.isHangingUp) {
                this.m_isPaused = true;
            }
            else {
                this.m_isPaused = false;
            }
            this.endHangUp();
            return this.m_isPaused;
        }
        else {
            // 请求恢复
            this.m_isPaused = false;
            if (oldIsPaused) {
                this.startHangUp(this.m_monsterID, this.m_monsterRule, false);
            }
            return oldIsPaused;
        }
    }

    /**
     * 开始挂机。
     * @param monsterID 目标怪物ID，默认为0，表示攻击任意怪物，-1表示保持原有目标怪物ID。
     * @param isBattleOrCollect 是战斗还是采集，默认为战斗。
     *
     */
    private startHangUp(monsterID: number, monsterRule: EnumMonsterRule, setFixedPointRightNow: boolean): void {
        this.m_isPaused = false;
        let runtime = G.DataMgr.runtime;

        let oldIsHangIngUp: boolean = runtime.isHangingUp;

        runtime.isHangingUp = true;
        this.m_monsterID = monsterID;
        this.m_monsterRule = monsterRule;
        runtime.hangUpIsBattleOrCollect = monsterID <= 0 || KeyWord.MONSTER_TYPE_PICK != MonsterData.getMonsterConfig(monsterID).m_bDignity;

        G.BattleHelper.startBattle(monsterID, monsterRule, setFixedPointRightNow);

        if (oldIsHangIngUp) {
            return;
        }

        if (null == this.m_hangupTimer) {
            this.m_hangupTimer = new Game.Timer("m_hangupTimer", 600, 0, delegate(this, this._onHangUpTimer));
        }

        G.ViewCacher.mainView.onHangupStatusChange(true);
        G.ViewCacher.mainUIEffectView.playHangupEffect();
    }

    /**
     * 挂机定时器的响应函数。
     * @param timerInfo 定时器信息。
     *
     */
    private _onHangUpTimer(timer: Game.Timer): void {
        // 切场景时会暂停
        if (this.m_isPaused) {
            return;
        }

        if (!this.Hero.Data.isAlive) {
            return;
        }

        G.BattleHelper.run();
        //if (G.DataMgr.runtime.__logBattle) {
            //uts.log(G.BattleHelper.__log);
        //}

        let now = UnityEngine.Time.realtimeSinceStartup;
        if (now - this.lastCheckAutoAt > 5) {
            this.lastCheckAutoAt = now;

            let deputySetting = G.DataMgr.deputySetting;
            let isBagFull = G.DataMgr.thingData.isBagFull;
            // 检查是否需要自动补充生命包
            if (deputySetting.isAutoBuyMedicine && G.ActionHandler.checkCrossSvrUsable(false) && !isBagFull) {
                let heroData = G.DataMgr.heroData;
                if (heroData.getProperty(Macros.EUAI_CURHP) < heroData.getProperty(Macros.EUAI_MAXHP) && heroData.getProperty(Macros.EUAI_HPSTORE) <= 0) {
                    // 血量没满，生命包也没了
                    let itemList = G.DataMgr.thingData.getBagItemById(EnumThingID.ShengMingBuChongBao, false, 1);
                    if (null != itemList && itemList.length > 0) {
                        let itemData = itemList[0];
                        G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data);
                    }
                    else {
                        // 优先使用绑钻购买
                        let bindInfo: AutoBuyInfo = G.ActionHandler.checkAutoBuyInfo(EnumThingID.ShengMingBuChongBao, 1, false, 1);
                        if (bindInfo.isAffordable) {
                            G.ModuleMgr.businessModule.directBuy(EnumThingID.ShengMingBuChongBao, 1, 0, KeyWord.MONEY_YUANBAO_BIND_ID, 0, false, 1);
                        }
                        else {
                            // 绑钻不够，检查非绑钻石
                            let nonBindInfo: AutoBuyInfo = G.ActionHandler.checkAutoBuyInfo(EnumThingID.ShengMingBuChongBao, 1, false, 2);
                            if (nonBindInfo.isAffordable) {
                                G.ModuleMgr.businessModule.directBuy(EnumThingID.ShengMingBuChongBao, 1, 0, KeyWord.MONEY_YUANBAO_ID, 0, false, 1);
                            }
                        }
                    }
                }
            }

            // 如果没有自动熔炼，则检查背包是否满了给出提示
            if (isBagFull && !DeputyModule.isNotTip && !G.Uimgr.createForm<DecomposeView>(DecomposeView).isOpened && !G.Uimgr.createForm<VipView>(VipView).isOpened) {
                let tdMgr: ThingData = G.DataMgr.thingData;
                let canRongLian = false;
                let bagCtn = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
                for (let key in bagCtn) {
                    if (bagCtn[key].config.m_uiMeltInfo > 0) {
                        G.TipMgr.showConfirm(G.DataMgr.langData.getLang(96), ConfirmCheck.withCheck, '前往分解|增加格子', delegate(this, this.onRongLianConfirm), 0, 0, true);
                        break;
                    }
                }
            }
        }
    }

    checkAutoRongLian(list: Protocol.ContainerThingInfo[]) {
        // 检查自动熔炼
        let ronglianCnt = 0;
        let deputySetting = G.DataMgr.deputySetting;
        if (G.DataMgr.vipData.canUseAutoAnalyze() && deputySetting.isAutoAnalyze) {
            let ronglianList: Protocol.ContainerThing[] = [];
            for (let thingInfo of list) {
                if (GameIDUtil.isPetEquipID(thingInfo.m_iThingID)) {
                    let thingConfig = ThingData.getThingConfig(thingInfo.m_iThingID);
                    if (thingConfig.m_uiMeltInfo > 0 && (thingConfig.m_iFunctionID == 0) && ((thingConfig.m_ucColor < deputySetting.m_stAutoAnalyze.m_ucQuality) || (thingConfig.m_ucColor == deputySetting.m_stAutoAnalyze.m_ucQuality &&
                        thingConfig.m_ucStage <= deputySetting.m_stAutoAnalyze.m_ucStage))) {
                        ronglianList.push(thingInfo);
                        ronglianCnt++;
                    }
                }
            }
            if (ronglianCnt > 0) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRonglianEquipRequest(ronglianList));
            }
        }
    }

    private onRongLianConfirm(state: MessageBoxConst = 0, isCheckSelected: boolean = true): void {
        if (MessageBoxConst.yes == state) {
            DeputyModule.isNotTip = isCheckSelected;
            G.Uimgr.createForm<BagView>(BagView).open(EnumBagTab.bag);
            G.Uimgr.createForm<DecomposeView>(DecomposeView).open();
        } else if (MessageBoxConst.no == state){
            DeputyModule.isNotTip = isCheckSelected;
            G.Uimgr.createForm<VipView>(VipView).open();
        } else {
            DeputyModule.isNotTip = isCheckSelected;
        }
    }

    /**
     * 结束挂机。
     *
     */
    private endHangUp(): void {
        if (this.m_hangupTimer) {
            this.m_hangupTimer.Stop();
            this.m_hangupTimer = null;
        }
        G.BattleHelper.endBattle();

        G.DataMgr.runtime.isHangingUp = false;

        G.ViewCacher.mainView.onHangupStatusChange(false);
        G.ViewCacher.mainUIEffectView.stopHangupEffect();
    }

    save(): void {
        let setting = G.DataMgr.deputySetting;
        // 保存前检查是否有权限，否则后台拒收
        if (setting.isAutoAnalyze && !G.DataMgr.vipData.canUseAutoAnalyze()) {
            setting.isAutoAnalyze = false;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSaveDeputySettingRequst(setting.isDefault, setting.isTeamEnabled, setting.isRoleReviveEnabled,
            setting.isAutoUseNuqi, setting.isAutoUseWy, setting.isAutoFightBack, setting.isAutoBuyMedicine, setting.isFixedPoint, setting.autoSkillIDList,
            setting.m_stAutoAnalyze));
    }
}
