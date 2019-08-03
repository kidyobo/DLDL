export class RichTextUtil {

    private static urlEventMap: { [key: string]: any } = {};

    private static urlKeyNum: number = 0;

    /**
     * 获取超链接文本。
     * @param str
     * @return
     *
     */
    static getUnderlineText(str: string, color: string = null, eventData: any = null): string {
        let urlKey = 0;
        if (null != eventData) {
            urlKey = ++RichTextUtil.urlKeyNum;
            RichTextUtil.urlEventMap[urlKey] = eventData;
        }
        
        if (color) {
            str = uts.format('[{0}]{1}[-]', color, str);
        }
        str = uts.format('[url={0}][u]{1}[/u][/url]', urlKey, str);
        return str;
    }

    static getEventData(urlKey: string): any {
        return RichTextUtil.urlEventMap[urlKey];
    }

    static getColorText(str: any, color: string): string {
        str = uts.format('[{0}]{1}[-]', color, str);
        return str;
    }


 
}