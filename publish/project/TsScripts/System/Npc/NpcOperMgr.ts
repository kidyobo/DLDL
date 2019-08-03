/**
* 对npc操作的一个数据管理器
* 在我们进入场景后前台还没有新建某个npc的时候后台会发送操作npc的消息过来，这个时候要进行缓存处理 
* @author fygame
* 
*/
export class NpcOperMgr {
    /**
     * 存储数据[npcid, 是否显示(Booleam)] 
     */
    private m_npcDataMap: { [npcID: number]: boolean } = {};

    /**
    * 设置数据 
    * @param npcID
    * @param isVisible
    * 
    */
    public setNpcVisible(npcID: number, isVisible: boolean): void {
        this.m_npcDataMap[npcID] = isVisible;
    }

    /**
     * 查询NPC的隐藏与否信息。
     * @param npcID
     * @return 
     * 
     */
    public getNpcVisible(npcID: number): boolean {
        let visible = this.m_npcDataMap[npcID];
        if (undefined != visible) {
            return visible;
        }
        else {
            return true;
        }
    }

    /**
     *  删除所有的数据
     * 
     */
    public deleteAllData(): void {
        for (let npcID in this.m_npcDataMap) {
            this.m_npcDataMap[npcID] = null;
            delete this.m_npcDataMap[npcID];
        }
    }
}