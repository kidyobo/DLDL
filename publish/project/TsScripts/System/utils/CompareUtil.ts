export class CompareUtil {
    /**
	* 比较两个活动状态是否相等。
	* @param a
	* @param b
	* 
	*/
    static isActivityStatusEqual(a: Protocol.ActivityStatus, b: Protocol.ActivityStatus) : boolean
	{
        return a.m_iEndTime == b.m_iEndTime && a.m_iID == b.m_iID && a.m_iNextTime == b.m_iNextTime &&
        a.m_iStartTime == b.m_iStartTime && a.m_ucDoneTimes == b.m_ucDoneTimes &&
        a.m_ucStatus == b.m_ucStatus && a.m_ucMoreThan45Min == b.m_ucMoreThan45Min;
    }

    /**
     * 比较两个RoleID是否相等。
     * @param a
     * @param b
     * 
     */
    static isRoleIDEqual(a: Protocol.RoleID, b: Protocol.RoleID): boolean {
        return a.m_uiUin == b.m_uiUin && a.m_uiSeq == b.m_uiSeq;
    }

    /**
     * 是否同个队伍 
     * @param teamID1
     * @param teamID2
     * 
     */
    static isTeamIDEqual(teamID1: Protocol.TEAMID, teamID2: Protocol.TEAMID): boolean {
        return (teamID1.m_uiCreateTime == teamID2.m_uiCreateTime) && (teamID1.m_uiSeq == teamID2.m_uiSeq);
    }

    /**
     * 比较两个简单数组是否相等。
     * @param a
     * @param b
     */
    static isSimpleArrayEqual(a: any[], b: any[]): boolean {
        let aLen = 0;
        let bLen = 0;
        if (null != a) {
            aLen = a.length;
        }
        if (null != b) {
            bLen = b.length;
        }
        if (aLen != bLen) {
            return false;
        }
        for (let i = 0; i < aLen; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }
}