import { Global as G } from 'System/global'
//import { UIUtils } from 'System/UIUtils'
//import { HfhdCellItemData } from 'System/activity/hfhd/datas/HfhdCellItemData'
//import { HfhdCollectItemData } from 'System/activity/hfhd/datas/HfhdCollectItemData'
//import { EnumSignGiftState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { SyncTime } from 'System/net/SyncTime'
//import { DOUtils } from 'System/utils/DOUtils'
import { DataFormatter } from 'System/utils/DataFormatter'

/**
 * ...
 * @author jesse
 */
export class HfhdData {
    ///** 合服兑换 */
    //hfdh: Protocol.HFCollectWordExchangeInfo;

    /** 合服第几天 */
    day: number = 0;

    /*3天登陆，原先的7天登陆**/
    qtdl: Protocol.HFQDTLInfo;
    private qtdlAllConfigs: GameConfig.HFSevenSignActCfgM[];

    /** 合服累计充值 */
    hfljcz: Protocol.HFLJCZInfo;
    private hflczAllConfigs:GameConfig.HFLJCZCfgM[];

    /**合服累计消费*/
    hfljxf: Protocol.HFLJXFInfo;
    private hfxfAllConfigs: GameConfig.HFLJXFCfgM[];

    /**合服至尊夺宝*/
    hfzzdbData: Protocol.ZZZDOpenPanelRsp;
    hfzzzdIsOpen: boolean = false;

    /**领奖位*/
    static readonly BitMaps: number[] = [0, 1, 3, 7];
    /**合服招财猫*/
    hfzcmInfo: Protocol.HFZCMInfo;
    private hfzcmConfigs: { [id: number]: GameConfig.HFZhaoCaiMaoCfgM };

    /**合服宝箱*/
    hfBaoxiangInfo: Protocol.HFBXYLInfo;
    private hfBaoXiangConfigs: GameConfig.HFBXYLDropCfgM[];
    private hfBaoXiangDuiHuanConfigs: GameConfig.HFBXYLShopCfgM[];


    onCfgReady() {
        this.setHFSevenSignActCfg();
        this.setHFLJCZCfg();
        this.setHFXFCfg();
        this.setHFZCMCfg();
        this.setHFBXYLCfg();
        this.setHFBaoXiangDuiHuanCfg();
    }

    /**7天签到(3天签到)*/
    private setHFSevenSignActCfg() {
        this.qtdlAllConfigs = G.Cfgmgr.getCfg('data/HFSevenSignActCfgM.json') as GameConfig.HFSevenSignActCfgM[];
    }

    getHFSevenSignActCfgs(): GameConfig.HFSevenSignActCfgM[] {
        return this.qtdlAllConfigs;
    }


    /**合服累计充值配置表*/
    private setHFLJCZCfg(): void {
        this.hflczAllConfigs = G.Cfgmgr.getCfg('data/HFLJCZCfgM.json') as GameConfig.HFLJCZCfgM[];
    }

    getHFLJCZCCfgs(): GameConfig.HFLJCZCfgM[] {
        return this.hflczAllConfigs;
    }


    /**合服累计消费配置表*/
    private setHFXFCfg(): void {
        this.hfxfAllConfigs = G.Cfgmgr.getCfg('data/HFLJXFCfgM.json') as GameConfig.HFLJXFCfgM[];
    }

    getHFXFCfgs(): GameConfig.HFLJXFCfgM[] {
        return this.hfxfAllConfigs;
    }

    /**合服招财猫配置表*/
    private setHFZCMCfg(): void {
        this.hfzcmConfigs = {};
        let datas = G.Cfgmgr.getCfg('data/HFZhaoCaiMaoCfgM.json') as GameConfig.HFZhaoCaiMaoCfgM[];
        for (let cfg of datas) {
            this.hfzcmConfigs[cfg.m_iID] = cfg;
        }
    }

    getHFZCMCfgs(id: number): GameConfig.HFZhaoCaiMaoCfgM {
        return this.hfzcmConfigs[id];
    }

    /**合服宝箱有礼配置表*/
    private setHFBXYLCfg(): void {
        this.hfBaoXiangConfigs = G.Cfgmgr.getCfg('data/HFBXYLDropCfgM.json') as GameConfig.HFBXYLDropCfgM[];
    }

    getHFBaoXiangAllConfigs() {
        return this.hfBaoXiangConfigs;
    }


    private setHFBaoXiangDuiHuanCfg() {
        this.hfBaoXiangDuiHuanConfigs=  G.Cfgmgr.getCfg('data/HFBXYLShopCfgM.json') as GameConfig.HFBXYLShopCfgM[];
    }


    getHFBaoXiangDuiHuanAllConfigs() {
        return this.hfBaoXiangDuiHuanConfigs;
    }


    ////////////////////////////////////////合服红点//////////////////////////////////////

    /**
     * 合服3天签到
     */
    isShow3DaySignTipMark(): boolean {
        if (this.qtdl == null) return false;

        let d = G.SyncTime.getDateAfterMergeServer();
        let len = this.qtdlAllConfigs.length;
        for (let i = 0; i < len; i++) {
            let config = this.qtdlAllConfigs[i];
            //没领取
            let btnStatus = (1 << (config.m_iID - 1) & this.qtdl.m_iSignFlag) == 0;
            if (btnStatus) {
                //没有领取，判断当天时间
                if ((this.qtdl.m_iSignFlag == 7)|| (d == config.m_iID && (config.m_iID != len))) {
                    return true;
                }
            }
        }
        return false;
    }


    /**
     * 合服3天累计充值
     */
    isShow3DayLeiChongTipMark(): boolean {

        if (this.hfljcz == null) return false;

        for (let i = 0; i < this.hflczAllConfigs.length; i++) {
            let config = this.hflczAllConfigs[i];
            let btnStatus = (1 << (config.m_iID - 1) & this.hfljcz.m_ucGetBitMap) == 0;
            if (btnStatus && this.hfljcz.m_uiLJZCValue >= config.m_uiRechargeLimit) {
                return true;
            }
        }
        return false;
    }

    /**
  * 合服3天累计消费
  */
    isShow3DayXiaoFeiTipMark(): boolean {

        if (this.hfljxf == null) return false;

        for (let i = 0; i < this.hfxfAllConfigs.length; i++) {
            let config = this.hfxfAllConfigs[i];
            let btnStatus = (1 << (config.m_iID - 1) & this.hfljxf.m_ucGetBitMap) == 0;
            if (btnStatus && this.hfljxf.m_uiLJXFValue >= config.m_uiConsumeLimit) {
                return true;
            }
        }
        return false;
    }


    /**
    * 合服招财猫
    */
    isShowZhaoCaiMaoTipMark(): boolean {
        if (this.hfzcmInfo == null) return false;
        let bit = this.hfzcmInfo.m_ucGetBitMap;
        if (bit == 7) {
            return false;
        } else {
            let curConfig = this.getHFZCMCfgs(HfhdData.BitMaps.indexOf(bit) + 1);
            return (curConfig.m_iCondition1 - this.hfzcmInfo.m_uiAccCharge) <= 0 && G.DataMgr.heroData.gold >= curConfig.m_iCondition2;
        }
    }





    //getRewardStatus(type: number): number {
    //    if (type == EnumHfhdTab.LOGIN) {

    //        return DOUtils.checkPosIsReach(this.day, this.qtdl.m_iSignFlag) ? EnumSignGiftState.HAS_GOT : EnumSignGiftState.NOT_GOT;
    //    }
    //    return 1;
    //}

    //getOpenPage(type: number): boolean {
    //    return true;
    //}

    //getRewardCount(type: number): number {
    //    let count: number = 0;
    //    if (type == EnumHfhdTab.LOGIN) {
    //        if (this.qtdl == null)
    //            return 0;
    //        if (this.getRewardStatus(type) == EnumSignGiftState.NOT_GOT)
    //            return 1;
    //        return 0
    //    }
    //    else if (type == EnumHfhdTab.COLLECT) {
    //        if (this.hfdh == null)
    //            return 0;
    //        let items: HfhdCollectItemData[] = G.DataMgr.cfg.hfhdJzshlItems;
    //        for (let item of items) {
    //            if (item.rewardState == EnumSignGiftState.NOT_GOT)
    //                count++;
    //        }
    //        return count;
    //    }
    //    else if (type == EnumHfhdTab.CHARGE_REWARD) {
    //        if (this.hfljcz == null)
    //            return 0;
    //        let cfgs: [] = G.DataMgr.cfg.getHfljczCfgs(this.day);
    //        for (let cfg of cfgs) {
    //            if (this.hfljcz.m_uiLJZCValue < cfg.m_uiRechargeLimit)
    //                continue;
    //            if (!DOUtils.checkPosIsReach(cfg.m_ucLevel - 1, this.hfljcz.m_ucGetBitMap))
    //                count++;
    //        }
    //        return count;
    //    }
    //    return 0;
    //}

    ///** 获得开服活动可以领取奖励的总次数 */
    //getSumCount(): number {
    //    let count: number = 0;
    //    count += this.getRewardCount(EnumHfhdTab.LOGIN);
    //    count += this.getRewardCount(EnumHfhdTab.COLLECT);
    //    count += this.getRewardCount(EnumHfhdTab.CHARGE_REWARD);
    //    return count;
    //}




    ///*
    // * 开服活动宗门争霸时间
    // * @return
    // *
    // */
    //getActivityGuildPvpTime(): string {
    //    let syncTime: SyncTime = G.SyncTime;
    //    let day: number = syncTime.getDateAfterStartServer() - this.day;

    //    let beginTime: number = G.SyncTime.m_uiServerStartTime + day * 24 * 3600;
    //    let overTime: number = beginTime + 1 * 24 * 3600;
    //    return getLang(91, DataFormatter.second2yyyymmdd(overTime));
    //}




    ///**
    // *活动开始到结束时间
    // * @return
    // *
    // */
    //getActivityTime(): string {
    //    let syncTime: SyncTime = G.SyncTime;
    //    let day: number = syncTime.getDateAfterStartServer() - this.day;

    //    let beginTime: number = G.SyncTime.m_uiServerStartTime + day * 24 * 3600;
    //    let overTime: number = beginTime + 6 * 24 * 3600;
    //    return getLang(72, DataFormatter.second2yyyymmdd(beginTime), DataFormatter.second2yyyymmdd(overTime));
    //}

}

