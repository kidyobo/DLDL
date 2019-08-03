import { Global as G } from 'System/global'

enum IosGetType {
    Type = 0,
    Hour = 1,
    Minute = 2,
    Content = 3,
}


/**此类专门管理ios消息推送*/
export class IosLocalNotifyData {

    private iosNotifyData: { [type: number]: GameConfig.IOSPushMsgConfigM } = {};

    /**是否往手机里注册消息推送,防止卡住游戏进程*/
    isRegisterApplePush: boolean = true;


    onCfgReady() {
        let datas: GameConfig.IOSPushMsgConfigM[] = G.Cfgmgr.getCfg('data/IOSPushMsgConfigM.json') as GameConfig.IOSPushMsgConfigM[];
        for (let data of datas) {
            if (this.iosNotifyData[data.m_iId] == null) {
                this.iosNotifyData[data.m_iId] = {} as GameConfig.IOSPushMsgConfigM;
            }
            this.iosNotifyData[data.m_iId] = data;
        }
    }

    //最大支持6个消息推送
    addNotifyToIosPushCenter() {
        let params = {
            type1: this.getContent(1, IosGetType.Type),
            hour1: this.getContent(1, IosGetType.Hour),
            minute1: this.getContent(1, IosGetType.Minute),
            content1: this.getContent(1, IosGetType.Content),
            type2: this.getContent(2, IosGetType.Type),
            hour2: this.getContent(2, IosGetType.Hour),
            minute2: this.getContent(2, IosGetType.Minute),
            content2: this.getContent(2, IosGetType.Content),
            type3: this.getContent(3, IosGetType.Type),
            hour3: this.getContent(3, IosGetType.Hour),
            minute3: this.getContent(3, IosGetType.Minute),
            content3: this.getContent(3, IosGetType.Content),
            type4: this.getContent(4, IosGetType.Type),
            hour4: this.getContent(4, IosGetType.Hour),
            minute4: this.getContent(4, IosGetType.Minute),
            content4: this.getContent(4, IosGetType.Content),
            type5: this.getContent(5, IosGetType.Type),
            hour5: this.getContent(5, IosGetType.Hour),
            minute5: this.getContent(5, IosGetType.Minute),
            content5: this.getContent(5, IosGetType.Content),
            type6: this.getContent(6, IosGetType.Type),
            hour6: this.getContent(6, IosGetType.Hour),
            minute6: this.getContent(6, IosGetType.Minute),
            content6: this.getContent(6, IosGetType.Content),
        };
        Game.IosSdk.IosCallSDkFunc('creatLocalNotify', JSON.stringify(params));
    }


    private getContent(type: number, getType: number): string {
        let id: string = '0';
        let hour: string = '0';
        let minute: string = '0';
        let content: string = '';
        let data = this.iosNotifyData[type];
        if (getType == IosGetType.Type) {
            if (data != null) { id = data.m_iId.toString() };
            return id;
        }
        else if (getType == IosGetType.Hour) {
            if (data != null) { hour = data.m_iHour.toString() };
            return hour;
        }
        else if (getType == IosGetType.Minute) {
            if (data != null) { minute = data.m_iMinute.toString() };
            return minute;
        }
        else if (getType == IosGetType.Content) {
            if (data != null) { content = data.m_szContent };
            return content;
        }
        return '0';
    }

}

