import { UnitController } from "System/unit/UnitController";
import { AttendantController, CheckPosCfg } from "System/unit/AttendantController";
import { RoleController } from 'System/unit/role/RoleController'
import { UnitData, RoleData } from "System/data/RoleData";
import { Global as G } from "System/global";
import { Macros } from 'System/protocol/Macros';
import { KeyWord } from 'System/constants/KeyWord'
import { Constants } from 'System/constants/Constants'
import { UnitCtrlType, EnumDir2D } from 'System/constants/GameEnum';
import { UnitStatus } from 'System/utils/UnitStatus'
import { Color } from 'System/utils/ColorUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { UnitState } from "System/unit/UnitState"
import { UnitModel } from "System/unit/UnitModel"
import { AvatarType } from "System/unit/avatar/AvatarType"
import { PetAvatar } from 'System/unit/avatar/PetAvatar'
import { MathUtil } from 'System/utils/MathUtil'
import { Profiler } from 'System/utils/Profiler'
import { PetData } from 'System/data/pet/PetData'
export class PetController extends AttendantController {

    static readonly RoleDistance: number = 90;

    static readonly BlinkDistance = 1600;

    private static readonly CkPosItvStdMine = 1;
    private static readonly CkPosItvMvMine = 0.6;
    private static readonly CkPosItvStdOth = 2.8;
    private static readonly CkPosItvMvOth = 1.4;


    private lastIdleAt: number = 0;
    get Data(): RoleData {
        return this.data as RoleData;
    }
    get Config(): GameConfig.BeautyStageM {
        return this.data.config as GameConfig.BeautyStageM;
    }
    constructor(data: UnitData) {
        super(data);
        this.checkPosCfg = new CheckPosCfg(PetController.CkPosItvStdMine, PetController.CkPosItvMvMine, PetController.CkPosItvStdOth, PetController.CkPosItvMvOth, PetController.RoleDistance, PetController.BlinkDistance, 1.4);
    }
    public onLoad() {
        this.model.initAvatar(this, AvatarType.Pet);
        this.model.selectAble = false;

        super.onLoad();
    }
    private speakTime: Game.Timer;
    private currentSpeak: GameConfig.ChatBubbleM;
    private onSpeakBegin(first: boolean = true) {
        let arr = G.DataMgr.bubbleData._dic[KeyWord.OTHER_FUNCTION_PET_JINJIE];
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
    public onDestroy() {
        super.onDestroy();
        if (this.speakTime) {
            this.speakTime.Stop();
            this.speakTime = null;
        }
    }

    protected updateAvatar() {
        let data = this.data;
        let feishengCount = this.Data.feishengCount;
        let url = G.DataMgr.petData.getPetModleID(data.id, feishengCount);
        if (url != null) {
            this.model.avatar.defaultAvatar.loadModel(this.data.unitType, url, true, true);
        }
    }


    public getAnimName(state: UnitState) {
        switch (state) {
            case UnitState.Stand:
                return "stand";
            case UnitState.Move:
                return "move";
            case UnitState.Fight:
                if (Math.random() > 0.5) {
                    return "attack1";
                }
                return "attack2";
            default:
                return null;
        }
    }
    //使用指定动画对其他目标执行攻击动作，单位状态会切换到攻击
    public attackTarget(targetPos: UnityEngine.Vector3) {
        if (this.model == null) {
            uts.assert(false, "PetController::attackTarget - 请不要对已经删除的单位进行操作");
            return null;
        }
        this.model.lookAt(targetPos);
        this.model.changeState(UnitState.Fight, true);
    }
    public onUpdateNameboard(name: string) {
        if (null == name) {
            name = this.Data.name;
        }
        let followerName: string;
        let title: string = '';
        if (null != this.followedRole) {
            followerName = this.followedRole.Data.name;
            let awakeCnt = this.Data.petAwakeCnt;
            if (awakeCnt == 0) {
                title = '';
            }
            else {
                title = TextFieldUtil.getColorText(PetData.petTitle[awakeCnt - 1], PetData.petTitleColors[awakeCnt - 1]);
            }
        } else {
            followerName = 'xx';
        }

        let nameStr = TextFieldUtil.getColorText(uts.format('{0}的伙伴\n{1}', followerName, title +name),UnitUtil.getAttendantNameColor(this));
        this.model.topTitleContainer.setTextTopTitleValue(0,nameStr);
    }
    clearFollower() {
        if (null != this.followedRole) {
            this.followedRole.pet = null;
            this.followedRole = null;
        }
    }

    onUpdateTimer(now: number) {
        if (this.model.isVisible) {
            super.onUpdateTimer(now);

            // 检查是否播放idle动作
            if (UnitState.Stand == this.state) {
                if (now - this.lastIdleAt > 10 && now - this.lastEndMoveAt > 3) {
                    this.lastIdleAt = now;
                    this.model.avatar.defaultAvatar.playAnimation("idle", 0.5);
                }
            }
        }
    }

    protected getFollowDistance(roleIsMoveing: Boolean): number {
        let distance = super.getFollowDistance(roleIsMoveing);
        //战斗最远
        if (UnitStatus.isInFight(this.followedRole.Data.unitStatus)) {
            distance = distance * 2;
        }
        return distance;
    }

    setFollowed(followedRole: RoleController): void {
        super.setFollowed(followedRole);
        followedRole.pet = this;
        if (followedRole && followedRole.Data.unitType == UnitCtrlType.hero) {
            this.onSpeakBegin();
        }
    }

    setShengQi(id: number) {
        let modelId = 0;
        if (id > 0) {
            let cfg = G.DataMgr.fabaoData.getFabaoConfig(id);
            if (null != cfg) {
                modelId = cfg.m_iModelID;
            }
        }
        (this.model.avatar as PetAvatar).updateShengQiModel(modelId);
    }
    setZhenFa(id: number) {
        (this.model.avatar as PetAvatar).updateZhenFaModel(id);
    }
}

export default PetController;