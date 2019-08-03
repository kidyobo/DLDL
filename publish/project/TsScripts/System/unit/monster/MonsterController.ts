import { UnitController } from "System/unit/UnitController";
import { MonsterFakeAI } from 'System/unit/monster/MonsterFakeAI'
import { UnitData, RoleData } from "System/data/RoleData";
import { Global as G } from "System/global";
import { Macros } from 'System/protocol/Macros';
import { UnitCtrlType, EnumBloodType } from 'System/constants/GameEnum';
import { Color } from 'System/utils/ColorUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { BuffData } from 'System/data/BuffData'
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
import { KeyWord } from 'System/constants/KeyWord'
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { AvatarType } from "System/unit/avatar/AvatarType"
import { SimpleAvatar } from 'System/unit/avatar/SimpleAvatar'
import { UnitStatus } from 'System/utils/UnitStatus'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'

export class MonsterController extends UnitController {
    private static readonly HurtShowBloodTime = 3;

    private killDelayAt = 0;
    private killLookAt: UnityEngine.Vector3;

    private realType: UnitCtrlType;
    public get Data() {
        return this.data as RoleData;
    }
    public m_isBoss: boolean;
    private fakeAI: MonsterFakeAI;
    public get Config(): GameConfig.MonsterConfigM {
        return this.data.config as GameConfig.MonsterConfigM;
    }
    private loaded: boolean = false;
    private showName = false;
    private friendType: EnumBloodType = EnumBloodType.red;
    public onLoad() {
        // 怪物
        let type = (this.data.config as GameConfig.MonsterConfigM).m_ucModelFolder;
        this.realType = UnitUtil.getRealMonsterType(type);

        this.model.initAvatar(this, AvatarType.Simple);

        // 默认不显示名字板和血条
        this.showName = this.isAlwaysShowNameBlood();
        if (this.showName) {
            this.onUpdateNameboard(null);
            this.updateBlood();
        }
        this.m_isBoss = UnitUtil.isBoss(this.Config.m_bDignity);
        G.UnitMgr.unitCreateQueue.add(this);
    }
    public onLoadModel() {
        this.loaded = true;
        let dignity = this.Config.m_bDignity;
        this.model.selectAble = 1 == this.Config.m_ucIsBeSelected;
        let scale = 1;
        if (this.Config.m_ucUnitScale > 0) {
            scale = this.Config.m_ucUnitScale / 100;
        }
        this.model.setScale(scale);

        this.model.showShadow(true, false);
        this.onUpdateVisible();
        this.updateAvatar();
        let simpleAvatar = this.model.avatar as SimpleAvatar;
        if (this.m_isBoss == true) {
            simpleAvatar.defaultAvatar.setCullingMode(UnityEngine.AnimatorCullingMode.AlwaysAnimate);
            this.onSpeakBegin();
        }
        if (dignity == KeyWord.MONSTER_TYPE_BOSS || dignity == KeyWord.MONSTER_TYPE_PVPBOSS) {
            simpleAvatar.showCircle(true);
        }
    }
    public updateAvatar(): void {
        let b = this.buffProxy.getChangeAvatarBuff();
        if (null == b) {
            this.cancelChangeAvatar();
        } else {
            this.changeAvatarByBuff(b);
        }
    }
    public changeAvatarByBuff(buffCfg: GameConfig.BuffConfigM) {
        let simpleAvatar = this.model.avatar as SimpleAvatar;
        simpleAvatar.defaultAvatar.loadModel(this.realType, buffCfg.m_szChangeAvatar, true, true);
    }
    public cancelChangeAvatar() {
        let pmi = this.Data.petMonsterInfo;
        if (null == pmi) {
            let simpleAvatar = this.model.avatar as SimpleAvatar;
            simpleAvatar.defaultAvatar.loadModel(this.realType, (this.data.config as GameConfig.MonsterConfigM).m_szModelID, true, true);
        } else {
            // 这是伙伴怪
            this.change2pet(pmi.m_iPetID, pmi.m_ucFeiShengCount, pmi.m_szOwnerName);
        }
    }

    public onDestroy() {
        if (this.speakTime) {
            this.speakTime.Stop();
            this.speakTime = null;
        }
        if (!this.loaded) {
            G.UnitMgr.unitCreateQueue.remove(this);
        }
        if (null != this.fakeAI) {
            this.fakeAI.destroy();
            this.fakeAI = null;
        }
        this.killDelayAt = 0;
        this.killLookAt = null;
    }
    public onMoveEnd(byStop: boolean) { }

    onUpdateTimer(now: number) {
        super.onUpdateTimer(now);

        if (this.killDelayAt > 0 && now >= this.killDelayAt) {
            this.doKill();
        }
        if (this.Data.lastHurtAt > 0 && now - this.Data.lastHurtAt > MonsterController.HurtShowBloodTime && this != G.UnitMgr.SelectedUnit) {
            this.hideNameBlood();
        }
    }

    public onHit() {
        if (this.m_isBoss) {
            return;
        }

        if (null == this.model) {
            return;
        }
        if (this.model.selectAble == true) {
            let avatar = this.model.avatar;
            if (this.realType == UnitCtrlType.monster) {
                if (this.cancelAble) {
                    avatar.defaultAvatar.playAnimation("behit", 0.1);
                }
            }

            this.showName = true;
            this.updateBlood();
            this.Data.lastHurtAt = UnityEngine.Time.realtimeSinceStartup;
        }
    }

    public onDead() {
        // 停止ai
        if (null != this.fakeAI) {
            this.fakeAI.reset();
        }
        this.Data.lastHurtAt = 0;
        this.model.selectAble = false;
        this.hideNameBlood();

        this.destroy(true, this.Config.m_iDeadTime+1);
    }


    public onUpdateNameboard(name: string) {
        if (this.Config.m_ucIsDisplayName != KeyWord.SHOWNAME_TYPE_NO) {
            let pmi = this.Data.petMonsterInfo;
            if (pmi) {
                // 伙伴怪
                name = uts.format('{0}的伙伴\n{1}', pmi.m_szOwnerName, this.Data.name);
            } else {
                if (null == name) {
                    // 加上称号
                    if (null != this.Data.monsterTitle && '' != this.Data.monsterTitle) {
                        name = uts.format('{0}{1}({2}级)', this.Data.monsterTitle, this.Config.m_szMonsterName, this.Config.m_usLevel);
                    }
                    else if (null != this.Data.name && '' != this.Data.name) {
                        name = this.Data.name;
                    }
                    else {
                        name = uts.format('{0}({1}级)', this.Config.m_szMonsterName, this.Config.m_usLevel);
                    }
                }
            }
            this.model.topTitleContainer.setTextTopTitleValue(0, TextFieldUtil.getColorText(name, UnitUtil.getMonsterNameColor(this)));
        }
    }
    public getAnimName(state: UnitState): string {
        switch (state) {
            case UnitState.Stand:
                return "stand";
            case UnitState.Move:
                return "move";
            case UnitState.Dead:
                if (this.realType == UnitCtrlType.monster) {
                    return "dead";
                }
                else if (this.realType == UnitCtrlType.boss) {
                    return "dead";
                }
                else {
                    return null;
                }
            case UnitState.Fight:
                if (this.realType == UnitCtrlType.monster) {
                    return "attack";
                }
                else {
                    if (Math.random() > 0.5) {
                        return "attack1";
                    }
                    else {
                        return "attack2";
                    }
                }
            case UnitState.Born:

        }
        return null;
    }

    public onAddBuff(buffInfo: Protocol.BuffInfo) {
        //// boss 吟唱
        //let buffConfig: GameConfig.BuffConfigM = BuffData.getBuffByID(buffInfo.m_iBuffID);
        //if (BuffData.isBuffHaveBossSing(buffConfig)) {
        //    this.changeDirection(UnitUtil.dir2Dto3D(buffInfo.m_ucBuffDirection));
        //    // 固定方向
        //    this.m_fixedDir = true;
        //}
        //else if (BuffData.haveStoneEffect(buffConfig)) {
        //    // 石化
        //    m_bodyAnim.gray = true;
        //}
    }
    public onDeleteBuff(buffId: number) {
        //let buffConfig: GameConfig.BuffConfigM = BuffData.getBuffByID(buffId);
        //if (BuffData.isBuffHaveBossSing(buffConfig)) {
        //    // 取消固定方向
        //    this.m_fixedDir = false;
        //}
        //else if (BuffData.haveStoneEffect(buffConfig)) {
        //    m_bodyAnim.gray = false;
        //}
    }
    //使用指定动画对其他目标执行攻击动作，单位状态会切换到攻击
    public attackTarget(targetPos: UnityEngine.Vector3) {
        if (this.model == null) {
            uts.assert(false, "MonsterController::attackTarget - 请不要对已经删除的单位进行操作");
            return null;
        }
        this.model.lookAt(targetPos);
        this.model.changeState(UnitState.Fight, true);
    }
    public kill(killer: UnitController, delay: number) {
        if (killer != null) {
            this.killLookAt = killer.getWorldPosition();
        } else {
            this.killLookAt = null;
        }

        if (0 == delay) {
            this.doKill();
        } else {
            this.killDelayAt = UnityEngine.Time.realtimeSinceStartup + delay;
        }
    }

    private doKill() {
        if (this.model == null) {
            uts.assert(false, "MonsterController::doKill - 请不要对已经删除的单位进行操作");
            return null;
        }
        this.killDelayAt = 0;
        if (this.killLookAt != null) {
            this.model.lookAt(this.killLookAt);
            this.killLookAt = null;
        }
        this.model.changeState(UnitState.Dead);
        this.onDead();
    }

    public isAlwaysShowNameBlood(): boolean {
        return (KeyWord.SHOWNAME_TYPE_YES_PERMENANT == this.Config.m_ucIsDisplayName);
    }

    onSelected() {
        this.showName = true;
        if (KeyWord.SHOWNAME_TYPE_NO != this.Config.m_ucIsDisplayName) {
            this.onUpdateNameboard(null);
        }
        this.friendType = UnitUtil.isFriendly(this, 0) ? EnumBloodType.green : EnumBloodType.red;
        this.updateBlood();
    }

    onUnselected() {
        this.hideNameBlood();
    }

    private hideNameBlood() {
        this.showName = false;
        this.model.topTitleContainer.setTextTopTitleValue(0, null);
        if (this.Data.lastHurtAt <= 0 || UnityEngine.Time.realtimeSinceStartup - this.Data.lastHurtAt > MonsterController.HurtShowBloodTime) {
            this.model.topTitleContainer.setBloodTopTitleValue(-1, EnumBloodType.red);
        }
    }

    born() {
        if (UnitUtil.isBoss(this.Config.m_bDignity)) {
            // boss没有出生动作
            this.model.changeState(UnitState.Stand);
        } else {
            this.model.changeState(UnitState.Born);
        }
    }
    /**
     * 前台怪ai。
     */
    startFakeAI(): void {
        if (!this.cancelAble) {
            return;
        }

        if (null == this.fakeAI) {
            this.fakeAI = new MonsterFakeAI();
        }
        this.fakeAI.start(this);
    }

    /**
     * 怪物变身为伙伴
     * @param petCfg
     * @param followerName
     */
    change2pet(petId: number, feiShengCnt: number, followerName: string) {
        let model = this.model;
        if (model == null) {
            uts.assert(false, "MonsterController::change2pet - 请不要对已经删除的单位进行操作");
            return null;
        }
        model.avatar.defaultAvatar.loadModel(UnitCtrlType.pet, G.DataMgr.petData.getPetModleID(petId, feiShengCnt), true, true);
        model.selectAble = false;
        this.onUpdateNameboard(null);
    }

    //当前单位是否可以取消当前动作
    public get cancelAble(): boolean {
        let state = this.model.state;
        if (state == UnitState.Move) {
            return false;
        }
        if (UnitStatus.isDead(this.data.unitStatus)) {
            return false;
        }
        return true;
    }
    onHPChanged() {
        if (this.showName) {
            this.updateBlood();
        }
    }
    private updateBlood() {
        let curHp = this.data.getProperty(Macros.EUAI_CURHP);
        let maxHp = this.data.getProperty(Macros.EUAI_MAXHP);
        this.model.topTitleContainer.setBloodTopTitleValue(curHp / maxHp, this.friendType);
    }
    //自动气泡
    private speakTime: Game.Timer;
    private currentSpeak: GameConfig.ChatBubbleM;
    private onSpeakBegin(first: boolean = true) {
        let arr = G.DataMgr.bubbleData._dic[this.Config.m_iMonsterID];
        if (!arr || arr.length == 0) {
            return;
        }
        this.currentSpeak = arr[Math.floor(Math.random() * arr.length)];
        let time = first ? this.currentSpeak.m_initTime * 100 : 0;
        if (!this.speakTime) {
            this.speakTime = new Game.Timer("speakTimer", time, 1, delegate(this, this.onSpeak));
        }
        else {
            this.speakTime.ResetTimer(time, 1, delegate(this, this.onSpeak));
        }
    }
    private onSpeak() {
        this.model.topTitleContainer.setBubbleTopTitleValue(this.currentSpeak.m_value);
        this.speakTime.ResetTimer(this.currentSpeak.m_maintain * 100, 1, delegate(this, this.onSpeakEnd));
    }
    private onSpeakEnd() {
        this.model.topTitleContainer.setBubbleTopTitleValue(null);
        this.speakTime.ResetTimer(this.currentSpeak.m_nextTime * 100, 1, delegate(this, this.onSpeakBegin, false));
    }
    //
    public onUpdateVisible() {
        let settingData = G.DataMgr.settingData;
        let forceHide = settingData.hideMonstersForce;
        if (forceHide) {
            this.model.showShadow(false, false);
        }
        if (this.Config.m_bDignity == KeyWord.MONSTER_TYPE_NORMAL && settingData.HideMonsters &&
            settingData.sceneHideFlag != 2) {
            this.model.setVisible(false, !forceHide);
        }
        else {
            this.model.setVisible(!forceHide, !forceHide);
        }
    }
}
export default MonsterController;