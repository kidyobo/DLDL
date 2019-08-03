import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { List } from 'System/uilib/List'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { ThingData } from 'System/data/thing/ThingData'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EnumGuide, GameIDType } from 'System/constants/GameEnum'
import { GetHeroEquipGuider } from 'System/guide/cases/GetHeroEquipGuider'
import { GetEquipInfo } from 'System/guide/GetEquipInfo'
import { IconItem } from 'System/uilib/IconItem'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { EffectPlayer } from "System/unit/EffectPlayer";
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"

export class GetHeroEquipView extends CommonForm {
    private readonly AutoSeconds = 0.5;

    private readonly autoTimerId = '1';
    private readonly displayTimerId = '2';

    private equipItemParent: UnityEngine.GameObject;

    private icon: IconItem;

    private mask: UnityEngine.GameObject;
    //private bkts: UnityEngine.GameObject;
    private uiEffectList: UIEffect[] = [];

    private equipIcons: IconItem[] = [];
    private targetIconData: ThingItemData;
    private targetIdx = -1;

    private m_crtEquip: GetEquipInfo;
    private canTakeOn = false;

    private leftSeconds = 0;
    private equipCount: number = 0;

    private tweenScale: Tween.TweenScale;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GetHeroEquipView;
    }

    protected onOpen() {
        if (null == this.m_crtEquip) {
            this.processAfterEquip();
        }
        if (this.m_crtEquip) {
            let equipObject = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
            for (let i = 0; i < this.equipCount; i++) {
                let icon = this.equipIcons[i];
                let equipItemData = equipObject[i];
                icon.updateByThingItemData(equipItemData);
                icon.updateEquipIcon(GameIDType.ROLE_EQUIP, 0, i);
            }
            G.ViewCacher.mainView.canvas.enabled = false;
            G.GuideMgr.processGuideNext(EnumGuide.GetHeroEquip, EnumGuide.GetHeroEquip_OpenView);
        }
    }

    protected onClose() {
        if (this.tweenScale) {
            this.tweenScale.onFinished = null;
        }
        G.ViewCacher.mainView.canvas.enabled = true;
        this.m_crtEquip = null;
        // 继续下一步引导
        G.GuideMgr.processGuideNext(EnumGuide.GetHeroEquip, EnumGuide.GuideCommon_None);

        // EffectPlayer.playFollowed(G.UnitMgr.hero.model.rotateTransform, 'other/RY_chuanzhuangbei', 2, false, false);
    }

    protected initElements(): void {
        //this.bkts = this.elems.getElement('bkts');
        this.mask = this.elems.getElement('mask');

        this.equipItemParent = this.elems.getElement('equipItemParent');

        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this.icon = new IconItem();
        this.icon.setUsualIconByPrefab(itemIcon_Normal, this.elems.getElement('icon'));

        let equipSlotIcon_Normal = this.elems.getElement('equipSlotIcon_Normal');
        let cnt = KeyWord.EQUIP_PARTCLASS_LINGBAO - KeyWord.EQUIP_PARTCLASS_MIN;
        this.equipCount = cnt;
        for (let i = 0; i < cnt; i++) {
            let item = Game.Tools.GetChild(this.equipItemParent, "item" + (i + 1));
            let newItem = Game.Tools.Instantiate(equipSlotIcon_Normal, item, false);
            let iconItem = new IconItem();
            iconItem.setUsuallyEquip(newItem);
            iconItem.showBg = true;
            this.equipIcons.push(iconItem);
        }
    }

    protected initListeners(): void {
        //this.addClickListener(this.btnEquip, this.onClickBtnEquip);
    }

    private onClickBtnEquip() {
        // 先把装备穿上
        if (this.canTakeOn && this.m_crtEquip) {
            // 理论上 this.m_crtEquip 不可能是null，但某些情况下不知道什么原因导致报错，故判空
            let itemData = G.DataMgr.thingData.getBagItemByGuid(this.m_crtEquip.id, this.m_crtEquip.guid);
            if (null != itemData) {
                G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data);
                // 显示装备列表
                let equipObject = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
                let cfg = ThingData.getThingConfig(this.m_crtEquip.id);
                let cnt = this.equipCount;
                let flyTo: UnityEngine.Vector3;
                for (let i = 0; i < cnt; i++) {
                    let icon = this.equipIcons[i];
                    let equipItemData = equipObject[i];
                    icon.updateByThingItemData(equipItemData);
                    icon.updateEquipIcon(GameIDType.ROLE_EQUIP, 0, i);
                    if (cfg.m_iEquipPart - KeyWord.EQUIP_PARTCLASS_MIN == i) {
                        this.targetIconData = itemData;
                        this.targetIdx = i;
                        flyTo = icon.iconRoot.transform.position;
                    }
                }

                if (null != flyTo) {
                    this.removeTimer(this.autoTimerId);


                    // 飞装备图标过去
                    let icon = UnityEngine.GameObject.Instantiate(this.icon.iconRoot, this.form.transform, true) as UnityEngine.GameObject;
                    Tween.TweenPosition.Begin(icon, 1, flyTo, true);
                    this.tweenScale = Tween.TweenScale.Begin(icon, 1, new UnityEngine.Vector3(0.5, 0.5, 0.5));
                    this.tweenScale.onFinished = delegate(this, this.onFinished, icon);
                    return;
                }
            }
        }

        this.processAfterEquip();
    }

    private onFinished(gameObject) {
        UnityEngine.GameObject.Destroy(gameObject);
        let icon = this.equipIcons[this.targetIdx];
        icon.updateByThingItemData(this.targetIconData);
        icon.updateIcon();

        let index = this.targetIdx;
        //let effect = this.uiEffectList[index];
        //if (!effect) {
        //    effect = this.uiEffectList[index] = new UIEffect();
        //    effect.setEffectPrefab(this.bkts, icon.gameObject);
        //}
        //effect.playEffect(EffectType.Effect_Normal, true, 0.7);

        this.addTimer(this.displayTimerId, 1000, 1, this.onDisplayTimer);
    }

    private onDisplayTimer(timer: Game.Timer) {
        this.processAfterEquip();
    }

    private processAfterEquip() {
        // 检查是否还有装备要显示
        let equip: GetEquipInfo;
        let guider = G.GuideMgr.getCurrentGuider(EnumGuide.GetHeroEquip) as GetHeroEquipGuider;
        if (null != guider) {
            equip = guider.getNextEquip();
        }
        if (null != equip) {
            this._updateView(equip);
        }
        else {
            // 取消任务聚焦
            this.close();
        }
    }

    private _updateView(equip: GetEquipInfo): void {
        this.m_crtEquip = equip;
        let equipObj = G.DataMgr.thingData.getBagItemByGuid(equip.id, equip.guid);
        if (null == equipObj) {
            this.processAfterEquip();
            return;
        }

        // 图标
        this.icon.updateByThingItemData(equipObj);
        this.icon.updateIcon();

        // 确定是否可穿戴
        this.canTakeOn = G.ActionHandler.canTakeOnEquip(equipObj.data, 0, false);

        this.addTimer(this.autoTimerId, 1000, this.AutoSeconds, this.onAutoTimer);
        this.leftSeconds = this.AutoSeconds;
    }

    private onAutoTimer(timer: Game.Timer) {
        this.leftSeconds -= timer.CallCountDelta;

        if (this.leftSeconds <= 0) {
            this.onclickBtnReturn();
        }
    }

    private onclickBtnReturn() {
        let autoWear = false;
        if (null != this.m_crtEquip && this.canTakeOn) {
            // 主角装备如果身上没穿这个部位的则强制穿上，其他装备一概不自动穿
            if (GameIDUtil.isRoleEquipID(this.m_crtEquip.id)/* && null == G.DataMgr.thingData.getWearedEquip(this.m_crtEquip.id, 0)*/) {
                autoWear = true;
            }
        }
        if (autoWear) {
            this.onClickBtnEquip();
        } else {
            this.processAfterEquip();
        }
    }
}