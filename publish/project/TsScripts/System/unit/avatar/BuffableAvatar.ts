import { Global as G } from 'System/global'
import { BaseAvatar } from 'System/unit/avatar/BaseAvatar'
import { BuffMesh } from 'System/unit/avatar/BuffMesh'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'

export abstract class BuffableAvatar extends BaseAvatar {

    private buffMeshes: BuffMesh[];

    public onCreate() {
    }

    addBuff(id: number, name: string, posType: number) {
        if (null == this.buffMeshes) {
            this.buffMeshes = [];
        }
        let index = this.getBuffMeshIndexById(id);
        if (index < 0) {
            let mesh = new BuffMesh(this,false, delegate(this, this.onLoadBuffMesh, id, posType));
            mesh.setVisible(this._visible);
            mesh.id = id;
            this.buffMeshes.push(mesh);
            mesh.loadModel(UnitCtrlType.buff, name, false, false);
        }
    }
    public onLoadBuffMesh(id: number, posType: number) {
        let index = this.getBuffMeshIndexById(id);
        if (index >= 0) {
            let mesh = this.buffMeshes[index];
            if (null != this.defaultAvatar) {
                if (posType == KeyWord.BUFF_BINDINGPOSITION_HEAD) {
                    mesh.setPosition(0, this.defaultAvatar.boundHeightPixel / G.CameraSetting.xMeterScale, 0);
                } else if (posType == KeyWord.BUFF_BINDINGPOSITION_CENTER) {
                    mesh.setPosition(0, this.defaultAvatar.boundHeightPixel / G.CameraSetting.yMeterScale, 0);
                }
                else{
                    mesh.setPosition(0, 0, 0);
                }
            }           
            mesh.setParent(this.avatarRoot);
        }
    }

    private getBuffMeshIndexById(id: number): number {
        let index = -1;
        if (null != this.buffMeshes) {
            let len = this.buffMeshes.length;
            for (let i = 0; i < len; i++) {
                let mesh = this.buffMeshes[i];
                if (mesh.id == id) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    removeBuff(id: number) {
        let index = this.getBuffMeshIndexById(id);
        if (index >= 0) {
            this.buffMeshes[index].destroy();
            this.buffMeshes.splice(index, 1);
        } 
    }

    public setSortingOrder(order: number) {
        if (null != this.buffMeshes) {
            for (let mesh of this.buffMeshes) {
                mesh.setSortingOrder(order);
            }
        }
    }

    public setRenderLayer(layer: number) {
        if (null != this.buffMeshes) {
            for (let mesh of this.buffMeshes) {
                mesh.setRenderLayer(layer);
            }
        }
    }

    protected setBuffVisible(value: boolean) {
        if (null != this.buffMeshes) {
            for (let mesh of this.buffMeshes) {
                mesh.setVisible(value);
            }
        }
    }

    public onDestroy() {
        if (null != this.buffMeshes) {
            for (let mesh of this.buffMeshes) {
                mesh.destroy(false);
            }
            this.buffMeshes = null;
        }
    }
}