import { Global as G } from 'System/global'
import { Color } from 'System/utils/ColorUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { QuestData } from 'System/data/QuestData'
import { ThingData } from 'System/data/thing/ThingData'
import { PinstanceData } from 'System/data/PinstanceData'

export class AchievementData {
    private static _idDic: { [id: number]: GameConfig.AchiConfigM } = {};

    /**当前成就点*/
    currentAchiValue: number = 0;
    /**当前获得的新成就*/
    currentGetAchiNotify: Protocol.AchiChange_Notify;
    achievementInfo: Protocol.CSAllAchiData;

    private _achiNetDic: { [achiId: number]: Protocol.CSOneAchiData }=[];

    private _mainTypeDic: { [mainType: number]: GameConfig.AchiConfigM[] };
    private _subTypeDic: { [subType: number]: GameConfig.AchiConfigM[] };
    private _mainTypeCurrentProgressarr: number[];
    private _mainTypeMaxProgressDic: { [mainType: number]: number };

    /**总成就点*/
    private _maxAchiValue: number = 0;
    private _maxAchiAttrValue: number = 0;
    private _attrAchiDic: { [achiValue: number]: GameConfig.AchiAttrConfigM };
    private _attrAchiIdArr: number[];
    private _attrAchiArr: GameConfig.AchiAttrConfigM[];
    private _attAchiTotal: number = 0;

    onCfgReady() {
        this.setAchiConfig();
        this.setAchiAttrConfig();
    }

    /**
     * 获取达成成就加成属性配置表（计算达成值）
     * @param	value  达成成就值
     */
    getAchiAttrConfig(value: number): GameConfig.AchiAttrConfigM {
        let tmpConfig: GameConfig.AchiAttrConfigM;
        let len: number = this._attrAchiArr.length;
        for (let i: number = 0; i < len; i++) {
            let attrCfg = this._attrAchiArr[i];
            if (value >= attrCfg.m_uiAchiValeTotal) {
                tmpConfig = attrCfg;
                continue;
            }
            else {
                break;
            }
        }
        return tmpConfig;
    }

    /**
     * 获取下一级达成成就加成属性配置表（计算达成值）
     * @param	value  达成成就值
     */
    getNextAchiAttrConfig(value: number): GameConfig.AchiAttrConfigM {
        let len: number = this._attrAchiArr.length;
        let index: number = -1;
        for (let i: number = 0; i < len; i++) {
            let attrCfg = this._attrAchiArr[i];
            if (value >= attrCfg.m_uiAchiValeTotal) {
                index = i;
            }
            else {
                break;
            }
        }
        index++;
        if (value >= this._attAchiTotal || index == len) {
            return null;
        }
        return this._attrAchiArr[index];
    }

    /**
     * 获取成就加成属性配置表(准确值)
     * @param	value  达成成就值
     */
    getAchiAttrConfigByValueTotal(value: number): GameConfig.AchiAttrConfigM {
        return this._attrAchiDic[value];
    }

    /**初始化成就配置表*/
    private setAchiConfig(): void {
        let dataList: GameConfig.AchiConfigM[] = G.Cfgmgr.getCfg('data/AchiConfigM.json') as GameConfig.AchiConfigM[];
        this._maxAchiValue = 0;
        for (let act of dataList) {
            let arrayMain = this.mainTypeDic[act.m_ucMainType];
            let arraySub = this.subTypeDic[act.m_ucSubType];
            if (!arrayMain) {
                arrayMain = this.mainTypeDic[act.m_ucMainType] = [];
            }
            if (!arraySub) {
                arrayMain.push(act);
            }

            if (!arraySub) {
                arraySub = this.subTypeDic[act.m_ucSubType] = [];
            }
            arraySub.push(act);
            AchievementData._idDic[act.m_iID] = act;

            this._maxAchiValue += act.m_uiAchiVale;
            this.mainTypeMaxProgressDic[act.m_ucMainType] = this.mainTypeMaxProgressDic[act.m_ucMainType] + act.m_uiAchiVale;
        }
    }

    /**初始化成就增加属性配置表*/
    private setAchiAttrConfig(): void {
        let dataList: GameConfig.AchiAttrConfigM[] = G.Cfgmgr.getCfg('data/AchiAttrConfigM.json') as GameConfig.AchiAttrConfigM[];
        this._maxAchiAttrValue = 0;
        this._attrAchiDic = {};
        this._attrAchiArr = [];
        for (let ob of dataList) {
            this._maxAchiAttrValue = Math.max(ob.m_uiAchiValeTotal, this._maxAchiAttrValue);
            if (!this._attrAchiIdArr) {
                this._attrAchiIdArr = [];
                let m_stAchiAttr: GameConfig.AchiPropAtt[] = ob.m_stAchiAttr;
                for (let i: number = 0; i < m_stAchiAttr.length; i++) {
                    let achiPropAtt: GameConfig.AchiPropAtt = m_stAchiAttr[i] as GameConfig.AchiPropAtt;
                    if (achiPropAtt.m_ucPropId > 0) {
                        this._attrAchiIdArr.push(achiPropAtt.m_ucPropId);
                    }
                }
            }
            this._attrAchiDic[ob.m_uiAchiValeTotal] = ob;
            this._attrAchiArr.push(ob);

            this._attAchiTotal = Math.max(this._attAchiTotal, ob.m_uiAchiValeTotal);
        }

        this._attrAchiArr.sort(this.sortAttrAchi);
    }

    private sortAttrAchi(a: GameConfig.AchiAttrConfigM, b: GameConfig.AchiAttrConfigM): number {
        return a.m_uiAchiValeTotal - b.m_uiAchiValeTotal;
    }

    /**获取成就大类数组*/
    getMainTypeArr(mainType: number): GameConfig.AchiConfigM[] {
        return this.mainTypeDic[mainType];
    }

    /**获取成就小类数组*/
    getSubTypeArr(subType: number): GameConfig.AchiConfigM[] {
        return this.subTypeDic[subType];
    }

    get mainTypeDic(): { [mainType: number]: GameConfig.AchiConfigM[] } {
        if (!this._mainTypeDic) {
            this._mainTypeDic = {};
        }
        return this._mainTypeDic;
    }

    get subTypeDic(): { [subType: number]: GameConfig.AchiConfigM[] } {
        if (!this._subTypeDic) {
            this._subTypeDic = {};
        }
        return this._subTypeDic;
    }

    /**总共成就点*/
    get maxAchiValue(): number {
        return this._maxAchiValue;
    }

    /**成就服务端字典*/
    get achiNetDic(): { [achiId: number]: Protocol.CSOneAchiData } {
        if (!this._achiNetDic) {
            this._achiNetDic = {};
        }
        return this._achiNetDic;
    }

    /**大类型当前进度点*/
    get mainTypeCurrentProgressArr(): number[] {
        if (!this._mainTypeCurrentProgressarr) {
            this._mainTypeCurrentProgressarr = [];
        }
        return this._mainTypeCurrentProgressarr;
    }

    /**大类型总进度点*/
    get mainTypeMaxProgressDic(): { [mainType: number]: number } {
        if (!this._mainTypeMaxProgressDic) {
            this._mainTypeMaxProgressDic = {};
        }
        return this._mainTypeMaxProgressDic;
    }

    /**最大成就点加成属性的点数*/
    get maxAchiAttrValue(): number {
        return this._maxAchiAttrValue;
    }

    /**成就加成属性ID数组*/
    get attrAchiIdArr(): number[] {
        return this._attrAchiIdArr;
    }

    /**获取一个成就数据*/
    getCSOneAchiData(id: number): Protocol.CSOneAchiData {
        return this.achiNetDic[id];
    }

    /**清理成就服务端字典*/
    clearAchiNetDic(): void {
        this._achiNetDic = null;
    }

    /**计算所有成就大类型进度*/
    checkAllAchiProgress(): void {
        this.mainTypeCurrentProgressArr.length = 0;
        for (let achiIdKey in this.achiNetDic) {
            let obj = this.achiNetDic[achiIdKey];
            let configVo: GameConfig.AchiConfigM = AchievementData.getConfigVo(obj.m_uiAchiID);
            if (obj.m_bDone) {
                this.mainTypeCurrentProgressArr[configVo.m_ucMainType] = this.mainTypeCurrentProgressArr[configVo.m_ucMainType] + configVo.m_uiAchiVale;
            }
        }
    }

    /**获取成就配置表VO*/
    static getConfigVo(id: number): GameConfig.AchiConfigM {
        return AchievementData._idDic[id];
    }

    static getQuestStr(id: number, current: number): string {
        let config: GameConfig.AchiConfigM = AchievementData.getConfigVo(id);
        let currentColor: string = current >= config.m_uiQuestValue ? Color.GREEN : Color.RED;
        let str: string = '';
        if (config.m_ucQuestType == KeyWord.ACHI_CONDITION_ITEM_COUNT) {
            str = uts.format(RegExpUtil.xlsDesc2Html(config.m_szDesc), TextFieldUtil.getColorText(current.toString(), currentColor));
        }
        else if (config.m_ucQuestType == KeyWord.ACHI_CONDITION_VIP_REACH) {
            str = '达到' + TextFieldUtil.getColorText('VIP' + config.m_uiQuestValue, Color.ORANGE);
        }
        else if (config.m_ucQuestType == KeyWord.ACHI_NODE_TYPE_SIGN_TIME) {
            str = '累计' + TextFieldUtil.getColorText('签到', Color.ITEM_GOLD) + TextFieldUtil.getColorText(config.m_uiQuestValue.toString(), Color.GREEN) + '次';
        }
        else if (config.m_ucQuestType == KeyWord.ACHI_NODE_TYPE_FINISHTASK) {
            let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(config.m_uiQuestPara);
            str = '完成' + TextFieldUtil.getColorText(questConfig.m_ucQuestLevel + '级主线任务' + questConfig.m_szQuestTitle, Color.GREEN);
        }
        else if (config.m_ucQuestType == KeyWord.ACHI_CONDITION_ONLINES) {
            let time: number = Math.floor(config.m_uiQuestValue / 3600);
            str = '当日累计在线满' + TextFieldUtil.getColorText(time + '小时', Color.GREEN);
        }
        else if (config.m_ucQuestType == KeyWord.ACHI_CONDITION_LOGIN_DAYS) {
            str = '登录(' + TextFieldUtil.getColorText(current.toString(), currentColor) + '/' + TextFieldUtil.getColorText(config.m_uiQuestValue.toString(), Color.GREEN) + ')天';
        }
        else if (config.m_ucQuestType == KeyWord.ACHI_CONDITION_JUYUAN_STAGE) {
            str = '神力等级提升到' + TextFieldUtil.getColorText(G.DataMgr.juyuanData.getJuYuanCfg(config.m_uiQuestValue, 1).m_ucName, Color.GREEN);
        }
        else if (config.m_ucQuestType == KeyWord.ACHI_CONDITION_LEVEL) {
            str = '等级提升到' + TextFieldUtil.getColorText(config.m_uiQuestValue.toString(), Color.GREEN) + '级';
        }
        else if (config.m_ucQuestType == KeyWord.ACHI_NODE_TYPE_PET_CARD) {
            let thingConfig2: GameConfig.ThingConfigM = ThingData.getThingConfig(config.m_uiQuestPara);
            str = '使用' + TextFieldUtil.getColorText(config.m_uiQuestValue.toString(), Color.ITEM_GOLD) + thingConfig2.m_szName;
        }
        else if (config.m_ucQuestType == KeyWord.ACHI_CONDITION_FB_TG_FLOOR || config.m_ucQuestType == KeyWord.ACHI_CONDITION_FB_LAYER) {
            str = '通关' + TextFieldUtil.getColorText(PinstanceData.getConfigByID(config.m_uiQuestPara).m_szName, Color.YELLOW) + TextFieldUtil.getColorText(config.m_uiQuestValue.toString(), Color.GREEN) + '层';
        }

        return str;
    }
}
