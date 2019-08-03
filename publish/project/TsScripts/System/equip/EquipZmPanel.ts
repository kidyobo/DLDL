import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { EquipBasePanel } from 'System/equip/EquipBasePanel'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { ThingData } from 'System/data/thing/ThingData'
import { AutoBuyInfo } from 'System/data/business/AutoBuyInfo'
import { Macros } from 'System/protocol/Macros'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { Color } from 'System/utils/ColorUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EquipZmAttItemData } from 'System/equip/EquipZmAttItemData'
import { UiElements } from 'System/uilib/UiElements'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { TipType } from 'System/constants/GameEnum'
import { EnumEquipRule } from 'System/data/thing/EnumEquipRule'
import { List } from "System/uilib/List"
import { BatBuyView } from 'System/business/view/BatBuyView'
import { EquipView } from 'System/equip/EquipView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"
import { UIUtils } from 'System/utils/UIUtils'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'


export class EquipZmPanel extends EquipBasePanel {
    /**万分比*/
    private readonly WanFenBi: number = 100;
    private readonly zmMaxLv = 18;

    private oneEquipAttValueDic: { [propId: number]: EquipZmAttItemData };
    private oneEquipPropItems: OneEquipZMPropItem[] = [];

    private m_attListData: EquipZmAttItemData[] = new Array<EquipZmAttItemData>();

    private m_selectedEquipData: ThingItemData = null;

    private m_attListDic: { [propId: number]: EquipZmAttItemData };

    /** 是否自动强化 */
    private m_isAuto: boolean;

    /** 消耗的材料 */
    private m_costData: MaterialItemData;
    /**完美材料*/
    private m_perfectData: MaterialItemData;



    private m_selectedEquip: IconItem;
    private m_oldLevel: number = 0;
    private m_oldPart: number = 0;
    /** 自动强化间隔时间 */
    private m_autoTime: number = 0;

    private _crtEquipConfig: GameConfig.ThingConfigM;
    /**当前装备斩魔等级*/
    private _crtLevel: number = 0;

    /**幸运石ID*/
    private _luckId: number = 0;

    /**背包好运石*/
    private m_bagEquipData: ThingItemData[] = new Array<ThingItemData>();
    /**好运石面包卸下按钮*/
    private btnTakeOff: UnityEngine.GameObject;

    private _noTipsConfirm: boolean;
    /**选择次数*/
    private _selectCount: number = 0;
    private _topEquip: IconItem;
    private _topEquipData: ThingItemData = new ThingItemData();
    /**装备数据*/
    private EquipItemDatas: ThingItemData[] = [];
    private objZm: UnityEngine.GameObject = null;
    /**选择的装备*/
    private objEquip: UnityEngine.GameObject = null;

    /**好运石*/
    private objLuckyStone: UnityEngine.GameObject = null;

    private zmMaterial: ThingItemData = new ThingItemData();
    private protectMaterial: ThingItemData = new ThingItemData();

    /**附魔安扭*/
    private btnLQ: UnityEngine.GameObject = null;
    /**材料不足自动购买*/
    private _btnCostBuy: UnityEngine.UI.ActiveToggle = null;
    /**使用完美*/
    private _btnPerfectBuy: UnityEngine.GameObject = null;
    private togSelected: UnityEngine.GameObject;
    private isBuyPerfect: boolean = false;
    /**当前选择索引*/
    private currIndex: number = 0;

    /**当前点击的物品icon*/
    private nowClickIcon: UnityEngine.GameObject = null;
    /**选择IconItem*/
    private selectEquipIconItem = new IconItem();
    private luckyIconItem = new IconItem();
    /**下一集可附魔*/
    private topEquipIcon: UnityEngine.GameObject;
    private topEquipIconItem = new IconItem();

    /**好运石头面板*/
    private mask: UnityEngine.GameObject = null;
    /**选择的好运石*/
    private selectLuckyStone: ThingItemData = null;
    /**好运石列表*/
    private itemListCtrl: List = null;
    /**好运石关闭按钮*/
    private btnClose: UnityEngine.GameObject = null;
    /**选择好运石的索引*/
    private luckIndex: number = -1;

    //特效
    private equipEffectPrefab: UnityEngine.GameObject;
    private equipEffect: UIEffect;

    private succeedPrefab: UnityEngine.GameObject;
    private failfurePrefab: UnityEngine.GameObject;
    private zmEffectRoot: UnityEngine.GameObject;
    private succeedEffect: UIEffect;
    private failfureEffect: UIEffect;

    private propList: List;

    private txtMaterialNeed: UnityEngine.UI.Text;

    private txtProtectNeed: UnityEngine.UI.Text;
    /**进度显示*/
    private items: UnityEngine.GameObject;
    private progressObjs: UnityEngine.GameObject[] = [];

    private btnRule: UnityEngine.GameObject;
    /**满13图片*/
    private objMax: UnityEngine.GameObject;
    /**2个toggle*/
    private objHide: UnityEngine.GameObject;
    /**好运石文字，点击放入*/
    private objTipPut: UnityEngine.GameObject;

    //满。于不满13 图片显示
    private objNotMaxLv: UnityEngine.GameObject;
    private objMaxLv: UnityEngine.GameObject;
    private maxEquipIcon: UnityEngine.GameObject;
    private maxEquipIconItem: IconItem;

    /**加成卷*/
    private txtMaterial: UnityEngine.UI.Text;
    private jiaChengData: MaterialItemData = new MaterialItemData();

    //完璧石，加成卷父节点
    private hide2: UnityEngine.GameObject;
    private hide3: UnityEngine.GameObject;
    /**只有在不显示完璧石下显示*/
    private hide4: UnityEngine.GameObject;

    private btnZhenShen: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_EQUIPLQ);
    }

    protected resPath(): string {
        return UIPathData.EquipZmPanel;
    }

    protected initElements() {
        super.initElements();
        this.initEquipList(ArrowType.equipLianQi);
        this.propList = this.elems.getUIList("propList");

        this.itemListCtrl = ElemFinder.getUIList(this.elems.getElement("itemListCtrl"));

        this.m_costData = new MaterialItemData();
        this.m_perfectData = new MaterialItemData();
        //当前选择装备
        this.objEquip = this.elems.getElement("equipIcon").gameObject;
        this.selectEquipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.objEquip);
        this.selectEquipIconItem.setTipFrom(TipFrom.equip);
        this.selectEquipIconItem.arrowType = ArrowType.equipLianQi;
        this.selectEquipIconItem.isNeedShowArrow = false;
        this.selectEquipIconItem.needWuCaiColor = true;
        this.selectEquipIconItem.needForceShowWuCaiColor = true;
        // this.selectEquipIconItem.showBg = false;
        //下一阶
        this.topEquipIcon = this.elems.getElement("topEquipIcon");
        this.topEquipIconItem = new IconItem();
        this.topEquipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.topEquipIcon);
        this.topEquipIconItem.setTipFrom(TipFrom.normal);
        this.topEquipIconItem.arrowType = ArrowType.equipLianQi;
        this.topEquipIconItem.isNeedShowArrow = false;
        this.topEquipIconItem.needWuCaiColor = true;
        this.topEquipIconItem.needForceShowWuCaiColor = true;
        //this.topEquipIconItem.showBg = false;

        /**好运石*/
        this.btnTakeOff = this.elems.getElement("btnTakeOff");
        this.objLuckyStone = this.elems.getElement("luckyStoneIcon").gameObject;
        this.luckyIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.objLuckyStone);
        // this.luckyIconItem.showBg = false;

        this.btnLQ = this.elems.getElement("btnLQ").gameObject;
        this._btnCostBuy = this.elems.getActiveToggle("toggleMaterial");
        this._btnPerfectBuy = this.elems.getElement("toggleStone");
        this.togSelected = this.elems.getElement("togSelected");

        this.mask = this.elems.getElement("mask").gameObject;
        this.mask.SetActive(false);
        this.btnClose = this.mask.transform.Find("luckyStone/content/btnClose").gameObject;

        //添加特效
        this.equipEffectPrefab = this.elems.getElement("equipEffect");
        this.equipEffect = new UIEffect();
        this.equipEffect.setEffectPrefab(this.equipEffectPrefab, this.objEquip);

        this.zmEffectRoot = this.elems.getElement("zmEffectRoot");
        this.succeedPrefab = this.elems.getElement("lianqiSucceed");
        this.failfurePrefab = this.elems.getElement("lianqiFailure");
        this.succeedEffect = new UIEffect();
        this.failfureEffect = new UIEffect();
        this.succeedEffect.setEffectPrefab(this.succeedPrefab, this.zmEffectRoot);
        this.failfureEffect.setEffectPrefab(this.failfurePrefab, this.zmEffectRoot);

        this.txtMaterialNeed = this.elems.getText("txtMaterialNeed");
        this.txtProtectNeed = this.elems.getText("txtProtectNeed");

        this.btnRule = this.elems.getElement("btnRule");

        this.items = this.elems.getElement("items")
        for (let i = 0; i < this.zmMaxLv; i++) {
            let item = ElemFinder.findObject(this.items, "item" + i);
            item.gameObject.SetActive(false);
            this.progressObjs.push(item);
        }
        //满阶级，不可附魔时显示
        this.objMax = this.elems.getElement("objMax");
        this.objHide = this.elems.getElement("objHide");
        this.objTipPut = this.elems.getElement("objTipPut");

        this.objNotMaxLv = this.elems.getElement("objNotMaxLv");
        this.objMaxLv = this.elems.getElement("objMaxLv");
        this.maxEquipIcon = this.elems.getElement("maxEquipIcon");
        this.maxEquipIconItem = new IconItem();
        this.maxEquipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.maxEquipIcon);
        // this.maxEquipIconItem.showBg = false;
        this.maxEquipIconItem.setTipFrom(TipFrom.normal);

        this.txtMaterial = this.elems.getText("txtMaterial");
        this.hide2 = this.elems.getElement("hide2");
        this.hide3 = this.elems.getElement("hide3");
        this.hide4 = this.elems.getElement("hide4");

        this.btnZhenShen = this.elems.getElement("btnZhenShen");

    }

    protected initListeners() {
        super.initListeners();
        this.itemListCtrl.onClickItem = delegate(this, this.onLuckyList);
        this.addClickListener(this.objLuckyStone, this.onLuckyStoneClick);
        //   this._btnPerfectBuy.onValueChanged = delegate(this, this.checkPerfectBtn);

        this.addClickListener(this._btnPerfectBuy.gameObject, this.checkPerfectBtn);


        this.addClickListener(this.btnLQ.gameObject, this._onBtnEnhanceClick);
        this.addClickListener(this.btnTakeOff, this.onClickTakeOff);
        this.addClickListener(this.txtMaterialNeed.gameObject, this.onClickMaterialTextOpenTip);
        this.addClickListener(this.txtProtectNeed.gameObject, this.onClickProtectMaterialTextOpenTip);
        this.addClickListener(this.txtMaterial.gameObject, this.onClickJiaChengTextOpenTip);
        this.addClickListener(this.btnRule, this.onClickRule);
        //下面2个是好运石关闭面板
        this.addClickListener(this.btnClose, this.onCloseClick);
        this.addClickListener(this.mask, this.onCloseClick);
        this.addClickListener(this.btnZhenShen, this.onClickBtnZsyj);

    }


    protected onOpen() {
        this.updateEquipList(Macros.CONTAINER_TYPE_ROLE_EQUIP, ThingData.All_EQUIP_NUM - 2);

        //选择第一个可附魔，没有一个都不选择，要不，回弹提示
        let shouldSelectIndex = this.getCurShouldSelectedIndex();

        if (shouldSelectIndex > -1) {
            //  this.upEquipList.ScrollByAxialRow(shouldSelectIndex);
            this.onClickEquipList(shouldSelectIndex);
        } else {
            shouldSelectIndex = this.getGoldEquipIndex();
            // this.upEquipList.ScrollByAxialRow(shouldSelectIndex);
            this.onClickEquipList(shouldSelectIndex);
        }
        this.equipList.Selected = shouldSelectIndex;
    }

    protected onClose() {

    }

    playZMEffect(succeed: boolean) {
        if (succeed) {
            G.AudioMgr.playStarBombSucessSound();
            this.succeedEffect.playEffect(EffectType.Effect_Normal, true);
        } else {
            G.AudioMgr.playJinJieFailSound();
            this.failfureEffect.playEffect(EffectType.Effect_Normal, true);
        }
    }


    private onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(274), '附魔规则');
    }

    private onClickBtnZsyj() {

        if (this.m_selectedEquipData==null||this.m_selectedEquipData.config == null || !this.isEquipGold(this.m_selectedEquipData.config)) {
            G.TipMgr.addMainFloatTip("真神开启需要达到附魔条件");
            return;
        }

        let curOldLv = this.m_selectedEquipData.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stLQ.m_ucMaxLQLevel;
        let curLv = curOldLv <= 0 ? curOldLv + 1 : curOldLv;
        let crtEquipLqCfg: GameConfig.EquipLQM = this.equipData.getEquipLqCfg(this.m_selectedEquipData.config.m_iEquipPart, curLv);
        let nextEquipLqCfg: GameConfig.EquipLQM = this.equipData.getEquipLqCfg(this.m_selectedEquipData.config.m_iEquipPart, curLv + 1);
        let c = `造成目标当前生命一定比例的真实伤害，攻方伤害比例大于守方抵抗比例时有效。（对怪物无效）

当前等阶：斩{0}
触发概率：{1}%
伤害比例：{2}%
抵抗比例：{3}%
`;

        if (nextEquipLqCfg) {
            c += `
下阶预览：斩{4}激活
触发概率：{5}%
伤害比例：{6}%
抵抗比例：{7}%
            `;
        }
        if (curOldLv <= 0) {
            //0级
            c = uts.format(c, 0, 0, 0, 0,
                curLv, crtEquipLqCfg.m_astPropAtt[2].m_ucPropValue / this.WanFenBi, crtEquipLqCfg.m_astPropAtt[3].m_ucPropValue / this.WanFenBi, crtEquipLqCfg.m_astPropAtt[4].m_ucPropValue / this.WanFenBi
            );
        } else if (nextEquipLqCfg == null) {
            //满级
            c = uts.format(c, curLv, crtEquipLqCfg.m_astPropAtt[2].m_ucPropValue / this.WanFenBi, crtEquipLqCfg.m_astPropAtt[3].m_ucPropValue / this.WanFenBi, crtEquipLqCfg.m_astPropAtt[4].m_ucPropValue / this.WanFenBi,
                "已满级", "已满级", "已满级", "已满级"
            );
        }
        else {
            c = uts.format(c, curLv, crtEquipLqCfg.m_astPropAtt[2].m_ucPropValue / this.WanFenBi, crtEquipLqCfg.m_astPropAtt[3].m_ucPropValue / this.WanFenBi, crtEquipLqCfg.m_astPropAtt[4].m_ucPropValue / this.WanFenBi,
                curLv + 1, nextEquipLqCfg.m_astPropAtt[2].m_ucPropValue / this.WanFenBi, nextEquipLqCfg.m_astPropAtt[3].m_ucPropValue / this.WanFenBi, nextEquipLqCfg.m_astPropAtt[4].m_ucPropValue / this.WanFenBi
            );
        }
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(c, '真神一击');
    }

    /**材料不足下，得到可附魔Index*/
    private getGoldEquipIndex(): number {
        for (let i = 0; i < this.EquipItemDatas.length; i++) {
            if (this.isGoldEquip(this.EquipItemDatas[i])) {
                return i;
            }
        }
        return -1;
    }


    /**检查装备是否品质是否可附魔*/
    private isGoldEquip(data: ThingItemData): boolean {
        if (data == null) return false;
        let crtEquipConfig = data.config;
        let can: boolean = false;
        if (crtEquipConfig) {
            can = crtEquipConfig.m_ucColor >= KeyWord.COLOR_GOLD;
        }
        return can;
    }

    private getCurShouldSelectedIndex(): number {
        for (let i = 0; i < this.EquipItemDatas.length; i++) {
            if (G.DataMgr.equipStrengthenData.isEquipGold(this.EquipItemDatas[i])) {
                return i;
            }
        }
        return -1;
    }

    private onClickMaterialTextOpenTip() {
        let item = new IconItem();
        item.updateById(this.m_costData.id);
        G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
    }

    private onClickProtectMaterialTextOpenTip() {
        let item = new IconItem();
        item.updateById(this.m_perfectData.id);
        G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
    }

    private onClickJiaChengTextOpenTip() {
        let item = new IconItem();
        item.updateById(this.jiaChengData.id);
        G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
    }


    /**斩魔升级成功播特效*/
    onZmLevelUpSuccess() {
        this.equipEffect.playEffect(EffectType.Effect_Normal);
    }


    private onLuckyStoneClick() {
        if (this.m_selectedEquipData == null) return;
        this.itemListCtrl.Count = this.m_bagEquipData.length;
        this.itemListCtrl.ScrollTop();
        this.showLuckyUI();
        this.mask.SetActive(true);
    }



    /**
     * 显示好运石面板
     */
    private showLuckyUI(): void {
        for (let i = 0; i < this.itemListCtrl.Count; i++) {
            let item = this.itemListCtrl.GetItem(i);
            let iconItem = new IconItem();
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, item.findObject('container/icon'));
            iconItem.updateByThingItemData(this.m_bagEquipData[i]);
            iconItem.updateIcon();
            let txtName = item.findText("container/txtName");
            iconItem.updateIcon();
            if (this.m_bagEquipData[i] != null) {
                let color = Color.getColorById(this.m_bagEquipData[i].config.m_ucColor);
                txtName.text = TextFieldUtil.getColorText(this.m_bagEquipData[i].config.m_szName, color);
            }
        }
    }

    private onCloseClick() {
        this.mask.SetActive(false);
    }

    private onClickTakeOff() {
        this.setLuck(null);
        this.mask.SetActive(false);
        this.luckIndex = -1;
    }


    /**
     * 好运石面板点击
     * @param index
     */
    private onLuckyList(index: number) {
        this.selectLuckyStone = this.m_bagEquipData[index];
        this.mask.SetActive(false);
        this.luckIndex = index;
        this.setLuck(this.m_bagEquipData[index]);
    }


    protected onClickEquipList(index: number) {
        if (this.equipList.Count > 0) {
            this.selectEquipList(index);
        }
    }


    public selectEquipList(index: number) {
       // this._btnCostBuy.isOn = false;
        //this._btnPerfectBuy.isOn = false;
        this.isBuyPerfect = false;
        this.togSelected.SetActive(false);
        this.mask.SetActive(false);
        if (this.equipList.Count > 0) {
            this.currIndex = index;
            this.m_selectedEquipData = this.EquipItemDatas[this.currIndex];
        }
        this.m_selectedEquipData = this.EquipItemDatas[this.currIndex];
        this._onSelectEquip();
    }


    public updateEquipList(ctnType: number, ctnSize: number) {
        //更新可选升级装备列表
        let rawDatas = G.DataMgr.thingData.getContainer(ctnType);
        let i: number = 0;
        this.EquipItemDatas.length = 0;
        let rawObj: ThingItemData;
        let diamondNums: number[] = new Array<number>(EquipStrengthenData.MAX_DIAMOND_LEVEL + 1);
        let diamondID: number = 0;
        for (let i = 0; i < ctnSize; i++) {
            rawObj = rawDatas[i];
            // if (null != rawObj && null != rawObj.data) {
            this.EquipItemDatas.push(rawObj);
            //  }
        }
        let itemCount: number = this.EquipItemDatas.length;
        // this.upEquipList.Count = itemCount;
        for (let i = 0; i < ctnSize; i++) {
            this.equipIcons[i].updateByThingItemData(this.EquipItemDatas[i]);
            this.equipIcons[i].updateIcon();
            //let equipName = itemobj.findText("equipName");
            //let color = Color.getColorById(this.EquipItemDatas[i].config.m_ucColor);
            //equipName.text = TextFieldUtil.getColorText(this.EquipItemDatas[i].config.m_szName, color);
        }
        this._onSelectEquip();

    }

    private _onSelectEquip(): void {
        //没有选择的装备
        if (this.m_selectedEquipData == null) {
            //当前选择装备
            this.selectEquipIconItem.updateByThingItemData(null);
            this.selectEquipIconItem.updateIcon();
            //下一阶
            this.topEquipIconItem.updateByThingItemData(null);
            this.topEquipIconItem.updateIcon();
            /**好运石*/
            this.luckyIconItem.updateByThingItemData(null);
            this.luckyIconItem.updateIcon();

            //按钮置灰
            UIUtils.setButtonClickAble(this.btnLQ, false);

            //各种文本
            this.txtMaterialNeed.gameObject.SetActive(false);

            this.objHide.SetActive(false);
            this.objMax.SetActive(false);
            this.objNotMaxLv.SetActive(true);
            this.objMaxLv.SetActive(false);
            return;
        }

        UIUtils.setButtonClickAble(this.btnLQ, true);
        this._topEquipData = new ThingItemData();
        let m_ucPropId: number = 0;
        let attVal: number = 0;
        let attName: string;
        this._selectCount++;


        //当前
        this.selectEquipIconItem.updateByThingItemData(this.m_selectedEquipData);
        this.selectEquipIconItem.updateIcon();
        this.maxEquipIconItem.updateByThingItemData(this.m_selectedEquipData);
        this.maxEquipIconItem.updateIcon();

        this._crtEquipConfig = null;
        let heroLv: number = G.DataMgr.heroData.level;

        this.m_attListData.length = 0;
        this.m_attListDic = {};
        this.oneEquipAttValueDic = {};
        if (this.m_selectedEquipData.data) {
            this._crtLevel = this.m_selectedEquipData.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stLQ.m_ucLQLevel;
        }

        //显示进度
        for (let i = 0; i < this.zmMaxLv; i++) {
            if (i < this._crtLevel)
                this.progressObjs[i].SetActive(true);
            else
                this.progressObjs[i].SetActive(false);
        }

        if (this.m_selectedEquipData.config == null || !this.isEquipGold(this.m_selectedEquipData.config)) {
            if (this.m_selectedEquipData.config) {
                if (this._selectCount > 1) {
                    G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(279));
                }
            }
            this.cleanAllInfo();
        }
        else {
            if (this.m_oldLevel != this._crtLevel && this.m_isAuto) {
                this._stopAuto();
            }
            //当前强化属性
            this._crtEquipConfig = this.m_selectedEquipData.config;
            let crtEquipLqCfg: GameConfig.EquipLQM = this.equipData.getEquipLqCfg(this._crtEquipConfig.m_iEquipPart, this._crtLevel);
            let nextEquipLqCfg: GameConfig.EquipLQM = this.equipData.getEquipLqCfg(this._crtEquipConfig.m_iEquipPart, this._crtLevel + 1);
            let equipEnhanceAttItemData: EquipZmAttItemData;
            if (crtEquipLqCfg) {
                for (let i: number = 0; i < crtEquipLqCfg.m_astPropAtt.length - 3; i++) {
                    m_ucPropId = crtEquipLqCfg.m_astPropAtt[i].m_ucPropId;
                    equipEnhanceAttItemData = this.getEquipEnhanceAttItemData(m_ucPropId);

                    attName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, m_ucPropId);
                    attVal = crtEquipLqCfg.m_astPropAtt[i].m_ucPropValue;

                    if (m_ucPropId > 0 && this.oneEquipAttValueDic[m_ucPropId] == null) {
                        this.oneEquipAttValueDic[m_ucPropId] = new EquipZmAttItemData();
                    }
                    this.oneEquipAttValueDic[m_ucPropId].propStr = attName;
                    this.oneEquipAttValueDic[m_ucPropId].beforeVal = attVal;
                }

                m_ucPropId = EnumEquipRule.ZM_PROP_ID;
                // attName = G.DataMgr.langData.getLang(277);
                attName = "战力加成";
                attVal = crtEquipLqCfg ? FightingStrengthUtil.calStrength(crtEquipLqCfg.m_astPropAtt) : 0;

                if (m_ucPropId > 0 && this.oneEquipAttValueDic[m_ucPropId] == null) {
                    this.oneEquipAttValueDic[m_ucPropId] = new EquipZmAttItemData();
                }
                this.oneEquipAttValueDic[m_ucPropId].propId = m_ucPropId;
                this.oneEquipAttValueDic[m_ucPropId].propStr = attName;
                this.oneEquipAttValueDic[m_ucPropId].beforeVal = attVal;

            }

            if (nextEquipLqCfg) {
                this.objHide.SetActive(true);
                this.objMax.SetActive(false);
                this.objNotMaxLv.SetActive(true);
                this.objMaxLv.SetActive(false);
                //下一阶预览
                let nextEquipThingItem = new ThingItemData()
                nextEquipThingItem = uts.deepcopy(this.m_selectedEquipData, nextEquipThingItem, true);
                nextEquipThingItem.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stLQ.m_ucLQLevel = this._crtLevel + 1;
                this.topEquipIconItem.updateByThingItemData(nextEquipThingItem);
                this.topEquipIconItem.updateIcon();

                //消耗材料                
                this.m_costData.id = nextEquipLqCfg.m_iConsumableID;
                this.m_costData.need = nextEquipLqCfg.m_iConsumableNumber;
                this.m_perfectData.id = nextEquipLqCfg.m_iProtectID;
                this.m_perfectData.need = nextEquipLqCfg.m_iNums;
                this.jiaChengData.id = nextEquipLqCfg.m_iRestoreID;
                this.jiaChengData.need = nextEquipLqCfg.m_usRestoreProb;

                let tmpConfig = ThingData.getThingConfig(this.m_perfectData.id);


                //下级强化属性
                for (let i = 0; i < nextEquipLqCfg.m_astPropAtt.length - 3; i++) {
                    m_ucPropId = nextEquipLqCfg.m_astPropAtt[i].m_ucPropId;
                    equipEnhanceAttItemData = this.getEquipEnhanceAttItemData(m_ucPropId);

                    attName = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, m_ucPropId);
                    attVal = nextEquipLqCfg.m_astPropAtt[i].m_ucPropValue;

                    if (m_ucPropId > 0 && this.oneEquipAttValueDic[m_ucPropId] == null) {
                        this.oneEquipAttValueDic[m_ucPropId] = new EquipZmAttItemData();
                    }
                    this.oneEquipAttValueDic[m_ucPropId].propId = m_ucPropId;
                    this.oneEquipAttValueDic[m_ucPropId].propStr = attName;
                    this.oneEquipAttValueDic[m_ucPropId].afterVal = attVal;
                }

                m_ucPropId = EnumEquipRule.ZM_PROP_ID;
                equipEnhanceAttItemData = this.getEquipEnhanceAttItemData(m_ucPropId);

                //  attName = G.DataMgr.langData.getLang(277);
                attName = "战力加成";
                attVal = nextEquipLqCfg ? FightingStrengthUtil.calStrength(nextEquipLqCfg.m_astPropAtt) : 0;

                if (m_ucPropId > 0 && this.oneEquipAttValueDic[m_ucPropId] == null) {
                    this.oneEquipAttValueDic[m_ucPropId] = new EquipZmAttItemData();
                }
                this.oneEquipAttValueDic[m_ucPropId].propId = m_ucPropId;
                this.oneEquipAttValueDic[m_ucPropId].propStr = attName;
                this.oneEquipAttValueDic[m_ucPropId].afterVal = attVal;
            }
            else {
                this.m_costData.id = 0;
                this.m_costData.has = 0;
                this.m_costData.need = 0;
                this.m_perfectData.id = 0;
                this.m_perfectData.has = 0;
                this.m_perfectData.need = 0;
                this.jiaChengData.id = 0;
                this.jiaChengData.has = 0;
                this.jiaChengData.need = 0;
                //按钮置灰
                UIUtils.setButtonClickAble(this.btnLQ, false);
                this.topEquipIconItem.updateByThingItemData(null);
                this.topEquipIconItem.updateIcon();
                this.objHide.SetActive(false);
                this.objMax.SetActive(true);
                this.objNotMaxLv.SetActive(false);
                this.objMaxLv.SetActive(true);
            }

            if (this.m_oldPart != this.currIndex) {
                // this._btnPerfectBuy.isOn = false;
                this.isBuyPerfect = false;
                this.togSelected.SetActive(false);
                this.setLuck(null);
            }
            else if (this._luckId > 0 && G.DataMgr.thingData.getThingNum(this._luckId, Macros.CONTAINER_TYPE_ROLE_BAG, false) <= 0) {
                this.setLuck(null);
            }
        }
        this._onBagChange();

        if (this.m_isAuto) {
            if (this.m_oldPart >= 0 && this.m_oldPart != this.currIndex) {
                this._stopAuto();
            }
            else if (this.m_costData.id == 0) {
                this._stopAuto();
            }
            else {
                let time: number = G.SyncTime.getCurrentTime();
                if (time - this.m_autoTime > 200) {
                    this.m_autoTime = time;
                    this._onBtnEnhanceClick();
                }
            }
        }

        this.m_oldPart = this.currIndex;

        this.updateOneEquipAtt();
    }

    private updateOneEquipAtt() {
        let datas: EquipZmAttItemData[] = [];
        for (let key in this.oneEquipAttValueDic) {
            let data = this.oneEquipAttValueDic[key];
            datas.push(data);
        }
        this.propList.Count = datas.length;
        for (let i = 0; i < this.propList.Count; i++) {
            let item = this.propList.GetItem(i);
            if (this.oneEquipPropItems[i] == null) {
                this.oneEquipPropItems[i] = new OneEquipZMPropItem();
                this.oneEquipPropItems[i].setComponents(item.gameObject);
            }
            this.oneEquipPropItems[i].update(datas[i]);
        }

    }


    private checkPerfectBtn(): void {
        if (this.m_perfectData.has > 0 && this.m_perfectData.has >= this.m_perfectData.need) {
            this.isBuyPerfect = !this.isBuyPerfect;
        }
        else {
            this.isBuyPerfect = false;
            G.TipMgr.addMainFloatTip("完璧石数量不足");
        }
        this.togSelected.SetActive(this.isBuyPerfect);
    }

    /**检查装备是否超神装备*/
    private isEquipGold(crtEquipConfig: GameConfig.ThingConfigM): boolean {
        if (crtEquipConfig) {
            return crtEquipConfig.m_ucColor >= KeyWord.COLOR_GOLD;
        }
        return false;
    }

    private get equipData(): EquipStrengthenData {
        return G.DataMgr.equipStrengthenData;
    }

    /**清理所有数据*/
    private cleanAllInfo(): void {
        this.m_costData.id = 0;
        this.m_costData.has = 0;
        this.m_costData.need = 0;
        this.m_perfectData.id = 0;
        this.m_perfectData.has = 0;
        this.m_perfectData.need = 0;
        this.jiaChengData.id = 0;
        this.jiaChengData.has = 0;
        this.jiaChengData.need = 0;
        this.m_selectedEquipData = null;
        //选择的装备
        this.selectEquipIconItem.updateByThingItemData(null);
        this.selectEquipIconItem.updateIcon();
        //下一阶
        this.topEquipIconItem.updateByThingItemData(null);
        this.topEquipIconItem.updateIcon();
        this.luckIndex = -1;
        this.setLuck(null);

        UIUtils.setButtonClickAble(this.btnLQ, false);
        this.objMax.SetActive(false);
        this.objHide.SetActive(false);
        this.objNotMaxLv.SetActive(true);
        this.objMaxLv.SetActive(false);

    }

    /**设置幸运石*/
    private setLuck(data: ThingItemData): void {
        if (data == null) {
            this._luckId = 0;
        } else {
            this._luckId = data.data.m_iThingID;

        }
        this.luckyIconItem.updateByThingItemData(data);
        this.luckyIconItem.updateIcon();
        this.objTipPut.SetActive(data == null);
    }

    private _onBagChange(): void {
        let numItem: number = 0;
        let color: string;
        let thingConfig: GameConfig.ThingConfigM;
        //斩石
        if (this.m_costData.id != 0) {
            this.m_costData.has = G.DataMgr.thingData.getThingNum(this.m_costData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            numItem = G.DataMgr.thingData.getThingNum(this.m_costData.id, 0, false);
            color = this.m_costData.has < this.m_costData.need ? Color.RED : Color.GREEN;
            thingConfig = ThingData.getThingConfig(this.m_costData.id);

            this.zmMaterial.config = thingConfig;
            this.txtMaterialNeed.text = TextFieldUtil.getItemText(this.zmMaterial.config) + '  ' + TextFieldUtil.getColorText(this.m_costData.has.toString() + '/' + this.m_costData.need, color);
            //因为文本要点击，空的时候点击报错
            this.txtMaterialNeed.gameObject.SetActive(true);
        }
        else {
            this.txtMaterialNeed.gameObject.SetActive(false);

        }
        //完璧石
        if (this.m_perfectData.id > 0) {
            this.m_perfectData.has = G.DataMgr.thingData.getThingNum(this.m_perfectData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            numItem = G.DataMgr.thingData.getThingNum(this.m_perfectData.id, 0, false);
            color = this.m_perfectData.has < this.m_perfectData.need ? Color.RED : Color.GREEN;
            thingConfig = ThingData.getThingConfig(this.m_perfectData.id);

            //完璧石
            this.protectMaterial.config = thingConfig;
            this.txtProtectNeed.text = TextFieldUtil.getItemText(this.protectMaterial.config) + '  ' + TextFieldUtil.getColorText(this.m_perfectData.has + '/' + this.m_perfectData.need, color);
            // this.txtProtectNeed.gameObject.SetActive(true);
            this.hide2.SetActive(true);
            this.hide4.SetActive(false);
        }
        else {
            // this.txtProtectNeed.gameObject.SetActive(false);
            this.isBuyPerfect = false;
            this.togSelected.SetActive(this.isBuyPerfect);
            this.hide2.SetActive(false);
            this.hide4.SetActive(true);

        }

        //加成卷
        if (this.jiaChengData.id > 0) {
            this.jiaChengData.has = G.DataMgr.thingData.getThingNum(this.jiaChengData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            let config = ThingData.getThingConfig(this.jiaChengData.id);
            this.txtMaterial.text = Math.floor(this.jiaChengData.need / 100) * this.jiaChengData.has + "% (" + TextFieldUtil.getItemText(config) + "*" + this.jiaChengData.has + ")";
            this.hide3.SetActive(true);
        } else {
            this.hide3.SetActive(false);
        }

        this.updateLuckPanel();

        if (this.m_perfectData.has < this.m_perfectData.need) {
            this.isBuyPerfect = false;
            this.togSelected.SetActive(this.isBuyPerfect);
        }
    }

    /**
     * 获取属性列表ITEM数据
     * @param	m_ucPropId
     * @return
     */
    private getEquipEnhanceAttItemData(m_ucPropId: number): EquipZmAttItemData {
        let equipEnhanceAttItemData: EquipZmAttItemData = this.m_attListDic[m_ucPropId] as EquipZmAttItemData;
        if (!equipEnhanceAttItemData && m_ucPropId > 0) {
            equipEnhanceAttItemData = new EquipZmAttItemData();
            equipEnhanceAttItemData.propId = m_ucPropId;
            this.m_attListData.push(equipEnhanceAttItemData);
            this.m_attListDic[m_ucPropId] = equipEnhanceAttItemData;
        }
        return this.m_attListDic[m_ucPropId];
    }


    _onContainerChange(id: number): void {
        if (id == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this._onBagChange();
            this.updateLuckPanel();
        }
        else if (id == Macros.CONTAINER_TYPE_ROLE_EQUIP) {
            this.updateEquipList(id, ThingData.All_EQUIP_NUM - 2);
        }
    }

    /**自动强化*/
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

            this._onBtnEnhanceClick();
        }
    }

    private _stopAuto(): void {
        if (this.m_isAuto) {
            this.m_isAuto = false;
            this.m_oldPart = -1;
        }
    }

    /**强化*/
    private _onBtnEnhanceClick(): void {
        if (this.m_selectedEquipData == null) return;
        if (this.m_selectedEquipData.config == null) return;
        if (this.m_costData.has >= this.m_costData.need) {
            this.sendStreng();
        }
        else if (this._btnCostBuy.isOn) {
            let num: number = this.m_costData.need - this.m_costData.has;
            let info: AutoBuyInfo = G.ActionHandler.checkAutoBuyInfo(this.m_costData.id, num, true);
            if (info.isAffordable) {
                this.sendStreng();
                return;
            }
            this._stopAuto();
        }
        else {
            this._stopAuto();
            G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_costData.id, 1);
        }
    }

    /**发送强化*/
    private sendStreng(): void {
        if (this._crtEquipConfig) {
            let can = !this.isBuyPerfect && !this._noTipsConfirm && this._crtLevel > EnumEquipRule.ZM_TIPS_LEVEL1 && this._crtLevel < EnumEquipRule.ZM_TIPS_LEVEL2;
            if (!this.isBuyPerfect && !this._noTipsConfirm && this._crtLevel > EnumEquipRule.ZM_TIPS_LEVEL1 && this._crtLevel < EnumEquipRule.ZM_TIPS_LEVEL2) {
                let str = G.DataMgr.langData.getLang(280);
                G.TipMgr.showConfirm(str, ConfirmCheck.withCheck, '确认进阶|取消', delegate(this, this.onConfirmAdd));
            }
            else {
                this.requestStreng();
            }
        }
    }

    /**确定购买次数*/
    private onConfirmAdd(status: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == status) {
            this._noTipsConfirm = isCheckSelected;
            // this.requestStreng();        
            if (this._crtEquipConfig) {
                this.m_oldLevel = this.m_selectedEquipData.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stLQ.m_ucLQLevel;
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipLqRequest(this.m_selectedEquipData.data.m_usPosition, this.isBuyPerfect, this._luckId));
            }
        }
    }

    /**请求强化*/
    private requestStreng(): void {
        if (this._crtEquipConfig) {
            this.m_oldLevel = this.m_selectedEquipData.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stLQ.m_ucLQLevel;
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipLqRequest(this.m_selectedEquipData.data.m_usPosition, this.isBuyPerfect, this._luckId));
        }
    }

    private updateLuckPanel(): void {
        this.m_bagEquipData.length = 0;
        let allEquipInContainer: ThingItemData[] = G.DataMgr.thingData.getThingListByFunction(KeyWord.ITEM_FUNCTION_LQ_LUCK);
        for (let thingItemData of allEquipInContainer) {
            let itemData: ThingItemData = new ThingItemData();
            itemData = uts.deepcopy(thingItemData, itemData, true);
            this.m_bagEquipData.push(itemData);
        }
        this.m_bagEquipData.sort(this.sortEquipItem);

        if (this.luckIndex == -1) {
            this.setLuck(null);
        } else {
            this.setLuck(this.m_bagEquipData[this.luckIndex]);
        }

    }

    /**排序装备列表*/
    private sortEquipItem(a: ThingItemData, b: ThingItemData): number {
        return b.config.m_iFunctionValue - a.config.m_iFunctionValue;
    }

}

class OneEquipZMPropItem {

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

    update(vo: EquipZmAttItemData) {

        let frame: number = 0;
        var sign: string = "";
        if (vo.propId == KeyWord.EQUIP_PROP_ATTACK_PRESS || vo.propId == KeyWord.EQUIP_PROP_DEFENSE_PRESS) {
            sign = "%";
        }

        this.txtType.text = TextFieldUtil.getColorText(vo.propStr, Color.PropWHITE);
        let beforeVal: number = vo.beforeVal;
        let afterVal: number = vo.afterVal;
        this.txtCurValue.text = TextFieldUtil.getColorText(beforeVal + sign, Color.PropGreen);
        this.txtNextValue.text = TextFieldUtil.getColorText(afterVal + sign, Color.GREEN);

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