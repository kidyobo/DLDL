import { Constants } from 'System/constants/Constants';
import { KeyWord } from 'System/constants/KeyWord';
import { ThingData } from 'System/data/thing/ThingData';
import { ThingItemData } from "System/data/thing/ThingItemData";
import { UIPathData } from 'System/data/UIPathData';
import { MaterialItemData } from 'System/data/vo/MaterialItemData';
import { ZhufuData } from 'System/data/ZhufuData';
import { Global as G } from "System/global";
import { HeroAttItemData } from 'System/hero/HeroAttItemData';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TipFrom } from 'System/tip/view/TipsView';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { GroupList } from 'System/uilib/GroupList';
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { ElemFinder } from 'System/uilib/UiUtility';
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar';
import { Color } from 'System/utils/ColorUtil';
import { DataFormatter } from 'System/utils/DataFormatter';
import { EquipUtils } from 'System/utils/EquipUtils';
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil';
import { PropUtil } from 'System/utils/PropUtil';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { UIUtils } from 'System/utils/UIUtils';
import { TabSubFormCommon } from '../../uilib/TabFormCommom';

enum HuanhuaShizhuanGroupTab {
    special = 1,
    taozhuan = 2,
    saiji = 0,
}
class PropItem {
    private txtName: UnityEngine.UI.Text;
    private txtValue: UnityEngine.UI.Text;

    constructor(name: UnityEngine.UI.Text, value: UnityEngine.UI.Text) {
        this.txtName = name;
        this.txtValue = value;
    }

    update(nameId: number, value: number) {
        this.txtName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, nameId);
        this.txtValue.text = value.toString();
    }
}
/**右侧的那个套装界面 */
class RightSuitPanel {

    private propList: List;
    private txtTitle: UnityEngine.UI.Text;
    private txtTime: UnityEngine.UI.Text;
    private imgEquip: UnityEngine.GameObject;
    private txtNumber: UnityEngine.UI.Text;
    private btnFoster: UnityEngine.GameObject;

    private iconItem: IconItem;
    private materialItemData: MaterialItemData = new MaterialItemData();
    private propItems: PropItem[] = [];

    protected curSelectDressInfo: GameConfig.DressImageConfigM;


    setCompontes(panel: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
        this.propList = ElemFinder.getUIList(ElemFinder.findObject(panel, "prop/list"));
        this.txtTitle = ElemFinder.findText(panel, "time/txtTitle");
        this.txtTime = ElemFinder.findText(panel, "time/txtTime");
        this.imgEquip = ElemFinder.findObject(panel, "foster/imgEquip");
        this.txtNumber = ElemFinder.findText(panel, "foster/imgEquip/txtNumber");
        this.btnFoster = ElemFinder.findObject(panel, "foster/btnFoster");

        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(prefab, this.imgEquip);
        this.iconItem.setTipFrom(TipFrom.material);

        Game.UIClickListener.Get(this.btnFoster).onClick = delegate(this, this.onClickPyBt);
    }

    updateView(dressInfo: GameConfig.DressImageConfigM) {
        this.curSelectDressInfo = dressInfo;
        //属性刷新
        let props = dressInfo.m_astProp;
        let count = props.length;
        this.propList.Count = count;
        for (let i = 0; i < count; i++) {
            let goItem = this.propList.GetItem(i);
            let name = ElemFinder.findText(goItem.gameObject, "name");
            let value = ElemFinder.findText(goItem.gameObject, "value");
            let item = new PropItem(name, value);
            item.update(props[i].m_ucPropId, props[i].m_ucPropValue)
        }

        //时间
        let heroInfo = G.DataMgr.heroData;
        let heroDressInfo = heroInfo.dressList;
        let currModeId: number = (dressInfo.m_stModel.length > 0 && dressInfo.m_stModel[0].m_iID > 0 ? dressInfo.m_uiImageId : 0);
        if (currModeId == 0) {
            this.txtTitle.text = TextFieldUtil.getColorText("(已获得)", Color.ORANGE);
            this.txtTime.text = "永久";
            return;
        }

        //时装 激活就是永久的
        if (heroInfo.getOneDressIsActive(dressInfo.m_uiImageId)) {
            this.txtTitle.text = TextFieldUtil.getColorText("(已获得)", Color.ORANGE);
            this.txtTime.text = "永久";
        }
        else {
            this.txtTitle.text = TextFieldUtil.getColorText("(未获得)", Color.GREY);
            this.txtTime.text = dressInfo.m_szSpecDesc;
        }
    }

    /**点击培养按钮*/
    protected onClickPyBt(): void {
        if (this.materialItemData.has < this.materialItemData.need) {
            G.TipMgr.addMainFloatTip('您的培养材料不足');
        }
        else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHuanHuaPyRequest(Macros.IMAGE_TRAIN_DRESS, 0, this.curSelectDressInfo.m_uiImageId));
        }
    }
}

/**
* 幻化系统ITEM
* @author jesse
*
*/
export class HuanHuaItem {

    private itemName: string;
    private textColor: number = 0;
    /**list名字*/
    private nameText: UnityEngine.UI.Text;
    private select: UnityEngine.GameObject;
    private selectNameText: UnityEngine.UI.Text;
    /**培养图标*/
    private mcPy: UnityEngine.GameObject = null;
    private canPy: boolean = false;
    private isHuaXingIcon: UnityEngine.GameObject;
    private hasGet: boolean = false;
    //private getBack: UnityEngine.GameObject;
    private noGetBack: UnityEngine.GameObject;
    private isHuaXingZhong: boolean = false;
    private isLock: boolean = false;

    setItem(go: UnityEngine.GameObject) {
        this.nameText = ElemFinder.findText(go, 'name');
        this.select = ElemFinder.findObject(go, 'select');
        this.selectNameText = ElemFinder.findText(go, 'select/name');
        this.mcPy = ElemFinder.findObject(go, 'peiyang');
        this.isHuaXingIcon = ElemFinder.findObject(go, 'isget');
        this.noGetBack = ElemFinder.findObject(go, 'lock');
    }

    updateById(id: number) {
        this.isHuaXingZhong = false;
        this.hasGet = false;
        let zhufuData: ZhufuData = G.DataMgr.zhufuData;
        if (id > 10000) {
            let cfg: GameConfig.ZhuFuImageConfigM = zhufuData.getImageConfig(id);
            this.itemName = cfg.m_szModelName;
            this.canPy = G.DataMgr.thingData.checkThingIDForZhufu(cfg.m_iZhuFuID, id);
            let zhufuInfo: Protocol.HeroSubDressOneImage = zhufuData.getTimeItem(cfg.m_iZhuFuID, id);
            if (zhufuData.isActive(cfg.m_iZhuFuID, id)) {
                this.hasGet = true;
                if (zhufuData.isDress(cfg.m_iZhuFuID, id)) {
                    this.isHuaXingZhong = true;
                }
            }
            let current: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            if (zhufuInfo != null) {
                if (zhufuInfo.m_uiTimeOut != 0 && zhufuInfo.m_uiTimeOut <= current) {
                    this.hasGet = false;
                }
            }
        }
    }


    updateByCfg(cfg: GameConfig.ZhuFuConfigM) {
        this.isHuaXingZhong = false;
        this.hasGet = false;
        let zhufuData: ZhufuData = G.DataMgr.zhufuData;
        this.canPy = false;
        this.itemName = cfg.m_szName;
        if (zhufuData.isActive(cfg.m_ucType, cfg.m_iID)) {
            this.hasGet = true;
            if (zhufuData.isDress(cfg.m_ucType, cfg.m_iID)) {
                this.isHuaXingZhong = true;
            }
        }
    }


    updateByDressImageCfg(cfg: GameConfig.DressImageConfigM) {
        let zhufuData = G.DataMgr.zhufuData;
        this.canPy = false;
        this.isHuaXingZhong = false;
        this.hasGet = false;
        let imgId = cfg.m_stModel.length > 0 && cfg.m_stModel[0].m_iID > 0 ? cfg.m_uiImageId : 0;
        this.itemName = cfg.m_szModelName;
        if (imgId == 0) {
            this.hasGet = true;
        }
        else {
            this.hasGet = false;
        }
        let dressInfo: Protocol.DressOneImageInfo = EquipUtils.getDressInfo(imgId);
        if (dressInfo != null) {
            let curTime: number = G.SyncTime.getCurrentTime() / 1000;
            if (dressInfo.m_uiTimeOut == 0 || dressInfo.m_uiTimeOut > curTime) {
                this.hasGet = true;
            } else {
                this.hasGet = false;
            }
        }
        if (G.DataMgr.heroData.dressList.m_uiImageID == imgId) {
            this.isHuaXingZhong = true;
        }
        else {
            this.isHuaXingZhong = false;
        }
    }
    /**
     * 这个羽翼在用,能调这个方法代表有数据,已获得
     * @param data
     */
    updateByThingItemData(data: ThingItemData) {
        this.isHuaXingZhong = false;
        this.hasGet = true;
        this.canPy = false;
        this.itemName = data.config.m_szName;
        let data1: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(KeyWord.HERO_SUB_TYPE_YUYI);
        if ((data1 && data1.m_uiShowID == 0) && (G.DataMgr.equipStrengthenData.getWingModelIdByWingEquip(G.DataMgr.heroData.avatarList.m_uiWingID, G.DataMgr.heroData.avatarList.m_uiWingLevel) > 0)) {
            this.isHuaXingZhong = true;
        }
    }

    updateView(): void {
        this.nameText.text = this.itemName;
        if (this.selectNameText) {
            this.selectNameText.text = this.itemName;
        }
        this.mcPy.SetActive(this.canPy);
        this.isHuaXingIcon.SetActive(this.isHuaXingZhong);
        this.noGetBack.SetActive(!this.hasGet);
    }
}

class WUXiaHuanXingItem {

    private txtName: UnityEngine.UI.Text;
    private txtValue: UnityEngine.UI.Text;
    private txtValueAdd: UnityEngine.UI.Text;

    setCommpents(go: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtValue = ElemFinder.findText(go, "txtValue");
        this.txtValueAdd = ElemFinder.findText(go, "txtValueAdd");
    }

    update(data: GameConfig.EquipPropAtt, nextData: GameConfig.EquipPropAtt) {
        this.txtName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.m_ucPropId);
        this.txtValue.text = TextFieldUtil.getColorText(data.m_ucPropValue + "", Color.PropYellow2);

        if (nextData) {
            this.txtValueAdd.text = "+" + (nextData.m_ucPropValue - data.m_ucPropValue).toString();
        } else {
            this.txtValueAdd.text = "";
        }
    }
}

/**幻化时装面板*/
export class ShiZhuangPanel extends TabSubFormCommon {
    private readonly MaxBtnColorCount = 4;

    private specialList: List;
    private taozhuanList: List;
    private saijiList: List;
    private huanHuaGroup: GroupList;
    private huanHuaGroupSelectedIndex = 0;
    private specialListItemIndex = 0;
    private taozhuanListItemIndex = 0;
    private saijiListItemIndex = 0;
    /**时装类型**/
    private SHIZHUANG_TYPE: number[] = [3, 1, 2];
    /**时装avatarList*/
    private m_avatarList: Protocol.AvatarList = null;
    /**打开面板参数*/
    private showId: number = 0;
    fashionData: GameConfig.DressImageConfigM[] = [];
    /////////////////////////中间面板/////////////////////////////////
    //private huaXingZhongIcon: UnityEngine.GameObject;
    private btn_huanHua: UnityEngine.GameObject;
    private rolePosition: UnityEngine.Transform;
    private roleAvatar: UIRoleAvatar;
    private m_allProps: GameConfig.EquipPropAtt[] = [];
    //////////////////////培养相关//////////////////////////////
    private m_pyPanel: UnityEngine.GameObject;
    m_pyMaterialData: MaterialItemData = new MaterialItemData();
    private pyTimeText: UnityEngine.UI.Text;
    private fashionPanel: UnityEngine.GameObject;
    private btn_py: UnityEngine.GameObject;
    private m_pyTimes: number = 0;
    private fullLevelTxt: UnityEngine.UI.Text;
    ////////////////////右侧属性面板相关/////////////////////////
    private rightPanel: UnityEngine.GameObject;
    private attListData: HeroAttItemData[] = [];
    private attListDic: { [key: number]: HeroAttItemData };
    private getCondition: UnityEngine.UI.Text;
    private getConditionTitle: UnityEngine.UI.Text;
    /////////////////////////其他///////////////////////////////
    private m_pyMaterialIconItem: IconItem;
    private max_propNum: number = 7;

    private fightText: UnityEngine.UI.Text;
    private propParent: UnityEngine.GameObject;
    private rotateArea: UnityEngine.GameObject;
    private isFirstOpen: boolean = true;

    /**时装强化*/
    private btnGrid: UnityEngine.GameObject;
    private atals: Game.UGUIAltas;
    private imgBtnColors: UnityEngine.UI.Image[] = [];
    private txtBtnLabel: UnityEngine.UI.Text[] = [];
    private dressID: number = 0;
    private colorIndex: number = 0;
    private shizhuangTipMark: UnityEngine.GameObject;
    private feishengTipMark: UnityEngine.GameObject;

    private fightCount: number = 0;
    private readonly MaxLevel = 5;
    cfg: GameConfig.DressImageConfigM;

    private toggleGroup: UnityEngine.UI.ActiveToggleGroup;
    private pyPanel: UnityEngine.GameObject;
    private fsPanel: UnityEngine.GameObject;
    private wuXiaHuanXingItem: WUXiaHuanXingItem[] = [];
    private propList: List;
    private iconItem: IconItem;
    private icon: UnityEngine.GameObject;
    private itemicon_Normal: UnityEngine.GameObject;
    private materialItemData: MaterialItemData = new MaterialItemData();
    private btnUp: UnityEngine.GameObject;

    private rightPanelSuit: UnityEngine.GameObject;
    private rightPanelSuitInfo: RightSuitPanel;

    private btnLeft: UnityEngine.GameObject;
    private btnRight: UnityEngine.GameObject;

    private txtLimit: UnityEngine.UI.Text;
    private txturrentLevel: UnityEngine.UI.Text;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_DRESS);
    }

    protected resPath(): string {
        return UIPathData.ShiZhuangPanel;
    }
    protected initElements() {
        this.huanHuaGroup = ElemFinder.getUIGroupList(this.elems.getElement('huanhuaGroup'));
        this.itemicon_Normal = this.elems.getElement("itemIcon_Normal");
        //中间面板
        this.btn_huanHua = this.elems.getElement('btn_huanhua');
        //this.huaXingZhongIcon = this.elems.getElement('mcUse');
        this.rolePosition = this.elems.getTransform("rolePosition");
        //右侧面板
        this.rightPanel = this.elems.getElement("rightPanel");
        this.getCondition = this.elems.getText('condition');
        this.getConditionTitle = this.elems.getText('achieveTitle');
        //培养面板
        this.m_pyPanel = this.elems.getElement("peiyangPanel");
        this.btn_py = this.m_pyPanel.transform.Find("btpy").gameObject;
        this.pyTimeText = ElemFinder.findText(this.m_pyPanel, "times");
        this.initHuanHuaGroup();
        this.m_pyMaterialIconItem = new IconItem();
        this.m_pyMaterialIconItem.setUsualIconByPrefab(this.itemicon_Normal, this.elems.getElement('pyIcon'));
        this.m_pyMaterialIconItem.setTipFrom(TipFrom.material);
        this.fightText = this.elems.getText('fightText');
        this.propParent = this.elems.getElement('prop');
        this.rotateArea = this.elems.getElement('rotateArea');

        this.fullLevelTxt = this.elems.getText('fullLevelTxt');

        this.toggleGroup = this.elems.getToggleGroup("toggleGroup");
        this.pyPanel = this.elems.getElement("pyPanel");
        this.fsPanel = this.elems.getElement("fsPanel");
        this.propList = this.elems.getUIList("propList");
        this.itemicon_Normal = this.elems.getElement("itemIcon_Normal");
        this.icon = this.elems.getElement("icon");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemicon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);
        this.btnUp = this.elems.getElement("btnUp");

        this.atals = this.elems.getElement("atals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.btnGrid = this.elems.getElement("btnGrid");
        for (let i = 0; i < this.MaxBtnColorCount; i++) {
            let item = ElemFinder.findObject(this.btnGrid, "btnType" + i);
            let img = ElemFinder.findImage(item, "img");
            this.imgBtnColors.push(img);

            let txt = ElemFinder.findText(item, "txtLv");
            this.txtBtnLabel.push(txt);
            Game.UIClickListener.Get(img.gameObject).onClick = delegate(this, this.onClickColorBtn, i);
        }

        this.shizhuangTipMark = this.elems.getElement("shizhuangTipMark");
        this.feishengTipMark = this.elems.getElement("feishengTipMark");


        this.rightPanelSuit = this.elems.getElement("rightPanelSuit");
        this.rightPanelSuitInfo = new RightSuitPanel();
        this.rightPanelSuitInfo.setCompontes(this.rightPanelSuit, this.itemicon_Normal);

        this.btnLeft = this.elems.getElement("btnLeft");
        this.btnRight = this.elems.getElement("btnRight");

        this.txtLimit = this.elems.getText('txtLimit');
        this.txturrentLevel = this.elems.getText("txturrentLevel");
    }

    protected initListeners() {
        this.addClickListener(this.btn_huanHua, this.onClickSZHuanHuaBt);
        this.addClickListener(this.btn_py, this.onClickPyBt);
        this.addListClickListener(this.specialList, this.onClickFashionList);
        this.addListClickListener(this.taozhuanList, this.onClickTaozhuanList);
        this.addListClickListener(this.saijiList, this.onClickSaijiList);
        this.addListClickListener(this.huanHuaGroup, this.onGroupListChange);
        Game.UIDragListener.Get(this.rotateArea).onDrag = delegate(this, this.onDrag);
        this.addToggleGroupListener(this.toggleGroup, this.onToggleClick);
        this.addClickListener(this.btnUp, this.onClickUp);

        this.addClickListener(this.btnLeft, this.onClickLeft);
        this.addClickListener(this.btnRight, this.onClickRight);
    }

    open(showId: number = 0) {
        this.showId = showId;
        super.open();
    }


    protected onOpen() {
        this.addTimer("1", 1000, 0, this.onTimer);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSzListRequest());

        //刷新左侧列表红点
        let heroData = G.DataMgr.heroData;
        this.fashionData = ThingData.getDressImageDataGroupWithType(heroData.profession, heroData.gender, this.SHIZHUANG_TYPE[1]);
        this.updateSpecialSubTipMark(this.fashionData, 1);
        this.fashionData = ThingData.getDressImageDataGroupWithType(heroData.profession, heroData.gender, this.SHIZHUANG_TYPE[0]);
        this.updateSpecialSubTipMark(this.fashionData, 0);

    }

    protected onClose() {
        if (this.roleAvatar != null) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
        this.isFirstOpen = true;
    }

    private onToggleClick(index: number) {
        this.toggleGroup.Selected = index;
        this.pyPanel.SetActive(index == 0);
        this.fsPanel.SetActive(index == 1);

        if (index == 1) {
            //默认选中第一个颜色
            this.onClickColorBtn(0);
        }
    }

    /**
     * 点击颜色按钮
     * @param index
     */
    private onClickColorBtn(index: number) {
        this.colorIndex = index;
        this.updatePorpList();

        let hasActive = G.DataMgr.heroData.getOneDressIsActive(this.dressID);
        let hasStrengthLv = G.DataMgr.heroData.getOneDressLv(this.dressID);
        let dressImageCfg = ThingData.getDressImageConfig(this.dressID);
        let modelData = dressImageCfg.m_stModel;

        this.txtLimit.text = "";

        if (modelData[index] == null) return;

        if (hasStrengthLv < modelData[index].m_iGrade) {
            this.txtLimit.text = modelData[index].m_iGrade + "阶开启"
        }
    }

    private onClickUp() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShiZhuangQHRequest(Macros.DRESS_STRENG, this.dressID));
    }

    /**
     * 更新飞升时装的按钮状态
     * @param dressId
     * @param canQH 是否能强化
     */
    updateBtnColorStatus(dressId: number, canQH: boolean) {
        this.btnGrid.SetActive(canQH);
        if (!canQH) {
            return;
        }

        let hasActive = G.DataMgr.heroData.getOneDressIsActive(dressId);
        let hasStrengthLv = G.DataMgr.heroData.getOneDressLv(dressId);
        let dressImageCfg = ThingData.getDressImageConfig(dressId);
        let modelData = dressImageCfg.m_stModel;
        for (let i = 0; i < this.MaxBtnColorCount; i++) {
            this.imgBtnColors[i].sprite = this.atals.Get(modelData[i].m_iColor + "");
            let str = "";
            if (hasStrengthLv < modelData[i].m_iGrade) {
                //str += DataFormatter.toHanNumStr(modelData[i].m_iGrade) + "阶" + "\n开启";
                str += modelData[i].m_iGrade + "阶";
            }
            this.txturrentLevel.text = uts.format("当前阶数：{0}阶", hasStrengthLv);
            this.txtBtnLabel[i].text = str;
        }

        this.feishengTipMark.SetActive(TipMarkUtil.oneShiZhuangCanQH(dressId));
    }

    private onDrag() {
        //滑动屏幕人物旋转  
        if (this.roleAvatar != null) {
            let delta = Game.UIDragListener.eventData.delta;
            let roatespeed: number = 0.6;
            this.roleAvatar.m_bodyMesh.setRotation(0, -roatespeed * delta.x + this.roleAvatar.m_bodyMesh.rotationY, 0);
        }

    }


    private initHuanHuaGroup() {
        G.DataMgr.zhufuData
        this.huanHuaGroup.Count = 3;
        let names: string[] = ["赛季时装", "特殊时装", "普通时装"];
        for (let i = 0; i < 3; i++) {
            let obj = this.huanHuaGroup.GetItem(i);
            obj.gameObject.SetActive(true);
            let normalText = obj.findText("citem/normal/Textnormal");
            let selectedtext = obj.findText("citem/selected/Textselected");
            normalText.text = names[i];
            selectedtext.text = names[i];
        }
        this.specialList = this.huanHuaGroup.GetSubList(1);
        this.taozhuanList = this.huanHuaGroup.GetSubList(2);
        this.saijiList = this.huanHuaGroup.GetSubList(0);

        let heroData = G.DataMgr.heroData;
        this.fashionData = ThingData.getDressImageDataGroupWithType(heroData.profession, heroData.gender, this.SHIZHUANG_TYPE[1]);
        this.specialList.Count = this.fashionData.length;

        this.fashionData = ThingData.getDressImageDataGroupWithType(heroData.profession, heroData.gender, this.SHIZHUANG_TYPE[2]);
        this.taozhuanList.Count = this.fashionData.length;

        this.fashionData = ThingData.getDressImageDataGroupWithType(heroData.profession, heroData.gender, this.SHIZHUANG_TYPE[0]);
        this.saijiList.Count = this.fashionData.length;
    }


    updateSpecialSubTipMark(fashionData: GameConfig.DressImageConfigM[], index: number = -1) {
        if (index == HuanhuaShizhuanGroupTab.saiji) {
            this.saijiList = this.huanHuaGroup.GetSubList(0);
            let istipmark = false;
            for (let i = 0; i < this.saijiList.Count; i++) {
                let item = this.saijiList.GetItem(i).gameObject;
                let subTip = ElemFinder.findObject(item, "peiyang");
                let cfg = fashionData[i];
                let spaceTip = (TipMarkUtil.oneSpecialCanQH(cfg) || TipMarkUtil.oneShiZhuangCanQH(cfg.m_uiImageId));
                let saijiTip = EquipUtils.canOnceSaijiDressActive(cfg.m_uiImageId);
                istipmark = spaceTip || saijiTip;
                subTip.SetActive(istipmark);
                this.shizhuangTipMark.SetActive(TipMarkUtil.oneSpecialCanQH(cfg));
            }
            let tipmark = ElemFinder.findObject(this.huanHuaGroup.GetItem(0).gameObject, "citem/tipMark");
            tipmark.SetActive(istipmark);
        }
        else if (index == HuanhuaShizhuanGroupTab.special) {
            this.specialList = this.huanHuaGroup.GetSubList(1);
            let istipmark = false;
            for (let i = 0; i < this.specialList.Count; i++) {
                let item = this.specialList.GetItem(i).gameObject;
                let subTip = ElemFinder.findObject(item, "peiyang");
                let cfg = fashionData[i];
                let spaceTip = (TipMarkUtil.oneSpecialCanQH(cfg) || TipMarkUtil.oneShiZhuangCanQH(cfg.m_uiImageId));
                subTip.SetActive(spaceTip);
                this.shizhuangTipMark.SetActive(TipMarkUtil.oneSpecialCanQH(cfg));
                if (spaceTip)
                    istipmark = true;
            }
            let tipmark = ElemFinder.findObject(this.huanHuaGroup.GetItem(1).gameObject, "citem/tipMark");
            tipmark.SetActive(istipmark);
        }
    }




    private onGroupListChange(index: number) {
        this.huanHuaGroupSelectedIndex = index;
        let heroData = G.DataMgr.heroData;
        this.fashionData = ThingData.getDressImageDataGroupWithType(heroData.profession, heroData.gender, this.SHIZHUANG_TYPE[this.huanHuaGroupSelectedIndex]);
        this.fashionData.sort(this.fashionCompare);
        this.updateLeftPanel();
        if (this.fashionData.length == 0)
            return;

        //特殊时装的才有
        if (index == 1) {
            //特殊时装
            this.rightPanel.SetActive(true);
            this.rightPanelSuit.SetActive(false);
            this.updateSpecialSubTipMark(this.fashionData, 1);
        }
        else if (index == 2) {
            //套装时装
            this.rightPanel.SetActive(false);
            this.rightPanelSuit.SetActive(true);
        }
        else if (index == 0) {
            //赛季
            this.rightPanel.SetActive(true);
            this.rightPanelSuit.SetActive(false);
            this.updateSpecialSubTipMark(this.fashionData, 0);
        }
    }

    private fashionCompare(a: GameConfig.DressImageConfigM, b: GameConfig.DressImageConfigM): number {
        let curtime: number = G.SyncTime.getCurrentTime() / 1000;
        let imageid1: number = a.m_stModel.length > 0 && a.m_stModel[0].m_iID > 0 ? a.m_uiImageId : 0;
        let showa: boolean = G.DataMgr.heroData.dressList.m_uiImageID == imageid1;
        let hada: boolean;
        if (imageid1 == 0) {
            hada = true;
        } else {
            let dressinfoa: Protocol.DressOneImageInfo = EquipUtils.getDressInfo(imageid1);
            if (dressinfoa != null) {
                if (dressinfoa.m_uiTimeOut == 0 || dressinfoa.m_uiTimeOut > curtime) {
                    hada = true;
                } else {
                    hada = false;
                }
            }
        }
        let imageid2: number = b.m_stModel.length > 0 && b.m_stModel[0].m_iID > 0 ? b.m_uiImageId : 0;
        let showb: boolean = G.DataMgr.heroData.dressList.m_uiImageID == imageid2;
        let hadb: boolean;
        if (imageid2 == 0) {
            hadb = true;
        } else {
            let dressinfob: Protocol.DressOneImageInfo = EquipUtils.getDressInfo(imageid2);
            if (dressinfob != null) {
                if (dressinfob.m_uiTimeOut == 0 || dressinfob.m_uiTimeOut > curtime || imageid2 == 0) {
                    hadb = true;
                } else {
                    hadb = false;
                }
            }
        }
        if (showa) {
            return -1;
        }
        if (showb) {
            return 1;
        }
        if (a.m_uiImageId >= b.m_uiImageId) {
            if (!hada) {
                return 1;
            }
            else if (hada && !hadb) {
                return -1;
            }
            else if (hada && hadb) {
                return 1;
            }
        }
        else {
            if (!hadb) {
                return -1;
            }
            else if (hadb && !hada) {
                return 1;
            }
            else if (hadb && hada) {
                return -1;
            }
        }
        return 0;
    }

    /**刷新时装面板*/
    updatePanel(imageId: number = 0): void {
        let dressInfo: Protocol.DressImageListInfo = G.DataMgr.heroData.dressList;
        let heroData = G.DataMgr.heroData;
        if (this.showId != 0) {
            //有设置打开选择
            let cfg = ThingData.getDressImageData(heroData.profession, heroData.gender, this.showId);
            let showType: number = cfg == null ? 1 : cfg.m_ucShowType;
            let index: number = this.SHIZHUANG_TYPE.indexOf(showType);
            this.huanHuaGroup.Selected = index;
            this.onGroupListChange(index);
            return;
        }
        else if (imageId != 0) {
            this.showId = imageId;
            let cfg = ThingData.getDressImageData(heroData.profession, heroData.gender, imageId);
            let showType: number = cfg == null ? 1 : cfg.m_ucShowType;
            let index: number = this.SHIZHUANG_TYPE.indexOf(showType);
            this.huanHuaGroup.Selected = index;
            this.onGroupListChange(index);
        }
        else {
            this.huanHuaGroup.Selected = 1;
            this.onGroupListChange(1);
        }
    }

    /**刷新左侧列表显示 */
    private updateLeftPanel() {
        //判断打开时选择哪一个
        let selectedIndex: number = 0;
        let item = new HuanHuaItem();
        if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.special) {
            this.specialList.Count = this.fashionData.length;
            for (let i = 0; i < this.fashionData.length; i++) {
                let obj = this.specialList.GetItem(i).gameObject;
                item.setItem(obj);
                item.updateByDressImageCfg(this.fashionData[i]);
                item.updateView();
            }

            for (let i = 0; i < this.fashionData.length; i++) {
                let cd: GameConfig.DressImageConfigM = this.fashionData[i];
                if (cd.m_uiImageId == this.showId) {
                    selectedIndex = i;
                    break;
                }
            }
            this.specialListItemIndex = selectedIndex;
            this.specialList.Selected = selectedIndex;
            this.updatePorpList();
            this.isFirstOpen = false;
        }
        else if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.saiji) {
            this.saijiList.Count = this.fashionData.length;
            for (let i = 0; i < this.fashionData.length; i++) {
                let obj = this.saijiList.GetItem(i).gameObject;
                item.setItem(obj);
                item.updateByDressImageCfg(this.fashionData[i]);
                item.updateView();
            }

            for (let i = 0; i < this.fashionData.length; i++) {
                let cd: GameConfig.DressImageConfigM = this.fashionData[i];
                if (cd.m_uiImageId == this.showId) {
                    selectedIndex = i;
                    break;
                }
            }
            this.saijiListItemIndex = selectedIndex;
            this.saijiList.Selected = selectedIndex;
            this.updatePorpList();
            this.isFirstOpen = false;
        }
        else if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.taozhuan) {
            this.taozhuanList.Count = this.fashionData.length;
            for (let i = 0; i < this.fashionData.length; i++) {
                let obj = this.taozhuanList.GetItem(i).gameObject;
                item.setItem(obj);
                item.updateByDressImageCfg(this.fashionData[i]);
                item.updateView();
            }

            for (let i = 0; i < this.fashionData.length; i++) {
                let cd: GameConfig.DressImageConfigM = this.fashionData[i];
                if (cd.m_uiImageId == this.showId) {
                    selectedIndex = i;
                    break;
                }
            }
            this.taozhuanListItemIndex = selectedIndex;
            this.taozhuanList.Selected = selectedIndex;
            this.updatePorpList();
            this.isFirstOpen = false;
            this.rightPanelSuitInfo.updateView(this.fashionData[selectedIndex]);
            this.onToggleClick(0);
        }
    }

    private readonly maxShowCount = 8;
    /**点击左切换按钮 */
    private onClickLeft() {
        if (this.fashionData == null) return;
        let len = this.fashionData.length;
        let num = this.maxShowCount - this.huanHuaGroup.Count;

        if (this.huanHuaGroupSelectedIndex == 1) {
            let index = this.specialListItemIndex - 1;
            if (index == -1)
                index = len - 1;
            this.onClickFashionList(index);
            this.specialList.Selected = index;

            if (index + num <= len || index == len - 1)
                this.specialList.ScrollByAxialRow(index);
        }
        else if (this.huanHuaGroupSelectedIndex == 0) {
            let index = this.saijiListItemIndex - 1;
            if (index == -1)
                index = len - 1;
            this.onClickSaijiList(index);
            this.saijiList.Selected = index;

            if (index + num <= len || index == len - 1)
                this.saijiList.ScrollByAxialRow(index);
        }
        else if (this.huanHuaGroupSelectedIndex == 2) {
            let index = this.taozhuanListItemIndex - 1;
            if (index == -1)
                index = len - 1;
            this.onClickTaozhuanList(index);
            this.taozhuanList.Selected = index;

            if (index + num <= len || index == len - 1)
                this.taozhuanList.ScrollByAxialRow(index);

        }
    }

    /**点击右切换按钮 */
    private onClickRight() {
        if (this.fashionData == null) return;
        //页签 总数
        let len = this.fashionData.length;
        //页签最大显示数
        let num = this.maxShowCount - this.huanHuaGroup.Count;
        if (this.huanHuaGroupSelectedIndex == 1) {
            let index = this.specialListItemIndex + 1;
            if (index == len)
                index = 0;
            this.onClickFashionList(index);
            this.specialList.Selected = index;

            if (index + num <= len)
                this.specialList.ScrollByAxialRow(index);
        }
        else if (this.huanHuaGroupSelectedIndex == 0) {
            let index = this.saijiListItemIndex + 1;
            if (index == len)
                index = 0;
            this.onClickSaijiList(index);
            this.saijiList.Selected = index;

            if (index + num <= len)
                this.saijiList.ScrollByAxialRow(index);
        }
        else if (this.huanHuaGroupSelectedIndex == 2) {
            let index = this.taozhuanListItemIndex + 1;
            if (index == len)
                index = 0;
            this.onClickTaozhuanList(index);
            this.taozhuanList.Selected = index;

            if (index + num <= len)
                this.taozhuanList.ScrollByAxialRow(index);
        }
    }


    /**点击时装List*/
    private onClickFashionList(index: number) {
        this.colorIndex = 0;
        this.specialListItemIndex = index;
        this.updatePorpList();
        let data = this.fashionData[index];
        if (data) {
            this.showId = data.m_uiImageId;
        }
       
    }

    /**点击赛季 */
    private onClickSaijiList(index: number) {
        this.colorIndex = 0;
        this.saijiListItemIndex = index;
        this.updatePorpList();
        let data = this.fashionData[index];
        if (data) {
            this.showId = data.m_uiImageId;
        }
        
    }

    /**
     * 点击套装
     * @param index
     */
    private onClickTaozhuanList(index: number) {
        this.colorIndex = 0;
        this.taozhuanListItemIndex = index;
        this.updatePorpList();
        this.rightPanelSuitInfo.updateView(this.fashionData[index]);
        let data = this.fashionData[index];
        if (data) {
            this.showId = data.m_uiImageId;
        }
    }

    /**刷新界面数据*/
    updatePorpList(): void {
        let cfg: GameConfig.DressImageConfigM;
        if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.special) {
            cfg = this.fashionData[this.specialListItemIndex];
        }
        else if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.taozhuan) {
            cfg = this.fashionData[this.taozhuanListItemIndex];
        }
        else if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.saiji) {
            cfg = this.fashionData[this.saijiListItemIndex];
        }
        if (cfg == null) return;

        this.dressID = cfg.m_uiImageId;
        let canStrength = cfg.m_bCanStreng == 1;
        this.cfg = cfg;

        this.updateBtnColorStatus(cfg.m_uiImageId, canStrength);
        let currModeId: number = (cfg.m_stModel.length > 0 && cfg.m_stModel[this.colorIndex].m_iID > 0 ? cfg.m_uiImageId : 0);
        let heroData = G.DataMgr.heroData;
        this.m_pyTimes = 1;
        let dressItem: Protocol.DressOneImageInfo = EquipUtils.getDressInfo(currModeId);
        if (heroData.avatarList.m_uiDressImageID == currModeId) {
            if (heroData.avatarList.m_ucDressColorID == this.colorIndex) {
                //this.huaXingZhongIcon.SetActive(true);
                this.btn_huanHua.SetActive(false);
            } else {
                //this.huaXingZhongIcon.SetActive(false);
                let invisableBt: boolean = (cfg.m_stModel[this.colorIndex] == null) ? false : (heroData.getOneDressLv(currModeId) >= cfg.m_stModel[this.colorIndex].m_iGrade);
                this.btn_huanHua.SetActive(invisableBt);
            }
            this.getConditionTitle.text = "有效期(已获得)";
            this.getCondition.text = Constants.S_YONGJIU;
        }
        else {
            //this.huaXingZhongIcon.SetActive(false);
            this.getConditionTitle.text = "获取条件(未获得)";
            this.getCondition.text = cfg.m_szSpecDesc;
            if (0 == currModeId) {
                this.btn_huanHua.SetActive(true);
                this.getConditionTitle.text = "有效期(已获得)";
                this.getCondition.text = Constants.S_YONGJIU;
            }
            else {
                if (dressItem == null) {
                    this.btn_huanHua.SetActive(false);
                    this.getCondition.text = cfg.m_szSpecDesc;
                }
                else {
                    this.btn_huanHua.SetActive(true);
                    this.getConditionTitle.text = "有效期(已获得)";
                    if (dressItem.m_uiTimeOut == 0) {
                        this.getCondition.text = Constants.S_YONGJIU;
                    }
                    else {
                        let curTime: number = G.SyncTime.getCurrentTime() / 1000;
                        if (dressItem.m_uiTimeOut > curTime) {
                            this.btn_huanHua.SetActive(true);
                        }
                        else {
                            this.btn_huanHua.SetActive(false);
                        }
                    }
                }
            }

            if (cfg.m_bCanStreng) {
                this.btn_huanHua.SetActive(heroData.getOneDressIsActive(currModeId) &&
                    heroData.getOneDressLv(currModeId) >= cfg.m_stModel[this.colorIndex].m_iGrade
                    && (dressItem.m_uiTimeOut == 0 || dressItem.m_uiTimeOut > G.SyncTime.getCurrentTime() / 1000));
            }
        }
        this.onTimer(null);
        if (dressItem != null) {
            this.m_pyTimes += dressItem.m_uiAddNum;
        }
        this.m_allProps = cfg.m_astProp;
        this.updateAttList();
        //时装显示
        this.m_avatarList = uts.deepcopy(heroData.avatarList, this.m_avatarList, true);
        this.m_avatarList.m_uiDressImageID = currModeId;
        this.rolePosition.transform.rotation = UnityEngine.Quaternion.Euler(0, 180, 0);
        if (null == this.roleAvatar) {
            this.roleAvatar = new UIRoleAvatar(this.rolePosition, this.rolePosition);
            this.roleAvatar.setRenderLayer(5);
            this.roleAvatar.hasWing = true;
            this.roleAvatar.m_rebirthMesh.setRotation(20, 0, 0);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
        }
        this.roleAvatar.setAvataByList(this.m_avatarList, heroData.profession, heroData.gender, true, this.colorIndex);

        this.m_pyPanel.SetActive(true);
        this.btn_py.SetActive(true);
        if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.taozhuan) return;




        this.updatePyMaterial(cfg, dressItem);

        //if (canStrength == false || G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_SHIZHUANG_HUANXIN) == false) {
        //    //this.fsPanel.SetActive(false);
        //    return;
        //}
        //this.fsPanel.SetActive(true);
        let dressList = heroData.dressList;
        let hasStrengthLv = heroData.getOneDressLv(this.dressID);

        let nextConfig = G.DataMgr.thingData.getDressImageQHCfgs(Math.floor(this.dressID / 100), hasStrengthLv + 1);

        if (nextConfig) {
            this.materialItemData.id = nextConfig.m_iConsumID;
            this.materialItemData.need = nextConfig.m_iConsumNum;
            this.materialItemData.has = G.DataMgr.thingData.getThingNum(this.materialItemData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            this.iconItem.updateByMaterialItemData(this.materialItemData);
            this.iconItem.updateIcon();
            let hasActive = heroData.getOneDressIsActive(this.dressID);

            let cfg: GameConfig.DressImageConfigM = ThingData.getDressImageConfig(this.dressID);
            let desStr = cfg.m_szSpecDesc;

            this.icon.SetActive(hasActive && (dressItem.m_uiTimeOut == 0 || dressItem.m_uiTimeOut > G.SyncTime.getCurrentTime() / 1000));
            UIUtils.setButtonClickAble(this.btnUp, hasActive && this.materialItemData.need != 0 && this.materialItemData.has >= this.materialItemData.need
                && (dressItem.m_uiTimeOut == 0 || dressItem.m_uiTimeOut > G.SyncTime.getCurrentTime() / 1000));
        } else {
            UIUtils.setButtonClickAble(this.btnUp, false);
            this.icon.SetActive(false);
        }

        //强化属性
        if (canStrength) {
            let qhConfig: GameConfig.DressQHM;
            let nextQHConfig: GameConfig.DressQHM;
            let hasNextCfg = false;
            this.btnGrid.SetActive(canStrength);
            if (hasStrengthLv > 0) {
                qhConfig = G.DataMgr.thingData.getDressImageQHCfgs(Math.floor(this.dressID / 100), hasStrengthLv);
                nextQHConfig = G.DataMgr.thingData.getDressImageQHCfgs(Math.floor(this.dressID / 100), hasStrengthLv + 1);
                //有下一级配置
                if (nextQHConfig) {
                    hasNextCfg = true;
                }
            } else {
                qhConfig = G.DataMgr.thingData.getDressImageQHCfgs(Math.floor(this.dressID / 100), this.MaxLevel);
            }
            if (qhConfig == null) {
                uts.logError("@jackson...请确保时装强化有数据...");
                return;
            }
            this.propList.Count = qhConfig.m_astPropAtt.length;
            for (let i = 0; i < this.propList.Count; i++) {
                if (this.wuXiaHuanXingItem[i] == null) {
                    let item = this.propList.GetItem(i).gameObject;
                    this.wuXiaHuanXingItem[i] = new WUXiaHuanXingItem();
                    this.wuXiaHuanXingItem[i].setCommpents(item);
                }
                this.wuXiaHuanXingItem[i].update(qhConfig.m_astPropAtt[i], hasNextCfg ? nextQHConfig.m_astPropAtt[i] : null);
            }
        }
        else {
            this.fsPanel.SetActive(false);
            this.onToggleClick(0);
        }


    }

    private onTimer(timer: Game.Timer): void {
        if (this.specialList.Selected < 0)
            return;
        let cfg: GameConfig.DressImageConfigM;
        if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.special) {
            cfg = this.fashionData[this.specialListItemIndex];
        }
        else if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.taozhuan) {
            cfg = this.fashionData[this.taozhuanListItemIndex];
        }
        else if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.saiji) {
            cfg = this.fashionData[this.saijiListItemIndex];
        }
        if (cfg == null)
            return;
        let currModeId: number = (cfg.m_stModel.length > 0 && cfg.m_stModel[this.colorIndex].m_iID > 0 ? cfg.m_uiImageId : 0);
        let dressItem: Protocol.DressOneImageInfo = EquipUtils.getDressInfo(currModeId);
        if (dressItem != null && dressItem.m_uiTimeOut != 0) {
            let curTime: number = G.SyncTime.getCurrentTime() / 1000;
            if (dressItem.m_uiTimeOut > curTime) {
                let time: number = Math.max(0, (dressItem.m_uiTimeOut - curTime));
                this.getCondition.text = '剩余时间:' + DataFormatter.second2DayDoubleShort(time);
            }
            else {
                this.getCondition.text = cfg.m_szSpecDesc + '(已过期)';
            }
        }

    }


    /**时装幻化按钮*/
    private onClickSZHuanHuaBt(): void {
        let dressImageID: number = G.DataMgr.heroData.avatarList.m_uiDressImageID;
        let cfg: GameConfig.DressImageConfigM;
        if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.special) {
            cfg = this.fashionData[this.specialListItemIndex];
        }
        else if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.taozhuan) {
            cfg = this.fashionData[this.taozhuanListItemIndex];
        }
        else if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.saiji) {
            cfg = this.fashionData[this.saijiListItemIndex];
        }
        let currModeId: number = (cfg.m_stModel.length > 0 && cfg.m_stModel[this.colorIndex].m_iID > 0 ? cfg.m_uiImageId : 0);
        if (dressImageID != currModeId || G.DataMgr.heroData.avatarList.m_ucDressColorID != this.colorIndex) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSzhxRequest(this.colorIndex, currModeId));
        }
    }


    /**点击培养按钮*/
    protected onClickPyBt(): void {
        if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.saiji) {
            G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN, 0, 0, Math.floor(this.cfg.m_uiImageId / 100));
        }
        else {
            if (this.m_pyMaterialData.has < this.m_pyMaterialData.need) {
                G.TipMgr.addMainFloatTip('您的培养材料不足');
            }
            else {
                let cfg: GameConfig.DressImageConfigM = this.fashionData[this.specialListItemIndex];
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHuanHuaPyRequest(Macros.IMAGE_TRAIN_DRESS, 0, cfg.m_uiImageId));
            }
        }
    }

    /**
     * 刷新培养面板
     * @param cfg 本地
     * @param dressItem 服务器数据
     */
    private updatePyMaterial(cfg: GameConfig.DressImageConfigM, dressItem: Protocol.DressOneImageInfo): void {
        if (dressItem == null) {
            //未激活
            if (this.huanHuaGroupSelectedIndex == HuanhuaShizhuanGroupTab.saiji) {
                let zhufudata = G.DataMgr.zhufuData.getSaiJiCfgByImageId(Math.floor(cfg.m_uiImageId / 100));
                if (zhufudata != null) {
                    this.m_pyMaterialData.id = zhufudata.m_iSutffID;
                    this.m_pyMaterialData.need = zhufudata.m_iSutffCount;
                    this.m_pyMaterialData.has = G.DataMgr.thingData.getThingNum(zhufudata.m_iSutffID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                }
            }
            else {
                this.m_pyMaterialData.id = 0;
                this.m_pyMaterialData.need = 0;
            }
        }
        else if (dressItem.m_uiTimeOut > 0) {
            //限时的
            this.m_pyMaterialData.id = 0;
            this.m_pyMaterialData.need = 0;
        }
        else if (!cfg.m_bCanStreng) {
            //强化未开启
            this.m_pyMaterialData.id = 0;
            this.m_pyMaterialData.need = 0;
        }
        else if (dressItem.m_uiAddNum >= cfg.m_uiAddNum) {
            this.fullLevelTxt.gameObject.SetActive(true);
            this.m_pyPanel.SetActive(false);
            this.fullLevelTxt.text = TextFieldUtil.getColorText('已经达到上限\n无法继续提升', Color.GREEN);
        }
        else {
            this.m_pyMaterialData.id = cfg.m_iConsumeID;
            this.m_pyMaterialData.need = 1;
        }

        if (this.m_pyMaterialData.id == 0) {
            this.fullLevelTxt.gameObject.SetActive(cfg.m_bCanStreng == 0);
            this.m_pyPanel.SetActive(false);
            this.fullLevelTxt.text = TextFieldUtil.getColorText('无法培养此时装', Color.GREEN);
        } else {
            this.fullLevelTxt.gameObject.SetActive(false);
            this.m_pyPanel.SetActive(true);
            if (dressItem == null) {
                //未激活
                let thingdata = ThingData.getThingConfig(this.m_pyMaterialData.id);
                this.pyTimeText.text = TextFieldUtil.getColorText(thingdata.m_szName, Color.GREEN);
                let name = ElemFinder.findText(this.btn_py, "Text");
                name.text = "激活";
            }
            else {
                this.pyTimeText.text = uts.format('{0}{1}/{2}', TextFieldUtil.getColorText('培养次数：', Color.GREEN), dressItem.m_uiAddNum, cfg.m_uiAddNum);
                let name = ElemFinder.findText(this.btn_py, "Text");
                name.text = "培养";
            }
        }

        if (this.m_pyMaterialData.id != 0) {
            this.m_pyMaterialData.has = G.DataMgr.thingData.getThingNum(this.m_pyMaterialData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            /**更新培养物品的图标*/
            this.m_pyMaterialIconItem.updateByMaterialItemData(this.m_pyMaterialData);
            UIUtils.setGrey(this.btn_py, false, false);
        }
        else {
            this.m_pyMaterialIconItem.updateByMaterialItemData(null);
            UIUtils.setGrey(this.btn_py, true, false);
        }
        this.m_pyMaterialIconItem.updateIcon();
    }


    updateAttList(): void {
        this.attListData.length = 0;
        this.attListDic = {};
        let allPropData: HeroAttItemData[] = [];
        for (let prop of this.m_allProps) {
            if (prop.m_ucPropId) {
                var itemVo: HeroAttItemData = this.getHeroAttItemData(prop.m_ucPropId);
                var macroId: number = PropUtil.getPropMacrosByPropId(prop.m_ucPropId);
                itemVo.macroId = macroId;
                itemVo.addVal = prop.m_ucPropValue * this.m_pyTimes;
                allPropData.push(itemVo);
            }
        }
        //战斗力
        //附加属性列表
        for (let i = 0; i < this.max_propNum; i++) {
            let propText = ElemFinder.findText(this.propParent, i.toString());
            let propValueText = ElemFinder.findText(propText.gameObject, "value");
            if (i < allPropData.length) {
                let name = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, allPropData[i].propId);
                let propValue = allPropData[i].addVal.toString();
                propText.text = name;
                propValueText.text = propValue;
            } else {
                propText.text = '';
                propValueText.text = "";
            }
        }

        let hasStrengthLv = G.DataMgr.heroData.getOneDressLv(this.dressID);
        if (hasStrengthLv > 0) {
            let qhConfig = G.DataMgr.thingData.getDressImageQHCfgs(Math.floor(this.dressID / 100), hasStrengthLv);
            if (qhConfig) {
                this.fightCount = (FightingStrengthUtil.calStrength(qhConfig.m_astPropAtt));
            }
        } else {
            this.fightCount = 0;
        }
        let fighting = (FightingStrengthUtil.calStrength(this.m_allProps) * this.m_pyTimes) + this.fightCount;
        this.setTitleFight(fighting);
        this.updateNextAttList();
    }

    /**
    * 获取属性列表ITEM数据
    * @param	m_ucPropId
    * @return
    */
    private getHeroAttItemData(m_ucPropId: number): HeroAttItemData {
        let itemVo: HeroAttItemData = this.attListDic[m_ucPropId] as HeroAttItemData;
        if (!itemVo && m_ucPropId > 0) {
            itemVo = new HeroAttItemData();
            let macroId: number = PropUtil.getPropMacrosByPropId(m_ucPropId);
            itemVo.macroId = macroId;
            this.attListData.push(itemVo);
            this.attListDic[m_ucPropId] = itemVo;
        }
        return this.attListDic[m_ucPropId];
    }

    /**更新下一阶属性数组*/
    private updateNextAttList(): void {
        let len = this.m_allProps.length;
        for (let i = 0; i < len; i++) {
            let curAtt: GameConfig.EquipPropAtt = this.m_allProps[i];
            if (curAtt.m_ucPropId) {
                let itemVo: HeroAttItemData = this.getHeroAttItemData(curAtt.m_ucPropId);
                itemVo.nextVal = this.m_allProps[i].m_ucPropValue;
            }
        }
    }
}