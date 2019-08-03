import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { EnumBwdhPage } from 'System/kfjdc/BiWuDaHuiPanel'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumKuafuPvpStatus } from 'System/constants/GameEnum'
import { BwdhStars } from 'System/kfjdc/view/BwdhStars'
import { BwdhBasePage } from 'System/kfjdc/view/BwdhBasePage'
import { BwdhRankView } from 'System/kfjdc/view/BwdhRankView'
import { KfjdcData } from 'System/data/KfjdcData'
import { DataFormatter } from 'System/utils/DataFormatter'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'

export class BwdhPreliminaryPage extends BwdhBasePage {
    private readonly TickKey = 'Tick';

    private readonly StatusTickMax = 60;

    /**最多10次，超过不让继续买*/
    private readonly MaxTimes = 10;

    private textTimes: UnityEngine.UI.Text;
    private btnAdd: UnityEngine.GameObject;

    private btnWeekRank: UnityEngine.GameObject;
    private tipMark: UnityEngine.GameObject;

    private stars = new BwdhStars();

    private textStatus: UnityEngine.UI.Text;
    private btnGo: UnityEngine.GameObject;
    private labelBtnGo: UnityEngine.UI.Text;

    private textRule: UnityEngine.UI.Text;

    private statusInfo: string;
    private statusPalse = 60;

    private isActivityOpened = false;

    private static NoPrompBuy = false;

    constructor() {
        super(EnumBwdhPage.Preliminary);
    }

    protected resPath(): string {
        return UIPathData.BwdhPreliminaryPage;
    }

    protected initElements() {
        this.textTimes = this.elems.getText('textTimes');
        this.btnAdd = this.elems.getElement('btnAdd');

        this.btnWeekRank = this.elems.getElement('btnWeekRank');
        this.tipMark = this.elems.getElement('tipMark');

        let bigStage = this.elems.getImage('bigStage');
        let smallStage = this.elems.getImage('smallStage');

        let bigStageAltas = this.elems.getElement('bigStageAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        let smallStageAltas = this.elems.getElement('smallStageAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.stars.setComponents(this.elems.getElement('stars5'), this.elems.getElement('stars4'), this.elems.getElement('stars3'),
            bigStage, smallStage, bigStageAltas, smallStageAltas, this.elems.getElement('final'));

        this.textStatus = this.elems.getText('textStatus');
        this.btnGo = this.elems.getElement('btnGo');
        this.labelBtnGo = this.elems.getText('labelBtnGo');

        this.textRule = this.elems.getText('textRule');
    }

    protected initListeners() {
        this.addClickListener(this.btnAdd, this.onClickBtnAdd);
        this.addClickListener(this.btnGo, this.onClickBtnGo);
        this.addClickListener(this.btnWeekRank, this.onClickBtnWeekRank);
    }

    protected onOpen() {
        super.onOpen();
        this.addTimer(this.TickKey, 1000, 0, this.onTickTimer);
    }

    protected onClose() {
        super.onClose();
        this.statusPalse = this.StatusTickMax;
    }

    onBiWuDaHuiChange(opType: number) {
        let kfjdcData = G.DataMgr.kfjdcData;
        let uiData = kfjdcData.uiData;
        if (null == uiData) {
            return;
        }

        let grade = uiData.m_uiGrade;
        let score = uiData.m_uiScore;
        this.stars.setGrade(grade, score);

        //this.textRank.text = uts.format('我的段位：{0}', TextFieldUtil.getColorText(KfjdcData.getRankDesc(grade, score), Color.YELLOW));
        if (grade < KfjdcData.RANK_DESC_LIST.length) {
            this.stars.setScore(score, score, grade > 0 ? KfjdcData.STAR_COUNT[grade - 1] : KfjdcData.STAR_COUNT[0]);
        }
        else {
            this.stars.setScore(0, 0, 0);
        }

        // 挑战次数
        let times = kfjdcData.getPriTimes();
        this.textTimes.text = uts.format('剩余次数：{0}', TextFieldUtil.getColorText(times.toString(), Color.YELLOW));
        UIUtils.setButtonClickAble(this.btnAdd, times < this.MaxTimes);

        //// 可购买次数
        //let canBuyTimes: number = G.DataMgr.vipData.getVipParaValue(Macros.PINSTANCE_ID_SINGLEPVP,
        //    G.DataMgr.heroData.curVipLevel,
        //    KeyWord.VIP_TYPE_PINSTANCE_BUY_NUM);
        //// 已购买次数
        //let boughtTimes: number = G.DataMgr.vipData.getReserveTime(Macros.PINSTANCE_ID_SINGLEPVP);
        //let isActivityOpen: boolean = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_PVP_BASE);
        //if (canBuyTimes > 0 && canBuyTimes > boughtTimes) {
        //    // 还能购买
        //    this.m_skin.btnBuy.enabled = isActivityOpen;
        //}
        //else {
        //    // 提示提升VIP
        //    let moreVip: number = G.DataMgr.vipData.getMoreTimesVipLevel(G.DataMgr.heroData.curVipLevel,
        //        Macros.PINSTANCE_ID_SINGLEPVP);
        //    if (moreVip > G.DataMgr.heroData.curVipLevel) {
        //        this.m_skin.btnBuy.enabled = isActivityOpen;
        //    }
        //    else {
        //        this.m_skin.btnBuy.enabled = false;
        //    }
        //}

        // 更新排队状态
        if (EnumKuafuPvpStatus.queue == kfjdcData.myStatus) {
            // 显示取消排队
            this.setStatus('正在排队中');
        }
        else if (EnumKuafuPvpStatus.start == kfjdcData.myStatus) {
            // 显示已匹配上
            this.setStatus('匹配成功，即将开始');
        } else {
            this.setStatus(null);
        }
        this.updateStatusPalse(0);

        this.onActDataChange(Macros.ACTIVITY_ID_PVP_BASE);

        this.tipMark.SetActive(kfjdcData.canGetRankReward());
    }

    private setStatus(info: string) {
        this.statusInfo = info;
        if (info) {
            this.textStatus.gameObject.SetActive(true);
        } else {
            this.textStatus.gameObject.SetActive(false);
            this.statusPalse = this.StatusTickMax;
        }
    }

    private updateStatusPalse(delta: number) {
        if (this.statusInfo) {
            this.statusPalse -= delta;
            if (this.statusPalse <= 0) {
                this.statusPalse = this.StatusTickMax;
            }
            this.textStatus.text = this.statusInfo + '(' + this.statusPalse + ')';
        }
    }

    onActDataChange(activityID: number) {
        // 活动状态变化，检查排队按钮是否可以点击
        if (Macros.ACTIVITY_ID_PVP_BASE == activityID) {
            this.isActivityOpened = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_PVP_BASE);
            //uts.log(this.isActivityOpened+' 活动是否开启 ');
            if (this.isActivityOpened) {
                // 更新排队状态
                let kfjdcData = G.DataMgr.kfjdcData;

                this.labelBtnGo.text = '参赛';
                if (EnumKuafuPvpStatus.none == kfjdcData.myStatus) {
                    // 显示开始排队
                    UIUtils.setButtonClickAble(this.btnGo, true);
                }
                else {
                    UIUtils.setButtonClickAble(this.btnGo, false);
                }

                this.updateActTimeTick();
            }
            else {
                // 活动没开始
                this.setStatus(null);
                this.labelBtnGo.text = '活动未开启';
                UIUtils.setButtonClickAble(this.btnGo, false);
                this.textRule.text = '周一至周五\n14:00~14:30 21:00~21:30';
            }
        }
    }

    private updateActTimeTick() {
        if (this.isActivityOpened) {
            let status = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_PVP_BASE);
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            this.textRule.text = uts.format('活动剩余时间：{0}', DataFormatter.second2mmss(Math.max(0, status.m_iEndTime - now)));
        }
    }

    private onTickTimer(timer: Game.Timer) {
        this.updateStatusPalse(timer.CallCountDelta);
        this.updateActTimeTick();
    }

    private onClickBtnGo() {
        let kfjdcData = G.DataMgr.kfjdcData;

        if (EnumKuafuPvpStatus.queue == kfjdcData.myStatus) {
            // 已经在排队了，点击取消排队
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleCommonRequest(Macros.CROSS_SINGLE_EXIT));
        }
        else if (EnumKuafuPvpStatus.none == kfjdcData.myStatus) {
            // 检查进副本条件
            if (!G.ActionHandler.canEnterPinstance(Macros.PINSTANCE_ID_SINGLEPVP, 0, true, true)) {
                // 无法进入
                return;
            }

            // 没在排队，点击开始排队，首先检查是否提示购买次数
            if (kfjdcData.getPriTimes() <= 0) {
                // 没有次数了，提示购买
                this.doBuy(true);
            } else {
                let gameParas = G.DataMgr.gameParas;
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleJoinRequest(gameParas.domain, gameParas.serverIp, gameParas.serverPort));
            }
        }
    }

    private onClickBtnAdd() {
        this.doBuy(false);
    }

    private doBuy(autoEnter: boolean) {
        // 没有次数了，提示购买
        if (BwdhPreliminaryPage.NoPrompBuy) {
            // 不再提示直接购买
            this._onConfirmBuy(MessageBoxConst.yes, true, autoEnter);
        }
        else {
            let cost = G.DataMgr.constData.getValueById(KeyWord.PARAMETER_CROSS_BUY);
            //uts.log(cost+'  cost  ');
            G.TipMgr.showConfirm(uts.format('是否花费{0}购买1次挑战次数？', TextFieldUtil.getYuanBaoText(cost)), ConfirmCheck.withCheck, '确定|取消', delegate(this, this._onConfirmBuy, autoEnter));
        }
    }

    private _onConfirmBuy(state: MessageBoxConst = 0, isCheckSelected: boolean, autoEnter: boolean): void {
        if (MessageBoxConst.yes == state) {
            // 检查元宝
            BwdhPreliminaryPage.NoPrompBuy = isCheckSelected;
            let cost = G.DataMgr.constData.getValueById(KeyWord.PARAMETER_CROSS_BUY);
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleNotifyRequest(Macros.CROSS_SINGLE_BUY));
                if (autoEnter) {
                    let gameParas = G.DataMgr.gameParas;
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleJoinRequest(gameParas.domain, gameParas.serverIp, gameParas.serverPort));
                }
            }
        }
    }

    private onClickBtnWeekRank() {
        G.Uimgr.createForm<BwdhRankView>(BwdhRankView).open();
    }
}