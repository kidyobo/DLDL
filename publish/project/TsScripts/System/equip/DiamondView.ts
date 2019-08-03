import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { Global as G } from "System/global";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { Macros } from "System/protocol/Macros";
import { KeyWord } from "System/constants/KeyWord";
import { GuidUtil } from "System/utils/GuidUtil";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { UIPathData } from "System/data/UIPathData"
import { IconItem } from "System/uilib/IconItem"
import { EquipUtils } from "System/utils/EquipUtils"
import { GameIDUtil } from "System/utils/GameIDUtil"
import { ThingData } from "System/data/thing/ThingData"
import { EquipStrengthenData } from "System/data/EquipStrengthenData"
import { InsertDiamondItemData } from "System/equip/InsertDiamondItemData"
import { Color } from "System/utils/ColorUtil"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { List } from "System/uilib/List";
import { ElemFinder } from 'System/uilib/UiUtility'
import { EnumEffectRule } from 'System/constants/GameEnum'

export class DiamondView extends CommonForm {
  
    /**背包中的宝石*/
    private diamomdList: ThingItemData[];
    /**宝石属性*/
    private diamondData: InsertDiamondItemData;
    /**选择的是那个装备*/
    private selectEquip: ThingItemData;

    private itemListCtrl: List = null;
    private btnTakeOff: UnityEngine.GameObject = null;
    private btnClose: UnityEngine.GameObject = null;
    private mask: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.DiamondView;
    }
    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.itemListCtrl = this.elems.getUIList("itemListCtrl");
        this.btnTakeOff = this.elems.getElement("btnTakeOff");
        this.btnClose = this.elems.getElement("btnClose");
        this.mask = this.elems.getElement("mask");

    }
    protected initListeners(): void {
        this.addListClickListener(this.itemListCtrl, this.onItemClick);
        this.addClickListener(this.btnClose, this.onBtnClose);
        this.addClickListener(this.mask, this.onBtnClose);
        this.addClickListener(this.btnTakeOff, this.onBtnTakeOff);
    }

    open( data: ThingItemData[], diamondData: InsertDiamondItemData, equip: ThingItemData) {
        this.diamomdList = data;
        this.diamondData = diamondData;
        this.selectEquip = equip;
        super.open();
    }

  
    protected onOpen() {
        this.itemListCtrl.ScrollTop();
        this.itemListCtrl.Count = this.diamomdList.length;
        this.showOrHideButton();
        this.onInit();
    }

    protected onClose() {
        
    }

    private onInit() {
        this.showDiamondUI();
    }


    private showOrHideButton() {
        if (this.diamondData.id == 0) {
            this.btnTakeOff.SetActive(false);
        } else if (this.diamondData.level >= 10 || (!G.DataMgr.thingData.canDiamondUplevel(this.diamondData.id))) {
            this.btnTakeOff.SetActive(true);
        } else {
            this.btnTakeOff.SetActive(true);
        }
    }


    private showDiamondUI(): void {
        for (let i = 0; i < this.itemListCtrl.Count; i++) {
            let item = this.itemListCtrl.GetItem(i);
            let txtName = item.findText("container/txtName");
            let txtValue = item.findText("container/txtValue");
            let iconItem = new IconItem();
            iconItem.effectRule = EnumEffectRule.none;
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal,item.findObject('container/icon'));
            iconItem.updateByThingItemData(this.diamomdList[i]);
            iconItem.updateIcon();
      
            //宝石等级
            if (this.diamomdList[i] != null) {
                let diamondID: number = this.diamomdList[i].config.m_iID;
                if (diamondID > 0) {
                    let color = Color.getColorById(this.diamomdList[i].config.m_ucColor);
                    txtName.text = TextFieldUtil.getColorText(this.diamomdList[i].config.m_szName, color);               
                    //开放等级（神装，超神，武极）
                    let cfg: GameConfig.DiamondPropM = G.DataMgr.equipStrengthenData.getDiamondConfig(diamondID);
                    let str = uts.format('{0}+{1}', KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, cfg.m_ucPropId), cfg.m_iPropValue);
                    txtValue.text = TextFieldUtil.getColorText(str, color); 
                }            
            } else {
                txtName.text = "";
            }
        }
    }


    /**
     * 物品点击
     * @param index
     */
    private onItemClick(index: number): void {
        if (this.diamomdList[index] != null) {
            let diamond: ThingItemData = this.diamomdList[index];

            if (diamond != null && this.selectEquip.config != null) {
                let equipLevel: number = EquipStrengthenData.getEquipLevel(this.selectEquip.config.m_iID);
                if (equipLevel >= diamond.config.m_ucRequiredLevel) {
                    EquipUtils.diamondPullout(this.diamondData);
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDiamondInsertRequest(this.selectEquip.containerID, this.selectEquip.data.m_usPosition, this.diamondData.slot, diamond.config.m_iID, diamond.data.m_usPosition));
                    this.close();
                }
                else {
                    G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(146, diamond.config.m_ucRequiredLevel));
                }

            }
        }
    }
    /**
     * 关闭按钮
     */
    private onBtnClose() {
        this.close();
    }
  
    /**
    * 卸下按钮
    */
    private onBtnTakeOff() {
        EquipUtils.diamondPullout(this.diamondData);
        this.close();
    }  
}