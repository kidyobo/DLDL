import { BatBuyView } from "System/business/view/BatBuyView";
import { JinJieRiBatBuyView } from "System/business/view/JinJieRiBatBuyView";
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
import { TabSubFormCommon } from '../../uilib/TabFormCommom';

/**神器用 （坐骑ZhufuRideBaseView 神器ZhufuArtifactBaseView 紫极魔瞳和鬼影迷踪NewZhufuBaseView 控鹤擒龙MagicCubeView）*/
export abstract class ZhufuArtifactBaseView extends TabSubFormCommon {
    private readonly MAX_PROP_NUM: number = 10;


    /**特殊渠道获得,无需展示终极形象*/
    private special1: number = 13111;
    private special2: number = 13112;

    ///**
    // *所有的属性汇总
    // */
    private m_allProps: GameConfig.EquipPropAtt[];

    private MAX_HH_PROP_NUM: number = 7;

    private m_propNum: number = 0;

    /**
     *
     */
    private _nextConfig: GameConfig.ZhuFuConfigM;



    //private scoreLabel: UnityEngine.UI.Text;
    //private m_scoreValue: number;
    //private set scoreValue(value: number) {
    //    this.setTitleFight(value);
    //    // if (this.m_scoreValue != value) {
    //    //     this.m_scoreValue = value;
    //    //     this.scoreLabel.text = value.toString();
    //    // }
    //}
    //private fullScoreLabel: UnityEngine.UI.Text;
    //private m_fullScoreValue: number;
    //private set fullScoreValue(value: number) {
    //    if (this.m_fullScoreValue != value) {
    //        this.m_fullScoreValue = value;
    //        this.fullScoreLabel.text = value.toString();
    //    }
    //}


    //private nextLevelFight: UnityEngine.UI.Text;
    //private m_nextScoreValue: number;
    //private set nextScoreValue(value: number) {
    //    if (this.m_nextScoreValue != value) {
    //        this.m_nextScoreValue = value;
    //        this.nextLevelFight.text = '下一阶战力增加:' + value.toString();
    //    }
    //}
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
    private _attListData: HeroAttItemData[] = [];
    private _attListDic: {};
    private title: string = "";

    protected modelRoot: UnityEngine.GameObject;
    private currentData: Protocol.CSHeroSubSuper;
    private currentConfig: GameConfig.ZhuFuConfigM;
    private currentStage: number;
    private oldmodelURL: string;
    private zhufuTime: UnityEngine.UI.Text;

    private isLevel: boolean = false;
    protected y: number = 0;
    //粒子特效
    private liziEffectRoot: UnityEngine.GameObject;

    /**衰减的值*/
    private shuaiJianZhuFuValue: number = 0;
    /**现在的值，衰减的值*/
    private currentZhuFuValue: number = 0;
    /**当前阶级最大值*/
    private stageZhuFuMaxValue: number = 0;
    protected isZhufuDecrease = false;
    private curLevel: number = -1;
    private oldLevel: number = -1;


    /**打开面板时指定要显示的image id*/
    private openId: number = 0;

    //扩展的幻化界面内容，这个类之后再分类下
    private huanhuaPanel: UnityEngine.GameObject;
    private normalList: List = null;
    private huanhuazhuFuData = [];
    private condition: UnityEngine.UI.Text;
    private btnHuanHua: UnityEngine.GameObject;
    //private mcUse: UnityEngine.GameObject;
    //private fullLevelFight: UnityEngine.GameObject;
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


    private oldShowModel: number = 0;

    //神器飞升特性
    private succeedUIEffect: UIEffect;
    private failedUIEffect: UIEffect;

    /**最大等级配置*/
    protected maxCfg: GameConfig.ZhuFuImageConfigM;
    protected maxZhanLi: string;

    //幻化面板名字 + 战斗力
    private txtRideName: TextGetSet;
    private txtRideFight: TextGetSet;

    constructor(id: number) {
        super(id);
    }

    protected resPath(): string {
        return UIPathData.ShenQiView;
    }

    public setTitile(title: string) {
        this.title = title;
    }

    open(openId: number = 0) {
        this.openId = openId;
        super.open();
    }

    protected initElements(): void {
        super.initElements();


        this.pylevel = this.elems.getText("pylevel");
        let effectPrefab = this.elems.getElement("rideEffect");

        //粒子特效
        this.liziEffectRoot = this.elems.getElement("liziEffectRoot");


        //幻化内容

        this.huanhuaPanel = this.elems.getElement("huanhuaPanel");
        this.normalList = this.elems.getUIList('huanhuaList')
        this.condition = this.elems.getText('condition');
        this.btnHuanHua = this.elems.getElement('btnHuanHua');
        ////this.mcUse = this.elems.getElement('mcUse');
        //this.fullLevelFight = this.elems.getElement('fullLevelFight');
        //this.fullScoreLabel = ElemFinder.findText(this.fullLevelFight, "fullLevelScore");
        //this.nextLevelFight = this.elems.getText('nextLevelFight');
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
        this.txtRideName = new TextGetSet(this.elems.getText("txtRideName"));
        this.txtRideFight = new TextGetSet(this.elems.getText("txtRideFight"));

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

        this.addListClickListener(this.normalList, this.onClickList);

        this.addClickListener(this.btnHuanHua, this.onClickHuanHuaBt);
        this.addClickListener(this.BT_PY, this.onClickBtnPy);


    }

    protected onOpen() {
        super.onOpen();

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
        if (this.isZhufuDecrease) {
            this.addTimer("zhufu", 1000, 0, this.onRefreshZfValueTip);
        }
        //this.updateView();
        //粒子特效，放init，没播放完，关闭界面，再次打开不会在播放特效
        G.ResourceMgr.loadModel(this.liziEffectRoot, UnitCtrlType.other, "effect/ui/MR_shengji.prefab", this.sortingOrder);
        this.liziEffectRoot.SetActive(false);

        this.updateHHView();
        this.onClickList(0);
        this.normalList.Selected = 0;

    }

    protected onClose() {
        G.ResourceMgr.loadModel(this.modelRoot, 0, null, 0);
        this.oldmodelURL = null;
        this.m_oldLucky = -1;
        G.DataMgr.zhufuData.currentOtherPanelData = null;

        this.liziEffectRoot.SetActive(false);
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

        //进阶外形
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
        activeList.sort(ZhufuData.huanHuaListCompare);
        inactiveList.sort(ZhufuData.huanHuaListCompare);



        //特殊外形
        let ids = zhufuData.getImageID(this.id);
        let iddata = ids.filter(G.DataMgr.zhufuData.fitterData);

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
        this.updateAttList();
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
        //if (this.id == KeyWord.HERO_SUB_TYPE_WUHUN) {
        //    this.fullLevelFight.SetActive(false);
        //}
        this.leftTime = 0;
        this.updateHHAttList(cfg.m_astAttrList, null, cfg.m_szName);
        this.selectedCFGID = cfg.m_iID;
        let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(this.id);
        if (data != null && data.m_ucLevel >= cfg.m_iID) {
            this.condition.text = Constants.S_YONGJIU;
            this.btnHuanHua.SetActive(!(data.m_uiShowID == cfg.m_iID));
            //this.mcUse.SetActive(data.m_uiShowID == cfg.m_iID);
        }
        else {
            this.condition.text = uts.format('进阶到{0} 阶激活', ZhufuData.getZhufuStage(cfg.m_iID, this.id));
            this.btnHuanHua.SetActive(false);
            //this.mcUse.SetActive(false);
        }
        this.m_pyMaterialData.id = this.m_pyMaterialData.need = 0;
        this.peiyangPanel.SetActive(false);
        //this.nextLevelFight.gameObject.SetActive(false);
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
                //this.mcUse.SetActive(true);
                this.btnHuanHua.SetActive(false);
            }
            else {
                //this.mcUse.SetActive(false);
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
                //this.mcUse.SetActive(false);
            }
            else {
                this.leftTime = dressOneImage.m_uiTimeOut;
                this.condition.text = DataFormatter.second2day(dressOneImage.m_uiTimeOut - current);
            }
        }
        else {
            this.leftTime = 0;
            this.btnHuanHua.SetActive(false);
            //this.mcUse.SetActive(false);
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


        ///*幻化神器需要显示最高阶段和下一阶增加的战斗力*/
        //if (dressOneImage == null || dressOneImage.m_uiTimeOut > 0) {
        //    this.nextLevelFight.gameObject.SetActive(false);
        //} else {
        //    if (nextConfig) {
        //        this.nextLevelFight.gameObject.SetActive(this.id == KeyWord.HERO_SUB_TYPE_WUHUN);
        //    }
        //}
        //this.fullLevelFight.SetActive(this.id == KeyWord.HERO_SUB_TYPE_WUHUN);
        //if (this.id == KeyWord.HERO_SUB_TYPE_WUHUN) {
        //    let level = zhufuData.getImageLevel(cfgId);
        //    let imageid = zhufuData.getImageUnLevelID(cfgId);
        //    //下阶配置
        //    let next = zhufuData.getImageLevelID(imageid, level + 1);
        //    let nextConfig = zhufuData.getImageConfig(next);
        //    //当前阶段配置
        //    //let now = zhufuData.getImageLevelID(imageid, level);
        //    //let nowConfig = zhufuData.getImageConfig(now);
        //    //if (nextConfig != null && nowConfig != null) {
        //    //    this.nextScoreValue = FightingStrengthUtil.calStrength(nextConfig.m_astProp) - FightingStrengthUtil.calStrength(nowConfig.m_astProp);
        //    //}

        //    let fullconfig = zhufuData.getFullLevelConfig(this.id, imageid)
        //    //this.fullScoreValue = FightingStrengthUtil.calStrength(fullconfig.m_astProp);
        //    if (this.isLevel) {
        //        this.isLevel = false;
        //        if (oldimageid == imageid) {
        //            this.playFrameAnimation(oldLevel < level);
        //        }
        //    }
        //    this.maxCfg = fullconfig;
        //    this.maxZhanLi = FightingStrengthUtil.calStrength(fullconfig.m_astProp).toString();

        //}

        this.pyLevel = uts.format("{0}阶", level);

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
        this.setTitleFight(G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT));
        this.txtRideFight.text = uts.format("战斗力 {0}", FightingStrengthUtil.calStrength(m_huanhuaallProps).toString());
        this.txtRideName.text = name;

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


    public updateViewLater(isZhufu: boolean) {
        this.addTimer("late", 100, 1, this.updateHHView);
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
        this.m_allProps = [];
        for (let i = 0; i < this.MAX_PROP_NUM; i++) {
            this.m_allProps[i] = { m_ucPropId: 0, m_ucPropValue: 0 };
        }

        this._attListData.length = 0;
        this._attListDic = {};
        for (let prop of this.m_allProps) {
            if (prop.m_ucPropId) {
                let itemVo: HeroAttItemData = this.getHeroAttItemData(prop.m_ucPropId);
                itemVo.addVal = prop.m_ucPropValue;
            }
        }
        this.sortOnAttList();
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

    ///**请求升级*/
    //private requestLevelUp(): void {
    //    let zhufuData = G.DataMgr.zhufuData;
    //    let data = zhufuData.getData(this.id);
    //    if (data != null) {
    //        this.m_oldLevel = data.m_ucLevel;
    //        this.oldShowModel = this.currentConfig.m_iModelID;
    //        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZfjjRequest(this.id));

    //        if (KeyWord.HERO_SUB_TYPE_YUYI == this.id) {
    //            let funcLimitData = G.DataMgr.funcLimitData;
    //            if (funcLimitData.needGuildWing) {
    //                funcLimitData.needGuildWing = false;
    //                G.GuideMgr.checkTrailAndFmtBossCtrl();
    //            }
    //        }
    //    }
    //}



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

}
export default ZhufuArtifactBaseView;