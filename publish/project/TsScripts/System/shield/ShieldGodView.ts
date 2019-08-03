import { UIPathData } from 'System/data/UIPathData'
import { CommonForm, UILayer, TextGetSet, GameObjectGetSet } from "System/uilib/CommonForm";
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { HeroAttItemData } from 'System/hero/HeroAttItemData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { UIUtils } from 'System/utils/UIUtils'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ThingData } from 'System/data/thing/ThingData'
import { PropUtil } from 'System/utils/PropUtil'
import { HeroRule } from 'System/hero/HeroRule'
import { IconItem } from 'System/uilib/IconItem'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { AchievementData } from 'System/data/AchievementData'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'
import { TipFrom } from 'System/tip/view/TipsView'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { ZhufuData } from 'System/data/ZhufuData'
import { ShieldGodData } from 'System/data/ShieldGodData'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { PetPropItem } from 'System/pet/view/PetPropItem'
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'

enum EnumShieldShowType {
    unit = 0, 
    buff, 
}

class ShieldGodItem extends ListItemCtrl {

    /**item背景图*/
    private itemBack: GameObjectGetSet;
    /**神盾名字*/
    private textName: TextGetSet;
    private txtLv: TextGetSet;
    /**神盾对应的icon图片*/
    private icon: UnityEngine.UI.RawImage;
    private iconGo: GameObjectGetSet;
    /**神盾是否出战*/
    private isBattle: GameObjectGetSet;
    /**神盾是否可激活图标*/
    private isActivate: GameObjectGetSet;
    /**可提升箭头*/
    private arrow: GameObjectGetSet;
    private cfg: GameConfig.ShieldGodCfgM;

    setComponents(go: UnityEngine.GameObject) {
        this.textName = new TextGetSet(ElemFinder.findText(go, "content/txtName"));
        this.txtLv = new TextGetSet(ElemFinder.findText(go, "content/txtLv"));
        this.icon = ElemFinder.findRawImage(go, "content/icon");
        this.iconGo = new GameObjectGetSet(this.icon.gameObject);
        this.isBattle = new GameObjectGetSet(ElemFinder.findObject(go, "iswearing"));
        this.isActivate = new GameObjectGetSet(ElemFinder.findObject(go, "active"));
        this.itemBack = new GameObjectGetSet(ElemFinder.findObject(go, "content/bg"));
        this.arrow = new GameObjectGetSet(ElemFinder.findObject(go, "arrow"));
    }

    update(id: number, info: Protocol.ShieldGodInfo, isFighting: boolean) {
        let data = G.DataMgr.shieldGodData;
        let lv = 1;
        let status = 0;
        if (info) {
            lv = info.m_shLv;
            status = info.m_ucStatus;
        }
        this.cfg = data.getCfg(id, lv > 0 ? lv : data.maxLv);
        this.textName.text = this.cfg.m_szName;

        this.txtLv.text = lv > 0 ? uts.format('{0}阶', ZhufuData.getZhufuStage(lv, KeyWord.BAR_FUNCTION_SHIELDGOD)) : "";
        G.ResourceMgr.loadImage(this.icon, uts.format('images/shield/{0}.png', id));
        this.isBattle.SetActive(isFighting);
        this.itemBack.grey = status != Macros.GOD_LOAD_AWARD_DONE_GET;
        this.iconGo.grey = status != Macros.GOD_LOAD_AWARD_DONE_GET;
        //判断是否可以激活并显示
        this.isActivate.SetActive(status == Macros.GOD_LOAD_AWARD_WAIT_GET);
        //是否可以提升等级或技能
        this.arrow.SetActive(status == Macros.GOD_LOAD_AWARD_DONE_GET && data.canUpLevel(id));
    }

    get Cfg(): GameConfig.ShieldGodCfgM {
        return this.cfg;
    }
}

export class ShieldGodView extends CommonForm {
    private readonly FightCdKey = 'FightCd';

    /**自动强化时间间隔*/
    private readonly deltaTime: number = 100;
    //------------------面板左侧神盾List相关-----------------//
    private list: List = null;
    //-------------------公用属性面板---------------------------//
    private propItems: PetPropItem[] = [];
    //------------------属性面板激活面板------------------------//
    private activatePanel: UnityEngine.GameObject;
    private btnActivate: UnityEngine.GameObject;
    private textActivateCond: UnityEngine.UI.Text;
    //------------------属性面板进阶面板------------------------//
    private jinjiePanel: UnityEngine.GameObject;
    private btnEnhance: UnityEngine.GameObject;
    private btnAutoEnhance: UnityEngine.GameObject;
    private labelBtnAuto: UnityEngine.UI.Text;
    private toggleAutoBuy: UnityEngine.UI.ActiveToggle;
    private m_isAuto: boolean = false;
    private textJinJieCost: UnityEngine.UI.Text;
    private textJinJieOwn: UnityEngine.UI.Text;
    private textZhuFuProgress: UnityEngine.UI.Text;
    private posEffectTarget: UnityEngine.Transform;
    private zfslider: UnityEngine.UI.Slider;
    private levelObjects: UnityEngine.GameObject[] = [];
    private levelObjectsActive: boolean[] = [];
    private rideEfects: UIEffect[] = [];
    //-----------------------面板中间------------------------------//
    private modelTab: UnityEngine.UI.ActiveToggleGroup;
    private textZdl: UnityEngine.UI.Text;
    private modelRoot: UnityEngine.GameObject;
    private buffRoot: UnityEngine.GameObject;
    //消耗品文本添加tip
    private jinjieTip: UnityEngine.GameObject;

    // 强化特效
    private newDianRoot: UnityEngine.GameObject;
    // 粒子特效
    private liziEffectRoot: UnityEngine.GameObject;
    private textName: UnityEngine.UI.Text;
    private textLvGetSet: TextGetSet;
    private btnFight: UnityEngine.GameObject;
    private btnRecord: UnityEngine.GameObject;

    private labelBtnFight: UnityEngine.UI.Text;

    private listItems: ShieldGodItem[] = [];
    private openId = 0;
    private m_oldSelectedId = -1;
    private oldModelId = -1;
    private oldBuffId = -1;
    private oldModelType = -1;
    private m_autoTime: number = 0;
    private m_waitBagChangeAuto = false;
    private m_currentConfig: GameConfig.ShieldGodCfgM;
    private m_costData: MaterialItemData = new MaterialItemData();
    private m_selectID: number = 0;
    private m_oldLucky = -1;
    private fightCdLeft = 0;

    constructor() {
        super(KeyWord.BAR_FUNCTION_SHIELDGOD);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.ShieldGodView;
    }

    protected initElements() {
        // 左侧List
        this.list = this.elems.getUIList("list");
        let data = G.DataMgr.shieldGodData;
        let itemCnt = data.ids.length;
        this.list.Count = itemCnt;
        for (let i = 0; i < itemCnt; i++) {
            let item = new ShieldGodItem();
            item.setComponents(this.list.GetItem(i).gameObject);
            this.listItems.push(item);
        }

        this.modelTab = this.elems.getToggleGroup('modelTab');
        this.textName = this.elems.getText("textName");
        this.textLvGetSet = new TextGetSet(this.elems.getText("textLv"));
        //神盾显示位置
        this.modelRoot = this.elems.getElement("modelRoot");
        this.buffRoot = this.elems.getElement("buffRoot");
        //粒子特效
        this.liziEffectRoot = this.elems.getElement("liziEffectRoot");
        //出战按钮
        this.btnFight = this.elems.getElement("btnFight");
        this.btnRecord = this.elems.getElement("btnRecord");

        this.labelBtnFight = ElemFinder.findText(this.btnFight, 'Text');
        // 激活面板相关
        this.activatePanel = this.elems.getElement("activatePanel");
        let activateElems = this.elems.getUiElements('activatePanel');
        this.btnActivate = activateElems.getElement("btnActivate");
        this.textActivateCond = activateElems.getText("textActivateCond");
        // 属性面板公用部分
        this.textZdl = this.elems.getText('textZdl');
        let props = this.elems.getElement('props');
        for (let i = 0; i < ShieldGodData.MaxPropCnt; i++) {
            let itemGo = ElemFinder.findObject(props, i.toString());
            let item = new PetPropItem();
            item.setUsual(itemGo);
            this.propItems.push(item);
        }
        // 进阶面板
        this.jinjiePanel = this.elems.getElement("jinjiePanel");
        let jinjieElems = this.elems.getUiElements('jinjiePanel');
        this.btnEnhance = jinjieElems.getElement("btnEnhance");
        this.btnAutoEnhance = jinjieElems.getElement('btnAutoEnhance');
        this.labelBtnAuto = ElemFinder.findText(this.btnAutoEnhance, "Text");
        this.toggleAutoBuy = jinjieElems.getActiveToggle("toggleAutoBuy");
        this.textJinJieCost = jinjieElems.getText("textJinJieCost");
        this.textJinJieOwn = jinjieElems.getText('textJinJieOwn');
        this.textZhuFuProgress = jinjieElems.getText('textZhuFuProgress');
        this.posEffectTarget = this.textZhuFuProgress.transform;
        this.jinjieTip = jinjieElems.getElement("jinjieTip");
        this.zfslider = jinjieElems.getSlider("zfslider");
        this.newDianRoot = this.elems.getElement("newDianRoot");
        this.newDianRoot.SetActive(false);
        // 添加特效
        let stars = jinjieElems.getTransform('stars');
        let effectPrefab = jinjieElems.getElement("buleBoomEffect");
        for (let i = 0; i < ShieldGodData.StepPerEnhance; i++) {
            let effect = new UIEffect();
            let item = Game.Tools.GetChild(stars, i.toString());
            effect.setEffectPrefab(effectPrefab, item);
            this.levelObjects[i] = item;
            this.levelObjectsActive[i] = true;
            this.rideEfects[i] = effect;
        }
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('btnReturn'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addListClickListener(this.list, this.onClickList);
        this.addToggleGroupListener(this.modelTab, this.onModelTabChange);
        this.addClickListener(this.btnFight, this.onBtnFightClick);
        this.addClickListener(this.btnRecord, this.onBtnRecordClick);

        this.addClickListener(this.btnActivate, this.onBtnActiveClick);
        this.addClickListener(this.btnEnhance, this.onBtnEnhanceClick);
        this.addClickListener(this.btnAutoEnhance, this.onBtnAutoClick);
        this.addClickListener(this.jinjieTip, this.onClickJinJieTip);
    }

    open(id = 0) {
        this.openId = id;
        super.open();
    }

    protected onOpen() {
        //粒子特效，放init，没播放完，关闭界面，再次打开不会在播放特效
        this.liziEffectRoot.SetActive(false);
        G.ResourceMgr.loadModel(this.liziEffectRoot, UnitCtrlType.other, "effect/ui/MR_shengji.prefab", this.sortingOrder);

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShieldGodRequest(0, Macros.SHIELDGOD_OP_LIST));

        let data = G.DataMgr.shieldGodData;
        if (this.openId == 0) {
            let crtShieldId = data.CrtShieldId;
            if (crtShieldId == 0) {
                let canJiHuoId = data.getCanActivateId();
                if (canJiHuoId > 0) {
                    this.openId = canJiHuoId;
                } else {
                    this.openId = data.ids[0];
                }
            } else {
                this.openId = crtShieldId;
            }
        }

        let selectedIndex = data.ids.indexOf(this.openId);
        this.list.Selected = selectedIndex;
        this.list.ScrollByAxialRow(selectedIndex);
        this.updateView(false);
    }

    protected onClose() {
        this.m_isAuto = false;
        this.liziEffectRoot.SetActive(false);
        this.newDianRoot.SetActive(false);
        for (let i = 0; i < ShieldGodData.StepPerEnhance; i++) {
            this.rideEfects[i].stopEffect();
        }
    }

    onShieldGodResp(resp: Protocol.ShieldGodOperate_Response) {
        this.updateView(resp.m_iType == Macros.SHIELDGOD_OP_UPLEVEL);
    }

    private updateView(byJinJieResp: boolean) {
        let data = G.DataMgr.shieldGodData;
        let itemCnt = data.ids.length;
        for (let i = 0; i < itemCnt; i++) {
            let item = this.listItems[i];
            let id = data.ids[i];
            item.update(id, data.getShieldInfo(id), data.CrtShieldId == data.ids[i]);
        }
        this.updateCurrentSelect(byJinJieResp);
    }

    /**背包改变*/
    onContainerChange(type: number): void {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.m_waitBagChangeAuto = false;
            this.updateView(false);
        }
    }

    private onClickList(index: number): void {
        this.liziEffectRoot.SetActive(false);
        this.updateCurrentSelect(false);
    }

    /**更新当前显示*/
    private updateCurrentSelect(byJinJieResp: boolean) {
        //点击左侧神盾刷新界面数据
        let index = this.list.Selected;
        if (index < 0) {
            return;
        }

        let cfg = this.listItems[index].Cfg;
        if (!cfg) {
            return;
        }
        this.m_selectID = cfg.m_iType;
        let data = G.DataMgr.shieldGodData;
        let oneInfo = data.getShieldInfo(this.m_selectID);
        let lv = 0;
        let luckyValue = 0;
        let status = 0;
        let doneCnt = 0;
        let deadTime = 0;
        if (oneInfo != null) {
            lv = oneInfo.m_shLv;
            luckyValue = oneInfo.m_iLuckValue;
            status = oneInfo.m_ucStatus;
            doneCnt = oneInfo.m_uiDoneCount;
            deadTime = oneInfo.m_uiDeadTime;
        }
        if (lv == 0) {
            // 如果未激活，则展示最高阶的
            lv = data.maxLv;
        }
        this.m_currentConfig = data.getCfg(this.m_selectID, lv);
        this.textName.text = this.m_currentConfig.m_szName;
        if (status == Macros.GOD_LOAD_AWARD_DONE_GET) {
            this.activatePanel.SetActive(false);
            this.jinjiePanel.SetActive(true);

            let isFighting = this.m_selectID == data.CrtShieldId;
            this.btnFight.SetActive(!isFighting);
            if (!isFighting) {
                let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
                if (deadTime > 0 && now - deadTime < this.m_currentConfig.m_uiDeadCD) {
                    this.addTimer(this.FightCdKey, 1000, now - deadTime, this.onFightCdTimer);
                    this.fightCdLeft = this.m_currentConfig.m_uiDeadCD - now + deadTime;
                    this.labelBtnFight.text = uts.format('出战({0})', this.fightCdLeft);
                    UIUtils.setButtonClickAble(this.btnFight, false);
                } else {
                    this.removeTimer(this.FightCdKey);
                    this.labelBtnFight.text = '出战';
                    UIUtils.setButtonClickAble(this.btnFight, true);
                }
            } else {
                this.removeTimer(this.FightCdKey);
            }

            let starCnt = 0;
            if (lv == data.maxLv) {
                starCnt = ShieldGodData.StepPerEnhance;
            }
            else {
                starCnt = (lv - 1) % 10;
            }
            for (let i = 0; i < ShieldGodData.StepPerEnhance; i++) {
                let active = i < starCnt;
                if (this.levelObjectsActive[i] != active) {
                    this.levelObjectsActive[i] = active;
                    this.levelObjects[i].SetActive(active);
                }
            }

            let isUpgraded = byJinJieResp && ((luckyValue == 0 && starCnt == 0) || lv == data.maxLv);
            if (byJinJieResp) {
                //this.playNewDianEffect();
                let tipStr: string;
                if (luckyValue == 0) {
                    if (isUpgraded) {
                        tipStr = "升阶成功!!";
                        this.addEffect(9);
                        //进阶成功播放粒子特效
                        G.AudioMgr.playJinJieSucessSound();
                        this.playLiZiEffect();
                    }
                    else {
                        tipStr = "强化成功!!";
                        this.addEffect(starCnt - 1);
                        this.playNewDianEffect();
                    }
                }
                else {
                    let delta = luckyValue - this.m_oldLucky;
                    if (delta > 0) {
                        tipStr = uts.format('祝福值+{0}', delta);
                    }
                }
                if (luckyValue - this.m_oldLucky > 0 || luckyValue == 0) {
                    G.TipMgr.addPosTextMsg(tipStr, Color.GREEN, this.posEffectTarget, 0, 10);
                }
            }

            let nextConfig = data.getCfg(this.m_selectID, lv + 1);
            if (nextConfig != null) {
                this.m_costData.id = nextConfig.m_iUpItemID;
                this.m_costData.need = nextConfig.m_iUpItemNum;
                let consumableConfig = ThingData.getThingConfig(nextConfig.m_iUpItemID);
                this.textJinJieCost.text = uts.format('{0}×{1}', TextFieldUtil.getItemText(consumableConfig), this.m_costData.need);
                this.textZhuFuProgress.text = "祝 福 值 : " + luckyValue.toString() + "/" + nextConfig.m_iLuckvalue;
                this.zfslider.value = luckyValue / nextConfig.m_iLuckvalue;
                //自动强化的逻辑
                if (this.m_isAuto) {
                    if ((this.m_oldSelectedId >= 0 && this.m_oldSelectedId != this.m_selectID) || isUpgraded || this.m_costData.id == 0) {
                        this.stopAuto();
                    } else {
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
                    UIUtils.setButtonClickAble(this.btnEnhance, this.m_costData.id > 0);
                    UIUtils.setButtonClickAble(this.btnAutoEnhance, this.m_costData.id > 0);
                }
            }
            else {
                this.textZhuFuProgress.text = "已 满 级";
                this.zfslider.value = 1;
                this.textJinJieCost.text = "";
                UIUtils.setButtonClickAble(this.btnEnhance, false);
                UIUtils.setButtonClickAble(this.btnAutoEnhance, false);
                this.stopAuto();
            }
        }
        else {
            this.activatePanel.SetActive(true);
            this.jinjiePanel.SetActive(false);
            this.removeTimer(this.FightCdKey);
            this.btnFight.SetActive(false);
            /////////////////此处可能有问题/////////////////////////
            this.textActivateCond.text = AchievementData.getQuestStr(this.m_currentConfig.m_iActID, oneInfo.m_uiDoneCount);
            if (oneInfo.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET) {
                //激活按钮置灰
                UIUtils.setButtonClickAble(this.btnActivate, true);
            }
            else {
                UIUtils.setButtonClickAble(this.btnActivate, false);
            }
            this.stopAuto();
        }
        let fight = 0;
        for (let i: number = 0; i < ShieldGodData.MaxPropCnt; i++) {
            if (i < this.m_currentConfig.m_astProp.length) {
                fight += FightingStrengthUtil.calStrengthByOneProp(this.m_currentConfig.m_astProp[i].m_ucPropId, this.m_currentConfig.m_astProp[i].m_ucPropValue);
            }
        }
        this.textZdl.text = fight.toString();
        this.updateAttList();
        this.updateBagInfo(Macros.CONTAINER_TYPE_ROLE_BAG);
        if (this.m_oldSelectedId != this.m_selectID) {
            //加载神盾模型
            this.updateModel();
        }
        this.textLvGetSet.text = DataFormatter.toHanNumStr(ZhufuData.getZhufuStage(lv, KeyWord.BAR_FUNCTION_SHIELDGOD)) + '阶';
        this.m_oldSelectedId = this.m_selectID;
    }

    private onFightCdTimer(timer: Game.Timer) {
        this.fightCdLeft -= timer.CallCountDelta;
        if (this.fightCdLeft > 0) {
            this.labelBtnFight.text = uts.format('出战({0})', this.fightCdLeft);
        } else {
            this.labelBtnFight.text = '出战';
            UIUtils.setButtonClickAble(this.btnFight, true);
        }
    }

    private addEffect(index: number): void {
        let effect = this.rideEfects[index];
        effect.playEffect(EffectType.Effect_Normal);
        G.AudioMgr.playStarBombSucessSound();
    }

    private updateModel() {
        let t = this.modelTab.Selected;
        if (this.m_selectID > 0 && (this.oldModelType != t || (this.m_selectID != this.oldModelId && t == EnumShieldShowType.unit) || (this.m_selectID != this.oldBuffId && t == EnumShieldShowType.buff))) {
            if (EnumShieldShowType.buff == t) {
                G.ResourceMgr.loadModel(this.buffRoot, UnitCtrlType.buff, uts.format('shield{0}', this.m_currentConfig.m_iType), this.sortingOrder);
            } else {
                G.ResourceMgr.loadModel(this.modelRoot, UnitCtrlType.shieldGod, this.m_currentConfig.m_iType.toString(), this.sortingOrder);
            }
            if (this.oldModelType != t) {
                this.modelRoot.SetActive(EnumShieldShowType.unit == t);
                this.buffRoot.SetActive(EnumShieldShowType.buff == t);
            }
            this.oldModelType = t;
        }
    }

    /**更新属性列表*/
    private updateAttList(): void {
        let cnt = this.m_currentConfig.m_astProp.length;
        for (let i = 0; i < ShieldGodData.MaxPropCnt; i++) {
            let propItem = this.propItems[i];
            if (i < cnt) {
                let p = this.m_currentConfig.m_astProp[i];
                propItem.update(p.m_ucPropId, p.m_ucPropValue);
            } else if (i == cnt) {
                // 显示护盾比例
                propItem.updateByNameAndValue('护盾', Math.floor(this.m_currentConfig.m_iShieldRatio / 100), true);
            } else if (i == cnt + 1) {
                propItem.updateByNameAndValue('减伤', Math.floor(this.m_currentConfig.m_iInjuryRaito / 100), true);
            } else {
                propItem.update(0, 0);
            }
        }
    }

    private onModelTabChange(index: number) {
        this.updateModel();
    }

    ///////////////////////////////////////// 事件处理 ////////////////////////////////////////////

    /**点击开始进阶按钮*/
    private onBtnEnhanceClick(): void {
        if (this.m_costData.id == 0) {
            return;
        }
        if (this.m_costData.has >= this.m_costData.need) {
            this.m_waitBagChangeAuto = true;
            this.requestUpLv();
        }
        else if (this.toggleAutoBuy.isOn) {
            let num: number = this.m_costData.need - this.m_costData.has;
            let info = G.ActionHandler.checkAutoBuyInfo(this.m_costData.id, num, true);
            if (info.isAffordable) {
                if (num < this.m_costData.need) {
                    this.m_waitBagChangeAuto = true;
                }
                this.requestUpLv();
                return;
            }
            this.stopAuto();
        }
        else {
            this.stopAuto();
            if (this.m_currentConfig.m_shLv >= ThingData.minLvOpenBatBuyViwe) {
                G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.m_costData.id, 1);
            } else {
                G.TipMgr.addMainFloatTip("材料不足");
            }
        }
    }

    private requestUpLv() {
        let oneInfo = G.DataMgr.shieldGodData.getShieldInfo(this.m_selectID);
        if (!oneInfo) {
            return;
        }
        this.m_oldLucky = oneInfo.m_iLuckValue;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShieldGodRequest(this.m_selectID, Macros.SHIELDGOD_OP_UPLEVEL));
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
            UIUtils.setButtonClickAble(this.btnEnhance, false);
            this.labelBtnAuto.text = '停止进阶';
            this.onBtnEnhanceClick();
        }
    }

    private stopAuto(): void {
        if (this.m_isAuto) {
            this.removeTimer('temp');
            this.m_isAuto = false;
            let btStage: boolean = (this.m_costData.id != 0);
            UIUtils.setButtonClickAble(this.btnEnhance, btStage);
            UIUtils.setButtonClickAble(this.btnAutoEnhance, btStage);
            this.labelBtnAuto.text = '自动进阶';
            this.m_autoTime = 0;
            this.m_oldSelectedId = -1;
        }
    }

    private onBtnActiveClick(): void {
        //点击激活按钮
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShieldGodRequest(this.m_selectID, Macros.SHIELDGOD_OP_ACT));
    }

    private onBtnFightClick(): void {
        //点击出战按钮
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShieldGodRequest(this.m_selectID, Macros.SHIELDGOD_OP_CHANGE));
    }

    protected onBtnRecordClick() {
        //玩法说明按钮
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(462), '玩法说明');
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

    private onTimer(time: Game.Timer): void {
        this.m_autoTime = UnityEngine.Time.realtimeSinceStartup;
        this.onBtnEnhanceClick();
    }

    /**刷新现有材料*/
    private updateBagInfo(type: number): void {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            if (this.m_costData.id > 0) {
                this.m_costData.has = G.DataMgr.thingData.getThingNum(this.m_costData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                let color: string = this.m_costData.has < this.m_costData.need ? Color.WHITE : Color.GREEN;
                this.textJinJieOwn.text = TextFieldUtil.getColorText(this.m_costData.has.toString(), color);
            }
            else {
                this.textJinJieOwn.text = "";
            }
        }
    }

    private onClickJinJieTip() {
        let iconItem = new IconItem();
        iconItem.updateById(this.m_costData.id);
        G.ViewCacher.tipsView.open(iconItem.getTipData(), TipFrom.normal);
    }
}