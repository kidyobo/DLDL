import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { PinstanceData } from 'System/data/PinstanceData'
import { SxdscRankView } from 'System/pinstance/selfChallenge/SxdscRankView'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { Color } from 'System/utils/ColorUtil'
import { CompareUtil } from 'System/utils/CompareUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { VipData } from 'System/data/VipData'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { MallView } from 'System/business/view/MallView'
import { EnumStoreID } from 'System/constants/GameEnum'
import { VipView } from 'System/vip/VipView'
import { SxdscZhenRongView } from 'System/pinstance/selfChallenge/SxdscZhenRongView'
import { SiXiangData } from 'System/data/SiXiangData'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { ActHomeView } from 'System/activity/actHome/ActHomeView'

class SxdscRoleItem {
    clickGo: UnityEngine.GameObject;
    private roleName: UnityEngine.UI.Text;
    private rank: UnityEngine.UI.Text;

    private roleInfo: Protocol.CliColosseumOneRank;
    crtRoleID: Protocol.RoleID;
    private roleAvatar: UIRoleAvatar;
    private modelCtn: UnityEngine.Transform;

    setUsual(go: UnityEngine.GameObject, roleName: UnityEngine.UI.Text, modelCtn: UnityEngine.Transform) {
        this.clickGo = ElemFinder.findObject(go, 'click');
        this.roleName = roleName;
        this.rank = ElemFinder.findText(go, 'rank');
        this.modelCtn = modelCtn;
    }

    init(rank: number) {
        this.rank.text = uts.format('第{0}名', rank);
    }

    destroy() {
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }

    update(roleInfo: Protocol.CliColosseumOneRank, sortingOrder: number) {
        this.roleInfo = roleInfo;

        if (null != this.crtRoleID && CompareUtil.isRoleIDEqual(this.crtRoleID, roleInfo.m_stRoleId)) {
            return;
        }
        this.crtRoleID = roleInfo.m_stRoleId;
        this.roleName.text = roleInfo.m_szNickName;
        if (null == this.roleAvatar) {
            this.roleAvatar = new UIRoleAvatar(this.modelCtn, this.modelCtn);
            this.roleAvatar.setSortingOrder(sortingOrder);
            this.roleAvatar.hasWing = true;
        }
        this.roleAvatar.setAvataByList(roleInfo.m_stAvatarList, roleInfo.m_cProf, roleInfo.m_ucGender);
    }
}

class SxdscPKItem {
    private textName: UnityEngine.UI.Text;
    private head: UnityEngine.UI.Image;
    private textSxb: UnityEngine.UI.Text;
    private textJiFen: UnityEngine.UI.Text;

    private roleInfo: Protocol.CanAttackList;
    crtRoleID: Protocol.RoleID;

    btnGo: UnityEngine.GameObject;

    setUsual(go: UnityEngine.GameObject) {
        this.btnGo = ElemFinder.findObject(go, 'btnGo');
        this.textName = ElemFinder.findText(go, 'textName');
        this.head = ElemFinder.findImage(go, 'head');
        this.textSxb = ElemFinder.findText(go, 'b/textSxb');
        this.textJiFen = ElemFinder.findText(go, 'b/textJiFen');
    }

    update(roleInfo: Protocol.CanAttackList) {
        this.roleInfo = roleInfo;
        this.textSxb.text = uts.format('斗兽币：{0}', roleInfo.m_uiSSCoin);
        this.textJiFen.text = uts.format('积分：{0}', roleInfo.m_uiScore);

        if (null != this.crtRoleID && CompareUtil.isRoleIDEqual(this.crtRoleID, roleInfo.m_stRoleId)) {
            return;
        }
        this.crtRoleID = roleInfo.m_stRoleId;
        this.textName.text = roleInfo.m_szNickName;
        this.head.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}',
            roleInfo.m_cProf, roleInfo.m_ucGender));
    }

    get RoleInfo(): Protocol.CanAttackList {
        return this.roleInfo;
    }
}

export class SiXiangDouShouChangPanel extends TabSubForm {
    private static readonly _MAX_PK_PLAYER_NUMBER: number = 3;

    private readonly CdTimerKey = '1';

    private rankRoles: SxdscRoleItem[] = [];
    private textWin: UnityEngine.UI.Text;

    private pkItems: SxdscPKItem[] = [];

    private myRankText: UnityEngine.UI.Text;
    private textTimes: UnityEngine.UI.Text;
    private textCountDown: UnityEngine.UI.Text;

    private btnReward: UnityEngine.GameObject;
    private btnRefresh: UnityEngine.GameObject;
    private btnAdd: UnityEngine.GameObject;
    private btnClearCd: UnityEngine.GameObject;
    private btnShop: UnityEngine.GameObject;
    private btnZhenRong: UnityEngine.GameObject;

    private textMySxb: UnityEngine.UI.Text;

    private btnRule: UnityEngine.GameObject;

    private tipMark: UnityEngine.GameObject;
    private zhenRongTipMark: UnityEngine.GameObject;

    /**重置时间*/
    private m_cd: number = 0;

    /**
     * 剩余购买数
     * */
    private m_curRemainBuyTimes: number = 0;

    private m_remainTime = 0;

    /**自动购买*/
    private static m_isAutoBuy = false;

    private static noPrompClearCd = false;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_SIXIANGDOUSHOUCHANG);
    }

    protected resPath(): string {
        return UIPathData.SiXiangDouShouChangView;
    }

    protected initElements() {
        this.btnRule = this.elems.getElement('btnRule');

        // 3个挑战对象
        for (let i: number = 0; i < SiXiangDouShouChangPanel._MAX_PK_PLAYER_NUMBER; i++) {
            let rankRole = new SxdscRoleItem();
            let roleGo = this.elems.getElement('role' + i);
            rankRole.setUsual(roleGo, this.elems.getText('name' + i), this.elems.getTransform('modelCtn' + i));
            this.rankRoles.push(rankRole);

            let pkItem = new SxdscPKItem();
            let itemGo = this.elems.getElement('pkItem' + i);
            pkItem.setUsual(itemGo);
            this.pkItems.push(pkItem);
        }
        this.textWin = this.elems.getText('textWin');

        // 我的排名
        this.myRankText = this.elems.getText('textMyRank');

        // 挑战次数
        this.textTimes = this.elems.getText('textTimes');
        this.textCountDown = this.elems.getText('textCountDown');

        // 查看奖励
        this.btnReward = this.elems.getElement('btnReward');
        this.tipMark = this.elems.getElement('tipMark');
        // 换一批
        this.btnRefresh = this.elems.getElement('btnRefresh');
        UIUtils.setButtonClickAble(this.btnRefresh, false);
        // 阵容
        this.btnZhenRong = this.elems.getElement('btnZhenRong');
        this.zhenRongTipMark = this.elems.getElement('zhenRongTipMark');
        // 增加次数
        this.btnAdd = this.elems.getElement('btnAdd');
        this.btnClearCd = this.elems.getElement('btnClearCd');

        this.textMySxb = this.elems.getText('textMySxb');

        this.btnShop = this.elems.getElement('btnShop');
    }
    protected onDestroy() {
        for (let i: number = 0; i < SiXiangDouShouChangPanel._MAX_PK_PLAYER_NUMBER; i++) {
            this.rankRoles[i].destroy();
        }
    }

    protected initListeners() {
        this.addClickListener(this.btnRule, this.onClickBtnRule);
        this.addClickListener(this.btnReward, this.onClickBtnReward);
        this.addClickListener(this.btnRefresh, this.onClickBtnRefresh);
        this.addClickListener(this.btnZhenRong, this.onClickBtnZhenRong);
        this.addClickListener(this.btnAdd, this.onClickBtnAdd);
        this.addClickListener(this.btnClearCd, this.onClickBtnClearCd);
        this.addClickListener(this.btnShop, this.onClickBtnShop);

        for (let i: number = 0; i < SiXiangDouShouChangPanel._MAX_PK_PLAYER_NUMBER; i++) {
            Game.UIClickListener.Get(this.pkItems[i].btnGo).onClick = delegate(this, this.onClickPkItem, i);
        }
    }

    protected onOpen() {
        // 打开时拉取进度
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSxPkPanelRequest());
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLOSSEUM, Macros.COLOSSEUM_ACT_OPEN));
    }

    protected onClose() {

    }

    private onClickBtnShop() {
        G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.SiXiangBi);
        G.Uimgr.bindCloseCallback(MallView, ActHomeView, this.id);
    }

    /**
	* 刷新面板
	*
	*/
    onSxdscKuaFuChange() {
        let siXiangData = G.DataMgr.siXiangData;
        let pkInfo = siXiangData.sxPkInfo;
        if (null == pkInfo) {
            return;
        }

        // 积分排名
        this.myRankText.text = pkInfo.m_uiMyRank.toString();

        UIUtils.setButtonClickAble(this.btnRefresh, true);

        // 前3
        let rankCnt = pkInfo.m_astList.length;
        for (let i = 0; i < SiXiangDouShouChangPanel._MAX_PK_PLAYER_NUMBER; i++) {
            if (i < rankCnt) {
                let rankInfo = pkInfo.m_astList[i];
                this.rankRoles[i].update(rankInfo, this.sortingOrder);
            } else {
                this.rankRoles[i].update(null, 0);
            }
        }

        // 对手的信息
        let roleList = pkInfo.m_astCanList;
        for (let i = 0; i < SiXiangDouShouChangPanel._MAX_PK_PLAYER_NUMBER; i++) {
            let roleInfo = roleList[i];
            this.pkItems[i].update(roleInfo);
        }

        this.textMySxb.text = G.DataMgr.heroData.siXiangBi.toString();

        this.tipMark.SetActive(siXiangData.canGetSxbReward());
    }

    onSxdscActChange() {
        let siXiangData = G.DataMgr.siXiangData;
        let sxActInfo = siXiangData.sxActInfo;
        if (null == sxActInfo) {
            return;
        }

        let buyTimes = sxActInfo.m_uiBuyCount;
        let tickTime = sxActInfo.m_iCDTime;
        let curTotalBuyTimes = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_COLOSSEUM_BUY_COUNT, G.DataMgr.heroData.curVipLevel);

        this.m_curRemainBuyTimes = curTotalBuyTimes - buyTimes;
        this.m_remainTime = siXiangData.getRemainTimes();

        this.textTimes.text = uts.format('可挑战次数：{0}', this.m_remainTime);
        this.textWin.text = uts.format('今日胜场：{0}', TextFieldUtil.getColorText(sxActInfo.m_uiDayWinCount.toString(), Color.GREEN));

        //重置时间
        let currentTime: number = Math.round(G.SyncTime.getCurrentTime() / 1000);
        this.m_cd = tickTime - currentTime;
        if (this.m_cd > 0) {
            this.addTimer(this.CdTimerKey, 1000, 0, this.onCdTimer);
        }
        this.updateCd();

        this.textMySxb.text = G.DataMgr.heroData.siXiangBi.toString();

        this.tipMark.SetActive(siXiangData.canGetSxbReward());
        this.zhenRongTipMark.SetActive(sxActInfo.m_ucSSCout < siXiangData.getActivatedShenShouIds().length);
    }

    private onCdTimer(timer: Game.Timer) {
        this.m_cd -= timer.CallCountDelta;
        this.updateCd();
    }

    private updateCd() {
        if (this.m_cd > 0) {
            this.textCountDown.text = uts.format('倒计时：{0}', DataFormatter.second2hhmmss(this.m_cd));
            UIUtils.setButtonClickAble(this.btnClearCd, true);
        }
        else {
            this.textCountDown.text = '倒计时：--';
            this.removeTimer(this.CdTimerKey);
            UIUtils.setButtonClickAble(this.btnClearCd, false);
        }
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onClickBtnRule() {
        let content = G.DataMgr.langData.getLang(402);
        content = RegExpUtil.xlsDesc2Html(content);
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(content);
    }

    private onClickBtnRefresh() {
        if (this.checkActStatus()) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSxPkPanelRequest());
        } 
    }

    private checkActStatus(): boolean {
        let isOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_COLOSSEUM);
        if (!isOpen) {
            G.TipMgr.addMainFloatTip('活动尚未开始');
        } 
        return isOpen;
    }

    private onClickBtnZhenRong() {
        G.Uimgr.createForm<SxdscZhenRongView>(SxdscZhenRongView).open();
    }

    private onClickBtnReward() {
        G.Uimgr.createForm<SxdscRankView>(SxdscRankView).open();
    }

    private onClickBtnAdd() {
        let openPrivilegeLvs = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.VIP_PARA_COLOSSEUM_BUY_COUNT);
        let curVipLevel = G.DataMgr.heroData.curVipLevel;
        if (this.m_curRemainBuyTimes > 0) {
            let cost = SiXiangData._YUANBAO_COST_PERTIME;
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                if (SiXiangDouShouChangPanel.m_isAutoBuy) {
                    this.doBuyTimes();
                }
                else {
                    //能够购买次数
                    let canBuyTimes: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_COLOSSEUM_BUY_COUNT, curVipLevel);
                    let vipStr: string = TextFieldUtil.getVipText(curVipLevel, openPrivilegeLvs[0]);
                    let str1: string = uts.format('是否花费{0}增加1个次数？({1}可购买{2}次，您当前剩余{3}次购买机会)',
                        TextFieldUtil.getYuanBaoText(cost),
                        TextFieldUtil.getColorText(vipStr, Color.BLUE),
                        TextFieldUtil.getColorText(canBuyTimes.toString(), Color.BLUE),
                        TextFieldUtil.getColorText(this.m_curRemainBuyTimes.toString(), Color.BLUE));
                    G.TipMgr.showConfirm(str1, ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onBuyChallenge));
                }
            }
        }
        else {
            if (G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_COLOSSEUM_BUY_COUNT)) {
                let moreVip = G.DataMgr.vipData.getMoreTimesVipLevel(curVipLevel, KeyWord.VIP_PARA_COLOSSEUM_BUY_COUNT);
                let str2: string;
                if (moreVip <= curVipLevel) {
                    G.TipMgr.showConfirm('您今天的购买次数已用完！', ConfirmCheck.noCheck, '确定');
                }
                else {
                    G.TipMgr.showConfirm(uts.format('激活{0}可继续购买次数', TextFieldUtil.getVipText(moreVip, openPrivilegeLvs[0])), ConfirmCheck.noCheck, '确定', delegate(this, this.onUpMonthVip));
                }
            } else {
                G.TipMgr.showConfirm(uts.format('激活{0}可购买额外次数', TextFieldUtil.getMultiVipMonthTexts(openPrivilegeLvs)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onUpMonthVip, openPrivilegeLvs));
            }
        }
    }

    private onBuyChallenge(state: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == state) {
            SiXiangDouShouChangPanel.m_isAutoBuy = isCheckSelected;
            this.doBuyTimes();
        }
    }

    private onUpMonthVip(state: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == state) {
            G.Uimgr.createForm<VipView>(VipView).open();
        }
    }

    private doBuyTimes(): void {
        let cost = SiXiangData._YUANBAO_COST_PERTIME;
        if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
            //发送购买协议
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLOSSEUM, Macros.COLOSSEUM_ACT_BUY_TIME));
        }
    }

    private onClickBtnClearCd() {
        if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, SiXiangData.ClearCdPrice, true)) {
            if (SiXiangDouShouChangPanel.noPrompClearCd) {
                this.doClearCd();
            }
            else {
                G.TipMgr.showConfirm(uts.format('是否花费{0}清除CD？', TextFieldUtil.getYuanBaoText(SiXiangData.ClearCdPrice)), ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onClearCdConfirm));
            }
        }
    }

    private onClearCdConfirm(state: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == state) {
            SiXiangDouShouChangPanel.noPrompClearCd = isCheckSelected;
            this.doClearCd();
        }
    }

    private doClearCd() {
        if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, SiXiangData.ClearCdPrice, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLOSSEUM, Macros.COLOSSEUM_ACT_CLEAR_TIME));
        }
    }

    private onClickPkItem(index: number) {
        let roleInfo = this.pkItems[index].RoleInfo;
        if (null == roleInfo || CompareUtil.isRoleIDEqual(roleInfo.m_stRoleId, G.DataMgr.heroData.roleID)) {
            return;
        }

        if (!this.checkActStatus()) {
            return;
        }

        if (!G.ActionHandler.checkMatchingStatus(true)) {
            return;
        }

        if (this.m_remainTime <= 0) {
            G.TipMgr.addMainFloatTip('您今日的挑战次数已用完，请稍候');
            return;
        }

        if (this.m_cd > 0) {
            G.TipMgr.addMainFloatTip('挑战cd中, 请稍候');
            return;
        }

        if (G.DataMgr.siXiangData.sxActInfo.m_ucSSCout == 0) {
            G.Uimgr.createForm<SxdscZhenRongView>(SxdscZhenRongView).open();
            G.TipMgr.addMainFloatTip('请选择神兽上阵');
            return;
        }

        // 自动离队
        G.ActionHandler.leaveTeam();

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSxPkStartRequest(roleInfo.m_stRoleId, 0));
    }
}