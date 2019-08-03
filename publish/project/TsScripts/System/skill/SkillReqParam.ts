import { Global as G } from 'System/global'
import { UnitController } from "System/unit/UnitController";
import { SkillReqTargets } from "System/skill/SkillReqTargets";
import { newSkillTarget } from "System/protocol/new/NSkillTarget";
import { newCastSkillParameter } from "System/protocol/new/NCastSkillParameter";
export class SkillReqParam {
    private static cacheV21 = new UnityEngine.Vector2(0, 0);
    private static cacheV22 = new UnityEngine.Vector2(0, 0);
    /**
		 * 技能目标参数。
		 */
    public skillTarget: Protocol.SkillTarget = newSkillTarget(); 

    /**
     * 释放技能的目标单位。
     */
    public attackTarget: UnitController;

    /**
     * 释放技能的目标坐标。
     */
    public castTargetPosX = 0;
    public castTargetPosY = 0;

    public castTargetPosWorld = new UnityEngine.Vector3(0, 0, 0);
    setTargetPosWorld(x: number, y: number, z: number) {
        this.castTargetPosWorld.Set(x, y, z);
        this.castTargetPosX = G.localPositionXToServerPixelX(x);
        this.castTargetPosY = G.localPositionYToServerPixelY(z);
    }

    public sourcePosX = 0;
    public sourcePosY = 0;
    public sourcePosWorld: UnityEngine.Vector3 = null;
    public get targetPixel() {
        SkillReqParam.cacheV21.Set(this.castTargetPosX, this.castTargetPosY);
        return SkillReqParam.cacheV21;
    }
    public get sourcePixel() {
        SkillReqParam.cacheV22.Set(this.sourcePosX, this.sourcePosY);
        return SkillReqParam.cacheV22;
    }

    /**
     * 技能释放参数。
     */
    public skillParam: Protocol.CastSkillParameter = newCastSkillParameter();

    /**
     * 技能打击列表参数。
     */
    public skillTargets = new SkillReqTargets();

    public reset(): void {
        this.attackTarget = null;
        this.skillTargets.reset();
    }

    public dispose(): void {
        this.reset();
        this.skillParam = null;
        this.skillTargets = null;
    }
}
export default SkillReqParam;