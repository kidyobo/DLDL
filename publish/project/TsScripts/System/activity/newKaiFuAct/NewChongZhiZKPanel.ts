import { PriceBar } from "System/business/view/PriceBar";
import { KeyWord } from "System/constants/KeyWord";
import { ThingData } from "System/data/thing/ThingData";
import { UIPathData } from "System/data/UIPathData";
import { ActivityRuleView } from "System/diandeng/ActivityRuleView";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { MessageBoxConst } from "System/tip/TipManager";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { EffectType, UIEffect } from "System/uiEffect/UIEffect";
import { RewardIconItemData } from "System/data/vo/RewardIconItemData";
import { OpenChestView } from "System/guide/OpenChestView";
import { TabSubForm } from "System/uilib/TabForm";
import { DropDownCtrl } from 'System/uilib/DropDownCtrl'
import { ConfirmCheck } from "System/tip/TipManager";
import { ElemFinder } from 'System/uilib/UiUtility'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { UIUtils } from 'System/utils/UIUtils'

class NewChongZhiZKItem {

    private txtBefore: UnityEngine.UI.Text;
    private txtAfter: UnityEngine.UI.Text;
    private txtZK: UnityEngine.UI.Text;
    private txtBtn: UnityEngine.UI.Text;

    private imgGold: UnityEngine.UI.Image;
    private icon: UnityEngine.GameObject;

    private btnGoto: UnityEngine.GameObject;
    private imgAtals: Game.UGUIAltas;

    private materialData: MaterialItemData;
    private iconItem: IconItem;
    private config: GameConfig.CZKHRebateConfigM;

    setCommponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject, imgAtals: Game.UGUIAltas) {
        this.imgAtals = imgAtals;

        this.txtBefore = ElemFinder.findText(go, "txtBefore");
        this.txtAfter = ElemFinder.findText(go, "txtAfter");
        this.txtZK = ElemFinder.findText(go, "txtZK");
        this.txtBtn = ElemFinder.findText(go, "btnGoto/txtBtn")

        this.imgGold = ElemFinder.findImage(go, "imgGold");
        this.icon = ElemFinder.findObject(go, "icon");
        this.btnGoto = ElemFinder.findObject(go, "btnGoto");
        this.materialData = new MaterialItemData();
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);
        Game.UIClickListener.Get(this.btnGoto).onClick = delegate(this, this.onGoto);
    }

    update(config: GameConfig.CZKHRebateConfigM, index: number) {
        this.config = config;
        this.txtBefore.text = uts.format('折前：{0}元宝', TextFieldUtil.getColorText(config.m_iChargeCount.toString(), Color.RED));
        this.txtAfter.text = uts.format('折后：{0}元宝', TextFieldUtil.getColorText((config.m_iChargeCount + config.m_iDiscountRate).toString(), Color.YELLOW));
        this.txtBtn.text = uts.format('{0}元', Math.floor(config.m_iChargeCount / 10));
        this.txtZK.text = TextFieldUtil.getItemText(ThingData.getThingConfig(config.m_iItemID));
        this.imgGold.sprite = this.imgAtals.Get('yb'+(index+1));

        this.materialData.id = config.m_iItemID;
        this.materialData.has = G.DataMgr.thingData.getThingNum(config.m_iItemID, 0, false);
        this.materialData.need = config.m_iItemNum;
        this.iconItem.updateByMaterialItemData(this.materialData);
        this.iconItem.updateIcon();

        UIUtils.setButtonClickAble(this.btnGoto, this.materialData.has >= this.materialData.need);

    }


    protected onGoto() {

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.HAPPY_CHARGE_REBATE, this.config.m_iItemID, this.config.m_iChargeCount));
        let config = G.DataMgr.payData.getCfgByCount(this.config.m_iChargeCount);
        if (config) {
            G.ChannelSDK.pay(config.m_iProductID);
        }
      
    }

}

/**
 * 充值狂欢 - 充值折扣
 */
export class NewChongZhiZKPanel extends TabSubForm {

    private imgAltas: Game.UGUIAltas;
    private itemIcon_Normal: UnityEngine.GameObject;
    private list: List;
    private txtActivityTime: UnityEngine.UI.Text;


    private newChongZhiZKItems: NewChongZhiZKItem[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_KUANGHUANZHEKOU);
    }

    protected resPath(): string {
        return UIPathData.NewChongZhiZKPanel;
    }

    protected initElements() {
        this.imgAltas = this.elems.getUGUIAtals("imgAltas");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.txtActivityTime = this.elems.getText("txtActivityTime");
        this.list = this.elems.getUIList("list");
    }

    protected initListeners() {

    }

    protected onOpen() {
        this.updatePanel();
    }

    protected onClose() {

    }

    updatePanel() {

        let kaifuActivityData = G.DataMgr.kaifuActData;

        this.list.Count = kaifuActivityData.kfChargeCountArr.length;
        for (let i = 0; i < this.list.Count; i++) {
            if (this.newChongZhiZKItems[i] == null) {
                let item = this.list.GetItem(i).gameObject;
                this.newChongZhiZKItems[i] = new NewChongZhiZKItem();
                this.newChongZhiZKItems[i].setCommponents(item, this.itemIcon_Normal, this.imgAltas);
            }

            let cfgs = kaifuActivityData.getkfChargeRebateConfig(kaifuActivityData.kfChargeCountArr[i]);
            let cfg = this.getMaxCfg(cfgs);
            this.newChongZhiZKItems[i].update(cfg,i);
        }
    }


    /*获得拥有中最大的，没有就取最大的*/
    private getMaxCfg(cfgs: GameConfig.CZKHRebateConfigM[]) {
        for (let i = cfgs.length - 1; i >= 0; i--) {
            if (G.DataMgr.thingData.getThingNum(cfgs[i].m_iItemID, 0, false)) {
                return cfgs[i];
            }
        }
        return cfgs[cfgs.length - 1];
    }









}