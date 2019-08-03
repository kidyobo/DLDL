import { NpcController } from "System/unit/npc/NpcController";

export class NPCInfo {
    sceneID: number = 0;

    x: number = 0;

    y: number = 0;

    npcID: number = 0;

    direction: number = 0;

    config: GameConfig.NPCConfigM;

    model: NpcController;

    rangeLoaderKey = 0;
}
