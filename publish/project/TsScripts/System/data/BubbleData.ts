import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
export class BubbleData {
    //二维字典
    public _dic: { [key: number]: GameConfig.ChatBubbleM[] } = {};
    onCfgReady(): void {
        let dataList: GameConfig.ChatBubbleM[] = G.Cfgmgr.getCfg('data/ChatBubbleM.json') as GameConfig.ChatBubbleM[];
        for (let data of dataList) {
            if (data.m_isEnabled) {
                let dic = this._dic[data.m_ID];
                if (!dic) {
                    dic = this._dic[data.m_ID] = [];
                }
                dic.push(data);
            }
        }
    }
}