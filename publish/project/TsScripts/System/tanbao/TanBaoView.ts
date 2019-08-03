import { EnumEffectRule, UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { TanbaoRecordItemData } from "System/data/TanbaoRecordItemData";
import { TgbjData } from "System/data/TgbjData";
import { TgbjRecordItemData } from "System/data/TgbjRecordItemData";
import { ThingData } from "System/data/thing/ThingData";
import { ThingItemData } from 'System/data/thing/ThingItemData';
import { UIPathData } from "System/data/UIPathData";
import { MaterialItemData } from 'System/data/vo/MaterialItemData';
import { RewardIconItemData } from "System/data/vo/RewardIconItemData";
import { Global as G } from "System/global";
import { RewardView } from 'System/pinstance/selfChallenge/RewardView';
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { EnumTgbjRule } from "System/tanbao/EnumTgbjRule";
import { TanBaoExchangeView } from "System/tanbao/TanBaoExchangeView";
import { TanBaoStoreView } from "System/tanbao/TanBaoStoreView";
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager";
import { TipFrom } from "System/tip/view/TipsView";
import { UIEffect } from "System/uiEffect/UIEffect";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";
import { ITipData } from "../tip/tipData/ITipData";
import { TextTipData } from "../tip/tipData/TextTipData";
import { GameIDUtil } from "../utils/GameIDUtil";
import { EnumRewardState } from './../constants/GameEnum';

export enum EnumTanBaoType {
    /**宝库*/
    BaoKu = 0,
    /**密藏*/
    MiCang = 1,

}
/**
 * 天宫宝镜的对话框。
 *
 * 本文件代码由模板生成，你可能需要继续修改其他代码文件（比如EnumDialogName）才能正常使用。
 *
 * @author teppei
 *
 */
export class TanBaoView extends CommonForm {

    /**天宫宝镜鉴宝符。*/
    static readonly TGBJ_JBF: number = 10233010;

    /**天宫秘境鉴宝符。*/
    static readonly TGMJ_JBF: number = 10233020;
    /**魂骨抽奖令（绑定） */
    static readonly HUNGU_BINGJBF: number = 10233030;
    /**魂骨抽奖令（非绑定） */
    static readonly HUNGU_JBF: number = 10233031;

    /**调整飞图标结束点偏移位置*/
    private readonly offset: UnityEngine.Vector3 = new UnityEngine.Vector3(0, 0, 0);



    /**飞图标动画持续时间*/
    private readonly flydelayTime: number = 1.2;
    /**飞图标结束点*/
    private flyEndPoint: UnityEngine.GameObject;
    /**飞图标结束大小*/
    private endPointScale: UnityEngine.Vector3 = new UnityEngine.Vector3(0.5, 0.5, 0.5);
    /**复制飞图标*/
    private bmd: UnityEngine.GameObject;
    private bmds: UnityEngine.GameObject[];

    /**抽奖1次*/
    private static readonly LOTTERY_1: number = 1;
    /**抽奖1次*/
    private static readonly LOTTERY_10: number = 10;
    /**抽奖5次*/
    private static readonly LOTTERY_50: number = 50;

    private lotteryCounts: number[] = [TanBaoView.LOTTERY_1, TanBaoView.LOTTERY_10, TanBaoView.LOTTERY_50];


    /** 当前类型，宝境还是秘境 ,宝镜为1,秘境为2。*/
    private m_currentTag: number = 1;
    /**奖品个数。*/
    private static readonly _PRIZE_COUNT: number = 12;
    /**转盘跳动次数。*/
    private static readonly _SPIN_COUNT: number = 12;
    /**转盘时间间隔。*/
    private static readonly _INTERVAL: number = 150;
    /**鉴宝符ID。*/
    private _JIANBAOFU_ID: number = 0;
    /**抽奖1次的价格。*/
    private _COST_1: number = 0;
    private _COST_10: number = 0;
    private _COST_50: number = 0;
    /**奖品列表数据*/
    private m_prizeListData: RewardIconItemData[] = [];
    /**抽奖记录列表。*/
    private m_recordList: TanbaoRecordItemData[] = [];
    /**抽奖回复。*/
    private m_operateRsp: Protocol.SkyLotteryOperateRsp;
    /**是否正在转到目标奖品。*/
    private m_inPlay: boolean = false;
    /**是否抽中大奖。*/
    private m_isBigPrize: boolean = false;
    private _thingConfig: GameConfig.ThingConfigM;
    /**我的记录*/
    private _listMyselfVec: TgbjRecordItemData[];
    /**世界记录*/
    private _listAllVec: TgbjRecordItemData[];
    private _recordListDic: { [thingId: number]: number };
    private _isNoTipsCostMoney: boolean = false;

    //消耗钥匙图标显示
    private needContent: UnityEngine.GameObject;
    private iconitems: IconItem[] = [];
    private txtNeedMoneys: UnityEngine.UI.Text[] = [];
    private moneyItem: UnityEngine.GameObject[] = [];
    //宝库钥匙图标
    private moneyIcon: UnityEngine.GameObject;
    private moneyIconItem: IconItem;
    private txtMoneyValue: UnityEngine.UI.Text;

    //倒计时
    private txtOutTime: UnityEngine.UI.Text;


    //钻石/钥匙/积分
    private txtYuanbao: UnityEngine.UI.Text;
    private txtYaoshi: UnityEngine.UI.Text;
    private txtJiFen: UnityEngine.UI.Text;
    /**抽奖转动到第几个*/
    private runCount: number = 0;
    /**打开面板时要显示的页签。*/
    private openTab: EnumTanBaoType;
    /**转动当前选择的索引*/
    private selectedIndex: number = -1;

    private prizeDatas: RewardIconItemData[];
    /**奖品列表，第0位表示大奖。*/
    private objPrizeList: UnityEngine.GameObject[] = [];
    /**转到-奖励物品显示*/
    private prizeSelects: UnityEngine.GameObject[] = [];
    private prizeIconItems: IconItem[] = [];

    private mask: UnityEngine.GameObject;

    private itemList: UnityEngine.GameObject;
    /**个人记录List*/
    private myRecordList: List;
    /**全服记录List*/
    private worldRecordList: List;

    private btntanbao1: UnityEngine.GameObject;
    private tipMark1: UnityEngine.GameObject;
    private tipMark10: UnityEngine.GameObject;

    private freeTanbao: UnityEngine.UI.Text;
    private btntanbao10: UnityEngine.GameObject;
    private btntanbao50: UnityEngine.GameObject;
    private btnduihuan: UnityEngine.GameObject;
    private btncongzhi: UnityEngine.GameObject;
    private btnbaoku: UnityEngine.GameObject;
    /**是否是抽一次，处理按钮置灰*/
    private islotter1: boolean = false;

    private itemIcon_Normal: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    //特效
    private boxEffectPrefab: UnityEngine.GameObject;
    private effectRoot: UnityEngine.GameObject;
    private effectMask: UnityEngine.GameObject;
    private boxEffect: UIEffect;
    private currencyTip: CurrencyTip;
    //倒计时
    private _timeNum: number = 0;
    private mainTimeCheck: boolean = false;
    private energeSilder: UnityEngine.UI.Image;
    private boxsItem: boxItem[] = [];
    private box: UnityEngine.GameObject;
    //箱子的最大数量
    private maxNum: number = 9;
    //箱子特效
    private daijiRoots: UnityEngine.GameObject[] = [];
    private baokaiRoots: UnityEngine.GameObject[] = [];
    private iconNums: UnityEngine.UI.Text[] = [];
    private silderValue: UnityEngine.UI.Text;
    private materialData: MaterialItemData = new MaterialItemData();
    constructor() {
        super(KeyWord.ACT_FUNCTION_TGBJ);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.TanBaoView;
    }

    protected initElements(): void {
        this.btnClose = this.elems.getElement("btnClose");
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this.energeSilder = this.elems.getImage('energeSilder');
        this.needContent = this.elems.getElement("needContent");
        for (let i = 0; i < 3; i++) {
            let item = ElemFinder.findObject(this.needContent, "item" + i)
            let txtNeedMoney = ElemFinder.findText(this.needContent, "item" + i + "/txtNeedMoney");
            this.txtNeedMoneys.push(txtNeedMoney);
            this.moneyItem.push(item);
            if (i < 2) {
                let objIcon = ElemFinder.findObject(item, "icon");
                this.iconitems[i] = new IconItem();
                this.iconitems[i].setUsualIconByPrefab(this.itemIcon_Normal, objIcon);
                this.iconitems[i].setTipFrom(TipFrom.normal);
            }
        }
        this.box = this.elems.getElement('boxs');
        for (let j = 0; j < this.maxNum; j++) {
            let item = ElemFinder.findObject(this.box, uts.format('box{0}', j + 1));
            this.boxsItem[j] = new boxItem();
            if (G.DataMgr.tgbjData.getLotterExCfgByIndex(j)) {
                let itemNum = G.DataMgr.tgbjData.getLotterExCfgByIndex(j).m_iNubmer;
                this.boxsItem[j].setComponent(item, itemNum);
            }
            else {
                this.boxsItem[j].setComponent(item, 0);
            }
        }
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("CurrencyTip"));

        //箱子特效
        for (let i = 0; i < 2; i++) {
            let boxItem = this.elems.getElement(uts.format('box{0}', i));
            let daiji = ElemFinder.findObject(boxItem, 'daijiRoot');
            let baokai = ElemFinder.findObject(boxItem, 'baokaiRoot');
            let iconItem = ElemFinder.findText(boxItem, 'num');
            this.daijiRoots.push(daiji);
            this.baokaiRoots.push(baokai);
            this.iconNums.push(iconItem);
        }
        this.silderValue = this.elems.getText('silderValue');
        //钻石/积分/钥匙
        this.txtYuanbao = this.elems.getText("txtYuanbao");
        this.txtYaoshi = this.elems.getText("txtYaoshi");
        this.txtJiFen = this.elems.getText("txtJiFen");
        this.txtOutTime = this.elems.getText("txtOutTime");

        this.moneyIcon = this.elems.getElement("moneyIcon");
        this.txtMoneyValue = this.elems.getText("txtMoneyValue");
        this.moneyIconItem = new IconItem();
        this.moneyIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.moneyIcon);
        this.moneyIconItem.effectRule = EnumEffectRule.none;
        this.moneyIconItem.showBg = false;
        this.moneyIconItem.needColor = false;


        //20个奖励物品
        this.itemList = this.elems.getElement("itemList");
        for (let i = 0; i < TanBaoView._PRIZE_COUNT; i++) {
            let item = this.itemList.transform.Find("icon" + i);
            this.objPrizeList.push(item.gameObject);
            let iconItem = new IconItem();
            let parent = item.Find("content");
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, parent.gameObject);
            iconItem.showBg = true;
            iconItem.setTipFrom(TipFrom.none);
            this.prizeIconItems.push(iconItem);
            let select = item.transform.Find("selected");
            this.prizeSelects.push(select.gameObject);
            this.addClickListener(item.gameObject, delegate(this, this.onClickItemList, i))
        }

        //奖励个人记录，世界记录
        this.myRecordList = this.elems.getUIList("myRecordList");
        this.worldRecordList = this.elems.getUIList("worldRecordList");

        this.mask = this.elems.getElement("mask");
        //抽奖1/10/50次
        this.btntanbao1 = this.elems.getElement("btntanbao1");
        this.tipMark1 = ElemFinder.findObject(this.btntanbao1, 'tipMark');
        this.freeTanbao = ElemFinder.findText(this.btntanbao1, 'Text');
        this.btntanbao10 = this.elems.getElement("btntanbao10");
        this.tipMark10 = ElemFinder.findObject(this.btntanbao10, 'tipMark');
        this.btntanbao50 = this.elems.getElement("btntanbao50");
        //兑换/充值/宝库
        this.btnduihuan = this.elems.getElement("btnduihuan");
        this.btncongzhi = this.elems.getElement("btncongzhi");
        this.btnbaoku = this.elems.getElement("btnbaoku");

        //特效
        this.boxEffectPrefab = this.elems.getElement("boxEffect");
        this.effectRoot = this.elems.getElement("effectRoot");
        this.effectMask = this.elems.getElement("effectMask");
        this.boxEffect = new UIEffect();
        this.boxEffect.setEffectPrefab(this.boxEffectPrefab, this.effectRoot);

        this.flyEndPoint = this.elems.getElement("flyEndPoint");
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickMask);
        this.addClickListener(this.btntanbao1.gameObject, this.onClickBtnTanbao1);
        this.addClickListener(this.btntanbao10.gameObject, this.onClickBtnTanbao10);
        this.addClickListener(this.btntanbao50.gameObject, this.onClickBtnTanbao50);

        this.addClickListener(this.btnduihuan, this.onBtnExchange);
        this.addClickListener(this.btncongzhi, this.onBtnCharge);
        this.addClickListener(this.btnbaoku, this._onClickBtnStore);
        this.addClickListener(this.btnClose, this.onClickMask);
    }

    open(openTab: EnumTanBaoType = EnumTanBaoType.BaoKu) {
        this.openTab = openTab;
        super.open();
    }

    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        this.sendOpenPanel();
        // 拉取天宫宝镜仓库
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_LIST, Macros.CONTAINER_TYPE_SKYLOTTERY));
        // 更新抽奖类型相关的
        this.m_prizeListData = RewardIconItemData.formatVector(TanBaoView._PRIZE_COUNT);
        this.updateLotteryZone();
        this._getRecords();
        this.effectMask.SetActive(false);
        this.updateMyselfRecord();
        this.currencyTip.updateMoney();
        for (let i = 0; i < 2; i++) {
            G.ResourceMgr.loadModel(this.daijiRoots[i], UnitCtrlType.other, 'effect/uitx/bosstz/bosstzmb.prefab', this.sortingOrder + 1);
        }
        //this.addTimer("daojishi", 1000, 0, this.onTimer);
    }


    //private updateTime(): void {
    //    // 更新时间
    //    let startTime = Math.round(G.SyncTime.getCurrentTime() / 1000);
    //    this._timeNum = Math.floor((G.DataMgr.tgbjData.outTime - startTime));
    //    if (this._timeNum > 0) {
    //        this.mainTimeCheck = true;
    //    } else {
    //        this.txtOutTime.text = "";
    //    }
    //}


    //private onTimer(): void {
    //    if (this.mainTimeCheck) {
    //        this._timeNum--;
    //        if (this._timeNum > 0) {
    //            this.txtOutTime.text = uts.format('积分清零倒计时：{0}', DataFormatter.second2DayDoubleShort2(this._timeNum));
    //        }
    //        else {
    //            this.mainTimeCheck = false;
    //            this.txtOutTime.text = '';
    //        }
    //    }
    //}



    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
        this.IsSetGrey(false);
    }



    private onClickMask() {
        this.close();

    }

    private _onChangeBagThingData(type: number): void {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            let thingNum: number = G.DataMgr.thingData.getThingNum(this._JIANBAOFU_ID, Macros.CONTAINER_TYPE_ROLE_BAG, false); // 非绑定和绑定的一起算
            this.updateTfItem();
            this._onUpdateMoneyShow();
        }
    }

    private onClickItemList(index: number) {
        let data = this.tgbjData.getLotterSeverCfg(index);
        if (data)
            G.ViewCacher.tipsView.open(this.getTipData(data.m_szTips), TipFrom.normal);
    }

    getTipData(des: string): ITipData {
        // 文本tip
        let m_textTipData = new TextTipData();
        m_textTipData.setTipData(des);
        return m_textTipData;

    }

    /**更新道具消耗文本*/
    private updateTfItem(): void {
        let itemdata1:ThingItemData = new ThingItemData();
        let itemdata2:ThingItemData = new ThingItemData();
        let itemNum = 0;
        if (this._thingConfig) {
            for (let i = 0; i < 2; i++) {
                this.materialData.id = this._JIANBAOFU_ID;
                //加两个显示道具
                this.materialData.has = G.DataMgr.thingData.getThingNum(this._JIANBAOFU_ID, Macros.CONTAINER_TYPE_ROLE_BAG, false)+G.DataMgr.thingData.getThingNum(TanBaoView.HUNGU_BINGJBF, Macros.CONTAINER_TYPE_ROLE_BAG, true)+G.DataMgr.thingData.getThingNum(TanBaoView.HUNGU_JBF, Macros.CONTAINER_TYPE_ROLE_BAG, true);
                this.materialData.need = this.lotteryCounts[i];
                this.iconitems[i].updateByMaterialItemData(this.materialData);
                this.iconitems[i].updateIcon();
            }
        }
        //刷新红点
        this.tipMark1.SetActive(this.tgbjData.freeNum > 0 || this.materialData.has >= 1);
        this.tipMark10.SetActive(this.materialData.has >= 10);
        UIUtils.setButtonClickAble(this.tipMark1.gameObject, (this.tgbjData.freeNum > 0 || this.materialData.has >= 1));
        UIUtils.setButtonClickAble(this.tipMark10.gameObject, (this.materialData.has >= 10));
    }

    /**更新资源文本*/
    _onUpdateMoneyShow(): void {
        // 更新当前钻石数量
        this.txtYuanbao.text = G.DataMgr.heroData.gold.toString(), Color.GREEN;
        this.txtJiFen.text = TextFieldUtil.getColorText(G.DataMgr.heroData.skyBonus.toString(), Color.GREEN);
        this.moneyIconItem.updateById(this._JIANBAOFU_ID);
        this.moneyIconItem.updateIcon();

        let thingNum: number = G.DataMgr.thingData.getThingNum(this._JIANBAOFU_ID, Macros.CONTAINER_TYPE_ROLE_BAG, false);

        this.txtMoneyValue.text = TextFieldUtil.getColorText(thingNum.toString(), Color.GREEN);

    }

    /**
     * 点击宝镜仓库事件的响应函数。
     * @param event
     *
     */
    private _onClickBtnStore(): void {
        G.Uimgr.createForm<TanBaoStoreView>(TanBaoStoreView).open();
    }

    private hideAllSelect() {
        for (let i = 0; i < this.prizeSelects.length; i++) {
            this.prizeSelects[i].SetActive(false);
        }
    }

    private showCurSelect(index: number) {

        if (index > this.prizeSelects.length) {
            index %= this.prizeSelects.length;
        }
        for (let i = 0; i < this.prizeSelects.length; i++) {
            if (index == i) {
                this.prizeSelects[i].SetActive(true);
            } else {
                this.prizeSelects[i].SetActive(false);
            }
        }
    }



    private _onTimer(): void {
        this.runCount++;
        // 决定下一次应该跳到哪里
        if (this.m_inPlay && this.m_isBigPrize) {
            // 如果中大奖的话直接跳进去
            this.selectedIndex = 0;
        }
        else {
            // 否则要模拟转到那个奖品上
            if (TanBaoView._PRIZE_COUNT - 1 == this.selectedIndex) {
                this.selectedIndex = 0;
            }
            else {
                this.selectedIndex++;
            }
        }
        this.showCurSelect(this.runCount);
        if (this.m_inPlay) {
            // 看看是否转到目标奖品上了
            if ((this.selectedIndex == this.m_operateRsp.m_aiID[0] - 1)) {
                this._stopTimer();
                this._afterTanbao();
            }
        }
        else {
            if (this.runCount == TanBaoView._SPIN_COUNT) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSkyLotteryRequest(Macros.SKYLOTTERY_OPERATE, this.m_currentTag, TanBaoView.LOTTERY_1));
            }
            if (this.runCount >= TanBaoView._SPIN_COUNT * 2) {
                if (defines.has('_DEBUG')) {
                    // trace(uts.format('超过转动次数'));
                }
                this._stopTimer();
                this._afterTanbao();
            }
        }


    }

    private _stopTimer(): void {
        if (this.hasTimer("1")) {
            this.removeTimer("1");
            this.runCount = 0;
            this.selectedIndex = -1;
        }
    }

    private _afterTanbao(): void {
        this.updateMyselfRecord();
        // 直接飞图标

        if (!this.islotter1) {
            this.effectMask.SetActive(true);
            this.addTimer("effect", 1000, 1, delegate(this, this._flyPrizeIcon));
        } else {
            this._flyPrizeIcon();
        }
    }

    private _flyPrizeIcon(): void {
        this.effectMask.SetActive(false);
        this.endPointScale = UnityEngine.Vector3.zero;
        let bmd: UnityEngine.GameObject;
        this.bmds = new Array<UnityEngine.GameObject>();

        if (this.m_operateRsp == null || this.m_operateRsp.m_astThingInfo == null) {
            return;
        }

        for (let i = 0; i < this.m_operateRsp.m_astThingInfo.length; i++) {
            let thingInfo = this.m_operateRsp.m_astThingInfo[i];
            if (thingInfo.m_iThingID != 0 && thingInfo.m_iThingNumber != 0) {
                this.bmds.push(this.objPrizeList[this.m_operateRsp.m_aiID[i] - 1]);
            }
        }
        this.start(this.bmds);
    }


    public start(bmds: UnityEngine.GameObject[]): void {
        this.addTimer("fly", 50, 0, delegate(this, this._onflyTimer, bmds));
    }

    private _onflyTimer(timer: Game.Timer, bmds: UnityEngine.GameObject[]): void {
        if (this.bmds.length == 0) {
            this.removeTimer("fly");
            this.IsSetGrey(false);
            return;
        }

        let orgobj = this.bmds.pop();
        let obj = UnityEngine.GameObject.Instantiate(orgobj, this.itemList.transform, true) as UnityEngine.GameObject;
        Tween.TweenPosition.Begin(obj, this.flydelayTime, this.flyEndPoint.transform.localPosition);
        let scaleAni = Tween.TweenScale.Begin(obj, this.flydelayTime, this.endPointScale);
        scaleAni.onFinished = delegate(this, this.onFlyOver, obj);

    }
    private onFlyOver(obj) {
        UnityEngine.GameObject.Destroy(obj);
        if (this.islotter1) {
            this.IsSetGrey(false);
        }
    }


    /**
     * 拉取抽奖记录。
     *
     */
    private _getRecords(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSkyLotteryRequest(Macros.SKYLOTTERY_LIST_RECORD, this.m_currentTag, Macros.SKYLOTTERY_SERVER_RECORD_TYPE));
    }

    /**
     * 打开面板请求
     */
    private sendOpenPanel() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSkyLotteryOpenPanelRequest(this.m_currentTag));
    }

    updateLotteryZone(): void {

        this._JIANBAOFU_ID = TanBaoView.TGBJ_JBF;
        this._COST_1 = (G.DataMgr.constData.getValueById(KeyWord.PARAM_LOTTER_SKY_1_PIRCE));
        this._COST_10 = (G.DataMgr.constData.getValueById(KeyWord.PARAM_LOTTER_MJ_10_PIRCE));
        this._COST_50 = (G.DataMgr.constData.getValueById(KeyWord.PARAM_LOTTER_MJ_50_PIRCE));
        this.m_currentTag = KeyWord.LOTTERY_TYPE_SKY;

        //else {
        //    this._JIANBAOFU_ID = TanBaoView.TGMJ_JBF;
        //    this._COST_1 = (G.DataMgr.constData.getValueById(KeyWord.PARAM_LOTTER_MJ_1_PIRCE));
        //    this._COST_10 = (G.DataMgr.constData.getValueById(KeyWord.PARAM_LOTTER_MZ_10_PIRCE));
        //    this._COST_50 = (G.DataMgr.constData.getValueById(KeyWord.PARAM_LOTTER_MZ_50_PIRCE));
        //    this.m_currentTag = KeyWord.LOTTERY_TYPE_MJ;
        //}
        this._thingConfig = ThingData.getThingConfig(this._JIANBAOFU_ID);
        //164
        this.txtNeedMoneys[0].text = TextFieldUtil.getColorText(uts.format('{0}钻石单抽', this._COST_1), Color.DEFAULT_WHITE);
        this.txtNeedMoneys[1].text = TextFieldUtil.getColorText(uts.format('{0}钻石十连抽', this._COST_10), Color.DEFAULT_WHITE);
        this.txtNeedMoneys[2].text = TextFieldUtil.getColorText(uts.format('{0}钻石五十连抽', this._COST_50), Color.DEFAULT_WHITE);

        this.updateBox();
        this.updateListGrid();
        this._onUpdateMoneyShow();
        this._onChangeBagThingData(Macros.CONTAINER_TYPE_ROLE_BAG);
    }

    /**更新箱子的状态 */
    updateBox() {
        this.currencyTip.updateMoney();
        G.ActBtnCtrl.update(false);
        this.updateTfItem();
        this.silderValue.text = uts.format('今日累计抽奖次数:{0}', TextFieldUtil.getColorText(G.DataMgr.tgbjData.totalNum.toString(), Color.GREEN));
        if (G.DataMgr.tgbjData.freeNum > 0) {
            this.freeTanbao.text = uts.format('免费{0}次', G.DataMgr.tgbjData.freeNum);
        } else {
            this.freeTanbao.text = '抽奖1次';
        }
        if (G.DataMgr.thingData.getThingNum(this._JIANBAOFU_ID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= 1 || G.DataMgr.tgbjData.freeNum > 0) {
            this.tipMark1.SetActive(true);
        }
        else {
            this.tipMark1.SetActive(false);
        }
        for (let i = 0; i < this.maxNum; i++) {
            let cfg = G.DataMgr.tgbjData.getLotterExCfgByIndex(i);
            this.boxsItem[i].updata(cfg, this.m_currentTag, i);
        }
        this.updateFill();
    }
    private updateFill() {
        let fillCount = 0;
        let index = 0;
        let extreCount = 0;
        if (G.DataMgr.tgbjData.totalNum > 0) {
            if (G.DataMgr.tgbjData.totalNum >= G.DataMgr.tgbjData.getLotterExCfgByIndex(0).m_iNubmer) {
                for (let i = 0; i < this.maxNum; i++) {
                    let cfg = G.DataMgr.tgbjData.getLotterExCfgByIndex(i);
                    if (G.DataMgr.tgbjData.totalNum >= cfg.m_iNubmer) {
                        fillCount += 0.1;
                        index += 1;
                    }
                }
                let maxCfg = G.DataMgr.tgbjData.getLotterExCfgByIndex(index - 1);
                if (index < 9) {
                    let nextCfg = G.DataMgr.tgbjData.getLotterExCfgByIndex(index);
                    extreCount = (G.DataMgr.tgbjData.totalNum - maxCfg.m_iNubmer) / ((nextCfg.m_iNubmer - maxCfg.m_iNubmer) * 10);
                } else {
                    extreCount = (G.DataMgr.tgbjData.totalNum - maxCfg.m_iNubmer) / ((1000 - maxCfg.m_iNubmer) * 10);
                }
            } else {
                fillCount = G.DataMgr.tgbjData.totalNum / G.DataMgr.tgbjData.getLotterExCfgByIndex(0).m_iNubmer / 10;
            }
            this.energeSilder.fillAmount = fillCount + extreCount;
        } else {
            this.energeSilder.fillAmount = 0;
        }

    }
    /**更新格子列表*/
    private updateListGrid(): void {
        let itemConfig: GameConfig.ThingConfigM;
        for (let i = 0; i < Macros.MAX_SKYLOTTERY_ITEM_NUM; i++) {
            let data = this.tgbjData.getLotterSeverCfg(i);
            //第一次开启时没有数据
            if (data == null) return;
            if (i == 0 || i == 1) {
                this.prizeIconItems[i].effectRule = EnumEffectRule.none;
            }
            if (GameIDUtil.isDropID(data.m_iItemId)) {
                // let dropCfg: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(data.m_iItemId);
                // if (dropCfg.m_ucIsDropByProf) {
                //     let isfind = false;
                //     //如果分职业 找本职业的第一个
                //     for (let i = 0, con = dropCfg.m_astDropThing.length; i < con; i++) {
                //         let data = dropCfg.m_astDropThing[i];
                //         let thingdata = ThingData.getThingConfig(data.m_iDropID);
                //         if (thingdata.m_ucProf == G.DataMgr.heroData.profession) {
                //             itemConfig = ThingData.getThingConfig(data.m_iDropID);
                //             isfind = true;
                //         }
                //     }
                //     if (isfind == false) {
                //         itemConfig = ThingData.getThingConfig(dropCfg.m_astDropThing[0].m_iDropID);
                //     }
                // }
                // else {
                //     itemConfig = ThingData.getThingConfig(dropCfg.m_astDropThing[0].m_iDropID);
                // }
                this.prizeIconItems[i].setTipFrom(TipFrom.none);
                this.prizeIconItems[i].updateByItemConfig(itemConfig);
                this.prizeIconItems[i].updateIcon();
                this.prizeIconItems[i].setBackgroundColor(data.m_ucColor);
                this.prizeIconItems[i].setIconById(data.m_iIconId);
                this.prizeIconItems[i].setHunguDropLevel(data.m_iHGicon);
            }
            else {
                this.prizeIconItems[i].setTipFrom(TipFrom.normal);
                itemConfig = ThingData.getThingConfig(data.m_iItemId);
                this.prizeIconItems[i].updateByItemConfig(itemConfig);
                this.prizeIconItems[i].updateIcon();
                this.prizeIconItems[i].setHunguDropLevel(0);
            }
            this.prizeIconItems[i].setItemNumber(data.m_iItemNumber);
            if (i == 0 || i == 1) {
                this.prizeIconItems[i].setIconAlpha(0);
                this.prizeIconItems[i].isShowIcon(1);
                this.iconNums[i].text = data.m_iItemNumber.toString();
            }


        }

        // // 构造奖品数据
        // this.prizeDatas = new Array<RewardIconItemData>();
        // let itemData: RewardIconItemData;
        // let config: GameConfig.SkyLotteryConfigM;
        // let configs: GameConfig.SkyLotteryConfigM[];
        // let openSeverDay: number = Math.floor(G.SyncTime.getDateAfterStartServer());
        // configs = this.tgbjData.getLotteryArr(this.m_currentTag, openSeverDay);
        // for (let i: number = this.m_prizeListData.length - 1; i >= 0; i--) {
        //     itemData = this.m_prizeListData[i];
        //     config = configs[i];

        //     let data = {} as RewardIconItemData;
        //     data.id = config.m_iItemId;
        //     data.number = config.m_iItemNumber;


        //     if (i == 0 || i == 1) {
        //         // this.prizeIconItems[i].setIconAlpha(0);
        //         // this.prizeIconItems[i].isShowIcon(1);
        //         // this.prizeIconItems[i].updateById(config.m_iItemId);
        //         // this.prizeIconItems[i].updateIcon(true);
        //         // this.iconNums[i].text = config.m_iItemNumber.toString();

        //         // this.prizeIconItems[i].setIconAlpha(0);
        //         // this.prizeIconItems[i].isShowIcon(1);
        //         this.prizeIconItems[i].updateByRewardIconData(data);
        //         this.prizeIconItems[i].updateIcon();
        //         this.iconNums[i].text = config.m_iItemNumber.toString();
        //     } else {
        //         this.prizeIconItems[i].updateByRewardIconData(data);
        //         this.prizeIconItems[i].updateIcon();
        //         // this.prizeIconItems[i].updateById(config.m_iItemId, config.m_iItemNumber);
        //         // this.prizeIconItems[i].updateIcon();
        //     }
        // }
    }

    /**
     * 刷新抽奖记录。
     * @param tabType
     *
     */
    private _refreshRecords(rawData: Protocol.SkyLotteryRecordList[]): void {
        if (null == rawData) {
            return;
        }
        let itemData: TanbaoRecordItemData;
        // 数据数组
        let listData: TanbaoRecordItemData[] = this.m_recordList;
        if (null == listData) {
            listData = new Array<TanbaoRecordItemData>();
        }
        let recordNum: number = rawData.length;
        let i: number = 0;
        if (recordNum < listData.length) {
            listData.length = recordNum;
        }
        else {
            for (i = listData.length; i < recordNum; i++) {
                itemData = new TanbaoRecordItemData();
                listData.push(itemData);
            }
        }
        // 刷新数据
        let rawItemData: Protocol.SkyLotteryRecordList;
        let config: GameConfig.SkyLotteryConfigM;
        for (i = 0; i < recordNum; i++) {
            rawItemData = rawData[i];
            itemData = listData[i];
            itemData.itemConfig = ThingData.getThingConfig(rawItemData.m_aiThingID);
            itemData.roleName = rawItemData.m_szNickName;
        }
        this.m_recordList = listData;
    }

    /**
     * 点击免费抽奖1次按钮事件的响应函数。
     * @param event
     *
     */
    private onClickBtnTanbao1(): void {
        this.islotter1 = true;
        this.hideAllSelect();
        if (G.DataMgr.tgbjData.freeNum > 0) {
            this.freeTanbao.text = uts.format('免费{0}次', G.DataMgr.tgbjData.freeNum);
            this.sendLottery(1);
        } else {
            this.freeTanbao.text = '抽奖1次';
            this.tryLottery(this._COST_1, TanBaoView.LOTTERY_1);
        }
    }

    /**
     * 点击抽奖10次按钮事件的响应函数。
     * @param event
     *
     */
    private onClickBtnTanbao10(): void {
        this.islotter1 = false;
        this.hideAllSelect();
        this.tryLottery(this._COST_10, TanBaoView.LOTTERY_10);
    }

    /**
     * 点击抽奖50次按钮事件的响应函数。
     * @param event
     *
     */
    private onClickBtnTanbao50(): void {
        this.islotter1 = false;
        this.hideAllSelect();
        this.tryLottery(this._COST_50, TanBaoView.LOTTERY_50);
    }

    /**尝试抽奖*/
    private tryLottery(money: number, count: number): void {
        if (this.hasTimer("1")) {
            return;
        }
        if (TanBaoStoreView.MAX_CAPACITY - G.DataMgr.thingData.getCurTgbjStorePosNum() < count) {
            G.TipMgr.addMainFloatTip('您的宝库空格不足。');
            return;
        }

        let canDo: boolean = true;
        let needConfirm: boolean = false;
        if (count == TanBaoView.LOTTERY_1 || count == TanBaoView.LOTTERY_10) {
            // 检查鉴宝石
            //抽奖令总数量
            canDo = this.materialData.has >= count?true:false;
            // canDo = (0 == G.ActionHandler.getLackNum(this._JIANBAOFU_ID, count, false)) || (0 == G.ActionHandler.getLackNum(TanBaoView.HUNGU_BINGJBF, count, true)) || (0 == G.ActionHandler.getLackNum(TanBaoView.HUNGU_JBF, count, true));
            if (!canDo) {
                //检查钻石
                canDo = 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, money, true);
                needConfirm = true;
            }
        }
        else {
            canDo = 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, money, true);
            needConfirm = true;
        }

        if (canDo) {
            if (needConfirm && !this._isNoTipsCostMoney) {
                G.TipMgr.showConfirm(uts.format('是否花费{0}钻石抽奖{1}次？', TextFieldUtil.getColorText(money.toString(), Color.GREEN), TextFieldUtil.getColorText(count.toString(), Color.GREEN)), ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onLotteryTip, count));
            }
            else {
                this.IsSetGrey(true);
                this.sendLottery(count);
            }
        }
    }

    /**
     * 按钮是否置灰禁用
     * @param grey
     */
    private IsSetGrey(grey: boolean) {

        UIUtils.setButtonClickAble(this.btntanbao1.gameObject, !grey);
        UIUtils.setButtonClickAble(this.btntanbao10.gameObject, !grey);
        UIUtils.setButtonClickAble(this.btntanbao50.gameObject, !grey);
    }

    /**点击钻石抽奖二次提示处理*/
    private onLotteryTip(status: number, isCheckSelected: boolean, args: number): void {
        if (MessageBoxConst.yes == status) {
            this._isNoTipsCostMoney = isCheckSelected;
            this.sendLottery(args);
            //按钮置灰
            this.IsSetGrey(true);
        }
    }

    private sendLottery(count: number): void {
        if (count == TanBaoView.LOTTERY_1) {
            this.m_inPlay = false;
            this.m_isBigPrize = false;
            if (this.selectedIndex < 0) {
                this.selectedIndex = 0;
            }
            this.addTimer("1", TanBaoView._INTERVAL, 0, this._onTimer);
        }
        else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSkyLotteryRequest(Macros.SKYLOTTERY_OPERATE, this.m_currentTag, count));
        }
    }

    /**抽奖成功*/
    onLotteryCompelete(isGet: boolean = false): void {
        G.ActBtnCtrl.update(false);
        //this.updateTime();
        if (!isGet) {
            this.playSuccessEffect();
        }
        if (defines.has('_DEBUG')) {
            // trace(uts.format('抽奖成功'));
        }
        let myLotteryRecordVec: Protocol.SkyLotteryOperateRsp[] = G.DataMgr.tgbjData.getMyLotteryRecord(this.m_currentTag);
        this.m_operateRsp = myLotteryRecordVec[myLotteryRecordVec.length - 1];

        if (this.hasTimer("1")) {

            // 转到目标奖品上
            this.m_inPlay = true;
        }
        else {
            this._afterTanbao();
        }

        this.updateBox();
        this.sendOpenPanel();
    }
    private playSuccessEffect() {
        for (let i = 0; i < 2; i++) {
            this.baokaiRoots[i].SetActive(true);
            G.ResourceMgr.loadModel(this.baokaiRoots[i], UnitCtrlType.other, 'effect/uitx/dianji/dianji_caizhuan.prefab', this.sortingOrder + 1);
        }
        this.addTimer("playEffectEnd", 1000, 1, delegate(this, this.playEnd));
    }
    private playEnd(obj: UnityEngine.GameObject) {
        for (let i = 0; i < 2; i++) {
            this.baokaiRoots[i].SetActive(false);
        }
    }
    /**兑换*/
    private onBtnExchange(): void {
        G.Uimgr.createForm<TanBaoExchangeView>(TanBaoExchangeView).open();
    }

    /**充值*/
    private onBtnCharge(): void {
        //G.ModuleMgr.businessModule.recharge();
        G.ActionHandler.go2Pay();
    }

    /**更新我的记录*/
    private updateMyselfRecord(): void {
        let thingInfo: Protocol.LotteryThingInfo;
        let i: number = 0;
        let thingConfig: GameConfig.ThingConfigM;
        let itemThingId: number = 0;
        let thingId: number = 0;
        let iconData: RewardIconItemData;
        let itemVo: TgbjRecordItemData;
        let hasBreak: boolean = false;
        this.listMyselfVec.length = 0;
        let myLotteryRecordVec: Protocol.SkyLotteryOperateRsp[] = this.tgbjData.getMyLotteryRecord(this.m_currentTag);

        if (myLotteryRecordVec) {
            for (i = myLotteryRecordVec.length - 1; i >= 0; i--) {
                if (hasBreak) {
                    break;
                }
                this._recordListDic = {};
                let myLotterRecord: Protocol.SkyLotteryOperateRsp = myLotteryRecordVec[i];
                for (thingInfo of myLotterRecord.m_astThingInfo) {
                    thingId = thingInfo.m_iThingID;
                    if (thingId > 0) {
                        let oldValue = this._recordListDic[thingId];
                        if (undefined == oldValue) {
                            oldValue = 0;
                        }
                        this._recordListDic[thingId] = (oldValue + thingInfo.m_iThingNumber);
                    }
                }
                for (let key in this._recordListDic) {
                    if (this.listMyselfVec.length < EnumTgbjRule.MAX_RECORE_COUNT) {
                        itemThingId = this._recordListDic[key];
                        thingConfig = ThingData.getThingConfig(parseInt(key));
                        if (thingConfig) {
                            itemVo = new TgbjRecordItemData();
                            itemVo.type = EnumTgbjRule.MDBK_LOTTERY_RECORD_TYPE;
                            itemVo.recordType = EnumTgbjRule.RECORD_SELF_TYPE;
                            itemVo.roleName = '';
                            iconData = RewardIconItemData.alloc();
                            iconData.id = itemThingId;
                            iconData.number = this._recordListDic[key];
                            itemVo.thingConfig = thingConfig;
                            itemVo.iconItemData = iconData;
                            this.listMyselfVec.push(itemVo);
                        }
                    }
                    else {
                        hasBreak = true;
                        break;
                    }
                }
            }
        }
        this.showRecordInfo(this.listMyselfVec, true);
    }

    private showRecordInfo(datas: TgbjRecordItemData[], isMyRecord: boolean) {

        for (let i = 0; i < datas.length; i++) {
            let langId: number = this.getlangId(datas[i].type, datas[i].recordType);
            let roleName: string = TextFieldUtil.getColorText(datas[i].roleName, Color.GREEN);
            let thingConfig: GameConfig.ThingConfigM = datas[i].thingConfig;
            if (thingConfig) {
                let thingName: string = TextFieldUtil.getColorText(thingConfig.m_szName, Color.getColorById(thingConfig.m_ucColor));
            }
            if (isMyRecord) {
                this.myRecordList.Count = datas.length;
                let txtRecord = this.myRecordList.GetItem(i).findText("txtRecord");
                if (thingConfig) {
                    let thingName: string = TextFieldUtil.getColorText(thingConfig.m_szName, Color.getColorById(thingConfig.m_ucColor));
                    txtRecord.text = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(langId, roleName, thingName, datas[i].iconItemData.number), Color.DEFAULT_WHITE);
                }
            } else {
                this.worldRecordList.Count = datas.length;
                if (thingConfig) {
                    let txtRecord = this.worldRecordList.GetItem(i).findText("txtRecord");
                    let thingName: string = TextFieldUtil.getColorText(thingConfig.m_szName, Color.getColorById(thingConfig.m_ucColor));
                    txtRecord.text = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(langId, roleName, thingName, datas[i].iconItemData.number), Color.DEFAULT_WHITE);
                }
            }
        }
    }

    private getlangId(type: number, recordType: number): number {
        let langId: number = 0;
        switch (type) {
            case EnumTgbjRule.MDBK_LOTTERY_RECORD_TYPE:
                switch (recordType) {
                    case EnumTgbjRule.RECORD_ALL_TYPE:
                        langId = 87;
                        break;
                    case EnumTgbjRule.RECORD_SELF_TYPE:
                        langId = 88;
                        break;
                    default:
                }
                break;
            case EnumTgbjRule.MDBK_EXCHANGE_RECORD_TYPE:
                switch (recordType) {
                    case EnumTgbjRule.RECORD_ALL_TYPE:
                        langId = 89;
                        break;
                    case EnumTgbjRule.RECORD_SELF_TYPE:
                        langId = 90;
                        break;
                    default:
                }
                break;
            default:
        }
        return langId;
    }

    updateAllRecord(): void {
        //this.updateTime();
        let thingConfig: GameConfig.ThingConfigM;
        let itemThingId: number = 0;
        let iconData: RewardIconItemData;
        let itemVo: TgbjRecordItemData;
        this.listAllVec.length = 0;
        let recordInfo: Protocol.SkyLotteryListRecordRsp = this.tgbjData.getAllRecordByType(EnumTgbjRule.MDBK_LOTTERY_RECORD_TYPE, this.m_currentTag);
        if (recordInfo) {
            for (let oneRecord of recordInfo.m_astRecordList) {
                itemThingId = oneRecord.m_aiThingID;
                thingConfig = ThingData.getThingConfig(itemThingId);
                if (thingConfig) {
                    itemVo = new TgbjRecordItemData();
                    itemVo.type = EnumTgbjRule.MDBK_LOTTERY_RECORD_TYPE;
                    itemVo.recordType = EnumTgbjRule.RECORD_ALL_TYPE;
                    itemVo.roleId = oneRecord.m_stRoleId;
                    itemVo.roleName = oneRecord.m_szNickName;
                    iconData = RewardIconItemData.alloc();
                    iconData.id = oneRecord.m_aiThingID;
                    iconData.number = oneRecord.m_iThingNumber;
                    itemVo.thingConfig = thingConfig;
                    itemVo.iconItemData = iconData;
                    this.listAllVec.push(itemVo);
                }
            }
        }
        this.showRecordInfo(this.listAllVec, false);
        this.updateBox();
    }


    private onTabChange(index: number): void {
        this._stopTimer();
        this.m_inPlay = false;
        this.myRecordList.Count = 0;
        this.worldRecordList.Count = 0;
        this.updateLotteryZone();
        this._getRecords();
        this.updateMyselfRecord();
        this.updateAllRecord();
        this.IsSetGrey(false);
    }

    get tgbjData(): TgbjData {
        return G.DataMgr.tgbjData;
    }

    get listMyselfVec(): TgbjRecordItemData[] {
        if (!this._listMyselfVec) {
            this._listMyselfVec = new Array<TgbjRecordItemData>();
        }
        return this._listMyselfVec;
    }

    get listAllVec(): TgbjRecordItemData[] {
        if (!this._listAllVec) {
            this._listAllVec = new Array<TgbjRecordItemData>();
        }
        return this._listAllVec;
    }
}
class boxItem {
    private noReach: UnityEngine.GameObject;
    private reached: UnityEngine.GameObject;
    private opened: UnityEngine.GameObject;
    private icon: UnityEngine.GameObject;
    private value: UnityEngine.UI.Text;
    //当前的抽奖次数
    private rewardNum: number;
    private currentTag: number;
    private canGet: boolean;
    private rewardItems: GameConfig.LotteryExchangeItem[] = [];
    private config: GameConfig.LotteryExchangeCfgM = null;
    //是否领取了奖励
    private state: EnumRewardState;
    setComponent(go: UnityEngine.GameObject, num: number) {
        this.noReach = ElemFinder.findObject(go, 's1/noReach');
        this.reached = ElemFinder.findObject(go, 's1/reached');
        this.opened = ElemFinder.findObject(go, 's1/opened');
        this.icon = ElemFinder.findObject(go, 'icon');
        this.value = ElemFinder.findText(go, 's1/textValue');
        Game.UIClickListener.Get(go).onClick = delegate(this, this.onClickBox, num);

    }
    updata(config: GameConfig.LotteryExchangeCfgM, m_currentTag: number, index: number) {
        //第一次开启时是没有数据的
        if (config == null) return;

        this.currentTag = m_currentTag;
        this.config = config;
        //未领取 领取
        let tgbjData = G.DataMgr.tgbjData;
        this.rewardNum = tgbjData.totalNum;
        this.value.text = config.m_iNubmer.toString();
        this.canGet = tgbjData.canGetReward(1 << index);
        this.state = this.canGet == true ? EnumRewardState.NotGot : EnumRewardState.HasGot;
        if (this.rewardNum >= config.m_iNubmer) {
            this.noReach.SetActive(false);
            this.reached.SetActive(this.canGet);
        } else {
            this.noReach.SetActive(true);
            this.reached.SetActive(false);
            this.state = EnumRewardState.NotReach;
        }
        //是否可以获得奖励
        this.opened.SetActive(!this.canGet);
    }
    private onClickBox() {
        let rewardData: RewardIconItemData[] = [];
        let rewardCount = this.config.m_stItemList.length;
        for (let i = 0; i < rewardCount; i++) {
            let rewardItem = new RewardIconItemData();
            let rewardCfg = this.config.m_stItemList[i];
            rewardItem.id = rewardCfg.m_iItemId;
            rewardItem.number = rewardCfg.m_iItemNumber;
            rewardData.push(rewardItem);
        }
        let desc = uts.format('累计次数达到{0}次即可领取', this.config.m_iNubmer)
        G.Uimgr.createForm<RewardView>(RewardView).open(rewardData, desc, this.state, delegate(this, this.onClick, this.config.m_iNubmer));
    }
    /**点击箱子 */
    private onClick(num: number) {
        if (this.state == EnumRewardState.NotGot) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSkyLotteryRequest(Macros.SKYLOTTERY_EXTRA_REWARD, this.currentTag, num));
        }
    }
}
