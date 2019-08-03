import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { Global as G } from "System/global"
import { UIPathData } from "System/data/UIPathData"
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Color } from 'System/utils/ColorUtil'
import { MapId } from 'System/map/MapId'
import { HeroController } from 'System/unit/hero/HeroController'
import { UIUtils } from 'System/utils/UIUtils'
import { PriceBar } from 'System/business/view/PriceBar'
import { Constants } from 'System/constants/Constants'

export class ReliveView extends CommonForm {
    private readonly CdTimerKey = 'CdTimer';

    private readonly BuffTimerKey = 'BuffTimer';

    private readonly BuffWaitSeconds = 60;

    private labelBtnFhd: UnityEngine.UI.Text;
    private btn_fuhuoTimeText: UnityEngine.UI.Text;
    private cdTimeText: UnityEngine.UI.Text;
    private originReliveTimeText: UnityEngine.UI.Text;
    private tipType0: UnityEngine.GameObject;
    private tipType1: UnityEngine.GameObject;
    private m_canYuanDi: boolean;
    private m_leftCd: number = 0;
    private m_cdTime: number = 0;
    private m_canUseFuhuodan: boolean = false;
    private AUTO_RELIVE_TIME: number = 30;
    private m_noPrompYd: boolean = true;
    private m_canBindYanBao: boolean;
    private btn_yuanDi: UnityEngine.GameObject;
    private btn_fuhuo: UnityEngine.GameObject;
    private icon1: UnityEngine.UI.RawImage;
    private icon2: UnityEngine.UI.RawImage;
    private m_szCasterNameText: UnityEngine.UI.Text;
    ////复活提升图片id
    //private readonly iconId: number[] = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1010, 1012, 1013, 1015, 1019, 1021
    //    , 1022, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1032, 1035, 1042];
    //复活提升图片id
    private readonly iconId: number[] = [1000, 1003, 1010];
    private currencyBar: PriceBar;
    /**复活一次的钻石和绑定钻石花费*/
    private cost: number = G.DataMgr.constData.getValueById(KeyWord.REVIVAL_INSTANT_PRICE);
    private goldBindCost: number = this.cost * Constants.SummonBindRate;
    /**hero的钻石和绑定钻石数*/
    private heroGold = G.DataMgr.heroData.gold;
    private heroGoldBind = G.DataMgr.heroData.gold_bind;

    private lockFhdByBuff = false;

    private heroController: HeroController = null;
    private get Hero() {
        if (this.heroController == null) {
            this.heroController = G.UnitMgr.hero;
        }
        return this.heroController;
    }

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Relive;
    }

    protected resPath(): string {
        return UIPathData.ReliveView;
    }

    protected initElements(): void {
        this.labelBtnFhd = this.elems.getText('labelBtnFhd');
        this.btn_fuhuoTimeText = this.elems.getText("fuhuodianTimeText");
        this.cdTimeText = this.elems.getText("cdTimeText");
        this.originReliveTimeText = this.elems.getText("yuandiTimeText");
        this.btn_yuanDi = this.elems.getElement('btn_yuandi');
        this.btn_fuhuo = this.elems.getElement('btn_fuhuodian');
        this.icon1 = this.elems.getRawImage('icon1');
        this.icon2 = this.elems.getRawImage('icon2');
        this.m_szCasterNameText = this.elems.getText('m_szCasterName');
        this.currencyBar = new PriceBar();
        this.currencyBar.setComponents(this.elems.getElement('currencyBar'));
        this.tipType0 = this.elems.getElement("tipType0");
        this.tipType1 = this.elems.getElement("tipType1");
        this.tipType0.SetActive(false);
        this.tipType1.SetActive(false);
    }

    protected initListeners(): void {
        this.addClickListener(this.btn_fuhuo, this.onClickSafeReliveBt);
        this.addClickListener(this.btn_yuanDi, this.onClickBtYd);
    }

    open(cdTime: number = 0, canYuandi: boolean, canBindYanBao: boolean, lockFhdByBuff: boolean) {
        this.m_cdTime = cdTime;
        this.m_canYuanDi = canYuandi;
        this.m_canBindYanBao = canBindYanBao;
        this.lockFhdByBuff = lockFhdByBuff;
        super.open();
    }

    protected onOpen() {
        //打开就查看是否能直接复活
        //暂时先把换图片的关闭
        //let randomX = Math.floor(Math.random() * this.iconId.length);
        //G.ResourceMgr.loadImage(this.icon1, uts.format('images/wybqicon/{0}.png', this.iconId[randomX]));
        //this.iconId.splice(randomX, 1);
        //let randomY = Math.floor(Math.random() * this.iconId.length);
        //G.ResourceMgr.loadImage(this.icon2, uts.format('images/wybqicon/{0}.png', this.iconId[randomY]));

        if (G.DataMgr.heroData.m_szCasterName == '') {
            this.m_szCasterNameText.text = '先去提升自己的实力吧,再来一次试试吧';
        } else {
            this.m_szCasterNameText.text = uts.format('您被{0}击杀', TextFieldUtil.getColorText(G.DataMgr.heroData.m_szCasterName, Color.RED));
        }
        G.DataMgr.heroData.m_szCasterName = '';
        this.updateRelieveUse();
        if (G.DataMgr.runtime.reliveTipType > 0) {
            this.updateTips(G.DataMgr.runtime.reliveTipType);
            G.DataMgr.runtime.reliveTipType = -1;
        }
    }


    protected onClose() {
        this.m_cdTime = 0;
        this.m_leftCd = 0;
        this.cdTimeText.text = '';
        this.tipType0.SetActive(false);
        this.tipType1.SetActive(false);
    }


    private onUpdateTimer(timer: Game.Timer): void {
        this.m_leftCd -= timer.CallCountDelta;
        if (this.m_leftCd <= 0) {
            this.cdTimeText.text = '';
            this.enableRelive();
            //自动战斗需要检查是否直接自动复活
            if (!this.Hero.Data.isAlive) {
                if (this.m_canYuanDi && G.DataMgr.runtime.isHangingUpBeforeDie && G.DataMgr.deputySetting.isRoleReviveEnabled) {
                    if (this.m_canBindYanBao) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRevivalRequestMsg(Macros.RevivalType_ReviveInSitu));
                    }
                    else {
                        this.onConfirmRevivalYd(MessageBoxConst.yes, this.m_noPrompYd);
                    }
                }
            }
        }
        else {
            this.cdTimeText.text = uts.format("{0}秒后可使用复活功能", this.m_leftCd);
            //复活功能还不能用
            if (this.m_canYuanDi) {
                //this.btn_OriginReliveTimeText.text = uts.format("{0}秒后可原地复活", this.m_leftCd);
            }
            else {
                UIUtils.setButtonClickAble(this.btn_yuanDi, false);
                this.originReliveTimeText.text = "此处不能原地复活";
            }
        }
    }

    private updateRelieveUse() {
        this.labelBtnFhd.text = '复活点复活';
        //5秒倒计时，通过m_cdTime来判断
        if (0 != this.m_cdTime) {
            //存在复活功能使用时间
            this.updateRelieveMoney(false);
            UIUtils.setButtonClickAble(this.btn_fuhuo, false);
            UIUtils.setButtonClickAble(this.btn_yuanDi, false);
            this.m_leftCd = this.m_cdTime;
            this.cdTimeText.text = uts.format("{0}秒后可使用复活功能", this.m_cdTime.toString());
            this.addTimer(this.CdTimerKey, 1000, this.m_cdTime, this.onUpdateTimer);
        }
        else {
            //可以直接使用复活功能,隐藏倒计时
            this.m_leftCd = 0;
            this.enableRelive();
            this.removeTimer(this.CdTimerKey);
        }
        if (this.m_canYuanDi) {
            //跨服不能使用重生丹
            this.m_canUseFuhuodan = G.ActionHandler.checkCrossSvrUsable(false);
        }
        this.m_canUseFuhuodan = false;
    }

    private onRelieveTimer(timer: Game.Timer) {
        let leftTime = this.AUTO_RELIVE_TIME - timer.CallCount;
        this.btn_fuhuoTimeText.text = uts.format("{0}秒后自动复活点复活", leftTime);
        if (leftTime == 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRevivalRequestMsg(Macros.RevivalType_ReviveAtPoint));
        }
    }

    private onClickSafeReliveBt() {
        //安全区复活按钮
        G.AudioMgr.playBtnClickSound();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRevivalRequestMsg(Macros.RevivalType_ReviveAtPoint));
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    /**
    * 点击原地复活按钮事件的响应函数。
    * @param event
    * 
    */
    private onClickBtYd() {
        G.AudioMgr.playBtnClickSound();
        //检查原地复活CD
        if (this.m_leftCd > 0) {
            //复活CD中
            G.TipMgr.addMainFloatTip('复活功能冷却中');
            return;
        }
        else {
            // 复活丹剩余可使用
            if (this.m_canUseFuhuodan) {
                if (G.DataMgr.thingData.getThingListByFunction(KeyWord.ITEM_FUNCTION_REVIVE).length > 0) {
                    // 有复活丹           
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRevivalRequestMsg(Macros.RevivalType_ReviveInSitu));
                }
                else {
                    // 没有复活丹，使用钻石
                    if (!this.m_noPrompYd) {
                        if (this.m_canBindYanBao) {
                            G.TipMgr.showConfirm(uts.format('\n是否花费{0}或{1}原地复活？',
                                TextFieldUtil.getYuanBaoText(this.cost), TextFieldUtil.getGoldBindText(this.goldBindCost)), ConfirmCheck.withCheck, '确定|取消',
                                delegate(this, this.onConfirmRevivalYd));
                        }
                        else {
                            G.TipMgr.showConfirm(uts.format('\n是否花费{0}原地复活？',
                                TextFieldUtil.getYuanBaoText(this.cost)), ConfirmCheck.withCheck, '确定|取消',
                                delegate(this, this.onConfirmRevivalYd));
                        }
                    }
                    else {
                        // 后续都不提示了
                        this.onConfirmRevivalYd(MessageBoxConst.yes, this.m_noPrompYd);
                    }
                }
            }
            else {
                // 使用钻石
                this.onConfirmRevivalYd(MessageBoxConst.yes, this.m_noPrompYd);
            }
        }
    }


    /**
    * 原地复活使用钻石界面确认按钮 
    * @param stage
    * @param contentArgs
    * @param args
    * 
    */
    private onConfirmRevivalYd(state: MessageBoxConst, isCheckSelected: boolean): void {
        //使用钻石弹出界面处理事件
        this.m_noPrompYd = isCheckSelected;
        if (MessageBoxConst.yes == state) {
            let reliveCost: number = G.DataMgr.constData.getValueById(KeyWord.REVIVAL_INSTANT_PRICE);
            let goldBindCost: number = reliveCost * Constants.SummonBindRate;
            if (this.m_canBindYanBao) {
                //判断钱是否充足
                if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_BIND_ID, goldBindCost, false)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRevivalRequestMsg(Macros.RevivalType_ReviveInSitu));
                    return;
                }
            }
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, reliveCost, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRevivalRequestMsg(Macros.RevivalType_ReviveInSitu));
            }
        }
    }


    /**
    * 点击安全区复活按钮事件的响应函数。
    * @param event
    * 
    */
    private onClickBtnSafeRelive() {
        //复活点复活
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRevivalRequestMsg(Macros.RevivalType_ReviveAtPoint));
    }

    private enableRelive(): void {
        //使按钮具有复活功能
        if (this.m_canYuanDi) {
            UIUtils.setButtonClickAble(this.btn_yuanDi, true);
            this.updateRelieveMoney();
        }
        else {
            this.currencyBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);
            this.currencyBar.setPrice(0);
            UIUtils.setButtonClickAble(this.btn_yuanDi, false);
            this.originReliveTimeText.text = "此处不能原地复活";
        }

        if (this.lockFhdByBuff) {
            // 死亡buff需要1分钟倒计时
            UIUtils.setButtonClickAble(this.btn_fuhuo, false);
            this.labelBtnFhd.text = uts.format('复活点复活({0})', this.BuffWaitSeconds);
            this.addTimer(this.BuffTimerKey, 1000, this.BuffWaitSeconds, this.onFhdBuffTimer);
        } else {
            // 可以复活点复活了
            this.enableFhd();
        }
    }

    private onFhdBuffTimer(timer: Game.Timer) {
        let left = timer.Loop - timer.CallCount;
        if (left <= 0) {
            this.enableFhd();
        } else {
            this.labelBtnFhd.text = uts.format('复活点复活({0})', left);
        }
    }

    private enableFhd() {
        UIUtils.setButtonClickAble(this.btn_fuhuo, true);
        this.labelBtnFhd.text = '复活点复活';
        //自动倒计时
        this.btn_fuhuoTimeText.text = uts.format("{0}秒后自动复活点复活", this.AUTO_RELIVE_TIME);
        this.addTimer("relieveTimer", 1000, this.AUTO_RELIVE_TIME, this.onRelieveTimer);
    }

    private updateRelieveMoney(isShowReleveText: boolean = true) {
        if (this.m_canBindYanBao) {
            //可以使用绑定钻石，绑钻不够显示钻石
            if (this.heroGoldBind < this.goldBindCost && this.heroGold >= this.cost) {
                //绑钻不够显示钻石,并且钻石够显示钻石
                this.setCurrenyMoney(false, isShowReleveText);
                return;
            }
            this.setCurrenyMoney(true, isShowReleveText);
        }
        else {
            //显示钻石
            this.setCurrenyMoney(false, isShowReleveText);
        }
    }

    /**bindSensitive是否为绑定钻石,是否显示按钮下方的文字提示*/
    private setCurrenyMoney(bindSensitive: boolean = false, isShowReliveText: boolean = true) {
        if (bindSensitive) {
            //绑定钻石
            this.currencyBar.setCurrencyID(KeyWord.MONEY_YUANBAO_BIND_ID, true);
            this.currencyBar.setPrice(this.goldBindCost, this.heroGoldBind >= this.goldBindCost ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH);
            if (isShowReliveText) {
                this.originReliveTimeText.text = uts.format("消耗{0}钻石或{1}绑定钻石(优先绑定钻石)",
                    TextFieldUtil.getColorText(this.cost.toString(), 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.cost, false) ? Color.GREEN : Color.RED),
                    TextFieldUtil.getColorText(this.goldBindCost.toString(), 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_BIND_ID, this.goldBindCost, false) ? Color.GREEN : Color.RED)
                );
            }
            else{
                this.originReliveTimeText.text="";
            }
        } else {
            //钻石
            this.currencyBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);
            this.currencyBar.setPrice(this.cost, this.heroGold >= this.cost ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH);
            if (isShowReliveText) {
                this.originReliveTimeText.text = uts.format("消耗{0}钻石",
                    TextFieldUtil.getColorText(this.cost.toString(), 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.cost, false) ? Color.GREEN : Color.RED)
                );
            }
            else{
                this.originReliveTimeText.text="";
            }
        }
    }
    updateTips(type: number) {
        this.tipType0.SetActive(type == 2);
        this.tipType1.SetActive(type == 3);
    }

}