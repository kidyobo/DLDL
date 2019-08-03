import { IPool, ObjectPool } from "Common/pool/ObjectPool";
import { Constants } from "System/constants/Constants";
import { FloatShowType } from "System/floatTip/FloatTip";
import { Global as G } from "System/global";
import { AvatarType } from "System/unit/avatar/AvatarType";
import { BaseAvatar } from "System/unit/avatar/BaseAvatar";
import { PetAvatar } from "System/unit/avatar/PetAvatar";
import { RoleAvatar } from "System/unit/avatar/RoleAvatar";
import { SimpleAvatar } from "System/unit/avatar/SimpleAvatar";
import { UnitAgent } from "System/unit/UnitAgent";
import { UnitState } from "System/unit/UnitState";
import { TopTitleContainer } from "System/unit/TopTitle/TopTitleContainer"

export class UnitModel implements IPool {
    public static pool = new ObjectPool(512);

    public avatar: BaseAvatar;
    public topTitleContainer: TopTitleContainer;

    public unit: UnitAgent;
    public gameObject: UnityEngine.GameObject;
    public transform: UnityEngine.Transform;
    public rotateGameObject: UnityEngine.GameObject;
    public rotateTransform: UnityEngine.Transform;
    private stateListener: Game.UnitStateListener;
    private _tweenPath: Tween.TweenPath;
    private shadowPerfab: UnityEngine.GameObject;
    private _visible: boolean = true;
    public get isVisible() {
        return this._visible && this.activeByAnim;
    }
    private _showShadow: boolean = false;
    private _shadowAffectByActive: boolean = true;
    private _activeShadow: boolean = false;
    public get isShadowVisible() {
        return this._activeShadow && this.activeByAnim;
    }
    /**单位当前状态*/
    private _state: UnitState = UnitState.Stand;
    public get state() {
        return this._state;
    }
    public get tweenPath() {
        return this._tweenPath;
    }
    private _selectAble: boolean = true;
    public set selectAble(value: boolean) {
        this._selectAble = value;
        this.avatar.setClickAble(value);
    }
    public get selectAble() {
        return this._selectAble;
    }
    private isUsingTerrainType: boolean = false;
    private isUsingTeleport: boolean = false;
    private isUsingSafty = false;

    private static count: number = 1;
    private avatarType: AvatarType;
    private _safty: boolean = false;
    public get safty() {
        return this._safty;
    }
    public tipWhenSaftyChange: boolean = false;
    private _scale: number = 1;
    public get scale() {
        return this._scale;
    }
    //缓存用的V2
    private _cacheVec2: UnityEngine.Vector2 = new UnityEngine.Vector2(0, 0);
    //缓存用的V3
    private _cacheVec3: UnityEngine.Vector3 = new UnityEngine.Vector3(0, 0, 0);
    private _cacheVec3ForV2: UnityEngine.Vector3 = new UnityEngine.Vector3(0, 0, 0);
    private activeByAnim: boolean = true;
    private nameborardActive: boolean = true;

    private isJumping: boolean = false;
    public onJumpOver: any = null;
    constructor() {
        this.gameObject = new UnityEngine.GameObject("unit" + (UnitModel.count++));
        this.transform = this.gameObject.transform;
        this.rotateGameObject = new UnityEngine.GameObject("model");
        this.rotateTransform = this.rotateGameObject.transform;
        this.rotateTransform.SetParent(this.transform, false);
        this.transform.SetParent(G.UnitMgr.transform, false);

        //加载人物模型
        this.shadowPerfab = G.MaterialMgr.getNewShadow(this.transform);
        this.stateListener = this.gameObject.AddComponent(Game.UnitStateListener.GetType()) as Game.UnitStateListener;
        this.stateListener.SetTileMap(G.Mapmgr.tileMap);
        this._tweenPath = this.gameObject.AddComponent(Tween.TweenPath.GetType()) as Tween.TweenPath;
        this._tweenPath.enabled = false;
        this._tweenPath.jumpHeightCurve = G.getCurve("jumpHeight");
        this._tweenPath.jumpMoveCurve = G.getCurve("jumpMove");
        this._tweenPath.onFinished = delegate(this, this.onTweenPathFinished);
        this.gameObject.SetActive(false);

        this.topTitleContainer = new TopTitleContainer(this.rotateTransform);
        this.topTitleContainer.setActive(false);
    }
    private onChangeTerrainType(terrainType: number) {
        }
    private onCheckTeleport(tpId: number) {
        // 检查是否踩在传送点上
        if (tpId > 0) {
            G.ModuleMgr.SceneModule.processTransport(tpId);
        }
    }
    private onSaftyChanged(safty: boolean) {
        this._safty = safty;
        if (this.tipWhenSaftyChange) {
            // 进出安全区
            G.TipMgr.addMainFloatTip('', safty ? FloatShowType.EnterSafeZone : FloatShowType.LeaveSafeZone, 0);
        }
    }
    private onTweenPathFinished() {
        if (this.isJumping) {
            if (this.onJumpOver) {
                this.onJumpOver();
            }
        }
        else {
            this.onMoveToEnd(false);
        }
    }
    private onMoveToEnd(byStop: boolean) {
        if (this._state != UnitState.Dead) {
            this.changeState(UnitState.Stand);
        }
        this.unit.onMoveEnd(byStop);
    };

    //初始化模型
    public initAvatar(unit: UnitAgent, avatarType: AvatarType) {
        if (this.unit != null) {
            return;
        }
        this.gameObject.SetActive(true);
        this.avatarType = avatarType;
        switch (avatarType) {
            case AvatarType.Simple:
                let simpleAvatar = SimpleAvatar.pool.pop() as SimpleAvatar;
                if (simpleAvatar == null) {
                    simpleAvatar = new SimpleAvatar(this.rotateTransform, this.transform, this);
                }
                else {
                    simpleAvatar.create(this.rotateTransform, this.transform, this);
                }
                this.avatar = simpleAvatar;
                break;
            case AvatarType.Role:
                let avatar = new RoleAvatar(this.rotateTransform, this.transform, this);
                avatar.hasRide = true;
                avatar.hasWing = true;
                this.avatar = avatar;
                break;
            case AvatarType.Pet:
                this.avatar = new PetAvatar(this.rotateTransform, this.transform, this);
                break;
        }
        this.unit = unit;
        this.setActiveByAnim(G.UnitMgr.isActive);
    }
    //
    public moveNoAction(path: UnityEngine.Vector3[], speed: number) {
        if (null == path || 0 == path.length) {
            return;
        }
        Tween.TweenPath.Begin(this.gameObject, null, speed, path, 0, 0, 0);
    }
    //单位按制定路径开始移动
    public moveTo(path: UnityEngine.Vector3[], speed: number, rotate: boolean = true) {
        if (null == path || 0 == path.length) {
            return;
        }
        Tween.TweenPath.Begin(this.gameObject, rotate ? this.rotateGameObject : null, speed, path, 0, 0, Constants.ApproachMax / G.CameraSetting.xMeterScale);
        this.changeState(UnitState.Move);
    }
    public setMoveSpeed(speed: number) {
        if (this._tweenPath != null) {
            this._tweenPath.Speed = speed;
        }
    }
    public jumpTo(jumpSpeed: number, jumpPath: UnityEngine.Vector3[], jumpHeightWorld: number, jumpPrepareTime: number) {
        this.isJumping = true;
        Tween.TweenPath.Begin(this.gameObject, this.rotateGameObject, jumpSpeed, jumpPath, jumpHeightWorld, jumpPrepareTime, 8);
    }
    //设置模型到指定位置
    public setPosition(x: number, y: number, z: number) {
        Game.ThreeDTools.PutOnNavMesh(this.transform, x, y, z);
    }
    //设置模型到指定位置
    public setPositionV3(v3: UnityEngine.Vector3) {
        Game.ThreeDTools.PutOnNavMesh(this.transform, v3);
    }
    //设置模型到指定位置
    public setPixelPosition(x: number, y: number) {
        Game.ThreeDTools.PutOnNavMesh(this.transform, G.serverPixelXToLocalPositionX(x), 0, G.serverPixelYToLocalPositionY(y));
    }
    public getPosition(): UnityEngine.Vector3 {
        Game.Tools.GetPosition(this.transform, this._cacheVec3);
        return this._cacheVec3;
    }
    public getPixelPosition(): UnityEngine.Vector2 {
        let v3 = this._cacheVec3ForV2;
        Game.Tools.GetPosition(this.transform, v3);
        this._cacheVec2.Set(G.localPositionXToServerPixelX(v3.x), G.localPositionYToServerPixelY(v3.z));
        return this._cacheVec2;
    }

    public lookAt(target: UnityEngine.Vector3) {
        if (target != null) {
            this.rotateTransform.LookAt(target);
        }
    }

    public rotateTo(x: number, y: number, z: number) {
        let v = this._cacheVec3ForV2;
        v.Set(x, y, z);
        Game.Tools.SetLocalRotation(this.rotateTransform, v);
    }
    public getDirection() {
        let v3 = G.cacheVec3;
        Game.Tools.GetForward(this.rotateTransform, v3);
        return v3;
    }
    public stopMove() {
        if (this.state == UnitState.Move) {
            if (this._tweenPath != null) {
                this._tweenPath.enabled = false;
            }
            this.onMoveToEnd(true);
        }
    }
    public stopJump() {
        this.isJumping = false;
        if (this._tweenPath != null) {
            this._tweenPath.enabled = false;
        }
    }
    public destroy() {
        if (this.unit == null) {
            return;
        }
        if (this._tweenPath != null) {
            this._tweenPath.enabled = false;
        }
        this.useTeleport(false);
        this.useTerrainType(false);
        this.setShadowActive(false);
        this.avatar.destroy();
        this.topTitleContainer.destroy();
        this.topTitleContainer.containerRoot.offset = G.getCacheV3(0, 1.6, 0);
        this.unit = null;
        this._safty = false;
        this.isJumping = false;
        switch (this.avatarType) {
            case AvatarType.Simple:
                SimpleAvatar.pool.push(this.avatar);
                break;
        }
        this.avatar = null;
        this._state = UnitState.Stand;
        this.gameObject.SetActive(false);
        this.setScale(1);
        //立即将该对象插入缓存
        UnitModel.pool.push(this);
    }

    public onDestroy() {
        UnityEngine.GameObject.Destroy(this.gameObject);
        this.gameObject = null;
        this.transform = null;
        this.rotateGameObject = null;
        this.rotateTransform = null;
        UnityEngine.GameObject.Destroy(this.stateListener);
        this.stateListener = null;
        UnityEngine.GameObject.Destroy(this._tweenPath);
        this._tweenPath = null;
        this.topTitleContainer.destroy(false);
        this.topTitleContainer = null;
        this.onJumpOver = null;
        let reportStr = "";
        {
            let hero = G.UnitMgr.hero;
            let runtime = G.DataMgr.runtime;
            reportStr = uts.format('{0}\n当前场景:{1}，副本:{2}，坐标:{3}\nHero:{4}\n状态:runtime={5}\n引导：{6}\n挂机：{7}\n单位：{8}',
                G.SyncTime.toString(),
                G.DataMgr.sceneData.curSceneID, G.DataMgr.sceneData.curPinstanceID,
                G.UnitMgr.hero.getPixelPosition().ToString(), hero.toString(), runtime.toString(),
                G.GuideMgr.toString(), G.BattleHelper.toString(), G.UnitMgr.toString());
            let count1 = 0;
            let count2 = 0;
            for (let a in G.UnitMgr.AllNPC) {
                count1++;
            }
            for (let a in G.UnitMgr.AllUnits) {
                count2++;
            }
            reportStr += uts.format("npc count:" + count1 + " unit count:" + count2);
        }
        uts.logErrorReport("单位超过512限制:" + reportStr);
    }

    public showShadow(value: boolean, showShadowEffect: boolean) {
        this._showShadow = value;
        this._shadowAffectByActive = showShadowEffect;
    }

    public setShadowActive(value: boolean) {
        if (this._activeShadow != value) {
            this._activeShadow = value;
            this.shadowPerfab.SetActive(value);
        }
    }
    public setVisible(value: boolean, nameborardActive: boolean) {
        this._visible = value;
        this.nameborardActive = nameborardActive;
        this.avatar.setVisible(this.activeByAnim && value);
        this.topTitleContainer.setActive(this.activeByAnim && nameborardActive);
        this.setShadowActive(this.activeByAnim && this._showShadow && (!this._shadowAffectByActive || this._shadowAffectByActive && nameborardActive));
    }
    public changeState(newState: UnitState, ignoreSame: boolean = false) {
        let oldState = this._state;
        this._state = newState;
        if (ignoreSame || oldState != newState) {
            //这里停下移动，使用特殊方式
            if (oldState == UnitState.Move) {
                if (this._tweenPath != null) {
                    this._tweenPath.enabled = false;
                }
            }

            this.avatar.updateAnimation();
        }
    }
    public changeStateWithoutAnim(newState: UnitState) {
        this._state = newState;
    }
    public useTerrainType(value: boolean) {
        if (this.isUsingTerrainType != value) {
            this.isUsingTerrainType = value;
            if (value) {
                this.stateListener.BindTerrainTypeChangeAction(delegate(this, this.onChangeTerrainType));
            }
            else {
                this.stateListener.BindTerrainTypeChangeAction(null);
            }
        }
    }
    public useTeleport(value: boolean) {
        if (this.isUsingTeleport != value) {
            this.isUsingTeleport = value;
            if (value) {
                this.stateListener.BindCheckTeleportAction(delegate(this, this.onCheckTeleport));
            }
            else {
                this.stateListener.BindCheckTeleportAction(null);
            }
        }
    }

    public useSafty(value: boolean) {
        if (this.isUsingSafty != value) {
            this.isUsingSafty = value;
            if (value) {
                this.stateListener.BindSaftyChangeAction(delegate(this, this.onSaftyChanged));
            }
            else {
                this.stateListener.BindSaftyChangeAction(null);
            }
        }
    }
    public setScale(scale: number) {
        if (this._scale != scale) {
            this._scale = scale;
            Game.Tools.SetGameObjectLocalScale(this.gameObject, scale, scale, scale);
            if (this.avatar && this.avatar.defaultAvatar.model) {
                this.avatar.defaultAvatar.model.calcBounds(scale);
                this.avatar.updateNameboardPosition();
        }
    }
        }

    public setActiveByAnim(value: boolean) {
        if (this.activeByAnim != value) {
            this.activeByAnim = value;
            this.setVisible(this._visible, this.nameborardActive)
        }
    }
}