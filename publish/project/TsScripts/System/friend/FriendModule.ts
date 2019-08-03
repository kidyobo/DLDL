import { Global as G } from "System/global"
import { DataManager } from "System/data/datamanager"
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { Macros } from "System/protocol/Macros"
import { EventDispatcher } from "System/EventDispatcher"
import { ErrorId } from "System/protocol/ErrorId"
import { FriendView, FriendViewTab } from 'System/friend/FriendView'
import { FriendData } from 'System/data/FriendData'
import { InvitingPlayerView } from "System/team/InvitingPlayerView";
import { CompareUtil } from 'System/utils/CompareUtil'
import { SearchFriendPanel } from 'System/friend/SearchFriendPanel'
import { FriendPanel } from 'System/friend/FriendPanel'
/**
 * Module Name(Generate by CodeRobot)
 */
export class FriendModule extends EventDispatcher {

    constructor() {
        super();
        this.addNetListener(Macros.MsgID_Friend_FetchGameFriend_Response, this._onFetchGameFriendResponse);
        this.addNetListener(Macros.MsgID_Friend_Add_Response, this.onAddFriendResponse);
        this.addNetListener(Macros.MsgID_Friend_Delete_Response, this.onDeleteFriendResponse);
        this.addNetListener(Macros.MsgID_Friend_Search_Response, this.onFriendsQueryResponse);
        this.addNetListener(Macros.MsgID_Friend_Contact_Response, this.onFetchContactResponse);
        this.addNetListener(Macros.MsgID_GetPlayerPos_Response, this.onEnemyPositionResponse);
        this.addNetListener(Macros.MsgID_Friend_LogInOut_Notify, this.onFriendLoginNotify);
        this.addNetListener(Macros.MsgID_Friend_Apply_Response, this.onFriendApplyResponse);

    }

    /**
    * 拉取好友列表响应
    * @param msg
    *
    */
    private _onFetchGameFriendResponse(response: Protocol.Friend_FetchGameFriend_Response): void {

        if (response.m_ushResultID == 0) {
            let data: FriendData = G.DataMgr.friendData;
            data.setFriends(response.m_stGameFriendList.m_astGameFriend ? response.m_stGameFriendList.m_astGameFriend : []);
            data.setEnemys(response.m_stGameFriendList.m_astGameEnemy ? response.m_stGameFriendList.m_astGameEnemy : []);
            data.setBlacks(response.m_stGameFriendList.m_astGameBlack ? response.m_stGameFriendList.m_astGameBlack : []);

            let friendPanel = G.Uimgr.getSubFormByID<FriendPanel>(FriendView, FriendViewTab.FriendPanel);
            if (friendPanel != null) {
                friendPanel.updataView();
            }
            
            let invitingPlayerView = G.Uimgr.getForm<InvitingPlayerView>(InvitingPlayerView);
            if (invitingPlayerView != null) {
                invitingPlayerView.onRefreshMyFriendData();
            }
        }
    }

    ///**
    // * 添加好友回复
    // * 服务器 Response相应函数
    // * @param msg - 返回消息
    // *
    // */
    private onAddFriendResponse(response: Protocol.Friend_Add_Response): void {

        if (response.m_ushResultID != 0) {
            let errorId: number = response.m_ushResultID;
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(errorId));
            return;
        }
        let friendData: FriendData = G.DataMgr.friendData;
        let len: number = 0;
        let index: number = 0;
        if (response.m_ucType == Macros.FRIEND_TYPE_FRIEND) {
            // 将好友加载到数组的第一位
            let m_stGameFriendInfo: Protocol.GameFriendInfo = response.m_stGameFriendInfo;
            friendData.addFriend(m_stGameFriendInfo);
            friendData.deleteOneApply(m_stGameFriendInfo.m_stRoleID);
            //如果在黑名单里要删掉
            friendData.deleteBlack(response.m_stGameFriendInfo.m_stRoleID);
        }
        else if (response.m_ucType == Macros.FRIEND_TYPE_ENEMY) {
            friendData.addEnemy(response.m_stGameFriendInfo);
            G.ModuleMgr.chatModule.appendSystemMsg(uts.format('您已添加{0}为仇人！', response.m_stGameFriendInfo.m_szNickName), false);
        }
        else if (response.m_ucType == Macros.FRIEND_TYPE_BLACK) {
            friendData.addBlack(response.m_stGameFriendInfo);
            //如果在好友名单里要删掉
            friendData.deleteFriend(response.m_stGameFriendInfo.m_stRoleID);
            G.ModuleMgr.chatModule.appendSystemMsg(uts.format('您已添加{0}拉进黑名单！', response.m_stGameFriendInfo.m_szNickName), false);
        }

        let friendPanel = G.Uimgr.getSubFormByID<FriendPanel>(FriendView, FriendViewTab.FriendPanel);
        if (friendPanel != null) {
            friendPanel.updataView();
        }
    }

    /**好友申请回复*/
    private onFriendApplyResponse(response: Protocol.Friend_Apply_Response): void {

        if (0 != response.m_ushResultID) {
            let errorId: number = response.m_ushResultID;
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(errorId));
            return;
        }
        let heroData = G.DataMgr.heroData;
        let isByApply: boolean = CompareUtil.isRoleIDEqual(heroData.roleID, response.m_stTargetRoleID);
        if (isByApply) {
            let friendData: FriendData = G.DataMgr.friendData;
            friendData.addOneApply(response);
            G.ViewCacher.mainView.mainChatCtrl.setAddFriendBtActive(true);
        }
    }

    ///**
    // * 删除好友回复
    // * 服务器 Response相应函数
    // * @param msg - 返回消息
    // *
    // */
    private onDeleteFriendResponse(response: Protocol.Friend_Delete_Response): void {

        if (0 != response.m_ushResultID) {
            let errorId: number = response.m_ushResultID;
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(errorId));
            return;
        }

        let friendData: FriendData = G.DataMgr.friendData;

        let temp: Protocol.GameFriendInfo[];
        if (response.m_ucType == Macros.FRIEND_TYPE_FRIEND) {
            friendData.deleteFriend(response.m_stTargetRoleID);
        }
        else if (response.m_ucType == Macros.FRIEND_TYPE_ENEMY) {
            friendData.deleteEnemy(response.m_stTargetRoleID);
        }
        else if (response.m_ucType == Macros.FRIEND_TYPE_BLACK) {
            friendData.deleteBlack(response.m_stTargetRoleID);
        }
        let friendPanel = G.Uimgr.getSubFormByID<FriendPanel>(FriendView, FriendViewTab.FriendPanel);
        if (friendPanel != null) {
            friendPanel.updataView();
        }
    }

    private onFriendsQueryResponse(response: Protocol.Friend_Search_Response): void {

        if (response.m_stGameFriendList.m_astGameFriend == null) {
            G.TipMgr.addMainFloatTip("没有在线的玩家哦");
            return;
        }
        let searchFriendPanel = G.Uimgr.getSubFormByID<SearchFriendPanel>(FriendView, FriendViewTab.SearchFriendPanel);
        if (searchFriendPanel != null) {
            if (response.m_szNickName != "") {
                //点击查询按钮
                searchFriendPanel.updateSearchFriendData(response.m_stGameFriendList.m_astGameFriend);
            } else {
                //点击推荐好友
                searchFriendPanel.updateRecommandFriend(response.m_stGameFriendList.m_astGameFriend);
            }
        }
    }

    private onFetchContactResponse(response: Protocol.Friend_Contact_Response): void {

        G.DataMgr.friendData.updataRecentContract(response.m_stContactList);
        let friendPanel = G.Uimgr.getSubFormByID<FriendPanel>(FriendView, FriendViewTab.FriendPanel);
        if (friendPanel != null) {
            friendPanel.updataView();
        }
    }

    private onEnemyPositionResponse(response: Protocol.GetPlayerPosResponse): void {

        //let response: Protocol.GetPlayerPosResponse = msg.m_msgBody as Protocol.GetPlayerPosResponse;

        //if (response.m_cLine < 0) {
        //    G.TipMgr.addMainFloatTip('对方已离线');
        //    return;
        //}

        //if (null == this.m_positionDialog) {
        //    this.m_positionDialog = new EnermyPositionDialog();
        //    this.m_positionDialog.initialize(m_manager);
        //}
        //this.m_positionDialog.showOrCloseDialog(true);
        //this.m_positionDialog.updateView(response);
    }

    private onFriendLoginNotify(notify: Protocol.Friend_LogInOut_Notify): void {

        if (notify.m_cAction == 2) {
            //2表示下线
            G.DataMgr.friendData.updataFriendZone(notify.m_stRoleID, 0);
        }
        else {
            //1表示上线
            G.DataMgr.friendData.updataFriendZone(notify.m_stRoleID, notify.m_cZoneID);
        }
        let friendPanel = G.Uimgr.getSubFormByID<FriendPanel>(FriendView, FriendViewTab.FriendPanel);
        if (friendPanel != null) {
            friendPanel.updataView();
            friendPanel.updateSelectedRoleInfo(notify.m_stRoleID);
        }
    }


}