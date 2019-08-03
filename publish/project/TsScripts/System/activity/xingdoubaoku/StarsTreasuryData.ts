import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EnumTgbjRule } from 'System/tanbao/EnumTgbjRule'
import { TgbjStoreItemData } from 'System/data/TgbjStoreItemData'
import { KeyWord } from 'System/constants/KeyWord'
import { StringUtil } from 'System/utils/StringUtil'
import { Global as G } from 'System/global'
import { StarsTreasuryView } from "System/activity/xingdoubaoku/StarsTreasuryView";
import { Macros } from '../../protocol/Macros';
import { StarsStoreView } from './StarsStoreView';

/**
 * 星斗宝库数据。
 * @author 
 *
 */
export class StarsTreasuryData {
    /**当前消费*/
    private curExpend = 0;
    /**免费时间*/
    private curFreeTime = 0;
    private isapply = false;
    private updateTimer: Game.Timer = null;
    private NAME_TIMER = "UpdateTimer";
    private isOpenedPanel = false;

    lotteryData: Protocol.StarLotteryPanel;

    /**
     * 设置界面所有信息
     * @param data 
     */
    setlotteryConfig(data: Protocol.StarLotteryPanel) {
        this.lotteryData = data;
    }

    /**
     * 设置抽奖历史记录
     */
    setDrawConfig() {

    }


    onCfgReady() {

    }

    /**
     * 消耗钻石变化
     * @param num
     */
    diamondChange(num: number) {
        this.curExpend = num;
    }

    /**时间变化 */
    freeTimeChange(time: number) {
        let curTime = G.SyncTime.getCurrentTime() / 1000;
        this.curFreeTime = time;
        if (curTime > this.curFreeTime)
            return;

        if (this.updateTimer == null) {
            this.updateTimer = new Game.Timer(this.NAME_TIMER, 1000, -1, delegate(this, this.updateTime));
        }
        else {
            this.updateTimer.ResetTimer(1000, -1, delegate(this, this.updateTime));
        }
    }

    /**打开面板 */
    openPanel() {
        if (this.isOpenedPanel == false)
            this.isOpenedPanel = true;
    }
    /**报名变化 */
    applyChange(num: number) {
        this.isapply = num == 1;
    }

    private updateTime(timer: Game.Timer) {
        let curTime = G.SyncTime.getCurrentTime() / 1000;
        if (curTime > this.curFreeTime)
            this.stopTimer();
    }

    private stopTimer() {
        if (this.updateTimer != null) {
            this.updateTimer.Stop();
            this.updateTimer = null;
        }
    }

    getFreeTime(): number {
        return this.curFreeTime;
    }


    /**是否有红包资格 */
    isRadPacketQualification(): boolean {
        let num = G.DataMgr.constData.getValueById(KeyWord.PARAM_STAR_LOTTERY_HONG_BAO_CONDITION);
        return this.curExpend >= num;
    }

    /**是否有免费时间 */
    isFreeTime(): boolean {
        return this.updateTimer == null;
    }

    /**是否报名 */
    isApply(): boolean {
        return this.isapply;
    }

    /**是否需要报名 */
    isNeedApply(): boolean {
        if (this.isRadPacketQualification())
            return !this.isapply;
        else
            return false;
    }

    /**是否打开过面板 */
    isOpenenStarsPanel(): boolean {
        return this.isOpenedPanel;
    }
    /**
     * 仓库是否有物品
     */
    isStoreHaveObj(): boolean {
        let data = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_STARLOTTERY);
        if (data == null) return false;
        for (let i = 0; i < StarsStoreView.MAX_CAPACITY; i++) {
            if (null != data[i]) {
                return true;
            }
        }
        return false;
    }

    /**获取还差多少钻石 */
    getResidueDiamond(): number {
        return G.DataMgr.constData.getValueById(KeyWord.PARAM_STAR_LOTTERY_HONG_BAO_CONDITION) - this.curExpend;
    }

}
