import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { UIPathData } from "System/data/UIPathData"
import { FriendPanel } from 'System/friend/FriendPanel'
import { SearchFriendPanel } from 'System/friend/SearchFriendPanel'
import { EmailPanel } from 'System/friend/EmailPanel'
import { TabForm } from "System/uilib/TabForm"
import { Global as G } from "System/global"
import { KeyWord } from 'System/constants/KeyWord'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { YiJianFanKuiPanel } from 'System/friend/YiJianFanKuiPanel'

export enum FriendViewTab {
    /**好友面板*/
    FriendPanel = 1,
    /**查询好友面板*/
    SearchFriendPanel = 2,
    /**邮件面板*/
    EmailPanel = 3,
    /**一键反馈*/
    YiJianFanKuiPanel = 4,
}


/**该界面为(好友,搜索好友,邮件面板的父面板)*/
export class FriendView extends TabForm {

    private openTabId: number = 0;

    /**面板顶部group*/
    private topGroup: UnityEngine.UI.ActiveToggleGroup = null;

    private openAbstracts: RoleAbstract[] = [];

    profAltas: Game.UGUIAltas = null;

    private openEmailId: number = 0;

    constructor() {
        super(KeyWord.SUBBAR_FUNCTION_HAOYOU, FriendPanel, SearchFriendPanel, EmailPanel, YiJianFanKuiPanel);
    }

    /**param openTab 即各个panel的id*/
    open(openTabId: number = 0, roleAbstracts: RoleAbstract[] = null, emailId: number = 0) {
        this.openTabId = openTabId;
        this.openAbstracts = roleAbstracts;
        this.openEmailId = emailId;
        super.open();
    }


    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.FriendView;
    }

    protected initElements() {
        super.initElements();
        this.profAltas = ElemFinderMySelf.findAltas(this.elems.getElement("altas"));
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.elems.getElement("btn_close"), this.onClickCloseBt);
        this.addClickListener(this.elems.getElement('mask'), this.onClickCloseBt);
        this.addClickListener(this.elems.getElement("btnTitle"), this.onClickTitle);
    }

    protected onOpen() {
        super.onOpen();
        this.switchTabFormById(this.openTabId, this.openAbstracts, this.openEmailId);
        this.updateEmailTipMark();
    }

    protected onClose() {
        super.onClose();
        //表情面板关闭
        if (G.ViewCacher.emoijPanel.isOpened)
            G.ViewCacher.emoijPanel.close();
    }

    private onClickCloseBt() {
        let emoijPanel = G.ViewCacher.emoijPanel;
        if (emoijPanel.isOpened && emoijPanel.chatToolPanelRect.anchoredPosition.y == 0) {
            emoijPanel.chatToolPanelAnimator.Play("BQdown");
            emoijPanel.timeOut();
            return;
        }
        this.close();
    }


    updateEmailTipMark() {
        let mailData = G.DataMgr.mailData;
        this.setTabTipMarkById(FriendViewTab.EmailPanel, mailData.checkEmailBitMap() || mailData.checkEmailHasNotRed());
    }


    /**点击标题“频道”按钮 */
    private onClickTitle() {
        G.ViewCacher.chatView.open();
        this.close();
    }

}
