import { Global as G } from 'System/global'
import { MapCameraSetting } from 'System/map/mapCameraSetting'
import { Macros } from 'System/protocol/Macros'
import { Constants } from 'System/constants/Constants'
import { SkillData } from 'System/data/SkillData'
import { MapSceneConfig } from 'System/data/scene/MapSceneConfig'
import { CrossPath } from 'System/map/cross/CrossPath'
import { CrossIsland } from 'System/map/CrossIsland'
import { PathingState, TransportType, PositionState, FindPosStrategy, HeroGotoType, EnumThingID, UnitCtrlType, GameIDType, EnumMonsterRule } from 'System/constants/GameEnum'
import { QuestData } from 'System/data/QuestData'
import { NPCData } from 'System/data/NPCData'
import { MonsterData } from 'System/data/MonsterData'
import { MapObjects } from "System/map/mapobjects";
import { KeyWord } from 'System/constants/KeyWord'
import { SceneData } from 'System/data/scenedata'
import { PinstanceData } from 'System/data/PinstanceData'
import { ThingData } from 'System/data/thing/ThingData'
import { ThingIDUtil } from 'System/utils/ThingIDUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { AutoBuyInfo } from 'System/data/business/AutoBuyInfo'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { SceneInfo } from 'System/data/scene/SceneInfo'
import { UnitStatus } from 'System/utils/UnitStatus'
import { HeroController } from 'System/unit/hero/HeroController'
import { Teleport } from 'System/map/cross/Teleport'
import { GateInfo } from 'System/data/scene/GateInfo'
import { NPCInfo } from 'System/data/scene/NPCInfo'
import { UnitController } from 'System/unit/UnitController'
import { UnitUtil } from 'System/utils/UnitUtil'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { MainUIEffectView } from 'System/main/MainUIEffectView'
import { SimpleGridMgr } from 'System/map/SimpleGridMgr'
import { DropThingController } from 'System/unit/dropThing/DropThingController'
import { MonsterController } from 'System/unit/monster/MonsterController'
import { VipView, VipTab } from 'System/vip/VipView'
import { Profiler } from 'System/utils/Profiler'
import { MathUtil } from 'System/utils/MathUtil'

export class PathingVars {
    public pathingFunc;
    public pathingParam: IArguments;

    reset() {
        this.pathingFunc = null;
        this.pathingParam = null;
    }
}

export class MapManager {
    public tileMap: Game.TileMap = null;
    public otherSceneGridMgr: SimpleGridMgr = new SimpleGridMgr();
    /**当前地图的像素宽度*/
    public mapWidth: number;
    /**当前地图的像素高度*/
    public mapHeight: number;
    public widthInMeter: number;
    public heightInMeter: number;

    /**登录或切场景时从服务器获取的场景像素宽度*/
    public newMapWidthPixel: number;
    /**登录或切场景时从服务器获取的场景像素高度*/
    public newMapHeightPixel: number;

    crossPath: CrossPath;
    crossIsland: CrossIsland;

    /**是否正在自动寻路。*/
    isPathing: boolean;

    private crtPathingVars: PathingVars;

    private sinVec: Array<number>;
    private cosVec: Array<number>;

    /**跨场景寻路数据。*/
    private m_crossPathData: Teleport[];
    public get crossPathData() {
        return this.m_crossPathData;
    }

    /**点击地板时间。*/
    private m_lastClickFloorAt: number = 0;

    /**上一次移动的时间。*/
    private m_oldMoveStartTime: number = 0;

    /**是否不再提示自动购买筋斗云。*/
    private m_noPrompJdy: boolean;

    private _hero: HeroController = null;
    private get Hero() {
        if (this._hero == null) {
            this._hero = G.UnitMgr.hero;
        }
        return this._hero;
    }

    constructor() {
        //挂载tilemap脚本，用于寻路
        this.tileMap = G.Root.AddComponent(Game.TileMap.GetType()) as Game.TileMap;

        this.crossPath = new CrossPath();
        this.crossIsland = new CrossIsland();
        this.crtPathingVars = new PathingVars();

        // 预先计算好10方向寻路的角度
        let angles: Array<number> = [];
        this.sinVec = [];
        this.cosVec = [];

        // 原有的4方向寻路，约为-160°、-20°、26°、153°
        angles.push(Math.atan2(-25, -70), Math.atan2(-25, 70), Math.atan2(35, 70), Math.atan2(35, -70));
        // 扩展为10方向寻路，0到1增加了4、5，3到2增加了6、7，0到3增加了8， 1到2增加了9
        angles.push(Math.atan2(-70, -25), Math.atan2(-70, 25), Math.atan2(70, 35), Math.atan2(70, -35), Math.atan2(5, -70), Math.atan2(5, 70));

        let angleCount: number = angles.length;
        for (let i: number = 0; i < angleCount; i++) {
            this.sinVec.push(Math.sin(angles[i]));
            this.cosVec.push(Math.cos(angles[i]));
        }
    }
    clearCrossPathData() {
        this.m_crossPathData = null;
    }
    /**
     * 因2d和3d坐标转换需要用到地图尺寸进行计算，因此在切地图后，需要在特定时候调用本函数。
     */
    useNewMapSizePixel() {
        this.mapWidth = this.newMapWidthPixel;
        this.mapHeight = this.newMapHeightPixel;
        G.mapHeight = this.mapHeight;
        this.widthInMeter = this.mapWidth / G.CameraSetting.xMeterScale;
        this.heightInMeter = this.mapHeight / G.CameraSetting.yMeterScale;
    }
    /**
	* 寻路走向npc
	* @param questID
	* @param npcID
	*
	*/
    findPath2NpcByQuest(questID: number, npcID: number, isTransport: boolean = false, needPromp: boolean = false): PathingState {
        if (G.DataMgr.runtime.needTransport) {
            isTransport = true;
            G.DataMgr.runtime.needTransport = false;
        }

        if (G.DataMgr.runtime.isWaitTransprotResponse) {
            // 跳跃技能过程中不能传送
            G.DataMgr.runtime.setItemTransport(npcID, questID, false);
            return PathingState.BUSY;
        }

        // 同场景下判断距离是否有必要用飞鞋
        if (isTransport) {
            var sceneData = G.DataMgr.sceneData;
            var posConfig = sceneData.getNpcNav(npcID);
            if (posConfig && sceneData.curSceneID == posConfig.m_iSceneID) {
                var info = sceneData.getSceneNpcInfo(sceneData.curSceneID, npcID);
                if (info != null) {
                    let pos = this.Hero.getPixelPosition();
                    isTransport = this._getTransportType(info.x, info.y, pos.x, pos.y) != TransportType.none;
                }
            }
        }
        let ret: number = this.findPath2Npc(npcID, isTransport, questID, needPromp);

        if (!isTransport) {
            if (PathingState.CAN_REACH == ret) {
                this._autoPathing();
            }
            else if (PathingState.REACHED == ret) {
                G.ModuleMgr.questModule.onQuestWalkEnd(questID);
            }
            else if (PathingState.CANNOT_REACH == ret) {
                let npcConfig: GameConfig.NPCConfigM = NPCData.getNpcConfig(npcID);
                G.TipMgr.addMainFloatTip(uts.format('无法寻路到{0}', npcConfig.m_szNPCName), Macros.PROMPTMSG_TYPE_MIDDLE);
                G.DataMgr.runtime.jumpVar.jumpFirstID = 0;
            }
        }

        if (this.isPathing) {
            // 记录寻路状态
            this.crtPathingVars.pathingFunc = this.findPath2NpcByQuest;
            this.crtPathingVars.pathingParam = arguments;
        }

        return ret;
    }

    /**
     * 寻路走向某个目的点
     * @param questID
     * @param nodeName
     * @param canAStar
     *
     */
    findPath2TargetByQuest(questID: number, nodeIndex: number, isTransport: boolean = false, needPromp: boolean = false): PathingState {
        if (G.DataMgr.runtime.needTransport) {
            isTransport = true;
            G.DataMgr.runtime.needTransport = false;
        }

        if (G.DataMgr.runtime.isWaitTransprotResponse) {
            // 跳跃技能过程中不能传送
            //uts.log('findPath2TargetByQuest busy: ' + questID);
            return PathingState.BUSY;
        }

        G.ModuleMgr.deputyModule.startEndHangUp(false);
        // 先清除标记
        G.DataMgr.runtime.resetAllBut();

        let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(questID);
        let nodeConfig: GameConfig.QuestNodeConfigCli = QuestData.getConfigByQuestID(questID).m_astQuestNodeConfig[nodeIndex];

        let posConfig: GameConfig.NavigationConfigM = G.DataMgr.sceneData.getQuestNav(questID, nodeIndex);
        if (isTransport) {
            // 同场景下判断距离是否有必要用飞鞋
            if (G.DataMgr.sceneData.curSceneID == posConfig.m_iSceneID) {
                let pos = this.Hero.getPixelPosition();
                isTransport = this._getTransportType(posConfig.m_stPosition.m_uiX, posConfig.m_stPosition.m_uiY, pos.x, pos.y) != TransportType.none;
            }
        }

        if (KeyWord.QUEST_NODE_KILL_ROLE != nodeConfig.m_ucType && KeyWord.QUEST_NODE_KILL_INVADEROLE != nodeConfig.m_ucType) {
            // 普通任务直接寻路
            let sceneRet = this._processScene(posConfig.m_iSceneID, questID, 0, isTransport, needPromp);
            if (sceneRet >= 0) {
                //uts.log('findPath2TargetByQuest scene return: ' + questID + ', sceneRet = ' + sceneRet);
                return sceneRet;
            }
        }

        // 杀怪或采集先判断当前场景视野内有没有
        let findSuitablePos = false;
        let heroPos: UnityEngine.Vector2 = this.Hero.getPixelPosition();

        let targetX: number = posConfig.m_stPosition.m_uiX;
        let targetY: number = posConfig.m_stPosition.m_uiY;
        let ret = -1;
        let needWalk = true;
        let monsterID = 0;

        let curSceneID = G.DataMgr.sceneData.curSceneID;
        if (posConfig.m_iSceneID == curSceneID &&
            (KeyWord.QUEST_NODE_MONSTER == nodeConfig.m_ucType || KeyWord.QUEST_NODE_MONSTER_SHARE == nodeConfig.m_ucType ||
                KeyWord.QUEST_NODE_COLLECT == nodeConfig.m_ucType || KeyWord.QUEST_NODE_COLLECT_SHARE == nodeConfig.m_ucType || KeyWord.QUEST_NODE_FMT_RANDOM == nodeConfig.m_ucType)) {
            monsterID = G.DataMgr.questData.getMonsterIDByQuestNode(questID, nodeIndex);
            let monsters = G.UnitMgr.getUnitById(monsterID, 1);
            if (monsters.length > 0 && UnitUtil.isMonster(monsters[0])) {
                let monster = monsters[0] as MonsterController;
                let monsterPos: UnityEngine.Vector2 = monster.getPixelPosition();
                if (this.tileMap.IsConnectedPixel(heroPos.x, heroPos.y, monsterPos.x, monsterPos.y)) {
                    //let a = G.ModuleMgr.questModule.onQuestWalkEnd(questID, nodeIndex, false);
                    // 视野中已经有了，为了直接打过去，这里跳过寻路步骤
                    if (this.tileMap.TestWalkStraight(heroPos.x, heroPos.y, monsterPos.x, monsterPos.y)) {
                        ret = PathingState.REACHED;
                        needWalk = false;
                    }
                    targetX = monsterPos.x;
                    targetY = monsterPos.y;
                }

                if (KeyWord.MONSTER_TYPE_DECORATE == monster.Config.m_bDignity) {
                    // 如果这只怪物是前台怪，那么需要保持点距离，因为前台怪的寻路配置是根据前台怪的位置生成的，这里要做个偏差，否则会碾压到怪物身上
                    findSuitablePos = true;
                }
            }
        }

        let keepAway = 0;
        if (findSuitablePos) {
            let skill: GameConfig.SkillConfigM = G.DataMgr.skillData.getBornSkill();
            keepAway = this.getSuitableKeepAway(skill, 0);
        }

        if (isTransport) {
            ret = this._transportToPos(posConfig.m_iSceneID, targetX, targetY, questID, monsterID, keepAway);
            if (PathingState.CANNOT_REACH != ret) {
                // 如果传送失败则继续走路
                //uts.log('findPath2TargetByQuest transport cannot reach: ' + questID);
                return ret;
            }
        }

        if (needWalk) {
            //if (curSceneID != posConfig.m_iSceneID) {
            //    // 如果这个任务是要去封魔塔的，直接飞进去，不然路太长了走断腿
            //    let fmtCfg = G.DataMgr.fmtData.getFmtCfgBySceneId(posConfig.m_iSceneID);
            //    if (null != fmtCfg && G.ActionHandler.goToFmtLayer(fmtCfg.m_iLayer, monsterID, questID)) {
            //        needWalk = false;
            //    }
            //}

            //if (needWalk) {
            //    ret = this.moveHeroToScenePos(posConfig.m_iSceneID, targetX, targetY, true, keepAway);
            //}
            ret = this.moveHeroToScenePos(posConfig.m_iSceneID, targetX, targetY, true, keepAway);
        }

        //uts.log('findPath2TargetByQuest: quest = ' + questID + ', needWalk = ' + needWalk + ', heroPos = ' + heroPos.ToString() + ', targetX = ' + targetX + ', targetY = ' + targetY + ', keepAway = ' + keepAway + ', ret = ' + ret);

        if (PathingState.CANNOT_REACH != ret) {
            if (!G.DataMgr.runtime.isDoingQuest()) {
                if (this.Hero.isAboutToJumpOrJumping) {
                    G.DataMgr.runtime.setJumpQuest(questID, nodeIndex);
                }
                else {
                    G.DataMgr.runtime.setMoveQuest(questID, nodeIndex);
                }
            }
        }

        if (PathingState.CAN_REACH == ret) {
            this._autoPathing();
        }
        else if (PathingState.REACHED == ret) {
            G.ModuleMgr.questModule.onQuestWalkEnd(questID, nodeIndex);
        }

        if (this.isPathing) {
            // 记录寻路状态
            this.crtPathingVars.pathingFunc = this.findPath2TargetByQuest;
            this.crtPathingVars.pathingParam = arguments;
        }

        return ret;
    }
    /**
     * 寻路到指定的NPC。本接口会设置寻路状态，所以调用本接口后注意不要覆盖掉这些状态。
     * @param npcID NPC的ID。
     * @param isTransport
     * @param questFeedBack  是否任务面板点击的小飞鞋
     *
     */
    findPath2Npc(npcID: number, isTransport: boolean, questID = 0, needPromp = false, walkIfCannotTransport = false): PathingState {

        if (G.DataMgr.runtime.needTransport) {
            isTransport = true;
            G.DataMgr.runtime.needTransport = false;
        }
        if (G.DataMgr.runtime.isWaitTransprotResponse) {
            // 跳跃技能过程中不能传送
            return PathingState.BUSY;
        }
        G.ModuleMgr.deputyModule.startEndHangUp(false);
        if (questID <= 0) {
            // 不是去做任务的话就清除标记
            G.DataMgr.runtime.resetAllBut();
        }
        // 处理跟副本相关的逻辑
        let sceneData: SceneData = G.DataMgr.sceneData;
        let posConfig: GameConfig.NavigationConfigM = sceneData.getNpcNav(npcID);

        let ret: number;

        if (posConfig == null) {
            return PathingState.CANNOT_REACH;
        }
        ret = this._processScene(posConfig.m_iSceneID, questID, npcID, isTransport, needPromp);
        if (ret >= 0) {
            return ret;
        }
        if (isTransport) {
            ret = this._transportToNpc(posConfig.m_iSceneID, npcID, questID);
            if (PathingState.CANNOT_REACH != ret || !walkIfCannotTransport) {
                return ret;
            }
        }
        // 先记录状态，因可能直接Reach，触发状态判断
        G.DataMgr.runtime.makeCopy();
        if (!G.DataMgr.runtime.isDoingQuest()) {
            // 不能覆盖原有标记
            if (this.Hero.isAboutToJumpOrJumping) {
                G.DataMgr.runtime.setJumpQuest(questID);
            }
            else {
                G.DataMgr.runtime.setMoveQuest(questID);
            }
        }
        //如果任务有配跳跃，不管能不能直走优先跳
        let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(questID);
        if (!isTransport && questConfig != null) {
            if (null != questConfig.acceptJumpSeq) {
                // 接任务跳，需要检查是否已经接了该任务
                if (G.DataMgr.questData.isQuestInDoingList(questConfig.m_iQuestID) && !G.DataMgr.questData.isQuestCompletingByID(questConfig.m_iQuestID)) {
                    G.DataMgr.runtime.jumpVar.jumpFirstID = questConfig.acceptJumpSeq[0];
                }
            }
            else if (questConfig.m_iPreQuestID > 0) {
                let preQeustCfg = QuestData.getConfigByQuestID(questConfig.m_iPreQuestID);
                if (null != preQeustCfg.finishJumpSeq) {
                    // 完成任务跳，需要检查是否可以完成该任务
                    if (G.DataMgr.questData.isQuestCompleted(preQeustCfg.m_iQuestID)) {
                        G.DataMgr.runtime.jumpVar.jumpFirstID = preQeustCfg.finishJumpSeq[0];
                    }
                }
            }
        }
        ret = this.moveHeroToTargetID(posConfig.m_iSceneID, npcID);
        if (PathingState.CAN_REACH == ret) {
            this._autoPathing();
        } else {
            G.DataMgr.runtime.recover2lastCopy();
        }

        if (this.isPathing) {
            // 记录寻路状态
            this.crtPathingVars.pathingFunc = this.findPath2Npc;
            this.crtPathingVars.pathingParam = arguments;
        }
        return ret;
    }

    /**
     * 前往指定场景的指定坐标。
     * @param sceneID		地图编号
     * @param x 			x坐标，非正数表示仅仅移动到目标场景。
     * @param y 			y坐标，非正数表示仅仅移动到目标场景。
     * @param1 dstZone 		目的zone，默认为0，表示当前zone。
     * @param isTransport	是否使用小飞鞋
     * @param needPromp		是否打印提示信息
     * @param strategy      目标点处理策略
     * @return
     *
     */
    goToPos(sceneID: number, x = 0, y = 0, isTransport = false, needPromp = false, strategy: FindPosStrategy = 0, monsterID = 0, toAutoFight = false, distance = 0): PathingState {
        if (G.DataMgr.runtime.needTransport) {
            isTransport = true;
            G.DataMgr.runtime.needTransport = false;
        }

        let keepAway = 0;
        if (FindPosStrategy.Specified != strategy) {
            //目标点有效时
            let startPixel = this.Hero.getPixelPosition();
            let targetPos: UnityEngine.Vector2;
            if (FindPosStrategy.MakeSureValid == strategy) {
                if (sceneID == G.DataMgr.sceneData.curSceneID) {
                    // 当前场景
                    targetPos = this.tileMap.SearchValidGrid(startPixel.x, startPixel.y, x, y, false, false);
                }
                //else if (sceneID == this.otherSceneGridMgr.sceneID) {
                //    targetPos = this.otherSceneGridMgr.searchValidGrid(x, y);
                //}
                if (targetPos == null) {
                    return PathingState.CANNOT_REACH;
                }
                x = targetPos.x;
                y = targetPos.y;
            } else {
                keepAway = this.getSuitableKeepAway(null, distance);
            }
        }

        if (isTransport) {
            let pos = this.Hero.getPixelPosition();
            isTransport = this._getTransportType(x, y, pos.x, pos.y) != TransportType.none;
        }

        let ret: PathingState;

        if (isTransport) {
            ret = this._transportToPos(sceneID, x, y, 0, monsterID, keepAway);
            return ret;
        }

        // 停止挂机
        G.ModuleMgr.deputyModule.pauseResumeHangUp(true);

        ret = this.moveHeroToScenePos(sceneID, x, y, true, keepAway);

        if (PathingState.CAN_REACH == ret) {
            if (sceneID == G.DataMgr.sceneData.curSceneID) {
                // 当前场景需要清除掉跨场景寻路数据
                this.clearCrossPathData();
            }
            this._autoPathing();
        }
        else if (PathingState.CANNOT_REACH == ret) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip('目标地点不可到达，请换个地方走吧。');
            }
            // 恢复挂机
            G.ModuleMgr.deputyModule.pauseResumeHangUp(false);
        }

        if (PathingState.CAN_REACH == ret) {
            if (toAutoFight) {
                G.DataMgr.runtime.moveTarget.setHangUp(monsterID);
            } else if (monsterID > 0) {
                G.DataMgr.runtime.moveTarget.setMonsterID(monsterID);
            }
        } else if (PathingState.REACHED == ret) {
            if (toAutoFight) {
                G.ModuleMgr.deputyModule.startEndHangUp(true, monsterID, EnumMonsterRule.specifiedFirst);
            }
        }

        if (this.isPathing) {
            // 记录寻路状态
            this.crtPathingVars.pathingFunc = this.goToPos;
            this.crtPathingVars.pathingParam = arguments;
        }

        return ret;
    }

    /**
     * 处理传送时与场景或副本相关的逻辑。返回-1表示不受副本影响。
     * @param sceneID
     * @param questID
     * @param isTransport
     * @return
     *
     */
    private _processScene(sceneID: number, questID: number, npcId: number, isTransport: boolean, needPromp: boolean = false): number {
        // 判断场景是否已经初始化完成
        let sceneData: SceneData = G.DataMgr.sceneData;
        if (!sceneData.isEnterSceneComplete) {
            // 场景未完成
            G.DataMgr.runtime.setWaitQuest(questID, sceneID, 0);
            if (needPromp) {
                G.TipMgr.addMainFloatTip('尚未进入场景中，请稍侯再试...');
            }
            return PathingState.CAN_REACH;
        }

        // 如果是离开封 魔塔去别的场景则先回到主城再寻路
        // if (!isTransport) {
        //     let fmtData = G.DataMgr.fmtData;
        //     if (null == fmtData.getFmtCfgBySceneId(sceneID) && null != fmtData.getFmtCfgBySceneId(sceneData.curSceneID)) {
        //         if (G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_BACKTOCITY, 0, 0, questID, false, npcId)) {
        //             return PathingState.CAN_REACH;
        //         }
        //     }
        // }

        // 如果当前在副本里而目的地却在外面那就等出副本
        if (sceneData.curPinstanceID > 0 && sceneData.curSceneID != sceneID) {
            G.DataMgr.runtime.setWaitQuest(questID, 0, sceneData.curPinstanceID);
            if (needPromp) {
                G.TipMgr.addMainFloatTip('当前副本中无法进行此操作。');
            }
            return PathingState.CAN_REACH;
        }

        // 如果该场景是副本场景就直接进副本
        // 单个场景ID可以对应很多个副本ID，寻路时只考虑简单情况
        let pids: number[] = PinstanceData.getPinstancesBySceneId(sceneID);
        if (null != pids && pids.indexOf(sceneData.curPinstanceID) < 0) {
            G.DataMgr.runtime.setWaitQuest(questID, 0, pids[0]);
            G.ModuleMgr.pinstanceModule.tryEnterPinstance(pids[0], 0, 0, false);
            return PathingState.CAN_REACH;
        }

        return -1;
    }

    stopAutoPath(): void {
        this.isPathing = false;
        this.crtPathingVars.reset();
        this.m_lastClickFloorAt = 0;
        // 关闭自动寻路标识
        G.ViewCacher.mainUIEffectView.stopPathingEffect();
    }

    /**
     * 处理点击地板的后续操作，如果自动寻路中的话，必须双击地板才能停下。
     * @return
     *
     */
    checkAutoPathing(): boolean {
        if (this.isPathing) {
            let now: number = UnityEngine.Time.realtimeSinceStartup;
            let oldClickFloorAt: number = this.m_lastClickFloorAt;
            this.m_lastClickFloorAt = now;
            if (oldClickFloorAt > 0 && now - oldClickFloorAt < 1000) {
                this.stopAutoPath();
                return true;
            }
            else {
                G.TipMgr.addMainFloatTip('再次点击退出自动寻路！', Macros.PROMPTMSG_TYPE_MIDDLE);
                return false;
            }
        }

        return true;
    }

    /**
     * 恢复寻路。
     *
     */
    continuePathing(needTransport: boolean): PathingState {
        if (this.isPathing && null != this.crtPathingVars.pathingFunc && null != this.crtPathingVars.pathingParam) {
            G.DataMgr.runtime.needTransport = needTransport;
            let func = this.crtPathingVars.pathingFunc;
            let param: IArguments = this.crtPathingVars.pathingParam;
            this.crtPathingVars.reset();
            return func.apply(this, param);
        }
        else {
            uts.log('恢复寻路失败： ' + this.isPathing);
            return PathingState.CANNOT_REACH;
        }
    }

    private _autoPathing(): void {
        if (this.isPathing) {
            return;
        }

        this.m_lastClickFloorAt = 0;
        this.isPathing = true;

        // 显示自动寻路标识
        G.ViewCacher.mainUIEffectView.playPathingEffect();
    }

    ///////////////////////////////////////////////////// 场景内移动 /////////////////////////////////////////////////////

    /**
	* 直接走向npc
	* 目前是点击任务列表上的npc后触发的动作
	* @param targetSceneID NPC所在的场景。如果不确定，则传递0,0表示在当前场景搜寻。
	* @param targetID NPC的ID。
	* @param targetZoneID 目的Zone的ID，0表示当前Zone。
	*
	* @return 是否成功。
	*
	*/
    moveHeroToTargetID(targetSceneID: number, targetID: number): PathingState {
        let gotoType: HeroGotoType;
        if (GameIDUtil.isNPCID(targetID)) {
            // 校验NPC是否存在
            let npc: GameConfig.NPCConfigM = NPCData.getNpcConfig(targetID);
            if (npc == null) {
                if (defines.has('_DEBUG')) {
                    uts.assert(false, '找不到NPC配置：' + targetID);
                }
                return PathingState.CANNOT_REACH;
            }
            gotoType = HeroGotoType.NONE;
        } else if (GameIDUtil.isMonsterID(targetID)) {
            let monsterCfg: GameConfig.MonsterConfigM = MonsterData.getMonsterConfig(targetID);
            if (monsterCfg == null) {
                if (defines.has('_DEBUG')) {
                    uts.assert(false, '找不到怪物配置：' + targetID);
                }
                return PathingState.CANNOT_REACH;
            }
            gotoType = HeroGotoType.ATTACK_AND_HANGUP;
        } else {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '不支持的寻路类型');
            }
            return PathingState.CANNOT_REACH;
        }

        let sceneData: SceneData = G.DataMgr.sceneData;
        if (0 == targetSceneID) {
            // 如果没有指定场景，即认为是当前场景
            targetSceneID = sceneData.curSceneID;
        }

        G.DataMgr.heroData.gotoType = gotoType;

        if (sceneData.curSceneID == targetSceneID) //同场景的话直接寻路过去
        {
            return this._moveToTarget(targetID);
        }
        else {
            let beginUnit: Teleport = new Teleport();
            let endUnit: Teleport = new Teleport();
            beginUnit.vSceneId = sceneData.curSceneID; //起始位置是当前场景

            //在position的数据中寻找要寻路的npc所在的场景，这里应该是npc所在的场景
            endUnit.vSceneId = targetSceneID;
            endUnit.targetID = targetID;

            return this._moveToDiffScenePosOrTarget(beginUnit, endUnit);
        }
    }

    /**
	* 讲玩家移动到指定场景上的指定位置。
	* @param targetSceneID
	* @param x 				x坐标，非正数表示仅仅移动到目标场景。
	* @param y 				y坐标，非正数表示仅仅移动到目标场景。
	* @param isNeedClear 		停止攻击
	* @param tryJump		 	是否尝试寻找跳跃点，为了防止重复a星导致性能下降，调用时慎重考虑传值，在确定已经寻找过一遍跳跃点后传false。
	* @return
	*
	*/
    moveHeroToScenePos(targetSceneID: number, targetPosX = 0, targetPosY = 0, tryJump = true, keepAway = 0): PathingState {
        if (G.DataMgr.sceneData.curSceneID == targetSceneID) //同一个场景的话直接移动过去
        {
            if (targetPosX >= 0 && targetPosY >= 0) {
                return this.moveHeroToPos(targetPosX, targetPosY, tryJump, keepAway);
            }
            else {
                return PathingState.REACHED;
            }
        }
        else //跨场景
        {
            let beginUnit: Teleport = new Teleport();
            beginUnit.vSceneId = G.DataMgr.sceneData.curSceneID;

            let endUnit: Teleport = new Teleport();
            endUnit.vSceneId = targetSceneID;
            endUnit.keepAway = keepAway;
            if (targetPosX >= 0 && targetPosY >= 0) {
                endUnit.position = new UnityEngine.Vector2(targetPosX, targetPosY);
            }

            return this._moveToDiffScenePosOrTarget(beginUnit, endUnit);
        }
    }

    /**
	* 让玩家跨场景的时候移动处理
	*
	* @param beginUnit
	* @param endUnit
	*
	*/
    private _moveToDiffScenePosOrTarget(beginUnit: Teleport, endUnit: Teleport): PathingState {
        if (defines.has('_DEBUG')) {
            uts.assert(G.DataMgr.sceneData.curSceneID == beginUnit.vSceneId && beginUnit.vSceneId != endUnit.vSceneId, '参数必须合法');
        }

        //取得跨场景的寻路数据
        let crossPathList: Teleport[] = this.crossPath.findCrossPathByUnit(beginUnit, endUnit);

        let result: PathingState;
        if (crossPathList != null && crossPathList.length > 0) {
            if (endUnit.targetID > 0 || endUnit.id > 0 || null != endUnit.position) {
                crossPathList.push(endUnit);
            }

            let teleport: Teleport = crossPathList.shift();
            this.m_crossPathData = crossPathList;
            result = this._moveHeroByTeleport(teleport);
        }
        else {
            G.TipMgr.addMainFloatTip('无法寻路到指定位置', Macros.PROMPTMSG_TYPE_MIDDLE);
            result = PathingState.CANNOT_REACH;
        }

        return result;
    }

    /**
	* 走向某个传送点或者某个Teleport中的某个目标或者位置
	* @param teleport
	*
	*/
    private _moveHeroByTeleport(teleport: Teleport): PathingState {
        let sceneData: SceneData = G.DataMgr.sceneData;
        if (defines.has('_DEBUG')) {
            uts.assert(sceneData.curSceneID == teleport.vSceneId, '当前场景为' + sceneData.curSceneID + '，而寻路的传送点' + teleport.id + '却在场景' + teleport.vSceneId + '上');
        }

        let result: PathingState;

        if (teleport.targetID > 0) // 如果有targetID，则直接走到目标点的位置，这个是在表格里面配的
        {
            //一般用在最后一个单位
            result = this._moveToTarget(teleport.targetID);
        }
        else if (null != teleport.position) {
            if (0 == teleport.position.x || 0 == teleport.position.y) {
                return PathingState.REACHED;
            }
            else if (Math.abs(teleport.position.x) <= 1 && Math.abs(teleport.position.y) <= 1) {
                teleport.position.x *= sceneData.curSceneConfig.curMapWidth;
                teleport.position.y *= sceneData.curSceneConfig.curMapHeight;
            }
            result = this.moveHeroToPos(teleport.position.x, teleport.position.y, true, teleport.keepAway);
        }
        else if (teleport.id > 0) // 走到传送点的位置
        {
            let gateInfo: GateInfo = sceneData.getGateInfo(sceneData.curSceneID, teleport.id);
            if (null != gateInfo) {
                result = this.moveHeroToScenePos(sceneData.curSceneID, gateInfo.x, gateInfo.y); //走向传送点的位置
            }
            else {
                uts.logWarning('场景' + sceneData.curSceneID + '找不到传送点' + teleport.id);
            }
        }
        else {
            uts.assert(false, '错误的用法！');
        }

        return result;
    }

    /**
	* 走向某个目标身边
	* @param target
	*
	* @return 是否成功。
	*
	*/
    private _moveToTarget(targetID: number): PathingState {
        let result: PathingState;
        let targets = G.UnitMgr.getUnitById(targetID, 1);
        if (targets.length == 0) {
            let info: NPCInfo = G.DataMgr.sceneData.getSceneNpcInfo(G.DataMgr.sceneData.curSceneID, targetID);
            if (info != null) {
                G.DataMgr.runtime.moveTarget.setNpcId(info.npcID);
                result = this.gotoTargetPos(targetID, null, info.x, info.y, false, null);
            }
            else {
                result = PathingState.CANNOT_REACH;
            }
        }
        else {
            result = this.moveToTarget(targets[0]);
        }

        return result;
    }

    /**
	* 移动到指定的目标点。
	* @param pos 目标点。
	* @param isFixedPos 是否固定的目标点，true表示移动到指定的目标点，false表示根据技能或目标单位确定合适的目标点。
	* @param skillConfig 关联的技能配置。
	* @return
	*
	*/
    gotoTargetPos(targetID: number, target: UnitController, posX: number, posY: number, isFixedPos: boolean, skillConfig: GameConfig.SkillConfigM = null): PathingState {
        let heroPos: UnityEngine.Vector2 = this.Hero.getPixelPosition();
        let posState = this.getPosState(skillConfig, heroPos, posX, posY, G.DataMgr.heroData.gotoType);
        if (posState == PositionState.VALID) //合法的范围内
        {
            //this.Hero.onReachTarget(); //走到目的目标身边的逻辑

            return PathingState.REACHED;
        }

        let keepAway = 0;
        if (!isFixedPos) {
            // 非固定点，寻找一个合适的坐标
            keepAway = this.getSuitableKeepAway(skillConfig, 0);
        }

        let ret = this.moveHeroToScenePos(G.DataMgr.sceneData.curSceneID, posX, posY, true, keepAway);

        if (this.Hero.isAboutToJumpOrJumping && PathingState.CAN_REACH == ret) {
            // 可连通，那么可以采用此跳跃路径
            if (null != target) {
                G.DataMgr.runtime.jumpVar.setTarget(target, G.DataMgr.heroData.gotoType, skillConfig);
            }
            else if (targetID > 0) {
                G.DataMgr.runtime.jumpVar.setNpcId(targetID);
            }
        }

        return ret;
    }

    /**
	* 走向指定的同场景坐标并施法技能。
	* @return
	*
	*/
    gotoPosAndCastSkill(x: number, y: number, skillConfig: GameConfig.SkillConfigM): PathingState {
        this.m_crossPathData = null; //都走向某个坐标了，清除掉跨场景数据

        let ret: PathingState = 0;
        let heroPos = this.Hero.getPixelPosition();
        let posState = G.Mapmgr.getPosState(skillConfig, heroPos, x, y);
        if (posState == PositionState.VALID) //合法的范围内
        {
            this.Hero.attackAuto();
            ret = PathingState.REACHED;
        }
        else {
            let keepAway = G.Mapmgr.getSuitableKeepAway(skillConfig, 0);
            G.DataMgr.heroData.gotoType = HeroGotoType.ATTACK;
            ret = this.moveHeroToScenePos(G.DataMgr.sceneData.curSceneID, x, y, true, keepAway);
            if (PathingState.CAN_REACH == ret) {
                G.DataMgr.runtime.moveTarget.setSkillPos(x, y);
            }
        }

        return ret;
    }

    /**
	* 用鼠标走向某一个像素坐标
	* @param x
	* @param y
	* @return
	*
	*/
    moveHeroToBlank(x: number, y: number): PathingState {
        G.DataMgr.heroData.gotoType = HeroGotoType.NONE;
        let selectedUnit: UnitController = G.UnitMgr.SelectedUnit;
        if (null != selectedUnit && UnitCtrlType.collection == selectedUnit.Data.unitType) {
            G.UnitMgr.unselectUnit(0, false);
        }

        //目标点有效时：
        let heroPos: UnityEngine.Vector2 = this.Hero.getPixelPosition();
        let targetPos: UnityEngine.Vector2 = this.tileMap.SearchValidGrid(heroPos.x, heroPos.y, x, y, true, false);
        if (targetPos == null) {
            return PathingState.CANNOT_REACH;
        }
        x = targetPos.x;
        y = targetPos.y;

        let now: number = UnityEngine.Time.realtimeSinceStartup;
        if (now - this.m_oldMoveStartTime < 0.5) {
            //uts.log(uts.format('Too frequently! now = {0}, m_oldMoveStartTime = {1}', now, this.m_oldMoveStartTime));
            return PathingState.BUSY;
        }
        this.m_crossPathData = null;
        let canMove: number = this.moveHeroToScenePos(G.DataMgr.sceneData.curSceneID, x, y);
        //可以走：
        if (PathingState.CAN_REACH == canMove || PathingState.REACHED == canMove) {
            this.m_oldMoveStartTime = now;
        }
        return canMove;
    }

    /**
	* 直接让玩家移动到同场景的指定位置
	* @param targetPosX
	* @param targetPosY
	* @param tryJump 是否尝试寻找跳跃点，为了防止重复a星导致性能下降，调用时慎重考虑传值，在确定已经寻找过一遍跳跃点后传false。
	*
	*/
    moveHeroToPos(targetPosX: number, targetPosY: number, tryJump = true, keepAway = 0): PathingState {
        // 如果是原点的话就不需要挪屁股了
        let heroPos: UnityEngine.Vector2 = this.Hero.getPixelPosition();
        let distance = MathUtil.getDistance(targetPosX, targetPosY, heroPos.x, heroPos.y);
        if (distance <= 1) {
            this.Hero.setPixelPosition(targetPosX, targetPosY);
            return PathingState.REACHED;
        }
        //获得路径
        let byJump = false;
        let jumpVar = G.DataMgr.runtime.jumpVar;
        let path = this.tileMap.GetPathInPixel(heroPos.x, heroPos.y, targetPosX, targetPosY);
        if (tryJump && (path == null || jumpVar.jumpFirstID > 0)) {
            // 无法过去，要检查是否可以通过跳跃点连通
            let tempPath: UnityEngine.Vector2[] = this._getLinkJumpTeleport(targetPosX, targetPosY, jumpVar.jumpFirstID);
            if (tempPath != null && (path == null || Game.ArrayHelper.GetArrayLength(tempPath) <= Game.ArrayHelper.GetArrayLength(path))) {
                path = tempPath;
                byJump = true;

                // 由于可能存在多种跳跃路径，而计算得出的路径可能出现冗余节点，故此处需进行节点优化
                // 最好的做法是类似跨场景寻路做跨岛寻路，直接堆运算，但需要改CS代码，所以只能作罢
                // by teppei 2017/7/24
                let cnt = jumpVar.jumpPos.length;
                for (let i = 1; i < cnt; i++) {
                    let jumpPos = jumpVar.jumpPos[i];
                    if (this.tileMap.IsConnectedPixel(targetPosX, targetPosY, jumpPos.x, jumpPos.y)) {
                        jumpVar.jumpPos.length = i;
                        break;
                    }
                }
            }
        }
        let localPath: UnityEngine.Vector3[] = [];
        let serverPath: Protocol.UnitPosition[] = [];
        if (path != null) {
            this.processRawPath(heroPos, targetPosX, targetPosY, path, localPath, serverPath, byJump, keepAway);
        }

        let spLen = serverPath.length;
        if (spLen == 0) {
            return PathingState.CANNOT_REACH;
        } else if (spLen == 1) {
            return PathingState.REACHED;
        }

        if (byJump) {
            //第一个跳跃点作为路径传过去了
            jumpVar.jumpPos.shift();
            jumpVar.setGotoPos(targetPosX, targetPosY, G.DataMgr.heroData.gotoType, keepAway);
        }
        this.Hero.moveAndInformServer(localPath, serverPath);
        this.Hero.isAboutToJumpOrJumping = byJump;

        return PathingState.CAN_REACH;
    }
    private processRawPath(crtPos: UnityEngine.Vector2, targetX: number, targetY: number, rawPath: UnityEngine.Vector2[], localPath: UnityEngine.Vector3[], serverPath: Protocol.UnitPosition[], byJump: boolean, keepAway: number) {
        let pathLength: number = Game.ArrayHelper.GetArrayLength(rawPath);
        let svrNode: Protocol.UnitPosition = {} as Protocol.UnitPosition;
        svrNode.m_uiX = crtPos.x;
        svrNode.m_uiY = crtPos.y;
        serverPath.push(svrNode);
        let pathNodeByPixel: UnityEngine.Vector2 = G.cacheVec2;
        let cacheList = G.cacheV3List;
        for (let i = 0; i < pathLength; i++) {
            Game.Tools.GetVector2GroupItem(rawPath, i, pathNodeByPixel);
            let px = pathNodeByPixel.x;
            let py = pathNodeByPixel.y;
            svrNode = {} as Protocol.UnitPosition;
            svrNode.m_uiX = px;
            svrNode.m_uiY = py;
            if (!byJump && keepAway > 0 && i == pathLength - 1) {
                // 非跳跃，与终点拉开指定距离
                let preNode = serverPath[i];
                let preDistance = Math.sqrt(Math.pow(px - preNode.m_uiX, 2) + Math.pow(py - preNode.m_uiY, 2));
                if (preDistance <= keepAway) {
                    // 倒数第二个节点距终点距离小于指定间距，直接去掉终点
                    break;
                }
                let forwardR = (1 - keepAway / preDistance);
                svrNode.m_uiX = Math.floor(preNode.m_uiX + forwardR * (px - preNode.m_uiX));
                svrNode.m_uiY = Math.round(preNode.m_uiY + forwardR * (py - preNode.m_uiY));
                let canWalkStraight = this.makeSureCanWalkStraight(preNode, svrNode);
                if (!canWalkStraight) {
                    svrNode.m_uiX = px;
                    svrNode.m_uiY = py;
                }
            }

            if (pathLength == 1 && (svrNode.m_uiX == crtPos.x || svrNode.m_uiX == crtPos.y)) {
                // 网格寻路某些情况下路径节点跟起点一样，这种情况直接将节点设置为终点
                svrNode.m_uiX = targetX;
                svrNode.m_uiY = targetY;
            }
            serverPath.push(svrNode);
            if (!cacheList[i]) {
                cacheList[i] = new UnityEngine.Vector3(G.serverPixelXToLocalPositionX(svrNode.m_uiX), 0, G.serverPixelYToLocalPositionY(svrNode.m_uiY));
            }
            else {
                cacheList[i].Set(G.serverPixelXToLocalPositionX(svrNode.m_uiX), 0, G.serverPixelYToLocalPositionY(svrNode.m_uiY));
            }
            localPath.push(cacheList[i]);
        }
    }

    moveAttendantToPos(attendant: UnitController, unitPos: UnityEngine.Vector2, targetPosX: number, targetPosY: number, distance: number, keepAway: number, blinkDistance: number): Protocol.UnitPosition {
        // unitPos和distance可以在这个接口里算的，但为了性能，直接传进来
        // 如果是原点的话就不需要挪屁股了
        if (distance <= 1) {
            attendant.setPixelPosition(targetPosX, targetPosY);
            return null;
        }
        //获得路径
        let localPath: UnityEngine.Vector3[] = [];
        let serverPath: Protocol.UnitPosition[] = [];
        let path = this.tileMap.GetPathInPixel(unitPos.x, unitPos.y, targetPosX, targetPosY);
        if (path) {
            // 说明主人已经跳到另一个岛块了，直接闪现
            this.processRawPath(unitPos, targetPosX, targetPosY, path, localPath, serverPath, false, keepAway);
        }        

        let blink = false;
        let move = true;
        let spLen = serverPath.length;
        if (distance > blinkDistance) {
            // 太远的话直接闪现到间隔点
            blink = true;
            move = false;
        }

        if (spLen <= 1) {
            move = false;
            // 如果没有直通路径，且距离较远，则直接闪现，有两种情况：
            // 1是主人跳到另一个岛块了，2是主人在崎岖的地域摇杆，也可能会出现无法寻路到主人的问题，这种情况下为了避免频繁闪现，所以增加了距离判断
            if (distance > 500 || !this.tileMap.IsConnectedPixel(unitPos.x, unitPos.y, targetPosX, targetPosY)) {
                blink = true;
            }
        }

        if (blink) {
            let p = this.getValidNaborAround(targetPosX, targetPosY, 100);
            if (null != p) {
                attendant.setPixelPosition(p.x, p.y);
            } else {
                attendant.setPixelPosition(targetPosX, targetPosY);
            }
        }

        if (!move) {
            return null;
        }

        attendant.beginMoveWorld(localPath);
        return serverPath[spLen - 1];
    }

    private makeSureCanWalkStraight(startPos: Protocol.UnitPosition, endPos: Protocol.UnitPosition): boolean {
        if (this.tileMap.TestWalkStraight(startPos.m_uiX, startPos.m_uiY, endPos.m_uiX, endPos.m_uiY)) {
            return true;
        }
        let oldEndX = endPos.m_uiX;
        let oldEndY = endPos.m_uiY;
        // 由于出现这种问题是因为客户端垂直坐标反向导致，所以通常只需对y进行校正就可以了
        for (let i = 1; i < 20; i++) {
            // 优先只对y进行校正
            if (this.tileMap.TestWalkStraight(startPos.m_uiX, startPos.m_uiY, oldEndX, oldEndY + i)) {
                endPos.m_uiX = oldEndX;
                endPos.m_uiY = oldEndY + i;
                return true;
            }
            if (this.tileMap.TestWalkStraight(startPos.m_uiX, startPos.m_uiY, oldEndX, oldEndY - i)) {
                endPos.m_uiX = oldEndX;
                endPos.m_uiY = oldEndY - i;
                return true;
            }
        }
        for (let i = 1; i < 20; i++) {
            if (this.tileMap.TestWalkStraight(startPos.m_uiX, startPos.m_uiY, oldEndX + i, oldEndY)) {
                endPos.m_uiX = oldEndX + i;
                endPos.m_uiY = oldEndY;
                return true;
            }
            if (this.tileMap.TestWalkStraight(startPos.m_uiX, startPos.m_uiY, oldEndX - i, oldEndY)) {
                endPos.m_uiX = oldEndX - i;
                endPos.m_uiY = oldEndY;
                return true;
            }
            if (this.tileMap.TestWalkStraight(startPos.m_uiX, startPos.m_uiY, oldEndX + i, oldEndY + i)) {
                endPos.m_uiX = oldEndX + i;
                endPos.m_uiY = oldEndY + i;
                return true;
            }
            if (this.tileMap.TestWalkStraight(startPos.m_uiX, startPos.m_uiY, oldEndX - i, oldEndY + i)) {
                endPos.m_uiX = oldEndX - i;
                endPos.m_uiY = oldEndY + i;
                return true;
            }
            if (this.tileMap.TestWalkStraight(startPos.m_uiX, startPos.m_uiY, oldEndX + i, oldEndY - i)) {
                endPos.m_uiX = oldEndX + i;
                endPos.m_uiY = oldEndY - i;
                return true;
            }
            if (this.tileMap.TestWalkStraight(startPos.m_uiX, startPos.m_uiY, oldEndX - i, oldEndY - i)) {
                endPos.m_uiX = oldEndX - i;
                endPos.m_uiY = oldEndY - i;
                return true;
            }
        }
        return false;
    }

    private _getLinkJumpTeleport(posX: number, posY: number, gateid: number): UnityEngine.Vector2[] {
        let heroPos: UnityEngine.Vector2 = this.Hero.getPixelPosition();
        let teleports: Teleport[] = this.crossIsland.findCrossIsland(heroPos.x, heroPos.y, posX, posY);
        if (!teleports || teleports.length == 0) {
            return null;
        }
        let firstTp = teleports[0];
        let path: UnityEngine.Vector2[] = this.tileMap.GetPathInPixel(heroPos.x, heroPos.y, firstTp.position.x, firstTp.position.y);
        let jumpPos = G.DataMgr.runtime.jumpVar.jumpPos;
        for (let i = 0, len = teleports.length; i < len; i++) {
            jumpPos.push({ x: teleports[i].position.x, y: teleports[i].position.y });
        }

        return path;
    }

    private _canTransportByQuest(gate: number): boolean {
        let questList: number[] = G.DataMgr.questData.getQuestByJumpID(gate);
        if (null == questList) {
            // 没有相关任务，直接跳过
            return false;
        }

        let questConfig: GameConfig.QuestConfigM;
        for (let questID of questList) {
            questConfig = QuestData.getConfigByQuestID(questID);
            if (null != questConfig.acceptJumpSeq && questConfig.acceptJumpSeq[0] == gate) {
                // 接任务跳，需要检查是否已经接了该任务
                if (G.DataMgr.questData.isQuestInDoingList(questConfig.m_iQuestID) && !G.DataMgr.questData.isQuestCompletingByID(questConfig.m_iQuestID)) {
                    return true;
                }
            }
            else if (null != questConfig.finishJumpSeq && questConfig.finishJumpSeq[0] == gate) {
                // 完成任务跳，需要检查是否可以完成该任务
                if (G.DataMgr.questData.isQuestCompleted(questID) || G.DataMgr.questData.isQuestCompletingByID(questID)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 继续跨场景寻路。
     */
    continueCrossPath(): boolean {
        let isWalking: boolean;
        if (null != this.m_crossPathData) {
            // 举例子，在副本中已经初始化完跨场景寻路，但是玩家自己由点了
            // 离开副本甩到了别的地方，这时候寻路数据有可能就失效，需要作废
            // 追朔到当前场景的寻路节点
            let curSceneID: number = G.DataMgr.sceneData.curSceneID;
            let len: number = this.m_crossPathData.length;
            if (len > 0) {
                let tp: Teleport;
                let tpIndex: number = -1;
                for (let i: number = 0; i < len; i++) {
                    tp = this.m_crossPathData[i];
                    if (curSceneID == tp.vSceneId) {
                        tpIndex = i;
                        break;
                    }
                }

                if (tpIndex >= 0) {
                    this.m_crossPathData.splice(0, tpIndex);
                    tp = this.m_crossPathData.shift();
                    this._moveHeroByTeleport(tp);
                    isWalking = true;
                }
                else {
                    // 所有跨场景寻路数据均作废
                    this.m_crossPathData = null;
                }
            }
        } else {
            let jumpVar = G.DataMgr.runtime.jumpVar;
            if (null != jumpVar.jumpPos && jumpVar.jumpPos.length > 0) {
                uts.log('continue go to jump pos: ' + jumpVar.jumpPos.length);
                let nextJumpPos = jumpVar.jumpPos.shift();
                this.moveHeroToPos(nextJumpPos.x, nextJumpPos.y, false);
                isWalking = true;
            }
        }
        return isWalking;
    }

    ///////////////////////////////////////////////////// 传送 /////////////////////////////////////////////////////

    private _transportToNpc(sceneID: number, npcID: number, questID = 0): PathingState {
        // 检查是否能够传送
        let canTransport = this._tryTransport(Macros.ITEMTRANSPORT_TYPE_FLIGHT_NPC, sceneID, npcID, 0, 0, questID, 0, 0);

        return canTransport ? PathingState.CAN_REACH : PathingState.CANNOT_REACH;
    }

    private _transportToPos(sceneID: number, x: number, y: number, questID = 0, monsterID = 0, keepAway = 0): PathingState {
        // 检查是否能够传送
        let canTransport = this._tryTransport(Macros.ITEMTRANSPORT_TYPE_FLIGHT_POSITION, sceneID, 0, x, y, questID, monsterID, keepAway);

        return canTransport ? PathingState.CAN_REACH : PathingState.CANNOT_REACH;
    }

    private _tryTransport(type: number, sceneID: number, npcID = 0, x = 0, y = 0, questID = 0, monsterID = 0, keepAway = 0): boolean {
        if (!this.canTransport('小飞鞋', true)) {
            return false;
        }

        // 检查人物等级
        if (!G.DataMgr.sceneData.canEnterScene(sceneID, true)) {
            return false;
        }

        // 检查是否需要扣筋斗云
        let needItem = false;
        let extraType = 0;

        // 重新检查一遍当前是不是任务接受和领取奖励导致的跳跃，并检查表格中是否有填了直接调
        if (questID > 0) {
            let questConfig = QuestData.getConfigByQuestID(questID);
            if (G.DataMgr.questData.isQuestCompletingByID(questID)) {
                if (questConfig.m_ucBigJumpType == KeyWord.QUEST_FINISH_JUMP || questConfig.m_ucBigJumpType == KeyWord.QUEST_ALL_JUMP) {
                    extraType = Macros.TRANS_TYPE_QUEST_JUMP;
                }
            }

            if (0 == extraType) {
                if (G.DataMgr.questData.isQuestInDoingList(questID)) {
                    if (questConfig.m_ucBigJumpType == KeyWord.QUEST_ACCEPT_JUMP || questConfig.m_ucBigJumpType == KeyWord.QUEST_ALL_JUMP) {
                        extraType = Macros.TRANS_TYPE_QUEST_JUMP;
                    }
                }
            }
        }

        if (0 == extraType) {
            let funcLimitCfg = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.OTHER_FUNCTION_TRANSPORT);
            if (null != funcLimitCfg && G.DataMgr.heroData.level < funcLimitCfg.m_ucLevel) {
                G.TipMgr.addMainFloatTip(uts.format('{0}级开启小飞鞋传送功能', funcLimitCfg.m_ucLevel));
                return false;
            }
        }

        if (extraType <= 0) {
            if (Macros.ITEMTRANSPORT_TYPE_TRANSPORTED != type) {
                needItem = !G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_JDY_FREE_NUM);
            }
        }

        let transportFlag = false;
        if (needItem) {
            // 需要检查道具
            if (G.DataMgr.thingData.getThingListByFunction(KeyWord.ITEM_FUNCTION_FLIGHTOPERATOR).length <= 0) {
                // 筋斗云不足，需要提示自动购买
                let jdyConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(ThingIDUtil.JDY);
                let jdyStr: string = TextFieldUtil.getItemText(jdyConfig);
                if (this.m_noPrompJdy) {
                    // 不提示
                    G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(98, jdyStr));
                }
                else {
                    // 弹出提示
                    G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(98, jdyStr));
                    //G.TipMgr.showConfirm(G.DataMgr.langData.getLang(97, jdyStr), ConfirmCheck.withCheck, '获取|取消', delegate(this, this._onJdyConfirm), 10, 1);
                }
            }
            else {
                // 筋斗云充足
                this._doTransportByJdy(type, sceneID, npcID, x, y, questID, monsterID, keepAway);
                transportFlag = true;
            }
        }
        else {
            // 不需要扣筋斗云
            this._doTransportByJdy(type, sceneID, npcID, x, y, questID, monsterID, keepAway, extraType);
            transportFlag = true;
        }

        return transportFlag;
    }

    private _onJdyConfirm(status: MessageBoxConst, isCheckSelected: boolean): void {
        this.m_noPrompJdy = isCheckSelected;

        if (MessageBoxConst.yes == status) {
            G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
        }
    }

    private _doTransportByJdy(type: number, sceneID: number, npcID = 0, x = 0, y = 0, questID = 0, monsterID = 0, keepAway = 0, extraType = 0): void {
        // 传送之前先停止自动战斗等
        G.ActionHandler.beAGoodBaby(true, true, true, true, false);

        // 同场景下判断距离是否有必要用飞鞋
        if (extraType <= 0 && G.DataMgr.sceneData.curSceneID == sceneID) {
            if (npcID > 0) {
                var info: NPCInfo = G.DataMgr.sceneData.getSceneNpcInfo(sceneID, npcID);
                if (info != null) {
                    x = info.x;
                    y = info.y;
                }
            }

            let pos = this.Hero.getPixelPosition();
            if (this._getTransportType(x, y, pos.x, pos.y) == TransportType.jump) {
                extraType = Macros.TRANS_TYPE_BIG_JUMP;
            }
        }

        // 最后检查是否同场景
        if (G.DataMgr.sceneData.curSceneID != sceneID && (extraType > 0 && Macros.TRANS_TYPE_SHOE != extraType)) {
            extraType = Macros.TRANS_TYPE_SHOE;
        }

        this.stopAutoPath();

        G.DataMgr.runtime.isWaitTransprotResponse = true;
        this.m_crossPathData = null;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getItemTransportRequest(sceneID, type, npcID, x, y, keepAway, questID, extraType));
        G.DataMgr.runtime.setItemTransport(monsterID > 0 ? monsterID : npcID, questID, false);
    }

    /**
     * 判断是否可以使用筋斗云或者主城传送符进行传送。
     * @param 使用的道具名称，用于在提示中。
     * @param needPrompt 是否弹提示。
     *
     */
    canTransport(itemName: string, needPromp: boolean): boolean {
        // 正在等候回复不让传送
        if (G.DataMgr.runtime.isWaitTransprotResponse) {
            return false;
        }

        // 如果正在跳跃
        if (this.Hero.IsJumping || this.Hero.IsLanding) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('当前状态不能使用{0}', itemName), Macros.PROMPTMSG_TYPE_MIDDLE);
            }
            return false;
        }

        // 副本中不让飞
        let sceneData = G.DataMgr.sceneData;
        if (sceneData.curPinstanceID > 0) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('副本中不能使用{0}', itemName), Macros.PROMPTMSG_TYPE_MIDDLE);
            }
            return false;
        }

        // 判断这个地图场景是否配置传送
        let sceneID: number = sceneData.curSceneID;
        if (sceneID > 0) {
            let sceneInfo: SceneInfo = sceneData.getSceneInfo(sceneID);
            if (sceneInfo != null && sceneInfo.config.m_ucTransfer == KeyWord.GENERAL_NO) {
                if (needPromp) {
                    G.TipMgr.addMainFloatTip(uts.format('{0}无法在本地图使用。', itemName), Macros.PROMPTMSG_TYPE_MIDDLE);
                }
                return false;
            }
        }

        //国运无法传送
        if (G.DataMgr.heroData.guoyunLevel > 0) {
            if (needPromp) {
                G.TipMgr.addMainFloatTip(uts.format('护送状态下无法使用{0}', itemName), Macros.PROMPTMSG_TYPE_MIDDLE);
            }
            return false;
        }

        return true;
    }

    processAfterItemTransport(): boolean {
        if (!G.DataMgr.sceneData.isEnterSceneComplete || this.Hero.IsJumping || this.Hero.IsLanding) {
            // 场景未加载好直接返回
            return false;
        }

        let runtime = G.DataMgr.runtime;
        let questID = runtime.itemTransport.questID;
        if (questID > 0) {
            // 使用筋斗云做任务
            runtime.resetAllBut();
            G.ModuleMgr.questModule.tryAutoDoQuest(questID, false);
            return true;
        }

        let targetID = runtime.itemTransport.targetID;
        if (targetID > 0) {
            if (GameIDUtil.isNPCID(targetID)) {
                // 使用筋斗云去NPC那里，不是做任务
                runtime.resetAllBut();
                this.findPath2Npc(targetID, false);
                return true;
            } else if (GameIDUtil.isMonsterID(targetID)) {
                // 去打怪，比如封魔塔内点boss头像寻路
                G.ModuleMgr.deputyModule.startEndHangUp(true, targetID, EnumMonsterRule.specifiedFirst);
                return true;
            }
        }

        if (runtime.itemTransport.startBattle) {
            runtime.resetAllBut();
            G.ModuleMgr.deputyModule.startEndHangUp(true, -1);
        }
        return false;
    }

    ///////////////////////////////////////////////////// 传送 ///////////////////////////////////////////////////////
    canSpecialTransport(navType: number): boolean {
        let kfTeam = G.DataMgr.sxtData.myTeam;

        if (kfTeam != null && kfTeam.m_uiPinstanceID > 0) {
            if (navType != KeyWord.NAVIGATION_MONSTER_FIND_LOAD &&
                navType != KeyWord.NAVIGATION_NPC_FIND_LOAD &&
                navType != KeyWord.NAVIGATION_CROSS_PIN &&
                navType != KeyWord.NAVIGATION_SUDI &&
                navType != KeyWord.NAVIGATION_BACKTOCITY &&
                navType != KeyWord.NAVIGATION_GUAJI) {
                let pConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(kfTeam.m_uiPinstanceID);
                G.TipMgr.addMainFloatTip(uts.format('当前正在 {0} 队伍中无法传送！', pConfig.m_szName));

                return false;
            }
        }

        // 国运中不能传送
        if (!this.canFly2Role('传送。', navType)) {
            return false;
        }

        return true;
    }

    trySpecialTransport(type: number, para1: number = 0, para2: number = 0, questId = 0, startBattle = false, npcId = 0): boolean {
        // 跨服组队排队中不能进入其他副本
        if (this.canSpecialTransport(type)) {
            uts.log('trySpecialTransport, type = ' + type + ', para1 = ' + para1 + ', para2 = ' + para2 + ', questId = ' + questId + ', startBattle = ' + startBattle + ', npcId = ' + npcId);
            G.DataMgr.runtime.isWaitTransprotResponse = true;
            this.stopAutoPath();
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSpecialTransportRequest(type, para1, para2));
            G.DataMgr.runtime.setItemTransport(npcId, questId, startBattle);
            return true;
        }
        return false;
    }

    ///////////////////////////////////////////////////// 穿云箭 /////////////////////////////////////////////////////

    /**
     * 判断能否飞到某个玩家身上。
     * @param actionDesc 这个飞的动作的描述。
     * @return
     *
     */
    canFly2Role(actionDesc: string, navType: number): boolean {
        // 采集状态下不可飞
        if (G.ViewCacher.collectionBar.hasShowCollection) {
            G.TipMgr.addMainFloatTip(uts.format('吟唱过程中无法{0}', actionDesc), Macros.PROMPTMSG_TYPE_MIDDLE);
            return false;
        }

        // 副本中不能回应穿云箭
        if (G.DataMgr.sceneData.curPinstanceID > 0) {
            G.TipMgr.addMainFloatTip(uts.format('副本中无法{0}', actionDesc), Macros.PROMPTMSG_TYPE_MIDDLE);
            return false;
        }

        // 战斗中不能回应穿云箭
        if (KeyWord.NAVIGATION_CROSS_PIN != navType && UnitStatus.isInPvpFight(G.DataMgr.heroData.unitStatus)) {
            G.TipMgr.addMainFloatTip(uts.format('战斗中无法{0}', actionDesc), Macros.PROMPTMSG_TYPE_MIDDLE);
            return false;
        }

        // 死亡状态下不能回应穿云箭
        if (UnitStatus.isDead(G.DataMgr.heroData.unitStatus)) {
            G.TipMgr.addMainFloatTip(uts.format('死亡状态下无法{0}', actionDesc), Macros.PROMPTMSG_TYPE_MIDDLE);
            return false;
        }

        // 眩晕或定身状态下不能回应穿云箭
        if (this.Hero.buffProxy.isComa || this.Hero.buffProxy.isFreze) {
            G.TipMgr.addMainFloatTip(uts.format('状态下无法{0}', actionDesc), Macros.PROMPTMSG_TYPE_MIDDLE);
            return false;
        }

        //国运无法传送
        if (G.DataMgr.heroData.guoyunLevel > 0) {
            G.TipMgr.addMainFloatTip(uts.format('护送状态下无法{0}', actionDesc), Macros.PROMPTMSG_TYPE_MIDDLE);
            return false;
        }

        return true;
    }

    getSuitableKeepAway(skill: GameConfig.SkillConfigM, distance: number): number {
        if (skill != null) {
            distance = SkillData.getCastDistance(skill);
            distance -= Constants.TOLERANCE;
        }
        else {
            if (0 == distance) {
                distance = Constants.CAST_DISTANCE - Constants.TOLERANCE;
            }
        }

        return distance;
    }

    /**
	* 取得当前位置与目标点之间的位置状态
	* @param targetPos 目标位置
	* @param target
	* @return
	*
	*/
    private getPosState(skill: GameConfig.SkillConfigM, rolePos: UnityEngine.Vector2, targetPosX: number, targetPosY: number, gotoType: number = 0, fromPos: UnityEngine.Vector2 = null): PositionState {
        let result: PositionState;

        if (null == fromPos) {
            // 没有指定起始点，默认使用角色当前坐标
            fromPos = rolePos;
        }
        if (skill != null) {
            // 普通技能使用施法距离，跳跃技能使用跳跃距离
            let castDis: number = SkillData.getCastDistance(skill);
            result = this._getPosStateWithSkill(fromPos.x, fromPos.y, rolePos.x, rolePos.y, targetPosX, targetPosY, castDis);
        }
        else {
            result = this._getPosStateWithoutSkill(fromPos.x, fromPos.y, targetPosX, targetPosY, gotoType);
        }

        return result;
    }

    /**
     * 考虑技能的情况下获取目标点的状态。
     * @param curPosX
     * @param curPosY
     * @param roleX
     * @param roleY
     * @param targetX
     * @param targetY
     * @param skillConfig
     */
    private _getPosStateWithSkill(curPosX: number, curPosY: number, roleX: number, roleY: number, targetX: number, targetY: number, castDis: number): PositionState {
        let result = PositionState.VALID;
        let distance = UnityEngine.Vector2.Distance(new UnityEngine.Vector2(curPosX, curPosY), new UnityEngine.Vector2(targetX, targetY));
        if (castDis > 0) {
            if (castDis >= Constants.LONG_CAST_DISTANCE) {
                // 远程攻击
                if (this.tileMap.TestWalkStraight(curPosX, curPosY, targetX, targetY)) {
                    if (distance > castDis) {
                        result = PositionState.OUT_OF_DIS;
                    } else {
                        result = PositionState.VALID;
                    }
                } else {
                    result = PositionState.BLOCKED;
                }
            } else {
                // 近身攻击
                if (distance > castDis) {
                    result = PositionState.OUT_OF_DIS;
                } else if (this.tileMap.TestWalkStraight(curPosX, curPosY, targetX, targetY)) {
                    result = PositionState.VALID;
                } else {
                    // 距离合适但角度错误
                    result = PositionState.VALID_DIS_BUT_INVALID_ANGLE;
                }
            }
        } else {
            result = this.tileMap.TestWalkStraight(curPosX, curPosY, targetX, targetY) ? PositionState.VALID : PositionState.BLOCKED;
        }

        return result;
    }

    /**
     * 不考虑技能的情况下获取目标点的状态。
     * @param curPosX
     * @param curPosY
     * @param targetX
     * @param targetY
     * @param gotoType
     */
    private _getPosStateWithoutSkill(curPosX: number, curPosY: number, targetX: number, targetY: number, gotoType: HeroGotoType): PositionState {
        let result = PositionState.VALID;
        let canWalkStraight = this.tileMap.TestWalkStraight(curPosX, curPosY, targetX, targetY);

        if (!canWalkStraight || !this.tileMap.IsWalkablePositionPixel(targetX, targetY)) {
            result = PositionState.BLOCKED;
        } else {
            let distance: number = UnityEngine.Vector2.Distance(new UnityEngine.Vector2(curPosX, curPosY), new UnityEngine.Vector2(targetX, targetY));
            let validDistance: number;
            if (HeroGotoType.GET_MULTI_DROP == gotoType || HeroGotoType.GET_SINGLE_DROP == gotoType) {
                validDistance = Macros.AUTO_PICKUP_LIMIT_RANGE - 30;
            } else {
                validDistance = Constants.CAST_DISTANCE;
            }

            if (distance > validDistance) {
                // 超过施法距离
                result = PositionState.OUT_OF_DIS;
            } else if (canWalkStraight) {
                result = PositionState.VALID;
            }
        }

        return result;
    }

    /**
     * 怪物进入视野了，检查是否需要重新调整寻路。
     * @param unitCtrls
     */
    onMonstersTurnUp(unitCtrls: UnitController[]): boolean {
        let runtime = G.DataMgr.runtime;
        let monsterID = runtime.moveTarget.monsterID;
        if (0 == monsterID && EnumMonsterRule.specifiedFirst == G.BattleHelper.monsterRule) {
            // 如果monster rule本身就是onlySpecified，那么自然会锁定该目标
            monsterID = G.BattleHelper.targetMonsterID;
        }

        if (monsterID > 0) {
            let selected = G.UnitMgr.SelectedUnit;
            if (null == selected || selected.Data.id != monsterID) {
                for (let unitCtrl of unitCtrls) {
                    if (monsterID == unitCtrl.Data.id) {
                        G.DataMgr.heroData.gotoType = HeroGotoType.ATTACK_AND_HANGUP;
                        this.moveToTarget(unitCtrl);
                        return true;
                    }
                }
            }
        }

        let questID = runtime.moveTarget.questID;
        if (questID > 0) {
            let questNodeIdx = runtime.moveTarget.questNodeIdx;
            let questNodeCfg = QuestData.getConfigByQuestID(questID).m_astQuestNodeConfig[questNodeIdx];
            if (KeyWord.QUEST_NODE_MONSTER == questNodeCfg.m_ucType || KeyWord.QUEST_NODE_MONSTER_SHARE == questNodeCfg.m_ucType ||
                KeyWord.QUEST_NODE_COLLECT == questNodeCfg.m_ucType || KeyWord.QUEST_NODE_COLLECT_SHARE == questNodeCfg.m_ucType) {
                let nodeProgress = G.DataMgr.questData.getQuestDoingNodeProgress(questID, questNodeIdx);
                if (null != nodeProgress && nodeProgress.m_shProgressValue < questNodeCfg.m_shValue) {
                    let questMonsterID = G.DataMgr.questData.getMonsterIDByQuestNode(questID, questNodeIdx);
                    let heroPos = this.Hero.getPixelPosition();
                    for (let unitCtrl of unitCtrls) {
                        if (questMonsterID == unitCtrl.Data.id) {
                            let unitPos = unitCtrl.getPixelPosition();
                            if (this.tileMap.IsConnectedPixel(heroPos.x, heroPos.y, unitPos.x, unitPos.y)) {
                                G.ModuleMgr.questModule.onQuestWalkEnd(questID, questNodeIdx, false);
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    //----------------------------------------------------------------------
    public moveToTarget(target: UnitController, skill: GameConfig.SkillConfigM = null, doNothingIfReached = false): PathingState {
        //if (target == null) // 不存在此种情况，减少无谓的判断
        //{
        //    return PathingState.CANNOT_REACH;
        //}

        let runtime = G.DataMgr.runtime;
        G.Mapmgr.clearCrossPathData(); //都走向某个目标了，清除掉跨场景数据
        runtime.moveTarget.setTarget(target);
        let gotoType: HeroGotoType = G.DataMgr.heroData.gotoType;

        if (gotoType == HeroGotoType.ATTACK) {
            if (target.model == null) {
                uts.logWarning("不能走向一个已经死亡的单位");
                return PathingState.CANNOT_REACH;
            }
        }
        if (null == skill) {
            skill = G.ModuleMgr.skillModule.getCastSkill(gotoType, target.Data.id);
        }

        let ret = PathingState.CANNOT_REACH;
        if (target.Data.unitType == UnitCtrlType.dropThing) {
            // 掉落物要用真实坐标
            let dropThingPos: Protocol.UnitPosition = (target as DropThingController).Data.info.m_stCurPos;
            ret = G.Mapmgr.gotoTargetPos(0, target, dropThingPos.m_uiX, dropThingPos.m_uiY, false, skill);
        }
        else {
            let pos = target.getPixelPosition();
            if (null != pos) {
                ret = G.Mapmgr.gotoTargetPos(0, target, pos.x, pos.y, false, skill);
            } else {
                ret = PathingState.CANNOT_REACH;
            }
        }

        if (PathingState.CANNOT_REACH == ret) {
            // 无法到达则清除状态
            runtime.resetAllBut();
        } else if (PathingState.REACHED == ret) {
            if(!doNothingIfReached) {
                this.Hero.onReachTarget();
            }
        } else {
            if (G.DataMgr.runtime.isHangingUp) {
                G.ViewCacher.mainUIEffectView.playPathingEffect();
            }
        }
        return ret;
    }

    /**
	* 同场景点小飞鞋
	* 1. 两点间直线距离 < 300 , 则走过去，不消耗小飞鞋 （飘个绿色的提示 ： 距离过短，溜达过去）
	* 2. 两点间直线距离 > =300 且 < 2500 , 用新做的 大跳规则跳过去。
	* 3. 两点间直线距离 > 2500 ，和现在规则 一样，传过去，但是表现一个飞行动作从 天上飞下 （3选一随机）。
	* @param	dis
	*/
    private _getTransportType(x1: number, y1: number, x2: number, y2: number): TransportType {
        let dis = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        if (dis < 300) {
            return TransportType.none;
        }
        else if (dis >= 300 && dis < 3500) {
            return TransportType.jump;
        }
        else {
            return TransportType.transport;
        }
    }

    private getValidNaborAround(x: number, y: number, distance: number): UnityEngine.Vector2 {
        for (let i = 0; i < 10; i++) {
            let out = new UnityEngine.Vector2(Math.floor(x + distance * this.cosVec[i]), Math.floor(y + distance * this.sinVec[i]));
            if (this.tileMap.IsWalkablePositionPixel(out.x, out.y) && this.tileMap.TestWalkStraight(out.x, out.y, x, y)) {
                return out;
            }
        }

        return null;
    }
}
