import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { List } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { WhjxRewardView } from 'System/activity/whjx/WhjxRewardView'
import { TipFrom } from 'System/tip/view/TipsView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { WhjxBaseLogic } from 'System/activity/whjx/WhjxBaseLogic'

class WhjxSignUpPlayerItem extends ListItemCtrl {
    private textName: UnityEngine.UI.Text;

    private bg2: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.textName = ElemFinder.findText(go, 'textName');

        this.bg2 = ElemFinder.findObject(go, 'bg2');
    }

    update(info: Protocol.CSWHJXRankRole, index: number) {
        this.textName.text = info.m_szNickName;
        this.bg2.SetActive(index % 2 == 0);
    }
}

/**
 * 能力叛乱报名
 * GM: //setrole sundry whjx_self 1 设置报名
 * GM: //setrole sundry whjx_self 0 设置未报名
 * GM: //setrole sundry whjx_zone 清空当前服游戏数据
 */
export class WhjxSignUpLogic extends WhjxBaseLogic {
    private giftId = 0;
    private giftIdBind = 0;

    private giftPrice = 0;
    private giftPriceBind = 0;

    /**报名玩家列表*/
    private playerList: List;
    private playerItems: WhjxSignUpPlayerItem[] = [];

    /**钻石报名按钮。*/
    private btnSignUp: UnityEngine.GameObject;
    private iconItem: IconItem;
    //private textLabelSignUp: UnityEngine.UI.Text;
    /**绑定钻石报名按钮。*/
    private btnSignUpBind: UnityEngine.GameObject;
    private iconItemBind: IconItem;
    //private textLabelSignUpBind: UnityEngine.UI.Text;

    private btnReward: UnityEngine.GameObject;

    private textRule: UnityEngine.UI.Text;

    initElements(go: UnityEngine.GameObject, elems: UiElements) {
        super.initElements(go, elems);

        this.playerList = elems.getUIList('list');
        this.btnSignUp = elems.getElement('btnSignUp');
        this.btnSignUpBind = elems.getElement('btnSignUpBind');
        this.btnReward = elems.getElement('btnReward');

        this.giftId = G.DataMgr.constData.getValueById(KeyWord.PARAM_WHJX_LB_YB_ID);
        this.giftIdBind = G.DataMgr.constData.getValueById(KeyWord.PARAM_WHJX_LB_BIND_YB_ID);

        let itemIcon_Normal = elems.getElement('itemIcon_Normal');
        this.iconItem = new IconItem();
        this.iconItem.setTipFrom(TipFrom.normal);
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, elems.getElement('icon'));
        this.iconItem.updateById(this.giftId);
        this.iconItem.updateIcon();

        this.iconItemBind = new IconItem();
        this.iconItemBind.setTipFrom(TipFrom.normal);
        this.iconItemBind.setUsualIconByPrefab(itemIcon_Normal, elems.getElement('iconBind'));
        this.iconItemBind.updateById(this.giftIdBind);
        this.iconItemBind.updateIcon();

        this.giftPrice = G.DataMgr.constData.getValueById(KeyWord.PARAM_WHJX_LB_YB_PRICE);
        this.giftPriceBind = G.DataMgr.constData.getValueById(KeyWord.PARAM_WHJX_LB_BIND_YB_PRICE);

        //this.textLabelSignUp = elems.getText('textLabelSignUp');
        //this.textLabelSignUp.text = uts.format('{0}钻石', this.giftPrice);
        //this.textLabelSignUpBind = elems.getText('textLabelSignUpBind');
        //this.textLabelSignUpBind.text = uts.format('{0}绑钻', this.giftPriceBind);

        this.textRule = elems.getText('textRule');
    }

    initListeners() {
        super.initListeners();
        Game.UIClickListener.Get(this.btnSignUp).onClick = delegate(this, this.onClickBtnSignUp);
        Game.UIClickListener.Get(this.btnSignUpBind).onClick = delegate(this, this.onClickBtnSignUpBind);
        Game.UIClickListener.Get(this.btnReward).onClick = delegate(this, this.onclickBtnReward);
    }

    onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWangHouJiangXiangRequest(Macros.CROSS_WHJX_PANNLE, 0));
    }

    onPanelResponse() {
        let whjxData = G.DataMgr.activityData.whjxData;
        let panelInfo = whjxData.panelInfo;
        let cnt = 0;
        let buyId = panelInfo.m_iBuyItemID;
        if (null != panelInfo.m_stRankData) {
            cnt = panelInfo.m_stRankData.m_iCount;
        }
        this.playerList.Count = cnt;
        let oldCnt = this.playerItems.length;
        for (let i = 0; i < cnt; i++) {
            let item: WhjxSignUpPlayerItem;
            if (i < oldCnt) {
                item = this.playerItems[i];
            } else {
                this.playerItems.push(item = new WhjxSignUpPlayerItem());
                item.setComponents(this.playerList.GetItem(i).gameObject);
            }
            item.update(panelInfo.m_stRankData.m_stWHJXRoleList[i], i);
        }

        if (whjxData.hasBuyGift) {
            UIUtils.setButtonClickAble(this.btnSignUp, false);
            //this.textLabelSignUp.text = '已购买';
        } else {
            UIUtils.setButtonClickAble(this.btnSignUp, true);
            //this.textLabelSignUp.text = uts.format('{0}钻石', this.giftPrice);
        }

        if (whjxData.hasBuyGiftBind) {
            UIUtils.setButtonClickAble(this.btnSignUpBind, false);
            //this.textLabelSignUpBind.text = '已购买';
        } else {
            UIUtils.setButtonClickAble(this.btnSignUpBind, true);
            //this.textLabelSignUpBind.text = uts.format('{0}绑钻', this.giftPriceBind);
        }
    }

    onSignUpResponse() {
        this.onPanelResponse();
    }

    private onClickBtnSignUp() {
        //if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.giftPrice, true)) {
        //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWangHouJiangXiangRequest(Macros.CROSS_WHJX_BUY, Macros.WHJX_BUY_ITEM_BIT_2));
        //}
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWangHouJiangXiangRequest(Macros.CROSS_WHJX_BUY, Macros.WHJX_BUY_ITEM_BIT_2));
    }

    private onClickBtnSignUpBind() {
        //if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_BIND_ID, this.giftPriceBind, true)) {
        //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWangHouJiangXiangRequest(Macros.CROSS_WHJX_BUY, Macros.WHJX_BUY_ITEM_BIT_1));
        //}
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWangHouJiangXiangRequest(Macros.CROSS_WHJX_BUY, Macros.WHJX_BUY_ITEM_BIT_1));
    }

    private onclickBtnReward() {
        G.Uimgr.createForm<WhjxRewardView>(WhjxRewardView).open();
    }

    onTickTimer(timer: Game.Timer) {
        let activityData = G.DataMgr.activityData;
        let status = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_WHJX);
        let d = G.SyncTime.serverDate;
        let day = d.getDay();
        let rest = 0;
        if (day == 6) {
            // 周六显示报名截止倒计时
            rest = Math.max(0, Math.round((G.SyncTime.getNextTime(0, 0, 0) - d.getTime()) / 1000));
            this.textRule.text = uts.format('报名截止倒计时：\n{0}', DataFormatter.second2hhmmss(rest));
        } else if (day == 7) {
            // 周日显示活动开始倒计时
            if (null != status) {
                let tmpDate = G.SyncTime.tmpDate;
                tmpDate.setTime(status.m_iStartTime * 1000);
                if (tmpDate.getMonth() == d.getMonth() && tmpDate.getDate() == d.getDate()) {
                    // 说明活动还没开始
                    rest = Math.max(0, Math.round(status.m_iStartTime - d.getTime() / 1000));
                    this.textRule.text = uts.format('争夺开启倒计时：\n{0}', DataFormatter.second2hhmmss(rest));
                } else {
                    // 否则说明活动已结束
                    rest = Math.max(0, Math.round((G.SyncTime.getNextTime(0, 0, 0) / 1000 - d.getTime()) + (5 - d.getDay()) * 86400));
                    this.textRule.text = uts.format('下次报名倒计时：\n{0}', DataFormatter.second2day(rest));
                }
            }
        } else {
            // 其他情况显示下次报名倒计时
            let tmpDate = G.SyncTime.tmpDate;
            rest = Math.max(0, Math.round((6 - d.getDay()) * 86400 - (Math.round(d.getTime() / 1000) % 86400)));
            this.textRule.text = uts.format('下次报名开启：{0}', DataFormatter.second2day(rest));
        }
    }
}