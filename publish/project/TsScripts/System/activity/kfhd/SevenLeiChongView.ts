import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { ActivityRuleView } from "System/diandeng/ActivityRuleView";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { ListItemCtrl } from "System/uilib/ListItemCtrl";
import { TabSubForm } from "System/uilib/TabForm";
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { MathUtil } from "System/utils/MathUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";
import { KaifuActivityData } from 'System/data/KaifuActivityData'
import { KaiFuHuoDongView } from "System/activity/kaifuhuodong/KaiFuHuoDongView";
class SevenLeiChongItem extends ListItemCtrl {
    private txtNum: UnityEngine.UI.Text;
    private txtGetLabel: UnityEngine.UI.Text;
    private btnGet: UnityEngine.GameObject;
    private btnGo: UnityEngine.GameObject;
    private rewardList: List;
    private icons: IconItem[] = [];
    private curId: number = 0;
    private kaifuhuodongView: KaiFuHuoDongView;
    setComponents(go: UnityEngine.GameObject) {
        this.txtNum = ElemFinder.findText(go, 'txtNum');
        this.txtGetLabel = ElemFinder.findText(go, 'btnGet/Text');
        this.btnGet = ElemFinder.findObject(go, 'btnGet');
        this.btnGo = ElemFinder.findObject(go, 'btnGo');
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, 'reward/rewardList'));
        this.kaifuhuodongView = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickGet);
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickGo);
    }

    update(info: Protocol.CS7DayLJCZOne) {
        this.txtNum.text = uts.format("{0}钻石", info.m_iCondition);
        this.rewardList.Count = info.m_ucItemCnt;
        this.curId = info.m_iID;
        let kf7DayData = G.DataMgr.kaifuActData.kf7DayLJCZInfo;
        let isGet: boolean = MathUtil.checkPosIsReach(info.m_iID - 1, kf7DayData.m_uiGetBitMap);
        //显示奖励物品

        let oldIconCnt = this.icons.length;
        for (let j = 0; j < this.rewardList.Count; j++) {
            let iconItem: IconItem;
            if (j < oldIconCnt) {
                iconItem = this.icons[j];
            } else {
                this.icons.push(iconItem = new IconItem());
                let rewardItem = this.rewardList.GetItem(j);
                iconItem.setUsuallyIcon(rewardItem.gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateById(info.m_stItemList[j].m_iItemID, info.m_stItemList[j].m_iItemCount);
            iconItem.updateIcon();
        }

        if (isGet) {
            this.updataBtnStatus(false, true);
        } else {
            if (kf7DayData.m_uiLJZCValue >= info.m_iCondition) {
                this.updataBtnStatus(false, false);
            } else {
                this.updataBtnStatus(true);
            }
        }

    }

    private onClickGet() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KF7DAY_LJCZ_GET, this.curId));
    }

    private onClickGo() {
        this.kaifuhuodongView.close();
        G.ActionHandler.go2Pay();
    }

    private updataBtnStatus(isGo: boolean, hasGet: boolean = true) {
        this.btnGo.SetActive(isGo);
        this.btnGet.SetActive(!isGo);
        this.txtGetLabel.text = hasGet ? "已领取" : "可领取";
        UIUtils.setButtonClickAble(this.btnGet, !hasGet);
    }

}

export class SevenLeiChongView extends TabSubForm {

    /**开放天数7天*/
    private readonly openDays: number = 7;

    private rewardList: List;

    private leftTime: UnityEngine.UI.Text;
    private rechargeCount: UnityEngine.UI.Text;

    private sevenLeiChongItems: SevenLeiChongItem[] = [];
    private m_restTime: number = 0;
    private btnRule: UnityEngine.GameObject;

    private objImg: UnityEngine.GameObject;
    private objImg1: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_7DAYLEICHONG);
    }

    protected resPath(): string {
        return UIPathData.SevenLeiChongView;
    }

    protected initElements() {
        this.rewardList = this.elems.getUIList("rewardList");
        this.leftTime = this.elems.getText("leftTime");
        this.rechargeCount = this.elems.getText("rechargeCount");
        this.btnRule = this.elems.getElement("btnRule");
        this.objImg = this.elems.getElement("objImg");
        this.objImg1 = this.elems.getElement("objImg1");

        let today = G.SyncTime.getDateAfterStartServer();

        let limitTaoZhuangConfig = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.OTHER_FUNCTION_7DAYACT_TAOZHUANG);
        let limitPetJiPanConfig = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.OTHER_FUNCTION_7DAYACT_PETJIPAN);
        if (today >= limitTaoZhuangConfig.m_ucStartDate && today <= limitTaoZhuangConfig.m_ucEndDate) {
            this.objImg.SetActive(true);
            this.objImg1.SetActive(false);
        } else if (today >= limitPetJiPanConfig.m_ucStartDate && today <= limitPetJiPanConfig.m_ucEndDate) {
            this.objImg.SetActive(false);
            this.objImg1.SetActive(true);
        } else {
            this.objImg.SetActive(false);
            this.objImg1.SetActive(true);
        }



    }

    protected initListeners() {
        this.addClickListener(this.btnRule, this.onClickBtnRule);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KF7DAY_LJCZ_OPEN));

        this.m_restTime = G.SyncTime.getServerZeroLeftTime();
        let day = G.SyncTime.getDateAfterStartServer() % this.openDays
        day = day == 0 ? this.openDays : day;
        this.m_restTime += (this.openDays - day) * 86400;
        this.addTimer("1", 1000, 0, this.onTimer);
    }

    protected onClose() {
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(367), '规则介绍');
    }

    updateView(): void {
        let kf7DayData = G.DataMgr.kaifuActData.kf7DayLJCZInfo;
        if (kf7DayData != null) {
            this.rewardList.Count = kf7DayData.m_ucNumber;

            for (let i = 0; i < this.rewardList.Count; i++) {
                let item = this.rewardList.GetItem(i);
                if (this.sevenLeiChongItems[i] == null) {
                    this.sevenLeiChongItems[i] = new SevenLeiChongItem();
                    this.sevenLeiChongItems[i].setComponents(item.gameObject);
                }
                this.sevenLeiChongItems[i].update(kf7DayData.m_stList[i]);
            }
        }
        this.rechargeCount.text = "累计充值：" + TextFieldUtil.getColorText(kf7DayData.m_uiLJZCValue + "钻石", Color.GREEN);

        let index = G.DataMgr.kaifuActData.getRewardIndex();
        this.rewardList.ScrollByAxialRow(index > 0 ? index : 0);
    }



    private onTimer(): void {
        this.m_restTime--;
        if (this.m_restTime <= 0) {
            this.leftTime.text = "活动已经结束";
            this.removeTimer("1");
        }
        else {
            this.leftTime.text = "活动剩余时间：" + TextFieldUtil.getColorText(DataFormatter.second2day(this.m_restTime), Color.GREEN);
        }
    }




}