import { Global as G } from 'System/global'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { CommonForm } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { GroupList } from 'System/uilib/GroupList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { EnumGuide } from 'System/constants/GameEnum'
import { MonsterData } from 'System/data/MonsterData'
import { BossBaseItem } from 'System/pinstance/boss/BossBasePanel'
import { TipFrom } from 'System/tip/view/TipsView'
import { Constants } from 'System/constants/Constants'
import { GuildTools } from 'System/guild/GuildTools'
import { EnumMainViewChild } from 'System/main/view/MainView'

class FengMoTaStatBossItem extends BossBaseItem {
    layer = 0;

    constructor() {
        super(false, false);
    }

    update(isDead: boolean, refreshTime: number, killerName: string, layer: number) {
        super.update(isDead, refreshTime, killerName);
        this.layer = layer;
    }
}

/**<黑洞塔统计>的对话框。*/
export class FengMoTaStatView extends NestedSubForm {
    private readonly RefreshTimerKey = 'refresh';

    private readonly MaxBossCntPerLayer = 3;

    private content: UnityEngine.GameObject;

    private btnOpen: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    private btnExit: UnityEngine.GameObject;
    private btnSummon: UnityEngine.GameObject;

    private bossItems: FengMoTaStatBossItem[] = [];

    constructor() {
        super(EnumMainViewChild.fengmotaStat);
    }

    protected resPath(): string {
        return UIPathData.FengMoTaStatView;
    }

    protected initElements() {
        this.content = this.elems.getElement('content');

        this.btnOpen = this.elems.getElement('btnOpen');
        this.btnClose = this.elems.getElement('btnClose');
        this.btnExit = this.elems.getElement('btnExit');
        this.btnSummon = this.elems.getElement('btnSummon');

        for (let i = 0; i < this.MaxBossCntPerLayer; i++) {
            let bossGo = this.elems.getElement('boss' + i);
            let bossItem = new FengMoTaStatBossItem();
            bossItem.setComponents(bossGo);
            this.bossItems.push(bossItem);
        }
    }

    protected initListeners() {
        this.addClickListener(this.btnOpen, this.onClickBtnOpen);
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.btnExit, this.onClickBtnExit);
        this.addClickListener(this.btnSummon, this.onClickBtnSummon);

        for (let i = 0; i < this.MaxBossCntPerLayer; i++) {
            let bossItem = this.bossItems[i];
            this.addClickListener(bossItem.gameObject, delegate(this, this.onClickBoss, i));
        }
    }
    protected onClose() {

    }

    protected onOpen() {
        if (!G.DataMgr.fmtData.isFmtScene(G.DataMgr.sceneData.preSceneID)) {
            this.onClickBtnOpen();
        } else if (this.content.activeSelf) {
            this.updateBossList();
        }
        this.onGuildGradeChanged();
    }

    reset() {
        for (let i = 0; i < this.MaxBossCntPerLayer; i++) {
            let bossItem = this.bossItems[i];
            bossItem.gameObject.SetActive(false);
        }
        this.removeTimer(this.RefreshTimerKey);
    }

    onBossInfoChanged() {
        if (this.content.activeSelf) {
            this.updateBossList();
        }
    }

    private updateBossList() {
        let curSceneID = G.DataMgr.sceneData.curSceneID;
        let info = G.DataMgr.fmtData.bossGuideInfo;
        let bossCnt = 0;
        if (null != info) {
            bossCnt = info.m_ucNum;
        }
        
        let layer = 0;
        let cfgs = G.DataMgr.fmtData.fmtArr;
        let fmtCnt = cfgs.length;
        for (let i = 0; i < fmtCnt; i++) {
            if (curSceneID == cfgs[i].m_iSceneID) {
                layer = cfgs[i].m_iLayer;
                break;
            }
        }

        let hasDead = false;
        let now = Math.round(G.SyncTime.getCurrentTime() / 1000);
        for (let i = 0; i < this.MaxBossCntPerLayer; i++) {
            let bossItem = this.bossItems[i];
            // 注意boss的数量是动态的，但是这里不能使用layout组件，因为这样的话无法获取准确的item坐标，导致指引箭头位置错乱
            if (i < bossCnt) {
                let bossInfo = info.m_astBossInfo[i];
                bossItem.init(bossInfo.m_uiMonstID);

                bossItem.update(bossInfo.m_uiTime > now, bossInfo.m_uiTime, null, layer);
                if (bossInfo.m_uiTime > now) {
                    hasDead = true;
                }
                bossItem.gameObject.SetActive(true);
            } else {
                bossItem.gameObject.SetActive(false);
            }
        }

        if (hasDead) {
            this.addTimer(this.RefreshTimerKey, 1000, 0, this.onUpdateTimer);
        } else {
            this.removeTimer(this.RefreshTimerKey);
        }
    }

    onGuildGradeChanged() {
        // 宗主显示召集按钮
        let heroData = G.DataMgr.heroData;
        this.btnSummon.SetActive(heroData.guildId > 0 && heroData.isManager);
    }

    private onUpdateTimer() {
        this.updateBossList();
    }

    private onClickBtnExit() {
        G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_BACKTOCITY);
    }

    private onClickBtnSummon() {
        GuildTools.summonGuildMembers();
    }

    private onClickBoss(bossIndex: number) {
        let bossItem = this.bossItems[bossIndex];
        G.ActionHandler.goToFmtLayer(bossItem.layer, bossItem.bossId);
    }

    private onClickBtnClose() {
        this.btnOpen.SetActive(true);
        this.content.SetActive(false);
        this.removeTimer(this.RefreshTimerKey);
    }

    private onClickBtnOpen() {
        this.content.SetActive(true);
        this.btnOpen.SetActive(false);
        this.updateBossList();
    }
}