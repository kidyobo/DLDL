import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { VipData } from 'System/data/VipData'
import { KeyWord } from 'System/constants/KeyWord'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { List, ListItem } from 'System/uilib/List'
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
import { GameObjectGetSet, TextGetSet } from "System/uilib/CommonForm";
import { UnitUtil } from "System/utils/UnitUtil";
import { ArrowType, IconItem } from 'System/uilib/IconItem';
import { GameIDUtil } from 'System/utils/GameIDUtil';
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView';


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
        //// 检查对应的特权
        //if (G.DataMgr.heroData.getPrivilegeState(this.privilegeLv) >= 0) {
        //    if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.price, true)) {
        //        if (VipPinstancePanel.notTip)
        //        {
        //            this._onEnterConfirm();
        //        }
        //        else
        //        {
        //            G.TipMgr.showConfirm(uts.format('是否花费{0}进行挑战？', TextFieldUtil.getYuanBaoText(this.price)), ConfirmCheck.autoCheck, '确定|取消', delegate(this, this._onConfirmMultiRefine));
                    
        //        }
               
        //    }
        //} else {
        //    let bossConfig = MonsterData.getMonsterConfig(this.bossId);
        //    let openLevels = [this.privilegeLv];
        //    G.TipMgr.showConfirm(uts.format('激活{0}可挑战{1}', TextFieldUtil.getMultiVipMonthTexts(openLevels), bossConfig.m_szMonsterName), ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onPrivilegeConfirm, openLevels));
        //}
    }

    private _onPrivilegeConfirm(stage: MessageBoxConst, isCheckSelected: boolean, openLevels: number[]): void {
      
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
        }
    }

    private _onConfirmMultiRefine(stage: MessageBoxConst, isCheckSelected: boolean, openLevels: number[]): void {

        //if (MessageBoxConst.yes == stage) {
        //    this._onEnterConfirm();
        //    VipPinstancePanel.notTip = isCheckSelected;
        //}
    }

    private _onEnterConfirm(): void 
    {
        let diffCfg = this.itemData.diffConfig;
        G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_VIP_PIN, diffCfg.m_iID, diffCfg.m_iDiff);
        G.Uimgr.closeForm(BossView);
    }
}

class VipBossListItem {

    private obj: UnityEngine.GameObject;
    private lvIsLow: boolean = false;
    private lvIsUp: boolean = false;


    private lockNode: GameObjectGetSet;
    private unlockNode: GameObjectGetSet;

    private bossHead: UnityEngine.UI.RawImage;
    private txtLv: TextGetSet;
    private txtName: TextGetSet;
    private txtStatus: TextGetSet;
    //private txtCount: TextGetSet;
    private flagDeath: GameObjectGetSet;

    private flagColor1: UnityEngine.GameObject;
    private flagColor2: UnityEngine.GameObject;
    private flagColor3: UnityEngine.GameObject;

    setComponent(obj: UnityEngine.GameObject) {
        this.obj = obj;
        this.lockNode = new GameObjectGetSet(ElemFinder.findObject(obj, "lockNode"));
        this.unlockNode = new GameObjectGetSet(ElemFinder.findObject(obj, "unlockNode"));

        this.bossHead = ElemFinder.findRawImage(obj, 'bossHead');
        this.txtLv = new TextGetSet(ElemFinder.findText(obj, 'lockNode/txtLv'));
        this.txtName = new TextGetSet(ElemFinder.findText(obj, 'unlockNode/textName'));
        this.txtStatus = new TextGetSet(ElemFinder.findText(obj, 'unlockNode/txtStatus'));
        //this.txtCount = new TextGetSet(ElemFinder.findText(obj, 'unlockNode/txtCount'));

        let node = ElemFinder.findObject(obj, "colorNode");
        this.flagColor1 = ElemFinder.findObject(node, "1");
        this.flagColor2 = ElemFinder.findObject(node, "2");
        this.flagColor3 = ElemFinder.findObject(node, "3");
    }

    update(cfg: GameConfig.VIPBossCfgM) {
        let bossCfg: GameConfig.MonsterConfigM = MonsterData.getMonsterConfig(cfg.m_MonsterID);
        if (bossCfg) {
            G.ResourceMgr.loadImage(this.bossHead, uts.format('images/head/{0}.png', bossCfg.m_iHeadID));
            let heroLevel = G.DataMgr.heroData.level;
            if (heroLevel >= cfg.m_iLevelUp) {
                this.txtName.text = bossCfg.m_szMonsterName;
                this.txtStatus.text = uts.format("{0}级", cfg.m_iLevel);
                this.lockNode.SetActive(false);
                this.unlockNode.SetActive(true);
            } else {
                this.lockNode.SetActive(true);
                this.unlockNode.SetActive(false);
                this.txtLv.text = uts.format("{0}级可挑战", cfg.m_iLevelUp);
            }
        }
    }
}
/**
 * 
 *
 */
export class VipBossPanel extends TabSubForm {

    private list: List;
    private vipBossCfgs: GameConfig.VIPBossCfgM[];
    private selectBossCfg: GameConfig.VIPBossCfgM;

    private modelCtn: GameObjectGetSet;
    private modelRoot: GameObjectGetSet;
    //右侧顶部名字与等级
    private textName: TextGetSet;
    private textLv: TextGetSet;
    //右侧掉落展示列表
    private rewardHunguList: List;
    private rewardList: List;
    //右侧添加次数按钮
    private btnAdd: GameObjectGetSet;
    private countTip: TextGetSet;
    //右侧挑战按钮
    btnGo: GameObjectGetSet;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_VIP_BOSS);
    }

    protected resPath(): string {
        return UIPathData.VipBossView;
    }

    protected initElements() {


        this.list = this.elems.getUIList("list");
        this.list.onVirtualItemChange = delegate(this, this.onUpdateItem);

        this.modelCtn = new GameObjectGetSet(this.elems.getElement('modelCtn'));
        this.modelRoot = new GameObjectGetSet(this.elems.getElement('modelRoot'));

        this.textName = new TextGetSet(this.elems.getText('textName'));
        this.textLv = new TextGetSet(this.elems.getText('textLv'));

        this.rewardHunguList = this.elems.getUIList('rewardHunguList');
        this.rewardList = this.elems.getUIList('rewardList');

        this.btnAdd = new GameObjectGetSet(this.elems.getElement('btnAdd'));
        this.countTip = new TextGetSet(this.elems.getText('countTip'));

        this.btnGo = new GameObjectGetSet(this.elems.getElement('btnGo'));
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('btnRecord'), this.onClickBtnTip);
        this.addListClickListener(this.list, this.onClickBossList);
        this.addClickListener(this.btnAdd.gameObject, this.onClickAdd);
        this.addClickListener(this.btnGo.gameObject, this.onClickBtnGo);
    }

    open() {
        super.open();
    }

    protected onOpen() {
        this.vipBossCfgs = G.DataMgr.monsterData.vipBossCfgs;
        this.list.Count = this.vipBossCfgs.length;
        this.autoSelectListItem();
      
    }




    protected onClose() {
    
    }

    private autoSelectListItem() {
        let len = this.vipBossCfgs.length;
        let heroLevel = G.DataMgr.heroData.level;
        let count = 0;//如果全都等级足够，选中最后一个
        let selectIndex = 0;
        for (let i = 0; i < len; i++) {
            if (heroLevel < this.vipBossCfgs[i].m_iLevelUp) {//等级不足，不能挑战
                selectIndex = i - 1;
                break;
            } else {//能挑战
                count++;
            }
        }
        if (count == len) {
            selectIndex = len - 1;
        }
        selectIndex = selectIndex > 0 ? selectIndex : 0;
        this.onClickBossList(selectIndex);
        this.list.Selected = selectIndex;
        this.list.ScrollByAxialRow(this.list.Selected);
    }

    private onUpdateItem(listitem: ListItem) {
        let index = listitem._index;
        let data = listitem.data.data as VipBossListItem;
        if (!data) {
            data = new VipBossListItem();
            data.setComponent(listitem.gameObject);
            listitem.data.data = data;
        }
        if (this.vipBossCfgs[index])
        data.update(this.vipBossCfgs[index]);
    }

    private onClickBossList(index: number) {
        this.selectBossCfg = this.vipBossCfgs[index];
        this.updateView();
    }

    updateView() {
        //显示模型
        let monsterCfg = MonsterData.getMonsterConfig(this.selectBossCfg.m_MonsterID);
        Game.Tools.SetGameObjectLocalScale(this.modelRoot.gameObject, monsterCfg.m_ucUnitScale, monsterCfg.m_ucUnitScale, monsterCfg.m_ucUnitScale);
        G.ResourceMgr.loadModel(this.modelCtn.gameObject, UnitUtil.getRealMonsterType(monsterCfg.m_ucModelFolder), monsterCfg.m_szModelID, this.sortingOrder, true);
        //右侧顶部名字与等级
        this.textName.text = monsterCfg.m_szMonsterName;
        this.textLv.text = uts.format("{0}级", monsterCfg.m_usLevel);
        //右侧掉落
        // 奖励列表 分开来 魂骨放一起，其他放一起
        let config = this.selectBossCfg;
        let newArr = [];
        let newHunguArr: number[] = [];
        let newHunguProf: number[] = [];
        let hunguArr: { "id": number, "prof": number }[] = [];
        let profId = G.DataMgr.heroData.profession;
        for (let i = 0; i < config.m_iItemID.length; i++) {
            if (GameIDUtil.isHunguEquipID(config.m_iItemID[i])) {
                newHunguArr.push(config.m_iItemID[i]);
                newHunguProf.push(config.m_iProf[i]);
            }
            else
                newArr.push(config.m_iItemID[i]);
        }
        for (let i = 0, count = newHunguArr.length; i < count; i++) {
            hunguArr[i] = {
                "id": newHunguArr[i],
                "prof": newHunguProf[i]
            }
        }
        hunguArr.sort(this.rewardSort);
        let iconItem: IconItem;
        this.rewardList.Count = newArr.length;
        for (let i: number = 0; i < newArr.length; i++) {
            let item = this.rewardList.GetItem(i);
            if (item.data.iconitem) {
                iconItem = item.data.iconitem;
            } else {
                iconItem = item.data.iconitem = new IconItem()
                iconItem.arrowType = ArrowType.personalHungu;
                iconItem.setUsuallyIcon(item.gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateById(newArr[i]);
            iconItem.updateIcon();
        }

        this.rewardHunguList.Count = hunguArr.length;
        for (let i: number = 0; i < hunguArr.length; i++) {
            let item = this.rewardHunguList.GetItem(i);
            if (item.data.iconitem) {
                iconItem = item.data.iconitem;
            } else {
                iconItem = item.data.iconitem = new IconItem()
                iconItem.arrowType = ArrowType.personalHungu;
                iconItem.setUsuallyIcon(item.gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateById(hunguArr[i].id);
            iconItem.updateIcon();
        }
       
        //右侧挑战次数
        let extraTime = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_VIP_BOSS_NUM, G.DataMgr.heroData.curVipLevel, VipData.getVipPriKeyWord()) + G.DataMgr.vipData.getReserveTime(Macros.PINSTANCE_ID_VIP) - G.DataMgr.systemData.getFinishTime(Macros.PINSTANCE_ID_VIP);
        this.countTip.text = uts.format("总挑战次数: {0}", TextFieldUtil.getColorText(extraTime.toString(), extraTime > 0 ? Color.GREEN : Color.RED));
        //右侧挑战按钮状态
        UIUtils.setButtonClickAble(this.btnGo.gameObject, extraTime > 0 && G.DataMgr.heroData.level >= this.selectBossCfg.m_iLevelUp);
    }



    /**马山挑战按钮 */
    private onClickBtnGo() {
        G.ModuleMgr.pinstanceModule.tryEnterPinstance(Macros.PINSTANCE_ID_VIP, this.selectBossCfg.m_ucNandu);
        G.Uimgr.closeForm(BossView);
    }
    /**
     * 增加次数
     */
    private onClickAdd() {
        let vipLv = G.DataMgr.heroData.curVipLevel;
        let cost = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_VIP_BOSS_BUY_VALUE, vipLv, VipData.getVipPriKeyWord());
        let hasActive: boolean = G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_VIP_BOSS_NUM);
        let openPrivilegeLvs = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.VIP_PARA_VIP_BOSS_NUM);
        let privilegeStrs = TextFieldUtil.getMultiVipMonthTexts(openPrivilegeLvs);
        if (hasActive) {
            let info = uts.format("是否使用{0}{1}购买一次挑战次数？",
                TextFieldUtil.getColorText(cost + "", Color.GREEN),
                KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, KeyWord.MONEY_YUANBAO_ID)
            );
            G.TipMgr.showConfirm(uts.format(info, TextFieldUtil.getColorText(privilegeStrs, Color.GOLD)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.sendMsgToBuy, cost));
        } else {
            G.TipMgr.showConfirm(uts.format('激活{0}可开启此功能', TextFieldUtil.getColorText(privilegeStrs, Color.GOLD)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGoToVipPanel));
        }
    }

    private sendMsgToBuy(stage: MessageBoxConst, isCheckSelected: boolean, cost: number) {
        if (MessageBoxConst.yes == stage) {
            // 检查货币是否足够     
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_VIP_BOSS_NUM, G.DataMgr.heroData.curVipLevel, VipData.getVipPriKeyWord()), true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_BUY_PINSTANCE, Macros.PINSTANCE_ID_VIP));
                G.TipMgr.addMainFloatTip("购买次数成功");
            }
        }
    }
    private onGoToVipPanel(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open();
        }
    }
    private rewardSort(a: { "id": number, "prof": number }, b: { "id": number, "prof": number }): number {
        if (a.prof == b.prof) {
            return -1;
        }
        else {
            if (a.prof == G.DataMgr.heroData.profession)
                return -1;
            else if (a.prof == 0)
                return 0;
            else
                return 1;
        }
    }
    /**玩法说明 */
    private onClickBtnTip() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(481), '玩法说明');
    }
}