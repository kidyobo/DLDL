import { UnitController } from "System/unit/UnitController";
import { UnitData } from "System/data/RoleData";
import { Global as G } from "System/global";
import { Macros } from 'System/protocol/Macros';
import { AttendantController, CheckPosCfg } from 'System/unit/AttendantController'
import { RoleController } from 'System/unit/role/RoleController'
import { Constants } from 'System/constants/Constants'
import { Color } from 'System/utils/ColorUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { UnitCtrlType, EnumDir2D } from 'System/constants/GameEnum';
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
import { UnitState } from "System/unit/UnitState"
import { AvatarType } from "System/unit/avatar/AvatarType"
import { Profiler } from 'System/utils/Profiler'
export class LingbaoController extends AttendantController {

    static readonly RoleDistance: number = 90;

    static readonly BlinkDistance = 1600;

    private static readonly CkPosItvStdMine = 1;
    private static readonly CkPosItvMvMine = 0.6;
    private static readonly CkPosItvStdOth = 3.6;
    private static readonly CkPosItvMvOth = 1.8;

    get Config(): GameConfig.ThingConfigM {
        return this.data.config as GameConfig.ThingConfigM;
    }
    constructor(data: UnitData) {
        super(data);
        this.checkPosCfg = new CheckPosCfg(LingbaoController.CkPosItvStdMine, LingbaoController.CkPosItvMvMine, LingbaoController.CkPosItvStdOth, LingbaoController.CkPosItvMvOth, LingbaoController.RoleDistance, LingbaoController.BlinkDistance, 1.2);
    }
    public onLoad() {
        this.model.initAvatar(this, AvatarType.Simple);
        this.model.avatar.defaultAvatar.setPosition(1, 1.3, 0);
        this.coverDistance = 60;

        super.onLoad();
    }

    protected updateAvatar() {
        let url = null;
        // 精灵
        url = this.Config.m_iModelID.toString();
        if (url != null) {
            this.model.avatar.defaultAvatar.loadModel(this.data.unitType, url, true, false);
        }
    }
    public getAnimName(state: UnitState) {
        switch (state) {
            case UnitState.Stand:
                return "stand";
            case UnitState.Move:
                return "move";
            default:
                return null;
        }
    }
    public onUpdateNameboard(name: string) {
        if (null == name) {
            name = this.Config.m_szName;
        }
        this.model.topTitleContainer.setTextTopTitleValue(0,TextFieldUtil.getColorText(name, UnitUtil.getAttendantNameColor(this)));
    }

    updateLingbaoId(id: number) {
        this.data.id = id;
        let equipCfg = ThingData.getThingConfig(id);
        this.data.config = equipCfg;
        this.onAvatarChanged();
    }

    clearFollower() {
        if (null != this.followedRole) {
            this.followedRole.lingbao = null;
        }
    }

    setFollowed(followedRole: RoleController): void {
        super.setFollowed(followedRole);
        followedRole.lingbao = this;
    }
}
