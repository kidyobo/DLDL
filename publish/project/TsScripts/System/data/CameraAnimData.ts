import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
export class CameraAnimData {
    //二维字典
    public _dic: { [key1: number]: { [key2: number]: GameConfig.CameraAnimM } } = {};
    onCfgReady(): void {
        let dataList: GameConfig.CameraAnimM[] = G.Cfgmgr.getCfg('data/CameraAnimM.json') as GameConfig.CameraAnimM[];
        for (let data of dataList) {
            if (data.m_isEnabled) {
                let dic = this._dic[data.m_triggerType];
                if (!dic) {
                    dic = this._dic[data.m_triggerType] = {};
                }
                dic[data.m_triggerParam] = data;
            }
        }
    }
}