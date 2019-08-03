import { ThingItemData } from "System/data/thing/ThingItemData";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from 'System/global';
import { CommonForm, GameObjectGetSet, UILayer } from "System/uilib/CommonForm";
import { List } from 'System/uilib/List';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from "System/utils/ColorUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { TitleItemNode } from '../ItemPanels/TitleItemNode';
import { RegExpUtil } from "../utils/RegExpUtil";
import { KeyWord } from "../constants/KeyWord";
import { IconItem } from "../uilib/IconItem";
import { TipFrom } from "../tip/view/TipsView";

export class MaterialSelectItem {
    private imgIcon: UnityEngine.GameObject;
    private txtNumber: UnityEngine.UI.Text;
    private txtName: UnityEngine.UI.Text;
    private txtDescribe: UnityEngine.UI.Text;
    private iconitem: IconItem;
    btnConfirm: UnityEngine.GameObject;
    btnDemount: UnityEngine.GameObject;

    onClickConfirmCall: (index: number) => void;
    onClickDemountCall: (index: number) => void;

    private index: number = -1;

    setComponents(go: UnityEngine.GameObject, index: number, itemicon: UnityEngine.GameObject) {
        this.index = index;

        this.imgIcon = ElemFinder.findObject(go, "imgIcon");
        this.txtNumber = ElemFinder.findText(go, "txtNumber");
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtDescribe = ElemFinder.findText(go, "txtDescribe");
        this.btnConfirm = ElemFinder.findObject(go, "btnConfirm");
        this.btnDemount = ElemFinder.findObject(go, "btnDemount");

        this.iconitem = new IconItem();
        this.iconitem.setUsualIconByPrefab(itemicon, this.imgIcon);
        this.iconitem.setTipFrom(TipFrom.normal);
        this.iconitem.closeItemCount();

        Game.UIClickListener.Get(this.btnConfirm).onClick = delegate(this, this.onClickConfirm);
        Game.UIClickListener.Get(this.btnDemount).onClick = delegate(this, this.onClickDemount);

    }

    refreshItem(equipData: ThingItemData, need: number) {
        // G.ResourceMgr.loadIcon(this.imgIcon, equipData.config.m_szIconID.toString());
        this.iconitem.updateById(equipData.config.m_iID);
        this.iconitem.updateIcon();
        this.txtNumber.text = TextFieldUtil.getColorText(equipData.data.m_iNumber.toString(), equipData.data.m_iNumber >= need ? Color.GREEN : Color.RED); //TextFieldUtil.getColorText(uts.format("{0}/{1}", equipData.data.m_iNumber.toString(), need), equipData.data.m_iNumber >= need ? Color.GREEN : Color.RED);
        this.txtName.text = TextFieldUtil.getColorText(equipData.config.m_szName, Color.getColorById(equipData.config.m_ucColor));
        this.txtDescribe.text = uts.format("需要{0}个技能石", need);// RegExpUtil.xlsDesc2Html(equipData.config.m_szDesc);
    }

    onClickConfirm() {
        if (this.onClickConfirmCall != null) {
            this.onClickConfirmCall(this.index);
        }
    }

    onClickDemount() {
        if (this.onClickDemountCall != null) {
            this.onClickDemountCall(this.index);
        }
    }

    setButtonState(confirm: boolean) {
        this.btnConfirm.SetActive(confirm);
        this.btnDemount.SetActive(!confirm);
    }
}

export class MaterialSelectView extends CommonForm {

    private animatorNode: GameObjectGetSet;
    private titleItemNode: TitleItemNode;
    private materialList: List;
    private materialItems: MaterialSelectItem[] = [];
    private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;

    private bagDatas: ThingItemData[];
    private skillData: GameConfig.HunGuSkillFZConfigM;
    private equipData: ThingItemData;

    private itemicon: UnityEngine.GameObject;;

    private curSelecetedIndex: number = -1;

    onClickCloseCall: () => void;
    onClickMaterialCall: (material: ThingItemData) => void;
    onClickConfirmCall: (material: ThingItemData, equip: ThingItemData) => void;
    onClickDemountCall: (material: ThingItemData) => void;

    constructor() {
        super(0);
    }



    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.MaterialSelectView;
    }

    protected initElements() {
        super.initElements();
        this.animatorNode = new GameObjectGetSet(this.elems.getElement("animatorNode"));
        this.titleItemNode = new TitleItemNode();
        this.titleItemNode.setComponents(this.elems.getElement("titleItemNode"));
        this.materialList = this.elems.getUIList("materialList");
        this.btnClose = this.elems.getElement("btnClose");
        this.mask = this.elems.getElement("mask");
        this.itemicon = this.elems.getElement("itemIcon_Normal");
        this.setTitle("技能铸入");
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnClose, this.close);
        this.addClickListener(this.mask, this.close);
        this.addListClickListener(this.materialList, this.onClickMaterialList);
    }

    open(bagDatas: ThingItemData[], skilldata: GameConfig.HunGuSkillFZConfigM, equipdata: ThingItemData) {
        this.bagDatas = bagDatas;
        this.skillData = skilldata;
        this.equipData = equipdata;
        super.open(bagDatas, skilldata, equipdata);
    }

    protected onOpen() {
        this.setSubtitle(uts.format("{0}", KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, this.equipData.config.m_iDropLevel)));
        this.onClickMaterialList(0);
        this.refreshList();
    }

    protected onClose() {
        if (this.onClickCloseCall != null)
            this.onClickCloseCall();
    }

    private onClickMaterialList(index: number) {
        this.curSelecetedIndex = index;
        if (this.onClickMaterialCall != null)
            this.onClickMaterialCall(this.bagDatas[index]);
    }

    private refreshList() {
        if (this.bagDatas == null) {
            //无数据
            this.materialList.Count = 0;
            return;
        }
        let count = this.bagDatas.length;
        this.materialList.Count = count;
        this.materialList.Selected = this.curSelecetedIndex;
        for (let i = 0; i < count; i++) {
            if (this.materialItems[i] == null) {
                this.materialItems[i] = new MaterialSelectItem();
                this.materialItems[i].setComponents(this.materialList.GetItem(i).gameObject, i, this.itemicon);
                this.materialItems[i].onClickConfirmCall = delegate(this, this.onClickListConfirm);
                this.materialItems[i].onClickDemountCall = delegate(this, this.onClickListDemount);
            }
            this.materialItems[i].refreshItem(this.bagDatas[i], this.skillData.m_stCostItemList[0].m_iItemNumber)
            if (this.equipData.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_stSkillFZ.m_iItemID == this.bagDatas[i].config.m_iID) {
                this.materialItems[i].setButtonState(false);
            }
            else {
                this.materialItems[i].setButtonState(true);
            }
        }
    }

    private onClickListConfirm(index: number) {
        if (this.onClickConfirmCall != null)
            this.onClickConfirmCall(this.bagDatas[index], this.equipData);
    }

    private onClickListDemount(index: number) {
        if (this.onClickDemountCall != null)
            this.onClickDemountCall(this.bagDatas[index]);
    }

    public setTitle(title: string) {
        this.titleItemNode.setTitleName(title);
    }

    public setSubtitle(des: string) {
        this.titleItemNode.setSubtitle(des);
    }
}