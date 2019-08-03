import { ChannelData } from 'System/chat/ChannelData'

/**
 * 聊天组件接口。
 * @author teppei
 * 
 */
export interface IChatComm {
    appendText(data: ChannelData, force: boolean): void;
    clearInput(): void;
}