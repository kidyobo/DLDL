/**
* 
* @author xiaojialin
* 
*/
export class GuidUtil {
    /**
     * <FONT COLOR='FF0000'>禁止调用构造函数。</FONT>
     * 
     */

    /**
     * 判断两个GUID是否相等。
     * @param guidA <code>Protocol.ThingGUID</code>的实例A。
     * @param guidB <code>Protocol.ThingGUID</code>的实例A。
     * @return 两个GUID是否相等。
     * 
     */
    static isGuidEqual(guidA: Protocol.ThingGUID, guidB: Protocol.ThingGUID): boolean {
        return guidA != null && guidB != null &&
            guidA.m_usSequence == guidB.m_usSequence &&
            guidA.m_iCreateTime == guidB.m_iCreateTime;
    }

    /**
     * 将GUID转化为字符串。
     * @param guid <code>Protocol.ThingGUID</code>的实例。
     * @return 对应的字符串。
     * 
     */
    static guid2Key(guid: Protocol.ThingGUID): string {
        return guid.m_usSequence + '_' + guid.m_iCreateTime;
    }
}
