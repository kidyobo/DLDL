import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 在线礼包数据。
 * @author teppei
 * 
 */
export class OnlineGiftData {
    /**在线时间相关数据。*/
    onlineGiftData: Protocol.OnlineGiftActivityData;

    /**更新在线礼包数据的时间点，单位秒*/
    updateOnlineGiftAt: number = 0;


    onlineTimes: number[] = [5, 10, 30, 45, 60, 120];
    selectedTime: number = 0;
    /**
     * 更新数据。
     * @param data
     * 
     */
    update(data: Protocol.OnlineGiftActivityData): void {
        this.onlineGiftData = data;
        this.updateOnlineGiftAt = UnityEngine.Time.realtimeSinceStartup;
    }

    /**
     * 是否可以领取奖励。
     * 
     */
    canGet(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_ZXJL))
            return false;

        return (null != this.onlineGiftData && this.onlineGiftData.m_ushNextGift > 0 && this.onlineGiftData.m_ushNextGift * 60 <= Math.floor(UnityEngine.Time.realtimeSinceStartup - this.updateOnlineGiftAt) + this.onlineGiftData.m_ushOnlineTime)
    }
}
