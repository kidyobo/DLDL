import { AvatarMesh } from "System/unit/avatar/AvatarMesh"
import { RoleAvatar } from 'System/unit/avatar/RoleAvatar'
import { CachingModel } from "System/CachingSystem"
export class MountMesh extends AvatarMesh {
    protected onLoadModel(model: CachingModel) {
    }
    protected onDestroyModel(model: CachingModel) {
        this.avatar.updateNameboardPosition();
    }
    easeOut() {
        let avatar = this.avatar as RoleAvatar;
        if (avatar.m_bodyMesh.model) {
            avatar.m_bodyMesh.setParent(avatar.avatarRoot);
        }
        this.destroy();
    }
}
export default MountMesh;