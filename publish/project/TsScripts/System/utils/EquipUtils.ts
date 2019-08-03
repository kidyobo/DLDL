import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { ThingData } from 'System/data/thing/ThingData'
import { InsertDiamondItemData } from 'System/equip/InsertDiamondItemData'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { PropInfoVo } from 'System/data/vo/PropInfoVo'
import { GameIDUtil } from 'System/utils/GameIDUtil'

export class EquipUtils {
    static All_EQUIP_NUM: number = 8;
    static DiamondMaxLv: number = 10;
    /**宝石孔的开放条件 -魂力等级*/
    static SLOT_OPEN_LEVEL: number[] = [
        1,
        2,
        4,
        6,
        8,
        9
    ];
    static UPLEVEL_COLOR: number[] = [
        KeyWord.COLOR_ORANGE,
        KeyWord.COLOR_GOLD,
        KeyWord.COLOR_RED,
        KeyWord.COLOR_PINK
    ];
    static EQUIP_LEVEL_NAME: string[] = ['一阶', '二阶', '三阶', '四阶', '五阶', '六阶', '七阶', '八阶', '九阶', '十阶', '十一阶', '十二阶'];
    static SLOT_OPEN_LEVEL_NAME: string[] = ['灵器', '灵器', '宝器', '宝器', '通灵', '通灵'];
    static ZHUFU_EQUIP_TAOZHUANG_NAME: string[] = ['', '', '紫装', '神装', '超神', '武极', '天下'];
    static PET_EQUIP_TAOZHUANG: string[] = ['4星', '7星', '10星', '13星'];
    static SLOT_OPEN_LEVEL_NAME2: { [key: number]: string } = null;
    static SLOT_OPEN_COLOR_NAME: { [key: number]: string } = null;
    /**({0}   +{1}% 强化+{2}奖励加成)*/
    static LANG_1: string = '({0}   +{1}% 强化+{2}奖励加成)';
    private static m_colorList: { [key: number]: string } = {};

    static getOpenLvName(grade: number) {
        if (null == EquipUtils.SLOT_OPEN_LEVEL_NAME2) {
            EquipUtils.SLOT_OPEN_LEVEL_NAME2 = {};
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_1] = '一阶套装';
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_2] = '二阶套装';
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_3] = '三阶套装';
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_4] = '四阶套装';
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_5] = '五阶套装';
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_6] = '六阶套装';
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_7] = '七阶套装';
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_8] = '八阶套装';
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_9] = '九阶套装';
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_10] = '十阶套装';
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_11] = '十一阶套装';
            EquipUtils.SLOT_OPEN_LEVEL_NAME2[KeyWord.EQUIP_STAGE_12] = '十二阶套装';
        }
        return EquipUtils.SLOT_OPEN_LEVEL_NAME2[grade];
    }


    static getColorName(grade: number): string {
        if (null == EquipUtils.SLOT_OPEN_COLOR_NAME) {
            EquipUtils.SLOT_OPEN_COLOR_NAME = {};
            EquipUtils.SLOT_OPEN_COLOR_NAME[KeyWord.COLOR_BLUE] = '蓝色';
            EquipUtils.SLOT_OPEN_COLOR_NAME[KeyWord.COLOR_GOLD] = '金色';
            EquipUtils.SLOT_OPEN_COLOR_NAME[KeyWord.COLOR_GREEN] = '绿色';
            EquipUtils.SLOT_OPEN_COLOR_NAME[KeyWord.COLOR_ORANGE] = '橙色';
            EquipUtils.SLOT_OPEN_COLOR_NAME[KeyWord.COLOR_PINK] = '粉色';
            EquipUtils.SLOT_OPEN_COLOR_NAME[KeyWord.COLOR_PURPLE] = '紫色';
            EquipUtils.SLOT_OPEN_COLOR_NAME[KeyWord.COLOR_RED] = '红色';
            EquipUtils.SLOT_OPEN_COLOR_NAME[KeyWord.COLOR_WHITE] = '白色';
        }
        return EquipUtils.SLOT_OPEN_COLOR_NAME[grade];
    }


    /**装备收集品质*/
    static EQUIP_COLLECT_TITLE_ALL: { [key: number]: number[] } = null;
    static EQUIP_COLLECT_TITLE_LIST_ALL: number[];


    static EQUIP_COLLECT_TITLE_FANQI: number[] = [KeyWord.EQUIP_STAGE_1, KeyWord.EQUIP_STAGE_2];
    static EQUIP_COLLECT_TITLE_LINGQI: number[] = [KeyWord.EQUIP_STAGE_3, KeyWord.EQUIP_STAGE_4];
    static EQUIP_COLLECT_TITLE_FABAO: number[] = [KeyWord.EQUIP_STAGE_5, KeyWord.EQUIP_STAGE_6, KeyWord.EQUIP_STAGE_7];
    static EQUIP_COLLECT_TITLE_TONGLING: number[] = [KeyWord.EQUIP_STAGE_8, KeyWord.EQUIP_STAGE_9, KeyWord.EQUIP_STAGE_10];
    static EQUIP_COLLECT_TITLE_XUANLING: number[] = [KeyWord.EQUIP_STAGE_11, KeyWord.EQUIP_STAGE_12];

    static EQUIP_COLLECT_TITLE_ARRAY = [EquipUtils.EQUIP_COLLECT_TITLE_FANQI, EquipUtils.EQUIP_COLLECT_TITLE_LINGQI,
    EquipUtils.EQUIP_COLLECT_TITLE_FABAO, EquipUtils.EQUIP_COLLECT_TITLE_TONGLING, EquipUtils.EQUIP_COLLECT_TITLE_XUANLING
    ]

    /**
     * 获取装备类型
     * @param index
     */
    static getEquipCollectName(index: number) {
        if (null == EquipUtils.EQUIP_COLLECT_TITLE_ALL) {
            EquipUtils.EQUIP_COLLECT_TITLE_ALL = {};
            EquipUtils.EQUIP_COLLECT_TITLE_ALL[0] = EquipUtils.EQUIP_COLLECT_TITLE_FANQI;
            EquipUtils.EQUIP_COLLECT_TITLE_ALL[1] = EquipUtils.EQUIP_COLLECT_TITLE_LINGQI;
            EquipUtils.EQUIP_COLLECT_TITLE_ALL[2] = EquipUtils.EQUIP_COLLECT_TITLE_FABAO;
            EquipUtils.EQUIP_COLLECT_TITLE_ALL[3] = EquipUtils.EQUIP_COLLECT_TITLE_TONGLING;
            EquipUtils.EQUIP_COLLECT_TITLE_ALL[4] = EquipUtils.EQUIP_COLLECT_TITLE_XUANLING;
        }
        return EquipUtils.EQUIP_COLLECT_TITLE_ALL[index];
    }

    /**获取装备数量 */
    static getEquipCountForList() {
        if (null == EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL) {
            this.InitListDate();
        }
        return EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL.length;
    }

    /**
     * 获取装备类型 从list里边
     * @param index
     */
    static getEquipCollectNameForList(index: number) {
        if (null == EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL) {
            this.InitListDate();
        }
        return EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[index];
    }

    private static InitListDate() {
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL = [];

        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[0] = KeyWord.EQUIP_STAGE_1;
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[1] = KeyWord.EQUIP_STAGE_2;
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[2] = KeyWord.EQUIP_STAGE_3;
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[3] = KeyWord.EQUIP_STAGE_4;
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[4] = KeyWord.EQUIP_STAGE_5;
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[5] = KeyWord.EQUIP_STAGE_6;
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[6] = KeyWord.EQUIP_STAGE_7;
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[7] = KeyWord.EQUIP_STAGE_8;
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[8] = KeyWord.EQUIP_STAGE_9;
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[9] = KeyWord.EQUIP_STAGE_10;
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[10] = KeyWord.EQUIP_STAGE_11;
        EquipUtils.EQUIP_COLLECT_TITLE_LIST_ALL[11] = KeyWord.EQUIP_STAGE_12;
    }


    /**
     * 装备收集列表索引
     * @param keyword
     */
    static getEquipCollectIndexByKeyWord(keyword: number): number[] {
        let indexs: number[] = [];
        for (let key in EquipUtils.EQUIP_COLLECT_TITLE_ALL) {
            if (EquipUtils.EQUIP_COLLECT_TITLE_ALL[key].indexOf(keyword) >= 0) {
                indexs.push(parseInt(key));
                indexs.push(EquipUtils.EQUIP_COLLECT_TITLE_ALL[key].indexOf(keyword));
                return indexs;
            }
        }
        return [0, 0];
    }

    static getEquipCollectColorByType(stage: number): number {
        if (stage == KeyWord.EQUIP_STAGE_1) {
            return KeyWord.COLOR_BLUE;
        } else if (stage == KeyWord.EQUIP_STAGE_2) {
            return KeyWord.COLOR_PURPLE;
        } else if (stage == KeyWord.EQUIP_STAGE_3 || stage == KeyWord.EQUIP_STAGE_4) {
            return KeyWord.COLOR_ORANGE;
        } else if (stage == KeyWord.EQUIP_STAGE_5 || stage == KeyWord.EQUIP_STAGE_6 || stage == KeyWord.EQUIP_STAGE_7) {
            return KeyWord.COLOR_GOLD;
        } else if (stage == KeyWord.EQUIP_STAGE_8 || stage == KeyWord.EQUIP_STAGE_9 || stage == KeyWord.EQUIP_STAGE_10) {
            return KeyWord.COLOR_RED;
        } else if (stage == KeyWord.EQUIP_STAGE_11 || stage == KeyWord.EQUIP_STAGE_12) {
            return KeyWord.COLOR_PINK;
        }
    }

    /**
     * 拼接时装dressid
     * @param dressId
     */
    static subStringEquipCollectDressImgId(dressId: number): number {
        let str = dressId.toString() + G.DataMgr.heroData.profession.toString() + G.DataMgr.heroData.gender.toString();
        return parseInt(str);
    }


    /** 计算宝石的等级 */
    static getDiamondLevel(id: number): number {
        return Math.floor(id / 10) % 100;
    }

    static getUpLevelFight(numComplete: number, stage: number): number {
        let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(stage);
        let fight: number = 0;
        let specialPriAddPct = G.DataMgr.vipData.getSpecialPriRealPct(KeyWord.SPECPRI_EQUIPSUIT_ADD);
        for (let i: number = colorList.length - 1; i >= 0; i--) {
            if (numComplete >= colorList[i].m_ucNum) {
                let propAtt = colorList[i].m_astPropAtt;
                for (let j = 0; j < propAtt.length; j++) {
                    let propValue = propAtt[j].m_ucPropValue + Math.floor(propAtt[j].m_ucPropValue * specialPriAddPct);
                    fight += FightingStrengthUtil.calStrengthByOneProp(propAtt[j].m_ucPropId, propValue);
                }
                break;
            }
        }
        return fight;
    }

    static getNextUpLevelEquipId(equipCfg: GameConfig.ThingConfigM): number {
        let value = (Math.floor(equipCfg.m_iID / 1000) + 1) * 1000 + (equipCfg.m_iID % 1000);
        return value;

        //let cfg: GameConfig.EquipStageConditionM = G.DataMgr.equipStrengthenData.getEquipStageConditionCfg(equipCfg.m_iEquipPart);
        //let nextEquipId: number = Math.floor(equipCfg.m_iID / 1000);
        //let level: number = EquipStrengthenData.getEquipLevel(equipCfg.m_iID);
        //let color: number = equipCfg.m_ucColor;
        //if (color == KeyWord.COLOR_PURPLE && level < cfg.m_iLevelUpID1) {
        //    return (nextEquipId * 100 + cfg.m_iLevelUpID1) * 10;
        //}
        //else if (color == KeyWord.COLOR_ORANGE && level < cfg.m_iLevelUpID2) {
        //    return (nextEquipId * 100 + cfg.m_iLevelUpID2) * 10;
        //}
        //else if (color == KeyWord.COLOR_GOLD && level < cfg.m_iLevelUpID3) {
        //    return (nextEquipId * 100 + cfg.m_iLevelUpID3) * 10;
        //}
        //else if (color == KeyWord.COLOR_RED && level < cfg.m_iLevelUpID4) {
        //    return (nextEquipId * 100 + cfg.m_iLevelUpID4) * 10;
        //}
        //  return equipCfg.m_iID;
    }



    static getSetsEffectName(color: number): string {
        if (EquipUtils.m_colorList[color])
            return EquipUtils.m_colorList[color];
        let name: string = '';
        let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetsConfig();
        let item: GameConfig.EquipAllColorPropM = colorList[colorList.length - 1];
        //if (color == KeyWord.COLOR_ORANGE)
        //    name = item.m_iOrangeModeId > 0 ? item.m_iOrangeModeId.toString() : '';
        //if (color == KeyWord.COLOR_GOLD)
        //    name = item.m_iGoldModeId > 0 ? item.m_iGoldModeId.toString() : '';
        //if (color == KeyWord.COLOR_RED)
        //    name = item.m_iRedModeId > 0 ? item.m_iRedModeId.toString() : '';
        //if (color == KeyWord.COLOR_PINK)
        //    name = item.m_iPinkModeId > 0 ? item.m_iPinkModeId.toString() : '';
        //name = (name == '' || name == '0') ? '' : name;
        EquipUtils.m_colorList[color] = name;
        return name;
    }

    /**
     *基础属性+装备位属性
     * @param value
     * @param level	-1 表示使用默认的等级
     * @return
     *
     */
    static getAddStrentPorpValue(config: GameConfig.ThingConfigM, index: number): number {
        //if (value == null)
        //    return 0;
        //if (level == -1)
        //    level = EquipStrengthenData.EQUIP_BASEPROP_LEVEL;
        //return Math.floor(value.m_ucPropValue * level / EquipStrengthenData.EQUIP_BASEPROP_LEVEL);
        let baseValue = config.m_astBaseProp[index].m_ucPropValue;
        if (!GameIDUtil.isRoleEquipID(config.m_iID)) {
            return baseValue;
        }
        //装备位等级
        let equipPartLv = EquipUtils.getEquipSlotLvByEquipPart(config.m_iEquipPart);
        if (equipPartLv == 0) {
            return baseValue;
        } else {
            //装备基础属性+装备位
            return baseValue + G.DataMgr.equipStrengthenData.getEquipSlotConfigByPartAndLv(config.m_iEquipPart, equipPartLv).m_astPropAtt[index].m_ucPropValue;
        }
    }

    /**
     * 拆除宝石 
     * @param data
     * 
     */
    static diamondPullout(data: InsertDiamondItemData): void {
        if (data && data.id != 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDiamondPulloutRequest(data.containerID, data.pos, data.slot));
        }
    }

    /**
     * 宝石列表排序 
     * @param diamondList
     * 
     */
    static diamondListSort(diamondList: ThingItemData[]): void {
        if (diamondList && diamondList.length > 1) {
            diamondList.sort(this._onSort);
        }
    }

    private static _onSort(d1: ThingItemData, d2: ThingItemData): number {
        let l1: number = EquipUtils.getDiamondLevel(d1.config.m_iID);
        let l2: number = EquipUtils.getDiamondLevel(d2.config.m_iID);
        if (l1 != l2)
            return l2 - l1;
        return d1.config.m_iSubClass - d2.config.m_iSubClass;
    }

    /**
     * 判断装备是否是角色装备
     * @param	part
     * @return
     */
    static isRoleEquip(part: number): boolean {
        return part > KeyWord.EQUIP_PARTCLASS_MIN && part < KeyWord.EQUIP_PARTCLASS_MAX;
    }

    static getEquipIdxByPart(equipPart: number): number {
        if (equipPart >= KeyWord.EQUIP_PARTCLASS_MIN && equipPart <= KeyWord.EQUIP_PARTCLASS_MAX) {
            return equipPart % KeyWord.EQUIP_PARTCLASS_MIN;
        }

        if (equipPart >= KeyWord.BEAUTY_EQUIP_PARTCLASS_MIN && equipPart <= KeyWord.BEAUTY_EQUIP_PARTCLASS_MAX) {
            return equipPart % KeyWord.BEAUTY_EQUIP_PARTCLASS_MIN;
        }

        if (equipPart >= KeyWord.ZHUFU_MAINCLASS_MIN && equipPart <= KeyWord.ZHUFU_MAINCLASS_MAX) {
            return equipPart % KeyWord.ZHUFU_MAINCLASS_MIN;
        }

        return 0;
    }

    /**
     * 获取特殊时装的
     * @param	currModeId
     * @return
     */
    static getDressInfo(currModeId: number): Protocol.DressOneImageInfo {
        let dressItem: Protocol.DressOneImageInfo;
        let dressInfo: Protocol.DressImageListInfo = G.DataMgr.heroData.dressList;
        for (let i: number = 0; i < dressInfo.m_ucNumber; i++) {
            dressItem = dressInfo.m_astImageList[i];
            if (dressItem.m_uiImageID == currModeId)
                return dressItem;
        }
        return null;
    }

    /**
     * 获取特殊时装的
     * @param currModeId 
     */
    static getDressInfoForId(id: number): Protocol.DressOneImageInfo {
        let dressItem: Protocol.DressOneImageInfo;
        let dressInfo: Protocol.DressImageListInfo = G.DataMgr.heroData.dressList;
        for (let i: number = 0; i < dressInfo.m_ucNumber; i++) {
            dressItem = dressInfo.m_astImageList[i];
            if (Math.floor(dressItem.m_uiImageID / 100) == id)
                return dressItem;
        }
        return null;
    }

    /**
     * 能否培养 
     * @param imageId
     * @return 
     * 
     */
    static canDressPy(dress: Protocol.DressOneImageInfo): boolean {
        if (dress != null && dress.m_uiTimeOut == 0) {
            let cfg: GameConfig.DressImageConfigM = ThingData.getDressImageConfig(dress.m_uiImageID);
            if (dress.m_uiAddNum < cfg.m_uiAddNum && G.DataMgr.thingData.getThingNum(cfg.m_iConsumeID, Macros.CONTAINER_TYPE_ROLE_BAG, false) > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * 一个赛季时装是否可以激活
     * @param id 
     * @param isModel 控制id的 false 10121  true 101
     */
    static canOnceSaijiDressActive(id: number, isModel: boolean = false): boolean {
        let value = isModel ? id : Math.floor(id / 100);
        let saijiData = G.DataMgr.zhufuData.getSaiJiCfgByImageId(value);
        if (saijiData == null) return false;
        let data = this.getDressInfoForId(value);
        if (data != null) return false;

        let has = G.DataMgr.thingData.getThingNum(saijiData.m_iSutffID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        if (has >= saijiData.m_iSutffCount)
            return true;
        return false;
    }

    /**
     * 赛季时装是否可以激活
     */
    static canSaijiDressActive(): boolean {
        let maxSaiji = G.DataMgr.zhufuData.getSaiJiMax();
        maxSaiji = Math.min(maxSaiji, 4);
        for (let i = 0; i < maxSaiji; i++) {
            let saijiData = G.DataMgr.zhufuData.getSaiJiCfg(i + 1, KeyWord.HERO_TYPE_SAIJISZ);
            if (this.canOnceSaijiDressActive(saijiData.m_iImageID, true))
                return true;
        }
        return false;
    }

    static getFirstCanDressPyInfo(): Protocol.DressOneImageInfo {
        let dressItem: Protocol.DressOneImageInfo;
        let dressInfo: Protocol.DressImageListInfo = G.DataMgr.heroData.dressList;
        for (let i: number = 0; i < dressInfo.m_ucNumber; i++) {
            dressItem = dressInfo.m_astImageList[i];
            if (EquipUtils.canDressPy(dressItem)) {
                return dressItem;
            }
        }
        return null;
    }

    /**
     *通过装备位获取装备升级的等级
     * @param equipPart
     */
    static getEquipSlotLvByEquipPart(equipPart: number) {
        let data = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(EquipUtils.getEquipIdxByPart(equipPart));
        if (data != null) {
            return data.m_iSlotLv;
        }
        return 0;
    }

    /**
    *通过装备位获取装备位套装是否激活等级
    * @param equipPart
    */
    static getEquipSlotSuitIsActive(equipPart: number, type: number) {
        let data = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(EquipUtils.getEquipIdxByPart(equipPart));
        if (data != null) {
            return data.m_ucSuitType >= type;
        }
        return false;
    }


}
export default EquipUtils;