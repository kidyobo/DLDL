import { NestedSubForm } from 'System/uilib/NestedForm'
import { Global as G } from "System/global";
import { TipFrom } from 'System/tip/view/TipsView'
import { ThingItemData } from "System/data/thing/ThingItemData";
import { BatchUseView } from "System/bag/view/BatchUseView";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { Macros } from 'System/protocol/Macros';
import { ThingData } from "System/data/thing/ThingData";
import { KeyWord } from "System/constants/KeyWord";
import { Color } from "System/utils/ColorUtil";
import { IconItem } from "System/uilib/IconItem";
import { RegExpUtil } from "System/utils/RegExpUtil"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { UIPathData } from "System/data/UIPathData"
import { DataFormatter } from 'System/utils/DataFormatter'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { GuildExchangeView } from 'System/guild/view/GuildExchangeView'
import { GameIDType } from 'System/constants/GameEnum'
import { BagEquipView } from 'System/bag/view/BagEquipView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ConfirmCheck } from 'System/tip/TipManager'
import { MessageBoxConst } from 'System/tip/TipManager'
import { GuildTools } from 'System/guild/GuildTools'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { List } from 'System/uilib/List'
import { PayView } from 'System/pay/PayView'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { VipTab, VipView } from "System/vip/VipView"



export class YuanBaoFanBeiView extends CommonForm {

    private readonly OneDayTime = 24 * 3600;

    /**返利150% 200%*/
    private imgFanLi0: UnityEngine.GameObject;
    private imgFanLi1: UnityEngine.GameObject;

    /**是否激活200%的*/
    private hasActive: UnityEngine.GameObject;
    private notActive: UnityEngine.GameObject;
    private effectRoot: UnityEngine.GameObject;

    private btnGoPay: UnityEngine.GameObject;
    private btnGet: UnityEngine.GameObject;

    private txtTime: UnityEngine.UI.Text;
    private txtCur: UnityEngine.UI.Text;
    private txtNext: UnityEngine.UI.Text;
    private txtSlider: UnityEngine.UI.Text;
    private txtCurCanGet: UnityEngine.UI.Text;

    private bar: UnityEngine.GameObject;

    private leftTime: number = 0;

    constructor() {
        super(KeyWord.ACT_FUNCTION_YUANBAOFANBEI);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.YuanBaoFanBeiView;
    }
    protected initElements(): void {

        this.imgFanLi0 = this.elems.getElement("imgFanLi0");
        this.imgFanLi1 = this.elems.getElement("imgFanLi1");
        this.hasActive = this.elems.getElement("hasActive");
        this.notActive = this.elems.getElement("notActive");
        this.btnGoPay = this.elems.getElement("btnGoPay");
        this.btnGet = this.elems.getElement("btnGet");
        this.bar = this.elems.getElement("bar");
        this.effectRoot = this.elems.getElement("effectRoot");

        this.txtTime = this.elems.getText("txtTime");
        this.txtCur = this.elems.getText("txtCur");
        this.txtNext = this.elems.getText("txtNext");
        this.txtSlider = this.elems.getText("txtSlider");
        this.txtCurCanGet = this.elems.getText("txtCurCanGet");

    }
    protected initListeners(): void {
        this.addClickListener(this.elems.getElement("mask"), this.close);
        this.addClickListener(this.elems.getElement("btnClose"), this.close);
        this.addClickListener(this.btnGoPay, this.onClickBtnGoPay);
        this.addClickListener(this.btnGet, this.onClickBtnGet);

        this.addClickListener(this.elems.getElement("btnRule"), this.onClickRule);
    }


    protected onClose() {

    }

    protected onOpen() {
        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.YUANBAO_DOUBLE_PANEL));
        //let today = G.SyncTime.getDateAfterStartServer();
        //let limitCfg = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.ACT_FUNCTION_YUANBAOFANBEI);
        //this.leftTime = (limitCfg.m_ucEndDate - today) * this.OneDayTime + G.SyncTime.getServerZeroLeftTime();
       
        //this.addTimer("1", 1000, 0, this.onUpdateTimer);
    }

    private onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(440), '活动规则');
    }


    private onUpdateTimer() {
        this.leftTime--;
        if (this.leftTime > 0) {
            this.txtTime.text = uts.format('活动剩余时间：{0}', TextFieldUtil.getColorText(DataFormatter.second2day(this.leftTime), Color.GREEN));
        } else {
            this.txtTime.text = '活动剩余时间：已结束';
            this.removeTimer("1");
        }
    }

    private onClickBtnGoPay() {
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi);;
    }


    private onClickBtnGet() {
       // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.YUANBAO_DOUBLE_REWARD));
    }


    updatePanel() {
        let activityData = G.DataMgr.activityData;

        let hasChargeValue = activityData.getYuanBaoFanBeiChargeValue;

        this.txtCur.text = uts.format("当前活动累充：{0}", TextFieldUtil.getColorText(hasChargeValue + "元宝", "fff000"));
        this.txtCurCanGet.text = uts.format("当前可领元宝：{0}", TextFieldUtil.getColorText(activityData.getYuanBaoFanBeiRewardValue + "元宝", "fff000"));

       // let maxValue = G.DataMgr.constData.getValueById(KeyWord.PARAM_YB_DOUBLE_CNT);
        let maxValue = 0;
        let needCharge = maxValue - hasChargeValue;
        needCharge = needCharge >= 0 ? needCharge : 0;
        this.txtNext.text = needCharge > 0 ? uts.format("再充值{0}可以享受{1}", TextFieldUtil.getColorText(needCharge.toString(), "fff000"), TextFieldUtil.getColorText("100%返利", Color.GREEN)) :
            TextFieldUtil.getColorText("已激活100%充值返利", Color.GREEN);

        this.txtSlider.text = uts.format("{0}/{1}", hasChargeValue, maxValue);
        let value = hasChargeValue / maxValue;
        this.bar.transform.localScale = G.getCacheV3(value > 1 ? 1 : value, 1, 1);

        let isActive200 = value >= 1;
        this.imgFanLi0.SetActive(!isActive200);
        this.imgFanLi1.SetActive(isActive200);
        this.hasActive.SetActive(isActive200);
        this.notActive.SetActive(!isActive200);
        this.effectRoot.SetActive(isActive200);

        let canGet: boolean = activityData.getYuanBaoFanBeiRewardValue > 0;
        this.btnGet.SetActive(canGet);
        this.btnGoPay.SetActive(!canGet);

    

    }



}