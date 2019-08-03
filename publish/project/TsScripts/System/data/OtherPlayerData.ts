import { ThingItemData } from 'System/data/thing/ThingItemData'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { GuidUtil } from 'System/utils/GuidUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ThingData } from 'System/data/thing/ThingData'
import { EnumEquipRule } from 'System/data/thing/EnumEquipRule'

export class OtherPlayerData {
    /**后台回复的玩家总信息体*/
    private m_roleInfoResponse: Protocol.Friend_RoleInfo_Response;

    /**祝福面板信息配置*/
    private m_zhufuData: { [type: number]: Protocol.CSHeroSubSuper };

    /**角色装备数据*/
    private m_equipData: { [position: number]: ThingItemData };
    /**魂骨数据*/
    private m_hunguData: { [position: number]: ThingItemData };

    /**祝福装备数据*/
    private m_zfEquipData: { [type: number]: { [position: number]: ThingItemData } };

    private m_colorList: { [color: string]: number } = {};
    otherFight:number;
    /**
     * 构造函数
     * @param dispatcher
     *
     */

    set roleByRes(res: Protocol.Friend_RoleInfo_Response) {
        this.m_roleInfoResponse = res;
        if (res != null) {
            this._setZhufuData();
            this._setHeroEquipData(this.heroEquipList.m_astThingInfo);
            this._setHunGuEquipData(this.heroHuguList.m_astThingObj);
            this._setZfEquipData();
        }
    }

    setRank(res: Protocol.ExtraRoleInfo): void {
        this.otherFight = res.m_uiFightVal;
    }

    private _setZhufuData(): void {
        if (this.m_zhufuData == null) {
            this.m_zhufuData = {};
        }
        let data: Protocol.CSHeroSubList = this.zhufuInfo;
        for (let one of data.m_stModuleList) {
            this.m_zhufuData[one.m_ucType] = one.m_stSuperInfo;
        }
    }

    private _setHeroEquipData(dataList: Protocol.ContainerThingInfo[]): void {
        if (this.m_equipData == null) {
            this.m_equipData = {};
        }

        let itemData: ThingItemData;
        for (let positionKey in this.m_equipData) {
            this.m_equipData[positionKey].reset();
        }

        for (let one of dataList) {
            itemData = this.m_equipData[one.m_usPosition];
            if (itemData == null) {
                itemData = new ThingItemData();
            }
            itemData.config = ThingData.getThingConfig(one.m_iThingID);
            itemData.data = one;
            this.m_equipData[one.m_usPosition] = itemData;
        }

        let pink: number = 0;
        let red: number = 0;
        let gold: number = 0;
        let orange: number = 0;

        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            itemData = this.m_equipData[i];
            if (itemData == null || itemData.config == null)
                continue;

            if (itemData.config.m_ucColor == KeyWord.COLOR_PINK) {
                pink++;
                red++;
                gold++;
                orange++;
            }

            if (itemData.config.m_ucColor == KeyWord.COLOR_RED) {
                red++;
                gold++;
                orange++;
            }
            else if (itemData.config.m_ucColor == KeyWord.COLOR_GOLD) {
                gold++;
                orange++;
            }
            else if (itemData.config.m_ucColor == KeyWord.COLOR_ORANGE) {
                orange++;
            }
        }

        this.m_colorList[KeyWord.COLOR_PINK] = pink;
        this.m_colorList[KeyWord.COLOR_RED] = red;
        this.m_colorList[KeyWord.COLOR_GOLD] = gold;
        this.m_colorList[KeyWord.COLOR_ORANGE] = orange;
    }
    private _setHunGuEquipData(dataList: Protocol.ContainerThingInfo[]): void {
        if (this.m_hunguData == null) {
            this.m_hunguData = {};
        }

        let itemData: ThingItemData;
        for (let positionKey in this.m_hunguData) {
            this.m_hunguData[positionKey].reset();
        }

        for (let one of dataList) {
            itemData = this.m_hunguData[one.m_usPosition];
            if (itemData == null) {
                itemData = new ThingItemData();
            }
            itemData.config = ThingData.getThingConfig(one.m_iThingID);
            itemData.data = one;
            this.m_hunguData[itemData.config.m_iEquipPart%10] = itemData;
        }
    }

    getEquipSuitsCount(color: number): number {
        return this.m_colorList[color];
    }

    private _setZfEquipData(): void {
        if (this.m_zfEquipData == null) {
            this.m_zfEquipData = {};
        }

        let data: Protocol.HeroSubContainerList = this.zhufuEquipList;
        for (let list of data.m_stList) {
            if (this.m_zfEquipData[list.m_ucType] == null) {
                this.m_zfEquipData[list.m_ucType] = {};
            }        
            if (list.m_astThingInfo != null) {

                for (let one of list.m_astThingInfo) {
                    let itemData: ThingItemData = this.m_zfEquipData[list.m_ucType][one.m_usPosition];
                    if (itemData == null) {
                        itemData = new ThingItemData();
                    }
                    itemData.config = ThingData.getThingConfig(one.m_iThingID);
                    itemData.data = one;
                    this.m_zfEquipData[list.m_ucType][one.m_usPosition] = itemData;
                }
            }
           
        }
    }

    get skillList(): Protocol.SkillList {
        return this.m_roleInfoResponse.m_stCacheRoleInfo.m_stSkillList;
    }

    /**
     * 获得祝福信息
     *
     */
    get zhufuData(): { [type: number]: Protocol.CSHeroSubSuper } {
        return this.m_zhufuData;
    }

    /**
     * 获得角色装备数据
     * @return
     *
     */
    get equipData(): { [position: number]: ThingItemData } {
        return this.m_equipData;
    }
    /**
     * 获得角色魂骨数据
     * @returns {} 
     */
    get hunguData(): { [position: number]: ThingItemData } {
        return this.m_hunguData;
    }
    /**
     * 获得祝福装备数据
     * @return
     *
     */
    get zfEquipData(): { [type: number]: { [position: number]: ThingItemData } } {
        return this.m_zfEquipData;
    }

    /**
     * 获取综合信息
     * @return
     *
     */
    get cacheRoleInfo(): Protocol.CacheRoleInfo {
        if (this.m_roleInfoResponse == null) {
            return null;
        }

        return this.m_roleInfoResponse.m_stCacheRoleInfo;
    }

    get roleBaseInfo(): Protocol.RoleInfo {
        return this.cacheRoleInfo.m_stRoleInfo;
    }

    /**
     * 获取PK信息
     * @return
     *
     */
    get pkInfo(): Protocol.PKInfo {
        return this.cacheRoleInfo.m_stPKInfo;
    }

    /**
     * 获取宗门信息
     * @return
     *
     */
    get guildInfo(): Protocol.GuildInfo {
        return this.cacheRoleInfo.m_stGuildInfo;
    }

    /**
     * 获取装备信息
     * @return
     *
     */
    get heroEquipList(): Protocol.EquipContainerThingInfoList {
        return this.cacheRoleInfo.m_stThingInfoList;
    }
    /**
     * 获取魂骨信息
     * @return
     *
     */
    get heroHuguList(): Protocol.EquipHunGuContainerThingInfoList {
        return this.cacheRoleInfo.m_stHunGuThingObjList;
    }
    /**
     * 获取祝福面板基本信息
     * @return
     *
     */
    get zhufuInfo(): Protocol.CSHeroSubList {
        return this.cacheRoleInfo.m_stCSHeroSubList;
    }

    /**
     *  获取祝福面板装备信息
     * @return
     *
     */
    get zhufuEquipList(): Protocol.HeroSubContainerList {
        return this.cacheRoleInfo.m_stHeroSubContainerList;
    }

    /**
     * 获取角色属性值
     * @return
     *
     */
    get attributeList(): Protocol.UnitAttribute {
        return this.roleBaseInfo.m_stUnitInfo.m_stUnitAttribute;
    }

    /**
     * 是否为其他玩家
     * @return
     *
     */
    get isOtherPlayer(): boolean {
        return this.m_roleInfoResponse != null;
    }

    isOthersEquip(id: number, guid: Protocol.ThingGUID): boolean {
        if (this.cacheRoleInfo == null) {
            return false;
        }

        let temp: Protocol.ContainerThingInfo;
        if (GameIDUtil.isRoleEquipID(id)) {
            for (temp of this.cacheRoleInfo.m_stThingInfoList.m_astThingInfo) {
                if (GuidUtil.isGuidEqual(guid, temp.m_stThingProperty.m_stGUID)) {
                    return true;
                }
            }
        }
        else if (GameIDUtil.isOtherEquipID(id)) {
            for (let clist of this.cacheRoleInfo.m_stHeroSubContainerList.m_stList) {
                for (temp of clist.m_astThingInfo) {
                    if (GuidUtil.isGuidEqual(guid, temp.m_stThingProperty.m_stGUID)) {
                        return true;
                    }
                }
            }
        }
        else if (GameIDUtil.isHunguEquipID(id)) {
            for (temp of this.cacheRoleInfo.m_stHunGuThingObjList.m_astThingObj) {
                if (GuidUtil.isGuidEqual(guid, temp.m_stThingProperty.m_stGUID)) {
                    return true;
                }
            }
        }
        return false;
    }
}
