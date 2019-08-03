import { Global as G } from 'System/global'
import { ThingData } from "System/data/thing/ThingData"
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { AvatarMesh } from "System/unit/avatar/AvatarMesh"
import { MountMesh } from "System/unit/avatar/MountMesh"
import { InteractiveMesh } from "System/unit/avatar/InteractiveMesh"
import { UnitUtil } from 'System/utils/UnitUtil'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { UnitState } from "System/unit/UnitState"
import { BuffableAvatar } from "System/unit/avatar/BuffableAvatar"
import { EquipUtils } from 'System/utils/EquipUtils'
import { GameIDUtil } from 'System/utils/GameIDUtil'
export class UIRoleAvatar extends BuffableAvatar {
    public get defaultAvatar(): AvatarMesh {
        return this.m_bodyMesh;
    }
    public hasRide = false;
    public hasWing = false;
    /**检查是否激活，灰态，没激活 原id*10 */
    public checkActive: boolean = false;
    /**
 * 性别
 */
    protected m_gender: number;
    /**
     * 职业
     */
    protected m_profession: number;
    /**模型*/
    m_bodyMesh: AvatarMesh;
    /**翅膀*/
    m_wingMesh: AvatarMesh;
    /**武器*/
    m_weaponMesh1: AvatarMesh;
    /**武器2*/
    m_weaponMesh2: AvatarMesh;
    /**环绕主角的武魂*/
    m_wuHuanAroundMesh1: AvatarMesh;
    /**坐骑*/
    m_mountMesh: MountMesh;

    /**转生*/
    m_rebirthMesh: AvatarMesh;

    private avataList: Protocol.AvatarList = null;
    private doubleHand: boolean = false;
    /**
     * 是否骑乘中
     */
    protected m_isRiding: boolean = false;
    public get isRiding() {
        return this.m_isRiding;
    }
    /**单位当前状态*/
    private _state: UnitState = UnitState.Stand;
    public get state() {
        return this._state;
    }
    constructor(root: UnityEngine.Transform, root2: UnityEngine.Transform) {
        super(root, root2, null);
    }
    public onCreate() {
        this.m_bodyMesh = new InteractiveMesh(this, false, this.onLoadBody);
        this.m_weaponMesh1 = new AvatarMesh(this, false, this.onLoadWeapon1);
        this.m_weaponMesh2 = new AvatarMesh(this, false, this.onLoadWeapon2);
        this.m_wuHuanAroundMesh1 = new AvatarMesh(this, false, this.onLoadWuHunAround);
        this.m_mountMesh = new MountMesh(this, false, this.onLoadMount);
        this.m_wingMesh = new AvatarMesh(this, false, this.onLoadWing);
        this.m_rebirthMesh = new AvatarMesh(this, false, this.onLoadRebirth);
        this.m_weaponMesh1.setRotation(0, 0, 0);
        this.m_weaponMesh2.setRotation(0, 0, 0);
        this.m_wuHuanAroundMesh1.setRotation(0, 0, 0);
        this.m_weaponMesh1.fordisplay = true;
        this.m_weaponMesh2.fordisplay = true;
        //this.m_wuHuanAroundMesh1.setRenderLayer(5);
        this.m_wuHuanAroundMesh1.fordisplay = true;
        this.m_wingMesh.fordisplay = true;
        this.m_rebirthMesh.fordisplay = true;
    }
    public onDestroy() {
        super.onDestroy();
        this.m_weaponMesh1.destroy(false);
        this.m_weaponMesh2.destroy(false);
        this.m_wuHuanAroundMesh1.destroy(false);
        this.m_wingMesh.destroy(false);
        this.m_rebirthMesh.destroy(false);
        this.m_bodyMesh.destroy(false);
        this.m_mountMesh.destroy(false);
        this.avataList = null;
    }
    public changeState(newState: UnitState, ignoreSame: boolean = false) {
        let oldState = this._state;
        this._state = newState;
        if (ignoreSame || oldState != newState) {
            this.updateAnimation();
        }
    }
    public onLoadBody() {
        if (this.m_bodyMesh.model == null) {
            return;
        }
      
        if (this.isRiding && this.m_mountMesh.model != null) {
            //骑乘状态魂环消失
            // this.setHunHuanStatus(false);
            let parent = this.m_mountMesh.model.createChildTransform("ride", true, 0, -90, 180);
            this.m_bodyMesh.setParent(parent);
        }
        else {
            this.m_bodyMesh.setParent(this.avatarRoot);
            // this.setHunHuanStatus(true);
        }

        if (this.doubleHand) {
            this.onLoadWeapon2();
        }
          //检查武器翅膀圣印是否已经加载
        this.onLoadWing();
        this.onLoadWuHunAround();
        // this.m_bodyMesh.setParent(this.avatarRoot);
        this.updateAnimation();
        this.onLoadWeapon1();
        // if (this.model != null) {
        //     this.updateNameboardPosition();
        //     this.m_bodyMesh.setClickAble(this.model.selectAble);
        // }
    }
    public onLoadWeapon1() {
        let tName = this.doubleHand ? "weapon_l" : "weapon";
        if (this.m_weaponMesh1.model != null) {
            if (this.m_bodyMesh.model != null) {
                let parent = this.m_bodyMesh.model.createChildTransform(tName, false, 0, 0, 0);
                //if (this.doubleHand) this.m_weaponMesh1.setRotation(180,90,-90);
                this.m_weaponMesh1.setParent(parent);
            }
        }
    }

    public onLoadWeapon2() {
        if (this.m_weaponMesh2.model != null) {
            if (this.m_bodyMesh.model != null) {
                let parent = this.m_bodyMesh.model.createChildTransform("weapon_r", false, 0, 0, 0);
                //this.m_weaponMesh2.setRotation(180, 90, -90);
                this.m_weaponMesh2.setParent(parent);
            }
        }
    }

    public onLoadWuHunAround() {
        if (this.m_wuHuanAroundMesh1.model != null) {
            if (this.m_bodyMesh.model != null) {
                let parent = this.m_bodyMesh.model.createChildTransform("wuhun", false, 0, 0, 0);
                this.m_wuHuanAroundMesh1.setParent(parent);
                //this.m_bodyMesh.model.animator.Rebind();
                //this.updateAnimation();
            }
        }
    }

    public onLoadWing() {
        if (this.hasWing && this.m_wingMesh.model != null) {
            if (this.m_bodyMesh.model != null) {
                let parent = this.m_bodyMesh.model.createChildTransform('wing', true, 270, -90, 180);
                this.m_wingMesh.setParent(parent);
            }
        }
    }
    public onLoadMount() {
        this.m_mountMesh.setParent(this.avatarRoot);
        this.onLoadBody();
    }
    public onLoadRebirth() {
        this.m_rebirthMesh.setParent(this.avatarRoot2);
    }
    updateNameboardPosition() {
    }

    private hasWuHunModel: boolean = false;
    private playWuHunAnimation(name: string, fadeTime: number = 0): void {
        if (this.hasWuHunModel)
            this.m_wuHuanAroundMesh1.playAnimation(name, fadeTime);
    }
    //播放单位动画
    public updateAnimation() {
        // if (this.model == null) {
        //     return;
        // }
        if (!this.hasWuHunModel && this.m_wuHuanAroundMesh1.model != null) this.hasWuHunModel = true;
        let state: UnitState = this.state;
        switch (state) {
            case UnitState.Enter:
                this.m_bodyMesh.playAnimation('enter');
                this.playWuHunAnimation('enter');
                break;
            case UnitState.Stand:
                if (this.m_isRiding) {
                    if (this.m_mountMesh.model != null) {
                        this.m_bodyMesh.playAnimation('stand_ride', 0.1);
                        this.playWuHunAnimation('stand_ride', 0.1);
                    }
                    else {
                        this.m_bodyMesh.playAnimation('stand', 0.1);
                        this.playWuHunAnimation('stand', 0.1);
                    }
                    this.m_mountMesh.playAnimation("stand", 0.3);
                }
                else {
                    if (this.m_mountMesh.model != null) {
                        this.m_bodyMesh.playAnimation('stand', 0.1);
                        this.playWuHunAnimation('stand', 0.1);
                    } else {
                        this.m_bodyMesh.playAnimation('stand', 0.1);
                        this.playWuHunAnimation('stand', 0.1);
                    }
                }
                break;
            case UnitState.Move:
                this.m_bodyMesh.playAnimation('move', 0.1);
                this.playWuHunAnimation('move', 0.1);
                break;
            case UnitState.Dead:
                this.m_bodyMesh.playAnimation("dead");
                this.playWuHunAnimation("dead");
                break;
        }
    }

    public setSortingOrder(order: number) {
        super.setSortingOrder(order);
        this.m_bodyMesh.setSortingOrder(order);
        this.m_weaponMesh1.setSortingOrder(order);
        this.m_weaponMesh2.setSortingOrder(order);
        this.m_wuHuanAroundMesh1.setSortingOrder(order);
        this.m_wingMesh.setSortingOrder(order);
        this.m_mountMesh.setSortingOrder(order);
        this.m_rebirthMesh.setSortingOrder(order);
    }
    public setRenderLayer(layer: number) {
        super.setRenderLayer(layer);
        this.m_bodyMesh.setRenderLayer(layer);
        this.m_weaponMesh1.setRenderLayer(layer);
        this.m_weaponMesh2.setRenderLayer(layer);
        this.m_wuHuanAroundMesh1.setRenderLayer(layer);
        this.m_wingMesh.setRenderLayer(layer);
        this.m_mountMesh.setRenderLayer(layer);
        this.m_rebirthMesh.setRenderLayer(layer);
    }
    public setLight(value: number) {
    }
    public setLightColor(enabled: boolean, r: number, g: number, b: number, a: number) {
    }
    public setActive(value: boolean) {
        this.avatarRoot.gameObject.SetActive(value);
    }
    public setVisible(value: boolean) {
    }
    public setClickAble(value: boolean) {
        this.m_bodyMesh.setClickAble(value);
    }
    private updateMountModel(mountImageID: number) {
        if (mountImageID > 0) {
            // if (this.model.state == UnitState.Fight) {
            //     this.model.changeStateWithoutAnim(UnitState.Stand);
            // }
            this.m_isRiding = true;
            let url = mountImageID.toString();
            this.m_mountMesh.loadModel(UnitCtrlType.ride, url, true, false);
        }
        else {
            if (this.m_isRiding == true) {
                this.m_isRiding = false;
                this.m_mountMesh.easeOut();
                this.updateAnimation();
            }
        }
    }
    public updateWingModel(wingImageID: number) {
        if (wingImageID > 0) {
            let url = wingImageID.toString();
            this.m_wingMesh.loadModel(UnitCtrlType.wing, url, false, false);
        }
        else {
            this.m_wingMesh.destroy();
        }
    }

    private updateRebirthModel(id: number) {
        if (id > 0) {
            this.m_rebirthMesh.loadModel(UnitCtrlType.hunhuan, (id+550000).toString(), false, false);
        }
        else {
            this.m_rebirthMesh.destroy();
        }
    }

    private updateWuHunAroundModel(wuHunAroundId: number): void {
        if (wuHunAroundId > 0) {
   
                let url = wuHunAroundId + "_" + this.m_profession;
                this.m_wuHuanAroundMesh1.loadModel(UnitCtrlType.wuhun, url, false, false);
            
        } else {
            this.m_wuHuanAroundMesh1.destroy();
        }
    }

    private updateWeaponModel(weaponWuhunID: number, weaponModelID: number, weaponWuhunIDRate: number=1): void {
        // 武器装备逻辑
        // 有神器
        if (weaponWuhunID > 0) {
            // 有装备武器
            if (weaponModelID > 0) {
                if (weaponWuhunID >= 10000) {
                    var cfg = G.DataMgr.zhufuData.getImageConfig(weaponWuhunID);
                    if (cfg != null) {
                        let url = cfg.m_iModelID + "_" + this.m_profession;
                        if (weaponWuhunIDRate > 1) {
                            url = uts.format("{0}0", url);
                        }
                        // 加载神器表中的武器
                        this.m_weaponMesh1.loadModel(UnitCtrlType.weapon, url, false, false);
                        if (this.doubleHand) {
                            this.m_weaponMesh2.loadModel(UnitCtrlType.weapon, url, false, false);
                        }
                        else {
                            this.m_weaponMesh2.destroy();
                        }
                    }
                }
                else {
                    let zfConfig = G.DataMgr.zhufuData.getConfig(KeyWord.HERO_SUB_TYPE_WUHUN, weaponWuhunID);

                    if (zfConfig != null) {
                        let url = zfConfig.m_iModelID + "_" + this.m_profession;
                        // 加载神器表中的武器
                        this.m_weaponMesh1.loadModel(UnitCtrlType.weapon, url, false, false);
                        if (this.doubleHand) {
                            this.m_weaponMesh2.loadModel(UnitCtrlType.weapon, url, false, false);
                        }
                        else {
                            this.m_weaponMesh2.destroy();
                        }
                    }

                }
            }
            else {
                this.m_weaponMesh1.destroy();
                this.m_weaponMesh2.destroy();
            }
        }
        else {
            // 有装备武器
            if (weaponModelID > 0) {
                let url = weaponModelID + "_" + this.m_profession;
                // 加载默认武器
                this.m_weaponMesh1.loadModel(UnitCtrlType.weapon, url, false, false);
                if (this.doubleHand) {
                    this.m_weaponMesh2.loadModel(UnitCtrlType.weapon, url, false, false);
                }
                else {
                    this.m_weaponMesh2.destroy();
                }
            }
            else {
                this.m_weaponMesh1.destroy();
                this.m_weaponMesh2.destroy();
            }
        }
    }

    public setAvataByList(avataList: Protocol.AvatarList, prof: number, gender: number, outsideSelected: boolean = false, outsideSelectIndex: number = 0, saiJiId: number=1): void {
        this.avataList = avataList;
        this.m_profession = prof;
        this.m_gender = gender;
        this.doubleHand = this.m_profession != KeyWord.PROFTYPE_HUNTER;
        let colorIndex = 0;
        if (outsideSelected) {
            colorIndex = outsideSelectIndex;
        } else {
            //不是外部选择的
            colorIndex = avataList.m_ucDressColorID;
        }
        for (let i = 0; i < avataList.m_ucNumber; i++) {
            // 先对新老装备id进行转换
            avataList.m_aiAvatar[i] = GameIDUtil.getNewEquipId(avataList.m_aiAvatar[i]);
        }
        let modelName: string = UnitUtil.getDressModelName(avataList.m_uiDressImageID, prof, gender, colorIndex);
        //
        let zhufuData = G.DataMgr.zhufuData;
        if (this.checkActive) {
            if (!zhufuData.hasActiveWX(saiJiId, KeyWord.HERO_TYPE_SAIJISZ)) {
                modelName = uts.format("{0}0", modelName);
            }
        }
        this.m_bodyMesh.loadModel(UnitCtrlType.hero, modelName, true, true);
        let weaponModelID = 0;
        for (let thingID of avataList.m_aiAvatar) {
            if (thingID > 0) {
                let config = ThingData.getThingConfig(thingID);
                if (config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WEAPON) {
                    weaponModelID = config.m_iModelID;
                    break;
                }
            }
        }
        let wuHunAroundId = 0;
        let weaponWuhunID = 0;
        let m_mountID = 0;
        let m_fazhenID = 0;
        let shenJiID = 0;
        let m_wingID = 0;
        //关联魂力等级 获取武器id（数据在魂力表里取）(第二个参数直接取1 因为3个字节点模型都一样)
        let hunliData = G.DataMgr.hunliData.getHunLiConfigByLevel(avataList.m_ucHunLiLevel,1);
        if (hunliData != null && avataList.m_ucHunLiLevel > 0) {
            wuHunAroundId = hunliData.m_iModel;
        }
        for (let i = 0; i < avataList.m_auiSubLevel.length; i++) {
            let thingID = avataList.m_auiSubLevel[i];

            if (thingID > 0) {
                //神器  武器特效
                if (i == Macros.HERO_SUB_TYPE_WUHUN - 1) {
                    weaponWuhunID = thingID;
                }
                else if (this.hasRide && i == Macros.HERO_SUB_TYPE_ZUOQI - 1) {
                    m_mountID = UnitUtil.getAvatarModelID(thingID, KeyWord.HERO_SUB_TYPE_ZUOQI);
               }
                else if (i == Macros.HERO_SUB_TYPE_LEILING - 1) {
                    shenJiID = UnitUtil.getWingAvatarModelID(thingID, KeyWord.HERO_SUB_TYPE_LEILING);
                }
                else if (this.hasWing && i == Macros.HERO_SUB_TYPE_YUYI - 1) {
                    m_wingID = UnitUtil.getWingAvatarModelID(thingID, KeyWord.HERO_SUB_TYPE_YUYI);
                }
            }
        }
        if (this.hasWing && m_wingID == 0&& avataList.m_uiWingID > 0) {
            m_wingID = G.DataMgr.equipStrengthenData.getWingModelIdByWingEquip(avataList.m_uiWingID, avataList.m_uiWingLevel);
        }

        let weaponWuhunIDRate: number = 1;
        if (this.checkActive) {
            if (!zhufuData.hasActiveWX(saiJiId, KeyWord.HERO_SUB_TYPE_WUHUN)){
               // weaponWuhunID = weaponWuhunID * 10;
                weaponWuhunIDRate = 10;
            }
           
            if (!zhufuData.hasActiveWX(saiJiId, KeyWord.HERO_SUB_TYPE_ZUOQI)) {
                m_mountID = m_mountID * 10;
            }
            if (!zhufuData.hasActiveWX(saiJiId, KeyWord.HERO_SUB_TYPE_YUYI)) {
                m_wingID = m_wingID * 10;
            }
        }
        this.updateMountModel(m_mountID);
        this.updateWingModel(m_wingID);
        //this.updateRebirthModel(avataList.m_uiHunHuanID);
      
        this.updateWeaponModel(weaponWuhunID, weaponModelID, weaponWuhunIDRate);
        this.updateWuHunAroundModel(wuHunAroundId);
    }

}