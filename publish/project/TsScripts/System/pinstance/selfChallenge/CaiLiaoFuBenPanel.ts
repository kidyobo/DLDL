import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { List, ListItem } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { PinstanceData } from 'System/data/PinstanceData'
import { TipFrom } from 'System/tip/view/TipsView'
import { JdyjItemData } from 'System/data/vo/JdyjItemData'
import { EnumEffectRule, EnumGuide } from 'System/constants/GameEnum'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { VipData } from 'System/data/VipData'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { UILayer, CommonForm } from 'System/uilib/CommonForm'
import { VipView } from "System/vip/VipView";

class CaiLiaoFuBenListItem extends ListItemCtrl {
    private ctn: UnityEngine.GameObject;
    private textTitle: UnityEngine.UI.Text;
    private bossImage: UnityEngine.UI.Image;
    private passFlag: UnityEngine.GameObject;
    private textTimes: UnityEngine.UI.Text;
    private textFight: UnityEngine.UI.Text;
    private rewardList: List;
    private iconItems: IconItem[] = [];

    /**今日通过奖励图片*/
    private imgJr: UnityEngine.GameObject;
    /**首次通关奖励图片*/
    private imgFirst: UnityEngine.GameObject;
    /**敬请期待图片*/
    private imgQD: UnityEngine.GameObject;
    gameObject: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.ctn = ElemFinder.findObject(go, 'ctn');
        this.textTitle = ElemFinder.findText(this.ctn, "nameBg/titleText");
        this.bossImage = ElemFinder.findImage(this.ctn, "bossImage");
        this.imgFirst = ElemFinder.findObject(this.ctn, "imgFirst");
        this.imgQD = ElemFinder.findObject(this.ctn, "imgQD");
        this.imgJr = ElemFinder.findObject(this.ctn, "imgJrst");
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "rewardList"));
        this.passFlag = ElemFinder.findObject(go, "passFlag");
        this.textTimes = ElemFinder.findText(go, "textTimes");
        this.textFight = ElemFinder.findText(go, "textFight");
    }

    update(itemData: JdyjItemData, altas: Game.UGUIAltas) {
        if (!itemData) {
            this.textTitle.text = "敬请期待";
            this.bossImage.sprite = altas.Get(uts.format("boss{0}", 1));
            if (this.imgJr.activeSelf)
                this.imgJr.SetActive(false);
            if (this.imgFirst.activeSelf)
                this.imgFirst.SetActive(false);
            if (!this.imgQD.activeSelf) {
                this.imgQD.SetActive(true);
            }
            this.textTimes.text = '剩余次数：' + TextFieldUtil.getColorText( "0" ,  Color.RED );
            this.textFight.text = '推荐战力：' + TextFieldUtil.getColorText("--------", Color.RED);
            this.passFlag.SetActive(false);
            UIUtils.setGrey(this.ctn, false);
            this.rewardList.Count = 0;
            return;
        };
        this.textTitle.text = itemData.diffConfig.m_szName;
        this.bossImage.sprite = altas.Get(uts.format("boss{0}", itemData.imgId));
        let fightValue = itemData.diffConfig.m_iFightPower;
        let heroFihgtValue = G.DataMgr.heroData.fight;
        this.textTimes.text = '剩余次数：' + TextFieldUtil.getColorText((itemData.isLifePassed && itemData.isTodayPassed) ? "0" : "1", (itemData.isLifePassed && itemData.isTodayPassed) ? Color.RED : Color.GREEN);
        this.textFight.text = '推荐战力：' + TextFieldUtil.getColorText(fightValue.toString(), heroFihgtValue < fightValue ? Color.RED : Color.GREEN);
        this.passFlag.SetActive(itemData.isLifePassed && itemData.isTodayPassed);
        let bonusCfgs: GameConfig.PinstanceDiffThing[];
        if (this.imgQD.activeSelf) {
            this.imgQD.SetActive(false);
        }
        if (!itemData.isLifePassed) {
            // 等级受限或者未终生首通，显示终生首通奖励
            bonusCfgs = itemData.diffConfig.m_stLifeBonus;
            this.imgFirst.SetActive(true);
            this.imgJr.SetActive(false);
        }
        else {
            if (!itemData.isTodayPassed) {
                // 今天还没打，显示今日通关奖励
                bonusCfgs = itemData.diffConfig.m_stDailyBonus;
            }
            this.imgFirst.SetActive(false);
            this.imgJr.SetActive(true);
        }
        //主角战力小于推荐战力 不能打则灰掉
        UIUtils.setGrey(this.ctn, heroFihgtValue < fightValue);

        let bcnt = 0;
        if (null != bonusCfgs) {
            bcnt = bonusCfgs.length;
        }
        this.rewardList.Count = bcnt;
        let oldIconCnt = this.iconItems.length;
        let effRule = itemData.isTodayPassed ? EnumEffectRule.none : EnumEffectRule.normal;
        for (let i = 0; i < bcnt; i++) {
            let iconItem: IconItem;
            if (i < oldIconCnt) {
                iconItem = this.iconItems[i];
            } else {
                this.iconItems.push(iconItem = new IconItem());
                iconItem.setTipFrom(TipFrom.normal);
                iconItem.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
            }
            let b = bonusCfgs[i];
            iconItem.effectRule = effRule;
            iconItem.updateById(b.m_iThingId, b.m_iThingNum);
            iconItem.updateIcon();
        }
    }
}

/**
 * 【副本大厅 - 材料副本】面板*
 *
 */
export class CaiLiaoFuBenPanel extends TabSubForm implements IGuideExecutor {
    /**材料副本每个页签显示的副本个数 3*/
    static readonly CLFBFuBenSize: number = 3;

    /**材料副本页签数 5*/
    static readonly CLFBTypeListCount: number = 5;


    /**材料副本5个页签对应KeyWord  为了防止策划随便改关键字，而我这里仅用来做下标，不能重复，所以我自定 */
    static readonly CLFBTypeListKeyWords: number[] = [
        KeyWord.OTHER_FUNCTION_ZQJH,
        KeyWord.OTHER_FUNCTION_FZJH,
        KeyWord.BAR_FUNCTION_JIUXING,
        KeyWord.OTHER_FUNCTION_LLJH,
        KeyWord.OTHER_FUNCTION_MAGICCUBE
    ];
    //下面两个要和副本表或者副本难度表 配的对应
    /**材料副本5个页签对应副本id*/
    static readonly CLFBPinstanceIds: number[] = [
        Macros.PINSTANCE_ID_ZQFB,
        Macros.PINSTANCE_ID_MTJX,
        Macros.PINSTANCE_ID_XTJX,
        Macros.PINSTANCE_ID_MZJX,
        Macros.PINSTANCE_ID_QLJX
    ];
    /**5个材料副本名称*/
    private readonly CLFBTypeListItemName: string[] = ["坐骑副本", "魔瞳修炼", "玄天修炼", "迷踪修炼", "擒龙修炼"];

    //private btnReturn: UnityEngine.GameObject;
    /**左侧副本类型列表*/
    private typeList: List;

    private textBottom: UnityEngine.UI.Text;
    private textBottom1: UnityEngine.UI.Text;

    btn_enterFuBen: UnityEngine.GameObject;
    private btn_saoDang: UnityEngine.GameObject;

    private list: List;
    private listItems: CaiLiaoFuBenListItem[] = [];


    private tabId2listDatas: { [id: number]: JdyjItemData[] } = {};

    private iconItem_Normal: UnityEngine.GameObject;
    private altas: Game.UGUIAltas;
    /**值为1时，用来帮助自动选择5个副本类型之一*/
    private autoSelectTypeList: number = 0;
    /**值为1时，用来帮助自动选择3个难度的副本之一*/
    private autoSelectList: number = 0;

    private canSaodang = false;
    private isHanderSelectTypeList = false;

    private labelMap: { [id: number]: string } = {};
    private labelIndexMap: { [id: number]: number[] } = {};
    /**可显示的副本关键字*/
    private typeListKeyWords: number[] = [];
    /**可显示的副本id*/
    private typeListPinstanceIds: number[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_CLFB);
    }

    protected resPath(): string {
        return UIPathData.CaiLiaoFuBenPanel;
    }

    protected initElements() {
        //this.btnReturn = this.elems.getElement('btnReturn');

        this.typeList = this.elems.getUIList("typeList");
        this.list = this.elems.getUIList("list");

        this.textBottom = this.elems.getText("textBottom");
        this.textBottom1 = this.elems.getText("textBottom1");


        this.btn_enterFuBen = this.elems.getElement("btnGo");
        this.btn_saoDang = this.elems.getElement("btnSaodang");
        this.altas = ElemFinderMySelf.findAltas(this.elems.getElement("altas"));
        //5个页签名字
        for (let i = 0; i < CaiLiaoFuBenPanel.CLFBTypeListCount; i++) {
            this.labelMap[CaiLiaoFuBenPanel.CLFBTypeListKeyWords[i]] = this.CLFBTypeListItemName[i];
        }
    }

    protected initListeners() {
        super.initListeners();
        // this.addClickListener(this.elems.getElement("mask"), this.onClickReturnBtn);
        // this.addClickListener(this.btnReturn, this.onClickReturnBtn);

        this.addClickListener(this.btn_enterFuBen, this.onClickEnterFuBen);
        this.addClickListener(this.btn_saoDang, this.onClickYiJianSaoDang);
        this.addListClickListener(this.list, this.onClickList);
        this.addListClickListener(this.typeList, this.onClickTabGroup);
    }

    open(diff = 0) {
        super.open();
    }


    protected onOpen() {
        for (let i = 0; i < CaiLiaoFuBenPanel.CLFBTypeListCount; i++) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, CaiLiaoFuBenPanel.CLFBPinstanceIds[i]));
        }
        this.updateTabStatus();
        //刚打开面板的时候自动选择副本类型
        this.isHanderSelectTypeList = false;
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.CaiLiaoFuBen, EnumGuide.CaiLiaoFuBen_OpenCaiLiaoFuBen);
    }

    protected onClose() {

    }
    /**
     * 比较副本等级下限
     * @param a
     * @param b
     */
    private lowLevelCompare(a: number, b: number): number {
        if (a < b) {
            return -1;
        }
        else if (a == b) {
            return 0;
        } else {
            return 1;
        }
    }

    ////////////////////////////////刷新面板/////////////////////////////////////



    /**
     * 左侧副本类型列表显示
     */
    private updateTabStatus() {
        let pinstanceData = G.DataMgr.pinstanceData;
        //-----------kingsly 这里副本显示顺序根据场景表，副本页签等级下限进行排序----------
        let levelAndKeyWordDic: { [level: number]: number } = {};
        let levelAndPinstanceIdDic: { [level: number]: number } = {};
        //用来对 等级下限 进行排序
        let showTabLevel = [];
        this.typeListKeyWords = [];
        this.typeListPinstanceIds = [];
        let flag: number = -1;
        let levelLow: number = 0;
        for (let i = 0; i < CaiLiaoFuBenPanel.CLFBTypeListCount; i++) {
            //等级下限
            levelLow = PinstanceData.getConfigByID(CaiLiaoFuBenPanel.CLFBPinstanceIds[i]).m_iLevelLow;
            if (flag != levelLow) {
                flag = levelLow;
            } else {
                levelLow = levelLow + 0.1 * (i + 1);
            }
            levelAndKeyWordDic[levelLow] = CaiLiaoFuBenPanel.CLFBTypeListKeyWords[i];
            levelAndPinstanceIdDic[levelLow] = CaiLiaoFuBenPanel.CLFBPinstanceIds[i];
            showTabLevel.push(levelLow);
        }
        showTabLevel.sort(this.lowLevelCompare);
        for (let j = 0; j < CaiLiaoFuBenPanel.CLFBTypeListCount; j++) {
            let levelLow = showTabLevel[j];//等级下限
            //判断5个副本类型是否都显示
            if (pinstanceData.getCaiLiaoTabCanShow(levelAndPinstanceIdDic[levelLow])) {
                this.typeListKeyWords.push(levelAndKeyWordDic[levelLow]);
                this.typeListPinstanceIds.push(levelAndPinstanceIdDic[levelLow]);
            }
        }
        //--------------------------------------------------------------------------
        this.typeList.Count = this.typeListKeyWords.length;
        for (let i = 0; i < this.typeList.Count; i++) {
            let tgo = this.typeList.GetItem(i).gameObject;
            let tn = ElemFinder.findText(tgo, 'normal/Textnormal');
            let ts = ElemFinder.findText(tgo, 'selected/Textselected');
            let id = this.typeListKeyWords[i];
            tn.text = this.labelMap[id];
            ts.text = this.labelMap[id];
        }
    }

    updateView() {
        this.updateList();
        this.updateTipMark();
    }
    /**右侧列表3个item更新 */
    private updateList() {
        this.autoSelectList = 0;
        let tabIdx = this.typeList.Selected;
        tabIdx = tabIdx < 0 ? 0 : tabIdx;
        this.list.Selected = -1;
        let info = G.DataMgr.pinstanceData.getPinstanceInfo(this.typeListPinstanceIds[tabIdx]);
        if (!info) {
            return;
        }
        //更新中间三个副本显示
        let tabId = this.typeListKeyWords[tabIdx];
        let imgID = tabIdx * 3;
        let itemDatas = [];
        this.tabId2listDatas[tabId] = itemDatas;
        this.canSaodang = false;
        for (let index = 0; index < CaiLiaoFuBenPanel.CLFBFuBenSize; index++) {
            imgID++;
            let itemData = new JdyjItemData();
            //副本难度表的难度是+1递增的，所以这里获取配置的第二个参数可以直接+index
            let diffCfg = PinstanceData.getDiffBonusData(this.typeListPinstanceIds[tabIdx], info.m_uiCurLevel + index);
            if (!diffCfg) continue;
            itemData.diffConfig = diffCfg;
            itemData.imgId = imgID;
           
            itemData.isLifePassed = info.m_uiIsLifeFinish >= diffCfg.m_iDiff;
            //uts.log("kingsly 材料副本通关信息0:" + index + "/ " + info.m_uiIsLifeFinish + "/ " + diffCfg.m_iDiff + "/ " + itemData.isLifePassed);
            itemData.isTodayPassed = info.m_uiIsDayFinish >= diffCfg.m_iDiff;
            //没有永久首通或者没有今日首通
            if (G.DataMgr.heroData.fight >= diffCfg.m_iFightPower && G.DataMgr.heroData.level >= diffCfg.m_iOpenLevel  && (info.m_uiIsLifeFinish < diffCfg.m_iDiff || info.m_uiIsDayFinish < diffCfg.m_iDiff)) {
                //自动选择三个副本难度中的第一个可挑战
                this.autoSelectList++
                if (this.autoSelectList == 1) {
                    this.list.Selected = index;
                    //这个值现在用来控制 进入副本按钮 的状态 
                    itemData.isValid = true;
                } else {//前面的关卡通过了，才能打后面的，所以this.autoSelectList ！= 1 时 itemData.isValid = false;
                    itemData.isValid = false;
                }
            }
            itemDatas.push(itemData);

            //if ((info.m_uiIsLifeFinish >= diffCfg.m_iDiff) && (info.m_uiIsDayFinish < diffCfg.m_iDiff)) {
            //    this.canSaodang = true;
            //}
            //if (info.m_uiIsLifeFinish > 0) {
            //    this.canSaodang = true
            //}
        }

        //扫荡按钮状态
        //UIUtils.setGrey(this.btn_saoDang, !this.canSaodang);
        this.updateSaoDangBtn();
        //进入副本按钮状态
        this.updateEnterBtn();

        this.list.Count = CaiLiaoFuBenPanel.CLFBFuBenSize;
        for (let i: number = 0; i < CaiLiaoFuBenPanel.CLFBFuBenSize; i++) {
            if (this.listItems[i] == null) {
                let item = new CaiLiaoFuBenListItem();
                item.setComponents(this.list.GetItem(i).gameObject);
                this.listItems.push(item);
            }
            let itemData = itemDatas[i];
            this.listItems[i].update(itemData, this.altas);
        }


        //更新底部文本
        let diffCfg = PinstanceData.getDiffBonusData(this.typeListPinstanceIds[tabIdx], info.m_uiCurLevel);
        let nextDiffCfg = PinstanceData.getDiffBonusData(this.typeListPinstanceIds[tabIdx], info.m_uiMaxLevel + 1);
        let str1 = "";
        let str2 = "";
        // if (diffCfg) {
        //     if (itemDatas[this.list.Selected] != null) {
        //         let seleCfg = PinstanceData.getDiffBonusData(this.typeListPinstanceIds[tabIdx], itemDatas[this.list.Selected].diffConfig);
        //         uts.log("jackson" + JSON.stringify(itemDatas[this.list.Selected]));
        //         if (seleCfg != null)
        //             str1 = "当前副本等级：" + TextFieldUtil.getColorText(seleCfg.m_iOpenLevel + "级", Color.GREEN);
        //         else
        //             str1 = "";
        //     }
        //     else
        //         str1 = "";
        // }
        if (nextDiffCfg) {
            str2 = "当前副本全部通关后, 且达到" + TextFieldUtil.getColorText(nextDiffCfg.m_iOpenLevel + "级", G.DataMgr.heroData.level >= nextDiffCfg.m_iOpenLevel ? Color.GREEN : Color.RED) + "级后可挑战下一阶副本!";
        }
        this.textBottom.text = str1 + str2;
    }
    //更新小红点
    private updateTipMark() {
        let len = this.typeListKeyWords.length;;
        for (let i = 0; i < len; i++) {
            let showTipMark = false;

            let tabKeyWord = this.typeListKeyWords[i];
            let pinstanceId = this.typeListPinstanceIds[i];
            let allLimited = G.DataMgr.pinstanceData.getCaiLiaoTabCanShow(pinstanceId);
            if (allLimited) {
                let info = G.DataMgr.pinstanceData.getPinstanceInfo(pinstanceId);
                if (!info) return;
                for (let j = 0; j < CaiLiaoFuBenPanel.CLFBFuBenSize; j++) {
                    let diffCfg = PinstanceData.getDiffBonusData(pinstanceId, info.m_uiCurLevel + j);
                    if (diffCfg)
                        if (G.DataMgr.heroData.fight >= diffCfg.m_iFightPower && G.DataMgr.heroData.level >= diffCfg.m_iOpenLevel && (info.m_uiIsLifeFinish < diffCfg.m_iDiff || info.m_uiIsDayFinish < diffCfg.m_iDiff)) {
                            this.autoSelectTypeList++;
                            showTipMark = true;
                            break;
                        }
                }
                let index = this.typeListKeyWords.indexOf(tabKeyWord);
                if (showTipMark) {
                    //自动选择副本类型
                    if (this.autoSelectTypeList == 1 && !this.isHanderSelectTypeList) {
                        this.typeList.Selected = index;
                    }
                }
                if (this.typeList.GetItem(index)) {
                    let toggle = this.typeList.GetItem(index).gameObject;
                    let tm = ElemFinder.findObject(toggle, 'tipMark');
                    tm.SetActive(showTipMark);
                }
            }
        }
    }
    //////////////////////////////点击事件////////////////////////////////////////

    private onClickReturnBtn() {
        this.close();
    }

    /**点击左侧副本toggleGroup*/
    private onClickTabGroup(index: number) {
        this.isHanderSelectTypeList = true;
        this.updateList();
    }

    private onClickList(index: number) {
        this.updateEnterBtn();
    }

    /**更新扫荡按钮状态 */
    private updateSaoDangBtn() {
        //let itemData = this.getCrtItemData();
        UIUtils.setButtonClickAble(this.btn_saoDang, /*itemData.isValid &&*/ this.autoSelectList != 0);
    }

    private updateEnterBtn() {
        let itemData = this.getCrtItemData();
        if (itemData) {
            UIUtils.setButtonClickAble(this.btn_enterFuBen, itemData.isValid && this.autoSelectList != 0);
            this.textBottom1.text = "当前副本等级：" + TextFieldUtil.getColorText(itemData.diffConfig.m_iOpenLevel + "级", G.DataMgr.heroData.level >= itemData.diffConfig.m_iOpenLevel ? Color.GREEN : Color.RED);
        } else {
            UIUtils.setButtonClickAble(this.btn_enterFuBen, false);
        }
    }

    /**进入副本*/
    private onClickEnterFuBen() {
        let itemData = this.getCrtItemData();
        if (itemData) {
            G.ModuleMgr.pinstanceModule.tryEnterCaiLiaoFuBen(itemData.diffConfig.m_iID, itemData.diffConfig.m_iDiff);
            let pinstanceHallView = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
            if (pinstanceHallView != null) {
                pinstanceHallView.close();
            }
        }
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.CaiLiaoFuBen, EnumGuide.CaiLiaoFuBen_ClickEnter);
        
    }

    private getCrtItemData(): JdyjItemData {
        let tabIdx = this.typeList.Selected;
        tabIdx = tabIdx < 0 ? 0 : tabIdx;
        let itemDatas = this.tabId2listDatas[this.typeListKeyWords[tabIdx]];
        if (itemDatas == undefined || itemDatas == null) return null;
        let s = this.list.Selected;
        s = s < 0 ? 0 : s;
        return itemDatas[s] ? itemDatas[s] : null;
    }

    /**扫荡副本*/
    private onClickYiJianSaoDang() {
        let data = this.getCrtItemData();
        if (data && data.isValid && this.autoSelectList != 0) {
            // let saodangParam = this.typeList.Selected;
            if (G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3) >= 0) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(this.typeListPinstanceIds[this.typeList.Selected], false));
            } else {
                G.TipMgr.showConfirm(uts.format('激活{0}可扫荡材料副本', TextFieldUtil.getColorText("钻石VIP", Color.GOLD)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGoToVipPanel));
            }
        }
        //else {
        //    G.TipMgr.addMainFloatTip('目前没有可扫荡的副本');
        //}
    }

    private onGoToVipPanel(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open();
        }
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, layer: number): boolean {
        if (EnumGuide.CaiLiaoFuBen_ClickEnter == step) {
            this.onClickEnterFuBen();
            return true;
        }
        return false;
    }
}