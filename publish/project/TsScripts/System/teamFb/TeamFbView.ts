import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { GroupList } from 'System/uilib/GroupList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { PinstanceData } from 'System/data/PinstanceData'
import { TeamFbData } from 'System/data/TeamFbData'
import { SxtTeamItemData } from 'System/data/vo/SxtTeamItemData'
import { SxtPlayerItemData } from 'System/data/vo/SxtPlayerItemData'
import { IconItem } from 'System/uilib/IconItem'
import { Color } from 'System/utils/ColorUtil'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { CompareUtil } from 'System/utils/CompareUtil'
import { TeamFbModule } from 'System/teamFb/TeamFbModule'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { KeyWord } from 'System/constants/KeyWord'
import { InvitingPlayerView } from "System/team/InvitingPlayerView"


export abstract class TeamFbListBaseItem extends ListItemCtrl {

    protected headImg: UnityEngine.UI.Image;
    protected nameText: UnityEngine.UI.Text;

    /**今日已通关*/
    protected passFlagGo: UnityEngine.GameObject;

    protected rewardTypeGo: UnityEngine.GameObject;
    protected lifePassGo: UnityEngine.GameObject;
    protected todayPassGo: UnityEngine.GameObject;

    protected rewardList: List;
    protected iconItems: IconItem[] = [];

    setComponents(go: UnityEngine.GameObject) {
        this.headImg = ElemFinder.findImage(go, 'headBg/headImg').GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
        this.nameText = ElemFinder.findText(go, 'nameText');
        this.passFlagGo = ElemFinder.findObject(go, 'passFlag');

        this.rewardTypeGo = ElemFinder.findObject(go, 'rewardType');
        this.lifePassGo = ElemFinder.findObject(this.rewardTypeGo, 'lifePass');
        this.todayPassGo = ElemFinder.findObject(this.rewardTypeGo, 'todayPass');

        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, 'rewardList'));
    }

    dispose() {
        this.rewardList.dispose();
        this.rewardList = null;
    }

    init(bgSprite: UnityEngine.Sprite) {
        this.headImg.sprite = bgSprite;
    }

    update(...args) {

    }
}

export class TeamFbTeamItem extends ListItemCtrl {
    /**队长名字*/
    private captainNameText: UnityEngine.UI.Text;
    /**战斗力*/
    private zdlText: UnityEngine.UI.Text;
    /**满员自动开始*/
    private autoStartGo: UnityEngine.GameObject;
    /**成员头像*/
    private memberHeads: UnityEngine.GameObject[] = [];
    private imgMemberHeads: UnityEngine.UI.Image[] = [];

    private roleID: Protocol.RoleID;

    setComponents(go: UnityEngine.GameObject) {
        this.captainNameText = ElemFinder.findText(go, 'nameText');
        this.zdlText = ElemFinder.findText(go, 'zdlText');
        this.autoStartGo = ElemFinder.findObject(go, 'autoStart');
        for (let i = 0; i < 3; i++) {
            this.memberHeads.push(ElemFinder.findObject(go, 'members/m' + i + '/head'));
            this.imgMemberHeads.push(ElemFinder.findImage(go, 'members/m' + i + '/head'));
        }
    }

    update(vo: SxtTeamItemData) {
        this.roleID = vo.info.m_stRoleID;
        this.captainNameText.text = vo.info.m_szRoleName;
        this.autoStartGo.SetActive(0 != vo.info.m_ucAutoStart);
        //this.zdlText.text = uts.format('战力限制：{0}', vo.info.m_uiFight > 0 ? TextFieldUtil.getColorText(vo.info.m_uiFight.toString(), G.DataMgr.heroData.fight >= vo.info.m_uiFight ? Color.GREEN : Color.RED) : TextFieldUtil.getColorText('无限制', 'dacf7f'));
        this.zdlText.text = "";
        for (let i = 0; i < 3; i++) {
            this.memberHeads[i].SetActive(i < vo.info.m_ucTeamMemNum);
            if (i < vo.info.m_ucTeamMemNum) {
                this.imgMemberHeads[i].sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}', vo.info.m_astSimpleTeamInfo[i].m_ucProfession, vo.info.m_astSimpleTeamInfo[i].m_ucGender));
            }
        }
    }
}

export class TeamFbPlayerItem extends ListItemCtrl {

    /**名字*/
    private nameText: UnityEngine.UI.Text;
    /**战斗力*/
    private zdlText: UnityEngine.UI.Text;
    /**踢人按钮*/
    private btnKick: UnityEngine.GameObject;

    private headImg: UnityEngine.UI.Image;

    private captainGo: UnityEngine.GameObject;
    private readyGo: UnityEngine.GameObject;

    private playerInfo: UnityEngine.GameObject;
    private noPlayer: UnityEngine.GameObject;
    private btnInvite: UnityEngine.GameObject;

    private roleID: Protocol.RoleID;
    private pinstanceID: number = 0;

    setComponents(go: UnityEngine.GameObject) {
        this.nameText = ElemFinder.findText(go, 'playerInfo/nameText');
        this.zdlText = ElemFinder.findText(go, 'playerInfo/zdlText');
        this.btnKick = ElemFinder.findObject(go, 'playerInfo/btnKick');

        this.headImg = ElemFinder.findImage(go, 'playerInfo/head/Image');

        this.captainGo = ElemFinder.findObject(go, 'playerInfo/captain');
        this.readyGo = ElemFinder.findObject(go, 'playerInfo/ready');

        this.playerInfo = ElemFinder.findObject(go, 'playerInfo');
        this.noPlayer = ElemFinder.findObject(go, 'noPlayer');
        this.noPlayer.SetActive(false);
        this.btnInvite = ElemFinder.findObject(go, 'noPlayer/btnInvite');

        Game.UIClickListener.Get(this.btnKick).onClick = delegate(this, this.onClickBtnKick);
        Game.UIClickListener.Get(this.btnInvite).onClick = delegate(this, this.onClickBtnInvite);
    }

    update(vo: SxtPlayerItemData, pinstanceID: number) {
        this.pinstanceID = pinstanceID;
        let hasData = vo != null;
        this.playerInfo.SetActive(hasData);
        this.noPlayer.SetActive(!hasData);
        //没有队友的位置，显示邀请
        if (!hasData) {
            return;
        }

        this.roleID = vo.roleID;
        // 玩家名字
        this.nameText.text = vo.name;
        // 战斗力
        this.zdlText.text = uts.format('{0}', TextFieldUtil.getColorText(vo.zdl.toString(), 'edffff'));

        // 头像
        this.headImg.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}', vo.prof, vo.gender));

        // 队长标记
        if (vo.isCaptain) {
            this.captainGo.SetActive(true);
            this.readyGo.SetActive(false);
        }
        else {
            this.captainGo.SetActive(false);
            this.readyGo.SetActive(vo.isReady);
        }
        // 踢人按钮
        this.btnKick.gameObject.SetActive(!vo.isCaptain && vo.canKick);
    }

    private onClickBtnKick() {
        // 踢出去
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossKickTeamRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID, this.roleID));
    }

    private onClickBtnInvite() {
        G.Uimgr.createForm<InvitingPlayerView>(InvitingPlayerView).open(KeyWord.OTHER_FUNCTION_TEAM_INVITING_MYGUILD, true);
    }

}

export abstract class TeamFbView extends TabSubForm {
    /**等待16s才能再次发送，后台用的15s*/
    private readonly CLICK_WAIT_TIME = 16;
    /**最大等级300级*/
    private readonly MaxLvLimit = 300;
    private static readonly AutoReadyCountDownSec: number = 15;
    /**最大队友数量*/
    private static readonly MaxPlayerCount = 3;

    /**副本列表*/
    protected list: List;
    protected listItems: TeamFbListBaseItem[] = [];
    /**队伍名*/
    private titleText: UnityEngine.UI.Text;
    /**队伍列表部分*/
    private teamGo: UnityEngine.GameObject;
    /**队伍列表*/
    private teamList: List;
    private teamListData: SxtTeamItemData[] = [];
    private teamItems: TeamFbTeamItem[] = [];
    /**创建队伍按钮*/
    protected btnCreate: UnityEngine.GameObject;
    /**快速加入按钮*/
    protected btnFastJoin: UnityEngine.GameObject;
    /**自动加入或创建队伍*/
    private toggleAutoJoin: UnityEngine.UI.ActiveToggle;
    private toggleAutoJoinLabel: UnityEngine.UI.Text;
    /**玩家部分*/
    private playerGo: UnityEngine.GameObject;
    /**玩家列表*/
    private playerList: List;
    private playerListData: SxtPlayerItemData[] = [];
    private playerItems: TeamFbPlayerItem[] = [];
    /**满员自动挑战*/
    private toggleAutoStart: UnityEngine.UI.ActiveToggle;
    /**发送寻求队友*/
    private btnSearch: UnityEngine.GameObject;
    /**开始挑战按钮*/
    private btnStart: UnityEngine.GameObject;
    private btnReady: UnityEngine.GameObject;
    private btnStartLabel: UnityEngine.UI.Text;
    /**退出按钮*/
    private btnQuit: UnityEngine.GameObject;
    private autoJoinCount: number = TeamFbView.AutoReadyCountDownSec;
    private selectedIndex: number = 0;
    /**是否是仙侣副本,仙侣副本需要特殊处理*/
    private isXianLvFuBen: boolean = false;
    /**队长是否准备好*/
    private captainIsReady: boolean = false;
    /**战力限制输入*/
    private inputFight: UnityEngine.UI.InputField;


    private openPid = 0;

    constructor(id: number) {
        super(id);
        this.isXianLvFuBen = (id == KeyWord.BAR_FUNCTION_XIANYUAN);
    }

    protected onOpen() {
        // 注册一个定时器用于拉取队伍列表和同步队伍设置
        this.addTimer("tickTimer", 1000, 0, this.onTick);

        if (this.openPid > 0) {
            let idx = this.getPinstanceIdx(this.openPid);
            if (idx >= 0) {
                this.list.Selected = idx;
                this.list.ScrollByAxialRow(idx);
            }
        }
        // 刷新副本信息
        this.updateView();
        // 打开时拉取进度
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST_ALL, 0, this.getPinstanceIDs()));
    }

    protected onClose() {
    }

    protected resPath(): string {
        return null;
    }
    protected initElements(): void {
        // 副本列表
        if (!this.isXianLvFuBen) {
            this.list = this.elems.getUIList('list');
            let bgAltas = this.elems.getElement('bgAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
            let pinstanceIds = this.getPinstanceIDs();
            let cnt = pinstanceIds.length;
            this.list.Count = cnt;
            for (let i: number = 0; i < cnt; i++) {
                let itemGo = this.list.GetItem(i).gameObject;
                let item = this.newListItemCtrl();
                item.setComponents(itemGo);
                item.init(bgAltas.Get(((i % 4) + 1).toString()));
                this.listItems.push(item);
            }
            this.inputFight = this.elems.getInputField('inputFight');
        }
        this.titleText = this.elems.getText('titleText');
        // 队伍列表
        this.teamGo = this.elems.getElement('teamGo');
        this.teamList = this.elems.getUIList('teamList');
        this.btnCreate = this.elems.getElement('btnCreate');
        this.btnFastJoin = this.elems.getElement('btnFastJoin');
        this.toggleAutoJoin = this.elems.getActiveToggle('toggleAutoJoin');
        this.toggleAutoJoin.isOn = false;
        this.toggleAutoJoinLabel = this.elems.getText('toggleAutoJoinLabel');
        // 成员列表
        this.playerGo = this.elems.getElement('playerGo');
        this.playerList = this.elems.getUIList('playerList');
        this.playerList.Count = TeamFbData.TEAM_SIZE;
        this.toggleAutoStart = this.elems.getActiveToggle('toggleAutoStart');
        this.toggleAutoStart.isOn = true;
        this.btnSearch = this.elems.getElement('btnSearch');
        this.btnSearch.SetActive(this.id != KeyWord.BAR_FUNCTION_XIANYUAN);
        this.btnStart = this.elems.getElement('btnStart');
        this.btnStartLabel = this.elems.getText('btnStartLabel');
        this.btnQuit = this.elems.getElement('btnQuit');
        this.btnReady = this.elems.getElement("btnReady");

    }

    protected initListeners(): void {
        if (!this.isXianLvFuBen) {
            this.addListClickListener(this.list, this.onClickList);
            this.list.onValueChange = delegate(this, this.onListValueChange);
        }
        this.addListClickListener(this.teamList, this.onClickTeamItem);
        this.addClickListener(this.btnCreate, this.onClickBtnCreate);
        this.addClickListener(this.btnFastJoin, this.onClickBtnFastJoin);
        this.addClickListener(this.toggleAutoStart.gameObject, this.onClickToggleAutoStart);
        this.addClickListener(this.btnSearch, this.onClickBtnSearch);
        this.addClickListener(this.btnStart, this.onClickBtnStart);
        this.addClickListener(this.btnQuit, this.onClickBtnQuit);

        if (this.btnReady) {
            this.addClickListener(this.btnReady, this.onClickBtnReady);
        }
    }

    open(pid = 0) {
        this.openPid = pid;
        super.open();
    }

    private onListValueChange(index: number) {
        this.selectedIndex = index;
    }

    ///////////////////////////////////////// 面板显示 /////////////////////////////////////////

    updateView(): void {
        // 刷新副本
        this.updatePinstanceList();
        // 选中副本
        if (!this.isXianLvFuBen) {
            let myTeam = G.DataMgr.sxtData.myTeam;
            if (null != myTeam) {
                this.list.Selected = this.getPinstanceIdx(myTeam.m_uiPinstanceID);
            }
            if (this.list.Selected < 0) {
                this.list.Selected = 0;
            }
        }
        this._updateSelectedPinstance();
    }

    protected _updateSelectedPinstance() {
        let index = this.selectedIndex;
        if (index < 0) {
            return;
        }
        let myTeam = G.DataMgr.sxtData.myTeam;
        if (null != myTeam && this.getPinstanceIdx(myTeam.m_uiPinstanceID) >= 0) {
            // 已经有相应的队伍了，显示队伍人员
            this.updateByCreateJoinSetReadyStart();
        }
        else {
            // 当前没有队伍，或者队伍不是相关副本，则拉取副本队伍信息
            let selectedPinstance = this.getPinstanceCfgByIdx(index);
            this.titleText.text = uts.format('{0}', selectedPinstance.m_szName);
            this.teamList.Count = 0;
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossGetTeamListRequest(selectedPinstance.m_iPinstanceID));
            this._setTeamListVisible(true);
        }

        if (this.canPlay(index)) {
            UIUtils.setButtonClickAble(this.btnCreate, true);
            UIUtils.setButtonClickAble(this.btnFastJoin, true);
        } else {
            UIUtils.setButtonClickAble(this.btnCreate, false);
            UIUtils.setButtonClickAble(this.btnFastJoin, false);
        }
    }

    /**
    * 拉取队伍列表后调用本接口。
    *
    */
    updateByGetTeamList(): void {
        let index = this.selectedIndex;
        if (index < 0) {
            return;
        }
        let teamList: Protocol.CSCross_GetTeamList_Response = G.DataMgr.sxtData.teamList;
        let selectedPinstance = this.getPinstanceCfgByIdx(index);
        if (null == selectedPinstance || selectedPinstance.m_iPinstanceID != teamList.m_uiPinstanceID) {
            // 与当前副本不符则跳过
            return;
        }
        let myTeam = G.DataMgr.sxtData.myTeam;
        if (null != myTeam && selectedPinstance.m_iPinstanceID == myTeam.m_uiPinstanceID) {
            // 正好是当前副本也跳过
            return;
        }
        // 更新队伍列表数据
        let teamListData: Protocol.Cross_SimpleOneTeam[] = teamList.m_astTeamList;
        if (this.isXianLvFuBen) {
            //仙侣副本只显示自己和情侣的队伍
            teamListData = [];
            for (let i = 0; i < teamList.m_astTeamList.length; i++) {
                let info = teamList.m_astTeamList[i];
                if (info.m_szRoleName == G.DataMgr.heroData.name || info.m_szRoleName == G.DataMgr.heroData.mateName) {
                    teamListData.push(info);
                }
            }
        }
        this.teamList.Count = teamListData.length;
        let oldTeamDataCnt = this.teamListData.length;
        for (let i: number = 0; i < teamListData.length; i++) {
            let teamInfo = teamListData[i];
            let itemData: SxtTeamItemData;
            let teamItem: TeamFbTeamItem;
            if (i < oldTeamDataCnt) {
                itemData = this.teamListData[i];
                teamItem = this.teamItems[i];
            } else {
                this.teamListData.push(itemData = new SxtTeamItemData());
                this.teamItems.push(teamItem = new TeamFbTeamItem());
                teamItem.setComponents(this.teamList.GetItem(i).gameObject);
            }
            itemData.bestNum = selectedPinstance.m_ucPlayerHigh;
            itemData.info = uts.deepcopy(teamInfo, itemData.info, true);
            itemData.pistanceID = teamList.m_uiPinstanceID;
            teamItem.update(itemData);
        }
    }

    /**
     * 创建/加入/设置队伍、准备、开始挑战后调用本接口。
     *
     */
    updateByCreateJoinSetReadyStart(): void {
        this._setTeamListVisible(false);
        this._updateMyTeam();
    }

    /**
     * 踢出队伍后调用本接口。
     *
     */
    updateByKickQuitTeam(): void {
        if (null != G.DataMgr.sxtData.myTeam) {
            // 还在队伍里，刷新队伍
            this._updateMyTeam();
        }
        else {
            // 被踢出去了，显示队伍列表
            this._setTeamListVisible(true);
        }
    }

    private _updateMyTeam(): void {
        // 刷新队伍信息
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        // 更新副本标题
        let pconfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(myTeam.m_uiPinstanceID);
        this.titleText.text = uts.format('{0}', pconfig.m_szName);
        // 确定自己是否队长
        let amICaptain: boolean = G.DataMgr.sxtData.amICaptain();

        let i: number = 0;
        let itemData: SxtPlayerItemData;
        let playerItem: TeamFbPlayerItem;
        let memInfo: Protocol.Cross_OneTeamMem;
        let isAllReady: boolean = true; // 所有人是否都已准备好
        let hasCheckMyReady: boolean = false;
        let amIReady: boolean = false; // 自己是否已准备
        let oldPlayerDataCnt = this.playerListData.length;

        //结婚的副本按原来的
        if (this.id == KeyWord.BAR_FUNCTION_XIANYUAN) {
            this.playerList.Count = myTeam.m_ucTeamMemNum;
        } else {
            this.playerList.Count = TeamFbView.MaxPlayerCount;
        }

        for (i = 0; i < myTeam.m_ucTeamMemNum; i++) {
            if (i < oldPlayerDataCnt) {
                itemData = this.playerListData[i];
                playerItem = this.playerItems[i];
            } else {
                this.playerListData.push(itemData = new SxtPlayerItemData());
                this.playerItems.push(playerItem = new TeamFbPlayerItem());
                playerItem.setComponents(this.playerList.GetItem(i).gameObject);
            }
            memInfo = myTeam.m_astTeamInfo[i];
            itemData.canKick = amICaptain;
            itemData.isCaptain = 0 == i;
            itemData.gender = memInfo.m_ucGender;
            itemData.isReady = 1 == memInfo.m_ucIsReady;
            itemData.name = memInfo.m_szRoleName;
            itemData.prof = memInfo.m_ucProfession;
            itemData.roleID = memInfo.m_stRoleID;
            itemData.zdl = memInfo.m_uiFight;
            itemData.isLock = false;
            playerItem.update(itemData, myTeam.m_uiPinstanceID);
            if (!itemData.isCaptain && !itemData.isReady) {
                isAllReady = false;
            }
            if (!hasCheckMyReady && CompareUtil.isRoleIDEqual(G.DataMgr.heroData.roleID, memInfo.m_stRoleID)) {
                amIReady = itemData.isReady;
            }
        }

        //除了结婚的副本外要显示邀请的
        if (this.id != KeyWord.BAR_FUNCTION_XIANYUAN) {
            //显示邀请
            for (let i = 0; i < TeamFbView.MaxPlayerCount; i++) {
                if (i >= myTeam.m_ucTeamMemNum) {
                    if (this.playerItems[i] == null) {
                        let item = this.playerList.GetItem(i).gameObject;
                        this.playerItems[i] = new TeamFbPlayerItem();
                        this.playerItems[i].setComponents(item);
                    }
                    this.playerItems[i].update(null, myTeam.m_uiPinstanceID);
                }
            }
        }

        //队长是否准备好
        if (myTeam && myTeam.m_astTeamInfo)
            this.captainIsReady = myTeam.m_astTeamInfo[0].m_ucIsReady == 1;

        // 队长面板
        // 满员自动挑战
        this.toggleAutoStart.isOn = 1 == myTeam.m_ucAutoStart;
        if (amICaptain) {
            this.toggleAutoStart.interactable = true;
            // 显示开始挑战
            this.btnStartLabel.text = '开始挑战';
            // 所有人都准备好了才能开始挑战
            UIUtils.setButtonClickAble(this.btnStart, true);
            this.btnStart.SetActive(this.captainIsReady);
            if (this.btnReady) {
                this.btnReady.SetActive(!this.captainIsReady);
            }

        }
        else {
            this.toggleAutoStart.interactable = false;
            // 显示准备
            this.btnStartLabel.text = '开始准备';
            this.btnStart.SetActive(true);
            if (this.btnReady) {
                this.btnReady.SetActive(false);
            }
            // 如果自己已准备则按钮灰掉
            UIUtils.setButtonClickAble(this.btnStart, !amIReady && !this.captainIsReady);
        }
    }

    private _setTeamListVisible(isVisible: boolean): void {
        this.teamGo.SetActive(isVisible);
        this.playerGo.SetActive(!isVisible);
        let bg = this.elems.getElement('bg');
        bg.SetActive(isVisible);
    }

    private onClickList(index: number) {
        // 如果已经有队伍了，则不允许换同系列副本，但是组队副本和天神殿之间不同系列则允许
        let selectPinstance = this.getPinstanceCfgByIdx(index);
        if (this.checkCrtTeam(selectPinstance.m_iPinstanceID, true)) {
            let idx = this.getPinstanceIdx(G.DataMgr.sxtData.myTeam.m_uiPinstanceID);
            if (idx >= 0) {
                this.list.Selected = idx;
                return;
            }
        }
        this.autoJoinCount = TeamFbView.AutoReadyCountDownSec;
        this.toggleAutoJoinLabel.text = uts.format('{0}秒后自动加入或创建队伍', this.autoJoinCount);
        this._updateSelectedPinstance();
    }

    /**
     * 点击队伍item的响应函数。
     * @param index
     *
     */
    private onClickTeamItem(index: number): void {
        let pinstanceIdx = this.selectedIndex;
        if (pinstanceIdx < 0) {
            return;
        }
        if (this.canPlay(pinstanceIdx)) {
            let selectedTeam = this.teamListData[index];
            G.ModuleMgr.teamFbModule.joinSxtTeam(selectedTeam.pistanceID, selectedTeam.info);
        }
    }

    /**
     * 点击创建队伍按钮事件的响应函数。
     * @param event
     *
     */
    private onClickBtnCreate(): boolean {
        if (this.isXianLvFuBen && G.DataMgr.heroData.mateName == '') {
            G.TipMgr.addMainFloatTip('需要结婚有了伴侣才能创建队伍');
            return false;
        }
        if (!this.checkCrtState()) {
            return false;
        }
        let index = this.selectedIndex;
        if (index < 0) {
            return false;
        }
        if (this.checkCrtTeam(0, false)) {
            // 先离队
            G.ActionHandler.leaveTeam();
        }
        let selectedPinstance = this.getPinstanceCfgByIdx(index);
        let limitLv = 0;

        if (this.inputFight) {
            let inputStr = this.inputFight.text;
            if (inputStr != null && inputStr != "")
                limitLv = parseInt(this.inputFight.text);
        }

        if (!this.isXianLvFuBen && limitLv > this.MaxLvLimit) {
            limitLv = this.MaxLvLimit;
            this.inputFight.text = this.MaxLvLimit.toString();
        }

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossCreateTeamRequest(selectedPinstance.m_iPinstanceID, '', true, limitLv,
            G.DataMgr.gameParas.domain, G.DataMgr.gameParas.serverIp, G.DataMgr.gameParas.serverPort));
        return true;
    }

    /**点击快速加入队伍按钮事件的响应函数。*/
    private onClickBtnFastJoin() {
        this.doFastJoin(true);
    }
    private doFastJoin(needPromp: boolean): boolean {
        if (!this.checkCrtState()) {
            return false;
        }
        let index = this.selectedIndex;
        if (index < 0) {
            return false;
        }
        // 挑选一个没有密码，且人数最多的队伍加入
        let teamList: Protocol.CSCross_GetTeamList_Response = G.DataMgr.sxtData.teamList;
        if (null == teamList) {
            return false;
        }
        let joinTeam: Protocol.Cross_SimpleOneTeam;
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        // 更新副本标题
        let pconfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(teamList.m_uiPinstanceID);
        let heroData = G.DataMgr.heroData;
        for (let teamInfo of teamList.m_astTeamList) {
            if (this.isXianLvFuBen) {
                if (teamInfo.m_szRoleName == G.DataMgr.heroData.mateName) {
                    joinTeam = teamInfo;
                }
                break;
            } else {
                if ('' != teamInfo.m_szPassword || teamInfo.m_ucTeamMemNum >= pconfig.m_ucPlayerBestNum || teamInfo.m_uiFight > G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT)) {
                    continue;
                }
                joinTeam = teamInfo;
                break;
            }
        }
        if (null == joinTeam) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip('没有合适的队伍！');
            }
            return false;
        }
        if (this.checkCrtTeam(0, false)) {
            // 先离队
            G.ActionHandler.leaveTeam();
        }
        // 加入队伍
        G.ModuleMgr.teamFbModule.joinSxtTeam(teamList.m_uiPinstanceID, joinTeam);
        return true;
    }

    /**点击战斗力限制/满员自动挑战勾选按钮事件的响应函数。*/
    private onClickToggleAutoStart(): void {
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        if (null != myTeam) {
            myTeam.m_ucAutoStart = 1 - myTeam.m_ucAutoStart;
        }
        this._syncSetting();
    }

    /**
     * 同步队伍设置。
     *
     */
    private _syncSetting(): void {
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSetTeamRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID, myTeam.m_ucAutoStart, myTeam.m_uiNeedFight));
    }

    /**点击退出队伍按钮事件的响应函数。*/
    private onClickBtnQuit() {
        // 如果队伍里有别人，队长给出2次确认
        if (G.DataMgr.sxtData.amICaptain() && G.DataMgr.sxtData.myTeam.m_ucTeamMemNum > 1) {
            G.TipMgr.showConfirm('确定退出队伍吗？', ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onQuitConfirm));
        }
        else {
            this._quit();
        }
    }

    private onQuitConfirm(status: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == status) {
            this._quit();
        }
    }

    private _quit(): void {
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        if (null != myTeam) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossQuitTeamRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
        }
    }

    /**点击开始挑战/准备按钮事件的响应函数。*/
    private onClickBtnStart() {
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        let amICaptain: boolean = G.DataMgr.sxtData.amICaptain();
        if (amICaptain) {
            // 队长
            if (this.isXianLvFuBen) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossTeamReadyRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
            }
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossStartPinRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));

            //if (this.captainIsReady) {
            //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossStartPinRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
            //} else {
            //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossTeamReadyRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
            //}
        }
        else {
            // 普通队员准备
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossTeamReadyRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
        }
    }

    private onClickBtnReady() {
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        let amICaptain: boolean = G.DataMgr.sxtData.amICaptain();
        if (amICaptain) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossTeamReadyRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
        }
    }

    private onClickBtnSearch() {

        let oldTime = G.DataMgr.runtime.lastClickInvitePlayerTime;
        if (UnityEngine.Time.realtimeSinceStartup - oldTime < this.CLICK_WAIT_TIME) {
            G.TipMgr.addMainFloatTip("亲，您的邀请过于频繁，请稍后再邀请");
            return;
        }
        G.DataMgr.runtime.lastClickInvitePlayerTime = UnityEngine.Time.realtimeSinceStartup;
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        if (null == myTeam) {
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossRecruitTeamRequest(myTeam.m_uiPinstanceID));
        G.TipMgr.addMainFloatTip("已发送邀请!");
    }

    private onTick(timer: Game.Timer) {
        let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
        if (null == myTeam || (this.id == KeyWord.BAR_FUNCTION_XIANYUAN && myTeam.m_uiPinstanceID != Macros.PINSTANCE_ID_FUQI)) {
            let processed: boolean = false;
            if (this.toggleAutoJoin.isOn) {
                // 勾选了自动加入
                if (this.canPlay(this.selectedIndex)) {
                    this.autoJoinCount--;
                    if (this.autoJoinCount < 0) {
                        this.autoJoinCount = TeamFbView.AutoReadyCountDownSec;
                    }
                    this.toggleAutoJoinLabel.text = uts.format('{0}秒后自动加入或创建队伍', this.autoJoinCount);
                    if (this.autoJoinCount == 0) {
                        // 有队伍就自动加入
                        processed = this.doFastJoin(false);
                        if (!processed) {
                            // 没队伍就自动创建
                            processed = this.onClickBtnCreate();
                        }
                    }
                }
            }
            // 没有队伍则每4秒拉取队伍列表
            if (!processed && 0 == timer.CallCount % 4) {
                let index = this.selectedIndex;
                if (index >= 0) {
                    let selectedPinstance = this.getPinstanceCfgByIdx(index);
                    if (null != selectedPinstance) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossGetTeamListRequest(selectedPinstance.m_iPinstanceID));
                    }
                }
            }
        }
    }

    private checkCrtState(): boolean {
        if (!G.ActionHandler.checkMatchingStatus(true)) {
            return false;
        }
        return true;
    }

    protected checkCrtTeam(id: number, needPromp: boolean): boolean {
        let myTeam = G.DataMgr.sxtData.myTeam;
        if (null != myTeam && (0 == id || myTeam.m_uiPinstanceID != id)) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('请先离开{0}的队伍', PinstanceData.getConfigByID(myTeam.m_uiPinstanceID).m_szName));
            }
            return true;
        }
        return false;
    }

    protected abstract updatePinstanceList();
    protected abstract getPinstanceCfgByIdx(index: number): GameConfig.PinstanceConfigM;
    protected abstract newListItemCtrl(): TeamFbListBaseItem;
    protected abstract getPinstanceIDs(): number[];
    protected abstract getPinstanceIdx(id: number): number;
    protected abstract canPlay(index: number): boolean;
}