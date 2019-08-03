/**
* 频道风格配置。
* @author teppei
* 
*/
export class ChannelStyle {
    /**频道ID。*/
    id: number = 0;

    /**内容颜色。*/
    textColor: string;

    /**频道名称颜色。*/
    channelColor: string;

    /**频道前缀。*/
    name: string;

    /**最大数字。*/
    maxChars: number = 0;

    /**最低等级。*/
    minLv: number = 0;

    /**间隔时间，单位毫秒。*/
    cd: number = 0;
}
