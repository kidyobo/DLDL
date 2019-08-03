import { Global as G } from "System/global"
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { KeyWord } from "System/constants/KeyWord"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Macros } from 'System/protocol/Macros'
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar"
import { EnumTeamTab } from "System/team/TeamView"
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { MenuNodeData, MenuView } from 'System/uilib/MenuView'
import { InvitingPlayerView } from "System/team/InvitingPlayerView"
import { CommonForm, UILayer } from "System/uilib/CommonForm";



export class MyTeamView extends CommonForm {

    /**最大队伍人数*/
    private readonly MaxTeamCount = 4;

    /**创建、离开队*/
    private m_btnCreateTeam: UnityEngine.GameObject;
    /**创建或离开文本*/
    private txtCreateOrLeave: UnityEngine.UI.Text;

    /**队员列表*/
    private m_teamList: Protocol.TeamMemberInfoForNotify[];
    /**当前选择的那个*/
    private curSelectIndex: number = -1;
    /**允许队友邀请其他玩家*/
    private m_IsMemberCanInvite: boolean = false;

    /**队伍信息*/
    private m_roleList: Protocol.TeamMemberInfoForNotify[];

    /**模型的父节点*/
    private playerParent: UnityEngine.GameObject = null;

    /**放模型的节点*/
    private playerTrans: UnityEngine.Transform[] = [];
    /**角色模型*/
    private roleAvatar: UIRoleAvatar[] = [];

    /**快速加入按钮*/
    private btnFastJoin: UnityEngine.GameObject;

    /**组队加成的提示*/
    private teamTip: UnityEngine.GameObject = null;

    private playerList: List;
    private teamItems: TeamItem[] = [];
    //这2个是处理设为队长，提出队员显示隐藏的
    private oldSelectIndex: number = -1;
    private clickCount: number = 0;

    private btnDuiZhang: UnityEngine.GameObject;
    private btnReceiveTeam: UnityEngine.GameObject;
    private duizhangSelected: UnityEngine.GameObject;
    private receiveTeamSelected: UnityEngine.GameObject;
    private isCanOtherJoin: boolean = false;
    private isAutoReceive: boolean = false;

    private btnReturn: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    //constructor() {
    //    super(EnumTeamTab.MyTeam);
    //}

    protected resPath(): string {
        return UIPathData.MyTeamView;
    }
    layer(): UILayer {
        return UILayer.Normal;
    }

    constructor(id: number) {
        super(id);
        this.closeSound = null;
    }

    protected initElements(): void {
        this.playerList = this.elems.getUIList("playerList");

        this.m_btnCreateTeam = this.elems.getElement("btnCreatTeam");
        this.txtCreateOrLeave = this.m_btnCreateTeam.transform.Find("Text").GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
        this.playerParent = this.elems.getElement("playerParent");
        this.btnFastJoin = this.elems.getElement("btnFastJoin");
        this.teamTip = this.elems.getElement("teamTip");
        this.playerList.Count = this.MaxTeamCount;


        this.btnDuiZhang = this.elems.getElement("btnDuiZhang");
        this.btnReceiveTeam = this.elems.getElement("btnReceiveTeam");
        this.duizhangSelected = ElemFinder.findObject(this.btnDuiZhang, "selected");
        this.receiveTeamSelected = ElemFinder.findObject(this.btnReceiveTeam, "selected");

        this.btnReturn = this.elems.getElement("btnReturn");
        this.mask = this.elems.getElement("mask");


        for (let i = 0; i < this.MaxTeamCount; i++) {
            let teamItem = new TeamItem();
            let item = this.playerList.GetItem(i);
            teamItem.setComponents(item.gameObject);
            this.teamItems.push(teamItem);
            //模型节点
            let trans = this.playerParent.transform.Find("modleTrans" + i);
            this.playerTrans.push(trans);
        }

        
    }

    protected initListeners(): void {
        this.addClickListener(this.m_btnCreateTeam.gameObject, this._onBtnCreateTeam);
        this.addClickListener(this.btnFastJoin.gameObject, this.onBtnFastJoin);
        this.addListClickListener(this.playerList, this._onSelectTeamMember);

        this.addClickListener(this.btnDuiZhang, this.onBtnCanOtherJoin);
        this.addClickListener(this.btnReceiveTeam, this.onBtnZidongJieShou);

        this.addClickListener(this.btnReturn, this.close);
        this.addClickListener(this.mask, this.close);
    }


    /**
     * 快速加入
     */
    private onBtnFastJoin() {
        if (G.DataMgr.teamData.m_nearTeamInfo == null) {
            G.TipMgr.addMainFloatTip("附近没有可加入的队伍");
            return;
        } else {
            for (let i = 0; i < G.DataMgr.teamData.m_nearTeamInfo.length; i++) {
                if (G.DataMgr.teamData.m_nearTeamInfo[i].m_stTeamRestriction.m_ucCanOtherJoin == 1) {
                    if (G.DataMgr.teamData.hasTeam) {
                        G.TipMgr.addMainFloatTip('您已经有队伍了！');
                        return;
                    }
                    else {
                        G.ActionHandler.joinTeam(G.DataMgr.teamData.m_nearTeamInfo[i].m_stRoleID);
                    }
                }
            }
        }
    }

    protected onOpen() {

        for (let i = 0; i < this.MaxTeamCount; i++) {
            //角色Avatar
            if (!this.roleAvatar[i]) {
                let trans = this.playerTrans[i];
                this.roleAvatar[i] = new UIRoleAvatar(trans, trans);
                this.roleAvatar[i].setSortingOrder(this.sortingOrder);
                this.roleAvatar[i].hasWing = false;
            }
        }

        for (let i = 0; i < this.MaxTeamCount; i++) {
            this.teamItems[i].updata(false, i == 0, null, true);
        }
        this.teamTip.SetActive(false);

        //请求队伍信息
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamInfoRequest());
    }

    protected onClose() {
        this.oldSelectIndex = -1;
        this.clickCount = 0;
        for (let i: number = 0; i < this.MaxTeamCount; i++) {
            if (this.roleAvatar[i]) {
                this.roleAvatar[i].destroy();
                this.roleAvatar[i] = null;
            }
        }
    }


    private _onSelectTeamMember(index: number): void {
        //0代表队长自己,或不是队长
        if (index == 0 || !G.DataMgr.teamData.isCaptain()) return;
        this.teamItems[index].setBtnHide(true);
        //第一次点击，直接显示点击位置按钮
        if (this.oldSelectIndex < 0) {
            this.oldSelectIndex = index;
            return;
        }
        //选择不同是，隐藏老的
        if (this.oldSelectIndex != index) {
            this.teamItems[this.oldSelectIndex].setBtnHide(false);
            this.clickCount = 0;
        } else {
            this.clickCount++;
        }
        //点击同一个，根据次数，显示/隐藏
        let show = this.clickCount % 2 == 0;
        this.teamItems[index].setBtnHide(show);
        this.oldSelectIndex = index;
    }

    // public createTeamButton() {
    //     this._onBtnCreateTeam();
    // }

    /**创建队伍按钮功能 */
    private _onBtnCreateTeam(): void {
        if (G.DataMgr.teamData.hasTeam) {
            //离开队伍
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamOperateRequestMsg(Macros.OperateTeam_LeaveTeam));
        }
        else {
            //邀请玩家  
            for (let i = 0; i < this.MaxTeamCount; i++) {
                this.teamItems[i].updata(false, i == 0, null, true);
            }
            this.teamTip.SetActive(false);
        }
    }

    /**
     * 自动接受他人的邀请
     */
    private onBtnZidongJieShou(): void {
        this.isAutoReceive = !this.isAutoReceive;
        this.receiveTeamSelected.SetActive(this.isAutoReceive);

        let value: number[] = G.DataMgr.systemData.systemSettingList;
        let num: number = -1;
        if (this.isAutoReceive) {
            num = 0;
        } else {
            num = 1;
        }
        value[Macros.SYSTEM_SETTING_TEAM_INVITE] = num;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSystemSettingChangeRequest());

    }


    private onBtnCanOtherJoin(): void {
        this.isCanOtherJoin = !this.isCanOtherJoin;
        this.duizhangSelected.SetActive(this.isCanOtherJoin);

        if (G.DataMgr.teamData.isCaptain()) {
            //向后台发协议
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamOperateRequestMsg(Macros.OperateTeam_Hook, null, G.DataMgr.teamData.teamID, this.isCanOtherJoin, true));
        }

        let value: number[] = G.DataMgr.systemData.systemSettingList;
        let num: number = -1;
        if (this.isCanOtherJoin) {
            num = 0;
        } else {
            num = 1;
        }
        value[Macros.SYSTEM_SETTING_TEAM_INVITE] = num;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSystemSettingChangeRequest());
    }


    //组队加成提示
    private showOrHideTeamTip(num: number) {
        if (num > 0) {
            this.teamTip.SetActive(false);
        } else {
            this.teamTip.SetActive(true);
            this.btnFastJoin.SetActive(true);
        }
    }

    updateView(): void {
        let autoReceive = G.DataMgr.systemData.systemSettingList[Macros.SYSTEM_SETTING_TEAM_INVITE] == 0 ? true : false;
        //我是队长时，其他人是否可以加入条件  组队邀请必须为ture，其次是否允许其他人加入
        this.isCanOtherJoin = autoReceive && (G.DataMgr.teamData.m_stTeamRestriction.m_ucCanOtherJoin == 1 ? true : false);
        this.isAutoReceive = autoReceive;

        this.duizhangSelected.SetActive(this.isCanOtherJoin);
        this.receiveTeamSelected.SetActive(this.isAutoReceive);

        let m_roleList: Protocol.TeamMemberInfoForNotify[] = new Array<Protocol.TeamMemberInfoForNotify>();

        if (G.DataMgr.teamData.hasTeam) {
            m_roleList = G.DataMgr.teamData.allMemberList;
            let nm: number = m_roleList.length;
            this.m_teamList = m_roleList;
            this.txtCreateOrLeave.text = '离开队伍';
            this.setAvatarList(m_roleList);
            this.btnFastJoin.SetActive(false);
        }
        else {
            this.txtCreateOrLeave.text = '创建队伍';
            for (let i = 0; i < this.MaxTeamCount; i++) {
                this.teamItems[i].updata(false, i == 0, null, true);
            }
        }
        this.showOrHideTeamTip(m_roleList.length);

        //Tab自动加入他人队伍，允许其他玩家加入
        if (G.DataMgr.teamData.isCaptain()) {
            this.btnDuiZhang.SetActive(true);
            this.btnReceiveTeam.SetActive(false);
        }
        else {
            this.btnDuiZhang.SetActive(false);
            this.btnReceiveTeam.SetActive(true);
        }
        //队伍没人隐藏模型节点
        if (m_roleList == null) {
            for (let i = 0; i < this.playerTrans.length; i++) {
                this.playerTrans[i].gameObject.SetActive(false);
            }
        } else {
            for (let i = this.playerTrans.length - 1; i >= 0; i--) {
                if (i >= m_roleList.length) {
                    this.playerTrans[i].gameObject.SetActive(false);
                }
                else {
                    this.playerTrans[i].gameObject.SetActive(true);
                }
            }
        }
    }


    /**
     * 更新角色avatar显示
     * @param avatarList
     * @param prof]
     * @param gender
     *
     */
    setAvatarList(memberList: Protocol.TeamMemberInfoForNotify[]): void {
        let count: number = memberList.length;
        for (let i: number = 0; i < this.MaxTeamCount; i++) {
            if (i < count) {
                this.teamItems[i].updata(true, i == 0, memberList[i]);
                //模型的显示             
                this.roleAvatar[i].setAvataByList(memberList[i].m_stAvatarList, memberList[i].m_ucProfessionType, memberList[i].m_ucGenderType);
                this.roleAvatar[i].m_bodyMesh.playAnimation('stand');
                this.roleAvatar[i].m_rebirthMesh.setRotation(20, 0, 0);
                this.roleAvatar[i].setSortingOrder(this.sortingOrder);
            } else {
                this.teamItems[i].updata(true, i == 0, null);
            }
        }
    }

    onTeamChanged(isJoinTeam: boolean): void {
        if (this.isOpened) {
            this.updateView();
        }
    }


    public refresh(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamInfoRequest());
    }
}


class TeamItem {
    //没有玩家
    private noPlayer: UnityEngine.GameObject;
    private btnYaoqing: UnityEngine.GameObject;

    //有玩家
    private havePlayer: UnityEngine.GameObject;
    //队长标识
    private imgduizhang: UnityEngine.GameObject;
    private txtLv: UnityEngine.UI.Text;
    private txtName: UnityEngine.UI.Text;
    private txtZdl: UnityEngine.UI.Text;
    private btnSetDuiZhang: UnityEngine.GameObject;
    private btnTichu: UnityEngine.GameObject;
    private data: Protocol.TeamMemberInfoForNotify;

    setComponents(go: UnityEngine.GameObject) {
        this.noPlayer = ElemFinder.findObject(go, "noPlayer");
        this.btnYaoqing = ElemFinder.findObject(go, "noPlayer/btnYaoqing");
        this.havePlayer = ElemFinder.findObject(go, "havePlayer");
        this.imgduizhang = ElemFinder.findObject(go, "havePlayer/panel/content/teambg/imgduizhang");
        this.txtLv = ElemFinder.findText(go, "havePlayer/panel/content/teambg/txtLv");
        this.txtName = ElemFinder.findText(go, "havePlayer/panel/content/teambg/txtName");
        this.txtZdl = ElemFinder.findText(go, "havePlayer/panel/content/fight/txtZdl");
        this.btnSetDuiZhang = ElemFinder.findObject(go, "havePlayer/panel/btnSetDuiZhang");
        this.btnTichu = ElemFinder.findObject(go, "havePlayer/panel/btnTichu");

        Game.UIClickListener.Get(this.btnYaoqing).onClick = delegate(this, this.onClickYaoQing);
        Game.UIClickListener.Get(this.btnSetDuiZhang).onClick = delegate(this, this.onSetDuiZhang);
        Game.UIClickListener.Get(this.btnTichu).onClick = delegate(this, this.onTichu);
        this.setBtnHide(false);
    }

    private setObjectDepth(target: UnityEngine.GameObject) {
        let com = target.AddComponent(UnityEngine.Canvas.GetType()) as UnityEngine.Canvas;
        com.overrideSorting = true;
        //com.sortingOrder = this._sortingOrder;
    }

    /**
     * @param hasTeam 是否有队伍
     * @param isCaptain 是否是队长
     * @param member 队员信息
     * @param isShowYaoQing 是否显示邀请按钮
     */
    updata(hasTeam: boolean, isCaptain: boolean, member: Protocol.TeamMemberInfoForNotify, isShowYaoQing: boolean = true) {
        this.data = member;
        //没有队伍，
        if (!hasTeam) {
            this.noPlayer.SetActive(true);
            this.havePlayer.SetActive(false);
            this.btnYaoqing.SetActive(isShowYaoQing);
            return;
        }
        //或者队伍没满
        else if (member == null) {
            this.noPlayer.SetActive(true);
            this.havePlayer.SetActive(false);
            this.btnYaoqing.SetActive(true);
        } else if (member.m_stRoleID.m_uiUin > 0) {
            this.noPlayer.SetActive(false);
            this.havePlayer.SetActive(true);
            //文本显示
            this.txtLv.text = member.m_usLevel.toString() + "级 ";
            this.txtName.text = member.m_szNickName;
            this.txtZdl.text = member.m_uiFight.toString();
        }
        //目前不是队长不可见
        if (isCaptain) {
            this.imgduizhang.SetActive(true);
        }
        else {
            this.imgduizhang.SetActive(false);
        }
    }

    //邀请按钮
    private onClickYaoQing() {
        G.Uimgr.createForm<InvitingPlayerView>(InvitingPlayerView).open(KeyWord.OTHER_FUNCTION_TEAM_INVITING_NEARPLAYER, false);
        this.setBtnHide(false);
    }

    //点击玩家，设为队长
    private onSetDuiZhang() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamOperateRequestMsg(Macros.OperateTeam_NewCaptain, this.data.m_stRoleID));
        this.setBtnHide(false);
    }

    //点击玩家，踢出
    private onTichu() {
        if (G.DataMgr.teamData.isCaptain()) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamOperateRequestMsg(Macros.OperateTeam_KickMember, this.data.m_stRoleID));
        }
        this.setBtnHide(false);
    }

    setBtnHide(isShow: boolean) {
        this.btnSetDuiZhang.SetActive(isShow);
        this.btnTichu.SetActive(isShow);
    }
}