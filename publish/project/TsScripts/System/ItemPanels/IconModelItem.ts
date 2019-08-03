import { ThingData } from "System/data/thing/ThingData";
import { Global as G } from "System/global";
import { KeyWord } from "../constants/KeyWord";
import { ThingItemData } from "../data/thing/ThingItemData";
import { Macros } from "../protocol/Macros";
import { GameObjectGetSet, TextGetSet } from "../uilib/CommonForm";
import { ElemFinder } from "../uilib/UiUtility";
import { Color } from "../utils/ColorUtil";
import { GameIDUtil } from "../utils/GameIDUtil";
import { TextFieldUtil } from "../utils/TextFieldUtil";
import { ITipData } from "../tip/tipData/ITipData";
import { ItemTipData } from "../tip/tipData/ItemTipData";

export enum CircleIconType {
    Normal,
    /**魂骨装备面板 */
    HunguContainer,
    /**魂骨封装面板 */
    HunguFZ,
    /**魂骨升级 */
    HunGuSJ,
    /**魂骨强化 */
    HunguStreng,
    /**魂骨升华 */
    HunguMerge
}

export class IconModelItem {
    private textNode: GameObjectGetSet;
    private flagNode: GameObjectGetSet;
    private modelNode: GameObjectGetSet;
    private backgroundNode: GameObjectGetSet;
    private tweenNode: GameObjectGetSet;
    private buttonEffectNode: GameObjectGetSet;

    private imgIcon: UnityEngine.UI.RawImage;
    private flagIntensify: GameObjectGetSet;
    private flagInject: GameObjectGetSet;
    private flagSelected: GameObjectGetSet;
    private selestedColor: { [color: number]: GameObjectGetSet } = {};
    private flagColor: UnityEngine.UI.Image;
    private effArrow: GameObjectGetSet;

    private flagStarLevel: GameObjectGetSet;
    private txtStarLevel: TextGetSet;
    private txtStrengLevel: TextGetSet;

    private imgBackground: GameObjectGetSet;


    private itemConfig: GameConfig.ThingConfigM;
    private thingInfo: Protocol.ContainerThingInfo;
    private containerType: CircleIconType = CircleIconType.Normal;
    private flagEquipPart: number = -1;
    private isOpenStarLevelFlag: boolean = true;


    private btnMenuPrefab: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.textNode = new GameObjectGetSet(ElemFinder.findObject(go, "textNode"));
        this.flagNode = new GameObjectGetSet(ElemFinder.findObject(go, "flagNode"));
        this.modelNode = new GameObjectGetSet(ElemFinder.findObject(go, "modelNode"));
        this.backgroundNode = new GameObjectGetSet(ElemFinder.findObject(go, "backgroundNode"));
        this.tweenNode = new GameObjectGetSet(ElemFinder.findObject(go, "tweenNode"));
        this.buttonEffectNode = new GameObjectGetSet(ElemFinder.findObject(go, "buttonEffectNode"));

        this.imgIcon = ElemFinder.findRawImage(this.modelNode.gameObject, "imgIcon");
        this.flagIntensify = new GameObjectGetSet(ElemFinder.findObject(this.flagNode.gameObject, "flagIntensify"));
        this.flagInject = new GameObjectGetSet(ElemFinder.findObject(this.flagNode.gameObject, "flagInject"));
        this.flagSelected = new GameObjectGetSet(ElemFinder.findObject(this.backgroundNode.gameObject, "flagSelected"));
        this.flagColor = ElemFinder.findImage(this.backgroundNode.gameObject, "flagColor");
        this.flagStarLevel = new GameObjectGetSet(ElemFinder.findObject(this.flagNode.gameObject, "flagStarLevel"));
        this.txtStarLevel = new TextGetSet(ElemFinder.findText(this.flagStarLevel.gameObject, "txtStarLevel"));
        this.txtStrengLevel = new TextGetSet(ElemFinder.findText(this.flagNode.gameObject, "txtStrengLevel"));

        this.imgBackground = new GameObjectGetSet(ElemFinder.findObject(this.backgroundNode.gameObject, "imgBackground"));


        this.effArrow = new GameObjectGetSet(ElemFinder.findObject(go, "effArrow"));
        this.btnMenuPrefab = ElemFinder.findObject(this.tweenNode.gameObject, "btnMenu");

        // let len = KeyWord.COLOR_WUCAI - KeyWord.COLOR_WHITE + 2;
        // let item = this.backgroundNode.gameObject;
        // for (let j = 0; j < len; j++) {
        //     if (j == len - 1) {
        //         let color = ElemFinder.findObject(item, "flagSelected/node");
        //         if (color != null)
        //             this.selestedColor[0] = new GameObjectGetSet(color);
        //         continue;
        //     }
        //     let inde = KeyWord.COLOR_WHITE + j;
        //     let color = ElemFinder.findObject(item, uts.format("flagSelected/{0}", inde.toString()));
        //     if (color != null)
        //         this.selestedColor[inde] = new GameObjectGetSet(color);
        // }
    }

    /**
     * 生成预制体
     * @param slotTemplate 预制体
     * @param slotRoot 节点
     */
    setIconByPrefab(slotTemplate: UnityEngine.GameObject, slotRoot: UnityEngine.GameObject) {
        let slotPrefab = UnityEngine.GameObject.Instantiate(slotTemplate) as UnityEngine.GameObject;
        slotPrefab.transform.SetParent(slotRoot.transform, false);
        slotPrefab.transform.localPosition = UnityEngine.Vector3.zero;
        let rectTransform = slotPrefab.transform as UnityEngine.RectTransform;
        rectTransform.sizeDelta = (slotRoot.transform as UnityEngine.RectTransform).sizeDelta;
        slotPrefab.SetActive(true);
        this.setComponents(slotPrefab);
    }

    /**
     * 设置容器类型
     * @param iconType 
     */
    setIconType(iconType: CircleIconType) {
        this.containerType = iconType;
    }

    setEquipPart(part: number) {
        this.flagEquipPart = part;
    }

    /**
     * 更新 魂骨装备
     * @param equipId 
     * @param spaceProperty 
     */
    setHunguEquipIcon(thingItem: ThingItemData) {
        if (thingItem == null) {
            this.setIconModelNull();
            return;
        }
        this.itemConfig = thingItem.config;
        this.thingInfo = thingItem.data;
    }


    /**
     * 更新 魂骨装备
     * @param equipId 
     * @param spaceProperty 
     */
    setHunguEquipIconById(id: number) {
        if (id <= 0) {
            this.setIconModelNull();
            return;
        }
        this.itemConfig = ThingData.getThingConfig(id);
        this.thingInfo = null;
        //let thingItemData = G.DataMgr.thingData.getItemDataInContainer(this.itemConfig.m_iEquipPart % KeyWord.HUNGU_EQUIP_PARTCLASS_MIN, Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        // if (thingItemData) {
        //     this.thingInfo = thingItemData.data;
        // } else {
        //     this.thingInfo = null;
        // }
    }

    /**
     * 设置为空
     * @param part 
     */
    setIconModelNull() {
        this.itemConfig = null;
        this.thingInfo = null;
    }

    updateIconShow() {
        //设置选中框状态(会变色的。。。)
        this.refreshSelected();

        //本地数据操作
        //设置图标
        this.refreshIcon();
        //设置颜色框
        this.refreshQualityColor();

        //特殊数据操作
        //设置封装标记
        this.refreshFlagIntensify();
        //设置升级标记
        this.refreshFlagArrow();
        //设置星级
        this.setStarLevel();
        //设置强化等级
        this.setStrengLevel();
    }


    private refreshSelected() {
        if (this.flagSelected.activeSelf)
            this.selectedOpen();
    }

    private refreshIcon() {
        if (this.itemConfig == null) {
            this.imgIcon.gameObject.SetActive(false);
        }
        else {
            this.imgIcon.gameObject.SetActive(true);
            G.ResourceMgr.loadIcon(this.imgIcon, this.itemConfig.m_szIconID.toString(), -1);
        }
    }

    private refreshQualityColor() {
        if (this.itemConfig == null) {
            this.flagColor.gameObject.SetActive(false);
        }
        else {
            this.flagColor.gameObject.SetActive(true);
            //品质框改 成换颜色啦
            // this.flagColor.sprite = IconItem.ColorExhibitionAltas.Get(this.itemConfig.m_ucColor.toString());
            this.flagColor.color = Color.toUnityColor(G.DataMgr.hunliData.getQualityIndexForColor(this.itemConfig.m_ucColor));
        }
    }

    private refreshFlagIntensify() {
        if (this.itemConfig == null) {
            this.flagIntensify.SetActive(false);
            this.flagInject.SetActive(false);
            return;
        }

        if (GameIDUtil.isHunguEquipID(this.itemConfig.m_iID)) {
            if (this.thingInfo) {
                let inte = this.thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel > 0;
                let inje = this.thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_stSkillFZ.m_iItemID > 0;
                if (inje) {
                    this.flagInject.SetActive(true);
                    this.flagIntensify.SetActive(false);
                }
                else if (inte) {
                    this.flagInject.SetActive(false);
                    this.flagIntensify.SetActive(true);
                }
                else {
                    this.flagInject.SetActive(false);
                    this.flagIntensify.SetActive(false);
                }
                this.flagIntensify.SetActive(this.thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel > 0);
            } else {
                this.flagIntensify.SetActive(false);
                this.flagInject.SetActive(false);
            }
        }
        else {
            this.flagIntensify.SetActive(false);
            this.flagInject.SetActive(false);
        }
    }

    private refreshFlagArrow() {
        let isShow = false;
        let tempItem = new ThingItemData();
        switch (this.containerType) {
            case CircleIconType.Normal:
                //关闭
                break;
            case CircleIconType.HunguContainer:
                //有更好的打开
                tempItem.config = this.itemConfig;
                tempItem.data = this.thingInfo;
                //魂骨装备面板的itemicon的箭头显示 只比较背包
                if (this.itemConfig != null)
                    isShow = G.DataMgr.thingData.isShowHunguArrowAtPanel(tempItem, Macros.CONTAINER_TYPE_ROLE_BAG);
                else {
                    if (this.flagEquipPart != -1)
                        isShow = G.DataMgr.thingData.isShowHunguArrowAtPanelNone(this.flagEquipPart);
                }
                break;
            case CircleIconType.HunguFZ:
                //可以封装 打开
                if (this.itemConfig == null)
                    isShow = false;
                else
                    isShow = G.DataMgr.hunliData.hunguIntensifyData.isOnceHunguFZ(this.itemConfig.m_iEquipPart);
                break;
            case CircleIconType.HunGuSJ:
                //可以封装 打开
                if (this.itemConfig == null)
                    isShow = false;
                else
                    isShow = G.DataMgr.hunliData.isOnceHunguSJ(this.itemConfig.m_iEquipPart);
                break;
            case CircleIconType.HunguStreng:
                //可以强化 打开
                if (this.itemConfig == null)
                    isShow = false;
                else
                    isShow = G.DataMgr.hunliData.hunguStrengeData.isCanStreng(this.itemConfig);
                break;
            default:
                break;

        }
        this.effArrow.SetActive(isShow);
    }

    private setStarLevel() {
        if (this.itemConfig == null) {
            this.hideStarLevelFlag();
        }
        else {
            this.showStarLevelFlag();
            //升华界面显示星级，其余的显示年代
            if (this.containerType == CircleIconType.HunguMerge) {
                this.txtStarLevel.text = uts.format("{0}星", TextFieldUtil.NUMBER_LIST[this.itemConfig.m_ucStage]);
            }
            else {
                let des = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, this.itemConfig.m_iDropLevel);
                this.txtStarLevel.text = des.replace("魂骨", "");
            }
        }
    }

    private setStrengLevel() {
        if (this.containerType == CircleIconType.HunguStreng && this.itemConfig != null) {
            let level = G.DataMgr.hunliData.hunguStrengeData.getEquipLevelByIndex(this.itemConfig.m_iEquipPart - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN);
            this.txtStrengLevel.text = uts.format("+{0}", level);
        }
        else {
            this.txtStrengLevel.text = "";
        }
    }

    private m_itemTipData: ItemTipData = new ItemTipData();
    getTipData(): ITipData {

        if (null == this.m_itemTipData) {
            this.m_itemTipData = new ItemTipData();
        }
        // this.m_itemTipData.containerID = this.containerID;
        // this.m_itemTipData.petOrZhufuId = this.petOrZhufuId;
        // this.m_itemTipData.isPreviewWuCaiEquip = this.isPreviewWuCaiEquip;
        // this.m_itemTipData.isPrevFuHun = this.isPrevFuHun;
        // if (this.thingInfo != null) {
        //     this.m_itemTipData.bagPos = this.thingInfo.m_usPosition;
        // }
        // if (this.itemConfig && this.itemConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) {
        //     this.m_itemTipData.wingEquipLv = this.thingInfo ? this.thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress : this.wingEquipLv;
        // }

        this.m_itemTipData.setTipData(this.itemConfig, this.thingInfo);
        return this.m_itemTipData;
    }

    playButtonEffect(sortingOrder: number = 0) {
        // G.ResourceMgr.loadModel(this.buttonEffectNode.gameObject, UnitCtrlType.other, 'effect/uitx/dianji/dianjigx.prefab', sortingOrder);
        // this.buttonEffectNode.SetActive(false);
        // this.buttonEffectNode.SetActive(true);
    }

    stopButtonEffect() {
        this.buttonEffectNode.SetActive(false);
    }

    selectedOpen() {
        // if (data != null)
        //     this.imgEffFire.color = Color.toUnityColor(G.DataMgr.hunliData.dicColor[data.m_ucColor]);
        this.flagSelected.SetActive(true);
        // if (this.selestedColor != null) {
        //     for (let c in this.selestedColor) {
        //         this.selestedColor[c].SetActive(false);
        //     }
        //     if (this.itemConfig != null) {
        //         let color = this.selestedColor[this.itemConfig.m_ucColor];
        //         if (color != null)
        //             color.SetActive(true);
        //     }
        //     else {
        //         let color = this.selestedColor[0];
        //         if (color != null)
        //             color.SetActive(true);
        //     }
        // }
    }

    selectedClose() {
        this.flagSelected.SetActive(false);
    }

    private btnMenuTweensPos: Tween.TweenPosition[] = [];
    private btnMenuGameObjects: UnityEngine.GameObject[] = [];
    private angle: number = 45;
    private distance: number = 75;

    openMenuForTween(num: number) {
        let maxangle = num * this.angle;
        let halfangle = maxangle / 2;
        for (let i = 0; i < num; i++) {
            let x = Math.cos((halfangle - this.angle * i) * Math.PI / 180);
            let y = Math.sin((halfangle - this.angle * i) * Math.PI / 180);
            if (this.btnMenuGameObjects[i] == null) {
                let go = UnityEngine.GameObject.Instantiate(this.btnMenuPrefab, this.tweenNode.transform, false) as UnityEngine.GameObject;


                this.btnMenuGameObjects[i] = go;
            }
            if (this.btnMenuTweensPos[i] == null) {
                let go = this.btnMenuGameObjects[i];
                // let endpos = new UnityEngine.Vector3(x * this.distance, y * this.distance, 0);
                let tween = Tween.TweenPosition.Begin(go, 0.2 + i * 0.05, UnityEngine.Vector3.zero, false);
                tween.method = Tween.UITweener.Method.BounceOut;
                this.btnMenuTweensPos[i] = tween;
            }
            this.btnMenuTweensPos[i].to = new UnityEngine.Vector3(x * this.distance, y * this.distance, 0);


            this.btnMenuTweensPos[i].PlayForward();
        }

    }

    CloseMenuForTween() {
        for (let i = 0, num = this.btnMenuGameObjects.length; i < num; i++) {
            this.btnMenuTweensPos[i].PlayReverse();
        }
    }

    closeStarLevelFlag() {
        this.isOpenStarLevelFlag = false;
    }

    openStarLevelFlag() {
        this.isOpenStarLevelFlag = true;
    }

    showStarLevelFlag() {
        if (this.isOpenStarLevelFlag)
            this.flagStarLevel.SetActive(true);
    }

    hideStarLevelFlag() {
        this.flagStarLevel.SetActive(false);
    }

    hideBackground() {
        this.imgBackground.SetActive(false);
    }
}