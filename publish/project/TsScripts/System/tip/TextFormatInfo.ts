/**
	 * 文本型Tip的文本信息结构。
	 * @author teppei
	 * 
	 */
export class TextFormatInfo {
    /**内存池。*/
    private static m_pools: TextFormatInfo[] = new Array<TextFormatInfo>();

    private static m_count: number = 0;

    text: string;

    propId: number = 0;

    propValue: number = 0;

    propArrow: number = 0;

    lineEnd: boolean;

    color: number = 0;

    size: number = 0;

    isBold: number = 0;

    xOffset: number = 0;

    /**是否不断行，true的话则新一行不会从下一个行首开始绘制。*/
    noBreak: boolean;

    /**
     * 
     * @param text 文本。
     * @param propId 属性ID。
     * @param propValue 属性值。
     * @param propArrow 属性箭头标记。
     * @param lineEnd 是否行尾。
     * @param color 颜色，0表示不指定。
     * @param size 字体大小，0表示不指定。
     * @param isBold 是否粗体，0表示否。
     * @param xOffset 水平偏移量，相对于Tip默认起始位置。
     * @param noBreak 是否不断行。
     * 
     */


    public setInfo(text: string, propId: number, propValue: number, propArrow: number, lineEnd: boolean, color: number = 0, size: number = 0, isBold: number = 0, xOffset: number = 0, noBreak: boolean = false): void {
        this.text = this.text;
        this.propId = this.propId;
        this.propValue = this.propValue;
        this.propArrow = this.propArrow;
        this.lineEnd = this.lineEnd;
        this.color = this.color;
        this.size = this.size;
        this.isBold = this.isBold;
        this.xOffset = this.xOffset;
        this.noBreak = this.noBreak;
    }

    static alloc(): TextFormatInfo {
        if (TextFormatInfo.m_count > 0) {
            TextFormatInfo.m_count--;

            return TextFormatInfo.m_pools.pop();
        }
        else {
            return new TextFormatInfo();
        }
    }

    static free(tfi: TextFormatInfo): void {
        TextFormatInfo.m_pools[TextFormatInfo.m_count] = tfi;

        TextFormatInfo.m_count++;
    }
}
