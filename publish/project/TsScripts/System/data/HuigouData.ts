import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Global as G } from 'System/global'

export class OneMailDetail {
    rewardList: Protocol.SimItem[];
    rewardCount: number = 0;
    mailId: number = 0;
    title: string;
    content: string;
    hasRed: boolean = false;
}


/**回购数据*/
export class HuigouData {

    /**回购配置*/
    // private huigouDict: { [class: number]: OneMailDetail };

    // constructor() {
    //     this.mailDetailDict = {};
    // }


    // /**设置配置*/
    // setConfig(): void {
    //     let configs: GameConfig.ZhuFuConfigM[] = G.Cfgmgr.getCfg('data/ZhuFuConfigM.json') as GameConfig.ZhuFuConfigM[];
    //     let oneMailDetail = this.mailDetailDict[data.m_uiMailID];
    //     if (null == oneMailDetail) {
    //         this.mailDetailDict[data.m_uiMailID] = oneMailDetail = new OneMailDetail();
    //     }
    //     oneMailDetail.rewardList = data.m_stList.m_astList;
    //     oneMailDetail.rewardCount = data.m_stList.m_ucCount;
    //     oneMailDetail.mailId = data.m_stMailContent.m_uiMailID;
    //     oneMailDetail.title = data.m_stMailContent.m_szTitle;
    //     oneMailDetail.content = data.m_stMailContent.m_szText;
    //     oneMailDetail.hasRed = data.m_ushResultID == 1;
    //     if (oneMailDetail.rewardCount < 2) {
    //         uts.log('说好的最好两个附件呢！');
    //     }
    // }

}