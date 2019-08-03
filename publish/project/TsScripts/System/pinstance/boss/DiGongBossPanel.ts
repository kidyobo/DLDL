import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { BossBaseItemData, BossBasePanel } from 'System/pinstance/boss/BossBasePanel'
import { FengMoTaBossBasePanel } from 'System/pinstance/boss/FengMoTaBossBasePanel'
import { BossView } from 'System/pinstance/boss/BossView'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { DropPlanData } from 'System/data/DropPlanData'
import { PinstanceData } from 'System/data/PinstanceData'
import { EnumThingID, EnumAutoUse } from 'System/constants/GameEnum'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { StrategyView } from 'System/activity/view/StrategyView'
import { MonsterData } from 'System/data/MonsterData'
import { Constants } from 'System/constants/Constants'
import { EnumGuide } from 'System/constants/GameEnum'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIUtils } from '../../utils/UIUtils';

/**国家(地宫)boss */
export class DiGongBossPanel extends FengMoTaBossBasePanel implements IGuideExecutor {

    private readonly KeyPrices: number[] = [1, 1, 2, 2, 4, 7, 10, 15, 25];

    private static DisplayCount = 4;

    private textTimes: UnityEngine.UI.Text;

    private displayIcons: IconItem[] = [];

    private labelBtnGoS: UnityEngine.GameObject;
    private keyGo: UnityEngine.GameObject;
    private textPrice: UnityEngine.UI.Text;
    private textInfo: UnityEngine.UI.Text;

    private godPower: UnityEngine.UI.Text;

    private crtPrice = 0;


    private readonly timerName: string = "bossData";

    constructor() {
        super(KeyWord.OTHER_FUNCTION_DI_BOSS, true);
    }

    protected resPath(): string {
        return UIPathData.DiGongBossView;
    }

    protected initElements() {
        super.initElements();
        this.textTimes = this.elems.getText('textTimes');

        this.labelBtnGoS = this.elems.getElement('labelBtnGoS');
        this.keyGo = this.elems.getElement('key');
        this.textPrice = this.elems.getText('textPrice');
        this.textInfo = this.elems.getText('textInfo');
        this.godPower = this.elems.getText('godPower');
        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        for (let i = 0; i < DiGongBossPanel.DisplayCount; i++) {
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.setUsualIconByPrefab(itemIcon_Normal, this.elems.getElement('display' + i));
            this.displayIcons.push(iconItem);
        }
    }
    protected onOpen() {
        super.onOpen();
        if (!this.hasTimer(this.timerName)) {
            this.addTimer(this.timerName, 5000, -1, this.sendBossDataRequest);
        }
        G.GuideMgr.processGuideNext(EnumGuide.DiGongBossActive, EnumGuide.DiGongBossActive_OpenDiGongPanel);
    }

    protected onClose() {
        super.onClose();
        if (this.hasTimer(this.timerName)) {
            this.removeTimer(this.timerName);
        }
    }

    /**
     * 每过5s刷新一次显示
     * @param timer
     */
    private sendBossDataRequest(timer: Game.Timer) {
        //请求获取boss数据
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFXYACT, Macros.ACTIVITY_FMT_LIST));
        this.updateSelected();
    }

    protected updateSelected() {
        super.updateSelected();

        let fmtData = G.DataMgr.fmtData;
        let index = this.list.Selected;
        let bossId = this.bossListDatas[index].bossId;
        let cfg = fmtData.getFmtCfgByBossId(bossId);

        // 奖励列表
        let dropCfg = DropPlanData.getDropPlanConfig(cfg.m_iBigBossDropId2);
        let cnt = 0;
        if (null != dropCfg) {
            cnt = dropCfg.m_ucDropThingNumber;
        }
        for (let i: number = 0; i < DiGongBossPanel.DisplayCount; i++) {
            let iconItem: IconItem = this.displayIcons[i];
            if (i < cnt) {
                iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
                iconItem.updateIcon();
            }
        }

        // 当前信息
        let bossCfg = MonsterData.getMonsterConfig(bossId);
        let bossInfo = fmtData.getBossOneInfo(bossId);

        this.godPower.text = TextFieldUtil.getColorText(bossCfg.m_iGodPower.toString(), Color.GREEN);
        let roles: string;
        let hurtCnt = 0;
        let roleNum = 0;
        let hpPer = 100;
        if (null != bossInfo) {
            if (bossInfo.m_stDGHurtInfo) {
                hurtCnt = bossInfo.m_stDGHurtInfo.length;
            }
            roleNum = bossInfo.m_iRoleNum;
            hpPer = Math.round(bossInfo.m_llBossHP / bossCfg.m_iHP * 100);
        }
        if (hurtCnt > 0) {
            roles = '以下玩家正在挑战：';
            for (let i = 0; i < hurtCnt; i++) {
                let hurtInfo = bossInfo.m_stDGHurtInfo[i];
                roles += '\n' + hurtInfo.m_szName;
            }
        } else {
            roles = '还没有玩家挑战Boss，快去抢占先机夺取奖励吧！';
        }
        let info = uts.format('当前人数：{0}\nBoss生命：{1}%\n\n{2}', roleNum, TextFieldUtil.getColorText(hpPer.toString(), Color.GREEN), roles);
        this.textInfo.text = info;

        let systemData = G.DataMgr.systemData;
        let pinCfg = PinstanceData.getConfigByID(Macros.PINSTANCE_ID_DIGONG);
        //let total = systemData.getPinstanceTotalTimes(pinCfg) + G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_DIGONG_NUM, G.DataMgr.heroData.curVipLevel);
        let total = systemData.getPinstanceTotalTimes(pinCfg);
        let finish = systemData.getFinishTime(Macros.PINSTANCE_ID_DIGONG);

        if (Macros.PINSTANCE_ID_DIGONG == G.DataMgr.sceneData.curPinstanceID || finish < total) {
            // 还有免费次数
            this.crtPrice = 0;
            let maxnum = Math.max(0, total - finish);
            this.textTimes.text = uts.format('剩余免费次数：{0}/{1}', TextFieldUtil.getColorText(maxnum.toString(), maxnum == 0 ? Color.WHITE : Color.GREEN), total);
        } else {
            // 需要钥匙
            let paidTimes = finish - total;
            let maxCnt = this.KeyPrices.length;
            if (paidTimes + 1 > maxCnt) {
                this.crtPrice = this.KeyPrices[maxCnt - 1];
            } else {
                this.crtPrice = this.KeyPrices[paidTimes];
            }
            this.onContainerChange(Macros.CONTAINER_TYPE_ROLE_BAG);
            this.textPrice.text = this.crtPrice.toString();
        }

        if (this.isCurLvLimited || this.crtPrice == 0) {
            this.labelBtnGo.gameObject.SetActive(true);
            this.labelBtnGoS.SetActive(false);
            this.keyGo.SetActive(false);
        } else {
            this.labelBtnGo.gameObject.SetActive(false);
            this.labelBtnGoS.SetActive(true);
            this.keyGo.SetActive(true);
        }
    }

    onContainerChange(containerID: number) {
        if (this.crtPrice > 0 && (0 == containerID || Macros.CONTAINER_TYPE_ROLE_BAG == containerID)) {
            let myMiYao = G.DataMgr.thingData.getThingNum(EnumThingID.DiGongMiYao);
            this.textTimes.text = uts.format('我的密钥：×{0}', TextFieldUtil.getColorText(myMiYao.toString(), myMiYao > 0 ? Color.GREEN : Color.RED));
        }
    }

    protected initBossData() {
        // boss列表
        let fmtArr = G.DataMgr.fmtData.fmtArr;
        let len: number = fmtArr.length;
        for (let i: number = 0; i < len; i++) {
            let config = fmtArr[i];
            if (config.m_iBigBossId) {
                let itemData: BossBaseItemData = new BossBaseItemData();
                itemData.bossId = config.m_iBigBossId;
                itemData.layer = config.m_iLayer;
                itemData.sceneId = config.m_iBigBossSceneID;
                itemData.hunliLimit = config.m_iHunliLimit;
                itemData.bigHunliLimit = config.m_iBigBossHunliLimit;
                let dropPlanConfig: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(config.m_iBigBossDropId);
                let len: number = 0;
                if (dropPlanConfig) {
                    len = dropPlanConfig.m_astDropThing.length;
                }

                let ids: number[] = [];
                for (let i: number = 0; i < len; i++) {
                    ids.push(dropPlanConfig.m_astDropThing[i].m_iDropID);
                }
                itemData.dropIds = ids;

                this.bossListDatas.push(itemData);
            }
        }
    }

    protected updateBtnGo() {
        //刷新显示
        let index = this.list.Selected;
        let itemData = this.bossListDatas[index];
        if (!itemData) {
            return;
        }
        let cfg = MonsterData.getMonsterConfig(itemData.bossId);

        if (!G.DataMgr.activityData.isActivityOpen(this.activityId)) {
            this.labelBtnGo.text = '未开启';
            UIUtils.setButtonClickAble(this.btnGo, false);
        } else {
            this.isCurLvLimited = false;
            let sceneLv = 0;
            if (itemData.sceneId > 0) {
                let sceneCfg = G.DataMgr.sceneData.getSceneInfo(itemData.sceneId).config;
                sceneLv = sceneCfg.m_ucRequiredLevel;
            }

            // if (cfg.m_usLevel > G.DataMgr.heroData.level) {
            //     this.labelBtnGo.text = uts.format('{0}级开放', cfg.m_usLevel);
            //     UIUtils.setButtonClickAble(this.btnGo, false);
            //     this.isCurLvLimited = true;
            // }
            // else
            if (sceneLv > 0 && G.DataMgr.heroData.level < sceneLv) {
                this.labelBtnGo.text = uts.format('{0}级开放', sceneLv);
                UIUtils.setButtonClickAble(this.btnGo, false);
                this.isCurLvLimited = true;
            }
            else if (itemData.bigHunliLimit > G.DataMgr.hunliData.level) {
                let des = KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, itemData.bigHunliLimit);
                this.labelBtnGo.text = uts.format('魂力达到{0}开放', des);
                UIUtils.setButtonClickAble(this.btnGo, false);
                this.isCurLvLimited = true;
            }

            if (!this.isCurLvLimited) {
                this.labelBtnGo.text = '马上挑战';
                UIUtils.setButtonClickAble(this.btnGo, true);
            }
        }
    }

    protected onBtnGoClick() {
        let index = this.list.Selected;
        if (index < 0) {
            return;
        }

        // 如boss未刷新则提示
        let softConfirmStr: string;
        let itemData = this.bossListDatas[index];
        let bossCfg = G.DataMgr.fmtData.getFmtCfgByBossId(itemData.bossId);
        if (itemData.isDead && itemData.refreshTime > 0) {
            softConfirmStr = '您欲挑战的魂兽尚未刷新，是否继续？';
        } else if (bossCfg.m_iBigExhibitionLevel > G.DataMgr.heroData.level) {
            softConfirmStr = '您欲挑战的魂兽等级较高，难度较大，是否继续？';
        }

        if (null != softConfirmStr) {
            G.TipMgr.showConfirm(softConfirmStr, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onSoftConfirm, itemData.bossId, itemData.layer));
        } else {
            this.doCheckEnter(itemData.bossId, itemData.layer);
        }
        G.GuideMgr.processGuideNext(EnumGuide.DiGongBossActive, EnumGuide.DiGongBossActive_EnterPinstance);
    }

    private onSoftConfirm(state: MessageBoxConst, isCheckSelected: boolean, bossId: number, layer: number) {
        if (MessageBoxConst.yes == state) {
            this.doCheckEnter(bossId, layer);
        }
    }

    private doCheckEnter(bossId: number, layer: number) {
        // 先检查次数
        let systemData = G.DataMgr.systemData;
        let cfg = PinstanceData.getConfigByID(Macros.PINSTANCE_ID_DIGONG);
        if (Macros.PINSTANCE_ID_DIGONG == G.DataMgr.sceneData.curPinstanceID || this.crtPrice == 0) {
            // 已经在地宫副本中不需要密钥
            this.doEnter(bossId, layer);
        } else {
            let lackNum = G.ActionHandler.getLackNum(EnumThingID.DiGongMiYao, this.crtPrice, true);
            if (0 == lackNum) {
                this.doEnter(bossId, layer);
            } else {
                G.Uimgr.createForm<BatBuyView>(BatBuyView).open(EnumThingID.DiGongMiYao, lackNum, 0, 0, 0, EnumAutoUse.DiGongMiYao);
                // G.TipMgr.addMainFloatTip('您的魔域密钥不足。');
            }
        }
    }

    private doEnter(bossId: number, layer: number) {
        G.DataMgr.runtime.waitPathingPinstanceMonsterId = bossId;
        // 如果已经在地宫副本中，使用脚本菜单进行传送
        let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
        if (Macros.PINSTANCE_ID_DIGONG == curPinstanceID) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getClickMenuRequest(curPinstanceID, Macros.MENU_DIGONG_BOSS_MIN + layer - 3));
        } else {
            G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_GUAJI, layer, bossId);
        }
        G.Uimgr.closeForm(BossView);
    }

    protected onBtnRecordClick() {
        let index = this.list.Selected;
        let itemData = this.bossListDatas[index];
        let fmtCfg = G.DataMgr.fmtData.getFmtCfgByBossId(itemData.bossId);
        let sceneData = G.DataMgr.sceneData;
        let sceneCfg = sceneData.getSceneInfo(fmtCfg.m_iBigBossSceneID);
        let content = sceneCfg.config;
        if (null != content) {
            G.Uimgr.createForm<StrategyView>(StrategyView).open(content);
        }
    }

    autoUseMiYao() {
        let index = this.list.Selected;
        let itemData = this.bossListDatas[index];
        this.doEnter(itemData.bossId, itemData.layer);
    }

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.DiGongBossActive_EnterPinstance == step) {
            this.onBtnGoClick();
            return true;
        }
        return false;
    }
}