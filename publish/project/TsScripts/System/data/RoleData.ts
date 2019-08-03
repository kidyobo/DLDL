import { EnumDir2D, HeroGotoType, UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { VipData } from 'System/data/VipData'
import { VipView } from "../vip/VipView";

export class UnitData {
    //配置表ID
    id: number = 0;
    //配置表
    config: any;
    /**使用UnitCtrlType(system/constants/GameEnum)*/
    unitType: UnitCtrlType = 0;
    //性别
    gender: number = 0;
    /**正值表真实unitID，负值表前台怪等。*/
    unitID: number = -1;
    unitStatus: number = 0;

    /**只用于登录时，临时保存。*/
    direction: EnumDir2D = 0;
    /**登录时临时保存，以及未在视野的队友位置。*/
    x: number = 0;
    y: number = 0;

    /**上一次被我打的时间*/
    lastHurtAt = 0;
    /**上一次攻击我的时间*/
    lastAttackMeAt = 0;

    //排序时的临时变量
    sortLayer: number = 0;

    avatarList: Protocol.AvatarList;
    protected aiValue: Array<number> = [];
    getProperty(id: number): number {
        return this.aiValue[id];
    }

    setProperty(id: number, value: number): void {
        this.aiValue[id] = value;
    }
    public getSubAvatarByKey(key: number) {
        let avatarList = this.avatarList;
        if (!avatarList) {
            return 0;
        }
        let m_auiSubLevel = avatarList.m_auiSubLevel;
        let len = m_auiSubLevel.length;
        for (let i = 0; i < len; i++) {
            let thingID = m_auiSubLevel[i];
            if (thingID > 0) {
                // 神器  武器特效
                if (i == key - 1) {
                    return thingID;
                }
            }
        }
        return 0;
    }
}

export class DropUnitData extends UnitData {
    info: Protocol.DroppedThingInfo;
    dropAt = 0;

    constructor() {
        super();
        this.info = {} as Protocol.DroppedThingInfo;
    }
}

export class RoleData extends UnitData {

    isNewPlayer: boolean = false;

    roleID: Protocol.RoleID;
    uin: number = 0;
    nick: string = '';
    name: string = '';
    profession: number = 0;

    guildId: number = 0;
    guildName: string;
    guildGrade: number = 0;
    //创建或加入宗门时间
    guildJoinTime: number = 0;

    /**仙侣名字。*/
    mateName: string = '';

    pvpCampRelation: number = 0;

    zoneID: number = -1;

    isMsgUpdated: boolean;
    campID: number = -1;

    activeTitleConfigID: number = 0;

    curVipLevel: number = 0;
    curVipMonthLevel: number = 0;
    privilegeTimeout: number[];
    nextPriTimeoutLv = 0;
    nextPriTimeoutAt = 0;

    rechargeGetMoney: number = 0;

    //白银,黄金,钻石等级
    curVipBaiYinLv: number = 0;
    curVipHuangJinLv: number = 0;
    curVipZuanShiLv: number = 0;
    baiYinChargeValue: number = 0;
    huangjinChargeValue: number = 0;
    zuanshiChargeValue: number = 0;



    ossGmTimes: number = 0;
    monsterTagID: number = 0;
    monsterTitle: string;
    feishengCount: number = 0;


    petMonsterInfo: Protocol.MonsterSightInfoPet;

    guoyunLevel: number = 0;

    /**出战的守护神id*/
    shieldId = 0;

    /**唯一称号状态，按位存储。*/
    uniqueTitle: Array<number>;
    /**永久称号，按位存储。*/
    uniqueTitle2: Array<number>;
    /**天地榜称号，按位存储。*/
    pkTitleBit: number = 0;
    /**极速挑战称号*/
    jisutiaozhanTitle: number = 0;

    /**阵营战排行第一称号。*/
    heroBattleTitleId: Protocol.UnitInfo;
    m_usShowTitleID: number = 0;

    monsterRoleId = 0;

    pkValue: number = 0;
    armyID: number = 0;
    pkMode: number = 0;
    /**队伍id */
    teamId: number = -1;

    juYuanId: number = 0;
    /**角色创角时间*/
    roleCreateTime: number = 0;

    /**是否在副本内*/
    inFuBen: boolean = false;

    /**改名卡使用时间*/
    renameCd: number;
    petAwakeCnt: number;

    constructor() {
        super();
        this.roleID = {} as Protocol.RoleID;
    }

    get IsVip(): boolean {
        return this.curVipLevel > 0;
    }

    set m_uiCreateTime(m_uiCreateTime: number) {
        this.roleCreateTime = m_uiCreateTime;
    }


    get IsPhysical(): boolean {
        return this.profession < 4;
    }

    get level(): number {
        return this.aiValue[Macros.EUAI_LEVEL];
    }

    get holyPower(): number {
        return this.aiValue[Macros.EUAI_GOD_POWER];
    }



    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    get WorldID(): number {
        return this.roleID.m_uiSeq;
    }

    get isManager(): boolean {
        return (Macros.GUILD_GRADE_CHAIRMAN == this.guildGrade || Macros.GUILD_GRADE_VICE_CHAIRMAN == this.guildGrade);
    }

    get isManager2(): boolean {
        return (Macros.GUILD_GRADE_CHAIRMAN == this.guildGrade);
    }

    /**是否是副族长*/
    get isViceManagers(): boolean {
        return (Macros.GUILD_GRADE_VICE_CHAIRMAN == this.guildGrade);
    }

    getAllPriState(): number[] {
        let states = [];
        for (let i = 0; i < 3; i++) {
            states.push(this.getPrivilegeState(i + 1));
        }
        return states;
    }

    /**
     * 指定的特权卡等级是否已激活。-1表示未激活，-2表示已过期，0表示已永久激活，正数表示已激活但未过期（过期时间戳）
     * @param level
     */
    getPrivilegeState(level: number): number {
        let flag = 1 << level;
        if (0 != (this.curVipMonthLevel & flag)) {
            // 检查是否过期
            let timeout = this.getPrivilegeTimeout(level);
            if (timeout > 0) {
                let now = Math.round(G.SyncTime.getCurrentTime() / 1000);
                if (timeout < now) {
                    // 已过期
                    return -2;
                } else {
                    // 已激活未过期
                    return timeout;
                }
            }
            // 说明已永久激活
            return 0;
        }
        // 说明未激活
        return -1;
    }

    getPrivilegeTimeout(level: number): number {
        let timeout = 0;
        if (null != this.privilegeTimeout && level - 1 < this.privilegeTimeout.length) {
            timeout = this.privilegeTimeout[level - 1];
        }
        return timeout;
    }

    isAllPrivilegeBought(): boolean {
        return this.curVipMonthLevel == 14 && 0 == this.getPrivilegeTimeout(1) && 0 == this.getPrivilegeTimeout(2) && 0 == this.getPrivilegeTimeout(3);
    }

    updateRoleID(roleID: Protocol.RoleID): void {
        this.roleID = uts.deepcopy(roleID, this.roleID);
        this.uin = roleID.m_uiUin;
    }

    updateUnitAttributes(attributes: Protocol.UnitAttribute): void {
        for (let i: number = 0; i < attributes.m_ucNumber; i++) {
            this.setProperty(i, attributes.m_allValue[i]);
        }
    }

    reset(): void {
        this.uin = 0;
        this.config = null;
        this.guildName = null;
        this.guildGrade = 0;
        this.unitID = -1;
        this.zoneID = -1;
        this.roleID.m_uiSeq = 0;
        this.roleID.m_uiUin = 0;
        this.unitStatus = 0;
        this.pvpCampRelation = 0;
        this.gender = 0;
        this.profession = 0;
        this.avatarList = null;
        this.id = 0;
        this.uniqueTitle = null;
        this.uniqueTitle2 = null;
        this.guoyunLevel = 0;
        this.shieldId = 0;
        this.isMsgUpdated = false;
        this.monsterTagID = 0;
        this.monsterTitle = null;
        this.monsterRoleId = 0;
        this.pkValue = 0;
        this.pkMode = 0;
        this.pkTitleBit = 0;
        this.campID = -1;
        this.jisutiaozhanTitle = 0;
    }
}

export class HeroData extends RoleData {
    isAlive: boolean = true;
    gotoType: HeroGotoType = 0;
    isGM: boolean = false;
    static readonly RankMacros: number[] = [Macros.JJC_MOBAI_1, Macros.JJC_MOBAI_2, Macros.JJC_MOBAI_3];
    /**上一次的unit id，因跨服后unit id会变*/
    oldUnitID = 0;
    /**钻石。*/
    private _gold: number = 0;
    /**GM元宝*/
    private _gmGold: number = 0;
    /**返利元宝，不可在交易所交易*/
    private _flGold = 0;
    /**绑钻。*/
    gold_bind: number = 0;
    /**铜钱、钻石*/
    tongqian = 0;
    /**海神魂力 */
    haishenhunli = 0;
    /**宝镜积分。*/
    skyBonus: number = 0;
    /**庆典积分。*/
    qdBonus: number = 0;
    /**宗门战勋。*/
    guildZhanxun: number = 0;
    /**声望。*/
    reputation: number = 0;
    /**荣誉值。*/
    hornor: number = 0;
    /**功勋。*/
    explot: number = 0;
    /**战魂*/
    zhanHun = 0;
    /**斗兽币*/
    siXiangBi = 0;
    /**历练*/
    liLian = 0;
    /**是否有vip体验buff。*/
    hasTrialVIP: boolean = false;
    /**当前充值金额，单位钻石。*/
    curChargeMoney: number = 0;
    /**今日充值*/
    toadyChargeMoney: number = 0;
    /**终身累计消费*/
    lifeConsume: number = 0;
    /**总贡献。*/
    guildDonateTotal: number = 0;
    /**当前可用贡献值。*/
    guildDonateCur: number = 0;
    /**离线时间。*/
    offlineTime: number = 0;
    /**个人竞技排名。*/
    myPpkRankVal: number = 0;
    /**个人排名。*/
    myRank: number = 0;
    /**是否领取排行奖励。*/
    isGetRankReward: boolean = false;
    /**个人竞技剩余次数。*/
    myPPkRemindTimes: number = 0;
    /**竞技大厅是否达成奖励*/
    canGetReward: false;
    /**竞技场最大达成奖励的排名*/
    maxRankRewardBit: number;
    rewardRank: number;
    /**神力榜购买次数*/
    ppkBuyTimes = 0;
    /**榜单次数*/
    rankCount: number = 0;
    /**是否回归玩家。*/
    roleProp: number = 0;
    /**时装信息。*/
    dressList: Protocol.DressImageListInfo;
    /**仙侣信息。*/
    lover: Protocol.RoleLoverInfo;
    /**膜拜零点刷新时间*/
    zeroRefreshDataInfo: Protocol.ZeroRefreshDataInfo;
    /**玩家是否膜拜过*/
    OperateRecord: boolean;
    /**前三名玩家的信息列表*/
    playerInfoList: Array<Protocol.CacheRoleInfo>;
    /**甜蜜度。*/
    honey: number = 0;
    /**升级需要花费的甜蜜度*/
    honeyUpCost: number = 0;
    /**魂值经验。*/
    soulExp: number = 0;
    /**当前灵力。*/
    reiki: number = 0;
    /**跨服积分。*/
    crossPoint: number = 0;
    /**跨服段位。*/
    crossStage: number = 0;
    /**人人爱。*/
    rmb: number = 0;
    /**幸运转盘积分。*/
    xyzpBonus: number = 0;
    /**熔炼值。*/
    smelting: number = 0;
    /**神魂值。*/
    shenhun: number = 0;
    /**精魄值。*/
    jingPo: number = 0;
    /**名将币。*/
    mingJiang: number = 0;
    /**九星积分。*/
    jxBonus: number = 0;
    /**远征币*/
    yuanZhengBi = 0;
    /**体力*/
    energy = 0;
    /**创角时间 */
    createTime: number = 0;
    /**登录时临时保存。*/
    path: UnityEngine.Vector2[];
    /**过期数据*/
    overDueData: Protocol.ImageOverDue_Response = null;
    /**特权卡过期等级*/
    privilegeOverdueLv = 0;
    /**被击杀时施法者的名字*/
    m_szCasterName: string = '';

    get gold(): number {
        return this._gold + this._gmGold;
    }

    /**不包含返利钻石的 */
    get noFlGold(): number {
        return this.gold - this._flGold;
    }

    get goldBind(): number {
        return this.gold_bind;
    }

    reset(): void {
        this.isGM = false;
        this._gold = 0;
        this._gmGold = 0;
        this._flGold = 0;
        this.curChargeMoney = 0;
        this.path = null;

        super.reset();
    }

    /**
	* 更新充值数量
	* @param curMoney
	*
	*/
    updateChargeMoney(curMoney: number): void {
        this.curChargeMoney = curMoney;
        // let oldVipLv: number = this.curVipLevel;
        // this.curVipLevel = G.DataMgr.vipData.getVipLevelByMoney(curMoney);
        // if (oldVipLv != this.curVipLevel) {
        //     // 更新限购
        //     G.DataMgr.npcSellData.updateVipLimit(this.curVipLevel);
        // }
    }

    /**
     * 更新消耗
     * @param costMoney
     */
    updateLifeConsume(costMoney: number): void {
        let oldVipLv: number = this.curVipLevel;
        this.curVipLevel = G.DataMgr.vipData.getVipLevelByMoney(costMoney);
        if (oldVipLv != this.curVipLevel) {
            // 更新限购
            G.DataMgr.npcSellData.updateVipLimit(this.curVipLevel);
        }
        let vipView = G.Uimgr.getForm<VipView>(VipView);
        if (vipView != null) {
            vipView.updateRewardPanel();
        }
    }

    updateNewCurrencyInfo(currencyInfo: Protocol.CurrencyInfo): string {
        let tipText: string;
        // 钻石
        if (currencyInfo.m_iCurrencyID == KeyWord.MONEY_YUANBAO_ID) {
            this._gold = currencyInfo.m_llValue;
            tipText = "钻石";
        }
        // GM钻石
        else if (currencyInfo.m_iCurrencyID == KeyWord.MONEY_GM_YUANBAO_ID) {
            this._gmGold = currencyInfo.m_llValue;
            tipText = "钻石";
        }
        // 返利钻石
        else if (currencyInfo.m_iCurrencyID == KeyWord.MONEY_ID_YBFL) {
            this._flGold = currencyInfo.m_llValue;
            // tipText = "钻石";
        }
        //绑定钻石
        else if (currencyInfo.m_iCurrencyID == KeyWord.MONEY_YUANBAO_BIND_ID) {
            this.gold_bind = currencyInfo.m_llValue;
            tipText = "绑定钻石";
        }
        // 铜钱，钻石
        else if (currencyInfo.m_iCurrencyID == KeyWord.MONEY_TONGQIAN_ID) {
            this.tongqian = currencyInfo.m_llValue;
            tipText = "魂币";
        }
        // 海神魂力
        else if (currencyInfo.m_iCurrencyID == KeyWord.MONEY_ID_HUNLI) {
            this.haishenhunli = currencyInfo.m_llValue;
            tipText = "海神魂力";
        }
        //战勋值
        else if (currencyInfo.m_iCurrencyID == KeyWord.PVP_EXPLOIT_ID) {
            this.explot = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.SKY_BONUS_ID == currencyInfo.m_iCurrencyID) {
            // 宝镜积分
            this.skyBonus = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.BFQD_THING_ID == currencyInfo.m_iCurrencyID) {
            // 庆典积分
            this.qdBonus = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.GUILD_CONTRIBUTE_ID == currencyInfo.m_iCurrencyID) {
            this.guildDonateCur = currencyInfo.m_llValue;
            tipText = "贡献度";
        }
        else if (KeyWord.GUILD_CONTRIBUTE_SUM == currencyInfo.m_iCurrencyID) {
            this.guildDonateTotal = currencyInfo.m_llValue;
        }
        else if (KeyWord.XYZP_THING_ID == currencyInfo.m_iCurrencyID) {
            this.xyzpBonus = currencyInfo.m_llValue;
            tipText = "幸运转盘积分";
        }
        else if (KeyWord.XINGHUN_THING_ID == currencyInfo.m_iCurrencyID) {
            this.jxBonus = currencyInfo.m_llValue;
            tipText = "陨石值";
        }
        else if (KeyWord.REPUTATION_THING_ID == currencyInfo.m_iCurrencyID) {
            this.reputation = currencyInfo.m_llValue;
            tipText = "声望";
        }
        else if (KeyWord.HONOUR_THING_ID == currencyInfo.m_iCurrencyID) {
            this.hornor = currencyInfo.m_llValue;
            tipText = "荣誉";
        }
        else if (KeyWord.CRYSTAL_ENERGY_ID == currencyInfo.m_iCurrencyID) {
            this.hornor = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.HONEY_THING_ID == currencyInfo.m_iCurrencyID) {
            this.honey = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, KeyWord.HONEY_THING_ID);
        }
        else if (KeyWord.MAGICCUBE_SOUL_ID == currencyInfo.m_iCurrencyID) {
            this.soulExp = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.REIKI_THING_ID == currencyInfo.m_iCurrencyID) {
            this.reiki = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.MONEY_CROSSPVP_ID == currencyInfo.m_iCurrencyID) {
            this.crossPoint = currencyInfo.m_llValue;
        }
        else if (KeyWord.MONEY_CROSSPVP_GRADE == currencyInfo.m_iCurrencyID) {
            this.crossStage = currencyInfo.m_llValue;
        }
        else if (KeyWord.RMB_THING_ID == currencyInfo.m_iCurrencyID) {
            this.rmb = GameIDUtil.getShowMoney(currencyInfo.m_llValue, KeyWord.RMB_THING_ID);
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.QKL_LIANZHI_ID == currencyInfo.m_iCurrencyID) {
            this.smelting = currencyInfo.m_iCurrencyID;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.MONEY_SHENHUN_ID == currencyInfo.m_iCurrencyID) {
            this.shenhun = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.WARSOUL_THING_ID == currencyInfo.m_iCurrencyID) {
            this.zhanHun = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.COLOSSEUM_MONEY_ID == currencyInfo.m_iCurrencyID) {
            this.siXiangBi = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.MONEY_ID_LILIAN == currencyInfo.m_iCurrencyID) {
            this.liLian = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.MONEY_ID_JINGPO == currencyInfo.m_iCurrencyID) {
            this.jingPo = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.MONEY_ID_MJTZ == currencyInfo.m_iCurrencyID) {
            this.mingJiang = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.MONEY_ID_WYYZ == currencyInfo.m_iCurrencyID) {
            this.yuanZhengBi = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }
        else if (KeyWord.MONEY_ID_ENERGY_WY == currencyInfo.m_iCurrencyID) {
            this.energy = currencyInfo.m_llValue;
            tipText = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, currencyInfo.m_iCurrencyID);
        }

        return tipText;
    }

    /**
	* 更新货币
	* @param currencyList
	*
	*/
    updateNewCurrencyInfoList(currencyList: Protocol.CurrencyInfoList): void {
        let len: number = currencyList.m_cNum;
        for (let i: number = 0; i < len; i++) {
            this.updateNewCurrencyInfo(currencyList.m_astCurrencyInfo[i]);
        }
    }

    /**
     * 更新特权卡信息
     */
    upDateVipMonthLevel(level: number, timeout: number[]): void {
        this.curVipMonthLevel = level;
        this.privilegeTimeout = timeout;
        this.nextPriTimeoutLv = 0;
        this.nextPriTimeoutAt = 0;
        for (let i = 0; i < VipData.PrivilegeCnt; i++) {
            let s = this.getPrivilegeState(i + 1);
            if (s > 0 && s < this.nextPriTimeoutAt) {
                this.nextPriTimeoutLv = i + 1;
                this.nextPriTimeoutAt = s;
            }
        }
    }

    /**更新时装数据*/
    updateHeroDressList(data: Protocol.DressOneImageInfo) {
        for (let i = 0; i < this.dressList.m_ucNumber; i++) {
            if (this.dressList.m_astImageList[i].m_uiImageID == data.m_uiImageID) {
                this.dressList.m_astImageList[i] = data;
                return;
            }
        }
    }

    /**
     * 获得某个时装的强化等级
     * @param dressId
     */
    getOneDressLv(dressId: number) {
        if (this.dressList == null) return 0;
        for (let i = 0; i < this.dressList.m_ucNumber; i++) {
            if (this.dressList.m_astImageList[i].m_uiImageID == dressId) {
                return this.dressList.m_astImageList[i].m_ucStrengLv;
            }
        }
        return 0;
    }

    /**
     * 判断一个时装是否激活
     * @param dressId
     */
    getOneDressIsActive(dressId: number) {
        if (this.dressList == null) return false;
        for (let i = 0; i < this.dressList.m_ucNumber; i++) {
            if (this.dressList.m_astImageList[i].m_uiImageID == dressId) {
                return this.dressList.m_astImageList[i].m_uiTimeOut == 0 || this.dressList.m_astImageList[i].m_uiTimeOut > G.SyncTime.getCurrentTime() / 1000;
            }
        }
        return false;
    }
    canGetMaxReward(rewardID: number) {
        return (this.maxRankRewardBit & rewardID) == 0;
    }


    /** 获取HP的比例 */
    get hpProportion(): number {
        var maxHP: number = this.getProperty(Macros.EUAI_MAXHP);
        var curHP: number = this.getProperty(Macros.EUAI_CURHP);
        return parseFloat((curHP / maxHP).toFixed(2));
    }

    /** 获取HP的百分比率 */
    get hpPercentage(): number {
        return parseFloat((this.hpProportion * 100).toFixed(2));
    }

    /** 获取HP的比例 */
    get spProportion(): number {
        var maxHP: number = this.getProperty(Macros.EUAI_MAX_SOUL);
        var curHP: number = this.getProperty(Macros.EUAI_SOUL);
        return parseFloat((Math.min(1, curHP / maxHP)).toFixed(2));
    }

    /** 获取HP的百分比率 */
    get spPercentage(): number {
        return parseFloat((this.spProportion * 100).toFixed(2));
    }

    /** 角色战斗力 */
    get fight(): number {
        return this.getProperty(Macros.EUAI_FIGHT);
    }

    /**杀我的仇人*/
    killMeRoleIDList: Protocol.CSBeKilled_Notify[] = [];
    updateKillMeRoleIDList(notify: Protocol.CSBeKilled_Notify) {
        this.killMeRoleIDList.push(notify);
    }
    /**清空杀我的人*/
    clearKillMeRole() {
        this.killMeRoleIDList = [];
    }

    /**我杀的人*/
    myKillRoleList: Protocol.CSBeKilled_Notify[] = []
    updateMyKillRoleIDList(notify: Protocol.CSBeKilled_Notify) {
        this.myKillRoleList.push(notify);
    }
    /**清空杀我的人*/
    clearMyKillRole() {
        this.myKillRoleList = [];
    }

}