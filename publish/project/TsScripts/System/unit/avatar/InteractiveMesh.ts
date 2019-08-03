import { AvatarMesh } from "System/unit/avatar/AvatarMesh"
import { CachingModel } from "System/CachingSystem"
import { Global as G } from 'System/global'
export class InteractiveMesh extends AvatarMesh {
    protected onLoadModel(model: CachingModel) {
        if (this.avatar.model != null) {
            (model.gameObject as any).userdata = this.avatar.model.unit;
        }
    }
    protected onDestroyModel(model: CachingModel) {
        if (this.avatar.model != null) {
            (model.gameObject as any).userdata = null;
        }
    }
}
export default InteractiveMesh;