import { BatBuyView } from "System/business/view/BatBuyView";
import { Constants } from 'System/constants/Constants';
import { EnumEffectRule, EnumGuide, GameIDType, UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from 'System/constants/KeyWord';
import { SkillData } from 'System/data/SkillData';
import { ThingData } from 'System/data/thing/ThingData';
import { ThingItemData } from 'System/data/thing/ThingItemData';
import { UIPathData } from 'System/data/UIPathData';
import { BeautyEquipListItemData } from "System/data/vo/BeautyEquipListItemData";
import { MaterialItemData } from 'System/data/vo/MaterialItemData';
import { ZhufuData } from 'System/data/ZhufuData';
import { Global as G } from 'System/global';
import { HeroAttItemData } from "System/hero/HeroAttItemData";
import { HeroRule } from "System/hero/HeroRule";
import { ShenQiZhongJiView } from 'System/hero/view/ShenQiZhongJiView';
import { HuanHuaItem } from 'System/hero/view/ShiZhuangPanel';
import { SpecialPriBasePanel } from 'System/hero/view/SpecialPriBasePanel';
import { ZhuFuZhaoHuiView } from 'System/NewZhuFuRule/ZhuFuZhaoHuiView';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { ZhufuSkillItemData } from 'System/skill/ZhufuSkillItemData';
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager';
import { GrowUpDrugTipView } from 'System/tip/view/GrowUpDrugTipView';
import { TipFrom } from 'System/tip/view/TipsView';
import { EffectType, UIEffect } from "System/uiEffect/UIEffect";
import { GroupList } from 'System/uilib/GroupList';
import { IconItem } from 'System/uilib/IconItem';
import { List, ListItem } from "System/uilib/List";
import { SkillIconItem } from 'System/uilib/SkillIconItem';
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility';
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil';
import { GameIDUtil } from 'System/utils/GameIDUtil';
import { PropUtil } from "System/utils/PropUtil";
import { RegExpUtil } from "System/utils/RegExpUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from 'System/utils/UIUtils';
import { TextGetSet } from "../../uilib/CommonForm";


/**坐骑用 （坐骑ZhufuRideBaseView 神器ZhufuBaseView 紫极魔瞳和鬼影迷踪NewZhufuBaseView 控鹤擒龙MagicCubeView）*/
export abstract class ZhufuRideBaseView extends SpecialPriBasePanel {
    /**特殊渠道获得,无需展示终极形象*/
    private special1: number = 13111;
    private special2: number = 13112;


    private MAX_HH_PROP_NUM: number = 7;
    /**自动强化时间间隔*/
    private readonly deltaTime: number = 100;
    /**
    * 装备列表的数据源。
    */
    private m_equipListData: BeautyEquipListItemData[];
    /**穿装备数据*/
    private m_bagEquipListData: BeautyEquipListItemData[] = [];

    private m_clickTimeout: number;

    /**
     * 对应装备容器
     */
    private m_containerID: number;

    ///**
    // *所有的属性汇总
    // */
    private m_allProps: GameConfig.EquipPropAtt[];

    /**
     *
     */
    private _nextConfig: GameConfig.ZhuFuConfigM;

    private m_propNum: number = 0;

    ///**
    // *当前强化按钮
    // */
    private BT_Begin: UnityEngine.GameObject;

    ///**
    // *自动强化
    // */
    BT_Auto: UnityEngine.GameObject;

    /**
     *是否自动强化
     */
    private m_isAuto: boolean;

    ///**
    // *消耗的材料
    // */
    private m_costData: MaterialItemData;

    //是否显示进阶日按钮
    private showBtnGotoJJR: boolean = false;
    private posEffectTarget: UnityEngine.Transform;
    ///**
    // *祝福值进度条
    // */
    private m_luckyLabel: UnityEngine.UI.Text;
    private m_luckyValue: string;
    private set luckyValue(value: string) {
        if (this.m_luckyValue != value) {
            this.m_luckyValue = value;
            this.m_luckyLabel.text = value;
        }
    }
    private slider: UnityEngine.UI.Slider;
    private m_luckySliderValue: number;
    private set luckySliderValue(value: number) {
        if (this.m_luckySliderValue != value) {
            this.m_luckySliderValue = value;
            this.slider.value = value;
        }
    }
    private m_costLabel: UnityEngine.UI.Text;
    private materialCost: UnityEngine.UI.RawImage;
    private m_costValue: string;
    private set costValue(value: string) {
        if (this.m_costValue != value) {
            this.m_costValue = value;
            this.m_costLabel.text = value;
        }
    }
    private m_hasLabel: UnityEngine.UI.Text;
    private materialHas: UnityEngine.UI.RawImage;
    private m_hasValue: string;
    private set hasValue(value: string) {
        if (this.m_hasValue != value) {
            this.m_hasValue = value;
            this.m_hasLabel.text = value;
        }
    }

    private m_pyText: string;
    private set pyText(value: string) {
        if (this.m_pyText != value) {
            this.m_pyText = value;
            this.BT_PY_TEXT.text = value;
        }
    }
    private m_pyLevel: string;
    private set pyLevel(value: string) {
        if (this.m_pyLevel != value) {
            this.m_pyLevel = value;
            this.pylevel.text = value;
        }
    }

    /**
     * 老的祝福值
     */
    private limitText: UnityEngine.UI.Text;

    /**
     * 老的祝福值
     */
    private m_oldLucky: number = -1;

    /**
     *上一级
     */
    private m_oldLevel: number = -1;

    /**
     * 最大属性值
     */
    private static MAX_PROP_NUM: number = 10;
    private static MAX_SKILL_NUM: number = 2;
    private static LEVEL_NUM: number = 10;
    private m_skillData: ZhufuSkillItemData[];
    private _attList: List;
    private _attListData: HeroAttItemData[] = [];
    private _attListDic: {};
    private title: string = "";

    /*标题*/
    private txtEquipTitle: UnityEngine.UI.Text;
    private txtSkillTitle: UnityEngine.UI.Text;
    /**
    *技能列表
    */
    private m_skillList: List;
    private skillItems: SkillIconItem[] = [];
    protected modelRoot: UnityEngine.GameObject;
    private currentData: Protocol.CSHeroSubSuper;
    private currentConfig: GameConfig.ZhuFuConfigM;
    private currentStage: number;
    private levelObjects: UnityEngine.GameObject[] = [];
    private levelObjectsActive: boolean[] = [];
    private equipList: List;
    private equipItems: IconItem[] = [];
    protected upgradeTitle: UnityEngine.UI.Text;
    protected upgradeType1: UnityEngine.GameObject;
    protected upgradeType2: UnityEngine.GameObject;
    private rideEfects: UIEffect[] = [];
    /**成长丹*/
    private btnCzd: UnityEngine.GameObject;
    private czdTipMark: UnityEngine.GameObject;
    /***资质丹 */
    private btnZzd: UnityEngine.GameObject;
    private zzdTipMark: UnityEngine.GameObject;
    private oldmodelURL: string;
    private zhufuTime: UnityEngine.UI.Text;
    private czdConfig: GameConfig.ZhuFuDrugConfigM;
    private zzdConfig: GameConfig.ZhuFuDrugConfigM;
    private isZhuFu: boolean = false;
    private isLevel: boolean = false;
    protected y: number = 0;
    //粒子特效
    private liziEffectRoot: UnityEngine.GameObject;
    private txtLv: UnityEngine.UI.Text;
    private txtName: UnityEngine.UI.Text;
    ////////////////////祝福找回和保留相关//////////////////////////
    private zfzhPanel: UnityEngine.GameObject;
    private btn_baoliu: UnityEngine.GameObject;
    private btn_zhuihui: UnityEngine.GameObject;
    /**衰减的值*/
    private shuaiJianZhuFuValue: number = 0;
    /**现在的值，衰减的值*/
    private currentZhuFuValue: number = 0;
    /**当前阶级最大值*/
    private stageZhuFuMaxValue: number = 0;
    protected isZhufuDecrease = false;
    private curLevel: number = -1;
    private oldLevel: number = -1;
    private newDianRoot: UnityEngine.GameObject;
    private zhenFaZhuFuText: UnityEngine.UI.Text;
    private isFirstOpen: boolean = true;
    //是否提示使用万用进阶丹
    private static isNotTip: boolean = false;
    private static isNotTipAgain: boolean = false;
    private static isNotTipThirdConfirm: boolean = false;

    //进阶丹信息提示的按钮
    private BtnJInjieDan: UnityEngine.GameObject;
    private BtnWanyongJInjieDan: UnityEngine.GameObject;

    /////////////////vip白金加成////////////////////
    private vipbaijinObj: UnityEngine.GameObject;
    private vipAddText: UnityEngine.UI.Text;

    // 特殊特权的图标名字
    protected specialVipIconName: string;

    /**打开面板时指定要显示的image id*/
    private openId: number = 0;

    //扩展的幻化界面内容，这个类之后再分类下
    protected funcGroup: UnityEngine.UI.ActiveToggleGroup;
    private jinjiePanel: UnityEngine.GameObject;
    private huanhuaPanel: UnityEngine.GameObject;
    private normalList: List = null;
    private groupList: GroupList = null;

    private groupListItemSeason: List;
    private groupListItemSpecial: List;
    private groupListItemNormal: List;
    /**总数据(进阶&特殊  注:赛季是从特殊里面分出来的)*/
    private huanhuazhuFuData = [];
    /**数据分类  对总数据  进行分类(赛季/特殊/进阶)*/
    private dicHuanhauData: { [name: string]: any[] } = null;
    /**赛季坐骑*/
    private readonly NAME_SEASON: string = "赛季坐骑";
    /**特殊坐骑*/
    private readonly NAME_SPECIAL: string = "特殊坐骑";
    /**进阶坐骑*/
    private readonly NAME_NORMAL: string = "进阶坐骑";
    private condition: UnityEngine.UI.Text;
    private btnHuanHua: UnityEngine.GameObject;
    private mcUse: UnityEngine.GameObject;
    private m_pyMaterialData: MaterialItemData;
    private peiyangPanel: UnityEngine.GameObject;
    private BT_PY: UnityEngine.GameObject;
    private BT_PY_TEXT: UnityEngine.UI.Text;
    private m_pyMaterialIconItem: IconItem;
    private props: UnityEngine.GameObject;
    private pylevel: UnityEngine.UI.Text;
    private pyIcon: UnityEngine.GameObject;
    private maxTip: UnityEngine.GameObject;
    private leftTime = 0;
    private selectedCFGID = 0;
    //////private oldhuanhuazhuFuData = [];

    //进阶日跳转

    private btnGotoJJR: UnityEngine.GameObject;
    private jjRankTipMark: UnityEngine.GameObject;

    private oldShowModel: number = 0;

    private upEffect: UnityEngine.GameObject;
    private zhufuPlusEffect: UnityEngine.GameObject;
    //private textZhufuPlus: UnityEngine.UI.Text;

    //神器飞升特性
    private succeedUIEffect: UIEffect;
    private failedUIEffect: UIEffect;

    //幻化面板名字 + 战斗力
    private txtRideName: TextGetSet;
    private txtRideFight: TextGetSet;

    /**当这个值为false时自动选中失效*/
    private isHHAutoSelect: boolean = true;
    /**用来减少幻化红点的刷新次数,打开面板和数据改变时才刷新*/
    private isHHRefreshTipMark: boolean = false;
    private _HHGroupListSelected: number = -1;
    /**用来优化数据设置,仅打开面板和数据改变时才设置数据*/
    private isDataChange: boolean = false;

    constructor(id: number, isZhufuDecrease: boolean, specialVipPara: number, specialVipIconName: string) {
        super(id, specialVipPara);
        this.specialVipIconName = specialVipIconName;
        this.isZhufuDecrease = isZhufuDecrease;
    }

    protected resPath(): string {
        return UIPathData.ZhuFuView;
    }

    public setTitile(title: string) {
        this.title = title;
        this.upgradeTitle.text = title + "进阶";
        this.txtEquipTitle.text = title + "装备";
        this.txtSkillTitle.text = title + "技能";
    }

    open(openId: number = 0) {
        this.openId = openId;
        super.open();
    }

    protected initElements(): void {
        super.initElements();

        this.txtEquipTitle = this.elems.getText("txtEquip");
        this.txtSkillTitle = this.elems.getText("txtSkill");

        this.slider = this.elems.getSlider("slider");
        this.limitText = this.elems.getText("limitText");
        this.BT_Begin = this.elems.getElement("BT_Begin");
        this.BT_Auto = this.elems.getElement("BT_Auto");
        this.pylevel = this.elems.getText("pylevel");
        this.m_containerID = GameIDUtil.getContainerIDBySubtype(this.id);
        //添加特效
        let mcLevels = this.elems.getTransform("mcLevels");
        let effectPrefab = this.elems.getElement("rideEffect");
        for (let i = 0; i < ZhufuRideBaseView.LEVEL_NUM; i++) {
            let effect = new UIEffect();
            let item = Game.Tools.GetChild(mcLevels, i.toString());
            effect.setEffectPrefab(effectPrefab, item);
            this.levelObjects[i] = item;
            this.levelObjectsActive[i] = true;
            this.rideEfects[i] = effect;
        }
        this.m_luckyLabel = this.elems.getText("zhufu");
        this.posEffectTarget = this.m_luckyLabel.transform;
        this._attList = this.elems.getUIList("attributeList");
        this.equipList = this.elems.getUIList("equipList");
        this.m_costLabel = this.elems.getText("cost");
        this.materialCost = this.elems.getRawImage("materialCost");
        this.BtnJInjieDan = this.elems.getElement("BtnJInjieDan");
        this.BtnWanyongJInjieDan = this.elems.getElement("BtnWanyongJInjieDan");
        this.m_hasLabel = this.elems.getText("has");
        this.materialHas = this.elems.getRawImage("materialHas");
        this.m_skillList = this.elems.getUIList("skillList");
        this.upgradeTitle = this.elems.getText("upgradeTitle");
        this.upgradeType1 = this.elems.getElement("type1");
        this.upgradeType2 = this.elems.getElement("type2");
        this.m_equipListData = [];
        let ctnId = GameIDUtil.getContainerIDBySubtype(this.id);
        for (var i: number = 0; i < 4; i++) {
            this.m_equipListData.push(new BeautyEquipListItemData());
            this.m_equipListData[i].thingItemData.containerID = ctnId;
        }
        // 装备列表
        this.equipList.Count = 4;
        for (let i: number = 0; i < 4; i++) {
            let item = this.equipList.GetItem(i);
            let iconItem = new IconItem();
            iconItem.effectRule = EnumEffectRule.none;
            let obj = item.gameObject;
            iconItem.setUsuallyEquip(obj);
            this.equipItems.push(iconItem);
            this.m_equipListData.push(new BeautyEquipListItemData());
            Game.UIClickListener.Get(obj).onClick = delegate(this, this.onClickEquipIcon, iconItem);
        }
        // 技能列表
        this.m_skillData = [];
        this.m_skillList.Count = ZhufuRideBaseView.MAX_SKILL_NUM;
        for (let i: number = 0; i < ZhufuRideBaseView.MAX_SKILL_NUM; i++) {
            let item = this.m_skillList.GetItem(i);
            let iconItem = new SkillIconItem(true);
            iconItem.setUsually(item.gameObject);
            iconItem.needShowLv = true;
            iconItem.needArrow = true;
            this.skillItems.push(iconItem);
            this.m_skillData[i] = new ZhufuSkillItemData();

        }
        this.m_skillList.Selected = 0;
        this.m_allProps = [];
        for (i = 0; i < ZhufuRideBaseView.MAX_PROP_NUM; i++) {
            this.m_allProps[i] = { m_ucPropId: 0, m_ucPropValue: 0 };
        }
        this.m_costData = new MaterialItemData();
        //成长丹，资质丹
        this.btnCzd = this.elems.getElement("btnCzd");
        this.btnZzd = this.elems.getElement("btnZzd");
        this.zhufuTime = this.elems.getText("zhufuTime");
        this.czdTipMark = this.elems.getElement("czdTipMark");
        this.zzdTipMark = this.elems.getElement("zzdTipMark");
        //粒子特效
        this.liziEffectRoot = this.elems.getElement("liziEffectRoot");
        this.txtLv = this.elems.getText("txtLv");
        this.txtName = this.elems.getText("txtName");
        //祝福新规则相关，找回和保留
        this.zfzhPanel = this.elems.getElement("zfzhPanel");
        this.btn_baoliu = ElemFinder.findObject(this.zfzhPanel, "btn_baoLiu");
        this.btn_zhuihui = ElemFinder.findObject(this.zfzhPanel, "btn_zhuihui");
        this.newDianRoot = this.elems.getElement("newDianRoot");
        this.newDianRoot.SetActive(false);

        if (this.isZhufuDecrease) {
            this.zhenFaZhuFuText = ElemFinder.findText(this.upgradeType2, "label4");
            this.zhenFaZhuFuText.text = KeyWord.getDesc(KeyWord.GROUP_HERO_SUB_TYPE, this.Id) + "到达5阶后,每日24:00,该进阶系统的的祝福值衰减为当前祝福值的80%";
            this.upgradeType1.SetActive(false);
            this.upgradeType2.SetActive(true);
            this.zfzhPanel.SetActive(true);
        } else {
            this.upgradeType1.SetActive(true);
            this.upgradeType2.SetActive(false);
            this.zfzhPanel.SetActive(false);
        }
        // 特殊特权
        if (this.specialVipPara > 0) {
            let vipTeShuDesText = ElemFinder.findText(this.vipTeShuObj, 'desText');
            //let vipTeShuIcon = ElemFinder.findImage(this.vipTeShuObj, 'icon');
            let vipTeShuAltas = ElemFinderMySelf.findAltas(this.elems.getElement('altas'));
            //vipTeShuIcon.sprite = vipTeShuAltas.Get(this.specialVipIconName);
            let specialVipPct = G.DataMgr.vipData.getSpecialPriPct(this.specialVipPara) * 100;
            vipTeShuDesText.text = this.specialVipIconName + uts.format('\n加成{0}%', specialVipPct);
        }

        //vip加成
        this.vipbaijinObj = this.elems.getElement('VipAddFight');
        this.vipAddText = ElemFinder.findText(this.vipbaijinObj, 'vipAddText');

        //幻化内容
        this.funcGroup = this.elems.getToggleGroup("funcGroup");
        this.funcGroup.onValueChanged = delegate(this, this.onSelectChange);
        this.jinjiePanel = this.elems.getElement("jinjiePanel");
        this.huanhuaPanel = this.elems.getElement("huanhuaPanel");
        this.normalList = this.elems.getUIList('huanhuaList')
        this.groupList = this.elems.getUIGroupList('groupList')
        this.condition = this.elems.getText('condition');
        this.btnHuanHua = this.elems.getElement('btnHuanHua');
        this.mcUse = this.elems.getElement('mcUse');

        this.peiyangPanel = this.elems.getElement("peiyangPanel");
        this.BT_PY = this.elems.getElement("BT_PY");
        this.BT_PY_TEXT = ElemFinder.findText(this.BT_PY, "Text");
        this.pyIcon = this.elems.getElement("pyIcon");
        this.maxTip = this.elems.getElement("maxTip");
        this.m_pyMaterialIconItem = new IconItem();
        this.m_pyMaterialIconItem.setUsualIconByPrefab(this.elems.getElement('itemIcon_Normal'), this.pyIcon);
        this.m_pyMaterialIconItem.setTipFrom(TipFrom.normal);
        this.m_pyMaterialData = new MaterialItemData();
        this.props = this.elems.getElement('props');
        //////this.normalList.onVirtualItemChange = delegate(this, this.onUpdateItem);
        this.txtRideName = new TextGetSet(this.elems.getText("txtRideName"));
        this.txtRideFight = new TextGetSet(this.elems.getText("txtRideFight"));




        //进阶日跳转按钮
        this.btnGotoJJR = this.elems.getElement("btnGotoJJR");
        this.jjRankTipMark = this.elems.getElement("jjRankTipMark");

        this.upEffect = this.elems.getElement('upEffect');
        this.upEffect.SetActive(false);
        this.zhufuPlusEffect = this.elems.getElement('zhufuPlusEffect');
        this.zhufuPlusEffect.SetActive(false);
        //this.textZhufuPlus = this.elems.getText('textZhufuPlus');

        //特效
        let succeedPrefab = this.elems.getElement('feiscg');
        let failedPrefab = this.elems.getElement('feissb');
        this.succeedUIEffect = new UIEffect();
        this.failedUIEffect = new UIEffect();
        this.succeedUIEffect.setEffectObject(succeedPrefab);
        this.failedUIEffect.setEffectObject(failedPrefab);

        //初始化左侧选择列表
        this.dicHuanhauData = {};
        this.dicHuanhauData[this.NAME_NORMAL] = [];
        this.dicHuanhauData[this.NAME_SPECIAL] = [];
        this.groupList.Count = 3;
        for (let i = 0; i < 3; i++) {
            let item = this.groupList.GetItem(i);
            let name = this.NAME_SEASON;
            if (i == 1) name = this.NAME_SPECIAL;
            if (i == 2) name = this.NAME_NORMAL;
            let txtname = ElemFinder.findText(item.gameObject, "citem/normal/txtName");
            txtname.text = name;
            txtname = ElemFinder.findText(item.gameObject, "citem/selected/txtName");
            txtname.text = name;
        }
        this.groupListItemSeason = this.groupList.GetSubList(0);
        this.groupListItemSpecial = this.groupList.GetSubList(1);
        this.groupListItemNormal = this.groupList.GetSubList(2);
        this.groupListItemSeason.onVirtualItemChange = delegate(this, this.onUpdateItemSeason);
        this.groupListItemSpecial.onVirtualItemChange = delegate(this, this.onUpdateItemSpecial);
        this.groupListItemNormal.onVirtualItemChange = delegate(this, this.onUpdateItemNormal);
    }

    protected initListeners(): void {
        super.initListeners();

        this.addClickListener(this.BT_Begin, this.onBeginClick);
        this.addClickListener(this.BT_Auto, this.onAutoClick);
        //this.addClickListener(this.m_costLabel.gameObject, this.onClickTextOpenTip);
        this.addClickListener(this.BtnJInjieDan, this.onClickTextOpenTip);
        this.addClickListener(this.BtnWanyongJInjieDan, this.onClickWanyongTextOpenTip);
        this.addClickListener(this.btnCzd, this.onClickCzd);
        this.addClickListener(this.btnZzd, this.onClickZzd);
        //祝福系规则相关
        this.addClickListener(this.btn_baoliu, this.onClickBtnBaoLiuZhuFu);
        this.addClickListener(this.btn_zhuihui, this.onClickBtnZhuiHuiZhuFu);

        //////this.addListClickListener(this.normalList, this.onClickList);
        this.addListClickListener(this.groupList, this.onClickGroupList);
        this.addListClickListener(this.groupListItemSeason, this.onClickSeasonList);
        this.addListClickListener(this.groupListItemSpecial, this.onClickSpecialList);
        this.addListClickListener(this.groupListItemNormal, this.onClickNormalList);

        this.addClickListener(this.btnHuanHua, this.onClickHuanHuaBt);
        this.addClickListener(this.BT_PY, this.onClickBtnPy);
        this.addClickListener(this.btnGotoJJR, this.onClickGotoJJR);

    }

    protected onOpen() {
        super.onOpen();

        //进阶日跳转的显示，红点
        // this.showBtnGotoJJR = G.DataMgr.activityData.isShowJJRGotoBtn(this.id);
        // this.btnGotoJJR.SetActive(this.showBtnGotoJJR);

        // this.jjRankTipMark.SetActive(this.showBtnGotoJJR && G.DataMgr.runtime.isFirstShouldShowJJRTipMark);
        // if (this.showBtnGotoJJR) {
        //     G.DataMgr.runtime.isFirstShouldShowJJRTipMark = false;
        // }

        let level = 0;
        let data = G.DataMgr.zhufuData.getData(this.id);
        this.m_oldLucky = data.m_uiLucky;
        this.isHHAutoSelect = true;
        this.isHHRefreshTipMark = true;
        this.isDataChange = true;
        if (data.m_ucLevel == ZhufuData.getZhuFuMaxLevel(this.id)) {
            level = 10;
        }
        else {
            level = (data.m_ucLevel - 1) % 10;
        }
        this.oldLevel = level;
        G.DataMgr.zhufuData.currentOtherPanelData = G.DataMgr.zhufuData.getData(this.id) as Protocol.CSHeroSubSuper;
        this.czdConfig = G.DataMgr.zhufuData.getDrugConfigByType(KeyWord.HERO_SUB_DRUG_TYPE_CZ, this.id);
        this.zzdConfig = G.DataMgr.zhufuData.getDrugConfigByType(KeyWord.HERO_SUB_DRUG_TYPE_ZZ, this.id);
        if (this.isZhufuDecrease) {
            this.addTimer("zhufu", 1000, 0, this.onRefreshZfValueTip);
        }
        this.updateView();
        this.updateLimit();
        //粒子特效，放init，没播放完，关闭界面，再次打开不会在播放特效
        G.ResourceMgr.loadModel(this.liziEffectRoot, UnitCtrlType.other, "effect/ui/MR_shengji.prefab", this.sortingOrder);
        this.liziEffectRoot.SetActive(false);
        //vip白金加成
        this.vipbaijinObj.SetActive(this.getVipBaiJinActive());
        this.vipAddText.text = this.getVipBaiJinDes();
        if (this.openId > 10000) {
            this.funcGroup.Selected = 1;
            this.updateHHView();
        }
        else {
            this.funcGroup.Selected = 0;
        }
        if (this.openUpdateTips) {
            this.updateTips(this.showJinjie, this.showHuanhua);
            this.openUpdateTips = false;
        }
        this.checkJinJieFu();
    }
    private openUpdateTips: boolean;
    private showJinjie: boolean;
    private showHuanhua: boolean;
    public updateTips(showJinjie: boolean, showHuanhua: boolean) {
        this.showJinjie = showJinjie;
        this.showHuanhua = showHuanhua;
        if (this.funcGroup != null) {
            //更新页签tips
            this.setTabGroupTipMark(this.funcGroup, 0, showJinjie);
            this.setTabGroupTipMark(this.funcGroup, 1, showHuanhua);
        }
        else {
            this.openUpdateTips = true;
        }
    }

    protected onClose() {
        G.ResourceMgr.loadModel(this.modelRoot, 0, null, 0);
        this.oldmodelURL = null;
        this.m_oldLucky = -1;
        this._stopAuto();
        G.DataMgr.zhufuData.currentOtherPanelData = null;
        for (let i = 0; i < ZhufuRideBaseView.LEVEL_NUM; i++) {
            this.rideEfects[i].stopEffect();
        }
        this.liziEffectRoot.SetActive(false);
        this.newDianRoot.SetActive(false);
        this.oldShowModel = null;
    }

    private updateHHView() {
        if (this.isDataChange) {
            let zhufuData = G.DataMgr.zhufuData;
            if (zhufuData.getData(this.id) == null) {
                uts.log("未初始化");
                return;
            }
            //////let selectedindex = 0;
            //一级列表的自动选择
            let selectedFirstIndex = -1;
            //二级列表的自动选择
            let selectedSecondIndex = -1;
            let checkID = this.openId;
            if (this.openId == 0) {
                // checkID = zhufuData.getImageUnLevelID(data.m_uiShowID);
                checkID = zhufuData.getImageUnLevelID(this.selectedCFGID);
            }
            //////let images: number[] = zhufuData.getImageID(this.id);
            //////let zhuFuData = [];
            //////进阶外形
            //////let selectCfg: GameConfig.ZhuFuConfigM;
            let unsameArray: number[] = [];
            this.huanhuazhuFuData = [];
            this.dicHuanhauData[this.NAME_SEASON] = [];
            this.dicHuanhauData[this.NAME_SPECIAL] = [];
            this.dicHuanhauData[this.NAME_NORMAL] = [];
            //进阶外形数据 已激活的
            let activeList = [];
            //进阶外形数据 未激活的
            let inactiveList = [];
            let cfgs: { [key: number]: GameConfig.ZhuFuConfigM } = zhufuData.getConfigs(this.id);
            //处理进阶外形数据(过滤重复之类的)
            for (let key in cfgs) {
                let cfg = cfgs[key];
                if (cfg.m_iModelID != 0 && unsameArray.indexOf(cfg.m_iModelID) == -1) {
                    //过滤重复模型
                    unsameArray.push(cfg.m_iModelID);
                    if (zhufuData.isActive(this.id, cfg.m_iID)) {
                        activeList.push(cfg);
                    }
                    else {
                        inactiveList.push(cfg);
                    }
                }
            }
            //进阶外形数据排序
            activeList.sort(ZhufuData.huanHuaListCompare);
            inactiveList.sort(ZhufuData.huanHuaListCompare);

            //获取所有特殊外形 配置
            let ids = zhufuData.getImageID(this.id);
            //特殊外形 过滤 赛季外显
            let iddata = ids.filter(G.DataMgr.zhufuData.fitterData);
            //特殊外形数据排序
            iddata.sort(ZhufuData.huanHuaSpecialCompare);
            let thingData = G.DataMgr.thingData;
            //处理特殊外形数据(过滤重复之类的)
            for (let i = 0, len = iddata.length; i < len; i++) {
                let data = iddata[i];
                if (zhufuData.isActive(this.id, data)) {
                    if (i == 0 && zhufuData.isDress(this.id, data)) {
                        activeList.splice(0, 0, data);
                    }
                    else {
                        activeList.push(data);
                    }
                    let unlevelID = zhufuData.getImageUnLevelID(data);
                    let index = unsameArray.indexOf(unlevelID);
                    if (index != -1) {
                        inactiveList.splice(index, 1);
                    }
                    unsameArray.push(unlevelID);
                }
                else {
                    let unlevelID = zhufuData.getImageUnLevelID(data);
                    if (data != 0 && unsameArray.indexOf(unlevelID) == -1) {
                        //过滤重复模型
                        unsameArray.push(unlevelID);

                        let have = thingData.checkThingIDForZhufu(this.id, data);
                        if (have) {
                            inactiveList.splice(0, 0, zhufuData.getImageLevelID(unlevelID, 1));
                        }
                        else {
                            inactiveList.push(zhufuData.getImageLevelID(unlevelID, 1));
                        }
                    }
                }
            }

            //下面两个for 把数据都加到huanhuazhuFuData,然后分类
            for (let i of activeList) {
                this.huanhuazhuFuData.push(i);
            }
            for (let i of inactiveList) {
                this.huanhuazhuFuData.push(i);
            }

            //数据分类
            let count = this.huanhuazhuFuData.length;
            for (let i = 0; i < count; i++) {
                let data = this.huanhuazhuFuData[i];
                let byid = typeof (data) == "number";
                if (byid) {
                    let cfg = zhufuData.getImageConfig(data);
                    if (cfg) {
                        if (cfg.m_iFuncID == KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN) {
                            let saiJICfg = zhufuData.getSaiJiCfgByImageId(cfg.m_uiImageId);
                            if (saiJICfg && saiJICfg.m_iSeasonID <= zhufuData.getSaiJiMax()) {
                                //赛季坐骑数据
                                this.dicHuanhauData[this.NAME_SEASON].push(data);
                            }
                        } else {
                            //特殊坐骑数据
                            this.dicHuanhauData[this.NAME_SPECIAL].push(data);
                        }
                    }
                }
                else {
                    //进阶坐骑数据
                    this.dicHuanhauData[this.NAME_NORMAL].push(data);
                }
            }
            //分类后排序
            this.dicHuanhauData[this.NAME_SEASON].sort(ZhufuData.huanHuaSpecialCompare);
            this.dicHuanhauData[this.NAME_SPECIAL].sort(ZhufuData.huanHuaSpecialCompare);
            this.dicHuanhauData[this.NAME_NORMAL].sort(ZhufuData.huanHuaListCompare);

            //确定当前选中 只判断是否是特殊的时装（收费时装）
            ////count = this.dicHuanhauData[this.NAME_SPECIAL].length;

            ////for (let i = 0; i < count; i++) {
            ////    let data = this.dicHuanhauData[this.NAME_SPECIAL][i];
            ////    if (checkID == 0) {
            ////        //没有默认选择的模型
            ////        let cfg: GameConfig.ZhuFuImageConfigM = zhufuData.getImageConfig(data);
            ////        let isdress: boolean = zhufuData.isDress(cfg.m_iZhuFuID, data);
            ////        if (isdress) {
            ////            selectedFirstIndex = 0;
            ////            break;
            ////        }
            ////    }
            ////    else {
            ////        if (checkID == zhufuData.getImageUnLevelID(data)) {
            ////            selectedFirstIndex = 0;
            ////            selectedSecondIndex = i;
            ////            break;
            ////        }
            ////    }

            ////}
            ////if (selectedFirstIndex == -1) {
            ////    count = this.dicHuanhauData[this.NAME_NORMAL].length;
            ////    for (let i = 0; i < count; i++) {
            ////        let data = this.dicHuanhauData[this.NAME_NORMAL][i];
            ////        if (checkID == (data as GameConfig.ZhuFuConfigM).m_iID) {
            ////            selectedFirstIndex = 1;
            ////            selectedSecondIndex = i;
            ////            break;
            ////        }
            ////    }
            ////}

            ////if (selectedFirstIndex == -1)
            ////    selectedFirstIndex = 1;
            ////selectedSecondIndex = Math.max(0, selectedSecondIndex);





            this.groupListItemSeason.Count = this.dicHuanhauData[this.NAME_SEASON].length;
            this.groupListItemSpecial.Count = this.dicHuanhauData[this.NAME_SPECIAL].length;
            this.groupListItemNormal.Count = this.dicHuanhauData[this.NAME_NORMAL].length;
        }
        //处理自动选择
        //先选择有红点的(特殊->赛季)
        //再处理没有红点的 选中身上穿的(特殊->赛季->进阶)
        if (this.isHHAutoSelect) {
            if (this.isHHRefreshTipMark)
                this.setHHTipMark();
            this.isHHRefreshTipMark = false;
            this.isHHAutoSelect = false;
            /**打开面板时传进来openId就自动选中*/
            let isSet: boolean = false;//标记是否已经自动选中了
            let len = this.dicHuanhauData[this.NAME_SPECIAL].length;
            for (let i = 0; i < len; i++) {
                //传进来ImageId或者有可提升
                if ((this.openId > 10000 && this.openId == Math.floor(this.dicHuanhauData[this.NAME_SPECIAL][i] / 1000)) ||
                    G.DataMgr.thingData.checkThingIDForZhufu(this.id, this.dicHuanhauData[this.NAME_SPECIAL][i])) {
                    this.groupList.Selected = 1;
                    this.groupListItemSpecial.Selected = i;
                    isSet = true;
                    break;
                }
            }
            if (!isSet) {
                len = this.dicHuanhauData[this.NAME_SEASON].length;
                for (let j = 0; j < len; j++) {
                    //传进来ImageId或者有可提升
                    if ((this.openId > 10000 && this.openId == Math.floor(this.dicHuanhauData[this.NAME_SEASON][j] / 1000)) ||
                        G.DataMgr.thingData.checkThingIDForZhufu(this.id, this.dicHuanhauData[this.NAME_SEASON][j])) {
                        this.groupList.Selected = 0;
                        this.groupListItemSeason.Selected = j;
                        isSet = true;
                        break;
                    }
                }
            }
            if (!isSet) {//没有红点
                /**穿戴的数据 */
                let wearData: Protocol.CSHeroSubSuper = G.DataMgr. zhufuData.getData(this.id);
                //选中身上穿的
                if (wearData && wearData.m_uiShowID > 0) {//身上穿祝福的
                    let showId = Math.floor(wearData.m_uiShowID/1000);
                    let isSet2: boolean = false;//标记是否已经自动选中了
                    len = this.dicHuanhauData[this.NAME_SPECIAL].length;
                    for (let i = 0; i < len; i++) {
                        if (showId == Math.floor(this.dicHuanhauData[this.NAME_SPECIAL][i] /1000)) {
                            this.groupList.Selected = 1;
                            this.groupListItemSpecial.Selected = i;
                            isSet2 = true;
                            break;
                        }
                    }
                    if (!isSet2) {//身上没有穿特殊的
                        len = this.dicHuanhauData[this.NAME_SEASON].length;
                        for (let j = 0; j < len; j++) {
                            if (showId == Math.floor(this.dicHuanhauData[this.NAME_SEASON][j] / 1000)) {
                                this.groupList.Selected = 0;
                                this.groupListItemSeason.Selected = j;
                                isSet2 = true;
                                break;
                            }
                        }
                    }
                    if (!isSet2) {//身上没有穿赛季的 也没有特殊的
                        this.groupList.Selected = 2;
                        this.groupListItemNormal.Selected = 0;
                    }
                } else {
                    this.groupList.Selected = 1;
                    this.groupListItemSpecial.Selected = 0;
                }
            }

        }
        this._HHGroupListSelected = this.groupList.Selected;
        if (this.funcGroup.Selected == 1)//选中了右上角幻化页签,才更新幻化相关的显示
            switch (this.groupList.Selected) {
                case 0://赛季
                    this.updateSpecialPanel(this.dicHuanhauData[this.NAME_SEASON][this.groupListItemSeason.Selected]);
                    break;
                case 1://特殊
                    this.updateSpecialPanel(this.dicHuanhauData[this.NAME_SPECIAL][this.groupListItemSpecial.Selected]);
                    break;
                case 2://进阶
                    this.updateJinJiePanel(this.dicHuanhauData[this.NAME_NORMAL][this.groupListItemNormal.Selected]);
                    break;
            }

        //////幻化左侧为一个列表时的逻辑
        //////this.normalList.Count = this.huanhuazhuFuData.length;
        //////for (let i = 0; i < this.huanhuazhuFuData.length; i++) {
        //////    let data = this.huanhuazhuFuData[i];
        //////    let byid = typeof (data) == "number";
        //////    if (byid) {
        //////        if (checkID == zhufuData.getImageUnLevelID(data)) {
        //////            selectedindex = i;
        //////        }
        //////    }
        //////    else {
        //////        if (checkID == (data as GameConfig.ZhuFuConfigM).m_iID) {
        //////            selectedindex = i;
        //////        }
        //////    }
        //////}

        ////if (this.groupList.Selected != selectedFirstIndex) {
        ////    this.groupList.Selected = selectedFirstIndex
        ////    this.onClickGroupList(selectedFirstIndex);
        ////}
        ////if (selectedFirstIndex == 0) {
        ////    this.groupListItemSpecial.Selected = selectedSecondIndex;
        ////    this.onClickSpecialList(selectedSecondIndex);
        ////} else {
        ////    this.groupListItemNormal.Selected = selectedSecondIndex;
        ////    this.onClickNormalList(selectedSecondIndex);
        ////}
        ////this.groupListItemSpecial.Refresh();
        ////this.groupListItemNormal.Refresh();
        //////特殊坐骑红点
        ////let mask = ElemFinder.findObject(this.groupList.GetItem(0).gameObject, "citem/tipMark");
        ////mask.SetActive(G.DataMgr.zhufuData.isRideSpaceShowTipsMark());

        //////if (this.normalList.Selected != selectedindex) {
        //////    this.normalList.Selected = selectedindex;
        //////}
        //////if (this.oldhuanhuazhuFuData.length == this.huanhuazhuFuData.length) {
        //////    for (let i = 0, len = this.oldhuanhuazhuFuData.length; i < len; i++) {
        //////        let a = this.oldhuanhuazhuFuData[i];
        //////        let b = this.huanhuazhuFuData[i];
        //////        if (a != b) {
        //////            if (typeof (a) == "number" && typeof (b) == "number") {
        //////                if (zhufuData.getImageUnLevelID(a) != zhufuData.getImageUnLevelID(b)) {
        //////                    this.normalList.ScrollByAxialRow(selectedindex);
        //////                }
        //////            }
        //////            else {
        //////                this.normalList.ScrollByAxialRow(selectedindex);
        //////            }
        //////            break;
        //////        }
        //////    }
        //////}
        //////else {
        //////    this.normalList.ScrollByAxialRow(selectedindex);
        //////}
        //////this.normalList.Refresh();
        //////this.oldhuanhuazhuFuData = this.huanhuazhuFuData;
        //////let selectData = this.huanhuazhuFuData[selectedindex];
        //////if (typeof (selectData) == "number") {
        //////    this.updateSpecialPanel(selectData);
        //////}
        //////else {
        //////    this.updateJinJiePanel(selectData);
        //////}
        //////this.openId = 0;
    }


    /**设置幻化相关的红点逻辑 */
    private setHHTipMark() {
        let hasThing: boolean = false;
        //幻化一级列表 赛季 红点
        let mask = ElemFinder.findObject(this.groupList.GetItem(0).gameObject, "citem/tipMark");
        //标记赛季和特殊列表是否有红点
        let show: boolean = false;
        let show2: boolean = false;
        for (let j = 0; j < this.dicHuanhauData[this.NAME_SEASON].length; j++) {
            hasThing = G.DataMgr.thingData.checkThingIDForZhufu(this.id, this.dicHuanhauData[this.NAME_SEASON][j]);
            if (hasThing) {
                show = true;
                show2 = true;
                break;
            }
        }
        //设置 赛季列表的红点
        mask.SetActive(show2);
        //幻化一级列表 特殊 红点
        mask = ElemFinder.findObject(this.groupList.GetItem(1).gameObject, "citem/tipMark");
        show2 = false;
        for (let i = 0; i < this.dicHuanhauData[this.NAME_SPECIAL].length; i++) {
            hasThing = G.DataMgr.thingData.checkThingIDForZhufu(this.id, this.dicHuanhauData[this.NAME_SPECIAL][i]);
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

    //////注释幻化列表为一个类别的情况,不删,防止策划要改回来
    //////private onUpdateItem(item: ListItem) {
    //////    let index = item._index;
    //////    let data = this.huanhuazhuFuData[index];
    //////    let huanhuaitem = item.data.huanhuaitem as HuanHuaItem;
    //////    if (!huanhuaitem) {
    //////        let obj = this.normalList.GetItem(index).gameObject;
    //////        huanhuaitem = new HuanHuaItem();
    //////        huanhuaitem.setItem(obj);
    //////        item.data.huanhuaitem = huanhuaitem;
    //////    }
    //////    let byid = typeof (data) == "number";
    //////    if (byid) {
    //////        huanhuaitem.updateById(data);
    //////    }
    //////    else {
    //////        huanhuaitem.updateByCfg(data);
    //////    }
    //////    huanhuaitem.updateView();
    //////}

    /**
  * 赛季坐骑
  * @param item
  */
    private onUpdateItemSeason(item: ListItem) {
        let index = item._index;
        let data = this.dicHuanhauData[this.NAME_SEASON][index];
        let huanhuaitem = item.data.huanhuaitem as HuanHuaItem;
        if (!huanhuaitem) {
            let obj = this.groupListItemSeason.GetItem(index).gameObject;
            huanhuaitem = new HuanHuaItem();
            huanhuaitem.setItem(obj);
            item.data.huanhuaitem = huanhuaitem;
        }
        huanhuaitem.updateById(data);
        huanhuaitem.updateView();

    }


    /**
     * 特殊坐骑
     * @param item
     */
    private onUpdateItemSpecial(item: ListItem) {
        let index = item._index;
        let data = this.dicHuanhauData[this.NAME_SPECIAL][index];
        let huanhuaitem = item.data.huanhuaitem as HuanHuaItem;
        if (!huanhuaitem) {
            let obj = this.groupListItemSpecial.GetItem(index).gameObject;
            huanhuaitem = new HuanHuaItem();
            huanhuaitem.setItem(obj);
            item.data.huanhuaitem = huanhuaitem;
        }
        huanhuaitem.updateById(data);
        huanhuaitem.updateView();

    }
    /**
     * 普通坐骑
     * @param item
     */
    private onUpdateItemNormal(item: ListItem) {
        let index = item._index;
        let data = this.dicHuanhauData[this.NAME_NORMAL][index];
        let huanhuaitem = item.data.huanhuaitem as HuanHuaItem;
        if (!huanhuaitem) {
            let obj = this.groupListItemNormal.GetItem(index).gameObject;
            huanhuaitem = new HuanHuaItem();
            huanhuaitem.setItem(obj);
            item.data.huanhuaitem = huanhuaitem;
        }
        huanhuaitem.updateByCfg(data);
        huanhuaitem.updateView();

    }

    //////注释幻化列表为一个类别的情况,不删,防止策划要改回来
    ///////**点击左侧进阶List刷新面板*/
    //////private onClickList(index: number) {
    //////    let selectData = this.huanhuazhuFuData[index];
    //////    if (typeof (selectData) == "number") {
    //////        this.updateSpecialPanel(selectData);
    //////    }
    //////    else {
    //////        this.updateJinJiePanel(selectData);
    //////    }
    //////}

    /**点击左侧进阶GroupList刷新面板*/
    private onClickGroupList(index: number) {
        if (index != this._HHGroupListSelected) {
            this.groupList.GetSubList(index).Selected = -1;
            this._HHGroupListSelected = index;
        }
    }

    /**点击左侧进阶SeasonList刷新面板*/
    private onClickSeasonList(index: number) {
        let selectData = this.dicHuanhauData[this.NAME_SEASON][index];
        this.updateSpecialPanel(selectData);
    }

    /**点击左侧进阶SpecialList刷新面板*/
    private onClickSpecialList(index: number) {
        let selectData = this.dicHuanhauData[this.NAME_SPECIAL][index];
        this.updateSpecialPanel(selectData);
    }

    /**点击左侧进阶NormalList刷新面板*/
    private onClickNormalList(index: number) {
        let selectData = this.dicHuanhauData[this.NAME_NORMAL][index];
        this.updateJinJiePanel(selectData);
    }

    /**刷新进阶外形对应的面板数据*/
    private updateJinJiePanel(cfg: GameConfig.ZhuFuConfigM): void {
        this.leftTime = 0;
        this.updateHHAttList(cfg.m_astAttrList, null, cfg.m_szName);
        this.selectedCFGID = cfg.m_iID;
        let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(this.id);
        if (data != null && data.m_ucLevel >= cfg.m_iID) {
            this.condition.text = Constants.S_YONGJIU;
            this.btnHuanHua.SetActive(!(data.m_uiShowID == cfg.m_iID));
            this.mcUse.SetActive(data.m_uiShowID == cfg.m_iID);
        }
        else {
            this.condition.text = uts.format('进阶到{0} 阶激活', ZhufuData.getZhufuStage(cfg.m_iID, this.id));
            this.btnHuanHua.SetActive(false);
            this.mcUse.SetActive(false);
        }
        this.m_pyMaterialData.id = this.m_pyMaterialData.need = 0;
        this.peiyangPanel.SetActive(false);
        let modelUrl = this.getModelUrl(cfg.m_iModelID);
        if (modelUrl != this.oldmodelURL) {
            this.oldmodelURL = modelUrl;
            this.addTimer("lateModel", 1, 1, this.lateLoadModel);
        }
    }
    /**刷新特殊外形对应的面板数据*/
    private updateSpecialPanel(cfgId: number): void {

        let lastselect = this.selectedCFGID;
        this.selectedCFGID = cfgId;
        let oldTime: number = this.leftTime;
        let zhufuData: ZhufuData = G.DataMgr.zhufuData;
        let cfg: GameConfig.ZhuFuImageConfigM = zhufuData.getImageConfig(cfgId);
        if (zhufuData.isActive(this.id, cfgId)) {
            if (zhufuData.isDress(this.id, cfgId)) {
                this.mcUse.SetActive(true);
                this.btnHuanHua.SetActive(false);
            }
            else {
                this.mcUse.SetActive(false);
                this.btnHuanHua.SetActive(true);
            }
            let dressOneImage: Protocol.HeroSubDressOneImage = zhufuData.getTimeItem(this.id, cfgId);
            cfg = zhufuData.getImageConfig(cfgId);
            let current: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            this.leftTime = 0;
            let data: Protocol.CSHeroSubSuper = zhufuData.getData(this.id);
            if (dressOneImage.m_uiTimeOut == 0) {
                if (dressOneImage.m_uiImageID == Macros.GUILD_PVP_CHAIRMAN_ZUOQI_IMGID ||
                    dressOneImage.m_uiImageID == Macros.GUILD_PVP_GUILD_VICE_ZUOQI_IMGID) {
                    this.condition.text = '持续时间:下次活动结束重置';
                }
                else {
                    this.condition.text = Constants.S_YONGJIU;
                }
            }
            else if (dressOneImage.m_uiTimeOut <= current) {
                this.condition.text = cfg.m_szCondition;
                this.btnHuanHua.SetActive(false);
                this.mcUse.SetActive(false);
            }
            else {
                this.leftTime = dressOneImage.m_uiTimeOut;
                this.condition.text = DataFormatter.second2day(dressOneImage.m_uiTimeOut - current);
            }
        }
        else {
            this.leftTime = 0;
            this.btnHuanHua.SetActive(false);
            this.mcUse.SetActive(false);
            this.condition.text = cfg.m_szCondition;
        }
        if (oldTime == 0 && this.leftTime != 0) {
            this.addTimer("upTimer", 1000, 0, this.onTime);
        }
        let dressOneImage: Protocol.HeroSubDressOneImage = zhufuData.getTimeItem(this.id, cfgId);
        let oldLevel = 0;
        let oldimageid = 0;
        if (lastselect > 10000) {
            oldLevel = zhufuData.getImageLevel(lastselect);
            oldimageid = zhufuData.getImageUnLevelID(lastselect);
        }
        let level = zhufuData.getImageLevel(cfgId);
        let imageid = zhufuData.getImageUnLevelID(cfgId);
        let next = zhufuData.getImageLevelID(imageid, (dressOneImage == null || dressOneImage.m_uiTimeOut > 0) ? level : level + 1);
        let nextConfig = zhufuData.getImageConfig(next);
        if (nextConfig != null && nextConfig.m_iConsumeID != 0) {
            this.m_pyMaterialData.id = cfg.m_iConsumeID;
            this.m_pyMaterialData.need = nextConfig.m_iConsumableCount;
            this.updatePyMaterial(dressOneImage == null || dressOneImage.m_uiTimeOut > 0, nextConfig.m_iFuncID == KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN);
            this.pyIcon.SetActive(true);
        }
        else {
            this.pyIcon.SetActive(false);
        }
        if (oldimageid == imageid && oldLevel != level) {
            this.playLiZiEffect();
        }

        this.pyLevel = uts.format("{0}阶", level);
        if (this.isZhuFu) {

        }
        if (dressOneImage == null || dressOneImage.m_uiTimeOut > 0) {
            this.pyText = "激活";
            this.BT_PY.SetActive(true);
            this.maxTip.SetActive(false);
        }
        else {
            if (nextConfig) {
                this.pyText = "飞升";
                this.BT_PY.SetActive(true);
                this.maxTip.SetActive(false);
            }
            else {
                this.BT_PY.SetActive(false);
                this.maxTip.SetActive(true);
            }
        }

        this.peiyangPanel.SetActive(true);


        let id = cfg.m_iModelID;
        let modelUrl = this.getModelUrl(id);
        if (modelUrl != this.oldmodelURL) {
            this.oldmodelURL = modelUrl;
            this.addTimer("lateModel", 1, 1, this.lateLoadModel);
        }
        this.updateHHAttList(cfg.m_astProp, nextConfig == null ? null : nextConfig.m_astProp, cfg.m_szModelName);
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
                this.updateSpecialPanel(this.selectedCFGID);
                this.removeTimer("upTimer");
            }
        }
        else {
            this.removeTimer("upTimer");
        }
    }
    /**刷新培养面板*/
    private updatePyMaterial(active: boolean, bSaiJi: boolean = false): void {
        if (this.m_pyMaterialData.id != 0) {
            if (active && !bSaiJi) {
                this.m_pyMaterialData.has = G.DataMgr.thingData.checkThing(KeyWord.ITEM_FUNCTION_SUBIMAGE, G.DataMgr.zhufuData.getImageUnLevelID(this.selectedCFGID)) == null ? 0 : 1;
            }
            else {
                this.m_pyMaterialData.has = G.DataMgr.thingData.getThingNum(this.m_pyMaterialData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            }
            /**更新培养物品的图标*/
            this.m_pyMaterialIconItem.updateByMaterialItemData(this.m_pyMaterialData);
            this.m_pyMaterialIconItem.updateIcon();
            UIUtils.setGrey(this.BT_PY, false, false);
        }
        else {
            this.m_pyMaterialIconItem.updateByMaterialItemData(null);
            this.m_pyMaterialIconItem.updateIcon();
            UIUtils.setGrey(this.BT_PY, true, false);
        }
    }
    private updateHHAttList(m_huanhuaallProps: GameConfig.EquipPropAtt[], m_nextallProps: GameConfig.EquipPropAtt[], name: string): void {
        if (m_huanhuaallProps == m_nextallProps) {
            m_nextallProps = null;
        }
        let attListData = [];
        let attListDic = {};
        let allPropData: HeroAttItemData[] = [];
        let nextallPropData: number[] = [];
        for (let i = 0, len = m_huanhuaallProps.length; i < len; i++) {
            let prop = m_huanhuaallProps[i];
            if (prop.m_ucPropId) {
                var itemVo: HeroAttItemData = this.getHeroAttItemData(prop.m_ucPropId);
                var macroId: number = PropUtil.getPropMacrosByPropId(prop.m_ucPropId);
                itemVo.macroId = macroId;
                itemVo.addVal = prop.m_ucPropValue;
                allPropData.push(itemVo);
                if (m_nextallProps != null) {
                    nextallPropData.push(m_nextallProps[i].m_ucPropValue);
                }
            }
        }
        //战斗力
        //附加属性列表
        for (let i = 0; i < this.MAX_HH_PROP_NUM; i++) {
            let propText = ElemFinder.findText(this.props, i.toString());
            let addText = ElemFinder.findText(this.props, i + "/value");

            if (i < allPropData.length) {
                let name = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, allPropData[i].propId) + ":    ";
                let number = TextFieldUtil.getColorText(allPropData[i].addVal.toString(), Color.GREEN);
                propText.text = name + number;
                if (m_nextallProps != null) {
                    addText.text = "+" + (nextallPropData[i] - allPropData[i].addVal).toString();
                }
                else {
                    addText.text = "";
                }
            } else {
                propText.text = '';
                addText.text = "";
            }

        }
        this.txtRideFight.text = uts.format("战斗力 {0}", FightingStrengthUtil.calStrength(m_huanhuaallProps).toString());
        this.txtRideName.text = name;

    }

    private onSelectChange(index: number) {
        let opModel = this.modelRoot.transform;
        let lizitran = this.liziEffectRoot.transform;
        if (index == 0) {
            this.jinjiePanel.SetActive(true);
            this.huanhuaPanel.SetActive(false);
            this.isHHAutoSelect = true;
            //成长模型 显示成长的
            let data = G.DataMgr.zhufuData.getData(this.id);
            if (data != null) {
                let currentConfig = G.DataMgr.zhufuData.getConfig(this.id, data.m_ucLevel);
                let modelUrl = this.getModelUrl(currentConfig.m_iModelID);
            }
            //let old = opModel.transform.localPosition;
            //old.x -= 114;
            //opModel.localPosition = old;

            //old = lizitran.localPosition;
            //old.x -= 114;
            //lizitran.localPosition = old;
            this.updateView();
        }
        else {
            this.jinjiePanel.SetActive(false);
            this.huanhuaPanel.SetActive(true);
            //let old = opModel.localPosition;
            //old.x += 114;
            //opModel.localPosition = old;

            //old = lizitran.localPosition;
            //old.x += 114;
            //lizitran.localPosition = old;

            //默认打开界面时幻化是没有初始化的，这里要做第一次切换的初始化操作
            this.groupListItemNormal.SetSlideAppearRefresh();
            this.groupListItemSpecial.SetSlideAppearRefresh();
            //////this.normalList.SetSlideAppearRefresh();
            this.updateHHView();
            //this.onClickList(0);
            //////this.normalList.Selected = 0;
        }
    }

    //成长丹  0
    private onClickCzd() {
        G.Uimgr.createForm<GrowUpDrugTipView>(GrowUpDrugTipView).open(this.id, 0);
    }
    //资质丹  1
    private onClickZzd() {
        G.Uimgr.createForm<GrowUpDrugTipView>(GrowUpDrugTipView).open(this.id, 1);
    }

    private onClickTextOpenTip() {
        if (this.m_costData.id > 0) {
            let item = new IconItem();
            item.updateById(this.m_costData.id);
            G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
        }
    }

    private onClickWanyongTextOpenTip() {
        if (this._nextConfig.m_iUniversalItem > 0) {
            let item = new IconItem();
            item.updateById(this._nextConfig.m_iUniversalItem);
            G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
        }
    }

    private onClickEquipIcon(iconItem: IconItem) {
        // 显示tip
        let index = this.equipItems.indexOf(iconItem);
        let equipParts = this.getEquipPart();
        let equipPart: number = equipParts[index];

        let wearThingData: ThingItemData = this.m_equipListData[index].thingItemData;
        G.ActionHandler.showBagEquipPanel(equipPart, wearThingData, this.id, GameIDType.OTHER_EQUIP);
    }

    private onBeginClick() {
        this.beginUpdrade();
    }

    private beginUpdrade() {
        if (this._nextConfig == null) return;
        //万用进阶丹的数量
        let universalJinjieDanNum = G.DataMgr.thingData.getThingNum(this._nextConfig.m_iUniversalItem, Macros.CONTAINER_TYPE_ROLE_BAG, false)
        //第一次打开面板有衰减的祝福值时先打开追回面板
        if (this.shuaiJianZhuFuValue != 0 && this.isFirstOpen) {
            G.Uimgr.createForm<ZhuFuZhaoHuiView>(ZhuFuZhaoHuiView).open(this.id, this.stageZhuFuMaxValue, this.shuaiJianZhuFuValue, this.currentZhuFuValue);
            this.isFirstOpen = false;
            this._stopAuto();
            return;
        }
        if (this.m_costData.id != 0) {
            if (this.m_costData.has >= this.m_costData.need) {
                this.requestLevelUp();
                return;
            }
            else if (this.m_costData.has + universalJinjieDanNum >= this.m_costData.need) {
                if (ZhufuRideBaseView.isNotTip) {
                    if (ZhufuRideBaseView.isNotTipAgain) {
                        if (ZhufuRideBaseView.isNotTipThirdConfirm == false) {
                            G.TipMgr.showConfirm(uts.format('当前您的{0}已经不足，是否消耗{1}继续升阶？', TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_costData.id)), TextFieldUtil.getItemText(ThingData.getThingConfig(this._nextConfig.m_iUniversalItem))), ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onConfirmMultiRefine2));
                        }
                        else {
                            this.requestLevelUp();
                            return;
                        }
                    }
                    else {
                        this.requestLevelUp();
                        return;
                    }
                }
                else {
                    G.TipMgr.showConfirm(uts.format('您的{0}已经不足，是否消耗{1}继续升阶？', TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_costData.id)), TextFieldUtil.getItemText(ThingData.getThingConfig(this._nextConfig.m_iUniversalItem))), ConfirmCheck.withCheck, '确定|取消', delegate(this, this._onConfirmMultiRefine));
                }
            }
            else {
                this._stopAuto();
                let num = this.m_costData.need - (this.m_costData.has + universalJinjieDanNum);
                let morelv = G.DataMgr.zhufuData.getZhufuNumber(this.id, false);
                let morenum = this.m_costData.need * morelv;
                num += morenum;
                G.ActionHandler.autoBuyMaterials(this.m_costData.id, num, delegate(this, this.requestMoreLevelUp, morelv + 1));

            }
        }
    }


    private _onConfirmMultiRefine(stage: MessageBoxConst, isCheckSelected: boolean, openLevels: number[]): void {

        ZhufuRideBaseView.isNotTip = isCheckSelected;
        if (MessageBoxConst.yes == stage) {
            this.requestLevelUp();
        }
        else {
            if (isCheckSelected == true) {
                ZhufuRideBaseView.isNotTipAgain = true;
            }
            this._stopAuto();

        }

    }

    private _onConfirmMultiRefine2(stage: MessageBoxConst, isCheckSelected: boolean, openLevels: number[]): void {
        if (MessageBoxConst.yes == stage) {
            ZhufuRideBaseView.isNotTipThirdConfirm = true;
            this.requestLevelUp();
        }
        else {
            this._stopAuto();
        }

    }

    /**新规则计算*/
    private getZhuFuProp(beforConfig: GameConfig.EquipPropAtt[], nextConfig: GameConfig.EquipPropAtt[], currentLuckyValue: number, nextLuckyUp: number): GameConfig.EquipPropAtt[] {
        let config = new Array<GameConfig.EquipPropAtt>(beforConfig.length);
        for (let i = 0; i < beforConfig.length; i++) {
            config[i] = {} as GameConfig.EquipPropAtt;
        }
        for (let i = 0; i < beforConfig.length; i++) {
            let jichuValue = beforConfig[i].m_ucPropValue;
            let addValue = Math.floor((nextConfig[i].m_ucPropValue - beforConfig[i].m_ucPropValue) * currentLuckyValue / nextLuckyUp / 2);
            config[i].m_ucPropValue = Math.floor(jichuValue + addValue);
            config[i].m_ucPropId = beforConfig[i].m_ucPropId;
        }
        return config;
    }


    private _mergeProp(prop: GameConfig.EquipPropAtt[], num: number = 1, isRate: boolean = false): void {
        let l: number = prop.length;
        let isUsed: boolean;
        for (let i: number = 0; i < l; i++) {
            isUsed = false;
            for (let j: number = 0; j < this.m_propNum; j++) {
                if (this.m_allProps[j].m_ucPropId == prop[i].m_ucPropId) {
                    if (isRate) {
                        this.m_allProps[j].m_ucPropValue += Math.floor(this.m_allProps[j].m_ucPropValue * prop[i].m_ucPropValue * num / 100);
                    }
                    else {
                        this.m_allProps[j].m_ucPropValue += prop[i].m_ucPropValue * num;
                    }
                    isUsed = true;
                    break;
                }
            }
            if (!isUsed && !isRate) {
                if (prop[i].m_ucPropId) {
                    this.m_allProps[this.m_propNum].m_ucPropId = prop[i].m_ucPropId;
                    this.m_allProps[this.m_propNum].m_ucPropValue = prop[i].m_ucPropValue * num;
                    let value1 = this.m_allProps[this.m_propNum].m_ucPropValue;
                    let specialVipPct = 0;
                    if (this.specialVipPara > 0) {
                        specialVipPct = G.DataMgr.vipData.getSpecialPriRealPct(this.specialVipPara);
                    }
                    this.m_allProps[this.m_propNum].m_ucPropValue = value1 + Math.floor(value1 * specialVipPct);
                    let value2 = this.m_allProps[this.m_propNum].m_ucPropValue;
                    this.m_allProps[this.m_propNum].m_ucPropValue = value2 + Math.floor(value2 * this.getVipBaiJinBaiFenBi());
                    this.m_propNum++;
                }
            }
        }
    }


    public updateViewLater(isZhufu: boolean) {
        if (isZhufu) {
            this.isZhuFu = true;
        }
        if (this.funcGroup.Selected == 0) {
            this.addTimer("late", 100, 1, this.updateView);
        }
        else {
            this.setHHTipMark();
            this.isDataChange = true;
          
            //this.addTimer("late", 100, 1, this.updateHHView);
            this.updateHHView();
            this.groupList.GetSubList(this.groupList.Selected).Refresh();
        }
    }

    public lateLoadModel() {
        let type = this.getModelType();
        G.ResourceMgr.loadModel(this.modelRoot, type, this.oldmodelURL, this.sortingOrder, true);
    }


    ///////////////////////////////////////// 面板显示 /////////////////////////////////////////
    /**
     * 播放粒子系统
     */
    private playLiZiEffect() {
        if (this.liziEffectRoot.activeSelf) {
            this.liziEffectRoot.SetActive(false);
        }
        this.liziEffectRoot.SetActive(true);
        Game.Invoker.BeginInvoke(this.liziEffectRoot, "effect", 2.5, delegate(this, this.onEndEffect));
    }

    private onEndEffect() {
        this.liziEffectRoot.SetActive(false);
    }

    /**
*播放帧动画
*/
    private playFrameAnimation(result: boolean) {
        if (result) {
            this.succeedUIEffect.playEffect(EffectType.Effect_Normal);
        }
        else {
            this.failedUIEffect.playEffect(EffectType.Effect_Normal);
        }
    }



    /**
    * 新点特效
    */
    private playNewDianEffect() {
        this.newDianRoot.SetActive(false);
        this.newDianRoot.SetActive(true);
        Game.Invoker.BeginInvoke(this.newDianRoot, "effect", 0.9, delegate(this, this.onEndNewDianEffect));
    }

    private onEndNewDianEffect() {
        this.newDianRoot.SetActive(false);
    }

    /**
     * 事件发过来带id的
     * @param type
     *
     */
    updateView(): void {
        let zhufuData = G.DataMgr.zhufuData;
        let data = zhufuData.getData(this.id);
        if (data == null) return;
        let currentConfig = zhufuData.getConfig(this.id, data.m_ucLevel);
        if (this.oldShowModel && this.oldShowModel != currentConfig.m_iModelID) {
            //G.Uimgr.createForm<GetZhufuView>(GetZhufuView).open(this.id, false);
            this.oldShowModel = currentConfig.m_iModelID;
        }
        if (this.isZhufuDecrease) {
            this._nextConfig = zhufuData.getConfig(this.id, data.m_ucLevel + 10);
        }
        else {
            this._nextConfig = zhufuData.getConfig(this.id, data.m_ucLevel + 1);
        }
        this.currentConfig = currentConfig;
        this.currentData = data;
        //成长，资质按钮显示
        this.btnCzd.SetActive(data.m_ucLevel >= this.czdConfig.m_uiOpenLevel);
        this.btnZzd.SetActive(data.m_ucLevel >= this.zzdConfig.m_uiOpenLevel);
        this.czdTipMark.SetActive(zhufuData.cZDOrzZDShowTipMark(this.id, true));
        this.zzdTipMark.SetActive(zhufuData.cZDOrzZDShowTipMark(this.id, false));

        let oldStage = this.currentStage;
        let name = currentConfig.m_szName;
        let id = currentConfig.m_iModelID;
        if (data.m_uiShowID > 10000) {
            let image = zhufuData.getImageConfig(data.m_uiShowID);
            if (image) {
                id = image.m_iModelID;
                name = image.m_szModelName;
            }
            else {
                id = 0;
                name = "请选择幻化";
            }
        }
        let config = G.DataMgr.zhufuData.getConfig(this.id, data.m_ucLevel);
        let modelUrl = this.getModelUrl(config.m_iModelID);
        // let modelUrl = this.getModelUrl(id);
        if (modelUrl != this.oldmodelURL) {
            this.oldmodelURL = modelUrl;
            this.addTimer("lateModel", 1, 1, this.lateLoadModel);
        }
        this.currentStage = ZhufuData.getZhufuStage(data.m_ucLevel, this.id);
        this.txtName.text = config.m_szName;// name;
        this.txtLv.text = DataFormatter.toHanNumStr(this.currentStage) + '阶';
        let level: number = 0;
        if (data.m_ucLevel == ZhufuData.getZhuFuMaxLevel(this.id)) {
            level = 10;
        }
        else {
            level = (data.m_ucLevel - 1) % 10;
        }
        for (let i = 0; i < ZhufuRideBaseView.LEVEL_NUM; i++) {
            let active = i < level;
            if (this.levelObjectsActive[i] != active) {
                this.levelObjectsActive[i] = active;
                this.levelObjects[i].SetActive(active);
            }
        }

        this.curLevel = level;
        if (this._nextConfig != null) {
            this.m_costData.id = this._nextConfig.m_iConsumableID;
            this.m_costData.need = this._nextConfig.m_iConsumableNumber;
            let auto = this.m_isAuto;
            //幸运值
            let lucky: number = data.m_uiLucky;
            this.luckyValue = "祝 福 值 : " + lucky + "/" + this._nextConfig.m_iLucky;
            this.luckySliderValue = lucky / this._nextConfig.m_iLucky;
            //设置祝福值各种参数
            this.currentZhuFuValue = data.m_uiLucky;
            this.shuaiJianZhuFuValue = data.m_uiSaveLucky;
            this.stageZhuFuMaxValue = this._nextConfig.m_iLucky;

            let checkJJF = oldStage != this.currentStage && this.isZhuFu;
            if ((this.m_oldLucky != lucky || this.curLevel != this.oldLevel) && this.isZhuFu) {
                this.playNewDianEffect();
                this.oldLevel = this.curLevel;
                this.isZhuFu = false;
                let star: number = (data.m_ucLevel - 1) % 10;
                if (lucky == 0) {
                    if (oldStage != this.currentStage) {
                        this.addEffect(9);
                        //进阶成功播放粒子特效
                        G.AudioMgr.playJinJieSucessSound();
                        if (this.id == KeyWord.HERO_SUB_TYPE_ZUOQI || this.id == KeyWord.HERO_SUB_TYPE_WUHUN) {
                            this.playLiZiEffect();
                        }
                        this._stopAuto();
                        auto = false;

                        G.ActBtnCtrl.update(false);
                    }
                    else {
                        this.addEffect(star - 1);
                        this.playUpEffect();
                    }
                }
                else {
                    let deltaLucky = lucky - this.m_oldLucky;
                    if (deltaLucky > 0) {
                        this.playZhufuPlusEffect(deltaLucky);
                    }
                }
                this.m_oldLucky = lucky;
            }

            if (this.m_costData.id != 0) {
                this.m_costData.has = G.DataMgr.thingData.getThingNum(this.m_costData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);

                for (let i = 0; i < this._nextConfig.m_stLimitIDList.length; i++) {

                    if (this._nextConfig.m_stLimitIDList[i].m_uiValue) {
                        this.m_costData.has += G.DataMgr.thingData.getThingNum(this._nextConfig.m_stLimitIDList[i].m_uiValue, Macros.CONTAINER_TYPE_ROLE_BAG, false);

                        let m: number = G.DataMgr.thingData.getThingNum(this._nextConfig.m_iUniversalItem, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                    }
                }
                let universalJinjieDanNum = G.DataMgr.thingData.getThingNum(this._nextConfig.m_iUniversalItem, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                let color: string = this.m_costData.has/*  + universalJinjieDanNum */ < this.m_costData.need ? Color.RED : Color.GREEN;
                // if (this.m_costData.has > 0 || universalJinjieDanNum <= 0) {
                //     //this.costValue = uts.format("{0}*{1}", TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_costData.id))/*, TextFieldUtil.getItemText(ThingData.getThingConfig(this._nextConfig.m_iUniversalItem)*//*, this.m_costData.has + universalJinjieDanNum*/, this.m_costData.need);


                //     this.costValue = this.m_costData.need.toString();
                //     this.addClickListener(this.BtnJInjieDan, this.onClickTextOpenTip);
                // }
                // else {
                //     //this.costValue = uts.format("{0}*{1}", TextFieldUtil.getItemText(ThingData.getThingConfig(this._nextConfig.m_iUniversalItem))/*, TextFieldUtil.getItemText(ThingData.getThingConfig(this._nextConfig.m_iUniversalItem)*//*, this.m_costData.has + universalJinjieDanNum*/, this.m_costData.need);

                //     this.costValue = this.m_costData.need.toString();
                //     this.addClickListener(this.BtnJInjieDan, this.onClickWanyongTextOpenTip);
                // }
                this.costValue = this.m_costData.need.toString();
                G.ResourceMgr.loadIcon(this.materialCost, ThingData.getThingConfig(this.m_costData.id).m_szIconID);
                //this.costValue = uts.format("{0}或{1}({2}/{3})", TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_costData.id)), TextFieldUtil.getItemText(ThingData.getThingConfig(this._nextConfig.m_iUniversalItem)), this.m_costData.has + universalJinjieDanNum, this.m_costData.need);
                this.hasValue = uts.format("{0}", TextFieldUtil.getColorText((this.m_costData.has/*  + universalJinjieDanNum */).toString(), color));
                G.ResourceMgr.loadIcon(this.materialHas, ThingData.getThingConfig(this.m_costData.id).m_szIconID);
            }

            if (this.m_costData.id == 0) {
                this._stopAuto();
            }
            else if (auto) {
                this.addTimer("1", this.deltaTime, 1, this.onTimer);
            }

            if (checkJJF) {
                this.checkJinJieFu();
            }
        }
        else {
            this.m_costData.id = 0;
            this.costValue = "";
            this.hasValue = "";
            this.luckySliderValue = 1;
            this.luckyValue = "已满阶";
            UIUtils.setButtonClickAble(this.BT_Begin, false);
            UIUtils.setButtonClickAble(this.BT_Auto, false);
            this._stopAuto();
        }

        //将所有属性清0
        for (var i: number = 0; i < this.m_propNum; i++) {
            this.m_allProps[i].m_ucPropId = 0;
            this.m_allProps[i].m_ucPropValue = 0;
        }
        this.m_propNum = 0;
        //加入祝福值计算属性
        let newConfigProp: GameConfig.EquipPropAtt[];
        if (currentConfig != null && this._nextConfig != null) {
            newConfigProp = this.getZhuFuProp(currentConfig.m_astAttrList, this._nextConfig.m_astAttrList, data.m_uiLucky, this._nextConfig.m_iLucky);
        } else {
            newConfigProp = currentConfig.m_astAttrList;
        }
        this._mergeProp(newConfigProp);
        this._mergeProp(this.zzdConfig.m_astAttrList, data.m_uiZZDrugCount, true);
        this._mergeProp(this.czdConfig.m_astAttrList, data.m_uiSXDrugCount, false);
        this._updateSkill();
        this._updataEquip();
        this.updateAttList();


        if (this.isZhufuDecrease) {
            this.onRefreshZfValueTip(null);
        }
    }


    private onTimer() {
        this.beginUpdrade();
    }

    private checkJinJieFu() {
        let zhufuData = G.DataMgr.zhufuData;
        let data = zhufuData.getData(this.id);
        let itemDatas = G.DataMgr.thingData.getThingListByFunction(KeyWord.ITEM_FUNCTION_HEROSUB_JINGJIEFU, this.id, ZhufuData.getNextStageLv(data.m_ucLevel, this.id));
        if (itemDatas.length > 0) {
            let sysName = KeyWord.getDesc(KeyWord.GROUP_HERO_SUB_TYPE, this.id);
            let crtStage = ZhufuData.getZhufuStage(data.m_ucLevel, this.id);
            let itemData = itemDatas[0];
            G.TipMgr.showConfirm(uts.format(G.DataMgr.langData.getLang(456), sysName, crtStage, TextFieldUtil.getItemText(itemData.config)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmUseJinJieFu, itemData.config, itemData.data));
        }
    }

    private onConfirmUseJinJieFu(state: MessageBoxConst, isCheckSelected: boolean, config: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo, useNum: number = 1, targetUnitID: number = -1): void {
        if (MessageBoxConst.yes == state) {
            this.oldShowModel = this.currentConfig.m_iModelID;
            G.ModuleMgr.bagModule.useThing(config, thingInfo, useNum, true);
        }
    }

    private onRefreshZfValueTip(timer: Game.Timer): void {
        let data = G.DataMgr.zhufuData.getData(this.id);
        if (data == null) {
            return;
        }
        let cname: string = KeyWord.getDesc(KeyWord.GROUP_HERO_SUB_TYPE, this.id);
        let str: string = "";
        let current = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (this.currentStage >= 5 && data.m_uiLucky > 0 && data.m_uiLuckyTime > current) {
            str += DataFormatter.second2hhmmss(data.m_uiLuckyTime - current);
        }
        else {
            str += "不限时";
        }
        str += "\n";
        if (KeyWord.HERO_SUB_TYPE_LEILING == this.id) {
            str += RegExpUtil.xlsDesc2Html(G.DataMgr.langData.getLang(253));
        }
        else {
            str += RegExpUtil.xlsDesc2Html(G.DataMgr.langData.getLang(214));
        }
        this.zhufuTime.text = str;
        if (this.isZhufuDecrease) {
            if (this.currentStage >= 5) {
                this.zhenFaZhuFuText.text = G.DataMgr.langData.getLang(350);
            } else {
                this.zhenFaZhuFuText.text = G.DataMgr.langData.getLang(349);
            }
        }
    }



    /**更新限制文本*/
    private updateLimit(): void {
        let funId: number = GameIDUtil.getEnhanceFuncIdBySubType(this.id);
        let isActivated = G.DataMgr.funcLimitData.isFuncAvailable(funId);
        if (!isActivated) {
            let funcLimitConfig = G.DataMgr.funcLimitData.getFuncLimitConfig(funId);
            this.limitText.text = funcLimitConfig.m_szDisableMsg;
        }
        this.limitText.gameObject.SetActive(!isActivated);
        this.BT_Begin.SetActive(isActivated);
        this.BT_Auto.SetActive(isActivated);
    }


    protected abstract getModelType(): UnitCtrlType;
    protected abstract getModelUrl(id: number): string;
    protected abstract getEquipPart(): number[];
    //vip白金
    protected abstract getVipBaiJinActive(): boolean;
    protected abstract getVipBaiJinDes(): string;
    protected abstract getVipBaiJinBaiFenBi(): number;

    private addEffect(index: number): void {
        //法阵不点亮
        if (this.isZhufuDecrease) {
            return;
        }
        let effect = this.rideEfects[index];
        if (effect) {
            effect.playEffect(EffectType.Effect_Normal);
            G.AudioMgr.playStarBombSucessSound();
        }
        else {
            uts.logWarning("index error:" + index);
        }
    }
    protected onAutoClick(): void {
        if (this.m_isAuto) {
            this._stopAuto();
        }
        else {
            this._startAuto();
        }

        if (this.id == KeyWord.HERO_SUB_TYPE_ZUOQI) {
            // 进行下一步指引
            G.GuideMgr.processGuideNext(EnumGuide.MountEnhance, EnumGuide.MountEnhance_ClickAutoEnhance);
        }

    }
    private _startAuto(): void {
        if (!this.m_isAuto) {
            this.m_isAuto = true;
            UIUtils.setButtonClickAble(this.BT_Begin, false);
            let label = this.BT_Auto.GetComponentInChildren(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
            label.text = "停止进阶";
            this.beginUpdrade();
        }
    }
    private _stopAuto(): void {
        if (this.m_isAuto) {
            this.m_isAuto = false;
            UIUtils.setButtonClickAble(this.BT_Begin, true);
            let label = this.BT_Auto.GetComponentInChildren(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
            label.text = "自动进阶";
        }
        this.removeTimer("1");
    }
    /**
     * 获取属性列表ITEM数据
     * @param	m_ucPropId
     * @return
     */
    private getHeroAttItemData(m_ucPropId: number): HeroAttItemData {
        var itemVo: HeroAttItemData = this._attListDic[m_ucPropId] as HeroAttItemData;
        if (!itemVo && m_ucPropId > 0) {
            itemVo = new HeroAttItemData();
            var macroId: number = PropUtil.getPropMacrosByPropId(m_ucPropId);
            itemVo.macroId = macroId;
            this._attListData.push(itemVo);
            this._attListDic[m_ucPropId] = itemVo;
        }
        return this._attListDic[m_ucPropId];
    }

    /**更新属性列表*/
    private updateAttList(): void {
        this._attListData.length = 0;
        this._attListDic = {};
        for (let prop of this.m_allProps) {
            if (prop.m_ucPropId) {
                let itemVo: HeroAttItemData = this.getHeroAttItemData(prop.m_ucPropId);
                itemVo.addVal = prop.m_ucPropValue;
            }
        }
        this.sortOnAttList();

        this._attList.Count = this._attListData.length;
        for (let i = 0, len = this._attList.Count; i < len; i++) {
            let data = this._attListData[i];
            let item = this._attList.GetItem(i);
            let labelValue = item.data.labelValue;
            let newValue = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.propId);
            if (labelValue != newValue) {
                labelValue = item.data.labelValue = newValue;
                let label = item.data.label;
                if (label == null) {
                    label = item.data.label = item.findText('label');
                }
                label.text = newValue;
            }

            let valueValue = item.data.valueValue;
            newValue = data.addVal.toString();
            if (valueValue != newValue) {
                valueValue = item.data.valueValue = newValue;
                let value = item.data.value;
                if (value == null) {
                    value = item.data.value = item.findText('value');
                }
                value.text = newValue;
            }
        }
    }

    /**排序属性列表*/
    private sortOnAttList(): void {
        if (this.currentConfig) {
            let attVec = this.currentConfig.m_astAttrList;
            let len: number = attVec.length;
            for (let i: number = 0; i < len; i++) {
                var prop: GameConfig.EquipPropAtt = attVec[i] as GameConfig.EquipPropAtt;
                if (prop.m_ucPropId) {
                    var itemVo: HeroAttItemData = this.getHeroAttItemData(prop.m_ucPropId);
                    itemVo.configIndex = i;
                }
            }
        }
        this._attListData.sort(HeroRule.sortAttListData);
    }

    private _updateSkill(): void {
        let skills = G.DataMgr.zhufuData.getSkillList(this.id);
        //设置技能数据
        for (let i = 0; i < ZhufuRideBaseView.MAX_SKILL_NUM; i++) {
            if (i < skills.length) {
                this.m_skillData[i].skill = SkillData.getSkillConfig(skills[i]);
                this.skillItems[i].updateBySkillID(skills[i]);
            }
            else {
                this.m_skillData[i].skill = null;
                this.skillItems[i].updateBySkillID(0);
            }
            this.skillItems[i].updateIcon();
        }
    }

    private _updataEquip(): void {
        let equipObject = G.DataMgr.thingData.getContainer(this.m_containerID);
        for (let i = 0; i < 4; i++) {
            let itemData: BeautyEquipListItemData = this.m_equipListData[i];
            let data = itemData.thingItemData;

            if (equipObject != null && equipObject[i] != null) {
                data.config = equipObject[i].config;
                data.data = equipObject[i].data;

                this._mergeProp(data.config.m_astBaseProp);
                //let strengthConfig = G.DataMgr.equipStrengthenData.getEquipStrengthenConfigByPart(data.config.m_iEquipPart);
                //this._mergeProp(strengthConfig.m_astProp : null);
                let beautyBetterEquip = G.DataMgr.thingData.getZhufuBetterEquip(data.config.m_iEquipPart, this.id);
                itemData.showUp = Boolean(beautyBetterEquip);
            }
            else {
                data.config = null;
                data.data = null;
                itemData.showUp = false;
            }

            let equipIconItem = this.equipItems[i];
            equipIconItem.updateByBeautyEquipListItemData(itemData);
            equipIconItem.updateEquipIcon(GameIDType.OTHER_EQUIP, this.id, i);
        }
    }

    /**请求升级*/
    private requestLevelUp(): void {
        let zhufuData = G.DataMgr.zhufuData;
        let data = zhufuData.getData(this.id);
        if (data != null) {
            this.m_oldLevel = data.m_ucLevel;
            this.oldShowModel = this.currentConfig.m_iModelID;
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZfjjRequest(this.id));

            if (KeyWord.HERO_SUB_TYPE_YUYI == this.id) {
                let funcLimitData = G.DataMgr.funcLimitData;
                if (funcLimitData.needGuildWing) {
                    funcLimitData.needGuildWing = false;
                    //G.GuideMgr.checkTrailAndFmtBossCtrl();
                }
            }
        }
    }

    /**请求多次升级*/
    private requestMoreLevelUp(num: number): void {
        for (let i = 0; i < num; i++) {
            this.requestLevelUp();
        }
    }


    ////////////////////////祝福新规则,找回和保留//////////////////////////////////////////////

    private onClickBtnBaoLiuZhuFu() {
        let data = G.DataMgr.zhufuData.getData(this.id);
        if (data == null) {
            return;
        }
        if (data.m_uiLuckyTime == 0) {
            G.TipMgr.addMainFloatTip("目前还没开始衰减祝福值,不需要保留");
            return;
        }
        G.TipMgr.showConfirm('是否花费50钻石将祝福值衰减时间延长24小时？', ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmBaoLiuZhuFu));
    }

    private onConfirmBaoLiuZhuFu(state: MessageBoxConst, isCheckSelected: boolean) {
        if (state == MessageBoxConst.yes) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHeroSubLuckyRequest(this.id, 1));
        }
    }

    private onClickBtnZhuiHuiZhuFu() {
        let data = G.DataMgr.zhufuData.getData(this.id);
        if (data == null) {
            return;
        }
        if (data.m_uiSaveLucky == 0) {
            G.TipMgr.addMainFloatTip("当前没有衰减祝福值,不需要找回");
            return;
        }
        G.Uimgr.createForm<ZhuFuZhaoHuiView>(ZhuFuZhaoHuiView).open(this.id, this.stageZhuFuMaxValue, this.shuaiJianZhuFuValue, this.currentZhuFuValue);
    }

    private onUp(): void {
        let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(this.id);
        if (data != null && data.m_uiShowID != this.selectedCFGID) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuChangeRequest(this.id, G.DataMgr.zhufuData.getImageUnLevelID(this.selectedCFGID)));
        }
    }
    /**点击幻化*/
    private onClickHuanHuaBt(): void {
        let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(this.id);
        if (data != null && data.m_uiShowID != this.selectedCFGID) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuChangeRequest(this.id, G.DataMgr.zhufuData.getImageUnLevelID(this.selectedCFGID)));
        }
    }

    /**点击培养*/
    private onClickBtnPy(): void {
        let zhufuData = G.DataMgr.zhufuData;
        let id = zhufuData.getImageUnLevelID(this.selectedCFGID);
        let level = zhufuData.getImageLevel(this.selectedCFGID);
        let cfg: GameConfig.ZhuFuImageConfigM = zhufuData.getImageConfig(this.selectedCFGID);
        if (this.m_pyText == "激活") {
            if (cfg && cfg.m_iFuncID == KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN) {
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN, 0, 0, cfg.m_uiImageId);
            }
            else {
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
        }
        else if (this.m_pyText == "飞升") {
            if (this.m_pyMaterialData.has < this.m_pyMaterialData.need) {
                G.TipMgr.addMainFloatTip('飞升材料不足');
            }
            else {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHuanHuaFSRequest(this.id, id));
            }
        }
    }


    private onClickGotoJJR() {
        let funcId = 0;
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JJR_RANK)) {
            funcId = KeyWord.OTHER_FUNCTION_JJR_RANK;
        } else {
            funcId = KeyWord.OTHER_FUNCTION_JJR_RANK_AFTER7DAY;
        }
        G.ActionHandler.executeFunction(funcId);
    }

    private playUpEffect() {
        this.upEffect.SetActive(false);
        this.upEffect.SetActive(true);
        Game.Invoker.BeginInvoke(this.upEffect, "effect", 0.9, delegate(this, this.onEndUpEffect));
    }

    private onEndUpEffect() {
        this.upEffect.SetActive(false);
    }

    private playZhufuPlusEffect(value: number) {
        this.zhufuPlusEffect.SetActive(false);
        //this.textZhufuPlus.text = value.toString();
        this.zhufuPlusEffect.SetActive(true);
        Game.Invoker.BeginInvoke(this.zhufuPlusEffect, "effect", 0.9, delegate(this, this.onEndZhufuPlusEffect));
    }

    private onEndZhufuPlusEffect() {
        this.zhufuPlusEffect.SetActive(false);
    }
}
export default ZhufuRideBaseView;