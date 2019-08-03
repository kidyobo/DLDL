import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { int } from 'System/utils/MathUtil'
import { RoleData, HeroData } from 'System/data/RoleData'
import { PinstanceData } from 'System/data/PinstanceData'
import { SceneData } from 'System/data/scenedata'
import { EnumBuff, PathingState, FindPosStrategy, SceneID, HeroGotoType, UnitCtrlType, EnumTargetValidation, EnumMonsterRule, EnumLoginStatus } from 'System/constants/GameEnum'
import { ErrorId } from 'System/protocol/ErrorId'
import { DeputySetting } from 'System/skill/DeputySetting'
import { UnitController } from 'System/unit/UnitController'
import { HeroController } from 'System/unit/hero/HeroController'
import { MonsterController } from 'System/unit/monster/MonsterController'
import { CollectMonsterController } from 'System/unit/monster/CollectMonsterController'
import { DropThingController } from 'System/unit/dropThing/DropThingController'
import { Macros } from 'System/protocol/Macros'
import { SceneModule } from 'System/scene/SceneModule'
import { GateInfo } from 'System/data/scene/GateInfo'
import { Constants } from 'System/constants/Constants'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { UnitStatus } from 'System/utils/UnitStatus'
import { KeyWord } from 'System/constants/KeyWord'
import { Profiler } from 'System/utils/Profiler'

/**
 * 辅助战斗协助类。
 * @author xiaojialin
 * 
 */
export class AssistBattleHelper extends EventDispatcher {
    /**辅助战斗攻击目标候选列表，按照与伙伴的距离从大到小排序，元素个数不超过<CODE>m_candidatesLimit<CODE>。*/
    private m_candidates: UnitController[] = [];

    /**掉落物列表。*/
    private m_drops: DropThingController[] = [];

    /**是否正在运行中。*/
    private m_isRunning: boolean;

    /**点击地板时间。*/
    private m_lastClickFloorAt: number = 0;

    /**攻击自己的怪物表，表键为怪物UnitID，表值无意义。*/
    private m_attackers: AttackerInfo[] = [];

    /**施放技能失败计数。*/
    private m_failCount: number = 0;

    /**上一次失败发生的时间。*/
    private m_lastFailAt: number = 0;

    /**目标怪物ID，0表示所有怪物。*/
    private m_targetMonsterID: number = 0;
    private m_monsterRule: EnumMonsterRule;

    /**黑名单，无效目标将列入黑名单中。*/
    private m_blackNameList: { [unitID: number]: number };

    /**传送点列表，用于在找不到怪物的时候寻找传送点。*/
    private m_gateIDList: number[];

    /**传送点序列指针。*/
    private m_gatePointer: number = 0;

    /**副本中向后台拉怪的进程是否被锁定。*/
    private m_lastGetMonsterAt: number = 0;

    /**怪物位置聚落。*/
    private m_monsterPosList: Protocol.UnitPosition[];

    /**定点挂机*/
    private m_fixedPoint: Game.Vector2 = { x: 0, y: 0 };

    /**开启挂机时间*/
    private startAt = 0;

    /**定点半价，注意不开平方根，900*900*/
    private SEARCH_RANGE: number = 810000;

    private _hero: HeroController = null;
    private get Hero() {
        if (this._hero == null) {
            this._hero = G.UnitMgr.hero;
        }
        return this._hero;
    }

    private needSetFixedPoint = false;
    //__log = '';

    dropThingOnLoadTimer: number = 0;
    private readonly dropThingDelayTimer: number = 500;
    ///////////////////////////////////////// 挂机逻辑 /////////////////////////////////////////

    /**
     * 自己被怪物攻击事件的响应函数，将把该怪物列为优先攻击目标。
     * @param unitID 怪物UnitID。
     * 
     */
    onAttackedByEnermy(role: UnitController) {
        // 如果这只怪打我了，那我就把它从黑名单里拉出来
        let unitID = role.Data.unitID;
        if (null != this.m_blackNameList && this.m_blackNameList[unitID]) {
            this.m_blackNameList[unitID] = null;
            delete this.m_blackNameList[unitID];
        }

        //let index: number = this._getAttackerIndex(unitID);
        //let info: AttackerInfo;
        //if (index >= 0) {
        //    info = this.m_attackers[index];
        //}
        //else {
        //    info = new AttackerInfo();
        //    info.unitId = unitID;
        //    info.isRole = null != role;
        //}
        //info.lastAttackTime = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);

        // 如果不是在打怪，则立即反击
        let curSelected = G.UnitMgr.SelectedUnit;
        if (this.m_isRunning) {
            // 正在挂机，如果当前打的是怪，则立即切换目标
            if ((null == curSelected || curSelected.Data.unitType != UnitCtrlType.role) && EnumTargetValidation.ok == this.isValidTarget(role, true, false, null)) {
                G.UnitMgr.selectUnit(role.Data.unitID, false);
                this.Hero.attackAuto();
            }
        } else {
            // 没有挂机，开启反击
            if (EnumTargetValidation.ok == this.isValidTarget(role, true, false, null)) {
                G.UnitMgr.selectUnit(role.Data.unitID, false);
                this.Hero.attackAuto();
            }
        }
    }

    private _getAttackerIndex(unitID: number): number {
        let index: number = -1;
        let info: AttackerInfo;
        for (let i: number = this.m_attackers.length - 1; i >= 0; i--) {
            info = this.m_attackers[i];
            if (info.unitId == unitID) {
                index = i;
                break;
            }
        }

        return index;
    }

    /**
     * 场景上的元素被移除事件的响应函数。
     * @param target 被移除的元素。
     * 
     */
    onRemoveSceneRole(target: UnitController): void {
        let unitID: number = target.Data.unitID;
        let index: number = this._getAttackerIndex(unitID);
        if (index >= 0) {
            this.m_attackers.splice(index, 1);
        }
    }

    /**
     * 多次失败的处理函数。将放弃当前的怪。
     * 
     */
    onAssistBattleFail(failReason: number): void {
        if (!this.m_isRunning) {
            return;
        }
        let crtTime: number = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);
        if (crtTime - this.m_lastFailAt < 2000) {
            let unitID: number = 0;
            if (null != G.UnitMgr.SelectedUnit) {
                // 写入黑名单
                // 前台自己判断目标不可达时，也会派发ErrorId.EQEC_Cast_Skill_Wrong_Target这个错误码
                // 群攻的时候可能某个怪已经挂了，这时候不把当前选中的怪放入黑名单，因为我无法知道到底后台验证哪个怪失败了
                unitID = G.UnitMgr.SelectedUnit.Data.unitID;
                if (unitID < 0) {
                    // 前台怪不记入黑名单
                    return;
                }

                if (ErrorId.EQEC_Cast_Skill_Need_Target == failReason ||
                    ErrorId.EQEC_Cast_Skill_Wrong_Target == failReason) {
                    if (null == this.m_blackNameList) {
                        this.m_blackNameList = {};
                    }
                    this.m_blackNameList[unitID] = failReason;
                    //uts.log('UnitID = ' + unitID + '的怪物加入黑名单，错误码：' + failReason);
                }
            }
            this.run(unitID);
        }
        this.m_lastFailAt = crtTime;
    }

    freeFromBlackList(unitID: number) {
        if (null != this.m_blackNameList) {
            delete this.m_blackNameList[unitID];
        }
    }

    private _onGetNpcPositionListResponse(body: Protocol.GetNpcPostionList_Response): void {
        if (ErrorId.EQEC_Success != body.m_iResult) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(body.m_iResult), Macros.PROMPTMSG_TYPE_MIDDLE);
        }
        else if (body.m_ucNumber > 0) {
            // 拉到怪物聚落了
            this.m_monsterPosList = body.m_astPosition;
            this.run(0);
        }
    }

    /**
     * 切换场景的响应函数，因为切场景前可能会主动停止自动战斗，导致ChangeScene事件可能监听不到，所以此处直接调用接口。
     * 
     */
    onChangeScene(): void {
        // 切换场景之后将候选表、攻击表、黑名单全部清空
        this.m_blackNameList = {};
        // 重新获取传送点列表
        this.rebuildGateList();
        // 切场景也清空怪物聚落
        this.m_lastGetMonsterAt = 0;
        this.m_monsterPosList = null;
    }

    /**
     * 打开辅助攻击状态。
     * @param monsterID 指定攻击的怪物ID，默认为0，表示攻击任意怪物，-1表示保持原有目标怪物ID。
     * @param isBattleOrCollect 是战斗还是采集，默认为战斗。
     * @param toResume 状态是否是由暂停到恢复
     */
    startBattle(monsterID: number, monsterRule: EnumMonsterRule, setFixedPointRightNow): void {
        if (-1 != monsterID) {
            this.m_targetMonsterID = monsterID;
            this.m_monsterRule = monsterRule;
        }

        if (!this.m_isRunning) {
            this.m_isRunning = true;
            this.startAt = UnityEngine.Time.realtimeSinceStartup;

            if (G.DataMgr.deputySetting.isFixedPoint) {
                this.needSetFixedPoint = true;
                if (setFixedPointRightNow) {
                    this.checkSetFixedPoint();
                } else {
                    this.m_fixedPoint.x = 0;
                    this.m_fixedPoint.y = 0;
                }
            } else {
                this.needSetFixedPoint = false;
            }

            // 重新获取传送点列表
            this.rebuildGateList();
            // 清除技能次数
            G.ModuleMgr.skillModule.clearSkillUseMap();

            this.run();
        }
    }

    checkSetFixedPoint() {
        if (this.needSetFixedPoint) {
            let heroPos = this.Hero.getPixelPosition();
            this.m_fixedPoint.x = heroPos.x;
            this.m_fixedPoint.y = heroPos.y;
            this.needSetFixedPoint = false;
        }
    }

    /**
     * 关闭辅助攻击状态。
     * 
     */
    endBattle(): void {
        if (this.m_isRunning) {
            // 取消头顶提示
            //G.mainEffectCtrl.playOrStopStateEffect(MainUIEffectCtrl.AUTOBATTLE, false);
            G.ActionHandler.beAGoodBaby(false, false, false, false, true);
        }
        this.m_isRunning = false;
        this.m_lastClickFloorAt = 0;
        this.m_targetMonsterID = 0;
        this.removeNetListener(this._onGetNpcPositionListResponse);
        this.m_blackNameList = null;
        this.m_gateIDList = null;
        this.m_lastGetMonsterAt = 0;
        this.m_monsterPosList = null;
        this.needSetFixedPoint = false;
        let hero = this.Hero;
        if (null != hero) {
            hero.stopAttackAuto();
        }
    }

    /**
     * 处理点击地板的后续操作，如果自动寻路中的话，必须双击地板才能停下。
     * @return 
     * 
     */
    checkAutoBattle(): boolean {
        if (this.m_isRunning) {
            let now: number = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);
            let oldClickFloorAt: number = this.m_lastClickFloorAt;
            this.m_lastClickFloorAt = now;
            if (oldClickFloorAt > 0 && now - oldClickFloorAt < 1000) {
                this.endBattle();
                return true;
            }
            else {
                G.TipMgr.addMainFloatTip('再次点击停止自动战斗！', Macros.PROMPTMSG_TYPE_MIDDLE);
                return false;
            }
        }

        return true;
    }

    clearEnmityList(): void {
        this.m_attackers.length = 0;
    }

    /**
     * 重建传送点列表。
     * 
     */
    rebuildGateList(): void {
        if (!this.m_isRunning) {
            return;
        }
        if (null == this.m_gateIDList) {
            this.m_gateIDList = new Array<number>();
        }
        else {
            this.m_gateIDList.length = 0;
        }

        if (0 != G.DataMgr.sceneData.curPinstanceID) {
            let pinstanceConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(G.DataMgr.sceneData.curPinstanceID);
            if (null != pinstanceConfig.m_szGateInfo && '' != pinstanceConfig.m_szGateInfo) {
                let gateInfoArr: string[] = pinstanceConfig.m_szGateInfo.split('|');
                for (let gateIDStr of gateInfoArr) {
                    this.m_gateIDList.push(parseInt(gateIDStr));
                }
            }
        }
        // 指针归0
        this.m_gatePointer = 0;
    }

    /**
     * 辅助战斗定时逻辑，如果正在战斗则跳过，否则寻找合适的目标。
     * @param exclude 排除掉的UnitID。
     * 
     */
    run(exclude: number = 0): void {
        //this.__log = '';
        //Profiler.push('run');
        if (!this.m_isRunning || EnumLoginStatus.logined != G.DataMgr.runtime.loginStatus || !G.DataMgr.sceneData.isEnterSceneComplete || !this.Hero.canAutoRun(false)) {
            //Profiler.pop();
            //this.__log += 'AA;'
            return;
        }

        let heroData: HeroData = this.Hero.Data as HeroData;
        // 如果正在捡掉落物则直接返回
        if (this.Hero.isGoing2GetDrop) {
            //Profiler.pop();
            //this.__log += 'AB;';
            return;
        }

        // 是否跳过搜检掉落物
        let skipSearchDrop: boolean;
        if (G.DataMgr.runtime.hangUpIsBattleOrCollect) {
            // 如果是战斗的话，则判断现在是否已经在战斗
            if (this.Hero.IsAutoAttacking) {
                skipSearchDrop = true;
            }
        }
        else {
            // 采集的话判断是否在采集
            if (G.ViewCacher.collectionBar.hasShowCollection) {
                skipSearchDrop = true;
            }
        }

        if (!skipSearchDrop) {
            // 优先搜寻掉落物
            //Profiler.push('tryGetDrop');
            //加一层外面的判断,延迟拾取掉落物
            if (G.SyncTime.getCurrentTime() - this.dropThingOnLoadTimer > this.dropThingDelayTimer) {
                if (this.tryGetDrop()) {
                    //Profiler.pop();
                    //Profiler.pop();
                    //this.__log += 'AC;';
                    return;
                }
            } else {
                return;
            }
            //Profiler.pop();
        }

        if (G.DataMgr.runtime.hangUpIsBattleOrCollect) {
            //Profiler.push('hangUpIsBattleOrCollect');
            // 如果是战斗的话，则判断现在是否已经在战斗，或正在走向攻击目标
            if (this.Hero.IsAutoAttacking ||
                (HeroGotoType.ATTACK == heroData.gotoType && this.Hero.isMoving && null != G.DataMgr.runtime.moveTarget.sceneTarget)) {
                //Profiler.push('IsAutoAttacking');
                //如果目标太远就回位
                let sceneData: SceneData = G.DataMgr.sceneData;
                let moveSceneTarget = G.DataMgr.runtime.moveTarget.sceneTarget;
                if (null != moveSceneTarget && moveSceneTarget.Data.unitType == UnitCtrlType.role) {
                    if (this.shouldConsiderFixed()) {
                        let unitPos = moveSceneTarget.getPixelPosition();
                        let fixDistance = Math.pow(unitPos.x - this.m_fixedPoint.x, 2) + Math.pow(unitPos.y - this.m_fixedPoint.y, 2);
                        if (fixDistance > this.SEARCH_RANGE) {
                            G.UnitMgr.unselectUnit(moveSceneTarget.Data.unitID, false);
                            G.DataMgr.runtime.resetAllBut();
                            G.Mapmgr.goToPos(sceneData.curSceneID, this.m_fixedPoint.x, this.m_fixedPoint.y, false, false, FindPosStrategy.Specified, 0, true);
                        }
                    }
                }
                //Profiler.pop();
                //Profiler.pop();
                //Profiler.pop();
                //this.__log += 'AD;';
                return;
            }
            //Profiler.pop();
        }
        else {
            // 如果是采集的话，则判断当前是否已经在采集，或正在走向采集目标
            if (G.ViewCacher.collectionBar.hasShowCollection || (HeroGotoType.PICK_MONSTER == heroData.gotoType && this.Hero.isMoving)) {
                //Profiler.pop();
                //this.__log += 'AE;';
                return;
            }
        }

        //Profiler.push('_searchTarget');
        this._searchTarget(exclude);
        //Profiler.pop();
        //Profiler.pop();
    }

    tryGetDrop(): boolean {
        let drop: DropThingController = this._searchBestDrop();
        if (null != drop) {
           
                // 有掉落物就去捡掉落物
                G.UnitMgr.unselectUnit(drop.Data.unitID, false);
                G.DataMgr.heroData.gotoType = HeroGotoType.GET_SINGLE_DROP;
                let ret: number = G.Mapmgr.moveToTarget(drop);
                return PathingState.CANNOT_REACH != ret;
            
        }
        return false;
    }
    private __a = true;
    /**
     * 寻找合适的战斗目标。
     * @param exclude 排除掉的UnitID。
     * 
     */
    private _searchTarget(exclude: number = 0): boolean {
        //Profiler.push('_searchTarget');
        this.m_failCount = 0;

        let considerFixed = this.shouldConsiderFixed();
        let target: UnitController;

        // 优先选择选中的怪
        //Profiler.push('selectedUnit');
        let selectedUnit: UnitController = G.UnitMgr.SelectedUnit;
        if (null != selectedUnit && null != selectedUnit.Data && exclude != selectedUnit.Data.unitID &&
            ((0 == this.m_targetMonsterID && (selectedUnit.Data.unitType == UnitCtrlType.monster || selectedUnit.Data.unitType == UnitCtrlType.role)) ||
                (this.m_targetMonsterID > 0 && (selectedUnit.Data.unitType == UnitCtrlType.monster)
                    && this.m_targetMonsterID == (selectedUnit.Data.config as GameConfig.MonsterConfigM).m_iMonsterID))) {
            if (EnumTargetValidation.ok == this.isValidTarget(selectedUnit, true, false, null)) {
                //this.__log += 'AF;';
                target = selectedUnit;

                let now = UnityEngine.Time.realtimeSinceStartup;
                let runtime = G.DataMgr.runtime;
                if (now - runtime.lastCastSkillAt > 5 && now - runtime.lastWalkEnd > 5 && now - this.startAt > 5) {
                    // 有可能是某些bug导致挂机时站着不动，让玩家走开
                    let lfc = this.Hero.buffProxy.lastFreeComaAt;
                    if (0 == lfc || now - lfc > 5) {
                        let p = target.getPixelPosition();
                        if (PathingState.CAN_REACH == G.Mapmgr.moveHeroToBlank(p.x, p.y)) {
                            //this.__log += 'AG;';
                            return;
                        }
                    }
                } 
            }
        }
        //Profiler.pop();

        let unitID: number = 0;
        let unit: UnitController;
        let i: number = 0;

        //Profiler.push('attackers');
        if (G.DataMgr.runtime.hangUpIsBattleOrCollect) {
            // 如果是战斗的话，则其次选择正在攻击自己的怪
            if (null == target) {
                let attackerInfo: AttackerInfo;
                let lastAttacker: UnitController;
                for (i = this.m_attackers.length - 1; i >= 0; i--) {
                    attackerInfo = this.m_attackers[i];
                    if (exclude == attackerInfo.unitId) {
                        continue;
                    }

                    unit = G.UnitMgr.getUnit(unitID);
                    if (null != unit && EnumTargetValidation.ok == this.isValidTarget(unit, true, false, null)) {
                        if (attackerInfo.isRole) {
                            // 优先选中人
                            //this.__log += 'AH;';
                            target = unit;
                            break;
                        }
                        else if (null == lastAttacker) {
                            lastAttacker = unit;
                        }
                    }
                    else {
                        this.m_attackers.splice(i, 1);
                    }
                }

                // 没有攻击过我的其他玩家，那么就选攻击过我的怪物
                if (null == target) {
                    //this.__log += 'AI;';
                    target = lastAttacker;
                }
            }
        }
        //Profiler.pop();

        //Profiler.push('distance');
        if (null != target && considerFixed) {
            let unitPos = target.getPixelPosition();
            let fixDistance = Math.pow(unitPos.x - this.m_fixedPoint.x, 2) + Math.pow(unitPos.y - this.m_fixedPoint.y, 2);
            if (fixDistance > this.SEARCH_RANGE) {
                //this.__log += 'AJ;';
                target = null;
            }
        }
        //Profiler.pop();

        // 最后选择距离自己最近的怪
        let heroPos = this.Hero.getPixelPosition();
        //Profiler.push('search');
        if (null == target) {
            //this.__log += 'AK;';
            // 筛除掉非法的目标（因为候选列表时事先建立的，可能中间有的怪已经死掉了）
            this.m_candidates.length = 0;

            if (G.DataMgr.runtime.hangUpIsBattleOrCollect) {
                if (0 == this.m_targetMonsterID) {
                    let canAttackRole = G.DataMgr.heroData.level >= Constants.AttackRoleMinLv
                    // 找人
                    let roleList = G.UnitMgr.RoleList;
                    for (let unit of roleList) {
                        if (this.checkRole(exclude, unit, considerFixed, heroPos, canAttackRole)) {
                            this.m_candidates.push(unit);
                        }
                    }
                }
                // 找怪
                let monsterList = G.UnitMgr.MonsterList;
                for (let unit of monsterList) {
                    if (this.checkMonster(exclude, unit, considerFixed, heroPos)) {
                        this.m_candidates.push(unit);
                    }
                }
            } else {
                // 找采集物
                let collectMonsterList = G.UnitMgr.CollectMonsterList;
                for (let unit of collectMonsterList) {
                    if (this.checkMonster(exclude, unit, considerFixed, heroPos)) {
                        this.m_candidates.push(unit);
                    }
                }                
            }            

            let candidateCount = this.m_candidates.length;
            if (candidateCount > 0) {
                //this.__log += 'AL;';
                // 按照距离排序
                if (candidateCount > 1) {
                    this.m_candidates.sort(delegate(this, this.sortCandidates));
                }
                for (let i = 0; i < candidateCount; i++) {
                    let tmpCandidate = this.m_candidates[i];
                    if (EnumTargetValidation.ok == this.isValidTarget(tmpCandidate, true, true, null)) {
                        target = tmpCandidate;
                        break;
                    }
                }
            }
        }
        //Profiler.pop();

        if (null != target) {
            //this.__log += 'AM;';
            //Profiler.push('get target');
            this.m_monsterPosList = null;
            G.UnitMgr.selectUnit(target.Data.unitID, false);

            if (target.Data.unitType == UnitCtrlType.collection) {
                //this.__log += 'AN;';
                G.DataMgr.heroData.gotoType = HeroGotoType.PICK_MONSTER;
                G.Mapmgr.moveToTarget(target);
            }
            else {
                //this.__log += 'AO;';
                if (this.__a) {
                    this.__a = false;
                }
                this.Hero.attackAuto();
            }
            //Profiler.pop();
            //Profiler.pop();
            return true;
        }

        // 如果是在副本中，先从后台下发的怪物聚落找怪
        //Profiler.push('nav to monsters');
        if (null != this.m_monsterPosList) {
            //this.__log += 'AP;';
            let len: number = this.m_monsterPosList.length;
            if (len > 0) {
                let minDistance: number = -1;
                let minDistPosIndex: number = 0;
                let tempDist: number = 0;
                let tempUPos: Protocol.UnitPosition;
                for (i = 0; i < len; i++) {
                    tempUPos = this.m_monsterPosList[i];
                    tempDist = Math.pow(tempUPos.m_uiX - heroPos.x, 2) + Math.pow(tempUPos.m_uiY - heroPos.y, 2);
                    if (minDistance < 0 || tempDist < minDistance) {
                        minDistance = tempDist;
                        minDistPosIndex = i;
                    }
                }

                tempUPos = this.m_monsterPosList[minDistPosIndex];
                // 走向该聚落
                let ret: PathingState = G.Mapmgr.moveHeroToPos(tempUPos.m_uiX, tempUPos.m_uiY, true, 0);
                this.m_monsterPosList = null;
                //Profiler.pop();
                //Profiler.pop();
                return true;
            }
        }
        //Profiler.pop();

        // 找不到怪也没有怪物聚落，就跟后台拉下怪物
        //Profiler.push('require monsters');
        let now: number = UnityEngine.Time.realtimeSinceStartup;
        if (G.DataMgr.sceneData.curPinstanceID > 0 && (0 == this.m_lastGetMonsterAt || now - this.m_lastGetMonsterAt > 5)) {
            //this.__log += 'AQ;';
            this.m_lastGetMonsterAt = now;
            this.addNetListener(Macros.MsgID_GetNpcPostionList_Response, this._onGetNpcPositionListResponse);
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMonstersInPinstance());
            //Profiler.pop();
            //Profiler.pop();
            return true;
        }
        //Profiler.pop();

        //Profiler.push('fix');
        if (considerFixed && this.m_targetMonsterID <= 0) {
            //this.__log += 'AR;';
            let fixDistance = Math.pow(heroPos.x - this.m_fixedPoint.x, 2) + Math.pow(heroPos.y - this.m_fixedPoint.y, 2);
            if (fixDistance > this.SEARCH_RANGE) {
                G.Mapmgr.goToPos(G.DataMgr.sceneData.curSceneID, this.m_fixedPoint.x, this.m_fixedPoint.y, false, false, FindPosStrategy.Specified, 0, true);
            }
            //Profiler.pop();
            //Profiler.pop();
            return true;
        }
        //Profiler.pop();

        //Profiler.push('gate');
        if (0 != G.DataMgr.sceneData.curPinstanceID && !this.Hero.isMoving) {
            //this.__log += 'AS;';
            let sceneGateInfos: GateInfo[] = G.DataMgr.sceneData.curSceneConfig.gateInfos;
            if (null != sceneGateInfos) {
                let gateCnt: number = this.m_gateIDList.length;
                if (this.m_gatePointer >= gateCnt) {
                    // 重新归0
                    this.m_gatePointer = 0;
                }
                let isFound: boolean;
                while (this.m_gatePointer < gateCnt) {
                    let gateID: number = this.m_gateIDList[this.m_gatePointer];
                    isFound = false;
                    for (let gate of sceneGateInfos) {
                        if (gate.gateID == gateID) {
                            // 先停止走动
                            G.ActionHandler.beAGoodBaby(false, false, false, false, true);
                            if (PathingState.CANNOT_REACH == G.Mapmgr.moveHeroToScenePos(G.DataMgr.sceneData.curSceneID, gate.x, gate.y)) {
                                isFound = false;
                            }
                            else {
                                isFound = true;
                            }
                            break;
                        }
                    }
                    this.m_gatePointer++;

                    if (isFound) {
                        //Profiler.pop();
                        //Profiler.pop();
                        return true;
                    }
                }
            }
        }
        //Profiler.pop();

        //this.__log += 'AT;';
        return false;
    }

    private checkRole(exclude: number, unit: UnitController, considerFixed: boolean, heroPos: UnityEngine.Vector2, canAttackRole: boolean): boolean {
        // 自己非免战状态 并且 对方也非免战状态才能进行攻击 并且双方都大于40级
        let isValid = false;
        if (unit.model != null && exclude != unit.Data.unitID && !unit.buffProxy.hasBuffByID(EnumBuff.STONE_BUFF)) {
            // 玩家需检查等级
            isValid = unit.model.isShadowVisible && ((unit.Data as RoleData).monsterRoleId > 0 || (canAttackRole && (unit.Data as RoleData).level >= Constants.AttackRoleMinLv));
        }
        if (!isValid) {
            return false;
        }
        let unitPos = unit.getPixelPosition();
        if (considerFixed) {
            let fixDistance = Math.pow(unitPos.x - this.m_fixedPoint.x, 2) + Math.pow(unitPos.y - this.m_fixedPoint.y, 2);
            if (fixDistance > this.SEARCH_RANGE) {
                // 超过定点挂机距离
                return false;
            }
        }

        unit.Data.sortLayer = Math.pow(unitPos.x - heroPos.x, 2) + Math.pow(unitPos.y - heroPos.y, 2);
        return true;
    }

    private checkMonster(exclude: number, unit: UnitController, considerFixed: boolean, heroPos: UnityEngine.Vector2): boolean {
        // 自己非免战状态 并且 对方也非免战状态才能进行攻击 并且双方都大于40级
        let isValid = false;
        if (unit.model != null && exclude != unit.Data.unitID && !unit.buffProxy.hasBuffByID(EnumBuff.STONE_BUFF)) {
            // 怪物需检查是否指定的id
            isValid = 0 == this.m_targetMonsterID || EnumMonsterRule.onlySpecified != this.m_monsterRule || unit.Data.id == this.m_targetMonsterID;
        }
        if (!isValid) {
            return false;
        }
        let unitPos = unit.getPixelPosition();
        if (considerFixed) {
            let fixDistance = Math.pow(unitPos.x - this.m_fixedPoint.x, 2) + Math.pow(unitPos.y - this.m_fixedPoint.y, 2);
            if (fixDistance > this.SEARCH_RANGE) {
                // 超过定点挂机距离
                return false;
            }
        }

        unit.Data.sortLayer = Math.pow(unitPos.x - heroPos.x, 2) + Math.pow(unitPos.y - heroPos.y, 2);
        return true;
    }

    shouldConsiderFixed(): boolean {
        return G.DataMgr.deputySetting.isFixedPoint && G.DataMgr.sceneData.curPinstanceID == 0 && !G.DataMgr.sceneData.isIngornFixedPoint() && this.fixedPoint.x > 0;
    }

    /**
     * 搜寻一个距离最近的掉落物。
     * @return 
     * 
     */
    private _searchBestDrop(): DropThingController {
        this.m_drops.length = 0;

        let dropList = G.UnitMgr.DropList;

        // 背包没有空位就不拾取了
        let bagRemainNum = G.DataMgr.thingData.getBagRemainNum();
        for (let dropCtrl of dropList)//遍历场景中所有的元素
        {
            let dropInfo = dropCtrl.Data.info;
            if (null == dropInfo || !dropCtrl.canGet) {
                continue;
            }

            // 背包物品要检查背包空格数量
            if (bagRemainNum <= 0 && GameIDUtil.isBagThingID(dropInfo.m_iThingID)) {
                continue;
            }
            this.m_drops.push(dropCtrl);
        }

        let dropCount = this.m_drops.length;
        if (0 == dropCount) {
            return null;
        }

        // 按照距离排序
        if (dropCount > 1) {
            let heroPos = this.Hero.getPixelPosition();
            for (let tmpDrop of this.m_drops) {
                let tmpPos = tmpDrop.getPixelPosition();
                tmpDrop.Data.sortLayer = Math.pow(tmpPos.x - heroPos.x, 2) + Math.pow(tmpPos.y - heroPos.y, 2);
            }
            this.m_drops.sort(delegate(this, this.sortCandidates));
        }
        return this.m_drops[0];
    }

    sortCandidates(a: UnitController, b: UnitController): number {
        let isTargetA = a.Data.id == this.m_targetMonsterID ? 1 : 0;
        let isTargetB = b.Data.id == this.m_targetMonsterID ? 1 : 0;
        if (isTargetA != isTargetB) {
            return isTargetB - isTargetA;
        }

        // 优先打怪，再打人
        let isMonsterA = (a.Data.unitType == UnitCtrlType.monster || (a.Data.unitType == UnitCtrlType.role && (a.Data as RoleData).monsterRoleId > 0)) ? 1 : 0;
        let isMonsterB = (b.Data.unitType == UnitCtrlType.monster || (b.Data.unitType == UnitCtrlType.role && (b.Data as RoleData).monsterRoleId > 0)) ? 1 : 0;
        if (isMonsterA != isMonsterB) {
            return isMonsterB - isMonsterA;
        }

        let now = UnityEngine.Time.realtimeSinceStartup;
        let attackedByA = now - a.Data.lastAttackMeAt < 5 ? 1 : 0;
        let attackedByB = now - b.Data.lastAttackMeAt < 5 ? 1 : 0;
        if (attackedByA != attackedByB) {
            return attackedByB - attackedByA;
        }
        return a.Data.sortLayer - b.Data.sortLayer;
    }

    /**
     * 是否可以自动攻击（或采集）的场景元素。
     * @param baseRole 场景元素。
     * @param limitGuaji 是否启用挂机设置中的限制。
     * @param checkTargetID 是否校验目标是否目标怪物。
     * @param skillConfig 使用的技能，可以为空。
     * @return 如果可以自动攻击（或采集）则返回<CODE>true</CODE>，否则返回<CODE>false</CODE>。
     * 
     */
    isValidTarget(unit: UnitController, limitGuaji: boolean, checkTargetID: boolean, skillConfig: GameConfig.SkillConfigM = null): EnumTargetValidation {
        //Profiler.push('isValidTarget');
        if (null == unit) {
            //Profiler.pop();
            return EnumTargetValidation.noTarget;
        }

        if (null == unit.Data || !UnitUtil.canUnitTypeBeAttacked(unit.Data.unitType)) {
            //Profiler.pop();
            return EnumTargetValidation.invalidTarget;
        }

        if (null == unit.model) {
            uts.logError('someone has no model, unitID = ' + unit.Data.unitID + ', state = ' + unit.state + ', unitStatus = ' + unit.Data.unitStatus + ', hp = ' + unit.Data.getProperty(Macros.EUAI_CURHP));
            //Profiler.pop();
            return EnumTargetValidation.invalidTarget;
        }

        // 排除空血的
        if (UnitStatus.isDead(unit.Data.unitStatus) || unit.Data.getProperty(Macros.EUAI_CURHP) <= 0) {
            //Profiler.pop();
            return EnumTargetValidation.deadTarget;
        }

        if (null != this.m_blackNameList && this.m_blackNameList[unit.Data.unitID]) {
            // 怪物在黑名单中
            //Profiler.pop();
            return EnumTargetValidation.blackNameList;
        }

        // 不可选状态
        //Profiler.push('not select');
        if (unit.buffProxy.hasBuffEffect(KeyWord.BUFF_EFFECT_NOT_SELECT)) {
            //Profiler.pop();
            //Profiler.pop();
            return EnumTargetValidation.invalidTarget;
        }
        //Profiler.pop();

        // 挂机设置限制
        if (limitGuaji) {
            if (G.DataMgr.runtime.hangUpIsBattleOrCollect && (unit.Data.unitType == UnitCtrlType.collection)) {
                // 挂机时忽略采集物
                //Profiler.pop();
                return EnumTargetValidation.invalidTarget;
            }
        }

        // 技能限制
        if (null != skillConfig) {
            // 采集技能只能针对采集怪
            let f1: boolean = KeyWord.SKILL_BRANCH_PICK == skillConfig.m_ucSkillBranch;
            let f2: boolean = unit.Data.unitType == UnitCtrlType.collection;
            if (f1 != f2) {
                //Profiler.pop();
                return EnumTargetValidation.invalidTarget;
            }
        }

        if (unit.Data.unitType == UnitCtrlType.role) {
            if (G.DataMgr.sceneData.isInCrossTeamPinstance) {
                // 在锁仙台中
                //Profiler.pop();
                return EnumTargetValidation.invalidTarget;
            }

            if (unit.model.safty) {
                //Profiler.pop();
                return EnumTargetValidation.safty;//是否在安全区
            }
        }

        // 对怪物的判断逻辑
        //Profiler.push('aaaa');
        let tmpMonster: MonsterController;
        if (UnitUtil.isMonster(unit)) {
            tmpMonster = unit as MonsterController;
            if (null == unit.Data.config || 0 == (unit.Data.config as GameConfig.MonsterConfigM).m_ucIsBeSelected) {
                //Profiler.pop();
                //Profiler.pop();
                return EnumTargetValidation.invalidTarget;
            }

            // 普通怪需要验证阵营
            //Profiler.push('bbbb');
            if (unit.Data.unitType != UnitCtrlType.collection && !UnitUtil.isEnemy(tmpMonster)) {
                //Profiler.pop();
                //Profiler.pop();
                //Profiler.pop();
                return EnumTargetValidation.invalidTarget;
            }
            //Profiler.pop();

            // 伙伴远征中的怪不选中
            if (Macros.PINSTANCE_ID_WYYZ == G.DataMgr.sceneData.curPinstanceID) {
                return EnumTargetValidation.invalidTarget;
            }
        }
        else if (unit.Data.unitType == UnitCtrlType.role) {
            if ((skillConfig == null || skillConfig.m_stSkillCastArea.m_iSkillTarget == KeyWord.SKILL_TARGET_TYPE_ENEMY) && !UnitUtil.isEnemy(unit)) {
                //Profiler.pop();
                //Profiler.pop();
                return EnumTargetValidation.invalidTarget;
            }
        }
        else {
            //Profiler.pop();
            //Profiler.pop();
            return EnumTargetValidation.invalidTarget;
        }
        //Profiler.pop();
        //Profiler.pop();

        return EnumTargetValidation.ok;
    }

    get fixedPoint(): Game.Vector2 {
        return this.m_fixedPoint;
    }

    get targetMonsterID(): number {
        return this.m_targetMonsterID;
    }

    get monsterRule(): EnumMonsterRule {
        return this.m_monsterRule;
    }

    toString(): string {
        return uts.format('[Battle]targetMonsterID={0}, monsterRule={1}, log={2}', this.m_targetMonsterID, this.m_monsterRule,'');
    }
}

class AttackerInfo {
    unitId: number = 0;
    isRole: boolean;
    lastAttackTime: number = 0;
}