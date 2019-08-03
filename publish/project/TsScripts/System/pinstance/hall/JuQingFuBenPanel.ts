import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { JdyjItemData } from 'System/data/vo/JdyjItemData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { PinstanceData } from 'System/data/PinstanceData'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { EnumGuide, EnumEffectRule } from 'System/constants/GameEnum'
import { TipFrom } from 'System/tip/view/TipsView'
import { Color } from 'System/utils/ColorUtil'
import { VipView } from 'System/vip/VipView'

class JuQingFuBenItem extends ListItemCtrl {
    gameObject: UnityEngine.GameObject;

    private ctn: UnityEngine.GameObject;
    private textLimit: UnityEngine.UI.Text;
    private descText: UnityEngine.UI.Text;

    private passFlag: UnityEngine.GameObject;

    private portrait: UnityEngine.UI.Image;
    private title: UnityEngine.UI.Text;
    private stars: UnityEngine.Transform;

    private iconRoot: UnityEngine.GameObject;
    private iconItem: IconItem;

    /**开始挑战按钮*/
    btnGo: UnityEngine.GameObject;
    private labelGo: UnityEngine.UI.Text;

    private vo: JdyjItemData;
    private isGrey: boolean = false;
    /**挑战奖励*/
    //private tzjl: UnityEngine.GameObject;
    /**推荐战力*/
    private tjzl: UnityEngine.UI.Text;
    /**通关可获得*/
    private tgkhd: UnityEngine.GameObject;

    private lock: UnityEngine.GameObject;
    /**通关时间*/
    private labelTime: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, iconTemplate: UnityEngine.GameObject) {
        this.gameObject = go;
        this.ctn = ElemFinder.findObject(go, 'ctn');

        this.textLimit = ElemFinder.findText(this.ctn, 'textLimit');
        this.descText = ElemFinder.findText(this.ctn, 'rewardDesc');
        this.passFlag = ElemFinder.findObject(go, 'passFlag');

        this.portrait = ElemFinder.findImage(this.ctn, 'portrait');
        this.title = ElemFinder.findText(this.ctn, 'nameBg/title');

        this.iconItem = new IconItem();
        this.iconItem.setTipFrom(TipFrom.normal);
        this.iconRoot = ElemFinder.findObject(go, 'icon');
        this.iconItem.setUsualIconByPrefab(iconTemplate, this.iconRoot);
        this.iconItem.needEffectGrey = true;

        this.lock = ElemFinder.findObject(go, 'lock');

        this.btnGo = ElemFinder.findObject(go, 'btnGo');
        this.stars = ElemFinder.findTransform(go, 'stars');

        //this.tzjl = ElemFinder.findObject(this.ctn, 'tzjl');
        this.tjzl = ElemFinder.findText(this.ctn, 'tjzl');
        this.tgkhd = ElemFinder.findObject(go, 'tgkhd');

        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onBtnGoClick);
    }

    init(portraitSprite: UnityEngine.Sprite, titleSprite: UnityEngine.Sprite) {
        this.portrait.sprite = portraitSprite;
    }

    update(vo: JdyjItemData) {
        this.vo = vo;
        //uts.log("juqingItem lifiPass: " + vo.isLifePassed + "----todayPass: " + vo.isTodayPassed + "----starLevel" + vo.starLevel + "----instanceID: " + vo.pinID);
        this.textLimit.text = vo.diffConfig.m_iOpenLevel.toString();
        this.tjzl.text = uts.format('推荐战力：{0}', vo.diffConfig.m_iFightPower);
        this.title.text = vo.diffConfig.m_szName;
        if (vo.isLifePassed) {
            //改成了只能打一次 终生首通之后就关掉显示
            this.passFlag.SetActive(true);
            this.iconRoot.SetActive(false);
            this.btnGo.SetActive(false);
            this.textLimit.gameObject.SetActive(false);
            this.tjzl.gameObject.SetActive(false);
            this.tgkhd.SetActive(false);
            this.lock.SetActive(false);
            return;
        }


        // 更新奖励显示
        if (vo.limitedLv) {
            // 等级受限
            this.textLimit.gameObject.SetActive(true);

            this.textLimit.text = uts.format('{0}级可解锁', vo.limitedLv);
            this.tjzl.gameObject.SetActive(false);
            this.tgkhd.SetActive(true);
            this.btnGo.SetActive(false);
            this.portrait.color = Color.toUnityColor('595959ff')
            UIUtils.setGrey(this.ctn, false);
        } else {
            this.textLimit.gameObject.SetActive(false);
            this.tjzl.gameObject.SetActive(true);
            this.tgkhd.SetActive(false);

            this.portrait.color = Color.toUnityColor('ffffffff');
            UIUtils.setGrey(this.ctn, vo.isTodayPassed);
        }

        this.lock.SetActive(vo.limitedLv > 0);

        let bonus: GameConfig.PinstanceDiffThing;
        if (vo.isTodayPassed) {
            this.passFlag.SetActive(true);
            this.iconRoot.SetActive(false);
        } else {
            this.passFlag.SetActive(false);
            this.iconRoot.SetActive(true);
            if (!vo.isLifePassed) {
                // 未终生首通，显示终生首通奖励
                bonus = vo.diffConfig.m_stLifeBonus[0];
            }
            else {
                bonus = vo.diffConfig.m_stDailyBonus[0];
            }
        }

        if (null != bonus) {
            // 显示奖励
            this.iconItem.updateById(bonus.m_iThingId, bonus.m_iThingNum);
        }
        else {
            // 终生首通或今日已通，不显示奖励
            this.iconItem.updateById(0);
        }
        this.iconItem.effectRule = vo.isTodayPassed ? EnumEffectRule.none : EnumEffectRule.normal;
        this.iconItem.updateIcon();
    }

    showStarLevel(level: number) {
        let childCnt = this.stars.childCount;
        for (let i = 0; i < childCnt; i++) {
            let child = this.stars.GetChild(i);
            child.gameObject.SetActive(level > i);
        }
    }

    onBtnGoClick(): boolean {
        if (null == this.vo || this.vo.limitedLv > 0 /*|| (this.vo.isLifePassed && this.vo.isTodayPassed)*/) {
            return false;
        }
        let power = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
        let tjzlLimit = this.vo.diffConfig.m_iFightPower * 0.9;
        if (power < tjzlLimit) {
            G.TipMgr.showConfirm('当前战力远低于推荐通关战力，副本难度较大，是否继续挑战？', ConfirmCheck.noCheck, '是|否', delegate(this, this.onConfirmClick));
        } else {
            G.ModuleMgr.pinstanceModule.tryEnterJuQingFuBtn(this.vo.pinID, this.vo.diffConfig.m_iDiff);
        }
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.JuQingFuBen, EnumGuide.JuQingFuBen_ClickEnter);

        return true;
    }

    onConfirmClick(stage: number, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            G.ModuleMgr.pinstanceModule.tryEnterJuQingFuBtn(this.vo.pinID, this.vo.diffConfig.m_iDiff);
        }
    }
}

export class JuQingFuBenPanel extends TabSubForm implements IGuideExecutor {
    private readonly awardCount: number = 12;

    /**原先副本长度15*/
    private readonly type1Len = 15;
    private maxLevelData: JdyjItemData;

    private list: List;
    private maxRewardList: List;
    private txtStory: UnityEngine.UI.Text;
    private btnSaodang: UnityEngine.GameObject;
    private txtRewardDesc: UnityEngine.UI.Text;

    /**重置按钮*/
    private btnShuaXin: UnityEngine.GameObject;
    private labelBtnReset: UnityEngine.UI.Text;

    private listData: JdyjItemData[] = [];
    private items: JuQingFuBenItem[] = [];
    private maxRewardItems: IconItem[] = [];
    private openLookAt = -1;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_JQFB);
    }

    protected resPath(): string {
        return UIPathData.JuQingFuBenView;
    }
    open(openLookAt: number = 0) {
        this.openLookAt = openLookAt;
        super.open();
    }

    protected initElements() {
        this.list = this.elems.getUIList('list');
        this.maxRewardList = this.elems.getUIList('maxRewardList');
        this.txtStory = this.elems.getText('txtStory');
        this.btnSaodang = this.elems.getElement('btnSaodang');
        this.btnShuaXin = this.elems.getElement('btnShuaXin');
        this.labelBtnReset = this.elems.getText('labelBtnReset');
        this.txtRewardDesc = this.elems.getText("rewardDesc");

        // 构造数据
        let bonusConifgs1: GameConfig.PinstanceDiffBonusM[] = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_JDYJ);
        let bonusConifgs2: GameConfig.PinstanceDiffBonusM[] = PinstanceData.getDiffBonusConfigs(Macros.PINSTANCE_ID_JDYJ_2);
        let len: number = bonusConifgs1.length + bonusConifgs2.length;
        this.list.Count = len;

        let nameAltas = this.elems.getElement('nameAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        let portraitAltas = this.elems.getElement('portraitAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');

        let itemData: JdyjItemData, iconItem: IconItem, btnGo: UnityEngine.GameObject;

        for (let i: number = 0; i < len; i++) {
            this.listData.push(itemData = new JdyjItemData());

            if (i < this.type1Len) {
                itemData.pinID = Macros.PINSTANCE_ID_JDYJ;
                itemData.pinstanceConfig = PinstanceData.getConfigByID(Macros.PINSTANCE_ID_JDYJ);
                itemData.diffConfig = bonusConifgs1[i];
            } else {
                itemData.pinID = Macros.PINSTANCE_ID_JDYJ_2;
                itemData.pinstanceConfig = PinstanceData.getConfigByID(Macros.PINSTANCE_ID_JDYJ_2);
                let index = i % this.type1Len;
                itemData.diffConfig = bonusConifgs2[index];
            }
            let item = new JuQingFuBenItem();
            this.items.push(item);
            item.setComponents(this.list.GetItem(i).gameObject, itemIcon_Normal);
            let index = i < 15 ? (i + 1) : (i % 15 + 1);
            item.init(portraitAltas.Get((index).toString()), nameAltas.Get((i + 1).toString()));
        }

    }

    protected initListeners() {
        this.addClickListener(this.btnSaodang, this.onBtnSaodangClick);
        this.addClickListener(this.btnShuaXin, this._onClickBtnReset);
        this.addListClickListener(this.list, this.onClickList)
    }


    protected onOpen() {
        // 打开时拉取进度
        G.DataMgr.pinstanceData.everShowJqfb = true;
        let fsdIds: number[] = [Macros.PINSTANCE_ID_JDYJ, Macros.PINSTANCE_ID_JDYJ_2];
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST_ALL, 0, fsdIds));
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.JuQingFuBen, EnumGuide.JuQingFuBen_OpenJuQingFuBen);
    }

    protected onClose() {

    }

    updateView() {
        // 刷新副本列表
        let info1: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_JDYJ);
        let info2: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_JDYJ_2);
        let resetCnt = 0;
        if (null != info1) {
            resetCnt = info1.m_ucResetNum;
        }
        if (null != info2) {
            resetCnt += info2.m_ucResetNum;
        }

        let len: number = this.listData.length;
        let itemData: JdyjItemData;
        let bitPos = 1;
        let bitPos2 = 1;
        let canSaodang = false;
        let canReset = false;
        let firstCanDoIdx = -1;
        let firstLimitedIdx = -1;
        let maxLevelInstance = "";

        for (let i: number = 0; i < len; i++) {
            itemData = this.listData[i];
            // bitPos = bitPos << 1;
            itemData.limitedLv = itemData.diffConfig.m_iOpenLevel > G.DataMgr.heroData.level ? itemData.diffConfig.m_iOpenLevel : 0;
            if (itemData.diffConfig.m_iOpenLevel < G.DataMgr.heroData.level) {
                maxLevelInstance = itemData.diffConfig.m_szName;
            }
            if (i < this.type1Len) {
                bitPos = bitPos << 1;
                if (null == info1) {
                    // 未拉到数据
                    itemData.isLifePassed = false;
                    itemData.isTodayPassed = false;
                }
                else {
                    itemData.isLifePassed = 0 != (info1.m_uiIsLifeFinish & bitPos);
                    itemData.isTodayPassed = 0 != (info1.m_uiIsDayFinish & bitPos);
                    if (0 == itemData.limitedLv && itemData.isLifePassed && !itemData.isTodayPassed) {
                        canSaodang = true;
                    }

                    if (!itemData.isTodayPassed) {
                        if (firstCanDoIdx < 0 && 0 == itemData.limitedLv) {
                            firstCanDoIdx = i;
                        }
                        if (firstLimitedIdx < 0) {
                            firstLimitedIdx = i;
                        }
                    } else {
                        canReset = true;
                    }
                }
            } else {
                bitPos2 = bitPos2 << 1;
                if (null == info2) {
                    // 未拉到数据
                    itemData.isLifePassed = false;
                    itemData.isTodayPassed = false;
                }
                else {
                    itemData.isLifePassed = 0 != (info2.m_uiIsLifeFinish & bitPos2);
                    itemData.isTodayPassed = 0 != (info2.m_uiIsDayFinish & bitPos2);
                    if (0 == itemData.limitedLv && itemData.isLifePassed && !itemData.isTodayPassed) {
                        canSaodang = true;
                    }

                    if (!itemData.isTodayPassed) {
                        if (firstCanDoIdx < 0 && 0 == itemData.limitedLv) {
                            firstCanDoIdx = i;
                        }
                        if (firstLimitedIdx < 0) {
                            firstLimitedIdx = i;
                        }
                    } else {
                        canReset = true;
                    }
                }
            }
            this.items[i].update(itemData);
        }

        let autoIdx = -1;
        if (this.openLookAt > 0) {
            autoIdx = this.openLookAt;
            this.openLookAt = 0;
        }
        else if (firstCanDoIdx >= 0) {
            autoIdx = firstCanDoIdx;
        } else if (firstLimitedIdx >= 0) {
            autoIdx = firstLimitedIdx;
        }
        if (autoIdx >= 0) {
            this.list.ScrollByAxialRow(Math.max(0, Math.floor(autoIdx / 3)));
            G.ViewCacher.functionGuideView.updateTarget(this.items[autoIdx].gameObject);
        }

        UIUtils.setButtonClickAble(this.btnSaodang, canSaodang);
        // 计算奖励
        let idList: number[] = new Array<number>();
        let cntMap: { [id: number]: number } = {};
        let bonusList: GameConfig.PinstanceDiffThing[];
        for (itemData of this.listData) {
            if (0 == itemData.limitedLv) {
                if (!itemData.isLifePassed) {
                    bonusList = itemData.diffConfig.m_stLifeBonus;
                }
                else if (!itemData.isTodayPassed) {
                    bonusList = itemData.diffConfig.m_stDailyBonus;
                }
                else {
                    continue;
                }

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
        // 刷新奖励--> 改成显示小说内容 @jackson
        //先找到最近的一个没有通关过的副本
        let stroyData: JdyjItemData;
        let datalen = this.listData.length;
        for (let i = 0; i < datalen; i++) {
            let itemData = this.listData[i];
            if (!itemData.isLifePassed) {
                stroyData = itemData;
                break;
            }
        }
        if (stroyData != null)
            this.refreshStory(stroyData.diffConfig.m_szName, stroyData.diffConfig.m_szDesc);
        else
            this.refreshStory("", "");

        //len = idList.length;
        //let oldIconCnt = this.maxRewardItems.length;
        //this.maxRewardList.Count = this.awardCount;
        //let iconItem: IconItem;
        //for (let i: number = 0; i < this.awardCount; i++) {
        //    let item = this.maxRewardList.GetItem(i);
        //    if (i < oldIconCnt) {
        //        iconItem = this.maxRewardItems[i];
        //    }
        //    else {
        //        this.maxRewardItems[i] = iconItem = new IconItem();
        //        iconItem.setUsuallyIcon(item.gameObject);
        //        iconItem.setTipFrom(TipFrom.normal);
        //    }

        //    if (i < len) {
        //        iconItem.updateById(idList[i], cntMap[idList[i]]);
        //        iconItem.updateIcon();
        //    }
        //    else {
        //        iconItem.updateByItemConfig(null);
        //        iconItem.updateIcon();
        //    }

        //}

        // 免费次数
        if (canReset && 0 == resetCnt) {
            this.labelBtnReset.text = '免费重置';
            UIUtils.setButtonClickAble(this.btnShuaXin, true);
        }
        else {
            // 没有挑战过，不给重置
            this.labelBtnReset.text = '重置副本';
            UIUtils.setButtonClickAble(this.btnShuaXin, false);
        }
    }

    private _onClickBtnReset(): void {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_JDYJ);
        if (null == info) {
            return;
        }
        if (G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_JDYJ_RESET)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_RESET, Macros.PINSTANCE_ID_JDYJ));
        } else {
            let openLevels = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.VIP_PARA_JDYJ_RESET);
            G.TipMgr.showConfirm(uts.format('激活{0}可使用重置功能', TextFieldUtil.getMultiVipMonthTexts(openLevels)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onResetVipConfirm));
        }
    }

    private _onResetVipConfirm(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open();
        }
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onBtnSaodangClick() {
        let canOneKey = false;
        for (let itemVo of this.listData) {
            if (itemVo.isLifePassed && !itemVo.isTodayPassed) {
                canOneKey = true;
                break;
            }
        }
        if (canOneKey) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(Macros.PINSTANCE_ID_JDYJ, false));
        }
        else {
            G.TipMgr.addMainFloatTip('目前没有可扫荡的副本');
        }
        //let vipData = G.DataMgr.vipData;
        //if (vipData.hasPrivilege(KeyWord.PRI_PARA_ONEKEY_JDYJ)) {
        //    let canOneKey = false;
        //    for (let itemVo of this.listData) {
        //        if (itemVo.isLifePassed && !itemVo.isTodayPassed) {
        //            canOneKey = true;
        //            break;
        //        }
        //    }
        //    if (canOneKey) {
        //        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(Macros.PINSTANCE_ID_JDYJ, false));
        //    }
        //    else {
        //        G.TipMgr.addMainFloatTip('目前没有可扫荡的副本');
        //    }
        //}
        //else {
        //    let levels = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.PRI_PARA_ONEKEY_JDYJ);
        //    G.TipMgr.showConfirm(uts.format('激活{0}可使用扫荡功能', TextFieldUtil.getMultiVipMonthTexts(levels)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onSaodangResetVipConfirm, levels));
        //}
    }

    //private _onSaodangResetVipConfirm(stage: MessageBoxConst, isCheckSelected: boolean, levels: number[]): void {
    //    if (MessageBoxConst.yes == stage) {
    //        G.Uimgr.createForm<PrivilegeView>(PrivilegeView).open(EnumPrivilegeTab.Main, levels[0]);
    //    }
    //}

    getItem(layer: number): UnityEngine.GameObject {
        return this.items[layer].gameObject;
    }

    private onClickList(index: number) {
        let stroyData = this.listData[index];
        if (stroyData != null)
            this.refreshStory(stroyData.diffConfig.m_szName, stroyData.diffConfig.m_szDesc);
        else
            this.refreshStory("", "");
    }

    /**
     * 刷新剧情显示
     * @param title
     * @param story
     */
    private refreshStory(title: string, story: string) {

        this.txtRewardDesc.text = title;
        this.txtStory.text = story;
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, layer: number): boolean {
        if (EnumGuide.JuQingFuBen_ClickEnter == step) {
            let item = this.items[layer];
            if (null != item) {
                return item.onBtnGoClick();
            }
        }
        return false;
    }
}