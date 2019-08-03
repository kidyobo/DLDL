import { EnumGuide } from "System/constants/GameEnum";
import { UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { IGuideExecutor } from "System/guide/IGuideExecutor";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { MainView } from "System/main/view/MainView";
import { ShouChongTipView } from "./ShouChongTipView";
import { GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm';
import { ElemFinder } from 'System/uilib/UiUtility';
import { MathUtil } from "System/utils/MathUtil";

export class FirstRechargeView extends CommonForm implements IGuideExecutor {
    private _config: GameConfig.KFSCLBCfgM;
    private rewardList: UnityEngine.GameObject = null;
    private itemIcon_Normal: UnityEngine.GameObject = null;
    private iconItems: IconItem[] = [];
    //private modelId: number = 10000000;

    private maxShowRewardCount: number = 6;
    private professionItemId: { [typeDayKey: number]: number } = {};
    private rotateNode: UnityEngine.GameObject;

    private imageTitle: UnityEngine.UI.RawImage;

    private btnRecharge: GameObjectGetSet;
    private txtBtnRecharge: TextGetSet;
    private btnGet2: GameObjectGetSet;
    private txtBtnGet2: TextGetSet;
    private btnGet3: GameObjectGetSet;
    private txtBtnGet3: TextGetSet;
    private btnSelectedGos: GameObjectGetSet[] = [];
    private btnSelectIndex: number = 0;

    private nodePet: GameObjectGetSet;
    private weaponParent: GameObjectGetSet;

    private weaponMan: GameObjectGetSet;

    private weaponWomen: GameObjectGetSet;
    private boxNode: GameObjectGetSet;
    private modelNode: GameObjectGetSet[] = [];
    private txtFight: TextGetSet;
    /**是否首充*/
    private isRecharge: boolean = false;
    /**是否可领取*/
    private canGet: boolean[] = [false, false, false];
    private tipMarks: GameObjectGetSet[] = [];
    constructor() {
        super(KeyWord.ACT_FUNCTION_FIRSTCHARGE);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.FirstRechargeView;
    }

    protected initElements() {
        this.rewardList = this.elems.getElement("rewardList");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        for (let i = 0; i < this.maxShowRewardCount; i++) {
            let iconItem = new IconItem();
            let root = this.rewardList.transform.GetChild(i).gameObject;
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, root);
            iconItem.setTipFrom(TipFrom.normal);
            this.iconItems.push(iconItem);
        }

        this.rotateNode = this.elems.getElement("rotateNode");
        this.professionItemId[KeyWord.PROFTYPE_WARRIOR] = 10409021;
        this.professionItemId[KeyWord.PROFTYPE_HUNTER] = 10409031;

        this.imageTitle = this.elems.getRawImage("imageTitle");
        this.btnRecharge = new GameObjectGetSet(this.elems.getElement("btnRecharge"));
        this.btnSelectedGos.push(new GameObjectGetSet(ElemFinder.findObject(this.btnRecharge.gameObject, "selected")));
        this.tipMarks.push(new GameObjectGetSet(ElemFinder.findObject(this.btnRecharge.gameObject, "tipMark")));
        this.txtBtnRecharge = new TextGetSet(this.elems.getText("txtBtnRecharge"));
        this.btnGet2 = new GameObjectGetSet(this.elems.getElement("btnGet2"));
        this.btnSelectedGos.push(new GameObjectGetSet(ElemFinder.findObject(this.btnGet2.gameObject, "selected")));
        this.tipMarks.push(new GameObjectGetSet(ElemFinder.findObject(this.btnGet2.gameObject, "tipMark")));
        this.txtBtnGet2 = new TextGetSet(this.elems.getText("txtBtnGet2"));
        this.btnGet3 = new GameObjectGetSet(this.elems.getElement("btnGet3"));
        this.btnSelectedGos.push(new GameObjectGetSet(ElemFinder.findObject(this.btnGet3.gameObject, "selected")));
        this.tipMarks.push(new GameObjectGetSet(ElemFinder.findObject(this.btnGet3.gameObject, "tipMark")));
        this.txtBtnGet3 = new TextGetSet(this.elems.getText("txtBtnGet3"));
        //默认显示第一个按钮的选中
        for (let i = 0; i < this.btnSelectedGos.length; i++) {
            this.btnSelectedGos[i].SetActive(i==0);
        }

        this.weaponParent = new GameObjectGetSet(this.elems.getElement("weaponParent"));
        this.modelNode.push(this.weaponParent);
        this.weaponMan = new GameObjectGetSet(this.elems.getElement("weaponMan"));
        this.weaponWomen = new GameObjectGetSet(this.elems.getElement("weaponWomen"));
        this.boxNode = new GameObjectGetSet(this.elems.getElement("boxNode"));
        this.modelNode.push(this.boxNode);
        this.nodePet = new GameObjectGetSet(this.elems.getElement("nodePet"));
        this.modelNode.push(this.nodePet);

        this.txtFight = new TextGetSet(this.elems.getText("txtFight"));
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement("mask"), this.close);
        this.addClickListener(this.elems.getElement("btn_return"), this.close);

        this.addClickListener(this.btnRecharge.gameObject, this.onClickBtnRecharge);
        this.addClickListener(this.btnGet2.gameObject, this.onClickBtnGet2);
        this.addClickListener(this.btnGet3.gameObject, this.onClickBtnGet3);
    }

    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        this.updateView();
        this.updateBtn();
        G.GuideMgr.processGuideNext(EnumGuide.ZhiShengDan, EnumGuide.ZhiShengDan_OpenFirstRecharge);
        G.GuideMgr.processGuideNext(EnumGuide.RechargeReach, EnumGuide.RechargeReach_OpenShouChong);
        G.ChannelSDK.refreshPayState();
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
        let shouchong = G.Uimgr.getForm<ShouChongTipView>(ShouChongTipView);
        if (shouchong != null && shouchong.isOpened) {
            shouchong.close();
        }
        G.GuideMgr.processGuideNext(EnumGuide.ZhiShengDan, EnumGuide.GuideCommon_None);
        G.GuideMgr.processGuideNext(EnumGuide.RechargeReach, EnumGuide.GuideCommon_None);
    }

    public updateView(): void {
        this.updatePanel();
        this.updateBtn();
    }

    private updatePanel(): void {
        G.ResourceMgr.loadImage(this.imageTitle, uts.format('images/FirstCharge/FirstCharge_TXT_{0}.png', this.btnSelectIndex+1));
        //刷新数据
        this._config = G.DataMgr.firstRechargeData.getSclbConfByTDL(KeyWord.GIFT_TYPE_SC, KeyWord.GIFT_TYPE_ROLE_SC, 1, this.btnSelectIndex+1);
        //显示奖励物品
        let rewardThingList = this._config.m_stItemList;
        //区分男女的注释掉了
        // let itemId = G.DataMgr.heroData.profession == KeyWord.PROFTYPE_WARRIOR ? this.professionItemId[KeyWord.PROFTYPE_HUNTER] : this.professionItemId[KeyWord.PROFTYPE_WARRIOR];
        // for (let index = 0; index < rewardThingList.length; index++) {
        //     if (rewardThingList[index].m_iID == itemId) {
        //         rewardThingList.splice(index, 1);
        //         break;
        //     }
        // }
        for (let i = 0; i < this.maxShowRewardCount; i++) {
            let rewardData = rewardThingList[i];
            if (rewardData != null) {
                this.iconItems[i].updateById(rewardData.m_iID, rewardData.m_iCount);
            } else {
                this.iconItems[i].updateById(0, 0);
            }
            this.iconItems[i].updateIcon();
        }

        //根据选择显示隐藏模型节点
        for (let i = 0; i < this.modelNode.length; i++) {
            this.modelNode[i].SetActive(i == this.btnSelectIndex);
        }

        switch (this.btnSelectIndex) {
            case 0:
                this.txtFight.text = "战力 +2886";
                let prof = G.DataMgr.heroData.profession;
                let modelUrl = G.DataMgr.constData.getValueById(KeyWord.PARAM_FIRST_MODEL_VIEW) + "_" + prof;
                G.ResourceMgr.loadModel(prof == 1 ? this.weaponMan.gameObject : this.weaponWomen.gameObject, UnitCtrlType.weapon, modelUrl, this.sortingOrder, true);
                break;
            case 1:
                this.txtFight.text = "魂骨抽奖令x10";
                break;
            case 2:
                this.txtFight.text = "战力 +17748";
                //小舞
                G.ResourceMgr.loadModel(this.nodePet.gameObject, UnitCtrlType.pet, "200002", this.sortingOrder);
                break;
        }
        //加载罗三炮
        G.ResourceMgr.loadModel(this.rotateNode, UnitCtrlType.lingbao, "350013", this.sortingOrder);
    }

    private updateBtn() {
        let scValue = G.DataMgr.firstRechargeData.scValue;
        this.isRecharge = scValue != null && (scValue.m_uiLifeSCTime > 0 || scValue.m_ucGetRFCBit > 0 || scValue.m_uiSCValue>0);

        //第一个按钮没有时间限制
        if (this.isRecharge) {//首充了
            this.canGet[0] = !MathUtil.checkPosIsReach(0, scValue.m_ucGetRFCBit);
            this.tipMarks[0].SetActive(this.canGet[0]);
            if (!this.canGet[0]) {
                this.txtBtnRecharge.text = "已领取";
            } else {
                this.txtBtnRecharge.text = "可领取";
            }
            //毫秒
            let time = G.SyncTime.getOneZeroTime(G.SyncTime.getCurrentTime()) - G.SyncTime.getOneZeroTime(scValue.m_uiLifeSCTime * 1000);
            //一天  86400000毫秒
            if (time >= 86400000 && time < 86400000 * 2) {//第二天
                if (this.isRecharge) {//首充了
                    this.canGet[1] = !MathUtil.checkPosIsReach(1, scValue.m_ucGetRFCBit);
                    this.tipMarks[1].SetActive(this.canGet[1]);
                    if (!this.canGet[1]) {
                        this.txtBtnGet2.text = "已领取";
                    } else {
                        this.txtBtnGet2.text = "可领取";
                    }
                }
            } else if (time >= 86400000 * 2) {
                if (this.isRecharge) {//首充了
                    this.canGet[1] = !MathUtil.checkPosIsReach(1, scValue.m_ucGetRFCBit);
                    this.tipMarks[1].SetActive(this.canGet[1]);
                    if (!this.canGet[1]) {
                        this.txtBtnGet2.text = "已领取";
                    } else {
                        this.txtBtnGet2.text = "可领取";
                    }
                    this.canGet[2] = !MathUtil.checkPosIsReach(2, scValue.m_ucGetRFCBit);
                    this.tipMarks[2].SetActive(this.canGet[2]);
                    if (!this.canGet[2]) {
                        this.txtBtnGet3.text = "已领取";
                    } else {
                        this.txtBtnGet3.text = "可领取";
                    }
                }
            }
        }
    }

    /**领取奖励*/
    private _onBtnGet(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSCGetRewardRequest(this._config.m_ucLevel));
    }

    /**充值*/
    private _onBtnRecharge(): void {
        this.close();
        G.ActionHandler.go2Pay();
    }

    private onClickBtnRecharge(): void {
        if (this.btnSelectIndex == 0) {
            if (this.isRecharge) {//首充了
                if (this.canGet[0])
                    this._onBtnGet();
            } else {//没有充值
                this._onBtnRecharge();
            }
        }
        else {
            this.showBtnSelectGo(0);
        }
    }

    private onClickBtnGet2(): void {
        if (this.btnSelectIndex == 1) {
            if (this.isRecharge) {//首充了
                if (this.canGet[1])
                    this._onBtnGet();
            } else {//没有充值
                this._onBtnRecharge();
            }
        }
        else {
            this.showBtnSelectGo(1);
        }
    }

    private onClickBtnGet3(): void {
        if (this.btnSelectIndex == 2) {
            if (this.isRecharge) {//首充了
                if (this.canGet[2])
                    this._onBtnGet();
            } else {//没有充值
                this._onBtnRecharge();
            }
        }
        else {
            this.showBtnSelectGo(2);
        }
    }

    private showBtnSelectGo(index: number) {
        this.btnSelectIndex = index;
        this.updatePanel();
        for (let i = 0; i < this.btnSelectedGos.length; i++) {
            this.btnSelectedGos[i].SetActive(index == i);
        }
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        return false;
    }
}