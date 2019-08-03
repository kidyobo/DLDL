import { Global as G } from 'System/global'
import { BossBaseItemData } from 'System/pinstance/boss/BossBasePanel'
import { FengMoTaBossBasePanel } from 'System/pinstance/boss/FengMoTaBossBasePanel'
import { KeyWord } from 'System/constants/KeyWord'
import { DropPlanData } from 'System/data/DropPlanData'
import { UIPathData } from 'System/data/UIPathData';
import { TabSubForm } from 'System/uilib/TabForm';
import { Constants } from 'System/constants/Constants';
import { EnumKfhdBossStatus, EnumKfhdBossType } from 'System/constants/GameEnum';
import { MonsterData } from 'System/data/MonsterData';
import { TipFrom } from 'System/tip/view/TipsView';
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { ListItemCtrl } from 'System/uilib/ListItemCtrl';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { DataFormatter } from 'System/utils/DataFormatter';
import { UIUtils } from 'System/utils/UIUtils';
import { UnitUtil } from "System/utils/UnitUtil";
import { Macros } from 'System/protocol/Macros'
import { BossBasePanel, CtrlBossBtnGoStrategy } from 'System/pinstance/boss/BossBasePanel'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { GameObjectGetSet, TextGetSet } from '../../uilib/CommonForm';
import { TextFieldUtil } from 'System/utils/TextFieldUtil'

export class BossBaseItem extends ListItemCtrl {
    protected bossHeadImg: UnityEngine.UI.RawImage;

    protected txtFight: UnityEngine.UI.Text;
    protected textName: UnityEngine.UI.Text;
    protected textStatus: UnityEngine.UI.Text;
    private bgGo1: GameObjectGetSet;
    private bgGo2: GameObjectGetSet;
    private bgGo3: GameObjectGetSet;
    gameObject: UnityEngine.GameObject;
    bossId = 0;

    protected followed: UnityEngine.GameObject;

    private combineLv = true;
    private showHours = true;

    constructor(combineLv: boolean, showHours: boolean) {
        super();
        this.combineLv = combineLv;
        this.showHours = showHours;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.bossHeadImg = ElemFinder.findRawImage(go, 'bossheadParent/bossHead');
        this.txtFight = ElemFinder.findText(go, 'txtFight');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textStatus = ElemFinder.findText(go, 'statusBg/textStatus');
        this.followed = ElemFinder.findObject(go, 'followed');
        this.bgGo1 = new GameObjectGetSet(ElemFinder.findObject(go, 'colorNode/1'));
        this.bgGo2 = new GameObjectGetSet(ElemFinder.findObject(go, 'colorNode/2'));
        this.bgGo3 = new GameObjectGetSet(ElemFinder.findObject(go, 'colorNode/3'));
    }

    init(bossId: number, curBossGroupIndex: number) {
        if (this.bossId != bossId) {

            this.bossId = bossId;
            let cfg = MonsterData.getMonsterConfig(bossId);
            this.textName.text = uts.format('{0}级  {1}', cfg.m_usLevel, cfg.m_szMonsterName);
            this.txtFight.text = uts.format("推荐战力：{0}", TextFieldUtil.getColorText(cfg.m_iFightPoint.toString(), G.DataMgr.heroData.fight >= cfg.m_iFightPoint ? Color.GREEN : Color.RED));
            // 加载头像
            G.ResourceMgr.loadImage(this.bossHeadImg, uts.format('images/vipBossHead/{0}.png', cfg.m_iHeadID));
            if (curBossGroupIndex == 0) {
                this.bgGo1.SetActive(true);
                this.bgGo2.SetActive(false);
                this.bgGo3.SetActive(false);
            } else if (curBossGroupIndex == 1) {
                this.bgGo1.SetActive(false);
                this.bgGo2.SetActive(true);
                this.bgGo3.SetActive(false);
            } else {
                this.bgGo1.SetActive(false);
                this.bgGo2.SetActive(false);
                this.bgGo3.SetActive(true);
            }
        }
    }

    update(isDead: boolean, refreshTime: number, killerName: string, ...args) {
        if (null != killerName) {
            this.textStatus.text = uts.format('上轮：{0}', killerName);
            this.textStatus.color = UnityEngine.Color.white;
        } else {
            if (isDead && refreshTime != 0) {

                let leftSecond = refreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000);
                if (leftSecond < 0) {
                    leftSecond = 0;
                }
                if (this.showHours) {
                    this.textStatus.text = TextFieldUtil.getColorText(DataFormatter.second2hhmmss(leftSecond), Color.RED);
                } else {
                    this.textStatus.text = TextFieldUtil.getColorText(DataFormatter.second2mmss(leftSecond), Color.RED);
                }
            } else {
                this.textStatus.text = TextFieldUtil.getColorText("已刷新", Color.GREEN);
            }
        }
    }
}

export class FengMoTaBossPanel extends TabSubForm {

    //private readonly ModelStandardScale = 200;
    //private readonly ModelMaxWidth = 950;
    //private readonly ModelMaxHeight = 900;onBtnGoClick
    private readonly awardCount: number = 9;

    private static readonly CtrlBtnGoAct = 1;
    private static readonly CtrlBtnGoBossLv = 2;
    private static readonly CtrlBtnGoSceneLv = 4;
    /**总层数*/
    private readonly BossGroupCount = 3;
    /**每一层显示的boss数量*/
    private readonly BossListCount = 7;

    private readonly TickTimerKey = '1';

    private bossGroup: UnityEngine.UI.ActiveToggleGroup;
    private curBossGroupIndex: number = 0;

    protected list: List;
    protected bossItems: BossBaseItem[] = [];

    protected textName: UnityEngine.UI.Text;
    protected textLv: UnityEngine.UI.Text;
    //protected toggleFollow: UnityEngine.UI.ActiveToggle;
    //protected guideArrow: UnityEngine.GameObject;
    //protected bossAvatar: UnityEngine.GameObject;
    //protected modelCtn: UnityEngine.GameObject;
    //protected modelRoot: UnityEngine.GameObject;

    protected rewardList: List;
    protected rewardIcons: IconItem[] = [];
    btnGo: UnityEngine.GameObject;
    protected labelBtnGo: UnityEngine.UI.Text;
    protected btnRecord: UnityEngine.GameObject;

    /**boss列表数据*/
    protected bossListDatas: BossBaseItemData[] = [];
    private bossListDataDic: { [layer: number]: BossBaseItemData[] } = {};
    /**手选的boss*/
    protected handChoice: number = -1;
    protected openBossId: number = 0;

    protected oldBossId: number = 0;

    private needRecord = true;
    private needCountDown = true;
    private wabaoOperator = 0;
    private activityId = 0;
    private ctrlBtnStrategy = CtrlBossBtnGoStrategy.none;

    private txtMonsterNumber: TextGetSet;
    private textKillBossNumber: TextGetSet;

    private funId: number;

    constructor() {
        super(KeyWord.ACT_FUNCTION_FMT);
        this.funId = KeyWord.ACT_FUNCTION_FMT;
        this.needRecord = false;
        this.needCountDown = true;
        this.wabaoOperator = 0;
        this.activityId = Macros.ACTIVITY_ID_BFXYACT;
        this.ctrlBtnStrategy = CtrlBossBtnGoStrategy.SceneLv;
        this.closeSound = null;
    }


    protected resPath(): string {
        return UIPathData.WildBossView;
    }

    protected initElements() {

        this.bossGroup = this.elems.getToggleGroup('BossGroup');

        // boss列表
        this.list = this.elems.getUIList('list');

        // boss名字
        this.textName = this.elems.getText('textName');
        this.textLv = this.elems.getText('textLv');

        //this.toggleFollow = this.elems.getActiveToggle("toggleFollow");
        //this.guideArrow = this.elems.getElement('guide');

        //// boss模型
        //this.modelCtn = this.elems.getElement('modelCtn');
        ////改缩放的节点
        //this.modelRoot = this.elems.getElement("modelRoot");

        // 奖励列表
        this.rewardList = this.elems.getUIList('rewardList');

        // 按钮
        this.btnGo = this.elems.getElement('btnGo');
        this.labelBtnGo = this.elems.getText('labelBtnGo');
        this.btnRecord = this.elems.getElement('btnRecord');
        this.btnRecord.SetActive(this.needRecord);

        // boss列表
        this.initBossData();
        let bossCnt = this.bossListDatas.length;
        this.list.Count = bossCnt;

        this.textKillBossNumber = new TextGetSet(this.elems.getText("textKillBossNumber"));

        //let textTip = this.elems.getText('textTip');
        //textTip.text = '每8分钟BOSS会进入狂暴状态';

        this.txtMonsterNumber = new TextGetSet(this.elems.getText("txtMonsterNumber"));

    }

    protected initListeners() {
        this.addToggleGroupListener(this.bossGroup, this.onClickBossListGroup);

        this.addListClickListener(this.list, this.onClickBossList);
        //if (this.toggleFollow) {
        //    this.toggleFollow.onValueChanged = delegate(this, this.onToggleValueChanged);
        //}
        this.addClickListener(this.btnGo, this.onBtnGoClick);
        this.addClickListener(this.btnRecord, this.onBtnRecordClick);
    }

    protected onOpen() {
        this.onActDataChange();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFXYACT, Macros.ACTIVITY_FMT_LIST));
        this.bossGroup.Selected = this.curBossGroupIndex;
        this.updateView();
    }

    protected onClose() {
        this.handChoice = -1;
    }

    open(openBossId: number) {
        this.openBossId = openBossId;
        super.open();
    }

    protected initBossData() {
        // boss列表
        let fmtArr = G.DataMgr.fmtData.fmtArr;
        let len: number = fmtArr.length;
        let bossListDatas: BossBaseItemData[] = [];
        for (let i: number = 0; i < len; i++) {
            let config = fmtArr[i];
            for (let dropInfo of config.m_astBossDropList) {
                if (dropInfo.m_iBossID) {
                    let itemData: BossBaseItemData = new BossBaseItemData();
                    itemData.bossId = dropInfo.m_iBossID;
                    itemData.layer = config.m_iLayer;
                    itemData.sceneId = config.m_iSceneID;
                    itemData.hunliLimit = config.m_iHunliLimit;
                    itemData.bigHunliLimit = config.m_iBigBossHunliLimit;

                    let dropPlanConfig: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(dropInfo.m_iBossDropID);
                    let len: number = 0;
                    if (dropPlanConfig) {
                        len = dropPlanConfig.m_astDropThing.length;
                    }

                    let ids: number[] = [];
                    for (let i: number = 0; i < len; i++) {
                        ids.push(dropPlanConfig.m_astDropThing[i].m_iDropID);
                    }
                    itemData.dropIds = ids;

                    bossListDatas.push(itemData);
                }
            }
        }
        let length = bossListDatas.length;
        for (let i = 0; i < this.BossGroupCount; i++) {
            let datas: BossBaseItemData[] = [];
            for (let j: number = i * this.BossListCount; j < (i + 1) * this.BossListCount; j++) {
                datas.push(bossListDatas[j]);
            }
            this.bossListDataDic[i] = datas;
        }

    }

    updateView() {
        let num = G.DataMgr.constData.getValueById(KeyWord.PARAM_FMT_MONSTER_PRIZE_COUNT) - G.DataMgr.fmtData.m_iKillMonsterNumber;
        this.txtMonsterNumber.text = TextFieldUtil.getColorText(num.toString(), num > 0 ? Color.GREEN : Color.RED);
        let num2 =20 - G.DataMgr.fmtData.m_iKillBossNumber;
        this.textKillBossNumber.text = TextFieldUtil.getColorText(num2.toString(), num2 > 0 ? Color.GREEN : Color.RED);
        this.bossListDatas = this.bossListDataDic[this.curBossGroupIndex];
        let selectIndex: number = this.handChoice;
        // 刷新boss状态
        let bossCnt = this.bossListDatas.length;
        for (let i: number = 0; i < bossCnt; i++) {
            let itemData = this.bossListDatas[i];
            let bossInfo = G.DataMgr.fmtData.getBossOneInfo(this.bossListDatas[i].bossId);
            if (null != bossInfo) {
                itemData.isDead = bossInfo.m_ucIsDead != 0;
                itemData.refreshTime = bossInfo.m_uiFreshTime;
            } else {
                itemData.isDead = false;
                itemData.refreshTime = 0;
            }
        }
        this.updateBossList();
    }

    protected updateBossList() {
        if (this.openBossId > 0) {
            let bossCnt = this.bossListDatas.length;
            for (let i: number = 0; i < bossCnt; i++) {
                if (this.bossListDatas[i].bossId == this.openBossId) {
                    this.handChoice = i;
                }
            }
            this.openBossId = 0;
        }

        let selectIndex: number = this.handChoice;

        let cnt = this.bossListDatas.length;
        this.list.Count = cnt;
        let oldBossItemCnt = this.bossItems.length;
        let bossItem: BossBaseItem;
        let hasDead: boolean = false;
        for (let i: number = 0; i < cnt; i++) {
            let itemData = this.bossListDatas[i];
            if (i < oldBossItemCnt) {
                bossItem = this.bossItems[i];
            } else {
                this.bossItems[i] = bossItem = new BossBaseItem(true, true);
                bossItem.setComponents(this.list.GetItem(i).gameObject);
            }
            bossItem.init(itemData.bossId, this.curBossGroupIndex);

            if (KeyWord.ACT_FUNCTION_FMT == this.funId) {
                let bossListData = G.DataMgr.kfhdData.getBossList(EnumKfhdBossType.fengMoTa);
                if (i <= bossListData.length - 1) {
                    bossItem.update(itemData.isDead, itemData.refreshTime, itemData.killerName, bossListData[i].status);
                }
            }

            bossItem.update(itemData.isDead, itemData.refreshTime, itemData.killerName);
            this.updateBossItemExt(bossItem, itemData);

            if (selectIndex < 0 && !itemData.isDead) {
                // 自动选中已刷新的
                selectIndex = i;
            }
            if (itemData.isDead && itemData.refreshTime > 0) {
                hasDead = true;
            }
        }

        if (selectIndex < 0) {
            selectIndex = this.list.Selected;
        }
        if (selectIndex < 0) {
            selectIndex = 0;
        }

        if (this.list.Selected != selectIndex) {
            this.list.Selected = selectIndex;
            // this.list.ScrollByAxialRow(selectIndex/3);
        }
        this.updateSelected();

        if (this.needCountDown && hasDead) {
            this.addTimer(this.TickTimerKey, 1000, 0, this.onUpdateTimer);
        } else {
            this.removeTimer(this.TickTimerKey);
        }
    }

    protected updateBossItemExt(bossItem: BossBaseItem, itemData: BossBaseItemData) {
    }

    private onUpdateTimer() {
        this.updateBossList();
    }



    protected updateSelected() {
        let index = this.list.Selected;
        let itemData = this.bossListDatas[index];

        let cfg = MonsterData.getMonsterConfig(itemData.bossId);
        if (this.oldBossId != itemData.bossId) {
            this.oldBossId = itemData.bossId;
            // 更新模型
            this.updateSelectedModel(cfg);

            // 奖励列表
            let cnt = itemData.dropIds.length;
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

            //// 更新是否已关注
            //this.updateFollowed();
        }

        this.updateBtnGo();
    }

    protected updateSelectedModel(cfg: GameConfig.MonsterConfigM) {
        // 更新名字
        this.textName.text = cfg.m_szMonsterName;
        this.textLv.text = uts.format("{0}级", cfg.m_usLevel.toString());
        //Game.Tools.SetGameObjectLocalScale(this.modelRoot, cfg.m_ucUnitScale, cfg.m_ucUnitScale, cfg.m_ucUnitScale);
        //G.ResourceMgr.loadModel(this.modelCtn, UnitUtil.getRealMonsterType(cfg.m_ucModelFolder), cfg.m_szModelID, this.sortingOrder, true);
    }

    onActDataChange() {
        this.updateBtnGo();
    }

    private updateBtnGo() {
        let index = this.list.Selected;
        let itemData = this.bossListDatas[index];
        if (!itemData) {
            return;
        }

        if (!G.DataMgr.activityData.isActivityOpen(this.activityId)) {
            this.labelBtnGo.text = '未开启';
            UIUtils.setButtonClickAble(this.btnGo, false);
        }
        else {
            let cfg = G.DataMgr.sceneData.getSceneInfo(itemData.sceneId).config;
            let sceneLv: number = cfg.m_ucRequiredLevel;

            if (itemData.hunliLimit > G.DataMgr.hunliData.level) {
                let des = KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, itemData.hunliLimit);
                this.labelBtnGo.text = uts.format('魂力达到{0}开放', des);
                UIUtils.setButtonClickAble(this.btnGo, false);
            }
            else if (G.DataMgr.heroData.level < sceneLv ? sceneLv : 0) {
                this.labelBtnGo.text = uts.format('{0}级开放', sceneLv);
                UIUtils.setButtonClickAble(this.btnGo, false);
            }
            else {
                this.labelBtnGo.text = '马上挑战';
                UIUtils.setButtonClickAble(this.btnGo, true);
            }
        }


        // let cfg = MonsterData.getMonsterConfig(itemData.bossId);

        // if (!G.DataMgr.activityData.isActivityOpen(this.activityId)) {
        //     this.labelBtnGo.text = '未开启';
        //     UIUtils.setButtonClickAble(this.btnGo, false);
        // } else {
        //     let cfg = G.DataMgr.sceneData.getSceneInfo(itemData.sceneId).config;
        //     if (G.DataMgr.hunliData.level >= cfg.m_iHunliLimit) {
        //         let sceneLv: number = cfg.m_ucRequiredLevel;
        //         if (G.DataMgr.heroData.level < sceneLv ? sceneLv : 0) {
        //             this.labelBtnGo.text = uts.format('{0}级开放', sceneLv);
        //             UIUtils.setButtonClickAble(this.btnGo, false);
        //         } else {
        //             this.labelBtnGo.text = '马上挑战';
        //             UIUtils.setButtonClickAble(this.btnGo, true);
        //         }
        //     } else {
        //         this.labelBtnGo.text = uts.format("{0} 可进入", KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, cfg.m_iHunliLimit));
        //         UIUtils.setButtonClickAble(this.btnGo, false);
        //     }
        // }

        //if (0 != (this.ctrlBtnStrategy & FengMoTaBossPanel.CtrlBtnGoAct) && !G.DataMgr.activityData.isActivityOpen(this.activityId)) {
        //    this.labelBtnGo.text = '未开启';
        //    UIUtils.setButtonClickAble(this.btnGo, false);
        //} else {
        //    this.isCurLvLimited = false;
        //    if (0 != (this.ctrlBtnStrategy & FengMoTaBossPanel.CtrlBtnGoBossLv)) {
        //        // 判断boss等级
        //        if (cfg.m_usLevel > G.DataMgr.heroData.level) {
        //            this.labelBtnGo.text = uts.format('{0}级开放', cfg.m_usLevel);
        //            UIUtils.setButtonClickAble(this.btnGo, false);
        //            this.isCurLvLimited = true;
        //        }

        //    } else if (0 != (this.ctrlBtnStrategy & FengMoTaBossPanel.CtrlBtnGoSceneLv)) {
        //        // 判断boss所在场景的进入等级
        //        let sceneLv = 0;
        //        if (itemData.sceneId > 0) {
        //            let sceneCfg = G.DataMgr.sceneData.getSceneInfo(itemData.sceneId).config;
        //            sceneLv = sceneCfg.m_ucRequiredLevel;
        //        }
        //        if (sceneLv > 0 && G.DataMgr.heroData.level < sceneLv) {
        //            this.labelBtnGo.text = uts.format('{0}级开放', sceneLv);
        //            UIUtils.setButtonClickAble(this.btnGo, false);
        //            this.isCurLvLimited = true;
        //        }
        //    }

        //    if (!this.isCurLvLimited) {
        //        this.labelBtnGo.text = '马上挑战';
        //        UIUtils.setButtonClickAble(this.btnGo, true);
        //    }
        //}
    }

    private onClickBossList(index: number) {
        G.AudioMgr.playBtnClickSound();
        this.handChoice = index;
        this.updateSelected();
    }

    //private onToggleValueChanged(isOn: boolean) {
    //    if (this.oldBossId > 0) {
    //        if (G.DataMgr.deputySetting.canFollowBoss(this.oldBossId)) {
    //            G.DataMgr.deputySetting.followBoss(this.oldBossId, isOn);
    //            this.updateFollowed();
    //            this.updateBossList();
    //        } else {
    //            G.TipMgr.addMainFloatTip('已超过关注上限');
    //        }
    //    }
    //}

    private onClickBossListGroup(index: number) {
        this.curBossGroupIndex = index;
        this.updateView();
    }

    protected onBtnGoClick() {
        let index = this.list.Selected;
        if (index < 0) {
            return;
        }
        G.ActionHandler.goToFmtLayer(this.bossListDatas[index].layer, this.bossListDatas[index].bossId);
    }


    //private updateFollowed() {
    //    if (G.SyncTime.getDateAfterStartServer() >= Constants.BossFollowMinDay) {

    //        let ds = G.DataMgr.deputySetting;
    //        let bFollowed = ds.isBossFollowed(this.oldBossId);
    //        if (this.toggleFollow) {
    //            this.toggleFollow.isOn = bFollowed;
    //        }
    //        if (this.guideArrow) {
    //            this.guideArrow.SetActive(!bFollowed && ds.FollowCnt <= 0 && KeyWord.ACT_FUNCTION_FMT == this.id);
    //        }
    //    } else {
    //        if (this.guideArrow) {
    //            this.guideArrow.SetActive(false);
    //        }
    //    }
    //}


    protected onBtnRecordClick() {
    }
}