import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { EnumGuide } from 'System/constants/GameEnum'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { DataFormatter } from 'System/utils/DataFormatter'
import { KillTipView } from 'System/main/view/KillTipView'
import { VipView } from 'System/vip/VipView'
import { FuLiDaTingView } from 'System/activity/fldt/FuLiDaTingView'
import { KaiFuHuoDongView } from 'System/activity/kaifuhuodong/KaiFuHuoDongView'
import { BossView } from 'System/pinstance/boss/BossView'
import { FriendView, FriendViewTab } from 'System/friend/FriendView'
import { GuaJiRewardView } from 'System/deputy/view/GuaJiRewardView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { EquipView } from 'System/equip/EquipView'
import { VipTab } from 'System/vip/VipView'
import { PetView } from 'System/pet/PetView'
import { WuXiaHuanXingView } from 'System/equip/WuXiaHuanXingView'
import { GuildView } from "System/guild/view/GuildView"
import { EnumGuildJingPaiSubTab } from 'System/guild/view/GuildJingPaiPanel'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'


export class NoticeCtrl {
    private gameObject: UnityEngine.GameObject;

    private btnKill: UnityEngine.GameObject;
    private btnDefeated: UnityEngine.GameObject;
    private btnKilled: UnityEngine.GameObject;

    private btnVip: UnityEngine.GameObject;
    private btnFuLiDaTing: UnityEngine.GameObject;
    private btnBossReward: UnityEngine.GameObject;
    private btnOverdue: UnityEngine.GameObject;
    private btnLiXianGuaJiStat: UnityEngine.GameObject;
    private btnLiXianGuaJi: UnityEngine.GameObject;
    private btnMail: UnityEngine.GameObject;
    private btnEquipCollect: UnityEngine.GameObject;
    private btnPetZhenTu: UnityEngine.GameObject;
    private btnPaiMai: UnityEngine.GameObject;
    private btnJinJieRi: UnityEngine.GameObject;
    private btnBossZhaoHuan: UnityEngine.GameObject;

    private positions: UnityEngine.Vector3[] = [];
    private startPos: UnityEngine.Vector3;

    private m_fuLiDaTingFuncId = 0;

    private m_liXianGuaJiStatInfo: Protocol.CSOffGuajiInfo;

    /**被杀提醒列表*/
    private m_killedNotifies: Protocol.CSBeKilled_Notify[] = [];
    /**杀人列表*/
    private m_killNotifies: Protocol.CSBeKilled_Notify[] = [];
    /**败字提醒列表*/
    private m_failedNotifies: Protocol.CSBeKilled_Notify[] = [];

    private tweenMap: { [btnName: string]: Tween.TweenPosition } = {};

    private isStarted = false;
    private buttonsShown: UnityEngine.GameObject[] = [];

    private lastShowButtonAt = 0;
    private tweenOffset = 0;
    private tweenDuration = 0.8;

    private noMoreLiXianGuaJi = false;

    /**为了防止重复提示*/
    private overdueFlag: { [type: number]: boolean } = {};
    private privilegeOverdueFlag = false;
    /**拍卖需要打开的tab*/
    private guildOpenTab: EnumGuildJingPaiSubTab;


    private btn_jiXianTiaoZhan: UnityEngine.GameObject;


    setView(uiElems: UiElements) {
        this.gameObject = uiElems.getElement('noticeCtrl');

        let noticeElems = uiElems.getUiElements('noticeCtrl');

        this.btnKill = noticeElems.getElement('btnKill');
        this.btnKilled = noticeElems.getElement('btnKilled');
        this.btnDefeated = noticeElems.getElement('btnDefeated');

        this.btnVip = noticeElems.getElement('btnVip');
        this.btnFuLiDaTing = noticeElems.getElement('btnFuLiDaTing');
        this.btnBossReward = noticeElems.getElement('btnBossReward');
        this.btnOverdue = noticeElems.getElement('btnOverdue');
        this.btnLiXianGuaJiStat = noticeElems.getElement('btnLiXianGuaJiStat');
        this.btnLiXianGuaJi = noticeElems.getElement('btnLiXianGuaJi');
        this.btnMail = noticeElems.getElement('btnMail');
        this.btnEquipCollect = noticeElems.getElement('btnEquipCollect');
        this.btnPetZhenTu = noticeElems.getElement('btnPetZhenTu');
        this.btnPaiMai = noticeElems.getElement('btnPaiMai');
        this.btnJinJieRi = noticeElems.getElement('btnJinJieRi');
        this.btn_jiXianTiaoZhan = noticeElems.getElement('btnJiXianTiaoZhan');
        this.btnBossZhaoHuan = noticeElems.getElement('btnBossZhaoHuan');

        this.btnKill.SetActive(false);
        this.btnKilled.SetActive(false);
        this.btnDefeated.SetActive(false);

        this.btnVip.SetActive(false);
        this.btnFuLiDaTing.SetActive(false);
        this.btnBossReward.SetActive(false);
        this.btnOverdue.SetActive(false);
        this.btnLiXianGuaJiStat.SetActive(false);
        this.btnLiXianGuaJi.SetActive(false);
        this.btnMail.SetActive(false);
        this.btnEquipCollect.SetActive(false);
        this.btnPetZhenTu.SetActive(false);
        this.btnPaiMai.SetActive(false);
        this.btnJinJieRi.SetActive(false);
        this.btn_jiXianTiaoZhan.SetActive(false);
        this.btnBossZhaoHuan.SetActive(false);

        //btnBossReward没放入下面数组，需要移动到最后，不然出现中间空一个
        this.positions.push(this.btnKill.transform.position, this.btnKilled.transform.position, this.btnDefeated.transform.position,
            this.btnVip.transform.position, this.btnFuLiDaTing.transform.position, this.btnOverdue.transform.position, this.btnLiXianGuaJiStat.transform.position,
            this.btnLiXianGuaJi.transform.position, this.btnMail.transform.position, this.btnEquipCollect.transform.position, this.btnPetZhenTu.transform.position,
            this.btnPaiMai.transform.position, this.btnJinJieRi.transform.position);
        this.positions.sort(delegate(this, this.sortPositions));
        this.startPos = noticeElems.getRectTransform('startPos').position;

        // ui锚点设置不当，为避免新包更新，此处暂时用代码修正
        if (G.ScreenScaleMgr.NeedAgainSetScreenScale) {
            for (let pos of this.positions) {
                pos.x += 1;
            }
        }

        Game.UIClickListener.Get(this.btnKill).onClick = delegate(this, this.onClickBtnKill);
        Game.UIClickListener.Get(this.btnKilled).onClick = delegate(this, this.onClickBtnKilled);
        Game.UIClickListener.Get(this.btnDefeated).onClick = delegate(this, this.onClickBtnDefeated);

        Game.UIClickListener.Get(this.btnVip).onClick = delegate(this, this.onClickBtnVip);
        Game.UIClickListener.Get(this.btnFuLiDaTing).onClick = delegate(this, this.onClickBtnFuLiDaTing);
        Game.UIClickListener.Get(this.btnBossReward).onClick = delegate(this, this.onClickBtnBossReward);
        Game.UIClickListener.Get(this.btnOverdue).onClick = delegate(this, this.onClickBtnOverdue);
        // Game.UIClickListener.Get(this.btnLiXianGuaJiStat).onClick = delegate(this, this.onClickBtnLiXianGuaJiStat);
        // Game.UIClickListener.Get(this.btnLiXianGuaJi).onClick = delegate(this, this.onClickBtnLiXianGuaJi);
        Game.UIClickListener.Get(this.btnMail).onClick = delegate(this, this.onClickBtnMail);
        Game.UIClickListener.Get(this.btnEquipCollect).onClick = delegate(this, this.onClickBtnEquipCollect);
        Game.UIClickListener.Get(this.btnPetZhenTu).onClick = delegate(this, this.onClickBtnZhenTu);
        Game.UIClickListener.Get(this.btnPaiMai).onClick = delegate(this, this.onClickbtnPaiMai);
        Game.UIClickListener.Get(this.btnJinJieRi).onClick = delegate(this, this.onClickbtnJinJieRi);
        Game.UIClickListener.Get(this.btn_jiXianTiaoZhan).onClick = delegate(this, this.onClickBtnJiXianTiaoZhan);
        Game.UIClickListener.Get(this.btnBossZhaoHuan).onClick = delegate(this, this.onClickBtnBossZhaoHuan);
    }

    private sortPositions(a: UnityEngine.Vector3, b: UnityEngine.Vector3): number {
        return a.x - b.x;
    }

    start() {
        if (this.isStarted) {
            return;
        }
        this.isStarted = true;

        this.processDefeated();
        // this.processNormalKilled();
        this.checkHasNormalKill();
        this.checkNormalKilled();

        this.checkVip();
        this.checkFuLiDaTing();
        this.onKfhdBossChanged();
        this.checkOverDue();
        // this.checkLiXianGuaJiStat();
        // this.checkLiXianGuaJi();
        this.checkEmail();
        //this.checkEquipCollect();
        this.checkPaiMai();
        this.checkJinJieRi();
        this.checkJiXianTiaoZhan();
        this.checkBossZhaoHuan();
    }

    onFunctionUnlock(newFuncs: GameConfig.NPCFunctionLimitM[]) {
        for (let cfg of newFuncs) {
            if (cfg.m_iParentName == KeyWord.ACT_FUNCTION_FLDT) {
                this.checkFuLiDaTing();
            } else if (KeyWord.OTHER_FUNCTION_LIXIANGUAJI == cfg.m_iName) {
                // this.checkLiXianGuaJi();
            }
        }
    }


    onContainerChange(type: number) {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.checkPetZhenTu();
            // this.checkShiZhuang();
        }
    }

    private showButton(btn: UnityEngine.GameObject) {
        if (this.buttonsShown.indexOf(btn) >= 0) {
            return;
        }

        btn.SetActive(true);

        let now = UnityEngine.Time.realtimeSinceStartup;
        if (now - this.lastShowButtonAt < 0.8) {
            this.tweenOffset -= 10;
            this.tweenDuration -= 0.02;
        } else {
            this.tweenOffset = 0;
            this.tweenDuration = 0.8;
        }
        this.lastShowButtonAt = now;
        let endPos = this.positions[this.buttonsShown.length];
        let tween = this.tweenMap[btn.name];
        if (tween) {
            tween.to = endPos;
        } else {
            btn.transform.position = G.getCacheV3(this.startPos.x + this.tweenOffset, this.startPos.y, this.startPos.z);
            //龙珠位置
            tween = Tween.TweenPosition.Begin(btn, this.tweenDuration, endPos, true);
            tween.onFinished = delegate(this, this.onTweenFinished, btn.name);
            this.tweenMap[btn.name] = tween;
        }
        this.buttonsShown.push(btn);
    }

    private onTweenFinished(btnName: string) {
        delete this.tweenMap[btnName];
    }

    private hideButton(btn: UnityEngine.GameObject) {
        let index = this.buttonsShown.indexOf(btn);
        if (index < 0) {
            return;
        }

        btn.SetActive(false);
        // 将左侧的按钮左移
        let count = this.buttonsShown.length;
        for (let i = index + 1; i < count; i++) {
            let tmpBtn = this.buttonsShown[i];
            let endPos = this.positions[i - 1];
            let tween = this.tweenMap[tmpBtn.name];
            if (tween) {
                tween.to = endPos;
            } else {
                tween = Tween.TweenPosition.Begin(tmpBtn, 0.4, endPos, true);
                tween.onFinished = delegate(this, this.onTweenFinished, tmpBtn.name);
                this.tweenMap[tmpBtn.name] = tween;
            }
        }
        this.buttonsShown.splice(index, 1);
    }

    ///////////////////////////// 福利大厅 //////////////////

    checkVip() {
        if (!this.isStarted) {
            return;
        }
        if (G.DataMgr.vipData.canVipShine()) {
            this.showButton(this.btnVip);
        } else {
            this.hideButton(this.btnVip);
        }
    }

    private onClickBtnVip() {
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.Reward);
    }

    ///////////////////////////// boss悬赏 //////////////////

    ///////////////////////////// 福利大厅 //////////////////

    checkFuLiDaTing() {
        if (!this.isStarted) {
            return;
        }

        let funcId = 0;
        if (TipMarkUtil.dailySign()) {
            // 每日签到
            funcId = KeyWord.OTHER_FUNCTION_MRQD;
        } else if (TipMarkUtil.onlineGift()) {
            // 领在线礼包
            funcId = KeyWord.OTHER_FUNCTION_ZXJL;
        } else if (TipMarkUtil.levelGift()) {
            // 升级礼包
            funcId = KeyWord.OTHER_FUNCTION_SJLB;
        } else if (TipMarkUtil.ziYuanZhaoHui()) {
            // 资源找回
            funcId = KeyWord.OTHER_FUNCTION_ZYZH;
        } else if (TipMarkUtil.shouChongTuanGou()) {
            // 首充团购
            funcId = KeyWord.OTHER_FUNCTION_KFHD_SCTG;
        }

        this.m_fuLiDaTingFuncId = funcId;
        if (funcId > 0) {
            this.showButton(this.btnFuLiDaTing);
        } else {
            this.hideButton(this.btnFuLiDaTing);
        }
    }

    private onClickBtnFuLiDaTing() {
        if (KeyWord.OTHER_FUNCTION_KFHD_SCTG == this.m_fuLiDaTingFuncId) {
            G.Uimgr.createForm<KaiFuHuoDongView>(KaiFuHuoDongView).open(this.m_fuLiDaTingFuncId);
        } else {
            G.Uimgr.createForm<FuLiDaTingView>(FuLiDaTingView).open(this.m_fuLiDaTingFuncId);
        }
    }

    ///////////////////////////// boss悬赏 //////////////////

    onKfhdBossChanged() {
        if (!this.isStarted) {
            return;
        }
        if (TipMarkUtil.kfhdBoss()) {
            this.showButton(this.btnBossReward);
        } else {
            this.hideButton(this.btnBossReward);
        }
    }

    private onClickBtnBossReward() {
        if (Macros.PINSTANCE_ID_DIGONG != G.DataMgr.sceneData.curPinstanceID) {
        } else {
            G.TipMgr.addMainFloatTip('请先离开地宫副本再执行此操作。');
        }
    }

    ///////////////////////////// 离线挂机 //////////////////

    // onLiXianGuaJiNotify() {
    //     let info = G.DataMgr.systemData.offGuajiInfo;
    //     if (info.m_iUseTime > 0) {
    //         // 有统计数据，缓存起来
    //         this.m_liXianGuaJiStatInfo = uts.deepcopy(info, this.m_liXianGuaJiStatInfo);
    //         this.checkLiXianGuaJiStat();
    //     }

    //     this.checkLiXianGuaJi();
    // }

    // private checkLiXianGuaJi() {
    //     if (!this.isStarted) {
    //         return;
    //     }
    //     // 离线挂机时间不足1小时，显示【挂】
    //     if (!this.noMoreLiXianGuaJi && G.DataMgr.systemData.GuajiLeftTime < 3600 && G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_LIXIANGUAJI)) {
    //         this.showButton(this.btnLiXianGuaJi);
    //     } else {
    //         this.hideButton(this.btnLiXianGuaJi);
    //     }
    // }

    // private checkLiXianGuaJiStat() {
    //     if (!this.isStarted) {
    //         return;
    //     }
    //     // 离线挂机时间不足1小时，显示【挂】
    //     if (null != this.m_liXianGuaJiStatInfo) {
    //         this.showButton(this.btnLiXianGuaJiStat);
    //     } else {
    //         this.hideButton(this.btnLiXianGuaJiStat);
    //     }
    // }

    // private onClickBtnLiXianGuaJi() {
    //     G.GuideMgr.tryGuide(EnumGuide.LiXianGuaJi, 0, false, 0, false);
    //     this.noMoreLiXianGuaJi = true;
    //     this.hideButton(this.btnLiXianGuaJi);
    // }

    // private onClickBtnLiXianGuaJiStat() {
    //     // G.Uimgr.createForm<GuaJiRewardView>(GuaJiRewardView).open(this.m_liXianGuaJiStatInfo);
    //     this.m_liXianGuaJiStatInfo = null;
    //     this.hideButton(this.btnLiXianGuaJiStat);
    // }

    ///////////////////////////// 邮件通知 //////////////////

    checkEmail() {
        if (!this.isStarted) {
            return;
        }
        let mailData = G.DataMgr.mailData;
        if (mailData.checkEmailBitMap() || mailData.checkEmailHasNotRed()) {
            this.showButton(this.btnMail);
        } else {
            this.hideButton(this.btnMail);
        }
    }

    private onClickBtnMail() {
        //默认打开第一封没读取的邮件即可
        if (G.ActionHandler.checkCrossSvrUsable(false, KeyWord.SUBBAR_FUNCTION_HAOYOU)) {
            let emailId: number = 0;
            if (G.DataMgr.mailData.notRedEmails.length != 0) {
                emailId = G.DataMgr.mailData.notRedEmails[0].m_uiMailID;
            }
            else {
                emailId = G.DataMgr.mailData.mailList[0].m_uiMailID;
            }
            G.Uimgr.createForm<FriendView>(FriendView).open(FriendViewTab.EmailPanel, null, emailId);
        } else {
            G.TipMgr.addMainFloatTip('跨服中不能使用邮件功能');
        }

    }
    ///////////////////////////////////神装收集////////////////////////////////

    private onClickBtnEquipCollect() {
        G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
    }

    checkEquipCollect() {
        if (!this.isStarted) {
            return;
        }

        if (G.ActionHandler.checkCrossSvrUsable(false, KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) && G.DataMgr.equipStrengthenData.getEquipCollectCurrentCanActiveStage()) {
            this.showButton(this.btnEquipCollect);
        } else {
            this.hideButton(this.btnEquipCollect);
        }
    }

    //////////////////////////////////////////////////伙伴光印////////////////////////////////

    private onClickBtnZhenTu() {
        G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_ZHENTU);
    }

    checkPetZhenTu() {
        if (!this.isStarted) {
            return;
        }

        if (G.ActionHandler.checkCrossSvrUsable(false, KeyWord.OTHER_FUNCTION_PET_ZHENTU) && G.DataMgr.petData.petZhenTuCanShowTipMark()) {
            this.showButton(this.btnPetZhenTu);
        } else {
            this.hideButton(this.btnPetZhenTu);
        }
    }




    ///////////////////////////// 物品过期 //////////////////

    checkOverDue() {
        if (!this.isStarted) {
            return;
        }
        let heroData = G.DataMgr.heroData;
        let overdueData = heroData.overDueData;
        if ((overdueData && overdueData.m_usType == Macros.LINGBAO_IMAGE && undefined == this.overdueFlag[overdueData.m_usType])/* || (heroData.privilegeOverdueLv > 0 && !this.privilegeOverdueFlag)*/) {
            this.showButton(this.btnOverdue);
        } else {
            this.hideButton(this.btnOverdue);
        }
    }

    private onClickBtnOverdue() {
        let heroData = G.DataMgr.heroData;
        let overdueData = heroData.overDueData;
        if (overdueData) {
            G.GuideMgr.tryGuide(EnumGuide.OverDue, 0, false, 0, false);
            this.overdueFlag[overdueData.m_usType] = true;
        }
        //else if (heroData.privilegeOverdueLv > 0) {
        //    G.GuideMgr.tryGuide(EnumGuide.PrivilegeOverdue, 0, false, 0, false);
        //    this.privilegeOverdueFlag = true;
        //}
        this.checkOverDue();
    }

    ///////////////////////////// 失败记录 //////////////////
    addFailedNotify(notify: Protocol.CSBeKilled_Notify): void {
        this.m_failedNotifies.push(notify);
        if (this.isStarted) {
            this.processDefeated();
        }
    }

    /**更新失败记录*/
    private processDefeated(): void {
        if (this.m_failedNotifies.length > 0) {
            this.showButton(this.btnDefeated);
        } else {
            this.hideButton(this.btnDefeated);
        }
    }

    ////////////////////////// 普通被杀 //////////////////////
    //addNormalKilledNotify(notify: Protocol.CSBeKilled_Notify): void {
    //    this.m_killedNotifies.push(notify);
    //    if (this.isStarted) {
    //        this.processNormalKilled();
    //    }
    //}

    checkNormalKilled() {
        if (!this.isStarted)
            return;

        let killMeRoleIDList = G.DataMgr.heroData.killMeRoleIDList;
        if (killMeRoleIDList.length > 0) {
            this.m_killedNotifies = killMeRoleIDList;
            this.showButton(this.btnKilled);
        }
        else {
            this.hideButton(this.btnKilled);
        }
    }


    //private processNormalKilled(): void {
    //    if (this.m_killedNotifies.length > 0) {
    //        this.showButton(this.btnKilled);
    //    } else {
    //        this.hideButton(this.btnKilled);
    //    }
    //}

    /////////////////////////极限挑战////////////////////////////
    private titleLv: number = 0;
    updateJiXianTiaoZhanNotice(titleLv: number = 0) {
        this.titleLv = titleLv;
        this.checkJiXianTiaoZhan();
    }

    private checkJiXianTiaoZhan() {
        if (!this.isStarted) {
            return;
        }
        if (this.titleLv > 0) {
            this.showButton(this.btn_jiXianTiaoZhan);
        } else {
            this.hideButton(this.btn_jiXianTiaoZhan);
        }
        this.titleLv = 0;
    }

    private onClickBtnJiXianTiaoZhan() {
        this.hideButton(this.btn_jiXianTiaoZhan);
        G.TipMgr.showConfirm("您在极限挑战榜中失去了之前的头街!", ConfirmCheck.noCheck, '确定');
    }

    ///////////////////////杀人记录/////////////////////////

    checkHasNormalKill() {
        if (!this.isStarted)
            return;

        let myKillRoleList = G.DataMgr.heroData.myKillRoleList;
        if (myKillRoleList.length > 0) {
            this.m_killNotifies = myKillRoleList;
            this.showButton(this.btnKill);
        }
        else {
            this.hideButton(this.btnKill);
        }
    }


    //addNormalKillNotify(notify: Protocol.CSBeKilled_Notify): void {
    //    this.m_killNotifies.push(notify);
    //    if (this.isStarted) {
    //        this.processNormalKill();
    //    }
    //}

    //private processNormalKill(): void {
    //    if (this.m_killNotifies.length > 0) {
    //        this.showButton(this.btnKill);
    //    } else {
    //        this.hideButton(this.btnKill);
    //    }
    //}

    private onClickBtnKill() {
        // this.hideButton(this.btnKill);
        let notifies = this.m_killNotifies.concat();
        // this.m_killNotifies.length = 0;
        G.Uimgr.createForm<KillTipView>(KillTipView).open(notifies);
    }

    private onClickBtnDefeated() {
        this.hideButton(this.btnDefeated);
        let notifies = this.m_failedNotifies.concat();
        this.m_failedNotifies.length = 0;
        G.Uimgr.createForm<KillTipView>(KillTipView).open(notifies);
    }

    private onClickBtnKilled() {
        let notifies = this.m_killedNotifies.concat();
        G.Uimgr.createForm<KillTipView>(KillTipView).open(notifies);
    }


    checkPaiMai(openTab = EnumGuildJingPaiSubTab.guild) {
        if (!this.isStarted) {
            return;
        }
        this.guildOpenTab = openTab;
        if (G.ActionHandler.checkCrossSvrUsable(false, KeyWord.OTHER_FUNCTION_GUILD_JINGPAI) && G.DataMgr.runtime.paiMaiNeedTip) {
            this.showButton(this.btnPaiMai);
        } else {
            this.hideButton(this.btnPaiMai);
        }
    }

    private onClickbtnPaiMai() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_GUILD_JINGPAI, 0, 0, this.guildOpenTab);
    }

    checkJinJieRi() {
        if (!this.isStarted) {
            return;
        }
        if (G.DataMgr.kfhdData.canGetJinJieRiReward() &&
            (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JJR_RANK) ||
                G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JJR_RANK_AFTER7DAY))) {
            this.showButton(this.btnJinJieRi);
        } else {
            this.hideButton(this.btnJinJieRi);
        }
    }

    private onClickbtnJinJieRi() {
        let funcId = 0;
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JJR_DUIHUAN)) {
            funcId = KeyWord.OTHER_FUNCTION_JJR_RANK;
        } else {
            funcId = KeyWord.OTHER_FUNCTION_JJR_RANK_AFTER7DAY;
        }
        G.ActionHandler.executeFunction(funcId);
    }

    ////////////////boss召唤////////////////////////////
    checkBossZhaoHuan() {
        if (!this.isStarted) {
            return;
        }
        if (G.ActionHandler.checkCrossSvrUsable(false, KeyWord.OTHER_FUNCTION_BOSS_SUMMON) && G.DataMgr.activityData.BOSSZhanHuanData.isHasZhaoHuanBoss() /*TipMarkUtil.BossZhaoHuan()*/) {
            this.showButton(this.btnBossZhaoHuan);
        } else {
            this.hideButton(this.btnBossZhaoHuan);
        }
    }

    private onClickBtnBossZhaoHuan() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_BOSS_SUMMON, 0, 0, 0);
    }

    setActive(value: boolean) {
        this.gameObject.SetActive(value);
    }
}