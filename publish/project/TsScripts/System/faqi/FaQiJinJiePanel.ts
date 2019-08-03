import { UIPathData } from 'System/data/UIPathData'
import { FaQiBasePanel } from 'System/faqi/FaQiBasePanel'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { HeroAttItemData } from 'System/hero/HeroAttItemData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { UIUtils } from 'System/utils/UIUtils'
import { FabaoData } from 'System/data/FabaoData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ThingData } from 'System/data/thing/ThingData'
import { PropUtil } from 'System/utils/PropUtil'
import { HeroRule } from 'System/hero/HeroRule'
import { SkillData } from 'System/data/SkillData'
import { IconItem } from 'System/uilib/IconItem'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { AchievementData } from 'System/data/AchievementData'
import { List, ListItem } from 'System/uilib/List'
import { GroupList, GroupListItem } from 'System/uilib/GroupList'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { SkillIconItem } from 'System/uilib/SkillIconItem'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'
import { TipFrom } from 'System/tip/view/TipsView'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { ZhuFuZhaoHuiView } from 'System/NewZhuFuRule/ZhuFuZhaoHuiView'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { PetPropItem } from 'System/pet/view/PetPropItem'
import { SiXiangData } from 'System/data/SiXiangData'
import { JinJieRiBatBuyView } from "System/business/view/JinJieRiBatBuyView"

class FaQiListItem extends ListItemCtrl {

    /**item背景图*/
    private itemBack: UnityEngine.GameObject = null;
    /**神盾名字*/
    private faQiName: UnityEngine.UI.Text = null;
    private txtLv: UnityEngine.UI.Text = null;
    /**神盾对应的icon图片*/
    private faQiIcon: UnityEngine.UI.Image = null;
    /**神盾是否出战*/
    private isBattle: UnityEngine.GameObject = null;
    /**神盾是否可激活图标*/
    private isActivate: UnityEngine.GameObject = null;
    /**可提升箭头*/
    private arrow: UnityEngine.GameObject = null;
    private faQiData = G.DataMgr.fabaoData;

    private view: FaQiJinJiePanel;
    constructor(view: FaQiJinJiePanel) {
        super();
        this.view = view;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.faQiName = ElemFinder.findText(go, "content/txtName");
        this.txtLv = ElemFinder.findText(go, "content/txtLv");
        this.faQiIcon = ElemFinder.findImage(go, "content/icon");
        this.isBattle = ElemFinder.findObject(go, "iswearing");
        this.isActivate = ElemFinder.findObject(go, "active");
        this.itemBack = ElemFinder.findObject(go, "content/bg");
        this.arrow = ElemFinder.findObject(go, "arrow");
    }

    update(data: Protocol.FaQiInfo) {
        let config = this.faQiData.getFaqiConfig(data.m_iID, data.m_ucLayer);
        this.faQiName.text = config.m_szName;
        this.txtLv.text = data.m_ucLayer > 0 ? (data.m_ucLayer + '阶') : "";
        this.faQiIcon.sprite = this.view.faQiIconAltas.Get(config.m_szName);
        this.isBattle.SetActive(data.m_iID == this.faQiData.wearingFaqi);
        UIUtils.setGrey(this.itemBack, !(data.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET), false);
        UIUtils.setGrey(this.faQiIcon.gameObject, !(data.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET), false);
        this.isActivate.SetActive(false);
        let thingData = G.DataMgr.thingData
        //获得神器对应的激活卡id
        let id = thingData.getCardIdByShenQiId(data.m_iID);
        let count = thingData.getThingNumInsensitiveToBind(id);
        if (data.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) {
            //判断是否可以激活并显示
            if (data.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET || count > 0) {
                this.isActivate.SetActive(true);
            } else {
                this.isActivate.SetActive(false);
            }
        }
        //是否可以提升等级或技能
        if ((data.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) && (G.DataMgr.fabaoData.canStrengthOneFaqi(data.m_iID) || G.DataMgr.fabaoData.canSkillLevelUpOneFaqi(data.m_iID))) {
            this.arrow.SetActive(true);
        } else {
            this.arrow.SetActive(false);
        }
    }
}



export enum FaQiPanelTag {
    TAG_ENHANCE = 1,
    TAG_SOUL = 2,
    TAG_SKILL = 3,
}


export class FaQiJinJiePanel extends FaQiBasePanel {
    /**自动强化时间间隔*/
    private readonly deltaTime: number = 0.1;
    faQiIconAltas: Game.UGUIAltas;
    //------------------面板左侧神盾List相关-----------------//
    private faQiList: List = null;
    private m_oldPart: number = -1;
    private m_btnFight: UnityEngine.GameObject;
    private m_autoTime: number = 0;
    private m_waitBagChangeAuto = false;
    private m_currentConfig: GameConfig.FaQiCfgM;
    private m_nextConfig: GameConfig.FaQiCfgM;
    private m_costData: MaterialItemData = new MaterialItemData();
    private m_selectID: number = 0;
    private isAfterLevelUp: boolean = false;
    private m_oldLevel: number = -1;
    //-------------------公用属性面板---------------------------//
    private propItems: PetPropItem[] = [];
    private m_attListData: HeroAttItemData[] = [];
    private m_attListDic: { [key: number]: HeroAttItemData };
    //------------------属性面板激活面板------------------------//
    private activePanel: UnityEngine.GameObject;
    private m_btnActive: UnityEngine.GameObject;
    private activeCondition: UnityEngine.UI.Text;
    private activeSkillInfoText: UnityEngine.UI.Text;
    //------------------属性面板进阶面板------------------------//
    private m_propPanelMcUplevel: UnityEngine.GameObject;
    private m_btnEnhance: UnityEngine.GameObject;
    private m_btnAutoEnhance: UnityEngine.GameObject;
    private m_btnAutoText: UnityEngine.UI.Text;
    private m_btnAutoBuy: UnityEngine.UI.ActiveToggle;
    private m_isAuto: boolean = false;
    private upLevelZhuFuTime: UnityEngine.UI.Text;
    private upLevelXiaoHao: UnityEngine.UI.Text;
    private upLevelMaterialHas: UnityEngine.UI.Text;
    private upLevelZhuFuValue: UnityEngine.UI.Text;
    private zfslider: UnityEngine.UI.Slider;
    //------------------技能提升面板------------------------//
    private m_skillUpPanel: UnityEngine.GameObject;
    private m_btnSkillUp: UnityEngine.GameObject;
    private m_btnAutoBuyToggle: UnityEngine.UI.ActiveToggle;
    private m_skillBar: UnityEngine.UI.Slider;
    private skillSjXiaoHao: UnityEngine.UI.Text;
    private skillMaterialHas: UnityEngine.UI.Text;
    private skillBarValue: UnityEngine.UI.Text;
    private skillslider: UnityEngine.UI.Slider;
    private m_skillIconItem: SkillIconItem;
    private m_skillConfig: GameConfig.SkillConfigM;
    private m_skillCostData: MaterialItemData = new MaterialItemData();
    ////-----------------------注魂(该功能暂时没开放)-------------------//
    private m_soulPanel: UnityEngine.GameObject;
    private m_btnSoulEnhance: UnityEngine.GameObject;
    private m_soulBar: UnityEngine.UI.Slider;
    private soulUpLevelXh: UnityEngine.UI.Text;
    private soulMaterialHas: UnityEngine.UI.Text;
    private m_currentSoulConfig: GameConfig.FaQiZhuHunCfgM;
    private m_nextSoulConfig: GameConfig.FaQiZhuHunCfgM;
    private m_soulCostData: MaterialItemData = new MaterialItemData();
    private m_soulOldLevel: number = 0;
    //---------------------打开的功能，1进阶，2注魂,3技能--------------------*/
    private m_selectedTag: number = FaQiPanelTag.TAG_ENHANCE;
    private LEVEL_NUM: number = 5;
    private nowSelectedFq: number = 0;
    private faQiModelPos: UnityEngine.GameObject;
    //-----------------------面板顶部三个按钮------------------------------//
    private topBtGroup: UnityEngine.GameObject;
    private m_btnEnhanceEnter: UnityEngine.GameObject;
    private m_btnSoulEnter: UnityEngine.GameObject;
    private m_btnTopSkill: UnityEngine.GameObject;
    private skillIcon_Normal: UnityEngine.GameObject;
    private fightText: UnityEngine.UI.Text;
    private fight: number = 0;
    /**技能，进阶按钮红点*/
    private skillTipMark: UnityEngine.GameObject;
    private jinjieTipMark: UnityEngine.GameObject;
    private skillBtSelected: UnityEngine.GameObject;
    private jinJieBtSelected: UnityEngine.GameObject;
    //消耗品文本添加tip
    private jinjieText: UnityEngine.GameObject;
    private skillText: UnityEngine.GameObject;
    private isFirstOpen: boolean = true;

    private openTab: FaQiPanelTag;
    private openId = 0;

    //粒子特效
    private liziEffectRoot: UnityEngine.GameObject;
    private oldFaqiLv: number = -1;
    private curFaqiLv: number = -1;
    private txtName: UnityEngine.UI.Text;
    private txtLv: UnityEngine.UI.Text;

    /////////////////////祝福值保留和追加//////////////////////////
    private btn_BaoLiuZhuFu: UnityEngine.GameObject;
    private btn_ZhuiHuiZhuFu: UnityEngine.GameObject;
    private stageMaxZhuFuValue: number = 0;
    private currentZhuFuValue: number = 0;
    private shuaijianZhuFuValue: number = 0;


    private faQiListInfoData: Protocol.FaQiInfo[] = [];
    private listItems: FaQiListItem[] = [];
    //进阶日跳转
    private btnGotoJJR: UnityEngine.GameObject;
    private jjRankTipMark: UnityEngine.GameObject;

    private showBtnGotoJJR:boolean =false ;

    constructor() {
        super(KeyWord.BAR_FUNCTION_FAQI);
    }

    protected resPath(): string {
        return UIPathData.FaQiJinJieView;
    }

    protected initElements() {
        this.fightText = this.elems.getText("textZDL");
        this.zfslider = this.elems.getSlider("zfslider");
        this.skillslider = this.elems.getSlider("skillslider");
        //左侧神盾List
        this.faQiList = ElemFinder.getUIList(this.elems.getElement("faqiList"));
        this.faQiIconAltas = ElemFinderMySelf.findAltas(this.elems.getElement("titleIconAltas"));
        //激活面板相关
        this.activePanel = this.elems.getElement("jihuoPanel");
        this.m_btnActive = ElemFinder.findObject(this.activePanel, "Btjh");
        this.activeCondition = ElemFinder.findText(this.activePanel, "condition");
        this.activeSkillInfoText = ElemFinder.findText(this.activePanel, "skillEffect");
        //属性面板公用部分
        let props = this.elems.getElement('props');
        for (let i = 0; i < FabaoData.MAX_FaQiNum; i++) {
            let itemGo = ElemFinder.findObject(props, i.toString());
            let item = new PetPropItem();
            item.setUsual(itemGo);
            this.propItems.push(item);
        }
        //技能提升面板
        this.m_skillUpPanel = this.elems.getElement("skillPanel");
        this.m_btnSkillUp = ElemFinder.findObject(this.m_skillUpPanel, "jnTsBt");
        this.m_btnAutoBuyToggle = ElemFinder.findActiveToggle(this.m_skillUpPanel, "toggle");
        this.skillSjXiaoHao = ElemFinder.findText(this.m_skillUpPanel, "skill/sjXiaohao");
        this.skillMaterialHas = ElemFinder.findText(this.m_skillUpPanel, "skill/xianyou");
        this.skillBarValue = ElemFinder.findText(this.skillslider.gameObject, "Fill Area/txtSlider");
        //神盾显示位置
        this.faQiModelPos = this.elems.getElement("faqiPostion");
        //顶部神盾进阶 注魂按钮
        this.topBtGroup = this.elems.getElement("topBtGroup");
        this.m_btnEnhanceEnter = ElemFinder.findObject(this.topBtGroup, "BtJinjie");
        this.m_btnSoulEnter = ElemFinder.findObject(this.topBtGroup, "BtZhuHun");
        this.m_btnTopSkill = ElemFinder.findObject(this.topBtGroup, "BtSkill");
        //进阶面板
        this.m_propPanelMcUplevel = this.elems.getElement("jinjiePanel");
        this.m_btnEnhance = ElemFinder.findObject(this.m_propPanelMcUplevel, "Bt/jinjieBt");
        this.m_btnAutoEnhance = ElemFinder.findObject(this.m_propPanelMcUplevel, "Bt/autoBt");
        this.m_btnAutoText = ElemFinder.findText(this.m_btnAutoEnhance, "Text");
        this.m_btnAutoBuy = ElemFinder.findActiveToggle(this.m_propPanelMcUplevel, "toggle");
        this.upLevelZhuFuTime = ElemFinder.findText(this.m_propPanelMcUplevel, "zhufuTime");
        this.upLevelXiaoHao = ElemFinder.findText(this.m_propPanelMcUplevel, "sjxiaohao/sjXiaohao");
        this.upLevelMaterialHas = ElemFinder.findText(this.m_propPanelMcUplevel, "sjxiaohao/xianyou");
        this.upLevelZhuFuValue = ElemFinder.findText(this.zfslider.gameObject, "Fill Area/txtSlider");
        //注魂面板相关
        this.m_soulPanel = this.elems.getElement("zhuhunPanel");
        this.m_btnSoulEnhance = ElemFinder.findObject(this.m_soulPanel, "BtZh");
        this.m_soulBar = ElemFinder.findSlider(this.m_soulPanel, "zhxiaohao/Slider");
        this.soulUpLevelXh = ElemFinder.findText(this.m_soulPanel, "zhxiaohao/sjXiaohao");
        this.soulMaterialHas = ElemFinder.findText(this.m_soulPanel, "zhxiaohao/xianyou");
        //出战按钮
        this.m_btnFight = this.elems.getElement("chuzhanBt");
        // 技能图标
        this.skillIcon_Normal = this.elems.getElement("skillIcon_Normal");
        this.m_skillIconItem = new SkillIconItem(true);
        let root = this.m_skillUpPanel.transform.Find("Icon").gameObject;
        this.m_skillIconItem.setUsuallyByPrefab(this.skillIcon_Normal, root);
        //红点
        this.skillTipMark = ElemFinder.findObject(this.m_btnTopSkill, "tipMark");
        this.jinjieTipMark = ElemFinder.findObject(this.m_btnEnhanceEnter, "tipMark");
        this.skillBtSelected = ElemFinder.findObject(this.m_btnTopSkill, 'selected');
        this.jinJieBtSelected = ElemFinder.findObject(this.m_btnEnhanceEnter, 'selected');
        //文本添加tip
        this.jinjieText = this.elems.getElement("jinjieText");
        this.skillText = this.elems.getElement("skillText");
        //粒子特效
        this.liziEffectRoot = this.elems.getElement("liziEffectRoot");
        this.txtName = this.elems.getText("txtName");
        this.txtLv = this.elems.getText("txtLv");
        //祝福值追回和保留按钮
        this.btn_BaoLiuZhuFu = this.elems.getElement("btn_baoliu");
        this.btn_ZhuiHuiZhuFu = this.elems.getElement("btn_zhui");

        //进阶日跳转按钮
        this.btnGotoJJR = this.elems.getElement("btnGotoJJR");
        this.jjRankTipMark = this.elems.getElement("jjRankTipMark");

    }

    protected initListeners() {
        this.addListClickListener(this.faQiList, this.onClickFaQiList);
        this.addClickListener(this.m_btnActive, this.onBtnActiveClick);
        this.addClickListener(this.m_btnSkillUp, this.onBtnSKillClick);
        this.addClickListener(this.m_btnEnhanceEnter, this.onBtnEnhanceEnterClick);
        this.addClickListener(this.m_btnSoulEnter, this.onBtnSoulEnterClick);
        this.addClickListener(this.m_btnEnhance, this.onBtnEnhanceClick);
        this.addClickListener(this.m_btnAutoEnhance, this.onBtnAutoClick);
        this.addClickListener(this.m_btnSoulEnhance, this.onBtnSoulEnhanceClick);
        this.addClickListener(this.m_btnFight, this.onBtnFightClick);
        this.addClickListener(this.m_btnTopSkill, this.onClickTopSkillBt);
        this.addClickListener(this.jinjieText, this.onClickJinJieText);
        this.addClickListener(this.skillText, this.onClickSkillText);
        //祝福值新规则相关
        this.addClickListener(this.btn_BaoLiuZhuFu, this.onClickBtnBaoLiuZhuFu);
        this.addClickListener(this.btn_ZhuiHuiZhuFu, this.onClickBtnZhuiHuiZhuFu);

        this.addClickListener(this.btnGotoJJR, this.onClickGotoJJR);

    }

    open(faqiId = 0, type: FaQiPanelTag = FaQiPanelTag.TAG_ENHANCE) {
        this.openTab = type;
        this.openId = faqiId;
        super.open();
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFaqiRequest(0, Macros.FAQI_OP_LIST));
        this.isAfterLevelUp = false;
        this.addTimer("1", 1000, 0, this.refreshZfValueTip);
        if (this.openId > 0) {
            this.m_selectID = this.openId;
        } else {
            let wearingFaQi = G.DataMgr.fabaoData.wearingFaqi;
            if (wearingFaQi == 0) {
                let canJiHuoId = G.DataMgr.fabaoData.faqiIdArr[0];
                for (let i = 0; i < FabaoData.MAX_FaQiNum; i++) {
                    let faqiId = G.DataMgr.fabaoData.faqiIdArr[i];
                    if (faqiId > 0) {
                        if (G.DataMgr.fabaoData.canFaqiActive(faqiId)) {
                            canJiHuoId = faqiId;
                            break;
                        }
                    }
                }
                this.m_selectID = canJiHuoId;
            } else {
                this.m_selectID = wearingFaQi;
            }    
        }
        //我要变强指定打开
        if (this.openTab == FaQiPanelTag.TAG_SKILL) {
            this.onClickTopSkillBt();
        } else {
            this.onBtnEnhanceEnterClick();
        }
        //粒子特效，放init，没播放完，关闭界面，再次打开不会在播放特效
        G.ResourceMgr.loadModel(this.liziEffectRoot, UnitCtrlType.other, "effect/ui/MR_shengji.prefab", this.sortingOrder);
        this.liziEffectRoot.SetActive(false);
        this.updateFaQiLv();
        let dataOne = G.DataMgr.zhufuData.getData(KeyWord.BAR_FUNCTION_FAQI);

        //进阶日跳转的显示，红点
        this.showBtnGotoJJR = G.DataMgr.activityData.isShowJJRGotoBtn(this.id);
        this.btnGotoJJR.SetActive(this.showBtnGotoJJR);
        this.jjRankTipMark.SetActive(this.showBtnGotoJJR && G.DataMgr.runtime.isFirstShouldShowJJRTipMark);
        if (this.showBtnGotoJJR) {
            G.DataMgr.runtime.isFirstShouldShowJJRTipMark = false;
        }
    }

    protected onClose() {
        this.m_isAuto = false;
        this.liziEffectRoot.SetActive(false);
    }

    private onClickJinJieText() {
        let item = new IconItem();
        item.updateById(this.m_costData.id);
        G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
    }

    private onClickSkillText() {
        let item = new IconItem();
        item.updateById(this.m_skillCostData.id);
        G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
    }

    updateView(): void {
        /**是否显示技能，进阶上的红点*/
        this.skillTipMark.SetActive(G.DataMgr.fabaoData.canSkillLevelUpOneFaqi(this.m_selectID));
        this.jinjieTipMark.SetActive(G.DataMgr.fabaoData.canStrengthOneFaqi(this.m_selectID));
        this.setFaQiListData();
        if (this.isFirstOpen) {
            let data = G.DataMgr.fabaoData.getFaqiData(this.m_selectID);
            let selectedIndex = this.faQiListInfoData.indexOf(data);
            this.faQiList.Selected = selectedIndex;
            this.faQiList.ScrollByAxialRow(selectedIndex);
            this.onClickFaQiList(selectedIndex);
            this.isFirstOpen = false;
            return;
        }
        this.updateCurrentSelect(this.nowSelectedFq);
    }


    private setFaQiListData() {
        this.faQiListInfoData = [];
        let faQiData = G.DataMgr.fabaoData;
        for (let i = 0; i < FabaoData.MAX_FaQiNum; i++) {
            let id = faQiData.faqiIdArr[i];
            if (id > 0) {
                let data = faQiData.getFaqiData(id);
                this.faQiListInfoData.push(data);
            }
        }
        this.faQiListInfoData.sort(this.sortFaQi);
        this.faQiList.Count = this.faQiListInfoData.length;
        for (let index = 0; index < this.faQiListInfoData.length; index++) {
            let obj = this.faQiList.GetItem(index).gameObject;
            let item = this.getListItem(index, obj);
            item.update(this.faQiListInfoData[index]);
        }
    }


    private getListItem(index: number, obj: UnityEngine.GameObject) {
        if (index < this.listItems.length) {
            return this.listItems[index];
        } else {
            let item = new FaQiListItem(this);
            item.setComponents(obj);
            this.listItems.push(item);
            return item;
        }
    }

    /**背包改变*/
    onContainerChange(type: number): void {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.m_waitBagChangeAuto = false;
            this.updateBagInfo(type);
            this.updateView();
        }
    }

    onSkillChange(): void {
        this.updateSkill();
        this.updateBagInfo(Macros.CONTAINER_TYPE_ROLE_BAG);
    }

    ///////////////////////////////////////// 事件处理 ////////////////////////////////////////////

    /**点击开始进阶按钮*/
    private onBtnEnhanceClick(): void {
        if (this.m_costData.id == 0) {
            return;
        }
        if (this.m_costData.has >= this.m_costData.need) {
            this.m_oldLevel = G.DataMgr.fabaoData.getFaqiData(this.m_selectID).m_ucLayer;
            this.isAfterLevelUp = true;
            this.m_waitBagChangeAuto = true;
            this.onFaQiLvUpSendMessage();
        }
        else if (this.m_btnAutoBuy.isOn) {
            let num: number = this.m_costData.need - this.m_costData.has;
            let info = G.ActionHandler.checkAutoBuyInfo(this.m_costData.id, num, true);
            if (info.isAffordable) {
                if (num < this.m_costData.need) {
                    this.m_waitBagChangeAuto = true;
                }
                this.onFaQiLvUpSendMessage();
                return;
            }
            this.stopAuto();
        }
        else {
            this.stopAuto();
            if (this.m_currentConfig.m_iFaQiLv >= ThingData.minLvOpenBatBuyViwe) {
                if (this.showBtnGotoJJR) {
                    G.Uimgr.createForm<JinJieRiBatBuyView>(JinJieRiBatBuyView).open(this.m_costData.id, 1);
                }
                else {
                    G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_costData.id, 1);
                }
            } else {
                G.TipMgr.addMainFloatTip("材料不足");
            }
        }
    }

    private onFaQiLvUpSendMessage() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFaqiRequest(this.m_selectID, Macros.FAQI_OP_UPLEVEL));
    }

    /**点击开始注魂按钮*/
    private onBtnSoulEnhanceClick(): void {
        if (this.m_soulCostData.id == 0) {
            return;
        }
        if (this.m_soulCostData.has < this.m_soulCostData.need) {
            G.TipMgr.addMainFloatTip('注魂材料不足');
        }
        else {
            this.isAfterLevelUp = true;
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFaqiRequest(this.m_selectID, Macros.FAQI_OP_ZHUHUN));
        }
    }


    private onBtnAutoClick(): void {
        //点击自动进阶
        if (this.m_isAuto) {
            this.stopAuto();
        }
        else {
            this.startAuto();
        }
    }

    private startAuto(): void {
        if (!this.m_isAuto) {
            this.m_isAuto = true;
            UIUtils.setButtonClickAble(this.m_btnEnhance, false);
            this.m_btnAutoText.text = '停止进阶';
            this.onBtnEnhanceClick();
        }
    }

    private stopAuto(): void {
        if (this.m_isAuto) {
            this.removeTimer('temp');
            this.m_isAuto = false;
            let btStage: boolean = (this.m_costData.id != 0);
            UIUtils.setButtonClickAble(this.m_btnEnhance, btStage);
            UIUtils.setButtonClickAble(this.m_btnAutoEnhance, btStage);
            this.m_btnAutoText.text = '自动进阶';
            this.m_autoTime = 0;
            this.m_oldPart = -1;
        }
    }

    private updateFaQiLv() {
        let fabaoData: FabaoData = G.DataMgr.fabaoData;
        let data: Protocol.FaQiInfo = fabaoData.getFaqiData(this.m_selectID);
        if (data != null && (data.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET)) {
            this.oldFaqiLv = this.curFaqiLv = data.m_ucLayer;
        }
    }

    private onClickFaQiList(index: number): void {
        //点击左侧神盾刷新界面数据
        let dataFaQi = G.DataMgr.fabaoData;
        let selectIndex = dataFaQi.getFaQiIndex(this.faQiListInfoData[index]);
        this.m_selectID = G.DataMgr.fabaoData.faqiIdArr[selectIndex];
        this.nowSelectedFq = selectIndex;
        this.updateFaQiLv();
        this.updateCurrentSelect(selectIndex);
        this.liziEffectRoot.SetActive(false);
        /**是否显示技能，进阶上的红点*/
        this.skillTipMark.SetActive(G.DataMgr.fabaoData.canSkillLevelUpOneFaqi(this.m_selectID));
        this.jinjieTipMark.SetActive(G.DataMgr.fabaoData.canStrengthOneFaqi(this.m_selectID));
    }

    /**点击顶部进阶按钮*/
    private onBtnEnhanceEnterClick(): void {
        if (this.m_selectedTag != FaQiPanelTag.TAG_ENHANCE) {
            this.m_selectedTag = FaQiPanelTag.TAG_ENHANCE;
            this.jinJieBtSelected.SetActive(true);
            this.skillBtSelected.SetActive(false);
            this.updateView();
        }
    }

    /**点击顶部铸魂按钮*/
    private onBtnSoulEnterClick(): void {
        if (this.m_selectedTag != FaQiPanelTag.TAG_SOUL) {
            this.stopAuto();
            this.m_selectedTag = FaQiPanelTag.TAG_SOUL;
            this.updateView();
        }
    }


    /**点击顶部技能按钮*/
    private onClickTopSkillBt() {
        if (this.m_selectedTag != FaQiPanelTag.TAG_SKILL) {
            this.stopAuto();
            this.m_selectedTag = FaQiPanelTag.TAG_SKILL;
            this.jinJieBtSelected.SetActive(false);
            this.skillBtSelected.SetActive(true);
            this.updateView();
        }
    }


    private onBtnActiveClick(): void {
        let thingData = G.DataMgr.thingData
        let id = thingData.getCardIdByShenQiId(this.m_selectID);
       
        let count = thingData.getThingNumInsensitiveToBind(id);
        if (count > 0) {

            let itemDatas = G.DataMgr.thingData.getBagItemById(id, false, 1);
            if (null != itemDatas && itemDatas.length > 0) {
                let itemData = itemDatas[0];
                if ((itemData.config.m_ucCanBatUse & KeyWord.ITEM_USE_METHOD_BATUSE) != 0) {
                    // 可以批量使用
                    G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data, itemData.data.m_iNumber);
                } else {

                    G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data, 1);
                }
            }
        } else {
            //点击激活按钮
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFaqiRequest(this.m_selectID, Macros.FAQI_OP_ACT));
        }
        
    }

    private onBtnFightClick(): void {
        //点击出战按钮
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFaqiRequest(this.m_selectID, Macros.FAQI_OP_CHANGE_IMAGE));
    }

    private onBtnSKillClick(): void {
        //点击技能提升按钮   
        if (this.m_skillCostData.id == 0) {
            return;
        }
        let data: Protocol.FaQiInfo = G.DataMgr.fabaoData.getFaqiData(this.m_selectID);
        if ((this.m_skillConfig.nextLevel.m_iSkillID) > (G.DataMgr.fabaoData.getFaqiConfig(this.m_selectID, data.m_ucLayer).m_iSkillID)) {
            G.TipMgr.addMainFloatTip('您的神盾等级较低，请先升级神盾');
            return;
        }
        if (this.m_skillCostData.has < this.m_skillCostData.need && !this.m_btnAutoBuyToggle.isOn) {
            G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_skillCostData.id, this.m_skillCostData.need - this.m_skillCostData.has);
        }
        else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateSkill(this.m_skillConfig.nextLevel.m_iSkillID, Macros.OPERATE_SKILL_STUDY, 0, 0, this.m_skillConfig.nextLevel.m_stSkillStudy.m_ucAllowStep));
        }
    }


    ///////////////////////////////////////// 面板显示 /////////////////////////////////////////

    /**
    * 播放粒子系统
    */
    private playLiZiEffect() {
        this.liziEffectRoot.SetActive(true);
        Game.Invoker.BeginInvoke(this.liziEffectRoot, "effect", 2.5, delegate(this, this.onEndEffect));
    }

    private onEndEffect() {
        this.liziEffectRoot.SetActive(false);
    }


    /**更新当前显示*/
    private updateCurrentSelect(index: number): void {
        let fabaoData: FabaoData = G.DataMgr.fabaoData;
        this.m_selectID = fabaoData.faqiIdArr[index];
        if (this.m_selectID > 0) {
            let data: Protocol.FaQiInfo = fabaoData.getFaqiData(this.m_selectID);
            if (data != null) {
                this.m_currentConfig = fabaoData.getFaqiConfig(this.m_selectID, fabaoData.faqiMaxLevel);
                this.txtName.text = this.m_currentConfig.m_szName;
                this.m_currentSoulConfig = null;
                if (data.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                    this.activePanel.SetActive(false);
                    this.m_propPanelMcUplevel.SetActive(true);
                    this.m_btnEnhanceEnter.SetActive(true);
                    //this.m_btnSoulEnter.SetActive(true);
                    this.m_propPanelMcUplevel.SetActive(this.m_selectedTag == FaQiPanelTag.TAG_ENHANCE);
                    this.m_soulPanel.SetActive(this.m_selectedTag == FaQiPanelTag.TAG_SOUL);
                    this.m_btnFight.SetActive(this.m_selectID != fabaoData.wearingFaqi);
                    this.m_skillUpPanel.SetActive(this.m_selectedTag == FaQiPanelTag.TAG_SKILL);
                    this.m_btnTopSkill.SetActive(true);
                    this.m_currentConfig = fabaoData.getFaqiConfig(this.m_selectID, data.m_ucLayer);
                    this.m_currentSoulConfig = fabaoData.getFaqiZhuhunCfg(this.m_selectID, data.m_stZhuHunInfo.m_uiLevel);
                    this.refreshZfValueTip(null);
                    this.m_nextConfig = fabaoData.getFaqiConfig(this.m_selectID, data.m_ucLayer + 1);
                    this.m_nextSoulConfig = fabaoData.getFaqiZhuhunCfg(this.m_selectID, data.m_stZhuHunInfo.m_uiLevel + 1);
                    //此处处理粒子特效的播放
                    this.curFaqiLv = data.m_ucLayer;
                    if (this.oldFaqiLv != this.curFaqiLv) {
                        G.AudioMgr.playJinJieSucessSound();
                        this.playLiZiEffect();
                        this.oldFaqiLv = this.curFaqiLv;
                    }
                    if (this.m_nextConfig != null && this.m_nextConfig.m_iSkillID > 0) {
                        this.m_costData.id = this.m_currentConfig.m_iConsumableID;
                        this.m_costData.need = this.m_currentConfig.m_iConsumableNumber;
                        let consumableConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(this.m_currentConfig.m_iConsumableID);
                        this.upLevelXiaoHao.text = uts.format('消耗：{0}×{1}', TextFieldUtil.getItemText(consumableConfig), this.m_costData.need);
                        this.upLevelZhuFuValue.text = "祝 福 值 : " + data.m_uiWish.toString() + "/" + this.m_currentConfig.m_iLuckyUp;
                        this.zfslider.value = data.m_uiWish / this.m_currentConfig.m_iLuckyUp;
                        //设置祝福值参数
                        this.stageMaxZhuFuValue = this.m_currentConfig.m_iLuckyUp;
                        this.shuaijianZhuFuValue = data.m_uiSaveWish;
                        this.currentZhuFuValue = data.m_uiWish;
                        //自动强化的逻辑
                        if (this.m_isAuto) {
                            if (this.m_oldPart >= 0 && this.m_oldPart != this.m_selectID) {
                                this.stopAuto();
                            }
                            else if (this.m_oldLevel != data.m_ucLayer) {
                                this.stopAuto();
                            }
                            else if (this.m_costData.id == 0) {
                                this.stopAuto();
                            }
                            else {
                                let now = UnityEngine.Time.realtimeSinceStartup;
                                if (now - this.m_autoTime > this.deltaTime) {
                                    if (!this.m_waitBagChangeAuto) {
                                        this.m_autoTime = now;
                                        this.onBtnEnhanceClick();
                                    }
                                }
                                else {
                                    this.addTimer("temp", this.deltaTime, 1, this.onTimer);
                                }
                            }
                        }
                        else {
                            UIUtils.setButtonClickAble(this.m_btnEnhance, this.m_costData.id > 0);
                            UIUtils.setButtonClickAble(this.m_btnAutoEnhance, this.m_costData.id > 0);
                        }
                    }
                    else {
                        this.upLevelZhuFuValue.text = "已 满 级";
                        this.zfslider.value = 1;
                        this.upLevelXiaoHao.text = "";
                        UIUtils.setButtonClickAble(this.m_btnEnhance, false);
                        UIUtils.setButtonClickAble(this.m_btnAutoEnhance, false);
                        this.stopAuto();
                    }
                    if (this.m_nextSoulConfig != null) {
                        this.m_soulCostData.id = this.m_nextSoulConfig.m_iConsumableID;
                        this.m_soulCostData.need = this.m_nextSoulConfig.m_iConsumableNumber;
                        let consumableConfig = ThingData.getThingConfig(this.m_nextSoulConfig.m_iConsumableID);
                        this.soulUpLevelXh.text = uts.format('消耗：{0}×{1}', TextFieldUtil.getItemText(consumableConfig), this.m_soulCostData.need);
                        this.m_soulBar.value = data.m_stZhuHunInfo.m_uiWish / this.m_nextSoulConfig.m_iLuckyUp;
                        UIUtils.setButtonClickAble(this.m_btnSoulEnhance, true);
                    }
                    else {
                        this.m_soulBar.value = 0;
                        this.soulUpLevelXh.text = "";
                        UIUtils.setButtonClickAble(this.m_btnSoulEnhance, false);
                    }
                }
                else {
                    this.m_soulPanel.SetActive(false);
                    //this.m_btnSoulEnter.SetActive(false);
                    this.m_btnEnhanceEnter.SetActive(false);
                    this.m_btnTopSkill.SetActive(false);
                    this.activePanel.SetActive(true);
                    this.m_propPanelMcUplevel.SetActive(false);
                    this.m_btnFight.SetActive(false);
                    this.m_skillUpPanel.SetActive(false);
                    /////////////////此处可能有问题/////////////////////////
                    //this.m_propPanel.mcActive.tfQuest.htmlText = AchievementData.getQuestStr(this.m_currentConfig.m_iActID, data.m_uiDoneCount);
                    this.activeCondition.text = AchievementData.getQuestStr(this.m_currentConfig.m_iActID, data.m_uiDoneCount);
                    let thingData = G.DataMgr.thingData
                    //获得神器对应的激活卡id
                    let id = thingData.getCardIdByShenQiId(data.m_iID);
                    //uts.log(data.m_iID+' 神器id '+id+'  激活卡id');
                    let count = thingData.getThingNumInsensitiveToBind(id);
                    if (data.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET || count>0) {
                        //激活按钮置灰
                        UIUtils.setButtonClickAble(this.m_btnActive, true);
                    }
                    else {
                        UIUtils.setButtonClickAble(this.m_btnActive, false);
                    }
                    this.stopAuto();
                }
                this.isAfterLevelUp = false;
                let fight: number = 0;
                for (let i: number = 0; i < FabaoData.MAX_FaQiNum; i++) {
                    if (i < this.m_currentConfig.m_astAddedProp.length) {
                        fight += FightingStrengthUtil.calStrengthByOneProp(this.m_currentConfig.m_astAddedProp[i].m_ucPropId, this.m_currentConfig.m_astAddedProp[i].m_ucPropValue);
                    }
                    if (this.m_currentSoulConfig != null && i < this.m_currentSoulConfig.m_astProp.length) {
                        fight += FightingStrengthUtil.calStrengthByOneProp(this.m_currentSoulConfig.m_astProp[i].m_ucPropId, this.m_currentSoulConfig.m_astProp[i].m_ucPropValue);
                    }
                }
                let zhuHunStage = ElemFinder.findText(this.m_btnSoulEnter, "jieshuNumber");
                zhuHunStage.text = uts.format('{0}阶', fabaoData.getFaqiZhuhunStage(data.m_stZhuHunInfo.m_uiLevel));
                this.fight = fight;
                this.fightText.text = this.fight.toString();
                this.updateAttList();
                this.updateSkill();
                this.updateBagInfo(Macros.CONTAINER_TYPE_ROLE_BAG);
                if (this.m_oldPart != this.m_selectID) {
                    //加载神盾模型
                    G.ResourceMgr.loadModel(this.faQiModelPos, UnitCtrlType.faqi, this.m_currentConfig.m_iModelID.toString(), this.sortingOrder);
                }
                if (this.m_oldLevel == 0 || this.m_oldLevel != data.m_ucLayer) {
                    //加载神盾阶数
                    this.txtLv.text = DataFormatter.toHanNumStr(this.m_currentConfig.m_iFaQiLv) + '阶';
                    this.m_oldLevel = data.m_ucLayer;
                }
                if (this.m_soulOldLevel == -1 || this.m_soulOldLevel != data.m_stZhuHunInfo.m_uiLevel) {
                    // this.m_soulStageIma.loadImage('fqzh_' + int(fabaoData.getFaqiZhuhunStage(data.m_stZhuHunInfo.m_uiLevel)), EnumFilePath.FAQI);
                    let star: number = fabaoData.getFaqiZhuhunStar(data.m_stZhuHunInfo.m_uiLevel);
                    for (let i = 0; i < this.LEVEL_NUM; i++) {
                        if (i < star) {
                            //this.m_soulPanel[this.MC_LEVEL[i]].gotoAndStop(2);
                        }
                        else {
                            //this.m_soulPanel[this.MC_LEVEL[i]].gotoAndStop(1);
                        }
                    }
                    this.m_soulOldLevel = data.m_stZhuHunInfo.m_uiLevel;
                }
                this.m_oldPart = this.m_selectID;
            }
        }
    }


    private updateSkill(): void {
        //更新技能提升面板
        let data: Protocol.FaQiInfo = G.DataMgr.fabaoData.getFaqiData(this.m_selectID);
        this.m_skillConfig = G.DataMgr.skillData.getStudiedSkillBySerial(this.m_currentConfig.m_iSkillID);
        if (this.m_skillConfig == null) {
            this.m_skillConfig = SkillData.getSkillConfig(this.m_currentConfig.m_iSkillID);
        }
        this.m_skillIconItem.updateBySkillID(this.m_skillConfig.m_iSkillID);
        this.m_skillIconItem.needShowLv = true;
        this.m_skillIconItem.updateIcon();

        if (this.m_skillConfig.nextLevel != null && this.m_skillConfig.nextLevel.m_stSkillStudy != null) {
            this.m_skillCostData.id = this.m_skillConfig.nextLevel.m_stSkillStudy.m_iStudyItem;
            this.m_skillCostData.need = this.m_skillConfig.nextLevel.m_stSkillStudy.m_ucAllowStep;
            let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(this.m_skillCostData.id);
            this.skillBarValue.text = "祝 福 值 : " + this.m_skillConfig.progress.toString();
            this.skillslider.value = this.m_skillConfig.progress / this.m_skillConfig.nextLevel.m_stSkillStudy.m_iStudyItemNum;
            this.skillSjXiaoHao.text = uts.format('消耗：{0}×{1}', TextFieldUtil.getItemText(thingConfig), this.m_skillCostData.need);
        }
        else {
            this.m_skillCostData.id = 0;
            this.skillBarValue.text = "已 满 级";
            this.skillslider.value = 1;
            this.skillSjXiaoHao.text = "";
        }
        if (data.m_ucLayer > 0 && this.m_skillConfig.m_iNextLevelID > 0) {
            UIUtils.setButtonClickAble(this.m_btnSkillUp, true);
        } else {
            UIUtils.setButtonClickAble(this.m_btnSkillUp, false);
        }
        this.activeSkillInfoText.text = RegExpUtil.xlsDesc2Html(this.m_skillConfig.m_szDescription);
    }


    /**更新属性列表*/
    private updateAttList(): void {
        this.m_attListData.length = 0;
        this.m_attListDic = {};
        for (let prop of this.m_currentConfig.m_astAddedProp) {
            if (prop.m_ucPropId) {
                let itemVo: HeroAttItemData = this.getHeroAttItemData(prop.m_ucPropId);
                itemVo.macroId = PropUtil.getPropMacrosByPropId(prop.m_ucPropId);
                itemVo.addVal = prop.m_ucPropValue;
            }
        }
        if (this.m_currentSoulConfig != null) {
            for (let prop of this.m_currentSoulConfig.m_astProp) {
                if (prop.m_ucPropId) {
                    let itemVo = this.getHeroAttItemData(prop.m_ucPropId);
                    itemVo.macroId = PropUtil.getPropMacrosByPropId(prop.m_ucPropId);
                    itemVo.addVal += prop.m_ucPropValue;
                }
            }
        }
        // 附加光环属性
        let siXiangData = G.DataMgr.siXiangData;
        let pos = siXiangData.getFaQiPositionById(this.m_currentConfig.m_iID);
        if (pos > 0) {
            let ssId1 = SiXiangData.getShenShouId1ByFaQiPosition(pos);
            if (ssId1 > 0) {
                this.addHaloProps(ssId1);
            }
            let ssId2 = SiXiangData.getShenShouId2ByFaQiPosition(pos);
            if (ssId2 > 0) {
                this.addHaloProps(ssId2);
            }
        }

        this.sortOnAttList();
        for (let i = 0; i < FabaoData.MAX_FaQiNum; i++) {
            let propItem = this.propItems[i];
            if (i < this.m_attListData.length) {
                propItem.update(this.m_attListData[i].propId, this.m_attListData[i].addVal);
            } else {
                propItem.update(0, 0);
            }
        }
    }

    private addHaloProps(ssId: number) {
        let siXiangData = G.DataMgr.siXiangData;
        let ssInfo = siXiangData.getShenShouInfo(ssId);
        let ssCfg = siXiangData.getCfg(ssId, ssInfo.m_ucLevel);
        for (let p of ssCfg.m_astHalo) {
            if (p.m_ucPropId > 0 && p.m_ucPropValue > 0) {
                let itemVo = this.m_attListDic[p.m_ucPropId];
                if (null != itemVo) {
                    itemVo.addVal += Math.floor(itemVo.addVal * p.m_ucPropValue / 10000);
                }
            }
        }
    }

    /**排序属性列表*/
    private sortOnAttList(): void {
        if (this.m_currentConfig != null) {
            let attVec: GameConfig.EquipPropAtt[] = this.m_currentConfig.m_astAddedProp;
            let len: number = attVec.length;
            for (let i: number = 0; i < len; i++) {
                let prop: GameConfig.EquipPropAtt = attVec[i] as GameConfig.EquipPropAtt;
                if (prop.m_ucPropId) {
                    let itemVo: HeroAttItemData = this.getHeroAttItemData(prop.m_ucPropId);
                    itemVo.configIndex = i;
                }
            }
        }
        this.m_attListData.sort(HeroRule.sortAttListData);
    }


    /**
    * 获取属性列表ITEM数据
    * @param	m_ucPropId
    * @return
    */
    private getHeroAttItemData(m_ucPropId: number): HeroAttItemData {
        let itemVo: HeroAttItemData = this.m_attListDic[m_ucPropId] as HeroAttItemData;
        if (!itemVo && m_ucPropId > 0) {
            itemVo = new HeroAttItemData();
            let macroId: number = PropUtil.getPropMacrosByPropId(m_ucPropId);
            itemVo.macroId = macroId;
            this.m_attListData.push(itemVo);
            this.m_attListDic[m_ucPropId] = itemVo;
        }
        return this.m_attListDic[m_ucPropId];
    }


    private onTimer(time: Game.Timer): void {
        this.m_autoTime = UnityEngine.Time.realtimeSinceStartup;
        this.onBtnEnhanceClick();
    }

    /**刷新现有材料*/
    private updateBagInfo(type: number): void {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            if (this.m_costData.id > 0) {
                this.m_costData.has = G.DataMgr.thingData.getThingNum(this.m_costData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                if (this.m_currentConfig) {
                    if (this.m_currentConfig.m_iSpecialID > 0) {
                        this.m_costData.has += G.DataMgr.thingData.getThingNum(this.m_currentConfig.m_iSpecialID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                    }
                }
                let color: string = this.m_costData.has < this.m_costData.need ? Color.WHITE : Color.GREEN;
                this.upLevelMaterialHas.text = uts.format('现有：{0}', TextFieldUtil.getColorText(this.m_costData.has.toString(), color));
            }
            else {
                this.upLevelMaterialHas.text = "";
            }
            if (this.m_skillCostData.id > 0) {
                this.m_skillCostData.has = G.DataMgr.thingData.getThingNum(this.m_skillCostData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                let color = this.m_skillCostData.has < this.m_skillCostData.need ? Color.WHITE : Color.GREEN;
                this.skillMaterialHas.text = uts.format('现有：{0}', TextFieldUtil.getColorText(this.m_skillCostData.has.toString(), color));

            }
            else {
                this.skillMaterialHas.text = "";
            }
            if (this.m_soulCostData.id > 0) {
                this.m_soulCostData.has = G.DataMgr.thingData.getThingNum(this.m_soulCostData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                let color = this.m_soulCostData.has < this.m_soulCostData.need ? Color.WHITE : Color.GREEN;
                this.soulMaterialHas.text = uts.format('现有：{0}', TextFieldUtil.getColorText(this.m_soulCostData.has.toString(), color));
            }
        }
    }


    //////////////////////////////////////祝福值新规则,保留和追回//////////////////////////////////////////

    private refreshZfValueTip(timer: Game.Timer): void {
        //刷新祝福值计时
        let data: Protocol.FaQiInfo = G.DataMgr.fabaoData.getFaqiData(this.m_selectID);
        if (data == null) {
            return;
        }
        let str: string = TextFieldUtil.getColorText('祝福值衰减倒计时:', Color.BLUE);
        let current = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (data.m_ucLayer >= 5 && data.m_uiWish > 0) {
            str += DataFormatter.second2hhmmss(Math.max(0, data.m_uiTimeOut - current));
        }
        else {
            str += '不限时';
        }
        str += '\n';
        str += '衰减规则:';
        str += '\n';
        if (data.m_ucLayer >= 5) {
            str += G.DataMgr.langData.getLang(350);
        } else {
            str += G.DataMgr.langData.getLang(349);
        }
        this.upLevelZhuFuTime.text = str;
    }



    /**点击保留祝福值按钮*/
    private onClickBtnBaoLiuZhuFu() {
        let data: Protocol.FaQiInfo = G.DataMgr.fabaoData.getFaqiData(this.m_selectID);
        if (data == null) {
            return;
        }
        if (data.m_uiTimeOut == 0) {
            G.TipMgr.addMainFloatTip("目前还没开始衰减,不需要保留祝福值");
            return;
        }
        G.TipMgr.showConfirm('是否花费50钻石将祝福值衰减时间延长24小时？', ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmBaoLiuZhuFu));
    }

    private onConfirmBaoLiuZhuFu(state: MessageBoxConst, isCheckSelected: boolean) {
        if (state == MessageBoxConst.yes) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFaqiRequest(this.m_selectID, Macros.FAQI_OP_LUCKY_KEEP));
        }
    }


    /**点击追回祝福值按钮*/
    private onClickBtnZhuiHuiZhuFu() {
        let data: Protocol.FaQiInfo = G.DataMgr.fabaoData.getFaqiData(this.m_selectID);
        if (data == null) {
            return;
        }
        if (data.m_uiSaveWish == 0) {
            G.TipMgr.addMainFloatTip("当前没有衰减祝福值,不需要找回");
            return;
        }
        G.Uimgr.createForm<ZhuFuZhaoHuiView>(ZhuFuZhaoHuiView).open(KeyWord.BAR_FUNCTION_FAQI, this.stageMaxZhuFuValue, this.shuaijianZhuFuValue, this.currentZhuFuValue, this.m_selectID);
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

    private sortFaQi(a: Protocol.FaQiInfo, b: Protocol.FaQiInfo): number {
        let faQiData = G.DataMgr.fabaoData;
        let thingData = G.DataMgr.thingData

        let petA: Protocol.FaQiInfo = faQiData.getFaqiData(a.m_iID);
        //获得神器对应的激活卡id
        let idA = thingData.getCardIdByShenQiId(a.m_iID);
        let countA = thingData.getThingNumInsensitiveToBind(idA);
        let stateA = 0;
        if (null != petA) {
            if (petA.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                stateA = 2;
            } else if (petA.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET || countA>0) {
                stateA = 1;
            }
        }

        let petB: Protocol.FaQiInfo = faQiData.getFaqiData(b.m_iID);
        let idB = thingData.getCardIdByShenQiId(b.m_iID);
        let countB = thingData.getThingNumInsensitiveToBind(idB);
        let stateB = 0;
        if (null != petB) {
            if (petB.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                stateB = 2;
            } else if (petB.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET || countB>0) {
                stateB = 1;
            }
        }

       

        if (stateA != stateB) {
            return stateB - stateA;
        }

        return a.m_iID - b.m_iID;
    }
}