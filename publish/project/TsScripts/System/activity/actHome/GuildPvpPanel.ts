import { Global as G, Global } from 'System/global'
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
import { ActHomeView } from 'System/activity/actHome/ActHomeView'
import { List } from '../../uilib/List';
import { GuildPvpDailyRewardView } from './GuildPvpDailyRewardView';
import { ExchangeView } from '../../business/view/ExchangeView';

/**
 * 宗门争霸赛
 * @author jesse
 *
 */
export class GuildPvpPanel extends TabSubForm {

    private btnEnter: UnityEngine.GameObject;
    private btnRewardInfo: UnityEngine.GameObject;
    private btnRule: UnityEngine.GameObject;
    private btnGetReward: UnityEngine.GameObject;
    private btnDailyRewardPreview: UnityEngine.GameObject;

    private txtName: UnityEngine.UI.Text;
    private txtNextStartTime: UnityEngine.UI.Text;

    private icon: UnityEngine.GameObject;
    private iconItem: IconItem = new IconItem();

    private model: UnityEngine.GameObject = null;
    /**角色模型*/
    private roleAvatar: UIRoleAvatar[] = [];
    private roleRoots: UnityEngine.GameObject[] = [];
    private hunhuanRoots: UnityEngine.GameObject[] = [];
    private roleBg: UnityEngine.GameObject;
    private roleBgs: UnityEngine.GameObject[] = [];
    private name: UnityEngine.GameObject;
    private names: UnityEngine.UI.Text[] = [];
    private itemIcon_Normal: UnityEngine.GameObject;

    private btnStore: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNC_KFZMZ);
    }

    protected resPath(): string {
        return UIPathData.GuildPvpPanel;
    }

    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.btnEnter = this.elems.getElement("btnEnter");
        this.btnRewardInfo = this.elems.getElement("btnRewardInfo");
        this.btnRule = this.elems.getElement("btnRule");
        this.btnGetReward = this.elems.getElement("btnGetReward");
        this.btnDailyRewardPreview = this.elems.getElement("btnDailyRewardPreview");
        this.btnStore = this.elems.getElement('btnStore');

        this.txtName = this.elems.getText("txtName");
        this.txtNextStartTime = this.elems.getText("txtNextStartTime");
        //奖励图标
        this.icon = this.elems.getElement("icon");
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);
        //人物模型，坐骑节点
        this.model = this.elems.getElement("model");
        this.roleBg = this.elems.getElement("roleBg");
        this.name = this.elems.getElement("name");
        for (let i = 0; i < 3; i++) {
            let root = this.model.transform.Find("roleRoot" + i);
            let hunhuanRoot = this.model.transform.Find('hunhuanRoot'+i);
            this.hunhuanRoots.push(hunhuanRoot.gameObject);
            this.roleAvatar[i] = new UIRoleAvatar(root, root);
            this.roleAvatar[i].setRenderLayer(5);
            this.roleAvatar[i].hasWing = true;
            let bg = this.roleBg.transform.Find("roleBg" + i).gameObject;
            this.roleBgs.push(bg);
            let txtName = ElemFinder.findText(this.name, "txtName" + i);
            txtName.text = "";
            this.names.push(txtName);
        }
        
    }

    protected initListeners() {
        this.addClickListener(this.btnEnter, this.onBtnEnter);
        this.addClickListener(this.btnRewardInfo, this.onBtnRewardInfo);
        this.addClickListener(this.btnRule, this.onBtnRule);
        this.addClickListener(this.btnGetReward, this.onBtnGetReward);
        this.addClickListener(this.btnDailyRewardPreview, this.onBtnDailyRewardPreview);
        this.addClickListener(this.btnStore, this.onClickBtnStore);
    }

    protected onOpen() {
        let iconData: ThingItemData = new ThingItemData();
        if (G.SyncTime.getDateAfterStartServer() > Constants.CORSS_GUILD_PVP_START_DAY) {
            iconData.config = ThingData.getThingConfig(10223021);
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildCrossPvpCSRequest(Macros.GUILD_PVP_PANEL_INFO));
        }
        else {
            iconData.config = ThingData.getThingConfig(10223011);
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildPvpDataRequest(Macros.GUILD_PVP_PANEL_INFO));
        }
        this.iconItem.updateByThingItemData(iconData);
        this.iconItem.updateIcon();
    }

    protected onDestroy() {
        for (let i: number = 0; i < 3; i++) {
            this.roleAvatar[i].destroy();
        }
    }

    private onBtnEnter(): void {
        G.ActionHandler.joinGuildPVP();
    }

    private onBtnRule(): void {
        G.Uimgr.createForm<GuildPvpRuleView>(GuildPvpRuleView).open();
    }

    private onBtnRewardInfo(): void {
        G.Uimgr.createForm<GuildCrossPvpRewardView>(GuildCrossPvpRewardView).open();
    }

    private onBtnGetReward(): void {
        let vo: GuildPvpData = G.DataMgr.activityData.guildPvpData;
        if (vo.isGetReward()) {
            if (G.SyncTime.getDateAfterStartServer() > Constants.CORSS_GUILD_PVP_START_DAY) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildCrossPvpCSRequest(Macros.GUILD_PVP_DO_REWARD));
            }
            else {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildPvpDataRequest(Macros.GUILD_PVP_DO_REWARD));
            }
        }
    }

    private onBtnDailyRewardPreview(): void {
        Global.Uimgr.createForm<GuildPvpDailyRewardView>(GuildPvpDailyRewardView).open();
    }

    updatePanel(): void {
        let vo: GuildPvpData = G.DataMgr.activityData.guildPvpData;

        let guildName: string = vo.data.m_szGuildName;
        if (guildName == "" || guildName == null)
            guildName = '无';
        this.txtName.text = uts.format('本届宗门:{0}', guildName);
        if (vo.isGetReward()) {
            this.btnGetReward.SetActive(true);
            this.btnDailyRewardPreview.SetActive(false);
        } else {
            this.btnGetReward.SetActive(false);
            this.btnDailyRewardPreview.SetActive(true);
        }
        let status: Protocol.ActivityStatus;
        if (G.SyncTime.getDateAfterStartServer() > Constants.CORSS_GUILD_PVP_START_DAY) {
            status = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_CROSS_GUILDPVPBATTLE);
        }
        else {
            status = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_GUILDPVPBATTLE);
        }
        if (status != null) {
            if (status.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) {
                this.txtNextStartTime.text = '火爆进行中';
            }
            else {
                this.txtNextStartTime.text = DataFormatter.second2mmddmm(vo.data.m_uiBattleNextTime);
            }
        }
        else {
            this.txtNextStartTime.text = DataFormatter.second2mmddmm(vo.data.m_uiBattleNextTime);
        }

        let battleInfos: Protocol.GuildPVPBattleInfo[] = vo.battleInfos;
        for (let i: number = 0; i < 3; i++) {
            this.names[i].text = "";
            let battleInfo: Protocol.GuildPVPBattleInfo = battleInfos[i];
            if (battleInfo != null) {
                let baseInfo: Protocol.BaseProfile = battleInfo.m_stBaseInfo;
                let avatarList: Protocol.AvatarList = battleInfo.m_stAvatarList;
                this.roleBgs[i].SetActive(false);
                //模型的显示                         
                this.roleAvatar[i].setAvataByList(avatarList, baseInfo.m_cProfession, baseInfo.m_cGender);
                this.roleAvatar[i].m_bodyMesh.playAnimation('stand');
                this.roleAvatar[i].m_rebirthMesh.setRotation(8, 0, 0);
                this.roleAvatar[i].setSortingOrder(this.sortingOrder);
                this.names[i].text = baseInfo.m_szNickName;
                let hunhuanId = avatarList.m_uiHunHuanID;
                if (hunhuanId > 0) {
                    let config = G.DataMgr.hunliData.getHunHuanConfigById(hunhuanId);
                    let url = config.m_iModelID.toString();
                    G.ResourceMgr.loadModel(this.hunhuanRoots[i].gameObject, UnitCtrlType.reactive, uts.format("model/hunhuan/{0}/{1}.prefab", url, url), this.sortingOrder);
                }
            }
            else {
                this.roleBgs[i].SetActive(true);//虚位以待
            }
        }
    }

    private onClickBtnStore() {
        // G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.MALL_HONNOR);
        // G.Uimgr.bindCloseCallback(MallView, ActHomeView, this.id);
        G.Uimgr.createForm<ExchangeView>(ExchangeView).open(EnumStoreID.MALL_HONNOR);
        G.Uimgr.bindCloseCallback(ExchangeView, ActHomeView, this.id);
    }
}
