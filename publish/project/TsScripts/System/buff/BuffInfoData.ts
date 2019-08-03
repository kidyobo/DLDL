/**
* 一个记录在role数据身上的buff信息 
* @author fygame
* 
*/
export class BuffInfoData {
    buffInfo: Protocol.BuffInfo;

    config: GameConfig.BuffConfigM;

    beginTime: number = 0;

    hasShow: boolean;

    constructor(buffInfo: Protocol.BuffInfo, config: GameConfig.BuffConfigM) {
        this.buffInfo = buffInfo;
        this.config = config;
        this.hasShow = true;
    }
}
