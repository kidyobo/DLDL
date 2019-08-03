import { KfChongZhiBasePanel, KfChongZhiRewardBaseItem, KfCzRewardState } from "System/activity/kfhd/KfChongZhiBasePanel"
import { KeyWord } from "System/constants/KeyWord"
import { Global as G } from "System/global"
import { Macros } from "System/protocol/Macros"
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { PayView } from "System/pay/PayView"
import { VipView, VipTab } from "../../vip/VipView";
import FanLiDaTingView from "../fanLiDaTing/FanLiDaTingView";


class KfDanBiCzListItem extends KfChongZhiRewardBaseItem {

    update(data: Protocol.CSAct124One) {
        this.danBiCzImgObj.SetActive(true);
        this.xunHuanCzImgObj.SetActive(false);
        this.numText.text = data.m_stCfg.m_uiCondition + "钻石";
        this.rewardList.Count = data.m_stCfg.m_iItemCount;
        for (let i = 0; i < this.rewardList.Count; i++) {
            super.updateRewardItem(i);
            let itemCfg = data.m_stCfg.m_stItemList[i];
            this.iconItems[i].updateById(itemCfg.m_iID, itemCfg.m_iCount);
            this.iconItems[i].updateIcon();
        }
        this.m_id = data.m_stCfg.m_iID;
        super.updateBtnState(data.m_ucRewardCnt, data.m_ucDoneCnt, data.m_stCfg.m_ucMax);
    }

    protected onClickBtnGet() {
        if (this.btnState == KfCzRewardState.hasReach) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_124DBCZ, Macros.Act124_REWARD, this.m_id));
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

/**单笔充值界面*/
export class KfDanBiChongZhiPanel extends KfChongZhiBasePanel {

    private danBiCzListItems: KfDanBiCzListItem[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_DANBICHONGZHI);
    }

    protected onOpen() {
        this.danBiCzImgObj.SetActive(true);
        this.xunHuanCzImgObj.SetActive(false);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_124DBCZ, Macros.Act124_PANNEL));
        super.onOpen();
    }


    updateView() {
        let info = G.DataMgr.kaifuActData.danBiCzInfo;
        if (info == null || info.m_ucListCnt == 0) return;
        this.rewardList.Count = info.m_ucListCnt;
        let hasScroll: boolean = false;
        for (let i = 0; i < info.m_ucListCnt; i++) {
            if (this.danBiCzListItems[i] == null) {
                this.danBiCzListItems[i] = new KfDanBiCzListItem();
                this.danBiCzListItems[i].setCommponents(this.rewardList.GetItem(i));
            }
            let data = info.m_stList[i];
            data.m_ucDoneCnt = data.m_ucDoneCnt > data.m_stCfg.m_ucMax ? data.m_stCfg.m_ucMax : data.m_ucDoneCnt;
            this.danBiCzListItems[i].update(data);
            if (!hasScroll && this.canGetReward(data.m_ucRewardCnt, data.m_ucDoneCnt, data.m_stCfg.m_ucMax)) {
                this.rewardList.ScrollByAxialRow(i);
                hasScroll = true;
            }
        }
        let cfg = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.OTHER_FUNCTION_DANBICHONGZHI);
        if (cfg != null) {
            let isDayRefresh: boolean = info.m_stList[0].m_stCfg.m_ucDayReflash == 1;
            super.updateLeftTimeData(isDayRefresh, cfg.m_ucEndDate);
        }
    }

}

