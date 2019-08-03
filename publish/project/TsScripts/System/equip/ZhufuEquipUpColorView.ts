import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ThingData } from 'System/data/thing/ThingData'
import { List, ListItem } from "System/uilib/List"
import { Events } from 'System/Events'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { GuidUtil } from 'System/utils/GuidUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { DropPlanData } from 'System/data/DropPlanData'
import { ElemFinder } from 'System/uilib/UiUtility'
import { FixedList } from "System/uilib/FixedList"
import { IconItem } from 'System/uilib/IconItem'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { ZhufuData } from 'System/data/ZhufuData'
import { GameIDType } from 'System/constants/GameEnum'
import { TipFrom } from 'System/tip/view/TipsView'
import { UIUtils } from 'System/utils/UIUtils'
import { GameIDUtil } from 'System/utils/GameIDUtil'

export class ZhufuEquipUpColorView extends CommonForm {
    /**最少显示18个*/
    private readonly minShowCount = 18;

    private m_selectedData: ThingItemData;;
    private m_materilData: MaterialItemData = new MaterialItemData();
    private m_bagEquipData: ThingItemData[];
    private m_thingConfig: GameConfig.ThingConfigM;
    private m_upColorConfigs: GameConfig.ZFEquipUpColorM[];
    private m_pos: number = 0;
    private itemIcon_Normal: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private list: List;
    private btnUp: UnityEngine.GameObject;
    private txtTip: UnityEngine.UI.Text;
    private iconContent: UnityEngine.GameObject;
    private iconItems: IconItem[] = [];
    private equipIcons: IconItem[] = [];

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.ZhufuEquipUpColorView;
    }

    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.list = this.elems.getUIList("list");
        this.mask = this.elems.getElement("mask");
        this.btnClose = this.elems.getElement("btnClose");
        this.btnUp = this.elems.getElement("btnUp");
        this.txtTip = this.elems.getText("txtTip");

        this.iconContent = this.elems.getElement("iconContent");
        for (let i = 0; i < 3; i++) {
            let icon = ElemFinder.findObject(this.iconContent, "icon" + i);
            this.iconItems[i] = new IconItem();
            this.iconItems[i].setUsualIconByPrefab(this.itemIcon_Normal, icon);
            this.iconItems[i].showBg = false;
            this.iconItems[i].setTipFrom(TipFrom.normal);
        }

    }

    protected initListeners() {
        this.addClickListener(this.mask, this.onClickClose);
        this.addClickListener(this.btnClose, this.onClickClose);
        this.addClickListener(this.btnUp, this._onBtnEnhanceClick);
        this.addListClickListener(this.list, this.onSelectItem);
    }

    open(thingConfig: GameConfig.ThingConfigM, pos: number) {
        this.m_thingConfig = thingConfig;
        this.m_pos = pos;
        super.open();
    }

    protected onOpen() {
        this._updateView();
    }

    protected onClose() {

    }


    private onClickClose() {
        this.close();
    }

    private onSelectItem(index: number) {
        this._onslectEquip(this.m_bagEquipData[index]);
    }

    private _updateView(): void {
        let i: number = 0;
        if (this.m_thingConfig.m_ucFunctionType == KeyWord.ITEM_FUNCTION_ZFEQUIP_UPCOLOR) {
            this.m_upColorConfigs = G.DataMgr.equipStrengthenData.getZfUpColorConfig(this.m_thingConfig.m_iID);
            this.m_bagEquipData = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.OTHER_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG);
            this.m_bagEquipData = this.m_bagEquipData.concat(G.DataMgr.thingData.getAllEquipInContainer(GameIDType.OTHER_EQUIP, Macros.CONTAINER_TYPE_HEROSUB_ZUOQI));
            this.m_bagEquipData = this.m_bagEquipData.concat(G.DataMgr.thingData.getAllEquipInContainer(GameIDType.OTHER_EQUIP, Macros.CONTAINER_TYPE_HEROSUB_WUHUN));
            this.m_bagEquipData = this.m_bagEquipData.concat(G.DataMgr.thingData.getAllEquipInContainer(GameIDType.OTHER_EQUIP, Macros.CONTAINER_TYPE_HEROSUB_YUYI));
            this.m_bagEquipData = this.m_bagEquipData.concat(G.DataMgr.thingData.getAllEquipInContainer(GameIDType.OTHER_EQUIP, Macros.CONTAINER_TYPE_HEROSUB_FAZHEN));

            let contaierID: number = 0;
            let isUse: boolean = false;
            let type: number = 0;
            let stage: number = 0;

            for (i = this.m_bagEquipData.length - 1; i >= 0; i--) {
                isUse = false;
                type = GameIDUtil.getSubTypeByEquip(this.m_bagEquipData[i].config.m_iEquipPart);
                stage = ZhufuData.getZhufuStage(this.m_bagEquipData[i].config.m_ucRequiredLevel, type);
                for (let config of this.m_upColorConfigs) {
                    if (type == config.m_iType && config.m_iStage == stage && config.m_iColor == this.m_bagEquipData[i].config.m_ucColor) {
                        isUse = true;
                        break;
                    }
                }

                if (!isUse) {
                    this.m_bagEquipData.splice(i, 1);
                }
            }

            this.m_bagEquipData.sort(this._sortData);

            this.txtTip.text = G.DataMgr.langData.getLang(202);
        }
        else if (this.m_thingConfig.m_ucFunctionType == KeyWord.ITEM_FUNCTION_EQUIP_QHF) {
            let level: number = 0;
            this.m_bagEquipData = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.ROLE_EQUIP, Macros.CONTAINER_TYPE_ROLE_EQUIP);
            for (i = this.m_bagEquipData.length - 1; i >= 0; i--) {
                level = EquipStrengthenData.getEquipLevel(this.m_bagEquipData[i].config.m_iEquipPart);
                if (level < this.m_thingConfig.m_iFunctionID || level >= this.m_thingConfig.m_iFunctionValue) {
                    this.m_bagEquipData.splice(i, 1);
                }
            }

            this.txtTip.text = G.DataMgr.langData.getLang(203);
        }

        let index: number = -1;
        if (this.m_selectedData != null) {
            index = this.m_bagEquipData.indexOf(this.m_selectedData);
        }

        this._onslectEquip(null);
        this.updateEquipList();
    }

    private updateEquipList() {
        let len = this.m_bagEquipData.length;
        if (len < this.minShowCount) {
            len = this.minShowCount
        } 
        this.list.Count = len;

        for (let i = 0; i < this.list.Count; i++) {
        
            if (this.equipIcons[i] == null) {
                let item = this.list.GetItem(i).transform.Find("icon");
                this.equipIcons[i] = new IconItem();
                this.equipIcons[i].setUsualIconByPrefab(this.itemIcon_Normal, item.gameObject);
                this.equipIcons[i].showBg = false;
            }
            this.equipIcons[i].updateByThingItemData(this.m_bagEquipData[i]);
            this.equipIcons[i].updateIcon();

            let wear = this.list.GetItem(i).transform.Find("wear");

            if (G.DataMgr.thingData.checkIsWaring(this.m_bagEquipData[i], 0)) {
                wear.gameObject.SetActive(true);
            } else {
                wear.gameObject.SetActive(false);
            }
        }
    }

    private _onslectEquip(data: ThingItemData): void {
        this.m_selectedData = data;
        //显示当前选择装备
        this.iconItems[0].updateByThingItemData(this.m_selectedData);
        this.iconItems[0].updateIcon();

        let priview: number = 0;

        if (this.m_selectedData != null) {
            if (this.m_thingConfig.m_ucFunctionType == KeyWord.ITEM_FUNCTION_ZFEQUIP_UPCOLOR) {
                let type: number = GameIDUtil.getSubTypeByEquip(this.m_selectedData.config.m_iEquipPart);
                let stage: number = ZhufuData.getZhufuStage(this.m_selectedData.config.m_ucRequiredLevel, type);
                let selectConfig: GameConfig.ZFEquipUpColorM;
                for (let config of this.m_upColorConfigs) {
                    if (type == config.m_iType && config.m_iStage == stage && config.m_iColor == this.m_selectedData.config.m_ucColor) {
                        selectConfig = config;
                        break;
                    }
                }

                if (selectConfig != null) {
                    this.m_materilData.id = selectConfig.m_iConsumableID;
                    this.m_materilData.has = G.DataMgr.thingData.getThingNumInsensitiveToBind(this.m_materilData.id);
                    this.m_materilData.need = selectConfig.m_iConsumableNumber;

                    priview = this.m_selectedData.config.m_iID + 10;
                }
            }
            else if (this.m_thingConfig.m_ucFunctionType == KeyWord.ITEM_FUNCTION_EQUIP_QHF) {
                this.m_materilData.id = this.m_thingConfig.m_iID;
                this.m_materilData.has = G.DataMgr.thingData.getThingNumInsensitiveToBind(this.m_materilData.id);
                this.m_materilData.need = 1;

                priview = EquipStrengthenData.getBestEquipID(this.m_selectedData.config.m_iID, this.m_thingConfig.m_iFunctionValue);
            }
        }
        else {
            this.m_materilData.id = 0;
         //   this._removeItemEffect();
        }
        //显示材料图标
        this.iconItems[1].updateByMaterialItemData(this.m_materilData);
        this.iconItems[1].updateIcon();
        //显示预览图标
        this.iconItems[2].updateById(priview);
        this.iconItems[2].updateIcon();
        let enabled = this.m_materilData.id > 0 && this.m_materilData.has >= this.m_materilData.need;
        UIUtils.setButtonClickAble(this.btnUp, enabled);
    }

    private _sortData(a: ThingItemData, b: ThingItemData): number {
        return b.config.m_iID - a.config.m_iID;
    }

    onContainerChange(id: number): void {
        this._updateView();
     
    }

    private _onBtnEnhanceClick(): void {
        if (this.m_selectedData != null) {
            if (this.m_thingConfig.m_ucFunctionType == KeyWord.ITEM_FUNCTION_ZFEQUIP_UPCOLOR) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuUpColorRequest(this.m_selectedData));
            }
            else if (this.m_thingConfig.m_ucFunctionType == KeyWord.ITEM_FUNCTION_EQUIP_QHF) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_USE_THING, Macros.CONTAINER_TYPE_ROLE_BAG, this.m_thingConfig.m_iID, this.m_pos, 1, this.m_selectedData.data.m_usPosition));
            }

        }
    }

    
}
