import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { UIPathData } from 'System/data/UIPathData'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { UIEffect, EffectType } from 'System/uiEffect/UIEffect'
import { EnumGuide } from 'System/constants/GameEnum'
import { FloatShowType } from 'System/floatTip/FloatTip'
import { GameObjectGetSet } from 'System/uilib/CommonForm'
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { MainView } from "System/main/view/MainView";

import { VipView, VipTab } from 'System/vip/VipView'
export class KuaiSuShengJiView extends CommonForm implements IGuideExecutor {

    private currencyTip: CurrencyTip;
    ///////////////////经验面板相关////////////////////
    private expPanel: UnityEngine.GameObject;
    private expConfig: GameConfig.QiFuConfigM;
    private m_restTime1: number = 1;
    private canGetExpText: UnityEngine.UI.Text;
    private expCostText: UnityEngine.UI.Text;
    private expLeftTime: UnityEngine.UI.Text;
    private expTipMark:UnityEngine.GameObject;
    ///////////////////灵力面板相关///////////////////
    private lingLiPanel: UnityEngine.GameObject;
    private yinLiangConfig: GameConfig.QiFuConfigM;
    private m_restTime2: number = 1;
    private canGetLingLiText: UnityEngine.UI.Text;
    private lingLiCostText: UnityEngine.UI.Text;
    private lingLiLeftTime: UnityEngine.UI.Text;

    /**魂币免费祈福红点提示*/
    private hunbiGetTipMark: GameObjectGetSet;
    /**魂币祈福是否免费*/
    private bGoldFree: boolean = false;
    /**免费魂币配置*/
    private freeGoldConfig: GameConfig.QiFuConfigM;

    ///////////////////魂值面板/////////////////////
    private hunZhiPanel: UnityEngine.GameObject;
    private lingLiConfig: GameConfig.QiFuConfigM;
    private m_restTime3: number = 0;
    private canGetHunZhiText: UnityEngine.UI.Text;
    private hunZhiCostText: UnityEngine.UI.Text;
    private hunZhiLeftTime: UnityEngine.UI.Text;

    /**先暂时保留该数据(可能会用到)*/
    private m_arrowId: number = 0;
    /**经验祈福终身是否使用*/
    private m_isVirgin: boolean = false;
    //特效
    private expIcon: UnityEngine.GameObject;
    private lingliIcon: UnityEngine.GameObject;
    private hunIcon: UnityEngine.GameObject;
    private effectPrefab: UnityEngine.GameObject;
    //普通特效
    private effEXPNormal: UnityEngine.GameObject;
    private effGoldNormal: UnityEngine.GameObject;
    private effLingliNormal: UnityEngine.GameObject;
    private goEffExpNormal: GameObjectGetSet;
    private goEffGoldNormal: GameObjectGetSet;
    private goEffLingliNormal: GameObjectGetSet;

    //暴击特效
    private effExpDouble: UnityEngine.GameObject;
    private effGoldDouble: UnityEngine.GameObject;
    private effLingliDouble: UnityEngine.GameObject;
    private goEffExpDouble: GameObjectGetSet;
    private goEffGoldDouble: GameObjectGetSet;
    private goEffLingliDouble: GameObjectGetSet;

    private game: UnityEngine.GameObject;

    private expUIEffect: UIEffect;
    private yinliangUIEffect: UIEffect;
    private hunzhiUIEffect: UIEffect;
    btnQiFuExp: UnityEngine.GameObject;
    btnClose: UnityEngine.GameObject;
    //暴击
    private baojiText:UnityEngine.UI.Text;
    //最大次数
    private maxNum:number = 27;
    //已经祈福的次数
    private qifuExpNum:number = 0;
    private qifuYinliangNum:number = 0;
    private hunbiFreeNum:number = 0;
    private expFreeNum:number = 0;
    constructor() {
        super(KeyWord.ACT_FUNCTION_QIFU);

    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.KuaiSuShengJiView;
    }

    protected initElements() {
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("CurrencyTip"));

        //暴击
        this.baojiText = this.elems.getText('baojiText');
        //经验面板
        this.expPanel = this.elems.getElement("expPanel");

        this.canGetExpText = ElemFinder.findText(this.expPanel, "down/get/txtGetNumber");
        this.expCostText = ElemFinder.findText(this.expPanel, "down/need/costText");
        this.expLeftTime = ElemFinder.findText(this.expPanel, "down/num/leftText");

        this.effEXPNormal = ElemFinder.findObject(this.expPanel, "effect/normal");
        this.goEffExpNormal = new GameObjectGetSet(this.effEXPNormal);
        this.goEffExpNormal.SetActive(false);
        this.effExpDouble = ElemFinder.findObject(this.expPanel, "effect/double");
        this.goEffExpDouble = new GameObjectGetSet(this.effExpDouble);
        this.goEffExpDouble.SetActive(false);
        this.expTipMark = ElemFinder.findObject(this.expPanel, "down/btnQifu/getTipMark");
        //灵力面板(魂币)
        this.lingLiPanel = this.elems.getElement("lingliPanel");

        this.canGetLingLiText = ElemFinder.findText(this.lingLiPanel, "down/get/txtGetNumber");
        this.lingLiCostText = ElemFinder.findText(this.lingLiPanel, "down/need/costText");
        this.lingLiLeftTime = ElemFinder.findText(this.lingLiPanel, "down/num/leftText");

        this.effLingliNormal = ElemFinder.findObject(this.lingLiPanel, "effect/normal");
        this.goEffLingliNormal = new GameObjectGetSet(this.effLingliNormal);
        this.goEffLingliNormal.SetActive(false);
        this.effLingliDouble = ElemFinder.findObject(this.lingLiPanel, "effect/double");
        this.goEffLingliDouble = new GameObjectGetSet(this.effLingliDouble);
        this.goEffLingliDouble.SetActive(false);

        this.hunbiGetTipMark = new GameObjectGetSet(ElemFinder.findObject(this.lingLiPanel, "down/btnQifu/getTipMark"));
        //魂值面板（灵力）
        this.hunZhiPanel = this.elems.getElement("hunzhiPanel");

        this.canGetHunZhiText = ElemFinder.findText(this.hunZhiPanel, "down/get/txtGetNumber");
        this.hunZhiCostText = ElemFinder.findText(this.hunZhiPanel, "down/need/costText");
        this.hunZhiLeftTime = ElemFinder.findText(this.hunZhiPanel, "down/num/leftText");

        this.effGoldNormal = ElemFinder.findObject(this.hunZhiPanel, "effect/normal");
        this.goEffGoldNormal = new GameObjectGetSet(this.effGoldNormal);
        this.goEffGoldNormal.SetActive(false);
        this.effGoldDouble = ElemFinder.findObject(this.hunZhiPanel, "effect/double");
        this.goEffGoldDouble = new GameObjectGetSet(this.effGoldDouble);
        this.goEffGoldDouble.SetActive(false);

        //特效
        this.effectPrefab = this.elems.getElement("qifuEffect");

        //this.expUIEffect = new UIEffect();
        //this.yinliangUIEffect = new UIEffect();
        //this.hunzhiUIEffect = new UIEffect();

        //this.expUIEffect.setEffectPrefab(this.effectPrefab, ElemFinder.findObject(this.expPanel, "effect"));
        //this.yinliangUIEffect.setEffectPrefab(this.effectPrefab, ElemFinder.findObject(this.lingLiPanel, "effect"));
        //this.hunzhiUIEffect.setEffectPrefab(this.effectPrefab, ElemFinder.findObject(this.hunZhiPanel, "effect"));
        this.btnQiFuExp = ElemFinder.findObject(this.expPanel, "down/btnQifu");
        this.btnClose = this.elems.getElement('closeBt');
        this.game = this.elems.getElement('GameObject');
    }

    protected initListeners() {

        this.addClickListener(ElemFinder.findObject(this.expPanel, "down/btnQifu"), this.onClickQiFuExpBt);
        this.addClickListener(ElemFinder.findObject(this.lingLiPanel, "down/btnQifu"), this.onClickQiFuLingLiBt);
        this.addClickListener(ElemFinder.findObject(this.hunZhiPanel, "down/btnQifu"), this.onClickQiFuHunZhiBt);
        this.addClickListener(this.btnClose, this.onClickClosePanelBt);
        this.addClickListener(this.elems.getElement("mask"), this.onClickClosePanelBt);
    }

    open() {
        super.open();
    }

    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        this.updateView();
        this.sendRequest();
        this.updateMoney();
        G.GuideMgr.processGuideNext(EnumGuide.QiFu, EnumGuide.QiFu_OpenQiFuView);
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
        G.GuideMgr.processGuideNext(EnumGuide.QiFu, EnumGuide.QiFu_ClickClose);
    }

    /**关闭面板*/
    private onClickClosePanelBt() {
        this.close();
    }


    /**拉取祈福面板数据*/
    private sendRequest(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getQifuRequest(Macros.QIFU_OPEN_PANEL));
    }

    /////////////////////////刷新面板/////////////////////////////////
    updateView(): void {
        let lv: number = G.DataMgr.heroData.level;
        if(!this.m_isVirgin){
            if(this.qifuExpNum<this.maxNum){
                this.expConfig = G.DataMgr.activityData.getQifuConfig(KeyWord.QIFU_TYPE_JINGYAN, lv,this.qifuExpNum+1);
            }
        }else{
            this.expConfig = G.DataMgr.activityData.getQifuConfig(KeyWord.QIFU_TYPE_JINGYAN, lv,1,true);
        }
        if(this.hunbiFreeNum<=0){
            if(this.qifuYinliangNum < this.maxNum){
                this.yinLiangConfig = G.DataMgr.activityData.getQifuConfig(KeyWord.QIFU_TYPE_TONGQIAN, lv,this.qifuYinliangNum+1);
            }
        }else{
            this.yinLiangConfig = G.DataMgr.activityData.getQifuConfig(KeyWord.QIFU_TYPE_TONGQIAN,lv,1,true);
        }
        this.lingLiConfig = G.DataMgr.activityData.getQifuConfig(KeyWord.QIFU_TYPE_LINGLI, lv);
        this.freeGoldConfig = G.DataMgr.activityData.getQifuConfig(KeyWord.QIFU_TYPE_TONGQIAN, lv,1,true);
        if (this.expConfig != null && this.yinLiangConfig != null && this.lingLiConfig != null) {
            this.canGetExpText.text = uts.format('{0}{1}', this.expConfig.m_uiRewardValue, KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, this.expConfig.m_uiRewardThingID));
            this.canGetLingLiText.text = uts.format('{0}{1}', this.yinLiangConfig.m_uiRewardValue, KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, this.yinLiangConfig.m_uiRewardThingID));
            this.canGetHunZhiText.text = uts.format('{0}{1}', this.lingLiConfig.m_uiRewardValue, KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, this.lingLiConfig.m_uiRewardThingID));
            this.expCostText.text = uts.format('花费：{0}', TextFieldUtil.getYuanBaoText(this.expConfig.m_uiPrice));
            if (this.hunbiFreeNum != 0) {
                this.lingLiCostText.text = uts.format('花费：{0}', TextFieldUtil.getColorText("免费", Color.YUANBAO));
            }else{
                this.lingLiCostText.text = uts.format('花费：{0}', TextFieldUtil.getYuanBaoText(this.yinLiangConfig.m_uiPrice));
            }
            this.hunZhiCostText.text = uts.format('花费：{0}', TextFieldUtil.getYuanBaoText(this.lingLiConfig.m_uiPrice));
        }
    }

    /**祈福操作后的response刷新面板*/
    updateQiFuPanel(response: Protocol.QiFu_Response): void {
        if (response.m_usType == Macros.QIFU_OPEN_PANEL) {
            let vip: number = G.DataMgr.heroData.curVipLevel;
            let extraTime: number = 0;
            if (vip > 0) {
                extraTime = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_QIFU_COUNT, vip);
            }
            this.m_isVirgin = response.m_stValue.m_stOpenPanelRsp.m_ucJingYan == 0;
            this.qifuExpNum = response.m_stValue.m_stOpenPanelRsp.m_astQiFuList[0].m_ucNumber;
            this.qifuYinliangNum = response.m_stValue.m_stOpenPanelRsp.m_astQiFuList[1].m_ucNumber;
            this.hunbiFreeNum = response.m_stValue.m_stOpenPanelRsp.m_ucFreeSliver;
            if (this.m_isVirgin) {
                this.expFreeNum = 1;
            }else{
                this.expFreeNum = 0;
            }
            if (this.expConfig != null && this.yinLiangConfig != null && this.lingLiConfig != null) {
                this.m_restTime1 = this.expConfig.m_uiTime + extraTime+this.expFreeNum - this.qifuExpNum;
                this.m_restTime2 = this.yinLiangConfig.m_uiTime + extraTime + this.hunbiFreeNum - this.qifuYinliangNum;
                this.m_restTime3 = this.lingLiConfig.m_uiTime + extraTime - response.m_stValue.m_stOpenPanelRsp.m_astQiFuList[2].m_ucNumber;
            }
            if(this.qifuExpNum == this.maxNum){
                this.m_restTime1 = 0;
            }
            if(this.qifuYinliangNum == this.maxNum){
                this.m_restTime2 = 0;
            }
            this.expLeftTime.text = uts.format('剩余次数：{0}', TextFieldUtil.getColorText(this.m_restTime1.toString(), this.m_restTime1 > 0 ? Color.GREEN : Color.RED));
            this.lingLiLeftTime.text = uts.format('剩余次数：{0}', TextFieldUtil.getColorText(this.m_restTime2.toString(), this.m_restTime2 > 0 ? Color.GREEN : Color.RED));
            this.hunZhiLeftTime.text = uts.format('剩余次数：{0}', TextFieldUtil.getColorText(this.m_restTime3.toString(), this.m_restTime3 > 0 ? Color.GREEN : Color.RED));
            this.expTipMark.SetActive(this.m_isVirgin);
            this.updateView();
            this.handGoldShow(this.hunbiFreeNum != 0)
            if (this.m_isVirgin) {
                this.expCostText.text = uts.format('花费：{0}', TextFieldUtil.getColorText("免费", Color.YUANBAO));
            }
            else {
                this.expCostText.text = uts.format('花费：{0}', TextFieldUtil.getYuanBaoText(this.expConfig.m_uiPrice));
            }

        }
        else if (response.m_usType == Macros.QIFU_DOIT) {
            //播放特效
            G.AudioMgr.playJinJieSucessSound();
            if (response.m_stValue.m_stQiFuRsp.m_uiQiFuID == this.expConfig.m_iID) {
                let isBaoJi = response.m_stValue.m_stQiFuRsp.m_ucBaoJi == 1;
                this.goEffExpDouble.SetActive(isBaoJi);
                if (isBaoJi) {
                    this.baojiText.gameObject.SetActive(true);
                    this.baojiText.text = uts.format('暴击 {0}倍',this.expConfig.m_uiDouble);
                } else {
                    this.goEffExpNormal.SetActive(true);
                }
                let getExpValue = (isBaoJi ? this.expConfig.m_uiRewardValue * 2 : this.expConfig.m_uiRewardValue);
                G.TipMgr.addMainFloatTip(uts.format('获取:{0}经验', getExpValue), FloatShowType.GetReward);
                //this.expUIEffect.playEffect(EffectType.Effect_Normal);
            }
            else if (response.m_stValue.m_stQiFuRsp.m_uiQiFuID == this.yinLiangConfig.m_iID || response.m_stValue.m_stQiFuRsp.m_uiQiFuID == this.freeGoldConfig.m_iID && this.bGoldFree) {
                let isBaoJi = response.m_stValue.m_stQiFuRsp.m_ucBaoJi == 1;
                this.baojiText.gameObject.SetActive(isBaoJi);
                if (isBaoJi) {
                    this.goEffLingliDouble.SetActive(true);
                    this.baojiText.text = uts.format('暴击 {0}倍',this.yinLiangConfig.m_uiDouble);
                } else {
                    this.goEffLingliNormal.SetActive(true);
                }
                //this.yinliangUIEffect.playEffect(EffectType.Effect_Normal);
            }
            else if (response.m_stValue.m_stQiFuRsp.m_uiQiFuID == this.lingLiConfig.m_iID) {
                let isBaoJi = response.m_stValue.m_stQiFuRsp.m_ucBaoJi == 1;
                if (isBaoJi) {
                    this.goEffGoldDouble.SetActive(true);
                } else {
                    this.goEffGoldNormal.SetActive(true);
                }
                //this.hunzhiUIEffect.playEffect(EffectType.Effect_Normal);
            }
            this.sendRequest();
        }
        this.time = 1.5;
        this.addTimer("1", 500, 3, this.setEffectfalse);
    }

    private time: number = 1.5;
    private setEffectfalse() {
        this.time -= 0.5;
        if (this.time <= 0) {
            this.goEffExpNormal.SetActive(false);
            this.goEffGoldNormal.SetActive(false);
            this.goEffLingliNormal.SetActive(false);
            this.goEffExpDouble.SetActive(false);
            this.goEffLingliDouble.SetActive(false);
            this.goEffGoldDouble.SetActive(false);
            this.baojiText.gameObject.SetActive(false);
        }

    }

    /**魂币面板显示处理*/
    private handGoldShow(bFree: boolean) {
        this.hunbiGetTipMark.SetActive(bFree);
        if (this.yinLiangConfig != null && !bFree && this.bGoldFree) {
            this.canGetLingLiText.text = uts.format('{0}{1}', this.yinLiangConfig.m_uiRewardValue, KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, this.yinLiangConfig.m_uiRewardThingID));
            this.lingLiCostText.text = uts.format('花费：{0}', TextFieldUtil.getYuanBaoText(this.yinLiangConfig.m_uiPrice));
        }
        else if (this.freeGoldConfig != null && bFree && !this.bGoldFree) {
            this.canGetLingLiText.text = uts.format('{0}{1}', this.freeGoldConfig.m_uiRewardValue, KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, this.freeGoldConfig.m_uiRewardThingID));
            if (bFree) {
                this.lingLiCostText.text = uts.format('花费：{0}', TextFieldUtil.getColorText("免费", Color.YUANBAO));
            } else {
                this.lingLiCostText.text = uts.format('花费：{0}', TextFieldUtil.getYuanBaoText(this.freeGoldConfig.m_uiPrice));
            }
        }
        this.bGoldFree = bFree;
    }

    /////////////////////////点击事件/////////////////////////////////
    /**点击经验面板祈福按钮*/
    private onClickQiFuExpBt(): void {
        G.AudioMgr.playBtnClickSound();
        if (this.m_restTime1 == 0) {
            let info: string = '今天经验祈福次数已用完,提升VIP等级可增加次数';
            G.TipMgr.showConfirm(info, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmClick));
        }
        else if (this.m_isVirgin || 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.expConfig.m_uiPrice, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getQifuRequest(Macros.QIFU_DOIT, this.expConfig.m_iID));
        }
        G.GuideMgr.processGuideNext(EnumGuide.QiFu, EnumGuide.QiFu_ClickQiFu);
    }

    /**点击魂币祈福面板祈福按钮*/
    private onClickQiFuLingLiBt(): void {
        G.AudioMgr.playBtnClickSound();
        if (this.m_restTime2 == 0) {
            let info: string = '今天魂币祈福次数已用完,提升VIP等级可增加次数';
            G.TipMgr.showConfirm(info, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmClick));
        }
        else if (this.bGoldFree || 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.yinLiangConfig.m_uiPrice, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getQifuRequest(Macros.QIFU_DOIT, this.yinLiangConfig.m_iID));
        }
    }

    /**点击魂值面板祈福按钮*/
    private onClickQiFuHunZhiBt(): void {
        G.AudioMgr.playBtnClickSound();
        let info: string;
        if (this.m_restTime3 == 0) {
            info = '今天绑定钻石祈福次数已用完,提升VIP等级可增加次数';
            G.TipMgr.showConfirm(info, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmClick));
        }
        else if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.lingLiConfig.m_uiPrice, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getQifuRequest(Macros.QIFU_DOIT, this.lingLiConfig.m_iID));
        }
    }

    /**点击祈福按钮弹出MessageBox之后的回调*/
    private onConfirmClick(stage: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            this.close();
            G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
        }
    }
    updateMoney() {
        this.currencyTip.updateMoney();
    }

    ////////////////////////// 引导 ////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.QiFu_ClickQiFu == step) {
            this.onClickQiFuExpBt();
            return true;
        } else if (EnumGuide.QiFu_ClickClose == step) {
            this.onClickClosePanelBt();
            return true;
        }
        return false;
    }
}