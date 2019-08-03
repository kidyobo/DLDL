import { EnumGuide, EnumThingID } from "System/constants/GameEnum";
import { UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { IGuideExecutor } from "System/guide/IGuideExecutor";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { List, ListItem } from 'System/uilib/List'
import { ThingData } from 'System/data/thing/ThingData'
import { DropPlanData } from 'System/data/DropPlanData'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { MainView } from "System/main/view/MainView"


export class SecondChargeView extends CommonForm implements IGuideExecutor {

    private readonly TickKey = 'Tick';

    private list: List;
    private btnGo: UnityEngine.GameObject;
    private labelBtnGo: UnityEngine.UI.Text;
    private textTime: UnityEngine.UI.Text;

    private needCharge = false;

    constructor() {
        super(KeyWord.ACT_FUNCTION_SECONDCHARGE);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.SecondChargeView;
    }

    protected initElements() {
        this.btnGo = this.elems.getElement('btnGo');
        this.labelBtnGo = this.elems.getText('labelBtnGo');
        this.textTime = this.elems.getText('textTime');
        this.list = this.elems.getUIList('list');

        let cfg = ThingData.getThingConfig(EnumThingID.SecondChargeItem2);
        let dropCfg = DropPlanData.getDropPlanConfig(cfg.m_iFunctionID);
        this.list.Count = dropCfg.m_ucDropThingNumber;
        for (let i = 0; i < dropCfg.m_ucDropThingNumber; i++) {
            let iconItem = new IconItem();
            iconItem.setUsuallyIcon(this.list.GetItem(i).gameObject);
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
            iconItem.updateIcon();
        }
    }

    protected initListeners() {
        this.addClickListener(this.btnGo, this.onClickBtnGo);
        this.addClickListener(this.elems.getElement("mask"), this.close);
        this.addClickListener(this.elems.getElement("btn_return"), this.close);
    }
    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        this.updateView();
        G.GuideMgr.processGuideNext(EnumGuide.SecondCharge, EnumGuide.SecondCharge_Open);
        this.addTimer(this.TickKey, 1000, 0, delegate(this, this.onTickTimer));
        this.onTickTimer(null);
        //G.ChannelSDK.refreshPayState();
    }
    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
        G.GuideMgr.processGuideNext(EnumGuide.SecondCharge, EnumGuide.GuideCommon_None);
    }
    public updateView(): void {
        let thingData = G.DataMgr.thingData;
        if (thingData.getThingNum(EnumThingID.SecondChargeItem1) > 0) {
            // 需要充值
            UIUtils.setButtonClickAble(this.btnGo, true);
            this.labelBtnGo.text = '立即充值';
            this.needCharge = true;
        } else if (thingData.getThingNum(EnumThingID.SecondChargeItem2) > 0) {
            // 可以领奖
            UIUtils.setButtonClickAble(this.btnGo, true);
            this.labelBtnGo.text = '领取奖励';
            this.needCharge = false;
        } else {
            // 已领奖
            UIUtils.setButtonClickAble(this.btnGo, false);
            this.labelBtnGo.text = '已领取';
            this.needCharge = false;
        }
    }


    /**领取奖励*/
    private onClickBtnGo() {
        if (this.needCharge) {
            G.ActionHandler.go2Pay();
        } else {
            let items = G.DataMgr.thingData.getBagItemById(EnumThingID.SecondChargeItem2, true, 1);
            if (items.length > 0) {
                let oneItem = items[0];
                G.ModuleMgr.bagModule.useThing(oneItem.config, oneItem.data, 1, true);
            }
        }
    }

    private onTickTimer(timer: Game.Timer) {
        let s = G.SyncTime.getServerZeroLeftTime();
        this.textTime.text = uts.format('剩余时间：{0}', TextFieldUtil.getColorText(DataFormatter.second2day(s), Color.GREEN));
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        return false;
    }
}