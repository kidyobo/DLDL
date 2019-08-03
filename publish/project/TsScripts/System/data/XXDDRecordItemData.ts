import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'

export class XXDDRecordItemData {
    roleId: Protocol.RoleID;
    roleName: string;
    iconItemData: RewardIconItemData = new RewardIconItemData();
    /**记录类型*/
    recordType: number = 0;
    thingConfig: GameConfig.ThingConfigM;
}
