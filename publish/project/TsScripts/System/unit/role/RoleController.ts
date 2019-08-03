import { Global as G } from 'System/global'
import { UnitController } from 'System/unit/UnitController'
import { PetController } from 'System/unit/attendant/PetController'
import { GuoyunController } from 'System/unit/attendant/GuoyunController'
import { ShieldGodController } from 'System/unit/attendant/ShieldGodController'
import { LingbaoController } from 'System/unit/attendant/LingbaoController'
import { ShengLingController } from 'System/unit/attendant/ShengLingController'
import { UnitData, RoleData } from 'System/data/RoleData'
import { UnitCtrlType, PositionState, EnumBuff } from 'System/constants/GameEnum'
import { Color } from 'System/utils/ColorUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { Macros } from 'System/protocol/Macros'
import { TitleData } from "System/data/vo/TitleData"
import { KeyWord } from "System/constants/KeyWord"
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { GuildTools } from 'System/guild/GuildTools'
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
import { JumpHandler } from 'System/unit/JumpHandler'
import { LandHandler } from 'System/unit/LandHandler'
import { MathUtil } from 'System/utils/MathUtil'
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { AvatarType } from "System/unit/avatar/AvatarType"
import { RoleAvatar } from "System/unit/avatar/RoleAvatar"
import { UnitStatus } from 'System/utils/UnitStatus'
import { EffectPlayer } from "System/unit/EffectPlayer"
import { MonsterData } from 'System/data/MonsterData'
import { BuffData } from 'System/data/BuffData'
import { Constants } from 'System/constants/Constants'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { SettingData } from 'System/data/SettingData'
export class RoleController extends UnitController {
    public hideFlag: boolean = true;
    pet: PetController;
    guoyun: GuoyunController;
    shield: ShieldGodController;
    lingbao: LingbaoController;
    shengLing: ShengLingController;
    private loaded: boolean = false;
    private nameColor: string;
    /**跳跃处理*/
    protected m_jumpHandler: JumpHandler;

    /**跳跃点跳跃路径。*/
    protected m_jumpTeleports: number[];

    /**跳跃终点。*/
    protected m_jumpDestPos: Protocol.UnitPosition;

    /**跳跃点跳跃回调。*/
    protected m_jumpTeleportCallback: () => void;

    /**天仙降落*/
    protected landHandler: LandHandler;
    private actionCanBeSeen: boolean = false;

    /**上次变换守护神形态的时间*/
    protected lastChangeShieldAt = 0;
    protected isShieldDirty = false;
    protected oldShieldBuffId = 0;


    private mustSeen: boolean = false;
    private oldactionCanBeSeen: boolean = false;
    private oldmustSeen: boolean = false;

    /**是否将要或者正在跳跃，此状态仅限于跳跃点跳跃。*/
    isAboutToJumpOrJumping = false;
    protected specializedAttackName: string = null;
    public get Data(): RoleData {
        return this.data as RoleData;
    }
    private settingData: SettingData;
    public onLoad() {
        this.settingData = G.DataMgr.settingData;
        this.model.initAvatar(this, AvatarType.Role);
        this.model.selectAble = true;
        this.model.useSafty(true);
        this.model.useTerrainType(true);

        let alwaysAnimate = false;
        if (this.Data.monsterRoleId > 0) {
            // 人形怪进行缩放
            let c = MonsterData.getMonsterConfig(this.Data.monsterRoleId);
            let scale = 1;
            if (c.m_ucUnitScale > 0) {
                scale = c.m_ucUnitScale / 100;
            }
            this.model.setScale(scale);

            if (scale >= 2) {
                // 防止放大后如果跳起来了，unity不渲染导致模型一直卡在空中导致看不见的问题
                alwaysAnimate = true;
            }
        }
        this.model.showShadow(true, true);
        this.onUpdateVisible();
        this.model.avatar.defaultAvatar.setCullingMode(alwaysAnimate ? UnityEngine.AnimatorCullingMode.AlwaysAnimate : UnityEngine.AnimatorCullingMode.CullCompletely);

        this.updateTitle();
        if (this.m_jumpHandler == null) {
            this.m_jumpHandler = new JumpHandler(this);
            this.landHandler = new LandHandler(this);
        }
        this.onUpdateNameboard(null);

        if (this.data.unitType == UnitCtrlType.hero) {
            this.onLoadModel();
        } else {
            G.UnitMgr.unitCreateQueue.add(this);
        }
    }
    public onLoadModel() {
        this.loaded = true;
        this.updateAvatar();
    }
    public onDestroy() {
        if (!this.loaded) {
            G.UnitMgr.unitCreateQueue.remove(this);
        }
        this.m_jumpTeleportCallback = null;
        this.m_jumpHandler.destroy();
        this.landHandler.destroy();

        this.m_jumpHandler = null;
        this.landHandler = null;

        if (null != this.pet) {
            this.pet.clearFollower();
            this.pet = null;
        }
        if (null != this.guoyun) {
            this.guoyun.destroy(false);
            this.guoyun = null;
        }
        if (null != this.shield) {
            this.shield.destroy(false);
            this.shield = null;
        }
        if (null != this.lingbao) {
            this.lingbao.destroy(false);
            this.lingbao = null;
        }
        if (null != this.shengLing) {
            this.shengLing.destroy(false);
            this.shengLing = null;
        }
    }
    public onMoveEnd(byStop: boolean) { }
    public onHit() {
        this.Data.lastHurtAt = UnityEngine.Time.realtimeSinceStartup;
    }
    public onDead() { }
    public getAnimName(state: UnitState): string {
        switch (state) {
            case UnitState.Jump:
                if (this.IsLanding) {
                    return 'jump1';
                }
                return this.m_jumpHandler.jumpAnimationName;
            case UnitState.Fight:
                if (this.specializedAttackName != null) {
                    return this.specializedAttackName;
                }
                return "attack";
        }
        return null;
    }
    public onAddBuff(buffInfo: Protocol.BuffInfo) {
        let buffCfg = BuffData.getBuffByID(buffInfo.m_iBuffID);
        if (Macros.SPEED_BUFF_ID == buffInfo.m_iBuffID) {
            this.checkSpeedBuff(true);
        }
        // else if (EnumBuff.CARRY_BUFF == buffInfo.m_iBuffID) {
        //     (this.model.avatar as RoleAvatar).setIsCarring('290131');
        // }
        // else if (EnumBuff.QIZI_BUFF == buffInfo.m_iBuffID) {
        //     (this.model.avatar as RoleAvatar).setIsCarring('31020047');
        // }
        else if (EnumBuff.BossOwnner == buffInfo.m_iBuffID) {
            let ttc = this.model.topTitleContainer;
            ttc.setImageTopTitleValue(TopTitleEnum.BossOwner, 'model/chenghao/bossOwner.prefab', 0);
        }
        if (BuffData.isBuffHasEffect(buffCfg, KeyWord.BUFF_EFFECT_BODYSIZE)) {
            this.model.setScale(G.DataMgr.buffData.getBuffEffectValue(buffCfg, KeyWord.BUFF_EFFECT_BODYSIZE) / 100);
        }
    }
    public onDeleteBuff(buffId: number) {
        let buffCfg = BuffData.getBuffByID(buffId);
        if (Macros.SPEED_BUFF_ID == buffId) {
            this.checkSpeedBuff(false);
        }
        // else if (EnumBuff.CARRY_BUFF == buffId) {
        //     (this.model.avatar as RoleAvatar).setIsCarring(null);
        // }
        // else if (EnumBuff.QIZI_BUFF == buffId) {
        //     (this.model.avatar as RoleAvatar).setIsCarring(null);
        // }
        else if (EnumBuff.BossOwnner == buffId) {
            let ttc = this.model.topTitleContainer;
            ttc.setImageTopTitleValue(TopTitleEnum.BossOwner, null, 0);
        }
        if (BuffData.isBuffHasEffect(buffCfg, KeyWord.BUFF_EFFECT_BODYSIZE)) {
            this.model.setScale(1);
        }
    }
    public onUpdateNameboard(name: string) {
        if (null == name) {
            name = this.Data.name;
        }
        //魂力显示
        let hunliLevel = this.Data.avatarList.m_ucHunLiLevel;
        if (hunliLevel > 0) {
            let level = uts.format("[{0}]", KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, hunliLevel));;
            level = TextFieldUtil.getColorText(level, Color.WHITE);

            name = uts.format("{0} {1}", level, name);
        }
        if (G.DataMgr.sceneData.curPinstanceID == Macros.PINSTANCE_ID_GUILDPVP_CROSS) {
            // 封神台显示几服
            name = uts.format('[{0}服]', this.Data.WorldID) + name;
        }
        if (UnitStatus.isGuaJi(this.Data.unitStatus)) {
            name = TextFieldUtil.getColorText('[离线挂机中...]', Color.GREEN) + name;
        }
        let otherName = "";
        let partnerTitle = this.getPartnerTitle();
        if (null != partnerTitle) {
            otherName += partnerTitle;
        }
        let guildTitle = this.getGuildTitle();
        if (null != guildTitle) {
            if (otherName == "") {
                otherName = guildTitle;
            }
            else {
                otherName = guildTitle + '\n' + otherName;
            }
        }
        this.nameColor = UnitUtil.getRoleNameColor(this);
        
        this.model.topTitleContainer.setTextTopTitleValue(0, TextFieldUtil.getColorText(name, this.nameColor));
        if (otherName == "") {
            this.model.topTitleContainer.setTextTopTitleValue(1, null);
        }
        else {
            this.model.topTitleContainer.setTextTopTitleValue(1, TextFieldUtil.getColorText(otherName, this.nameColor));
        }
    }

    //使用指定动画对其他目标执行攻击动作，单位状态会切换到攻击
    public attackTarget(targetPos: UnityEngine.Vector3, aniName: string) {
        if (this.model == null) {
            uts.assert(false, "RoleController::attackTarget - 请不要对已经删除的单位进行操作");
            return null;
        }
        (this.model.avatar as RoleAvatar).rideDown();
        if (targetPos) {
            this.model.lookAt(targetPos);
        }
        this.specializedAttackName = aniName;
        this.model.changeState(UnitState.Fight, true);
    }
    public kill(killer: UnitController) {
        if (this.model == null) {
            uts.assert(false, "RoleController::kill - 请不要对已经删除的单位进行操作");
            return null;
        }
        if (killer != null) {
            this.model.lookAt(killer.getWorldPosition());
        }
        (this.model.avatar as RoleAvatar).rideDown();
        this.model.changeState(UnitState.Dead);
        this.onDead();
    }
    public onAvatarChange() {
        if (this.loaded) {
            this.updateAvatar();
        }
    }

    private updateAvatar() {
        let b = this.buffProxy.getChangeAvatarBuff();
        if (null == b) {
            this.cancelChangeAvatar();
        } else {
            this.changeAvatarByBuff(b);
        }
    }
    public changeAvatarByBuff(buffCfg: GameConfig.BuffConfigM) {
        if (this.model == null) {
            uts.assert(false, "RoleController::changeAvatarByBuff - 请不要对已经删除的单位进行操作");
            return null;
        }
        (this.model.avatar as RoleAvatar).setAvataByBuff(buffCfg.m_szChangeAvatar);
    }
    public cancelChangeAvatar() {
        if (this.model == null) {
            uts.assert(false, "RoleController::cancelChangeAvatar - 请不要对已经删除的单位进行操作");
            return null;
        }
        (this.model.avatar as RoleAvatar).setAvataByList(this.Data.avatarList, this.Data.profession, this.Data.gender);
    }

    /**更新玩家伴侣的名字*/
    private getPartnerTitle(): string {
        if (this.Data.mateName != '') {
            return TextFieldUtil.getColorText(uts.format("{0}的仙侣", this.Data.mateName), Color.YELLOW);
        }
        return null;
    }


    /**更新宗门名字和职位*/
    private getGuildTitle(): string {
        let guildID: number = this.Data.guildId;
        if (guildID > 0) {
            let guildTitleStr: string = '';
            // 先处理宗门名字
            let isHero: boolean = this.data.unitType == UnitCtrlType.hero;
            // 在比武大会初赛里，不显示敌方的宗门信息
            if (isHero || Macros.PINSTANCE_ID_SINGLEPVP != G.DataMgr.sceneData.curPinstanceID) {
                let isEnemy: boolean = false;
                if (G.DataMgr.heroData.pkMode == Macros.PK_STATUS_GUILD) {
                    if (guildID != G.DataMgr.heroData.guildId) {
                        isEnemy = true;
                    }
                }
                let color: string;
                if (isHero) {
                    color = Color.GREEN;
                } else {
                    color = isEnemy ? Color.RED : Color.BLUE;
                }
                let guildName: string = this.Data.guildName;
                if (guildName != null && guildName != '') {
                    guildTitleStr += TextFieldUtil.getColorText(uts.format('[{0}]', guildName), color);
                }

                // 再处理宗门职位
                if (this.Data.guildGrade > 0 && GuildTools.checkIsHasPos(this.Data.guildGrade)) {
                    if (isHero) {
                        color = Color.GREEN;
                    } else {
                        color = isEnemy ? Color.RED : Color.WHITE;
                    }
                    guildTitleStr += TextFieldUtil.getColorText(uts.format('[{0}]', GuildTools.getPosName(this.Data.guildGrade)), color);
                }

                return guildTitleStr;
            }

            return null;
        }
    }
    onUpdateTimer(now: number) {
        super.onUpdateTimer(now);

        let data = this.Data;
        this.actionCanBeSeen = (data.lastHurtAt > 0 && now - data.lastHurtAt < Constants.AppearHoldTimeByHit) ||
            (data.lastAttackMeAt > 0 && now - data.lastAttackMeAt < Constants.AppearHoldTimeByHit);
        this.mustSeen = this.buffProxy.hasBuffByID(EnumBuff.BossOwnner);
        if (this.mustSeen != this.oldmustSeen) {
            this.oldmustSeen = this.mustSeen;
            this.onUpdateVisible();
        }
        else if (this.actionCanBeSeen != this.oldactionCanBeSeen) {
            this.oldactionCanBeSeen = this.actionCanBeSeen;
            this.onUpdateVisible();
        }

        if (this.isShieldDirty && now - this.lastChangeShieldAt > 2) {
            let shieldId = this.Data.shieldId;
            if (shieldId > 0) {
                if (UnitStatus.isInFight(this.Data.unitStatus)) {
                    // 战斗状态中，显示护盾效果
                    if (this.shield) {
                        G.UnitMgr.removeShield(this);
                    }
                    if (this.model && this.oldShieldBuffId != shieldId) {
                        let avatar = this.model.avatar as RoleAvatar;
                        avatar.removeBuff(this.oldShieldBuffId);
                        avatar.addBuff(shieldId, uts.format('shield{0}', shieldId), KeyWord.BUFF_BINDINGPOSITION_FOOT);
                        this.oldShieldBuffId = shieldId;
                    }
                } else {
                    if (this.model) {
                        let avatar = this.model.avatar as RoleAvatar;
                        avatar.removeBuff(this.oldShieldBuffId);
                    }
                    this.oldShieldBuffId = 0;
                    if (null == this.shield) {
                        // 非战斗状态中，创建宝宝
                        G.UnitMgr.createShieldGod(shieldId, this);
                    } else if (shieldId != this.shield.Data.id) {
                        this.shield.updateShieldId(shieldId, 1);
                    }
                }
            } else {
                if (this.shield) {
                    G.UnitMgr.removeShield(this);
                }
                if (this.model) {
                    let avatar = this.model.avatar as RoleAvatar;
                    avatar.removeBuff(this.oldShieldBuffId);
                }
                this.oldShieldBuffId = 0;
            }
            this.lastChangeShieldAt = now;
            this.isShieldDirty = false;
        }

        if (this.model.isVisible) {
            // pet具备unit id，在UnitModule里已经调用过onUpdateTimer了，此处仅处理没有unit id的
            if (null != this.guoyun) {
                this.guoyun.onUpdateTimer(now);
            }
            if (null != this.lingbao) {
                this.lingbao.onUpdateTimer(now);
            }
            if (null != this.shengLing) {
                this.shengLing.onUpdateTimer(now);
            }
            if (null != this.shield) {
                this.shield.onUpdateTimer(now);
            }
        }
    }
    protected checkSpeedBuff(isSpeed: boolean) {
        // 有加速buff的时候 用加速冲锋的动作
        let avatar = this.model.avatar as RoleAvatar;
        if (isSpeed) {
            if (!avatar.IsSpeeding && this.isMoving && !this.IsJumping) {
                let path = this.model.tweenPath.wholePath;
                let len = Game.ArrayHelper.GetArrayLength(path);
                if (len == 1) {
                    let destInWorld = Game.ArrayHelper.GetArrayValue(path, 0) as UnityEngine.Vector3;
                    let destInPixel = G.localPositionToServerPixel(destInWorld);
                    let myPosInPixel = this.getPixelPosition();
                    if (MathUtil.getDistance(myPosInPixel.x, myPosInPixel.y, destInPixel.x, destInPixel.y) <= 400) {
                        avatar.IsSpeeding = true;
                    }
                }
            }
        } else {
            if (avatar.IsSpeeding) {
                avatar.IsSpeeding = false;
            }
        }
    }

    checkShield() {
        this.isShieldDirty = true;
    }

    //////////////////////////////// 称号 ////////////////////////////////
    public updateTitle(): void {
        let ttc = this.model.topTitleContainer;

        let titleID = 0;
        if (this.Data.m_usShowTitleID > 0) {
            let titleConfig = G.DataMgr.titleData.getDataConfig(this.Data.m_usShowTitleID);
            if (titleConfig != null) {
                titleID = titleConfig.m_uiImageID;
            }
        }
        if (titleID == 0) {
            if (this.Data.uniqueTitle2 != null) {
                let platTitleID = TitleData.platTitleID;
                let length = platTitleID.length;
                for (let i = 0; i < length; i++) {
                    let titleId = platTitleID[i];
                    let type = TopTitleEnum.UniqueTitleBase + titleId;
                    if (this.Data.uniqueTitle2.indexOf(titleId) != -1) {
                        let titleConfig = G.DataMgr.titleData.getDataConfig(titleId);
                        if (titleConfig != null) {
                            titleID = titleConfig.m_uiImageID;
                        }
                    }
                }
            }
        }

        if (titleID <= 0) {
            ttc.setImageTopTitleValue(TopTitleEnum.TitleID, null, 0);
        }
        else {
            ttc.setImageTopTitleValue(TopTitleEnum.TitleID, "model/chenghao/" + titleID + ".prefab", 0);
        }

        if (this.Data.jisutiaozhanTitle > 0) {
            ttc.setImageTopTitleValue(TopTitleEnum.JisutiaozhanTitle, "model/chenghao/jxtz" + this.Data.jisutiaozhanTitle + ".prefab", 1);
        }
        else {
            ttc.setImageTopTitleValue(TopTitleEnum.JisutiaozhanTitle, null, 1);
        }

        if (this.Data.juYuanId > 0) {
            let path: string = uts.format("model/chenghao/{0}.prefab", 30000000 + this.Data.juYuanId);
            ttc.setImageTopTitleValue(TopTitleEnum.JuYuan, path, -1);
        }
        else {
            ttc.setImageTopTitleValue(TopTitleEnum.JuYuan, null, -1);
        }
    }

    public getSpeed(): number {
        if (this.m_moveType == Macros.MOVE_MODE_NONE && this.m_jumpHandler.isJumping) {
            // 跳跃中的话 用跳跃时的水平速度
            return this.m_jumpHandler.jumpSpeed;
        }
        return super.getSpeed();
    }

    /**
	* 复活
	*
	*/
    reborn() {
        this._clearAboutJumpTeleport();
        super.reborn();
    }

    /////////////////////////////////////////////////// 跳跃相关  ///////////////////////////////////////////////////

    jumpByTeleports(nodes: number[], destPos: Protocol.UnitPosition, callback: () => void = null): void {
        this.isAboutToJumpOrJumping = true;
        this.m_jumpTeleports = nodes.concat();
        this.m_jumpDestPos = uts.deepcopy(destPos, this.m_jumpDestPos, true);
        this.m_jumpTeleportCallback = callback;
        // 第一个节点是当前所在的跳跃点，直接删掉
        this.m_jumpTeleports.shift();
        this._jume2NextTeleports();
    }

    _jume2NextTeleports(): void {
        if (1 == this.m_jumpTeleports.length) {
            //uts.log('jump to next, dest 1');
            this.jumpTo(this.m_jumpDestPos.m_uiX, this.m_jumpDestPos.m_uiY, delegate(this, this._jumpTeleportFinished));
        }
        else {
            let tid: number = this.m_jumpTeleports.shift();
            let tinfo = G.DataMgr.sceneData.getGateInfo(G.DataMgr.sceneData.curSceneID, tid);

            if (tinfo != null) {
                //uts.log('jump to next, tid = ' + tid);
                this.jumpTo(tinfo.x, tinfo.y, delegate(this, this._jumpTeleportCallback));
            }
            else {
                //uts.log('jump to next, dest 2');
                this.m_jumpTeleports.length = 0;
                this.jumpTo(this.m_jumpDestPos.m_uiX, this.m_jumpDestPos.m_uiY, delegate(this, this._jumpTeleportFinished));
            }
        }
    }

    protected _jumpTeleportCallback(): void {
        if (this.m_jumpTeleports && this.m_jumpTeleports.length > 0) {
            // 继续跳跃
            this._jume2NextTeleports();
        }
    }

    protected _jumpTeleportFinished(): void {
        let callback: () => void = this.m_jumpTeleportCallback;
        this._clearAboutJumpTeleport();
        if (null != callback) {
            callback();
        }
        //this.sendJumpComplete();
    }

    protected _clearAboutJumpTeleport(): void {
        this.m_jumpTeleports = null;
        this.m_jumpTeleportCallback = null;
        this.isAboutToJumpOrJumping = false;

        if (UnitState.Jump == this.state) {
            this.changeAction(UnitState.Stand);
        }
    }

    onFinishJump(action: number): void {
        if (action == KeyWord.SKILL_EFFECT_POSITION) {
            //this.sendEventChangeAction(AnimationState.JUMP, AnimationState.STAND);
        }
    }

    /**
	* 跳跃到某位置
	* @param destXPixel
	* @param destYPixel
	*
	*/
    jumpTo(destXPixel: number, destYPixel: number, callback: () => void = null): void {
        this.m_jumpHandler.jumpTo(destXPixel, destYPixel, callback);
    }

    stopJump(finishJump: boolean): void {
        this.m_jumpHandler.suicide(finishJump);
        this._clearAboutJumpTeleport();
    }

    /**
     * 是否正在跳跃，包括技能跳跃和跳跃点跳跃。
     * @return
     *
     */
    get IsJumping(): boolean {
        return null != this.m_jumpHandler && (this.m_jumpHandler.isJumping || (null != this.m_jumpTeleports && this.m_jumpTeleports.length > 0));
    }

    ////////////////////////////////////////////////////////////// 降落 //////////////////////////////////////////////////////////////

    public land2Floor(callback: () => void = null) {
        this.landHandler.land(callback);
    }

    public stopLand() {
        this.landHandler.suicide();
    }
    /**
     * 是否降落中
     * @return
     */
    get IsLanding(): boolean {
        return this.landHandler.isLanding;
    }

    public updateUnitAvatar(type: number, id: number) {
        if (type == KeyWord.HERO_SUB_TYPE_SHENGLING) {
            G.UnitMgr.addShengLing2Role(id, this);
        }
        else if (type == KeyWord.STRONG_FABAO) {
            if (this.pet) {
                this.pet.setShengQi(id);
            }
        }
        else if (type == KeyWord.HERO_SUB_TYPE_FAZHEN) {
            if (this.pet) {
                this.pet.setZhenFa(id);
            }
        }
    }

    toString(): string {
        return uts.format('[Role unitID={0} model={1} unitStatus={2} isFreze={3} isComa={4} state={5} armyID={6} pkMode={7} pkValue={8} campID={9}]',
            this.Data.unitID, this.model ? 'Y' : 'N', this.data.unitStatus, this.buffProxy.isFreze, this.buffProxy.isComa, this.state,
            this.Data.armyID, this.Data.pkMode, this.Data.pkValue, this.Data.campID);
    }
    public onUpdateVisible() {
        let settingData = this.settingData;
        if (settingData.sceneHideFlag == 2) {
            this.model.setVisible(false, false);
        }
        else {
            let data = this.Data;
            if (data.unitType == UnitCtrlType.hero) {
                (this.model.avatar as RoleAvatar).hideRoleEffect = settingData.hidePlayerEffectForce;
                this.model.setVisible(true, true);
            }
            else {
                (this.model.avatar as RoleAvatar).hideRoleEffect = settingData.HidePlayerEffect || settingData.hidePlayerEffectForce;
                if (this.mustSeen) {
                    this.model.setVisible(true, true);
                }
                else if (!this.hideFlag) {
                    this.model.setVisible(!settingData.HidePlayerModel, true);
                }
                else {
                    if (this.actionCanBeSeen || settingData.sceneHideFlag == 1) {
                        this.model.setVisible(false, true);
                    }
                    else {
                        this.model.setVisible(false, false);
                    }
                }
            }
        }

        if (this.pet) {
            this.pet.onUpdateVisible();
        }
        if (this.guoyun) {
            this.guoyun.onUpdateVisible();
        }
        if (this.lingbao) {
            this.lingbao.onUpdateVisible();
        }
        if (this.shengLing) {
            this.shengLing.onUpdateVisible();
        }
        if (this.shield) {
            this.shield.onUpdateVisible();
        }
    }

    get NameColor(): string {
        return this.nameColor;
    }

    public onStatusFight() {
        if (this.model == null) {
            return null;
        }
        (this.model.avatar as RoleAvatar).setHunHuanStatus(true);
    }
    public onStatusOutOfFight() {
        if (this.model == null) {
            return null;
        }
        (this.model.avatar as RoleAvatar).setHunHuanStatus(false);
    }
}
export default RoleController;