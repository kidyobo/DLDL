import { Global as G } from "System/global"
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { LoginView } from "System/login/view/LoginView"
import { UIPathData } from "System/data/UIPathData"
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ServerOneData, LastLoginData, XiYouServerBigGroup, XiYouServerGroup } from 'System/data/ServerData'
import { UiElements } from "System/uilib/UiElements"

enum ServerGroupTab {
    lastLogin = 0,
    other = 1,
}

class ServerListItem extends ListItemCtrl {
    /**新服图标*/
    private newServerIcon: UnityEngine.GameObject = null;
    /**服务器名字*/
    private serverName: UnityEngine.UI.Text = null;
    /**服务器状态*/
    private state: UnityEngine.UI.Text = null;
    private data: ServerOneData = new ServerOneData();
    private item: UnityEngine.GameObject = null;
    private lastLoginData: LastLoginData;

    setComponents(go: UnityEngine.GameObject) {
        this.item = go;
        this.newServerIcon = ElemFinder.findObject(go, "newServer");
        this.serverName = ElemFinder.findText(go, "serverName");
        this.state = ElemFinder.findText(go, "state");
    }

    setData(data: ServerOneData = null, lastLoginData: LastLoginData = null) {
        this.lastLoginData = lastLoginData;
        if (this.lastLoginData != null) {
            this.data = this.lastLoginData.data;
        } else {
            this.data = data;
        }
    }

    update() {
        let str: string = '';
        if (this.lastLoginData != null) {
            str = this.data.serverName;
            if (this.lastLoginData.name != "" && this.lastLoginData.level != "") {
                str += '\n' + this.lastLoginData.name + ' ' + this.lastLoginData.level + '级';
            }
        } else {
            str = this.data.serverName;
        }
        this.serverName.text = str;
        this.newServerIcon.SetActive(this.data.isNewServer);
        if (this.data.isMaintenance) {
            this.state.text = '维护';
            this.state.color = UnityEngine.Color.white;
            return;
        }
        if (this.data.isFull) {
            this.state.text = '已满';
            this.state.color = UnityEngine.Color.white;
            return;
        }
        this.state.text = this.data.isHot ? "火爆" : "流畅";
        this.state.color = this.data.isHot ? UnityEngine.Color.red : UnityEngine.Color.green;
    }
}



//服务器选择窗口
export class ServerSelectView extends CommonForm {

    protected serverList: List;
    protected serverGroupList: List;
    protected bigServerGroup: List;
    protected serverListItems: ServerListItem[] = [];
    protected max_showCount: number = 10;

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
        return UIPathData.ServerView;
    }

    protected initElements() {
        this.serverList = this.elems.getUIList("ServerList");
        this.serverGroupList = this.elems.getUIList("ServerGroup");
        this.bigServerGroup = this.elems.getUIList("bigGroupList");
    }

    protected initListeners() {
        this.addListClickListener(this.serverList, this.onClickServerList);
        this.addClickListener(this.elems.getElement("btn_return"), this.onClickCancelBt);
        this.addClickListener(this.elems.getElement('mask'), this.onClickCancelBt);
        this.addListClickListener(this.serverGroupList, this.onClickServerGroup);
    }


    protected onOpen() {
        this.bigServerGroup.gameObject.SetActive(G.ChannelSDK.serVerListFromSdk());
        this.initServerGroups();
        G.ServerData.setLastLoginDatas();
    }

    protected onClose() {
    }

    private onClickCancelBt() {
        //点击取消按钮
        let form = G.Uimgr.getForm<LoginView>(LoginView);
        if (form != null) {
            form.mainPanel.SetActive(true);
        }
        this.close();
    }

    /**点击serverGroup*/
    protected onClickServerGroup(index: number) {
        G.AudioMgr.playBtnClickSound();
        this.updateListContent(index);
    }

    private updateListContent(index: number) {
        if (index == ServerGroupTab.lastLogin) {
            //刷新最近登陆列表
            this.updateLastLoginList();
        } else {
            this.updateList(index);
        }
    }

    /**刷新最近登陆列表*/
    private updateLastLoginList() {
        let lastLoginDatas = this.getLastLoginData();
        this.serverList.Count = lastLoginDatas.length;
        for (let i = 0; i < lastLoginDatas.length; i++) {
            let item = this.serverList.GetItem(i);
            let obj = item.gameObject;
            let serveritem = new ServerListItem();
            serveritem.setComponents(obj);
            serveritem.setData(null, lastLoginDatas[i]);
            serveritem.update();
            item.data.serveritem = serveritem;
        }
    }


    protected getListItem(index: number, obj: UnityEngine.GameObject): ServerListItem {
        if (index < this.serverListItems.length) {
            return this.serverListItems[index];
        } else {
            let item = new ServerListItem();
            item.setComponents(obj);
            this.serverListItems.push(item);
            return item;
        }
    }

    /**点击选择服务器*/
    private onClickServerList(index: number) {
        let item = this.serverList.GetItem(index);
        let data: ServerOneData = item.data.serveritem.data;
        let loginView = G.Uimgr.getForm<LoginView>(LoginView);
        if (loginView != null) {
            loginView.setGameParas(data);
            loginView.mainPanel.SetActive(true);
        }
        this.close();
    }

    initServerGroups() { }
    updateList(index: number) { }
    getLastLoginData(): LastLoginData[] { return null }

    protected getNeedSelectedIndex() {
        let index: number = ServerGroupTab.lastLogin;
        if (this.getLastLoginData().length == 0 && this.serverGroupList.Count >= 2) {
            index = ServerGroupTab.other;
        }
        return index;
    }

}


//西游服务器显示规则
export class XiYouServerSelectView extends ServerSelectView {

    private platServerGroup: XiYouServerBigGroup[];
    private nowGroupData: XiYouServerGroup[] = [];
    private nowSelectedGroupName: string = '';

    protected initListeners() {
        super.initListeners();
        this.addListClickListener(this.bigServerGroup, this.onClickBigGroupList);
    }

    protected onOpen() {
        this.platServerGroup = G.ServerData.platServerGroup;
        super.onOpen();
        if (this.platServerGroup.length == 0) return;
        this.bigServerGroup.Selected = 0;
        this.onClickBigGroupList(0);
    }

    private onClickBigGroupList(index: number) {
        this.nowGroupData = this.platServerGroup[index].group;
        this.nowSelectedGroupName = this.platServerGroup[index].name;
        this.updateGroupList(this.nowGroupData);
    }

    initServerGroups() {
        this.bigServerGroup.Count = this.platServerGroup.length;
        for (let i = 0; i < this.platServerGroup.length; i++) {
            let item = this.bigServerGroup.GetItem(i);
            let normalText = item.findText('normal/Textnormal');
            let selectedText = item.findText('selected/Textnormal');
            normalText.text = this.platServerGroup[i].name;
            selectedText.text = this.platServerGroup[i].name;
        }
    }

    private updateGroupList(groupData: XiYouServerGroup[]) {
        this.serverGroupList.Count = groupData.length + 1;
        for (let i = 0; i < this.serverGroupList.Count; i++) {
            let item = this.serverGroupList.GetItem(i);
            let normalText = item.findText('normal/Textnormal');
            let selectedText = item.findText('selected/Textnormal');
            if (i == ServerGroupTab.lastLogin) {
                normalText.text = '最近登陆';
                selectedText.text = '最近登陆';
            } else {
                normalText.text = groupData[i - 1].name;
                selectedText.text = groupData[i - 1].name;
            }
        }
        let index = this.getNeedSelectedIndex();
        this.serverGroupList.Selected = index;
        this.onClickServerGroup(index);
    }

    updateList(index: number) {
        let data = this.nowGroupData[index - 1];
        let serverLists = (data != null) ? data.serverLists : null;
        if (serverLists == null) {
            uts.log('请检查平台服务器列表或者oss服务器列表,只有页签没有服务器列表');
            return;
        }
        this.serverList.Count = serverLists.length;
        for (let i = 0; i < serverLists.length; i++) {
            let item = this.serverList.GetItem(i);
            let obj = item.gameObject;
            let listItem = this.getListItem(i, obj);
            listItem.setData(serverLists[i]);
            listItem.update();
            item.data.serveritem = listItem;
        }
    }

    getLastLoginData(): LastLoginData[] {
        //排除不是大类的最近服务器
        let newLoginDatas: LastLoginData[] = [];
        for (let i = 0; i < G.ServerData.lastLoginDatas.length; i++) {
            let lastData = G.ServerData.lastLoginDatas[i];
            if (lastData.data.groupName == this.nowSelectedGroupName) {
                newLoginDatas.push(lastData);
            }
        }
        return newLoginDatas;
    }

}


export class CommonServerSelectView extends ServerSelectView {

    protected onOpen() {
        super.onOpen();
        let index = this.getNeedSelectedIndex();
        this.serverGroupList.Selected = index;
        this.onClickServerGroup(index);
    }

    initServerGroups() {
        let needCount = Math.ceil(G.ServerData.Count / 10) + 1;
        this.serverGroupList.Count = needCount;
        for (let i = needCount; i > 0; i--) {
            let index = needCount - i;
            let item = this.serverGroupList.GetItem(index);
            let normalText = item.findText('normal/Textnormal');
            let selectedText = item.findText('selected/Textnormal');
            if (index == ServerGroupTab.lastLogin) {
                normalText.text = '最近登陆';
                selectedText.text = '最近登陆';
            } else {
                let from = (i - 1) * 10 + 1;
                let end = i * 10;
                normalText.text = uts.format('{0}-{1}区', from, end);
                selectedText.text = uts.format('{0}-{1}区', from, end);
                item.data.serverData = {
                    serverFrom: from,
                    serverEnd: end,
                    serverIndex: i
                };
            }
        }
    }

    updateList(index: number) {
        let group = this.serverGroupList.GetItem(index);
        if (group == null) return;
        let serverData = group.data.serverData;
        let serverFrom = serverData.serverFrom;
        let serverEnd = serverData.serverEnd;
        let serverIndex = serverData.serverIndex;
        //刷新服务器列表
        this.updateSerVerList(serverFrom, serverEnd, serverIndex);
    }


    /**刷新服务器列表*/
    private updateSerVerList(from: number, end: number, click: number) {
        let serverData = G.ServerData;
        let serverCount = serverData.Count;
        let listCount: number = 0;
        let fromIndex: number = from - 1;
        let endIndex: number = end;
        if (end > serverCount) {
            endIndex = serverCount;
        }
        listCount = endIndex - fromIndex;
        this.serverList.Count = listCount;
        for (let i = fromIndex; i < endIndex; i++) {
            let index: number = 0;
            if (i >= this.max_showCount) {
                index = i - this.max_showCount * (click - 1);
            } else {
                index = i;
            }
            let item = this.serverList.GetItem(index);
            let dataIndex = fromIndex + (endIndex - i - 1);
            let data = serverData.getServerDataByIndex(dataIndex);
            let listItem = this.getListItem(index, item.gameObject);
            listItem.setData(data);
            listItem.update();
            item.data.serveritem = listItem;
        }
    }

    getLastLoginData(): LastLoginData[] {
        return G.ServerData.lastLoginDatas;
    }

}




