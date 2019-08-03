export class XXDDRankItemData {
    rankID: number = 0;
    name: string;
    roleID: Protocol.RoleID;
    constructor() {
        this.roleID = {} as Protocol.RoleID;
    }
}
