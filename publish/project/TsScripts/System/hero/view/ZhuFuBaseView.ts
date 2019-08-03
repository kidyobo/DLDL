import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { BeautyEquipListItemData } from "System/data/vo/BeautyEquipListItemData";
import { UnitCtrlType, GameIDType, SceneID, EnumEffectRule, EnumStoreID } from "System/constants/GameEnum";
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ThingData } from 'System/data/thing/ThingData'
import { ZhufuSkillItemData } from 'System/skill/ZhufuSkillItemData'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { ZhufuData } from 'System/data/ZhufuData'
import { SkillData } from 'System/data/SkillData'
import { HeroAttItemData } from "System/hero/HeroAttItemData"
import { PropUtil } from "System/utils/PropUtil"
import { HeroRule } from "System/hero/HeroRule"
import { List, ListItem } from "System/uilib/List"
import { FixedList } from "System/uilib/FixedList"
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { IconItem } from 'System/uilib/IconItem'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { StringUtil } from "System/utils/StringUtil"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { Color } from "System/utils/ColorUtil"
import { SkillIconItem } from 'System/uilib/SkillIconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { BatBuyView } from "System/business/view/BatBuyView"
import { HeroView } from 'System/hero/view/HeroView'
import { UIUtils } from 'System/utils/UIUtils'
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { GrowUpDrugTipView } from 'System/tip/view/GrowUpDrugTipView'
import { DataFormatter } from "System/utils/DataFormatter"
import { RegExpUtil } from "System/utils/RegExpUtil"
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { ZhuFuZhaoHuiView } from 'System/NewZhuFuRule/ZhuFuZhaoHuiView'
import { SpecialPriBasePanel } from 'System/hero/view/SpecialPriBasePanel'
import { GroupList, GroupListItem } from 'System/uilib/GroupList'
import { HuanHuaItem } from 'System/hero/view/ShiZhuangPanel'
import { Constants } from 'System/constants/Constants'
import { JinJieRiBatBuyView } from "System/business/view/JinJieRiBatBuyView"
import { ShenQiZhongJiView } from 'System/hero/view/ShenQiZhongJiView'
import { EnumGuide } from 'System/constants/GameEnum'


/**神器用 （坐骑ZhufuRideBaseView 神器ZhufuBaseView 紫极魔瞳和鬼影迷踪NewZhufuBaseView 控鹤擒龙MagicCubeView）*/
export abstract class ZhuFuBaseView extends SpecialPriBasePanel {
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
    private scoreLabel: UnityEngine.UI.Text;
    private m_scoreValue: number;
    private set scoreValue(value: number) {
        if (this.m_scoreValue != value) {
            this.m_scoreValue = value;
            this.scoreLabel.text = value.toString();
        }
    }
    private fullScoreLabel: UnityEngine.UI.Text;
    private m_fullScoreValue: number;
    private set fullScoreValue(value: number) {
        if (this.m_fullScoreValue != value) {
            this.m_fullScoreValue = value;
            this.fullScoreLabel.text = value.toString();
        }
    }


    private nextLevelFight: UnityEngine.UI.Text;
    private m_nextScoreValue: number;
    private set nextScoreValue(value: number) {
        if (this.m_nextScoreValue != value) {
            this.m_nextScoreValue = value;
            this.nextLevelFight.text = '下一阶战力增加:' + value.toString();
        }
    }
    /**开始强化*/
    private beginTipMark: UnityEngine.GameObject;
    private m_tipMark: boolean;
    private set tipMark(value: boolean) {
        if (this.m_tipMark != value) {
            this.m_tipMark = value;
            this.beginTipMark.SetActive(value);
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
    private m_btnAutoBuy: UnityEngine.UI.ActiveToggle;
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
    private huanhuazhuFuData = [];
    private condition: UnityEngine.UI.Text;
    private btnHuanHua: UnityEngine.GameObject;
    private mcUse: UnityEngine.GameObject;
    private fullLevelFight: UnityEngine.GameObject;
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
    private oldhuanhuazhuFuData = [];

    //进阶日跳转

    private zhongjiBtn: UnityEngine.GameObject;

    private btnGotoJJR: UnityEngine.GameObject;
    private jjRankTipMark: UnityEngine.GameObject;

    private oldShowModel: number = 0;

    private upEffect: UnityEngine.GameObject;
    private zhufuPlusEffect: UnityEngine.GameObject;
    //private textZhufuPlus: UnityEngine.UI.Text;

    //神器飞升特性
    private succeedUIEffect: UIEffect;
    private failedUIEffect: UIEffect;

    /**最大等级配置*/
    protected maxCfg: GameConfig.ZhuFuImageConfigM;
    protected maxZhanLi: string;

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
        for (let i = 0; i < ZhuFuBaseView.LEVEL_NUM; i++) {
            let effect = new UIEffect();
            let item = Game.Tools.GetChild(mcLevels, i.toString());
            effect.setEffectPrefab(effectPrefab, item);
            this.levelObjects[i] = item;
            this.levelObjectsActive[i] = true;
            this.rideEfects[i] = effect;
        }
        this.m_luckyLabel = this.elems.getText("zhufu");
        this.posEffectTarget = this.m_luckyLabel.transform;
        this.scoreLabel = this.elems.getText("scoreLabel");
        this._attList = this.elems.getUIList("attributeList");
        this.m_btnAutoBuy = this.elems.getActiveToggle("AutoBuy");
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
        this.m_skillList.Count = ZhuFuBaseView.MAX_SKILL_NUM;
        for (let i: number = 0; i < ZhuFuBaseView.MAX_SKILL_NUM; i++) {
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
        for (i = 0; i < ZhuFuBaseView.MAX_PROP_NUM; i++) {
            this.m_allProps[i] = { m_ucPropId: 0, m_ucPropValue: 0 };
        }
        this.m_costData = new MaterialItemData();
        this.beginTipMark = ElemFinder.findObject(this.BT_Auto, "tipMark");
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
        this.condition = this.elems.getText('condition');
        this.btnHuanHua = this.elems.getElement('btnHuanHua');
        this.mcUse = this.elems.getElement('mcUse');
        this.fullLevelFight = this.elems.getElement('fullLevelFight');
        this.fullScoreLabel = ElemFinder.findText(this.fullLevelFight, "fullLevelScore");
        this.nextLevelFight = this.elems.getText('nextLevelFight');
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
        this.normalList.onVirtualItemChange = delegate(this, this.onUpdateItem);

        //进阶日跳转按钮
        this.btnGotoJJR = this.elems.getElement("btnGotoJJR");
        this.zhongjiBtn = this.elems.getElement("zhongjiBtn");
        this.zhongjiBtn.SetActive(false);
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

        this.addListClickListener(this.normalList, this.onClickList);
        this.addClickListener(this.btnHuanHua, this.onClickHuanHuaBt);
        this.addClickListener(this.BT_PY, this.onClickBtnPy);
        this.addClickListener(this.btnGotoJJR, this.onClickGotoJJR);
        this.addClickListener(this.zhongjiBtn, this.onClickZhongJiBtn);


    }

    protected onOpen() {
        super.onOpen();

        //进阶日跳转的显示，红点
        this.showBtnGotoJJR = G.DataMgr.activityData.isShowJJRGotoBtn(this.id);
        this.btnGotoJJR.SetActive(this.showBtnGotoJJR);

        this.jjRankTipMark.SetActive(this.showBtnGotoJJR && G.DataMgr.runtime.isFirstShouldShowJJRTipMark);
        if (this.showBtnGotoJJR) {
            G.DataMgr.runtime.isFirstShouldShowJJRTipMark = false;
        }

        let level = 0;
        let data = G.DataMgr.zhufuData.getData(this.id);
        this.m_oldLucky = data.m_uiLucky;
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
        for (let i = 0; i < ZhuFuBaseView.LEVEL_NUM; i++) {
            this.rideEfects[i].stopEffect();
        }
        this.liziEffectRoot.SetActive(false);
        this.newDianRoot.SetActive(false);
        this.oldShowModel = null;
    }

    private updateHHView() {
        let zhufuData = G.DataMgr.zhufuData;
        let data = zhufuData.getData(this.id);
        if (data == null) {
            uts.log("未初始化");
            return;
        }
        let selectedindex = 0;
        let checkID = this.openId;
        if (this.openId == 0) {
            // checkID = zhufuData.getImageUnLevelID(data.m_uiShowID);
            checkID = zhufuData.getImageUnLevelID(this.selectedCFGID);
        }
        let images: number[] = zhufuData.getImageID(this.id);

        let zhuFuData = [];
        //进阶外形
        let selectCfg: GameConfig.ZhuFuConfigM;
        let unsameArray: number[] = [];
        this.huanhuazhuFuData = [];
        let activeList = [];
        let inactiveList = [];
        let cfgs: { [key: number]: GameConfig.ZhuFuConfigM } = zhufuData.getConfigs(this.id);
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
        activeList.sort(ZhufuData.huanHuaJinJieCompare);
        inactiveList.sort(ZhufuData.huanHuaJinJieCompare);

        //特殊外形
        let iddata = zhufuData.getImageID(this.id);
        iddata.sort(ZhufuData.huanHuaSpecialCompare);
        let thingData = G.DataMgr.thingData;
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
        for (let i of activeList) {
            this.huanhuazhuFuData.push(i);
        }
        for (let i of inactiveList) {
            this.huanhuazhuFuData.push(i);
        }
        this.normalList.Count = this.huanhuazhuFuData.length;

        for (let i = 0; i < this.huanhuazhuFuData.length; i++) {
            let data = this.huanhuazhuFuData[i];
            let byid = typeof (data) == "number";
            if (byid) {
                if (checkID == zhufuData.getImageUnLevelID(data)) {
                    selectedindex = i;
                }
            }
            else {
                if (checkID == (data as GameConfig.ZhuFuConfigM).m_iID) {
                    selectedindex = i;
                }
            }
        }


        if (this.normalList.Selected != selectedindex) {
            this.normalList.Selected = selectedindex;
        }
        if (this.oldhuanhuazhuFuData.length == this.huanhuazhuFuData.length) {
            for (let i = 0, len = this.oldhuanhuazhuFuData.length; i < len; i++) {
                let a = this.oldhuanhuazhuFuData[i];
                let b = this.huanhuazhuFuData[i];
                if (a != b) {
                    if (typeof (a) == "number" && typeof (b) == "number") {
                        if (zhufuData.getImageUnLevelID(a) != zhufuData.getImageUnLevelID(b)) {
                            this.normalList.ScrollByAxialRow(selectedindex);
                        }
                    }
                    else {
                        this.normalList.ScrollByAxialRow(selectedindex);
                    }
                    break;
                }
            }
        }
        else {
            this.normalList.ScrollByAxialRow(selectedindex);
        }
        this.normalList.Refresh();
        this.oldhuanhuazhuFuData = this.huanhuazhuFuData;
        let selectData = this.huanhuazhuFuData[selectedindex];
        if (typeof (selectData) == "number") {
            this.updateSpecialPanel(selectData);
        }
        else {
            this.updateJinJiePanel(selectData);
        }
        this.openId = 0;
    }
    private onUpdateItem(item: ListItem) {
        let index = item._index;
        let data = this.huanhuazhuFuData[index];
        let huanhuaitem = item.data.huanhuaitem as HuanHuaItem;
        if (!huanhuaitem) {
            let obj = this.normalList.GetItem(index).gameObject;
            huanhuaitem = new HuanHuaItem();
            huanhuaitem.setItem(obj);
            item.data.huanhuaitem = huanhuaitem;
        }
        let byid = typeof (data) == "number";
        if (byid) {
            huanhuaitem.updateById(data);
        }
        else {
            huanhuaitem.updateByCfg(data);
        }
        huanhuaitem.updateView();
    }

    /**点击左侧进阶List刷新面板*/
    private onClickList(index: number) {
        let selectData = this.huanhuazhuFuData[index];
        if (typeof (selectData) == "number") {
            this.updateSpecialPanel(selectData);
        }
        else {
            this.updateJinJiePanel(selectData);
        }
    }
    /**刷新进阶外形对应的面板数据*/
    private updateJinJiePanel(cfg: GameConfig.ZhuFuConfigM): void {
        this.zhongjiBtn.SetActive(false);
        if (this.id == KeyWord.HERO_SUB_TYPE_WUHUN) {
            this.fullLevelFight.SetActive(false);
        }
        this.leftTime = 0;
        this.updateHHAttList(cfg.m_astAttrList, null);
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
        this.nextLevelFight.gameObject.SetActive(false);
        let modelUrl = this.getModelUrl(cfg.m_iModelID);
        if (modelUrl != this.oldmodelURL) {
            this.oldmodelURL = modelUrl;
            this.addTimer("lateModel", 1, 1, this.lateLoadModel);
        }
    }
    /**刷新特殊外形对应的面板数据*/
    private updateSpecialPanel(cfgId: number): void {
        if (this.id == KeyWord.HERO_SUB_TYPE_WUHUN) {
            this.zhongjiBtn.SetActive(true);
        }

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
                if (dressOneImage.m_uiImageID == Macros.GUILD_PVP_CHAIRMAN_SHENQI_IMGID ||
                    dressOneImage.m_uiImageID == Macros.GUILD_PVP_CHAIRMAN_ZUOQI_IMGID ||
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
            this.updatePyMaterial(dressOneImage == null || dressOneImage.m_uiTimeOut > 0);
            this.pyIcon.SetActive(true);
        }
        else {
            this.pyIcon.SetActive(false);
        }
        if (oldimageid == imageid && oldLevel != level) {
            this.playLiZiEffect();
        }


        /*幻化神器需要显示最高阶段和下一阶增加的战斗力*/
        if (dressOneImage == null || dressOneImage.m_uiTimeOut > 0) {
            this.nextLevelFight.gameObject.SetActive(false);
        } else {
            if (nextConfig) {
                this.nextLevelFight.gameObject.SetActive(this.id == KeyWord.HERO_SUB_TYPE_WUHUN);
            }
        }
        this.fullLevelFight.SetActive(this.id == KeyWord.HERO_SUB_TYPE_WUHUN);
        if (this.id == KeyWord.HERO_SUB_TYPE_WUHUN) {
            let level = zhufuData.getImageLevel(cfgId);
            let imageid = zhufuData.getImageUnLevelID(cfgId);
            //下阶配置
            let next = zhufuData.getImageLevelID(imageid, level + 1);
            let nextConfig = zhufuData.getImageConfig(next);
            //当前阶段配置
            let now = zhufuData.getImageLevelID(imageid, level);
            let nowConfig = zhufuData.getImageConfig(now);
            if (nextConfig != null && nowConfig != null) {
                this.nextScoreValue = FightingStrengthUtil.calStrength(nextConfig.m_astProp) - FightingStrengthUtil.calStrength(nowConfig.m_astProp);
            }

            let fullconfig = zhufuData.getFullLevelConfig(this.id, imageid)
            this.fullScoreValue = FightingStrengthUtil.calStrength(fullconfig.m_astProp);
            if (this.isLevel) {
                this.isLevel = false;
                if (oldimageid == imageid) {
                    this.playFrameAnimation(oldLevel < level);
                }
            }

            if (imageid == this.special1 || imageid == this.special2) {
                this.zhongjiBtn.SetActive(false);
            }
            this.maxCfg = fullconfig;
            this.maxZhanLi = FightingStrengthUtil.calStrength(fullconfig.m_astProp).toString();

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
                if (this.id == KeyWord.HERO_SUB_TYPE_WUHUN) {       //神器飞升阶段需要显示成功率
                    this.condition.text = "成功率:" + nextConfig.m_iGaiLv / 100 + "%";    //飞升阶段显示成功概率
                }

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
        this.updateHHAttList(cfg.m_astProp, nextConfig == null ? null : nextConfig.m_astProp);
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
    private updatePyMaterial(active: boolean): void {
        if (this.m_pyMaterialData.id != 0) {
            if (active) {
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
    private updateHHAttList(m_huanhuaallProps: GameConfig.EquipPropAtt[], m_nextallProps: GameConfig.EquipPropAtt[]): void {
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
        this.scoreValue = FightingStrengthUtil.calStrength(m_huanhuaallProps);
    }

    private onSelectChange(index: number) {
        let opModel = this.modelRoot.transform;
        if (this.id == KeyWord.HERO_SUB_TYPE_WUHUN) {
            opModel = this.modelRoot.transform.parent;
        }
        let lizitran = this.liziEffectRoot.transform;
        if (index == 0) {
            this.jinjiePanel.SetActive(true);
            this.huanhuaPanel.SetActive(false);
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
            this.normalList.SetSlideAppearRefresh();
            this.updateHHView();
            this.onClickList(0);
            this.normalList.Selected = 0;
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
                if (ZhuFuBaseView.isNotTip) {
                    if (ZhuFuBaseView.isNotTipAgain) {
                        if (ZhuFuBaseView.isNotTipThirdConfirm == false) {
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
            else if (this.m_btnAutoBuy.isOn) {
                //TODO...计算是不是有问题? 购买数=需求-（拥有+万用进阶丹）
                let num = this.m_costData.need - this.m_costData.has + universalJinjieDanNum;
                var info = G.ActionHandler.checkAutoBuyInfo(this.m_costData.id, num, true);
                if (info.isAffordable == true) {
                    if (universalJinjieDanNum > 0) {
                        if (ZhuFuBaseView.isNotTip) {
                            if (ZhuFuBaseView.isNotTipAgain) {
                                if (ZhuFuBaseView.isNotTipThirdConfirm == false) {
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
                        this.requestLevelUp();
                        return;
                    }
                }
                this._stopAuto();
            }
            else {
                this._stopAuto();
                //if (this.currentStage >= ThingData.minLvOpenBatBuyViwe) {
                    //G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_costData.id, 1);
                    if (this.showBtnGotoJJR) {
                        G.Uimgr.createForm<JinJieRiBatBuyView>(JinJieRiBatBuyView).open(this.m_costData.id, 1);
                    }
                    else {
                        G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_costData.id, 1);
                    }

                // } else {
                //     G.TipMgr.addMainFloatTip("材料不足");
                // }
            }
            // if (this.m_isAuto) {
            //     this._stopAuto();
            // }
        }
    }


    private _onConfirmMultiRefine(stage: MessageBoxConst, isCheckSelected: boolean, openLevels: number[]): void {

        ZhuFuBaseView.isNotTip = isCheckSelected;
        if (MessageBoxConst.yes == stage) {
            this.requestLevelUp();
        }
        else {
            if (isCheckSelected == true) {
                ZhuFuBaseView.isNotTipAgain = true;
            }
            this._stopAuto();

        }

    }

    private _onConfirmMultiRefine2(stage: MessageBoxConst, isCheckSelected: boolean, openLevels: number[]): void {
        if (MessageBoxConst.yes == stage) {
            ZhuFuBaseView.isNotTipThirdConfirm = true;
            this.requestLevelUp();
        }
        else {
            this._stopAuto();
        }

    }

    /**
    * 滑动屏幕人物旋转
    * @param x
    * @param y
    */
    public onDrag() {
        if (this.id != KeyWord.HERO_SUB_TYPE_ZUOQI) {
            return;
        }
        let delta = Game.UIDragListener.eventData.delta;
        let roatespeed: number = 0.6;
        this.y = -roatespeed * delta.x + this.y;
        Game.Tools.SetRotation(this.modelRoot.transform, 0, this.y, 0);
    }

    public zhufuDataChange(id: number): void {
        if (this.id == id || 0 == id) {
            this.updateViewLater(true);
        }
    }
    public zhufuLevelChange(result: number): void {
        if (this.id != KeyWord.HERO_SUB_TYPE_WUHUN) return;

        this.isLevel = result == Macros.MsgID_HeroSub_ImageLevel_Request;
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
            this.addTimer("late", 100, 1, this.updateHHView);
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
        let modelUrl = this.getModelUrl(id);
        if (modelUrl != this.oldmodelURL) {
            this.oldmodelURL = modelUrl;
            this.addTimer("lateModel", 1, 1, this.lateLoadModel);
        }
        this.currentStage = ZhufuData.getZhufuStage(data.m_ucLevel, this.id);
        this.txtName.text = name;
        this.txtLv.text = DataFormatter.toHanNumStr(this.currentStage) + '阶';
        let level: number = 0;
        if (data.m_ucLevel == ZhufuData.getZhuFuMaxLevel(this.id)) {
            level = 10;
        }
        else {
            level = (data.m_ucLevel - 1) % 10;
        }
        for (let i = 0; i < ZhuFuBaseView.LEVEL_NUM; i++) {
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
                let color: string = this.m_costData.has + universalJinjieDanNum < this.m_costData.need ? Color.RED : Color.GREEN;
                if (this.m_costData.has > 0 || universalJinjieDanNum <= 0) {
                    //this.costValue = uts.format("{0}*{1}", TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_costData.id))/*, TextFieldUtil.getItemText(ThingData.getThingConfig(this._nextConfig.m_iUniversalItem)*//*, this.m_costData.has + universalJinjieDanNum*/, this.m_costData.need);

                    this.costValue = this.m_costData.need.toString();
                    this.addClickListener(this.BtnJInjieDan, this.onClickTextOpenTip);
                }
                else {
                    //this.costValue = uts.format("{0}*{1}", TextFieldUtil.getItemText(ThingData.getThingConfig(this._nextConfig.m_iUniversalItem))/*, TextFieldUtil.getItemText(ThingData.getThingConfig(this._nextConfig.m_iUniversalItem)*//*, this.m_costData.has + universalJinjieDanNum*/, this.m_costData.need);

                    this.costValue = this.m_costData.need.toString();
                    this.addClickListener(this.BtnJInjieDan, this.onClickWanyongTextOpenTip);
                }
                G.ResourceMgr.loadIcon(this.materialCost, ThingData.getThingConfig(this.m_costData.id).m_szIconID);
                //this.costValue = uts.format("{0}或{1}({2}/{3})", TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_costData.id)), TextFieldUtil.getItemText(ThingData.getThingConfig(this._nextConfig.m_iUniversalItem)), this.m_costData.has + universalJinjieDanNum, this.m_costData.need);
                this.hasValue = uts.format(" {0}", TextFieldUtil.getColorText((this.m_costData.has + universalJinjieDanNum).toString(), color));
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

        // 战斗力
        this.scoreValue = FightingStrengthUtil.calStrength(this.m_allProps);
        if (this.isZhufuDecrease) {
            this.onRefreshZfValueTip(null);
        }
        //可以升级阶级
        if (zhufuData.canStrengthZhufuSystem(this.id)) {
            this.tipMark = true;
        } else {
            this.tipMark = false;
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
        for (let i = 0; i < ZhuFuBaseView.MAX_SKILL_NUM; i++) {
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
        if (this.m_pyText == "激活") {
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
        else if (this.m_pyText == "飞升") {
            if (this.m_pyMaterialData.has < this.m_pyMaterialData.need) {
                G.TipMgr.addMainFloatTip('飞升材料不足');
            }
            else {
                if (this.id != KeyWord.HERO_SUB_TYPE_WUHUN) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHuanHuaFSRequest(this.id, id));
                } else {
                    //神器有掉级可能，需要加判断条件(注:有掉级可能需要加提示)
                    let dressOneImage: Protocol.HeroSubDressOneImage = zhufuData.getTimeItem(this.id, this.selectedCFGID);
                    let imageid = zhufuData.getImageUnLevelID(this.selectedCFGID);
                    let next = zhufuData.getImageLevelID(imageid, (dressOneImage == null || dressOneImage.m_uiTimeOut > 0) ? level : level + 1);
                    let nextConfig = zhufuData.getImageConfig(next);
                    if (nextConfig != null && level > nextConfig.m_iRangeMin) {
                        let info = uts.format('飞升失败时等级将降低至{0}阶，是否进行飞升', nextConfig.m_iRangeMin);
                        G.TipMgr.showConfirm(info, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmClick));
                    }
                    else {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHuanHuaFSRequest(this.id, id));
                    }
                }
            }
        }
    }

    private onConfirmClick(stage: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            let zhufuData = G.DataMgr.zhufuData;
            let id = zhufuData.getImageUnLevelID(this.selectedCFGID);
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHuanHuaFSRequest(this.id, id));
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

    private onClickZhongJiBtn() {
        G.Uimgr.createForm<ShenQiZhongJiView>(ShenQiZhongJiView).open(this.maxCfg, this.maxZhanLi);
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
export default ZhuFuBaseView;