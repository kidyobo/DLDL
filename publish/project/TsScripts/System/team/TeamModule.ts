import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ConfirmCheck } from 'System/tip/TipManager'
import { TeamData } from 'System/data/TeamData'
import { Macros } from 'System/protocol/Macros'
import { TeamView } from 'System/team/TeamView'
import { ErrorId } from 'System/protocol/ErrorId'
import { InvitingPlayerView } from "System/team/InvitingPlayerView"
import { MyTeamView } from "System/team/MyTeamView"
import { NearTeamView } from "System/team/NearTeamView"


/**
 * 组队模块总控制器 
 * @author fygame
 * 
 */
export class TeamModule extends EventDispatcher {
    constructor() {
        super();
        this.addNetListener(Macros.MsgID_OperateTeam_Response, this._onTeamOperationResponse);
        this.addNetListener(Macros.MsgID_OperateTeam_Notify, this._onTeamOperationNotify);
        this.addNetListener(Macros.MsgID_Position_Notify, this._onPositionNotify);
        //拉取队伍信息
        this.addNetListener(Macros.MsgID_ListNearTeamInfo_Response, this.onTeamInfoResponse);
    }

    /**
     * 组队操作响应 
     * TODO 队长变更，下线，退队，死亡时取消强制跟随，该逻辑待添加
     * @param msg
     * 
     */
    private _onTeamOperationResponse(response: Protocol.OperateTeam_Response): void {
        if (response.m_ushResultID != 0) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ushResultID));
        }
    }

    /**
     *组队成员位置同步 
     * @param msg
     * 
     */
    private _onPositionNotify(notify: Protocol.Position_Notify): void {
        // 更新队员位置信息    
        G.DataMgr.teamData.refreshTeamMemberPosition(notify.m_stRoleID, notify.m_iSceneID, notify.m_stPosition);
    }

    /**
     * 组队操作通知 
     * @param msg
     * 
     */
    private _onTeamOperationNotify(notify: Protocol.OperateTeam_Notify): void {
        let teamData: TeamData = G.DataMgr.teamData;
        let oldHasTeam = teamData.hasTeam;
        teamData.memberList = notify.m_stMemberList.m_astTeamMemberDetail;
        teamData.captainID = notify.m_stCaptainRoleID;
        teamData.teamID = notify.m_stTeamID;
        teamData.m_stTeamRestriction = notify.m_stTeamRestriction;
        // 刷新场景中相关unit的名字、是否可捡
        let nowHasTeam = teamData.hasTeam;
        G.ModuleMgr.unitModule.onTeamChanged();

        let teamView = G.Uimgr.getForm<MyTeamView>(MyTeamView);
        if (teamView != null) {
            teamView.refresh();
            teamView.onTeamChanged(!oldHasTeam && nowHasTeam);
        }
        G.ViewCacher.mainView.onTeamChanged();
        G.UnitMgr.processHideRole();
    }

    private onTeamInfoResponse(response: Protocol.ListNearTeamInfo_Response): void {
        if (response.m_ushResultID == ErrorId.EQEC_Success) {
            G.DataMgr.teamData.memberList = response.m_stMemberList.m_astTeamMemberDetail;
            G.DataMgr.teamData.m_nearTeamInfo = response.m_stNearTeamInfo;
            G.DataMgr.teamData.m_stTeamRestriction = response.m_stTeamRestriction;
            G.DataMgr.teamData.m_nearRoleInfo = response.m_stNearRoleInfo;

            let teamView = G.Uimgr.getForm<MyTeamView>(MyTeamView);
            if (teamView != null) {
                teamView.onTeamChanged(false);
            }
            let invitingPlayerView = G.Uimgr.getForm<InvitingPlayerView>(InvitingPlayerView);
            if (invitingPlayerView != null) {
                invitingPlayerView.updataNearPlayerData();
            }

            let nearTeamView = G.Uimgr.getForm<NearTeamView>(NearTeamView);
            if (nearTeamView != null) {
                nearTeamView.updateView();
            }

        }
    }
}
