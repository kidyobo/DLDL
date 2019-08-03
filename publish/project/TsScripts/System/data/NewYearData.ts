import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'

/**
 * 新年活动 - 大小年
 */
export class NewYearData {

    cjfuncToGroupId: { [id: number]: number } = {};


    chunJieCfgs: { [type: number]: Protocol.LoginChargeActCfg_Server[] } = {};

    //info: Protocol.HJXNActRsp;
    cjinfo: Protocol.SpringChargeActRsp;
    //lianXuChongZhiInfo: Protocol.LXCZActRsp;

    //春节登陆活动的数据
    cjLoginInfo: Protocol.SpringLoginActRsp;

    //跨服年兽数据
    kfnsInfo: Protocol.KFNSActOpenRsp;

    loginChargeRsp: Protocol.LoginChargeActCfg_Server[];

    /**充值折扣配置*/
    //zheKouCfgs: GameConfig.ChargeRebateConfigM[];
    zheKouCounts: number[] = [];
    //zheKouCount2Cfgs: { [count: number]: GameConfig.ChargeRebateConfigM[] } = {};

    onCfgReady() {

        ////春节活动_折扣充值
        //this.zheKouCfgs = G.Cfgmgr.getCfg('data/ChargeRebateConfigM.json') as GameConfig.ChargeRebateConfigM[];
        //for (let cfg of this.zheKouCfgs) {
        //    let cfgArr = this.zheKouCount2Cfgs[cfg.m_iChargeCount];
        //    if (null == cfgArr) {
        //        this.zheKouCounts.push(cfg.m_iChargeCount);
        //        this.zheKouCount2Cfgs[cfg.m_iChargeCount] = cfgArr = [];
        //    }
        //    cfgArr.push(cfg);
        //}

    }

    //private sortId(a: GameConfig.HJXNActCfgM, b: GameConfig.HJXNActCfgM): number {
    //    return a.m_iID - b.m_iID;
    //}


   

   

    //private newYearSmallCfgs: { [type: number]: Protocol.HJXNActCfg_Server[] } = {};
    private funcToGroupId: { [id: number]: number } = {};
    private isTrue: boolean = true;

    //getXiaoNianActRsp(resp: Protocol.HJXNActRsp) {
    //    this.info = resp;
    //    this.newYearSmallCfgs = [];

    //    for (let config of resp.m_stCfgList) {
    //        if (this.newYearSmallCfgs[config.m_ucActType] == null) {
    //            this.newYearSmallCfgs[config.m_ucActType] = [];
    //        }
    //        this.newYearSmallCfgs[config.m_ucActType].push(config);
    //    }

    //    this.funcToGroupId[KeyWord.OTHER_FUNCTION_NEWYEARCHARGE_SMALL] = KeyWord.GROUP_HJXN_CHARGE;
    //    this.funcToGroupId[KeyWord.OTHER_FUNCTION_NEWYEARStAGE_SMALL] = KeyWord.GROUP_HJXN_LEVEL;
    //    this.funcToGroupId[KeyWord.OTHER_FUNCTION_NEWYEARVIP_SMALL] = KeyWord.GROUP_HJXN_VIP;


    //    let cfgs1 = this.getNewYearSmallCfg(KeyWord.OTHER_FUNCTION_NEWYEARCHARGE_SMALL);
    //    if (cfgs1) {
    //        cfgs1.sort(this.sortActId);
    //    }

    //    let cfgs2 = this.getNewYearSmallCfg(KeyWord.OTHER_FUNCTION_NEWYEARStAGE_SMALL);
    //    if (cfgs2) {
    //        cfgs2.sort(this.sortActId);
    //    }

    //    let cfgs3 = this.getNewYearSmallCfg(KeyWord.OTHER_FUNCTION_NEWYEARVIP_SMALL);
    //    if (cfgs3) {
    //        cfgs3.sort(this.sortActId);
    //    }
    //    //this.getNewYearSmallCfg(KeyWord.OTHER_FUNCTION_NEWYEARCHARGE_SMALL).sort(this.sortActId);
    //    //this.getNewYearSmallCfg(KeyWord.OTHER_FUNCTION_NEWYEARStAGE_SMALL).sort(this.sortActId);
    //    //this.getNewYearSmallCfg(KeyWord.OTHER_FUNCTION_NEWYEARVIP_SMALL).sort(this.sortActId);
    //    this.isTrue = false;

    //}

    //private sortActId(a: Protocol.HJXNActCfg_Server, b: Protocol.HJXNActCfg_Server): number {
    //    return a.m_iID - b.m_iID;
    //}

    //getNewYearSmallCfg(type: number): Protocol.HJXNActCfg_Server[] {
    //    if (this.funcToGroupId[type]) {
    //        return this.newYearSmallCfgs[Number(this.funcToGroupId[type])];
    //    }
    //    return null;
    //}

    isShowLoginTipMark(): boolean {
        return false;
        //if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_NEWYEARVIP_SMALL)) {
        //    return false;
        //}

        //if (this.info == null) return false;
        //let cfgs = this.getNewYearSmallCfg(KeyWord.OTHER_FUNCTION_NEWYEARVIP_SMALL);

        //if (!cfgs)
        //    return false;

        //for (let config of cfgs) {
        //    let status = this.checkPos(config.m_iID, this.info.m_uiVipRewardFlag);
        //    if (!status && G.DataMgr.heroData.curVipLevel >= config.m_iCondition3) {
        //        return true;
        //    }
        //}

        //return false;
    }

    isShowStageTipMark(): boolean {
        return false;
        //if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_NEWYEARStAGE_SMALL)) {
        //    return false;
        //}

        //if (this.info == null) return false;
        //let cfgs = this.getNewYearSmallCfg(KeyWord.OTHER_FUNCTION_NEWYEARStAGE_SMALL);
        //if (!cfgs)
        //    return false;
        //for (let config of cfgs) {
        //    let status = this.checkPos(config.m_iID, this.info.m_uiLevelRewardFlag);
        //    if (!status && G.DataMgr.zhufuData.getTianZhuStage() >= config.m_iCondition2) {
        //        return true;
        //    }
        //}
        //return false;
    }

    isShowChargeTipMark(): boolean {
        return false;
        //if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_NEWYEARCHARGE_SMALL)) {
        //    return false;
        //}

        //if (this.info == null) return false;

        //let cfgs = this.getNewYearSmallCfg(KeyWord.OTHER_FUNCTION_NEWYEARCHARGE_SMALL);
        //if (!cfgs)
        //    return false;
        //for (let config of cfgs) {
        //    let status = this.checkPos(config.m_iID, this.info.m_uiChargeRewardFlag);
        //    if (!status && this.info.m_iChargeValue >= config.m_iCondition1) {
        //        return true;
        //    }
        //}
        //return false;
    }


    private cjsortId(a: Protocol.LoginChargeActCfg_Server, b: Protocol.LoginChargeActCfg_Server): number {
        return a.m_iID - b.m_iID;
    }

    getChunJieHuoDongCfg(type: number): Protocol.LoginChargeActCfg_Server[] {
        if (this.cjfuncToGroupId[type]) {
            return this.chunJieCfgs[Number(this.cjfuncToGroupId[type])];
        }
    }

    isLianXuChongZhiTipMark(): boolean {
        return false;
        //if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_LIANXUCHONGZHI)) {
        //    return false;
        //}
    }

    iscjhdShowLoginTipMark(): boolean {
        if (this.cjinfo == null) return false;
        let cfgs = this.cjinfo.m_stGetCfgList;
        for (let config of cfgs) {
            let status = this.checkPos(config.m_iID, this.cjinfo.m_uiChargeRewardFlag);
            if (!status && this.cjinfo.m_iChargeValue >= config.m_iCondition1) {
                return true;
            }
        }
        return false;
    }

    isChunJieLoginTipMark(): boolean {

        if (this.cjLoginInfo == null) return false;
        let cfgs = this.cjLoginInfo.m_stGetCfgList;
        for (let config of cfgs) {
            let status = this.checkPos(config.m_iID, this.cjLoginInfo.m_uiLoginRewardFlag);
            if (!status && this.cjLoginInfo.m_iLoginDay >= config.m_iCondition2) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查状态为， true 已领取， false 未领取
     * @param id //配置id 从1开始
     * @param flag
     */
    checkPos(id: number, flag: number): boolean {
        return (1 << (id - 1) & flag) > 0;
    }

    getKfnsBossState(): boolean {
        if (this.kfnsInfo && this.kfnsInfo.m_bBossAlive == 1) {
            return true;
        }
        return false;
    }
}