import { EnumMingJiangState, EnumRewardState } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";

export class MingJiangData {

    static readonly ITEM_COUNT: number = 5;
    static readonly PAGE_COUNT: number = 5;
    static readonly RULE_ID: number = 414;
    static readonly BUFF_ID: number = 51026301;
    static readonly TOP_DAMAGE_GIFT_ID: number = 10454001;

    static MAX_ADD_BUFF_TIME: number = 0;
    static ADD_BUFF_PRICE: number = 0;
    static ADD_BUFF_REWARD: number = 0;
    static ENTER_BASE_TIME: number = 0;
    static EXTRA_REWARD_HOUR: number[] = [];


    private _mjItemDatas: MingJiangItemData[];


    private _buffRemainTime: number;
    get buffRemainTime(): number { return this._buffRemainTime; }
    set buffRemainTime(value: number) {
        this._buffRemainTime = MingJiangData.MAX_ADD_BUFF_TIME - value;
        if (this._buffRemainTime < 0) this._buffRemainTime = 0;
    }

    private _curLevel: number;
    get curLevel(): number { return this._curLevel; }
    set curLevel(value: number) {
        this._curLevel = value;
        if (this._curLevel <= 0) this._curLevel = 1;
    }

    private _fastestLevel: number;
    get fastestLevel(): number { return this._fastestLevel; }
    set fastestLevel(value: number) {
        this._fastestLevel = value;
    }

    private _enterRemainTime: number;
    get enterRemainTime(): number { return this._enterRemainTime; }
    set enterRemainTime(value: number) {
        let additionTime = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_GUILD_MJ_TZ_TIME, G.DataMgr.heroData.curVipLevel);
        let hour = Math.floor((G.SyncTime.getCurrentTime() / 1000 + 28800) / 3600) % 24;
        let rewardTime = 0;
        for (let i = MingJiangData.EXTRA_REWARD_HOUR.length - 1; i >= 0; i--) {
            if (hour >= MingJiangData.EXTRA_REWARD_HOUR[i]) rewardTime += MingJiangData.ENTER_BASE_TIME;
        }

        this._enterRemainTime = MingJiangData.ENTER_BASE_TIME + additionTime + rewardTime - value;
        if (this._enterRemainTime < 0) this._enterRemainTime = 0;
    }

    private _myRank: number;
    get myRank(): number { return this._myRank; }
    set myRank(value: number) { this._myRank = value; }

    private _mjCoinOutput: number | string;
    get mjCoinOutput(): number | string { return this._mjCoinOutput; }
    set mjCoinOutput(value: number | string) { this._mjCoinOutput = (<number>value).toString(); }

    private _curCanGetMJCoin: number | string;
    get curCanGetMJCoin(): number | string { return this._curCanGetMJCoin; }
    set curCanGetMJCoin(value: number | string) { this._curCanGetMJCoin = (<number>value).toString(); }

    private _curPage: number;
    get curPage(): number { return this._curPage; }
    set curPage(value: number) { this._curPage = Math.floor(value); }

    private _actRemainTime: number;
    get actRemainTime(): number { return this._actRemainTime; }
    set actRemainTime(value: number) { this._actRemainTime = value - G.SyncTime.getCurrentTime() / 1000; }

    private _rankDatas: MingJiangOneRankData[] = [];

    private _getBit: number;
    private _passBit: number;
    private _bossNum: number = 0;

    mjCfgMap: { [index: number]: number } = {};

    updateMJPanelInfo(info: Protocol.MJTZOpenRsp) {
        this.buffRemainTime = info.m_ucRaiseCnt;
        this.curLevel = info.m_ucCurBossIndex;
        this.fastestLevel = info.m_ucFastBossIndex;
        this.enterRemainTime = info.m_uiHaveTime;
        this.actRemainTime = info.m_uiNextStartTime;

        this._getBit = info.m_uiGetGift;
        this._passBit = info.m_uiPassFlag;
        this._bossNum = info.m_iBossCnt;

        this._initMJItemDatas();

        if (!info.m_stBossInfo || info.m_stBossInfo.length <= 0) return;

        for (let i = 0; i < info.m_stBossInfo.length; i++) {
            let itemData = this._mjItemDatas[i];
            itemData.updateDataByRoleInfo(info.m_stBossInfo[i], this._passBit);
        }

        this.updateRewardStatus();
    }

    private _initMJItemDatas() {
        if (this._mjItemDatas) return;

        this._mjItemDatas = [];
        for (let i = 0; i < Macros.MAX_MJTZ_BOSS_COUNT; i++) {
            this._mjItemDatas.push(new MingJiangItemData(i));
        }
    }

    updateMJRankInfo(info: Protocol.MJTZListRankRsp) {
        this.myRank = info.m_iRank;
        this.mjCoinOutput = info.m_iMJBTotal;
        this.curCanGetMJCoin = info.m_iMJBSelf;

        if (!info.m_stInfo) return;
        this._rankDatas.length = info.m_stInfo.length;
        for (let i = 0; i < this._rankDatas.length; i++) {
            if (!this._rankDatas[i]) this._rankDatas[i] = new MingJiangOneRankData();
            let temp = this._rankDatas[i];
            let data = info.m_stInfo[i];
            temp.name = data.m_szNickName;
            temp.rankValue = i + 1;
            //根据页数、当前进度、boss血量计算

            uts.log('hurt:' + data.m_llHurt + 'maxdamage:' + this._getMaxDamage());
            temp.damagePer = Math.round(data.m_llHurt / this._getMaxDamage() * 100) + '%';
        }
    }

    private _getMaxDamage(): number {
        //若当前进度未达到后面的关数，则直接返回1
        if (this._curPage * MingJiangData.ITEM_COUNT > this.curLevel - 1) return 1;

        let firstIndex = MingJiangData.ITEM_COUNT * this._curPage;
        let maxDamage = 0;
        for (let i = firstIndex; i < firstIndex + MingJiangData.ITEM_COUNT; i++) {
            //根据当前进度来取BOSS血量
            let monsterData = this._mjItemDatas[i];

            //未能占领的BOSS不算伤害
            if (monsterData.curHP < 0) continue;
            maxDamage += monsterData.maxHP - monsterData.curHP;
        }

        return maxDamage == 0 ? 1 : maxDamage;
    }

    getRankDatas(): MingJiangOneRankData[] {
        return this._rankDatas;
    }

    getMyRankData(): MingJiangOneRankData {
        return this._myRank > 0 ? this._rankDatas[this._myRank - 1] : null;
    }

    updateRewardStatus(getBits: number = -1) {
        if (getBits >= 0) this._getBit = getBits;

        for (let i = 0; i < this._mjItemDatas.length; i++) {
            if ((this._getBit & (1 << i)) > 0) {
                this._mjItemDatas[i].rewardStatus = EnumRewardState.HasGot;
                continue;
            }

            if ((this._passBit & (1 << i)) > 0) {
                this._mjItemDatas[i].rewardStatus = EnumRewardState.NotGot;
                continue;
            }

            this._mjItemDatas[i].rewardStatus = EnumRewardState.NotReach;
        }
    }

    getItemDataByIndex(index: number): MingJiangItemData {
        return this._mjItemDatas[index];
    }

    hasReward(): boolean {
        if (!this._mjItemDatas || this._mjItemDatas.length <= 0) return false;

        for (let temp of this._mjItemDatas) {
            if (temp.rewardStatus == EnumRewardState.NotGot) return true;
        }
        return false;
    }

    canEnter(isPrompt?: boolean): boolean {
        if (G.DataMgr.mingJiangData.enterRemainTime <= 0) {
            if (isPrompt) G.TipMgr.addMainFloatTip('挑战时间已用完！');
            return false;
        }

        return true;
    }

    isFirstDayJoinGuild(): boolean {
        let joinTime = G.DataMgr.heroData.guildJoinTime;
        if (joinTime <= 0) return false;

        return G.SyncTime.isSameDay(joinTime, G.SyncTime.getCurrentTime() / 1000);
    }

    isInCloseTime(): boolean {
        let date = new Date();
        date.setTime(G.SyncTime.getCurrentTime());
        let hour = date.getHours();
        return hour >= 0 && hour < 8;
    }

    onCfgReady() {
        let constData = G.DataMgr.constData;
        MingJiangData.MAX_ADD_BUFF_TIME = constData.getValueById(KeyWord.PARAM_GUILD_MJ_GW_TIMES);
        MingJiangData.ADD_BUFF_PRICE = constData.getValueById(KeyWord.PARAM_GUILD_MJ_GW_PRICE);
        MingJiangData.ADD_BUFF_REWARD = constData.getValueById(KeyWord.PARAM_GUILD_MJ_GW_REWARD);
        MingJiangData.ENTER_BASE_TIME = constData.getValueById(KeyWord.PARAM_GUILD_MJ_TZ_TIME);
        MingJiangData.EXTRA_REWARD_HOUR = [constData.getValueById(KeyWord.PARAM_GUILD_MJTZ_TIMESTAMP_1) / 3600,
        constData.getValueById(KeyWord.PARAM_GUILD_MJTZ_TIMESTAMP_2) / 3600];

        let data = G.Cfgmgr.getCfg<GameConfig.MJTZCfgM>('data/MJTZCfgM.json');

        for (let i = 0; i < data.length; i++) {
            let temp = data[i];
            this.mjCfgMap[temp.m_iBossIndex] = temp.m_iRewardDrop;
        }
    }

    getDropID(index: number): number {
        return this.mjCfgMap[index];
    }

    getFuncState(): EnumMingJiangState {
        if (G.DataMgr.heroData.guildId <= 0) return EnumMingJiangState.NOGUILD;

        if (this._bossNum < Macros.MAX_MJTZ_BOSS_COUNT) return EnumMingJiangState.NOTOPEN;

        //合服当天不开
        if (G.SyncTime.getDateAfterMergeServer() == 1) return EnumMingJiangState.NOTOPEN;

        return EnumMingJiangState.OPEN;
    }
}

export class MingJiangOneRankData {
    private _name: string;
    get name(): string { return this._name; }
    set name(value: string) { this._name = value; }

    private _damagePer: string;
    get damagePer(): string { return this._damagePer; }
    set damagePer(value: string) { this._damagePer = value; }

    private _rankValue: number;
    get rankValue(): number { return this._rankValue; }
    set rankValue(value: number) { this._rankValue = value; }
}

export class MingJiangItemData {

    constructor(index: number) {
        this.index = index;
    }

    private _index: number;
    get index(): number { return this._index; }
    set index(value: number) { this._index = value; }

    private _name: string;
    get name(): string { return this._name; }
    set name(value: string) { this._name = value; }

    private _fightValue: string | number;
    get fightValue(): string | number { return this._fightValue; }
    set fightValue(value: string | number) { this._fightValue = (<number>value).toString(); }

    private _avatarList: Protocol.AvatarList;
    get avatarList(): Protocol.AvatarList { return this._avatarList; }
    set avatarList(value: Protocol.AvatarList) { this._avatarList = value; }

    private _gender: number;
    get gender(): number { return this._gender; }
    set gender(value: number) { this._gender = value; }

    private _profession: number;
    get profession(): number { return this._profession; }
    set profession(value: number) { this._profession = value; }

    private _rewardStatus: EnumRewardState;
    get rewardStatus(): EnumRewardState { return this._rewardStatus; }
    set rewardStatus(value: EnumRewardState) { this._rewardStatus = value; }

    private _curHP: number;
    get curHP(): number { return this._curHP; }
    set curHP(value: number) { this._curHP = value; }

    private _maxHP: number;
    get maxHP(): number { return this._maxHP; }
    set maxHP(value: number) { this._maxHP = value; }

    private _isKilled: boolean | number;
    get isKilled(): boolean | number { return this._isKilled; }
    set isKilled(value: boolean | number) {
        this._isKilled = (<number>value & (1 << this._index)) > 0;
    }

    updateDataByRoleInfo(roleInfo: Protocol.RoleInfo, passBits: number) {
        this.profession = roleInfo.m_stBaseProfile.m_cProfession;
        this.name = roleInfo.m_stBaseProfile.m_szNickName;
        this.gender = roleInfo.m_stBaseProfile.m_cGender;
        this.maxHP = roleInfo.m_stUnitInfo.m_stUnitAttribute.m_allValue[Macros.EUAI_MAXHP];
        this.fightValue = roleInfo.m_stUnitInfo.m_stUnitAttribute.m_allValue[Macros.EUAI_FIGHT];
        this.avatarList = roleInfo.m_stAvatarList;
        this._updateCurHp(roleInfo.m_stUnitInfo.m_stUnitAttribute.m_allValue[Macros.EUAI_CURHP], passBits);
        this.isKilled = passBits;
    }

    private _updateCurHp(curHP: number, passBits: number) {
        //已通关
        if ((passBits & (1 << this._index)) > 0) {
            this.curHP = 0;
            return;
        }

        //未能通关
        let fatestPage = Math.floor((G.DataMgr.mingJiangData.fastestLevel - 1) / MingJiangData.ITEM_COUNT);
        let curPage = Math.floor(this._index / MingJiangData.ITEM_COUNT);
        if (fatestPage > curPage) {
            this.curHP = -1;
            return;
        }

        //当前进度
        if (G.DataMgr.mingJiangData.curLevel - 1 == this._index) {
            this.curHP = curHP;
            return;
        }

        //未打
        this.curHP = this.maxHP;
    }
}