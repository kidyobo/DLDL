/**
* 进副本参数。
* @author teppei
* 
*/
export class PinstanceArgs {
    /**副本ID。*/
    pID: number = 0;

    /**NPC的ID。*/
    npcID: number = 0;

    /**副本难度。*/
    diff: number = 0;

    /**是否继续挑战。*/
    retry: boolean;

    /**开始挑战层数，0表示从第一层开始。*/
    jump: number = 0;
    
    /**是否收费(目前只有经验副本有用 0不收费 1 收费) */
    cost: number = 0;
}
