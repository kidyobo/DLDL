import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 离线礼包数据。
 * @author ghost
 * 
 */
export class OfflineExpData {

    /**离线时间*/
    private m_offlineTime: number = 0;

    /**是否领过*/
    private m_isGet: boolean = false;

    /**30分钟转换的秒数*/
    private static _30M2SECOND: number = 1800;

    updateOfflineTime(time: number): void {
        this.m_offlineTime = time;
    }

    updateGetStatus(isGet: boolean): void {
        this.m_isGet = isGet;
    }

    /**
     * 是否可以领取奖励。
     * 
     */
    canGet(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_LXJY))
            return false;
        if (this.m_offlineTime - OfflineExpData._30M2SECOND > 0 && !this.m_isGet && G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_LXJY)) {
            return true;
        }
        return false;
    }
}
