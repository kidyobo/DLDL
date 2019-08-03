import { TianMingBangPanel } from 'System/pinstance/selfChallenge/TianMingBangPanel';
import { Global as G } from 'System/global'
import { CommonForm, UILayer, GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { EnumRewardState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { IconItem } from 'System/uilib/IconItem'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { GroupList } from 'System/uilib/GroupList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { TipFrom } from 'System/tip/view/TipsView'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { DropPlanData } from 'System/data/DropPlanData'

export class TMBRewardPreviewItem extends ListItemCtrl {
    private medalImg: UnityEngine.UI.Image;
    private medalObj: GameObjectGetSet;
    private rankText: TextGetSet;
    private rewardIcons: IconItem[] = [];
    private myRewardListData: RewardIconItemData[] = [];
    /**是否达成奖励角标*/
    private tipMark: GameObjectGetSet;
    private oldImageID: number = -1;
    setComponents(go: UnityEngine.GameObject, iconTemplate: UnityEngine.GameObject) {
        this.medalImg = ElemFinder.findImage(go, 'medalImg');
        this.medalObj = new GameObjectGetSet(ElemFinder.findObject(go, 'medalImg'));
        this.rankText = new TextGetSet(ElemFinder.findText(go, 'rankText'));
        this.tipMark = new GameObjectGetSet(ElemFinder.findObject(go, 'tipMark'));
        for (let i: number = 0; i < TianMingBangRewardView.MAX_REWARD_CNT; i++) {
            let iconRoot = ElemFinder.findObject(go, 'reward' + i);
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            this.rewardIcons.push(iconItem);
            iconItem.setUsualIconByPrefab(iconTemplate, iconRoot);
        }
    }
    update(config: GameConfig.JJCRankRewardConfigM, medalAltas: Game.UGUIAltas) {
        // 勋章样式
        if (config.m_iID < 4) {//前三名
            this.medalObj.SetActive(true);
            let showid = config.m_iID;
            if (this.oldImageID != showid) {
                this.oldImageID = showid;
                this.medalImg.sprite = medalAltas.Get('Common_Ranking_' + showid);
            }
            this.rankText.text = '';
        } else {
            this.medalObj.SetActive(false);
            // 名次
            this.rankText.text = TianMingBangRewardView.getRankStr(config.m_iPaiHangMin, config.m_iPaiHangMax);
        }
        let dropCfg: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(config.m_iDropID);
        let cnt = dropCfg.m_ucDropThingNumber;
        this.myRewardListData = RewardIconItemData.formatVector(cnt, this.myRewardListData); 

        for (let i: number = 0; i < TianMingBangRewardView.MAX_REWARD_CNT; i++) {
            let iconItem = this.rewardIcons[i];
            let data = dropCfg.m_astDropThing[i];
            if (i < cnt) {
                let itemData = this.myRewardListData[i];
                itemData.id = dropCfg.m_astDropThing[i].m_iDropID;
                itemData.number = dropCfg.m_astDropThing[i].m_uiDropNumber;
                iconItem.updateByRewardIconData(itemData);
            } else {
                iconItem.updateByRewardIconData(null);
            }
            iconItem.updateIcon();
        }

        //每日红点 有排名 没领过
        let rank = G.DataMgr.heroData.rewardRank;
        if (rank > 0 && rank < config.m_iPaiHangMax && rank >= config.m_iPaiHangMin) {
            this.tipMark.SetActive(!G.DataMgr.heroData.isGetRankReward);
        }
        else {
            this.tipMark.SetActive(false);
        }
    }
}
export class TMBRewardRankItem extends ListItemCtrl {
    private medalImg: UnityEngine.UI.Image;
    private medalObj: GameObjectGetSet;
    private rankText: TextGetSet;
    private rewardIcons: IconItem[] = [];
    /**是否达成奖励角标*/
    private tipMark: GameObjectGetSet;
    private oldImageID: number = -1;
    setComponents(go: UnityEngine.GameObject, iconTemplate: UnityEngine.GameObject) {
        this.medalImg = ElemFinder.findImage(go, 'medalImg');
        this.medalObj = new GameObjectGetSet(ElemFinder.findObject(go, 'medalImg'));
        this.rankText = new TextGetSet(ElemFinder.findText(go, 'rankText'));
        this.tipMark = new GameObjectGetSet(ElemFinder.findObject(go, 'tipMark'));
        for (let i: number = 0; i < TianMingBangRewardView.MAX_REWARD_CNT; i++) {
            let iconRoot = ElemFinder.findObject(go, 'reward' + i);
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            this.rewardIcons.push(iconItem);
            iconItem.setUsualIconByPrefab(iconTemplate, iconRoot);
        }
    }
    update(config: GameConfig.ArenaMaxRankRewardCfgM, medalAltas: Game.UGUIAltas) {
        if (config.m_iID < 4) {//前三名
            this.medalObj.SetActive(true);
            let showid = config.m_iID;
            if (this.oldImageID != showid) {
                this.oldImageID = showid;
                this.medalImg.sprite = medalAltas.Get('Common_Ranking_' + showid);
            }
            this.rankText.text = '';
        } else {
            this.medalObj.SetActive(false);
            // 名次
            this.rankText.text = TianMingBangRewardView.getRankStr(config.m_iLowRank, config.m_iHighRank);
        }
        //是否达成奖励
        let mayRank = G.DataMgr.heroData.myPpkRankVal;
        let heroData = G.DataMgr.heroData;
        let isGetReward = heroData.canGetMaxReward(1 << (config.m_iID - 1)) && mayRank <= config.m_iHighRank && mayRank > 0;
        this.tipMark.SetActive(isGetReward);
        let cnt = config.m_stItemList.length;
        for (let i: number = 0; i < TianMingBangRewardView.MAX_REWARD_CNT; i++) {
            let iconItem = this.rewardIcons[i];
            let data = config.m_stItemList[i];
            if (i < cnt) {
                iconItem.updateById(data.m_iID, data.m_iNumber);
            } else {
                iconItem.updateById(0);
            }
            iconItem.updateIcon();
        }
    }
}
/**神力榜排行奖励对话框。*/
export class TianMingBangRewardView extends CommonForm {
    private itemIcon_Normal: UnityEngine.GameObject;

    static readonly MAX_REWARD_CNT: number = 2;

    private btnClose: GameObjectGetSet;

    /**领取奖励按钮*/
    private btnGetReward: GameObjectGetSet;
    private labelGetReward: TextGetSet;

    /**勋章图集*/
    private medalAltas: Game.UGUIAltas;

    /**奖励预览列表*/
    private previewList: List;
    /**最大奖励预览列表*/
    private maxRankList: List;
    /**我的排名*/
    private myRankText: TextGetSet;

    /**倒计时文本*/
    private countDownText: TextGetSet;

    /**固定奖励数据*/
    private myRewardIconItems: IconItem[] = [];

    /**我的固定排名奖励数据*/
    private myRewardListData: RewardIconItemData[] = [];

    /**剩余领奖时间*/
    private m_leftTime: number = 0;
    private noReward: GameObjectGetSet;
    private noRewardText: TextGetSet;
    private noRewardTipsMark: GameObjectGetSet;
    /**每日领取按钮 */
    private btnDaily: GameObjectGetSet;
    private btnDailySelect: GameObjectGetSet;
    /**达成奖励按钮 */
    private btnAchieve: GameObjectGetSet;
    private btnAchieveSelect: GameObjectGetSet;
    private dailyMark: GameObjectGetSet;
    //领取达成奖励的按钮
    private btnGetAchieve: GameObjectGetSet;
    private achieveMark: GameObjectGetSet;
    private noAchieve: TextGetSet;


    private noActiveReward: GameObjectGetSet;
    private tipsMark: GameObjectGetSet;
    private selectIndex: number = 0;
    private curPanelIndex = -1;
    constructor() {
        super(0);
        this._cacheForm = true;
    }
    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenPvpPanelRequest());
        this.m_leftTime = G.SyncTime.getServerZeroLeftTime();
        if (this.m_leftTime > 0) {
            this.addTimer("countDownTimer", 1000, 0, this.onCountDownTimer);
        } else {
            this.stopCountDownTimer();
        }

        this.curPanelIndex = 0;
        this.updateView();
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.TianMingBangRewardView;
    }
    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this.btnClose = new GameObjectGetSet(this.elems.getElement('btnClose'));
        this.medalAltas = this.elems.getUGUIAtals('medalAltas');
        this.myRankText = new TextGetSet(this.elems.getText('myRankText'));
        this.countDownText = new TextGetSet(this.elems.getText('countDownText'));
        this.previewList = this.elems.getUIList('list');
        this.maxRankList = this.elems.getUIList('maxRankList');
        this.previewList.onVirtualItemChange = delegate(this, this.onUpdatePreviewItem);
        this.maxRankList.onVirtualItemChange = delegate(this, this.onUpdateRankItem);

        this.btnGetReward = new GameObjectGetSet(this.elems.getElement('btnGetReward'));
        this.labelGetReward = new TextGetSet(this.elems.getText('labelGetReward'));
        this.noReward = new GameObjectGetSet(ElemFinder.findObject(this.btnGetReward.gameObject, 'noReward'));
        this.noRewardText = new TextGetSet(this.elems.getText('noRewardText'));
        this.noRewardTipsMark = new GameObjectGetSet(ElemFinder.findObject(this.btnGetReward.gameObject, "tipsMark"));

        /**每日领取按钮 */
        this.btnDaily = new GameObjectGetSet(this.elems.getElement('btnDaily'));
        this.btnDailySelect = new GameObjectGetSet(ElemFinder.findObject(this.btnDaily.gameObject, 'selected'));
        /**达成奖励按钮 */
        this.btnAchieve = new GameObjectGetSet(this.elems.getElement('btnAchieve'));
        this.btnAchieveSelect = new GameObjectGetSet(ElemFinder.findObject(this.btnAchieve.gameObject, 'selected'));
        this.btnGetAchieve = new GameObjectGetSet(this.elems.getElement('btnGetAchieve'));
        this.achieveMark = new GameObjectGetSet(ElemFinder.findObject(this.btnAchieve.gameObject, 'achieveMark'));
        this.dailyMark = new GameObjectGetSet(this.elems.getElement('dailyMark'));
        this.noAchieve = new TextGetSet(ElemFinder.findText(this.btnGetAchieve.gameObject, 'noReward/noRewardText'));
        this.noActiveReward = new GameObjectGetSet(ElemFinder.findObject(this.btnGetAchieve.gameObject, 'noReward'));
        this.tipsMark = new GameObjectGetSet(ElemFinder.findObject(this.btnGetAchieve.gameObject, 'tipsMark'));
        for (let i: number = 0; i < TianMingBangRewardView.MAX_REWARD_CNT; i++) {
            let iconGo = this.elems.getElement('reward' + i);
            let iconItem = new IconItem();
            this.myRewardIconItems.push(iconItem);
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, iconGo);
            iconItem.setTipFrom(TipFrom.normal);
        }
    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose.gameObject, this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.btnDaily.gameObject, this.onClickBtnDaily);
        this.addClickListener(this.btnAchieve.gameObject, this.onClickBtnAchieve);
        this.addClickListener(this.btnGetAchieve.gameObject, this.onClickBtnGetReward);
        this.addClickListener(this.btnGetReward.gameObject, this.onClickBtnGetReward);
        this.addListClickListener(this.maxRankList, this.onClickList);
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onClickBtnGetReward(): void {
        if (this.curPanelIndex == 1) {
            let config = G.DataMgr.pinstanceData.getTianMingBangConfigByIndex(this.maxRankList.Selected);
            if (config != null) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRankRewardRequest(Macros.PVPRANK_GET_MAXRANK_REWARD, config.m_iID));
            }
        } else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRankRewardRequest(Macros.PVPRANK_GET_REWARD));
        }
    }

    private onClickBtnDaily() {
        this.curPanelIndex = 0;
        this.previewList.SetSlideAppearRefresh();
        this.updatePreviewView();
        this.previewList.ScrollTop();
    }
    private onClickBtnAchieve() {
        this.curPanelIndex = 1;
        let heroData = G.DataMgr.heroData;
        this.maxRankList.SetSlideAppearRefresh();
        this.updateRankView();
    }


    /**点击列表 */
    private onClickList(index: number) {
        this.selectIndex = index;
        this.updateRankRewardSelected();
    }
    private updateTipMarks() {
        let heroData = G.DataMgr.heroData;
        this.achieveMark.SetActive(G.DataMgr.activityData.RankReward > 0);
        if (heroData.isGetRankReward) {
            this.dailyMark.SetActive(false);
            this.noRewardTipsMark.SetActive(false);
        } else if (heroData.rewardRank > 0) {
            this.dailyMark.SetActive(true);
            this.noRewardTipsMark.SetActive(true);
        } else {
            this.dailyMark.SetActive(false);
            this.noRewardTipsMark.SetActive(false);
        }
    }
    ///////////////////////////////////////// 面板打开 /////////////////////////////////////////
    updateView() {
        this.updateTipMarks();
        if (this.curPanelIndex == 0) {
            this.updatePreviewView();
        } else {
            this.updateRankView();
        }
    }
    /**刷新奖励 */
    private updatePreviewView() {
        this.btnAchieveSelect.SetActive(false);
        this.btnDailySelect.SetActive(true);
        this.countDownText.gameObject.SetActive(true);
        this.previewList.SetActive(true);
        this.maxRankList.SetActive(false);
        this.btnGetAchieve.SetActive(false);
        this.btnGetReward.SetActive(true);
        // 奖励预览
        let config = G.DataMgr.pinstanceData.tianMingBangRankPreviewConfigs;
        let count = config.length;
        this.previewList.Count = count;
        this.previewList.Refresh();

        //领取奖励按钮设置
        this.updatePreviewRewardSelected();
    }
    private updatePreviewRewardSelected() {
        let data = G.DataMgr.heroData;
        let previewConfigs = G.DataMgr.pinstanceData.tianMingBangRankPreviewConfigs;
        if (data.isGetRankReward) {
            //UIUtils.setButtonClickAble(this.btnGetReward, false);
            this.noReward.SetActive(true);
            this.noRewardText.text = '已领取';
            this.dailyMark.SetActive(false);
            this.noRewardTipsMark.SetActive(false);

        } else if (data.rewardRank > 0) {
            //UIUtils.setButtonClickAble(this.btnGetReward, true);
            this.noReward.SetActive(false);
            this.labelGetReward.text = '领取奖励';
            this.dailyMark.SetActive(true);
            this.noRewardTipsMark.SetActive(true);

        } else {
            //UIUtils.setButtonClickAble(this.btnGetReward, false);
            this.noReward.SetActive(true);
            this.noRewardText.text = '未达成';
            this.dailyMark.SetActive(false);
            this.noRewardTipsMark.SetActive(false);
        }
        let myRankStr: string, giftIdx: number = 0;
        if (data.rewardRank == 0) {
            giftIdx = previewConfigs.length - 1;
            myRankStr = TextFieldUtil.getColorText('无名次', Color.WHITE);
        } else {
            let myRankMin: number = 0;
            let myRankMax: number = 0;
            for (let i: number = previewConfigs.length - 1; i >= 0; i--) {
                if (data.rewardRank >= previewConfigs[i].m_iPaiHangMin) {
                    myRankMin = previewConfigs[i].m_iPaiHangMin;
                    myRankMax = previewConfigs[i].m_iPaiHangMax;
                    giftIdx = i;
                    break;
                }
            }
            myRankStr = TianMingBangRewardView.getRankStr(myRankMin, myRankMax);
        }
        //奖励排名刷新
        // this.myRankText.text = uts.format('第{0}名', TextFieldUtil.getColorText(G.DataMgr.heroData.myPpkRankVal.toString(), '#FFE294FF'));
        this.myRankText.text = uts.format('第{0}名', G.DataMgr.heroData.myRank.toString());
        //刷新固定奖励列表
        //let curRewardConfig: GameConfig.JJCGiveItem[] = previewConfigs[giftIdx].m_stItemList;
        let curCfg = previewConfigs[giftIdx];
        let dropCfg: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(curCfg.m_iDropID);
        let cnt: number = dropCfg.m_ucDropThingNumber;
        this.myRewardListData = RewardIconItemData.formatVector(cnt, this.myRewardListData); 
        for (let i: number = 0; i < TianMingBangRewardView.MAX_REWARD_CNT; i++) {
            let iconItem = this.myRewardIconItems[i];
            if (i < cnt) {
                let itemData = this.myRewardListData[i];
                itemData.id = dropCfg.m_astDropThing[i].m_iDropID;
                itemData.number = dropCfg.m_astDropThing[i].m_uiDropNumber;
                itemData.state = Boolean(data.isGetRankReward) ? EnumRewardState.HasGot : EnumRewardState.NotGot;
                iconItem.updateByRewardIconData(itemData);
            } else {
                iconItem.updateByRewardIconData(null);
            }
            iconItem.updateIcon();
        }
    }

    /**刷新排名奖励*/
    private updateRankView() {
        this.btnAchieveSelect.SetActive(true);
        this.btnDailySelect.SetActive(false);
        this.countDownText.gameObject.SetActive(false);
        this.previewList.SetActive(false);
        this.maxRankList.SetActive(true);
        this.btnGetAchieve.SetActive(true);
        this.btnGetReward.SetActive(false);
        // 奖励预览
        this.maxRankList.Count = 10;
        this.maxRankList.Refresh();
        let myRank = G.DataMgr.heroData.myPpkRankVal;
        let rankReward = G.DataMgr.activityData.RankReward>0;
        //是否达成奖励
        if (rankReward) {
            this.selectIndex = G.DataMgr.activityData.RankReward;
        } else if (!rankReward) {
            this.selectIndex = 0;
        }
        this.maxRankList.ScrollByAxialRow(this.selectIndex);
        this.maxRankList.Selected = this.selectIndex;

        this.updateRankRewardSelected();
    }
    private updateRankRewardSelected() {
        let config = G.DataMgr.pinstanceData.getTianMingBangConfigByIndex(this.selectIndex);
        if (config != null) {
            for (let i: number = 0; i < TianMingBangRewardView.MAX_REWARD_CNT; i++) {
                let iconitem = this.myRewardIconItems[i];
                let data = config.m_stItemList[i];
                iconitem.updateById(data.m_iID, data.m_iNumber);
                iconitem.updateIcon();
            }
            let heroData = G.DataMgr.heroData;
            let mayRank = G.DataMgr.heroData.myPpkRankVal;
            let isGetReward = heroData.canGetMaxReward(1 << (config.m_iID - 1)) && mayRank <= config.m_iHighRank && mayRank > 0;
            this.noActiveReward.SetActive(!isGetReward);
            this.tipsMark.SetActive(isGetReward);
           
            if (mayRank > config.m_iHighRank||mayRank == 0) {
                this.noAchieve.text = '未达成';
            } else if (!isGetReward) {
                this.noAchieve.text = '已领取';
            }
        }
        else {
            uts.logWarning("rank奖励配置不存在 index：" + this.selectIndex);

        }
    }
    private onUpdatePreviewItem(item: ListItem) {
        let index = item._index;
        let previewItem = item.data.previewItem;
        if (!previewItem) {
            previewItem = item.data.previewItem = new TMBRewardPreviewItem();
            previewItem.setComponents(item.gameObject, this.itemIcon_Normal);
        }
        let config = G.DataMgr.pinstanceData.tianMingBangRankPreviewConfigs;
        previewItem.update(config[index], this.medalAltas);
    }
    private onUpdateRankItem(item: ListItem) {
        let index = item._index;
        let previewItem = item.data.previewItem;
        if (!previewItem) {
            previewItem = item.data.previewItem = new TMBRewardRankItem();
            previewItem.setComponents(item.gameObject, this.itemIcon_Normal);
        }
        let config = G.DataMgr.pinstanceData.getTianMingBangConfigByIndex(index);
        previewItem.update(config, this.medalAltas);
    }

    private onCountDownTimer(): void {
        if (this.m_leftTime < 0) {
            this.stopCountDownTimer();
        }
        this.countDownText.text = TextFieldUtil.getColorText('下次领奖时间：', '98fe5d') + DataFormatter.second2day(this.m_leftTime--);
    }

    private stopCountDownTimer(): void {
        this.removeTimer("countDownTimer");
        this.countDownText.text = '';
    }

    /**
     * 设置领奖按钮状态
     * @param isget 
     */
    private setGetRewardButton(isget: boolean) {
        this.noReward.SetActive(isget);
    }
    static getRankStr(min: number, max: number): string {
        let rankStr;
        if (min >= max) {
            rankStr = uts.format('第{0}名', min);
        } else if (min >= 513) {
            rankStr = '512名以上';
        } else {
            rankStr = uts.format('第{0}~{1}名', min, max);
        }
        return rankStr;
    }
}
