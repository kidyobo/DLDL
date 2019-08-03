/// <reference path="avatar/AvatarMesh.ts" />
import { Global as G } from "System/global";
import { UnitData } from "System/data/RoleData";
import { UnitUtil } from 'System/utils/UnitUtil'
import { Constants } from 'System/constants/Constants'
import { Macros } from 'System/protocol/Macros'
import { UnitCtrlType, EnumDir2D, EnumBuff } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { GateInfo } from 'System/data/scene/GateInfo'
import { UnitStatus } from 'System/utils/UnitStatus'
import { BuffData } from 'System/data/BuffData'
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { RoleBuffProxy } from 'System/buff/RoleBuffProxy'
import { UnitAgent } from "System/unit/UnitAgent"
/**角色控制器，用于控制所有单位*/
export abstract class UnitController implements UnitAgent {
    protected data: UnitData;
    public get Data() {
        return this.data;
    }
    private _model: UnitModel;
    public get model(): UnitModel {
        return this._model;
    }

    protected dir2D: EnumDir2D;

    /**服务器通知的移动类型*/
    protected m_moveType: number = 0;

    /**单位当前状态*/
    public get state() {
        if (null == this._model) {
            return UnitState.None;
        }
        return this._model.state;
    }
    public buffProxy: RoleBuffProxy;
    protected isDestroyInvoking = false;

    constructor(data: UnitData) {
        this.data = data;
        // buff代理
        this.buffProxy = new RoleBuffProxy(this);
        //创建模型
        this._model = UnitModel.pool.pop() as UnitModel;
        if (this._model == null) {
            this._model = new UnitModel();
        }
        this.model.showShadow(true, false);
        this._model.setPosition(G.serverPixelXToLocalPositionX(this.data.x), 0, G.serverPixelYToLocalPositionY(this.data.y));
        this.Dir2D = this.data.direction;
    }

    onUpdateTimer(now: number) {
        let delCnt = this.buffProxy.run();
        if (delCnt > 0) {
            this.buffProxy.checkSomeBuff();
            G.ViewCacher.mainView.onUnitBuffChanged(this);
        }
    }

    //单位按制定路径开始移动
    public beginMoveWorld(path: UnityEngine.Vector3[]) {
        if (this._model == null) {
            uts.assert(false, "UnitController::beginMoveWorld - 请不要对已经删除的单位进行操作");
            return;
        }
        if (null == path || 0 == path.length) {
            return;
        }
        this._model.moveTo(path, this.getSpeed(), this.m_moveType == Macros.MOVE_MODE_NONE);
    };
    public simpleMove(path: UnityEngine.Vector3[]) {
        if (this._model == null) {
            uts.assert(false, "UnitController::beginMoveWorld - 请不要对已经删除的单位进行操作");
            return;
        }
        if (null == path || 0 == path.length) {
            return;
        }
        this._model.moveNoAction(path, this.getSpeed());
    };
    //单位按制定路径开始移动
    public beginMovePixel(path: UnityEngine.Vector2[]) {
        if (this._model == null) {
            uts.assert(false, "UnitController::beginMovePixel - 请不要对已经删除的单位进行操作");
            return;
        }
        let pathLength: number = Game.ArrayHelper.GetArrayLength(path);
        let pathNodeByPixel: UnityEngine.Vector2;
        if (path != null && pathLength > 0) {
            let pathList: UnityEngine.Vector3[] = [];
            for (let i = 0; i < pathLength; i++) {
                pathNodeByPixel = Game.ArrayHelper.GetArrayValue(path, i) as UnityEngine.Vector2;
                pathList.push(G.serverPixelToLocalPosition(pathNodeByPixel.x, pathNodeByPixel.y));
            }
            this.beginMoveWorld(pathList);
        }
    }
    /**
     * 停止一个单位的移动
     */
    stopMove() {
        if (this._model == null) {
            uts.assert(false, "UnitController::stopMove - 请不要对已经删除的单位进行操作");
            return;
        }
        this._model.stopMove();
    }

    //设置单位到指定位置
    public setWorldPosition(x: number, y: number, z: number) {
        if (this._model == null) {
            uts.assert(false, "UnitController::setWorldPosition - 请不要对已经删除的单位进行操作");
            return;
        }
        this._model.stopMove();
        this._model.setPosition(x, y, z);
    };
    //设置单位到指定位置
    public setWorldPositionV3(v3: UnityEngine.Vector3) {
        if (this._model == null) {
            uts.assert(false, "UnitController::setWorldPositionV3 - 请不要对已经删除的单位进行操作");
            return;
        }
        this._model.stopMove();
        this._model.setPositionV3(v3);
    };
    //设置单位到指定位置
    public setPixelPosition(x: number, y: number, moveType: number = 0) {
        if (this._model == null) {
            uts.assert(false, "UnitController::setPixelPosition - 请不要对已经删除的单位进行操作");
            return;
        }
        this.m_moveType = moveType;
        this._model.stopMove();
        this._model.setPixelPosition(x, y);
    }
    public setMoveType(moveType: number = 0) {
        if (this._model == null) {
            uts.assert(false, "UnitController::setMoveType - 请不要对已经删除的单位进行操作");
            return;
        }
        this.m_moveType = moveType;
    }

    //获取单位世界坐标
    public getWorldPosition(): UnityEngine.Vector3 {
        if (this._model == null) {
            uts.assert(false, "UnitController::getWorldPosition - 请不要对已经删除的单位进行操作");
            return null;
        }
        return this._model.getPosition();
    }
    //获取单位像素坐标
    public getPixelPosition(): UnityEngine.Vector2 {
        if (this._model == null) {
            uts.assert(false, "UnitController::getPixelPosition - 请不要对已经删除的单位进行操作");
            return null;
        }
        return this._model.getPixelPosition();
    }

    public destroy(deleteUnit: boolean, delay: number = 0) {
        if (this._model == null) {
            uts.assert(false, "UnitController::destroy - 请不要对已经删除的单位进行操作");
            return null;
        }
        if (delay == 0) {
            this.lateDestroy(deleteUnit);
        }
        else {
            this.isDestroyInvoking = true;
            Game.Invoker.BeginInvoke(this._model.gameObject, "latePush", delay, delegate(this, this.lateDestroy, deleteUnit, true));
        }
    }
    private lateDestroy(deleteUnit: boolean,callByInvoke=false) {
        if (this._model == null) {
            //这里不做限制，单位死亡后切换场景就会出现
            return null;
        }
        //G.UnitMgr.cancelControlUnit(this);

        if (!callByInvoke) {
            if (this.isDestroyInvoking) {
                Game.Invoker.EndInvoke(this.model.gameObject, "latePush");
            }
        }
        this.isDestroyInvoking = false;

        this.buffProxy.destroy();
        this.onDestroy();

        this._model.destroy();
        this._model = null;

        if (deleteUnit) {
            G.UnitMgr.deleteUnit(this);
        }
    }
    equal(other: UnitController): boolean {
        if (this._model == null) {
            uts.assert(false, "UnitController::equal - 请不要对已经删除的单位进行操作");
            return null;
        }
        return this == other;
    }
    public reborn() {
        if (this._model == null) {
            uts.assert(false, "UnitController::reborn - 请不要对已经删除的单位进行操作");
            return null;
        }
        this.changeAction(UnitState.Stand);
    }
    public changeAction(newState: UnitState, direction: EnumDir2D = -1) {
        if (this._model == null) {
            uts.assert(false, "UnitController::changeAction - 请不要对已经删除的单位进行操作");
            return null;
        }
        this._model.changeState(newState, true);
        if (direction >= 0) {
            this.Dir2D = direction;
        }
    }
    public forceStand(direction: EnumDir2D = -1) {
        if (this._model == null) {
            uts.assert(false, "UnitController::forceStand - 请不要对已经删除的单位进行操作");
            return null;
        }
        this._model.changeState(UnitState.Stand, true);
        if (direction >= 0) {
            //3d不能使用这个方向，偏差很大
            this.Dir2D = direction;
        }
    }
    public set Dir2D(dir2D: EnumDir2D) {
        if (this._model == null) {
            uts.assert(false, "UnitController::Dir2D - 请不要对已经删除的单位进行操作");
            return;
        }
        this.dir2D = dir2D;
        this._model.rotateTo(0, UnitUtil.dir2Dto3D(dir2D), 0);
    }
    public get Dir2D(): EnumDir2D {
        if (this._model == null) {
            uts.assert(false, "UnitController::Dir2D - 请不要对已经删除的单位进行操作");
            return null;
        }
        return this.dir2D;
    }
    public setDirection(dir3D: number) {
        if (this._model == null) {
            uts.assert(false, "UnitController::setDirection - 请不要对已经删除的单位进行操作");
            return null;
        }
        this._model.rotateTo(0, dir3D, 0);
    }
    public getDirection() {
        if (this._model == null) {
            uts.assert(false, "UnitController::getDirection - 请不要对已经删除的单位进行操作");
            return null;
        }
        return this._model.getDirection();
    }
    public get isMoving(): boolean {
        if (this._model == null) {
            uts.assert(false, "UnitController::isMoving - 请不要对已经删除的单位进行操作");
            return null;
        }
        return this._model.state == UnitState.Move;
    }
    public get isStanding(): boolean {
        if (this._model == null) {
            uts.assert(false, "UnitController::isStanding - 请不要对已经删除的单位进行操作");
            return null;
        }
        return UnitState.Stand == this._model.state;
    }
    public getSpeed(): number {
        if (this._model == null) {
            uts.assert(false, "UnitController::getSpeed - 请不要对已经删除的单位进行操作");
            return null;
        }

        if (this.m_moveType == Macros.MOVE_MODE_PULL) {
            return 0.05; // 拉怪的速度
        }
        else if (this.m_moveType == Macros.MOVE_MODE_PUSH_SHOCK) {
            return 0.1; // 震退的速度
        }
        else if (this.m_moveType == Macros.MOVE_MODE_DATI) {
            return 0.1;
        }
        return 1 / G.serverPixelUnitToLocalPositionUnit(this.Data.getProperty(Macros.EUAI_SPEED));
    }
    public onUACChange(uac: Protocol.UnitAttributeChanged) {
        if (this._model == null) {
            uts.assert(false, "UnitController::onUACChange - 请不要对已经删除的单位进行操作");
            return null;
        }
        if (0 != (uac.m_uiMask & (1 << Macros.EUAI_SPEED))) {
            this._model.setMoveSpeed(this.getSpeed());
        }
    }

    public getSex(): boolean {
        return this.data.gender == KeyWord.GENDERTYPE_BOY;
    }
    public getName(): string {
        let data = this.data;
        return UnitCtrlType[data.unitType] + '_' + data.id + '_' + data.unitID;
    }
    public onLoadModel() {
    }
    /**
     * 通过buff进行变身。
     * @param buffCfg
     */
    public changeAvatarByBuff(buffCfg: GameConfig.BuffConfigM) {
    }
    /**
     * 取消变身。
     */
    public cancelChangeAvatar() {
    }

    public updateUnitAvatar(type: number, id: number) {

    }
    public abstract onLoad();
    public abstract onDestroy();
    public abstract onMoveEnd(byStop: boolean);
    public abstract onHit();
    public abstract onUpdateNameboard(name: string);
    public abstract onAddBuff(buffInfo: Protocol.BuffInfo);
    public abstract onDeleteBuff(buffId: number);
    public abstract getAnimName(state: UnitState): string;
    public abstract onUpdateVisible();

    toString(): string {
        let data = this.data;
        return uts.format('[Unit]type={0}, id={1}, unitID={2}, unitStatus={3}', data.unitType, data.id, data.unitID, data.unitStatus);
    }
}
export default UnitController;