import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { EventDispatcher } from "System/EventDispatcher";
import { Events } from "System/Events";
import { ErrorId } from "System/protocol/ErrorId";
import { UnitData, RoleData } from "System/data/RoleData"
import { ThingData } from 'System/data/thing/ThingData'
import { KeyWord } from "System/constants/KeyWord";
import { UnitController } from "System/unit/UnitController";
import { HeroController } from "System/unit/hero/HeroController";
import { RoleController } from 'System/unit/role/RoleController'
import { MonsterController } from 'System/unit/monster/MonsterController'
import { PetController } from 'System/unit/attendant/PetController'
import { SkillReqParam } from "System/skill/SkillReqParam";
import { CastSkillStatus } from "System/skill/CastSkillStatus";
import { EnumSkillID } from "System/skill/EnumSkillID";
import { SkillUtil } from "System/skill/SkillUtil";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { newSkillEffectTarget } from "System/protocol/new/NSkillEffectTarget";
import { UnitStatus } from "System/utils/UnitStatus";
import { HeroGotoType, UnitCtrlType, PathingState, EnumTargetValidation } from "System/constants/GameEnum";
import { ReliveView } from "System/main/view/ReliveView";
import { SkillData } from 'System/data/SkillData'
import { CdDataMgr } from 'System/data/CdDataMgr'
import { SkillTag } from 'System/skill/SkillTag'
import { PinstanceData } from 'System/data/PinstanceData'
import { CDData } from 'System/data/vo/CDData'
import { UnitUtil } from 'System/utils/UnitUtil'
import { MonsterData } from 'System/data/MonsterData'
import { FaQiView } from 'System/faqi/FaQiiView'
import { JiuXingView } from 'System/jiuxing/JiuXingView'
import { SkillView } from 'System/skill/view/SkillView'
import { GuildView } from "System/guild/view/GuildView";
import { EffectPlayer } from 'System/unit/EffectPlayer'
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { Constants } from 'System/constants/Constants'
import { Profiler } from 'System/utils/Profiler'
import { HunLiView } from 'System/hunli/HunLiView'
import { HeroView } from 'System/hero/view/HeroView'
import { SkillUnlockView } from 'System/guide/SkillUnlockView'
import { MainUIEffectView } from "../main/MainUIEffectView";

export class SkillModule extends EventDispatcher {
    /**缓存的技能ID，这个是通过快捷栏等用户主动输入要求打出的技能。*/
    private m_cacheSkillId: number;
    /**临时变量：技能参数。*/
    private m_skillParam = new SkillReqParam();
    /*** 缓存的物品技能 */
    private m_cacheItem: Protocol.ContainerThing;

    /**技能使用情况的记录。*/
    private m_skillUseMap: { [skillID: number]: number } = {};

    /**上一次使用的普通攻击的id*/
    private lastSentNormalSkillId: number = -1;
    /**用于标记一轮普通攻击的起始id*/
    private normalSkillStartId = 0;

    private skillData: SkillData;
    private cdData: CdDataMgr;
    private localCdData: CdDataMgr;

    private _hero: HeroController = null;
    private get Hero() {
        if (this._hero == null) {
            this._hero = G.UnitMgr.hero;
        }
        return this._hero;
    }
    constructor() {
        super();

        this.skillData = G.DataMgr.skillData;
        this.cdData = G.DataMgr.cdData;
        this.localCdData = G.DataMgr.localCdData;

        //绑定网络消息包
        this.addNetListener(Macros.MsgID_OperateSkill_Response, this.onOperateSkillResponse);
        this.addNetListener(Macros.MsgID_CastSkill_Response, this.onCastSkillResponse);
        this.addNetListener(Macros.MsgID_CastSkill_Notify, this.onCastSkillNotify);
    }

    /**
     * 释放指定的技能。
     * @param skillID 技能的ID。
     * @param needPrompMsg 是否需要提示失败消息，默认为需要提示。
     * @param isAuto 是否自动模式，只有玩家手动操作传false。
     *
     */
    public castSkill(skillID: number, needPrompMsg: boolean, isAuto: boolean): boolean {
        // 检查角色状态是否可以放技能
        if (!this.canCastSkill(needPrompMsg, skillID)) {
            return false;
        }
        //锁定当前的目标选择

        var skill: GameConfig.SkillConfigM;
        if (0 != skillID) {
            // 有指定技能就要
            skill = SkillData.getSkillConfig(skillID);
        }
        else {
            skill = this.getAutoSkill(false, true);
        }

        let hasSent = false;
        if (null != skill) {
            hasSent = this.tryCastSkill(skill, needPrompMsg, isAuto);
            if (skillID > 0 && hasSent) {
                // 指定放某个技能，如果放出去了就清除缓存技能
                this.m_cacheSkillId = 0;
                if (SkillData.isNormalSkill(skill)) {
                    this.lastSentNormalSkillId = skillID;
                    if (0 == this.normalSkillStartId) {
                        this.normalSkillStartId = skillID;
                    }
                } else {
                    this.normalSkillStartId = 0;
                }
            }
        }

        return hasSent;
    }
    /**
     * 检查当前人物的状态是否可以施放技能。
     * @param needPrompMsg
     * @param skillID 特殊技能需要传入id
     * @return
     *
     */
    private canCastSkill(needPrompMsg: boolean, skillID: number = -1): boolean {
        if (!G.DataMgr.sceneData.isEnterSceneComplete) {
            // 场景未初始化不能放技能
            return false;
        }

        // 正在等待跳跃回复也不能发送技能
        if (G.DataMgr.runtime.isWaitTransprotResponse) {
            return false;
        }

        // 正在跳跃或者降落不能放技能
        if (this.Hero.IsJumping || this.Hero.IsLanding) {
            return false;
        }

        if (UnitStatus.isDead(this.Hero.Data.unitStatus)) {
            return false;
        }

        if ((this.Hero.buffProxy.isSilence || this.Hero.buffProxy.isComa) && !SkillData.hasBuffEffect(skillID, KeyWord.BUFF_EFFECT_IMMUNITY)) //昏迷或者沉默
        {
            if (needPrompMsg) {
                G.TipMgr.addMainFloatTip('沉默或者昏迷状态中不能释放技能', Macros.PROMPTMSG_TYPE_MIDDLE);
            }
            return false;
        }

        return true;
    }
    private tryCastSkill(skill: GameConfig.SkillConfigM, needPrompMsg: boolean, isAuto: boolean): boolean {
        // 首先确定施法目标单位
        let attackTarget = G.UnitMgr.SelectedUnit;

        // 采集技能必须有释放目标
        if (KeyWord.SKILL_BRANCH_PICK == skill.m_ucSkillBranch && null == attackTarget) {
            return false;
        }

        if (attackTarget) {
            // 打人需检查等级
            if (attackTarget.Data.unitType == UnitCtrlType.role) {
                if (G.DataMgr.heroData.level < Constants.AttackRoleMinLv) {
                    if (needPrompMsg) {
                        G.TipMgr.addMainFloatTip("不足40级无法攻击他人");
                    }
                    return false;
                }
                let targetRole = attackTarget as RoleController;
                if (targetRole.Data.level < Constants.AttackRoleMinLv && targetRole.Data.monsterRoleId == 0) {
                    if (needPrompMsg) {
                        G.TipMgr.addMainFloatTip("目标玩家不足40级");
                    }
                    return false;
                }
            }

            // 单攻检查目标是否可打
            if (KeyWord.SKILL_CONTROL_DAN == skill.m_iSkillCtrType) {
                let vt = G.BattleHelper.isValidTarget(attackTarget, false, false, skill);
                if (EnumTargetValidation.ok != vt) {
                    if (needPrompMsg) {
                        let desc = SkillData.getValidationDesc(vt);
                        if (undefined != desc) {
                            G.TipMgr.addMainFloatTip(desc);
                        }
                    }
                    return false;
                }
            }
        }

        let sourcePos = G.UnitMgr.hero.getWorldPosition();
        this.m_skillParam.attackTarget = attackTarget;
        this.m_skillParam.sourcePosWorld = sourcePos;
        this.m_skillParam.sourcePosX = G.localPositionXToServerPixelX(sourcePos.x);
        this.m_skillParam.sourcePosY = G.localPositionYToServerPixelY(sourcePos.z);

        let targetPos: UnityEngine.Vector3 = null;
        let needStraight: boolean; // 是否直线攻击

        // 非跳跃技能按照下面的流程确定目标坐标
        if (KeyWord.SKILL_BRANCH_PICK == skill.m_ucSkillBranch) {
            // 采集技能使用采集物的坐标
            targetPos = attackTarget.getWorldPosition();
        }
        else {
            // 其他技能
            let cache = skill.m_astSkillEffect[0];
            let targetType = cache.m_iSkillTarget;
            if (KeyWord.SKILL_EFFECT_TARGET_SELF == targetType) {
                // 目标是自身，使用自身的坐标，注意这里是引用，小心别把target修改了
                targetPos = sourcePos;
            }
            else {
                // 目标是敌方
                if (null != attackTarget) {
                    // 有目标单位的话使用其坐标
                    targetPos = attackTarget.getWorldPosition();
                }
                else {
                    // 没地方就原地放
                    let d = this.Hero.getDirection();
                    let dx = d.x;
                    let dz = d.z;
                    targetPos = G.cacheVec3;
                    targetPos.Set(sourcePos.x + dx, sourcePos.y, sourcePos.z + dz);
                }
            }
        }
        this.m_skillParam.setTargetPosWorld(targetPos.x, targetPos.y, targetPos.z);

        // 判断施放目标与自身距离等条件
        let hasSent = this.doAttackWithTargetReady(skill, needPrompMsg, isAuto);
        if (hasSent) {
            if (!SkillData.isPetNuQiSkill(skill)) {
                // 播放攻击动作
                this.Hero.attackTarget(targetPos, G.AnimationStateMgr.getSkillAction(skill));
                if (skill.m_iCastSkillVoiceID > 0) {
                    G.AudioMgr.playSound("sound/unit/" + skill.m_iCastSkillVoiceID + ".mp3");
                }
            }
        }
        return hasSent;
    }

    private doAttackWithTargetReady(skill: GameConfig.SkillConfigM, needPrompMsg: boolean, isAuto: boolean): boolean {
        let hasSend: boolean = false;
        let canCache: boolean = false;

        //准备面板打开的时候，禁止所有技能
        if (MainUIEffectView.isShowcountDownTimer) {
            return false;
        }

        // 判断施放目标与自身距离等条件
        let status = this.getSkillStatusByConfig(skill, this.m_skillParam.attackTarget, 0, isAuto);
        if (CastSkillStatus.CANCAST == status) {
            // 可以直接释放
            if (G.ViewCacher.collectionBar.hasShowCollection) {
                // 正在读条，则缓存技能并直接返回
                if (needPrompMsg) {
                    G.TipMgr.addMainFloatTip("吟唱过程中不可操作", Macros.PROMPTMSG_TYPE_MIDDLE);
                }
            }
            else {
                // 检查冷却
                let cdData = this._getSkillCd(skill);
                if (null == cdData) {
                    // 发送释放技能的请求
                    this.processSkillAttack(skill, this.m_skillParam.attackTarget);
                    hasSend = true;
                }
                else {
                    canCache = skill.m_iSkillID != cdData.id; // 公共CD中可以缓存起来
                }
            }
        }
        else if (CastSkillStatus.OUTOFDIS == status || CastSkillStatus.BLOCKED == status) {
            // 超出距离或者有阻挡，需要寻路到附近，这时肯定是有选中目标的
            G.DataMgr.heroData.gotoType = HeroGotoType.ATTACK;
            // 先走到附近，然后直接返回
            let ret = PathingState.CANNOT_REACH;
            if (skill.jumpDistance <= 0 && null != this.m_skillParam.attackTarget) {
                // 跳砍技能永远使用目标坐标
                ret = G.Mapmgr.moveToTarget(this.m_skillParam.attackTarget, skill, true);
            }
            else if (G.Mapmgr.tileMap.IsWalkablePositionPixel(this.m_skillParam.castTargetPosX, this.m_skillParam.castTargetPosY)) {
                // 目标点是合法点的话，那么根据不存在环岛地形的假设，这个点肯定是可达的，因此走向该点
                ret = G.Mapmgr.gotoPosAndCastSkill(this.m_skillParam.castTargetPosX, this.m_skillParam.castTargetPosY, skill);
            }
            else {
                // 非法的目标点，直接原地释放
                status = CastSkillStatus.CANCAST;
            }

            if (PathingState.CAN_REACH == ret) {
                G.DataMgr.runtime.lastCheckSkillDistanceAt = UnityEngine.Time.realtimeSinceStartup;
            } else if(PathingState.REACHED == ret) {
                // 可以直接释放
                if (G.ViewCacher.collectionBar.hasShowCollection) {
                    // 正在读条，则缓存技能并直接返回
                    if (needPrompMsg) {
                        G.TipMgr.addMainFloatTip("吟唱过程中不可操作", Macros.PROMPTMSG_TYPE_MIDDLE);
                    }
                }
                else {
                    // 检查冷却
                    let cdData = this._getSkillCd(skill);
                    if (null == cdData) {
                        // 发送释放技能的请求
                        this.processSkillAttack(skill, this.m_skillParam.attackTarget);
                        hasSend = true;
                    }
                    else {
                        canCache = skill.m_iSkillID != cdData.id; // 公共CD中可以缓存起来
                    }
                }
            }

            if (CastSkillStatus.CANCAST != status) {
                if (PathingState.CANNOT_REACH == ret) {
                    // 无法走到附近，通知自动战斗失败，直接将该怪物视为无效
                    G.BattleHelper.onAssistBattleFail(ErrorId.EQEC_Cast_Skill_Wrong_Target);
                }
                else {
                    // 可以走过去，那么就直接返回
                    canCache = true;
                }
            }
        }
        else if (CastSkillStatus.INVALID_TARGET == status) {
            // 目标非法，缓存技能
            if (needPrompMsg) {
                G.TipMgr.addMainFloatTip("请选择正确的目标", Macros.PROMPTMSG_TYPE_MIDDLE);
            }
        }
        else if (CastSkillStatus.NO_TARGET == status) {
            // 没有目标，不处理
            if (needPrompMsg) {
                G.TipMgr.addMainFloatTip("无法在这里使用该物品", Macros.PROMPTMSG_TYPE_MIDDLE);
            }
        }

        if (hasSend) {
            // 技能发送出去了则清除缓存
            if (this.m_cacheSkillId == skill.m_iSkillID) {
                this.m_cacheSkillId = 0;
            }
        }
        else if (!isAuto && canCache) {
            this.m_cacheSkillId = skill.m_iSkillID;
        }
        return hasSend;
    }
    private processSkillAttack(skill: GameConfig.SkillConfigM, attackTarget: UnitController): void {
        let effectName = skill.m_szPrepareEffect;
        if (effectName != "") {
            EffectPlayer.play(this.m_skillParam.sourcePosWorld, this.m_skillParam.castTargetPosWorld, uts.format("skill/{0}", effectName), skill.m_effectTime / 10, true, false);
        }
        else {
            if (!SkillData.isPetNuQiSkill(skill) && skill.m_szBoyEffectID != "") {
                // 武缘怒气技能是通过后台的cast skill notify回来播特效的
                EffectPlayer.play(this.m_skillParam.sourcePosWorld, this.m_skillParam.castTargetPosWorld, uts.format("skill/{0}", skill.m_szBoyEffectID), skill.m_effectTime / 10, true, false);
            }
        }
        // 取得协议中技能释放目标
        this.getSkillTarget(skill, attackTarget);
        this.getSkillParamerter(Macros.CASTSKILL_INTERFACE_SKILL, skill, attackTarget);
        this.getSkillEffectTargetList(skill, attackTarget);

        this.m_skillParam.skillParam.m_ucTag = SkillTag.getTag(true, false, false, false, false); // 0表示需要播动作
        this.attackOnce(skill);

        // 针对吟唱的技能进行读条等
        this._processByPrepareSkill(skill, this.m_skillParam.skillParam);
        if (SkillData.isPetNuQiSkill(skill)) {
            G.ViewCacher.mainUIEffectView.showPetSkill(skill, false);
        }
        this.m_skillParam.reset();
    }

    /**
     * 进行一次攻击步骤。
     * @param skill
     *
     */
    private attackOnce(skill: GameConfig.SkillConfigM): void {
        // 发送技能包
        if (0 != skill.m_ucStopMove) {
            // 这里需要stop move，清除寻路标记
            G.ActionHandler.beAGoodBaby(false, false, false, false, false);
        }
        let m_skillParam = this.m_skillParam;
        if (SkillTag.canStartCD(m_skillParam.skillParam.m_ucTag)) {
            //吟唱技能先在这里转起来
            if (skill.m_iPrepareTime > 0) {
                this.cdData.addNewCd(skill);
            }
            else {
                this.localCdData.addNewCd(skill);
            }
        }

        // 记录使用次数
        let skillSerId = Math.floor(skill.m_iSkillID / 100);
        this.m_skillUseMap[skillSerId] = Number(this.m_skillUseMap[skillSerId]) + 1;
        if (null != m_skillParam.attackTarget && m_skillParam.attackTarget.Data.unitType == UnitCtrlType.monster && KeyWord.MONSTER_TYPE_DECORATE == (m_skillParam.attackTarget.Data.config as GameConfig.MonsterConfigM).m_bDignity && !SkillData.isPetNuQiSkill(skill)) {
            if (skill.jumpDistance > 0) {
                return;
            }

            // 前台怪，不分包，前台自己模拟(位移技能还是要发和后台同步）
            Game.Invoker.BeginInvoke(G.Root, 'fakeResp', 0.05, delegate(this, this.onCastSkillResponse, ProtocolUtil.getFakeCastSkillResponse(skill, this.m_skillParam)));
        }
        else {
            G.DataMgr.runtime.lastCastSkillAt = UnityEngine.Time.realtimeSinceStartup;
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCastSkillResquest(G.UnitMgr.hero.Data.unitID, m_skillParam.skillParam, m_skillParam.skillTarget, m_skillParam.skillTargets.effectTargets));
            m_skillParam.skillTargets.targets.length = 0;
        }
    }

    /**
     * 取得释放技能的协议中的 SkillParamerter参数结果
     * @param skillID
     * @return
     */
    public getSkillParamerter(ucType: number, skill: GameConfig.SkillConfigM, attackTarget: UnitController): void {
        let result = this.m_skillParam.skillParam;
        result.m_ucType = ucType;
        result.m_stValue.m_iSkillID = skill.m_iSkillID;
        result.m_stValue.m_iPrevSkillID = skill.m_iSkillID;

        // 计算角度
        let sourcePos = this.Hero.getPixelPosition();
        let targetPos = G.localPositionToServerPixel(this.m_skillParam.castTargetPosWorld);
        let faceAngle: number = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x) * 57;
        if (faceAngle < 0) {
            faceAngle += 360;
        }
        result.m_ushAngle = Math.round(faceAngle);
    }
    /**
     * 取得技能的效果目标
     * @param skill
     * @param specealTargetID 不为-1的话表示是使用物品，有targetID，是对应物品表里面的targetID
     * @return
     *
     */
    public getSkillEffectTargetList(skill: GameConfig.SkillConfigM, attackTarget: UnitController = null): void {
        if (SkillUtil.isSingleAttack(skill)) //单体技能,技能的范围类型是“所选目标”
        {
            this.getEffectTargetWithSingleSKill(skill, attackTarget);
        }
        else {
            //1. 得到该技能到底是范围内的哪种类型
            let targetType = skill.m_astSkillEffect[0].m_iSkillTarget;

            //2. 通过上面的类型去找到合适的角色，比如范围内敌对那就全部找敌对
            this.getTargetsByTargetType(skill, targetType, attackTarget, 0, this.m_skillParam.skillParam.m_ushAngle);

            //3. 用上面找到的每个角色去依次到技能配置中的每个效果类型中做匹配，合适的话确定，不合适就算了
            this.getEffectTargets(skill);
        }
    }

    /**
     * 通过统一判断出的类型得到合法的一些角色 ，必须是群攻
     * @param skill
     * @param targetType 效果目标类型
     * @return
     *
     */
    private getTargetsByTargetType(skill: GameConfig.SkillConfigM, targetType: number, attackTarget: UnitController = null, pvpType = 0, angle = 0) {
        let rangeType = skill.m_stSkillCastArea.m_ucRangeType; //范围类型
        let effectRange = skill.m_stSkillCastArea.m_uiEffectRange; //作用范围距离
        let maxNum = skill.m_stSkillCastArea.m_iMaxTargetNumber; //目标最大个数
        let angleRange = skill.m_stSkillCastArea.m_uiSideLength;

        switch (targetType) {
            case KeyWord.SKILL_EFFECT_TARGET_ENEMY: //范围内的敌对
                this.getEnemySkillTargets(skill, rangeType, effectRange, maxNum, pvpType, angle, angleRange);
                break;
            case KeyWord.SKILL_EFFECT_TARGET_FRIEND: //范围内友方目标
                this.getFriendSKillTargets(rangeType, effectRange, maxNum, pvpType, angle, angleRange);
                break;
            default:
                break;
        }
    }
    /**
     * 取得范围内的敌对目标
     * @param rangeType
     * @param effectRange
     * @param maxNum
     * @param specealTargetID
     * @return
     *
     */
    private getEnemySkillTargets(skill: GameConfig.SkillConfigM, rangeType: number, effectRange: number, maxNum: number, pvpType = 0, angle = 0, angleRange = 0) {
        let targets = this.m_skillParam.skillTargets.targets;
        targets.length = 0;
        let count: number = 0;
        // 优先选择当前攻击对象
        if (this.isEnermySkillTarget(this.m_skillParam.attackTarget, true, skill, effectRange, rangeType, angle, angleRange)) {
            targets.push(this.m_skillParam.attackTarget);
            count++;
            if (maxNum <= count) {
                return;
            }
        }
        let allElements = G.UnitMgr.AllUnits;
        let br: UnitController;
        for (let el in allElements) //遍历场景中所有的元素
        {
            br = allElements[el];
            if (br == this.m_skillParam.attackTarget) {
                continue;
            }
            if (this.isEnermySkillTarget(br, false, skill, effectRange, rangeType, angle, angleRange)) {
                targets.push(br);
                count++;
                if (maxNum <= count) {
                    break;
                }
            }
        }
    }

    private isEnermySkillTarget(br: UnitController, isAimTarget: boolean, skill: GameConfig.SkillConfigM, effectRange: number, rangeType: number, angle = 0, angleRange = 0): boolean {
        if (null == br || br.Data.unitType == UnitCtrlType.collection || br.Data.unitType == UnitCtrlType.hero ||
            (skill.m_stSkillCastArea.m_iSkillTarget == KeyWord.SKILL_TARGET_TYPE_ENEMY_MONSTER && br.Data.unitType != UnitCtrlType.monster)) {
            return false;
        }

        return this.isTargetAttackable(br.getPixelPosition(), effectRange, rangeType, angle, angleRange) && UnitUtil.isEnemy(br) && EnumTargetValidation.ok == G.BattleHelper.isValidTarget(br, false, !isAimTarget, skill);
    }

    private getFriendSKillTargets(rangeType: number, effectRange: number, maxNum: number, pvpType: number, angle: number, angleRange: number) {
        let targets = this.m_skillParam.skillTargets.targets;
        targets.length = 0;
        let count: number = 0;

        // 优先是自己
        targets.push(this.Hero);
        count++;
        if (maxNum <= count) {
            return;
        }

        let allElements = G.UnitMgr.AllUnits;
        let br: UnitController;
        for (let el in allElements) //遍历场景中所有的元素
        {
            br = allElements[el];
            if (br == this.m_skillParam.attackTarget) {
                continue;
            }
            if (this.isFriendSkillTarget(br, effectRange, rangeType, pvpType, angle, angleRange)) {
                targets.push(br);
                count++;
                if (maxNum <= count) {
                    break;
                }
            }
        }

        // 选择当前攻击对象
        if (null != this.m_skillParam.attackTarget && this.isFriendSkillTarget(this.m_skillParam.attackTarget, effectRange, rangeType, pvpType, angle, angleRange)) {
            targets.push(this.m_skillParam.attackTarget);
            count++;
            if (maxNum <= count) {
                return;
            }
        }
    }

    private isFriendSkillTarget(br: UnitController, effectRange: number, rangeType: number, pvpType: number, angle: number, angleRange: number): boolean {
        if (null == br || br.Data.unitType == UnitCtrlType.collection || br.Data.unitType == UnitCtrlType.hero || !UnitUtil.canUnitTypeBeAttacked(br.Data.unitType)) {
            return false;
        }

        return this.isTargetAttackable(br.getPixelPosition(), effectRange, rangeType, angle, angleRange) && UnitUtil.isFriendly(br, pvpType);
    }

    /**
     * 判断目标是否复合可攻击条件
     * @param targetPos
     * @param effectRange
     * @param rangeType
     * @param angleRange
     * @param faceAngle
     * @return
     *
     */
    private isTargetAttackable(targetPos: UnityEngine.Vector2, effectRange: number, rangeType: number, angle: number = 0, angleRange: number = 0): boolean {
        if (rangeType == KeyWord.SKILL_RANGE_TYPE_CIRCLE_SELF) // 自身为圆心的圆形
        {
            return this.inCircleBound(this.Hero.getPixelPosition(), targetPos, effectRange);
        }
        else if (rangeType == KeyWord.SKILL_RANGE_TYPE_CIRLCE_TARGET) // 目标为圆心的圆形
        {
            return this.inCircleBound(this.m_skillParam.targetPixel, targetPos, effectRange);
        }
        else if (rangeType == KeyWord.SKILL_RANGE_TYPE_SECTOR) //自身为圆心的扇形区域
        {
            return this.inFanBound(this.Hero.getPixelPosition(), targetPos, effectRange, angle, angleRange);
        }
        else if (rangeType == KeyWord.SKILL_RANGE_TYPE_RECTANGLE_SELF) //自身为起始边缘的矩形区域
        {
            return this.inRectangleBound(this.Hero.getPixelPosition(), targetPos, effectRange, angle, angleRange);
        }
        else if (rangeType == KeyWord.SKILL_RANGE_TYPE_CIRLCE_SELECT) // 所选圆形区域
        {
            //return this.inCircleBound(Scene.getMapMouseXY(), targetPos, effectRange);
            uts.assert(false, "SKILL_RANGE_TYPE_CIRLCE_SELECT do not arrowed");
        }

        return false;
    }
    /**
     * 圆形区域
     * @param sourcePos
     * @param targetPos
     * @param effectRange
     * @param faceAngle 面向角度
     * @return
     *
     */
    private inCircleBound(sourcePos: UnityEngine.Vector2, targetPos: UnityEngine.Vector2, effectRange: number): boolean {
        if (sourcePos != null && UnityEngine.Vector2.Distance(sourcePos, targetPos) <= effectRange) {
            return G.Mapmgr.tileMap.TestWalkStraight(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
        }

        return false;
    }

    /**
     * 扇形区域
     * @param sourcePos
     * @param targetPos
     * @param effectRange
     * @param faceAngle
     * @return
     *
     */
    private inFanBound(sourcePos: UnityEngine.Vector2, targetPos: UnityEngine.Vector2, effectRange: number, angle: number, angleRange: number): boolean {
        let r: number = UnityEngine.Vector2.Distance(sourcePos, targetPos);

        //10像素内 的圆范围 认为可攻击
        if (r <= 10) {
            return true;
        }

        if (r > effectRange) {
            return false;
        }

        let radius: number = angle * Math.PI / 180;

        let mydot: number = ((targetPos.x - sourcePos.x) / r) * Math.cos(radius) + ((targetPos.y - sourcePos.y) / r) * Math.sin(radius);

        return mydot > Math.cos((angleRange * 0.5) * Math.PI / 180);
    }

    /**
     * 矩形区域
     * @param sourcePos
     * @param targetPos
     * @param effectRange
     * @return
     *
     */
    private inRectangleBound(sourcePos: UnityEngine.Vector2, targetPos: UnityEngine.Vector2, effectRange: number, angle: number, angleRange: number): boolean {
        let radius: number = angle * Math.PI / 180;
        let cosVal: number = Math.cos(radius);
        let sinVal: number = Math.sin(radius);
        let deltaX: number = targetPos.x - sourcePos.x;
        let deltaY: number = targetPos.y - sourcePos.y;

        let x1: number = (deltaX) * cosVal + (deltaY) * sinVal;
        let y1: number = -(deltaX) * sinVal + (deltaY) * cosVal;

        return (x1 > 0 && x1 < effectRange && y1 > -angleRange * 0.5 && y1 < angleRange * 0.5);
    }

    /**
     * 取得协议中的效果目标
     * @param targets
     * @param skill
     * @return
     *
     */
    private getEffectTargets(skill: GameConfig.SkillConfigM) {
        let targets = this.m_skillParam.skillTargets.targets;
        let et = this.m_skillParam.skillTargets.effectTargets;
        let effectTargets = et.m_astSkillEffectTarget;
        effectTargets.length = 0;

        let roleNum = targets.length;
        let effectNum = skill.m_iEffectNumber;
        //遍历所有的角色，以此去对比每个效果目标类型，看其是否合法
        for (let i = 0; i < roleNum; ++i) {
            let role = targets[i];
            let effectTarget = newSkillEffectTarget();
            effectTarget.m_iUnitID = role.Data.unitID;
            for (let j = 0; j < effectNum; ++j) {
                if (skill.m_astSkillEffect[j] == null)
                    continue;
                let targetType = skill.m_astSkillEffect[j].m_iSkillTarget;
                if (targetType != KeyWord.SKILL_EFFECT_TARGET_SELECT || role == G.UnitMgr.SelectedUnit) {
                    effectTarget.m_ucEffectMask |= this.getMask(j);
                }
            }
            effectTargets.push(effectTarget);
        }

        et.m_ucEffectTargetNumber = roleNum;
    }

    private getMask(i: number) {
        return Math.pow(2, i);
    }
    /**
     * 针对作用在自己身上或者是所选目标身上的技能
     * @param skill
     * @return
     *
     */
    private getEffectTargetWithSingleSKill(skill: GameConfig.SkillConfigM, attackTarget: UnitController): void {
        let effectTargets = this.m_skillParam.skillTargets.effectTargets;
        effectTargets.m_astSkillEffectTarget.length = 0;
        let targets = this.m_skillParam.skillTargets.targets;

        let selfTarget: Protocol.SkillEffectTarget;
        let petTarget: Protocol.SkillEffectTarget;
        let attackeeTarget: Protocol.SkillEffectTarget;

        let skillEffect: GameConfig.SkillEffectM;
        let hasPetTip = false;
        let effectNum = skill.m_astSkillEffect.length;
        for (let i = 0; i < effectNum; ++i) {
            skillEffect = skill.m_astSkillEffect[i];
            switch (skillEffect.m_iSkillTarget) {
                case KeyWord.SKILL_EFFECT_TARGET_PET:
                    //var myPet: BaseRole = m_elementModule.hero.pet;
                    //if (myPet != null) {
                    //    if (petTarget == null) {
                    //        petTarget = new SkillEffectTarget();
                    //        petTarget.m_iUnitID = myPet.roleData.unitID;
                    //        effectTargets.m_astSkillEffectTarget.push(petTarget);
                    //        targets.push(myPet);
                    //    }
                    //    petTarget.m_ucEffectMask |= _getMask(i);
                    //}
                    //else if (!hasPetTip) // 目标是出战散仙时要给比较明确的指示
                    //{
                    //    m_manager.gTipMgr.addMainFloatTip("当前没有出战宠物", Macros.PROMPTMSG_TYPE_MIDDLE);
                    //    hasPetTip = true;
                    //}
                    break;

                case KeyWord.SKILL_EFFECT_TARGET_SELF: //效果目标是自身
                case KeyWord.SKILL_EFFECT_TARGET_OWNER:
                    if (selfTarget == null) {
                        selfTarget = newSkillEffectTarget();
                        selfTarget.m_iUnitID = this.Hero.Data.unitID;
                        effectTargets.m_astSkillEffectTarget.push(selfTarget);
                        targets.push(this.Hero);
                    }
                    selfTarget.m_ucEffectMask |= this.getMask(i);
                    break;

                case KeyWord.SKILL_EFFECT_TARGET_SELECT: //所选目标
                    if (null != attackTarget) {
                        // 有攻击目标的话就使用攻击目标
                        if (attackeeTarget == null) {
                            attackeeTarget = newSkillEffectTarget();
                            attackeeTarget.m_iUnitID = attackTarget.Data.unitID; //用自动攻击对象的unitID
                            effectTargets.m_astSkillEffectTarget.push(attackeeTarget);
                            targets.push(attackTarget);
                        }
                        attackeeTarget.m_ucEffectMask |= Math.pow(2, i);
                    }
                    else {
                        // 没有攻击目标的话就在攻击范围内寻找目标
                        if (KeyWord.SKILL_TARGET_TYPE_ENEMY == skill.m_stSkillCastArea.m_iSkillTarget) {
                            // 目标类型是敌人就选一个敌人
                        }
                        else if (KeyWord.SKILL_TARGET_TYPE_FRIEND == skill.m_stSkillCastArea.m_iSkillTarget) {
                            // 友方的话就选一个友方
                        }
                    }
                    break;

                //case KeyWord.SKILL_EFFECT_TARGET_FRIEND: //范围内的友方
                //case KeyWord.SKILL_EFFECT_TARGET_ALL: //范围内的所有人
                //case KeyWord.SKILL_EFFECT_TARGET_ENEMY: //范围内的敌方
                //case KeyWord.SKILL_EFFECT_TARGET_TEAM: //范围内的队友
                //case KeyWord.SKILL_EFFECT_TARGET_NEUTRAL: //范围内的中立
                //    uts.logError("单攻技能却配了范围攻击目标类型：" + skill.m_iSkillID);
                //    break;

                default:
                    uts.logError("不支持的技能目标类型：" + skill.m_iSkillID);
                    break;
            }
        }

        effectTargets.m_ucEffectTargetNumber = effectTargets.m_astSkillEffectTarget.length;
    }

    /**
	* 使用技能道具时候的一些前置处理
	* @param skill
	* @param target
	*
	*/
    private _processByPrepareSkill(skill: GameConfig.SkillConfigM, skillParam: Protocol.CastSkillParameter): void {
        if (skill.m_iPrepareTime != 0) //吟唱类的技能
        {
            // 需要先吟唱，然后再发请求
            // 经过测试，后台的tick最小1秒，会导致回包延迟大约600ms，此处自增600ms，且采集条不自动移除
            let desc: string;
            if (KeyWord.SKILL_BRANCH_PICK == skill.m_ucSkillBranch) {
                desc = '采集中';
            }
            else if (SkillData.isSameClassSkill(EnumSkillID.TOWN_PORTAL, skill.m_iSkillID)) {
                desc = '回城引导中';
            }
            else {
                desc = '技能吟唱中';
            }
            G.ViewCacher.collectionBar.open(skill.m_iSkillID, skill.m_iPrepareTime * 1000 + 600, null, desc, false);
            //this.m_prepareSkillTarget = targets;
        }
    }

    private _resetPrepare(skillID: number): void {
        G.ViewCacher.collectionBar.cancelByPrepareID(skillID);
        if (this.Hero.Data.isAlive) {
            if (!this.Hero.isMoving) {
                this.Hero.changeAction(UnitState.Stand);
            }
        }
    }

    /**
     * 取得技能的释放目标，用于判定技能是否可以释放
     * @param skill 技能配置
     * @param isUseItem 是否是使用到道具
     * @return
     *
     */
    public getSkillTarget(skill: GameConfig.SkillConfigM, attackTarget: UnitController): void {
        var st: Protocol.SkillTarget = this.m_skillParam.skillTarget;
        // 写入目标位置
        st.m_stUnitPosition.m_uiX = this.m_skillParam.castTargetPosX;
        st.m_stUnitPosition.m_uiY = this.m_skillParam.castTargetPosY;

        // 确定目标类型
        if (KeyWord.SKILL_BRANCH_PICK == skill.m_ucSkillBranch) {
            // 采集技能
            st.m_ushTargetType = Macros.CASTSKILL_TARGET_TYPE_UNITID;
            st.m_iUnitID = attackTarget.Data.unitID;
        }
        else if (skill.jumpDistance > 0) {
            if (skill.m_stSkillCastArea.m_iMaxTargetNumber < 2 && attackTarget) {
                // 单攻技能
                st.m_ushTargetType = Macros.CASTSKILL_TARGET_TYPE_UNITID;
                st.m_iUnitID = attackTarget.Data.unitID;
            }
            else {
                // 跳跃技能的目标点在调用这个之前就已经计算好了
                st.m_ushTargetType = Macros.CASTSKILL_TARGET_TYPE_POSITION;
                st.m_iUnitID = 0;
            }

        }
        else {
            // 其他技能
            let targetType = skill.m_stSkillCastArea.m_iSkillTarget;
            if (KeyWord.SKILL_TARGET_TYPE_SELF == targetType || KeyWord.SKILL_TARGET_TYPE_OWNER == targetType) {
                // 目标是自身
                st.m_ushTargetType = Macros.CASTSKILL_TARGET_TYPE_UNITID;
                st.m_iUnitID = this.Hero.Data.unitID;
            }
            else if (KeyWord.SKILL_TARGET_TYPE_ENEMY == targetType || KeyWord.SKILL_TARGET_TYPE_ALL == targetType) {
                // 目标是敌方
                if (skill.m_stSkillCastArea.m_iMaxTargetNumber == 1 && attackTarget != null) {
                    //单攻技能需要确定目标id
                    st.m_iUnitID = attackTarget.Data.unitID;
                    st.m_ushTargetType = Macros.CASTSKILL_TARGET_TYPE_UNITID;
                }
                else {
                    st.m_ushTargetType = Macros.CASTSKILL_TARGET_TYPE_POSITION;
                }
            }
            else {
                uts.log("不支持的施法目标类型：" + skill.m_iSkillID);
            }
        }
    }

    /**
     * 判断指定的技能的施放状态。
     * @param skill 技能的配置。
     * @param attackTarget 攻击目标，可以为null。
     * @param attackPos 攻击坐标，可以为null。
     * @param specialTarget 特殊目标。
     * @param pvpType 当前的PVP模式。
     * @return
     *
     */
    public getSkillStatusByConfig(skill: GameConfig.SkillConfigM, attackTarget: UnitController, specialTarget: number, useBestDis: boolean): number {
        if (specialTarget > 0) {
            // 有特定目标
            if (null == attackTarget || specialTarget != attackTarget.Data.id) {
                attackTarget = null;
                let targets = G.UnitMgr.getUnitById(specialTarget, 1);
                if (targets.length > 0) {
                    attackTarget = targets[0];
                }
            }

            // 如果找不到特定目标则不能打出去
            if (null == attackTarget) {
                return CastSkillStatus.NO_TARGET;
            }
        }

        // 没有攻击目标也没有攻击坐标的话也可以打出去，原地施放
        if (null == attackTarget) {
            return CastSkillStatus.CANCAST;
        }

        // 如果是自动战斗的话，需要考虑使用最佳距离，不然技能等于白放，比如大招
        if (0 == skill.m_stSkillCastArea.m_iCastDistance && (!useBestDis || 0 == skill.m_stSkillCastArea.bestDis)) {
            return CastSkillStatus.CANCAST;
        }

        let skipBlock = false;
        if (attackTarget.Data.unitType == UnitCtrlType.monster) {
            skipBlock = (attackTarget.Data.config as GameConfig.MonsterConfigM).m_bDignity == KeyWord.MONSTER_TYPE_DECORATE;
        }

        // 如果有选中目标的话就要校验施法距离
        let ret: number = 0;
        if (!skipBlock && !G.Mapmgr.tileMap.TestWalkStraight(this.m_skillParam.sourcePosX, this.m_skillParam.sourcePosY,
            this.m_skillParam.castTargetPosX, this.m_skillParam.castTargetPosY)) {
            // 检查阻挡
            ret = CastSkillStatus.BLOCKED; // 中间有阻隔
        }
        else {
            // 检查距离
            if (!this.judgeSkillDis(skill, useBestDis)) {
                ret = CastSkillStatus.OUTOFDIS; // 超出攻击距离
            }
            else {
                ret = CastSkillStatus.CANCAST; // 可以释放
            }
        }
        return ret;
    }
    private judgeSkillDis(skill: GameConfig.SkillConfigM, useBestDis: boolean): boolean {
        // 自动战斗的时候考虑使用最佳距离
        let castDis = skill.m_stSkillCastArea.m_iCastDistance;
        if (useBestDis && skill.m_stSkillCastArea.bestDis > 0) {
            if (0 == castDis) {
                castDis = skill.m_stSkillCastArea.bestDis;
            }
            else {
                castDis = Math.min(skill.m_stSkillCastArea.bestDis, castDis);
            }
        }

        if (0 == castDis) {
            return true;
        }
        let dis = UnityEngine.Vector2.Distance(this.m_skillParam.sourcePixel, this.m_skillParam.targetPixel);
        let sub = dis - castDis;
        return sub <= 0;
    }

    /**
     * 通过技能的response或者notify的消息取得技能的配置
     * @param param
     * @return
     *
     */
    public getConfigBySkillParam(param: Protocol.CastSkillParameter): GameConfig.SkillConfigM {
        let result: GameConfig.SkillConfigM;
        if (param.m_ucType == Macros.CASTSKILL_INTERFACE_ITEM) {
            let thingConfig = ThingData.getThingConfig(param.m_stValue.m_stContainerThing.m_iThingID);
            result = SkillData.getSkillConfig(thingConfig.m_iFunctionID);
        }
        else if (Macros.CASTSKILL_INTERFACE_SKILL == param.m_ucType) {
            result = SkillData.getSkillConfig(param.m_stValue.m_iSkillID);
        }
        else if (Macros.CASTSKILL_INTERFACE_PREVIEW == param.m_ucType) {
            result = SkillData.getSkillConfig(param.m_stValue.m_iPrevSkillID);
        }
        else {
            uts.logError("不受支持的技能释放类型：" + param.m_ucType);
        }
        return result;
    }
    public processEffect(id: number) {
        if (id >= 1 && id <= 100) {
            if (!G.DataMgr.settingData.HideSkillShake) {
                G.MapCamera.shake(id);
            }
        }
        else if (id >= 101 && id <= 200) {
            G.MapCamera.radialBlurSkill(id - 100);
        }
        else if (id >= 201) {
            if (!G.DataMgr.settingData.HideSkillShake) {
                G.MapCamera.tweenFovToSkill(id - 200);
            }
        }
    }

    /**
     * 技能攻击响应
     * @param msg
     *
     */
    private onCastSkillResponse(body: Protocol.CastSkill_Response): void {
        if (body.m_ushCasterUnitID != this.Hero.Data.unitID) {
            uts.logError("收到其他单位技能消息：" + body.m_ushCasterUnitID);
            return;
        }
        var skill = this.getConfigBySkillParam(body.m_stCastSkillParamerter);
        if (skill == null) //为空的情况是该技能为生活技能
        {
            uts.log("技能不存在：" + body);
            return;
        }
        // 不管成功失败都把读条拿掉
        if (skill.m_iPrepareTime > 0 && G.ViewCacher.collectionBar.hasShowCollection) {
            this._resetPrepare(skill.m_iSkillID);
        }

        if (ErrorId.EQEC_Success == body.m_ushResultID) {
            if (skill.m_iPrepareTime > 0) {
                // 吟唱技能的最后攻击动作
                if (skill.m_szBoyEffectID != "") {
                    EffectPlayer.play(this.m_skillParam.sourcePosWorld, this.m_skillParam.castTargetPosWorld, uts.format("skill/{0}", skill.m_szBoyEffectID), skill.m_effectTime / 10, true, false);
                }
            }
            else {
                // 处理非吟唱技能
                if (SkillTag.canStartCD(body.m_stCastSkillParamerter.m_ucTag)) {
                    // 更新冷却数据
                    this.cdData.addNewCd(skill);
                }
            }
            //震屏判断
            this.processEffect(skill.m_clientEffect1);
            this.processEffect(skill.m_clientEffect2);
            this.processEffect(skill.m_clientEffect3);
        }
        else {
            if (body.m_ushResultID > 10000
                && ErrorId.EQEC_Cast_CoolDown != body.m_ushResultID
                && ErrorId.EQEC_Cast_OutDistance != body.m_ushResultID
                && ErrorId.EQEC_In_Dead_Status != body.m_ushResultID
                && ErrorId.EQEC_Cast_Skill_Wrong_Target != body.m_ushResultID) {
                G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(body.m_ushResultID));
            }
            //else {
            //    uts.logWarning(uts.format('技能错误：skillID={0}, result = {1}', skill.m_iSkillID, body.m_ushResultID));
            //}
        }

        // 处理技能带来的影响
        if (ErrorId.EQEC_Success == body.m_ushResultID) {
            //根据有属性变更的列表更新打击
            this.processSkillResponseUAC(body, skill);

            // 前台怪自动反击
            let clientMonsterId = 0;
            for (let effectTarget of body.m_stSkillTargetList.m_astSkillEffectTarget) {
                let target = G.UnitMgr.getUnit(effectTarget.m_iUnitID);
                if (target == null || target.model == null || UnitCtrlType.monster != target.Data.unitType) {
                    continue;
                }
                let targetMonster = target as MonsterController;
                if (KeyWord.MONSTER_TYPE_DECORATE == targetMonster.Config.m_bDignity) {
                    clientMonsterId = targetMonster.Data.id;
                    break;
                }
            }
            if (clientMonsterId > 0) {
                let monsters = G.UnitMgr.getUnitById(clientMonsterId, 0);
                for (let clientMonster of monsters) {
                    (clientMonster as MonsterController).startFakeAI();
                }
            }
        }
        else {
            if (KeyWord.SKILL_BRANCH_PICK == skill.m_ucSkillBranch) {
                // 采集技能恢复站姿
                if (this.Hero.Data.isAlive && !this.Hero.isMoving) {
                    this.Hero.changeAction(UnitState.Stand);
                }
            }
            // 处理掉残留怪
            let len = body.m_stSkillTargetList.m_ucEffectTargetNumber;
            for (let i = 0; i < len; i++) {
                let effectTarget = body.m_stSkillTargetList.m_astSkillEffectTarget[i];
                if (0xff == effectTarget.m_ucEffectMask) {
                    // 0xff表示这是残留怪
                    let unit = G.UnitMgr.getUnit(effectTarget.m_iUnitID);
                    if (null != unit) {
                        G.ModuleMgr.unitModule.gotoHell(unit, null, 0, null);
                    }
                }
            }

            //// 如果是当前序列的技能，则终止序列
            //if (null != m_skillSerial && skillConf.m_iSkillID == m_skillSerial.skillConfig.m_iSkillID) {
            //    killSerial(m_skillSerial);
            //}
        }
    }

    /**
		 * 处理技能回复中的uac
		 * @param response
		 *
		 */
    private processSkillResponseUAC(response: Protocol.CastSkill_Response, skill: GameConfig.SkillConfigM): void {
        let isTeammate = false;
        let oldStatus: number;
        //处理技能释放者的uac
        if (response.m_stUACList.m_astCasterUAC != null) {
            for (let unitAttributeChanged of response.m_stUACList.m_astCasterUAC) {
                //更新UAC中生存死亡相关
                G.ModuleMgr.unitModule.processUnitAttribute(this.Hero, this.Hero, 0, unitAttributeChanged, 0, skill);
            }
        }
        //根据有属性变更的列表更新打击
        if (response.m_stUACList.m_astTargetUAC != null) {
            for (let unitAttributeChanged of response.m_stUACList.m_astTargetUAC) {
                let target = G.UnitMgr.getUnit(unitAttributeChanged.m_iUnitID);
                if (target == null) {
                    continue;
                }
                if (skill.m_szMonsterHurtEffect != "") {
                    EffectPlayer.play(target.getWorldPosition(), this.m_skillParam.sourcePosWorld, uts.format("skill/{0}", skill.m_szMonsterHurtEffect), 1, false, false);
                }
                if (unitAttributeChanged.m_uiMask != Macros.EffectMask_None) {
                    G.ModuleMgr.unitModule.processUnitAttribute(this.Hero, target, 0, unitAttributeChanged, Constants.HitFeelingDelay, skill);
                }
                //处理击飞
                if (skill.m_ucBodyFly == 1 && target.Data.unitType == UnitCtrlType.monster) {
                    this._processBodyFly(target as MonsterController);
                }
            }
        }
    }

    /**
    * 技能攻击notify处理
    * @param notify
    *
    */
    private onCastSkillNotify(notify: Protocol.CastSkill_Notify): void {
        let skill = this.getConfigBySkillParam(notify.m_stCastSkillParamerter);
        let attacker = G.UnitMgr.getUnit(notify.m_iUnitID);

        if (attacker == null) {
            //				Log.trace("技能notify没有施放者：" + notify.m_iUnitID);
            return;
        }

        if (G.DataMgr.runtime.__noSkillNotify) {
            let ut = attacker.Data.unitType;
            let isMine = (ut == UnitCtrlType.hero || (ut == UnitCtrlType.pet && (attacker as PetController).followedRole == G.UnitMgr.hero));
            if (!isMine) {
                let myUnitId = G.DataMgr.heroData.unitID;
                let u = notify.m_stUACList.m_astTargetUAC;
                for (let ou of u) {
                    if (ou.m_iUnitID == myUnitId) {
                        isMine = true;
                        break;
                    }
                }
            }

            if (!isMine) {
                return;
            }
        }

        // 从黑名单中移除
        G.BattleHelper.freeFromBlackList(notify.m_iUnitID);

        let pos = notify.m_stSkillTarget.m_stUnitPosition;
        //if (Macros.CASTSKILL_INTERFACE_PREVIEW == notify.m_stCastSkillParamerter.m_ucType && skillConfig.jumpDistance > 0) {
        //    // 这是跳跃预备

        //    attacker.jumpTo(pos.m_uiX, pos.m_uiY, XkrSkillSerial.getTime(skillConfig.specMovieAction), skillConfig.specMovieAction);
        //}
        let skillTarget = notify.m_stSkillTarget;
        let target: UnitController;
        let targetPos: UnityEngine.Vector3;
        if (skillTarget.m_ushTargetType == Macros.CASTSKILL_TARGET_TYPE_POSITION) {
            targetPos = Game.ThreeDTools.GetNavYValue(G.serverPixelXToLocalPositionX(skillTarget.m_stUnitPosition.m_uiX), G.serverPixelYToLocalPositionY(skillTarget.m_stUnitPosition.m_uiY));
        }
        else {
            target = G.UnitMgr.getUnit(skillTarget.m_iUnitID);
            targetPos = target == null ? null : target.getWorldPosition();
        }
        let skillBranch = skill.m_ucSkillBranch;
        if (attacker != this.Hero || skillBranch == KeyWord.SKILL_BRANCH_FABAO) {
            let unitType = attacker.Data.unitType;
            if (skillBranch != KeyWord.SKILL_BRANCH_FABAO) {
                if (unitType == UnitCtrlType.role) {
                    let roleCtrl = attacker as RoleController;
                    if (skill.m_iPrepareTime > 0 && Macros.CASTSKILL_STATUS_END == notify.m_ucCastStatus) {
                        // 采集完成，恢复站立
                        if (!UnitStatus.isDead(roleCtrl.Data.unitStatus) && !roleCtrl.isMoving) {
                            roleCtrl.changeAction(UnitState.Stand);
                        }
                    } else {
                        roleCtrl.attackTarget(targetPos, G.AnimationStateMgr.getSkillAction(skill));
                    }
                }
                else if (unitType == UnitCtrlType.pet) {
                    (attacker as PetController).attackTarget(targetPos);
                    if((attacker as PetController).followedRole == G.UnitMgr.hero) {
                        this.cdData.addNewCd(skill);
                    }
                }
                else {
                    (attacker as MonsterController).attackTarget(targetPos);
                }
            }
            if (unitType != UnitCtrlType.role) {
                if (skill.m_iCastSkillVoiceID > 0) {
                    G.AudioMgr.playSound("sound/unit/" + skill.m_iCastSkillVoiceID + ".mp3");
                }
            }

            let countnumber = unitType == UnitCtrlType.role;
            let pos = attacker.getWorldPosition();

            if (attacker.model.isVisible) {
                let effectName = skill.m_szPrepareEffect;
                if (effectName != "") {
                    EffectPlayer.play(pos, targetPos, uts.format("skill/{0}", effectName), skill.m_effectTime / 10, false, countnumber);
                }
                else {
                    if (skill.m_szBoyEffectID != "") {
                        EffectPlayer.play(pos, targetPos, uts.format("skill/{0}", skill.m_szBoyEffectID), skill.m_effectTime / 10, false, countnumber);
                    }
                }
            }
        }

        // 处理技能的uac相关
        this.processCasterNotifyUAC(notify.m_stUACList.m_astCasterUAC, skill.m_iSkillID, attacker);

        //处理技能目标的uac相关
        this.processTargetsNotifyUAC(notify.m_stUACList.m_astTargetUAC, attacker, skill, notify.m_iOwnerUnitID, skill);

        if (KeyWord.SKILL_BRANCH_WYYZ == skill.m_ucSkillBranch && G.DataMgr.petExpeditionData.getPetIdByYznqSkillId(skill.m_iSkillID) > 0) {
            // 伙伴远征主动技能
            let petCtrl = attacker as PetController;
            G.ViewCacher.mainUIEffectView.showPetSkill(skill, petCtrl.Data.petMonsterInfo.m_iMasterUnitID != this.Hero.Data.unitID);
        }

        if (KeyWord.SKILL_BRANCH_FABAO == skill.m_ucSkillBranch && notify.m_iUnitID == G.DataMgr.heroData.unitID) {
            G.ViewCacher.mainUIEffectView.showAnqiSkill(skill);
        }
    }

    /**
 * 处理技能notify中caster释放者相关的东西
 * @param attacker
 * @param skillID
 * @param unitAttributeChanged
 *
 */
    private processCasterNotifyUAC(casterUac: Protocol.UnitAttributeChanged[], skillID: number, attacker: UnitController): void {
        if (casterUac == null) {
            return;
        }
        if (null == attacker) {
            return;
        }

        let len = casterUac.length;
        for (let i = 0; i < len; ++i) {
            let unitAttributeChanged = casterUac[i];
            if (unitAttributeChanged != null) {
                //更新UAC中生存死亡相关
                G.ModuleMgr.unitModule.processUnitAttribute(attacker, attacker, 0, unitAttributeChanged, 0, null);
            }
        }
    }

    private processTargetsNotifyUAC(targetUac: Protocol.UnitAttributeChanged[], attacker: UnitController, skillConfig: GameConfig.SkillConfigM, casterOwnerUnitID: number, skill: GameConfig.SkillConfigM): void {
        //遍历该技能导致的属性变更列表
        let uacCount = targetUac.length;
        let attackerUnitType = attacker.Data.unitType;
        for (var i = 0; i < uacCount; i++) {
            let unitAttributeChanged = targetUac[i];

            //取得相应的受击者
            let tempTarget = G.UnitMgr.getUnit(unitAttributeChanged.m_iUnitID);
            if (tempTarget == null) {
                continue;
            }
            if (attackerUnitType == UnitCtrlType.pet && (attacker as PetController).followedRole == this._hero) {
                if (skillConfig.m_szMonsterHurtEffect != "") {
                    EffectPlayer.play(tempTarget.getWorldPosition(), attacker.getWorldPosition(), uts.format("skill/{0}", skillConfig.m_szMonsterHurtEffect), 2, false, false);
                }
            }
            //更新攻击受击的信息
            let attackedIsHero = (tempTarget.Data.unitType == UnitCtrlType.hero);
            let oldTempHp = tempTarget.Data.getProperty(Macros.EUAI_CURHP);

            if (unitAttributeChanged.m_uiEffectMask != Macros.EffectMask_Miss) //MISS
            {
                G.ModuleMgr.unitModule.processUnitAttribute(attacker, tempTarget, casterOwnerUnitID, unitAttributeChanged, Constants.HitFeelingDelay, skill);
            }
            if (skillConfig.m_ucBodyFly == 1 && tempTarget.Data.unitType == UnitCtrlType.monster) {
                this._processBodyFly(tempTarget as MonsterController);
            }

            if (attackedIsHero && (attackerUnitType == UnitCtrlType.monster || attackerUnitType == UnitCtrlType.role)) {
                // 记录此单位攻击自己的时间
                attacker.Data.lastAttackMeAt = UnityEngine.Time.realtimeSinceStartup;
                // 如果当前没有选中任务目标，则自动选中该目标
                if (null == G.UnitMgr.SelectedUnit) {
                    G.UnitMgr.selectUnit(attacker.Data.unitID, false);
                }
            }
        }
    }

    private _processBodyFly(monster: MonsterController) {
        if (monster.m_isBoss) {
            return;
        }
        if (monster.Data.getProperty(Macros.EUAI_CURHP) <= 0) {
            monster.setMoveType(Macros.MOVE_MODE_PULL);
            let nowPos = monster.getWorldPosition();
            let heroPos = this.Hero.getWorldPosition();
            let dirx = nowPos.x - heroPos.x;
            let dirz = nowPos.z - heroPos.z;
            nowPos.Set(nowPos.x + dirx * 1, nowPos.y, nowPos.z + dirz * 1);
            if (Game.ThreeDTools.GetCacheNavYValueBySample(nowPos, 10, G.cacheVec3)) {
                monster.simpleMove([G.cacheVec3]);
            }
        }
    }

    /**
     *
     * @param msg
     *
     */
    private onOperateSkillResponse(response: Protocol.OperateSkill_Response): void {

        if (response.m_ushResultID != 0) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ushResultID), Macros.PROMPTMSG_TYPE_MIDDLE);
        }
        else {
            if (Macros.OPERATE_SKILL_STUDY == response.m_ucOperate) {
                if (response.m_iUnitID == this.Hero.Data.unitID) {
                    let config: GameConfig.SkillConfigM = SkillData.getSkillConfig(response.m_iSkillID);
                    G.ModuleMgr.unitModule.processUnitAttribute(this.Hero, this.Hero, 0, response.m_stUnitAttributeChanged, 0, config);
                    //祝福系统技能
                    if (G.DataMgr.zhufuData.isZhufuSkill(response.m_iSkillID)) {
                        G.DataMgr.zhufuData.updateSkill(response.m_iSkillID);
                    }
                    else {
                        // 主动技能
                        this.skillData.studySkill(response.m_iSkillID);
                        config.progress = response.m_usProgress;

                        let faqiView = G.Uimgr.getForm<FaQiView>(FaQiView);
                        if (faqiView != null) {
                            faqiView.onSkillChange();
                        }
                    }
                    if (response.m_iSkillID == Macros.PROF_TYPE_HUNTER_VIP_SKILL_ID || response.m_iSkillID == Macros.PROF_TYPE_WARRIOR_VIP_SKILL_ID) {
                        let config: GameConfig.SkillConfigM = SkillData.getSkillConfig(response.m_iSkillID);
                        config.completed = 1;
                        G.Uimgr.createForm<SkillUnlockView>(SkillUnlockView).open(response.m_iSkillID);
                        G.ViewCacher.mainView.changeExperSkillIconDataChange();
                    }

                    if (KeyWord.SKILL_BRANCH_ROLE_ZY != config.m_ucSkillBranch) {
                        G.AudioMgr.playStarBombSucessSound();
                    }

                    let heroView = G.Uimgr.getForm<HeroView>(HeroView);
                    if (heroView != null) {
                        heroView.onJiuXingChanged();
                    }

                    let guildView: GuildView = G.Uimgr.getForm<GuildView>(GuildView);
                    if (guildView != null) {
                        guildView.onDailyGiftChanged();
                    }


                    G.ViewCacher.mainView.onSkillChange(config.m_iSkillID);

                    if (G.ViewCacher.tipsView.skillTip.isOpened) {
                        G.ViewCacher.tipsView.skillTip.onSkillChange(response.m_iSkillID);
                    }
                }
            }
            else if (Macros.OPERATE_SKILL_SET_FETTER == response.m_ucOperate) {
                G.DataMgr.skillData.updateSkillSet(response.m_stSkillFetterSet);
                G.ViewCacher.mainView.onSkillChange(0);
            }

            // 更新技能面板
            let skillForm = G.Uimgr.getForm<SkillView>(SkillView);
            if (skillForm != null) {
                skillForm.onSkillChange();
            }

            G.GuideMgr.tipMarkCtrl.onSkillChange();
        }
    }

    /**
    * 获取下一次将要释放的技能。
    * @return
    *
    */
    getAutoSkill(checkCd: boolean, notOnlyNormal: boolean): GameConfig.SkillConfigM {
        Profiler.push('getAutoSkill');
        let skillConfig: GameConfig.SkillConfigM;
        // 普通技能必须放全套
        let normalSkill: GameConfig.SkillConfigM;
        let hasCheckNormal = false;
        if (this.normalSkillStartId > 0) {
            Profiler.push('getNextNormalSkill 1');
            normalSkill = this.getNextNormalSkill(checkCd);
            hasCheckNormal = true;
            if (null != normalSkill && normalSkill.m_iSkillID != this.normalSkillStartId) {
                Profiler.pop();
                Profiler.pop();
                return normalSkill;
            }
            Profiler.pop();
        }

        // 缓存的技能优先
        if (this.m_cacheSkillId > 0) {
            Profiler.push('check Cache skill');
            skillConfig = SkillData.getSkillConfig(this.m_cacheSkillId);
            if ((!checkCd || null == this._getSkillCd(skillConfig)) && !SkillData.isOutOfMP(skillConfig) && this._canBeUsedHere(skillConfig)) {
                Profiler.pop();
                Profiler.pop();
                return skillConfig;
            }
            Profiler.pop();
        }

        if (notOnlyNormal) {
            let setting = G.DataMgr.deputySetting;
            let profSkillMap = this.skillData.getSkillsByProf(G.DataMgr.heroData.profession);

            //如果勾选了自动选择怒气技能
            if (setting.isAutoUseNuqi && G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2) >= 0) {
                let nuqiSkills: GameConfig.SkillConfigM[] = profSkillMap[KeyWord.SKILL_BRANCH_ROLE_NQ];
                if (null != nuqiSkills) {
                    Profiler.push('nuqi');
                    for (skillConfig of nuqiSkills) {
                        if (this.canAutoUse(skillConfig, checkCd)) {
                            // 怒气技能特殊处理一下，要范围内有怪
                            let selectedUnit = G.UnitMgr.SelectedUnit;
                            if (null != selectedUnit && null != selectedUnit.model) {
                                let tmpPos = selectedUnit.getPixelPosition();
                                let heroPos = G.UnitMgr.hero.getPixelPosition();
                                if (Math.pow(tmpPos.x - heroPos.x, 2) + Math.pow(tmpPos.y - heroPos.y, 2) < 90000) {
                                    Profiler.pop();
                                    Profiler.pop();
                                    return skillConfig;
                                }
                            }
                        }
                    }
                    Profiler.pop();
                }
            }

            // if (G.DataMgr.sceneData.curPinstanceID != Macros.PINSTANCE_ID_PVP) {
            //     Profiler.push('get pet NqSkill');
            //     let petSkillId = G.DataMgr.petData.getNqSkill();
            //     Profiler.pop();
            //     if (petSkillId > 0) {
            //         let petSkillConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(petSkillId);
            //         Profiler.push('check pet NqSkill');
            //         if (this.canAutoUse(petSkillConfig, checkCd)) {
            //             Profiler.pop();
            //             Profiler.pop();
            //             Profiler.pop();
            //             return petSkillConfig;
            //         }
            //         Profiler.pop();
            //     }
            // }

            // 从挂机技能中筛选出已经学习了的，而且蓝充足的
            Profiler.push('check zhiye');
            let zySkills: GameConfig.SkillConfigM[] = profSkillMap[KeyWord.SKILL_BRANCH_ROLE_ZY];
            for (skillConfig of zySkills) {
                // 表格配的都是自动战斗的，省点判断
                //if (KeyWord.SKILL_AUTOBATTLE_NO == skillConfig.m_ucAutoBattleSystem) {
                //    continue;
                //}

                if (!SkillData.isNormalSkill(skillConfig)) {
                    // 非普通技能
                    if (setting.autoSkillIDList.indexOf(Math.floor(skillConfig.m_iSkillID / 100)) < 0) {
                        // 挂机设置里没勾选
                        continue;
                    }
                    // 检查替换为羁绊技能
                    let replacedSkill = this.skillData.getJiBanSkillReplaced(skillConfig);
                    if (null != replacedSkill) {
                        skillConfig = replacedSkill;
                    }
                }

                if (this.canAutoUse(skillConfig, checkCd)) {
                    Profiler.pop();
                    Profiler.pop();
                    return skillConfig;
                }
            }
            Profiler.pop();
        }

        // 普攻
        if (hasCheckNormal) {
            skillConfig = normalSkill;
        } else {
            Profiler.push('getNextNormalSkill 2');
            skillConfig = this.getNextNormalSkill(checkCd);
            Profiler.pop();
        }
        if (null != skillConfig) {
            Profiler.pop();
            return skillConfig;
        }

        // 出生技能
        Profiler.push('getBornSkill');
        let bornSkill = this.skillData.getBornSkill();
        if (this.canAutoUse(bornSkill, checkCd)) {
            Profiler.pop();
            Profiler.pop();
            return bornSkill;
        }
        Profiler.pop();
        Profiler.pop();

        return null;
    }

    private getNextNormalSkill(checkCd: boolean): GameConfig.SkillConfigM {
        let normalSkills = this.skillData.getNormalSkills(G.DataMgr.heroData.profession);
        let lastNormalIndex = -1;
        let cnt = normalSkills.length;
        let lastSentNormalSkillIdx = -1;
        if (this.lastSentNormalSkillId > 0) {
            for (let i = 0; i < cnt; i++) {
                if (normalSkills[i].m_iSkillID == this.lastSentNormalSkillId) {
                    lastSentNormalSkillIdx = i;
                    break;
                }
            }
        }
        for (let i = lastSentNormalSkillIdx + 1; i < cnt; i++) {
            let skill = normalSkills[i];
            if (this.canAutoUse(skill, checkCd)) {
                return skill;
            }
        }
        for (let i = 0; i <= lastSentNormalSkillIdx; i++) {
            let skill = normalSkills[i];
            if (this.canAutoUse(skill, checkCd)) {
                return skill;
            }
        }
        return null;
    }

    canAutoUse(config: GameConfig.SkillConfigM, checkCd: boolean): boolean {
        if (!config.completed) {
            return false;
        }

        // 表格配的都是自动战斗的，省点判断
        if (KeyWord.SKILL_AUTOBATTLE_OK != config.m_ucAutoBattleSystem) {
            return false;
        }

        if (checkCd && null != this._getSkillCd(config)) {
            // 排除掉正在冷却的
            return false;
        }

        if (SkillData.isOutOfMP(config)) {
            // 排除掉蓝不足的
            return false;
        }

        // 排除掉场景不可用的
        if (!this._canBeUsedHere(config)) {
            return false;
        }

        let cfg = G.DataMgr.skillData.getExperSkillConfig(G.DataMgr.heroData.profession)
        if (cfg.m_iSkillID == config.m_iSkillID && (cfg.m_ucForbidden == 1 || G.DataMgr.runtime.isHangingUp)) {
            //排除禁用掉的vip体验技能
            return false;
        }

        return true;
    }

    private _sortAutoSkills(a: GameConfig.SkillConfigM, b: GameConfig.SkillConfigM): number {
        // 先按照CD排序
        // 检查服务器冷却
        let cda: CDData = this._getSkillCd(a);
        let cdb: CDData = this._getSkillCd(b);

        if (null == cda && null != cdb) {
            // a不在冷却而b在冷却，那么a优先
            return -1;
        }
        else if (null == cdb && null != cda) {
            // b不在冷却而a在冷却，那么b优先
            return 1;
        }
        else if (null != cda && null != cdb) {
            // a和b都在冷却，那么冷却快的优先
            let result = cda.remainTime - cdb.remainTime;
            if (0 != result) {
                // 冷却长短不一，使用冷却较短的
                return result;
            }
        }

        return this.sortWithoutCd(a, b);
    }

    private sortWithoutCd(a: GameConfig.SkillConfigM, b: GameConfig.SkillConfigM): number {
        //平砍优先级最低
        if (SkillData.isNormalSkill(a)) {
            return 1;
        }
        else if (SkillData.isNormalSkill(b)) {
            return -1;
        }

        // a和b都不在冷却，那么没用过的优先
        let usedCountA: number = Number(this.m_skillUseMap[Math.floor(a.m_iSkillID / 100)]);
        let usedCountB: number = Number(this.m_skillUseMap[Math.floor(b.m_iSkillID / 100)]);
        if (usedCountA != usedCountB) {
            // 使用次数少的优先
            return usedCountA - usedCountB;
        }
        else {
            return a.m_iSkillPriority - b.m_iSkillPriority;
        }
    }

    public _getSkillCd(skillConfig: GameConfig.SkillConfigM): CDData {
        // 先检查本地冷却
        let cd: CDData = this.localCdData.getCdDataBySkill(skillConfig);
        if (null == cd) {
            // 再检查后台冷却
            cd = this.cdData.getCdDataBySkill(skillConfig);
        }
        return cd;
    }

    clearSkillUseMap() {
        for (let idKey in this.m_skillUseMap) {
            this.m_skillUseMap[idKey] = 0;
        }
    }

    /**
    *
    * @param type 0是自动技能 1是捕捉散仙，3是采集
    * @return
    *
    */
    getCastSkill(type: number, monsterID: number = 0): GameConfig.SkillConfigM {
        let skill: GameConfig.SkillConfigM;

        if (HeroGotoType.PICK_MONSTER == type) {
            let mcfg = MonsterData.getMonsterConfig(monsterID);
            if (null != mcfg) {
                skill = SkillData.getSkillConfig(mcfg.m_iCollectionSkill);
            }
        }
        else if (HeroGotoType.ATTACK == type || HeroGotoType.ATTACK_AND_HANGUP == type) {
            skill = this.getAutoSkill(true, true);
        }

        return skill;
    }

    private _canBeUsedHere(skill: GameConfig.SkillConfigM): boolean {
        // 如果副本表里有配技能
        let pinstanceConfig = PinstanceData.getConfigByID(G.DataMgr.sceneData.curPinstanceID);
        if (pinstanceConfig != null && pinstanceConfig.m_ucIsReplaceSkill && pinstanceConfig.m_stSkillList.length > 0) {
            for (let vo of pinstanceConfig.m_stSkillList) {
                if (vo.m_uiValue == skill.m_iSkillID) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    /**
         * 使用带技能的物品
         * @param thingInfo
         *
         */
    onUseSkillItem(thingInfo: Protocol.ContainerThingInfo = null, needPrompMsg: boolean = true): boolean {
        if (!this.canCastSkill(needPrompMsg)) {
            this.m_cacheSkillId = 0;
            return false;
        }

        let containerThing: Protocol.ContainerThing;
        if (null == thingInfo) {
            containerThing = this.m_cacheItem;
        }
        else {
            containerThing = {} as Protocol.ContainerThing;
            containerThing.m_iThingID = thingInfo.m_iThingID;
            containerThing.m_iNumber = 1;
            containerThing.m_usPosition = thingInfo.m_usPosition;
        }

        let thing: GameConfig.ThingConfigM = ThingData.getThingConfig(containerThing.m_iThingID);
        let skill: GameConfig.SkillConfigM = SkillData.getSkillConfig(thing.m_iFunctionID);

        if (defines.has('_DEBUG')) {
            uts.assert(skill != null, '技能配置不存在，请策划人确定这个id是技能id不');
        }

        let skillID: number = skill.m_iSkillID;
        let selectedTarget: UnitController = G.UnitMgr.SelectedUnit;

        let sourcePos = G.UnitMgr.hero.getWorldPosition();
        this.m_skillParam.attackTarget = selectedTarget;
        this.m_skillParam.sourcePosWorld = sourcePos;
        this.m_skillParam.sourcePosX = G.localPositionXToServerPixelX(sourcePos.x);
        this.m_skillParam.sourcePosY = G.localPositionYToServerPixelY(sourcePos.z);

        if (selectedTarget != null) {
            let targetPos = selectedTarget.getWorldPosition();
            this.m_skillParam.setTargetPosWorld(targetPos.x, targetPos.y, targetPos.z);
        }

        let status: number = this.getSkillStatusByConfig(skill, selectedTarget, thing.m_iTargetID, false);
        if (status == CastSkillStatus.OUTOFDIS) //超出距离
        {
            // 使用道具超出攻击距离
            G.DataMgr.heroData.gotoType = HeroGotoType.ATTACK;
            this.m_cacheItem = containerThing;

            // 超出攻击距离,准备走到其附近
            if (PathingState.CANNOT_REACH == G.Mapmgr.moveToTarget(selectedTarget, skill)) //先走到附近，然后直接返回
            {
                // 无法走到附近，通知自动战斗失败，直接将该怪物视为无效
                G.BattleHelper.onAssistBattleFail(ErrorId.EQEC_Cast_Skill_Wrong_Target);
                return false;
            }
            return true;
        }
        else if (status == CastSkillStatus.NO_TARGET) {
            if (needPrompMsg) {
                G.TipMgr.addMainFloatTip('无法在这里使用该物品', Macros.PROMPTMSG_TYPE_MIDDLE);
            }
            this.m_cacheItem = null;
            return false;
        }
        else if (status == CastSkillStatus.NO_SELECTED_TARGET) //没有选中任何目标
        {
            if (needPrompMsg) {
                G.TipMgr.addMainFloatTip('请选择一个正确的目标', Macros.PROMPTMSG_TYPE_MIDDLE);
            }
            this.m_cacheItem = null;
            return false;
        }
        else if (status == CastSkillStatus.INVALID_TARGET) {
            if (needPrompMsg) {
                G.TipMgr.addMainFloatTip('请选择正确的目标', Macros.PROMPTMSG_TYPE_MIDDLE);
            }
            this.m_cacheItem = null;
            return false;
        }
        else if (status == CastSkillStatus.CANCAST) //开始释放技能
        {
            if (G.ViewCacher.collectionBar.hasShowCollection) {
                if (needPrompMsg) {
                    G.TipMgr.addMainFloatTip('吟唱过程中不可操作', Macros.PROMPTMSG_TYPE_MIDDLE);
                }
                return false;
            }

            //1. 发送释放技能的请求 
            this._getItemRequestParam(containerThing, skill, thing);
            this.attackOnce(skill);
            //2. 前置处理，比如切换动作、读条什么的
            this._processByPrepareSkill(skill, this.m_skillParam.skillParam);
            this.m_skillParam.reset();
            return true;
        }
        return false;
    }
    /**
		 * 取得使用技能道具时候的技能请求洗衣
		 * @param containerThing
		 * @return
		 *
		 */
    private _getItemRequestParam(containerThing: Protocol.ContainerThing, skill: GameConfig.SkillConfigM, thing: GameConfig.ThingConfigM): void {
        if (defines.has('_DEBUG')) {
            uts.assert(GameIDUtil.isThingID(containerThing.m_iThingID), '该ID必须是物品ID');
        }
        this.getSkillTarget(skill, null);
        this._getItemParameter(containerThing);
        this.getSkillEffectTargetList(skill, null);
    }

    /**
		 * 取得使用技能道具的协议中CastSkillParameter参数的结果
		 * @param containerThing
		 * @return
		 *
		 */
    private _getItemParameter(containerThing: Protocol.ContainerThing): void {
        let param: Protocol.CastSkillParameter = this.m_skillParam.skillParam;
        param.m_ucType = Macros.CASTSKILL_INTERFACE_ITEM;
        param.m_stValue.m_stContainerThing = containerThing;
        param.m_ucTag = 0;
    }
}
export default SkillModule;