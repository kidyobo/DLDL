import { EnumEffectRule } from 'System/constants/GameEnum';
import { UIPathData } from 'System/data/UIPathData';
import { MaterialItemData } from 'System/data/vo/MaterialItemData';
import { ItemTipBase } from 'System/tip/view/ItemTipBase';
import { TextGetSet, UILayer, GameObjectGetSet } from 'System/uilib/CommonForm';
import { FixedList } from "System/uilib/FixedList";
import { GroupList } from 'System/uilib/GroupList';
import { IconItem } from 'System/uilib/IconItem';
import { TabSubForm } from 'System/uilib/TabForm';
import { KeyWord } from '../constants/KeyWord';
import { HunguCreateData } from '../data/hunli/HunguCreateData';
import { Global as G } from "System/global";
import { TextFieldUtil } from '../utils/TextFieldUtil';
import { ElemFinder } from '../uilib/UiUtility';
import { ListItem } from '../uilib/List';
import { IconModelItem } from '../ItemPanels/IconModelItem';
import { Color } from '../utils/ColorUtil';
import { TipFrom } from '../tip/view/TipsView';
import { ItemTipData } from '../tip/tipData/ItemTipData';


export abstract class HunguCreatePanel extends TabSubForm {
    /**合成列表*/
    private hunguGroupList: GroupList;
    /**中间合成后物品*/
    private centerIconItem: IconItem;
    /**4个合成材料*/
    private mergeFixedList: FixedList;
    private materialIconItem: IconModelItem[] = [];
    private textHasAndNeed: TextGetSet[] = [];
    private arrowLs: UnityEngine.GameObject[] = [];
    private lockImgArray: UnityEngine.GameObject[] = [];
    /**过滤*/
    private toggleCanCompound: UnityEngine.UI.ActiveToggle = null;
    private txtTips: TextGetSet;
    private succendEffectNode: GameObjectGetSet;
    private defeatedEffectNode: GameObjectGetSet;

    //新增右侧合成物品信息
    private thingInfo: UnityEngine.GameObject;
    private equipInfo: UnityEngine.GameObject;
    private itemTipBase: ItemTipBase;

    /**升级按钮*/
    private btnUp: UnityEngine.GameObject = null;
    /**一键升级按钮*/
    private oneBtnUp: UnityEngine.GameObject = null;

    /**合成材料的数量*/
    private readonly MATERIAL_NUM: number = 4;

    private itemIcon_Normal: UnityEngine.GameObject;
    private itemIcon_Model: UnityEngine.GameObject;
    private hunguCreateData: HunguCreateData;

    private curMergeGroupDatas: { [prop: number]: GameConfig.HunGuMergeM[] }
    private curFirstDatas: number[] = [];
    private curMergeData: GameConfig.HunGuMergeM;
    private curEquipIndex: number = -1;
    private curMaterialIndex: number = -1;

    /**一级索引*/
    private curfirstSelectedIndex: number = 0;
    private curfirstSelectedId: number = 0;
    /**二级索引*/
    private cursecondSelectedIndex: number = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HUNGUN_CREATE);
    }
    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.HunguCreatePanel;
    }
    protected initElements(): void {
        this.hunguCreateData = G.DataMgr.hunliData.hunguCreateData;
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.itemIcon_Model = this.elems.getElement("itemIcon_Model");

        this.hunguGroupList = this.elems.getUIGroupList("mergeGroupList");
        this.centerIconItem = new IconItem();
        this.centerIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement("centerIconItem"));

        this.mergeFixedList = this.elems.getUIFixedList("mergeFixedList");
        //4个可合成的物品
        for (let i = 0; i < this.MATERIAL_NUM; i++) {
            let item = this.mergeFixedList.GetItem(i);
            this.textHasAndNeed.push(new TextGetSet(item.findText("textHasAndNeed")));
            let lock = item.findObject("lockRamImg");
            lock.SetActive(false);
            this.lockImgArray.push(lock);
            this.arrowLs.push(item.findObject("arrowL"));
            let parent = item.findObject("icon");
            let iconItem = new IconModelItem();
            iconItem.setIconByPrefab(this.itemIcon_Model, parent);
            iconItem.selectedClose();
            this.materialIconItem[i] = iconItem;
        }

        this.toggleCanCompound = this.elems.getActiveToggle("toggleFilter");
        this.txtTips = new TextGetSet(this.elems.getText("txtTips"));
        this.succendEffectNode = new GameObjectGetSet(this.elems.getElement("succendEffectNode"));
        this.defeatedEffectNode = new GameObjectGetSet(this.elems.getElement("defeatedEffectNode"));

        this.thingInfo = this.elems.getElement("thingInfo");
        this.equipInfo = this.elems.getElement("equipInfo");
        this.itemTipBase = new ItemTipBase();
        this.itemTipBase.setBaseInfoComponents(this.elems.getUiElements('baseInfo'), this.itemIcon_Normal);
        this.itemTipBase.setThingInfoComponents(this.thingInfo);
        this.itemTipBase.setEquipInfoComponents(this.equipInfo, this.elems.getUiElements('equipInfo'));

        this.btnUp = this.elems.getElement("btnUp");
        this.oneBtnUp = this.elems.getElement("oneBtnUp");

    }
    protected initListeners(): void {
        this.hunguGroupList.onClickItem = delegate(this, this.onClickMergeGroupItem);
        this.toggleCanCompound.onValueChanged = delegate(this, this.onToggleCanCreate);
        this.addListClickListener(this.mergeFixedList, this.onMergeListClick);

        this.addClickListener(this.btnUp.gameObject, this.onClickUp);
        this.addClickListener(this.oneBtnUp.gameObject, this.onClickOneBtnUp);
    }

    protected onOpen() {
        this.updatePanel();
        this.hideEffect();
        if (this.hunguCreateData.getCanMergeGroupData() != null) {
            this.toggleCanCompound.isOn = true;
            this.curfirstSelectedIndex = 0;
            this.cursecondSelectedIndex = 0;
            this.hunguGroupList.Selected = this.curfirstSelectedIndex;
            let subList = this.hunguGroupList.GetSubList(this.curfirstSelectedIndex);
            if (subList) {
                subList.Selected = this.cursecondSelectedIndex;
            }
            this.updatePanel();
        }
    }

    protected onClose() {
        this.hideEffect();
    }

    private onClickMergeGroupItem(index: number) {
        this.curfirstSelectedIndex = index;
        let subList = this.hunguGroupList.GetSubList(index);
        if (subList)
            subList.Selected = 0;
        this.cursecondSelectedIndex = 0;
        this.updatePanel();
    }

    private onToggleCanCreate(ison: boolean) {
        uts.log("jackson.........");
        this.curfirstSelectedIndex = 0;
        this.cursecondSelectedIndex = 0;
        this.hunguGroupList.Selected = this.curfirstSelectedIndex;
        let subList = this.hunguGroupList.GetSubList(this.curfirstSelectedIndex);
        if (subList) {
            subList.Selected = this.cursecondSelectedIndex;
        }
        this.updatePanel();
    }

    /**
     * 材料的点击
     */
    private onMergeListClick(index: number) {
        if (index < this.curMergeData.m_stMaterial.length)
            G.ViewCacher.tipsView.open(this.materialIconItem[index].getTipData(), TipFrom.equip);
    }

    private onClickUp() {
        if (this.hunguCreateData.isHaveMergeEquip(this.curMergeData.m_iID)) {
            this.hunguCreateData.sendMergeRequest(this.curMergeData.m_iID);
        }
        else {
            G.TipMgr.addMainFloatTip("当前选中不可合成!");
        }
    }

    private onClickOneBtnUp() {

    }

    private updatePanel() {
        this.refreshData();
        if (this.curMergeGroupDatas == null) {
            G.TipMgr.addMainFloatTip("没有可合成物品!");
            this.toggleCanCompound.isOn = false;
            return;
        }
        this.curMergeData = this.curMergeGroupDatas[this.curfirstSelectedId][this.cursecondSelectedIndex];
        this.refreshLeftList();
        this.refreshCenterIcon();
        this.refreshRightInfo();
    }

    private refreshData() {
        if (this.toggleCanCompound.isOn) {
            this.curMergeGroupDatas = this.hunguCreateData.getCanMergeGroupData();
            this.curFirstDatas = this.hunguCreateData.getGroupCanFirstDatas();
        }
        else {
            this.curMergeGroupDatas = this.hunguCreateData.getAllMergeGroupData();
            this.curFirstDatas = this.hunguCreateData.getGroupAllFirstDatas();
        }

        if (this.curfirstSelectedIndex in this.curFirstDatas) {
            this.curfirstSelectedId = this.curFirstDatas[this.curfirstSelectedIndex];
            let data = this.curMergeGroupDatas[this.curfirstSelectedId];
            if (data[this.cursecondSelectedIndex] == null) {
                //子节点消失
                this.cursecondSelectedIndex = 0;
            }
        }
        else {
            //父节点消失
            this.curfirstSelectedIndex = 0;
            this.cursecondSelectedIndex = 0;
            this.curfirstSelectedId = this.curFirstDatas[this.curfirstSelectedIndex];
        }
    }

    private refreshLeftList() {
        this.hunguGroupList.Count = this.curFirstDatas.length;
        let data = this.curMergeGroupDatas[this.curfirstSelectedId];
        if (data == null) return;

        for (let i = 0, con = this.curFirstDatas.length; i < con; i++) {
            let labelItem = this.hunguGroupList.GetItem(i);
            let isMerge = this.hunguCreateData.isOneQualityMerge(this.curFirstDatas[i]);
            let name = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, this.curFirstDatas[i]);
            let labelText = labelItem.findText('citem/normal/txtName');
            labelText.text = name;
            labelText = labelItem.findText('citem/selected/txtName');
            labelText.text = name;
            let tipmark = labelItem.findObject("citem/tipMark");
            tipmark.SetActive(isMerge);
        }

        //刷新子列表
        let subList = this.hunguGroupList.GetSubList(this.curfirstSelectedIndex);
        subList.Count = data.length;
        if (!subList.onClickItem) {
            subList.onClickItem = delegate(this, this.onClickMergeItem);
        }
        if (!subList.onVirtualItemChange) {
            subList.onVirtualItemChange = delegate(this, this.onVirtualItemChange);
        }
        this.hunguGroupList.Refresh();
        subList.Refresh();
    }

    private onClickMergeItem(index: number) {
        this.cursecondSelectedIndex = index;
        this.updatePanel();
    }

    private onVirtualItemChange(listitem: ListItem): void {
        let index = listitem._index;
        let norName = ElemFinder.findText(listitem.gameObject, "normal/name");
        let sleName = ElemFinder.findText(listitem.gameObject, "selected/name");
        let tipmark = ElemFinder.findObject(listitem.gameObject, "tipMark");
        if (this.curMergeGroupDatas == null) return;
        let data = this.curMergeGroupDatas[this.curfirstSelectedId][index];
        if (data == null)
            return;
        let quality = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, this.curMergeGroupDatas[this.curfirstSelectedId][index].m_ucTargetQuality);
        let part = KeyWord.getDesc(KeyWord.GROUP_HUNGU_EQUIP_PART, this.curMergeGroupDatas[this.curfirstSelectedId][index].m_ucEquipPart);
        let name = quality.replace("魂骨", part);
        if (this.hunguCreateData.isHaveMergeEquip(this.curMergeGroupDatas[this.curfirstSelectedId][index].m_iID)) {
            //绿色
            norName.text = name;
            sleName.text = name;
            tipmark.SetActive(true);
        }
        else {
            norName.text = name;
            sleName.text = name;
            tipmark.SetActive(false);
        }
    }

    private refreshCenterIcon() {
        let centerData = G.DataMgr.hunliData.hunguMergeData.getHunguEquipData(this.curMergeData.m_ucEquipPart, this.curMergeData.m_ucTargetQuality,
            this.curMergeData.m_ucTargetColour, 1, G.DataMgr.heroData.profession);
        let materialData = G.DataMgr.hunliData.hunguMergeData.getHunguEquipData(this.curMergeData.m_ucEquipPart, this.curMergeData.m_ucTargetQuality,
            KeyWord.COLOR_GOLD, 1, G.DataMgr.heroData.profession);

        this.centerIconItem.updateById(centerData.m_iID);
        this.centerIconItem.updateIcon();

        let matercon = this.curMergeData.m_stMaterial.length;
        let cfgs = this.hunguCreateData.getCanAddEquip(this.curMergeData.m_iID);
        for (let i = 0, con = this.mergeFixedList.Count; i < con; i++) {
            if (i < matercon) {
                let cfg = cfgs[i];
                if (cfg == null) {
                    //没有物品
                    this.materialIconItem[i].setHunguEquipIconById(materialData.m_iID);
                    this.textHasAndNeed[i].text = TextFieldUtil.getColorText(uts.format("{0}/{1}", 0, 1), Color.RED);
                    this.arrowLs[i].SetActive(false);
                }
                else {
                    //有物品
                    this.materialIconItem[i].setHunguEquipIcon(cfg);
                    this.textHasAndNeed[i].text = TextFieldUtil.getColorText(uts.format("{0}/{1}", 1, 1), Color.GREEN);
                    this.arrowLs[i].SetActive(true);
                }
                this.lockImgArray[i].SetActive(false);
            }
            else {
                //锁
                this.materialIconItem[i].setIconModelNull();
                this.textHasAndNeed[i].text = "未开启";
                this.lockImgArray[i].SetActive(true);
                this.arrowLs[i].SetActive(false);
            }
            this.materialIconItem[i].updateIconShow();
        }
        this.txtTips.text = uts.format("成功率：{0}%", this.curMergeData.m_iSuccessRate / 100);
    }

    refreshRightInfo() {
        let tipData = this.centerIconItem.getTipData() as ItemTipData;
        this.itemTipBase.updateInfo(tipData);
    }

    mergeDefeatedResponse() {
        this.updatePanel();
        this.playDefeatedEffect();
    }

    mergeSuccendResponse() {
        this.updatePanel();
        this.playSuccendEffect();
    }


    private playSuccendEffect() {
        this.succendEffectNode.SetActive(false);
        this.succendEffectNode.SetActive(true);
        G.TipMgr.addMainFloatTip("合成成功");
    }

    private playDefeatedEffect() {
        this.defeatedEffectNode.SetActive(false);
        this.defeatedEffectNode.SetActive(true);
        G.TipMgr.addMainFloatTip("合成失败");
    }

    private hideEffect() {
        this.succendEffectNode.SetActive(false);
        this.defeatedEffectNode.SetActive(false);
    }
}