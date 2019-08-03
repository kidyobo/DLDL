import { MapId } from './../map/MapId';
import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ErrorId } from 'System/protocol/ErrorId'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { ChangeScene } from 'System/data/Runtime'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { MonsterData } from 'System/data/MonsterData'
import { PinstanceData } from 'System/data/PinstanceData'
import { QuestData } from 'System/data/QuestData'
import { SceneData } from 'System/data/scenedata'
import { ThingData } from 'System/data/thing/ThingData'
import { SkillData } from 'System/data/SkillData'
import { UnitModule } from 'System/unit/UnitModule'
import { NPCID } from 'System/data/NPCData'
import { InformResponse } from 'System/tip/InformResponse'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { HeroController } from 'System/unit/hero/HeroController'
import { NpcController } from 'System/unit/npc/NpcController'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Constants } from 'System/constants/Constants'
import { QuestAction, EnumQuestLinkType, EnumDoQuestFor, NPCQuestState, EnumInformType, PathingState, QuestID, EnumMonsterRule, FindPosStrategy } from 'System/constants/GameEnum'
import { EnumTaskTrackLinkKey } from 'System/quest/TaskTrackList'
import { QuestTrackUserData } from 'System/quest/QuestTrackUserData'
import { EnumTaskViewType } from 'System/quest/TaskView'
import { MainUIEffectView } from 'System/main/MainUIEffectView'
import { BoatView } from 'System/activity/view/BoatView'
import { HeroView } from 'System/hero/view/HeroView'
import { JinjieView } from 'System/jinjie/view/JinjieView'
import { BossView } from 'System/pinstance/boss/BossView'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { JuQingFuBenPanel } from 'System/pinstance/hall/JuQingFuBenPanel'
import { DiZheZhiLuPanel } from 'System/pinstance/selfChallenge/DiZheZhiLuPanel'
import { ShenHuangMiJingPanel } from 'System/pinstance/selfChallenge/ShenHuangMiJingPanel'
import { CaiLiaoFuBenPanel } from 'System/pinstance/selfChallenge/CaiLiaoFuBenPanel'
import { WuYuanFuBenPanel } from 'System/pinstance/selfChallenge/WuYuanFuBenPanel'
import { FengMoTaView } from 'System/pinstance/fmt/FengMoTaView'
import { EquipView } from 'System/equip/EquipView'
import { GuildView } from 'System/guild/view/GuildView'
import { EnumJiShouTab } from 'System/jishou/JishouView'
import { JuYuanView } from 'System/juyuan/JuYuanView'
import { PetView } from 'System/pet/PetView'
import { ActHomeView } from 'System/activity/actHome/ActHomeView'
import { TaskGetAwardView } from 'System/quest/TaskGetAwardView'
import { LoopQuestRewardView } from 'System/quest/LoopQuestRewardView'
import { SingleDailyRewardView } from 'System/quest/SingleDailyRewardView'
import { FirstRechargeView } from 'System/activity/view/FirstRechargeView'
import { VipView, VipTab } from 'System/vip/VipView'
import { NPCData } from 'System/data/NPCData'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { GuildExplorePanel } from 'System/guild/view/GuildExplorePanel'
import { Events } from 'System/Events'
import { EnumGuide } from 'System/constants/GameEnum'
import { HunLiView } from '../hunli/HunLiView';

enum AutoDoQuestResult {
    none = 0,
    normal,
    autoAccept,
    waitAccept,
}

/**
 * 任务模块
 * @author teppei
 *
 */
export class QuestModule extends EventDispatcher {
    /**Element模块的引用。*/
    private m_elementModule: UnitModule;

    /**任务的数据*/
    private m_questData: QuestData;

    ///**传送对话框。*/
    //private m_transportDialog: QuestTransportDialog;

    /**前台怪击杀数量表。*/
    private m_clientMonsterCntMap: { [monsterID: number]: number } = {};

    /**是否自动使用小飞鞋*/
    private defaultLoopFlyChoice = -1;

    /**不再提示日常环任务1.5倍的选项*/
    private onPromp1p5 = false;

    private m_isCheckSelected = false;

    /**等候领取然后自动做的任务*/
    private waitAcceptQuest = 0;

    private autoDoQuestTimer: Game.Timer;

    private noPrompFly = false;
    private needAutoShowLoopReward: { [type: number]: boolean } = {};

    private oldHeroLv = 0;

    private _hero: HeroController = null;
    private get Hero() {
        if (this._hero == null) {
            this._hero = G.UnitMgr.hero;
        }
        return this._hero;
    }

    constructor() {
        super();
        this.addNetListener(Macros.MsgID_ListQuestProgress_Response, this._listQuestProgressResponse); //任务列表请求回复
        this.addNetListener(Macros.MsgID_UpdateQuestProgress_Notify, this._updateQuestProgressNotify); //任务更新通知
        this.addNetListener(Macros.MsgID_OperateOneQuest_Response, this._operateOneQuestResponse); //任务操作回复
        this.addNetListener(Macros.MsgID_ListMenu_Response, this._listMenuResponse);
        this.addNetListener(Macros.MsgID_QuestPanel_Response, this.QuestPanelResponse);
        this.m_questData = G.DataMgr.questData;
    }

    onModuleReady() {
        this.m_elementModule = G.ModuleMgr.unitModule;
    }

    /**
     * 发送任务操作请求到后台
     * @param ushQuestID
     * @param questOperation
     *
     */
    operateOneQuestRequest(ushQuestID: number, questOperation: number): void {
        let questCfg = QuestData.getConfigByQuestID(ushQuestID);
        if (QuestData.isDailyQuestByType(questCfg.m_ucQuestType)) {
            this.needAutoShowLoopReward[questCfg.m_ucQuestType] = true;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateOneQuestRequestMsg(ushQuestID, questOperation));
    }

    /**
     * 任务列表请求的回复 ，现在都不要请求，后台直接给回复，考虑是不是改成notify啊
     * @param msg
     *
     */
    private _listQuestProgressResponse(response: Protocol.ListProgress_Response): void {
        // 第一次登录后是后台直接推送的
        if (0 != response.m_uiResultID) {
            uts.log('拉取任务列表失败：' + response.m_uiResultID);
            G.ViewCacher.taskView.close();
        }
        else {
            uts.log('拉取任务列表成功：护送(No.' + response.m_iGuoYunDayCompletedTimes + ')：' + response.m_iNextGuoYunQuestID + '，宗门(No.' + response.m_iGuildDailyDayCompletedTimes + ')：' + response.m_iNextGuildDailyQuestID +
                '，日常(No.' + response.m_iDailyCompletedNumber + ')：' + response.m_iNextDailyQuestID);

            // 记录老的信息
            let oldNextGuildQuestID: number = this.m_questData.nextGuildQuestID;
            let oldNextGuoYunQuestID: number = this.m_questData.nextGuoYunQuestID;

            this.m_questData.updateDoingList(response.m_stQuestProgressList); //更新前台维护的正在执行的任务信息
            this.m_questData.dailyCompleteTime = response.m_iDailyCompletedNumber;
            this.m_questData.nextDailyQuestId = response.m_iNextDailyQuestID;

            this.m_questData.updateCompletedList(response.m_stCompletedQuestList); //更新前台维护的已经完成的任务列表

            // 宗门任务
            this.m_questData.guildDailyCompletedNumer = response.m_iGuildDailyDayCompletedTimes; // 当天完成的宗门任务数
            this.m_questData.nextGuildQuestID = response.m_iNextGuildDailyQuestID; // 更新下个可接的宗门任务
            // 国运任务
            this.m_questData.nextGuoYunQuestID = response.m_iNextGuoYunQuestID;
            this.m_questData.guoYunDayCompletedTimes = response.m_iGuoYunDayCompletedTimes;
            this.m_questData.juanzhouNum = response.m_ucJuanZhouDayCompletedTimes;

            if (!this.m_questData.isQuestDataReady) {
                this.m_questData.onNormalDataReady();
                G.GuideMgr.onQuestDataReady();
                //派发列出任务的消息，比如在Elem模块那边要根据当前的任务更新采集怪的状态等
                G.ModuleMgr.unitModule.refreshAllCollectedMonster(0, 0);
                // 检查领取支线任务
                if (G.DataMgr.sceneData.isEnterSceneComplete) {
                    this.checkAutoAccpetBranch();
                }
            }

            this.dispatchEvent(Events.QuestChange);
            G.DataMgr.taskRecommendData.onQuestChange();
            // 更新当前的国运物资等级
            this.m_questData.updateCurrentGuoyunLv();

            // 检查是否需要创建前台怪
            this.checkClientMonster();

            if (0 == oldNextGuoYunQuestID && oldNextGuoYunQuestID != this.m_questData.nextGuoYunQuestID) {
                // 检查提示活动，比如国运
                G.ModuleMgr.activityModule.checkPromp(Macros.ACTIVITY_ID_GUOYUN);
            }

            // 检查环任务是否都完成了，要弹出领奖
            let cnt = QuestData.LOOP_DAILY_TYPES.length;
            for (let i = 0; i < cnt; i++) {
                let loopType = QuestData.LOOP_DAILY_TYPES[i];
                if (this.needAutoShowLoopReward[loopType] && ((G.DataMgr.systemData.dayOperateBits & QuestData.LOOP_OPERATOR[i]) == 0)) {
                    let maxCnt = this.m_questData.getMaxCntByQuestType(loopType);
                    if (maxCnt > 0 && maxCnt == this.m_questData.getFinishedCntByQuestType(loopType)) {
                        G.Uimgr.createForm<LoopQuestRewardView>(LoopQuestRewardView).open(loopType);
                        this.m_questData.noTipLoopRewardsMap[loopType] = false;
                        this.needAutoShowLoopReward[loopType] = false;
                        break;
                    }
                }
            }

            // 刷新场景中npc的任务状态
            G.ModuleMgr.unitModule.updateAllNpcQuestState(0);
        }
    }

    /**
     * 任务更新的通知处理，主要是对任务节点的更新
     * @param msg
     *
     */
    private _updateQuestProgressNotify(notify: Protocol.UpdateProgress_Notify): void {
        if (0 != notify.m_uiResultID) {
            G.ViewCacher.taskView.close();
        }
        else {
            this._updateProgressList(notify.m_stQuestProgress);
        }
    }

    /**
     * 任务操作请求回复
     * 包括任务的领取，重新领取，放弃，完成等
     * @param msg
     *
     */
    private _operateOneQuestResponse(response: Protocol.OperateQuest_Response): void {
        //StoryGuide.ins.questQaeStatus = false;
        if (response.m_uiResultID != 0) {
            if (G.ViewCacher.taskView.isShowingQuest(response.m_iQuestID)) {
                G.ViewCacher.taskView.close();
            }
            uts.log('操作任务失败： ' + response.m_iQuestID + ', opreate = ' + response.m_ucQuestOperation);
        }
        else {
            //uts.log('operate quest response: ' + response.m_iQuestID + ', operation = ' + response.m_ucQuestOperation);
            this._updateStateByOperate(response.m_iQuestID, response.m_iGroupID, response.m_ucQuestOperation);

            //日常任务
            this.m_questData.dailyCompleteTime = response.m_iDailyCompletedNumber;
            this.m_questData.nextDailyQuestId = response.m_iNextDailyQuestID;
            // 宗门任务
            this.m_questData.guildDailyCompletedNumer = response.m_iGuildDailyDayCompletedTimes; // 当天完成的宗门任务数
            this.m_questData.nextGuildQuestID = response.m_iNextGuildDailyQuestID; // 更新下个可接的宗门任务
            // 国运任务
            this.m_questData.nextGuoYunQuestID = response.m_iNextGuoYunQuestID;
            this.m_questData.guoYunDayCompletedTimes = response.m_iGuoYunDayCompletedTimes;
            this.m_questData.juanzhouNum = response.m_ucJuanZhouDayCompletedTimes;

            // 清除掉任务状态
            if (QuestAction.abandon == response.m_ucQuestOperation || QuestAction.complete == response.m_ucQuestOperation) {
                G.DataMgr.runtime.resetAllBut();
            }

            let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(response.m_iQuestID);

            this.dispatchEvent(Events.QuestChange);
            G.DataMgr.taskRecommendData.onQuestChange();
            // 如果不是放弃任务，则开始自动做任务
            // 如果是接受任务，则自动做刚接受的任务
            if (QuestAction.accept == response.m_ucQuestOperation) {
                this._processWhenAccpet(response.m_iQuestID);
            }
            else if (QuestAction.complete == response.m_ucQuestOperation) {
                this.m_questData.lastQuestCompleted = response.m_iQuestID;

                //if (!QuestData.isSpecialQuestByType(questConfig.m_ucQuestType)) {
                //    G.form<TaskView>(TaskView).flyRewards(response.m_iQuestID);
                //}

                if (KeyWord.QUEST_TYPE_JUANZHOU == questConfig.m_ucQuestType) {
                    this.doGetJuanZhouQuest(false, 173);
                }

                // 刷新场景中npc的任务状态
                G.ModuleMgr.unitModule.updateAllNpcQuestState(0);

                if (QuestData.isDailyQuestByType(questConfig.m_ucQuestType)) {
                    // 环任务完成后提示是否飞
                    let leftTime: number = this.m_questData.getMaxCntByQuestType(questConfig.m_ucQuestType) - this.m_questData.getFinishedCntByQuestType(questConfig.m_ucQuestType);
                    if (leftTime > 0) {
                        let trunkQp = this.m_questData.getDoingQuestByType(KeyWord.QUEST_TYPE_TRUNK, false, false);
                        if ((null == trunkQp || ((KeyWord.QUEST_NODE_LEVELUP == QuestData.getConfigByQuestID(trunkQp.m_iQuestID).m_astQuestNodeConfig[0].m_ucType || KeyWord.QUEST_NODE_FIGHT_POINT == QuestData.getConfigByQuestID(trunkQp.m_iQuestID).m_astQuestNodeConfig[0].m_ucType) && !this.m_questData.isQuestCompleting(trunkQp))) &&
                            this.m_questData.getAcceptableTrunk(G.DataMgr.heroData) == null) {
                            // 身上没有可以接的主线、没有可以交的主线、没有正在做的非升级类主线
                            let nextQuestID: number = (questConfig.m_ucQuestType == KeyWord.QUEST_TYPE_DAILY) ? response.m_iNextDailyQuestID : response.m_iNextGuildDailyQuestID;
                            if (nextQuestID > 0) {
                                if (this.defaultLoopFlyChoice < 0) {
                                    let str = uts.format('本环{0}已完成，今天还有{1}环未完成！是否使用小飞鞋传送到下一环目的地？',
                                        KeyWord.getDesc(KeyWord.GROUP_QUEST_TYPE, questConfig.m_ucQuestType),
                                        TextFieldUtil.getColorText(leftTime.toString(), Color.GREEN));
                                    G.TipMgr.showConfirm(str, ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onLoopFlyConfirm, nextQuestID, 0), Constants.AutoDoTimeout, 0);
                                }
                                else {
                                    this.onLoopFlyConfirm(this.defaultLoopFlyChoice, true, nextQuestID, 0);
                                }
                            }

                            //原地等着
                            return;
                        }
                    } else {
                        // 全都做完了
                        G.Uimgr.createForm<LoopQuestRewardView>(LoopQuestRewardView).open(questConfig.m_ucQuestType);
                        this.m_questData.noTipLoopRewardsMap[questConfig.m_ucQuestType] = false;
                        this.needAutoShowLoopReward[questConfig.m_ucQuestType] = false;
                        this.doQuestOrGotoFmt(-1);
                    }
                }

                let noContinueGuoYun = false;
                if (questConfig.m_ucQuestType == KeyWord.QUEST_TYPE_GUO_YUN) {
                    // 如果身上没有主线任务了，且当前有双倍护送，则提示继续
                    if (G.DataMgr.runtime.noContinueGuoYun) {
                        noContinueGuoYun = true;
                        G.DataMgr.runtime.noContinueGuoYun = false;
                    } else {
                        let guoyunRestTime: number = this.m_questData.maxGuoyunQuestNum - this.m_questData.guoYunDayCompletedTimes;
                        if (guoyunRestTime > 0) {
                            G.ViewCacher.taskView.close();
                            G.TipMgr.showConfirm('您还可以继续护送战车，是否继续护送', ConfirmCheck.noCheck, '确定|取消', this._onContinueGuoyun);
                            return;
                        }
                    }
                }

                G.AudioMgr.playSound('sound/ui/uisound_19.mp3');
                G.ViewCacher.mainUIEffectView.playQuestCompleteEffect();
                // 检查功能开启和引导
                if (G.GuideMgr.processOperateQuest(noContinueGuoYun ? 0 : response.m_iQuestID, false)) {
                    // 正在引导
                    G.ViewCacher.taskView.close();
                }
                else {
                    let now = UnityEngine.Time.realtimeSinceStartup;
                    if (now > G.DataMgr.systemData.updateTime) {
                        // 不需要引导，那么继续做下一个任务
                        // 先查看这个NPC身上有没有下一个任务继续接
                        if (QuestData.isSpecialQuestByType(questConfig.m_ucQuestType) || !this._autoDoNext(response.m_iQuestID, questConfig.m_iAwarderNPCID)) {
                            // 特殊任务不自动接着做，或者当前NPC身上没有继续接的任务，所以关闭对话框
                            G.ViewCacher.taskView.close();
                        }
                    }
                    else {
                        G.ViewCacher.taskView.close();
                        if (null != this.autoDoQuestTimer) {
                            this.autoDoQuestTimer.Stop();
                        }
                        let interval: number = Math.round((G.DataMgr.systemData.updateTime - now) * 1000) + 100;
                        this.autoDoQuestTimer = new Game.Timer("autoDoQuest", interval, 1, delegate(this, this.onNextAutoDoTask, questConfig));
                    }
                }

                // 检查是否有支线任务可以接
                this.checkAutoAccpetBranch();

                // 完成了探险任务刷新按钮状态
                if (KeyWord.QUEST_TYPE_TREASURE_HUNT == questConfig.m_ucQuestType) {
                    let panel = G.Uimgr.getSubFormByID<GuildExplorePanel>(GuildView, KeyWord.OTHER_FUNCTION_GUILD_EXPLORE);
                    if (panel) {
                        panel.onGuildExploreChanged();
                    }
                }
            }
        }
    }

    private onNextAutoDoTask(timer: Game.Timer, questConfig: GameConfig.QuestConfigM): void {
        // 不需要引导，那么继续做下一个任务
        // 先查看这个NPC身上有没有下一个任务继续接
        if (QuestData.isSpecialQuestByType(questConfig.m_ucQuestType) || !this._autoDoNext(questConfig.m_iQuestID, questConfig.m_iAwarderNPCID)) {
            // 特殊任务不自动接着做，或者当前NPC身上没有继续接的任务，所以关闭对话框
            G.ViewCacher.taskView.close();
        }
    }

    private getDailyReward(questID: number) {
        let cfg = QuestData.getConfigByQuestID(questID);
        // 日环任务提示要不要1.5倍
        if (this.onPromp1p5) {
            this.onDaily1p5Confirm(G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_LOOP_QUEST_REWARD), true, questID);
        } else {
            G.Uimgr.createForm<SingleDailyRewardView>(SingleDailyRewardView).open(questID, delegate(this, this.onDaily1p5Confirm, questID));
        }
    }

    private onDaily1p5Confirm(is1p5: boolean, noPromp: boolean, questID: number): boolean {
        this.onPromp1p5 = noPromp;
        if (is1p5) {
            // 选择1.5倍，看有没有相关特权，没有弹特权板子
            if (!G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_LOOP_QUEST_REWARD)) {
                G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi);
                // G.TipMgr.addMainFloatTip('首充1元激活');
                return false;
            } else {
                this.operateOneQuestRequest(questID, QuestData.EQA_Complete);
                return true;
            }
        } else {
            this.operateOneQuestRequest(questID, QuestData.EQA_Complete);
            return true;
        }
    }

    private onLoopFlyConfirm(state: MessageBoxConst, isCheckSelected: boolean, questID: number, nodeIndex: number) {
        if (isCheckSelected) {
            this.defaultLoopFlyChoice = state;
        }
        if (MessageBoxConst.yes == state) {
            let rst = this.processQuestJdy(questID, nodeIndex);
            if (rst == AutoDoQuestResult.waitAccept) {
                // 其实环任务完成的时候，下一个还没接取，流程是接下来后台会自动发一条operate response接取这个任务，因此这里缓存起来
                this.waitAcceptQuest = questID;
            }
        }
        else {
            this._autoDoQuest(questID, false, nodeIndex);
        }
    }

    private _onContinueGuoyun(state: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == state) {
            G.ActionHandler.handleGuoyun();
        }
    }

    /**
     * 处理接受了某任务之后的逻辑。
     * @param questID
     * @return 返回true表示可以关掉对话框，否则返回false。
     *
     */
    private _processWhenAccpet(questID: number): void {
        this.m_questData.lastQuestAccpeted = questID;

        let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(questID);
        if (questConfig.m_iConsignerNPCID > 0) {
            G.ModuleMgr.unitModule.updateAllNpcQuestState(questConfig.m_iConsignerNPCID);
        }
        if (questConfig.m_iAwarderNPCID > 0) {
            G.ModuleMgr.unitModule.updateAllNpcQuestState(questConfig.m_iAwarderNPCID);
        }

        //支线任务接了什么都不处理
        if (questConfig.m_ucQuestType == KeyWord.QUEST_TYPE_BRANCH) {
            if (this.waitAcceptQuest == questID) {
                this._autoDoQuest(questID, false, -1);
            }
            return;
        }
        // 接受卷轴任务后播放特效
        if (KeyWord.QUEST_TYPE_JUANZHOU == questConfig.m_ucQuestType) {
            G.ViewCacher.mainUIEffectView.playQuestAcceptEffect();
        }
        // 检查次任务是否需要创建前台怪
        this.checkClientMonster();
        this.onCheckOver(questID, questConfig);
    }
    private onCheckOver(questID: number, questConfig: GameConfig.QuestConfigM) {
        // 表中填了能不能跳
        let isTransort = (questConfig.m_ucBigJumpType == KeyWord.QUEST_ACCEPT_JUMP || questConfig.m_ucBigJumpType == KeyWord.QUEST_ALL_JUMP) && G.Mapmgr.canTransport(null, false);
        let nodeCfg = questConfig.m_astQuestNodeConfig[0];
        let isAcceptLvUp = KeyWord.QUEST_NODE_LEVELUP == nodeCfg.m_ucType;
        if (isAcceptLvUp && G.DataMgr.heroData.level >= nodeCfg.m_iThingID) {
            // 升级任务已经实现了，接下来后台会发progress的
            return;
        }

        let isAcceptFightUp = KeyWord.QUEST_NODE_FIGHT_POINT == nodeCfg.m_ucType;
        if (isAcceptFightUp && G.DataMgr.heroData.fight >= nodeCfg.m_iThingID) {
            //当接受这个战力卡点任务时,战力已经达标了
            return;
        }

        // 接受国运任务或者特殊任务后直接做
        if (KeyWord.QUEST_TYPE_GUO_YUN == questConfig.m_ucQuestType || QuestData.isSpecialQuestByType(questConfig.m_ucQuestType)) {
            G.ViewCacher.taskView.close();
            this._autoDoQuest(questID, false, -1);
            return;
        }

        let needFly = false;
        if (QuestData.isDailyQuestByType(questConfig.m_ucQuestType)) {
            if (this.waitAcceptQuest == questID) {
                // 这是勾选了自动做整环环任务
                this.waitAcceptQuest = 0;
                needFly = true;
            }
        }

        // 检查任务引导
        if (G.GuideMgr.processOperateQuest(questID, needFly)) {
            // 需要引导，同样关闭对话框
            G.ViewCacher.taskView.close();
        }
        else {
            //玩家只有在完成了上一轮日常任务之后才会自动寻路，这样避免的晚上十二点自动接取日常任务后破坏挂机状态
            if (needFly) {
                this.processQuestJdy(questConfig.m_iQuestID, 0);
                return;
            }

            // 其他任务的话需要检查当前NPC身上还有没有任务可以继续接
            let nextQuestID: number = this.m_questData.getNPCNextQuestID(questID, questConfig.m_iConsignerNPCID, G.DataMgr.heroData);
            if (nextQuestID > 0) {
                // 还有任务可以接则继续接，因此也不需要关掉对话框
                this._autoDoQuest(nextQuestID, isTransort, -1);
                return;
            }

            // 没有任务可以接了就按照优先级做该NPC身上的已接任务，主线任务优先
            // 接取的时候如果是升级任务，那么就允许直接做升级任务
            let questList: GameConfig.QuestConfigM[] = this.m_questData.getDoingQuestByNpc(questConfig.m_iConsignerNPCID, 1, !isAcceptLvUp || !isAcceptFightUp, true, 0);
            if (questList.length > 0) {
                // 按优先级做任务
                let toDoQuestConfig: GameConfig.QuestConfigM = questList[0];
                // 检查这个任务是不是主线任务，如果不是的话，那就检查当前有没有正在做的主线任务，有的话就做主线任务了
                if (KeyWord.QUEST_TYPE_TRUNK != toDoQuestConfig.m_ucQuestType) {
                    let crtTrunkQp: Protocol.QuestProgress = this.m_questData.getDoingQuestByType(KeyWord.QUEST_TYPE_TRUNK, !isAcceptLvUp || isAcceptFightUp);
                    if (null != crtTrunkQp) {
                        // 有主线任务正在做，比如完成了还没有交，那么优先去做这个主线任务
                        let tmpQuest: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(crtTrunkQp.m_iQuestID);
                        // 需要检查刚刚接受的这个任务是不是这个主线任务要去领的任务
                        // 比如说主线任务是去领取一个前线任务，这时候领了前线任务就不能再继续做主线任务了，否则就是死循环
                        if (tmpQuest.m_ucQuestNodeNumber == 0 || questID != tmpQuest.m_astQuestNodeConfig[0].m_iThingID) {
                            toDoQuestConfig = tmpQuest;
                        }
                    }
                }

                if (null == toDoQuestConfig) {
                    // 应该不会进来这里的，只是为了避免未知情况下报错
                    return;
                }

                if (!this.m_questData.isQuestCompletingByID(toDoQuestConfig.m_iQuestID) || (toDoQuestConfig.m_iAwarderNPCID != questConfig.m_iConsignerNPCID)) {
                    // 既不是可以立即完成的任务，或者交任务和接任务的NPC不是同一个则关掉对话框
                    G.ViewCacher.taskView.close();
                }

                // 不需要引导
                if (this.m_questData.shouldFly(toDoQuestConfig.m_iQuestID)) {
                    // 提示传送
                    if (this.noPrompFly) {
                        this.onTipConfirmClick(MessageBoxConst.yes, this.noPrompFly, toDoQuestConfig);
                    } else {
                        this._showTransportDialog(toDoQuestConfig);
                    }
                }
                else {
                    // 如果是不能完成的升级任务，那就先看看有没有其他打怪任务，有的话就做其它
                    if (KeyWord.QUEST_NODE_LEVELUP != toDoQuestConfig.m_astQuestNodeConfig[0].m_ucType ||
                        KeyWord.QUEST_NODE_FIGHT_POINT != toDoQuestConfig.m_astQuestNodeConfig[0].m_ucType ||
                        this.m_questData.isQuestCompletingByID(toDoQuestConfig.m_iQuestID)) {
                        this._autoDoQuest(toDoQuestConfig.m_iQuestID, isTransort, -1, true);
                    } else {
                        let pg = this.m_questData.getDoingQuestButLvUp();
                        if (null != pg) {
                            this._autoDoQuest(pg.m_iQuestID, false, 0);
                        }
                    }
                }
            }
            else {
                this._autoDoNext(questID, questConfig.m_iConsignerNPCID);
            }
        }
    }


    /**
     * 自动继续接取或做下一个任务，这个任务根据当前完成或接取的任务决定，优先接当前NPC身上的。
     * @param curQuestID
     * @return 如果在这个NPC身上还有任务可以做则返回true，否则返回false。
     *
     */
    private _autoDoNext(curQuestID: number, npcID: number): boolean {
        G.DataMgr.runtime.pickQuestID = 0;
        //if (StoryGuide.ins.isStoryMap())
        //    return false;

        if (QuestData.getConfigByQuestID(curQuestID).m_ucQuestType != KeyWord.QUEST_TYPE_TRUNK) {
            return false;
        }
        let questConfig: GameConfig.QuestConfigM;
        let aotoQuestID: number;
        // 先查找这个NPC身上是否还有可以交的任务
        if (curQuestID > 0) {
            questConfig = QuestData.getConfigByQuestID(curQuestID);
            let awardQuests: GameConfig.QuestConfigM[] = this.m_questData.getAwardQuestsByNpcID(questConfig.m_iAwarderNPCID, true, true);
            if (null != awardQuests && awardQuests.length > 0) {
                aotoQuestID = awardQuests[0].m_iQuestID;
                this._autoDoQuest(aotoQuestID);
                return true;
            }
        }

        // 接着继续找这个NPC身上是否还有可以接的任务
        aotoQuestID = this.m_questData.getNPCNextQuestID(curQuestID, npcID, G.DataMgr.heroData);
        if (aotoQuestID != 0) {
            // 看看这个任务是不是在当前这个NPC身上
            questConfig = QuestData.getConfigByQuestID(aotoQuestID);
            if (npcID == questConfig.m_iConsignerNPCID) {
                // 这个NPC身上有任务可以继续接
                let autoResult = this._autoDoQuest(aotoQuestID, false, -1);
                return AutoDoQuestResult.autoAccept != autoResult;
            }
        }

        // 接下来找后续任务
        if (curQuestID > 0) {
            aotoQuestID = QuestData.getConfigByQuestID(curQuestID).m_iNextQuestID;
            if (aotoQuestID > 0) {
                if (this.m_questData.isQuestInDoingList(aotoQuestID)) {
                    // 后续任务已经接了，继续做
                    this._autoDoQuest(aotoQuestID, false, -1);
                    return false;
                } else {
                    questConfig = QuestData.getConfigByQuestID(aotoQuestID);
                    if (this.m_questData.canQuestAccept(questConfig, G.DataMgr.heroData, true)) {
                        if (KeyWord.QUEST_TYPE_BRANCH == questConfig.m_ucQuestType) {
                            // 支线任务的后续任务是后台自动领的
                            let nodeType = questConfig.m_astQuestNodeConfig[0].m_ucType;
                            if (KeyWord.QUEST_NODE_COLLECT == nodeType || KeyWord.QUEST_NODE_MONSTER == nodeType || KeyWord.QUEST_NODE_DIALOG == nodeType) {
                                this.waitAcceptQuest = aotoQuestID;
                                return;
                            }
                        } else {
                            this._autoDoQuest(aotoQuestID, false, -1);
                            return false;
                        }
                    }
                }
            }
        }

        // 从正在做的和未接的任务中筛选一个主线任务出来
        // 先优先找当前正在做的任务
        let doingQuestList: GameConfig.QuestConfigM[] = this.m_questData.getDoingQuestByNpc(0, -1, true, true, 0);
        let len: number = doingQuestList.length;
        let i: number;
        if (len > 0) {
            // 首先排除掉当前的任务
            if (curQuestID > 0) {
                for (i = len - 1; i >= 0; i--) {
                    questConfig = doingQuestList[i];
                    // 当前这个任务就不要了，不然就是死循环，提升等级类的任务也不要
                    if (curQuestID == questConfig.m_iQuestID || questConfig.m_ucQuestType == KeyWord.QUEST_TYPE_BRANCH) {
                        doingQuestList.splice(i, 1);
                    }
                }
            }
        }

        // 看看正在做的有没有主线任务，只需要看第一个
        len = doingQuestList.length;
        if (len > 0) {
            questConfig = doingQuestList[0];
            if (KeyWord.QUEST_TYPE_TRUNK == questConfig.m_ucQuestType) {
                aotoQuestID = questConfig.m_iQuestID;
                this._autoDoQuest(aotoQuestID, false, -1);
                return false;
            }
        }

        // 走到这里说明正在做的没有主线任务，那么看看有没有主线任务可以接
        let canAcceptTrunk = this.m_questData.getAcceptableTrunk(G.DataMgr.heroData);
        if (canAcceptTrunk != null) {
            aotoQuestID = canAcceptTrunk.m_iQuestID;
            this._autoDoQuest(aotoQuestID, false, -1);
            return false;
        }

        // 没有可以接的主线任务，则看有没有同等类型的任务可以接
        if (curQuestID > 0) {
            let questType: number = QuestData.getConfigByQuestID(curQuestID).m_ucQuestType;
            let canAcceptQuestList: GameConfig.QuestConfigM[];
            if (KeyWord.QUEST_TYPE_BRANCH == questType) {
                canAcceptQuestList = this.m_questData.getAcceptableBranch(G.DataMgr.heroData, 1);
            } else if (KeyWord.QUEST_TYPE_GUILD_DAILY == questType) {
                canAcceptQuestList = this.m_questData.getAcceptableGuildDaily(G.DataMgr.heroData, 1);
            } else if (KeyWord.QUEST_TYPE_GUO_YUN == questType) {
                canAcceptQuestList = this.m_questData.getAcceptableGuoYun(G.DataMgr.heroData, 1);
            }
            if (canAcceptQuestList && canAcceptQuestList.length > 0) {
                questConfig = canAcceptQuestList[0];
                aotoQuestID = questConfig.m_iQuestID;
                this._autoDoQuest(aotoQuestID, false, -1);
                return false;
            }
        }

        // 既然正在做的和可以接的没有主线任务，那么回归正在做的，挑一个做起
        len = doingQuestList.length;
        if (len > 0) {
            questConfig = doingQuestList[0];
            aotoQuestID = questConfig.m_iQuestID;
            this._autoDoQuest(aotoQuestID, false, -1);
            return false;
        }

        return false;
    }

    /**
     * 更新任务的进度（完成情况）
     * @param progress
     *
     */
    private _updateProgressList(newProgress: Protocol.QuestProgress[]): void {
        let len: number = newProgress.length;
        let doingProgress: Protocol.QuestProgress = null;
        let autoQuestID = 0;
        let dailyQuestID = 0;
        for (let i: number = 0; i < len; ++i) //遍历要更新的任务
        {
            let cfg = QuestData.getConfigByQuestID(newProgress[i].m_iQuestID);
            doingProgress = this.m_questData.getQuestProgress(cfg.m_iQuestID);
            let finished = this._updateProgress(cfg, newProgress[i], doingProgress);
            if (finished) {
                if (KeyWord.QUEST_TYPE_DAILY == cfg.m_ucQuestType) {
                    // 日环任务提示1.5倍
                    dailyQuestID = cfg.m_iQuestID;
                } else if (0 == autoQuestID) {
                    autoQuestID = cfg.m_iQuestID;
                }
            }

            if (finished && cfg.m_iAwarderNPCID > 0) {
                G.ModuleMgr.unitModule.updateAllNpcQuestState(cfg.m_iAwarderNPCID);
            }
        }
        this.dispatchEvent(Events.QuestChange); //任务状态改变的消息

        if (dailyQuestID > 0) {
            this.getDailyReward(dailyQuestID);
        } else if (autoQuestID > 0) {
            // 如果某个节点完成了，就需要自动进行下一节点，这里需要延迟50毫秒，否则如果刚走路去打怪
            // 但是过了几毫秒又处理到节点更新马上又去交任务寻路，这时候可能会出现拉扯，后台的移动包
            // 限制频率30ms
            if (null != this.autoDoQuestTimer) {
                this.autoDoQuestTimer.Stop();
            }
            this.autoDoQuestTimer = new Game.Timer("autoDoQuest", 400, 1, delegate(this, this.onAutoDoQuestTimer, autoQuestID));
        }
    }

    private onAutoDoQuestTimer(timer: Game.Timer, questID: number) {
        this._autoDoQuest(questID, false, -1, false, false, EnumDoQuestFor.progressReach);
    }

    /**
     * 更新某一个任务的进度
     * @param newProgress 任务的新进度
     * @param oldProgress 任务的旧进度
     *
     */
    private _updateProgress(questConfig: GameConfig.QuestConfigM, newProgress: Protocol.QuestProgress, oldProgress: Protocol.QuestProgress): boolean {
        if (defines.has('_DEBUG')) {
            uts.assert(newProgress != null && oldProgress != null, '数据必须不为空');
            uts.assert(newProgress.m_iQuestID == oldProgress.m_iQuestID, '数据正确');
        }

        let nodeProgress: Protocol.QuestNodeProgress = null;
        let nodeConfig: GameConfig.QuestNodeConfigCli;
        let isTrunk: boolean = questConfig.m_ucQuestType == KeyWord.QUEST_TYPE_TRUNK;
        let finishCnt = 0;
        for (let k: number = 0; k < newProgress.m_ucNodeNumber; k++) //遍历要更新的节点
        {
            nodeProgress = newProgress.m_astNodeProgress[k];

            // 正在做的这个任务的这个节点的进度值跟后台下发的一样的话就不处理
            if (oldProgress.m_astNodeProgress[nodeProgress.m_ucQuestProgressIndex].m_shProgressValue == nodeProgress.m_shProgressValue) {
                continue;
            }

            oldProgress.m_astNodeProgress[nodeProgress.m_ucQuestProgressIndex].m_shProgressValue = nodeProgress.m_shProgressValue; //改变任务最新进度值

            nodeConfig = questConfig.m_astQuestNodeConfig[nodeProgress.m_ucQuestProgressIndex];

            //任务进度有变化的时候需要看是不是要刷新采集怪
            this._processPickQuest(questConfig, nodeProgress);

            // 如果杀怪数量达到了就停止自动战斗
            if (nodeConfig.m_shValue == nodeProgress.m_shProgressValue) {
                finishCnt++;
                if (KeyWord.QUEST_NODE_COLLECT == nodeConfig.m_ucType || KeyWord.QUEST_NODE_COLLECT_SHARE == nodeConfig.m_ucType) {
                    G.ModuleMgr.deputyModule.startEndHangUp(false);
                }
                else if (KeyWord.QUEST_NODE_MONSTER == nodeConfig.m_ucType || KeyWord.QUEST_NODE_MONSTER_SHARE == nodeConfig.m_ucType) {
                    let nextNodeConfig: GameConfig.QuestNodeConfigCli;
                    if (nodeProgress.m_ucQuestProgressIndex + 1 < questConfig.m_astQuestNodeConfig.length) {
                        nextNodeConfig = questConfig.m_astQuestNodeConfig[nodeProgress.m_ucQuestProgressIndex + 1];
                    }

                    let dropConfig: GameConfig.QuestMonsterDropConfigM;
                    uts.assert(null != questConfig.m_astMonsterDropConfig, uts.format('no drop confits, questID={0}', questConfig.m_iQuestID))
                    if (nodeProgress.m_ucQuestProgressIndex < questConfig.m_astMonsterDropConfig.length) {
                        dropConfig = questConfig.m_astMonsterDropConfig[nodeProgress.m_ucQuestProgressIndex];
                    }
                    if (null == nextNodeConfig || null == dropConfig || nextNodeConfig.m_iThingID != dropConfig.m_iQuestThingID) {
                        // 如果这个节点杀怪掉的物品正好就是下个节点要的物品，那么不能停止自动战斗，要用自动战斗让他自动捡东西
                        G.ModuleMgr.deputyModule.startEndHangUp(false);
                    }
                }
            }
        }

        return finishCnt == newProgress.m_ucNodeNumber;
    }

    /**
     * 任务操作回复时候的更新
     * @param questID 任务ID
     * @param state 任务的状态 领取，放弃完成等，在QuestData里面有枚举值
     *
     */
    private _updateStateByOperate(questID: number, groupId: number, state: number): void {
        this.m_questData.updateStateByOperate(questID, groupId, state); //更新任务数据

        // 检查功能开放
        G.DataMgr.funcLimitData.updateFuncStates();

        let config: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(questID);

        if (defines.has('_DEBUG')) {
            uts.assert(config != null, '任务ID不能不存在，不然后台有问题哦');
        }

        let title: string = config.m_szQuestTitle; //任务名字

        switch (state) {
            case QuestAction.accept: //新领取的任务,需要把任务的状态加入到任务中列表
                this._updateStateWhenAccept(config);
                break;

            case QuestAction.abandon:
                G.ModuleMgr.unitModule.refreshAllCollectedMonster(0, 0);
                break;

            case QuestAction.complete:
                break;
        }

        if (KeyWord.QUEST_TYPE_GUO_YUN == config.m_ucQuestType) {
            // 更新当前的国运物资等级
            this.m_questData.updateCurrentGuoyunLv();
        }
    }

    /**
     * 当接受任务收到服务端的response时候触发的事情
     * @param questID
     * @param questConfig
     *
     */
    private _updateStateWhenAccept(questConfig: GameConfig.QuestConfigM): void {
        if (defines.has('_DEBUG')) {
            uts.assert(questConfig != null && questConfig.m_ucQuestType != KeyWord.QUEST_TYPE_CHILD, '参数不能为空，并且任务类型不可能是子任务类型');
        }

        if (questConfig.m_ucQuestNodeNumber <= 0) //没有任务节点的话前台就直接算完成
        {
            uts.log('任务直接完成:' + questConfig.m_iQuestID);
            if (questConfig.m_ucQuestType != KeyWord.QUEST_TYPE_CHILD) {
                //					this.dispatchEvent(Events.QuestCompleting);
            }
        }
        else {
            // 处理任务节点
            for (let i: number = 0; i < questConfig.m_ucQuestNodeNumber; ++i) {
                if (KeyWord.QUEST_NODE_QUEST == questConfig.m_astQuestNodeConfig[i].m_ucType) {
                    let childConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(questConfig.m_astQuestNodeConfig[i].m_iThingID);
                    if (childConfig.m_ucQuestNodeNumber > 0) {
                        //处理多个几点的时候有没有对采集相关的
                        this._processPickWhenAccept(childConfig)
                    }
                }
            }
            this._processPickWhenAccept(questConfig);
        }
    }

    private _processPickWhenAccept(questConfig: GameConfig.QuestConfigM): void {
        let arr: GameConfig.QuestMonsterDropConfigM[] = this.m_questData.getMonsterDropById(questConfig.m_iQuestID);
        let monsterID: number;
        let monsterConfig: GameConfig.MonsterConfigM;

        if (arr != null && arr.length > 0) {
            for (let o of arr) {
                monsterID = o.m_iMonsterID;
                monsterConfig = MonsterData.getMonsterConfig(monsterID);
                if (null != monsterConfig && KeyWord.MONSTER_TYPE_PICK == monsterConfig.m_bDignity) {
                    G.ModuleMgr.unitModule.refreshAllCollectedMonster(monsterID, 1);
                }
            }
        }
        else {
            // 处理任务节点
            for (let node of questConfig.m_astQuestNodeConfig) {
                if (KeyWord.QUEST_NODE_COLLECT == node.m_ucType || KeyWord.QUEST_NODE_COLLECT_SHARE == node.m_ucType || KeyWord.QUEST_NODE_MONSTER == node.m_ucType || KeyWord.QUEST_NODE_MONSTER_SHARE ==
                    node.m_ucType) {
                    monsterID = node.m_iThingID;
                    if (GameIDUtil.isMonsterID(monsterID)) {
                        monsterConfig = MonsterData.getMonsterConfig(monsterID);
                        if (null != monsterConfig && KeyWord.MONSTER_TYPE_PICK == monsterConfig.m_bDignity) {
                            G.ModuleMgr.unitModule.refreshAllCollectedMonster(monsterID, 1);
                        }
                    }
                }
            }
        }
    }

    /**
     * 对采集任务进行处理，需要刷新采集怪的状态
     * @param questConfig
     * @param thingID
     * @param nodeProgress
     *
     */
    private _processPickQuest(questConfig: GameConfig.QuestConfigM, nodeProgress: Protocol.QuestNodeProgress): void {
        //如果完成，则无法再采集
        let nodeConfig: GameConfig.QuestNodeConfigCli = questConfig.m_astQuestNodeConfig[nodeProgress.m_ucQuestProgressIndex];
        if ((KeyWord.QUEST_NODE_COLLECT == nodeConfig.m_ucType || KeyWord.QUEST_NODE_COLLECT_SHARE == nodeConfig.m_ucType) && nodeProgress.m_shProgressValue == nodeConfig.m_shValue) {
            let monsterID: number = this.m_questData.getMonsterIDByQuestNode(questConfig.m_iQuestID, nodeProgress.m_ucQuestProgressIndex);
            if (monsterID != -1) {
                G.ModuleMgr.unitModule.refreshAllCollectedMonster(monsterID, 0);
            }
        }
    }

    /**
     * 通过thingid和任务id取得对应的掉落怪物的ID
     * @param questID
     * @param thingID
     * @return
     *
     */
    private _getMonsterIDByThingID(questID: number, thingID: number): number {
        let dropConfig: GameConfig.QuestMonsterDropConfigM[] = this.m_questData.getMonsterDropById(questID);
        if (null == dropConfig) {
            return -1;
        }
        let monsterID: number = this._getMonsterIDByThing(dropConfig, thingID);
        return monsterID;
    }

    /**
     * 到任务怪物的掉落配置中匹配到thingID，得到怪物ID
     * @param dropConfig 掉落配置
     * @param thingID 物品ID
     * @return 怪物ID
     *
     */
    private _getMonsterIDByThing(dropConfig: GameConfig.QuestMonsterDropConfigM[], thingID: number): number {
        let len: number = dropConfig.length;
        let config: GameConfig.QuestMonsterDropConfigM = null;
        for (let i: number = 0; i < len; ++i) {
            config = dropConfig[i];
            if (thingID == config.m_iQuestThingID || thingID == config.m_iMonsterID) {
                let monsterID: number = config.m_iMonsterID;
                if (MonsterData.getMonsterConfig(monsterID).m_bDignity == KeyWord.MONSTER_TYPE_PICK) //采集怪
                {
                    return monsterID;
                }
            }
        }
        return -1;
    }

    tryAutoDoQuest(questID: number, isTransport = false, forceEnter = false, doQuestFor = EnumDoQuestFor.normal, isFightPoint: boolean = false): void {
        if (this.m_questData.isQuestInDoingList(questID) || this.m_questData.canQuestAccept(QuestData.getConfigByQuestID(questID), G.DataMgr.heroData, true)) {
            this._autoDoQuest(questID, isTransport, -1, false, forceEnter, doQuestFor, isFightPoint);
        }
    }

    private _autoDoQuest(questID = 0, isTransport = false, nodeIndex = -1, firstAccept = false, forceEnter = false, doQuestFor = EnumDoQuestFor.normal, isFightPoint: boolean = false): AutoDoQuestResult {
        if (G.DataMgr.runtime.isWaitTransprotResponse && G.DataMgr.runtime.itemTransport.questID == questID) {
            return AutoDoQuestResult.normal;
        }

        let result = AutoDoQuestResult.none;
        if (null != this.autoDoQuestTimer) {
            this.autoDoQuestTimer.Stop();
            this.autoDoQuestTimer = null;
        }

        let questConfig: GameConfig.QuestConfigM;
        if (0 != questID) {
            questConfig = QuestData.getConfigByQuestID(questID);
        }

        // 没有指定就找一个可以接的主线任务
        if (null == questConfig) {
            let questConfig = this.m_questData.getAcceptableTrunk(G.DataMgr.heroData);

            // 没有可以接的，那就找一个正在做的
            if (null == questConfig) {
                let doingList: GameConfig.QuestConfigM[] = this.m_questData.getDoingQuestByNpc(0, 0, true, true, 0);
                if (null != doingList && doingList.length > 0) {
                    questConfig = doingList[0];
                }
            }
        }

        if (null == questConfig) {
            return result;
        }
        G.ViewCacher.mainView.taskTrackList.guideOff();

        let pathRet = PathingState.CANNOT_REACH; // 寻路结果
        let needAccept = false; // 是否还没领取任务
        let isCompleting = false; // 是否可以领奖励了
        if (!this.m_questData.isQuestInDoingList(questConfig.m_iQuestID)) {
            if (QuestData.isDailyQuestByType(questConfig.m_ucQuestType) && EnumDoQuestFor.manually != doQuestFor) {
                // 日常任务是后台自动领的，如果因为某些bug后台没自动领上，那么支持手动领取
                result = AutoDoQuestResult.waitAccept;
                return result;
            }
            // 还没接取该任务，先去接取
            needAccept = true;
        }
        else if (this.m_questData.isQuestCompletingByID(questConfig.m_iQuestID)) {
            // 所有节点已经完成了，尝试交任务
            isCompleting = true;

            // 表中填了完成任务领取奖励能不能跳
            if (!isTransport) {
                isTransport = (questConfig.m_ucBigJumpType == KeyWord.QUEST_FINISH_JUMP || questConfig.m_ucBigJumpType == KeyWord.QUEST_ALL_JUMP) && G.Mapmgr.canTransport(null, false);
            }
        }

        G.DataMgr.runtime.resetAllBut();
        result = AutoDoQuestResult.normal;

        let processed = false;
        if (isCompleting && (0 == questConfig.m_iAwarderNPCID || null == questConfig.m_szQuestDialogCompleted || '' == questConfig.m_szQuestDialogCompleted)) {
            // 非对话任务
            if (KeyWord.QUEST_TYPE_BRANCH == questConfig.m_ucQuestType || KeyWord.QUEST_TYPE_JUANZHOU == questConfig.m_ucQuestType || KeyWord.QUEST_TYPE_TREASURE_HUNT == questConfig.m_ucQuestType) {
                // 卷轴、支线、宗门探险任务领取奖励
                if (KeyWord.GENERAL_YES != questConfig.m_ucNoPrompGetAward || EnumDoQuestFor.progressReach != doQuestFor) {
                    G.Uimgr.createForm<TaskGetAwardView>(TaskGetAwardView).open(questConfig.m_iQuestID);
                }
                return result;
            } else if (KeyWord.QUEST_TYPE_DAILY == questConfig.m_ucQuestType) {
                // 日常任务领奖励
                this.getDailyReward(questConfig.m_iQuestID);
                return result;
            }
        }

        if (needAccept || isCompleting) {
            // 接收或领取其他类型任务的奖励
            let npcId: number = needAccept ? questConfig.m_iConsignerNPCID : questConfig.m_iAwarderNPCID;
            if (npcId > 0) {
                if ((G.DataMgr.sceneData.curPinstanceID <= 0 || null != G.DataMgr.sceneData.getSceneNpcInfo(G.DataMgr.sceneData.curSceneID, npcId))) {
                    // 当前不在副本内，或者提交或领取任务的NPC就在本场景内，那么就直接寻路去NPC
                    pathRet = G.Mapmgr.findPath2NpcByQuest(questConfig.m_iQuestID, npcId, isTransport);
                    // 设置引导寻路任务的ID
                    if (PathingState.REACHED == pathRet) {
                        if (needAccept && KeyWord.QUEST_TYPE_TRUNK == questConfig.m_ucQuestType) {
                            // 主线任务如果是同一个npc就自动接
                            if (questConfig.m_iPreQuestID > 0 && QuestData.getConfigByQuestID(questConfig.m_iPreQuestID).m_iAwarderNPCID == questConfig.m_iConsignerNPCID) {
                                // 因寻路中触发QuestWalkEnd可能会自动打开TaskView，所以这里要将其关闭
                                G.ViewCacher.taskView.close();
                                this.operateOneQuestRequest(questConfig.m_iQuestID, QuestAction.accept);
                                result = AutoDoQuestResult.autoAccept;
                            }
                        }
                    }
                }
            } else {
                // 没有npc的话，直接发协议
                this.operateOneQuestRequest(questConfig.m_iQuestID, needAccept ? QuestAction.accept : QuestAction.complete);
            }
        } else {
            // 需要进副本的任务，要检查副本有没有次数
            let pid: number = QuestData.getPinstanceByQuest(questConfig);
            if (pid > 0 && Macros.PINSTANCE_ID_DIGONG != pid && pid != G.DataMgr.sceneData.curPinstanceID) {
                let pinstanceConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(pid);
                if (pinstanceConfig.m_ucEnterTimes > 0 && G.DataMgr.systemData.getPinstanceLeftTimes(pinstanceConfig) <= 0) {
                    G.TipMgr.addMainFloatTip('副本没有次数了。');
                    return result;
                }
            }

            // 根据任务节点类型决定动作
            let nodeProgress: Protocol.QuestNodeProgress = this.m_questData.getQuestDoingNodeProgress(questConfig.m_iQuestID, nodeIndex);
            let questNodeConfig: GameConfig.QuestNodeConfigCli = questConfig.m_astQuestNodeConfig[nodeProgress.m_ucQuestProgressIndex];
            if (KeyWord.QUEST_NODE_QUEST == questNodeConfig.m_ucType) {
                // 子任务，目前有对话、采集等类型
                this._autoDoQuest(questNodeConfig.m_iThingID, isTransport);
            }
            else if (KeyWord.QUEST_NODE_LEVELUP == questNodeConfig.m_ucType || KeyWord.QUEST_NODE_FIGHT_POINT == questNodeConfig.m_ucType) {
                // 提升等级和战力，打开活动对话框
                if (isFightPoint) {
                    let questGuildConfig: GameConfig.QuestGuildConfigM = this.m_questData.getTjQuest(questConfig.m_iQuestID);
                    if (questGuildConfig != null && questGuildConfig.m_iRecommendNum > 0) {
                        for (let i = 0; i < questGuildConfig.m_iRecommendNum; i++) {
                            let guideType = questGuildConfig.m_astRecommend[i].m_iType;
                            if (KeyWord.QUEST_GUILD_OPEN_ZDFB != guideType) {
                                this.processQuestLink(EnumTaskTrackLinkKey.QuestGuide, guideType, forceEnter);
                                break;
                            }
                        }
                    }
                }
            }
            else if (KeyWord.QUEST_NODE_PINSTANCE == questNodeConfig.m_ucType || KeyWord.QUEST_NODE_ENTER_PINSTANCE == questNodeConfig.m_ucType) {
                // 副本完成、进入副本
                if (questNodeConfig.m_iThingID != G.DataMgr.sceneData.curPinstanceID) {
                    G.ActionHandler.handlePinstance(questNodeConfig.m_iThingID, questNodeConfig.m_shValue);
                }
            }
            else if (KeyWord.QUEST_NODE_SJ_BOSS_KILL == questNodeConfig.m_ucType) {
                // 击杀任意世界boss
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_WORLDBOSS);
            }
            else if (KeyWord.QUEST_NODE_ZBSJ_STAGE == questNodeConfig.m_ucType) {
                // 装备收集
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
            }
            else if (KeyWord.QUEST_NODE_WORLD_CHAT == questNodeConfig.m_ucType) {
                // 世界聊天
                G.ViewCacher.chatView.open(Macros.CHANNEL_WORLD, '这个世界需要更多的伙伴！闪耀的新星在此隆重登场！求好友，求组队，求抱走！');
            }
            else if (KeyWord.QUEST_NODE_PPSTORE_SELL == questNodeConfig.m_ucType) {
                // 寄售
                G.ActionHandler.executeFunction(KeyWord.ACT_FUNCTION_JISHOU, 0, 0, EnumJiShouTab.Sell);
            }
            //剑帝遗迹直接进
            else if (KeyWord.QUEST_NODE_JDYJ1 == questNodeConfig.m_ucType) {
                let view = G.Uimgr.getSubFormByID<JuQingFuBenPanel>(PinstanceHallView, KeyWord.OTHER_FUNCTION_JQFB);
                if (null != view && view.isOpened) {
                    if (forceEnter) {
                        G.ModuleMgr.pinstanceModule.tryEnterPinstance(Macros.PINSTANCE_ID_JDYJ, questNodeConfig.m_iThingID, 0, false, false);
                    }
                } else {
                    G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_JQFB);
                    G.GuideMgr.autoJuQingFuBen = true;
                }
            }
            //打开守护女神面板
            else if (KeyWord.QUEST_NODE_SHNS == questNodeConfig.m_ucType) {
                this.doShenHuangMiJing(forceEnter);
            }
            //帝者之路就是他妈的强化副本
            else if (KeyWord.QUEST_NODE_WST == questNodeConfig.m_ucType) {
                this.doQiangHuaFuBen(questNodeConfig.m_iThingID, forceEnter);
            }
            else if (KeyWord.QUEST_NODE_ACCEPT_GUOYUN == questNodeConfig.m_ucType) {
                //领取护送任务
                G.ActionHandler.handleGuoyun();
            }
            //else if (KeyWord.QUEST_NODE_CLFB == questNodeConfig.m_ucType) {
            //    // 材料副本
            //    this.doCaiLiaoFuBen(questNodeConfig.m_iThingID, forceEnter);
            //}
            else if (KeyWord.QUEST_NODE_WYFB == questNodeConfig.m_ucType) {
                // 伙伴副本
                this.doWuYuanFuBen(questNodeConfig.m_iThingID, forceEnter);
            }
            //聚缘升级
            else if (KeyWord.QUEST_NODE_JUYUAN == questNodeConfig.m_ucType) {
                G.Uimgr.createForm<JuYuanView>(JuYuanView).open();
            }
            else if (KeyWord.QUEST_NODE_ALL_STRENG == questNodeConfig.m_ucType || KeyWord.QUEST_NODE_ONE_STRENG == questNodeConfig.m_ucType) {
                G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE);
            }
            else if (KeyWord.QUEST_NODE_HORSE_LAYER == questNodeConfig.m_ucType) {
                G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.HERO_SUB_TYPE_ZUOQI);
            }
            else if (KeyWord.QUEST_NODE_LINGBAO_LAYER == questNodeConfig.m_ucType) {
                G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.HERO_SUB_TYPE_JINGLING);
            }
            else if (KeyWord.QUEST_NODE_LINGYU_LAYER == questNodeConfig.m_ucType) {
                G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.HERO_SUB_TYPE_FAZHEN);
            }
            else if (KeyWord.QUEST_NODE_ZUJI_LAYER == questConfig.m_ucQuestType) {
                G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.HERO_SUB_TYPE_LEILING);
            }
            else if (KeyWord.QUEST_NODE_WEAPON_LAYER == questNodeConfig.m_ucType) {
                G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.HERO_SUB_TYPE_WUHUN);
            }
            else if (KeyWord.QUEST_NODE_WING_LAYER == questNodeConfig.m_ucType) {
                //G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.HERO_SUB_TYPE_YUYI);
                G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN);
            }
            else if (KeyWord.QUEST_NODE_BEAUTY_EQUIP == questNodeConfig.m_ucType ||
                KeyWord.QUEST_NODE_PET_EQUIP_NUM == questNodeConfig.m_ucType) {
                // 伙伴装备
                G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_JINJIE);
            }
            else if (KeyWord.QUEST_NODE_FMT == questNodeConfig.m_ucType) {
                let fengmotaView = G.Uimgr.getForm<FengMoTaView>(FengMoTaView);
                if (null != fengmotaView && fengmotaView.isOpened) {
                    if (forceEnter) {
                        G.ActionHandler.goToFmtLayer(1);
                    }
                } else {
                    G.Uimgr.createForm<FengMoTaView>(FengMoTaView).open();
                    G.GuideMgr.autoFengMoTa = true;
                }
            }
            else if (KeyWord.QUEST_NODE_ACT_PET == questNodeConfig.m_ucType) {
                // 伙伴激活 不去伙伴界面了
                //跳转到伙伴副本
                G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_WYFB);

                //// 伙伴激活
                //let petInfo = G.DataMgr.petData.getPetInfo(questNodeConfig.m_iThingID);
                //if (null != petInfo && Macros.GOD_LOAD_AWARD_WAIT_GET == petInfo.m_ucStatus) {
                //    // 可以激活了，弹开伙伴面板哦
                //    G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_JINJIE, questNodeConfig.m_iThingID);
                //} else {
                //    // 打开地宫boss
                //    G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_DI_BOSS);
                //}
            }
            else {
                // 杀怪节点或采集节点、道具使用、副本完成
                let questNav: GameConfig.NavigationConfigM = G.DataMgr.sceneData.getQuestNav(questConfig.m_iQuestID, nodeProgress.m_ucQuestProgressIndex);
                if (null != questNav) {
                    let processed = false;
                    if (KeyWord.QUEST_NODE_FMT_RANDOM == questNodeConfig.m_ucType) {
                        // 黑洞塔杀任意怪，如果不在对应场景里，则直接飞过去
                        if (questNav.m_iSceneID != G.DataMgr.sceneData.curSceneID) {
                            let fmtCfg = G.DataMgr.fmtData.getFmtCfgBySceneId(questNav.m_iSceneID);
                            if (null != fmtCfg) {
                                G.ActionHandler.goToFmtLayer(fmtCfg.m_iLayer, 0, questConfig.m_iQuestID);
                                processed = true;
                            }
                        }
                    }

                    if (!processed) {
                        // 需要寻路，则直接寻路过去
                        pathRet = G.Mapmgr.findPath2TargetByQuest(questConfig.m_iQuestID, nodeProgress.m_ucQuestProgressIndex, isTransport);
                        // 设置引导寻路任务的ID
                        if (PathingState.CANNOT_REACH == pathRet) {
                            G.TipMgr.addMainFloatTip('无法寻路到指定位置');
                            uts.log('任务寻路失败，questID = ' + questConfig.m_iQuestID);
                        }
                    }
                }
                else {
                    // 不需要寻路，则直接进行
                    this.onQuestWalkEnd(questConfig.m_iQuestID, nodeProgress.m_ucQuestProgressIndex);
                }
            }
        }

        return result;
    }

    /**
     * 任务寻路完成后的处理。
     * @param questID
     * @param nodeIndex
     * @param checkDistance 是否校验当前位置和寻路表间的距离。
     *
     */
    onQuestWalkEnd(questID: number, nodeIndex: number = -1, checkDistance: boolean = true): boolean {
        let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(questID);
        if (!this.m_questData.isQuestInDoingList(questConfig.m_iQuestID)) {
            // 还没接取该任务，先接取
            // 校验NPC距离
            if (!this.isNearNpcByID(questConfig.m_iConsignerNPCID)) {
                return false;
            }

            G.DataMgr.runtime.resetAllBut();

            if (KeyWord.QUEST_TYPE_GUO_YUN == questConfig.m_ucQuestType) {
                G.Uimgr.createForm<BoatView>(BoatView).open();
            }
            else {
                G.ViewCacher.taskView.open(EnumTaskViewType.quest, questConfig.m_iConsignerNPCID, 0, NPCQuestState.receive, questID);
            }
            return true;
        }
        else if (this.m_questData.isQuestCompletingByID(questConfig.m_iQuestID)) {
            // 所有节点已经完成了，交任务
            // 校验NPC距离
            if (!this.isNearNpcByID(questConfig.m_iAwarderNPCID)) {
                return false;
            }

            G.DataMgr.runtime.resetAllBut();

            G.ViewCacher.taskView.open(EnumTaskViewType.quest, questConfig.m_iAwarderNPCID, 0, NPCQuestState.complete, questID);
            return true;
        }

        // 处理杀怪相关，如果是杀怪任务则自动寻路到怪物位置
        let nodeProgress: Protocol.QuestNodeProgress = this.m_questData.getQuestDoingNodeProgress(questID, nodeIndex); // 获取任务的完成度
        if (null == nodeProgress) {
            return false;
        }

        questConfig = QuestData.getConfigByQuestID(questID);
        let nodeConfig: GameConfig.QuestNodeConfigCli = questConfig.m_astQuestNodeConfig[nodeProgress.m_ucQuestProgressIndex];
        if (null == nodeConfig) //在已接任务中没有找到正在做的任务进度
        {
            return false;
        }

        // 校验目的地距离
        if (checkDistance && (KeyWord.QUEST_NODE_MONSTER == nodeConfig.m_ucType || KeyWord.QUEST_NODE_MONSTER_SHARE == nodeConfig.m_ucType || KeyWord.QUEST_NODE_COLLECT == nodeConfig.m_ucType ||
            KeyWord.QUEST_NODE_COLLECT_SHARE == nodeConfig.m_ucType)) {
            let navConfig: GameConfig.NavigationConfigM = G.DataMgr.sceneData.getQuestNav(questID, nodeProgress.m_ucQuestProgressIndex);
            if (null != navConfig) {
                if (navConfig.m_iSceneID != G.DataMgr.sceneData.curSceneID) {
                    // 不是目的场景
                    return false;
                }
            }
        }

        G.DataMgr.runtime.resetAllBut();

        if (KeyWord.QUEST_NODE_MONSTER == nodeConfig.m_ucType || KeyWord.QUEST_NODE_MONSTER_SHARE == nodeConfig.m_ucType || KeyWord.QUEST_NODE_COLLECT == nodeConfig.m_ucType || KeyWord.QUEST_NODE_COLLECT_SHARE == nodeConfig.m_ucType) {
            // 杀怪或采集节点，自动开启自动战斗或自动采集
            let monsterID: number = this.m_questData.getMonsterIDByQuestNode(questID, nodeIndex);
            if (monsterID > 0) {
                // 判断是普通怪还是采集物
                G.ModuleMgr.deputyModule.startEndHangUp(true, monsterID, EnumMonsterRule.onlySpecified);
            }
            else {
                if (defines.has('_DEBUG')) {
                    uts.assert(false, '本任务无法获取对应的怪物：' + questID + '|' + nodeIndex);
                }
            }
        }
        else if (KeyWord.QUEST_NODE_FMT_RANDOM == nodeConfig.m_ucType) {
            G.ModuleMgr.deputyModule.startEndHangUp(true, -1);
        }
        else if (KeyWord.QUEST_NODE_FMT_RANDOM_BOSS == nodeConfig.m_ucType) {
            G.Uimgr.createForm<BossView>(BossView).open(KeyWord.ACT_FUNCTION_FMT);
        }
        else {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '不受支持的任务节点：' + nodeConfig.m_szWord);
            }
        }
        return true;
    }

    /**
	* 校验与指定NPC之间的距离。
	* @param id 指定NPC的ID。
	* @return
	*
	*/
    private isNearNpcByID(id: number): boolean {
        let npcInfo = G.UnitMgr.getNpcInfo(id);
        if (null == npcInfo || UnityEngine.Vector2.Distance(this.Hero.getPixelPosition(), new UnityEngine.Vector2(npcInfo.x, npcInfo.y)) > Constants.CAST_DISTANCE) {
            return false;
        }

        return true;
    }

    ///////////////////////////////////////// 任务操作 /////////////////////////////////////////

    /**
     * 点击了任务追踪上的超链接事件的响应函数。
     * @param event
     *
     */
    processQuestLink(key: EnumTaskTrackLinkKey, param: number, forceEnter: boolean): void {
        if (EnumTaskTrackLinkKey.LiJiWanCheng == key) {
            this.processLjwc(param);
        } else if (EnumTaskTrackLinkKey.QuestGuide == key) {
            if (param == KeyWord.QUEST_GUILD_FMTGJ) {
                G.Uimgr.createForm<FengMoTaView>(FengMoTaView).open();
            }
            else if (param == KeyWord.QUEST_GUILD_BAOQUAN_ITEM) {
                G.Mapmgr.findPath2Npc(NPCID.Wangrong, false, 0, true);
            }
            else if (param == KeyWord.QUEST_GUILD_BAOQUAN_QUEST) {
                this.doGetJuanZhouQuest(true, 175);
            }
            else if (param == KeyWord.QUEST_GUILD_OPEN_CHARGE) {
                if (!G.DataMgr.firstRechargeData.isNotShowFirstRechargeIcon()) {
                    G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
                }
            }
            else if (param == KeyWord.QUEST_GUILD_OPEN_DZZL) {
                this.doQiangHuaFuBen(1, forceEnter);
            }
            else if (param == KeyWord.QUEST_GUILD_OPEN_SHMJ) {
                this.doShenHuangMiJing(forceEnter);
            }
            else if (param == KeyWord.QUEST_GUILD_OPEN_ZDFB) {
                G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_ZDFB);
            }
            else if (param == KeyWord.QUEST_GUILD_OPEN_LEVELGUIDE) {
                G.ViewCacher.LevelGuideTipView.open(param);
            } else if (param == KeyWord.QUEST_GUILD_OPEN_FIGHT_GUIDE) {
                G.ViewCacher.LevelGuideTipView.open(param);
            }else {
                this.doQuestOrGotoFmt(-1);
            }
        }
    }

    private doQiangHuaFuBen(layer: number, forceEnter: boolean) {
        let view = G.Uimgr.getSubFormByID<DiZheZhiLuPanel>(PinstanceHallView, KeyWord.OTHER_FUNCTION_DZZL);
        if (null != view && view.isOpened) {
            if (forceEnter) {
                G.ModuleMgr.pinstanceModule.tryEnterQiangHuaFuBen(layer);
            }
        } else {
            G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_DZZL);
            G.GuideMgr.autoQiangHuaFuBen = true;
        }
    }

    private doShenHuangMiJing(forceEnter: boolean) {
        let view = G.Uimgr.getSubFormByID<ShenHuangMiJingPanel>(PinstanceHallView, KeyWord.OTHER_FUNCTION_SHMJ);
        if (null != view && view.isOpened) {
            if (forceEnter) {
                G.ModuleMgr.pinstanceModule.tryEnterShenHuangMiJing();
            }
        } else {
            G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_SHMJ);
            G.GuideMgr.autoShenHuangMiJing = true;
        }
    }

    //private doCaiLiaoFuBen(diff: number, forceEnter: boolean) {
    //    let view = G.Uimgr.getSubFormByID<CaiLiaoFuBenPanel>(PinstanceHallView, KeyWord.OTHER_FUNCTION_CLFB);
    //    if (null != view && view.isOpened) {
    //        if (forceEnter) {
    //            G.ModuleMgr.pinstanceModule.tryEnterCaiLiaoFuBen(Macros.PINSTANCE_ID_CAILIAO, diff);
    //        }
    //    } else {
    //        G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_CLFB, diff);
    //        G.GuideMgr.autoCaiLiaoFuBen = true;
    //    }
    //}

    private doWuYuanFuBen(diff: number, forceEnter: boolean) {
        let view = G.Uimgr.getSubFormByID<WuYuanFuBenPanel>(PinstanceHallView, KeyWord.OTHER_FUNCTION_WYFB);
        if (null != view && view.isOpened) {
            if (forceEnter) {
                G.ModuleMgr.pinstanceModule.tryEnterWuYuanFuBen(diff);
            }
        } else {
            G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_WYFB);
            G.GuideMgr.autoWuYuanFuBen = true;
        }
    }

    private processLjwc(questId: number) {
        let questConfig = QuestData.getConfigByQuestID(questId);
        if (questConfig.m_ucQuestType == KeyWord.QUEST_TYPE_JUANZHOU) {
            this.processJuanzhouLjwc();
        }
        else {
            let leftTime: number = this.m_questData.getMaxCntByQuestType(questConfig.m_ucQuestType) - this.m_questData.getFinishedCntByQuestType(questConfig.m_ucQuestType);
            G.TipMgr.showConfirm(uts.format('是否花费{0}钻石，完成剩余{1}环任务？', TextFieldUtil.getColorText((leftTime * Constants.QUEST_GOLDEN).toString(), Color.GREEN), TextFieldUtil.getColorText(leftTime.toString(), Color.GREEN)), ConfirmCheck.withCheck,
                '确定|取消', delegate(this, this.onQuickOnekeyComplete, leftTime * Constants.QUEST_GOLDEN, questConfig.m_ucQuestType));
        }
    }

    processJuanzhouLjwc(): void {
        let cost: number = G.DataMgr.constData.getValueById(KeyWord.PARAMETER_FMBJ_ONEKEY_PRICE);
        if (!this.m_isCheckSelected) {
            G.TipMgr.showConfirm(uts.format('是否花费{0}立即完成任务？', TextFieldUtil.getYuanBaoText(cost)), ConfirmCheck.withCheck, '确定|取消',
                delegate(this, this.onQuickOnekeyComplete, cost, KeyWord.QUEST_TYPE_JUANZHOU)
            );
        }
        else {
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getQuestPanelRequest(KeyWord.QUEST_TYPE_JUANZHOU, Macros.QUESTPANEL_QUICK_ONEKEY_COMPLETE, 0));
            }
        }
    }

    private onQuickOnekeyComplete(state: MessageBoxConst, isCheckSelected: boolean, cost: number, type: number): void {
        if (MessageBoxConst.yes == state) {
            this.m_isCheckSelected = isCheckSelected;
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                this.needAutoShowLoopReward[type] = true;
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getQuestPanelRequest(type, Macros.QUESTPANEL_QUICK_ONEKEY_COMPLETE, 0));
            }
        }
    }

    processQuestJdy(questID: number, nodeIndex: number): AutoDoQuestResult {
        G.ActionHandler.beAGoodBaby(false, true, false, true, false);
        G.DataMgr.runtime.pickQuestID = questID;
        return this._autoDoQuest(questID, true, nodeIndex);
    }

    doQuestByType(type: number = 0, isTransport: boolean = false): void {
        if (0 == type) {
            // 不指定任务类型
            G.DataMgr.runtime.pickQuestID = 0;
            this._autoDoQuest(0, isTransport);
        }
        else {
            let qp = this.m_questData.getDoingQuestByType(type);
            if (null != qp) {
                this.tryAutoDoQuest(qp.m_iQuestID, isTransport);
            } else {
                if (KeyWord.QUEST_TYPE_GUILD_DAILY == type) {
                    // 检查是否可以做宗门任务
                    if (G.DataMgr.heroData.guildId <= 0) {
                        // 打开宗门查询
                        G.Uimgr.createForm<GuildView>(GuildView).open();
                        G.TipMgr.addMainFloatTip('您还没加入任何宗门，无法做宗门任务。');
                        return;
                    }

                    if (this.m_questData.canAcceptGuild(NPCID.guildQuestNpc, G.DataMgr.heroData, true, true, false)) {
                        G.DataMgr.runtime.pickQuestID = this.m_questData.nextGuildQuestID;
                        this._autoDoQuest(this.m_questData.nextGuildQuestID, isTransport);
                    }
                }
                else if (KeyWord.QUEST_TYPE_JUANZHOU == type) {
                    // 卷轴任务
                    if (this.m_questData.canAcceptJuanzhou(true, true)) {
                        this.doGetJuanZhouQuest(true, 173);
                    }
                }
                else if (KeyWord.QUEST_TYPE_GUO_YUN == type) {
                    // 国运任务，传送过去打开国运对话框
                    if (this.m_questData.canAcceptShip(this.m_questData.guoyunConsignerNpcID, G.DataMgr.heroData, true, true, true)) {
                        this.tryAutoDoQuest(this.m_questData.nextGuoYunQuestID, isTransport);
                    }
                }
                else {
                    if (defines.has('_DEBUG')) {
                        uts.assert(false, '不支持的任务类型:' + type);
                    }
                }
            }
        }
    }

    /**
     * 新功能开启后接着做下一个任务。
     * @param newFunc 新开启的功能。
     *
     */
    continueAfterGuide(questID: number, isTransport: boolean = false, nodeIndex: number = -1) {
        if (G.DataMgr.runtime.isWaitTransprotResponse) {
            // 正在等切场景
            return;
        }
        let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(questID);
        if ((questID > 0 && this.m_questData.isQuestCompleted(questID)) ||
            (KeyWord.QUEST_TYPE_GUO_YUN == questConfig.m_ucQuestType && this.m_questData.isQuestInDoingList(questID))) {
            // 任务已完成，接着做下一个
            // 如果是完成了国运任务，也做下一个，否则如果第一次接国运任务完成后触发了引导，完成引导后悔继续去做这个国运任务
            // 就会导致去寻路到纯梦了
            this._autoDoNext(questConfig.m_iQuestID, questConfig.m_iAwarderNPCID);
        }
        else if (G.DataMgr.sceneData.curPinstanceID == 0) {
            // 任务没完成继续做
            this._autoDoQuest(questID, isTransport, nodeIndex);
        }
    }

    /**
     * 在副本里面要交任务的话，得等出了副本才能寻路。o
     * @param sceneID
     *
     */
    onEnterSceneComplete(hasChangeScene: boolean): void {
        // 根据任务检查是否需要创建前台怪
        this.checkClientMonster();

        if (!G.ActionHandler.checkCrossSvrUsable(false)) {
            return;
        }
        let changeScene = G.DataMgr.runtime.changeScene;
        if (hasChangeScene && ChangeScene.LEAVE_PINSTANCE == changeScene.type) {
            // 离开副本，检查是否需要提示获得角色装备
            G.GuideMgr.onLeavePinstance();

            // 出了封神台之后需要弹开封神台对话框，此时不继续做任务
            if (Macros.PINSTANCE_ID_WORLDBOSS == changeScene.pinstanceId) {
                // 世界boss
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_WORLDBOSS);
                return;
            }

            if (Macros.PINSTANCE_ID_VIP == changeScene.pinstanceId) {
                //出了VIPBoss副本还要打开VIPBoss面板
                G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_VIP_BOSS);
                return;
            }

            if (Macros.PINSTANCE_ID_PRIVATE_BOSS == changeScene.pinstanceId) {
                // 个人boss
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS);
                if (!G.DataMgr.runtime.needLand) {
                    this._checkContinueQuest();
                }
                return;
            }
            if (Macros.PINSTANCE_ID_DIGONG == changeScene.pinstanceId) {
                //地宫重新拉面板数据
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFXYACT, Macros.ACTIVITY_FMT_LIST));
                return;
            }
            //if (Macros.PINSTANCE_ID_WYYZ == changeScene.pinstanceId) {
            //    // 伙伴远征
            //    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_PET_EXPEDITION);
            //    return;
            //}
            if (Macros.PINSTANCE_ID_PVP == changeScene.pinstanceId) {
                // 神力榜
                G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNCTION_TIANMINGBANG);
                G.MainBtnCtrl.changeState(true, false);
                return;
            }
            //特权副本
            //let index = PinstanceIDUtil.TeQuanFuBenIDs.indexOf(changeScene.pinstanceId);
            //if (index >= 0) {
            //    G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_ZRJT, index);
            //    return;
            //}

            //出了落日森林，请求更新数据处理红点
            if (changeScene.pinstanceId == Macros.PINSTANCE_ID_FOREST_BOSS) {
                //落日森林数据请求
                // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_FOREST_BOSS, Macros.ACTIVITY_FOREST_BOSS_OPEN));
                G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_WOODS_BOSS);
                return;
            }

            if (changeScene.pinstanceId == Macros.PINSTANCE_ID_CROSS_PVP) {
                // 出了封神台之后需要弹开封神台对话框，此时不继续做任务
                G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNCTION_TIANMINGBANG);
                return;
            }
            if (PinstanceIDUtil.isKf3v3(changeScene.pinstanceId)) {
                // 跨服3v3
                G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNCTION_CROSS3V3);
                return;
            }
            if (PinstanceIDUtil.isJuYuan(changeScene.pinstanceId)) {
                // 出了神力挑战场景，还需打开神力界面
                G.Uimgr.createForm<JuYuanView>(JuYuanView).open();
                return;
            }
            if (PinstanceIDUtil.isMinWenShiLian(changeScene.pinstanceId)) {
                // 出了宝石试炼场景，还需打开宝石试炼界面
                G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_MWSL);
                return;
            }
            if (PinstanceIDUtil.isKfjdc(changeScene.pinstanceId)) {
                // 出了比武大会，还需打开比武大会界面
                G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNCTION_BIWUDAHUI);
                return;
            }
            if (PinstanceIDUtil.isZuDuiFuBen(changeScene.pinstanceId)) {
                // 出了组队副本，还需打开组队副本界面
                G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_ZDFB);
                return;
            }
            if (Macros.PINSTANCE_ID_HOME_BOSS == changeScene.pinstanceId) {
                //离开boss之家还要打开boss之家面板
                G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_ZYCM_HOME_BOSS);
                return;
            }

            if (Macros.PINSTANCE_ID_SXZL == changeScene.pinstanceId) {
                // 出了神选之路副本
                if (G.DataMgr.pinstanceData.isOpenSXZL_Panel) {
                    G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_SXZL);
                } else {
                    //检查引导
                    G.DataMgr.funcLimitData.updateFuncStates();
                    G.GuideMgr._checkNewFunc();
                }
                if (!G.DataMgr.runtime.needLand) {
                    this._checkContinueQuest();
                }
                return;
            }
            if (Macros.PINSTANCE_ID_WYFB == changeScene.pinstanceId) {
                // 出了伙伴副本，如果不是正在做伙伴副本的任务，则继续弹出面板
                let qp = this.m_questData.getDoingProgressByNodeType(KeyWord.QUEST_NODE_WYFB);
                if (null == qp) {
                    G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_WYFB);
                    if (!G.DataMgr.runtime.needLand) {
                        this._checkContinueQuest();
                    }
                    return;
                }
            }
            if (PinstanceData.isCaiLiaoFuBen(changeScene.pinstanceId)) {
                // 出了材料副本，如果不是正在做材料副本的任务，则继续弹出面板
                let qp = this.m_questData.getDoingProgressByNodeType(KeyWord.QUEST_NODE_CLFB);
                if (null == qp) {
                    G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_CLFB);
                    return;
                }
            }
            if (Macros.PINSTANCE_ID_HLSL == changeScene.pinstanceId) {
                G.MapCamera.endScreenDarkness();
                // 出了虚拟副本
                //G.Uimgr.createForm<HunLiView>(HunLiView).open(KeyWord.OTHER_FUNCTION_ZHUANSHENG);
                //处理屏幕特效
                G.MapCamera.endScreenDarkness();
                G.ViewCacher.mainView.showDenseFog(0.8);
                return;
            }
        }
        if (MapId.isLuori()){
            G.ModuleMgr.deputyModule.startEndHangUp(true);
        }
        if (!G.DataMgr.runtime.needLand) {
            this._checkContinueQuest();
        }
    }

    private _checkContinueQuest(): void {
        let runtime = G.DataMgr.runtime;
        let questID: number = runtime.questID;
        if (runtime.waitQuest.questSceneId > 0) {
            runtime.resetAllBut();
            if (!G.GuideMgr.processOperateQuest(questID, false)) {
                this._autoDoQuest(questID);
            }
            return;
        }

        if ((ChangeScene.ENTER_PINSTANCE == runtime.changeScene.type || ChangeScene.LEAVE_PINSTANCE == runtime.changeScene.type) &&
            runtime.waitQuest.questPinstanceId == runtime.changeScene.pinstanceId) {
            runtime.resetAllBut();
            if (!G.GuideMgr.processOperateQuest(questID, false)) {
                this._autoDoQuest(questID);
            }
            return;
        }

        if (runtime.itemTransport.questID > 0 || runtime.itemTransport.targetID > 0 || runtime.itemTransport.startBattle) {
            // 处理筋斗云相关
            G.Mapmgr.processAfterItemTransport();
        }
        else if (ChangeScene.LEAVE_PINSTANCE == runtime.changeScene.type) {
            // 最后只能继续做主线任务了我艹
            // 先找正在做的，排除掉还没完成的升级类的主线任务我艹
            let questList: GameConfig.QuestConfigM[] = this.m_questData.getDoingQuestByNpc(0, 0, true, true, KeyWord.QUEST_TYPE_TRUNK);
            if (questList.length > 0) {
                if (!G.GuideMgr.processOperateQuest(questList[0].m_iQuestID, false)) {
                    this._autoDoQuest(questList[0].m_iQuestID, false, -1);
                }
                return;
            }

            // 没有的话再找可以接的主线任务我艹艹艹
            let canAcceptTrunk = this.m_questData.getAcceptableTrunk(G.DataMgr.heroData);
            if (canAcceptTrunk) {
                if (!G.GuideMgr.processOperateQuest(canAcceptTrunk.m_iQuestID, false)) {
                    this._autoDoQuest(canAcceptTrunk.m_iQuestID, false, -1);
                }
                return;
            }
        }
    }

    onFirstEnterScene() {
        if (this.m_questData.isQuestDataReady) {
            this.onHeroUpgrade();
        }
    }

    /**
     * 角色升级事件的响应函数。
     * @param level
     *
     */
    onHeroUpgrade() {
        let level = G.DataMgr.heroData.level;
        if (this.oldHeroLv > 0 && this.oldHeroLv < this.m_questData.shipMinLv && level >= this.m_questData.shipMinLv) {
            // 可以开启国运任务
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getListProgressResquestMsg());
        }
        this.oldHeroLv = level;

        this.checkAutoAccpetBranch();

        let qp: Protocol.QuestProgress = this.m_questData.getDoingQuestByType(KeyWord.QUEST_TYPE_TRUNK);
        if (level < 65 && qp != null && this.m_questData.isQuestCompleting(qp)) {
            let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(qp.m_iQuestID);
            if ((questConfig.m_astQuestNodeConfig[0].m_ucType == KeyWord.QUEST_NODE_LEVELUP || questConfig.m_astQuestNodeConfig[0].m_ucType == KeyWord.QUEST_NODE_FIGHT_POINT) && G.DataMgr.sceneData.curPinstanceID == 0 && G.DataMgr.heroData.guoyunLevel == 0) {
                this._autoDoQuest(qp.m_iQuestID);
            }
        }
    }

    private checkAutoAccpetBranch() {
        // 自动接取支线任务
        let branchQuests = this.m_questData.getAcceptableBranch(G.DataMgr.heroData);
        for (let oneQuest of branchQuests) {
            this.operateOneQuestRequest(oneQuest.m_iQuestID, QuestData.EQA_Accept);
        }
    }

    /**
     * 做任务或者去黑洞塔挂机
     * @param qid -1表示自动选择任务
     */
    doQuestOrGotoFmt(qid: number) {
        if (-1 == qid) {
            qid = this.pickBestQuest();
        }

        if (qid > 0) {
            G.ModuleMgr.questModule.tryAutoDoQuest(qid, false, true);
        } else {
            // 没有任务做则去离线挂机点挂机
            let dataMgr = G.DataMgr;
            let guajiCfg = dataMgr.systemData.getGuaJiCfg(dataMgr.heroData.level);
            if (guajiCfg) {
                G.Mapmgr.goToPos(guajiCfg.m_iSceneID, guajiCfg.m_iPositionX, guajiCfg.m_iPositionY, false, false, FindPosStrategy.Specified, guajiCfg.m_iMonsterID, true);
            }
        }
    }

    pickBestQuest(): number {
        let progressList: Protocol.QuestProgress[] = this.m_questData.getDoingQuestList();
        let canDoList: Protocol.QuestProgress[] = new Array<Protocol.QuestProgress>();
        for (let qp of progressList) {
            let questConfig = QuestData.getConfigByQuestID(qp.m_iQuestID);
            // 排除掉升级类还有穿伙伴装备的任务和组队副本
            if (1 == questConfig.cannotAutoRunNode || 1 == questConfig.isTeamFbNode) {
                continue;
            }

            if (questConfig.m_ucQuestType == KeyWord.QUEST_TYPE_GUO_YUN) {
                // 国运拖着车子跑得慢，当然是优先做国运啊
                return questConfig.m_iQuestID;
            }
            canDoList.push(qp);
        }

        // 再找可以接的主线任务，如果已经接了主线，那么是没有可以接的主线的
        let canAcceptTrunk = this.m_questData.getAcceptableTrunk(G.DataMgr.heroData);
        if (canAcceptTrunk) {
            return canAcceptTrunk.m_iQuestID;
        }

        // 否则接着做当前已经接了的
        if (canDoList.length > 0) {
            // 先按优先级进行排序
            canDoList.sort(delegate(this, this.sortCanDoQuests));
            // 提示做任务
            return canDoList[0].m_iQuestID;
        }

        return 0;
    }

    private sortCanDoQuests(qpa: Protocol.QuestProgress, qpb: Protocol.QuestProgress): number {
        let a: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(qpa.m_iQuestID);
        let b: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(qpb.m_iQuestID);

        if (a.m_ucQuestType != b.m_ucQuestType) {
            // 任务类型不同的情况下，主线任务优先
            if (KeyWord.QUEST_TYPE_TRUNK == a.m_ucQuestType) {
                return -1;
            }
            else if (KeyWord.QUEST_TYPE_TRUNK == b.m_ucQuestType) {
                return 1;
            }
        }

        // 其次可以去交任务的优先
        if (this.m_questData.isQuestCompletingByID(a.m_iQuestID)) {
            return -1;
        }
        else if (this.m_questData.isQuestCompletingByID(b.m_iQuestID)) {
            return 1;
        }
        // 再者已经做了一部分的优先
        let isHalfA: boolean = qpa.m_astNodeProgress[0].m_shProgressValue > 0;
        let isHalfB: boolean = qpb.m_astNodeProgress[0].m_shProgressValue > 0;
        if (isHalfA != isHalfB) {
            return isHalfA ? -1 : 1;
        }
        // 最后只能按照任务类型来排了
        return QuestData.COMMON_TYPES.indexOf(a.m_ucQuestType) - QuestData.COMMON_TYPES.indexOf(b.m_ucQuestType);
    }

    ///////////////////////////////////////// 前台怪 /////////////////////////////////////////

    /**
     * 检查是否需要创建前台怪。
     *
     */
    private checkClientMonster(): void {
        let sceneData: SceneData = G.DataMgr.sceneData;
        if (!sceneData.isEnterSceneComplete) {
            // 未进入场景不处理
            return;
        }
        let doingList: Protocol.QuestProgress[] = this.m_questData.getDoingQuestList();
        if (null == doingList) {
            return;
        }
        let len: number = doingList.length;
        let qp: Protocol.QuestProgress;
        let qnp: Protocol.QuestNodeProgress;
        let questConfig: GameConfig.QuestConfigM;
        let qnCfg: GameConfig.QuestNodeConfigCli;
        let clientMonsterConfigs: GameConfig.ClientMonsterConfigM[];
        for (let i: number = 0; i < len; ++i) {
            qp = doingList[i];
            qnp = this._getDoingClientMonsterNodePgs(qp);
            if (null == qnp) {
                continue; // 没有正在进行的前台怪任务
            }
            questConfig = QuestData.getConfigByQuestID(qp.m_iQuestID);
            qnCfg = questConfig.m_astQuestNodeConfig[0];
            clientMonsterConfigs = MonsterData.getClientMonsters(qnCfg.m_iThingID);
            // 查看是否当前场景
            if (sceneData.curSceneID == clientMonsterConfigs[0].m_iSceneID) {
                G.UnitMgr.createClientMonsters(clientMonsterConfigs, qp.m_iQuestID, qnCfg.m_shValue);
            }
        }
    }

    /**
     * 更新前台怪击杀数量。
     * @param monsterID
     *
     */
    updateClientMonsterCnt(monsterID: number): void {
        let oldCnt = this.m_clientMonsterCntMap[monsterID];
        if (undefined == oldCnt) {
            oldCnt = 0;
        }
        this.m_clientMonsterCntMap[monsterID] = oldCnt + 1;
        // 检查是否有任务可以完成
        let doingList: Protocol.QuestProgress[] = this.m_questData.getDoingQuestList();
        let len: number = doingList.length;
        let qp: Protocol.QuestProgress;
        let qnp: Protocol.QuestNodeProgress;
        let newProgress: Protocol.QuestProgress[];
        for (let i: number = 0; i < len; ++i) {
            qp = doingList[i];
            qnp = this._getDoingClientMonsterNodePgs(qp);
            if (null == qnp) {
                // 没有正在进行的前台怪任务
                continue;
            }
            // 这里需要制作一个拷贝，否则任务虽更新了但不会继续自动做
            qp = uts.deepcopy(qp) as Protocol.QuestProgress;
            qp.m_astNodeProgress[qnp.m_ucQuestProgressIndex].m_shProgressValue = this.m_clientMonsterCntMap[monsterID];
            if (null == newProgress) {
                newProgress = new Array<Protocol.QuestProgress>();
            }
            newProgress.push(qp);
        }

        if (null != newProgress) {
            let body: Protocol.UpdateProgress_Notify = {} as Protocol.UpdateProgress_Notify;
            body.m_stQuestProgress = newProgress;
            body.m_ucQuestNumber = newProgress.length;
            body.m_uiDailyQuestID = 0;
            body.m_uiResultID = ErrorId.EQEC_Success;
            this._updateQuestProgressNotify(body);
        }
    }

    private _getDoingClientMonsterNodePgs(qp: Protocol.QuestProgress): Protocol.QuestNodeProgress {
        if (this.m_questData.isQuestCompleting(qp)) {
            // 已完成的不管
            return null;
        }
        let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(qp.m_iQuestID);
        let qnCfg: GameConfig.QuestNodeConfigCli = questConfig.m_astQuestNodeConfig[0];
        if (KeyWord.QUEST_NODE_MONSTER != qnCfg.m_ucType || KeyWord.MONSTER_TYPE_DECORATE != MonsterData.getMonsterConfig(qnCfg.m_iThingID).m_bDignity) {
            return null;
        }
        let qnp: Protocol.QuestNodeProgress = this.m_questData.getQuestDoingNodeProgress(qp.m_iQuestID, 0);
        if (null == qnp) {
            return null;
        }

        return qnp;
    }

    ///////////////////////////////////////// UI 管理 /////////////////////////////////////////

    /**
     * 显示传送对话框。
     *
     */
    private _showTransportDialog(questConfig: GameConfig.QuestConfigM): void {
        uts.assert(1 == questConfig.m_ucQuestNodeNumber, '只有单节点的任务才支持坐飞机：' + questConfig.m_iQuestID);
        if (questConfig.m_iQuestID == 1001030) {
            G.LoadingAnimPlayer.runAnim(1001030, delegate(this, this.onLoadLoadingAnim, questConfig), delegate(this, this.onPlayOverLoadingAnim));
        }
        else {
            let desc = '前方出现一道星沙裂痕，可以传送至';

            let nodeConfig: GameConfig.QuestNodeConfigCli = questConfig.m_astQuestNodeConfig[0];
            if (KeyWord.QUEST_NODE_DIALOG == nodeConfig.m_ucType) {
                // 对话节点，那么这个任务是直接完成的，就是飞去提交任务的NPC那里
                desc += TextFieldUtil.getColorText(NPCData.getNpcConfig(questConfig.m_iAwarderNPCID).m_szNPCName, '00cc33');
                desc += '身边。';
            }
            else if (KeyWord.QUEST_NODE_MONSTER == nodeConfig.m_ucType || KeyWord.QUEST_NODE_MONSTER_SHARE == nodeConfig.m_ucType ||
                KeyWord.QUEST_NODE_COLLECT == nodeConfig.m_ucType || KeyWord.QUEST_NODE_COLLECT_SHARE == nodeConfig.m_ucType) {
                // 杀怪
                desc += TextFieldUtil.getColorText(MonsterData.getMonsterConfig(nodeConfig.m_iThingID).m_szMonsterName, 'ff0000');
                desc += '旁边。';
            }
            else {
                uts.assert(false, '这个任务无法支持坐飞机：' + questConfig.m_iQuestID);
            }
            G.TipMgr.showConfirm(desc, ConfirmCheck.withCheck, '传送', delegate(this, this.onTipConfirmClick, questConfig), Constants.AutoDoTimeout, 0);
        }
    }
    private onLoadLoadingAnim(quest: GameConfig.QuestConfigM) {
        this.onTipConfirmClick(MessageBoxConst.yes, false, quest);
    }
    private onPlayOverLoadingAnim() {

    }

    private onTipConfirmClick(state: MessageBoxConst, isCheckSelected: boolean, questConfig: GameConfig.QuestConfigM) {
        this.noPrompFly = isCheckSelected;
        let nodeConfig: GameConfig.QuestNodeConfigCli = questConfig.m_astQuestNodeConfig[0];

        let navConfig: GameConfig.NavigationConfigM;
        if (KeyWord.QUEST_NODE_DIALOG == nodeConfig.m_ucType) {
            // 对话节点，那么这个任务是直接完成的，就是飞去提交任务的NPC那里
            //G.DataMgr.runtime.setItemTransport(questConfig.m_iAwarderNPCID, questConfig.m_iQuestID);
            G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_NPC_FIND_LOAD, questConfig.m_iQuestID, questConfig.m_iAwarderNPCID, questConfig.m_iQuestID, false);
        }
        else {
            // 杀怪
            navConfig = G.DataMgr.sceneData.getQuestNav(questConfig.m_iQuestID, 0);
            G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_MONSTER_FIND_LOAD, questConfig.m_iQuestID, navConfig.m_iQuestID, questConfig.m_iQuestID, false);
        }
    }

    private _listMenuResponse(response: Protocol.ListMenu_Response) {
        G.ViewCacher.taskView.onListMenuResponse(response);
    }


    private QuestPanelResponse(response: Protocol.QuestPanel_Response) {
        //if (response.m_usQuestType == Macros.QUEST_TYPE_HUANG_BANG) {
        //    if (response.m_usType == Macros.QUESTPANEL_HUANGBANG_SAVE) {
        //        G.DataMgr.questData.m_xuanshangQuestData.m_ucSaveCnt = G.DataMgr.questData.m_xuanshangQuestData.m_ucCanSaveCnt;
        //    }
        //    else if (response.m_usType == Macros.QUESTPANEL_OPERATE_REFRESH) {
        //        G.DataMgr.questData.m_xuanshangQuestData.m_stInfo = response.m_stValue.m_stRefresh.m_stInfo;
        //    }
        //    else {
        //        let data = response.m_stValue.m_ucListRsp.m_stValue.m_stHuangBang;
        //        G.DataMgr.questData.m_xuanshangQuestData = data;
        //    }
        //    let view = G.Uimgr.getForm<HuoYueView>(HuoYueView);
        //    if (view) {
        //        view.updateQuest();
        //    }
        //    else {
        //        G.NoticeCtrl.checkXuanShang();
        //    }
        //}
        //else
        if (response.m_usQuestType == Macros.QUEST_TYPE_DAILY) {
            if (response.m_usType == Macros.QUESTPANEL_DAILY_QUEST_SAVE) {
                G.DataMgr.questData.m_ucDailyKeepTimes = response.m_stValue.m_ucDailyKeepTimes;
            }
            else if (response.m_usType != Macros.QUESTPANEL_QUICK_ONEKEY_COMPLETE) {
                G.DataMgr.questData.m_ucDailyKeepTimes = response.m_stValue.m_ucListRsp.m_stValue.m_ucDailyKeepTimes;
            }
            G.ViewCacher.mainView.onDailyQuestUpdate();
        }
    }

    /**
     * 领取卷轴任务
     * @param needPromp 若失败是否弹出提示
     * @param confirmStrId 用于确认框的字符串id，0表示不需要确认框直接领取
     */
    doGetJuanZhouQuest(needPromp: boolean, confirmStrId: number): boolean {
        if (!this.m_questData.canAcceptJuanzhou(needPromp, true)) {
            return false;
        }
        // 查找当前等级适用且级别最高的卷轴
        let lv = G.DataMgr.heroData.level;
        let items = G.DataMgr.thingData.getThingListByFunction(KeyWord.ITEM_FUNCTION_TASK);
        let suitableItems: ThingItemData[] = [];
        for (let item of items) {
            if (item.config.m_ucRequiredLevel > lv) {
                continue;
            }
            suitableItems.push(item);
        }
        suitableItems.sort(delegate(this, this.sortJuanZhou));
        if (suitableItems.length == 0) {
            if (needPromp) {
                let selldata = this.getJuanZhouCanBuy();
                if (selldata != null) {
                    let item = ThingData.getThingConfig(selldata.m_iItemID);
                    let price = G.DataMgr.npcSellData.getPriceByID(selldata.m_iItemID, 0, selldata.m_iStoreID);
                    G.TipMgr.showConfirm(uts.format("背包中赏金卷轴已耗尽，是否花费{0}钻石购买{1}？", price, TextFieldUtil.getItemText(item)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onJuanZhouBuyConfirm, item), 10);
                }
                else {
                    G.TipMgr.addMainFloatTip('背包中赏金卷轴已耗尽，是否花费XX钻石购买？');
                }
            }
            return false;
        }

        let item = suitableItems[0];
        if (confirmStrId > 0) {
            G.TipMgr.showConfirm(G.DataMgr.langData.getLang(confirmStrId, TextFieldUtil.getItemText(item.config)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onJuanZhouConfirm, item), 10);
        } else {
            G.ModuleMgr.bagModule.useThing(item.config, item.data, 1);
        }
        return true;
    }

    private onJuanZhouBuyConfirm(state: MessageBoxConst, isCheckSelected: boolean, item: GameConfig.ThingConfigM) {
        if (MessageBoxConst.yes == state) {
            G.ModuleMgr.businessModule.directBuy(item.m_iID, 1, 1000, 0, 1, false, 0);
        }
    }

    private onJuanZhouConfirm(state: MessageBoxConst, isCheckSelected: boolean, item: ThingItemData) {
        if (MessageBoxConst.yes == state) {
            G.ModuleMgr.bagModule.useThing(item.config, item.data, 1);
        }
    }

    //商城里卖的卷轴列表
    private getJuanZhouCanBuy() {
        let npcSell = G.DataMgr.npcSellData;
        let dayAfterKaiFu: number = G.SyncTime.getDateAfterStartServer();
        //获取元宝商城里道具
        let configs = npcSell.getNPCSellDataByStroeId(1000);
        for (let i = 0, len = configs.length; i < len; i++) {
            let config = configs[i];
            let itemConfig = ThingData.getThingConfig(config.m_iItemID);
            if (itemConfig.m_ucFunctionType != KeyWord.ITEM_FUNCTION_TASK) {
                continue;
            }
            let limitConfig = npcSell.getNPCSellLimitDataById(config.m_iStoreID, config.m_iItemID).sellLimitConfig;
            if (limitConfig.m_iEndTime != 0 && (dayAfterKaiFu < limitConfig.m_iStartTime || dayAfterKaiFu > limitConfig.m_iEndTime)) {
                continue;
            }
            return config;
        }
        return null;
    }

    private sortJuanZhou(a: ThingItemData, b: ThingItemData): number {
        // value大的优先
        if (b.config.m_iFunctionValue != a.config.m_iFunctionValue) {
            return b.config.m_iFunctionValue - a.config.m_iFunctionValue;
        }
        // 绑定的优先
        let aIsBinded = a.config.m_iID % 2;
        let bIsBinded = b.config.m_iID % 2;
        if (aIsBinded != bIsBinded) {
            return bIsBinded - aIsBinded;
        }
        return b.config.m_ucRequiredLevel - a.config.m_ucRequiredLevel;
    }
}
