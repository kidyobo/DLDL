import { UnitController } from "System/unit/UnitController";
import { RoleController } from 'System/unit/role/RoleController'
import { UnitData } from "System/data/RoleData";
import { Macros } from 'System/protocol/Macros';
import { CachingLayer, CachingSystem} from 'System/CachingSystem'
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { Global as G } from "System/global";
import { UnitCtrlType, EnumDir2D } from 'System/constants/GameEnum'
import { MathUtil } from 'System/utils/MathUtil'
import { Constants } from 'System/constants/Constants'
import { UnitStatus } from 'System/utils/UnitStatus'

export class CheckPosCfg {
    standMine = 2;
    moveMine = 1;
    standOther = 4;
    moveOther = 2;

    roleDistance = 0;
    blinkDistance = 0;

    awayFactor = 1;

    constructor(standMine: number, moveMine: number, standOther: number, moveOther: number, roleDistance: number, blinkDistance: number, awayFactor: number) {
        this.standMine = standMine;
        this.moveMine = moveMine;
        this.standOther = standOther;
        this.moveOther = moveOther;

        this.roleDistance = roleDistance;
        this.blinkDistance = blinkDistance;

        this.awayFactor = awayFactor;
    }
}

export abstract class AttendantController extends UnitController {
    followedRole: RoleController;
    protected loaded: boolean = false;

    /**达到纠正的次数*/
    protected redressCount: number = 20;

    protected m_adjustPathCount: number = 0;

    protected coverDistance: number = 80;

    protected m_followPath: UnityEngine.Vector3[] = [];

    protected lastEndMoveAt: number = 0;

    protected checkPosIntervalStand = 4;
    protected checkPosIntervalMove = 2;
    protected lastCheckPisitionAt = 0;
    protected checkPosCfg: CheckPosCfg;

    protected lastMoveTargetPixel: Protocol.UnitPosition;

    onLoad() {
        if (this.followedRole.Data.unitType == UnitCtrlType.hero) {
            this.onLoadModel();
        } else {
            G.UnitMgr.unitCreateQueue.add(this);
        }
    }
    public onLoadModel() {
        this.loaded = true;
        this.model.showShadow(true, true);
        this.onUpdateVisible();
        this.onUpdateNameboard(null);
        this.updateAvatar();
    }


    public onAvatarChanged() {
        if (this.loaded) {
            this.updateAvatar();
        }
    }

    protected abstract updateAvatar();

    public onDestroy() {
        if (!this.loaded) {
            G.UnitMgr.unitCreateQueue.remove(this);
        }
        this.clearFollower();
        this.followedRole = null;
        this.m_followPath = null;
    }
    public onMoveEnd(byStop: boolean) {
        this.lastEndMoveAt = UnityEngine.Time.realtimeSinceStartup;
    }
    public onHit() { }
    public onDead() { }
    public onAddBuff(buffInfo: Protocol.BuffInfo) { }
    public onDeleteBuff(buffId: number) { }

    onUpdateTimer(now: number) {
        if (this.model.isVisible && G.noatttest) {
            super.onUpdateTimer(now);

            // 检查跟随主人
            this.checkPosition(now);
        }
    }

    protected checkPosition(now: number) {
        if (this.followedRole == null || this.followedRole.IsJumping) {
            return;
        }
        let timelapse = now - this.lastCheckPisitionAt;
        let needCheck = false;
        let posPixel = this.getPixelPosition();
        let isMoveing = this.isMoving;
        let roleIsMoveing = this.followedRole.isMoving;
        if (isMoveing) {
            needCheck = null != this.lastMoveTargetPixel && MathUtil.getDistance(this.lastMoveTargetPixel.m_uiX, this.lastMoveTargetPixel.m_uiY, posPixel.x, posPixel.y) <= this.checkPosCfg.roleDistance;
        } else if (roleIsMoveing ){
            needCheck = timelapse >= this.checkPosIntervalMove;
        } else {
            needCheck = timelapse >= this.checkPosIntervalStand;
        }
        if (needCheck) {
            this.lastCheckPisitionAt = now;
            let followedPosPixel = this.followedRole.getPixelPosition();
            let distance = MathUtil.getDistance(posPixel.x, posPixel.y, followedPosPixel.x, followedPosPixel.y);
            let keepAway = this.getKeepAway(roleIsMoveing, UnitStatus.isInRide(this.followedRole.Data.unitStatus));
            if (distance <= keepAway) {
                if (isMoveing && !roleIsMoveing) {
                    // 主人没在移动，且距离过近，则停止移动
                    this.stopMove();
                }
            } else if (distance > this.getFollowDistance(roleIsMoveing)) {
                this.data.setProperty(Macros.EUAI_SPEED, this.followedRole.Data.getProperty(Macros.EUAI_SPEED));
                this.lastMoveTargetPixel = G.Mapmgr.moveAttendantToPos(this, posPixel, followedPosPixel.x, followedPosPixel.y, distance, keepAway, this.checkPosCfg.blinkDistance);
            }
        }
    }
    protected getKeepAway(roleIsMoveing: Boolean, roleIsRiding: Boolean): number {
        let rad = 1;
        if (roleIsMoveing) {
            rad = Constants.AttendantKeepAwayScaleMoving;
        } else {
            if (roleIsRiding) {
                rad = 2;
            } else {
                rad = Constants.AttendantKeepAwayScale;
            }
        }
        return this.checkPosCfg.roleDistance * rad;
    }
    protected getFollowDistance(roleIsMoveing: Boolean): number {
        return this.checkPosCfg.roleDistance * (roleIsMoveing ? Constants.AttendantKeepAwayScaleMoving : 1);
    }

    abstract clearFollower();

    getAsidePosition(p: Game.Vector2): Game.Vector2 {
        let keepAway = this.getKeepAway(false, true);
        let rad = Math.random() * 2 * Math.PI;
        p.x += Math.cos(rad) * keepAway;
        p.y += Math.sin(rad) * keepAway;
        //let d = this.followedRole.Dir2D;
        //if (d > EnumDir2D.UP) {
        //    p.x += keepAway;
        //}
        //else {
        //    p.x -= keepAway;
        //}

        //if (d < EnumDir2D.UP_RIGHT || d > EnumDir2D.LEFT_UP) {
        //    p.y += keepAway;
        //}
        //else {
        //    p.y -= keepAway;
        //}

        if (p.x < 0) {
            p.x = 0;
        }

        if (p.y < 0) {
            p.y = 0;
        }
        return p;
    }

    protected get _isCover(): boolean {
        let posPixel = this.model.getPixelPosition();
        let followedPosPixel = this.followedRole.getPixelPosition();
        return Math.sqrt(Math.pow(posPixel.x - followedPosPixel.x, 2) + Math.pow(posPixel.y - followedPosPixel.y, 2)) < this.coverDistance;
    }

    setFollowed(followedRole: RoleController): void {
        this.followedRole = followedRole;
        this.data.setProperty(Macros.EUAI_SPEED, followedRole.Data.getProperty(Macros.EUAI_SPEED));
        if (UnitCtrlType.hero == followedRole.Data.unitType) {
            // 自己的武缘检查频率高一点
            this.checkPosIntervalMove = this.checkPosCfg.moveMine;
            this.checkPosIntervalStand = this.checkPosCfg.standMine;
        } else {
            this.checkPosIntervalMove = this.checkPosCfg.moveOther;
            this.checkPosIntervalStand = this.checkPosCfg.standOther;
        }
    }

    public onUpdateVisible() {
        let follower = this.followedRole;
        if (follower) {
            let settingData = G.DataMgr.settingData;
            let force = settingData.hideFollowsForce;
            let followVisible = follower.model.isVisible && !force;
            if (follower.Data.unitType == UnitCtrlType.hero) {
                this.model.setVisible(followVisible, followVisible);
            }
            else {
                followVisible = followVisible && !settingData.HideFollowers;
                this.model.setVisible(followVisible, followVisible);
            }
        }
    }
}