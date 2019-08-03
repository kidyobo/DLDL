/**
* 锁仙台玩家Item的Vo。
* 
* 本文件代码由模板生成，你可能需要继续修改其他代码文件才能正常使用。
* 
* @author teppei
* 
*/
export class SxtPlayerItemData {
    /**玩家名字。*/
    name: string;

    /**职业。*/
    prof: number = 0;

    /**性别。*/
    gender: number = 0;

    /**玩家的RoleID。*/
    roleID: Protocol.RoleID;

    /**战斗力。*/
    zdl: number = 0;

    /**是否队长。*/
    isCaptain: boolean;

    /**是否可以踢人。*/
    canKick: boolean;

    /**是否已准备。*/
    isReady: boolean;

    /**是否被锁。*/
    isLock: boolean;

    reset(): void {
        this.name = null;
        this.prof = 0;
        this.gender = 0;
        this.roleID = null;
        this.zdl = 0;
        this.isCaptain = false;
        this.canKick = false;
        this.isReady = false;
        this.isLock = false;
    }
}
