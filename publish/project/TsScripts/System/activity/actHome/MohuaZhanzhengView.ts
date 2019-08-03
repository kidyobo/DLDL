import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { Constants } from 'System/constants/Constants'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { ThingData } from 'System/data/thing/ThingData'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { GuildPvpData } from 'System/data/GuildPvpData'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar"
import { GuildPvpRuleView } from "System/activity/actHome/GuildPvpRuleView"
import { GuildCrossPvpRewardView } from "System/activity/actHome/GuildCrossPvpRewardView"
import { UnitCtrlType, GameIDType, SceneID, EnumStoreID } from 'System/constants/GameEnum'
import { MallView } from 'System/business/view/MallView'
import { CompareUtil } from 'System/utils/CompareUtil'
import { List, ListItem } from 'System/uilib/List'
import { DropPlanData } from 'System/data/DropPlanData'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'

/**
 * 魔化战争
 * @author hearyw
 *
 */
class MohuaZhanzhengItem {

    private index: number = 0;
    private roleName: UnityEngine.UI.Text;
    private lvText: UnityEngine.UI.Text;
    private roleZdl: UnityEngine.UI.Text;
    private rolebg: UnityEngine.GameObject;
    private lvbg: UnityEngine.GameObject;
    private zdl: UnityEngine.GameObject;
    private lv: UnityEngine.GameObject;

    private roleInfo: Protocol.MHZZSvrInfo;
    crtRoleID: Protocol.RoleID;
    private roleAvatar: UIRoleAvatar;

    setUsual(go: UnityEngine.GameObject, order: number, index: number) {
        this.index = index;
        this.roleName = ElemFinder.findText(go, 'txtName');
        this.lvText = ElemFinder.findText(go, 'lv/lvText');
        this.roleZdl = ElemFinder.findText(go, 'zdl/Text');
        this.rolebg = ElemFinder.findObject(go, 'roleBg');
        this.lvbg = ElemFinder.findObject(go, 'lv/lvBg');
        this.zdl = ElemFinder.findObject(go, 'zdl');
        this.lv = ElemFinder.findObject(go, 'lv');

        if (null == this.roleAvatar) {
            let modelCtn = ElemFinder.findTransform(go, 'roleRoot');
            this.roleAvatar = new UIRoleAvatar(modelCtn, modelCtn);
            this.roleAvatar.setSortingOrder(order);
            this.roleAvatar.hasWing = true;
        }
    }

    destroy() {
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }
    /**
     * 活动开启刷新信息
     * @param roleInfo
     */
    update(roleInfo: Protocol.MHZZSvrInfo) {
        this.roleInfo = roleInfo;
        this.lvText.text = uts.format('Lv.{0}', roleInfo.m_stSimRoleInfo.m_stBaseProfile.m_usLevel);
        this.roleZdl.text = roleInfo.m_iRoleFight.toString();

        if (null != this.crtRoleID && CompareUtil.isRoleIDEqual(this.crtRoleID, roleInfo.m_stSimRoleInfo.m_stID)) {
            return;
        }
        this.crtRoleID = uts.deepcopy(roleInfo.m_stSimRoleInfo.m_stID, this.crtRoleID);
        let name: string = roleInfo.m_stSimRoleInfo.m_stBaseProfile.m_szNickName;
        this.roleAvatar.setAvataByList(roleInfo.m_stSimRoleInfo.m_stAvatarList, roleInfo.m_stSimRoleInfo.m_stBaseProfile.m_cProfession, roleInfo.m_stSimRoleInfo.m_stBaseProfile.m_cGender);
        if (this.index == 0) {
            this.roleName.text = TextFieldUtil.getColorText(name, Color.RED);
        }
        else {
            this.roleName.text = TextFieldUtil.getColorText(name, Color.YELLOW);
        }

        this.updateItem(true);
    }
    /**
     * 活动未开启，无显示内容
     */
    updateWhenNoInfo() {
        this.updateItem(false);
    }
    /**
     * 显示与不显示
     * @param hasInfo
     */
    updateItem(hasInfo: boolean) {
        this.lv.SetActive(hasInfo);
        this.zdl.SetActive(hasInfo);
        this.roleName.gameObject.SetActive(hasInfo);
        this.rolebg.SetActive(!hasInfo);
        if (!hasInfo) {
            this.destroy();
        }
    }
}


export class MohuaZhanzhengView extends TabSubForm {

    private btnEnter: UnityEngine.GameObject;
    private txtNextStartTime: UnityEngine.UI.Text;
    private txtBossSvr: UnityEngine.UI.Text;
    private icon: UnityEngine.GameObject;
    private btnRule: UnityEngine.GameObject;

    private rewardList: List;

    /**四个模型相关东西*/
    private roles: MohuaZhanzhengItem[] = [];

    private static readonly MAX_NUM: number = 4;
    private static readonly DROP_ID: number = 60111117;

    constructor() {
        super(KeyWord.OTHER_FUNC_MHZZ);
    }

    protected resPath(): string {
        return UIPathData.MohuaZhanzhengView;
    }

    protected initElements() {
        this.btnEnter = this.elems.getElement("btnEnter");
        this.txtNextStartTime = this.elems.getText("txtNextStartTime");
        this.txtBossSvr = this.elems.getText('tf2');
        this.btnRule = this.elems.getElement('btnrule');
        //奖励图标
        this.rewardList = this.elems.getUIList('rewardList');
        
        
    }

    protected initListeners() {
        this.addClickListener(this.btnEnter, this.onBtnEnter);
        this.addClickListener(this.btnRule, this.onBtnRuleClick);
    }

    private onBtnRuleClick() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(427), '魔化战争');
    }

    protected onOpen() {
        // 4个角色
        for (let i: number = 0; i < MohuaZhanzhengView.MAX_NUM; i++) {
            let roleItem = new MohuaZhanzhengItem();
            let itemGo = this.elems.getElement('role' + i);
            roleItem.setUsual(itemGo, this.sortingOrder, i);
            this.roles.push(roleItem);
        }

        // 刷新奖励
        let dropConfig: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(MohuaZhanzhengView.DROP_ID);
        let oldIconCnt = this.rewardList.Count;
        let len = dropConfig.m_astDropThing.length;
        this.rewardList.Count = dropConfig.m_astDropThing.length;
        let iconItem: IconItem;
        for (let i: number = 0; i < len; i++) {
            let item = this.rewardList.GetItem(i);
            if (i < oldIconCnt) {
                iconItem = this.rewardList[i];
            }
            else {
                this.rewardList[i] = iconItem = new IconItem();
                iconItem.setUsuallyIcon(item.gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateById(dropConfig.m_astDropThing[i].m_iDropID, dropConfig.m_astDropThing[i].m_uiDropNumber);
            iconItem.updateIcon();
        }

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMohuaZhanzhengOpenPanelRequest());
    }

    protected onDestroy() {
        for (let i: number = 0; i < MohuaZhanzhengView.MAX_NUM; i++) {
            this.roles[i].destroy();
        }
    }

    private onBtnEnter(): void {
        if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_MHZZ)) {
            G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_MHZZ, 0, 0);
        }
        else {
            G.TipMgr.addMainFloatTip("活动尚未开启");
        }
    }

    updatePanel(response: Protocol.MHZZ_Pannel_Response): void {
        let status = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_MHZZ);
        if (status != null) {
            if (status.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) {
                if (response.m_iCount < 1) {
                    this.txtNextStartTime.text = '参与服务器数量不足两个，活动未开启';
                    for (let i = 0; i < MohuaZhanzhengView.MAX_NUM; i++) {
                        this.roles[i].updateWhenNoInfo();
                    }
                    UIUtils.setButtonClickAble(this.btnEnter, false);
                    this.txtBossSvr.text = "活动尚未开启";
                }
                else {
                    this.txtNextStartTime.text = '火爆进行中';
                    UIUtils.setButtonClickAble(this.btnEnter, true);

                    this.roles[0].update(response.m_stMainSvrInfo);
                    for (let i = 0; i < MohuaZhanzhengView.MAX_NUM-1; i++) {
                        if (i < response.m_iCount) {
                            this.roles[i+1].update(response.m_stSlaveSvrList[i]);
                        }
                        else {
                            this.roles[i+1].updateWhenNoInfo();
                        }
                    }
                    let guildName: string = response.m_stMainSvrInfo.m_iSvrID + " 服";
                    this.txtBossSvr.text = guildName;
                }
            }
            else {
                this.txtNextStartTime.text = uts.format('下次活动开启时间：{0}', TextFieldUtil.getColorText(DataFormatter.second2mmddmm(status.m_iNextTime), Color.GREEN));
                for (let i = 0; i < MohuaZhanzhengView.MAX_NUM; i++) {
                    this.roles[i].updateWhenNoInfo();
                }
                UIUtils.setButtonClickAble(this.btnEnter, false);
                this.txtBossSvr.text = "活动尚未开启";
            }
        }
        else {
            this.txtNextStartTime.text = this.getTimeStr();

            for (let i = 0; i < MohuaZhanzhengView.MAX_NUM; i++) {
                this.roles[i].updateWhenNoInfo();
            }

            this.txtBossSvr.text = "活动尚未开启";
            for (let i = 0; i < MohuaZhanzhengView.MAX_NUM; i++) {
                this.roles[i].updateWhenNoInfo();
            }
            UIUtils.setButtonClickAble(this.btnEnter, false);
        }
    }

    private getTimeStr(): string {
        let str: string;
        let cfg: GameConfig.ActivityConfigM = G.DataMgr.activityData.getActivityConfig(Macros.ACTIVITY_ID_MHZZ);
        let timeLimCfg: GameConfig.TimeLimitConfigM = G.DataMgr.activityData.getTimeLimitConfigByID(cfg.m_iTimeLimitID);
        if (G.SyncTime.getDateAfterStartServer() <= 7) {
            str = uts.format('开服7天后，{0}{1}开启', DataFormatter.days[parseFloat(timeLimCfg.m_szOpenWeekDay)%7], timeLimCfg.m_dtOpenTimes[0]);
        }
        else {
            str = uts.format('每{0}{1}开启', DataFormatter.days[parseFloat(timeLimCfg.m_szOpenWeekDay) % 7], timeLimCfg.m_dtOpenTimes[0]);
        }
        return str;
    }
}
