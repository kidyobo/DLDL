import { Global as G } from 'System/global'
import { ConfirmCheck } from 'System/tip/TipManager'
import { ActionHandler } from 'System/ActionHandler'
import { KeyWord } from 'System/constants/KeyWord'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { UnitStatus } from 'System/utils/UnitStatus'
import { TeamView } from 'System/team/TeamView'
import { RoleMenuView, MenuPanelType } from 'System/main/view/RoleMenuView'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { MyTeamView } from "System/team/MyTeamView"
import { NearTeamView } from 'System/team/NearTeamView'


class TeamMemberItem extends ListItemCtrl {
    /**队友名字*/
    private textName: UnityEngine.UI.Text;
    /**队友状态*/
    private textStatus: UnityEngine.UI.Text;
    /**队友血条*/
    private hpBar: UnityEngine.RectTransform;
    private hpText: UnityEngine.UI.Text;
    /**队长标记*/
    private captainGo: UnityEngine.GameObject;
    /**1枪手2战士*/
    private profess1: UnityEngine.GameObject;
    private profess2: UnityEngine.GameObject;

    info: Protocol.TeamMemberInfoForNotify;

    setComponents(go: UnityEngine.GameObject) {
        this.textName = ElemFinder.findText(go, 'textName');
        this.textStatus = ElemFinder.findText(go, 'hpBar/textStatus');
        this.hpBar = ElemFinder.findRectTransform(go, 'hpBar/bar');
        this.hpText = ElemFinder.findText(go, "hpBar/hpText");
        this.captainGo = ElemFinder.findObject(go, 'captainGo');
        this.profess1 = ElemFinder.findObject(go, "statusbg/1");
        this.profess2 = ElemFinder.findObject(go, "statusbg/2");
    }

    update(info: Protocol.TeamMemberInfoForNotify) {
        this.info = info;
        this.textName.text = uts.format('{0}级[{1}]', info.m_usLevel, info.m_szNickName);
        if (UnitStatus.isOffline(info.m_uiUnitStatus)) {
            // 显示离线
            this.textStatus.text = '离线';
        }
        else if (info.m_iHitPoint == 0) {
            // 显示死亡
            this.textStatus.text = '死亡';
        }
        else {
            // 显示职业
            this.textStatus.text = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, info.m_ucProfessionType);
        }

        let hpPercent = info.m_iHitPoint / (info.m_iHitPointCapacity == 0 ? 1 : info.m_iHitPointCapacity);

        Game.Tools.SetLocalScale(this.hpBar, hpPercent, 1, 1);
        this.hpText.text = (hpPercent * 100).toFixed(1) + '%';

        this.captainGo.SetActive(G.DataMgr.teamData.isCaptain(info.m_stRoleID));

        this.profess1.SetActive(info.m_ucProfessionType == 1);
        this.profess2.SetActive(info.m_ucProfessionType == 2);
    }
}

export class TeamMembersPanel {

    private gameObject: UnityEngine.GameObject;
    private imgBackGround: UnityEngine.UI.Image;

    private list: List = null;
    private items: TeamMemberItem[] = [];

    private noTeamGo: UnityEngine.GameObject;
    private findTeamGo: UnityEngine.GameObject;
    // private captainGo: UnityEngine.GameObject;
    private btnQuit: UnityEngine.GameObject;

    private roleAbstract: RoleAbstract;

    setView(uiElems: UiElements) {
        this.gameObject = uiElems.getElement('teamPanel');
        this.imgBackGround = this.gameObject.GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;

        this.list = ElemFinder.getUIList(ElemFinder.findObject(this.gameObject, 'list'));
        this.list.onClickItem = delegate(this, this.onClickListItem);

        this.noTeamGo = ElemFinder.findObject(this.gameObject, 'noTeamGo');
        Game.UIClickListener.Get(this.noTeamGo).onClick = delegate(this, this.onClickNoTeamGo);

        this.findTeamGo = ElemFinder.findObject(this.gameObject, "findTeamGo");
        Game.UIClickListener.Get(this.findTeamGo).onClick = delegate(this, this.onClickFindTeamGo);

        // this.captainGo = ElemFinder.findObject(this.gameObject, 'captainGo');
        this.btnQuit = ElemFinder.findObject(this.gameObject, 'btnQuit');
        Game.UIClickListener.Get(this.btnQuit).onClick = delegate(this, this.onClickBtnQuit);
    }

    setActive(value: boolean) {
        this.gameObject.SetActive(value);
        if (value) {
            this.updateView();
        }
    }

    onTeamChanged(): void {
        this.updateView();
    }

    private updateView() {
        let teamData = G.DataMgr.teamData;
        if (teamData.hasTeam) {
            // this.captainGo.SetActive(teamData.isCaptain(G.DataMgr.heroData.roleID));
            //this.btnQuit.gameObject.SetActive(true);
            //this.noTeamGo.SetActive(false);
            //this.findTeamGo.SetActive(false);

            this.closeCreatTeamPanel();

            let cnt = 0;
            let members = G.DataMgr.teamData.memberList;
            if (null != members) {
                cnt = members.length;
            }
            this.list.Count = cnt;
            let oldItemCnt = this.items.length;
            for (let i = 0; i < cnt; i++) {
                let item: TeamMemberItem;
                if (i < oldItemCnt) {
                    item = this.items[i];
                } else {
                    this.items.push(item = new TeamMemberItem());
                    item.setComponents(this.list.GetItem(i).gameObject);
                }
                item.update(members[i]);
            }
        } else {
            // this.captainGo.SetActive(false);
            //this.btnQuit.gameObject.SetActive(false);
            //this.noTeamGo.SetActive(true);
            //this.findTeamGo.SetActive(true);

            this.openCreatTeamPanel();
            this.list.Count = 0;
        }
    }

    private onClickListItem(index: number) {
        if (null == this.roleAbstract) {
            this.roleAbstract = new RoleAbstract();
        }
        this.roleAbstract.adaptFromTeamMemberInfo(this.items[index].info);
        G.ViewCacher.roleMenuView.open(this.roleAbstract, MenuPanelType.fromTeam);
        G.ViewCacher.roleMenuView.updateView(this.items[index].info);
    }

    private onClickNoTeamGo() {
        let view = G.Uimgr.createForm<MyTeamView>(MyTeamView);
        if (view == null) return;
        view.open();
        //view.createTeamButton();
    }

    private onClickFindTeamGo() {
        G.Uimgr.createForm<NearTeamView>(NearTeamView, true).open();
    }

    private onClickBtnQuit() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamOperateRequestMsg(Macros.OperateTeam_LeaveTeam));
    }

    private openCreatTeamPanel() {
        this.imgBackGround.enabled = false;
        this.btnQuit.gameObject.SetActive(false);
        this.noTeamGo.SetActive(true);
        this.findTeamGo.SetActive(true);
    }

    private closeCreatTeamPanel() {
        this.imgBackGround.enabled = true;
        this.btnQuit.gameObject.SetActive(true);
        this.noTeamGo.SetActive(false);
        this.findTeamGo.SetActive(false);
    }
}