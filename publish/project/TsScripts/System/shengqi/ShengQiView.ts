import { UnitCtrlType } from 'System/constants/GameEnum';
import { FabaoData } from 'System/data/FabaoData';
import { SkillData } from 'System/data/SkillData';
import { ThingData } from 'System/data/thing/ThingData';
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from 'System/global';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TipFrom } from 'System/tip/view/TipsView';
import { CommonForm, GameObjectGetSet, TextGetSet, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { List, ListItem } from "System/uilib/List";
import { ListItemCtrl } from 'System/uilib/ListItemCtrl';
import { SkillIconItem } from 'System/uilib/SkillIconItem';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { PropertyListNode } from '../ItemPanels/PropertyItemNode';
import { SpecialCharUtil } from '../utils/SpecialCharUtil';
class ShengQiItem extends ListItemCtrl {
    private needGrey: GameObjectGetSet;
    private fabaoName: TextGetSet;
    private fabaoIcon: UnityEngine.UI.RawImage;
    /**可激活 */
    private active: GameObjectGetSet;
    /**可镶嵌 */
    private arrow: GameObjectGetSet;
    /**已幻化 */
    private use: GameObjectGetSet;
    private imgLock: UnityEngine.GameObject;
    setComponents(go: UnityEngine.GameObject) {
        this.needGrey = new GameObjectGetSet(ElemFinder.findObject(go, 'content'));
        this.fabaoName = new TextGetSet(ElemFinder.findText(go, 'content/txtName'));
        this.fabaoIcon = ElemFinder.findRawImage(go, 'content/icon');
        this.active = new GameObjectGetSet(ElemFinder.findObject(go, 'active'));
        this.arrow = new GameObjectGetSet(ElemFinder.findObject(go, 'arrow'));
        this.use = new GameObjectGetSet(ElemFinder.findObject(go, 'use'));
        this.imgLock = ElemFinder.findObject(go, "imgLock");
    }

    update(id: number) {
        let fabaoData = G.DataMgr.fabaoData;
        let fabaoInfo: Protocol.CSFaBaoInfo = fabaoData.getFabaoData(id);
        let config = fabaoData.getFabaoConfig(id);
        G.ResourceMgr.loadImage(this.fabaoIcon, uts.format('icon/{0}.png', config.m_iIconID));
        if (fabaoData.isActivate(id)) {
            //已激活
            this.needGrey.grey = false;
            this.imgLock.SetActive(false);
            this.arrow.SetActive(fabaoData.canFabaoUp(id));
            this.active.SetActive(false);
            this.use.SetActive(fabaoData.showID == id);
        }
        else {
            //未激活
            this.needGrey.grey = true;
            this.imgLock.SetActive(true);
            this.arrow.SetActive(false);
            this.active.SetActive(fabaoData.canFabaoActiveS(id));
            this.use.SetActive(false);
        }
        this.fabaoName.text = config.m_szName;
    }
}

class ItemAnqiMaterials {
    /**图标 */
    private imgIcon: UnityEngine.UI.RawImage;
    /**数量 */
    private txtNumber: UnityEngine.UI.Text;
    /**加号特效 */
    private effAddMaterials: UnityEngine.GameObject;
    /**完成特效 */
    private flagCheck: GameObjectGetSet;
    //未镶嵌
    private noAdd: GameObjectGetSet;
    private curAnqiId: number;
    private index: number;
    private materialId: number;

    setComponents(go: UnityEngine.GameObject, pos: number) {
        this.index = pos;
        this.imgIcon = ElemFinder.findRawImage(go, "imgIcon");
        this.txtNumber = ElemFinder.findText(go, "txtNumber");
        this.effAddMaterials = ElemFinder.findObject(go, "effAddMaterials");
        this.flagCheck = new GameObjectGetSet(ElemFinder.findObject(go, "flagCheck"));
        this.noAdd = new GameObjectGetSet(ElemFinder.findObject(go, 'noAddEffect'));
        Game.UIClickListener.Get(this.effAddMaterials).onClick = delegate(this, this.onClickAddMaterials);
        Game.UIClickListener.Get(this.imgIcon.gameObject).onClick = delegate(this, this.onClickIcon);
    }


    /**
     * @param anqiId 暗器id
     * @param id 材料id
     * @param isFinish 是否已经完成
     * @param needNum 需要数量
     * @param isInlay 需要镶嵌
     */
    itemUpdate(anqiId: number, id: number, isFinish: boolean, needNum: number, isInlay: boolean) {
        this.curAnqiId = anqiId;
        this.materialId = id;

        let hascon = G.DataMgr.thingData.getThingNum(id, Macros.CONTAINER_TYPE_ROLE_BAG, false)
        //已经完成 亮
        if (isFinish) {
            // this.txtNumber.gameObject.SetActive(false);
            this.effAddMaterials.SetActive(false);
            this.imgIcon.color.a = 1;
            this.flagCheck.SetActive(true);
            this.noAdd.SetActive(false);
            this.txtNumber.text = TextFieldUtil.getColorText(uts.format("{0}/{1}", hascon, needNum), Color.GREY);
        }
        else {
            //没有完成 暗
            // this.txtNumber.gameObject.SetActive(true);
            this.imgIcon.color.a = 100 / 255;
            this.flagCheck.SetActive(false);
            //镶嵌
            if (hascon < needNum) {
                //不可以不加
                this.txtNumber.text = TextFieldUtil.getColorText(uts.format("{0}/{1}", hascon, needNum), Color.RED);
                this.effAddMaterials.SetActive(false);
                this.noAdd.SetActive(true && isInlay);
            }
            else {
                //可以完成加号
                // this.txtNumber.gameObject.SetActive(false);
                this.txtNumber.text = TextFieldUtil.getColorText(uts.format("{0}/{1}", hascon, needNum), Color.GREEN);
                this.effAddMaterials.SetActive(true && isInlay);
                this.noAdd.SetActive(false);
            }
        }
        let data = ThingData.getThingConfig(id);
        G.ResourceMgr.loadIcon(this.imgIcon, data.m_szIconID.toString());
    }

    /**点击加号 */
    onClickAddMaterials() {
        //发送完成的协议TODO
        if (G.DataMgr.fabaoData.isActivate(this.curAnqiId)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFabaoXQRequest(this.curAnqiId, this.index));
        }
        // else {
        //     G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getActiveFabaoRequest(this.curAnqiId, this.index));//携带技能
        // }
    }

    onClickIcon() {
        if (this.materialId != 0) {
            let item = new IconItem();
            item.updateById(this.materialId);
            G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
        }
    }
}

export class ShengQiView extends CommonForm {

    /**大标题的那个战斗力 */
    private titleFight: UnityEngine.UI.Text;
    /**暗器列表 */
    private anqiList: List;
    /**暗器物体item */
    //private itemAnqiList: ShengQiItem[] = [];

    /**材料列表 */
    private materialsList: List;
    private itemMaterialsList: ItemAnqiMaterials[] = [];
    private materialIcon: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;
    private materialIconItem: IconItem;
    private txtMaterialNumber: TextGetSet;
    /**化形按钮 */
    private btnTaxiing: UnityEngine.GameObject;
    private modelRoot: UnityEngine.GameObject;

    private txtAnqiName: UnityEngine.UI.Text;
    private txtAnqiFight: UnityEngine.UI.Text;
    /**属性列表 */
    private itemAttribute: PropertyListNode;
    /**等级 */
    private txtLevel: TextGetSet;
    /**技能图标 */
    private iconSkill: UnityEngine.GameObject;
    private skillItem: SkillIconItem;
    private txtSkillName: UnityEngine.UI.Text;
    /**升级按钮（激活按钮） */
    private btnUpgrade: UnityEngine.GameObject;
    private txtButton: UnityEngine.UI.Text;
    private buttonTip: GameObjectGetSet;
    private txtTip: UnityEngine.UI.Text;
    private isMoreUpgrade: boolean = false;

    /**当前选中的暗器 */
    private curSelectedIndex: number = 0;
    private curSelectesId: number = 0;
    private anqiIdFromIndex: number[] = [];

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.ShengQiView;
    }

    protected initElements(): void {
        this.titleFight = this.elems.getText("titleFight");

        this.anqiList = this.elems.getUIList("anqiList");
        this.anqiList.onVirtualItemChange = delegate(this, this.onUpdateItem);

        this.materialsList = this.elems.getUIList("materialsList");
        this.materialIcon = this.elems.getElement("materialIcon");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.materialIconItem = new IconItem();
        this.materialIconItem.setExhibitionIcon(this.itemIcon_Normal, this.materialIcon);
        this.txtMaterialNumber = new TextGetSet(this.elems.getText("txtMaterialNumber"));
        this.btnTaxiing = this.elems.getElement("btnTaxiing");
        this.modelRoot = this.elems.getElement("modelRoot");

        this.txtAnqiName = this.elems.getText("txtAnqiName");
        this.txtAnqiFight = this.elems.getText("txtAnqiFight");
        let arr = this.elems.getElement("itemAttribute");
        this.itemAttribute = new PropertyListNode();
        this.itemAttribute.setComponents(arr);
        this.txtLevel = new TextGetSet(this.elems.getText("txtLevel"));

        this.iconSkill = this.getElement("iconSkill");
        let skillIcon_Normal = this.elems.getElement('skillIcon_Normal');
        this.skillItem = new SkillIconItem(true);
        this.skillItem.setUsuallyByPrefab(skillIcon_Normal, this.iconSkill.gameObject, true);
        this.skillItem.needShowLv = false;
        this.skillItem.isPreview = true;
        this.skillItem.closeLevelText();
        this.txtSkillName = this.elems.getText("txtSkillName");

        this.btnUpgrade = this.getElement("btnUpgrade");
        this.txtButton = this.elems.getText("txtButton");
        this.txtTip = this.elems.getText("txtTip");
        this.buttonTip = new GameObjectGetSet(this.elems.getElement("buttonTip"));
    }

    protected initListeners(): void {
        this.addClickListener(this.elems.getElement("btnClose"), this.onClickReturn);
        this.addClickListener(this.btnTaxiing, this.onClickTaxiing);
        this.addClickListener(this.btnUpgrade, this.onClickUpgrade);

        this.anqiList.onClickItem = delegate(this, this.onClickAnqiItem);
    }
    public open(openID: number = 0) {
        this.curSelectesId = openID;
        super.open();
    }
    protected onOpen() {
        super.onOpen();
        this.sendOpenPanel();
        this.anqiList.SetSlideAppearRefresh();
    }

    /**刷新面板 */
    public updateView() {
        this.refreshData();

        //左侧暗器列表
        this.refreshAnqiList();

        //材料列表
        this.refreshMaterialsList();

        //模型
        this.refreshModel();

        //幻化按钮
        this.refreshTaxiingButton();

        //名字
        this.refreshAnqiBaseInfoName();

        //属性
        this.refreshAttribute();

        //战斗力
        this.refreshAnqiFight();
        this.refreshTitleFight();

        //技能
        this.refreshSkill();

        //升级按钮
        this.refreshUpgradeButton();
    }

    private onClickReturn() {
        this.close();
    }

    /**化形 */
    private onClickTaxiing() {
        //发送幻化的请求 
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFabaoHHRequest(this.curSelectesId));
        G.AudioMgr.playBtnClickSound();
    }

    /**进阶（激活） */
    private onClickUpgrade() {
        if (this.isMoreUpgrade) {
            //一键镶嵌
            if (G.DataMgr.fabaoData.isActivate(this.curSelectesId)) {
                let severData = G.DataMgr.fabaoData.getFabaoData(this.curSelectesId);
                let jinjiedata = G.DataMgr.fabaoData.getFabaoLevelConfig(this.curSelectesId, severData != null ? severData.m_usLevel : 0);
                for (let i = 0; i < 4; i++) {
                    let has = G.DataMgr.thingData.getThingNum(jinjiedata.m_astXiangQian[i].m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                    if (severData.m_aiXQID[i] == 0 && has >= jinjiedata.m_astXiangQian[i].m_iCount)
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFabaoXQRequest(this.curSelectesId, i));
                }
            }
        }
        else {
            if (!this.isActivate(this.curSelectesId)) {
                //激活
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getActiveFabaoRequest(this.curSelectesId, -1));
            }
            else {
                //升级
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFabaoLevelUpRequest(this.curSelectesId));
            }
        }

    }

    /**暗器list */
    private onClickAnqiItem(index: number) {
        this.anqiList.Selected = index;
        this.curSelectedIndex = index;
        this.curSelectesId = this.anqiIdFromIndex[index];
        this.updateView();
    }

    /**刷新模型 */
    private refreshModel() {
        let data = G.DataMgr.fabaoData.getFabaoConfig(this.curSelectesId);
        G.ResourceMgr.loadModel(this.modelRoot, UnitCtrlType.anqi, data.m_iModelID.toString(), this.sortingOrder, true);
    }

    /**刷新幻化按钮 */
    private refreshTaxiingButton() {
        //已激活 未幻化 有
        if (this.isActivate(this.curSelectesId)) {
            if (G.DataMgr.fabaoData.showID == this.curSelectesId)
                this.btnTaxiing.SetActive(false);
            else
                this.btnTaxiing.SetActive(true);
        }
        else {
            this.btnTaxiing.SetActive(false);
        }
    }

    private refreshAnqiList() {
        //this.onClickAnqiItem(this.curSelectedIndex);
        //找到当前选择的物体对应的index
        let len = this.anqiIdFromIndex.length;
        for (let i = 0; i < len; i++) {
            let id = this.anqiIdFromIndex[i];
            if (this.curSelectesId == id) {
                this.curSelectedIndex = i;
                break;
            }
        }

        if (this.anqiList.Selected != this.curSelectedIndex) {
            this.anqiList.Selected = this.curSelectedIndex;
            this.anqiList.ScrollByAxialRow(this.curSelectedIndex);
        }
        this.anqiList.Refresh();
    }

    /**刷新材料列表 */
    private refreshMaterialsList() {
        let severData = G.DataMgr.fabaoData.getFabaoData(this.curSelectesId);

        if (!this.isActivate(this.curSelectesId)) {
            //未激活 用激活的数据 
            let data = G.DataMgr.fabaoData.getFabaoConfig(this.curSelectesId);
            let matInfo = data.m_stAccessItemList;
            this.materialsList.Count = matInfo.length;
            let con = this.materialsList.Count;
            for (let i = 0; i < con; i++) {
                let ishave = false;
                // if (G.DataMgr.fabaoData.isActivateGather(this.curSelectesId)) {
                //     //有数据
                //     ishave = severData.m_aiActiveConsume[i] != 0;
                // }
                if (this.itemMaterialsList.length <= i) {
                    let item = new ItemAnqiMaterials();
                    item.setComponents(this.materialsList.GetItem(i).gameObject, i);
                    item.itemUpdate(this.curSelectesId, matInfo[i].m_iID, ishave, matInfo[i].m_iNumber, false);
                    this.itemMaterialsList.push(item);
                }
                else {
                    this.itemMaterialsList[i].setComponents(this.materialsList.GetItem(i).gameObject, i);
                    this.itemMaterialsList[i].itemUpdate(this.curSelectesId, matInfo[i].m_iID, ishave, matInfo[i].m_iNumber, false);
                }
            }
            this.materialIcon.SetActive(false);
            this.materialsList.SetActive(true);
            this.txtMaterialNumber.gameObject.SetActive(false);
        }
        else {
            //已经激活 用进阶数据
            let data = G.DataMgr.fabaoData.getFabaoLevelConfig(this.curSelectesId, severData.m_usLevel);
            if (data.m_iLevel == G.DataMgr.fabaoData.anqiMaxLevel) {
                this.materialsList.SetActive(false);
                this.materialIcon.SetActive(false);
            }
            else {
                this.materialsList.SetActive(true);
                this.materialIcon.SetActive(true);
                let matInfo = data.m_astXiangQian;
                this.materialsList.Count = matInfo.length;
                let con = this.materialsList.Count;
                for (let i = 0; i < con; i++) {
                    let ishave = false;
                    //有数据
                    ishave = severData.m_aiXQID[i] != 0;

                    if (this.itemMaterialsList.length <= i) {
                        let item = new ItemAnqiMaterials();
                        item.setComponents(this.materialsList.GetItem(i).gameObject, i);
                        item.itemUpdate(this.curSelectesId, matInfo[i].m_iID, ishave, matInfo[i].m_iCount, true);
                        this.itemMaterialsList.push(item);
                    }
                    else {
                        this.itemMaterialsList[i].setComponents(this.materialsList.GetItem(i).gameObject, i);
                        this.itemMaterialsList[i].itemUpdate(this.curSelectesId, matInfo[i].m_iID, ishave, matInfo[i].m_iCount, true);
                    }

                    this.materialIcon.SetActive(true);
                    this.materialIconItem.updateById(data.m_iConsumableID, data.m_iConsumableNumber);
                    this.materialIconItem.setTipFrom(TipFrom.normal);
                    this.materialIconItem.updateIcon();
                    let has = G.DataMgr.thingData.getThingNum(data.m_iConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                    this.txtMaterialNumber.gameObject.SetActive(true);
                    this.txtMaterialNumber.text = TextFieldUtil.getColorText(uts.format("{0}/{1}", has, data.m_iConsumableNumber),
                        has < data.m_iConsumableNumber ? Color.RED : Color.GREEN);
                }
            }
        }
    }



    /**刷新属性显示 */
    private refreshAttribute() {
        //基础属性
        let baseData = G.DataMgr.fabaoData.getFabaoConfig(this.curSelectesId);
        let severData = G.DataMgr.fabaoData.getFabaoData(this.curSelectesId);
        //进阶属性
        let upgradeData = G.DataMgr.fabaoData.getFabaoLevelConfig(this.curSelectesId, severData != null ? severData.m_usLevel : 0);

        let atts = this.getAttList();
        this.itemAttribute.refreshPropertyForDatas(atts);
    }

    private getAttList(): GameConfig.BeautyPropAtt[] {
        //基础属性
        let baseData = G.DataMgr.fabaoData.getFabaoConfig(this.curSelectesId);
        let severData = G.DataMgr.fabaoData.getFabaoData(this.curSelectesId);

        //进阶属性
        let upgradeData = G.DataMgr.fabaoData.getFabaoLevelConfig(this.curSelectesId, severData != null ? severData.m_usLevel : 0);

        let basicProps = baseData.m_astAddedProp;
        let addProps = upgradeData.m_astAddedProp;

        let propDic: { [id: number]: number } = {};
        let attsList: GameConfig.BeautyPropAtt[] = [];
        for (let data of basicProps) {
            if (!propDic[data.m_ucPropName]) {
                propDic[data.m_ucPropName] = 0;
            }
            propDic[data.m_ucPropName] += data.m_iPropValue;
        }

        if (severData != null) {
            //加宝石属性
            for (let data of severData.m_aiXQID) {
                if (data != 0) {
                    let config = G.DataMgr.fabaoData.getFabaoXQData(data);
                    for (let i = 0; i < config.m_astAddedProp.length; i++) {
                        propDic[config.m_astAddedProp[i].m_ucPropName] += config.m_astAddedProp[i].m_iPropValue;
                    }
                }
            }
            //加进阶属性
            for (let data of addProps) {
                propDic[data.m_ucPropName] += data.m_iPropValue;
            }
        }

        //属性转换类型
        for (let data of basicProps) {
            let att: GameConfig.BeautyPropAtt = {
                "m_ucPropId": data.m_ucPropName,
                "m_iPropValue": propDic[data.m_ucPropName]
            };
            attsList.push(att);
        }
        return attsList;
    }

    private getAttListFormEquip(): GameConfig.EquipPropAtt[] {
        //基础属性
        let baseData = G.DataMgr.fabaoData.getFabaoConfig(this.curSelectesId);
        let severData = G.DataMgr.fabaoData.getFabaoData(this.curSelectesId);
        //进阶属性
        let upgradeData = G.DataMgr.fabaoData.getFabaoLevelConfig(this.curSelectesId, severData != null ? severData.m_usLevel : 0);
        let basicProps = baseData.m_astAddedProp;
        let addProps = upgradeData.m_astAddedProp;

        let propIndex: number[] = [];
        let propDic: { [id: number]: number } = {};
        let attsList: GameConfig.EquipPropAtt[] = [];
        for (let data of basicProps) {
            if (!propDic[data.m_ucPropName]) {
                propDic[data.m_ucPropName] = 0;
                propIndex.push(data.m_ucPropName);
            }
            propDic[data.m_ucPropName] += data.m_iPropValue;
        }
        if (severData != null) {
            //加宝石属性
            for (let data of severData.m_aiXQID) {
                if (data != 0) {
                    let config = G.DataMgr.fabaoData.getFabaoXQData(data);
                    for (let i = 0; i < config.m_astAddedProp.length; i++) {
                        propDic[config.m_astAddedProp[i].m_ucPropName] += config.m_astAddedProp[i].m_iPropValue;
                    }
                }
            }
            //加进阶属性
            for (let data of addProps) {
                propDic[data.m_ucPropName] += data.m_iPropValue;
            }
        }

        //属性转换类型
        for (let data of basicProps) {
            let att: GameConfig.EquipPropAtt = {
                "m_ucPropId": data.m_ucPropName,
                "m_ucPropValue": propDic[data.m_ucPropName]
            };
            attsList.push(att);
        }
        return attsList;
    }

    /**刷新技能图标 */
    private refreshSkill() {
        let severData = G.DataMgr.fabaoData.getFabaoData(this.curSelectesId);
        let skilllevel = severData != null ? severData.m_usLevel : 1;
        skilllevel = Math.max(skilllevel, 1);
        //进阶属性
        let upgradeData = G.DataMgr.fabaoData.getFabaoLevelConfig(this.curSelectesId, skilllevel);

        // let anqiData = G.DataMgr.fabaoData;
        let skill = upgradeData.m_iSkillID;// anqiData.getSkillData(this.curSelectedIndex + 1);
        let isgray = true;
        if (severData != null) {
            isgray = false;
        }
        // this.skillItem.needGrey = isgray;
        this.skillItem.updateBySkillID(skill);
        this.skillItem.updateIcon();
        this.skillItem.setIconGrey(isgray);
        let skilldata = SkillData.getSkillConfig(skill);
        this.txtSkillName.text = skilldata.m_szSkillName;
    }

    /**总战力 */
    private refreshTitleFight() {
        //this.titleFight.text = G.DataMgr.heroData.fight.toString();
        this.titleFight.text = G.DataMgr.fabaoData.getAllFaBaoFighting().toString();

    }

    /**暗器战斗力 */
    private refreshAnqiFight() {
        // let atts = this.getAttListFormEquip();
        // let fight = FightingStrengthUtil.calStrength(atts);
        // this.txtAnqiFight.text = uts.format("战斗力 {0}", fight.toString());
        this.txtAnqiFight.text = uts.format("战斗力 {0}", G.DataMgr.fabaoData.getFaBaoFighting(this.curSelectesId));

    }

    /**暗器基本信息 名字 */
    private refreshAnqiBaseInfoName() {
        let data = G.DataMgr.fabaoData.getFabaoConfig(this.curSelectesId);
        let severData = G.DataMgr.fabaoData.getFabaoData(this.curSelectesId);
        this.txtAnqiName.text = data.m_szName;
        this.txtLevel.text = SpecialCharUtil.getAnqiLevel(severData == null ? 0 : severData.m_usLevel);
        this.txtLevel.gameObject.SetActive(this.isActivate(this.curSelectesId));
    }

    /**刷新激活按钮 */
    private refreshUpgradeButton() {
        let severData = G.DataMgr.fabaoData.getFabaoData(this.curSelectesId);
        let data = G.DataMgr.fabaoData.getFabaoConfig(this.curSelectesId);
        let jinjiedata = G.DataMgr.fabaoData.getFabaoLevelConfig(this.curSelectesId, severData != null ? severData.m_usLevel : 0);

        if (!this.isActivate(this.curSelectesId)) {
            //未激活显示  材料够就自动激活
            let isCan = true;
            for (let i = 0, count = data.m_stAccessItemList.length; i < count; i++) {
                let itemdata = data.m_stAccessItemList[i];
                if (itemdata.m_iID == 0) continue;
                let has = G.DataMgr.thingData.getThingNum(itemdata.m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                if (has < itemdata.m_iNumber)
                    isCan = false;
            }
            this.btnUpgrade.SetActive(isCan);
            this.txtButton.text = "激活";
            this.buttonTip.SetActive(!isCan);
            this.txtTip.text = "未激活";
        }
        else {
            //已激活显示 升阶
            this.txtButton.text = "进阶";
            if (jinjiedata.m_iLevel == G.DataMgr.fabaoData.anqiMaxLevel) {
                //满级
                this.btnUpgrade.SetActive(false);
                this.buttonTip.SetActive(true);
                this.txtTip.text = "已满级";
            }
            else {
                //收集中 都满足 激活
                //一键镶嵌 限制
                this.isMoreUpgrade = false;
                for (let i = 0; i < jinjiedata.m_astXiangQian.length; i++) {
                    let no = severData.m_aiXQID[i] == 0;
                    if (no) {
                        //是否可以镶嵌
                        let has = G.DataMgr.thingData.getThingNum(jinjiedata.m_astXiangQian[i].m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                        if (has >= jinjiedata.m_astXiangQian[i].m_iCount) {
                            this.isMoreUpgrade = true;
                            break;
                        }
                    }
                }
                //全部镶嵌判断
                let isAllInset = true;
                for (let i = 0; i < jinjiedata.m_astXiangQian.length; i++) {
                    let no = severData.m_aiXQID[i] == 0;
                    if (no) {
                        isAllInset = false;
                    }
                }

                if (this.isMoreUpgrade) {
                    this.txtButton.text = "一键镶嵌";
                    this.btnUpgrade.SetActive(this.isMoreUpgrade);
                    this.buttonTip.SetActive(!this.isMoreUpgrade);
                }
                else if (isAllInset) {
                    let has = G.DataMgr.thingData.getThingNum(jinjiedata.m_iConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                    let isshowbutton = has >= jinjiedata.m_iConsumableNumber;
                    this.btnUpgrade.SetActive(isshowbutton);
                    this.buttonTip.SetActive(!isshowbutton);
                }
                else {
                    this.btnUpgrade.SetActive(false);
                    this.buttonTip.SetActive(true);
                }
                this.txtTip.text = "升级需要点五类材料";
            }

        }
    }

    private refreshData() {
        let fabaoData: FabaoData = G.DataMgr.fabaoData;
        let activeList = [];
        let inactiveList = [];
        let arr = fabaoData.fabaoIdArr;
        let activecounter = 0;
        for (let id of arr) {
            if (fabaoData.isActivate(id)) {
                //激活
                if (fabaoData.showID == id) {
                    activeList.splice(0, 0, id);
                }
                else {
                    activeList.push(id);
                }
            }
            else {
                //没激活
                if (fabaoData.canFabaoActiveS(id)) {
                    inactiveList.splice(activecounter, 0, id);
                    activecounter++;
                }
                else {
                    inactiveList.push(id);
                }
            }
        }
        this.anqiIdFromIndex = activeList.concat(inactiveList);
        if (this.curSelectesId <= 0) {
            this.curSelectesId = this.anqiIdFromIndex[0];
            this.curSelectedIndex = 0;
        }

        let index = 0;
        this.anqiList.Count = this.anqiIdFromIndex.length;
        for (let i = 0; i < this.anqiIdFromIndex.length; i++) {
            if (this.anqiIdFromIndex[i] == this.curSelectesId) {
                index = i;
                break;
            }
        }
    }

    private onUpdateItem(item: ListItem) {
        //取到id就可以了
        let index = item._index;
        let data = this.anqiIdFromIndex[index];
        let uiitem = item.data.uiitem as ShengQiItem;
        if (!uiitem) {
            uiitem = new ShengQiItem();
            uiitem.setComponents(item.gameObject);
            item.data.uiitem = uiitem;
        }
        uiitem.update(data);
    }

    private isActivate(id: number): boolean {
        let anqiData = G.DataMgr.fabaoData;
        let data: Protocol.CSFaBaoInfo = anqiData.getFabaoData(id);
        if (data == null) {
            return false;
        }
        else {
            return data.m_ucHaveActive == 0 ? false : true;
        }
    }

    private sendOpenPanel() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFabaoPanelRequest());
    }
}
