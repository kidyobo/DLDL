import { Global as G } from 'System/global'
import { BossBasePanel, BossBaseItem, CtrlBossBtnGoStrategy } from 'System/pinstance/boss/BossBasePanel'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { PinstanceData } from 'System/data/PinstanceData'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { MonsterData } from 'System/data/MonsterData'
import { BossBaseItemData } from 'System/pinstance/boss/BossBasePanel'
import { DropPlanData } from 'System/data/DropPlanData'
import { BossView } from 'System/pinstance/boss/BossView'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { YuanGuJingPaiView } from 'System/pinstance/boss/YuanGuJingPaiView'
import { TabSubForm } from 'System/uilib/TabForm'
import { EnumKfhdBossType, EnumKfhdBossStatus } from 'System/constants/GameEnum'
import { UnitUtil } from "System/utils/UnitUtil"
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { Constants } from 'System/constants/Constants'
import ThingData from '../../data/thing/ThingData';
import { TextGetSet } from '../../uilib/CommonForm';

class AncientBossListItem {

    private textStatus: UnityEngine.UI.Text;
    private bossHead: UnityEngine.UI.RawImage;
    private textName: UnityEngine.UI.Text;
    private itemData: BossBaseItemData;

    setCommonPents(obj: UnityEngine.GameObject) {
        this.bossHead = ElemFinder.findRawImage(obj, 'head/bossHead');
        this.textStatus = ElemFinder.findText(obj, 'textStatus');
        this.textName = ElemFinder.findText(obj, 'ctn/nameBg/textName');
    }
    updateAncientBoss(itemData: BossBaseItemData, canFollow: boolean) {
        this.itemData = itemData;
        let monsterconfig = MonsterData.getMonsterConfig(itemData.bossId);
        let bossconfig = MonsterData.getBossConfigById(itemData.bossId);
        if (null == monsterconfig || null == bossconfig) return;
        G.ResourceMgr.loadImage(this.bossHead, uts.format('images/head/{0}.png', monsterconfig.m_iHeadID + "v"));
        this.textName.text = monsterconfig.m_usLevel + "级 " + monsterconfig.m_szMonsterName;

        if (null != itemData.killerName) {
            this.textStatus.text = uts.format('上轮：{0}', itemData.killerName);
            this.textStatus.color = UnityEngine.Color.white;
        } else {
            if (itemData.isDead && itemData.refreshTime != 0) {
                if (itemData.refreshTime < 0) {
                    // 远古boss最后一只随机刷新
                    this.textStatus.text = '随机刷新';
                    this.textStatus.color = Color.toUnityColor('FF4444');
                } else {
                    let leftSecond = itemData.refreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000);
                    if (leftSecond < 0) {
                        leftSecond = 0;
                    }
                    if (leftSecond >= 3600) {
                        this.textStatus.text = DataFormatter.second2hhmmss(leftSecond);
                    } else {
                        this.textStatus.text = DataFormatter.second2mmss(leftSecond);
                    }
                    this.textStatus.color = Color.toUnityColor('FF4444');
                }
            } else {
                this.textStatus.text = '已刷新';
                this.textStatus.color = Color.toUnityColor('A3FF20');
            }
        }
    }
}

export class AncientBossPanel extends TabSubForm {
    private readonly awardCount: number = 12;

    private readonly TaskTickKey = 'TaskTickKey';
    /**boss列表长度*/
    private readonly BossListItemNum: number = 4;
    private readonly TickTimerKey = '1';

    private static readonly CtrlBtnGoAct = 1;
    private static readonly CtrlBtnGoBossLv = 2;
    private static readonly CtrlBtnGoSceneLv = 4;
    private bossGroup: UnityEngine.UI.ActiveToggleGroup;
    private bossList: List;
    private bossItems: AncientBossListItem[] = [];

    private btnPaiMai: UnityEngine.GameObject;
    private tipMark: UnityEngine.GameObject;
    private textTask: UnityEngine.UI.Text;
    static iconItemNormal: UnityEngine.GameObject;

    private rewardList: List;
    private otherRewardList: List;
    private rewardIcons: IconItem[] = [];
    private otherRewardIcons: IconItem[] = [];
    private btnGo: UnityEngine.GameObject;
    private labelBtnGo: UnityEngine.UI.Text;
    private txtName: TextGetSet;
    //规则说明按钮
    private btnRecord: UnityEngine.GameObject;
    //存小红点,这里小红点暂时不要,已经在prefab里面禁用了
    //private tipMarks: UnityEngine.GameObject[] = [];
    /**boss列表数据*/
    private bossListDatas: BossBaseItemData[] = [];

    private openBossId: number = 0;
    private oldBossId: number = 0;
    private isCurLvLimited = false;
    private needRecord = true;
    private activityId = 0;
    private ctrlBtnStrategy = CtrlBossBtnGoStrategy.none;
    private funId: number;


    constructor() {
        super(KeyWord.ACT_FUNCTION_XZFM);
        this.funId = KeyWord.ACT_FUNCTION_XZFM;
        this.needRecord = true;
        this.activityId = Macros.ACTIVITY_ID_XZFM;
        this.ctrlBtnStrategy = CtrlBossBtnGoStrategy.ActAndBossLv;
        this.closeSound = null;
    }

    protected resPath(): string {
        return UIPathData.AncientBossView;
    }

    protected initElements() {

        this.bossGroup = this.elems.getToggleGroup('toggleGroup');
        this.txtName = new TextGetSet(this.elems.getText("txtName"));
        // boss列表
        this.bossList = this.elems.getUIList('bossList');

        // 奖励列表
        this.rewardList = this.elems.getUIList('rewardList');
        this.otherRewardList = this.elems.getUIList("otherRewardList");

        // 按钮
        this.btnGo = this.elems.getElement('btnGo');
        this.labelBtnGo = this.elems.getText('labelBtnGo');
        this.btnRecord = this.elems.getElement('btnRecord');
        this.btnRecord.SetActive(this.needRecord);


        // boss数据
        let cfgs = MonsterData.getBossCfgsByType(KeyWord.GROUP_XZFM_BOSS);
        let cnt = cfgs.length;
        for (let i: number = 0; i < cnt; i++) {
            let config = cfgs[i];
            let itemData = new BossBaseItemData();
            itemData.bossId = config.m_iID;
            itemData.dropIds = config.m_iItemID;
            itemData.doubleDropID = config.m_iDoubleDropID;
            this.bossListDatas.push(itemData);
        }

        this.bossList.Count = this.BossListItemNum;

        this.textTask = this.elems.getText('textTask');
        AncientBossPanel.iconItemNormal = this.elems.getElement('itemIcon_Normal');

        this.btnPaiMai = this.elems.getElement('btnPaiMai');
        this.tipMark = ElemFinder.findObject(this.btnPaiMai, "tipMark");
        //三层的红点暂时不要
        //for (let i = 0; i < this.MaxFloor; i++) {
        //    let tipMark = ElemFinder.findObject(this.bossGroup.GetToggle(i).gameObject, 'tipMark');
        //    this.tipMarks.push(tipMark);
        //}
    }

    protected initListeners() {
        this.addToggleGroupListener(this.bossGroup, this.onClickBossListGroup);
        this.addClickListener(this.btnGo, this.onBtnGoClick);
        this.addClickListener(this.btnRecord, this.onBtnRecordClick);
        this.addClickListener(this.elems.getElement('btnPaiMai'), this.onClickBtnPaiMai);
    }
    open(openBossId: number = 0) {
        this.openBossId = openBossId;
        super.open();
    }
    protected onOpen() {
        MonsterData.isFirstOpenPanel = true;
        this.onActDataChange();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getXZFMRequest(Macros.XZFM_PANEL));
        let isBossId: boolean = false;
        if (this.openBossId > 0) {
            for (let i: number = 0; i < this.bossListDatas.length; i++) {
                if (this.bossListDatas[i].bossId == this.openBossId) {
                    //因为boss层数从1开始而面板层数从0开始,所以-1
                    this.bossGroup.Selected = MonsterData.getBossConfigById(this.bossListDatas[i].bossId).m_iFloor - 1;
                    isBossId = true;
                }
            }
            //传的是层数的情况
            if (!isBossId) {
                this.bossGroup.Selected = this.openBossId - 1;
            }
        } else {
            this.bossGroup.Selected = 0;
        }

        this.updateView();
        this.addTimer(this.TaskTickKey, 1000, 0, this.onTaskTickTimer);
        this.tipMark.SetActive(G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WORLDPAIMAI) && G.DataMgr.runtime.worldPaiMaiShouldTip);
        G.DataMgr.runtime.worldPaiMaiShouldTip = false;
    }

    private onTaskTickTimer(timer: Game.Timer) {
        this.updateTask();
    }
    private updateBtnGo() {
        let index = this.bossGroup.Selected;
        let itemData = this.bossListDatas[index > 0 ? index * this.BossListItemNum + 1 : index];
        if (!itemData) {
            return;
        }
        if (null == this.bossListDatas) return;
        let cfg = MonsterData.getMonsterConfig(itemData.bossId);
        if (0 != (this.ctrlBtnStrategy & AncientBossPanel.CtrlBtnGoAct) && !G.DataMgr.activityData.isActivityOpen(this.activityId)) {
            this.labelBtnGo.text = '未开启';
            UIUtils.setButtonClickAble(this.btnGo, false);
        } else {
            this.isCurLvLimited = false;
            if (0 != (this.ctrlBtnStrategy & AncientBossPanel.CtrlBtnGoBossLv)) {
                // 判断boss等级
                let cfgs = MonsterData.getBossCfgsByType(KeyWord.GROUP_XZFM_BOSS);
                let level = cfgs[index > 0 ? index * this.BossListItemNum + 1 : index].m_iLevel;
                if (level > G.DataMgr.heroData.level) {
                    this.labelBtnGo.text = uts.format('{0}级开放', level);
                    UIUtils.setButtonClickAble(this.btnGo, false);
                    this.isCurLvLimited = true;
                }

            } else if (0 != (this.ctrlBtnStrategy & AncientBossPanel.CtrlBtnGoSceneLv)) {
                // 判断boss所在场景的进入等级
                let sceneLv = 0;
                if (itemData.sceneId > 0) {
                    let sceneCfg = G.DataMgr.sceneData.getSceneInfo(itemData.sceneId).config;
                    sceneLv = sceneCfg.m_ucRequiredLevel;
                }
                if (sceneLv > 0 && G.DataMgr.heroData.level < sceneLv) {
                    this.labelBtnGo.text = uts.format('{0}级开放', sceneLv);
                    UIUtils.setButtonClickAble(this.btnGo, false);
                    this.isCurLvLimited = true;
                }
            }

            if (!this.isCurLvLimited) {
                this.labelBtnGo.text = '马上挑战';
                UIUtils.setButtonClickAble(this.btnGo, true);
            }
        }
    }
    updateView() {
        //这段注释是层的红点,暂时不用
        //let selected = this.bossGroup.Selected;
        //for (let i: number = 0; i < this.BossListItemNum; i++) {
        //    let itemData = this.bossListDatas[selected * this.BossListItemNum + i];
        //    if (
        //        G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_XZFM) &&
        //        G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_XZFM) &&
        //        itemData.killerName == null &&
        //        !itemData.isDead && itemData.refreshTime == 0) {
        //     this.tipMarks[0].SetActive(true);
        //    } else {
        //        this.tipMarks[selected].SetActive(false);
        //    }
        //}

        this.updateSelected();

        this.updateBossList();

        // 刷新任务
        this.updateTask();

    }

    private onClickBossListGroup(index: number) {
        this.updateSelected();
        this.updateBossList();
        this.updateBossList();
    }


    protected updateBossList() {
        let oldBossItemCnt = this.bossItems.length;
        let bossItem: AncientBossListItem;
        let hasDead: boolean = false;
        for (let i: number = 0; i < this.BossListItemNum; i++) {
            let itemData = this.bossListDatas[this.bossGroup.Selected * this.BossListItemNum + i];
            ////-----------------每层第4个boss--------------------
            let bossInfo = G.DataMgr.monsterData.getAncientBossInfo(itemData.bossId);
            if (null != bossInfo) {
                itemData.isDead = bossInfo.m_ucStatus == 0;
                itemData.refreshTime = bossInfo.m_uiRefreshTime;
            } else {
                itemData.isDead = false;
                itemData.refreshTime = 0;
            }
            ////-------------------------------------------------------
            if (i < oldBossItemCnt) {
                bossItem = this.bossItems[i];
            } else {
                this.bossItems[i] = bossItem = new AncientBossListItem();
                bossItem.setCommonPents(this.bossList.GetItem(i).gameObject);
            }
            let canFollow: boolean;
            if (this.isCurLvLimited) {
                canFollow = false;
            }
            else {
                canFollow = i != this.BossListItemNum - 1;
            }

            bossItem.updateAncientBoss(itemData, canFollow);

            if (itemData.isDead && itemData.refreshTime > 0) {
                hasDead = true;
            }

        }
        if (hasDead) {
            this.addTimer(this.TickTimerKey, 1000, 0, this.onUpdateTimer);
        } else {
            this.removeTimer(this.TickTimerKey);
        }
    }
    private onUpdateTimer() {
        this.updateBossList();
    }

    private updateTask() {
        let monsterData = G.DataMgr.monsterData;
        let panelInfo = monsterData.ancientBossPanelInfo;
        if (undefined == panelInfo || panelInfo == null) return;
        let maxnum = G.DataMgr.constData.getValueById(KeyWord.PARAM_XZFM_BOSS_PRIZE_COUNT);
        let resnum = Math.max(maxnum - panelInfo.m_ucPrizeCount, 0);
        this.textTask.text = uts.format('今日奖励次数：{0}/{1}', TextFieldUtil.getColorText(resnum.toString(), resnum > 0 ? Color.GREEN : Color.RED), maxnum);
    }
    onActDataChange() {
        this.updateBtnGo();
    }
    protected updateSelected() {
        let index = this.bossGroup.Selected;
        if (null == this.bossListDatas) return;
        //三层奖励列表分别取第0个,第5个,第9个boss的
        let itemData = this.bossListDatas[index > 0 ? index * this.BossListItemNum + 1 : index];
        this.txtName.text = uts.format("第{0}层", TextFieldUtil.NUMBER_LIST[index + 1]);
        let cfg = MonsterData.getMonsterConfig(itemData.bossId);
        if (this.oldBossId != itemData.bossId) {
            this.oldBossId = itemData.bossId;
            // 奖励列表
            let cnt = itemData.dropIds.length;
            this.rewardList.Count = cnt;
            this.rewardList.Count = this.awardCount;

            let oldIconCnt = this.rewardIcons.length;
            let iconItem: IconItem;
            for (let i: number = 0; i < this.awardCount; i++) {
                if (i < oldIconCnt) {
                    iconItem = this.rewardIcons[i];
                } else {
                    this.rewardIcons.push(iconItem = new IconItem());
                    iconItem.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
                    iconItem.setTipFrom(TipFrom.normal);
                }
                if (i < cnt) {
                    iconItem.updateById(itemData.dropIds[i]);
                    iconItem.updateIcon();
                }
                else {
                    iconItem.updateByItemConfig(null);
                    iconItem.updateIcon();
                }
            }
            //归属者奖励刷新
            let dropCfg: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(itemData.doubleDropID);
            if (dropCfg != null) {
                let dropCount = dropCfg.m_ucDropThingNumber;
                this.otherRewardList.Count = dropCount;
                for (let i = 0; i < dropCount; i++) {
                    if (this.otherRewardIcons[i] == null) {
                        this.otherRewardIcons[i] = new IconItem();
                        this.otherRewardIcons[i].setUsuallyIcon(this.otherRewardList.GetItem(i).gameObject);
                        this.otherRewardIcons[i].setTipFrom(TipFrom.normal);
                    }
                    this.otherRewardIcons[i].updateById(dropCfg.m_astDropThing[i].m_iDropID, dropCfg.m_astDropThing[i].m_uiDropNumber);
                    this.otherRewardIcons[i].updateIcon();
                }
            }
            else {
                this.otherRewardList.Count = 0;
            }
        }
        this.updateBtnGo();
    }


    protected onBtnGoClick() {
        G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_XZFM, this.bossGroup.Selected + 1, 0);
        G.Uimgr.closeForm(BossView);
    }

    protected onBtnRecordClick() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(370), '规则介绍');
    }

    private onClickBtnPaiMai() {
        G.Uimgr.createForm<YuanGuJingPaiView>(YuanGuJingPaiView).open();
    }
    protected onClose() {
        MonsterData.isHasBossRefresh = false;
        G.ActBtnCtrl.update(false);
    }

}
