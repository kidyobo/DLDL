import { SevenDayView } from './../../activity/fldt/sevenDayLogin/SevenDayView';
import { TitleCanUseTipView } from 'System/achieveMent/TitleCanUseTipView';
import { BuffListView } from 'System/buff/BuffListView';
import { Compatible } from "System/Compatible";
import { Constants } from 'System/constants/Constants';
import { UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { SkillData } from 'System/data/SkillData';
import { UIPathData } from "System/data/UIPathData";
import { ZhufuData } from 'System/data/ZhufuData';
import { Global as G } from "System/global";
import { EnumGuildJingPaiSubTab } from 'System/guild/view/GuildJingPaiPanel';
import { HeroView } from 'System/hero/view/HeroView';
import { PropertyView } from 'System/hero/view/PropertyView';
import { WybqView } from 'System/hero/view/WybqView';
import { DownloadView } from 'System/main/view/DownloadView';
import { HeroInfoCtrl } from 'System/main/view/HeroInfoCtrl';
import { MainChatCtrl } from 'System/main/view/mainChatCtrl';
import { NewFunctionTrailerCtrl } from 'System/main/view/NewFunctionTrailerCtrl';
import { OtherInfoCtrl } from 'System/main/view/OtherInfoCtrl';
import { MapView } from 'System/map/view/MapView';
//import { FengMoTaBossCtrl } from 'System/pinstance/fmt/FengMoTaBossCtrl';
import { PinstanceOperateView } from 'System/pinstance/PinstanceOperateView';
import { PinstanceStatView } from 'System/pinstance/PinstanceStatView';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TaskTrackList } from 'System/quest/TaskTrackList';
import { MyTeamView } from "System/team/MyTeamView";
import { TeamMembersPanel } from 'System/team/TeamMembersPanel';
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager';
import { ActionBar } from 'System/uilib/ActionBar';
import { GameObjectGetSet, TextGetSet, UILayer } from "System/uilib/CommonForm";
import { FixedList } from 'System/uilib/FixedList';
import { IconItem } from 'System/uilib/IconItem';
import { NestedForm } from "System/uilib/NestedForm";
import { SkillIconItem } from 'System/uilib/SkillIconItem';
import { ElemFinder } from 'System/uilib/UiUtility';
import { HeroController } from "System/unit/hero/HeroController";
import { MonsterController } from 'System/unit/monster/MonsterController';
import { UnitController } from 'System/unit/UnitController';
import { Color } from 'System/utils/ColorUtil';
import { DataFormatter } from 'System/utils/DataFormatter';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { TimeInterval } from 'System/utils/TimeInterval';
import { UIUtils } from 'System/utils/UIUtils';
import { UnitUtil } from 'System/utils/UnitUtil';
import { EquipCollectCtrl } from 'System/main/view/EquipCollectCtrl'
import { BigSkillShowView, TeQuanBuyPanelType } from 'System/vip/BigSkillShowView';
import { VipView } from 'System/vip/VipView';
import { MessageTipView } from "../../activity/view/MessageTipView";
import { ResultType } from '../../channel/ChannelDef';
import { KaiFuHuoDongView } from 'System/activity/kaifuhuodong/KaiFuHuoDongView'
import { NewFuncPreCtrl } from 'System/main/view/NewFuncPreCtrl'
import { SaiJiProgressCtrl } from 'System/main/view/SaiJiProgressCtrl'

enum LeftFunctionTag {
    Task = 0,
    Team = 1,
}

export enum EnumMainViewChild {
    pinstanceStat = 1,
    tianChi,
    fengmotaStat,
    pinstanceOperate,
    diGong,
    siXiangBattle,
    petExpeditionBattle,
    bwdhBattle,
}

//主界面窗口
export class MainView extends NestedForm {
    ////////////////////////面板右上角相关(位置,截屏等)///////
    /**当前地图国家文本显示*/
    private cityText: TextGetSet = null;
    /**电池电量*/
    private batteryLevel: GameObjectGetSet = null;
    private batteryRed: GameObjectGetSet;
    /**时钟*/
    private clock: TextGetSet = null;
    //////////////////////任务相关///////////////////////////
    private taskTeam: GameObjectGetSet = null;
    private taskTeamContent: GameObjectGetSet;
    private btnOpenTaskTeam: GameObjectGetSet;
    private btnCloseTaskTeam: GameObjectGetSet;
    private btnVip: GameObjectGetSet;
    /**任务List*/
    taskTrackList: TaskTrackList;
    /**队伍List*/
    private teamMembersPanel: TeamMembersPanel;
    /**是否需要刷新队伍*/
    private isTeamDirty = false;
    /**任务,组队*/
    private taskNormal: GameObjectGetSet;
    private taskSelected: GameObjectGetSet;
    private teamNormal: GameObjectGetSet;
    private teamSelected: GameObjectGetSet;
    //////////////////////技能,摇杆//////////////////////////
    private readonly nuQiSkillIdx = 4;
    private readonly petSkillIdx = 5;
    private readonly MaxPinSkillCnt = 3;
    private btnTab: GameObjectGetSet;
    public skillList: FixedList;
    /**经验副本vip体验技能*/
    private experienceSkill: UnityEngine.GameObject;
    /**vip体验技能时间文本*/
    private txtExperienceVIP: TextGetSet;
    /**vip体验技能时间文本倒计时*/
    private m_experienceVIPTime: number = 0;
    private skillIconImgs: UnityEngine.UI.RawImage[] = [];
    private skillCdImgs: UnityEngine.UI.Image[] = [];
    private skillCdImgObjs: UnityEngine.GameObject[] = [];
    private vipSkillCdImg: UnityEngine.UI.Image;
    private vipSkillCdImgObj: UnityEngine.GameObject;
    private skillTweens: Tween.TweenImageFillAmount[] = [];
    private skillCdOvers: UnityEngine.GameObject[] = [];
    private skills: GameConfig.SkillConfigM[] = [];
    private skillCdRemains: number[] = [];
    private skillCdTimes: number[] = [];
    private vipSkillCdRemain: number;
    private vipSkillCdTime: number;
    private petNuQi: UnityEngine.UI.Image;
    private petNuQiAnim: GameObjectGetSet;
    private petSkillGuide: GameObjectGetSet;

    private activitySkillRect: GameObjectGetSet;
    private activitySkillIcons: SkillIconItem[] = [];
    private profSkillMap: { [branchID: number]: GameConfig.SkillConfigM[] } = null;
    private max_skillNum: number = 6;
    /**摇杆*/
    private joyStickLsn: Game.JoystickListener;
    ////////////////////经验条//////////////////////////////
    private expBarArea: GameObjectGetSet = null;
    actionBarItem: ActionBar = null;
    private starsArea: GameObjectGetSet;
    //////////////////////其他///////////////////////////////
    /**角色信息控制器，包括血条、vip等*/
    heroInfoCtrl: HeroInfoCtrl;
    private otherInfoCtrl: OtherInfoCtrl;
    private role: HeroController;
    //fmtBossCtrl: FengMoTaBossCtrl;
    //用于隐藏显示主界面
    private root: GameObjectGetSet;
    /**挂机按钮*/
    private btn_guaJi: GameObjectGetSet;
    private hangup: GameObjectGetSet;
    private noHangup: GameObjectGetSet;

    /**变强按钮*/
    private btnStrong: GameObjectGetSet;
    private strongGuide: GameObjectGetSet;
    private textTipCnt: TextGetSet;
    private btnStrongEndPos: GameObjectGetSet;
    private btnStrongStartPos: GameObjectGetSet;
    mainChatCtrl: MainChatCtrl;
    //newFunctionTrailerCtrl: NewFunctionTrailerCtrl;

    newFuncPreCtrl: NewFuncPreCtrl;
    /**主界面上时钟更新时间间隔60秒*/
    private clockInterval: TimeInterval = new TimeInterval(60);
    private attack_jianIcon: GameObjectGetSet;
    private attack_daoIcon: GameObjectGetSet;
    private roleRect: GameObjectGetSet;
    private mainFuncs: GameObjectGetSet;
    private normalSkillNode: GameObjectGetSet;
    private controlRect: GameObjectGetSet;
    private equipCollect: GameObjectGetSet;
    autoDownloadRequest: Game.DownloadRequest = null;
    private downloadFlag = 1;
    /**wifi信号*/
    private wifiSignals: GameObjectGetSet[] = [];
    private wifiLv = -1;
    /** 电量更新时间间隔 */
    private batteryInterval: TimeInterval = new TimeInterval(60);

    /**装备收集进度*/
    private equipCollectCtrl: EquipCollectCtrl;
    private saiJiProgressCtrl: SaiJiProgressCtrl;
    /**多人Boss可显示的点数 */
    private vipDescNode:GameObjectGetSet;
    private vipNum:TextGetSet;
    private btnAddNum:GameObjectGetSet;

    /**ping值信号显示相关图片,文本框*/
    private ping: UnityEngine.UI.Text = null;
    private _pingValue: number = -1;
    private set pingValue(value: number) {
        if (this._pingValue != value) {
            this._pingValue = value;
            this.ping.text = uts.format('{0}ms', value);
        }
    }

    /**经验文本框*/
    private txtExp: TextGetSet;

    private set txtExpValue(value: number) {
        let data = G.DataMgr.heroData;
        if (value == 0) {
            value = data.getProperty(Macros.EUAI_CUREXP);
        }
        let maxExp = G.DataMgr.roleAttributeData.getConfig(data.level).m_uiExperience;
        this.txtExp.text = uts.format("Exp {0}%", Math.floor(value / maxExp * 100));
    }

    private oldTipCnt = -1;
    private oldBatLv = -1;


    /**vip技能描述*/
    private vipSkillIcon: UnityEngine.GameObject;
    private vipSkillBack: UnityEngine.GameObject;

    /**每日13点宗门竞拍截至*/
    private readonly LeftTimeToTipGuildPaiMai = 11 * 60 * 60;
    /**每日16点宗门竞拍截至*/
    private readonly LeftTimeToTipWorldPaiMai = 8 * 60 * 60;
    /**结束前30分钟*/
    private readonly MaxSpaceTime = 30 * 60;

    private getbackexp: TextGetSet;
    private btnGetback: GameObjectGetSet;

    private btn_Record: GameObjectGetSet;
    private btnRecordText: TextGetSet;

    private backMask: GameObjectGetSet;
    //显示迷雾特效的节点
    private DenseFogRoot: GameObjectGetSet;

    constructor() {
        super(1);
        this.openSound = null;
        this.closeSound = null;
        this.needCheckScreenScale = true;
    }

    protected onOpen() {
        this.btn_Record.SetActive(G.ChannelSDK.ShowBtnRecord);
        this.addTimer("resUnloader", 180000, 0, this.resUnloaderTimer);
        this.addTimer("main", 500, 0, this.onUpdateTimer);
        //this.newFunctionTrailerCtrl.updateView();
        this.onClickTaskNormal();
        //界面上一些一次性更新
        this.heroInfoCtrl.onSceneChange();
        let hiddleAttack: boolean = G.DataMgr.heroData.profession == KeyWord.PROFTYPE_WARRIOR;
        this.attack_daoIcon.SetActive(hiddleAttack);
        this.attack_jianIcon.SetActive(!hiddleAttack);
        this.actionBarItem.onExpChange(0, false);
        //装备收集
        this.equipCollectCtrl.updateEquipCollectProgress();
        this.onVipSkillIconDataChange();
        this.txtExpValue = 0;
        this.backMask.SetActive(G.ScreenScaleMgr.NeedAgainSetScreenScale);
    }

    protected onClose() {
    }

    layer(): UILayer {
        return UILayer.Base;
    }
    protected resPath(): string {
        return UIPathData.MainView;
    }

    protected initElements(): void {
        // 左上角角色信息
        this.heroInfoCtrl = new HeroInfoCtrl();
        this.heroInfoCtrl.setView(this.elems);
        // 左上角其他角色信息
        this.otherInfoCtrl = new OtherInfoCtrl();
        this.otherInfoCtrl.setView(this.elems);
        //好友
        this.mainChatCtrl = new MainChatCtrl();
        this.mainChatCtrl.setView(this.elems);
        ////新功能预告
        //this.newFunctionTrailerCtrl = new NewFunctionTrailerCtrl();
        //this.newFunctionTrailerCtrl.setView(this.elems);

        //新功能预告
        this.newFuncPreCtrl = new NewFuncPreCtrl();
        this.newFuncPreCtrl.setView(this.elems);

        //// 黑洞塔boss
        //this.fmtBossCtrl = new FengMoTaBossCtrl();
        //this.fmtBossCtrl.setView(this.elems);
        //技能
        this.btnTab = new GameObjectGetSet(this.elems.getElement('btnTab'));
        this.skillList = this.elems.getUIFixedList("normalSkillRect");
        for (let i = 0; i < this.max_skillNum; ++i) {
            let skillGo = this.skillList.GetItem(i).gameObject;
            this.skillIconImgs.push(ElemFinder.findRawImage(skillGo, 'mask/icon'));
            let cooldown = ElemFinder.findImage(skillGo, 'cooldown');
            let obj = cooldown.gameObject;
            this.skillCdImgs.push(cooldown);
            this.skillCdImgObjs.push(obj);
            this.skillTweens[i] = obj.AddComponent(Tween.TweenImageFillAmount.GetType()) as Tween.TweenImageFillAmount;
            this.skillTweens[i].enabled = false;
            this.skillCdOvers.push(ElemFinder.findObject(skillGo, 'jncdreally'));
            this.addClickListener(skillGo, delegate(this, this.onClickSkillIcon, i));

            if(this.petSkillIdx == i) {
                this.petNuQi = ElemFinder.findImage(skillGo, 'frame/nuqi');
                this.petNuQiAnim = new GameObjectGetSet(ElemFinder.findObject(skillGo, 'nuqiAnim'));
            }
        }
        this.vipSkillBack = this.skillIconImgs[this.nuQiSkillIdx].gameObject;
        this.activitySkillRect = new GameObjectGetSet(this.elems.getElement("activitySkillRect"));
        for (let i = 0; i < this.MaxPinSkillCnt; ++i) {
            let skillGo = ElemFinder.findObject(this.activitySkillRect.gameObject, i.toString());
            let skillIcon = new SkillIconItem(false);
            skillIcon.setUsually(skillGo);
            this.addClickListener(skillGo, delegate(this, this.onClickPinSkill, i));
            this.activitySkillIcons.push(skillIcon);
        }
        this.experienceSkill = this.elems.getElement("experienceSkillRect");
        Game.UIClickListener.Get(this.experienceSkill).onClick = delegate(this, this.onVipExperSkillClick);
        this.experienceSkill.SetActive(false);
        let cooldown = ElemFinder.findImage(this.experienceSkill, 'cooldown');
        let obj = cooldown.gameObject;
        this.vipSkillCdImg = cooldown;
        this.vipSkillCdImgObj = obj;
        this.txtExperienceVIP = new TextGetSet(this.elems.getText("txtExperienceVIP"));
        this.txtExperienceVIP.gameObject.SetActive(false);

        this.petSkillGuide = new GameObjectGetSet(this.elems.getElement('petSkillGuide'));
        this.petSkillGuide.SetActive(false);
        //摇杆
        let controller = this.elems.getElement("controlRect");
        this.joyStickLsn = controller.GetComponent(Game.JoystickListener.GetType()) as Game.JoystickListener;
        this.joyStickLsn.onJoystickUpdate = delegate(this, this.onJoystickUpdate);
        this.joyStickLsn.onJoystickEnd = delegate(this, this.onJoystickEnd);
        G.addUIRaycaster(controller);
        //其他
        this.root = new GameObjectGetSet(this.elems.getElement("root"));
        this.cityText = new TextGetSet(this.elems.getText("city"));
        this.expBarArea = new GameObjectGetSet(this.elems.getElement("expArea"));
        this.starsArea = new GameObjectGetSet(this.elems.getElement("xingxingArea"));
        this.btn_guaJi = new GameObjectGetSet(this.elems.getElement("bt_guaji"));
        this.hangup = new GameObjectGetSet(Game.Tools.GetChild(this.btn_guaJi.gameObject, "hangup"))
        this.noHangup = new GameObjectGetSet(Game.Tools.GetChild(this.btn_guaJi.gameObject, "noHangup"));
        this.btnStrong = new GameObjectGetSet(this.elems.getElement('btnStrong'));
        this.strongGuide = new GameObjectGetSet(this.elems.getElement('strongGuide'));
        this.strongGuide.SetActive(false);
        this.btnStrongEndPos = new GameObjectGetSet(this.elems.getElement('btnStrongEndPos'));
        this.btnStrongStartPos = new GameObjectGetSet(this.elems.getElement('btnStrongStartPos'));
        this.btnStrong.SetActive(false);
        this.textTipCnt = new TextGetSet(this.elems.getText('textTipCnt'));
        this.batteryLevel = new GameObjectGetSet(this.elems.getElement("batteryLevel"));
        this.batteryRed = new GameObjectGetSet(ElemFinder.findObject(this.batteryLevel.gameObject, 'red'));
        this.clock = new TextGetSet(this.elems.getText("clock"));
        //任务队伍按钮
        this.taskTeam = new GameObjectGetSet(this.elems.getElement('taskTeam'));
        let taskTeamElems = this.elems.getUiElements('taskTeam');
        this.taskTeamContent = new GameObjectGetSet(taskTeamElems.getElement('content'));
        this.btnOpenTaskTeam = new GameObjectGetSet(taskTeamElems.getElement('btnOpen'));
        this.btnCloseTaskTeam = new GameObjectGetSet(taskTeamElems.getElement('btnClose'));
        this.btnVip = new GameObjectGetSet(this.elems.getElement('btnVip'));
        this.onClickBtnOpenTaskTeam();
        //任务
        this.taskTrackList = new TaskTrackList();
        this.taskTrackList.setView(taskTeamElems);
        //队伍
        this.teamMembersPanel = new TeamMembersPanel();
        this.teamMembersPanel.setView(taskTeamElems);
        this.taskNormal = new GameObjectGetSet(taskTeamElems.getElement("taskNormal"));
        this.taskSelected = new GameObjectGetSet(taskTeamElems.getElement("taskSelected"));
        this.teamNormal = new GameObjectGetSet(taskTeamElems.getElement("teamNormal"));
        this.teamSelected = new GameObjectGetSet(taskTeamElems.getElement("teamSelected"));
        //wifi信号
        let wifiIcons = this.elems.getElement("wifiIcons");
        for (let i = 1; i < 4; i++) {
            this.wifiSignals.push(new GameObjectGetSet(ElemFinder.findObject(wifiIcons, i.toString())));
        }
        this.ping = ElemFinder.findText(wifiIcons, "ping");
        this.txtExp = new TextGetSet(this.elems.getText("txtExp"));

        //右下角按钮栏
        G.MainBtnCtrl.setView(this.elems);
        //右上角按钮栏
        G.ActBtnCtrl.setView(this.elems);
        //通知栏
        G.NoticeCtrl.setView(this.elems);
        //当等级达到90级的时候打开龙珠
        this.actionBarItem = new ActionBar;
        this.actionBarItem.setBar(this.expBarArea, this.starsArea);
        this.attack_jianIcon = new GameObjectGetSet(this.elems.getElement('skill_jian'));
        this.attack_daoIcon = new GameObjectGetSet(this.elems.getElement('skill_dao'));
        this.roleRect = new GameObjectGetSet(this.elems.getElement("roleRect"));
        this.mainFuncs = new GameObjectGetSet(this.elems.getElement("mainFuncs"));
        this.normalSkillNode = new GameObjectGetSet(this.elems.getElement("normalSkillNode"));
        this.controlRect = new GameObjectGetSet(this.elems.getElement("controlRect"));
        this.equipCollect = new GameObjectGetSet(this.elems.getElement('equipCollect'));
        //装备收集
        let equipCollect = this.elems.getUiElements('equipCollect');
         this.equipCollectCtrl = new EquipCollectCtrl();
        this.equipCollectCtrl.setView(equipCollect);
        //赛季收集
        let tmpElem = this.elems.getUiElements('saijiProgress');
        let tmpObj = this.elems.getElement('saijiProgress');
        this.saiJiProgressCtrl = new SaiJiProgressCtrl();
        this.saiJiProgressCtrl.setView(tmpElem, tmpObj);
        
        this.vipSkillIcon = this.elems.getElement("vipSkillIcon");

        this.btnGetback = new GameObjectGetSet(this.elems.getElement("btnGetback"));
        this.getbackexp = new TextGetSet(this.elems.getText("getbackexp"));
        this.btnGetback.SetActive(false);
        this.btn_Record = new GameObjectGetSet(this.elems.getElement("btnRecord"));
        this.btnRecordText = new TextGetSet(ElemFinder.findText(this.btn_Record.gameObject, "Text"));
        this.enableAutoDownload();

        this.backMask = new GameObjectGetSet(this.elems.getElement("backMask"));
        //多人boss可显示的点数
        this.vipDescNode = new GameObjectGetSet(this.elems.getElement("vipDescriteNode"));
        this.vipNum = new TextGetSet(ElemFinder.findText(this.vipDescNode.gameObject,'num'))
        this.btnAddNum = new GameObjectGetSet(ElemFinder.findObject(this.vipDescNode.gameObject,'btnAdd'))
        this.vipDescNode.gameObject.SetActive(false);
        this.DenseFogRoot = new GameObjectGetSet(this.elems.getElement("DenseFogRoot"));
    }

    protected initListeners(): void {
        G.addUIRaycaster(this.btnTab.gameObject);
        this.addClickListener(this.btnTab.gameObject, this.onClickBtnTab);
        this.addClickListener(this.elems.getElement("attack"), this.onAttack);
        this.addClickListener(this.btn_guaJi.gameObject, this.onClickHangupBtn);
        this.addClickListener(this.btnStrong.gameObject, this.onClickBtnStrong);
        this.addClickListener(this.elems.getElement("mapBack"), this.onClickOpenMap);
        //监听任务,组队selected
        this.addClickListener(this.btnOpenTaskTeam.gameObject, this._onClickBtnOpenTaskTeam);
        this.addClickListener(this.btnCloseTaskTeam.gameObject, this.onClickBtnCloseTaskTeam);
        this.addClickListener(this.teamSelected.gameObject, this.openTeamView);
        this.addClickListener(this.taskNormal.gameObject, this._onClickTaskNormal);
        this.addClickListener(this.teamNormal.gameObject, this.onClickTeamNormal);
        this.addClickListener(this.btnGetback.gameObject, this.onClickBtnBack);
        this.addClickListener(this.btn_Record.gameObject, this.onClickBtnRecord);
        this.addClickListener(this.btnAddNum.gameObject, this.onClickBtnAddNum);
    }


    private isOnRecording: boolean = false;
    updateRecordBtnState(result: number) {
        if (result == ResultType.OK) {
            this.isOnRecording = true;
            this.btnRecordText.text = "停止录制";
        } else {
            this.isOnRecording = false;
            this.btnRecordText.text = "开始录制";
        }
    }

    private onClickBtnRecord() {
        if (!this.isOnRecording) {    
            Game.IosSdk.IosCallSDkFunc("startRecord", "");
        } else {     
            Game.IosSdk.IosCallSDkFunc("stopRecord", "");
        }
    }

    /**vipboss增加次数 */
    private onClickBtnAddNum() {
        let info = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_PRIVATE_BOSS);
        let ccount = info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount;
            let maxcount = G.DataMgr.constData.getValueById(KeyWord.PARAM_MULTI_BOSS_LIMIT_COUNT);
            if (ccount == maxcount) {
                G.TipMgr.addMainFloatTip("当前点数已满");
                return;
            }
            let extraTime = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MULTI_BOSS_BUY_TIMES, G.DataMgr.heroData.curVipLevel);
            let leftTime = extraTime - info.m_stPinExtraInfo.m_stPrivateBossList.m_ucMultiBuyRefreshTimes;
            let cost = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_MULTI_BOSS_BUY_VALUE, G.DataMgr.heroData.curVipLevel);
            G.ActionHandler.privilegePrompt(KeyWord.VIP_PARA_MULTI_BOSS_BUY_TIMES, cost, leftTime, delegate(this, this.goToBuyCountMulti));
    }
    private goToBuyCountMulti(state: MessageBoxConst = 0) {
        if (MessageBoxConst.yes == state) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_BUY_MUlTIBOSS_REFRESH_TIMES, Macros.PINSTANCE_ID_PRIVATE_BOSS, null));
        }
    }
    updateNum() {
        let info = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_PRIVATE_BOSS);
        let maxCount = G.DataMgr.constData.getValueById(KeyWord.PARAM_MULTI_BOSS_LIMIT_COUNT);
        let leftNum = TextFieldUtil.getColorText(uts.format("{0}", info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount),
            info.m_stPinExtraInfo.m_stPrivateBossList.m_iMultiBossTotalCount > 9 ? Color.GREEN : Color.RED);
        this.vipNum.text = uts.format('{0}/{1}', leftNum, maxCount);
    }
    setVipObjEnble(value:boolean) {
        this.vipDescNode.gameObject.SetActive(value);
    }

    private logdownloadwarning = false;
    public enableAutoDownload(force: boolean = false) {
        let level = G.DataMgr.heroData.level;
        if (!level) {
            level = -1;
        }
        let checkLevel = 70;
        if (level > 0 && this.autoDownloadRequest && this.downloadFlag == 100) {
            this.autoDownloadRequest.Abort();
            this.autoDownloadRequest = null;
        }
        if (level > checkLevel && this.autoDownloadRequest && this.downloadFlag == 1) {
            this.autoDownloadRequest.Abort();
            this.autoDownloadRequest = null;
        }
        if (!this.autoDownloadRequest) {
            if (level == -1) {
                let str1 = Game.Tools.BytesToStringArray(Game.ResLoader.LoadAsset("txtdata/downloadRecord.bytes").textAsset.bytes);
                let str2 = Game.ResLoader.ValidStringList(str1);
                this.autoDownloadRequest = Game.ResLoader.CreateDownloadRequest(Game.AssetPriority.Low2, str2, true);
                Game.ResLoader.BeginDownloadRequest(this.autoDownloadRequest, delegate(this, this.dowloadOver70Callback));
                this.downloadFlag = 100;
            }
            else if (level <= checkLevel && Game.Tools.BytesToStringArray) {
                let str1 = Game.Tools.BytesToStringArray(Game.ResLoader.LoadAsset("txtdata/downloadRecord.bytes").textAsset.bytes);
                let str2 = Game.ResLoader.ValidStringList(str1);
                this.autoDownloadRequest = Game.ResLoader.CreateDownloadRequest(Game.AssetPriority.Low2, str2, true);
                this.downloadFlag = 1;
            }
            else if (level > 85) {
                this.autoDownloadRequest = Game.ResLoader.CreateDownloadRequest(Game.AssetPriority.Low2, Game.ResLoader.GetAssetBundleNameList(["scene", "ui", "model", "effect", "images"]), true);
                this.downloadFlag = 2;
            }
        }
        if (defines.has("DEVELOP")) {
            if (!this.logdownloadwarning) {
                uts.logWarning("开发模式下关闭了后台自动下载功能，请无视此警告");
                this.logdownloadwarning = true;
            }
            return;
        }
        if (this.autoDownloadRequest && !this.autoDownloadRequest.isLoading) {
            if (level < checkLevel && this.downloadFlag == 1) {
                Game.ResLoader.BeginDownloadRequest(this.autoDownloadRequest, delegate(this, this.dowloadOver70Callback));
            }
            else if (this.downloadFlag == 2 && ((UnityEngine.Application.internetReachability == UnityEngine.NetworkReachability.ReachableViaLocalAreaNetwork) || force)) {
                Game.ResLoader.BeginDownloadRequest(this.autoDownloadRequest, delegate(this, this.dowloadOverCallback));
            }
        }
    }
    private dowloadOver70Callback(request: Game.DownloadRequest) {
        if (request.error != null) {
            uts.logWarning(request.error);
            return;
        }
    }
    private dowloadOverCallback(request: Game.DownloadRequest) {
        let view = G.Uimgr.getForm<DownloadView>(DownloadView);
        if (view != null) {
            view.updateStatus();
        }
        if (request.error != null) {
            uts.logWarning(request.error);
            return;
        }
    }


    setTaskTeamActive(isShow: boolean) {
        if (null != this.taskTeam) {
            this.taskTeam.SetActive(isShow);
        }
        G.ActBtnCtrl.enableLine4(isShow);
    }
    setmainFuncsActive(isShow: boolean) {
        if (null != this.mainFuncs) {
            this.mainFuncs.SetActive(isShow);
        }
    }
    setskillRectActive(isShow: boolean) {
        if (null != this.mainFuncs) {
            this.normalSkillNode.SetActive(isShow);
            this.controlRect.SetActive(isShow);
        }
    }
    setequipCollectActive(isShow: boolean) {
        if (null != this.mainFuncs) {
            this.equipCollect.SetActive(isShow);
        }
    }
    setJoyStickEnabled(enabled: boolean) {
        if (null != this.joyStickLsn) {
            this.joyStickLsn.enabled = enabled;
        }
    }

    private onClickOpenMap() {
        if (!G.ActionHandler.checkCrossSvrUsable(true, KeyWord.ACT_FUNCTION_WORLDMAP)) {
            return;
        }
        G.Uimgr.createForm<MapView>(MapView).open();
    }

    //----------------------更新主界面玩家属性、ping值、坐标等等---------------------------//
    public needUpdateView = false;
    private onHeroDataChange() {
        // 更新角色信息
        this.heroInfoCtrl.onHeroDataChange();
        //// 更新buff
        let view = G.Uimgr.getForm<BuffListView>(BuffListView);
        if (view != null) {
            view.onHeroDataChanged(G.DataMgr.heroData.unitID);
        }
        let propertyView = G.Uimgr.getSubFormByID<PropertyView>(HeroView, KeyWord.OTHER_FUNCTION_HEROPROPERTY);
        if (propertyView != null) {
            propertyView.onHeroDataChange();
        }
        let wybqView = G.Uimgr.getForm<WybqView>(WybqView);
        if (wybqView != null) {
            wybqView.onHeroDataChange();
        }
        let titleCanUseTipView = G.Uimgr.getForm<TitleCanUseTipView>(TitleCanUseTipView);
        if (titleCanUseTipView != null) {
            titleCanUseTipView.onHeroDataChange();
        }
    }

    onVipChange() {
        this.heroInfoCtrl.onVipChange();
    }

    onCurrencyChange(id: number) {
        this.heroInfoCtrl.onCurrencyChange(id);
    }

    onChangeScene() {
        //更新场景名字
        let scenedata = G.DataMgr.sceneData;
        let sceneInfo = scenedata.getSceneInfo(scenedata.curSceneID);
        let s = sceneInfo.config.m_szSceneName;
        if (KeyWord.PVP_GUILD == sceneInfo.config.m_iPVPModel) {
            s = TextFieldUtil.getColorText(uts.format('【宗门PK】{0}', s), Color.RED);
        }
        this.cityText.text = s;
        //this.fmtBossCtrl.onChangeScene();
    }

    onShieldChaned() {
        // 更新守护神护盾
        this.heroInfoCtrl.onShieldChaned();
    }

    //onContainerChange(type: number) {
    //    if (type == Macros.CONTAINER_TYPE_ROLE_EQUIP) {
    //        // 更新装备
    //        this.equipCollectCtrl.updateEquipCollectProgress();
    //    }
    //}

    /**
     *每次激活后都要刷新主界面
     */
    updateEquipCollectProgress() {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION)) {
            this.setequipCollectActive(true);
            this.equipCollectCtrl.updateEquipCollectProgress();
        } else {
            this.setequipCollectActive(false);
        }
    }

    updateSaiJiProgress() {
        this.saiJiProgressCtrl.update();
    }

    //----------------------队伍---------------------------//
    onTeamChanged() {
        this.isTeamDirty = true;
    }

    //----------------------更新被选中目标的信息等等---------------------------//
    onUnitSelected(unitCtrl: UnitController) {
        let showInfo = false;
        // 只有boss和角色才显示
        if (null != unitCtrl && Macros.PINSTANCE_ID_SINGLEPVP_FINALID != G.DataMgr.sceneData.curPinstanceID) {
            if (unitCtrl.Data.unitType == UnitCtrlType.monster) {
                let monsterCtrl = unitCtrl as MonsterController;
                let md = monsterCtrl.Config.m_bDignity;
                showInfo = UnitUtil.isBoss(md) || KeyWord.MONSTER_TYPE_DECORATE == md;
            }
            else {
                showInfo = unitCtrl.Data.unitType == UnitCtrlType.role;
            }
        }

        if (showInfo) {
            this.otherInfoCtrl.onUnitSelected(unitCtrl);
        } else {
            this.otherInfoCtrl.onUnitSelected(null);
        }
    }

    onOtherUnitDataChanged(unitCtrl: UnitController) {
        this.otherInfoCtrl.onUnitDataChanged(unitCtrl);
    }

    onUnitBuffChanged(unitCtrl: UnitController) {
        if (unitCtrl.Data.unitType == UnitCtrlType.hero) {
            this.heroInfoCtrl.onHeroBuffChanged();
            let view = G.Uimgr.getForm<BuffListView>(BuffListView);
            if (view != null) {
                view.onBuffChanged(G.DataMgr.heroData.unitID);
            }
        } else {
            this.otherInfoCtrl.onUnitBuffChanged(unitCtrl);
        }
    }

    private onUpdateTimer(timer: Game.Timer) {
        //判断网络状态
        if (this.downloadFlag == 2 && this.autoDownloadRequest && this.autoDownloadRequest.isLoading) {
            if (!DownloadView.manualContinue && UnityEngine.Application.internetReachability != UnityEngine.NetworkReachability.ReachableViaLocalAreaNetwork) {
                this.autoDownloadRequest.Abort();
                let view = G.Uimgr.getForm<DownloadView>(DownloadView);
                if (view != null) {
                    view.updateStatus();
                }
            }
        }

        //Profiler.push('onHeroDataChange');
        if (this.needUpdateView) {
            this.onHeroDataChange();
            this.needUpdateView = false;
        }
        //Profiler.pop();

        if (timer.CallCount % 2 == 1) {
            this.updateSignal();
            this.updateBatteryLevel();
            this.updateClock();
            // 检查活动按钮栏是否需要更新
            //Profiler.push('MainBtnCtrl');
            G.MainBtnCtrl.checkUpdate();
            //Profiler.pop();
            //Profiler.push('ActBtnCtrl');
            G.ActBtnCtrl.checkUpdate();
            //Profiler.pop();
        }

        // 检查任务追踪刷新
        //Profiler.push('taskTrackList');
        this.taskTrackList.checkUpdate();
        //Profiler.pop();

        // 检查副本统计刷新
        let statView = this.getChildForm<PinstanceStatView>(EnumMainViewChild.pinstanceStat);
        if (null != statView) {
            statView.checkUpdate();
        }

        //检查主功能预告刷新  @jackson 禁用掉...
        //this.newFunctionTrailerCtrl.cheakUpdate();
        let operateView = this.getChildForm<PinstanceOperateView>(EnumMainViewChild.pinstanceOperate);
        if (null != operateView) {
            operateView.checkUpdate();
        }

        // 刷新队伍
        if (this.isTeamDirty && null != this.teamMembersPanel) {
            this.teamMembersPanel.onTeamChanged();
            this.isTeamDirty = false;
        }

        //Profiler.push('checkGuildAndWorldPaiMai');
        this.checkGuildAndWorldPaiMai();
        //Profiler.pop();
    }

    private resUnloaderTimer() {
        if (!G.ModuleMgr.SceneModule.isLoading) {
            Game.ResLoader.ClearMemory(300, false);
        }
    }

    private updateSignal() {
        //更新信号(人物走路和发包构成)
        let netDelay: number = G.ModuleMgr.netModule.NetDelay;
        if (netDelay > 999) {
            netDelay = 999;
        }
        //this.pingValue = Game.Tools.Fps;
        this.pingValue = netDelay;
        let newWifiLv = 1;
        if (netDelay <= Constants.DelaySignal[0]) {
            newWifiLv = 3;
        }
        else if (netDelay <= Constants.DelaySignal[1]) {
            newWifiLv = 2;
        }
        if (this.wifiLv != newWifiLv) {
            this.wifiLv = newWifiLv;
            for (let i = 0; i < 3; i++) {
                this.wifiSignals[i].SetActive(i < newWifiLv);
            }
        }
    }
    private updateBatteryLevel() {
        if (this.batteryInterval.isCome) {
            let lv = Math.max(0, Compatible.getBatteryLevel());
            if (this.oldBatLv != lv) {
                this.batteryRed.SetActive(lv <= 0.2);
                Game.Tools.SetGameObjectLocalScale(this.batteryLevel.gameObject, lv, 1, 1);
            }
        }
    }

    private curHours: number = -1;
    private lastHours: number = -1;
    private updateClock() {
        if (this.clockInterval.isCome) {
            let data = new Date();
            this.clock.text = DataFormatter.second2hhmm(data.getTime() / 1000);
            //添加一个提示框 在开服前七天会在12点和19点谈提示框
            // if (G.SyncTime.getDateAfterStartServer() > 7) return;
            // if (this.curHours != G.SyncTime.getDateHour()) {
            //     this.curHours = G.SyncTime.getDateHour();
            //     if (this.lastHours == 11 || this.lastHours == 18) {
            //         if (this.curHours == 12 || this.curHours == 19) {
            //             G.Uimgr.createForm<MessageTipView>(MessageTipView).open();
            //         }
            //     }
            //     this.lastHours = this.curHours;
            // }
        }
    }


    private checkGuildAndWorldPaiMai() {
        if (G.DataMgr.runtime.paiMaiHaveData) {
            let toZeroTime = G.SyncTime.getServerZeroLeftTime();
            let guildSpaceTime = toZeroTime - this.LeftTimeToTipGuildPaiMai;
            let worldSpaceTime = toZeroTime - this.LeftTimeToTipWorldPaiMai;
            if (!G.DataMgr.runtime.inMainGuildPaiMaiHasTip && guildSpaceTime > 0 && guildSpaceTime < this.MaxSpaceTime) {
                G.DataMgr.runtime.inMainGuildPaiMaiHasTip = true;
                G.DataMgr.runtime.paiMaiNeedTip = true;
                G.NoticeCtrl.checkPaiMai(EnumGuildJingPaiSubTab.guild);
                G.GuideMgr.tipMarkCtrl.onGuildPaiMaiChange();
            }
            else if (!G.DataMgr.runtime.inMainWorldPaiMaiHasTip && worldSpaceTime > 0 && worldSpaceTime < this.MaxSpaceTime) {
                G.DataMgr.runtime.inMainWorldPaiMaiHasTip = true;
                G.DataMgr.runtime.paiMaiNeedTip = true;
                G.NoticeCtrl.checkPaiMai(EnumGuildJingPaiSubTab.world);
                G.GuideMgr.tipMarkCtrl.onGuildPaiMaiChange();
            }
        }
    }
    //----------------------任务相关----------------------------------------------------//

    private _onClickBtnOpenTaskTeam() {
        G.AudioMgr.playBtnClickSound();
        this.onClickBtnOpenTaskTeam();
    }

    private onClickBtnOpenTaskTeam() {
        this.setTaskTeamIconActive(true);
    }

    private onClickBtnCloseTaskTeam() {
        G.AudioMgr.playBtnClickSound();
        this.setTaskTeamIconActive(false);
    }

    private setTaskTeamIconActive(active: boolean) {
        this.taskTeamContent.SetActive(active);
        this.btnCloseTaskTeam.SetActive(active);
        this.btnOpenTaskTeam.SetActive(!active);
    }

    private openTeamView() {
        //点击队伍按钮
        let view = G.Uimgr.createForm<MyTeamView>(MyTeamView);
        view.open();
    }

    private _onClickTaskNormal() {
        G.AudioMgr.playBtnClickSound();
        this.onClickTaskNormal();
    }

    private onClickTaskNormal() {
        this.changeTaskTeamStatus(false);
    }

    private onClickTeamNormal() {
        G.AudioMgr.playBtnClickSound();
        this.changeTaskTeamStatus(true);
    }

    private changeTaskTeamStatus(active: boolean) {
        this.taskNormal.SetActive(active);
        this.taskSelected.SetActive(!active);
        this.teamNormal.SetActive(!active);
        this.teamSelected.SetActive(active);
        this.taskTrackList.setActive(!active);
        this.teamMembersPanel.setActive(active);
    }

    private onClickHangupBtn() {
        G.AudioMgr.playBtnClickSound();
        G.ModuleMgr.deputyModule.onClickHangUpBtn();
    }

    //--------------------------变强相关----------------------------//

    setBtnStrongActive(tipCnt: number) {
        if (tipCnt != this.oldTipCnt) {
            let isActive = tipCnt > 0;
            let oldIsActive = this.oldTipCnt > 0;
            if (isActive) {
                this.textTipCnt.text = tipCnt.toString();
            }
            if (isActive != oldIsActive) {
                this.btnStrong.SetActive(isActive);
                if (isActive) {
                    let startPos = this.btnStrongStartPos.GetPosition();
                    this.btnStrong.SetPositionV3(startPos);
                    let endPos = this.btnStrongEndPos.GetPosition();
                    let tween = Tween.TweenPosition.Begin(this.btnStrong.gameObject, 0.8, endPos, true);
                    tween.onFinished = delegate(this, this.checkGuideBianQiang);
                } else {
                    this.strongGuide.SetActive(false);
                }
            }
            this.oldTipCnt = tipCnt;
        }
    }

    checkGuideBianQiang() {
        if (this.oldTipCnt > 0) {
            let runtime = G.DataMgr.runtime;
            if (runtime.guideBianQiang) {
                runtime.guideBianQiang = false;
                this.strongGuide.SetActive(true);
                Game.Invoker.BeginInvoke(this.strongGuide.gameObject, 't', 5, delegate(this, this.onStrongGuideTimeout));
            }
        }
    }

    private onStrongGuideTimeout() {
        this.strongGuide.SetActive(false);
    }

    private onClickBtnStrong() {
        G.AudioMgr.playBtnClickSound();
        this.strongGuide.SetActive(false);
        if (!G.ActionHandler.checkCrossSvrUsable(true, KeyWord.BAR_FUNCTION_BIANQIANG)) {
            return;
        }
        if (G.ViewCacher.tipMarkView.isOpened) {
            G.ViewCacher.tipMarkView.close();
        }
        else {
            G.ViewCacher.tipMarkView.open();
        }
    }


    //----------------------摇杆---------------------------//
    public bindRole() {
        this.role = G.UnitMgr.hero;
    }

    private onJoystickUpdate(direction: UnityEngine.Vector2) {
        this.role.beginMoveToward(direction);
        //if (G.MainBtnCtrl.IsOpened) {
        //    G.MainBtnCtrl.changeState(false, true);
        //}
    }
    private onJoystickEnd() {
        this.role.stopMoveToward();
    }
    public onAttack(): void {
        if (!this.role.IsAutoAttacking) {
            if (G.UnitMgr.SelectedUnit != null && G.UnitMgr.SelectedUnit.Data.unitType == UnitCtrlType.npc) {
                G.UnitMgr.unselectUnit(0, false);
            }
            if (G.UnitMgr.SelectedUnit == null) {
                G.UnitMgr.onSelectChangeCheck(false);
            }
            this.role.attackAuto();
        }
    }


    ///////////////////////技能//////////////////////////////////////////////////////

    onSkillChange(id: number) {
        // 技能图标
        for (let i = 0; i < this.max_skillNum; i++) {
            let skill = this.getBindSkillAt(i);
            this.skills[i] = skill;
            if (0 == id || SkillData.isSameClassSkill(skill.m_iSkillID, id)) {
                let item = this.skillList.GetItem(i);
                if (skill.completed == 0) {
                    item.gameObject.SetActive(false);
                }
                else {
                    item.gameObject.SetActive(true);
                    G.ResourceMgr.loadIcon(this.skillIconImgs[i], skill.m_iSkillIcon.toString(), -1);
                }
            }
            if(this.petSkillIdx == i) {
                this.onPetNuQiChanged();
            }
        }
    }

    private onClickBtnTab() {
        G.UnitMgr.onSelectChangeCheck(true);
    }

    public onClickSkillIcon(index: number) {
        let skill = this.skills[index];
        if (skill == null) {
            uts.log("null" + "  index：" + index);
            return;
        }
        if (skill.completed != 0) {
            if (index == this.nuQiSkillIdx) {
                let status = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2);
                if (status < 0 && this.m_experienceVIPTime <= 0) {
                    G.Uimgr.createForm<BigSkillShowView>(BigSkillShowView).open(TeQuanBuyPanelType.HuangJin);
                    return;
                }
            }
            if (SkillData.isOutOfMP(skill)) {
                G.TipMgr.addMainFloatTip("怒气不足");
            }
            else {
                this.role.triggerSkill(skill.m_iSkillID);
            }
        }
        else {
            uts.log("技能未解锁");
        }

        if(this.petSkillIdx == index) {
            this.petSkillGuide.SetActive(false);
            // Game.Invoker.EndInvoke(this.petSkillGuide.gameObject, 't');
        }
    }

    private onVipExperSkillClick() {
        let cfg = G.DataMgr.skillData.getExperSkillConfig(G.DataMgr.heroData.profession)
        if (cfg.m_iConsumableNumber > 0) {
            let data = G.DataMgr.heroData;
            if (data.getProperty(Macros.EUAI_RAGE) < cfg.m_stConsumable[0].m_iConsumeValue) {
                G.TipMgr.addMainFloatTip("怒气不足");
            }
            else {
                uts.log('trigger vip skill: ' + cfg.m_iSkillID);
                this.role.triggerSkill(cfg.m_iSkillID);
            }
        }
    }

    private onCDFinished(effect: UnityEngine.GameObject) {
        effect.SetActive(true);
        Game.Invoker.BeginInvoke(effect, "deactive", 0.45, delegate(this, this.onEffectLight, effect));
    }
    private onEffectLight(effect: UnityEngine.GameObject) {
        effect.SetActive(false);
    }
    onCdChanged() {
        for (let i = 0; i < this.max_skillNum; i++) {
            let skillCfg = this.skills[i];
            if (skillCfg && skillCfg.completed > 0) {
                let cdData = G.DataMgr.cdData.getCdDataBySkill(skillCfg);
                if (null != cdData && (this.skillCdRemains[i] != cdData.remainTime || this.skillCdTimes[i] != cdData.cdTime)) {
                    let fillImage = this.skillCdImgs[i];
                    let fillObj = this.skillCdImgObjs[i];
                    fillImage.fillAmount = cdData.remainTime / cdData.cdTime;
                    Tween.TweenImageFillAmount.Begin(fillObj, cdData.remainTime / 1000, 0);
                    if (this.skillCdOvers[i] && cdData.remainTime > 1500) {
                        Game.Invoker.BeginInvoke(fillObj, "light", cdData.remainTime / 1000, delegate(this, this.onCDFinished, this.skillCdOvers[i]));
                    }
                    this.skillCdRemains[i] = cdData.remainTime;
                    this.skillCdTimes[i] = cdData.cdTime;
                }
            }
        }
        let cfg = G.DataMgr.skillData.getExperSkillConfig(G.DataMgr.heroData.profession)
        if (cfg != null) {
            let cdData = G.ModuleMgr.skillModule._getSkillCd(cfg);
            if (cdData == null) {
                return;
            }

            if (null != cdData && (this.vipSkillCdRemain != cdData.remainTime || this.vipSkillCdTime != cdData.cdTime)) {
                let fillImage = this.vipSkillCdImg;
                let fillObj = this.vipSkillCdImgObj;
                fillImage.fillAmount = cdData.remainTime / cdData.cdTime;
                Tween.TweenImageFillAmount.Begin(fillObj, cdData.remainTime / 1000, 0);
                this.vipSkillCdRemain = cdData.remainTime;
                this.vipSkillCdTime = cdData.cdTime;
            }

        }
        if (this.activitySkillRect.activeSelf) {
            for (let i = 0; i < this.MaxPinSkillCnt; i++) {
                let skillIcon = this.activitySkillIcons[i];
                if (skillIcon.gameObject.activeSelf && skillIcon.SkillId > 0) {
                    let skillCfg = SkillData.getSkillConfig(skillIcon.SkillId);
                    if (0 == skillCfg.m_ucForbidden) {
                        let cdData = G.DataMgr.cdData.getCdDataBySkill(skillCfg);
                        if (null != cdData) {
                            skillIcon.setCd(cdData.remainTime, cdData.cdTime);
                        }
                    }
                }
            }
        }
    }

    onPetSkillUnlock() {
        this.onPetSkillChange();
        this.petSkillGuide.SetActive(true);
        // Game.Invoker.BeginInvoke(this.petSkillGuide.gameObject, 't', 5, delegate(this, this.onPetSkillGuideTimeout));
    }
    // private onPetSkillGuideTimeout() {
    //     this.petSkillGuide.SetActive(false);
    // }
    onPetSkillChange() {
        if(G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_PET_SKILL)) {
            let petCtrl = G.UnitMgr.hero.pet;
            if(petCtrl) {
                let skillId = G.DataMgr.petData.getNqSkill(petCtrl.Data.id);
                this.onSkillChange(skillId);
            }
        }
    }
    onPetNuQiChanged() {
        let petCtrl = G.UnitMgr.hero.pet;
        let skillCfg = this.skills[this.petSkillIdx];
        let progress = 0;
        if (petCtrl && skillCfg && skillCfg.completed) {
            progress = petCtrl.Data.getProperty(Macros.EUAI_RAGE) / skillCfg.m_stConsumable[0].m_iConsumeValue;
            if (progress > 1) {
                progress = 1;
            }
        }
        this.petNuQi.fillAmount = progress;
        this.petNuQiAnim.SetActive(progress >= 1);
    }

    onWyyzSkillForbidden(skillId: number) {
        if (this.activitySkillRect.activeSelf) {
            for (let i = 0; i < this.MaxPinSkillCnt; i++) {
                let skillIcon = this.activitySkillIcons[i];
                if (skillIcon.gameObject.activeSelf && skillId == skillIcon.SkillId) {
                    let skillCfg = SkillData.getSkillConfig(skillIcon.SkillId);
                    UIUtils.setButtonClickAble(skillIcon.gameObject, false);
                }
            }
        }
    }

    private getBindSkillAt(index: number): GameConfig.SkillConfigM {
        let skillData = G.DataMgr.skillData;
        if (this.profSkillMap == null) {
            this.profSkillMap = skillData.getSkillsByProf(G.DataMgr.heroData.profession);
        }
        if (this.nuQiSkillIdx == index) {
            //怒气技能
            return this.profSkillMap[KeyWord.SKILL_BRANCH_ROLE_NQ][0];
        }
        else if (this.petSkillIdx == index) {
            //伙伴怒气技能
            if(G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_PET_SKILL)) {
                let petNqSkillId = G.DataMgr.petData.getNqSkill();
                if(petNqSkillId > 0) {
                    return SkillData.getSkillConfig(petNqSkillId);
                }
            }
            let noPetNqSkill = {} as GameConfig.SkillConfigM;
            noPetNqSkill.completed = 0;
            return noPetNqSkill;
        }
        else {
            //普通技能
            let skill = this.profSkillMap[KeyWord.SKILL_BRANCH_ROLE_ZY][index];
            let jiBanSkill = skillData.getJiBanSkillReplaced(skill);
            if (null != jiBanSkill) {
                return jiBanSkill;
            }
            return skill;
        }
    }


    getSkillPosition(id: number): UnityEngine.Vector3 {
        let skillCfg = SkillData.getSkillConfig(id);
        if (null == skillCfg) {
            return null;
        }
        let idx = -1;
        if (KeyWord.SKILL_BRANCH_ROLE_NQ == skillCfg.m_ucSkillBranch) {
            idx = this.nuQiSkillIdx;
        } else if (KeyWord.SKILL_BRANCH_BEAUTY == skillCfg.m_ucSkillBranch) {
            idx = this.petSkillIdx;
        }
        else if (KeyWord.SKILL_BRANCH_ROLE_ZY == skillCfg.m_ucSkillBranch) {
            let profSkillMap = G.DataMgr.skillData.getSkillsByProf(G.DataMgr.heroData.profession);
            idx = profSkillMap[KeyWord.SKILL_BRANCH_ROLE_ZY].indexOf(skillCfg);
        }
        if (idx < 0) {
            return null;
        }
        return this.skillList.GetItem(idx).gameObject.transform.position;
    }

    onHangupStatusChange(value: boolean) {
        if (value) {
            this.hangup.SetActive(true);
            this.noHangup.SetActive(false);
        } else {
            this.hangup.SetActive(false);
            this.noHangup.SetActive(true);
        }
    }
    /**
      * @param enable
     */
    setViewEnable(enable: boolean) {
        this.root.SetActive(enable);
        //@jackson...清理经验特效状态
        // this.actionBarItem.clearAnimateStateForMainView();
    }

    showPinstanceSkillPanel(skills: GameConfig.SkillConfigM[]) {
        this.activitySkillRect.SetActive(true);
        this.skillList.gameObject.SetActive(false);

        let skillCnt = skills.length;
        for (let i = 0; i < this.MaxPinSkillCnt; ++i) {
            let skillIcon = this.activitySkillIcons[i];
            if (i < skillCnt) {
                let skill = skills[i];
                skillIcon.updateBySkillID(skill.m_iSkillID);
                skillIcon.updateIcon();
                let cdData = G.DataMgr.cdData.getCdDataBySkill(skill);
                if (null != cdData) {
                    skillIcon.setCd(cdData.remainTime, cdData.cdTime);
                } else {
                    skillIcon.setCd(0, 0);
                }
                skillIcon.gameObject.SetActive(true);
                UIUtils.setButtonClickAble(skillIcon.gameObject, 0 == skill.m_ucForbidden);
            }
            else {
                skillIcon.gameObject.SetActive(false);
            }
        }
    }

    private onClickPinSkill(index: number) {
        let skillIcon = this.activitySkillIcons[index];
        let skill = SkillData.getSkillConfig(skillIcon.SkillId);
        if (null != skill) {
            if (KeyWord.SKILL_BRANCH_WYYZ == skill.m_ucSkillBranch) {
                let cdData = G.DataMgr.cdData.getCdDataBySkill(skill);
                if (cdData == null) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWyyzSkillRequest(G.DataMgr.petExpeditionData.getPetIdBySkillId(skill.m_iSkillID)));
                }
            } else {
                this.role.triggerSkill(skillIcon.SkillId);
            }
        }
    }

    public onClickBtnBack() {
        let times = G.DataMgr.questData.m_ucDailyKeepTimes;
        let level = G.DataMgr.heroData.level;
        let exp = times * Math.floor((1000000 + Math.floor((level <= 80 ? 80 : level) / 10) * 1000000) / 2);
        let uplevel = G.DataMgr.roleAttributeData.getExpLevelNumber(exp);
        //判断首充是否领取
        let message = uts.format("首充任意金额，可领取日常任务双倍经验\n当前可领取经验：{0}\n预计可升级：{1}级", TextFieldUtil.getColorText(exp.toString(), Color.UIGreen), TextFieldUtil.getColorText((Math.floor(uplevel * 100) / 100).toString(), Color.UIGreen));
        let charge = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_1);
        if (charge == 0) {
            G.TipMgr.showConfirm(message, ConfirmCheck.noCheck, '领取|取消', delegate(this, this.onBackConfirm, false));
        }
        else {
            G.TipMgr.showConfirm(message, ConfirmCheck.noCheck, '前往充值|取消', delegate(this, this.onBackConfirm, true));
        }
    }
    private onBackConfirm(state: MessageBoxConst, isCheckSelected: boolean, tag: boolean) {
        if (MessageBoxConst.yes == state) {
            if (tag) {
                G.ActionHandler.go2Pay();
            }
            else {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getQuestPanelRequest(Macros.QUEST_TYPE_DAILY, Macros.QUESTPANEL_DAILY_QUEST_SAVE));
            }
        }
    }

    showNormalSkillPanel() {
        this.activitySkillRect.SetActive(false);
        this.skillList.gameObject.SetActive(true);
    }

    setRoleRectActive(value: boolean) {
        this.roleRect.SetActive(value);
    }
    setbtnVipActive(value: boolean) {
        if (null != this.btnVip) {
            this.btnVip.SetActive(value);
        }
    }
    //1553940802
    //1553942501
    /**设置vip大招技能展示图标*/
    onVipSkillIconDataChange() {
        let status1 = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2);
        // let status2 = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3);
        //let isActive: boolean = (status1 >= 0 || status2 >= 0);
        let isActive: boolean = (status1 >= 0);
        this.m_experienceVIPTime = G.DataMgr.vipData.m_uiVIPSkillTime - Math.round(G.SyncTime.getCurrentTime() / 1000);
        this.vipSkillIcon.SetActive(!isActive && this.m_experienceVIPTime <= 0);
        UIUtils.setGrey(this.vipSkillBack, !isActive && this.m_experienceVIPTime <= 0);
        if (this.m_experienceVIPTime > 0 && !isActive) {
            this.txtExperienceVIP.gameObject.SetActive(true);
            if (!this.hasTimer("VipExperSkillTimer"))
                this.addTimer("VipExperSkillTimer", 1000, 0, this.VipExperSkillTimer);
        }
    }

    /**设置vip体验技能展示图标*/
    changeExperSkillIconDataChange() {

        let isActive: boolean = G.DataMgr.pinstanceData.isVipExperSkillActive();
        //G.DataMgr.vipData.listInfo.
        this.experienceSkill.SetActive(isActive);
    }
    private VipExperSkillTimer(): void {
        this.m_experienceVIPTime--;
        if (this.m_experienceVIPTime <= 0) {
            this.onVipSkillIconDataChange();
            this.txtExperienceVIP.gameObject.SetActive(false);
            G.Uimgr.createForm<VipView>(VipView).open();
            this.removeTimer("VipExperSkillTimer");
        }
        else {
            this.txtExperienceVIP.text = TextFieldUtil.getColorText('体验时间: ' + DataFormatter.second2mmss(this.m_experienceVIPTime), 'fffbeb');
        }
    }

    /**加载vip体验技能图标icon*/
    onExperienceSkillIcon() {

        let cfg = G.DataMgr.skillData.getExperSkillConfig(G.DataMgr.heroData.profession)
        let skillId = cfg == null ? 0 : cfg.m_iSkillID
        if (skillId > 0) {
            let skill = this.getBindSkillAt(this.nuQiSkillIdx);
            let icon = ElemFinder.findRawImage(this.experienceSkill, "mask/icon")
            G.ResourceMgr.loadIcon(icon, skill.m_iSkillIcon + '', -1);
        }
    }

    /**vip体验技能是否禁用*/
    isVipExperSkillForbiden() {
        let cfg = G.DataMgr.skillData.getExperSkillConfig(G.DataMgr.heroData.profession)
        UIUtils.setButtonClickAble(this.experienceSkill, 0 == cfg.m_ucForbidden);
    }

    public onDailyQuestUpdate() {
        let times = G.DataMgr.questData.m_ucDailyKeepTimes;
        if (times > 0) {
            let level = G.DataMgr.heroData.level;
            let exp = times * Math.floor((1000000 + Math.floor((level <= 80 ? 80 : level) / 10) * 1000000) / 2);
            this.getbackexp.text = DataFormatter.formatNumber(exp, 10000, true);
            this.btnGetback.SetActive(true);
        }
        else {
            this.btnGetback.SetActive(false);
        }
    }

    /**经验变化 */
    onExpChange(expDelta: number, isLvUp: boolean) {
        this.txtExpValue = 0;
    }
    /**
     * 显示迷雾(现在魂力试炼用)
     * @param duration
     */
    showDenseFog(duration: number) {
        this.DenseFogRoot.SetActive(true);
        //if (this.DenseFogRoot.transform.childCount==0)
        G.ResourceMgr.loadModel(this.DenseFogRoot.gameObject, UnitCtrlType.other, "effect/other/UI_tiaozhuan.prefab", this.sortingOrder);
        Game.Invoker.BeginInvoke(this.DenseFogRoot.gameObject, "DenseFogRoot", duration, delegate(this, this.hideDenseFogRoot));
    }
    private hideDenseFogRoot() {
        this.DenseFogRoot.SetActive(false);
    }




    toggleActiveForAdVideo() {
        let value = false;
        this.elems.getElement('roleRect').SetActive(value);
        this.elems.getElement('leftBtm').SetActive(value);
        this.elems.getElement('selectedInfo').SetActive(value);
        this.elems.getElement('actBtns').SetActive(value);
        this.elems.getElement('mainFuncs').SetActive(value);
        this.elems.getElement('noticeCtrl').SetActive(value);
        this.elems.getElement('chatRect').SetActive(value);
        this.elems.getElement('expArea').SetActive(value);
        this.elems.getElement('xingxingArea').SetActive(value);
        //this.elems.getElement('newFunctionArea').SetActive(value);
        this.elems.getElement('equipCollect').SetActive(value);
        this.elems.getElement('fengMoTaBoss').SetActive(value);
        this.elems.getElement('topRight').SetActive(value);
        this.elems.getElement('taskTeam').SetActive(value);
        this.elems.getElement('subActBtns').SetActive(value);
        this.btn_guaJi.SetActive(value);
        this.skillList.GetItem(4).gameObject.SetActive(value);
        this.mainChatCtrl.btn_friend.SetActive(value);
        G.MainBtnCtrl.btnBag.SetActive(value);
        G.MainBtnCtrl.btnPet.SetActive(value);
        this.btnStrong.SetActive(value);
    }
}
export default MainView;