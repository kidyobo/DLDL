import { UnitController } from "System/unit/UnitController";
import { newSkillEffectTargetList } from "System/protocol/new/NSkillEffectTargetList";

export class SkillReqTargets {
    public targets: UnitController[] = [];
    public effectTargets: Protocol.SkillEffectTargetList = newSkillEffectTargetList();

    public reset(): void {
        this.targets.length = 0;
        this.effectTargets.m_astSkillEffectTarget.length = 0;
        this.effectTargets.m_ucEffectTargetNumber = 0;
    }
}
export default SkillReqTargets;