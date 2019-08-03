import { ActHomeView } from "System/activity/actHome/ActHomeView";
import { GuildPvpCrossResultView } from "System/activity/actHome/GuildPvpCrossResultView";
import { GuildPvpResultView } from "System/activity/actHome/GuildPvpResultView";
import { ZhenLongQiJuCampView } from "System/activity/actHome/ZhenLongQiJuCampView";
import { ActTipView } from "System/activity/view/ActTipView";
import { DaTiView } from "System/activity/view/DaTiView";
import { TianChiView } from "System/activity/view/TianChiView";
import { ReportType } from "System/channel/ChannelDef";
import { Constants } from "System/constants/Constants";
import { EnumKuafuPvpStatus, FindPosStrategy, PathingState } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { PinstanceData } from "System/data/PinstanceData";
import { ChangeScene } from "System/data/Runtime";
import { SceneData } from "System/data/scenedata";
import { SkillData } from "System/data/SkillData";
import { RewardIconItemData } from "System/data/vo/RewardIconItemData";
import { EventDispatcher } from "System/EventDispatcher";
import { Events } from "System/Events";
import { Global as G } from "System/global";
import { EnumMainViewChild, MainView } from "System/main/view/MainView";
import { ReliveView } from "System/main/view/ReliveView";
import { MapId } from "System/map/MapId";
import { PetExpeditionBattleView } from "System/pet/expedition/PetExpeditionBattleView";
import { BwdhBattleView } from "System/kfjdc/view/BwdhBattleView";
import { PetView } from "System/pet/PetView";
import { BossView } from "System/pinstance/boss/BossView";
import { PinstanceHallView } from "System/pinstance/hall/PinstanceHallView";
import { PinstanceArgs } from "System/pinstance/PinstanceArgs";
import { PinstanceOperateView } from "System/pinstance/PinstanceOperateView";
import { PinstanceStatView } from "System/pinstance/PinstanceStatView";
import { PetExpeditionResultView } from "System/pinstance/result/PetExpeditionResultView";
import { SceneResultView } from "System/pinstance/result/SceneResultView";
import { ZhenLongQiJuResultView } from "System/pinstance/result/ZhenLongQiJuResultView";
import { BwdhPreResultView } from 'System/pinstance/result/BwdhPreResultView'
import { SaoDangResultView } from "System/pinstance/SaoDangResultView";
import { TianMingBangRewardView } from "System/pinstance/selfChallenge/TianMingBangRewardView";
import { TianMingBangRankView } from "System/pinstance/selfChallenge/TianMingBangRankView";
import { ErrorId } from "System/protocol/ErrorId";
import { Macros } from "System/protocol/Macros";
import { BwdhWatchResultView } from "System/pinstance/result/BwdhWatchResultView";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ConfirmCheck } from "System/tip/TipManager";
import { MessageBoxConst } from "System/tip/TipManager";
import { HeroController } from "System/unit/hero/HeroController";
import { PinstanceIDUtil } from "System/utils/PinstanceIDUtil";
import { ChallengeAgainConfrimView } from "System/pinstance/ChallengeAgainConfrimView";
import { MonsterData } from 'System/data/MonsterData'

/**
 * 副本模块
 * @author fygame
 *
 */
export class PinstanceModule extends EventDispatcher {
    static MAX_SCENE_CONFIG_NUMBER: number = 200;
    static MAX_SCENE_NUMBER_PER_PINSTANCE: number = 5;

    /**倒计时特效ID。*/
    private m_timerEffID: number = 0;

    /**当前副本是否完成标签*/
    private m_isComplete: boolean = false;

    /**当前的副本配置*/
    private m_currentPinstance: GameConfig.PinstanceConfigM;

    private m_curPinstanceID: number = 0;

    /**扫荡副本的NCPID*/
    private m_SweepNPCID: number = 0;

    /**扫荡副本的副本ID*/
    private m_sweepPinsID: number = 0;

    /**提示吃的经验丹的buff效果。*/
    private m_jydBuff: GameConfig.BuffConfigM;

    private m_leaveConfirmID: number = 0;

    /**黑洞塔boss引导定时器*/
    private monsterGuideTimer: Game.Timer;
    /**黑洞塔boss寻路次数*/
    private monsterGuideTriedTimes: number = 0;

    private _hero: HeroController = null;


    private get Hero() {
        if (this._hero == null) {
            this._hero = G.UnitMgr.hero;
        }
        return this._hero;
    }

    constructor() {
        super();

        this.addNetListener(Macros.MsgID_ListActivityLimit_Response, this.onListActivityLimitResponse);
        this.addNetListener(Macros.MsgID_ShowCountDownEffect_Notify, this._onShowTimerEffectNotify); //倒计时效果通知
        this.addNetListener(Macros.MsgID_PinstanceComplete_Notify, this._onPinstanceComplete);
        this.addNetListener(Macros.MsgID_PinstanceFinish_Notify, this._onShowResultDialog); // 副本结算
        this.addNetListener(Macros.MsgID_OneKeyGet_Response, this._onVipOneKeyGetResponse); // 副本一键完成
        this.addNetListener(Macros.MsgID_PinstanceHome_Response, this._onPinstanceHomeResponse);
        this.addNetListener(Macros.MsgID_PinstanceRank_Response, this.onPinstanceRankResponse);
        this.addNetListener(Macros.MsgID_SceneInfo_Notify, this._onSceneRightInfo_Notify);

        this.addNetListener(Macros.MsgID_PVPRank_CS_Response, this.onPVPRankCsResponse);  // 个人竞技
        this.addNetListener(Macros.MsgID_XZFM_Response, this.onXZFMResponse);

        this.addEvent(Events.ChangeScene, this._onChangeScene); //切换场景的通知处理，这里不用传送通知，因为登录的时候是没有传送通知的
    }

    /**
     * 副本完成标签
     * @param msg
     *
     */
    private _onPinstanceComplete(msg: Protocol.PinstanceComplete_Notify): void {
        this.m_isComplete = true;
    }

    /**
     *收到播放倒计时特效的通知
     * @param msg
     *
     */
    private _onShowTimerEffectNotify(notify: Protocol.ShowCountDown_Notify): void {
        this.m_timerEffID = G.ViewCacher.mainUIEffectView.playCountDown(notify.m_iCountDown);
    }

    /**
     * 发起传送门请求后相应
     * @param e
     *
     */
    private _onChangeScene(): void {
        let pinstanceData = G.DataMgr.pinstanceData;
        let runtime = G.DataMgr.runtime;
        pinstanceData.hurtInfo = null;
        pinstanceData.rightInfo = null;
        G.DataMgr.kfjdcData.finalPlayerData = null;
        G.DataMgr.kfjdcData.jjtzKfjdcTime = null;
        pinstanceData.needAutoOpenRank = false;
        //关掉副本相关的所有面板
        //this._onOpenCloseOneKeyCompleteDialog(DialogCmd.close);

        // 停止boss寻路倒计时
        if (null != this.monsterGuideTimer) {
            this.monsterGuideTimer.Stop();
            this.monsterGuideTimer = null;
        }

        //如果倒计时特效开着也要关掉
        if (this.m_timerEffID > 0) {
            G.ViewCacher.mainUIEffectView.stopCountDown(this.m_timerEffID);
            this.m_timerEffID = 0;
        }

        // 分析切场景的类型
        let oldPinstanceID: number = this.m_curPinstanceID;
        this.m_curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
        if (oldPinstanceID <= 0 && this.m_curPinstanceID > 0) {
            runtime.changeScene.type = ChangeScene.ENTER_PINSTANCE;
            runtime.changeScene.pinstanceId = this.m_curPinstanceID;

        }
        else if (oldPinstanceID > 0 && this.m_curPinstanceID <= 0) {
            runtime.changeScene.type = ChangeScene.LEAVE_PINSTANCE;
            runtime.changeScene.pinstanceId = oldPinstanceID;
        }
        else {
            runtime.changeScene.type = ChangeScene.NONE;
            runtime.changeScene.pinstanceId = 0;
        }

        // 如果是离开副本则停止自动战斗
        if (ChangeScene.LEAVE_PINSTANCE == runtime.changeScene.type) {
            G.ModuleMgr.deputyModule.startEndHangUp(false);
        }

        //如果传送进副本
        if (this.m_curPinstanceID > 0) {
            pinstanceData.recordPinstanceEnter(this.m_curPinstanceID);
            this.m_currentPinstance = PinstanceData.getConfigByID(this.m_curPinstanceID);

            // 初始化副本完成标签
            this.m_isComplete = false;

            // 关闭副本大厅面板
            G.Uimgr.closeForm(PinstanceHallView);
            G.Uimgr.closeForm(PetView);
            G.Uimgr.closeForm(ChallengeAgainConfrimView);

            // 跨服副本冻结所有功能
            if (1 == this.m_currentPinstance.m_ucIsKF) {
                runtime.isAllFuncLocked = true;
            }

            if (Macros.PINSTANCE_ID_BATHE == this.m_curPinstanceID) {
                G.ViewCacher.mainView.createChildForm<TianChiView>(TianChiView, EnumMainViewChild.tianChi).open();
            } else if (this.m_curPinstanceID == Macros.PINSTANCE_ID_WYYZ) {
                G.ViewCacher.mainView.createChildForm<PetExpeditionBattleView>(PetExpeditionBattleView, EnumMainViewChild.petExpeditionBattle).open();
                G.ViewCacher.mainView.setTaskTeamActive(false);
            } else if (this.m_curPinstanceID == Macros.PINSTANCE_ID_SINGLEPVP_FINALID) {
                // 比武大会决赛
                G.ViewCacher.mainView.createChildForm<BwdhBattleView>(BwdhBattleView, EnumMainViewChild.bwdhBattle).open();
                G.ViewCacher.mainView.setTaskTeamActive(false);
            }

            if (Macros.PINSTANCE_ID_QUESTION == this.m_curPinstanceID || Macros.PINSTANCE_ID_WYYZ == this.m_curPinstanceID) {
                // 答题和伙伴远征里不显示左上角人物头像区域
                G.ViewCacher.mainView.setRoleRectActive(false);
            }

            G.ChannelSDK.report(ReportType.EnterPinstance);
        }
        //传送离开副本
        else if (oldPinstanceID > 0) {
            let oldPinstanceConfig: GameConfig.PinstanceConfigM = this.m_currentPinstance;
            this.m_currentPinstance = null;
            // 离开经验副本后清空双倍经验信息，这样下次进副本就不要先刷一下老数据了
            pinstanceData.dblExpInfo = null;

            G.ViewCacher.mainUIEffectView.showOrHideDiGongTip(false);
            G.ViewCacher.mainUIEffectView.showOrHideDiGongWyTip(false);

            //// 关闭吃经验丹提示
            //if (oldPinstanceConfig.m_ucUseJyd) {
            //    G.GuideMgr.showCloseUseItemDialog(false);
            //}

            //// 关闭自动战斗提示
            //G.GuideMgr.showCloseGuajiTipDialog(false);

            // 关闭离开副本确认框
            G.TipMgr.closeConfirm(this.m_leaveConfirmID);
            // 离开副本解冻所有功能
            runtime.isAllFuncLocked = false;
            runtime.curBossHomeLayer = 0;
            G.ViewCacher.mainView.setRoleRectActive(true);
            G.ViewCacher.mainView.closeChildForm(EnumMainViewChild.siXiangBattle);
            G.ViewCacher.mainView.closeChildForm(EnumMainViewChild.petExpeditionBattle);
            G.ViewCacher.mainView.closeChildForm(EnumMainViewChild.bwdhBattle);
            G.ViewCacher.mainView.closeChildForm(EnumMainViewChild.tianChi);
            G.Uimgr.closeForm(DaTiView);
            G.Uimgr.closeForm(ChallengeAgainConfrimView);
            //名将挑战出副本不关闭结算面板
            if (oldPinstanceID != Macros.PINSTANCE_ID_MJTZ) G.Uimgr.closeForm(SceneResultView);
            G.ViewCacher.mainUIEffectView.stopPinstanceTime(true);
            G.ChannelSDK.report(ReportType.LeavePinstance);

            if (Macros.PINSTANCE_ID_HISTORICAL_REMAINS == oldPinstanceID) {
                // 离开宝石副本后重新拉取数据
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_PANEL));
            }

            if (oldPinstanceID == Macros.PINSTANCE_ID_MJTZ) {
                //刷新名将的剩余挑战时间
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMingJiangPanelRequest());
                G.DataMgr.pinstanceData.notSendQuitMsg = true;
            }
        }
        // 清除排队状态
        if (PinstanceIDUtil.isKfjdc(oldPinstanceID)) {
            G.DataMgr.kfjdcData.myStatus = EnumKuafuPvpStatus.none;
        } else if (PinstanceIDUtil.isKf3v3(oldPinstanceID)) {
            G.DataMgr.kf3v3Data.myStatus = EnumKuafuPvpStatus.none;
        }
        // 检查是否打开统计面板
        let curSceneID = G.DataMgr.sceneData.curSceneID;
   
        // 副本（除个人竞技）、boss、福神争霸（个人竞技也不要右上角）
        let needPinstanceOperate = (this.m_curPinstanceID > 0 && Macros.PINSTANCE_ID_BATHE != this.m_curPinstanceID
            && Macros.PINSTANCE_ID_QUESTION != this.m_curPinstanceID
            || MapId.isGRJJMapId(this.m_curPinstanceID)) || Macros.PINSTANCE_ID_WORLDBOSS == this.m_curPinstanceID;
          
        if (needPinstanceOperate) {
            // 需要显示右上角的副本操作面板
            let pinstanceOperateView = G.Uimgr.getChildForm<PinstanceOperateView>(MainView, EnumMainViewChild.pinstanceOperate);
            if (null != pinstanceOperateView) {
                pinstanceOperateView.reset();
            } else {
                G.ViewCacher.mainView.createChildForm<PinstanceOperateView>(PinstanceOperateView, EnumMainViewChild.pinstanceOperate, true).open();
            }
            G.ActBtnCtrl.setEnabled(false);
            G.DataMgr.heroData.inFuBen = true;
            //副本不要龙珠
            runtime.isAllFuncLocked = true;
        }
        else {
            if (MapId.isLuori()) {
                //落日森林里需要右上角的退出按钮
                let pinstanceOperateView = G.Uimgr.getChildForm<PinstanceOperateView>(MainView, EnumMainViewChild.pinstanceOperate);
                if (null != pinstanceOperateView) {
                    pinstanceOperateView.reset();
                }else {
                    G.ViewCacher.mainView.createChildForm<PinstanceOperateView>(PinstanceOperateView, EnumMainViewChild.pinstanceOperate, true).open();
                }
            }else{
                G.ViewCacher.mainView.closeChildForm(EnumMainViewChild.pinstanceOperate);
            }
            G.ActBtnCtrl.setEnabled(true);
            G.DataMgr.heroData.inFuBen = false;
        }
        //vip经验技能图标是否显示
        G.ViewCacher.mainView.changeExperSkillIconDataChange();
        G.ViewCacher.mainView.isVipExperSkillForbiden();

        // 地宫副本内不显示统计
        let needPinstanceStat = needPinstanceOperate || MapId.isFXZDMapId(curSceneID);
        if (needPinstanceStat) {
            // 显示副本统计
            let pinstanceStatView = G.Uimgr.getChildForm<PinstanceStatView>(MainView, EnumMainViewChild.pinstanceStat);
            if (null != pinstanceStatView) {
                if (MapId.isGRJJMapId(this.m_curPinstanceID)) {
                    pinstanceStatView.close();
                } else {
                    pinstanceStatView.reset();
                }
            }
        }
        else {
            G.ViewCacher.mainView.closeChildForm(EnumMainViewChild.pinstanceStat);
        }
        //竞技大厅不显示左侧面板
        if (MapId.isGRJJMapId(this.m_curPinstanceID)) {
            G.ViewCacher.mainView.setTaskTeamActive(false);
            G.ViewCacher.mainView.setmainFuncsActive(false);
            G.ViewCacher.mainView.setskillRectActive(false);
            G.ViewCacher.mainView.setequipCollectActive(false);
            G.ViewCacher.mainView.setbtnVipActive(false);
        }
        if (MapId.isFXZDMapId(curSceneID)) {
            G.ViewCacher.mainView.setmainFuncsActive(true);
            G.ViewCacher.mainView.setskillRectActive(true);
            G.ViewCacher.mainView.setbtnVipActive(true);
        }
        if (!needPinstanceStat && G.DataMgr.settingData.sceneHideFlag != 2) {
            G.ViewCacher.mainView.setTaskTeamActive(true);
            G.ViewCacher.mainView.setmainFuncsActive(true);
            G.ViewCacher.mainView.setskillRectActive(true);
            G.ViewCacher.mainView.setequipCollectActive(true);
            G.ViewCacher.mainView.setbtnVipActive(true);
        }

        // 如果副本表里有配技能，用副本技能代替当前技能
        let skills: GameConfig.SkillConfigM[] = [];
        if (this.m_currentPinstance != null) {
            if (Macros.PINSTANCE_ID_WYYZ == this.m_currentPinstance.m_iPinstanceID) {
                let skillIds = G.DataMgr.petExpeditionData.getFightPetSkills();
                for (let skillId of skillIds) {
                    skills.push(SkillData.getSkillConfig(skillId));
                }
            } else if (this.m_currentPinstance.m_ucIsReplaceSkill) {
                let pskills = this.m_currentPinstance.m_stSkillList;
                let pSkillCnt = pskills.length;
                for (let i = 0; i < pSkillCnt; i++) {
                    let skillId = pskills[i].m_uiValue;
                    if (skillId > 0) {
                        skills.push(SkillData.getSkillConfig(skillId));
                    }
                }
            }
        }

        if (skills.length > 0) {
            G.ViewCacher.mainView.showPinstanceSkillPanel(skills);
        } else {
            G.ViewCacher.mainView.showNormalSkillPanel();
        }

        //G.GuideMgr.checkTrailAndFmtBossCtrl();
        G.ViewCacher.mainView.newFuncPreCtrl.updateView();
        G.NoticeCtrl.setActive(!runtime.isAllFuncLocked);
        let info = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_PRIVATE_BOSS);
        if (info) {
            if (info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount <= 0&&this.m_curPinstanceID ==
                 Macros.PINSTANCE_ID_MULTIPLAYER_BOSS) {
                G.DataMgr.pinstanceData.ismultipBossNum = true;
            }else{
                G.DataMgr.pinstanceData.ismultipBossNum = false;
            }
        }
        if (this.m_curPinstanceID == Macros.PINSTANCE_ID_MULTIPLAYER_BOSS) {
            G.ViewCacher.mainView.setVipObjEnble(true);
            G.ViewCacher.mainView.updateNum();
        }else{
            G.ViewCacher.mainView.setVipObjEnble(false);
        }

    }

    onEnterSceneComplete(): void {
        if (null != this.m_currentPinstance) {
            // 处理副本相关
            if (KeyWord.GENERAL_YES == this.m_currentPinstance.m_ucIsAutoAttack) {
                // 自动开自动战斗的副本直接开打
                G.ModuleMgr.deputyModule.startEndHangUp(true, 0);
            }

            if (ChangeScene.ENTER_PINSTANCE == G.DataMgr.runtime.changeScene.type) {
                if (KeyWord.GENERAL_YES != this.m_currentPinstance.m_ucIsAutoAttack) {
                    // 先停止自动战斗
                    G.ModuleMgr.deputyModule.startEndHangUp(false);
                }

                //if (0 == this.m_currentPinstance.m_ucIsAutoAttack) {
                //    // 如果是不自动战斗也不提示，则关闭战斗和提示
                //    G.GuideMgr.showCloseGuajiTipDialog(false);
                //}

                //if (KeyWord.PINSTANCE_AUTO_ATTACK_ONLY_TIP == this.m_currentPinstance.m_ucIsAutoAttack) {
                //    // 不需要副本介绍，也不需要经验丹提示，直接弹出自动战斗提示
                //    G.GuideMgr.showCloseGuajiTipDialog(true);
                //}
            }
        }
        if (G.DataMgr.fmtData.isFmtScene(G.DataMgr.sceneData.curSceneID)) {
            // 检查黑洞塔boss寻路
            this.checkFmtBossGuide();
        } else {
            // 检查怪物寻路
            this.checkPinstanceMonsterGuide();
        }
    }

    tryEnterPinstance(pinstanceID: number, diff: number = 0, npcID: number = 0, needConfirm: boolean = true, needGuide: boolean = false, cost: number = 0): void {
        // 停止走路等
        G.ActionHandler.beAGoodBaby(false, true, false, true, false);

        if (!G.ActionHandler.canEnterPinstance(pinstanceID, diff, true, true)) {
            // 无法进入
            return;
        }

        let pinstanceConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(pinstanceID);
        let pa: PinstanceArgs = new PinstanceArgs();
        pa.pID = pinstanceID;
        pa.npcID = npcID;
        pa.diff = diff;
        pa.cost = cost;
        this._confirmHandler(MessageBoxConst.yes, pa, true);
    }

    /**
     * 点击某些需要确认的菜单项的回调函数
     * @param args
     * @param state
     * perry:2012-4-10
     */
    private _confirmHandler(state: number = 0, args: PinstanceArgs = null, isCheckSelected: boolean = true): void {
        if (MessageBoxConst.yes == state) //点击了确定按钮,发送请求
        {
            this._checkAndEnterArgsPinstance(args as PinstanceArgs);
        }
    }

    private _checkAndEnterArgsPinstance(args: PinstanceArgs): void {
        let pConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(args.pID);
        // 动态副本需检查当前场景是否配置了关联副本场景
        let sceneData = G.DataMgr.sceneData;
        if(pConfig.m_cLoadingType == KeyWord.PIN_LOADING_ALL && !sceneData.getSceneInfo(sceneData.curSceneID).config.m_iScenePin) {
            G.TipMgr.addMainFloatTip('您当前不能挑战该副本！');
            return;
        }

        // 检查单人副本
        if (0 == pConfig.m_bIsTeamable && G.DataMgr.teamData.hasTeam) //单人副本
        {
            G.TipMgr.addMainFloatTip('本副本只允许单人进入，请先离队。');
            return;
        }

        // 如果已经在组队副本组队，先退出
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        if (null != myTeam) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossQuitTeamRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
        }

        G.DataMgr.runtime.isWaitTransprotResponse = true;
        G.DataMgr.pinstanceData.crtPinstanceDiff = args.diff + 1;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEnterPinstanceRequest(args.npcID, args.pID, args.retry, args.diff, args.jump, args.cost));
        uts.log(uts.format('进入副本，pinstanceID={0}, diff={1}', args.pID, args.diff));
    }

    onClickQuitPinstance(quitDirectly: boolean): void {

        let sceneData: SceneData = G.DataMgr.sceneData;
        let curSceneId: number = sceneData.curSceneID;

        if (curSceneId == Macros.PINSTANCE_ID_SHNS) {
            G.ViewCacher.mainView.onVipSkillIconDataChange();
        }
        if (G.DataMgr.pinstanceData.notSendQuitMsg) {
            G.DataMgr.pinstanceData.notSendQuitMsg = false;
            return;
        }

        let cfg: GameConfig.SceneConfigM = sceneData.getSceneInfo(curSceneId).config;
        if (cfg && cfg.m_ucBackToCity == 1) {
            // 回到主城，比如离开boss地图
            G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_BACKTOCITY);
            return;
        }

        if (quitDirectly) {
            // 这种情况就只有点击结算面板上的离开副本  MENU_SUMMARYEXIT_INDEX  MENU_QUITPINSTANCE_INDEX 100
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getClickMenuRequest(G.DataMgr.sceneData.curPinstanceID, Macros.MENU_SUMMARYEXIT_INDEX));
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getQuitPinstanceRequest());
            return;
        }
        // 弹出二次确认并请求结算面板
        let pCfg = PinstanceData.getConfigByID(sceneData.curPinstanceID);
        if(pCfg.m_cLoadingType == KeyWord.PIN_LOADING_ALL) {
            this._leveaConfirm(MessageBoxConst.yes, false);
        } else if (G.DataMgr.rmbData.isInRmbZcMap()) {
            G.TipMgr.showConfirm(G.DataMgr.langData.getLang(245), ConfirmCheck.noCheck, '确认|取消', this._leveaConfirm);
        }
        else {
            this.m_leaveConfirmID = G.TipMgr.showConfirm('是否终止当前副本？', ConfirmCheck.noCheck, '确定|取消', this._leveaConfirm);
        }
    }

    private _leveaConfirm(status: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes != status) {
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getClickMenuRequest(G.DataMgr.sceneData.curPinstanceID, Macros.MENU_QUITPINSTANCE_INDEX));
        if (G.DataMgr.systemData.isCrtLoginTypeCrossSvr()) {
            // 跨服副本返回原线
            G.ModuleMgr.loginModule.cancelCross();
        }
    }

    private _onShowResultDialog(notify: Protocol.PinstanceFinish_Notify): void {
        // 停止自动战斗
        G.ActionHandler.beAGoodBaby(false, true, false, true, false);
    }

    /////////////////////////////////////////////////////// 副本一键完成 ///////////////////////////////////////////////////////

    private _onVipOneKeyGetResponse(response: Protocol.VIPOneKeyGet_Response): void {
        if (ErrorId.EQEC_Success != response.m_iResult) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResult));
        }
        else {
            // 更新副本次数
            G.DataMgr.systemData.updateOnePinstanceTime(response.m_iID, response.m_ucTimes);
            this.onPinstanceChange();

            let itemDatas: RewardIconItemData[] = [];
            for (let i = 0; i < response.m_ucItemCnt; i++) {
                let item = new RewardIconItemData();
                let itemInfo = response.m_astItems[i];
                item.id = itemInfo.m_iID;
                item.number = itemInfo.m_iNumber;
                itemDatas.push(item);
            }
            G.Uimgr.createForm<SaoDangResultView>(SaoDangResultView).open('扫荡结果', '扫荡完成，收获如下宝物：', itemDatas);
        }
    }

    /////////////////////////////////////////////////////// 副本大厅 ///////////////////////////////////////////////////////

    /**
     * 副本排行榜信息
     * @param msg
     *
     */
    private onPinstanceRankResponse(response: Protocol.PinstanceRank_Response): void {
        if (response.m_usType == Macros.PINSTANCE_RANK_YMZC) {
            G.DataMgr.pinstanceData.ymzcRankInfo = response.m_stValue.m_stYMZCRsp;
        }
    }

    private _onPinstanceHomeResponse(response: Protocol.PinstanceHomeResponse): void {
        if (ErrorId.EQEC_Success != response.m_iResultID) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
            return;
        }
        G.DataMgr.pinstanceData.updatePinstanceHome(response);
        //G.DataMgr.funcLimitData.updateFuncStates();
        //G.GuideMgr._checkNewFunc();

        this.onPinstanceChange();
        
    }

    /**
	* 统计信息通知 tb版
	* @param msg
	*
	*/
    private _onSceneRightInfo_Notify(notify: Protocol.SceneInfo_Notify): void {
        if (notify.m_ucType == Macros.SCENEINFOTYPE_RIGHT) {
            G.DataMgr.pinstanceData.rightInfo = notify.m_stData.m_stRight;
            let pinstanceStatView = G.Uimgr.getChildForm<PinstanceStatView>(MainView, EnumMainViewChild.pinstanceStat);
            if (pinstanceStatView != null) {
                pinstanceStatView.onRightInfoChanged();
            } else {
                G.ViewCacher.mainView.createChildForm<PinstanceStatView>(PinstanceStatView, EnumMainViewChild.pinstanceStat, true).open(true, false);
                G.ViewCacher.mainView.setTaskTeamActive(false);
            }

            let pinstanceOperateView = G.Uimgr.getChildForm<PinstanceOperateView>(MainView, EnumMainViewChild.pinstanceOperate);
            if (pinstanceOperateView != null) {
                pinstanceOperateView.onRightInfoChanged();
            }

            let right: Protocol.SceneInfoRightList = notify.m_stData.m_stRight;
            let hasCountDown = false;
            for (let i: number = 0; i < right.m_ucNum; i++) {
                if (right.m_astData[i].m_ucType == Macros.SCENERIGHT_COUNTDOWN) {
                    let countDown = right.m_astData[i].m_stValue.m_stCountdown;
                    if (0 != countDown.m_ucIsCenter) {
                        G.ViewCacher.mainUIEffectView.playPinstanceTime(countDown.m_szTitle, countDown.m_uiTime);
                        hasCountDown = true;
                        break;
                    }
                }
            }

            if (!hasCountDown) {
                G.ViewCacher.mainUIEffectView.stopPinstanceTime(true);
            }
            //this.m_oldLavelPinstanceState = btnVisble
            //if (this.m_btnLavelPinstance) {

            //    this.m_btnLavelPinstance.visible = btnVisble;
            //}
            if (G.DataMgr.sceneData.isEnterSceneComplete) {
                // 检查怪物寻路
                this.checkPinstanceMonsterGuide();
            }
        }
        else if (notify.m_ucType == Macros.SCENEINFOTYPE_HURT) {
            if (G.DataMgr.fmtData.isFmtScene(G.DataMgr.sceneData.curSceneID)) {
                // 黑洞塔屏蔽掉伤害排行榜，11层的boss会出伤害排行榜，导致左侧面板错乱
                return;
            }
            if (null == G.DataMgr.pinstanceData.hurtInfo) {
                // 西洋棋不自动弹开个人排行
                G.DataMgr.pinstanceData.needAutoOpenRank = Macros.PINSTANCE_ID_ZLQJ != G.DataMgr.sceneData.curPinstanceID;
                //答题副本不自动弹开排行
                G.DataMgr.pinstanceData.needAutoOpenRank = Macros.PINSTANCE_ID_QUESTION != G.DataMgr.sceneData.curPinstanceID;
                //个人Boss不自动弹开
                G.DataMgr.pinstanceData.needAutoOpenRank = Macros.PINSTANCE_ID_PRIVATE_BOSS != G.DataMgr.sceneData.curPinstanceID;
                G.DataMgr.pinstanceData.needAutoOpenRank = Macros.PINSTANCE_ID_MULTIPLAYER_BOSS != G.DataMgr.sceneData.curPinstanceID;
            }
            G.DataMgr.pinstanceData.hurtInfo = notify.m_stData.m_stHurt;

            let pinstanceStatView = G.Uimgr.getChildForm<PinstanceStatView>(MainView, EnumMainViewChild.pinstanceStat);
            if (pinstanceStatView != null) {
                pinstanceStatView.onHurtInfoChanged();
            } else {
                G.ViewCacher.mainView.createChildForm<PinstanceStatView>(PinstanceStatView, EnumMainViewChild.pinstanceStat, true).open(false, true);
                G.ViewCacher.mainView.setTaskTeamActive(false);
            }
        }
        else if (notify.m_ucType == Macros.SCENEINFOTYPE_RESULT) {
            let curPinstanceID: number = G.DataMgr.sceneData.curPinstanceID;
            if (curPinstanceID == MapId.PINSTANCE_LINGBAO) {
                //this.dispatchEvent(Events.SHOW_CLOSE_DIALOG_PINSTANCE_LING_BAO_GET);
            }
            else {
                let result = notify.m_stData.m_stResult;
                G.ModuleMgr.deputyModule.startEndHangUp(false);
                if (Macros.SCENERESULT_WYYZ == result.m_ucResult) {
                    // 伙伴远征
                    G.Uimgr.createForm<PetExpeditionResultView>(PetExpeditionResultView).open(result.m_stData.m_stWYYZValue);
                }
                else if (result.m_ucResult == Macros.SCENERESULT_PVP_RANK) {
                    G.Uimgr.createForm<GuildPvpResultView>(GuildPvpResultView).open(result.m_stData.m_stPVPRank);
                }
                else if (Macros.SCENERESULT_ZLQJ == result.m_ucResult) {
                    // 西洋棋
                    G.Uimgr.createForm<ZhenLongQiJuResultView>(ZhenLongQiJuResultView).open(result.m_stData.m_stSceneResultZLQJ);
                }
                else if (Macros.SCENERESULT_SINGLEPVP_REWARD == result.m_ucResult) {
                    // 跨服角斗场结算弹开后，如果死亡面板打开着也关掉
                    G.Uimgr.closeForm(ReliveView);
                    G.Uimgr.createForm<BwdhPreResultView>(BwdhPreResultView).open(result.m_stData.m_stSinlePVPReward);
                } else if (Macros.SCENERESULT_GUILD_CROSSPVP == result.m_ucResult) {
                    // uts.log(result.m_ucResult+'  结算面板 ');
                    //跨服PVP
                    G.Uimgr.createForm<GuildPvpCrossResultView>(GuildPvpCrossResultView).open(result.m_stData.m_stGuildCrossPVPResult);
                }
                else {
                    G.Uimgr.createForm<SceneResultView>(SceneResultView).open(result);
                }
            }
        }
        else if (notify.m_ucType == Macros.SCENEINFOTYPE_BOSSGUIDE) {
            G.DataMgr.fmtData.bossGuideInfo = notify.m_stData.m_stBossGuide;
            // if (G.DataMgr.sceneData.isEnterSceneComplete && !G.UnitMgr.hero.IsLanding) {
            //     this.checkFmtBossGuide();
            // }
        }
        else if (notify.m_ucType == Macros.SCENEINFOTYPE_PROCESS) {
            let processInfo = notify.m_stData.m_stProcess;
            G.DataMgr.fmtData.diGongFatigue = processInfo;
            // 如果地宫疲劳值满了弹出提示
            if (processInfo.m_uiCurrent >= processInfo.m_uiMax) {
                G.ViewCacher.mainUIEffectView.showOrHideDiGongTip(true);
            }
            let pinstanceOperateView = G.Uimgr.getChildForm<PinstanceOperateView>(MainView, EnumMainViewChild.pinstanceOperate);
            if (null != pinstanceOperateView) {
                pinstanceOperateView.onDiGongFatigueChanged();
            }
        }
        else if (notify.m_ucType == Macros.SCENEINFOTYPE_ARTWORDS) {
            let artWords = notify.m_stData.m_stArtWords;
            let needShow = false;
            G.DataMgr.runtime.reliveTipType = artWords.m_iArtType;
            if (1 == artWords.m_iArtType) {
                //显示地宫的疲劳值
                let fatigue = G.DataMgr.fmtData.diGongFatigue;
                if (null == fatigue || fatigue.m_uiCurrent < fatigue.m_uiMax) {
                    needShow = true;
                }
                G.ViewCacher.mainUIEffectView.showOrHideDiGongWyTip(needShow);
            } else if (3 == artWords.m_iArtType || 2 == artWords.m_iArtType) {
                //极星通天塔在玩家被降层时根据脚本推送的消息显示美术字
                let reliveView = G.Uimgr.getForm<ReliveView>(ReliveView);
                if (reliveView) {
                    reliveView.updateTips(artWords.m_iArtType);
                }
            }
        }
        else if (notify.m_ucType == Macros.SCENEINFOTYPE_CAMP) {
            let info = notify.m_stData.m_stCampInfo;
            G.Uimgr.createForm<ZhenLongQiJuCampView>(ZhenLongQiJuCampView).open(info.m_iCamp);
        }
        else if (notify.m_ucType == Macros.SCENEINFOTYPE_DOUBLE_EXP) {
            // 经验副本双倍经验
            G.DataMgr.pinstanceData.dblExpInfo = notify.m_stData.m_stDoubleExp;
            let pinstanceOperateView = G.Uimgr.getChildForm<PinstanceOperateView>(MainView, EnumMainViewChild.pinstanceOperate);
            if (null != pinstanceOperateView) {
                pinstanceOperateView.onDoubleExpChanged();
            }
        } else if (notify.m_ucType == Macros.SCENEINFOTYPE_SPECIAL_INFO) {
            let specialInfo = notify.m_stData.m_stSpecialInfo;
            if (specialInfo.m_ucType == Macros.SCENE_SPECIAL_FINAL_PLAYER) {
                G.DataMgr.kfjdcData.finalPlayerData = notify.m_stData.m_stSpecialInfo.m_stValue.m_stKFJDCFinalPlayer;
                let bwdhView = G.Uimgr.getChildForm<BwdhBattleView>(MainView, EnumMainViewChild.bwdhBattle);
                if (null != bwdhView) {
                    bwdhView.onPlayerDataChange();
                }
            }
            else if (specialInfo.m_ucType == Macros.SCENE_SPECIAL_FINAL_TIME) {
                G.DataMgr.kfjdcData.jjtzKfjdcTime = notify.m_stData.m_stSpecialInfo.m_stValue.m_stKFJDCFinalTime;
                let bwdhView = G.Uimgr.getChildForm<BwdhBattleView>(MainView, EnumMainViewChild.bwdhBattle);
                if (null != bwdhView) {
                    bwdhView.startTick();
                }
            }
            else if (specialInfo.m_ucType == Macros.SCENE_SPECIAL_FINAL_RESULT) {
                // 关闭复活面板
                G.Uimgr.closeForm(ReliveView);
                G.DataMgr.kfjdcData.jjtzKfjdcFinalResult = notify.m_stData.m_stSpecialInfo.m_stValue.m_stKFJDCFinalResult;
                G.Uimgr.createForm<BwdhWatchResultView>(BwdhWatchResultView).open();
            }
            else if (specialInfo.m_ucType == Macros.SCENE_SPECIAL_GROUPPIN_AGAIN) {
                let info = specialInfo.m_stValue.m_stGroupPinEnterAgain;
                G.DataMgr.pinstanceData.groupPinEnterAgain = info;
                let view = G.Uimgr.getForm<ChallengeAgainConfrimView>(ChallengeAgainConfrimView);
                if (view != null && view.isOpened) {
                    view.updataPanel();
                }
            }
            else if (specialInfo.m_ucType == Macros.SCENE_SPECIAL_NORMAL_BOARD) {
                let info = specialInfo.m_stValue.m_stSpecailNormalBoard;
                if (0 != info.m_status) {
                    // 关闭左侧统计面板
                    G.ViewCacher.mainView.closeChildForm(EnumMainViewChild.pinstanceStat);
                    G.ViewCacher.mainView.setTaskTeamActive(true);
                }
            }
            else if (specialInfo.m_ucType == Macros.SCENE_SPECIAL_MONDEAD_EFFECT) {
                let info = specialInfo.m_stValue.m_stSpecialMonDeadEffect;
                if (0 != info.m_status) {
                    //暂停时间
                    G.MapCamera.timeScaleBegin();
                }
            }
        }
        //else if (notify.m_ucType == Macros.SCENEINFOTYPE_SPECIAL_INFO) {
        //    let specialInfo = notify.m_stData.m_stSpecialInfo;
        //    if (specialInfo.m_ucType == Macros.SCENE_SPECIAL_GROUPPIN_AGAIN) {
        //        let info = specialInfo.m_stValue.m_stGroupPinEnterAgain;
        //        G.DataMgr.pinstanceData.groupPinEnterAgain = info;
        //        let view = G.Uimgr.getForm<ChallengeAgainConfrimView>(ChallengeAgainConfrimView);
        //        if (view != null && view.isOpened) {
        //            view.updataPanel();
        //        }
        //    } else if (specialInfo.m_ucType == Macros.SCENE_SPECIAL_NORMAL_BOARD) {
        //        let info = specialInfo.m_stValue.m_stSpecailNormalBoard;
        //        if (0 != info.m_status) {
        //            // 关闭左侧统计面板
        //            G.ViewCacher.mainView.closeChildForm(EnumMainViewChild.pinstanceStat);
        //            G.ViewCacher.mainView.setTaskTeamActive(true);
        //        }
        //    }
        //    else if (specialInfo.m_ucType == Macros.SCENE_SPECIAL_MONDEAD_EFFECT) {
        //        let info = specialInfo.m_stValue.m_stSpecialMonDeadEffect;
        //        if (0 != info.m_status) {
        //            //暂停时间
        //            G.MapCamera.timeScaleBegin();
        //        }
        //    }
        //}
    }

    private onFmtBossGuideTimer(timer: Game.Timer) {
        this.monsterGuideTimer = null;
        this.checkFmtBossGuide();
    }

    /**
     * 检查黑洞塔怪物寻路
     */
    checkFmtBossGuide() {
        let sceneData = G.DataMgr.sceneData;
        let fmtData = G.DataMgr.fmtData;
        if (sceneData.isEnterSceneComplete && fmtData.pathFmtBossId > 0 && fmtData.isFmtScene(sceneData.curSceneID)) {
            // 在黑洞塔中，需要寻路
            let navCfg = sceneData.getMonsterNav(fmtData.pathFmtBossId);
            if (navCfg) {
                let pathState = G.Mapmgr.goToPos(sceneData.curSceneID, navCfg.m_stPosition.m_uiX, navCfg.m_stPosition.m_uiY, false, true, FindPosStrategy.FindSuitableAround, fmtData.pathFmtBossId, true, Constants.BOSS_DISTANCE);
                if (pathState == PathingState.CAN_REACH) {
                    G.DataMgr.fmtData.pathFmtBossId = 0;
                }
                else if (pathState != PathingState.REACHED) {
                    if (this.monsterGuideTriedTimes < 10) {
                        this.monsterGuideTriedTimes++;
                        this.monsterGuideTimer = new Game.Timer("monsterGuide", 1000, 1, delegate(this, this.onFmtBossGuideTimer));
                    }
                }
            } else {
                uts.logError('no navigation cfg: ' + fmtData.pathFmtBossId);
            }
        }
    }

    /**
     * 检查副本内怪物自动寻路
     */
    private checkPinstanceMonsterGuide() {
        if (G.DataMgr.sceneData.isEnterSceneComplete && G.DataMgr.runtime.waitPathingPinstanceMonsterId > 0) {
            let rightInfo = G.DataMgr.pinstanceData.rightInfo;
            if (rightInfo) {
                for (let i: number = 0; i < rightInfo.m_ucNum; i++) {
                    let data = rightInfo.m_astData[i];
                    if (Macros.SCENERIGHT_MONSTER == data.m_ucType && data.m_stValue.m_stMonster.m_ucNum > 0) {
                        for (let monsterInfo of data.m_stValue.m_stMonster.m_astInfo) {
                            if (monsterInfo.m_uiMonstID == G.DataMgr.runtime.waitPathingPinstanceMonsterId) {
                                let pathState = G.Mapmgr.goToPos(G.DataMgr.sceneData.curSceneID, monsterInfo.m_iPosX, monsterInfo.m_iPosY, false, false, FindPosStrategy.FindSuitableAround, monsterInfo.m_uiMonstID, true, Constants.BOSS_DISTANCE);
                                if (pathState == PathingState.CAN_REACH) {
                                    G.DataMgr.runtime.waitPathingPinstanceMonsterId = 0;
                                }
                                else if (pathState != PathingState.REACHED) {
                                    if (this.monsterGuideTriedTimes < 10) {
                                        this.monsterGuideTriedTimes++;
                                        this.monsterGuideTimer = new Game.Timer("monsterGuide", 1000, 1, delegate(this, this.onPinstanceMonsterGuideTimer));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private onPinstanceMonsterGuideTimer(timer: Game.Timer) {
        this.monsterGuideTimer = null;
        this.checkPinstanceMonsterGuide();
    }

    /**个人竞技面板回复*/
    private onPVPRankCsResponse(response: Protocol.PVPRank_CS_Response): void {

        if (ErrorId.EQEC_Success == response.m_iResultID) {

            //开始PK关闭面板，其他协议都是刷新界面的
            if (response.m_usType == Macros.PVPRANK_START_PK) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenPvpPanelRequest());
            }
            else {
                let heroData = G.DataMgr.heroData;
                if (response.m_usType == Macros.PVPRANK_OPEN_PANEL) {
                    heroData.myPpkRankVal = response.m_stValue.m_stCSOpenPanelRes.m_iMaxRank;
                    heroData.myRank = response.m_stValue.m_stCSOpenPanelRes.m_shMyRankVal;
                    heroData.isGetRankReward = 0 != response.m_stValue.m_stCSOpenPanelRes.m_bGetReward;
                    heroData.myPPkRemindTimes = response.m_stValue.m_stCSOpenPanelRes.m_shRemainTimes;
                    heroData.playerInfoList = response.m_stValue.m_stCSOpenPanelRes.m_astTopRole;
                    heroData.ppkBuyTimes = response.m_stValue.m_stCSOpenPanelRes.m_shBuyTimes;
                    heroData.maxRankRewardBit = response.m_stValue.m_stCSOpenPanelRes.m_iMaxRankRewardBit;
                    heroData.rewardRank = response.m_stValue.m_stCSOpenPanelRes.m_shRewardRank;
                    let tianMingBangRewardView = G.Uimgr.getForm<TianMingBangRewardView>(TianMingBangRewardView);
                    if (tianMingBangRewardView != null) {
                        tianMingBangRewardView.updateView();
                    }
                } else if (response.m_usType == Macros.PVPRANK_BUY_TIMES) {
                    heroData.myPPkRemindTimes = response.m_stValue.m_stCSBuyTimesRes.m_shRemainTimes;
                    heroData.ppkBuyTimes = response.m_stValue.m_stCSBuyTimesRes.m_shBuyTimes;
                } else if (response.m_usType == Macros.PVPRANK_GET_REWARD) {
                    //领取奖励之后再发一个协议刷新面板
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenPvpPanelRequest());
                } else if (response.m_usType == Macros.PVPRANK_GET_MAXRANK_REWARD) {
                    heroData.maxRankRewardBit = response.m_stValue.m_uiGetMaxRankRewardRes;
                    let tianMingBangRewardView = G.Uimgr.getForm<TianMingBangRewardView>(TianMingBangRewardView);
                    if (tianMingBangRewardView != null) {
                        tianMingBangRewardView.updateView();
                    }
                } else if (response.m_usType == Macros.PVPRANK_MOBAI) {
                    G.DataMgr.systemData.dayOperateBits = response.m_stValue.m_uiOperateRecord;
                    let tianMingBangRankView = G.Uimgr.getForm<TianMingBangRankView>(TianMingBangRankView);
                    if (tianMingBangRankView != null) {
                        tianMingBangRankView.updateView();
                    }
                }
                let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
                if (actHomeView != null) {
                    actHomeView.updateByPVPRankCsResponse(response);
                    actHomeView.onDouHunBangChange(response);
                }
                let tianMingBangRankView = G.Uimgr.getForm<TianMingBangRankView>(TianMingBangRankView);
                if (tianMingBangRankView != null) {
                    tianMingBangRankView.updateView();
                }
                G.DataMgr.taskRecommendData.onTianMingChange();
                G.ActBtnCtrl.update(false);
            }
        }
        else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
        }
    }

    private onXZFMResponse(response: Protocol.XZFM_Response) {
        if (ErrorId.EQEC_Success == response.m_iResultID) {

            let monsterData = G.DataMgr.monsterData;
            let bossView = G.Uimgr.getForm<BossView>(BossView);
            if (response.m_ucType == Macros.XZFM_PANEL) {
                let panelInfo = response.m_stValue.m_stPanel;
                monsterData.updateByXzfmPanel(panelInfo);
                if (null != bossView) {
                    bossView.updataXzfmBoss();
                }
            }
            else if (response.m_ucType == Macros.XZFM_BOSSNTF) {
                let oldLive = monsterData.getFirstAliveAncientBossId();
                let oldBossList: Protocol.XZFM_BOSS[];
                if (monsterData.ancientBossPanelInfo) {
                    oldBossList = monsterData.ancientBossPanelInfo.m_stBossList.m_stBossList;
                }

                let BossList = response.m_stValue.m_stBossList;
                monsterData.updateByXzfmBossNtf(BossList);
                if (null != bossView) {
                    bossView.updataXzfmBoss();
                }

                if (oldBossList && G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_XZFM)) {
                    for (let i = 0; i < oldBossList.length; i++) {
                        let data = BossList.m_stBossList[i];
                        if (oldBossList[i].m_ucStatus == 0 && data.m_ucStatus == 1) {
                            if (monsterData.canEnterXzfmFloor(data.m_iBossID)) {
                                MonsterData.isHasBossRefresh = true;
                                if (G.DataMgr.sceneData.curPinstanceID == 0) {
                                    G.Uimgr.createForm<ActTipView>(ActTipView).open(Macros.ACTIVITY_ID_XZFM, 0);
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    private onListActivityLimitResponse(response: Protocol.ListActivityLimit_Response) {
        G.DataMgr.systemData.updateUseTimes(response);
        this.onPinstanceChange();
    }

    onPinstanceChange() {
        G.ModuleMgr.activityModule.__onPinstanceChange();

        let pinstanceHallView = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
        if (pinstanceHallView != null) {
            pinstanceHallView.onPinstanceChange();
        }

        let bossView = G.Uimgr.getForm<BossView>(BossView);
        if (null != bossView) {
            bossView.onPinstanceChange();
        }
        if (this.m_curPinstanceID == Macros.PINSTANCE_ID_MULTIPLAYER_BOSS) {
            //更新多人boss的点数
            G.ViewCacher.mainView.updateNum();
        }

        G.DataMgr.taskRecommendData.onPinstanceChange();
        G.ActBtnCtrl.update(false);
    }

    tryEnterJuQingFuBtn(pinId: number, diff: number) {
        G.GuideMgr.autoJuQingFuBen = false;
        this.tryEnterPinstance(pinId, diff);
    }

    tryEnterCaiLiaoFuBen(pinId: number, diff: number) {
        G.GuideMgr.autoCaiLiaoFuBen = false;
        this.tryEnterPinstance(pinId, diff);
    }

    /**
     * 
     * @param cost 是否收费(目前只有经验副本有用 0不收费 1 收费)
     */
    tryEnterShenHuangMiJing(cost: number = 0) {
        G.GuideMgr.autoShenHuangMiJing = false;
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null != info) {
            this.tryEnterPinstance(Macros.PINSTANCE_ID_SHNS, info.m_uiCurLevel + 1, 0, true, false, cost);
        }
    }

    tryEnterQiangHuaFuBen(layer: number) {
        G.GuideMgr.autoQiangHuaFuBen = false;
        let crtLevel = 0;
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_WST);
        if (null != info) {
            crtLevel = info.m_uiCurLevel;
        }
        if (layer > crtLevel + 1) {
            layer = crtLevel + 1;
        }
        this.tryEnterPinstance(Macros.PINSTANCE_ID_WST, layer);
    }

    tryEnterWuYuanFuBen(layer: number) {
        this.tryEnterPinstance(Macros.PINSTANCE_ID_WYFB, layer);
        G.GuideMgr.autoWuYuanFuBen = false;
    }


    /**
     * 副本货币变化
     * @param id
     */
    onCurrencyChange(id: number) {
        let pinstanceHallView = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
        if (pinstanceHallView != null) {
            pinstanceHallView.onCurrencyChange(id);
        }
        if (id == KeyWord.MONEY_ID_ENERGY_WY) {
            G.DataMgr.taskRecommendData.onPetPinstanceChange();
        }
    }
}
