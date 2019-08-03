import { UnitCtrlType } from './../../constants/GameEnum';
import { ActHomeView } from "System/activity/actHome/ActHomeView";
import { ExchangeView } from "System/business/view/ExchangeView";
import { EnumStoreID } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { JdyjItemData } from "System/data/vo/JdyjItemData";
import { Global as G } from "System/global";
import { TianMingBangRewardView } from "System/pinstance/selfChallenge/TianMingBangRewardView";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager";
import { MessageBox } from "System/uilib/MessageBox"
import { IconItem } from "System/uilib/IconItem";
import { TabSubForm } from "System/uilib/TabForm";
import { ElemFinder } from "System/uilib/UiUtility";
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar";
import { Color } from "System/utils/ColorUtil";
import { CompareUtil } from "System/utils/CompareUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";
import { VipView } from "System/vip/VipView";
import { Constants } from "../../constants/Constants";

class TianMingBangRoleItem {
    clickGo: UnityEngine.GameObject;
    private roleName: UnityEngine.UI.Text;
    private rank: UnityEngine.UI.Text;
    private roleZdl: UnityEngine.UI.Text;

    private roleInfo: Protocol.OneRolePvpInfoCli;
    crtRoleID: Protocol.RoleID;
    private roleAvatar: UIRoleAvatar;
    private modelCtn: UnityEngine.Transform;
    private fightImg:UnityEngine.GameObject;
    private hunhuanRoot:UnityEngine.GameObject;
    setUsual(go: UnityEngine.GameObject) {
        this.clickGo = ElemFinder.findObject(go, 'click');
        this.roleName = ElemFinder.findText(go, 'name');
        this.rank = ElemFinder.findText(go, 'rank');
        this.roleZdl = ElemFinder.findText(go, 'zdlText');
        this.modelCtn = ElemFinder.findTransform(go, 'modelCtn');
        this.fightImg = ElemFinder.findObject(go,'Image');
        this.hunhuanRoot = ElemFinder.findObject(go,'hunhuanRoot');
        Game.UIClickListener.Get(this.clickGo).onClick = delegate(this, this.onRoleItemClick);
    }

    destroy() {
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }

    update(roleInfo: Protocol.OneRolePvpInfoCli, sortingOrder: number,hunhuanId:number) {
        this.roleInfo = roleInfo;
        this.rank.text = uts.format('第{0}名', roleInfo.m_shRankVal);
        this.roleZdl.text = "战斗力"+roleInfo.m_iFightVal;

        if (null != this.crtRoleID && CompareUtil.isRoleIDEqual(this.crtRoleID, roleInfo.m_stRoleID)) {
            return;
        }
        this.crtRoleID = roleInfo.m_stRoleID;
        this.roleName.text = roleInfo.m_szNickName;
        // this.roleName.color = Color.toUnityColor(KeyWord.GENDERTYPE_BOY == roleInfo.m_cGender ? Color.BOY : Color.GIRL);
        if (null == this.roleAvatar) {
            this.roleAvatar = new UIRoleAvatar(this.modelCtn, this.modelCtn);
            this.roleAvatar.setRenderLayer(5);
            this.roleAvatar.setSortingOrder(sortingOrder);
            this.roleAvatar.hasWing = true;
        }
        //如果是自己，就弹框提示不能挑战
        if (CompareUtil.isRoleIDEqual(this.roleInfo.m_stRoleID, G.DataMgr.heroData.roleID)) {
            this.fightImg.SetActive(false);
        }
        this.roleAvatar.setAvataByList(roleInfo.m_stAvatarList, roleInfo.m_cProfession, roleInfo.m_cGender);
        //魂环
        if (hunhuanId > 0) {
            let config = G.DataMgr.hunliData.getHunHuanConfigById(hunhuanId);
            let url = config.m_iModelID.toString();
            G.ResourceMgr.loadModel(this.hunhuanRoot.gameObject, UnitCtrlType.reactive, uts.format("model/hunhuan/{0}/{1}.prefab", url, url), sortingOrder);
        }
    }

    private onRoleItemClick() {
        
        if (null == this.roleInfo || CompareUtil.isRoleIDEqual(this.roleInfo.m_stRoleID, G.DataMgr.heroData.roleID)) {
            return;
        }

        if (G.DataMgr.heroData.myPPkRemindTimes <= 0) {
            G.TipMgr.addMainFloatTip('您今日的挑战次数已用完，请购买再挑战。');
            return;
        }

        if (!G.ActionHandler.checkMatchingStatus(true)) {
            return;
        }

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPvpStartPkRequest(this.roleInfo.m_shRankVal));
    }
}

export class TianMingBangPanel extends TabSubForm {

    /**默认可购买次数*/
    private static readonly _DEFAULT_BUYTIME: number = 3;
    /**分钟转秒数*/
    private static readonly _8MINUTE2SECOND: number = 480;

    /**最大挑战次数*/
    private static readonly _MAX_CHALLENGE_TIME: number = 5;

    /**购买次数时,花费绑定元宝是非绑定元宝的5倍*/
    private  _YUANBAO_BING_MULTIPLE: number = 5;

    /**购买一次挑战次数所花费的绑元*/
    private static readonly _BANGYUAN_TO_BUYTIMES: number = 200;

    private static readonly _MAX_PK_PLAYER_NUMBER: number = 3;

    /**面板左上角战斗力*/
    private fightText: UnityEngine.UI.Text;

    private roles: TianMingBangRoleItem[] = [];

    private myRankText: UnityEngine.UI.Text;
    private myZdlText: UnityEngine.UI.Text;
    private myTimesText: UnityEngine.UI.Text;
    //private countDownText: UnityEngine.UI.Text;
    private btnBuyTimes: UnityEngine.GameObject;
    private btnShowReward: UnityEngine.GameObject;
    private btnRefresh: UnityEngine.GameObject;
    private btnShop: UnityEngine.GameObject;

    private tipMark: UnityEngine.GameObject;

    private listData: JdyjItemData[] = [];
    private rewardIconItems: IconItem[] = [];
    private maxRewardItems: IconItem[] = [];
    private itemGrey: boolean[] = [];
    //用来存购买一次挑战次数花费的元宝数量
    private costYuanBao: number;
    /**重置时间*/
    //private m_cd: number = 0;

    /**倒计时*/
    //private m_tickTime: number = 0;

    /**购买次数*/
    // private m_buyTimes: number = 0;

    /**自动购买*/
    // private static m_isAutoBuy = false;
    private noTimes:UnityEngine.GameObject;
    private noReward:UnityEngine.GameObject;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_TIANMINGBANG);
    }

    protected resPath(): string {
        return UIPathData.TianMingBangView;
    }

    protected initElements() {
        this._YUANBAO_BING_MULTIPLE=Constants.SummonBindRate;
        // 3个角色
        for (let i: number = 0; i < TianMingBangPanel._MAX_PK_PLAYER_NUMBER; i++) {
            let roleItem = new TianMingBangRoleItem();
            let itemGo = this.elems.getElement('role' + i);
            roleItem.setUsual(itemGo);
            this.roles.push(roleItem);
        }
        // 面板左上角战斗力
        this.fightText = this.elems.getText('fightText');
        // 我的排名
        this.myRankText = this.elems.getText('textMyRank');
        // 我的战斗力
        this.myZdlText = this.elems.getText('zdlText');

        // 挑战次数
        this.myTimesText = this.elems.getText('textMyTimes');

        this.btnBuyTimes = this.elems.getElement("btnBuyTimes");

        // 查看奖励
        this.btnShowReward = this.elems.getElement('btnShowReward');
        // 换一批
        this.btnRefresh = this.elems.getElement('btnRefresh');
        UIUtils.setButtonClickAble(this.btnRefresh, false);
        this.noTimes = ElemFinder.findObject(this.btnBuyTimes, 'noTimes');
        this.noReward = ElemFinder.findObject(this.btnShowReward, 'noReward');

        this.btnShop = this.elems.getElement('btnShop');

        this.tipMark = this.elems.getElement('tipMark');
    }
    protected onDestroy() {
        for (let i: number = 0; i < TianMingBangPanel._MAX_PK_PLAYER_NUMBER; i++) {

            this.roles[i].destroy();
        }
    }

    protected initListeners() {
        this.addClickListener(this.btnShowReward, this.onBtnShowRewardClick);
        this.addClickListener(this.btnRefresh, this.onBtnRefreshClick);
        this.addClickListener(this.btnBuyTimes, this.onBtnBuyTimesClick);
        this.addClickListener(this.btnShop, this.onBtnShopClick);
    }

    protected onOpen() {
        // 打开时拉取进度
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenPvpPanelRequest());
    }

    protected onClose() {

    }

    private onBtnShopClick() {
        G.Uimgr.createForm<ExchangeView>(ExchangeView).open(EnumStoreID.MALL_HONNOR);
        G.Uimgr.bindCloseCallback(ExchangeView, ActHomeView, this.id);
    }

    /**
	* 刷新面板
	*
	*/
    updateByResponse(response: Protocol.PVPRank_CS_Response): void {
        if (response.m_usType == Macros.PVPRANK_OPEN_PANEL) {
            let openPanelRes: Protocol.CSOpen_Panel_Response = response.m_stValue.m_stCSOpenPanelRes;
            // this.m_buyTimes = openPanelRes.m_shBuyTimes;
            // this.m_tickTime = openPanelRes.m_uiTickTime;
            // if (openPanelRes.m_bGetReward) {
            // } else {
            //     this.noReward.SetActive(false);
            // }
            let myRank: number = openPanelRes.m_shMyRankVal;
            let myFight: number = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
            if (myRank > 0) {
                this.myRankText.text = myRank.toString();
            } else {
                this.myRankText.text = '未上榜';
            }
            this.fightText.text = '战斗力 '+myFight.toString();
            this.myZdlText.text = myFight.toString();

            UIUtils.setButtonClickAble(this.btnRefresh, true);

            //对手的信息
            let roleList = openPanelRes.m_astRole;
            //排名从低到高
            if (roleList.length > TianMingBangPanel._MAX_PK_PLAYER_NUMBER) {
                roleList.length = TianMingBangPanel._MAX_PK_PLAYER_NUMBER;
            }
            let displayRoles: Protocol.OneRolePvpInfoCli[] = [];
            displayRoles.push(roleList[0]);
            for (let i = 1; i < TianMingBangPanel._MAX_PK_PLAYER_NUMBER; i++) {
                let processed = false;
                displayRoles.reverse();
                for (let j = 0; j < displayRoles.length; j++) {
                    if (roleList[i].m_shRankVal <= displayRoles[j].m_shRankVal) {
                        displayRoles.push(roleList[i]);
                        processed = true;
                        break;
                    }
                }
                displayRoles.reverse();
                if (!processed) {
                    displayRoles.push(roleList[i]);
                }
            }
            // 按照 3 - 1 - 2的名次排列
            let displaySeq = [2, 0, 1];
            for (let i = 0; i < TianMingBangPanel._MAX_PK_PLAYER_NUMBER; i++) {
                let roleInfo = displayRoles[displaySeq[i]];
                let hunhuanId = roleInfo.m_stAvatarList.m_uiHunHuanID;
                this.roles[i].update(roleInfo, this.sortingOrder,hunhuanId);
            }
        }
        //else if (response.m_usType == Macros.PVPRANK_BUY_TIMES) {
        //    let buyTimeRes: Protocol.CSBuy_Times_Response = response.m_stValue.m_stCSBuyTimesRes;

        //    this.m_buyTimes = buyTimeRes.m_shBuyTimes;
        //    this.m_tickTime = buyTimeRes.m_uiTickTime;
        //}

        this._updateView();
    }

    private _updateView(): void {
        let remainTime = G.DataMgr.heroData.myPPkRemindTimes;
        this.myTimesText.text = uts.format('{0}/{1}', TextFieldUtil.getColorText(remainTime.toString(), remainTime > 0 ? Color.GREEN : Color.RED),
            TextFieldUtil.getColorText(TianMingBangPanel._MAX_CHALLENGE_TIME.toString(), Color.GREEN));

        //挑战次数不满时开始计时
        if (remainTime > 0) {
            this.noTimes.SetActive(false);
        }
        else {
            this.noTimes.SetActive(true);
        }
        let canGetReward = G.DataMgr.activityData.allrankRewardCont > 0;
        let rankReward = G.DataMgr.activityData.RankReward>0;
        this.noReward.SetActive(!canGetReward&&!rankReward);
        this.tipMark.SetActive(canGetReward||rankReward);
    }


    private getTotalBuyTimes(lv: number = -1): number {
        if (lv == -1) {
            lv = G.DataMgr.heroData.curVipLevel;
        }

        if (lv <= 0) {
            return TianMingBangPanel._DEFAULT_BUYTIME;
        }
        else {
            return G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_PVPRANK_BUYTIMES, lv);
        }
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onBtnRefreshClick() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenPvpPanelRequest());
    }

    private onBtnShowRewardClick() {
        G.Uimgr.createForm<TianMingBangRewardView>(TianMingBangRewardView).open();
    }

    private onBtnBuyTimesClick() {
        //获取的 拥有的绑定元宝
        let ownYuanBaoBing = G.DataMgr.getOwnValueByID(KeyWord.MONEY_YUANBAO_BIND_ID);
        //获取的 购买一次需要的元宝数量
        let costYuanBao = G.DataMgr.constData.getValueById(KeyWord.BUY_PVPRANK_PRICE);
        //如果没获取到数据,return
        if (null == ownYuanBaoBing || null == costYuanBao) return;
        this.costYuanBao = costYuanBao;
        //购买一次需要的绑定元宝数量
        let costYuanBaoBing = costYuanBao * this._YUANBAO_BING_MULTIPLE;
        
        if (ownYuanBaoBing >= costYuanBaoBing) {
            this.showConfirm(TextFieldUtil.getGoldBindText(costYuanBaoBing), false);
        } else {
            this.showConfirm(TextFieldUtil.getYuanBaoText(costYuanBao), true);
        }
     
    }
    //yuanBaoType  false为绑定元宝,true为元宝
    private showConfirm(text: string, yuanBaoType: boolean) {
        //uts.format('花费{0}购买1次挑战次数', text)
        G.TipMgr.showConfirm(uts.format('', text), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onBuyChallenge, yuanBaoType),0,0,false,true);

    }

    private _onCompleteRefresh(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenPvpPanelRequest());
    }

    private onBuyChallenge(state: MessageBoxConst, isCheckSelected: boolean, yuanBaoType: boolean): void {
        if (MessageBoxConst.yes == state) {
            //G.ModuleMgr.businessModule.directBuy(KeyWord.MONEY_YUANBAO_BIND_ID, this.numInput.num, this.selectedItemData.sellConfig.m_iStoreID, this.m_currencyID, sellConfig.m_ucAmount, false, 0);
            if (G.DataMgr.heroData.myPPkRemindTimes == 5) {
                G.TipMgr.addMainFloatTip('次数已满不可购买');
            } else {
                this.doBuyTimes(yuanBaoType);
            }
        }
    }

    private onUpMonthVip(state: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == state) {
            G.Uimgr.createForm<VipView>(VipView).open();
        }
    }

    private doBuyTimes(yuanBaoType: boolean): void {
        //发送购买协议
        let message = G.Uimgr.createForm<MessageBox>(MessageBox, true);
        let buyCounts: number;
        if (message != null) {
            buyCounts = message.numInput.num;
        } 
        if (!yuanBaoType && 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_BIND_ID, this.costYuanBao * this._YUANBAO_BING_MULTIPLE, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPvpBuyTimeRequest(buyCounts));
        } else if (yuanBaoType && 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.costYuanBao, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPvpBuyTimeRequest(buyCounts));
        }
    }
}