import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 管理所有错误配置信息 
 * @author fygame
 * 
 */
export class ErrorData {
    /**系统错误列表，错误Id在10000以下，类型是ERROR_TYPE_SYSTEM*/
    private _systemErrDict: { [errorId: number]: GameConfig.ErrnoConfigM };

    /**
     * 协议错误列表 ，错误id在10001~50000，类型是ERROR_TYPE_PROTOCOL
     */
    private _protocolErrDict: { [errorId: number]: GameConfig.ErrnoConfigM };

    /**运行时错误列表，错误id在50001以上，类型是ERROR_TYPE_RUNNING*/
    private _runningErrDict: { [errorId: number]: GameConfig.ErrnoConfigM };

    /**tip提示文字配置*/
    private _sysTipData: { [errorId: number]: GameConfig.SysTipsConfigM };

    constructor() {
        this._systemErrDict = {};
        this._protocolErrDict = {};
        this._runningErrDict = {};
    }

    onCfgReady() {
        this.setData();
        this.setSysTipData();
    }

    /**
     * 数据初始化 
     * @param dataList
     * 
     */
    private setData(): void {
        let dataList: GameConfig.ErrnoConfigM[] = G.Cfgmgr.getCfg('data/ErrnoConfigM.json') as GameConfig.ErrnoConfigM[];

        this._systemErrDict = {};
        this._protocolErrDict = {};
        this._runningErrDict = {};

        let len: number = dataList.length;
        for (let i: number = 0; i < len; ++i) {
            if (dataList[i].m_ucType == KeyWord.ERROR_TYPE_SYSTEM) {
                this._systemErrDict[dataList[i].m_uiValue] = dataList[i];
            }
            else if (dataList[i].m_ucType == KeyWord.ERROR_TYPE_PROTOCOL) {
                this._protocolErrDict[dataList[i].m_uiValue] = dataList[i];
            }
            else if (dataList[i].m_ucType == KeyWord.ERROR_TYPE_RUNNING) {
                this._runningErrDict[dataList[i].m_uiValue] = dataList[i];
            }
        }
    }

    setSysTipData(): void {
        let dataList: GameConfig.SysTipsConfigM[] = G.Cfgmgr.getCfg('data/SysTipsConfigM.json') as GameConfig.SysTipsConfigM[];
        this._sysTipData = {};

        for (let data of dataList) {
            this._sysTipData[data.m_uiID] = data;
        }
    }

    getSysTipText(id: number): string {
        let data: GameConfig.SysTipsConfigM = this._sysTipData[id];

        if (data != null) {
            return data.m_szTips;
        }
        return null;
    }
    /**
     *  通过errorId获取错误解释 
     * @param id
     * @return 
     * 
     */
    getRunningErrorStringById(id: number): string {
        if (id > 0) {
            let temp: GameConfig.ErrnoConfigM = this._runningErrDict[id];
            if (null != temp) {
                return temp.m_szDescriptionZH;
            }
        }

        return '未知信息（Errno表中未查到:' + id + '）';
    }

    /**
     * 
     * @param id
     * @return 
     * 
     */
    getErrorStringById(id: number): string {
        let temp: GameConfig.ErrnoConfigM;
        if (id > 0) {
            temp = this._runningErrDict[id];
            if (null != temp) {
                return temp.m_szDescriptionZH;
            }
            temp = this._protocolErrDict[id];
            if (null != temp) {
                return temp.m_szDescriptionZH;
            }
            temp = this._systemErrDict[id];
            if (null != temp) {
                return temp.m_szDescriptionZH;
            }
        }
        if (defines.has('_DEBUG')) { uts.assert(temp != null, '未知信息（Errno表中未查到:' + id + '）'); }
        return '未知信息（Errno表中未查到:' + id + '）';
    }
}
