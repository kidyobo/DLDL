import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { EnumKfhdBossType, EnumKfhdBossStatus } from 'System/constants/GameEnum'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { DataFormatter } from 'System/utils/DataFormatter'
import { Color } from 'System/utils/ColorUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { SyncTime } from 'System/net/SyncTime'


import { BossBaseItem } from 'System/pinstance/boss/BossBasePanel'
import { KfhdBossVo } from 'System/data/vo/KfhdBossVo'
import { DropPlanData } from 'System/data/DropPlanData'
import { Constants } from 'System/constants/Constants'
import { MonsterData } from 'System/data/MonsterData'
import { BossView } from 'System/pinstance/boss/BossView'

class KfhdBossItem extends BossBaseItem {
    private canGetGo: UnityEngine.GameObject;
    private hasGotGo: UnityEngine.GameObject;
    private lvLack: UnityEngine.GameObject;
    private starBg: UnityEngine.GameObject;
    private starNum: UnityEngine.UI.Text;
    constructor() {
        super(true, true);
    }

    setComponents(go: UnityEngine.GameObject) {
        super.setComponents(go);
        this.canGetGo = ElemFinder.findObject(go, 'canGetGo');
        this.hasGotGo = ElemFinder.findObject(go, 'hasGotGo');
        this.lvLack = ElemFinder.findObject(go, 'lvLack');
        this.starBg = ElemFinder.findObject(go, 'starBg');
        this.starNum = ElemFinder.findText(go, 'starNum');

    }

    update(isDead: boolean, refreshTime: number, killerName: string, status: EnumKfhdBossStatus, bossId: number, type: EnumKfhdBossType, starNum: number) {
        super.update(isDead, refreshTime, killerName);

        let heroLv = G.DataMgr.heroData.level;
        let cfg = MonsterData.getMonsterConfig(bossId);
        let bossLv = cfg.m_usLevel;

        if (type == EnumKfhdBossType.fengMoTa) {
            this.starBg.SetActive(true);
            this.starNum.text = TextFieldUtil.getColorText(starNum.toString(), Color.PURE_YELLOW);
            this.starNum.gameObject.SetActive(true);
            UIUtils.setGrey(this.starNum.gameObject, true);
        }
        else 
        {
            this.starBg.SetActive(false);
            this.starNum.text = TextFieldUtil.getColorText(starNum.toString(), Color.GREY);
            this.starNum.text = starNum.toString();
            this.starNum.gameObject.SetActive(false );
        }


       
        if (bossLv > heroLv)
        {
            this.lvLack.SetActive(true);
            UIUtils.setGrey(this.gameObject, true);
            this.starNum.text = TextFieldUtil.getColorText(starNum.toString(), Color.GREY);
        }
        else
        {
            this.lvLack.SetActive(false);
            UIUtils.setGrey(this.gameObject, false);
              this.starNum.text = TextFieldUtil.getColorText(starNum.toString(), Color.PURE_YELLOW);
        }

        if (EnumKfhdBossStatus.reached == status) {
            this.hasGotGo.SetActive(false);
            this.canGetGo.SetActive(true);
            this.textStatus.gameObject.SetActive(false);
        } else if (EnumKfhdBossStatus.hasGot == status) {
            this.hasGotGo.SetActive(true);
            this.canGetGo.SetActive(false);
            this.textStatus.gameObject.SetActive(false);
        } else {
            this.hasGotGo.SetActive(false);
            this.canGetGo.SetActive(false);
            this.textStatus.gameObject.SetActive(true);
        }

    }
}

export class KfhdBossPanel extends TabSubForm {

    private readonly Types: EnumKfhdBossType[] = [EnumKfhdBossType.fengMoTa,EnumKfhdBossType.world/*, EnumKfhdBossType.diGong*/];

    private tabGroup: UnityEngine.UI.ActiveToggleGroup;
    private tipMarks: UnityEngine.GameObject[] = [];

    private list: List;
    private bossItems: KfhdBossItem[] = [];

    private textTime: UnityEngine.UI.Text;

    private rewardList: List;
    private rewardIcons: IconItem[] = [];

    private btnGetReward: UnityEngine.GameObject;

    private btnGo: UnityEngine.GameObject;
    private labelGo: UnityEngine.UI.Text;

    /**手选的boss*/
    private handChoice: number = -1;

    private type: EnumKfhdBossType;

    //文本说明图片
    private desc1: UnityEngine.GameObject;
    private desc2: UnityEngine.GameObject;
    private desc3: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_KFHD_SJBOSS);
    }

    protected resPath(): string {
        return UIPathData.KfhdBossView;
    }

    protected initElements() {
        this.tabGroup = this.elems.getToggleGroup('tabGroup');
        let cnt = this.Types.length;
        for (let i = 0; i < cnt; i++) {
            this.tipMarks.push(ElemFinder.findObject(this.tabGroup.GetToggle(i).gameObject, 'tipMark'));
        }

        // boss列表
        this.list = this.elems.getUIList('list');

        // 奖励列表
        this.rewardList = this.elems.getUIList('rewardList');

        this.btnGetReward = this.elems.getElement('btnGetReward');

        this.btnGo = this.elems.getElement('btnGo');
        this.labelGo = this.elems.getText('labelGo');

        this.textTime = this.elems.getText('textTime');

        this.desc1 = this.elems.getElement('desc1');
        this.desc2 = this.elems.getElement('desc2');
        this.desc3 = this.elems.getElement('desc3');
    }

    protected initListeners() {
        this.addToggleGroupListener(this.tabGroup, this.onClickTabGroup);
        this.addListClickListener(this.list, this.onClickList);
        this.addClickListener(this.btnGetReward, this.onClickBtnGetReward);
        this.addClickListener(this.btnGo, this.onClickBtnGo);
    }

    protected onOpen() {
        // 世界悬赏仅开服前7天
        let kfhdData = G.DataMgr.kfhdData;
        let d = G.SyncTime.getDateAfterStartServer();
        let typeCnt = this.Types.length;
        let openTabIdx = -1;
        let firstActive = -1;
        for (let i = 0; i < typeCnt; i++) {
            let type = this.Types[i];
            let isActive = true;
            if (EnumKfhdBossType.world == type) {
                if (d <= Macros.MAX_BOSSACT_OPEN_DAYS) {
                    this.textTime.text = kfhdData.getActivityBeginToOverTime();
                    // 拉取数据
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDBOSS, Macros.ACTIVITY_WORLD_BOSS_LIST));
                } else {
                    isActive = false;
                }
            } else if (EnumKfhdBossType.diGong == type) {

            }
            this.tabGroup.GetToggle(i).gameObject.SetActive(isActive);
            if (isActive) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.CHALLENGE_BOSS_OPEN_PANEL, type));
                if (openTabIdx < 0 && kfhdData.getBossRewardCount(type) > 0) {
                    openTabIdx = i;
                }
                if (firstActive < 0) {
                    firstActive = i;
                }
            }
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFXYACT, Macros.ACTIVITY_FMT_LIST));
        if (openTabIdx < 0) {
            openTabIdx = firstActive >= 0 ? firstActive : 0;
        }
        
        this.tabGroup.Selected = openTabIdx;
    }

    protected onClose() {
        this.handChoice = -1;
        this.list.Selected = -1;
    }

    private onClickTabGroup(index: number) {
        this.type = this.Types[index];
        this.desc1.SetActive(this.type == EnumKfhdBossType.world);
        this.desc2.SetActive(this.type == EnumKfhdBossType.fengMoTa);
        this.desc3.SetActive(this.type == EnumKfhdBossType.diGong);
        this.textTime.gameObject.SetActive(EnumKfhdBossType.world == this.type);
        // 先初始化boss列表
        let bossListData = G.DataMgr.kfhdData.getBossList(this.type);
        let cnt = 0;
        if (null != bossListData) {
            cnt = bossListData.length;
        }
        this.list.Count = cnt;
        let oldItemCnt = this.bossItems.length;
        for (let i = 0; i < cnt; i++) {
            let item: KfhdBossItem;
            if (i < oldItemCnt) {
                item = this.bossItems[i];
            } else {
                item = new KfhdBossItem();
                this.bossItems.push(item);
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.init(bossListData[i].cfg.m_iID);
        }
        this.handChoice = -1;
        this.updateBossList();
    }

    onKfhdBossChanged() {
        this.updateBossList();
        // 更新小红点
        this.checkBossTipMark();
    }

    private updateBossList() {
        let selectIndex: number = this.handChoice;
        let firstRefreshed = -1;
        let hasDead = false;
        let bossListData = G.DataMgr.kfhdData.getBossList(this.type);
        let sceneData = G.DataMgr.sceneData;
        
        let cnt = bossListData.length;
        for (let i = 0; i < cnt; i++) {
            let item = this.bossItems[i];
            let vo = bossListData[i];
            let bossInfo: { m_ucIsDead: number, m_uiFreshTime: number };

            let monsterCfg = MonsterData.getMonsterConfig(vo.cfg.m_iID);
            vo.minLv = monsterCfg.m_usLevel;
            let sceneId = 0;
            if (EnumKfhdBossType.world == this.type) {
                bossInfo = G.DataMgr.activityData.getOneBossInfo(vo.cfg.m_iID);
                let monsterNav: GameConfig.NavigationConfigM = G.DataMgr.sceneData.getZycmNav(vo.cfg.m_iID);
                sceneId = monsterNav.m_iSceneID;
            } else {
                bossInfo = G.DataMgr.fmtData.getBossOneInfo(vo.cfg.m_iID);
                if (EnumKfhdBossType.fengMoTa != this.type) {
                    let fmtCfg = G.DataMgr.fmtData.getFmtCfgByBossId(vo.cfg.m_iID);
                    sceneId = fmtCfg.m_iBigBossSceneID;
                }
            }
            if (sceneId > 0) {
                vo.minLv = Math.max(vo.minLv, sceneData.getSceneInfo(sceneId).config.m_ucRequiredLevel);
            }
            if (null != bossInfo) {
                item.update(bossInfo.m_ucIsDead != 0, bossInfo.m_uiFreshTime, null, vo.status, bossListData[i].cfg.m_iID, this.type, bossListData[i].cfg.m_iDisplayLevel);
                if (bossInfo.m_ucIsDead != 0 && bossInfo.m_uiFreshTime > 0) {
                    hasDead = true;
                }
            } else {
                item.update(false, 0, null, vo.status, bossListData[i].cfg.m_iID, this.type, bossListData[i].cfg.m_iDisplayLevel);
            }

            if (vo.status == EnumKfhdBossStatus.reached) {
                // 自动选中已领奖的
                if (selectIndex < 0) {
                    selectIndex = i;
                }
            }
            else if (vo.status == EnumKfhdBossStatus.noReached && firstRefreshed < 0 && (null == bossInfo || (bossInfo.m_ucIsDead == 0 && 0 == bossInfo.m_uiFreshTime))) {
                // 自动选中已刷新的
                firstRefreshed = i;
            }
        }

        if (selectIndex < 0) {
            selectIndex = firstRefreshed;
        }
        if (selectIndex < 0) {
            selectIndex = this.list.Selected;
        }
        if (selectIndex < 0) {
            selectIndex = 0;
        }

        this.list.Selected = selectIndex;
        this.updateSelected();

        if (hasDead) {
            this.addTimer("1", 1000, 0, this.onUpdateTimer);
        } else {
            this.removeTimer("1");
        }
    }

    private onUpdateTimer() {
        this.updateBossList();
    }

    protected updateSelected() {
        let bossListData = G.DataMgr.kfhdData.getBossList(this.type);
        let index = this.list.Selected;
        let itemData = bossListData[index];

        // 奖励列表
        let dropCfg = DropPlanData.getDropPlanConfig(itemData.cfg.m_iDisplayDropId);
        let cnt = 0;
        if (null != dropCfg) {
            cnt = dropCfg.m_ucDropThingNumber;
        }
        this.rewardList.Count = cnt;
        let oldIconCnt = this.rewardIcons.length;
        let iconItem: IconItem;
        for (let i: number = 0; i < cnt; i++) {
            let itemGo = this.rewardList.GetItem(i).gameObject;
            if (i < oldIconCnt) {
                iconItem = this.rewardIcons[i];
            } else {
                this.rewardIcons.push(iconItem = new IconItem());
                iconItem.setUsuallyIcon(itemGo);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
            iconItem.updateIcon();
        }

        if (itemData.status == EnumKfhdBossStatus.hasGot) {
            this.btnGetReward.SetActive(false);
            this.labelGo.text = '已领取';
            this.btnGo.SetActive(true);
            UIUtils.setButtonClickAble(this.btnGo, false);
        }
        else if (itemData.status == EnumKfhdBossStatus.reached) {
            this.btnGo.SetActive(false);
            this.btnGetReward.SetActive(true);
        }
        else {
            this.btnGetReward.SetActive(false);

            if (itemData.minLv > 0 && G.DataMgr.heroData.level < itemData.minLv) {
                this.labelGo.text = uts.format('{0}级领奖', itemData.minLv);
                UIUtils.setButtonClickAble(this.btnGo, false);
            } else {
                this.labelGo.text = '前往击杀';
                UIUtils.setButtonClickAble(this.btnGo, true);
            }

            this.btnGo.SetActive(true);
        }
    }

    private onClickList(index: number) {
        this.handChoice = index;
        this.updateSelected();
    }

    private onClickBtnGetReward() {
        let index = this.list.Selected;
        if (index < 0) {
            return;
        }
        let bossListData = G.DataMgr.kfhdData.getBossList(this.type);
        let itemData = bossListData[index];

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.GET_CHALLENGE_BOSS_REWARD, itemData.cfg.m_iID));
    }

    private onClickBtnGo() {
        let index = this.list.Selected;
        if (index < 0) {
            return;
        }
        let bossListData = G.DataMgr.kfhdData.getBossList(this.type);
        let itemData = bossListData[index];

        if (EnumKfhdBossType.world == this.type) {
            G.ActionHandler.gotoWorldBoss(itemData.cfg.m_iID);
        } else if (EnumKfhdBossType.fengMoTa == this.type) {
            let fmtCfg = G.DataMgr.fmtData.getFmtCfgByBossId(itemData.cfg.m_iID);
            G.ActionHandler.goToFmtLayer(fmtCfg.m_iLayer, itemData.cfg.m_iID);
        } else {
            G.Uimgr.getForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_DI_BOSS, itemData.cfg.m_iID);
        }
    }
    /**
     * 更新boss页签小红点。
     */
    private checkBossTipMark() {
        let cnt = this.Types.length;
        for (let i = 0; i < cnt; i++) {
            this.tipMarks[i].SetActive(G.DataMgr.kfhdData.getBossRewardCount(this.Types[i]) > 0);
        }
    }
}