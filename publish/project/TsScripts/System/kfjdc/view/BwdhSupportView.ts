import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { Constants } from '../../constants/Constants';

export class BwdhSupportView extends CommonForm {
    private readonly Cnt = 4;
    private readonly Costs = [[200, 300, 500, 1000], [500, 1000, 3000, 5000]];

    private btnClose: UnityEngine.GameObject;
    private textTitle: UnityEngine.UI.Text;
    private opBtns: UnityEngine.GameObject[] = [];
    private labels: UnityEngine.UI.Text[] = [];
    private textRule: UnityEngine.UI.Text;

    private openGameId = 0;
    private openPlayerId = 0;
    private openRoleID: Protocol.RoleID;
    private isChampion = false;
    private costArr: number[];

    constructor() {
        super(0);
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.BwdhSupportView;
    }
    protected initElements(): void {
        this.btnClose = this.elems.getElement('btnClose');

        this.textTitle = this.elems.getText('textTitle');

        for (let i = 0; i < this.Cnt; i++) {
            let btn = this.elems.getElement(i.toString());
            this.opBtns.push(btn);
            this.labels.push(ElemFinder.findText(btn, 'Text'));
        }

        this.textRule = this.elems.getText('textRule');
    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.close);
        this.addClickListener(this.getElement('mask'), this.close);

        for (let i = 0; i < this.Cnt; i++) {
            this.addClickListener(this.opBtns[i], delegate(this, this.onClickBtnOp, i));
        }
    }

    protected onOpen() {
        super.onOpen();
        if (this.isChampion) {
            this.textTitle.text = '冠军支持';
            this.textRule.text = G.DataMgr.langData.getLang(443);
            this.costArr = this.Costs[1];
        } else {
            this.textTitle.text = '单场支持';
            this.textRule.text = G.DataMgr.langData.getLang(442);
            this.costArr = this.Costs[0];
        }
        for (let i = 0; i < 4; i++) {
            this.labels[i].text = uts.format('支持{0}绑定元宝', this.costArr[i]);
        }
    }

    protected onClose() {
    }

    private onClickBtnOp(index: number) {
        let cost = this.costArr[index];
        let l = G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_BIND_ID, cost, false);
        if (0 == l) {
            // 绑元足够
            this.doSupport(cost);
            this.close();
        } else {
            let gold = Math.ceil(l / Constants.SummonBindRate);
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, gold, false)) {
                G.TipMgr.showConfirm(uts.format('您的绑定元宝不足，是否使用{0}补足？', gold), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirm, cost));
            } else {
                G.TipMgr.addMainFloatTip(uts.format('您的绑定元宝不足{0}', cost));
            }
        }
    }

    private onConfirm(state: MessageBoxConst, isCheckSelected: boolean, cost: number) {
        if (MessageBoxConst.yes == state) {
            this.doSupport(cost);
            this.close();
        }
    }

    private doSupport(cost: number) {

        if (this.isChampion) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleNotifyRequest(Macros.CROSS_SINGLE_FINAL_WINBET, this.openPlayerId, this.openGameId, cost, this.openRoleID));
        } else {
            let kfjdcData = G.DataMgr.kfjdcData;
            let finalData = kfjdcData.m_finalData;
            if (finalData != null) {
                if (finalData.m_stBetInfo.m_ucBetCount < Macros.MAX_KFJDC_BET_COUNT) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleNotifyRequest(Macros.CROSS_SINGLE_FINAL_BET, this.openPlayerId, this.openGameId, cost));
                }
                else {
                    let countmax: string = uts.format('每次最多支持{0}个玩家', Macros.MAX_KFJDC_BET_COUNT);
                    G.TipMgr.addMainFloatTip(countmax);
                }
            }


        }
    }

    open(gameId: number, playerId: number, roleID: Protocol.RoleID, isChampion: boolean) {
        this.openGameId = gameId;
        this.openPlayerId = playerId;
        this.openRoleID = roleID;
        this.isChampion = isChampion;
        super.open();
    }
}