import { Constants } from "System/constants/Constants";
import { EnumEffectRule, EnumRewardState, GameIDType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { DropPlanData } from "System/data/DropPlanData";
import { EquipStrengthenData } from "System/data/EquipStrengthenData";
import { PetData } from "System/data/pet/PetData";
import { ThingData } from "System/data/thing/ThingData";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { BeautyEquipListItemData } from "System/data/vo/BeautyEquipListItemData";
import { DropItemData } from "System/data/vo/DropItemData";
import { MarketItemData } from "System/data/vo/MarketItemData";
import { MaterialItemData } from "System/data/vo/MaterialItemData";
import { RewardIconItemData } from "System/data/vo/RewardIconItemData";
import { ZhufuData } from "System/data/ZhufuData";
import { Global as G } from "System/global";
import { EnumIconSize } from "System/IconManger/EnumIconSize";
import { Macros } from "System/protocol/Macros";
import { ItemTipData } from "System/tip/tipData/ItemTipData";
import { ITipData } from "System/tip/tipData/ITipData";
import { TextTipData } from "System/tip/tipData/TextTipData";
import { TipFrom } from "System/tip/view/TipsView";
import { ShapeCardTipsView } from "System/tip/view/ShapeCardTipsView";
import { TypeCacher } from "System/TypeCacher";
import { CurrencyIcon } from "System/uilib/CurrencyIcon";
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { EquipUtils } from "System/utils/EquipUtils";
import { FightingStrengthUtil } from "System/utils/FightingStrengthUtil";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { ResUtil } from "System/utils/ResUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";
import { TipType } from "System/constants/GameEnum";
import { EquipPartLevelUpPanel } from 'System/equip/EquipPartLevelUpPanel'
import { GameObjectGetSet, TextGetSet } from "./CommonForm";
/**图标要显示箭头类型*/
export enum ArrowType {
    none = 0,
    /**背包,装备类显示*/
    bag,
    /**装备位升级*/
    equipPartLvUp,
    /**装备强化界面*/
    equipStrength,
    /**装备进阶界面*/
    equipUp,
    /**锻造*/
    equipFuHun,
    /**可装备更高级宝石*/
    equipMingWen,
    /**附魔*/
    equipLianQi,
    /**装备炼体*/
    equipLianTi,
    /**穿戴的转生装备*/
    wearRebirthEquip,
    /**个人boss里的魂骨 */
    personalHungu,
    /**洗练*/
    equipXiLian,
}
/**
* 用于处理物品图标。
*
* @author teppei
*
*/
export class IconItem {
    /**终极的图标太大*/
    private readonly colorScale: number = 1.1;

    static readonly NoNeedFILTER_GRAY: number = 0;
    static readonly FILTER_GRAY: number = 1;
    private static readonly FILTER_DISABLED: number = 2;
    private static readonly NeedShowColors: number[] = [KeyWord.COLOR_BLUE, KeyWord.COLOR_PURPLE, KeyWord.COLOR_ORANGE, KeyWord.COLOR_GOLD, KeyWord.COLOR_RED, KeyWord.COLOR_PINK, KeyWord.COLOR_WUCAI];

    gameObject: UnityEngine.GameObject;
    /**图标宿主，飞图标时可使用*/
    iconRoot: UnityEngine.GameObject;

    /**背景图*/
    private m_bgImage: UnityEngine.UI.Image;
    private m_showBg = true;
    public set showBg(value: boolean) {
        if (this.m_showBg != value) {
            this.m_showBg = value;
            this.m_bgImage.enabled = value;
        }
    }
    /**绑定锁*/
    private m_lockImage: UnityEngine.UI.Image;
    private m_showLock = false;
    public set showLock(value: boolean) {
        if (this.m_showLock != value) {
            this.m_showLock = value;
            this.m_lockImage.enabled = value;
        }
    }
    /**颜色框*/
    private m_colorImage: UnityEngine.UI.Image;
    private m_frameColor: number;
    public set frameColor(value: number) {
        if (this.m_frameColor != value) {
            this.m_frameColor = value;
            if (value > 0) {
                this.m_colorImage.sprite = G.AltasManager.getColorIcon(value);
            }
            this.m_colorImage.enabled = value != 0;
        }
    }

    /**颜色框*/
    private m_colorImageE: UnityEngine.UI.Image;
    public get getFrameColorE(): UnityEngine.Sprite {
        return G.AltasManager.iconColorExhibitionAltas.Get(this.m_frameColor.toString());
    }

    /**凡，仙。字*/
    private m_iconZi: UnityEngine.UI.Image;
    private m_frameZi = 0;
    public set frameZi(value: number) {
        if (value != undefined && this.m_frameZi != value) {
            this.m_frameZi = value;
            if (value > 0) {
                this.m_iconZi.sprite = G.AltasManager.iconZiAtals.Get(value.toString());
            }
            this.m_iconZi.enabled = value != 0;
        }
    }


    /**角标*/
    private m_cornerBmp: UnityEngine.GameObject;
    private m_zhanTxtLv: UnityEngine.UI.Text;
    private m_zhanLevelValue: number = 0;
    private set zhanLevelValue(value: number) {
        if (this.m_zhanLevelValue != value) {
            this.m_zhanLevelValue = value;
            if (value == 0) {
                this.m_cornerBmp.SetActive(false);
            }
            else {
                if (this.m_zhanTxtLv == null) {
                    this.m_zhanTxtLv = ElemFinder.findText(this.m_cornerBmp, "txtLv");
                }
                this.m_zhanTxtLv.text = "斩" + value;
                this.m_cornerBmp.SetActive(true);
            }
        }
    }
    /**宝石等级*/
    private m_lvText: UnityEngine.UI.Text;
    private m_imgLvBg: UnityEngine.UI.Image;
    public showLvTextAndBg: boolean = true;

    /**右上角的阶级及其背景的显示*/
    private setLvTextAndBg() {
        this.m_lvText.gameObject.SetActive(this.showLvTextAndBg);
        this.m_imgLvBg.gameObject.SetActive(this.showLvTextAndBg);
    }

    private m_diamondLevelValue: string = null;
    private set diamondLevelValue(value: string) {
        if (this.showLvTextAndBg)
            if (this.m_diamondLevelValue != value) {
                this.m_diamondLevelValue = value;
                if (value == null || value == "") {
                    this.m_lvText.text = "";
                    if (this.m_imgLvBg != null && this.m_imgLvBg.gameObject.activeSelf) {
                        this.m_imgLvBg.gameObject.SetActive(false);
                    }
                }
                else {
                    this.m_lvText.text = value;
                    if (this.m_imgLvBg != null && !this.m_imgLvBg.gameObject.activeSelf) {
                        this.m_imgLvBg.gameObject.SetActive(this.m_lvText.gameObject.activeSelf);
                    }
                }
            }
    }
    /**过期或限时图标*/
    private m_timeImage: UnityEngine.GameObject;
    private m_showTimeImage: boolean = false;
    private set showTimeImage(value: boolean) {
        this.m_timeImage.SetActive(value);
        // if (this.m_showTimeImage != value) {
        //     this.m_showTimeImage = value;
        //     this.m_timeImage.SetActive(value);
        // }
    }

    /**"封"字，魂骨用 */
    private flagIntensify: UnityEngine.GameObject;
    /**"注"字，魂骨用 */
    private flagInject: UnityEngine.GameObject;

    /**星级 魂骨用 */
    private flagStarLevel: GameObjectGetSet;
    private flagStarLevelVer: GameObjectGetSet;
    private flagStarLevelSla: GameObjectGetSet;
    private txtStarLevelVer: TextGetSet;
    private txtStarLevelSla: TextGetSet;
    /**"禁"图标显示 */
    private flagForbid: GameObjectGetSet;


    private m_timeLimit: UnityEngine.GameObject;
    private m_showTimeLimit: boolean = false;
    private set showTimeLimit(value: boolean) {
        if (this.m_showTimeLimit != value) {
            this.m_showTimeLimit = value;
            this.m_timeLimit.SetActive(value);
        }
    }
    /**显示物品数量*/
    showNumText = true;

    /**物品数量*/
    private m_numText: UnityEngine.UI.Text;
    private m_itemCount: string = null;
    private set itemCount(value: string) {
        if (this.showNumText) {
            if (this.m_itemCount != value) {
                this.m_itemCount = value;
                if (!this.m_numText.gameObject.activeSelf)
                    this.m_numText.gameObject.SetActive(true);
                if (value == null) {
                    this.m_numText.text = "";
                }
                else {
                    this.m_numText.text = value.toString();
                }
            }
        } else {
            if (this.m_numText.gameObject.activeSelf)
                this.m_numText.gameObject.SetActive(false);
        }

    }

    private m_numSize = 0;
    private set itemCountSize(value: number) {
        if (this.m_numSize != value) {
            this.m_numSize = value;
            this.m_numText.fontSize = value;
        }
    }

    private m_numberColor: string = null;
    private set numberColor(value: string) {
        if (this.m_numberColor != value) {
            this.m_numberColor = value;
            if (value != null) {
                this.m_numText.color = Color.toUnityColor(value);
            }
        }
    }

    /*用于显示装备强化的文本 现在还没有加从外部隐藏该组件的方法**/
    private m_equipStrengNumber: UnityEngine.UI.Text;
    showEquipStrengNumber: boolean = true;
    private m_equipStrengValue: string;
    private set equipStrengNumber(value: string) {
        if (this.showEquipStrengNumber) {
            if (this.m_equipStrengNumber) {
                if (this.m_equipStrengValue != value) {
                    this.m_equipStrengValue = value;
                    if (value == null) {
                        this.m_equipStrengNumber.text = "";
                    }
                    else {
                        this.m_equipStrengNumber.text = value;
                    }
                }
            }
        } else {
            this.m_equipStrengNumber.text = "";
        }
    }

    /**专门用于显示装备位文字*/
    private m_equipText: UnityEngine.UI.Text;
    private m_equipValue: string;
    private set equipValue(value: string) {
        if (this.m_equipValue != value) {
            this.m_equipValue = value;
            if (value == null) {
                this.m_equipText.text = "";
            }
            else {
                this.m_equipText.text = value;
            }
        }
    }

    /**向上的箭头*/
    private m_arrow: UnityEngine.GameObject;
    private m_showArrow: boolean = false;
    private set showArrow(value: boolean) {
        if (this.m_showArrow != value) {
            this.m_showArrow = value;
            this.m_arrow.SetActive(value);
        }
    }

    /**箭头上的动画*/
    private m_arrowAnim: UnityEngine.Animator;
    private set arrowAnimEnabel(value: boolean) {
        if (this.m_arrowAnim != null) {
            this.m_arrowAnim.enabled = value;
        }
    }


    /**套装*/
    private m_tao: UnityEngine.GameObject;
    private m_showTao: boolean = false;
    private set showTao(value: boolean) {
        if (this.m_showTao != value) {
            this.m_showTao = value;
            this.m_tao.SetActive(value);
        }
    }



    ///**武器装备阶级文本*/
    //private m_stageText: UnityEngine.UI.Text;
    //private objStage: UnityEngine.GameObject;
    //private set stageValue(value: number) {
    //    if (this.m_stageText != null) {
    //        if (value == 0) {
    //            this.m_stageText.text = "";
    //            this.objStage.SetActive(false);
    //        }
    //        else {
    //            this.m_stageText.text = value + "阶";
    //            this.objStage.SetActive(true);
    //        }
    //    }
    //}



    /**伙伴装备位空，有可以穿戴，显示提示*/
    equipIsNullShowTip: boolean = false;


    private m_iconRootGrey: boolean = false;
    private set iconRootGrey(value: boolean) {
        if (this.m_iconRootGrey != value) {
            this.m_iconRootGrey = value;
            UIUtils.setGrey(this.iconRoot, value, false);
        }
    }
    private m_effectGrey: boolean = false;
    private set effectGrey(value: boolean) {
        if (this.m_effectGrey != value) {
            this.m_effectGrey = value;
            UIUtils.setGrey(this.m_colorEffect, value);
        }
    }

    /**物品图标*/
    private m_iconImage: UnityEngine.UI.RawImage;

    /**颜色特效*/
    private m_colorEffect: UnityEngine.GameObject;
    /**当前特效的颜色*/
    private m_crtEffectColor = 0;

    /**是否强制显示数量，不管是否为0*/
    forceShowNum: boolean;

    /**是否不显示数量*/
    private noNum: boolean;
    /** 图标大小 */
    private size: number = EnumIconSize.NORMAL;

    /**物品tip数据*/
    private m_itemTipData: ItemTipData = new ItemTipData();
    /**文字tip数据*/
    private m_textTipData: TextTipData = new TextTipData();

    private thingItemData: ThingItemData = new ThingItemData();

    private isBlank: boolean;

    private itemConfig: GameConfig.ThingConfigM;
    private set ItemConfig(cfg: GameConfig.ThingConfigM) {
        if (cfg && cfg.m_ucFunctionType == KeyWord.ITEM_FUNCTION_DYNAMIC_THING) {
            let dything = G.DataMgr.dynamicThing.getDynamicThingByID(cfg.m_iID);
            this.itemConfig = ThingData.m_itemMap[dything.m_iItemID];
        }
        else {
            this.itemConfig = cfg;
        }
    }

    private sellConfig: GameConfig.NPCSellConfigM;
    private thingInfo: Protocol.ContainerThingInfo;
    private iconName: string;
    color = 0;
    private needLock: boolean;
    private tipStr: string;
    private num: number = 0;
    private requestNum: number = 0;
    private containerID: number = 0;
    private petOrZhufuId = 0;

    filterType: number = 0;
    private effectState: EnumRewardState;
    /**是否显示可替换装备*/
    private showReplace = false;

    /**箭头类型*/
    arrowType: ArrowType = ArrowType.none;
    /**是否需要箭头，强化里材料装备不需要*/
    isNeedShowArrow: boolean = true;

    /**显示颜色特效的规则*/
    m_effectRule: EnumEffectRule = EnumEffectRule.normal;

    private tipHolder: UnityEngine.GameObject;
    private tipFrom: TipFrom = TipFrom.none;

    /**至灰icon时是否需要特效不至灰*/
    needEffectGrey: boolean = true;
    /**是否需要颜色边框*/
    needColor: boolean = true;
    /**是否比较所有的伙伴装备 背包中物品要比较所有的，装备穿戴面板，只比较当前选择的伙伴*/
    isCompareAllPetEquip: boolean = false;
    /**是否需要显示终极五彩框*/
    needWuCaiColor: boolean = false;
    /**需要强制显示五彩,不是穿身上的又需要显示的*/
    needForceShowWuCaiColor: boolean = false;
    /**是否是预览的五彩装备*/
    isPreviewWuCaiEquip: boolean = false;
    /**是合成界面，婚戒需要显示数量*/
    isMergePanelEquipNeedShowNum: boolean = false;
    /**翅膀装备的等级*/
    wingEquipLv: number = 1;
    /**预览附魂，取属性最大的*/
    isPrevFuHun: boolean = false;
    /**显示转生的装备精炼等级*/
    showRebirthLv: boolean = false;
    /**是否显示下一装备强化等级的数据和配置*/
    private isGetNextStrengLv: boolean = false;
    /**是否显示下一装备等级的数据和配置*/
    private isGetNextPartLv: boolean = false;
    /**是否是展示图标（只有一个图标icon）*/
    private isExhibition: boolean = false;
    private tag: number = 0;
    private nums: number = 0;
    constructor() {
        this.noNum = false;
    }

    setUsualEquipSlotByPrefab(slotTemplate: UnityEngine.GameObject, slotRoot: UnityEngine.GameObject) {
        let slotPrefab = UnityEngine.GameObject.Instantiate(slotTemplate) as UnityEngine.GameObject;
        slotPrefab.transform.SetParent(slotRoot.transform, false);
        slotPrefab.transform.localPosition = UnityEngine.Vector3.zero;
        let rectTransform = slotPrefab.transform as UnityEngine.RectTransform;
        rectTransform.sizeDelta = (slotRoot.transform as UnityEngine.RectTransform).sizeDelta;
        slotPrefab.SetActive(true);
        this.setUsuallyEquip(slotPrefab);
    }

    /**
     * 设置为装备位。
     * @param container
     */
    setUsuallyEquip(container: UnityEngine.GameObject) {
        this.setUsuallyIcon(container);

        let equipText = null;
        let equipTextTransform = container.transform.Find('text');
        if (null != equipTextTransform) {
            equipText = equipTextTransform.GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
        }
        this.m_equipText = equipText;
    }

    setUsualIconByPrefab(iconTemplate: UnityEngine.GameObject, iconRoot: UnityEngine.GameObject) {
        let iconPrefab = Game.Tools.Instantiate(iconTemplate, iconRoot, false) as UnityEngine.GameObject;
        Game.Tools.SetGameObjectAnchoredPosition(iconPrefab, 0, 0);
        Game.Tools.CopyRectTransformSize(iconPrefab, iconRoot);
        iconPrefab.SetActive(true);
        this.setUsuallyIcon(iconPrefab);
    }

    /**
     * 设置为物品图标。
     * @param container
     */
    setUsuallyIcon(container: UnityEngine.GameObject) {
        this.gameObject = container;
        container.SetActive(true);

        let iconRoot: UnityEngine.GameObject = container;
        this.iconRoot = iconRoot;
        let cache = Game.Tools.GetChild(iconRoot, "iconRoot");
        if (cache != null) {
            this.iconRoot = iconRoot = cache;
        }
        let iconBack = Game.Tools.GetChildElement(iconRoot, TypeCacher.Image, 'back') as UnityEngine.UI.Image;
        let icon = Game.Tools.GetChildElement(iconRoot, TypeCacher.RawImage, 'icon') as UnityEngine.UI.RawImage;
        let color = Game.Tools.GetChildElement(iconRoot, TypeCacher.Image, 'color') as UnityEngine.UI.Image;
        let numText = Game.Tools.GetChildElement(iconRoot, TypeCacher.Text, 'number') as UnityEngine.UI.Text;
        let iconCorner = Game.Tools.GetChild(iconRoot, "corner");
        let lock = Game.Tools.GetChildElement(iconRoot, TypeCacher.Image, 'lock') as UnityEngine.UI.Image;
        let lvText = Game.Tools.GetChildElement(iconRoot, TypeCacher.Text, 'lvText') as UnityEngine.UI.Text;
        let imgLvBg = Game.Tools.GetChildElement(iconRoot, TypeCacher.Image, 'imgLvBg') as UnityEngine.UI.Image;
        let arrow = Game.Tools.GetChild(iconRoot, "iconArrow");
        let tao = Game.Tools.GetChild(iconRoot, "tao");
        let timeImg = Game.Tools.GetChild(iconRoot, "timeImg");
        let timeLimit = Game.Tools.GetChild(timeImg, "limit");
        let iconZi = Game.Tools.GetChildElement(iconRoot, TypeCacher.Image, 'iconZi') as UnityEngine.UI.Image;
        let equipNumberText = Game.Tools.GetChildElement(iconRoot, TypeCacher.Text, 'equipNumber') as UnityEngine.UI.Text;
        let flagIntensify = Game.Tools.GetChild(iconRoot, "flagIntensify");
        let flagInject = Game.Tools.GetChild(iconRoot, "flagInject");

        let flagStar = Game.Tools.GetChild(iconRoot, "flagStarLevel");
        if (flagStar) {
            this.flagStarLevel = new GameObjectGetSet(Game.Tools.GetChild(iconRoot, "flagStarLevel"));
            this.flagStarLevelVer = new GameObjectGetSet(Game.Tools.GetChild(this.flagStarLevel.gameObject, "flagStarLevelVer"));
            this.flagStarLevelSla = new GameObjectGetSet(Game.Tools.GetChild(this.flagStarLevel.gameObject, "flagStarLevelSla"));
            this.txtStarLevelVer = new TextGetSet(ElemFinder.findText(this.flagStarLevelVer.gameObject, "txtStarLevelVer"));
            this.txtStarLevelSla = new TextGetSet(ElemFinder.findText(this.flagStarLevelSla.gameObject, "txtStarLevelSla"));
        }
        if (this.flagStarLevel) {
            this.setStarLevelType(1);
            this.flagStarLevel.SetActive(false);
        }

        let flagfbd = Game.Tools.GetChild(iconRoot, "flagForbid");
        if (flagfbd) {
            this.flagForbid = new GameObjectGetSet(flagfbd);
            this.setFlagForbid(false);
        }

        this.setComponents(icon, color, iconBack, iconCorner, numText, lock, lvText, timeImg, timeLimit, null,
            arrow, tao, iconZi, iconRoot, imgLvBg, equipNumberText, flagIntensify, flagInject);
    }

    /**
     * 设置为圆形的展示图标
     * @param container
     */
    setExhibitionIcon(container: UnityEngine.GameObject, iconRoot: UnityEngine.GameObject) {
        this.isExhibition = true;
        this.setUsualIconByPrefab(container, iconRoot);
        this.m_colorImage.gameObject.SetActive(false);
        this.m_bgImage.gameObject.SetActive(false);
        this.m_cornerBmp.gameObject.SetActive(false);
        this.m_numText.gameObject.SetActive(false);
        this.m_lockImage.gameObject.SetActive(false);
        this.m_lvText.gameObject.SetActive(false);
        this.m_imgLvBg.gameObject.SetActive(false);
        this.m_timeImage.gameObject.SetActive(false);
        this.m_arrow.gameObject.SetActive(false);
        this.m_tao.gameObject.SetActive(false);
        this.m_iconZi.gameObject.SetActive(false);
        this.m_equipStrengNumber.gameObject.SetActive(false);
        this.flagStarLevel.SetActive(false);
    }

    private setComponents(iconImage: UnityEngine.UI.RawImage, colorImage: UnityEngine.UI.Image, bgImage: UnityEngine.UI.Image, cornerImage: UnityEngine.GameObject,
        numText: UnityEngine.UI.Text, lockImage: UnityEngine.UI.Image, lvText: UnityEngine.UI.Text, timeImage: UnityEngine.GameObject, timeLimit: UnityEngine.GameObject,
        equipText: UnityEngine.UI.Text, arrow: UnityEngine.GameObject, tao: UnityEngine.GameObject, iconZi: UnityEngine.UI.Image, tipHolder: UnityEngine.GameObject,
        imgLvBg: UnityEngine.UI.Image, equipNumber: UnityEngine.UI.Text, flagIntensify: UnityEngine.GameObject, flagInject: UnityEngine.GameObject) {
        this.m_iconImage = iconImage;
        this.m_colorImage = colorImage;
        this.m_bgImage = bgImage;
        this.m_cornerBmp = cornerImage;
        this.m_numText = numText;
        this.m_numSize = numText.fontSize;
        this.m_lockImage = lockImage;
        this.m_lvText = lvText;
        this.m_imgLvBg = imgLvBg;
        this.m_timeImage = timeImage;
        this.m_timeLimit = timeLimit;
        this.m_equipText = equipText;
        this.m_arrow = arrow;
        this.m_tao = tao;
        this.m_iconZi = iconZi;
        this.m_equipStrengNumber = equipNumber;
        this.flagIntensify = flagIntensify;
        this.flagInject = flagInject;

        if (this.m_arrow != null) {
            this.m_arrowAnim = this.m_arrow.GetComponent(UnityEngine.Animator.GetType()) as UnityEngine.Animator;
        }

        this.tipHolder = tipHolder;

        if (null != this.tipHolder && TipFrom.none != this.tipFrom) {
            Game.UIClickListener.Get(this.tipHolder).onClick = delegate(this, this.onClick);
        }
        this.reset();
    }

    /**
     * 通过物品id更新图标。
     * @param id
     */
    updateById(id: number, count = 1) {
        this.resetData();
        this._doUpdateById(id);
        this.num = count;
    }

    /**
     * 通过物品id更新展示图标。
     * @param id
     * @param count
     */
    updateExhibitionById(id: number) {
        this.resetData();
        this._doUpdateById(id);
        //更新圆环 在别的地方操作了
    }

    private _doUpdateById(id: number) {
        if (GameIDUtil.isBagThingID(id)) {
            this.ItemConfig = ThingData.getThingConfig(id);
        }
        else if (GameIDUtil.isSpecialID(id)) {
            this.iconName = id + '';
            this.needLock = false;
            this.tipStr = CurrencyIcon.getTipStr(id);
        }
        else {
            this.isBlank = true;
        }
    }

    updateByItemConfig(itemConfig: GameConfig.ThingConfigM) {
        this.resetData();
        if (null == itemConfig) {
            this.isBlank = true;
            return;
        }
        this.ItemConfig = itemConfig;
        this.num = 1;
    }

    updateByMarketItemData(itemData: MarketItemData) {
        this.resetData();
        if (null == itemData) {
            this.isBlank = true;
            return;
        }
        this.ItemConfig = itemData.itemConfig;
        this.sellConfig = itemData.sellConfig;
        this.num = (itemData.sellConfig.m_ucAmount > 1 ? itemData.sellConfig.m_ucAmount : 0);
    }

    updateByBeautyEquipListItemData(itemData: BeautyEquipListItemData) {
        if (null != itemData) {
            this.updateByThingItemData(itemData.thingItemData);
            this.petOrZhufuId = itemData.petOrZhufuId;
        } else {
            this.updateByThingItemData(null);
        }
    }

    updateByThingItemData(itemData: ThingItemData) {
        this.resetData();
        if (null == itemData) {
            this.equipStrengNumber = '';
            this.isBlank = true;
            return;
        }

        this.ItemConfig = itemData.config;
        this.thingInfo = itemData.data;
        this.num = (null != itemData.data ? itemData.data.m_iNumber : 1);
        this.containerID = itemData.containerID;
    }

    updateByThingInfo(thingInfo: Protocol.ContainerThingInfo, containerID: number) {
        this.resetData();
        if (null == thingInfo) {
            this.isBlank = true;
            return;
        }
        this.ItemConfig = ThingData.getThingConfig(thingInfo.m_iThingID);
        this.thingInfo = thingInfo;
        this.num = thingInfo.m_iNumber;
        this.containerID = containerID;
    }

    updateByDropItemData(itemData: DropItemData) {
        this.resetData();
        if (null == itemData) {
            this.isBlank = true;
            return;
        }
        this.ItemConfig = itemData.config;
        this.num = itemData.number;
    }

    updateByDropThingCfg(dropThing: GameConfig.DropThingM) {
        this.resetData();
        if (null == dropThing) {
            this.isBlank = true;
            return;
        }

        this._doUpdateById(dropThing.m_iDropID);
        this.num = dropThing.m_uiDropNumber;
    }

    updateByMaterialItemData(itemData: MaterialItemData) {
        this.resetData();
        if (null == itemData) {
            this.isBlank = true;
            return;
        }
        this.ItemConfig = ThingData.getThingConfig(itemData.id);
        this.num = itemData.has;
        this.requestNum = itemData.need;
    }

    updateByRewardIconData(itemData: RewardIconItemData) {
        this.resetData();
        if (null == itemData || ((0 == itemData.id) && (null == itemData.iconID || '' == itemData.iconID))) {
            this.isBlank = true;
            return;
        }
        this.num = itemData.number;
        let isBagOrDrop = false;
        if (GameIDUtil.isBagThingID(itemData.id)) {
            // 普通物品
            isBagOrDrop = true;
            this.ItemConfig = ThingData.getThingConfig(itemData.id);
            if (null == this.itemConfig) {
                this.isBlank = true;
                return;
            }
        }
        else if (GameIDUtil.isSpecialID(itemData.id)) {
            // 特殊物品
            this.iconName = itemData.id + '';
            this.color = KeyWord.COLOR_PURPLE;
            this.needLock = false;
        }
        else if (GameIDUtil.isDropID(itemData.id)) {
            isBagOrDrop = true;
            let dropCfg: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(itemData.id);
            if (dropCfg.m_ucIsDropByProf) {
                let isfind = false;
                //如果分职业 找本职业的第一个
                for (let i = 0, con = dropCfg.m_astDropThing.length; i < con; i++) {
                    let data = dropCfg.m_astDropThing[i];
                    let thingdata = ThingData.getThingConfig(data.m_iDropID);
                    if (thingdata.m_ucProf == G.DataMgr.heroData.profession) {
                        this.ItemConfig = ThingData.getThingConfig(data.m_iDropID);
                        this.num = data.m_uiDropNumber;
                        this.noNum = true;
                        isfind = true;
                    }
                }
                if (isfind == false) {
                    this.setDropThing(dropCfg);
                }
            }
            else {
                this.setDropThing(dropCfg);
            }
        }
        else {
            this.iconName = itemData.iconID == null ? itemData.id.toString() : itemData.iconID;
            this.color = itemData.color > 0 ? itemData.color : KeyWord.COLOR_PURPLE;
            this.needLock = false;
        }

        if (!isBagOrDrop) {
            if (null != itemData.tipInfo && '' != itemData.tipInfo) {
                this.tipStr = itemData.tipInfo;
            }
            else {
                let formatNumber: string;
                if (this.num == 0) {
                    formatNumber = '大量';
                }
                else {
                    //formatNumber = DataFormatter.formatNumber(this.num, 1000, true, true);
                    formatNumber = this.num >= 10000 ? Math.round(this.num / 10000) + '万' : this.num.toString();
                }
                this.tipStr = formatNumber + KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, itemData.id);
            }
        }
        this.filterType = itemData.state == EnumRewardState.HasGot ? IconItem.FILTER_GRAY : 0;
        this.effectState = itemData.state;
    }

    private setDropThing(dropCfg: GameConfig.DropConfigM) {
        if (GameIDUtil.isSpecialID(dropCfg.m_astDropThing[0].m_iDropID)) {
            this.iconName = dropCfg.m_astDropThing[0].m_iDropID + '';
            this.num = dropCfg.m_astDropThing[0].m_uiDropNumber;
            this.needLock = false;
            this.tipStr = CurrencyIcon.getTipStr(dropCfg.m_astDropThing[0].m_iDropID);
        }
        else {
            this.ItemConfig = ThingData.getThingConfig(dropCfg.m_astDropThing[0].m_iDropID);
            this.num = dropCfg.m_astDropThing[0].m_uiDropNumber;
        }
    }

    private updateByIconidAndDes(icon) {
        //TODO...
    }

    private resetData() {
        this.ItemConfig = null;
        this.isBlank = false;
        this.thingInfo = null;
        this.sellConfig = null;
        this.num = -1;
        this.requestNum = 0;
        this.containerID = 0;
        this.petOrZhufuId = 0;
        this.iconName = null;
        this.needLock = false;
        this.tipStr = null;
        this.filterType = 0;
        this.frameZi = 0;
        this.effectState = EnumRewardState.HasGot;
    }

    updateEquipIcon(equipType: GameIDType, otherSubType: number, index: number) {
        this.noNum = false;
        this.updateIcon();

        if (null != this.m_equipText) {
            this.updateEquipText(equipType, otherSubType, index);
        }
    }

    private updateEquipText(equipType: GameIDType, otherSubType: number, index: number) {
        let equipStr: string = null;
        let equipObj: ThingItemData = null;
        let zdl: number = 0;
        //当前物品战斗力
        if (this.itemConfig != null && this.thingInfo != null) {
            if (GameIDUtil.isHunguEquipID(this.itemConfig.m_iID)) {
                zdl = G.DataMgr.hunliData.getHunguEquipFight(this.itemConfig, this.thingInfo);
            }
            else {
                zdl = FightingStrengthUtil.getStrengthByEquip(this.itemConfig, this.thingInfo.m_stThingProperty.m_stSpecThingProperty);
            }
        }
        let canWear: boolean = false;
        let bagData: ThingItemData[];
        this.showReplace = false;
        if (GameIDType.ROLE_EQUIP == equipType) {
            //屏蔽时装
            let equipPart = KeyWord.EQUIP_PARTCLASS_MIN + index;
            if (KeyWord.EQUIP_PARTCLASS_DRESS != equipPart) {
                equipStr = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PART, equipPart);
            }
            bagData = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.ROLE_EQUIP);
            for (let i: number = bagData.length - 1; i >= 0; i--) {
                let oneBagData = bagData[i];
                let equipConfig = oneBagData.config;
                if (equipPart == equipConfig.m_iEquipPart && oneBagData.zdl > zdl && (equipConfig.m_ucProf == 0 || G.DataMgr.heroData.profession == equipConfig.m_ucProf)) {
                    this.showReplace = true;
                    break;
                }
            }
        }
        else if (GameIDType.REBIRTH_EQUIP == equipType) {
            let equipPart = index;
            bagData = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP);
            let times = 0/*G.DataMgr.rebirthData.rebirthTimes*/;
            let profession = G.DataMgr.heroData.profession;
            for (let i: number = bagData.length - 1; i >= 0; i--) {
                let oneBagData = bagData[i];
                let equipConfig = oneBagData.config;
                let prof = equipConfig.m_ucProf;
                if ((equipConfig.m_ucProf == 0 || (equipConfig.m_ucProf == profession)) && equipPart == equipConfig.m_iEquipPart && oneBagData.config.m_ucRebirthLevel <= times && oneBagData.zdl > zdl) {
                    this.showReplace = true;
                    break;
                }
            }
        }
        else if (GameIDType.OTHER_EQUIP == equipType) {
            //其他所有装备
            let currentVo: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.currentOtherPanelData;
            let equipPartConfig = G.DataMgr.zhufuData.getEquipPartConfig(otherSubType);
            let equipMap = equipPartConfig.m_astEquipPartList[index];
            if (currentVo) {
                bagData = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.OTHER_EQUIP);
                for (let i: number = bagData.length - 1; i >= 0; i--) {
                    let oneBagData = bagData[i];
                    let equipConfig = oneBagData.config;
                    if (equipConfig.m_iEquipPart == equipMap.m_iPartId && equipConfig.m_ucRequiredLevel <= currentVo.m_ucLevel && GameIDUtil.getSubTypeByEquip(equipConfig.m_iEquipPart) == otherSubType) {
                        canWear = true;
                        if (oneBagData.zdl > zdl) {
                            this.showReplace = true;
                            break;
                        }
                    }
                }
            }
            if (canWear) {
                equipStr = TextFieldUtil.getColorText('穿戴', 'ffa200');
            }
            else {
                let group: number = GameIDUtil.getEquipPartGroupBySubType(otherSubType);
                equipStr = TextFieldUtil.getColorText(this.getPetEquipPartDesplayName(group, equipMap.m_iPartId), Color.DEFAULT_WHITE);
            }
        }
        else if (GameIDType.PET_EQUIP == equipType) {
            this.equipIsNullShowTip = false;
            let hongyanData: Protocol.NewBeautyInfo = G.DataMgr.petData.currentHongYanData;
            if (hongyanData && hongyanData.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                //看看表里面有没有能穿戴的伙伴
                bagData = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.PET_EQUIP);
                for (let i: number = bagData.length - 1; i >= 0; i--) {
                    let oneBagData = bagData[i];
                    let equipConfig = oneBagData.config;
                    let awakeLevel: number = G.DataMgr.petData.getPetInfo(hongyanData.m_iBeautyID).m_stAwake.m_ucLevel;
                    if (equipConfig.m_iEquipPart == KeyWord.BEAUTY_EQUIP_PARTCLASS_MIN + index
                        && ((equipConfig.m_iFunctionID == 0 && equipConfig.m_ucRequiredLevel <= awakeLevel)
                            || ((equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BRACELET || equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BINHUN) && equipConfig.m_ucRequiredLevel <= hongyanData.m_uiStage))) {
                        canWear = true;
                        this.equipIsNullShowTip = this.equipPosIsNull(hongyanData.m_iBeautyID, index);
                        if (oneBagData.zdl > zdl) {
                            this.showReplace = true;
                            break;
                        }
                    }
                }
            }

            if (canWear) {
                equipStr = TextFieldUtil.getColorText('穿戴', 'ffa200');
            }
            else {
                equipStr = TextFieldUtil.getColorText(this.getPetEquipPartDesplayName(KeyWord.GROUP_BEAUTY_EQUIP_PART, KeyWord.BEAUTY_EQUIP_PARTCLASS_MIN + index), Color.DEFAULT_WHITE);
            }
        }
        if (this.itemConfig == null) {
            this.equipValue = equipStr;
        }
        else {
            this.equipValue = null;
        }
        this.showArrow = this.showReplace;
    }

    private equipPosIsNull(petId: number, index: number): boolean {
        let co: { [pos: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        if (null != co) {
            let petConfig: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petId);
            let obj = co[petConfig.m_uiEquipPosition + index];
            if (obj == null) {
                return true;
            }
        }
        return false;
    }

    getPetEquipPartDesplayName(group: number, part: number): string {
        let name = KeyWord.getDesc(group, part);
        return name.replace(/伙伴/, '');
    }
    /**
     * isGetNextStrengLv 是否显示装备下一强化等级的数据和配置，默认不要传
     * isGetNextPartLv 是否显示装备下一等级数据和配置，默认不要传
     * @param isGetNextStrengLv
     */
    updateIcon(notShowEffect: boolean = false, isGetNextStrengLv: boolean = false, isGetNextPartLv: boolean = false, showIcon = true): void {
        if (this.isBlank) {
            this.reset();
            return;
        }
        if (null != this.itemConfig) {
            if (defines.has('_DEBUG')) {
                uts.assert(null == this.sellConfig || null == this.thingInfo, '两者必须有1个为null!');
            }
            this.needLock = GameIDUtil.isBingThingByContainerInfo(this.itemConfig.m_iID, this.thingInfo);
            let iconname = this.itemConfig.m_szIconID;
            if (this.itemConfig.m_ucFunctionType == KeyWord.ITEM_FUNCTION_DRESS_IMAGE
                || (this.itemConfig.m_ucFunctionType == KeyWord.ITEM_FUNCTION_SAIJI_SUBIMAGE && G.DataMgr.zhufuData.shiZhuangAndWeapons.indexOf(this.itemConfig.m_iFunctionID) >= 0)
            ) {
                let pro = G.DataMgr.heroData.profession;
                let suffix = pro == 2 ? "a" : "b";
                iconname += suffix;
            }
            this.iconName = iconname;
        }
        else if (null == this.tipStr) {
            this.reset();
            return;
        }
        this.isGetNextStrengLv = isGetNextStrengLv;
        this.isGetNextPartLv = isGetNextPartLv;
        this.showLock = this.needLock;

        // 隐藏装备位描述
        this.equipValue = null;

        // 物品图标
        if (showIcon)
            G.ResourceMgr.loadIcon(this.m_iconImage, (ResUtil.getIconID(this.iconName, this.size)), -1);

        // 数量
        if (this.noNum) {
            this.itemCount = null;
        }
        else {
            let tfNumColor: string = Color.WHITE;
            let tfNumText: string;
            //let tfNumSize = 18;
            let equipStrengText: string;
            let tfStageText: number = 0;
            if (null != this.itemConfig && (GameIDUtil.isRoleEquipID(this.itemConfig.m_iID) || GameIDUtil.isHunguEquipID(this.itemConfig.m_iID))) {

                if (GameIDUtil.isRoleEquipID(this.itemConfig.m_iID)) {
                    let equipLevel: number = EquipStrengthenData.getEquipLevel(this.itemConfig.m_iEquipPart, isGetNextStrengLv);

                    let isWingEquip = this.itemConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING;
                    if (isWingEquip) {
                        equipLevel = this.thingInfo ? this.thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress : this.wingEquipLv;
                        equipLevel *= 2.5;
                    }
                    if (equipLevel > 0 && this.num != 0) {

                        equipStrengText = uts.format(isWingEquip ? '{0}%' : '+{0}', equipLevel);
                    }
                    if (this.isMergePanelEquipNeedShowNum && this.requestNum > 0) {
                        // 显示当前数量/需求数量
                        tfNumColor = this.num >= this.requestNum ? Color.GREEN : Color.RED;
                        let ownNumStr: string;
                        if (this.num >= 10000) {
                            ownNumStr = DataFormatter.toFixed(this.num / 10000, 1) + '万';
                        } else {
                            ownNumStr = this.num.toString();
                        }
                        tfNumText = uts.format('{0}/{1}', ownNumStr, this.requestNum);
                    }
                }
                else if (GameIDUtil.isHunguEquipID(this.itemConfig.m_iID)) {
                    // if (this.thingInfo != null) {
                    //     let isintensify = this.thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel == 0 ? false : true;
                    //     this.flagIntensify.SetActive(isintensify);
                    //     this.flagStarLevel.SetActive(true);
                    //     this.txtStarLevel.text = uts.format("{0}星", TextFieldUtil.NUMBER_LIST[this.itemConfig.m_ucStage]);
                    // }
                    //    let jinLianLv = G.DataMgr.equipStrengthenData.getSlotRegineLv(this.itemConfig.m_iEquipPart % KeyWord.HUNGU_EQUIP_PARTCLASS_MIN);
                    //    if (jinLianLv > 0 && this.num != 0) {
                    //        tfNumColor = Color.GREEN;
                    //        tfNumText = uts.format('+{0}', jinLianLv);
                    //        tfNumSize = 20;
                    //    }
                }

            }
            else if (this.requestNum > 0) {
                // 显示当前数量/需求数量
                tfNumColor = this.num >= this.requestNum ? Color.GREEN : Color.RED;
                let ownNumStr: string;
                if (this.num >= 10000) {
                    ownNumStr = DataFormatter.toFixed(this.num / 10000, 1) + '万';
                } else {
                    ownNumStr = this.num.toString();
                }
                tfNumText = uts.format('{0}/{1}', ownNumStr, this.requestNum);
                tfStageText = 0;
            } else {
                if (this.num > 1 || this.forceShowNum) {
                    if (this.num >= 10000) {
                        tfNumText = DataFormatter.toFixed(this.num / 10000, 1) + '万';
                    } else {
                        tfNumText = this.num.toString();
                    }
                }
                tfStageText = 0;
            }
            this.itemCount = tfNumText;
            this.numberColor = tfNumColor;
            //this.itemCountSize = tfNumSize;
            this.equipStrengNumber = equipStrengText;
        }
        // 物品颜色
        this.color = KeyWord.COLOR_PURPLE;//默认紫色
        if (null != this.itemConfig) {
            this.color = this.itemConfig.m_ucColor;
        }
        //人物装备且不是精灵，戒指
        if (null != this.itemConfig && GameIDUtil.isRoleEquipID(this.itemConfig.m_iID) &&
            (this.itemConfig.m_iEquipPart != KeyWord.EQUIP_PARTCLASS_LINGBAO && this.itemConfig.m_iEquipPart != KeyWord.EQUIP_PARTCLASS_WEDDINGRING)) {
            //终极进阶 五彩神石
            let itemData = new ThingItemData();
            itemData.config = this.itemConfig;
            itemData.data = this.thingInfo;
            itemData.containerID = this.containerID;
            let equipStrengthenData = G.DataMgr.equipStrengthenData;
            let isOther = false;
            if (this.thingInfo != null) {
                isOther = G.DataMgr.otherPlayerData.isOthersEquip(this.itemConfig.m_iID, this.thingInfo.m_stThingProperty.m_stGUID);
            }
            //已经终极进阶过，且穿在身上
            if ((this.isPreviewWuCaiEquip) || (this.needWuCaiColor && equipStrengthenData.isEquipHadFinalUpLv(EquipUtils.getEquipIdxByPart(this.itemConfig.m_iEquipPart), isOther) && (this.needForceShowWuCaiColor || G.DataMgr.thingData.checkIsWaring(itemData, 0, isOther)))) {
                this.color = KeyWord.COLOR_WUCAI;
            } else if (this.itemConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) {
                //翅膀颜色获取
                this.color = G.DataMgr.equipStrengthenData.getWingEquipColor(this.itemConfig, this.thingInfo, this.wingEquipLv);
            }

            //凡 仙 字
            if (G.DataMgr.thingData.checkIsWaring(itemData, 0)) {
                let soltInfo = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(EquipUtils.getEquipIdxByPart(this.itemConfig.m_iEquipPart));
                this.frameZi = soltInfo.m_ucSuitType;
            } else {
                this.frameZi = 0;
            }
        }

        if (IconItem.NeedShowColors.indexOf(this.color) >= 0 && this.needColor) {
            this.frameColor = this.color;
        } else {
            this.frameColor = 0;
        }


        // 角标,显示附魔
        let zmLevel: number = 0;
        if (this.thingInfo != null && this.thingInfo.m_stThingProperty.m_stSpecThingProperty != null && this.thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo != null) {
            zmLevel = this.thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stLQ.m_ucLQLevel;
        }
        this.zhanLevelValue = zmLevel;

        // 宝石等级
        this._setDiamondLevel(this.itemConfig);
        // 超时、限时标志
        this.updateTimeIcon();
        // 箭头
        this.isShowIconArrow(this.arrowType);
        //是否是套装
        this.showTao = this.itemConfig && this.itemConfig.m_ucWYSuitID > 0 ? true : false;
        if (!notShowEffect) {
            // 物品特效
            this.updateEffect();
        }
        this.iconRootGrey = IconItem.FILTER_GRAY == this.filterType;
        //魂骨装备特殊显示
        if (null != this.itemConfig && GameIDUtil.isHunguEquipID(this.itemConfig.m_iID)) {
            if (this.thingInfo != null) {
                let isintensify = this.thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel == 0 ? false : true;
                let isinject = this.thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_stSkillFZ.m_iItemID == 0 ? false : true;
                if (isinject) {
                    this.flagInject.SetActive(true);
                    this.flagIntensify.SetActive(false);
                }
                else if (isintensify) {
                    this.flagInject.SetActive(false);
                    this.flagIntensify.SetActive(true);
                }
                else {
                    this.flagInject.SetActive(false);
                    this.flagIntensify.SetActive(false);
                }
            }
            if (this.flagStarLevel) {
                this.flagStarLevel.SetActive(this.isShowStarLevelFlag);
                //直接改成年代了
                this.setStarLevelNumber(this.itemConfig.m_iDropLevel);
            }
        }
        else {
            if (this.flagIntensify) {
                if (this.thingInfo != null) {
                    this.flagIntensify.SetActive(false);
                }
            }
            if (this.flagInject) {
                if (this.thingInfo != null) {
                    this.flagInject.SetActive(false);
                }
            }
            if (this.flagStarLevel) {
                this.flagStarLevel.SetActive(false);
            }
        }
    }

    //先屏蔽这个特效
    private updateEffect() {
        if (this.isExhibition) return;

        let needEffect = this.isNeedEffect(this.m_effectRule, this.color, this.effectState);
        if (!needEffect || (null != this.m_colorEffect && this.m_crtEffectColor != this.color)) {
            if (null != this.m_colorEffect) {
                UnityEngine.GameObject.Destroy(this.m_colorEffect);
                this.m_colorEffect = null;
            }
            this.m_effectGrey = false;
        }
        if (needEffect && null == this.m_colorEffect) {
            let effectPrefab = G.AltasManager.colorEffectAltas.GetElement(this.color.toString());
            this.m_colorEffect = Game.Tools.Instantiate(effectPrefab, this.gameObject, false);
            this.m_crtEffectColor = this.color;
        }
        if (null != this.m_colorEffect) {
            this.effectGrey = this.needEffectGrey && IconItem.FILTER_GRAY == this.filterType;
        }
    }

    /**
     * 装备仅显示指定类型
     * @param type
     */
    private onlyShow(type: ArrowType) {
        if (type == ArrowType.equipPartLvUp) {
            //装备位
            this.itemCount = "";
            this.zhanLevelValue = 0;
        }
        else if (type == ArrowType.equipStrength) {
            //强化
            this.diamondLevelValue = "";
            this.zhanLevelValue = 0;
        } else if (type == ArrowType.equipUp) {
            //进阶
            this.itemCount = "";
            this.zhanLevelValue = 0;
        }
        else if (type == ArrowType.equipMingWen) {
            //宝石
            this.zhanLevelValue = 0;
        }
        else if (type == ArrowType.equipFuHun || type == ArrowType.equipXiLian) {
            //锻造|洗练
            this.itemCount = "";
            this.zhanLevelValue = 0;
        }
        else if (type == ArrowType.equipLianQi) {
            //附魔
            this.itemCount = "";
            //this.stageValue = 0;
        }
    }


    private isShowIconArrow(type: ArrowType) {
        this.setFlagForbid(false);
        if (this.isNeedShowArrow) {
            if (type == ArrowType.none) {
                this.showArrow = false;
            } else if (type == ArrowType.bag) {
                this.showArrow = this.equipIsShowArrow();
                this.arrowAnimEnabel = false;
            } else if (type == ArrowType.equipStrength) {
                //是否 强化 进阶 显示箭头
                let tempItem = new ThingItemData();
                tempItem.config = this.itemConfig;
                tempItem.data = this.thingInfo;
                this.showArrow = G.DataMgr.equipStrengthenData.getOneEquipCanStrenth(tempItem) > 0;
                this.arrowAnimEnabel = true;
            } else if (type == ArrowType.equipUp) {
                //是否 强化 进阶 显示箭头
                let tempItem = new ThingItemData();
                tempItem.config = this.itemConfig;
                tempItem.data = this.thingInfo;
                this.showArrow = G.DataMgr.equipStrengthenData.getOneEquipCanUpLevel(tempItem) > 0;
                this.arrowAnimEnabel = true;
            } else if (type == ArrowType.equipPartLvUp) {
                //是否 强化 进阶 显示箭头
                let tempItem = new ThingItemData();
                tempItem.config = this.itemConfig;
                tempItem.data = this.thingInfo;
                this.showArrow = G.DataMgr.equipStrengthenData.oneEquipPartIsCanLevelUp(tempItem);
                this.arrowAnimEnabel = true;
            } else if (type == ArrowType.equipMingWen) {
                let tempItem = new ThingItemData();
                tempItem.config = this.itemConfig;
                tempItem.data = this.thingInfo;
                this.showArrow = G.DataMgr.equipStrengthenData.isOneEquipCanInsert(tempItem);
                this.arrowAnimEnabel = true;
            }
            else if (type == ArrowType.wearRebirthEquip) {
                let tempItem = new ThingItemData();
                tempItem.config = this.itemConfig;
                tempItem.data = this.thingInfo;
                if (tempItem.config != null) {
                    //tempItem.zdl = FightingStrengthUtil.calStrength(tempItem.config.m_astBaseProp);
                    tempItem.zdl = G.DataMgr.hunliData.getHunguEquipFightS(this.itemConfig, this.thingInfo.m_stThingProperty.m_stSpecThingProperty);
                }
                //魂骨装备面板的itemicon的箭头显示 只比较背包
                this.showArrow = G.DataMgr.thingData.isShowHunguArrowAtPanel(tempItem, Macros.CONTAINER_TYPE_ROLE_BAG);
                //this.showArrow = G.DataMgr.equipStrengthenData.oneRebirthEquipRefineShowTipMark(tempItem);
                this.arrowAnimEnabel = true;
            }
            else if (type == ArrowType.personalHungu) {
                let tempItem = new ThingItemData();
                tempItem.config = this.itemConfig;
                tempItem.data = this.thingInfo;
                this.showArrow = G.DataMgr.equipStrengthenData.isHunguEquipAtPersonal(tempItem.config.m_iID);
                this.arrowAnimEnabel = true;
            } else if (type == ArrowType.equipXiLian) {
                let tempItem = new ThingItemData();
                tempItem.config = this.itemConfig;
                tempItem.data = this.thingInfo;
                this.showArrow = G.DataMgr.hunliData.hunGuXiLianData.oneHunGuCanXiLian(tempItem);
                this.arrowAnimEnabel = true;
            }
        } else {
            this.showArrow = false;
            this.arrowAnimEnabel = false;
        }
        //强化仅显示指定类型
        this.onlyShow(type);
    }


    //this.isBetterEquipInContainer(itemData, ThingData.getContainerByEquip(thingInfo.m_iThingID))

    private equipIsShowArrow(): boolean {
        if (this.itemConfig == null || this.thingInfo == null) return false;
        let isShowArraw: boolean = false;
        if (GameIDUtil.isEquipmentID(this.itemConfig.m_iID) || GameIDUtil.isAvatarID(this.itemConfig.m_iID)) {
            //当前物品战斗力
            let curfight = FightingStrengthUtil.getStrengthByEquip(this.itemConfig, this.thingInfo.m_stThingProperty.m_stSpecThingProperty);
            //当前物品部位
            let curEquipPart = this.itemConfig.m_iEquipPart;
            //伙伴id，祝福类keyword

            if (GameIDUtil.isPetEquipID(this.thingInfo.m_iThingID)) {
                if (!this.isCompareAllPetEquip) {
                    let pet: Protocol.NewBeautyInfo
                    if (this.itemConfig.m_iFunctionID > 0) {
                        pet = G.DataMgr.petData.getPetInfo(this.itemConfig.m_iFunctionID);
                    } else if (this.petOrZhufuId > 0) {
                        pet = G.DataMgr.petData.getPetInfo(this.petOrZhufuId);
                    }
                    if (pet == null) {
                        pet = G.DataMgr.petData.getFollowPet();
                    }
                    if (null != pet) {
                        isShowArraw = this.isBetterEquip(Macros.CONTAINER_TYPE_BEAUTY_EQUIP, PetData.EQUIP_NUM_PER_PET, curEquipPart, curfight, pet.m_iBeautyID);
                    }
                } else {
                    isShowArraw = G.DataMgr.petData.isBetterThanAllPetEquip(this.itemConfig, curfight);
                }
            } else {
                let itemData = new ThingItemData();
                itemData.config = this.itemConfig;
                itemData.data = this.thingInfo;
                itemData.containerID = this.containerID;
                itemData.zdl = curfight;
                let thingData = G.DataMgr.thingData;
                if (GameIDUtil.isRoleEquipID(this.itemConfig.m_iID)) {
                    isShowArraw = thingData.isBetterEquipInContainer(itemData, ThingData.getContainerByEquip(this.thingInfo.m_iThingID))
                }
                else if (GameIDUtil.isHunguEquipID(this.itemConfig.m_iID)) {
                    //背包内icon，魂骨逻辑：战斗力高，显示箭头；不能穿戴，显示“禁”的图标
                    let flagstate = thingData.isBetterHunguEquipInContainer(itemData, Macros.CONTAINER_TYPE_HUNGU_EQUIP);
                    isShowArraw = flagstate[0];
                    this.setFlagForbid(flagstate[1]);
                }
                else {
                    isShowArraw = thingData.isBetterOtherEquipInContainer(itemData, ThingData.getContainerByEquip(this.thingInfo.m_iThingID))
                }
            }

            //if (GameIDUtil.isRoleEquipID(this.thingInfo.m_iThingID)) {
            //    isShowArraw = this.isBetterEquip(Macros.CONTAINER_TYPE_ROLE_EQUIP, ThingData.All_EQUIP_NUM - 2, curEquipPart, curfight, 0);
            //}

            //else if (GameIDUtil.isOtherEquipID(this.thingInfo.m_iThingID)) {
            //    let containerId = G.DataMgr.zhufuData.getEquipPartMinByContainer(curEquipPart);
            //    let subId = G.DataMgr.zhufuData.getKeyWordByEquipPart(curEquipPart);
            //    isShowArraw = this.isBetterEquip(containerId, ZhufuData.All_OTHER_NUM, curEquipPart, curfight, subId);
            //}
        }
        return isShowArraw;
    }





    //private equipIsShowArrow(): boolean {
    //    if (this.itemConfig == null || this.thingInfo == null) return false;
    //    let isShowArraw: boolean = false;
    //    if (GameIDUtil.isEquipmentID(this.itemConfig.m_iID) || GameIDUtil.isAvatarID(this.itemConfig.m_iID)) {
    //        //当前物品战斗力
    //        let curfight = FightingStrengthUtil.getStrengthByEquip(this.itemConfig, this.thingInfo.m_stThingProperty.m_stSpecThingProperty);
    //        //当前物品部位
    //        let curEquipPart = this.itemConfig.m_iEquipPart;
    //        //伙伴id，祝福类keyword
    //        if (GameIDUtil.isRoleEquipID(this.thingInfo.m_iThingID)) {
    //            isShowArraw = this.isBetterEquip(Macros.CONTAINER_TYPE_ROLE_EQUIP, ThingData.All_EQUIP_NUM - 2, curEquipPart, curfight, 0);
    //        }
    //        else if (GameIDUtil.isPetEquipID(this.thingInfo.m_iThingID)) {

    //            if (!this.isCompareAllPetEquip) {
    //                let pet: Protocol.NewBeautyInfo
    //                if (this.itemConfig.m_iFunctionID > 0) {
    //                    pet = G.DataMgr.petData.getPetInfo(this.itemConfig.m_iFunctionID);
    //                } else if (this.petOrZhufuId > 0) {
    //                    pet = G.DataMgr.petData.getPetInfo(this.petOrZhufuId);
    //                }
    //                if (pet == null) {
    //                    pet = G.DataMgr.petData.getFollowPet();
    //                }

    //                if (null != pet) {
    //                    isShowArraw = this.isBetterEquip(Macros.CONTAINER_TYPE_BEAUTY_EQUIP, PetData.EQUIP_NUM_PER_PET, curEquipPart, curfight, pet.m_iBeautyID);
    //                }
    //            } else {
    //                isShowArraw = G.DataMgr.petData.isBetterThanAllPetEquip(this.itemConfig, curfight);
    //            }


    //        }
    //        else if (GameIDUtil.isOtherEquipID(this.thingInfo.m_iThingID)) {
    //            let containerId = G.DataMgr.zhufuData.getEquipPartMinByContainer(curEquipPart);
    //            let subId = G.DataMgr.zhufuData.getKeyWordByEquipPart(curEquipPart);
    //            isShowArraw = this.isBetterEquip(containerId, ZhufuData.All_OTHER_NUM, curEquipPart, curfight, subId);
    //        }
    //    }
    //    return isShowArraw;
    //}

    /**
     * 当前图标是否是更好的装备
     * @param containerId 当前装备图标对应-装备容器
     * @param equipNum 装备的数量
     * @param curEquipPart 当前装备的部位
     * @param curEquipFight 当前装备的战斗力
     */
    private isBetterEquip(containerId: number, equipNum: number, curEquipPart: number, curEquipFight: number, curId: number): boolean {
        let isBetter: boolean = false;
        let isPetEquip: boolean = false;
        let heroEquipList = G.DataMgr.thingData.getContainer(containerId);
        let tempThingInfo: ThingItemData;
        //得到个类型装备限制条件
        let datas = null;
        let limit: number = 0;
        if (containerId == Macros.CONTAINER_TYPE_ROLE_EQUIP) {
            datas = null;
        } else if (containerId == Macros.CONTAINER_TYPE_BEAUTY_EQUIP) {
            datas = G.DataMgr.petData.getPetInfo(curId);
            limit = datas.m_uiStage;
            isPetEquip = true;
        } else {
            datas = G.DataMgr.zhufuData.getData(curId);
            limit = datas.m_ucLevel;
        }
        //人物（屏蔽精灵，婚戒）|伙伴|祝福
        for (let i: number = 0; i < equipNum; i++) {
            if (containerId == Macros.CONTAINER_TYPE_BEAUTY_EQUIP) {
                //区分不同伙伴穿戴的装备
                let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(curId);
                let pos = config.m_uiEquipPosition + i;
                tempThingInfo = heroEquipList[pos];
            } else {
                tempThingInfo = heroEquipList[i];
            }

            let equipPart: number = -1;
            if (containerId == Macros.CONTAINER_TYPE_ROLE_EQUIP) {
                equipPart = KeyWord.EQUIP_PARTCLASS_MIN + i;
            } else if (containerId == Macros.CONTAINER_TYPE_BEAUTY_EQUIP) {
                equipPart = KeyWord.EQUIP_PARTCLASS_ARMET + i;
            } else {
                equipPart = Math.floor(curEquipPart / 10) * 10 + i;
            }
            if (tempThingInfo == undefined || tempThingInfo == null) {

                //身上没穿戴
                if (curEquipPart == equipPart /*&& this.itemConfig.m_ucRequiredLevel <= limit*/) {
                    if (isPetEquip && equipPart != KeyWord.EQUIP_PARTCLASS_BINHUN && equipPart != KeyWord.EQUIP_PARTCLASS_BRACELET) {
                        let awakenStage = G.DataMgr.petData.getPetInfo(curId).m_stAwake.m_ucLevel;
                        if (this.itemConfig.m_ucRequiredLevel <= awakenStage) {
                            isBetter = true;
                            break;
                        }
                        else {
                            isBetter = false;
                        }
                    }
                    else {
                        if (this.itemConfig.m_ucRequiredLevel <= limit) {
                            isBetter = true;
                            break;
                        }
                        else {
                            isBetter = false;

                        }
                    }
                } else {
                    isBetter = false;
                }

            } else {

                //穿戴
                let wearEquipPart = tempThingInfo.config.m_iEquipPart;
                let curEquipPart = this.itemConfig.m_iEquipPart;
                let wearfight = tempThingInfo.zdl;
                //此处为人物装备
                if (datas == null) {
                    if (wearEquipPart == curEquipPart && curEquipFight > wearfight) {
                        isBetter = true;
                        break;
                    } else {
                        isBetter = false;
                    }
                } else {
                    //伙伴。祝福装备
                    if (wearEquipPart == curEquipPart && curEquipFight > wearfight /*&& this.itemConfig.m_ucRequiredLevel <= limit*/) {
                        if (isPetEquip && equipPart != KeyWord.EQUIP_PARTCLASS_BINHUN && equipPart != KeyWord.EQUIP_PARTCLASS_BRACELET) {
                            let awakenStage = G.DataMgr.petData.getPetInfo(curId).m_stAwake.m_ucLevel;
                            if (this.itemConfig.m_ucRequiredLevel <= awakenStage) {
                                isBetter = true;
                                break;
                            }
                            else {
                                isBetter = false;
                            }
                        }
                        else {
                            if (this.itemConfig.m_ucRequiredLevel <= limit) {
                                isBetter = true;
                                break;
                            }
                            else {
                                isBetter = false;

                            }
                        }

                    } else {
                        isBetter = false;
                    }
                }
            }
        }

        return isBetter;
    }

    private _setDiamondLevel(itemConfig: GameConfig.ThingConfigM) {
        if (null == itemConfig) {
            this.diamondLevelValue = null;
            return;
        }
        if (itemConfig.m_iMainClass == KeyWord.ITEM_MAINCLASS_DIAMOND) {
            this.diamondLevelValue = uts.format('{0}级', EquipUtils.getDiamondLevel(itemConfig.m_iID));
        }
        else if (itemConfig.m_iMainClass == KeyWord.ITEM_MAINCLASS_TASK) {
            // 任务卷轴
            this.diamondLevelValue = uts.format('{0}星', itemConfig.m_iDropLevel);
        }
        //else if (GameIDUtil.isOtherEquipID(itemConfig.m_iID)) {
        //this.diamondLevelValue = uts.format('{0}阶', GameIDUtil.getEquipStageById(itemConfig.m_iID));
        //}
        else if (GameIDUtil.isPetEquipID(itemConfig.m_iID) || GameIDUtil.isOtherEquipID(itemConfig.m_iID)) {
            this.diamondLevelValue = uts.format('{0}星', itemConfig.m_ucStage);
        } else if (itemConfig.m_ucFunctionType == KeyWord.ITEM_FUNCTION_LQ_LUCK) {
            this.diamondLevelValue = uts.format('{0}级', Math.floor(itemConfig.m_iID / 10) % 1037700);
        }
        else if (GameIDUtil.isHunguEquipID(itemConfig.m_iID)) {
            this.diamondLevelValue = "";
        }
        else if (GameIDUtil.isRoleEquipID(itemConfig.m_iID) && KeyWord.EQUIP_PARTCLASS_LINGBAO != itemConfig.m_iEquipPart) {
            if (KeyWord.EQUIP_PARTCLASS_WING != itemConfig.m_iEquipPart) {
                this.diamondLevelValue = uts.format('{0}阶', itemConfig.m_ucStage);
            } else {
                this.diamondLevelValue = uts.format('{0}代', itemConfig.m_ucStage);
            }
        }
        else {
            let newId: number = Math.floor(itemConfig.m_iID / 1000);
            if (Constants.ID_LIST_JI_1.indexOf(newId) > -1) {
                this.diamondLevelValue = uts.format('{0}级', EquipUtils.getDiamondLevel(itemConfig.m_iID));
            }
            else if (Constants.ID_LIST_JIE_3.indexOf(newId) > -1) {
                this.diamondLevelValue = uts.format('{0}阶', EquipUtils.getDiamondLevel(itemConfig.m_iID) + 2);
            }
            else if (Constants.ID_LIST_JIE_1.indexOf(newId) > -1) {
                this.diamondLevelValue = uts.format('{0}阶', EquipUtils.getDiamondLevel(itemConfig.m_iID));
            }
            else if (Constants.ID_LIST_CENG_1.indexOf(newId) > -1) {
                this.diamondLevelValue = uts.format('{0}层', EquipUtils.getDiamondLevel(itemConfig.m_iID));
            }
            else if (Math.floor(itemConfig.m_iID / 100) == 102278) {
                this.diamondLevelValue = uts.format('{0}阶', Math.floor(itemConfig.m_iID / 10) % 10 + 1);
            }
            else {
                this.diamondLevelValue = null;
            }
        }
    }

    private updateTimeIcon() {
        if (this.itemConfig && this.itemConfig.m_ucPersistTimeType > 0) {
            if (null != this.thingInfo && this.thingInfo.m_stThingProperty.m_iPersistTime > 0) {
                if (this.thingInfo.m_stThingProperty.m_iPersistTime < G.SyncTime.getCurrentTime() / 1000) {
                    this.showTimeLimit = false;
                }
                else {
                    this.showTimeLimit = true;
                }
                this.showTimeImage = true;
            }
            else {
                this.showTimeLimit = true;
                this.showTimeImage = true;
            }
        }
        else {
            this.showTimeLimit = false;
            this.showTimeImage = false;
        }

        // if (null != this.thingInfo && this.thingInfo.m_stThingProperty.m_iPersistTime > 0) {
        //     if (this.thingInfo.m_stThingProperty.m_iPersistTime < G.SyncTime.getCurrentTime() / 1000) {
        //         this.showTimeLimit = false;
        //     }
        //     else {
        //         this.showTimeLimit = true;
        //     }
        //     this.showTimeImage = true;
        // }
        // else {
        //     this.showTimeImage = false;
        // }
    }

    private setFlagForbid(active: boolean) {
        if (this.flagForbid)
            this.flagForbid.SetActive(active);
    }

    /**
    * 空显示
    *
    */
    reset(): void {
        G.ResourceMgr.loadIcon(this.m_iconImage, null, -1);
        this.frameColor = 0;
        this.frameZi = 0;
        this.showLock = false;
        this.zhanLevelValue = 0;
        this.diamondLevelValue = null;
        this.showTimeImage = false;
        this.itemCount = null;
        this.equipValue = null;
        this.showArrow = false;
        this.equipIsNullShowTip = false;
        this.showTao = false;
        this.arrowAnimEnabel = false;
        if (null != this.m_colorEffect) {
            UnityEngine.GameObject.Destroy(this.m_colorEffect);
            this.m_colorEffect = null;
        }
        this.showReplace = false;
        if (this.flagIntensify) {
            this.flagIntensify.SetActive(false);
        }
        if (this.flagInject) {
            this.flagInject.SetActive(false);
        }
        if (this.flagStarLevel) {
            this.flagStarLevel.SetActive(false);
        }
        this.setFlagForbid(false);
    }

    getTipData(): ITipData {
        if (this.isBlank) {
            return null;
        }

        if (null != this.tipStr) {
            // 文本tip
            if (null == this.m_textTipData) {
                this.m_textTipData = new TextTipData();
            }
            this.m_textTipData.setTipData(this.tipStr);
            return this.m_textTipData;
        } else {
            if (null == this.m_itemTipData) {
                this.m_itemTipData = new ItemTipData();
            }
            this.m_itemTipData.containerID = this.containerID;
            this.m_itemTipData.petOrZhufuId = this.petOrZhufuId;
            this.m_itemTipData.isPreviewWuCaiEquip = this.isPreviewWuCaiEquip;
            this.m_itemTipData.isPrevFuHun = this.isPrevFuHun;
            if (this.thingInfo != null) {
                this.m_itemTipData.bagPos = this.thingInfo.m_usPosition;
            }
            if (this.itemConfig && this.itemConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) {
                this.m_itemTipData.wingEquipLv = this.thingInfo ? this.thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress : this.wingEquipLv;
            }

            this.m_itemTipData.setTipData(this.itemConfig, this.thingInfo);
            return this.m_itemTipData;
        }
    }

    setTipFrom(tipFrom: TipFrom, tag: number = 0, num: number = 0) {
        this.tag = tag;
        this.nums = num;

        let oldTipFrom = this.tipFrom;
        this.tipFrom = tipFrom;
        if (null != this.tipHolder) {
            if (TipFrom.none != tipFrom) {
                // 自动加上
                if (TipFrom.none == oldTipFrom) {
                    Game.UIClickListener.Get(this.tipHolder).onClick = delegate(this, this.onClick);
                }
            } else {
                if (TipFrom.none != oldTipFrom) {
                    Game.UIClickListener.Get(this.tipHolder).onClick = null;
                }
            }
        }
    }

    private onClick() {
        if (TipFrom.none != this.tipFrom && !this.isBlank) {
            let FunctionType: number = 0;
            if (this.itemConfig != null) {
                FunctionType = this.itemConfig.m_ucFunctionType;
            }

            let useType: number = 0;
            //圣器、时装、幻化、武缘
            if (FunctionType != 0 && FunctionType == KeyWord.ITEM_FUNCTION_SUBIMAGE || FunctionType == KeyWord.ITEM_FUNCTION_DRESS_IMAGE
                || FunctionType == KeyWord.ITEM_FUNCTION_SQ_CARD || FunctionType == KeyWord.ITEM_FUNCTION_BEAUTY_CARD
                || (FunctionType == KeyWord.ITEM_FUNCTION_WING_SHOW && !this.isCanContrast())) {

                if (FunctionType == KeyWord.ITEM_FUNCTION_WING_SHOW) {
                    G.ViewCacher.shapeCardTipsView.open(this.itemConfig, FunctionType, this.tipFrom, this.thingInfo, this.m_itemTipData.wingEquipLv);
                }
                else {
                    G.ViewCacher.shapeCardTipsView.open(this.itemConfig, FunctionType, this.tipFrom, this.thingInfo, this.getLevel());
                }
            }

            else if (FunctionType != 0 && FunctionType == KeyWord.ITEM_FUNCTION_TITLECARD) {
                G.ViewCacher.chengHaoCardTipsView.open(this.itemConfig, this.tipFrom, this.thingInfo);
            }
            else {
                G.ViewCacher.tipsView.open(this.getTipData(), this.tipFrom, this.isGetNextStrengLv, this.isGetNextPartLv, this.tag, this.nums);
            }

            //G.ViewCacher.tipsView.open(this.getTipData(), this.tipFrom);
            this.invokeOnClick();
        }
    }

    actionOnClickItem: (go: UnityEngine.GameObject, index: number) => {};
    private indexExhibition: number;
    private invokeOnClick() {
        if (this.actionOnClickItem != null)
            return this.actionOnClickItem(this.gameObject, this.indexExhibition);
    }

    private getLevel(): number {
        let m_iFunctionID = this.itemConfig.m_iFunctionID;
        let m_iTargetID = this.itemConfig.m_iTargetID;
        let zhufuData = G.DataMgr.zhufuData;
        let iddata = zhufuData.getImageID(m_iTargetID);
        if (!iddata)
            return 0;
        for (let i = 0, len = iddata.length; i < len; i++) {
            let data = iddata[i];
            if (zhufuData.getImageUnLevelID(data) != m_iFunctionID) {
                continue;
            }
            if (zhufuData.isActive(m_iTargetID, data)) {

                return zhufuData.getImageLevel(data);
            }
        }
        return 0;
    }

    set effectRule(value: EnumEffectRule) {
        if (this.m_effectRule != value) {
            this.m_effectRule = value;
            this.updateEffect();
        }
    }

    private isNeedEffect(effectRule: EnumEffectRule, color: number, state: EnumRewardState = 1): boolean {
        if (EnumEffectRule.none == effectRule || (EnumEffectRule.reward == effectRule && state == EnumRewardState.HasGot)) {
            return false;
        }
        return IconItem.NeedShowColors.indexOf(color) >= 0;
    }

    private isPetEquipCanReplaceByAwaken(stage: number): boolean {
        let awakenStage = G.DataMgr.petData.getPetInfo(G.DataMgr.petData.currentHongYanData.m_iBeautyID).m_stAwake.m_ucLevel;
        if (awakenStage == 0) {
            if (stage >= 0 && stage <= 6) return true;
        }
        else if (awakenStage == 1) {
            if (stage >= 0 && stage <= 9) return true;
        }
        else if (awakenStage == 2) {
            if (stage >= 0 && stage <= 12) return true;
        }
        else if (awakenStage == 3) {
            if (stage >= 0 && stage <= 15) return true;
        }
        else if (awakenStage == 4) {
            if (stage >= 0 && stage <= 18) return true;
        }
        else if (awakenStage == 5) {
            if (stage >= 0 && stage <= 20) return true;
        }
        return false;
    }


    isCanContrast(): boolean {
        if (TipType.ITEM_TIP == this.getTipData().tipDataType) {
            // 物品tip需要检查是否需要对比
            let itemTipData = this.getTipData() as ItemTipData;
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
                    let weared = G.DataMgr.thingData.getWearedEquip(itemTipData.configData.m_iID, itemTipData.petOrZhufuId);
                    if (null != weared) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    getConfig(): GameConfig.ThingConfigM {
        return this.itemConfig;
    }

    showIconImage(isShow: boolean): void {
        this.m_iconImage.gameObject.SetActive(false);
    }

    /**关闭数量显示 */
    closeItemCount() {
        this.m_numText.gameObject.SetActive(false);
        //this.itemCount = "";
    }

    openItemCount() {
        this.m_numText.gameObject.SetActive(true);
        //this.itemCount = "";
    }

    setItemNumber(index: number) {
        if (index <= 1) {
            this.closeItemCount();
        }
        else {
            this.openItemCount();
            this.m_numText.text = index.toString();
        }
    }

    /**关闭装备位文字显示 */
    closeEquipText() {
        if (this.m_equipText != null)
            this.m_equipText.gameObject.SetActive(false);
    }

    /**打开向上箭头 */
    public openArrow() {
        this.showArrow = true;
        this.arrowAnimEnabel = true;
    }

    /**获取数量组件里边的内容 */
    public getNumberString(): string {
        return this.m_numText.text;
    }

    public setIndex(index: number) {
        this.indexExhibition = index;
    }

    private isShowStarLevelFlag = true;
    /**星级（年代）角标样式 1斜的 2竖的 */
    private showStarLevelType = 1;
    public closeStarLevelFlag() {
        this.isShowStarLevelFlag = false;
        if (this.flagStarLevel)
            this.flagStarLevel.SetActive(false);
    }
    public openStarLevelFlag() {
        this.isShowStarLevelFlag = true;
        if (this.flagStarLevel)
            this.flagStarLevel.SetActive(true);
    }
    /**
     * 设置星级（年代）角标样式
     * @param type 1斜的 2竖的
     */
    public setStarLevelType(type: number) {
        this.showStarLevelType = type;
        this.flagStarLevelSla.SetActive(type == 1);
        this.flagStarLevelVer.SetActive(type == 2);
    }

    private setStarLevelNumber(val: number) {
        let des = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, val);
        des = des.replace("魂骨", "");
        if (this.showStarLevelType == 1) {
            this.txtStarLevelSla.text = des;
        }
        else if (this.showStarLevelType == 2) {
            this.txtStarLevelVer.text = des;
        }
    }

    public setStarLevelFlagScale(scale: number) {
        Game.Tools.SetGameObjectLocalScale(this.flagStarLevel.gameObject, scale, scale, scale);
    }

    /**
     * 设置透明度
     * @param alpha 0-1范围
     */
    public setIconAlpha(alpha: number) {
        let color: UnityEngine.Color = new UnityEngine.Color(1, 1, 1, alpha);
        this.m_iconImage.color = color;
        this.m_bgImage.color = color;
        this.m_lockImage.color = color;
        this.m_colorImage.color = color;
        //宝箱的等级图标隐藏
        this.m_imgLvBg.color = color;
        this.m_lvText.color = color;
    }
    /**设置icon的透明度 */
    isShowIcon(alpha: number) {
        let color: UnityEngine.Color = new UnityEngine.Color(1, 1, 1, alpha);
        this.m_iconImage.color = color;
    }

    public setBackgroundColor(color: number) {
        this.frameColor = color;
    }

    public setIconById(id: number) {
        G.ResourceMgr.loadIcon(this.m_iconImage, id.toString(), -1);
    }

    public setHunguDropLevel(drop: number) {
        if (drop > 0) {
            this.setStarLevelType(1);
            this.flagStarLevel.SetActive(true);
            this.setStarLevelNumber(drop);
        }
        else {
            this.closeStarLevelFlag();
        }
    }
}
