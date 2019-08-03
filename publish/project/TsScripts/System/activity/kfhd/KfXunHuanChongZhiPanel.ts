import { KfChongZhiBasePanel, KfChongZhiRewardBaseItem, KfCzRewardState } from "System/activity/kfhd/KfChongZhiBasePanel"
import { KeyWord } from "System/constants/KeyWord"
import { Global as G } from "System/global"
import { Macros } from "System/protocol/Macros"
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { PayView } from "System/pay/PayView"
import { VipView, VipTab } from "../../vip/VipView";
import FanLiDaTingView from "../fanLiDaTing/FanLiDaTingView";


export class KfXunHuanCzListItem extends KfChongZhiRewardBaseItem {

    update(data: Protocol.CSAct125One, doneCount: number) {
        this.danBiCzImgObj.SetActive(false);
        this.xunHuanCzImgObj.SetActive(true);
        this.numText.text = data.m_stCfg.m_uiCondition + "元宝";
        this.rewardList.Count = data.m_stCfg.m_iItemCount;
        for (let i = 0; i < this.rewardList.Count; i++) {
            super.updateRewardItem(i);
            let itemCfg = data.m_stCfg.m_stItemList[i];
            this.iconItems[i].updateById(itemCfg.m_iID, itemCfg.m_iCount);
            this.iconItems[i].updateIcon();
        }
        this.m_id = data.m_stCfg.m_iID;
        super.updateBtnState(data.m_ucRewardCnt, doneCount, data.m_stCfg.m_ucMax);
    }

    protected onClickBtnGet() {
        if (this.btnState == KfCzRewardState.hasReach) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_125XHCZ, Macros.Act125_REWARD, this.m_id));
        }
        else if (this.btnState == KfCzRewardState.noReach) {
            G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi);
            let fanliview = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
            if (fanliview != null && fanliview.isOpened) {
                fanliview.close();
            }
            // G.Uimgr.createForm<PayView>(PayView).open();
        }
    }
}


/**循环充值界面*/
export class KfXunHuanChongZhiPanel extends KfChongZhiBasePanel {

    private xunHuanCzListItems: KfXunHuanCzListItem[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_XUNHUANCHONGZHI);
    }

    protected onOpen() {
        super.onOpen();
        this.danBiCzImgObj.SetActive(false);
        this.xunHuanCzImgObj.SetActive(true);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_125XHCZ, Macros.Act125_PANNEL));
        this.updateView();
    }


    updateView() {
        let info = G.DataMgr.kaifuActData.xunHuanCzInfo;
        if (info == null || info.m_ucListCnt == 0) return;
        this.rechargeCountText.text = "累计充值: " + info.m_uiChargeValue;
        this.rewardList.Count = info.m_ucListCnt;
        let hasScroll: boolean = false;
        for (let i = 0; i < info.m_ucListCnt; i++) {
            if (this.xunHuanCzListItems[i] == null) {
                this.xunHuanCzListItems[i] = new KfXunHuanCzListItem();
                this.xunHuanCzListItems[i].setCommponents(this.rewardList.GetItem(i));
            }
            let data = info.m_stList[i];
            let doneCount = Math.floor(G.DataMgr.kaifuActData.xunHuanCzInfo.m_uiChargeValue / data.m_stCfg.m_uiCondition);
            doneCount = doneCount > data.m_stCfg.m_ucMax ? data.m_stCfg.m_ucMax : doneCount;
            this.xunHuanCzListItems[i].update(data, doneCount);
            if (!hasScroll && this.canGetReward(data.m_ucRewardCnt, doneCount, data.m_stCfg.m_ucMax)) {
                this.rewardList.ScrollByAxialRow(i);
                hasScroll = true;
            }
        }
        let cfg = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.OTHER_FUNCTION_XUNHUANCHONGZHI);
        if (cfg != null) {
            let isDayRefresh: boolean = info.m_stList[0].m_stCfg.m_ucDayReflash == 1;
            super.updateLeftTimeData(isDayRefresh, cfg.m_ucEndDate);
        }
    }
}