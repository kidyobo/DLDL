import { MainView } from './../main/view/MainView';
import { PinstanceStatView } from './../pinstance/PinstanceStatView';
import { ReportType } from "System/channel/ChannelDef";
import { Constants } from "System/constants/Constants";
import { EnumSceneID, EnumMonsterID } from "System/constants/GameEnum";
import { UnitCtrlType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { MonsterData } from "System/data/MonsterData";
import { PetData } from "System/data/pet/PetData";
import { PetExpeditionData } from "System/data/pet/PetExpeditionData";
import { PinstanceData } from "System/data/PinstanceData";
import { DropUnitData, RoleData, UnitData } from "System/data/RoleData";
import { GateInfo } from "System/data/scene/GateInfo";
import { SiXiangData } from "System/data/SiXiangData";
import { ThingData } from "System/data/thing/ThingData";
import { EventDispatcher } from "System/EventDispatcher";
import { Events } from "System/Events";
import { Global as G } from "System/global";
import { EnumMainViewChild } from "System/main/view/MainView";
import { ReliveView } from "System/main/view/ReliveView";
import { PetExpeditionBattleView } from "System/pet/expedition/PetExpeditionBattleView";
import { SiXiangBattleView } from "System/pinstance/selfChallenge/SiXiangBattleView";
import { BwdhBattleView } from "System/kfjdc/view/BwdhBattleView";
import { ErrorId } from "System/protocol/ErrorId";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { PetController } from "System/unit/attendant/PetController";
import { BloodEffectPlayer } from "System/unit/BloodEffectPlayer";
import { DropThingController } from "System/unit/dropThing/DropThingController";
import { EffectPlayer } from "System/unit/EffectPlayer";
import { CollectMonsterController } from "System/unit/monster/CollectMonsterController";
import { MonsterController } from "System/unit/monster/MonsterController";
import { RoleController } from "System/unit/role/RoleController";
import { UnitController } from "System/unit/UnitController";
import { Color } from "System/utils/ColorUtil";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { PinstanceIDUtil } from "System/utils/PinstanceIDUtil";
import { StringUtil } from "System/utils/StringUtil";
import { UnitStatus } from "System/utils/UnitStatus";
import { UnitUtil } from "System/utils/UnitUtil";
import { BwdhWatchResultView } from 'System/pinstance/result/BwdhWatchResultView'
import { CompareUtil } from "System/utils/CompareUtil";
import { Profiler } from 'System/utils/Profiler'
export class UnitModule extends EventDispatcher {
    private mask2bits: { [mask: number]: number[] } = {};

    constructor() {
        super();
        //绑定网络消息包
        this.addNetListener(Macros.MsgID_Transport_Notify, this.onTransportNotify);
        this.addNetListener(Macros.MsgID_MovePosition_Response, this.onMovePositionReponse);
        this.addNetListener(Macros.MsgID_MovePosition_Notify, this.onMoveNotify);
        this.addNetListener(Macros.MsgID_RefreshRoleSightInfo_Notify, this.onRefreshSightRoleInfoNotify);
        this.addNetListener(Macros.MsgID_RefreshPetSightInfo_Notify, this.onRefreshSightPetInfoNotify);
        this.addNetListener(Macros.MsgID_RefreshMonsterSightInfo_Notify, this.onRefreshSightMonsterInfoNotify);
        this.addNetListener(Macros.MsgID_RefreshLeavedSightInfo_Notify, this.onRefreshLeavedSightInfoNotify);
        this.addNetListener(Macros.MsgID_RefreshDroppedSightInfo_Notify, this.onRefreshSightDropNotify);
        this.addNetListener(Macros.MsgID_MonsterAttrChange_Notify, this._onMonsterAttrChangeNotify);
        this.addNetListener(Macros.MsgID_UnitAttributeChanged_Notify, this.onUnitAttributeChanged_Notify);
        this.addNetListener(Macros.MsgID_MountRideChange_Response, this._onMountRideResponse); //上马
        this.addNetListener(Macros.MsgID_AvatarChange_Notify, this.onAvataChangeNotify);
        this.addNetListener(Macros.MsgID_MonsterChangeAvatar_Notify, this.onMonsterChangeAvatarNotify);
        this.addNetListener(Macros.MsgID_ONE_SIGHT_ARRTI_CHANGE_Notify, this._onOneSightArrtiChangeNtf);
        this.addNetListener(Macros.MsgID_Revival_Response, this.on_Revival_Response);

        this.addEvent(Events.updateJuYanInfo, this._onRefreshJuYuan); //任务改变的时候需要刷新npc的状态
        //复活处理
        this.addEvent(Events.HeroAliveDeadChange, this._onHeroAliveDeadChange);
    }


    /*-------------------网络消息-----------------*/
    //刷新视野玩家信息的通知
    private onRefreshSightRoleInfoNotify(msg: Protocol.RefreshRoleSightInfo_Notify): void {
        //if (null == this.Role) {

        //    return;
        //}
        Profiler.push('RefreshSightRole');
        let len: number = msg.m_stRoleSightInfoList.m_ucNumber;
        for (let i: number = 0; i < len; ++i) {
            let roleInfo = msg.m_stRoleSightInfoList.m_astRoleSightInfo[i];
            G.UnitMgr.createRoleByProtocol(roleInfo);
        }
        Profiler.pop();
    }

    /**
	* 刷新视野里的散仙
	* @param msg
	*
	*/
    private onRefreshSightPetInfoNotify(notify: Protocol.RefreshPetSightInfo_Notify) {
        let len: number = notify.m_stPetSightInfoList.m_ucNumber;
        let pet: PetController;
        let petSightInfo: Protocol.PetSightInfo = null;
        for (let i: number = 0; i < len; ++i) {
            petSightInfo = notify.m_stPetSightInfoList.m_astPetSightInfo[i];

            let role: RoleController = G.UnitMgr.getRoleByUIN(petSightInfo.m_stOwnerID.m_uiUin); //取得散仙的属主
            if (role == null) {
                //uts.logError(uts.format('美人的主人不存在，petId={0}, roleUni={1}', petSightInfo.m_iPetID, petSightInfo.m_stOwnerID.m_uiUin));
                continue;
            }
            pet = G.UnitMgr.createPetByProtocol(petSightInfo, role, null);
            if (pet == null) {
                pet = G.UnitMgr.getUnit(petSightInfo.m_stUnitSightInfo.m_iUnitID) as PetController;
                if (pet != null) {
                    let data = role.Data;
                    pet.setShengQi(data.avatarList.m_uiFabaoShowID);
                    pet.setZhenFa(UnitUtil.getAvatarModelID(data.getSubAvatarByKey(KeyWord.HERO_SUB_TYPE_FAZHEN), KeyWord.HERO_SUB_TYPE_FAZHEN));
                    pet = null;
                }
            }
            else {
                let data = role.Data;
                pet.setShengQi(data.avatarList.m_uiFabaoShowID);
                pet.setZhenFa(UnitUtil.getAvatarModelID(data.getSubAvatarByKey(KeyWord.HERO_SUB_TYPE_FAZHEN), KeyWord.HERO_SUB_TYPE_FAZHEN));
            }

            if (null != pet && pet.followedRole == G.UnitMgr.hero) {
                G.DataMgr.petData.setFollowPetByID(pet.Data.id);
                G.ViewCacher.mainView.onPetSkillChange();
            }
        }
    }

    /**
     * 刷新怪物视野消息
     * @param msg
     *
     */
    private onRefreshSightMonsterInfoNotify(msg: Protocol.RefreshMonsterSightInfo_Notify) {
        var monsterList = msg.m_stMonsterSightInfoList;
        let len = monsterList.m_ucNumber;
        let newMonsters: UnitController[] = [];
        let unitCtrl: UnitController;
        let myProf = G.DataMgr.heroData.profession;
        for (let i = 0; i < len; ++i) {
            let monsterInfo = monsterList.m_astMonsterSightInfo[i];
            if (monsterInfo.m_iMonsterID >= EnumMonsterID.WorldBossSQDaoMin && monsterInfo.m_iMonsterID < EnumMonsterID.WorldBossSQDaoMax) {
                if (myProf != KeyWord.PROFTYPE_WARRIOR) {
                    continue;
                }
            } else if (monsterInfo.m_iMonsterID >= EnumMonsterID.WorldBossSQQiangMin && monsterInfo.m_iMonsterID < EnumMonsterID.WorldBossSQQiangMax) {
                if (myProf != KeyWord.PROFTYPE_HUNTER) {
                    continue;
                }
            }
            unitCtrl = G.UnitMgr.createMonsterByProtocol(monsterInfo);
            if (null != unitCtrl) {
                // 进入视野的怪物
                newMonsters.push(unitCtrl);
            }
        }
        if(G.DataMgr.sceneData.isEnterSceneComplete) {
            G.Mapmgr.onMonstersTurnUp(newMonsters);
        }
    }

    //单位离开视野
    private onRefreshLeavedSightInfoNotify(msg: Protocol.RefreshLeavedSightInfo_Notify): void {
        let len = msg.m_stLeavedSightInfoList.m_ushNumber;
        let unitMgr = G.UnitMgr;
        for (let i = 0; i < len; ++i) {
            let deleteID = msg.m_stLeavedSightInfoList.m_aiLeaveUnitID[i];
            let controller = unitMgr.getUnit(deleteID);

            if (controller == null) {
                continue;
            }
            unitMgr.doDeleteFromSight(controller);
        }
    }

    private onTransportNotify(notify: Protocol.Transport_Notify): void {
        let role = G.UnitMgr.getRoleByUIN(notify.m_stRoleID.m_uiUin);
        if (null == role) {
            return;
        }
        role.Data.direction = notify.m_ucDirection;
        role.forceStand(UnitUtil.dir2Dto3D(notify.m_ucDirection));
        role.Data.setPosition(notify.m_stPosition.m_uiX, notify.m_stPosition.m_uiY);

        if (notify.m_ucNum > 0) {
            // 这是跳跃，约定好只能同场景
            role.jumpByTeleports(notify.m_aiID, notify.m_stPosition);
        }
    }

    private onMovePositionReponse(msg: Protocol.MovePosition_Response): void {
        if (msg.m_uiResultID != 0) {
            uts.log('move failed: ' + msg.m_uiResultID + ', pos = (' + msg.m_stCurrentPosition.m_uiX + ', ' + msg.m_stCurrentPosition.m_uiY + ')');
            let hero = G.UnitMgr.hero;
            G.ActionHandler.beAGoodBaby(false, false, true, false, false);
            hero.setPixelPosition(msg.m_stCurrentPosition.m_uiX, msg.m_stCurrentPosition.m_uiY);
            if (G.Mapmgr.isPathing) {
                // 如果之前在寻路的话就继续寻路
                G.Mapmgr.continuePathing(false);
            }
            if (G.DataMgr.runtime.isHangingUp) {
                G.ModuleMgr.deputyModule.pauseResumeHangUp(true);
                G.ModuleMgr.deputyModule.pauseResumeHangUp(false);
            }
        }
    }
    /**
    *移动通知
    * @param e
    *
    */
    private onMoveNotify(body: Protocol.MovePosition_Notify): void {
        let unitCtrl: UnitController = G.UnitMgr.getUnit(body.m_iUnitID);
        if (null == unitCtrl) {
            //uts.logWarning("Move notify 找不到对象：" + body.m_iUnitID);
            return;
        }
        let newPos = body.m_stUnitMovement.m_stCurrentPosition;
        let svrPath = body.m_stUnitMovement.m_stPath;
        if (Macros.MOVE_MODE_CMD == body.m_ucMoveMode) {
            // 命令移动到指定位置
            if (svrPath.m_iNumber > 0) {
                uts.log(uts.format('命令移动到({0}, {1})', svrPath.m_astPosition[0].m_uiX, svrPath.m_astPosition[0].m_uiY));
                let new3DPath = G.UnitMgr.unitPathToVector3Path(svrPath);
                unitCtrl.beginMoveWorld(new3DPath);
            }
        } else {
            let unitCurPos: UnityEngine.Vector2 = unitCtrl.getPixelPosition();

            let isDead: boolean = UnitStatus.isDead(unitCtrl.Data.unitStatus);
            var p: Protocol.UnitPosition;

            if (body.m_ucMoveMode == Macros.MOVE_MODE_NONE) {
                p = newPos;
            }
            else {
                p = { m_uiX: unitCurPos.x, m_uiY: unitCurPos.y };
                svrPath.m_astPosition[0] = newPos;
                svrPath.m_iNumber = 1;
            }

            if (unitCtrl.Data.unitType == UnitCtrlType.hero) {
                if (p.m_uiX == unitCurPos.x && p.m_uiY == unitCurPos.y) {
                    //uts.logWarning('又尼玛原地拉扯：(' + p.m_uiX + ', ' + p.m_uiY + ')');
                    return;
                }
                let hero = G.UnitMgr.hero;
                uts.log(uts.format('拉扯 by notify, newPos = ({0}, {1}), curPos ={2}, mode = {3}', newPos.m_uiX, newPos.m_uiY, unitCurPos.ToString(), body.m_ucMoveMode));
                hero.drag2pos(p.m_uiX, p.m_uiY, body.m_ucMoveMode);

                if (body.m_ucMoveMode == Macros.MOVE_MODE_NONE && !isDead && !hero.buffProxy.isComa && !hero.buffProxy.isFreze && G.Mapmgr.isPathing) {
                    // 如果之前在寻路的话就继续寻路
                    G.Mapmgr.continuePathing(false);

                    if (G.DataMgr.runtime.isHangingUp) {
                        G.ModuleMgr.deputyModule.pauseResumeHangUp(true);
                        G.ModuleMgr.deputyModule.pauseResumeHangUp(false);
                    }
                }
                else if (body.m_ucMoveMode == Macros.MOVE_MODE_DATI) // 答题活动中的被别人踢后，就要主动设置路径
                {
                    if (svrPath.m_iNumber > 0) {
                        let new3DPath = G.UnitMgr.unitPathToVector3Path(svrPath);
                        unitCtrl.beginMoveWorld(new3DPath);
                    }
                }
            }
            else if (unitCtrl.Data.unitType != UnitCtrlType.pet) {
                unitCtrl.setMoveType(body.m_ucMoveMode);
                if (body.m_ucMoveMode == Macros.MOVE_MODE_NONE && unitCtrl.Data.unitType == UnitCtrlType.role && unitCtrl.isMoving) {
                    let cacheV2 = G.cacheVec2;
                    cacheV2.x = p.m_uiX;
                    cacheV2.y = p.m_uiY;
                    if (UnityEngine.Vector2.Distance(unitCurPos, cacheV2) > 200) {
                        unitCtrl.setPixelPosition(p.m_uiX, p.m_uiY, body.m_ucMoveMode);
                    }
                }

                if (!isDead) {
                    if (svrPath.m_iNumber > 0) {
                        let new3DPath = G.UnitMgr.unitPathToVector3Path(svrPath);
                        unitCtrl.beginMoveWorld(new3DPath);
                    }
                    else {
                        unitCtrl.stopMove();
                    }
                    // 从黑名单中移除
                    G.BattleHelper.freeFromBlackList(body.m_iUnitID);
                }
            }
        }
    }

    /**
	* 怪物名称变化事件的响应函数。
	* @param msg
	*
	*/
    private _onMonsterAttrChangeNotify(notify: Protocol.MonsterAttr_Notify): void {
        let monster: MonsterController;

        if (Macros.MONSTER_ATTR_CHANGE_NAME == notify.m_ucType || Macros.MONSTER_ATTR_CHANGE_TITLE == notify.m_ucType) {
            // 改名字
            let newAttrSt: Protocol.MonsterAttrName;
            if (Macros.MONSTER_ATTR_CHANGE_NAME == notify.m_ucType) {
                newAttrSt = notify.m_stAttrValue.m_stNewName;
            }
            else {
                newAttrSt = notify.m_stAttrValue.m_stNewTitle;
            }
            let list = G.UnitMgr.AllUnits;
            for (let unitIDKey in list) {
                let unit = list[unitIDKey];
                if (!UnitUtil.isMonster(unit) || null == unit.Data || null == unit.Data.config) {
                    continue;
                }
                monster = unit as MonsterController;
                // 1000以上是怪物id，1000以下是tagId
                if ((newAttrSt.m_iID > 1000 && newAttrSt.m_iID == monster.Data.config.m_iMonsterID) ||
                    (newAttrSt.m_iID <= 1000 && newAttrSt.m_iID == monster.Data.monsterTagID)) {
                    if (Macros.MONSTER_ATTR_CHANGE_NAME == notify.m_ucType) {
                        // 改变怪物名称
                        if (StringUtil.isEmpty(newAttrSt.m_szNewName)) {
                            monster.Data.name = monster.Data.config.m_szMonsterName;
                        }
                        else {
                            monster.Data.name = newAttrSt.m_szNewName;
                        }
                    }
                    else {
                        // 改变怪物称号
                        monster.Data.monsterTitle = newAttrSt.m_szNewName;
                    }
                    monster.onUpdateNameboard(newAttrSt.m_szNewName);
                }
            }
        }
        else if (Macros.MONSTER_ATTR_CHANGE_INT == notify.m_ucType) {
            // 改int型属性
            let newIntSt: Protocol.MonsterAttrInt = notify.m_stAttrValue.m_stNewInt;

            monster = G.UnitMgr.getUnit(newIntSt.m_iUnitID) as MonsterController;
            if (null == monster || null == monster.Data || null == monster.Data.config) {
                return;
            }

            if (Macros.MONSTER_ATTR_INT_SCRIPTTAGID == newIntSt.m_iIntType) {
                monster.Data.monsterTagID = newIntSt.m_iIntValue;
                monster.onUpdateNameboard(null);
            }
            else if (Macros.MONSTER_ATTR_INT_RMBBOXTIME == newIntSt.m_iIntType) {
                // todo
                //monster.showTreasureTick(newIntSt.m_iIntValue);
            }
            else if (Macros.MONSTER_ATTR_INT_ARMYID == newIntSt.m_iIntType) {
                monster.Data.armyID = newIntSt.m_iIntValue;
                monster.onUpdateNameboard(null);
            }
        }
    }

    private onUnitAttributeChanged_Notify(msg: Protocol.UnitAttributeChanged_Notify): void {
        let uac: Protocol.UnitAttributeChanged = msg.m_stUAC;
        let unit = G.UnitMgr.getUnit(uac.m_iUnitID);
        if (unit != null) //如果不是场景上角色的uac变更，肯定是跟队友相关的
        {
            //更新该role的UAC中的属性值
            if (uac.m_iCasterUnitID > 0) {
                G.DataMgr.heroData.m_szCasterName = uac.m_szCasterName;
                let caster = G.UnitMgr.getUnit(uac.m_iCasterUnitID);
                this.processUnitAttribute(caster, unit, 0, uac, Constants.HitFeelingDelay, null);
            }
            else {
                this.processUnitAttribute(unit, unit, 0, uac, 0, null);
            }
        }
    }

    processUnitAttribute(caster: UnitController, target: UnitController, makerOwnerUnitID: number, uac: Protocol.UnitAttributeChanged, effectDelay: number, skill: GameConfig.SkillConfigM) {
        let hero = G.UnitMgr.hero;
        if (!hero) {
            return;
        }

        //Profiler.push('processUnitAttribute');
        let oldStatus = target.Data.unitStatus;
        //Profiler.push('unitAttributeChanged');
        let deltaMap = this.unitAttributeChanged(uac, target.Data);
        target.onUACChange(uac);
        //Profiler.pop();

        // 先处理飘字
        //Profiler.push('piaozi A');
        let isMyTeamMember = false;
        let targetType = target.Data.unitType;

        if (targetType == UnitCtrlType.role) {
            //Profiler.push('hero');
            let targetRole = target as RoleController;
            if (G.DataMgr.teamData.isMyTeamMember(targetRole.Data.roleID)) {
                // 我的队友被打也要飘血
                isMyTeamMember = true;
            }
            //Profiler.pop();
        }
        if (caster != null && (caster.Data.unitType == UnitCtrlType.hero || targetType == UnitCtrlType.hero || caster == G.UnitMgr.hero.pet ||
            SiXiangData.MonsterId[SiXiangData.MyMonsterIndex] == caster.Data.id || SiXiangData.MonsterId[SiXiangData.MyMonsterIndex] == target.Data.id ||
            UnitUtil.isMyPetMonster(caster) || UnitUtil.isMyPetMonster(target))) {
            // 需要飘字，要么我打别人，要么别人打我
            //Profiler.push('play blood effect');
            BloodEffectPlayer.play(caster, target, uac, deltaMap, skill ? skill.m_ucSkillBranch : -1);
            //Profiler.pop();
        }
        //Profiler.pop();

        if (0 != (uac.m_uiMask & (1 << Macros.EUAI_CURHP)) || 0 != (uac.m_uiMask & (1 << Macros.EUAI_MAXHP))) {
            if (target.Data.unitType == UnitCtrlType.monster) {
                (target as MonsterController).onHPChanged();
            }

            if (0 == target.Data.getProperty(Macros.EUAI_CURHP)) {
                // 血量为零设置死亡
                target.Data.unitStatus = UnitStatus.revertStatus(target.Data.unitStatus, Macros.EUS_ALIVE);
            }
        }

        //Profiler.push('processDeadUAC');
        this.processDeadUAC(caster, target, oldStatus, uac, effectDelay, skill);

        //Profiler.pop();

        this.processRoleGuaJiName(target, oldStatus, uac);

        //更新战斗状态相关的
        this._processFightUAC(target, oldStatus, uac);

        if (targetType == UnitCtrlType.hero) {
            //更新跳字相关的
            //Profiler.push('piaozi B');
            if (0 != (uac.m_uiMask & (1 << Macros.EUAI_FIGHT))) {
                //战斗力变化
                let strength = G.ViewCacher.strengthenTipView;
                if (!strength.isOpened) {
                    strength.open();
                }
                G.DataMgr.taskRecommendData.update();
                G.ViewCacher.strengthenTipView.processUnitFloatWords(uac);
                G.GuideMgr.tipMarkCtrl.onZhanDouLiChange();
            }
            let isLvUp = false;
            if (0 != (uac.m_uiMask & (1 << Macros.EUAI_LEVEL))) {
                // 升级了
                isLvUp = true;
                G.DataMgr.systemData.updateTime = UnityEngine.Time.realtimeSinceStartup + 1;
                this.processHeroUpgrade();
                G.DataMgr.taskRecommendData.update();
                G.DataMgr.runtime.levelUpLastTime = Math.floor(G.SyncTime.getCurrentTime() / 1000);
                G.ChannelSDK.report(ReportType.LEVELUP);
                G.DataMgr.equipStrengthenData.ItemMergeCache.updateHeroLevel(G.DataMgr.heroData.level);
            }
            if (0 != (uac.m_uiMask & (1 << Macros.EUAI_CUREXP))) {
                // 经验变化
                let expDelta = deltaMap[Macros.EUAI_CUREXP];
                G.ViewCacher.mainView.actionBarItem.onExpChange(expDelta, isLvUp);
                G.ViewCacher.mainView.onExpChange(expDelta, isLvUp);
            }
            //Profiler.pop();
        }

        if (isMyTeamMember) {
            // 如果是队友的话，还要更新队友数据
            G.DataMgr.teamData.updateMyTeamList(target.Data as RoleData);
            G.ViewCacher.mainView.onTeamChanged();
        }

        // 如果是选中目标，则需要刷新main view上的显示
        if (targetType == UnitCtrlType.hero) {
            this.dispatchEvent(Events.HeroDataChange);
        } else {
            G.ViewCacher.mainView.onOtherUnitDataChanged(target);
        }

        if (targetType == UnitCtrlType.pet) {
            // 如果是我的伙伴变了，要检查是否怒气变了
            let petCtrl = target as PetController;
            if (petCtrl.followedRole == G.UnitMgr.hero) {
                if (0 != (uac.m_uiMask64 & (1 << Macros.EUAI_RAGE))) {
                    G.ViewCacher.mainView.onPetNuQiChanged();
                }
            }
        }
        else if (UnitUtil.isRole(target)) {
            let bwdhView = G.ViewCacher.mainView.getChildForm<BwdhBattleView>(EnumMainViewChild.bwdhBattle);
            if (null != bwdhView) {
                bwdhView.updateUAC(target);
            }
        }
        else {
            if (PetExpeditionData.MonsterIds.indexOf(target.Data.id) >= 0) {
                let m = target as MonsterController;
                let pmi = m.Data.petMonsterInfo;
                let pct = target.Data.getProperty(Macros.EUAI_CURHP) / target.Data.getProperty(Macros.EUAI_MAXHP) * PetExpeditionData.FullHpPct;
                let expeditionView = G.ViewCacher.mainView.getChildForm<PetExpeditionBattleView>(EnumMainViewChild.petExpeditionBattle);
                if (null != expeditionView) {
                    expeditionView.setPetHpPct(target as MonsterController, pct);
                }
            } else if (SiXiangData.MonsterId.indexOf(target.Data.id) >= 0) {
                let sxBattleView = G.ViewCacher.mainView.getChildForm<SiXiangBattleView>(EnumMainViewChild.siXiangBattle);
                if (null != sxBattleView) {
                    sxBattleView.updateUAC(uac);
                }
            }
        }

        if (caster != null && targetType == UnitCtrlType.hero && caster.Data.unitType == UnitCtrlType.role) {
            // 被人打了，进行还击
            let sceneData = G.DataMgr.sceneData;
            if (1 == sceneData.getSceneInfo(sceneData.curSceneID).config.m_bFightBack) {
                G.BattleHelper.onAttackedByEnermy(caster);
            }
        }
        //Profiler.pop();
    }

    /**
     * 处理uac中关于生存死亡的部分
     * @param baseRole
     * @param uac
     *
     */
    private processDeadUAC(caster: UnitController, baseRole: UnitController, oldStatus: number, uac: Protocol.UnitAttributeChanged, delayAction: number, skill: GameConfig.SkillConfigM): void {
        //更新生命状态，是死亡或者是活着
        let oldIsDead = UnitStatus.isDead(oldStatus);
        let newIsDead = UnitStatus.isDead(uac.m_uiUnitStatus); //uac中的信息，是否是死亡
        //生--》死
        if (!oldIsDead && newIsDead) {
            // 检查如果死了但是血量没清，设为0
            if (baseRole.Data.getProperty(Macros.EUAI_CURHP) > 0) {
                baseRole.Data.setProperty(Macros.EUAI_CURHP, 0);
            }

            // 前台怪死了，完成任务
            var deadClientMonsterID: number = 0;
            if (baseRole.Data.unitType == UnitCtrlType.monster && KeyWord.MONSTER_TYPE_DECORATE == (baseRole.Data.config as GameConfig.MonsterConfigM).m_bDignity) {
                // 由于gotoHell之后，有些怪没有死亡时间会立即回收，所以要在这之前把id记录下来
                deadClientMonsterID = (baseRole.Data.config as GameConfig.MonsterConfigM).m_iMonsterID;
            }
            this.gotoHell(baseRole, caster, delayAction, skill);
            if (deadClientMonsterID > 0) {
                G.ModuleMgr.questModule.updateClientMonsterCnt(deadClientMonsterID);
            }

            if (PetExpeditionData.MonsterIds.indexOf(baseRole.Data.id) >= 0) {
                let m = baseRole as MonsterController;
                let expeditionData = G.DataMgr.petExpeditionData;
                let pmi = m.Data.petMonsterInfo;
                let expeditionView = G.ViewCacher.mainView.getChildForm<PetExpeditionBattleView>(EnumMainViewChild.petExpeditionBattle);
                if (null != expeditionView) {
                    expeditionView.setPetHpPct(baseRole as MonsterController, 0);
                }
                // 禁用该伙伴的技能
                G.ViewCacher.mainView.onWyyzSkillForbidden(expeditionData.getWyyzPetConfig(pmi.m_iPetID).m_iTSSkill);
            } else if (SiXiangData.MonsterId.indexOf(baseRole.Data.id) >= 0) {
                let sxBattleView = G.ViewCacher.mainView.getChildForm<SiXiangBattleView>(EnumMainViewChild.siXiangBattle);
                if (null != sxBattleView) {
                    sxBattleView.onMonsterDead(baseRole.Data.id);
                }
            }
        }
        else if (oldIsDead && !newIsDead) //复活  死--》生
        {
            if (UnitUtil.isRole(baseRole)) {
                baseRole.reborn(); //复活的行为

                if (baseRole.Data.unitType == UnitCtrlType.hero) {
                    G.DataMgr.heroData.isAlive = true;
                    //_setScreenGray(false);
                    G.DataMgr.runtime.isWaitTransprotResponse = false;
                    this._onHeroAliveDeadChange(); //派发死亡复活的消息
                    // 恢复自动战斗
                    if (G.DataMgr.sceneData.isEnterSceneComplete && G.DataMgr.runtime.isHangingUpBeforeDie && G.DataMgr.sceneData.curSceneID != EnumSceneID.YSZC) {
                        G.ModuleMgr.deputyModule.pauseResumeHangUp(false);
                    }
                }
                //Role(baseRole).updateAvataWhenRelive();
            }
        }
    }

    private processRoleGuaJiName(baseRole: UnitController, oldStatus: number, uac: Protocol.UnitAttributeChanged): void {
        if (!UnitUtil.isRole(baseRole))
            return;

        let nochange = UnitStatus.isGuaJi(oldStatus) == UnitStatus.isGuaJi(uac.m_uiUnitStatus);
        if (nochange)
            return;

        let role = baseRole as RoleController;
        role.onUpdateNameboard(null);
    }

    /**
	* 更新战斗状态相关的
	* @param baseRole
	*
	*/
    private _processFightUAC(baseRole: UnitController, oldStatus: number, m_stUAC: Protocol.UnitAttributeChanged): void {
        if (baseRole.Data == null || oldStatus == m_stUAC.m_uiUnitStatus) {
            return;
        }

        let oldIsFight: boolean = UnitStatus.isInFight(oldStatus);
        let newIsFight: boolean = UnitStatus.isInFight(m_stUAC.m_uiUnitStatus);
        let unittype = baseRole.Data.unitType;
        // 如果是伙伴
        if (unittype == UnitCtrlType.hero) {
            // 检查是否下马了
            let oldIsRide = UnitStatus.isInRide(oldStatus);
            let newIsRide = UnitStatus.isInRide(m_stUAC.m_uiUnitStatus);
            if (oldIsRide != newIsRide) {
                if (oldIsRide && !newIsRide) {
                    // 下马了，通知取消上马计时
                    G.UnitMgr.hero.cancelAutoRideOn();
                }
            }
            let pinstanceStatView = G.Uimgr.getChildForm<PinstanceStatView>(MainView, EnumMainViewChild.pinstanceStat);
            if (null != pinstanceStatView) {
                //左侧boss列表打怪的时候显示信息，不打就显示列表
                if (oldIsFight && !newIsFight) {
                    (baseRole as RoleController).onStatusOutOfFight();
                    G.DataMgr.runtime.lastOutOfFight = UnityEngine.Time.realtimeSinceStartup;
                    pinstanceStatView.autoSelectInfo(0);
                }
                if (!oldIsFight && newIsFight) {
                    pinstanceStatView.autoSelectInfo(1);
                }
        }
            (baseRole as RoleController).onStatusFight();
        }
        else if (unittype == UnitCtrlType.role) {
            // if (oldIsFight && !newIsFight) {
            //     (baseRole as RoleController).onStatusOutOfFight();
            // }
            // if (!oldIsFight && newIsFight) {
            // }
            (baseRole as RoleController).onStatusFight();
        }
        else if (unittype == UnitCtrlType.monster && // 如果是被动攻击怪物敌人
            UnitUtil.isEnemy(baseRole) && !UnitStatus.isActiveAttack(m_stUAC.m_uiUnitStatus)) {
            if (!UnitStatus.isDead(m_stUAC.m_uiUnitStatus)) {
                if (oldIsFight != newIsFight) {
                    // 战斗状态变化，改变名字颜色
                    baseRole.onUpdateNameboard(null);
                }
            }
        }

        if (UnitUtil.isRole(baseRole) && oldIsFight != newIsFight) {
            // 战斗状态变化，需要检查改变守护神形态
            (baseRole as RoleController).checkShield();
        }
    }

    /**
     *单元属性改变 ，个别属性设置
     * @param sObj  服务端对象
     * @param cObj  客户端对象
     *
     */
    private unitAttributeChanged(sObj: Protocol.UnitAttributeChanged, attackedObj: UnitData): { [euai: number]: number } {
        if (attackedObj == null || sObj == null) {
            return null;
        }
        let deltaMap = {};
        attackedObj.unitStatus = sObj.m_uiUnitStatus;
        let mask = sObj.m_uiMask;
        let mask64 = sObj.m_uiMask64;
        let m_aiCurrentValue = sObj.m_allCurrentValue;
        let m_aiDeltaValue = sObj.m_allDeltaValue;

        let bits = this.getBitsByMask(mask);
        let bitsCnt = bits.length;
        for (let i = 0; i < bitsCnt; i++) {
            let bit = bits[i];
            deltaMap[bit] = m_aiDeltaValue[i];
            attackedObj.setProperty(bit, m_aiCurrentValue[i]);
        }

        let bit64s = this.getBitsByMask(mask64);
        let bit64sCnt = bit64s.length;
        for (let i = 0; i < bit64sCnt; i++) {
            let bit64 = bit64s[i] + 32;
            deltaMap[bit64] = m_aiDeltaValue[i + bitsCnt];
            attackedObj.setProperty(bit64, m_aiCurrentValue[i + bitsCnt]);
        }
        return deltaMap;
    }

    private getBitsByMask(mask: number): number[] {
        let bits: number[] = this.mask2bits[mask];
        if (!bits) {
            bits = [];
            if (mask > 0) {
                for (let i = 0; i < 32; i++) {
                    if ((mask & (1 << i)) != 0) {
                        bits.push(i);
                    }
                }
            }
            this.mask2bits[mask] = bits;
        }
        return bits;
    }

    gotoHell(unit: UnitController, killer: UnitController, delayAction: number, skill: GameConfig.SkillConfigM): void {
        if (unit.model == null) {
            uts.logWarning("一个单位不能死亡2次哦~");
            return;
        }
        let hero = G.UnitMgr.hero;

        let isSelected = G.UnitMgr.SelectedUnit == unit;
        if (isSelected && null != hero) {
            // 停止自动攻击
            hero.stopAttackAuto();
        }
        let unitType = unit.Data.unitType;
        if (unitType == UnitCtrlType.monster) {
            let monster = (unit as MonsterController);
            monster.kill(killer, delayAction); //调用角色死亡的接口，执行死亡行为
            if (G.UnitMgr.SelectedUnit == unit) {
                G.UnitMgr.unselectUnit(0, false);
            }
        }
        else if (unitType == UnitCtrlType.collection) {
            (unit as CollectMonsterController).destroy(true); //调用角色死亡的接口，执行死亡行为
            if (G.UnitMgr.SelectedUnit == unit) {
                G.UnitMgr.unselectUnit(0, false);
            }
        }
        else if (UnitUtil.isRole(unit)) {
            (unit as RoleController).kill(killer); //调用角色死亡的接口，执行死亡行为
        }

        if (unit.Data.unitType == UnitCtrlType.hero) {
            //场景变灰色
            G.DataMgr.heroData.isAlive = false;
            //_setScreenGray(true);
            //关闭采集条
            if (G.ViewCacher.collectionBar.hasShowCollection) {
                G.ViewCacher.collectionBar.cancelByPrepareID(0);
            }
            // 暂停自动战斗
            G.DataMgr.runtime.isHangingUpBeforeDie = G.DataMgr.runtime.isHangingUp;
            G.ModuleMgr.deputyModule.pauseResumeHangUp(true);
            // 死亡后清除仇恨列表
            G.BattleHelper.clearEnmityList();
            G.ActionHandler.beAGoodBaby(false, false, false, true, false);
            // 清理寻路状态
            G.Mapmgr.stopAutoPath();
            this._onHeroAliveDeadChange();
        }
        G.UnitMgr.processRemoveSceneUnit(unit);
    }

    ///**
    // *单元属性改变 ，用于新增时，属性设置
    // * @param sObj  服务端对象
    // * @param cObj  客户端对象
    // *
    // */
    //setUnitAttribute(sObj: Protocol.UnitAttribute, cObj: RoleData): void {
    //    let m_ucNumber: number = sObj.m_ucNumber;
    //    let m_aiValue: number[] = sObj.m_allValue;
    //    for (let i: number = 0; i < m_ucNumber; i++) {
    //        //cObj.setProperty(i, parseFloat(m_aiValue[i].string));
    //    }
    //}

    private _onHeroAliveDeadChange(): void {
        if (G.DataMgr.heroData.isAlive) {
            G.Uimgr.closeForm(ReliveView);
        }
        else {
            let sceneData = G.DataMgr.sceneData;
            // 比武大会初赛里面如果死了就会弹结算板，故无需复活面板
            // 而决赛有两条命，所以第一次弹复活面板，第二次不弹
            if (Macros.PINSTANCE_ID_SINGLEPVP == sceneData.curPinstanceID || (Macros.PINSTANCE_ID_SINGLEPVP_FINALID == sceneData.curPinstanceID && G.Uimgr.getForm(BwdhWatchResultView))) {
                return;
            }
            let reliveCd: number = 0;  // 复活点复活时间
            let canYuandi: boolean;  // 是否可以原地复活
            let canBindYanBao: boolean;//是否使用绑定钻石复活
            // 获取当前场景数据
            let sceneInfo = sceneData.getSceneInfo(sceneData.curSceneID);
            uts.assert(sceneData.curSceneID > 0, '场景ID不存在');
            if (sceneData.curPinstanceID > 0)  //副本优先
            {
                // 如果是封神台副本，则不弹出复活面板
                if (Macros.PINSTANCE_ID_PVP == sceneData.curPinstanceID || Macros.PINSTANCE_ID_CROSS_PVP == sceneData.curPinstanceID) {
                    return;
                }
                let pinstanceConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(sceneData.curPinstanceID);
                reliveCd = pinstanceConfig.m_iDeadTime;   //复活功能使用时间
                canYuandi = 0 != pinstanceConfig.m_bRevival;   //原地复活
                canBindYanBao = 0 != pinstanceConfig.m_bBDYBRevival;
            }
            else {
                reliveCd = sceneInfo.config.m_iDeadTime;
                canYuandi = 0 != sceneInfo.config.m_bRevival;
                canBindYanBao = 0 != sceneInfo.config.m_bBDYBRevival;
            }
            if (canYuandi && 0 == reliveCd && G.DataMgr.runtime.isHangingUpBeforeDie && G.DataMgr.deputySetting.isRoleReviveEnabled) {
                // 其他地方使用钻石
                let reliveCost: number = G.DataMgr.constData.getValueById(KeyWord.REVIVAL_INSTANT_PRICE);
                if (canBindYanBao) {
                    if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_BIND_ID, reliveCost * 5, true)) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRevivalRequestMsg(Macros.RevivalType_ReviveInSitu));
                        return;
                    }
                }
                else {
                    if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, reliveCost, true)) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRevivalRequestMsg(Macros.RevivalType_ReviveInSitu));
                        return;
                    }
                }
            }
            let lockByBuff = false;
            if (0 != sceneInfo.config.m_bDeathPunish) {
                let buffInfo = G.UnitMgr.hero.buffProxy.getBuffInfo(Macros.DEAD_PUNISH_BUFF_ID);
                lockByBuff = null != buffInfo && buffInfo.buffInfo.m_ucBuffPileLayer >= 5;
            }
            G.Uimgr.createForm<ReliveView>(ReliveView).open(reliveCd, canYuandi, canBindYanBao, lockByBuff);
        }
    }

    private on_Revival_Response(body: Protocol.Revival_Response): void {
        if (ErrorId.EQEC_Success == body.m_ushResultID) {
            if (body.m_stTargetID.m_uiUin == G.DataMgr.heroData.roleID.m_uiUin) {
                G.Uimgr.closeForm(ReliveView);
                switch (body.m_ucRevivalType) {
                    case Macros.RevivalType_ReviveAtPoint:
                        G.TipMgr.addMainFloatTip('复活点复活...', Macros.PROMPTMSG_TYPE_MIDDLE);
                        break;
                    case Macros.RevivalType_ReviveInSitu:
                    case Macros.RevivalType_RevivaInstant:
                        G.TipMgr.addMainFloatTip('原地满状态复活...', Macros.PROMPTMSG_TYPE_MIDDLE);
                        break;
                    case Macros.RevivalType_ReviveFullStateAtPoint:
                        G.TipMgr.addMainFloatTip('复活点满状态复活...', Macros.PROMPTMSG_TYPE_MIDDLE);
                        break;
                    default:
                        break;
                }
            }
        }
        else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(body.m_ushResultID));
        }
    }
    private _onRefreshJuYuan(): void {
        G.UnitMgr.hero.updateTitle();
    }

    private _onOneSightArrtiChangeNtf(notify: Protocol.OneSightAttriChange_Notify): void {
        let role: RoleController = G.UnitMgr.getRoleByUIN(notify.m_stRoleID.m_uiUin);
        if (null == role) {
            uts.logError('change one sight attr but no unit: type = ' + notify.m_ucType + ', uin = ' + notify.m_stRoleID.m_uiUin);
            return;
        }
        if (Macros.ROLE_SIGH_ATTIR_TYPE_SHS == notify.m_ucType) {
            // 守护神变化
            let sid = notify.m_stValue.m_iShieldGodID;
            if (role.Data.unitType == UnitCtrlType.hero) {
                G.DataMgr.shieldGodData.updateFightShield(sid);
            }
            if (role.Data.shieldId != sid) {
                role.Data.shieldId = sid;
                role.checkShield();
            }
        }
        else if (Macros.ROLE_SIGH_ATTIR_TYPE_TD_JUYUAN == notify.m_ucType) {
            // 唯一称号变化
            role.Data.juYuanId = notify.m_stValue.m_iJuYuanInfo;
            role.updateTitle();
        }
        else if (Macros.ROLE_SIGH_ATTIR_TYPE_FIX_TITLE == notify.m_ucType) {
            // 特殊称号变化
            if (notify.m_stValue.m_stShowFixTitleInfo != null) {
                role.Data.uniqueTitle2 = notify.m_stValue.m_stShowFixTitleInfo.m_usID;
                role.Data.m_usShowTitleID = notify.m_stValue.m_stShowFixTitleInfo.m_usShowTitleID;
                role.updateTitle();
            }
        }
        else if (Macros.ROLE_SIGH_ATTIR_TYPE_GUILD_GRADE == notify.m_ucType) {
            // 宗门职位变化
            role.Data.guildGrade = notify.m_stValue.m_ucGuildGrade;
            role.onUpdateNameboard(null);
        }
        else if (Macros.ROLE_SIGH_ATTIR_TYPE_PKINFO == notify.m_ucType) {
            uts.log('change pk value: role = ' + role.Data.name + ', pkValue = ' + role.Data.pkValue);
            uts.log('change pk staus: role = ' + notify.m_stValue.m_stPKInfo.m_ucPKStaus);
            role.Data.pkMode = notify.m_stValue.m_stPKInfo.m_ucPKStaus;
            role.Data.pkValue = notify.m_stValue.m_stPKInfo.m_cPKVal;
            role.onUpdateNameboard(null);
            if (role.pet != null) {
                role.pet.onUpdateNameboard(null);
            }
            if (role.Data.unitType == UnitCtrlType.hero) {
                G.UnitMgr.updateAllRoleNameBoard(UnitCtrlType.role);
                this.dispatchEvent(Events.HeroDataChange);
            }
        }
        //转职了
        else if (Macros.ROLE_SIGH_ATTIR_TYPE_ATT == notify.m_ucType) {
            role.Data.gender = notify.m_stValue.m_stAttInfo.m_cGender;
            role.Data.name = notify.m_stValue.m_stAttInfo.m_szNickName;
            role.Data.profession = notify.m_stValue.m_stAttInfo.m_cProf;
            //role.returnOriginalAvatar();
            role.onUpdateNameboard(null);
        }
        //玩家军团ID
        else if (Macros.ROLE_SIGH_ATTIR_TYPE_ARMYID == notify.m_ucType) {
            uts.log('update role sign army id: ' + role.Data.name + ', armyId = ' + notify.m_stValue.m_ucArmyID);
            role.Data.armyID = notify.m_stValue.m_ucArmyID;
            //role.updateHeroBattleTitle();

            // 如果改的是自己的army id，需要刷新视野内其他人的名字
            if (role.Data.unitType == UnitCtrlType.hero) {
                G.UnitMgr.updateAllRoleNameBoard(UnitCtrlType.role);
            } else {
                role.onUpdateNameboard(null);
            }
        }
        else if (Macros.ROLE_SIGH_ATTIR_TYPE_TEAM == notify.m_ucType) {
            role.Data.teamId = notify.m_stValue.m_iTeamID;
            // 如果改的是自己的team id，需要刷新视野内其他人的名字
            if (role.Data.unitType == UnitCtrlType.hero) {
                G.UnitMgr.updateAllRoleNameBoard(UnitCtrlType.role);
            } else {
                role.onUpdateNameboard(null);
            }
        }
        //天地竞技称号
        //else if (Macros.ROLE_SIGH_ATTIR_TYPE_TD_TITLE == notify.m_ucType) {
        //role.Data.pkTitleBit = notify.m_stValue.m_uiTDTitleID;
        //    role.updatkepktitle();
        //}
        else if (Macros.ROLE_SIGH_ATTIR_TYPE_JSTZ == notify.m_ucType) {
            role.Data.jisutiaozhanTitle = notify.m_stValue.m_uiJSTZTitle;
            role.updateTitle();
        }
        //配偶称号
        else if (Macros.ROLE_SIGH_ATTIR_TYPE_MARRY == notify.m_ucType) {
            role.Data.mateName = notify.m_stValue.m_szLoverNickName;
            G.UnitMgr.updateAllRoleNameBoard(UnitCtrlType.role);
            //role.refreshLoverName();
        }
        else if (Macros.ROLE_SIGH_ATTIR_TYPE_RMBZCINFO == notify.m_ucType) {
            //role.showTreasureTick(notify.m_stValue.m_stRMBZCInfo.m_uiEndTime, notify.m_stValue.m_stRMBZCInfo.m_uiMonsterID);
        }
        else if (Macros.ROLE_SIGH_ATTIR_TYPE_LIFE_CONSUME == notify.m_ucType) {
            let oldVipLv: number = G.DataMgr.heroData.curVipLevel;
            G.DataMgr.heroData.lifeConsume = notify.m_stValue.m_uiLifeConsume;
            G.DataMgr.heroData.updateLifeConsume(notify.m_stValue.m_uiLifeConsume);
            // 更新玩家的vip等级
            let newVipLv: number = G.DataMgr.heroData.curVipLevel;
            if (oldVipLv != newVipLv) {
                // VIP等级变化，需要拉取新的vip数据
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_LIST, 0));
                // VIP变化，需要刷新达成礼包的状态
                G.ActBtnCtrl.update(false);
                let mainView = G.ViewCacher.mainView;
                if (null != mainView) {
                    mainView.onVipChange();
                }
                G.ChannelSDK.report(ReportType.VIPLEVELUP);
            }
        }
    }

    /**
	* 上马请求回复
	* @param msg
	*
	*/
    private _onMountRideResponse(response: Protocol.MountRideChange_Response): void {
        G.DataMgr.runtime.isWaitingRideResp = false;

        if (response.m_ushResultID == 0) {
            G.DataMgr.runtime.rideStatus = response.m_ucMountRide;

            if (response.m_ucMountRide == Macros.MountRide_Up) {
                //showEffectWithTarget(this.hero, EnumEffectName.MONTSUMMON, Effect3D.SKILL_EFFECT);
            }
            // 上马音效
            G.AudioMgr.playSound('sound/ui/uisound_20.mp3');
        }
    }

    /**
     * 处理伙伴升级。
     */
    private processHeroUpgrade() {
        let hero = G.UnitMgr.hero;

        // 检查功能开放
        G.DataMgr.funcLimitData.updateFuncStates();

        // 刷新所有装备的战斗力
        G.DataMgr.thingData.recalculateZdl();

        this.updateAllNpcQuestState(0);
        G.GuideMgr.onHeroUpgrade();
        G.ModuleMgr.questModule.onHeroUpgrade();
        G.ModuleMgr.heroModule.onHeroUpgrade();

        //G.GuideMgr.checkTrailAndFmtBossCtrl();
        G.ViewCacher.mainView.newFuncPreCtrl.updateView();
        //自动下载检查
        G.ViewCacher.mainView.enableAutoDownload();

        // 播放特效
        G.ViewCacher.mainUIEffectView.playLvUpAnim();
        let heroPos = hero.getWorldPosition();
        EffectPlayer.play(heroPos, null, 'other/shengji', 2, false, false);
        // 震屏
        //G.UnitMgr.heroFollower.Shake(Game.QuakeDirection.Right, 0.1, 2, 10);
        G.AudioMgr.playSound('sound/ui/uisound_levelup.mp3');
    }

    ///////////////////////////////////////////////// 采集怪相关 /////////////////////////////////////////////////

    /**
	* 对登录时候列出任务列表的时候所需要做的处理
	* 主要是针对采集怪 ，任务中涉及到采集怪的话，要让其可采
	*
	*/
    refreshAllCollectedMonster(monsterID: number, judgeResult: number): void {
        G.UnitMgr._setMonsterCollectable(monsterID, 0);
    }

    ///////////////////////////////////////////////// 掉落物相关 /////////////////////////////////////////////////

    private onRefreshSightDropNotify(body: Protocol.RefreshDroppedSightInfo_Notify): void {
        let len: number = body.m_stDroppedSightInfoList.m_ucNumber;
        let info: Protocol.DroppedThingInfo;
        for (let i: number = 0; i < len; ++i) {
            info = body.m_stDroppedSightInfoList.m_astDroppedInfo[i];

            if (info.m_iParam == 0) //新建
            {
                this.addDropThingByDropThingInfo(info);
            }
            else //变更
            {
                let dropThingCtrl: DropThingController = G.UnitMgr.getUnit(info.m_iUnitID) as DropThingController;
                if (dropThingCtrl != null) {
                    dropThingCtrl.Data.info = info;
                    dropThingCtrl.judgeCanGet();
                }
            }
        }
    }

    /**
    *增加掉落物品
    * @param elementPool
    * @param info
    * @return
    *
    */
    addDropThingByDropThingInfo(info: Protocol.DroppedThingInfo) {
        let config: GameConfig.ThingConfigM;
        if (GameIDUtil.isBagThingID(info.m_iThingID)) {
            config = ThingData.getThingConfig(info.m_iThingID) as GameConfig.ThingConfigM;
        } else {
            config = { m_iID: info.m_iThingID, m_iGroundIconID: info.m_iThingID, m_szName: KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, info.m_iThingID), m_ucColor: Color.getCurrencyColorId(info.m_iThingID) } as GameConfig.ThingConfigM;
        }

        let roleData: DropUnitData = new DropUnitData();
        roleData.id = info.m_iThingID;
        roleData.unitID = info.m_iUnitID;
        roleData.config = config;
        roleData.info = info;
        if (info.m_stSrcPos.m_uiX > 0) {
            roleData.x = info.m_stSrcPos.m_uiX;
            roleData.y = info.m_stSrcPos.m_uiY;
        } else {
            roleData.x = info.m_stCurPos.m_uiX;
            roleData.y = info.m_stCurPos.m_uiY;
        }
        G.UnitMgr.createDropThing(roleData);
    }

    ///////////////////////////////////////////////// 传送点相关 /////////////////////////////////////////////////

    /**
    * 新建传送点
    * 遍历地编中所有的传送点，根据传送点ID得到相应的表格配置，如果表格配置里配了相应的特效
    * 就在地图上显示相应的特效，并读取特效的表格，找到合适的偏移量
    * @param gateList
    *
    */
    newSceneTeleport(gateInfoList: GateInfo[]): void {
        let config: GameConfig.TeleportConfigM = null;
        let effectInfo: GameConfig.TeleportEffectM = null;
        let pos: UnityEngine.Vector2 = null;
        for (let gateInfo of gateInfoList) {
            if (gateInfo.isEnable) {
                G.UnitMgr._createTeleportEffect(gateInfo);
            }
        }
    }

    ///////////////////////////////////////////////// 隐藏功能 /////////////////////////////////////////////////

    /**
     * 针对avata改变的通知处理
     * @param msg
     *
     */
    private onAvataChangeNotify(notify: Protocol.AvatarChange_Notify): void {
        let role: UnitController = G.UnitMgr.getUnit(notify.m_iUnitID);
        if (null == role) {
            return;
        }

        if (role.Data.unitType == UnitCtrlType.role || role.Data.unitType == UnitCtrlType.hero) {
            let roleData = role.Data as RoleData;
            let avatar: Protocol.AvatarList = notify.m_stAvatarList;

            uts.assert(roleData.avatarList.m_aiAvatar.length == avatar.m_aiAvatar.length, "avatarlist长度不对啊!@moby");

            this.compareAvatarList(role as RoleController, avatar);

            (role as RoleController).onAvatarChange();

            role.onUpdateNameboard(null);
            //role.buffProxy.updateAllEffectPos();
        }
        if (role.Data.unitType == UnitCtrlType.hero) {
            G.ModuleMgr.heroModule.onAvatarChange();
        }
    }

    /**
    * 比较AvatarList
    * @param role
    * @param serverAvatar
    *
    */
    private compareAvatarList(role: RoleController, serverAvatar: Protocol.AvatarList): void {
        var localAvatar = role.Data.avatarList;
        if (serverAvatar.m_uiLingBaoID != localAvatar.m_uiLingBaoID) {
            localAvatar.m_uiLingBaoID = serverAvatar.m_uiLingBaoID;
            if (localAvatar.m_uiLingBaoID > 0) {
                if (role.lingbao != null) {
                    role.lingbao.updateLingbaoId(localAvatar.m_uiLingBaoID);
                }
                else {
                    G.UnitMgr.createLingbao(localAvatar.m_uiLingBaoID, role);
                }
            }
            else {
                G.UnitMgr.removeLingBao(role);
            }
        }
        role.Data.avatarList = serverAvatar;
    }

    /**
     * 怪物变身
     * @param notify
     */
    private onMonsterChangeAvatarNotify(notify: Protocol.CSMonsterChangeAvatar_Notify) {
        let unitCtrl = G.UnitMgr.getUnit(notify.m_iUnitID);
        if (null == unitCtrl || unitCtrl.Data.unitType != UnitCtrlType.monster) {
            return;
        }
        let monster = unitCtrl as MonsterController;
        if (monster == null) {
            return;
        }

        let position: UnityEngine.Vector2 = monster.getPixelPosition();

        if (notify.m_ucType == Macros.MONSTER_TO_ROLE) {
            // 怪变人
            monster.destroy(true);
            if (G.UnitMgr.SelectedUnit == monster) {
                G.UnitMgr.unselectUnit(0, false);
            }

            let roleCtrl = G.UnitMgr.createRoleByMonsterChangeAvatar(notify.m_stData.m_stRole, notify.m_iUnitID, G.DataMgr.sceneData.curSceneID);
            roleCtrl.setPixelPosition(position.x, position.y);

            // 怪变伙伴
            unitCtrl = G.UnitMgr.getUnit(notify.m_iPetUnitID);
            if (unitCtrl != null && unitCtrl.Data.unitType == UnitCtrlType.monster) {
                monster = unitCtrl as MonsterController;

                let roleData: RoleData = monster.Data;
                let petId: number = notify.m_stData.m_stRole.m_stCacheRole.m_stDBAllBeautyInfo.m_iBattlePetID;
                let petAttrCfg: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petId);
                if (null != petAttrCfg) {
                    roleData.config = MonsterData.getMonsterConfig(roleData.id);
                    roleData.unitID = notify.m_iPetUnitID;
                    roleData.name = petAttrCfg.m_szBeautyName;
                    roleData.campID = KeyWord.CAMP_ID_MONSTER_NEUTRAL;
                    monster.setPixelPosition(position.x, position.y);
                    monster.change2pet(petId, 0, notify.m_stData.m_stRole.m_stCacheRole.m_stRoleInfo.m_stBaseProfile.m_szNickName);
                }
            }
        }
    }

    onTeamChanged() {
        G.UnitMgr.updateAllRoleNameBoard(UnitCtrlType.role);
        G.UnitMgr.updateAllDropThingCanGet();
    }

    onGuildChanged(unitID: number, guildInfo: Protocol.GuildInfo) {
        let roleCtrl = G.UnitMgr.getRoleByUnitID(unitID);
        if (null == roleCtrl) {
            return;
        }

        roleCtrl.Data.guildId = guildInfo.m_uiGuildID;
        roleCtrl.Data.guildName = guildInfo.m_szGuildName;
        roleCtrl.Data.guildGrade = guildInfo.m_ucGrade;
        roleCtrl.Data.guildJoinTime = guildInfo.m_uiJoinTime;

        // 更新宗门名字
        roleCtrl.onUpdateNameboard(null);

        G.UnitMgr.updateAllRoleNameBoard(UnitCtrlType.role);

        if (UnitCtrlType.hero == roleCtrl.Data.unitType) {
            // 是玩家自己的宗门发生变更需要刷新
            G.UnitMgr._refreshGuildMonster();
            // 重新拉取任务进度获取宗门任务ID
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getListProgressResquestMsg());
            if (guildInfo.m_uiGuildID > 0) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchGuildAbstract());
            }
            else {
                // 离开宗门，如果当前正在接宗门任务，就取消
                if (G.ViewCacher.taskView.isShowingQuest(0, KeyWord.QUEST_TYPE_GUILD_DAILY)) {
                    G.ViewCacher.taskView.close();
                }
            }
        }
    }

    /**婚姻变化*/
    onHunYinChange(roleId: Protocol.RoleID = null) {
        if (roleId == null) {
            roleId = G.DataMgr.heroData.roleID;
        }
        let role = G.UnitMgr.getRoleByUIN(roleId.m_uiUin);
        if (null == role) {
            return;
        }
        role.onUpdateNameboard(null);
    }


    onGuildGradeChange(roleID: Protocol.RoleID, guildGrade: number): void {
        let role = G.UnitMgr.getRoleByUIN(roleID.m_uiUin);
        if (null == role) {
            return;
        }
        // 更新宗门职称
        role.Data.guildGrade = guildGrade;
        role.onUpdateNameboard(null);
    }

    onHunliLevelChange(roleId: Protocol.RoleID = null): void {
        if (roleId == null) {
            roleId = G.DataMgr.heroData.roleID;
        }
        let role = G.UnitMgr.getRoleByUIN(roleId.m_uiUin);
        if (null == role) {
            return;
        }
        role.onUpdateNameboard(null);
    }

    onRoleGuoyunChange(roleID: Protocol.RoleID, guoyunLv: number): void {
        let role: RoleController;
        if (null == roleID) {
            role = G.UnitMgr.hero;
        } else {
            role = G.UnitMgr.getRoleByUIN(roleID.m_uiUin);
        }
        if (null == role) {
            return;
        }

        role.Data.guoyunLevel = guoyunLv;
        if (0 == guoyunLv) {
            G.UnitMgr.removeGuoyunGoods(role);
        }
        else {
            G.UnitMgr.createGuoyun(guoyunLv, role);
        }
    }
    ///////////////////////////////////////////////// npc相关 /////////////////////////////////////////////////
    public updateAllNpcQuestState(npcId: number) {
        if (0 == npcId) {
            let list = G.UnitMgr.AllNPC;
            for (let npcIdKey in list) {
                let npcInfo = list[npcIdKey];
                if (null != npcInfo.model) {
                    npcInfo.model.updateQuestState();
                }
            }
        } else {
            let npc = G.UnitMgr.getNpc(npcId);
            if (npc) {
                npc.updateQuestState();
            }
        }
    }
    onMyPetFeiShengChange(id: number, feishengCount: number) {
        let petCtrl = G.UnitMgr.getMyPetById(id);
        if (petCtrl) {
            petCtrl.Data.feishengCount = feishengCount;
            petCtrl.onAvatarChanged();
        }
    }
}
export default UnitModule;