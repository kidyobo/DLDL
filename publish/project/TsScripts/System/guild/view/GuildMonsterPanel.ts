import { ActHomeView } from "System/activity/actHome/ActHomeView";
import { PriceBar } from "System/business/view/PriceBar";
import { EnumRewardState, UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { BuffData } from "System/data/BuffData";
import { DropPlanData } from "System/data/DropPlanData";
import { GuildData } from "System/data/GuildData";
import { KfLingDiData } from "System/data/KfLingDiData";
import { MonsterData } from "System/data/MonsterData";
import { UIPathData } from "System/data/UIPathData";
import { RewardIconItemData } from "System/data/vo/RewardIconItemData";
import { Global as G } from "System/global";
import { RewardView } from "System/pinstance/selfChallenge/RewardView";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ConfirmCheck } from "System/tip/TipManager";
import { SkillIconItem } from "System/uilib/SkillIconItem";
import { TabSubForm } from "System/uilib/TabForm";
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { SpecialCharUtil } from "System/utils/SpecialCharUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";

import { GuildMonsterPreviewView } from "./GuildMonsterPreviewView";

export enum DeblockingHintEnum {
    '贡献度达到100可领取',
    '贡献度达到200并占领任意岛屿可领取',
    '贡献度达到500并占领任意大陆可领取',
    '贡献度达到1000并占领中天大陆可领取 ',
}

export class GuildMonsterPanel extends TabSubForm {

    private static readonly _TREASURE_BOX_COUNT: number = 4;
    private _cityNameAltas: Game.UGUIAltas;
    private _cityBgAltas: Game.UGUIAltas;
    private _stageTxt: UnityEngine.UI.Text;
    private _monsterNameTxt: UnityEngine.UI.Text;
    private _go2FightLinkTxt: UnityEngine.UI.Text;
    private _jpLinkTxt: UnityEngine.UI.Text;
    private _openTimeTxt: UnityEngine.UI.Text;
    private _curScoreTxt: UnityEngine.UI.Text;
    private _curLingDiTxt: UnityEngine.UI.Text;
    private _progressTxt: UnityEngine.UI.Text;
    private _takeUpTxt: UnityEngine.UI.Text;
    private _modelRootTR: UnityEngine.GameObject;
    private _effectRootTR: UnityEngine.GameObject;
    private _cityNameImg: UnityEngine.UI.Image;
    private _btnUseAll: UnityEngine.UI.ActiveToggle;
    private _btnFeed: UnityEngine.GameObject;
    private _btnPreview: UnityEngine.GameObject;
    private _progressBar: UnityEngine.GameObject;
    private _jingPoProgressBar: UnityEngine.UI.Slider;
    private _cityBgImg: UnityEngine.UI.Image;
    private _treasureBoxList: UnityEngine.GameObject[] = [];
    private _curJingPoPriceBar: PriceBar;

    private _skillItems: SkillIconItem[] = [];

    private _originModelScale: UnityEngine.Vector3;


    constructor() {
        super(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU);
    }

    protected resPath(): string {
        return UIPathData.GuildMonsterPanel;
    }

    protected initElements() {
        this._cityNameAltas = this.elems.getElement('cityNameAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this._cityBgAltas = this.elems.getElement('cityBgAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this._stageTxt = this.elems.getText('stageTxt');
        this._monsterNameTxt = this.elems.getText('monsterNameTxt');
        this._go2FightLinkTxt = this.elems.getText('goToFightTxt');
        this._jpLinkTxt = this.elems.getText('JingPoLinkTxt');
        this._jpLinkTxt.gameObject.SetActive(false);
        this._openTimeTxt = this.elems.getText('openTimeTxt');
        this._curScoreTxt = this.elems.getText('curScoreTxt');
        this._curLingDiTxt = this.elems.getText('curRewardTxt');
        this._progressTxt = this.elems.getText('progressTxt');
        this._takeUpTxt = this.elems.getText('takeUpTxt');

        this._modelRootTR = this.elems.getElement('modelRoot');
        this._originModelScale = this._modelRootTR.transform.localScale;
        this._effectRootTR = this.elems.getElement('effectRoot');

        this._cityNameImg = this.elems.getImage('cityNameLabel');

        this._btnUseAll = this.elems.getActiveToggle('autoBuyBtn');
        this._btnFeed = this.elems.getElement('feedBtn');
        this._btnPreview = this.elems.getElement('btnPreview');

        this._cityBgImg = this.elems.getImage('cityImg');

        this._progressBar = this.elems.getElement('rewardProgress');
        this._jingPoProgressBar = this.elems.getSlider('jingPoProgress');

        for (let i = 0; i < GuildMonsterPanel._TREASURE_BOX_COUNT; i++) {
            let box = this.elems.getElement('s' + (i + 1));
            let donateLvTxt = ElemFinder.findText(box, 'textValue');
            donateLvTxt.text = GuildData.MONSTER_REWARD_SCORE_GROUP[i].toString();
            this._treasureBoxList.push(box);
        }

        this._curJingPoPriceBar = new PriceBar();
        this._curJingPoPriceBar.setComponents(this.elems.getElement('currencyBar'));
        this._curJingPoPriceBar.setCurrencyID(KeyWord.MONEY_ID_JINGPO);

        let skillIcon_Normal = this.elems.getElement('skillIcon_Normal');
        let skillList = this.elems.getUiElements('skill');

        let len = GuildData.MONSTER_SKILL_IDS.length;
        for (let i = 0; i < len; i++) {
            let item = skillList.getElement('skill' + i);
            let iconItem = new SkillIconItem(true);
            iconItem.setUsuallyByPrefab(skillIcon_Normal, item);
            //iconItem.isBuffSkill = true;
            this._skillItems.push(iconItem);
        }
    }

    protected initListeners() {
        this.addClickListener(this._btnFeed, this._onClickBtnFeed);
        this.addClickListener(this._btnPreview, this._onClickBtnPreview);
        this.addClickListener(this._jpLinkTxt.gameObject, this._onClickJpLinkTxt);
        this.addClickListener(this._go2FightLinkTxt.gameObject, this._onClickgo2FightLinkTxt);
        this._go2FightLinkTxt.text = TextFieldUtil.getColorText('争夺领地', Color.GREEN);

        for (let i = 0; i < GuildMonsterPanel._TREASURE_BOX_COUNT; i++) {
            let box = this._treasureBoxList[i];
            this.addClickListener(box, delegate(this, this._onClickTreasureBox, i + 1));
        }
    }

    private _onClickBtnFeed() {
        let feedNum: number = this._btnUseAll.isOn ? G.DataMgr.heroData.jingPo : 1;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildMonsterFeedRequest(feedNum));
    }

    private _onClickBtnPreview() {
        let MonsterPanelInfo = G.DataMgr.guildData.MonsterPanelInfo;
        if (MonsterPanelInfo == null) return;
        G.Uimgr.createForm<GuildMonsterPreviewView>(GuildMonsterPreviewView).open(MonsterPanelInfo.m_stBossFeed.m_iBossLevel + 1);
    }

    private _onClickJpLinkTxt() {
    }

    private _onClickgo2FightLinkTxt() {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.ACT_FUNCTION_ZZHC, true)) return;

        G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.ACT_FUNCTION_ZZHC);
    }

    private _onClickTreasureBox(id: number) {
        let status = G.DataMgr.guildData.MonsterRewardStatusList[id - 1];
        if (status == EnumRewardState.HasGot) {
            G.TipMgr.addMainFloatTip('您已经领取过该奖励了！');
            return;
        }

        if (!G.DataMgr.thingData.isBagEnough(true, 3)) return;

        let cfg = DropPlanData.getDropPlanConfig(KfLingDiData.GUILD_MONSTER_REWARD_ID_GROUP[id - 1]);
        let rewardIconItemDatas: RewardIconItemData[] = [];
        for (let i = 0; i < cfg.m_ucDropThingNumber; i++) {
            let temp = cfg.m_astDropThing[i];
            let itemData = new RewardIconItemData();
            itemData.id = temp.m_iDropID;
            itemData.number = temp.m_uiDropNumber;
            rewardIconItemDatas.push(itemData);
        }

        G.Uimgr.createForm<RewardView>(RewardView).open(rewardIconItemDatas, DeblockingHintEnum[id - 1], status, delegate(this, this._sendGetRewardMsg, id));
    }

    private _sendGetRewardMsg(id: number) {
        let rewardStatus = G.DataMgr.guildData.MonsterRewardStatusList[id - 1];
        if (rewardStatus == EnumRewardState.NotGot) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildMonsterRewardRequest(id));
            return;
        }

        G.TipMgr.showConfirm('您未达到条件！', ConfirmCheck.noCheck, '确定');
    }


    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildMonsterPanelRequest());
    }

    protected onClose() {
    }

    updataPanel(): void {
        this.updateFeedPanel();
        this._updateKfLingDiPanel();
    }

    updateFeedPanel() {
        this._updateCurMonster();
        this.updateJingPoPart();
    }

    private _updateCurMonster() {
        this._updateSkill();
        let MonsterPanelInfo = G.DataMgr.guildData.MonsterPanelInfo;
        if (MonsterPanelInfo == null) return;

        let info = MonsterPanelInfo.m_stBossFeed;

        let monsterLv = info.m_iBossLevel;
        monsterLv = (monsterLv == 0 ? 1 : monsterLv);

        let cfgs = G.DataMgr.guildData.GuildMonsterCfg;
        let guildMonsterCfgs = G.DataMgr.guildData._guildMonsterCfgs;
        let config = cfgs[monsterLv];
        uts.log(monsterLv + '当前等级' + config.m_iMonsterId+'  模型id');
        let monsterConfig = MonsterData.getMonsterConfig(config.m_iMonsterId);

        this._monsterNameTxt.text = monsterConfig.m_szMonsterName;
        G.ResourceMgr.loadModel(this._modelRootTR, UnitCtrlType.boss, monsterConfig.m_szModelID, this.sortingOrder);
        if (monsterConfig.m_ucUnitScale > 0) {
            let scalePer = monsterConfig.m_ucUnitScale / 100;
            this._modelRootTR.transform.localScale = G.getCacheV3(this._originModelScale.x * scalePer,
                this._originModelScale.y * scalePer,
                this._originModelScale.z * scalePer);
        }

        this._btnPreview.SetActive(info.m_iBossLevel < guildMonsterCfgs.length);

        if (info.m_iBossLevel <= 0) {
            this._stageTxt.text = "";
            this._effectRootTR.gameObject.SetActive(false);
            return;
        }

        this._stageTxt.text = SpecialCharUtil.getHanNum(info.m_iBossLevel) + '阶';

        //脚底特效
        this._effectRootTR.gameObject.SetActive(true);
        let effectConfig = BuffData.getBuffByID(config.m_iBuffId);
        G.ResourceMgr.loadModel(this._effectRootTR, UnitCtrlType.other,
            uts.format("effect/skill/{0}.prefab", effectConfig.m_szBuffSpecialEffect), this.sortingOrder);
    }

    private _updateSkill() {
        let MonsterPanelInfo = G.DataMgr.guildData.MonsterPanelInfo;
        if (MonsterPanelInfo == null) return;
        let info = MonsterPanelInfo.m_stBossFeed;
        for (let i = GuildData.MONSTER_SKILL_IDS.length - 1; i >= 0; i--) {
            let item = this._skillItems[i];
            item.needGrey = info.m_iBossLevel < GuildData.MONSTER_SKILL_OPEN_LV[i];
            item.updateBySkillID(GuildData.MONSTER_SKILL_IDS[i]);
            item.updateIcon();
        }
    }

    updateJingPoPart() {
        //本人精魄
        let jingPo = G.DataMgr.heroData.jingPo;
        this._curJingPoPriceBar.setPrice(jingPo, jingPo > 0 ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH);

        //刷新进度条
        let MonsterPanelInfo = G.DataMgr.guildData.MonsterPanelInfo;
        if (MonsterPanelInfo == null) return;
        let info = MonsterPanelInfo.m_stBossFeed;
        let cfgs = G.DataMgr.guildData.GuildMonsterCfg;
        let bossLv = info.m_iBossLevel > 0 ? info.m_iBossLevel : 1;
        let nextConfig = cfgs[info.m_iBossLevel+1]
        uts.log(info.m_iBossLevel+'  当前boss等级');
        if (!nextConfig) {
            this._progressTxt.text = '已满阶';
            this._jingPoProgressBar.value = 1;
            UIUtils.setButtonClickAble(this._btnFeed, false);
            return;
        }

        let perNum = info.m_iBossExp / nextConfig.m_iExpend;
        this._progressTxt.text = uts.format('{0}/{1}', info.m_iBossExp, nextConfig.m_iExpend);
        this._jingPoProgressBar.value = perNum;

        //刷新按钮状态
        UIUtils.setButtonClickAble(this._btnFeed, G.DataMgr.heroData.jingPo > 0);
    }

    private _updateKfLingDiPanel() {
        this._updateOpenTimeTxt();
        this._updateCityInfo();
        this._updateCurLingDiTxt();
        this.updateTreasureBox();
        this._updateProgress();
    }

    private _updateCurLingDiTxt() {
        let cityIndex = G.DataMgr.kfLingDiData.getCurTakeUpCityIndex();
        let valueStr = '';
        let scoreGroup = GuildData.MONSTER_REWARD_SCORE_GROUP;
        switch (true) {
            case cityIndex < 0:
                valueStr = scoreGroup[0].toString();
                break;
            case cityIndex == 0:
                valueStr = scoreGroup[3].toString();
                break;
            case cityIndex > 2:
                valueStr = scoreGroup[1].toString();
                break;
            case cityIndex > 0:
                valueStr = scoreGroup[2].toString();
                break;
        }
        this._curLingDiTxt.text = uts.format('当前领地可解锁{0}贡献度宝箱', TextFieldUtil.getColorText(valueStr, Color.GOLD));
    }

    private _updateOpenTimeTxt() {
        let openTimeStr = uts.format('开服第{0}天开启', SpecialCharUtil.getHanNum(KfLingDiData.ACTIVITY_FIRST_OPEN_DAY));
        if (G.SyncTime.getDateAfterStartServer() > KfLingDiData.ACTIVITY_FIRST_OPEN_DAY) {
            let actDays: number[] = G.DataMgr.activityData.getActivityDays(Macros.ACTIVITY_ID_ZZHCSUB);
            let weekStr: string = SpecialCharUtil.getWeekName(actDays);
            openTimeStr = uts.format("领地战每{0}开启", TextFieldUtil.getColorText(weekStr, Color.GREEN));
        }
        this._openTimeTxt.text = openTimeStr;
    }

    private _updateCityInfo() {
        let cityIndex = G.DataMgr.kfLingDiData.getCurTakeUpCityIndex();
        if (cityIndex < 0) {
            this._cityNameImg.sprite = this._cityNameAltas.Get('city99');
            this._cityBgImg.sprite = this._cityBgAltas.Get('city99');
            this._takeUpTxt.text = TextFieldUtil.getColorText('未占领领地', Color.GREY);
            return;
        }

        this._takeUpTxt.text = TextFieldUtil.getColorText('已占领', Color.GOLD);
        this._cityNameImg.sprite = this._cityNameAltas.Get('city' + cityIndex);
        this._cityBgImg.sprite = this._cityBgAltas.Get('city' + cityIndex);
    }

    updateTreasureBox() {

        let statusList = G.DataMgr.guildData.MonsterRewardStatusList;
        let guildData = G.DataMgr.guildData;
        this._curScoreTxt.text = G.DataMgr.guildData.MonsterPanelInfo.m_stGiftGet.m_uiDayGongXian.toString();
        for (let i = 0; i < GuildMonsterPanel._TREASURE_BOX_COUNT; i++) {
            let btn = this._treasureBoxList[i];
            let notReachGB = ElemFinder.findObject(btn, 'noReach');
            let reachedGB = ElemFinder.findObject(btn, 'reached');
            let hasGetGB = ElemFinder.findObject(btn, 'opened');

            let status = statusList[i];
            notReachGB.SetActive(status == EnumRewardState.NotReach);
            reachedGB.SetActive(status == EnumRewardState.NotGot);
            hasGetGB.SetActive(status == EnumRewardState.HasGot);
            if (i > 0) {
                let suoImg = ElemFinder.findObject(btn, 'suoImg');
                let isActive = guildData.isReachCityCount(i);
                suoImg.SetActive(!isActive);
            }

        }
    }

    private _updateProgress() {
        //进度条
        let scoreGroup = GuildData.MONSTER_REWARD_SCORE_GROUP;
        let curDonateValue = G.DataMgr.guildData.MonsterPanelInfo.m_stGiftGet.m_uiDayGongXian;
        let i = scoreGroup.length - 1;
        for (i; i >= 0; i--) {
            if (curDonateValue >= scoreGroup[i]) break;
        }
        let perNum = 1 / scoreGroup.length * (i + 1);

        Game.Tools.SetGameObjectLocalScale(this._progressBar, perNum, 1, 1);
    }
}