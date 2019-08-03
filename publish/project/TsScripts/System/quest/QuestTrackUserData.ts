/**
* 任务追踪文本的用户数据。
* @author teppei
* 
*/
export class QuestTrackUserData {
    linkType: number = 0;

    questID: number = 0;

    npcID: number = 0;

    nodeIndex: number = 0;

    underLine: boolean;

    /**是否展开（仅用于目录树按钮）。*/
    opened: boolean;

    /**是否显示箭头*/
    isShowArrow: boolean;

    /**
     * 构造函数。
     * @param linkType 链接类型，0表示无链接。
     * @param questID 任务ID。
     * @param npcID 关联的NPC的ID，领取或提交任务时可用。
     * @param nodeIndex 关联的节点ID，领取或提交任务填0。
     * 
     */
    constructor(linkType: number, questID: number, npcID: number, nodeIndex: number) {
        this.linkType = linkType;
        this.questID = questID;
        this.npcID = npcID;
        this.nodeIndex = nodeIndex;

        if (0 != this.linkType) {
            this.underLine = true;
        }
    }

    /**
     * 同步数据（样式除外，即underLine和opened不同步）。
     * @param input
     * 
     */
    syncData(input: QuestTrackUserData): void {
        this.linkType = input.linkType;
        this.questID = input.questID;
        this.npcID = input.npcID;
        this.nodeIndex = input.nodeIndex;
    }
}
