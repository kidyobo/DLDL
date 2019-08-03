import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { FriendData } from 'System/data/FriendData'
import { IChatComm } from 'System/chat/IChatComm'
import { ChannelData } from 'System/chat/ChannelData'
import { Macros } from 'System/protocol/Macros'
import { CompareUtil } from 'System/utils/CompareUtil'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { TipFrom } from 'System/tip/view/TipsView'
import { ThingData } from "System/data/thing/ThingData"
import { ThingItemData } from "System/data/thing/ThingItemData"
import { IconItem } from 'System/uilib/IconItem'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { Constants } from 'System/constants/Constants'
import { ChannelMsgData } from 'System/chat/ChannelMsgData'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { GroupList, GroupListItem } from 'System/uilib/GroupList'
import { EmailPanel } from 'System/friend/EmailPanel'
import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { FriendViewTab } from 'System/friend/FriendView'
import { RichTextUtil } from 'System/utils/RichTextUtil'
import { EmoijPanel, ChatType } from 'System/chat/EmoijPanel'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { FriendView } from 'System/friend/FriendView'
import { MenuPanelType } from "System/main/view/RoleMenuView"


enum FriendGroupTab {
    RECENT_PAGE = 0,
    FRIEND_PAGE = 1,
    ENERMY_PAGE = 2,
    BLACK_PAGE = 3,
}

class FriendGroupListItem {
    private groupNames: string[] = ['最近联系人', '好友', '仇人', '黑名单'];
    private normalGroupNameText: UnityEngine.UI.Text;
    private selectedGroupNameText: UnityEngine.UI.Text;
    private normalfriendNumberText: UnityEngine.UI.Text;
    private selectedfriendNumberText: UnityEngine.UI.Text;
    private list: List;
    datas: RoleAbstract[];
    private type: FriendGroupTab;
    private listItems: FriendListItem[] = [];

    setcomponents(item: ListItem, list: List, type: FriendGroupTab) {
        this.normalGroupNameText = item.findText('citem/normal/Textnormal');
        this.selectedGroupNameText = item.findText('citem/selected/Textselected');
        this.normalfriendNumberText = item.findText('citem/normal/friendNumber');
        this.selectedfriendNumberText = item.findText('citem/selected/friendNumber');
        this.normalGroupNameText.text = this.groupNames[type];
        this.selectedGroupNameText.text = this.groupNames[type];
        this.list = list;
        this.list.onClickItem = delegate(this, this.onClickList);
        this.type = type;
    }

    update(datas: RoleAbstract[]) {
        this.datas = datas;
        //刷新好友列表
        let onLineNum: number = 0;
        this.list.Count = this.datas.length;
        for (let i = 0; i < this.datas.length; i++) {
            let data = this.datas[i];
            let item = this.getListItem(i, this.list.GetItem(i).gameObject);
            item.update(data);
            if (data.isOnline) {
                onLineNum++;
            }
        }
        let show = uts.format("{0}/{1}", onLineNum, datas.length);
        this.normalfriendNumberText.text = show;
        this.selectedfriendNumberText.text = show;
    }

    updateTip(data: ChannelData) {
        for (let i = 0; i < this.list.Count; i++) {
            let item = this.getListItem(i, this.list.GetItem(i).gameObject);
            if (item.uin == data.roleAbstract.roleID.m_uiUin) {
                item.setTipActive(true);
                break;
            }
        }
    }

    /**通过指定信息加小红点*/
    updateTipByUin(uin: number) {
        for (let i = 0; i < this.list.Count; i++) {
            let item = this.getListItem(i, this.list.GetItem(i).gameObject);
            if (item.uin == uin) {
                item.icon_tip.SetActive(true);
                break;
            }
        }
    }

    setOnClick(index: number = 0) {
        if (this.datas.length == 0) {
            return;
        }
        this.list.Selected = index;
        this.onClickList(index);
    }


    onClickList(index: number) {
        let data = this.datas[index];
        let friendPanel = G.Uimgr.getSubFormByID<FriendPanel>(FriendView, FriendViewTab.FriendPanel);
        if (data != null) {
            FriendPanel.selectedRoleInfo = data;
            FriendPanel.selectedRoleId = data.roleID;
            friendPanel.chatFriendText.text = "与" + data.nickName + "对话";
            let item = this.getListItem(index, this.list.GetItem(index).gameObject);
            item.setTipActive();
        }
        // 先清空
        if (friendPanel != null) {
            friendPanel.clearChatItems();
            friendPanel.recordHistroyMessage();
        }
    }


    private getListItem(index: number, obj: UnityEngine.GameObject): FriendListItem {
        let item: FriendListItem;
        if (index < this.listItems.length) {
            item = this.listItems[index];
        } else {
            item = new FriendListItem();
            item.setComponents(obj);
            this.listItems.push(item);
        }
        return item;
    }

}

class FriendListItem {

    private nameText: UnityEngine.UI.Text;
    private lvText: UnityEngine.UI.Text;
    private profText: UnityEngine.UI.Text;
    private headIcon: UnityEngine.UI.Image;
    private onLineText: UnityEngine.UI.Text;

    private goNormalOnLine: UnityEngine.GameObject;
    private goNoemalOffLine: UnityEngine.GameObject;
    private goSelectedOnLine: UnityEngine.GameObject;
    private goSelectedOffLine: UnityEngine.GameObject;

    //private btn_menu: UnityEngine.GameObject;
    icon_tip: UnityEngine.GameObject;
    private roleInfo: RoleAbstract;

    setComponents(go: UnityEngine.GameObject) {
        //item相关
        this.nameText = ElemFinder.findText(go, "friendName");
        this.lvText = ElemFinder.findText(go, "touxiang/level");
        this.profText = ElemFinder.findText(go, "prefession");
        this.headIcon = ElemFinder.findImage(go, "touxiang/icon");
        this.onLineText = ElemFinder.findText(go, "onLine");
        this.goNormalOnLine = ElemFinder.findObject(go, 'normal/onLine');
        this.goNoemalOffLine = ElemFinder.findObject(go, 'normal/offLine');
        this.goSelectedOnLine = ElemFinder.findObject(go, 'selected/onLine');
        this.goSelectedOffLine = ElemFinder.findObject(go, 'selected/offLine');

        //this.btn_menu = ElemFinder.findObject(go, 'btn_menu');
        this.icon_tip = ElemFinder.findObject(go, 'tip');
        Game.UIClickListener.Get(this.headIcon.gameObject).onClick = delegate(this, this.onClickBtnMenu);
        this.setTipActive();
    }

    get uin() {
        return this.roleInfo.roleID.m_uiUin;
    }

    update(roleAbstract: RoleAbstract) {
        this.roleInfo = roleAbstract;
        this.nameText.text = roleAbstract.nickName;
        this.lvText.text = roleAbstract.lv.toString();
        this.profText.text = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, roleAbstract.prof);
        this.headIcon.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}s', roleAbstract.prof, roleAbstract.gender));
        //在线显示
        if (roleAbstract.isOnline) {
            this.onLineText.text = "(在线)";
            UIUtils.setGrey(this.headIcon.gameObject, false, false);
            this.goNormalOnLine.SetActive(true);
            this.goNoemalOffLine.SetActive(false);
            this.goSelectedOnLine.SetActive(true);
            this.goSelectedOffLine.SetActive(false);
        } else {
            this.onLineText.text = "(离线)";
            UIUtils.setGrey(this.headIcon.gameObject, true, false);
            this.goNormalOnLine.SetActive(false);
            this.goNoemalOffLine.SetActive(true);
            this.goSelectedOnLine.SetActive(false);
            this.goSelectedOffLine.SetActive(true);
        }
        //头像显示
        let profAltas = G.Uimgr.getForm<FriendView>(FriendView).profAltas;
    }

    private onClickBtnMenu() {
        G.ViewCacher.roleMenuView.open(this.roleInfo, MenuPanelType.fromFriendPanel);
    }

    //在消息发来时进行检查,还有选中时刷新
    setTipActive(show: boolean = false) {
        this.icon_tip.SetActive(show);
    }

}


class FriendChatItem {

    //ui
    private chatItem: UnityEngine.GameObject;
    private chatItemRect: UnityEngine.RectTransform;
    private containerRect: UnityEngine.RectTransform;
    private chatBack: UnityEngine.GameObject;
    private chatBackRect: UnityEngine.RectTransform;
    private chatBackSelf: UnityEngine.GameObject;
    private chatBackSelfRect: UnityEngine.RectTransform;
    private chatText: UnityEngine.UI.UIText;
    private chatTextRect: UnityEngine.RectTransform;
    private chatTextUrl: UnityEngine.UI.UITextUrl;
    private roleIcon: UnityEngine.UI.Image;
    //private desArea: UnityEngine.GameObject;
    //private desAreaRect: UnityEngine.RectTransform;

    private vipLvText: UnityEngine.UI.Text;
    private vipLvImg: UnityEngine.UI.Text;
    private vipLvImgRect: UnityEngine.RectTransform;

    private roleNameText: UnityEngine.UI.Text;
    private roleNameRect: UnityEngine.RectTransform;

    //位置信息
    private leftPosX: number = -110;
    private rightPosX: number = 110;
    private startPosY: number = -40;
    private desPosX: number = 204;
    private chatTextPosX: number = -100;



    set commoncent(obj: UnityEngine.GameObject) {
        this.chatItem = obj;
        this.chatItemRect = ElemFinderMySelf.findRectTransForm(this.chatItem);

        let container = ElemFinder.findObject(this.chatItem, 'container');
        this.containerRect = ElemFinderMySelf.findRectTransForm(container);

        this.chatBack = ElemFinder.findObject(this.chatItem, 'container/chatBack');
        this.chatBackRect = ElemFinderMySelf.findRectTransForm(this.chatBack);
        this.chatBackSelf = ElemFinder.findObject(this.chatItem, 'container/chatBackSelf');
        this.chatBackSelfRect = ElemFinderMySelf.findRectTransForm(this.chatBackSelf);

        this.chatText = ElemFinder.findUIText(this.chatItem, "container/Text");
        this.chatTextRect = ElemFinderMySelf.findRectTransForm(this.chatText.gameObject);
        this.chatTextUrl = this.chatText.GetComponentInChildren(UnityEngine.UI.UITextUrl.GetType()) as UnityEngine.UI.UITextUrl;

        this.chatTextUrl.onUrlClick = delegate(this, this.onUrlClick);
        this.roleIcon = ElemFinder.findImage(this.chatItem, 'touxiang/icon');
        //this.desArea = ElemFinder.findObject(this.chatItem, 'des');
        //this.desAreaRect = ElemFinderMySelf.findRectTransForm(this.desArea);

        this.vipLvText = ElemFinder.findText(this.chatItem, 'vip/viplevel');
        this.vipLvImg = ElemFinder.findText(this.chatItem, 'vip');
        this.vipLvImgRect = ElemFinderMySelf.findRectTransForm(this.vipLvImg.gameObject);

        this.roleNameText = ElemFinder.findText(this.chatItem, 'name/playertext');
        this.roleNameRect = ElemFinderMySelf.findRectTransForm(this.roleNameText.gameObject);
    }

    updateChatItemActice(show: boolean) {
        this.chatItem.SetActive(show);
    }


    update(data: ChannelData, posY: number) {
        //填充内容
        this.roleNameText.text = data.roleAbstract.nickName;
        this.roleIcon.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}s', data.roleAbstract.prof, data.roleAbstract.gender));

        if (data.roleAbstract.vipLv > 0) {
            this.vipLvText.text = data.roleAbstract.vipLv.toString();
        } else {
            this.vipLvText.text = "0";
        }

        //计算气泡的大小
        this.chatText.text = data.toRichText();
        this.chatText.ProcessText();
        //拉伸聊天的气泡(根据text文字高宽进行自适应)
        let widthContent = this.chatText.renderWidth;
        let hightContent = this.chatText.renderHeight;
        //30,20分别为聊天背景框的上下左右拉伸距离
        //this.chatBackRect.sizeDelta = new UnityEngine.Vector2(widthContent + 30, hightContent + 20);
        let isMySelf: boolean = data.roleAbstract.roleID.m_uiUin == G.DataMgr.heroData.roleID.m_uiUin;
        if (isMySelf) {
            //自己说话气泡在右边
            //先把基础信息设置好
            //整体
            this.chatItemRect.localRotation = UnityEngine.Quaternion.Euler(0, 180, 0);
            this.chatItemRect.anchoredPosition = new UnityEngine.Vector2(this.rightPosX, posY);

            //说的话
            this.chatTextRect.localRotation = UnityEngine.Quaternion.Euler(0, 180, 0);
            this.chatTextRect.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Left, 0, 0);
            this.chatTextRect.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Top, 0, 0);
            this.chatTextRect.pivot = new UnityEngine.Vector2(1, 1);
            this.chatTextRect.anchoredPosition = new UnityEngine.Vector2(20, -7);
            this.chatText.alignment = UnityEngine.UI.TextAnchor.MiddleRight;
            this.chatTextRect.sizeDelta = new UnityEngine.Vector2(216, 0);

            //聊天框
            this.chatBack.SetActive(false);
            this.chatBackSelf.SetActive(true);
            this.chatBackSelfRect.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Left, 0, 0);
            this.chatBackSelfRect.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Top, 0, 0);
            this.chatBackSelfRect.pivot = new UnityEngine.Vector2(1, 1);
            this.chatBackSelfRect.sizeDelta = new UnityEngine.Vector2(widthContent + 30, hightContent + 20);

            //vip等级
            this.vipLvImgRect.localRotation = UnityEngine.Quaternion.Euler(0, 180, 0);

            //名字
            this.roleNameRect.localRotation = UnityEngine.Quaternion.Euler(0, 180, 0);
            this.roleNameText.alignment = UnityEngine.UI.TextAnchor.MiddleRight;

        } else {
            //气泡在左边
            //整体
            this.chatItemRect.localRotation = UnityEngine.Quaternion.Euler(0, 0, 0);
            this.chatItemRect.anchoredPosition = new UnityEngine.Vector2(this.leftPosX, posY);

            //说的话
            this.chatTextRect.localRotation = UnityEngine.Quaternion.Euler(0, 0, 0);
            this.chatTextRect.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Right, 0, 0);
            this.chatTextRect.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Top, 0, 0);
            this.chatTextRect.pivot = new UnityEngine.Vector2(1, 1);
            this.chatTextRect.anchoredPosition = new UnityEngine.Vector2(0, -7);
            this.chatText.alignment = UnityEngine.UI.TextAnchor.MiddleLeft;
            this.chatTextRect.sizeDelta = new UnityEngine.Vector2(216, 0);

            //聊天框
            this.chatBack.SetActive(true);
            this.chatBackSelf.SetActive(false);
            this.chatBackRect.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Left, 0, 0);
            this.chatBackRect.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Top, 0, 0);
            this.chatBackRect.pivot = UnityEngine.Vector2.one;
            this.chatBackRect.sizeDelta = new UnityEngine.Vector2(widthContent + 30, hightContent + 20);

            //vip等级
            this.vipLvImgRect.localRotation = UnityEngine.Quaternion.Euler(0, 0, 0);

            //名字
            this.roleNameRect.localRotation = UnityEngine.Quaternion.Euler(0, 0, 0);
            this.roleNameText.alignment = UnityEngine.UI.TextAnchor.MiddleLeft;
        }
    }

    /**获取气泡的高度*/
    get qiPaoHight(): number {
        return Math.max(this.chatBackRect.sizeDelta.y, this.chatBackSelfRect.sizeDelta.y);
    }

    /**获取聊天item的pos的Y的值*/
    get ItemPosY(): number {
        return this.chatItemRect.anchoredPosition.y;
    }

    ////////////////////// 点击超链接 ///////////////////////////////
    private onUrlClick(value: string) {
        let msgData = RichTextUtil.getEventData(value);
        if (null != msgData) {
            G.ModuleMgr.chatModule.doLinkAction(msgData);
        }
    }
}


/**好友面板*/
export class FriendPanel extends TabSubForm implements IChatComm {

    /////////////////////////ui////////////////////////////////
    chatInput: UnityEngine.UI.InputField;
    chatFriendText: UnityEngine.UI.Text;
    private friendGroup: GroupList;
    private chatPrefab: UnityEngine.GameObject;
    private chatList: UnityEngine.GameObject;
    private chatMask: UnityEngine.GameObject;
    private chatMaskScrollRect: UnityEngine.UI.ScrollRect;
    private chatPrefabList: UnityEngine.RectTransform;
    private m_chatItems: FriendChatItem[] = [];
    /////////////////////////数据等////////////////////////////////
    static nowSelectedPage: number = FriendGroupTab.FRIEND_PAGE;
    /**选择的聊天好友的id*/
    static selectedRoleId: Protocol.RoleID;
    static selectedRoleInfo: RoleAbstract = null;
    private recentlistData: RoleAbstract[] = new Array<RoleAbstract>();
    private differenceHight: number = 0;
    /**本次使用的聊天item索引*/
    private m_curChatItemIdx: number = 0;
    private m_curInputData: ChannelData;
    /**记录聊天记录*/
    private records: string[] = [];
    ////////////////////其他////////////////////////
    private openRoleAbstracts: RoleAbstract[] = null;
    private isFirstOpen: boolean = true;
    private startChatListWidth: number = 500;
    private menuTypes: number[] = [0, Macros.FRIEND_TYPE_FRIEND, Macros.FRIEND_TYPE_ENEMY, Macros.FRIEND_TYPE_BLACK];


    private friendGroupItems: FriendGroupListItem[] = [];


    constructor() {
        super(FriendViewTab.FriendPanel);
        this.m_curInputData = new ChannelData();
    }

    protected resPath(): string {
        return UIPathData.FriendPanel;
    }

    protected initElements() {
        //聊天面板相关
        this.friendGroup = ElemFinder.getUIGroupList(this.elems.getElement('friendGroup'));
        this.chatFriendText = this.elems.getText("chatFriendText");
        this.chatInput = this.elems.getInputField("chatInput");
        this.chatPrefab = this.elems.getElement("chatPrefab");
        this.chatList = this.elems.getElement("chatList");
        this.chatMask = this.elems.getElement("chatMask");
        this.chatMaskScrollRect = this.chatMask.GetComponent(UnityEngine.UI.ScrollRect.GetType()) as UnityEngine.UI.ScrollRect;
        this.chatPrefabList = this.chatList.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
        //初始化好友group
        this.initFriendGroup();
    }

    protected initListeners() {
        this.addListClickListener(this.friendGroup, this.onClickFriendGroup);
        this.addClickListener(this.elems.getElement("chatSendBt"), this.onClickChatSendBt);
        this.addClickListener(this.elems.getElement("biaoqingBt"), this.onClickFaceBt);
    }

    deleteFriend(role: RoleAbstract) {
        if (FriendPanel.nowSelectedPage == FriendGroupTab.RECENT_PAGE) {
            G.TipMgr.addMainFloatTip("不能对最近联系人进行删除操作");
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDeleteFriendRequest(role.roleID, this.menuTypes[FriendPanel.nowSelectedPage]));
    }


    /**提供私聊的接口*/
    open(roleAbstracts: RoleAbstract[] = null) {
        this.openRoleAbstracts = roleAbstracts;
        super.open();
    }

    protected onOpen() {
        this.updataView();
    }

    protected onClose() {
        this.isFirstOpen = true;  
        this.openRoleAbstracts = null;
        FriendPanel.selectedRoleId = null;
        FriendPanel.selectedRoleInfo = null; 
    }

    private initFriendGroup() {
        //初始化列表
        this.friendGroupItems = [];
        this.friendGroup.Count = 4;
        for (let i = 0; i < 4; i++) {
            let obj = this.friendGroup.GetItem(i);
            let list = this.friendGroup.GetSubList(i);
            let item = new FriendGroupListItem();
            item.setcomponents(obj, list, i);
            this.friendGroupItems.push(item);
        }
    }

    /**刷新面板*/
    updataView(): void {
        for (let i = 0; i < 4; i++) {
            this.friendGroupItems[i].update(this.getDataByType(i));
        }
        if (FriendPanel.selectedRoleInfo == null) {
            this.chatFriendText.text = "请选择一个好友聊天吧";
        }
        if (this.isFirstOpen) {
            this.judgeFirstOpenSelected();
            this.isFirstOpen = false;
        }
    }

    /**收到上下线通知要重新刷新现在选择的人*/
    updateSelectedRoleInfo(roleId: Protocol.RoleID) {
        if (FriendPanel.selectedRoleId == null) return;   
        if (!CompareUtil.isRoleIDEqual(FriendPanel.selectedRoleId, roleId)) return;
        let roleAbstracts: RoleAbstract[] = this.getDataByType(FriendPanel.nowSelectedPage);
        for (let i = 0; i < roleAbstracts.length; i++) {
            if (CompareUtil.isRoleIDEqual(roleAbstracts[i].roleID, roleId)) {
                FriendPanel.selectedRoleInfo = roleAbstracts[i];
                break;
            }
        }
    }

    private getDataByType(type: FriendGroupTab): RoleAbstract[] {
        let friendData = G.DataMgr.friendData;
        let temp: Protocol.GameFriendInfo[];
        let roleAbstracts: RoleAbstract[] = [];
        if (type == FriendGroupTab.RECENT_PAGE) {
            temp = friendData.recentContact;
        } else if (type == FriendGroupTab.FRIEND_PAGE) {
            temp = friendData.gameFriend;
        } else if (type == FriendGroupTab.ENERMY_PAGE) {
            temp = friendData.gameEnemy;
        } else if (type == FriendGroupTab.BLACK_PAGE) {
            temp = friendData.gameBlack;
        }
        //刷新前不要改变当前选择的item(重新判断)
        for (let i = 0; i < temp.length; i++) {
            let info = temp[i];
            let itemData = new RoleAbstract();
            itemData.adaptFromGameFriendInfo(info);
            roleAbstracts.push(itemData);
        }
        return roleAbstracts;
    }


    ////////////////////表情面板(表情,历史记录,装备显示)/////////////
    /**点击表情按钮*/
    private onClickFaceBt() {
        G.ViewCacher.emoijPanel.open(this.records, ChatType.FriendView);
    }

    ///////////////////////////聊天相关////////////////////////////
    appendItem(itemConfig: GameConfig.ThingConfigM, guid: Protocol.ThingGUID, closePanel: boolean): void {
        G.ModuleMgr.chatModule.processInputText(this.m_curInputData);
        let data = G.ActionHandler.getChatLinkData(this.m_curInputData, itemConfig, guid, closePanel);
        this.m_curInputData.listMsgData.push(data);
        this.chatInput.text = this.chatInput.text + data.msg;
    }

    /**点击聊天发送按钮*/
    private onClickChatSendBt() {
        this.m_curInputData.displayMsg = this.chatInput.text;
        G.ModuleMgr.chatModule.processInputText(this.m_curInputData);
        if (this.m_curInputData.displayMsg.length == 0) {
            G.TipMgr.addMainFloatTip('您没有输入任何信息哦');
            return;
        }
        if (FriendPanel.selectedRoleInfo == null) {
            G.TipMgr.addMainFloatTip('请选择一个好友聊天');
            return;
        } else if (!FriendPanel.selectedRoleInfo.isOnline) {
            G.TipMgr.addMainFloatTip('您的好友已经下线啦,不能发送消息');
            return;
        }
        this.m_curInputData.id = Macros.CHANNEL_PRIVATE;
        uts.deepcopy(FriendPanel.selectedRoleId, this.m_curInputData.roleAbstract.roleID);
        G.ModuleMgr.chatModule.sendChat(this.m_curInputData, this);
    }


    clearInput(): void {
        this.chatInput.text = "";
        this.m_curInputData.reset();
    }

    appendText(data: ChannelData, force: boolean): void {
        this.doAppendText(data, force);
        this.updateScrollRect();
    }

    private doAppendText(data: ChannelData, force: boolean) {
        if (FriendPanel.selectedRoleId == null || (data.roleAbstract.roleID.m_uiUin != FriendPanel.selectedRoleId.m_uiUin && data.roleAbstract.roleID.m_uiUin != G.DataMgr.heroData.uin)) {
            //没选人，或者选的人不是该条消息发送者时,就不用刷新界面聊天,加小红点,并且不是自己
            if (FriendPanel.nowSelectedPage == FriendGroupTab.FRIEND_PAGE || FriendPanel.nowSelectedPage == FriendGroupTab.RECENT_PAGE) {
                uts.log("现在选择的index:= " + FriendPanel.nowSelectedPage);
                this.friendGroupItems[FriendPanel.nowSelectedPage].updateTip(data);
            }
            return;
        }
        let chatItem = this.getVacantChatItem();
        chatItem.updateChatItemActice(true);
        //默认位置为-40
        let posY: number = -40;
        if (this.m_curChatItemIdx >= 2) {
            //上一个obj(新产生的obj位置根据上一个obj计算得出)
            let previousItem = this.m_chatItems[this.m_curChatItemIdx - 2];
            //45为两个item的间距
            posY = previousItem.ItemPosY - 45 - previousItem.qiPaoHight;
        }
        chatItem.update(data, posY);
        //记录历史聊天
        if (data.isFromResp) {
            //为自己说的话时
            this.records.push(data.displayMsg);
        }
    }

    private updateScrollRect() {
        if (this.m_curChatItemIdx >= 2) {
            //刷新完聊天气泡后计算出第一和气泡和最后一个气泡的高差
            let frist = this.m_chatItems[0];
            let end = this.m_chatItems[this.m_curChatItemIdx - 1];
            this.differenceHight = frist.ItemPosY - end.ItemPosY + end.qiPaoHight;
        } else {
            this.differenceHight = 0;
        }
        this.chatPrefabList.sizeDelta = new UnityEngine.Vector2(this.startChatListWidth, this.differenceHight + 55);
        this.chatMaskScrollRect.verticalNormalizedPosition = 0;
    }

    private getVacantChatItem(): FriendChatItem {
        let chatItem: FriendChatItem;
        let len: number = this.m_chatItems.length;
        uts.log(this.m_curChatItemIdx + "   " + len);
        if (this.m_curChatItemIdx < len) {
            chatItem = this.m_chatItems[this.m_curChatItemIdx];
            this.m_curChatItemIdx++;
        } else {
            chatItem = new FriendChatItem();
            chatItem.commoncent = UnityEngine.UnityObject.Instantiate(this.chatPrefab, this.chatList.transform, false) as UnityEngine.GameObject;
            this.m_curChatItemIdx++;
            this.m_chatItems.push(chatItem);
        }
        return chatItem;
    }

    /**清理chatList下的节点(有不用的先暂时隐藏起来)*/
    clearChatItems() {
        let len: number = Math.min(this.m_curChatItemIdx, this.m_chatItems.length);
        for (let i: number = 0; i < len; i++) {
            this.m_chatItems[i].updateChatItemActice(false);
        }
        this.m_curChatItemIdx = 0;
    }


    ///////////////////////刷新好友List部分/////////////////////////////////
    /**点击好友group*/
    private onClickFriendGroup(index: number) {
        FriendPanel.nowSelectedPage = index;
        this.friendGroupItems[index].setOnClick(0);
    }

    /**显示历史聊天记录*/
    recordHistroyMessage() {
        let msgs: ChannelData[] = G.DataMgr.chatData.dicChannel[Macros.CHANNEL_PRIVATE];
        for (let i = 0; i < msgs.length; i++) {
            let cdata = msgs[i];
            if (cdata.isFromResp && !CompareUtil.isRoleIDEqual(cdata.dstRoleAbstract.roleID, FriendPanel.selectedRoleId)) {
                continue;
            }
            if (!cdata.isFromResp && !CompareUtil.isRoleIDEqual(cdata.roleAbstract.roleID, FriendPanel.selectedRoleId)) {
                continue;
            }
            this.doAppendText(cdata, false);
        }
        this.updateScrollRect();
    }


    ////////////////////////////私聊,有人找你聊天都在这里处理/////////////////////
    private judgeFirstOpenSelected() {
        if (this.openRoleAbstracts != null) {
            this.showOpenChatFriendTip();
        } else {
            //普通打开默认选中第一个好友即可
            if (G.DataMgr.friendData.gameFriend.length > 0) {
                this.friendGroup.Selected = FriendGroupTab.FRIEND_PAGE;
                FriendPanel.nowSelectedPage = FriendGroupTab.FRIEND_PAGE;
                this.friendGroupItems[FriendGroupTab.FRIEND_PAGE].setOnClick(0);
            } else {
                this.friendGroup.Selected = -1;
            }
        }
        this.openRoleAbstracts = null;
    }


    private showOpenChatFriendTip() {
        //如有多个聊天信息发过来规则就是选中第一个,剩余的要显示红点
        let isfriendSelected: boolean = false;
        let needAddtipUin: number[] = [];
        for (let i = 0; i < this.openRoleAbstracts.length; i++) {
            let data = this.openRoleAbstracts[i];
            if (G.DataMgr.friendData.isMyFriend(data.roleID)) {
                if (!isfriendSelected) {
                    let item = this.friendGroupItems[FriendGroupTab.FRIEND_PAGE];
                    for (let a = 0; a < item.datas.length; a++) {
                        if (data.roleID.m_uiUin == item.datas[a].roleID.m_uiUin) {
                            FriendPanel.nowSelectedPage = FriendGroupTab.FRIEND_PAGE;
                            this.friendGroup.Selected = FriendGroupTab.FRIEND_PAGE;
                            item.setOnClick(a);
                            isfriendSelected = true;
                            break;
                        }
                    }
                } else {
                    needAddtipUin.push(data.roleID.m_uiUin);
                }
            } else {
                //不是好友直接加入到最近联系人列表去聊天(黑名单已在actionHander屏蔽)
                let isHas: boolean = false;
                //判断列表里有没有这个人
                for (let j = 0; j < this.recentlistData.length; j++) {
                    if (this.recentlistData[j].roleID.m_uiUin == data.roleID.m_uiUin) {
                        isHas = true;
                        break;
                    }
                }
                //没有就吧其加到最近联系人列表
                if (!isHas) {
                    G.DataMgr.friendData.addRecentContract(data.roleID, data.nickName, data.lv, data.gender, data.prof, false);
                    this.recentlistData.push(data);
                }
            }
        }
        for (let x = 0; x < needAddtipUin.length; x++) {
            this.friendGroupItems[FriendGroupTab.FRIEND_PAGE].updateTipByUin(needAddtipUin[x]);
        }
        this.referRecentList(isfriendSelected);
    }

    /**重新刷新最近联系人列表(处理陌生人聊天)*/
    private referRecentList(friendSelected: boolean = false) {
        let needAddTipUin: number[] = [];
        let item = this.friendGroupItems[FriendGroupTab.RECENT_PAGE];
        item.update(this.recentlistData);
        let isSelected: boolean = false;
        for (let i = 0; i < this.openRoleAbstracts.length; i++) {
            let roleUin = this.openRoleAbstracts[i].roleID.m_uiUin;
            if (!isSelected && !friendSelected) {
                for (let a = 0; a < item.datas.length; a++) {
                    if (roleUin == item.datas[a].roleID.m_uiUin) {
                        FriendPanel.nowSelectedPage = FriendGroupTab.RECENT_PAGE;
                        this.friendGroup.Selected = FriendGroupTab.RECENT_PAGE;
                        item.setOnClick(a);
                        isSelected = true;
                        break;
                    }
                }
            } else {
                needAddTipUin.push(roleUin);
            }
        }
        for (let x = 0; x < needAddTipUin.length; x++) {
            item.updateTipByUin(needAddTipUin[x]);
        }
    }

}