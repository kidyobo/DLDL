import { Global as G } from 'System/global'
import { ChannelData } from 'System/chat/ChannelData'
import { ChannelStyle } from 'System/chat/ChannelStyle'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 数据控制器 
 * @author fygame
 * 
 */
export class ChatData {
    /**所有信息数量*/
    static ALL_COUNT: number = 250;

    /**输入记录最大保存数*/
    static MAX_SAVE_COUNT: number = 20;

    /**所有频道数据*/
    dicChannel: { [channelId: number]: ChannelData[] };

    /**频道样式*/
    private m_dicChannelStyle: { [channelId: number]: ChannelStyle };

    /**保存的输出信息*/
    private m_listSaveChatData: ChannelData[];


    constructor() {
        this.m_listSaveChatData = new Array<ChannelData>();
        this.dicChannel = {};
        this.dicChannel[Macros.CHANNEL_MAX] = new Array<ChannelData>();
        this.m_dicChannelStyle = {};
        this._addStyle(Macros.CHANNEL_MAX, 'ffffff', 'ffffff', '综合', 40, 0, 0);
        this._addStyle(Macros.CHANNEL_WORLD, 'ff7200', 'ff7200', '世界', 40, 30, 5000);
        this._addStyle(Macros.CHANNEL_TEAM, '89DB00', '89DB00', '队伍', 40, 0, 0);
        this._addStyle(Macros.CHANNEL_COUNTRY, 'ff7200', 'ff7200', '国家', 40, 20, 5000);
        this._addStyle(Macros.CHANNEL_NEARBY, '2380ff', 'ffffff', '本地', 40, 30, 3000);
        this._addStyle(Macros.CHANNEL_GUILD, '9b66fc', '9b66fc', '宗门', 40);
        this._addStyle(Macros.CHANNEL_SPEAKER, 'FFFF00', 'FFFF00', '喇叭', 49);
        this._addStyle(Macros.CHANNEL_PRIVATE, 'f862e1', 'f862e1', '私聊', 90, 30, 0);
        this._addStyle(Macros.CHANNEL_SYSTEM, 'f7331f', 'ff9c00', '系统', 0);
        this._addStyle(Macros.CHANNEL_CHUANWEN, '66ff00', '66ff00', '传闻', 0);
        this._addStyle(Macros.CHANNEL_TEAM_NOTIFY, '66ff00', '66ff00', '组队', 0);
    }

    processChatCd() {
        // 更新喇叭频道等级
        let channelStyle: ChannelStyle = this.getStyle(Macros.CHANNEL_SPEAKER);
        channelStyle.minLv = G.DataMgr.constData.getValueById(KeyWord.CHANNEL_SPEAKER_OPEN_LEVEL);
    }

    private _addStyle(id: number, channelColor: string, textColor: string, name: string, maxChars: number, minLv: number = 0, cd: number = 0): void {
        let style: ChannelStyle = new ChannelStyle();
        style.id = id;
        style.channelColor = channelColor;
        style.textColor = textColor;
        style.name = name;
        style.maxChars = maxChars;
        style.minLv = minLv;
        style.cd = cd;
        this.m_dicChannelStyle[id] = style;
        this.dicChannel[id] = new Array<ChannelData>();
    }

    getStyle(id: number): ChannelStyle {
        return this.m_dicChannelStyle[id];
    }

    /**
     * 存入频道信息 
     * @param data
     * 
     */
    addChatData(data: ChannelData): void {
        let savedId = data.id;
        if (Macros.CHANNEL_CHUANWEN == savedId) {
            savedId = Macros.CHANNEL_SYSTEM;
        }

        let dataList = this.dicChannel[savedId];
        if (null == dataList) {
            return;
        }

        // 存入单个频道
        if (dataList.length >= ChatData.ALL_COUNT) {
            dataList.shift();
        }

        //有新的宗门消息
        if (Macros.CHANNEL_GUILD == savedId) {
            let chatView = G.ViewCacher.chatView;

            if (!chatView.isOpened || (chatView.isOpened && chatView.m_curChannelId != Macros.CHANNEL_GUILD)) {


                G.DataMgr.runtime.hasNewGuildChatMsg = true;
                G.MainBtnCtrl.setGuildChatTipMark();
            }
        }

        dataList.push(data);
    }

    /**保存发送信息*/
    saveChannelData(data: ChannelData): void {
        let index: number = -1;
        let len: number = this.m_listSaveChatData.length;

        for (let i: number = 0; i < len; ++i) {
            if (this.m_listSaveChatData[i].displayMsg == data.displayMsg) {
                index = i;
                break;
            }
        }

        if (index > -1) {
            // 重复信息
            this.m_listSaveChatData.splice(index, 1);
        }
        else if (len == ChatData.MAX_SAVE_COUNT) {
            // 超过最大存储数，删掉最前面的数据
            this.m_listSaveChatData.splice(0, 1);
        }

        this.m_listSaveChatData.push(data);
    }
}
