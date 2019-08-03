import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { PropUtil } from 'System/utils/PropUtil'
import { MathUtil } from 'System/utils/MathUtil'

/**
 * 封神榜数据
 * @author lyl
 */
export class FsbData {
    private _fsbLevelDic: { [id: number]: GameConfig.CrossSingleM };
    private _fsbBigTypeDic: { [stage: number]: GameConfig.CrossSingleM[] };
    private _fsbFirstArr: GameConfig.CrossSingleM[];
    /**封神榜排行榜数据*/
    fsbRankData: Protocol.CSSingleRank_Response;

    /**封神榜数据*/
    //fsbInfo: Protocol.KFJDCListRsp;

    /**最大大类型*/
    maxBigType: number = 0;
    /**最大小类型*/
    maxSmallType: number = 0;
    /**最大等级*/
    maxLevel: number = 0;

    onCfgReady() {
        this.setCrossSingleConfig();
    }

    private setCrossSingleConfig(): void {
        let dataList: GameConfig.CrossSingleM[] = G.Cfgmgr.getCfg('data/CrossSingleM.json') as GameConfig.CrossSingleM[];
        this._fsbLevelDic = {};
        this._fsbBigTypeDic = {};
        this._fsbFirstArr = [];
        for (let config of dataList) {
            if (!this._fsbBigTypeDic[config.m_iStage]) {
                this._fsbBigTypeDic[config.m_iStage] = [];
            }
            this._fsbLevelDic[config.m_iID] = config;

            if (config.m_iDropID) {
                this._fsbFirstArr.push(config);
            }

            this._fsbBigTypeDic[config.m_iStage].push(config);

            this.maxBigType = Math.max(this.maxBigType, config.m_iStage);

            this.maxSmallType = Math.max(this.maxSmallType, config.m_iLv);

            this.maxLevel = Math.max(this.maxSmallType, config.m_iID);
        }
        this._fsbFirstArr.sort(this.sortFunc);
    }
    private sortFunc(a: GameConfig.CrossSingleM, b: GameConfig.CrossSingleM) {
        return a.m_iID - b.m_iID; 
    }

    /**
     * 获取封神榜配置表
     * @param	level 等级
     * @return
     */
    getFsbConfByLevel(level: number): GameConfig.CrossSingleM {
        return this._fsbLevelDic[level];
    }

    /**
     * 获取封神榜每个大类型数据
     * @param	level
     * @return
     */
    getFsbConfArrByLevel(bigType: number): GameConfig.CrossSingleM[] {
        return this._fsbBigTypeDic[bigType];
    }

    /**获取段位浮窗*/
    getStageTips(level: number): string {
        let attVo: GameConfig.EquipPropAtt;
        let attStr: string;
        let config: GameConfig.CrossSingleM;
        let str: string;
        if (level) {
            config = this.getFsbConfByLevel(level);
            if (config) {
                let bigStr: string = KeyWord.getDesc(KeyWord.GROUP_CROSSSINGLE_TYPE_1, config.m_iStage);
                let smallStr: string = KeyWord.getDesc(KeyWord.GROUP_CROSSSINGLE_TYPE_2, config.m_iLv);
                attStr = '';
                for (attVo of config.m_astPropAtt) {
                    if (attVo.m_ucPropId > 0 && attVo.m_ucPropValue > 0) {
                        attStr += uts.format('{0}+{1}#N', KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, attVo.m_ucPropId), attVo.m_ucPropValue);
                    }
                }
                str = G.DataMgr.langData.getLang(156, bigStr, smallStr, attStr);
            }
            else {
                str = '';
            }
        }
        else {
            config = this.getFsbConfByLevel(1);
            attStr = '';
            for (attVo of config.m_astPropAtt) {
                if (attVo.m_ucPropId > 0 && attVo.m_ucPropValue > 0) {
                    attStr += uts.format('{0}+{1}#N', KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, attVo.m_ucPropId), attVo.m_ucPropValue);
                }
            }
            if (attStr.length) {
                attStr = attStr.slice(0, attStr.length - 2);
            }
            str = G.DataMgr.langData.getLang(161, this.getStageName(config.m_iID), attStr);
        }
        return str;
    }

    /**更新数据*/
    updateFsbData(response: Protocol.DoActivity_Response): void {
        //if (Macros.ACTIVITY_KFJDC_LIST == response.m_ucCommand) {
        //    this.fsbInfo = uts.deepcopy(response.m_unResultData.m_stKFJDCListRsp, this.fsbInfo, true);
        //    //this.dispatchEvent(Events.UpdateShortCutFunctionBar);
        //}
        //else if (Macros.ACTIVITY_KFJDC_GET_DAY == response.m_ucCommand) {
        //    this.fsbInfo.m_ucDayGift = response.m_unResultData.m_ucKFJDCGetDayRsp;
        //    //this.dispatchEvent(Events.UpdateShortCutFunctionBar);
        //}
        //else if (Macros.ACTIVITY_KFJDC_GET_REACH == response.m_ucCommand) {
        //    this.fsbInfo.m_uiReachGift = response.m_unResultData.m_stKFJDCGetReachRsp.m_uiFlag;
        //    //this.dispatchEvent(Events.UpdateShortCutFunctionBar);
        //}
        //this.dispatchEvent(Events.updateFsbInfo);
    }

    /**获取正在进行中的首次达成奖励*/
    getDoingFirstLevel(): number {
        //let config: GameConfig.CrossSingleM;
        //if (!this.fsbInfo) {
        //    return 1;
        //}
        //for (config of this._fsbFirstArr) {
        //    let isGet: boolean = MathUtil.checkPosIsReach(config.m_iID, this.fsbInfo.m_uiReachGift);
        //    if (!isGet) {
        //        return config.m_iID;
        //    }
        //}
        //config = this._fsbFirstArr[this._fsbFirstArr.length - 1];
        return 0;
    }

    /**更新封神榜排行榜数据*/
    updateRankData(m_stCSSingleRankRes: Protocol.CSSingleRank_Response): void {
        this.fsbRankData = m_stCSSingleRankRes;
    }

    /**获取段位总名称*/
    getStageName(level: number): string {
        let config: GameConfig.CrossSingleM = this.getFsbConfByLevel(level);
        if (config) {
            let bigStr: string = KeyWord.getDesc(KeyWord.GROUP_CROSSSINGLE_TYPE_1, config.m_iStage);
            let smallStr: string = KeyWord.getDesc(KeyWord.GROUP_CROSSSINGLE_TYPE_2, config.m_iLv);
            return bigStr + smallStr;
        }
        return '无段位';
    }

    /**获取封神榜可领取次数*/
    getFsbCanGetCount(): number {
        let count: number = 0;
        count += this.getFsbDailyCanGetCount();
        count += this.getFsbFirstCanGetCount();
        return count;
    }

    /**获取封神榜每日可领取次数*/
    getFsbDailyCanGetCount(): number {
        //let count: number = 0
        //if (this.fsbInfo && this.fsbInfo.m_ucStage > 0 && !this.fsbInfo.m_ucDayGift) {
        //    count = 1;
        //}
        return 0;
    }

    /**获取封神榜首次达成可领取次数*/
    getFsbFirstCanGetCount(): number {
        //let count: number = 0
        //if (this.fsbInfo) {
        //    let showStage: number = this.getDoingFirstLevel();
        //    let canGet: boolean = this.fsbInfo.m_ucMaxStage >= showStage;
        //    let hasGet: boolean = MathUtil.checkPosIsReach(showStage, this.fsbInfo.m_uiReachGift);
        //    if (canGet && !hasGet) {
        //        count = 1;
        //    }
        //}
        return 0;
    }

    /**是否正在匹配中*/
    get isMathing(): boolean {
        return false;
        //return G.DataMgr.kfjdcData.myStatus == KfjdcData.STATUS_QUEUE;
    }
}
