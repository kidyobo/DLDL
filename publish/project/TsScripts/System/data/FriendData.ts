import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { NetModule } from 'System/net/NetModule'
import { CompareUtil } from 'System/utils/CompareUtil'
import { FriendAddView } from 'System/friend/FriendAddView'
 /**
 * 该类为存放好友数据
 * @author fygame
 *
 */
export class FriendData {

    /**游戏好友列表*/
    gameFriend: Protocol.GameFriendInfo[] = [];

    /**uin - 好友信息*/
    private roleID2friendInfo: { [roleIDKey: string]: Protocol.GameFriendInfo } = {};

    /**游戏宿敌列表*/
    gameEnemy: Protocol.GameFriendInfo[] = [];

    /**uin - 宿敌信息*/
    private roleID2enemyInfo: { [roleIDKey: string]: Protocol.GameFriendInfo } = {};

    /**游戏黑名单列表*/
    gameBlack: Protocol.GameFriendInfo[] = [];

    /**uin - 黑名单信息*/
    private roleID2blackInfo: { [roleIDKey: string]: Protocol.GameFriendInfo } = {};

    /**最近联系人*/
    recentContact: Protocol.GameFriendInfo[] = [];

    /**是否隐藏离线好友*/
    isHideOffline: boolean;

    private _applyVec: Protocol.Friend_Apply_Response[];

    setFriends(infos: Protocol.GameFriendInfo[]) {
        this.gameFriend = infos;
        for (let f of infos) {
            this.roleID2friendInfo[this.getRoleIDKey(f.m_stRoleID)] = f;
        }
    }

    addFriend(info: Protocol.GameFriendInfo) {
        this.gameFriend.unshift(info);
        this.roleID2friendInfo[this.getRoleIDKey(info.m_stRoleID)] = info;
    }

    deleteFriend(roleID: Protocol.RoleID) {
        delete this.roleID2friendInfo[this.getRoleIDKey(roleID)];
        let index = FriendData.getIndexFromList(roleID, this.gameFriend);
        if (index >= 0) {
            this.gameFriend.splice(index, 1);
        }
    }

    /**
     * 是否是我的朋友
     * @param roleID
     * @return
     *
     */
    isMyFriend(roleID: Protocol.RoleID): boolean {
        return null != this.roleID2friendInfo[this.getRoleIDKey(roleID)];
    }

    setEnemys(infos: Protocol.GameFriendInfo[]) {
        this.gameEnemy = infos;
        for (let f of infos) {
            this.roleID2enemyInfo[this.getRoleIDKey(f.m_stRoleID)] = f;
        }
    }

    addEnemy(info: Protocol.GameFriendInfo) {
        this.gameEnemy.unshift(info);
        this.roleID2enemyInfo[this.getRoleIDKey(info.m_stRoleID)] = info;
    }

    deleteEnemy(roleID: Protocol.RoleID) {
        delete this.roleID2enemyInfo[this.getRoleIDKey(roleID)];
        let index = FriendData.getIndexFromList(roleID, this.gameEnemy);
        if (index >= 0) {
            this.gameEnemy.splice(index, 1);
        }
    }

    /**
     *  是否是我的仇人
     * @param roleID
     * @return
     *
     */
    isMyEnemy(roleID: Protocol.RoleID): boolean {
        return null != this.roleID2enemyInfo[this.getRoleIDKey(roleID)];
    }

    setBlacks(infos: Protocol.GameFriendInfo[]) {
        this.gameBlack = infos;
        for (let f of infos) {
            this.roleID2blackInfo[this.getRoleIDKey(f.m_stRoleID)] = f;
        }
    }

    addBlack(info: Protocol.GameFriendInfo) {
        this.gameBlack.unshift(info);
        this.roleID2blackInfo[this.getRoleIDKey(info.m_stRoleID)] = info;
    }

    deleteBlack(roleID: Protocol.RoleID) {
        delete this.roleID2blackInfo[this.getRoleIDKey(roleID)];
        let index = FriendData.getIndexFromList(roleID, this.gameBlack);
        if (index >= 0) {
            this.gameBlack.splice(index, 1);
        }
    }

    /**
     * 是否是黑名单
     * @param roleID
     * @return
     *
     */
    isBlack(roleID: Protocol.RoleID): boolean {
        return null != this.roleID2blackInfo[this.getRoleIDKey(roleID)];
    }

    addRecentContract(roleId: Protocol.RoleID, roleName: string, level: number, gender: number, prefession: number, needSendMsg: boolean = true): void {

        for (let info of this.recentContact) {
            if (CompareUtil.isRoleIDEqual(info.m_stRoleID, roleId)) {
                return;
            }
        }
        let temp: Protocol.GameFriendInfo = {} as Protocol.GameFriendInfo;
        temp.m_stRoleID = {} as Protocol.RoleID;
        uts.deepcopy(roleId, temp.m_stRoleID);
        temp.m_szNickName = roleName;
        temp.m_usLevel = level;
        temp.m_cGender = gender;
        temp.m_cProfession = prefession;
        this.recentContact.push(temp);
        if (this.recentContact.length > Macros.MAX_CONTACT_PER_ROLE) {
            this.recentContact.splice(0, 1);
        }
        if (!needSendMsg) {
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFriendsContactInfo(G.DataMgr.friendData.recentContact));
    }

    updataRecentContract(list: Protocol.ContactList): void {
        if (null == this.recentContact) {
            return;
        }
        let l: number = this.recentContact.length;
        for (let i: number = 0; i < l; i++) {
            for (let j: number = 0; j < list.m_ushNumber; j++) {
                if (this.recentContact[i].m_szNickName == list.m_astContactInfo[j].m_szNickName) {
                    this.recentContact[i].m_cZoneID = list.m_astContactInfo[j].m_cOnline;
                    this.recentContact[i].m_cProfession = list.m_astContactInfo[j].m_cProfession;
                    this.recentContact[i].m_usLevel = list.m_astContactInfo[j].m_shLevel;
                    this.recentContact[i].m_cGender = list.m_astContactInfo[j].m_cGender;
                }
            }
        }
    }

    updataFriendZone(roleID: Protocol.RoleID, zoneId: number): void {
        for (let i = 0; i < this.recentContact.length; i++) {
            if (CompareUtil.isRoleIDEqual(this.recentContact[i].m_stRoleID, roleID)) {
                this.recentContact[i].m_cZoneID = zoneId;
                break;
            }
        }
        for (let i = 0; i < this.gameFriend.length; i++) {
            if (CompareUtil.isRoleIDEqual(this.gameFriend[i].m_stRoleID, roleID)) {
                this.gameFriend[i].m_cZoneID = zoneId;
                break;
            }
        }
    }

    /**
     * 返回列表中存在该ID的索引
     * @param roleID
     * @param list
     * @return
     *
     */
    static getIndexFromList(roleID: Protocol.RoleID, list: Protocol.GameFriendInfo[]): number {
        let len: number = list.length;
        for (let i: number = 0; i < len; i++) {
            if (list[i].m_stRoleID.m_uiSeq == roleID.m_uiSeq && list[i].m_stRoleID.m_uiUin == roleID.m_uiUin) {
                return i;
            }
        }
        return -1;
    }

    /**添加一个申请者*/
    addOneApply(response: Protocol.Friend_Apply_Response): void {
        let isPush: boolean = true;
        for (let applyInfo of this.applyVec) {
            if (CompareUtil.isRoleIDEqual(applyInfo.m_stOperatorRoleID, response.m_stOperatorRoleID)) {
                applyInfo = uts.deepcopy(response, applyInfo, true);
                isPush = false;
                break;
            }
        }
        if (isPush) {
            this.applyVec.push(response);
        }
        //G.ModuleMgr.friendModule.dispatchEvent(Events.updateFriendAddDialog);
        let friendAddView = G.Uimgr.getForm<FriendAddView>(FriendAddView);
        if (friendAddView!=null) {
            friendAddView.updateFriendList();
        }
    }

    /**添加一个申请者*/
    deleteOneApply(roleId: Protocol.RoleID, isAll: boolean = false): void {
        if (!isAll) {
            let $applyVec: Protocol.Friend_Apply_Response[] = this.applyVec;
            let len: number = this.applyVec.length;
            for (let i: number = 0; i < len; i++) {
                let tmpRoleInfo: Protocol.Friend_Apply_Response = $applyVec[i];
                let tmpRoleId: Protocol.RoleID = tmpRoleInfo.m_stOperatorRoleID;
                if (CompareUtil.isRoleIDEqual(tmpRoleId, roleId)) {
                    this.applyVec.splice(i, 1);
                    break;
                }
            }
        }
        else {
            this.applyVec.length = 0
        }
        //G.ModuleMgr.friendModule.dispatchEvent(Events.updateFriendAddDialog);
        let friendAddView = G.Uimgr.getForm<FriendAddView>(FriendAddView);
        if (friendAddView != null) {
            friendAddView.updateFriendList();
        }
    }

    get applyVec(): Protocol.Friend_Apply_Response[] {
        if (!this._applyVec) {
            this._applyVec = new Array<Protocol.Friend_Apply_Response>();
        }
        return this._applyVec;
    }

    private getRoleIDKey(roleID: Protocol.RoleID): string {
        return roleID.m_uiUin + '|' + roleID.m_uiSeq;
    }
}
