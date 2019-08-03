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
import { KfXunHuanCzListItem } from "System/activity/kfhd/KfXunHuanChongZhiPanel";
import { KfChongZhiBasePanel, KfChongZhiRewardBaseItem, KfCzRewardState } from "System/activity/kfhd/KfChongZhiBasePanel"
import { Macros } from "System/protocol/Macros";
import FanLiDaTingView from 'System/activity/fanLiDaTing/FanLiDaTingView';
import { KaiFuHuoDongView } from 'System/activity/kaifuhuodong/KaiFuHuoDongView';

export class XHCZView extends KfChongZhiBasePanel {

    private xunHuanCzListItems: KfXunHuanCzListItem[] = [];

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.XHCZView;
    }

    protected initElements() {
        super.initElements();
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.elems.getElement("mask"), this.OpenXHCZPanel);
        this.addClickListener(this.elems.getElement("btn_return"), this.OpenXHCZPanel);
    }

    protected onClose() {

    }

    protected onOpen() {
        super.onOpen();
        this.danBiCzImgObj.SetActive(false);
        this.xunHuanCzImgObj.SetActive(false);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_125XHCZ, Macros.Act125_PANNEL));
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

    OpenXHCZPanel() {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNC_FLDT)) {
            G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(KeyWord.OTHER_FUNCTION_XUNHUANCHONGZHI);
        } else {
            G.Uimgr.createForm<KaiFuHuoDongView>(KaiFuHuoDongView).open(KeyWord.OTHER_FUNCTION_XUNHUANCHONGZHI);
        }
    }

}