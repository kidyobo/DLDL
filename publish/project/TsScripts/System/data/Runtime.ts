import { Macros } from 'System/protocol/Macros'
import { UnitController } from 'System/unit/UnitController'
import { HeroGotoType, EnumLoginStatus } from 'System/constants/GameEnum'

/**
 * 用于描述切场景原因的结构。
 * @author teppei
 * 
 */
export class ChangeScene {
    /**非特殊原因。*/
    static NONE: number = 0;

    /**进入副本。*/
    static ENTER_PINSTANCE: number = 1;

    /**离开副本。*/
    static LEAVE_PINSTANCE: number = 2;

    /**切场景的原因类型。*/
    type: number = 0;

    /**与切场景关联的副本ID。*/
    pinstanceId: number = 0;
   
    reset() {
        this.type = 0;
        this.pinstanceId = 0;
    }
}

/**
 * 
 * @author teppei
 * 
 */
interface IRuntimeStatus {
    reset(): void;
}

/**
 * 记录使用筋斗云的透传字段。
 * @author teppei
 * 
 */
export class ItemTransport implements IRuntimeStatus {
    targetID: number = 0;

    questID: number = 0;

    startBattle = false;

    copyFrom(other: ItemTransport) {
        this.targetID = other.targetID;
        this.questID = other.questID;
        this.startBattle = other.startBattle;
    }

    /**
     * 重置。
     * 
     */
    reset(): void {
        this.targetID = 0;
        this.questID = 0;
        this.startBattle = false;
    }

    isDoingQuest(): boolean {
        return this.questID > 0;
    }

    toString(): string {
        return uts.format('[ItemTransport]questID={0}, targetID={1}, startBattle={2}', this.questID, this.targetID, this.startBattle);
    }
}

/**
 * 接受任务或者提交任务跳跃信息存储。
 * @author teppei
 * 
 */
export class JumpVar implements IRuntimeStatus {
    questID: number = 0;

    nodeIndex: number = 0;

    sceneTarget: UnitController;

    gotoSkill: GameConfig.SkillConfigM;

    gotoType: HeroGotoType = 0;

    npcID: number = 0;

    /**前往的位置。*/
    gotoPos: UnityEngine.Vector2;
    keepAway = 0;

    /**中间跳跃点起点*/
    jumpPos: Game.Vector2[] = [];
    jumpFirstID: number = 0;

    copyFrom(other: JumpVar) {
        this.questID = other.questID;
        this.nodeIndex = other.nodeIndex;
        this.sceneTarget = other.sceneTarget;
        this.gotoSkill = other.gotoSkill;
        this.gotoType = other.gotoType;
        this.npcID = other.npcID;
        this.gotoPos = other.gotoPos;
        this.keepAway = other.keepAway;
        this.jumpPos = uts.deepcopy(other.jumpPos, this.jumpPos, true);
        this.jumpFirstID = other.jumpFirstID;
    }

    reset(): void {
        this.questID = 0;
        this.nodeIndex = 0;
        this.resetTargets();
    }

    resetTargets(): void {
        this.sceneTarget = null;
        this.gotoType = 0;
        this.gotoSkill = null;
        this.npcID = 0;
        this.gotoPos = null;
        this.keepAway = 0;
        this.jumpPos.length = 0;
        this.jumpFirstID = 0;
    }

    setTarget(target: UnitController, gotoType: HeroGotoType, gotoSkill: GameConfig.SkillConfigM = null): void {
        if (null != this.sceneTarget && this.sceneTarget != target) {
            this.resetTargets();
        }
        this.sceneTarget = target;
        this.gotoType = gotoType;
        this.gotoSkill = gotoSkill;
    }

    setNpcId(id: number): void {
        this.resetTargets();
        this.npcID = id;
    }

    setGotoPos(x: number, y: number, gotoType: number, keepAway = 0): void {
        this.gotoPos = new UnityEngine.Vector2(x, y);
        this.gotoType = gotoType;
        this.keepAway = keepAway;
    }

    setQuestInfo(questID: number, nodeIndex: number): void {
        // 设置任务信息，不能抹掉target，因为要先走到target再处理任务
        this.questID = questID;
        this.nodeIndex = nodeIndex;
    }

    isDoingQuest(): boolean {
        return this.questID > 0;
    }

    get isActive(): boolean {
        return this.questID > 0 || null == this.sceneTarget || null != this.gotoSkill || this.npcID > 0;
    }
}

/**
 * 移动目标。
 * @author teppei
 * 
 */
export class MoveTarget implements IRuntimeStatus {
    /**场景中的目标单位。*/
    sceneTarget: UnitController;

    /**当前场景中的目标坐标。*/
    skillPos: UnityEngine.Vector2 = new UnityEngine.Vector2(0, 0);

    npcID: number = 0;

    questID: number = 0;

    questNodeIdx: number = 0;

    /**到达目的地自动战斗的目标对象*/
    monsterID: number = 0;

    goHangUp = false;

    copyFrom(other: MoveTarget) {
        this.sceneTarget = other.sceneTarget;
        this.skillPos.Set(other.skillPos.x, other.skillPos.y);
        this.npcID = other.npcID;
        this.questID = other.questID;
        this.questNodeIdx = other.questNodeIdx;
        this.monsterID = other.monsterID;
    }

    reset(): void {
        this.resetTargets();
        this.questID = 0;
    }

    resetTargets(): void {
        this.sceneTarget = null;
        this.npcID = 0;
        this.monsterID = 0;
        this.goHangUp = false;
        this.skillPos.Set(0, 0);
    }

    setTarget(target: UnitController): void {
        if (null != this.sceneTarget && this.sceneTarget != target) {
            this.resetTargets();
        }
        this.sceneTarget = target;
    }

    /**
     * 设置移动目的是走向目标坐标并释放技能。
     * @param x
     * @param y
     * 
     */
    setSkillPos(x: number, y: number): void {
        this.reset();
        this.skillPos.Set(x, y);
    }

    setNpcId(id: number): void {
        this.resetTargets();
        this.npcID = id;
    }

    setMonsterID(id: number) {
        this.resetTargets();
        this.monsterID = id;
    }

    setHangUp(monsterID: number) {
        this.resetTargets();
        this.monsterID = monsterID;
        this.goHangUp = true;
    }

    setQuestInfo(questID: number, questNodeIdx: number): void {
        this.resetTargets();
        this.questID = questID;
        this.questNodeIdx = questNodeIdx;
    }

    isDoingQuest(): boolean {
        return this.questID > 0;
    }

    toString(): string {
        return uts.format('[MoveTarget]questID={0}, npcID={1}, monsterID={2}, sceneTarget={3}', this.questID, this.npcID, this.monsterID, null != this.sceneTarget ? this.sceneTarget.toString() : 'NULL');
    }
}

/**
 * 用于存放做任务时等待切场景或进出副本的状态。
 * @author teppei
 * 
 */
export class WaitQuest implements IRuntimeStatus {

    /**做任务时等待进出副本事件的关联副本Id。*/
    questPinstanceId: number = 0;

    /**做任务时等待场景加载完成事件的关联场景Id。*/
    questSceneId: number = 0;

    copyFrom(other: WaitQuest) {
        this.questPinstanceId = other.questPinstanceId;
        this.questSceneId = other.questSceneId;
    }

    reset(): void {
        this.questPinstanceId = 0;
        this.questSceneId = 0;
    }

    isDoingQuest(): boolean {
        return this.questPinstanceId > 0 || this.questSceneId > 0;
    }

    toString(): string {
        return uts.format('[WaitQuest]questPinstanceId={0}, questSceneId={1}', this.questPinstanceId, this.questSceneId);
    }
}

/**
 * 用来记录游戏运行时的一些数据。
 * @author teppei
 * 
 */
export class Runtime {
    /**当前登录状态*/
    loginStatus: EnumLoginStatus = EnumLoginStatus.none;

    /**是否正在创角*/
    isCreatingRole: boolean = false;

    /**首次开启国运的时候强制接一次*/
    forceGuoYun = false;

    /**本次寻路的长度*/
    pathDistance = 0;

    /**首次开启国运的时候不提示继续*/
    noContinueGuoYun = false;

    /**是否输出战斗日志*/
    __logBattle = false;

    /**是否丢弃技能通知*/
    __noSkillNotify = false;

    appPausedAt = 0;

    /**是否曾经成功进入场景*/
    everEnterScene = false;

    /**引导mgr启动*/
    guideStarted = false;

    /**角色是否在安全区。*/
    isInSafety = false;

    /**是否冻结所有功能，进入锁仙台后将设置为true。*/
    isAllFuncLocked = false;

    /**上一次成功进入场景的时间。*/
    lastEnterSceneCompleteAt: number = 0;

    /**上一次活跃时间，单位秒*/
    lastActiveAt = 0;

    /**上一次移动鼠标的时间，单位秒。*/
    lastMouseActionTime = 0;

    /**上一次点击领取任务/领取奖励按钮的时间。*/
    lastSafeClickTime: number = 0;

    /**上一次点击领取任务/领取奖励按钮的鼠标位置x坐标。*/
    lastSafeClickStageX: number = 0;

    /**上一次点击领取任务/领取奖励按钮的鼠标位置y坐标。*/
    lastSafeClickStageY: number = 0;

    /**上一次走停的时间，单位秒。*/
    lastWalkEnd = 0;

    /**上一次拾取物品的时间。*/
    lastGetDropTime: number = 0;

    /**上一次脱战时间，单位秒。*/
    lastOutOfFight: number = 0;

    /**是否已经提示过拾取物品太快。*/
    hasPromptGetDropLimit = false;

    /**正在等待拾取回复的掉落物ID。*/
    waitingDropRespUnitID: number = 0;

    /**是否正在等候上马回复。*/
    isWaitingRideResp = false;

    /**是否正在自动战斗中。*/
    isHangingUp = false;

    /**上一次释放技能的时间*/
    lastCastSkillAt = 0;

    /**是否需要引导变强*/
    guideBianQiang = false;

    /**挂机是打怪还是采集。<CODE>true</CODE>表示战斗，<CODE>false</CODE>表示采集。*/
    hangUpIsBattleOrCollect = false;

    /**临死前是否正在自动战斗。*/
    isHangingUpBeforeDie = false;

    /**暂停挂机前的副本。*/
    pauseHangingUpPinstance: number = 0;

    /**切场景原因。*/
    changeScene: ChangeScene = new ChangeScene();

    /**玩家自己走向的目标*/
    moveTarget: MoveTarget = new MoveTarget();
    /**副本，用于状态恢复*/
    private moveTargetBak: MoveTarget = new MoveTarget();

    /**做任务时等候切场景或进出副本等状态。*/
    waitQuest: WaitQuest = new WaitQuest();
    /**副本，用于状态恢复*/
    private waitQuestBak: WaitQuest = new WaitQuest();

    /**使用筋斗云传送的目的原因等。*/
    itemTransport: ItemTransport = new ItemTransport();
    /**副本，用于状态恢复*/
    private itemTransportBak: ItemTransport = new ItemTransport();

    /**领取任务或提交任务跳跃的状态。*/
    jumpVar: JumpVar = new JumpVar();
    /**副本，用于状态恢复*/
    private jumpVarBak: JumpVar = new JumpVar();

    /**做任务相关的任务ID。*/
    private m_relatedQuestID: number = 0;
    /**副本，用于状态恢复*/
    private m_relatedQuestIDBak: number = 0;

    /**做任务相关的任务节点。*/
    private m_relatedNodoIndex: number = 0;
    /**副本，用于状态恢复*/
    private m_relatedNodoIndexBak: number = 0;

    /**用户手动做的任务ID。*/
    pickQuestID: number = 0;

    /**是否需要引导门派任务。*/
    needGuideProfQuest = false;

    /**是否锁定RightPanel页签。*/
    isRightTabLocked = false;

    /**主动上下马的状态。这并不表示当前是否正在骑马，而是表示上次玩家主动切换上下马的请求。第一次上线默认为上坐骑状态*/
    rideStatus: number = Macros.MountRide_Up;

    /**聊天验证码。*/
    chatCheckCrc: string;

    /**是否可显示传送提示框。*/
    canShowTransportCfmDlg: boolean = true;

    /**是否正在等待传送回复。*/
    isWaitTransprotResponse = false;

    /**副本里等候寻路的怪物id*/
    waitPathingPinstanceMonsterId: number = 0;

    /**是否需要传送*/
    needTransport = false;

    /**是否需要天仙降落*/
    needLand = false;

    /**上一次检查攻击距离的时间*/
    lastCheckSkillDistanceAt = 0;

    /**最后一次进入的世界boss的id*/
    lastWorldBossId = 0;

    /**测试时段活动*/
    __testact: boolean = false;

    /**是否正在debug*/
    __isDebugging = false;

    /**本次登录是否是新建角色*/
    isNewRole = false;

    /**最近一次角色升级时间*/
    levelUpLastTime = 0;

    /**最近一次发送的消息类型*/
    chatType = 0;
    /**最近一次发送的消息内容*/
    chatMsg = '';

    lastRideOnOffAt = 0;

    __tip_id = 0;

    /**是否处于录制广告视频环境*/
    __adVideo = false;

    /**终极进阶装备所在位置*/
    equipPos: number = 0;
    /**终极进阶装备装备数据*/
    oneSlotInfo: Protocol.ContainerSlotInfo =null;
    /**排行榜数据*/
    oneRankInfo: Protocol.OneRankInfo = null;
    /**装备位套装激活需要的位置，后台没*/
    slotSuitPart: number = -1;

    /**在主界面宗门拍卖已经提示过*/
    inMainGuildPaiMaiHasTip: boolean = false;
    /**在主界面宗门拍卖已经提示过*/
    inMainWorldPaiMaiHasTip: boolean = false;
    /**拍卖是否需要提示*/
    paiMaiNeedTip: boolean = false;
    /**当前拍卖类型，在我的竞拍中需要知道*/
    curPaiMaiType: number = 0;
    /**是否有拍卖数据*/
    paiMaiHaveData: boolean = false;

    /**世界拍卖是否需要提示*/
    worldPaiMaiShouldTip: boolean = false;
    /**登陆首次显示近节日红点*/
    isFirstShouldShowJJRTipMark: boolean = true;

    /**邀请组队不在提示*/
    inviteNotTip: boolean = false;

    lastClickInvitePlayerTime: number = 0;
    /**是否有新的宗门消息*/
    hasNewGuildChatMsg: boolean = false;
    /**当前boss进入层*/
    curBossHomeLayer: number = 0;
    /**极星通天塔，会出现先通知后复活面板，改用缓存处理*/
    reliveTipType: number = -1;
    resetWhenLogin() {
        this.isWaitingRideResp = false;
        this.isWaitTransprotResponse = false;
    }

    /**
     * 重置所有拾取物品相关的记录。
     * 
     */
    resetGetDrop(): void {
        this.lastGetDropTime = 0;
        this.hasPromptGetDropLimit = false;
    }

    /**
     * 制作状态副本，用于错误恢复。
     */
    makeCopy() {
        this.moveTargetBak.copyFrom(this.moveTarget);
        this.waitQuestBak.copyFrom(this.waitQuest);
        this.jumpVarBak.copyFrom(this.jumpVar);
        this.itemTransportBak.copyFrom(this.itemTransport);
        this.m_relatedQuestIDBak = this.m_relatedQuestID;
        this.m_relatedNodoIndexBak = this.m_relatedNodoIndex;
    }

    /**
     * 回滚到上一次状态拷贝。
     */
    recover2lastCopy() {
        this.moveTarget.copyFrom(this.moveTargetBak);
        this.waitQuest.copyFrom(this.waitQuestBak);
        this.jumpVar.copyFrom(this.jumpVarBak);
        this.itemTransport.copyFrom(this.itemTransportBak);
        this.m_relatedQuestID = this.m_relatedQuestIDBak;
        this.m_relatedNodoIndex = this.m_relatedNodoIndexBak;
    }

    /**
     * 重置所有任务或传送相关的缓存状态。
     * 
     */
    resetAllBut(but: IRuntimeStatus = null): void {
        if (null == but || this.moveTarget != but) {
            this.moveTarget.reset();
        }
        if (null == but || this.waitQuest != but) {
            this.waitQuest.reset();
        }
        if (null == but || this.jumpVar != but) {
            this.jumpVar.reset();
        }
        if (null == but || this.itemTransport != but) {
            this.itemTransport.reset();
        }
        this.m_relatedQuestID = 0;
        this.m_relatedNodoIndex = 0;
    }

    /**
     * 设置做任务时的等候状态。sceneId和pinstanceId同时为0表示等候背包物品，两者不可同时非0。
     * @param questID 相关的任务ID。
     * @param sceneId 不为0表示等候切场景。
     * @param pinstanceId 不为0表示等候进出副本。
     * 
     */
    setWaitQuest(questID: number, sceneId: number = 0, pinstanceId: number = 0): void {
        this.resetAllBut();

        if (questID > 0) {
            if (defines.has('_DEBUG')) { uts.assert(0 == sceneId || 0 == pinstanceId, '不可同时大于0！'); }
            this.m_relatedQuestID = questID;
            if (sceneId > 0) {
                this.waitQuest.questSceneId = sceneId;
            }
            else if (pinstanceId > 0) {
                this.waitQuest.questPinstanceId = pinstanceId;
            }
        }
    }

    /**
     * 设置使用筋斗云传送的缓存信息。
     * @param npcID 传送的目的NPC或者怪物id。
     * @param questID 传送的相关人物。
     * @param startBattle 长时间不操作会自动传送进黑洞塔然后开启自动战斗
     * 
     */
    setItemTransport(targetID: number, questID: number, startBattle: boolean): void {
        this.resetAllBut();
        this.m_relatedQuestID = questID;
        this.itemTransport.targetID = targetID;
        this.itemTransport.questID = questID;
        this.itemTransport.startBattle = startBattle;
    }

    setMoveQuest(questID: number, nodeIndex: number = 0): void {
        this.resetAllBut();
        this.m_relatedQuestID = questID;
        this.m_relatedNodoIndex = nodeIndex;
        this.moveTarget.setQuestInfo(questID, nodeIndex);
    }

    resetMoveTargets() {
        this.moveTarget.resetTargets();
        this.moveTargetBak.resetTargets();
    }

    setJumpQuest(questID: number, nodeIndex: number = 0): void {
        this.resetAllBut(this.jumpVar);
        this.m_relatedQuestID = questID;
        this.m_relatedNodoIndex = nodeIndex;
        this.jumpVar.setQuestInfo(questID, nodeIndex);
    }

    get questID(): number {
        return this.m_relatedQuestID;
    }

    get questNodeIndex(): number {
        return this.m_relatedNodoIndex;
    }

    isDoingQuest(): number {
        if (this.m_relatedQuestID > 0 && (this.moveTarget.isDoingQuest() || this.waitQuest.isDoingQuest() || this.jumpVar.isDoingQuest() || this.itemTransport.isDoingQuest())) {
            return this.m_relatedQuestID;
        }

        return 0;
    }

    toString(): string {
        return uts.format('[Runtime]quest={0}, isWaitTransprotResponse={1}, isHangingUp={2}, MoveTarget={3}, WaitQuest={4}, itemTransport={5}', this.questID, this.isWaitTransprotResponse, this.isHangingUp, this.moveTarget.toString(), this.waitQuest.toString(), this.itemTransport.toString());
    }
}