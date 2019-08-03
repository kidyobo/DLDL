import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { SkillData } from 'System/data/SkillData'
import { MonsterController } from 'System/unit/monster/MonsterController'
import { NetModule } from 'System/net/NetModule'
import { Macros } from 'System/protocol/Macros'
import { SkillReqParam } from 'System/skill/SkillReqParam'

/**
 * 怪物假AI。
 * @author teppei
 *
 */
export class MonsterFakeAI {
    private m_isRunning: boolean;

    private m_lastAttackAt: number = 0;

    private m_skillReqParam: SkillReqParam;

    private m_monster: MonsterController;

    private m_timer: Game.Timer;

    constructor() {
        this.m_skillReqParam = new SkillReqParam();
    }

    start(monster: MonsterController): void {
        this.m_monster = monster;
        this.m_isRunning = true;

        if (null == this.m_timer) {
            this.m_timer = new Game.Timer("monsterFakeAi",500, 0, delegate(this, this.onTimer));
        }
    }

    reset(): void {
        this.m_monster = null;
        this.m_isRunning = false;
        if (null != this.m_timer) {
            this.m_timer.Stop();
            this.m_timer = null;
        }
    }

    onTimer(timer: Game.Timer): void {
        let skillConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(this.m_monster.Config.m_iSkillID);
        // 首先检查距离，距离太远就不打
        let hero = G.UnitMgr.hero;
        if (null == hero) {
            return;
        }
        let heroPosPixel = hero.getPixelPosition();
        let monsterPosPixel = this.m_monster.getPixelPosition();
        let dis: number = UnityEngine.Vector2.Distance(heroPosPixel, monsterPosPixel);
        if (dis > skillConfig.m_stSkillCastArea.m_iCastDistance) {
            // 超过攻击距离2倍则停止
            if (dis > skillConfig.m_stSkillCastArea.m_iCastDistance * 2) {
                this.reset();
            }
            return;
        }

        let now: number = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);
        if (this.m_lastAttackAt > 0 && now - this.m_lastAttackAt < skillConfig.m_stSkillCollDown.m_uiSelfCoolDown) {
            return;
        }

        this.m_lastAttackAt = now;

        // 构建参数
        this.m_skillReqParam.attackTarget = hero;

        this.m_skillReqParam.skillParam.m_stValue.m_iPrevSkillID = skillConfig.m_iSkillID;
        this.m_skillReqParam.skillParam.m_stValue.m_iSkillID = skillConfig.m_iSkillID;
        this.m_skillReqParam.skillParam.m_ucTag = 0;
        this.m_skillReqParam.skillParam.m_ucType = Macros.CASTSKILL_INTERFACE_SKILL;
        this.m_skillReqParam.skillParam.m_ushAngle = 0;

        this.m_skillReqParam.skillTarget.m_iUnitID = G.DataMgr.heroData.unitID;

        this.m_skillReqParam.skillTargets.effectTargets.m_astSkillEffectTarget.length = 1;
        let effectTarget: Protocol.SkillEffectTarget = {} as Protocol.SkillEffectTarget;
        effectTarget.m_iUnitID = G.DataMgr.heroData.unitID;
        effectTarget.m_ucEffectMask = 0;
        this.m_skillReqParam.skillTargets.effectTargets.m_astSkillEffectTarget[0] = effectTarget;
        this.m_skillReqParam.skillTargets.effectTargets.m_ucEffectTargetNumber = 1;

        let notify: Protocol.CastSkill_Notify = ProtocolUtil.getFakeCastSkillNotify(this.m_monster, skillConfig, this.m_skillReqParam);
        G.ModuleMgr.netModule.broadcastFakeMsg(Macros.MsgID_CastSkill_Notify, notify);
    }

    get isRnning(): boolean {
        return this.m_isRunning;
    }

    destroy(): void {
        this.reset();
        if (this.m_skillReqParam) {
            this.m_skillReqParam.dispose();
            this.m_skillReqParam = null;
        }
    }
}
