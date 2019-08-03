import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { HeroData } from 'System/data/RoleData'
import { NPCID } from 'System/data/NPCData'
import { PinstanceData } from 'System/data/PinstanceData'
import { Macros } from 'System/protocol/Macros'
import { ConfirmCheck } from 'System/tip/TipManager'
import { MessageBoxConst } from 'System/tip/TipManager'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { Runtime } from 'System/data/Runtime'
import { QuestAction } from 'System/constants/GameEnum'
import { QuestID } from 'System/constants/GameEnum'
import { NPCQuestState } from 'System/constants/GameEnum'
import { VipView } from 'System/vip/VipView'
import { RegExpUtil } from "System/utils/RegExpUtil"
import { CompletedQuests } from 'System/data/quest/CompletedQuests'
import { DoingQuests } from 'System/data/quest/DoingQuests'
import { AcceptableNormalQuests } from 'System/data/quest/AcceptableNormalQuests'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'

export class QuestData {
    //任务行为
    static readonly EQA_Accept: number = 1; //领取
    static readonly EQA_Abandon: number = 3; //放弃
    static readonly EQA_Complete: number = 5; //完成


    /**用于指定所有任务类型，其顺序按照自动做任务优先级排序。*/
    static readonly COMMON_TYPES: number[] = [KeyWord.QUEST_TYPE_TRUNK, KeyWord.QUEST_TYPE_GUO_YUN, KeyWord.QUEST_TYPE_DAILY,
    KeyWord.QUEST_TYPE_JUANZHOU, KeyWord.QUEST_TYPE_BRANCH, KeyWord.QUEST_TYPE_GUILD_DAILY, KeyWord.QUEST_TYPE_TREASURE_HUNT];

    static readonly LOOP_DAILY_TYPES: number[] = [KeyWord.QUEST_TYPE_DAILY, KeyWord.QUEST_TYPE_GUILD_DAILY];
    static readonly LOOP_OPERATOR: number[] = [Macros.DAY_QUEST_DAILY, Macros.DAY_QUEST_GUILD];

    static readonly CannotAutoRunNodeTypes: number[] = [KeyWord.QUEST_NODE_LEVELUP, KeyWord.QUEST_NODE_BEAUTY_EQUIP,
        KeyWord.QUEST_NODE_PET_EQUIP_NUM, KeyWord.QUEST_NODE_FMT_RANDOM_BOSS, KeyWord.QUEST_NODE_ACT_PET,
        KeyWord.QUEST_NODE_ONE_STRENG, KeyWord.QUEST_NODE_ALL_STRENG, KeyWord.QUEST_NODE_WORLD_CHAT, KeyWord.QUEST_NODE_PPSTORE_SELL, KeyWord.QUEST_NODE_FIGHT_POINT];

    static readonly DoFirstNodeTypes: number[] = [KeyWord.QUEST_NODE_DIALOG, KeyWord.QUEST_NODE_COLLECT, KeyWord.QUEST_NODE_MONSTER,
    KeyWord.QUEST_NODE_FMT_RANDOM, KeyWord.QUEST_NODE_FMT];

    /**国运额外奖励 */
    static readonly SHIP_ADD_EXP: number[] = [1313250, 1444583, 1575916, 1707233, 1969883];

    /**探险任务经验*/
    static readonly ExploreExp = 500000;

    /**每天国运任务的最多次数。*/
    static readonly BASE_GUOYUNQUEST_MAX: number = 3;

    /**每天宗门任务的最多次数。*/
    static readonly GUILD_QUEST_MAX: number = 10;

    /**日常任务最大完成次数*/
    static readonly DAILY_QUEST_MAX_TIME: number = 20;

    /**卷轴任务最大次数*/
    static readonly JZ_QUEST_MAX_TIME: number = 10;

    /**
     * [任务id, 任务配置]
     */
    private static m_questConfigMap: { [questID: number]: GameConfig.QuestConfigM };

    /**
     * 任务星级 - 奖励 映射表。
     */
    private static m_lv2RewardMap: { [questType: number]: { [questLevel: number]: GameConfig.RewardThing[] } };

    fmt_random_monsters: number[] = [31010001, 31010002, 31010003, 31010004, 31010005, 31010006, 31010007, 31010008];

    /** 初始化任务 */
    initQuest: boolean = false;

    /**普通任务数据是否完备（不包含门派、前线和皇榜任务的详细数据）。在拉取后台任务进度信息之后设置为<CODE>true</CODE>。*/
    private m_isNormalDataReady: boolean;

    /**正在进行的主任务*/
    //private m_doingList: Protocol.QuestProgress[];
    private m_doingList = new DoingQuests();

    /**正在进行的子任务*/
    //private m_childDoingList: Protocol.QuestProgress[];
    //private m_childDoingList = new DoingQuests();

    /**已经完成的任务*/
    private m_completedQuests: CompletedQuests = new CompletedQuests();
    private m_acceptableNormalQuests: AcceptableNormalQuests = new AcceptableNormalQuests();

    /**
     * 是一个map [任务发布者的ID， 任务配置]对
     */
    private m_consignerMap: { [consignerNPCID: number]: GameConfig.QuestConfigM[] };

    /**
     * 是一个map [任务奖励者， 任务配置]对
     */
    private m_awarderMap: { [awarderNPCID: number]: GameConfig.QuestConfigM[] };

    /**
     * 一个map [任务id， 掉落配置]
     */
    private m_monsterDropMap: { [questID: number]: GameConfig.QuestMonsterDropConfigM[] };

    /**
     * [子任务ID, 对应的主任务ID]
     */
    private m_childQuestMap: { [thingID: number]: number } = {};

    /**主线任务*/
    m_neverAccepttrunkIdList: number[];

    /**支线任务*/
    private m_branchIdList: number[];

    /**宗门任务。*/
    private m_guildIdList: number[];

    /**国运任务。*/
    private m_shipIdList: number[];

    /**第一个主线任务的id*/
    firstTrunkId = 0;

    /**宗门任务今日完成数。*/
    guildDailyCompletedNumer = -1;

    /**当前可接宗门任务ID。*/
    nextGuildQuestID: number = 0;

    /**国运任务今天完成数。*/
    guoYunDayCompletedTimes: number = 0;

    /**本次国运任务的ID。*/
    nextGuoYunQuestID: number = 0;

    /**提交国运任务NPC的ID。*/
    guoyunAwardNpcID: number = 0;

    /**领取国运任务的NPC的ID。*/
    guoyunConsignerNpcID: number = 0;

    /**领取提交宗门任务NPC的ID。*/
    guildDailyNpcID: number = 0;

    /**领取国运任务的最低等级。*/
    shipMinLv: number = 999;

    /**领取宗门任务的最低等级。*/
    guildMinLv: number = 999;

    /**领取卷轴任务的最低等级。*/
    juanzhouMinLv: number = 999;

    /**国运任务的前置任务ID。*/
    guoyunPreId: number = 0;

    /**卷轴任务的前置任务ID。*/
    juanzhouPreId: number = 0;

    /**宗门任务的最多日次数，与宗门建筑等级挂钩。*/
    private m_guildQuestMaxNum: number = 0;

    /**任务飞行表。*/
    private m_flyMap: { [questID: number]: true };

    /**最近一个接受的任务。*/
    lastQuestAccpeted: number = 0;

    /**最近一个完成的任务。*/
    lastQuestCompleted: number = 0;

    /**任务排序规则。*/
    private m_sortRule: number = 0;

    /**与副本关联的任务集。*/
    private m_pinstance2Quests: { [questID: number]: number[] };

    /**日常任务完成次数*/
    dailyCompleteTime = -1;

    /**下一个可接的日常任务id*/
    nextDailyQuestId = 0;

    /**跳跃点ID到任务ID的映射表。*/
    private m_jumpID2QuestID: { [tpID: number]: number[] };

    /**章节数据*/
    private m_setionData: { [taskID: number]: GameConfig.QuestSectionM } = {};

    /**每章节数*/
    private m_setionNum: { [id: number]: number } = {};
    private m_sectionTitleMap: { [id: number]: string } = {};

    private m_ramdonMonsterMap: { [questID: number]: number };

    juanzhouNum: number = 0;

    private m_tjQuestMap: { [questID: number]: GameConfig.QuestGuildConfigM } = {};

    /**是否不再提示环任务奖励*/
    noTipLoopRewardsMap: { [questType: number]: boolean } = {};

    /**悬赏任务数据源*/
    public m_xuanshangQuestData: Protocol.QuestPanelHuangBangInfoList;
    /**日常任务可充值后领取次数*/
    public m_ucDailyKeepTimes: number;
    constructor() {
        this.noTipLoopRewardsMap[KeyWord.QUEST_TYPE_DAILY] = false;
        this.noTipLoopRewardsMap[KeyWord.QUEST_TYPE_GUILD_DAILY] = false;
    }

    ////////////////////////////////////////////////// 配置预处理 //////////////////////////////////////////////////

    /**
     * 通过读出的配置文件设置数据
     * @param data
     *
     */
    onCfgReady(): void {
        this.setConfigs();
        this.setGuideConfigs();
    }

    private setConfigs() {
        let data: GameConfig.QuestConfigM[] = G.Cfgmgr.getCfg('data/QuestConfigM.json') as GameConfig.QuestConfigM[];
        QuestData.m_questConfigMap = {};
        QuestData.m_lv2RewardMap = {};

        this.m_consignerMap = {};
        this.m_awarderMap = {};
        this.m_monsterDropMap = {};

        this.m_neverAccepttrunkIdList = new Array<number>();
        this.m_branchIdList = new Array<number>();
        this.m_guildIdList = new Array<number>();
        this.m_shipIdList = new Array<number>();

        this.m_jumpID2QuestID = {};

        this.m_pinstance2Quests = {};

        this.m_ramdonMonsterMap = {};

        let cannotAutoRunMap: { [nodeType: number]: number } = {};
        for (let n of QuestData.CannotAutoRunNodeTypes) {
            cannotAutoRunMap[n] = 1;
        }

        let questNode: GameConfig.QuestNodeConfigCli;
        let index: number, i: number = 0;

        let lvRewardMap: { [lv: number]: GameConfig.RewardThing[] };
        for (let questConfig of data) {
            if (KeyWord.QUEST_TYPE_TREASURE_HUNT == questConfig.m_ucQuestType) {
                // 探险任务写死奖励经验
                questConfig.m_ucRewardThingNumber = 1;
                questConfig.m_astRewardThingConfig[0] = { m_iThingID: KeyWord.EXPERIENCE_THING_ID, m_iValue: QuestData.ExploreExp, m_ushTarget: 0 };
            }
            questConfig.m_szQuestDialogPublished = RegExpUtil.replaceSign(questConfig.m_szQuestDialogPublished);
            questConfig.m_szQuestDialogCompleted = RegExpUtil.replaceSign(questConfig.m_szQuestDialogCompleted);
            if (0 == questConfig.m_iQuestID) {
                // 没有任务ID的可能是星级奖励配置
                if (questConfig.m_ucQuestType > 0) {
                    lvRewardMap = QuestData.m_lv2RewardMap[questConfig.m_ucQuestType];
                    if (null == lvRewardMap) {
                        QuestData.m_lv2RewardMap[questConfig.m_ucQuestType] = lvRewardMap = {};
                    }
                    lvRewardMap[questConfig.m_ucQuestLevel] = questConfig.m_astRewardThingConfig;
                }

                continue;
            }

            if (KeyWord.QUEST_TYPE_REWARDEXP == questConfig.m_ucQuestType ||
                KeyWord.QUEST_TYPE_REWARDSHELL == questConfig.m_ucQuestType) {
                // 过滤掉悬赏任务
                continue;
            }

            QuestData.m_questConfigMap[questConfig.m_iQuestID] = questConfig; //[id,config]对
            this._checkChildQuest(questConfig); //子任务相关创建

            // 跳跃序列
            let jumpQlist: number[];
            if (null != questConfig.m_szAcceptJump && '' != questConfig.m_szAcceptJump) {
                let aja: string[] = questConfig.m_szAcceptJump.split(',');
                questConfig.acceptJumpSeq = new Array<number>();
                for (i = 0; i < aja.length; i++) {
                    questConfig.acceptJumpSeq.push(parseInt(aja[i]));
                }
                jumpQlist = this.m_jumpID2QuestID[aja[0]];
                if (null == jumpQlist) {
                    this.m_jumpID2QuestID[aja[0]] = jumpQlist = new Array<number>();
                }
                if (jumpQlist.indexOf(questConfig.m_iQuestID) < 0) {
                    jumpQlist.push(questConfig.m_iQuestID);
                }
            } else {
                questConfig.acceptJumpSeq = null;
            }
            if (null != questConfig.m_szFinishJump && '' != questConfig.m_szFinishJump) {
                let fja: string[] = questConfig.m_szFinishJump.split(',');
                questConfig.finishJumpSeq = new Array<number>();
                for (i = 0; i < fja.length; i++) {
                    questConfig.finishJumpSeq.push(parseInt(fja[i]));
                }
                jumpQlist = this.m_jumpID2QuestID[fja[0]];
                if (null == jumpQlist) {
                    this.m_jumpID2QuestID[fja[0]] = jumpQlist = new Array<number>();
                }
                if (jumpQlist.indexOf(questConfig.m_iQuestID) < 0) {
                    jumpQlist.push(questConfig.m_iQuestID);
                }
            } else {
                questConfig.finishJumpSeq = null;
            }

            // 构建领取NPC映射
            if (questConfig.m_iConsignerNPCID > 0 && KeyWord.QUEST_TYPE_CHILD != questConfig.m_ucQuestType) {
                //发布相关[发布npcid， vector<任务配置>]
                if (this.m_consignerMap[questConfig.m_iConsignerNPCID] == null) {
                    this.m_consignerMap[questConfig.m_iConsignerNPCID] = new Array<GameConfig.QuestConfigM>();
                }
                this.m_consignerMap[questConfig.m_iConsignerNPCID].push(questConfig);
            }

            // 构建奖励NPC映射
            if (questConfig.m_iAwarderNPCID > 0) {
                if (null == this.m_awarderMap[questConfig.m_iAwarderNPCID]) {
                    this.m_awarderMap[questConfig.m_iAwarderNPCID] = new Array<GameConfig.QuestConfigM>();
                }
                this.m_awarderMap[questConfig.m_iAwarderNPCID].push(questConfig);
            }

            this._createDropMap(questConfig); //[任务id， 掉落配置Vector.<QuestMonsterDropConfig_Flash>]
            this._createQuestTypeMap(questConfig); //主线任务的缓存

            // 确定每个questNode和monsterDrop之间的映射
            index = 0;
            let questList: number[];
            for (i = 0; i < questConfig.m_ucQuestNodeNumber; i++) {
                questNode = questConfig.m_astQuestNodeConfig[i];
                if ((KeyWord.QUEST_NODE_COLLECT == questNode.m_ucType || KeyWord.QUEST_NODE_COLLECT_SHARE == questNode.m_ucType) &&
                    questConfig.m_ucMonsterDropNumber > index) {
                    // 只有收集节点才有关联的怪物
                    questNode.monsterDropIndex = index;
                    index++;
                }
                else {
                    questNode.monsterDropIndex = -1;
                }

                // 关联相关的副本
                if (KeyWord.QUEST_NODE_PINSTANCE == questNode.m_ucType || KeyWord.QUEST_NODE_ENTER_PINSTANCE == questNode.m_ucType) {
                    questList = this.m_pinstance2Quests[questNode.m_iThingID];
                    if (null == questList) {
                        this.m_pinstance2Quests[questNode.m_iThingID] = questList = new Array<number>();
                    }
                    questList.push(questConfig.m_iQuestID);
                }
            }
            let node = questConfig.m_astQuestNodeConfig[0];
            questConfig.cannotAutoRunNode = cannotAutoRunMap[node.m_ucType];
            if (KeyWord.QUEST_NODE_PINSTANCE == node.m_ucType && PinstanceIDUtil.ZuDuiFuBenIDs.indexOf(node.m_iThingID) >= 0) {
                questConfig.isTeamFbNode = 1;
            }
        }

        this.setFlyConfig();
        this.setSetionConfig();
    }

    /**
     * 建立任务的类型映射。
     * @param config
     *
     */
    private _createQuestTypeMap(config: GameConfig.QuestConfigM): void {
        let levelLowerLimit: number = 0;
        if (KeyWord.QUEST_TYPE_TRUNK == config.m_ucQuestType) {
            this.m_neverAccepttrunkIdList.push(config.m_iQuestID);
            if (0 == config.m_iPreQuestID) {
                this.firstTrunkId = config.m_iQuestID;
            }
        }
        else if (KeyWord.QUEST_TYPE_BRANCH == config.m_ucQuestType) {
            this.m_branchIdList.push(config.m_iQuestID);
        }
        else if (KeyWord.QUEST_TYPE_GUILD_DAILY == config.m_ucQuestType) {
            this.m_guildIdList.push(config.m_iQuestID);

            if (defines.has('_DEBUG')) {
                uts.assert((config.m_iConsignerNPCID == config.m_iAwarderNPCID) && (0 == this.guildDailyNpcID || this.guildDailyNpcID == config.m_iConsignerNPCID),
                    '宗门任务交接NPC不一致：' + config.m_iQuestID);
            }
            this.guildDailyNpcID = config.m_iConsignerNPCID;

            levelLowerLimit = config.m_stPrefixCondition.m_ucLevelLowerLimit;
            if (this.guildMinLv > levelLowerLimit) {
                this.guildMinLv = levelLowerLimit;
            }
        }
        else if (KeyWord.QUEST_TYPE_GUO_YUN == config.m_ucQuestType) {
            // 更新国运任务的ID
            this.guoyunPreId = config.m_iPreQuestID;

            this.m_shipIdList.push(config.m_iQuestID);

            // 更新国运NPC
            if (defines.has('_DEBUG')) {
                uts.assert(0 == this.guoyunConsignerNpcID || this.guoyunConsignerNpcID == config.m_iConsignerNPCID,
                    '护送任务领取NPC不一致：' + config.m_iQuestID);
            }
            this.guoyunConsignerNpcID = config.m_iConsignerNPCID;

            // 更新国运任务最低等级
            levelLowerLimit = config.m_stPrefixCondition.m_ucLevelLowerLimit;
            if (this.shipMinLv > levelLowerLimit) {
                this.shipMinLv = levelLowerLimit;
            }
        }
        else if (KeyWord.QUEST_TYPE_JUANZHOU == config.m_ucQuestType) {
            // 更新卷轴任务的前置任务
            this.juanzhouPreId = config.m_iPreQuestID;

            // 更新卷轴任务最低等级
            levelLowerLimit = config.m_stPrefixCondition.m_ucLevelLowerLimit;
            if (this.juanzhouMinLv > levelLowerLimit) {
                this.juanzhouMinLv = levelLowerLimit;
            }
        }
    }

    /**
     * 确认人物数据已经完备。
     *
     */
    onNormalDataReady(): void {
        this.m_isNormalDataReady = true;
    }

    get isQuestDataReady(): boolean {
        return this.m_isNormalDataReady;
    }

    get maxGuildQuestNum(): number {
        return QuestData.GUILD_QUEST_MAX;
    }

    get maxGuoyunQuestNum(): number {
        return QuestData.BASE_GUOYUNQUEST_MAX + G.DataMgr.vipData.getReserveTime(KeyWord.QUEST_TYPE_GUO_YUN);
    }

    ////////////////////////////////////////////////// 常用接口 //////////////////////////////////////////////////

    /**
     *根据任务id获取任务的配置
     * @param questID
     * @return
     *
     */
    static getConfigByQuestID(questID: number): GameConfig.QuestConfigM {
        return QuestData.m_questConfigMap[questID];

    }

    /**
     * 获取指定类型和星级的任务的奖励（目前只有门派任务和前线任务用到）。
     * @param type
     * @param lv
     * @return
     *
     */
    static getLvRewardByType(type: number, lv: number): GameConfig.RewardThing[] {
        let typeMap = QuestData.m_lv2RewardMap[type];
        if (null == typeMap) {
            return null;
        }

        return typeMap[lv];
    }

    static getLoopQuestExtraExp(config: GameConfig.QuestConfigM): number {
        let expCnt = 0;
        let heroLv = G.DataMgr.heroData.level;
        if (KeyWord.QUEST_TYPE_DAILY == config.m_ucQuestType) {
           expCnt =  Math.floor((1000000 + Math.floor((heroLv <= 80 ? 80 : heroLv) / 10) * 1000000));
        }

        return expCnt;
    }

    static getShipQuestExtraExp(shipLv: number): number {
        let heroLv = G.DataMgr.heroData.level;
        if (heroLv > 50) {
            return Math.floor((heroLv - 50) / 10) * QuestData.SHIP_ADD_EXP[shipLv - 1];
        }

        return 0;
    }

    /**
     * 获取奖励数量。
     * @param rewardThing
     * @return
     *
     */
    static getRewardValue(rewardThing: GameConfig.RewardThing): number {
        let rewardValue: number = 0;
        if (KeyWord.EXPERIENCE_LEVEL_THING_ID == rewardThing.m_iThingID) {
            // 与人物等级相关的经验值,公式为：填表经验类型为210006的值*这个系数/10000，四舍五入到千位
            let roleAttrConf: GameConfig.RoleLevelConfigM = G.DataMgr.roleAttributeData.getConfig(G.DataMgr.heroData.level);
            rewardValue = Math.floor((roleAttrConf.m_uiExpCorrect * rewardThing.m_iValue / 10000 + 500) / 1000) * 1000;
        }
        else {
            rewardValue = rewardThing.m_iValue;
        }
        return rewardValue;
    }

    /**
     * 获取与指定任务相关的副本ID。
     * @param config
     * @return
     *
     */
    static getPinstanceByQuest(config: GameConfig.QuestConfigM): number {
        if (0 == config.m_ucQuestNodeNumber) {
            return 0;
        }

        let nodeConfig: GameConfig.QuestNodeConfigCli;
        for (let i: number = 0; i < config.m_ucQuestNodeNumber; i++) {
            nodeConfig = config.m_astQuestNodeConfig[i];
            if (KeyWord.QUEST_NODE_ENTER_PINSTANCE == nodeConfig.m_ucType || KeyWord.QUEST_NODE_PINSTANCE == nodeConfig.m_ucType) {
                return nodeConfig.m_iThingID;
            }
        }

        return 0;
    }

    /**
     * 通过任务id得到其对应的掉落配置
     * @param questId
     * @return
     *
     */
    getMonsterDropById(questId: number): GameConfig.QuestMonsterDropConfigM[] {
        return this.m_monsterDropMap[questId];
    }

    /**
     * 获取与指定的任务节点相关的怪物ID。
     * @param questID
     * @param nodeIndex
     * @return
     *
     */
    getMonsterIDByQuestNode(questID: number, nodeIndex: number): number {
        let questConfig: GameConfig.QuestConfigM = QuestData.m_questConfigMap[questID];
        let nodeConfig: GameConfig.QuestNodeConfigCli = questConfig.m_astQuestNodeConfig[nodeIndex];

        let monsterID: number = 0;
        if (KeyWord.QUEST_NODE_MONSTER == nodeConfig.m_ucType || KeyWord.QUEST_NODE_MONSTER_SHARE == nodeConfig.m_ucType) {
            // 杀怪
            monsterID = nodeConfig.m_iThingID;
        }
        else if (KeyWord.QUEST_NODE_COLLECT == nodeConfig.m_ucType || KeyWord.QUEST_NODE_COLLECT_SHARE == nodeConfig.m_ucType) {
            // 收集
            if (nodeConfig.monsterDropIndex >= 0 && nodeConfig.monsterDropIndex < questConfig.m_astMonsterDropConfig.length) {
                let monster: GameConfig.QuestMonsterDropConfigM = questConfig.m_astMonsterDropConfig[nodeConfig.monsterDropIndex];
                monsterID = monster.m_iMonsterID;
            }
            else {
                monsterID = nodeConfig.m_iThingID;
            }
        }
        else if (KeyWord.QUEST_NODE_FMT_RANDOM == nodeConfig.m_ucType) {
            if (this.m_ramdonMonsterMap[questID] == null) {
                let i = Math.floor(Math.random() * this.fmt_random_monsters.length);
                this.m_ramdonMonsterMap[questID] = this.fmt_random_monsters[i];
            }

            monsterID = this.m_ramdonMonsterMap[questID];
        }

        return monsterID;
    }

    private setSetionConfig(): void {
        let data: GameConfig.QuestSectionM[] = G.Cfgmgr.getCfg('data/QuestSectionM.json') as GameConfig.QuestSectionM[];

        for (let config of data) {
            if (config.m_iTaskID > 0) {
                this.m_setionData[config.m_iTaskID] = config;

                if (undefined == this.m_setionNum[config.m_iID]) {
                    this.m_setionNum[config.m_iID] = 1;
                } else {
                    this.m_setionNum[config.m_iID]++;
                }
                if ('' != config.m_szTitle) {
                    this.m_sectionTitleMap[config.m_iID] = config.m_szTitle;
                }
            }
        }
    }

    getSetionConfig(questID: number): GameConfig.QuestSectionM {
        return this.m_setionData[questID];
    }

    getSetionNum(id: number): number {
        return this.m_setionNum[id];
    }

    getSectionTitle(id: number): string {
        return this.m_sectionTitleMap[id];
    }

    ////////////////////////////////////////////////// 任务状态 //////////////////////////////////////////////////

    /**
     * 这个任务是否已经完成 ,完成的概念是一定要去领取奖励后才算完成
     * @param questID 任务的ID
     * @return
     *
     */
    isQuestCompleted(questID: number): boolean {
        return this.m_completedQuests.isQuestCompleted(questID);
    }

    /**
     * 判断这个任务是否在正在做的列表中
     * @param questID 任务id
     * @return
     *
     */
    isQuestInDoingList(questID: number): boolean {
        return this.m_doingList.has(questID);
    }

    /**
     * 到正在做的任务列表中获取指定任务id的完成度
     * @param questID
     * @return
     *
     */
    getQuestProgress(questID: number): Protocol.QuestProgress {
        return this.m_doingList.get(questID);
    }

    /**
     *获取正在进行中的任务
     * @return
     *
     */
    getDoingQuestList(): Protocol.QuestProgress[] {
        return this.m_doingList.mainQuests;
    }

    /**
     *
     * @param bytes
     *
     */
    updateCompletedList(list: Protocol.CompletedQuestList): void {
        this.m_completedQuests.update(list);
        for (let i = 0; i < list.m_iQuestNumber; i++) {
            let q = list.m_astQuestStatus[i];
            let idx = this.m_neverAccepttrunkIdList.indexOf(q.m_iQuestID);
            if (idx >= 0) {
                this.m_neverAccepttrunkIdList.splice(idx, 1);
            }
        }
    }

    /**
     * 更新正在进行中的任务列表信息，前台自己维护,这个也包括节点所有完成的但是还没有去叫的“已完成”的任务
     * @param list
     *
     */
    updateDoingList(progressList: Protocol.QuestProgressList): void {
        this.initQuest = true;
        this.m_doingList.update(progressList);
    }

    isQuestCompletingByID(questID: number): boolean {
        let progress: Protocol.QuestProgress = this.getQuestProgress(questID);
        if (null == progress) {
            // 没有进度的话，有可能是已经提交过的，也有可能只是对话节点，要做检查
            return false;
        }

        return this.isQuestCompleting(progress);
    }

    /**
     * 根据任务的节点数据判断任务是否已经完成
     * @param qp
     * @return
     *
     */
    isQuestCompleting(qp: Protocol.QuestProgress): boolean {
        if (qp == null || qp.m_iQuestID == 0)
            return false;

        let questConfig: GameConfig.QuestConfigM = QuestData.m_questConfigMap[qp.m_iQuestID];
        let nodes: GameConfig.QuestNodeConfigCli[] = questConfig.m_astQuestNodeConfig;

        let nodeCount: number = questConfig.m_ucQuestNodeNumber;

        let finishNodeCount: number = 0;
        for (let i: number = 0; i < nodeCount; i++) {
            let index: number = qp.m_astNodeProgress[i].m_ucQuestProgressIndex;
            let node: GameConfig.QuestNodeConfigCli = nodes[index];
            if (node.m_shValue <= qp.m_astNodeProgress[i].m_shProgressValue) //小于一般是不会出现的
            {
                finishNodeCount++;
            }
        }
        if (finishNodeCount >= nodeCount) {
            return true;
        }
        return false;
    }

    ////////////////////////////////////////////////// 任务筛选 //////////////////////////////////////////////////

    /**
     * 取得下一个任务的ID
     * @param questID
     * @param npcID
     * @return
     *
     */
    getNPCNextQuestID(questID: number, npcID: number, heroData: HeroData): number {
        let curQuestConfig: GameConfig.QuestConfigM = QuestData.m_questConfigMap[questID]; //当前任务的配置
        let nextQuestID: number = 0;

        if (KeyWord.QUEST_TYPE_GUO_YUN == curQuestConfig.m_ucQuestType) {
            if (this.canAcceptShip(this.guoyunConsignerNpcID, heroData, true)) {
                // 如果是国运任务则继续接国运
                return this.nextGuoYunQuestID;
            }
        }

        let arr: GameConfig.QuestConfigM[] = this.getAcceptableQuestsByNpc(npcID, heroData, 0); //取得当前npc可以接的任务列表	
        if (arr.length > 0) {
            return arr[0].m_iQuestID;
        }

        return 0;
    }

    /**
     * 获取指定NPC身上接的正在做的任务列表，并且按照任务类型进行排序。
     * @param npcID 0表示不限制。
     * @param sortRule 排序规则，应用于非主线任务之间的排序。
     * 0表示按照只任务类型进行排序，1表示最近接受的任务具备更高的优先级，-1表示最近完成的任务具备更高的优先级。
     * @param noLvUp 是否排除掉等级提升类的任务。
     * @param noCantDo 是否排除掉不能做的任务，比如需要进副本但是没有次数了的。
     * @param type 是否筛选特定类型的任务。
     * @return
     *
     */
    getDoingQuestByNpc(npcID: number = 0, sortRule: number = 0, noLvUp: boolean = true, noCantDo: boolean = true, type: number = 0): GameConfig.QuestConfigM[] {
        this.m_sortRule = sortRule;

        let result: GameConfig.QuestConfigM[] = new Array<GameConfig.QuestConfigM>();
        let questConfig: GameConfig.QuestConfigM;
        let pid: number = 0;
        for (let qg of this.m_doingList.mainQuests) {
            questConfig = QuestData.getConfigByQuestID(qg.m_iQuestID);
            if (npcID > 0 && npcID != questConfig.m_iConsignerNPCID) {
                continue;
            }

            if (type > 0 && type != questConfig.m_ucQuestType) {
                continue;
            }

            if (noLvUp && (KeyWord.QUEST_NODE_LEVELUP == questConfig.m_astQuestNodeConfig[0].m_ucType || KeyWord.QUEST_NODE_FIGHT_POINT == questConfig.m_astQuestNodeConfig[0].m_ucType)&& !this.isQuestCompleting(qg)) {
                // 提升等级类的任务，如果还没完成，那就直接跳过
                continue;
            }

            if (noCantDo) {
                pid = QuestData.getPinstanceByQuest(questConfig);
                if (pid > 0 && pid != G.DataMgr.sceneData.curPinstanceID) {
                    let pinstanceConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(pid);
                    if (pinstanceConfig.m_ucEnterTimes > 0 && G.DataMgr.systemData.getPinstanceLeftTimes(pinstanceConfig) <= 0) {
                        // 副本次数不足了
                        if (!this.isQuestCompleting(qg)) {
                            // 还需要进副本做任务，那就不能做了
                            continue;
                        }
                        else {
                            // 检查提交任务的NPC是不是在这个副本里
                            if (questConfig.m_iAwarderNPCID > 0) {
                                let npcNav: GameConfig.NavigationConfigM = G.DataMgr.sceneData.getNpcNav(questConfig.m_iAwarderNPCID);
                                if (null != npcNav) {
                                    let scenePids: number[] = PinstanceData.getPinstancesBySceneId(npcNav.m_iSceneID);
                                    if (null != scenePids && scenePids.indexOf(pid) > 0) {
                                        continue;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            result.push(questConfig);
        }
        result.sort(delegate(this, this._sortQuestByType));
        return result;
    }

    /**
     * 根据NpcID获取可以领取的任务，此处不检查玩家等级。
     * @param id
     * @return
     *
     */
    getQuestsByConsigner(npcId: number, heroData: HeroData, questType: number = 0): GameConfig.QuestConfigM[] {
        let result: GameConfig.QuestConfigM[] = new Array<GameConfig.QuestConfigM>();
        let groupQuests: GameConfig.QuestConfigM[] = new Array<GameConfig.QuestConfigM>();
        let nodes: GameConfig.QuestConfigM[] = this.m_consignerMap[npcId]; //该npc所发布任务的列表

        if (nodes == null) {
            return result;
        }

        let config: GameConfig.QuestConfigM = null;
        let len: number = nodes.length;
        for (let i: number = 0; i < len; ++i) {
            config = nodes[i];
            if (0 != questType && questType != config.m_ucQuestType) {
                continue;
            }

            if (this.canQuestAccept(config, heroData, false)) {
                result.push(config);
            }
        }

        return result;
    }

    /**
     * 根据npcid获取某个npc当前可领取奖励的任务配置列表
     * @param npcID
     * @param needFinish true表示寻找已经完成的任务，false表示寻找正在做的任务，并且这任务是在这个npc交
     * @return
     *
     */
    getAwardQuestsByNpcID(npcID: number, needFinish: boolean = false, includeChild: boolean = true): GameConfig.QuestConfigM[] {
        let result: GameConfig.QuestConfigM[] = new Array<GameConfig.QuestConfigM>();
        let questList: GameConfig.QuestConfigM[] = this.m_awarderMap[npcID];
        if (questList == null) {
            return result;
        }


        let len: number = questList.length;
        let questConfig: GameConfig.QuestConfigM;
        for (let i: number = 0; i < len; ++i) {
            questConfig = questList[i];
            if (KeyWord.QUEST_TYPE_CHILD == questConfig.m_ucQuestType && !includeChild) {
                // 过滤子任务
                continue;
            }

            if (this.isQuestInDoingList(questConfig.m_iQuestID)) //任务必须正在做的列表中
            {
                //是否已经完成，这个完成的概念不是要领完奖励,表示所有的节点完成
                let isCompleting: boolean = this.isQuestCompleting(this.getQuestProgress(questConfig.m_iQuestID));
                if (needFinish != isCompleting) {
                    continue;
                }

                result.push(questConfig);
            }
        }
        return result;
    }

    getAcceptableTrunk(heroData: HeroData): GameConfig.QuestConfigM {
        if (this.m_neverAccepttrunkIdList.length > 0) {
            let config = QuestData.m_questConfigMap[this.m_neverAccepttrunkIdList[0]];
            if (this.canQuestAccept(config, heroData)) //当前任务可接
            {
                return config;
            }
        }
        return null;
    }

    getAcceptableBranch(heroData: HeroData, getNum: number = 0): GameConfig.QuestConfigM[] {
        return this.getAcceptableQuestList(this.m_branchIdList, heroData, getNum);
    }

    getAcceptableGuildDaily(heroData: HeroData, getNum: number = 0): GameConfig.QuestConfigM[] {
        if (!this.canAcceptGuild(NPCID.guildQuestNpc, heroData, true)) {
            return [];
        }
        return this.getAcceptableQuestList([this.nextGuildQuestID], heroData, getNum);
    }

    getAcceptableGuoYun(heroData: HeroData, getNum: number = 0): GameConfig.QuestConfigM[] {
        if (!this.canAcceptShip(this.guoyunConsignerNpcID, heroData, true)) {
            return [];
        }
        return this.getAcceptableQuestList([this.nextGuildQuestID], heroData, getNum);
    }

    private getAcceptableQuestList(typeQuestIdList: number[], heroData: HeroData, getNum = 999): GameConfig.QuestConfigM[] {
        let result: GameConfig.QuestConfigM[] = new Array<GameConfig.QuestConfigM>();

        let count = 0;
        if (typeQuestIdList != null) {
            for (let questID of typeQuestIdList) {
                let config = QuestData.m_questConfigMap[questID];
                if (!this.canQuestAccept(config, heroData)) //当前任务可接
                {
                    continue;
                }
                result.push(config);
                count++;
                // 超过数目限制
                if (count >= getNum) {
                    break;
                }
            }
        }

        return result;
    }

    /**
     * 获取当前可以做的所有普通任务ID，不包括门派任务、前线任务和皇榜任务等。
     * @return
     *
     */
    getAllAcceptableNormalQuests(heroData: HeroData): number[] {
        return this.m_acceptableNormalQuests.getAllQuests(heroData);
        // let result: number[] = new Array<number>();

        // let questID: number = 0;
        // let config: GameConfig.QuestConfigM = null;
        // for (let id in QuestData.m_questConfigMap) //遍历所有的任务
        // {
        //     questID = parseInt(id);
        //     if (QuestData.isChildQuestByID(questID)) {
        //         // 过滤掉子任务
        //         continue;
        //     }

        //     config = QuestData.m_questConfigMap[questID];
        //     if (KeyWord.QUEST_TYPE_BRANCH == config.m_ucQuestType || KeyWord.QUEST_TYPE_GUO_YUN == config.m_ucQuestType ||
        //         QuestData.isDailyQuestByType(config.m_ucQuestType) || QuestData.isSpecialQuestByType(config.m_ucQuestType)) {
        //         // 支线任务自动接取
        //         continue;
        //     }
        //     if (this.canQuestAccept(config, heroData)) {
        //         result.push(questID);
        //     }
        // }

        // return result;
    }

    /**
     * 取npc身上的人物状态，
     * 几个状态从上到下都有优先级，就是加入有任务完成并且又有任务可接则返回任务完成
     * @param npcID npc的ID
     * @return 见EnumNPCQuestState这个类
     *
     */
    getStateByNPCID(npcID: number, heroData: HeroData): number {
        // 数据没到位，或者点击欢迎界面之前不能点
        if (!this.isQuestDataReady) {
            return NPCQuestState.noQuest;
        }

        // 不允许交互
        if (!G.DataMgr.npcData.canInterate(npcID)) {
            return NPCQuestState.noQuest;
        }

        // 有已经完成的任务
        if (this.getAwardQuestsByNpcID(npcID, true, false).length > 0) {
            return NPCQuestState.complete;
        }

        let canAcceptGuild: boolean = this.canAcceptGuild(npcID, heroData, false);
        let canAcceptShip: boolean = this.canAcceptShip(npcID, heroData, false);

        let questList: GameConfig.QuestConfigM[] = this.getQuestsByConsigner(npcID, heroData, 0);
        let hasLimitQuest: boolean = false;
        for (let questConfig of questList) {
            // 过滤子任务
            if (KeyWord.QUEST_TYPE_CHILD == questConfig.m_ucQuestType) {
                continue;
            }

            if (KeyWord.QUEST_TYPE_GUILD_DAILY == questConfig.m_ucQuestType && !canAcceptGuild) {
                continue;
            }
            // 如果是国运任务
            else if (KeyWord.QUEST_TYPE_GUO_YUN == questConfig.m_ucQuestType && !canAcceptShip) {
                continue;
            }

            //只要发现有符合等级的就优先采用黄色的箭头
            if (this.isLevelMeet(heroData.level, questConfig.m_stPrefixCondition.m_ucLevelLowerLimit, questConfig.m_stPrefixCondition.m_ucLevelUpperLimit)) {
                return NPCQuestState.receive;
            }
            else {
                hasLimitQuest = true;
            }
        }

        // 有正在做的任务
        if (this.getAwardQuestsByNpcID(npcID, false, false).length > 0) {
            return NPCQuestState.doing;
        }

        if (hasLimitQuest) {
            return NPCQuestState.limit;
        }

        return NPCQuestState.noQuest;
    }

    /**
     * 根据任务类型获取NPC身上可以接取的任务列表，按照优先级进行排序。
     * @param npcID
     * @param heroLevel
     * @param type 任务类型，0表示不限。
     * @return
     *
     */
    getAcceptableQuestsByNpc(npcID: number, heroData: HeroData, type: number = 0): GameConfig.QuestConfigM[] {
        let questList: GameConfig.QuestConfigM[] = this.getQuestsByConsigner(npcID, heroData, type);
        let questConfig: GameConfig.QuestConfigM;
        for (let i: number = questList.length - 1; i >= 0; i--) {
            questConfig = questList[i];

            if (!this.canQuestAccept(questConfig, heroData, true)) {
                questList.splice(i, 1);
            }
        }

        this.m_sortRule = 0;
        questList.sort(delegate(this, this._sortQuestByType));
        return questList;
    }

    /**
     * 按照任务类型对任务进行排序，但是商城购买类型的任务优先级最低。
     * @param a
     * @param b
     *
     */
    private _sortQuestByType(a: GameConfig.QuestConfigM, b: GameConfig.QuestConfigM): number {
        // 手动触发的任务优先级最高
        if (G.DataMgr.runtime.pickQuestID == a.m_iQuestID) {
            return -1;
        }
        else if (G.DataMgr.runtime.pickQuestID == b.m_iQuestID) {
            return 1;
        }

        // 商城购买类型优先级调低
        let nodeA: number = a.m_astQuestNodeConfig[0].m_ucType;
        let nodeB: number = b.m_astQuestNodeConfig[0].m_ucType;

        // 相同任务类型的情况下，提升等级类任务优先级降低
        let typeWeightA = 0;
        if (KeyWord.QUEST_TYPE_TRUNK == a.m_ucQuestType) {
            if ((KeyWord.QUEST_NODE_LEVELUP == nodeA || KeyWord.QUEST_NODE_FIGHT_POINT == nodeA) && !this.isQuestCompletingByID(a.m_iQuestID)) {
                typeWeightA = 1;
            } else {
                typeWeightA = -1;
            }
        }
        let typeWeightB = 0;
        if (KeyWord.QUEST_TYPE_TRUNK == b.m_ucQuestType) {
            if ((KeyWord.QUEST_NODE_LEVELUP == nodeB || KeyWord.QUEST_NODE_FIGHT_POINT == nodeA)  && !this.isQuestCompletingByID(b.m_iQuestID)) {
                typeWeightB = 1;
            } else {
                typeWeightB = -1;
            }
        }

        if (typeWeightA != typeWeightB) {
            return typeWeightA - typeWeightB;
        }

        //// 主线任务始终优先级最高
        //if (a.m_ucQuestType != b.m_ucQuestType) {
        //    if (KeyWord.QUEST_TYPE_TRUNK == a.m_ucQuestType) {
        //        return -1;
        //    }
        //    else if (KeyWord.QUEST_TYPE_TRUNK == b.m_ucQuestType) {
        //        return 1;
        //    }
        //}

        // 按照排序规则进行
        if (1 == this.m_sortRule && this.lastQuestAccpeted > 0) {
            if (this.lastQuestAccpeted == a.m_iQuestID) {
                return -1;
            }
            else if (this.lastQuestAccpeted == b.m_iQuestID) {
                return 1;
            }
        }
        else if (-1 == this.m_sortRule && this.lastQuestCompleted > 0) {
            let lastQuest: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(this.lastQuestCompleted);
            if (lastQuest.m_ucQuestType == a.m_ucQuestType) {
                return -1;
            }
            else if (lastQuest.m_ucQuestType == b.m_ucQuestType) {
                return 1;
            }
        }

        let aIndex: number = QuestData.COMMON_TYPES.indexOf(a.m_ucQuestType);
        let bIndex: number = QuestData.COMMON_TYPES.indexOf(b.m_ucQuestType);
        return aIndex - bIndex;
    }

    /**
     *更新任务的状态
     * @param questID
     * @param state   领取，放弃，完成
     *
     */
    updateStateByOperate(questID: number, groupId: number, state: number): void {
        let config: GameConfig.QuestConfigM = QuestData.m_questConfigMap[questID] as GameConfig.QuestConfigM;
        let nodeNum: number = config.m_astQuestNodeConfig.length;
        let nodeConfig: GameConfig.QuestNodeConfigCli;
        let i: number = 0;

        switch (state) {
            case QuestAction.accept:
                this.m_completedQuests.setQuestCompleted(questID, false, groupId != 0);
                // 新领取的任务,需要把任务的状态加入到任务中列表
                if (defines.has('_DEBUG')) {
                    uts.assert(null != config && KeyWord.QUEST_TYPE_CHILD != config.m_ucQuestType, '数据必须不为空，并且不可能是子任务，子任务的领取后台不会下发');
                }

                this._createProgressWhenAccept(questID);
                break;

            case QuestAction.abandon:
                // 如果节点是子任务的话，也要把子任务拿掉
                this.m_doingList.remove(questID);
                break;

            case QuestAction.complete:
                let idx = this.m_neverAccepttrunkIdList.indexOf(config.m_iQuestID);
                if (idx >= 0) {
                    this.m_neverAccepttrunkIdList.splice(idx, 1);
                }
                // 卷轴任务等不需要计入完成列表，因卷轴任务同时只能进行1次，且有可能连续两次随机到同1个
                if (!QuestData.isSpecialQuestByType(config.m_ucQuestType)) {
                    this.m_completedQuests.setQuestCompleted(questID, true, groupId != 0);
                }
                this.m_doingList.remove(questID);
                break;

            default:
                break;
        }

        // 更新环式特殊任务的状态
        let newStatus: number = 0;
        if (QuestAction.abandon == state) {
            newStatus = Macros.QUEST_STATUS_CANCEL;
        }
        else if (QuestAction.complete == state) {
            newStatus = Macros.QUEST_STATUS_COMPLETED;
        }
        else {
            newStatus = 0;
        }
    }

    /**
     * 判断任务是否可接，等级未到、正在做或已完成的、门派任务等随机任务的ID不匹配的或次数用完的都不可接。
     *
     * @param questConfig 任务配置
     * @param heroData 玩家数据
     * @return
     *
     */
    canQuestAccept(questConfig: GameConfig.QuestConfigM, heroData: HeroData, checkLv: boolean = true): boolean {
        // 检查是否已经接过了
        if (this._checkQuestCompletedOrDoing(questConfig, heroData)) {
            return false;
        }

        // 检查等级
        if (checkLv && !this.isLevelMeet(heroData.level, questConfig.m_stPrefixCondition.m_ucLevelLowerLimit,
            questConfig.m_stPrefixCondition.m_ucLevelUpperLimit)) {
            return false;
        }

        if (KeyWord.QUEST_TYPE_GUILD_DAILY == questConfig.m_ucQuestType && this.nextGuildQuestID != questConfig.m_iQuestID) {
            return false;
        }
        else if (KeyWord.QUEST_TYPE_GUO_YUN == questConfig.m_ucQuestType && (this.nextGuoYunQuestID != questConfig.m_iQuestID || !G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_GUOYUN,true))) {
            // 国运任务
            return false;
        }
        else if (KeyWord.QUEST_TYPE_DAILY == questConfig.m_ucQuestType && this.nextDailyQuestId != questConfig.m_iQuestID) {
            // 日常任务
            return false;
        }

        // 检查前置任务
        if (questConfig.m_iPreQuestID > 0) {
            return this._checkPreQuest(questConfig.m_iPreQuestID, false);
        }

        return true;
    }

    /**
     * 是否可以接卷轴任务。
     * @param needPromp 是否弹提示。
     * @param checkDoing 是否检查正在做同类任务。
     * @return
     *
     */
    canAcceptJuanzhou(needPromp: boolean = false, checkDoing: boolean = true): boolean {
        if (!this.isJuanzhouOpen(needPromp)) {
            return false;
        }

        if (checkDoing && null != this.getDoingQuestByType(KeyWord.QUEST_TYPE_JUANZHOU, false, false)) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip('您同时只能领取一个卷轴任务。');
            }

            return false;
        }

        let totalCnt = this.jzTotalCnt;
        if (this.juanzhouNum >= totalCnt) {
            if (needPromp) {
                let info = uts.format('今天的{0}次数已用完', TextFieldUtil.getColorText('赏金卷', Color.GREEN));
                let myVip = G.DataMgr.heroData.curVipLevel;
                let moreLv = G.DataMgr.vipData.getMoreTimesVipLevel(myVip, KeyWord.VIP_PARA_FMBJ_EXT_NUM);
                if (moreLv <= myVip) {
                    G.TipMgr.showConfirm(info, ConfirmCheck.noCheck, '确定');
                }
                else {
                    info += '，提升vip等级可增加次数';
                    G.TipMgr.showConfirm(info, ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onConfirmRecharge));
                }
            }

            return false;
        }

        return true;
    }

    private _onConfirmRecharge(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open();
        }
    }

    get jzTotalCnt(): number {
        let extraTime: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_FMBJ_EXT_NUM, G.DataMgr.heroData.curVipLevel);

        return QuestData.JZ_QUEST_MAX_TIME + extraTime;
    }

    /**
     * 卷轴任务是否开放。
     * @param needPromp
     * @return
     *
     */
    isJuanzhouOpen(needPromp: boolean = false): boolean {
        if (G.DataMgr.heroData.level < this.juanzhouMinLv) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip('卷轴任务在' + this.juanzhouMinLv + '级后开放！');
            }

            return false;
        }

        if (this.juanzhouPreId > 0 && !this._checkPreQuest(this.juanzhouPreId, needPromp)) {
            // 检查前置任务
            return false;
        }

        return true;
    }

    private _checkPreQuest(preQuestId: number, needPromp: boolean = false): boolean {
        if (!this.isQuestCompleted(preQuestId)) //前置任务已经完成
        {
            if (needPromp) {
                G.TipMgr.addMainFloatTip('请先完成任务' + QuestData.getConfigByQuestID(preQuestId).m_szQuestTitle);
            }
            return false;
        }
        return true;
    }

    /**
     * 任务是循环随机的，同一个任务ID可以重复做，只要同一类型不超过限制就可以，因此这些按照类型去判断。
     * @param questConfig
     * @param heroData
     * @return
     *
     */
    private _checkQuestCompletedOrDoing(questConfig: GameConfig.QuestConfigM, heroData: HeroData): boolean {
        if (KeyWord.QUEST_TYPE_GUILD_DAILY == questConfig.m_ucQuestType) {
            if (!this.canAcceptGuild(questConfig.m_iConsignerNPCID, heroData, true, false, true)) {
                return true;
            }
        }
        else if (KeyWord.QUEST_TYPE_DAILY == questConfig.m_ucQuestType) {
            if (!this.canAcceptDaily(false, true)) {
                return true;
            }
        }
        else if (KeyWord.QUEST_TYPE_GUO_YUN == questConfig.m_ucQuestType) {
            // 国运任务一天可以做多次，只需检查当前是不是已经接了同系列的任务
            if (!this.canAcceptShip(questConfig.m_iConsignerNPCID, heroData, true, false, true)) {
                return true;
            }
        }
        else if (KeyWord.QUEST_TYPE_JUANZHOU == questConfig.m_ucQuestType) {
            // 卷轴任务一天可以做多次，只需检查当前是不是已经接了同系列的任务
            if (!this.canAcceptJuanzhou(false, true)) {
                return true;
            }
        }
        else if (this.isQuestCompleted(questConfig.m_iQuestID) || this.isQuestInDoingList(questConfig.m_iQuestID)) {
            // 已经完成或者已经在做了
            return true;
        }

        return false;
    }

    /**
     * 检查等级是否适合。
     * @param heroLevel 角色等级。
     * @param levelLowerLimit 任务等级下限。
     * @param levelUpperLimit 任务等级上限。
     * @return
     *
     */
    isLevelMeet(heroLevel: number, levelLowerLimit: number, levelUpperLimit: number): boolean {
        return (0 == levelLowerLimit || heroLevel >= levelLowerLimit) &&
            (0 == levelUpperLimit || heroLevel <= levelUpperLimit);
    }

    /**
     * 在某个完成列表里面寻找是否有指定的id
     * @param id
     * @param list
     * @return
     *
     */
    private _getIDInxInCmpList(id: number, list: Protocol.CompletedQuest[]): number {
        //这里暂时用顺序查找
        if (list == null)
            return -1;

        let len: number = list.length;
        for (let i: number = 0; i < len; ++i) {
            if (list[i].m_iQuestID == id)
                return i;

        }
        return -1;
    }

    /**
     * 主线任务的中的某一个任务是否完成
     * @param id
     * @return
     *
     */
    isMainQuestCompleteState(id: number): boolean {
        return this.m_completedQuests.isMainQuestCompleteState(id);
    }

    private _createDropMap(config: GameConfig.QuestConfigM): void {
        //[任务id， 掉落配置Vector.<QuestMonsterDropConfig_Flash>]
        if (config.m_astMonsterDropConfig != null) {
            this.m_monsterDropMap[config.m_iQuestID] = config.m_astMonsterDropConfig;
        }
    }

    /**
     * 检查每个任务配置，建立每个子任务对一个的子任务的map
     * @param config
     *
     */
    private _checkChildQuest(config: GameConfig.QuestConfigM): void {
        if (config.m_ucQuestType == KeyWord.QUEST_TYPE_CHILD)
            return;

        let nodeList: GameConfig.QuestNodeConfigCli[] = config.m_astQuestNodeConfig;
        let nodeConfig: GameConfig.QuestNodeConfigCli = null;
        let len: number = nodeList.length;
        for (let i: number = 0; i < len; ++i) {
            nodeConfig = nodeList[i];
            if (nodeConfig.m_ucType == KeyWord.QUEST_NODE_QUEST) {
                //					if(defines.has('_DEBUG'))
                //					{
                //						uts.assert(this.m_childQuestMap[nodeConfig.m_iThingID] == null, '一个子任务只能对应一个主任务');
                //					}
                this.m_childQuestMap[nodeConfig.m_iThingID] = config.m_iQuestID;
            }
        }
    }

    /**
     * 创建某任务的 Protocol.QuestProgress,节点不可能有子任务
     * @param questID
     * @return
     *
     */
    private _createProgressWhenAccept(questID: number): Protocol.QuestProgress {
        let result: Protocol.QuestProgress = {} as Protocol.QuestProgress;
        result.m_astNodeProgress = [];
        result.m_iQuestID = questID;

        let config: GameConfig.QuestConfigM = QuestData.m_questConfigMap[questID] as GameConfig.QuestConfigM;
        if (defines.has('_DEBUG')) {
            uts.assert(config != null, '数据必须不为空');
        }

        let nodeNum: number = config.m_astQuestNodeConfig.length;
        let nodeConfig: GameConfig.QuestNodeConfigCli;
        let nodeProgress: Protocol.QuestNodeProgress;
        for (let i: number = 0; i < nodeNum; i++) {
            nodeConfig = config.m_astQuestNodeConfig[i];

            result.m_astNodeProgress[i] = nodeProgress = {} as Protocol.QuestNodeProgress;
            nodeProgress.m_ucQuestProgressIndex = i;
            nodeProgress.m_shProgressValue = 0;

            if (KeyWord.QUEST_NODE_DIALOG == nodeConfig.m_ucType && QuestID.countryChat != questID) {
                // 对话任务直接完成，但是国家频道聊天任务除外，这个任务前台写死要说句话才能完成任务
                nodeProgress.m_shProgressValue = nodeConfig.m_shValue;
            }
            else if (KeyWord.QUEST_NODE_QUEST == nodeConfig.m_ucType) {
                // 子任务需要同步创建子任务进度
                if (defines.has('_DEBUG')) {
                    uts.assert(KeyWord.QUEST_NODE_QUEST != config.m_ucQuestType, '子任务不能嵌套：' + questID);
                }

                let childQp: Protocol.QuestProgress = this._createProgressWhenAccept(nodeConfig.m_iThingID);
                this.m_doingList.addChild(childQp);
            }
        }

        if (KeyWord.QUEST_TYPE_CHILD != config.m_ucQuestType) {
            result.m_ucNodeNumber = nodeNum;
            this.m_doingList.add(result);
        }

        return result;
    }

    /**
     * 在任务列表中随机挑选一个任务id
     * @param quests
     * @return
     *
     */
    private _getRandomQuest(quests: number[]): number {
        let len: number = quests.length;
        let random: number = Math.round(Math.random() * len);
        if (random >= len)
            random = len - 1;
        return quests[random];
    }

    /**
     * 获取指定任务类型的次数上限，不限次的任务返回0。
     * @param questType
     * @return
     *
     */
    getMaxCntByQuestType(questType: number): number {
        let maxCnt: number = 0;
        if (KeyWord.QUEST_TYPE_GUILD_DAILY == questType) {
            maxCnt = this.maxGuildQuestNum;
        }
        else if (KeyWord.QUEST_TYPE_GUO_YUN == questType) {
            maxCnt = this.maxGuoyunQuestNum;
        }
        else if (KeyWord.QUEST_TYPE_DAILY == questType) {
            maxCnt = QuestData.DAILY_QUEST_MAX_TIME;
        }

        return maxCnt;
    }

    /**
     * 获取指定任务类型的已完成次数，不限次的任务返回0。
     * @param questType
     * @return
     *
     */
    getFinishedCntByQuestType(questType: number): number {
        let finishedCnt: number = 0;
        if (KeyWord.QUEST_TYPE_GUILD_DAILY == questType) {
            finishedCnt = this.guildDailyCompletedNumer;
        }
        else if (KeyWord.QUEST_TYPE_GUO_YUN == questType) {
            finishedCnt = this.guoYunDayCompletedTimes;
        }
        else if (KeyWord.QUEST_TYPE_DAILY == questType) {
            finishedCnt = this.dailyCompleteTime;
        }

        return finishedCnt;
    }

    /**
     * 获取指定类型的正在做的一个任务进度。
     * @return
     *
     */
    getDoingQuestByType(type: number, noLvUp: boolean = false, noCompleting: boolean = true): Protocol.QuestProgress {
        let questConfig: GameConfig.QuestConfigM;
        if (null != this.m_doingList) {
            for (let qp of this.m_doingList.mainQuests) {
                questConfig = QuestData.m_questConfigMap[qp.m_iQuestID];
                // 提升等级类的任务，如果还没完成，那就直接跳过
                if (type == questConfig.m_ucQuestType && (!noLvUp || KeyWord.QUEST_NODE_LEVELUP != questConfig.m_astQuestNodeConfig[0].m_ucType || KeyWord.QUEST_NODE_FIGHT_POINT != questConfig.m_astQuestNodeConfig[0].m_ucType) && (!noCompleting || !this.isQuestCompleting(qp))) {
                    return qp;
                }
            }
        }
        return null;
    }

    /**
     * 获取指定类型的正在做的所有任务进度。
     * @return
     *
     */
    getDoingQuestListByType(type: number, noLvUp: boolean = false, noCompleting: boolean = true): Protocol.QuestProgress[] {
        let list: Protocol.QuestProgress[] = [];
        let questConfig: GameConfig.QuestConfigM;
        for (let qp of this.m_doingList.mainQuests) {
            questConfig = QuestData.m_questConfigMap[qp.m_iQuestID];
            // 提升等级类的任务，如果还没完成，那就直接跳过
            if (type == questConfig.m_ucQuestType && !(noLvUp && (KeyWord.QUEST_NODE_LEVELUP == questConfig.m_astQuestNodeConfig[0].m_ucType || KeyWord.QUEST_NODE_FIGHT_POINT == questConfig.m_astQuestNodeConfig[0].m_ucType)) && !(noCompleting && this.isQuestCompleting(qp))) {
                list.push(qp);
            }
        }
        return list;
    }

    getDoingQuestByScene(sceneID: number): boolean {
        let qp: Protocol.QuestProgress;
        let qn: Protocol.QuestNodeProgress;
        let questConfig: GameConfig.QuestConfigM;
        let questNav: GameConfig.NavigationConfigM;
        for (qp of this.m_doingList.mainQuests) {
            questConfig = QuestData.m_questConfigMap[qp.m_iQuestID];
            for (qn of qp.m_astNodeProgress) {
                questNav = G.DataMgr.sceneData.getQuestNav(questConfig.m_iQuestID, qn.m_ucQuestProgressIndex);
                let nodeType: number = questConfig.m_astQuestNodeConfig[qn.m_ucQuestProgressIndex].m_ucType;
                if (questNav != null && questNav.m_iSceneID == sceneID && (nodeType == KeyWord.QUEST_NODE_MONSTER || nodeType == KeyWord.QUEST_NODE_FMT_RANDOM)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取身上非升级节点类型的任务。
     * @param nodeType
     * @return
     *
     */
    getDoingQuestButLvUp(): Protocol.QuestProgress {
        let arr: Protocol.QuestProgress[] = [];
        for (let qp of this.m_doingList.mainQuests) {
            let questConfig = QuestData.m_questConfigMap[qp.m_iQuestID];

            // 提升等级类的任务，如果还没完成，那就直接跳过
            if (1 != questConfig.cannotAutoRunNode) {
                arr.push(qp);
            }
        }
        if (arr.length > 0) {
            arr.sort(delegate(this, this.sortDoingQuest));
            return arr[0];
        }
        return null;
    }

    /**
     * 获取身上具备指定节点类型的任务。
     * @param nodeType
     * @return
     *
     */
    getDoingProgressByNodeType(nodeType: number, nodeID = 0): Protocol.QuestProgress {
        let arr: Protocol.QuestProgress[] = [];
        for (let qp of this.m_doingList.mainQuests) {
            let questConfig = QuestData.m_questConfigMap[qp.m_iQuestID];
            let node = questConfig.m_astQuestNodeConfig[0];
            if (node.m_ucType == nodeType && (0 == nodeID || node.m_iThingID == nodeID)) {
                return qp;
            }
        }
        return null;
    }

    private sortDoingQuest(a: Protocol.QuestProgress, b: Protocol.QuestProgress): number {
        let cfgA = QuestData.getConfigByQuestID(a.m_iQuestID);
        let cfgB = QuestData.getConfigByQuestID(b.m_iQuestID);

        let da = QuestData.DoFirstNodeTypes.indexOf(cfgA.m_astQuestNodeConfig[0].m_ucType) >= 0 ? 1 : 0;
        let db = QuestData.DoFirstNodeTypes.indexOf(cfgB.m_astQuestNodeConfig[0].m_ucType) >= 0 ? 1 : 0;
        return db - da;
    }

    /**
     * @param npcId
     * @param level
     * @return
     *
     */
    canAcceptGuild(npcId: number, heroData: HeroData, checkLv: boolean = true, needPromp: boolean = false, checkDoing: boolean = true): boolean {
        let canAccept: boolean = (this.nextGuildQuestID > 0 && NPCID.guildQuestNpc == npcId);

        if (canAccept) {
            canAccept = (heroData.guildId > 0);
        }

        // 检查等级
        if (canAccept && checkLv) {
            canAccept = (heroData.level >= this.guildMinLv);
            if (!canAccept && needPromp) {
            }
        }

        if (canAccept) {
            canAccept = (this.guildDailyCompletedNumer < this.m_guildQuestMaxNum);
            if (!canAccept && needPromp) {
            }
        }

        if (canAccept && checkDoing) {
            canAccept = (null == this.getDoingQuestByType(KeyWord.QUEST_TYPE_GUILD_DAILY, false, false));
            if (!canAccept && needPromp) {
            }
        }

        // 检查前置任务
        if (canAccept) {
            let questConfig: GameConfig.QuestConfigM = QuestData.m_questConfigMap[this.nextGuildQuestID];
            if (questConfig.m_iPreQuestID > 0) {
                canAccept = this._checkPreQuest(questConfig.m_iPreQuestID, needPromp);
            }
        }

        return canAccept;
    }

    /**
     * 是否可以接日环任务
     * @param npcId
     * @param level
     * @return
     *
     */
    canAcceptDaily(needPromp: boolean = false, checkDoing: boolean = true): boolean {
        let canAccept: boolean = this.nextDailyQuestId > 0;

        if (canAccept) {
            canAccept = (this.dailyCompleteTime < QuestData.DAILY_QUEST_MAX_TIME);
            if (!canAccept && needPromp) {
                G.TipMgr.addMainFloatTip('您今天的日环任务已经做完了。');
            }
        }

        if (canAccept && checkDoing) {
            canAccept = (null == this.getDoingQuestByType(KeyWord.QUEST_TYPE_DAILY, false, false));
            if (!canAccept && needPromp) {
                G.TipMgr.addMainFloatTip('您还有未完成的日环任务。');
            }
        }

        // 检查前置任务
        if (canAccept) {
            let questConfig: GameConfig.QuestConfigM = QuestData.m_questConfigMap[this.nextDailyQuestId];
            if (questConfig.m_iPreQuestID > 0) {
                canAccept = this._checkPreQuest(questConfig.m_iPreQuestID, needPromp);
            }
        }

        return canAccept;
    }

    /**
     * npc身上是否可以接国运任务。
     * @param npcId
     * @param level
     * @return
     *
     */
    canAcceptShip(npcID: number, heroData: HeroData, checkLv: boolean = true, needPromp: boolean = false, checkDoing: boolean = true): boolean {
        if (0 == this.nextGuoYunQuestID) {
            return false;
        }

        let ret: boolean = true;

        if (this.guoyunConsignerNpcID != npcID) {
            ret = false;
        }
        else if (heroData.level < this.shipMinLv) {
            ret = false;
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('护送活动在{0}级后开放！', this.shipMinLv));
            }
        }
        //			else if(!G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_GUOYUN))
        //			{
        //				ret = false;
        //				if(needPromp)
        //				{
        //					G.TipMgr.addMainFloatTip('国运活动尚未开启！');
        //				}
        //			}
        else if (checkDoing && null != this.getDoingQuestByType(KeyWord.QUEST_TYPE_GUO_YUN, false, false)) {
            ret = false;
            if (needPromp) {
                G.TipMgr.addMainFloatTip('您正在护送之中。');
            }
        }
        else if (this.guoYunDayCompletedTimes >= this.maxGuoyunQuestNum) {
            ret = false;
            if (needPromp) {
                G.TipMgr.addMainFloatTip('您今天的护送任务已经做完了。');
            }
        }
        else {
            if (this.guoyunPreId > 0) {
                ret = this._checkPreQuest(this.guoyunPreId, needPromp);
            }
        }

        return ret;
    }

    /**
     * 获取指定的任务正在进行中的第一个节点的进度。如果实在没有还没完成的节点，则返回最后1个节点。
     * <font color='ff0000'>注意这个接口会跳过已经完成的节点！</font>
     * @param questID
     * @return
     *
     */
    getQuestDoingNodeProgress(questID: number, nodeIndex: number = -1): Protocol.QuestNodeProgress {
        let qp: Protocol.QuestProgress = this.getQuestProgress(questID);
        if (qp == null || qp.m_iQuestID == 0) {
            return null;
        }

        let questConfig: GameConfig.QuestConfigM = QuestData.m_questConfigMap[qp.m_iQuestID];
        let nodes: GameConfig.QuestNodeConfigCli[] = questConfig.m_astQuestNodeConfig;
        let node: GameConfig.QuestNodeConfigCli;
        let nodeProgress: Protocol.QuestNodeProgress;
        let firstNodePgs: Protocol.QuestNodeProgress;
        for (let i: number = 0; i < questConfig.m_ucQuestNodeNumber; i++) {
            nodeProgress = qp.m_astNodeProgress[i];
            node = nodes[nodeProgress.m_ucQuestProgressIndex];

            if (Math.floor(node.m_shValue) > qp.m_astNodeProgress[i].m_shProgressValue) //小于一般是不会出现的
            {
                if (nodeIndex < 0) {
                    // 没有指定节点index，直接返回
                    return nodeProgress;
                }
                else {
                    // 指定了任务节点
                    if (nodeIndex == nodeProgress.m_ucQuestProgressIndex) {
                        // 正是指定的节点，直接返回
                        return nodeProgress;
                    }
                }

                // 记录第一个可用的
                if (null == firstNodePgs) {
                    firstNodePgs = nodeProgress;
                }
            }
        }

        if (null != firstNodePgs) {
            return firstNodePgs;
        }
        else {
            return qp.m_astNodeProgress[questConfig.m_ucQuestNodeNumber - 1];
        }
    }

    ////////////////////////////////////////////////// 国运任务 //////////////////////////////////////////////////

    updateCurrentGuoyunLv(): void {
        let lv: number = 0;
        for (let quest of this.m_doingList.mainQuests) {
            if (KeyWord.QUEST_TYPE_GUO_YUN == QuestData.m_questConfigMap[quest.m_iQuestID].m_ucQuestType) {
                //最后一位表示任务level，对不上找saga
                lv = quest.m_iQuestID % 10;
                break;
            }
        }

        let oldLv: number = G.DataMgr.heroData.guoyunLevel;
        if (oldLv != lv) {
            G.ModuleMgr.unitModule.onRoleGuoyunChange(null, lv);
        }
    }

    ////////////////////////////////////////////////// 任务飞行 //////////////////////////////////////////////////

    /**
     * 初始化任务飞行配置。
     * @param configs
     *
     */
    private setFlyConfig(): void {
        let data: GameConfig.QuestFlyConfigM[] = G.Cfgmgr.getCfg('data/QuestFlyConfigM.json') as GameConfig.QuestFlyConfigM[];

        this.m_flyMap = {};
        for (let config of data) {
            this.m_flyMap[config.m_iQuestID] = true;
        }
    }

    /**
     * 是否可以传送。
     * @param id 任务ID。
     * @return
     *
     */
    shouldFly(id: number): boolean {
        return this.m_flyMap[id];
    }

    ////////////////////////////////////////////////// 其他 //////////////////////////////////////////////////

    /**
     * 判断id对应的是不是子任务
     * @param id
     * @return
     *
     */
    static isChildQuestByID(id: number): boolean {
        let config: GameConfig.QuestConfigM = QuestData.m_questConfigMap[id];
        if (config == null) {
            return false;
        }

        return config.m_ucQuestType == KeyWord.QUEST_TYPE_CHILD;
    }

    /**
     * 通过子任务ID取得该子任务所在的主任务
     * @param childID
     * @return
     *
     */
    getMainIDByChildID(childID: number): number {
        return this.m_childQuestMap[childID];
    }

    getOperationStr(operation: number): string {
        if (QuestAction.accept == operation)
            return '领取';
        else if (QuestAction.abandon == operation)
            return '放弃';
        else if (QuestAction.complete == operation)
            return '完成';
        return '未知操作';
    }

    getQuestsByPinstance(pid: number): number[] {
        return this.m_pinstance2Quests[pid];
    }

    get doingTrunk(): number {
        return this.m_doingList.doingTrunk;
    }

    get nextTrunk(): number {
        return this.m_completedQuests.nextTrunk;
    }

    /**
     * 此类任务一般都是随机，且同时只能接取一个，且可重复id
     * @param type
     */
    static isSpecialQuestByType(type: number): boolean {
        return KeyWord.QUEST_TYPE_JUANZHOU == type || KeyWord.QUEST_TYPE_TREASURE_HUNT == type/* || KeyWord.QUEST_TYPE_PROF == type || KeyWord.QUEST_TYPE_FRONT_LINE == type ||
            KeyWord.QUEST_TYPE_HUANG_BANG == type || KeyWord.QUEST_TYPE_XUKONG == type*/;
    }


    static isDailyQuestByType(type: number): boolean {
        // 日常环任务节点不在可接任务中出现
        return QuestData.LOOP_DAILY_TYPES.indexOf(type) >= 0;
    }

    static getConfigMap(): { [questID: number]: GameConfig.QuestConfigM } {
        return QuestData.m_questConfigMap;
    }

    /**
     * 根据跳跃点ID获取相关的任务ID。
     * @param tpID
     * @return
     *
     */
    getQuestByJumpID(tpID: number): number[] {
        return this.m_jumpID2QuestID[tpID];
    }

    //////////////////////////////////////////////////推荐任务相关//////////////////////////////////////////////////////
    private setGuideConfigs() {
        let data: GameConfig.QuestGuildConfigM[] = G.Cfgmgr.getCfg('data/QuestGuildConfigM.json') as GameConfig.QuestGuildConfigM[];

        for (let config of data) {
            this.m_tjQuestMap[config.m_iQuestID] = config;
        }
    }

    getTjQuest(questID: number): GameConfig.QuestGuildConfigM {
        return this.m_tjQuestMap[questID];
    }
}