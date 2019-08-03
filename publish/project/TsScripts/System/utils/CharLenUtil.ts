export class CharLenUtil {
    /**
     *获取字节数 
     * @param name
     * @return 
     * 
     */
    static getStringLen(name: string): number {
        let _len: number = 0;
        for (let i: number = 0; i < name.length; i++) {
            _len += name.charCodeAt(i) > 255 ? 3 : 1;
        }
        return _len;
    }
}
