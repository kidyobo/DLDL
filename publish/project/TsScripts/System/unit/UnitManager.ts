import { Constants } from "System/constants/Constants";
import { EnumTargetValidation, UnitCtrlType, EnumSceneID, EnumBuff } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { MonsterData } from "System/data/MonsterData";
import { PetData } from "System/data/pet/PetData";
import { PinstanceData } from "System/data/PinstanceData";
import { DropUnitData, HeroData, RoleData, UnitData } from "System/data/RoleData";
import { GateInfo } from "System/data/scene/GateInfo";
import { NPCInfo } from "System/data/scene/NPCInfo";
import { ThingData } from "System/data/thing/ThingData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { GuoyunController } from "System/unit/attendant/GuoyunController";
import { ShieldGodController } from "System/unit/attendant/ShieldGodController";
import { LingbaoController } from "System/unit/attendant/LingbaoController";
import { ShengLingController } from 'System/unit/attendant/ShengLingController'
import { PetController } from "System/unit/attendant/PetController";
import { RoleAvatar } from "System/unit/avatar/RoleAvatar";
import { DropThingController } from "System/unit/dropThing/DropThingController";
import { CoinsController } from "System/unit/effects/CoinsController";
import { ScriptEffectController } from "System/unit/effects/ScriptEffectController";
import { TeleportEffectController } from "System/unit/effects/TeleportEffectController";
import { HeroController } from "System/unit/hero/HeroController";
import { CollectMonsterController } from "System/unit/monster/CollectMonsterController";
import { MonsterController } from "System/unit/monster/MonsterController";
import { NpcController } from "System/unit/npc/NpcController";
import { RoleController } from "System/unit/role/RoleController";
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum";
import { UnitController } from "System/unit/UnitController";
import { UnitCreateQueue } from "System/unit/UnitCreateQueue";
import { CompareUtil } from "System/utils/CompareUtil";
import { TimeInterval } from "System/utils/TimeInterval";
import { UnitStatus } from "System/utils/UnitStatus";
import { UnitUtil } from "System/utils/UnitUtil";
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { AttendantController } from "./AttendantController";
import { SettingData } from 'System/data/SettingData'
import { TeamData } from 'System/data/TeamData'
import { Profiler } from 'System/utils/Profiler'
export class UnitManager {
    public isActive: boolean = true;
    public maxShowCount: number = 1;
    public unitCreateQueue: UnitCreateQueue = new UnitCreateQueue();
    //单位管理器顶节点
    public gameObject: UnityEngine.GameObject;
    public transform: UnityEngine.Transform;

    //单位管理器的摄像机
    private follower: Game.UnitFollower;
    public get heroFollower() {
        return this.follower;
    }
    private _hero: HeroController = null;
    //主角，摄像机跟随对象
    get hero(): HeroController {
        return this._hero;
    }

    //单位字典
    private unitList: { [index: number]: UnitController } = {};
    public get AllUnits(): { [index: number]: UnitController } {
        return this.unitList;
    }

    //NPC字典
    private npcDataList: { [id: number]: NPCInfo } = {};
    public get AllNPC() {
        return this.npcDataList;
    }

    //传送点字典
    private teleportMap: { [tpId: number]: TeleportEffectController } = {};

    private scriptEffectMap: { [key: string]: ScriptEffectController } = {};

    private coins: CoinsController[] = [];
    private coinsPool: CoinsController[] = [];

    //用于让摄像机跟随某个单位
    private selectionFollower: Game.UnitFollower;

    //单位选择相关
    private selectedUnit: UnitController;
    public get SelectedUnit() {
        return this.selectedUnit;
    }
    /**伪unitID，负值，用于前台怪等。*/
    private m_fakeUnitID: number = 0;
    private updateTimer: Game.Timer;

    private clientMonster2QuestId: { [unitID: number]: number } = {};

    private roleList: RoleController[] = [];
    get RoleList() {
        return this.roleList;
    }
    private monsterList: MonsterController[] = [];
    get MonsterList() {
        return this.monsterList;
    }
    private collectMonsterList: CollectMonsterController[] = [];
    get CollectMonsterList() {
        return this.collectMonsterList;
    }
    private dropList: DropThingController[] = [];
    get DropList() {
        return this.dropList;
    }

    private settingData: SettingData;
    private teamData: TeamData;

    public init() {
        this.settingData = G.DataMgr.settingData;
        this.teamData = G.DataMgr.teamData;

        this.gameObject = new UnityEngine.GameObject("Units");
        this.transform = this.gameObject.transform;

        this.follower = UnityEngine.GameObject.Find("Root/MoveRoot").GetComponent(Game.UnitFollower.GetType()) as Game.UnitFollower;
        this.follower.yOffset = 2.05;

        this.updateTimer = new Game.Timer("unit update", 100, 0, delegate(this, this.onUpdateTimer));
    }
    setActive(value: boolean) {
        this.gameObject.SetActive(value);
    }
    private updateTag = 1;
    private onUpdateTimer(timer: Game.Timer) {
        if (!G.DataMgr.sceneData.isEnterSceneComplete) {
            return;
        }
        this.unitCreateQueue.update();

        this.updateTag++;
        if (this.updateTag % 2 == 0) {
            let now = UnityEngine.Time.realtimeSinceStartup;
            for (let unitIDKey in this.unitList) {
                let unitCtrl = this.unitList[unitIDKey];
                unitCtrl.onUpdateTimer(now);
            }
            let unit = this.selectedUnit;
            if (unit != null && unit.Data.unitType != UnitCtrlType.monster && !unit.model.isShadowVisible) {
                this.unselectUnit(0, false);
            }
            if (this.settingData.sceneHideFlag != 2) {
                // 自动捡掉落
                if (this.dropList.length > 0) {
                    let hero = this._hero;
                    if (hero != null && hero.Data.isAlive) {
                        let heroPos = hero.getPixelPosition();
                        for (let dropThing of this.dropList) {
                            if (!dropThing.canGet || (now - dropThing.lastPickTime) < 2) {
                                continue;
                            }
                            var pixelPos = dropThing.getPixelPosition();
                            let disx = pixelPos.x - heroPos.x;
                            let disy = pixelPos.y - heroPos.y;
                            let dis = disx * disx + disy * disy;
                            if (dis < 4000) {
                                dropThing.lastPickTime = now;
                                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDropThingRequest(dropThing.Data.unitID));
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (this.updateTag > 100) {
            this.updateTag = 0;
        }
    }
    /**
    * 清空所有的元素，保留伙伴及其散仙
    *
    */
    clearSceneElements(): void {
        this.unitCreateQueue.clear();
        // 取消选中
        this.unselectUnit(0, false);
        let unit: UnitController;
        for (let unitIDKey in this.unitList) {
            unit = this.unitList[unitIDKey];
            if (unit.Data.unitType == UnitCtrlType.hero || unit == this._hero.guoyun || unit == this._hero.shield || unit == this._hero.lingbao || unit == this._hero.shengLing) {
                unit.stopMove();
                continue;
            }
            else if (unit == this._hero.pet) {
                let heroPet = unit as PetController;
                heroPet.stopMove();
                heroPet.followedRole = null;
                this._hero.pet = null;
            }

            unit.destroy(true);
        }
        G.clearRangeLoader();
        for (let npcIdKey in this.npcDataList) {
            let npcInfo = this.npcDataList[npcIdKey];
            if (npcInfo.model) {
                npcInfo.model.destroy(false);
                npcInfo.model = null;
            }
        }
        this.npcDataList = {};

        // 清除传送点
        let tpEffectCtrl: TeleportEffectController;
        for (let tpIdKey in this.teleportMap) {
            tpEffectCtrl = this.teleportMap[tpIdKey];
            tpEffectCtrl.destroy();
            delete this.teleportMap[tpIdKey];
        }

        // 清除脚本特效
        let scriptEffectCtrl: ScriptEffectController;
        for (let seKey in this.scriptEffectMap) {
            scriptEffectCtrl = this.scriptEffectMap[seKey];
            scriptEffectCtrl.destroy();
            delete this.scriptEffectMap[seKey];
        }

        // 清除钻石掉落
        for (let coinsCtrl of this.coins) {
            coinsCtrl.destroy();
        }
        this.coins.length = 0;
        for (let coinsCtrl of this.coinsPool) {
            coinsCtrl.destroy();
        }
        this.coinsPool.length = 0;

        this.m_fakeUnitID = 0;
        this.roleList = [];
        this.monsterList = [];
        this.collectMonsterList = [];
        this.dropList = [];
        //强制去除箭头指引
        if (this.hero) {
            (this.hero.model.avatar as RoleAvatar).setArrowVisible(false);
        }
    }

    /**
     * 选中目标内部实现。
     * @param id
     */
    private selectUnitInternal(unit: UnitController): boolean {
        let old = this.selectedUnit;
        if (old != null && old.model != null && old.Data.unitType == UnitCtrlType.monster) {
            let monsterCtrl = old as MonsterController;
            if (!monsterCtrl.isAlwaysShowNameBlood()) {
                monsterCtrl.onUnselected();
            }
        }
        this.selectedUnit = unit;
        if (unit != null) {
            if (unit.Data.unitType == UnitCtrlType.monster) {
                let monsterCtrl = unit as MonsterController;
                monsterCtrl.onSelected();
            }
            G.UnitSelectEffectPlayer.selectTarget(unit.model.transform, UnitUtil.isFriendTargetBySelect(unit));
            G.ViewCacher.mainView.onUnitSelected(unit);
        }
        return old == unit;
    }

    public selectUnit(id: number, isNpc: boolean): boolean {
        if (id != 0) {
            let unit: UnitController;
            if (isNpc) {
                unit = this.getNpc(id);
            } else {
                unit = this.unitList[id];
            }
            return this.selectUnitInternal(unit);
        }
        uts.assert(false, 'error call selectUnit!');
        return false;
    }
    /**
     * 取消选中目标。
     * @param id 0表示取消当前目标，非0则仅当当前目标与指定id相同时才取消。npc传npc id，其他传unit id
     * @param isNpc 如果取消选中npc则传true，如果id是0的话则true和false的效果一致，均取消当前目标。
     */
    public unselectUnit(id: number, isNpc: boolean): boolean {
        if (0 != id && null != this.selectedUnit && ((isNpc && id != this.selectedUnit.Data.id) || (!isNpc && id != this.selectedUnit.Data.unitID))) {
            return false;
        }

        let old = this.selectedUnit;
        if (old != null && old.model != null && old.Data.unitType == UnitCtrlType.monster) {
            let monsterCtrl = old as MonsterController;
            if (!monsterCtrl.isAlwaysShowNameBlood()) {
                monsterCtrl.onUnselected();
            }
        }
        this.selectedUnit = null;
        G.UnitSelectEffectPlayer.selectTarget(null,false);
        G.ViewCacher.mainView.onUnitSelected(null);
        return true;
    }
    public deleteUnit(unit: UnitController) {
        if (unit.Data.unitType == UnitCtrlType.monster) {
            let index = this.monsterList.indexOf(unit as MonsterController);
            if (index >= 0) {
                this.monsterList.splice(index, 1);
            }
        } else if (UnitUtil.isRole(unit)) {
            let roleCtrl = unit as RoleController;
            let index = this.roleList.indexOf(roleCtrl);
            this.roleList.splice(index, 1);
            if (roleCtrl.hideFlag == false) {
                this.processHideRole();
            }
        } else if (unit.Data.unitType == UnitCtrlType.dropThing) {
            let index = this.dropList.indexOf(unit as DropThingController);
            if (index >= 0) {
                this.dropList.splice(index, 1);
            }
        } else if (unit.Data.unitType == UnitCtrlType.collection) {
            let index = this.collectMonsterList.indexOf(unit as CollectMonsterController);
            if (index >= 0) {
                this.collectMonsterList.splice(index, 1);
            }
        }
        delete this.unitList[unit.Data.unitID];
    }
    /**
     * 这个方法由于性能问题写成这样，一些计算使用了重复代码和代码插入方式而没提取成函数
     */
    onSelectChangeCheck(forceRandom: boolean) {
        if (!forceRandom && G.DataMgr.runtime.isHangingUp) {
            return;
        }
        let sceneData = G.DataMgr.sceneData;
        let lastSelectUnit = this.SelectedUnit;
        if (!sceneData.isEnterSceneComplete) {
            // 当前没有选中任务unit且尚未进入场景，不做任何操作
            return;
        }
        let hero = this._hero;
        if (hero == null || !hero.Data.isAlive) {
            return;
        }

        let heroPos = hero.getPixelPosition();

        // 非和平场景允许自动选人
        let pkMode = this.hero.Data.pkMode;
        let allowRole = pkMode > 0 && Macros.PK_STATUS_PEACE != pkMode;
        let maxdis = 250000;
        if (allowRole) {
            maxdis = 1000000;
        }
        if (!forceRandom && this.selectedUnit != null) {
            if (this.selectedUnit.model == null) {
                uts.logError("模型以为被删除了，请检查逻辑。");
                this.unselectUnit(0, false);
            }
            else {
                // 获取当前手动选择的对象，如果不为空并且距离在允许范围内，则返回
                let targetPos = this.selectedUnit.getPixelPosition();
                let disx = heroPos.x - targetPos.x;
                let disy = heroPos.y - targetPos.y;
                if ((disx * disx + disy * disy) > maxdis) {
                    this.unselectUnit(0, false);
                }
                else {
                    return;
                }
            }
        }
        //简单的插入排序
        let sortList: UnitController[] = [];
        let insertIndex = 0;
        let lastUnitArrowed = false;
        for (let key in this.unitList) {
            let unit = this.unitList[key];
            let unitType = unit.Data.unitType;
            if (UnitCtrlType.monster != unitType && (!allowRole || UnitCtrlType.role != unitType)) {
                continue;
            }

            if (UnitCtrlType.role == unitType && !unit.model.isShadowVisible) {
                continue;
            }
            var pos = unit.getPixelPosition();
            let disx = pos.x - heroPos.x;
            let disy = pos.y - heroPos.y;
            let dis = disx * disx + disy * disy;
            if (dis > maxdis) {
                continue;
            }
            if (forceRandom && null != lastSelectUnit && unit.equal(lastSelectUnit)) {
                lastUnitArrowed = true;
                continue;
            }
            unit.Data.sortLayer = dis;
            sortList[insertIndex] = unit;
            insertIndex++;
        }

        let b = G.BattleHelper;
        sortList.sort(delegate(b, b.sortCandidates));

        let len = sortList.length;
        let selUnit = null;
        let startIdx = 0;
        while (len > 0) {
            let idx = 0;
            if (forceRandom) {
                idx = Math.floor(Math.random() * (len <= 3 ? len : 3));
            }
            let unit = sortList[startIdx + idx];
            if (EnumTargetValidation.ok == G.BattleHelper.isValidTarget(unit, false, false)) {
                selUnit = unit;
                break;
            }
            startIdx++;
            len--;
        }
        if (selUnit != null) {
            this.selectUnitInternal(selUnit);
        }
        else if (!lastUnitArrowed) {
            this.unselectUnit(0, false);
        }
    }


    //--------------------------单位查询-------------------------------------------
    /**
* 通过UIN到场景中去找相应的玩家
* @param roleID
* @return
*
*/
    getRoleByUIN(uin: number): RoleController {
        if (G.DataMgr.heroData.uin == uin) {
            return this.hero;
        }
        for (let role of this.roleList) {
            if (role.Data.roleID.m_uiUin == uin) {
                return role;
            }
        }
        return null;
    }
    /**
* 通过unitID到场景中去找相应的玩家
* @param roleID
* @return
*
*/
    getRoleByUnitID(unitID: number): RoleController {
        let unit: UnitController = this.unitList[unitID];
        if (null != unit && UnitUtil.isRole(unit)) {
            return unit as RoleController;
        }
        return null;
    }
    getNpc(npcId: number) {
        let info = this.getNpcInfo(npcId);
        if (info) {
            return info.model;
        }

        return null;
    }
    getNpcInfo(npcId: number) {
        return this.npcDataList[npcId];
    }
    getMyPetById(id: number): PetController {
        for (let unitIdKey in this.unitList) {
            let unitCtrl = this.unitList[unitIdKey];
            if (UnitCtrlType.pet == unitCtrl.Data.unitType && id == unitCtrl.Data.id) {
                let petCtrl = unitCtrl as PetController;
                if (petCtrl.followedRole == this.hero) {
                    return petCtrl;
                }
            }
        }
        return null;
    }
    getUnitById(id: number, maxCount = 0): UnitController[] {
        let unitCtrls: UnitController[] = [];
        if (GameIDUtil.isMonsterID(id)) {
            let cnt = 0;
            for (let unitIdKey in this.unitList) {
                let unitCtrl = this.unitList[unitIdKey];
                if (id == unitCtrl.Data.id) {
                    unitCtrls.push(unitCtrl);
                    cnt++;
                    if (maxCount > 0 && cnt >= maxCount) {
                        break;
                    }
                }
            }
        } else if (GameIDUtil.isNPCID(id)) {
            let unitCtrl = this.getNpc(id);
            if (null != unitCtrl) {
                unitCtrls.push(unitCtrl);
            }
        }

        return unitCtrls;
    }
    getUnit(unitId: number): UnitController {
        return this.unitList[unitId];
    }
    getQuestIdByClientMonster(unitID: number) {
        return this.clientMonster2QuestId[unitID];
    }
    logAllUnitID() {
        for (let id in this.unitList) {
            uts.log(id);
        }
    }



    loadNPCData(list: Array<NPCInfo>, enabled: boolean): void {
        //如果有旧的，卸载
        for (let npcIdKey in this.npcDataList) {
            let npcInfo = this.npcDataList[npcIdKey];
            if (npcInfo.model) {
                npcInfo.model.destroy(false);
                npcInfo.model = null;
            }
        }
        this.npcDataList = {};

        if(enabled) {
            let hero = this._hero;
            for (let npcInfo of list) {
                if (npcInfo.config == null) {
                    uts.logError("@jackson" + JSON.stringify(npcInfo));
                }
                if (npcInfo.config.m_ucFunctionNumber > 0
                    && KeyWord.NPC_FUNCITON_ACTOR == npcInfo.config.m_astNPCFunction[0].m_ucFunction
                    && hero.Data.level >= npcInfo.config.m_astNPCFunction[0].m_iParam) {
                    // 装饰怪如果超过指定的等级就不显示了 
                    continue;
                }
                this.npcDataList[npcInfo.npcID] = npcInfo;
                let pos = G.getCacheV3(G.serverPixelXToLocalPositionX(npcInfo.x), 0, G.serverPixelYToLocalPositionY(npcInfo.y));
                npcInfo.rangeLoaderKey = G.addToRangeLoader(delegate(this, this.onLoadNpc, npcInfo), pos, Constants.LoadWidth, Constants.LoadHeight);
            }
        }
    }
    private onLoadNpc(show: boolean, npcInfo: NPCInfo) {
        if (npcInfo.model) {
            npcInfo.model.hideflag = !show;
            npcInfo.model.onUpdateVisible();
        }
        else {
            let d = new UnitData();
            d.id = npcInfo.config.m_iNPCID;
            d.config = npcInfo.config;
            d.unitID = d.id;
            d.unitType = UnitCtrlType.npc;
            d.x = npcInfo.x;
            d.y = npcInfo.y;
            d.direction = npcInfo.direction;
            npcInfo.model = new NpcController(d);
            npcInfo.model.hideflag = !show;
            npcInfo.model.onLoad();
            npcInfo.model.updateQuestState();
        }
    }

    //--------------------------单位创建-------------------------------------------
    //创建一个单位,需要指定唯一性ID，表格ID和位置
    createHero(data: HeroData, path?: UnityEngine.Vector3[]): HeroController {
        data.unitType = UnitCtrlType.hero;
        let controller = new HeroController(data);
        controller.onLoad();
        this.unitList[data.unitID] = controller;
        this.afterRoleCreated(controller);
        return controller;
    }
    //创建一个单位,需要指定唯一性ID，表格ID和位置，传入的座位不一定是真实坐标，而是此刻的显示坐标
    private createRole(data: RoleData, positionX: number, positionY: number): RoleController {
        data.x = positionX;
        data.y = positionY;
        data.unitType = UnitCtrlType.role;
        let role = new RoleController(data);
        role.onLoad();
        this.unitList[data.unitID] = role;
        this.afterRoleCreated(role);
        this.roleList.push(role);
        if (this.teamData.isMyTeamMember(role.Data.roleID)) {
            this.processHideRole();
        }
        else if (this.roleList.length <= this.settingData.MaxPlayerCount) {
            this.processHideRole();
        }
        return role;
    }
    public createRoleByProtocol(sightInfo: Protocol.RoleSightInfo) {
        let info = sightInfo.m_stUnitSightInfo;
        if (this.unitList[info.m_iUnitID] == null) {
            Profiler.push('createRole1');
            //uts.log('create role: ' + sightInfo.m_stBaseProfile.m_szNickName + ', campID = ' + info.m_ucCampID + ', armyID = ' + sightInfo.m_ucArmyID + ', pkValue = ' + sightInfo.m_stPKInfo.m_cPKVal);
            //创建角色
            var roleData = new RoleData();
            //设置roleData
            roleData.setProperty(Macros.EUAI_LEVEL, info.m_usLevel);
            roleData.setProperty(Macros.EUAI_CURHP, info.m_iHP);
            roleData.setProperty(Macros.EUAI_MAXHP, info.m_iMaxHP);
            roleData.setProperty(Macros.EUAI_CURMP, info.m_iMP);
            roleData.setProperty(Macros.EUAI_MAXMP, info.m_iMaxMP);
            roleData.setProperty(Macros.EUAI_SPEED, info.m_iSpeed);
            roleData.gender = sightInfo.m_stBaseProfile.m_cGender;
            roleData.curVipLevel = G.DataMgr.vipData.getVipLevelByMoney(sightInfo.m_stBaseProfile.m_uiCosumeSum);
            if (Macros.PINSTANCE_ID_SINGLEPVP == G.DataMgr.sceneData.curPinstanceID) {
                // 比武大会初赛里都显示封神弟子
                roleData.nick = '封神弟子';
            } else {
                roleData.nick = sightInfo.m_stBaseProfile.m_szNickName;
            }
            roleData.profession = sightInfo.m_stBaseProfile.m_cProfession;
            roleData.unitStatus = info.m_uiUnitStatus;
            roleData.name = roleData.nick;
            roleData.campID = info.m_ucCampID;
            roleData.unitID = info.m_iUnitID;
            roleData.id = sightInfo.m_stID.m_uiUin; //t;//暂用
            //roleData.m_ucPlat360VLevel = data.m_ucPlat360VLevel;
            roleData.uin = sightInfo.m_stID.m_uiUin;
            roleData.uniqueTitle2 = sightInfo.m_stShowFixTitleInfo.m_usID;
            roleData.m_usShowTitleID = sightInfo.m_stShowFixTitleInfo.m_usShowTitleID;
            roleData.pkTitleBit = sightInfo.m_uiTDTitleBitMap;
            roleData.jisutiaozhanTitle = sightInfo.m_uiJXTZTitle;
            //roleData中的roleID永远只会被new一次，每次都用协议里面的值赋值
            roleData.updateRoleID(sightInfo.m_stID);
            roleData.avatarList = sightInfo.m_stAvatarList;
            roleData.pkMode = sightInfo.m_stPKInfo.m_ucPKStaus;
            roleData.pkValue = sightInfo.m_stPKInfo.m_cPKVal;
            roleData.armyID = sightInfo.m_ucArmyID;
            roleData.teamId = sightInfo.m_iTeamID;
            roleData.guildId = sightInfo.m_stGuildInfo.m_uiGuildID;
            roleData.guildGrade = sightInfo.m_stGuildInfo.m_ucGrade;
            roleData.guildName = sightInfo.m_stGuildInfo.m_szGuildName;
            roleData.mateName = sightInfo.m_szLoverNickName;
            roleData.juYuanId = sightInfo.m_iJuYuanInfo;
            roleData.guoyunLevel = sightInfo.m_ucGuoYunLevel;
            roleData.shieldId = sightInfo.m_iShieldGodID;
            Profiler.pop();
            Profiler.push('createRole2');
            let role: RoleController;
            if (sightInfo.m_stJumpInfo.m_ucNum > 0) {
                // 说明在跳跃
                roleData.direction = sightInfo.m_stJumpInfo.m_ucDirection;
                roleData.setPosition(sightInfo.m_stJumpInfo.m_stPosition.m_uiX, sightInfo.m_stJumpInfo.m_stPosition.m_uiY);
                let startID = sightInfo.m_stJumpInfo.m_aiID[0];
                let sceneData = G.DataMgr.sceneData;
                var gateInfo: GateInfo = sceneData.getGateInfo(sceneData.curSceneID, startID);
                if (null != gateInfo) {
                    // 有可能地编还没下完就刷视野了，这时候要判断非空
                    role = this.createRole(roleData, gateInfo.x, gateInfo.y);
                    role.jumpByTeleports(sightInfo.m_stJumpInfo.m_aiID, sightInfo.m_stJumpInfo.m_stPosition);
                }
                else {
                    role = this.createRole(roleData, sightInfo.m_stJumpInfo.m_stPosition.m_uiX, sightInfo.m_stJumpInfo.m_stPosition.m_uiY);
                }
            }
            else {
                let movement = info.m_stUnitMovement;
                role = this.createRoleWithMovePath(roleData, movement);
            }

            Profiler.pop();
            Profiler.push('createRole3');
            if (UnitStatus.isDead(roleData.unitStatus)) //是否死亡
            {
                role.kill(null);
            }

            //同时考虑把我的队友roleData更新到myTeamList
            if (G.DataMgr.teamData.updateMyTeamList(role.Data)) {
                G.ViewCacher.mainView.onTeamChanged();
            }
            //role.showTreasureTick(roleSightInfo.m_stRMBZCInfo.m_uiEndTime, roleSightInfo.m_stRMBZCInfo.m_uiMonsterID);
            Profiler.pop();
        }
        else {
            uts.logWarning("这个角色在场景中已经有了:" + sightInfo);
        }
    }

    createRoleByMonsterSightInfoRole(sight: Protocol.MonsterSightInfo): RoleController {
        let roleData = new RoleData();

        //设置roleData
        let info = sight.m_stValue.m_stMonsterSightInfoRole;
        let unitSightInfo = sight.m_stUnitSightInfo;
        roleData.campID = sight.m_stUnitSightInfo.m_ucCampID;
        roleData.unitID = unitSightInfo.m_iUnitID;
        roleData.id = unitSightInfo.m_iUnitID;
        roleData.uin = unitSightInfo.m_iUnitID;
        roleData.unitStatus = 1;
        roleData.profession = info.m_stBaseProfile.m_cProfession;
        roleData.name = info.m_stBaseProfile.m_szNickName;
        roleData.gender = info.m_stBaseProfile.m_cGender;

        roleData.avatarList = info.m_stAvatarList;

        roleData.guildId = info.m_stGuildInfo.m_uiGuildID;
        roleData.guildName = info.m_stGuildInfo.m_szGuildName;
        roleData.guildGrade = info.m_stGuildInfo.m_ucGrade;
        roleData.curVipLevel = G.DataMgr.vipData.getVipLevelByMoney(info.m_stBaseProfile.m_uiCosumeSum);

        // 标记是封神台用的角色
        roleData.monsterRoleId = sight.m_iMonsterID;
        // 设置属性
        roleData.setProperty(Macros.EUAI_LEVEL, unitSightInfo.m_usLevel);
        roleData.setProperty(Macros.EUAI_CURHP, unitSightInfo.m_iHP);
        roleData.setProperty(Macros.EUAI_MAXHP, unitSightInfo.m_iMaxHP);
        roleData.setProperty(Macros.EUAI_CURMP, unitSightInfo.m_iMP);
        roleData.setProperty(Macros.EUAI_MAXMP, unitSightInfo.m_iMaxMP);
        roleData.setProperty(Macros.EUAI_SPEED, unitSightInfo.m_iSpeed);

        return this.createRoleWithMovePath(roleData, unitSightInfo.m_stUnitMovement);
    }
    /**
* 这个是封神台专用
* @param elementPool
* @param info
* @param unitID
* @param vSceneID
* @return
*
*/
    createRoleByMonsterChangeAvatar(info: Protocol.MChangeAvatarDataRoleInfo, unitID: number, vSceneID: number): RoleController {
        let roleData = new RoleData();
        let roleInfo = info.m_stCacheRole.m_stRoleInfo;

        //设置roleData
        roleData.campID = KeyWord.CAMP_ID_MONSTER_NORMAL;
        roleData.unitID = unitID;
        roleData.id = unitID;
        roleData.uin = unitID;
        roleData.unitStatus = 1;
        roleData.profession = roleInfo.m_stBaseProfile.m_cProfession;
        roleData.name = roleInfo.m_stBaseProfile.m_szNickName;
        roleData.gender = roleInfo.m_stBaseProfile.m_cGender;

        let cacheRole: Protocol.CacheRoleInfo = info.m_stCacheRole;
        // roleData中的roleID永远只会被new一次，每次都用协议里面的值赋值
        roleData.updateRoleID(roleInfo.m_stID);

        roleData.uniqueTitle2 = cacheRole.m_stShowTitleFixInfo.m_usID;
        roleData.m_usShowTitleID = cacheRole.m_stShowTitleFixInfo.m_usShowTitleID;
        roleData.avatarList = roleInfo.m_stAvatarList;

        roleData.guildId = cacheRole.m_stGuildInfo.m_uiGuildID;
        roleData.guildName = cacheRole.m_stGuildInfo.m_szGuildName;
        roleData.guildGrade = cacheRole.m_stGuildInfo.m_ucGrade;
        roleData.curVipLevel = G.DataMgr.vipData.getVipLevelByMoney(cacheRole.m_stRoleInfo.m_stBaseProfile.m_uiCosumeSum);
        // 标记是封神台用的角色
        roleData.monsterRoleId = 1;
        // 设置属性
        roleData.updateUnitAttributes(roleInfo.m_stUnitInfo.m_stUnitAttribute);

        return this.createRoleWithMovePath(roleData, roleInfo.m_stUnitInfo.m_stUnitMovement);
    }

    private createRoleWithMovePath(roleData: RoleData, movement: Protocol.UnitMovement): RoleController {
        roleData.direction = movement.m_iDirection;
        let currentPos = movement.m_stCurrentPosition;
        roleData.setPosition(currentPos.m_uiX, currentPos.m_uiY);
        let role = this.createRole(roleData, currentPos.m_uiX, currentPos.m_uiY);
        if (!UnitStatus.isDead(roleData.unitStatus)) {
            let new3DPath = this.unitPathToVector3Path(movement.m_stPath);
            role.beginMoveWorld(new3DPath);
        }
        return role;
    }

    public unitPathToVector3Path(unitPath: Protocol.UnitPath): UnityEngine.Vector3[] {
        if (unitPath.m_iNumber == 0) {
            return null;
        }
        let path = unitPath.m_astPosition;
        let new3DPath = [];
        for (let i = 0; i < unitPath.m_iNumber; i++) {
            let pos = path[i];
            new3DPath.push(G.serverPixelToLocalPosition(pos.m_uiX, pos.m_uiY));
        }
        return new3DPath;
    }

    public createMonsterByProtocol(sightInfo: Protocol.MonsterSightInfo): UnitController {
        let monsterConfig = MonsterData.getMonsterConfig(sightInfo.m_iMonsterID);
        if (monsterConfig == null) {
            //uts.log("monsterConfig find error:" + sightInfo.m_iMonsterID);
            return null;
        }
        if (null == monsterConfig.m_szModelID || '' == monsterConfig.m_szModelID) {
            // 不填模型id的我就当没收到视野，这种怪一般只是脚本用的，前台实际不用管
            //uts.log('no model: ' + JSON.stringify(sightInfo));
            return null;
        }
        //变身
        let unitCtrl: UnitController;
        if (Macros.MONSTER_SIGH_TYPE_NONE == sightInfo.m_usExtraType || Macros.MONSTER_SIGH_TYPE_PET == sightInfo.m_usExtraType) {
            // 普通怪
            //uts.log('create monster: ' + JSON.stringify(sightInfo));
            unitCtrl = this.createMonsterBySightInfo(monsterConfig, sightInfo);
            //if (null == monsterConfig.m_iHumanID || monsterConfig.m_iHumanID <= 0) {
            //    if (UnitStatus.isTransform(sightInfo.m_stUnitSightInfo.m_uiUnitStatus)) {
            //        unitCtrl = transform1(sightInfo.m_stUnitSightInfo.m_ucUnitType, sightInfo);
            //    }
            //    else {
            //        unitCtrl = this.createMonsterBySightInfo(monsterConfig, sightInfo);
            //    }
            //}
            //else if (monsterConfig.m_iHumanID > 0) {
            //    var curSceneID: uint = DataModule.ins.sceneData.curSceneID;
            //    var unitSightInfo: UnitSightInfo = monsterInfo.m_stUnitSightInfo;
            //    var currentPosition: UnitPosition = unitSightInfo.m_stUnitMovement.m_stCurrentPosition;
            //    var role: Role = m_elementUtil.addRoleByRenXingCfg(m_elementPool, monsterConfig, unitSightInfo, curSceneID);
            //    role.setPosition(currentPosition.m_uiX, currentPosition.m_uiY);
            //    _addElement(role);
            //}
        } else if (Macros.MONSTER_SIGH_TYPE_ROLE == sightInfo.m_usExtraType) {
            // 人形怪
            this.createRoleByMonsterSightInfoRole(sightInfo);
        }

        return unitCtrl;
    }

    private createMonsterBySightInfo(monsterConfig: GameConfig.MonsterConfigM, sightInfo: Protocol.MonsterSightInfo): UnitController {
        let info = sightInfo.m_stUnitSightInfo;
        if (this.unitList[info.m_iUnitID] != null) {
            return;
        }
        let roleData: RoleData = new RoleData();
        roleData.setProperty(Macros.EUAI_CURHP, info.m_iHP);
        roleData.setProperty(Macros.EUAI_MAXHP, info.m_iMaxHP);
        roleData.setProperty(Macros.EUAI_CURMP, info.m_iMP);
        roleData.setProperty(Macros.EUAI_MAXMP, info.m_iMaxMP);

        roleData.setProperty(Macros.EUAI_SPEED, info.m_iSpeed);
        roleData.setProperty(Macros.EUAI_LEVEL, info.m_usLevel);
        roleData.unitStatus = info.m_uiUnitStatus;
        roleData.campID = info.m_ucCampID;
        roleData.unitID = info.m_iUnitID;
        roleData.id = sightInfo.m_iMonsterID;
        roleData.monsterTagID = sightInfo.m_iMonsterTagID;
        roleData.armyID = sightInfo.m_ucArmyID;

        let currentPos = info.m_stUnitMovement.m_stCurrentPosition;
        roleData.setPosition(currentPos.m_uiX, currentPos.m_uiY);

        //monster.showTreasureTick(info.m_uiRMBBoxEndTime);
        if (monsterConfig.m_bInitDirection > 0) {
            roleData.direction = monsterConfig.m_bInitDirection;
        }
        else {
            roleData.direction = info.m_stUnitMovement.m_iDirection;
        }

        roleData.config = MonsterData.getMonsterConfig(sightInfo.m_iMonsterID);

        let unitCtrl: UnitController;
        if (Macros.MONSTER_SIGH_TYPE_PET == sightInfo.m_usExtraType) {
            // 伙伴怪
            let petInfo = sightInfo.m_stValue.m_stMonsterSightInfoPet;
            roleData.petMonsterInfo = petInfo;
            let petCfg = PetData.getPetConfigByPetID(petInfo.m_iPetID);
            roleData.name = petCfg.m_szBeautyName;
        } else {
            if (null == sightInfo.m_szName || sightInfo.m_szName == '') {
                roleData.name = monsterConfig.m_szMonsterName;
            }
            else {
                roleData.name = sightInfo.m_szName;
            }
        }

        if (monsterConfig.m_bDignity == KeyWord.MONSTER_TYPE_PICK) {
            unitCtrl = this.createCollectMonster(roleData);
        }
        else {
            unitCtrl = this.createMonster(roleData);
            if (sightInfo.m_ucIsNew == 1 && sightInfo.m_usExtraType == 0) {
                let monsterCtrl = unitCtrl as MonsterController;
                monsterCtrl.born();
            }
        }

        if (!UnitStatus.isDead(roleData.unitStatus)) {
            let new3DPath = this.unitPathToVector3Path(info.m_stUnitMovement.m_stPath);
            unitCtrl.beginMoveWorld(new3DPath);
        }

        return unitCtrl;
    }
    /**
* 创建散仙
* @param info
* @param followedRole
* @param petData
* @param isShow
* @return
*
*/
    public createPetByProtocol(sightInfo: Protocol.PetSightInfo, followedRole: RoleController, petData: RoleData = null): PetController {
        let info = sightInfo.m_stUnitSightInfo;
        if (sightInfo != null && this.getUnit(info.m_iUnitID) != null) {
            //uts.logWarning(uts.format('试图创建场景上已经存在的美人，pet unitID={0}，role uin={1}', info.m_stUnitSightInfo.m_iUnitID, followedRole.Data.uin));
            return null;
        }

        //临时加一段检查散仙是否重发添加的代码
        if (followedRole.pet != null) {
            uts.logError(uts.format('试图为某角色重复创建美人，pet unitID={0}，role uin={1}', info.m_iUnitID, followedRole.Data.uin));
        }

        //改成祝福系统里面的美人了
        let m_iBeautyID: number = sightInfo.m_iPetID;
        let petConfig: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(m_iBeautyID);
        let config: GameConfig.BeautyStageM = PetData.getEnhanceConfig(m_iBeautyID, sightInfo.m_iPetLayer);

        let roleData: RoleData = new RoleData();
        roleData.unitType = UnitCtrlType.pet;
        roleData.name = petConfig.m_szBeautyName;
        roleData.unitID = info.m_iUnitID;
        roleData.campID = info.m_ucCampID;
        roleData.setProperty(Macros.EUAI_LEVEL, info.m_usLevel);
        roleData.setProperty(Macros.EUAI_CURHP, info.m_iHP);
        roleData.setProperty(Macros.EUAI_MAXHP, info.m_iMaxHP);
        roleData.setProperty(Macros.EUAI_CURMP, info.m_iMP);
        roleData.setProperty(Macros.EUAI_MAXMP, info.m_iMaxMP);
        roleData.setProperty(Macros.EUAI_SPEED, info.m_iSpeed);
        roleData.setProperty(Macros.EUAI_RAGE, sightInfo.m_ucPetRage);
        roleData.unitStatus = info.m_uiUnitStatus;
        roleData.campID = info.m_ucCampID;
        roleData.config = config;
        roleData.id = m_iBeautyID; //散仙类型
        roleData.feishengCount = sightInfo.m_ucFSCnt;
        roleData.petAwakeCnt = sightInfo.m_ucAwakeCnt;

        if (Macros.Pet_Status_Follow == sightInfo.m_uiPetStatus) {
            roleData.direction = followedRole.Data.direction;
            let followerPos = followedRole.getPixelPosition();
            roleData.setPosition(followerPos.x - PetController.RoleDistance, followerPos.y);
        } else {
            let positionInfo = info.m_stUnitMovement;
            let currentPos = positionInfo.m_stCurrentPosition;
            roleData.setPosition(currentPos.m_uiX, currentPos.m_uiY);
            roleData.direction = positionInfo.m_iDirection;
        }

        return this.createPet(roleData, followedRole);
    }

    private createPet(data: RoleData, followedRole: RoleController): PetController {
        data.unitType = UnitCtrlType.pet;
        let petCtrl = new PetController(data);
        petCtrl.setFollowed(followedRole);
        petCtrl.onLoad();
        this.unitList[data.unitID] = petCtrl;
        return petCtrl;
    }
    //创建一个单位,需要指定唯一性ID，表格ID和位置
    private createMonster(data: RoleData): MonsterController {
        data.unitType = UnitCtrlType.monster;
        let con = new MonsterController(data);
        this.unitList[data.unitID] = con;
        con.onLoad();
        this.monsterList.push(con);
        return con;
    }

    //创建一个单位,需要指定唯一性ID，表格ID和位置
    createCollectMonster(data: RoleData): CollectMonsterController {
        data.unitType = UnitCtrlType.collection;
        let collectedMonster = new CollectMonsterController(data);
        collectedMonster.onLoad();
        this.unitList[data.unitID] = collectedMonster;
        this.collectMonsterList.push(collectedMonster);
        return collectedMonster;
    }
    //创建一个单位,需要指定唯一性ID，表格ID和位置
    createDropThing(data: DropUnitData): void {
        data.unitType = UnitCtrlType.dropThing;
        let dropThing = new DropThingController(data);
        dropThing.onLoad();
        dropThing.judgeCanGet();
        G.BattleHelper.dropThingOnLoadTimer = G.SyncTime.getCurrentTime();
        this.unitList[data.unitID] = dropThing;
        this.dropList.push(dropThing);
    }
    /**
    * 创建前台怪。
    * @param configs
    * @return
    *
    */
    createClientMonsters(configs: GameConfig.ClientMonsterConfigM[], questId: number, count: number): void {
        // 需要先检查是否已经存在该前台怪
        let cnt: number = configs.length;
        if (cnt <= 0) {
            return;
        }
        cnt = Math.min(cnt, count);

        let mid: number = configs[0].m_iMonsterID;
        // 先检查有多少指定的前台怪了
        let monsterConfig: GameConfig.MonsterConfigM;
        let curCnt: number = 0;
        let unitController: UnitController;
        for (let monster of this.monsterList) {
            monsterConfig = monster.Data.config as GameConfig.MonsterConfigM;
            if (monsterConfig.m_iMonsterID == mid) {
                curCnt++;
                if (curCnt >= cnt) {
                    // 已经有这么多的前台怪了
                    return;
                }
            }
        }

        for (let i: number = curCnt; i < cnt; i++) {
            let cliConfig: GameConfig.ClientMonsterConfigM = configs[i];
            let config: GameConfig.MonsterConfigM = MonsterData.getMonsterConfig(cliConfig.m_iMonsterID);

            let roleData: RoleData = new RoleData();
            roleData.config = config;
            roleData.setProperty(Macros.EUAI_CURHP, config.m_iHP);
            roleData.setProperty(Macros.EUAI_MAXHP, config.m_iHP);
            roleData.setProperty(Macros.EUAI_CURMP, 0);
            roleData.setProperty(Macros.EUAI_MAXMP, 0);
            roleData.setProperty(Macros.EUAI_SPEED, 0);
            roleData.setProperty(Macros.EUAI_LEVEL, config.m_usLevel);

            let us: number = 0;
            us |= Macros.EUS_ALIVE;
            roleData.unitStatus = us;
            roleData.campID = KeyWord.CAMP_ID_MONSTER_NORMAL;
            roleData.unitID = --this.m_fakeUnitID; // 前台怪没有unitID
            roleData.id = config.m_iMonsterID;
            roleData.monsterTagID = 0;
            roleData.name = config.m_szMonsterName;
            roleData.armyID = 0;
            roleData.teamId = -1;
            //monster.updateConfig();

            roleData.setPosition(cliConfig.m_iPositionX, cliConfig.m_iPositionY);

            if (config.m_bInitDirection > 0) {
                roleData.direction = config.m_bInitDirection;
            }
            this.createMonster(roleData);
            this.clientMonster2QuestId[roleData.unitID] = questId;
        }
    }
    createGuoyun(lv: number, followedRole: RoleController): GuoyunController {
        let unitData: UnitData = new UnitData();
        unitData.unitType = UnitCtrlType.guoyunGoods;
        unitData.config = null;
        unitData.id = lv;
        unitData.direction = followedRole.Data.direction;
        unitData.setProperty(Macros.EUAI_SPEED, followedRole.Data.getProperty(Macros.EUAI_SPEED));
        let guoyunGoods: GuoyunController = new GuoyunController(unitData);
        guoyunGoods.setFollowed(followedRole);
        guoyunGoods.onLoad();
        let pos = followedRole.getPixelPosition();
        guoyunGoods.getAsidePosition(pos);
        guoyunGoods.setPixelPosition(pos.x, pos.y);
        return guoyunGoods;
    }
    createShieldGod(shieldId: number, followedRole: RoleController): ShieldGodController {
        let unitData = new UnitData();
        unitData.unitType = UnitCtrlType.shieldGod;
        let cfg = G.DataMgr.shieldGodData.getCfg(shieldId, 1);
        unitData.config = cfg;
        unitData.id = shieldId;
        unitData.setProperty(Macros.EUAI_SPEED, followedRole.Data.getProperty(Macros.EUAI_SPEED));
        let followerPosPixel = followedRole.getPixelPosition();
        unitData.x = followerPosPixel.x - ShieldGodController.RoleDistance;
        unitData.y = followerPosPixel.y - ShieldGodController.RoleDistance;

        let shieldGodCtrl = new ShieldGodController(unitData);
        shieldGodCtrl.setFollowed(followedRole);
        shieldGodCtrl.onLoad();
        return shieldGodCtrl;
    }
    createLingbao(lingbaoId: number, followedRole: RoleController): LingbaoController {
        let unitData: UnitData = new UnitData();
        unitData.unitType = UnitCtrlType.lingbao;
        let equipCfg = ThingData.getThingConfig(lingbaoId);
        unitData.config = equipCfg;
        unitData.id = lingbaoId;
        unitData.setProperty(Macros.EUAI_SPEED, followedRole.Data.getProperty(Macros.EUAI_SPEED));
        let followerPosPixel = followedRole.getPixelPosition();
        unitData.x = followerPosPixel.x - LingbaoController.RoleDistance;
        unitData.y = followerPosPixel.y - LingbaoController.RoleDistance;

        let lingbaoCtrl: LingbaoController = new LingbaoController(unitData);
        lingbaoCtrl.setFollowed(followedRole);
        lingbaoCtrl.onLoad();
        return lingbaoCtrl;
    }
    createShengLing(shenglingId: number, followedRole: RoleController): ShengLingController {
        let unitData: UnitData = new UnitData();
        unitData.unitType = UnitCtrlType.shengling;
        unitData.id = shenglingId;
        unitData.setProperty(Macros.EUAI_SPEED, followedRole.Data.getProperty(Macros.EUAI_SPEED));
        let followerPosPixel = followedRole.getPixelPosition();
        unitData.x = followerPosPixel.x - ShengLingController.RoleDistance;
        unitData.y = followerPosPixel.y - ShengLingController.RoleDistance;

        let slCtrl: ShengLingController = new ShengLingController(unitData);
        slCtrl.setFollowed(followedRole);
        slCtrl.onLoad();
        return slCtrl;
    }

    /**
	* 创建某一个传送点特效
	* @param gateInfo
	*
	*/
    public _createTeleportEffect(gateInfo: GateInfo): void {
        if(G.DataMgr.sceneData.disableAllGate) return;
        let tpEffectCtrl: TeleportEffectController = this.teleportMap[gateInfo.gateID];
        if (null != tpEffectCtrl) {
            return;
        }

        let config: GameConfig.TeleportConfigM = G.DataMgr.sceneData.getTeleportConfig(gateInfo.gateID);
        if (null == config) {
            uts.logError('场景' + G.DataMgr.sceneData.curSceneID + '中的传送点' + gateInfo.gateID + '没有配置');
            return;
        }
        if (KeyWord.TRANS_HIDE_JUMP != config.m_ucType &&
            KeyWord.TRANS_NEW_JUMP != config.m_ucType &&
            config.m_szTransportEffect1 != '') {
            tpEffectCtrl = new TeleportEffectController(gateInfo);
            this.teleportMap[gateInfo.gateID] = tpEffectCtrl;
        }
    }

    //----------------------单位创建后的初始化操作---------------------------------
    private afterRoleCreated(role: RoleController) {
        if (role.Data.guoyunLevel > 0) {
            // 创建国运车
            this.createGuoyun(role.Data.guoyunLevel, role);
        }
        role.checkShield();
        // 检查精灵
        if (role.Data.avatarList.m_uiLingBaoID > 0) {
            this.addLingbao2Role(role.Data.avatarList.m_uiLingBaoID, role);
        } else {
            this.removeLingBao(role);
        }
        let isFight: boolean = UnitStatus.isInFight(role.Data.unitStatus);
        role.onStatusFight();
        // if (isFight) {
        //     role.onStatusFight();
        // }
        // else {
        //     role.onStatusOutOfFight();
        // }
    }
    addLingbao2Role(lingbaoId: number, followedRole: RoleController) {
        if (null != followedRole.lingbao) {
            // 已有精灵，更新
            followedRole.lingbao.updateLingbaoId(lingbaoId);
        } else {
            this.createLingbao(lingbaoId, followedRole);
        }
    }
    addShengLing2Role(shengLingId: number, followedRole: RoleController) {
        if (shengLingId > 0) {
            if (null != followedRole.shengLing) {
                // 已有精灵，更新
                followedRole.shengLing.updateShengLingId(shengLingId);
            } else {
                this.createShengLing(shengLingId, followedRole);
            }
        }
        else {
            this.removeShengLing(followedRole);
        }
    }

    //--------------------单位移除----------------------------------
    /**
    * 移除国运物资。
    *
    */
    removeGuoyunGoods(role: RoleController): void {
        let guoyunGoods: GuoyunController = role.guoyun;
        if (defines.has('_DEBUG')) {
            uts.assert(null != guoyunGoods, '此人当前没有护送物资！');
        }
        if (null != guoyunGoods) {
            guoyunGoods.followedRole = null;
            role.guoyun = null;
            guoyunGoods.destroy(false);
        }
    }

    removeShield(role: RoleController): void {
        let shield = role.shield;
        if (null != shield) {
            shield.followedRole = null;
            role.shield = null;
            shield.destroy(false);
        }
    }

    removeLingBao(role: RoleController): void {
        let lingbao: LingbaoController = role.lingbao;
        if (null != lingbao) {
            lingbao.followedRole = null;
            role.lingbao = null;
            lingbao.destroy(false);
        }
    }

    removeShengLing(role: RoleController): void {
        let shengLing: ShengLingController = role.shengLing;
        if (null != shengLing) {
            shengLing.followedRole = null;
            role.shengLing = null;
            shengLing.destroy(false);
        }
    }

    //控制一个单位，摄像机将会跟随，并且响应用户输入
    controlHero(data: RoleData): void {
        let unit = this.unitList[data.unitID];
        this.follower.target = unit.model.rotateTransform;
        this._hero = unit as HeroController;
        G.ViewCacher.mainView.bindRole();
    }

    //controlUnit(unit: UnitController) {
    //    if (!unit) {
    //        unit = this._hero;
    //    }
    //    if (unit) {
    //        this.follower.target = unit.model.transform;
    //        G.ModuleMgr.SceneModule.loader.changeTarget(unit.model.transform);
    //    }
    //}

    //cancelControlUnit(unit: UnitController) {
    //    if (G.ModuleMgr.SceneModule.loader.cancelTarget(unit.model.transform)) {
    //        this.follower.target = this._hero.model.transform;
    //    }
    //}


    onHeroUnitIDChange() {
        let hero = this._hero;
        // hero的unit id变了，需要重新映射hash
        if (hero) {
            let heroData = hero.Data;
            if (heroData.oldUnitID > 0 && heroData.oldUnitID != heroData.unitID) {
                uts.log('change unit id from ' + heroData.oldUnitID + ' to ' + heroData.unitID);
                delete this.unitList[heroData.oldUnitID];
                this.unitList[heroData.unitID] = hero;
            } else {
                uts.log('never change unit id, old is ' + heroData.oldUnitID + ', new is ' + heroData.unitID);
            }
        }
    }

    //重新分配伙伴单位到管理器
    remapHero() {
        let hero = this._hero;
        // hero的unit id变了，需要重新映射hash
        if (null == hero) {
            return;
        }
        for (let unitIDKey in this.unitList) {
            if (this.unitList[unitIDKey] == hero) {
                this.unitList[unitIDKey] = null;
                delete this.unitList[unitIDKey];
                break;
            } else {
                //uts.logError('unitList has not been cleared!');
            }
        }
        this.unitList[hero.Data.unitID] = hero;
        let heroData: HeroData = G.DataMgr.heroData;
        hero.drag2pos(heroData.x, heroData.y);

        if (null != hero.pet) {
            let pos = G.getCacheV2(heroData.x, heroData.y);
            hero.pet.getAsidePosition(pos);
            hero.pet.setPixelPosition(pos.x, pos.y);
        }

        if (null != hero.guoyun) {
            let pos = G.getCacheV2(heroData.x, heroData.y);
            hero.guoyun.getAsidePosition(pos);
            hero.guoyun.setPixelPosition(pos.x, pos.y);
        }

        if (null != hero.shield) {
            let pos = G.getCacheV2(heroData.x, heroData.y);
            hero.shield.getAsidePosition(pos);
            hero.shield.setPixelPosition(pos.x, pos.y);
        }

        if (null != hero.lingbao) {
            let pos = G.getCacheV2(heroData.x, heroData.y);
            hero.lingbao.getAsidePosition(pos);
            hero.lingbao.setPixelPosition(pos.x, pos.y);
        }

        if (null != hero.shengLing) {
            let pos = G.getCacheV2(heroData.x, heroData.y);
            hero.shengLing.getAsidePosition(pos);
            hero.shengLing.setPixelPosition(pos.x, pos.y);
        }
    }
    remapAll() {
        let hero = this._hero;
        // hero的unit id变了，需要重新映射hash
        if (null == hero) {
            return;
        }
        for (let unitIDKey in this.unitList) {
            let unit = this.unitList[unitIDKey];
            unit.setPixelPosition(unit.Data.x, unit.Data.y);
        }
    }
    /**
* 刷新可采集怪
* @param monsterId 怪物的ID，0表示处理所有采集怪
* @param judgeResult 采集判断结果，0表示即时判断，正数（比如1）表示直接设置为可采集，负数（比如-1）表示直接设置为不可采集。
*
*/
    public _setMonsterCollectable(monsterId: number = 0, judgeResult: number = 0): void {
        let collectable: boolean;
        for (let collectMonster of this.collectMonsterList) {
            if (0 == monsterId || collectMonster.Data.id == monsterId) {
                if (0 == judgeResult) {
                    collectable = collectMonster.judgeCollectable();
                } else {
                    collectable = judgeResult > 0;
                }
                collectMonster.setCollectable(collectable);
                if (!collectable) {
                    this.unselectUnit(collectMonster.Data.unitID, false);
                }
            }
        }
    }
    /**
* 开启或者关闭传送点
* @param this.sceneID 场景id
* @param gateID 传送点id
* @param isStart 是否开启 true表示开启，增加特效，增加传送点描述， false表示关闭传送点，移除特效和描述
*
*/
    enableWaypoint(gateInfo: GateInfo, isStart: boolean = true): void {
        if (isStart) {
            gateInfo.isEnable = true;
            this._createTeleportEffect(gateInfo);
        }
        else {
            gateInfo.isEnable = false;
            let tpEffectCtrl: TeleportEffectController = this.teleportMap[gateInfo.gateID];
            if (null != tpEffectCtrl) {
                delete this.teleportMap[gateInfo.gateID];
                tpEffectCtrl.destroy();
            }
        }
    }

    processScriptEffect(effectName: string, position: UnityEngine.Vector3, qu: UnityEngine.Quaternion, scale: UnityEngine.Vector3, isShow: boolean, factor: number = 1) {
        if (isShow) {
            let key = position.x + '-' + position.z;
            let effCtrl = this.scriptEffectMap[key];
            if (null == effCtrl) {
                effCtrl = new ScriptEffectController(effectName, position, qu, scale, factor);
                this.scriptEffectMap[key] = effCtrl;
            } else {
                effCtrl.setActive(true);
            }
        } else {
            for (let key in this.scriptEffectMap) {
                let effCtrl = this.scriptEffectMap[key];
                if (effCtrl.effectName == effectName) {
                    effCtrl.destroy();
                    delete this.scriptEffectMap[key];
                }
            }
        }
    }

    addDropCoins(num: number, fromUnit: number) {
        if (!Tween.TweenTarget) {
            return;
        }

        let unitCtrl = this.getUnit(fromUnit);
        if (null == unitCtrl) {
            return;
        }

        let coinsCtrl: CoinsController;
        if (this.coinsPool.length > 0) {
            coinsCtrl = this.coinsPool.pop();
        } else {
            coinsCtrl = new CoinsController();
        }
        coinsCtrl.setParams(num, unitCtrl.getWorldPosition());
        this.coins.push(coinsCtrl);
    }

    removeDropCoins(coinCtrl: CoinsController) {
        let index = this.coins.indexOf(coinCtrl);
        if (index >= 0) {
            this.coins.splice(index, 1);
        }
        this.coinsPool.push(coinCtrl);
    }
    processHideRole() {
        let showCount = this.settingData.MaxPlayerCount;
        let showGroup: RoleController[] = [];
        let curShow = 0;
        for (let role of this.roleList) {
            if (this.teamData.isMyTeamMember(role.Data.roleID)) {
                role.hideFlag = false;
                if (curShow >= showCount) {
                    let showLength = showGroup.length;
                    if (showLength > 0) {
                        let old = showGroup[showLength - 1];
                        old.hideFlag = true;
                        showGroup.splice(showLength - 1, 1);
                    }
                }
                else {
                    curShow++;
                }
            }
            else {
                if (curShow < showCount) {
                    role.hideFlag = false;
                    showGroup.push(role);
                    curShow++;
                }
                else {
                    role.hideFlag = true;
                }
            }
        }
        for (let role of this.roleList) {
            role.onUpdateVisible();
        }
        let unit = this.selectedUnit;
        if (unit != null && unit.Data.unitType != UnitCtrlType.monster && !unit.model.isVisible) {
            this.unselectUnit(0, false);
        }
    }
    processHideRoleForce() {
        this.processHideRole();
        this.hero.onUpdateVisible();
    }
    processHideMonster() {
        for (let monster of this.monsterList) {
            monster.onUpdateVisible();
        }
    }
    processHideNpc() {
        for (let id in this.AllNPC) {
            let npc = this.AllNPC[id];
            if (npc.model) {
                npc.model.onUpdateVisible();
            }
        }
    }

    /**
     * 刷新指定类型的unit的名字板。
     * @param unitType 传UnitCtrlType.none则刷新所有类型的unit
     */
    public updateAllRoleNameBoard(unitType: UnitCtrlType): void {
        for (let roleCtrl of this.roleList) {
            roleCtrl.onUpdateNameboard(null);
            //roleCtrl.updateHeroBattleTitle();
            if (null != roleCtrl.pet) {
                roleCtrl.pet.onUpdateNameboard(null);
            }
        }
    }
    /**进去出队伍，对视野掉落物品的影响*/
    public updateAllDropThingCanGet(): void {
        let teamID: Protocol.TEAMID = G.DataMgr.teamData.teamID;
        let hasteam: boolean = Boolean(teamID != null);
        for (let dropThing of this.dropList) {
            dropThing.judgeCanGet();
        }
    }
    /**刷新宗门怪物的状态*/
    public _refreshGuildMonster(): void {
        let pid: number = G.DataMgr.sceneData.curPinstanceID;
        if (pid > 0) {
            let config: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(pid);
            if (config != null && config.m_iPVPType == KeyWord.PVP_GUILD) {
                for (let monster of this.monsterList) {
                    monster.model.selectAble = (monster.Data.guildId != G.DataMgr.heroData.guildId);
                }
            }
        }
    }

    /**
    * 将指定的单位从视野中删除。
    * @param toDel
    *
    */
    doDeleteFromSight(toDel: UnitController): void {
        if (this.SelectedUnit == toDel) {
            this.unselectUnit(0, false);
        }

        this.processRemoveSceneUnit(toDel);
        toDel.destroy(true);
    }

    /**
    * 从场景上移除某个角色
    * @param target
    *
    */
    processRemoveSceneUnit(removed: UnitController): void {
        // 如果是当前正在前往的对象则需要清除
        let runtime = G.DataMgr.runtime;
        if (runtime.moveTarget.sceneTarget == removed) {
            runtime.resetMoveTargets();
        }

        if (UnitUtil.isMonster(removed) || removed.Data.unitType == UnitCtrlType.role) {
            G.BattleHelper.onRemoveSceneRole(removed);
        }
    }

    toString(): string {
        return uts.format('[UnitMgr]Selected={0}', this.selectedUnit ? this.selectedUnit.toString() : 'NULL');
    }
}