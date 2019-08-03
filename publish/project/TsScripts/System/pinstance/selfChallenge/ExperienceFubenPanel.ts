import { Global as G } from 'System/global'
import { TabSubFormCommon } from "../../uilib/TabFormCommom";
import UIPathData from "../../data/UIPathData";
import { List } from "../../uilib/List";
import { GameObjectGetSet, TextGetSet } from "../../uilib/CommonForm";
import { KeyWord } from "../../constants/KeyWord";
import { IconItem } from "../../uilib/IconItem";
import { TipFrom } from "../../tip/view/TipsView";
import { ProtocolUtil } from '../../protocol/ProtocolUtil';
import { Macros } from '../../protocol/Macros';
import { PinstanceData } from '../../data/PinstanceData';
import { UnitCtrlType, EnumGuide } from '../../constants/GameEnum';
import { TextFieldUtil } from '../../utils/TextFieldUtil';
import { Color } from '../../utils/ColorUtil';
import { ConfirmCheck, MessageBoxConst } from '../../tip/TipManager';
import { VipView } from '../../vip/VipView';

/**
 * 经验副本
 */
export class ExperienceFubenPanel extends TabSubFormCommon {

    private list: List;
    private lightIcon: GameObjectGetSet;
    private tenIcon: GameObjectGetSet;
    private itemicon: UnityEngine.GameObject;

    private txtExp: TextGetSet;
    private btnPayGo: GameObjectGetSet;
    private btnGo: GameObjectGetSet;
    private btnTip: GameObjectGetSet;
    private btnReset: GameObjectGetSet;
    private txtNumber: TextGetSet;

    private modelNode: GameObjectGetSet;

    private readonly LEVEL_MUNBER: number = 10;
    private diffConfigs: GameConfig.PinstanceDiffBonusM[] = [];
    private readonly MODEL_ID = "350013";
    private m_noPrompt: boolean = false;


    constructor() {
        super(KeyWord.OTHER_FUNCTION_SHMJ);
    }

    protected resPath(): string {
        return UIPathData.ExperienceFubenPanel;
    }

    protected initElements() {
        super.initElements();

        this.list = this.elems.getUIList("list");
        this.lightIcon = new GameObjectGetSet(this.elems.getElement("lightIcon"));
        this.tenIcon = new GameObjectGetSet(this.elems.getElement("icon"));
        this.itemicon = this.elems.getElement("itemIcon_Normal");
        let iconitem = new IconItem();
        iconitem.setExhibitionIcon(this.itemicon, this.tenIcon.gameObject);
        iconitem.setTipFrom(TipFrom.normal);
        iconitem.updateById(KeyWord.EXPERIENCE_THING_ID);
        iconitem.updateIcon();

        this.txtExp = new TextGetSet(this.elems.getText("txtExp"));
        this.btnPayGo = new GameObjectGetSet(this.elems.getElement("btnPayGo"));
        this.btnGo = new GameObjectGetSet(this.elems.getElement("btnGo"));
        this.btnReset = new GameObjectGetSet(this.elems.getElement("btnReset"));
        this.btnTip = new GameObjectGetSet(this.elems.getElement("btnTip"));
        this.txtNumber = new TextGetSet(this.elems.getText("txtNumber"));

        this.modelNode = new GameObjectGetSet(this.elems.getElement("ModelNode"));

        //得到所有层数
        this.diffConfigs = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_SHNS);

    }

    protected initListeners() {
        super.initListeners();

        this.addClickListener(this.btnGo.gameObject, this.onClickGo);
        this.addClickListener(this.btnPayGo.gameObject, this.onClickPayGo);
        this.addClickListener(this.btnReset.gameObject, this.onClickReset);
    }

    protected onOpen() {
        //拉取副本信息
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, Macros.PINSTANCE_ID_SHNS));
        G.ResourceMgr.loadModel(this.modelNode.gameObject, UnitCtrlType.lingbao, this.MODEL_ID, this.sortingOrder);
    }

    protected onClose() {

    }

    private isGoTip = false;
    private onClickGo() {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null == info) {
            return;
        }
        let need = G.DataMgr.constData.getValueById(KeyWord.PARAM_SHNS_DOUBLE_EXP_PRICE);
        let message = uts.format("消耗{0}钻石可获得2倍奖励", TextFieldUtil.getColorText(need.toString(), Color.GREEN));
        if (this.isGoTip == false && info.m_ucExpPinDouble == 0) {
            G.TipMgr.showConfirm(message, ConfirmCheck.withCheck, '2倍挑战|挑战', delegate(this, this.onGOConfirm));
        }
        else {
            G.ModuleMgr.pinstanceModule.tryEnterShenHuangMiJing(0);
        }
        G.GuideMgr.processGuideNext(EnumGuide.JingYanFuBen, EnumGuide.JingYanFuBen_ClickEnter);
    }
    private onGOConfirm(state: MessageBoxConst, isCheckSelected: boolean) {
        this.isGoTip = isCheckSelected;
        if (MessageBoxConst.yes == state) {
            this.onClickPayGo();
        }
        else if (MessageBoxConst.no == state) {
            G.ModuleMgr.pinstanceModule.tryEnterShenHuangMiJing(0);
        }
    }

    private onClickPayGo() {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null == info) {
            return;
        }
        let need = G.DataMgr.constData.getValueById(KeyWord.PARAM_SHNS_DOUBLE_EXP_PRICE);
        let message = uts.format("您的钻石不足{0},请前往充值", TextFieldUtil.getColorText(need.toString(), Color.GREEN));
        let msg = uts.format("是否消耗{0}钻石立即扫荡", TextFieldUtil.getColorText(need.toString(), Color.GREEN));
        if (G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3) >= 0) {
            //钻石特权
            G.TipMgr.showConfirm(msg, ConfirmCheck.noCheck, '是|否', (state: MessageBoxConst) => {
                if (MessageBoxConst.yes == state) {
                    //判断钻石是否满足
                    if (G.DataMgr.heroData.gold < need && info.m_ucExpPinDouble == 0) {
                        G.TipMgr.showConfirm(message, ConfirmCheck.noCheck, '前往充值|取消', delegate(this, this.onPayGOConfirm, false));
                    }
                    else {
                        //一键扫荡 难度先给0
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(Macros.PINSTANCE_ID_SHNS, true, 0));
                    }
                }
            });
        }
        else {
            if (G.DataMgr.heroData.gold < need && info.m_ucExpPinDouble == 0) {
                G.TipMgr.showConfirm(message, ConfirmCheck.noCheck, '前往充值|取消', delegate(this, this.onPayGOConfirm, false));
            }
            else {
                G.ModuleMgr.pinstanceModule.tryEnterShenHuangMiJing(1);
            }
        }
    }

    private onPayGOConfirm(state: MessageBoxConst, isCheckSelected: boolean, tag: boolean) {
        if (MessageBoxConst.yes == state) {
            G.ActionHandler.go2Pay();
        }
    }

    private isResetTip = false;
    private onClickReset() {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null == info) {
            return;
        }
        if (info.m_uiCurLevel == 0) {
            //一层都没打，不让进
            G.TipMgr.addMainFloatTip("请您先挑战，再重置");
        }
        else if (info.m_uiCurLevel < info.m_uiMaxLevel) {
            //提示还有未打的
            if (this.isResetTip == false)
                G.TipMgr.showConfirm('您还没有挑战完，确定需要重置么', ConfirmCheck.withCheck, '重置|取消', delegate(this, this.onResetConfirm));
            else
                this.resetTip();
        }
        else {
            this.resetTip();
        }

    }

    private onResetConfirm(stage: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            this.isResetTip = isCheckSelected;
            this.resetTip();
        }
    }

    private resetTip() {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null == info) {
            return;
        }
        // 重置次数
        let pconfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(info.m_iPinId);
        // 免费次数
        let freeTimes = pconfig.m_ucEnterTimes;
        //已经重置次数
        let resetNum = info.m_ucResetNum;
        if (resetNum < freeTimes) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_RESET, Macros.PINSTANCE_ID_SHNS));
        } else {
            let curVipLevel: number = G.DataMgr.heroData.curVipLevel;
            //能够购买次数
            let canBuyTimes: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_SHNS_EXT_NUM, curVipLevel);
            // 总的可重置次数
            let totalTimes = freeTimes + canBuyTimes;
            //剩余次数
            let leftTimes: number = Math.max(0, totalTimes - resetNum);
            let openPrivilegeLvs = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.VIP_PARA_SHNS_EXT_NUM);
            if (leftTimes > 0) {
                if (!this.m_noPrompt) {
                    // 还能购买
                    let vipStr: string = TextFieldUtil.getVipText(curVipLevel, openPrivilegeLvs[0]);
                    let cost: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_SHNS_BUY_PIRCE, G.DataMgr.heroData.curVipLevel);
                    let str1: string = uts.format('是否花费{0}购买1次重置次数？({1}可购买{2}次，您当前剩余{3}次购买机会)',
                        TextFieldUtil.getYuanBaoText(cost),
                        TextFieldUtil.getColorText(vipStr, Color.BLUE), TextFieldUtil.getColorText(canBuyTimes.toString(), Color.BLUE),
                        TextFieldUtil.getColorText(Math.floor(totalTimes - resetNum).toString(), Color.BLUE));
                    G.TipMgr.showConfirm(str1, ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onConfirmBuy));
                }
                else {
                    let cost: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WST_BUY_PIRCE, G.DataMgr.heroData.curVipLevel);
                    if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                        // 后台会购买后自动重置
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_RESET, Macros.PINSTANCE_ID_SHNS));
                    }
                }
            }
            else {
                // 提示提升月卡
                if (G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_SHNS_EXT_NUM)) {
                    let moreVip: number = G.DataMgr.vipData.getMoreTimesVipLevel(G.DataMgr.heroData.curVipLevel, KeyWord.VIP_PARA_SHNS_EXT_NUM);
                    if (G.DataMgr.heroData.curVipLevel >= moreVip) {
                        G.TipMgr.showConfirm('您今天的重置次数已用完！', ConfirmCheck.noCheck, '确定');
                    }
                    else {
                        G.TipMgr.showConfirm(uts.format('激活{0}可继续购买重置次数', TextFieldUtil.getVipText(moreVip, openPrivilegeLvs[0])),
                            ConfirmCheck.noCheck, '确定', delegate(this, this.onConfirm));
                    }
                } else {
                    G.TipMgr.showConfirm(uts.format('激活{0}可继续购买重置次数', TextFieldUtil.getMultiVipMonthTexts(openPrivilegeLvs)),
                        ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirm));
                }
            }
        }
    }

    /**重置确定 */
    private onConfirmBuy(stage: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            this.m_noPrompt = isCheckSelected;
            // 检查钻石
            let cost: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_SHNS_BUY_PIRCE, G.DataMgr.heroData.curVipLevel);
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                // 后台会自动购买并重置
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_RESET, Macros.PINSTANCE_ID_SHNS));
            }
        }
    }

    /**提示确定*/
    private onConfirm(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open();
        }
    }

    updateView() {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null == info) {
            return;
        }

        // 重置次数
        let pconfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(info.m_iPinId);
        // 免费次数
        let freeTimes = pconfig.m_ucEnterTimes;
        //已经重置次数
        let resetNum = info.m_ucResetNum;
        let curVipLevel: number = G.DataMgr.heroData.curVipLevel;
        //能够购买次数
        let canBuyTimes: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_SHNS_EXT_NUM, curVipLevel);
        //剩余次数
        let leftTimes: number = Math.max(0, freeTimes + canBuyTimes - resetNum);
        let maxexp = G.DataMgr.pinstanceData.getExperienceFBAllExp();
        let tirple = info.m_ucExpPinDouble;
        this.refreshList(info.m_uiCurLevel);
        this.refreshExperience(maxexp, tirple == 1);
        this.refreshNumberOfChallenges(leftTimes);
        this.refreshButton(info.m_uiCurLevel);
    }

    private refreshList(level: number) {
        this.list.Count = Math.min(level, this.LEVEL_MUNBER - 1);

        // let count = this.list.Count;
        // for (let i = 0; i < count; i++) {
        //     this.list.GetItem(i).gameObject.SetActive(i < level);
        // }
        this.lightIcon.SetActive(level == this.LEVEL_MUNBER);
    }

    private refreshExperience(val: number, tirple: boolean = false) {
        if (tirple)
            val *= 2;
        let num = Math.floor(val / 10000);
        if (num == 0) {
            this.txtExp.text = uts.format("{0}经验", val);
            return;
        }
        let num1 = Math.floor(num / 10000);
        if (num1 == 0) {
            this.txtExp.text = uts.format("{0}万经验", Math.floor(val / 100) / 100);
        }
        else {
            this.txtExp.text = uts.format("{0}亿经验", Math.floor(num / 100) / 100);
        }
    }

    private refreshNumberOfChallenges(num: number) {
        this.txtNumber.text = uts.format("今日可重置次数:{0}", num);
    }

    private refreshButton(level: number) {
        this.btnGo.SetActive(level != this.LEVEL_MUNBER);
        this.btnPayGo.SetActive(level != this.LEVEL_MUNBER);
        this.btnTip.SetActive(level == this.LEVEL_MUNBER);

    }
}
