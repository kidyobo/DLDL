import { AvatarMesh } from "System/unit/avatar/AvatarMesh"
import { UnitState } from "System/unit/UnitState"
import { BaseAvatar } from "System/unit/avatar/BaseAvatar"
import { Global as G } from 'System/global'
import { InteractiveMesh } from "System/unit/avatar/InteractiveMesh"
import { UnitCtrlType } from 'System/constants/GameEnum'
export class PetAvatar extends BaseAvatar {
    m_bodyMesh: AvatarMesh;

    /**宝物*/
    //m_shengQiMesh: AvatarMesh;

    /**圣印*/
    m_zhenfaMesh: AvatarMesh;

    public onLoadBodyCallbackOnce: () => void;

    public get defaultAvatar(): AvatarMesh {
        return this.m_bodyMesh;
    }
    public onCreate() {
        this.m_bodyMesh = new InteractiveMesh(this,true, this.onLoadBody);
        //this.m_shengQiMesh = new AvatarMesh(this, this.onLoadShengQi);
        this.m_zhenfaMesh = new AvatarMesh(this,false, this.onLoadZhenfa);
    }
    public onDestroy() {
        //this.m_shengQiMesh.destroy(false);
        this.m_bodyMesh.destroy(false);
        this.m_zhenfaMesh.destroy(false);
        if (this.onLoadBodyCallbackOnce) {
            this.onLoadBodyCallbackOnce = null;
        }
    }

    public onLoadBody() {
        //检查宝物是否已经加载
        this.onLoadShengQi();
        this.m_bodyMesh.setParent(this.avatarRoot);
        this.updateAnimation();
        if (this.model) {
            this.updateNameboardPosition();
            this.m_bodyMesh.setClickAble(this.model.selectAble);
        }
        if (this.onLoadBodyCallbackOnce) {
            let c = this.onLoadBodyCallbackOnce;
            this.onLoadBodyCallbackOnce = null;
            c();
        }
    }
    public onLoadZhenfa() {
        this.m_zhenfaMesh.setParent(this.avatarRoot2);
    }
    updateNameboardPosition() {
        let v3 = G.cacheVec3;
        v3.Set(0, this.m_bodyMesh.boundHeightPixel / G.CameraSetting.xMeterScale, 0);
        this.model.topTitleContainer.containerRoot.offset = v3;
    }

    public onLoadShengQi() {
        //if (this.m_shengQiMesh.model != null) {
        //    if (this.m_bodyMesh.model != null) {
        //        let parent = this.m_bodyMesh.model.createChildTransform(null, true, 0, 0, 0, 0, 2, 0);
        //        this.m_shengQiMesh.setParent(parent);
        //    }
        //}
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
        this.m_bodyMesh.setSortingOrder(order);
        //this.m_shengQiMesh.setSortingOrder(order);
    }
    public setRenderLayer(layer: number) {
        this.m_bodyMesh.setRenderLayer(layer);
       // this.m_shengQiMesh.setRenderLayer(layer);
    }
    public setVisible(value: boolean) {
        if (this._visible != value) {
            this._visible = value;
           // this.m_shengQiMesh.setVisible(value);
            this.m_bodyMesh.setVisible(value);
            this.m_zhenfaMesh.setVisible(value);
        }
    }
    public setClickAble(value: boolean) {
        this.m_bodyMesh.setClickAble(value);
    }
    updateShengQiModel(modelId: number) {
        //if (modelId > 0) {
        //    this.m_shengQiMesh.loadModel(UnitCtrlType.shengqi, modelId.toString(), false, false);
        //}
        //else {
        //    this.m_shengQiMesh.destroy();
        //}
    }
    updateZhenFaModel(zhenfaImageID: number) {
        if (zhenfaImageID > 0) {
            this.m_zhenfaMesh.loadModel(UnitCtrlType.zhenfa, zhenfaImageID.toString(), false, false);
        }
        else {
            this.m_zhenfaMesh.destroy();
        }
    }
}
export default PetAvatar;