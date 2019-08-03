import { EnumGuide } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { IGuideExecutor } from "System/guide/IGuideExecutor";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { ElemFinder } from "System/uilib/UiUtility";
import { MathUtil } from "System/utils/MathUtil";
import { UIUtils } from "System/utils/UIUtils";
import { MainView } from "System/main/view/MainView";

export class DailyRechargeView extends CommonForm implements IGuideExecutor {
    private _config: GameConfig.KFSCLBCfgM;
    private BT_Recharge: UnityEngine.GameObject;
    private BT_Get: UnityEngine.GameObject;
    private rewardList: List;
    private rechargeBar: UnityEngine.RectTransform;
    private currentRecharge: UnityEngine.UI.Text;
    private tabGroup: UnityEngine.UI.ActiveToggleGroup;
    private max_arrowCount: number = 4;
    private arrowObjs: UnityEngine.GameObject[] = [];

    private openIdx = -1;


    constructor() {
        super(KeyWord.ACT_FUNCTION_DAYRECHARGE);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.DailyRechargeView;
    }

    protected initElements() {
        this.rewardList = this.elems.getUIList("rewardList");
        this.BT_Recharge = this.elems.getElement("BT_Recharge");
        this.BT_Get = this.elems.getElement("BT_Get");
        this.currentRecharge = this.elems.getText("currentRecharge");
        this.tabGroup = this.elems.getToggleGroup("tabGroup");
        this.rechargeBar = this.elems.getRectTransform("bar");
        for (let i = 0; i < this.max_arrowCount; i++) {
            let arrow = this.rechargeBar.parent.transform.Find("rewardSelected" + i.toString()).gameObject;
            arrow.SetActive(false);
            this.arrowObjs.push(arrow);
        }
    }

    protected initListeners() {
        this.addClickListener(this.BT_Get, this._onBtnGet);
        this.addClickListener(this.BT_Recharge, this._onBtnRecharge);
        this.addClickListener(this.elems.getElement("mask"), this.close);
        this.addClickListener(this.elems.getElement("BT_Close"), this.close);
        this.addToggleGroupListener(this.tabGroup, this.updateView);
    }

    open(openIdx = -1) {
        this.openIdx = openIdx;
        super.open();
    }

    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        //首充礼包请求
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSCGetInfoRequest());
        G.GuideMgr.processGuideNext(EnumGuide.DailyRechargeReach, EnumGuide.DailyRechargeReach_OpenShouChong);
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
        G.GuideMgr.processGuideNext(EnumGuide.DailyRechargeReach, EnumGuide.GuideCommon_None);
    }

    updateState() {
        let scValue = G.DataMgr.firstRechargeData.scValue;
        if (scValue == null) {
            return;
        }
        let autoIdx = 0;
        if (this.openIdx >= 0) {
            autoIdx = this.openIdx;
        } else {
            let currentLevel: number = G.DataMgr.firstRechargeData.getCurrentLevel(scValue.m_ucType, scValue.m_ucDay);
            autoIdx = currentLevel - 1;
        }
        if (this.tabGroup.Selected != autoIdx) {
            this.tabGroup.Selected = autoIdx;
        }
        this.updateView();
    }


    /**设置 金色的菱形 */
    private setTabGroupRewardSelected() {
        let scValue = G.DataMgr.firstRechargeData.scValue;

        for (let i = 0; i < this.max_arrowCount; i++) {
            let cfg = G.DataMgr.firstRechargeData.getSclbConfByTDL(KeyWord.GIFT_TYPE_SC, scValue.m_ucType, scValue.m_ucDay, i + 1);
            let isCanGet: boolean = false;
            if (cfg != null)
                isCanGet = scValue.m_uiSCValue >= cfg.m_uiRechargeLimit;
            this.arrowObjs[i].SetActive(isCanGet);
        }
    }



    private updateView(): void {
        //刷新数据
        let scValue = G.DataMgr.firstRechargeData.scValue;
        let currentLevel = this.tabGroup.Selected + 1;
        let getReward = false;
        //刷新分页状态
        let sclbConfArr = G.DataMgr.firstRechargeData.getSclbConfArrByTDL(KeyWord.GIFT_TYPE_SC, scValue.m_ucType, scValue.m_ucDay);
        for (let i = 0; i < this.max_arrowCount; i++) {
            let data = sclbConfArr[i];
            let isReach: boolean = MathUtil.checkPosIsReach(i, scValue.m_ucGetBitMap);
            let item = this.tabGroup.GetToggle(i);
            let gameObject = item.gameObject;
            UIUtils.setButtonClickAble(gameObject, !isReach);
            let normalText = ElemFinder.findText(gameObject, "normal/Text");
            let selectedText = ElemFinder.findText(gameObject, "selected/Text");
            if (data==null) {
                return;
            }
            let charge = data.m_uiRechargeLimit.toString();
            if (charge == "1") {
                charge = "任意";
            }
            normalText.text = charge;
            selectedText.text = charge;
            if (i == this.tabGroup.Selected) {
                getReward = isReach;
            }
        }
        this._config = G.DataMgr.firstRechargeData.getSclbConfByTDL(KeyWord.GIFT_TYPE_SC, scValue.m_ucType, scValue.m_ucDay, currentLevel);
        let smallRate: number = 0;
        let currentCompeleteLevel: number = G.DataMgr.firstRechargeData.getCurrentCompeleteLevel(scValue.m_ucType, scValue.m_ucDay);
        /**已完成的下一档次的配置表*/
        let nextConfig: GameConfig.KFSCLBCfgM = G.DataMgr.firstRechargeData.getSclbConfByTDL(KeyWord.GIFT_TYPE_SC, scValue.m_ucType, scValue.m_ucDay, currentCompeleteLevel + 1);
        if (nextConfig != null) {
            /**完成的上一档次的配置表*/
            let lastConfig: GameConfig.KFSCLBCfgM = G.DataMgr.firstRechargeData.getSclbConfByTDL(KeyWord.GIFT_TYPE_SC, scValue.m_ucType, scValue.m_ucDay, currentCompeleteLevel);
            if (lastConfig != null) {
                let total = scValue.m_uiSCValue - lastConfig.m_uiRechargeLimit;
                smallRate = total / (nextConfig.m_uiRechargeLimit - lastConfig.m_uiRechargeLimit);
            }
            else {
                smallRate = scValue.m_uiSCValue / nextConfig.m_uiRechargeLimit;
            }
            smallRate = smallRate > 1 ? 1 : smallRate;
        }
        currentCompeleteLevel = currentCompeleteLevel + smallRate;
        let maxLevel: number = G.DataMgr.firstRechargeData.getMaxLevel(KeyWord.GIFT_TYPE_SC, scValue.m_ucType, scValue.m_ucDay);
        Game.Tools.SetLocalScale(this.rechargeBar, currentCompeleteLevel / maxLevel, 1, 1);
        this.currentRecharge.text = uts.format('当前充值金额：{0}', scValue.m_uiSCValue);
        let dropThingLists = this._config.m_stItemList;
        let length = dropThingLists.length;
        this.rewardList.Count = length;
        for (let j = 0; j < length; j++) {
            let rewardData = dropThingLists[j];
            let rewardItem = this.rewardList.GetItem(j);
            let iconItem = rewardItem.data.iconItem as IconItem;
            if (!iconItem) {
                iconItem = new IconItem();
                rewardItem.data.iconItem = iconItem;
                iconItem.setUsuallyIcon(rewardItem.gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateById(rewardData.m_iID, rewardData.m_iCount);
            iconItem.updateIcon();
        }
        if (getReward) {
            this.BT_Get.SetActive(false);
            this.BT_Recharge.SetActive(false);
        }
        else {
            let isCanGet: boolean = scValue.m_uiSCValue >= this._config.m_uiRechargeLimit;
            this.BT_Get.SetActive(isCanGet);
            this.BT_Recharge.SetActive(!isCanGet);
        }
        this.setTabGroupRewardSelected();
    }

    /**领取奖励*/
    private _onBtnGet(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSCGetRewardRequest(this._config.m_ucLevel));
    }

    /**充值*/
    private _onBtnRecharge(): void {
        G.ActionHandler.go2Pay();
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        return false;
    }
}