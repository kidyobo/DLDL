import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { GuideMgr } from 'System/guide/GuideMgr'
import { HeroData } from 'System/data/RoleData'
import { MonsterData } from 'System/data/MonsterData'
import { PinstanceData } from 'System/data/PinstanceData'
import { Macros } from 'System/protocol/Macros'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { Color } from 'System/utils/ColorUtil'
import { CompareUtil } from 'System/utils/CompareUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumStoreID, EnumMonsterID, EnumPinstanceRule, EnumGuide, EnumEffectRule } from 'System/constants/GameEnum'
import { WstLayerRankItemData } from 'System/data/WstLayerRankItemData'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List, ListItem } from 'System/uilib/List'
import { FixedList } from 'System/uilib/FixedList'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { VipView } from 'System/vip/VipView'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { QiangHuaFuBenGuider } from 'System/guide/cases/QiangHuaFuBenGuider'
import { ExchangeView } from 'System/business/view/ExchangeView'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'

export class RankListItemData {
    roleName: string;
    rank: number;
    value: number;
}

/**
 * 【副本大厅 - 强化副本】面板。 *
 *
 * @author teppei
 *
 */
export class DiZheZhiLuPanel extends TabSubForm implements IGuideExecutor {

    /**重置最大花费*/
    private readonly resetMaxCost = 300;
    /**每10层花费*/
    private readonly oneceCost = 60;

    /**vip9级副本刷新次数最大*/
    private readonly MaxEnterCountVIPLv: number = 9;

    private m_rewardList: RewardIconItemData[] = [];

    private m_diffConfigs: GameConfig.PinstanceDiffBonusM[] = [];

    /**引导箭头的ID。*/
    private m_arrowId: number = 0;

    /**是否强制显示当前的boss。*/
    private m_forceCurrent: boolean = false;

    private m_noPrompt: boolean = false;

    private _allRankListData: RankListItemData[] = new Array<RankListItemData>();

    //挑战层列表
    private list: List;
    /**可刷新次数*/
    private txtShuaXin: UnityEngine.UI.Text = null;
    /**可扫荡的层数*/
    private txtSaoDang: UnityEngine.UI.Text = null;
    /**重置按钮*/
    private btnShuaXin: UnityEngine.GameObject;
    /**扫荡按钮*/
    private btnSaodang: UnityEngine.GameObject;

    private rankList: List;
    private txtMyRank: UnityEngine.UI.Text;

    private btnStore: UnityEngine.GameObject;

    private itemIcon_Normal: UnityEngine.GameObject;
    private nameAltas: Game.UGUIAltas;

    private diff2item: { [diff: number]: ListItem } = {};
    private guideDiff = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_DZZL);
        //得到所有层数
        this.m_diffConfigs = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_WST);
    }

    protected resPath(): string {
        return UIPathData.DiZheZhiLuView;
    }

    protected initElements() {
        this.txtShuaXin = this.elems.getText('txtShuaXin');
        this.txtSaoDang = this.elems.getText('txtSaoDang');
        this.list = this.elems.getUIList('list');
        this.rankList = this.elems.getUIList("rankList");
        this.txtMyRank = this.elems.getText("txtMyRank");
        this.btnShuaXin = this.elems.getElement('btnShuaXin');
        this.btnSaodang = this.elems.getElement('btnSaodang');
        this.btnStore = this.elems.getElement('btnStore');
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this.nameAltas = this.elems.getElement('nameAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.list.Count = this.m_diffConfigs.length;
    }

    protected initListeners() {
        this.addClickListener(this.btnShuaXin, this._onClickBtnReset);
        this.addClickListener(this.btnSaodang, this._onClickBtnSaodang);
        this.addClickListener(this.btnStore, this.onClickBtnStore);

        this.list.onVirtualItemChange = delegate(this, this.onChange);
        this.rankList.onVirtualItemChange = delegate(this, this.onRankListChange);
    }
    private onChange(item: ListItem) {
        let diff = item.Index + 1;
        this.diff2item[diff] = item;

        let info = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_WST);
        let crtLv = 0;
        let maxLv = 0;
        if (null != info) {
            crtLv = info.m_uiCurLevel;
            maxLv = info.m_uiMaxLevel;
        }

        let diffCfg = this.m_diffConfigs[item.Index];
        let bossConfig = MonsterData.getMonsterConfig(EnumMonsterID.WuShenTanBase + item.Index + 1);

        let ctn = item.findObject("ctn");//需要置灰的物体
        //let tzjl = ElemFinder.findObject(ctn, 'tzjl');
        //推荐战力
        let tjzl = ElemFinder.findText(ctn, 'tjzl');
        //
        let tgkhd = item.findObject('tgkhd');
        let passFlag = item.findObject('passFlag');
        let btnGo = item.findObject('btnGo');
        let level = ElemFinder.findText(ctn, 'levelBg/level');
        let textLimit = ElemFinder.findText(ctn, 'textLimit');
        let imgHead = ElemFinder.findRawImage(ctn, 'head/imgHead');
        let lock = item.findObject('lock');
        let title = ElemFinder.findText(ctn, 'nameBg/title');
        tjzl.text = uts.format('推荐战力：{0}', diffCfg.m_iFightPower);

        Game.UIClickListener.Get(btnGo).onClick = delegate(this, this._onClickBtnGo, diffCfg);


        level.text = uts.format('第{0}层', diff);
        title.text = bossConfig.m_szMonsterName;
        G.ResourceMgr.loadImage(imgHead, uts.format('images/head/{0}.png', bossConfig.m_iHeadID), -1);

        let bonusList: GameConfig.PinstanceDiffThing[];
        if (diff > maxLv) {
            // 从来没打过，显示终生首通
            bonusList = diffCfg.m_stLifeBonus;
        } else {
            // 显示今日首通
            bonusList = diffCfg.m_stDailyBonus;
        }

        let effRule = EnumEffectRule.normal;
        let needLock = false;
        if (diff <= crtLv) {
            // 今天已经通关了
            passFlag.SetActive(true);
            textLimit.gameObject.SetActive(false);
            //tzjl.SetActive(true);
            tjzl.gameObject.SetActive(true);
            btnGo.SetActive(false);
            tgkhd.SetActive(false);
            //tzjl.SetActive(false);
            tjzl.gameObject.SetActive(false);
            imgHead.color = Color.toUnityColor('ffffffff');
            UIUtils.setGrey(ctn, true);
            effRule = EnumEffectRule.none;
        } else {
            passFlag.SetActive(false);
            if (G.DataMgr.heroData.level < diffCfg.m_iOpenLevel) {
                textLimit.text = uts.format('{0}级可解锁', diffCfg.m_iOpenLevel);
                textLimit.gameObject.SetActive(true);
                btnGo.SetActive(false);
                tgkhd.SetActive(true);
                //tzjl.SetActive(false);
                tjzl.gameObject.SetActive(false);
                imgHead.color = Color.toUnityColor('595959ff');
                UIUtils.setGrey(ctn, false);
                needLock = true;
            } else if (diff > crtLv + 1) {
                textLimit.gameObject.SetActive(false);
                btnGo.SetActive(false);
                tgkhd.SetActive(true);
                //tzjl.SetActive(true);
                tjzl.gameObject.SetActive(true);
                imgHead.color = Color.toUnityColor('595959ff');
                UIUtils.setGrey(ctn, false);
            } else {
                textLimit.gameObject.SetActive(false);
                btnGo.SetActive(true);
                tgkhd.SetActive(false);
                //tzjl.SetActive(true);
                tjzl.gameObject.SetActive(true);
                imgHead.color = Color.toUnityColor('ffffffff');
                UIUtils.setGrey(ctn, false);
            }
        }

        lock.SetActive(needLock);

        let rewardList = item.findUIList('rewardList');
        let bcnt = 0;
        if (bonusList != null) {
            bcnt = bonusList.length;
        }
        rewardList.Count = bcnt;
        let iconItems: IconItem[] = item.data.iconItems;
        if (!iconItems) {
            item.data.iconItems = iconItems = [];
        }
        for (let i = 0; i < bcnt; i++) {
            let iconItem: IconItem = iconItems[i];
            if (iconItem == null) {
                iconItems[i] = iconItem = new IconItem();
                let itemGo = rewardList.GetItem(i).gameObject;
                iconItem.setUsualIconByPrefab(this.itemIcon_Normal, ElemFinder.findObject(itemGo, 'iconRoot'));
                iconItem.setTipFrom(TipFrom.normal);
            }
            let bcfg = bonusList[i];
            iconItem.effectRule = effRule;
            iconItem.updateById(bcfg.m_iThingId, bcfg.m_iThingNum);
            iconItem.updateIcon();
        }

        if (this.guideDiff == diff) {
            let guider = G.GuideMgr.getCurrentGuider(EnumGuide.QiangHuaFuBen) as QiangHuaFuBenGuider;
            if (null != guider) {
                guider.onItemShowUp(item.gameObject);
            }
        }
    }

    protected onOpen() {
        // 打开时拉取进度
        G.DataMgr.pinstanceData.everShowQhfb = true;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, Macros.PINSTANCE_ID_WST));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_GET_RANKINFO, Macros.PINSTANCE_ID_WST));

        G.GuideMgr.processGuideNext(EnumGuide.QiangHuaFuBen, EnumGuide.QiangHuaFuBen_OpenView);
    }

    protected onClose() {

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

    private onClickBtnStore() {
        G.Uimgr.createForm<ExchangeView>(ExchangeView).open(EnumStoreID.MALL_REPUTATION);
        G.Uimgr.bindCloseCallback(ExchangeView, PinstanceHallView, this.id);
    }

    private _onClickBtnGo(diffCfg: GameConfig.PinstanceDiffBonusM): void {
        let power = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
        let tjzlLimit = diffCfg.m_iFightPower * 0.9;
        if (power < tjzlLimit) {
            G.TipMgr.showConfirm('当前战力远低于推荐通关战力，副本难度较大，是否继续挑战？', ConfirmCheck.noCheck, '是|否', delegate(this, this.onConfirmClick, diffCfg));
        } else {
            G.ModuleMgr.pinstanceModule.tryEnterQiangHuaFuBen(diffCfg.m_iDiff);
        }


        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.QiangHuaFuBen, EnumGuide.QiangHuaFuBen_ClickEnter);
    }

    private onConfirmClick(stage: number, isCheckSelected: boolean, diffCfg: GameConfig.PinstanceDiffBonusM): void {
        if (MessageBoxConst.yes == stage) {
            G.ModuleMgr.pinstanceModule.tryEnterQiangHuaFuBen(diffCfg.m_iDiff);
        }
    }

    private _onClickBtnReset(): void {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_WST);
        if (null == info) {
            return;
        }
        // 重置次数
        let pconfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(info.m_iPinId);
        // 免费重置次数
        let freeTimes = pconfig.m_ucEnterTimes;
        //已经重置次数
        let resetNum = info.m_ucResetNum;
        if (resetNum < freeTimes) {
            // 可以免费重置
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_RESET, Macros.PINSTANCE_ID_WST));
        } else {
            let curVipLevel: number = G.DataMgr.heroData.curVipLevel;
            //能够购买次数
            let canBuyTimes: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WST_EXT_NUM, curVipLevel);
            let totalTimes = canBuyTimes + freeTimes;
            //剩余次数
            let leftTimes: number = Math.max(0, totalTimes - resetNum);
            let openPrivilegeLvs = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.VIP_PARA_WST_EXT_NUM);
            if (leftTimes > 0) {
                if (!this.m_noPrompt) {
                    // 还能购买
                    let vipStr: string = TextFieldUtil.getVipText(curVipLevel, openPrivilegeLvs[0]);

                    let need = Math.ceil(info.m_uiCurLevel / 10) * this.oneceCost;

                    let cost: number = need > this.resetMaxCost ? this.resetMaxCost : need;
                    let str1: string = uts.format('是否花费{0}购买1次重置次数？({1}可购买{2}次，您当前剩余{3}次购买机会)',
                        TextFieldUtil.getYuanBaoText(cost),
                        TextFieldUtil.getColorText(vipStr, Color.BLUE), TextFieldUtil.getColorText(canBuyTimes.toString(), Color.BLUE),
                        TextFieldUtil.getColorText(Math.floor(totalTimes - resetNum).toString(), Color.BLUE));
                    G.TipMgr.showConfirm(str1, ConfirmCheck.withCheck, '确定|取消', delegate(this, this._onConfirmBuy));
                }
                else {
                    let cost: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WST_BUY_PIRCE, G.DataMgr.heroData.curVipLevel);
                    if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                        // 后台会购买后自动重置
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_RESET, Macros.PINSTANCE_ID_WST));
                    }
                }
            }
            else {
                // 提示提升月卡
                if (G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_WST_EXT_NUM)) {
                    let moreVip: number = G.DataMgr.vipData.getMoreTimesVipLevel(G.DataMgr.heroData.curVipLevel, KeyWord.VIP_PARA_WST_EXT_NUM);
                    if (G.DataMgr.heroData.curVipLevel >= this.MaxEnterCountVIPLv) {
                        G.TipMgr.showConfirm('您今天的重置次数已用完！', ConfirmCheck.noCheck, '确定');
                    }
                    else {
                        G.TipMgr.showConfirm(uts.format('激活{0}可继续购买重置次数', TextFieldUtil.getVipText(moreVip, openPrivilegeLvs[0])), ConfirmCheck.noCheck, '确定', delegate(this, this._onResetVipConfirm));
                    }
                } else {
                    G.TipMgr.showConfirm(uts.format('激活{0}可使用重置功能', TextFieldUtil.getMultiVipMonthTexts(openPrivilegeLvs)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onResetVipConfirm, openPrivilegeLvs));
                }
            }
        }
    }

    private _onResetVipConfirm(stage: MessageBoxConst, isCheckSelected: boolean): void {
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
    private _onConfirmBuy(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            this.m_noPrompt = isCheckSelected;
            // 检查钻石       
            let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_WST);

            let need = Math.ceil(info.m_uiCurLevel / 10) * this.oneceCost;
            let cost: number = need > this.resetMaxCost ? this.resetMaxCost : need;

            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                // 后台会购买后自动重置
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_RESET, Macros.PINSTANCE_ID_WST));
            }
        }
    }

    private _onClickBtnSaodang(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(Macros.PINSTANCE_ID_WST, false));
        //let vipData = G.DataMgr.vipData;
        //if (vipData.hasPrivilege(KeyWord.PRI_PARA_ONEKEY_WST)) {
        //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(Macros.PINSTANCE_ID_WST, false));
        //    this.isSaoDangSucceed = true;
        //}
        //else {
        //    let levels = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.PRI_PARA_ONEKEY_WST);
        //    G.TipMgr.showConfirm(uts.format('激活{0}可使用扫荡功能', TextFieldUtil.getMultiVipMonthTexts(levels)), ConfirmCheck.noCheck, '确定', delegate(this, this._onSaodangVipConfirm, levels));
        //}
    }

    //private _onSaodangVipConfirm(stage: MessageBoxConst, isCheckSelected: boolean, levels: number[]): void {
    //    if (MessageBoxConst.yes == stage) {
    //        G.Uimgr.createForm<PrivilegeView>(PrivilegeView).open(EnumPrivilegeTab.Main, levels[0]);
    //    }
    //}

    updateView(): void {
        let _info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_WST);
        if (null == _info) {
            return;
        }

        //默认选择可进入的层数
        let autoIdx = _info.m_uiCurLevel;
        if (autoIdx >= PinstanceData.QiangHuaFuBenMaxLv - 1) {
            autoIdx = PinstanceData.QiangHuaFuBenMaxLv - 1;
        }
        this.list.ScrollByAxialRow(Math.max(0, Math.floor(autoIdx / 3)));
        this.list.Refresh();
        // 重置次数
        let pconfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(Macros.PINSTANCE_ID_WST);
        // 免费次数
        let freeTimes = pconfig.m_ucEnterTimes;
        let curVipLevel: number = G.DataMgr.heroData.curVipLevel;
        //能够购买次数
        let canBuyTimes: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_WST_EXT_NUM, curVipLevel);
        let totalTimes = freeTimes + canBuyTimes;
        let leftTimes: number = Math.max(0, totalTimes - _info.m_ucResetNum);

        this.txtShuaXin.text = uts.format('重置次数：{0}/{0}', TextFieldUtil.getColorText(leftTimes.toString(), leftTimes > 0 ? Color.GREEN : Color.RED), totalTimes);
        // 扫荡次数
        if (_info.m_uiMaxLevel > 0 && _info.m_uiCurLevel < _info.m_uiMaxLevel) {
            this.txtSaoDang.text = uts.format('扫荡至{0}层', TextFieldUtil.getColorText(_info.m_uiMaxLevel.toString(), _info.m_uiMaxLevel > 0 ? Color.GREEN : Color.RED));
            UIUtils.setButtonClickAble(this.btnSaodang, true);
        }
        else {
            this.txtSaoDang.text = '当前不可扫荡';
            UIUtils.setButtonClickAble(this.btnSaodang, false);
        }
        let txtReset = this.btnShuaXin.transform.Find("Text").GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
        if (_info.m_uiCurLevel > 0) {
            // 当重置次数0，且无法购买时按钮灰掉
            // 已购买次数
            let boughtTimes: number = G.DataMgr.vipData.getReserveTime(Macros.PINSTANCE_ID_WST);
            if (leftTimes > 0) {
                // 还有重置次数  
                UIUtils.setButtonClickAble(this.btnShuaXin, true);
                if (_info.m_ucResetNum < freeTimes) {
                    txtReset.text = '免费重置';
                } else {
                    txtReset.text = '购买重置';
                }
            }
            else {
                // 没有次数也不能购买              
                let moreVip: number = G.DataMgr.vipData.getMoreTimesVipLevel(G.DataMgr.heroData.curVipLevel, KeyWord.VIP_PARA_WST_EXT_NUM);
                if (moreVip > G.DataMgr.heroData.curVipLevel) {
                    // 可以继续提升月卡购买
                    txtReset.text = '购买重置';
                    UIUtils.setButtonClickAble(this.btnShuaXin, true);
                }
                else {
                    txtReset.text = '重置副本';
                    UIUtils.setButtonClickAble(this.btnShuaXin, !G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_WST_EXT_NUM));
                }
            }
        }
        else {
            // 没有挑战过，不给重置
            txtReset.text = '重置副本';
            UIUtils.setButtonClickAble(this.btnShuaXin, false);
        }

        this.updateAllRankList();
    }

    private updateAllRankList(): void {
        let passInfo: Protocol.RankPinInfo = G.DataMgr.pinstanceData.getPinstanceRankInfo(Macros.PINSTANCE_ID_WST);
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
        this.rankList.Count = this._allRankListData.length;
    }

    getItem(): UnityEngine.GameObject {
        this.guideDiff = G.DataMgr.pinstanceData.getCurQiangHuaFuBenLv();

        let item = this.diff2item[this.guideDiff];
        if (null != item) {
            return item.gameObject;
        }
        return null;
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide): boolean {
        if (EnumGuide.QiangHuaFuBen_ClickEnter == step) {
            let crtDiff = G.DataMgr.pinstanceData.getCurQiangHuaFuBenLv();
            if (crtDiff > 0) {
                this._onClickBtnGo(this.m_diffConfigs[crtDiff - 1]);
                return true;
            }
        }
        return false;
    }
}
