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
import RoleController from '../role/RoleController';
export class RoleAvatar extends BuffableAvatar {
    public get defaultAvatar(): AvatarMesh {
        return this.m_bodyMesh;
    }
    public hasRide = false;
    public hasWing = false;
    /**
 * 性别
 */
    protected m_gender: number;
    /**
     * 职业
     */
    protected m_profession: number;
    private weaponWuhunID: number;
    private weaponModelID: number;
    /**
     * 是否骑乘中
     */
    protected m_isRiding: boolean = false;
    public get isRiding() {
        return this.m_isRiding;
    }
    public hideRoleEffect: boolean;
    /**是否搬运中*/
    protected m_isCarring: boolean = false;
    public setIsCarring(modelId: string) {
        let value = (modelId != null);
        this.m_isCarring = value;
        let collectionId: number = 0;
        if (value) {
            // 把手里的武器替换成一棵花
            this.m_weaponMesh1.loadModel(UnitCtrlType.collection, modelId, false, false);
            this.m_weaponMesh2.destroy();
            this.m_weaponMesh1.setRotation(90, 0, 0);
        } else {
            this.updateWeaponModel(this.weaponWuhunID, this.weaponModelID);
            this.updateWuHunAroundModel(this.weaponWuhunID);
            this.m_weaponMesh1.setRotation(0, 0, 0);
            this.m_wuHuanAroundMesh1.setRotation(0, 0, 0);
        }
        this.updateAnimation();
    }

    /**是否冲刺中*/
    protected m_isSpeeding = false;
    public set IsSpeeding(isSpeeding: boolean) {
        this.m_isSpeeding = isSpeeding;
        this.updateAnimation();
    }
    public get IsSpeeding(): boolean {
        return this.m_isSpeeding;
    }
    /**模型*/
    m_bodyMesh: AvatarMesh;
    /**翅膀*/
    m_wingMesh: AvatarMesh;
    /**武器*/
    m_weaponMesh1: AvatarMesh;
    //**武器2*/
    m_weaponMesh2: AvatarMesh;
    /**环绕主角的武魂*/
    m_wuHuanAroundMesh1: AvatarMesh;
    /**坐骑*/
    m_mountMesh: MountMesh;
    /**魂环*/
    m_hunhuanMesh: AvatarMesh;
    /**真迹*/
    m_shenJiMesh: AvatarMesh;
    /**宝物*/
    m_faqiMesh: AvatarMesh;
    /**特殊的箭头，在个别场景会显示，跳转场景时会删除*/
    m_arrowMesh: AvatarMesh;

    private avataList: Protocol.AvatarList = null;

    private doubleHand: boolean = false;

    public onCreate() {
        this.m_bodyMesh = new InteractiveMesh(this,true, this.onLoadBody);
        this.m_weaponMesh1 = new AvatarMesh(this,false, this.onLoadWeapon1);
        this.m_weaponMesh2 = new AvatarMesh(this, false,this.onLoadWeapon2);
        this.m_wuHuanAroundMesh1 = new AvatarMesh(this, false, this.onLoadWuHunAround);
        this.m_mountMesh = new MountMesh(this, false,this.onLoadMount);
        this.m_wingMesh = new AvatarMesh(this, false, this.onLoadWing);
        this.m_hunhuanMesh = new AvatarMesh(this, false,this.onLoadHunhuan);
        this.m_shenJiMesh = new AvatarMesh(this, false, this.onLoadShenJi);
        this.m_faqiMesh = new AvatarMesh(this, false,this.onLoadFaQi);
        this.m_weaponMesh1.setRotation(0, 0, 0);
        this.m_wuHuanAroundMesh1.setRotation(0, 0, 0);
    }
    public onDestroy() {
        super.onDestroy();
        this.m_weaponMesh1.destroy(false);
        this.m_weaponMesh2.destroy(false);
        this.m_wuHuanAroundMesh1.destroy(false);
        this.m_wingMesh.destroy(false);
        this.m_hunhuanMesh.destroy(false);
        this.m_shenJiMesh.destroy(false);
        this.m_faqiMesh.destroy(false);
        this.m_bodyMesh.destroy(false);
        this.m_mountMesh.destroy(false);
        this.avataList = null;
        this.m_isCarring = false;
    }
    public onLoadBody() {
        if (this.m_bodyMesh.model == null) {
            return;
        }
        //检查武器翅膀圣印是否已经加载
        this.onLoadWing();
        this.onLoadFaQi();

        if (this.isRiding && this.m_mountMesh.model != null) {
            //骑乘状态魂环消失
            this.setHunHuanStatus(false);
            let parent = this.m_mountMesh.model.createChildTransform("ride", true, 0, -90, 180);
            this.m_bodyMesh.setParent(parent);
        }
        else {
            this.m_bodyMesh.setParent(this.avatarRoot);
            this.setHunHuanStatus(true);
        }
        if (!this.onLoadWeapon1())
            this.updateAnimation();
        if (this.doubleHand) {
            this.onLoadWeapon2();
        }
        if (this.model != null) {
            this.updateNameboardPosition();
            this.m_bodyMesh.setClickAble(this.model.selectAble);
        }
        this.onLoadWuHunAround();
    }


    onLoadFaQi() {
        if (this.m_faqiMesh.model != null) {
            if (this.m_bodyMesh.model != null) {
                let parent = this.avatarRoot2;
                this.m_faqiMesh.setParent(parent);
                //添加跟随脚本，保证其高度一致
                let com = this.m_faqiMesh.model.gameObject.GetComponent(Game.TransformFollower.GetType()) as Game.TransformFollower;
                if (com == null) {
                    com = this.m_faqiMesh.model.gameObject.AddComponent(Game.TransformFollower.GetType()) as Game.TransformFollower;
                }
                com.target = this.m_bodyMesh.model.transform;
                if (this.isRiding && this.m_mountMesh.model) {
                    com.offset = G.getCacheV3(0, 0, 0);
                }
                else {
                    com.offset = G.getCacheV3(0, 0.8, 0);
                }
            }
        }
    }

    /**
    *显示凤凰调用本接口
    */
    private updateFaQiModel(modelName: number) {
        if (modelName > 0) {
            this.m_faqiMesh.loadModel(UnitCtrlType.faqi, modelName.toString(), false, false);
        }
        else {
            this.m_faqiMesh.destroy();
        }
    }

    public onLoadWeapon1(): boolean {
        let tName = this.doubleHand ? "weapon_l" : "weapon";
        if (this.m_weaponMesh1.model != null) {
            if (this.m_bodyMesh.model != null) {
                let parent = this.m_bodyMesh.model.createChildTransform(tName, false, 0, 0, 0);
                this.m_weaponMesh1.setParent(parent);
                //if (this.doubleHand) this.m_weaponMesh1.setRotation(180, 90, -90);
                this.updateAnimation();
                return true;
            }
        }
    }
    public onLoadWeapon2() {
        if (this.m_weaponMesh2.model != null) {
            if (this.m_bodyMesh.model != null) {
                let parent = this.m_bodyMesh.model.createChildTransform("weapon_r", false, 0, 0, 0);
                //if (this.doubleHand) this.m_weaponMesh1.setRotation(180, 90, -90);
                this.m_weaponMesh2.setParent(parent);
            }
        }
    }

    public onLoadWuHunAround(): boolean {
        if (this.m_wuHuanAroundMesh1.model != null) {
            if (this.m_bodyMesh.model != null) {
                let parent = this.m_bodyMesh.model.createChildTransform("wuhun", false, 0, 0, 0);
                this.m_wuHuanAroundMesh1.setParent(parent);
                ////this.m_bodyMesh.model.animator.Rebind();
                return true;
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
    public onLoadHunhuan() {
        this.m_hunhuanMesh.setParent(this.avatarRoot2);
    }
    public onLoadArrow() {
        this.m_arrowMesh.setParent(this.avatarRoot2);
    }
    public onLoadShenJi() {
        if (Game.ParticleFollower) {
            let go = this.m_shenJiMesh.model.gameObject;
            let follower = go.GetComponent(Game.ParticleFollower.GetType()) as Game.ParticleFollower;
            if (null == follower) {
                follower = go.AddComponent(Game.ParticleFollower.GetType()) as Game.ParticleFollower;
            }
            follower.target = this.avatarRoot;
        }
        this.m_shenJiMesh.setParent(this.avatarRoot2);
    }
    updateNameboardPosition() {
        if (this.m_faqiMesh.model) {
            let follower = this.m_faqiMesh.model.gameObject.GetComponent(Game.TransformFollower.GetType()) as Game.TransformFollower;
            if (follower != null) {
                if (this.isRiding && this.m_mountMesh.model) {
                    follower.offset = G.getCacheV3(0, 0, 0);
                }
                else {
                    follower.offset = G.getCacheV3(0, 0.8, 0);
                }
            }
        }

        if (this.isRiding && this.m_mountMesh.model) {
            let v3 = G.cacheVec3;
            let oPos = this.m_mountMesh.model.transform.position;
            Game.Tools.GetPosition(this.m_mountMesh.model.getChildTransform("ride"), v3);
            v3.Set(0, v3.y - oPos.y + this.m_bodyMesh.boundHeightPixel / 30, 0);
            this.model.topTitleContainer.containerRoot.offset = v3;
        }
        else {
            let v3 = G.cacheVec3;
            v3.Set(0, this.m_bodyMesh.boundHeightPixel / 20, 0);
            this.model.topTitleContainer.containerRoot.offset = v3;
        }
    }

    private hasWuHunModel: boolean = false;
    private playWuHunAnimation(name: string, fadeTime: number = 0): void {
        if (this.hasWuHunModel)
            this.m_wuHuanAroundMesh1.playAnimation(name, fadeTime);
    }
    //播放单位动画
    public updateAnimation() {
        if (this.model == null) {
            return;
        }
        if (!this.hasWuHunModel && this.m_wuHuanAroundMesh1.model != null) this.hasWuHunModel = true;
        let state: UnitState = this.model.state;
        switch (state) {
            case UnitState.Enter:
            case UnitState.Stand:
                if (this.m_isCarring) {
                    this.m_bodyMesh.playAnimation('stand_hold', 0.1);
                    this.playWuHunAnimation('stand_hold', 0.1);
                    this.m_weaponMesh1.setRotation(-198, -93, 18);
                }
                else {
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
                            if (state == UnitState.Enter) {
                                this.m_bodyMesh.playAnimation('enter');
                                this.playWuHunAnimation('enter');
                            }
                            else {
                                this.m_bodyMesh.playAnimation('stand', 0.1);
                                this.playWuHunAnimation('stand', 0.1);
                            }
                        }
                    }
                }
                break;
            case UnitState.Move:
                if (this.m_isCarring) {
                    this.m_bodyMesh.playAnimation('move_hold', 0.1);
                    this.playWuHunAnimation('move_hold', 0.1);
                    this.m_weaponMesh1.setRotation(90, 0, 0);
                } else if (this.m_isSpeeding) {
                    this.m_bodyMesh.playAnimation('speed', 0.1);
                    this.playWuHunAnimation('speed', 0.1);
                }
                else {
                    if (this.m_isRiding) {
                        if (this.m_mountMesh.model != null) {
                            this.m_bodyMesh.playAnimation('move_ride', 0.1);
                            this.playWuHunAnimation('move_ride', 0.1);
                        }
                        else {
                            this.m_bodyMesh.playAnimation('move', 0.1);
                            this.playWuHunAnimation('move', 0.1);
                        }
                        this.m_mountMesh.playAnimation("move", 0.2);
                    }
                    else {
                        if (this.m_mountMesh.model != null) {
                            this.m_bodyMesh.playAnimation('move', 0.1);
                            this.playWuHunAnimation( 'move', 0.1);
                        } else {
                            this.m_bodyMesh.playAnimation('move', 0.1);
                            this.playWuHunAnimation('move', 0.1);
                        }
                    }
                }
                break;
            case UnitState.Dead:
                this.m_bodyMesh.playAnimation("dead");
                this.playWuHunAnimation("dead");
                break;
            case UnitState.Fight:
                this.m_bodyMesh.playAnimation(this.model.unit.getAnimName(UnitState.Fight));
                this.playWuHunAnimation(this.model.unit.getAnimName(UnitState.Fight));
                break;
            case UnitState.Jump:
                this.m_bodyMesh.playAnimation(this.model.unit.getAnimName(UnitState.Jump));
                this.playWuHunAnimation(this.model.unit.getAnimName(UnitState.Jump));
                break;
            case UnitState.FlyEnd:
                this.m_bodyMesh.playAnimation("fly3");
                this.playWuHunAnimation("fly3");
                break;
        }
    }
    public setVisible(value: boolean) {
        this.m_hunhuanMesh.setVisible(value && !this.hideRoleEffect);
        this.m_shenJiMesh.setVisible(value && !this.hideRoleEffect);
        this.m_faqiMesh.setVisible(value && !this.hideRoleEffect);
        if (this._visible != value) {
            this._visible = value;
            this.setBuffVisible(value);
            this.m_weaponMesh1.setVisible(value);
            this.m_weaponMesh2.setVisible(value);
            this.m_wingMesh.setVisible(value);
            this.m_bodyMesh.setVisible(value);
            this.m_mountMesh.setVisible(value);
        }
    }
    public setClickAble(value: boolean) {
        this.m_bodyMesh.setClickAble(value);
    }

    public rideDown() {
        this.updateMountModel(0);
    }
    private updateMountModel(mountImageID: number) {
        if (mountImageID > 0) {
            if (this.model.state == UnitState.Fight) {
                this.model.changeStateWithoutAnim(UnitState.Stand);
            }
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
    private updateWingModel(wingImageID: number) {
        if (wingImageID > 0) {
            let url = wingImageID.toString();
            this.m_wingMesh.loadModel(UnitCtrlType.wing, url, false, false);
        }
        else {
            this.m_wingMesh.destroy();
        }
    }
    private showHunHuan: boolean = false;
    public setHunHuanStatus(show: boolean) {
        this.showHunHuan = show;
        if (this.avataList) {
            this.updateHunhuanModel(this.avataList.m_uiHunHuanID);
        }
    }
    private updateHunhuanModel(id: number) {
        if (id > 0 && this.showHunHuan) {
            let config = G.DataMgr.hunliData.getHunHuanConfigById(id);
            if (!config) {
                uts.logWarning("魂环不存在：" + id);
            }
            else {
                this.m_hunhuanMesh.loadModel(UnitCtrlType.hunhuan, config.m_iModelID.toString(), false, false);
            }
        }
        else {
            this.m_hunhuanMesh.destroy();
        }
    }
    private isArrowVisible: boolean;
    //因为只有主角自己会用到，所以对其它玩家而言，这个对象不去初始化，只有主角自己会用到
    public setArrowVisible(visible: boolean) {
        if (visible != this.isArrowVisible) {
            this.isArrowVisible = visible;
            if (visible) {
                if (!this.m_arrowMesh) {
                    this.m_arrowMesh = new AvatarMesh(this, false,this.onLoadArrow);
                }
                this.m_arrowMesh.loadModel(UnitCtrlType.other, "effect/misc/orange_arrow.prefab", false, false);
            }
            else {
                if (this.m_arrowMesh) {
                    this.m_arrowMesh.destroy();
                }

            }
        }
    }

    private updateShenJiModel(shenJiImageID: number) {
        if (shenJiImageID > 0) {
            this.m_shenJiMesh.loadModel(UnitCtrlType.shenji, shenJiImageID.toString(), false, false);
        }
        else {
            this.m_shenJiMesh.destroy();
        }
    }

    private updateWuHunAroundModel(wuHunAroundId: number): void {
        if (wuHunAroundId > 0) {
            let url = wuHunAroundId + "_" + this.m_profession;
            this.m_wuHuanAroundMesh1.loadModel(UnitCtrlType.wuhun, url, true, false);
        } else {
            this.m_wuHuanAroundMesh1.destroy();
        }
    }

    private updateWeaponModel(weaponWuhunID: number, weaponModelID: number): void {
        this.weaponWuhunID = weaponWuhunID;
        this.weaponModelID = weaponModelID;
        // 武器装备逻辑
        // 有神器
        if (weaponWuhunID > 0) {
            // 有装备武器
            if (weaponModelID > 0) {
                if (weaponWuhunID >= 10000) {
                    var cfg = G.DataMgr.zhufuData.getImageConfig(weaponWuhunID);
                     if (cfg != null) {
                         let url = cfg.m_iModelID + "_" + this.m_profession;
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
    public setAvataByList(avataList: Protocol.AvatarList, prof: number, gender: number): void {
        this.avataList = avataList;
        this.m_profession = prof;
        this.m_gender = gender;
        this.doubleHand = this.m_profession != KeyWord.PROFTYPE_HUNTER;
        let colorIndex = this.avataList.m_ucDressColorID;
        for (let i = 0; i < avataList.m_ucNumber; i++) {
            // 先对新老装备id进行转换
            avataList.m_aiAvatar[i] = GameIDUtil.getNewEquipId(avataList.m_aiAvatar[i]);
        }
        let modelName: string = UnitUtil.getDressModelName(avataList.m_uiDressImageID, prof, gender, colorIndex);
        //modelName = '40101019';
        //
        this.m_bodyMesh.loadModel(UnitCtrlType.hero, modelName, true, true);
        let weaponModelID = 0;
        for (let thingID of avataList.m_aiAvatar) {
            if (thingID > 0) {
                let config = ThingData.getThingConfig(thingID);
                if (config) {
                    if (config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WEAPON) {
                        weaponModelID = config.m_iModelID;
                        break;
                    }
                } else {
                    uts.logError('avatar error: id = ' + thingID);
                }
            }
        }
        //环绕主角的武魂Id: 龙,剑鞘
        let wuHunAroundId = 0;
        let weaponWuhunID = 0;
        let m_mountID = 0;
        let shenJiID = 0;
        let m_wingID = 0;
        let m_shenglingID = 0;
        let m_fazhenID = 0;
        //关联魂力等级 获取武器id（数据在魂力表里取）(第二个参数直接取1 因为3个字节点模型都一样)
        let hunliData = G.DataMgr.hunliData.getHunLiConfigByLevel(avataList.m_ucHunLiLevel, 1);
        if (hunliData != null && avataList.m_ucHunLiLevel > 0) {
            wuHunAroundId = hunliData.m_iModel;
        }

        for (let i = 0; i < avataList.m_auiSubLevel.length; i++) {
            let thingID = avataList.m_auiSubLevel[i];

            if (thingID > 0) {
                // 神器  武器特效
                 if (i == Macros.HERO_SUB_TYPE_WUHUN - 1) {
                     weaponWuhunID = thingID;
                 }
                 else if (this.hasRide && i == Macros.HERO_SUB_TYPE_ZUOQI - 1) {
                    m_mountID = UnitUtil.getAvatarModelID(thingID, KeyWord.HERO_SUB_TYPE_ZUOQI);
                }
                else if (i == Macros.HERO_SUB_TYPE_FAZHEN - 1) {
                    m_fazhenID = UnitUtil.getAvatarModelID(thingID, KeyWord.HERO_SUB_TYPE_FAZHEN);
                }
                 else if (this.hasWing && i == Macros.HERO_SUB_TYPE_YUYI - 1) {
                     m_wingID = UnitUtil.getWingAvatarModelID(thingID, KeyWord.HERO_SUB_TYPE_YUYI);
                     
                }
                else if (i == Macros.HERO_SUB_TYPE_LEILING - 1) {
                    shenJiID = UnitUtil.getAvatarModelID(thingID, KeyWord.HERO_SUB_TYPE_LEILING);
                }
                else if (i == Macros.HERO_SUB_TYPE_SHENGLING - 1) {
                    m_shenglingID = UnitUtil.getAvatarModelID(thingID, KeyWord.HERO_SUB_TYPE_SHENGLING);
                }
            }
        }

        if (this.hasWing && m_wingID==0 && avataList.m_uiWingID > 0) {
            m_wingID = G.DataMgr.equipStrengthenData.getWingModelIdByWingEquip(avataList.m_uiWingID, avataList.m_uiWingLevel);
        }
        let unit = this.model.unit;
        this.updateMountModel(m_mountID);
        this.updateWingModel(m_wingID);
        this.updateHunhuanModel(avataList.m_uiHunHuanID);
        this.updateShenJiModel(shenJiID);
        unit.updateUnitAvatar(KeyWord.HERO_SUB_TYPE_SHENGLING, m_shenglingID);
        unit.updateUnitAvatar(KeyWord.STRONG_FABAO, avataList.m_uiFabaoShowID);
        unit.updateUnitAvatar(KeyWord.HERO_SUB_TYPE_FAZHEN, m_fazhenID);
        if (!this.m_isCarring) {
            this.updateWeaponModel(weaponWuhunID, weaponModelID);
            this.updateWuHunAroundModel(wuHunAroundId);
        }
        {
            let faqi = G.DataMgr.fabaoData.getFaqiConfig(avataList.m_ucFaQiId, 1);
            if (faqi) {
                this.updateFaQiModel(faqi.m_iModelID);
            }
            else {
                this.updateFaQiModel(0);
            }
        }
    }
    public setAvataByBuff(modelName: string): void {
        this.m_bodyMesh.loadModel(UnitCtrlType.hero, modelName, true, true);
    }

}
export default RoleAvatar;