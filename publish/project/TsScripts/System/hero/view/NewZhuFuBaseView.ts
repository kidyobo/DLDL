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
import { HeroView } from 'System/hero/view/HeroView';
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
import { IconItem } from 'System/uilib/IconItem';
import { List, ListItem } from "System/uilib/List";
import { SkillIconItem } from 'System/uilib/SkillIconItem';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil';
import { GameIDUtil } from 'System/utils/GameIDUtil';
import { PropUtil } from "System/utils/PropUtil";
import { RegExpUtil } from "System/utils/RegExpUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from 'System/utils/UIUtils';

/**紫极魔瞳和鬼影迷踪用 （坐骑ZhufuRideBaseView 神器ZhufuBaseView 紫极魔瞳和鬼影迷踪NewZhufuBaseView 控鹤擒龙MagicCubeView）*/
export abstract class NewZhuFuBaseView extends SpecialPriBasePanel {
    /**特殊渠道获得,无需展示终极形象*/
    private special1: number = 13111;
    private special2: number = 13112;
    private heroView: HeroView;
    //右侧标题
    private topName: UnityEngine.UI.Text;
    private topLevel: UnityEngine.UI.Text;

    private MAX_HH_PROP_NUM: number = 7;
    /**自动强化时间间隔*/
    private readonly deltaTime: number = 100;
    /**对应装备容器*/
    private m_containerID: number;

    //是否显示进阶日按钮
    private showBtnGotoJJR: boolean = false;
    private posEffectTarget: UnityEngine.Transform;

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
    //private limitText: UnityEngine.UI.Text;

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
    private static MAX_PROP_NUM: number = 12;
    private static MAX_SKILL_NUM: number = 2;
    private static LEVEL_NUM: number = 10;

    private title: string = "";

    protected modelRoot: UnityEngine.GameObject;
    private currentData: Protocol.CSHeroSubSuper;
    private currentConfig: GameConfig.ZhuFuConfigM;
    private currentStage: number;
    //private levelObjects: UnityEngine.GameObject[] = [];
    //private levelObjectsActive: boolean[] = [];
    //protected upgradeTitle: UnityEngine.UI.Text;
    //protected upgradeType1: UnityEngine.GameObject;
    //protected upgradeType2: UnityEngine.GameObject;
    //private rideEfects: UIEffect[] = [];


    private oldmodelURL: string;
    private czdConfig: GameConfig.ZhuFuDrugConfigM;
    private zzdConfig: GameConfig.ZhuFuDrugConfigM;
    private isZhuFu: boolean = false;
    private isLevel: boolean = false;
    protected y: number = 0;

    ////////////////////祝福找回和保留相关//////////////////////////
    //private zfzhPanel: UnityEngine.GameObject;

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
    //private zhenFaZhuFuText: UnityEngine.UI.Text;
    private isFirstOpen: boolean = true;
    //是否提示使用万用进阶丹
    private static isNotTip: boolean = false;
    private static isNotTipAgain: boolean = false;
    private static isNotTipThirdConfirm: boolean = false;

    //进阶丹信息提示的按钮
    //private BtnJInjieDan: UnityEngine.GameObject;
    //private BtnWanyongJInjieDan: UnityEngine.GameObject;

    /////////////////vip白金加成////////////////////


    // 特殊特权的图标名字
    protected specialVipIconName: string;

    /**打开面板时指定要显示的image id*/
    private openId: number = 0;



    //进阶日跳转

    private zhongjiBtn: UnityEngine.GameObject;

    private btnGotoJJR: UnityEngine.GameObject;
    private jjRankTipMark: UnityEngine.GameObject;

    private oldShowModel: number = 0;

    //private upEffect: UnityEngine.GameObject;
    //private zhufuPlusEffect: UnityEngine.GameObject;
    //private textZhufuPlus: UnityEngine.UI.Text;

    //神器飞升特性
    private succeedUIEffect: UIEffect;
    private failedUIEffect: UIEffect;

    /**最大等级配置*/
    protected maxCfg: GameConfig.ZhuFuImageConfigM;
    protected maxZhanLi: string;








    /*三个根节点  背景 进阶界面 幻化界面*/
    private rootBackgroupNode: UnityEngine.GameObject;
    private rootJinjiePanelNode: UnityEngine.GameObject;
    private rootHuanhuaPanelNode: UnityEngine.GameObject;

    /*背景 节点下的物体*/
    //private txtFighting: UnityEngine.UI.Text;               //战斗力
    private funcGroup: UnityEngine.UI.ActiveToggleGroup;    //"成长"“幻化”按钮group
    private liziEffectRoot: UnityEngine.GameObject;         //粒子特效
    protected altasIco: Game.UGUIAltas;                     //图集

    /*进阶界面 节点下的物体*/
    //左边
    private txtEquip: UnityEngine.UI.Text;                  //左边 装备标题
    private txtSkill: UnityEngine.UI.Text;                  //左边 技能标题
    private equipList: List;                                //左边 武器list
    private skillList: List;                                //左边 技能list
    //中间
    private btnBaoliu: UnityEngine.GameObject;              //"保"按钮
    private btnZhuihui: UnityEngine.GameObject;             //“追”按钮
    private imgLuckyIco: UnityEngine.UI.Image;              //中间的图标
    private txtLuckyValue: UnityEngine.UI.Text;             //祝福值数值  “700/800”
    private imgLuckyValue: UnityEngine.UI.Image;            //祝福 进度条
    private txtLv: UnityEngine.UI.Text;                     //等级（阶数）
    private txtName: UnityEngine.UI.Text;                   //对应的名字
    private vipbaijinObj: UnityEngine.GameObject;           //VIP加成
    private vipAddText: UnityEngine.UI.Text;                //VIP加成文字
    private btnCzd: UnityEngine.GameObject;                 //成长丹
    private czdTipMark: UnityEngine.GameObject;
    private btnZzd: UnityEngine.GameObject;                 //资质丹
    private zzdTipMark: UnityEngine.GameObject;
    //右边
    private attList: List;                                  //右侧 基础属性list
    btnBegin: UnityEngine.GameObject;               //开始进阶
    private btnAuto: UnityEngine.GameObject;                //自动进阶
    private txtZhufuTime: UnityEngine.UI.Text;              //祝福时间
    //private txtNeedGoods: UnityEngine.UI.Text;              //需要的材料数
    //private txtHasGoods: UnityEngine.UI.Text;               //拥有的材料数
    private btnTip: UnityEngine.GameObject;
    private btnTipClose: UnityEngine.GameObject;
    private panelTip: UnityEngine.GameObject;
    private icon: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;
    private txtAdvance: UnityEngine.UI.Text;                //"魂值进阶"text显示
    private rigthtxtName: UnityEngine.UI.Text;

    /*幻化界面 节点下的物体*/
    //左边
    private normalList: List = null;
    //中间
    private btnHuanHua: UnityEngine.GameObject;             //“幻化”按钮
    private mcUse: UnityEngine.GameObject;                  //“化形中”显示
    private fullLevelFight: UnityEngine.GameObject;         //飞升满级获得战斗力

    //右边
    //扩展的幻化界面内容，这个类之后再分类下

    private huanhuazhuFuData = [];

    private props: UnityEngine.GameObject;                  //右上边的数据显示的父节点
    private condition: UnityEngine.UI.Text;                 //成功率
    private peiyangPanel: UnityEngine.GameObject;           //下边的培养界面
    private BT_PY: UnityEngine.GameObject;                  //“飞升”按钮
    private BT_PY_TEXT: UnityEngine.UI.Text;                //按钮上的字
    private pylevel: UnityEngine.UI.Text;                   //阶
    private pyIcon: UnityEngine.GameObject;                 //图标
    private maxTip: UnityEngine.GameObject;                 //满阶提示


    /*----------对应数据----------*/
    /**装备列表的数据源*/
    private m_equipListData: BeautyEquipListItemData[];
    /**装备实例*/
    private equipItems: IconItem[] = [];

    /**穿装备数据*/
    //private m_bagEquipListData: BeautyEquipListItemData[] = [];
    /**技能列表的数据*/
    private m_skillData: ZhufuSkillItemData[];
    /**技能列表实例*/
    private skillItems: SkillIconItem[] = [];
    /**属性列表数据*/
    private _attListData: HeroAttItemData[] = [];
    /**右边材料 图标*/
    private iconItem: IconItem;

    private _attListDic: {};
    /**所有的属性汇总*/
    private m_allProps: GameConfig.EquipPropAtt[];

    /*----------辅助参数----------*/
    /**下一次祝福信息*/
    private _nextConfig: GameConfig.ZhuFuConfigM;
    /**是否自动强化*/
    private m_isAuto: boolean;
    /**消耗的材料*/
    private m_costData: MaterialItemData;
    /**属性个数*/
    private m_propNum: number = 0;



    private m_pyMaterialIconItem: IconItem;
    private m_pyMaterialData: MaterialItemData;

    private leftTime = 0;
    private selectedCFGID = 0;
    private oldhuanhuazhuFuData = [];


    constructor(id: number, isZhufuDecrease: boolean, specialVipPara: number, specialVipIconName: string) {
        super(id, specialVipPara);
        this.specialVipIconName = specialVipIconName;
        this.isZhufuDecrease = isZhufuDecrease;
    }

    protected resPath(): string {
        return UIPathData.NewZhuFuView;
    }

    public setTitile(title: string) {
        this.title = title;
        //this.upgradeTitle.text = title + "进阶";
    }

    open(openId: number = 0) {
        this.openId = openId;
        super.open();
    }



    protected initElements(): void {
        super.initElements();

        /*三个节点赋值  背景 进阶界面 幻化界面*/
        this.rootBackgroupNode = this.elems.getElement("bg");
        this.rootJinjiePanelNode = this.elems.getElement("jinjiePanel");
        this.rootHuanhuaPanelNode = this.elems.getElement("huanhuaPanel");

        /*背景节点下的物体获取*/
        //this.txtFighting = ElemFinder.findText(this.rootBackgroupNode, "fight/score");
        this.funcGroup = ElemFinder.findActiveToggleGroup(this.rootBackgroupNode, "funcGroup");
        this.funcGroup.onValueChanged = delegate(this, this.onSelectChange);
        this.altasIco = ElemFinder.findObject(this.rootBackgroupNode, "altasIco").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        //粒子特效
        this.liziEffectRoot = ElemFinder.findObject(this.rootBackgroupNode, "liziEffectRoot");

        /*进阶界面 节点下的物体获取*/
        let leftNode = ElemFinder.findObject(this.rootJinjiePanelNode, "left");
        let centreNode = ElemFinder.findObject(this.rootJinjiePanelNode, "centre");
        let rightNode = ElemFinder.findObject(this.rootJinjiePanelNode, "right");

        //左边
        this.txtEquip = ElemFinder.findText(leftNode, "txtEquip");
        this.txtSkill = ElemFinder.findText(leftNode, "txtSkill");
        this.equipList = ElemFinder.getUIList(ElemFinder.findObject(leftNode, "equipList"));
        this.skillList = ElemFinder.getUIList(ElemFinder.findObject(leftNode, "skillList"));
        this.initEquipList();
        this.initSkillList();
        //中间
        this.btnBaoliu = ElemFinder.findObject(centreNode, "ico/btn/btnBao");
        this.btnZhuihui = ElemFinder.findObject(centreNode, "ico/btn/btnZhui");
        this.imgLuckyIco = ElemFinder.findImage(centreNode, "ico/ico");
        this.txtLuckyValue = ElemFinder.findText(centreNode, "ico/txt/txtSlider");
        this.imgLuckyValue = ElemFinder.findImage(centreNode, "ico/bg/bgRedLoop");
        this.txtLv = ElemFinder.findText(centreNode, "ico/txt/txtLv");
        this.txtName = ElemFinder.findText(centreNode, "ico/txt/txtName");
        this.vipbaijinObj = ElemFinder.findObject(centreNode, "btns/VipAddFight");
        this.vipAddText = ElemFinder.findText(this.vipbaijinObj, 'vipAddText');
        this.btnGotoJJR = ElemFinder.findObject(centreNode, "btnDown/btnGotoJJR");
        this.jjRankTipMark = ElemFinder.findObject(this.btnGotoJJR, "jjRankTipMark");
        this.btnCzd = ElemFinder.findObject(centreNode, "btnDown/btnCzd");
        this.btnZzd = ElemFinder.findObject(centreNode, "btnDown/btnZzd");
        this.czdTipMark = ElemFinder.findObject(this.btnCzd, "czdTipMark");
        this.zzdTipMark = ElemFinder.findObject(this.btnZzd, "zzdTipMark");
        this.newDianRoot = ElemFinder.findObject(centreNode, "newDianRoot");
        this.newDianRoot.SetActive(false);
        //右边
        this.attList = ElemFinder.getUIList(ElemFinder.findObject(rightNode, "top/list"));
        this.btnBegin = ElemFinder.findObject(rightNode, "down/btn/btnStart");
        this.btnAuto = ElemFinder.findObject(rightNode, "down/btn/btnAuto");
        this.txtZhufuTime = ElemFinder.findText(rightNode, "down/tip/label3/txtTime");
        //this.txtNeedGoods = this.elems.getText("cost");
        //this.txtHasGoods = this.elems.getText("has");
        this.btnTip = ElemFinder.findObject(rightNode, "down/btnTip");
        this.panelTip = ElemFinder.findObject(rightNode, "down/tip");
        this.btnTipClose = ElemFinder.findObject(this.panelTip, "close");
        this.icon = ElemFinder.findObject(rightNode, "down/ico/icon");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);
        this.txtAdvance = ElemFinder.findText(rightNode, "down/txtTitle");
        this.rigthtxtName = ElemFinder.findText(rightNode, 'down/ico/txtName');

        /*幻化界面 节点下的物体获取*/
        leftNode = ElemFinder.findObject(this.rootHuanhuaPanelNode, "leftPanel");
        centreNode = ElemFinder.findObject(this.rootHuanhuaPanelNode, "middlePanel");
        rightNode = ElemFinder.findObject(this.rootHuanhuaPanelNode, "rightPanel");

        //左边
        this.normalList = ElemFinder.getUIList(ElemFinder.findObject(leftNode, "huanhuaList"));
        this.normalList.onVirtualItemChange = delegate(this, this.onUpdateItem);
        //中间
        this.btnHuanHua = ElemFinder.findObject(centreNode, "btnHuanHua");
        this.mcUse = ElemFinder.findObject(centreNode, 'mcUse');
        this.fullLevelFight = ElemFinder.findObject(centreNode, 'fullLevelFight');
        this.fullScoreLabel = ElemFinder.findText(this.fullLevelFight, "fullLevelScore");
        this.nextLevelFight = ElemFinder.findText(centreNode, 'nextLevelFight/nextLevelFight');
        this.zhongjiBtn = ElemFinder.findObject(centreNode, "zhongjiBtn");

        //右边
        this.condition = ElemFinder.findText(rightNode, 'condition');
        this.props = ElemFinder.findObject(rightNode, 'props');
        this.peiyangPanel = ElemFinder.findObject(rightNode, "peiyangPanel");
        this.BT_PY = ElemFinder.findObject(this.peiyangPanel, "BT_PY");
        this.BT_PY_TEXT = ElemFinder.findText(this.BT_PY, "Text");
        this.pyIcon = ElemFinder.findObject(this.peiyangPanel, "pyIcon");
        this.pylevel = ElemFinder.findText(this.peiyangPanel, "pylevel");
        this.maxTip = ElemFinder.findObject(this.peiyangPanel, "maxTip");

        this.m_pyMaterialIconItem = new IconItem();
        this.m_pyMaterialIconItem.setUsualIconByPrefab(this.elems.getElement('itemIcon_Normal'), this.pyIcon);
        this.m_pyMaterialIconItem.setTipFrom(TipFrom.normal);
        this.m_pyMaterialData = new MaterialItemData();

        this.topName = ElemFinder.findText(this.elems.getElement('topTitle'), 'txtName');
        this.topLevel = ElemFinder.findText(this.elems.getElement('topTitle'), 'txtLv');

        //标题初始化
        this.initTitleText(this.txtEquip, this.txtSkill, this.txtAdvance);
        //图标初始化
        this.initCentreIco(this.imgLuckyValue, this.imgLuckyIco);

        this.m_containerID = GameIDUtil.getContainerIDBySubtype(this.id);
        this.posEffectTarget = this.txtLuckyValue.transform;

        this.m_allProps = [];
        for (let i = 0; i < NewZhuFuBaseView.MAX_PROP_NUM; i++) {
            this.m_allProps[i] = { m_ucPropId: 0, m_ucPropValue: 0 };
        }
        this.m_costData = new MaterialItemData();

        // 特殊特权
        if (this.specialVipPara > 0) {
            let vipTeShuDesText = ElemFinder.findText(this.vipTeShuObj, 'desText');
            //let vipTeShuIcon = ElemFinder.findImage(this.vipTeShuObj, 'icon');
            //let vipTeShuAltas = ElemFinderMySelf.findAltas(this.elems.getElement('altas'));
            //vipTeShuIcon.sprite = vipTeShuAltas.Get(this.specialVipIconName);
            let specialVipPct = G.DataMgr.vipData.getSpecialPriPct(this.specialVipPara) * 100;
            vipTeShuDesText.text = this.specialVipIconName + uts.format('\n加成{0}%', specialVipPct);
        }

        //进阶日跳转按钮
        this.zhongjiBtn.SetActive(false);

        //特效
        let succeedPrefab = ElemFinder.findObject(this.rootBackgroupNode.transform.parent.gameObject, "resultEffect/feiscg");
        let failedPrefab = ElemFinder.findObject(this.rootBackgroupNode.transform.parent.gameObject, "resultEffect/feissb");
        this.succeedUIEffect = new UIEffect();
        this.failedUIEffect = new UIEffect();
        this.succeedUIEffect.setEffectObject(succeedPrefab);
        this.failedUIEffect.setEffectObject(failedPrefab);
    }

    /**初始化 进阶-左侧-装备数据 */
    private initEquipList() {
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
            Game.UIClickListener.Get(obj).onClick = delegate(this, this.onClickEquipIcon, iconItem);
        }
    }

    /**初始化 进阶-左侧-技能数据 */
    private initSkillList() {
        // 技能列表
        this.m_skillData = [];
        this.skillList.Count = NewZhuFuBaseView.MAX_SKILL_NUM;
        for (let i: number = 0; i < NewZhuFuBaseView.MAX_SKILL_NUM; i++) {
            let item = this.skillList.GetItem(i);
            let iconItem = new SkillIconItem(true);
            iconItem.setUsually(item.gameObject);
            iconItem.needShowLv = true;
            iconItem.needArrow = true;
            this.skillItems.push(iconItem);
            this.m_skillData[i] = new ZhufuSkillItemData();

        }
        this.skillList.Selected = 0;
    }

    /**
     * 初始化图标显示
     * @param loop 进度条的那个圆环
     * @param ico 中心的图标
     */
    protected initCentreIco(loop: UnityEngine.UI.Image, ico: UnityEngine.UI.Image) {

    }

    /**
     * 初始化标题显示
     * @param equip “魂兽装备”
     * @param skill “魂兽技能”
     * @param advance “魂值进阶”
     */
    protected initTitleText(equip: UnityEngine.UI.Text, skill: UnityEngine.UI.Text, advance: UnityEngine.UI.Text) {

    }

    protected initListeners(): void {
        super.initListeners();

        this.addClickListener(this.btnBegin, this.onBeginClick);
        this.addClickListener(this.btnAuto, this.onAutoClick);
        //this.addClickListener(this.m_costLabel.gameObject, this.onClickTextOpenTip);
        //this.addClickListener(this.BtnJInjieDan, this.onClickTextOpenTip);
        //this.addClickListener(this.BtnWanyongJInjieDan, this.onClickWanyongTextOpenTip);
        this.addClickListener(this.btnCzd, this.onClickCzd);
        this.addClickListener(this.btnZzd, this.onClickZzd);
        //祝福系规则相关
        this.addClickListener(this.btnBaoliu, this.onClickBtnBaoLiuZhuFu);
        this.addClickListener(this.btnZhuihui, this.onClickBtnZhuiHuiZhuFu);

        this.addListClickListener(this.normalList, this.onClickList);
        this.addClickListener(this.btnHuanHua, this.onClickHuanHuaBt);
        this.addClickListener(this.BT_PY, this.onClickBtnPy);
        this.addClickListener(this.btnGotoJJR, this.onClickGotoJJR);
        this.addClickListener(this.zhongjiBtn, this.onClickZhongJiBtn);

        this.addClickListener(this.btnTip, this.onClickOpenTip);
        this.addClickListener(this.btnTipClose, this.onClickCloseTip);
    }

    protected onOpen() {
        super.onOpen();
        this.heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (this.heroView != null) {
            this.heroView.showFight(true);
        }

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
        G.GuideMgr.processGuideNext(EnumGuide.ZhenFaActive, EnumGuide.ZhenFaActive_OpenView);
        G.GuideMgr.processGuideNext(EnumGuide.MiZongActive, EnumGuide.MiZongActive_OpenView);
    }
    public setTopTitle(index: number) {
        if (index == 0) {
            this.topName.text = '紫极魔瞳';
        } else {
            this.topName.text = '鬼影迷踪';
        }
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
        this.heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (this.heroView != null) {
            this.heroView.showFight(false);
        }
        //G.ResourceMgr.loadModel(this.modelRoot, 0, null, 0);
        this.oldmodelURL = null;
        this.m_oldLucky = -1;
        this._stopAuto();
        G.DataMgr.zhufuData.currentOtherPanelData = null;
        //for (let i = 0; i < NewZhuFuBaseView.LEVEL_NUM; i++) {
        //    this.rideEfects[i].stopEffect();
        //}
        this.liziEffectRoot.SetActive(false);
        this.newDianRoot.SetActive(false);
        this.oldShowModel = null;
    }




    /*START----------------------------------------更新界面---------------------------------------------------------------- */
    /**
    * 更新战斗力
    * @param data
    */
    private _updateFighting(datas: GameConfig.EquipPropAtt[]): void {
        //this.txtFighting.text = FightingStrengthUtil.calStrength(datas).toString();
        if (this.heroView != null) {
            this.heroView.setTxtFight(FightingStrengthUtil.calStrength(datas));
        }
    }

    /**更新技能 */
    private _updateSkill(): void {
        let skills = G.DataMgr.zhufuData.getSkillList(this.id);
        if (skills == null) return;
        //设置技能数据
        for (let i = 0; i < NewZhuFuBaseView.MAX_SKILL_NUM; i++) {
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

    /**更新装备 */
    private _updataEquip(): void {
        let equipObject = G.DataMgr.thingData.getContainer(this.m_containerID);
        for (let i = 0; i < 4; i++) {
            let itemData: BeautyEquipListItemData = this.m_equipListData[i];
            let data = itemData.thingItemData;

            if (equipObject != null && equipObject[i] != null) {
                data.config = equipObject[i].config;
                data.data = equipObject[i].data;

                this._mergeProp(data.config.m_astBaseProp);
                //TODO...数据处理有问题，先注释掉吧
                //let strengthConfig = G.DataMgr.equipStrengthenData.getEquipStrengthenConfigByThingItem(data);
                //this._mergeProp(strengthConfig.m_astProp);
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

        this.attList.Count = this._attListData.length;
        for (let i = 0, len = this.attList.Count; i < len; i++) {
            let data = this._attListData[i];
            let item = this.attList.GetItem(i);
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
            let val = data.addVal;
            if (valueValue != newValue) {
                valueValue = item.data.valueValue = newValue;
                let value = item.data.value;
                if (value == null) {
                    value = item.data.value = item.findText('value');
                }
                let str = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.propId);

                if (str == "增伤" || str == "减伤")
                    value.text = (val / 100).toString() + "%";
                else
                    value.text = newValue;
            }
        }
        this.iconItem.updateByMaterialItemData(this.m_costData);
        this.iconItem.updateIcon();
        if (this._nextConfig != null) {
            let equipinfo = ThingData.getThingConfig(this.m_costData.id);
            this.rigthtxtName.text = TextFieldUtil.getColorText(equipinfo.m_szName, Color.getColorById(equipinfo.m_ucColor));
        }
    }

    /**刷新祝福（成长）界面 */
    public updateView(): void {
        let zhufuData = G.DataMgr.zhufuData;
        let data = zhufuData.getData(this.id);
        if (data == null) return;
        //可能有坑 此处是功能刚开启时，直接打开，后台没有数据，等级为0，则前台直接给弄一个默认值1，用于读取本地的祝福数据
        if (data.m_ucLevel == 0)
            data.m_ucLevel = 1;
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
        this.topLevel.text = DataFormatter.toHanNumStr(this.currentStage) + '阶';
        let level: number = 0;
        if (data.m_ucLevel == ZhufuData.getZhuFuMaxLevel(this.id)) {
            level = 10;
        }
        else {
            level = (data.m_ucLevel - 1) % 10;
        }
        //for (let i = 0; i < NewZhuFuBaseView.LEVEL_NUM; i++) {
        //    let active = i < level;
        //    if (this.levelObjectsActive[i] != active) {
        //        this.levelObjectsActive[i] = active;
        //        this.levelObjects[i].SetActive(active);
        //    }
        //}

        this.curLevel = level;
        if (this._nextConfig != null) {
            this.m_costData.id = this._nextConfig.m_iConsumableID;
            this.m_costData.need = this._nextConfig.m_iConsumableNumber;
            let auto = this.m_isAuto;
            //幸运值
            let lucky: number = data.m_uiLucky;
            this.txtLuckyValue.text = uts.format("{0}/{1}", lucky, this._nextConfig.m_iLucky);
            //this.luckySliderValue = lucky / this._nextConfig.m_iLucky;
            let sliderValue = lucky / this._nextConfig.m_iLucky;
            sliderValue = 0.095 + sliderValue * 0.81;
            this.imgLuckyValue.fillAmount = sliderValue;
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
                    }
                }
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
            this.imgLuckyValue.fillAmount = 1;
            this.txtLuckyValue.text = "已满阶";
            this.icon.SetActive(false);
            this.rigthtxtName.text = '已满阶';
            UIUtils.setButtonClickAble(this.btnBegin, false);
            UIUtils.setButtonClickAble(this.btnAuto, false);
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
        this._updateFighting(this.m_allProps);

        if (this.isZhufuDecrease) {
            this.onRefreshZfValueTip(null);
        }
    }

    /**刷新幻化界面 */
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
        if (iddata == null) return;
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

    /*------------------------------------------------------更新界面-----------------------------------------END */


    /*START----------------------------------------------按钮等事件-------------------------------------------------- */
    /**
     * 切换界面 froup
     * @param index  0成长  1幻化
     */
    private onSelectChange(index: number) {
        if (index == 0) {
            this.rootJinjiePanelNode.SetActive(true);
            this.rootHuanhuaPanelNode.SetActive(false);
            this.updateView();
            uts.logError('切换界面----------------')
        }
        else {
            this.rootJinjiePanelNode.SetActive(false);
            this.rootHuanhuaPanelNode.SetActive(true);
            //默认打开界面时幻化是没有初始化的，这里要做第一次切换的初始化操作
            this.normalList.SetSlideAppearRefresh();
            this.updateHHView();

        }
    }

    /**"保"按钮事件 保留祝福 */
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

    /**
     * “保”的延伸 确定之后执行，延长时间
     * @param state
     * @param isCheckSelected
     */
    private onConfirmBaoLiuZhuFu(state: MessageBoxConst, isCheckSelected: boolean) {
        if (state == MessageBoxConst.yes) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHeroSubLuckyRequest(this.id, 1));
        }
    }

    /**“追”按钮事件 追回祝福 */
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

    /**打开提示 */
    private onClickOpenTip() {
        if (this.panelTip.activeSelf == false)
            this.panelTip.SetActive(true);
    }

    /**关闭提示 */
    private onClickCloseTip() {
        if (this.panelTip.activeSelf)
            this.panelTip.SetActive(false);
    }

    /**
     * 点击装备 左边四个
     * @param iconItem
     */
    private onClickEquipIcon(iconItem: IconItem) {
        // 显示tip
        let index = this.equipItems.indexOf(iconItem);
        let equipParts = this.getEquipPart();
        let equipPart: number = equipParts[index];
        let wearThingData: ThingItemData = this.m_equipListData[index].thingItemData;
        G.ActionHandler.showBagEquipPanel(equipPart, wearThingData, this.id, GameIDType.OTHER_EQUIP);
    }
    /**成长丹  0 */
    private onClickCzd() {
        G.Uimgr.createForm<GrowUpDrugTipView>(GrowUpDrugTipView).open(this.id, 0);
    }
    /**资质丹  1 */
    private onClickZzd() {
        G.Uimgr.createForm<GrowUpDrugTipView>(GrowUpDrugTipView).open(this.id, 1);
    }

    /**点击“开始进阶” */
    onBeginClick() {
        this.beginUpdrade();
    }

    /**“开始进阶”具体实现 */
    private beginUpdrade() {
        G.GuideMgr.processGuideNext(EnumGuide.ZhenFaActive, EnumGuide.ZhenFaActive_ClickPanelBtn);
        G.GuideMgr.processGuideNext(EnumGuide.MiZongActive, EnumGuide.MiZongActive_ClickPanelBtn);
        //万用进阶丹的数量
        let universalJinjieDanNum = G.DataMgr.thingData.getThingNum(this._nextConfig.m_iUniversalItem, Macros.CONTAINER_TYPE_ROLE_BAG, false)
        let tipDesc = uts.format('当前您的{0}已经不足，是否消耗{1}继续升阶？',
            TextFieldUtil.getItemText(ThingData.getThingConfig(this.m_costData.id)),
            TextFieldUtil.getItemText(ThingData.getThingConfig(this._nextConfig.m_iUniversalItem)));
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
                //万用进阶丹数量充足
                if (!this.isShowWanyongJJDTip()) {
                    G.TipMgr.showConfirm(tipDesc, ConfirmCheck.withCheck, '确定|取消', delegate(this, (stage: MessageBoxConst, isCheckSelected: boolean) => {
                        if (stage == MessageBoxConst.yes) {
                            this.setWanyongJJDTip(isCheckSelected);
                            this.requestLevelUp();
                        }
                        else {
                            this._stopAuto();
                        }
                    }));
                }
                else {
                    this.requestLevelUp();
                }
            }
            else {
                this._stopAuto();
                let num = this.m_costData.need - (this.m_costData.has + universalJinjieDanNum);
                let morelv = G.DataMgr.zhufuData.getZhufuNumber(this.id, true);
                let morenum = this.m_costData.need * morelv;
                num += morenum;
                G.ActionHandler.autoBuyMaterials(this.m_costData.id, num, () => {
                    for (let i = 0; i < morelv + 1; i++) {
                        this.requestLevelUp();
                    }
                });
            }
        }
    }

    /**点击“自动进阶” */
    protected onAutoClick(): void {
        if (this.m_isAuto) {
            this._stopAuto();
        }
        else {
            this._startAuto();
        }
    }

    /**
     * 左边幻化物体有变化执行
     * @param item
     */
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

    /**点击幻化*/
    private onClickHuanHuaBt(): void {
        let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(this.id);
        if (data != null && data.m_uiShowID != this.selectedCFGID) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuChangeRequest(this.id, G.DataMgr.zhufuData.getImageUnLevelID(this.selectedCFGID)));
        }
    }

    /**点击“终极形态” */
    private onClickZhongJiBtn() {
        G.Uimgr.createForm<ShenQiZhongJiView>(ShenQiZhongJiView).open(this.maxCfg, this.maxZhanLi);
    }

    /*------------------------------------------------------------------------按钮等事件-------------------------------------------------------------END */






















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
        this._updateFighting(m_huanhuaallProps);
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
        if (this.funcGroup.gameObject.activeSelf == false) {
            this.addTimer("late", 100, 1, this.updateView);
        } else {
            if (this.funcGroup.Selected == 0) {
                this.addTimer("late", 100, 1, this.updateView);
            }
            else {
                this.addTimer("late", 100, 1, this.updateHHView);
            }
        }
    }

    public lateLoadModel() {
        let type = this.getModelType();
        //G.ResourceMgr.loadModel(this.modelRoot, type, this.oldmodelURL, this.sortingOrder, true);
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
        this.txtZhufuTime.text = str;
        //if (this.isZhufuDecrease) {
        //    if (this.currentStage >= 5) {
        //        this.zhenFaZhuFuText.text = G.DataMgr.langData.getLang(350);
        //    } else {
        //        this.zhenFaZhuFuText.text = G.DataMgr.langData.getLang(349);
        //    }
        //}
    }



    /**更新限制文本*/
    private updateLimit(): void {
        let funId: number = GameIDUtil.getEnhanceFuncIdBySubType(this.id);
        let isActivated = G.DataMgr.funcLimitData.isFuncAvailable(funId);
        //if (!isActivated) {
        //let funcLimitConfig = G.DataMgr.funcLimitData.getFuncLimitConfig(funId);
        //this.limitText.text = funcLimitConfig.m_szDisableMsg;
        //}
        //this.limitText.gameObject.SetActive(!isActivated);
        this.btnBegin.SetActive(isActivated);
        this.btnAuto.SetActive(isActivated);
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
        //if (this.isZhufuDecrease) {
        //    return;
        //}
        //let effect = this.rideEfects[index];
        //if (effect) {
        //    effect.playEffect(EffectType.Effect_Normal);
        //    G.AudioMgr.playStarBombSucessSound();
        //}
        //else {
        //    uts.logWarning("index error:" + index);
        //}
    }

    private _startAuto(): void {
        if (!this.m_isAuto) {
            this.m_isAuto = true;
            UIUtils.setButtonClickAble(this.btnBegin, false);
            let label = this.btnAuto.GetComponentInChildren(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
            label.text = "停止进阶";
            this.beginUpdrade();
        }
    }
    private _stopAuto(): void {
        if (this.m_isAuto) {
            this.m_isAuto = false;
            UIUtils.setButtonClickAble(this.btnBegin, true);
            let label = this.btnAuto.GetComponentInChildren(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
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



    private onUp(): void {
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



    private playUpEffect() {
        //this.upEffect.SetActive(false);
        //this.upEffect.SetActive(true);
        //Game.Invoker.BeginInvoke(this.upEffect, "effect", 0.9, delegate(this, this.onEndUpEffect));
    }

    private onEndUpEffect() {
        //this.upEffect.SetActive(false);
    }

    private playZhufuPlusEffect(value: number) {
        //this.zhufuPlusEffect.SetActive(false);
        ////this.textZhufuPlus.text = value.toString();
        //this.zhufuPlusEffect.SetActive(true);
        //Game.Invoker.BeginInvoke(this.zhufuPlusEffect, "effect", 0.9, delegate(this, this.onEndZhufuPlusEffect));
    }

    private onEndZhufuPlusEffect() {
        //this.zhufuPlusEffect.SetActive(false);
    }

    protected isShowWanyongJJDTip(): boolean {
        return false;
    }

    protected setWanyongJJDTip(show: boolean) {

    }
}
export default NewZhuFuBaseView;