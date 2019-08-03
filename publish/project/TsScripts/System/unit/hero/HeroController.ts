import { UnitController } from 'System/unit/UnitController'
import { RoleController } from 'System/unit/role/RoleController'
import { NpcController } from 'System/unit/npc/NpcController'
import { MonsterController } from 'System/unit/monster/MonsterController'
import { CollectMonsterController } from 'System/unit/monster/CollectMonsterController'
import { DropThingController } from 'System/unit/dropThing/DropThingController'
import { NPCData } from 'System/data/NPCData'
import { UnitData, HeroData } from 'System/data/RoleData'
import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Constants } from 'System/constants/Constants'
import { UnitCtrlType, HeroGotoType, PathingState, SceneID, EnumBuff, NPCQuestState, EnumTargetValidation, EnumMonsterRule, EnumLoginStatus } from 'System/constants/GameEnum'
import { MonsterData } from 'System/data/MonsterData'
import { SkillData } from 'System/data/SkillData'
import { CDData } from 'System/data/vo/CDData'
import { MathUtil } from 'System/utils/MathUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { TaskView, EnumTaskViewType } from 'System/quest/TaskView'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { UnitStatus } from 'System/utils/UnitStatus'
import { BuffData } from 'System/data/BuffData'
import { QuestData } from 'System/data/QuestData'
import { BoatView } from 'System/activity/view/BoatView'
import { MapView } from "System/map/view/MapView"
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { RoleAvatar } from "System/unit/avatar/RoleAvatar"
import { Profiler } from 'System/utils/Profiler'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { QuestAction, EnumMarriage } from 'System/constants/GameEnum'
import { MarryGuilderView } from 'System/Marry/MarryGuilderView'

export class HeroController extends RoleController {
    //摇杆移动相关
    private moveDirection: UnityEngine.Vector2;
    private beginCheckSend: boolean = false;
    private lastCheckSendTime: number = 0;

    private cacheFunc: any;
    private cacheParam: IArguments;

    //自动攻击
    private isAutoAttacking: boolean = false;
    public get IsAutoAttacking() {
        return this.isAutoAttacking;
    }
    private animPlayLeftTime: number = 0;
    private nowTime: number = 0;

    /**等待自动上马的时间*/
    private waitRideAt: number = 0;

    private lastTowardTarget: UnityEngine.Vector3;

    private heroUpdateTimer: Game.Timer;
    private nextCheckDistance = 1;
    private onApproachDel = null;
    public get Data() {
        return this.data as HeroData;
    }

    public onLoad() {
        super.onLoad();
        this.onApproachDel = delegate(this, this.onApproach);
        this.model.showShadow(true, true);
        this.model.setVisible(true, true);
        this.model.selectAble = false;
        this.model.useTeleport(true);
        this.model.tipWhenSaftyChange = true;
        this.model.avatar.defaultAvatar.setCullingMode(UnityEngine.AnimatorCullingMode.AlwaysAnimate);
        this.heroUpdateTimer = new Game.Timer("hero", 30, 0, delegate(this, this.onUpdate));
        G.setRangeLoaderListener(this.model.transform);
        G.ModuleMgr.SceneModule.loader.setHeroTransform(this.model.transform);
    }
    public onMoveEnd(byStop: boolean) {
        G.DataMgr.runtime.lastWalkEnd = UnityEngine.Time.realtimeSinceStartup;
        this.cancelAutoRideOn();
        if (this.isAboutToJumpOrJumping || this.IsJumping || this.IsLanding) {
            return;
        }

        if (!byStop) {
            this.processAfterSearchPath();
        }
        let mapView = G.Uimgr.getForm<MapView>(MapView);
        if (mapView != null) {
            mapView.drawPath();
        }
    }
    public onDead() {
        this.cacheFunc = null;
        this.cacheParam = null;
        G.Mapmgr.clearCrossPathData();
    }
    public onAddBuff(buffInfo: Protocol.BuffInfo) {
        // 昏迷、定身、沉默之后停止攻击
        let buffConfig: GameConfig.BuffConfigM = BuffData.getBuffByID(buffInfo.m_iBuffID);
        if (BuffData.isBuffHaveComa(buffConfig) ||
            BuffData.isBuffHaveFreze(buffConfig) ||
            BuffData.isBuffHaveSilence(buffConfig)) {
            this.clearStatus(false, true, true, false);
        }
        super.onAddBuff(buffInfo);
    }
    private onUpdate() {
        let runtime = G.DataMgr.runtime;
        if (runtime.isWaitTransprotResponse) {
            return;
        }

        let nowInSecond = UnityEngine.Time.realtimeSinceStartup;
        this.nowTime = nowInSecond;
        if (this.cacheFunc != null) {
            if (this.cancelAble == true) {
                if (this.Data.isAlive) {
                    let cacheFunc = this.cacheFunc;
                    let cacheParam = this.cacheParam;
                    this.cacheFunc = null;
                    this.cacheParam = null;
                    cacheFunc.apply(this, cacheParam);
                }
            }
        }
        else {
            let currentPos = this.getWorldPosition();
            if (this.moveDirection != null && this.lastTowardTarget && (!this.isMoving || UnityEngine.Vector3.Distance(this.lastTowardTarget, currentPos) < this.nextCheckDistance)) {
                this.beginMoveToward(this.moveDirection);
            }
            else {
                if (this.isAutoAttacking == true) {
                    this.attackAutoInternal(false);
                } else {
                    if (HeroGotoType.ATTACK == this.Data.gotoType && this.isMoving &&
                        null != runtime.moveTarget.sceneTarget &&
                        nowInSecond - runtime.lastCheckSkillDistanceAt > 0.3 && runtime.pathDistance >= 500) {
                        // 可能对方也在对你冲过来，因此需要隔一段时间重新检查下施法距离是否合适
                        runtime.lastCheckSkillDistanceAt = nowInSecond;
                        this.attackAutoInternal(false);
                    }
                }
            }
        }
        ////检查数据包发送
        //this.checkMoveSend(nowInSecond);
        if (this.waitRideAt > 0 && nowInSecond - runtime.lastOutOfFight >= 2) {
            // 只有上次自己请求上马后，如果被自动下马，才会随后自动上马
            if (!runtime.isWaitingRideResp && //上马消息回复完毕 
                (runtime.rideStatus == Macros.MountRide_Up || // 如果是被后台下马的，下次继续上马 
                    //G.DataMgr.runtime.isHangingUp || // 如果是自动挂机中 则上马
                    G.Mapmgr.isPathing)) // 如果是自动寻路中上马
            {
                if (this.canRideOn()) {
                    runtime.isWaitingRideResp = true;
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMountRideRequst(Macros.MountRide_Up));
                }
            }
        }
    }
    /**
     * 进入场景后，需要调用此函数，根据数据设置玩家的状态，包括走路路径等。
     */
    updateByHeroData() {
        this.onUpdateNameboard(null);
        this.updateTitle();
    }

    /**
	* 处理寻路结束后的逻辑。
	*
	*/
    processAfterSearchPath(): void {
        // 去掉自动寻路标记
        let runtime = G.DataMgr.runtime;
        let crossPathData = G.Mapmgr.crossPathData;
        if (null != crossPathData && 0 != crossPathData.length) {
            return;
        }
        let jumpVar = runtime.jumpVar;
        if (null != jumpVar.jumpPos && (jumpVar.jumpPos.length > 0 || jumpVar.gotoPos)) {
            return;
        }
        G.Mapmgr.stopAutoPath();

        let sceneTarget = runtime.moveTarget.sceneTarget;
        let npcID = runtime.moveTarget.npcID;
        let goHangUp = runtime.moveTarget.goHangUp;
        let monsterID = runtime.moveTarget.monsterID;

        if (null != sceneTarget) {
            // 继续走向指定的目标
            runtime.resetAllBut();
            G.Mapmgr.moveToTarget(sceneTarget);
        }
        else if (0 != npcID) {
            // 继续走向NPC
            runtime.resetAllBut();
            G.Mapmgr.moveHeroToTargetID(G.DataMgr.sceneData.curSceneID, npcID);
        }
        else if (goHangUp) {
            runtime.resetAllBut();
            G.ModuleMgr.deputyModule.startEndHangUp(true, monsterID, EnumMonsterRule.specifiedFirst);
        } else if (0 != monsterID) {
            runtime.resetAllBut();
            G.Mapmgr.moveHeroToTargetID(G.DataMgr.sceneData.curSceneID, monsterID);
        }
        else {
            if ((null == crossPathData || 0 == crossPathData.length) && 0 != runtime.moveTarget.questID) {
                // 任务寻路结束，继续做任务
                let questID = runtime.moveTarget.questID;
                let nodeIndex = runtime.moveTarget.questNodeIdx;
                runtime.resetAllBut();
                G.ModuleMgr.questModule.onQuestWalkEnd(questID, nodeIndex);
            }
            else {
                let skillPos = runtime.moveTarget.skillPos;
                if (skillPos.x > 0 && skillPos.y > 0 && MathUtil.vector2Equals(skillPos, this.getPixelPosition(), 5)) {
                    // 到达技能释放坐标点
                    runtime.resetAllBut();
                    this.attackAuto();
                }
            }
        }
    }

    /**
	* 走到的目标的身边的逻辑处理
	*
	*/
    onReachTarget(): void {
        // 先把目标数据拷贝出来
        let runtime = G.DataMgr.runtime;
        let target = runtime.moveTarget.sceneTarget;
        let npcId = runtime.moveTarget.npcID;

        // 必须马上将原有的target清除掉
        runtime.resetMoveTargets();

        if (null != target) {
            // 有目标单位
            if (UnitCtrlType.npc == target.Data.unitType) //显示NPC对话
            {
                this.onReachNPC(target.Data.id);
            }
            else if (UnitCtrlType.dropThing == target.Data.unitType) {
                G.ModuleMgr.SceneModule.getDropThing(target as DropThingController);
            }
            else if (UnitCtrlType.role == target.Data.unitType) //其他人
            {
                this._onReachRole(target);
            }
            else if (UnitCtrlType.monster == target.Data.unitType) {
                this._onReachMonster(target as MonsterController);
            }
            else if (UnitCtrlType.collection == target.Data.unitType) {
                this._onReachCollectedMonster(target as CollectMonsterController);
            }
        } else if (npcId > 0) {
            this.onReachNPC(npcId);
        }
    }

    /**
	* 走到npc附近的逻辑
	*
	*/
    onReachNPC(npcId: number): void {
        if (G.DataMgr.npcData.canInterate(npcId)) {
            if (!NPCData.isStatueNpc(NPCData.getNpcConfig(npcId))) {
                let npc = G.UnitMgr.getNpc(npcId);
                if (null != npc) {
                    let position = this.getWorldPosition();
                    let targetPos = npc.getWorldPosition();
                    //调整npc的方向
                    npc.setDirection(UnitUtil.getDirection3D(targetPos.x, targetPos.z, position.x, position.z));
                    G.UnitMgr.selectUnit(npc.Data.id, true);
                }

                //显示npc的对话框
                let questID = 0;
                if (G.DataMgr.runtime.moveTarget.questID > 0) {
                    questID = G.DataMgr.runtime.moveTarget.questID;
                    G.DataMgr.runtime.resetAllBut();
                }

                if (questID <= 0) {
                    // 检查是否有可以领取奖励的任务
                    let questConfigs: GameConfig.QuestConfigM[] = G.DataMgr.questData.getAwardQuestsByNpcID(npcId, true, true);
                    if (questConfigs.length > 0) {
                        questID = questConfigs[0].m_iQuestID;
                    }
                    else {
                        // 检查是否有可以接的任务
                        questConfigs = G.DataMgr.questData.getAcceptableQuestsByNpc(npcId, G.DataMgr.heroData, 0);
                        if (questConfigs.length > 0) {
                            questID = questConfigs[0].m_iQuestID;
                        }
                    }
                }

                if (questID > 0 && KeyWord.QUEST_TYPE_GUO_YUN == QuestData.getConfigByQuestID(questID).m_ucQuestType && !G.DataMgr.questData.isQuestCompletingByID(questID)) {
                    // 领取国运任务打开国运对话框
                    G.Uimgr.createForm<BoatView>(BoatView).open();
                } else {
                    if (npcId == EnumMarriage.HONGNIANG_NPC) {
                       /* G.Uimgr.createForm<MarryGuilderView>(MarryGuilderView).open()*/;
                        if (questID > 0) {
                            G.ViewCacher.taskView.open(EnumTaskViewType.none, npcId, 0, NPCQuestState.noQuest, questID);
                        }
                    } else {
                        G.ViewCacher.taskView.open(EnumTaskViewType.none, npcId, 0, NPCQuestState.noQuest, questID);
                    }
                }
            }
        }
    }

    private _onReachRole(role: UnitController): void {
        if (this.Data.gotoType == HeroGotoType.ATTACK) {
            if (EnumTargetValidation.ok == G.BattleHelper.isValidTarget(role, false, false)) {
                G.ModuleMgr.skillModule.castSkill(0, true, true);
            }
        }
    }

    private _onReachCollectedMonster(monster: CollectMonsterController): void {
        if (G.DataMgr.runtime.isHangingUp) {
            G.ViewCacher.mainUIEffectView.stopPathingEffect();
        }
        if (this.Data.gotoType == HeroGotoType.PICK_MONSTER) {
            // 当是采集怪的时候
            let monsterID: number = monster.Data.id;

            let skillID: number = MonsterData.getMonsterConfig(monsterID).m_iCollectionSkill;
            if (defines.has('_DEBUG')) {
                uts.assert(skillID != 0, '艹，怪物没有配采集技能：' + monsterID);
            }

            let skillConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(skillID);
            let cdData: CDData = G.DataMgr.cdData.getCdDataBySkill(skillConfig)
            if (null != cdData) {
                G.TipMgr.addMainFloatTip('采集正在冷却!', Macros.PROMPTMSG_TYPE_MIDDLE);
            }
            else {
                // 中间怪物可能从视野中移除导致选中态消失，这里要补一下
                if (null == G.UnitMgr.SelectedUnit) {
                    G.UnitMgr.selectUnit(monster.Data.unitID, false);
                }
                G.ModuleMgr.skillModule.castSkill(skillConfig.m_iSkillID, true, false);
            }
        }
    }

    private _onReachMonster(monster: MonsterController): void {
        if (G.DataMgr.runtime.isHangingUp) {
            G.ViewCacher.mainUIEffectView.playHangupEffect();
        }
        let gotoType = this.Data.gotoType;
        if (gotoType == HeroGotoType.ATTACK || gotoType == HeroGotoType.ATTACK_AND_HANGUP) {
            if (EnumTargetValidation.ok == G.BattleHelper.isValidTarget(monster, false, false, null)) {
                // 中间怪物可能从视野中移除导致选中态消失，这里要补一下
                if (G.UnitMgr.SelectedUnit != monster) {
                    G.UnitMgr.selectUnit(monster.Data.unitID, false);
                }
                this.attackAuto();

                if (gotoType == HeroGotoType.ATTACK_AND_HANGUP) {
                    G.ModuleMgr.deputyModule.startEndHangUp(true, -1);
                }
            } else {
                uts.log('reach invalid monster: ' + monster.Data.unitID);
            }
        }
    }
    drag2pos(xPixel: number, yPixel: number, type: number = 0) {
        if (this.IsJumping) {
            // 跳跃时被拉扯，必须终止跳跃
            this.stopJump(false);
        }
        if (this.IsLanding) {
            this.stopLand();
        }

        // todo 这里需要根据type进行不同的表现，这里只是先简单的设置坐标
        this.setPixelPosition(xPixel, yPixel, type);
    }

    get isGoing2GetDrop(): boolean {
        return (HeroGotoType.GET_SINGLE_DROP == this.Data.gotoType || HeroGotoType.GET_MULTI_DROP == this.Data.gotoType) && this.isMoving;
    }

    jumpByTeleports(nodes: number[], destPos: Protocol.UnitPosition, callback: () => void = null): void {
        super.jumpByTeleports(nodes, destPos, callback);
    }


    //当前单位是否可以取消当前动作
    public get cancelAble(): boolean {
        if (G.ViewCacher.collectionBar.hasShowCollection) {
            return true;
        }
        if (this.model == null) {
            return false;
        }
        if (this.IsLanding || this.IsJumping) {
            return false;
        }
        if (UnitStatus.isDead(this.data.unitStatus)) {
            return false;
        }
        if (this.buffProxy.isFreze || this.buffProxy.isComa) {
            return false;
        }
        let avatar = this.model.avatar as RoleAvatar;
        if (this.state == UnitState.Fight) {
            return this.nowTime >= this.animPlayLeftTime;
        }
        return true;
    }

    /**
     * 取消自动上马。
     */
    cancelAutoRideOn() {
        this.waitRideAt = 0;
    }

    /**
	* 能否上马
	* @return
	*
	*/
    canRideOn(): boolean {
        //if (StoryGuide.ins.isStoryMap()) {
        //    return false;
        //}
        return this.Data.isAlive && this.cancelAble && !G.ViewCacher.collectionBar.hasShowCollection &&
            !this.isAboutToJumpOrJumping &&
            !G.DataMgr.runtime.isWaitTransprotResponse &&
            Macros.BATHE_SCENE_ID != G.DataMgr.sceneData.curSceneID &&
            !UnitStatus.isInRide(this.Data.unitStatus) &&
            !UnitStatus.isInFight(this.Data.unitStatus) &&
            !this.IsJumping &&
            !this.IsLanding &&
            !this.buffProxy.hasBuffByID(Macros.SPEED_BUFF_ID) &&
            !this.buffProxy.hasBuffByID(EnumBuff.CARRY_BUFF) &&
            !this.buffProxy.hasBuffByID(EnumBuff.QIZI_BUFF) &&
            G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.SUBBAR_FUNCTION_RIDE) &&
            G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_ZQJH);
    }

    canRideOff(): boolean {
        return this.Data.isAlive && !G.ViewCacher.collectionBar.hasShowCollection && UnitStatus.isInRide(this.Data.unitStatus) && !this.IsJumping && !this.IsLanding;
    }

    /**
     * 玩家当前的状态是否可由程序托管自动运行。
     * @return
     *
     */
    canAutoRun(checkFreeze: boolean): boolean {
        let r = !G.ViewCacher.collectionBar.hasShowCollection
            && !UnitStatus.isDead(this.data.unitStatus)
            && !this.buffProxy.isComa && (!checkFreeze || !this.buffProxy.isFreze);
        return r;
    }
    //------------------------小地图处理---------------------------
    //单位按制定路径开始移动
    public beginMoveWorld(path: UnityEngine.Vector3[]) {
        super.beginMoveWorld(path);
        let target = G.DataMgr.runtime.moveTarget.sceneTarget;
        if (null != target && target.Data.unitType == UnitCtrlType.monster) {
            this.model.tweenPath.onApproach = this.onApproachDel;
        }

        let mapView = G.Uimgr.getForm<MapView>(MapView);
        if (mapView != null) {
            mapView.drawPath();
        }

        let pathDistance = 0;
        let pLen = path.length;
        if (pLen > 0) {
            let start = this.model.getPosition();
            let end = path[pLen - 1];
            pathDistance += UnityEngine.Vector3.Distance(start, end);
        }
        if (this.moveDirection == null) {
            if (G.localPositionUnitToServerPixelUnit(pathDistance) > Constants.AutoRideMinDinstance) {
                this.waitRideAt = UnityEngine.Time.realtimeSinceStartup;
            } else {
                this.waitRideAt = 0;
            }
        }
    }

    private onApproach(distance: number) {
        let target = G.DataMgr.runtime.moveTarget.sceneTarget;
        if (null != target && target.Data.unitType == UnitCtrlType.monster) {
            if (distance >= Constants.ApproachMin / G.CameraSetting.xMeterScale && distance <= Constants.ApproachMax / G.CameraSetting.xMeterScale && (null == G.Mapmgr.crossPathData || 0 == G.Mapmgr.crossPathData.length) && !this.buffProxy.hasBuffByID(Macros.SPEED_BUFF_ID)) {
                if (UnitStatus.isInRide(this.Data.unitStatus)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMountRideRequst(Macros.MountRide_Down));
                }
                if (target.Data.unitID > 0) {
                    // 真实怪
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getAddSpeedBuffRequest(Macros.SPEED_BUFF_ID, false, target.Data.unitID));
                    G.MapCamera.radialBlurForSpeed();
                } else {
                    // 前台怪
                    let questID = G.UnitMgr.getQuestIdByClientMonster(target.Data.unitID);
                    if (questID > 0) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getAddSpeedBuffRequest(Macros.SPEED_BUFF_ID, true, questID));
                        G.MapCamera.radialBlurForSpeed();
                    }
                }
            }
        }
    }

    /**用于展示的行走路径*/
    public getMovePathForDisplay(): UnityEngine.Vector2[] {
        let ret: UnityEngine.Vector2[] = [];
        ret.push(this.getPixelPosition());
        if (null != this.model.tweenPath) {
            let wholePath = this.model.tweenPath.wholePath;
            if (null != wholePath) {
                let len = Game.ArrayHelper.GetArrayLength(wholePath);
                for (let i = 0; i < len; i++) {
                    let v3 = G.cacheVec3;
                    Game.Tools.GetVector3GroupItem(wholePath, i, v3);
                    let node2D = G.localPositionToServerPixel(v3);
                    ret.push(node2D);
                }
            }
        }
        return ret;
    }

    public getPathIndex(): number {
        if (null != this.model.tweenPath) {
            return this.model.tweenPath.pathIndex;
        }
        return 0;
    }
    public getPathFactor(): number {
        if (null != this.model.tweenPath) {
            return this.model.tweenPath.tweenFactor;
        }
        return 1;
    }


    //------------------------摇杆和移动逻辑-------------------------
    ///朝指定方向移动
    public beginMoveToward(direction: UnityEngine.Vector2) {
        //let time = UnityEngine.Time.realtimeSinceStartup;
        if (!this.moveable()) {
            return;
        }

        if (this.cancelAble == false) {
            this.cacheFunc = this.beginMoveToward;
            this.cacheParam = arguments;
            return;
        }
        G.ModuleMgr.deputyModule.startEndHangUp(false); // 清除任务标记
        // 清除任务标记
        G.DataMgr.runtime.resetAllBut();
        // 停止自动寻路
        G.Mapmgr.stopAutoPath();
        if (this.isAutoAttacking) {
            this.stopAttackAuto();
        }

        this.moveDirection = direction;
        this.moveTowardAndSendRequest();
        //uts.log("cost:" + (UnityEngine.Time.realtimeSinceStartup - time));
    }

    moveable(): boolean {
        if (this.IsJumping || this.IsLanding) {
            return false;
        }
        if (G.DataMgr.settingData.sceneHideFlag == 2) {
            // 四象斗兽场里不能动
            return false;
        }
        if (G.DataMgr.sceneData.curPinstanceID == Macros.PINSTANCE_ID_PVP) {
            //竞技场不让手动操作
            return false;
        }

        return true;
    }

    public stopMoveToward() {
        this.moveDirection = null;
        this.beginCheckSend = false;
        this.lastCheckSendTime = 0;
        if (this.cacheFunc == this.beginMoveToward) {
            this.cacheFunc = null;
            this.cacheParam = null;
        }
        if (this.state == UnitState.Move) {
            this.stopHeroMove(true, false);
        }
    }
    private navPath = new UnityEngine.NavMeshPath();
    private navHit = new UnityEngine.NavMeshHit();
    private moveTowardAndSendRequest() {
        let currentPos = this.getWorldPosition();
        let moveDelta = 10;
        let hit = UnityEngine.NavMesh.SamplePosition(G.getCacheV3(this.moveDirection.x * moveDelta + currentPos.x, currentPos.y, this.moveDirection.y * moveDelta + currentPos.z),
            this.navHit, 5, -1);
        let newPos: UnityEngine.Vector3;
        if (hit) {
            newPos = this.navHit.position;
        }
        else {
            this.lastTowardTarget = null;
            return;
        }
        UnityEngine.NavMesh.CalculatePath(currentPos, newPos, -1, this.navPath);
        if (this.navPath.status != UnityEngine.NavMeshPathStatus.PathComplete) {
            this.stopMoveToward();
            return;
        }
        let path = this.navPath.corners;
        var pathLength = Game.ArrayHelper.GetArrayLength(path);
        let serverList: Protocol.UnitPosition[] = [];
        let localPath = [];
        let startPixelX: number = G.localPositionXToServerPixelX(currentPos.x);
        let startPixelY: number = G.localPositionYToServerPixelY(currentPos.z);
        serverList.push({
            m_uiX: startPixelX,
            m_uiY: startPixelY
        });

        let now = UnityEngine.Time.realtimeSinceStartup;
        let cacheList = G.cacheV3List;
        for (let i = 1; i < pathLength; i++) {
            let v = cacheList[i];
            if (!v) {
                v = cacheList[i] = new UnityEngine.Vector3(0, 0, 0);
            }
            Game.Tools.GetVector3GroupItem(path, i, v);
            localPath.push(v);
            let p = {
                m_uiX: G.localPositionXToServerPixelX(v.x),
                m_uiY: G.localPositionYToServerPixelY(v.z)
            };
            serverList.push(p);
        }
        this.beginCheckSend = true;
        if (now - this.lastCheckSendTime > 0.2) {
            G.ViewCacher.collectionBar.close();
            let r = ProtocolUtil.getMovePositionResquest(serverList, -1);

            G.ModuleMgr.netModule.sendMsg(r);
            this.lastCheckSendTime = now;
        }
        this.lastTowardTarget = newPos;
        this.beginMoveWorld(localPath);
    }
    /**移动包序列*/
    private m_moveRequestSeq: number = 0;
    //单位按制定路径开始移动
    public moveAndInformServer(localPath: UnityEngine.Vector3[], serverPath: Protocol.UnitPosition[]) {
        if (G.DataMgr.settingData.sceneHideFlag == 2) {
            // 四象斗兽场里不能动
            return;
        }

        if (!this.Data.isAlive) {
            return;
        }
        if (this.isAutoAttacking) {
            this.stopAttackAuto();
        }
        if (this.cancelAble == false) {
            this.cacheFunc = this.moveAndInformServer;
            this.cacheParam = arguments;
            return;
        }

        G.ViewCacher.collectionBar.close();

        this.beginCheckSend = false;
        let moveSeq: number = ++this.m_moveRequestSeq;
        G.DataMgr.runtime.canShowTransportCfmDlg = true;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMovePositionResquest(serverPath, moveSeq));
        this.beginMoveWorld(localPath);
    };
    /**
     * 停止走路。
     * @param informSvr 是否通知后台。
     * @param stopAutoPath 是否同时停止自动寻路。
     */
    stopHeroMove(informSvr: boolean, stopAutoPath: boolean) {
        this.cacheFunc = null;
        this.cacheParam = null;

        // 检查当前的落点是否在阻挡里，如果是的话就拽出来
        let stopPos: UnityEngine.Vector2;
        let posPixel = this.getPixelPosition();
        if (null != this.model.tweenPath) {
            let movingTo = this.model.tweenPath.To;
            if (null != movingTo) {
                let nabor = G.Mapmgr.tileMap.SearchValidNabor(posPixel, G.localPositionToServerPixel(movingTo));
                if (nabor.x > 0 && (nabor.x != posPixel.x || nabor.y != posPixel.y)) {
                    stopPos = nabor;
                }
            }
        }

        // 先停止走路
        this.model.stopMove();
        if (null != stopPos) {
            // 当前落点在阻挡里，需要拽出来
            this.setPixelPosition(stopPos.x, stopPos.y);
        }

        if (informSvr) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMovePositionResquest(this.getStopMoveList(), -1));
        }

        if (stopAutoPath) {
            // 取消自动寻路特效
            G.Mapmgr.stopAutoPath();
        }
    }
    private getStopMoveList(): Protocol.UnitPosition[] {
        let startPos = this.getWorldPosition();
        let list = new Array<Protocol.UnitPosition>();
        let newX = G.localPositionXToServerPixelX(startPos.x);
        let newY = G.localPositionYToServerPixelY(startPos.z);
        list.push({ m_uiX: newX, m_uiY: newY });
        return list;
    }


    //-----------------------战斗逻辑-------------------------------


    public attackAuto(): boolean {
        if (this.isAutoAttacking) {
            return false;
        }
        if (this.cacheFunc != null) {
            return false;
        }
        return this.attackAutoInternal(true);
    }
    public stopAttackAuto() {
        this.isAutoAttacking = false;
    }
    private attackAutoInternal(needPromp: boolean): boolean {
        if (EnumLoginStatus.logined != G.DataMgr.runtime.loginStatus) {
            return false;
        }

        //Profiler.push('attackAutoInternal');
        let target = G.UnitMgr.SelectedUnit;
        //Profiler.push('isValidTarget');
        let vt = G.BattleHelper.isValidTarget(target, false, false);
        //Profiler.pop();
        if (EnumTargetValidation.ok != vt) {
            if (needPromp) {
                let desc = SkillData.getValidationDesc(vt);
                if (undefined != desc) {
                    G.TipMgr.addMainFloatTip(desc);
                }
            }
            this.stopAttackAuto();
            //目标可能已经死亡，不重置动画，否则单位会突然停止攻击动作
            //Profiler.pop();
            return false;
        }

        if (G.ViewCacher.collectionBar.hasShowCollection) {
            //Profiler.pop();
            return false;
        }
        this.isAutoAttacking = true;
        //Profiler.push('getAutoSkill');
        let skill: GameConfig.SkillConfigM = G.ModuleMgr.skillModule.getAutoSkill(true, G.DataMgr.runtime.isHangingUp);
        //Profiler.pop();
        if (null == skill) {
            //Profiler.pop();
            return false;
        }
        //if (SkillData.isNormalSkill(skill.m_iSkillID)) {
        //    uts.log('get auto skill: name = ' + skill.m_szSkillName + ', id = ' + skill.m_iSkillID);
        //}

        // 因castSkill里如果是前台怪的话怪同步死了，因此要在castSkill之前把positiion先取出来
        let targetPos = target.getWorldPosition();
        //Profiler.push('castSkill');
        let send = G.ModuleMgr.skillModule.castSkill(skill.m_iSkillID, needPromp, true);
        //Profiler.pop();
        if (send) {
            if (G.DataMgr.runtime.isHangingUp) {
                if (G.DataMgr.runtime.hangUpIsBattleOrCollect) {
                    G.ViewCacher.mainUIEffectView.playHangupEffect();
                    //if (SkillData.isNormalSkill(skill)) {
                    //    G.BattleHelper.checkSetFixedPoint();
                    //}
                    G.BattleHelper.checkSetFixedPoint();
                }
            } else {
                G.ModuleMgr.deputyModule.startEndHangUp(true, -1);
            }
        }
        //Profiler.pop();
        return send;
    }

    //使用指定动画对其他目标执行攻击动作，单位状态会切换到攻击
    public attackTarget(targetPos: UnityEngine.Vector3, aniName: string) {
        if (this.model == null) {
            uts.assert(false, "RoleController::attackTarget - 请不要对已经删除的单位进行操作");
            return null;
        }
        (this.model.avatar as RoleAvatar).rideDown();
        if (targetPos) {
            this.model.lookAt(targetPos);
        }
        this.specializedAttackName = aniName;
        this.model.changeState(UnitState.Fight, true);
        this.animPlayLeftTime = UnityEngine.Time.realtimeSinceStartup + this.model.avatar.defaultAvatar.getAnimationLength(aniName);
    }

    public triggerSkill(skillId: number) {
        // let target = G.UnitMgr.SelectedUnit;
        // if (target == null) {
        //     return false;
        // }
        let send = G.ModuleMgr.skillModule.castSkill(skillId, true, false);
        if (send && !G.DataMgr.runtime.isHangingUp && !G.DataMgr.runtime.__adVideo) {
            G.ModuleMgr.deputyModule.startEndHangUp(true, -1);
        }
    }

    private stopAttack(): boolean {
        if (this.state == UnitState.Fight) {
            G.DataMgr.runtime.resetMoveTargets();
            this.model.changeState(UnitState.Stand);
        }
        // 当前技能如果是连击且无法停下来的情况返回false，目前暂不处理
        return true;
    }

    clearStatus(stopJump: boolean, stopAttack: boolean, stopMove: boolean, informServerStopMove: boolean) {
        if (stopJump) {
            if (this.IsJumping) {
                // 跳跃时被拉扯，必须终止跳跃
                this.stopJump(false);
            }
            this.isAboutToJumpOrJumping = false;
        }
        if (stopAttack) {
            this.stopAttack();
            this.stopAttackAuto();
        }
        if (stopMove) {
            // 这里不能stopAutoPath，因为可能还要恢复寻路
            this.stopHeroMove(informServerStopMove, false);
        }
    }

    toString(): string {
        return uts.format('[Hero model={0} IsLanding={1} IsJumping={2} unitStatus={3} isFreze={4} isComa={5} state={6} isAutoAttacking={7} cancelAble={8} canAutoRun={9} isAboutToJumpOrJumping={10} armyID={11} pkMode={12} pkValue={13} campID={14} unitID={15}]',
            this.model ? 'Y' : 'N', this.IsLanding, this.IsJumping, this.data.unitStatus, this.buffProxy.isFreze, this.buffProxy.isComa, this.state, this.isAutoAttacking, this.cancelAble, this.canAutoRun(true), this.isAboutToJumpOrJumping,
            this.Data.armyID, this.Data.pkMode, this.Data.pkValue, this.Data.campID, this.Data.unitID);
    }
}
export default HeroController;