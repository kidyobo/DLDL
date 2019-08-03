﻿import { TabSubForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { List, ListItem } from "System/uilib/List"
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { EquipUtils } from 'System/utils/EquipUtils'
import { Macros } from 'System/protocol/Macros'
import { EnumThingID } from 'System/constants/GameEnum'
import { Global as G } from "System/global"
import { KeyWord } from 'System/constants/KeyWord'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { EnumEquipRule } from 'System/data/thing/EnumEquipRule'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { ListItemCtrl } from "System/uilib/ListItemCtrl"
import { ThingData } from 'System/data/thing/ThingData'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { TipFrom } from 'System/tip/view/TipsView'
import { EquipView } from 'System/equip/EquipView'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { EquipBasePanel } from 'System/equip/EquipBasePanel'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { DataFormatter } from "System/utils/DataFormatter"
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"

class RefineResultItemData {
    static readonly REFINED = 0;
    static readonly UNREFINED = 1;
    static readonly LOCKED = 2;
    config: GameConfig.EquipWishM;
    isLock: boolean = false;
    state: number;
    lockStage = 0;
}

class EquipFuHunResultListItem extends ListItemCtrl {
    /**赋魂数据*/
    private fuHunData: RefineResultItemData;
    /**赋魂结果文本*/
    private fuHunResultText: UnityEngine.UI.Text;
    /**赋魂锁按钮*/
    private m_btnLock: UnityEngine.GameObject;
    /**赋魂锁不可用标志*/
    private cannotuse: UnityEngine.GameObject;

    private normalStage: UnityEngine.GameObject;
    private selectedStage: UnityEngine.GameObject;
    private m_btnLockImage: UnityEngine.UI.Image;

    setComponents(go: UnityEngine.GameObject) {
        this.fuHunResultText = ElemFinder.findText(go, "des");
        this.cannotuse = ElemFinder.findObject(go, "cannotuse");
        this.m_btnLock = ElemFinder.findObject(go, "toggle");
        this.normalStage = ElemFinder.findObject(this.m_btnLock, 'normal');
        this.selectedStage = ElemFinder.findObject(this.m_btnLock, 'selected');
        this.m_btnLockImage = this.m_btnLock.GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
        Game.UIClickListener.Get(this.m_btnLock).onClick = delegate(this, this.onBtnLockClick);

    }

    update(data: RefineResultItemData) {
        this.fuHunData = data;
        if (data.config != null) {
            //此时锁可以点击
            let content = uts.format('{0}+{1}({2}星)', KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.config.m_ucAttrType), data.config.m_iPropValue, data.config.m_ucWishLevel);
            let color = Color.getColorById(data.config.m_ucColor);
            this.fuHunResultText.text = TextFieldUtil.getColorText(content, color);
            this.m_btnLockImage.raycastTarget = true;
            this.normalStage.SetActive(!data.isLock);
            this.selectedStage.SetActive(data.isLock);
            if (this.cannotuse)
            this.cannotuse.SetActive(false);
        }
        else {
            //锁被隐藏(不能用,有个禁止标志)
            this.fuHunResultText.color = UnityEngine.Color.white;
            if (data.state == RefineResultItemData.UNREFINED) {
                this.fuHunResultText.text = '未洗炼';
                this.fuHunResultText.color = UnityEngine.Color.green;
            }
            else if (data.state == RefineResultItemData.LOCKED) {
                if (data.lockStage == 0) {
                    let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(EnumThingID.FUHUNSHENSHI);
                    this.fuHunResultText.text = uts.format('消耗{0}激活', TextFieldUtil.getItemText(thingConfig));
                } else {
                    this.fuHunResultText.text = uts.format('{0}阶激活', data.lockStage);
                }
            }
            this.m_btnLockImage.raycastTarget = false;
            if (this.cannotuse)
            this.cannotuse.SetActive(data.state == RefineResultItemData.LOCKED);
            this.normalStage.SetActive(false);
            this.selectedStage.SetActive(false);
        }
    }

    private onBtnLockClick(): void {
        if (this.normalStage.activeSelf) {
            this.normalStage.SetActive(false);
            this.selectedStage.SetActive(true);
        } else if (this.selectedStage.activeSelf) {
            this.normalStage.SetActive(true);
            this.selectedStage.SetActive(false);
        }
        this.fuHunData.isLock = this.selectedStage.activeSelf;
        let view = G.Uimgr.getSubFormByID<EquipFuHunPanel>(EquipView, KeyWord.OTHER_FUNCTION_EQUIP_WASH);
        view.onLockClick();

    }
}

class EquipFuHunStarItem extends ListItemCtrl {
    /**星级*/
    public starLevel: number;
    /**出星概率*/
    private propsNum: number;
    /**文本描述*/
    private desText: UnityEngine.UI.Text;
    /**赋魂锁不可用标志*/
    private cannotuse: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.desText = ElemFinder.findText(go, "des");
        this.cannotuse = ElemFinder.findObject(go, "cannotuse");

    }

    update(starLevel: number, propsNum: number, minLevel: number) {
        this.starLevel = starLevel;
        this.propsNum = propsNum;
        this.desText.text = uts.format('{0}星', this.starLevel);
        this.cannotuse.SetActive(this.propsNum == 0 || this.starLevel < minLevel);

    }
    /**能否点击*/
    public canClick(): boolean {
        return !this.cannotuse.activeSelf;
    }
}


/**装备赋魂面板*/
export class EquipFuHunPanel extends EquipBasePanel {

    static EQUIP_PART = [KeyWord.EQUIP_PARTCLASS_WEAPON, KeyWord.EQUIP_PARTCLASS_NECKCHAIN, KeyWord.EQUIP_PARTCLASS_RING, KeyWord.EQUIP_PARTCLASS_CHAIN,
    KeyWord.EQUIP_PARTCLASS_HAT, KeyWord.EQUIP_PARTCLASS_CLOTH, KeyWord.EQUIP_PARTCLASS_TROUSER, KeyWord.EQUIP_PARTCLASS_SHOE];

    /**1颗代表20000*/
    private readonly TQNUM = 20000;
    /**本次登陆是否已打开该面板（做红点提示用） */
    public static isOpenedThisLanding: boolean = false;

    private equipView: EquipView;

    /**装备列表的数据源*/
    private m_equipListData: ThingItemData[] = [];
    /**当前选中的那一件*/
    private m_selectedEquipData: ThingItemData;
    private m_selectedEquipIndex: number;
    //private m_selectedEquip: IconItem = new IconItem();
    /**锻造结果列表*/
    private m_resultList: UnityEngine.GameObject;
    //中间那条带点的亮线
    private line1: UnityEngine.GameObject;
    private resultItems: EquipFuHunResultListItem[] = [];
    /**普通锻造按钮*/
    private m_btnRefine: UnityEngine.GameObject;
    /**自动锻造按钮*/
    private m_btnAutoRefine: UnityEngine.GameObject;

    /**自动锻造Element*/
    /**自动锻造标志*/
    private bFlagAutoRefine: boolean = false;
    private Max_PropStars: number = 15;
    private AutoRefineElement: UnityEngine.GameObject;
    private AutoRefineMask: UnityEngine.GameObject;
    private m_btnAutoRefineBegin: UnityEngine.GameObject;
    private m_oldSelected: number = -1;
    private m_choiseList: List;
    private starData: number[] = [];


    private textTip: UnityEngine.UI.Text;
    /**当前锻造次数，默认次数*/
    private m_times: number = 1;
    private allRefineDatas: RefineResultItemData[][] = [];
    private m_totalCost: number = 0;
    private m_type: number = 0;
    //橙色属性未锁定警告
    private m_isOrangeWarning: boolean = false;
    private m_isIgnoreOrangeWarning: boolean = false;
    // 金色属性未锁警告
    private m_isGoldWarning: boolean = false;
    private m_isIgnoreGoldWarning: boolean = false;
    //红色属性未锁警告
    private m_isRedWarning: boolean = false;
    private m_isIgnoreRedWarning: boolean = false;
    private m_isPinkWaring: boolean = false;
    private m_isIgoreePinkWaring: boolean = false;
    /**消耗物品图标*/
    private m_costItemData: MaterialItemData = new MaterialItemData();
    private m_lockItemData: MaterialItemData = new MaterialItemData();
    /**增加洗脸槽(页游后面那个小加号)*/
    private m_btnAdd: UnityEngine.GameObject;
    private m_fightNum: UnityEngine.UI.Text;
    /**不再提示至尊锻造*/
    private m_isNotConfirmGold: boolean = false;
    /**现有赋魂材料个数*/
    //private tfHas1: UnityEngine.UI.Text;
    //private tfHas2: UnityEngine.UI.Text;
    /**赋魂材料名称*/
    private tfCost1: UnityEngine.UI.Text;
    //private tfCost2: UnityEngine.UI.Text;
    /**背包全部页（默认显示全部物品的页面）*/
    private EquipItemDatas: ThingItemData[] = [];
    //private iconRoot: UnityEngine.GameObject;
    /**消耗材料显示*/
    //private bundRoot: UnityEngine.GameObject;
    //private bundIconItem = new IconItem();
    private lockRoot: UnityEngine.GameObject;
    private lockIconItem = new IconItem();

    //private prevIcon: UnityEngine.GameObject;
    //private prevIconItem: IconItem;

    private textStage: UnityEngine.UI.Text;
    private imgSliderLoop: UnityEngine.UI.Image;

    private btn_Rule: UnityEngine.GameObject;
    private txtLockCost: UnityEngine.UI.Text;
    private txtEquipName: UnityEngine.UI.Text;

    private max_Props: number = 7;
    private isOriginResponse: boolean = false;

    private isFirstOpen: boolean = true;
    private isSuo: boolean = false;

    private openId = 0;
    //private uiEffectList: UIEffect[] = [];
    //private bkts: UnityEngine.GameObject;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_EQUIP_WASH);
        this.m_costItemData.id = EnumThingID.XILIANSHI;
        this.m_lockItemData.id = EnumThingID.XILIANSUO;
        for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            let arr: RefineResultItemData[] = [];
            for (let j = 0; j < EquipStrengthenData.MAX_REFINE_NUM; j++) {
                let data = new RefineResultItemData();
                arr.push(data);
            }
            this.allRefineDatas.push(arr);
        }
    }


    protected resPath(): string {
        return UIPathData.EquipFuHunPanel;
    }

    protected initElements() {
        super.initElements();
        this.initEquipList(ArrowType.equipFuHun);

        this.m_resultList = this.elems.getElement("resultList");
        this.line1 = this.elems.getElement("line1");
        this.m_btnRefine = this.elems.getElement("btn_normalZhihun");
        this.m_btnAutoRefine = this.elems.getElement("btn_autoZhihun");
        this.textTip = this.elems.getText('textTip');
        this.m_btnAdd = this.elems.getElement("btn_add");
        this.m_fightNum = this.elems.getText("fight");
        //this.tfHas1 = this.elems.getText("bundCount");
        //this.tfHas2 = this.elems.getText("lockcount");
        this.tfCost1 = this.elems.getText("bundName");
        //this.tfCost2 = this.elems.getText("lockName");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        //this.iconRoot = this.elems.getElement("iconRoot");
        //this.bundRoot = this.elems.getElement("bundRoot");
        this.lockRoot = this.elems.getElement("lockRoot");
        this.btn_Rule = this.elems.getElement("btn_Rule");
        this.txtLockCost = this.elems.getText("txtLockCost");
        this.textStage = this.elems.getText('textStage');
        this.imgSliderLoop = this.elems.getImage("imgLoop");
        this.txtEquipName = this.elems.getText("txtEquipName");
        //this.m_selectedEquip.setUsualIconByPrefab(this.itemIcon_Normal, this.iconRoot);
        //this.m_selectedEquip.setTipFrom(TipFrom.normal);
        //this.m_selectedEquip.arrowType = ArrowType.equipFuHun;
        //this.m_selectedEquip.isNeedShowArrow = false;
        //this.m_selectedEquip.needWuCaiColor = true;
        //this.m_selectedEquip.needForceShowWuCaiColor = true;


        //this.bundIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.bundRoot);
        //this.bundIconItem.setTipFrom(TipFrom.normal);

        this.lockIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.lockRoot);
        this.lockIconItem.setTipFrom(TipFrom.normal);

        for (let i = 0; i < EquipStrengthenData.MAX_REFINE_NUM; i++) {
            let item: EquipFuHunResultListItem = new EquipFuHunResultListItem();
            let obj = ElemFinder.findObject(this.m_resultList, i.toString());
            item.setComponents(obj);
            this.resultItems.push(item);
        }
        //this.bkts = this.elems.getElement("bkts");

        //this.prevIcon = this.elems.getElement("prevIcon");
        //this.prevIconItem = new IconItem();
        //this.prevIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.prevIcon);
        //this.prevIconItem.setTipFrom(TipFrom.normal);
        //this.prevIconItem.isPrevFuHun = true;
        //this.prevIconItem.arrowType = ArrowType.equipFuHun;

        this.AutoRefineElement = this.elems.getElement("AutoRefineElement");
        this.AutoRefineMask = this.elems.getElement("AutoRefineMask");
        this.m_btnAutoRefineBegin = this.elems.getElement("btn_begin");
        this.m_choiseList = this.elems.getUIList('allItemList');
        this.m_choiseList.onVirtualItemChange = delegate(this, this.showStarUI);

    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.m_btnRefine, this.onBtnRefineClick);
        this.addClickListener(this.m_btnAutoRefineBegin, this.m_OnBtnAutoRefineBegin);
        this.addClickListener(this.m_btnAdd, this.onBtnAddClick);
        this.addClickListener(this.m_btnAutoRefine, this.onBtnAutoRefineClick);
        this.addClickListener(this.AutoRefineMask, this.OnBtnCloseRefineElement);
        this.m_choiseList.onClickItem = delegate(this, this.onClickStarItem);
        //this.addClickListener(this.tfCost1.gameObject, this.onClilkCost1);
        //this.addClickListener(this.tfCost2.gameObject, this.onClilkCost2);
        this.addClickListener(this.btn_Rule, this.onClickbtnRule);
    }

    protected onOpen() {
        this.equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (this.equipView != null) {
            //this.equipView.showModelBg(true);
            this.equipView.showFight(true);
        }
        //this.txtRule.text = G.DataMgr.langData.getLang(227, "洗练规则");
        this.updateEquipList(Macros.CONTAINER_TYPE_ROLE_EQUIP, ThingData.All_EQUIP_NUM - 2);
        this.updataEquipData(true);

        EquipFuHunPanel.isOpenedThisLanding = true;
        G.GuideMgr.tipMarkCtrl.onEquipFuHunChange();
        G.Uimgr.getForm<EquipView>(EquipView).updateFuHunTipMark();
    }

    protected onClose() {
        if (this.equipView != null) {
            this.equipView.showFight(false);
        }
    }

    private onClickbtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(227), '洗炼规则');
    }

    /**刷新list列表*/
    private updateEquipList(ctnType: number, ctnSize: number) {
        //更新可选升级装备列表
        let rawDatas = G.DataMgr.thingData.getContainer(ctnType);
        this.EquipItemDatas.length = 0;
        let data: ThingItemData;
        for (let i = 0; i < ctnSize; i++) {
            data = rawDatas[i];
            this.EquipItemDatas.push(data);
        }
        let itemCount = this.EquipItemDatas.length;
        for (let i = 0; i < itemCount; i++) {
            let itemObj = this.equipList.GetItem(i);
            let txtLv = itemObj.findText("lvbg/txtLv");
            let txtName = itemObj.findText("lvbg/txtName");
            let txtType = itemObj.findText("lvbg/txtType");
            txtType.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_MAIN, EquipFuHunPanel.EQUIP_PART[i]).replace("角色", "");
            if (null == rawDatas[i]) continue;
            this.equipIcons[i].updateByThingItemData(this.EquipItemDatas[i]);
            this.equipIcons[i].updateIcon();

            txtLv.text = rawDatas[i].config.m_ucStage + "阶";
            txtName.text = TextFieldUtil.getColorText(rawDatas[i].config.m_szName, Color.getColorById(rawDatas[i].config.m_ucColor));
        }
    }

    /**自动锻造面板打开按钮*/
    private onBtnAutoRefineClick(): void {
        this.AutoRefineElement.SetActive(true);
        this.m_choiseList.Selected = -1;

        let strengthenData = G.DataMgr.equipStrengthenData;
        let washStageInfo = strengthenData.washStageInfo;
        let randomCfg = strengthenData.getWishRandomCfg(this.m_selectedEquipData.config.m_iEquipPart, washStageInfo.m_ucLv);
        if (randomCfg.m_ausProb.length - 1 != this.Max_PropStars) return;   //最大15颗星级
        this.starData = randomCfg.m_ausProb.slice(1, this.Max_PropStars + 1);
        this.m_choiseList.Count = this.Max_PropStars;
        this.m_choiseList.SetSlideAppearRefresh();
        this.m_choiseList.Refresh();
    }

    /**点击普通赋魂按钮*/
    private onBtnRefineClick(): void {
        this.bFlagAutoRefine = false;
        this.m_type = Macros.EQUIP_WASH;
        this.m_times = 1;
        this.showWarning();
    }

    /**自动开始锻造按钮*/
    private m_OnBtnAutoRefineBegin(): void {
        if (this.m_choiseList.Selected == -1) {
            G.TipMgr.addMainFloatTip('请选择您要锻造的星级');
            return;
        }
        this.bFlagAutoRefine = true;
        this.m_type = Macros.EQUIP_WASH;
        this.m_times = 1;
        this.showWarning();
        this.OnBtnCloseRefineElement();
    }

    /**刷新自动锻造*/
    private updateAutoRefine(): void {
        if (!this.bFlagAutoRefine)    //检测是否在开启自动锻造条件
            return;

        let starLevel = this.m_choiseList.Selected + 1; //获取选中星级
        let bCondition: boolean = false;
        let refineDatas = this.allRefineDatas[this.m_selectedEquipIndex];
        for (let i = 0; i < EquipStrengthenData.MAX_REFINE_NUM; i++) {
            let data = refineDatas[i];
            if (data.config != null && !data.isLock) {
                if (data.config.m_ucWishLevel >= starLevel) {
                    bCondition = true;
                    break;
                }
            }
        }
        //检测锻造是否达到星级条件，如果未达到，则继续锻造,直到条件满足或材料不足为止
        if (!bCondition) {
            this.showWarning();
        }
        else {
            this.bFlagAutoRefine = false;
        }
    }

    private showStarUI(item: ListItem) {
        let data = this.starData[item.Index];
        let starItem = item.data.EquipFuHunStarItem as EquipFuHunStarItem;
        if (!item.data.EquipFuHunStarItem) {
            starItem = new EquipFuHunStarItem();
            starItem.setComponents(item.gameObject);
            item.data.EquipFuHunStarItem = starItem;
        }

        let minLevel: number = 1;   //最低能选的星级
        let refineDatas = this.allRefineDatas[this.m_selectedEquipIndex];
        for (let i = 0; i < EquipStrengthenData.MAX_REFINE_NUM; i++) {
            let data = refineDatas[i];
            if (data.config != null && data.config.m_ucWishLevel < minLevel) {
                minLevel = data.config.m_ucWishLevel;
            }
        }
        starItem.update(item.Index + 1, data, minLevel);
    }

    private onClickStarItem(Index: number) {
        // let data = this.starData[Index];
        let item = this.m_choiseList.GetItem(Index).data.EquipFuHunStarItem as EquipFuHunStarItem;
        if (!item.canClick()) {     //检测能否点击，如果不能点击，则保持上次的选项
            this.m_choiseList.Selected = this.m_oldSelected;
            return;
        }
        this.m_oldSelected = this.m_choiseList.Selected;
    }

    private OnBtnCloseRefineElement(): void {
        this.AutoRefineElement.SetActive(false);
    }

    private showWarning(): void {
        if (this.m_isPinkWaring) {
            if (this.m_isIgoreePinkWaring) {
                this.processRefine();
            }
            else {
                G.TipMgr.showConfirm('当前有' + TextFieldUtil.getColorText('粉色属性', Color.PURPLE) + '未锁定，是否继续？', ConfirmCheck.withCheck,
                    '确定|取消', delegate(this, this.onIgnorePink));
            }
        }
        else if (this.m_isRedWarning) {
            if (this.m_isIgnoreRedWarning) {
                this.processRefine();
            }
            else {
                G.TipMgr.showConfirm('当前有' + TextFieldUtil.getColorText('红色属性', Color.RED) + '未锁定，是否继续？', ConfirmCheck.withCheck,
                    '确定|取消', delegate(this, this.onIgnoreRed));
            }
        }
        else if (this.m_isGoldWarning) {
            if (this.m_isIgnoreGoldWarning || this.m_isIgnoreRedWarning) {
                this.processRefine();
            }
            else {
                G.TipMgr.showConfirm('当前有' + TextFieldUtil.getColorText('金色属性', Color.GOLD) + '未锁定，是否继续？', ConfirmCheck.withCheck,
                    '确定|取消', delegate(this, this.onIgnoreGold));
            }
        }
        else if (this.m_isOrangeWarning) {
            if (this.m_isIgnoreOrangeWarning || this.m_isIgnoreGoldWarning || this.m_isIgnoreRedWarning) {
                this.processRefine();
            }
            else {
                G.TipMgr.showConfirm('当前有' + TextFieldUtil.getColorText('橙色属性', Color.ORANGE) + '未锁定，是否继续？', ConfirmCheck.withCheck,
                    '确定|取消', delegate(this, this.onIgnoreOrange));
            }
        }
        else {
            this.processRefine();
        }
    }

    private onIgnoreOrange(stage: number, isCheckSelected: boolean = true): void {
        if (MessageBoxConst.yes == stage) {
            this.m_isIgnoreOrangeWarning = isCheckSelected;
            this.processRefine();
        }
    }

    private onIgnoreGold(stage: number, isCheckSelected: boolean = true): void {
        if (MessageBoxConst.yes == stage) {
            this.m_isIgnoreGoldWarning = isCheckSelected
            this.processRefine();
        }
    }

    private onIgnoreRed(stage: number, isCheckSelected: boolean = true): void {
        if (MessageBoxConst.yes == stage) {
            this.m_isIgnoreRedWarning = isCheckSelected;
            this.processRefine();
        }
    }

    private onIgnorePink(stage: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            this.m_isIgoreePinkWaring = isCheckSelected;
            this.processRefine();
        }
    }

    private processRefine(): void {
        let itemNum: number = this.m_costItemData.need * this.TQNUM - this.m_costItemData.has;
        let lockNum: number = this.m_lockItemData.need * this.m_times - this.m_lockItemData.has;

        //自动购买都交给后台判断
        this.m_totalCost = 0;

        if (this.m_type == Macros.EQUIP_WASH_DIAMOND) {
            this.m_totalCost = G.DataMgr.constData.getValueById(KeyWord.EQUIP_ZJ_WISH_PRICE);
        }
        if (itemNum > 0) {
            //G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_costItemData.id, itemNum);
            G.TipMgr.addMainFloatTip('您没有足够的魂币！');
            return;
        }
        if (lockNum > 0) {
            //G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_lockItemData.id, lockNum);
            G.TipMgr.addMainFloatTip('锻造锁数量不足');
            return;
        }
        this.sendMsg();
    }

    private sendMsg(): void {
        //if (this.m_selectedEquipData.config.m_ucColor == KeyWord.COLOR_BLUE) {
        //    G.TipMgr.addMainFloatTip('蓝色装备不能锻造哦');
        //    return;
        //}
        if (G.DataMgr.heroData.gold < 100 && this.m_type == Macros.EQUIP_WASH_DIAMOND) {
            G.TipMgr.addMainFloatTip('您的钻石不足100');
        }
        if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.m_totalCost, true)) {
            //let index = this.equipList.Selected;
            //let effect = this.uiEffectList[index];
            //if (!effect) {
            //    effect = this.uiEffectList[index] = new UIEffect();
            //    effect.setEffectPrefab(this.bkts, this.itemSelected, 1, -80);
            //}
            //effect.playEffect(EffectType.Effect_Normal, true, 0.7);
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipRefineRequest(this.m_selectedEquipData.data.m_usPosition, this.m_type, this.m_times));
        }
    }

    private updataEquipData(autoSelect: boolean): void {
        let strengthenData = G.DataMgr.equipStrengthenData;
        let rawDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        this.m_equipListData.length = ThingData.All_EQUIP_NUM - 2;
        let firstCanDoIdx = -1;
        let firstEquipIdx = -1;
        let minStage = EquipStrengthenData.RefineSlotOpenStages[0];

        for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            let data = rawDatas[i];
            if (null != data && null != data.data) {
                this.m_equipListData[i] = data;

                let equipInfo: Protocol.EquipInfo = data.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo;
                let lockFlag: number = equipInfo.m_stWash.m_ucLockInfo;
                let lockNum: number = 0;
                let openNum: number = 0;
                let refineDatas = this.allRefineDatas[i];
                let error = false;
                let propIdx = 0;


                let openPropNum = G.DataMgr.equipStrengthenData.getRefineOpenNums(data.config.m_ucStage);
                let interval = Math.floor(openPropNum / 2);
                let openByMoney = equipInfo.m_stWash.m_ucBuyNum > 0;
                if (openByMoney) {
                    openPropNum += 1;
                }

                for (let j = 0; j < EquipStrengthenData.MAX_REFINE_NUM; j++) {
                    let itemData = refineDatas[j];
                    let needIndex = openByMoney ? j - openPropNum + 2 * interval : j;
                    let openStage = EquipStrengthenData.RefineSlotOpenStages[needIndex];
                    if (j >= openPropNum) {
                        // 还没开孔
                        itemData.state = RefineResultItemData.LOCKED;
                        itemData.config = null;
                        itemData.lockStage = openStage;
                        itemData.isLock = false;
                    } else {
                        let attr = equipInfo.m_stWash.m_astAttr[propIdx];
                        if (attr.m_ucPropId > 0) {
                            propIdx++;
                            itemData.state = RefineResultItemData.REFINED;
                            itemData.config = strengthenData.getRefineConfig(attr.m_ucPropId, attr.m_ucWashLevel);
                            itemData.isLock = ((lockFlag % 2) > 0);
                            if (null == itemData.config) {
                                error = true;
                            }
                        }
                        else {
                            itemData.state = RefineResultItemData.UNREFINED;
                            itemData.config = null;
                            itemData.isLock = false;
                        }
                    }

                    lockFlag = Math.floor(lockFlag / 2);

                    if (itemData.isLock) {
                        lockNum++;
                    }
                    if (itemData.state != RefineResultItemData.LOCKED) {
                        openNum++;
                    }
                }


                if (firstCanDoIdx < 0 && data.config.m_ucColor != KeyWord.COLOR_BLUE && lockNum < openNum && data.config.m_ucStage >= minStage) {
                    firstCanDoIdx = i;
                }
                if (firstEquipIdx < 0) {
                    firstEquipIdx = i;
                }

                if (error) {
                    uts.logError('洗练属性错误：' + JSON.stringify(equipInfo.m_stWash));
                }
            } else {
                this.m_equipListData[i] = null;
            }
        }

        if (autoSelect) {
            let index = firstCanDoIdx;
            if (index < 0) {
                index = firstEquipIdx;
            }
            if (index < 0) {
                index = 0;
            }
            this.equipList.Selected = index;
        }

        let selectedIdx = this.equipList.Selected;
        if (this.isFirstOpen) {
            this.onClickEquipList(selectedIdx);
            this.isFirstOpen = false;
            return;
        }
        if (this.isSuo) {
            this.onClickEquipList(selectedIdx);
            this.isSuo = false;
            return;
        }
        G.AudioMgr.playStarBombSucessSound();
        this.onClickEquipList(selectedIdx);


    }


    private clearPanel() {
        //this.m_selectedEquip.updateByThingItemData(null);
        //this.m_selectedEquip.updateIcon();
        //this.prevIconItem.updateByThingItemData(null);
        //this.prevIconItem.updateIcon();
        //this.bundIconItem.updateByMaterialItemData(null);
        //this.bundIconItem.updateIcon();
        this.txtLockCost.text = "x0";
        this.lockIconItem.updateByMaterialItemData(null);
        this.lockIconItem.updateIcon();
        this.m_btnAdd.SetActive(false);
        this.m_resultList.SetActive(false);
        this.m_fightNum.text = '0';
        //this.tfHas1.text = '';
        //this.tfHas2.text = '';
        this.tfCost1.text = '';
        //this.tfCost2.text = '';
        UIUtils.setButtonClickAble(this.m_btnRefine, false);
        UIUtils.setButtonClickAble(this.m_btnAutoRefine, false);
        //this.textTip.SetActive(true);
    }

    /**点击List*/
    protected onClickEquipList(index: number): void {
        this.m_selectedEquipData = this.m_equipListData[index];
        this.m_selectedEquipIndex = index;
        if (this.m_selectedEquipData == null || this.m_selectedEquipData.data == null) {
            this.clearPanel();
            return;
        }
        let strengthenData = G.DataMgr.equipStrengthenData;

        this.m_resultList.SetActive(true);
        //this.m_selectedEquip.updateByThingItemData(this.m_selectedEquipData);
        //this.m_selectedEquip.updateIcon();
        //this.prevIconItem.updateByThingItemData(this.m_selectedEquipData);
        //this.prevIconItem.updateIcon();

        this.txtEquipName.text = this.m_selectedEquipData.config.m_szName;
        let equipInfo: Protocol.EquipInfo = this.m_selectedEquipData.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo;
        let fight: number = 0;
        let refineDatas = this.allRefineDatas[index];
        this.line1.SetActive(false);
        for (let i = 0; i < EquipStrengthenData.MAX_REFINE_NUM; i++) {
            let itemData = refineDatas[i];
            if (itemData.config != null && itemData.state == RefineResultItemData.REFINED) {
                fight += FightingStrengthUtil.calStrengthByOneProp(itemData.config.m_ucAttrType, itemData.config.m_iPropValue);
            }
            let item = this.resultItems[i];
            if (refineDatas[i].isLock) {
                this.line1.SetActive(true);
            }
            item.update(refineDatas[i]);
        }
        this.m_btnAdd.SetActive(equipInfo.m_stWash.m_ucBuyNum == 0);
        this.m_fightNum.text = fight.toString();
        if (this.equipView != null) {
            //总战力
            this.equipView.setTxtFight(G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT));
        }
        //this.m_fightNum.text = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT).toString();
        //刷新现有材料
        this.updateCost(refineDatas);
        // 祝福
        let washStageInfo = strengthenData.washStageInfo;
        this.textStage.text = uts.format('{0}', washStageInfo.m_ucLv);
        let randomCfg = strengthenData.getWishRandomCfg(this.m_selectedEquipData.config.m_iEquipPart, washStageInfo.m_ucLv + 1);
        if (null == randomCfg) {
            this.imgSliderLoop.fillAmount = 1;
        } else {
            this.imgSliderLoop.fillAmount = washStageInfo.m_usExp / randomCfg.m_usLucky;
        }
    }

    /**点击锁刷新事件*/
    onLockClick(): void {
        let refineDatas = this.allRefineDatas[this.equipList.Selected];
        let lockFlag: number = 0;
        let temp: number = 1;
        for (let data of refineDatas) {
            if (data.isLock && null != data.config) {
                lockFlag += temp;
            }
            temp *= 2;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipWashLockChangeRequest(this.m_selectedEquipData.data.m_usPosition, lockFlag));
        this.isSuo = true;
    }

    private updateCost(refineDatas: RefineResultItemData[]): void {
        let lockNum: number = 0;
        let openNum: number = 0;
        this.m_isOrangeWarning = false;
        this.m_isGoldWarning = false;
        this.m_isRedWarning = false;
        this.m_isPinkWaring = false;
        let equipStage = this.m_selectedEquipData.config.m_ucStage;
        for (let i = 0; i < EquipStrengthenData.MAX_REFINE_NUM; i++) {
            let itemData = refineDatas[i];
            if (itemData.isLock) {
                lockNum++;
            }
            else if (itemData.config != null) {
                this.m_isOrangeWarning = Boolean(this.m_isOrangeWarning || itemData.config.m_ucColor == KeyWord.COLOR_ORANGE);
                this.m_isGoldWarning = Boolean(this.m_isGoldWarning || itemData.config.m_ucColor == KeyWord.COLOR_GOLD);
                this.m_isRedWarning = Boolean(this.m_isRedWarning || itemData.config.m_ucColor == KeyWord.COLOR_RED);
                this.m_isPinkWaring = Boolean(this.m_isPinkWaring || itemData.config.m_ucColor == KeyWord.COLOR_PINK);
            }

            if (itemData.state != RefineResultItemData.LOCKED) {
                openNum++;
            }
        }
        this.m_costItemData.need = openNum > 0 ? EquipStrengthenData.RefineCostParams[openNum - 1] : 0;
        this.m_lockItemData.need = lockNum;
        this._onBagChange();
        let minStage = EquipStrengthenData.RefineSlotOpenStages[0];
        if (equipStage < minStage) {
            UIUtils.setButtonClickAble(this.m_btnRefine, false);
            UIUtils.setButtonClickAble(this.m_btnAutoRefine, false);
            //this.textTip.SetActive(true);
            this.textTip.text = "4阶以上开启洗炼";
        } else {
            UIUtils.setButtonClickAble(this.m_btnRefine, lockNum < openNum);
            UIUtils.setButtonClickAble(this.m_btnAutoRefine, lockNum < openNum);
            // this.textTip.SetActive(false);
            this.textTip.text = "洗炼等级提升可获得更高星级的属性";
        }
    }

    /////////////////////////////////容器发生变化/////////////////////////////////////////////////////
    onContainerChange(id: number): void {
        if (id == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this._onBagChange();
        }
        else if (id == Macros.CONTAINER_TYPE_ROLE_EQUIP) {
            this.isOriginResponse = true;
            this.updataEquipData(false);
            this.updateAutoRefine();
        }
    }


    /**刷新现有赋魂材料显示*/
    private _onBagChange(): void {

        this.m_costItemData.has = G.DataMgr.heroData.tongqian;
        this.m_lockItemData.has = G.DataMgr.thingData.getThingNumInsensitiveToBind(this.m_lockItemData.id);


        //this.tfHas1.text = uts.format('现有:{0}', TextFieldUtil.getColorText(DataFormatter.cutWan(this.m_costItemData.has), this.m_costItemData.has >= this.m_costItemData.need * this.TQNUM ? Color.GREEN : Color.RED));
        //this.tfHas2.text = uts.format('现有{0}个', TextFieldUtil.getColorText(this.m_lockItemData.has.toString(), this.m_lockItemData.has >= this.m_costItemData.need ? Color.GREEN : Color.RED));
        //this.tfHas2.text = TextFieldUtil.getColorText(this.m_lockItemData.has.toString(), this.m_lockItemData.has >= this.m_costItemData.need ? Color.GREEN : Color.RED);

        let thingConfig: GameConfig.ThingConfigM;
        thingConfig = ThingData.getThingConfig(this.m_costItemData.id);
        this.tfCost1.text = "消耗:" + TextFieldUtil.getColorText(DataFormatter.cutWan(this.m_costItemData.need * this.TQNUM), Color.GREEN);

        thingConfig = ThingData.getThingConfig(this.m_lockItemData.id);
        //this.tfCost2.text = TextFieldUtil.getItemText(thingConfig) + TextFieldUtil.getColorText('x' + this.m_lockItemData.need, Color.GREEN);
        //this.tfCost2.text = TextFieldUtil.getColorText(this.m_lockItemData.need.toString(), Color.GREEN);

        // this.bundIconItem.updateByMaterialItemData(this.m_costItemData);
        //this.bundIconItem.updateById(this.m_costItemData.id);
        //this.bundIconItem.updateIcon();
        this.txtLockCost.text = "x" + this.m_lockItemData.need;
        this.lockIconItem.updateByMaterialItemData(this.m_lockItemData);
        this.lockIconItem.updateIcon();

        //if (this.m_multiResultDialog != null && this.m_multiResultDialog.isShowing) {
        //    this.m_multiResultDialog.onBagChange();
        //}
    }

    /**点击加号激活*/
    private onBtnAddClick(): void {
        let text: string = uts.format('是否消耗1个{0}激活？', TextFieldUtil.getItemText(ThingData.getThingConfig(EnumThingID.FUHUNSHENSHI)));
        G.TipMgr.showConfirm(text, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmAddConfirm));
    }

    private onConfirmAddConfirm(state: number = 0, isCheckSelected: boolean = true): void {
        if (MessageBoxConst.yes == state) {
            if (G.DataMgr.thingData.getThingNumInsensitiveToBind(EnumThingID.FUHUNSHENSHI) > 0) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipRefineRequest(this.m_selectedEquipData.data.m_usPosition, Macros.EQUIP_WASH_BUY, 1));
            }
            else {
                G.TipMgr.addMainFloatTip('道具数量不足');
            }
        }
    }

    /**点击材料名字进入购买界面*/
    private onClilkCost1(): void {
        G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_costItemData.id, 1);
    }

    private onClilkCost2(): void {
        G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_lockItemData.id, 1);
    }

    private onClickBtnStage() {
        let content = G.DataMgr.langData.getLang(369);
        content = RegExpUtil.xlsDesc2Html(content);
        //content = `锻造规则：
        //1、每次锻造可获得一定锻造值
        //2、祝福值满后会提升锻造品阶
        //3、锻造品阶越高，随机出现高星属性的概率越高
        //4、锁定属性需要消耗锻造锁，锁定越多消耗越多`;
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(content, '锻造规则');
    }
}