import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 宝石试炼数据
 * @author rmlio
 *
 */
export class MwslData {
    /**最多6层*/
    static readonly MaxLayer = 4;

    /**
     *1，亮起 /完成
     */
    static readonly STATE_ABLED: number = 1;

    /**
     *0，灭掉 /未完成
     */
    static readonly STATE_DISABLED: number = 0;

    /**格子最大数目*/
    static readonly MAX_SIZE: number = 28;

    private layer2cfgs: { [layer: number]: GameConfig.HistoricalRemainsCfgM[] } = {};

    data: Protocol.HistoricalRemainsPanelRsp = { m_ucPos: 0, m_ucPosStatus: 0, m_ucPreNumber: 0, m_ucRemainResetTimes: 0, m_ucNDRemainTimes: 0, m_uiMDRemainTimes: 0, m_uiMDBuyTimes: 0, m_uiDiceResetTime: 0, m_uiPosLifeStatus: 0, m_ucStage: 1, m_ucStagePassGiftFlag: 0 };

    lastDiceNum = 6;

    onCfgReady(): void {
        let dataList: GameConfig.HistoricalRemainsCfgM[] = G.Cfgmgr.getCfg('data/HistoricalRemainsCfgM.json') as GameConfig.HistoricalRemainsCfgM[];
        for (let cfg of dataList) {
            let cfgArr = this.layer2cfgs[cfg.m_iStage];
            if (null == cfgArr) {
                this.layer2cfgs[cfg.m_iStage] = cfgArr = [];
            }
            cfgArr.push(cfg);
        }
    }

    getLayerCfgs(layer: number): GameConfig.HistoricalRemainsCfgM[] {
        return this.layer2cfgs[layer];
    }

    getCfg(layer: number, id: number): GameConfig.HistoricalRemainsCfgM {
        let cfgArr = this.getLayerCfgs(layer);
        if (null != cfgArr) {
            return cfgArr[id - 1];
        }
        return null;
    }

    setData(data: Protocol.HistoricalRemainsPanelRsp): void {
        this.data = data;
        if (this.data.m_ucStage > 0) {
            let cfgs = this.getLayerCfgs(this.data.m_ucStage);
            let layerSize = cfgs.length;
            if (data.m_ucPos > layerSize) {
                data.m_ucPos = layerSize;
            }
            let max = layerSize - this.data.m_ucPos;
            if (data.m_ucPreNumber > max) {
                data.m_ucPreNumber = max;
            }
        }
        data.m_ucStage = Math.min(data.m_ucStage, MwslData.MaxLayer);
    }

    setPoints(data: Protocol.ThrowDiceRsp): void {
        let cfgs = this.getLayerCfgs(this.data.m_ucStage);
        let layerSize = cfgs.length;
        let max = layerSize - this.data.m_ucPos;
        if (data.m_ucNumber > max) {
            data.m_ucNumber = max;
        }
        this.lastDiceNum = data.m_ucNumber;
        this.data.m_ucPreNumber = data.m_ucNumber;
        this.data.m_uiMDBuyTimes = data.m_uiMDBuyTimes;
        this.data.m_ucNDRemainTimes = data.m_ucNDRemainTimes;
        this.data.m_uiMDRemainTimes = data.m_uiMDRemainTimes;
        this.data.m_ucPosStatus = 0;
    }

    setGotoPos(data: Protocol.GotoPosRsp): void {
        let cfgs = this.getLayerCfgs(this.data.m_ucStage);
        let layerSize = cfgs.length;
        let max = layerSize - this.data.m_ucPos;
        if (data.m_ucNumber > max) {
            data.m_ucNumber = max;
        }
        this.data.m_ucPos = data.m_ucPos;
        this.data.m_ucPreNumber = data.m_ucNumber;
        this.data.m_ucPosStatus = data.m_ucPosStatus;
        if (1 == data.m_ucPosStatus) {
            this.data.m_uiPosLifeStatus |= (1 << data.m_ucPos);
        }
    }

    onOnekeyComplete() {
        this.data.m_ucPosStatus = MwslData.STATE_ABLED;
    }

    onReset(resetTimes: number) {
        this.data.m_ucRemainResetTimes = resetTimes;
    }

    onGetStagePassGift(flag: number) {
        this.data.m_ucStagePassGiftFlag = flag;
    }

    setBuyMagicDiceTimes(data: Protocol.BuyMagicDiceTimesRsp): void {
        this.data.m_uiMDBuyTimes = data.m_uiMDBuyTimes;
        this.data.m_uiMDRemainTimes = data.m_uiRemainTimes;
    }

    getCurPos(): number {
        let pos: number = this.data.m_ucPos + this.data.m_ucPreNumber;
        return pos;
    }

    isLayerAllPassed(layer: number): boolean {
        if (layer != this.data.m_ucStage) {
            return layer < this.data.m_ucStage;
        }
        let cfgs = this.getLayerCfgs(this.data.m_ucStage);
        let layerSize = cfgs.length;
        for (let i = 0; i < layerSize; i++) {
            if (0 == (this.data.m_uiPosLifeStatus & (1 << cfgs[i].m_iID))) {
                return false;
            }
        }
        return true;
    }

    isLayerGiftGot(layer: number) {
        return 0 != (this.data.m_ucStagePassGiftFlag & (1 << layer));
    }

    getLayerActivatedBlockCnt(layer: number): number {
        let cfgs = this.getLayerCfgs(layer);
        let layerSize = cfgs.length;
        let activatedCnt = 0;
        for (let i = 0; i < layerSize; i++) {
            let cfg = cfgs[i];
            if (this.isBlockActivated(cfg)) {
                activatedCnt++;
            }
        }
        return activatedCnt;
    }

    isBlockActivated(cfg: GameConfig.HistoricalRemainsCfgM): boolean {
        if (cfg.m_iStage < this.data.m_ucStage) {
            // 说明这个已经通关了
            return true;
        }

        if (cfg.m_iStage == this.data.m_ucStage) {
            return 0 != (this.data.m_uiPosLifeStatus & (1 << cfg.m_iID));
        }

        return false;
    }

    isComplete(): boolean {
        let curPos: number = this.getCurPos();
        if (curPos <= 0) {
            return true;
        }

        let cfg = this.getCfg(this.data.m_ucStage, curPos);
        if (null != cfg) {
            if (cfg.m_iType == KeyWord.GRID_TYPE_GET_PRIZE ||
                cfg.m_iType == KeyWord.GRID_TYPE_LUCKY_BIRD ||
                cfg.m_iType == KeyWord.GRID_TYPE_RANDOM_PRIZE)
                return true;
            return this.data.m_ucPosStatus == 1;
        }
        return false;
    }

    canDo(): boolean {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_MWSL) && this.data.m_ucStage > 0) {
            // 今天没探索完、有次数
            let cfgs = this.getLayerCfgs(this.data.m_ucStage);
            let layerSize = cfgs.length;
            if (!this.isComplete()) {
                return true;
            }
            let curPos: number = this.getCurPos();
            if (curPos < layerSize && (this.data.m_ucNDRemainTimes > 0 || this.data.m_ucRemainResetTimes > 0 || this.data.m_uiMDRemainTimes > 0)) {
                return true;
            }
            // 可以领层礼包
            for (let i = 0; i < MwslData.MaxLayer; i++) {
                if (!this.isLayerGiftGot(i + 1) && this.isLayerAllPassed(i + 1)) {
                    return true;
                }
            }
        }
        return false;
    }
}
