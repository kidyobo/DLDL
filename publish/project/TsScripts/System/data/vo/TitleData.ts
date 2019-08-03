import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { GuildTools } from 'System/guild/GuildTools'
/**
*称号数据
* @author leoqiu
*
*/
export class TitleData {

    static platTitleID: number[];

    /**当前佩戴成就称号ID*/
    curShowAchiTitleID: number = 0;
    /**当前佩戴特殊称号ID*/
    curShowSpecTitleID: number = 0;

    /**缓存最新的固定称号数据*/

    fixTitleDataCache: Protocol.TitleFixInfoList;

    private _sepcTitleDic: { [key: number]: Protocol.TitleFixOne } = [];

    private _titleTypeDic: { [key: number]: GameConfig.TitleListConfigM[] } = [];

    private _titleDisplayDic: { [key: number]: GameConfig.TitleListConfigM[] } = [];

    private _titleDic: { [key: number]: GameConfig.TitleListConfigM } = [];

    /** 检查特殊称号 */
    private _checkState: boolean = false;


    onCfgReady(): void {
        let dataList: GameConfig.TitleListConfigM[] = G.Cfgmgr.getCfg('data/TitleListConfigM.json') as GameConfig.TitleListConfigM[];
        this.setData(dataList);
    }


    /**
    *资源加载回调
    * @param data
    *
    */
    setData(data: GameConfig.TitleListConfigM[]): void {

        let len: number = data.length;
        let config: GameConfig.TitleListConfigM;
        TitleData.platTitleID = new Array<number>();
        this._titleTypeDic = {};
        this._titleDisplayDic = {};
        this._titleDic = {};
        for (let i: number = 0; i < len; ++i) {
            config = data[i];
            // 过滤掉无用数据
            if (config.m_ucTitleID == 0) {
                continue;
            }
            TitleData.platTitleID.push(config.m_ucTitleID);
            if (!this._titleTypeDic[config.m_ucTitleType]) {
                this._titleTypeDic[config.m_ucTitleType] = [];
            }
            if (!this._titleDisplayDic[config.m_ucDisplay]) {
                this._titleDisplayDic[config.m_ucDisplay] = [];
            }
            this._titleDic[config.m_ucTitleID] = config;
            this._titleTypeDic[config.m_ucTitleType].push(config);
            this._titleDisplayDic[config.m_ucDisplay].push(config);
        }
    }


    /**获取一个特殊称号信息*/
    getSpecTitleOneInfo(id: number): Protocol.TitleFixOne {
        return this._sepcTitleDic[id];
    }


    private get sepcTitleDic(): { [key: number]: Protocol.TitleFixOne } {
        if (!this._sepcTitleDic) {
            this._sepcTitleDic = {};
        }
        return this._sepcTitleDic;
    }


    /**所有称号数据字典*/
    get titleDataDic(): { [key: number]: GameConfig.TitleListConfigM } {
        return this._titleDic;
    }


    private _getNewState(data: number[], zeroTrue: boolean): { [key: number]: boolean } {
        let result: { [key: number]: boolean } = {};
        let len: number = /*Math.ceil(Macros.UNIQUE_TITLE_VALID_COUNT / 8)*/ 0;
        let titleId: number = 1;
        let hasChanged: boolean = false;
        let needBreak: boolean = false;
        for (let i: number = 0; i < len; i++) {
            if (needBreak) {
                break;
            }
            let para: number = 1;
            let value: number = data[i];
            needBreak = false;
            for (let j: number = 0; j < 8; j++) {
                if (titleId > /*Macros.UNIQUE_TITLE_VALID_COUNT*/ 0) {
                    needBreak = true;
                    break;
                }
                if (value >= 0) {
                    if (zeroTrue) {
                        result[titleId] = ((value & para) == 0);
                    }
                    else {
                        result[titleId] = Boolean(value & para);
                    }
                }
                else {
                    result[titleId] = false;
                }
                para = para << 1;
                titleId++;
            }
        }
        return result;
    }

    updateListData(data: Protocol.TitleFixInfoList, showId: number): void {
        // 更新缓存
        this.fixTitleDataCache = data;
        this._sepcTitleDic = {};
        this.curShowAchiTitleID = showId;
        this.curShowSpecTitleID = 0;
        for (let fixOne of this.fixTitleDataCache.m_astFixTitle) {
            this._sepcTitleDic[fixOne.m_usID] = {} as Protocol.TitleFixOne;
            this._sepcTitleDic[fixOne.m_usID] = fixOne;
            if (fixOne.m_ucShowFlag) {
                this.curShowSpecTitleID = fixOne.m_usID;
            }
            //特殊称号上线自动佩戴，只验证一次
            if (!this._checkState && GuildTools.TITLES.indexOf(fixOne.m_usID) != -1) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTitleActiveChangeRequest(Macros.TITLE_SET_SHOW, fixOne.m_usID, 1));
            }
        }
        this._checkState = true;
    }

    /**
     *根据iD获取配置
     * @param id
     * @return
     *
     */
    getDataConfig(id: number): GameConfig.TitleListConfigM {
        if (this._titleDic[id]) {
            return this._titleDic[id];
        }
        return null;
    }

    /**获取称号数组*/
    getTitleArrByType(type: number): GameConfig.TitleListConfigM[] {
        return this._titleTypeDic[type];
    }

    getTitleArrByDisplay(display: number): GameConfig.TitleListConfigM[] {
        return this._titleDisplayDic[display];
    }

    /**检查是否拥有称号*/
    checkHasTitle(titleId: number): boolean {
        let config: GameConfig.TitleListConfigM = this.getDataConfig(titleId);
        let has: boolean = false;
        let validTime: number = 0;
        if (config != null) {
            if (config.m_ucTitleType == KeyWord.TITLE_TYPE_ACHI) {
                let cSOneAchiData: Protocol.CSOneAchiData = G.DataMgr.achievementData.getCSOneAchiData(config.m_uiAchiId);
                has = cSOneAchiData != null && cSOneAchiData.m_bDone > 0;
            }
            else if (config.m_ucTitleType == KeyWord.TITLE_TYPE_SPECIAL) {
                let specTitleOneInfo: Protocol.TitleFixOne = this.getSpecTitleOneInfo(config.m_ucTitleID);
                let currentTime: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
                if (specTitleOneInfo && specTitleOneInfo.m_uiTimeOut > 0) {
                    validTime = specTitleOneInfo.m_uiTimeOut - currentTime;
                }
                else {
                    validTime = 1;
                }
                has = specTitleOneInfo != null && validTime > 0;
            }
        }
        return has;
    }

    canPeiYangTitles(): boolean {
        let config: GameConfig.TitleListConfigM;
        let cnt: number = 0;
        for (let key in this._sepcTitleDic) {
            let fixOne = this._sepcTitleDic[key];
            if (fixOne.m_usID > 0 && fixOne.m_uiTimeOut == 0) {
                config = this.getDataConfig(fixOne.m_usID);
                if (config != null) {
                    if (config.m_iConsumeID > 0 && fixOne.m_uiAddNum < config.m_uiAddNum && G.DataMgr.thingData.getThingNum(config.m_iConsumeID, Macros.CONTAINER_TYPE_ROLE_BAG, false)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
