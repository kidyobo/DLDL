import { Global as G } from "System/global";
import { RoleController } from 'System/unit/role/RoleController'
import { MathUtil } from 'System/utils/MathUtil'
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { EffectPlayer } from "System/unit/EffectPlayer"
import { UnitUtil } from 'System/utils/UnitUtil'

export class JumpHandler {

    /**跳跃点跳跃起跳耗时，单位秒。*/
    static readonly JumpPrepareTime = 0;
    /**跳跃点跳跃位移耗时，单位秒(跳跃动作不循环，无视距离固定时间)。*/
    static readonly JumpMoveTime = 1.05;
    /**飞行位移速度，单位米(飞行动作循环，飞行时间依赖于距离)。*/
    static readonly FlyMoveSpeed = 40;
    /**飞行最小距离，单位像素(小于该距离的飞行使用跳跃动作)。*/
    static readonly FlyMinDistance = 800;

    /**跳跃点跳跃落地耗时，单位毫秒。*/
    static readonly JumpStandTime: number = 50;

    /**是否在跳跃中*/
    isJumping: boolean;
    /**跳跃时的水平移动速度*/
    jumpSpeed: number = 0.2;
    /**跳跃高度。*/
    private readonly jumpHeightWorld: number = 10;

    /**跳跃高度。*/
    private readonly flyHeightWorld: number = 15;

    private endPosPixel: UnityEngine.Vector2;
    private endPosWorld: UnityEngine.Vector3;

    private target: RoleController;
    private animIdx = 1;

    /**跳跃位移落地的延迟定时器*/
    private standTimer: Game.Timer;

    /**跳跃结束后的回调。*/
    private m_callback: () => void;

    private isFly: boolean;

    constructor(target: RoleController) {
        this.target = target;
        this.target.model.onJumpOver = delegate(this, this.onJumpToEnd);
    }

    public destroy() {
        if (this.target != null) {
            if (this.target.model) {
                this.target.model.stopJump();
            }
            this.target = null;
            this.m_callback = null;
            if (null != this.standTimer) {
                this.standTimer.Stop();
                this.standTimer = null;
            }
        }
    }

    /**
    * 跳跃至某点
    * @param endPos
    * 
    */
    jumpTo(destX: number, destY: number, callback: () => void = null) {
        let startPosPixel: UnityEngine.Vector2 = this.target.getPixelPosition();
        this.endPosPixel = new UnityEngine.Vector2(destX, destY);
        this.m_callback = callback;
        if (MathUtil.vector2Equals(startPosPixel, this.endPosPixel)) {
            this.finishJump();
        }
        else {
            this.isJumping = true;
            let startPosWorld: UnityEngine.Vector3 = this.target.getWorldPosition();
            let posX = G.serverPixelXToLocalPositionX(destX);
            let posY = G.serverPixelYToLocalPositionY(destY);
            this.endPosWorld = Game.ThreeDTools.GetNavYValue(posX, posY);
            let jumpDistance: number = UnityEngine.Vector2.Distance(startPosPixel, this.endPosPixel);//总位移
            // 单程跳跃的耗时取决于跳跃动作的耗时，因此是固定的，但是单程跳跃的距离是浮动的
            {
                //看二点可否寻路过去，如果不可以，则是单跳，否则拆分为多跳
                let navPath = new UnityEngine.NavMeshPath();
                UnityEngine.NavMesh.CalculatePath(startPosWorld,
                    this.endPosWorld, -1, navPath);
                if (jumpDistance < JumpHandler.FlyMinDistance) {
                    this.isFly = false;
                    this.jumpSpeed = jumpDistance / JumpHandler.JumpMoveTime;
                    this.jumpSpeed = 1 / G.serverPixelUnitToLocalPositionUnit(this.jumpSpeed);
                }
                else {
                    this.isFly = true;
                    this.jumpSpeed = 1 / JumpHandler.FlyMoveSpeed;
                }
            }

            this.doOneJump(jumpDistance);
        }
    }

    private doOneJump(jumpDistance: number) {
        this.target.changeAction(UnitState.Jump);

        let destination = this.endPosWorld;
        let nowPos: UnityEngine.Vector2 = this.target.getPixelPosition();
        let endPos = UnityEngine.Vector2.MoveTowards(nowPos, this.endPosPixel, jumpDistance);
        destination = G.serverPixelToLocalPosition(endPos.x, endPos.y);
        let jumpPath: UnityEngine.Vector3[] = [destination];

        let model = this.target.model;
        model.jumpTo(this.jumpSpeed, jumpPath, this.jumpHeightWorld, JumpHandler.JumpPrepareTime);

        G.MapCamera.tweenFovToJump();
        if (this.isFly) {
            model.tweenPath.onApproach = delegate(this, this.onApproach);
        }
        else {
            model.tweenPath.onApproach = null;
        }
        this.target.onStatusOutOfFight();
        G.AudioMgr.playSound("sound/misc/jump.mp3");
    }

    private onApproach() {
		if(!this.target)return;
        this.target.changeAction(UnitState.FlyEnd);
    }

    private onJumpToEnd() {
        if (null == this.standTimer) {
            this.standTimer = new Game.Timer("jump handle", JumpHandler.JumpStandTime, 1, delegate(this, this.onJumpStandTimer));
        } else {
            this.standTimer.ResetTimer(JumpHandler.JumpStandTime, 1, delegate(this, this.onJumpStandTimer));
        }
    }

    private onJumpStandTimer(timer: Game.Timer) {
        this.finishJump();
    }

    /**结束跳跃，并执行后续回调。*/
    finishJump(): void {
        this.target.onStatusFight();
        this.clearJumpState();
        let callback: () => void = this.m_callback;
        this.m_callback = null;
        if (null != callback) {
            callback();
        }
    }

    /**
     * 终止跳跃，不执行后续回调。
     * @param finishJump 是否立即扯到跳跃目标点。
     * 
     */
    suicide(finishJump: boolean): void {
        this.clearJumpState();
        if (finishJump && this.isJumping) {
            uts.logError('在跳-----------')
            this.target.onStatusOutOfFight();
            this.target.setWorldPositionV3(this.endPosWorld);
        }

        this.m_callback = null;
    }

    private clearJumpState() {
        this.isJumping = false;
        let pos = this.target.getWorldPosition();
        this.target.setWorldPositionV3(pos);
        Game.Tools.SetGameObjectLocalPosition(this.target.model.rotateGameObject, 0, 0, 0);
        if (this.target.state == UnitState.Jump) {
            this.target.changeAction(UnitState.Stand);
        }
        this.target.model.stopJump();
        if (null != this.standTimer) {
            this.standTimer.Stop();
            this.standTimer = null;
        }
    }

    get jumpAnimationName() {
        if (this.isFly) {
            return 'fly1';
        }
        else {
            this.animIdx = (this.animIdx % 2) + 1;
            return 'jump' + this.animIdx;
        }
    }
}