import { EnumGuide, UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { AncientBossPanel } from "System/pinstance/boss/AncientBossPanel";
import { BossHomePanel } from 'System/pinstance/boss/BossHomePanel';
import { DiGongBossPanel } from "System/pinstance/boss/DiGongBossPanel";
import { FengMoTaBossPanel } from "System/pinstance/boss/FengMoTaBossPanel";
import { KuaFuBossPanel } from "System/pinstance/boss/KuaFuBossPanel";
import { MingJiangPanel } from "System/pinstance/boss/MingJiangPanel";
import { VipBossPanel } from "System/pinstance/boss/VipBossPanel";
import { WoodsBossPanel } from "System/pinstance/boss/WoodsBossPanel";
import { WorldBossPanel } from "System/pinstance/boss/WorldBossPanel";
import { VipPinstancePanel } from "System/pinstance/hall/VipPinstancePanel";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TipMarkUtil } from "System/tipMark/TipMarkUtil";
import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from "../../uilib/CurrencyTip";
import { TabFormCommom } from "../../uilib/TabFormCommom";
import { MultipleBossView } from './MultipleBossView';
import { PersonalBossView } from './PersonalBossView';
import { MonsterData } from 'System/data/MonsterData'

export class BossView extends TabFormCommom {
    private currencyTip: CurrencyTip;

    private openTab = 0;
    private openBossId: number = 0;

    //是否显示3d背景  长度为子页签数量，true为显示3d背景，下面为第一，第二个页签显示3d背景
    private isBg_3D: boolean[] = [true, true, false, true, false, true, false, false, true];
    private bg_2D: UnityEngine.GameObject;
    private bg_3D: UnityEngine.GameObject;
    private bg_3d_prefabPath: string;

    constructor() {
        super(KeyWord.ACT_FUNCTION_BOSS, PersonalBossView, MultipleBossView, FengMoTaBossPanel, DiGongBossPanel, AncientBossPanel,
            WorldBossPanel, /* VipBossPanel WoodsBossPanel,,*/ BossHomePanel,/* VipPinstancePanel, MingJiangPanel,*/ KuaFuBossPanel);
        this._cacheForm = true;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.BossView;
    }
    protected initElements() {
        super.initElements();
        this.bg_2D = this.elems.getElement("2dBg");
        this.bg_3D = this.elems.getElement("3dcamera_image");
        this.bg_3d_prefabPath = "uiscene/3dBgPrefabs/" + this.elems.getElement("bg_3d_prefabName").name + ".prefab";
        this.setTabGroupNanme(["魂骨Boss", "多人Boss", "落日森林", "国家", "星斗", "金属之都", /*"落日森林",*/ "VIP", "跨服", "干掉了...",]);

        this.setTitleName("BOSS挑战");
        this.setFightActive(false);

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());
    }

    protected onTabGroupClick(index: number) {
        super.switchTabForm(index);
        this.bg_3D.SetActive(this.isBg_3D[index]);
        this.bg_2D.SetActive(!this.isBg_3D[index]);
    }

    protected initListeners() {
        super.initListeners();


        this.addClickListener(this.getCloseButton(), this.onClickReturnBtn);
    }


    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    ///**更新文本脚本*/
    //private _updateTabAngle(): void {
    //    let len = BossView.TABS.length;
    //    let cnt: number = 0;
    //    for (let i: number = 0; i < len; i++) {
    //        if (BossView.TABS[i] == EnumBossViewTab.world) {
    //            cnt = G.DataMgr.activityData.worldBossBoxCount;
    //        }
    //        else if (BossView.TABS[i] == EnumBossViewTab.fengmota) {
    //            cnt = G.DataMgr.fmtData.getFmtBossReciveCount();
    //        }
    //        else if (BossView.TABS[i] == EnumBossViewTab.digong) {
    //            cnt = G.DataMgr.fmtData.getDgBossReviveCount();
    //        }
    //        //else if (i == EnumBossViewTab.cross) {
    //        //    cnt = G.DataMgr.activityData.kfBossBoxCount;
    //        //}
    //        // 显示圆点
    //       // this.setTabTipMark(i, cnt > 0);
    //    }
    //}


    updateVIPBoss() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_VIP_BOSS) as VipBossPanel;
        if (panel.isOpened) {
            panel.updateView();
            this.updateVipBossTipMark();
        }
    }

    updateWorldBoss() {
        let worldPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_WORLDBOSS) as WorldBossPanel;
        if (worldPanel.isOpened) {
            worldPanel.updateView();
        }
        this.updateWorldBossTipMark();
    }
    //世界boss红点逻辑
    private updateWorldBossTipMark() {

        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_WORLDBOSS, TipMarkUtil.WorldBossTipMark());
    }
    updateFmtBoss() {
        let fmtPanel = this.getTabFormByID(KeyWord.ACT_FUNCTION_FMT) as FengMoTaBossPanel;
        if (fmtPanel.isOpened) {
            fmtPanel.updateView();
        }
    }

    updateDigongBoss() {
        let fmtPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_DI_BOSS) as DiGongBossPanel;
        if (fmtPanel.isOpened) {
            fmtPanel.updateView();
        }
    }

    //boss之家
    updateBossHomePanelTip() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_ZYCM_HOME_BOSS, TipMarkUtil.bossHome());
    }

    updateBossHome() {
        let bossHomePanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_ZYCM_HOME_BOSS) as BossHomePanel;
        if (bossHomePanel != null && bossHomePanel.isOpened) {
            bossHomePanel.updateView();
        }
    }


    updateKuaFuBoss() {
        let kuafuPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_CROSSSVRBOSS) as KuaFuBossPanel;
        if (kuafuPanel.isOpened) {
            kuafuPanel.updateView();
        }
    }

    /*
     * 个人Boss小红点刷新
     */
    updatePersonalBossPanelTip() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS, TipMarkUtil.personalBoss());
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_MULTIPLE_BOSS, TipMarkUtil.multipleBoss());
    }

    /**
     * 个人Boss
     */
    updatePersonalBoss() {
        let personalBossView = this.getTabFormByID(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS) as PersonalBossView;
        if (personalBossView != null && personalBossView.isOpened) {
            personalBossView.updateView();
        }
    }

    /**
    * 多人Boss
    */
    updateMultipleBoss() {
        let personalBossView = this.getTabFormByID(KeyWord.OTHER_FUNCTION_MULTIPLE_BOSS) as MultipleBossView;
        if (personalBossView != null && personalBossView.isOpened) {
            personalBossView.updateView();
        }
    }

    /**
    * 落日森林
    */
    updateWoodsBoss() {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_WOODS_BOSS) as WoodsBossPanel;
        if (panel != null && panel.isOpened) {
            panel.updateView();
        }
    }
    updataXzfmBoss() {
        let AncientBossPanel = this.getTabFormByID(KeyWord.ACT_FUNCTION_XZFM) as AncientBossPanel;
        if (AncientBossPanel.isOpened) {
            AncientBossPanel.updateView();
        }
    }

    onPinstanceChange() {
        let vipPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_ZRJT) as VipPinstancePanel;
        if (vipPanel && vipPanel.isOpened) {
            vipPanel.updateView();
            this.updateVipBossTipMark();
        }
        //刷新个人Boss
        this.updatePersonalBoss();
        this.updateMultipleBoss();
        //个人Boss小红点显示
        this.updatePersonalBossPanelTip();
    }

    onContainerChange(containerID: number) {
        let diGongPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_DI_BOSS) as DiGongBossPanel;
        if (diGongPanel.isOpened) {
            diGongPanel.onContainerChange(containerID);
        }
    }

    onActDataChange(id: number) {
        if (id == Macros.ACTIVITY_ID_WORLDBOSS) {
            let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_WORLDBOSS) as WorldBossPanel;
            if (view.isOpened) {
                view.onActDataChange();
            }
        } else if (id == Macros.ACTIVITY_ID_SHENMOZHETIAN) {
            let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_CROSSSVRBOSS) as KuaFuBossPanel;
            if (view.isOpened) {
                view.onActDataChange();
            }
        } else if (id == Macros.ACTIVITY_ID_XZFM) {
            let view = this.getTabFormByID(KeyWord.ACT_FUNCTION_XZFM) as AncientBossPanel;
            if (view.isOpened) {
                view.onActDataChange();
            }
        }
    }

    onMoneyChange(id: number) {
        // this.onMoneyChangeM();
        // if (id != KeyWord.MONEY_ID_MJTZ) return;
        // let mingJiangPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_MINGJIANG) as MingJiangPanel;
        // if (mingJiangPanel.isOpened) mingJiangPanel.onCurrencyChange();
    }

    onMoneyChangeM() {
        this.currencyTip.updateMoney();
    }
    private updateDiGongTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_DI_BOSS, TipMarkUtil.digong());
    }

    private updateVipBossTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_VIP_BOSS, TipMarkUtil.vipBossTipMark());
    }

    private updateWoodsBossTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_WOODS_BOSS, TipMarkUtil.woodsBossTipMark());
    }

    private updateXzfmTipMark() {
        this.setTabTipMarkById(KeyWord.ACT_FUNCTION_XZFM, TipMarkUtil.ancientBoss());
    }

    private updateMingJiangTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_MINGJIANG, TipMarkUtil.mingJiang());
    }

    ///////////////////////////////////////// 面板打开 /////////////////////////////////////////

    protected onOpen() {


        // 更新页签
        let isInDiGong = Macros.PINSTANCE_ID_DIGONG == G.DataMgr.sceneData.curPinstanceID;
        let funcLimitData = G.DataMgr.funcLimitData;
        let idLen: number = this.tabIds.length;
        for (let i: number = 0; i < idLen; i++) {
            let funId: number = this.tabIds[i];
            // 地宫副本中仅可显示地宫页签
            let isShow = (!isInDiGong || KeyWord.OTHER_FUNCTION_DI_BOSS == funId);
            if (isShow) {
                // 地宫boss虽然第一天功能不开，但是要让玩家看到入口，所以这里是用available
                if (KeyWord.OTHER_FUNCTION_DI_BOSS == funId) {
                    isShow = funcLimitData.isFuncAvailable(funId, false);
                }
                else {
                    isShow = funcLimitData.isFuncEntranceVisible(funId);
                }
            }
            this.tabGroup.GetToggle(i).gameObject.SetActive(isShow);

            if (this.openTab == funId && !isShow) {
                // 指定打开的页签不能显示
                this.openTab = 0;
                this.openBossId = 0;
            }

            //if (funId == KeyWord.OTHER_FUNCTION_ZYCM_HOME_BOSS)
            //    this.tabGroup.GetToggle(i).gameObject.SetActive(false);
        }
        if (G.GuideMgr.isGuiding(EnumGuide.PersonBossActive)) {
            let grider = G.GuideMgr.getCurrentGuider(EnumGuide.PersonBossActive);
            if (grider != null) {
                let index = grider.index;
                if (index == 6 || index == 7 || index == 9) {//多人Boss引导
                    this.switchTabFormById(KeyWord.OTHER_FUNCTION_MULTIPLE_BOSS);
                } else {//个人Boss引导
                    this.switchTabFormById(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS);
                }
            }
        } else {
            // 选中指定的页签
            this.switchTabFormById(this.openTab, this.openBossId);
        }

        // 更新地宫boss红点
        this.updateDiGongTipMark();
        // vip boss红点
        this.updateVipBossTipMark();
        //落日森林
        //this.updateWoodsBossTipMark();
        //个人Boss
        this.updatePersonalBossPanelTip();
        // 血战封魔红点
        this.updateXzfmTipMark();
        // 名将红点
        this.updateMingJiangTipMark();
        this.updateWorldBossTipMark();
        //拉取boss之家信息
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HOME_BOSS_ACT, Macros.ACTIVITY_HOME_BOSS_OPEN));
        this.onMoneyChangeM();

        G.GuideMgr.processGuideNext(EnumGuide.DiGongBossActive, EnumGuide.DiGongBossActive_ClickAction);
        super.onOpen();
        G.ResourceMgr.loadModel(this.bg_3D, UnitCtrlType.other, this.bg_3d_prefabPath, this.sortingOrder);


    }


    protected onClose() {
        super.onClose();

        if (G.DataMgr.deputySetting.isFollowBossDirty) {
            G.ModuleMgr.deputyModule.save();
        }
    }

    open(openTab = 0, openBossId: number = 0) {
        this.openTab = openTab;
        this.openBossId = openBossId;
        super.open();
    }

    updateMingJiangPanel(isRefreshPage: boolean) {
        // let mingJiangPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_MINGJIANG) as MingJiangPanel;
        // if (mingJiangPanel && mingJiangPanel.isOpened) {
        //     mingJiangPanel.updateView(isRefreshPage);
        // }
    }

    updateMingJiangByNotify() {
        // let mingJiangPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_MINGJIANG) as MingJiangPanel;
        // if (mingJiangPanel.isOpened) mingJiangPanel.updateByNotify();
    }

    updateMingJiangBuffLabel() {
        // let mingJiangPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_MINGJIANG) as MingJiangPanel;
        // if (mingJiangPanel.isOpened) mingJiangPanel.updateBuffLabel();
    }

    updateMingJiangRewardStatus() {
        // let mingJiangPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_MINGJIANG) as MingJiangPanel;
        // if (mingJiangPanel.isOpened) mingJiangPanel.updateBtnState();
        // this.updateMingJiangTipMark();
    }

    private onClickReturnBtn() {
        this.close();
    }

}
