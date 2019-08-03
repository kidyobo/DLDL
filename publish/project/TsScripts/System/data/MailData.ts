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


/**邮件数据*/
export class MailData {

    /**邮件数量*/
    numMail: number = 0;
    mailList: Protocol.MailMemo[];
    private mailDetailDict: { [mailId: number]: OneMailDetail };
    notRedEmails: Protocol.MailMemo[];

    constructor() {
        this.mailList = [];
        this.mailDetailDict = {};
        this.notRedEmails = [];
    }

    get MailCount() {
        return this.mailList.length;
    }

    /**设置邮件内容*/
    setMailContent(data: Protocol.Mail_FetchMail_Response): void {
        let oneMailDetail = this.mailDetailDict[data.m_uiMailID];
        if (null == oneMailDetail) {
            this.mailDetailDict[data.m_uiMailID] = oneMailDetail = new OneMailDetail();
        }
        oneMailDetail.rewardList = data.m_stList.m_astList;
        oneMailDetail.rewardCount = data.m_stList.m_ucCount;
        oneMailDetail.mailId = data.m_stMailContent.m_uiMailID;
        oneMailDetail.title = data.m_stMailContent.m_szTitle;
        oneMailDetail.content = data.m_stMailContent.m_szText;
        oneMailDetail.hasRed = data.m_ushResultID == 1;
        if (oneMailDetail.rewardCount < 2) {
            uts.log('说好的最好两个附件呢！');
        }
    }


    /**设置邮件读取状态*/
    setMailRed(id: number) {
        for (let i = 0; i < this.MailCount; i++) {
            if (id == this.mailList[i].m_uiMailID) {
                this.mailList[i].m_ucReadFlag = 1;
                break;
            }
        }
        for (let i = 0; i < this.notRedEmails.length; i++) {
            if (id == this.notRedEmails[i].m_uiMailID) {
                this.notRedEmails.splice(i, 1);
                break;
            }
        }
    }

    /**通过id获取邮件的内容*/
    getMailDataById(id: number): OneMailDetail {
        return this.mailDetailDict[id];
    }


    /**删除邮件*/
    removeMail(mailId: number): void {
        for (let i: number = 0; i < this.MailCount; i++) {
            if (this.mailList[i].m_uiMailID == mailId) {
                this.mailList.splice(i, 1);
                this.numMail--;
                G.NoticeCtrl.checkEmail();
                G.ViewCacher.mainView.mainChatCtrl.checkEmailTipActive();
                break;
            }
        }
    }


    isGetReward(id: number): boolean {
        if (id <= 0)
            return false;
        for (let i: number = 0; i < this.MailCount; i++) {
            if (this.mailList[i].m_uiMailID == id)
                return true;
        }
        return false;
    }


    /**检查邮件是否有未领取的*/
    checkEmailBitMap(): boolean {
        for (let cfg of this.mailList) {
            if (cfg.m_uiAccessoryBitmap != 0) {
                return true;
            }
        }
        return false;
    }



    /**检查邮件是否有未读取的*/
    checkEmailHasNotRed(): boolean {
        return this.notRedEmails.length > 0;
    }

    /**检查邮件里有没有该封邮件*/
    checkEmailListIsHasThisMail(id: number): boolean {
        for (let i = 0; i < this.MailCount; i++) {
            if (id == this.mailList[i].m_uiMailID) {
                return true;
            }
        }
        return false;
    }

    /**检查未读邮件是否有该邮件*/
    checkNotRedEmailsHasThisMail(id: number): boolean {
        for (let i = 0; i < this.notRedEmails.length; i++) {
            if (id == this.notRedEmails[i].m_uiMailID) {
                return true;
            }
        }
        return false;
    }

}