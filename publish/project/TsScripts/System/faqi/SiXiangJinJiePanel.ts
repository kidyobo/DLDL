import { Global as G } from "System/global"
import { UIPathData } from 'System/data/UIPathData'
import { SiXiangBasePanel } from 'System/faqi/SiXiangBasePanel'
import { KeyWord } from "System/constants/KeyWord"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Macros } from 'System/protocol/Macros'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { PetPropItem } from 'System/pet/view/PetPropItem'
import { SiXiangData, SiXiangJinJieItemData } from 'System/data/SiXiangData'
import { EnumActivateState, UnitCtrlType, EnumStoreID } from 'System/constants/GameEnum'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from 'System/utils/DataFormatter'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { ThingData } from 'System/data/thing/ThingData'
import { Color } from 'System/utils/ColorUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { MallView } from 'System/business/view/MallView'
import { FaQiView } from 'System/faqi/FaQiiView'

class SiXiangJinJieItem extends ListItemCtrl {
    private canActivate: UnityEngine.GameObject;
    private bg: UnityEngine.GameObject;
    private icon: UnityEngine.UI.Image;
    private textName: UnityEngine.UI.Text;
    private textStage: UnityEngine.UI.Text;
    private arrow: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        let content = ElemFinder.findObject(go, 'content');
        this.bg = ElemFinder.findObject(content, 'bg');
        this.icon = ElemFinder.findImage(content, 'icon');
        this.textName = ElemFinder.findText(content, 'textName');
        this.textStage = ElemFinder.findText(content, 'textStage');
        this.canActivate = ElemFinder.findObject(go, 'canActivate');
        this.arrow = ElemFinder.findObject(go, 'arrow');
    }

    init(id: number, altas: Game.UGUIAltas) {
        this.icon.sprite = altas.Get(id.toString());
        this.textName.text = SiXiangData.Names[id - 1];
    }

    update(itemData: SiXiangJinJieItemData) {
        this.canActivate.SetActive(EnumActivateState.canActivate == itemData.activateState);
        if (itemData.stage > 0) {
            this.textStage.text = itemData.stage + '阶';
            this.textStage.gameObject.SetActive(true);
        } else {
            this.textStage.gameObject.SetActive(false);
        }
        UIUtils.setGrey(this.bg, EnumActivateState.activated != itemData.activateState, false);
        UIUtils.setGrey(this.icon.gameObject, EnumActivateState.activated != itemData.activateState, false);
        this.arrow.SetActive(itemData.canUpgrade);
    }
}

export class SiXiangJinJiePanel extends SiXiangBasePanel {
    private list: List;
    private items: SiXiangJinJieItem[] = [];
    private itemDatas: SiXiangJinJieItemData[] = [];

    private textStage: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private modelRootTR: UnityEngine.GameObject;
    private textFight: UnityEngine.UI.Text;

    private propItems: PetPropItem[] = [];
    private textGhDesc: UnityEngine.UI.Text;
    private haloItem0: PetPropItem;
    private haloItem1: PetPropItem;
    private materialItemData = new MaterialItemData();

    private activateGo: UnityEngine.GameObject;
    private materialIcon: IconItem;
    private btnActivate: UnityEngine.GameObject;

    private jinjieGo: UnityEngine.GameObject;
    private btnOneKey: UnityEngine.GameObject;
    private labelBtnOneKey: UnityEngine.UI.Text;
    private btnJinJie: UnityEngine.GameObject;
    private sliderBg: UnityEngine.GameObject;
    private slider: UnityEngine.UI.Slider;
    private textProgress: UnityEngine.UI.Text;
    private textCost: UnityEngine.UI.Text;
    private textOwn: UnityEngine.UI.Text;

    private btnStore: UnityEngine.GameObject;

    //粒子特效
    private liziEffectRoot: UnityEngine.GameObject;

    private openId = 0;
    private oldId = 0;
    private oldStage = -1;
    //消耗物品id
    private costID: number = 0;
    //进阶丹信息提示的按钮
    private btnJinjieDan: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE);
    }

    protected resPath(): string {
        return UIPathData.SiXiangJinJieView;
    }

    protected initElements(): void {
        let altas = this.elems.getElement('altas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.list = this.elems.getUIList('list');
        this.list.Count = SiXiangData.TotalCnt;
        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let itemGo = this.list.GetItem(i).gameObject;
            let item = new SiXiangJinJieItem();
            item.setComponents(itemGo);
            item.init(i + 1, altas);
            this.items.push(item);

            this.itemDatas.push(new SiXiangJinJieItemData());
        }

        this.textStage = this.elems.getText('textStage');
        this.textName = this.elems.getText('textName');
        this.modelRootTR = this.elems.getElement('modelRoot');
        this.textFight = this.elems.getText('textFight');

        let props = this.elems.getElement('props');
        for (let i = 0; i < SiXiangData.MaxPropCnt; i++) {
            let itemGo = ElemFinder.findObject(props, i.toString());
            let item = new PetPropItem();
            item.setUsual(itemGo);
            this.propItems.push(item);
        }

        let guangHuanElems = this.elems.getUiElements('guanghuanGo');
        this.textGhDesc = guangHuanElems.getText('textGhDesc');
        this.haloItem0 = new PetPropItem();
        this.haloItem0.setUsual(guangHuanElems.getElement('0'));
        this.haloItem1 = new PetPropItem();
        this.haloItem1.setUsual(guangHuanElems.getElement('1'));

        this.activateGo = this.elems.getElement('activateGo');
        let activateElems = this.elems.getUiElements('activateGo');
        this.materialIcon = new IconItem();
        this.materialIcon.setUsualIconByPrefab(this.elems.getElement('itemIcon_Normal'), activateElems.getElement('materialIcon'));
        this.materialIcon.setTipFrom(TipFrom.normal);
        this.btnActivate = activateElems.getElement('btnActivate');

        this.jinjieGo = this.elems.getElement('jinjieGo');
        let jinjieElems = this.elems.getUiElements('jinjieGo');
        this.btnOneKey = jinjieElems.getElement('btnOneKey');
        this.labelBtnOneKey = ElemFinder.findText(this.btnOneKey, 'Text');
        this.btnJinJie = jinjieElems.getElement('btnJinJie');
        this.sliderBg = jinjieElems.getElement('sliderBg');
        this.slider = jinjieElems.getSlider('slider');
        this.textProgress = jinjieElems.getText('textSlider');
        this.textCost = jinjieElems.getText('textCost');
        this.textOwn = jinjieElems.getText('textOwn');

        this.btnStore = this.elems.getElement('btnStore');

        this.btnJinjieDan = jinjieElems.getElement('btnJinjieDan');

        //粒子特效
        this.liziEffectRoot = this.elems.getElement("liziEffectRoot");
    }

    protected initListeners(): void {
        this.addListClickListener(this.list, this.onClickList);
        this.addClickListener(this.btnActivate, this.onClickBtnActive);
        this.addClickListener(this.btnOneKey, delegate(this, this.onClickBtnJinJie, 1));
        this.addClickListener(this.btnJinJie, delegate(this, this.onClickBtnJinJie, 0));
        this.addClickListener(this.btnStore, this.onClickBtnStore);
        this.addClickListener(this.btnJinjieDan, this.onClickTextCost);
    }

    protected onOpen() {
        this.updateView(true);
        //粒子特效，放init，没播放完，关闭界面，再次打开不会在播放特效
        G.ResourceMgr.loadModel(this.liziEffectRoot, UnitCtrlType.other, "effect/ui/MR_shengji.prefab", this.sortingOrder);
        this.liziEffectRoot.SetActive(false);
    }

    protected onClose() {
        this.liziEffectRoot.SetActive(false);
    }

    open(id = 0, subTab = 0) {
        this.openId = id;
        super.open();
    }

    onShenShouChange() {
        this.updateView(false);
    }

    onContainerChange(type: number) {
        if (Macros.CONTAINER_TYPE_ROLE_BAG == type) {
            this.updateView(false);
        }
    }

    private updateView(autoSelect: boolean) {
        let siXiangData = G.DataMgr.siXiangData;

        let firstCanActivateIdx = -1;
        let firstCanUpgradeIdx = -1;
        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let item = this.items[i];
            let itemData = this.itemDatas[i];
            let info = siXiangData.getShenShouInfo(i + 1);
            let stage = 0;
            let exp = 0;
            if (null != info) {
                stage = info.m_ucLevel;
                exp = info.m_uiLayer;
            }
            let activateState = EnumActivateState.none;
            let canUpgrade = false;
            let cfg = siXiangData.getCfg(i + 1, stage);
            if (stage > 0) {
                activateState = EnumActivateState.activated;
                let nextCfg = siXiangData.getCfg(cfg.m_uiSeasonID, stage + 1);
                if (null != nextCfg) {
                    if (exp < cfg.m_iLvXP) {
                        let left = cfg.m_iLvXP - exp;
                        let times = Math.ceil(left / cfg.m_iLuckyUp);
                        let need = times * cfg.m_iLuckyUp;
                        canUpgrade = 0 == G.ActionHandler.getLackNum(cfg.m_iConsumableID, need, false);
                        itemData.oneKeyNeed = need;
                    } else {
                        canUpgrade = 0 == G.ActionHandler.getLackNum(cfg.m_iByondID, cfg.m_iByondNumber, false);
                        itemData.oneKeyNeed = cfg.m_iByondNumber;
                    }
                } else {
                    canUpgrade = false;
                    itemData.oneKeyNeed = 0;
                }
            } else {
                activateState = 0 == G.ActionHandler.getLackNum(cfg.m_iActID, cfg.m_iActNumber, false) ? EnumActivateState.canActivate : EnumActivateState.cannotActivate;
            }

            itemData.activateState = activateState;
            itemData.canUpgrade = canUpgrade;
            itemData.cfg = cfg;
            itemData.stage = stage;
            itemData.exp = exp;
            item.update(itemData);

            if (firstCanActivateIdx < 0 && EnumActivateState.canActivate == activateState) {
                firstCanActivateIdx = i;
            }
            if (firstCanUpgradeIdx < 0 && canUpgrade) {
                firstCanUpgradeIdx = i;
            }
        }

        if (autoSelect) {
            let autoIdx = -1;
            if (this.openId > 0) {
                autoIdx = this.openId - 1;
            } else if (firstCanActivateIdx >= 0) {
                autoIdx = firstCanActivateIdx;
            } else if (firstCanUpgradeIdx >= 0) {
                autoIdx = firstCanUpgradeIdx;
            } else {
                autoIdx = 0;
            }
            this.list.Selected = autoIdx;
        }

        this.updateSelected();
    }

    private updateSelected() {
        let siXiangData = G.DataMgr.siXiangData;

        let selectedIndex = this.list.Selected;
        let itemData = this.itemDatas[selectedIndex];
        let cfg = itemData.cfg;
        let isStageUp = false;

        // 模型
        if (this.oldId != cfg.m_uiSeasonID) {
            this.oldId = cfg.m_uiSeasonID;
            this.textName.text = SiXiangData.Names[selectedIndex];
            G.ResourceMgr.loadModel(this.modelRootTR, UnitCtrlType.monster, cfg.m_szModelID, this.sortingOrder);
        } else {
            isStageUp = this.oldStage > 0 && itemData.stage > this.oldStage;
        }
        this.textStage.text = uts.format('{0}阶', DataFormatter.toHanNumStr(cfg.m_iSeasonLevel));

        // 属性
        let propValues: GameConfig.EquipPropAtt[] = [];
        let propMap: { [propId: number]: GameConfig.EquipPropAtt } = {};
        this.mergeProps(cfg.m_astFixProp, itemData.exp / cfg.m_iLuckyUp, propValues, propMap);
        this.mergeProps(cfg.m_astProp, 1, propValues, propMap);
        let propCnt = propValues.length;
        for (let i = 0; i < SiXiangData.MaxPropCnt; i++) {
            let propItem = this.propItems[i];
            if (i < propCnt) {
                propItem.update(propValues[i].m_ucPropId, propValues[i].m_ucPropValue);
            } else {
                propItem.update(0, 0);
            }
        }

        // 战斗力
        this.textFight.text = FightingStrengthUtil.calStrength(propValues).toString();

        // 光环属性
        this.haloItem0.update(cfg.m_astHalo[0].m_ucPropId, Math.round(cfg.m_astHalo[0].m_ucPropValue / 100), true);
        this.haloItem1.update(cfg.m_astHalo[1].m_ucPropId, Math.round(cfg.m_astHalo[1].m_ucPropValue / 100), true);

        if (itemData.stage > 0) {
            // 已激活
            this.jinjieGo.SetActive(true);
            this.activateGo.SetActive(false);
            this.slider.value = itemData.exp / cfg.m_iLvXP;
            this.textProgress.text = itemData.exp + '/' + cfg.m_iLvXP;

            let has = 0;
            let nextCfg = siXiangData.getCfg(itemData.cfg.m_uiSeasonID, itemData.stage + 1);
            if (null != nextCfg) {
                if (itemData.exp < cfg.m_iLvXP) {
                    // 继续进阶
                    this.btnJinJie.SetActive(true);
                    UIUtils.setButtonClickAble(this.btnJinJie, 0 == G.ActionHandler.getLackNum(cfg.m_iConsumableID, cfg.m_iLuckyUp, false));

                    this.textCost.text = uts.format('消耗：{0}×{1}', TextFieldUtil.getItemText(ThingData.getThingConfig(cfg.m_iConsumableID)), cfg.m_iLuckyUp);
                    this.costID = cfg.m_iConsumableID;
                    has = G.DataMgr.thingData.getThingNumInsensitiveToBind(cfg.m_iConsumableID);
                    this.labelBtnOneKey.text = '一键进阶';
                } else {
                    // 继续突破
                    this.btnJinJie.SetActive(false);

                    this.textCost.text = uts.format('消耗：{0}×{1}', TextFieldUtil.getItemText(ThingData.getThingConfig(cfg.m_iByondID)), itemData.oneKeyNeed);
                    this.costID = cfg.m_iByondID;
                    has = G.DataMgr.thingData.getThingNumInsensitiveToBind(cfg.m_iByondID);
                    this.labelBtnOneKey.text = '一键突破';
                }
                this.sliderBg.SetActive(true);
                let color = itemData.canUpgrade ? Color.GREEN : Color.WHITE;
                this.textOwn.text = uts.format('现有：{0}', TextFieldUtil.getColorText(has.toString(), color));
                this.textOwn.gameObject.SetActive(true);
            } else {
                this.btnJinJie.SetActive(false);

                this.sliderBg.SetActive(false);
                this.textCost.text = '已升至最高阶';
                this.textOwn.gameObject.SetActive(false);
                this.costID = 0;
            }
            UIUtils.setButtonClickAble(this.btnOneKey, itemData.canUpgrade);
        } else {
            // 继续激活
            this.jinjieGo.SetActive(false);
            this.activateGo.SetActive(true);
            this.materialItemData.id = cfg.m_iActID;
            this.materialItemData.need = cfg.m_iActNumber;
            this.materialItemData.has = G.DataMgr.thingData.getThingNumInsensitiveToBind(cfg.m_iActID);
            this.materialIcon.updateByMaterialItemData(this.materialItemData);
            this.materialIcon.updateIcon();
            UIUtils.setButtonClickAble(this.btnActivate, EnumActivateState.canActivate == itemData.activateState);
        }

        if (isStageUp) {
            this.playLiZiEffect();
        }
        this.oldStage = itemData.stage;
    }

    private onClickList(index: number) {
        this.liziEffectRoot.SetActive(false);
        this.updateSelected();
    }

    private onClickBtnActive() {
        let id = this.list.Selected + 1;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShenShouRequest(Macros.SHENSHOU_OP_ACT, id, id));
    }

    private onClickBtnJinJie(param: number) {
        let id = this.list.Selected + 1;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShenShouRequest(Macros.SHENSHOU_OP_UPLEVEL, id, id, param));
    }

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

    private onClickBtnStore() {
        G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.SiXiangBi);
        G.Uimgr.bindCloseCallback(MallView, FaQiView, this.id);
    }

    private onClickTextCost() {
        if (this.costID > 0) {
            let item = new IconItem();
            item.updateById(this.costID);
            G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
        }
    }
}