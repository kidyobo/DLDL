import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KaifuSignItemData } from 'System/data/vo/KaifuSignItemData'
import { KeyWord } from 'System/constants/KeyWord'
import { FuLiDaTingView } from 'System/activity/fldt/FuLiDaTingView'
import { SevenDayLoginPanel } from 'System/activity/fldt/sevenDayLogin/SevenDayLoginPanel'
import { SevenDayView } from 'System/activity/fldt/sevenDayLogin/SevenDayView'
import { KaiFuHuoDongView } from "System/activity/kaifuhuodong/KaiFuHuoDongView";
/**
 * 开服签到数据。
 * @author teppei
 * 
 */
export class KaifuSignData {
    static readonly COUNT: number = 7;

    m_maxLoginDays: number = 0;

    private m_giftTag: number = -1;

    private m_statusList: number[];

    constructor() {
        this.m_statusList = new Array<number>(KaifuSignData.COUNT);
        for (let i: number = 0; i < KaifuSignData.COUNT; i++) {
            this.m_statusList[i] = KaifuSignItemData.CANNOT_DRAW;
        }
    }

    updateByResponse(response: Protocol.DoActivity_Response): void {
        if (Macros.ACTIVITY_OPENSVR_SIGN_LIST == response.m_ucCommand) {
            // 拉取签到进度
            let result: Protocol.OpenSvrSignListRsp = response.m_unResultData.m_stOpenSvrSignListRsp;
            // 更新进度
            this.updateProgress(result.m_iGetTag, result.m_ucMaxLoginDays);
            let sevenDayLoginPanel = G.Uimgr.getSubFormByID<SevenDayLoginPanel>(SevenDayView, KeyWord.OTHER_FUNCTION_QTDLJ);
            if (sevenDayLoginPanel != null) {
                sevenDayLoginPanel.updateView();
            }
        }
        else {
            // 领取奖励
            let result2: Protocol.OpenSvrSignGetRsp = response.m_unResultData.m_stOpenSvrSignGetRsp;
            this.updateProgress(result2.m_iGetTag, this.m_maxLoginDays);
            let fuLiDaTingView = G.Uimgr.getForm<SevenDayView>(SevenDayView);
            if (fuLiDaTingView != null) {
                //更新七天登陆角标
                fuLiDaTingView.updateAllTipMarks();

                let sevenDayLoginPanel = fuLiDaTingView.getTabFormByID(KeyWord.OTHER_FUNCTION_QTDLJ) as SevenDayLoginPanel;
                if (sevenDayLoginPanel.isOpened) {
                    sevenDayLoginPanel.onGetSevenDaySignGift();
                }
            }

            if (Macros.ACTIVITY_OPENSVR_SIGN_GET == response.m_ucCommand) {
                //领取奖励
                let sevenview = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
                if (sevenview != null && sevenview.isOpened)
                    sevenview.getAwardResponse();
            }
        }
    }


    updateProgress(getTag: number, maxLoginDays: number): void {
        this.m_maxLoginDays = maxLoginDays;
        this.m_giftTag = getTag;
        // 按位解析领取状态并更新UI
        let para: number = 2;
        let today = G.SyncTime.getDateAfterStartServer();

        let giftDatas: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_OPEN_SRV_SIGN);
        for (let i: number = 0; i < KaifuSignData.COUNT; i++) {
            if (today >= giftDatas[i].m_iParameter)// 登陆次数符合要求
            {
                if (getTag & para) {
                    this.m_statusList[i] = KaifuSignItemData.DRAWN;   //已领取
                }
                else {
                    this.m_statusList[i] = KaifuSignItemData.CAN_DRAW;   //未领取
                }
                para = para << 1;
            }
            else {
                this.m_statusList[i] = KaifuSignItemData.CANNOT_DRAW;    //未到达
            }
        }
    }

    canDraw(): number {
        for (let status of this.m_statusList) {
            if (status == KaifuSignItemData.CAN_DRAW) {
                return 1;
            }
        }
        return 0;
    }

    /** * 不能领取1。* 可领取2。* 已领取3。 KaifuSignItemData*/
    getStatusByIndex(index: number): number {
        return this.m_statusList[index];
    }

    /**七天签到可以领取*/
    canSign(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_QTDLJ))
            return false;

        for (let i: number = this.m_statusList.length - 1; i >= 0; i--) {
            if (KaifuSignItemData.CAN_DRAW == this.m_statusList[i]) {
                return true;
            }
        }

        return false;
    }

    /**七天签到可以领取的天数，从0开始*/
    canSignDay(): number[] {
        let days: number[] = [];
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_QTDLJ))
            return days;
        for (let i: number = this.m_statusList.length - 1; i >= 0; i--) {
            if (KaifuSignItemData.CAN_DRAW == this.m_statusList[i]) {
                days.push(i);
            }
        }
        return days;
    }


    /**
     * 得到下一个签到日期数  ，显示用 
     * @return 
     * 
     */
    findSignShowIndex(): number {
        let state: number = 0;
        for (let i: number = 0; i < KaifuSignData.COUNT; i++) {
            state = this.m_statusList[i];

            if (KaifuSignItemData.CAN_DRAW == state || KaifuSignItemData.CANNOT_DRAW == state) {
                return i;
            }
        }

        return KaifuSignData.COUNT - 1;
    }

    /**
     * 全部领完 
     * @return 
     * 
     */
    allDrawn(): boolean {
        for (let i: number = 0; i < KaifuSignData.COUNT; i++) {
            if (KaifuSignItemData.DRAWN != this.m_statusList[i]) {
                return false;
            }
        }

        return true;
    }
    /**礼包领取Tag。*/
    get giftTag(): number {
        return this.m_giftTag;
    }

    /**最大的登陆日数。*/
    get maxLoginDays(): number {
        return this.m_maxLoginDays;
    }
}
