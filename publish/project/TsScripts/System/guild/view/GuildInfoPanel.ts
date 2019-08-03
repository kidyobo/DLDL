import { Global as G } from 'System/global'
import { UILayer } from 'System/uilib/CommonForm'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { StringUtil } from 'System/utils/StringUtil'
import { ChannelClean } from 'System/chat/ChannelClean'
import { CharLenUtil } from 'System/utils/CharLenUtil'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { GuildTools } from 'System/guild/GuildTools'
import { CompareUtil } from 'System/utils/CompareUtil'
import { MenuNodeData, MenuView } from 'System/uilib/MenuView'
import { MenuNodeKey } from 'System/constants/GameEnum'
import { GuildSetPositionView } from 'System/guild/view/GuildSetPositionView'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { GuildApplicationView } from 'System/guild/view/GuildApplicationView'
import { PinstanceData } from '../../data/PinstanceData';



enum EnumGuildMemberSortType {
    /**职位*/
    position = 1,
    offline,
    lv,
    zdl,
    contribution
}

class GuildMemberItem {
    /**名字*/
    private textName: UnityEngine.UI.Text;
    /**等级*/
    private textLv: UnityEngine.UI.Text;
    /**战斗力*/
    private textZdl: UnityEngine.UI.Text;
    /**贡献度*/
    private textContribution: UnityEngine.UI.Text;
    /**离线时间*/
    private textOffline: UnityEngine.UI.Text;

    private boy: UnityEngine.GameObject;
    private girl: UnityEngine.GameObject;
    gameObject: UnityEngine.GameObject;
    /**深浅交替背景*/
    private bg2: UnityEngine.GameObject;

    updateInfoData: Protocol.GuildMemberInfo;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.textName = ElemFinder.findText(go, 'textName');
        this.textLv = ElemFinder.findText(go, 'textLv');
        this.textZdl = ElemFinder.findText(go, 'textZdl');
        this.textContribution = ElemFinder.findText(go, 'textContribution');
        this.textOffline = ElemFinder.findText(go, 'textOffline');
        this.bg2 = ElemFinder.findObject(go, 'bg2');
        this.boy = ElemFinder.findObject(go, 'gender/boy');
        this.girl = ElemFinder.findObject(go, 'gender/girl');
    }

    update(info: Protocol.GuildMemberInfo, num: number) {
        this.updateInfoData = info;
        this.textName.text = GuildTools.getMemberNameWithPosition(info.m_stBaseProfile.m_szNickName, info.m_ucGrade);
        this.textLv.text = info.m_stBaseProfile.m_usLevel.toString();
        this.textZdl.text = info.m_iFightVal.toString();
        this.textContribution.text = uts.format('{0}/{1}', info.m_uiCurGongXian, info.m_uiAccGongXian);
        if (0 == info.m_bOnline) {
            // 离线
            let onlineStr;
            if (info.m_iLogoutTime < 3600 && info.m_iLogoutTime > 0) {
                onlineStr = '1小时以内';
            } else if (info.m_iLogoutTime < 86400) {
                onlineStr = uts.format('{0}小时', Math.floor(info.m_iLogoutTime / 3600));
            } else if (info.m_iLogoutTime < 8553600) {
                onlineStr = uts.format('{0}天', Math.floor(info.m_iLogoutTime / 86400));
            } else {
                onlineStr = '离线';
            }
            this.textOffline.text = onlineStr;
        } else {
            // 在线
            this.textOffline.text = '在线';
        }
        this.textOffline.text;
        if (num % 2 == 0) {
            this.bg2.SetActive(false);
        } else {
            this.bg2.SetActive(true);
        }
        //男女显示
        if (info.m_stBaseProfile.m_cGender == 1) {
            this.boy.SetActive(true);
            this.girl.SetActive(false);
        } else if (info.m_stBaseProfile.m_cGender == 2) {
            this.boy.SetActive(false);
            this.girl.SetActive(true);
        }
    }
}

export class GuildInfoPanel extends TabSubForm {
    private readonly txtColor: string = "EFD0B5FF";

    private readonly DEFAULT_NOTICE_NO: number = 31;

    private list: List;
    private items: GuildMemberItem[] = [];

    /**名称*/
    private nameText: UnityEngine.UI.Text;
    /**等级*/
    private lvText: UnityEngine.UI.Text;
    /**宗主名字*/
    private masterText: UnityEngine.UI.Text;
    /**人数*/
    private numText: UnityEngine.UI.Text;
    /**资金*/
    private moneyText: UnityEngine.UI.Text;
    /**个人贡献*/
    private contributionText: UnityEngine.UI.Text;

    /**公告*/
    private noticeInput: UnityEngine.UI.InputField;
    /**修改公告按钮*/
    private btnEdit: UnityEngine.GameObject;
    private labelEdit: UnityEngine.UI.Text;
    private btnSet: UnityEngine.GameObject;
    private txtBtnSet: UnityEngine.UI.Text;
    private btnSetClose: UnityEngine.GameObject;
    private txtBtnSetClose: UnityEngine.UI.Text;

    /**解散宗门按钮*/
    private btnDismiss: UnityEngine.GameObject;
    private labelDismiss: UnityEngine.UI.Text;
    private btnApplications: UnityEngine.GameObject;
    private textOnlineStat: UnityEngine.UI.Text;
    /**申请列表按钮上的提示红点*/
    private objApplicationTipMark: UnityEngine.GameObject;


    private sortTypes: EnumGuildMemberSortType[] = [EnumGuildMemberSortType.position, EnumGuildMemberSortType.offline, EnumGuildMemberSortType.lv, EnumGuildMemberSortType.zdl, EnumGuildMemberSortType.contribution];
    private sortDirMap: { [type: number]: number } = {};
    private sortType2toggle: { [type: number]: UnityEngine.UI.ActiveToggle } = {};

    constructor() {
        super(KeyWord.OTHER_FUNCTION_GUILD_INFO);
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.GuildInfoView;
    }

    protected initElements() {
        super.initElements();

        this.list = this.elems.getUIList('list');
        this.nameText = this.elems.getText('nameText');
        this.lvText = this.elems.getText('lvText');
        this.masterText = this.elems.getText('masterText');
        this.numText = this.elems.getText('numText');
        this.moneyText = this.elems.getText('moneyText');
        this.contributionText = this.elems.getText('contributionText');

        this.noticeInput = this.elems.getInputField('noticeInput');
        this.noticeInput.enabled = false;
        this.btnEdit = this.elems.getElement('btnEdit');
        this.labelEdit = this.elems.getText('labelEdit');
        this.btnSet = this.elems.getElement("btnSet");
        this.txtBtnSet = this.elems.getText("txtBtnSet");
        this.btnSetClose = this.elems.getElement("btnSetClose");
        this.txtBtnSetClose = this.elems.getText("txtBtnSetClose");

        this.btnDismiss = this.elems.getElement('btnDismiss');
        this.labelDismiss = this.elems.getText('labelDismiss');
        this.textOnlineStat = this.elems.getText('textOnlineStat');
        this.btnApplications = this.elems.getElement('btnApplications');
        this.objApplicationTipMark = this.elems.getElement('objApplicationTipMark');
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnEdit, this.onClickBtnEdit);
        this.addClickListener(this.btnSet, this.onClickBtnSet);
        this.addClickListener(this.btnSetClose, this.onClickBtnSet);
        this.addClickListener(this.btnDismiss, this.onClickBtnDismiss);
        this.addClickListener(this.btnApplications.gameObject, this.onClickBtnApplications);
        this.list.onClickItem = delegate(this, this.onClickListItem);
    }

    protected onOpen() {
        super.onOpen();

        this._disableTfNotice();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchGuildAbstract());

        //宗门成员信息发生变化
        this.onGuildMembersChanged();

        this.updateGuildAbstract();
    }

    protected onClose() {
        super.onClose();
        //界面被动关闭时，同时关闭menu view
        G.Uimgr.closeForm(MenuView);
    }

    onGuildMembersChanged() {
        // 更新功能按钮的状态
        this.updateDismissBtn();
        this.updateApplicationsBtn();
        this.updateList();
    }

    onGuildInfoChanged() {
        // 拉取宗门信息
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchGuildAbstract());
        this.refreshMembers();
        this.updateGuildAbstract();
        this.onGuildMembersChanged();
    }

    refreshMembers() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchGuildMembers());
    }

    private onClickBtnApplications() {
        G.Uimgr.createForm<GuildApplicationView>(GuildApplicationView).open();
    }

    private onClickBtnDismiss() {
        //在副本中，加提示
        if (G.DataMgr.sceneData.curPinstanceID > 0) {
            let data = PinstanceData.getConfigByID(G.DataMgr.sceneData.curPinstanceID);
            if (data && data.m_ucIsOutGuildOutPinstance) {
                G.TipMgr.showConfirm("离开宗门将会强制从副本退出，是否继续？", ConfirmCheck.noCheck, '退出|取消', (stage: MessageBoxConst, isCheckSelected: boolean) => {
                    if (stage == MessageBoxConst.yes) {
                        this.tryDismiss();
                    }
                });
            }
            else {
                this.tryDismiss();
            }
        }
        else {
            this.tryDismiss();
        }
    }

    private tryDismiss() {
        let text: string;

        if (G.DataMgr.heroData.guildGrade == Macros.GUILD_GRADE_CHAIRMAN) {
            text = G.DataMgr.langData.getLang(28);
        }
        else {
            text = '确认退出本宗门吗？';
        }

        G.TipMgr.showConfirm(text, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmDismiss));
    }

    private updateDismissBtn(): void {
        let myGrade = G.DataMgr.heroData.guildGrade;
        if (myGrade == Macros.GUILD_GRADE_CHAIRMAN) {
            this.labelDismiss.text = '解散宗门';
        }
        else {
            this.labelDismiss.text = '退出宗门';
        }
    }

    /**
     * 确认退出
     * @param stage
     * @param args
     * @param isCheckSelected
     *
     */
    private onConfirmDismiss(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (stage == MessageBoxConst.yes) {
            if (G.DataMgr.heroData.guildGrade == Macros.GUILD_GRADE_CHAIRMAN) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildDisbandRequest());
            }
            else {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQuitRequest());
            }
        }
    }
    private updateApplicationsBtn() {
        let myGrade = G.DataMgr.heroData.guildGrade;
        if (myGrade == Macros.GUILD_GRADE_CHAIRMAN || myGrade == Macros.GUILD_GRADE_VICE_CHAIRMAN || myGrade == Macros.GUILD_GRADE_ELDER) {
            // 显示申请列表按钮
            this.btnApplications.gameObject.SetActive(true);
            // 申请按钮上的红点
            let applyNum: number = 0;
            if (G.DataMgr.guildData.applicationInfoList) {
                applyNum = G.DataMgr.guildData.applicationInfoList.length;
            }
            this.objApplicationTipMark.SetActive(applyNum > 0);
        }
        else {
            this.btnApplications.gameObject.SetActive(false);
        }
    }

    private updateList() {
        let allMemberNum = 0;
        let memberList = G.DataMgr.guildData.guildMemberList;
        let memberInfos: Protocol.GuildMemberInfo[];
        if (memberList != null) {
            memberInfos = memberList.m_astGuildMemberInfo;
            memberInfos.sort(this.sortMembers);
            allMemberNum = memberInfos.length;
        }
        let guildInfo = G.DataMgr.guildData.guildAbstract;
        this.list.Count = allMemberNum;
        let oldItemCnt = this.items.length;
        let onlineMemberNum = 0;
        for (let i: number = 0; i < allMemberNum; ++i) {
            if (memberInfos[i].m_bOnline > 0) {
                onlineMemberNum++;
            }
            let itemGo = this.list.GetItem(i).gameObject;
            let item: GuildMemberItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new GuildMemberItem());
                item.setComponents(itemGo);
            }
            item.update(memberInfos[i], i);
        }
        this.textOnlineStat.text = uts.format('宗门在线人数统计：{0}/{1}', onlineMemberNum, allMemberNum);
    }

    private onClickListItem(index: number) {
        if (index >= this.items.length) {
            return;
        }

        let memberInfo = this.items[index].updateInfoData;
        if (!CompareUtil.isRoleIDEqual(memberInfo.m_stRoleID, G.DataMgr.heroData.roleID)) {
            let menuNodes: MenuNodeData[] = [];
            G.ActionHandler.getRoleMenu(menuNodes, memberInfo.m_stRoleID, memberInfo.m_bOnline > 0, true, true, true, false);

            if (G.DataMgr.guildData.guildAbstract.m_ushGrade == Macros.GUILD_GRADE_CHAIRMAN) {
                menuNodes.push(new MenuNodeData(MenuNodeKey.GUILD_SET_VICE, null, memberInfo.m_stRoleID));
            }

            if (G.DataMgr.guildData.isManager) {
                menuNodes.push(new MenuNodeData(MenuNodeKey.GUILD_KICK, null, memberInfo.m_stRoleID));
            }
            G.Uimgr.createForm<MenuView>(MenuView).open(memberInfo.m_stBaseProfile.m_szNickName, uts.format('{0}级', memberInfo.m_stBaseProfile.m_usLevel), menuNodes, delegate(this, this.onClickMenu));
        }
    }

    /**更新宗门信息*/
    private updateGuildAbstract(): void {
        let guildInfo = G.DataMgr.guildData.guildAbstract;
        if (null == guildInfo) {
            this.noticeInput.text = G.DataMgr.langData.getLang(this.DEFAULT_NOTICE_NO);
            return;
        }
        this.nameText.text = guildInfo.m_szGuildName;
        this.masterText.text = uts.format('现任宗主：{0}', TextFieldUtil.getColorText(guildInfo.m_stLeaderList.m_astGuildMemberInfo[0].m_stBaseProfile.m_szNickName, this.txtColor));
        let guildConfig: GameConfig.GuildLevelM = G.DataMgr.guildData.getGuildLevelConfig(guildInfo.m_ucGuildLevel);
        this.numText.text = '宗门人数：' + TextFieldUtil.getColorText(uts.format("{0}/{1}", guildInfo.m_ucMemberNumber, guildConfig.m_uchMan.toString()), this.txtColor);
        this.lvText.text = uts.format('宗门等级：{0}', TextFieldUtil.getColorText(guildInfo.m_ucGuildLevel.toString(), this.txtColor));

        // 当前宗门累计资金
        this.moneyText.text = uts.format('当日资金：{0}', TextFieldUtil.getColorText(guildInfo.m_uiAccGuildMoney.toString(), this.txtColor));
        //个人贡献
        this.contributionText.text = uts.format("个人贡献：{0}", TextFieldUtil.getColorText(G.DataMgr.heroData.guildDonateTotal.toString(), this.txtColor));
        //this.contributionText.text = uts.format("个人贡献：{0}", TextFieldUtil.getColorText(guildInfo., this.txtColor));
        // 更新公告
        if (!this.noticeInput.enabled) {
            if (StringUtil.isEmpty(guildInfo.m_szDeclaration)) {
                this.noticeInput.text = G.DataMgr.langData.getLang(this.DEFAULT_NOTICE_NO);
            }
            else {
                this.noticeInput.text = guildInfo.m_szDeclaration;
            }
        }
        this.btnEdit.gameObject.SetActive(G.DataMgr.heroData.isManager && guildInfo.m_ucGuildLevel >= Macros.MIN_SETINFO_GUILD_LEVEL);
        let isAutoJoin = G.DataMgr.guildData.guildAbstract.m_ucAutoJoin == Macros.GUILD_AUTO_JOIN_BIT_AUTO;
        this.btnSet.SetActive(isAutoJoin && G.DataMgr.heroData.isManager2);
        this.btnSetClose.SetActive(!isAutoJoin && G.DataMgr.heroData.isManager2);
        this.txtBtnSet.text = "审核*" + TextFieldUtil.getColorText("关闭", Color.GREEN);
        this.txtBtnSetClose.text = "审核*" + TextFieldUtil.getColorText("开启", Color.RED);
    }

    private onClickMenu(selectedNode: MenuNodeData) {
        let index = this.list.Selected;
        if (index >= this.items.length) {
            return;
        }

        let memberInfo = this.items[index].updateInfoData;
        if (selectedNode.key == MenuNodeKey.GUILD_SET_VICE) {
            G.Uimgr.createForm<GuildSetPositionView>(GuildSetPositionView).open(memberInfo);
        }
        else if (selectedNode.key == MenuNodeKey.GUILD_REVOKE_VICE) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildGradeSetRequest(memberInfo.m_stRoleID, Macros.GUILD_GRADE_MEMBER));
        }
        else if (selectedNode.key == MenuNodeKey.GUILD_KICK) {
            G.TipMgr.showConfirm(uts.format('确定将{0}驱逐出宗门吗？', memberInfo.m_stBaseProfile.m_szNickName), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onKickConfirm, memberInfo.m_stRoleID));
        }
        else {
            let roleAbstract = new RoleAbstract();
            roleAbstract.adaptFromGuildMemberInfo(memberInfo);
            G.ActionHandler.onRoleMenu(roleAbstract, selectedNode.key);
        }
    }

    /**
	* 踢人
	* @param args
	* @param state
	*
	*/
    private onKickConfirm(state: MessageBoxConst, isCheckSelected: boolean, roleID: Protocol.RoleID): void {
        if (state == MessageBoxConst.yes) {
            // 发送请求
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKickGuildMemberRequest(roleID));
        }
    }

    private onClickBtnEdit() {
        if (!this.noticeInput.enabled) {
            // 非编辑状态下
            this.noticeInput.enabled = true;
            this.noticeInput.ActivateInputField();

            this.labelEdit.text = '确定修改';
            if (this.noticeInput.text == G.DataMgr.langData.getLang(this.DEFAULT_NOTICE_NO)) {
                this.noticeInput.text = '';
            }
        }
        else {
            let declaration: string = this.noticeInput.text;
            if (ChannelClean.isAdMsg(declaration)) {
                G.TipMgr.addMainFloatTip('公告中含有违禁信息，请检查。');
                return;
            }
            else if (CharLenUtil.getStringLen(declaration) >= Macros.MAX_GUILD_TEXT_LENGTH) {
                G.TipMgr.addMainFloatTip('宗门公告不能超过60个汉字');
                return;
            }

            this._disableTfNotice();

            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildSetInfoRequest(declaration));
        }
    }

    /**
     * 禁止编辑公告文本
     *
     */
    private _disableTfNotice(): void {
        this.noticeInput.enabled = false;
        this.labelEdit.text = '修改公告';
    }


    private onClickBtnSet() {
        let isAutoJoin = G.DataMgr.guildData.guildAbstract.m_ucAutoJoin == Macros.GUILD_AUTO_JOIN_BIT_AUTO;
        let macros: number;
        if (isAutoJoin) {
            macros = Macros.GUILD_AUTO_JOIN_BIT_NONE;
        } else {
            macros = Macros.GUILD_AUTO_JOIN_BIT_AUTO;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildJoinSetRequest(macros));
    }


    /**
     * 排序
     * @param data1
     * @param data2
     * @return
     *
     */
    private sortMembers(data1: Protocol.GuildMemberInfo, data2: Protocol.GuildMemberInfo): number {
        //职位第一
        let posLevel1: number = GuildTools.getPosLevel(data1.m_ucGrade);
        let posLevel2: number = GuildTools.getPosLevel(data2.m_ucGrade);
        if (posLevel1 != posLevel2) {
            //职位 1宗主 2副宗主 3成员 4长老
            return posLevel1 - posLevel2 < 0 ? -1 : 1;
        }
        else if (data1.m_bOnline != data2.m_bOnline) {
            //在线状态优先
            return data1.m_bOnline ? -1 : 1;
        }
        else if (data1.m_iFightVal != data2.m_iFightVal) {
            //战斗力
            return data1.m_iFightVal - data2.m_iFightVal < 0 ? 1 : -1;
        }
        else if (data1.m_stBaseProfile.m_usLevel != data2.m_stBaseProfile.m_usLevel) {
            //等级
            return data1.m_stBaseProfile.m_usLevel - data2.m_stBaseProfile.m_usLevel < 0 ? 1 : -1;
        }
        if (data1.m_uiAccDonate != data2.m_uiAccDonate) {
            //捐献
            return data1.m_uiAccDonate - data2.m_uiAccDonate < 0 ? 1 : -1;
        }


        // let cnt = this.sortTypes.length;
        // for (let i = 0; i < cnt; i++) {
        //     let type = this.sortTypes[i];
        //     if (EnumGuildMemberSortType.position == type) {
        //         let posLevel1: number = GuildTools.getPosLevel(data1.m_ucGrade);
        //         let posLevel2: number = GuildTools.getPosLevel(data2.m_ucGrade);
        //         if (posLevel1 != posLevel2) {
        //             return posLevel1 - posLevel2;
        //         }
        //     } else if (EnumGuildMemberSortType.offline == type) {
        //         if (data1.m_bOnline != data2.m_bOnline) {
        //             return (data1.m_iLogoutTime - data2.m_iLogoutTime) /** this.sortDirMap[type]*/;
        //         }
        //     } else if (EnumGuildMemberSortType.zdl == type) {
        //         if (data1.m_iFightVal != data2.m_iFightVal) {
        //             return (data1.m_iFightVal - data2.m_iFightVal) /* * this.sortDirMap[type]*/;
        //         }
        //     }
        //     else if (EnumGuildMemberSortType.lv == type) {
        //         if (data1.m_stBaseProfile.m_usLevel != data2.m_stBaseProfile.m_usLevel) {
        //             return (data1.m_stBaseProfile.m_usLevel - data2.m_stBaseProfile.m_usLevel)/* * this.sortDirMap[type]*/;
        //         }
        //     } else if (EnumGuildMemberSortType.contribution == type) {
        //         if (data1.m_uiAccDonate != data2.m_uiAccDonate) {
        //             return (data1.m_uiAccDonate - data2.m_uiAccDonate) /** this.sortDirMap[type]*/;
        //         }
        //     }
        // }
        // return 0;
    }


}