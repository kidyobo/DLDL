/**
*宗门成员列表数据 
* @author bondzheng
* 
*/
export class GuildMemberListItemData {

    /**角色ID*/
    m_stRoleID: Protocol.RoleID;

    /**角色BaseProInfo*/
    m_stBaseProfile: Protocol.BaseProfile;

    /**玩家Avatar*/
    m_stAvatarList: Protocol.AvatarList;

    /**职位*/
    m_ucGrade: number = 0;

    /**当前贡献值*/
    m_uiCurGongXian: number = 0;

    /**累计贡献值*/
    m_uiAccGongXian: number = 0;

    /**上次登出时间*/
    m_iLogoutTime: number = 0;

    /**加入时间时间*/
    m_iJoinTime: number = 0;

    /**战斗力*/
    m_iFightVal: number = 0;

    /**是否在线*/
    m_bOnline: number = 0;

    /**是否自己*/
    m_bSelf: boolean;

    /**宗主*/
    m_bChairman: boolean;

    /**副宗主*/
    m_bViceChairman: boolean;
}
