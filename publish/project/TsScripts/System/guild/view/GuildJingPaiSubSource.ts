import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { List } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { PayView } from 'System/pay/PayView'
import { EnumGuildJingPaiSubTab } from 'System/guild/view/GuildJingPaiPanel'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { TipFrom } from 'System/tip/view/TipsView'
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { IconItem } from 'System/uilib/IconItem'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from "System/utils/DataFormatter"


class GuildJingPaiSourceItem {

    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;

    private txtName: UnityEngine.UI.Text;
    private txtRank: UnityEngine.UI.Text;
    private txtStartDay: UnityEngine.UI.Text;
    private txtStartTime: UnityEngine.UI.Text;
    private txtEndDay: UnityEngine.UI.Text;
    private txtEndTime: UnityEngine.UI.Text;
    private btnWatchInfo: UnityEngine.GameObject;


    private headImg: UnityEngine.UI.Image;
    private rewardList: List;
    private iconItems: IconItem[] = [];
    private headAtals: Game.UGUIAltas;
    private curData: GameConfig.GuildPaiMaiCfgM = null;
    onClickInfoCloseCall: () => void;
    private readonly ATALS_NAME_PREFIX = "auction_icon_";

    setcomponents(go: UnityEngine.GameObject, headAtals: Game.UGUIAltas) {
        this.headAtals = headAtals;

        this.bg1 = ElemFinder.findObject(go, "bg1");
        this.bg2 = ElemFinder.findObject(go, "bg2");

        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtRank = ElemFinder.findText(go, "txtRank");
        this.txtStartDay = ElemFinder.findText(go, "txtStartDay");
        this.txtStartTime = ElemFinder.findText(go, "txtStartTime");
        this.txtEndDay = ElemFinder.findText(go, "txtEndDay");
        this.txtEndTime = ElemFinder.findText(go, "txtEndTime");
        this.btnWatchInfo = ElemFinder.findObject(go, "btnInfo");

        this.headImg = ElemFinder.findImage(go, "headImg");
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "rewardList"));

        Game.UIClickListener.Get(this.btnWatchInfo).onClick = delegate(this, this.onClickWatchInfo);
    }

    update(index: number, data: GameConfig.GuildPaiMaiCfgM) {
        this.bg1.SetActive(index % 2 == 0);
        this.bg2.SetActive(index % 2 == 1);
        this.curData = data;

        this.rewardList.Count = data.m_stItemList.length;
        for (let i = 0; i < this.rewardList.Count; i++) {
            if (this.iconItems[i] == null) {
                let item = this.rewardList.GetItem(i).gameObject;
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setUsuallyIcon(item);
                this.iconItems[i].setTipFrom(TipFrom.normal);
            }
            this.iconItems[i].updateById(data.m_stItemList[i].m_iID);
            this.iconItems[i].updateIcon();
        }

        let activityConfg = G.DataMgr.activityData.getActivityConfig(data.m_iActID);
        this.txtName.text = activityConfg.m_szName;
        this.txtRank.text = uts.format("第{0}名", data.m_iRank);
        let actHomeConfg = G.DataMgr.activityData.getActHomeCfg(data.m_iActID);
        this.txtStartTime.text = actHomeConfg.m_szTime;

        let timeLimitConfig = G.DataMgr.activityData.getTimeLimitConfigByID(activityConfg.m_iTimeLimitID);

        this.txtStartDay.text = "每周" + timeLimitConfig.m_szOpenWeekDay.toString();

        let str = this.ATALS_NAME_PREFIX + data.m_iActID.toString();
        this.headImg.sprite = this.headAtals.Get(str);
    }


    private onClickWatchInfo() {
        if (G.ActionHandler.executeFunction(this.curData.m_iFunID)) {
            if (this.onClickInfoCloseCall) this.onClickInfoCloseCall();
        }
    }
}


export class GuildJingPaiSubSource extends TabSubForm {

    private readonly WeekDayCount = 7;
    /**4周后循环*/
    private readonly LunXunMaxWeek = 4;

    private readonly FirstWeek: number = 1;

    protected list: List;
    protected btnRule: UnityEngine.GameObject;
    private btnGoto: UnityEngine.GameObject;

    protected guildJingPaiSourceItems: GuildJingPaiSourceItem[] = [];
    private week: number = 0;
    private sortConfigs: GameConfig.GuildPaiMaiCfgM[];
    private curSelectConfig: GameConfig.GuildPaiMaiCfgM;
    private headAtals: Game.UGUIAltas;

    constructor() {
        super(EnumGuildJingPaiSubTab.source);
    }

    protected resPath(): string {
        return UIPathData.GuildJingPaiSubSource;
    }

    protected initElements() {
        this.list = this.elems.getUIList("list");
        this.btnRule = this.elems.getElement("btnRule");
        this.btnGoto = this.elems.getElement("btnGoto");
        let week = Math.ceil(G.SyncTime.getDateAfterStartServer() / this.WeekDayCount);
        this.week = week > this.LunXunMaxWeek ? 0 : week;

        this.headAtals = this.elems.getElement("headAtals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
    }

    protected initListeners() {
        this.addClickListener(this.btnRule, this.onClickRule);
        this.addClickListener(this.btnGoto, this.onClickGoTo);

        this.addListClickListener(this.list, this.onClickListItem);
    }

    protected onOpen() {

        UIUtils.setButtonClickAble(this.btnGoto, false);

        this.updatePanel();
    }

    protected onClose() {

    }



    private sortGuildPaiMaiCfg(a: GameConfig.GuildPaiMaiCfgM, b: GameConfig.GuildPaiMaiCfgM): number {
        if (a.m_iActID != b.m_iActID) {
            return a.m_iActID - b.m_iActID;
        } else {
            return a.m_iRank - b.m_iRank;
        }
    }


    updatePanel(): void {

        //宗门争霸前7天，跨服宗门8天后
        let week = Math.ceil(G.SyncTime.getDateAfterStartServer() / this.WeekDayCount);
        let configs = G.DataMgr.guildData.getGuildPaiMaiSourceCfg(this.week);
        for (let i = configs.length - 1; i >= 0; i--) {
            if (week == this.FirstWeek && configs[i].m_iFunID == KeyWord.OTHER_FUNC_KFZMZ ||
                week > this.FirstWeek && configs[i].m_iFunID == KeyWord.OTHER_FUNCTION_ZPQYH
            ) {
                configs.splice(i, 1);
            }
        }

        this.sortConfigs = configs.sort(this.sortGuildPaiMaiCfg)
        this.list.Count = configs.length;
        for (let i = 0; i < this.list.Count; i++) {
            if (this.guildJingPaiSourceItems[i] == null) {
                let item = this.list.GetItem(i).gameObject;
                this.guildJingPaiSourceItems[i] = new GuildJingPaiSourceItem();
                this.guildJingPaiSourceItems[i].setcomponents(item, this.headAtals);
            }
            this.guildJingPaiSourceItems[i].update(i, configs[i]);
            this.guildJingPaiSourceItems[i].onClickInfoCloseCall = delegate(this, this.close)
        }
    }


    private onClickListItem(index: number) {
        this.curSelectConfig = this.sortConfigs[index];
        UIUtils.setButtonClickAble(this.btnGoto, true);
    }


    private onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(415), '玩法说明');
    }


    private onClickGoTo() {
        if (G.ActionHandler.executeFunction(this.curSelectConfig.m_iFunID)) {
            this.close();
        }
    }

}