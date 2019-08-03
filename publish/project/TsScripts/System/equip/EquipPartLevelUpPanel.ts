import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { FuncLimitData } from 'System/data/FuncLimitData'
import { HeroData } from 'System/data/RoleData'
import { ThingData } from 'System/data/thing/ThingData'
import { ErrorId } from 'System/protocol/ErrorId'
import { Macros } from 'System/protocol/Macros'
import { EquipEnhanceAttItemData } from 'System/data/thing/EquipEnhanceAttItemData'
import { EquipSlotLvItemData } from 'System/equip/EquipSlotLvItemData'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { EquipBasePanel } from 'System/equip/EquipBasePanel'
import { UIPathData } from 'System/data/UIPathData'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { EquipView } from 'System/equip/EquipView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { TipFrom } from 'System/tip/view/TipsView'
import { List } from "System/uilib/List"
import { OneEquipPropItem } from 'System/equip/EquipStrengPanel'
import { UIEffect, EffectType } from 'System/uiEffect/UIEffect'
import { SlotMachine } from 'System/uilib/SlotMachine'
import { UIUtils } from 'System/utils/UIUtils'
import { EnumGuide } from 'System/constants/GameEnum'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { ItemTipBase } from 'System/tip/view/ItemTipBase'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'

/**
 * <装备位升级>面板。
 * 
 * 
 */
export class EquipPartLevelUpPanel extends EquipBasePanel implements IGuideExecutor {
    /**满级500级*/
    private readonly maxLv = 500;
    private readonly effectTime = 0.7;

    private readonly yingliangId = 220034;

    /**时间间隔*/
    private readonly time: number = 200;
    /**计时器每次增减数字*/
    private readonly eachTimeAdd: number = 3;

    private equipView: EquipView;

    /**升级后与升级前差*/
    private needAddNum: number = 0;
    /**计时器，每次文本要显示的数字*/
    private updateNum: number = 0;

    /**选中的装备的升级配置*/
    private m_selectedEquipSlotConfig: GameConfig.EquipSlotUpLvM;
    private m_nextEquipSlotConfig: GameConfig.EquipSlotUpLvM;
    /**选中位置的位置信息*/
    private m_selectedEquipSlotInfo: Protocol.ContainerSlotInfo;

    btnOneKeyStart: UnityEngine.GameObject;
    private btnStart: UnityEngine.GameObject;

    /**装备数据*/
    private equipSlotLvItemDatas: EquipSlotLvItemData[] = [];
    /**当前选择的装备索引*/
    private curSelectedIndex: number = 0;
    /** 当前选中的那一件 */
    private m_selectedEquipData: EquipSlotLvItemData;
    //private txtFight: UnityEngine.UI.Text;

    private txtType1: UnityEngine.UI.Text;
    private txtType2: UnityEngine.UI.Text;

    private txtLv: UnityEngine.UI.Text;
    private txtnextLv: UnityEngine.UI.Text;
    private txtExtraProp1: UnityEngine.UI.Text;
    private txtExtraProp2: UnityEngine.UI.Text;
    private txtNeedMaterial: UnityEngine.UI.Text;
    //下一级属性
    private txtNextExtraProp1: UnityEngine.UI.Text;
    private txtNextExtraProp2: UnityEngine.UI.Text;

    //图标
    private curEquipIcon: UnityEngine.GameObject;
    private nextEquipIcon: UnityEngine.GameObject;
    private materialIcon: UnityEngine.GameObject;
    private curEquipIconItem: IconItem;
    private nextEquipIconItem: IconItem;
    private materialIconItem: IconItem;

    //箭头
    private objJianTou1: UnityEngine.GameObject;
    private objJianTou2: UnityEngine.GameObject;

    //特效
    /**中心爆开特效*/
    private effectCenterRoot: UnityEngine.GameObject;
    private effectCenterPrefab: UnityEngine.GameObject;
    private effectCenterUIEffect: UIEffect;
    //升级特效
    private shengjiEffect: UnityEngine.GameObject;
    private leveUpUIEffect: UIEffect;
    private effectLvUpRoot: UnityEngine.GameObject;
    //装备通用特效
    private equipCommonEffect: UnityEngine.GameObject;
    private equipCommonEffectRoot: UnityEngine.GameObject;
    private commonUIEffect: UIEffect;


    //一键提升每个都加特效
    private equipCenterUIEffects: UIEffect[] = [];

    private oldLv: number = -1;
    /**是否是第一次打开界面*/
    private isFirstOpen = true;
    /**是否是一键提升，一键才有滚动效果*/
    private isOneKeyUp = false;
    private notMax: UnityEngine.GameObject;
    private max: UnityEngine.GameObject;
    /**老的装备位等级，用于特效*/
    //private oldEquipSlotLvs: number[] = [];

    //新增右侧当前装备信息
    private itemInfo: UnityEngine.GameObject;
    private thingInfo: UnityEngine.GameObject;
    private equipInfo: UnityEngine.GameObject;
    private itemTipBase: ItemTipBase;
    private baseInfo: UnityEngine.GameObject;

    private txtFightVlaue: UnityEngine.UI.Text;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP);
    }

    protected resPath(): string {
        return UIPathData.EquipPartLevelUpPanel;
    }

    protected initElements() {
        super.initElements();
        this.initEquipList(ArrowType.equipPartLvUp);

        this.btnOneKeyStart = this.elems.getElement("btnOneKeyStart");
        this.btnStart = this.elems.getElement("btnStart");

        //this.txtFight = this.elems.getText("txtFight");
        //属性类型
        this.txtType1 = this.elems.getText("txtType1");
        this.txtType2 = this.elems.getText("txtType2");

        this.txtLv = this.elems.getText("txtLv");
        this.txtnextLv = this.elems.getText("txtnextLv");
        this.txtExtraProp1 = this.elems.getText("txtExtraProp1");
        this.txtExtraProp2 = this.elems.getText("txtExtraProp2");
        this.txtNeedMaterial = this.elems.getText("txtNeedMaterial");
        //下一级
        this.txtNextExtraProp1 = this.elems.getText("txtNextExtraProp1");
        this.txtNextExtraProp2 = this.elems.getText("txtNextExtraProp2");

        //图标
        this.curEquipIcon = this.elems.getElement("curEquipIcon");
        this.nextEquipIcon = this.elems.getElement("nextEquipIcon");
        this.materialIcon = this.elems.getElement("materialIcon");

        this.curEquipIconItem = new IconItem();
        this.curEquipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.curEquipIcon);
        this.curEquipIconItem.setTipFrom(TipFrom.normal);
        this.curEquipIconItem.arrowType = ArrowType.equipPartLvUp;
        this.curEquipIconItem.isNeedShowArrow = false;
        this.curEquipIconItem.needWuCaiColor = true;
        this.curEquipIconItem.needForceShowWuCaiColor = true;

        this.nextEquipIconItem = new IconItem();
        this.nextEquipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.nextEquipIcon);
        this.nextEquipIconItem.showBg = true;
        this.nextEquipIconItem.setTipFrom(TipFrom.normal);
        this.nextEquipIconItem.arrowType = ArrowType.equipPartLvUp;
        this.nextEquipIconItem.isNeedShowArrow = false;
        this.nextEquipIconItem.needWuCaiColor = true;
        this.nextEquipIconItem.needForceShowWuCaiColor = true;

        this.materialIconItem = new IconItem();
        this.materialIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.materialIcon);
        this.materialIconItem.setTipFrom(TipFrom.normal);

        //箭头
        this.objJianTou1 = this.elems.getElement("objJianTou1");
        this.objJianTou2 = this.elems.getElement("objJianTou2");

        //特效
        this.effectCenterRoot = this.elems.getElement("effectCenterRoot");
        this.effectCenterPrefab = this.elems.getElement("equipPartCenterEffect");
        this.effectCenterUIEffect = new UIEffect();
        this.effectCenterUIEffect.setEffectPrefab(this.effectCenterPrefab, this.effectCenterRoot);

        this.shengjiEffect = this.elems.getElement("shengjiEffect");
        this.effectLvUpRoot = this.elems.getElement("effectLvUpRoot");
        this.leveUpUIEffect = new UIEffect();
        this.leveUpUIEffect.setEffectPrefab(this.shengjiEffect, this.effectLvUpRoot);

        this.equipCommonEffect = this.elems.getElement("equipCommonEffect");
        this.equipCommonEffectRoot = this.elems.getElement("equipCommonEffectRoot");
        this.commonUIEffect = new UIEffect();
        this.commonUIEffect.setEffectPrefab(this.equipCommonEffect, this.equipCommonEffectRoot);

        //每个装备icon上添加
        //let partEffect = this.elems.getElement("bkts");
        //for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
        //    this.equipCenterUIEffects[i] = new UIEffect();
        //    let obj = this.equipList.GetItem(i).transform.Find("equip").gameObject;
        //    this.equipCenterUIEffects[i].setEffectPrefab(partEffect, obj);
        //}
        this.notMax = this.elems.getElement("notMax");
        this.max = this.elems.getElement("max");

        this.itemInfo = this.elems.getElement("itemInfo");
        this.thingInfo = this.elems.getElement("thingInfo");
        this.equipInfo = this.elems.getElement("equipInfo");
        this.itemTipBase = new ItemTipBase();
        this.itemTipBase.setBaseInfoComponents(this.elems.getUiElements('baseInfo'), this.itemIcon_Normal);
        this.itemTipBase.setThingInfoComponents(this.thingInfo);
        this.itemTipBase.setEquipInfoComponents(this.equipInfo, this.elems.getUiElements('equipInfo'));

        this.txtFightVlaue = this.elems.getText("fightText");
        
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnStart, this._onBtnEnhanceClick);
        this.addClickListener(this.btnOneKeyStart, this._onBtnAutoClick);
    }

    protected onOpen() {
        //for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
        //    let lv = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(i).m_iSlotLv;
        //    this.oldEquipSlotLvs.push(lv);
        //}

        this.equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (this.equipView != null) {
            //this.equipView.showModelBg(true);
            this.equipView.showFight(true);
        }

        this.updateEquip();
        //选择第一个可强化，没有默认第一个
        let shouldSelectIndex = this.getCurShouldSelectedIndex();
        this.equipList.Selected = shouldSelectIndex;
        this.onClickEquipList(shouldSelectIndex);
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.EquipSlotLvUp, EnumGuide.EquipSlotLvUp_ClickEquip);
    }

    protected onClose() {
        if (this.equipView != null) {
            //this.equipView.showModelBg(false);
            this.equipView.showFight(false);
        }
        this.isFirstOpen = true;
        this.effectCenterUIEffect.stopEffect();
        this.leveUpUIEffect.stopEffect();
        this.commonUIEffect.stopEffect();
        //每个装备icon上添加
        //for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
        //    this.equipCenterUIEffects[i].stopEffect();
        //}
    }

    protected onClickEquipList(index: number) {
        //if (index == this.curSelectedIndex) return;

        UIUtils.setButtonClickAble(this.btnStart, true);
        this.curSelectedIndex = index;
        this.m_selectedEquipData = this.equipSlotLvItemDatas[index];

        this.updatePanel();
        //切换装备，重置状态
        this.leveUpUIEffect.stopEffect();
        if (this.m_selectedEquipData != null) {
            this.oldLv = this.m_selectedEquipData.slotLv;
        }
        this.effectCenterUIEffect.stopEffect();
        this.showMaxUI();
        this.equipList.Selected = index;
        this._updateCost();
    }


    //得到应该选择的装备
    //能强化的，等级最低的
    //等级相同，祝福值最多的
    private getCurShouldSelectedIndex(): number {
        //this.showArrow = G.DataMgr.equipStrengthenData.oneEquipPartIsCanLevelUp(tempItem);
        let dataList = this.equipSlotLvItemDatas;
        if (dataList == null) return 0;
        let minLv = 999;
        let minPart: number = 0;
        for (let i = 0; i < dataList.length; i++) {
            let equipData = dataList[i].thingItemData;
            if (equipData != null) {
                let showArrow = G.DataMgr.equipStrengthenData.oneEquipPartIsCanLevelUp(equipData);
                if (showArrow) {
                    if (dataList[i].slotLv < minLv) {
                        minLv = dataList[i].slotLv;
                        minPart = i;
                    }
                }
            }
        }
        return minPart;
    }


    /**
  *找到可自动升级的最低装备 
  * 
  */
    private _findPart(): number {
        if (this.equipSlotLvItemDatas == null || this.equipSlotLvItemDatas[0] == null) return;
        //默认显示第一个
        let minPart: number = 0;
        let minLv: number = this.equipSlotLvItemDatas[0].slotLv;
        for (let i: number = 1; i < this.equipSlotLvItemDatas.length; i++) {
            if (this.equipSlotLvItemDatas[i] != null && (this.equipSlotLvItemDatas[i].slotLv < minLv)) {
                minPart = i;
                minLv = this.equipSlotLvItemDatas[i].slotLv;
            }
        }
        return minPart;
    }


    /**
     * 一级一级特效
     */
    playEffect() {
        
        this.addTimer("playEffect", 500, 1, this.playCenterAndLevelUpEffect);
    }

    private playCenterAndLevelUpEffect() {
        //一个没播放完，又来一个，停了，继续
        this.effectCenterUIEffect.stopEffect();
        this.leveUpUIEffect.stopEffect();
        G.AudioMgr.playJinJieSucessSound();
        this.effectCenterUIEffect.playEffect(EffectType.Effect_Normal, true, this.effectTime);
        this.leveUpUIEffect.playEffect(EffectType.Effect_Normal, true, 0.9);
        this.removeTimer("playEffect");
    }

    /**
     * 一键提升特效
     */
    onPlayOneKeyEffect() {
        this.playEffect();
        //for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
        //    this.equipCenterUIEffects[i].stopEffect();
        //    let lv = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(i).m_iSlotLv;
        //    if (lv > this.oldEquipSlotLvs[i]) {
        //        this.equipCenterUIEffects[i].playEffect(EffectType.Effect_Normal, true, this.effectTime);
        //        this.oldEquipSlotLvs[i] = lv;
        //    }
        //}
    }


    /**打开面板或者收到回复后刷新装备列表*/
    updateEquip(isOneKey: boolean = false): void {
        this.isOneKeyUp = isOneKey;
        this.equipSlotLvItemDatas.length = 0;
        let equipObject: { [pos: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);

        let prop: GameConfig.EquipPropAtt[];
        let propDic: { [m_ucPropId: number]: number } = {};

        for (let i: number = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            let equipSlotItemData = new EquipSlotLvItemData();
            equipSlotItemData.thingItemData = equipObject[i];
            equipSlotItemData.part = i + KeyWord.EQUIP_MAINCLASS_MIN;
            equipSlotItemData.slotLv = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(i).m_iSlotLv;
            if (equipSlotItemData.slotLv > 0) {
                prop = G.DataMgr.equipStrengthenData.getEquipSlotConfigByPartAndLv(equipSlotItemData.part, equipSlotItemData.slotLv).m_astPropAtt;
                for (let item of prop) {
                    if (item.m_ucPropValue > 0) {
                        if (propDic[item.m_ucPropId] == null) {
                            propDic[item.m_ucPropId] = item.m_ucPropValue;
                        }
                        else {
                            propDic[item.m_ucPropId] += item.m_ucPropValue;
                        }
                    }
                }
            }
            equipSlotItemData.nextConfig = G.DataMgr.equipStrengthenData.getEquipSlotConfigByPartAndLv(equipSlotItemData.part, equipSlotItemData.slotLv + 1);
            this.equipSlotLvItemDatas.push(equipSlotItemData);
        }

        let itemCount: number = this.equipSlotLvItemDatas.length;
        for (let i = 0; i < itemCount; i++) {
            let itemobj = this.equipList.GetItem(i);
            let txtLv = itemobj.findText("lvbg/txtLv");
            let txtName = itemobj.findText("lvbg/txtName");
            let txtType = itemobj.findText("lvbg/txtType");
            //2018.10.13 jackson 修改，排除没有数据的情况
            if (this.equipSlotLvItemDatas[i].thingItemData != undefined) {
                this.equipIcons[i].updateByThingItemData(this.equipSlotLvItemDatas[i].thingItemData);
                this.equipIcons[i].updateIcon();
                txtLv.text = this.equipSlotLvItemDatas[i].slotLv + "级";
                let color = Color.getColorById(this.equipSlotLvItemDatas[i].thingItemData.config.m_ucColor);
                txtName.text = TextFieldUtil.getColorText(this.equipSlotLvItemDatas[i].thingItemData.config.m_szName, color);
            }
            else {
                this.equipIcons[i].updateByThingItemData(null);
                this.equipIcons[i].updateIcon();
                txtName.text = "";
                txtLv.text = "";
            }
            txtType.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_MAIN, this.equipSlotLvItemDatas[i].part).replace("角色", "");
        }

        let fight: number = 0;
        for (let key in propDic) {
            let propId = parseInt(key);
            let propValue = propDic[key];
            fight += FightingStrengthUtil.calStrengthByOneProp(propId, propValue);
        }
        if (this.equipView != null) {
            //总战力
            this.equipView.setTxtFight(G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT));
        }
        //this.txtFightVlaue.text = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT).toString();
        //this.txtFightVlaue.text = fight.toString();
        this.m_selectedEquipData = this.equipSlotLvItemDatas[this.curSelectedIndex];
        this.updatePanel();
        this.showMaxUI();

        UIUtils.setButtonClickAble(this.btnOneKeyStart, G.DataMgr.equipStrengthenData.IsAllEquipExistCanLevelUp());
    }

    /**
     *装备位强化 
     * @param e
     * 
     */
    private _onBtnEnhanceClick(): void {
        if (this._checkeEnable()) {
            this.commonUIEffect.stopEffect();
            this.commonUIEffect.playEffect(EffectType.Effect_Normal, true,1);
            //this.equipCenterUIEffects[this.curSelectedIndex].playEffect(EffectType.Effect_Normal, true, this.effectTime);
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipEnhanceRequest(this.m_selectedEquipData.thingItemData.data.m_usPosition, Macros.EQUIP_SLOT_UPLEVEL));
        }
    }


    private _checkeEnable(): boolean {
        if (this.m_selectedEquipData.thingItemData == null || this.m_selectedEquipData.thingItemData.data == null) {
            G.TipMgr.addMainFloatTip('当前装备位未穿戴装备，无法升级！');
            return;
        }

        let has: number = G.DataMgr.heroData.tongqian;

        if (this.m_selectedEquipSlotInfo.m_iSlotLv >= G.DataMgr.heroData.level) {
            G.TipMgr.addMainFloatTip('装备等级不能超过主角等级！');
            return false;
        }

        if (this.m_nextEquipSlotConfig == null) {
            G.TipMgr.addMainFloatTip('当前装备已达到最高等级！');
            return false;
        }

        if (this.m_nextEquipSlotConfig.m_ucLimitColor > 0 && (this.m_selectedEquipData.thingItemData.config.m_ucColor < this.m_nextEquipSlotConfig.m_ucLimitColor)) {
            G.TipMgr.addMainFloatTip('当前品质的装备已达到最高等级！');
            return false;
        }

        if (has >= this.m_nextEquipSlotConfig.m_iConsumableNumber) {
            return true;
        }
        else {
            G.TipMgr.addMainFloatTip('魂币不足，无法升级！');
            return false;
        }
    }


    /**
     *一键强化 
     * @param e
     * 
     */
    private _onBtnAutoClick(): void {
        let pos = 0;
        if (this.m_selectedEquipData.thingItemData == null) {
            pos = this.equipSlotLvItemDatas[this.getCurShouldSelectedIndex()].thingItemData.data.m_usPosition;
        } else {
            pos = this.m_selectedEquipData.thingItemData.data.m_usPosition;
        }
        this.commonUIEffect.stopEffect();
        this.commonUIEffect.playEffect(EffectType.Effect_Normal, true, 1);

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipEnhanceRequest(pos, Macros.EQUIP_SLOT_ONE_UPLV));
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.EquipSlotLvUp, EnumGuide.EquipSlotLvUp_ClickAutoLvUp);
    }


    private showMaxUI() {
        if (this.m_nextEquipSlotConfig == null) {
            return;
        }

        if (this.m_nextEquipSlotConfig.m_ucLimitColor > 0 && (this.m_selectedEquipData.thingItemData.config.m_ucColor < this.m_nextEquipSlotConfig.m_ucLimitColor)) {
            this.txtnextLv.text = "LV.Max";
            this.notMax.SetActive(false);
            this.max.SetActive(true);
            UIUtils.setButtonClickAble(this.btnStart, false);
        } else {
            let nextLv = this.m_selectedEquipData.slotLv + 1;
            if (nextLv > this.maxLv) {
                this.txtnextLv.text = "LV.Max";;
            } else {
                this.txtnextLv.text = "LV." + (this.m_selectedEquipData.slotLv + 1).toString();
            }
            this.notMax.SetActive(true);
            this.max.SetActive(false);
            UIUtils.setButtonClickAble(this.btnStart, true);
        }
    }


    /**
     *装备列表点击选择装备以后刷新UI 
     * 
     */
    private updatePanel(): void {
        if (this.m_selectedEquipData.thingItemData == null) {
            this.itemInfo.SetActive(false);
            this.curEquipIconItem.updateByThingItemData(null);
            this.curEquipIconItem.updateIcon();
            this.nextEquipIconItem.updateByThingItemData(null);
            this.nextEquipIconItem.updateIcon();
            this.materialIconItem.updateByThingItemData(null);
            this.materialIconItem.updateIcon();
        } else {
            this.itemInfo.SetActive(true);
            this.curEquipIconItem.updateByThingItemData(this.m_selectedEquipData.thingItemData);
            this.curEquipIconItem.updateIcon();
            this.nextEquipIconItem.updateByThingItemData(this.m_selectedEquipData.thingItemData);
            this.nextEquipIconItem.updateIcon(false, true);
            let has = G.DataMgr.heroData.tongqian;
            this.materialIconItem.updateById(this.yingliangId, has);
            this.materialIconItem.updateIcon();
        }
        //this.materialIconItem.frameColor = this.m_selectedEquipData.thingItemData.config.m_ucColor;

        if (this.m_selectedEquipData.thingItemData == null) return;

        let equipPos = this.m_selectedEquipData.thingItemData.data.m_usPosition;
        let equipPart = equipPos + KeyWord.EQUIP_MAINCLASS_MIN;
        this.m_selectedEquipSlotInfo = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(equipPos);
        this.m_selectedEquipSlotConfig = G.DataMgr.equipStrengthenData.getEquipSlotConfigByPartAndLv(equipPart, this.m_selectedEquipSlotInfo.m_iSlotLv);
        this.m_nextEquipSlotConfig = G.DataMgr.equipStrengthenData.getEquipSlotConfigByPartAndLv(equipPart, this.m_selectedEquipSlotInfo.m_iSlotLv + 1);

        //不是刚打开界面，点击一键，装备位等级提升了
        if (!this.isFirstOpen && this.isOneKeyUp && (this.oldLv != this.m_selectedEquipData.slotLv)) {
            let str = (this.oldLv + 1) > this.maxLv ? "Max" : (this.oldLv + 1).toString();
            this.txtnextLv.text = "LV." + str;
        } else {
            let str = (this.m_selectedEquipData.slotLv + 1) > this.maxLv ? "Max" : (this.m_selectedEquipData.slotLv + 1).toString();
            this.txtnextLv.text = "LV." + str;
        }
        this.oldLv = this.m_selectedEquipData.slotLv;
        this.txtLv.text = "LV." + this.m_selectedEquipData.slotLv.toString();
        this.isFirstOpen = false;

        if (this.m_selectedEquipSlotConfig == null) {
            this.txtType1.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, this.m_nextEquipSlotConfig.m_astPropAtt[0].m_ucPropId);
            this.txtType2.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, this.m_nextEquipSlotConfig.m_astPropAtt[1].m_ucPropId);
            this.txtExtraProp1.text = "0";
            this.txtExtraProp2.text = "0";
        }
        else {
            this.txtType1.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, this.m_selectedEquipSlotConfig.m_astPropAtt[0].m_ucPropId);
            this.txtType2.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, this.m_selectedEquipSlotConfig.m_astPropAtt[1].m_ucPropId);
            this.txtExtraProp1.text = this.m_selectedEquipSlotConfig.m_astPropAtt[0].m_ucPropValue.toString();
            this.txtExtraProp2.text = this.m_selectedEquipSlotConfig.m_astPropAtt[1].m_ucPropValue.toString();
        }

        if (this.m_nextEquipSlotConfig != null) {
            let add1: number = 0;
            let add2: number = 0;
            if (this.m_selectedEquipSlotConfig == null) {
                add1 = this.m_nextEquipSlotConfig.m_astPropAtt[0].m_ucPropValue;
                add2 = this.m_nextEquipSlotConfig.m_astPropAtt[1].m_ucPropValue;
            }
            else {
                add1 = this.m_nextEquipSlotConfig.m_astPropAtt[0].m_ucPropValue;
                add2 = this.m_nextEquipSlotConfig.m_astPropAtt[1].m_ucPropValue;
            }
            this.txtNextExtraProp1.text = add1.toString();
            this.txtNextExtraProp2.text = add2.toString();
            this.objJianTou1.SetActive(true);
            this.objJianTou2.SetActive(true);
        }
        else {
            this.txtNextExtraProp1.text = "已满级";
            this.txtNextExtraProp2.text = "已满级";
            this.objJianTou1.SetActive(false);
            this.objJianTou2.SetActive(false);
            let str = (this.m_selectedEquipData.slotLv + 1) > this.maxLv ? "Max" : (this.m_selectedEquipData.slotLv + 1).toString();
            this.txtnextLv.text = "LV." + str;
            UIUtils.setButtonClickAble(this.btnStart, false);
        }
        this._updateCost();

        let tipData = this.curEquipIconItem.getTipData() as ItemTipData;
        this.itemTipBase.updateInfo(tipData);
    }
    /**
     *消耗物品 
     * 
     */
    private _updateCost(): void {
        if (this.m_selectedEquipData != null) {
            let has = G.DataMgr.heroData.tongqian;
            if (this.m_nextEquipSlotConfig != null) {
                // let has: number = G.DataMgr.getOwnValueByID(this.m_nextEquipSlotConfig.m_iConsumableID);

                let numStr = this.m_nextEquipSlotConfig.m_iConsumableNumber >= 100000 ? Math.round(this.m_nextEquipSlotConfig.m_iConsumableNumber / 10000) + '万' : this.m_nextEquipSlotConfig.m_iConsumableNumber.toString();

                let color: string = has >= this.m_nextEquipSlotConfig.m_iConsumableNumber ? Color.GREEN : Color.RED;

                this.txtNeedMaterial.text = TextFieldUtil.getColorText("消耗魂币：" + numStr, color);
            }
            else {
                this.txtNeedMaterial.text = "消耗魂币：0";
            }
            this.materialIconItem.updateById(this.yingliangId, has);
            this.materialIconItem.updateIcon();
            if (this.m_selectedEquipData.thingItemData) {
                this.materialIconItem.frameColor = this.m_selectedEquipData.thingItemData.config.m_ucColor;
                this.materialIconItem.color = this.m_selectedEquipData.thingItemData.config.m_ucColor;
                this.materialIconItem.closeItemCount();
            }
        }
    }


    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.EquipSlotLvUp_ClickAutoLvUp == step) {
            this._onBtnAutoClick();
            return true;
        }
        return false;
    }
}
