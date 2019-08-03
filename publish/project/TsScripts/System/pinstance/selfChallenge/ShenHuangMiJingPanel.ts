import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { EnumPinstanceRule, EnumGuide, EnumRewardState } from 'System/constants/GameEnum'
import { HeroData } from 'System/data/RoleData'
import { RankListItemData } from 'System/pinstance/selfChallenge/SelfChallengeRankView'
import { CompareUtil } from 'System/utils/CompareUtil'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { PinstanceData } from 'System/data/PinstanceData'
import { Macros } from 'System/protocol/Macros'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { ShouHuNvShenItemData } from 'System/data/ShouHuNvShenItemData'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { MathUtil } from 'System/utils/MathUtil'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List, ListItem } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { SelfChallengeRankView } from 'System/pinstance/selfChallenge/SelfChallengeRankView'
import { RewardView } from 'System/pinstance/selfChallenge/RewardView'
import { TipFrom } from 'System/tip/view/TipsView'
import { VipView } from 'System/vip/VipView'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'

/**
 * 经验副本
 */
export class ShenHuangMiJingPanel extends TabSubForm implements IGuideExecutor {

    /**重置最大花费*/
    private readonly resetMaxCost = 50;
    /**每10层花费*/
    private readonly oneceCost = 5;

    /**vip9级副本刷新次数最大*/
    private readonly MaxEnterCountVIPLv: number = 9;
    private rewardDataList: { [key: number]: RewardIconItemData[] };
    private rewardDatas: RewardIconItemData[] = [];

    /**奖励obj*/
    private boxObjList: UnityEngine.GameObject = null;
    /**奖励（目前12个）*/
    private boxList: List;

    private rewardItemData: ShouHuNvShenItemData[] = [];
    private m_diffConfigs: GameConfig.PinstanceDiffBonusM[];

    //按钮
    btnGo: UnityEngine.GameObject;
    private txtGo: UnityEngine.UI.Text;

    private m_btnSaodang: UnityEngine.GameObject;
    /**双倍扫荡按钮*/
    private btnDblSaodang: UnityEngine.GameObject;
    private textDblPrice: UnityEngine.UI.Text;
    private bangYuan: UnityEngine.UI.Image;
    private textBuff: UnityEngine.UI.Text;
    private btName: UnityEngine.UI.Text;
    //private m_btnReset: UnityEngine.GameObject;
    //private txtReset: UnityEngine.UI.Text;
    private rankList: List;
    private txtMyRank: UnityEngine.UI.Text;
    private btnRule: UnityEngine.GameObject;


    private m_noPrompt: boolean = false;

    private _allRankListData: RankListItemData[] = [];
    /**当前层数*/
    private txtCurSD: UnityEngine.UI.Text = null;
    /**自动扫荡将直接进入下一层*/
    // private txtNextSD: UnityEngine.UI.Text = null;
    /**重置次数*/
    private txtResetNum: UnityEngine.UI.Text = null;

    /**动画组件*/
    private animator: UnityEngine.Animator = null;

    private ruleTipData: TextTipData = new TextTipData();

    private rewardBoxItems: JingYanFuBenRewardBoxItem[] = [];

    private list: List;
    private items: JingYanFuBenItem[] = [];

    private dblPrice = 0;
    /**打开面板是免费扫荡要显示一次提示框*/
    private isOpenConfirm: boolean = true;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_SHMJ);
        this.ruleTipData.setTipData(G.DataMgr.langData.getLang(141));
    }

    protected resPath(): string {
        return UIPathData.ShenHuangMiJingView;
    }

    protected initElements() {
        this.btnRule = this.elems.getElement('btnRule');
        this.txtCurSD = this.elems.getText('txtCurSD');
        // this.txtNextSD = this.elems.getText('txtNextSD');
        this.txtResetNum = this.elems.getText('txtShuaXin');
        this.btnGo = this.elems.getElement('btnGo');
        this.txtGo = this.elems.getText('txtGo');
        //this.m_btnReset = this.elems.getElement('btnShuaXin');
        //this.txtReset = this.elems.getText('txtReset');
        this.m_btnSaodang = this.elems.getElement('btnSaodang');
        this.btnDblSaodang = this.elems.getElement('btnDblSaodang');
        this.textDblPrice = this.elems.getText('textDblPrice');
        this.bangYuan = this.elems.getImage("bangYuan");
        this.textBuff = this.elems.getText("textBuff");
        this.btName = this.elems.getText("btName");
        this.rankList = this.elems.getUIList("rankList");
        this.txtMyRank = this.elems.getText("txtMyRank");

        this.boxList = this.elems.getUIList('boxList');
        this.animator = this.boxList.gameObject.GetComponentInChildren(UnityEngine.Animator.GetType()) as UnityEngine.Animator;

        this.list = this.elems.getUIList("list");

        // 设置双倍扫荡价格
        this.dblPrice = G.DataMgr.constData.getValueById(KeyWord.PARAM_SHNS_DOUBLE_EXP_PRICE);
        this.textDblPrice.text = this.dblPrice.toString();

        //得到副本信息
        this.m_diffConfigs = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_SHNS);
        let diffCnt = this.m_diffConfigs.length;
        this.list.Count = Math.ceil(diffCnt / PinstanceData.JingYanFuBenGroupSize);
        this.boxList.Count = Math.ceil(diffCnt / PinstanceData.ShouHuNvShenGiftPerLv);
    }

    protected initListeners() {
        this.addClickListener(this.btnGo, this.onClickBtnGo);
        //this.addClickListener(this.m_btnReset, this.onClickBtnReset);
        this.addClickListener(this.m_btnSaodang, this.onClickBtnSaodang);
        this.addClickListener(this.btnDblSaodang, this.onClickBtnDblSaodang);
        this.addClickListener(this.btnRule, this.onClickBtnRule);
        this.rankList.onVirtualItemChange = delegate(this, this.onRankListChange);
    }

    protected onOpen() {
        // 打开时拉取进度
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, Macros.PINSTANCE_ID_SHNS));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_GET_RANKINFO, Macros.PINSTANCE_ID_SHNS));

        G.GuideMgr.processGuideNext(EnumGuide.JingYanFuBen, EnumGuide.JingYanFuBen_OpenView);
    }

    protected onClose() {

    }

    private onClickBtnRule() {
        G.ViewCacher.tipsView.open(this.ruleTipData, TipFrom.normal);
    }

    private onRankListChange(item: ListItem) {
        let rankData = this._allRankListData[item.Index];
        let txtRank = item.findText("txtRank");
        let txtName = item.findText("txtName");
        let txtCeng = item.findText("txtCeng");
        let imgBg2 = item.findImage("bg2");

        imgBg2.gameObject.SetActive(item.Index % 2 != 0);
        txtRank.text = rankData.rank.toString();
        txtName.text = rankData.roleName;
        txtCeng.text = rankData.value.toString();
    }

    private onClickBtnGo(): void {
        G.ModuleMgr.pinstanceModule.tryEnterShenHuangMiJing();

        G.GuideMgr.processGuideNext(EnumGuide.JingYanFuBen, EnumGuide.JingYanFuBen_ClickEnter);
    }

    /**重置副本*/
    private onClickBtnReset(): void {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null == info) {
            return;
        }

        // 重置次数
        let pconfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(info.m_iPinId);
        // 免费次数
        let freeTimes = pconfig.m_ucEnterTimes;
        //已经重置次数
        let resetNum = info.m_ucResetNum;
        if (resetNum < freeTimes) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_RESET, Macros.PINSTANCE_ID_SHNS));
        } else {
            let curVipLevel: number = G.DataMgr.heroData.curVipLevel;
            //能够购买次数
            let canBuyTimes: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WST_EXT_NUM, curVipLevel);
            // 总的可重置次数
            let totalTimes = freeTimes + canBuyTimes;
            //剩余次数
            let leftTimes: number = Math.max(0, totalTimes - resetNum);
            let openPrivilegeLvs = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.VIP_PARA_WST_EXT_NUM);
            if (leftTimes > 0) {
                if (!this.m_noPrompt) {
                    // 还能购买
                    let vipStr: string = TextFieldUtil.getVipText(curVipLevel, openPrivilegeLvs[0]);
                    // let cost: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_SHNS_BUY_PIRCE, G.DataMgr.heroData.curVipLevel);
                    let need = Math.ceil(info.m_uiCurLevel / 10) * this.oneceCost;
                    let cost: number = need > this.resetMaxCost ? this.resetMaxCost : need;

                    let str1: string = uts.format('是否花费{0}购买1次重置次数？({1}可购买{2}次，您当前剩余{3}次购买机会)',
                        TextFieldUtil.getYuanBaoText(cost),
                        TextFieldUtil.getColorText(vipStr, Color.BLUE), TextFieldUtil.getColorText(canBuyTimes.toString(), Color.BLUE),
                        TextFieldUtil.getColorText(Math.floor(totalTimes - resetNum).toString(), Color.BLUE));
                    G.TipMgr.showConfirm(str1, ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onConfirmBuy));
                }
                else {
                    let cost: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WST_BUY_PIRCE, G.DataMgr.heroData.curVipLevel);
                    if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                        // 后台会购买后自动重置
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_RESET, Macros.PINSTANCE_ID_SHNS));
                    }
                }
            }
            else {
                // 提示提升月卡
                let moreVip: number = G.DataMgr.vipData.getMoreTimesVipLevel(G.DataMgr.heroData.curVipLevel, KeyWord.VIP_PARA_WST_EXT_NUM);
                let str2: string;
                if (G.DataMgr.heroData.curVipLevel >= this.MaxEnterCountVIPLv) {
                    G.TipMgr.showConfirm('您今天的重置次数已用完！', ConfirmCheck.noCheck, '确定');
                }
                else {
                    G.TipMgr.showConfirm(uts.format('激活{0}可继续购买重置次数', TextFieldUtil.getVipText(moreVip, openPrivilegeLvs[0])), ConfirmCheck.noCheck, '确定', delegate(this, this.onConfirm));
                }
            }
        }
    }

    /**提示确定*/
    private onConfirm(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open();
        }
    }

    /**
     *
     * @param stage
     * @param args
     * @param isCheckSelected
     *
     */
    private onConfirmBuy(stage: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            this.m_noPrompt = isCheckSelected;
            // 检查钻石
            // let cost: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_SHNS_BUY_PIRCE, G.DataMgr.heroData.curVipLevel);
            let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
            let need = Math.ceil(info.m_uiCurLevel / 10) * this.oneceCost;
            let cost: number = need > this.resetMaxCost ? this.resetMaxCost : need;

            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                // 后台会自动购买并重置
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_RESET, Macros.PINSTANCE_ID_SHNS));
            }
        }
    }

    /**扫荡*/
    private onClickBtnSaodang(): void {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null == info) {
            uts.logError("没有拿到副本信息数据");
            return;
        }
        if (info.m_ucExpPinDouble != 1 && this.isOpenConfirm) {
            this.isOpenConfirm = false;
            G.TipMgr.showConfirm(uts.format("您当前使用的是一倍扫荡，使用{0}扫荡会获得大量的经验加成，是否花费{1}使用\n{2}扫荡？",
                uts.format('<color=#{0}>{1}</color>', Color.YELLOW, "3倍"),
                TextFieldUtil.getYuanBaoText(this.dblPrice),
                uts.format('<color=#{0}>{1}</color>', Color.YELLOW, "3倍")),
                ConfirmCheck.noCheck, uts.format('是￥{0}:{1}|否', KeyWord.MONEY_YUANBAO_ID, 50), delegate(this, this.doBuyExpPinDouble));
        } else if (info.m_ucExpPinDouble == 1) {
            this.doSaodang(1);
        } else {
            this.doSaodang(0);
        }
    }

    private onClickBtnDblSaodang(): void {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null != info && 1 != info.m_ucExpPinDouble) {
            G.TipMgr.showConfirm(uts.format("是否花费{0}进行扫荡,并获得{1}经验加成？",
                TextFieldUtil.getYuanBaoText(this.dblPrice),
                uts.format('<color=#{0}>{1}</color>', Color.YELLOW, "3倍")),
                ConfirmCheck.noCheck, '是|否', delegate(this, this.doBuyExpPinDouble));
        } else {
            this.doSaodang(1);
        }
    }
    private doBuyExpPinDouble(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            this.doSaodang(1);
        }
    }
    private doSaodang(doublePara: number) {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (0 == doublePara || (null != info && 1 == info.m_ucExpPinDouble) || 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.dblPrice, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(Macros.PINSTANCE_ID_SHNS, false, doublePara));
        }
    }

    //private onSaodangVipConfirm(stage: MessageBoxConst, isCheckSelected: boolean, levels: number[]): void {
    //    if (MessageBoxConst.yes == stage) {
    //        G.Uimgr.createForm<PrivilegeView>(PrivilegeView).open(EnumPrivilegeTab.Main, levels[0]);
    //    }
    //}

    /**更新总排行列表*/
    private updateAllRankList(): void {
        let passInfo: Protocol.RankPinInfo = G.DataMgr.pinstanceData.getPinstanceRankInfo(Macros.PINSTANCE_ID_SHNS);
        if (!passInfo) {
            return;
        }
        let myRank: number = 0;
        let len: number = passInfo.m_stRankInfoList.length;
        this._allRankListData.length = 0;
        for (let i: number = 0; i < len; i++) {
            let rankOne: Protocol.OneAllRankInfo = passInfo.m_stRankInfoList[i];
            if (GameIDUtil.isRoidIsPeople(rankOne.m_stRoleID)) {
                let rank: number = i + 1;
                let heroData: HeroData = G.DataMgr.heroData;
                if (CompareUtil.isRoleIDEqual(heroData.roleID, rankOne.m_stRoleID)) {
                    myRank = rank;
                }
                if (this._allRankListData.length < EnumPinstanceRule.WST_ALL_RANK_MAX_COUNT) {
                    let itemVo: RankListItemData = new RankListItemData();
                    itemVo.roleName = rankOne.m_szNickName;
                    itemVo.value = rankOne.m_usPinLv;
                    itemVo.rank = rank;
                    this._allRankListData.push(itemVo);
                }
            }
        }
        let rankStr: string = myRank > 0 ? myRank.toString() : '未上榜';
        this.txtMyRank.text = uts.format("我的排名：{0}", rankStr);
        this.rankList.Count = this._allRankListData.length;
    }

    private updateList() {
        let info = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        G.DataMgr.pinstanceData.getShnsCanGetIndex();
        let crtLv = 0;
        if (null != info) {
            crtLv = info.m_uiCurLevel;
        }

        let listCnt = this.list.Count;
        let d = G.SyncTime.getDateAfterStartServer();
        for (let i = 0; i < listCnt; i++) {
            let jyfbItem = this.items[i];
            if (jyfbItem == null) {
                this.items[i] = jyfbItem = new JingYanFuBenItem();
                jyfbItem.setCommponents(this.list.GetItem(i).gameObject);
            }
            let diffMin = i * PinstanceData.JingYanFuBenGroupSize + 1;
            let diffCfg = this.m_diffConfigs[diffMin - 1];
            let openDay = 0;
            if (diffCfg.m_iOpenDay > 0 && diffCfg.m_iOpenDay > d) {
                openDay = diffCfg.m_iOpenDay;
            }
            jyfbItem.update(diffMin, crtLv, i, openDay);
        }

        let caclIndex = Math.ceil((crtLv + 1) / PinstanceData.JingYanFuBenGroupSize) - 1;
        //第1个和最后一个，只是放大，其他的滚动到正中间放大
        let autoIdx = 0;
        if (caclIndex == listCnt - 1) {
            autoIdx = caclIndex;
        } else {
            autoIdx = (caclIndex - 1) < 0 ? 0 : (caclIndex - 1);
        }
        this.list.ScrollByAxialRow(autoIdx);

        this.rewardDataList = {};
        let boxCnt = this.boxList.Count;
        for (let i = 0; i < boxCnt; i++) {
            let vo: ShouHuNvShenItemData = this.rewardItemData[i];
            let rewardListData = [];
            for (let key in vo.diffConfig.m_stLifeBonus) {
                let rewardItemVo: RewardIconItemData = RewardIconItemData.alloc();
                rewardItemVo.id = vo.diffConfig.m_stLifeBonus[key].m_iThingId;
                rewardItemVo.number = vo.diffConfig.m_stLifeBonus[key].m_iThingNum;
                rewardListData.push(rewardItemVo);
            }

            if (this.rewardDataList[i] == null) {
                this.rewardDataList[i] = new Array<RewardIconItemData>();
            }
            this.rewardDataList[i] = rewardListData;

            //宝箱显示
            if (this.rewardBoxItems[i] == null) {
                this.rewardBoxItems[i] = new JingYanFuBenRewardBoxItem();
                let boxItem = this.boxList.GetItem(i);
                this.rewardBoxItems[i].setComponents(boxItem.gameObject);
            }
            this.rewardBoxItems[i].updata(vo, this.rewardDataList[i], i, this.rewardItemData);
        }
    }

    updateView(): void {
        // 刷新副本列表
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        if (null == info) {
            return;
        }
        let listData: ShouHuNvShenItemData[] = G.DataMgr.pinstanceData.shnsListData;
        this.rewardItemData = listData;
        // 重置次数
        let pconfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(info.m_iPinId);
        let curVipLevel: number = G.DataMgr.heroData.curVipLevel;
        // 免费次数
        let freeTimes = pconfig.m_ucEnterTimes;
        //能够购买次数
        let canBuyTimes: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WST_EXT_NUM, curVipLevel);
        let totalTimes = freeTimes + canBuyTimes;
        let leftTimes: number = Math.max(0, totalTimes - info.m_ucResetNum);
        this.txtResetNum.text = uts.format('重置次数：{0}', TextFieldUtil.getColorText(leftTimes + '/' + totalTimes, leftTimes > 0 ? Color.GREEN : Color.RED));
        // 扫荡次数        
        this.txtCurSD.text = uts.format('扫荡至{0}层', TextFieldUtil.getColorText(info.m_uiMaxLevel.toString(), info.m_uiMaxLevel > 0 ? Color.GREEN : Color.RED));
        //if (info.m_uiMaxLevel > 0) {
        //    if (info.m_uiMaxLevel < this.m_diffConfigs.length) {
        //        this.txtNextSD.text = uts.format('扫荡后可直接进入：第 {0} 层', TextFieldUtil.getColorText((info.m_uiMaxLevel + 1).toString(), Color.GREEN));
        //    }
        //}
        let saodangGrey = info.m_uiMaxLevel > 0 && info.m_uiCurLevel < info.m_uiMaxLevel;

        UIUtils.setButtonClickAble(this.m_btnSaodang, saodangGrey && info.m_ucExpPinDouble != 1);
        if (info.m_ucExpPinDouble == 1) {
            this.btName.gameObject.SetActive(false);
            this.bangYuan.gameObject.SetActive(false);
            this.textDblPrice.gameObject.SetActive(false);
            this.textBuff.gameObject.SetActive(true);
        }
        UIUtils.setButtonClickAble(this.btnDblSaodang, saodangGrey);

        if (info.m_uiCurLevel > 0) {
            // 打过了
            if (info.m_uiCurLevel < this.m_diffConfigs.length) {
                let nextDiffCfg = this.m_diffConfigs[info.m_uiCurLevel];
                UIUtils.setButtonClickAble(this.btnGo, 0 == nextDiffCfg.m_iOpenDay || G.SyncTime.getDateAfterStartServer() >= nextDiffCfg.m_iOpenDay);
                this.txtGo.text = uts.format('继续第{0}关', (info.m_uiCurLevel + 1));
            }
            else {
                UIUtils.setButtonClickAble(this.btnGo, false);
                if (leftTimes > 0) {
                    this.txtGo.text = '重置后开始';
                }
                else {
                    this.txtGo.text = '已全部通关';
                }
            }
        }
        else {

            this.txtGo.text = '开始挑战';
            UIUtils.setButtonClickAble(this.btnGo, true);
        }
        //this.txtMyRank.text = uts.format("我的排名：{0}",)
        this.updateList();

        this.updateAllRankList();
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide): boolean {
        if (EnumGuide.JingYanFuBen_ClickEnter == step) {
            this.onClickBtnGo();
        }
        return false;
    }
}


class JingYanFuBenItem {
    private txtNum: UnityEngine.UI.Text;
    private objProgress: UnityEngine.GameObject;
    private objProgressBg: UnityEngine.GameObject;
    private objActive: UnityEngine.Transform;

    private openDay: UnityEngine.GameObject;
    private textOpenDay: UnityEngine.UI.Text;

    private Lockstatus: UnityEngine.GameObject;
    private Nostatus: UnityEngine.GameObject;
    private Yesstatus: UnityEngine.GameObject;

    setCommponents(go: UnityEngine.GameObject) {
        this.objProgress = ElemFinder.findObject(go, "progress");
        this.objProgressBg = ElemFinder.findObject(go, "progress/bg");
        this.objActive = ElemFinder.findTransform(this.objProgress, "activeObj");
        this.txtNum = ElemFinder.findText(go, "title/txtNum");
        this.Lockstatus = ElemFinder.findObject(go, 'lockStatus');
        this.Nostatus = ElemFinder.findObject(go, 'noStatus')
        this.Yesstatus = ElemFinder.findObject(go, 'yesStatus')

        this.openDay = ElemFinder.findObject(go, 'openDay');
        this.textOpenDay = ElemFinder.findText(this.openDay, 'textOpenDay');
    }

    update(diffMin: number, crtLv: number, index: number, openDay: number) {
        this.objProgress.SetActive(true);
        let diffMax = diffMin + PinstanceData.JingYanFuBenGroupSize - 1;
        this.txtNum.text = diffMin + "-" + diffMax;
        let childNum = this.objActive.childCount;
        for (let i = 0; i < childNum; i++) {
            let bActive = i + diffMin - 1 < crtLv;
            this.objActive.GetChild(i).gameObject.SetActive(bActive);
        }

        let isLock = diffMin > crtLv + 1 || openDay > 0;
        this.Lockstatus.SetActive(isLock);
        if (isLock) {
            this.Yesstatus.SetActive(false);
            this.Nostatus.SetActive(false);
        }
        else {
            if (crtLv >= diffMax) {
                this.Yesstatus.SetActive(true);
                this.Nostatus.SetActive(false);
            }
            else {
                this.Yesstatus.SetActive(false);
                this.Nostatus.SetActive(true);
            }
        }

        this.openDay.SetActive(openDay > 0);
        this.objProgressBg.SetActive(!(openDay > 0));
        if (openDay > 0) {
            this.textOpenDay.text = uts.format('开服第{0}天解锁', openDay);
        }
    }
}

class JingYanFuBenRewardBoxItem {
    /**12个奖励*/
    private maxCount: number = 12;
    /**波次*/
    private txtboci: UnityEngine.UI.Text;
    /**宝箱的3种状态*/
    private objBox1: UnityEngine.GameObject;
    private objBox2: UnityEngine.GameObject;
    private objBox3: UnityEngine.GameObject;

    private rewardDatas: RewardIconItemData[];
    private inselectIndexdex: number = 0;
    private selectIndex: number = 0;
    private rewardItemData: ShouHuNvShenItemData[] = [];

    private btnReward: UnityEngine.GameObject;
    private txtTip: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        this.txtboci = ElemFinder.findText(go, "text");
        this.btnReward = ElemFinder.findObject(go, "btnReward");
        this.objBox1 = ElemFinder.findObject(go, "rewardBg/box1");
        this.objBox2 = ElemFinder.findObject(go, "rewardBg/box2");
        this.objBox3 = ElemFinder.findObject(go, "rewardBg/box3");
        this.txtTip = ElemFinder.findText(go, "txtTip");
        this.btnReward.SetActive(false);
        this.txtTip.gameObject.SetActive(true);
        Game.UIClickListener.Get(this.btnReward).onClick = delegate(this, this.onClickReward);
    }


    updata(vo: ShouHuNvShenItemData, rewardDatas: RewardIconItemData[], index: number, data: ShouHuNvShenItemData[]) {
        this.rewardDatas = rewardDatas;
        this.selectIndex = index;
        this.rewardItemData = data;
        // 领取状态
        if (vo.isGiftDrawn) {
            // 已领取  
            this.objBox1.SetActive(false);
            this.objBox2.SetActive(false);
            this.objBox3.SetActive(true);
            if (this.btnReward.activeSelf == false) {
                this.btnReward.SetActive(true);
                this.txtTip.gameObject.SetActive(false);
            }
            UIUtils.setGrey(this.btnReward, true);
        }
        else if (vo.isLifePassed) {
            // 已首通  
            this.objBox1.SetActive(false);
            this.objBox2.SetActive(true);
            this.objBox3.SetActive(false);
            if (this.btnReward.activeSelf == false) {
                this.btnReward.SetActive(true);
                this.txtTip.gameObject.SetActive(false);
            }
            UIUtils.setGrey(this.btnReward, false);

        }
        else {
            // 未首通 
            this.objBox1.SetActive(true);
            this.objBox2.SetActive(false);
            this.objBox3.SetActive(false);

            this.btnReward.SetActive(false);
            this.txtTip.gameObject.SetActive(true);
            this.txtTip.text = uts.format("首通第{0}波领取", ((index + 1) * PinstanceData.ShouHuNvShenGiftPerLv).toString());
        }
        this.txtboci.text = "第" + ((index + 1) * PinstanceData.ShouHuNvShenGiftPerLv) + "波";
    }

    private onClickReward() {
        let itemData = this.rewardItemData[this.selectIndex];
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_GETGIFT, Macros.PINSTANCE_ID_SHNS, null, itemData.diffConfig.m_iDiff));
    }
}