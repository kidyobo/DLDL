import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { UIPathData } from 'System/data/UIPathData'
import { EquipBasePanel } from 'System/equip/EquipBasePanel'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { EquipUtils } from 'System/utils/EquipUtils'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { HeroData } from 'System/data/RoleData'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { ThingData } from 'System/data/thing/ThingData'
import { VipData } from 'System/data/VipData'
import { AutoBuyInfo } from 'System/data/business/AutoBuyInfo'
import { EnumGuide } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { Constants } from 'System/constants/Constants'
import { Color } from 'System/utils/ColorUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { EquipEnhanceAttItemData } from 'System/data/thing/EquipEnhanceAttItemData'
import { EnumEquipRule } from 'System/data/thing/EnumEquipRule'
import { UIUtils } from 'System/utils/UIUtils'
import { UiElements } from 'System/uilib/UiElements'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { TipType } from 'System/constants/GameEnum'
import { List } from "System/uilib/List";
import { EquipView } from 'System/equip/EquipView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BatBuyView } from "System/business/view/BatBuyView"
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"

/**
 * 装备强化面板
 */
export class EquipStrengPanel extends EquipBasePanel implements IGuideExecutor {

    static EQUIP_PART = [KeyWord.EQUIP_PARTCLASS_WEAPON, KeyWord.EQUIP_PARTCLASS_NECKCHAIN, KeyWord.EQUIP_PARTCLASS_RING, KeyWord.EQUIP_PARTCLASS_CHAIN,
    KeyWord.EQUIP_PARTCLASS_HAT, KeyWord.EQUIP_PARTCLASS_CLOTH, KeyWord.EQUIP_PARTCLASS_TROUSER, KeyWord.EQUIP_PARTCLASS_SHOE];

    /**强化到29级之后，材料是超级强化石，不能购买，只能合成*/
    private readonly QHLv: number = 28;

    /**自动强化时间间隔*/
    private readonly deltaTime: number = 100;

    private equipView: EquipView;

    /** 当前选中的那一件 */
    private m_selectedEquipData: ThingItemData;

    /** 上一件选中装备位 */
    private m_oldPart: number = -1;

    /** 消耗的材料 */
    private m_costData: MaterialItemData;

    /** 自动强化间隔时间 */
    private m_autoTime: number = 0;

    /**强化前等级*/
    private m_oldLevel: number = 0;

    private m_selectLevel: number = -1;

    btnStart: UnityEngine.GameObject = null;
    private btnBatchStreng: UnityEngine.GameObject;

    /**装备数据*/
    private equipItemDatas: ThingItemData[] = [];

    private materialIconItem: IconItem = new IconItem();
    private oldEquipIconItem = new IconItem();
    private nextEquipIconItem = new IconItem();

    //private slider: UnityEngine.UI.Slider = null;
    private txtSlider: UnityEngine.UI.Text = null;

    /**是否自动购买*/
    private toggleAutoBuy: UnityEngine.UI.ActiveToggle = null;
    /**自动强化*/
    btnAutoStart: UnityEngine.GameObject;

    private txtAutoLabel: UnityEngine.UI.Text;
    private m_isAuto: boolean = false;

    private txtCurrALL: UnityEngine.UI.Text = null;
    private txtNextAll: UnityEngine.UI.Text = null;
    private txtHave: UnityEngine.UI.Text = null;
    private txtExtraAttr: UnityEngine.UI.Text = null;
    private txtFight: UnityEngine.UI.Text = null;

    /**当前选择索引*/
    private currIndex: number = 0;
    private numberText: UnityEngine.UI.Text = null;
    private succeedEquipIcon: UnityEngine.GameObject;

    //特效
    private equipEffectPrefab: UnityEngine.GameObject;
    private equipEffect: UIEffect;

    private succeedEffectPrefab: UnityEngine.GameObject;
    private succeedEffect: UIEffect;
    private succeedTrans: UnityEngine.GameObject;

    //装备通用特效
    private equipCommonEffect: UnityEngine.GameObject;
    private equipCommonEffectRoot: UnityEngine.GameObject;
    private commonUIEffect: UIEffect;

    private oneEquipAttValueDic: { [propId: number]: EquipEnhanceAttItemData };
    private propList: List;
    private oneEquipPropItems: OneEquipPropItem[] = [];
    /*当前选中装备的强化等级**/
    private curEquipStrengLv: number = 0;

    /**当前强化属性*/
    private curList: List;
    /**下一阶级强化属性*/
    private nextList: List;
    /**下一阶级强化满后需要隐藏的物体*/
    //private uiEffectList: UIEffect[] = [];
    //private bkts: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE);
    }

    protected resPath(): string {
        return UIPathData.EquipStrengPanel;
    }

    protected initElements() {
        super.initElements();
        this.initEquipList(ArrowType.equipStrength);

        this.propList = this.elems.getUIList("propList");
        this.curList = this.elems.getUIList("curList");
        this.nextList = this.elems.getUIList("nextList");

        this.btnAutoStart = this.elems.getElement("btnAutoStart");
        this.txtAutoLabel = this.btnAutoStart.transform.Find("Text").GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;

        this.txtCurrALL = this.elems.getText("txtCurrAll");
        this.txtNextAll = this.elems.getText("txtNextALL");
        this.txtHave = this.elems.getText("txtHave");
        this.txtExtraAttr = this.elems.getText("txtExtraAttr");
        this.txtFight = this.elems.getText("txtFight");


        this.txtSlider = this.elems.getText("txtSlider");
        //this.slider = this.elems.getSlider("slider");
        this.toggleAutoBuy = this.elems.getActiveToggle("toggle");

        this.nextEquipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement('equipIcon'));
        this.nextEquipIconItem.setTipFrom(TipFrom.normal);
        this.nextEquipIconItem.showBg = true;
        this.nextEquipIconItem.arrowType = ArrowType.equipStrength;
        this.nextEquipIconItem.isNeedShowArrow = false;
        this.nextEquipIconItem.needWuCaiColor = true;
        this.nextEquipIconItem.needForceShowWuCaiColor = true;

        this.oldEquipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement('equip'));
        this.oldEquipIconItem.setTipFrom(TipFrom.normal);
        this.oldEquipIconItem.showBg = false;
        this.oldEquipIconItem.arrowType = ArrowType.equipStrength;
        this.oldEquipIconItem.isNeedShowArrow = false;
        this.oldEquipIconItem.needWuCaiColor = true;

        this.materialIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement('materials'));
        this.materialIconItem.setTipFrom(TipFrom.normal);
        this.materialIconItem.showBg = false;

        this.btnStart = this.elems.getElement("btnStart");
        this.btnBatchStreng = this.elems.getElement("btnBatchStreng");

        this.m_costData = new MaterialItemData();


        //添加特效
        this.succeedEquipIcon = this.elems.getElement('equipIcon');
        this.equipEffectPrefab = this.elems.getElement("equipEffect");
        this.equipEffect = new UIEffect();
        this.equipEffect.setEffectPrefab(this.equipEffectPrefab, this.succeedEquipIcon);

        this.succeedTrans = this.elems.getElement("succeedTrans");
        this.succeedEffectPrefab = this.elems.getElement("strengthSucceedEffect");
        this.succeedEffect = new UIEffect();
        this.succeedEffect.setEffectPrefab(this.succeedEffectPrefab, this.succeedTrans);

        this.equipCommonEffect = this.elems.getElement("equipCommonEffect");
        this.equipCommonEffectRoot = this.elems.getElement("equipCommonEffectRoot");
        this.commonUIEffect = new UIEffect();
        this.commonUIEffect.setEffectPrefab(this.equipCommonEffect, this.equipCommonEffectRoot);

        //this.bkts = this.elems.getElement("bkts");
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnStart, this._onBtnEnhanceClick);
        this.addClickListener(this.btnAutoStart, this._onBtnAutoClick);
        this.addClickListener(this.btnBatchStreng, this.onClickBatchStreng);
    }

    protected onOpen() {
        this.equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (this.equipView != null) {
            //this.equipView.showModelBg(true);
            this.equipView.showFight(true);
        }
        this.updateEquipList(Macros.CONTAINER_TYPE_ROLE_EQUIP, ThingData.All_EQUIP_NUM - 2, true);

        //选择第一个可强化，没有默认第一个
        let shouldSelectIndex = /* this.getCurShouldSelectedIndex()*/ 0;
        this.equipList.Selected = shouldSelectIndex;
        // this.upEquipList.ScrollByAxialRow(shouldSelectIndex);
        this.onClickEquipList(shouldSelectIndex);
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.EquipEnhance, EnumGuide.EquipEnhance_ClickEquip);
    }

    protected onClose() {
        if (this.equipView != null) {
            this.equipView.showFight(false);
        }
        this.equipEffect.stopEffect();
        this.succeedEffect.stopEffect();
        this.commonUIEffect.stopEffect();
        this.m_isAuto = false;
    }

    //stopAllEffect() {

    //}

    //得到应该选择的装备
    //能强化的，等级最低的
    //等级相同，祝福值最多的
    private getCurShouldSelectedIndex(): number {
        let dataList = G.DataMgr.equipStrengthenData.getMinCanStrengthDataList();
        if (dataList == null) return 0;
        let curShouldSelectedData = dataList[0];
        for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            let equipData = this.equipItemDatas[i];
            if (equipData != null && (equipData.config.m_iID == curShouldSelectedData.data.config.m_iID)) {
                return i;
            }
        }
        return 0;
    }

    protected onClickEquipList(index: number) {
        if (this.equipList.Count > 0) {
            this.selectEquipList(index);
        }
    }

    public selectEquipList(index: number) {
        this.toggleAutoBuy.isOn = false;
        this.currIndex = index;
        this.m_selectedEquipData = this.equipItemDatas[index];
        this._onSelectEquip(this.m_selectedEquipData);
    }



    private updateEquipList(ctnType: number, ctnSize: number, needRefreshCurEquip: boolean) {
        //更新可选升级装备列表
        let rawDatas = G.DataMgr.thingData.getContainer(ctnType);
        let i: number;
        this.equipItemDatas.length = 0;
        let rawObj: ThingItemData;
        for (i = 0; i < ctnSize; i++) {
            rawObj = rawDatas[i];
            this.equipItemDatas.push(rawObj);
        }

        for (let i = 0; i < ctnSize; i++) {
            let itemObj = this.equipList.GetItem(i);
            let txtLv = itemObj.findText("lvbg/txtLv");
            let txtName = itemObj.findText("lvbg/txtName");
            let txtType = itemObj.findText("lvbg/txtType");
            txtType.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_MAIN, EquipStrengPanel.EQUIP_PART[i]).replace("角色", "");
            this.equipIcons[i].updateByThingItemData(rawDatas[i]);
            this.equipIcons[i].updateIcon();
            if (rawDatas[i]) {
                let partIdx = rawDatas[i].config.m_iEquipPart % KeyWord.EQUIP_PARTCLASS_MIN;
                txtLv.text = "+" + G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(partIdx).m_usStrengthenLv;
                txtName.text = TextFieldUtil.getColorText(rawDatas[i].config.m_szName, Color.getColorById(rawDatas[i].config.m_ucColor));
            }
        }

        this.m_selectedEquipData = this.equipItemDatas[this.currIndex];

        if (needRefreshCurEquip) {
            this._onSelectEquip(this.m_selectedEquipData);
        }
    }

    _onContainerChange(id: number): void {
        if (id == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this._onBagChange();
            this.updateEquipList(Macros.CONTAINER_TYPE_ROLE_EQUIP, ThingData.All_EQUIP_NUM - 2, false);
        }
        else if (id == Macros.CONTAINER_TYPE_ROLE_EQUIP) {
            this.updateEquipList(id, ThingData.All_EQUIP_NUM - 2, true);
        }
    }

    setStrengProgressValue(equipStreng: Protocol.EquipStrengRsp): void {
        let tipStr: string;
        if (equipStreng.m_ucEquipStrengLevelChange > 0) {
            this.addTimer("playEffect", 500, 1, this.playEffect);
        }
    }

    private playEffect() {
        G.AudioMgr.playJinJieSucessSound();
        this.succeedEffect.stopEffect();
        this.equipEffect.stopEffect();
        this.succeedEffect.playEffect(EffectType.Effect_Normal);
        this.equipEffect.playEffect(EffectType.Effect_Normal);
        this.removeTimer("playEffect");
    }


    private _onSelectEquip(selectedEquipdata: ThingItemData): void {
        //没有选中时的显示
        if (selectedEquipdata == null) {
            this.nextEquipIconItem.updateByThingItemData(null);
            this.nextEquipIconItem.updateIcon();
            this.materialIconItem.updateByThingItemData(null);
            this.materialIconItem.updateIcon();
            this.oldEquipIconItem.updateByThingItemData(null);
            this.oldEquipIconItem.updateIcon();
            this.propList.Count = 0;
            this.txtCurrALL.text = "当前全身强化：" + 0;
            this.txtNextAll.text = "下级全身强化：" + 3;
            UIUtils.setButtonClickAble(this.btnAutoStart, false);
            UIUtils.setButtonClickAble(this.btnStart, false);
            return;
        }
        UIUtils.setButtonClickAble(this.btnAutoStart, true);
        UIUtils.setButtonClickAble(this.btnStart, true);

        this.curEquipStrengLv = EquipStrengthenData.getEquipLevel(this.m_selectedEquipData.config.m_iEquipPart);

        /**高级强化石不能购买，只能合成*/
        if (this.curEquipStrengLv > this.QHLv) {
            this.toggleAutoBuy.gameObject.SetActive(false);
        } else {
            this.toggleAutoBuy.gameObject.SetActive(true);
        }
        //强化前
        this.oldEquipIconItem.updateByThingItemData(selectedEquipdata);
        this.oldEquipIconItem.updateIcon();
        ////强化后
        //let nextEquipData = new ThingItemData();
        //nextEquipData.config = ThingData.getThingConfig(selectedEquipdata.config.m_iID)
        //this.nextEquipIconItem.updateByThingItemData(selectedEquipdata);
        //this.nextEquipIconItem.updateIcon();

        //强化后的ID

        let cfg = ThingData.getThingConfig(selectedEquipdata.config.m_iID + 1000);
        if (cfg) {//有下一级的配置
            this.nextEquipIconItem.updateByThingItemData(selectedEquipdata);
            this.nextEquipIconItem.updateIcon(true);
        }
        else{
            this.nextEquipIconItem.updateByThingItemData(null);
            this.nextEquipIconItem.updateIcon();
        }
        let m_ucPropId: number = 0;
        let attValue: number = 0;
        let attAfter: number = 0;
        let attName: string;
        this.m_costData.id = 0;

        let heroLv: number = G.DataMgr.heroData.level;
        this.oneEquipAttValueDic = {};
        if (selectedEquipdata.config != null) {
            let level: number = EquipStrengthenData.getEquipLevel(selectedEquipdata.config.m_iEquipPart);
            if (this.m_oldLevel != level && this.m_isAuto) {
                this._stopAuto();
            }

            //当前强化属性
            let equipStrengthenCfg = G.DataMgr.equipStrengthenData.getEquipStrengthenConfigByPart(selectedEquipdata.config.m_iEquipPart);
            //let equipStrengthenCfg = selectedEquipdata.config;
            let propCnt = equipStrengthenCfg != null ? equipStrengthenCfg.m_astProp.length : 0;
            //强化属性--强化前
            for (let i: number = 0; i < propCnt; i++) {
                m_ucPropId = equipStrengthenCfg.m_astProp[i].m_ucPropId;
                attName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, m_ucPropId);
                attValue = equipStrengthenCfg.m_astProp[i].m_ucPropValue;
                if (m_ucPropId > 0 && this.oneEquipAttValueDic[m_ucPropId] == null) {
                    this.oneEquipAttValueDic[m_ucPropId] = new EquipEnhanceAttItemData();
                }
                this.oneEquipAttValueDic[m_ucPropId].propStr = attName;
                this.oneEquipAttValueDic[m_ucPropId].beforeVal = attValue;

            }

            if (level < EquipStrengthenData.MAX_STRENG_LEVEL) {

                //强化属性--强化后
                let nextStrengthenCfg = G.DataMgr.equipStrengthenData.getNextEquipStrengthenConfigByPart(selectedEquipdata.config.m_iEquipPart);

                //消耗材料
                this.m_costData.id = nextStrengthenCfg != null ? nextStrengthenCfg.m_uiConsumableID : 0;
                this.m_costData.need = nextStrengthenCfg != null ? nextStrengthenCfg.m_uiConsumableNumber : 0;
                this._onBagChange();

                for (let i = 0; i < nextStrengthenCfg.m_astProp.length; i++) {
                    m_ucPropId = nextStrengthenCfg.m_astProp[i].m_ucPropId;
                    attName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, m_ucPropId);
                    attValue = nextStrengthenCfg.m_astProp[i].m_ucPropValue;
                    if (m_ucPropId > 0 && this.oneEquipAttValueDic[m_ucPropId] == null) {
                        this.oneEquipAttValueDic[m_ucPropId] = new EquipEnhanceAttItemData();
                    }
                    this.oneEquipAttValueDic[m_ucPropId].propId = m_ucPropId;
                    this.oneEquipAttValueDic[m_ucPropId].propStr = attName;
                    //this.oneEquipAttValueDic[m_ucPropId].baseVal = EquipUtils.getAddStrentPorpValue(selectedEquipdata.config, i);
                    this.oneEquipAttValueDic[m_ucPropId].afterVal = attValue;
                }
            }
            else {
                //强化到最大级
                this.materialIconItem.updateByMaterialItemData(null);
                this.materialIconItem.updateIcon();
                UIUtils.setButtonClickAble(this.btnAutoStart, false);
                UIUtils.setButtonClickAble(this.btnStart, false);
            }
        }
        if (this.m_isAuto) {
            if (this.m_oldPart >= 0 && this.m_oldPart != this.currIndex) {
                this._stopAuto();
            }
            else if (this.m_costData.id == 0) {
                this._stopAuto();
            }
            else {
                let time: number = G.SyncTime.getCurrentTime();
                if (time - this.m_autoTime > this.deltaTime) {
                    this.m_autoTime = time;
                    this._onBtnEnhanceClick();
                }
                else {
                    this.addTimer("equipStrength", this.deltaTime, 1, this._onTimer);
                }
            }
        }
        else {
            //this.m_btnEnhance.enabled = this.m_btnAuto.enabled = boolean(this.m_costData.id > 0);
            //   UIUtils.setButtonClickAble(this.btnStart, this.m_costData.id > 0);
        }


        this.m_oldPart = this.currIndex;
        let heroData: HeroData = G.DataMgr.heroData;
        let strengLevel: number = heroData.avatarList.m_ucStrengLevel;
        if (strengLevel < 3)
            strengLevel = 3;
        let currLevel: number = this.m_selectLevel == -1 ? strengLevel : this.m_selectLevel;

        this._updatePropList();
        this.updateOneEquipAtt();
    }

    private updateOneEquipAtt() {
        let datas: EquipEnhanceAttItemData[] = [];
        for (let key in this.oneEquipAttValueDic) {
            let data = this.oneEquipAttValueDic[key];
            datas.push(data);
        }
        this.propList.Count = datas.length;
        for (let i = 0; i < this.propList.Count; i++) {
            let item = this.propList.GetItem(i);
            if (this.oneEquipPropItems[i] == null) {
                this.oneEquipPropItems[i] = new OneEquipPropItem();
                this.oneEquipPropItems[i].setComponents(item.gameObject);
            }
            this.oneEquipPropItems[i].update(datas[i]);
        }

    }


    private _onTimer(): void {
        this.m_autoTime = G.SyncTime.getCurrentTime();
        this._onBtnEnhanceClick();
    }


    private _updatePropList(): void {
        let nextBodyConfig: GameConfig.EquipAllBodyStrengPropM;
        let currBodyConfig: GameConfig.EquipAllBodyStrengPropM;
        let heroData: HeroData = G.DataMgr.heroData;
        let equipStrengthenData: EquipStrengthenData = G.DataMgr.equipStrengthenData;
        let strengLevel: number = heroData.avatarList.m_ucStrengLevel;

        let showLevel: number = 0;
        let count: number = 0;

        if (this.m_selectLevel == -1) //正常状态
        {
            count = 0;
            showLevel = strengLevel;
            if (strengLevel < 3)
                showLevel = 3;
            currBodyConfig = equipStrengthenData.getBodyStrengthenConfigByLevel(showLevel);
            let str = UIUtils.getPropList(currBodyConfig.m_astPropAtt, strengLevel >= 3);

            let attrCnt = str.length;
            this.curList.Count = attrCnt;
            for (let i = 0; i < attrCnt; i++) {
                let curText = this.curList.GetItem(i).findText("txtValue");
                curText.text = str[i];
            }

            let nextAttrs: string[];
            if (strengLevel < 3) {
                nextBodyConfig = equipStrengthenData.getBodyStrengthenConfigByLevel(showLevel);
                nextAttrs = (UIUtils.getAddProp(nextBodyConfig.m_astPropAtt));
                count = equipStrengthenData.getEquipStrengthenLevelCount(showLevel);
            }
            else if (showLevel < EquipStrengthenData.MAX_STRENG_LEVEL) {
                nextBodyConfig = equipStrengthenData.getBodyStrengthenConfigByLevel(showLevel + 1);
                nextAttrs = UIUtils.getAddProp(nextBodyConfig.m_astPropAtt, currBodyConfig.m_astPropAtt);
                count = equipStrengthenData.getEquipStrengthenLevelCount(showLevel + 1);
            }
            else {
                count = -1;
            }

            if (null != nextAttrs) {
                let attrCnt = nextAttrs.length;
                this.nextList.Count = attrCnt;
                for (let i = 0; i < attrCnt; i++) {
                    let nextText = this.nextList.GetItem(i).findText("txtValue");
                    nextText.text = nextAttrs[i];
                }
            }
        }
        else {
            showLevel = strengLevel;
            if (strengLevel < 3)
                showLevel = 3;
            currBodyConfig = equipStrengthenData.getBodyStrengthenConfigByLevel(showLevel);
            let str3 = UIUtils.getPropList(currBodyConfig.m_astPropAtt, strengLevel >= 3);
            if (strengLevel >= this.m_selectLevel) {
                count = -1;
            }
            else {
                count = equipStrengthenData.getEquipStrengthenLevelCount(this.m_selectLevel);
                nextBodyConfig = equipStrengthenData.getBodyStrengthenConfigByLevel(this.m_selectLevel);
                let str4 = UIUtils.getAddProp(nextBodyConfig.m_astPropAtt, currBodyConfig.m_astPropAtt);
            }
        }

        count == -1 ? 8 : (count > 8 ? 8 : count);

        let color = count == 8 ? Color.GREEN : Color.RED;

        //this.txtHave.text = uts.format('已达成: {0}/8件', count == -1 ? 8 : (count > 8 ? 8 : count));
        this.txtHave.text = TextFieldUtil.getColorText(uts.format('已达成: {0}/8件', count), color);
        this.txtExtraAttr.text = "额外增加属性";
        this.txtCurrALL.text = "当前全身强化：" + strengLevel;
        let nextLv = (strengLevel + 1) < 3 ? 3 : (strengLevel + 1);
        let strNextLv = nextLv > 30 ? "强化已满" : "下级全身强化：" + nextLv;
        this.txtNextAll.text = strNextLv;

        //套装战斗力显示
        if (nextBodyConfig) {
            this.nextList.gameObject.SetActive(true);
            //this.txtFight.text = (FightingStrengthUtil.calStrength(nextBodyConfig.m_astPropAtt)).toString();
            // this.txtFight.text = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT).toString();
            if (this.equipView != null) {
                //总战力
                this.equipView.setTxtFight(G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT));
            }
        }
        else {
            this.nextList.gameObject.SetActive(false);
        }
    }


    private _onBagChange(): void {

        if (this.m_costData.id == 0) {
            return;
        }
        this.m_costData.has = G.DataMgr.thingData.getThingNum(this.m_costData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        let numItem: number = G.DataMgr.thingData.getThingNum(this.m_costData.id, 0, false);
        this.materialIconItem.updateByMaterialItemData(this.m_costData);
        this.materialIconItem.updateIcon();
    }


    /**点击强化 按钮 */
    private _onBtnEnhanceClick(): void {
        if (this.m_selectedEquipData.config == null) {
            return;
        }

        if (this.m_costData.has >= this.m_costData.need) {
            this.sendStreng();
        }
        else if (this.toggleAutoBuy.isOn) {
            if (this.curEquipStrengLv > this.QHLv) {
                G.TipMgr.addPosTextMsg("道具不足(此道具不能购买)无法继续强化", Color.GREEN, this.txtSlider.transform, -60, 0, false);
                this._stopAuto();
                return;
            }
            let num: number = this.m_costData.need - this.m_costData.has;
            let info: AutoBuyInfo = G.ActionHandler.checkAutoBuyInfo(this.m_costData.id, num, true);
            if (info.isAffordable) {
                this.sendStreng();
                return;
            }
            this._stopAuto();
        }
        else {
            if (this.curEquipStrengLv > this.QHLv) {
                G.TipMgr.addPosTextMsg("道具不足(此道具不能购买)无法继续强化", Color.GREEN, this.txtSlider.transform, -60, 0, false);
                this._stopAuto();
                return;
            }
            this._stopAuto();
            if (this.curEquipStrengLv  >= ThingData.minLvOpenBatBuyViwe) {
                G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_costData.id, 1);
            } else {
                G.TipMgr.addMainFloatTip("材料不足");
            }
        }

    }

    /**点击一键强化 按钮 */
    private onClickBatchStreng() {
        //找等级最低的
        let len = this.equipItemDatas.length;
        let minLevel = -1;
        for (let i = 0; i < len; i++) {
            let item = this.equipItemDatas[i];
            if (item == null) continue;
            let lv = EquipStrengthenData.getEquipLevel(item.config.m_iEquipPart);
            if (minLevel == -1) {
                minLevel = lv;
                continue;
            }
            if (minLevel > lv)
                minLevel = lv;
        }

        //强化材料数量前台限制

        let has = -1;
        let need = -1;
        let id = -1;
        for (let i = 0; i < len; i++) {
            let item = this.equipItemDatas[i];
            if (item == null) continue;
            let lv = EquipStrengthenData.getEquipLevel(item.config.m_iEquipPart);
            if (minLevel == lv) {
                if (need == -1) {
                    //获取背包材料信息
                    let nextStrengthenCfg = G.DataMgr.equipStrengthenData.getNextEquipStrengthenConfigByPart(item.config.m_iEquipPart);
                    has = G.DataMgr.thingData.getThingNum(nextStrengthenCfg.m_uiConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                    need = nextStrengthenCfg.m_uiConsumableNumber;
                    id = nextStrengthenCfg.m_uiConsumableID;
                }

                let issucceed = this.upgradeEquip(item, has, need, id);
                has -= need;
                if (!issucceed) break;
            }
        }
    }

    /**
     * 升级装备
     * @param equip
     */
    private upgradeEquip(equip: ThingItemData, has: number, need: number, id: number): boolean {
        if (equip.config == null) {
            return false;
        }
        if (EquipStrengthenData.getEquipLevel(equip.config.m_iEquipPart) >= EquipStrengthenData.MAX_STRENG_LEVEL)
            return false;


        //强化属性--强化后
        //let nextStrengthenCfg = G.DataMgr.equipStrengthenData.getNextEquipStrengthenConfigByPart(equip.config.m_iEquipPart);
        //let has = G.DataMgr.thingData.getThingNum(nextStrengthenCfg.m_uiConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        //let need = nextStrengthenCfg.m_uiConsumableNumber;
        //let id = nextStrengthenCfg.m_uiConsumableID;

        if (has >= need) {
            this.sendStrengEquip(equip);
            return true;
        }
        else if (this.toggleAutoBuy.isOn) {
            if (equip.config.m_ucQHLv > 29) {
                G.TipMgr.addPosTextMsg("道具不足(此道具不能购买)无法继续强化", Color.GREEN, this.txtSlider.transform, -60, 0, false);
                this._stopAuto();
                return false;
            }
            let num: number = need - has;
            let info: AutoBuyInfo = G.ActionHandler.checkAutoBuyInfo(id, num, true);
            if (info.isAffordable) {
                this.sendStrengEquip(equip);
                return true;
            }
            this._stopAuto();
        }
        else {
            if (equip.config.m_ucQHLv > this.QHLv) {
                G.TipMgr.addPosTextMsg("道具不足(此道具不能购买)无法继续强化", Color.GREEN, this.txtSlider.transform, -60, 0, false);
                this._stopAuto();
                return false;
            }
            this._stopAuto();
            if (equip.config.m_ucQHLv >= ThingData.minLvOpenBatBuyViwe) {
                G.Uimgr.createForm<BatBuyView>(BatBuyView).open(id, 1);
            } else {
                G.TipMgr.addMainFloatTip("材料不足");
                return false;
            }
        }
        return false;
    }

    private _onBtnAutoClick(): void {
        if (this.m_isAuto) {
            this._stopAuto();
        }
        else {
            this._startAuto();

        }
    }

    private _startAuto(): void {
        if (!this.m_isAuto) {
            this.m_isAuto = true;
            UIUtils.setButtonClickAble(this.btnStart, false);
            // this.txtAutoLabel.text = "停止强化";
            this._onBtnEnhanceClick();

        }
    }

    private _stopAuto(): void {
        if (this.m_isAuto) {
            this.m_isAuto = false;
            UIUtils.setButtonClickAble(this.btnStart, true);
            //this.txtAutoLabel.text = "自动强化";
            this.m_oldPart = -1;

        }
        this.removeTimer("equipStrength");
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.EquipEnhance, EnumGuide.EquipEnhance_ClickAutoEnhance);
    }

    /**发送强化*/
    private sendStreng(): void {
        this.commonUIEffect.stopEffect();
        this.commonUIEffect.playEffect(EffectType.Effect_Normal, true, 1);
        //let index = this.equipList.Selected;
        //let effect = this.uiEffectList[index];
        //if (!effect) {
        //    effect = this.uiEffectList[index] = new UIEffect();
        //    effect.setEffectPrefab(this.bkts, this.itemSelected, 1, -80);
        //}
        //effect.playEffect(EffectType.Effect_Normal, true, 0.7);

        this.m_oldLevel = EquipStrengthenData.getEquipLevel(this.m_selectedEquipData.config.m_iEquipPart);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipEnhanceRequest(this.m_selectedEquipData.data.m_usPosition, Macros.EQUIP_STRENG));
    }

    /**
     * 发送强化
     * @param equip
     */
    private sendStrengEquip(equip: ThingItemData) {
        this.commonUIEffect.stopEffect();
        this.commonUIEffect.playEffect(EffectType.Effect_Normal, true, 1);
        //let index = this.equipList.Selected;
        //let effect = this.uiEffectList[index];
        //if (!effect) {
        //    effect = this.uiEffectList[index] = new UIEffect();
        //    effect.setEffectPrefab(this.bkts, this.itemSelected, 1, -80);
        //}
        //effect.playEffect(EffectType.Effect_Normal, true, 0.7);

        this.m_oldLevel = EquipStrengthenData.getEquipLevel(equip.config.m_iEquipPart);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipEnhanceRequest(equip.data.m_usPosition, Macros.EQUIP_STRENG));
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.EquipEnhance_ClickAutoEnhance == step) {
            this._onBtnAutoClick();
            return true;
        }
        return false;
    }
}


export class OneEquipPropItem {

    private txtType: UnityEngine.UI.Text;
    private txtCurValue: UnityEngine.UI.Text;
    private txtNextValue: UnityEngine.UI.Text;
    private objJianTou: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.txtType = ElemFinder.findText(go, "txtType");
        this.txtCurValue = ElemFinder.findText(go, "txtCurValue");
        this.txtNextValue = ElemFinder.findText(go, "txtNextValue");
        this.objJianTou = ElemFinder.findObject(go, "objJianTou");
    }

    update(vo: EquipEnhanceAttItemData) {

        let frame: number = 0;
        var sign: string = "";
        if (vo.propId == KeyWord.EQUIP_PROP_ATTACK_PRESS || vo.propId == KeyWord.EQUIP_PROP_DEFENSE_PRESS) {
            sign = "%";
        }

        this.txtType.text = TextFieldUtil.getColorText(vo.propStr, Color.PropWHITE);
        let beforeVal: number = vo.beforeVal;
        let afterVal: number = vo.afterVal;
        this.txtCurValue.text = TextFieldUtil.getColorText(beforeVal + sign, Color.PropGreen);
        this.txtNextValue.text = TextFieldUtil.getColorText((vo.baseVal + afterVal) + sign, Color.GREEN);

        if (afterVal != beforeVal && afterVal != 0) {
            frame = afterVal > beforeVal ? 1 : 2;
        }
        else {
            frame = 3;
        }

        //满级时处理
        let isShow = afterVal != 0;
        this.txtNextValue.gameObject.SetActive(isShow);
        this.objJianTou.SetActive(isShow);
    }
}
