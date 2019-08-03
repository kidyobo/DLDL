import { Macros } from 'System/protocol/Macros'
import { RankListItemData } from 'System/data/vo/RankListItemData'
import { GuildListInfoItemData } from 'System/data/vo/GuildListInfoItemData'
import { GuildMemberListItemData } from 'System/data/vo/GuildMemberListItemData'
import { RoleData, UnitData } from 'System/data/RoleData'
/**
 * 角色简要信息。
 * @author teppei
 * 
 */
export class RoleAbstract {

    /**角色ID。*/
    roleID: Protocol.RoleID;

    /**名字。*/
    nickName: string;

    /**性别。*/
    gender: number = 0;

    /**等级。*/
    lv: number = 0;

    /**职业。*/
    prof: number = 0;

    /**VIP等级。*/
    vipLv: number = 0;

    /**是否在线*/
    isOnline: boolean = false;

    /**QQ会员等级*/
    qzoneLevel: number = 0;

    /**是否为QQ年费会员*/
    qzoneYear: number = 0;

    /**职位*/
    grade: number = 0;

    /**所在场景类型*/
    sceneType: number = 0;

    /**基友类型*/
    friendType: number = 0;

    /**好友战斗力*/
    power: number = 0;

    private static m_pools: RoleAbstract[] = new Array<RoleAbstract>();

    constructor() {
        this.roleID = {} as Protocol.RoleID;
    }

    /**
     * 从GameFriendInfo同步数据。
     * @param info
     * 
     */
    adaptFromGameFriendInfo(info: Protocol.GameFriendInfo): void {
        this.roleID = uts.deepcopy(info.m_stRoleID, this.roleID, true);
        this.nickName = info.m_szNickName;
        this.gender = info.m_cGender;
        this.lv = info.m_usLevel;
        this.prof = info.m_cProfession;
        this.sceneType = info.m_ucSceneType;
        this.friendType = info.m_ucFriendType;
        this.power = info.m_iBattleEffect;
        this.isOnline = info.m_cZoneID != 0;
    }


    /**
     * 从RoleData同步数据。
     * @param data
     * 
     */
    adaptFromRoleData(data: RoleData): void {
        this.roleID = uts.deepcopy(data.roleID, this.roleID, true);
        this.nickName = data.name;
        this.gender = data.gender;
        this.lv = data.level;
        this.vipLv = data.curVipLevel;
        this.prof = data.profession;
    }

    adaptFromGuildMemberInfo(gmi: Protocol.GuildMemberInfo): void {
        this.roleID = uts.deepcopy(gmi.m_stRoleID, this.roleID, true);
        this.nickName = gmi.m_stBaseProfile.m_szNickName;
        this.gender = gmi.m_stBaseProfile.m_cGender;
        this.lv = gmi.m_stBaseProfile.m_usLevel;
        this.prof = gmi.m_stBaseProfile.m_cProfession;
        this.isOnline = gmi.m_bOnline != 0;
        this.grade = gmi.m_ucGrade;
    }

    adaptFromGuildQueryInfo(gmi: Protocol.GuildQueryInfo): void {
        this.roleID = uts.deepcopy(gmi.m_stChairmanID, this.roleID, true);
        this.nickName = gmi.m_szChairmanName;
    }

    adaptFromGuildMoneyInfo(gmi: Protocol.DBWorldGuildMoneyOne): void {
        this.roleID = uts.deepcopy(gmi.m_stLeaderID, this.roleID, true);
        this.nickName = gmi.m_szLeaderName;
    }

    adaptFromTeamMemberInfo(info: Protocol.TeamMemberInfoForNotify): void {
        this.roleID = uts.deepcopy(info.m_stRoleID, this.roleID, true);
        this.nickName = info.m_szNickName;
        this.gender = info.m_ucGenderType;
        this.lv = info.m_usLevel;
        this.vipLv = info.m_cVIPLevel;
        this.prof = info.m_ucProfessionType;
    }

    /**
     * 封神台pvp 
     * @param info
     * 
     */
    adaptFromPvpRole(info: Protocol.OneRolePvpInfoCli): void {
        this.roleID = uts.deepcopy(info.m_stRoleID, this.roleID, true);
        this.nickName = info.m_szNickName;
        this.gender = info.m_cGender
        this.lv = info.m_usLevel;
        this.prof = info.m_cProfession;
    }

    adaptFromGuildMember(data: GuildMemberListItemData): void {
        this.roleID = uts.deepcopy(data.m_stRoleID, this.roleID, true);
        this.nickName = data.m_stBaseProfile.m_szNickName;
        this.gender = data.m_stBaseProfile.m_cGender;
        this.lv = data.m_stBaseProfile.m_usLevel;
        this.prof = data.m_stBaseProfile.m_cProfession;
    }

    adaptFromGuildApplicant(data: Protocol.GuildApplicantInfo): void {
        this.roleID = uts.deepcopy(data.m_stRoleID, this.roleID, true);
        this.nickName = data.m_szNickName;
        this.gender = data.m_chGender;
        this.lv = data.m_usRoleLevel;
        this.prof = data.m_cProfession;
    }

    adaptFromRoleInfo(info: Protocol.RoleInfo): void {
        this.roleID = uts.deepcopy(info.m_stID, this.roleID, true);
        this.nickName = info.m_stBaseProfile.m_szNickName;
        this.gender = info.m_stBaseProfile.m_cGender
        this.prof = info.m_stBaseProfile.m_cProfession;
        this.lv = info.m_stUnitInfo.m_stUnitAttribute.m_allValue[Macros.EUAI_LEVEL];
    }

    adaptFromMsgRoleInfo(info: Protocol.MsgRoleInfo): void {
        this.roleID = uts.deepcopy(info.m_stRoleId, this.roleID, true);
        this.nickName = info.m_szNickName;
        this.gender = info.m_ucGender;
        this.lv = info.m_usLevel;
        this.prof = info.m_ucProf;
    }

    //adaptFromWorldBossItemData(info: WorldBossItemData): void {
    //    this.roleID = uts.deepcopy(info.killerRoleID, this.roleID, true);
    //    this.nickName = info.killerName;
    //}

    adaptFromNearTeamInfo(info: Protocol.NearTeamInfo): void {
        this.roleID = uts.deepcopy(info.m_stRoleID, this.roleID, true);
        this.nickName = info.m_stBaseInfo.m_szNickName;
        this.gender = info.m_stBaseInfo.m_cGender;
        this.lv = info.m_usLevel;
        this.prof = info.m_stBaseInfo.m_cProfession;
    }

    adaptFromRankListItemInfo(info: RankListItemData): void {
        this.roleID = uts.deepcopy(info.rankInfo.m_stRoleID, this.roleID, true);
        this.nickName = info.rankInfo.m_stBaseProfile.m_szNickName;
        this.gender = info.rankInfo.m_stBaseProfile.m_cGender;
        this.lv = info.rankInfo.m_stBaseProfile.m_usLevel;
        this.prof = info.rankInfo.m_stBaseProfile.m_cProfession;
    }

    adaptFromGuildListInfoItemInfo(info: GuildListInfoItemData): void {
        this.roleID = uts.deepcopy(info.leaderRoleID, this.roleID, true);
        this.nickName = info.guildLeader;
    }

    //adaptFromFmtBossKillItemData(fmtBossKillItemData: FmtBossKillItemData): void {
    //    this.roleID = uts.deepcopy(fmtBossKillItemData.killerInfo.m_stRoleID, this.roleID, true);
    //    this.nickName = fmtBossKillItemData.killerInfo.m_szKillerName;
    //}

    adaptOneAllRankInfo(oneAllRankInfo: Protocol.OneAllRankInfo): void {
        this.roleID = uts.deepcopy(oneAllRankInfo.m_stRoleID, this.roleID, true);
        this.nickName = oneAllRankInfo.m_szNickName;
    }

    adaptFrontOneInfo(frontOneInfo: Protocol.FrontOneInfo): void {
        this.roleID = uts.deepcopy(frontOneInfo.m_stRoleID, this.roleID, true);
        this.nickName = frontOneInfo.m_szNickName;
    }

    adaptFromNearRoleInfo(info: Protocol.NearRoleInfo): void {
        this.roleID = uts.deepcopy(info.m_stRoleID, this.roleID, true);

        this.nickName = info.m_stBaseInfo.m_szNickName;
        this.gender = info.m_stBaseInfo.m_cGender;
        this.lv = info.m_usLevel;
        this.prof = info.m_stBaseInfo.m_cProfession;
    }
}
