import { Global as G } from "System/global"
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { List, ListItem } from 'System/uilib/List'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { UIUtils } from 'System/utils/UIUtils'
import { FriendView } from 'System/friend/FriendView'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { PriceBar } from 'System/business/view/PriceBar'
import { OneMailDetail } from 'System/data/MailData'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { ThingData } from 'System/data/thing/ThingData'
import { ElemFinder } from 'System/uilib/UiUtility'
import { FriendViewTab } from 'System/friend/FriendView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'

class EmailItem extends ListItemCtrl {

    private item: UnityEngine.GameObject;
    /**邮件标题*/
    private emailTitle: UnityEngine.UI.Text;
    /**发件时间*/
    private timeText: UnityEngine.UI.Text;
    /**已读,未读标志*/
    private noRedIcon: UnityEngine.GameObject;
    private hasRedIcon: UnityEngine.GameObject;
    /**礼包标志*/
    private giftIcon: UnityEngine.GameObject;
    private mailId: number = 0;
    /**复选框*/
    private box: UnityEngine.GameObject;
    private btNormalStage: UnityEngine.GameObject;
    private btSelectedStage: UnityEngine.GameObject;


    setComponents(go: UnityEngine.GameObject, id: number) {
        this.item = go;
        this.mailId = id;

        this.emailTitle = ElemFinder.findText(go, 'title');
        this.timeText = ElemFinder.findText(go, 'time');
        this.noRedIcon = ElemFinder.findObject(go, 'noRead');
        this.hasRedIcon = ElemFinder.findObject(go, 'hasRed');
        this.giftIcon = ElemFinder.findObject(go, 'libao');
        this.box = ElemFinder.findObject(go, 'box');
        Game.UIClickListener.Get(this.box).onClick = delegate(this, this.onToggleChange);
        this.btNormalStage = ElemFinder.findObject(this.box, 'normal');
        this.btSelectedStage = ElemFinder.findObject(this.box, 'selected');
    }

    update(data: Protocol.MailMemo) {
        this.emailTitle.text = RegExpUtil.xlsDesc2Html(data.m_szTitle);
        this.timeText.text = DataFormatter.second2hhmmss(data.m_uiTimestamp, true);
        //邮件是否已读
        let noRed = (data.m_ucReadFlag == 0);
        this.hasRedIcon.SetActive(!noRed);
        this.noRedIcon.SetActive(noRed);
        //邮件是否有礼包
        if (data.m_uiAccessoryBitmap != 0) {
            //为奖励邮件
            EmailPanel.bitMapNum++;
            this.giftIcon.SetActive(true);
            this.box.gameObject.SetActive(true);
            this.btNormalStage.SetActive(true);
            this.btSelectedStage.SetActive(false);
        } else {
            this.giftIcon.SetActive(false);
            this.box.gameObject.SetActive(false);
        }
    }


    private onToggleChange() {
        let emailPanel = G.Uimgr.getSubFormByID<EmailPanel>(FriendView, FriendViewTab.EmailPanel);
        if (this.btSelectedStage.activeSelf) {
            this.btNormalStage.SetActive(true);
            this.btSelectedStage.SetActive(false);
            for (let i = 0; i < emailPanel.leftNotSendEmailIds.length; i++) {
                if (this.mailId == emailPanel.leftNotSendEmailIds[i]) {
                    emailPanel.leftNotSendEmailIds.splice(i, 1);
                    break;
                }
            }
        } else {
            this.btNormalStage.SetActive(false);
            this.btSelectedStage.SetActive(true);
            emailPanel.leftNotSendEmailIds.push(this.mailId);
        }
    }

}


/**为好友界面下的子界面*/
export class EmailPanel extends TabSubForm {

    static bitMapNum: number = 0;
    leftNotSendEmailIds: number[] = [];
    m_btnGetAll: UnityEngine.GameObject;

    private m_btnGet: UnityEngine.GameObject;
    private m_yuanbao: PriceBar;
    private m_yuanbaoIcon: UnityEngine.GameObject;
    private m_bindYuanbao: PriceBar;
    private m_bindYuanbaoIcon: UnityEngine.GameObject;
    private mailList: List;
    private nowSelectedMailId: number = 0;
    private selectedData: OneMailDetail;
    private m_rewardIconDatas: RewardIconItemData[] = [];
    private iconParent: UnityEngine.GameObject;
    private emailContentText: UnityEngine.UI.Text;
    private emailTitleText: UnityEngine.UI.Text;
    private senderText: UnityEngine.UI.Text;
    /**最大奖励物品个数*/
    private max_rewardCount = 7;
    private itemIcon_Normal: UnityEngine.GameObject;
    private rewardIconItems: IconItem[] = [];
    private openMailId: number = 0;
    private btnSelectAll: UnityEngine.GameObject;
    private mailItems: EmailItem[] = [];
    private isFirstOpen: boolean = true;
    private mailGetStage: { [mailId: number]: boolean } = {};
    private needCheak: boolean = false;
    private mailMemos: Protocol.MailMemo[] = [];

    constructor() {
        //如果这个按钮在主界面上有入口，需要在super中传入入口按钮的关键字
        super(FriendViewTab.EmailPanel);
    }

    protected resPath(): string {
        return UIPathData.EmailPanel;
    }

    protected initElements() {
        this.mailList = this.elems.getUIList("mailList");
        this.iconParent = this.elems.getElement('iconParent');
        this.emailContentText = this.elems.getText('emailContent');
        this.emailTitleText = this.elems.getText('titleText');
        this.m_yuanbaoIcon = this.iconParent.transform.Find("yuanbaoBack/icon").gameObject;
        this.m_bindYuanbaoIcon = this.iconParent.transform.Find("bangdingyuanbaoBack/icon").gameObject;
        this.m_btnGet = this.elems.getElement("btn_lingqu");
        this.m_btnGetAll = this.elems.getElement("btn_root");
        this.senderText = this.elems.getText("senderText");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.btnSelectAll = this.elems.getElement('btn_selectAll');
        for (let i = 0; i < this.max_rewardCount; i++) {
            let iconItem = new IconItem();
            let obj = ElemFinder.findObject(this.iconParent.transform.Find("itemList").gameObject, i.toString());
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, obj);
            iconItem.setTipFrom(TipFrom.normal);
            this.rewardIconItems.push(iconItem);
        }
        this.m_yuanbao = new PriceBar();
        this.m_yuanbao.setComponents(this.m_yuanbaoIcon);
        this.m_yuanbao.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);
        this.m_bindYuanbao = new PriceBar();
        this.m_bindYuanbao.setComponents(this.m_bindYuanbaoIcon);
        this.m_bindYuanbao.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);
    }

    protected initListeners() {
        this.addListClickListener(this.mailList, this.onClickMailList);
        this.addClickListener(this.m_btnGet, this.onClickBtnGet);
        this.addClickListener(this.m_btnGetAll, this.onClickGetAll);
        this.addClickListener(this.btnSelectAll, this.onAllSelectAll)
    }

    open(roleAbstracts: RoleAbstract[] = null, emailId: number = 0) {
        this.openMailId = emailId;
        super.open();
    }

    protected onOpen() {
        this.mailMemos = G.DataMgr.mailData.mailList;
        UIUtils.setButtonClickAble(this.m_btnGetAll, false);
        this.isFirstOpen = true;
        this.updateMailList();
        this.onAllSelectAll();
    }

    protected onClose() {
        this.openMailId = 0;
        this.leftNotSendEmailIds.length = 0;
    }

    /**刷新邮件列表(response回来后还需检查是否有未一键领取完的邮件)*/
    updateMailList(isGetBitMap: boolean = false) {
        EmailPanel.bitMapNum = 0;
        this.mailList.Count = this.mailMemos.length;
        for (let i = 0; i < this.mailMemos.length; i++) {
            let obj = this.mailList.GetItem(i);
            let mailItem = this.getMailItem(i, obj.gameObject, this.mailMemos[i].m_uiMailID);
            mailItem.update(this.mailMemos[i]);
            let mailId = this.mailMemos[i].m_uiMailID;
            for (let index = 0; index < this.leftNotSendEmailIds.length; index++) {
                if (mailId == this.leftNotSendEmailIds[index]) {
                    obj.findObject('box/selected').SetActive(true);
                    obj.findObject('box/normal').SetActive(false);
                    break;
                }
            }
        }
        if (isGetBitMap || this.isFirstOpen) {
            this.judgeIsHasLeftRootEmail(isGetBitMap);
        }
        UIUtils.setButtonClickAble(this.m_btnGetAll, EmailPanel.bitMapNum > 0);
    }

    /**刷新邮件内容*/
    updateContent() {
        this.selectedData = G.DataMgr.mailData.getMailDataById(this.nowSelectedMailId);
        if (this.selectedData != null) {
            this.updatePanel();
        }
        if (!this.needCheak)
            return;
        if (this.leftNotSendEmailIds.length > 0) {
            //存在还没发送的领取邮件
            let id = this.leftNotSendEmailIds[0];
            for (let i = 0; i < this.mailMemos.length; i++) {
                if (id == this.mailMemos[i].m_uiMailID) {
                    this.onAutoSendGetMail(id);
                    break;
                }
            }
        }
    }




    /**判断是否有一键选取的邮件还没领取(后台不支持一次领完,规则为领取了回来在发另一封)*/
    private judgeIsHasLeftRootEmail(isGetBitMap: boolean = false) {
        if (this.leftNotSendEmailIds.length > 0) {
            //存在还没发送的领取邮件(先拉取邮件内容)
            this.checkAutoSendMail(this.leftNotSendEmailIds[0]);
        } else {
            //不存在剩余没有领取的后领完直接默认选中第一个即可
            if (this.mailList.Count == 0) {
                this.clearPanel();
                return;
            }
            if (this.isFirstOpen && this.openMailId != 0) {
                //存在需要指定打开的邮件
                this.checkAutoSendMail(this.openMailId);
                this.isFirstOpen = false;
                this.openMailId = 0;
                return;
            }
            if (this.isFirstOpen) {
                this.onSelectedMailListItem(0);
                this.isFirstOpen = false;
                return;
            }
            this.senderText.text = "系统";
            if (isGetBitMap) {
                this.needCheak = false;
                this.onSelectedMailListItem(0);
            }
        }
    }


    private getMailItem(index: number, obj: UnityEngine.GameObject, id: number): EmailItem {
        if (index < this.mailItems.length) {
            return this.mailItems[index];
        } else {
            let item = new EmailItem();
            item.setComponents(obj, id);
            this.mailItems.push(item);
            return item;
        }
    }


    /**一键全选按钮*/
    private onAllSelectAll() {
        this.setMailListToggleStage(true);
    }

    private setMailListToggleStage(toggleIsOn: boolean) {
        for (let i = 0; i < this.mailList.Count; i++) {
            let item = this.mailList.GetItem(i);
            let box = item.findObject('box');
            let normal = item.findObject('box/normal');
            let selected = item.findObject('box/selected');
            if (box.activeSelf) {
                normal.SetActive(!toggleIsOn);
                selected.SetActive(toggleIsOn);
                let mailId = this.mailMemos[i].m_uiMailID;
                let needPush = true;
                for (let i = 0; i < this.leftNotSendEmailIds.length; i++) {
                    if (toggleIsOn) {
                        if (mailId == this.leftNotSendEmailIds[i]) {
                            needPush = false;
                            break;
                        }
                    } else {
                        if (mailId == this.leftNotSendEmailIds[i]) {
                            this.leftNotSendEmailIds.splice(i, 1);
                            needPush = false;
                            break;
                        }
                    }
                }
                if (needPush) {
                    this.leftNotSendEmailIds.push(mailId);
                }
            }
        }
    }


    private onSelectedMailListItem(index: number) {
        this.mailList.Selected = index;
        this.mailList.ScrollByAxialRow(index);
        this.onClickMailList(index);
    }

    private clearPanel() {
        this.mailList.Selected = -1;
        UIUtils.setButtonClickAble(this.m_btnGet, false);
        UIUtils.setButtonClickAble(this.m_btnGetAll, false);
        this.emailTitleText.text = "";
        this.emailContentText.text = "";
        this.senderText.text = "";
        for (let i = 0; i < this.max_rewardCount; i++) {
            this.rewardIconItems[i].updateByRewardIconData(null);
            this.rewardIconItems[i].updateIcon();
        }
        this.m_yuanbao.setPrice(0);
        this.m_bindYuanbao.setPrice(0);
    }


    private onClickMailList(index: number) {
        let obj = this.mailList.GetItem(index);
        let data = G.DataMgr.mailData.mailList[index];
        let btnStage = (data.m_uiAccessoryBitmap != 0);
        UIUtils.setButtonClickAble(this.m_btnGet, btnStage);
        this.nowSelectedMailId = data.m_uiMailID;
        //已经拉取的显示内容即可
        if (this.mailGetStage[this.nowSelectedMailId]) {
            this.updateContent();
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMailFetchMailRequestMsg(this.nowSelectedMailId));
        this.mailGetStage[this.nowSelectedMailId] = true;
    }


    private updatePanel(): void {
        let mailData = G.DataMgr.mailData;
        if (this.selectedData.mailId == 0) {
            UIUtils.setButtonClickAble(this.m_btnGet, false);
            UIUtils.setButtonClickAble(this.m_btnGetAll, false);
            return;
        }
        this.senderText.text = '系统';
        if ((this.selectedData.content != "" && this.selectedData.content != null)) {
            this.emailContentText.text = RegExpUtil.xlsDesc2Html(this.selectedData.content);
        }
        this.emailTitleText.text = RegExpUtil.xlsDesc2Html(this.selectedData.title);
        let rewardList: Protocol.SimItem[] = this.selectedData.rewardList;
        let yuanbaoCnt = 0;
        let bindYuanbaoCnt = 0;
        this.m_rewardIconDatas.length = 0;
        for (let i = 0; i < this.selectedData.rewardCount; i++) {
            let itemId = rewardList[i].iItemID;
            if (GameIDUtil.isDropID(itemId)) {
                let itemList: GameConfig.DropThingM[] = UIUtils.getDropRewardList(rewardList[2].iItemID);
                for (let i = 0; i < itemList.length; i++) {
                    let item = itemList[i];
                    let d = new RewardIconItemData();
                    d.id = item.m_iDropID;
                    d.number = item.m_uiDropNumber;
                    this.m_rewardIconDatas.push(d);
                }
            } else {
                let d = new RewardIconItemData();
                d.id = itemId;
                d.number = rewardList[i].iItemNum;
                this.m_rewardIconDatas.push(d);
            }
        }
        for (let i = this.m_rewardIconDatas.length - 1; i >= 0; i--) {
            let d = this.m_rewardIconDatas[i];
            if (KeyWord.OSS_CHARGE_VALUE == d.id || KeyWord.OSS_COST_VALUE == d.id) {
                this.m_rewardIconDatas.splice(i, 1);
            } else if (d.id == KeyWord.MONEY_YUANBAO_ID) {
                this.m_yuanbao.setPrice(d.number);
                this.m_rewardIconDatas.splice(i, 1);
            } else if (d.id == KeyWord.MONEY_YUANBAO_BIND_ID) {
                this.m_bindYuanbao.setPrice(d.number);
                this.m_rewardIconDatas.splice(i, 1);
            }
        }

        let cnt = this.m_rewardIconDatas.length;
        for (let i = 0; i < this.max_rewardCount; i++) {
            if (i < cnt) {
                this.rewardIconItems[i].updateByRewardIconData(this.m_rewardIconDatas[i]);
            } else {
                this.rewardIconItems[i].updateByRewardIconData(null);
            }
            this.rewardIconItems[i].updateIcon();
        }
    }

    /**单个领取*/
    private onClickBtnGet(): void {
        this.onAutoSendGetMail(this.nowSelectedMailId);
    }

    /**一键领取*/
    private onClickGetAll(): void {
        if (this.leftNotSendEmailIds.length > 0) {
            this.needCheak = true;
            this.checkAutoSendMail(this.leftNotSendEmailIds[0]);
        } else {
            G.TipMgr.addMainFloatTip('请勾选需要选中的邮件');
        }
    }


    private checkAutoSendMail(id: number) {
        for (let i = 0; i < this.mailMemos.length; i++) {
            if (id == this.mailMemos[i].m_uiMailID) {
                this.onSelectedMailListItem(i);
                break;
            }
        }
    }

    /**自动领取*/
    private onAutoSendGetMail(id: number) {
        let mailData = G.DataMgr.mailData.getMailDataById(id);
        if (mailData == null) {
            return;
        }
        if (G.DataMgr.thingData.getRemainNum(Macros.CONTAINER_TYPE_ROLE_BAG) >= (mailData.rewardCount - 2)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMailPickAccessoryRequestMsg(id));
            for (let i = 0; i < this.leftNotSendEmailIds.length; i++) {
                if (id == this.leftNotSendEmailIds[i]) {
                    this.leftNotSendEmailIds.splice(i, 1);
                    break;
                }
            }
        }
        else {
            G.TipMgr.addMainFloatTip('背包空间不足');
        }
    }

}
