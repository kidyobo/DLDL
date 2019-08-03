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
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'

class GuildRankItem {
    /**排名*/
    private firstObj: UnityEngine.GameObject;
    private secondObj: UnityEngine.GameObject;
    private thirdObj: UnityEngine.GameObject;
    private txtNum: UnityEngine.UI.Text;
    /**名称*/
    private txtGuildName: UnityEngine.UI.Text;
    /**宗主名字*/
    private txtMasterName: UnityEngine.UI.Text;
    /**等级*/
    private txtZiJin: UnityEngine.UI.Text;
    /**人数*/
    private txtReward: UnityEngine.UI.Text;

    /**深浅交替背景*/
    private bg2: UnityEngine.GameObject;

    info: Protocol.DBWorldGuildMoneyOne;

    setComponents(go: UnityEngine.GameObject) {
        this.firstObj = ElemFinder.findObject(go, "imgFirst");
        this.secondObj = ElemFinder.findObject(go, "imgSecond");
        this.thirdObj = ElemFinder.findObject(go, "imgThird");
        this.txtNum = ElemFinder.findText(go, 'txtNum');
        this.txtGuildName = ElemFinder.findText(go, 'txtGuildName');
        this.txtMasterName = ElemFinder.findText(go, 'txtMasterName');
        this.txtZiJin = ElemFinder.findText(go, 'txtZiJin');
        this.txtReward = ElemFinder.findText(go, 'txtReward');
        this.bg2 = ElemFinder.findObject(go, 'bg2');
    }

    update(index: number, info: Protocol.DBWorldGuildMoneyOne) {
        this.info = info;

        let config = G.DataMgr.guildData.getGuildMoneyRankConfig(index);
        if (index <= 0) {
            this.txtNum.text = "未上榜";
            this.txtReward.text = "0";
        } else {
            this.firstObj.SetActive(index == 1);
            this.secondObj.SetActive(index == 2);
            this.thirdObj.SetActive(index == 3);
            this.txtNum.gameObject.SetActive(index > 3);
            this.txtNum.text = index.toString();
            this.txtReward.text = config.m_iAcer.toString();
        }
        this.txtGuildName.text = info.m_szGuildName;
        this.txtMasterName.text = info.m_szLeaderName;
        this.txtZiJin.text = info.m_iAccMoney.toString();
        if ((index - 1) % 2 == 0) {
            this.bg2.SetActive(false);
        } else {
            this.bg2.SetActive(true);
        }
    }
}

export class GuildRankPanel extends TabSubForm {

    /**最大显示宗门数*/
    private readonly maxRankNum: number = 5;
    /**称号id*/
    private readonly titleID: number = 1083;

    private list: List;
    private items: GuildRankItem[] = [];
    private btnGet: UnityEngine.GameObject;
    private btnRule: UnityEngine.GameObject;

    private guildRankItems: GuildRankItem[] = [];

    //我的排名
    private myGuild: UnityEngine.GameObject;
    private myGuildRank: GuildRankItem;
    private myGuildInfo: Protocol.DBWorldGuildMoneyOne;
    //称号图片
    private icon: UnityEngine.GameObject;
    private txtFight: UnityEngine.UI.Text;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_GUILD_RANK);
        this.closeSound = null;
    }

    protected resPath(): string {
        return UIPathData.GuildRankPanel;
    }

    protected initElements() {
        this.list = this.elems.getUIList('list');
        this.btnGet = this.elems.getElement('btnGet');
        this.btnRule = this.elems.getElement('btnRule');

        this.myGuild = this.elems.getElement("myGuild");
        this.myGuildRank = new GuildRankItem();
        this.myGuildRank.setComponents(this.myGuild);

        this.icon = this.elems.getElement("icon");
        this.txtFight = this.elems.getText("txtFight");
    }

    protected initListeners() {
        this.addListClickListener(this.list, this.onClickList);
        this.addClickListener(this.btnGet.gameObject, this.onClickBtnGet);
        this.addClickListener(this.btnRule.gameObject, this.onClickBtnRule);
        this.addClickListener(this.icon, this.onClickBtnIcon);
    }


    protected onOpen() {
        // 拉取宗门排行  GUILD_MONEY_RANK_LIST  GUILD_MONEY_RANK_GET
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_MONEY_RANK_LIST));
    }

    protected onClose() {
    }


    private onClickBtnIcon() {
        let config = G.DataMgr.guildData.getGuildMoneyRankConfig(1);
        let item = new IconItem();
        item.updateById(config.m_iBigAward);
        G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
    }


    private onClickList(index: number) {
        if (index >= this.items.length) {
            return;
        }
        let info = this.items[index].info;
        let leaderRoleID = info.m_stLeaderID;
        if (!CompareUtil.isRoleIDEqual(leaderRoleID, G.DataMgr.heroData.roleID)) {
            let menuNodes: MenuNodeData[] = [];
            G.ActionHandler.getRoleMenu(menuNodes, leaderRoleID, false, false, false);
            G.Uimgr.createForm<MenuView>(MenuView).open(info.m_szGuildName, info.m_szGuildName, menuNodes, delegate(this, this.onClickMenu));
        }
    }

    private onClickMenu(selectedNode: MenuNodeData) {
        let index = this.list.Selected;
        if (index >= this.items.length) {
            return;
        }
        let info = this.items[index].info;
        let roleAbstract = new RoleAbstract();
        roleAbstract.adaptFromGuildMoneyInfo(info);
        G.ActionHandler.onRoleMenu(roleAbstract, selectedNode.key);
    }

    private onClickBtnGet() {
        let guildRanklist = G.DataMgr.guildData.m_stMoneyRankList;
        let rank = guildRanklist.m_ucYestodyRank;
        if (rank > 0 && rank <= 5) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_MONEY_RANK_GET, guildRanklist.m_ucYestodyRank));
        }
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(373), '宗门排行');
    }

    updataPanel(): void {
        let guildRanklist = G.DataMgr.guildData.m_stMoneyRankList;
        if (null == guildRanklist) {
            return;
        }
        this.list.Count = guildRanklist.m_stGuildMoneyRank.m_iRankCount;
        let oldItemCnt = this.items.length;
        for (let i: number = 0; i < this.list.Count; i++) {
            let item: GuildRankItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new GuildRankItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.update((i + 1), guildRanklist.m_stGuildMoneyRank.m_stRankList[i]);
        }
        UIUtils.setButtonClickAble(this.btnGet, G.DataMgr.guildData.m_ucMoneyRankGet == Macros.GOD_LOAD_AWARD_WAIT_GET);
        let guildInfo = G.DataMgr.guildData.guildAbstract;
        this.myGuildInfo = {} as Protocol.DBWorldGuildMoneyOne;
        this.myGuildInfo.m_szGuildName = guildInfo.m_szGuildName;
        this.myGuildInfo.m_szLeaderName = guildInfo.m_stLeaderList.m_astGuildMemberInfo[0].m_stBaseProfile.m_szNickName;
        this.myGuildInfo.m_iAccMoney = guildInfo.m_uiAccGuildMoney;

        let rankIndex = -1;
        for (let i = 0; i < guildRanklist.m_stGuildMoneyRank.m_iRankCount; i++) {
            if (guildRanklist.m_stGuildMoneyRank.m_stRankList[i].m_uiGuildID == guildInfo.m_uiGuildID) {
                rankIndex = (i + 1);
                break;
            }
        }
        //根新个人宗门
        this.myGuildRank.update(rankIndex, this.myGuildInfo);

        //称号战力
        let titleConfig = G.DataMgr.titleData.getDataConfig(this.titleID)
        if (titleConfig == null) {
            uts.assert(true, "@jackson:请检查宗门称号称号是否存在" + this.titleID);
            return;
        }
        let m_allProps = titleConfig.m_stPropAtt;
        let fight = (FightingStrengthUtil.calStrength(m_allProps)).toString();
        this.txtFight.text = "第一宗门宗主独享称号，提升战力：" + TextFieldUtil.getColorText(fight, "fff000");
    }
}