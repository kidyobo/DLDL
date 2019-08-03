import { Global as G } from 'System/global'
import { UIPathData } from "System/data/UIPathData"
import { CommonForm, UILayer, TextGetSet, GameObjectGetSet } from 'System/uilib/CommonForm'
import { TypeCacher } from "System/TypeCacher"
import { NPCQuestState } from 'System/constants/GameEnum'
import { KeyWord } from "System/constants/KeyWord"
import { Macros } from "System/protocol/Macros"
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { MonsterData } from "System/data/MonsterData"
import { Color } from 'System/utils/ColorUtil'
import { QuestData } from 'System/data/QuestData'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { NPCData } from 'System/data/NPCData'
import { QuestAction, EnumMarriage } from 'System/constants/GameEnum'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { IconItem } from 'System/uilib/IconItem'
import { Constants } from 'System/constants/Constants'
import { TipFrom } from 'System/tip/view/TipsView'
import { NpcUtil } from 'System/utils/NpcUtil'
import { GuideArrowView } from 'System/guide/GuideArrowView'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { NpcActionData } from 'System/data/NpcActionData'
import { ScriptNpcAction } from 'System/Npc/ScriptNpcAction'
import { FuncNpcAction } from 'System/Npc/FuncNpcAction'
import { QiuHunView } from 'System/Marry/QiuHunView'
import { LiHunView } from 'System/Marry/LiHunView'
import { UnitCtrlType, GameIDType } from 'System/constants/GameEnum'
import { GetZhufuView } from '../guide/GetZhufuView';
import { UIRoleAvatar } from '../unit/avatar/UIRoleAvatar';
import { HeroData } from '../data/RoleData';
import { VipBossPanel } from '../pinstance/boss/VipBossPanel';
import { ShouChongTipView } from '../activity/view/ShouChongTipView';

export enum EnumTaskViewType {
    none = 0,
    quest,
    function,
}

class NpcFuncItem extends ListItemCtrl {
    private textDesc: UnityEngine.UI.Text;

    vo: NpcActionData;

    setComponents(go: UnityEngine.GameObject) {
        this.textDesc = ElemFinder.findText(go, 'textDesc');
    }

    update(vo: NpcActionData) {
        this.vo = vo;
        this.textDesc.text = vo.title;
    }
}

//任务窗口
export class TaskView extends CommonForm {

    private listItems: NpcFuncItem[] = [];
    private m_scriptAction: ScriptNpcAction = new ScriptNpcAction();
    private funcNpcAction: FuncNpcAction = new FuncNpcAction();
    /**npc对话框下面列表的内容 */
    private funcItemDatas: NpcActionData[] = [];
    /**
    * 是否需要发送拉取活动限次数据的消息，打开有副本功能的NPC的时候需要拉取，这个状态时为了避免NPC功能本身有
    * 副本功能，而又具有脚本功能时重复拉取。
    */
    private m_needListActivityLimit = false;
    private cancelBt: UnityEngine.GameObject = null;
    private content: UnityEngine.GameObject = null;
    public canvasGroup: UnityEngine.CanvasGroup;
    /**npcId或者monsterId*/
    private m_ownerID: number = 100143;
    private m_unitID: number = 0;
    /**当前任务id*/
    private m_currentQuestID = 0;
    /**是接任务还是交任务*/
    m_isGetQuest = false;
    /**任务奖励图标*/
    private openType: EnumTaskViewType;
    private openOwnerId: number = 0;
    private openUnitId: number = 0;
    private openQuestState: NPCQuestState;
    private openQuestId: number = 0;
    /**任务区域控制*/
    private taskCtn: UnityEngine.GameObject;
    /**宗门任务等*/
    private funcList: List;
    private max_rewardNum: number = 4;

    private startPos: UnityEngine.Vector3;
    private endPos: UnityEngine.Vector3;


    /**确定 对话任务显示自己的时候 */
    //private btnConfirm: UnityEngine.GameObject;

    private npcNode: TaskPanelItem;
    private heroNode: TaskPanelItem;



    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Base;
    }

    protected resPath(): string {
        return UIPathData.TaskView;
    }

    protected initElements() {
        this.content = this.elems.getElement('content');
        this.funcList = this.elems.getUIList('funcList');
        this.taskCtn = this.elems.getElement('taskCtn');

        // this.cancelBt = this.elems.getElement("cancelBt");
        this.startPos = this.elems.getTransform('start').localPosition;
        this.endPos = this.elems.getTransform('end').localPosition;
        this.canvasGroup = this.content.GetComponent(TypeCacher.CanvasGroup) as UnityEngine.CanvasGroup;


        this.npcNode = new TaskPanelItem();
        this.npcNode.setComponents(this.elems.getElement("npcNode"), true);
        this.heroNode = new TaskPanelItem();
        this.heroNode.setComponents(this.elems.getElement("heroNode"), false);
        this.heroNode.onHide();
        this.npcNode.onShow();

        //this.btnConfirm = this.elems.getElement("btnConfirm");
    }

    protected initListeners() {
        // this.addClickListener(this.cancelBt, this.onClickClosePanelBt);
        this.addClickListener(this.elems.getElement("mask"), this.onClickMask);
        //this.addClickListener(this.btnConfirm, this.onClickfinshBt);
        this.addListClickListener(this.funcList, this.onClickFuncList);
        this.heroNode.onClickFinishCallBack = delegate(this, this.onClickfinshBt);
        this.npcNode.onClickFinishCallBack = delegate(this, this.onClickfinshBt);
    }

    open(type: EnumTaskViewType, ownerId: number, unitId: number = 0, questState: NPCQuestState = 0, questID: number = 0) {
        this.openType = type;
        this.openOwnerId = ownerId;
        this.openUnitId = unitId;
        this.openQuestState = questState;
        this.openQuestId = questID;
        super.open();
    }


    protected onClose() {
        this.npcNode.onClose();
        this.heroNode.onClose();
        let zhufuview = G.Uimgr.getForm<GetZhufuView>(GetZhufuView);
        if (zhufuview == null) {
            G.ViewCacher.mainView.canvas.enabled = true;
            //G.ViewCacher.mainView.newFunctionTrailerCtrl.taskViewClose();
        }
        else if (zhufuview.isOpened == false) {
            G.ViewCacher.mainView.canvas.enabled = true;
            //G.ViewCacher.mainView.newFunctionTrailerCtrl.taskViewClose();
        }
        let shouchong = G.Uimgr.getForm<ShouChongTipView>(ShouChongTipView);
        if (shouchong != null && shouchong.isOpened) {
            shouchong.showContent();
        }
        G.Uimgr.closeForm(GuideArrowView);
    }

    protected onOpen() {
        this.form.transform.SetAsLastSibling();
        G.ViewCacher.mainView.canvas.enabled = false;
        //G.ViewCacher.mainView.newFunctionTrailerCtrl.taskViewOpen();
        let shouchong = G.Uimgr.getForm<ShouChongTipView>(ShouChongTipView);
        if (shouchong != null && shouchong.isOpened) {
            shouchong.hideContent();
        }
        this.heroNode.setTitleName(G.DataMgr.heroData.name);
        if (EnumTaskViewType.none == this.openType) {
            // 没有指定打开模式，根据参数进行判断
            if (this.openQuestId > 0) {
                this.openType = EnumTaskViewType.quest;
            }
        }
        if (EnumTaskViewType.quest == this.openType) {
            this.showQuestDialog(this.openOwnerId, this.openQuestState, this.openQuestId);
        } else {
            this.showFuncDialog(this.openOwnerId, this.openUnitId);
        }
        this.content.transform.localPosition = this.startPos;
        let tweenPos = Tween.TweenPosition.Begin(this.content, 0.4, this.endPos);
        tweenPos.method = Tween.UITweener.Method.EaseInOut;
        this.canvasGroup.alpha = 0;
        let tweenAlpha = Tween.TweenAlpha.Begin(this.content, 0.8, 1);
        tweenAlpha.method = Tween.UITweener.Method.EaseInOut;
    }

    //////////////////////////婚姻相关/////////////////////////////////

    private onClickBtnApplyMarry() {
        let heroData = G.DataMgr.heroData;
        if (heroData.mateName != '') {
            G.TipMgr.addMainFloatTip('您已经有仙侣了');
            return;
        }
        let openLevel = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.BAR_FUNCTION_XIANYUAN).m_ucLevel;
        if (G.DataMgr.teamData.hasTeam && G.DataMgr.teamData.memberList.length == 1) {
            let target = G.DataMgr.teamData.memberList[0];
            if (heroData.level >= openLevel && target.m_usLevel >= openLevel) {
                this.close();
                G.Uimgr.createForm<QiuHunView>(QiuHunView).open();
                return;
            }
        }
        G.TipMgr.addMainFloatTip(uts.format('需要双方单独组队并且都达到{0}级', openLevel));
    }


    private onClickBtnBreakMarry() {
        if (G.DataMgr.heroData.mateName != "") {
            this.close();
            G.Uimgr.createForm<LiHunView>(LiHunView).open();
        }
        else {
            G.TipMgr.addMainFloatTip('您当前还没有仙侣');
        }
    }

    //////////////////////////任务相关/////////////////////////////////

    private onClickfinshBt() {
        //点击完成按钮，进入领取界面，替换内容
        G.AudioMgr.playBtnClickSound();
        G.ModuleMgr.questModule.operateOneQuestRequest(this.m_currentQuestID, this.m_isGetQuest ? QuestAction.accept : QuestAction.complete);
    }

    private onClickClosePanelBt() {
        //点击取消关闭当前按钮
        this.close();
    }

    private onClickMask() {
        if (this.openQuestId > 0) {
            this.onClickfinshBt();
        }
        this.close();
    }

    /**
     * 显示任务的对话窗口
     * @param npcId
     * @param questId
     *
     */
    private showQuestDialog(npcId: number, questState: number, questID: number = 0) {
        //寻路到NPC面前，打开界面
        this.updateOwner(npcId, questID);
        this.m_unitID = 0;
        // 确定任务信息
        let isGetQuest: boolean;
        let questConfig: GameConfig.QuestConfigM;
        if (questID > 0) {
            // 优先使用任务ID
            if (G.DataMgr.questData.isQuestCompletingByID(questID)) {
                // 可以领奖励
                isGetQuest = false;
            }
            else if (G.DataMgr.questData.canQuestAccept(QuestData.getConfigByQuestID(questID), G.DataMgr.heroData, true)) {
                // 可以领任务
                isGetQuest = true;
            }
            else {
                // 不可操作，显示NPC菜单
                questID = 0;
            }
        }
        else {
            // 使用任务状态确定任务
            if (NPCQuestState.complete == questState) {
                if (0 == questID) {
                    // 没有指定任务ID就找第一个可以交的
                    questID = G.DataMgr.questData.getAwardQuestsByNpcID(npcId, true, true)[0].m_iQuestID;
                    isGetQuest = false;
                }
            }
            else if (NPCQuestState.receive == questState) {
                if (0 == questID) {
                    questConfig = G.DataMgr.questData.getAcceptableQuestsByNpc(npcId, G.DataMgr.heroData)[0];
                }
                else {
                    questConfig = QuestData.getConfigByQuestID(questID);
                }

                if (KeyWord.QUEST_TYPE_GUILD_DAILY == questConfig.m_ucQuestType) {
                    questID = G.DataMgr.questData.nextGuildQuestID;
                }
                else if (KeyWord.QUEST_TYPE_GUO_YUN == questConfig.m_ucQuestType) {
                    questID = G.DataMgr.questData.nextGuoYunQuestID;
                }
                else {
                    questID = questConfig.m_iQuestID;
                }

                isGetQuest = true;  //接任务
            }
        }

        if (questID > 0) {
            questConfig = QuestData.getConfigByQuestID(questID);
            if (KeyWord.QUEST_TYPE_GUO_YUN == questConfig.m_ucQuestType && isGetQuest) {
                // 领取国运任务需要特殊的面板
                // dispatchEvent(new ArgsEvent(EventTypes.OpenCloseGuoyunDialog, EnumUICmd.OPEN));
                return;
            }
            if (!isGetQuest) {
                //G.AudioMgr.playSound(uts.format('sound/npc/{0}.mp3', npcId));
            }
            this.showQuestPanel(questID, isGetQuest, npcId);
        }
        else {
            // 按照正常流程根据传进来的参数一定会有questID，但是有些情况下还是可能拿不到的
            // 比如本来正在去接宗门任务的路上，突然间退出宗门了，寻路到NPC后找不到宗门任务了
            // 这时候就显示功能对话框

            this.showFuncDialog(npcId, 0);
        }
    }

    ///////////////////////////////////////// npc功能 /////////////////////////////////////////

    private showFuncDialog(npcId: number, questId: number = 0, unitId: number = 0): void {
        //展示功能面板
        this.taskCtn.SetActive(false);
        this.funcList.SetActive(true);
        this.m_currentQuestID = 0;
        this.m_unitID = unitId;
        this.updateOwner(npcId, questId);
        this.funcItemDatas.length = 0;
        this.heroNode.onHide();
        this.npcNode.onShow();
        this.npcNode.closeTimeText();
        if (GameIDUtil.isNPCID(npcId)) {
            this.npcNode.setTitleName(NPCData.getNpcConfig(npcId).m_szNPCName);
            this.setNpcFunctionList(npcId);
        }
        else if (GameIDUtil.isMonsterID(npcId)) {
            this.npcNode.setTitleName(MonsterData.getMonsterConfig(npcId).m_szMonsterName);
            this.m_scriptAction.getListData(npcId);
        }
        else {
            this.npcNode.setTitleName("");
        }
        this.removeTimer("1");
    }

    /**
    * 设置npc的功能菜单数据 
    * @param npcConfig
    * 
    */
    private setNpcFunctionList(id: number): void {
        let npcConfig: GameConfig.NPCConfigM = NPCData.getNpcConfig(id);

        // 取得npc的对白
        this.npcNode.setContent(NpcUtil.getNPCTalking(npcConfig));
        this.funcItemDatas = this.funcNpcAction.getListData(id, this.funcItemDatas);

        this.m_needListActivityLimit = true;
        // 获取脚本类功能
        this.m_scriptAction.getListData(id);
        this.updateFuncList();
    }

    private _sendListLimitRequest() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getListActivityLimitRequest());
        this.m_needListActivityLimit = false;
    }

    private updateFuncList() {
        let cnt = this.funcItemDatas.length;
        this.funcList.Count = cnt;
        let oldCnt = this.listItems.length;
        for (let i = 0; i < cnt; i++) {
            let item: NpcFuncItem;
            if (i < oldCnt) {
                item = this.listItems[i];
            } else {
                this.listItems.push(item = new NpcFuncItem());
                item.setComponents(this.funcList.GetItem(i).gameObject);
            }
            item.update(this.funcItemDatas[i]);
        }
    }

    private onClickFuncList(index: number) {
        let cnt = this.funcItemDatas.length;
        if (index < 0 || index >= cnt) {
            return;
        }

        let itemData = this.funcItemDatas[index];
        switch (itemData.type) {
            case KeyWord.NPC_FUNCTION_SCRIPT:
                this.m_scriptAction.action(itemData, this.m_ownerID, this.m_unitID);
                break;

            default:
                this.funcNpcAction.action(itemData.func, this.ownerID);
                break;
        }

        this.close();
    }

    onListMenuResponse(response: Protocol.ListMenu_Response): void {
        //将脚本的动态菜单加到已经存在的菜单里面去
        // 清除旧的脚本功能
        let len = this.funcItemDatas.length;
        for (let i = len - 1; i >= 0; i--) {
            if (this.funcItemDatas[i].type == KeyWord.NPC_FUNCTION_SCRIPT) {
                this.funcItemDatas.splice(i, 1);
            }
        }

        this.m_scriptAction.getScriptMenuData(response.m_stMenuNodeList, this.m_unitID, this.funcItemDatas);//动态菜单
        this.updateFuncList();

        if ('' != response.m_stMenuNodeList.m_szMenuCaption) {
            this.heroNode.onHide();
            this.npcNode.onShow();
            this.npcNode.closeTimeText();
            this.npcNode.setContent(response.m_stMenuNodeList.m_szMenuCaption);
        }

        // 如果有动态菜单，则拉取活动限制数据
        if (this.m_needListActivityLimit && len > 0) {
            this._sendListLimitRequest();
        }
    }

    /**
    * 更新NPC。
    * @param npcID
    *
    */
    private updateOwner(ownerId: number, questId: number): void {
        this.m_ownerID = ownerId;
        this.heroNode.onHide();
        this.npcNode.onShow();
        if (GameIDUtil.isNPCID(ownerId)) {
            let config = NPCData.getNpcConfig(ownerId);
            let pid: number = config.m_iNPCHeadPortrait;
            this.npcNode.setTitleName(config.m_szNPCName);
            this.setImage(pid.toString(), questId);
        }
        else {
            this.npcNode.setTitleName("");
        }
    }

    private showQuestPanel(questID: number, isGetQuest: boolean, npcId: number): void {
        this.m_currentQuestID = questID;
        this.m_isGetQuest = isGetQuest;
        this.m_ownerID = npcId;
        this.taskCtn.SetActive(true);
        this.funcList.SetActive(false);
        let config: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(this.m_currentQuestID);
        uts.assert(null != config, uts.format('_showQuestPanel, questID={0}', questID));
        if (config == null || config.m_szQuestDescription == "") {
            this.npcNode.onShow();
            this.heroNode.onHide();
            this.npcNode.updataNode(config, isGetQuest);
        }
        else {
            this.npcNode.onHide();
            this.heroNode.onShow();
            this.heroNode.updataNode(config, isGetQuest);
        }
    }

    /**
    * 设置对话框图片。
    * @param name 图片名称，注意图片存放在npcdialog文件夹里。
    */
    private setImage(name: string, questId: number): void {
        let config: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(questId);
        if (config == null || config.m_szQuestDescription == "") {
            // this.LoadModel(name, UnitCtrlType.npc);
            this.npcNode.refreshModel(name, true);
        }
        else {
            // this.LoadHeroModel();
            this.heroNode.refreshModel(name, false);
        }
    }

    //加载对话框NPC模型
    // private LoadModel(modelId: string, type: UnitCtrlType) {
    //     G.ResourceMgr.loadModel(this.modelRoot, type, modelId, 0);
    //     this.addTimer("playAnimator", 10, 1, this.setModleAnimator);
    // }

    // private LoadHeroModel() {
    //     let heroData: HeroData = G.DataMgr.heroData;
    //     this.roleAvatar.setAvataByList(heroData.avatarList, heroData.profession, heroData.gender);
    // }

    //先播放一次idle动画
    // private setModleAnimator() {
    //     let animator: UnityEngine.Animator = this.modelRoot.GetComponentInChildren(UnityEngine.Animator.GetType()) as UnityEngine.Animator;
    //     if (animator != null) {
    //         animator.Play("idle");
    //     }
    // }

    // private setNpcTask(name: string) {
    //     this.backNode.SetActive(true);
    //     this.heroBackNode.SetActive(false);
    //     //设置npc的图片
    //     G.ResourceMgr.loadImage(this.npcIcon, uts.format("images/npc/{0}.png", name));

    //     //按钮 计时
    //     Game.Tools.SetAnchorMin(this.rectButton, 1, 0);
    //     Game.Tools.SetAnchorMax(this.rectButton, 1, 0);
    //     Game.Tools.SetAnchoredPosition(this.rectButton, -100, 65);
    //     Game.Tools.SetAnchorMin(this.rectTime, 1, 0);
    //     Game.Tools.SetAnchorMax(this.rectTime, 1, 0);
    //     Game.Tools.SetAnchoredPosition(this.rectTime, -100, 105);

    //     //内容 
    //     Game.Tools.SetAnchoredPosition(this.rectContent, 50, 114);
    // }

    // private setHeroTask() {
    //     this.backNode.SetActive(false);
    //     this.heroBackNode.SetActive(true);
    //     //头像
    //     this.imgHeroIconMan.SetActive(G.DataMgr.heroData.profession == 2);
    //     this.imgHeroIconWoman.SetActive(G.DataMgr.heroData.profession == 1);

    //     //按钮 计时
    //     Game.Tools.SetAnchorMin(this.rectButton, 0, 0);
    //     Game.Tools.SetAnchorMax(this.rectButton, 0, 0);
    //     Game.Tools.SetAnchoredPosition(this.rectButton, 100, 65);
    //     Game.Tools.SetAnchorMin(this.rectTime, 0, 0);
    //     Game.Tools.SetAnchorMax(this.rectTime, 0, 0);
    //     Game.Tools.SetAnchoredPosition(this.rectTime, 100, 105);

    //     //名字
    //     this.txtHeroName.text = G.DataMgr.heroData.name;

    //     //内容 
    //     Game.Tools.SetAnchoredPosition(this.rectContent, -50, 114);
    //     // this.rectContent.sizeDelta=new UnityEngine.Vector2(-500,80);
    // }
    ///////////////////////////////////////// 公开接口 /////////////////////////////////////////
    get ownerID(): number {
        if (this.m_unitID != 0) {
            return this.m_unitID;
        }
        else {
            return this.m_ownerID;
        }
    }
    /**
* 是否正在显示指定的任务。
* @param questId 任务ID，优先于questType。
* @param questType 任务类型，当questId为0时则匹配任务类型。
* @return
*
*/
    isShowingQuest(questId: number = 0, questType: number = 0): boolean {
        if (this.isOpened && this.m_currentQuestID > 0) {
            if (questId > 0) {
                return this.m_currentQuestID == questId;
            }
            if (questType > 0) {
                return QuestData.getConfigByQuestID(this.m_currentQuestID).m_ucQuestType == questType;
            }
            return true;
        }
        return false;
    }
}

class TaskPanelItem {
    private gameObject: GameObjectGetSet;

    private txtName: TextGetSet;
    private txtContent: TextGetSet;
    private textCountDown: TextGetSet;

    private awardList: List;
    private awardItems: IconItem[] = [];
    private modelNode: GameObjectGetSet;
    private modelNodeTransform: UnityEngine.Transform;
    private btnFinish: GameObjectGetSet;

    private leftSeconds = 0;
    onClickFinishCallBack: () => void;
    private roleAvatar: UIRoleAvatar;
    private autoTimer: Game.Timer;

    setComponents(go: UnityEngine.GameObject, isnpc: boolean) {
        this.gameObject = new GameObjectGetSet(go);

        this.txtName = new TextGetSet(ElemFinder.findText(go, "txtName"));
        this.txtContent = new TextGetSet(ElemFinder.findText(go, "txtContent"));
        this.textCountDown = new TextGetSet(ElemFinder.findText(go, "textCountDown"));

        this.awardList = ElemFinder.getUIList(ElemFinder.findObject(go, "awardList"));
        this.modelNode = new GameObjectGetSet(ElemFinder.findObject(go, "modelNode/modelNode"));
        this.modelNodeTransform = ElemFinder.findTransform(go, "modelNode/modelNode");
        this.btnFinish = new GameObjectGetSet(ElemFinder.findObject(go, "textCountDown/btnFinsh"));

        Game.UIClickListener.Get(this.btnFinish.gameObject).onClick = delegate(this, this.onClickFinsh);

        if (!isnpc && null == this.roleAvatar) {
            this.roleAvatar = new UIRoleAvatar(this.modelNodeTransform, this.modelNodeTransform);
            this.roleAvatar.setRenderLayer(0);
            this.roleAvatar.hasWing = true;
            // this.roleAvatar.setSortingOrder(this.sortingOrder);
            this.roleAvatar.m_rebirthMesh.setRotation(20, 0, 0);
        }
    }

    private onClickFinsh() {
        if (this.onClickFinishCallBack != null)
            this.onClickFinishCallBack();
    }

    onShow() {
        this.gameObject.SetActive(true);
    }

    onHide() {
        this.gameObject.SetActive(false);
    }

    onClose() {
        if (this.autoTimer != null) {
            this.autoTimer.Stop();
            this.autoTimer = null;
        }
        this.clearAward();
    }
    setTitleName(name: string) {
        this.txtName.text = name;
    }

    setContent(con: string) {
        this.txtContent.text = con;
    }

    closeTimeText() {
        this.textCountDown.gameObject.SetActive(false);
    }

    openTimeText() {
        this.textCountDown.gameObject.SetActive(true);
    }

    clearAward() {
        this.awardList.Count = 0;
    }

    updataNode(config: GameConfig.QuestConfigM, isGetQuest: boolean) {
        // 任务描述
        this.txtContent.text = isGetQuest ? config.m_szQuestDialogPublished : config.m_szQuestDialogCompleted;
        // 标题和按钮状态
        let rewards: GameConfig.RewardThing[] = config.m_astRewardThingConfig;
        let things: Array<number> = new Array<number>(); // 只存放index
        let reward: GameConfig.RewardThing;
        let counter: number = rewards.length;
        for (let i = 0; i < config.m_ucRewardThingNumber; i++) {
            reward = config.m_astRewardThingConfig[i];
            if (null == reward || 0 != reward.m_ushTarget && G.DataMgr.heroData.profession != reward.m_ushTarget) {
                continue;
            }
            things.push(i);
        }
        //物品奖励
        let thingCount: number = things.length;
        this.awardList.Count = thingCount;

        for (let i = 0; i < thingCount; i++) {
            let item = this.awardItems[i];
            if (item == null) {
                item = new IconItem();
                item.setUsuallyIcon(this.awardList.GetItem(i).gameObject);
                item.setTipFrom(TipFrom.normal);
                this.awardItems[i] = item;
            }
            reward = config.m_astRewardThingConfig[things[i]];
            let dropNum = reward.m_iValue;
            if (KeyWord.QUEST_TYPE_GUO_YUN == config.m_ucQuestType) {
                if (G.DataMgr.heroData.guoyunLevel == 0) {
                    dropNum = 0;
                    break;
                }
                if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_DOUBLE_GUOYUN)) {
                    dropNum *= 2;
                }
            }
            /**更新奖励物品的图标*/
            item.updateById(reward.m_iThingID, dropNum);
            item.updateIcon();
        }

        if (G.DataMgr.heroData.level < Constants.QUEST_GUIDE_MAX_LV) {
            G.Uimgr.createForm<GuideArrowView>(GuideArrowView).open(this.btnFinish.gameObject, true);
        }

        this.textCountDown.gameObject.SetActive(true);
        this.leftSeconds = Constants.AutoDoTimeout;
        if (this.autoTimer != null) {
            this.autoTimer.Stop();
            this.autoTimer = null;
        }
        this.autoTimer = new Game.Timer("onAutoTimer", 1000, Constants.AutoDoTimeout, delegate(this, this.onAutoTimer));
        this.textCountDown.text = uts.format('{0}秒后自动领取', Constants.AutoDoTimeout);
    }

    private onAutoTimer(timer: Game.Timer) {
        this.leftSeconds -= timer.CallCountDelta;
        this.textCountDown.text = uts.format('{0}秒后自动领取', this.leftSeconds);
        if (this.leftSeconds <= 0) {
            this.onClickFinsh();
        }
    }

    refreshModel(name: string, isNpc: boolean) {
        if (isNpc) {
            this.LoadModel(name, UnitCtrlType.npc);
        }
        else {
            this.LoadHeroModel();
        }
    }

    //加载对话框NPC模型
    private LoadModel(modelId: string, type: UnitCtrlType) {
        G.ResourceMgr.loadModel(this.modelNode.gameObject, type, modelId, 0);
        //let timer = new Game.Timer("playAnimator", 10, 1, delegate(this, this.setModleAnimator));
    }

    //先播放一次idle动画
    private setModleAnimator(timer: Game.Timer) {
        let animator: UnityEngine.Animator = this.modelNode.gameObject.GetComponentInChildren(UnityEngine.Animator.GetType()) as UnityEngine.Animator;
        if (animator != null) {
            animator.Play("idle");
        }
    }

    private LoadHeroModel() {
        let heroData: HeroData = G.DataMgr.heroData;
        this.roleAvatar.setAvataByList(heroData.avatarList, heroData.profession, heroData.gender);
    }
}