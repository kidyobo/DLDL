import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { NestedSubForm } from 'System/uilib/NestedForm'
import { Global as G } from "System/global";
import { TipFrom } from 'System/tip/view/TipsView'
import { ThingItemData } from "System/data/thing/ThingItemData";
import { BatchUseView } from "System/bag/view/BatchUseView";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { Macros } from 'System/protocol/Macros';
import { ThingData } from "System/data/thing/ThingData";
import { KeyWord } from "System/constants/KeyWord";
import { EquipUtils } from "System/utils/EquipUtils";
import { EquipStrengthenData } from "System/data/EquipStrengthenData";
import { EnumEquipRule } from "System/data/thing/EnumEquipRule";
import { Color } from "System/utils/ColorUtil";
import { PropInfoVo } from "System/data/vo/PropInfoVo";
import { IconItem } from "System/uilib/IconItem";
import { ItemTipData } from "System/tip/tipData/ItemTipData";
import { EnumTipBagType } from "System/constants/GameEnum";
import { FightingStrengthUtil } from "System/utils/FightingStrengthUtil";
import { TipType, EnumStoreID } from "System/constants/GameEnum";
import { SpecialCharUtil } from "System/utils/SpecialCharUtil";
import { ZhufuData } from "System/data/ZhufuData";
import { BagItemData } from 'System/bag/BagItemData';
import { RegExpUtil } from "System/utils/RegExpUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIPathData } from "System/data/UIPathData"
import { PetData } from "System/data/pet/PetData";
import { DataFormatter } from 'System/utils/DataFormatter'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { GuildExchangeView } from 'System/guild/view/GuildExchangeView'
import { ItemTipBase } from 'System/tip/view/ItemTipBase'
import { GameIDType } from 'System/constants/GameEnum'
import { BagEquipView } from 'System/bag/view/BagEquipView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ConfirmCheck } from 'System/tip/TipManager'
import { MessageBoxConst } from 'System/tip/TipManager'
import { GuildTools } from 'System/guild/GuildTools'
import { UILayer } from 'System/uilib/CommonForm'

export class ItemTipView extends NestedSubForm {
    /**精灵相关*/
    private isUpdate: boolean = false;

    /**临时存储数据（点击物品）*/
    private tipData: ItemTipData;
    private tipFrom: TipFrom;
    /**存放tip转变成的ThingItemData*/
    private itemData: ThingItemData = new ThingItemData();

    private itemIcon_Normal: UnityEngine.GameObject;

    /**按钮*/
    private buttons: UnityEngine.GameObject = null;
    private btnEquip: UnityEngine.GameObject = null;
    btnUse: UnityEngine.GameObject = null;
    private btnExchange: UnityEngine.GameObject = null;
    private btnShangJia: UnityEngine.GameObject = null;
    private btnShow: UnityEngine.GameObject = null;
    private btnSplit: UnityEngine.GameObject = null;
    private btnTakeOut: UnityEngine.GameObject = null;
    private btnPutIn: UnityEngine.GameObject = null;
    private btnTakeOff: UnityEngine.GameObject = null;
    private btnReplace: UnityEngine.GameObject = null;
    private btnBuy: UnityEngine.GameObject = null;
    private btnDelete: UnityEngine.GameObject = null;
    private btnJingLian: UnityEngine.GameObject = null;
    private btnGet: UnityEngine.GameObject = null;
    /**已装备*/
    private objWeared: UnityEngine.GameObject = null;

    /**物品*/
    private thingInfo: UnityEngine.GameObject;
    /**装备*/
    private equipInfo: UnityEngine.GameObject;
    /**tip数据*/
    private itemTipBase: ItemTipBase;

    private txtReplace: UnityEngine.UI.Text;

    /**底部区域*/
    private bottom: UnityEngine.GameObject;
    /**兑换价格*/
    private txtPrice: UnityEngine.UI.Text;

    private center: UnityEngine.GameObject;
    private bg: UnityEngine.GameObject;

    /**标记是否要拿下一强化等级相关数据或配置*/
    private isGetNextStreng: boolean = false;
    /**标记是否要拿下一等级相关数据或配置*/
    private isGetNextPartLv: boolean = false;
    private tag:number = 0;
    private num:number = 0;
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.OnlyTip;
    }

    protected resPath(): string {
        return UIPathData.ItemTipView;
    }
    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');

        this.buttons = this.elems.getElement('buttons');
        this.btnEquip = this.elems.getElement("btnEquip");
        this.btnGet = this.elems.getElement("btnGet");
        this.btnUse = this.elems.getElement("btnUse");
        this.btnExchange = this.elems.getElement("btnExchange");
        this.btnShangJia = this.elems.getElement("btnShangJia");
        this.btnShow = this.elems.getElement("btnShow");
        this.btnSplit = this.elems.getElement("btnSplit");
        this.btnTakeOut = this.elems.getElement("btnTakeOut");
        this.btnPutIn = this.elems.getElement("btnPutIn");
        this.btnReplace = this.elems.getElement("btnReplace");
        this.btnTakeOff = this.elems.getElement("btnTakeOff");
        this.btnBuy = this.elems.getElement("btnBuy");
        this.btnDelete = this.elems.getElement('btnDelete');
        this.btnJingLian = this.elems.getElement('btnJingLian');

        this.objWeared = this.elems.getElement('objWeared');
        this.txtReplace = ElemFinder.findText(this.btnReplace.gameObject, 'Text');
        //左侧tip信息
        this.thingInfo = this.elems.getElement("thingInfo");
        this.equipInfo = this.elems.getElement("equipInfo");

        this.itemTipBase = new ItemTipBase();
        this.itemTipBase.setParentPanel(this.form);
        this.itemTipBase.setBaseInfoComponents(this.elems.getUiElements('baseInfo'), this.itemIcon_Normal, this.objWeared);
        this.itemTipBase.setThingInfoComponents(this.thingInfo);
        this.itemTipBase.setEquipInfoComponents(this.equipInfo, this.elems.getUiElements('equipInfo'));

        this.bottom = this.elems.getElement('bottom');
        this.txtPrice = this.elems.getText('txtPrice');
        this.center = this.elems.getElement('center');
        this.bg = this.elems.getElement('bg');

    }
    protected initListeners(): void {
        this.addClickListener(this.btnEquip, this.onBtnEquip);
        this.addClickListener(this.btnUse, this.onBtnUse);
        this.addClickListener(this.btnExchange, this.onBtnExchange);
        this.addClickListener(this.btnShangJia, this.onBtnShangJia);
        this.addClickListener(this.btnShow, this.onBtnShow);
        this.addClickListener(this.btnSplit, this.onBtnSplit);
        this.addClickListener(this.btnTakeOut, this.onBtnTakeOut);
        this.addClickListener(this.btnPutIn, this.onBtnPutIn);
        this.addClickListener(this.btnTakeOff, this.onBtnTakeOff);
        this.addClickListener(this.btnReplace, this.onBtnReplace);
        this.addClickListener(this.btnBuy, this.onBtnBuy);
        this.addClickListener(this.btnDelete, this.onBtnDelete);
        this.addClickListener(this.btnJingLian, this.onBtnJingLian);
        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onBtnGet,this.tag,this.num);
    }
    open(tipData: ItemTipData, from: TipFrom, isGetNextStreng: boolean = false, isGetNextPartLv: boolean = false,tag:number =0,num:number = 0) {
        if (null == tipData || TipFrom.none == from) {
            return;
        }
        this.tipFrom = from;
        this.tipData = tipData;
        this.isGetNextStreng = isGetNextStreng;
        this.isGetNextPartLv = isGetNextPartLv;
        this.tag = tag;
        this.num = num;
        
        super.open();
    }
    protected onClose() {
    }

    protected onOpen() {
        //开启计时器
        this.isUpdate = false;
        this.updateView();

        if (this.tipData.isWearing || this.tipData.isDuibi) {
            this.txtReplace.text = "替换";
        } else {
            this.txtReplace.text = "穿上";
        }

        if (TipFrom.bag == this.tipFrom) {
            this.showBagButtons();
        } else if (TipFrom.chat == this.tipFrom) {
            this.showButtons(true, false, false, false, false, false, false, false, false, false, false, false, false,false);
        } else if (TipFrom.takeOut == this.tipFrom) {
            this.showButtons(false, false, false, false, false, false, true, false, false, false, false, false, false,false);
        } else if (TipFrom.putIn == this.tipFrom) {
            this.showButtons(false, false, false, false, false, false, false, true, false, false, false, false, false,false);
        } else if (TipFrom.takeOff == this.tipFrom) {
            //是精灵，啥都没有
            if (GameIDUtil.isRoleEquipID(this.tipData.configData.m_iID) && this.tipData.configData.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_LINGBAO)
                this.showButtons(false, false, false, false, false, false, false, false, false, false, false, false, false,false);
            else
                this.showButtons(false, false, false, false, false, false, false, false, true, false, false, false, true,false);
        } else if (TipFrom.equip == this.tipFrom) {
            this.showButtons(false, false, false, false, false, false, false, false, false, false, false, false, false,false);
        } else if (TipFrom.material == this.tipFrom) {
            this.showButtons(false, false, false, false, false, false, false, false, false, false, true, false, false,false);
        } else if (TipFrom.guildStore == this.tipFrom) {
            this.showButtons(false, false, false, true, false, false, false, false, false, false, false, false, false,false);
        } else if (TipFrom.tanbao == this.tipFrom) {
            this.showButtons(false, false, false, false, false, false, true, false, false, false, false, false, false,false);
        } else if (TipFrom.replace_1 == this.tipFrom) {
            this.showButtons(false, false, false, false, false, false, false, false, true, true, false, false, false,false);
        }else if(TipFrom.get == this.tipFrom){
            this.showButtons(false, false, false, false, false, false, false, false, false, false, false, false, false,true);
        }
        else {
            this.showButtons(false, false, false, false, false, false, false, false, false, false, false, false, false,false);
        }
    }

    private showButtons(showEnabled: boolean, equipEnabled: boolean, useEnabled: boolean, exchangeEnabled: boolean, spliteEnabled: boolean,
        shangjiaEnabled: boolean, takeOutEnabled: boolean, putInEnabled: boolean, takeOffEnabled: boolean,
        replaceEnabled: boolean, buyEnabled: boolean, deleteEnabled: boolean, jingLianEnabled: boolean,getEnable:boolean) {
        this.btnShow.gameObject.SetActive(showEnabled);
        this.btnEquip.gameObject.SetActive(equipEnabled);
        this.btnUse.gameObject.SetActive(useEnabled);
        this.btnExchange.gameObject.SetActive(exchangeEnabled);
        this.btnSplit.gameObject.SetActive(spliteEnabled);
        this.btnShangJia.gameObject.SetActive(shangjiaEnabled);
        this.btnTakeOut.gameObject.SetActive(takeOutEnabled);
        this.btnPutIn.gameObject.SetActive(putInEnabled);
        this.btnTakeOff.gameObject.SetActive(takeOffEnabled);
        this.btnReplace.gameObject.SetActive(replaceEnabled);
        this.btnJingLian.gameObject.SetActive(jingLianEnabled);
        this.btnGet.gameObject.SetActive(getEnable);
        if (buyEnabled) {
            let m = G.DataMgr.npcSellData.getMarketDataByItemId(this.tipData.configData.m_iID);
            buyEnabled = null != m && EnumStoreID.Mall_TeMai != m.sellConfig.m_iStoreID;
        }
        this.btnBuy.gameObject.SetActive(buyEnabled);
        this.btnDelete.gameObject.SetActive(deleteEnabled);
        let showButtons: boolean = showEnabled || equipEnabled || useEnabled || exchangeEnabled ||
            spliteEnabled || shangjiaEnabled || takeOutEnabled || putInEnabled || takeOffEnabled || replaceEnabled || buyEnabled || deleteEnabled||getEnable;
        this.buttons.SetActive(showButtons);
        if (showButtons) {//tips有按钮显示
            if (this.bottom.activeSelf) {
                this.setCenterGoBottom(120);
            } else {
                this.setCenterGoBottom(100);
            }
        } else {
            if (this.bottom.activeSelf) {
                this.setCenterGoBottom(120);
            } else {
                this.setCenterGoBottom(40);
            }
        }
    }

    private setCenterGoBottom(bottom: number) {
        let rt = this.center.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
        rt.offsetMin = new UnityEngine.Vector2(rt.offsetMin.x, bottom);
    }

    private showBg(isShow: boolean) {
        this.bg.SetActive(isShow);
    }

    /**
     * 根据Tip数据显示Tip
     * @param tipInfo
     */
    private updateView() {
        this.itemData.data = this.tipData.thingInfo;
        this.itemData.config = this.tipData.configData;
        this.itemData.containerID = this.tipData.containerID;
        this.itemTipBase.updateInfo(this.tipData, this.isGetNextStreng, this.isGetNextPartLv);

        // 宗门仓库里的物品显示兑换所需贡献度
        if (this.itemData.containerID == Macros.CONTAINER_TYPE_GUILDSTORE) {
            let needMoney = GuildTools.getDepotBuyMoney(this.itemData.config.m_iID, 1);
            this.txtPrice.text = uts.format('需要宗门贡献度：{0}', needMoney);
            this.bottom.SetActive(true);
        } else {
            this.bottom.SetActive(false);
        }
        G.DataMgr.runtime.__tip_id = this.itemData.config.m_iID;
    }

    /**
    *购买
    */
    private onBtnBuy() {
        G.ViewCacher.tipsView.close();
        G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.tipData.configData.m_iID, 1);
    }

    /**
     *替换装备 
     */
    private onBtnReplace() {
        let equipPart = this.itemData.config.m_iEquipPart;
        let data = this.itemData;
        let petOrZhufuId = G.ActionHandler.getEquipKeyWorkByEquipPart(equipPart);

        //0表示伙伴，需要得到具体那个伙伴
        if (petOrZhufuId == 0) {
            let pet: Protocol.NewBeautyInfo;
            if (this.itemData.config.m_iFunctionID > 0) {
                pet = G.DataMgr.petData.getPetInfo(this.itemData.config.m_iFunctionID);
            } else if (this.tipData.petOrZhufuId > 0) {
                pet = G.DataMgr.petData.getPetInfo(this.tipData.petOrZhufuId);
            }
            if (pet == null) {
                pet = G.DataMgr.petData.getFollowPet();
            }
            petOrZhufuId = pet.m_iBeautyID;
        }

        G.ViewCacher.tipsView.close();
        if (TipFrom.replace_1 == this.tipFrom) {
            G.ActionHandler.showBagEquipPanel(equipPart, data, petOrZhufuId, GameIDUtil.getEquipIDType(data.config.m_iID));
        } else {
            G.ActionHandler.takeOnEquip(data, petOrZhufuId);
        }
    }

    /**
     * 脱下装备 
     */
    private onBtnTakeOff() {
        G.ViewCacher.tipsView.close();
        G.ModuleMgr.bagModule.takeOff(this.itemData);
    }

    /**
     * 取出物品
     */
    private onBtnTakeOut() {
        G.ViewCacher.tipsView.close();
        if (TipFrom.takeOut == this.tipFrom) {
            if (G.DataMgr.thingData.isBagFull) {
                G.TipMgr.addMainFloatTip('背包已满，不能放入物品');
            }
            else {
                G.ModuleMgr.bagModule.swapThing(Macros.CONTAINER_TYPE_ROLE_STORE, this.itemData.data, Macros.CONTAINER_TYPE_ROLE_BAG, Macros.UNDEFINED_CONTAINER_POSITION);
            }
        }
        else if (TipFrom.tanbao == this.tipFrom) {
            // 否则放入背包
            if (G.DataMgr.thingData.isBagFull) {
                G.TipMgr.addMainFloatTip('背包已满，不能放入物品');
            }
            else {
                //天宫宝镜
                G.ModuleMgr.bagModule.swapThing(Macros.CONTAINER_TYPE_SKYLOTTERY, this.itemData.data, Macros.CONTAINER_TYPE_ROLE_BAG, Macros.UNDEFINED_CONTAINER_POSITION);
            }
        }
        else if (TipFrom.starStore == this.tipFrom) {
            // 否则放入背包
            if (G.DataMgr.thingData.isBagFull) {
                G.TipMgr.addMainFloatTip('背包已满，不能放入物品');
            }
            else {
                //星斗宝库
                G.ModuleMgr.bagModule.swapThing(Macros.CONTAINER_TYPE_STARLOTTERY, this.itemData.data, Macros.CONTAINER_TYPE_ROLE_BAG, Macros.UNDEFINED_CONTAINER_POSITION);
            }
        }
    }

    /**
     * 放入仓库
     */
    private onBtnPutIn() {
        G.ViewCacher.tipsView.close();

        if (G.DataMgr.thingData.isStoreFull) {
            G.TipMgr.addMainFloatTip('仓库已满，不能放入物品');
        }
        else if (this.itemData.config.m_ucIsStore == 0) {
            G.TipMgr.addMainFloatTip('该物品不能存入仓库');
        }
        else {
            G.ModuleMgr.bagModule.swapThing(Macros.CONTAINER_TYPE_ROLE_BAG, this.itemData.data, Macros.CONTAINER_TYPE_ROLE_STORE, Macros.UNDEFINED_CONTAINER_POSITION);
        }

    }

    /**
     * 装备按钮
     */
    private onBtnEquip() {
        G.ViewCacher.tipsView.close();
        G.ModuleMgr.bagModule.useThing(this.itemData.config, this.itemData.data);
    }

    /**
     * 使用按钮
     */
    private onBtnUse() {
        G.ViewCacher.tipsView.close();
        let thingConfig: GameConfig.ThingConfigM = this.itemData.config;
        if ((thingConfig.m_ucCanBatUse & KeyWord.ITEM_USE_METHOD_BATUSE) != 0 && this.itemData.data.m_iNumber > 1) {
            G.Uimgr.createForm<BatchUseView>(BatchUseView).open(this.itemData);
        } else {
            G.ModuleMgr.bagModule.useThing(this.itemData.config, this.itemData.data);
        }
    }

    private onBtnExchange() {
        G.ViewCacher.tipsView.close();
        if (this.itemData.data.m_iNumber == 1) {
            GuildTools.doExchange(this.itemData, 1);
        } else {
            G.Uimgr.createForm<GuildExchangeView>(GuildExchangeView).open(this.itemData);
        }
    }

    private onBtnDelete() {
        G.ViewCacher.tipsView.close();
        G.ActionHandler.deleteBagThing(this.itemData.data);
    }

    private onBtnShangJia() {
    }

    /**
    * 展示，聊天的发送按钮链接
    */
    private onBtnShow() {
        let tipData: ItemTipData = this.tipData as ItemTipData;
        if (null != tipData) {
            G.ModuleMgr.chatModule.appendItemText(tipData.configData, tipData.thingInfo.m_stThingProperty.m_stGUID);
        }
        G.ViewCacher.tipsView.close();
    }

    private onBtnSplit() {

    }

    ////////////////////////////////////////////////按钮的显示//////////////////////////////////

    /**
     * 根据物品显示按钮
     */
    private showBagButtons(): void {
        let showEnabled = true;
        let equipEnabled = false;
        let useEnabled = false;
        let exchangeEnabled = false;
        let spliteEnabled = false;
        let shangjiaEnabled = false;
        let takeOutEnabled = false;
        let putInEnabled = false;
        let takeOffEnabled = false;
        let replaceEnabled = false;
        let buyEnabled = false;
        let deleteEnabled = false;
        let jingLianEnabled = false;
        let getEnabled = false;
        if (null != this.itemData) {
            let thingConfig = this.itemData.config;
            // 可以交易所
            shangjiaEnabled = (thingConfig.m_ucAuctionClass1 > 0 && !GameIDUtil.isBindingThing(thingConfig.m_iID, this.itemData.data.m_stThingProperty));
            // 道具店未打开
            if (GameIDUtil.isEquipmentID(thingConfig.m_iID)) {
                // 可装备            
                equipEnabled = true;
            }
            else if (thingConfig.m_iUseTimes > 0) {
                // 非装备            
                useEnabled = true;
            }
            // 可分解
            spliteEnabled = thingConfig.m_uiMeltInfo > 0;
            // 可丢弃
            deleteEnabled = 1 == thingConfig.m_ucIsDestroy;
        }
        this.showButtons(showEnabled, equipEnabled, useEnabled, exchangeEnabled, spliteEnabled, shangjiaEnabled, takeOutEnabled, putInEnabled, takeOffEnabled, replaceEnabled, buyEnabled, deleteEnabled, jingLianEnabled,getEnabled);
    }

    private onBtnJingLian() {
        if (G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN)) {
            G.ViewCacher.tipsView.close();
        }
    }
    private onBtnGet(currentTag:number=0,num:number=0){
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSkyLotteryRequest(Macros.SKYLOTTERY_EXTRA_REWARD,this.tag,this.num));
        this.close();
    }
   
}