import { EnumDir2D, UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { RoleData } from "System/data/RoleData";
import { ThingData } from "System/data/thing/ThingData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { PetController } from "System/unit/attendant/PetController";
import { AttendantController } from "System/unit/AttendantController";
import { DropThingController } from "System/unit/dropThing/DropThingController";
import { MonsterController } from "System/unit/monster/MonsterController";
import { RoleController } from "System/unit/role/RoleController";
import { UnitController } from "System/unit/UnitController";
import { CampRelation } from "System/utils/CampRelation";
import { Color } from "System/utils/ColorUtil";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { UnitStatus } from "System/utils/UnitStatus";

export class UnitUtil {
    private static modelType2ctrlTypeMap: { [type: number]: UnitCtrlType } = {};
    private static dir2d23dMap: { [dir2d: number]: number } = {};

    static initStaticMaps() {
        let map = UnitUtil.modelType2ctrlTypeMap;
        map[KeyWord.MODEL_FOLDER_MONSTER] = UnitCtrlType.monster;
        map[KeyWord.MODEL_FOLDER_COLLECT] = UnitCtrlType.collection;
        map[KeyWord.MODEL_FOLDER_LINGBAO] = UnitCtrlType.lingbao;
        map[KeyWord.MODEL_FOLDER_MOUNT] = UnitCtrlType.ride;
        map[KeyWord.MODEL_FOLDER_NPC] = UnitCtrlType.npc;
        map[KeyWord.MODEL_FOLDER_BOSS] = UnitCtrlType.boss;
        map[KeyWord.MODEL_FOLDER_PET] = UnitCtrlType.pet;

        let dirMap = UnitUtil.dir2d23dMap;
        dirMap[0] = 135;
        dirMap[EnumDir2D.RIGHT_DOWN] = 135;
        dirMap[EnumDir2D.RIGHT] = 90;
        dirMap[EnumDir2D.UP_RIGHT] = 45;
        dirMap[EnumDir2D.UP] = 0;
        dirMap[EnumDir2D.LEFT_UP] = -45;
        dirMap[EnumDir2D.LEFT] = -90;
        dirMap[EnumDir2D.DOWN_LEFT] = -135;
        dirMap[EnumDir2D.DOWN] = 180;
    }

    public static getRealMonsterType(type: number): UnitCtrlType {
        let unitType = UnitUtil.modelType2ctrlTypeMap[type];
        if (undefined == unitType) {
            unitType = UnitCtrlType.monster;
        }
        return unitType;
    }
    /**
     * 是否boss
     * @param dignity
     * @return
     *
     */
    public static isBoss(dignity: number): boolean {
        if (dignity == KeyWord.MONSTER_TYPE_BOSS ||
            dignity == KeyWord.MONSTER_TYPE_LEVELUP_BOSS ||
            dignity == KeyWord.MONSTER_TYPE_PVPBOSS ||
            dignity == KeyWord.MONSTER_TYPE_HEADER) {
            return true;
        }

        return false;
    }

    /**
	* 取得两点之间的方向
	* @param _arg2
	* @param _arg1
	* @param maxDir
	* @return
	*
	*/
    static getDirection3D(arg2X: number, arg2Y: number, arg1X: number, arg1Y: number): number {
        let subx: number = arg2X - arg1X;
        let suby: number = arg2Y - arg1Y;
        let d: number = 270 - Math.atan2(suby, subx) * 57;

        return d; //getDirectionByDegree(d, maxDir);
    }

    static dir2Dto3D(direction: EnumDir2D): number {
        let dir3D = UnitUtil.dir2d23dMap[direction];
        if (undefined == dir3D) {
            dir3D = 0;
        }
        return dir3D;
    }

    /**
	* 3D方向转2D 8方向
	* @param dir
	* @return
	*
	*/
    static getDir3DTo2D(dir: number): EnumDir2D {
        if (dir > 360 || dir < 0) {
            dir = dir - Math.floor(dir / 360) * 360;
        }

        if (dir >= 23 && dir < 203) {
            if (dir < 68) {
                return EnumDir2D.DOWN_LEFT;
            }
            else if (dir >= 68 && dir < 113) {
                return EnumDir2D.LEFT;
            }
            else if (dir >= 113 && dir < 158) {
                return EnumDir2D.LEFT_UP;
            }
            else if (dir >= 158) {
                return EnumDir2D.UP;
            }
        }
        else {
            if (dir >= 203 && dir < 248) {
                return EnumDir2D.UP_RIGHT;
            }
            else if (dir >= 248 && dir < 293) {
                return EnumDir2D.RIGHT;
            }
            else if (dir >= 293 && dir < 337) {
                return EnumDir2D.RIGHT_DOWN;
            }
            else if ((dir > 0 && dir < 23) || (dir <= 0 && dir >= 337)) {
                return EnumDir2D.DOWN;
            }
        }

        return EnumDir2D.DOWN;
    }

    static getRoleNameColor(ctrl: RoleController): string {
        let color = Color.GREEN;
        if (UnitCtrlType.role == ctrl.Data.unitType) {
            // 他人，阵营模式是要显示红名的
            let heroData = G.DataMgr.heroData;
            let pkMode = heroData.pkMode;
            if (pkMode == Macros.PK_STATUS_ARMY || pkMode == Macros.PK_STATUS_ZONE) {
                if (heroData.armyID != ctrl.Data.armyID) {
                    color = Color.RED;
                }
                else {
                    color = Color.NAME_WHITE;
                }
            }
            else if (pkMode == Macros.PK_STATUS_TEAM) {
                if (heroData.teamId == -1 || heroData.teamId != ctrl.Data.teamId) {
                    color = Color.RED;
                }
                else {
                    color = Color.NAME_WHITE;
                }
            }
            else if (pkMode == Macros.PK_STATUS_ALL || ctrl.Data.pkValue >= Macros.MIN_EVIL_VAL || (pkMode == Macros.PK_STATUS_GUILD && (ctrl.Data.guildId != heroData.guildId || ctrl.Data.guildId + heroData.guildId == 0))) {
                color = Color.RED;
            }
            else {
                color = Color.NAME_WHITE;
            }
        }
        return color;
    }

    static getAttendantNameColor(ctrl: AttendantController): string {
        let color = Color.NAME_WHITE;
        // 美人、精灵、宝物、国运船
        let f = ctrl.followedRole;
        if (null != f) {
            color = f.NameColor;
        }
        return color;
    }

    static getMonsterNameColor(ctrl: MonsterController): string {
        let color = Color.NAME_WHITE;
        // 怪物
        if (ctrl.Data.petMonsterInfo) {
            // 伙伴怪，只要不是我的就是敌人
            if (G.DataMgr.heroData.unitID == ctrl.Data.petMonsterInfo.m_iMasterUnitID) {
                color = Color.GREEN;
            } else {
                color = Color.RED;
            }
        } else {
            if (UnitUtil.isEnemy(ctrl)) // 敌对怪物
            {
                // 主动攻击怪名称默认为红色，被动攻击怪默认为黄色
                if (UnitStatus.isActiveAttack(ctrl.Data.unitStatus) || UnitStatus.isInFight(ctrl.Data.unitStatus)) {
                    color = Color.NAME_RED;
                } else {
                    color = Color.NAME_YELLOW;
                }
            }
            else if (CampRelation.isFriend(ctrl)) // 友方怪物名称为绿色
            {
                color = Color.NAME_GREEN;
            }
        }
        return color;
    }

    static getDropNameColor(ctrl: DropThingController): string {
        // 掉落物
        if (GameIDUtil.isEquipmentID(ctrl.Data.id) || GameIDUtil.isAvatarID(ctrl.Data.id)) {
            return Color.getColorById(ctrl.Data.info.m_ucThingColor);
        } else {
            return Color.getColorById(ctrl.Config.m_ucColor);
        }
    }

    static isRole(unit: UnitController): boolean {
        return UnitCtrlType.role == unit.Data.unitType || UnitCtrlType.hero == unit.Data.unitType;
    }

    static isMonster(unit: UnitController): boolean {
        return UnitCtrlType.monster == unit.Data.unitType || UnitCtrlType.collection == unit.Data.unitType;
    }

    static isAttendant(unit: UnitController): boolean {
        return UnitCtrlType.pet == unit.Data.unitType || UnitCtrlType.lingbao == unit.Data.unitType || UnitCtrlType.faqi == unit.Data.unitType || UnitCtrlType.guoyunGoods == unit.Data.unitType;
    }

    /**
     * 是否可以攻击的unit类型。
     * @param unitCtrlType
     */
    static canUnitTypeBeAttacked(unitCtrlType: UnitCtrlType): boolean {
        return UnitCtrlType.monster == unitCtrlType || UnitCtrlType.role == unitCtrlType || UnitCtrlType.collection == unitCtrlType;
    }

    /**
	* 是否是敌人
	* @param role
	* @return
	*
	*/
    static isEnemy(unit: UnitController): boolean {
        if (null == unit || null == unit.Data) {
            return false;
        }

        let hero = G.UnitMgr.hero;
        if (hero == unit) {
            return false;
        }

        if (UnitUtil.isMonster(unit)) {
            // 宗门争霸战 tagid 特殊使用
            let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
            if (curPinstanceID == Macros.PINSTANCE_ID_GUILDPVP ||
                curPinstanceID == Macros.PINSTANCE_ID_GUILDPVP_CROSS ||
                curPinstanceID == Macros.PINSTANCE_ID_ZZHC) {
                // 跨服夺城副本里，怪物的tagID 于自己的宗门id相同 则为友好
                return (unit.Data as RoleData).monsterTagID != hero.Data.guildId;
            }
            else if ((unit.Data as RoleData).armyID > 0) {
                return hero.Data.armyID != (unit.Data as RoleData).armyID;
            }
            else {
                //怪根据阵营关系
                return CampRelation.isEnemy(unit);
            }
        }
        else if (UnitUtil.isRole(unit)) {
            if ((unit.Data as RoleData).monsterRoleId > 0) {
                return true;
            }

            // if ((unit.Data as RoleData).pkMode == Macros.PK_STATUS_PEACE) {
            //     return false;
            // }
            if (hero.Data.pkMode == Macros.PK_STATUS_PEACE) {
                return false;
            }

            // 使用PVP关系进行判断
            let pkMode = hero.Data.pkMode;
            if (pkMode == Macros.PK_STATUS_ALL) {
                return true;
            } else if (pkMode == Macros.PK_STATUS_GUILD) {
                return hero.Data.guildId == 0 || hero.Data.guildId != (unit.Data as RoleData).guildId;
            } else if (pkMode == Macros.PK_STATUS_TEAM) {
                return (!G.DataMgr.teamData.hasTeam || !G.DataMgr.teamData.isMyTeamMember((unit.Data as RoleData).roleID));
            } else if (pkMode == Macros.PK_STATUS_EVIL) {
                return (unit.Data as RoleData).pkValue >= Macros.MIN_EVIL_VAL;
            } else if (pkMode == Macros.PK_STATUS_ARMY || pkMode == Macros.PK_STATUS_ZONE) {
                return hero.Data.armyID != (unit.Data as RoleData).armyID;
            }
        }
        else if (UnitCtrlType.pet == unit.Data.unitType) {
            let petCtrl = unit as PetController;
            if (null != petCtrl.followedRole) {
                return UnitUtil.isEnemy(petCtrl.followedRole);
            }
        }

        return false;
    }

    /**
     * 判断是否友好关系，跟好友无关。好友关系使用<code>FriendModule</code>判断。
     * @param role
     * @param isPVP
     * @return
     *
     */
    static isFriendly(unit: UnitController, pvpType: number): boolean {
        if (null == unit || null == unit.Data) {
            return false;
        }

        let hero = G.UnitMgr.hero;
        if (hero == unit) {
            return true;
        }

        if (UnitUtil.isMonster(unit)) {
            // 宗门争霸战 tagid 特殊使用
            let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
            if (curPinstanceID == Macros.PINSTANCE_ID_GUILDPVP || curPinstanceID == Macros.PINSTANCE_ID_GUILDPVP_CROSS) {
                // 跨服夺城副本里，怪物的tagID 于自己的宗门id相同 则为友好
                return hero.Data.guildId > 0 && (unit.Data as RoleData).monsterTagID == hero.Data.guildId;
            }
            else if ((unit.Data as RoleData).armyID > 0) {
                return hero.Data.armyID == (unit.Data as RoleData).armyID;
            }
            else {
                //怪根据阵营关系
                return CampRelation.isFriend(unit);
            }
        }
        else if (UnitUtil.isRole(unit)) {
            // 使用PVP关系进行判断
            if (pvpType > 0) {
                let roleData = unit.Data as RoleData;
                if (KeyWord.PVP_TEAM == pvpType) {
                    return G.DataMgr.teamData.isMyTeamMember(roleData.roleID);
                }
                else if (KeyWord.PVP_GUILD == pvpType) {
                    return (hero.Data.guildId > 0 && roleData.guildId > 0 && hero.Data.guildId == roleData.guildId);
                } else {
                    return false;
                }
            }
            return CampRelation.isFriend(unit);
        }
        else if (unit.Data.unitType == UnitCtrlType.pet) {
            let petCtrl = unit as PetController;
            if (null != petCtrl.followedRole) {
                return UnitUtil.isFriendly(petCtrl.followedRole, pvpType);
            }
        }

        return false;
    }

    /**
  * 判断是否友好关系，包括中立对象。
  * @param role
  * @return
  *
  */
    static isFriendTargetBySelect(unit: UnitController): boolean {
        if (null == unit || null == unit.Data) {
            return false;
        }

        let hero = G.UnitMgr.hero;
        if (hero == unit) {
            return true;
        }

        if (UnitUtil.isMonster(unit)) {
            // 宗门争霸战 tagid 特殊使用
            let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
            if (curPinstanceID == Macros.PINSTANCE_ID_GUILDPVP || curPinstanceID == Macros.PINSTANCE_ID_GUILDPVP_CROSS) {
                // 跨服夺城副本里，怪物的tagID 于自己的宗门id相同 则为友好
                return hero.Data.guildId > 0 && (unit.Data as RoleData).monsterTagID == hero.Data.guildId;
            }
            else if ((unit.Data as RoleData).armyID > 0) {
                return hero.Data.armyID == (unit.Data as RoleData).armyID;
            }
            else {
                //怪根据阵营关系
                return CampRelation.isFriend(unit);
            }
        }
        else if (UnitUtil.isRole(unit)) {
            return CampRelation.isFriend(unit);
        }
        return true;
    }

    static isNeutral(role: UnitController): boolean {
        if (role == null || role.Data == null) {
            return false;
        }
        return CampRelation.getMyRelation((role.Data as RoleData).campID) == KeyWord.CAMP_RELATION_NEUTRAL;
    }

    static isMyPetMonster(unit: UnitController): boolean {
        if (unit.Data.unitType == UnitCtrlType.monster) {
            let monster = unit as MonsterController;
            if (monster.Data.petMonsterInfo) {
                return monster.Data.petMonsterInfo.m_iMasterUnitID == G.DataMgr.heroData.unitID;
            }
        }
        return false;
    }

    static isOtherPetMonster(unit: UnitController): boolean {
        if (unit.Data.unitType == UnitCtrlType.monster) {
            let monster = unit as MonsterController;
            if (monster.Data.petMonsterInfo) {
                return monster.Data.petMonsterInfo.m_iMasterUnitID != G.DataMgr.heroData.unitID;
            }
        }
        return false;
    }

    /**
     * 获取时装模型ID
     * @param avataList 数据对象
     * @param prof		职业
     * @param gender	性别
     * @return 			有返回表示有数据，没有回发生报错
     *
     */
    static getDressModelName(dressImageID: number, prof: number, gender: number, colorIndex: number = 0): string {
        if (dressImageID > 0) {
            let cfg: GameConfig.DressImageConfigM = ThingData.getDressImageConfig(dressImageID);
            if (cfg == null) {
                cfg = ThingData.getDressImageData(prof, gender, dressImageID);
                uts.assert(cfg != null, "时装ID不存在" + dressImageID);
            }
            return cfg.m_stModel.length > 0 && cfg.m_stModel[colorIndex].m_iID > 0 ? cfg.m_stModel[colorIndex].m_iID.toString() : '0';
        }
        return this.getDefualtModel(prof, gender);
    }
    public static getDefualtModel(prof: number, gender: number): string {
        if (prof == KeyWord.PROFTYPE_WARRIOR) {
            return gender == KeyWord.GENDERTYPE_BOY ? G.DataMgr.defaultValue.getValue("nandao") : G.DataMgr.defaultValue.getValue("nvdao");
        }
        else if (prof == KeyWord.PROFTYPE_HUNTER) {
            return gender == KeyWord.GENDERTYPE_BOY ? G.DataMgr.defaultValue.getValue("nanjian") : G.DataMgr.defaultValue.getValue("nvjian");
        }
        return "";
    }

    static getAvatarModelID(thingID: number, subType: number): number {
        let modelID = 0;
        let zfConfig = G.DataMgr.zhufuData.getConfig(subType, thingID);
        if (zfConfig != null) {
            modelID = zfConfig.m_iModelID;
        } else {
            let imageConfig = G.DataMgr.zhufuData.getImageConfig(thingID);
            if (imageConfig != null) {
                modelID = imageConfig.m_iModelID;
            }
        }
        return modelID;
    }

    static getWingAvatarModelID(thingID: number, subType: number): number {
        let modelID = 0;
        let imageConfig = G.DataMgr.zhufuData.getImageConfig(thingID);
        if (imageConfig != null) {
            modelID = imageConfig.m_iModelID;
        }
        return modelID;
    }
}