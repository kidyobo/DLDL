import { UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from 'System/data/UIPathData';
import { MaterialItemData } from 'System/data/vo/MaterialItemData';
import { EquipView } from "System/equip/EquipView";
import { Global as G } from 'System/global';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TipFrom } from 'System/tip/view/TipsView';
import { IconItem } from 'System/uilib/IconItem';
import { PropNameValueItem } from 'System/uilib/PropNameValueItem';
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar";
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil';
import { UIUtils } from 'System/utils/UIUtils';
import { TabSubFormCommon } from '../uilib/TabFormCommom';
import { GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm';
import { GroupList } from 'System/uilib/GroupList';
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility';
import { List, ListItem } from "System/uilib/List";
import { HuanHuaItem } from 'System/hero/view/ShiZhuangPanel';
import { ZhufuData } from "System/data/ZhufuData";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { Color } from "System/utils/ColorUtil";
import { PropUtil } from "System/utils/PropUtil";
import { HeroAttItemData } from "System/hero/HeroAttItemData";
import { Constants } from 'System/constants/Constants';
import { DataFormatter } from "System/utils/DataFormatter";
import { RiChangView } from 'System/richang/RiChangView';
import { JinjieView } from 'System/jinjie/view/JinjieView'

export class WingEquipJingLianPanel extends TabSubFormCommon {
    /**属性数量*/
    private readonly MAX_HH_PROP_NUM: number = 7;
    private readonly Progress_Parm = 2.5;

    private txtFight: TextGetSet;
    private txtName: UnityEngine.UI.Text;
    private rightModelRoot: UnityEngine.GameObject;
    private txtSlider: UnityEngine.UI.Text;
    private txtTips: UnityEngine.UI.Text;
    private txtGetTips: UnityEngine.UI.Text;

    private propList: List;
    private icon: UnityEngine.GameObject;
    //private equipIcon: UnityEngine.GameObject;
    private btnStart: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;
    private slider: UnityEngine.UI.Slider;
    private newDianRoot: UnityEngine.GameObject;

    private iconItem: IconItem;
    //private equipIconItem: IconItem;
    private propNameValueItems: PropNameValueItem[] = [];
    private costMaterial: MaterialItemData = new MaterialItemData();

    /**角色模型*/
    private roleAvatar: UIRoleAvatar;
    private rolePosition: UnityEngine.Transform = null;


    ////下面开始扩展  羽翼幻化功能
    private funcGroup: UnityEngine.UI.ActiveToggleGroup;
    /**功能选择下标0为进阶,1为幻化*/
    private funcGroupIndex: number = 0;
    /**进阶面板*/
    private jinjiepanel: GameObjectGetSet;
    /**幻化面板*/
    private huanhuapanel: GameObjectGetSet;
    /**幻化左侧列表*/
    private _HHgroupList: GroupList = null;
    /**左侧普通子列表*/
    private _HHgroupListItemNormal: List;
    /**左侧特殊子列表*/
    private _HHgroupListItemSpecial: List;
    /**左侧赛季子列表*/
    private _HHgroupListItemSeason: List;
    /**幻化子列表名字*/
    private _HHgroupListItemName: string[] = ["赛季灵翼", "特殊灵翼", "精炼灵翼"];
    /**普通幻化数据*/
    private _HHNormalData: ThingItemData = null;
    /**特殊幻化列表数据*/
    private _HHSpecialData: number[] = [];
    /**赛季幻化列表数据*/
    private _HHSeasonData: number[] = [];

    /**幻化名称*/
    private txtHHName: TextGetSet;
    /**幻化战斗力*/
    private txtHHFight: TextGetSet;
    /**属性父节点*/
    private props: GameObjectGetSet;
    private propTexts: TextGetSet[] = [];
    private addTexts: TextGetSet[] = [];
    /**幻化培养*/
    private peiyangPanel: GameObjectGetSet;
    /**幻化培养下面的文本*/
    private condition: TextGetSet;
    /**培养图标*/
    private pyIcon: GameObjectGetSet;
    private m_pyMaterialIconItem: IconItem;

    private m_pyMaterialData: MaterialItemData;
    /**培养按钮*/
    private btn_PY: GameObjectGetSet;
    /**培养按钮的文本*/
    private txt_btn_Py: TextGetSet;

    private btnHuanHua: GameObjectGetSet;
    private maxTip: GameObjectGetSet;

    private pyLevel: TextGetSet;

    private leftTime = 0;
    private zhufuData: ZhufuData;

    private selectedCfgID: number = 0;
    private oldModelId: number = -1;

    /**打开面板时指定要显示的image id*/
    private openId: number = 0;
    /**当这个值为false时自动选中失效*/
    private isHHAutoSelect: boolean = true;
    private _HHGroupListSelected: number = -1;
    /**用来减少幻化红点的刷新次数,打开面板和数据改变时才刷新*/
    private isHHRefreshTipMark: boolean = false;
    /**用来优化数据设置,仅打开面板和数据改变时才设置数据*/
    private isDataChange: boolean = false;
    //private _IsSeasonListAddListener: boolean = false;
    //private _IsSpecialListAddListener: boolean = false;
    //private _IsNormalListAddListener: boolean = false;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN);
    }

    protected resPath(): string {
        return UIPathData.WingEquipJingLianPanel;
    }


    protected initElements() {
        this.txtFight = new TextGetSet(this.elems.getText("txtFight"));
        this.txtName = this.elems.getText("txtName");
        this.rightModelRoot = this.elems.getElement("rightModelRoot");
        this.txtSlider = this.elems.getText("txtSlider");
        this.txtTips = this.elems.getText("txtTips");
        this.txtGetTips = this.elems.getText("txtGetTips");

        this.propList = this.elems.getUIList("propList");
        this.slider = this.elems.getSlider("slider");
        this.newDianRoot = this.elems.getElement("newDianRoot");
        this.newDianRoot.SetActive(false);
        this.rolePosition = this.elems.getTransform("rolePosition");
        this.icon = this.elems.getElement("icon");
        //this.equipIcon = this.elems.getElement("equipIcon");
        this.btnStart = this.elems.getElement("btnStart");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);
        //this.equipIconItem = new IconItem();
        //this.equipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.equipIcon);
        //this.equipIconItem.setTipFrom(TipFrom.normal);

        ////下面开始扩展  羽翼幻化功能
        this.funcGroup = this.elems.getToggleGroup("funcGroup");
        this.funcGroup.onValueChanged = delegate(this, this.onFuncGroupChange);
        this.jinjiepanel = new GameObjectGetSet(this.elems.getElement("jinjiepanel"));
        this.huanhuapanel = new GameObjectGetSet(this.elems.getElement("huanhuapanel"));
        this._HHgroupList = this.elems.getUIGroupList('groupList')
        //初始化左侧选择列表
        this._HHgroupList.Count = 3;
        for (let i = 0; i < 3; i++) {
            let item = this._HHgroupList.GetItem(i);
            let name = this._HHgroupListItemName[i];
            let txtname = ElemFinder.findText(item.gameObject, "citem/normal/txtName");
            txtname.text = name;
            txtname = ElemFinder.findText(item.gameObject, "citem/selected/txtName");
            txtname.text = name;
        }

        this._HHgroupListItemSeason = this._HHgroupList.GetSubList(0);
        this._HHgroupListItemSpecial = this._HHgroupList.GetSubList(1);
        this._HHgroupListItemNormal = this._HHgroupList.GetSubList(2);

        this._HHgroupListItemNormal.onVirtualItemChange = delegate(this, this.onUpdateItemNormal);
        this._HHgroupListItemSpecial.onVirtualItemChange = delegate(this, this.onUpdateItemSpecial);
        this._HHgroupListItemSeason.onVirtualItemChange = delegate(this, this.onUpdateItemSeason);


        this.txtHHName = new TextGetSet(this.elems.getText("txtHHName"));
        this.txtHHFight = new TextGetSet(this.elems.getText("txtHHFight"));
        this.props = new GameObjectGetSet(this.elems.getElement("props"));
        //附加属性列表
        for (let i = 0; i < this.MAX_HH_PROP_NUM; i++) {
            this.propTexts.push(new TextGetSet(ElemFinder.findText(this.props.gameObject, i.toString())));
            this.addTexts.push(new TextGetSet(ElemFinder.findText(this.props.gameObject, i + "/value")));
        }
        this.peiyangPanel = new GameObjectGetSet(this.elems.getElement("peiyangPanel"));
        this.condition = new TextGetSet(this.elems.getText("condition"));
        this.m_pyMaterialData = new MaterialItemData();
        this.pyIcon = new GameObjectGetSet(this.elems.getElement("pyIcon"));
        this.m_pyMaterialIconItem = new IconItem();
        this.m_pyMaterialIconItem.setUsualIconByPrefab(this.elems.getElement('itemIcon_Normal'), this.pyIcon.gameObject);
        this.m_pyMaterialIconItem.setTipFrom(TipFrom.normal);
        this.btn_PY = new GameObjectGetSet(this.elems.getElement("btn_PY"));
        this.txt_btn_Py = new TextGetSet(this.elems.getText("txt_btn_Py"));
        this.btnHuanHua = new GameObjectGetSet(this.elems.getElement("btnHuanHua"));
        this.maxTip = new GameObjectGetSet(this.elems.getElement("maxTip"));
        this.pyLevel = new TextGetSet(this.elems.getText("pyLevel"));

    }

    protected initListeners() {
        this.addClickListener(this.btnStart, this.onClickStart);
        this.addListClickListener(this._HHgroupList, this.onClickHHGroupList);
        this.addListClickListener(this._HHgroupListItemNormal, this.onClickHHNormalList);
        this.addListClickListener(this._HHgroupListItemSpecial, this.onClickHHSpecialList);
        this.addListClickListener(this._HHgroupListItemSeason, this.onClickHHSeasonList);
        this.addClickListener(this.btn_PY.gameObject, this.onClickBtnPy);
        this.addClickListener(this.btnHuanHua.gameObject, this.onClickHuanHuaBt);
    }

    private onClickStart() {
        if (this.checkCondition()) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRoleWingStrengthenRequest());
        }
    }

    open(openId: number = 0) {
        this.openId = openId;
        super.open();
    }

    protected onOpen() {
        this.closeTitleFight();

        this.zhufuData = G.DataMgr.zhufuData;
        //角色Avatar
        if (null == this.roleAvatar) {
            this.roleAvatar = new UIRoleAvatar(this.rolePosition, this.rolePosition);
            this.roleAvatar.setRenderLayer(5);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
            this.roleAvatar.m_rebirthMesh.setRotation(20, 0, 0);
        }
        this.onAvatarChange();
        this.roleAvatar.hasWing = true;
        this.isHHAutoSelect = true;
        this.isHHRefreshTipMark = true;
        this.isDataChange = true;
        if (this.openId > 10000) {
            this.funcGroup.Selected = 1;
            this.jinjiepanel.SetActive(false);
            this.huanhuapanel.SetActive(true);
        }
        else {
            this.jinjiepanel.SetActive(true);
            this.huanhuapanel.SetActive(false);
            this.updateJinJiePanel();
            this.funcGroup.Selected = 0;
            this.oldModelId = G.DataMgr.equipStrengthenData.getWingModelIdByWingEquip(G.DataMgr.heroData.avatarList.m_uiWingID, G.DataMgr.heroData.avatarList.m_uiWingLevel);
            this.addTimer("lateModel", 1, 1, this.lateLoadModel);
        }
        this.updateHuanHuaPanel();
    }



    protected onClose() {
        this.onEndNewDianEffect();
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }

    /**
 * 滑动屏幕人物旋转
 * @param x
 * @param y
 */
    public onDrag() {
        let delta = Game.UIDragListener.eventData.delta;
        let roatespeed: number = 0.6;
        this.roleAvatar.m_bodyMesh.setRotation(0, -roatespeed * delta.x + this.roleAvatar.m_bodyMesh.rotationY, 0);
    }

    private playNewDianEffect() {
        this.newDianRoot.SetActive(false);
        this.newDianRoot.SetActive(true);
        Game.Invoker.BeginInvoke(this.newDianRoot, "effect", 0.5, delegate(this, this.onEndNewDianEffect));
    }

    private onEndNewDianEffect() {
        this.newDianRoot.SetActive(false);
    }


    updateStrengthSucceed() {
        this.updateJinJiePanel();
        this.playNewDianEffect();
        this.onAvatarChange();
    }
    /**更新进阶面板 */
    updateJinJiePanel() {
        this.leftTime = 0;
        let equipList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (!equipList) {
            this.showNullEquip();
            return;
        }

        let wingEquip = equipList[KeyWord.EQUIP_PARTCLASS_WING - KeyWord.EQUIP_PARTCLASS_MIN];
        if (!wingEquip || !wingEquip.data || !wingEquip.data.m_stThingProperty) {
            this.showNullEquip();
            return;
        }

        let equipStrengthenData = G.DataMgr.equipStrengthenData;

        let equipId = wingEquip.config.m_iID;
        let lv = wingEquip.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress;
        let cfg = equipStrengthenData.getWingStrengthCfg(equipId, lv);
        if (!cfg) {
            this.showNullEquip();
            return;
        }
        //this.equipIconItem.updateByThingItemData(wingEquip);
        //this.equipIconItem.updateIcon();
        this.txtName.text = wingEquip.config.m_szName;
        //this.imgIcon.sprite = '';
        G.ResourceMgr.loadModel(this.rightModelRoot, UnitCtrlType.wing, cfg.m_iModelID.toString(), this.sortingOrder);
        let len = cfg.m_astPropAtt.length;
        this.propList.Count = len;
        for (let i = 0; i < len; i++) {
            if (this.propNameValueItems[i] == null) {
                let item = this.propList.GetItem(i).gameObject;
                this.propNameValueItems[i] = new PropNameValueItem();
                this.propNameValueItems[i].setComponents(item);
            }
            this.propNameValueItems[i].update(cfg.m_astPropAtt[i]);
        }

        this.setTitleFight(G.DataMgr.heroData.fight);
        this.txtFight.text = uts.format("战斗力 {0}",  FightingStrengthUtil.calStrength(cfg.m_astPropAtt));
        let nextCfg = equipStrengthenData.getWingStrengthCfg(equipId, lv + 1);
        if (nextCfg) {
            this.costMaterial.id = nextCfg.m_iConsumeID;
            this.costMaterial.need = nextCfg.m_iConsumeNum;
            this.costMaterial.has = G.DataMgr.thingData.getThingNum(nextCfg.m_iConsumeID, 0, false);
            this.iconItem.updateByMaterialItemData(this.costMaterial);
            this.iconItem.updateIcon();
            this.txtTips.text = "";
            let value = (this.Progress_Parm * lv);
            this.slider.value = (value / 100);
            this.txtSlider.text = uts.format("{0}%", value > 100 ? 100 : value);
            UIUtils.setButtonClickAble(this.btnStart, true);
            //设置右上角成长的红点显示
            this.setTabGroupTipMark(this.funcGroup, 0, this.costMaterial.need <= this.costMaterial.has);
        } else {
            this.txtTips.text = "已满级";
            this.slider.value = 1;
            this.txtSlider.text = uts.format("{0}%", 100);
            UIUtils.setButtonClickAble(this.btnStart, false);
            this.setTabGroupTipMark(this.funcGroup, 0, false);
        }
        this.icon.SetActive(nextCfg != null);
        //this.equipIcon.transform.parent.gameObject.SetActive(true);
        this.slider.gameObject.SetActive(true);
        this.txtGetTips.gameObject.SetActive(false);
      
    }

    /**幻化后台回复时刷新 */
    onHHDataChange() {
        this.updateHuanHuaPanel();
        this.isDataChange = true;
        this.setHHTipMark();
        //switch (this._HHgroupList.Selected) {
        //    case 0:
        //        this._HHgroupListItemSeason.Refresh();
        //        break;
        //    case 1:
        //        this._HHgroupListItemSpecial.Refresh();
        //        break;
        //    case 2:
        //        this._HHgroupListItemNormal.Refresh();
        //        break;
        //}
        this._HHgroupList.GetSubList(this._HHgroupList.Selected).Refresh();
    }
    /**设置幻化相关的红点逻辑 */
    private setHHTipMark() {
        let hasThing: boolean = false;
        //幻化一级列表 赛季 红点
        let mask = ElemFinder.findObject(this._HHgroupList.GetItem(0).gameObject, "citem/tipMark");
        //标记赛季和特殊列表是否有红点
        let show: boolean = false;
        let show2: boolean = false;
        for (let j = 0; j < this._HHSeasonData.length; j++) {
            hasThing = G.DataMgr.thingData.checkThingIDForZhufu(KeyWord.HERO_SUB_TYPE_YUYI, this._HHSeasonData[j]);
            if (hasThing) {
                show = true;
                show2 = true;
                break;
            }
        }
        //设置 赛季列表的红点
        mask.SetActive(show2);
        //幻化一级列表 特殊 红点
        mask = ElemFinder.findObject(this._HHgroupList.GetItem(1).gameObject, "citem/tipMark");
        show2 = false;
        for (let i = 0; i < this._HHSpecialData.length; i++) {
            hasThing = G.DataMgr.thingData.checkThingIDForZhufu(KeyWord.HERO_SUB_TYPE_YUYI, this._HHSpecialData[i]);
            if (hasThing) {
                show = true;
                show2 = true;
                break;
            }
        }
        //设置 特殊列表的红点
        mask.SetActive(show2);
        //右上角  (进阶和幻化切换那里 幻化的红点)  
        this.setTabGroupTipMark(this.funcGroup, 1, show);
    }

    /**更新幻化面板 */
    updateHuanHuaPanel() {
        let data = this.zhufuData.getData(KeyWord.HERO_SUB_TYPE_YUYI);
        if (data == null) {
            uts.log("羽翼祝福后台数据 未初始化");
            return;
        }

        if (this.isDataChange) {

            //羽翼装备的数据
            let equipList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
            if (!equipList) {
                return;
            }
            this._HHNormalData = equipList[KeyWord.EQUIP_PARTCLASS_WING - KeyWord.EQUIP_PARTCLASS_MIN];

            //特殊外形
            let iddata = this.zhufuData.getImageID(KeyWord.HERO_SUB_TYPE_YUYI);
            iddata.sort(ZhufuData.huanHuaSpecialCompare);
            //羽翼化形系统表数据和后台信息分类处理
            //已激活的
            let activeList: number[] = [];
            //未激活的
            let inactiveList: number[] = [];
            let unsameArray: number[] = [];
            let thingData = G.DataMgr.thingData;
            for (let i = 0, len = iddata.length; i < len; i++) {
                let data = iddata[i];
                if (this.zhufuData.isActive(KeyWord.HERO_SUB_TYPE_YUYI, data)) {
                    if (i == 0 && this.zhufuData.isDress(KeyWord.HERO_SUB_TYPE_YUYI, data)) {
                        activeList.splice(0, 0, data);
                    }
                    else {
                        activeList.push(data);
                    }
                    let unlevelID = this.zhufuData.getImageUnLevelID(data);
                    let index = unsameArray.indexOf(unlevelID);
                    if (index != -1) {
                        inactiveList.splice(index, 1);
                    }
                    unsameArray.push(unlevelID);
                }
                else {
                    let unlevelID = this.zhufuData.getImageUnLevelID(data);
                    if (data != 0 && unsameArray.indexOf(unlevelID) == -1) {
                        //过滤重复模型
                        unsameArray.push(unlevelID);

                        let have = thingData.checkThingIDForZhufu(KeyWord.HERO_SUB_TYPE_YUYI, data);
                        if (have) {
                            inactiveList.splice(0, 0, this.zhufuData.getImageLevelID(unlevelID, 1));
                        }
                        else {
                            inactiveList.push(this.zhufuData.getImageLevelID(unlevelID, 1));
                        }
                    }
                }
            }
            let datas: number[] = [];
            for (let i of activeList) {
                datas.push(i);
            }
            for (let i of inactiveList) {
                datas.push(i);
            }
            //分类为特殊和赛季
            this._HHSeasonData = [];
            this._HHSpecialData = [];

            for (let i of datas) {
                let cfg = this.zhufuData.getImageConfig(i);
                if (cfg) {
                    if (cfg.m_iFuncID == KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN) {//赛季
                        let saiJICfg = this.zhufuData.getSaiJiCfgByImageId(cfg.m_uiImageId);
                        if (saiJICfg && saiJICfg.m_iSeasonID <= this.zhufuData.getSaiJiMax()) {
                            this._HHSeasonData.push(i);
                        }
                    } else {//特殊
                        this._HHSpecialData.push(i);
                    }
                } else {
                    uts.logError("化形系统表 取不到配置:" + i);
                }
            }

            //更新左侧列表
            this._HHgroupListItemSeason.Count = this._HHSeasonData.length;
            this._HHgroupListItemSpecial.Count = this._HHSpecialData.length;
            this._HHgroupListItemNormal.Count = (this._HHNormalData != undefined && this._HHNormalData != null) ? 1 : 0;
        }
        /**穿戴的数据 */
        let wearData: Protocol.CSHeroSubSuper = this.zhufuData.getData(KeyWord.HERO_SUB_TYPE_YUYI);
        //这个if里面是自动选中
        if (this.isHHAutoSelect) {
            if (this.isHHRefreshTipMark)
                this.setHHTipMark();
            this.isHHRefreshTipMark = false;
            this.isHHAutoSelect = false;
            /**打开面板时传进来openId就自动选中*/
            let isSet: boolean = false;//标记是否已经自动选中了
            for (let i = 0; i < this._HHSpecialData.length; i++) {
                //传进来ImageId或者有可提升
                if ((this.openId > 10000 && this.openId == Math.floor(this._HHSpecialData[i] / 1000)) || 
                    G.DataMgr.thingData.checkThingIDForZhufu(KeyWord.HERO_SUB_TYPE_YUYI, this._HHSpecialData[i])) {
                    this._HHgroupList.Selected = 1;
                    this._HHgroupListItemSpecial.Selected = i;
                    isSet = true;
                    break;
                }
            }
            if (!isSet)
                for (let j = 0; j < this._HHSeasonData.length; j++) {
                     //传进来ImageId或者有可提升
                    if ((this.openId > 10000 && this.openId == Math.floor(this._HHSeasonData[j] / 1000)) || 
                        G.DataMgr.thingData.checkThingIDForZhufu(KeyWord.HERO_SUB_TYPE_YUYI, this._HHSeasonData[j])) {
                        this._HHgroupList.Selected = 0;
                        this._HHgroupListItemSeason.Selected = j;
                        isSet = true;
                        break;
                    }
                }
            if (!isSet) {//没有红点
                if (wearData && wearData.m_uiShowID > 0) {//身上穿祝福的
                    let showId = Math.floor(wearData.m_uiShowID / 1000);
                    let isSet2: boolean = false;//标记是否已经自动选中了
                    for (let i = 0; i < this._HHSpecialData.length; i++) {
                        if (showId == Math.floor(this._HHSpecialData[i]/1000)) {
                            this._HHgroupList.Selected = 1;
                            this._HHgroupListItemSpecial.Selected = i;
                            isSet2 = true;
                            break;
                        }
                    }
                    if (!isSet2) {
                        for (let j = 0; j < this._HHSeasonData.length; j++) {
                            if (showId == Math.floor(this._HHSeasonData[j] / 1000)) {
                                this._HHgroupList.Selected = 0;
                                this._HHgroupListItemSeason.Selected = j;
                                isSet2 = true;
                                break;
                            }
                        }
                    }
                } else {//身上穿的羽翼装备
                    if (this._HHNormalData == undefined || this._HHNormalData == null) {
                        this._HHgroupList.Selected = 1;
                        this._HHgroupListItemSpecial.Selected = 0;
                    } else {
                        this._HHgroupList.Selected = 2;
                        this._HHgroupListItemNormal.Selected = 0;
                    }
                }
            }
        }
        this._HHGroupListSelected = this._HHgroupList.Selected;
        if (this.funcGroup.Selected == 1)//选中了右上角幻化页签,才更新幻化相关的显示
            //更新属性和名字
            switch (this._HHgroupList.Selected < 0 ? 0 : this._HHgroupList.Selected) {
                case 0://赛季类型
                    this.showHHRightPanel(this._HHSeasonData[this._HHgroupListItemSeason.Selected < 0 ? 0 : this._HHgroupListItemSeason.Selected], true);
                    break;
                case 1://特殊类型
                    this.showHHRightPanel(this._HHSpecialData[this._HHgroupListItemSpecial.Selected < 0 ? 0 : this._HHgroupListItemSpecial.Selected]);
                    break;
                case 2://普通类型
                    let lv = this._HHNormalData.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress;
                    let cfgNormal = G.DataMgr.equipStrengthenData.getWingStrengthCfg(this._HHNormalData.config.m_iID, lv);
                    if (cfgNormal != null) {
                        this.showHHNameAndFight(cfgNormal.m_szName, cfgNormal.m_astPropAtt);
                        //属性列表
                        for (let i = 0; i < this.MAX_HH_PROP_NUM; i++) {
                            let allPropData = cfgNormal.m_astPropAtt;
                            if (i < allPropData.length) {
                                this.propTexts[i].text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, allPropData[i].m_ucPropId) + ":    " +
                                    TextFieldUtil.getColorText(allPropData[i].m_ucPropValue.toString(), Color.GREEN);
                            } else {
                                this.propTexts[i].text = "";
                            }
                            this.addTexts[i].text = "";
                        }
                    }

                    this.m_pyMaterialData.id = this.m_pyMaterialData.need = 0;
                    this.peiyangPanel.SetActive(false);
                    this.condition.text = "";

                    if (data && data.m_uiShowID > 0) {//穿了幻化的
                        this.btnHuanHua.SetActive(true);
                    } else {
                        this.btnHuanHua.SetActive(false);
                    }

                    let modelId = G.DataMgr.equipStrengthenData.getWingModelIdByWingEquip(G.DataMgr.heroData.avatarList.m_uiWingID, G.DataMgr.heroData.avatarList.m_uiWingLevel);
                    if (modelId != this.oldModelId) {
                        this.oldModelId = modelId;
                        this.addTimer("lateModel", 1, 1, this.lateLoadModel);
                    }
                    break;
            }
    }

    private showNullEquip() {
        this.txtTips.text = "请先佩戴翅膀";
        this.txtGetTips.gameObject.SetActive(true);
        this.icon.transform.parent.gameObject.SetActive(false);
        //this.equipIcon.transform.parent.gameObject.SetActive(false);
        this.propList.Count = 0;
        this.txtSlider.text = "";
        this.slider.value = 0;
        this.txtFight.text = "";
        this.txtName.text = "未佩戴可精炼灵翼";
        UIUtils.setButtonClickAble(this.btnStart, false);
        this.slider.gameObject.SetActive(false);
    }


    private checkCondition(): boolean {
        if (this.costMaterial.need > this.costMaterial.has) {
            G.TipMgr.addMainFloatTip("材料数量不足，无法精炼！");
            return false;
        }
        return true;
    }


    onAvatarChange(): void {
        //if (G.DataMgr.otherPlayerData.isOtherPlayer) {
        //    let roleInfo: Protocol.RoleInfo = G.DataMgr.otherPlayerData.roleBaseInfo;
        //    this.roleAvatar.setAvataByList(roleInfo.m_stAvatarList, roleInfo.m_stBaseProfile.m_cProfession, roleInfo.m_stBaseProfile.m_cGender);
        //}
        //else {
        let heroData = G.DataMgr.heroData;
        this.roleAvatar.setAvataByList(heroData.avatarList, heroData.profession, heroData.gender);
        this.roleAvatar.hasWing = true;
        //}
    }

    ////下面开始扩展  羽翼幻化功能
    /**
     * 选择 进阶或者幻化
     * @param index
     */
    private onFuncGroupChange(index: number) {
        this.funcGroupIndex = index;
        switch (this.funcGroupIndex) {
            case 0://进阶  因为打开面板的时候已经刷新过了,所以这里不更新panel,只显示隐藏
                this.jinjiepanel.SetActive(true);
                this.huanhuapanel.SetActive(false);
                this.updateJinJiePanel();
                this.isHHAutoSelect = true;
                this.oldModelId = G.DataMgr.equipStrengthenData.getWingModelIdByWingEquip(G.DataMgr.heroData.avatarList.m_uiWingID, G.DataMgr.heroData.avatarList.m_uiWingLevel);
                this.addTimer("lateModel", 1, 1, this.lateLoadModel);
                break;
            case 1://幻化
                this.huanhuapanel.SetActive(true);
                this.jinjiepanel.SetActive(false);
                this.updateHuanHuaPanel();
                break;
        }
    }

    /**点击左侧进阶GroupList刷新面板*/
    private onClickHHGroupList(index: number) {
        if (index != this._HHGroupListSelected) {
            this._HHgroupList.GetSubList(index).Selected = -1;
        }
    }

    /**
* 普通类别
* @param item
*/
    private onUpdateItemNormal(item: ListItem) {
        let index = item._index;
        //let data = this._HHSpecialData[index];
        let huanhuaitem = item.data.huanhuaitem as HuanHuaItem;
        if (!huanhuaitem) {
            let obj = this._HHgroupListItemNormal.GetItem(index).gameObject;
            huanhuaitem = new HuanHuaItem();
            huanhuaitem.setItem(obj);
            item.data.huanhuaitem = huanhuaitem;
        }
        huanhuaitem.updateByThingItemData(this._HHNormalData);
        huanhuaitem.updateView();

    }

    /**点击幻化普通列表*/
    private onClickHHNormalList(index: number) {
        this.updateHuanHuaPanel();
        //this.updateSpecialPanel(selectData);
        //let mask = ElemFinder.findObject(this.groupList.GetItem(0).gameObject, "citem/tipMark");
        //mask.SetActive(G.DataMgr.zhufuData.isRideSpaceShowTipsMark());
    }

    /**
 * 特殊类别
 * @param item
 */
    private onUpdateItemSpecial(item: ListItem) {
        let index = item._index;
        let data = this._HHSpecialData[index];
        let huanhuaitem = item.data.huanhuaitem as HuanHuaItem;
        if (!huanhuaitem) {
            let obj = this._HHgroupListItemSpecial.GetItem(index).gameObject;
            huanhuaitem = new HuanHuaItem();
            huanhuaitem.setItem(obj);
            item.data.huanhuaitem = huanhuaitem;
        }
        huanhuaitem.updateById(data);
        huanhuaitem.updateView();

    }

    /**点击幻化特殊列表*/
    private onClickHHSpecialList(index: number) {
        this.updateHuanHuaPanel();
        //this.updateSpecialPanel(selectData);
        //let mask = ElemFinder.findObject(this.groupList.GetItem(0).gameObject, "citem/tipMark");
        //mask.SetActive(G.DataMgr.zhufuData.isRideSpaceShowTipsMark());
    }


    /**
* 赛季类别
* @param item
*/
    private onUpdateItemSeason(item: ListItem) {
        let index = item._index;
        let data = this._HHSeasonData[index];
        let huanhuaitem = item.data.huanhuaitem as HuanHuaItem;
        if (!huanhuaitem) {
            let obj = this._HHgroupListItemSeason.GetItem(index).gameObject;
            huanhuaitem = new HuanHuaItem();
            huanhuaitem.setItem(obj);
            item.data.huanhuaitem = huanhuaitem;
        }
        huanhuaitem.updateById(data);
        huanhuaitem.updateView();

    }

    /**点击幻化 赛季列表*/
    private onClickHHSeasonList(index: number) {
        this.updateHuanHuaPanel();
        //this.updateSpecialPanel(selectData);
        //let mask = ElemFinder.findObject(this.groupList.GetItem(0).gameObject, "citem/tipMark");
        //mask.SetActive(G.DataMgr.zhufuData.isRideSpaceShowTipsMark());
    }

    /**
     * 显示幻化名字和战力
     * @param name
     * @param propAtt
     */
    private showHHNameAndFight(name: string, propAtt: GameConfig.EquipPropAtt[]) {
        this.txtHHName.text = name;
        this.txtHHFight.text = uts.format("战斗力 {0}", FightingStrengthUtil.calStrength(propAtt));
    }

    /**
     * 显示幻化右侧面板
     * isSaiJi(是否赛季)
     */
    private showHHRightPanel(cfgId: number, isSaiJi: boolean = false) {
        this.selectedCfgID = cfgId;
        let currentConfig = this.zhufuData.getImageConfig(cfgId);
        this.showHHNameAndFight(currentConfig.m_szModelName, currentConfig.m_astProp);

        let dressOneImage: Protocol.HeroSubDressOneImage = this.zhufuData.getTimeItem(KeyWord.HERO_SUB_TYPE_YUYI, cfgId);
        //拿到下阶的配置
        let level = this.zhufuData.getImageLevel(cfgId);
        let imageid = this.zhufuData.getImageUnLevelID(cfgId);
        let next = this.zhufuData.getImageLevelID(imageid, (dressOneImage == null || dressOneImage.m_uiTimeOut > 0) ? level : level + 1);
        let nextConfig = this.zhufuData.getImageConfig(next);
        if (nextConfig != null && nextConfig.m_iConsumeID != 0) {
            this.m_pyMaterialData.id = currentConfig.m_iConsumeID;
            this.m_pyMaterialData.need = nextConfig.m_iConsumableCount;
            if (isSaiJi) {
                this.updatePyMaterial(false, cfgId);
            } else {
                this.updatePyMaterial(dressOneImage == null || dressOneImage.m_uiTimeOut > 0, cfgId);
            }

            this.pyIcon.SetActive(true);
        }
        else {
            this.pyIcon.SetActive(false);
        }

        //属性列表显示
        for (let i = 0; i < this.MAX_HH_PROP_NUM; i++) {
            let curPropCfg = currentConfig.m_astProp;
            if (i < curPropCfg.length) {
                this.propTexts[i].text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, curPropCfg[i].m_ucPropId) + ":    " +
                    TextFieldUtil.getColorText(curPropCfg[i].m_ucPropValue.toString(), Color.GREEN);
                //显示下一阶属性
                this.addTexts[i].text = "";
                if (nextConfig) {
                    if (currentConfig != nextConfig)
                        this.addTexts[i].text = " +"+ TextFieldUtil.getColorText((nextConfig.m_astProp[i].m_ucPropValue - curPropCfg[i].m_ucPropValue).toString(), Color.GREEN);
                }
            } else {
                this.propTexts[i].text = "";
                this.addTexts[i].text = "";
            }
        }
        //-------------------------------------------------------------------------------
        let oldTime: number = this.leftTime;
        if (this.zhufuData.isActive(KeyWord.HERO_SUB_TYPE_YUYI, cfgId)) {
            if (this.zhufuData.isDress(KeyWord.HERO_SUB_TYPE_YUYI, cfgId)) {
                this.btnHuanHua.SetActive(false);
            }
            else {
                this.btnHuanHua.SetActive(true);
            }
            let dressOneImage: Protocol.HeroSubDressOneImage = this.zhufuData.getTimeItem(KeyWord.HERO_SUB_TYPE_YUYI, cfgId);
            let current: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            this.leftTime = 0;
            let data: Protocol.CSHeroSubSuper = this.zhufuData.getData(KeyWord.HERO_SUB_TYPE_YUYI);
            if (dressOneImage.m_uiTimeOut == 0) {
                    this.condition.text = Constants.S_YONGJIU;
            }
            else if (dressOneImage.m_uiTimeOut <= current) {
                this.condition.text = currentConfig.m_szCondition;
                this.btnHuanHua.SetActive(false);
            }
            else {
                this.leftTime = dressOneImage.m_uiTimeOut;
                this.condition.text = DataFormatter.second2day(dressOneImage.m_uiTimeOut - current);
            }
        }
        else {
            this.leftTime = 0;
            this.btnHuanHua.SetActive(false);
            this.condition.text = currentConfig.m_szCondition;
        }
        if (oldTime == 0 && this.leftTime != 0) {
            this.addTimer("upTimer", 1000, 0, this.onTime);
        }
        this.pyLevel.text = uts.format("{0}阶", level);
        if (dressOneImage == null || dressOneImage.m_uiTimeOut > 0) {//没激活或者
            if (isSaiJi) {
                this.txt_btn_Py.text = "前往";
                this.btn_PY.SetActive(true);
                this.maxTip.SetActive(false);
            } else {
                this.txt_btn_Py.text = "激活";
                this.btn_PY.SetActive(true);
                this.maxTip.SetActive(false);
            }
        }
        else {
            if (nextConfig) {
                this.txt_btn_Py.text = "飞升";
                this.btn_PY.SetActive(true);
                this.maxTip.SetActive(false);
            }
            else {
                this.btn_PY.SetActive(false);
                this.maxTip.SetActive(true);
            }
        }

        this.peiyangPanel.SetActive(true);
        let modelId = currentConfig.m_iModelID;
        if (modelId != this.oldModelId) {
            this.oldModelId = modelId;
            this.addTimer("lateModel", 1, 1, this.lateLoadModel);
        }
    }

    private onTime(): void {
        if (this.leftTime > 0) {
            let current: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            if (this.leftTime > current) {
                this.condition.text = DataFormatter.second2day(this.leftTime - current);
            }
            else {
                this.condition.text = '已经过期';
                this.leftTime = 0;
                this.showHHRightPanel(this.selectedCfgID);
                this.removeTimer("upTimer");
            }
        }
        else {
            this.removeTimer("upTimer");
        }
    }

    /**刷新培养面板*/
    private updatePyMaterial(active: boolean, id: number): void {
        if (this.m_pyMaterialData.id != 0) {
            if (active) {
                this.m_pyMaterialData.has = G.DataMgr.thingData.checkThing(KeyWord.ITEM_FUNCTION_SUBIMAGE, G.DataMgr.zhufuData.getImageUnLevelID(id)) == null ? 0 : 1;
            }
            else {
                this.m_pyMaterialData.has = G.DataMgr.thingData.getThingNum(this.m_pyMaterialData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            }
            /**更新培养物品的图标*/
            this.m_pyMaterialIconItem.updateByMaterialItemData(this.m_pyMaterialData);
            this.m_pyMaterialIconItem.updateIcon();
            UIUtils.setGrey(this.btn_PY.gameObject, false, false);
        }
        else {
            this.m_pyMaterialIconItem.updateByMaterialItemData(null);
            this.m_pyMaterialIconItem.updateIcon();
            UIUtils.setGrey(this.btn_PY.gameObject, true, false);
        }
    }

    /**点击培养*/
    private onClickBtnPy(): void {

        let id = this.zhufuData.getImageUnLevelID(this.selectedCfgID);
        let level = this.zhufuData.getImageLevel(this.selectedCfgID);
        if (this.txt_btn_Py.text == "激活") {
            let item = G.DataMgr.thingData.checkThing(KeyWord.ITEM_FUNCTION_SUBIMAGE, id);
            if (item != null) {
                let thingInfo: Protocol.ContainerThingInfo = item.data;
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_USE_THING,
                    Macros.CONTAINER_TYPE_ROLE_BAG, thingInfo.m_iThingID, //物品id
                    thingInfo.m_usPosition, //物品位置
                    1, -1));
                this.onUp();
            }
            else {
                G.TipMgr.addMainFloatTip('激活材料不足');
            }
        }
        else if (this.txt_btn_Py.text == "飞升") {
            if (this.m_pyMaterialData.has < this.m_pyMaterialData.need) {
                G.TipMgr.addMainFloatTip('飞升材料不足');
            }
            else {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHuanHuaFSRequest(KeyWord.HERO_SUB_TYPE_YUYI, id));
            }
        } else if (this.txt_btn_Py.text == "前往") {
            G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN, 0, 0, id);
        }
    }

    private onUp(): void {
        let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(KeyWord.HERO_SUB_TYPE_YUYI);
        if (data != null && data.m_uiShowID != this.selectedCfgID) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuChangeRequest(KeyWord.HERO_SUB_TYPE_YUYI, G.DataMgr.zhufuData.getImageUnLevelID(this.selectedCfgID)));
        }
    }

    /**点击幻化*/
    private onClickHuanHuaBt(): void {
        if (this._HHgroupList.Selected == 2) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuChangeRequest(KeyWord.HERO_SUB_TYPE_YUYI, 0));
        }
        else {
            let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(KeyWord.HERO_SUB_TYPE_YUYI);
            if (data != null && data.m_uiShowID != this.selectedCfgID) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuChangeRequest(KeyWord.HERO_SUB_TYPE_YUYI, G.DataMgr.zhufuData.getImageUnLevelID(this.selectedCfgID)));
            }
        }
    }

    public lateLoadModel() {
        this.roleAvatar.updateWingModel(this.oldModelId);
        this.removeTimer("lateModel");
    }
}