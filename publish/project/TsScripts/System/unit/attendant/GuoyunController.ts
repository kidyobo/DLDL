import { UnitController } from "System/unit/UnitController";
import { UnitData } from "System/data/RoleData";
import { Global as G } from "System/global";
import { Macros } from 'System/protocol/Macros';
import { RoleController } from 'System/unit/role/RoleController'
import { AttendantController, CheckPosCfg } from 'System/unit/AttendantController'
import { Constants } from 'System/constants/Constants'
import { Color } from 'System/utils/ColorUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
import { UnitState } from "System/unit/UnitState"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { AvatarType } from "System/unit/avatar/AvatarType"
import { UnitCtrlType, EnumDir2D } from 'System/constants/GameEnum'
export class GuoyunController extends AttendantController {
    static readonly RoleDistance = 200;
    static readonly BlinkDistance = 2000;

    private static readonly m_followDistance: number = 60;

    private static readonly CkPosItvStdMine = 2;
    private static readonly CkPosItvMvMine = 1;
    private static readonly CkPosItvStdOth = 4;
    private static readonly CkPosItvMvOth = 2;
    constructor(data: UnitData) {
        super(data);
        this.checkPosCfg = new CheckPosCfg(GuoyunController.CkPosItvStdMine, GuoyunController.CkPosItvMvMine, GuoyunController.CkPosItvStdOth, GuoyunController.CkPosItvMvOth, GuoyunController.RoleDistance, GuoyunController.BlinkDistance, 1.5);
    }
    public onLoad() {
        this.model.initAvatar(this, AvatarType.Simple);

        super.onLoad();
    }

    protected updateAvatar() {
        let data = this.data;
        let url = data.id.toString();
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
        let model = this.model;
        if (null == name) {
            name = Constants.NVSHEN_NAME[this.data.id - 1];
        }
        let followerName: string;
        if (null != this.followedRole) {
            followerName = this.followedRole.Data.name;
        } else {
            followerName = 'xx';
        }
        let nameStr = TextFieldUtil.getColorText(uts.format('{0}的战车\n{1}', followerName, name), UnitUtil.getAttendantNameColor(this));
        model.topTitleContainer.setTextTopTitleValue(0, nameStr);
    }

    clearFollower() {
        if (null != this.followedRole) {
            this.followedRole.guoyun = null;
        }
    }

    setFollowed(followedRole: RoleController): void {
        super.setFollowed(followedRole);
        followedRole.guoyun = this;
    }
}
