import { Constants } from 'System/constants/Constants';
import { EnumKfhdBossStatus, EnumKfhdBossType } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { MonsterData } from 'System/data/MonsterData';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { TipFrom } from 'System/tip/view/TipsView';
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { ListItemCtrl } from 'System/uilib/ListItemCtrl';
import { TabSubForm } from 'System/uilib/TabForm';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { DataFormatter } from 'System/utils/DataFormatter';
import { UIUtils } from 'System/utils/UIUtils';
import { UnitUtil } from "System/utils/UnitUtil";
import { TextFieldUtil } from 'System/utils/TextFieldUtil'

export class BossBaseItem extends ListItemCtrl {
    protected bossHeadImg: UnityEngine.UI.RawImage;

    protected textLv: UnityEngine.UI.Text;
    protected textName: UnityEngine.UI.Text;
    protected textStatus: UnityEngine.UI.Text;
    protected xuanShangStatus: UnityEngine.GameObject;
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
        this.bossHeadImg = ElemFinder.findRawImage(go, 'bossHead');
        this.textLv = ElemFinder.findText(go, 'textLv');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textStatus = ElemFinder.findText(go, 'statusBg/textStatus');
        this.xuanShangStatus = ElemFinder.findObject(go, 'xuanShangStatus');
        this.followed = ElemFinder.findObject(go, 'followed');
    }

    init(bossId: number) {
        if (this.bossId != bossId) {
            this.bossId = bossId;
            let cfg = MonsterData.getMonsterConfig(bossId);
            if (null != this.textLv) {
                this.textLv.text = uts.format('{0}级', cfg.m_usLevel);
                this.textName.text = cfg.m_szMonsterName;
            } else {
                if (this.combineLv) {
                    this.textName.text = uts.format('{0}级.{1}', cfg.m_usLevel, cfg.m_szMonsterName);
                } else {
                    this.textName.text = cfg.m_szMonsterName;
                }
            }

            // 加载头像
            G.ResourceMgr.loadImage(this.bossHeadImg, uts.format('images/head/{0}.png', cfg.m_iHeadID));
        }

        // if (this.followed) {
        //     this.followed.SetActive(G.DataMgr.deputySetting.isBossFollowed(bossId));
        // }
    }
    update(isDead: boolean, refreshTime: number, killerName: string, ...args) {
        if (null != killerName) {
            this.textStatus.text = uts.format('上轮：{0}', killerName);
            this.textStatus.color = UnityEngine.Color.white;
        } else {
            if (isDead && refreshTime != 0) {
                if (refreshTime < 0) {
                    // 远古boss最后一只随机刷新
                    this.textStatus.text = '随机刷新';
                    this.textStatus.color = Color.toUnityColor('FF4444');
                } else {
                    let leftSecond = refreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000);
                    if (leftSecond < 0) {
                        leftSecond = 0;
                    }
                    if (this.showHours) {
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

        if (args.length > 0) {
            if (args[0] == EnumKfhdBossStatus.hasGot) {
                this.xuanShangStatus.SetActive(true);
            }
            else {
                this.xuanShangStatus.SetActive(false);
            }
        }

    }
}

export class BossBaseItemData {
    bossId: number = 0;
    layer: number = 0;
    isDead: boolean = false;
    refreshTime: number = 0;
    dropIds: number[] = null;
    killerName: string;
    getRewardCnt = 0;
    /**每个boss奖励次数,目前世界boss在用*/
    eachBossRewardNum = 0;
    sceneId = 0;
    canWaBao = false;
    /**副本类型，世界boss，跨服boss挖宝区分*/
    pinType: number = 0;
    hunliLimit: number = 0;
    bigHunliLimit: number = 0;

    doubleDropID: number = 0;
}

export enum CtrlBossBtnGoStrategy {
    none = 0,
    ActAndBossLv = 3,
    SceneLv = 4,
    ActAndSceneLv = 5,
}

export abstract class BossBasePanel extends TabSubForm {
    //private readonly ModelStandardScale = 200;
    //private readonly ModelMaxWidth = 950;
    //private readonly ModelMaxHeight = 900;
    readonly awardCount: number = 9;

    private static readonly CtrlBtnGoAct = 1;
    private static readonly CtrlBtnGoBossLv = 2;
    private static readonly CtrlBtnGoSceneLv = 4;

    protected readonly TickTimerKey = '1';

    protected list: List;
    protected bossItems: BossBaseItem[] = [];

    protected textName: UnityEngine.UI.Text;
    protected textLv: UnityEngine.UI.Text;
    //protected toggleFollow: UnityEngine.UI.ActiveToggle;
    protected guideArrow: UnityEngine.GameObject;
    protected bossAvatar: UnityEngine.GameObject;
    protected modelCtn: UnityEngine.GameObject;
    protected modelRoot: UnityEngine.GameObject;

    protected rewardList: List;
    protected rewardIcons: IconItem[] = [];
    btnGo: UnityEngine.GameObject;
    protected labelBtnGo: UnityEngine.UI.Text;
    protected btnRecord: UnityEngine.GameObject;

    /**boss列表数据*/
    protected bossListDatas: BossBaseItemData[] = [];

    /**手选的boss*/
    protected handChoice: number = -1;
    protected openBossId: number = 0;

    protected oldBossId: number = 0;

    protected isCurLvLimited = false;

    private needRecord = true;
    protected needCountDown = true;
    private wabaoOperator = 0;
    protected activityId = 0;
    protected ctrlBtnStrategy = CtrlBossBtnGoStrategy.none;

    private funId: number;

    constructor(id: number, needRecord: boolean, needCountDown: boolean, wabaoOperator: number, activityId: number, ctrlBtnStrategy: CtrlBossBtnGoStrategy) {
        super(id);
        this.funId = id;
        this.needRecord = needRecord;
        this.needCountDown = needCountDown;
        this.wabaoOperator = wabaoOperator;
        this.activityId = activityId;
        this.ctrlBtnStrategy = ctrlBtnStrategy;
        this.closeSound = null;
    }

    protected resPath(): string {
        return UIPathData.BaseBossView;
    }

    protected initElements() {
        // boss列表
        this.list = this.elems.getUIList('list');

        // boss名字
        this.textName = this.elems.getText('textName');
        this.textLv = this.elems.getText('textLv');

        //this.toggleFollow = this.elems.getActiveToggle("toggleFollow");
        this.guideArrow = this.elems.getElement('guide');

        // boss模型
        this.modelCtn = this.elems.getElement('modelCtn');
        //改缩放的节点
        this.modelRoot = this.elems.getElement("modelRoot");

        // 奖励列表
        this.rewardList = this.elems.getUIList('rewardList');

        // 按钮
        this.btnGo = this.elems.getElement('btnGo');
        this.labelBtnGo = this.elems.getText('labelBtnGo');
        this.btnRecord = this.elems.getElement('btnRecord');
        this.btnRecord.SetActive(this.needRecord);
    }

    protected initListeners() {
        this.addListClickListener(this.list, this.onClickBossList);
        //if (this.toggleFollow) {
        //    this.toggleFollow.onValueChanged = delegate(this, this.onToggleValueChanged);
        //}
        this.addClickListener(this.btnGo, this.onBtnGoClick);
        this.addClickListener(this.btnRecord, this.onBtnRecordClick);
    }

    protected onOpen() {
        this.onActDataChange();
    }

    protected onClose() {
        this.handChoice = -1;
    }

    open(openBossId: number) {
        this.openBossId = openBossId;
        super.open();
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

            bossItem.init(itemData.bossId);

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
            this.list.ScrollByAxialRow(selectIndex);
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

    protected onUpdateTimer() {
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

            // 更新是否已关注
            //this.updateFollowed();
        }

        this.updateBtnGo();
    }

    protected updateSelectedModel(cfg: GameConfig.MonsterConfigM) {
        // 更新名字
        this.textName.text = cfg.m_szMonsterName;
        this.textLv.text = uts.format("{0}级", cfg.m_usLevel.toString());
        Game.Tools.SetGameObjectLocalScale(this.modelRoot, cfg.m_ucUnitScale, cfg.m_ucUnitScale, cfg.m_ucUnitScale);
        G.ResourceMgr.loadModel(this.modelCtn, UnitUtil.getRealMonsterType(cfg.m_ucModelFolder), cfg.m_szModelID, this.sortingOrder, true);
    }

    onActDataChange() {
        this.updateBtnGo();
    }

    protected updateBtnGo() {
        let index = this.list.Selected;
        let itemData = this.bossListDatas[index];
        if (!itemData) {
            return;
        }
        let cfg = MonsterData.getMonsterConfig(itemData.bossId);

        if (0 != (this.ctrlBtnStrategy & BossBasePanel.CtrlBtnGoAct) && !G.DataMgr.activityData.isActivityOpen(this.activityId)) {
            this.labelBtnGo.text = '未开启';
            UIUtils.setButtonClickAble(this.btnGo, false);
        } else {
            this.isCurLvLimited = false;
            if (0 != (this.ctrlBtnStrategy & BossBasePanel.CtrlBtnGoBossLv)) {
                // 判断boss等级
                if (cfg.m_usLevel > G.DataMgr.heroData.level) {
                    this.labelBtnGo.text = uts.format('{0}级开放', cfg.m_usLevel);
                    UIUtils.setButtonClickAble(this.btnGo, false);
                    this.isCurLvLimited = true;
                }

            } else if (0 != (this.ctrlBtnStrategy & BossBasePanel.CtrlBtnGoSceneLv)) {
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

    //public updateFollowed() {
    //    if (G.SyncTime.getDateAfterStartServer() >= Constants.BossFollowMinDay) {
    //        let ds = G.DataMgr.deputySetting;
    //        let bFollowed = ds.isBossFollowed(this.oldBossId);
    //        if (this.toggleFollow) {
    //            this.toggleFollow.isOn = bFollowed;
    //        }
    //        if (this.guideArrow) {
    //            this.guideArrow.SetActive(!bFollowed && ds.FollowCnt <= 0 && KeyWord.ACT_FUNCTION_FMT == this.id);
    //        }
    //        this.toggleFollow.gameObject.SetActive(true);
    //    } else {
    //        this.toggleFollow.gameObject.SetActive(false);
    //        if (this.guideArrow) {
    //            this.guideArrow.SetActive(false);
    //        }
    //    }
    //}

    protected abstract onBtnGoClick();
    protected abstract onBtnRecordClick();
}