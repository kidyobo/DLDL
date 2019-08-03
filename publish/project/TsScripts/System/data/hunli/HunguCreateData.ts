import { Global as G } from "System/global";
import { GameIDType } from "../../constants/GameEnum";
import { KeyWord } from "../../constants/KeyWord";
import { HunguCreatePanel } from "../../hungu/HunguCreatePanel";
import { ItemMergeView } from "../../Merge/ItemMergeView";
import { Macros } from "../../protocol/Macros";
import { ProtocolUtil } from "../../protocol/ProtocolUtil";
import { ThingItemData } from "../thing/ThingItemData";

export class HunguCreateData {

    private hunguMergeMapById: { [id: number]: GameConfig.HunGuMergeM } = {};
    private hunguMergeMap: { [part: number]: { [drop: number]: { [color: number]: GameConfig.HunGuMergeM } } } = {};
    private hunguMergeData: GameConfig.HunGuMergeM[] = [];
    private hunguMergeGroupData: { [prop: number]: GameConfig.HunGuMergeM[] } = {};
    private hunguFirstGroupDatas: number[] = [];
    private hunguCanFirstGroupDatas: number[] = [];
    private minDropLevel: number = KeyWord.HUNGU_DROP_LEVEL_MAX;
    private maxDropLevel: number = KeyWord.HUNGU_DROP_LEVEL_MIN;


    curMergeEquipDatas: ThingItemData[] = [];
    curMergeMaterialDatas: ThingItemData[] = [];

    mergeEquipMaxNumber: number = 2;
    mergeMaterialMaxNumber: number = 8;

    isShowMergeMessage: boolean = false;
    isShowMergeProfMessage: boolean = false;

    onCfgReady() {
        this.setHunguMergeData();
    }

    ////////////////////////本地数据初始化//////////////////////////////////
    /**
     * 魂骨升华表 数据
     */
    private setHunguMergeData(): void {
        let data: GameConfig.HunGuCreateM[] = G.Cfgmgr.getCfg('data/HunGuCreateM.json') as GameConfig.HunGuCreateM[];

        for (let equipData of data) {
            this.hunguMergeData.push(equipData);
            //装备位 + 掉落档次(年代) + 颜色(品质) + 星级
            let part = equipData.m_ucEquipPart;
            let drop = equipData.m_ucTargetQuality;
            let color = equipData.m_ucTargetColour;
            if (this.hunguMergeMap[part] == null) {
                this.hunguMergeMap[part] = {};
            }
            if (this.hunguMergeMap[part][drop] == null) {
                this.hunguMergeMap[part][drop] = {};
            }
            this.hunguMergeMap[part][drop][color] = equipData;
            this.hunguMergeMapById[equipData.m_iID] = equipData;

            if (this.hunguMergeGroupData[drop] == null) {
                this.hunguMergeGroupData[drop] = [];
                this.hunguFirstGroupDatas.push(drop);
            }
            this.hunguMergeGroupData[drop].push(equipData);
            if (equipData.m_ucTargetQuality < this.minDropLevel)
                this.minDropLevel = equipData.m_ucTargetQuality;
            if (equipData.m_ucTargetQuality > this.maxDropLevel)
                this.maxDropLevel = equipData.m_ucTargetQuality;
        }
        this.hunguMergeData.sort((a: GameConfig.HunGuMergeM, b: GameConfig.HunGuMergeM): number => {
            return a.m_iID - b.m_iID;
        });

        for (var key in this.hunguMergeGroupData) {
            let data = this.hunguMergeGroupData[key];
            data.sort((a: GameConfig.HunGuMergeM, b: GameConfig.HunGuMergeM): number => {
                return a.m_ucEquipPart - b.m_ucEquipPart;
            });
        }
        this.hunguFirstGroupDatas.sort((a: number, b: number): number => {
            return a - b;
        });
    }

    /////////////////////////////////状态变化///////////////////////////////////////////
    /**
     * 魂骨升华响应（服务器）
     * @param msg 服务器数据
     */
    public onHunguMergeResponse(msg: Protocol.HunGuMerge_Response) {
        let hunguMergePanel = G.Uimgr.getSubFormByID(ItemMergeView, KeyWord.OTHER_FUNCTION_HUNGUN_CREATE) as HunguCreatePanel;
        if (hunguMergePanel != null && hunguMergePanel.isOpened) {
            if (msg.m_ushResultID == 0) {
                //失败
                hunguMergePanel.mergeDefeatedResponse();
            }
            else if (msg.m_ushResultID == 1) {
                //成功
                hunguMergePanel.mergeSuccendResponse();
            }
        }
    }

    public sendMergeRequest(id: number) {
        let count = this.getOneMergeDataById(id).m_stMaterial.length;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunguCreateRequest(id, this.getMergeRequestInfo(count)));
    }

    ///////////////////////////////////处理数据/////////////////////////////////////////////

    public getOneMergeDataById(id: number) {
        return this.hunguMergeMapById[id];
    }

    public getAllMergeGroupData(): { [prop: number]: GameConfig.HunGuMergeM[] } {
        return this.hunguMergeGroupData;
    }

    public getCanMergeGroupData(): { [prop: number]: GameConfig.HunGuMergeM[] } {
        this.hunguCanFirstGroupDatas = [];
        //只筛选魂骨的数量，有两件就可以升华（同年代）
        let canMerge: { [prop: number]: GameConfig.HunGuMergeM[] } = null;
        for (let i = 0, con = this.hunguMergeData.length; i < con; i++) {
            if (this.isHaveMergeEquip(this.hunguMergeData[i].m_iID)) {
                if (canMerge == null)
                    canMerge = {};
                if (canMerge[this.hunguMergeData[i].m_ucTargetQuality] == null) {
                    this.hunguCanFirstGroupDatas.push(this.hunguMergeData[i].m_ucTargetQuality);
                    canMerge[this.hunguMergeData[i].m_ucTargetQuality] = [];
                }
                canMerge[this.hunguMergeData[i].m_ucTargetQuality].push(this.hunguMergeData[i]);

            }
        }
        if (canMerge) {
            //排序
            for (var key in canMerge) {
                let data = canMerge[key];
                data.sort((a: GameConfig.HunGuMergeM, b: GameConfig.HunGuMergeM): number => {
                    return a.m_ucEquipPart - b.m_ucEquipPart;
                });
            }
        }
        return canMerge;
    }

    public getGroupAllFirstDatas() {
        return this.hunguFirstGroupDatas;
    }

    public getGroupCanFirstDatas() {
        this.hunguCanFirstGroupDatas.sort((a: number, b: number): number => {
            return a - b;
        });
        return this.hunguCanFirstGroupDatas;
    }

    private canAddMaterials: ThingItemData[] = [];

    /**
     *  获取可以添加的信息
     * @param count 材料数量
     */
    public getCanAddEquip(id: number): ThingItemData[] {
        this.canAddMaterials = [];
        let data = this.getOneMergeDataById(id);
        let hunguEquips = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        for (let i = 0, con = hunguEquips.length; i < con; i++) {
            let item = hunguEquips[i];
            if (item.config.m_iDropLevel != data.m_stMaterial[0].m_iQuality || item.config.m_ucColor != data.m_stMaterial[0].m_iColour) continue;

            this.canAddMaterials.push(item);
        }
        this.canAddMaterials.sort((a: ThingItemData, b: ThingItemData) => {
            return b.zdl - a.zdl;
        });
        return this.canAddMaterials;
    }


    /**是否有装备可以升华(升华页签的红点) */
    public isEquipMerge(): boolean {
        for (let i = 0, con = this.hunguMergeData.length; i < con; i++) {
            if (this.isHaveMergeEquip(this.hunguMergeData[i].m_iID))
                return true;
        }
        return false;
    }

    /**
     * 是否有可升华的魂骨
     * @param id 
     */
    public isHaveMergeEquip(id: number): boolean {
        let data = this.getOneMergeDataById(id);
        let item = data.m_stMaterial[0];
        let num = this.getHunguEquipNumber(item.m_iQuality, item.m_iColour);
        if (num >= data.m_stMaterial.length) {
            return true;
        }
        return false
    }

    private getHunguEquipNumber(drop: number, color: number) {
        let num: number = 0;
        let hunguEquips = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        for (let i = 0, con = hunguEquips.length; i < con; i++) {
            let equipCfg = hunguEquips[i];
            if (drop == equipCfg.config.m_iDropLevel && color == equipCfg.config.m_ucColor) {
                num++;
            }
        }
        return num;
    }

    /**
     * 一个年代是否有可合成的
     * @param drop
     */
    public isOneQualityMerge(drop: number): boolean {
        let data = this.getAllMergeGroupData()[drop];
        if (data != null) {
            let con = data.length;
            for (let i = 0; i < con; i++) {
                if (this.isHaveMergeEquip(data[i].m_iID))
                    return true;
            }
        }
        return false;
    }

    /**
     * 获取发送协议的数据
     */
    public getMergeRequestInfo(count: number): Protocol.SimpleContainerThingObjList {
        let info = {} as Protocol.SimpleContainerThingObjList;
        info.m_astSimpleContainerThingInfo = [];
        for (let i = 0; i < count; i++) {
            info.m_astSimpleContainerThingInfo[i] = {} as Protocol.SimpleContainerThingInfo;
            let item = info.m_astSimpleContainerThingInfo[i];
            if (this.canAddMaterials[i] != null) {
                item.m_iNumber = this.canAddMaterials[i].data.m_iNumber;
                item.m_iThingID = this.canAddMaterials[i].data.m_iThingID;
                item.m_usPosition = this.canAddMaterials[i].data.m_usPosition;
            }
        }
        info.m_iThingNumber = count;
        return info;
    }
}