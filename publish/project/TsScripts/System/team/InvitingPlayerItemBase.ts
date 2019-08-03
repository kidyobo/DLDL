import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { Global as G } from "System/global"
import { UIPathData } from "System/data/UIPathData"
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { FriendData } from 'System/data/FriendData'
import { CompareUtil } from 'System/utils/CompareUtil'
import { TabSubForm } from 'System/uilib/TabForm'
import { InvitingPlayerView } from 'System/team/InvitingPlayerView'
import { Macros } from "System/protocol/Macros"
import { NearTeamView } from "System/team/NearTeamView"


class InviteItemData {
    roleId: Protocol.RoleID;
    name: string;
    lv: number;
    zdl: number;
    prof: string;
    index: number;
    isOpenFromFuBen: boolean;
    /**职业*/
    profession: number;
    /**性别*/
    sex: number;
}


class InvitePlayerItem {

    //private txtDuizhang: UnityEngine.UI.Text;
    //private txtLv: UnityEngine.UI.Text;
    //private txtZdl: UnityEngine.UI.Text;
    //private txtRenShu: UnityEngine.UI.Text;
    //private btnYaoqing: UnityEngine.GameObject;
    //private bg1: UnityEngine.GameObject;
    //private bg2: UnityEngine.GameObject;
    //private togInvite: UnityEngine.UI.ActiveToggle;
    /**职业图片前缀*/
    private readonly professionPrefix: string = "job_";

    private imgPhoto: UnityEngine.UI.Image;
    private txtLv: UnityEngine.UI.Text;
    private imgHeroType: UnityEngine.UI.Image;
    private txtHeroName: UnityEngine.UI.Text;
    private txtFight: UnityEngine.UI.Text;
    private btnYaoqing: UnityEngine.GameObject;

    private data: InviteItemData;

    private panel: InvitingPlayerItemBase;
    constructor(panel: InvitingPlayerItemBase) {
        this.panel = panel;
    }

    setComponents(go: UnityEngine.GameObject,isOpenFromFuBen:boolean) {
        //this.txtDuizhang = ElemFinder.findText(go, 'item/txtDuizhang');
        //this.txtLv = ElemFinder.findText(go, 'item/txtLv');
        //this.txtZdl = ElemFinder.findText(go, 'item/txtZdl');
        //this.txtRenShu = ElemFinder.findText(go, 'item/txtRenShu');
        //this.btnYaoqing = ElemFinder.findObject(go, 'item/btnYaoqing');
        //this.togInvite = ElemFinder.findActiveToggle(go, 'item/togInvite');

        ///**深浅交替背景*/
        //this.bg1 = ElemFinder.findObject(go, 'item/bg1');
        //this.bg2 = ElemFinder.findObject(go, 'item/bg2');

        this.imgPhoto = ElemFinder.findImage(go, "item/imgPhoto");
        this.txtLv = ElemFinder.findText(go, "item/imgPhoto/txtLv");
        this.imgHeroType = ElemFinder.findImage(go, "item/imgHeroType");
        this.txtHeroName = ElemFinder.findText(go, "item/imgHeroType/txtHeroName");
        this.txtFight = ElemFinder.findText(go, "item/fight/txtFight");
        this.btnYaoqing = ElemFinder.findObject(go, 'item/btnYaoqing');

        Game.UIClickListener.Get(this.btnYaoqing).onClick = delegate(this, this.onClickYaoQing,isOpenFromFuBen);
        //this.togInvite.onValueChanged = delegate(this, this.togValueChange);
    }

    /**
     * 资源加载
     * @param data
     */
    update(data: InviteItemData) {
        this.imgPhoto.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}s', data.profession, data.sex));
        this.txtLv.text = data.lv.toString();
        this.imgHeroType.sprite = G.AltasManager.professionAltas.Get(this.professionPrefix + data.profession);
        this.txtHeroName.text = data.name;
        this.txtFight.text = data.zdl.toString();

        //if (this.togInvite != null) {
        //    this.togInvite.isOn = false;
        //}

        this.data = data;
        //this.txtDuizhang.text = data.name;
        //this.txtLv.text = data.lv.toString();
        //this.txtZdl.text = data.zdl.toString();
        //this.txtRenShu.text = data.prof;

        //this.bg1.SetActive(data.index % 2 == 0);
        //this.bg2.SetActive(data.index % 2 == 1);
        //this.btnYaoqing.SetActive(!data.isOpenFromFuBen);

        //if (this.togInvite != null) {
        //    this.togInvite.gameObject.SetActive(data.isOpenFromFuBen);
        //}

    }

    //getTogValue() {
    //    if (this.togInvite != null) {
    //        return this.togInvite.isOn;
    //    }
    //    return false;
    //}

    //private togValueChange() {
    //    this.panel.updateShowBtn();
    //}

    private onClickYaoQing(isOpenFromFuBen:boolean) {
        G.ActionHandler.inviteTeam(this.data.roleId,!isOpenFromFuBen);
        let view = G.Uimgr.getForm<InvitingPlayerView>(InvitingPlayerView);
        if (view != null) {
            view.close();
        }
    }

    dispose() {
        this.panel = null;
    }

}


export abstract class InvitingPlayerItemBase extends TabSubForm {

    /**等待16s才能再次发送，后台用的15s*/
    private readonly CLICK_WAIT_TIME = 16;

    /**附近队伍，最大可显示*/
    private readonly maxPlayerCount = 20;
    /**附近的玩家*/
    protected playerList: List;
    /**附近队伍信息*/
    private nearTeamData: Protocol.NearTeamInfo[];
    /**刷新按钮*/
    private btnShuaXin: UnityEngine.GameObject = null;
    private btnInvite: UnityEngine.GameObject = null;

    private invitePlayerItems: InvitePlayerItem[] = [];
    private inviteItemDatas: InviteItemData[] = [];
    private isOpenFromFuBen: boolean = false;

    protected resPath(): string {
        return UIPathData.InvitingPlayerItemPanel;
    }

    protected initElements(): void {
        super.initElements();
        this.btnShuaXin = this.elems.getElement("btnShuaXin");
        this.btnInvite = this.elems.getElement("btnInvite");
        this.playerList = this.elems.getUIList("playerList");
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnShuaXin, this.OnShuaXinClick);
        //this.addClickListener(this.btnInvite, this.OnClickBtnInvite);
    }

    open(isOpenFromFuBen: boolean) {
        if (isOpenFromFuBen == undefined) {
            isOpenFromFuBen = G.Uimgr.getForm<InvitingPlayerView>(InvitingPlayerView).getOpenFromType();
        }
        this.isOpenFromFuBen = isOpenFromFuBen;
        super.open();
    }

    protected onOpen() {
        super.onOpen();
        this.playerList.Count = 0;
        this.btnInvite.SetActive(this.isOpenFromFuBen);
        this.btnShuaXin.SetActive(!this.isOpenFromFuBen);
    }


    protected onClose() {
        super.onClose();

        for (let i = 0; i < this.invitePlayerItems.length; i++) {
            this.invitePlayerItems[i].dispose();
        }
        this.invitePlayerItems = [];
    }


    /**
     *刷新附近队伍的信息  
     * @param data2 附近玩家信息
     */
    updataTeamData(): void {
        let data = G.DataMgr.teamData.m_nearRoleInfo;
        //最大显示多少
        if (data != null) {
            let maxCount = data.length > this.maxPlayerCount ? this.maxPlayerCount : data.length;
            this.updataView(data, maxCount);
        } else {
            this.playerList.Count = 0;
        }
    }

    ///**
    // * 显示玩家的信息
    // * @param item
    // * @param roleId 角色ID
    // * @param name 昵称
    // * @param lv 等级
    // * @param zdl 战斗力
    // * @param prof 职业
    // */
    //private showPlayerInfo(item: ListItem, roleId: Protocol.RoleID, name: string, lv: number, zdl: number, prof: string, num: number, isOpenFromFuBen: boolean) {
    //    let txtDuizhang = ElemFinder.findText(item.gameObject, 'item/txtDuizhang');
    //    let txtLv = ElemFinder.findText(item.gameObject, 'item/txtLv');
    //    let txtZdl = ElemFinder.findText(item.gameObject, 'item/txtZdl');//
    //    let txtRenShu = ElemFinder.findText(item.gameObject, 'item/txtRenShu');
    //    let btnYaoqing = ElemFinder.findObject(item.gameObject, 'item/btnYaoqing');//
    //    let togInvite = ElemFinder.findActiveToggle(item.gameObject, 'item/togInvite');

    //    /**深浅交替背景*/
    //    let bg1 = ElemFinder.findObject(item.gameObject, 'item/bg1');
    //    let bg2 = ElemFinder.findObject(item.gameObject, 'item/bg2');
    //    Game.UIClickListener.Get(btnYaoqing).onClick = delegate(this, this.onClickYaoQing, roleId);
    //    txtDuizhang.text = name;
    //    txtLv.text = lv.toString();
    //    txtZdl.text = zdl.toString();
    //    txtRenShu.text = prof;

    //    if (num % 2 == 0) {
    //        bg1.SetActive(true);
    //        bg2.SetActive(false);
    //    } else {
    //        bg1.SetActive(false);
    //        bg2.SetActive(true);
    //    }

    //    btnYaoqing.SetActive(!isOpenFromFuBen);
    //    togInvite.gameObject.SetActive(isOpenFromFuBen);

    //}


    private onClickYaoQing(roleId: Protocol.RoleID) {
        G.ActionHandler.inviteTeam(roleId);
        this.close();
    }

    /**
     *得到好友
     */
    onRefreshData() {
        //刷新列表
        let data: FriendData = G.DataMgr.friendData;
        if (data == null) {
            this.playerList.Count = 0;
            return;
        }

        let friendTemp: Protocol.GameFriendInfo[] = [];
        for (let friendData of data.gameFriend) {
            if (friendData.m_cZoneID == 0
                || G.DataMgr.teamData.isInMyNormalTeam(friendData.m_stRoleID)
                || G.DataMgr.teamData.isInZuDuiTeam(friendData.m_stRoleID)
            ) {
                continue;
            }
            friendTemp.push(friendData);
        }

        friendTemp.sort(delegate(this, this.compareZone));

        //刷新好友列表
        let friendLength: number = friendTemp.length;
        //最大显示多少
        let maxCount = friendTemp.length > this.maxPlayerCount ? this.maxPlayerCount : friendTemp.length;
        this.updataView(friendTemp, maxCount);
    }

    private compareZone(a: Protocol.GameFriendInfo, b: Protocol.GameFriendInfo): number {
        //在线与不在线
        if (a.m_cZoneID < 0) {
            return 1;
        }
        else {
            return -1;
        }
    }

    private sortFunc(a: Protocol.GuildMemberInfo, b: Protocol.GuildMemberInfo) {
        return this.sortMembers(a, b);
    }
    //////////////////////////宗们成员/////////////////////////////

    updateList() {
        let allMemberNum = 0;
        let memberList = G.DataMgr.guildData.guildMemberList;
        let memberInfos: Protocol.GuildMemberInfo[];
        if (memberList != null) {
            memberInfos = memberList.m_astGuildMemberInfo;
            memberInfos.sort(delegate(this, this.sortFunc));
            allMemberNum = memberInfos.length;
        } else {
            this.playerList.Count = 0;
            return;
        }

        let memberTemp: Protocol.GuildMemberInfo[] = [];
        for (let memberData of memberInfos) {
            if (memberData.m_bOnline == 0
                || CompareUtil.isRoleIDEqual(memberData.m_stRoleID, G.DataMgr.heroData.roleID)
                || G.DataMgr.teamData.isInMyNormalTeam(memberData.m_stRoleID)
                || G.DataMgr.teamData.isInZuDuiTeam(memberData.m_stRoleID)
            ) {
                continue;
            }
            memberTemp.push(memberData);
        }
        this.updataView(memberTemp, memberTemp.length);
    }

    /**
    * 排序
    * @param data1
    * @param data2
    * @return
    *
    */
    private sortMembers(data1: Protocol.GuildMemberInfo, data2: Protocol.GuildMemberInfo): number {
        return data2.m_iFightVal - data1.m_iFightVal;
    }


    private updataView(playerList: any, playerNum: number) {
        if (this.id == KeyWord.OTHER_FUNCTION_TEAM_INVITING_NEARPLAYER) {
            this.playerList.Count = playerNum;
            let data = playerList as Protocol.NearRoleInfo[];
            for (let i = 0; i < playerNum; i++) {
                // let item = this.playerList.GetItem(i);
                let prof = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, data[i].m_stBaseInfo.m_cProfession);
                //this.showPlayerInfo(item, data[i].m_stRoleID, data[i].m_stBaseInfo.m_szNickName, data[i].m_usLevel, data[i].m_uiFight, prof, i, this.isOpenFromFuBen);

                if (this.inviteItemDatas[i] == null) {
                    this.inviteItemDatas[i] = new InviteItemData();
                }
                this.inviteItemDatas[i].prof = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, data[i].m_stBaseInfo.m_cProfession);
                this.inviteItemDatas[i].index = i;
                this.inviteItemDatas[i].isOpenFromFuBen = this.isOpenFromFuBen;
                this.inviteItemDatas[i].lv = data[i].m_usLevel;
                this.inviteItemDatas[i].name = data[i].m_stBaseInfo.m_szNickName;
                this.inviteItemDatas[i].roleId = data[i].m_stRoleID;
                this.inviteItemDatas[i].zdl = data[i].m_uiFight;
                this.inviteItemDatas[i].profession = data[i].m_stBaseInfo.m_cProfession;
                this.inviteItemDatas[i].sex = data[i].m_stBaseInfo.m_cGender;

            }
        }
        else if (this.id == KeyWord.OTHER_FUNCTION_TEAM_INVITING_MYGUILD) {
            this.playerList.Count = playerNum;
            let data = playerList as Protocol.GuildMemberInfo[];
            for (let i = 0; i < playerNum; i++) {
                //  let item = this.playerList.GetItem(i);
                let prof = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, data[i].m_stBaseProfile.m_cProfession);
                // this.showPlayerInfo(item, data[i].m_stRoleID, data[i].m_stBaseProfile.m_szNickName, data[i].m_stBaseProfile.m_usLevel, data[i].m_iFightVal, prof, i, this.isOpenFromFuBen);


                if (this.inviteItemDatas[i] == null) {
                    this.inviteItemDatas[i] = new InviteItemData();
                }
                this.inviteItemDatas[i].prof = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, data[i].m_stBaseProfile.m_cProfession);
                this.inviteItemDatas[i].index = i;
                this.inviteItemDatas[i].isOpenFromFuBen = this.isOpenFromFuBen;
                this.inviteItemDatas[i].lv = data[i].m_stBaseProfile.m_usLevel;
                this.inviteItemDatas[i].name = data[i].m_stBaseProfile.m_szNickName;
                this.inviteItemDatas[i].roleId = data[i].m_stRoleID;
                this.inviteItemDatas[i].zdl = data[i].m_iFightVal;
                this.inviteItemDatas[i].profession = data[i].m_stBaseProfile.m_cProfession
                this.inviteItemDatas[i].sex = data[i].m_stBaseProfile.m_cGender;

            }
        }
        else if (this.id == KeyWord.OTHER_FUNCTION_TEAM_INVITING_MYFRIEND) {
            this.playerList.Count = playerNum;
            let data = playerList as Protocol.GameFriendInfo[]
            for (let i = 0; i < playerNum; i++) {
                //let item = this.playerList.GetItem(i);
                let prof = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, data[i].m_cProfession);
                // this.showPlayerInfo(item, data[i].m_stRoleID, data[i].m_szNickName, data[i].m_usLevel, data[i].m_iBattleEffect, prof, i, this.isOpenFromFuBen);

                if (this.inviteItemDatas[i] == null) {
                    this.inviteItemDatas[i] = new InviteItemData();
                }
                this.inviteItemDatas[i].prof = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, data[i].m_cProfession);
                this.inviteItemDatas[i].index = i;
                this.inviteItemDatas[i].isOpenFromFuBen = this.isOpenFromFuBen;
                this.inviteItemDatas[i].lv = data[i].m_usLevel;
                this.inviteItemDatas[i].name = data[i].m_szNickName;
                this.inviteItemDatas[i].roleId = data[i].m_stRoleID;
                this.inviteItemDatas[i].zdl = data[i].m_iBattleEffect;
                this.inviteItemDatas[i].profession = data[i].m_cProfession;
                this.inviteItemDatas[i].sex = data[i].m_cGender;

            }
        }

        for (let i = 0; i < this.playerList.Count; i++) {
            if (this.invitePlayerItems[i] == null) {
                let item = this.playerList.GetItem(i).gameObject;
                this.invitePlayerItems[i] = new InvitePlayerItem(this);
                this.invitePlayerItems[i].setComponents(item,this.isOpenFromFuBen);
            }
            this.invitePlayerItems[i].update(this.inviteItemDatas[i]);
        }

        //this.updateShowBtn();
    }


    //updateShowBtn() {
    //    this.btnInvite.SetActive(this.isOpenFromFuBen && this.getInviteTRoleIds().length > 0);
    //}

    //private getInviteTRoleIds() {
    //    let roleIds: Protocol.RoleID[] = [];
    //    for (let i = 0; i < this.playerList.Count; i++) {
    //        if (this.invitePlayerItems[i] && this.invitePlayerItems[i].getTogValue() && this.inviteItemDatas[i]) {
    //            roleIds.push(this.inviteItemDatas[i].roleId);
    //        }
    //    }
    //    return roleIds;
    //}


    protected abstract OnShuaXinClick();

    /**
     * 邀请选中的角色
     */
    //protected OnClickBtnInvite() {

    //    let oldTime = G.DataMgr.runtime.lastClickInvitePlayerTime;
    //    if (UnityEngine.Time.realtimeSinceStartup - oldTime < this.CLICK_WAIT_TIME) {
    //        G.TipMgr.addMainFloatTip("亲，您的邀请过于频繁，请稍后再邀请");
    //        return;
    //    }

    //    G.DataMgr.runtime.lastClickInvitePlayerTime = UnityEngine.Time.realtimeSinceStartup;

    //    let roleIds = this.getInviteTRoleIds();
    //    if (roleIds.length > Macros.MAX_RECRUITTEAM_ROLE_NUM) {
    //        G.TipMgr.addMainFloatTip(uts.format("最大可邀请{0}玩家！", Macros.MAX_RECRUITTEAM_ROLE_NUM));
    //        return;
    //    }

    //    let myTeam: Protocol.Cross_OneTeam = G.DataMgr.sxtData.myTeam;
    //    if (myTeam) {
    //        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCSCrossRecruitTeamRequest(Macros.RECRUITTEAM_TYPE_ROLE, myTeam.m_uiPinstanceID, roleIds));
    //        G.TipMgr.addMainFloatTip("已发送邀请!");
    //    }
    //}
}