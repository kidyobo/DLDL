import { UIPathData } from 'System/data/UIPathData'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { EquipBasePanel } from 'System/equip/EquipBasePanel'
import { UiElements } from 'System/uilib/UiElements'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { Color } from 'System/utils/ColorUtil'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EquipEnhanceAttItemData } from 'System/data/thing/EquipEnhanceAttItemData'
import { Global as G } from 'System/global'
import { EnumEquipRule } from 'System/data/thing/EnumEquipRule'
import { ThingData } from 'System/data/thing/ThingData'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { EquipUtils } from 'System/utils/EquipUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { TipType, EnumGuide, EnumEffectRule } from 'System/constants/GameEnum'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { List } from "System/uilib/List"
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { EquipView } from 'System/equip/EquipView'
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { CommonForm, UILayer } from "System/uilib/CommonForm"


class EquipFinalItem {

    private txtName: UnityEngine.UI.Text;
    private txtCurValue: UnityEngine.UI.Text;
    private txtNextValue: UnityEngine.UI.Text;
    private objArrow: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtCurValue = ElemFinder.findText(go, "txtCurValue");
        this.txtNextValue = ElemFinder.findText(go, "txtNextValue");
        this.objArrow = ElemFinder.findObject(go, "objArrow");
    }

    update(curData: GameConfig.EquipPropAtt, extraData: GameConfig.EquipPropAtt, has: boolean) {
        this.txtName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, curData.m_ucPropId);
        if (has) {
            this.txtCurValue.text = (curData.m_ucPropValue + extraData.m_ucPropValue) + "";
            this.txtNextValue.text = "已进阶";
            this.objArrow.SetActive(false);
        } else {
            this.txtCurValue.text = curData.m_ucPropValue + "";
            this.txtNextValue.text = (curData.m_ucPropValue + extraData.m_ucPropValue) + "";
            this.objArrow.SetActive(true);
        }
    }

}

/**装备终极进阶面板*/
export class EquipFinalUpPanel extends CommonForm {

    private itemIcon_Normal: UnityEngine.GameObject;
    //3个图标节点
    private curEquipIcon: UnityEngine.GameObject;
    private materialIcon: UnityEngine.GameObject;
    private nextEquipIcon: UnityEngine.GameObject;
    //3个iconitem
    private curIconItem: IconItem;
    private materialIconItem: IconItem;
    private nextIconItem: IconItem;

    private propList: List;
    private btnFinal: UnityEngine.GameObject;
    private txtTujin: UnityEngine.UI.Text;

    /**选择的装备*/
    private selectEquip: ThingItemData;
    private nextEquip: ThingItemData;
    private equipFinalItems: EquipFinalItem[] = [];
    /**消耗材料id*/
    private materialId: number = 0;
    private functionID: number = 0;
    private equipPropAtts: GameConfig.EquipPropAtt[] = [];
    private materialData: MaterialItemData = new MaterialItemData();
    private materialThingData: ThingItemData[];

    private effectRoot: UnityEngine.GameObject;
    private newSucceedEffect: UIEffect;
    private newSucceedEffectObj: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.EquipFinalUpPanel;
    }

    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.curEquipIcon = this.elems.getElement("curEquipIcon");
        this.materialIcon = this.elems.getElement("materialIcon");
        this.nextEquipIcon = this.elems.getElement("nextEquipIcon");
        this.btnFinal = this.elems.getElement("btnFinal");
        this.propList = this.elems.getUIList("propList");
        this.txtTujin = this.elems.getText("txtTujin");
        //3个图标
        this.curIconItem = new IconItem();
        this.curIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.curEquipIcon);
        this.curIconItem.setTipFrom(TipFrom.normal);
        this.curIconItem.needWuCaiColor = true;
        this.curIconItem.needForceShowWuCaiColor = true;

        this.materialIconItem = new IconItem();
        this.materialIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.materialIcon);
        this.materialIconItem.setTipFrom(TipFrom.normal);
       

        this.nextIconItem = new IconItem();
        this.nextIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.nextEquipIcon);
        this.nextIconItem.setTipFrom(TipFrom.normal);
        this.nextIconItem.needWuCaiColor = true;
        this.nextIconItem.needForceShowWuCaiColor = true;
        this.nextIconItem.isPreviewWuCaiEquip = true;

        this.effectRoot = this.elems.getElement('effectRoot');
        this.newSucceedEffectObj = this.elems.getElement("newSucceedEffect");
        this.newSucceedEffect = new UIEffect();
        this.newSucceedEffect.setEffectPrefab(this.newSucceedEffectObj, this.effectRoot);
    }


    protected initListeners() {
        this.addClickListener(this.btnFinal, this.onClickFinal);
        this.addClickListener(this.elems.getElement("mask"), this.onClickMask);
        this.addClickListener(this.elems.getElement("btnClose"), this.onClickMask);
        this.addClickListener(this.txtTujin.gameObject, this.onClickGoTo);
    }


    open(selectEquip: ThingItemData) {
        this.selectEquip = selectEquip;
        super.open();
    }

    protected onOpen() {
        this.updatePanel();
    }

    protected onClose() {
        this.newSucceedEffect.stopEffect();
    }

    private onClickMask() {
        this.close();
    }

    private onClickFinal() {
        let thingConfig = ThingData.getThingConfig(this.materialId);
        if (this.materialThingData.length > 0) {
            G.ModuleMgr.bagModule.useThing(thingConfig, this.materialThingData[0].data, 1, true);
        }
    }

    private onClickGoTo() {
        let thingConfig = ThingData.getThingConfig(this.materialId);
        if (G.ActionHandler.executeFunction(this.functionID)) {
            this.close();
        }
    }


    playJinJieEffect() {
        G.AudioMgr.playJinJieSucessSound();
        this.newSucceedEffect.playEffect(EffectType.Effect_Normal);
        this.updatePanel();
    }


    updatePanel() {
        let config = G.DataMgr.equipStrengthenData.getEquipFinalPropConfigByEquipPart(this.selectEquip.config.m_iEquipPart);
        this.materialId = config.m_iConsumID;
        this.functionID = config.m_iFunc;
        let thingConfig = ThingData.getThingConfig(this.materialId);
        this.materialThingData = G.DataMgr.thingData.getBagItemById(thingConfig.m_iID, false, 0);
        this.materialData.id = config.m_iConsumID;
        this.materialData.need = config.m_iConsumNum;
        this.materialData.has = this.materialThingData.length;

        //显示图标
        this.curIconItem.updateByThingItemData(this.selectEquip);
        this.curIconItem.updateIcon();

        this.nextIconItem.updateByThingItemData(this.selectEquip);
        this.nextIconItem.updateIcon();

        this.materialIconItem.updateByMaterialItemData(this.materialData);
        this.materialIconItem.updateIcon();

        //基础属性
        let equipConfig = this.selectEquip.config;
        for (let i: number = 0; i < equipConfig.m_astBaseProp.length; i++) {
            this.equipPropAtts[i] = {} as GameConfig.EquipPropAtt;
            let strengthenConfig = G.DataMgr.equipStrengthenData.getEquipStrengthenConfigByPart(equipConfig.m_iEquipPart);
            this.equipPropAtts[i].m_ucPropId = strengthenConfig.m_astProp[i].m_ucPropId;
            this.equipPropAtts[i].m_ucPropValue = strengthenConfig.m_astProp[i].m_ucPropValue + EquipUtils.getAddStrentPorpValue(equipConfig, i);
        }

        //是否已经终极进阶过，
        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        let has = equipStrengthenData.isEquipHadFinalUpLv(EquipUtils.getEquipIdxByPart(this.selectEquip.config.m_iEquipPart));
        UIUtils.setButtonClickAble(this.btnFinal, !has && this.materialData.has >= this.materialData.need)
        this.propList.Count = config.m_astPropAtt.length;
        for (let i = 0; i < this.propList.Count; i++) {
            if (this.equipFinalItems[i] == null) {
                let item = this.propList.GetItem(i).gameObject;
                this.equipFinalItems[i] = new EquipFinalItem();
                this.equipFinalItems[i].setComponents(item);
            }
            this.equipFinalItems[i].update(this.equipPropAtts[i], config.m_astPropAtt[i], has);
        }

        this.txtTujin.text = config.m_szDesc;

    }


}