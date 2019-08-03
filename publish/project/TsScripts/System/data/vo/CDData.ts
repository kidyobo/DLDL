/**
	 * 冷却数据结构。
	 * @author xiaojialin
	 * 
	 */
export class CDData {
    /**最近一次的冷却开始时间。该属性在调用<code>CDData::check</code>之前无意义。*/
    private m_startTime: number = -1;

    /**
     * 冷却时间，由技能配置和冷却性质（是否自身冷却）指定。
     * 如果是自身冷却，为自身冷却时间和公共冷却时间中较大数值者。
     * 如果是公共冷却，则由该技能配置的公共冷却时间确定。
     * 该属性在调用<code>CDData::check</code>之前无意义。
     */
    private m_cdTime: number = -1;

    /**剩余时间，仅在初始化冷去数据时有意义。*/
    private m_leftTime: number = -1;

    private m_id: number = 0;

    /**
     * 冷却数据<code>CDData</code>的构造函数。<code>CDData</code>不对外提供直接修改
     * 冷却数据的接口，只能通过<code>CDData::reset</code>函数重置冷却数据。
     * 
     */


    /**
     * 重置冷却数据，随后读取冷却数据时务必先调用<code>CDData::check</code>校验数据。
     * 可以在两种情况下调用本函数：登陆时初始化下线冷却数据，此时请为pStartTime传递-1，
     * pLeftTime为<code>CooldownClient::m_iLeftTime</code>；释放技能时写入冷却数据，此时pStartTime
     * 为计时时间，并且为pLeftTime传递-1。
     * 
     * @param pAllTime 技能冷却全程时间。
     * @param pStartTime 开始冷却的时间，若无意义请传递-1。
     * @param pLeftTime 剩余冷却时间，若无意义请传递-1。
     * 
     */
    reset(pID: number, pAllTime: number, pStartTime: number, pLeftTime: number): void {
        this.m_id = pID;

        this.m_cdTime = pAllTime;
        this.m_startTime = pStartTime;
        this.m_leftTime = pLeftTime;
    }

    /**
     * 读取冷却时间。请务必先调用<code>CDData::check</code>校验数据。
     * @return 冷却时间。
     * 
     */
    get cdTime(): number {
        return this.m_cdTime;
    }

    /**
     * 读取冷却状态。请务必先调用<code>CDData::check</code>校验数据。
     * @return 是否正在冷却。
     * 
     */
    get isColding(): boolean {
        if (this.m_cdTime > 0 && Math.round(UnityEngine.Time.realtimeSinceStartup * 1000) - this.m_startTime < this.m_cdTime)
            return true;
        return false;
    }

    /**
     * 读取剩余冷却时间。请务必先调用<code>CDData::check</code>校验数据。
     * @return 剩余冷却时间，单位毫秒。
     * 
     */
    get remainTime(): number {
        if (0 == this.m_cdTime) {
            return 0;
        }

        let result: number = this.m_cdTime - Math.round(UnityEngine.Time.realtimeSinceStartup * 1000) + this.m_startTime;
        return result;
    }

    /**
     * 获取本冷却关联的ID。
     * @return 
     * 
     */
    get id(): number {
        return this.m_id;
    }
}
