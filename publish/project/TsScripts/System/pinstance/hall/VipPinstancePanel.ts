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
import { EnumEffectRule, EnumGuide, EnumMonsterID } from 'System/constants/GameEnum'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { MonsterData } from 'System/data/MonsterData'
import { VipView, VipTab } from 'System/vip/VipView'
import { BossView } from 'System/pinstance/boss/BossView'

class VipPinstanceListItem extends ListItemCtrl {
    private ctn: UnityEngine.GameObject;

    private titleImage: UnityEngine.UI.Image;
    private bossImage: UnityEngine.UI.RawImage;
    private passFlag: UnityEngine.GameObject;

    private rewardList: List;
    private iconItems: IconItem[] = [];

    /**今日通过奖励图片*/
    private imgJr: UnityEngine.GameObject;
    /**首次通关奖励图片*/
    private imgFirst: UnityEngine.GameObject;

    private lock: UnityEngine.GameObject;

    private btnGo: UnityEngine.GameObject;
    private labelBtnGo: UnityEngine.UI.Text;

    gameObject: UnityEngine.GameObject;

    private itemData: JdyjItemData;
    private privilegeLv = 0;
    private bossId = 0;
    private price = 0;

    

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.ctn = ElemFinder.findObject(go, 'ctn');
        this.titleImage = ElemFinder.findImage(this.ctn, "titleImage");
        this.bossImage = ElemFinder.findRawImage(this.ctn, "bossImage");
        this.imgFirst = ElemFinder.findObject(this.ctn, "imgFirst");
        this.imgJr = ElemFinder.findObject(this.ctn, "imgJrst");
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "rewardList"));
        this.passFlag = ElemFinder.findObject(go, "passFlag");
        this.lock = ElemFinder.findObject(go, 'lock');
        this.btnGo = ElemFinder.findObject(go, 'btnGo');
        this.labelBtnGo = ElemFinder.findText(this.btnGo, 'Text');

        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo);
    }

    update(itemData: JdyjItemData, nameAltas: Game.UGUIAltas, bossId: number, privilegeLv: number, itemIcon_Normal: UnityEngine.GameObject) {
        this.itemData = itemData;
        this.privilegeLv = privilegeLv;
        this.bossId = bossId;
        this.price = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_VIPBOSS_PIRCE, G.DataMgr.heroData.curVipLevel, privilegeLv);

        let bossConfig = MonsterData.getMonsterConfig(bossId);
        if (itemData.limitedLv > 0) {
            this.bossImage.gameObject.SetActive(false);
            this.lock.SetActive(true);
        } else {
            this.bossImage.gameObject.SetActive(true);
            G.ResourceMgr.loadImage(this.bossImage, uts.format('images/head/{0}.png', bossConfig.m_iHeadID), -1);
            this.lock.SetActive(false);
        }
        this.titleImage.sprite = nameAltas.Get(bossConfig.m_szMonsterName);

        let bonusCfgs: GameConfig.PinstanceDiffThing[];
        if (itemData.limitedLv > 0 || !itemData.isLifePassed) {
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

        if (itemData.isTodayPassed) {
            // 今天已经通关了
            this.passFlag.SetActive(true);
            this.labelBtnGo.text = '已通关';
            UIUtils.setButtonClickAble(this.btnGo, false);
        } else {
            this.passFlag.SetActive(false);
            if (itemData.limitedLv > 0) {
                this.labelBtnGo.text = uts.format('{0}级开启', itemData.limitedLv);
                UIUtils.setButtonClickAble(this.btnGo, false);
            } else {
                this.labelBtnGo.text = uts.format('{0}钻石挑战', this.price);
                UIUtils.setButtonClickAble(this.btnGo, true);
            }
        }

        // 不能打则灰掉
        UIUtils.setGrey(this.ctn, itemData.limitedLv > 0);

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
                let itemGo = this.rewardList.GetItem(i).gameObject;
                iconItem.setUsualIconByPrefab(itemIcon_Normal, ElemFinder.findObject(itemGo, 'iconRoot'));
                iconItem.setTipFrom(TipFrom.normal);
            }
            let b = bonusCfgs[i];
            iconItem.effectRule = effRule;
            iconItem.updateById(b.m_iThingId, b.m_iThingNum);
            iconItem.updateIcon();
        }
    }

    private onClickBtnGo() {
        // 检查对应的特权
        if (G.DataMgr.heroData.getPrivilegeState(this.privilegeLv) >= 0) {
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.price, true)) {
                if (VipPinstancePanel.notTip)
                {
                    this._onEnterConfirm();
                }
                else
                {
                    G.TipMgr.showConfirm(uts.format('是否花费{0}进行挑战？', TextFieldUtil.getYuanBaoText(this.price)), ConfirmCheck.autoCheck, '确定|取消', delegate(this, this._onConfirmMultiRefine));
                    
                }
               
            }
        } else {
            let bossConfig = MonsterData.getMonsterConfig(this.bossId);
            let openLevels = [this.privilegeLv];
            G.TipMgr.showConfirm(uts.format('激活{0}可挑战{1}', TextFieldUtil.getMultiVipMonthTexts(openLevels), bossConfig.m_szMonsterName), ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onPrivilegeConfirm, openLevels));
        }
    }

    private _onPrivilegeConfirm(stage: MessageBoxConst, isCheckSelected: boolean, openLevels: number[]): void {
      
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
        }
    }

    private _onConfirmMultiRefine(stage: MessageBoxConst, isCheckSelected: boolean, openLevels: number[]): void {

        if (MessageBoxConst.yes == stage) {
            this._onEnterConfirm();
            VipPinstancePanel.notTip = isCheckSelected;
        }
    }

    private _onEnterConfirm(): void 
    {
        let diffCfg = this.itemData.diffConfig;
        G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_VIP_PIN, diffCfg.m_iID, diffCfg.m_iDiff);
        G.Uimgr.closeForm(BossView);
    }
}


/**
 * 【副本大厅 - 材料副本】面板*
 *
 */
export class VipPinstancePanel extends TabSubForm {

    private readonly LayerCntPerTab = 4;

    private tabGroup: UnityEngine.UI.ActiveToggleGroup;
    private list: List;
    private listItems: VipPinstanceListItem[] = [];
    private tabId2listDatas: { [id: number]: JdyjItemData[] } = {};

    private btn_saoDang: UnityEngine.GameObject;
    private iconItem_Normal: UnityEngine.GameObject;
    private nameAltas: Game.UGUIAltas;

    private maxRewardList: List;
    private maxRewardItems: IconItem[] = [];

    private itemIcon_Normal: UnityEngine.GameObject;

    private canSaodang: number = 0;

    private bossIds: number[] = [];

    /**手选的tab id*/
    private handChoicePinId = 0;

    private openPrivilegeLv = 0;

    static notTip: boolean = false;

    private SD_PRICE: number[] = [1, 2, 3];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_ZRJT);
        let bossBaseIds = [EnumMonsterID.TeQuanBossBase1, EnumMonsterID.TeQuanBossBase2, EnumMonsterID.TeQuanBossBase3];
        let pids = PinstanceIDUtil.TeQuanFuBenIDs;
        let tabCnt = pids.length;
        for (let i = 0; i < tabCnt; i++) {
            let pinId = pids[i];
            let itemDatas = [];
            let diffCfgs = PinstanceData.getDiffBonusConfigs(pinId);
            this.tabId2listDatas[pinId] = itemDatas;
            let bossBaseId = bossBaseIds[i];
            for (let j = 0; j < this.LayerCntPerTab; j++) {
                let itemData = new JdyjItemData();
                itemData.diffConfig = diffCfgs[j];
                itemDatas.push(itemData);
                this.bossIds.push(bossBaseId + j);
            }
        }
    }

    protected resPath(): string {
        return UIPathData.TeQuanFuBenView;
    }

    protected initElements() {
        this.tabGroup = this.elems.getToggleGroup("toggleGroup");
        this.list = this.elems.getUIList("list");
        this.nameAltas = ElemFinderMySelf.findAltas(this.elems.getElement("nameAltas"));
        this.btn_saoDang = this.elems.getElement("btnSaodang");
        this.maxRewardList = this.elems.getUIList('maxRewardList');
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');

        this.list.Count = this.LayerCntPerTab;
        for (let i = 0; i < this.LayerCntPerTab; i++) {
            let item = new VipPinstanceListItem();
            item.setComponents(this.list.GetItem(i).gameObject);
            this.listItems.push(item);
        }
    }

    protected initListeners() {
        this.addToggleGroupListener(this.tabGroup, this.onClickTabGroup);
        this.addClickListener(this.btn_saoDang, this.onClickYiJianSaoDang);
    }

    open(privilegeLv = 0) {
        this.openPrivilegeLv = privilegeLv;
        super.open();
    }

    protected onOpen() {
        let pids = PinstanceIDUtil.TeQuanFuBenIDs;
        for (let pid of pids) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, pid));
        }
        this.updateView();
    }


    protected onClose() {
        G.DataMgr.pinstanceData.isHasClickVipBossPanel = true;
        G.ActBtnCtrl.update(false);
    }

    ////////////////////////////////刷新面板/////////////////////////////////////

    updateView() {
        // 刷新副本列表
        let pids = PinstanceIDUtil.TeQuanFuBenIDs;
        let tabCnt = pids.length;

        let pinstanceData = G.DataMgr.pinstanceData;

        let myLv = G.DataMgr.heroData.level;
        let firstCanEnterTabId = 0;
        for (let i = 0; i < tabCnt; i++) {
            let pinId = pids[i];
            let info = pinstanceData.getPinstanceInfo(pinId);
            let itemDatas = this.tabId2listDatas[pinId];
            let bitPos = 1;
            let allLimited = true;
            let hasPrivilege = G.DataMgr.heroData.getPrivilegeState(i + 1) >= 0;
            let canEnterCnt = 0;
            for (let j = 0; j < this.LayerCntPerTab; j++) {
                bitPos = bitPos << 1;
                let itemData = itemDatas[j];
                itemData.limitedLv = itemData.diffConfig.m_iOpenLevel > myLv ? itemData.diffConfig.m_iOpenLevel : 0;
                if (itemData.limitedLv == 0) {
                    allLimited = false;
                }
                itemData.isLifePassed = false;
                itemData.isTodayPassed = false;

                if (null != info) {
                    itemData.isLifePassed = 0 != (info.m_uiIsLifeFinish & bitPos);
                    itemData.isTodayPassed = 0 != (info.m_uiIsDayFinish & bitPos);
                    if (hasPrivilege && !itemData.isTodayPassed && itemData.limitedLv == 0) {
                        canEnterCnt++;
                    }
                    itemData.isValid = true;
                } else {
                    itemData.isValid = false;
                }
            }

            // 如果这组副本全部等级受限则不显示
            let toggle = this.tabGroup.GetToggle(i).gameObject;
            toggle.SetActive(!allLimited);
            let tm = ElemFinder.findObject(toggle, 'tipMark');
            tm.SetActive(false);
            if (firstCanEnterTabId == 0 && canEnterCnt > 0) {
                firstCanEnterTabId = pinId;
            }
        }

        // 已经指定打开哪个diff
        let smartTabId = this.handChoicePinId;
        if (this.openPrivilegeLv > 0) {
            smartTabId = pids[this.openPrivilegeLv];
        }

        // 默认选中第一个有小红点
        if (smartTabId <= 0) {
            smartTabId = firstCanEnterTabId;
        }
        let smartIdx = 0;
        if (smartTabId > 0) {
            smartIdx = pids.indexOf(smartTabId);
        }
        this.tabGroup.Selected = smartIdx;
        this.updateList();
    }

    private updateList() {
        let pids = PinstanceIDUtil.TeQuanFuBenIDs;
        let tabIdx = this.tabGroup.Selected;
        let pinId = pids[tabIdx];
        let itemDatas = this.tabId2listDatas[pinId];
        let minDiff = tabIdx * this.LayerCntPerTab + 1;
        let maxDiff = (tabIdx + 1) * this.LayerCntPerTab;
        let firstCanDoIndex: number = -1;
        this.canSaodang = 0;
        // 计算奖励
        let idList: number[] = [];
        let cntMap: { [id: number]: number } = {};

        for (let i: number = 0; i < this.LayerCntPerTab; i++) {
            let itemData = itemDatas[i];
            this.listItems[i].update(itemData, this.nameAltas, this.bossIds[tabIdx * this.LayerCntPerTab + i], tabIdx + 1, this.itemIcon_Normal);

            if (itemData.isValid) {
             
                if (0 == itemData.limitedLv && itemData.isLifePassed && !itemData.isTodayPassed) {
                    this.canSaodang ++;
                }

                if (firstCanDoIndex < 0) {
                    if (0 == itemData.limitedLv && !itemData.isTodayPassed) {
                        firstCanDoIndex = i;
                    }
                }
            }

            let bonusList: GameConfig.PinstanceDiffThing[];
            if (0 == itemData.limitedLv) {
                if (!itemData.isLifePassed) {
                    bonusList = itemData.diffConfig.m_stLifeBonus;
                }
                else if (!itemData.isTodayPassed) {
                    bonusList = itemData.diffConfig.m_stDailyBonus;
                }

                if (null != bonusList) {
                    for (let bthing of bonusList) {
                        if (idList.indexOf(bthing.m_iThingId) < 0) {
                            idList.push(bthing.m_iThingId);
                            cntMap[bthing.m_iThingId] = bthing.m_iThingNum;
                        }
                        else {
                            cntMap[bthing.m_iThingId] = cntMap[bthing.m_iThingId] + bthing.m_iThingNum;
                        }
                    }
                }
            }
        }

        // 刷新奖励
        let len = idList.length;
        let oldIconCnt = this.maxRewardItems.length;
        this.maxRewardList.Count = len;
        let iconItem: IconItem;
        for (let i: number = 0; i < len; i++) {
            let item = this.maxRewardList.GetItem(i);
            if (i < oldIconCnt) {
                iconItem = this.maxRewardItems[i];
            }
            else {
                this.maxRewardItems[i] = iconItem = new IconItem();
                iconItem.setUsuallyIcon(item.gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateById(idList[i], cntMap[idList[i]]);
            iconItem.updateIcon();
        }

        UIUtils.setButtonClickAble(this.btn_saoDang, this.canSaodang > 0);
        this.btn_saoDang.SetActive(true);
       
    }

    //////////////////////////////点击事件////////////////////////////////////////

    /**点击左侧副本toggleGroup*/
    private onClickTabGroup(index: number) {
        let pids = PinstanceIDUtil.TeQuanFuBenIDs;
        this.handChoicePinId = pids[index];
        this.updateList();
    }

    private onClickYiJianSaoDang() {
        let tabIdx = this.tabGroup.Selected;
        let cost = this.SD_PRICE[tabIdx] * this.canSaodang;
        let str1: string = uts.format('确定使用{0}进行扫荡？', TextFieldUtil.getYuanBaoText(cost));
        G.TipMgr.showConfirm(str1, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmBuy));
    }

    private onConfirmBuy(stage: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            let tabIdx = this.tabGroup.Selected;
            let cost = this.SD_PRICE[tabIdx] * this.canSaodang;
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {

                let pids = PinstanceIDUtil.TeQuanFuBenIDs;
                let tabIdx = this.tabGroup.Selected;
                let pinId = pids[tabIdx];
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(pinId, false));
            }
        }
    }

    //private _onPrivilegeConfirm(stage: MessageBoxConst, isCheckSelected: boolean, openLevels: number[]): void {
    //    if (MessageBoxConst.yes == stage) {
    //        G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
    //    }
    //}
}