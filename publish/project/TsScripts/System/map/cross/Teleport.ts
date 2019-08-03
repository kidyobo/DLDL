/**
 * 跨场景寻路用到的一个数据单位 
 * @author teppei
 * 
 */
export class Teleport {
    /**传送点的id*/
    id: number = 0;

    /**场景ID*/
    vSceneId: number = 0;

    /**目标场景ID*/
    targetVSceneID: number = 0;

    /**目标id，场景角色的id，可以是npc的id等等*/
    targetID: number = 0;

    position: UnityEngine.Vector2;

    /**寻路到怪物或npc时需要保持的距离*/
    keepAway = 0;

    parent: Teleport;

    /**是否在开放链表*/
    iValueF: number = 0;

    /**
     * 重置堆相关数据。 
     * 
     */
    resetHeap(): void {
        this.iValueF = 0;
        this.parent = null;
    }
}
