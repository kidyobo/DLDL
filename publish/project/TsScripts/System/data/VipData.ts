import { Global as G } from 'System/global'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { NetModule } from 'System/net/NetModule'
import { StringUtil } from 'System/utils/StringUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { VipTeQuanShowType } from 'System/constants/GameEnum'
import { VipView } from '../vip/VipView';

/**
 * vip的相关数据
 * @author teppei
 *
 */
export class VipData {

    private static flag = false;

    /**每日礼包是否领取*/
    private static VipDailyGiftHasGet: { [level: number]: boolean } = {};

    /**vip每日礼包是否领取*/
    hasGetVipDailyGift: boolean = false;

    /**是否达成了超级VIP*/
    isReceivedSvip: boolean = false;

    /**vip特权进阶最大等级*/
    static readonly Max_VIPJinJieLv = Macros.MAX_VIPPRI_HY_LEVEL;

    /**特权种类数量*/
    static readonly PrivilegeCnt = 3;

    /**数据未初始化，状态未知。*/
    static readonly ACHI_GIFT_STATUS_NONE: number = 0;

    /**不能领取达成礼包。*/
    static readonly ACHI_GIFT_STATUS_NOT_REACHED: number = 1;

    /**可领取达成礼包。*/
    static readonly ACHI_GIFT_STATUS_CAN_GET: number = 2;

    /**已领取达成礼包。*/
    static readonly ACHI_GIFT_STATUS_GOT: number = 3;

    /**
     * [保留ID - 保留次数]配置映射表。
     */
    private m_reserveTimeConfigMap: { [id: number]: number };

    /**
     * [viptype, VIPFunctionConfig_Flash]对
     */
    private m_vipFuncMap: { [vipType: number]: GameConfig.VIPFunctionConfigM };


    private static m_vipParaMaps: { [vipParaId: number]: GameConfig.VIPParameterConfigM[] } = {};


    /**VIP参数配置。*/
    private m_vipParams: GameConfig.VIPParameterConfigM[];

    /**vip月卡参数配置*/
    private m_vipMonthParams: GameConfig.VIPMonthParameterConfigM[]

    /**vip信息数据。*/
    private m_listInfo: Protocol.VIPOperateListRsp;

    /**
     * [保留ID - 保留次数]次数映射表。
     */
    private m_reserveTimeMap: { [id: number]: number } = {};

    /**广告表。*/
    private static m_adMap: { [vipLv: number]: GameConfig.VIPAdCfgM };
    /**广告表数组。*/
    private static m_adArr: GameConfig.VIPAdCfgM[];

    //////////////////////平台vip状态////////////////////////////

    /** VIP等级可以领取的数量 */
    private _numVipLevelReward: number = 0;
    vPlanType: string;
    /**后台优源要用的变态类型*/
    vPlanTypeLevel: number = 0;
    vPlanLevel: number = 0;
    //vPlanInfo: VPlanInData;
    /**vip体验技能倒计时*/
    m_uiVIPSkillTime: number = 0;
    /**
     * 武极特权优化,飞入图标提示信息,消息类型*100+特权类型;
     * ①已激活月卡，每日未购买时发小提示，每天登陆后在线半小时，3小时，各推一次
     * ②月卡到期前最后一天，发提示您的月卡还有ＸＸ小时过期，请及时续期，点击前往
     * ③月卡过期后，发邮件提示，您的ｘｘ月卡已过期，请及时续期，点击前往
     *
     */
    overTips: number[] = new Array<number>();
    /**月充值金额*/
    monthChargeVal: number = 0;
    private m_platArr: GameConfig.PTFLActCfgM[];
    private m_platMap: any;

    /**特殊特权*/
    static readonly SpecialPriKeys: number[] = [KeyWord.SPECPRI_SHENQI_ADD, KeyWord.SPECPRI_SHENJI_ADD, KeyWord.SPECPRI_MAGICCUBE_ADD, KeyWord.SPECPRI_EQUIPSUIT_ADD, KeyWord.SPECPRI_BEAUTY_ADD];
    private m_specialConfig: { [id: number]: GameConfig.SpecialPriCfgM } = {};
    private m_day2specialPri: { [day: number]: number } = {};
    private m_specialPriBuyMap: { [id: number]: boolean } = {};
    private m_specialPriAddPctMap: { [id: number]: number } = {};

    //记录上线的时候是不是超级VIP
    static isOldSvip = false;

    onCfgReady() {
        this.setVipFunctionData();
        this.setVipParaData();
        this.setVipReserveTimesConfig();
        this.setAdConfig();
        this.setVipSpecialTeQuanConfig();
        this.setVipFanLiConfig();
        this.setVipTeQuanJinJieConfig();
        this.setVipTeQuanHuoYueConfig();
    }


    //////////////////////////////vip特殊特权////////////////////////////////////

    private setVipSpecialTeQuanConfig() {
        let configs: GameConfig.SpecialPriCfgM[] = G.Cfgmgr.getCfg('data/SpecialPriCfgM.json') as GameConfig.SpecialPriCfgM[];
        for (let config of configs) {
            this.m_specialConfig[config.m_iID] = config;
        }

        let dayCfg = this.m_specialConfig[KeyWord.SPECPRI_BUY_DAY];
        for (let k of VipData.SpecialPriKeys) {
            let cfg = this.m_specialConfig[k];
            for (let i = 0; i < cfg.m_aiValue.length; i++) {
                if (cfg.m_aiValue[i] > 0) {
                    this.m_day2specialPri[dayCfg.m_aiValue[i]] = k;
                    this.m_specialPriAddPctMap[k] = cfg.m_aiValue[i] / 10000;
                    break;
                }
            }
        }

        // 做一下校验
        for (let i = 0; i < dayCfg.m_aiValue.length; i++) {
            uts.assert(this.m_day2specialPri[dayCfg.m_aiValue[i]] == VipData.SpecialPriKeys[i], 'special privilege key sequence changed, please check!');
        }
    }

    /**获取特殊特权当天的配置*/
    getVipSpecialTeQuanOneConfig(id: number): GameConfig.SpecialPriCfgM {
        return this.m_specialConfig[id];
    }

    /**获取是否有可领取的每日礼包*/
    getCanGetDailyGift(): boolean {
        for (let i = 0; i <= VipData.PrivilegeCnt; i++) {
            let status: number = -1;
            if (i >= KeyWord.VIPPRI_1) {
                let status = G.DataMgr.heroData.getPrivilegeState(i);
                if (!VipData.VipDailyGiftHasGet[i] && status >= 0) {
                    return true;
                }
            } else {
                if (!VipData.VipDailyGiftHasGet[i]) {
                    return true;
                }
            }
        }
        return false;
    }



    /**设置每日礼包(白银,黄金,钻石)是否领取*/
    updateDailyGiftGetStage(response: Protocol.VIPOperateMonthInfoRsp) {
        for (let i = 0; i <= VipData.PrivilegeCnt; i++) {
            let level = i;
            let para: number = 1;
            para = para << level;
            if (response.m_iGetFlag & para) {
                VipData.VipDailyGiftHasGet[level] = true;
            } else {
                VipData.VipDailyGiftHasGet[level] = false;
            }
        }
    }


    /**获取vip达成可领取的奖励*/
    getVipDaChengCanGetCount(): number {
        let num: number = 0;
        let dailyLv = 0;
        if (G.DataMgr.vipData.canGetDailyGift()) {
            dailyLv = G.DataMgr.heroData.curVipLevel;
        }
        for (let i = 1; i <= Macros.MAX_VIP_LEVEL; i++) {
            if (dailyLv == i || VipData.ACHI_GIFT_STATUS_CAN_GET == G.DataMgr.vipData.getAchiGiftStatus(i)) {
                num++;
            }
        }
        if (G.DataMgr.heroData.curVipLevel > 0 && !this.hasGetVipDailyGift) {
            num++;
        }
        return num;
    }


    /**获取每日礼包是否领取*/
    getVipDailyGiftHasGet(level: number): boolean {
        return VipData.VipDailyGiftHasGet[level];
    }

    private firstOpen: number = 1;
    isFirstOpen(): boolean {
        // return this.firstOpen == 1;
        return UnityEngine.PlayerPrefs.GetInt("VipPrivilegeFirstOpen", 1) == 1;
    }

    openVipPrivilege() {
        // if (this.firstOpen == 1) {
        //     this.firstOpen = 0;
        //     let vipView = G.Uimgr.getForm<VipView>(VipView);
        //     if (vipView && vipView.isOpened) {
        //         vipView.updateZunxiangPanel();
        //     }
        // }
        if (UnityEngine.PlayerPrefs.GetInt("VipPrivilegeFirstOpen", 1) == 1) {
            UnityEngine.PlayerPrefs.SetInt("VipPrivilegeFirstOpen", 0);
            let vipView = G.Uimgr.getForm<VipView>(VipView);
            if (vipView && vipView.isOpened) {
                vipView.updateZunxiangPanel();
            }
        }
    }

    isVipTipMarkForLevel(level: number) {
        let thingIds = [10404011, 10404021, 10404031];
        if (G.DataMgr.thingData.getThingNum(thingIds[level - 1]) > 0) {
            return true;
        }
        let state = G.DataMgr.heroData.getPrivilegeState(level);
        let hasGet = this.getVipDailyGiftHasGet(level)
        if (state >= 0) {
            return !hasGet;
        }
        return false;
    }

    ///////////////////////////////////////////////// VIP数据 /////////////////////////////////////////////////

    updateListInfo(info: Protocol.VIPOperateListRsp): void {

        this.m_listInfo = info;
        this.m_listInfo.m_ucSpeakerNum = info.m_ucSpeakerNum;
        this.updateNumVipLevelRewar();
        //因为这是1个定长数组，所以要判断非0，而且不需要清掉原来的dictionary
        let typeID = 0;
        for (let r of this.m_listInfo.m_stReserveNum) {
            if (r.m_iType > 0) {
                typeID++;
                if (defines.has('_DEBUG')) {
                    uts.assert(1 == this.m_reserveTimeConfigMap[r.m_iType], '这个怎么会有保留次数：' + r.m_iType);
                }
                this.m_reserveTimeMap[r.m_iType] = r.m_iTimes;
            }
        }
        //在线跨天，刷新副本购买次数数据
        if (typeID == 0) {
            this.m_reserveTimeMap = {};
        }
        this.setVipDailyGiftStatus();
        this.setVipFanLiStatus(info.m_uiVIPReached, info.m_uiRewardVal);

    }

    setVipDailyGiftStatus() {
        let level: number = 1;
        let para: number = 1;
        para = para << level;
        if (this.listInfo.m_uiGetFlag & para) {
            this.hasGetVipDailyGift = true;
        }
        else {
            this.hasGetVipDailyGift = false;
        }
    }

    updatePinstanceTime(res: Protocol.VIPBuyPinstanceRsp): void {
        this.m_reserveTimeMap[res.m_iType] = res.m_iTimes;
    }

    /**
     * 更新VIP筋斗云使用次数。
     * @param flightNum
     * @return
     *
     */
    updateVipJdy(flightNum: number): boolean {
        if (null == this.m_listInfo) {
            return false;
        }

        let oldNum: number = this.m_listInfo.m_ucFlightNum;
        this.m_listInfo.m_ucFlightNum = flightNum;
        return flightNum != oldNum;
    }

    get listInfo(): Protocol.VIPOperateListRsp {
        return this.m_listInfo;
    }

    ///////////////////////////////////////////// VIP达成礼包 /////////////////////////////////////////////

    /**
    * 获取指定等级的VIP达成礼包的状态。
    * @param level 指定的VIP等级。
    * @return
    *
    */
    getAchiGiftStatus(level: number): number {
        if (G.DataMgr.heroData.curVipLevel < level) {
            //vip等级未达到
            return VipData.ACHI_GIFT_STATUS_NOT_REACHED;
        }
        if (null == this.m_listInfo) {
            return VipData.ACHI_GIFT_STATUS_NONE;
        }
        let para: number = 1;
        para = para << level;
        if (this.m_listInfo.m_iGetLifeLongGiftFlag & para) {
            return VipData.ACHI_GIFT_STATUS_GOT;
        }
        else {
            return VipData.ACHI_GIFT_STATUS_CAN_GET;
        }
    }

    /**
     * 是否可以领取达成礼包。
     * @return
     *
     */
    getCanGetAchiGiftMinLevel(): number {
        if (G.DataMgr.heroData.curVipLevel < 1 || null == this.m_listInfo) {
            return 0;
        }
        for (let i: number = 0; i < Macros.MAX_VIP_LEVEL; i++) {
            if (VipData.ACHI_GIFT_STATUS_CAN_GET == this.getAchiGiftStatus(i + 1)) {
                // 有达成礼包可以领
                return i + 1;
            }
        }
        return 0;
    }

    canGetDailyGift(): boolean {
        if (null == this.m_listInfo) {
            return false;

        }
        if (0 == this.m_listInfo.m_uiGetFlag && this.getVipParaValue(KeyWord.VIP_PARA_WEEK_GIFT_REWARD_ID, G.DataMgr.heroData.curVipLevel) > 0) {
            // 有每日礼包可以领
            return true;
        }

        return false;
    }

    /**
     * VIP按钮是否可以闪烁。
     * @return
     *
     */
    canVipShine(): boolean {
        return this.canGetDailyGift() || this.getCanGetAchiGiftMinLevel() > 0 || (G.DataMgr.heroData.curVipLevel > 0 && !this.hasGetVipDailyGift);
    }

    ///////////////////////////////////////////////// 保留次数相关 /////////////////////////////////////////////////

    /**
     * 设置Vip保留次数表。
     * @param configs
     *
     */
    private setVipReserveTimesConfig(): void {
        let dataList: GameConfig.VipReserveTimesM[] = G.Cfgmgr.getCfg('data/VipReserveTimesM.json') as GameConfig.VipReserveTimesM[];

        this.m_reserveTimeConfigMap = {};
        this.m_reserveTimeConfigMap[KeyWord.QUEST_TYPE_FRONT_LINE] = 1;
        this.m_reserveTimeConfigMap[KeyWord.QUEST_TYPE_FRONT_LINE] = 1;
        this.m_reserveTimeConfigMap[KeyWord.QUEST_TYPE_GUO_YUN] = 1;
        this.m_reserveTimeConfigMap[Macros.PINSTANCE_ID_VIP] = 1;
        for (let config of dataList) {
            this.m_reserveTimeConfigMap[config.m_iID] = 1;
        }
    }

    /**
     * 获取指定副本的保留次数。
     * @param id
     * @return
     *
     */
    getReserveTime(idOrType: number): number {
        //if (VipData.flag)
        //    uts.assert(false, '我的输出');
        //VipData.flag = true;
        if (1 == this.m_reserveTimeConfigMap[idOrType]) {
            // 这个副本可以保留次数
            if (null == this.m_reserveTimeMap) {
                // 没有拉到数据，认为是0
                return 0;
            }
            if (idOrType in this.m_reserveTimeMap) {
                return this.m_reserveTimeMap[idOrType];
            }
        }
        return 0;
    }

    getTaskBuyTimes(taskType: number): number {
        let count = this.m_reserveTimeMap[taskType];
        if (count == undefined)
            count = 0;
        return count;
    }

    /**
     * 设置vip的功能数据
     * @param data
     *
     */
    private setVipFunctionData(): void {
        let data: GameConfig.VIPFunctionConfigM[] = G.Cfgmgr.getCfg('data/VIPFunctionConfigM.json') as GameConfig.VIPFunctionConfigM[];

        if (this.m_vipFuncMap == null) {
            this.m_vipFuncMap = {};
        }

        let vipFunc: GameConfig.VIPFunctionConfigM = null;
        let len: number = data.length;
        for (let i: number = 0; i < len; ++i) {
            vipFunc = data[i];
            if (vipFunc.m_ucType != 0) {
                this.m_vipFuncMap[vipFunc.m_ucType] = vipFunc;
            }
        }
    }

    /**
     * 设置vip参数
     * @param data
     *
     */
    private setVipParaData(): void {
        let data: GameConfig.VIPParameterConfigM[] = G.Cfgmgr.getCfg('data/VIPParameterConfigM.json') as GameConfig.VIPParameterConfigM[];
        let vipPara: GameConfig.VIPParameterConfigM = null;
        for (let i: number = data.length - 1; i >= 0; i--) {
            vipPara = data[i];
            if (VipData.m_vipParaMaps[vipPara.m_iID] == null) {
                VipData.m_vipParaMaps[vipPara.m_iID] = [];
            }
            VipData.m_vipParaMaps[vipPara.m_iID].push(vipPara);
        }
        this.m_vipParams = data;
    }

    /**通过paraid获取奖励数据*/
    getVipParaMaps(id: number): GameConfig.VIPParameterConfigM[] {
        return VipData.m_vipParaMaps[id];
    }
    /**通过paraid获取奖励数据*/
    getVipTypeByPara(paraId: number): number {
        let vipParamCfgs = this.getVipParaMaps(paraId);
        if (!vipParamCfgs)
            return 0;
        for (let i = vipParamCfgs.length - 1; i >= 0; i++) {
            let cfg = vipParamCfgs[i];
            if (cfg) {
                return cfg.m_ucPriType;
            }
        }
        return 0;
    }
    /**获取当前最高的特权对应的关键字，没有特权返回-1 */
    static getVipPriKeyWord(): number {
        let vipPri: number = -1;
        let heroData = G.DataMgr.heroData;
        if (heroData.getPrivilegeState(KeyWord.VIPPRI_3) >= 0) {
            vipPri = KeyWord.VIPPRI_3;
        } else if (heroData.getPrivilegeState(KeyWord.VIPPRI_2) >= 0) {
            vipPri = KeyWord.VIPPRI_2;
        } else if (heroData.getPrivilegeState(KeyWord.VIPPRI_1) >= 0) {
            vipPri = KeyWord.VIPPRI_1;
        }
        return vipPri;
    }

    getVipParamCount(vipType: number, vipPara: number) {
        let cfg = this.getVipParamCfg(vipType, vipPara);
        if (!cfg)
            return 0;
        let values = cfg.m_aiValue;
        let vipLv = G.DataMgr.heroData.curVipLevel;
        let retValue = 0;
        if (vipLv == 0) {
            retValue = cfg.m_iVIP0;
        } else if (vipLv < values.length) {
            retValue = values[vipLv - 1];
        } else {
            retValue = values[values.length - 1];
        }
        return retValue;
    }
    private vipTypeParm2CfgMap: { [type: number]: { [param: number]: GameConfig.VIPParameterConfigM } } = {};
    getVipParamCfg(vipType: number, param: number) {
        if (this.vipTypeParm2CfgMap[vipType])
            return this.vipTypeParm2CfgMap[vipType][param];
        return null;
    }
    getNextVipLvAndCount(vipType: number, vipPara: number) {
        let retValues: number[] = [];
        let curCount = this.getVipParamCount(vipType, vipPara);
        let cfg = this.getVipParamCfg(vipType, vipPara);
        if (!cfg)
            return retValues;
        let values = cfg.m_aiValue;
        for (let i = 0; i < values.length; i++) {
            if (curCount < values[i]) {
                retValues.push(i + 1);
                retValues.push(values[i]);
                return retValues;
            }
        }
        //返回最大vip
        retValues.push(values.length);
        retValues.push(values[values.length - 1]);
        return retValues;
    }
    /**
     * 获取指定VIP等级的下一级所需充值额度。
     * @param lv
     * @return 已经到达VIP顶级则返回0.
     *
     */
    getNextChargeValue(lv: number): number {
        if (lv < Macros.MAX_VIP_LEVEL) {
            return this.getVipParaValue(KeyWord.VIP_PARA_OPEN_MONEY, lv + 1, KeyWord.VIPPRI_NONE);
        }
        else {
            return 0;
        }
    }

    /**根据vip参数以及vip等级获取当前最高特权对应参数*/
    getVipParaValueByVipPriType(paraID: number, vipLevel: number, vipPriType: number): number {
        let paras: GameConfig.VIPParameterConfigM[] = VipData.m_vipParaMaps[paraID];
        if (paras != null) {

        }
        return 0;
    }

    /**
    * 根据vip的参数以及vip等级取得对应的参数
    * @param paraID
    * @param vipLevel
    * @param vipPriType
    * @param isAddLevel
    * @return
    *
    */
    getVipParaValue(paraID: number, vipLevel: number, vipPriType: number = -1): number {
        let paras: GameConfig.VIPParameterConfigM[] = VipData.m_vipParaMaps[paraID];
        if (paras != null) {
            let priTypes: number[] = [];
            if (vipPriType != -1) {
                //取指定等级特权的参数
                priTypes = [vipPriType];
            } else {
                //取当前等级的参数
                priTypes = this.getCurrentPriTypes();
            }
            let cnt = priTypes.length;
            if (cnt > 0) {
                let addvalue: number = 0;
                for (let i = 0; i < cnt; i++) {
                    let type = priTypes[i];
                    for (let index = 0; index < VipData.PrivilegeCnt; index++) {
                        let para = paras[index];
                        if (para != null && para.m_ucPriType == type) {
                            if (vipLevel == 0) {
                                addvalue += para.m_iVIP0;
                            } else {
                                addvalue += para.m_aiValue[vipLevel - 1];
                            }
                        }
                    }
                }
                return addvalue;
            }
        }
        return 0;
    }

    /**
    * 根据vip的参数以及vip等级取得对应的参数
    * @param paraID
    * @param vipLevel
    * @return
    *
    */
    getVipParaValueAllType(paraID: number, vipLevel: number): number {
        let paras: GameConfig.VIPParameterConfigM[] = VipData.m_vipParaMaps[paraID];
        if (paras != null) {
            let priTypes: number[] = [KeyWord.VIPPRI_1, KeyWord.VIPPRI_2, KeyWord.VIPPRI_3];
            let addvalue: number = 0;
            for (let i = 0; i < priTypes.length; i++) {
                let type = priTypes[i];
                for (let index = 0; index < VipData.PrivilegeCnt; index++) {
                    let para = paras[index];
                    if (para != null && para.m_ucPriType == type) {
                        if (vipLevel == 0) {
                            addvalue += para.m_iVIP0;
                        } else {
                            addvalue += para.m_aiValue[vipLevel - 1];
                        }
                    }
                }
            }
            return addvalue;
        }
        return 0;
    }

    /**
     * 根据VIP参数获取相应的特权
     * @param paraID
     */
    getPriTypesByParaID(paraID: number): number[] {
        let paras: GameConfig.VIPParameterConfigM[] = VipData.m_vipParaMaps[paraID];
        if (paras != null) {
            let priTypes: number[] = [];
            for (let i = 0; i < paras.length; i++) {
                let para = paras[i];
                priTypes.push(para.m_ucPriType);
            }
            return priTypes;
        }

        return null;
    }

    /**获取当前已经开启的所有特权(白银,黄金,钻石)*/
    private getCurrentPriTypes(): number[] {
        let crtTypes: number[] = [];
        for (let i = VipData.PrivilegeCnt; i > 0; i--) {
            let stage = G.DataMgr.heroData.getPrivilegeState(i);
            if (stage >= 0) {
                crtTypes.push(i);
            }
        }
        return crtTypes;
    }


    /**
     * 根据id返回vip的功能参数
     * @param id
     * @return
     *
     */
    getVipFuncByType(type: number): GameConfig.VIPFunctionConfigM {
        return this.m_vipFuncMap[type];
    }


    /**
     * 根据玩家当前的充值记录判断当前的vip等级
     * @param money Q点为单位
     * @return
     *
     */
    getVipLevelByMoney(money: number): number {
        let result: number = 0;
        let paras = VipData.m_vipParaMaps[KeyWord.VIP_PARA_OPEN_MONEY];
        let openPara: GameConfig.VIPParameterConfigM = paras[KeyWord.VIPPRI_NONE];
        let len: number = openPara.m_aiValue.length;
        let lv: number = 0;
        for (let i: number = 0; i < len; ++i) {
            if (money < openPara.m_aiValue[i]) {
                break;
            }
            else {
                lv = i + 1;
            }
        }
        return lv;
    }

    /**
     * 取得vip功能类型的开启等级
     * @param type
     * @return
     *
     */
    getOpenLevel(type: number): number {
        let config: GameConfig.VIPFunctionConfigM = this.getVipFuncByType(type);
        if (config != null) {
            return config.m_ucOpenLevel;
        }
        return 0;
    }

    /**
     * 获取拥有指定特权的等级。
     * @param paramID
     */
    getPrivilegeLevels(paramID: number): number[] {
        let cfgs = VipData.m_vipParaMaps[paramID];
        let levels: number[] = [];
        if (null != cfgs) {
            for (let i = 0; i <= Macros.MAX_VIP_MONTH_LEVEL; i++) {
                let ishas: boolean = false;
                let data: GameConfig.VIPParameterConfigM;
                if (cfgs[i] == null) {
                    return levels;
                }
                for (let index = 0; index < cfgs[i].m_aiValue.length; index++) {
                    if (cfgs[i].m_aiValue[index] != 0) {
                        ishas = true;
                        data = cfgs[i];
                        break;
                    }
                }
                if (ishas) {
                    levels.push(data.m_ucPriType);
                }
            }
        }
        return levels;
    }

    /**
     * 指定的特权卡状态是否拥有指定的特权。
     * @param paramID
     * @param privilegeLevel
     */
    hasPrivilege(paramID: number): boolean {
        let levels = this.getPrivilegeLevels(paramID);

        for (let i = 0; i < levels.length; i++) {
            let level = levels[i];
            if (G.DataMgr.heroData.getPrivilegeState(level) >= 0) {
                //已经激活
                let value = this.getVipParaValue(paramID, G.DataMgr.heroData.curVipLevel, level);
                if (value != 0) {
                    return true;
                }
            }
        }
        return false;
    }



    /**
     * 取到次数更多的下一个等级对应的参数
     * @param	paraID
     * @param	vipLevel
     * @param	flag
     * @return
     */
    getMoreTimesParaValue(paraID: number, vipLevel: number, flag: number = 1): number {
        let moreTimesVipLevel: number = this.getMoreTimesVipLevel(vipLevel, paraID, flag);
        return this.getVipParaValue(paraID, moreTimesVipLevel);
    }

    /**
     * 取到次数更多的下一个等级
     * @param curVipLevel flag区别常规vip还是月卡vip，0表示月卡vip，1表示常规vip
     * @return
     *
     */
    getMoreTimesVipLevel(curVipLevel: number, vipPara: number, flag: number = 1): number {
        //常规vip
        let nextVipLevel: number = 0;
        let curLevelTimes: number = 0;
        let vipTimes: number = 0;
        let viplevel: number = 0;
        if (flag == 1) {
            if (defines.has('_DEBUG')) {
                uts.assert(curVipLevel <= Macros.MAX_VIP_LEVEL, '参数合法');
            }
            nextVipLevel = curVipLevel;
            if (curVipLevel < Macros.MAX_VIP_LEVEL) {
                curLevelTimes = this.getVipParaValue(vipPara, curVipLevel);
                for (viplevel = curVipLevel; viplevel <= Macros.MAX_VIP_LEVEL; viplevel++) {
                    vipTimes = this.getVipParaValue(vipPara, viplevel);

                    if (vipTimes > curLevelTimes) {
                        nextVipLevel = viplevel;
                        break;
                    }
                }
            }
        }
        else { //月卡vip
            if (defines.has('_DEBUG')) {
                uts.assert(curVipLevel <= Macros.MAX_VIP_MONTH_LEVEL, '参数合法');
            }
            nextVipLevel = curVipLevel;
            if (curVipLevel < Macros.MAX_VIP_MONTH_LEVEL) {
                curLevelTimes = this.getVipParaValue(vipPara, curVipLevel);
                for (viplevel = curVipLevel; viplevel <= Macros.MAX_VIP_MONTH_LEVEL; viplevel++) {
                    vipTimes = this.getVipParaValue(vipPara, viplevel);
                    if (vipTimes > curLevelTimes) {
                        nextVipLevel = viplevel;
                        break;
                    }
                }
            }
        }
        return nextVipLevel;
    }



    get vipParas(): GameConfig.VIPParameterConfigM[] {
        return this.m_vipParams;
    }

    /**
     * 获取指定副本的一键完成参数。
     * @param pinstanceID
     * @return
     *
     */
    static getOneKeyPinstancePara(pinstanceID: number): number {
        return 0;
    }

    ///////////////////////////////////////////// VIP广告 /////////////////////////////////////////////

    setAdConfig(): void {
        let configs: GameConfig.VIPAdCfgM[] = G.Cfgmgr.getCfg('data/VIPAdCfgM.json') as GameConfig.VIPAdCfgM[];
        VipData.m_adMap = {};
        VipData.m_adArr = new Array<GameConfig.VIPAdCfgM>();
        for (let config of configs) {
            VipData.m_adMap[config.m_iVipLv] = config;
            VipData.m_adArr.push(config);
        }
    }

    getAdConfigByLv(lv: number): GameConfig.VIPAdCfgM {
        return VipData.m_adMap[lv];
    }

    /**获取VIP广告表数组*/
    getAdConfigArr(): GameConfig.VIPAdCfgM[] {
        return VipData.m_adArr;
    }

    ///////////////////////////////////////////// 平台广告 /////////////////////////////////////////////

    setPlatConfig(configs: GameConfig.PTFLActCfgM[]): void {
        this.m_platMap = {};
        this.m_platArr = new Array<GameConfig.PTFLActCfgM>();
        for (let config of configs) {
            this.m_platMap[config.m_iID] = config;
            this.m_platArr.push(config);
        }
    }

    /**获取平台广告表数组*/
    getPlatConfigArr(): GameConfig.PTFLActCfgM[] {
        return this.m_platArr;
    }

    /**
     * 获取Vip等级
     * @param	rechargeNum
     * @return
     */
    static getVipLevelByRechargeValue(rechargeNum: number): number {
        let paras = VipData.m_vipParaMaps[KeyWord.VIP_PARA_OPEN_MONEY];
        let para: GameConfig.VIPParameterConfigM = paras[KeyWord.VIPPRI_NONE];
        if (paras == null || para == null) {
            uts.log("请检查表格");
            return 0;
        }
        let m_aiValue: number[] = para.m_aiValue;
        let len: number = m_aiValue.length;
        let level: number = 0;
        let maxValue: number = m_aiValue[len - 1];
        if (rechargeNum >= maxValue) {
            return len;
        }
        for (let i: number = len - 1; i > 0; i--) {
            let needValue: number = m_aiValue[i];
            if (rechargeNum >= needValue) {
                return i + 1;
            }
        }
        return 0;
    }


    /** 更新VIP等级礼包奖励数量 */
    updateNumVipLevelRewar(): void {
        this._numVipLevelReward = 0;
        let level: number = G.DataMgr.heroData.curVipLevel;
        for (let i: number = 1; i <= level; i++) {
            let status: number = this.getAchiGiftStatus(i);
            if (VipData.ACHI_GIFT_STATUS_CAN_GET == status)
                this._numVipLevelReward++;
        }
    }

    /** 活动提示文本的数量 */
    getInformCount(): number {
        if (G.DataMgr.heroData.curVipLevel == 0) {
            return 0;
        }
        if (this.m_listInfo && this.m_listInfo.m_uiGetFlag == 0)
            return this._numVipLevelReward + 1;

        return this._numVipLevelReward;
    }

    /** VIP等级可以领取的数量 */
    get numVipLevelReward(): number {
        return this._numVipLevelReward;
    }

    /**是否能使用自动分解*/
    canUseAutoAnalyze(): boolean {
        return this.hasPrivilege(KeyWord.VIP_PARA_OPEN_GUAJIFENJIE);
    }

    /**
     * 获取平台信息
     * @param status
     *
     */
    PlatInfo(): number {
        return G.DataMgr.gameParas.platformType;
    }

    /**检查是否显示月卡过天提示面板(获取符合显示的月卡类型)*/
    checkShowCardOverDayTipPanel(): number {
        let cardType: number = 0;
        //let rate: number = VipData.OVER_DAY_MIN_RATE;
        //for (let cardInfo of this.vipCardInfoDic) {
        //    let current: number = parseInt(Mgr.ins.syncTime.getCurrentTime() / 1000);
        //    let time: number = cardInfo.m_uiTimeOut - current;
        //    if (time > 0) {
        //        let _cardDiscountCfg: GameConfig.CardDiscountCfgM = this.getCardDiscountCfgByLevelType(cardInfo.m_usLevel, cardInfo.m_ucType);
        //        if (_cardDiscountCfg) {
        //            let tmpRate: number = cardInfo.m_usBless / _cardDiscountCfg.m_uiLevelUpExp;
        //            if (tmpRate > rate) {
        //                cardType = cardInfo.m_ucType;
        //                rate = tmpRate;
        //            }
        //        }
        //    }
        //}
        return cardType;
    }

    //以前是不是Svip
    IsOldSvip(uiFristOpenFunc: number) {
        if (uiFristOpenFunc & Macros.FST_SUPERVIP_GIFT) {
            VipData.isOldSvip = true;
        }
        else {
            VipData.isOldSvip = false;
        }
    }

    //是否已经领取了超级VIP
    isReceivedSVip(uiFristOpenFunc: number) {
        if (uiFristOpenFunc & Macros.FST_SUPERVIP_GIFT) {
            this.isReceivedSvip = true;
        }
        else {
            this.isReceivedSvip = false;
        }
    }


    //////////////////////////////////////////vip特殊特权////////////////////////////////////////


    updateSpecialPri(para: number) {
        for (let i = 0; i <= VipData.SpecialPriKeys.length; i++) {
            let index: number = 1 << (i + 1);
            this.m_specialPriBuyMap[VipData.SpecialPriKeys[i]] = 0 != (para & index);
        }
    }


    hasBuySpecialPri(id: number): boolean {
        return this.m_specialPriBuyMap[id];
    }

    /**
     * 查询指定的特殊特权的开卖日期。
     * @param id
     */
    getSpecialPriStartDay(id: number): number {
        let dayCfg = this.getVipSpecialTeQuanOneConfig(KeyWord.SPECPRI_BUY_DAY);
        return dayCfg.m_aiValue[VipData.SpecialPriKeys.indexOf(id)];
    }

    /**
     * 查询指定日期开卖的特殊特权。
     * @param id
     */
    getSpecialPriKeyByDay(day: number): number {
        return this.m_day2specialPri[day];
    }

    /**
     * 获取指定特殊特权的加成百分比（不考虑是否激活）
     * @param id
     */
    getSpecialPriPct(id: number): number {
        return this.m_specialPriAddPctMap[id];
    }

    /**
     * 获取指定特殊特权的真实加成百分比（未激活则为0）
     * @param id
     */
    getSpecialPriRealPct(id: number): number {
        if (this.hasBuySpecialPri(id)) {
            return this.getSpecialPriPct(id);
        }
        return 0;
    }

    /**
     * 查询指定的特殊特权的相关物品id。
     * @param id
     */
    getSpecialPriItemId(id: number): number {
        let itemCfg = this.getVipSpecialTeQuanOneConfig(KeyWord.SPECPRI_GET_ITEM);
        return itemCfg.m_aiValue[VipData.SpecialPriKeys.indexOf(id)];
    }

    ////////////////////////////////新的vip表////////////////////////////////////////////////////////////////////////

    //vip返利
    private vipFanLiConfigs: { [level: number]: GameConfig.VIPRebateM } = {};
    private setVipFanLiConfig() {
        let configs: GameConfig.VIPRebateM[] = G.Cfgmgr.getCfg('data/VIPRebateM.json') as GameConfig.VIPRebateM[];
        for (let config of configs) {
            this.vipFanLiConfigs[config.m_iVIPLv] = config;
        }
    }

    getVipFanLiConfigByVipLevel(level: number) {
        return this.vipFanLiConfigs[level];
    }

    private vipFanLiStatusByLevel: { [level: number]: boolean } = {};
    vipFanLiLeftNum: number = 0;
    private setVipFanLiStatus(para: number, leftNum: number) {
        this.vipFanLiLeftNum = leftNum;
        for (let i = 1; i <= Macros.MAX_VIP_LEVEL; i++) {
            let pa = 1 << i;
            if (pa & para) {
                this.vipFanLiStatusByLevel[i] = true;
            } else {
                this.vipFanLiStatusByLevel[i] = false;
            }
        }
    }

    getVipFanLiStatus(level: number) {
        return this.vipFanLiStatusByLevel[level];
    }

    VipFanLiParaConfig: GameConfig.VIPPriHYParamM[] = [];


    ///////////////////////////////////vip进阶相关/////////////////////////////////////////////////////////

    private static m_vipJinJieParaMaps: { [vipParaId: number]: GameConfig.VIPPriHYParamM[] } = {};
    private setVipTeQuanJinJieConfig() {
        let configs: GameConfig.VIPPriHYParamM[] = G.Cfgmgr.getCfg('data/VIPPriHYParamM.json') as GameConfig.VIPPriHYParamM[];
        for (let config of configs) {
            if (VipData.m_vipJinJieParaMaps[config.m_iID] == null) {
                VipData.m_vipJinJieParaMaps[config.m_iID] = [];
            }
            VipData.m_vipJinJieParaMaps[config.m_iID].push(config);
        }
        this.VipFanLiParaConfig = configs;
    }


    /**
    * 根据vip进阶的参数取得对应的参数
    * @param paraID
    * @param vipLevel
    * @param vipPriType
    * @param isAddLevel
    * @return
    *
    */
    getVipJinJieParaValue(paraID: number, vipLevel: number, vipPriType: number = -1): number {
        let paras: GameConfig.VIPPriHYParamM[] = VipData.m_vipJinJieParaMaps[paraID];
        if (paras != null) {
            let priTypes: number[] = [];
            if (vipPriType != -1) {
                //取指定等级特权的参数
                priTypes = [vipPriType];
            } else {
                //取当前等级的参数
                priTypes = this.getCurrentPriTypes();
            }
            let cnt = priTypes.length;
            if (cnt > 0) {
                let addvalue: number = 0;
                for (let i = 0; i < cnt; i++) {
                    let type = priTypes[i];
                    for (let index = 0; index < VipData.PrivilegeCnt; index++) {
                        let para = paras[index];
                        if (para != null && para.m_ucPriType == type) {
                            if (vipLevel == 0) {
                                addvalue += para.m_aiValue[0];
                            } else {
                                addvalue += para.m_aiValue[vipLevel - 1];
                            }
                        }
                    }
                }
                return addvalue;
            }
        }
        return 0;
    }




    /**
     * 根据玩家当前的充值记录判断当前的vip进阶等级
     * @param money Q点为单位
     * @param type 特权
     * @return
     *
     */

    private getVipJinJieLevelByMoney(money: number, type: number): number {
        let result: number = 0;
        if (G.DataMgr.heroData.getPrivilegeState(type) < 0) {
            return result;
        }
        let paras = VipData.m_vipJinJieParaMaps[KeyWord.VIPPRI_HY_OPEN];
        let openPara: GameConfig.VIPPriHYParamM;
        for (let i = 0; i < paras.length; i++) {
            if (paras[i].m_ucPriType == type) {
                openPara = paras[i];
            }
        }
        if (paras == null || openPara == null) {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '结果不能为空，请检查表格');
            }
            return 0;
        }
        let len: number = openPara.m_aiValue.length;
        if (defines.has('_DEBUG')) {
            uts.assert(10 == len, 'vip等级只有10个，如果没有那肯定哪里出错了');
        }
        let tempLevel: number = 0;
        for (let i: number = 0; i < len; ++i) {
            if (money < openPara.m_aiValue[i]) {
                break;
            }
            else {
                tempLevel = i + 1;
            }
        }
        result = tempLevel;
        if (defines.has('_DEBUG')) {
            uts.assert(result >= 0 && result <= 10, '等级判断正确');
        }
        return result;
    }


    /**刷新vip进阶等级(白银,黄金,钻石)*/
    updateVipJinJieLv(para: number[]) {
        let value_baiyin = para[0];
        let value_huangjin = para[1];
        let value_zuanshi = para[2];
        G.DataMgr.heroData.baiYinChargeValue = value_baiyin;
        G.DataMgr.heroData.huangjinChargeValue = value_huangjin;
        G.DataMgr.heroData.zuanshiChargeValue = value_zuanshi;
        G.DataMgr.heroData.curVipBaiYinLv = this.getVipJinJieLevelByMoney(value_baiyin, KeyWord.VIPPRI_1);
        G.DataMgr.heroData.curVipHuangJinLv = this.getVipJinJieLevelByMoney(value_huangjin, KeyWord.VIPPRI_2);
        G.DataMgr.heroData.curVipZuanShiLv = this.getVipJinJieLevelByMoney(value_zuanshi, KeyWord.VIPPRI_3);
    }


    /**
     * 获取指定VIP进阶的下一级所需充值额度。
     * @param lv
     * @return 已经到达VIP顶级则返回0.
     *
     */
    getNextJinJieChargeValue(lv: number, type: number): number {
        if (lv < VipData.Max_VIPJinJieLv) {
            return this.getVipJinJieParaValue(KeyWord.VIPPRI_HY_OPEN, lv + 1, type);
        }
        else {
            return 0;
        }
    }

    /**获取vip特权显示阶级*/
    getVIPTeQuanShowType(): number {
        let stage = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3);
        if (stage >= 0) {
            return VipTeQuanShowType.zuanshi;
        }
        let stage1 = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2);
        if (stage1 >= 0) {
            return VipTeQuanShowType.huangjin;
        }
        return VipTeQuanShowType.baiyin;
    }


    ///////////////////////////////vip活跃相关///////////////////////////////////////

    private m_vipHuoYueParaMaps: { [type: number]: GameConfig.VIPPriHYFuncM[] } = {};
    private setVipTeQuanHuoYueConfig() {
        let configs: GameConfig.VIPPriHYFuncM[] = G.Cfgmgr.getCfg('data/VIPPriHYFuncM.json') as GameConfig.VIPPriHYFuncM[];
        for (let config of configs) {
            if (this.m_vipHuoYueParaMaps[config.m_iPriLv] == null) {
                this.m_vipHuoYueParaMaps[config.m_iPriLv] = [];
            }
            this.m_vipHuoYueParaMaps[config.m_iPriLv].push(config);
        }
    }

    getVipTeQuanHuoYueConfigByType(type: number) {
        return this.m_vipHuoYueParaMaps[type];
    }

    private m_viphuoyueData: { [type: number]: { [position: number]: number } } = {};
    updateVipTeQuanHuoYueData(datas: Protocol.VPIPriHYDataList) {
        for (let i = 0; i < datas.m_stData.length; i++) {
            let data = datas.m_stData[i];
            let info = data.m_stPriInfo;
            let type = i + 1;
            for (let index = 0; index < info.length; index++) {
                let config = info[index];
                if (this.m_viphuoyueData[type] == null) {
                    this.m_viphuoyueData[type] = {};
                }
                this.m_viphuoyueData[type][config.m_ucID] = config.m_uiNum;
            }
        }
    }

    /**通过type,id获取特权指定活动的完成次数*/
    getVipHuoYueFinshTimesByTypeIndex(type: number, typeIndex: number) {
        return this.m_viphuoyueData[type][typeIndex];
    }

    /**获取是否可以参加特权指定的活动*/
    getVipTeQuanCanJoinAct(type: number) {
        let heroData = G.DataMgr.heroData;
        if (type == KeyWord.VIPPRI_1) {
            return heroData.curVipBaiYinLv > 0;
        } else if (type == KeyWord.VIPPRI_2) {
            return heroData.curVipHuangJinLv > 0;
        } else if (type == KeyWord.VIPPRI_3) {
            return heroData.curVipZuanShiLv > 0;
        }
    }

    judgeHeroInPriType(priTypes: number[]): boolean {
        if (priTypes == null || priTypes.length == 0) return false;
        for (let i = 0; i < priTypes.length; i++) {
            let priType = priTypes[i];
            if (G.DataMgr.heroData.getPrivilegeState(priType) >= 0) {
                return true;
            }
        }
        return false;
    }

}
