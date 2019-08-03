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
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
import { UnitState } from "System/unit/UnitState"
import { AvatarType } from "System/unit/avatar/AvatarType"
import { Profiler } from 'System/utils/Profiler'
export class ShieldGodController extends AttendantController {

    static readonly RoleDistance: number = 60;

    static readonly BlinkDistance = 1600;

    private static readonly CkPosItvStdMine = 1;
    private static readonly CkPosItvMvMine = 0.6;
    private static readonly CkPosItvStdOth = 3.6;
    private static readonly CkPosItvMvOth = 1.8;

    get Config(): GameConfig.ShieldGodCfgM {
        return this.data.config as GameConfig.ShieldGodCfgM;
    }
    constructor(data: UnitData) {
        super(data);
        this.checkPosCfg = new CheckPosCfg(ShieldGodController.CkPosItvStdMine, ShieldGodController.CkPosItvMvMine, ShieldGodController.CkPosItvStdOth, ShieldGodController.CkPosItvMvOth, ShieldGodController.RoleDistance, ShieldGodController.BlinkDistance, 1.2);
    }
    public onLoad() {

        this.model.initAvatar(this, AvatarType.Simple);
        this.coverDistance = 60;

        super.onLoad();
    }

    protected updateAvatar() {
        let url = null;
        // 精灵
        if (this.Config != null)
            url = this.Config.m_iModleID.toString();
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
    }

    updateShieldId(id: number, lv: number) {
        this.data.id = id;
        let cfg = G.DataMgr.shieldGodData.getCfg(id, lv);
        this.data.config = cfg;
        this.onAvatarChanged();
    }

    clearFollower() {
        if (null != this.followedRole) {
            this.followedRole.shield = null;
        }
    }

    setFollowed(followedRole: RoleController): void {
        super.setFollowed(followedRole);
        followedRole.shield = this;
    }
}
