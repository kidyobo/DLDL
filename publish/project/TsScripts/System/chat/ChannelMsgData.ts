/**
	 * 聊天频道数据，用来存储表情数据，鼠标响应文本数据
	 * @author fygame
	 * 
	 */
export class ChannelMsgData {
    /**开始索引*/
    startIndex: number = 0;

    /**结束索引*/
    endIndex: number = 0;

    /**消息类型*/
    msg: string = '';

    /**数据。*/
    data: Protocol.MsgData;

    /**URL超链地址。*/
    url: string;

    /**文本颜色。*/
    color: string;

    /**超链接类型*/
    type: number = 0;

    /**收到超链接的时间。*/
    time: number = 0;

    constructor() {
        this.data = {} as Protocol.MsgData;
    }
}
