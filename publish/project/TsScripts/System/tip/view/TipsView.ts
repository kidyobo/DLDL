import { Global as G } from "System/global"
import { NestedForm } from 'System/uilib/NestedForm'
import { UILayer } from 'System/uilib/CommonForm'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ITipData } from 'System/tip/tipData/ITipData'
import { ItemTipView } from "System/tip/view/ItemTipView"
import { SkillTipView } from "System/tip/view/SkillTipView"
import { TextTipView } from "System/tip/view/TextTipView"
import { UIPathData } from "System/data/UIPathData"
import { TipType } from "System/constants/GameEnum";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { IconItem } from "System/uilib/IconItem";
import { ItemTipData } from "System/tip/tipData/ItemTipData";
import { SkillTipData } from "System/tip/tipData/SkillTipData";
import { TextTipData } from "System/tip/tipData/TextTipData";
import { ThingData } from 'System/data/thing/ThingData'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { Macros } from 'System/protocol/Macros'
import { PetData } from 'System/data/pet/PetData'
import { GuidUtil } from 'System/utils/GuidUtil'
import { VipView } from 'System/vip/VipView'
import { HeroView } from 'System/hero/view/HeroView'
import { PropertyView } from 'System/hero/view/PropertyView'
import { KeyWord } from "System/constants/KeyWord"


export enum EnumTipChid {
    left = 1,
    right,
    skill,
    text,
}

export enum TipFrom {
    /**非法*/
    none = 0,
    /**普通tip，不带任何操作按钮*/
    normal,
    /**背包中物品*/
    bag,
    /**聊天*/
    chat,
    /**从仓库取出*/
    takeOut,
    /**放入仓库*/
    putIn,
    /**装备脱下*/
    takeOff,
    /**装备升级面板*/
    equip,
    /**材料*/
    material,
    /**宗门仓库里的物品*/
    guildStore,
    /**探宝仓库*/
    tanbao,
    /**星斗仓库*/
    starStore,
    /**身上穿有装备,替换 弹出背包装备面板*/
    replace_1,
    /**背景透明 暂时只在属性界面使用的 */
    lucency,
    get,
}

export class TipsView extends NestedForm {
    private tipFrom: TipFrom;
    private tipData: ITipData;
    /**身上穿的装备tip数据，用于对比*/
    private wearedEquipData: ItemTipData;

    private wearedIconItem: IconItem = new IconItem();
    private thingItemData: ThingItemData = new ThingItemData();

    private mask: UnityEngine.GameObject;
    private maskA: UnityEngine.GameObject;
    private maskImg: UnityEngine.UI.Image;
    private maskParent: UnityEngine.Transform;

    private left: UnityEngine.GameObject;
    private right: UnityEngine.GameObject;
    private skill: UnityEngine.GameObject;
    private text: UnityEngine.GameObject;

    private lefttip: ItemTipView;
    righttip: ItemTipView;
    skillTip: SkillTipView;
    private textTip: TextTipView;
    /**标记是否要拿下一强化等级相关数据或配置*/
    private isGetNextStreng: boolean = false;
    /**标记是否要拿下一等级相关数据或配置*/
    private isGetNextPartLv: boolean = false;
    private tag: number = 0;
    private num: number = 0;
    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.OnlyTip;
    }

    protected resPath(): string {
        return UIPathData.TipsView;
    }

    open(tipData: ITipData, tipFrom: TipFrom, isGetNextStreng: boolean = false, isGetNextPartLv: boolean = false, tag: number = 0, num: number = 0) {
        this.tipData = tipData;
        this.tipFrom = tipFrom;
        this.tag = tag;
        this.num = num;

        this.isGetNextStreng = isGetNextStreng;
        this.isGetNextPartLv = isGetNextPartLv;
        if (TipFrom.lucency == this.tipFrom) {
            //把关闭的那个半透明的调整一下层级，改一下颜色
            this.mask.SetActive(false);
            this.maskA.SetActive(true);

            let propview = G.Uimgr.getSubFormByID<PropertyView>(HeroView, KeyWord.OTHER_FUNCTION_HEROPROPERTY);
            if (propview != null && propview.isOpened) {
                this.maskA.transform.SetParent(propview.SelfForm.transform);
                this.maskA.transform.SetSiblingIndex(1);
            }
        }
        super.open();
    }

    protected onOpen() {
        this.setVipOrderLayer();
        this.wearedEquipData = null;
        if (TipType.ITEM_TIP == this.tipData.tipDataType) {
            // 物品tip需要检查是否需要对比
            let itemTipData = this.tipData as ItemTipData;
            this.thingItemData.config = itemTipData.configData;
            this.thingItemData.data = itemTipData.thingInfo;
            this.thingItemData.containerID = itemTipData.containerID;
            if (Macros.CONTAINER_TYPE_GUILDSTORE != itemTipData.containerID) {
                if (G.DataMgr.thingData.checkIsWaring(this.thingItemData, itemTipData.petOrZhufuId)) {
                    itemTipData.isWearing = true;
                    itemTipData.isDuibi = false;
                } else {
                    itemTipData.isWearing = false;
                    // 不是身上穿的，检查身上是否穿了同类装备
                    if (itemTipData.configData) {
                        let weared = G.DataMgr.thingData.getWearedEquip(itemTipData.configData.m_iID, itemTipData.petOrZhufuId);
                        if (null != weared) {
                            this.wearedIconItem.updateByThingItemData(weared);
                            let wearedItemTipData = this.wearedIconItem.getTipData() as ItemTipData;
                            wearedItemTipData.isWearing = true;
                            this.wearedEquipData = wearedItemTipData;
                            itemTipData.isDuibi = true;
                        }
                    }
                }
            }
        }

        if (null != this.wearedEquipData) {
            // 显示装备对比tip
            this.maskImg.raycastTarget = true;
            this.skill.SetActive(false);
            this.text.SetActive(false);
            this.lefttip.open(this.wearedEquipData, TipFrom.normal, this.isGetNextStreng, this.isGetNextPartLv);
            this.left.SetActive(true);
            this.righttip.open(this.tipData as ItemTipData, this.tipFrom, this.isGetNextStreng, this.isGetNextPartLv, this.tag, this.num);
            this.right.SetActive(true);
        } else {
            // 显示单个tip
            this.left.SetActive(false);
            if (TipType.ITEM_TIP == this.tipData.tipDataType) {
                // 物品tip
                this.maskImg.raycastTarget = true;
                this.skill.SetActive(false);
                this.text.SetActive(false);
                this.righttip.open(this.tipData as ItemTipData, this.tipFrom, this.isGetNextStreng, this.isGetNextPartLv, this.tag, this.num);
                this.right.SetActive(true);
            } else if (TipType.SKILL_TIP == this.tipData.tipDataType) {
                // 技能tip
                this.maskImg.raycastTarget = true;
                this.right.SetActive(false);
                this.text.SetActive(false);
                this.skillTip.open(this.tipData as SkillTipData);
                this.skill.SetActive(true);
            } else if (TipType.TEXT_TIP == this.tipData.tipDataType) {
                // 文本tip
                this.maskImg.raycastTarget = true;
                this.right.SetActive(false);
                this.skill.SetActive(false);
                this.textTip.open(this.tipData as TextTipData);
                this.text.SetActive(true);
            }
        }
    }

    protected onClose() {
    }

    protected initElements(): void {
        this.mask = this.elems.getElement('mask');
        this.maskA = this.elems.getElement("maskA");
        this.maskImg = ElemFinder.findImage(this.form, 'mask');
        this.maskParent = this.mask.transform.parent;

        this.left = this.elems.getElement('left');
        this.right = this.elems.getElement('right');
        this.skill = this.elems.getElement('skill');
        this.text = this.elems.getElement('text');

        this.lefttip = this.createChildForm<ItemTipView>(ItemTipView, EnumTipChid.left, false, 'left');
        this.righttip = this.createChildForm<ItemTipView>(ItemTipView, EnumTipChid.right, false, 'right');

        this.skillTip = this.createChildForm<SkillTipView>(SkillTipView, EnumTipChid.skill, false, 'skill');

        this.textTip = this.createChildForm<TextTipView>(TextTipView, EnumTipChid.text, false, 'text');

        this.mask.SetActive(true);
        this.maskA.SetActive(false);
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickMask);
        this.addClickListener(this.maskA, this.onClickMask);
    }

    /**Vip商城的物品Tips判断(注:Vip的面板比tips层级高，导致tips显示会被遮挡住)*/
    private setVipOrderLayer() {
        let vipiew = G.Uimgr.getForm<VipView>(VipView);
        if (vipiew != null) {
            this.canvas.sortingOrder = vipiew.canvas.sortingOrder + 10; //canvas层级设置
            this.form.transform.localPosition = G.getCacheV3(0, 0, -10000);
        }
        else {
            this.form.transform.localPosition = G.getCacheV3(0, 0, 0);
        }
    }

    private onClickMask() {
        if (!this.mask.activeSelf) {
            this.mask.SetActive(true);
            this.maskA.SetActive(false);
            this.maskA.transform.SetParent(this.maskParent);
            this.maskA.transform.SetAsFirstSibling();
        }
        this.close();
    }
}