import { Global as G } from 'System/global'
import { EnumActState, EnumDurationType } from 'System/constants/GameEnum'
import { ActivityData } from 'System/data/ActivityData'
import { Macros } from 'System/protocol/Macros'

/**
 * <在这里键入Item的中文名>Item的Vo。
 *
 * 本文件代码由模板生成，你可能需要继续修改其他代码文件才能正常使用。
 *
 * @author teppei
 *
 */
export class HddtDailyActItemData {
    /**活动配置*/
    config: GameConfig.ActHomeConfigM;

    /**活动状态。*/
    status: Protocol.ActivityStatus;

    /**活动进行阶段*/
    durationType: EnumDurationType = 0;

    /**排序状态*/
    sortStatus: number = 0;

    /**
     * 更新排序状态
     * @param showForTest
     *
     */
    updateSortStatus(): void {
        // 0 运行中， 1未运行， 2已过期
        if (this.status.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) {
            if (this.durationType == EnumDurationType.InDuration) {
                this.sortStatus = EnumActState.RUNNING;
            }
            else if (this.durationType == EnumDurationType.Before) {
                this.sortStatus = EnumActState.GOTORUN;
            }
            else if (this.durationType == EnumDurationType.After) {
                this.sortStatus = EnumActState.HAVERAN;
            }

            // 内网测试用的 只要活动开启，就显示入口
            if (G.DataMgr.runtime.__testact) {
                this.durationType = EnumDurationType.InDuration;
            }
        }
        else {
            if (this.durationType == EnumDurationType.InDuration) {
                this.sortStatus = EnumActState.HAVERAN;
            }
            else if (this.durationType == EnumDurationType.Before) {
                this.sortStatus = EnumActState.GOTORUN;
            }
            else if (this.durationType == EnumDurationType.After) {
                this.sortStatus = EnumActState.HAVERAN;
            }
        }
    }
}