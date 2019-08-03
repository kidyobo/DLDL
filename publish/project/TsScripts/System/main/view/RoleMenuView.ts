import { Global as G } from 'System/global'
import { UILayer, CommonForm } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ElemFinder } from 'System/uilib/UiUtility'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { MenuNodeKey } from 'System/constants/GameEnum'

export enum MenuPanelType {
    fromChat = 0,
    fromTeam = 1,
    fromMain = 2,
    fromMarryQiuYuan = 3,
    fromFriendPanel = 4,
}

class PortraitItem {
    private imgIco: UnityEngine.UI.Image;
    private imgType: UnityEngine.UI.Image;
    private txtName: UnityEngine.UI.Text;
    private txtLv: UnityEngine.UI.Text;
    private txtFinght: UnityEngine.UI.Text;

    setComponents(target: UnityEngine.GameObject) {
        this.imgIco = ElemFinder.findImage(target, "imgIco");
        this.imgType = ElemFinder.findImage(target, "imgType");
        this.txtName = ElemFinder.findText(target, "txtName");
        this.txtLv = ElemFinder.findText(target, "txtLv");
        this.txtFinght = ElemFinder.findText(target, "txtFinght");
    }

    updateView(info: Protocol.TeamMemberInfoForNotify) {
        this.imgIco.sprite = G.AltasManager.roleHeadAltas.Get(uts.format("{0}_{1}s", info.m_ucProfessionType, info.m_ucGenderType));
        this.imgType.sprite = G.AltasManager.professionAltas.Get(uts.format("job_{0}", info.m_ucProfessionType));
        this.txtName.text = info.m_szNickName.toString();
        this.txtLv.text = info.m_usLevel.toString();
        this.txtFinght.text = info.m_uiFight.toString();
    }

    updateViewFirend(roleAbstract: RoleAbstract) {
        this.imgIco.sprite = G.AltasManager.roleHeadAltas.Get(uts.format("{0}_{1}s", roleAbstract.prof, roleAbstract.gender));
        this.imgType.sprite = G.AltasManager.professionAltas.Get(uts.format("job_{0}", roleAbstract.prof));
        this.txtName.text = roleAbstract.nickName;
        this.txtLv.text = roleAbstract.lv.toString();
        if (roleAbstract.power != null)
            this.txtFinght.text = roleAbstract.power.toString();
    }
}

export class RoleMenuView extends CommonForm {

    private roleAbstract: RoleAbstract = null;
    private buttons: UnityEngine.GameObject;
    private type: number = 0;
    private panelRect: UnityEngine.RectTransform;
    private max_MenuBt: number = 9;
    private btn_addFriend: UnityEngine.GameObject;
    private btn_black: UnityEngine.GameObject;
    private btn_kick: UnityEngine.GameObject;
    private btn_captain: UnityEngine.GameObject;
    private btn_team: UnityEngine.GameObject;
    private btn_flower: UnityEngine.GameObject;
    private btnSendQKL: UnityEngine.GameObject;
    private btn_delete: UnityEngine.GameObject;

    private ico: UnityEngine.GameObject;
    private portraitItem: PortraitItem;

    private readonly hight: number = 57;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.RoleMenuView;
    }

    protected initElements() {
        this.panelRect = this.elems.getRectTransform('panel');
        this.buttons = this.elems.getElement('buttons');
        this.btn_addFriend = this.elems.getElement('btnAddFriend');
        this.btn_black = this.elems.getElement('btnBlack');
        this.btn_kick = this.elems.getElement('btnKick');
        this.btn_captain = this.elems.getElement('btnCaptain');
        this.btn_team = this.elems.getElement('btnZuDui');
        this.btn_flower = this.elems.getElement('btnSongHua');
        this.btn_delete = this.elems.getElement('btndelete');

        this.ico = this.elems.getElement("ico");
        this.portraitItem = new PortraitItem();
        this.portraitItem.setComponents(this.ico);
    }

    protected initListeners() {
        Game.UIClickListener.Get(this.elems.getElement('btnInfo')).onClick = delegate(this, this.onClickMenuBt, MenuNodeKey.ROLE_INFO);
        Game.UIClickListener.Get(this.elems.getElement('btnChat')).onClick = delegate(this, this.onClickMenuBt, MenuNodeKey.ROLE_TALK);
        Game.UIClickListener.Get(this.btn_addFriend).onClick = delegate(this, this.onClickMenuBt, MenuNodeKey.ROLE_ADD_FRIEND);
        Game.UIClickListener.Get(this.btn_black).onClick = delegate(this, this.onClickMenuBt, MenuNodeKey.ROLE_BLACK);
        Game.UIClickListener.Get(this.btn_team).onClick = delegate(this, this.onClickMenuBt, MenuNodeKey.ROLE_TEAM);
        Game.UIClickListener.Get(this.btn_kick).onClick = delegate(this, this.onClickMenuBt, MenuNodeKey.TEAM_KICK);
        Game.UIClickListener.Get(this.btn_captain).onClick = delegate(this, this.onClickMenuBt, MenuNodeKey.TEAM_CAPTAIN);
        Game.UIClickListener.Get(this.btn_flower).onClick = delegate(this, this.onClickMenuBt, MenuNodeKey.ROLE_FLOWER);
        Game.UIClickListener.Get(this.btn_delete).onClick = delegate(this, this.onClickMenuBt, MenuNodeKey.ROLE_DELECT);

        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.elems.getElement('btn_return'), this.close);
    }


    open(roleAbstract: RoleAbstract, type: MenuPanelType) {
        this.roleAbstract = roleAbstract;
        this.type = type;
        super.open();
    }

    updateView(info: Protocol.TeamMemberInfoForNotify) {
        this.portraitItem.updateView(info);
    }

    updateViewFriend(roleAbstract: RoleAbstract) {
        this.portraitItem.updateViewFirend(roleAbstract);
    }

    protected onOpen() {
        //关闭送花
        this.btn_flower.SetActive(false);

        if (this.type == MenuPanelType.fromChat) {
            this.panelRect.anchoredPosition = G.getCacheV2(614, -515);
        }
        else if (this.type == MenuPanelType.fromMain) {
            this.panelRect.anchoredPosition = G.getCacheV2(530, -99);
        }
        else if (this.type == MenuPanelType.fromTeam) {
            this.panelRect.anchoredPosition = G.getCacheV2(264, -238);
        }
        else if (this.type == MenuPanelType.fromMarryQiuYuan) {
            this.panelRect.anchoredPosition = G.getCacheV2(930, -135);
        }
        else if (this.type == MenuPanelType.fromFriendPanel) {
            this.panelRect.anchoredPosition = G.getCacheV2(455, -217);
        }
        let isMyFriend = G.DataMgr.friendData.isMyFriend(this.roleAbstract.roleID);
        this.btn_addFriend.SetActive(!isMyFriend);
        let isBlack = G.DataMgr.friendData.isBlack(this.roleAbstract.roleID);
        this.btn_black.SetActive(isMyFriend && !isBlack);
        this.btn_delete.SetActive(this.type == MenuPanelType.fromFriendPanel);

        if (this.type == MenuPanelType.fromMarryQiuYuan) {
            this.btn_team.SetActive(false);
            this.btn_kick.SetActive(false);
            this.btn_captain.SetActive(false);
        } else {
            this.btn_team.SetActive(!G.DataMgr.teamData.hasTeam);
            let isMeCaptain = G.DataMgr.teamData.isCaptain();
            let isMyTeam = G.DataMgr.teamData.isMyTeamMember(this.roleAbstract.roleID)
            this.btn_kick.SetActive(isMeCaptain && isMyTeam);
            this.btn_captain.SetActive(isMeCaptain && isMyTeam);
        }
        //this.btnSendQKL.SetActive(G.DataMgr.activityData.isQingRenJieOpen());
        let showCount = this.max_MenuBt;
        for (let i = 0; i < this.max_MenuBt; i++) {
            let bt = this.buttons.transform.GetChild(i).gameObject;
            if (!bt.activeSelf) {
                showCount--;
            }
        }

        this.panelRect.sizeDelta = G.getCacheV2(406, ((Math.ceil(showCount / 2) * this.hight) + 130));
        if (this.type == MenuPanelType.fromTeam) {
            this.panelRect.sizeDelta = G.getCacheV2(406, 466);
        }
        else if (this.type == MenuPanelType.fromFriendPanel) {
            this.updateViewFriend(this.roleAbstract);
        }
        else {
            this.updateViewFriend(this.roleAbstract);
        }
    }

    protected onClose() {

    }


    private onClickMenuBt(menuKey: MenuNodeKey) {
        if (this.roleAbstract == null) {
            return;
        }
        this.roleAbstract.isOnline = true;
        G.ActionHandler.onRoleMenu(this.roleAbstract, menuKey);
        this.close();
    }
}