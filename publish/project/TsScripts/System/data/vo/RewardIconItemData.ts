import { ObjectPool } from 'Common/pool/pool'
import { EnumRewardState } from 'System/constants/GameEnum'
import { Color } from 'System/utils/ColorUtil'

/**
 * <在这里键入Item的中文名>Item的Vo。
 *
 * 本文件代码由模板生成，你可能需要继续修改其他代码文件才能正常使用。
 *
 * @author teppei
 *
 */
export class RewardIconItemData {
    private static _pool = new ObjectPool<RewardIconItemData>(RewardIconItemData);

    /**奖励物品ID，可以是普通物品，也可以是特殊物品的ID，比如货币。*/
    id: number = 0;

    /**奖励数量。*/
    number: number = 0;

    /**如果不是普通物品，比如掉落，tipInfo可以用来显示tip。*/
    tipInfo: string;

    /**如果不是普通物品，比如掉落，iconID可以用来显示图标，支持i开头的图标。*/
    iconID: string;

    /**颜色。*/
    color: number = 0;

    /**奖励领取状态，0为不可领取，1为可领取，2为已领取。默认为1，即有特效且不加灰色滤镜的状态！*/
    state: EnumRewardState = EnumRewardState.NotGot;

    /**有些装备需要显示装备强化等级的*/
    equipEnhanceLevel: number = 0;

    /** 图片是否变回 */
    iconGrey: boolean = false;

    reset(): void {
        this.id = 0;
        this.color = 0;
        this.iconGrey = false;
        this.number = 0;
        this.tipInfo = null;
        this.iconID = null;
        this.equipEnhanceLevel = 0;
        this.state = EnumRewardState.NotGot;
    }

    static alloc(): RewardIconItemData {
        return RewardIconItemData._pool.new();
    }

    static free(ritd: RewardIconItemData): void {
        RewardIconItemData._pool.delete(ritd);
    }

    /**
     * 格式化指定数组的长度，或者获取指定长度的数组。推荐使用本函数格式化。
     * @param length 数组格式化后的长度。
     * @param input 原数组，若长度太长需要截断，过长部分将会返回对象池。
     * @return 
     * 
     */
    static formatVector(length: number, input: RewardIconItemData[] = null): RewardIconItemData[] {
        return RewardIconItemData._pool.formatArray(length, input);
    }

    static freeVector(input: RewardIconItemData[]): void {
        RewardIconItemData._pool.freeArray(input);
    }
}
