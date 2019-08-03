import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { UIPathData } from "System/data/UIPathData"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { Constants } from 'System/constants/Constants'
import { QuestData } from 'System/data/QuestData'
import { Macros } from 'System/protocol/Macros'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { KeyWord } from 'System/constants/KeyWord'
import { UnitData, RoleData } from "System/data/RoleData"
import { UIUtils } from 'System/utils/UIUtils'
import { EnumGuide } from 'System/constants/GameEnum'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { PinstanceData } from 'System/data/PinstanceData'
import { UnitCtrlType, GameIDType, SceneID, EnumEffectRule, EnumStoreID, EnumAutoUse } from 'System/constants/GameEnum'
export class BoatView extends CommonForm implements IGuideExecutor {

    /**灵舟刷新按钮*/
    btnRefresh: UnityEngine.GameObject;
    /**开始按钮。*/
    btnStart: UnityEngine.GameObject;
    /**每天免费刷新最大次数。*/
    private MAX_FREE_REFRESH: number = 0;
    private btn_boatGroup: UnityEngine.GameObject;
    private m_leftFreeTime: number = 0;
    private m_btnAuto: UnityEngine.UI.ActiveToggle;
    private boatSelectedParent: UnityEngine.GameObject;
    private boat_Exps: string[] = [];
    private btn_return: UnityEngine.GameObject;
    private nowBoatText: UnityEngine.UI.Text;
    private swCost: UnityEngine.UI.Text;
    private swHas: UnityEngine.UI.Text;
    private rootBt: UnityEngine.GameObject;
    private exp_husong: UnityEngine.UI.Text;
    private max_boatNum: number = 5;
    private boatSelecteds: UnityEngine.GameObject[] = [];
    private lastSelected: UnityEngine.GameObject;
    private boatColors: string[] = [Color.GREEN, Color.BLUE, Color.PURPLE, Color.ORANGE, Color.RED];
    private boatList: List;
    private selectedBoatText: UnityEngine.UI.Text;

    private boatSelectEffect: UnityEngine.GameObject;
    private effectRoots: UnityEngine.GameObject[] = [];
    private item: UnityEngine.GameObject;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_GUOYUN);
    }


    open() {
        super.open();
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.BoatView;
    }

    protected initElements() {
        this.MAX_FREE_REFRESH = Math.floor(G.DataMgr.constData.getValueById(KeyWord.GUOYUN_FREE_NUM));
        this.boatSelectedParent = this.elems.getElement("boatSelecteds");
        for (let i = 0; i < this.max_boatNum; i++) {
            let selected = ElemFinder.findObject(this.boatSelectedParent, i.toString());
            this.boatSelecteds.push(selected);
        }
        this.btn_return = this.elems.getElement("btn_return");
        this.btnStart = this.elems.getElement("btn_husong");
        this.nowBoatText = this.elems.getText("nowBoatText");
        this.swCost = this.elems.getText("refershSpend");
        this.swHas = this.elems.getText("nowsw");
        this.btnRefresh = this.elems.getElement("sxBt");
        this.rootBt = this.elems.getElement("yjhsBt");
        this.m_btnAuto = this.elems.getActiveToggle("toggle");
        this.btn_boatGroup = this.elems.getElement("btn_boatGroup");
        this.boatList = this.elems.getUIList('list');
        this.exp_husong = this.elems.getText("exp_husong");
        this.selectedBoatText = this.elems.getText('selectedBoatText');
        this.boatList.Count = this.max_boatNum;
        for (let i = 0; i < this.max_boatNum; i++) {
            let boatName = this.boatList.GetItem(i).findText('Text');
            boatName.text = TextFieldUtil.getColorText(Constants.NVSHEN_NAME[i], this.boatColors[i]);
        }
        this.boatSelectEffect = this.elems.getElement("boatSelectEff");
        //for (let i = 0; i < this.max_boatNum; i++) {
        //    let item = ElemFinder.findObject(this.boatSelectEffect, i.toString());
        //    item.SetActive(false);
        //    this.effectRoots.push(item);
        //    G.ResourceMgr.loadModel(item, UnitCtrlType.other, "effect/uitx/husongxuan.prefab", this.sortingOrder);
        //}

    }
    /**
    * 播放粒子系统
    */
    private playLiZiEffect() {
        for (let i = 0; i < this.max_boatNum; i++) {
            this.item = ElemFinder.findObject(this.boatSelectEffect, i.toString());
            this.effectRoots.push(this.item);
            //uts.log("this.sortingOrder22:" + this.sortingOrder);
            G.ResourceMgr.loadModel(this.item, UnitCtrlType.other, "effect/uitx/husongxuan.prefab", this.sortingOrder + 2);
            //Game.Invoker.BeginInvoke(this.item, "1", 20, delegate(this, this.onEndEffect));
            this.item.SetActive(false);
        }
    }
    private onEndEffect() {
        this.item.SetActive(false);
    }

    protected initListeners() {
        this.addClickListener(this.btn_return, this.onClickCloseBt);
        this.addClickListener(this.btnStart, this.onClickBtnStart);
        this.addClickListener(this.rootBt, this.onBtnGoldClick);
        this.addClickListener(this.btnRefresh, this.onClickBtnFreeRefresh);
        this.addClickListener(this.elems.getElement('mask'), this.onClickCloseBt);
        this.addClickListener(this.btn_boatGroup, this.onClickBtBoatGroup);
        this.addListClickListener(this.boatList, this.onClickBoatList);
    }

    protected onOpen() {
        this.boatList.Selected = 4;
        this.onClickBoatList(4);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_GUOYUN, Macros.ACTIVITY_GUOYUN_LIST));
        this.playLiZiEffect();
        let runtime = G.DataMgr.runtime;
        // if (runtime.forceGuoYun) {
        //     G.GuideMgr.tryGuide(EnumGuide.GuoYun, 0, false, 0, false);
        // } 
    }

    private onAutoAcceptTimer(timer: Game.Timer) {
        this.onClickBtnStart();
    }

    protected onClose() {
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.GuoYun, EnumGuide.GuideCommon_None);
    }

    private onClickCloseBt() {
        let runtime = G.DataMgr.runtime;
        // if (runtime.forceGuoYun) {
        //     this.onClickBtnStart();
        // } else {
        //首次开启国运的时候不要强制接一次
        this.close();
        // }
    }

    private onClickBoatList(index: number) {
        this.boatList.gameObject.SetActive(false);
        this.selectedBoatText.text = TextFieldUtil.getColorText(Constants.NVSHEN_NAME[index], this.boatColors[index]);
    }

    private onClickBtBoatGroup() {
        if (this.boatList.gameObject.activeSelf) {
            this.boatList.gameObject.SetActive(false);
        } else {
            this.boatList.gameObject.SetActive(true);
        }
    }


    /**
    * 点击免费刷新按钮事件的响应函数。
    * @param event
    *
    */
    private onClickBtnFreeRefresh(): void {

        // 因为到底是免费刷新还是道具刷新还是钻石刷新都是后台自己去判断你的
        // 唯一要区别的就是直接召唤还是普通刷新

        //拉车消耗按开服天数算
        let day = G.SyncTime.getDateAfterStartServer();
        let dayCost = G.DataMgr.constData.getValueById(KeyWord.PARAM_GUOYUN_QUEST_COST_3);
        if (day == 1) {
            dayCost = G.DataMgr.constData.getValueById(KeyWord.PARAM_GUOYUN_QUEST_COST_1);
        } else if (day == 2) {
            dayCost = G.DataMgr.constData.getValueById(KeyWord.PARAM_GUOYUN_QUEST_COST_2);
        }

        let level: number = 1;
        if (this.m_btnAuto.isOn) {
            level = this.boatList.Selected + 1;
        }
        if (this.m_leftFreeTime > 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_GUOYUN,
                Macros.ACTIVITY_GUOYUN_REFRESH_LEVLE, level));
        }
        else if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_TONGQIAN_ID, dayCost/* Constants.GUOYUN_YUANBAO_REFRESH_START*/, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_GUOYUN,
                Macros.ACTIVITY_GUOYUN_REFRESH_LEVLE, level));
        }
    }

    //一键红色
    private onBtnGoldClick(): void {
        let cos: number = Math.floor(G.DataMgr.constData.getValueById(KeyWord.PARAMETER_GY_HIGHLEVEL_PRICE));
        let str: string = uts.format('是否消耗{0}，刷新到{1}？', TextFieldUtil.getYuanBaoText(cos), TextFieldUtil.getColorText('荣耀战车', Color.RED));
        G.TipMgr.showConfirm(str, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmGold, cos));
    }

    private onConfirmGold(state: MessageBoxConst, isCheckSelected: boolean, cos: number): void {
        if (MessageBoxConst.yes == state) {
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cos, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_GUOYUN, Macros.ACTIVITY_GUOYUN_REFRESH_LEVLE, Macros.GUOYUN_REFRESH_HIGHTEST_LEVEL_TYPE));
            }
        }
    }

    /**
    * 点击开始按钮事件的响应函数。
    * @param event
    *
    */
    private onClickBtnStart(): void {

        let level = G.DataMgr.activityData.guoyunData.m_iCurrentQuestLevel;
        if (level < Constants.NVSHEN_NAME.length) {
            let str = uts.format("当前战车未刷新到{0},护送将造成{1}，是否确认护送？", TextFieldUtil.getColorText("满级", Color.YELLOW),
                TextFieldUtil.getColorText(uts.format("经验损失"), Color.RED))
            G.TipMgr.showConfirm(str, ConfirmCheck.noCheck, '确认|取消', (state: MessageBoxConst) => {
                if (MessageBoxConst.yes == state) {
                    this.tryStartConvoy();
                }
            });
        }
        else {
            this.tryStartConvoy();
        }
    }

    private tryStartConvoy() {
        // 检查当前是否在组队副本队伍里，是的话提示离队
        let myTeam = G.DataMgr.sxtData.myTeam;
        if (null != myTeam) {
            G.TipMgr.showConfirm(uts.format('请先离开{0}的队伍', PinstanceData.getConfigByID(myTeam.m_uiPinstanceID).m_szName), ConfirmCheck.noCheck, '离队|取消', delegate(this, this.onLeaveConfirm));
        } else {
            this.onLeaveConfirm(MessageBoxConst.yes, false);
        }
    }

    private onLeaveConfirm(state: MessageBoxConst, isCheckSelected: boolean) {
        if (MessageBoxConst.yes == state) {
            G.DataMgr.runtime.forceGuoYun = false;
            let myTeam = G.DataMgr.sxtData.myTeam;
            if (null != myTeam) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossQuitTeamRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
            }
            G.ModuleMgr.questModule.operateOneQuestRequest(G.DataMgr.questData.nextGuoYunQuestID, QuestData.EQA_Accept);
            this.close();
        }
    }

    ///////////////////////////////////////// 面板显示 /////////////////////////////////////////


    updateView(resp: Protocol.DoActivity_Response): void {

        let guoyunData = G.DataMgr.activityData.guoyunData;
        if (guoyunData == null) {
            return;
        }
        let level: number = guoyunData.m_iCurrentQuestLevel;
        if (level >= Constants.NVSHEN_NAME.length) {
            level = Constants.NVSHEN_NAME.length;
        }
        //经验值*2是表示经验翻倍
        if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_DOUBLE_GUOYUN)) {
            for (let i = 0; i < this.max_boatNum; i++) {
                let data = QuestData.getConfigByQuestID(guoyunData.m_aiQuestId[i]);
                if (data != null) {
                    this.boat_Exps[i] = Math.floor((data.m_astRewardThingConfig[0].m_iValue) / 10000).toFixed(1) + '万 x2';
                }
            }
        }
        else {
            for (let i = 0; i < this.max_boatNum; i++) {
                let data = QuestData.getConfigByQuestID(guoyunData.m_aiQuestId[i]);
                if (data != null) {
                    this.boat_Exps[i] = Math.floor((data.m_astRewardThingConfig[0].m_iValue) / 10000).toFixed(1) + '万';
                }
            }
        }
        this.updateNowBoatSelectStage(Constants.NVSHEN_NAME[level - 1]);
        this.updateRefreshButtons();
        // 刷新钻石价格
        this.onUpdateMoneyShow();
    }

    private updateRefreshButtons(): void {
        // 更新刷新按钮的状态
        if (null == G.DataMgr.activityData.guoyunData) {
            return;
        }
        // 刷新免费次数
        this.m_leftFreeTime = this.MAX_FREE_REFRESH - G.DataMgr.activityData.guoyunData.m_ucRefreshFreeNum;
        if (this.m_leftFreeTime > 0) {
            // 还有免费刷新次数
            this.swCost.text = '剩余免费次数: ' + TextFieldUtil.getColorText(this.m_leftFreeTime.toString(), Color.GREEN);
        }
        else {
            //拉车消耗按开服天数算
            let day = G.SyncTime.getDateAfterStartServer();
            let dayCost = G.DataMgr.constData.getValueById(KeyWord.PARAM_GUOYUN_QUEST_COST_3);
            if (day == 1) {
                dayCost = G.DataMgr.constData.getValueById(KeyWord.PARAM_GUOYUN_QUEST_COST_1);
            } else if (day == 2) {
                dayCost = G.DataMgr.constData.getValueById(KeyWord.PARAM_GUOYUN_QUEST_COST_2);
            }
            // 拥有的铜钱
            let sw: number = G.DataMgr.heroData.tongqian;
            let color: string = Color.GREEN;
            if (sw < dayCost) {
                color = Color.RED;
            }
            this.swCost.text = uts.format('刷新消耗: {0}', TextFieldUtil.getColorText(dayCost.toString(), color));
        }
    }

    /**
    * 金钱变化事件的响应函数。
    *
    */
    private onUpdateMoneyShow(): void {
        let sw: number = G.DataMgr.heroData.tongqian;
        this.swHas.text = '当前魂币：' + TextFieldUtil.getColorText(sw.toString(), Color.GREEN);
    }


    private updateNowBoatSelectStage(boat: string) {
        //刷新当前选择的灵舟
        if (this.lastSelected != null) {
            this.lastSelected.SetActive(false);
        }
        let selectdBoatIndex: number = 0;
        selectdBoatIndex = Constants.NVSHEN_NAME.indexOf(boat);
        let color = this.boatColors[selectdBoatIndex];
        this.exp_husong.text = TextFieldUtil.getColorText(this.boat_Exps[selectdBoatIndex], color);
        this.nowBoatText.text = TextFieldUtil.getColorText(boat, color);
        this.boatSelecteds[selectdBoatIndex].SetActive(true);//选中态图片换成特效
        this.effectRoots[selectdBoatIndex].SetActive(true);
        this.lastSelected = this.effectRoots[selectdBoatIndex];
    }



    //////////////////////////////// 引导 ///////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.GuideCommon_None == step) {
            this.onClickBtnStart();
            return true;
        }
        return false;
    }
}

