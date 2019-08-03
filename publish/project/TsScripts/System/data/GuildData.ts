import { Constants } from "System/constants/Constants";
import { EnumRewardState } from "System/constants/GameEnum";
import { GuildRule } from "System/constants/GuildRule";
import { KeyWord } from "System/constants/KeyWord";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { Global as G } from "System/global";
import { GuildTools } from "System/guild/GuildTools";
import { Macros } from "System/protocol/Macros";
import { Color } from "System/utils/ColorUtil";
import { CompareUtil } from "System/utils/CompareUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { SkillData } from 'System/data/SkillData'

/**
 * 宗门数据
 * @author jesse
 *
 */
export class GuildData {

    static readonly MONSTER_REWARD_SCORE_GROUP = [
        Macros.ZZHC_GUILD_REWARD_SCORE_1, Macros.ZZHC_GUILD_REWARD_SCORE_2,
        Macros.ZZHC_GUILD_REWARD_SCORE_3, Macros.ZZHC_GUILD_REWARD_SCORE_4];
    static readonly MONSTER_SKILL_IDS: number[] = [51027601, 51027501];
    static readonly MONSTER_SKILL_OPEN_LV: number[] = [2, 4];


    static readonly JOIN_GUILD_MIN_TIME = 8;
    static readonly MaxExploreClass = 4;
    static readonly MaxExploreEnergy = 3;
    /**探险怪物数量*/
    static readonly ExploreMonsterCnt = 400;

    /**宗门最大等级*/
    MAX_GUILD_LEVEL: number = 0;

    /**宗门级别配置*/
    private m_levelConfigs: { [guildLevel: number]: GameConfig.GuildLevelM };

    /**玩家的宗门简要信息，在登录的时候下发，在存在guildAbstract的情况下优先使用guildAbstract。*/
    private m_guildInfo: Protocol.GuildInfo;

    /**主角所申请的宗门列表*/
    auiGuildIDArray: number[];

    /**宗门基本信息。*/
    guildAbstract: Protocol.Get_GuildAbstract_Value_Response;

    /**宗门仓库格子信息*/
    guildDepotInfo: Protocol.GuildStoreInfo;

    /**每天宗派仓库捐献数量 */
    guildStoreDonateTimers: number;

    /**我的宗门的当前申请排队*/
    applicationInfoList: Protocol.GuildApplicantInfo[];

    /**宗门成员信息列表*/
    guildMemberList: Protocol.GuildMemberList;
    /**宗门仓库记录列表*/
    guildRecordList: Protocol.GuildStoreLogList;
    /**宗门查询列表*/
    m_stGuildList: Protocol.GuildQueryList;
    /**寻宝数据*/
    m_stXunBaoData: Protocol.GuildXunBaoData;
    /**寻宝领取次数*/
    m_auiXunBaoHelpCount: number[];
    /**有宗门期间今日累计消费*/
    m_uiAccConsume: number = 0;
    /**宗门资金排行信息*/
    m_stMoneyRankList: Protocol.GuildMoneyRankListRsp;
    /**宗门资金排行 领取信息*/
    m_stMoneyRankGet: Protocol.GuildMoneyRankGetRsp;
    /**宗门领取状态*/
    m_ucMoneyRankGet: number = 1;

    /**宗门拍卖*/
    m_stPaiMaiOpenGuild: Protocol.PaiMaiOpenGuildRsp;
    m_stPaiMaiOpenWorld: Protocol.PaiMaiOpenWorldRsp;
    m_stPaiMaiSelf: Protocol.PaiMaiSelfRsp;

    private _depotDonateSelectVec: number[];

    /**宗门仓库摧毁数组*/
    private _depotDestoryVec: ThingItemData[];

    private id2exploreEventCfg: { [id: number]: GameConfig.GuildTreasureHuntEventM } = {};
    private id2exploreProgressCfg: { [id: number]: GameConfig.GuildTreasureHuntProcessM } = {};
    exploreInfo: Protocol.GuildTreasureHuntGetInfo_Response;

    private _monsterPanelInfo: Protocol.GuildZZHCPannelRsp;

    private _monsterRewardStatusList: number[] = [-1, -1, -1, -1];
    private _guildMonsterCfg: { [lv: number]: GameConfig.GuildZZHCBossM } = {};

    public _guildMonsterCfgs: GameConfig.GuildZZHCBossM[];

    get MonsterPanelInfo(): Protocol.GuildZZHCPannelRsp {
        return this._monsterPanelInfo;
    }

    set MonsterPanelInfo(value: Protocol.GuildZZHCPannelRsp) {
        this._monsterPanelInfo = value;
        this.updateMonsterStatusList();
    }

    get MonsterRewardStatusList(): number[] {
        return this._monsterRewardStatusList;
    }

    updateMonsterStatusList() {
        let gotStatus = this._monsterPanelInfo.m_stGiftGet.m_aucStatus;
        let donateValue = 0;
        let takeUpCityIndex = G.DataMgr.kfLingDiData.getCurTakeUpCityIndex();
        for (let i = 0; i < GuildData.MONSTER_REWARD_SCORE_GROUP.length; i++) {
            if (gotStatus[i] == Macros.GOD_LOAD_AWARD_DONE_GET) {
                this._monsterRewardStatusList[i] = EnumRewardState.HasGot;
                continue;
            }

            if (this._canGetMonsterReward(i)) {
                this._monsterRewardStatusList[i] = EnumRewardState.NotGot;
                continue;
            }

            this._monsterRewardStatusList[i] = EnumRewardState.NotReach;
        }
    }

    private _canGetMonsterReward(treasureIndex: number): boolean {
        let donateValue = this._monsterPanelInfo.m_stGiftGet.m_uiDayGongXian;
        if (donateValue < GuildData.MONSTER_REWARD_SCORE_GROUP[treasureIndex]) return false;

        let cityIndex = G.DataMgr.kfLingDiData.getCurTakeUpCityIndex();
        switch (treasureIndex) {
            //积分达到即可领取
            case 0: return true;
            //占领任意城市可领取
            case 1: return !(cityIndex < 0);
            //占领两个卫城可领取
            case 2: return cityIndex < 3 && !(cityIndex < 0);
            //占领主城可领取
            case 3: return cityIndex == 0;
        }

        return false;
    }

    /**是否达到城市占领条件*/
    isReachCityCount(treasureIndex: number): boolean {
        let cityIndex = G.DataMgr.kfLingDiData.getCurTakeUpCityIndex();
        uts.log(cityIndex + 'cityIndex');
        switch (treasureIndex) {
            //积分达到即可领取
            case 0: return true;
            //占领任意城市可领取
            case 1: return !(cityIndex < 0);
            //占领两个卫城可领取
            case 2: return cityIndex < 3 && !(cityIndex < 0);
            //占领主城可领取
            case 3: return cityIndex == 0;
        }
    }


    updateMonsterGiftInfo(data: Protocol.GuildZZHCGiftGetRspRsp) {
        this._monsterPanelInfo.m_stGiftGet = data;
        this.updateMonsterStatusList();
    }

    updateMonsterFeedInfo(data: Protocol.GuildZZHCBossFeedRsp) {
        this._monsterPanelInfo.m_stBossFeed = data;
    }

    hasMonster2Feed(): boolean {
        if (G.DataMgr.heroData.guildId <= 0) return false;
        return G.DataMgr.heroData.jingPo > 0;
    }

    hasReward(): boolean {
        let statusList = this._monsterRewardStatusList;
        for (let i = statusList.length - 1; i >= 0; i--) {
            return statusList[i] == EnumRewardState.NotGot;
        }
        return false;
    }

    onCfgReady() {
        this.setGuildLevelConfig();
        this.setGuildMoneyRankConfig();
        this.setGuildTreasureHuntEventCfgs();
        this.setGuildTreasureHuntProgressCfgs();
        this.setGuildMonsterCfg();
        this.setGuildPaiMaiSourceCfg();
    }

    private setGuildMonsterCfg() {
        let cfgs: GameConfig.GuildZZHCBossM[] = G.Cfgmgr.getCfg('data/GuildZZHCBossM.json') as GameConfig.GuildZZHCBossM[];
        this._guildMonsterCfgs = cfgs;
        for (let cfg of cfgs) {
            this._guildMonsterCfg[cfg.m_iLevel] = cfg;
        }
    }

    get GuildMonsterCfg(): { [lv: number]: GameConfig.GuildZZHCBossM } {
        return this._guildMonsterCfg;
    }

    /**
     * 检查是否可以加入宗门。
     * @param needPrompt
     * @return
     *
     */
    canJoinGuild(needPrompt: boolean = false): boolean {
        if (Constants.GUILD_JOIN_MIN_LV > G.DataMgr.heroData.level) {
            if (needPrompt) {
                G.TipMgr.addMainFloatTip(uts.format('{0}级之后才能加入宗门哦！', Constants.GUILD_JOIN_MIN_LV));
            }
            return false;
        }

        if (0 != G.DataMgr.heroData.guildId) {
            if (needPrompt) {
                G.TipMgr.addMainFloatTip('您已经有宗门了。');
            }
            return false;
        }

        return true;
    }

    /**
     * 更新宗门简要信息。
     * @param guildInfo
     *
     */
    updateGuildInfo(guildInfo: Protocol.GuildInfo): void {
        this.m_guildInfo = guildInfo;
        G.DataMgr.heroData.guildJoinTime = guildInfo.m_uiJoinTime;
    }

    updateGuildMemberList(memberList: Protocol.GuildMemberList) {
        this.guildMemberList = memberList;
        // 检查是否有新的领导
        if (null != this.guildAbstract) {
            let leaderList: Protocol.GuildMemberList = this.guildAbstract.m_stLeaderList;
            // 先去掉已经出局的领导
            for (let i = leaderList.m_ushNumber - 1; i >= 0; i--) {
                let memberInfo = leaderList.m_astGuildMemberInfo[i];

                let notLeader: boolean = false;
                for (let leader of leaderList.m_astGuildMemberInfo) {
                    if (CompareUtil.isRoleIDEqual(leader.m_stRoleID, memberInfo.m_stRoleID)) {
                        if (memberInfo.m_ucGrade != Macros.GUILD_GRADE_VICE_CHAIRMAN && memberInfo.m_ucGrade != Macros.GUILD_GRADE_CHAIRMAN) {
                            notLeader = true;
                        }
                        break;
                    }
                }

                if (notLeader) {
                    leaderList.m_astGuildMemberInfo.splice(i, 1);
                    leaderList.m_ushNumber--;
                }
            }
            // 再加入新进的领导
            for (let i = 0; i < memberList.m_ushNumber; ++i) {
                let memberInfo = memberList.m_astGuildMemberInfo[i];
                if (memberInfo.m_ucGrade == Macros.GUILD_GRADE_VICE_CHAIRMAN || memberInfo.m_ucGrade == Macros.GUILD_GRADE_CHAIRMAN) {
                    let notExist: boolean = true;
                    for (let leader of leaderList.m_astGuildMemberInfo) {
                        if (CompareUtil.isRoleIDEqual(leader.m_stRoleID, memberInfo.m_stRoleID)) {
                            notExist = false;
                            break;
                        }
                    }

                    if (notExist) {
                        leaderList.m_astGuildMemberInfo.push(memberInfo);
                        leaderList.m_ushNumber++;
                    }
                }
            }
        }
    }

    /**
     * 处理踢玩家
     * @param kickedRoleID
     */
    processKickMember(kickedRoleID: Protocol.RoleID) {
        if (this.guildMemberList) {
            for (let i = this.guildMemberList.m_ushNumber - 1; i >= 0; i--) {
                if (CompareUtil.isRoleIDEqual(this.guildMemberList.m_astGuildMemberInfo[i].m_stRoleID, kickedRoleID)) {
                    this.guildMemberList.m_astGuildMemberInfo.splice(i, 1);
                    this.guildMemberList.m_ushNumber--;
                    if (null != this.guildAbstract) {
                        this.guildAbstract.m_ucMemberNumber--;
                    }
                    break;
                }
            }
        }
    }

    processSetPosition(targetRoleID: Protocol.RoleID, targetGrade: number) {
        if (this.guildMemberList) {
            // 宗主只有1个，需要替换
            for (let memberInfo of this.guildMemberList.m_astGuildMemberInfo) {
                if (CompareUtil.isRoleIDEqual(memberInfo.m_stRoleID, targetRoleID)) {
                    memberInfo.m_ucGrade = targetGrade;
                    if (Macros.GUILD_GRADE_CHAIRMAN != targetGrade) {
                        // 如果任命的不是宗主，那么无需排他，直接退出循环
                        break;
                    }
                } else {
                    // 如果任命的是宗主，那么原来的宗主需要还原为成员
                    if (Macros.GUILD_GRADE_CHAIRMAN == targetGrade && Macros.GUILD_GRADE_CHAIRMAN == memberInfo.m_ucGrade) {
                        memberInfo.m_ucGrade = Macros.GUILD_GRADE_MEMBER;
                    }
                }
            }
        }
    }

    /**是否是超级管理者*/
    get isManager(): boolean {
        return GuildTools.checkIsManager(this.grade);
    }

    /**是否有职位*/
    get isHasPos(): boolean {
        return GuildTools.checkIsHasPos(this.grade);
    }

    get guildLevel(): number {
        // 优先使用这个
        if (null != this.guildAbstract) {
            return this.guildAbstract.m_ucGuildLevel;
        }

        return 1;
    }

    /**
     * 更新玩家的职位
     * @param value
     *
     */
    set grade(value: number) {
        if (null == this.guildAbstract) {
            // 这个的使用优先级比较低，因为这个包含的信息不是最新的，这个只是登录的时候下发的
            this.m_guildInfo.m_ucGrade = value;
        }
        else {
            // 优先使用这个
            this.guildAbstract.m_ushGrade = value;
        }
        this.processSetPosition(G.DataMgr.heroData.roleID, value);
    }

    /**
     * 查询玩家职位
     * @return
     *
     */
    get grade(): number {
        if (null == this.guildAbstract) {
            // 这个的使用优先级比较低，因为这个包含的信息不是最新的，这个只是登录的时候下发的
            if (this.m_guildInfo) {
                return this.m_guildInfo.m_ucGrade;
            }
            else {
                return 0;
            }
        }
        else {
            // 优先使用这个
            if (this.guildAbstract) {
                return this.guildAbstract.m_ushGrade;
            }
            else {
                return 0;
            }
        }
    }

    get guildName(): string {
        if (null == this.guildAbstract) {
            // 这个的使用优先级比较低，因为这个包含的信息不是最新的，这个只是登录的时候下发的
            if (this.m_guildInfo) {
                return this.m_guildInfo.m_szGuildName;
            }
            else {
                return '无';
            }
        }
        else {
            // 优先使用这个
            if (this.guildAbstract) {
                return this.guildAbstract.m_szGuildName;
            }
            else {
                return '无';
            }
        }
    }

    private setGuildLevelConfig(): void {
        let data: GameConfig.GuildLevelM[] = G.Cfgmgr.getCfg('data/GuildLevelM.json') as GameConfig.GuildLevelM[];
        this.m_levelConfigs = {};
        let levelData: GameConfig.GuildLevelM = null;
        for (levelData of data) {
            this.m_levelConfigs[levelData.m_uchGuildLv] = levelData;
        }

        this.MAX_GUILD_LEVEL = Math.max(levelData.m_uchGuildLv, this.MAX_GUILD_LEVEL);
    }

    private _compareLevelConfig(a: GameConfig.GuildLevelM, b: GameConfig.GuildLevelM): number {
        return a.m_uchGuildLv - b.m_uchGuildLv;
    }

    getGuildLevelConfig(level: number): GameConfig.GuildLevelM {
        return this.m_levelConfigs[level];
    }

    ///////////////////////////////////////////// 宗门探险 /////////////////////////////////////////////

    private setGuildTreasureHuntEventCfgs(): void {
        let cfgs = G.Cfgmgr.getCfg('data/GuildTreasureHuntEventM.json') as GameConfig.GuildTreasureHuntEventM[];
        for (let cfg of cfgs) {
            this.id2exploreEventCfg[cfg.m_iID] = cfg;
        }
    }

    getExploreEventCfg(id: number): GameConfig.GuildTreasureHuntEventM {
        return this.id2exploreEventCfg[id];
    }

    private setGuildTreasureHuntProgressCfgs(): void {
        let cfgs = G.Cfgmgr.getCfg('data/GuildTreasureHuntProcessM.json') as GameConfig.GuildTreasureHuntProcessM[];
        for (let cfg of cfgs) {
            this.id2exploreProgressCfg[cfg.m_iID] = cfg;
        }
    }

    getExploreProgressCfg(id: number): GameConfig.GuildTreasureHuntProcessM {
        return this.id2exploreProgressCfg[id];
    }

    setExploreInfo(exploreInfo: Protocol.GuildTreasureHuntGetInfo_Response) {
        this.exploreInfo = exploreInfo;
    }

    updateExploreInfo(comm: Protocol.GuildTreasureHuntData, personal: Protocol.GuildTreasureHuntPersonalData) {
        if (null != this.exploreInfo) {
            this.exploreInfo.m_stCommonData = comm;
            this.exploreInfo.m_stPersonalData = personal;
        } else {
            this.exploreInfo = { m_stCommonData: comm, m_stPersonalData: personal };
        }
    }

    canDoGuildExplore(): boolean {
        if (this.exploreInfo != null && G.DataMgr.heroData.guildId > 0) {
            let type = this.exploreInfo.m_stCommonData.m_uiEventType;
            let config = this.getExploreEventCfg(this.exploreInfo.m_stCommonData.m_uiEventID);
            if (type == Macros.GUILD_TREASURE_HUNT_EVENT_NONE || type == Macros.GUILD_TREASURE_HUNT_EVENT_MOVE) {//没有事件，移动事件没有提示
                return false;
            }
            if (type == Macros.GUILD_TREASURE_HUNT_EVENT_END) {//结束了领奖励了
                return this.exploreInfo.m_stPersonalData.m_ucRewardStatus == Macros.KF_ACT_STATUS_ARIVE || this.exploreInfo.m_stPersonalData.m_ucSpecialRewardStatus == Macros.KF_ACT_STATUS_ARIVE;
            }
            else if (type == Macros.GUILD_TREASURE_HUNT_EVENT_SELECT) {//选择事件
                return this.exploreInfo.m_stPersonalData.m_stEventData.m_ucSelectNo == Macros.GUILD_TREASURE_HUNT_SELECT_NONE;
            }
            else if (type == Macros.GUILD_TREASURE_HUNT_EVENT_DONATION) {//捐赠事件只要当前消耗货币的拥有数量大于消耗最小数量就提示
                return config.m_astDonation[0].m_uiCost <= this.exploreInfo.m_stPersonalData.m_uiPower && G.DataMgr.getOwnValueByID(config.m_uiTarget) >= config.m_astDonation[0].m_uiNum;
            }
            else if (type == Macros.GUILD_TREASURE_HUNT_EVENT_BOSS || type == Macros.GUILD_TREASURE_HUNT_EVENT_TASK) {
                //体力够了打怪或boss
                return this.exploreInfo.m_stPersonalData.m_uiPower >= config.m_astDonation[0].m_uiCost;
            }
        }

        return false;
    }

    ///////////////////////////////////////////// 宗门申请 /////////////////////////////////////////////

    /**
     *查询指定宗门是否已申请
     * @param guildId
     * @return
     *
     */
    isGuildApplied(guildId: number): boolean {
        if (G.DataMgr.heroData.guildId > 0) {
            return false;
        }

        if (this.auiGuildIDArray == null) {
            return false;
        }

        for (let guild of this.auiGuildIDArray) {
            if (guildId == guild) {
                return true;
            }
        }

        return false;
    }

    ///////////////////////////////////////////// 宗门捐献 /////////////////////////////////////////////

    /**
     * 更新捐献。
     * @param response
     *
     */
    updateDonate(response: Protocol.Guild_Donate_Response): void {
        if (null != this.guildAbstract) {
            this.guildAbstract.m_uiGuildMoney = response.m_uiGuildMoney;
        }
    }

    /**进入宗门秘境*/
    gotoGuildSecrectArea(): void {
        if (G.DataMgr.heroData.guildId > 0) {
            if (this.guildLevel >= Macros.MIN_ZPFM_ACT_GUILD_LEVEL) {
                // 宗门黑洞
                G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_ZPFM_ACT);
            }
            else {
                G.TipMgr.addMainFloatTip(uts.format('您的宗门等级未达到{0}级，请提升等级后参与！', TextFieldUtil.getColorText(Macros.MIN_ZPFM_ACT_GUILD_LEVEL.toString(), Color.RED)));
            }
        }
        else {
            G.TipMgr.addMainFloatTip('您没有加入宗门，无法参加宗门秘境活动');
        }
    }

    /**获取宗门资金进度文本*/
    getGuildMoneyProgressStr(): string {
        let guildMoneyStr: string = '0';
        let str: string;
        let level: number = 1;
        if (this.guildAbstract) {
            level = this.guildAbstract.m_ucGuildLevel;
            guildMoneyStr = this.guildAbstract.m_uiGuildMoney.toString();
        }
        // 当前宗门资金和升级需要金额
        let guildConfig: GameConfig.GuildLevelM = G.DataMgr.guildData.getGuildLevelConfig(level);
        let tipContent: string;
        if (guildConfig != null) {
            if (this.guildAbstract) {
                str = guildMoneyStr;
                if (this.guildAbstract.m_ucGuildLevel < this.MAX_GUILD_LEVEL) {
                    str += '/' + guildConfig.m_uiXP;
                }
            }
        }
        else {
            str = TextFieldUtil.getColorText(guildMoneyStr, Color.DEFAULT_WHITE);
        }
        return str;
    }

    getGuildMoneyProgress(): number {
        let rntValue = 0;

        let curMoney = 0;
        let curLevel = 1;
        if (this.guildAbstract) {
            curMoney = this.guildAbstract.m_uiGuildMoney;
            curLevel = this.guildAbstract.m_ucGuildLevel;
        }
        let guildConfig: GameConfig.GuildLevelM = G.DataMgr.guildData.getGuildLevelConfig(curLevel);
        if (guildConfig != null) {
            if (this.guildAbstract) {
                if (this.guildAbstract.m_ucGuildLevel < this.MAX_GUILD_LEVEL) {
                    rntValue = curMoney / guildConfig.m_uiXP;
                }
            }
        }

        return rntValue;
    }

    /**宗门资金浮窗提示文本*/
    getGuildMoneyTipStr(): string {
        let level: number = 1;
        if (this.guildAbstract) {
            level = this.guildAbstract.m_ucGuildLevel;
        }
        // 当前宗门资金和升级需要金额
        let guildConfig: GameConfig.GuildLevelM = G.DataMgr.guildData.getGuildLevelConfig(level);
        let tipContent: string;
        if (guildConfig != null) {
            tipContent = uts.format('升级需要：{1}点宗门资金\n宗门捐献可快速获得大量宗门资金，\n宗门资金达到升级资金时将自动升级\n宗门等级，并扣除相应宗门资金。', guildConfig.m_uiXP);
        }
        else {
            tipContent = '宗门已达最高等级';
        }
        return tipContent;
    }

    /**获取宗门仓库捐献是否勾选*/
    getIsDepotDonateSelect(index: number): boolean {
        return this.depotDonateSelectVec[index] >= 0;
    }

    /**检测宗门仓库捐献选择状态是否正确*/
    checkDepotDonateSelectIsRight(index: number, pos: number): void {
        if (this.depotDonateSelectVec[index] != pos) {
            this.depotDonateSelectVec[index] = -1;
        }
    }

    /**设置宗门仓库捐献状态*/
    setDepotDonateSelectState(index: number, pos: number = -1): void {
        this.depotDonateSelectVec[index] = pos;
    }

    /**宗门仓库捐献选择数组*/
    private get depotDonateSelectVec(): number[] {
        if (!this._depotDonateSelectVec) {
            this._depotDonateSelectVec = new Array<number>()
            for (let i: number = 0; i < GuildRule.GuildDepotDonateDialog_PAGE_SIZE; i++) {
                this._depotDonateSelectVec.push(-1);
            }
        }
        return this._depotDonateSelectVec;
    }

    get depotDestoryVec(): ThingItemData[] {
        if (!this._depotDestoryVec) {
            this._depotDestoryVec = new Array<ThingItemData>();
        }
        return this._depotDestoryVec;
    }

    /**每日福利是否可以领取*/
    isDayWelfareCanGet(): boolean {
        let canGet = false;
        if (this.guildAbstract) {
            if (this.guildAbstract.m_ucDayGiftGet == 0) {
                let config = this.getGuildLevelConfig(this.guildAbstract.m_ucGuildLevel);
                if (config == null) return false;
                canGet = G.DataMgr.heroData.guildDonateCur >= config.m_uiDayCost;
            }
        }
        return canGet;
    }

    /**等级福利是否可以领取*/
    isLevelWelfareCanGet(): boolean {
        let canGet: boolean = false;
        if (this.guildAbstract) {
            let curGuildLevel: number = this.guildAbstract.m_ucGuildLevel;
            let getLevel: number = this.guildAbstract.m_ucLevelGiftGet;
            canGet = getLevel < curGuildLevel;
        }
        return canGet;
    }

    /**获取宗门申请人数*/
    getGuildApplyCount(): number {
        let count: number = 0;
        if (G.DataMgr.guildData.applicationInfoList) {
            count = G.DataMgr.guildData.applicationInfoList.length;
        }
        return count;
    }

    /**添加宗门仓库摧毁物品*/
    addDepotDestroyThing(thingData: ThingItemData): void {
        if (!this.checkDepotHasDestroyThing(thingData)) {
            if (this.depotDestoryVec.length >= Macros.MAX_GUILD_STORE_OUT_NUM) {
                G.TipMgr.addMainFloatTip(uts.format('一键摧毁最多只能摧毁：{0}', Macros.MAX_GUILD_STORE_OUT_NUM));
            }
            else {
                this.depotDestoryVec.push(thingData);
            }
        }
        else {
            G.TipMgr.addMainFloatTip('该物品已在摧毁列表中');
        }
    }

    /**检查宗门仓库摧毁使用有此物品*/
    checkDepotHasDestroyThing(thingData: ThingItemData): boolean {
        if (thingData && thingData.data && thingData.config.m_iID > 0) {
            //判断重复
            for (let thing of this.depotDestoryVec) {
                if (thing && thing.data && thing.config.m_iID == thingData.config.m_iID//
                    && thing.data.m_iNumber == thingData.data.m_iNumber//
                    && thing.data.m_usPosition == thingData.data.m_usPosition) {
                    return true;
                }
            }
        }
        return false;
    }

    /**删除宗门仓库摧毁列表物品*/
    deleteDepotDestroyThing(thingData: ThingItemData): void {
        if (thingData && thingData.data && thingData.config.m_iID > 0) {
            //判断重复
            let len: number = this.depotDestoryVec.length;
            for (let i: number = 0; i < len; i++) {
                let thing: ThingItemData = this.depotDestoryVec[i];
                if (thing && thing.data && thing.config.m_iID == thingData.config.m_iID//
                    && thing.data.m_iNumber == thingData.data.m_iNumber//
                    && thing.data.m_usPosition == thingData.data.m_usPosition) {
                    this.depotDestoryVec.splice(i, 1);
                    return;
                }
            }
        }
    }

    /**清空宗门仓库摧毁列表物品*/
    cleanDepotDestroyThing(): void {
        this.depotDestoryVec.length = 0;
    }

    private guildRankConfigMap: { [id: number]: GameConfig.GuildMoneyRankM } = {};
    private setGuildMoneyRankConfig() {
        let data: GameConfig.GuildMoneyRankM[] = G.Cfgmgr.getCfg('data/GuildMoneyRankM.json') as GameConfig.GuildMoneyRankM[];
        for (let cfg of data) {
            this.guildRankConfigMap[cfg.m_iRanking] = cfg;
        }
    }

    getGuildMoneyRankConfig(id: number) {
        return this.guildRankConfigMap[id];
    }


    isShowGuildRankTipMark() {
        if (this.m_ucMoneyRankGet == Macros.GOD_LOAD_AWARD_WAIT_GET) {
            return true;
        }
        return false;
    }

    ///////////////////////宗门资金排行//////////////////////////////



    //////////////////////////宗门拍卖////////////////////
    ///**宗门拍卖*/
    //m_stPaiMaiOpenGuild: Protocol.PaiMaiOpenGuildRsp;
    //m_stPaiMaiOpenWorld: Protocol.PaiMaiOpenWorldRsp;
    //m_stPaiMaiBuyGuild: Protocol.PaiMaiBuyGuildRsp;
    //m_stPaiMaiBuyWorld: Protocol.PaiMaiBuyWorldRsp;
    //m_stPaiMaiSelf: Protocol.paiMaiSelfRsp;

    setPaiMaiGuild(data: Protocol.PaiMaiOpenGuildRsp) {
        this.m_stPaiMaiOpenGuild = data;
    }

    setPaiMaiWorld(data: Protocol.PaiMaiOpenWorldRsp) {
        this.m_stPaiMaiOpenWorld = data;
    }

    updatePaiMaiGuild(data: Protocol.PaiMaiBuyGuildRsp) {

        for (let i = 0; i < this.m_stPaiMaiOpenGuild.m_iCount; i++) {
            if (this.m_stPaiMaiOpenGuild.m_stList[i].m_iID == data.m_stItem.m_iID) {
                this.m_stPaiMaiOpenGuild.m_stList[i] = data.m_stItem;
            }
        }

    }

    updatePaiMaiWorld(data: Protocol.PaiMaiBuyWorldRsp) {

        for (let i = 0; i < this.m_stPaiMaiOpenWorld.m_iCount; i++) {
            if (this.m_stPaiMaiOpenWorld.m_stList[i].m_iID == data.m_stItem.m_iID) {
                this.m_stPaiMaiOpenWorld.m_stList[i] = data.m_stItem;
            }
        }
    }

    updatePaiMaiSelf(data: Protocol.PaiMaiSelfRsp) {
        this.m_stPaiMaiSelf = data;
    }

    private paiMaiWeekConfigMap: { [week: number]: GameConfig.GuildPaiMaiCfgM[] }
    private setGuildPaiMaiSourceCfg() {
        let configs: GameConfig.GuildPaiMaiCfgM[] = G.Cfgmgr.getCfg('data/GuildPaiMaiCfgM.json') as GameConfig.GuildPaiMaiCfgM[];
        this.paiMaiWeekConfigMap = {};
        for (let cfg of configs) {
            if (this.paiMaiWeekConfigMap[cfg.m_iWeek] == null) {
                this.paiMaiWeekConfigMap[cfg.m_iWeek] = [];
            }
            this.paiMaiWeekConfigMap[cfg.m_iWeek].push(cfg);
        }
    }

    getGuildPaiMaiSourceCfg(week: number) {
        return this.paiMaiWeekConfigMap[week];
    }

}
