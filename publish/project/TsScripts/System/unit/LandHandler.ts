import { Global as G } from "System/global";
import { RoleController } from 'System/unit/role/RoleController'
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { UnitStatus } from 'System/utils/UnitStatus'
export class LandHandler {
	/**
	 * 是否在降落中
	 */
    public isLanding = false;
    private readonly m_landTime = 0.3;
    private readonly m_landHeight = 5;

    private target: RoleController;

    private tweenPosition: Tween.TweenPosition;

    private landTimer: Game.Timer;

	/**
	 * 降落结束后的回调。
	 */
    private m_callback: () => void;

    constructor(target: RoleController) {
        this.target = target;
    }


    public destroy() {
        this.clearLandState();
        this.target = null;
        this.m_callback = null;
    }

    /**
     * 降落至某点
     * @param endPos
     *
     */
    public land(callback: () => void = null) {
        this.m_callback = callback;

        this.isLanding = true;
        if (UnitStatus.isInRide(this.target.Data.unitStatus)) {
            // 如果是骑马状态则直接掉下来啦
            Game.Tools.SetGameObjectLocalPosition(this.target.model.rotateGameObject, 0, this.m_landHeight, 0);
            let tweenPosition = Tween.TweenPosition.Begin(this.target.model.rotateGameObject, this.m_landTime, G.getCacheV3(0, 0, 0));
            this.tweenPosition = tweenPosition;
            tweenPosition.onFinished = delegate(this, this.onTweenPositionFinished);
        } else {
            // 否则播放enter动作
            this.target.changeAction(UnitState.Enter);
            if (null == this.landTimer) {
                this.landTimer = new Game.Timer('land', 350, 1, delegate(this, this.onEnterFloorTimer));
            } else {
                this.landTimer.ResetTimer(350, 1, delegate(this, this.onEnterFloorTimer));
            }
        }

    }

    private onEnterFloorTimer(timer: Game.Timer) {
        this.onLandToFloor();
    }

    private onTweenPositionFinished() {
        this.onLandToFloor();
    }

    private onLandToFloor() {
        // 掉到地板上了，震个屏
        G.MapCamera.wave();
        G.UnitMgr.heroFollower.Shake(Game.QuakeDirection.Up, G.getDouble("LandShakeTime"), G.getDouble("LandShakeSize"), G.getCurve("LandShake"));
        G.AudioMgr.playSound("sound/misc/wave.wav");
        this.finishLand();
    }

    private onLandDelayTimer(timer: Game.Timer) {
        this.finishLand();
    }

    /**
     * 结束降落，并执行后续回调。
     */
    public finishLand() {
        this.clearLandState();
        this.target.changeAction(UnitState.Stand);

        let callback = this.m_callback;
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
    public suicide() {
        this.clearLandState();
        this.m_callback = null;
    }

    private clearLandState() {
        if (this.isLanding) {
            this.isLanding = false;
        }
        if (null != this.landTimer) {
            this.landTimer.Stop();
            this.landTimer = null;
        }
        Game.Tools.SetGameObjectLocalPosition(this.target.model.rotateGameObject, 0, 0, 0);

        if (null != this.tweenPosition) {
            this.tweenPosition.onFinished = null;
            this.tweenPosition.enabled = false;
            this.tweenPosition = null;
        }
    }
}