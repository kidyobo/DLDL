import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ActionHandler } from 'System/ActionHandler'
import { EventDispatcher } from 'System/EventDispatcher'
import { Macros } from 'System/protocol/Macros'
import { EmailPanel } from 'System/friend/EmailPanel'
import { FriendView, FriendViewTab } from 'System/friend/FriendView'
/**
 * 邮件系统的逻辑模块 
 * 
 */
export class MailModule extends EventDispatcher {
    constructor() {
        super();
        this.addNetListener(Macros.MsgID_Mail_FetchList_Response, this._onMailFetchListResponse);
        this.addNetListener(Macros.MsgID_Mail_FetchMail_Response, this._onMailFetchMailResponse);
        this.addNetListener(Macros.MsgID_Mail_PickAccessory_Response, this._onMailPickAccessoryResponse);
        this.addNetListener(Macros.MsgID_Mail_MailNumber_Notify, this._onMailNumberNotify);
        this.addNetListener(Macros.MsgID_Mail_ListChange_Notify, this._onMailChangeNotify);
    }


    /**
    * 拉取一封邮件内容响应
    * @param msg
    *
    */
    private _onMailFetchMailResponse(response: Protocol.Mail_FetchMail_Response): void {
        //基本角色ID判断，用于容错操作
        if (0 == response.m_ushResultID) {
            G.DataMgr.mailData.setMailContent(response);
            G.DataMgr.mailData.setMailRed(response.m_uiMailID);
            let emailPanel = G.Uimgr.getSubFormByID<EmailPanel>(FriendView, FriendViewTab.EmailPanel);
            if (emailPanel != null) {
                //刷新列表显示已读取状态
                emailPanel.updateMailList(false);
                emailPanel.updateContent();
            }
            G.ViewCacher.mainView.mainChatCtrl.checkEmailTipActive();
            G.NoticeCtrl.checkEmail();
        }
    }


    /**
     * 收取全部附件响应
     * @param msg
     *
     */
    private _onMailPickAccessoryResponse(response: Protocol.Mail_PickAccessory_Response): void {
        //领了奖励就把邮件删了吧
        if (0 == response.m_ushResultID) {
            G.DataMgr.mailData.removeMail(response.m_uiMailID);
            let emailPanel = G.Uimgr.getSubFormByID<EmailPanel>(FriendView, FriendViewTab.EmailPanel);
            if (emailPanel != null) {
                //领取邮件刷新列表个数
                emailPanel.updateMailList(true);
            }
        }
    }


    /**
    * 拉取邮件列表响应 
    * @param msg
    * 
    */
    private _onMailFetchListResponse(response: Protocol.Mail_FetchList_Response): void {
        //需要在邮件摘要数组里添加邮件时间(几天前)
        if (response.m_ushResultID == 0) {
            G.DataMgr.mailData.mailList = response.m_astMailMemo;
            for (let i = 0; i < response.m_astMailMemo.length; i++) {
                let data = response.m_astMailMemo[i];
                if (data.m_ucReadFlag == 0) {
                    if (!G.DataMgr.mailData.checkNotRedEmailsHasThisMail(data.m_uiMailID)) {
                        G.DataMgr.mailData.notRedEmails.push(data);
                    }
                }
            }
            G.ViewCacher.mainView.mainChatCtrl.checkEmailTipActive();
            G.NoticeCtrl.checkEmail();
        }
    }


    /**
    * 截取邮件数目信息
    * @param msg
    *
    */
    private _onMailNumberNotify(body: Protocol.Mail_MailNumber_Notify): void {
        G.DataMgr.mailData.numMail = body.m_ushMailNumber;
    }



    /**邮件列表变更通知*/
    private _onMailChangeNotify(body: Protocol.Mail_ListChange_Notify): void {
        G.DataMgr.mailData.numMail += body.m_ushNewMailNumber;
        //邮件变更把新的邮件加入到邮件列表
        let newMailMemos = body.m_astNewMailMemo;
        let mailList = G.DataMgr.mailData.mailList;
        let notRedEmails = G.DataMgr.mailData.notRedEmails;
        for (let i = 0; i < newMailMemos.length; i++) {
            let data = newMailMemos[i];
            if (!G.DataMgr.mailData.checkEmailListIsHasThisMail(data.m_uiMailID)) {
                mailList.push(data);
            }
            if (!G.DataMgr.mailData.checkNotRedEmailsHasThisMail(data.m_uiMailID)) {
                notRedEmails.push(data);
            }
        }
        //展示新邮件提示
        G.ViewCacher.mainView.mainChatCtrl.checkEmailTipActive();
        G.NoticeCtrl.checkEmail();
    }


}
