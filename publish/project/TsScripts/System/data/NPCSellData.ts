import { EnumExcStoreTab } from 'System/business/EnumExcStoreTab'
import { EnumStoreID } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { ShopRule } from 'System/constants/ShopRule'
import { NPCData } from 'System/data/NPCData'
import { PetData } from 'System/data/pet/PetData'
import { ThingData } from 'System/data/thing/ThingData'
import { MarketItemData } from 'System/data/vo/MarketItemData'
import { SellLimitData } from 'System/data/vo/SellLimitData'
import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { SpecialCharUtil } from 'System/utils/SpecialCharUtil'
import { DataFormatter } from 'System/utils/DataFormatter'

/**
 * 该类存放NPC售卖列表
 * @author fygame, xiaojialin
 *
 */
export class NPCSellData {

    /** 条件限制列表 */
    private m_conditionsLimit: { [sellCond: number]: { [condVal: number]: number } } = {};
    /**NPC售卖配置是否已经初始化。*/
    isNpcSellConfigInit: boolean;

    /**NPC限购数据是否已经初始化。*/
    private m_isNpcSellLimitInit: boolean;

    /**
     * 数据表 [storeID, Vector.<NPCSellConfig_Flash>]
     */
    private m_npcStoreMap: { [storeId: number]: GameConfig.NPCSellConfigM[] } = {};

    /**
     * 商店物品综合数据表，这是一个二级表，第一级是[商店ID - 商店货架表]，第二级是[商品ID - 商品数据]。
     */
    private m_storeDataMap: { [storeId: number]: { [thingId: number]: MarketItemData[] } } = {};

    /**
     * 兑换商城数据表[页签 - 页签数据(Vector.<MarketItemData>)]
     */
    private m_excStoreDataMap: { [tab: number]: MarketItemData[] | { [tab: number]: MarketItemData[] } };

    /**
     * 其他商店的数据表[商店ID - 货品数据(Vector.<MarketItemData>)]
     */
    private m_otherStoreMap: { [storeId: number]: MarketItemData[] | { [tab: number]: MarketItemData[] } } = {};

    /**
     * 物品限购数据表[商店ID_商品ID - 限购数据]
     */
    private m_sellItemLimitTable: { [storeIdThingIdKey: string]: SellLimitData } = {};

    private m_itemId2storeId: { [itemId: number]: number[] } = {};

    /**
     * 商店ID到NPC ID的映射。
     */
    private m_storeID2NpcID: { [storeId: number]: number } = {};

    private m_storeID2ExcID: { [storeId: number]: number[] } = {};

    /**神秘商店随机物品自动刷新时间和下次刷新价格*/
    private m_npcRandomStoreCfg: { [storeId: number]: GameConfig.NPCRandomStoreCfgM } = {};

    /**
     * 活动商城数据表 [ActivityID, Vector.<NPCSellConfig_Flash>]
     */
    private m_npcActivityStoreMap: { [actId: number]: GameConfig.NPCSellConfigM[] } = {};
    private storeId2activityId: { [storeId: number]: number } = {};

    private xianShiTeMaiDays: number[] = [];

    get XianShiTeMaiDays(): number[] {
        return this.xianShiTeMaiDays;
    }

    //特卖商店循环周
    //以2017年12月4号作为起始时间,7天循环一次,根据表格配置的周循环
    private readonly startTime: string = '2017-12-04';
    private max_weekNum: number;
    get LoopWeekDay(): number {
        this.max_weekNum = G.DataMgr.constData.getValueById(KeyWord.PARAM_SPEC_STORE_LOOP_WEEK);
        if (this.max_weekNum == null) {
            this.max_weekNum = 1;
        }
        let nowTime: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        let starttime = Math.floor((DataFormatter.getTimeByTimeStr(this.startTime) / 1000));
        let week = Math.ceil((nowTime - starttime) / 86400 / 7);
        let loopWeek: number = week;
        let chaTime = Math.floor(nowTime - starttime);
        if (chaTime < 86400) {
            loopWeek = 1;
        } else {
            if (week % this.max_weekNum == 0) {
                loopWeek = this.max_weekNum;
            } else if (week > this.max_weekNum) {
                loopWeek = week - this.max_weekNum * (Math.floor(week / this.max_weekNum));
            }
        }
        return loopWeek;
    }


    constructor() {
        // 建立兑换商城分类索引
        this.m_excStoreDataMap = this._buildComplexDataMap(EnumExcStoreTab.DH_TABS);
    }

    onCfgReady() {
        this.setNPCSellData();
        this.setNPCSellLimitData();
        this.setNpcRandomStoreCfg();
    }

    private _buildComplexDataMap(tabConfig: { value: number, subTypes: { value: number, label: string }[] }[]): { [tab: number]: any } {
        let map: { [tab: number]: any } = {};
        for (let mainTypeConf of tabConfig) {
            let subTypes: { value: number, label: string }[] = mainTypeConf.subTypes;
            if (null != subTypes && subTypes.length > 0) {
                let subDataMap: any = {};
                for (let subTypeConf of subTypes) {
                    subDataMap[subTypeConf.value] = new Array<MarketItemData>();
                }
                map[mainTypeConf.value] = subDataMap;
            }
            else {
                map[mainTypeConf.value] = new Array<MarketItemData>();
            }
        }

        return map;
    }

    /**
     * 存放NPC买卖数据，每个售卖类型对应其售卖的物品列表
     * @param value
     *
     */
    private setNPCSellData(): void {
        let dataList: GameConfig.NPCSellConfigM[] = G.Cfgmgr.getCfg('data/NPCSellConfigM.json') as GameConfig.NPCSellConfigM[];

        // 售卖表不能通过物品ID建索引，因为：
        // 1. 不同商店允许配相同ID的物品
        // 2. 同一个商店同一个ID允许配多行
        let idStoreList: number[];
        for (let sellConf of dataList) {
            if (sellConf.m_iItemID == 0) continue;

            let excArr = this.m_storeID2ExcID[sellConf.m_iStoreID];
            if (null == excArr) {
                this.m_storeID2ExcID[sellConf.m_iStoreID] = excArr = [];
            }
            excArr.push(sellConf.m_astExchange[0].m_iExchangeID);

            if (sellConf.m_iSaleCond > 0) {
                if (this.m_conditionsLimit[sellConf.m_iSaleCond] == null) {
                    this.m_conditionsLimit[sellConf.m_iSaleCond] = {};
                }

                if (KeyWord.SELL_LIMIT_STARTDAY == sellConf.m_iSaleCond) {
                    let oldValue = this.m_conditionsLimit[sellConf.m_iSaleCond][sellConf.m_iSaleCondVal];
                    uts.assert(undefined == oldValue || oldValue == sellConf.m_iStoreID);
                }

                this.m_conditionsLimit[sellConf.m_iSaleCond][sellConf.m_iSaleCondVal] = sellConf.m_iStoreID;
            }

            if (sellConf.m_iActivityID != 0) {
                if (!this.m_npcActivityStoreMap[sellConf.m_iActivityID]) {
                    this.m_npcActivityStoreMap[sellConf.m_iActivityID] = new Array<GameConfig.NPCSellConfigM>();
                }
                this.m_npcActivityStoreMap[sellConf.m_iActivityID].push(sellConf);

                uts.assert(!(sellConf.m_iStoreID in this.storeId2activityId) || this.storeId2activityId[sellConf.m_iStoreID] == sellConf.m_iActivityID);
                this.storeId2activityId[sellConf.m_iStoreID] = sellConf.m_iActivityID;
            }
            if (sellConf.m_iStoreID == 0) // 过滤掉无用数据
            {
                continue;
            }

            // 增加商店
            this.m_storeID2NpcID[sellConf.m_iStoreID] = 0;

            // 删掉无效购买方式
            for (let i: number = sellConf.m_astExchange.length - 1; i >= 0; i--) {
                if (0 == sellConf.m_astExchange[i].m_iExchangeID) {
                    sellConf.m_astExchange.splice(i, 1);
                    sellConf.m_ucExchangeNumber--;
                }
            }

            if (Macros.EXCHANGE_STORE_ID == sellConf.m_iStoreID) {
                // 将货币进行排序，因为有的物品不支持钻石购买，所以把钻石排在后面，默认第一个货币就是物品
                sellConf.m_astExchange.sort(this._sortOnExcId);
            }

            if (this.m_npcStoreMap[sellConf.m_iStoreID] == undefined) {
                // 数据载体初始化
                this.m_npcStoreMap[sellConf.m_iStoreID] = new Array<GameConfig.NPCSellConfigM>();
            }
            this.m_npcStoreMap[sellConf.m_iStoreID].push(sellConf);

            let marketItemData: MarketItemData = this._processStoreDataMap(sellConf);
            if (Macros.EXCHANGE_STORE_ID == sellConf.m_iStoreID) {
                // 处理兑换商城数据
                this._processExcStoreData(marketItemData);
            }
            else {
                this._processOtherStoreData(marketItemData);
            }

            // 记录商店列表
            let shortId = Math.floor(sellConf.m_iItemID / 10);
            idStoreList = this.m_itemId2storeId[shortId];
            if (null == idStoreList) {
                this.m_itemId2storeId[shortId] = idStoreList = new Array<number>();
            }
            if (idStoreList.indexOf(sellConf.m_iStoreID) < 0) {
                idStoreList.push(sellConf.m_iStoreID);
            }
        }

        this._sortExcStoreData();
        this._sortOtherStoreData();

        this._initDefaultSeq(this.m_excStoreDataMap);
        this._initDefaultSeq(this.m_otherStoreMap);

        this.isNpcSellConfigInit = true;
    }

    private _sortOnExcId(a: GameConfig.Exchange, b: GameConfig.Exchange): number {
        if (GameIDUtil.isYuanbaoID(a.m_iExchangeID)) {
            return 1;
        }
        else if (GameIDUtil.isYuanbaoID(b.m_iExchangeID)) {
            return -1;
        }
        else {
            return 0;
        }
    }

    /**
     * 存放NPC限购数据
     * @param value
     *
     */
    private setNPCSellLimitData(): void {
        let dataList: GameConfig.NPCSellLimitConfigM[] = G.Cfgmgr.getCfg('data/NPCSellLimitConfigM.json') as GameConfig.NPCSellLimitConfigM[];

        //初始化限购数量
        let sellLimitData: SellLimitData;

        let marketItemData: MarketItemData;
        let storeMap: { [thingId: number]: MarketItemData[] };
        let marketItemDataList: MarketItemData[];
        for (let sellLimitConfig of dataList) {
            if (0 == sellLimitConfig.m_iThingID) {
                // 过滤掉无用数据
                continue;
            }

            sellLimitData = new SellLimitData(sellLimitConfig);
            // 用商店ID、商品ID作为索引
            if (defines.has('_DEBUG')) {
                uts.assert(null == this.m_sellItemLimitTable[sellLimitConfig.m_iStoreID + '_' + sellLimitConfig.m_iThingID], '商店' + sellLimitConfig.m_iStoreID + '中的物品' + sellLimitConfig.m_iThingID + '存在重复限购配置！');
            }
            this.m_sellItemLimitTable[sellLimitConfig.m_iStoreID + '_' + sellLimitConfig.m_iThingID] = sellLimitData;

            if (sellLimitConfig.m_iStoreID == EnumStoreID.HuiGou) {
                //回购商店
                continue;
            }

            // 更新MarketItemData里的限购数据
            storeMap = this.m_storeDataMap[sellLimitConfig.m_iStoreID];
            if (null == storeMap) {
                uts.logError('限购表中的商店不在售卖表中：' + sellLimitConfig.m_iStoreID);
                continue;
            }

            marketItemDataList = storeMap[sellLimitConfig.m_iThingID];
            if (null == marketItemDataList) {
                continue;
            }

            for (marketItemData of marketItemDataList) {
                marketItemData.sellLimitData = sellLimitData;
            }

            // 抽取出限时特卖的日期
            if (EnumStoreID.XianShiTeMai == sellLimitConfig.m_iStoreID) {
                if (this.xianShiTeMaiDays.indexOf(sellLimitConfig.m_iStartTime) < 0) {
                    this.xianShiTeMaiDays.push(sellLimitConfig.m_iStartTime);
                }
            }
        }

        this.m_isNpcSellLimitInit = true;
    }

    /**
     * 初始化商店ID到NPC ID的映射。
     * @param npcData
     *
     */
    initStoreID2NpcID(npcData: NPCData): void {
        let npcConfig: GameConfig.NPCConfigM;
        for (let storeIDKey in this.m_storeID2NpcID) {
            npcConfig = npcData.getNPCConfigByFunctionAndParam(KeyWord.NPC_FUNCTION_SHOP, parseInt(storeIDKey));
            if (null != npcConfig) {
                this.m_storeID2NpcID[storeIDKey] = npcConfig.m_iNPCID;
            } else {
                uts.logError('Cannot found any npc bind with store: ' + storeIDKey);
            }
        }
    }

    getExcIDByStoreID(storeID: number): number {
        let excArr = this.m_storeID2ExcID[storeID];
        if (null != excArr) {
            return excArr[0];
        }
        return 0;
    }

    /**
     * 根据商店ID获取对应的NPC的ID。
     * @param storeID
     * @return
     *
     */
    getNpcIDByStoreID(storeID: number): number {
        // 兑换商店和宗门商店实际上不是挂靠在实NPC身上的，但实现时需要把它挂在某个隐藏的NPC上才能找到具体的配置
        // 对于这类特殊的商店，不会挂在多个NPC身上，因此可以通过反查NPC表得到对应的唯一的NPC
        // 而其他真正挂靠在NPC上的商店可能会挂在多个NPC身上，因此不能通过读表，而要通过地图信息
        return this.m_storeID2NpcID[storeID];
    }

    /**
     * 更新商城的道具信息，把道具配置一起缓存起来
     * @param thingDataMgr 物品数据管理器。
     *
     */
    updateMarketItemData(thingDataMgr: ThingData): void {
        let thingConfig: GameConfig.ThingConfigM;
        let id: number = 0;
        let marketItemDataList: MarketItemData[];
        let marketItemData: MarketItemData;
        let errIDStr: string = '';
        for (let storeIdKey in this.m_storeDataMap) {
            let storeMap = this.m_storeDataMap[storeIdKey];
            for (let idKey in storeMap) {
                id = parseInt(idKey);
                thingConfig = null;
                marketItemDataList = storeMap[idKey];
                for (marketItemData of marketItemDataList) {
                    // 只有物品才需要更新物品配置
                    if (!GameIDUtil.isBagThingID(marketItemData.sellConfig.m_iItemID)) {
                        continue;
                    }

                    if (null == thingConfig) {
                        thingConfig = ThingData.m_itemMap[id];
                        if (null == thingConfig) {
                            if ('' == errIDStr) {
                                errIDStr = id.toString();
                            }
                            else {
                                errIDStr += (', ' + id);
                            }
                        }
                    }
                    marketItemData.itemConfig = thingConfig;
                }
            }
        }

        if (defines.has('_DEBUG')) { uts.assert('' == errIDStr, '商城物品缺少配置：' + errIDStr); }
    }

    /**
     * 通过ItemId获取物品获取限购信息
     * @param id - 物品Id
     * @return 返回物品售卖信息
     *
     */
    getNPCSellLimitDataById(storeID: number, itemID: number): SellLimitData {
        return this.m_sellItemLimitTable[storeID + '_' + itemID];
    }

    /**
     * 处理商城数据。
     * @param config
     *
     */
    private _processStoreDataMap(config: GameConfig.NPCSellConfigM): MarketItemData {
        let marketDataMap = this.m_storeDataMap[config.m_iStoreID];
        if (null == marketDataMap) {
            this.m_storeDataMap[config.m_iStoreID] = marketDataMap = {};
        }

        let marketItemDataList: MarketItemData[] = marketDataMap[config.m_iItemID];
        if (null == marketItemDataList) {
            marketDataMap[config.m_iItemID] = marketItemDataList = new Array<MarketItemData>();
        }

        let marketItemData: MarketItemData = new MarketItemData();
        marketItemData.sellConfig = config;
        marketItemDataList.push(marketItemData);

        return marketItemData;
    }

    /**
     * 处理兑换商城数据。
     * @param config
     *
     */
    private _processExcStoreData(marketItemData: MarketItemData): void {
        let config: GameConfig.NPCSellConfigM = marketItemData.sellConfig;

        // 加入归属页签中
        let tabList = this.m_excStoreDataMap[config.m_iItemTab];
        if (tabList instanceof Array) {
            (tabList as MarketItemData[]).push(marketItemData);
        }
        else {
            if (tabList != null) {
                if (tabList.hasOwnProperty(config.m_iItemSubTab.toString())) {
                    (tabList[config.m_iItemSubTab] as MarketItemData[]).push(marketItemData);
                }
                if (tabList.hasOwnProperty(KeyWord.GENERALSTORE_TAB_ALL.toString())) {
                    (tabList[KeyWord.GENERALSTORE_TAB_ALL] as MarketItemData[]).push(marketItemData);
                }
            }
        }
    }

    /**
     * 处理其他商城数据，这些商城通常是没有分页签的。
     * @param config
     *
     */
    private _processOtherStoreData(marketItemData: MarketItemData): void {
        let config: GameConfig.NPCSellConfigM = marketItemData.sellConfig;

        // 加入归属页签中
        let dataList: MarketItemData[];
        if (0 != config.m_iItemTab) {
            // 说明是有页签的
            let tabMap = this.m_otherStoreMap[config.m_iStoreID];
            if (null == tabMap) {
                this.m_otherStoreMap[config.m_iStoreID] = tabMap = {};
            }
            dataList = tabMap[config.m_iItemTab] as MarketItemData[];
            if (null == dataList) {
                tabMap[config.m_iItemTab] = dataList = new Array<MarketItemData>();
            }
            dataList.push(marketItemData);

            // 加入推荐页签
            if (config.m_ucIsRecommend > 0) {
                dataList = tabMap[KeyWord.GENERALSTORE_TAB_SUGGEST] as MarketItemData[];
                if (null == dataList) {
                    tabMap[KeyWord.GENERALSTORE_TAB_SUGGEST] = dataList = new Array<MarketItemData>();
                }
                dataList.push(marketItemData);
            }

            // 加入新品页签
            if (config.m_ucIsNew > 0) {
                dataList = tabMap[KeyWord.GENERALSTORE_TAB_NEW] as MarketItemData[];
                if (null == dataList) {
                    tabMap[KeyWord.GENERALSTORE_TAB_NEW] = dataList = new Array<MarketItemData>();
                }
                dataList.push(marketItemData);
            }
        }
        else {
            dataList = this.m_otherStoreMap[config.m_iStoreID] as MarketItemData[];
            if (null == dataList) {
                this.m_otherStoreMap[config.m_iStoreID] = dataList = new Array<MarketItemData>();
            }
            dataList.push(marketItemData);
        }
    }

    /**
     * 对兑换商城物品进行排序。
     *
     */
    private _sortExcStoreData(): void {
        for (let tabKey in this.m_excStoreDataMap) {
            let obj = this.m_excStoreDataMap[tabKey];
            if (obj instanceof Array) {
                this._sortList(tabKey, obj as MarketItemData[]);
            }
            else {
                for (let tabKey in obj) {
                    this._sortList(tabKey, obj[tabKey] as MarketItemData[]);
                }
            }
        }
    }

    private _sortOtherStoreData(): void {
        let storeID: number = 0;
        let list: MarketItemData[];
        let sortDel = delegate(this, this._sortByBuyCondition);
        for (let key in this.m_otherStoreMap) {
            storeID = parseInt(key);
            let keyObj = this.m_otherStoreMap[key];
            if (keyObj instanceof Array) {
                list = keyObj as MarketItemData[];
                if (EnumStoreID.GUILD_STORE == storeID) {
                    // 宗门商店按照天机府等级条件排序
                    list.sort(sortDel);
                }
                else {
                    // 其它商店按照默认排序
                    this._sortList(null, list);
                }
            }
            else {
                for (let tabKey in keyObj) {
                    list = keyObj[tabKey] as MarketItemData[];
                    if (EnumStoreID.GUILD_STORE == storeID) {
                        // 宗门商店按照天机府等级条件排序
                        list.sort(sortDel);
                    }
                    else {
                        // 其它商店按照默认排序
                        this._sortList(null, list);
                    }
                }
            }
        }
    }

    private _initDefaultSeq(dataMap: { [tab: number]: MarketItemData[] | { [tab: number]: MarketItemData[] } }): void {
        let i: number = 0;
        let len: number = 0;
        let list: MarketItemData[];
        for (let key in dataMap) {
            let obj = dataMap[key];
            if (obj instanceof Array) {
                list = obj as MarketItemData[];
                len = list.length;
                for (i = 0; i < len; i++) {
                    list[i].defaultSeq = i;
                }
            }
            else {
                for (let tabKey in obj) {
                    list = obj[tabKey] as MarketItemData[];
                    len = list.length;
                    for (i = 0; i < len; i++) {
                        list[i].defaultSeq = i;
                    }
                }
            }
        }
    }

    private _sortList(key: string, list: MarketItemData[]): void {
        if (KeyWord.GENERALSTORE_TAB_SUGGEST == parseInt(key)) {
            list.sort(delegate(this, this._sortByRecommend));
        }
        else if (KeyWord.GENERALSTORE_TAB_NEW == parseInt(key)) {
            list.sort(delegate(this, this._sortByNew));
        }
        else {
            list.sort(delegate(this, this._sortByNewAndSequence));
        }
    }

    private _sortByRecommend(a: MarketItemData, b: MarketItemData): number {
        let aSellConfig: GameConfig.NPCSellConfigM = a.sellConfig;
        let bSellConfig: GameConfig.NPCSellConfigM = b.sellConfig;

        if (aSellConfig.m_ucIsRecommend == bSellConfig.m_ucIsRecommend) {
            return this._sortBySequence(a.sellConfig, b.sellConfig);
        }
        else {
            return this._sortReg(aSellConfig.m_ucIsRecommend, bSellConfig.m_ucIsRecommend);
        }
    }

    private _sortBySequence(a: GameConfig.NPCSellConfigM, b: GameConfig.NPCSellConfigM): number {
        if (a.m_ucSequence == b.m_ucSequence) {
            return this._sortReg(a.m_astExchange[0].m_iExchangeValue, b.m_astExchange[0].m_iExchangeValue);
        } else {
            return this._sortReg(a.m_ucSequence, b.m_ucSequence);
        }
    }

    private _sortByNew(a: MarketItemData, b: MarketItemData): number {
        let aSellConfig: GameConfig.NPCSellConfigM = a.sellConfig;
        let bSellConfig: GameConfig.NPCSellConfigM = b.sellConfig;

        if (aSellConfig.m_ucIsNew == bSellConfig.m_ucIsNew) {
            return this._sortBySequence(a.sellConfig, b.sellConfig);
        }
        else {
            return this._sortReg(aSellConfig.m_ucIsNew, bSellConfig.m_ucIsNew);
        }
    }

    private _sortByNewAndSequence(a: MarketItemData, b: MarketItemData): number {
        let aSellConfig: GameConfig.NPCSellConfigM = a.sellConfig;
        let bSellConfig: GameConfig.NPCSellConfigM = b.sellConfig;

        if (aSellConfig.m_ucIsNew > 0) {
            if (bSellConfig.m_ucIsNew > 0) {
                // 新品之间按照新品排序排列
                if (aSellConfig.m_ucIsNew != bSellConfig.m_ucIsNew) {
                    return this._sortReg(aSellConfig.m_ucIsNew, bSellConfig.m_ucIsNew);
                }
                else {
                    return this._sortBySequence(aSellConfig, bSellConfig);
                }
            }
            else {
                return -1; // 新品>非新品
            }
        }
        else {
            if (bSellConfig.m_ucIsNew > 0) {
                return 1; // 新品>非新品
            }
            else {
                // 非新品按照“排列顺序”的数值排列
                return this._sortBySequence(aSellConfig, bSellConfig);
            }
        }
    }

    /**
     * 按照购买条件进行排序。
     * @param a
     * @param b
     * @return
     *
     */
    private _sortByBuyCondition(a: MarketItemData, b: MarketItemData): number {
        let aSellConfig: GameConfig.NPCSellConfigM = a.sellConfig;
        let bSellConfig: GameConfig.NPCSellConfigM = b.sellConfig;

        if (aSellConfig.m_iSaleCondVal == bSellConfig.m_iSaleCondVal) {
            return this._sortBySequence(aSellConfig, bSellConfig);
        }
        else {
            return this._sortReg(aSellConfig.m_iSaleCondVal, bSellConfig.m_iSaleCondVal);
        }
    }

    private _sortReg(a: number, b: number): number {
        if (a == b) {
            return 0;
        }
        else {
            if (0 != a) {
                if (0 == b) {
                    return -1;
                }
                else {
                    return a - b;
                }
            }
            else {
                return 1;
            }
        }
    }

    /**
     * 通过商店Id获取相关售卖信息列表
     * @param id
     * @return 售卖信息群组
     *
     */
    getNPCSellDataByStroeId(id: number): GameConfig.NPCSellConfigM[] {
        let result: GameConfig.NPCSellConfigM[];
        if (this.m_npcStoreMap[id] == undefined) {
            // 未找到空数据
            return [];
        }

        result = this.m_npcStoreMap[id];
        // 过滤掉非本职业的物品
        let profShow: number = 0;
        let heroProf: number = G.DataMgr.heroData.profession;
        for (let i: number = result.length - 1; i >= 0; i--) {
            profShow = result[i].m_ucProfShow;
            if (0 != profShow && heroProf != profShow) {
                result.splice(i, 1);
            }
        }
        return result;
    }

    /**
     * 通过物品ID、商店ID和货币ID获取物品售卖信息。
     * @param id - 物品Id
     * @param storeID - 商店ID，默认是0，表示从所有商店搜索。
     * @param excID - 货币ID，默认是0，表示不指定货币，以找到的第一个为准。
     * @return 返回物品售卖信息
     *
     */
    getNPCSellDataByItemId(id: number, storeID: number = 0, excID: number = 0): GameConfig.NPCSellConfigM {
        if (0 == storeID) {
            let sellConfig: GameConfig.NPCSellConfigM;
            for (let storeKey in this.m_npcStoreMap) {
                sellConfig = this._findSellConfigInStore(parseInt(storeKey), id, excID);
                if (null != sellConfig) {
                    return sellConfig;
                }
            }
            return null;
        }
        else {
            return this._findSellConfigInStore(storeID, id, excID);
        }
    }

    private _findSellConfigInStore(storeID: number, id: number, excID: number = 0): GameConfig.NPCSellConfigM {
        let storeItemList: GameConfig.NPCSellConfigM[] = this.m_npcStoreMap[storeID];
        let result: GameConfig.NPCSellConfigM;
        let exc: GameConfig.Exchange;
        if (null != storeItemList) {
            for (let sellConfig of storeItemList) {
                if (id != sellConfig.m_iItemID) {
                    continue;
                }

                // 没有指定货币，默认返回第一个
                if (0 == excID) {
                    return sellConfig;
                }

                // 指定了货币，先按照严格模式进行查找
                for (exc of sellConfig.m_astExchange) {
                    if (excID == exc.m_iExchangeID) {
                        return sellConfig;
                    }
                }

                // 如果是钻石或铜钱，不区分绑定和非绑定
                if (GameIDUtil.isYuanbaoID(excID)) {
                    for (exc of sellConfig.m_astExchange) {
                        if (GameIDUtil.isYuanbaoID(exc.m_iExchangeID)) {
                            return sellConfig;
                        }
                    }
                }
            }
        }

        return null;
    }

    /**
     * 根据物品ID返回其商城综合数据。
     * @param id 物品ID。
     * @param storeID 商店ID，默认为0，表示从所有商店中搜索，并以搜到的第一个为准。
     * @param excID 货币ID，默认是0，表示不指定货币，以找到的第一个为准。
     * @return 指定物品的商城数据。
     *
     */
    getMarketDataByItemId(id: number, storeID = 0, excID = 0, amount = 0): MarketItemData {
        let result: MarketItemData = this._getMarketDataByItemIdInternal(id, storeID, excID, amount);
        if (null != result) {
            return result;
        }
        // 找不到的话就找对应的绑定ID或非绑定ID
        if (0 == id % 2) {
            // 尝试找绑定的
            id++;
        }
        else {
            id--;
        }
        result = this._getMarketDataByItemIdInternal(id, storeID, excID, amount);
        return result;
    }

    private _getMarketDataByItemIdInternal(id: number, storeID: number, excID: number, amount: number): MarketItemData {
        let marketItemDataList: MarketItemData[];
        let result: MarketItemData;
        if (0 == storeID) {
            for (let storeIdKey in this.m_storeDataMap) {
                let storeMap = this.m_storeDataMap[storeIdKey];
                marketItemDataList = storeMap[id];
                result = this._getMarketDataFromStoreList(marketItemDataList, excID, amount);
                if (null != result) {
                    return result;
                }
            }
        }
        else {
            marketItemDataList = this.m_storeDataMap[storeID][id];
            if (marketItemDataList == null)
                uts.assert(true, "jackson 请检查“售卖表”数据..." + storeID);
            result = this._getMarketDataFromStoreList(marketItemDataList, excID, amount);
            if (null != result) {
                return result;
            }
        }
        return null;
    }

    private _getMarketDataFromStoreList(dataList: MarketItemData[], excID: number, amount: number): MarketItemData {
        if (null != dataList) {
            let exc: GameConfig.Exchange;
            for (let marketItemData of dataList) {
                if (amount > 0 && marketItemData.sellConfig.m_ucAmount != amount) {
                    continue;
                }

                if (0 == excID) {
                    return marketItemData;
                }

                // 指定了货币，先按照严格模式进行查找
                for (exc of marketItemData.sellConfig.m_astExchange) {
                    if (excID == exc.m_iExchangeID) {
                        return marketItemData;
                    }
                }
            }
        }

        return null;
    }

    /**
     * 根据商城上的售卖类型获取相应的数据列表。
     * @param mainType 售卖大分类。
     * @param subType 售卖子分类，若指定的售卖大分类不存在子分类将忽略此参数。
     * @return 与指定的售卖类型相匹配的数据列表。
     *
     */
    getMallListByType(storeID: number, mainType: number | string = null, subType: number | string = null): MarketItemData[] {
        let storeDataMap;
        if (EnumStoreID.EXCHANGE_STORE == storeID) {
            storeDataMap = this.m_excStoreDataMap;
        }
        else {
            storeDataMap = this.m_otherStoreMap[storeID];
        }

        let rawResult: MarketItemData[]
        if (storeDataMap instanceof Array) {
            rawResult = storeDataMap;
        }
        else {
            if (null == mainType) {
                return null;
            }
            rawResult = storeDataMap[mainType];
            if (undefined == rawResult) {
                return null;
            }

            if (!(rawResult instanceof Array) && null != subType) {
                rawResult = rawResult[subType];
            }
        }

        if (null == rawResult) {
            return null;
        }

        let result: MarketItemData[] = rawResult.concat();
        // 过滤掉非本职业的物品,或者活动未开启则不显示售卖（如跨服鲜花排行榜）。
        let profShow: number = 0;
        let heroProf: number = G.DataMgr.heroData.profession;
        for (let i: number = result.length - 1; i >= 0; i--) {
            let sellConfig: GameConfig.NPCSellConfigM = result[i].sellConfig;
            profShow = sellConfig.m_ucProfShow;
            let isActivityOpen: boolean = true;
            if (sellConfig.m_iActivityID > 0) {
                //isActivityOpen = G.DataMgr.activityData.isActivityOpen(sellConfig.m_iActivityID);
            }
            if ((0 != profShow && heroProf != profShow) || !isActivityOpen) {
                result.splice(i, 1);
            }
        }
        return result;
    }

    /**
     * 更新商城物品的vip额外可购买数量、是否达到vip购买等级等信息。
     * @param vipLevel 当前vip等级。
     *
     */
    updateVipLimit(vipLevel: number): void {
        let hasChange: boolean;
        let vipLimit: number[];
        let vipLimitLen: number = 0;
        let limitCount: number = 0;
        let vipEnabled: boolean;
        for (let storeIdThingIdKey in this.m_sellItemLimitTable) {
            let sellLimitData = this.m_sellItemLimitTable[storeIdThingIdKey];
            if (null == sellLimitData.sellLimitConfig) {
                continue;
            }

            vipLimit = sellLimitData.sellLimitConfig.m_aiNumberPerDayVIP;
            if (null == vipLimit) {
                continue;
            }
            vipLimitLen = vipLimit.length;
            if (vipLevel >= vipLimitLen) {
                limitCount = vipLimit[vipLimitLen - 1];
            }
            else {
                if (vipLevel == 0) {
                    limitCount = 0; // 通过GM可以把vip降下来，这时候要置为0
                }
                else {
                    limitCount = vipLimit[vipLevel - 1];
                }
            }
            if (sellLimitData.vipLimit != limitCount) {
                sellLimitData.vipLimit = limitCount;
                hasChange = true;
            }
        }

        G.ModuleMgr.businessModule.onSellLimitChange();
    }

    /**
     * 更新普通商品和潜修已购买次数。
     * @param specialItemInfoList
     *
     */
    updateBoughtCount(infoList: Protocol.SpecialItemList): void {
        let hasChange: boolean;
        let itemInfo: Protocol.SpecialItemInfo;
        let sellLimitData: SellLimitData;
        let boughtMap: { [thingId: number]: true } = {};

        // 先更新普通购买数
        let specialItemInfoList: Protocol.SpecialItemInfo[] = infoList.m_astSpecialItemInfo;
        if (null != specialItemInfoList) {
            for (itemInfo of specialItemInfoList) {
                sellLimitData = this.getNPCSellLimitDataById(itemInfo.m_iStoreID, itemInfo.m_iThingID);
                if (defines.has('_DEBUG')) {
                    uts.assert(null != sellLimitData, '商店' + itemInfo.m_iStoreID + '中的物品' + itemInfo.m_iThingID + '不是限购商品！');
                }
                // 限购物品后台入库，所以表格改了后，不存在物品就跳过。
                if (null == sellLimitData) {
                    continue;
                }
                boughtMap[itemInfo.m_iThingID] = true;
                if (sellLimitData.boughtCount != itemInfo.m_usBought) {
                    sellLimitData.boughtCount = itemInfo.m_usBought;
                    hasChange = true;
                }
            }
        }
        // 再更新终身限购信息
        let lifeList: Protocol.SpecialItemInfo[] = infoList.m_astLifeSpecialItemInfo;
        for (itemInfo of lifeList) {
            sellLimitData = this.getNPCSellLimitDataById(itemInfo.m_iStoreID, itemInfo.m_iThingID);
            // 限购物品后台入库，所以表格改了后，不存在物品就跳过。
            if (null == sellLimitData) {
                continue;
            }
            boughtMap[itemInfo.m_iThingID] = true;
            if (sellLimitData.lifeBoughtCount != itemInfo.m_usBought) {
                sellLimitData.lifeBoughtCount = itemInfo.m_usBought;
                hasChange = true;
            }
        }
        // 清空限购数
        for (let storeIdThingIdKey in this.m_sellItemLimitTable) {
            let sellLimitData = this.m_sellItemLimitTable[storeIdThingIdKey];
            if (!boughtMap[sellLimitData.id] && 0 != sellLimitData.boughtCount) {
                sellLimitData.boughtCount = 0;
                hasChange = true;
            }
        }
        G.ModuleMgr.businessModule.onSellLimitChange();
    }

    /**
     * 更新开服特卖限量数据，包括库存信息和已购买数量。
     * @param limitInfo 开服特卖限量数据。
     *
     */
    updateGlobalLimit(response: Protocol.NPCStoreLimitList_Response): void {
        // 库存信息，表示卖什么东西，限多少个
        let inventoryData: Protocol.SpecialItemInfo[] = response.m_stThingList.m_astSpecialItemInfo;
        // 已购买数量，表示全服已售多少个（没有全服限购的话就没有数据）
        let boughtData: Protocol.SpecialItemInfo[] = response.m_stSpecDiscountItemList.m_astSpecialItemInfo;

        let startedMap: { [thingId: number]: true } = {}; // 用于记录哪些商品已经开卖
        let sellLimitData: SellLimitData;
        let thing: Protocol.SpecialItemInfo;
        if (null != inventoryData) {
            for (thing of inventoryData) {
                sellLimitData = this.getNPCSellLimitDataById(response.m_iStoreID, thing.m_iThingID);
                // 校验数据是否合理
                if (defines.has('_DEBUG')) {
                    uts.assert(null != sellLimitData, '商店' + thing.m_iStoreID + '中的物品' + thing.m_iThingID + '不是限购商品！');
                }
                // 写入全服限量
                sellLimitData.hasStarted = true;
                startedMap[thing.m_iThingID] = true;
            }
        }

        // 只有这个商店的物品具有全服限购时，才会走下面的循环
        if (null != boughtData) {
            for (thing of boughtData) {
                sellLimitData = this.getNPCSellLimitDataById(response.m_iStoreID, thing.m_iThingID);
                // 写入全服已购买量
                if (null == sellLimitData) {
                    continue;
                }
                sellLimitData.globalBought = thing.m_usBought;
            }
        }


        // 清除本商店的旧数据
        for (let storeIdThingIdKey in this.m_sellItemLimitTable) {
            let sellLimitData = this.m_sellItemLimitTable[storeIdThingIdKey];
            if (response.m_iStoreID != sellLimitData.sellLimitConfig.m_iStoreID) {
                continue;
            }

            if (!startedMap[sellLimitData.id]) {
                sellLimitData.hasStarted = false;
                sellLimitData.globalBought = 0;
            }
        }

        G.ModuleMgr.businessModule.onSellLimitChange();
    }

    /**
     * 查询指定ID的商品的价格。若查询自动购买价格，请使用getAutoBuyPrice接口。
     * @param id 商品ID。
     * @param day 购买时长。对允许选择时长的商品有效，有效值为3（天）、7（天）和30（天）。
     * @param storeID 商店ID，默认为0，表示从所有商店中搜索，并使用搜到的第一个配置。
     * @param excID 支付货币。默认为0，使用搜到的第一个货币。若使用的是钻石/铜钱，则先严格按照指定的绑定货币进行
     * 搜索，搜不到则按照不区分绑定与否的方式进行二次搜索。
     * @param num 购买数量，单位为份。
     * @param isYuanjia 是否查询原价。
     * @param bindInsensitive 是否绑定与否不敏感，默认为敏感。
     * @return 商品的价格。
     *
     */
    getPriceByID(id: number, day: number = 0, storeID: number = 0, excID: number = 0, num: number = 1, isYuanjia: boolean = false, bindInsensitive: boolean = false, isVipCardDiscount: boolean = false): number {
        //let cardItemId: number = (Math.floor(id / 10)) * 10 + 1;
        //let cardCfg: GameConfig.MonthCardBaseM = G.DataMgr.vipData.getmonthCardBaseItemIdCfg(cardItemId);
        //let hasVipDisDiscount: boolean;
        //if (cardCfg && (storeID == EnumStoreID.MALL_YUANBAO || storeID == EnumStoreID.MALL_YUANBAOBIND)) {
        //    let vipCardOneInfo: Protocol.NewMonthCardInfo = G.DataMgr.vipData.getVipCardOneInfo(cardCfg.m_iID);
        //    if (vipCardOneInfo) {
        //        let current: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        //        let leftTime: number = vipCardOneInfo.m_uiTimeOut - current;
        //        if (leftTime > 0) {
        //            cardDiscountCfg = G.DataMgr.vipData.getCardDiscountCfgByLevelType(vipCardOneInfo.m_usLevel, cardCfg.m_iID);
        //        }
        //    }
        //}
        let sellConfig: GameConfig.NPCSellConfigM = this.getNPCSellDataByItemId(id, storeID, excID);
        if (null == sellConfig && bindInsensitive) {
            // 指定的id找不到，再看是否绑定与否不敏感
            sellConfig = this.getNPCSellDataByItemId(Math.floor(id / 10) * 10 + 1 - (id % 10), storeID, excID);
        }

        if (null == sellConfig) {
            return -1;
        }

        let usedExc: GameConfig.Exchange;
        if (0 == excID) {
            // 没有指定货币的话默认使用第一个货币
            usedExc = sellConfig.m_astExchange[0];
        }
        else {
            // 先使用严格搜索
            let exc: GameConfig.Exchange;
            for (exc of sellConfig.m_astExchange) {
                if (excID == exc.m_iExchangeID) {
                    usedExc = exc;
                    break;
                }
            }

            // 严格搜索找不到的话，钻石和铜钱不区分绑定与否
            if (null == usedExc) {
                if (GameIDUtil.isYuanbaoID(excID)) {
                    for (exc of sellConfig.m_astExchange) {
                        if (GameIDUtil.isYuanbaoID(exc.m_iExchangeID)) {
                            usedExc = exc;
                            break;
                        }
                    }
                }
            }
        }

        if (defines.has('_DEBUG')) {
            uts.assert(null != usedExc, '艹，经过这么复杂的搜索之后还是死活找不到！');
        }

        let priceRate: number = 1;
        if (0 != sellConfig.m_iThreeDaysRate || 0 != sellConfig.m_iSevenDaysRate || 0 != sellConfig.m_iThirtyDaysRate) {
            // 需要选择购买时长的物品
            switch (day) {
                case 3:
                    priceRate *= (sellConfig.m_iThreeDaysRate / 10000);
                    break;
                case 7:
                    priceRate *= (sellConfig.m_iSevenDaysRate / 10000);
                    break;
                case 30:
                default:
                    priceRate *= (sellConfig.m_iThirtyDaysRate / 10000);
                    break;
            }
        }

        // 检查折扣
        if (!isYuanjia) {

            // 钻石商品平台折扣
            // 折扣规则说明：http://tapd.oa.com/v3/FyGame_Develop/prong/stories/view/1010036351005372562
            // 1. 新增VIP2级享受商城购买部分物品8折的特权，与平台折扣适用范围相同
            // VIP2折扣价格需要像平台价格一样，做专属标记（VIP图标）
            // 2. 所有的历练商品不参与折扣
            // 3. 商城折扣不累加，不存在折上折，
            // 	一旦商城表里面配了折扣率，则不享受VIP及平台折扣
            // 4. 商城VIP专区和限时特价专区不享受VIP及平台折扣
            // 这里用表格折扣率来控制，以上专区统一配上折扣率，则不需要特殊处理
            //				let isGoldExc: boolean = GameIDUtil.isYuanbaoID(usedExc.m_iExchangeID);
            //				if(isGoldExc)
            //				{
            //					if(0 == sellConfig.m_ucDiscountRate)
            //					{
            //						// 开服特卖和VIP商品不参与平台或VIP打折
            //						let heroData: HeroData = G.DataMgr.heroData;
            //						if(heroData.isPlatformVip() || heroData.curVipLevel >= Macros.VIP_DISCOUNT_LEVEL)
            //						{
            //							priceRate *= Macros.VIP_DISCOUNT_RATE / 100;
            //						}
            //					}
            //				}
        }
        else {
            priceRate = priceRate * sellConfig.m_ucDiscountRate / 100;
        }

        if (sellConfig.m_ucAmount > 1) {
            num *= sellConfig.m_ucAmount;
        }
        let price: number = usedExc.m_iExchangeValue * priceRate;
        //if (cardDiscountCfg && isVipCardDiscount) {
        //    price = Math.floor(price * cardDiscountCfg.m_ucDiscount / 100) * num;
        //}
        //else {
        //    price = Math.floor(price * num);
        //}
        price = Math.floor(price * num);
        return price;
    }

    /**
     * 检查指定的商品购买条件是否符合。
     * @param sellConf 商品的购买配置。
     * @return
     *
     */
    isBuyConditionMeet(sellConf: GameConfig.NPCSellConfigM, needPromp: boolean = true): boolean {
        if (0 != sellConf.m_iSaleCond) {
            if (KeyWord.SELL_LIMIT_PIN_ID == sellConf.m_iSaleCond) {
                if (sellConf.m_iSaleCondVal != G.DataMgr.sceneData.curPinstanceID) {
                    return false;
                }
            }
            else if (KeyWord.SELL_LIMIT_GUILD == sellConf.m_iSaleCond) {
                // 帮派等级
                if (G.DataMgr.guildData.guildAbstract.m_ucGuildLevel < sellConf.m_iSaleCondVal) {
                    if (needPromp) {
                        G.TipMgr.addMainFloatTip('宗门等级达到' + sellConf.m_iSaleCondVal + '级才能购买本物品。');
                    }
                    return false;
                }
            }
            else if (KeyWord.SELL_LIMIT_BY_ITEM == sellConf.m_iSaleCond) {
                // 背包里要有道具
                if (G.DataMgr.thingData.getThingNum(sellConf.m_iSaleCondVal, Macros.CONTAINER_TYPE_ROLE_BAG, false) <= 0) {
                    if (needPromp) {
                        G.TipMgr.addMainFloatTip(uts.format('您没有{0}，无法购买本物品。', ThingData.getThingConfig(sellConf.m_iItemID).m_szName));
                    }
                    return false;
                }
            }
            else if (KeyWord.SELL_LIMIT_VIPLEVEL == sellConf.m_iSaleCond) {
                if (G.DataMgr.heroData.curVipLevel < sellConf.m_iSaleCondVal) {
                    if (needPromp) {
                        G.TipMgr.addMainFloatTip('您不是VIP，无法购买本物品。');
                    }
                    return false;
                }
            }
            //else if (KeyWord.SELL_LIMIT_JJR == sellConf.m_iSaleCond) {
            //    let kfhdData: KfhdData = G.DataMgr.kfhd;
            //    let npcSellData: NPCSellData = G.DataMgr.npcSellData;
            //    if (sellConf.m_iSaleCondVal != kfhdData.JJRPanelInfo.m_ucType) {
            //        if (needPromp) {
            //            G.TipMgr.addMainFloatTip('进阶日不匹配，无法购买本物品。');
            //        }
            //        return false;
            //    }
            //}
            else if (sellConf.m_iSaleCond == KeyWord.SELL_LIMIT_PET_ACT) {
                // 需激活伙伴
                if (!G.DataMgr.petData.isPetActive(sellConf.m_iSaleCondVal)) {
                    if (needPromp) {
                        let cfg = PetData.getPetConfigByPetID(sellConf.m_iSaleCondVal);
                        G.TipMgr.addMainFloatTip('请先激活伙伴：' + cfg.m_szBeautyName);
                    }
                    return false;
                }
            }
            else {
                if (defines.has('_DEBUG')) {
                    uts.assert(false, '不受支持的购买条件：' + sellConf.m_iSaleCond);
                }
            }
        }

        return true;
    }

    /**
     * 构造指定商品的购买条件描述文字。
     * @param sellConf 商品的购买配置。
     * @return
     *
     */
    getBuyCondDesc(sellConf: GameConfig.NPCSellConfigM): string {
        let desc: string;
        if (0 != sellConf.m_iSaleCond) {
            if (KeyWord.SELL_LIMIT_GUILD == sellConf.m_iSaleCond) {
                desc = SpecialCharUtil.getHanNum(sellConf.m_iSaleCondVal) + '级宗门可购买';
            }
            else if (KeyWord.SELL_LIMIT_BY_ITEM == sellConf.m_iSaleCond) {
                desc = uts.format('双击{0}可购买', ThingData.getThingConfig(sellConf.m_iSaleCondVal).m_szName);
            }
            else if (KeyWord.SELL_LIMIT_VIPLEVEL == sellConf.m_iSaleCond) {
                desc = uts.format('VIP{0}可购买', sellConf.m_iSaleCondVal);
            }
            else {
                if (defines.has('_DEBUG')) {
                    uts.assert(false, '不受支持的购买条件：' + sellConf.m_iSaleCond);
                }
            }
        }

        return desc;
    }

    /**
     * 查找指定物品在指定商店中的页签。
     * @param id
     * @param storeId
     * @param isSub
     * @return
     *
     */
    getTabByID(id: number, storeId: number, isSub: boolean): number {
        let sellConfig: GameConfig.NPCSellConfigM = this.getNPCSellDataByItemId(id, storeId);
        if (null == sellConfig) {
            return 0;
        }
        if (isSub) {
            return sellConfig.m_iItemSubTab;
        }
        else {
            return sellConfig.m_iItemTab;
        }
    }

    /**
     * 查询售卖指定商品的商店列表。
     * @param id
     * @return
     *
     */
    getStoreListByItemID(id: number): number[] {
        return this.m_itemId2storeId[Math.floor(id / 10)];
    }

    /**
     * 检查指定ID的物品是否可以买，比如在兑换商城中已经有了的装备就不能再买。
     * @param id 物品的ID。
     * @return
     *
     */
    canBuy(id: number): boolean {
        let canBuy: boolean = null != this.getNPCSellDataByItemId(id);
        if (canBuy) {
            if (GameIDUtil.isEquipmentID(id)) {
                if (G.DataMgr.thingData.getThingNum(id) > 0) {
                    // 背包里已有的装备不让买
                    canBuy = false;
                }
                else if (G.DataMgr.thingData.getThingNum(id, Macros.CONTAINER_TYPE_ROLE_EQUIP) > 0) {
                    // 身上已有的装备也不让买
                    canBuy = false;
                }
                else if (G.DataMgr.thingData.getThingNum(id, Macros.CONTAINER_TYPE_ROLE_STORE) > 0) {
                    // 仓库里有也不让买
                    canBuy = false;
                }
            }
        }

        return canBuy;
    }

    private setNpcRandomStoreCfg(): void {
        let dataList: GameConfig.NPCRandomStoreCfgM[] = G.Cfgmgr.getCfg('data/NPCRandomStoreCfgM.json') as GameConfig.NPCRandomStoreCfgM[];
        for (let config of dataList) {
            this.m_npcRandomStoreCfg[config.m_iStoreId] = config;
        }
    }

    /**
     *根据商店ID获取刷新时间
     * @return
     *
     */
    getNpcRandomStoreCfg(storeID: number): GameConfig.NPCRandomStoreCfgM {
        let config: GameConfig.NPCRandomStoreCfgM;
        for (let storeIdKey in this.m_npcRandomStoreCfg) {
            let cfg = this.m_npcRandomStoreCfg[storeIdKey];
            if (cfg.m_iStoreId == storeID) {
                config = cfg;
                break;
            }
        }
        return config;
    }

    getActivityIdByStoreId(storeId: number): number {
        return this.storeId2activityId[storeId];
    }

    /**
     * 获取活动商城配置表
     * @param	activityID
     * @return
     */
    getNpcActivityStoreCfgArr(activityID: number): GameConfig.NPCSellConfigM[] {
        return this.m_npcActivityStoreMap[activityID];
    }

    /**
     * 获取商城限购道具配置信息
     * @param	day
     * @return
     */
    getMallLimitList(day: number = -1): MarketItemData[] {
        let mallId: number = 0;
        let limit: number = ShopRule.MAX_ITEM_LIMIT;
        if (day == -1) {
            day = G.SyncTime.getDateAfterStartServer();
        }
        if (day >= limit) {
            let kfhdData = G.DataMgr.kfhdData;
            let npcSellData: NPCSellData = G.DataMgr.npcSellData;
            mallId = npcSellData.getConditionsLimit(KeyWord.SELL_LIMIT_JJR, kfhdData.JJRPanelInfo.m_ucType);
        }
        else {
            mallId = day - 1 + ShopRule.LIMIT_BUY_START_ID;
        }

        return this.getMallListByType(mallId);
    }

    /**
     * 获取商城限购道具配置信息
     * @param	day
     * @return
     */
    getMallLimitMallId(day: number = -1): number {
        let mallId: number = 0;
        let limit: number = ShopRule.MAX_ITEM_LIMIT;
        if (day == -1) {
            day = G.SyncTime.getDateAfterStartServer();
        }
        if (day >= limit) {
            let kfhdData = G.DataMgr.kfhdData;
            let npcSellData: NPCSellData = G.DataMgr.npcSellData;
            mallId = npcSellData.getConditionsLimit(KeyWord.SELL_LIMIT_JJR, kfhdData.JJRPanelInfo.m_ucType);
        }
        else {
            mallId = day - 1 + ShopRule.LIMIT_BUY_START_ID;
        }

        return mallId;
    }

    getConditionsLimit(type: number, val: number): number {
        if (this.m_conditionsLimit[type] == null)
            return -1;
        return this.m_conditionsLimit[type][val];
    }
}
