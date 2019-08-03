import { MallView } from "System/business/view/MallView";
import { PriceBar } from "System/business/view/PriceBar";
import { EnumMingJiangState, EnumRewardState, EnumStoreID } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { BuffData } from "System/data/BuffData";
import { DropPlanData } from "System/data/DropPlanData";
import { MingJiangData } from "System/data/MingJiangData";
import { UIPathData } from "System/data/UIPathData";
import { RewardIconItemData } from "System/data/vo/RewardIconItemData";
import { ActivityRuleView } from "System/diandeng/ActivityRuleView";
import { Global as G } from "System/global";
import { BossView } from "System/pinstance/boss/BossView";
import { MingJiangRankView } from "System/pinstance/boss/MingJiangRankView";
import { RewardView } from "System/pinstance/selfChallenge/RewardView";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager";
import { TabSubForm } from "System/uilib/TabForm";
import { ElemFinder } from "System/uilib/UiUtility";
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { RegExpUtil } from "System/utils/RegExpUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";
import { NestedSubForm } from 'System/uilib/NestedForm'
import { CommonForm, UILayer } from "System/uilib/CommonForm"

class MingJiangItem{

    static readonly BASE_DELTA_TIME: number = 150;
    private static readonly _TWEEN_DURATION_TIME: number = 0.3;

    private _index: number;

    private _nameTxt: UnityEngine.UI.Text;
    private _progressTxt: UnityEngine.UI.Text;
    private _fightPowerTxt: UnityEngine.UI.Text;



    private _btnGet: UnityEngine.GameObject;
    private _effBtnGet: UnityEngine.GameObject;
    //private _modelTR: UnityEngine.Transform;
    private _progressBar: UnityEngine.GameObject;
    private _progress: UnityEngine.GameObject;
    private _killedLabel: UnityEngine.GameObject;

    private _roleAvatar: UIRoleAvatar;


    private _gameObject: UnityEngine.GameObject;
    get gameObject(): UnityEngine.GameObject { return this._gameObject; }
    set gameObject(value: UnityEngine.GameObject) { this._gameObject = value; }


    initElement(gb: UnityEngine.GameObject) {
        this.gameObject = gb;
        this.gameObject.SetActive(false);
        this._progress = ElemFinder.findObject(gb, 'progressBar');

        this._nameTxt = ElemFinder.findText(gb, 'nameTxt');
        this._progressTxt = ElemFinder.findText(this._progress, 'valueTxt');
        this._fightPowerTxt = ElemFinder.findText(gb, 'fightPower/fightNumTxt');

        //this._modelTR = ElemFinder.findTransform(gb, 'modelCnt');
        this._btnGet = ElemFinder.findObject(gb, 'btnGet');
        this._killedLabel = ElemFinder.findObject(gb, 'killedLabel');
        this._effBtnGet = ElemFinder.findObject(gb, 'btnGet/effect');
        this._progressBar = ElemFinder.findObject(this._progress, 'bar');

        this._initListener();
    }

    private _initListener() {
        Game.UIClickListener.Get(this._btnGet).onClick = delegate(this, this._onClickBtnGet);
    }

    private _onClickBtnGet() {
        let data = G.DataMgr.mingJiangData.getItemDataByIndex(this._index);
        if (data.rewardStatus == EnumRewardState.HasGot) {
            G.TipMgr.addMainFloatTip('您已领取过该奖励！');
            return;
        }

        let isBeforeStage = G.DataMgr.mingJiangData.curPage < Math.floor((G.DataMgr.mingJiangData.fastestLevel - 1) / MingJiangData.ITEM_COUNT);
        if (data.rewardStatus == EnumRewardState.NotReach && isBeforeStage) {
            G.TipMgr.addMainFloatTip('未及时攻占，无法领取！');
            return;
        }

        let cfg = DropPlanData.getDropPlanConfig(G.DataMgr.mingJiangData.getDropID(this._index + 1));

        let itemDatas: RewardIconItemData[] = [];
        for (let i = 0; i < cfg.m_ucDropThingNumber; i++) {
            let item = new RewardIconItemData();
            let itemInfo = cfg.m_astDropThing[i];
            item.id = itemInfo.m_iDropID;
            item.number = itemInfo.m_uiDropNumber;
            itemDatas.push(item);
        }

        G.Uimgr.createForm<RewardView>(RewardView).open(itemDatas, '可获得：', data.rewardStatus, delegate(this, this._sendGetRewardMsg));
    }

    private _sendGetRewardMsg() {
        //领取协议
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMingJiangRewardRequest(this._index + 1));
    }

    updateView(timer: Game.Timer, index: number, trans: UnityEngine.Transform, sortingOrder: number) {
        this._index = index;

        this.gameObject.SetActive(true);

        let data = G.DataMgr.mingJiangData.getItemDataByIndex(index);
        if (data == null || !data.name || data.name == '') {
            this._nameTxt.text = '';
            this._fightPowerTxt.text = '';
            this._progress.SetActive(false);
            this._btnGet.SetActive(false);
            this._killedLabel.SetActive(false);
            return;
        }

        this._updateModel(trans,sortingOrder);
        this._playTween();

        this._btnGet.SetActive(true);

        this._killedLabel.SetActive(<boolean>data.isKilled);

        this._nameTxt.text = '魔化●' + data.name;
        this._fightPowerTxt.text = (<string>data.fightValue);

        if (data.curHP < 0) {
            this._progress.SetActive(false);
        }
        else {
            this._progress.SetActive(true);
            this._progressTxt.text = DataFormatter.formatNumber(data.curHP, 10000);
            this._progressBar.transform.localScale = G.getCacheV3(data.curHP / data.maxHP, 1, 1);
        }

        this.updateBtnState();
    }

    private _playTween() {
        let tweenScale = Tween.TweenScale.Begin(this.gameObject, MingJiangItem._TWEEN_DURATION_TIME, G.getCacheV3(1, 1, 1));
        tweenScale.from = G.getCacheV3(1.2, 1.2, 1.2);

        let tween = Tween.TweenAlpha.Begin(this.gameObject, MingJiangItem._TWEEN_DURATION_TIME, 1);
        tween.from = 0;

        let roleModel = this._roleAvatar.defaultAvatar.model;
        if (!roleModel) return;
        let tweenModel = Tween.TweenShaderValue.BeginWithSkin(roleModel.gameObject, MingJiangItem._TWEEN_DURATION_TIME, "_Alpha", 0, 1);
    }

    private _updateModel(trans: UnityEngine.Transform,sortingOrder: number) {
        let data = G.DataMgr.mingJiangData.getItemDataByIndex(this._index);
        if (null == this._roleAvatar) {

            this._roleAvatar = new UIRoleAvatar(trans, trans);
            this._roleAvatar.setSortingOrder(sortingOrder);
        }
        this._roleAvatar.setAvataByList(data.avatarList, data.profession, data.gender);
    }

    destoryModel() {
        if (!this._roleAvatar) return;

        this._roleAvatar.destroy();
        this._roleAvatar = null;
    }

    updateBtnState() {
        let data = G.DataMgr.mingJiangData.getItemDataByIndex(this._index);
        this._effBtnGet.SetActive(data.rewardStatus == EnumRewardState.NotGot);

        //已领取或其他宗门已经进入下一大关，则礼包不可领取
        UIUtils.setGrey(this._btnGet, data.rewardStatus == EnumRewardState.NotReach);
    }
}

/**
 * 【Boss挑战 - 名将】面板。 *
 *
 */
export class MingJiangPanel extends TabSubForm {
    /**五个模型*/
    private readonly modelCount = 5;
    private _mjItems: MingJiangItem[] = [];

    private _altas: Game.UGUIAltas;
    private _mask: UnityEngine.UI.Image;
    private _content: UnityEngine.GameObject;


    private _modelCnts: UnityEngine.GameObject[] = [];
    private _modelCntsIndex: number = 0;
    private _btnEnter: UnityEngine.GameObject;
    private _btnLeft: UnityEngine.GameObject;
    private _btnRight: UnityEngine.GameObject;
    private _btnAddBuff: UnityEngine.GameObject;
    private _btnRule: UnityEngine.GameObject;
    private _btnStore: UnityEngine.GameObject;
    private _btnRank: UnityEngine.GameObject;

    private _buffTxt: UnityEngine.UI.Text;
    private _remainTimeTxt: UnityEngine.UI.Text;
    private _btnEnterText: UnityEngine.UI.Text;
    private _guildTxt: UnityEngine.UI.Text;
    private _curProgressTxt: UnityEngine.UI.Text;
    private _actRemainTimeTxt: UnityEngine.UI.Text;
    private _timeDescLabel: UnityEngine.UI.Text;



    private _priceBar: PriceBar;

    private _isCheckAddBuff: boolean;

    private _actRemainTime: number;
    private _timers: Game.Timer[] = [];

    private _actTimer: Game.Timer;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_MINGJIANG);
    }

    protected resPath(): string {
        return UIPathData.MingJiangPanel;
    }

    protected initElements() {
        let list = this.elems.getElement('list');
        for (let i = 0; i < MingJiangData.ITEM_COUNT; i++) {
            let item = new MingJiangItem();
            let gb = ElemFinder.findObject(list, i.toString());
            item.initElement(gb);
            this._mjItems.push(item);
        }

        this._altas = this.elems.getElement("maskAltas").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this._content = this.elems.getElement('content');

        for (let i = 0; i < this.modelCount; i++) {
            this._modelCnts.push( this.elems.getElement("modelCnt" + i));
        }

        this._mask = this.elems.getImage('mask');
        this._btnLeft = this.elems.getElement('btnLeft');
        this._btnRight = this.elems.getElement('btnRight');
        this._btnAddBuff = this.elems.getElement('btnAddBuff');
        this._btnRule = this.elems.getElement('btnRule');
        this._btnEnter = this.elems.getElement('btnEnter');
        this._btnStore = this.elems.getElement('btnStore');
        this._btnRank = this.elems.getElement('btnRank');

        this._buffTxt = this.elems.getText('buffTxt');
        this._guildTxt = this.elems.getText('guildTxt');
        this._btnEnterText = this.elems.getText('btnEnterText');
        this._remainTimeTxt = this.elems.getText('remainTimeTxt');
        this._curProgressTxt = this.elems.getText('curProgressTxt');
        this._actRemainTimeTxt = this.elems.getText('actRemainTimeTxt');
        this._timeDescLabel = this.elems.getText('timeDescLabel');
        this._timeDescLabel.text = uts.format('每日{0}点、{1}点获得额外挑战时间',
            MingJiangData.EXTRA_REWARD_HOUR[0],
            MingJiangData.EXTRA_REWARD_HOUR[1]);

        this._priceBar = new PriceBar();
        this._priceBar.setComponents(this.elems.getElement('currencyBar'));
        this._priceBar.setCurrencyID(KeyWord.MONEY_ID_MJTZ);
    }

    protected initListeners() {
        this.addClickListener(this._btnEnter, this._onClickBtnEnter);
        this.addClickListener(this._btnLeft, this._onClickbtnLeft);
        this.addClickListener(this._btnRight, this._onClickbtnRight);
        this.addClickListener(this._btnAddBuff, this._onClickbtnAddBuff);
        this.addClickListener(this._btnRule, this._onClickbtnRule);
        this.addClickListener(this._btnStore, this._onClickbtnStore);
        this.addClickListener(this._btnRank, this._onClickbtnRank);
    }

    private _onClickBtnEnter() {
        if (!G.DataMgr.mingJiangData.canEnter(true)) return;


        if (G.DataMgr.mingJiangData.isInCloseTime()) {
            G.TipMgr.addMainFloatTip('每天0点至8点不可挑战！');
            return;
        }

        if (G.DataMgr.mingJiangData.isFirstDayJoinGuild()) {
            G.TipMgr.addMainFloatTip('加入或创建宗门第1天不能挑战！');
            return;
        }

        G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_MJTZ, Macros.PINSTANCE_ID_MJTZ);
        G.Uimgr.closeForm(BossView);
    }

    private _onClickbtnLeft() {
        G.DataMgr.mingJiangData.curPage--;
        this._updatePageBtnState();
        this._updateMjItems(false);
    }

    private _updatePageBtnState() {
        UIUtils.setButtonClickAble(this._btnLeft, G.DataMgr.mingJiangData.curPage + 1 > 1);
        UIUtils.setButtonClickAble(this._btnRight, G.DataMgr.mingJiangData.curPage + 1 < MingJiangData.PAGE_COUNT);
    }

    private _updateMjItems(isTweenFromLeft: boolean = true) {
        // 用计时器实现逐个刷新的效果
        let timerIndex = 0;
        for (let i = 0; i < this._mjItems.length; i++) {
            let tweenIndex = isTweenFromLeft ? i : MingJiangData.ITEM_COUNT - i - 1;
            let deltaTime = MingJiangItem.BASE_DELTA_TIME * tweenIndex;
            let realIndex = G.DataMgr.mingJiangData.curPage * MingJiangData.ITEM_COUNT + i;
            //第一个不用延时直接刷新
            if (deltaTime <= 0) {
                this._mjItems[i].updateView(null, realIndex, this._modelCnts[i].transform, this.sortingOrder);
                continue;
            }

            //缓存计时器，避免关闭面板后报错
            if (!this._timers[timerIndex]) {
                this._timers[timerIndex] = new Game.Timer('name', deltaTime, 1, delegate(this._mjItems[i], this._mjItems[i].updateView, realIndex, this._modelCnts[i].transform, this.sortingOrder));
            }
            else {
                this._timers[timerIndex].ResetTimer(deltaTime, 1, delegate(this._mjItems[i], this._mjItems[i].updateView, realIndex, this._modelCnts[i].transform, this.sortingOrder));
            }
            timerIndex++;
        }
    }

    private _onClickbtnRight() {
        G.DataMgr.mingJiangData.curPage++;
        this._updatePageBtnState();
        this._updateMjItems();
    }

    private _onClickbtnAddBuff() {
        if (this._isCheckAddBuff) {
            this._sendAddBuffMsg();
            return;
        }

        let buffCfg = BuffData.getBuffByID(MingJiangData.BUFF_ID);
        let cfmStr = uts.format('宗门鼓舞将花费{0}，鼓舞后{1}并获得{2}，是否确定？',
            TextFieldUtil.getYuanBaoText(MingJiangData.ADD_BUFF_PRICE),
            TextFieldUtil.getColorText(buffCfg.m_szBuffDescription, Color.GREEN),
            TextFieldUtil.getColorText(MingJiangData.ADD_BUFF_REWARD + KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, KeyWord.MONEY_ID_MJTZ), Color.GREEN));

        G.TipMgr.showConfirm(cfmStr, ConfirmCheck.withCheck, '确定|取消', delegate(this, this._onConfirmAddBuff));
    }

    private _onConfirmAddBuff(status: number, isCheckSelected: boolean, data) {
        if (MessageBoxConst.yes != status) return;

        this._isCheckAddBuff = isCheckSelected;

        this._sendAddBuffMsg();
    }

    private _sendAddBuffMsg() {
        //是否够钱
        if (G.DataMgr.heroData.gold < MingJiangData.ADD_BUFF_PRICE) {
            G.ModuleMgr.businessModule.queryCharge('您的钻石不足，请充值。');
            return;
        }

        //是否有剩余次数
        if (G.DataMgr.mingJiangData.buffRemainTime <= 0) {
            G.TipMgr.showConfirm('本轮鼓舞次数已用完。', ConfirmCheck.noCheck, '确定');
            return;
        }

        //宗门鼓舞协议
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMingJiangBuffRequest());
    }

    private _onClickbtnRule() {
        let content = RegExpUtil.xlsDesc2Html(G.DataMgr.langData.getLang(MingJiangData.RULE_ID));
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(content);
    }
    private _onClickbtnStore() {
        G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.KFJDCJF);
        G.Uimgr.bindCloseCallback(MallView, BossView, this.id);
    }
    private _onClickbtnRank() {
        G.Uimgr.createForm<MingJiangRankView>(MingJiangRankView).open();
    }

    protected onOpen() {
        this._sendRefreshMsg();

        let funcState = G.DataMgr.mingJiangData.getFuncState();
        if (funcState != EnumMingJiangState.OPEN) {
            this._content.SetActive(false);
            let imgName = funcState == EnumMingJiangState.NOGUILD ? 'noguild' : 'notopen';
            let width = funcState == EnumMingJiangState.NOGUILD ? 857 : 490;
            this._mask.sprite = this._altas.Get(imgName);
            (<UnityEngine.RectTransform>this._mask.gameObject.transform).sizeDelta = G.getCacheV2(width, 100);
            this._mask.gameObject.SetActive(true);
            return;
        }

        this._mask.gameObject.SetActive(false);
        this._content.SetActive(true);
    }

    private _sendRefreshMsg() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMingJiangPanelRequest());
    }

    protected onClose() {
        for (let timer of this._timers) {
            timer.Stop();
        }

        if (this._actTimer) {
            this._actTimer.Stop();
            this._actTimer = null;
        }

        for (let item of this._mjItems) {
            item.destoryModel();
        }
    }

    updateView(isRefreshPage: boolean): void {
        let funcState = G.DataMgr.mingJiangData.getFuncState();
        if (funcState != EnumMingJiangState.OPEN) return;

        // 根据当前进度刷新对应页数

        let curLevel = G.DataMgr.mingJiangData.curLevel;
        if (isRefreshPage) {
            if (curLevel > Macros.MAX_MJTZ_BOSS_COUNT) curLevel = Macros.MAX_MJTZ_BOSS_COUNT;
            G.DataMgr.mingJiangData.curPage = (curLevel - 1) / MingJiangData.ITEM_COUNT;
        }

        this._updateMjItems();
        this._updatePageBtnState();
        this.updateBuffLabel();
        this.onCurrencyChange();

        curLevel = G.DataMgr.mingJiangData.curLevel;
        let fastLv = G.DataMgr.mingJiangData.fastestLevel;
        let lvStr = fastLv > Macros.MAX_MJTZ_BOSS_COUNT ? '全通关' : uts.format('第{0}关', fastLv);
        this._guildTxt.text = '当前最强宗门：' + TextFieldUtil.getColorText(lvStr, Color.GREEN);
        lvStr = curLevel > Macros.MAX_MJTZ_BOSS_COUNT ? '全通关' : uts.format('第{0}关', curLevel);
        this._curProgressTxt.text = '当前挑战进度：' + TextFieldUtil.getColorText(lvStr, Color.GREEN);

        this._remainTimeTxt.text = '剩余挑战时间：' +
            TextFieldUtil.getColorText(DataFormatter.second2mmss(G.DataMgr.mingJiangData.enterRemainTime), Color.GREEN);

        let actRemainTime = G.DataMgr.mingJiangData.actRemainTime;
        let isEnd = fastLv > Macros.MAX_MJTZ_BOSS_COUNT || actRemainTime <= 0;
        let enterStr = isEnd ? '已结束' : uts.format('挑战{0}关', curLevel);
        this._btnEnterText.text = enterStr;
        UIUtils.setButtonClickAble(this._btnEnter, !isEnd);

        this._updateActTime();
    }

    private _updateActTime() {
        this._actRemainTime = G.DataMgr.mingJiangData.actRemainTime;
        this._updateActTxt();
        if (this._actRemainTime > 0) {
            if (!this._actTimer) {
                this._actTimer = new Game.Timer('act', 1000, 0, delegate(this, this._actTimeTick));
                return;
            }

            this._actTimer.ResetTimer(1000, 0, delegate(this, this._actTimeTick))
        }
    }

    private _actTimeTick(timer: Game.Timer) {
        this._actRemainTime--;
        this._updateActTxt();
        if (this._actRemainTime <= 0) {
            this._actTimer.Stop();
            this._actTimer = null;
        }
    }

    private _updateActTxt() {
        let str = this._actRemainTime > 0 ? DataFormatter.second2day(this._actRemainTime) : '已结束';
        let color = this._actRemainTime > 0 ? Color.GREEN : Color.GREY;
        this._actRemainTimeTxt.text = '活动剩余时间：' + TextFieldUtil.getColorText(str, color);
    }

    updateByNotify() {
        if (G.DataMgr.mingJiangData.getFuncState() != EnumMingJiangState.OPEN) return;
        this._sendRefreshMsg();
    }

    updateBuffLabel() {
        //buff
        let buffUseTime = MingJiangData.MAX_ADD_BUFF_TIME - G.DataMgr.mingJiangData.buffRemainTime;
        let buffCfg = BuffData.getBuffByID(MingJiangData.BUFF_ID);
        this._buffTxt.text = uts.format('全体成员伤害+{0}%', buffUseTime * buffCfg.m_astBuffEffect[0].m_iBuffEffectValue / 100);
    }

    updateBtnState() {
        for (let i = 0; i < this._mjItems.length; i++) {
            this._mjItems[i].updateBtnState();
        }
    }

    onCurrencyChange() {
        this._priceBar.setPrice(G.DataMgr.heroData.mingJiang);
    }
}