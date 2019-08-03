import { StarsStoreView } from "System/activity/xingdoubaoku/StarsStoreView";
import { BatBuyView } from 'System/business/view/BatBuyView';
import { EnumStoreID, UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { ThingData } from "System/data/thing/ThingData";
import { UIPathData } from "System/data/UIPathData";
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData';
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView';
import { Global as G } from 'System/global';
import { OpenChestView } from "System/guide/OpenChestView";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, GameObjectGetSet, TextGetSet, UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { FixedList } from "System/uilib/FixedList";
import { IconItem } from "System/uilib/IconItem";
import { List, ListItem } from "System/uilib/List";
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { DataFormatter } from "System/utils/DataFormatter";
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { ItemMaterialInfo, ItemToggleInfo } from "../../ItemPanels/PropertyItemNode";

/**星斗宝库 */
export class StarsTreasuryView extends CommonForm {
    private readonly PATH_EFFECT = "model/effect/";
    private readonly PATH_NAME_TOP_CENTER = "starsCenter.prefab";
    private readonly PATH_NAME_CENTER = "starsCenterEff.prefab";

    /**材料ID*/
    private readonly ID_MATERAIL: number = 10233011;
    /**抽奖1次*/
    private readonly LOTTERY_1: number = 1;
    /**抽奖5次*/
    private readonly LOTTERY_5: number = 5;

    private readonly TIMER_NAME_FREE = "freeTime";
    private readonly TIMER_NAME_SET_TIPS = "setTipsMask";

    private luckMaxValue = 500;

    /**右上角的魂币显示*/
    private currencyTip: CurrencyTip;

    /**进度条*/
    private sliderLuckValue: UnityEngine.UI.Image;
    private txtCurrentLuck: TextGetSet;
    private txtMaxLuck: TextGetSet;
    private effStarsRotate: UnityEngine.UI.Image;
    /**圆盘指针*/
    private pointer: ItemDiscPointer;
    /**奖励列表*/
    private listAward: FixedList;
    private awardIconitem: IconItem[] = [];
    /**概率说明*/
    private btnRuler: GameObjectGetSet;
    /**钻石奖励*/
    private btnDiamond: GameObjectGetSet;
    private btnDiamondTips: GameObjectGetSet;
    /**二十四桥明月夜*/
    private btnTreasury: GameObjectGetSet;
    private btnTreasuryTips: GameObjectGetSet;
    /**玩法说明*/
    private btnTips: GameObjectGetSet;
    /**加号按钮*/
    private btnAddTopPrize: GameObjectGetSet = null;
    /**领取头奖按钮*/
    private btnGetTopPrize: GameObjectGetSet = null;

    private btnStartOnce: GameObjectGetSet;
    private btnStartOnceTips: GameObjectGetSet;
    private btnStartQuintic: GameObjectGetSet;
    private txtTime: TextGetSet;

    private itemNumberRoll: ItemNumberRoll;

    private btnAllInfo: GameObjectGetSet;
    private btnMyInfo: GameObjectGetSet;
    private maskButtonInfo: GameObjectGetSet;
    private txtMaskName: TextGetSet;
    private infoList: List;

    private itemOncePrice: ItemMaterialInfo;
    private itemQuinticPrice: ItemMaterialInfo;
    private itemOnceToggle: ItemToggleInfo;
    private itemQuinticToggle: ItemToggleInfo;

    private panelSelectAwardTips: PanelSelectAwardTips;
    private panelTreasuryProfitRank: PanelTreasuryProfitRank;

    private maskPanel: GameObjectGetSet;
    private btnClose: GameObjectGetSet;

    private numberAtals: Game.UGUIAltas;                    //图集 数字0 1 2 3 4 ...
    private itemIcon_Normal: GameObjectGetSet;              //itemicon 预制体
    private isCurrentAllInfo: boolean = true;               //标记 当前是否是全服信息（我的信息）
    private curAwardDatas: Protocol.LotteryThingInfo[] = [];//当前抽到的奖品信息
    private curLuck: number = 0;                            //当前幸运值
    private isTopPrize: boolean = false;                    //是否有头奖

    constructor() {
        super(KeyWord.ACT_FUNCTION_STARSTREASURY);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.StarsTreasuryView;
    }

    protected initElements() {
        //绑定unity相关组件
        this.initGetUnity();

        //数据初始化
        this.initFormot();

        this._cacheForm = true;
    }

    /**绑定unity相关组件 */
    private initGetUnity() {

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("CurrencyTip"));

        this.sliderLuckValue = this.elems.getImage("sliderLuck");
        this.txtCurrentLuck = new TextGetSet(this.elems.getText("txtCurrentLuck"));
        this.txtMaxLuck = new TextGetSet(this.elems.getText("txtMaxLuck"));
        this.effStarsRotate = this.elems.getImage("effStarsRotate");

        this.listAward = this.elems.getUIFixedList("listAward");
        this.pointer = new ItemDiscPointer();
        this.pointer.setComponents(new GameObjectGetSet(this.elems.getElement("pointer")));
        this.pointer.succendCall = delegate(this, this.onSucceedCall);

        this.btnRuler = new GameObjectGetSet(this.elems.getElement("btnRule"));
        this.btnTips = new GameObjectGetSet(this.elems.getElement("btnTips"));
        this.btnDiamond = new GameObjectGetSet(this.elems.getElement("btnDiamond"));
        this.btnDiamondTips = new GameObjectGetSet(ElemFinder.findObject(this.btnDiamond.gameObject, "btnDiamondTips"));
        this.btnTreasury = new GameObjectGetSet(this.elems.getElement("btnTreasury"));
        this.btnTreasuryTips = new GameObjectGetSet(ElemFinder.findObject(this.btnTreasury.gameObject, "btnTreasuryTips"));

        this.initLeftDown();
        this.btnStartOnce = new GameObjectGetSet(this.elems.getElement("btnStartOne"));
        this.btnStartOnceTips = new GameObjectGetSet(ElemFinder.findObject(this.btnStartOnce.gameObject, "btnStartOnceTips"));
        this.btnStartQuintic = new GameObjectGetSet(this.elems.getElement("btnStartFive"));
        this.txtTime = new TextGetSet(this.elems.getText("txtTime"));

        this.numberAtals = this.elems.getUGUIAtals("numberAtals");
        this.itemNumberRoll = new ItemNumberRoll();
        this.itemNumberRoll.setComponents(new GameObjectGetSet(this.elems.getElement("itemJackpot")), this.numberAtals);

        this.btnAllInfo = new GameObjectGetSet(this.elems.getElement("btnAllInfo"));
        this.btnMyInfo = new GameObjectGetSet(this.elems.getElement("btnMyInfo"));
        this.maskButtonInfo = new GameObjectGetSet(this.elems.getElement("maskButtonInfo"));
        this.txtMaskName = new TextGetSet(ElemFinder.findText(this.maskButtonInfo.gameObject, "txtMask"));
        this.infoList = this.elems.getUIList("infoList");

        this.itemIcon_Normal = new GameObjectGetSet(this.elems.getElement('itemIcon_Normal'));
        this.maskPanel = new GameObjectGetSet(this.elems.getElement('maskPanel'));
        this.btnClose = new GameObjectGetSet(this.elems.getElement('btnClose'));

        this.initPanel();

        //加载特效
        let center = uts.format("{0}{1}", this.PATH_EFFECT, this.PATH_NAME_CENTER);
        let item = this.listAward.GetItem(0);
        let icon = ElemFinder.findObject(item.gameObject, "mask/bg/icon");
        G.ResourceMgr.loadModel(icon, UnitCtrlType.other, center, this.sortingOrder);

    }

    private initLeftDown() {
        this.itemOncePrice = new ItemMaterialInfo();
        this.itemOncePrice.setComponents(this.elems.getElement("itemMaterialOne"));
        this.itemQuinticPrice = new ItemMaterialInfo();
        this.itemQuinticPrice.setComponents(this.elems.getElement("itemMaterialQuintic"));
        this.itemOnceToggle = new ItemToggleInfo();
        this.itemOnceToggle.setComponents(this.elems.getElement("toggleAutoOne"));
        this.itemQuinticToggle = new ItemToggleInfo();
        this.itemQuinticToggle.setComponents(this.elems.getElement("toggleAutoFive"));
    }

    private initPanel() {
        this.panelSelectAwardTips = new PanelSelectAwardTips();
        this.panelSelectAwardTips.setComponents(new GameObjectGetSet(this.elems.getElement("SelectAwardTips")), this.itemIcon_Normal);
        this.panelSelectAwardTips.selectPrizeCall = delegate(this, this.onSelectPrizeCall);

        this.panelTreasuryProfitRank = new PanelTreasuryProfitRank();
        this.panelTreasuryProfitRank.setComponents(new GameObjectGetSet(this.elems.getElement("JackpotRankTips")));
        this.panelTreasuryProfitRank.applyCall = delegate(this, this.onApplyCall);
    }

    /**初始化格式，数据等 */
    private initFormot() {
        //奖励排版
        this.initListAward();

        //消耗数据
        this.refreshMatAndMon();

        //刷新时间

        //钻石奖池

        //全服信息

        this.luckMaxValue = G.DataMgr.constData.getValueById(KeyWord.PARAM_STAR_LOTTERY_LUCK_MAX);
        this.txtMaxLuck.text = "/" + this.luckMaxValue.toString();

    }

    /**初始奖励排版 */
    private initListAward() {
        //第一个在中间大奖 其余的旋转排列 最右第一，逆时针排列
        let con = this.listAward.Count;
        let angle = 360 / (con - 1);
        for (let i = 1; i < con; i++) {
            let item = this.listAward.GetItem(i);
            let rect = item.gameObject.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
            let v2 = UnityEngine.Vector2.one;
            v2.y = Math.sin(Math.PI / 180 * (i) * angle);
            v2.x = Math.cos(Math.PI / 180 * (i) * angle);
            v2.x *= 200;
            v2.y *= 200;
            rect.anchoredPosition = v2;
        }
    }

    protected initListeners() {
        this.addClickListener(this.btnRuler.gameObject, this.onClickRule);
        this.addClickListener(this.btnTips.gameObject, this.onClickTips);
        this.addClickListener(this.btnDiamond.gameObject, this.onClickDiamond);
        this.addClickListener(this.btnTreasury.gameObject, this.onClickTreasury);
        this.addClickListener(this.btnStartOnce.gameObject, this.onClickStartOnce);
        this.addClickListener(this.btnStartQuintic.gameObject, this.onClickStartQuintic);
        this.addClickListener(this.maskPanel.gameObject, this.onClickMaskPanel);

        this.addClickListener(this.btnAllInfo.gameObject, this.onClickAllInfo);
        this.addClickListener(this.btnMyInfo.gameObject, this.onClickMyInfo);
        this.addClickListener(this.btnClose.gameObject, this.close);
    }

    protected onOpen() {
        //数据清理
        this.itemNumberRoll.initialite();


        //打开面板请求
        this.sendOpenPanel();
        //拉取我的中奖信息请求
        this.onUpdateMoney();
        this.onClickAllInfo();

        //设置指针向上
        this.pointer.initPointerAngle(3);

        this.starPanelResponse();

        //设置材料
        this.setMateailShow();
    }

    protected onClose() {
        //关闭计时
        this.removeTimer(this.TIMER_NAME_FREE);
        this.removeTimer(this.TIMER_NAME_SET_TIPS);
        //关闭动画
        this.itemNumberRoll.onClose();
    }

    /**点击“概率说明”*/
    private onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(471), "概率说明");
    }

    /**点击右上角的玩法说明 */
    private onClickTips() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(472), "玩法说明");
    }

    /**点击“钻石奖池”*/
    private onClickDiamond() {
        //发送获取排行请求...
        this.sendGetRank();
    }

    /**点击“二十四桥明月夜”*/
    private onClickTreasury() {
        G.Uimgr.createForm<StarsStoreView>(StarsStoreView).open();
    }

    /**点击“抽奖一次”*/
    private onClickStartOnce() {
        this.tryLottery(this.LOTTERY_1);
    }

    /**点击“抽奖五次”*/
    private onClickStartQuintic() {
        this.tryLottery(this.LOTTERY_5);
    }

    /**点击“全服信息”*/
    private onClickAllInfo() {
        this.isCurrentAllInfo = true;
        this.maskButtonInfo.transform.position = this.btnAllInfo.transform.position;
        this.txtMaskName.text = "全服信息";
        this.sendGetInfo(1);
    }

    /**点击“我的信息”*/
    private onClickMyInfo() {
        this.isCurrentAllInfo = false;
        this.maskButtonInfo.transform.position = this.btnMyInfo.transform.position;
        this.txtMaskName.text = "我的信息";
        this.sendGetInfo(2);
    }

    /**点击 抽奖之后的面板 */
    private onClickMaskPanel() {
        this.pointer.stopTween();
    }

    /**点击 添加大奖 */
    private onClickAddTopPrize() {
        this.sendGetTopPrizeCfg();
    }

    /**点击 获得大奖 */
    private onClickGetTopPrize() {
        this.sendGetTopPrize();
    }

    /**
     * 抽奖成功回调
     * @param isTween
     */
    private onSucceedCall(isTween: boolean) {
        let datas: RewardIconItemData[] = [];
        let count = this.curAwardDatas.length;
        for (let i = 0; i < count; i++) {
            if (this.curAwardDatas[i].m_iThingID == 0) continue;
            let item: RewardIconItemData = new RewardIconItemData();
            item.id = this.curAwardDatas[i].m_iThingID;
            item.number = this.curAwardDatas[i].m_iThingNumber;
            datas.push(item);
        }
        this.showReward(datas);

        if (this.curLuck >= this.luckMaxValue && this.isTopPrize) {
            this.setCanObtain();
        }

        if (this.isCurrentAllInfo) {
            //刷新全服信息
            this.onClickAllInfo();
        }
        else {
            //刷新我的信息
            this.onClickMyInfo();
        }

        //mash取消 可以操作
        this.maskPanel.SetActive(false);

        //设置材料
        this.setMateailShow();
    }



    /**
     * 选择大奖成功回调（前台）
     * @param index 大奖序号
     */
    private onSelectPrizeCall(index: number) {
        //发送请求
        this.sendSelectedTopPrize(index);
    }

    /**领取红包回调 */
    private onApplyCall() {
        //发送请求
        this.sendHongbao();
    }

    /**
     * 展示获得奖励列表
     * 1.5秒之后会自动关闭（通用的展示面板）
     * @param datas
     */
    private showReward(datas: RewardIconItemData[]) {
        G.Uimgr.createForm<OpenChestView>(OpenChestView).open('恭喜获得', datas, false);
    }

    private showRewardTopPrize(data: Protocol.ContainerThingObj) {
        let datas: RewardIconItemData[] = [];
        if (data.m_stInfo.m_iThingID == 0) return;
        let item: RewardIconItemData = new RewardIconItemData();
        item.id = data.m_stInfo.m_iThingID;
        item.number = data.m_stInfo.m_iNumber;
        datas.push(item);
        this.showReward(datas);
    }

    /**刷新所需材料和钻石 */
    private refreshMatAndMon() {
        this.itemOncePrice.setIconForObject(this.ID_MATERAIL);
        this.itemQuinticPrice.setIconForObject(this.ID_MATERAIL);
        this.itemOnceToggle.setIconForMat(KeyWord.MONEY_YUANBAO_ID);
        this.itemQuinticToggle.setIconForMat(KeyWord.MONEY_YUANBAO_ID);


        //设置钻石
        let money = G.DataMgr.npcSellData.getPriceByID(this.ID_MATERAIL, 0, EnumStoreID.MALL_YUANBAO, KeyWord.MONEY_YUANBAO_ID, 1, false);
        this.itemOnceToggle.setValue(money);
        this.itemQuinticToggle.setValue(money * 5);
    }

    /**
     * 设置免费时间
     * @param endTime
     */
    private setFreeTime(endTime: number) {
        this.addTimer(this.TIMER_NAME_FREE, 1000, -1, delegate(this, this.updateTime, endTime));
    }

    private updateTime(timer: Game.Timer, endTime: number) {
        let curTime = G.SyncTime.getCurrentTime() / 1000;
        if (endTime <= curTime) {
            //结束计时
            this.txtTime.text = "本次免费";
            this.removeTimer(this.TIMER_NAME_FREE);
            this.addTimer(this.TIMER_NAME_SET_TIPS, 1000, 1, delegate(this, this.setTipsMask));
        }
        else {
            let time = endTime - curTime;
            this.txtTime.text = uts.format("免费时间:{0}", DataFormatter.second2hhmmss(time));
        }
    }

    /**
     * 设置当前幸运值
     * @param luck
     */
    private setCurrentLuck(luck: number) {
        this.curLuck = luck;
        luck = Math.min(luck, this.luckMaxValue);
        this.txtCurrentLuck.text = luck.toString();
        let percent = luck / this.luckMaxValue;
        this.sliderLuckValue.fillAmount = percent;
        this.effStarsRotate.fillAmount = percent;
    }

    /**
     * 设置全服奖池的数量
     * @param number
     */
    private setJackpotNumber(number: number) {
        number = Math.min(number, G.DataMgr.constData.getValueById(KeyWord.PARAM_STAR_LOTTERY_HONG_BAO_MAX));
        this.itemNumberRoll.setNumberB(number);
    }

    /**
     * 设置奖励列表
     * @param count
     * @param datas
     */
    private setAwardList(count: number, datas: Protocol.StarLotteryConfig_Server[]) {
        //生成奖励物体 用FixedList直接设置吧

        //给物体赋值
        for (let i = 0; i < count; i++) {
            let item = this.listAward.GetItem(i + 1);
            let icon = ElemFinder.findObject(item.gameObject, "mask/icon");
            let color = ElemFinder.findImage(item.gameObject, "shade");
            if (this.awardIconitem[i + 1] == null) {
                this.awardIconitem[i + 1] = new IconItem();
                this.awardIconitem[i + 1].setExhibitionIcon(this.itemIcon_Normal.gameObject, icon);
            }
            let iconItem = this.awardIconitem[i + 1];
            iconItem.updateExhibitionById(datas[i].m_iItemId);
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.closeStarLevelFlag();
            iconItem.updateIcon();
            if (color != null)
                color.sprite = iconItem.getFrameColorE;

            let txt = ElemFinder.findText(item.gameObject, "txtNumber");
            let num = datas[i].m_iItemNum;
            txt.text = num == 1 ? "" : num.toString();
        }
    }

    /**
     * 设置大奖信息
     * @param data
     */
    private setTopAward(data: Protocol.ContainerThingObj) {
        if (this.btnAddTopPrize == null) {
            this.btnAddTopPrize = new GameObjectGetSet(ElemFinder.findObject(this.listAward.GetItem(0).gameObject, "mask/bg/bigAddEffect"));
            this.addClickListener(this.btnAddTopPrize.gameObject, this.onClickAddTopPrize);
        }
        if (this.btnGetTopPrize == null) {
            this.btnGetTopPrize = new GameObjectGetSet(ElemFinder.findObject(this.listAward.GetItem(0).gameObject, "mask/btnGet"));
            this.addClickListener(this.btnGetTopPrize.gameObject, this.onClickGetTopPrize);
        }

        //头奖信息为空，没有头奖
        this.isTopPrize = data != null;
        if (data == null) {
            this.setTopAwardNone();
        }
        else {
            this.setTopAwardHave(data);
        }
    }

    private topPrizeIconItem: IconItem = null;
    private setTopAwardHave(data: Protocol.ContainerThingObj) {
        this.isTopPrize = true;
        //设置头奖
        let item = this.listAward.GetItem(0);
        let icon = ElemFinder.findObject(item.gameObject, "mask/bg/icon");
        if (this.topPrizeIconItem == null) {
            this.topPrizeIconItem = new IconItem();
            this.topPrizeIconItem.setExhibitionIcon(this.itemIcon_Normal.gameObject, icon);
            this.topPrizeIconItem.closeStarLevelFlag();
        }
        this.topPrizeIconItem.updateByThingInfo(data.m_stInfo, Macros.CONTAINER_TYPE_STARLOTTERY);
        this.topPrizeIconItem.setTipFrom(TipFrom.normal);
        this.topPrizeIconItem.updateIcon();

        let txt = ElemFinder.findText(item.gameObject, "txtNumber");
        let num = data.m_stInfo.m_iNumber;
        txt.text = num == 1 ? "" : num.toString();

        //加号特效 关
        this.btnAddTopPrize.SetActive(false);

        if (this.curLuck >= this.luckMaxValue) {
            let rotate = uts.format("{0}{1}", this.PATH_EFFECT, this.PATH_NAME_TOP_CENTER);
            G.ResourceMgr.loadModel(this.btnGetTopPrize.gameObject, UnitCtrlType.other, rotate, this.sortingOrder);
            this.btnGetTopPrize.SetActive(true);
        }
        else {
            this.btnGetTopPrize.SetActive(false);
        }
        icon.gameObject.SetActive(true);
    }

    private setTopAwardNone() {
        this.isTopPrize = false;

        let item = this.listAward.GetItem(0);
        let txt = ElemFinder.findText(item.gameObject, "txtNumber");
        let icon = ElemFinder.findObject(item.gameObject, "mask/bg/icon");
        txt.text = "";
        //加号特效 开
        this.btnAddTopPrize.SetActive(true);
        this.btnGetTopPrize.SetActive(false);
        icon.gameObject.SetActive(false);
    }

    private setCanObtain() {
        let rotate = uts.format("{0}{1}", this.PATH_EFFECT, this.PATH_NAME_TOP_CENTER);
        G.ResourceMgr.loadModel(this.btnGetTopPrize.gameObject, UnitCtrlType.other, rotate, this.sortingOrder);
        this.btnGetTopPrize.SetActive(true);
    }

    /**
     * 设置获奖记录
     * @param infos
     */
    private setPrizeInfo(infos: Protocol.StarLotteryRecord[], infoType: number) {
        // xx 获得 xxx
        //保证当前的信息界面和系统发回来的信息对应
        this.infoList.ScrollByAxialRow(0);
        if ((infoType == 1 && this.isCurrentAllInfo) || (infoType == 2 && !this.isCurrentAllInfo)) {
            let con = infos.length;
            this.infoList.Count = con;
            for (let i = 0; i < con; i++) {
                let str = "";
                if (infos[i].m_aiThingID != 0) {
                    let name = infos[i].m_szNickName == "" ? G.DataMgr.heroData.name : infos[i].m_szNickName;
                    str += name;
                    str += " 获得 ";
                    let thingdata = ThingData.getThingConfig(infos[i].m_aiThingID);
                    str += TextFieldUtil.getColorText(thingdata.m_szName, Color.getColorById(thingdata.m_ucColor));
                    str += uts.format("*{0}", infos[i].m_iThingNumber);
                }
                let txt = this.infoList.GetItem(i).gameObject.GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
                txt.text = str;
            }
        }
    }

    /**尝试抽奖*/
    private tryLottery(count: number): void {
        //if (this.hasTimer("1")) {
        //    return;
        //}
        //幸运值
        if (this.curLuck >= this.luckMaxValue && this.isTopPrize) {
            G.TipMgr.addMainFloatTip("请先领取奖励");
            return;
        }
        //大奖为空
        if (!this.isTopPrize) {
            G.TipMgr.addMainFloatTip("请先选择大奖");
            return;
        }
        //宝库数量
        if (StarsStoreView.MAX_CAPACITY - G.DataMgr.thingData.getCurStarsStorePosNum() < count) {
            G.TipMgr.addMainFloatTip('您的宝库空格不足。');
            return;
        }
        //免费
        let curTime = G.SyncTime.getCurrentTime() / 1000;
        let time = G.DataMgr.starsData.getFreeTime();
        if (curTime > time && count == this.LOTTERY_1) {
            this.sendRecoreRequest(count);
            return;
        }

        let canDo: boolean = true;
        let needConfirm: boolean = false;
        if (count == this.LOTTERY_1 || count == this.LOTTERY_5) {
            // 检查鉴宝石
            let num = G.DataMgr.thingData.getThingNum(this.ID_MATERAIL, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            if (num >= count) {
                //材料够
                this.sendRecoreRequest(count);
            }
            else if ((count == this.LOTTERY_1 && this.itemOnceToggle.isOn()) ||
                (count == this.LOTTERY_5 && this.itemQuinticToggle.isOn())) {
                let money = G.DataMgr.getOwnValueByID(KeyWord.MONEY_YUANBAO_ID);
                let onceMoner = G.DataMgr.npcSellData.getPriceByID(this.ID_MATERAIL, 0, EnumStoreID.MALL_YUANBAO, KeyWord.MONEY_YUANBAO_ID, 1, false);;
                if (money < onceMoner * (count - num)) {
                    G.TipMgr.addMainFloatTip("您的钻石不足");
                }
                else {
                    //钻石够
                    this.sendRecoreRequest(count);
                }
            }
            else {
                //提示购买 tip
                G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.ID_MATERAIL, count - num);
            }
        }
    }

    private setMateailShow() {
        let num = G.DataMgr.thingData.getThingNum(this.ID_MATERAIL, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        this.itemOncePrice.setValueForString(TextFieldUtil.getColorText(uts.format("{0}/{1}", this.LOTTERY_1, num), num >= this.LOTTERY_1 ? Color.GREEN : Color.RED));
        this.itemQuinticPrice.setValueForString(TextFieldUtil.getColorText(uts.format("{0}/{1}", this.LOTTERY_5, num), num >= this.LOTTERY_5 ? Color.GREEN : Color.RED));
    }

    private setTipsMask() {
        this.btnStartOnceTips.SetActive(G.DataMgr.starsData.isFreeTime());
        this.btnDiamondTips.SetActive(G.DataMgr.starsData.isNeedApply());
        this.setStoreTipsMask();
    }

    private setStoreTipsMask() {
        this.btnTreasuryTips.SetActive(G.DataMgr.starsData.isStoreHaveObj());
    }

    /**打开面板请求 */
    private sendOpenPanel() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getStarsOpenPanelRequest());
    }

    /**
     * 发送抽奖请求
     * @param count
     */
    private sendRecoreRequest(count: number) {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getStarsTreasuryRequest(Macros.STAR_LOTTERY_OPERATE, count));
    }

    /**
     * 发送获取信息请求
     * @param infoType 1全服 2我的
     */
    private sendGetInfo(infoType: number) {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getStarsRecordListRequest(infoType));
    }

    /**获取大奖信息请求 */
    private sendGetTopPrizeCfg() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getStarsTopPrizeCfgRequest());
    }

    /**领奖请求 */
    private sendGetTopPrize() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getStarsGetPrizeRequest());
    }

    /**选择大奖请求 */
    private sendSelectedTopPrize(index: number) {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getStarsChoosePrizeRequest(index));
    }

    /**红包请求 */
    private sendHongbao() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getStarsHongbaoRequest());
    }

    /**红包排行 */
    private sendGetRank() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getStarsGetRankRequest());
    }



    ///////////////////////////////请求服务器的响应//////////////////////////////////////
    /**
     * 打开面板响应
     * @param msg
     */
    starPanelResponse() {
        let msg = G.DataMgr.starsData.lotteryData;
        //下次免费时间 幸运值 全服总消费 配置个数 奖励配置列表 大奖物品
        //刷新时间
        this.setFreeTime(msg.m_uiNexFreeTime);
        //幸运值赋值
        this.setCurrentLuck(msg.m_uiLuck);
        //设置总消费
        this.setJackpotNumber(msg.m_uiServerCost);
        //刷新奖励列表
        this.setAwardList(msg.m_ucCfgCount, msg.m_stConfigList);
        //设置大奖物品
        if (msg.m_stPrizeThingObj.m_stInfo.m_iThingID == 0)
            this.setTopAward(null);
        else
            this.setTopAward(msg.m_stPrizeThingObj);

        //设置红点
        this.setTipsMask();
    }

    /**
     * 星空宝库抽奖操作响应
     * @param msg
     */
    starOperateResponse(msg: Protocol.StarLotteryOperateRsp) {
        //设置幸运值
        this.setCurrentLuck(msg.m_uiLuck);
        //if (msg.m_uiLuck >= this.MAX_LUCK_VALUE)
        //    this.sendOpenPanel();
        //设置时间
        this.setFreeTime(msg.m_uiNexFreeTime);
        //设置总消费
        this.setJackpotNumber(msg.m_uiServerCost);
        //设置红点
        this.setTipsMask();

        let con = msg.m_ucLotteryNum;
        for (let i = 0; i < con; i++) {
            if (msg.m_astThingInfo[i].m_ucPos == 0) {
                //抽到大奖
                this.curAwardDatas = msg.m_astThingInfo;
                this.onSucceedCall(false);
                //设置头奖没了
                this.setTopAward(null);
                return;
            }
        }

        if (msg.m_ucLotteryNum == this.LOTTERY_1) {
            this.maskPanel.SetActive(true);
            this.curAwardDatas = msg.m_astThingInfo;
            this.pointer.setAwardIdForOnce(msg.m_astThingInfo[0].m_ucPos);
        }
        else if (msg.m_ucLotteryNum == this.LOTTERY_5) {
            this.maskPanel.SetActive(true);
            this.curAwardDatas = msg.m_astThingInfo;
            this.pointer.setAwardIdForOnce(msg.m_astThingInfo[0].m_ucPos, false);
        }


    }

    /**
     * 星空宝库查询抽奖记录响应
     * @param msg
     */
    starListRecoreResponse(msg: Protocol.StarLotteryListRecordRsp) {
        //刷新记录信息
        this.setPrizeInfo(msg.m_astRecordList, msg.m_ucListType);
    }

    /**
     * 星斗宝库领取头奖响应
     * @param msg
     */
    starGetTopPrizeResponse(msg: Protocol.StarLotteryGetTopPrizeRsp) {
        //展示头奖
        this.showRewardTopPrize(msg.m_stPrizeThingObj);
        //设置头奖
        this.setTopAward(null);
        //幸运值归零
        this.setCurrentLuck(0);
    }

    /**
     * 星斗宝库选择头奖响应
     * @param msg
     */
    starChooseTopPrizeResponse(msg: Protocol.StarLotteryChooseTopPrizeRsp) {
        //刷新头奖显示
        this.setTopAward(msg.m_stPrizeThingObj);
    }

    /**
     * 获取选择头奖信息(6个)
     * @param msg
     */
    starGetTopPrizeCfgResponse(msg: Protocol.StarLotteryTopPrizeCfgRsp) {
        //打开头奖选择界面
        this.panelSelectAwardTips.onOpen(msg.m_stConfigList);
    }

    /**
     * 星斗宝库红包排行信息
     * @param msg
     */
    starHongbaoRankCfgResponse(msg: Protocol.StarLotteryRankHistoryRsp) {
        //打开排行
        this.panelTreasuryProfitRank.onOpen(msg);
    }

    /**红包状态改变 */
    applyChange() {
        this.panelTreasuryProfitRank.appleChange();
        this.setTipsMask();
    }

    /**
     * 设置总消费
     * @param num
     */
    starServerCost(num: number) {
        this.setJackpotNumber(num);
    }

    /**
     * 仓库数据变化
     */
    onContainerChange() {
        this.setMateailShow();
        this.setStoreTipsMask();
    }

    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }
}



/**圆盘的指针 */
class ItemDiscPointer {
    //功能 就是一个旋转的动画

    private rectPointer: UnityEngine.RectTransform;
    private updateTimer: Game.Timer = null;
    succendCall: (isTween: boolean) => void;
    private readonly ITEN_NUMBER = 12;
    private itemAngle: number = 0;
    private isTween: boolean = false;

    private sumAngle: number = 0;
    private curIndex: number = 0;
    private curSpeed: number = 0;
    private curAngle: number = 0;
    private lastIndex: number = 0;

    setComponents(go: GameObjectGetSet) {
        this.rectPointer = go.gameObject.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
        this.itemAngle = 360 / this.ITEN_NUMBER;
    }

    initPointerAngle(index: number) {
        this.setAngleInt(index);
        this.curIndex = index;
    }

    /**
     * 设置获得的奖励
     * @param id
     * @param isTween
     */
    setAwardIdForOnce(id: number, isTween: boolean = true) {
        this.lastIndex = this.curIndex;
        this.curIndex = id;
        this.isTween = isTween;
        if (isTween) {
            this.sumAngle = -5 * 360 + (this.curIndex - this.lastIndex) * this.itemAngle;
            this.startRotate();
        }
        else {
            //TODO...5次的动画效果
            this.sumAngle = -5 * 360 + (this.curIndex - this.lastIndex) * this.itemAngle;
            this.startRotate();
            //this.setAngleInt(this.curIndex);
            //this.succeed();
        }
    }

    /**停止动画 */
    stopTween() {
        this.stopRotate();
    }

    private startRotate() {
        if (this.updateTimer == null) {
            this.updateTimer = new Game.Timer("UpdateTimer", 3, -1, delegate(this, this.updateRotate));
        }
        else {
            this.updateTimer.ResetTimer(3, -1, delegate(this, this.updateRotate));
        }
    }

    private updateRotate(timer: Game.Timer) {
        let time = timer.MaxTime / 1000;
        this.curSpeed = this.getSpeedForDistance(this.sumAngle);
        this.sumAngle += this.curSpeed * time;
        if (this.sumAngle >= 0) {
            this.stopRotate();
        }
        this.curAngle -= this.curSpeed * time;
        this.setAngleFloat(this.curAngle);
    }

    private stopRotate() {
        if (this.updateTimer != null) {
            this.updateTimer.Stop();
            this.updateTimer = null;
        }
        this.succeed();
        this.setAngleInt(this.curIndex);
    }

    private succeed() {
        if (this.succendCall)
            this.succendCall(this.isTween);
    }

    /**
     * 设置指针位置
     * @param angle 角度
     */
    private setAngleFloat(angle: number) {
        let v3 = UnityEngine.Vector3.zero;
        v3.z = angle % 360;
        this.curAngle = v3.z;
        Game.Tools.SetRotation(this.rectPointer, v3);
    }

    /**
     * 精准的设置指针位置
     * @param index 奖励index
     */
    private setAngleInt(index: number) {
        let v3 = UnityEngine.Vector3.zero;
        v3.z = index * this.itemAngle;
        this.curAngle = v3.z;
        Game.Tools.SetRotation(this.rectPointer, v3);
    }



    private getSpeedForDistance(dis: number): number {
        let speed = dis * 10;
        speed = Math.abs(speed) + 10;
        speed = Math.min(speed, 3600);
        return speed;
    }


}

/**数字滚动（单个） */
class ItemNumberRollOne {
    private imgFirst: UnityEngine.UI.Image;
    private imgSecond: UnityEngine.UI.Image;

    private rectNumberNode: UnityEngine.RectTransform;
    private numberAtals: Game.UGUIAltas;
    private readonly ATALS_NUMBER_PREFIX = "treasury_TXT_";
    private readonly CARF_MAX_HEIGHT = 100;
    private updateTimer: Game.Timer = null;

    private curSectionLength = 0;
    private curNumber = 0;
    private index: number = 0;
    succendCall: (id: number) => void;

    /**移动的距离*/
    private moveDistance: number = 0;
    private moveSpeed: number = 0;
    private targetNumber: number = 0;

    setComponents(go: GameObjectGetSet, atals: Game.UGUIAltas, id: number) {
        this.numberAtals = atals;
        this.index = id;

        this.rectNumberNode = ElemFinder.findRectTransform(go.gameObject, "mask/node");
        this.imgFirst = ElemFinder.findImage(go.gameObject, "mask/node/imgFirst");
        this.imgSecond = ElemFinder.findImage(go.gameObject, "mask/node/imgSecond");
    }

    onClose() {
        this.stopRotateB();
        this.targetNumber = 0;
        this.moveDistance = 0;
        this.moveSpeed = 0;
    }

    /**
     * 直接设置数值（用于最后修正位置）
     * @param num
     */
    setNumber(num: number) {
        this.setNodePosition(0);
        this.setFirstImage(num);
    }

    initialize() {
        this.setNumber(0);
    }



    startRotateB(dis: number) {
        this.targetNumber += dis;
        this.targetNumber %= 10;
        this.moveDistance += dis * this.CARF_MAX_HEIGHT;
        if (this.updateTimer == null) {
            this.updateTimer = new Game.Timer("UpdateTimer", 3, -1, delegate(this, this.updateRotate));
            //this.curSectionLength = 0;
        }
        else {
            this.updateTimer.ResetTimer(3, -1, delegate(this, this.updateRotate));
        }
    }

    private updateRotate(timer: Game.Timer) {
        let time = timer.MaxTime / 1000;
        let d = this.moveSpeed * time;
        this.moveDistance -= d;
        this.curSectionLength += d;
        let num = Math.floor(this.curSectionLength / this.CARF_MAX_HEIGHT);
        if (num > 0) {
            this.curNumber += num;
            this.setFirstImage(this.curNumber);
        }
        this.setNodePosition(this.curSectionLength % this.CARF_MAX_HEIGHT);
        this.moveSpeed = this.getSpeedForDistance(this.moveDistance);

        if (this.moveDistance <= 0) {
            if (this.succendCall != null) this.succendCall(this.index);
            this.stopRotateB();
        }
    }

    stopRotateB() {
        if (this.updateTimer != null) {
            this.updateTimer.Stop();
            this.updateTimer = null;
        }
        this.setNumber(this.targetNumber);
        this.moveDistance = 0;
        this.curSectionLength = 0;
        this.moveSpeed = 0;
    }

    /**
     * 设置第一个图片的显示
     * @param num
     */
    private setFirstImage(num: number) {
        num = num % 10;
        this.curNumber = num;
        this.imgFirst.sprite = this.numberAtals.Get(this.ATALS_NUMBER_PREFIX + num.toString());
        num++;
        num = num % 10;
        this.imgSecond.sprite = this.numberAtals.Get(this.ATALS_NUMBER_PREFIX + num.toString());
    }

    private setNodePosition(y: number) {
        let v2 = UnityEngine.Vector2.zero;
        v2.y = y;
        this.rectNumberNode.anchoredPosition = v2;
        this.curSectionLength = y;
    }

    private getSpeedForDistance(dis: number): number {
        let speed = dis * this.CARF_MAX_HEIGHT + 1;
        return speed;
    }
}

class ItemNumberRoll {
    private readonly MAX_NUMBER = 6;
    private itemNumbers: ItemNumberRollOne[] = [];
    private curNumber: number = 0;
    private lastNumber: number = 0;
    private lastNumbers: number[] = [];
    private curNumbers: number[] = [];

    private sliderImage: UnityEngine.UI.Image;

    setComponents(go: GameObjectGetSet, atals: Game.UGUIAltas) {
        this.sliderImage = ElemFinder.findImage(go.gameObject, "sliderImage");
        for (let i = 0; i < this.MAX_NUMBER; i++) {
            let item = new ItemNumberRollOne();
            item.setComponents(new GameObjectGetSet(ElemFinder.findObject(go.gameObject, "item" + i.toString())), atals, i);
            this.itemNumbers.push(item);
        }
    }

    private setSlider() {
        if (this.sliderImage != null)
            this.sliderImage.fillAmount = this.curNumber / G.DataMgr.constData.getValueById(KeyWord.PARAM_STAR_LOTTERY_HONG_BAO_MAX);
    }

    initialite() {
        for (let i = 0; i < this.MAX_NUMBER; i++) {
            this.itemNumbers[i].initialize();
        }
    }

    onClose() {
        for (let i = 0; i < this.MAX_NUMBER; i++) {
            this.itemNumbers[i].onClose()
        }

        this.curNumber = 0;
        this.lastNumber = 0;
        this.lastNumbers = [];
        this.curNumbers = [];
    }

    ///////////////Plan b/////////////////
    private subNumber: number = 0;
    /**
    * 设置数值(动画滚动效果)
    * @param number
    */
    setNumberB(number: number) {
        this.lastNumber = this.curNumber;
        this.curNumber = number;

        this.subNumber = this.curNumber - this.lastNumber;
        if (this.subNumber < 0) {
            uts.log("@jackson  奖池钻石怎么会负增长？？？？？");
            return;
        }

        this.lastNumbers = [];
        for (let i = 0; i < this.MAX_NUMBER; i++) {
            if (this.curNumbers[i] == null)
                this.lastNumbers.push(0);
            else {
                this.lastNumbers.push(this.curNumbers[i]);
            }
        }

        this.curNumbers = [];
        for (let i = 0; i < this.MAX_NUMBER; i++) {
            this.curNumbers.push(number % 10);
            number = Math.floor(number / 10);
        }//兑换

        this.startRotateB();
        this.setSlider();
    }

    startRotateB() {
        let index = 1;
        for (let i = 0; i < this.MAX_NUMBER; i++) {
            //设置一下各个位的 路程 速度 时间
            if (this.curNumbers[i] == null)
                break;
            let rotate = Math.floor(this.subNumber / index);
            if (i != 0 && this.curNumbers[i - 1] - this.lastNumbers[i - 1] < 0)
                rotate++;
            this.itemNumbers[i].startRotateB(rotate)
            index *= 10;
        }
    }

}

/**钻石奖池 分红排行 */
class PanelTreasuryProfitRank {
    private gameonject: GameObjectGetSet;
    private btnClose: GameObjectGetSet;
    private rankList: List;
    private txtDescribe: TextGetSet;
    private btnGet: GameObjectGetSet;
    private btnApply: GameObjectGetSet;
    private rankData: Protocol.StarLotteryHistoryOne[];
    applyCall: () => void;

    setComponents(go: GameObjectGetSet) {
        this.gameonject = go;

        this.btnClose = new GameObjectGetSet(ElemFinder.findObject(go.gameObject, "content/btnClose"));
        this.rankList = ElemFinder.getUIList(ElemFinder.findObject(go.gameObject, "content/rankNode/rankList"));
        this.txtDescribe = new TextGetSet(ElemFinder.findText(go.gameObject, "content/describe"));
        this.btnGet = new GameObjectGetSet(ElemFinder.findObject(go.gameObject, "content/btnGet"));
        this.btnApply = new GameObjectGetSet(ElemFinder.findObject(go.gameObject, "content/btnApply"));

        Game.UIClickListener.Get(this.btnClose.gameObject).onClick = delegate(this, this.onClose);
        Game.UIClickListener.Get(this.btnGet.gameObject).onClick = delegate(this, this.onGet);
        Game.UIClickListener.Get(this.btnApply.gameObject).onClick = delegate(this, this.onApply);

        this.rankList.onVirtualItemChange = delegate(this, this.onListChange);
    }

    updatePanel() {

    }

    onOpen(msg: Protocol.StarLotteryRankHistoryRsp) {
        this.gameonject.SetActive(true);
        this.rankData = msg.m_stRankHistoryList;
        this.rankList.Count = msg.m_ucCount;
        this.appleChange();
    }

    onClose() {
        this.gameonject.SetActive(false);
    }

    /**
     * 状态改变
     * @param number 
     */
    appleChange() {
        //再抽**钻石可领取红包
        //条件已达成，点击领取红包
        //待发放
        let index = -1;
        if (G.DataMgr.starsData.isRadPacketQualification()) {
            if (G.DataMgr.starsData.isApply())
                index = 2;
            else
                index = 1;
        }
        else {
            index = 0;
        }

        if (index == 0) {
            //未达到
            this.btnApply.SetActive(false);
            let num = G.DataMgr.starsData.getResidueDiamond();
            let str = uts.format("{0}钻石", num.toString());
            this.txtDescribe.text = uts.format("再抽{0}可领取红包", TextFieldUtil.getColorText(str, Color.ORANGE));
        }
        else if (index == 1) {
            //已达到 未报名
            this.btnApply.SetActive(true);
            this.txtDescribe.text = "条件已达成，点击领取红包";
        }
        else if (index == 2) {
            //已报名
            this.btnApply.SetActive(false);
            this.txtDescribe.text = "待发放";
        }
    }

    private onGet() {
        //G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(472), "红包说明");
    }

    private onApply() {
        //发送报名的请求
        if (this.applyCall)
            this.applyCall();

        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(473), "红包说明");
    }

    private onListChange(item: ListItem) {
        let rankItem = item.data.rankItem as TreasuryProfitRankItem;
        //let data = this.mallItemDatas[item.Index];
        if (!item.data.rankItem) {
            rankItem = new TreasuryProfitRankItem();
            rankItem.setComponents(new GameObjectGetSet(item.gameObject));
            item.data.rankItem = rankItem;
        }
        let index = item.Index;
        //获取数据
        let data = this.rankData[index];
        rankItem.updateItem(index + 1, data.m_szNickName, data.m_iGetMoney);
    }
}

class TreasuryProfitRankItem {

    private imgFirstBG: UnityEngine.UI.Image;
    private imgSecondBG: UnityEngine.UI.Image;
    private imgThirdlyBG: UnityEngine.UI.Image;
    private imgOtherBG: UnityEngine.UI.Image;

    private imgFirstRank: UnityEngine.UI.Image;
    private imgSecondRank: UnityEngine.UI.Image;
    private imgThirdlyRank: UnityEngine.UI.Image;
    private txtOtherRank: UnityEngine.UI.Text;

    private txtName: UnityEngine.UI.Text;
    private txtMoney: UnityEngine.UI.Text;

    private animation: UnityEngine.Animator;

    setComponents(go: GameObjectGetSet) {
        this.imgFirstBG = ElemFinder.findImage(go.gameObject.gameObject, "bg/first");
        this.imgSecondBG = ElemFinder.findImage(go.gameObject, "bg/second");
        this.imgThirdlyBG = ElemFinder.findImage(go.gameObject, "bg/thirdly");
        this.imgOtherBG = ElemFinder.findImage(go.gameObject, "bg/other");
        let anim = ElemFinder.findObject(go.gameObject, "bg/animator");
        this.animation = anim.GetComponent(UnityEngine.Animator.GetType()) as UnityEngine.Animator;

        this.imgFirstRank = ElemFinder.findImage(go.gameObject, "number/first");
        this.imgSecondRank = ElemFinder.findImage(go.gameObject, "number/second");
        this.imgThirdlyRank = ElemFinder.findImage(go.gameObject, "number/thirdly");
        this.txtOtherRank = ElemFinder.findText(go.gameObject, "number/other");

        this.txtName = ElemFinder.findText(go.gameObject, "name");
        this.txtMoney = ElemFinder.findText(go.gameObject, "money");

    }

    updateItem(ranking: number, name: string, money: number) {
        this.imgFirstBG.gameObject.SetActive(ranking == 1);
        this.imgSecondBG.gameObject.SetActive(ranking == 2);
        this.imgThirdlyBG.gameObject.SetActive(ranking == 3);
        this.imgOtherBG.gameObject.SetActive(ranking > 3);
        if (ranking < 4) {
            this.animation.gameObject.SetActive(true);
            this.animation.Play("animRank" + ranking.toString());
        }
        else {
            this.animation.gameObject.SetActive(false);
        }

        this.imgFirstRank.gameObject.SetActive(ranking == 1);
        this.imgSecondRank.gameObject.SetActive(ranking == 2);
        this.imgThirdlyRank.gameObject.SetActive(ranking == 3);
        this.txtOtherRank.gameObject.SetActive(ranking > 3);
        this.txtOtherRank.text = ranking.toString();

        this.txtName.text = name;
        this.txtMoney.text = money.toString();
    }
}

/**选择头奖界面 */
class PanelSelectAwardTips {
    private gameObject: GameObjectGetSet;

    private selectList: List;
    private curSelect: number = -1;
    private btnConfirm: GameObjectGetSet;
    private btnClose: GameObjectGetSet;
    private itemIcon_Normal: GameObjectGetSet;
    private serverData: Protocol.StarLotteryTopPrizeConfig_Server[];
    private topPrizeIconItems: IconItem[] = [];
    private selected: GameObjectGetSet;

    selectPrizeCall: (index: number) => void;

    setComponents(go: GameObjectGetSet, itemicon: GameObjectGetSet) {
        this.gameObject = go;
        this.itemIcon_Normal = itemicon;

        this.selectList = ElemFinder.getUIList(ElemFinder.findObject(go.gameObject, "content/awardList"));
        this.btnClose = new GameObjectGetSet(ElemFinder.findObject(go.gameObject, "content/btnClose"));
        this.btnConfirm = new GameObjectGetSet(ElemFinder.findObject(go.gameObject, "content/btnConfirm"));
        this.selected = new GameObjectGetSet(ElemFinder.findObject(go.gameObject, "content/selected"));


        Game.UIClickListener.Get(this.btnClose.gameObject).onClick = delegate(this, this.onClickClose);
        Game.UIClickListener.Get(this.btnConfirm.gameObject).onClick = delegate(this, this.onClickCOnfirm);
        //this.selectList.onClickItem = delegate(this, this.onClickList);
    }

    onOpen(datas: Protocol.StarLotteryTopPrizeConfig_Server[]) {
        this.gameObject.SetActive(true);
        this.serverData = datas;

        let con = datas.length;
        this.selectList.Count = con;
        this.topPrizeIconItems.length = 0;
        for (let i = 0; i < con; i++) {
            let data = datas[i];
            let item = this.selectList.GetItem(i);
            let icon = ElemFinder.findObject(item.gameObject, "mask/icon");
            let color = ElemFinder.findImage(item.gameObject, "shade");
            if (this.topPrizeIconItems[i] == null) {
                this.topPrizeIconItems[i] = new IconItem();
                this.topPrizeIconItems[i].setExhibitionIcon(this.itemIcon_Normal.gameObject, icon);
                this.topPrizeIconItems[i].setStarLevelType(2);
                this.topPrizeIconItems[i].actionOnClickItem = delegate(this, this.onClickTopPrize);
            }
            this.topPrizeIconItems[i].updateExhibitionById(data.m_iItemId);
            // this.topPrizeIconItems[i].updateByThingInfo(data.m_stInfo, Macros.CONTAINER_TYPE_STARLOTTERY);
            this.topPrizeIconItems[i].setIndex(i);
            this.topPrizeIconItems[i].setTipFrom(TipFrom.normal);
            this.topPrizeIconItems[i].updateIcon();

            let txt = ElemFinder.findText(item.gameObject, "txtNumber");
            let num = datas[i].m_iItemNum;
            txt.text = num == 1 ? "" : num.toString();

            if (color != null)
                color.sprite = this.topPrizeIconItems[i].getFrameColorE;
        }

        //初始默认第一个
        //this.selectList.Selected = 0;
        //this.onClickList(0);
        this.onClickTopPrize(new GameObjectGetSet(this.topPrizeIconItems[0].gameObject), 0);
    }

    onClose() {
        this.gameObject.SetActive(false);//领取红包
    }



    private onClickClose() {
        this.onClose();
    }

    /**
     * 点击确定按钮
     */
    private onClickCOnfirm() {
        this.onClose();
        if (this.selectPrizeCall)
            this.selectPrizeCall(this.serverData[this.curSelect].m_ucId);
    }

    private onClickList(index: number) {
        this.curSelect = index;
        this.updateBaseShow(this.serverData[index]);
    }

    private updateBaseShow(data: Protocol.StarLotteryTopPrizeConfig_Server) {

    }

    private onClickTopPrize(go: GameObjectGetSet, index: number) {
        if (go != null) {
            this.selected.transform.SetParent(go.transform);
            this.selected.transform.localPosition = G.getCacheV3(0, 0, 0);// go.transform.position;
            this.curSelect = index;
        }
    }

}