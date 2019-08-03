import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { CompareUtil } from 'System/utils/CompareUtil'
import { RoleData, HeroData } from 'System/data/RoleData'

/**
 *组队数据：队伍信息，队友数据 
 * 
 */
export class TeamData {
    /**队友信息*/
    private m_memberList: Protocol.TeamMemberInfoForNotify[];

    private memberMap: { [uin: number]: Protocol.TeamMemberInfoForNotify } = {};

    /**队长id*/
    captainID: Protocol.RoleID;

    /**是否有队伍*/
    hasTeam: boolean = false;

    /**我自己在队伍里的信息*/
    m_myTeamInfo: Protocol.TeamMemberInfoForNotify;

    /**队伍id*/
    teamID: Protocol.TEAMID;
    /**全部成员*/
    private m_allMemberList: Protocol.TeamMemberInfoForNotify[];

     m_nearTeamInfo: Protocol.NearTeamInfo[];
     m_nearRoleInfo: Protocol.NearRoleInfo[];
    /**招募条件*/
     m_stTeamRestriction: Protocol.TeamRestriction;

    set memberList(value: Protocol.TeamMemberInfoForNotify[]) {
        this.m_memberList = value;
        this.memberMap = {};
        this.m_allMemberList = value.concat();
        this.hasTeam = false;
        let myUIN = G.DataMgr.heroData.roleID.m_uiUin;
        for (let j: number = value.length - 1; j >= 0; j--) {
            let m = value[j];
            this.memberMap[m.m_stRoleID.m_uiUin] = m;
            if (m.m_stRoleID.m_uiUin == myUIN) {
                //if (!this.hasTeam) {
                    //G.DataMgr.mainData.teamShowState = true;
                //}
                this.hasTeam = true;
                this.m_memberList.splice(j, 1);
            }
        }

        if (this.hasTeam && this.m_memberList.length == 0) {
            this.hasTeam = false;
        }
    }

    get myTeamInfo(): Protocol.TeamMemberInfoForNotify {
        let heroData: HeroData = G.DataMgr.heroData;
        if (null == this.m_myTeamInfo) {
            this.m_myTeamInfo = {} as Protocol.TeamMemberInfoForNotify;
            this.m_myTeamInfo.m_szNickName = heroData.name;
            this.m_myTeamInfo.m_ucProfessionType = heroData.profession;
            this.m_myTeamInfo.m_ucGenderType = heroData.gender;
            this.m_myTeamInfo.m_stRoleID = heroData.roleID;
        }

        this.m_myTeamInfo.m_usLevel = heroData.level;
        this.m_myTeamInfo.m_uiFight = heroData.getProperty(Macros.EUAI_FIGHT);

        return this.m_myTeamInfo;
    }

    get memberList(): Protocol.TeamMemberInfoForNotify[] {
        return this.m_memberList;
    }

    get allMemberList(): Protocol.TeamMemberInfoForNotify[] {
        return this.m_allMemberList;
    }

    /**
     *是否是我队友 
     * @param uin
     * @return 
     * 
     */
    isMyTeamMember(roleID: Protocol.RoleID): boolean {
        if (roleID == null) {
            return false;
        }

        if (this.hasTeam) {
            return null != this.memberMap[roleID.m_uiUin];
        }

        return false;
    }

    /**
     * 更新队友数据 
     * @param roleData
     * 
     */
    updateMyTeamList(roleData: RoleData): boolean {
        let m = this.memberMap[roleData.roleID.m_uiUin];
        if (m) {
            m.m_iHitPoint = roleData.getProperty(Macros.EUAI_CURHP);
            m.m_iHitPointCapacity = roleData.getProperty(Macros.EUAI_MAXHP);
            m.m_stPosition.m_uiX = roleData.x;
            m.m_stPosition.m_uiY = roleData.y;
            m.m_uiUnitStatus = roleData.unitStatus;
            return true;
        }
        return false;
    }

    updateMemberHp(roleid: Protocol.RoleID, curHp: number, maxHp: number): void {
        let m = this.memberMap[roleid.m_uiUin];
        if (m) {
            if (curHp >= 0) {
                m.m_iHitPoint = curHp;
            }

            if (maxHp >= 0) {
                m.m_iHitPointCapacity = maxHp;
            }
        }
    }

    refreshTeamMemberPosition(role: Protocol.RoleID, scene: number, point: Protocol.UnitPosition): void {
        let m = this.memberMap[role.m_uiUin];
        if (m) {
            m.m_uiSceneID = scene;
            m.m_stPosition = uts.deepcopy(point, m.m_stPosition, true);
        }
    }


    /**
     *是否队长 
     * @param role
     * @return 
     * 
     */
    isCaptain(roleID: Protocol.RoleID = null): boolean {
        if (roleID == null) {
            roleID = G.DataMgr.heroData.roleID;
        }

        if (this.hasTeam && this.captainID != null && CompareUtil.isRoleIDEqual(this.captainID, roleID)) {
            return true;
        }

        return false;
    }

    /**
     * 主界面那的正常组队
     * @param roleId
     */
    isInMyNormalTeam(roleId: Protocol.RoleID): boolean {
        if (this.m_memberList != null) {
            for (let member of this.m_memberList) {
                if (CompareUtil.isRoleIDEqual(roleId, member.m_stRoleID)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 组队副本的队伍
     * @param roleId
     */
    isInZuDuiTeam(roleId: Protocol.RoleID): boolean {
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        if (!myTeam)
            return false;

        let memInfo: Protocol.Cross_OneTeamMem;
        for (let i = 0; i < myTeam.m_ucTeamMemNum; i++) {
            memInfo = myTeam.m_astTeamInfo[i];
            if (CompareUtil.isRoleIDEqual(memInfo.m_stRoleID, roleId)) {
                return true;
            }
        }
        return false;
    }

}
