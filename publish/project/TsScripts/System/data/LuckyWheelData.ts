export class LuckyWheelData {

    private static readonly _SPLICE_NUMBER: number = 20;
    members: Protocol.XYZPActRole[] = [];
    membersSelf: Protocol.XYZPItemInfo[] = [];
    public onUpdatePanel(data: Protocol.XYZPpannelRsp) {
        let len = data.m_ucCount;
        //只取前60个，获取的是全部记录
        len = len > LuckyWheelData._SPLICE_NUMBER ? LuckyWheelData._SPLICE_NUMBER : len;
        let tmpArr: Protocol.XYZPActRole[] = [];
        for (let i = 0; i < len; i++) {
            tmpArr.push(data.m_stMembers[i]);
        }

        this.members = [];
        for (let i = tmpArr.length - 1; i >= 0; i--) {
            this.members.push(data.m_stMembers[i]);
        }

    }



    public onUpdateDraw(data: Protocol.XYZPDrawRsp) {
        for (let i = 0; i < data.m_ucCount; i++) {
            this.membersSelf.push(data.m_stDropItemList[i]);
        }

        let len = this.membersSelf.length;
        if (len >= LuckyWheelData._SPLICE_NUMBER) {
            this.membersSelf = this.membersSelf.splice(len - LuckyWheelData._SPLICE_NUMBER, LuckyWheelData._SPLICE_NUMBER);
        }
    }

    public onUpdateRecord(data: Protocol.XYZPRecordRsp) {
        for (let i = 0; i < data.m_ucCount; i++) {
            this.members.push(data.m_stMembers[i]);
        }
        let len = this.membersSelf.length;
        if (len >= LuckyWheelData._SPLICE_NUMBER) {
            this.membersSelf = this.membersSelf.splice(len - LuckyWheelData._SPLICE_NUMBER, LuckyWheelData._SPLICE_NUMBER);
        }

    }
}
