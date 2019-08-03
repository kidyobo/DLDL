import { FanLiDaTingView } from 'System/activity/fanLiDaTing/FanLiDaTingView';
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Global as G } from 'System/global'
import { ThingData } from 'System/data/thing/ThingData'
import { KeyWord } from 'System/constants/KeyWord'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { Events } from 'System/Events'
import { YiYuanDuoBaoView, YiYuanDuoBaoGroupType } from 'System/activity/YunYingHuoDong/YiYuanDuoBaoView'
import { UnitCtrlType, GameIDType, EnumEffectRule } from 'System/constants/GameEnum'
import { ThingItemData } from "System/data/thing/ThingItemData"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { DataFormatter } from 'System/utils/DataFormatter'
import { Color } from "System/utils/ColorUtil"
import { IconItem } from "System/uilib/IconItem"
import { TipFrom } from 'System/tip/view/TipsView'
import { FirstRechargeView } from 'System/activity/view/FirstRechargeView'
import { DailyRechargeView } from 'System/activity/view/DailyRechargeView'


export class LingBaoAlertView extends CommonForm {

    private lingbaoId: number = 0;

    private modlePos: UnityEngine.GameObject;
    private btn_close: UnityEngine.GameObject;
    private btn_xufei: UnityEngine.GameObject;
    private btn_jihuo: UnityEngine.GameObject;
    private btnMask: UnityEngine.GameObject;

    private lingbao_huo: UnityEngine.GameObject;
    private lingbao_shui: UnityEngine.GameObject;
    private lingbao_mu: UnityEngine.GameObject;

    private modelParentTransform: UnityEngine.Transform;

    private txtDes: UnityEngine.UI.Text;

    private itemData: ThingItemData;

    private thingItem: UnityEngine.GameObject;

    private itemIcon_Normal: UnityEngine.GameObject;

    private isFirstActive: boolean = false;


    constructor() {
        super(0);
    }

    open(itemData: ThingItemData = null, lingbaoId: number = 0, isfirst: boolean = false) {
        //if (lingbaoId == 0)
        //{
        //  this.lingbaoId = itemData.config.m_iID;
        //}
        //else
        //{
        this.lingbaoId = lingbaoId;
        //}
        this.itemData = itemData;
        this.isFirstActive = isfirst;
        if (isfirst) {
            this.addTimer("autoClose", 10, 1, this.onClose);
        }
        super.open(itemData, lingbaoId, isfirst);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.LingBaoAlertView;
    }

    protected initElements() {

        this.btn_xufei = this.elems.getElement("btn_xufei");
        this.btn_jihuo = this.elems.getElement("btn_jihuo")
        this.btn_close = this.elems.getElement("btnClose");
        this.btnMask = this.elems.getElement("mask");
        this.lingbao_huo = this.elems.getElement("lingbaohuo");
        this.lingbao_mu = this.elems.getElement("lingbaomu");
        this.lingbao_shui = this.elems.getElement("lingbaoshui");

        this.modlePos = this.elems.getElement("RoleGameObject");
        this.modelParentTransform = this.elems.getTransform('qysPos');

        this.txtDes = this.elems.getText("txtTimer");

        this.thingItem = this.elems.getElement("icon");

        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");

    }

    protected initListeners() {
        this.addClickListener(this.btn_xufei, this.onClickBtXuFei);
        this.addClickListener(this.btn_jihuo, this.onClickBtJiHuo);
        this.addClickListener(this.btn_close, this.onClickBtnClose);
        this.addClickListener(this.btnMask, this.onClickBtnClose);
    }


    protected onOpen() {
        this.setModlePosTransform();
        this.updatePanel();
    }

    private onClickBtnClose() {
        this.close();
    }

    private setModlePosTransform() {
        this.modelParentTransform.localPosition = new UnityEngine.Vector3(-10, 0, 0);
        this.modelParentTransform.transform.rotation = UnityEngine.Quaternion.Euler(0, 180, 0);
        this.modelParentTransform.transform.localScale = new UnityEngine.Vector3(160, 160, 160);
    }

    private updatePanel() {
        let lingbaoCfg: GameConfig.LingBaoCfgM = G.DataMgr.lingbaoData.getLingBaoCfg(this.lingbaoId);
        if (!lingbaoCfg) return;
        let equipCfg: GameConfig.EquipConfigM = ThingData.getThingConfig(lingbaoCfg.m_iEquipId);
        let buffCfg: GameConfig.BuffConfigM = BuffData.getBuffByID(equipCfg.m_iFunctionID);
        //this._ui.numFight.setValue(lingbaoCfg.m_iFight);
        let buffEffect: GameConfig.BuffEffect = buffCfg.m_astBuffEffect[0];
        if (buffEffect.m_iBuffEffectType == KeyWord.BUFF_EFFECT_HARM_ADD) {
            //火灵宝
            this.setLingBaoActive(true, false, false);
            G.ResourceMgr.loadModel(this.modlePos, UnitCtrlType.lingbao, "350013", this.sortingOrder);
        }
        else if (buffEffect.m_iBuffEffectType == KeyWord.BUFF_EFFECT_SKILL_DEC_DAMAGE) {
            //水灵宝
            this.setLingBaoActive(false, true, false);
            G.ResourceMgr.loadModel(this.modlePos, UnitCtrlType.lingbao, "350014", this.sortingOrder);
        }
        else if (buffEffect.m_iBuffEffectType == KeyWord.BUFF_EFFECT_ROLE_EXPERENCE_RATE) {
            //木灵宝
            this.setLingBaoActive(false, false, true);
            G.ResourceMgr.loadModel(this.modlePos, UnitCtrlType.lingbao, "350015", this.sortingOrder);
        }
        //有效期显示
        if (this.itemData) {
            let config = this.itemData.config;
            let thingInfo = this.itemData.data;

            if (thingInfo != null) {
                let dynamicInfo = thingInfo.m_stThingProperty;
                if (dynamicInfo.m_iPersistTime > 0) {
                    this.txtDes.text = TextFieldUtil.getColorText("有效期至\n", 'CAE4FFFF') + TextFieldUtil.getColorText(DataFormatter.second2mmddmm(dynamicInfo.m_iPersistTime), Color.YELLOW);
                }
                if (!this.isFirstActive) {
                    this.btn_xufei.SetActive(true);
                    this.btn_jihuo.SetActive(false)
                }
                else {
                    this.btn_xufei.SetActive(false);
                    this.btn_jihuo.SetActive(false)
                }
            }
            else {
                let curTime: number = G.SyncTime.getCurrentTime();
                this.txtDes.text = TextFieldUtil.getColorText("尚未激活", Color.RED);
                if (!this.isFirstActive) {
                    this.btn_xufei.SetActive(false);
                    this.btn_jihuo.SetActive(true)
                }
                else {
                    this.btn_xufei.SetActive(false);
                    this.btn_jihuo.SetActive(false)
                }
            }
            let iconItem = new IconItem();
            iconItem.effectRule = EnumEffectRule.none;
            iconItem.setUsualEquipSlotByPrefab(this.itemIcon_Normal, this.thingItem);
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.showBg = false;
            iconItem.needWuCaiColor = true;
            iconItem.updateByThingItemData(this.itemData);
            iconItem.updateEquipIcon(GameIDType.ROLE_EQUIP, 0, 8);
        }
    }

    private setLingBaoActive(huoActive: boolean, shuiActive: boolean, muActive: boolean) {
        //this.lingbao_huo.SetActive(huoActive);
        //this.lingbao_shui.SetActive(shuiActive);
        //this.lingbao_mu.SetActive(muActive);
    }

    private onClickBtXuFei() {
        let lingbaoCfg: GameConfig.LingBaoCfgM = G.DataMgr.lingbaoData.getLingBaoCfg(this.lingbaoId);
        let itemList = G.DataMgr.thingData.getBagItemById(lingbaoCfg.m_iAddTimeItem, false, 1);
        if (itemList != null && itemList.length > 0) {
            let item = itemList.shift();
            G.ModuleMgr.bagModule.useThing(item.config, item.data, item.data.m_iNumber);
        }
        else {
            //G.Uimgr.createForm<BatBuyView>(BatBuyView).open(lingbaoCfg.m_iAddTimeItem, 1, 0, 0, 0, EnumAutoUse.NormalUse);
            //G.Uimgr.createForm<YiYuanDuoBaoView>(YiYuanDuoBaoView).open(YiYuanDuoBaoGroupType.meiriyiyuanPanel);
            if (G.SyncTime.getDateAfterStartServer() >= 8) {
                G.Uimgr.createForm<DailyRechargeView>(DailyRechargeView).open();
            } else {
                G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(KeyWord.OTHER_FUNCTION_LEICHONGFANLI);
            }
        }
        this.close();
    }

    private onClickBtJiHuo() {
        if (G.DataMgr.heroData.curChargeMoney > 0)
            if (G.SyncTime.getDateAfterStartServer() >= 8) {
                G.Uimgr.createForm<DailyRechargeView>(DailyRechargeView).open();
            } else {
                G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(KeyWord.OTHER_FUNCTION_LEICHONGFANLI);
            }
        else
            G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
        this.close();
    }

    firstActive() {

    }
}