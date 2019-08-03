import { Global as G } from 'System/global'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { DropPlanData } from 'System/data/DropPlanData'
import { EnumXXDDRule } from 'System/constants/GameEnum'
import { ThingData } from 'System/data/thing/ThingData'
import { XxddData } from 'System/data/XxddData'
import { Macros } from 'System/protocol/Macros'
import { NetModule } from 'System/net/NetModule'
import { XXDDRecordItemData } from 'System/data/XXDDRecordItemData'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { KeyWord } from 'System/constants/KeyWord'
import { TabSubForm } from 'System/uilib/TabForm'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { List, ListItem } from 'System/uilib/List'
import { UIPathData } from "System/data/UIPathData"
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { IconItem } from 'System/uilib/IconItem'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'


class XXDDRecordItem {

    private txtRecord: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        this.txtRecord = ElemFinder.findText(go, "txtRecord");
    }

    update(vo: XXDDRecordItemData) {
        var langId: number = this.getlangId(vo.recordType);
        var roleName: string = TextFieldUtil.getColorText(vo.roleName, Color.GREEN);
        var thingConfig: GameConfig.ThingConfigM = vo.thingConfig;
        if (thingConfig) {
            var thingName: string = TextFieldUtil.getColorText(thingConfig.m_szName, Color.getColorById(thingConfig.m_ucColor));
            let strbase = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(langId), Color.WHITE);
            let str = uts.format(strbase, roleName, thingName, vo.iconItemData.number);
            this.txtRecord.text = str;
        }
    }

    private getlangId(recordType: number): number {
        let langId: number;
        switch (recordType) {
            case EnumXXDDRule.RECORD_ALL_TYPE:
                langId = 230;
                break;
            case EnumXXDDRule.RECORD_SELF_TYPE:
                langId = 231;
                break;
            default:
        }
        return langId;
    }

}

class XXDDLightItem {
    private bg: UnityEngine.GameObject;
    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;

    private index: number = 0;
    private oneCost: number = 0;
    private curObj: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.curObj = go;
        this.bg = ElemFinder.findObject(go, "bg");
        this.bg1 = ElemFinder.findObject(go, "bg/bg1");
        this.bg2 = ElemFinder.findObject(go, "bg/bg2");

        Game.UIClickListener.Get(go).onClick = delegate(this, this.onClickQifu);
    }

    update(lightInfo: Protocol.NewDLListInfo, index: number) {
        this.index = index;
        let lightType = lightInfo.m_iType;
        this.bg1.SetActive(lightType == 1);
        this.bg2.SetActive(lightType == 2);

        let grey = !lightInfo.m_ucState;
        UIUtils.setGrey(this.bg, !grey);
    }

    private onClickQifu() {
        let freeCount: number = 0;
        let xxddInfo = G.DataMgr.activityData.xxdd.xxddInfo;
        if (xxddInfo) {
            freeCount = xxddInfo.m_ucFreeTimes;
        }

        if (freeCount <= 0) {
            if (0 != G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.oneCost, true)) {
                return;
            }
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_DDL, Macros.DDL_ACT_LIGHT, this.index + 1));
    }

}

/**
 *星星点灯/点灯祈福
 *
 */
export class XXDDLightPanel extends TabSubForm {

    private _listLightData: Protocol.NewDLListInfo[] = [];
    /**单次价格*/
    private oneCost: number = 0;
    /**全部点亮折扣*/
    private allRate: number = 0;
    /**刷新价格*/
    private refreshCost: number = 0;
    /**最大免费次数*/
    private maxFreeCount: number = 0;
    /**可点亮灯笼数量*/
    private _canLightCount: number = 0;
    private _allLigtCost: number = 0;
    private _timeNum: number = 0;
    private _isNoTipRefresh: boolean = false;
    private _isNoTipAllLight: boolean = false;

    private _listMyselfVec: XXDDRecordItemData[] = [];
    private _listAllVec: XXDDRecordItemData[] = [];
    private _isRemoveTimeRequest: boolean = false;


    private rewardList: List;
    private lightList: List;
    private recordList: List;
    private myRecordList: List;
    private reachRewardList: List;

    private txtCurLeftCount: UnityEngine.UI.Text;
    private txtOnlineTime: UnityEngine.UI.Text;
    private txtActivityTime: UnityEngine.UI.Text;
    private txtRule: UnityEngine.UI.Text;
    private txtResetCost: UnityEngine.UI.Text;
    private txtAllCost: UnityEngine.UI.Text;
    private txtQifuState: UnityEngine.UI.Text;
    private txtBtnState: UnityEngine.UI.Text;

    private btnReset: UnityEngine.GameObject;
    private btnAll: UnityEngine.GameObject;
    private btnAch: UnityEngine.GameObject;
    private btnRule: UnityEngine.GameObject;

    private itemIcon_Normal: UnityEngine.GameObject;

    private rewardIcons: IconItem[] = [];
    private reachRewardIcons: IconItem[] = [];
    private lightItems: XXDDLightItem[] = [];

    private myRecordItems: XXDDRecordItem[] = [];
    private allRecordItems: XXDDRecordItem[] = [];

    private timeCheck: boolean = false;

    private leftCount: number = -1;

    constructor() {
        super(EnumXXDDRule.LIGHT_TAB);
    }

    protected resPath(): string {
        return UIPathData.XXDDLightPanel;
    }
    protected onClose() {

    }

    protected initElements(): void {

        this.rewardList = this.elems.getUIList("rewardList");
        this.lightList = this.elems.getUIList("lightList");
        this.recordList = this.elems.getUIList("recordList");
        this.myRecordList = this.elems.getUIList("myRecordList");
        this.reachRewardList = this.elems.getUIList("reachRewardList");

        this.txtCurLeftCount = this.elems.getText("txtCurLeftCount");
        this.txtOnlineTime = this.elems.getText("txtOnlineTime");
        this.txtActivityTime = this.elems.getText("txtActivityTime");
        this.txtRule = this.elems.getText("txtRule");
        this.txtResetCost = this.elems.getText("txtResetCost");
        this.txtAllCost = this.elems.getText("txtAllCost");
        this.txtQifuState = this.elems.getText("txtQifuState");
        this.txtBtnState = this.elems.getText("txtBtnState");

        this.btnReset = this.elems.getElement("btnReset");
        this.btnAll = this.elems.getElement("btnAll");
        this.btnAch = this.elems.getElement("btnAch");
        this.btnRule = this.elems.getElement("btnRule");

        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");

        this.initUI();
    }

    protected initListeners(): void {
        this.addClickListener(this.btnReset, this.onBtnRefresh);
        this.addClickListener(this.btnAll, this.onBtnAllLight);
        this.addClickListener(this.btnAch, this.onBtnAch);
        this.addClickListener(this.btnRule, this.onBtnRule);
    }

    protected onOpen() {
        this.requestPanel();
        this.addTimer("online", 1000, 0, this.onTimer);

    }

    private onBtnRule() {
        let str = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(229), Color.DEFAULT_WHITE);
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(str);
    }

    /**
     * 请求界面，拉数据
     */
    private requestPanel(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_DDL, Macros.DDL_ACT_PANEL));
    }

    private initUI(): void {

        this.oneCost = (G.DataMgr.constData.getValueById(KeyWord.PARAM_DDL_ONE_PRICE));
        this.allRate = (G.DataMgr.constData.getValueById(KeyWord.PARAM_DDL_ALL_PRICE)) / 100;
        this.maxFreeCount = (G.DataMgr.constData.getValueById(KeyWord.PARAM_DDL_FREE_TIMES));
        this.refreshCost = (G.DataMgr.constData.getValueById(KeyWord.PARAM_DDL_FRESH_PRICE));

        this.txtRule.text = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(229), Color.DEFAULT_WHITE);
        this.txtResetCost.text = TextFieldUtil.getColorText(uts.format('消耗：{0}钻石', this.refreshCost), Color.DEFAULT_WHITE);

    }

    updateReachRewardInfo(data: Protocol.DDLOpenRankPanelRsp) {
        let rankData: Protocol.DDLOpenRankPanelRsp = this.xxddData.xxddRankInfo;
        if (rankData == null) {
            return;
        }

        if (data != null) {
            //祈福成就奖励
            let cfg = data.m_stCfgList[data.m_stCfgList.length - 1];
            let cnt = cfg.m_iItemCount;
            this.reachRewardList.Count = cnt;
            for (let i = 0; i < cnt; i++) {
                let icon = ElemFinder.findObject(this.reachRewardList.GetItem(i).gameObject, "icon");
                if (this.reachRewardIcons[i] == null) {
                    this.reachRewardIcons[i] = new IconItem();
                    this.reachRewardIcons[i].setUsualIconByPrefab(this.itemIcon_Normal, icon);
                    this.reachRewardIcons[i].setTipFrom(TipFrom.normal);
                }
                this.reachRewardIcons[i].updateById(cfg.m_stItemList[i].m_iID, cfg.m_stItemList[i].m_iCount);
                this.reachRewardIcons[i].updateIcon();
            }

            let joinCfg = data.m_stCfgList[data.m_stCfgList.length - 1];

            let leftJoinCount: number = joinCfg.m_iCondition3 - rankData.m_usTotalTimes;
            this.leftCount = leftJoinCount;
            if (leftJoinCount > 0) {
                this.txtQifuState.text = TextFieldUtil.getColorText(uts.format('再祈福{0}次即可达成', leftJoinCount), Color.WHITE);
            }
            else {
                this.txtQifuState.text = TextFieldUtil.getColorText(uts.format('已达成'), Color.PURE_YELLOW);
            }


        }

        let canClick = this.leftCount <= 0 && !rankData.m_ucState;
        UIUtils.setButtonClickAble(this.btnAch, canClick);

        if (this.leftCount > 0) {
            this.txtBtnState.text = '未达成';
        }
        else {
            if (rankData.m_ucState) {
                this.txtBtnState.text = '已领取';
            }
            else {
                this.txtBtnState.text = '领取奖励';
            }
        }

    }


    updateView(data: Protocol.DDLOpenPanelRsp): void {
        //每次开启一个就要拉去一次排行，要不剩余多少次数，不刷新
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_DDL, Macros.DDL_ACT_RANK_PANEL));
        //只有打开data不为空
        if (data != null) {
            //奖励物品显示
            this.rewardList.Count = data.m_ucItemCount;
            for (let i = 0; i < this.rewardList.Count; i++) {
                let icon = ElemFinder.findObject(this.rewardList.GetItem(i).gameObject, "icon");
                if (this.rewardIcons[i] == null) {
                    this.rewardIcons[i] = new IconItem();
                    this.rewardIcons[i].setUsualIconByPrefab(this.itemIcon_Normal, icon);
                    this.rewardIcons[i].setTipFrom(TipFrom.normal);
                }
                this.rewardIcons[i].updateById(data.m_stItemList[i].iItemID, data.m_stItemList[i].iItemNum);
                this.rewardIcons[i].updateIcon();
            }
        }

        this.updateLightList();
        this.updateAllList();
        this.updateMyList();
        let xxddInfo: Protocol.DDLOpenPanelRsp = this.xxddData.xxddInfo;
        if (xxddInfo) {
            this._allLigtCost = Math.floor(this._canLightCount * this.allRate * this.oneCost);
            this.txtAllCost.text = TextFieldUtil.getColorText(uts.format('消耗：{0}钻石', this._allLigtCost), Color.DEFAULT_WHITE);

            this.txtCurLeftCount.text = TextFieldUtil.getColorText(uts.format('当前免费次数：{0}', TextFieldUtil.getColorText(uts.format('{0}次', xxddInfo.m_ucFreeTimes), Color.GREEN)), Color.DEFAULT_WHITE);

            let current: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            this._timeNum = xxddInfo.m_uiEndTime - current;

            let activityStatus: Protocol.ActivityStatus = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_CROSS_DDL);

            let beginData: string = DataFormatter.second2yyyymmdd(activityStatus.m_iStartTime);
            let endData: string = DataFormatter.second2yyyymmdd(activityStatus.m_iEndTime);
            this.txtActivityTime.text = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(235, beginData, endData), Color.DEFAULT_WHITE);
            let maxCount = Math.floor(G.DataMgr.constData.getValueById(KeyWord.PARAM_DDL_FREE_TIMES));

            if (xxddInfo.m_ucNums < Math.floor(G.DataMgr.constData.getValueById(KeyWord.PARAM_DDL_FREE_TIMES))) {
                this._isRemoveTimeRequest = true;
            }

            if (this._timeNum > 0) {
                this.timeCheck = true;
            }
        }
    }

    private updateMyList(): void {
        this._listMyselfVec.length = 0;
        let xxddMyRecord: Protocol.DDLRecord[] = this.xxddData.xxddMyRecord;
        let len: number = xxddMyRecord.length;
        let thingConfig: GameConfig.ThingConfigM;
        for (let i: number = 0; i < len; i++) {
            let record: Protocol.DDLRecord = xxddMyRecord[i];

            thingConfig = ThingData.getThingConfig(record.m_iThingID);
            if (thingConfig) {
                let itemVo: XXDDRecordItemData = new XXDDRecordItemData();
                itemVo.roleName = record.m_szNickName;
                itemVo.iconItemData.id = record.m_iThingID;
                itemVo.iconItemData.number = record.m_iThingNumber;
                itemVo.recordType = EnumXXDDRule.RECORD_SELF_TYPE;
                itemVo.thingConfig = thingConfig;

                this._listMyselfVec.push(itemVo);
            }
        }
        this._listMyselfVec.reverse();

        //显示我的列表
        this.myRecordList.Count = this._listMyselfVec.length;
        for (let i = 0; i < this.myRecordList.Count; i++) {
            let item = this.myRecordList.GetItem(i).gameObject
            if (this.myRecordItems[i] == null) {
                this.myRecordItems[i] = new XXDDRecordItem();
                this.myRecordItems[i].setComponents(item);
            }
            this.myRecordItems[i].update(this._listMyselfVec[i]);
        }
    }

    private updateAllList(): void {
        this._listAllVec.length = 0;
        let xxddInfo: Protocol.DDLOpenPanelRsp = this.xxddData.xxddInfo;
        if (xxddInfo) {
            let thingConfig: GameConfig.ThingConfigM;
            let xxddMyRecord: Protocol.DDLRecord[] = xxddInfo.m_astRecordList;
            let len: number = xxddMyRecord.length;
            for (let i: number = 0; i < len; i++) {
                let record: Protocol.DDLRecord = xxddMyRecord[i];
                thingConfig = ThingData.getThingConfig(record.m_iThingID);
                if (thingConfig) {
                    let itemVo: XXDDRecordItemData = new XXDDRecordItemData();
                    itemVo.roleName = record.m_szNickName;
                    itemVo.iconItemData.id = record.m_iThingID;
                    itemVo.iconItemData.number = record.m_iThingNumber;
                    itemVo.recordType = EnumXXDDRule.RECORD_ALL_TYPE;
                    itemVo.thingConfig = thingConfig;
                    this._listAllVec.push(itemVo);
                }
            }
        }
        //显示所有的列表
        this.recordList.Count = this._listAllVec.length;
        for (let i = 0; i < this.recordList.Count; i++) {
            let item = this.recordList.GetItem(i).gameObject
            if (this.allRecordItems[i] == null) {
                this.allRecordItems[i] = new XXDDRecordItem();
                this.allRecordItems[i].setComponents(item);
            }
            this.allRecordItems[i].update(this._listAllVec[i]);
        }

    }

    private onTimer(): void {
        if (this.timeCheck) {
            this._timeNum--;
            if (this._timeNum > 0) {
                this.txtOnlineTime.text = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(233, DataFormatter.second2DayDoubleShort(this._timeNum)), Color.DEFAULT_WHITE);
            } else {
                this.timeCheck = false;
            }
        } else {
            this.stopTimer();
        }
    }

    private stopTimer(): void {
        if (this._isRemoveTimeRequest) {
            this._isRemoveTimeRequest = false;
            this.txtOnlineTime.text = '';
            this.requestPanel();
        }
        else {
            this.txtOnlineTime.text = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(234), Color.DEFAULT_WHITE);
        }
    }

    /**更新点亮列表*/
    private updateLightList(): void {
        let xxddInfo: Protocol.DDLOpenPanelRsp = this.xxddData.xxddInfo;
        this._listLightData.length = 0;
        this._canLightCount = 0;
        if (xxddInfo) {
            let m_stDLListInfo: Protocol.NewDLListInfo[] = xxddInfo.m_stDLListInfo;
            if (m_stDLListInfo == null) {
                this.requestPanel();
                return;
            }
            let len: number = m_stDLListInfo.length;
            for (let i: number = 0; i < len; i++) {
                let lightInfo: Protocol.NewDLListInfo = m_stDLListInfo[i];
                if (!lightInfo.m_ucState) {
                    this._canLightCount++;
                }
                this._listLightData.push(lightInfo);
            }
        }
        this.lightList.Count = this._listLightData.length;
        for (let i = 0; i < this.lightList.Count; i++) {
            let item = this.lightList.GetItem(i);
            if (this.lightItems[i] == null) {
                this.lightItems[i] = new XXDDLightItem();
                this.lightItems[i].setComponents(item.gameObject);
            }
            this.lightItems[i].update(this._listLightData[i], i);
        }

    }


    /**全部点亮*/
    private onBtnAllLight(): void {
        if (this._allLigtCost <= 0) {
            G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(238));
            return;
        }
        if (!this._isNoTipAllLight) {
            G.TipMgr.showConfirm(G.DataMgr.langData.getLang(237, this._allLigtCost), ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onConfirmAllLight));
        }
        else {
            this.requestAllLight();
        }
    }

    private onConfirmAllLight(state: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == state) {
            this._isNoTipAllLight = isCheckSelected;
            this.requestAllLight();
        }
    }

    /**请求全部点亮*/
    private requestAllLight(): void {
        if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this._allLigtCost, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_DDL, Macros.DDL_ACT_LIGHT));
        }
    }

    /**刷新*/
    private onBtnRefresh(): void {
        if (!this._isNoTipRefresh) {
            G.TipMgr.showConfirm(G.DataMgr.langData.getLang(236, this.refreshCost), ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onConfirmRefresh));
        }
        else {
            this.requestRefresh();
        }
    }

    private onConfirmRefresh(state: number = 0, isCheckSelected: boolean = true): void {
        if (MessageBoxConst.yes == state) {
            this._isNoTipRefresh = isCheckSelected;

            this.requestRefresh();
        }
    }

    /**请求刷新*/
    private requestRefresh(): void {
        if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.refreshCost, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_DDL, Macros.DDL_ACT_FRESH));
        }
    }

    /**更新展示奖励列表*/
    private updateRewardList(): void {
        // this._listReward.refreshModel();
    }

    onServerOverDay(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_DDL, Macros.DDL_ACT_PANEL));
    }

    /**达成奖励*/
    private onBtnAch(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_DDL, Macros.DDL_ACT_GET_REWARD));
    }

    private get xxddData(): XxddData {
        return G.DataMgr.activityData.xxdd;
    }
}
