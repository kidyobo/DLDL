import { BuffInfoData } from 'System/buff/BuffInfoData'
/**
* 角色身上的buff数据 
* @author fygame
* 
*/
export class BuffDataList {
    /**
     * [buffID, buffInfoData]对 
     */
    buffDatas: { [id: number]: BuffInfoData } = {};

    /**
     * 销毁函数 
     * 
     */
    destroy(): void {
        this.buffDatas = null;
    }

    getBuffInfoData(buffID: number): BuffInfoData {
        return this.buffDatas[buffID];
    }

    /**
     *  增加某个buff数据 
     * @param buffInfo
     * 
     */
    addBuffData(buffInfo: Protocol.BuffInfo, buffConfig: GameConfig.BuffConfigM): BuffInfoData {
        let infoData: BuffInfoData = this.getBuffInfoData(buffInfo.m_iBuffID);
        if (null == infoData) {
            this.buffDatas[buffInfo.m_iBuffID] = infoData = new BuffInfoData(buffInfo, buffConfig);
        }

        infoData.beginTime = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);
        infoData.buffInfo = buffInfo;
        return infoData;
    }

    /**
     * 删除某个buff数据 
     * @param buffID
     * 
     */
    deleteBuffData(buffID: number): void {
        delete this.buffDatas[buffID];
    }

    /**
     * 删除所有的buff数据
     * 
     */
    getAllBuffId(): number[] {
        let allIds: number[] = [];
        for (let buffIdKey in this.buffDatas) {
            allIds.push(parseInt(buffIdKey));
        }
        return allIds;
    }

    /**
     * 在每个周期内需要先处理下数据 
     * @return 
     * 
     */
    processBuffData(): number[] {
        let deleteIds: number[] = [];
        for (let buffIdKey in this.buffDatas) {
            let buffInfoData = this.buffDatas[buffIdKey];
            if (this._shouldBuffDie(buffInfoData)) {
                deleteIds.push(buffInfoData.config.m_uiBuffID);
            }
        }
        return deleteIds;
    }

    /**
     * 在每个周期的时候进行适当的判断，判断buff的时间是否到了等
     * @param buff
     * 
     */
    private _shouldBuffDie(buff: BuffInfoData): boolean {
        let remainTime = buff.buffInfo.m_iBuffRemainTime;
        if (remainTime != 0 && Math.round(UnityEngine.Time.realtimeSinceStartup * 1000) - buff.beginTime >= remainTime)//时间到了移除buff
        {
            return true;
        }
        return false;
    }
}
