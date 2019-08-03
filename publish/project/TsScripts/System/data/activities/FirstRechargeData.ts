import { Global as G } from 'System/global'
import { StringUtil } from "System/utils/StringUtil"
import { KeyWord } from "System/constants/KeyWord"
import { MathUtil } from "System/utils/MathUtil"

class SCLBWrapVo {
    arr: GameConfig.KFSCLBCfgM[] = [];
    lvMap: { [lv: number]: GameConfig.KFSCLBCfgM } = {};
    maxLv = 0;
}

export class FirstRechargeData {

    /**首充礼包表*/
    private m_scGiftCfgMap: { [day: number]: GameConfig.KFSCLBCfgM[] } = {};


    /**首充礼包数组字典(分组type(首冲还是累冲),类型，天数)*/
    private _sclbTypeDayDic: { [giftType: number]: { [day: number]: { [typeSclb: number]: SCLBWrapVo } } } = {};

    /**首充礼包活动*/
    scValue: Protocol.SCDataInfo;

    onCfgReady(): void {
        let configs: GameConfig.KFSCLBCfgM[] = G.Cfgmgr.getCfg('data/KFSCLBCfgM.json') as GameConfig.KFSCLBCfgM[];
        configs.sort(this.sortFunc);
        for (let config of configs) {
            let giftDayMap = this.m_scGiftCfgMap[config.m_ucDay];
            if (!giftDayMap) {
                this.m_scGiftCfgMap[config.m_ucDay] = giftDayMap = [];
            }
            giftDayMap.push(config);
            let giftTypeMap = this._sclbTypeDayDic[config.m_ucGiftType];
            if (!giftTypeMap) {
                this._sclbTypeDayDic[config.m_ucGiftType] = giftTypeMap = {};
            }
            let typeSclcMap = giftTypeMap[config.m_ucDay];
            if (!typeSclcMap) {
                giftTypeMap[config.m_ucDay] = typeSclcMap = {};
            }
            let typeSclbVo = typeSclcMap[config.m_ucTypeSCLC];
            if (!typeSclbVo) {
                typeSclcMap[config.m_ucTypeSCLC] = typeSclbVo = new SCLBWrapVo();
            }
            if (config.m_ucLevel > typeSclbVo.maxLv) {
                typeSclbVo.maxLv = config.m_ucLevel;
            }
            typeSclbVo.lvMap[config.m_ucLevel] = config;
            typeSclbVo.arr.push(config);
        }
    }


    private sortFunc(a: GameConfig.KFSCLBCfgM, b: GameConfig.KFSCLBCfgM) {
        return a.m_uiRechargeLimit - b.m_uiRechargeLimit;
    }
    ////////////////////////////////////////////// 首充礼包 //////////////////////////////////////////////

    /**更新*/
    updateSCGiftBagCfgByResp(scData: Protocol.SCDataInfo): void {
        this.scValue = uts.deepcopy(scData, this.scValue, true);
    }

    /**
     * 查询指定的首充礼包配置
     * @param giftType
     * @param day
     * @return
     *
     */
    getSCGiftBagConfigByTypeAndDay(day: number): GameConfig.KFSCLBCfgM[] {
        return this.m_scGiftCfgMap[day];
    }

    /**
	* 根据领取状态判断是否隐藏图标
	* @return
	*
	*/
    isNotShowFirstRechargeIcon(): boolean {
        let scInfo: Protocol.SCDataInfo = this.scValue;
        if (scInfo == null) {
            return true;
        }
        for (let i = 0; i < 3; i++) {
            if (!MathUtil.checkPosIsReach(i, scInfo.m_ucGetRFCBit)){
                return false;
            }
        }
        return true;
    }

    /**是否有首充可领取*/
    isHasFirstRechargeCanGet(): boolean {
        let scValue: Protocol.SCDataInfo = this.scValue;
        if (scValue == null) {
            return false;
        }
        let _config: GameConfig.KFSCLBCfgM = this.getSclbConfByTDL(KeyWord.GIFT_TYPE_SC, KeyWord.GIFT_TYPE_ROLE_SC, 1, 1);
        if (!_config) {
            return false;
        }
        if (scValue.m_uiLifeSCTime > 0 || scValue.m_ucGetRFCBit > 0 || scValue.m_uiSCValue > 0) {//首充过了
            if (!MathUtil.checkPosIsReach(0, scValue.m_ucGetRFCBit)) {//第一档没领
                return true;
            }
            //毫秒
            let time = G.SyncTime.getOneZeroTime(G.SyncTime.getCurrentTime()) - G.SyncTime.getOneZeroTime(scValue.m_uiLifeSCTime * 1000);
            //一天 = 86400000毫秒
            if (time >= 86400000 && time < 86400000 * 2) {//第二天
                if (!MathUtil.checkPosIsReach(1, scValue.m_ucGetRFCBit)) {//第二档没领
                    return true;
                }
            } else if (time >= 86400000 * 2) {//第三天以后
                if (!MathUtil.checkPosIsReach(1, scValue.m_ucGetRFCBit)) {//第二档没领
                    return true;
                }
                if (!MathUtil.checkPosIsReach(2, scValue.m_ucGetRFCBit)) {//第三档没领
                    return true;
                }
            }
        } else {
            return false;
        }
        return false;
    }

    /**用分组,类型，天数，档次获取首充礼包配置表*/
    getSclbConfByTDL(groupType: number, type: number, day: number, level: number): GameConfig.KFSCLBCfgM {
        let wrapVo = this.getWrapVo(groupType, type, day);
        return wrapVo ? wrapVo.lvMap[level] : null;
    }

    /**获取最高档次*/
    getMaxLevel(groupType: number, type: number, day: number): number {
        let wrapVo = this.getWrapVo(groupType, type, day);
        return wrapVo ? wrapVo.maxLv : 0;
    }

    /**获取当前进行中档次*/
    getCurrentLevel(type: number, day: number): number {
        if (!this.scValue) {
            return 1;
        }
        let maxLevel: number = this.getMaxLevel(KeyWord.GIFT_TYPE_SC, type, day);
        let level: number = maxLevel + 1;
        for (let i: number = 0; i < maxLevel; i++) {
            let isReach: boolean = MathUtil.checkPosIsReach(i, this.scValue.m_ucGetBitMap);
            if (!isReach) {
                level = i + 1;
                break;
            }
        }
        return level;
    }

    /**获取首冲已完成最低档次*/
    getCurrentCompeleteLevel(type: number, day: number): number {
        if (!this.scValue) {
            return 0;
        }
        let maxLevel: number = this.getMaxLevel(KeyWord.GIFT_TYPE_SC, type, day);
        let level: number = 0;
        for (let i: number = maxLevel; i > 0; i--) {
            let conf: GameConfig.KFSCLBCfgM = this.getSclbConfByTDL(KeyWord.GIFT_TYPE_SC, type, day, i);
            let isReach: boolean = this.scValue.m_uiSCValue >= conf.m_uiRechargeLimit;
            if (isReach) {
                level = i;
                break;
            }
        }
        return level;
    }



    /**用分组,类型，天数获取首充礼包配置表数组*/
    getSclbConfArrByTDL(groupType: number, type: number, day: number): GameConfig.KFSCLBCfgM[] {
        let wrapVo = this.getWrapVo(groupType, type, day);
        if (wrapVo) {
            return wrapVo.arr;
        }
        return [];
    }

    private getWrapVo(groupType: number, type: number, day: number) {
        let giftTypeMap = this._sclbTypeDayDic[type];
        if (giftTypeMap) {
            let dayMap = giftTypeMap[day];
            if (dayMap) {
                return dayMap[groupType];
            }
        }
        return null;
    }

    /**
     * 根据领取状态判断是否不显示图标
     * @return
     *
     */
    public isNotShowMrczIcon(): boolean {
        let scInfo: Protocol.SCDataInfo = this.scValue;
        if (scInfo == null) {
            return true;
        }
        let isGetFirstRecharge = this.isNotShowFirstRechargeIcon();
        if (!isGetFirstRecharge || scInfo.m_ucType == 0 || this.getCurrentLevel(scInfo.m_ucType, scInfo.m_ucDay) > this.getMaxLevel(KeyWord.GIFT_TYPE_SC, scInfo.m_ucType, scInfo.m_ucDay)) {
            return true;
        }
        return false;
    }
    /**是否有每日充值礼包可领*/
    public isHasDailyRechargeCanGet(): boolean {
        let scInfo = this.scValue;
        if (scInfo == null) {
            return false;
        }
        let currentLevel = this.getCurrentLevel(scInfo.m_ucType, scInfo.m_ucDay);
        let _config = this.getSclbConfByTDL(KeyWord.GIFT_TYPE_SC, scInfo.m_ucType, scInfo.m_ucDay, currentLevel);
        if (_config == null) {
            return false;
        }
        let isCanGet = scInfo.m_uiSCValue >= _config.m_uiRechargeLimit;
        return isCanGet;
    }
}