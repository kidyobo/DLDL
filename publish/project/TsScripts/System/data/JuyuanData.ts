import { Global as G } from 'System/global'
import { PetData } from 'System/data/pet/PetData'
import { PinstanceData } from 'System/data/PinstanceData'
import { ThingData } from 'System/data/thing/ThingData'
import { ZhufuData } from 'System/data/ZhufuData'
import { EquipUtils } from 'System/utils/EquipUtils'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { Constants } from 'System/constants/Constants'
import { Color } from 'System/utils/ColorUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { PropInfoVo } from 'System/data/vo/PropInfoVo'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { StringUtil } from 'System/utils/StringUtil'
import { DataFormatter } from 'System/utils/DataFormatter'

/**
* 神力数据
* @author jesse
*
*/
export class JuyuanData {
    private m_type: number = 0;
    private m_level: number = 0;
    /** 神力数据配置表[type][level] */
    private _juYuanConfigs: { [type: number]: { [level: number]: GameConfig.JuYuanCfgM } };

    private _baseConfigs: { [id: number]: GameConfig.JuYuanCfgM };
    private _porpConfigs: { [id: number]: GameConfig.JuYuanAttrCfgM };

    selectType: number = 0;
    selectLevel: number = 0;
    /** true false表示突破状态，false 手动选择状态 */
    selectState: boolean = false;
    /** 如果为true，就要显示印章 */
    updateState: boolean = false;
    private dataList: string[] = [];
    ids: number[] = [];

    onCfgReady() {
        this.setJuYuanXiTongAttrConfigs();
        this.setJuYuanXiTongConfigs();
    }

    setId(id: number): void {
        if (id == 0)
            return;
        let cfg: GameConfig.JuYuanCfgM = this.getJuYuanCfgById(id);
        if (cfg == null)
            return;
        this.m_type = cfg.m_iType;
        this.m_level = cfg.m_iLevel;
    }

    /**
     * 更新数据
     * @param data	服务器数据
     *
     */
    update(data: Protocol.JuYuanInfo): void {
        this.ids = new Array<number>();
        this.m_type = data.m_ucType;
        this.m_level = data.m_ucLevel;
        let index: number = this.m_type == 0 ? 1 : this.m_type;
        let maxCount: number = Math.min(index + 12, 24);
        for (index = Math.max(this.m_type, 1); index <= maxCount; index++) {
            this.ids.push(index);
        }
        if (this.ids[0] < 12) {
            for (let i = 0; i < this.m_type - 1; i++) {
                this.ids[i + (14 - this.m_type)] = this.ids[0] - (this.m_type - 1 - i);
            }
        } else {
            for (let i = 0; i < this.m_type - 12; i++) {
                this.ids[i + (25 - this.m_type)] = (this.ids[0] - (this.m_type - 12 - i));
            }
        }
    }

    /** 是否已经满等级 */
    isFullLevel(tips: boolean = false): boolean {
        if (this.m_type >= Macros.MAX_JUYUAN_TYPE /*&& this.m_level >= Macros.MAX_JUYUAN_LEVEL*/) {
            if (tips) {
                G.TipMgr.addMainFloatTip('已经大圆满，无法继续突破');
            }
            return true;
        }
        return false;
    }

    /** 是否没有升级 */
    isNoLevel(): boolean {
        return this.m_type == 0 /*&& this.m_level == 0*/;
    }

    private setJuYuanXiTongConfigs(): void {
        let configs: GameConfig.JuYuanCfgM[] = G.Cfgmgr.getCfg('data/JuYuanCfgM.json') as GameConfig.JuYuanCfgM[];
        this._baseConfigs = {};
        this._juYuanConfigs = {};
        for (let config of configs) {
            if (!this._juYuanConfigs[config.m_iType])
                this._juYuanConfigs[config.m_iType] = {};
            this._juYuanConfigs[config.m_iType][config.m_iLevel] = config;
            this._baseConfigs[config.m_iID] = config;
        }
    }

    private setJuYuanXiTongAttrConfigs(): void {
        let configs: GameConfig.JuYuanAttrCfgM[] = G.Cfgmgr.getCfg('data/JuYuanAttrCfgM.json') as GameConfig.JuYuanAttrCfgM[];
        this._porpConfigs = {};
        for (let config of configs) {
            this._porpConfigs[config.m_iID] = config;
        }
    }

    /**
    * 通过ID获取配置表
    * @param id	配置表ID
    * @return
    *
    */
    getJuYuanCfgById(id: number): GameConfig.JuYuanCfgM {
        return this._baseConfigs[id];
    }

    getJuYuanCfg(type: number, level: number): GameConfig.JuYuanCfgM {
        if (this._juYuanConfigs[type])
            return this._juYuanConfigs[type][1];
        return null;
    }

    getNextCfg(): GameConfig.JuYuanCfgM {
        if (this.isFullLevel())
            return this.getJuYuanCfg(this.m_type, 1);
        if (this.isNoLevel()) {
            return this.getJuYuanCfg(1, 1);
        }
        return this.getJuYuanCfg(this.m_type + 1, 1);
    }

    getCurCfg(defaultCfg: boolean = false): GameConfig.JuYuanCfgM {
        if (this.isNoLevel()) {
            if (defaultCfg) {
                return this.getJuYuanCfg(1, 1);
            }
            return null;
        }
        return this.getJuYuanCfg(this.m_type, this.m_level);
    }

    /** 神力阶段等级 */
    get level(): number {
        return this.m_level;
    }

    set level(value: number) {
        this.m_level = value;
    }

    /** 神力类型 */
    get type(): number {
        return this.m_type;
    }

    set type(value: number) {
        this.m_type = value;
    }

    getNextCfgBy(type: number, level: number): GameConfig.JuYuanCfgM {
        if (type <= 0)
            return this.getJuYuanCfg(1, 1);
        if (type >= Macros.MAX_JUYUAN_TYPE && level >= Macros.MAX_JUYUAN_LEVEL)
            return this.getJuYuanCfg(Macros.MAX_JUYUAN_TYPE, Macros.MAX_JUYUAN_LEVEL);
        if (level >= Macros.MAX_JUYUAN_LEVEL)
            return this.getJuYuanCfg(type + 1, 1);
        return this.getJuYuanCfg(type, level + 1);
    }

    /**
     * 是否开启模块
     * @param tips	是否提示
     * @return 		如果开启返回true
     *
     */
    isOpenModule(needPromp: boolean = false): boolean {
        if (!G.ActionHandler.checkCrossSvrUsable(needPromp)) {
            return false;
        }

        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_JU_YUAN, needPromp)) {
            return false;
        }

        return true;
    }

    /** 获取全部属性值列表 */
    getAllPropList(cfg: GameConfig.JuYuanCfgM): PropInfoVo[] {
        let attributeList: PropInfoVo[] = [];
        let nextCfg: GameConfig.JuYuanCfgM = this.getNextCfg();
        let porpId: number = cfg == null ? nextCfg.m_iAttrID : cfg.m_iAttrID;

        let porpCfg: GameConfig.JuYuanAttrCfgM = this.getPorpCfg(porpId);
        let nextPorpCfg: GameConfig.JuYuanAttrCfgM;
        if (nextCfg != null)
            nextPorpCfg = this.getPorpCfg(nextCfg.m_iAttrID);
        let porpList: GameConfig.JuYuanPropAttr[] = porpCfg.m_astAttr;
        for (let i: number = 0; i < porpList.length; i++) {
            let att: GameConfig.JuYuanPropAttr = porpList[i];
            if (att.m_iPropName <= 0)
                continue;
            let vo: PropInfoVo = new PropInfoVo();
            vo.id = att.m_iPropName;
            //需要对祝福系统的属性加成
            vo.value = cfg == null ? 0 : att.m_iPropValue + this.getZhuFuValue(att.m_iPropName, cfg) + this.getPorpList(att.m_iPropName, cfg);
            vo.add = nextCfg ? (nextPorpCfg.m_astAttr[i].m_iPropValue - (null != cfg ? att.m_iPropValue : 0)) : 0; //如果没有最后一个等级就直接
            attributeList.push(vo);
        }
        return attributeList;
    }

    private getPorpList(propName: number, cfg: GameConfig.JuYuanCfgM): number {
        if (cfg == null)
            return 0;
        let value: number = 0;
        let astAddAttrs: GameConfig.JuYuanAttr[] = cfg.m_astAddAttrs;
        for (let item of astAddAttrs) {
            if (item.m_iPropAttrID != 0 && item.m_iPropAttrID != undefined) {
                let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(item.m_iPropType);
                if (data != null && data.m_ucLevel >= item.m_iPropCondition) {
                    value += this.getPorpOnePorp(item, data.m_ucLevel, propName);
                }
            }
        }
        return value;
    }

    private getZhuFuValue(propName: number, cfg: GameConfig.JuYuanCfgM): number {
        if (cfg == null)
            return 0;
        let value: number = 0;
        let m_astBliss: GameConfig.JuYuanBlissAttr[] = cfg.m_astBliss;
        for (let item of m_astBliss) {
            if (item.m_iBlissName != 0 && item.m_iBlissName != undefined) {
                let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(item.m_iBlissName);
                if (data != null && data.m_ucLevel >= item.m_iBlissLevel) {
                    value += this.getZhuFuOnePorp(item, data.m_ucLevel, propName);
                }
            }

        }
        return value;
    }

    /**
     * 获取祝福值的命一条属性只
     * @param item		神力祝福值对象
     * @param level		神力等级
     * @param propName	需要获取的属性类型
     * @return 			返回这条属性的值
     *
     */
    private getZhuFuOnePorp(item: GameConfig.JuYuanBlissAttr, level: number, propName: number): number {
        let zhuFuCfg: GameConfig.ZhuFuConfigM = G.DataMgr.zhufuData.getConfig(item.m_iBlissName, level);
        for (let att of zhuFuCfg.m_astAttrList) {
            if (att.m_ucPropId == propName) {
                return Math.floor(item.m_iBlissValue * (item.m_iBlissValue / Constants.VALUE_RATIO));
            }
        }
        return 0;
    }

    /**
     * 获取祝福值的命一条属性只
     * @param item		神力祝福值对象
     * @param level		神力等级
     * @param propName	需要获取的属性类型
     * @return 			返回这条属性的值
     *
     */
    private getPorpOnePorp(item: GameConfig.JuYuanAttr, level: number, propName: number): number {
        let porpCfg: GameConfig.JuYuanAttrCfgM = this.getPorpCfg(item.m_iPropAttrID);
        let astAttr: GameConfig.JuYuanPropAttr[] = porpCfg.m_astAttr;
        for (let att of astAttr) {
            if (att.m_iPropName == propName) {
                return att.m_iPropValue;
            }
        }
        return 0;
    }

    /** 获取属性值列表 */
    toPorpList(cfg: GameConfig.JuYuanCfgM): string[][] {
        let dataList: PropInfoVo[] = this.getAllPropList(cfg);
        let attributeList: string[] = [];
        let addList: string[] = [];
        for (let i: number = 0; i < dataList.length; i++) {
            let vo: PropInfoVo = dataList[i];
            attributeList.push(vo.toName(G.DataMgr.heroData.profession));
            addList.push(vo.addName(G.DataMgr.heroData.profession));
        }
        return [attributeList, addList];
    }

    getPorpCfg(porpId: number): GameConfig.JuYuanAttrCfgM {
        return this._porpConfigs[porpId];
    }

    getFight(cfg: GameConfig.JuYuanCfgM): number {
        if (cfg == null)
            return 0;
        let strength: number = 0;
        let propCfg: GameConfig.JuYuanAttrCfgM = this.getPorpCfg(cfg.m_iAttrID);
        let m_astAddedProp: GameConfig.JuYuanPropAttr[] = propCfg.m_astAttr;
        for (let prop of m_astAddedProp) {
            if (undefined == prop.m_iPropName || prop.m_iPropName <= 0 || undefined == prop.m_iPropValue || prop.m_iPropValue <= 0)
                continue;
            strength += FightingStrengthUtil.calStrengthByOneProp(prop.m_iPropName, prop.m_iPropValue);
        }
        return strength;
    }

    isUpgrade(tips: boolean = false): boolean {
        if (!this.isOpenModule(tips))
            return false;
        if (this.isFullLevel(tips))
            return false;
        let jyCfg: GameConfig.JuYuanCfgM = this.getNextCfg();
        if (!this.isEnoughItem(jyCfg.m_iItemId, jyCfg.m_iCount, tips))
            return false;
        return true;
    }

    private isEnoughFight(fight: number, tips: boolean = false): boolean {
        if (G.DataMgr.heroData.fight >= fight)
            return true;
        if (tips)
            G.TipMgr.addMainFloatTip('突破条件不足，无法突破');
        return false;
    }

    /**
     * 道具是否足够
     * @param cosItemId		道具ID
     * @param cosItemCount	道具数量
     * @param tips			是否提示道具不足
     * @return 				如果足够返回true
     *
     */
    private isEnoughItem(cosItemId: number, cosItemCount: number, tips: boolean = false): boolean {
        let itemCount: number = G.DataMgr.thingData.getThingNum(cosItemId, 0, false);
        if (itemCount >= cosItemCount)
            return true;
        if (tips)
            G.TipMgr.addMainFloatTip('道具不足无法突破');
        return false;
    }

    /**
     * 是否达成神力等级
     * @param type	类型
     * @param level	等级
     * @return 		如果达成返回true
     *
     */
    isReachJuYuan(type: number, level: number): boolean {
        if (this.type > type)
            return true;
        if (this.type == type && this.level >= level)
            return true;
        return false;
    }

    /**
     * 是否达成祝福等级
     * @param type	类型
     * @param level	等级
     * @return 		如果达成返回true
     *
     */
    isReachZhuFu(type: number, level: number): boolean {
        let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(type);
        if (data == null) return false;
        return data.m_ucLevel >= this.level;
    }

    /** 获取特效球的比例  */
    getBallScale(): number {
        //需要计算战斗力间的差值与总差值比较
        if (this.isFullLevel())
            return 0;

        let currCfg: GameConfig.JuYuanCfgM = this.getCurCfg(true);
        let nextCfg: GameConfig.JuYuanCfgM = this.getNextCfg();

        let heroFight: number = G.DataMgr.heroData.fight;
        let limitFight: number = nextCfg.m_iPinstanceID - currCfg.m_iPinstanceID;

        if (heroFight - currCfg.m_iPinstanceID >= limitFight)
            return 0;

        let differenceFight: number = limitFight - (heroFight - currCfg.m_iPinstanceID);
        return Math.min(0.95, Math.max(0, differenceFight / limitFight));
    }

    getActivateList(cfg: GameConfig.JuYuanCfgM): string[] {
        if (cfg == null)
            cfg = this.getJuYuanCfg(1, 1);
        this.dataList = [];
        let num: number = 0;
        if (cfg.m_iPinstanceID <= 0) {
            for (let item of cfg.m_astCondition) {
                if (item.m_iType == 0)
                    continue;
                let stringx: string;
                //角色等级
                if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_JSDJ) {
                    let level: number = G.DataMgr.heroData.level;
                    stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(62, item.m_iConditionVal, level), level >= item.m_iConditionVal ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                //祝福等级
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_ZFXTJJ) {
                    let zhufuData: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(item.m_iCondition);
                    if (zhufuData == null)
                        continue;
                    let curStage: number = ZhufuData.getZhufuStage(zhufuData.m_ucLevel, KeyWord.HERO_SUB_TYPE_ZUOQI);
                    let maxStage: number = ZhufuData.getZhufuStage(item.m_iConditionVal, KeyWord.HERO_SUB_TYPE_ZUOQI);
                    let tab = KeyWord.getDesc(KeyWord.GROUP_HERO_SUB_TYPE, item.m_iCondition);
                    stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(63, tab, curStage, maxStage), curStage >= maxStage ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                //强化等级
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_ZBQHDJ) {
                    let strongLevel: number = G.DataMgr.equipStrengthenData.getEquipStrengthenLevelCount(item.m_iConditionVal);
                    stringx = TextFieldUtil.getColorText(uts.format('穿戴任意{2}件强化+{0}的装备({1}/{2})', item.m_iConditionVal, strongLevel, item.m_iNumber), strongLevel >= item.m_iNumber ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                //强化总等级
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_QHDJ) {
                    let strongLevel = G.DataMgr.equipStrengthenData.getEquipStrengthenLevelCount(item.m_iConditionVal);
                    let sumLevel: number = G.DataMgr.heroData.avatarList.m_ucStrengLevel;
                    stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(65, item.m_iConditionVal, strongLevel), sumLevel >= item.m_iConditionVal ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_ZBJJSZ) //任意X件装备进阶到神装      
                {
                    num = G.DataMgr.equipStrengthenData.getGodEquipCount(item.m_iConditionVal);
                    stringx = TextFieldUtil.getColorText(uts.format('任意{0}件装备进阶到{1}', item.m_iNumber, EquipUtils.getColorName(item.m_iConditionVal)), num >= item.m_iNumber ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_MWXQDJ) //全身镶嵌X个N级宝石      
                {
                    num = G.DataMgr.equipStrengthenData.getAllInsertDiamondCount(item.m_iConditionVal);
                    stringx = TextFieldUtil.getColorText(uts.format('全身镶嵌{1}个{0}级宝石', item.m_iConditionVal, item.m_iNumber), num >= item.m_iNumber ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                //宝石等级
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_MWDJ) {
                    let diamonondNums: number = G.DataMgr.equipStrengthenData.getAllInsertDiamondLevel();
                    stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(66, item.m_iConditionVal, diamonondNums), diamonondNums >= item.m_iConditionVal ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                //战斗力
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_JSZDL) {
                    let roleFight: number = G.DataMgr.heroData.fight;
                    let showFightValue = DataFormatter.cutWan(roleFight, 1);
                    let conditionShowValue = DataFormatter.cutWan(item.m_iConditionVal, 1);
                    stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(67, conditionShowValue, showFightValue), roleFight >= item.m_iConditionVal ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                //通关副本层数
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_FBCS) {
                    let pinststanceNum: number = G.DataMgr.pinstanceData.isCompleteStage(item.m_iCondition);
                    let pinstanceCfg: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(item.m_iCondition);
                    stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(68, pinstanceCfg.m_szName, pinststanceNum, item.m_iConditionVal), pinststanceNum >= item.m_iConditionVal ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                //伙伴等级
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_HYXTJJ) {
                    let beautyData: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(item.m_iCondition);
                    let beautyCfg: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(item.m_iCondition);
                    if (beautyData == null)
                        continue;
                    stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(69, beautyCfg.m_szBeautyName, beautyData.m_uiStage, item.m_iConditionVal), beautyData.m_uiStage >= item.m_iConditionVal ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_RYZBJJSZ) {
                    num = G.DataMgr.petData.getPetNumByStage(item.m_iConditionVal);
                    stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(10034, item.m_iNumber, item.m_iConditionVal, num), num >= item.m_iNumber ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_HYZBSL) {
                    num = G.DataMgr.thingData.getWearingPetEquipByStage(item.m_iConditionVal);
                    stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(10035, item.m_iNumber, item.m_iConditionVal, num), num >= item.m_iNumber ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_HYTZSL) {
                    num = G.DataMgr.petData.getWearingSetNum(item.m_iConditionVal);
                    stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(10036, item.m_iConditionVal, num), num > 0 ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_HYSJSL) {
                    num = G.DataMgr.petData.getActivedPets().length;
                    stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(10037, item.m_iNumber, num), num >= item.m_iNumber ? Color.GREEN : Color.RED);
                    this.dataList.push(stringx);
                }
            }
            //道具数量
            //let stringx: string;
            //let materialName: string = '';
            //if (KeyWord.MONEY_TONGQIAN_ID == cfg.m_iItemId) {
            //    materialName = '魂币';
            //}
            //let needMaterial: string = cfg.m_iCount.toString();
            //let itemHave: number = G.DataMgr.heroData.tongqian;
            //let hasMaterial: string = itemHave.toString();
            //if (cfg.m_iCount > 1000000) {
            //    needMaterial = Math.floor(cfg.m_iCount / 10000) + '万';
            //}
            //if (itemHave > 1000000) {
            //    hasMaterial = Math.floor(itemHave / 10000) + '万';
            //}
            //stringx = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(70, materialName, needMaterial, hasMaterial),
            //    itemHave >= cfg.m_iCount ? Color.GREEN : Color.RED);
            //this.dataList.push(stringx);
        }
        else {
            let stringx: string = '';
            stringx += TextFieldUtil.getColorText('挑战副本：', Color.YELLOW);
            stringx += TextFieldUtil.getColorText('境界考核', Color.GREEN);
            stringx += TextFieldUtil.getColorText('挑战胜利后', Color.DEFAULT_WHITE);
            this.dataList.push(stringx);
            stringx = TextFieldUtil.getColorText('可将进阶提升至：', Color.DEFAULT_WHITE);
            stringx += TextFieldUtil.getColorText(cfg.m_ucName, Color.GREEN);
            stringx += TextFieldUtil.getColorText('初期', Color.GREEN);
            this.dataList.push(stringx);
        }
        return this.dataList;
    }
}
