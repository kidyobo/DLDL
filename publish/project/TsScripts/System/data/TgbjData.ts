import { Macros } from 'System/protocol/Macros';
import { TanBaoView } from 'System/tanbao/TanBaoView';
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EnumTgbjRule } from 'System/tanbao/EnumTgbjRule'
import { TgbjStoreItemData } from 'System/data/TgbjStoreItemData'
import { KeyWord } from 'System/constants/KeyWord'
import { StringUtil } from 'System/utils/StringUtil'
import { Global as G } from 'System/global'


/**
 * 天宫宝镜数据。
 * @author teppei
 *
 */
export class TgbjData {
    /**炼化区大小。*/
    static LH_CAPACITY: number = 30;

    /**炼化最大进度。*/
    static LH_MAX_PROGRESS: number = 10000;

    /**魔帝宝库抽奖配置表字典*/
    private lotteryDic: { [key: string]: GameConfig.SkyLotteryConfigM[] };

    /**魔帝宝库抽奖配置表最大天数字典*/
    private lotteryTypeMaxDayDic: { [ucType: number]: number };

    /**魔笛宝库次数兑换奖励 */
    // private lotteryExchangeCfg: { [id: number]: GameConfig.LotteryExchangeCfgM };
    // private lotteryCfg: GameConfig.LotteryExchangeCfgM[] = [];
    /**宝镜幸运榜。*/
    bjXyb: Protocol.SkyLotteryRecordList[];

    /**秘境幸运版*/
    mjXyb: Protocol.SkyLotteryRecordList[];

    /**已经使用的免费探宝次数。*/
    usedFreeNum: number = 0;

    /**额外免费次数。*/
    extraFreeNum: number = 0;

    /**已使用的额外免费次数。*/
    usedExtraFreeNum: number = 0;

    /**炼化进度。*/
    lhProgress: number = 0;

    /**仓库数据列表。*/
    storeListData: TgbjStoreItemData[];

    /**自己的探宝记录。*/
    bjRecord: Protocol.SkyLotteryRecordList[] = new Array<Protocol.SkyLotteryRecordList>();

    /**自己的秘境记录*/
    mjRecord: Protocol.SkyLotteryRecordList[] = new Array<Protocol.SkyLotteryRecordList>();
    /**鉴宝id */
    private _JIANBAOFU_ID = 10233010
    /**炼化配置映射表。*/
    private m_lhConfigMap: { [thingId: number]: number };
    private _exchangeRecordVec: Protocol.ContainerThingInfo[];
    /**全服记录字典*/
    private _allRecordDic: {};
    /**全服记录字典*/
    private _myRecordDic: {};

    /**天宫宝镜炼化数据。*/
    lhPosObj: { [pos: number]: ThingItemData } = {};
    /**探宝积分倒计时*/
    outTime: number = 0;
    /**今日累计抽奖次数 */
    totalNum: number = 0;
    /**免费次数 */
    freeNum: number = 0;
    //奖励数据
    skyLotteryConfig: Protocol.SkyLotteryConfig_Server[] = [];
    //进度宝箱数据
    lotteryExchangeCfg: Protocol.LotteryExchangeCfg_Server[] = [];

    private maxNum = 9;
    /**是否领取了奖励 */
    flag: number = 0;
    onCfgReady() {
        this.setConfigs();
    }

    setConfigs(): void {
        let configs: GameConfig.SkyLotteryConfigM[] = G.Cfgmgr.getCfg('data/SkyLotteryConfigM.json') as GameConfig.SkyLotteryConfigM[];
        this.lotteryDic = {};
        this.lotteryTypeMaxDayDic = {};
        for (let config of configs) {
            let key: string = StringUtil.marriageLine(config.m_ucType, config.m_ucOpenDays);
            if (!this.lotteryDic[key]) {
                this.lotteryDic[key] = [];
            }
            this.lotteryDic[key].push(config);
            let oldValue = this.lotteryTypeMaxDayDic[config.m_ucType];
            if (undefined == oldValue) {
                oldValue = 0;
            }
            this.lotteryTypeMaxDayDic[config.m_ucType] = Math.max(oldValue, config.m_ucOpenDays);
        }
        for (let arr in this.lotteryDic) {
            this.lotteryDic[arr].sort(this._sortByID);
        }
        // this.setLotterExchangeCfg();
    }

    // private setLotterExchangeCfg(): void {
    //     let cfgs: GameConfig.LotteryExchangeCfgM[] = G.Cfgmgr.getCfg("data/LotteryExchangeCfgM.json") as GameConfig.LotteryExchangeCfgM[];
    //     for (let cfg of cfgs) {
    //         this.lotteryCfg.push(cfg);
    //     }
    // }

    getLotterExCfgByIndex(index: number): GameConfig.LotteryExchangeCfgM {
        return this.lotteryExchangeCfg[index];
    }

    /**是否有奖励可以领 */
    isCanGetReward() {
        for (let i = 0; i < this.maxNum; i++) {
            let cfg = this.getLotterExCfgByIndex(i);
            if (cfg) {
                let canGet = this.canGetReward(1 << i);
                if (canGet && this.totalNum >= cfg.m_iNubmer) {
                    return true;
                }
            }
        }
        return false;
    }
    isHasCount() {
        return this.freeNum > 0 ? true : false;
    }
    private _sortByID(a: GameConfig.SkyLotteryConfigM, b: GameConfig.SkyLotteryConfigM): number {
        return a.m_ucId - b.m_ucId;
    }

    /**获取魔帝宝库抽奖数组*/
    getLotteryArr(type: number, day: number): GameConfig.SkyLotteryConfigM[] {
        //本地读取数据改成服务器数据
        let cfgs: GameConfig.SkyLotteryConfigM[] = [];
        for (let i = 0, con = this.skyLotteryConfig.length; i < con; i++) {
            let item = this.skyLotteryConfig[i];
            let cfg = {} as GameConfig.SkyLotteryConfigM;
            if (item.m_ucType == type) {
                cfg.m_iItemId = item.m_iItemId;
                cfg.m_iItemNumber = item.m_iItemNumber;
                cfg.m_ucId = item.m_ucSeq;
                cfg.m_ucType = item.m_ucType;
                cfgs.push(cfg);
            }
        }
        return cfgs;
        // let maxDay: number = this.lotteryTypeMaxDayDic[type];
        // day = day >= maxDay ? maxDay : day;
        // let key: string = StringUtil.marriageLine(type, day);
        // return this.lotteryDic[key];
    }

    getLotterSeverCfg(index: number) {
        return this.skyLotteryConfig[index];
    }
    /**
     * 按照序号排序，序号为1的是大奖。
     * @param a
     * @param b
     *
     */
    private _sortByNumber(a: GameConfig.SkyLotteryConfigM, b: GameConfig.SkyLotteryConfigM): number {
        return a.m_ucId - b.m_ucId;
    }

    /**
     * 根据类型取记录
     * @param type
     * @return
     *
     */
    getRecord(type: number): Protocol.SkyLotteryRecordList[] {
        if (type == KeyWord.LOTTERY_TYPE_SKY) {
            return this.bjRecord;
        }
        else if (type == KeyWord.LOTTERY_TYPE_MJ) {
            return this.mjRecord;
        }

        return null;
    }

    /**
     * 初始化炼化配置。
     * @param configs
     *
     */
    setLhConfigs(configs: GameConfig.LotteryLHConfigM[]): void {
        this.m_lhConfigMap = {};
        for (let config of configs) {
            this.m_lhConfigMap[Math.floor(config.m_iThingId / 10)] = config.m_iPrice;
        }
    }

    /**
     * 根据ID获取对应的炼化值。
     * @param id
     * @return
     *
     */
    getLhValueByID(id: number): number {
        return this.m_lhConfigMap[Math.floor(id / 10)];
    }

    /**
     * 尝试将指定的物品放入炼化区。
     * @return
     *
     */
    tryPutInLh(data: ThingItemData): boolean {
        // 寻找空格插入
        for (let i: number = 0; i < TgbjData.LH_CAPACITY; i++) {
            if (this.lhPosObj[i]) {
                continue;
            }

            this.lhPosObj[i] = data;
            return true;
        }

        return false;
    }

    /**
     * 尝试将指定的物品从炼化区取出。
     * @param data
     * @return
     *
     */
    tryTakeFromLh(data: ThingItemData): boolean {
        let tmpData: ThingItemData;
        for (let i: number = 0; i < TgbjData.LH_CAPACITY; i++) {
            tmpData = this.lhPosObj[i];
            if (null == tmpData) {
                continue;
            }

            if (this._isSameItem(tmpData, data)) {
                this.lhPosObj[i] = null;
                delete this.lhPosObj[i];
                return true;
            }
        }

        return false;
    }

    isInLh(data: ThingItemData): boolean {
        let tmpData: ThingItemData;
        for (let i: number = 0; i < TgbjData.LH_CAPACITY; i++) {
            tmpData = this.lhPosObj[i];
            if (null == tmpData) {
                continue;
            }

            if (this._isSameItem(tmpData, data)) {
                return true;
            }
        }

        return false;
    }

    clearLh(): void {
        this.lhPosObj = {};
    }

    /**更新全服记录
     * (根据各种类型，
     * Macros.SKYLOTTERY_SERVER_RECORD_TYPE 抽奖,
     * Macros.SKYLOTTERY_SERVER_BUY_RECORD_TYPE 兑换
     * )
     * */
    updateAllRecord(recordRsp: Protocol.SkyLotteryListRecordRsp, m_ucLotterType: number): void {

        let key: string = StringUtil.marriageLine(m_ucLotterType, recordRsp.m_ucListType);
        this.allRecordDic[key] = recordRsp;
    }

    /**获取全服记录  Macros.SKYLOTTERY_SERVER_RECORD_TYPE*/
    getAllRecordByType(type: number, lotteryType: number): Protocol.SkyLotteryListRecordRsp {
        let key: string = StringUtil.marriageLine(lotteryType, type);
        return this.allRecordDic[key];
    }

    /**添加一个我的抽奖记录*/
    addOneLotteryRecord(operateRsp: Protocol.SkyLotteryOperateRsp, m_ucLotterType: number): void {
        if (!this.myRecordDic[m_ucLotterType]) {
            this.myRecordDic[m_ucLotterType] = new Array<Protocol.SkyLotteryOperateRsp>();
        }
        let vector: Protocol.SkyLotteryOperateRsp[] = this.myRecordDic[m_ucLotterType] as Protocol.SkyLotteryOperateRsp[];
        while (vector.length >= EnumTgbjRule.MAX_RECORE_COUNT) {
            vector.splice(0, 1);
        }
        // vector.push(operateRsp.clone());
        vector.push(operateRsp);
    }

    /**获取我的抽奖记录*/
    getMyLotteryRecord(lotteryType: number): Protocol.SkyLotteryOperateRsp[] {
        return this.myRecordDic[lotteryType];
    }

    /**添加一个我的兑换记录*/
    addOneExchangeRecord(m_stThing: Protocol.ContainerThingInfo): void {
        while (this.exchangeRecordVec.length >= EnumTgbjRule.MAX_RECORE_COUNT) {
            this.exchangeRecordVec.splice(0, 1);
        }
        //   this.exchangeRecordVec.push(m_stThing.clone());
        this.exchangeRecordVec.push(m_stThing);

    }



    /**获取我的兑换记录数组*/
    getMyexchangeRecordVec(): Protocol.ContainerThingInfo[] {
        return this.exchangeRecordVec;
    }

    private _isSameItem(data1: ThingItemData, data2: ThingItemData): boolean {
        return (null != data1.data && null != data2.data && data1.data.m_iThingID == data2.data.m_iThingID && data1.data.m_usPosition == data2.data.m_usPosition && data1.data.m_iNumber == data2.data.m_iNumber);
    }



    get allRecordDic(): {} {
        if (!this._allRecordDic) {
            this._allRecordDic = {};
        }
        return this._allRecordDic;
    }

    get exchangeRecordVec(): Protocol.ContainerThingInfo[] {
        if (!this._exchangeRecordVec) {
            this._exchangeRecordVec = new Array<Protocol.ContainerThingInfo>();
        }
        return this._exchangeRecordVec;
    }

    get myRecordDic(): {} {
        if (!this._myRecordDic) {
            this._myRecordDic = {};
        }
        return this._myRecordDic;
    }
    /**是否可以领取奖励 */
    canGetReward(id: number): boolean {
        return (this.flag & id) == 0;
    }
}
