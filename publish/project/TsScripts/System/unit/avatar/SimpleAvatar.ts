import { AvatarMesh } from "System/unit/avatar/AvatarMesh"
import { UnitState } from "System/unit/UnitState"
import { BuffableAvatar } from "System/unit/avatar/BuffableAvatar"
import { Global as G } from 'System/global'
import { InteractiveMesh } from "System/unit/avatar/InteractiveMesh"
import { IPool, ObjectPool } from 'Common/pool/ObjectPool'
import { UnitCtrlType } from 'System/constants/GameEnum'

export class SimpleAvatar extends BuffableAvatar implements IPool {
    public static pool = new ObjectPool();
    m_bodyMesh: AvatarMesh;
    /**boss脚底光环*/
    m_circleMesh: AvatarMesh;
    public get defaultAvatar(): AvatarMesh {
        return this.m_bodyMesh;
    }
    public onCreate() {
        if (this.m_bodyMesh == null) {
            this.m_bodyMesh = new InteractiveMesh(this,true, this.onLoadBody);
        }
        else {
            this.m_bodyMesh.create(this, true,this.onLoadBody);
        }
        this.m_bodyMesh.setRotation(0, 0, 0);
        this.m_bodyMesh.setPosition(0, 0, 0);
        this.m_circleMesh = new AvatarMesh(this, false,this.onLoadCircle);
    }
    public onDestroy() {
        super.onDestroy();
        this.m_bodyMesh.destroy(false);
        this.m_circleMesh.destroy(false);
    }

    public onLoadBody() {
        this.m_bodyMesh.setParent(this.avatarRoot);
        this.updateAnimation();
        if (this.model) {
            this.updateNameboardPosition();
            this.m_bodyMesh.setClickAble(this.model.selectAble);
        }
    }

    updateNameboardPosition() {
        let v3 = G.cacheVec3;
        v3.Set(0, this.m_bodyMesh.boundHeightPixel / G.CameraSetting.xMeterScale, 0);
        this.model.topTitleContainer.containerRoot.offset = v3;
    }

    public showCircle(isShow: boolean) {
        if (isShow) {
            this.m_circleMesh.loadModel(UnitCtrlType.other, 'effect/other/bossCircle.prefab', false, false);
        }
        else {
            this.m_circleMesh.destroy();
        }
    }

    public onLoadCircle() {
        this.m_circleMesh.setParent(this.avatarRoot2);
    }

    //播放单位动画
    public updateAnimation() {
        if (this.model == null) {
            return;
        }
        let state: UnitState = this.model.state;
        let animName = this.model.unit.getAnimName(state);
        if (animName != null) {
            this.m_bodyMesh.playAnimation(animName,0.1);
        }
    }
    public setSortingOrder(order: number) {
        super.setSortingOrder(order);
        this.m_bodyMesh.setSortingOrder(order);
        this.m_circleMesh.setSortingOrder(order);
    }
    public setVisible(value: boolean) {
        if (this._visible != value) {
            this._visible = value;
            this.setBuffVisible(value);
            this.m_bodyMesh.setVisible(value);
            this.m_circleMesh.setVisible(value);
        }
    }
    public setClickAble(value: boolean) {
        this.m_bodyMesh.setClickAble(value);
    }
}
export default SimpleAvatar;