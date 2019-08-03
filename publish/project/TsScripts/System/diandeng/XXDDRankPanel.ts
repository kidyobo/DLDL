import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { HeroData } from 'System/data/RoleData'
import { PetData } from 'System/data/pet/PetData'
import { XxddData } from 'System/data/XxddData'
import { Macros } from 'System/protocol/Macros'
import { XXDDRankItemData } from 'System/data/XXDDRankItemData'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumXXDDRule } from 'System/constants/GameEnum'
import { TabSubForm } from 'System/uilib/TabForm'
import { List, ListItem } from 'System/uilib/List'
import { UIPathData } from "System/data/UIPathData"
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { IconItem } from 'System/uilib/IconItem'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { GameIDUtil } from "System/utils/GameIDUtil"
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'

class XXDDRankItem {
    /**排名*/
    private txtNum: UnityEngine.UI.Text;
    /**名字*/
    private txtRank: UnityEngine.UI.Text;
    private data: XXDDRankItemData;

    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.txtNum = ElemFinder.findText(go, "txtNum");
        this.txtRank = ElemFinder.findText(go, "txtRank");
        this.bg1 = ElemFinder.findObject(go, "bg1");
        this.bg2 = ElemFinder.findObject(go, "bg2");
        Game.UIClickListener.Get(this.txtRank.gameObject).onClick = delegate(this, this.onClickRoleName);
    }

    update(vo: XXDDRankItemData, index: number) {
        this.data = vo;
        let color: string;
        if (vo.rankID == 0) {
            color = "FFFF00";
        }
        else if (vo.rankID == 1) {
            color = "FF6600";
        }
        else if (vo.rankID == 2) {
            color = "FF00FF";
        }
        else {
            color = "00FF00";
        }

        this.txtNum.text = (vo.rankID) + ".";
        this.txtNum.color = Color.toUnityColor(color);

        if (vo.name != null) {
            this.txtRank.text = TextFieldUtil.getColorText(vo.name, color);
        }

        this.bg1.SetActive(index % 2 == 0);
        this.bg2.SetActive(index % 2 == 1);
    }

    private onClickRoleName() {
        if (this.data && GameIDUtil.isRoidIsPeople(this.data.roleID) && !GameIDUtil.isSelf(this.data.roleID)) {
            G.ActionHandler.getProfile(this.data.roleID);
        }
    }

}

class RankRewardItem {
    private txtRankNum: UnityEngine.UI.Text;
    private list: List;
    private iconItems: IconItem[] = [];
    private prefab: UnityEngine.GameObject;
    setComponents(go: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
        this.prefab = prefab;
        this.txtRankNum = ElemFinder.findText(go, "txtRankNum");
        this.list = ElemFinder.getUIList(ElemFinder.findObject(go, "list"));
    }

    dispose() {
        this.list.dispose();
        this.prefab = null;
        this.iconItems = null;
    }

    update(cfg: Protocol.CrossDDL_Flash, rank: string) {
        this.txtRankNum.text = rank;
        this.list.Count = cfg.m_iItemCount;
        for (let i = 0; i < this.list.Count; i++) {
            let icon = ElemFinder.findObject(this.list.GetItem(i).gameObject, "icon");
            if (this.iconItems[i] == null) {
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setUsualIconByPrefab(this.prefab, icon);
                this.iconItems[i].setTipFrom(TipFrom.normal);
            }
            this.iconItems[i].updateById(cfg.m_stItemList[i].m_iID, cfg.m_stItemList[i].m_iCount);
            this.iconItems[i].updateIcon();
        }
    }
}

/**
 *跨服点灯|星星点灯 排行
 */
export class XXDDRankPanel extends TabSubForm {
    /**排行奖励种类3种*/
    private readonly rankRewardNum = 3;
    private readonly rankStr: string[] = ["第1名奖励", "第2~3名奖励", "第4~10名奖励"];
    private rankRewardItems: RankRewardItem[] = [];

    private m_rankListData: XXDDRankItemData[] = [];

    private itemIcon_Normal: UnityEngine.GameObject;

    private txtTime: UnityEngine.UI.Text;
    private txtRule: UnityEngine.UI.Text;
    private txtMyRank: UnityEngine.UI.Text;
    private txtNeedQifu: UnityEngine.UI.Text;
    private txtQifuState: UnityEngine.UI.Text;
    /**达成成就按钮状态*/
    private txtBtnState: UnityEngine.UI.Text;
    /**达成成就按钮*/
    private btnAch: UnityEngine.GameObject;
    private btnRule: UnityEngine.GameObject;

    private rankList: List;
    private rankRewardList: List;

    private timeCheck: boolean = true;
    private xxDDRankItems: XXDDRankItem[] = [];

    constructor() {
        super(EnumXXDDRule.RANK_TAB);
    }

    protected resPath(): string {
        return UIPathData.XXDDRankPanel;
    }
    protected onClose() {

    }

    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");

        this.txtTime = this.elems.getText("txtTime");
        this.txtRule = this.elems.getText("txtRule");
        this.txtMyRank = this.elems.getText("txtMyRank");
        this.txtNeedQifu = this.elems.getText("txtNeedQifu");
        this.txtQifuState = this.elems.getText("txtQifuState");
        this.txtBtnState = this.elems.getText("txtBtnState");

        this.btnAch = this.elems.getElement("btnAch");
        this.btnRule = this.elems.getElement("btnRule");

        this.rankList = this.elems.getUIList("rankList");
        this.rankRewardList = this.elems.getUIList("rankRewardList");

    }

    protected initListeners(): void {
        this.addClickListener(this.btnRule, this.onBtnRule);
    }

    protected onOpen() {

        this.txtRule.text = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(232), Color.DEFAULT_WHITE);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_DDL, Macros.DDL_ACT_RANK_PANEL));

        this.addTimer("time", 1000, 0, this.onTimer)

    }

    private onBtnRule() {
        let str = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(232), Color.DEFAULT_WHITE);
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(str);
    }


    updateXXDDRankInfo(data: Protocol.DDLOpenRankPanelRsp) {
        this.updateView(data);
    }

    private updateView(data: Protocol.DDLOpenRankPanelRsp): void {
        let rankData: Protocol.DDLOpenRankPanelRsp = this.xxddData.xxddRankInfo;
        if (rankData == null) {
            return;
        }

        //排行奖励
        this.rankRewardList.Count = data.m_iCfgCount - 1;
        for (let i = 0; i < this.rankRewardList.Count; i++) {
            let cfg = data.m_stCfgList[i];
            let item = this.rankRewardList.GetItem(i);
            if (this.rankRewardItems[i] == null) {
                this.rankRewardItems[i] = new RankRewardItem();
                this.rankRewardItems[i].setComponents(item.gameObject, this.itemIcon_Normal);
            }
            this.rankRewardItems[i].update(cfg, this.rankStr[i]);
        }


        if (Boolean(rankData.m_uiMyRank)) {
            this.txtMyRank.text = uts.format('我的今日排行:{0}', TextFieldUtil.getColorText(rankData.m_uiMyRank.toString(), Color.GREEN));
        }
        else {
            this.txtMyRank.text = uts.format('我的今日排行:{0}', TextFieldUtil.getColorText('未上榜', Color.GREEN));
        }

        let rankIndex: number = 0;
        let rankDataList: Protocol.DDLActRankInfo[] = rankData.m_stRankList;
        this.m_rankListData.length = 0;
        let upgradeCharge: number = 0;

        //第一名
        let itemCount: number = Math.min(rankData.m_ucRankCount, 10);
        for (let i: number = 0; i < itemCount; i++) {
            rankIndex = i + 1;
            let rankInfo: Protocol.DDLActRankInfo = rankDataList[i];
            if (rankIndex == 1) {
                //this._dis.tfNameNo1.htmlText = TextFieldUtil. getColorText(rankInfo.m_szName, Color.PURE_YELLOW);
            }
            let itemVo: XXDDRankItemData = new XXDDRankItemData();
            itemVo.rankID = rankIndex;
            itemVo.roleID.m_uiSeq = rankInfo.m_uiSeq;
            itemVo.roleID.m_uiUin = rankInfo.m_uiUin;
            itemVo.name = rankInfo.m_szName;
            this.m_rankListData.push(itemVo);
        }
        //  this.m_rankList.model.data = this.m_rankListData;
        //显示排行
        this.rankList.Count = this.m_rankListData.length;
        for (let i = 0; i < this.rankList.Count; i++) {
            let item = this.rankList.GetItem(i);
            if (this.xxDDRankItems[i] == null) {
                this.xxDDRankItems[i] = new XXDDRankItem();
                this.xxDDRankItems[i].setComponents(item.gameObject);
            }
            this.xxDDRankItems[i].update(this.m_rankListData[i], i);
        }


        //参与配置表
        let joinCfg = data.m_stCfgList[data.m_stCfgList.length - 1];
        //第一名
        let cfg1 = data.m_stCfgList[0];

        if (joinCfg.m_iCondition3 > rankData.m_usTotalTimes && Boolean(rankData.m_uiMyRank)) {
            upgradeCharge = joinCfg.m_iCondition3 - rankData.m_usTotalTimes;
            //this.txtNeedQifu.text = TextFieldUtil.getColorText(uts.format('再祈福：{0}次，参与排名', upgradeCharge), Color.PURE_YELLOW);
            this.txtNeedQifu.text = uts.format('再祈福：{0}次，参与排名', TextFieldUtil.getColorText(upgradeCharge.toString(), Color.ORANGE));
        }
        else if (cfg1.m_iCondition3 > rankData.m_usTotalTimes && rankData.m_uiMyRank == 1) {
            upgradeCharge = cfg1.m_iCondition3 - rankData.m_usTotalTimes;
            //this.txtNeedQifu.text = TextFieldUtil.getColorText(uts.format('再祈福：{0}次，参与第一名排名', upgradeCharge), Color.PURE_YELLOW);
            this.txtNeedQifu.text = uts.format('再祈福：{0}次，参与第一名排名', TextFieldUtil.getColorText(upgradeCharge.toString(), Color.ORANGE));
        }
        else {
            upgradeCharge = rankData.m_uiDisPre;
            //this.txtNeedQifu.text = TextFieldUtil.getColorText(uts.format('再祈福：{0}次，可提升排名', upgradeCharge), Color.PURE_YELLOW);
            this.txtNeedQifu.text = uts.format('再祈福：{0}次，可提升排名', TextFieldUtil.getColorText(upgradeCharge.toString(), Color.ORANGE));
        }

    }

    /**
     * 倒计时tick
     * @param info
     *
     */
    private onTimer(): void {
        if (this.timeCheck) {
            let activityStatus: Protocol.ActivityStatus = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_CROSS_DDL);
            if (activityStatus != null) {
                if (activityStatus.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) {
                    let leftTime: number = activityStatus.m_iEndTime - G.SyncTime.getCurrentTime() / 1000;
                    if (leftTime <= 0) {
                        this.txtTime.text = uts.format('排名结束倒计时:{0}', TextFieldUtil.getColorText('已结束', Color.GREEN));
                        this.timeCheck = false;
                    }
                    else {
                        this.txtTime.text = uts.format('排名结束倒计时:{0}', TextFieldUtil.getColorText(DataFormatter.second2day(leftTime), Color.GREEN));
                    }
                }
            }
        }
    }

    private get xxddData(): XxddData {
        return G.DataMgr.activityData.xxdd;
    }
}
