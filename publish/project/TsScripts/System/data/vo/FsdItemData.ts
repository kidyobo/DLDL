import { Global as G } from 'System/global'
import { PinstanceData } from 'System/data/PinstanceData'
import { Macros } from 'System/protocol/Macros'

export enum EnumFsdState {
    CLOSED = 1, 
    LIMITED, 
    OPEN, 
    CHANLLEGING, 
    COMPLETED, 
}

export class FsdItemData {
    /**层数，1-10*/
    layer: number = 0;
    progress: number = 0;
    maxProgress: number = 0;

    diffConfig: GameConfig.PinstanceDiffBonusM;

    get state(): EnumFsdState {
        if (this.progress == 0) {
            if ((this.layer - 1) * PinstanceData.FaShenDianLayersPerId > this.maxProgress) {
                return EnumFsdState.CLOSED;
            }
            else {
                if (this.diffConfig.m_iOpenLevel > G.DataMgr.heroData.level) {
                    return EnumFsdState.LIMITED;
                } else {
                    return EnumFsdState.OPEN;
                }
            }
        }
        else if (this.progress < PinstanceData.FaShenDianLayersPerId) {
            return EnumFsdState.CHANLLEGING;
        }
        else {
            return EnumFsdState.COMPLETED;
        }
    }

    /**
     * 能否扫荡 
     * @return 
     * 
     */
    get canSd(): boolean {
        return Boolean(this.state == EnumFsdState.OPEN && this.layer * PinstanceData.FaShenDianLayersPerId <= this.maxProgress);
    }

    get isShopOpen(): boolean {
        return this.state == EnumFsdState.COMPLETED;
    }
}
