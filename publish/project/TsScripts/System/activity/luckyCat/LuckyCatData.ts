import { Global as G } from "System/global";

export class LuckyCatData {
    /**抽奖记录个数*/
    drawRecordCount: number;

    /**抽奖记录*/
    drawRecord: Protocol.LuckyCatRecord[] = [];

    /**抽奖档次*/
    drawLevel: number;

    /**抽奖最高档次*/
    maxDrawLevel: number;

    /**抽奖需要金额 */
    drawNeedPay: number;

    /**奖励个数 */
    itemCount: number = 8;

    /**当前档次奖励*/
    drawInfo: GameConfig.KFLuckyCatActM[] = [];

    /**抽到奖项Index */
    drawIndex: number;

    /**抽奖配置 */
    rewardCfgs: GameConfig.KFLuckyCatActM[] = [];
    /**是否清零 */
    drawNum:number = 0;
    onCfgReady(): void {
        this.rewardCfgs = G.Cfgmgr.getCfg('data/KFLuckyCatActM.json') as GameConfig.KFLuckyCatActM[];
        this.maxDrawLevel = this.rewardCfgs.length / this.itemCount - 1;
    }


    public onUpdatePanel(data: Protocol.LuckyCatOpenPannelRsp) {
        this.drawRecordCount = data.m_ucRecordCount;
        this.drawRecord = [];
        for (let i = 0; i < this.drawRecordCount; i++) {
            this.drawRecord.push(data.m_astDrawRecord[i]);
        }
        let isMax = false;
        this.drawLevel = data.m_ucDrawLevel;
        if (this.drawLevel > this.maxDrawLevel) {
            this.drawLevel = this.maxDrawLevel;
            this.drawNeedPay = -1;
            isMax = true;
        }
        this.drawInfo = [];
        //根据开服天数限制
        let severDay = G.SyncTime.getDateAfterStartServer();
        let id:number = 0;        
        if (severDay>1) {
            id = 1;
        }
        for (let i = 0; i < this.rewardCfgs.length; i++) {
            if (severDay >= this.rewardCfgs[i].m_iStartDay && severDay <=this.rewardCfgs[i].m_iEndDay) {
                let start = (this.drawLevel+10*id) * this.itemCount;
                let end = (this.drawLevel + 1+10*id) * this.itemCount;
                for (let j = start; j < end; j++) {
                    this.drawInfo.push(this.rewardCfgs[j]);
                }
            }
        }
        if (this.drawInfo[0]) {
            if (!isMax) {
                this.drawNeedPay = this.drawInfo[0].m_usConsumeNum;
            }
        }
    }

    public onUpdateDraw(data: Protocol.LuckyCatDrawRsp) {
        this.drawIndex = data.m_ucDrawedID - 1;
        this.drawRecordCount += 1;
        let drawRecord: Protocol.LuckyCatRecord = {} as Protocol.LuckyCatRecord;
        drawRecord.m_szName = G.DataMgr.heroData.name;
        drawRecord.m_ucMultiple = this.rewardCfgs[this.drawIndex].m_ucMultiple;
        this.drawRecord.push(drawRecord);

        let isMax = false;
        this.drawLevel++;
        if (this.drawLevel > this.maxDrawLevel) {
            this.drawLevel = this.maxDrawLevel;
            this.drawNeedPay = -1;
            isMax = true;
        }
        this.drawInfo = [];
        let severDay = G.SyncTime.getDateAfterStartServer();
       
        let id:number = 0;
        if (severDay>1) {
            id = 1;
        }
        for (let i = 0; i < this.rewardCfgs.length; i++) {
            if (severDay >= this.rewardCfgs[i].m_iStartDay && severDay <=this.rewardCfgs[i].m_iEndDay) {
                let start = (this.drawLevel+10*id) * this.itemCount;
                let end = (this.drawLevel + 1+10*id) * this.itemCount;
                for (let j = start; j < end; j++) {
                    this.drawInfo.push(this.rewardCfgs[j]);
                }
            }
        }
        if (this.drawInfo[0]) {
            if (!isMax) {
                this.drawNeedPay = this.drawInfo[0].m_usConsumeNum;
            }
        }
    }
}
