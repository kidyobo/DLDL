import { EnumGuide, EnumMonsterID } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { MonsterData } from 'System/data/MonsterData';
import { PetData } from 'System/data/pet/PetData';
import { PinstanceData } from 'System/data/PinstanceData';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager';
import { TipFrom } from 'System/tip/view/TipsView';
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { TabSubForm } from 'System/uilib/TabForm';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { DataFormatter } from 'System/utils/DataFormatter';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { UIUtils } from 'System/utils/UIUtils';
import { TextGetSet } from '../../uilib/CommonForm';

/**单个伙伴副本 */
class WuYuanItem {
    private id: number;
    private gamoObject: UnityEngine.GameObject;

    /**头像*/
    private imgAwater: UnityEngine.UI.RawImage;
    /**等级*/
    private txtLevel: UnityEngine.UI.Text;
    /**名字*/
    private txtName: UnityEngine.UI.Text;
    /**可挑战*/
    private imgChallenge: UnityEngine.GameObject;
    /**可扫荡*/
    private imgSweeping: UnityEngine.GameObject;
    /**锁*/
    private imgLock: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject, id: number, caller: (id: number) => void) {
        this.id = id;
        this.gamoObject = go;

        this.imgAwater = ElemFinder.findRawImage(go, "mask/imgAwater");
        this.txtLevel = ElemFinder.findText(go, "flag/txtLevel");
        this.txtName = ElemFinder.findText(go, "flag/txtName");
        this.imgChallenge = ElemFinder.findObject(go, "mask/imgChallenge");
        this.imgSweeping = ElemFinder.findObject(go, "mask/imgSweeping");
        this.imgLock = ElemFinder.findObject(go, "mask/imgLock");
        Game.UIClickListener.Get(go).onClick = delegate(this, caller, this.id);
    }

    /**
     * 更新item
     * @param diffCfg 副本难度数据
     */
    updateItem(diffCfg: GameConfig.PinstanceDiffBonusM) {
        if (diffCfg == null) {
            this.gamoObject.SetActive(false);
            return;
        }

        let pinstanceData = G.DataMgr.pinstanceData;
        let heroLevel = G.DataMgr.heroData.level;
        let heroEnergy = G.DataMgr.heroData.energy;
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_WYFB);
        let ispetActive = false;
        //通关状态查询
        let preState = diffCfg.m_iPreDiff > 0 ? pinstanceData.getWuYuanFuBenDiffState(diffCfg.m_iPreDiff, false) : 1;
        let leftState = pinstanceData.getWuYuanFuBenDiffState(diffCfg.m_iDiff, false);
        //let todayState = pinstanceData.getWuYuanFuBenDiffState(diffCfg.m_iDiff, true);
        let todayState = info.m_stPinExtraInfo.m_stWYFBFinishInfo.m_ucFinishNum[diffCfg.m_iDiff - 1];
        todayState = Math.max(0, todayState);
        let cfg = MonsterData.getMonsterConfig(EnumMonsterID.WuYuanBenBase + diffCfg.m_iDiff - 1);

        G.ResourceMgr.loadImage(this.imgAwater, uts.format('images/head/{0}.png', cfg.m_iHeadID));
        this.txtLevel.text = uts.format("{0}级", cfg.m_usLevel);
        this.txtName.text = cfg.m_szMonsterName;

        //显示图标类型  0锁  1可挑战  2可扫荡 3什么都没有
        let showType = -1;

        //特殊条件 看是否激活
        if (diffCfg.m_iConditionValue > 0 && !G.DataMgr.petData.isPetActive(diffCfg.m_iConditionValue)) {
            ispetActive = false;
        } else {
            ispetActive = true;
        }

        if (ispetActive) {
            if (preState == 0) {
                //前置难度未通关 锁
                showType = 0;
            }
            else if (heroLevel < diffCfg.m_iOpenLevel) {
                //等级不足 锁
                showType = 0;
            }
            else if (leftState == 0) {
                //从未通过 可挑战
                showType = 1;
            }
            else if (diffCfg.m_iLimitTimes == 0) {
                //无限制次数 可扫荡
                showType = 2;
                if (heroEnergy < diffCfg.m_iConsumeValue)
                    showType = 3;
            }
            else if (diffCfg.m_iLimitTimes - todayState > 0) {
                //有限制次数 且有剩余数量 可扫荡
                showType = 2;
                if (heroEnergy < diffCfg.m_iConsumeValue)
                    showType = 3;
            }
            else {
                showType = 3;
            }
        }
        else {
            showType = 0;
        }
        //if (ispetActive) {
        //    //先检测前置难度是否通关 前置难度为通关 锁
        //    if (diffCfg.m_iPreDiff > 0) {
        //        if (!pinstanceData.getWuYuanFuBenDiffState(diffCfg.m_iPreDiff, false)) {
        //            //前置难度为通关
        //            showType = 0;
        //        }
        //        else if (heroLevel < diffCfg.m_iOpenLevel) {
        //            //等级不足 锁
        //            showType = 0;
        //        }
        //        else if (pinstanceData.getWuYuanFuBenDiffState(diffCfg.m_iDiff, false)) {
        //            //历史已通关 扫荡
        //            showType = 2;
        //            if (pinstanceData.getWuYuanFuBenDiffState(diffCfg.m_iDiff, true)) {
        //                //今日已通关
        //                showType = 3;
        //            }
        //        }
        //        else {
        //            //挑战
        //            showType = 1;
        //        }
        //    }
        //    else {
        //        if (pinstanceData.getWuYuanFuBenDiffState(diffCfg.m_iDiff, false)) {
        //            //历史已通关 扫荡
        //            showType = 2;
        //            if (pinstanceData.getWuYuanFuBenDiffState(diffCfg.m_iDiff, true)) {
        //                //今日已通关
        //                showType = 3;
        //            }
        //        }
        //        else {
        //            //挑战
        //            showType = 1;
        //        }
        //    }
        //}
        //else {
        //    showType = 0;
        //}

        UIUtils.setGrey(this.gamoObject, showType == 0);

        this.imgLock.SetActive(showType == 0);
        this.imgChallenge.SetActive(showType == 1);
        this.imgSweeping.SetActive(showType == 2);
    }

    updateSelection(sele: UnityEngine.GameObject) {
        if (sele == null) return;

        sele.transform.SetParent(this.gamoObject.transform);
        sele.transform.localPosition = /*UnityEngine.Vector3.zero + */new UnityEngine.Vector3(-1, 0, 0);
    }
}


/**伙伴副本 四个一组 */
class WuYuanFourItem {
    static readonly ITEM_MAX_NUMBER = 4;
    //private fixedlist: FixedList;
    private bossList: UnityEngine.GameObject[] = [];

    private wuYuanItems: WuYuanItem[] = [];

    setComponents(go: UnityEngine.GameObject, id: number, caller: (id: number) => void) {
        for (let i = 0; i < WuYuanFourItem.ITEM_MAX_NUMBER; i++) {
            let item = ElemFinder.findObject(go, "boss" + i.toString());
            let wuyuanItem = new WuYuanItem();
            wuyuanItem.setComponents(item.gameObject, WuYuanFourItem.ITEM_MAX_NUMBER * id + i, caller)
            this.bossList.push(item);
            this.wuYuanItems.push(wuyuanItem);
        }
    }

    updatePanel(diffCfg: GameConfig.PinstanceDiffBonusM, index: number) {
        this.wuYuanItems[index].updateItem(diffCfg);
    }

    /**
     * 刷新选中态
     * @param index
     * @param sele
     */
    updateSelection(index: number, sele: UnityEngine.GameObject) {
        this.wuYuanItems[index].updateSelection(sele);
    }

    getItem(index: number): UnityEngine.GameObject {
        return this.bossList[index];
    }
}

/**伙伴副本 信息显示 */
class FubenExhibitionPanel {
    private gamoObject: UnityEngine.GameObject;
    private txtTitleName: TextGetSet;
    private txtTitleLevel: TextGetSet;

    /**头像*/
    private imgAwater: UnityEngine.UI.RawImage;
    /**推荐战力*/
    private txtFight: UnityEngine.UI.Text;
    /**要求等级*/
    private txtLevel: UnityEngine.UI.Text;
    /**消耗活力*/
    private txtEnergy: UnityEngine.UI.Text;
    /**挑战次数*/
    private txtNumber: UnityEngine.UI.Text;
    /**总活力*/
    private txtSumEnergy: UnityEngine.UI.Text;
    /**活力回复时间*/
    private txtTime: UnityEngine.UI.Text;

    /**扫荡*/
    private btnSweeping: UnityEngine.GameObject;
    /**挑战*/
    private btnChallenge: UnityEngine.GameObject;
    /**挑战按钮下的文字*/
    private txtButtonChallenge: UnityEngine.UI.Text;
    /**添加体力*/
    private btnAddEnergy: UnityEngine.GameObject;
    /**奖励列表*/
    private awardList: List;


    /**刷新时间计时器*/
    private refreshTimer: Game.Timer = null;
    /**最大体力*/
    private maxEnergy: number;
    /**当前体力*/
    private curEnergy: number = 0;
    /**当前副本信息*/
    private curDiffCfg: GameConfig.PinstanceDiffBonusM;
    /**前置条件状态*/
    private preState: number;
    /**历史通关状态*/
    private curLiftState: number;
    /**今日通关状态*/
    private curTodayState: number;


    setComponents(go: UnityEngine.GameObject) {
        this.gamoObject = go;

        this.awardList = ElemFinder.getUIList(ElemFinder.findObject(go, "rewardList"));

        this.txtTitleName = new TextGetSet(ElemFinder.findText(go, "title/txtTitleName"));
        this.txtTitleLevel = new TextGetSet(ElemFinder.findText(go, "title/txtTitleName/txtTitleLevel"));

        this.imgAwater = ElemFinder.findRawImage(go, "avater/mask/imgAwater");
        this.txtFight = ElemFinder.findText(go, "txtFight");
        this.txtLevel = ElemFinder.findText(go, "txtLevel");
        this.txtEnergy = ElemFinder.findText(go, "txtDescribe");
        this.txtNumber = ElemFinder.findText(go, "txtNumber");
        this.txtSumEnergy = ElemFinder.findText(go, "txtSumEnergy");
        this.txtTime = ElemFinder.findText(go, "txtTime");

        this.btnSweeping = ElemFinder.findObject(go, "btnSweeping");
        this.btnChallenge = ElemFinder.findObject(go, "btnChallenge");
        this.txtButtonChallenge = ElemFinder.findText(go, "btnChallenge/txt");
        this.btnAddEnergy = ElemFinder.findObject(go, "btnReset");

        Game.UIClickListener.Get(this.btnSweeping).onClick = delegate(this, this.onClickSweeping);
        Game.UIClickListener.Get(this.btnChallenge).onClick = delegate(this, this.onClickChallenge);
        Game.UIClickListener.Get(this.btnAddEnergy).onClick = delegate(this, this.onClickBuy);

        this.initData();
    }

    /**初始化数据 */
    private initData() {
        this.maxEnergy = G.DataMgr.constData.getValueById(KeyWord.PARAM_AUTO_ENERGY_WY_NUM);
        if (this.maxEnergy == null) {
            this.maxEnergy = 200;
        }
    }

    /**
     * 更新数据
     * @param diffCfg
     */
    private updateData(diffCfg: GameConfig.PinstanceDiffBonusM) {
        this.curDiffCfg = diffCfg;
        this.curEnergy = G.DataMgr.getOwnValueByID(this.curDiffCfg.m_iConsumeType);

        let pinstanceData = G.DataMgr.pinstanceData;
        if (diffCfg.m_iPreDiff > 0)
            this.preState = pinstanceData.getWuYuanFuBenDiffState(diffCfg.m_iPreDiff, false);
        else
            this.preState = 1;
        this.curLiftState = pinstanceData.getWuYuanFuBenDiffState(diffCfg.m_iDiff, false);
        this.curTodayState = pinstanceData.getWuYuanFuBenDiffState(diffCfg.m_iDiff, true);
    }

    /**
     * 刷新界面
     * @param diffCfg 信息
     * @param index 
     */
    updatePanel(diffCfg: GameConfig.PinstanceDiffBonusM, index: number) {
        this.updateData(diffCfg);

        let heroData = G.DataMgr.heroData;
        let cfg = MonsterData.getMonsterConfig(EnumMonsterID.WuYuanBenBase + diffCfg.m_iDiff - 1);
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_WYFB);

        this.txtTitleName.text = diffCfg.m_szName;
        this.txtTitleLevel.text = uts.format("{0}级", diffCfg.m_iOpenLevel);

        G.ResourceMgr.loadImage(this.imgAwater, uts.format('images/head/{0}.png', cfg.m_iHeadID));
        let powerFight = diffCfg.m_iFightPower;
        this.txtFight.text = uts.format("推荐战力 {0}", TextFieldUtil.getColorText(powerFight.toString(), powerFight <= heroData.fight ? Color.GREEN : Color.RED));
        this.txtLevel.text = uts.format("要求等级 {0}级", TextFieldUtil.getColorText(diffCfg.m_iOpenLevel.toString(), Color.GREEN));
        this.txtSumEnergy.text = uts.format("{0}/{1}", TextFieldUtil.getColorText(this.curEnergy.toString(), this.curEnergy == 0 ? Color.GREY : Color.GREEN), this.maxEnergy);

        let len = this.curLiftState ? diffCfg.m_stDailyBonus.length : diffCfg.m_stLifeBonus.length;
        this.awardList.Count = len;
        for (let i = 0; i < len; i++) {
            let item = this.awardList.GetItem(i);
            let iconitem = item.data.iconitem as IconItem;
            if (!iconitem) {
                iconitem = item.data.iconitem = new IconItem();
                iconitem.setUsuallyIcon(item.gameObject);
                iconitem.setTipFrom(TipFrom.normal);
            }
            let b = this.curLiftState ? diffCfg.m_stDailyBonus[i] : diffCfg.m_stLifeBonus[i];
            iconitem.updateById(b.m_iThingId, b.m_iThingNum);
            iconitem.updateIcon();
        }

        //活力限制
        if (!this.curLiftState) {
            this.txtEnergy.text = "消耗体力:首次免费";
            this.txtButtonChallenge.text = "挑战";
        }
        else {
            let str = TextFieldUtil.getColorText(diffCfg.m_iConsumeValue.toString(), this.curEnergy < diffCfg.m_iConsumeValue ? Color.RED : Color.GREEN);
            this.txtEnergy.text = uts.format("消耗体力：{0}", str);
            this.txtButtonChallenge.text = "一键扫荡";
        }

        //次数限制
        if (diffCfg.m_iLimitTimes == 0) {
            this.txtNumber.text = "剩余次数：不限";
        }
        else {
            let left = diffCfg.m_iLimitTimes - info.m_stPinExtraInfo.m_stWYFBFinishInfo.m_ucFinishNum[index];
            left = Math.max(0, left);
            this.txtNumber.text = TextFieldUtil.getColorText(uts.format("剩余次数：{0}/{1}", left, diffCfg.m_iLimitTimes), left > 0 ? Color.GREEN : Color.RED);
        }

        this.updateTimer();
        this.startRefresh();
    }

    /**开始刷新时间 */
    private startRefresh() {
        if (this.refreshTimer == null) {
            this.refreshTimer = new Game.Timer("refreshPetTime", 1000, -1, delegate(this, this.updateTimer));
        }
        else {
            this.refreshTimer.ResetTimer(1000, -1, delegate(this, this.updateTimer));
        }
    }

    /**停止刷新时间 */
    stopRefresh() {
        if (this.refreshTimer != null) {
            this.refreshTimer.Stop();
            this.refreshTimer = null;
        }
    }

    /**更新显示时间的 */
    private updateTimer() {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_WYFB);

        let heroData = G.DataMgr.heroData;
        let current = heroData.energy;
        let internal = Macros.AUTO_ENERGY_WY_INTERVAL;
        let lastTimeAt = info.m_stPinExtraInfo.m_stWYFBFinishInfo.m_uiAutoTime;
        let now = Math.round(G.SyncTime.getCurrentTime() / 1000);
        if (current >= this.maxEnergy) {
            this.txtTime.text = "00:00:00";
        }
        else {
            let point = this.maxEnergy - current - 1;
            let clientSize = (internal - (now - lastTimeAt));
            if (clientSize <= 0) {
                clientSize = 0;
                info.m_stPinExtraInfo.m_stWYFBFinishInfo.m_uiAutoTime = now;
            }
            let time = clientSize + internal * point;
            this.txtTime.text = DataFormatter.second2hhmmss(time);
        }
    }

    /**点击扫荡 */
    private onClickSweeping() {
        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(Macros.PINSTANCE_ID_WYFB, false));

        let config = this.curDiffCfg;
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_WYFB);

        let num = info.m_stPinExtraInfo.m_stWYFBFinishInfo.m_ucFinishNum[this.curDiffCfg.m_iDiff - 1];
        num = Math.max(0, num);
        let heroData = G.DataMgr.heroData;
        if (!this.curLiftState) {
            G.TipMgr.addMainFloatTip("挑战此关卡成功后才可扫荡");
            return;
        }

        if (this.curEnergy < config.m_iConsumeValue) {
            G.TipMgr.addMainFloatTip("体力不足");
            return;
        }

        if (config.m_iLimitTimes > 0 && num >= config.m_iLimitTimes) {
            G.TipMgr.addMainFloatTip("剩余挑战次数不足");
            return;
        }

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(Macros.PINSTANCE_ID_WYFB, true, config.m_iDiff));
    }

    /**点击挑战 */
    private onClickChallenge() {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_WYFB);

        let num = this.curDiffCfg.m_iLimitTimes - info.m_stPinExtraInfo.m_stWYFBFinishInfo.m_ucFinishNum[this.curDiffCfg.m_iDiff - 1];
        num = Math.max(0, num);
        let heroData = G.DataMgr.heroData;
        if (heroData.level < this.curDiffCfg.m_iOpenLevel) {
            G.TipMgr.addMainFloatTip("等级不足");
            return;
        }
        if (this.curDiffCfg.m_iPreDiff > 0 && !this.preState) {
            G.TipMgr.addMainFloatTip("完成之前的关卡后才可挑战");
            return;
        }
        if (this.curDiffCfg.m_iLimitTimes > 0 && num <= 0) {
            G.TipMgr.addMainFloatTip("剩余挑战次数不足");
            return;
        }
        //需要激活伙伴...
        if (this.curDiffCfg.m_iConditionValue > 0 && !G.DataMgr.petData.isPetActive(this.curDiffCfg.m_iConditionValue)) {
            G.TipMgr.addMainFloatTip(uts.format("需激活{0}", PetData.getPetConfigByPetID(this.curDiffCfg.m_iConditionValue).m_szBeautyName));
            return;
        }

        if (this.curLiftState > 0) {
            if (this.curEnergy < this.curDiffCfg.m_iConsumeValue) {
                G.TipMgr.addMainFloatTip("体力不足");
                return;
            }
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(Macros.PINSTANCE_ID_WYFB, false, this.curDiffCfg.m_iDiff));
        }
        else {
            if (this.curDiffCfg.m_iFightPower > heroData.fight) {
                G.TipMgr.showConfirm('当前战力低于推荐通关战力，副本难度较大，是否继续挑战？', ConfirmCheck.noCheck, '是|否', delegate(this, this.onConfirmClick));
                // 进行下一步指引
                G.GuideMgr.processGuideNext(EnumGuide.HuoBanFuBen, EnumGuide.HuoBanFuBen_ClickEnter);
                return;
            }
            G.ModuleMgr.pinstanceModule.tryEnterWuYuanFuBen(this.curDiffCfg.m_iDiff);
        }
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.HuoBanFuBen, EnumGuide.HuoBanFuBen_ClickEnter);
    }

    private onConfirmClick(stage: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            G.ModuleMgr.pinstanceModule.tryEnterWuYuanFuBen(this.curDiffCfg.m_iDiff);
        }
    }

    /**点击购买 */
    private onClickBuy() {
        let heroData = G.DataMgr.heroData;
        let current = heroData.energy;
        let perValue = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WYFB_TIRED_BUY_VALUE, heroData.curVipLevel);
        if (current >= this.maxEnergy) {
            G.TipMgr.addMainFloatTip("体力已满！");
            return;
        }
        else if ((current + perValue) > this.maxEnergy) {
            G.TipMgr.addMainFloatTip("此次购买将超过上限，无法继续购买！");
            return;
        }
        let vipCount = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WYFB_EXT_NUM, heroData.curVipLevel);
        let cost = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WYFB_BUY_PIRCE, heroData.curVipLevel);
        let leftTimes = vipCount - G.DataMgr.vipData.getTaskBuyTimes(Macros.PINSTANCE_ID_WYFB);
        G.ActionHandler.privilegePrompt(KeyWord.VIP_PARA_WYFB_EXT_NUM, cost, leftTimes, delegate(this, this.sendMsgToBuy));
    }

    private sendMsgToBuy() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_BUY_PINSTANCE, Macros.PINSTANCE_ID_WYFB));
    }

    //////////////////引导使用/////////////////////
    getButton(): UnityEngine.GameObject {
        return this.btnChallenge;
    }

    clickChallenge() {
        this.onClickChallenge();
    }
}


export class WuYuanFuBenPanel extends TabSubForm implements IGuideExecutor {
    //副本选择
    private pinstanceList: List;
    private fourItems: WuYuanFourItem[] = [];
    private selection: UnityEngine.GameObject;

    //右侧副本信息显示
    private exhibitionPanel: FubenExhibitionPanel;

    //////////////////左侧选择列表/////////////////////
    //只有一个，暂时什么都没有弄
    private typeList: List;
    private readonly TYPE_MAX_NUMBER = 1;
    private labelMap: { [id: number]: string } = {};

    /**当前显示的索引。*/
    private diffConfigs: GameConfig.PinstanceDiffBonusM[] = [];

    private curSelectedDiff = -1;
    private m_noPrompt: boolean = false;
    /**vip9级副本刷新次数最大*/
    private readonly MaxEnterCountVIPLv: number = 12;


    constructor() {
        super(KeyWord.OTHER_FUNCTION_WYFB);
        //得到所有层数
        this.diffConfigs = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_WYFB);
    }

    protected resPath(): string {
        return UIPathData.WuYuanFuBenPanel;
    }

    protected initElements() {
        //副本选择列表
        this.pinstanceList = this.elems.getUIList("pinstanceList");
        let len = this.diffConfigs.length;
        let con = Math.ceil(len / WuYuanFourItem.ITEM_MAX_NUMBER);
        this.pinstanceList.Count = con;
        for (let i = con - 1; i >= 0; i--) {
            let wuyuanfour = new WuYuanFourItem();
            wuyuanfour.setComponents(this.pinstanceList.GetItem(i).gameObject, con - i - 1, delegate(this, this.onClickPinstanceItem))
            this.fourItems.push(wuyuanfour);
        }
        this.selection = this.elems.getElement("selection");

        //右侧信息面板
        let rightPanel = this.elems.getElement("exhibitionPanel");
        this.exhibitionPanel = new FubenExhibitionPanel();
        this.exhibitionPanel.setComponents(rightPanel);

        //左侧类型面板
        this.typeList = this.elems.getUIList("typeList");
        let listName = ["伙伴副本"];
        this.typeList.Count = listName.length;
        for (let i = 0; i < listName.length; i++) {
            let item = this.typeList.GetItem(i);
            let txtNor = ElemFinder.findText(item.gameObject, "normal/Textnormal");
            let txtsel = ElemFinder.findText(item.gameObject, "selected/Textselected");
            txtNor.text = listName[i];
            txtsel.text = listName[i];
        }

        this.itemContentHigh = this.pinstanceList.itemSize.y;
    }

    protected initListeners() {
        //this.pinstanceList.getScrollRect().onValueChanged = delegate(this, this.onListValueChanged);
        //Game.UITouchListener.Get(this.pinstanceList.getScrollRect().gameObject).onTouchEnd = delegate(this, this.onListDrugEnd);
    }

    private curContentY: number;
    private itemContentHigh: number;

    private onListValueChanged(v2: UnityEngine.Vector2) {
        //this.curContentY = v2.y;
        //uts.log("jackson... Changed");
    }

    private onListDrugEnd() {
        //this.pinstanceList.ScrollByAxialRow(Math.round(this.curContentY / this.itemContentHigh));
        //uts.log("jackson... end" + this.curContentY + "__" + this.itemContentHigh);
    }

    protected onOpen() {
        // 打开时拉取进度
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, Macros.PINSTANCE_ID_WYFB));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_GET_RANKINFO, Macros.PINSTANCE_ID_WYFB));

        //刷新选中态
        this.updateScroll();
        this.updateSelection(this.curSelectedDiff);

        //刷新列表信息
        this.updateView();

        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.HuoBanFuBen, EnumGuide.HuoBanFuBen_OpenHuoBanFuBenPanel);
    }

    protected onClose() {
        this.exhibitionPanel.stopRefresh();
    }

    /**
     * 点击副本item
     * @param index
     */
    private onClickPinstanceItem(index: number) {
        this.curSelectedDiff = index;

        //刷新右侧面板
        this.exhibitionPanel.updatePanel(this.diffConfigs[index], index);
        //刷新选中态
        this.updateSelection(index);
    }

    /**
     * 刷新选中态
     * @param index
     */
    private updateSelection(index: number) {
        let count = Math.floor(index / WuYuanFourItem.ITEM_MAX_NUMBER);
        let num = index % WuYuanFourItem.ITEM_MAX_NUMBER;
        this.fourItems[count/*this.fourItems.length - count - 1*/].updateSelection(num, this.selection);
    }

    /**刷新界面位置 */
    private updateScroll() {
        let sumCount = this.fourItems.length;
        //检索当前应该挑战的层数
        let pinstanceData = G.DataMgr.pinstanceData;
        let len = this.diffConfigs.length;
        let index = -1;
        for (let i = 0; i < len; i++) {
            let lift = pinstanceData.getWuYuanFuBenDiffState(this.diffConfigs[i].m_iDiff, false);
            if (lift == 0) {
                index = i;
                break;
            }
        }
        this.curSelectedDiff = Math.max(0, index);
        let count = Math.floor(this.curSelectedDiff / WuYuanFourItem.ITEM_MAX_NUMBER);
        this.pinstanceList.ScrollByAxialRow(sumCount - 1 - count);
    }

    updateView() {
        //左

        //中
        let sumCount = this.fourItems.length;
        let con = this.diffConfigs.length;
        for (let i = 0; i < sumCount; i++) {
            for (let j = 0; j < WuYuanFourItem.ITEM_MAX_NUMBER; j++) {
                let index = i * WuYuanFourItem.ITEM_MAX_NUMBER + j;
                this.fourItems[i].updatePanel(this.diffConfigs[index], j);
            }
        }

        //右
        this.exhibitionPanel.updatePanel(this.diffConfigs[this.curSelectedDiff], this.curSelectedDiff);
    }

    onCurrencyChange(id: number) {
        //刷新右侧面板
        this.exhibitionPanel.updatePanel(this.diffConfigs[this.curSelectedDiff], this.curSelectedDiff);
    }

    setTipMask(): boolean {
        let pinstanceData = G.DataMgr.pinstanceData;
        let lift = pinstanceData.getWuYuanFuBenDiffState(this.diffConfigs[this.diffConfigs.length - 1].m_iDiff, false);
        if (lift == 0) return false;

        if (G.DataMgr.heroData.energy < this.diffConfigs[0].m_iConsumeValue) return false;

        return true;
    }
    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    getItem(diff: number): UnityEngine.GameObject {
        //let count = Math.floor((diff - 1) / WuYuanFourItem.ITEM_MAX_NUMBER);
        //let itemcount = diff % WuYuanFourItem.ITEM_MAX_NUMBER;
        //let four = this.fourItems[this.pinstanceList.Count - count - 1];
        //return four.getItem(itemcount);
        return null;
    }

    getButton(): UnityEngine.GameObject {
        return this.exhibitionPanel.getButton();
    }

    force(type: EnumGuide, step: EnumGuide, diff: number): boolean {
        if (EnumGuide.HuoBanFuBen_ClickEnter == step) {
            this.exhibitionPanel.clickChallenge();
            return true;
        }
        return false;
    }
}

