/**
 * 星星点灯
 * @author lyl
 */
export class XxddData {
    xxddInfo: Protocol.DDLOpenPanelRsp;
    xxddRankInfo: Protocol.DDLOpenRankPanelRsp;
    private _xxddMyRecord: Protocol.DDLRecord[]


    /**更新打开点灯面板数据*/
    updatePanelData(m_stDDLPanelRsp: Protocol.DDLOpenPanelRsp): void {
        this.xxddInfo = m_stDDLPanelRsp;
    }

    /**刷新列表数据*/
    updateFreshData(m_stDDLFreshRsp: Protocol.DDLFreshRsp): void {
        if (this.xxddInfo) {
            this.xxddInfo.m_stDLListInfo = m_stDDLFreshRsp.m_stDLListInfo;
            this.xxddInfo.m_ucNum = m_stDDLFreshRsp.m_ucNum;
        }
    }

    /**点灯跨服排行榜响应*/
    updateRankPanelData(m_stDDLRankPanelRsp: Protocol.DDLOpenRankPanelRsp): void {
        this.xxddRankInfo = m_stDDLRankPanelRsp;
    }

    /**更新我的记录数据*/
    updateMyRecordData(m_stDDLLightRsp: Protocol.DDLOnLightRsp): void {
        for (let record of m_stDDLLightRsp.m_astRecordList) {
            if (record.m_iThingID && record.m_iThingNumber) {
                this.xxddMyRecord.push(record);
            }
        }
    }

    /**更新星星点灯领取参与奖励*/
    updateRankGetRewardData(m_ucDDLRewardRsp: number): void {
        if (this.xxddRankInfo) {
            this.xxddRankInfo.m_ucState = m_ucDDLRewardRsp;
        }
    }

    get xxddMyRecord(): Protocol.DDLRecord[] {
        if (!this._xxddMyRecord) {
            this._xxddMyRecord = new Array<Protocol.DDLRecord>();
        }
        return this._xxddMyRecord;
    }

}

