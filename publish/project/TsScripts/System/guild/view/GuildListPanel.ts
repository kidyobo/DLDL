import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { GuildEnterPanel } from 'System/guild/view/GuildEnterPanel'
import { MenuNodeData, MenuView } from 'System/uilib/MenuView'
import { MenuNodeKey, EnumGuide } from 'System/constants/GameEnum'
import { CompareUtil } from 'System/utils/CompareUtil'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { KeyWord } from 'System/constants/KeyWord'

enum EnumGuildListSortRule {
    rank = 0,
    lv,
    num,
    fight,
}

class GuildListItem2 {
    /**前三名专用图标*/
    private rankImage: UnityEngine.UI.Image;
    /**排名*/
    private rankText: UnityEngine.UI.Text;
    /**名称*/
    private nameText: UnityEngine.UI.Text;
    /**宗主名字*/
    private masterText: UnityEngine.UI.Text;
    /**等级*/
    private lvText: UnityEngine.UI.Text;
    /**人数*/
    private numText: UnityEngine.UI.Text;
    /**战斗力*/
    private zdlText: UnityEngine.UI.Text;

    public info: Protocol.GuildQueryInfo;

    /**深浅交替背景*/
    private bg2: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.rankImage = ElemFinder.findImage(go, 'rankImage');
        this.rankText = ElemFinder.findText(go, 'rankText');
        this.nameText = ElemFinder.findText(go, 'nameText');
        this.masterText = ElemFinder.findText(go, 'masterText');
        this.lvText = ElemFinder.findText(go, 'lvText');
        this.numText = ElemFinder.findText(go, 'numText');
        this.zdlText = ElemFinder.findText(go, 'zdlText');

        this.bg2 = ElemFinder.findObject(go, 'bg2');
    }

    update(rank: number, info: Protocol.GuildQueryInfo) {
        this.info = info;

        this.rankImage.gameObject.SetActive(false);
        this.rankText.text = rank.toString();
        this.nameText.text = info.m_szGuildName;
        this.masterText.text = info.m_szChairmanName;
        this.lvText.text = info.m_ushGuildLevel.toString();
        this.numText.text = uts.format('{0}/{1}', info.m_ushMemberNumber, G.DataMgr.guildData.getGuildLevelConfig(info.m_ushGuildLevel).m_uchMan);
        this.zdlText.text = info.m_uiFightVal.toString();

        if (rank % 2 == 0) {
            this.bg2.SetActive(true);
        } else {
            this.bg2.SetActive(false);
        }
    }
}

export class GuildListPanel extends TabSubForm {

    private list: List;
    private items: GuildListItem2[] = [];

    private sortRule: EnumGuildListSortRule = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_GUILD_LIST);
        this.closeSound = null;
    }

    protected resPath(): string {
        return UIPathData.GuildListView;
    }

    protected initElements() {
        this.list = this.elems.getUIList('list');
    }

    protected initListeners() {
        //this.list.onClickItem = delegate(this, this.onClickList);
    }

    private onClickList(index: number) {
        if (index >= this.items.length) {
            return;
        }

        let info = this.items[index].info;
        let leaderRoleID = info.m_stChairmanID;
        if (!CompareUtil.isRoleIDEqual(leaderRoleID, G.DataMgr.heroData.roleID)) {
            let menuNodes: MenuNodeData[] = [];
            G.ActionHandler.getRoleMenu(menuNodes, leaderRoleID, false, false, false);
            G.Uimgr.createForm<MenuView>(MenuView).open(info.m_szChairmanName, info.m_szGuildName, menuNodes, delegate(this, this.onClickMenu));
        }
    }

    private onClickMenu(selectedNode: MenuNodeData) {
        let index = this.list.Selected;
        if (index >= this.items.length) {
            return;
        }

        let info = this.items[index].info;
        let roleAbstract = new RoleAbstract();
        roleAbstract.adaptFromGuildQueryInfo(info);
        G.ActionHandler.onRoleMenu(roleAbstract, selectedNode.key);
    }

    updateView(): void {
        let guildInfolist: Protocol.GuildQueryList = G.DataMgr.guildData.m_stGuildList;
        if (null == guildInfolist) {
            return;
        }

        this.list.Count = guildInfolist.m_ushNumber;

        let myGuildID: number = G.DataMgr.heroData.guildId;
        let oldItemCnt = this.items.length;
        for (let i: number = 0; i < guildInfolist.m_ushNumber; i++) {
            let item: GuildListItem2;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new GuildListItem2());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            if (guildInfolist.m_astGuildInfo[i] != null) {
                item.update(i + 1, guildInfolist.m_astGuildInfo[i]);
            }
        }
    }

    protected onOpen() {
        // 拉取宗门列表
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_GET_GUILD_LIST));
        G.GuideMgr.processGuideNext(EnumGuide.Guild, EnumGuide.Guild_OpenGuildView);
    }

    protected onClose() {
    }
}