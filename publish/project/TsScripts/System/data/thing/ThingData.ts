import { BagView } from "System/bag/view/BagView";
import { GameIDType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { EquipStrengthenData } from "System/data/EquipStrengthenData";
import { PetData } from "System/data/pet/PetData";
import { HeroData } from "System/data/RoleData";
import { EnumContainerChangeReason } from "System/data/thing/EnumContainerChangeReason";
import { EnumEquipRule } from "System/data/thing/EnumEquipRule";
import { EquipsCache } from "System/data/thing/EquipsCache";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { EquipFinalUpPanel } from "System/equip/EquipFinalUpPanel";
import { EventDispatcher } from "System/EventDispatcher";
import { Events } from "System/Events";
import { FloatShowType } from "System/floatTip/FloatTip";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { Color } from "System/utils/ColorUtil";
import { EquipUtils } from "System/utils/EquipUtils";
import { FightingStrengthUtil } from "System/utils/FightingStrengthUtil";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { GuidUtil } from "System/utils/GuidUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { ThingIDUtil } from "System/utils/ThingIDUtil";
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { LingBaoAlertView } from "../../lingbaoalert/LingBaoAlertView";


export class ThingData {

    /**装备容器和祝福系统容器*/
    static readonly ALL_CONTAINER_TYPE: number[] = [Macros.CONTAINER_TYPE_ROLE_EQUIP, Macros.CONTAINER_TYPE_BEAUTY_EQUIP, Macros.CONTAINER_TYPE_HEROSUB_FAZHEN, Macros.CONTAINER_TYPE_HEROSUB_JINGLING,
    Macros.CONTAINER_TYPE_HEROSUB_LINGSHOU, Macros.CONTAINER_TYPE_HEROSUB_WUHUN, Macros.CONTAINER_TYPE_HEROSUB_YUYI, Macros.CONTAINER_TYPE_HEROSUB_ZUOQI, Macros.CONTAINER_TYPE_HEROSUB_LEILING];

    /**任务属性面板上显示的装备个数*/
    static readonly All_EQUIP_NUM = 10;
    /**人物属性面板显示的魂骨个数*/
    static readonly All_HuGu_NUM = 9;
    /**人物装备阶级 12*/
    static readonly maxEquipStage = 12;
    /**伙伴星级20*/
    static readonly maxPetEquipStage = 20;
    /***各个强化弹购买的最小阶级3*/
    static readonly minLvOpenBatBuyViwe = 3;


    /**部分物品获得途径引导*/
    private static m_itemGetMethod: { [id: number]: GameConfig.ItemBuyGuildM } = {};
    /**容器表*/
    private m_allContainer: { [containerID: number]: { [position: number]: ThingItemData } } = {};
    /**物品数量表*/
    private m_itemNumMap: { [containerID: number]: { [id: number]: number } } = {};
    /**背包物品的有效数量表*/
    private m_bagItemValidNumMap: { [id: number]: number };
    private m_isBagItemValidNumDirty = true;
    private m_nextOutOfDateTime = 0;
    /**用于检查物品是否已经到期的定时器*/
    private outOfDateTimer: Game.Timer;

    /**背包当前的有效容量，不包含被锁定的部分。*/
    bagCapacity: number = 0;
    /**仓库当前的有效容量，不包含被锁定的部分。*/
    storeCapacity: number = 0;
    /**在线开背包格子的数量。*/
    onlineOpenBagCount: number = 0;
    /**表格道具数据*/
    static m_itemMap: { [id: number]: GameConfig.ThingConfigM } = {};
    /**时装表格数据*/
    private static m_dressImageConfigs: { [id: number]: GameConfig.DressImageConfigM } = {};
    private static m_dressImageJobConfigs: { [id: number]: { [id: number]: { [id: number]: GameConfig.DressImageConfigM } } } = {};
    private static _godEquipCfgs: { [color: number]: GameConfig.GetEquipCfgM[] } = {};
    /**背包数据是否已经初始化。*/
    private m_isBagDataInit: boolean = false;
    /**装备数据是否已经初始化。*/
    private m_isRoleEquipDataInit: boolean = false;
    /**仓库数据是否已经初始化。*/
    private m_isStoreDataInit: boolean = false;
    /**最近一次收到容器变更协议的原因。*/
    private m_changeReason: ContainerChangeReason = new ContainerChangeReason();
    private m_auctionClass: { [id: number]: number[] } = {};
    private m_auctionClassDataMap: { [class1: number]: { [class2: number]: GameConfig.ThingConfigM[] } } = {};
    //private _cla1: number[] = [];
    //private _cls: { [auctionClass: number]: number[] } = {};
    //private _funCount: number = 0;
    private m_equipsCache = new EquipsCache();

    shenQiJiHuoKas: { [id: number]: number } = {};
    titleId2Cfg: { [chengHaoId: number]: GameConfig.ThingConfigM } = {};

    /**
    * 设置物品信息
    * [场景ID， SceneInfo]对,表格里面读出来的
    * @param data
    *
    */
    onCfgReady(): void {
        this.setItemData();
        this.setEquipData();
        this.setDressImageData();
        this.setGodEquipCfgs();
        this.setDressImageQHCfgs();
    }

    ///////////////////////////////////////////////// 配置处理 /////////////////////////////////////////////////

    /**
     * 设置物品的缓存数据
     * @param data
     *
     */
    private setItemData(): void {
        // --------------------- by fygame 2010.12.07 ------------------------------- //
        let data: GameConfig.ThingConfigM[] = G.Cfgmgr.getCfg('data/ThingConfigM.json') as GameConfig.ThingConfigM[];
        let value = 0;
        this.m_auctionClassDataMap = {};
        let funcList: GameConfig.ThingConfigM[];
        for (let itemData of data) {
            if (itemData.m_iID == 0) {
                // 过滤掉无用数据
                continue;
            }
            if (itemData.m_ucAuctionClass1 != 0 && itemData.m_ucAuctionClass2 != 0) {

                if (value != itemData.m_ucAuctionClass2) {
                    value = itemData.m_ucAuctionClass2;

                }

                if (!this.m_auctionClass[itemData.m_ucAuctionClass1]) {
                    this.m_auctionClass[itemData.m_ucAuctionClass1] = [];
                }

                if (this.m_auctionClass[itemData.m_ucAuctionClass1].indexOf(itemData.m_ucAuctionClass2) == -1) {
                    this.m_auctionClass[itemData.m_ucAuctionClass1].push(itemData.m_ucAuctionClass2);
                }

                //if (this._cla1.indexOf(itemData.m_ucAuctionClass1) == -1)
                //    this._cla1.push(itemData.m_ucAuctionClass1);
                //if (!this._cls[itemData.m_ucAuctionClass1])
                //    this._cls[itemData.m_ucAuctionClass1] = [itemData.m_ucAuctionClass2];
                //else if (this._cls[itemData.m_ucAuctionClass1].indexOf(itemData.m_ucAuctionClass2) == -1)
                //    this._cls[itemData.m_ucAuctionClass1].push(itemData.m_ucAuctionClass2);

                let ClassMap: { [id: number]: GameConfig.ThingConfigM[] };
                ClassMap = this.m_auctionClassDataMap[itemData.m_ucAuctionClass1];
                if (null == ClassMap) {
                    this.m_auctionClassDataMap[itemData.m_ucAuctionClass1] = ClassMap = {};
                }

                let data: GameConfig.ThingConfigM[] = ClassMap[itemData.m_ucAuctionClass2];
                if (null == data) {
                    ClassMap[itemData.m_ucAuctionClass2] = data = new Array<GameConfig.ThingConfigM>();
                }
                ClassMap[itemData.m_ucAuctionClass2].push(itemData);
            }
            ThingData.m_itemMap[itemData.m_iID] = itemData;

            //筛选出特定的常用ID
            if (KeyWord.ITEM_FUNCTION_FLIGHTOPERATOR == itemData.m_ucFunctionType) {
                // 筋斗云
                ThingIDUtil.JDY = itemData.m_iID;
            }
            else if (KeyWord.ITEM_FUNCTION_ITEM_SKY_LOTTERY == itemData.m_ucFunctionType) {
                // 天宫宝镜鉴宝符ID
                ThingIDUtil.TGBJ_JBF = itemData.m_iID;
            }
            else if (KeyWord.ITEM_FUNCTION_MJ_LOTTERY == itemData.m_ucFunctionType) {
                // 天宫宝镜鉴宝符ID
                ThingIDUtil.TGMJ_JBF = itemData.m_iID;
            }
            else if (KeyWord.ITEM_FUNCTION_SUPPER_EXP == itemData.m_ucFunctionType) {
                // 超级经验丹
                ThingIDUtil.setZhiShengDanId(itemData.m_iID, itemData.m_iFunctionValue);
            } else if (KeyWord.ITEM_FUNCTION_FAQI_ACTIVE == itemData.m_ucFunctionType) {
                //因为激活卡有绑定和非绑定之分，所以技能id可能会重复，过滤重复技能id
                if (this.shenQiJiHuoKas[itemData.m_iFunctionID] == null) {
                    this.shenQiJiHuoKas[itemData.m_iFunctionID] = itemData.m_iID;
                }
            }
            else if (itemData.m_ucFunctionType == KeyWord.ITEM_FUNCTION_HUNGU_SKILL) {
                //魂骨技能材料
                G.DataMgr.hunliData.hunguSkillData.addMaterialId(itemData);
            }
            else if (itemData.m_ucFunctionType == KeyWord.ITEM_FUNCTION_TITLECARD) {
                this.titleId2Cfg[itemData.m_iFunctionID] = itemData;
            }
        }


        //this._funCount++;
        //if (this._funCount >= 2) {
        //    //this._cla1.sort(this.sortNumber);
        //    //for (let i: number = 0; i < this._cla1.length; i++) {
        //    //    this.m_auctionClass[i] = this._cls[this._cla1[i]];
        //    //    this.m_auctionClass[i].sort(this.sortNumber);
        //    //}
        //}
    }

    private sortNumber(a: number, b: number): number {
        return a - b;
    }
    /**根据神器id获得激活卡id*/
    getCardIdByShenQiId(Id: number): number {
        return this.shenQiJiHuoKas[Id];
    }

    getThingCfgByTitleId(titleId: number) {
        return this.titleId2Cfg[titleId];
    }

    /**
     * 设置装备的缓存数据
     * @param data
     *
     */
    private setEquipData(): void {
        let data: GameConfig.EquipConfigM[] = G.Cfgmgr.getCfg('data/EquipConfigM.json') as GameConfig.EquipConfigM[];

        for (let equipData of data) {
            if (equipData.m_iID == 0) {
                // 过滤掉无用数据
                continue;
            }
            if (equipData.m_ucAuctionClass1 != 0 && equipData.m_ucAuctionClass2 != 0) {

                //  let firstClass = this.m_auctionClass[itemData.m_ucAuctionClass1];
                if (!this.m_auctionClass[equipData.m_ucAuctionClass1]) {
                    this.m_auctionClass[equipData.m_ucAuctionClass1] = [];
                }

                if (this.m_auctionClass[equipData.m_ucAuctionClass1].indexOf(equipData.m_ucAuctionClass2) == -1) {
                    this.m_auctionClass[equipData.m_ucAuctionClass1].push(equipData.m_ucAuctionClass2);
                }

                //if (this._cla1.indexOf(equipData.m_ucAuctionClass1) == -1)
                //    this._cla1.push(equipData.m_ucAuctionClass1);
                //if (!this._cls[equipData.m_ucAuctionClass1])
                //    this._cls[equipData.m_ucAuctionClass1] = [equipData.m_ucAuctionClass2];
                //else if (this._cls[equipData.m_ucAuctionClass1].indexOf(equipData.m_ucAuctionClass2) == -1)
                //    this._cls[equipData.m_ucAuctionClass1].push(equipData.m_ucAuctionClass2);

                let ClassMap = this.m_auctionClassDataMap[equipData.m_ucAuctionClass1];
                if (null == ClassMap) {
                    this.m_auctionClassDataMap[equipData.m_ucAuctionClass1] = ClassMap = {};
                }

                let data: GameConfig.ThingConfigM[] = ClassMap[equipData.m_ucAuctionClass2];
                if (null == data) {
                    ClassMap[equipData.m_ucAuctionClass2] = data = new Array<GameConfig.ThingConfigM>();
                }
                ClassMap[equipData.m_ucAuctionClass2].push(equipData);
            }

            ThingData.m_itemMap[equipData.m_iID] = equipData;

            //魂骨装备数据需要进一步的保存，处理魂骨升华的检索
            if (GameIDUtil.isHunguEquipID(equipData.m_iID)) {
                //具体整理在升华数据里边处理了
                G.DataMgr.hunliData.hunguMergeData.addHunguEquipToMap(equipData);
            }

        }

        //this._funCount++;
        //if (this._funCount >= 2) {
        //    //this._cla1.sort(this.sortNumber);
        //    //for (let i: number = 0; i < this._cla1.length; i++) {
        //    //    this.m_auctionClass[i] = this._cls[this._cla1[i]];
        //    //    this.m_auctionClass[i].sort(this.sortNumber);
        //    //}
        //}
    }

    /**
     * 设置时装形象数据
     * @param data
     *
     */
    private setDressImageData(): void {
        let data: GameConfig.DressImageConfigM[] = G.Cfgmgr.getCfg('data/DressImageConfigM.json') as GameConfig.DressImageConfigM[];
        if (data == null) {
            return;
        }
        for (let config of data) {
            ThingData.m_dressImageConfigs[config.m_uiImageId] = config;
            //if (config.m_ucShowType == 1) {
            if (ThingData.m_dressImageJobConfigs[config.m_ucProf] == null) {
                ThingData.m_dressImageJobConfigs[config.m_ucProf] = {};
            }
            if (ThingData.m_dressImageJobConfigs[config.m_ucProf][config.m_ucGender] == null) {
                ThingData.m_dressImageJobConfigs[config.m_ucProf][config.m_ucGender] = {};
            }
            ThingData.m_dressImageJobConfigs[config.m_ucProf][config.m_ucGender][config.m_uiImageId] = config
            //}
        }
    }

    static getDressImageData(prof: number, gender: number, id: number): GameConfig.DressImageConfigM {
        return ThingData.m_dressImageJobConfigs[prof][gender][id];
    }

    static getDressImageDataGroup(prof: number, gender: number): GameConfig.DressImageConfigM[] {
        let group: GameConfig.DressImageConfigM[] = [];
        let map = ThingData.m_dressImageJobConfigs[prof][gender];
        for (let key in map) {
            group.push(map[key]);
        }
        return group;
    }

    /**
     * 写死禁用，时装不要神力
     * @param prof
     * @param gender
     */
    static getDressImageDataGroupNew(prof: number, gender: number): GameConfig.DressImageConfigM[] {
        let group: GameConfig.DressImageConfigM[] = [];
        let map = ThingData.m_dressImageJobConfigs[prof][gender];
        for (let key in map) {
            let value = Math.floor(parseInt(key) / 100);
            if (value == 901 || value == 902 || value == 903 || value == 904) {
                continue;
            }
            group.push(map[key]);
        }
        return group;
    }
    /**
     * 获取指定类型的时装
     * @param prof
     * @param gender
     * @param type
     */
    static getDressImageDataGroupWithType(prof: number, gender: number, showtype: number): GameConfig.DressImageConfigM[] {
        let group: GameConfig.DressImageConfigM[] = [];
        let map = ThingData.m_dressImageJobConfigs[prof][gender];
        for (let key in map) {
            if (map[key].m_ucShowType == showtype) {
                let value = Math.floor(parseInt(key) / 100);
                if (value == 901 || value == 902 || value == 903 || value == 904) {
                    continue;
                }
                if (value == 120 || value == 121 || value == 122 || value == 123) {
                    continue;
                }
                group.push(map[key]);
            }
            if (showtype == 3) {
                let maxSaiji = G.DataMgr.zhufuData.getSaiJiMax();
                maxSaiji = Math.min(maxSaiji, 4);
                for (let i = 0; i < maxSaiji; i++) {
                    let id = G.DataMgr.zhufuData.getSaiJiCfg(i + 1, KeyWord.HERO_TYPE_SAIJISZ).m_iImageID;
                    let value = Math.floor(parseInt(key) / 100);
                    if (value == id) {
                        group.push(map[key]);
                    }
                }
            }
        }
        return group;
    }


    /////////////////设置时装强化////////////////DressQH
    private dressImageMap: { [dressID: number]: { [lv: number]: GameConfig.DressQHM } } = {};
    /**取1级时装的形象id*/
    private dressIdArraw: number[] = [];
    private setDressImageQHCfgs(): void {
        let cfgs: GameConfig.DressQHM[] = G.Cfgmgr.getCfg('data/DressQHM.json') as GameConfig.DressQHM[];
        for (let config of cfgs) {
            if (this.dressImageMap[config.m_iID] == null) {
                this.dressImageMap[config.m_iID] = {};
            }
            this.dressImageMap[config.m_iID][config.m_iLevel] = config;
            if (config.m_iLevel == 1) {
                this.dressIdArraw.push(config.m_iID);
            }
        }
    }

    getDressImageQHCfgs(dressId: number, lv: number): GameConfig.DressQHM {
        let data = this.dressImageMap[dressId];
        if (data == null) return null;
        return this.dressImageMap[dressId][lv];
    }

    /**
     * 获得时装强化里时装全id
     */
    getAllDressImgFullID() {
        let fullDressIds: number[] = [];
        for (let i = 0; i < this.dressIdArraw.length; i++) {
            let id = EquipUtils.subStringEquipCollectDressImgId(this.dressIdArraw[i]);
            fullDressIds.push(id);
        }
        return fullDressIds;
    }


    private setGodEquipCfgs(): void {
        let cfgs: GameConfig.GetEquipCfgM[] = G.Cfgmgr.getCfg('data/GetEquipCfgM.json') as GameConfig.GetEquipCfgM[];
        cfgs.sort(this._onGodEquipSort);
        for (let config of cfgs) {
            if (ThingData._godEquipCfgs[config.m_iGrade] == null) {
                ThingData._godEquipCfgs[config.m_iGrade] = new Array<GameConfig.GetEquipCfgM>();
            }
            (ThingData._godEquipCfgs[config.m_iGrade]).push(config);
        }
    }

    static getGodEquipCfgs(grade: number): GameConfig.GetEquipCfgM[] {
        let result: GameConfig.GetEquipCfgM[] = ThingData._godEquipCfgs[grade];
        if (result == null) return;
        if (result.length > EquipUtils.All_EQUIP_NUM) {
            let prof: number = G.DataMgr.heroData.profession;
            for (let i: number = result.length - 1; i >= 0; i--) {
                if (result[i].m_iProf != 0 && result[i].m_iProf != prof) {
                    result.splice(i, 1);
                }
            }
        }
        return result;
    }


    private _onGodEquipSort(item1: GameConfig.GetEquipCfgM, item2: GameConfig.GetEquipCfgM): number {
        let e1 = ThingData.getThingConfig(item1.m_iEquipId);
        let e2 = ThingData.getThingConfig(item2.m_iEquipId);
        return e1.m_iEquipPart - e2.m_iEquipPart;
    }

    /**
     * 通过物品id取得物品的配置
     * @param thingID
     * @return
     *
     */
    static getThingConfig(thingID: number): GameConfig.ThingConfigM {
        let data = ThingData.m_itemMap[thingID];
        //if (!data) {
        //    uts.logErrorReportWithStack("道具未配置:" + thingID);
        //}
        return data;
    }

    /**
 * 通过物品id取得物品的配置(可能为空)
 * @param thingID
 * @return
 *
 */
    static getThingConfigMayNull(thingID: number): GameConfig.ThingConfigM {
        let data = ThingData.m_itemMap[thingID];
        return data;
    }

    /**
     * 根据形象id取时装形象配置
     * @param imageID
     * @return
     *
     */
    static getDressImageConfig(imageID: number): GameConfig.DressImageConfigM {
        return ThingData.m_dressImageConfigs[imageID];
    }

    ///////////////////////////////////////////////// 数据操作 /////////////////////////////////////////////////

    /**
     * 物品数据添加，删除，更新，仅用于处理物品容器的更新，即用于物品背包、容器等收到Notify时候更新数据并返回<CODE>treu</CODE>。
     * 若是由散仙仓库扩容引起的Notify，则忽略操作并返回<CODE>false</CODE>
     * @param list 改变的列表
     * @param reasonID 改变的原因，Macros有枚举
     * @return 是否成功更新了物品容器。
     *
     */
    updateOnContainerNotify(dispatcher: EventDispatcher, list: Protocol.ContainerChangedList, reasonID: number): boolean {
        let changedList: Protocol.ContainerChanged[] = list.m_astContainerChanged;
        let containerChange: Protocol.ContainerChanged;
        let type: number;
        let isChange: boolean = false;
        let events = {};
        let types = {};
        for (containerChange of changedList) {
            type = containerChange.m_stContainerID.m_ucContainerType;
            if (this.m_allContainer[type] == null) {
                this.m_allContainer[type] = {};
            }
            if (this.m_itemNumMap[type] == null) {
                this.m_itemNumMap[type] = {};
            }
            this.m_equipsCache.clearCache(type);
            switch (type) {
                case Macros.CONTAINER_TYPE_ROLE_BAG: // 玩家背包
                    if (Macros.CONTAINER_OPERATE_LIST == reasonID) {
                        if (containerChange.m_ushEnableSpaceNum < BagView.DEFAULT_CAPACITY) {
                            if (defines.has('_DEBUG')) {
                                uts.assert(false, '背包容量错误！');
                            }
                            break;
                        }
                        else {
                            this.m_isBagDataInit = true;
                        }
                    }
                    if (Macros.CONTAINER_OPERATE_BUYSPACE == reasonID || Macros.CONTAINER_OPERATE_LIST == reasonID) { // 如果是背包扩容或获取数据，需要更新背包有效容量
                        this.bagCapacity = containerChange.m_ushEnableSpaceNum;
                    }

                    if (Macros.CONTAINER_OPERATE_BUYSPACE != reasonID) {

                        if (Macros.CONTAINER_OPERATE_SORT == reasonID || Macros.CONTAINER_OPERATE_LIST == reasonID) // 整理容器
                        {
                            this.deleteContainer(type);
                        }
                        this.updateContainer(type, containerChange, reasonID);
                        if (Macros.CONTAINER_OPERATE_MONSTER_DROP == reasonID) {
                            G.ModuleMgr.deputyModule.checkAutoRongLian(containerChange.m_stAddedThingInfoList.m_astThingInfo);
                        }
                    }
                    this.m_isBagItemValidNumDirty = true;
                    isChange = true;
                    events[Events.roleBagChange] = true;
                    this.itemMergeCacheUpdate(type, containerChange, reasonID);
                    break;

                case Macros.CONTAINER_TYPE_ROLE_STORE:
                    if (Macros.CONTAINER_OPERATE_LIST == reasonID) { // 如果是仓库扩容或获取数据，需要更新仓库有效容量
                        if (containerChange.m_ushEnableSpaceNum < BagView.DEFAULT_CAPACITY_CK) {
                            if (defines.has('_DEBUG')) {
                                uts.assert(false, '仓库容量错误！');
                            }
                            break;
                        }
                        else {
                            this.m_isStoreDataInit = true;
                        }
                    }
                    if (Macros.CONTAINER_OPERATE_BUYSPACE == reasonID || Macros.CONTAINER_OPERATE_LIST == reasonID) { // 如果是仓库扩容或获取数据，需要更新仓库有效容量
                        this.storeCapacity = containerChange.m_ushEnableSpaceNum;
                    }
                    if (Macros.CONTAINER_OPERATE_BUYSPACE != reasonID) {
                        if (Macros.CONTAINER_OPERATE_SORT == reasonID || Macros.CONTAINER_OPERATE_LIST == reasonID) {
                            this.deleteContainer(type);
                        }
                        this.updateContainer(type, containerChange, reasonID);
                    }
                    isChange = true;
                    break;
                case Macros.CONTAINER_TYPE_SKYLOTTERY:
                    // 天宫宝镜仓库
                    if (Macros.CONTAINER_OPERATE_SORT == reasonID || Macros.CONTAINER_OPERATE_LIST == reasonID) {
                        this.deleteContainer(type);
                    }
                    this.updateContainer(type, containerChange, reasonID);
                    isChange = true;

                    break;
                case Macros.CONTAINER_TYPE_STARLOTTERY:
                    // 星斗宝库仓库
                    if (Macros.CONTAINER_OPERATE_SORT == reasonID || Macros.CONTAINER_OPERATE_LIST == reasonID) {
                        this.deleteContainer(type);
                    }
                    this.updateContainer(type, containerChange, reasonID);
                    isChange = true;

                    break;

                default:
                    this.updateContainer(type, containerChange, reasonID);
                    this.updateEquipStageInfo(type);
                    if (!this.isRoleEquipDataInit && Macros.CONTAINER_OPERATE_LIST == reasonID && Macros.CONTAINER_TYPE_ROLE_EQUIP == type) {
                        this.m_isRoleEquipDataInit = true;
                    }
                    isChange = true;
                    break;
            }
            types[type] = true;
        }

        for (let event in events) {
            dispatcher.dispatchEvent(Number(event));
        }

        for (let type in types) {
            G.ModuleMgr.bagModule.onContainerChange(Number(type));
        }

        // 分析变更原因
        this.checkChangeReason(changedList, reasonID);

        // 处理背包变化
        if (null == this.m_changeReason || EnumContainerChangeReason.CHANGE_EQUIP != this.m_changeReason.reason) {
            for (containerChange of changedList) {
                if (Macros.CONTAINER_TYPE_ROLE_BAG == containerChange.m_stContainerID.m_ucContainerType) {
                    if (Macros.CONTAINER_OPERATE_LIST == reasonID || Macros.CONTAINER_OPERATE_SORT == reasonID || Macros.CONTAINER_OPERATE_BUYSPACE == reasonID) {
                        continue;
                    }

                    this.handleBagChange(reasonID, containerChange);
                }
            }
        }

        return isChange;
    }


    private equipCollectList: { [stage: number]: number } = {};
    //当前正在收集的类型
    curEquipCollectStage: number = 0;
    /**除了武器，剩余装备阶级*/
    private equipCollectListExceptWeapon: { [stage: number]: number } = {};
    curEquipStageExceptWeapon: number = 0;

    private armorStage2NumMap: { [stage: number]: number } = {};
    /**防具(头盔、护甲、腿甲、战靴)的总阶级*/
    curArmorStage: number = 0;

    private ornamentsStage2NumMap: { [stage: number]: number } = {};
    /** 饰品(项链、戒指、手镯)的总阶级*/
    curOrnamentsStage: number = 0;


    /**斩魔最大18级*/
    private static readonly ZMMAXLV18: number = 18;
    private equipZMCollectList: { [lv: number]: number } = {};
    /**全身斩魔最小等级*/
    curAllMinZhanMolv: number = 0;

    private updateEquipStageInfo(type: number): void {

        if (type != Macros.CONTAINER_TYPE_ROLE_EQUIP)
            return;
        this.curEquipCollectStage = ThingData.maxEquipStage;
        let dataList = this.getContainer(type);
        let data: ThingItemData;

        for (let i = 0; i < ThingData.maxEquipStage; i++) {
            this.equipCollectList[i + 1] = 0;
            this.equipCollectListExceptWeapon[i + 1] = 0;
            //防具，饰品
            this.armorStage2NumMap[i + 1] = 0;
            this.ornamentsStage2NumMap[i + 1] = 0;
        }

        //炼器战魔
        for (let i = 0; i < ThingData.ZMMAXLV18; i++) {
            this.equipZMCollectList[i] = 0;
        }

        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            data = dataList[i];
            //大于鞋子的部位是，婚戒和精灵
            if (data == null || data.config == null || data.config.m_iEquipPart > KeyWord.EQUIP_PARTCLASS_SHOE)
                continue;

            let equipPart = data.config.m_iEquipPart;
            for (let j = 0; j < data.config.m_ucStage; j++) {
                this.equipCollectList[j + 1] += 1;

                ////排除装备，剩余7件阶级
                //if (equipPart != KeyWord.EQUIP_PARTCLASS_WEAPON) {
                //    this.equipCollectListExceptWeapon[j + 1] += 1;
                //}

                //防具
                if (EquipStrengthenData.isArmorEquip(equipPart)) {
                    this.armorStage2NumMap[j + 1] += 1;
                }

                //饰品
                if (EquipStrengthenData.isOrnamentsEquip(equipPart)) {
                    this.ornamentsStage2NumMap[j + 1] += 1;
                }

            }

            let lqLV = data.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stLQ.m_ucLQLevel;
            //炼器战魔
            for (let j = 0; j < lqLV; j++) {
                this.equipZMCollectList[j] += 1;
            }

        }

        for (let i = 0; i < ThingData.maxEquipStage; i++) {
            if (this.equipCollectList[i + 1] != EnumEquipRule.EQUIP_ENHANCE_COUNT) {
                this.curEquipCollectStage = (i + 1);
                break;
            }
        }

        ////排除装备剩下的阶级
        //for (let i = 0; i < ThingData.maxEquipStage; i++) {
        //    if (this.equipCollectListExceptWeapon[i + 1] != EnumEquipRule.EQUIP_ENHANCE_COUNT - 1) {
        //        this.curEquipStageExceptWeapon = (i + 1);
        //        break;
        //    }
        //}

        //防具的阶级
        for (let i = 0; i < ThingData.maxEquipStage; i++) {
            if (this.armorStage2NumMap[i + 1] != EquipStrengthenData.ArmorEquipNum) {
                this.curArmorStage = (i + 1);
                break;
            }
        }

        //饰品的阶级
        for (let i = 0; i < ThingData.maxEquipStage; i++) {
            if (this.ornamentsStage2NumMap[i + 1] != EquipStrengthenData.OrnamentsEquipNum) {
                this.curOrnamentsStage = (i + 1);
                break;
            }
        }

        //炼器战魔
        for (let i = 0; i < ThingData.ZMMAXLV18; i++) {
            if (this.equipZMCollectList[i] != EnumEquipRule.EQUIP_ENHANCE_COUNT) {
                this.curAllMinZhanMolv = i;
                break;
            }
        }

        G.DataMgr.equipStrengthenData.ItemMergeCache.updateCurEquipStage();
    }

    getEquipSuitsCount(color: number): number {
        return this.equipCollectList[color];
    }



    private handleBagChange(reasonID: number, containerChange: Protocol.ContainerChanged): void {
        // 排除掉开背包格子等操作
        let thingInfo: Protocol.ContainerThingInfo;
        if (Macros.CONTAINER_OPERATE_LIST != reasonID && Macros.CONTAINER_OPERATE_SORT != reasonID
            && Macros.CONTAINER_OPERATE_BUYSPACE != reasonID && Macros.CONTAINER_OPERATE_SWAP != reasonID) {
            if (containerChange.m_stAddedThingInfoList.m_iThingNumber > 0) {
                // 判断新增物品类型
                for (let i = 0; i < containerChange.m_stAddedThingInfoList.m_iThingNumber; ++i) {
                    thingInfo = containerChange.m_stAddedThingInfoList.m_astThingInfo[i];
                    let config = ThingData.getThingConfig(thingInfo.m_iThingID);
                    if (GameIDUtil.isEquipmentID(thingInfo.m_iThingID)) {

                        if (GameIDUtil.isRoleEquipID(config.m_iID) && config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_LINGBAO) {
                            // 首次获得精灵进行提示
                            let lingbao = this.getEquipByPart(KeyWord.EQUIP_PARTCLASS_LINGBAO, Macros.CONTAINER_TYPE_ROLE_EQUIP);
                            let containerObj = this.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
                            let itemData = containerObj[thingInfo.m_usPosition];
                            G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data, 1);

                            if (itemData) {
                                G.Uimgr.createForm<LingBaoAlertView>(LingBaoAlertView).open(itemData, itemData.config.m_iID, true);
                            }
                            else {
                                let config: GameConfig.ThingConfigM = ThingData.getThingConfig(201501001);
                                itemData = new ThingItemData();
                                itemData.config = config;
                                G.Uimgr.createForm<LingBaoAlertView>(LingBaoAlertView).open(itemData, config.m_iID, true);
                            }

                            if (null == lingbao) {
                                G.GuideMgr.onGetLingbao(thingInfo);
                            }
                        }
                        else if (GameIDUtil.isHunguEquipID(config.m_iID)) {
                            //魂骨装备 
                            let isTips = false;
                            let equipDatas = this.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
                            if (config.m_ucHunLiLevel <= G.DataMgr.hunliData.level) {
                                if (config.m_iID == 113101011) {//魂骨引导专用物品
                                    isTips = false;
                                } else {
                                    let prof = config.m_ucProf;
                                    if (prof != 0 && prof != G.DataMgr.heroData.profession) {
                                        isTips = false;
                                    } else {
                                        //魂力等级达到
                                        let equip = equipDatas[config.m_iEquipPart - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN];
                                        if (equip == null) {
                                            isTips = true;
                                        }
                                        else {
                                            let newfight = G.DataMgr.hunliData.getHunguEquipFightS(config, thingInfo.m_stThingProperty.m_stSpecThingProperty);
                                            let confight = G.DataMgr.hunliData.getHunguEquipFight(equip.config, equip.data);
                                            isTips = newfight > confight;
                                        }
                                    }
                                }
                            }
                            else {
                                isTips = false;
                            }
                            if (isTips)
                                G.GuideMgr.onGetThing(config, thingInfo, reasonID);
                        }
                        else {
                            let containerObj = this.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
                            let itemData = containerObj[thingInfo.m_usPosition];
                            if (this.isBetterEquip(itemData)) {
                                //if (config.m_ucColor > KeyWord.COLOR_PURPLE) {
                                //    G.GuideMgr.onGetBetterEquip(thingInfo);
                                //} else
                                if (GameIDUtil.isRoleEquipID(config.m_iID)) {//直接使用
                                    if (config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) {
                                        G.GuideMgr.onGetThing(config, thingInfo, reasonID);
                                    } else {
                                        G.TipMgr.addMainFloatTip("自动使用:" + TextFieldUtil.getColorText(config.m_szName, Color.getColorById(config.m_ucColor)));
                                        G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data, 1);
                                    }
                                } else {
                                    G.GuideMgr.onGetThing(config, thingInfo, reasonID);
                                }
                            } else {
                                G.TipMgr.addMainFloatTip("获得:" + TextFieldUtil.getColorText(config.m_szName, Color.getColorById(config.m_ucColor)));
                            }
                            if (KeyWord.ITEM_FUNCTION_BEAUTY_EQUIPID == config.m_ucFunctionType) {
                                G.GuideMgr.onGetBetterEquip(thingInfo);
                            }
                            G.ViewCacher.flyIconView.pushIcon(thingInfo.m_iThingID, thingInfo.m_iNumber);
                        }
                    }
                    else {
                        //增加的物品
                        if (0 != config.m_ucIsAutoUse) {
                            if (KeyWord.ITEM_FUNCTION_VIP_SKILL == config.m_ucFunctionType) {
                                G.ModuleMgr.bagModule.useThing(config, thingInfo, 1, true);
                            } else {
                                G.ModuleMgr.bagModule.useThing(config, thingInfo);
                            }
                        } else if (KeyWord.ITEM_FUNCTION_ATTR_DRUG == config.m_ucFunctionType || (config.m_ucCanBatUse & KeyWord.ITEM_USE_METHOD_TIP) != 0) {
                            // 批量使用
                            G.GuideMgr.onGetThing(config, thingInfo, reasonID);
                        } else if (KeyWord.ITEM_FUNCTION_BEAUTY_ACTIVE == config.m_ucFunctionType
                            || KeyWord.ITEM_FUNCTION_SAIJI_SUBIMAGE == config.m_ucFunctionType
                        ) {
                            G.GuideMgr.onGetThing(config, thingInfo, reasonID);
                        }
                        //else if (KeyWord.ITEM_FUNCTION_NQSKILLBOOK == config.m_ucFunctionType) {
                        //    let allSkills: any = G.DataMgr.skillMainData.getSkillsByProf(G.DataMgr.heroData.profession);

                        //    if (allSkills != null) {
                        //        let passSkill: GameConfig.SkillConfigM[] = allSkills[KeyWord.SKILL_BRANCH_ROLE_NQ];
                        //        前三个怒气技能如果没学习就指引
                        //        for (i = 0; i < passSkill.length; i++) {
                        //            if (passSkill[i].m_ushSkillLevel == 1 && !passSkill[i].completed) {
                        //                GuideMgr.ins.startGetSkillGuider();
                        //            }
                        //        }
                        //    }
                        //}
                    }
                }
            }
        }
    }

    /**
     * 更新容器数据。容器可能是背包，仓库，系统宝箱
     * @param obj
     * @param container
     *
     */
    private updateContainer(type: number, container: Protocol.ContainerChanged, reasonID: number): void {

        let containerObj = this.m_allContainer[type];
        let numMap = this.m_itemNumMap[type];
        let num: number = container.m_stDeletedThingList.m_iThingNumber;
        let position: number;
        let itemData: ThingItemData;
        for (let i: number = 0; i < num; i++) //更新删除的物品
        {
            let sthing: Protocol.ContainerThing = container.m_stDeletedThingList.m_astThing[i];
            position = sthing.m_usPosition;
            itemData = containerObj[position];
            if (null != itemData && itemData.data.m_iThingID == sthing.m_iThingID) {
                this.updateItemNum(numMap, itemData.data.m_iNumber, sthing);
                if (sthing.m_iNumber > 0) {
                    itemData.data.m_iNumber = sthing.m_iNumber;
                }
                else {
                    containerObj[position] = null;
                    delete containerObj[position];
                }
            }
        }
        let currentNum: number;
        num = container.m_stAddedThingInfoList.m_iThingNumber;
        for (let i = 0; i < num; i++) //更新增加的物品
        {
            let thing: Protocol.ContainerThingInfo = container.m_stAddedThingInfoList.m_astThingInfo[i];
            currentNum = 0;
            position = thing.m_usPosition;
            itemData = containerObj[position];
            if (null == itemData) {
                containerObj[position] = itemData = new ThingItemData();
            }
            else {
                if (itemData.data != null) {
                    currentNum = itemData.data.m_iNumber;
                }
            }
            this.updateItemNum(numMap, currentNum, thing);
            itemData.data = uts.deepcopy(thing, itemData.data, true);
            itemData.containerID = container.m_stContainerID.m_ucContainerType;
            itemData.config = ThingData.getThingConfig(thing.m_iThingID);
            if (null == itemData.config) {
                uts.assert(null != itemData.config, '尼玛，背包中的物品' + thing.m_iThingID + '没有配置！');
            }
            // 直接计算装备战斗力
            if (GameIDUtil.isEquipmentID(thing.m_iThingID)) {
                if (itemData.config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) {
                    let wingCfg = G.DataMgr.equipStrengthenData.getWingStrengthCfg(itemData.config.m_iID, thing.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress);
                    if (wingCfg)
                        itemData.zdl = FightingStrengthUtil.calStrength(wingCfg.m_astPropAtt);
                    else
                        itemData.zdl = -1;
                } else {
                    itemData.zdl = FightingStrengthUtil.getStrengthByEquip(itemData.config, thing.m_stThingProperty.m_stSpecThingProperty);
                }
            } else {
                itemData.zdl = -1;
            }

            // 背包碰到自动使用类型的，自动发送使用
            //if (container.m_stContainerID.m_ucContainerType == Macros.CONTAINER_TYPE_ROLE_BAG && itemData.config.m_ucIsAutoUse) {
            //this.dispatchEvent(Events.UseThing, Macros.CONTAINER_TYPE_ROLE_BAG, itemData.config, thing);
            //}

            if (0 == itemData.config.m_ucIsAutoUse && (Macros.CONTAINER_OPERATE_MAIL_DROP == reasonID || Macros.CONTAINER_OPERATE_CHEST_DROP == reasonID ||
                Macros.CONTAINER_OPERATE_MONSTER_DROP == reasonID || Macros.CONTAINER_OPERATE_QUEST_REWARD == reasonID)) {
                currentNum = itemData.data.m_iNumber - currentNum;
                if (currentNum > 0) {
                    let cfg = itemData.config;
                    let color = cfg.m_ucColor;
                    if (GameIDUtil.isEquipmentID(cfg.m_iID) && cfg.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) {
                        color = G.DataMgr.equipStrengthenData.getWingEquipColor(itemData.config, itemData.data);
                    }
                    let info = itemData.config.m_szName + '×' + currentNum;
                    let str = '您获得了:' + TextFieldUtil.getColorText(info, Color.getColorById(color));
                    G.TipMgr.addMainFloatTip(str, FloatShowType.GetReward);
                }
            }
        }
    }

    private itemMergeCacheUpdate(type: number, container: Protocol.ContainerChanged, reasonID: number) {
        let ItemMergeCache = G.DataMgr.equipStrengthenData.ItemMergeCache;
        let num = container.m_stDeletedThingList.m_iThingNumber;
        let things = container.m_stDeletedThingList.m_astThing;
        for (let i: number = 0; i < num; i++) {//更新删除的物品
            let sthing = things[i];
            ItemMergeCache.updateMaterial(sthing.m_iThingID);
        }

        num = container.m_stAddedThingInfoList.m_iThingNumber;
        things = container.m_stAddedThingInfoList.m_astThingInfo;
        for (let i = 0; i < num; i++) {//更新增加的物品
            let sthing = things[i];
            ItemMergeCache.updateMaterial(sthing.m_iThingID);
        }
    }

    recalculateZdl() {
        for (let ctnKey in this.m_allContainer) {
            let ctnObj = this.m_allContainer[ctnKey];
            for (let posKey in ctnObj) {
                let itemData = ctnObj[posKey];
                if (GameIDUtil.isEquipmentID(itemData.data.m_iThingID)) {
                    itemData.zdl = FightingStrengthUtil.getStrengthByEquip(itemData.config, itemData.data.m_stThingProperty.m_stSpecThingProperty);
                } else {
                    itemData.zdl = -1;
                }
            }
        }
    }

    private updateItemNum(map: { [id: number]: number }, oldPosNum: number, containerThing: Protocol.ContainerThing) {
        let oldTotalNum = 0;
        if (containerThing.m_iThingID in map) {
            oldTotalNum = map[containerThing.m_iThingID];
        }
        map[containerThing.m_iThingID] = oldTotalNum + containerThing.m_iNumber - oldPosNum;
    }

    private onOutOfDateTimer(timer: Game.Timer) {
        if (0 == this.m_nextOutOfDateTime) {
            return false;
        }
        let nowInSecond = Math.ceil(G.SyncTime.getCurrentTime() / 1000);
        if (nowInSecond >= this.m_nextOutOfDateTime) {
            this.m_isBagItemValidNumDirty = true;
            G.ModuleMgr.bagModule.onContainerChange(Macros.CONTAINER_TYPE_ROLE_BAG);
        }
    }

    private updateBagItemValidNum() {
        if (!this.m_isBagItemValidNumDirty) {
            return;
        }
        let map = {};
        this.m_nextOutOfDateTime = 0;
        let bagObj = this.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        let nowInSecond = Math.ceil(G.SyncTime.getCurrentTime() / 1000);
        for (let posKey in bagObj) {
            let itemData = bagObj[posKey];
            if (!itemData.data) {
                continue;
            }
            let persistTime = itemData.data.m_stThingProperty.m_iPersistTime;
            if (persistTime > 0) {
                if (persistTime < nowInSecond) {
                    // 这个物品已经过期了
                    continue;
                }

                if (0 == this.m_nextOutOfDateTime || persistTime < this.m_nextOutOfDateTime) {
                    this.m_nextOutOfDateTime = persistTime;
                }
            }

            let id = itemData.config.m_iID;
            let oldTotalNum = 0;
            if (id in map) {
                oldTotalNum = map[id];
            }
            map[id] = oldTotalNum + itemData.data.m_iNumber;
        }
        this.m_bagItemValidNumMap = map;
        this.m_isBagItemValidNumDirty = false;
        if (null != this.outOfDateTimer) {
            this.outOfDateTimer.Stop();
            this.outOfDateTimer = null;
        }
        if (this.m_nextOutOfDateTime > 0) {
            this.outOfDateTimer = new Game.Timer("outOfDateTimer", (this.m_nextOutOfDateTime - nowInSecond) * 1000, 1, delegate(this, this.onOutOfDateTimer));
        }
    }

    private deleteContainer(type: number): void {
        let container = this.m_allContainer[type];
        for (let t in container) {
            container[t] = null;
            delete container[t];
        }
        let numMap = this.m_itemNumMap[type];
        for (let t in numMap) {
            numMap[t] = null;
            delete numMap[t];
        }
    }

    ///////////////////////////////////////////////// 数量查询 /////////////////////////////////////////////////

    /**
    * 查找指定ID物品的数量，不区分绑定与否。
    * @param thingID
    * @return 指定ID物品的总数量，包括绑定的和非绑定的。
    *
    */
    getThingNumInsensitiveToBind(thingID: number): number {
        let nonbindedNum: number = this.getThingNum(Math.floor(thingID / 10) * 10); // 非绑定的
        let bindedNum: number = this.getThingNum(Math.floor(thingID / 10) * 10 + 1); // 绑定的
        return nonbindedNum + bindedNum;
    }

    /**
     * 查询指定ID的物品数量。
     * @param thingID 物品的ID。
     * @param containerID 容器ID，默认为0，表示背包。
     * @param bindInsenstive 是否对绑定敏感，默认为敏感
     * @return
     *
     */
    getThingNum(thingID: number, containerID: number = 0, bindInsenstive: boolean = true): number {
        if (0 == containerID) {
            containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
        }
        let numMap;
        if (Macros.CONTAINER_TYPE_ROLE_BAG == containerID) {
            this.updateBagItemValidNum();
            numMap = this.m_bagItemValidNumMap;
        } else {
            numMap = this.m_itemNumMap[containerID];
        }

        if (undefined == numMap) {
            return 0;
        }
        let amount = 0;
        if (undefined != numMap[thingID]) {
            amount = numMap[thingID];
        }
        if (!bindInsenstive) {
            let brotherID = thingID;
            if (thingID % 2 == 0) {
                brotherID++;
            } else {
                brotherID--;
            }
            if (undefined != numMap[brotherID]) {
                amount += numMap[brotherID];
            }
        }
        return amount;
    }

    ///////////////////////////////////////////////// 物品检索 /////////////////////////////////////////////////

    /**
     * 按位置，获取指定容器（默认为背包）中的物品数据。
     * @param index 格子位置。
     * @param containerID 容器类型ID，在Macros中定义，默认为Macros.CONTAINER_TYPE_ROLE_BAG。
     * @return 指定容器（默认为背包）中的物品数据。
     *
     */
    getItemDataInContainer(index: number, containerID: number = Macros.CONTAINER_TYPE_ROLE_BAG): ThingItemData {
        let dataPosObj = this.getContainer(containerID);
        if (null != dataPosObj) {
            return dataPosObj[index];
        }
        return null;
    }

    /**
     * 通过ThingId和ThingGUID检索一个物品在背包中的数据，如果指定物品不在背包中则返回<code>null</code>。
     * @param thingId 物品的ThingId。
     * @param thingGuid 物品的ThingGUID。
     * @return 一个物品在背包中的数据，如果指定物品不在背包中则返回<code>null</code>。
     *
     */
    getBagItemByGuid(thingId: number, thingGuid: Protocol.ThingGUID): ThingItemData {
        let pos: number = this.getItemPositionInContainer(thingId, thingGuid);
        if (pos >= 0) {
            return this.getItemDataInContainer(pos);
        }
        else {
            return null;
        }
    }

    /**
     * 通过道具id找到背包中指定道具。<font color='ff0000'>返回的是物品在背包中的引用，因此如果直接将结果缓存起来，建议考虑进行clone，因为
     * 背包数据变化会导致结果数据也被修改。</font>
     * @param itemId 道具的ID。
     * @param bindInsenstive 是否绑定与否不敏感。
     * @param num 最大查找数量，默认为0，表示找出所有。
     * @param isCheckPersist 是否检查过期
     * @return
     *
     */
    getBagItemById(itemId: number, bindInsenstive: boolean = false, num: number = 0, isCheckPersist: boolean = false): ThingItemData[] {
        let list: ThingItemData[] = new Array<ThingItemData>();
        let config: GameConfig.ThingConfigM;
        let count: number = 0;
        let bagCtnObj = this.m_allContainer[Macros.CONTAINER_TYPE_ROLE_BAG];
        for (let positionKey in bagCtnObj) {
            let thingObj = bagCtnObj[positionKey];
            if (0 != num && count >= num) {
                break;
            }
            config = thingObj.config;
            if (!config) {
                uts.logWarning("背包物品没有配置，位置 = " + positionKey);
                continue;
            }

            if (config.m_iID == itemId || (!bindInsenstive && Math.floor(config.m_iID / 10) == Math.floor(itemId / 10))) {
                if (!isCheckPersist) {//不检查过期
                    thingObj.containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
                    list.push(thingObj);
                    count++;
                } else {//检查是否过期
                    if (thingObj.data.m_stThingProperty.m_iPersistTime == 0) {//永久物品
                        thingObj.containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
                        list.push(thingObj);
                        count++;
                    } else {//限时物品
                        if (1 == thingObj.data.m_stThingProperty.m_ucTimerStarted) {
                            let serverTime: number = G.SyncTime.getCurrentTime();
                            let leftTime: number = thingObj.data.m_stThingProperty.m_iPersistTime - Math.floor(serverTime / 1000);
                            if (leftTime > 0) {
                                thingObj.containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
                                list.push(thingObj);
                                count++;
                            }
                        }
                    }
                }
            }
        }
        return list;
    }

    getThingListByFunction(functionType: number, functionId: number = -1, functionValue: number = -1): ThingItemData[] {
        let result: ThingItemData[] = new Array<ThingItemData>();
        let bagCtnObj = this.m_allContainer[Macros.CONTAINER_TYPE_ROLE_BAG];
        for (let positionKey in bagCtnObj) {
            let thingObj = bagCtnObj[positionKey];
            if (thingObj.config.m_ucFunctionType != functionType)
                continue;
            if (functionValue != -1 && thingObj.config.m_iFunctionValue != functionValue)
                continue;
            if (functionId != -1 && thingObj.config.m_iFunctionID != functionId)
                continue;
            result.push(thingObj);
        }
        return result;
    }

    /**
     * 获取指定容器中的所有指定类型的装备数据。
     * @param type 装备类型。
     * @param containerID 容器类型ID，在Macros中定义，默认为Macros.CONTAINER_TYPE_ROLE_BAG。
     * @return 指定容器中的所有指定类型的装备数据。
     *
     */
    getAllEquipInContainer(type: GameIDType, containerID: number = Macros.CONTAINER_TYPE_ROLE_BAG, returnCopy: boolean = true): ThingItemData[] {
        let result = this.m_equipsCache.getCacheEquips(type, containerID, returnCopy);

        if (result) {
            return result;
        }

        result = [];
        let dataPosObj = this.getContainer(containerID);

        for (let positionKey in dataPosObj) {
            let thingObj = dataPosObj[positionKey];
            let equipType = GameIDUtil.getEquipIDType(thingObj.config.m_iID);
            if (GameIDType.INVALID != equipType && (type == 0 || equipType == type)) {
                thingObj.containerID = containerID;
                result.push(thingObj);
            }
        }
        this.m_equipsCache.cacheEquips(type, containerID, result);
        return result;
    }

    private onCompareByEquipId(t1: ThingItemData, t2: ThingItemData): number {
        if (t1.config.m_iID > t2.config.m_iID) {
            return 1;
        }
        else if (t1.config.m_iID < t2.config.m_iID) {
            return -1;
        }
        return 0;
    }

    ///////////////////////////////////////////////// 位置检索 /////////////////////////////////////////////////

    /**
     * 通过ThingId和ThingGUID检索一个物品在指定的容器（默认是背包）中的位置，如果指定物品不在容器中中则返回-1。
     * @param thingId 物品的ThingId。
     * @param thingGuid 物品的ThingGUID。
     * @param containerID 容器类型ID，在Macros中定义，默认为Macros.CONTAINER_TYPE_ROLE_BAG。
     * @return 物品在背包中的位置，如果指定物品不在背包中则返回-1。
     *
     */
    getItemPositionInContainer(thingId: number, thingGuid: Protocol.ThingGUID, containerID: number = 0): number {
        if (containerID == 0) {
            containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
        }
        let dataPosObj = this.getContainer(containerID);
        let isPileable: boolean = ThingData.getThingConfig(thingId).m_ucPileMax > 1;
        let containerInfo: Protocol.ContainerThingInfo = null;
        for (let positionKey in dataPosObj) {
            let thingObj = dataPosObj[positionKey];
            containerInfo = thingObj.data;
            // 除了检查thingId，对于不可堆叠的物品还需要检查guid
            if (containerInfo.m_iThingID == thingId && (isPileable || GuidUtil.isGuidEqual(containerInfo.m_stThingProperty.m_stGUID, thingGuid))) {
                return containerInfo.m_usPosition;
            }
        }
        return -1;
    }

    /**
     * 通过装备位取在对应背包的位置
     * @param part
     * @return
     *
     */
    static getIndexByEquipPart(part: number): number {
        //前后台约好每个系统装备依次是200，201。。。300， 301。。。所以取尾数就是下标了
        return part % 100;
    }

    /**
     *根据装备位取得容器类型
     * @param part
     * @return
     *
     */
    static getContainerByEquip(id: number): number {
        //前后台约好每个系统装备依次是201。。。300， 301。。。百位数是类型
        let result: number = 0;
        if (GameIDUtil.isRoleEquipID(id)) {
            result = Macros.CONTAINER_TYPE_ROLE_EQUIP;
        }
        else if (GameIDUtil.isHunguEquipID(id)) {
            return Macros.CONTAINER_TYPE_HUNGU_EQUIP;
        }
        else if (GameIDUtil.isPetEquipID(id)) {
            result = Macros.CONTAINER_TYPE_BEAUTY_EQUIP;
        }
        else if (GameIDUtil.isOtherEquipID(id)) {
            let part: number = ThingData.getThingConfig(id).m_iEquipPart;
            return GameIDUtil.getContainerIDBySubtype(GameIDUtil.getSubTypeByEquip(part));
        }
        return result;
    }

    /**
     * 根据道具的功能id和人物的角色形象
     * @param funcID
     * @return
     *
     */
    static getDressImageID(funcID: number): number {
        let heroData: HeroData = G.DataMgr.heroData;

        return funcID * 100 + heroData.profession * 10 + heroData.gender;
    }

    /**
     * 背包里的宝石够不够升级
     * @param id 需要升级的宝石
     * @return
     *
     */
    canDiamondUplevel(id: number, need: number = 3): boolean {
        let has: number = this.getThingNum(id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        //4合1，所以每多三个就够了
        if (has >= need) {
            return true;
        }
        //不够的用下一级的去找
        else {
            let level: number = Math.floor(id / 10) % 100;
            if (level > 1) {
                return this.canDiamondUplevel(id - 10, (need - has) * 4);
            }
            else {
                return false;
            }
        }
    }

    ///////////////////////////////////////////////// 容量查询 /////////////////////////////////////////////////

    /**
     * 获取背包是否已满（不包括未解锁的格子）的状态。
     * @return 若背包已满则返回<code>true</code>，否则返回<code>false</code>。
     *
     */
    get isBagFull(): boolean {
        return this.getBagRemainNum() == 0;
    }

    /**
     * 判断仓库是否已满（不包含未解锁的格子）。
     * @return
     *
     */
    get isStoreFull(): boolean {
        return this.getStoreRemainNum() == 0;
    }

    /**
     * 取得容器剩余格子（不包含未解锁的格子）的数目。
     * @param containerType 容器类型
     * @return 返回-1
     *
     */
    getRemainNum(containerType: number): number {
        let result: number = -1;
        if (containerType == Macros.CONTAINER_TYPE_ROLE_BAG) {
            result = this.getBagRemainNum();
        }
        else if (containerType == Macros.CONTAINER_TYPE_ROLE_STORE) {
            result = this.getStoreRemainNum();
        }

        return result;
    }

    /**
     * 取得背包剩余格子的数目
     * @return
     *
     */
    getBagRemainNum(): number {
        return this.bagCapacity - this.getCurBagPosNum();
    }

    /**
     * @description 检查背包是否足够
     * @param [needPrompt=false]
     * @param [limitNum=3]
     * @returns
     */
    isBagEnough(needPrompt: boolean = false, limitNum: number = 3) {
        let isEnough: boolean = this.getBagRemainNum() >= limitNum;
        if (needPrompt && !isEnough) G.TipMgr.addMainFloatTip('背包空位不足，请清理后再领取奖励！');
        return isEnough;
    }

    /**
     * 取得仓库剩余的格子数目（不包含未解锁的格子）。
     * @return
     *
     */
    getStoreRemainNum(): number {
        return this.storeCapacity - this.getCurStorePosNum();
    }

    /**
     * 取得背包当前所占的格子数目
     * @return
     *
     */
    getCurBagPosNum(): number {
        let result: number = 0;
        let items = this.m_allContainer[Macros.CONTAINER_TYPE_ROLE_BAG];
        for (let item in items)
            result++;
        return result;
    }

    /**
     * 取得仓库当前所占的格子数目。
     * @return
     *
     */
    getCurStorePosNum(): number {
        let result: number = 0;

        for (let i in this.m_allContainer[Macros.CONTAINER_TYPE_ROLE_STORE]) {
            result++;
        }
        return result;
    }

    /**
     * 取得天宫宝镜仓库当前所占的格子数目。
     * @return
     *
     */
    getCurTgbjStorePosNum(): number {
        let result: number = 0;

        for (let i in this.m_allContainer[Macros.CONTAINER_TYPE_SKYLOTTERY]) {
            result++;
        }
        return result;
    }

    /**
   * 取得星斗宝库仓库当前所占的格子数目。
   * @return
   *
   */
    getCurStarsStorePosNum(): number {
        let result: number = 0;

        for (let i in this.m_allContainer[Macros.CONTAINER_TYPE_STARLOTTERY]) {
            result++;
        }
        return result;
    }

    ///////////////////////////////////////////////// 模型读写 /////////////////////////////////////////////////
    /**背包数据是否已经初始化。*/
    get isBagDataInit(): boolean {
        return this.m_isBagDataInit;
    }

    /**装备数据是否已经初始化。*/
    get isRoleEquipDataInit(): boolean {
        return this.m_isRoleEquipDataInit;
    }

    /**仓库数据是否已经初始化。*/
    get isStoreDataInit(): boolean {
        return this.m_isStoreDataInit;
    }

    /**
     * 分析变更原因
     * @param changedList 容器变更信息列表
     *
     */
    private checkChangeReason(changedList: Protocol.ContainerChanged[], reasonID: number): void {
        this.m_changeReason.reset();

        // 检查是否换装备
        if (Macros.CONTAINER_OPERATE_BUYSPACE == reasonID || Macros.CONTAINER_OPERATE_DROP_THING == reasonID || Macros.CONTAINER_OPERATE_LIST == reasonID || Macros.CONTAINER_OPERATE_SORT == reasonID || Macros.CONTAINER_OPERATE_USE_THING == reasonID) {
            // 换装备目前是没有reasonID的，即0 == reasonID，故肯定不是换装备
            if (Macros.CONTAINER_OPERATE_USE_THING == reasonID) {
                //TODO，这里这样处理使用成功物品，只处理一个，不知这里详细逻辑，暂时这样处理
                if (changedList.length > 0) {
                    let containerChanged: Protocol.ContainerChanged = changedList[0];
                    for (let oneThing of containerChanged.m_stDeletedThingList.m_astThing) {
                        this.handleAfterUseItem(oneThing);
                    }

                }
            }
            return;
        }
        if (2 != changedList.length) {
            // 换装备肯定涉及背包和装备栏
            return;
        }

        for (let containerChange of changedList) {
            if (0 < containerChange.m_stDeletedThingList.m_iThingNumber || 1 != containerChange.m_stAddedThingInfoList.m_iThingNumber) {
                // 换装备的话没有删格子，只有增加1个格子，故不是这种情况的话也肯定不是换装备
                return;
            }

            let thingInfo: Protocol.ContainerThingInfo = containerChange.m_stAddedThingInfoList.m_astThingInfo[0];
            switch (containerChange.m_stContainerID.m_ucContainerType) {
                case Macros.CONTAINER_TYPE_ROLE_BAG: // 玩家背包
                    if (this.m_changeReason.bagPos >= 0) {
                        return; // 只能是一个背包一个装备栏
                    }
                    if (GameIDUtil.isEquipmentID(thingInfo.m_iThingID)) //装备或时装
                    {
                        this.m_changeReason.bagPos = thingInfo.m_usPosition;
                    }
                    break;

                case Macros.CONTAINER_TYPE_ROLE_EQUIP: // hero装备
                    if (this.m_changeReason.equipPos >= 0) {
                        return; // 只能是一个背包一个装备栏
                    }
                    if (GameIDUtil.isEquipmentID(thingInfo.m_iThingID)) //装备或时装
                    {
                        if (this.m_allContainer[Macros.CONTAINER_TYPE_ROLE_EQUIP][thingInfo.m_usPosition] != null) {
                            this.m_changeReason.equipPos = thingInfo.m_usPosition;
                        }
                    }
                    break;

                default:
                    return; // 不是背包和装备栏，因此不是换装备
            }

            this.m_changeReason.reason = EnumContainerChangeReason.CHANGE_EQUIP;
        }
    }

    /**处理时候使用道具成功后*/
    private handleAfterUseItem(oneThing: Protocol.ContainerThing): void {
        if (!oneThing) {
            return;
        }
        let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(oneThing.m_iThingID);
        if (thingConfig) {
            switch (thingConfig.m_ucFunctionType) {
                case KeyWord.ITEM_FUNCTION_EQUIP_FINAL:
                    let pos = G.DataMgr.runtime.equipPos;
                    let oneSoltInfo = G.DataMgr.runtime.oneSlotInfo;
                    oneSoltInfo.m_ucSlotStage++;
                    G.DataMgr.equipStrengthenData.setEquipSlotOneData(pos, oneSoltInfo);
                    uts.log("  thingdata  1252   使用  终极单药成功   ");
                    let view = G.Uimgr.getForm<EquipFinalUpPanel>(EquipFinalUpPanel);
                    if (view != null && view.isOpened) {
                        view.playJinJieEffect();
                    }
                    break;
                case KeyWord.ITEM_FUNCTION_SPECIAL_PRI:
                    //使用特殊vip
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_SPECIAL_LIST, 0));
                    break;

                default:

            }
            ////RMB兑换道具
            ////switch (thingConfig.m_iID) {
            ////    case EnumRmbRule.GUIDE_RMB_EXCHANGE_ITEM_ID:
            ////        G.DataMgr.rmbData.flagGuideRmbExchange = EnumRmbRule.GUIDE_RMB_EXCHANGE_SETP_OPEN;
            ////        break;
            ////    default:

            ////}

        }
    }

    /**
     * 获取身上指定部位的装备，可以指定检查的容器和最小战斗力。
     * @param equipPart 装备部位。
     * @param containerID 容器ID。
     * @param minZdl 如果大于0，则装备的战斗力必须大于minZdl。
     * @param currentVo 查找时是否有限制条件（例如7阶坐骑 ，10阶装备）
     * @return 装备的Object类型数据，你可以使用ThingItemData::adapt进行转化。
     *
     */
    getEquipByPart(equipPart: number, containerID = 0, minZdl = 0, currentVo: Protocol.CSHeroSubSuper = null, minColor = 0): ThingItemData {
        if (0 == containerID) {
            containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
        }
        let co = this.getContainer(containerID);
        for (let positionKey in co) {
            let obj = co[positionKey];
            if (equipPart == obj.config.m_iEquipPart && (0 == minZdl || minZdl < obj.zdl) &&
                (null == currentVo || (obj.config.m_ucRequiredLevel <= currentVo.m_ucLevel)) &&
                (0 == minColor || minColor < obj.config.m_ucColor)) {
                return obj;
            }
        }

        return null;
    }

    /**
     *  获取身上指定部位的伙伴装备，可以指定检查的容器和最小战斗力。
     * @param equipPart
     * @param petID
     * @param containerID
     * @param minZdl
     * @return
     *
     */
    getPetEquipPart(equipPart: number, petID: number = 0, containerID: number = 0, minZdl: number = 0): ThingItemData {
        let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(petID);
        if (pet == null) {
            pet = G.DataMgr.petData.getFollowPet();
        }

        if (pet == null || pet.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) {
            return null;
        }

        if (0 == containerID) {
            containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
        }

        let co: { [pos: number]: ThingItemData } = this.getContainer(containerID);
        if (null != co) {
            if (containerID == Macros.CONTAINER_TYPE_BEAUTY_EQUIP) {
                let petConfig: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(pet.m_iBeautyID);
                let obj = co[petConfig.m_uiEquipPosition + (equipPart % KeyWord.BEAUTY_EQUIP_PARTCLASS_MIN)];
                if (obj && obj.config.m_ucRequiredLevel <= pet.m_uiStage && (0 == minZdl || minZdl < obj.zdl)) {
                    return obj;
                }
            }
            else {
                for (let key in co) {
                    let obj = co[key];
                    if (equipPart == obj.config.m_iEquipPart && obj.config.m_ucRequiredLevel <= pet.m_uiStage && (0 == minZdl || minZdl < obj.zdl) && (0 == obj.config.m_iFunctionID || pet.m_iBeautyID == obj.config.m_iFunctionID)) {
                        return obj;
                    }
                }
            }
        }

        return null;
    }

    /**
     * 获取比指定颜色或使用等级（若同时指定颜色和等级的话就同时检查）更好（或一样）的相同部位的装备。
     * @param equipPart
     * @param color 默认为0，表示不检查颜色。
     * @param lv 默认为0，表示不检查等级。
     * @param containerID 默认为0，表示背包。
     * @param compareRule 比较规则，0表示相等，-1表示不超过指定的颜色或等级，
     * -2表示比指定的颜色或等级差，1表示不小于指定的颜色或等级，2表示比指定的颜色或等级好。
     * @return
     *
     */
    getEquipByColor(equipPart: number, color: number = 0, lv: number = 0, containerID: number = 0, compareRule: number = 0): ThingItemData {
        if (0 == containerID) {
            containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
        }

        let co = this.getContainer(containerID);

        let config: GameConfig.ThingConfigM;
        let tmp: number;
        for (let positionKey in co) {
            let obj = co[positionKey];
            config = obj.config;
            if (equipPart == config.m_iEquipPart) {
                if (color > 0) {
                    tmp = Color.compare(config.m_ucColor, color);
                    if (0 == compareRule) {
                        if (0 != tmp) {
                            continue;
                        }
                    }
                    else if (-1 == compareRule) {
                        if (tmp > 0) {
                            continue;
                        }
                    }
                    else if (compareRule < -1) {
                        if (tmp >= 0) {
                            continue;
                        }
                    }
                    else if (1 == compareRule) {
                        if (tmp < 0) {
                            continue;
                        }
                    }
                    else {
                        if (tmp <= 0) {
                            continue;
                        }
                    }
                }

                if (lv > 0 && config.m_ucRequiredLevel <= lv) {
                    if (0 == compareRule) {
                        if (lv != config.m_ucRequiredLevel) {
                            continue;
                        }
                    }
                    else if (-1 == compareRule) {
                        if (config.m_ucRequiredLevel > lv) {
                            continue;
                        }
                    }
                    else if (compareRule < -1) {
                        if (config.m_ucRequiredLevel >= lv) {
                            continue;
                        }
                    }
                    else if (1 == compareRule) {
                        if (config.m_ucRequiredLevel < lv) {
                            continue;
                        }
                    }
                    else {
                        if (config.m_ucRequiredLevel <= lv) {
                            continue;
                        }
                    }
                }

                return obj;
            }
        }

        return null;
    }

    getContainer(id: number): { [position: number]: ThingItemData } {
        return this.m_allContainer[id];
    }

    /**
     * 获取角色身上的意见装备
     * @param type	装备类型
     * @return
     *
     */
    getRoleEquip(type: number): ThingItemData {
        if (this.m_allContainer[Macros.CONTAINER_TYPE_ROLE_EQUIP] != null)
            return this.m_allContainer[Macros.CONTAINER_TYPE_ROLE_EQUIP][type];
        return null;
    }

    ///////////////////////////////////////////////// 背包物品变化 /////////////////////////////////////////////////

    ///**
    // * 本接口暂不支持伙伴装备，调用的时候请注意。
    // * @param refrence
    // * @param containerID
    // */
    //isBetterEquipInContainer(refrence: ThingItemData, containerID: number): boolean {
    //    let equipPart = refrence.config.m_iEquipPart;

    //    let isWingEquip = equipPart == KeyWord.EQUIP_PARTCLASS_WING;
    //    if (isWingEquip && G.DataMgr.heroData.profession != refrence.config.m_ucProf) {
    //        return false;
    //    }

    //    //精灵，婚介，时装
    //    if (GameIDUtil.isRoleEquipID(refrence.config.m_iID) &&(equipPart == KeyWord.EQUIP_PARTCLASS_LINGBAO || equipPart == KeyWord.EQUIP_PARTCLASS_WEDDINGRING || equipPart == KeyWord.EQUIP_PARTCLASS_DRESS)) {
    //        return false;
    //    }

    //    let guid = refrence.data.m_stThingProperty.m_stGUID;
    //    let color = 0;
    //    if (GameIDUtil.isRoleEquipID(refrence.data.m_iThingID)) {
    //        // 角色装备颜色优先
    //        color = !isWingEquip ? refrence.config.m_ucColor : -1;
    //    }
    //    let co = this.getContainer(containerID);
    //    for (let positionKey in co) {
    //        let obj = co[positionKey];
    //        if (equipPart == obj.config.m_iEquipPart && (obj.config.m_ucProf == 0 || G.DataMgr.heroData.profession == obj.config.m_ucProf) &&
    //            (containerID != refrence.containerID || !GuidUtil.isGuidEqual(obj.data.m_stThingProperty.m_stGUID, guid))) {
    //            if (color > 0) {

    //                let tmpColor = obj.config.m_ucColor;
    //                if (tmpColor > color) {
    //                    // 颜色高就更好
    //                    return false;
    //                }
    //                if (tmpColor < color) {
    //                    // 颜色低都不用看战力
    //                    continue;
    //                }
    //            }
    //            if (obj.zdl >= refrence.zdl) {
    //                return false;
    //            }
    //        }
    //    }
    //    return true;
    //}

    /**
    * 本接口暂不支持伙伴装备，调用的时候请注意。
    * 橙色以上装备
    * @param refrence
    * @param containerID
    */
    isBetterEquipInContainer(refrence: ThingItemData, containerID: number): boolean {
        let equipPart = refrence.config.m_iEquipPart;

        let isWingEquip = equipPart == KeyWord.EQUIP_PARTCLASS_WING;
        if (isWingEquip && G.DataMgr.heroData.profession != refrence.config.m_ucProf) {
            return false;
        }

        //精灵，婚介，时装
        if (GameIDUtil.isRoleEquipID(refrence.config.m_iID) && (equipPart == KeyWord.EQUIP_PARTCLASS_LINGBAO || equipPart == KeyWord.EQUIP_PARTCLASS_WEDDINGRING || equipPart == KeyWord.EQUIP_PARTCLASS_DRESS)) {
            return false;
        }

        let guid = refrence.data.m_stThingProperty.m_stGUID;
        let color = 0;
        if (GameIDUtil.isRoleEquipID(refrence.data.m_iThingID)) {
            // 角色装备颜色优先
            color = !isWingEquip ? refrence.config.m_ucColor : -1;
        }
        //if (color < KeyWord.COLOR_ORANGE) {
        //    return false;
        //}
        let co = this.getContainer(containerID);
        for (let positionKey in co) {
            let obj = co[positionKey];
            if (equipPart == obj.config.m_iEquipPart && (obj.config.m_ucProf == 0 || G.DataMgr.heroData.profession == obj.config.m_ucProf) &&
                (containerID != refrence.containerID || !GuidUtil.isGuidEqual(obj.data.m_stThingProperty.m_stGUID, guid))) {
                if (color > 0) {

                    let tmpColor = obj.config.m_ucColor;
                    if (tmpColor > color) {
                        // 颜色高就更好
                        return false;
                    }
                    if (tmpColor < color) {
                        // 颜色低都不用看战力
                        continue;
                    }
                }
                if (obj.zdl >= refrence.zdl) {
                    return false;
                }
            }
        }
        return true;
    }


    /**
    * 更好的魂骨装备 比较战斗力和可装备等级（背包iconitem用）
    * @param refrence 背包物体
    * @param containerID 魂骨面板
    */
    isBetterRebirthEquipInContainer(refrence: ThingItemData, containerID: number): boolean {
        let profession = G.DataMgr.heroData.profession;
        let hunliData = G.DataMgr.hunliData;
        let prof = refrence.config.m_ucProf;
        if (prof != 0 && prof != profession) {
            return false;
        }
        let equipPart = refrence.config.m_iEquipPart;
        let co = this.getContainer(containerID);

        //装备位没有装备
        if (co[equipPart] == null) {
            if (refrence.config.m_ucHunLiLevel > hunliData.level)
                return false;
        }

        //有装备
        for (let positionKey in co) {
            let obj = co[positionKey];
            let prof = obj.config.m_ucProf;
            if (equipPart == obj.config.m_iEquipPart) {
                if (refrence.config.m_ucHunLiLevel > hunliData.level)
                    return false;
                let bagfight = G.DataMgr.hunliData.getHunguEquipFight(refrence.config, refrence.data);
                let equipfight = G.DataMgr.hunliData.getHunguEquipFight(obj.config, obj.data);
                if (bagfight <= equipfight) {
                    return false;
                }
            }
        }
        return true;
    }

    isBetterHunguEquipInContainer(refrence: ThingItemData, containerID: number): [boolean, boolean] {
        let flagState: [boolean, boolean] = [false, false];
        let profession = G.DataMgr.heroData.profession;
        let hunliData = G.DataMgr.hunliData;
        let prof = refrence.config.m_ucProf;
        if (prof != 0 && prof != profession) {
            return flagState;
        }
        let equipPart = refrence.config.m_iEquipPart;
        let co = this.getContainer(containerID);
        let hunguEquip = co[equipPart - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN];
        if (hunguEquip == null) {
            //装备位没有装备
            flagState[0] = true;
            flagState[1] = refrence.config.m_ucHunLiLevel > hunliData.level;
        }
        else {
            //有装备
            let bagfight = G.DataMgr.hunliData.getHunguEquipFight(refrence.config, refrence.data);
            let equipfight = G.DataMgr.hunliData.getHunguEquipFight(hunguEquip.config, hunguEquip.data);
            flagState[0] = bagfight > equipfight;
            flagState[1] = refrence.config.m_ucHunLiLevel > hunliData.level;
        }
        return flagState;
    }

    /**
    * 更好的魂骨装备 比较战斗力和可装备等级（魂骨iconitem用）
    * @param hunguItem
    * @param containerID
    */
    isShowHunguArrowAtPanel(hunguItem: ThingItemData, containerID: number): boolean {
        let profession = G.DataMgr.heroData.profession;
        let hunliData = G.DataMgr.hunliData;
        let co = this.getContainer(containerID);
        //装备位没有装备

        //装备位有装备
        for (let positionKey in co) {
            let obj = co[positionKey];
            if (!GameIDUtil.isHunguEquipID(obj.config.m_iID)) continue;
            //职业限制
            let prof = obj.config.m_ucProf;
            if (prof != 0 && prof != profession) continue;
            if (obj.config.m_iEquipPart != hunguItem.config.m_iEquipPart) continue;
            if (obj.config.m_ucHunLiLevel <= hunliData.level) {
                // let bagfight = FightingStrengthUtil.calStrength(obj.config.m_astBaseProp);
                // let equipfight = FightingStrengthUtil.calStrength(hunguItem.config.m_astBaseProp);
                let bagfight = G.DataMgr.hunliData.getHunguEquipFight(obj.config, obj.data);
                let equipfight = G.DataMgr.hunliData.getHunguEquipFight(hunguItem.config, hunguItem.data);
                if (bagfight > equipfight)
                    return true;
            }
        }
        return false;
    }

    /**
    * 更好的魂骨装备（装备位没装备） 比较战斗力和可装备等级（魂骨iconitem用）
    * @param hunguItem
    * @param containerID
    */
    isShowHunguArrowAtPanelNone(part: number): boolean {
        let profession = G.DataMgr.heroData.profession;
        let hunliData = G.DataMgr.hunliData;

        let co = this.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        //装备位没有装备
        for (let positionKey in co) {
            let obj = co[positionKey];
            if (!GameIDUtil.isHunguEquipID(obj.config.m_iID)) continue;
            let prof = obj.config.m_ucProf;
            if (prof != 0 && prof != profession) continue;
            if (obj.config.m_iEquipPart != part) continue;
            if (obj.config.m_ucHunLiLevel <= hunliData.level)
                return true;
        }
        return false;
    }

    /**是否是低战斗力魂骨
     * 背包分解时会用，判断是否是更低的战斗力
     */
    isLowFightingHunguEquip(bagEquip: ThingItemData, containerID: number): boolean {
        let equipPart = bagEquip.config.m_iEquipPart;
        let hunguContainer = this.getContainer(containerID);

        //装备位没有装备
        if (hunguContainer[equipPart - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN] == null) {
            return false;
        }
        //有装备
        let hunguEquip = hunguContainer[equipPart - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN];
        let bagfight = G.DataMgr.hunliData.getHunguEquipFight(bagEquip.config, bagEquip.data);
        let equipfight = G.DataMgr.hunliData.getHunguEquipFight(hunguEquip.config, hunguEquip.data);
        return bagfight < equipfight;
    }

    /**是否是其它职业魂骨
    * 背包分解时会用
    */
    isOtherHunguEquip(bagEquip: ThingItemData): boolean {
        let profession = G.DataMgr.heroData.profession;
        let prof = bagEquip.config.m_ucProf;
        if (prof != 0 && prof != profession) {
            return true;
        }
        return false;
    }



    /**是否显示魂骨界面小红点 */
    isHunliPanelMark(): boolean {
        let hungus = this.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let bags = this.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        let hunliData = G.DataMgr.hunliData;
        let len = KeyWord.HUNGU_EQUIP_PARTCLASS_MAX - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN + 1;

        for (let positionKey in bags) {
            let bagitem = bags[positionKey];
            //职业限制
            let prof = bagitem.config.m_ucProf;
            if (prof != 0 && prof != G.DataMgr.heroData.profession) {
                continue;
            }

            if (!GameIDUtil.isHunguEquipID(bagitem.config.m_iID)) continue;
            for (let i = 0; i < len; i++) {
                let equipData = hungus[i];
                if (equipData == null) {
                    if (bagitem.config.m_iEquipPart == (KeyWord.HUNGU_EQUIP_PARTCLASS_MIN + i)
                        && bagitem.config.m_ucHunLiLevel <= hunliData.level)
                        return true;
                }
                else {
                    if (bagitem.config.m_iEquipPart != equipData.config.m_iEquipPart) continue;
                    if (bagitem.config.m_ucHunLiLevel <= hunliData.level) {
                        // let bagfight = FightingStrengthUtil.calStrength(bagitem.config.m_astBaseProp);
                        // let equipfight = FightingStrengthUtil.calStrength(equipData.config.m_astBaseProp);
                        let bagfight = G.DataMgr.hunliData.getHunguEquipFight(bagitem.config, bagitem.data);
                        let equipfight = G.DataMgr.hunliData.getHunguEquipFight(equipData.config, equipData.data);
                        if (bagfight > equipfight)
                            return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 魂骨封装红点
     */
    isHunguFZPanelMark(): boolean {
        return G.DataMgr.hunliData.hunguIntensifyData.isHunguFZPanelMark();
    }


    /**
     * 更好的祝福装备
     * @param refrence
     * @param containerID
     */
    isBetterOtherEquipInContainer(refrence: ThingItemData, containerID: number): boolean {

        let equipPart = refrence.config.m_iEquipPart;
        let subType = GameIDUtil.getSubTypeByEquip(equipPart);
        let currentVo: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(subType);
        if (!currentVo)
            return false;

        let limitLv = currentVo.m_ucLevel;
        if (refrence.config.m_ucRequiredLevel > limitLv)
            return false;

        let guid = refrence.data.m_stThingProperty.m_stGUID;
        let color = refrence.config.m_ucColor;
        let co = this.getContainer(containerID);
        for (let positionKey in co) {
            let obj = co[positionKey];
            if (equipPart == obj.config.m_iEquipPart &&
                (containerID != refrence.containerID || !GuidUtil.isGuidEqual(obj.data.m_stThingProperty.m_stGUID, guid))) {

                if (color > 0) {
                    let tmpColor = obj.config.m_ucColor;
                    if (tmpColor > color) {
                        // 颜色高就更好
                        return false;
                    }
                    if (tmpColor < color) {
                        // 颜色低都不用看战力
                        continue;
                    }
                }
                if (obj.zdl >= refrence.zdl) {
                    return false;
                }
            }
        }
        return true;
    }



    /**获取伙伴更好的装备*/
    getBeautyBetterEquip(equipPart: number, petInfo: Protocol.NewBeautyInfo, bagData: ThingItemData[] = null): ThingItemData {
        if (!petInfo) {
            return null;
        }
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petInfo.m_iBeautyID);
        let pos: number = equipPart - KeyWord.BEAUTY_EQUIP_PARTCLASS_MIN;
        if (config) {
            pos = config.m_uiEquipPosition + pos;
        }
        let wearFight = 0;
        let equipObject = this.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        if (equipObject && equipObject[pos]) {
            let wearThingData = equipObject[pos] as ThingItemData;
            wearFight = wearThingData.zdl;
        }
        if (!bagData) {
            bagData = this.getAllEquipInContainer(GameIDType.PET_EQUIP);
        }
        for (let thingData of bagData) {
            let equipConfig = thingData.config;
            if (equipConfig.m_iEquipPart == equipPart && (equipConfig.m_iFunctionID == 0 || equipConfig.m_iFunctionID == petInfo.m_iBeautyID) && thingData.zdl > wearFight) {
                if (equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BINHUN || equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BRACELET) {
                    if (equipConfig.m_ucRequiredLevel <= petInfo.m_uiStage) {
                        return thingData;
                    }
                }
                else {
                    let awakenStage = G.DataMgr.petData.getPetInfo(petInfo.m_iBeautyID).m_stAwake.m_ucLevel;
                    if (equipConfig.m_ucRequiredLevel <= awakenStage) {
                        return thingData;
                    }
                }
            }
        }
        return null;
    }

    getZhufuBetterEquip(equipPart: number, subType: number, bagData: ThingItemData[] = null): ThingItemData {
        let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(subType);
        if (data == null || data.m_ucLevel == 0) {
            return null;
        }
        if (!bagData) {
            bagData = this.getAllEquipInContainer(GameIDType.OTHER_EQUIP);
        }
        let wearFight = 0;
        let equipObject = this.getContainer(GameIDUtil.getContainerIDBySubtype(subType));
        let pos: number = ThingData.getIndexByEquipPart(equipPart);
        if (equipObject && equipObject[pos]) {
            let wearThingData = equipObject[pos] as ThingItemData;
            wearFight = wearThingData.zdl;
        }
        for (let thingData of bagData) {
            let equipConfig = thingData.config;
            if (equipConfig.m_iEquipPart == equipPart && equipConfig.m_ucRequiredLevel <= data.m_ucLevel) {
                let fight: number = thingData.zdl;
                if (fight > wearFight) {
                    return thingData;
                }
            }
        }
        return null;
    }


    /**
     * 返回一个4位数，依次表示每个部位的档次，
     * @param petID
     * @param suitID
     * @return
     *
     */
    getWearingPetSuitFlag(petID: number, suitID: number): number {
        let num: number = 0;

        let equipObject = this.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petID);
        let thingConfig: GameConfig.ThingConfigM;
        let pos: number;
        let pow: number = 1;

        for (let i: number = 0; i < Macros.BEAUTY_EQUIP_NUMBER; i++) {
            pos = config.m_uiEquipPosition + i;
            if (equipObject != null && equipObject[pos] != null) {
                let equipConfig = equipObject[pos].config;
                if (equipConfig.m_ucWYSuitID == suitID) {
                    if (equipConfig.m_ucColor >= KeyWord.COLOR_BLUE) {
                        num += 1 * pow;
                    }
                    //if (equipConfig.m_ucColor == KeyWord.COLOR_GOLD) {
                    //    num += 2 * pow;
                    //}
                    //if (equipConfig.m_ucColor == KeyWord.COLOR_RED) {
                    //    num += 3 * pow;
                    //}
                }
            }

            pow *= 10;
        }

        return num;
    }

    getWearingPetSuitNum(petID: number, suitID: number): number {
        let suitNum: number = this.getWearingPetSuitFlag(petID, suitID);
        let has: number = 0;
        let val: number = 0;
        let red: number = 0;
        let gold: number = 0;
        let orange: number = 0;
        while (suitNum > 0) {
            val = suitNum % 10;
            //if (val == 3) {
            //    red++;
            //}
            //else if (val == 2) {
            //    gold++;
            //}
            //else if (val == 1) {
            //    orange++;
            //}
            if (val == 1) {
                has++;
            }
            suitNum = Math.floor(suitNum / 10);
        }
        //if (red == 4) {
        //    has = 4;
        //}
        //else if (red + gold == 4) {
        //    has = 3;
        //}
        //else if (red + gold + orange == 4) {
        //    has = 2;
        //}
        return has;
    }

    checkThing(type: number, id: number = -1, value: number = -1): ThingItemData {
        let items = this.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        for (let positionKey in items) {
            let item = items[positionKey];
            if (item.config.m_ucFunctionType != type)
                continue;

            if (id != -1 && item.config.m_iFunctionID != id)
                continue;

            if (value != -1 && item.config.m_iFunctionValue != value)
                continue;

            return item;
        }

        return null;
    }

    checkThingForZhufu(zhufutype: number): boolean {
        let items = this.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        let zhufuData = G.DataMgr.zhufuData;
        for (let positionKey in items) {
            let item = items[positionKey];
            if (item.config.m_ucFunctionType != KeyWord.ITEM_FUNCTION_SUBIMAGE && item.config.m_ucFunctionType != KeyWord.ITEM_FUNCTION_SAIJI_SUBIMAGE)
                continue;
            let id = zhufuData.getImageLevelID(item.config.m_iFunctionID, 1);
            let zhufu = zhufuData.getImageConfig(id);
            if (zhufu) {
                if (zhufu.m_iZhuFuID == zhufutype) {
                    if (zhufu.m_iFuncID == KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN) {//赛季外形
                        let saiJICfg = zhufuData.getSaiJiCfgByImageId(zhufu.m_uiImageId);
                        if (saiJICfg) {
                            if (saiJICfg.m_iSeasonID <= zhufuData.getSaiJiMax()) {//处理小于等于当前赛季
                                let data = zhufuData.getTimeItem(zhufutype, id);
                                if (data) {
                                    if (zhufuData.canImagePy(data)) {
                                        return true;
                                    }
                                }
                                else {
                                    return G.DataMgr.thingData.getThingNum(zhufu.m_iConsumeID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= zhufu.m_iConsumableCount;
                                }
                            }
                        } else {
                            return false;
                        }
                    } else {//不是赛季外形
                        let data = zhufuData.getTimeItem(zhufutype, id);
                        if (data) {
                            if (zhufuData.canImagePy(data)) {
                                return true;
                            }
                        }
                        else {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    checkThingIDForZhufu(zhufutype: number, zhufuID: number): boolean {
        let items = this.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        let zhufuData = G.DataMgr.zhufuData;
        for (let positionKey in items) {
            let item = items[positionKey];
            if (item.config.m_ucFunctionType != KeyWord.ITEM_FUNCTION_SUBIMAGE && item.config.m_ucFunctionType != KeyWord.ITEM_FUNCTION_SAIJI_SUBIMAGE) {
                continue;
            }
            if (zhufuData.getImageUnLevelID(zhufuID) == item.config.m_iFunctionID) {
                let id = zhufuData.getImageLevelID(item.config.m_iFunctionID, 1);
                let zhufu = zhufuData.getImageConfig(id);
                if (zhufu) {
                    if (zhufu.m_iZhuFuID == zhufutype) {
                        if (zhufu.m_iFuncID == KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN) {//赛季外形
                            let saiJICfg = zhufuData.getSaiJiCfgByImageId(zhufu.m_uiImageId);
                            if (saiJICfg) {
                                if (saiJICfg.m_iSeasonID <= zhufuData.getSaiJiMax()) {//处理小于等于当前赛季
                                    let data = zhufuData.getTimeItem(zhufutype, id);
                                    if (data) {
                                        if (zhufuData.canImagePy(data)) {
                                            return true;
                                        }
                                    } else {
                                        return G.DataMgr.thingData.getThingNum(zhufu.m_iConsumeID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= zhufu.m_iConsumableCount;
                                    }
                                }
                            } else {
                                return false;
                            }
                        } else {//不是赛季外形
                            let data = zhufuData.getTimeItem(zhufutype, id);
                            if (data) {
                                if (zhufuData.canImagePy(data)) {
                                    return true;
                                }
                            }
                            else {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    isLingbaoTipmark(): boolean {

        return false;
    }

    get auctionClass(): { [id: number]: number[] } {
        return this.m_auctionClass;
    }

    canEquipCompose(config: GameConfig.ThingConfigM, isInBag: boolean): boolean {
        if (GameIDUtil.isOtherEquipID(config.m_iID)) {
            let num: number = isInBag ? 3 : 2;
            let nextLevel: number = config.m_iID + 1000;
            if (ThingData.getThingConfig(nextLevel) != null && this.getThingNum(config.m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= num) {
                return true;
            }
        }

        return false;
    }


    getWearingPetEquipByStage(stage: number): number {
        let cnt: number = 0;
        let allEquip = this.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        for (let key in allEquip) {
            let equip = allEquip[key];
            if (equip.config.m_ucStage >= stage) {
                cnt++;
            }
        }
        return cnt;
    }

    /**
     *得到 所有 使用级别下限 小于等于 装备强化等级 的所有宝石
     * @param data 装备
     */
    getAllLessEquipStrengthLvDiamonds(data: ThingItemData): ThingItemData[] {
        let allDiamondData: ThingItemData[] = [];
        //let level = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(data.config.m_iEquipPart - 100).m_usStrengthenLv;
        //let level = EquipStrengthenData.getEquipLevel(data.config.m_iEquipPart);
        let rawDatas: { [position: number]: ThingItemData } = this.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        for (let key in rawDatas) {
            if (KeyWord.ITEM_FUNCTION_EQUIP_JEWEL == rawDatas[key].config.m_ucFunctionType) {
                //if (rawDatas[key].config.m_ucRequiredLevel <= level) {
                allDiamondData.push(rawDatas[key]);
                //}
            }
        }
        return allDiamondData;
    }



    //////////////////////////////////////////////////////////////////////
    /**
   * 得到背包中指定类型中，最大的等级
  *[KeyWord.EQUIP_PROP_DEFENSE] = "普防";
  *[KeyWord.EQUIP_PROP_MAGIC_ATTACK] = "属攻";
  *[KeyWord.EQUIP_PROP_HP] = "生命";
  *[KeyWord.EQUIP_PROP_DEFENSE] = "普防";
  *[KeyWord.EQUIP_PROP_MAGICRESIST] = "属防";
  *[KeyWord.EQUIP_PROP_GOAL] = "命中";
  *[KeyWord.EQUIP_PROP_DODGE] = "闪避";
  *[KeyWord.EQUIP_PROP_CRITICAL] = "暴击";
  *[KeyWord.EQUIP_PROP_TOUGHNESS] = "抗暴";
   * @param type
   */
    getDiamondMaxLevelByType(type: number, data: ThingItemData): number {
        let diamonds = this.getAllDiamondByType(type, data);
        let maxLv: number = 0;
        for (let i = 0; i < diamonds.length; i++) {
            let lv = EquipUtils.getDiamondLevel(diamonds[i]);
            if (lv > maxLv) {
                maxLv = lv;
            }
        }
        return maxLv;
    }

    /**
  * 得到指定类型的所有宝石
  *[KeyWord.EQUIP_PROP_DEFENSE] = "普防";
  *[KeyWord.EQUIP_PROP_MAGIC_ATTACK] = "属攻";
  *[KeyWord.EQUIP_PROP_HP] = "生命";
  *[KeyWord.EQUIP_PROP_DEFENSE] = "普防";
  *[KeyWord.EQUIP_PROP_MAGICRESIST] = "属防";
  *[KeyWord.EQUIP_PROP_GOAL] = "命中";
  *[KeyWord.EQUIP_PROP_DODGE] = "闪避";
  *[KeyWord.EQUIP_PROP_CRITICAL] = "暴击";
  *[KeyWord.EQUIP_PROP_TOUGHNESS] = "抗暴";
  * @param type
  *返回宝石ID列表
   */
    getAllDiamondByType(type: number, data: ThingItemData, maxCnt = 0): number[] {
        let allDiamondData: ThingItemData[] = this.getAllLessEquipStrengthLvDiamonds(data);
        let diamondsID: number[] = [];
        let cfg: GameConfig.DiamondPropM;
        let id: number = 0;
        let len = allDiamondData.length;
        let cnt = 0;
        for (let i = 0; i < len; i++) {
            id = allDiamondData[i].config.m_iID;
            cfg = G.DataMgr.equipStrengthenData.getDiamondConfig(id);
            if (cfg && cfg.m_ucPropId == type) {
                diamondsID.push(id);
                cnt++;
                if (maxCnt > 0 && cnt >= maxCnt) {
                    break;
                }
            }
        }
        return diamondsID;
    }


    /**
     * 一个宝石是否可以升级
     * @param id
     */
    isOneDaimondCanLvUp(id: number, data: ThingItemData): boolean {
        if (id <= 0 || data == null) return false;
        let diamondLevel = EquipUtils.getDiamondLevel(id);
        let equipId = data.config.m_iID;
        //满级宝石
        if (EquipUtils.getDiamondLevel(id) >= EquipUtils.DiamondMaxLv) return false;
        let cfg: GameConfig.DiamondPropM = G.DataMgr.equipStrengthenData.getDiamondConfig(id);

        //if (this.getAllDiamondByType(cfg.m_ucPropId, data, 1).length > 0) {
        //    return true;
        //}
        let diamondIds = this.getAllDiamondByType(cfg.m_ucPropId, data, 0);
        let len = diamondIds.length;
        for (let i = 0; i < len; i++) {
            if (EquipUtils.getDiamondLevel(diamondIds[i]) <= diamondLevel) {
                return true;
            }
        }
        return false;
    }


    ///////////////////////////////////////////////////////


    /**
     * 检查指定的装备是否当前穿戴的。
     * @param thingItemData
     */
    checkIsWaring(thingItemData: ThingItemData, petOrZhufuId: number, isOther: boolean = false): boolean {
        if (null == thingItemData || null == thingItemData.data || !GameIDUtil.isEquipmentID(thingItemData.data.m_iThingID)) {
            return false;
        }
        let isWearing: boolean = false;
        if (thingItemData.containerID != 0 && ThingData.getContainerByEquip(thingItemData.data.m_iThingID) == thingItemData.containerID) {
            let heroEquipList: { [pos: number]: ThingItemData };
            let tempThingInfo: ThingItemData;
            if (GameIDUtil.isPetEquipID(thingItemData.data.m_iThingID)) {
                let pet: Protocol.NewBeautyInfo;
                if (thingItemData.config.m_iFunctionID > 0) {
                    pet = G.DataMgr.petData.getPetInfo(thingItemData.config.m_iFunctionID);
                } else if (petOrZhufuId > 0) {
                    pet = G.DataMgr.petData.getPetInfo(petOrZhufuId);
                }
                if (pet == null) {
                    pet = G.DataMgr.petData.getFollowPet();
                }

                if (pet != null && pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                    heroEquipList = this.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
                    let petConfig: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(pet.m_iBeautyID);

                    for (let i: number = 0; i < Macros.BEAUTY_EQUIP_NUMBER; i++) {
                        tempThingInfo = heroEquipList[petConfig.m_uiEquipPosition + i];
                        if (tempThingInfo != null && GuidUtil.isGuidEqual(tempThingInfo.data.m_stThingProperty.m_stGUID, thingItemData.data.m_stThingProperty.m_stGUID)) {
                            isWearing = true;
                            break;
                        }
                    }
                }
            }
            else {
                if (isOther) {
                    //别人
                    heroEquipList = G.DataMgr.otherPlayerData.equipData;
                } else {
                    //自己本身
                    heroEquipList = this.getContainer(thingItemData.containerID);
                }
                for (let key in heroEquipList) {
                    let tempThingInfo = heroEquipList[key];
                    if (tempThingInfo != null && GuidUtil.isGuidEqual(tempThingInfo.data.m_stThingProperty.m_stGUID, thingItemData.data.m_stThingProperty.m_stGUID)) {
                        // 相同部位
                        isWearing = true;
                        break;
                    }
                }
            }
        }

        return isWearing;
    }

    /**
    * 检查自己是否穿了装备
    * @param tipData
    */
    getWearedEquip(id: number, petOrZhufuId: number): ThingItemData {
        let idType = GameIDUtil.getEquipIDType(id);
        if (GameIDType.INVALID == idType) {
            return null;
        }

        let equipConfig = ThingData.getThingConfig(id);
        if (null == equipConfig) {
            return null;
        }
        let hasWeared = false;
        let tempThingInfo: ThingItemData; // 准备比较的装备数据源
        let heroEquipList: { [position: number]: ThingItemData };

        if (GameIDType.PET_EQUIP == idType) {
            let pet: Protocol.NewBeautyInfo;
            if (equipConfig.m_iFunctionID > 0) {
                pet = G.DataMgr.petData.getPetInfo(equipConfig.m_iFunctionID);
            } else if (petOrZhufuId > 0) {
                pet = G.DataMgr.petData.getPetInfo(petOrZhufuId);
            }

            if (pet == null) {
                pet = G.DataMgr.petData.getFollowPet();
            }
            if (pet != null && pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                heroEquipList = this.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
                if (heroEquipList) {
                    let petConfig: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(pet.m_iBeautyID);
                    tempThingInfo = heroEquipList[petConfig.m_uiEquipPosition + (equipConfig.m_iEquipPart % KeyWord.BEAUTY_EQUIP_PARTCLASS_MIN)];
                    if (tempThingInfo) {
                        hasWeared = true;
                    }
                }
            }
        }
        else if (GameIDType.REBIRTH_EQUIP == idType) {
            let containerId = GameIDUtil.getContainerIDByEquipPart(equipConfig.m_iEquipPart);
            heroEquipList = this.getContainer(containerId);
            let equip = heroEquipList[equipConfig.m_iEquipPart % KeyWord.EQUIP_PARTCLASS_MIN];
            if (equip) {
                // 相同部位
                hasWeared = true;
                tempThingInfo = new ThingItemData();
                tempThingInfo.config = equip.config;
            }
        }
        // else {
        //     let containerId = GameIDUtil.getContainerIDByEquipPart(equipConfig.m_iEquipPart);
        //     heroEquipList = this.getContainer(containerId);
        //     if (heroEquipList != null) {
        //         tempThingInfo = heroEquipList[equipConfig.m_iEquipPart % KeyWord.EQUIP_PARTCLASS_MIN];
        //         if (tempThingInfo) {
        //             // 相同部位
        //             hasWeared = true;
        //         }
        //     }
        // }
        if (hasWeared) {
            return tempThingInfo;
        }

        return null;
    }

    /**
     * 检查这个装备是不是更好的装备。
     * @param thingInfo
     */
    isBetterEquip(itemData: ThingItemData): boolean {
        // 获得新装备，计算其战斗力
        let thingInfo = itemData.data;
        let equipConfig = itemData.config;
        // 检查物品是否可用
        if (!G.ActionHandler.canUse(equipConfig, thingInfo, false)) {
            return false;
        }
        //物品当前战斗力
        let curfight = FightingStrengthUtil.getStrengthByEquip(equipConfig, thingInfo.m_stThingProperty.m_stSpecThingProperty);
        //是否武缘装备
        if (KeyWord.ITEM_FUNCTION_BEAUTY_EQUIPID == equipConfig.m_ucFunctionType) {
            //新加装备，比较所有伙伴
            if ((equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BINHUN || equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BRACELET) && equipConfig.m_iFunctionID == 0) {
                //兵魂，手环，且关联伙伴==0，遍历
                return G.DataMgr.petData.isBetterThanAllPetEquip(equipConfig, curfight);
            } else if (G.DataMgr.petData.isEquipCanTakeOn(equipConfig.m_ucRequiredLevel)) {//遍历是否有伙伴可以穿戴
                //遍历是否是更好的
                return G.DataMgr.petData.isBetterThanAllPetEquip(equipConfig, curfight);
            }
        }

        if (GameIDUtil.isOtherEquipID(thingInfo.m_iThingID)) {
            return this.isBetterOtherEquipInContainer(itemData, ThingData.getContainerByEquip(thingInfo.m_iThingID))
                && this.isBetterOtherEquipInContainer(itemData, Macros.CONTAINER_TYPE_ROLE_BAG);
        }
        else {
            return this.isBetterEquipInContainer(itemData, ThingData.getContainerByEquip(thingInfo.m_iThingID)) && this.isBetterEquipInContainer(itemData, Macros.CONTAINER_TYPE_ROLE_BAG);
        }
    }

    getNonWearedRoleEquips(): { [part: number]: ThingItemData } {
        let co = this.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        let equipCtn = this.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        let equipMap: { [part: number]: ThingItemData } = {};
        for (let positionKey in co) {
            let obj = co[positionKey];

            if (GameIDUtil.isRoleEquipID(obj.config.m_iID)) {
                let part = obj.config.m_iEquipPart;
                let pos: number = ThingData.getIndexByEquipPart(part);
                if (null == equipCtn[pos]) {
                    let old = equipMap[part];
                    if (null == old || old.zdl < obj.zdl) {
                        equipMap[part] = obj;
                    }
                }
            }
        }

        return equipMap;
    }

    getAuctionClassData(class1: number, class2: number): GameConfig.ThingConfigM[] {
        if (this.m_auctionClassDataMap[class1] == null) return;
        return this.m_auctionClassDataMap[class1][class2];
    }
}

export class ContainerChangeReason {
    reason: number = 0;

    bagPos: number = 0;

    equipPos: number = 0;

    reset(): void {
        this.reason = 0;
        this.bagPos = -1;
        this.equipPos = -1;
    }
}
export default ThingData;