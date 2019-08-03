import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { FriendData } from 'System/data/FriendData'
import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { List, ListItem } from 'System/uilib/List'
import { GroupList, GroupListItem } from 'System/uilib/GroupList'
import { ElemFinder } from 'System/uilib/UiUtility'

class FriendAddItem {

    private applyNameText: UnityEngine.UI.Text;
    private applyLevelText: UnityEngine.UI.Text;
    private btn_ok: UnityEngine.GameObject;
    private btn_refuse: UnityEngine.GameObject;


    private roleId: Protocol.RoleID;


    setCommonentPent(item: ListItem) {
        this.applyNameText = item.findText("name");
        this.applyLevelText = item.findText("level");
        this.btn_ok = item.findObject("okBt");
        this.btn_refuse = item.findObject("cancelBt");
        Game.UIClickListener.Get(this.btn_ok).onClick = delegate(this, this.onClickBtnAdd);
        Game.UIClickListener.Get(this.btn_refuse).onClick = delegate(this, this.onClickBtnRefuse);
    }

    update(data: Protocol.Friend_Apply_Response) {
        this.applyNameText.text = data.m_stBaseProfile.m_szNickName;
        this.applyLevelText.text = data.m_stBaseProfile.m_usLevel.toString();
        this.roleId = data.m_stOperatorRoleID;
    }

    private onClickBtnAdd() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getAddFriendRequest(this.roleId, Macros.FRIEND_TYPE_FRIEND));
        G.DataMgr.friendData.deleteOneApply(this.roleId);
    }

    private onClickBtnRefuse() {
        G.DataMgr.friendData.deleteOneApply(this.roleId);
    }
}


export class FriendAddView extends CommonForm {


    private closeBt: UnityEngine.GameObject = null;
    private allAgreeBt: UnityEngine.GameObject = null;
    private allRefuseBt: UnityEngine.GameObject = null;
    private allFriendList: List = null;
    private friendData: FriendData = G.DataMgr.friendData;

    private isAddAlling: boolean;

    constructor() {
        super(0);
    }

    open() {
        super.open();
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.FriendAddView;
    }

    protected initElements() {
        this.closeBt = this.elems.getElement("closeBt");
        this.allAgreeBt = this.elems.getElement("allagreeBt");
        this.allRefuseBt = this.elems.getElement("allrefuseBt");
        this.allFriendList = ElemFinder.getUIList(this.elems.getElement("allList"));
    }
    protected initListeners() {
        this.addClickListener(this.closeBt, this.onClickCloseBt);
        this.addClickListener(this.allAgreeBt, this.onClickAllAgreeBt);
        this.addClickListener(this.allRefuseBt, this.onClickAllRefuseBt);
    }
    protected onOpen() {
        this.updateFriendList();
    }

    protected onClose() {
    }

    private onClickCloseBt() {
        this.close();
    }

    private onClickAllAgreeBt() {
        //全部同意按钮
        if (!this.isAddAlling) {
            this.tryAddFriend();
        }
        else {
            G.TipMgr.addMainFloatTip('正在全部添加中，请勿重复操作');
        }
    }

    private tryAddFriend(): void {
        this.addTimer("friend", 100, 0, this.onTimer);
    }

    private onTimer() {
        let applyVec: Protocol.Friend_Apply_Response[] = this.friendData.applyVec;
        if (applyVec.length > 0) {
            this.isAddAlling = true;
            let deleteApplyInfo: Protocol.Friend_Apply_Response = applyVec.pop();
            this.updateFriendList();
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getAddFriendRequest(deleteApplyInfo.m_stOperatorRoleID, Macros.FRIEND_TYPE_FRIEND));
        }
        else {
            this.onStopTime();
            this.isAddAlling = false;
            this.updateFriendList();
        }
    }

    private onStopTime(): void {
        this.removeTimer("friend");
    }

    private onClickAllRefuseBt() {
        //全部拒绝按钮
        this.friendData.deleteOneApply(null, true);
    }

    public updateFriendList() {
        //刷新申请好友面板
        let applyVec: Protocol.Friend_Apply_Response[] = this.friendData.applyVec;
        let len: number = applyVec.length;
        this.allFriendList.Count = len;
        for (let i = 0; i < len; i++) {
            let applyInfo = applyVec[i];
            let listItem = this.allFriendList.GetItem(i);
            let item = this.getFriendAddItem(i, listItem);
            item.update(applyInfo);
        }
        if (len == 0) {
            G.ViewCacher.mainView.mainChatCtrl.setAddFriendBtActive(false);
        }
    }


    private items: FriendAddItem[] = [];
    private getFriendAddItem(index: number, listItem: ListItem): FriendAddItem {
        if (index < this.items.length) {
            return this.items[index];
        } else {
            let item = new FriendAddItem();
            item.setCommonentPent(listItem);
            this.items.push(item);
            return item;
        }
    }


}