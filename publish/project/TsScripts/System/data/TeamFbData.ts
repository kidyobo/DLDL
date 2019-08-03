import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { CompareUtil } from 'System/utils/CompareUtil'

/**
 * 组队副本数据。
 * @author teppei
 * 
 */
export class TeamFbData {
    /**类型为修炼殿堂。*/
    static TYPE_SMSC: number = 1;

    /**，类型为组队副本。*/
    static TYPE_ZDFB: number = 2;

    /**队伍人数上限。*/
    static TEAM_SIZE: number = 4;

    /**默认战斗力为40000。*/
    static DEFAULT_ZDL: number = 40000;

    /**队伍信息。*/
    teamList: Protocol.CSCross_GetTeamList_Response;

    /**我所属队伍信息。*/
    myTeam: Protocol.Cross_OneTeam;

    /**队长信息，缓存了最近一次组队的队长信息，不管队伍是否还存在。*/
    captain: Protocol.Cross_OneTeamMem;

    /**副本ID。*/
    pinstanceID: number = 0;

    /**是否正在等待同步好数据。*/
    waitSyncRole: boolean;

    /**
     * 是否队长。
     * @return 
     * 
     */
    amICaptain(): boolean {
        if (null == this.captain) {
            return false;
        }
        return CompareUtil.isRoleIDEqual(G.DataMgr.heroData.roleID, this.captain.m_stRoleID);
    }

    updateTeamList(teamList: Protocol.CSCross_GetTeamList_Response) {
        this.teamList = teamList;
        if (teamList.m_usTeamNumber > 1) {
            teamList.m_astTeamList.sort(delegate(this, this.sortTeamList));
        }
    }

    private sortTeamList(a: Protocol.Cross_SimpleOneTeam, b: Protocol.Cross_SimpleOneTeam): number {
        let myWorldID = G.DataMgr.gameParas.worldID;
        let sameSvrA = a.m_usWorldID == myWorldID;
        let sameSvrB = b.m_usWorldID == myWorldID;
        if (sameSvrA != sameSvrB) {
            return sameSvrA ? -1 : 1;
        }

        if (a.m_ucTeamMemNum != b.m_ucTeamMemNum) {
            return b.m_ucTeamMemNum - a.m_ucTeamMemNum;
        }

        if (a.m_ucAutoStart != b.m_ucAutoStart) {
            return b.m_ucAutoStart - a.m_ucAutoStart;
        }

        return 0;
    }

    /**
     * 通过创建/加入/设置队伍、准备、开始挑战进行更新。
     * @param teamInfo
     * 
     */
    updateByCreateJoinSetReadyStart(teamInfo: Protocol.Cross_OneTeam): void {
        this.myTeam = teamInfo;
        this._updateCaptain();
    }

    /**
     * 通过踢出/退出队伍进行更新。
     * @param teamInfo
     * 
     */
    updateByKickQuitTeam(teamInfo: Protocol.Cross_OneTeam): void {
        // 如果自己被人踢出去，也会调用这个接口进行更新的，因此要检查自己是否还在队伍里
        let hasTeam: boolean;
        let myRoleID: Protocol.RoleID = G.DataMgr.heroData.roleID;
        if (teamInfo.m_ucTeamMemNum > 0) {
            for (let memInfo of teamInfo.m_astTeamInfo) {
                if (CompareUtil.isRoleIDEqual(memInfo.m_stRoleID, myRoleID)) {
                    hasTeam = true;
                    break;
                }
            }
        }
        if (hasTeam) {
            this.myTeam = teamInfo;
        }
        else {
            this.myTeam = null;
            this.waitSyncRole = false;
        }
        this._updateCaptain();
    }

    private _updateCaptain(): void {
        if (null != this.myTeam) {
            this.pinstanceID = this.myTeam.m_uiPinstanceID;
            this.captain = this.myTeam.m_astTeamInfo[0];
        }
    }
}
