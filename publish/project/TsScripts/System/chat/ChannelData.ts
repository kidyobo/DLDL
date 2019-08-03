import { Global as G } from 'System/global'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { ChannelMsgData } from 'System/chat/ChannelMsgData'
import { ChannelStyle } from 'System/chat/ChannelStyle'
import { Color } from 'System/utils/ColorUtil'
import { RichTextUtil } from 'System/utils/RichTextUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { RegExpUtil } from 'System/utils/RegExpUtil'

/**
 * 聊天数据 
 * @author fygame
 * 
 */
export class ChannelData {
    /**频道id*/
    id: number = 0;

    /**展示的信息。*/
    displayMsg: string = '';

    /**发送人的简要信息。*/
    roleAbstract: RoleAbstract = new RoleAbstract();

    /**接收者的简要信息。*/
    dstRoleAbstract: RoleAbstract = new RoleAbstract();

    /**超链接数据*/
    listMsgData: ChannelMsgData[] = [];

    /**是否来自response。*/
    isFromResp = false;

    isChatGM = false;


    reset(): void {
        this.displayMsg = '';
        this.listMsgData.length = 0;
        this.isChatGM = false;
    }

    /**
	* 转换为用于显示的富文本。
	* 
	*/
    toRichText(): string {
        // 消息排版为 【频道】+ 平台信息 + 名字 + 消息	
        let channelStyle: ChannelStyle = G.DataMgr.chatData.getStyle(this.id);
        let richText: string = '';
        let msgColor: string;
        //let graphic: DisplayObject;
        //let graphicElement: GraphicElement;
        if (this.isChatGM) {
            // 聊天GM使用特定颜色
            msgColor = Color.CHAT_GM_COLOR;
        }
        else if (null != channelStyle.textColor) {
            // 使用频道配色
            msgColor = channelStyle.textColor;
        }
        let len: number = this.listMsgData.length;
        let msgData: ChannelMsgData;
        let tmpColor: string;
        for (let i: number = 0; i < len; ++i) {
            msgData = this.listMsgData[i];
            // 自己的名字不用下划线
            if (Macros.MSGDATATYPE_ROLE_INFO == msgData.type &&
                G.DataMgr.heroData.roleID.m_uiUin == msgData.data.m_stValue.m_stRoleInfo.m_stRoleId.m_uiUin) {
                tmpColor = Color.NAME_PINK;
                richText += RichTextUtil.getColorText(msgData.msg, tmpColor);
            }
            else {
                if (null != msgData.color) {
                    tmpColor = msgData.color;
                }
                else if (Macros.MSGDATATYPE_MAX != msgData.type) {
                    tmpColor = Color.getColorById(KeyWord.COLOR_ORANGE);
                }
                else {
                    tmpColor = msgColor;
                }

                if (Macros.MSGDATATYPE_MAX != msgData.type) {
                    richText += RichTextUtil.getUnderlineText(msgData.msg, tmpColor, msgData);
                }
                else {
                    richText += msgData.msg;
                }
            }
        }
        return RegExpUtil.getKeyBoardEnterStr(richText);
    }
}