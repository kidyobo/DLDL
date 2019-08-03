import { KeyWord } from "System/constants/KeyWord";
import { BuffData } from 'System/data/BuffData';
import { EquipStrengthenData } from "System/data/EquipStrengthenData";
import { PetData } from "System/data/pet/PetData";
import { EnumEquipRule } from "System/data/thing/EnumEquipRule";
import { ThingData } from "System/data/thing/ThingData";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { ZhufuData } from "System/data/ZhufuData";
import { EquipCollectPropItem } from 'System/equip/EquipCollectPanel';
import { Global as G } from "System/global";
import { Macros } from 'System/protocol/Macros';
import { ItemTipData } from "System/tip/tipData/ItemTipData";
import { IconItem } from "System/uilib/IconItem";
import { List } from 'System/uilib/List';
import { UiElements } from 'System/uilib/UiElements';
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility';
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from 'System/utils/DataFormatter';
import { EquipUtils } from "System/utils/EquipUtils";
import { FightingStrengthUtil } from "System/utils/FightingStrengthUtil";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { RegExpUtil } from "System/utils/RegExpUtil";
import { SpecialCharUtil } from "System/utils/SpecialCharUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { PropertyListNode, PropertyWholeListNode } from '../../ItemPanels/PropertyItemNode';
import { GameObjectGetSet, TextGetSet } from "../../uilib/CommonForm";



export class ItemTipBase {
    private hunguTZAttribute: PropertyWholeListNode;
    private attributeListItem: PropertyListNode;

    /**跟节点，用于调整界面高度*/
    private parentPanel: UnityEngine.RectTransform;

    /**公共基础信息*/
    private txtName: UnityEngine.UI.Text;
    private txtUseLv: UnityEngine.UI.Text;
    private txtType: UnityEngine.UI.Text;
    private icon: UnityEngine.GameObject;
    private txtfight: UnityEngine.UI.Text;

    /**物品描述*/
    private txtDes: UnityEngine.UI.Text;

    /**装备--基础*/
    //是否可合成
    private txtIsMerge: UnityEngine.UI.Text;
    private txtBase: UnityEngine.UI.Text;
    private txtExtra1: UnityEngine.UI.Text;
    private txtExtra2: UnityEngine.UI.Text;
    private baseList: List;
    private txtEquipStreng: UnityEngine.UI.Text;
    private equipStrengList: List;
    private txtEquipPartLevelUp: UnityEngine.UI.Text;
    private equipPartLevelUpList: List;

    /**终极进阶属性*/
    private txtFinalUp: UnityEngine.UI.Text;
    private finalUpList: List;

    /**凡仙属性*/
    private txtFanXian: UnityEngine.UI.Text;
    private fanXianList: List;

    /**洗炼*/
    private txtXiLian: UnityEngine.UI.Text;
    private xilianList: List;

    /**锻造*/
    private txtFuhun: UnityEngine.UI.Text;
    private fuhunList: List;

    /**宝石*/
    private txtmingwen: UnityEngine.UI.Text;
    private mingwenList: List;

    /**套装*/
    private txtTaoZhuang: UnityEngine.UI.Text;
    private equipCollectPropItem: EquipCollectPropItem[] = [];
    private propList: List;

    /*描述*/
    private txtDesc: UnityEngine.UI.Text;

    /**物品 用于隐藏显示*/
    private objThingInfo: UnityEngine.GameObject;
    /**装备 用于隐藏显示*/
    private objEquipInfo: UnityEngine.GameObject;
    /**装备 各种属性类型 用于显示隐藏*/
    private objFinalUp: UnityEngine.GameObject;
    private objFanXian: UnityEngine.GameObject;
    private objXilian: UnityEngine.GameObject;
    private objFuhun: UnityEngine.GameObject;
    private objMingwen: UnityEngine.GameObject;
    private objTaoZhuang: UnityEngine.GameObject;
    private objDesc: UnityEngine.GameObject;

    private txtExtraInfo: UnityEngine.UI.Text;
    private txtRandomProp: UnityEngine.UI.Text;

    /**装备拥有动态数据*/
    private hasDynamicInfo: boolean = false;

    private thingIcon: IconItem;
    /**是否开启倒计时*/
    private isUpdate: boolean = false;
    /**是否更新物品倒计时*/
    private timeCheck: boolean = false;

    /**存放tip转变成的ThingItemData*/
    private itemData: ThingItemData = new ThingItemData();
    private wingEquipLv: number = 0;
    /**已装备*/
    private objWeared: UnityEngine.GameObject = null;

    /**伙伴星星*/
    private star: UnityEngine.GameObject;
    private starList: List;
    private starAltas: Game.UGUIAltas;

    private tipData: ItemTipData;
    ///**是否是预览五彩装备*/
    //private isPreviewWuCaiEquip: boolean = false;

    //魂骨职业限制描述
    private hunguProfessionLimit: GameObjectGetSet;
    private txtProfession: TextGetSet;

    /**
     * 设置父物体
     * @param parent
     */
    setParentPanel(parent: UnityEngine.GameObject) {
        this.parentPanel = parent.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
    }

    /**公共基础信息*/
    setBaseInfoComponents(elems: UiElements, prefab: UnityEngine.GameObject, objWeared: UnityEngine.GameObject = null) {
        this.txtName = elems.getText("txtName");
        let typeGo = elems.getElement('txtType');
        if (null != typeGo) {
            this.txtType = ElemFinderMySelf.findText(typeGo);
        }
        let useLvGo = elems.getElement('txtUseLv');
        if (null != useLvGo) {
            this.txtUseLv = ElemFinderMySelf.findText(useLvGo);
        }
        this.txtfight = elems.getText("txtfight");
        this.objWeared = objWeared;
        this.icon = elems.getElement("icon");
        this.thingIcon = new IconItem();
        this.thingIcon.setUsualIconByPrefab(prefab, this.icon);
        this.thingIcon.needWuCaiColor = true;
    }

    /**设置物品*/
    setThingInfoComponents(go: UnityEngine.GameObject) {
        this.objThingInfo = go;
        this.txtDes = ElemFinder.findText(go, "txtDes");
    }

    /**设置装备*/
    setEquipInfoComponents(go: UnityEngine.GameObject, elems: UiElements) {
        this.objEquipInfo = go;

        let objBase = elems.getElement('base');
        objBase.SetActive(true);
        this.objFinalUp = elems.getElement('finalUp');
        this.objFanXian = elems.getElement('fanxian');
        this.objXilian = elems.getElement('xilian');
        this.objFuhun = elems.getElement('fuhun');
        this.objMingwen = elems.getElement('mingwen');
        this.objTaoZhuang = elems.getElement('txtTaoZhuang');
        this.objDesc = elems.getElement("desc");
        this.txtExtraInfo = elems.getText("txtExtraInfo");
        this.txtRandomProp = elems.getText("txtRandomProp");
        this.hunguTZAttribute = new PropertyWholeListNode();
        this.hunguTZAttribute.setComponents(elems.getElement("wholeAttributeItem"));
        this.attributeListItem = new PropertyListNode();
        this.attributeListItem.setComponents(elems.getElement("attributeListItem"));
        this.hunguProfessionLimit = new GameObjectGetSet(elems.getElement("hunguProfessionLimit"));
        this.txtProfession = new TextGetSet(ElemFinder.findText(this.hunguProfessionLimit.gameObject, "txtProfession"));

        this.setEquipBaseComponents(objBase);
        this.setEquipFinalUpComponents(this.objFinalUp);
        this.setEquipFanXianComponents(this.objFanXian);
        this.setEquipXiLianComponents(this.objXilian);
        this.setEquipFuHunComponents(this.objFuhun);
        this.setEquipMingWenComponents(this.objMingwen);
        this.setEquipTaoZhuangComponents(this.objTaoZhuang);
        this.setEquipDescComponents(this.objDesc);

        //新增星星
        this.star = elems.getElement("star");
        this.starList = ElemFinder.getUIList(elems.getElement("starList"));
        this.starAltas = elems.getElement("altas").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.setActionFanXian(false);
    }

    /**装备基础信息*/
    private setEquipBaseComponents(go: UnityEngine.GameObject) {
        this.txtBase = ElemFinder.findText(go, "txtBase");
        this.txtIsMerge = ElemFinder.findText(go, "txtIsMerge");
        this.txtExtra1 = ElemFinder.findText(go, "txtExtra1");
        this.txtExtra2 = ElemFinder.findText(go, "txtExtra2");
        let list = ElemFinder.findObject(go, "baseList");
        this.baseList = ElemFinder.getUIList(list);
        this.txtEquipStreng = ElemFinder.findText(go, "txtEquipStreng");
        if (this.txtEquipStreng)
            this.equipStrengList = ElemFinder.getUIList(ElemFinder.findObject(go, "equipStrengList"));
        this.txtEquipPartLevelUp = ElemFinder.findText(go, "txtEquipPartLevelUp");
        if (this.txtEquipPartLevelUp)
            this.equipPartLevelUpList = ElemFinder.getUIList(ElemFinder.findObject(go, "equipPartLevelUpList"));
    }

    /**装备终极进阶信息*/
    private setEquipFinalUpComponents(go: UnityEngine.GameObject) {
        this.txtFinalUp = ElemFinder.findText(go, "txtFinalUp");
        let list = ElemFinder.findObject(go, "finalUpList");
        this.finalUpList = ElemFinder.getUIList(list);
    }

    /**装备凡仙信息*/
    private setEquipFanXianComponents(go: UnityEngine.GameObject) {
        this.txtFanXian = ElemFinder.findText(go, "txtFanXian");
        let list = ElemFinder.findObject(go, "fanXianList");
        this.fanXianList = ElemFinder.getUIList(list);
    }

    /**装备洗炼*/
    private setEquipXiLianComponents(go: UnityEngine.GameObject) {
        this.txtXiLian = ElemFinder.findText(go, "txtXiLian");
        let list = ElemFinder.findObject(go, "xilianList");
        this.xilianList = ElemFinder.getUIList(list);
    }

    /**装备锻造*/
    private setEquipFuHunComponents(go: UnityEngine.GameObject) {
        this.txtFuhun = ElemFinder.findText(go, "txtFuhun");
        let list = ElemFinder.findObject(go, "fuhunList");
        this.fuhunList = ElemFinder.getUIList(list);
    }

    /**装备描述*/
    private setEquipDescComponents(go: UnityEngine.GameObject) {
        if (go == null) return;
        this.txtDesc = ElemFinderMySelf.findText(go);
        this.txtDesc.gameObject.SetActive(false);
    }

    /**装备宝石*/
    private setEquipMingWenComponents(go: UnityEngine.GameObject) {
        this.txtmingwen = ElemFinder.findText(go, "txtmingwen");
        if (this.txtmingwen == null) {
            this.txtmingwen = ElemFinder.findText(go, "txtmingwen/txtmingwen");
        }
        let list = ElemFinder.findObject(this.txtmingwen.gameObject, "mingwenList");
        if (list == null) {
            list = ElemFinder.findObject(go, "mingwenList");
            if (list == null) {
                list = ElemFinder.findObject(go, "txtmingwen/mingwenList");
            }
        }
        this.mingwenList = ElemFinder.getUIList(list);
    }

    /**装备套装*/
    private setEquipTaoZhuangComponents(go: UnityEngine.GameObject) {
        this.txtTaoZhuang = ElemFinderMySelf.findText(go);
        if (this.txtTaoZhuang == null) {
            this.txtTaoZhuang = ElemFinder.findText(go, "container/title");
            this.propList = ElemFinder.getUIList(ElemFinder.findObject(go, "container/propList"));
        }
    }

    /**
     * 装备下面的除了基础属性的全部隐藏
     */
    private resetEquipGameObeject() {
        this.objEquipInfo.SetActive(true);
        this.setTipPanelHight(0);
        if (null != this.objThingInfo) {
            this.objThingInfo.SetActive(false);
        }
        //各个系统的
        this.star.SetActive(false);
        this.objFinalUp.SetActive(false);
        this.objFanXian.SetActive(false);
        this.objXilian.SetActive(false);
        this.objFuhun.SetActive(false);
        this.objMingwen.SetActive(false);
        //this.objLianTi.SetActive(false);
        this.objTaoZhuang.SetActive(false);
    }

    private lineNumber: number = 0;

    private setActionStar(action: boolean) {
        if (this.star.activeSelf == action) return;

        this.star.SetActive(action);
    }

    private setActionFinalUp(action: boolean) {
        if (this.objFinalUp.activeSelf == action) return;

        this.objFinalUp.SetActive(action);
    }

    private setActionFanXian(action: boolean) {
        if (this.objFanXian.activeSelf == action) return;

        this.objFanXian.SetActive(action);
    }

    private setActionXilian(action: boolean) {
        if (this.objXilian.activeSelf == action) return;

        this.objXilian.SetActive(action);
    }

    private setActionFuhun(action: boolean) {
        if (this.objFuhun.activeSelf == action) return;

        this.objFuhun.SetActive(action);
    }

    private setActionMingwen(action: boolean) {
        if (this.objMingwen.activeSelf == action) return;

        if (action)
            this.setTipPanelHight(2);
        this.objMingwen.SetActive(action);
    }

    private setActionTaoZhuang(action: boolean) {
        if (this.objTaoZhuang.activeSelf == action) return;

        if (action)
            this.setTipPanelHight(2);
        this.objTaoZhuang.SetActive(action);
        if (this.txtExtraInfo != null)
            this.txtExtraInfo.gameObject.SetActive(action);
    }

    /**更新信息*/
    updateInfo(tipData: ItemTipData, isGetNextStreng: boolean = false, isGetNextPartLv: boolean = false) {
        this.hunguTZAttribute.hideNode();
        this.attributeListItem.hideNode();

        this.tipData = tipData;
        this.itemData = new ThingItemData();
        this.itemData.data = tipData.thingInfo;
        this.itemData.config = tipData.configData;
        this.itemData.containerID = tipData.containerID;
        this.wingEquipLv = tipData.wingEquipLv;
        let config: GameConfig.ThingConfigM = tipData.configData;
        if (!config) {
            uts.logErrorReport(G.Uimgr.toStringAllViews());
        }
        let containerThingInfo: Protocol.ContainerThingInfo = tipData.thingInfo;
        let dynamicInfo: Protocol.ThingProperty;
        if (containerThingInfo != null) {
            dynamicInfo = tipData.thingInfo.m_stThingProperty;
            this.hasDynamicInfo = true;
        }
        let colorValue = config.m_ucColor;
        //图标的显示      
        this.thingIcon.updateByThingItemData(this.itemData);
        this.thingIcon.isPreviewWuCaiEquip = this.tipData.isPreviewWuCaiEquip;
        if (this.itemData.config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) {
            this.thingIcon.wingEquipLv = this.wingEquipLv;
            let thingInfo = this.itemData.data;
            colorValue = G.DataMgr.equipStrengthenData.getWingEquipColor(this.itemData.config, thingInfo, this.wingEquipLv);
        }
        this.thingIcon.showBg = true;
        this.starList.Count = 0;
        if ((GameIDUtil.isEquipmentID(config.m_iID) || GameIDUtil.isAvatarID(config.m_iID))) {
            //关闭物品tip 开启装备显示
            this.resetEquipGameObeject();
            if (this.itemData.config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_LINGBAO)
                this.txtfight.gameObject.SetActive(false);
            else
                this.txtfight.gameObject.SetActive(true);

            this.refreshEquipTipView(tipData, isGetNextStreng, isGetNextPartLv);
            this.thingIcon.updateIcon(isGetNextStreng, isGetNextPartLv);
        } else {
            //关闭装备tip 开启物品显示
            this.objEquipInfo.SetActive(false);
            if (null != this.objThingInfo) {
                this.objThingInfo.SetActive(true);
                this.setTipPanelHight(0);
            }

            this.txtfight.gameObject.SetActive(false);
            this.refreshItemTipView(tipData);
            this.thingIcon.updateIcon();
        }

        let color = Color.getColorById(colorValue);
        if (config.m_ucWYSuitID > 0) {
            this.txtName.text = TextFieldUtil.getColorText("[套装]", Color.ITEM_GREEN) + TextFieldUtil.getColorText(config.m_szName, color);
        }
        else {
            this.txtName.text = TextFieldUtil.getColorText(config.m_szName, color);
        }

        let scr = this.objEquipInfo.GetComponent(UnityEngine.UI.ScrollRect.GetType()) as UnityEngine.UI.ScrollRect;
        if (scr != null) {
            scr.verticalNormalizedPosition = 1;
        }
    }

    /**刷新物品类型Tip*/
    private refreshItemTipView(tipData: ItemTipData): void {
        if (this.objWeared != null) {
            this.objWeared.SetActive(false);
        }

        // 更新物品名字
        let thingConfig: GameConfig.ThingConfigM = tipData.configData;
        let needLock: boolean;
        needLock = GameIDUtil.isBingThingByContainerInfo(thingConfig.m_iID, tipData.thingInfo);
        let itemName: string = thingConfig.m_szName;
        let lv: number = G.DataMgr.heroData.level;
        if (null != this.txtUseLv) {
            if (thingConfig.m_ucFunctionType == KeyWord.ITEM_FUNCTION_EQUIP_JEWEL) {
                this.txtUseLv.text = '要求等级：10';
            }
            else {
                this.txtUseLv.text = TextFieldUtil.getColorText('要求等级：' + thingConfig.m_ucRequiredLevel, lv >= thingConfig.m_ucRequiredLevel ? Color.TIP_WHITE_COLOR : Color.RED);
            }
            this.txtUseLv.gameObject.SetActive(true);
        }

        if (null != this.txtType) {
            this.txtType.text = uts.format(('类型：') + RegExpUtil.xlsDesc2Html(thingConfig.m_szUse));
            this.txtType.gameObject.SetActive(true);
        }

        if (null != this.txtDes) {
            this.makeItemTip(thingConfig, null != tipData.thingInfo ? tipData.thingInfo.m_stThingProperty : null, tipData);
        }
    }

    /**
	 * 获取物品ItemTip信息
	 * @param staticDataObj - 数据信息实例
	 * @param dynamicDataObj - 数据信息实例
	 * @param needSellLimit - 是否显示道具限购信息
	 * @return 返回Tip信息
	 * */
    private makeItemTip(itemIns: GameConfig.ThingConfigM, dynamicInfo: Protocol.ThingProperty, tipData: ItemTipData) {
        let needMoney: number = 0;
        let isBinding: boolean = GameIDUtil.isBindingThing(itemIns.m_iID, dynamicInfo);
        let str = "";
        if ('' != itemIns.m_szDesc) {
            str += itemIns.m_szDesc;
        }
        if ('' != itemIns.m_szSpecDesc) {
            str += '\n\n';
            str += itemIns.m_szSpecDesc;
        }
        if (itemIns.m_ucIsDestroy == 0) {
            str += TextFieldUtil.getColorText('不可丢弃', Color.RED);
        }
        let txtStr = RegExpUtil.xlsDesc2Html(str);

        txtStr += this.getExtraInfo();
        this.txtDes.text = txtStr;
    }

    private getExtraInfo(): string {
        let txtStr = '';
        // 过期时间显示 
        let config = this.itemData.config;
        let thingInfo = this.itemData.data;
        // 有动态属性的
        if (thingInfo != null) {
            let dynamicInfo = thingInfo.m_stThingProperty;
            if (dynamicInfo.m_iPersistTime > 0) {
                txtStr += "\n";
                let nowInSecond = Math.ceil(G.SyncTime.getCurrentTime() / 1000);
                if (nowInSecond >= dynamicInfo.m_iPersistTime) {
                    txtStr += TextFieldUtil.getColorText(uts.format('有效期到：{0}(已过期)', DataFormatter.second2yyyymmddhhmm(dynamicInfo.m_iPersistTime)), Color.RED);
                } else {
                    txtStr += TextFieldUtil.getColorText(uts.format('有效期到：{0}', DataFormatter.second2yyyymmddhhmm(dynamicInfo.m_iPersistTime)), Color.GREEN);
                }
            }
        }
        else {
            // 没动态属性，则读表格配置
            if (config.m_ucPersistTimeType == KeyWord.TIME_DAILY) {
                txtStr += "\n";
                txtStr += TextFieldUtil.getColorText('有效期到：当天24:00', Color.RED);
            }
        }

        if (config.m_ucFunctionType == KeyWord.ITEM_FUNCTION_EQUIP_JEWEL && thingInfo) {
            var nextGemCfg: GameConfig.ThingConfigM = ThingData.getThingConfig(thingInfo.m_iThingID + 10);
            if (nextGemCfg) {
                let gemCfg: GameConfig.DiamondPropM = G.DataMgr.equipStrengthenData.getDiamondConfig(nextGemCfg.m_iID);
                let maxVal: number = EnumEquipRule.getDiamondMaxExp(thingInfo.m_iThingID);

                txtStr += "\n\n";
                txtStr += TextFieldUtil.getColorText(uts.format('经验：{0}/{1}', thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stDiamondProcessInfo.m_uiProcess, maxVal), Color.GREEN);
            }
        }


        // 测试代码
        if (defines.has('DEVELOP')) {
            txtStr += uts.format('\n\n物品ID: {0}', config.m_iID);
        }
        return txtStr;
    }

    private hunguStartDic: { [hunguName: string]: number } = null
    /**
     * 显示星星
     */
    private showStarImg(tipData: ItemTipData) {
        let config = tipData.configData;

        this.setActionStar(true);
        let level = config.m_ucStage;

        //魂骨 把描述打开
        if (GameIDUtil.isHunguEquipID(config.m_iID)) {
            level = config.m_ucStage;
            if (this.txtDesc != null) {
                this.txtDesc.gameObject.SetActive(true);
                let str = tipData.configData.m_szDesc;
                if (defines.has('DEVELOP')) {
                    str += uts.format('\n物品ID: {0}', config.m_iID);
                }
                this.txtDesc.text = RegExpUtil.xlsDesc2Html(str);
            }
            //职业限制
            this.hunguProfessionLimit.SetActive(true);
            let selfProf = G.DataMgr.heroData.profession;
            let name = "";
            let color = "";
            if (config.m_ucProf == 0 || config.m_ucProf == selfProf) {
                color = Color.GREEN;
            }
            else {
                color = Color.RED;
            }
            if (config.m_ucProf == 0) {
                name = "全职业";
            }
            else if (config.m_ucProf == 1) {
                name = "器魂师";
            }
            else if (config.m_ucProf == 2) {
                name = "兽魂师";
            }
            let str = TextFieldUtil.getColorText(uts.format("职业限制：{0}", name), color);
            this.txtProfession.text = str;
        }
        else {
            if (this.txtDesc != null)
                this.txtDesc.gameObject.SetActive(false);
            this.hunguProfessionLimit.SetActive(false);
        }
        this.starList.Count = 10;
        let start = 0;
        if (level > 10) {
            start = 10;
        }
        for (let i = 0, count = this.starList.Count; i < count; i++) {
            let item = this.starList.GetItem(i);
            let star = item.findImage("star");
            if (i + start < level) {
                if (start == 10) {
                    star.sprite = this.starAltas.Get("2");
                }
                else {
                    star.sprite = this.starAltas.Get("1");
                }
            }
            else {
                if (start == 10) {
                    star.sprite = this.starAltas.Get("1");
                }
                else {
                    star.sprite = this.starAltas.Get("0");
                }
            }
        }
    }



    /**刷新装备（角色装备，伙伴，伙伴套装，其他装备），时装Tip*/
    private refreshEquipTipView(tipData: ItemTipData, isGetNextStreng: boolean = false, isGetNextPartLv: boolean = false): void {
        let config: GameConfig.ThingConfigM = tipData.configData;
        let dynamicInfo: Protocol.ThingProperty;

        if (tipData.thingInfo != null) {
            dynamicInfo = tipData.thingInfo.m_stThingProperty;
        }
        //魂骨 把描述打开
        if (GameIDUtil.isHunguEquipID(config.m_iID)) {
            //职业限制
            this.hunguProfessionLimit.SetActive(true);
        }
        else {
            if (this.txtDesc != null)
                this.txtDesc.gameObject.SetActive(false);
            this.hunguProfessionLimit.SetActive(false);
        }

        let equipInfo: Protocol.SpecThingProperty;
        // let otherPlayerData: OtherPlayerData = G.DataMgr.otherPlayerData;
        if (null != dynamicInfo) {
            equipInfo = dynamicInfo.m_stSpecThingProperty;
        }
        // 是否已装备
        if (this.objWeared != null) {
            this.objWeared.SetActive(tipData.isWearing);
        }

        let partGroup: number = 0;
        if (GameIDUtil.isRoleEquipID(config.m_iID)) {
            partGroup = KeyWord.GROUP_EQUIP_MAIN;
        }
        else if (GameIDUtil.isHunguEquipID(config.m_iID)) {
            partGroup = KeyWord.GROUP_HUNGU_EQUIP_MAIN;
        }
        else if (GameIDUtil.isPetEquipID(config.m_iID)) {
            partGroup = KeyWord.GROUP_BEAUTY_EQUIP_MAIN;
        }
        else {
            partGroup = KeyWord.GROUP_ZHUFU_MAIN;
        }

        //祝福装备
        if (GameIDUtil.isOtherEquipID(config.m_iID)) {
            if (null != this.txtType) {
                this.txtType.gameObject.SetActive(false);
            }
            if (null != this.txtUseLv) {
                let type = GameIDUtil.getSubTypeByEquip(config.m_iEquipPart);
                let stage = ZhufuData.getZhufuStage(config.m_ucRequiredLevel, type);
                this.txtUseLv.text = TextFieldUtil.getColorText((KeyWord.getDesc(KeyWord.GROUP_HERO_SUB_TYPE, type) + SpecialCharUtil.getHanNum(stage)) + '阶可装备', Color.TIP_BULE_COLOR, 22);
                this.txtUseLv.gameObject.SetActive(true);
            }
            this.showStarImg(tipData);
        }
        else if (GameIDUtil.isPetEquipID(config.m_iID)) {
            //武缘装备
            if (null != this.txtType) {
                this.txtType.gameObject.SetActive(false);
            }
            if (null != this.txtUseLv) {
                let stage = PetData.getPetStage(config.m_ucRequiredLevel, 0);
                let petName: string;
                if (config.m_iFunctionID > 0) {
                    petName = PetData.getPetConfigByPetID(config.m_iFunctionID).m_szBeautyName;
                } else {
                    petName = '伙伴';
                }

                let des: string = '';
                if (config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BINHUN || config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BRACELET) {
                    // des = petName + SpecialCharUtil.getHanNum(stage) + '阶可穿戴';
                    des = "伙伴激活可穿戴";
                }
                else {
                    let RequiredLevel = config.m_ucRequiredLevel;
                    if (RequiredLevel == 0) {
                        des = '激活伙伴可穿戴';
                    }
                    else {
                        if (PetData.petTitleTip[RequiredLevel - 1] != null)
                            des = uts.format('{0}觉醒至{1}穿戴', petName, PetData.petTitleTip[RequiredLevel - 1]);
                        else
                            des = "";
                    }
                }
                if (this.isCanUse)
                    this.txtUseLv.text = TextFieldUtil.getColorText(des, Color.TIP_BULE_COLOR, 22);
                else
                    this.txtUseLv.text = TextFieldUtil.getColorText(des, Color.RED, 22);

                this.txtUseLv.gameObject.SetActive(true);
            }
            this.showStarImg(tipData);
        }
        else if (GameIDUtil.isHunguEquipID(config.m_iID)) {
            //魂骨装备

            //基础属性
            this.updateHunguBaseInfo(config, dynamicInfo);
            //星星
            this.showStarImg(tipData);
            //属性
            this.updateHunguEquipTip(config, dynamicInfo, tipData);
        }
        else {
            //人物装备
            if (null != this.txtType) {
                this.txtType.text = "类型：" + KeyWord.getDesc(partGroup, config.m_iMainClass);
            }
            this.txtType.gameObject.SetActive(true);
            if (null != this.txtUseLv) {
                this.txtUseLv.gameObject.SetActive(false);
            }
        }

        if (!GameIDUtil.isHunguEquipID(config.m_iID))
            this.txtfight.text = "战斗力:" + DataFormatter.toFixed(FightingStrengthUtil.getStrengthByEquip(config, equipInfo, this.wingEquipLv, this.tipData.isPrevFuHun, isGetNextStreng, isGetNextPartLv), 0);

        if (GameIDUtil.isRoleEquipID(config.m_iID) && KeyWord.EQUIP_PARTCLASS_LINGBAO == config.m_iEquipPart) {
            this.isUpdate = true;
            //精灵使用物品显示
            if (null != this.objThingInfo) {
                this.objThingInfo.SetActive(true);
            }
            this.objEquipInfo.SetActive(false);

            this.refreshLingBaoTipView();
        } else if (KeyWord.EQUIP_PARTCLASS_WEDDINGRING == config.m_iEquipPart) {
            //婚戒只有基础属性
            this.makeEquipTip(config, dynamicInfo, tipData);
        }
        else {
            this.isUpdate = false;
            this.makeEquipTip(config, dynamicInfo, tipData, isGetNextStreng, isGetNextPartLv);
        }
    }


    /**
    * 获取Tip信息
    * @param staticDataObj - 数据信息实例
    * @param dynamicDataObj - 数据信息实例
    * @return 返回Tip信息
    * */
    private makeEquipTip(config: GameConfig.ThingConfigM, dynamicInfo: Protocol.ThingProperty = null, tipData: ItemTipData = null, isGetNextStreng: boolean = false, isGetNextPartLv: boolean = false) {


        let needMoney: number = 0;
        let equipInfo: Protocol.SpecThingProperty;
        let isBinding: boolean = GameIDUtil.isBindingThing(config.m_iID, dynamicInfo);
        let heroLv: number = EquipStrengthenData.EQUIP_BASEPROP_LEVEL;
        if (null != dynamicInfo) {
            equipInfo = dynamicInfo.m_stSpecThingProperty;
        }

        //基础属性显示
        this.addPorpList(config, equipInfo, isGetNextStreng, isGetNextPartLv);

        //装备且鞋子之前的
        if (GameIDUtil.isRoleEquipID(config.m_iID) && config.m_iEquipPart <= KeyWord.EQUIP_PARTCLASS_SHOE) {
            heroLv = G.DataMgr.heroData.level;
            let isOther = false;
            if (dynamicInfo != null) {
                isOther = G.DataMgr.otherPlayerData.isOthersEquip(config.m_iID, dynamicInfo.m_stGUID);
                //if (isOther) {
                //    heroLv = G.DataMgr.otherPlayerData.cacheRoleInfo.m_stRoleInfo.m_stBaseProfile.m_usLevel;
                //}
            }

            let pos = EquipUtils.getEquipIdxByPart(config.m_iEquipPart);
            //已经终极进阶（五彩神石）
            this.updateWuCaiShenShiPart(config, pos, isOther);

            //附魂，铭文
            if (equipInfo) {
                this.addRefineList(equipInfo.m_stEquipInfo, config);
                this.addInsertDiamondList(config, equipInfo.m_stEquipInfo, dynamicInfo/*, isOther*/);
            }
            //斩魔属性
            if (dynamicInfo && null != dynamicInfo.m_stSpecThingProperty && dynamicInfo.m_stSpecThingProperty.m_stEquipInfo != null) {
                let zmLevel: number = dynamicInfo.m_stSpecThingProperty.m_stEquipInfo.m_stLQ.m_ucLQLevel;
                if (zmLevel) {
                    this.addZmPorpList(config, zmLevel, heroLv);
                }
            }

            ////凡仙属性
            //if (G.DataMgr.thingData.checkIsWaring(this.itemData, 0)) {
            //    let soltInfo = equipStrengthenData.getEquipSlotOneDataByPart(pos);
            //    this.setActionFanXian(soltInfo.m_ucSuitType > 0);
            //    if (soltInfo.m_ucSuitType > 0) {
            //        this.txtFanXian.text = TextFieldUtil.getColorText("凡仙属性", Color.TIP_WHITE_COLOR, 22);
            //        let cfg = G.DataMgr.equipStrengthenData.getEquipSlotSuitConfig(soltInfo.m_ucSuitType, config.m_iEquipPart);
            //        this.fanXianList.Count = 1;
            //        for (let i = 0; i < this.fanXianList.Count; i++) {
            //            let item = this.fanXianList.GetItem(i);
            //            let txtBase = item.findText("txtBase");
            //            txtBase.text = (KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, cfg.m_ucPropName) + '+' + cfg.m_iPropValue);
            //        }
            //    }
            //} else {
            //    this.setActionFanXian(false);
            //}

        } else {
            this.setActionFinalUp(false);
            // this.setActionFanXian(false);
        }

        if (!GameIDUtil.isRoleEquipID(config.m_iID) && !GameIDUtil.isHunguEquipID(config.m_iID) && equipInfo != null && config.m_ucNoRandProp == 0) {

            this.addRandomProp(equipInfo.m_stZhuFuEquipInfo.m_stRandAttr, config);
        }

        //祝福的只有基础属性了
        if (GameIDUtil.isOtherEquipID(config.m_iID) && equipInfo == null) {

            // 测试代码
            if (defines.has('DEVELOP')) {
                this.setActionTaoZhuang(true);
                this.txtTaoZhuang.text = uts.format('\n\n物品ID: {0}', config.m_iID);
            }
        }

        if (config.m_ucWYSuitID > 0) {
            let has: number = 0;
            if (tipData.containerID == Macros.CONTAINER_TYPE_BEAUTY_EQUIP) {
                let petID: number = PetData.getPetIDByEquipPos(tipData.bagPos);
                has = G.DataMgr.thingData.getWearingPetSuitFlag(petID, config.m_ucWYSuitID);
            }
            this.addPetSuitsDesc(config.m_ucWYSuitID, has, config.m_ucColor);
        }


    }
    /**
    *隐藏新加的升级属性以及强化属性相关组件
    *因为非角色装备只有基础属性
    */
    private setBaseInfoGoActive(isShow: boolean) {
        if (this.txtEquipStreng && this.txtEquipPartLevelUp && this.equipStrengList && this.equipPartLevelUpList) {
            this.txtEquipStreng.gameObject.SetActive(isShow);
            this.txtEquipPartLevelUp.gameObject.SetActive(isShow);
            this.equipStrengList.gameObject.SetActive(isShow);
            this.equipPartLevelUpList.gameObject.SetActive(isShow);
        }
    }

    /**
    * 添加基础属性列表
    * @param holder
    * @param equipConfig
    * @param arrowState
    * @param posY
    * @return
    *
    */
    private addPorpList(equipConfig: GameConfig.ThingConfigM, equipInfo: Protocol.SpecThingProperty, isGetNextStreng: boolean = false, isGetNextPartLv: boolean = false) {
        if (this.txtIsMerge) {
            let str = equipConfig.m_ucIsMerge > 0 ? TextFieldUtil.getColorText("可合成更高星级", Color.TIP_WHITE_COLOR) : TextFieldUtil.getColorText("不可合成更高星级", Color.TIP_GREY_COLOR);

            this.txtIsMerge.text = str;
        }
        //@jackson--魂骨装备不用管，单独写了逻辑
        if (GameIDUtil.isHunguEquipID(equipConfig.m_iID)) return;

        //强化额外加成2条属性
        this.txtExtra1.gameObject.SetActive(false);
        this.txtExtra2.gameObject.SetActive(false);
        //标题

        //是否是翅膀装备
        let isWingEquip = equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING;

        if (GameIDUtil.isPetEquipID(equipConfig.m_iID) || GameIDUtil.isOtherEquipID(equipConfig.m_iID)) {
            this.txtBase.text = TextFieldUtil.getColorText("基础属性", Color.PropYellow, 22) + "  " +
                TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_ITEM_COLOR, equipConfig.m_ucColor),
                    Color.getColorById(equipConfig.m_ucColor), 22);
        } else {
            let str = TextFieldUtil.getColorText("基础属性", Color.PropYellow, 22);
            if (GameIDUtil.isRoleEquipID(equipConfig.m_iID)) {
                if (isWingEquip) {
                    let str = TextFieldUtil.getColorText("基础属性", Color.PropYellow, 22);
                } else {
                    str = TextFieldUtil.getColorText("进阶属性", Color.PropYellow, 22);
                }
            }
            this.txtBase.text = str/* + "  " + ((isWingEquip) ? "" :
                TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_EQUIP_STAGE_TYPE, equipConfig.m_ucStage), Color.getColorById(equipConfig.m_ucColor), 22))*/;

        }

        let len = 0;
        let propData: GameConfig.EquipPropAtt[];
        let isRoleEquipId: boolean = false;
        if (isWingEquip) {
            this.hunguProfessionLimit.SetActive(true);
            let selfProf = G.DataMgr.heroData.profession;
            let name = "";
            let color = "";
            if (equipConfig.m_ucProf == selfProf) {
                color = Color.GREEN;
            }
            else {
                color = Color.RED;
            }
            if (equipConfig.m_ucProf == 1) {
                name = "器魂师";
            }
            else if (equipConfig.m_ucProf == 2) {
                name = "兽魂师";
            }
            let str = TextFieldUtil.getColorText(uts.format("职业限制：{0}", name), color);
            this.txtProfession.text = str;

            let lv = 0;
            if (equipInfo) {
                lv = equipInfo.m_stEquipInfo.m_stStrong.m_uiStrongProgress;
            }
            if (this.wingEquipLv > 0) {
                lv = this.wingEquipLv;
            }

            let wingStrengthCfg = G.DataMgr.equipStrengthenData.getWingStrengthCfg(equipConfig.m_iID, lv);
            if (wingStrengthCfg) {
                len = wingStrengthCfg.m_astPropAtt.length;
                propData = wingStrengthCfg.m_astPropAtt;
            }
            this.setBaseInfoGoActive(false);
        } else {
            this.hunguProfessionLimit.SetActive(false);
            len = equipConfig.m_astBaseProp.length;
            propData = equipConfig.m_astBaseProp;
            isRoleEquipId = GameIDUtil.isRoleEquipID(equipConfig.m_iID);
            this.setBaseInfoGoActive(isRoleEquipId);
        }

        this.baseList.Count = len;
        for (let i: number = 0; i < len; i++) {
            if (propData[i].m_ucPropId == 0) {
                break;
            }
            let item = this.baseList.GetItem(i);
            let txtPropName = item.findText("txtPropName");
            let txtPropValue = item.findText("txtPropValue");
            let txtExtra = item.findText("txtExtra");
            if (txtExtra) txtExtra.gameObject.SetActive(false);
            if (isWingEquip) {
                txtPropName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propData[i].m_ucPropId);
                txtPropValue.text = '+' + propData[i].m_ucPropValue;
            } else {
                txtPropName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, equipConfig.m_astBaseProp[i].m_ucPropId);
                txtPropValue.text = '+' + equipConfig.m_astBaseProp[i].m_ucPropValue;
            }
        }

        if (isWingEquip) {
            return;
        }
        if (isRoleEquipId) {
            //-------------主角装备升级-------------------
            //装备部位
            let equipPart = equipConfig.m_iEquipPart;
            let equipPos = equipPart - KeyWord.EQUIP_MAINCLASS_MIN;
            //装备位信息
            let equipSoltInfo = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(equipPos);
            //装备位升级配置
            let equipSoltUpLvM;
            if (isGetNextPartLv) {
                equipSoltUpLvM = G.DataMgr.equipStrengthenData.getEquipSlotConfigByPartAndLv(equipPart, equipSoltInfo.m_iSlotLv + 1);
                if (!equipSoltUpLvM) {
                    equipSoltUpLvM = G.DataMgr.equipStrengthenData.getEquipSlotConfigByPartAndLv(equipPart, equipSoltInfo.m_iSlotLv);
                }
            } else {
                equipSoltUpLvM = G.DataMgr.equipStrengthenData.getEquipSlotConfigByPartAndLv(equipPart, equipSoltInfo.m_iSlotLv);
            }

            let hasEquipSoltUpLvM: boolean = (equipSoltUpLvM != null);
            if (this.txtEquipPartLevelUp && this.equipPartLevelUpList) {
                this.txtEquipPartLevelUp.gameObject.SetActive(hasEquipSoltUpLvM);
                this.equipPartLevelUpList.gameObject.SetActive(hasEquipSoltUpLvM);
            }
            //升级
            if (hasEquipSoltUpLvM) {

                let len1 = equipSoltUpLvM.m_astPropAtt.length;
                this.equipPartLevelUpList.Count = len1;
                for (let j = 0; j < len1; j++) {
                    if (equipSoltUpLvM.m_astPropAtt[j].m_ucPropId == 0) {
                        break;
                    }
                    let item = this.equipPartLevelUpList.GetItem(j);
                    let txtPropName = item.findText("txtPropName");
                    let txtPropValue = item.findText("txtPropValue");
                    txtPropName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, equipSoltUpLvM.m_astPropAtt[j].m_ucPropId);
                    txtPropValue.text = '+' + equipSoltUpLvM.m_astPropAtt[j].m_ucPropValue;
                }
            }

            //-------------主角装备强化-------------------
            let strengthenConfig = G.DataMgr.equipStrengthenData.getEquipStrengthenConfigByPart(equipConfig.m_iEquipPart, isGetNextStreng);
            let hasStrengthenConfig: boolean = (strengthenConfig != null);
            if (this.txtEquipStreng && this.equipStrengList) {
                this.txtEquipStreng.gameObject.SetActive(hasStrengthenConfig);
                this.equipStrengList.gameObject.SetActive(hasStrengthenConfig);
            }
            if (hasStrengthenConfig) {
                let len2 = strengthenConfig.m_astProp.length;
                this.equipStrengList.Count = len2;
                for (let k = 0; k < len2; k++) {
                    if (strengthenConfig.m_astProp[k].m_ucPropId == 0) {
                        break;
                    }
                    let item = this.equipStrengList.GetItem(k);
                    let txtPropName = item.findText("txtPropName");
                    let txtPropValue = item.findText("txtPropValue");
                    txtPropName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, strengthenConfig.m_astProp[k].m_ucPropId);
                    txtPropValue.text = "+" + strengthenConfig.m_astProp[k].m_ucPropValue;
                }
            }
        }
    }

    /**
     * 添加附魔（斩魔）属性
     * @param equipConfig
     * @param zmLevel
     * @param heroLevel
     */
    private addZmPorpList(equipConfig: GameConfig.ThingConfigM, zmLevel: number, heroLevel: number) {

        this.setActionXilian(true);

        this.txtXiLian.text = TextFieldUtil.getColorText("附魔属性", Color.PropYellow, 22);
        let equipLqCfg: GameConfig.EquipLQM = G.DataMgr.equipStrengthenData.getEquipLqCfg(equipConfig.m_iEquipPart, zmLevel);
        let len: number = equipConfig.m_astBaseProp.length;
        this.xilianList.Count = len;
        for (let i: number = 0; i < len; i++) {
            if (equipConfig.m_astBaseProp[i].m_ucPropId == 0) {
                break;
            }

            let item = this.xilianList.GetItem(i);
            let txtBase = item.findText("txtBase");
            let txtExtra = item.findText("txtExtra");

            txtBase.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, equipConfig.m_astBaseProp[i].m_ucPropId) + '+' + EquipUtils.getAddStrentPorpValue(equipConfig, i);
            let lqAtt: GameConfig.EquipPropAtt = equipLqCfg.m_astPropAtt[i];
            if (i < equipLqCfg.m_astPropAtt.length && lqAtt.m_ucPropValue > 0) {
                txtExtra.text = '附魔 +' + lqAtt.m_ucPropValue;
            }
        }
    }

    /**
     * 锻造
     * @param holder
     * @param equipInfo
     * @param itemIns
     * @param posY
     */
    private addRefineList(equipInfo: Protocol.EquipInfo, itemIns: GameConfig.ThingConfigM) {
        let showFuHun: boolean = false;
        let str: string = TextFieldUtil.getColorText("洗炼\n", 'ECD660', 22);
        this.txtFuhun.text = str;
        let config: GameConfig.EquipWishM;
        this.setActionFuhun(true);
        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        let isPrev: boolean = this.tipData.isPrevFuHun;
        if (isPrev) {
            showFuHun = true;
            let equipPart = itemIns.m_iEquipPart;
            let lv = equipStrengthenData.washStageInfo.m_ucLv;
            let props = equipStrengthenData.getWishRandomMaxProp(equipPart, lv);
            let star = equipStrengthenData.getWishRandomMaxStar(equipPart, lv);

            this.fuhunList.Count = 2;
            //循环2次 策划要求
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < props.length; i++) {
                    let item = this.fuhunList.GetItem(i);
                    let id = props[i];
                    if (id > 0) {
                        let txtPropName = item.findText("txtPropName");
                        let txtPropValue = item.findText("txtPropValue");
                        let txtStarLevel = item.findText("txtStarLevel");
                        config = G.DataMgr.equipStrengthenData.getRefineConfig(id, star + 1);
                        let color = Color.getColorById(config.m_ucColor);
                        txtPropName.text = TextFieldUtil.getColorText((KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, config.m_ucAttrType)), color, 22);
                        txtPropValue.text = TextFieldUtil.getColorText(('+' + config.m_iPropValue), color, 22);
                        txtStarLevel.text = TextFieldUtil.getColorText(((star + 1) + '星)'), color, 22);
                    } else {
                        item.gameObject.SetActive(false);
                    }
                }
            }
        } else {
            this.fuhunList.Count = EquipStrengthenData.MAX_REFINE_NUM;
            for (let i: number = 0; i < EquipStrengthenData.MAX_REFINE_NUM; i++) {
                let item = this.fuhunList.GetItem(i);
                if (equipInfo.m_stWash.m_astAttr[i].m_ucPropId > 0) {
                    showFuHun = true;
                    item.gameObject.SetActive(true);
                    let txtPropName = item.findText("txtPropName");
                    let txtPropValue = item.findText("txtPropValue");
                    let txtStarLevel = item.findText("txtStarLevel");
                    config = G.DataMgr.equipStrengthenData.getRefineConfig(equipInfo.m_stWash.m_astAttr[i].m_ucPropId, equipInfo.m_stWash.m_astAttr[i].m_ucWashLevel);
                    txtPropName.text = TextFieldUtil.getColorText((KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, config.m_ucAttrType)), Color.TIP_BULE_COLOR, 22);
                    txtPropValue.text = '+' + config.m_iPropValue;
                    txtStarLevel.text = TextFieldUtil.getColorText(('(' + equipInfo.m_stWash.m_astAttr[i].m_ucWashLevel + '星)'), Color.TIP_GREEN_COLOR, 22);

                } else {
                    item.gameObject.SetActive(false);
                }
            }
        }
        this.setActionFuhun(showFuHun);
    }


    /**
		 * 宝石属性
		 * @param holder
		 * @param equipConfig
		 * @param equipInfo
		 * @param itemIns
		 * @param dynamicInfo
		 * @param posY
		 * @return 
		 * 
		 */
    private addInsertDiamondList(equipConfig: GameConfig.ThingConfigM, equipInfo: Protocol.EquipInfo, dynamicInfo: Protocol.ThingProperty, isOther: boolean = false) {
        this.setActionMingwen(this.hasDynamicInfo);

        this.txtmingwen.text = TextFieldUtil.getColorText("魔石", Color.PropYellow, 22);

        let taozhuangStr = '';
        if (equipInfo != null && GameIDUtil.isRoleEquipID(equipConfig.m_iID) && equipConfig.m_iEquipPart != KeyWord.EQUIP_PARTCLASS_WEDDINGRING) {
            //加入镶嵌信息  
            this.mingwenList.Count = 6;
            let allColorCfg: GameConfig.EquipAllColorPropM;
            let suistColor: number = this.getSuitColor(isOther);
            if (suistColor == KeyWord.COLOR_PINK) {
                let suitNum: number = this.getSuitNum(suistColor, isOther);
            }
            //打出镶嵌属性
            for (let i = 0; i < 6; i++) {
                let item = this.mingwenList.GetItem(i);
                let hasIconObj = item.findRawImage("icon/has");
                let lockIcomObj = item.findObject("icon/lock");
                let txtmingwenType = item.findText("txtmingwenType");

                let diamondID: number;
                if (null != dynamicInfo.m_stSpecThingProperty) {
                    diamondID = dynamicInfo.m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondID[i];
                }

                let typeStr: string;
                if (diamondID > 0) {
                    hasIconObj.gameObject.SetActive(true);
                    let iconId = ThingData.getThingConfig(diamondID).m_szIconID;
                    G.ResourceMgr.loadIcon(hasIconObj, uts.format("{0}", iconId));

                    if (lockIcomObj != null)
                        lockIcomObj.gameObject.SetActive(false);
                    let cfg: GameConfig.DiamondPropM = G.DataMgr.equipStrengthenData.getDiamondConfig(diamondID);
                    let diamondCfg: GameConfig.ThingConfigM = ThingData.getThingConfig(diamondID);
                    //typeStr = TextFieldUtil.getColorText(uts.format("{0}宝石", KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, cfg.m_ucPropId)), Color.getColorById(diamondCfg.m_ucColor), 22);
                    typeStr = TextFieldUtil.getColorText(uts.format('{0}+{1}', KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, cfg.m_ucPropId), cfg.m_iPropValue), Color.getColorById(diamondCfg.m_ucColor), 22);
                    //typeStr += uts.format('{0}+{1}', KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, cfg.m_ucPropId), cfg.m_iPropValue);
                    if (allColorCfg != null) {
                        //  typeStr += uts.format('，加成提升{0}%', Math.floor(allColorCfg.m_uiInscriptionAddition / 100));
                    }
                }
                else {
                    hasIconObj.gameObject.SetActive(false);
                    if (lockIcomObj != null)
                        lockIcomObj.gameObject.SetActive(G.DataMgr.hunliData.level < EquipUtils.SLOT_OPEN_LEVEL[i]);
                    if (G.DataMgr.hunliData.level < EquipUtils.SLOT_OPEN_LEVEL[i]) {
                        typeStr = TextFieldUtil.getColorText(uts.format('{0}开放', KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, i + 1)), Color.GREY);
                    }
                    else {
                        typeStr = '未镶嵌';
                    }
                }
                txtmingwenType.text = typeStr;
            }

            // // 获取套装说明
            // taozhuangStr = this.getSuitsDesc(equipConfig, dynamicInfo/*, isOther*/);
        }
        if (this.txtExtraInfo != null)
            this.txtExtraInfo.text = this.getExtraInfo();

        // this.txtTaoZhuang.text = taozhuangStr;
        // this.setActionTaoZhuang(true);
    }

    /**
     * 获取套装数量
     * @param stage
     * @param isOther
     */
    private getSuitNum(stage: number, isOther: boolean): number {
        let suitNum: number = 0;
        if (isOther) {
            // suitNum = G.DataMgr.otherPlayerData.getEquipSuitsCount(color);
            return suitNum = -1;
        }
        else {
            suitNum = G.DataMgr.thingData.getEquipSuitsCount(stage);
        }
        return suitNum;
    }

    /**
     * 获取套装颜色
     * @param isOther
     */
    private getSuitColor(isOther: boolean): number {
        let color: number = KeyWord.COLOR_ORANGE;
        let pinkCount: number = 0;
        let redCount: number = 0;
        let goldCount: number = 0;
        let orangeCount: number = 0;
        if (isOther) {
            //let otherPlayerData: OtherPlayerData = G.DataMgr.otherPlayerData;
            //pinkCount = otherPlayerData.getEquipSuitsCount(KeyWord.COLOR_PINK);
            //redCount = otherPlayerData.getEquipSuitsCount(KeyWord.COLOR_RED);
            //goldCount = otherPlayerData.getEquipSuitsCount(KeyWord.COLOR_GOLD);
            //orangeCount = otherPlayerData.getEquipSuitsCount(KeyWord.COLOR_ORANGE);
        }
        else {
            let thingDataManager: ThingData = G.DataMgr.thingData;
            pinkCount = thingDataManager.getEquipSuitsCount(KeyWord.COLOR_PINK);
            redCount = thingDataManager.getEquipSuitsCount(KeyWord.COLOR_RED);
            goldCount = thingDataManager.getEquipSuitsCount(KeyWord.COLOR_GOLD);
            orangeCount = thingDataManager.getEquipSuitsCount(KeyWord.COLOR_ORANGE);
        }
        if (orangeCount >= EnumEquipRule.EQUIP_ENHANCE_COUNT) {
            if (goldCount >= EnumEquipRule.EQUIP_ENHANCE_COUNT) {
                if (redCount >= EnumEquipRule.EQUIP_ENHANCE_COUNT) {
                    if (pinkCount > 0) {
                        color = KeyWord.COLOR_PINK;
                    }
                    else {
                        color = KeyWord.COLOR_RED;
                    }
                }
                else {
                    if (redCount > 0) {
                        color = KeyWord.COLOR_RED;
                    }
                    else {
                        color = KeyWord.COLOR_GOLD;
                    }
                }
            }
            else {
                if (goldCount > 0) {
                    color = KeyWord.COLOR_GOLD;
                }
                else {
                    color = KeyWord.COLOR_ORANGE;
                }
            }
        }
        else {
            color = KeyWord.COLOR_ORANGE;
        }
        return color;
    }

    // /**
    //  * 套装属性
    //  * @param holder
    //  * @param equipConfig
    //  * @param equipInfo
    //  * @param itemIns
    //  * @param dynamicInfo
    //  * @param isOther
    //  * @param posY
    //  */
    // private getSuitsDesc(equipConfig: GameConfig.ThingConfigM, dynamicInfo: Protocol.ThingProperty, isOther: boolean = false) {
    //     //紫色以上品质才显示套装
    //     let taozhuangStr: string = '';
    //     let suitNum: number = this.getSuitNum(equipConfig.m_ucStage, isOther);
    //     //taozhuangStr = TextFieldUtil.getColorText('\n', Color.PropYellow, 22);
    //     taozhuangStr += TextFieldUtil.getColorText(uts.format('{0}  套装加成 ({1}/{2})\n',
    //         EquipUtils.getOpenLvName(equipConfig.m_ucStage),
    //         suitNum > 8 ? 8 : suitNum,
    //         EquipUtils.All_EQUIP_NUM), Color.TIP_WHITE_COLOR, 22);
    //     let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(equipConfig.m_ucStage);
    //     let len: number = Game.ArrayHelper.GetArrayLength(colorList);
    //     let value: number = 0;
    //     let propList: any[] = [];
    //     let textColor: string = "";
    //     let profession: number = G.DataMgr.heroData.profession;

    //     //套装属性的显示
    //     //let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(equipConfig.);
    //     if (this.propList != null) {
    //         this.propList.Count = colorList.length;
    //         let specialPriAddPct = G.DataMgr.vipData.getSpecialPriRealPct(KeyWord.SPECPRI_EQUIPSUIT_ADD);

    //         for (let i = 0; i < this.propList.Count; i++) {
    //             if (this.equipCollectPropItem[i] == null) {
    //                 let item = this.propList.GetItem(i).gameObject;
    //                 this.equipCollectPropItem[i] = new EquipCollectPropItem();
    //                 this.equipCollectPropItem[i].setComponent(item);
    //             }
    //             this.equipCollectPropItem[i].update(colorList[i], suitNum, i, specialPriAddPct);
    //         }
    //     }
    //     else {
    //         for (let i = 0; i < colorList.length; i++) {
    //             let data = colorList[i];
    //             let color: string = "";
    //             if (suitNum >= data.m_ucNum) {
    //                 color = Color.GREEN;
    //             } else {
    //                 color = Color.GREY;
    //             }
    //             //taozhuangStr += TextFieldUtil.getColorText(data.m_ucNum + "件  " + KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.m_astPropAtt[i].m_ucPropId) + " + " + data.m_astPropAtt[i].m_ucPropValue + "\n", color, 22);
    //         }
    //     }
    //     return taozhuangStr;
    // }

    /**
		 *附加属性 
		 * @param holder
		 * @param randAttr
		 * @param posY
		 * @return 
		 * 
		 */
    private addRandomProp(randAttr: Protocol.RandAttrInfo, config: GameConfig.ThingConfigM) {
        this.txtRandomProp.gameObject.SetActive(true);
        let str: string = TextFieldUtil.getColorText("附加属性\n", Color.TIP_WHITE_COLOR, 22);
        //打出镶嵌属性
        for (let i: number = 0; i < 4; i++) {
            if (i < randAttr.m_ucNum) {
                str += TextFieldUtil.getColorText((KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, EquipStrengthenData.getKeyWordByEuai(randAttr.m_aiPropAtt[i].m_ucPropId)) + '+' + randAttr.m_aiPropAtt[i].m_iPropValue + "\n"), Color.TIP_BULE_COLOR, 22);
            }
            else {
                //   if (GameIDUtil.isPetEquipID(this.itemData.config.m_iID)) {
                str += TextFieldUtil.getColorText((uts.format('（{0}可激活属性{1}）\n', EquipUtils.PET_EQUIP_TAOZHUANG[i], i + 1)), Color.GREY, 22);
                //} else {
                //    str += TextFieldUtil.getColorText((uts.format('（{0}可激活属性{1}）\n', EquipUtils.ZHUFU_EQUIP_TAOZHUANG_NAME[i + 2], i + 1)), Color.GREY, 22);
                //}
            }
        }
        let part = this.itemData.config.m_iEquipPart;
        if (GameIDUtil.isPetEquipID(this.itemData.config.m_iID) && (part <= KeyWord.EQUIP_PARTCLASS_BANGLE && part >= KeyWord.EQUIP_PARTCLASS_ARMET)) {
            this.txtRandomProp.gameObject.SetActive(false);
        } else {
            this.txtRandomProp.text = str;
        }
    }

    /**
     * 伙伴套装
     * @param id
     * @param num
     */
    private addPetSuitsDesc(id: number, num: number, petEquipColor: number) {
        //this.setActionMingwen(false);
        //this.txtFuhun.gameObject.SetActive(false);
        //用套装文本显示
        let config: GameConfig.BeautySuitPropM = G.DataMgr.equipStrengthenData.getPetEquipSuitConfig(id);

        let taozhuangStr = '';
        if (config != null) {
            taozhuangStr += TextFieldUtil.getColorText(config.m_szName, Color.GREEN, 22);
            taozhuangStr += "\n";
            let color: string;
            let l: number = config.m_aszPartDesc.length;
            let val: number = 0;
            let has: number = 0;
            let str1: string = "";
            let str2: string = "";
            for (let i: number = 0; i < l; i++) {
                val = num % 10;
                if (val == 1) {
                    has++;
                }
                str1 += TextFieldUtil.getColorText(config.m_aszPartDesc[i].m_aszDesc + ' ', val > 0 ? Color.getColorById(petEquipColor) : Color.GREY, 22);
                num = Math.floor(num / 10);
            }
            taozhuangStr += (str1 + "\n");
            l = config.m_astPropAtt.length;
            for (let i = 0; i < l; i++) {
                let pStr = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, config.m_astPropAtt[i].m_ucPropId) + '+' + config.m_astPropAtt[i].m_ucPropValue;
                if (has < 4) {
                    pStr += '(4件套装激活)\n';
                    color = Color.GREY;
                } else {
                    pStr += '\n';
                    color = Color.WHITE;
                }
                str2 += TextFieldUtil.getColorText(pStr, color, 22);
            }

            taozhuangStr += str2;
        }

        taozhuangStr += this.getExtraInfo();
        this.txtTaoZhuang.text = taozhuangStr;

        //let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(this.curSelectStage);
        //this.propList.Count = colorList.length;
        //let specialPriAddPct = G.DataMgr.vipData.getSpecialPriRealPct(KeyWord.SPECPRI_EQUIPSUIT_ADD);

        //for (let i = 0; i < this.propList.Count; i++) {
        //    if (this.equipCollectPropItem[i] == null) {
        //        let item = this.propList.GetItem(i).gameObject;
        //        this.equipCollectPropItem[i] = new EquipCollectPropItem();
        //        this.equipCollectPropItem[i].setComponent(item);
        //    }
        //    this.equipCollectPropItem[i].update(colorList[i], numComplete, i, specialPriAddPct);
        //}
        this.setActionTaoZhuang(true);
    }








    /**
    * 更新五彩神石
    */
    private updateWuCaiShenShiPart(config: GameConfig.ThingConfigM, pos: number, isOther: boolean) {
        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        if ((this.tipData.isPreviewWuCaiEquip) || (equipStrengthenData.isEquipHadFinalUpLv(pos, isOther) && G.DataMgr.thingData.checkIsWaring(this.itemData, 0))) {
            this.setActionFinalUp(true);
            this.txtFinalUp.text = TextFieldUtil.getColorText("神石属性", Color.PropYellow, 22)
            let cfg = G.DataMgr.equipStrengthenData.getEquipFinalPropConfigByEquipPart(config.m_iEquipPart);
            this.finalUpList.Count = cfg.m_astPropAtt.length;
            for (let i = 0; i < this.finalUpList.Count; i++) {
                let item = this.finalUpList.GetItem(i);
                let txtBase = item.findText("txtBase");
                txtBase.text = (KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, cfg.m_astPropAtt[i].m_ucPropId) + '+' + cfg.m_astPropAtt[i].m_ucPropValue);
            }
        } else {
            this.setActionFinalUp(false);
        }
    }
    /**刷新精灵*/
    private refreshLingBaoTipView(): void {
        let configData: GameConfig.ThingConfigM = this.itemData.config;
        let lingbaoCfg: GameConfig.LingBaoCfgM = G.DataMgr.lingbaoData.getLingBaoCfg(configData.m_iID);
        if (lingbaoCfg == null) return;
        let equipCfg = ThingData.getThingConfig(lingbaoCfg.m_iEquipId);

        let str: string = TextFieldUtil.getColorText('效果\n', Color.GREEN, 22);
        let buffCfg: GameConfig.BuffConfigM = BuffData.getBuffByID(configData.m_iFunctionID);
        str += TextFieldUtil.getColorText(buffCfg.m_szBuffDescription, Color.DEFAULT_WHITE, 22);
        str += "\n";
        if (!(lingbaoCfg.m_sTipInfo == null || lingbaoCfg.m_sTipInfo == ""))
            str += TextFieldUtil.getColorText(lingbaoCfg.m_sTipInfo, Color.DEFAULT_WHITE, 22);
        str += "\n";
        str += TextFieldUtil.getColorText('获取途径\n', Color.GREEN, 22);
        str += TextFieldUtil.getColorText(lingbaoCfg.m_sSourceInfo, Color.DEFAULT_WHITE, 22);

        str += this.getExtraInfo();
        this.txtDes.text = str;

        if (null != this.itemData.data) {
            let propertyData: Protocol.ThingProperty = this.itemData.data.m_stThingProperty;
            let curTime: number = G.SyncTime.getCurrentTime();
            if (propertyData && propertyData.m_iPersistTime * 1000 > curTime) {
                // 需要精灵倒计时
                this.timeCheck = true;
            }
        }
    }

    private updateHunguEquip(equipConfig: GameConfig.ThingConfigM, dynamicInfo: Protocol.ThingProperty = null, tipData: ItemTipData = null, isWearing: boolean = false) {

    }

    /**
     * 魂骨基础属性显示
     * @param equipConfig
     * @param dynamicInfo
     * @param tipData
     * @param isWearing
     */
    private updateHunguEquipTip(equipConfig: GameConfig.ThingConfigM, dynamicInfo: Protocol.ThingProperty = null, tipData: ItemTipData = null, isWearing: boolean = false) {
        //强化额外加成2条属性
        this.txtExtra1.gameObject.SetActive(false);
        this.txtExtra2.gameObject.SetActive(false);
        this.setBaseInfoGoActive(false);

        this.txtBase.text = TextFieldUtil.getColorText("基础属性", Color.PropYellow, 22);
        //标题
        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        let equipPart = equipConfig.m_iEquipPart;

        //基础属性 第一条属性单独拿出来显示
        let propData = equipConfig.m_astBaseProp;
        let len = propData.length;
        this.baseList.Count = len;
        for (let i: number = 0; i < this.baseList.Count; i++) {
            let item = this.baseList.GetItem(i);
            let txtPropName = item.findText("txtPropName");
            let txtPropValue = item.findText("txtPropValue");

            let txtExtra = item.findText("txtExtra");
            if (txtExtra) txtExtra.gameObject.SetActive(false);
            txtPropName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, equipConfig.m_astBaseProp[i].m_ucPropId);
            txtPropValue.text = "+" + equipConfig.m_astBaseProp[i].m_ucPropValue;
        }
        //魂骨升级----------
        let lv = G.DataMgr.equipStrengthenData.getSlotRegineLv(equipPart - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN);
        let cfg: GameConfig.HunGuSlotUpLvM = G.DataMgr.hunliData.getHunGuEquipSlotConfigByPartAndLv(equipPart, lv);
        if (this.txtEquipPartLevelUp && this.txtEquipPartLevelUp.gameObject.activeSelf) {
            this.txtEquipPartLevelUp.gameObject.SetActive(false);
        }
        if (this.equipPartLevelUpList && this.equipPartLevelUpList.gameObject.activeSelf) {
            this.equipPartLevelUpList.gameObject.SetActive(false);
        }
        if (cfg) {//如果有升级属性
            if (cfg.m_usLevel > 0) {
                if (this.txtEquipPartLevelUp && !this.txtEquipPartLevelUp.gameObject.activeSelf) {
                    this.txtEquipPartLevelUp.gameObject.SetActive(true);
                }
                if (this.equipPartLevelUpList && !this.equipPartLevelUpList.gameObject.activeSelf) {
                    this.equipPartLevelUpList.gameObject.SetActive(true);
                }
                let length = cfg.m_astPropAtt.length;

                this.equipPartLevelUpList.Count = length;
                for (let j = 0; j < length; j++) {
                    if (cfg.m_astPropAtt[j].m_ucPropId == 0) {
                        break;
                    }
                    let item = this.equipPartLevelUpList.GetItem(j);
                    let txtPropName = item.findText("txtPropName");
                    let txtPropValue = item.findText("txtPropValue");
                    txtPropName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, cfg.m_astPropAtt[j].m_ucPropId);
                    txtPropValue.text = '+' + cfg.m_astPropAtt[j].m_ucPropValue;
                }
            }
        }
        //-----------------
        //魂骨强化
        let strengData = G.DataMgr.hunliData.hunguStrengeData.getConfigByPart(equipConfig.m_iEquipPart);
        if (strengData) {
            this.txtEquipStreng.gameObject.SetActive(true);
            this.equipStrengList.SetActive(true);
            let strengAtt = strengData.m_astProp;
            this.equipStrengList.Count = strengAtt.length;
            if (this.txtEquipStreng) {
                for (let j = 0; j < strengAtt.length; j++) {
                    if (strengAtt[j].m_ucPropId == 0) {
                        break;
                    }
                    let item = this.equipStrengList.GetItem(j);
                    let txtPropName = item.findText("txtPropName");
                    let txtPropValue = item.findText("txtPropValue");
                    txtPropName.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, strengAtt[j].m_ucPropId);
                    txtPropValue.text = '+' + strengAtt[j].m_ucPropValue;
                }
            }
        }
        else {
            this.txtEquipStreng.gameObject.SetActive(false);
            this.equipStrengList.SetActive(false);
        }

        //随机属性
        let hunguEquipInfo: Protocol.HunGuEquipInfo;
        if (dynamicInfo) {
            hunguEquipInfo = dynamicInfo.m_stSpecThingProperty.m_stHunGuEquipInfo;
        }

        let randomLen: number = 0;
        if (hunguEquipInfo) {
            this.txtFanXian.text = TextFieldUtil.getColorText("随机属性", Color.PropYellow, 22);
            randomLen = hunguEquipInfo.m_stRandAttr.m_ucNum;
            this.fanXianList.Count = randomLen;
            for (let i = 0; i < randomLen; i++) {
                let info = hunguEquipInfo.m_stRandAttr.m_aiPropAtt[i];
                let item = this.fanXianList.GetItem(i);
                let txtBase = item.findText("txtBase");
                let propId = info.m_ucPropId;// PropUtil.getPropIdByPropMacros(info.m_ucPropId);
                let color = Color.getColorById(info.m_ucColor);
                txtBase.text = TextFieldUtil.getColorText((KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propId) + '+' + (info.m_iPropValue / 100).toFixed(2) + "%"), color);
            }

            //封装属性
            this.attributeListItem.showNode();
            let data = G.DataMgr.hunliData.hunguIntensifyData.getHunGuFZCfg(equipConfig.m_iEquipPart, equipConfig.m_iDropLevel);
            let isIntensify = hunguEquipInfo.m_uiFengZhuangLevel == 0 ? false : true;
            this.updateBaseAttribute(data.m_astProp, isIntensify);

            // this.objFinalUp.SetActive(true);
            // let isIntensify = hunguEquipInfo.m_uiFengZhuangLevel == 0 ? false : true;
            // if (isIntensify) {
            //     this.txtFinalUp.text = TextFieldUtil.getColorText("封装属性", Color.PropYellow, 22)
            // }
            // else {
            //     this.txtFinalUp.text = uts.format("{0} {1}",
            //         TextFieldUtil.getColorText("封装属性", Color.YELLOW, 22),
            //         TextFieldUtil.getColorText("(未封装)", Color.GREY, 22));
            // }

            // let fzData = G.DataMgr.hunliData.getHunGuFZCfg(equipConfig.m_iEquipPart, equipConfig.m_iDropLevel);

            // this.finalUpList.Count = fzData.m_astProp.length;
            // for (let i = 0; i < this.finalUpList.Count; i++) {
            //     let cfg = fzData.m_astProp[i];
            //     let item = this.finalUpList.GetItem(i);
            //     let txtBase = item.findText("txtBase");
            //     txtBase.text = (KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, cfg.m_ucPropId) + '+' + cfg.m_iPropValue);
            // }

            //套装属性
            if (equipConfig.m_iEquipPart - KeyWord.HUNGU_EQUIP_SUBCLASS_MIN < G.DataMgr.hunliData.HUNGU_COUNT_NORMAL) {
                this.hunguTZAttribute.showNode();
                this.updateSuitAttribute(equipConfig, isIntensify);
            }

        }
        this.setActionFanXian(randomLen > 0)



        //this.txtTaoZhuang.text = TextFieldUtil.getColorText("神圣属性", Color.TIP_WHITE_COLOR, 22) + "\n" +
        //    TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propData[0].m_ucPropId) + "+" + propData[0].m_ucPropValue, "fff000");
        //this.setActionTaoZhuang(true);
    }

    /**刷新基础属性 */
    private updateBaseAttribute(equipData: GameConfig.HunGuFZAbility[], isintensify: boolean) {
        //装备位 年份（与星级无关）
        if (isintensify) {
            let str = TextFieldUtil.getColorText("封装属性", Color.YELLOW);
            this.attributeListItem.setTitle(str);
        }
        else {
            let str = uts.format("{0}{1}", TextFieldUtil.getColorText("封装属性", Color.YELLOW), TextFieldUtil.getColorText("(未封装)", Color.GREY));
            this.attributeListItem.setTitle(str);
        }

        this.attributeListItem.clearProperty();
        let count = equipData.length;
        for (let i = 0; i < count; i++) {
            let item = equipData[i];
            this.attributeListItem.addProperty(item.m_ucPropId, item.m_iPropValue);
        }
        this.attributeListItem.refreshPropertyNode();
    }

    /**刷新套装属性 */
    private updateSuitAttribute(equipConfig: GameConfig.ThingConfigM, isintensify: boolean) {
        let list = G.DataMgr.hunliData.hunguIntensifyData.getSuitIndexFormDrop(equipConfig.m_iDropLevel);
        let curNumber = list == null ? 0 : list.length;
        if (!isintensify)
            curNumber = 0;
        let data = G.DataMgr.hunliData.hunguIntensifyData.getHunGuTZCfg(equipConfig.m_iDropLevel);
        this.hunguTZAttribute.refreshNode(data, curNumber);

        let num = TextFieldUtil.getColorText(curNumber.toString(), curNumber == 0 ? Color.GREY : Color.GREEN);
        let numStr = uts.format("({0}/6)", num);
        let titlestr = TextFieldUtil.getColorText(data[0].m_szName, Color.YELLOW);
        this.hunguTZAttribute.setTitle(uts.format("{0} {1}", titlestr, numStr))

        this.hunguTZAttribute.setNumber("");

    }

    /**
     * 魂骨战斗力
     * @param equipConfig
     */
    private updateHunguBaseInfo(equipConfig: GameConfig.ThingConfigM, data: Protocol.ThingProperty) {
        //魂骨装备
        if (null != this.txtType) {
            this.txtType.gameObject.SetActive(false);
        }
        //base
        if (null != this.txtUseLv) {
            let des: string = '';
            let hunliLevel = equipConfig.m_ucHunLiLevel;
            des = uts.format("使用需求：{0}", KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, hunliLevel));
            let color = G.DataMgr.hunliData.level < hunliLevel ? Color.RED : Color.GREEN;
            this.txtUseLv.text = TextFieldUtil.getColorText(des, color, 22);
            this.txtUseLv.gameObject.SetActive(true);
        }

        if (data == null) {
            this.txtfight.text = "基础属性战力:" + FightingStrengthUtil.calStrength(equipConfig.m_astBaseProp).toString();
        }
        else {
            this.txtfight.text = "战斗力:" + G.DataMgr.hunliData.getHunguEquipFightS(equipConfig, data.m_stSpecThingProperty);
        }

    }

    // /**
    //  * 魂骨星星显示
    //  * @param equipConfig
    //  */
    // private updateHunguStart(equipConfig: GameConfig.ThingConfigM): number {
    //     //魂骨装备
    //     if (this.hunguStartDic == null) {
    //         this.hunguStartDic = {};
    //         this.hunguStartDic["一星"] = 1;
    //         this.hunguStartDic["二星"] = 2;
    //         this.hunguStartDic["三星"] = 3;
    //         this.hunguStartDic["四星"] = 4;
    //         this.hunguStartDic["五星"] = 5;
    //         this.hunguStartDic["六星"] = 6;
    //         this.hunguStartDic["七星"] = 7;
    //         this.hunguStartDic["八星"] = 8;
    //         this.hunguStartDic["九星"] = 9;
    //         this.hunguStartDic["十星"] = 10;
    //     }
    //     let str = /\S*星/;
    //     let val = equipConfig.m_szName.match(str);
    //     return this.hunguStartDic[val[0]];
    // }

    private onUpdate(): void {
        this.refreshLingBaoTipView();
    }

    onCheckTime() {
        if (!this.isUpdate) return;
        if (this.timeCheck) {
            this.onUpdate();
        }
        else {
            this.stopTime();
        }
    }

    private stopTime(): void {
        this.timeCheck = false;
    }
    dispose() {
        if (this.baseList) {
            this.baseList.dispose();
        }

        if (this.finalUpList) {
            this.finalUpList.dispose();
        }

        if (this.fanXianList) {
            this.fanXianList.dispose();
        }

        if (this.xilianList) {
            this.xilianList.dispose();
        }

        if (this.mingwenList) {
            this.mingwenList.dispose();
        }

        //if (this.lianTiBaseList) {
        //    this.lianTiBaseList.dispose();
        //}

        //if (this.lianTiList) {
        //    this.lianTiList.dispose();
        //}

        if (this.starList) {
            this.starList.dispose();
        }
    }

    /**
     * 调整tip的高度 
     * @param hight 0低  1中  2高 
     */
    private setTipPanelHight(hight: number) {
        if (this.parentPanel == null)
            return;

        if (hight == 0) {
            this.parentPanel.sizeDelta = new UnityEngine.Vector2(550, 400);
        }
        else if (hight == 1) {
            this.parentPanel.sizeDelta = new UnityEngine.Vector2(550, 600);
        }
        else {
            this.parentPanel.sizeDelta = new UnityEngine.Vector2(550, 600);
        }
    }


    /**伙伴装备显示 不符合需要变红。。。 */
    private isCanUse: boolean = true;
    setPetCanUse() {
        this.isCanUse = true;
    }

    setPetCannotUse() {
        this.isCanUse = false;
    }
}