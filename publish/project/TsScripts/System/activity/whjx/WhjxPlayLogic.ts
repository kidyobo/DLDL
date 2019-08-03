import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { ThingData } from 'System/data/thing/ThingData'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { WhjxData } from 'System/data/activities/WhjxData'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { DataFormatter } from 'System/utils/DataFormatter'
import { WhjxBaseLogic } from 'System/activity/whjx/WhjxBaseLogic'

class WhjxRoleAvatarItem {
    private cfg: GameConfig.WHJXCfgM;

    private roleBg: UnityEngine.GameObject;
    private roleInfo: Protocol.CSWHJXZoneRole;
    private textName: UnityEngine.UI.Text;
    private state: UnityEngine.GameObject;
    private textZdl: UnityEngine.UI.Text;
    private textTime: UnityEngine.UI.Text;
    private avatarRoot: UnityEngine.RectTransform;
    private roleAvatar: UIRoleAvatar;
    private title: UnityEngine.GameObject;

    private oldUin = 0;
    private logic: WhjxPlayLogic;

    constructor(logic: WhjxPlayLogic) {
        this.logic = logic;
    }

    setCfg(cfg: GameConfig.WHJXCfgM) {
        this.cfg = cfg;
        // 战斗力
        this.textZdl.text = uts.format('战力要求：{0}万', Math.round(cfg.m_iFight / 10000));
        // 加载称号
        let thingCfg = ThingData.getThingConfig(cfg.m_stItemList[0].m_iID);
        let titleCfg = G.DataMgr.titleData.getDataConfig(thingCfg.m_iFunctionID);
        if (titleCfg) {
            G.ResourceMgr.loadModel(this.title, UnitCtrlType.chenghao, titleCfg.m_uiImageID.toString(), 0);
        } else {
            uts.logWarning(" 没有称号配置 ， TitleListConfig，id  =  " + thingCfg.m_iFunctionID + "  cfg.m_stItemList[0].m_iID  " + cfg.m_stItemList[0].m_iID);
        }
    }

    setComponents(go: UnityEngine.GameObject) {
        this.textName = ElemFinder.findText(go, 'textName');
        this.state = ElemFinder.findObject(go, 'state');
        this.textZdl = ElemFinder.findText(go, 'zdlBg/textZdl');
        this.textTime = ElemFinder.findText(go, 'zdlBg/textTime');
        this.title = ElemFinder.findObject(go, 'title');
        this.roleBg = ElemFinder.findObject(go, 'roleBg');
        this.avatarRoot = ElemFinder.findRectTransform(go, 'avatarRoot');

        let hotArea = ElemFinder.findObject(go, 'hotArea');
        Game.UIClickListener.Get(hotArea).onClick = delegate(this, this.onClickHotArea);
    }

    update(roleInfo: Protocol.CSWHJXZoneRole, isActivityOn: boolean, sortingOrder: number) {
        this.roleInfo = roleInfo;
        let ri = null != roleInfo ? roleInfo.m_stSimRoleInfo : null;
        // 这里先set active false，不然可能位置不会刷新
        if (null != ri && ri.m_stID.m_uiUin > 0) {
            this.textName.text = ri.m_stBaseProfile.m_szNickName;
            this.textName.gameObject.SetActive(true);
            //this.textTime.text = DataFormatter.second2hhmmss(roleInfo.m_uiHoleTime);

            if (null == this.roleAvatar) {
                this.roleAvatar = new UIRoleAvatar(this.avatarRoot, this.avatarRoot);
            }

            if (this.oldUin != ri.m_stID.m_uiUin) {
                this.oldUin = ri.m_stID.m_uiUin;
                this.roleAvatar.setAvataByList(ri.m_stAvatarList, ri.m_stBaseProfile.m_cProfession, ri.m_stBaseProfile.m_cGender);
                this.roleAvatar.m_rebirthMesh.setRotation(8, 0, 0);
            }
            this.roleAvatar.setSortingOrder(sortingOrder);
            this.roleAvatar.setActive(true);
            this.roleBg.SetActive(false);
            this.state.SetActive(isActivityOn && Macros.WHJX_PK_STATUS_NONE != roleInfo.m_uiStatus);
        } else {
            this.oldUin = 0;
            this.textName.gameObject.SetActive(false);
            this.textTime.text = '未占领';
            if (null != this.roleAvatar) {
                this.roleAvatar.setActive(false);
            }
            this.roleBg.SetActive(true);
            this.state.SetActive(false);
        }
    }

    updateTime(seconds: number) {
        this.textTime.text = DataFormatter.second2hhmmss(seconds);
    }

    protected onClickHotArea() {
        // 只有活动期间且报名了才能打，如果已经占有某职位了就不能再打了
        let activityData = G.DataMgr.activityData;
        if (activityData.isActivityOpen(Macros.ACTIVITY_ID_WHJX)) {
            if (activityData.whjxData.panelInfo.m_iBuyItemID > 0) {
                let myType = activityData.whjxData.getMyType();
                if (myType == 0) {
                    // 需检查玩家战斗力
                    if (G.DataMgr.heroData.fight >= this.cfg.m_iFight) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWangHouJiangXiangRequest(Macros.CROSS_WHJX_APPLY_PK, this.cfg.m_iType));
                        activityData.whjxData.beginWaitAt = UnityEngine.Time.realtimeSinceStartup;
                        this.logic.showWait(true);
                    } else {
                        G.TipMgr.addMainFloatTip('您的战斗力未达要求');
                    }
                } else if (myType != this.cfg.m_iType) {
                    G.TipMgr.addMainFloatTip(uts.format('您已占据{0}，不能挑战其他职位', KeyWord.getDesc(KeyWord.GROUP_WHJX_TYPE, myType)));
                }
            } else {
                G.TipMgr.addMainFloatTip('您未参加本次活动报名，无法挑战');
            }
        } else {
            G.TipMgr.addMainFloatTip('活动尚未开始');
        }
    }

    destroyAvatar() {
        this.oldUin = 0;
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }
}

export class WhjxPlayLogic extends WhjxBaseLogic {
    static readonly AvatarCnt = 7;

    private roles: WhjxRoleAvatarItem[] = [];
    private cdView: UnityEngine.GameObject;
    private textCd: UnityEngine.UI.Text;
    private textPrice: UnityEngine.UI.Text;
    private textRule: UnityEngine.UI.Text;

    private waitView: UnityEngine.GameObject;
    private textCountDown: UnityEngine.UI.Text;

    private btnCleanCd: UnityEngine.GameObject;

    private cdSeconds = 0;
    private price = 0;

    private cleanCdBasePrice = 0;
    private cleanCdStepPrice = 0;
    private cleanCdMaxPrice = 0;

    private lastListPanelAt = 0;

    initElements(go: UnityEngine.GameObject, elems: UiElements) {
        super.initElements(go, elems);

        this.cdView = elems.getElement('cdView');
        this.textCd = elems.getText('textCd');
        this.waitView = elems.getElement('waitView');
        this.textCountDown = elems.getText('textCountDown');
        this.btnCleanCd = elems.getElement('btnCleanCd');
        this.textPrice = elems.getText('textPrice');
        this.textRule = elems.getText('textRule');

        let whjxData = G.DataMgr.activityData.whjxData;
        for (let i = 0; i < WhjxPlayLogic.AvatarCnt; i++) {
            let role = elems.getElement('role' + i);
            let avatarItem = new WhjxRoleAvatarItem(this);
            avatarItem.setComponents(role);
            avatarItem.setCfg(whjxData.getCfgByType(WhjxData.Types[i]));
            this.roles[i] = avatarItem;
        }

        this.cleanCdBasePrice = G.DataMgr.constData.getValueById(KeyWord.PARAM_WHJX_CD_BASE_PRICE);
        this.cleanCdStepPrice = G.DataMgr.constData.getValueById(KeyWord.PARAM_WHJX_CD_ADD_PRICE);
        this.cleanCdMaxPrice = G.DataMgr.constData.getValueById(KeyWord.PARAM_WHJX_CD_MAX_PRICE);
    }

    initListeners() {
        super.initListeners();
        Game.UIClickListener.Get(this.btnCleanCd).onClick = delegate(this, this.onclickBtnCleanCd);
    }

    onOpen() {
        this.onPanelResponse();
        this.checkWait();
        this.onActivityStatusChange();
    }

    private onclickBtnCleanCd() {
        if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.price, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWangHouJiangXiangRequest(Macros.CROSS_WHJX_CDCLEAN, 0));
        }
    }

    onPanelResponse() {
        let activityData = G.DataMgr.activityData;
        let whjxData = activityData.whjxData;
        let panelInfo = whjxData.panelInfo;
        let cnt = 0;
        let cdSeconds = 0;
        if (null != panelInfo && null != panelInfo.m_stZoneData) {
            cnt = panelInfo.m_stZoneData.m_iCount;
            let cdTime = panelInfo.m_uiCDTimeStamp;
            if (cdTime > 0) {
                let now = Math.round(G.SyncTime.getCurrentTime() / 1000);
                cdSeconds = cdTime - now;
            }
        }
        let slapse = UnityEngine.Time.realtimeSinceStartup - whjxData.panelUpdateAt;
        let isOn = activityData.isActivityOpen(Macros.ACTIVITY_ID_WHJX);
        for (let i = 0; i < WhjxPlayLogic.AvatarCnt; i++) {
            if (i < cnt) {
                let roleInfo = panelInfo.m_stZoneData.m_stWHJXRoleList[i];
                this.roles[i].update(roleInfo, isOn, this.view.sortingOrder);
                if (roleInfo.m_stSimRoleInfo.m_stID.m_uiUin > 0) {
                    this.roles[i].updateTime(roleInfo.m_uiHoleTime + slapse);
                }
            } else {
                this.roles[i].update(null, isOn, this.view.sortingOrder);
            }
        }
        // 是否显示cd
        if (cdSeconds > 0) {
            this.cdSeconds = cdSeconds;
            this.price = Math.min(this.cleanCdMaxPrice, this.cleanCdBasePrice + this.cleanCdStepPrice * panelInfo.m_iCDCleanCount);
            this.textCd.text = this.cdSeconds.toString();
            this.textPrice.text = this.price.toString();
            this.cdView.SetActive(true);
        } else {
            this.cdSeconds = 0;
            this.cdView.SetActive(false);
        }
    }

    onApplyResultResponse(result: number) {
        if (Macros.WHJX_APPLY_RESULT_APPLYAGAIN != result) {
            this.showWait(false);
        }
        if (Macros.WHJX_APPLY_RESULT_WIN == result) {
            this.listPanelInfo(true);
        }
    }

    onApplyDealResponse(opVal: number) {
        if (0 == opVal) {
            // 自己认输
            this.listPanelInfo(true);
        }
    }

    onCleanCdResponse() {
        this.cdView.SetActive(false);
    }

    private checkWait() {
        let whjxData = G.DataMgr.activityData.whjxData;
        let now = UnityEngine.Time.realtimeSinceStartup;
        let waitSeconds = Math.round(whjxData.beginWaitAt + Macros.WHJX_MAX_APPLY_WAIT_TIME - now);
        if (waitSeconds > 0) {
            this.textCountDown.text = waitSeconds.toString();
        } else {
            this.showWait(false);
        }
    }

    onActivityStatusChange() {
        this.listPanelInfo(true);
        this.updateTick();
    }

    private updateTick() {
        let now = G.SyncTime.getCurrentTime();
        let activityData = G.DataMgr.activityData;
        let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_WHJX);
        if (activityData.isActivityOpen(Macros.ACTIVITY_ID_WHJX)) {
            let rest = Math.max(0, status.m_iEndTime - Math.round(now / 1000));
            this.textRule.text = uts.format('各路豪杰激烈争夺中，距离活动结束还有：{0}', DataFormatter.second2hhmmss(rest));
        } else {
            let tmpDate = G.SyncTime.tmpDate;
            tmpDate.setTime(status.m_iStartTime * 1000);
            let d = G.SyncTime.serverDate;
            if (tmpDate.getMonth() == d.getMonth() && tmpDate.getDate() == d.getDate()) {
                // 说明活动还没开始
                let rest = Math.max(0, Math.round(status.m_iStartTime - now / 1000));
                this.textRule.text = uts.format('争夺开启倒计时：{0}', DataFormatter.second2hhmmss(rest));
            } else {
                let rest = Math.max(0, Math.round((G.SyncTime.getNextTime(0, 0, 0) - now) / 1000 + (5 - d.getDay()) * 86400));
                this.textRule.text = uts.format('争夺结束，距下次报名开启：{0}', DataFormatter.second2day(rest));
            }
        }
    }

    private listPanelInfo(force: boolean) {
        let now = UnityEngine.Time.realtimeSinceStartup;
        if (force || now - this.lastListPanelAt > 4) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWangHouJiangXiangRequest(Macros.CROSS_WHJX_PANNLE, 0));
            this.lastListPanelAt = now;
        }
    }

    onTickTimer(timer: Game.Timer) {
        let activityData = G.DataMgr.activityData;
        let whjxData = activityData.whjxData;
        if (this.cdSeconds > 0) {
            this.cdSeconds -= timer.CallCountDelta;
            if (this.cdSeconds > 0) {
                this.textCd.text = this.cdSeconds.toString();
            } else {
                this.cdView.SetActive(false);
            }
        }
        this.checkWait();
        this.updateTick();

        if (activityData.isActivityOpen(Macros.ACTIVITY_ID_WHJX)) {
            let panelInfo = whjxData.panelInfo;
            let cnt = 0;
            if (null != panelInfo && null != panelInfo.m_stZoneData) {
                cnt = panelInfo.m_stZoneData.m_iCount;
            }
            let slapse = UnityEngine.Time.realtimeSinceStartup - whjxData.panelUpdateAt;
            for (let i = 0; i < cnt; i++) {
                let roleInfo = panelInfo.m_stZoneData.m_stWHJXRoleList[i];
                if (roleInfo.m_stSimRoleInfo.m_stID.m_uiUin > 0) {
                    this.roles[i].updateTime(roleInfo.m_uiHoleTime + slapse);
                }
            }
            // 每隔一段时间拉去一下面板状态
            this.listPanelInfo(false);
        }
    }

    showWait(isShow: boolean) {
        this.waitView.SetActive(isShow);
    }

    destroyAvatar() {
        for (let i = 0; i < WhjxPlayLogic.AvatarCnt; i++) {
            this.roles[i].destroyAvatar();
        }
    }
}