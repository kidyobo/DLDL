import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { FriendViewTab } from 'System/friend/FriendView'
import { UIUtils } from 'System/utils/UIUtils'
import { FriendView } from 'System/friend/FriendView'

/**搜索好友面板*/
export class SearchFriendPanel extends TabSubForm {

    private m_queryTf: UnityEngine.UI.InputField = null;
    private searchPerson: UnityEngine.GameObject = null;
    private friendRandomTimeText: UnityEngine.UI.Text = null;
    private m_friendInfo: Protocol.GameFriendInfo;
    private m_addBtn: UnityEngine.GameObject = null;
    private m_tfName: UnityEngine.UI.Text = null;
    private m_tfLevel: UnityEngine.UI.Text = null;
    private recommandFriendList: UnityEngine.GameObject = null;
    private btn_changeBatch: UnityEngine.GameObject = null;
    private btn_search: UnityEngine.GameObject = null;
    private profAltas: Game.UGUIAltas = null;
    private recommondPersons: UnityEngine.GameObject[] = [];



    private friendDatas: Protocol.GameFriendInfo[];
    private max_recommond: number = 8;



    constructor() {
        super(FriendViewTab.SearchFriendPanel);
    }

    protected resPath(): string {
        return UIPathData.SearchFriendPanel;
    }

    protected initElements() {

        this.m_queryTf = this.elems.getInputField("searchFriendInput");
        this.searchPerson = this.elems.getElement("searchPerson");
        this.friendRandomTimeText = this.elems.getText("btnName");
        this.m_addBtn = this.elems.getElement("addFriendBt");
        this.m_tfName = this.elems.getText("Rolename");
        this.m_tfLevel = this.elems.getText("Rolelevel");
        this.btn_changeBatch = this.elems.getElement("changeFriendBt");
        this.recommandFriendList = this.elems.getElement("list");
        this.btn_search = this.elems.getElement("searchPlayerBt");
        for (let i = 0; i < this.max_recommond; i++) {
            let obj = this.recommandFriendList.transform.GetChild(i).gameObject;
            obj.SetActive(false);
            this.recommondPersons.push(obj);
        }
        this.profAltas = G.Uimgr.getForm<FriendView>(FriendView).profAltas;
        this.searchPerson.SetActive(false);
    }


    protected initListeners() {
        this.addClickListener(this.m_addBtn, this.onBtnAddClick);
        this.addClickListener(this.btn_changeBatch, this.onClickChangeFriendBt);
        this.addClickListener(this.btn_search, this.onBtnQueryClick);
    }

    open() {
        super.open();
    }
    protected onOpen() {
        UIUtils.setButtonClickAble(this.btn_changeBatch, true);
        this.friendRandomTimeText.text = "换一批";
    }


    protected onClose() {
    }

    /////////////////////////// 事件处理 ////////////////////////////
    /**
    * 点击查询好友按钮 
    * @param event
    * 
    */
    private onBtnQueryClick(): void {
        let friendName: string = this.m_queryTf.text;
        if (friendName == "") {
            // 不能是空输入
            G.TipMgr.addMainFloatTip("请输入一个玩家姓名");
            return;
        } if (friendName == G.DataMgr.heroData.name) {
            G.TipMgr.addMainFloatTip("无法查找本人的信息");
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFriendsQueryRequest(friendName));
    }

    /**
    * 点击换一批推荐好友按钮
    * @param event
    * 
    */
    private onClickChangeFriendBt() {
        //发送空字符串一次最多随机四个推荐好友
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFriendsQueryRequest(""));
        UIUtils.setButtonClickAble(this.btn_changeBatch, false);
        this.friendRandomTimeText.text = "换一批(5)";
        this.addTimer("1", 1000, 5, this.onChange);
    }



    private onChange(timer: Game.Timer) {
        let leftTime: number = 5 - timer.CallCount;
        this.friendRandomTimeText.text = uts.format('换一批({0})', leftTime);
        if (leftTime == 0) {
            UIUtils.setButtonClickAble(this.btn_changeBatch, true);
            this.friendRandomTimeText.text = "换一批";
        }
    }

    /**
    * 点击添加好友按钮 
    * @param event
    * 
    */
    private onBtnAddClick(): void {
        if (this.m_friendInfo != null) {
            let finshText = ElemFinder.findText(this.searchPerson, "finshText");
            finshText.gameObject.SetActive(true);
            this.m_addBtn.SetActive(false);
            G.ActionHandler.addFriend(this.m_friendInfo.m_stRoleID, this.m_friendInfo.m_usLevel);
        }
        else {
            G.TipMgr.addMainFloatTip('无法添加好友');
        }
    }


    ///////////////////////////////////////// 面板显示 /////////////////////////////////////////

    updateSearchFriendData(friendDataList: Protocol.GameFriendInfo[]): void {
        //刷新查询好友后的显示

        if (friendDataList != null && friendDataList.length > 0) {
            this.searchPerson.SetActive(true);
            this.m_friendInfo = friendDataList[0];
            this.m_tfLevel.text = this.m_friendInfo.m_usLevel.toString();
            this.m_tfName.text = this.m_friendInfo.m_szNickName.toString();
            let headIcon = ElemFinder.findImage(this.searchPerson, "touxiang/icon");
            headIcon.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}s', this.m_friendInfo.m_cProfession, this.m_friendInfo.m_cGender));
            let finshText = this.searchPerson.transform.Find("finshText").gameObject;
            let friendPrefession = ElemFinder.findText(this.searchPerson, "prefession");
            friendPrefession.text = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, this.m_friendInfo.m_cProfession);

            finshText.SetActive(false);
            this.m_addBtn.SetActive(true);
        }
        else {
            let str: string;
            if (this.m_queryTf.text == G.DataMgr.heroData.name) {
                str = '无法查找本人的信息！';
            }
            else {
                str = '该玩家不在线或不存在！';
            }
            G.TipMgr.addMainFloatTip(str);
            this.m_tfLevel.text = '';
            this.m_tfName.text = '';
        }
    }

    updateRecommandFriend(friendDataList: Protocol.GameFriendInfo[]): void {
        //更新推荐好友列表
        this.friendDatas = friendDataList;
        for (let i = 0; i < this.max_recommond; i++) {
            let obj = this.recommondPersons[i];
            if (i < friendDataList.length) {
                obj.SetActive(true);
                let data = friendDataList[i];
                let friendName = ElemFinder.findText(obj, "friendName");
                let friendLevel = ElemFinder.findText(obj, "touxiang/level");
                let friendPrefession = ElemFinder.findText(obj, "prefession");
                //头像
                let headIcon = ElemFinder.findImage(obj, "touxiang/icon");
                headIcon.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}s', data.m_cProfession, data.m_cGender));
                //职业图标显示 
                //let profIcon = ElemFinder.findImage(obj, "back/icon");
                //profIcon.sprite = this.profAltas.Get(data.m_cProfession.toString());
                //姓名
                friendName.text = data.m_szNickName;
                friendLevel.text = data.m_usLevel.toString();
                friendPrefession.text = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, data.m_cProfession);
                //添加好友按钮
                let addFriendBt = ElemFinder.findObject(obj, "btn_addfriend");
                addFriendBt.SetActive(true);
                let finshTextObj = ElemFinder.findObject(obj, "finshText");
                finshTextObj.SetActive(false);
                Game.UIClickListener.Get(addFriendBt).onClick = delegate(this, this.recommandAddFriend);
            } else {
                obj.SetActive(false);
            }
        }
    }


    private recommandAddFriend() {
        //推荐好友的添加好友请求处理
        let go = Game.UIClickListener.target;
        let obj = go.transform.parent.gameObject;
        let index = this.recommondPersons.indexOf(obj);
        let oneFriendInfo = this.friendDatas[index];
        let finshText = ElemFinder.findObject(obj, "finshText");
        if (oneFriendInfo != null) {
            G.ActionHandler.addFriend(oneFriendInfo.m_stRoleID, oneFriendInfo.m_usLevel);
            go.SetActive(false);
            finshText.SetActive(true);
        }
        else {
            G.TipMgr.addMainFloatTip('无法添加好友');
        }
    }



}
