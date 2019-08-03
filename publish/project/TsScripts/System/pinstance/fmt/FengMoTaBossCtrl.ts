import { Global as G } from 'System/global'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { CommonForm, GameObjectGetSet } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { EnumGuide, EnumSceneID } from 'System/constants/GameEnum'
import { MonsterData } from 'System/data/MonsterData'
import { BossBaseItem } from 'System/pinstance/boss/BossBasePanel'
import { TipFrom } from 'System/tip/view/TipsView'
import { Constants } from 'System/constants/Constants'
import { DataFormatter } from 'System/utils/DataFormatter'
import { Color } from 'System/utils/ColorUtil'
import { GuildTools } from 'System/guild/GuildTools'
import { TypeCacher } from 'System/TypeCacher'
import { BossView } from 'System/pinstance/boss/BossView'


enum EnumFmtBossCtrlType {
    None = 0,
    SimpleWithBoss,
    SimpleNoBoss,
    ComplexWithBoss,
    ComplexNoBoss
}

/**<右侧封魔塔boss引导>*/
export class FengMoTaBossCtrl {
    private readonly RefreshTimerKey = 'refresh';

    private gameObject: UnityEngine.GameObject;
    private content: UnityEngine.GameObject;
    private complex: UnityEngine.GameObject;
    private simple: UnityEngine.GameObject;
    private guide: GameObjectGetSet;
    private descFight: GameObjectGetSet;
    private descFollow: GameObjectGetSet;

    private btnExit: UnityEngine.GameObject;
    private btnSummon: UnityEngine.GameObject;

    private btnOpen: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    private bossGo: UnityEngine.GameObject;
    private bossHeadImg: UnityEngine.UI.RawImage;
    private textName: UnityEngine.UI.Text;
    private textStatus: UnityEngine.UI.Text;
    private blueCircle: UnityEngine.GameObject;
    private guideRoot: UnityEngine.Transform;
    private textNone: UnityEngine.GameObject;

    private bossGoSmp: UnityEngine.GameObject;
    private bossHeadImgSmp: UnityEngine.UI.RawImage;
    private textNameSmp: UnityEngine.UI.Text;
    private textStatusSmp: UnityEngine.UI.Text;
    private blueCircleSmp: UnityEngine.GameObject;
    private guideRootSmp: UnityEngine.Transform;
    private textNoneSmp: UnityEngine.GameObject;

    private crtMonsterCfg: GameConfig.MonsterConfigM;
    private crtIsDead = false;
    private crtRefreshTime = 0;
    private crtFuncId = 0;

    private oldId = 0;
    private crtCtrlType = EnumFmtBossCtrlType.None;

    private updateTimer: Game.Timer;

    private btnTrigger: UnityEngine.GameObject;
    private isOpen: boolean = true;
    //private isShow: boolean = true;
    private openTimer: number = 10000;
    private pointBossClose: UnityEngine.GameObject;
    private pointBossOpen: UnityEngine.GameObject;
    private closeTimer: Game.Timer = null;


    setView(uiElems: UiElements) {
        this.gameObject = uiElems.getElement('fengMoTaBoss');
        let ctrlElems = new UiElements(this.gameObject.GetComponent(TypeCacher.ElementsMapper) as Game.ElementsMapper);

        this.content = ctrlElems.getElement('content');
        this.complex = ctrlElems.getElement('complex');
        this.simple = ctrlElems.getElement('simple');
        this.btnOpen = ctrlElems.getElement('btnOpen');
        this.btnClose = ctrlElems.getElement('btnClose');
        this.guide = new GameObjectGetSet(ctrlElems.getElement('guide'));
        this.descFight = new GameObjectGetSet(ctrlElems.getElement('descFight'));
        this.descFollow = new GameObjectGetSet(ctrlElems.getElement('descFollow'));

        // 复杂面板
        let complexElems = ctrlElems.getUiElements('complex');
        this.bossGo = complexElems.getElement('boss');
        this.btnExit = complexElems.getElement('btnExit');
        this.btnSummon = complexElems.getElement('btnSummon');
        this.bossHeadImg = complexElems.getRawImage('bossHead');
        this.textName = complexElems.getText('textName');
        this.textStatus = complexElems.getText('textStatus');
        this.blueCircle = complexElems.getElement('blueCircle');
        this.guideRoot = complexElems.getTransform('guideRoot');
        this.textNone = complexElems.getElement('textNone');

        // 简单面板
        let simpleElems = ctrlElems.getUiElements('simple');
        this.bossGoSmp = simpleElems.getElement('boss');
        this.bossHeadImgSmp = simpleElems.getRawImage('bossHead');
        this.textNameSmp = simpleElems.getText('textName');
        this.textStatusSmp = simpleElems.getText('textStatus');
        this.blueCircleSmp = simpleElems.getElement('blueCircle');
        this.guideRootSmp = simpleElems.getTransform('guideRoot');
        this.textNoneSmp = simpleElems.getElement('textNone');

        this.btnTrigger = ctrlElems.getElement("btnTrigger");
        this.pointBossClose = ctrlElems.getElement("pointBossClose");
        this.pointBossOpen = ctrlElems.getElement("pointBossOpen");

        Game.UIClickListener.Get(this.gameObject).onClick = delegate(this, this.onClickBoss);
        Game.UIClickListener.Get(this.btnOpen).onClick = delegate(this, this.onClickBtnOpen);
        Game.UIClickListener.Get(this.btnClose).onClick = delegate(this, this.onClickBtnClose);
        Game.UIClickListener.Get(this.btnExit).onClick = delegate(this, this.onClickBtnExit);
        Game.UIClickListener.Get(this.btnSummon).onClick = delegate(this, this.onClickBtnSummon);
        Game.UIClickListener.Get(this.textNoneSmp).onClick = delegate(this, this.onClickBtnAttention);
        Game.UIClickListener.Get(this.btnTrigger).onClick = delegate(this, this.onClickBossIcon)

        this.btnExit.SetActive(false);
        this.btnSummon.SetActive(false);

        this.btnOpen.SetActive(false);
        this.guide.SetActive(false);

        //this.openBossTween();
        this.isOpen = true;
        this.startTimer();
    }

    setActive(value: boolean) {
        this.gameObject.SetActive(value);
        if (value) {
            this.updateBoss();
            this.onGuildGradeChanged();
            if (null == this.updateTimer) {
                this.updateTimer = new Game.Timer(this.RefreshTimerKey, 1000, 0, delegate(this, this.onUpdateTimer));
            }
        } else if (null != this.updateTimer) {
            this.updateTimer.Stop();
            this.updateTimer = null;
        }
    }

    onGuildGradeChanged() {
        // 宗主显示召集按钮
        //let heroData = G.DataMgr.heroData;
        //this.btnSummon.SetActive(heroData.guildId > 0 && heroData.isManager);
    }

    onChangeScene() {
        this.updateBoss();
    }

    private updateBoss() {
        let myLv = G.DataMgr.heroData.level;
        let activityData = G.DataMgr.activityData;
        let fmtData = G.DataMgr.fmtData;
        // this.isShow = false;

        if (G.SyncTime.getDateAfterStartServer() < Constants.BossFollowMinDay) {
            // 开服第一天采用方案A
            this.crtFuncId = KeyWord.ACT_FUNCTION_FMT;
            let bossId = fmtData.getFmtSugguestBoss();
            if (bossId > 0) {
                this.crtMonsterCfg = MonsterData.getMonsterConfig(bossId);
                let bossInfo = fmtData.getBossOneInfo(bossId);
                if (null != bossInfo) {
                    this.crtIsDead = bossInfo.m_ucIsDead != 0 && bossInfo.m_uiFreshTime > 0;
                    this.crtRefreshTime = bossInfo.m_uiFreshTime;
                }
            } else {
                this.crtMonsterCfg = null;
            }
        } else {
            // 以后就只显示玩家关注的
            this.crtMonsterCfg = null;
            let funcLimitData = G.DataMgr.funcLimitData;
            let deputySetting = G.DataMgr.deputySetting;
            // 世界boss
            let bossList = activityData.bossList;
            if (null != bossList && funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WORLDBOSS)) {
                let cnt = bossList.m_iBossNum;
                for (let i = 0; i < cnt; i++) {
                    let bossInfo = bossList.m_astBossList[i];
                    if (deputySetting.isBossFollowed(bossInfo.m_iBossID)) {
                        this.checkBoss(bossInfo.m_iBossID, bossInfo.m_ucIsDead != 0, bossInfo.m_uiFreshTime, KeyWord.OTHER_FUNCTION_WORLDBOSS);
                    }
                }
            }
            // 专属boss
            let bossHomeData = activityData.bossHomeData;
            if (null != bossHomeData && funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_ZYCM_HOME_BOSS)) {
                let cnt = bossHomeData.length;
                for (let i = 0; i < cnt; i++) {
                    let bossInfo = bossHomeData[i];
                    if (deputySetting.isBossFollowed(bossInfo.m_iBossID)) {
                        this.checkBoss(bossInfo.m_iBossID, bossInfo.m_ucIsDead != 1, bossInfo.m_uiFreshTime, KeyWord.OTHER_FUNCTION_ZYCM_HOME_BOSS);
                    }
                }
            }
            // 封魔boss
            if (funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_FMT)) {
                let cnt = fmtData.fmtBossIds.length;
                for (let i = 0; i < cnt; i++) {
                    let bossId = fmtData.fmtBossIds[i];
                    if (deputySetting.isBossFollowed(bossId)) {
                        let bossInfo = fmtData.getBossOneInfo(bossId);
                        if (null != bossInfo) {
                            this.checkBoss(bossId, bossInfo.m_ucIsDead != 0, bossInfo.m_uiFreshTime, KeyWord.ACT_FUNCTION_FMT);
                        }
                    }
                }
            }
            // 地宫boss
            if (funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_DI_BOSS)) {
                let fmtArr = fmtData.fmtArr;
                let cnt = fmtArr.length;
                for (let i: number = 0; i < cnt; i++) {
                    let config = fmtArr[i];
                    if (config.m_iBigBossId && deputySetting.isBossFollowed(config.m_iBigBossId)) {
                        let bossInfo = fmtData.getBossOneInfo(config.m_iBigBossId);
                        if (null != bossInfo) {
                            this.checkBoss(config.m_iBigBossId, bossInfo.m_ucIsDead != 0, bossInfo.m_uiFreshTime, KeyWord.OTHER_FUNCTION_DI_BOSS);
                        }
                    }
                }
            }
            // 远古boss
            if (funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_XZFM)) {
                let cfgs = MonsterData.getBossCfgsByType(KeyWord.GROUP_XZFM_BOSS);
                let monsterData = G.DataMgr.monsterData;
                let cnt = cfgs.length;
                for (let i: number = 0; i < cnt - 1; i++) {
                    // 最后一只boss是随机刷新的不考虑
                    let config = cfgs[i];
                    if (deputySetting.isBossFollowed(config.m_iID)) {
                        let bossInfo = monsterData.getAncientBossInfo(config.m_iID);
                        if (null != bossInfo) {
                            this.checkBoss(config.m_iID, bossInfo.m_ucStatus == 0, bossInfo.m_uiRefreshTime, KeyWord.ACT_FUNCTION_XZFM);
                        }
                    }
                }
            }
        }

        let ctrlType: EnumFmtBossCtrlType;
        // 封魔塔里显示大面板
        let heroData = G.DataMgr.heroData;
        if (fmtData.isFmtScene(G.DataMgr.sceneData.curSceneID) && (heroData.guildId > 0 && heroData.isManager)) {
            ctrlType = this.crtMonsterCfg ? EnumFmtBossCtrlType.ComplexWithBoss : EnumFmtBossCtrlType.ComplexNoBoss;
        } else {
            ctrlType = this.crtMonsterCfg ? EnumFmtBossCtrlType.SimpleWithBoss : EnumFmtBossCtrlType.SimpleNoBoss;
        }

        if (this.crtCtrlType != ctrlType) {
            this.crtCtrlType = ctrlType;
            if (ctrlType == EnumFmtBossCtrlType.ComplexWithBoss) {
                this.simple.SetActive(false);
                this.complex.SetActive(true);
                this.guide.transform.SetParent(this.guideRoot);
                this.textNone.SetActive(false);
                this.bossGo.SetActive(true);
            } else if (ctrlType == EnumFmtBossCtrlType.ComplexNoBoss) {
                this.simple.SetActive(false);
                this.complex.SetActive(true);
                this.guide.transform.SetParent(this.guideRoot);
                this.textNone.SetActive(true);
                this.bossGo.SetActive(false);
            } else if (ctrlType == EnumFmtBossCtrlType.SimpleWithBoss) {
                this.simple.SetActive(true);
                this.complex.SetActive(false);
                this.guide.transform.SetParent(this.guideRootSmp);
                this.textNoneSmp.SetActive(false);
                this.bossGoSmp.SetActive(true);
            } else {
                this.simple.SetActive(true);
                this.complex.SetActive(false);
                this.guide.transform.SetParent(this.guideRootSmp);
                this.textNoneSmp.SetActive(true);
                this.bossGoSmp.SetActive(false);
            }
        }

        if (this.crtMonsterCfg) {
            if (this.oldId != this.crtMonsterCfg.m_iMonsterID) {
                this.oldId = this.crtMonsterCfg.m_iMonsterID;
                let bossName = uts.format('{0}级.{1}', this.crtMonsterCfg.m_usLevel, this.crtMonsterCfg.m_szMonsterName);
                this.textName.text = bossName;
                this.textNameSmp.text = bossName;
                // 加载头像
                //let headUrl = uts.format('images/head/{0}.png', this.crtMonsterCfg.m_iHeadID);
                //G.ResourceMgr.loadImage(this.bossHeadImg, headUrl);
                //G.ResourceMgr.loadImage(this.bossHeadImgSmp, headUrl);
            }

            let status: string;
            let color: UnityEngine.Color;
            let showCircle = false;
            let leftSecond = 0;
            if (this.crtIsDead) {
                leftSecond = this.crtRefreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000);
                if (leftSecond < 0) {
                    leftSecond = 0;
                }
            }

            if (leftSecond > 0) {
                status = DataFormatter.second2hhmmss(leftSecond);
                color = Color.toUnityColor('ED0F0F');
            } else {
                status = '点击前往';
                color = Color.toUnityColor('A3FF20');
                showCircle = true;
                // this.isShow = true;
            }
            this.textStatus.text = status;
            this.textStatusSmp.text = status;
            this.textStatus.color = color;
            this.textStatusSmp.color = color;
            this.blueCircle.SetActive(showCircle);
            this.blueCircleSmp.SetActive(showCircle);
            let showGuide = !this.crtIsDead && myLv >= Constants.FengMoTaGuideMinLv && myLv <= Constants.FengMoTaGuideMaxLv;
            //this.guide.SetActive(showGuide);
            if (showGuide) {
                this.descFight.SetActive(true);
                this.descFollow.SetActive(false);
            }
        } else {
            this.descFight.SetActive(false);
            this.descFollow.SetActive(true);
            //this.guide.SetActive(true);
        }

        //关闭图标
        // this.closeBossIcon();
    }

    private checkBoss(bossId: number, isDead: boolean, refreshTime: number, funcId: number) {
        isDead = isDead && refreshTime > 0;
        let monsterCfg = MonsterData.getMonsterConfig(bossId);
        if (null != this.crtMonsterCfg && this.crtMonsterCfg.m_iMonsterID != bossId) {
            // 比较两只boss，首先已刷新的优先
            if (this.crtIsDead != isDead) {
                if (isDead) {
                    return;
                }
            } else {
                // 其次刷新时间更靠近的优先
                if (isDead && this.crtRefreshTime != refreshTime) {
                    if (this.crtRefreshTime < refreshTime) {
                        return;
                    }
                } else {
                    // 再者等级高的优先
                    if (this.crtMonsterCfg.m_usLevel != monsterCfg.m_usLevel) {
                        if (this.crtMonsterCfg.m_usLevel > monsterCfg.m_usLevel) {
                            return;
                        }
                    } else if (this.crtMonsterCfg.m_iMonsterID > bossId) {
                        // 最后直接按boss id排序好了
                        return;
                    }
                }
            }
        }
        this.crtMonsterCfg = monsterCfg;
        this.crtIsDead = isDead;
        this.crtRefreshTime = refreshTime;
        this.crtFuncId = funcId;
    }

    private onUpdateTimer() {
        this.updateBoss();
    }

    private onClickBtnExit() {
        if (!G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_BACKTOCITY)) {
            G.Mapmgr.goToPos(EnumSceneID.CHONGHUACHENG, Constants.ZhuChengDefaultPosX, Constants.ZhuChengDefaultPosY, false);
        }
    }

    private onClickBtnSummon() {
        GuildTools.summonGuildMembers();
    }

    private onClickBtnAttention() {
        G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_WORLDBOSS);
    }
    private onClickBoss() {
        if (this.crtMonsterCfg) {
            if (KeyWord.ACT_FUNCTION_FMT == this.crtFuncId) {
                let cfg = G.DataMgr.fmtData.getFmtCfgByBossId(this.crtMonsterCfg.m_iMonsterID);
                G.ActionHandler.goToFmtLayer(cfg.m_iLayer, this.crtMonsterCfg.m_iMonsterID);
            } else if (KeyWord.OTHER_FUNCTION_ZYCM_HOME_BOSS == this.crtFuncId) {
                // boss之家需要传第几层进去
                let bossCfg = MonsterData.getBossConfigById(this.crtMonsterCfg.m_iMonsterID);
                G.ActionHandler.executeFunction(this.crtFuncId, 0, 0, bossCfg.m_iFloor - 1);
            } else {
                G.ActionHandler.executeFunction(this.crtFuncId, 0, 0, this.crtMonsterCfg.m_iMonsterID);
            }
        } else {
            G.ActionHandler.executeFunction(KeyWord.ACT_FUNCTION_FMT);
        }
    }

    private onClickBtnClose() {
        this.btnOpen.SetActive(true);
        this.content.SetActive(false);
        if (null != this.updateTimer) {
            this.updateTimer.Stop();
            this.updateTimer = null;
        }
    }

    private onClickBtnOpen() {
        this.content.SetActive(true);
        this.btnOpen.SetActive(false);
        this.updateBoss();
        if (null == this.updateTimer) {
            this.updateTimer = new Game.Timer(this.RefreshTimerKey, 1000, 0, delegate(this, this.onUpdateTimer));
        }
    }

    /**点击图标 */
    private onClickBossIcon() {
        //关闭状态 打开
        if (!this.isOpen)
            this.openBossTween();
        //开启状态 无
        else
            this.closeBossTween();
    }

    // private closeBossIcon() {
    //     if (this.isShow) {
    //         if (this.closeTimer != null) {
    //             this.closeTimer.Stop();
    //             this.closeTimer = null;
    //             this.openBossTween();
    //         }
    //         if (this.isOpen == false)
    //             this.openBossTween();
    //     }
    //     else {
    //         if (this.closeTimer == null)
    //             this.closeTimer = new Game.Timer("openBossIconTimer", this.openTimer, 1, delegate(this, this.closeBossTween));
    //     }
    // }

    private closeBossTween() {
        if (this.isOpen /**&& !this.isShow */) {
            if (this.closeTimer != null) {
                this.closeTimer.Stop();
                this.closeTimer = null;
            }
            let tween = Tween.TweenPosition.Begin(this.gameObject, 0.2, this.pointBossClose.transform.position, true);
            this.isOpen = false;

            // tween.onFinished = delegate(this, this.closeEnd);
        }
    }

    private openBossTween() {
        Tween.TweenPosition.Begin(this.gameObject, 0.2, this.pointBossOpen.transform.position, true);
        this.isOpen = true;
        this.startTimer();
    }

    /**开始关闭的计时 */
    private startTimer() {
        if (this.closeTimer == null)
            this.closeTimer = new Game.Timer("openBossIconTimer", this.openTimer, 1, delegate(this, this.closeBossTween));
        else
            this.closeTimer.ResetTimer(this.openTimer, 1, delegate(this, this.closeBossTween));
    }

    private closeEnd() {
        this.isOpen = false;
    }
}