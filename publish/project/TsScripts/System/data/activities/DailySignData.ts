import { Global as G } from 'System/global'
import { EnumRewardState } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { SignGiftItemData } from 'System/data/vo/SignGiftItemData'

/**
 * 签到相关的数据管理类 
 * @author ava fygame
 * 
 */
export class DailySignData {

    static readonly DAY_PER_MONTH: number = 30;

    /**礼包的总数量*/
    static GIFT_BAG_NUM: number = 5;

    /**当月签到总次数*/
    private m_curSignCount: number = 0;

    /**当月日历数据，里面记录着每一天的状态，用这个数据来显示日期*/
    private m_calendarData: number[];

    /**累计签到的礼包数据*/
    private m_giftData: SignGiftItemData[];

    /**每日签到奖励数据*/
    private daily_giftData: { [day: number]: SignGiftItemData } = {};


    /**本月已补签次数*/
    private m_extraSignTimes: number = 0;

    /**数据是否已成功初始化。*/
    private m_isReady: boolean = false;


    constructor() {
        this.m_giftData = new Array<SignGiftItemData>(DailySignData.GIFT_BAG_NUM);
        this.m_calendarData = new Array<number>(DailySignData.DAY_PER_MONTH);
    }


    /**设置每天物品奖励*/
    setDailyGiftData(giftData: GameConfig.GiftBagConfigM[]) {
        let config: GameConfig.GiftBagConfigM;
        for (let i = 0; i < giftData.length; i++) {
            config = giftData[i];
            //初始化奖励礼包数据
            config.m_astGiftThing.length = config.m_ucGiftThingNumber;
            let itemData: SignGiftItemData = new SignGiftItemData(config, EnumRewardState.NotReach);
            this.daily_giftData[i] = itemData;
        }
    }

    getDailyGiftData(day: number): SignGiftItemData {
        return this.daily_giftData[day-1];
    }

    /**
     * 更新日历数据和签到次数 
     * @param calendarData
     * 
     */
    private _updateCalendarData(daySignTag: number): void {
        //更新日历数据或签到次数时需要重置数据
        this.m_curSignCount = 0;
        for (let i: number = 0; i < DailySignData.DAY_PER_MONTH; i++) {
            let para: number = 1 << (i + 1);
            if (daySignTag & para) {         
                this.m_curSignCount++;
                this.m_calendarData[i] = 1;  // 表示已经签到过了
            }
            else {
                this.m_calendarData[i] = 0;  // 表示还没签到过
            }
        }
    }

     /**
     * 获取日历数据 
     * @return 
     * 
     */
    getCalendarData(): number[] {
        return this.m_calendarData;
    }

    /**
     * 初始化奖励列表数据——主要是奖励的物品数据、累计签到次数
     * 
     */
    initGiftData(giftData: GameConfig.GiftBagConfigM[]): void {

        let config: GameConfig.GiftBagConfigM;
        for (let i: number = 0; i < DailySignData.GIFT_BAG_NUM; i++) {
            config = giftData[i];
            //初始化奖励礼包数据
            config.m_astGiftThing.length = config.m_ucGiftThingNumber;
            let itemData: SignGiftItemData = new SignGiftItemData(config, EnumRewardState.NotReach);
            this.m_giftData[i] = itemData;
        }
        this.m_giftData.sort(this._sortOnCount);
    }

    private _sortOnCount(a: SignGiftItemData, b: SignGiftItemData): number {
        return a.count - b.count;
    }


    updateSignData(signData: Protocol.SignData): void {
        
        //更新日历数据及相关
        this._updateCalendarData(signData.m_uiDaySignTag);

        //更新奖励列表数据,默认选中第一个
        this.updateGiftData(signData.m_uiSignPrizeTag);

        this.m_extraSignTimes = signData.m_ucExtraSignCnt;

        // 设置数据已初始化完成
        this.m_isReady = true;
    }

    /**
     * 更新累计签到礼包的相关数据
     * @param giftData
     * 
     */
    updateGiftData(giftStatus: number): SignGiftItemData {
        let drawn: SignGiftItemData;
        for (let data of this.m_giftData) {
            if (this.m_curSignCount >= data.count)//当月签到的累计天数大于第一个礼包的指定天数
            {
                let para: number = 1 << data.count;
                if (giftStatus & para) {
                    if (EnumRewardState.NotGot == data.state) {
                        drawn = data;
                    }
                    data.state = EnumRewardState.HasGot;//已经领取
                }
                else {
                    data.state = EnumRewardState.NotGot;   //可以领取
                }
            }
            else {
                data.state = EnumRewardState.NotReach;    //未到达
            }
        }
        return drawn;
    }

    /**
     * 获取礼包数据 
     * @return 
     * 
     */
    getGiftData(): SignGiftItemData[] {
        return this.m_giftData;
    }

    /**
     * 设置当月签到次数 
     * @param value
     * 
     */
    set signCount(value: number) {
        this.m_curSignCount = value;
    }

    /**
     * 获取当前签到次数 
     * @return 
     * 
     */
    get signCount(): number {
        return this.m_curSignCount;
    }

    /**剩余免费补签次数*/
    get remainSignTimes(): number {
        let totalTimes: number = G.DataMgr.constData.getValueById(KeyWord.FREE_SIGN_TIMES)
            + G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_FREE_SIGN_TIMES, G.DataMgr.heroData.curVipLevel);
        return totalTimes - this.m_extraSignTimes;
    }

    /**
     * 取得某一天的状态 
     * @param day
     * @return 
     * 
     */
    getDayState(day: number): number {
        if (defines.has('_DEBUG')) {
            uts.assert(day >= 1, '天必须合法')
        }
        return this.m_calendarData[day - 1];
    }

    /**
     * 判断今天是否已经签到 
     * @param today
     * @return 
     * 
     */
    isTodaySigned(today: number): boolean {
        return 1 == this.getDayState(today);
    }

     /**
     * 今天是否可以签到。
     * @return 
     * 
     */
    canSignToday(day: number): boolean {
        if (!this.m_isReady) {
            return false;
        }

        if (null == this.m_calendarData) {
            return false;
        }
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_MRQD))
            return false;
        return !this.isTodaySigned(day);
    }

    /**
     * 是否可以补签。
     * @return 
     * 
     */
    canBuqian(): boolean {
        if (!this.m_isReady) {
            return false;
        }

        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_MRQD))
            return false;

        if (this.remainSignTimes <= 0) {
            return false;
        }

        if (null == this.m_calendarData) {
            return false;
        }

        let today: Date = G.SyncTime.serverDate;
        let year: number = today.getFullYear();
        let month: number = today.getMonth();
        let date: number = today.getDate();

        let startDate: number = 1;
        let tmpDate: Date = G.SyncTime.tmpDate;
        tmpDate.setTime(G.SyncTime.m_uiServerStartTime * 1000);
        if (tmpDate.getFullYear() == year && tmpDate.getMonth() == month) {
            startDate = tmpDate.getDate();
        }
        for (let i: number = startDate; i < date; i++) {
            if (0 == this.m_calendarData[i - 1]) {
                return true;
            }
        }

        return false;
    }

    /**
     * 是否可以领取签到奖励。
     * @return 
     * 
     */
    canGetReward(): boolean {
        if (!this.m_isReady) {
            return false;
        }
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_MRQD))
            return false;

        let giftData: SignGiftItemData;
        for (let i: number = 0; i < DailySignData.GIFT_BAG_NUM; i++) {
            giftData = this.m_giftData[i];
            if (EnumRewardState.NotGot == giftData.state) {
                // 可以领取的
                return true;
            }
        }

        return false;
    }

     /**
     * 按钮是否需要闪烁。
     * @return 
     * 
     */
    //canShine(): boolean {
    //    return this.canSignToday() || this.canBuqian() || this.canGetReward();
    //}

    get isReady(): boolean {
        return this.m_isReady;
    }



    /**得到今天为该月的第几天*/
    getTodayTimeInThisMonth(): number {
        let todayZeroSecond = Math.round(G.SyncTime.getTodayZeroTime() / 1000);
        let creatRoleTime = G.DataMgr.heroData.roleCreateTime;
        let time: number;
        if (creatRoleTime > todayZeroSecond) {
            time = (Math.ceil((creatRoleTime - todayZeroSecond) / 86400));
        } else {
            time = (Math.ceil((todayZeroSecond - creatRoleTime) / 86400)) + 1;
        }
        if (time > 30) {
            time = time - 30 * (Math.floor(time / 30));
            if (time == 0) {
                time = 30;
            }
        }
        return time;
    }


}
