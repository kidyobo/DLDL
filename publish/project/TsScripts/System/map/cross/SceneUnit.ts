import { Teleport } from 'System/map/cross/Teleport'

export class SceneUnit {
    vSceneId: number;
    teleports: Teleport[];

    bClosed: boolean;// 是否在封闭链表
    bOpened: boolean;// 是否在开放链表
    reset(): void {
        this.bClosed = false;
        this.bOpened = false;
    }
}
