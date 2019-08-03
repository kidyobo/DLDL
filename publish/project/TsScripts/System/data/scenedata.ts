import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { MapSceneConfig } from 'System/data/scene/MapSceneConfig'
import { SceneInfo } from 'System/data/scene/SceneInfo'
import { NPCInfo } from 'System/data/scene/NPCInfo'
import { GateInfo } from 'System/data/scene/GateInfo'
import { QuestData } from 'System/data/QuestData'
import { MapId } from 'System/map/MapId'
import { SceneID } from 'System/constants/GameEnum'
import { int } from 'System/utils/MathUtil'
import { Teleport } from 'System/map/Teleport'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { ShouChongTipView } from '../activity/view/ShouChongTipView';

/**
 * 场景的相关信息，包括从表格读出来的所有场景的信息，还有每次进入某个场景从地编读出来的一些数据
 * 另外一些变量是表示当前地图的数据
 * @author fygame
 *
 */
export class SceneData {
    /**场景上的怪物ID。*/
    monsters: number[] = [];

    /**场景的唯一ID标识符*/
    private m_curSceneID: number = 0;

    /**上一个场景id*/
    private m_preSceneID: number = 0;

    /**副本ID*/
    private m_curPinstanceID: number = 0;

    /**上一次的副本ID。*/
    private m_prePinstanceID: number = 0;

    /**后台给的场景index，用于场景唯一标识，用于语音*/
    private m_curSceneIdx: number = 0;

    private m_preSceneIdx: number = -1;
    /**后台给的副本index，用于场景唯一标识，用于语音*/
    private m_curPinstanceIdx: number = 0;

    private m_prePinstanceIdx: number = -1;

    private m_isInCrossTeamPinstance = false;

    /**
     * 记录了所有的[场景ID， sceneInfo]对
     * 表格里读出来以及从地编过来的，但是地编的数据只能在进入该场景或者打开世界地图后才会有
     */
    private m_sceneInfoMap: { [sceneID: number]: SceneInfo };

    /**
     * 传送点特效数据，[传送点特效， 特效的位置偏移]
     * 表格里读出来的
     */
    private m_teleEffectMap: { [teID: number]: GameConfig.TeleportEffectM } = {};

    /**
     * [场景ID， [传送点ID, 传送点info]] ，地编里面得来的
     */
    private m_teleportPosMap: { [sceneID: number]: { [gateID: number]: GateInfo } } = {};

    /**
     * 表格里的[传送点ID， 传送点配置]
     */
    private m_teleportConfigMap: { [tpID: number]: GameConfig.TeleportConfigM } = {};

    /**
     * 表格里面配的关于传送点的信息
     * [场景ID， Vecter.<TeleportConfig>] 对
     */
    private m_sceneTeleportMap: { [sceneID: number]: Array<GameConfig.TeleportConfigM> } = {};

    /**跳跃点映射表。*/
    private m_jumpTeleportMap: { [sceneID: number]: Array<GameConfig.TeleportConfigM> } = {};

    /**一个标记位，表示是否已经完全的进入场景（也就是地图以及数据什么的都加载上来了）*/
    isEnterSceneComplete: boolean;
    disableAllGate = false;

    /**当前的场景配置*/
    curSceneConfig: MapSceneConfig;

    /**在读取position相关的bin文件后，通过配置文件数据建立的一张表[npc/怪物的名字, 位置信息数组]*/
    private m_questNavMap: { [idPosKey: string]: GameConfig.NavigationConfigM[] } = {};

    /**NPC寻路表。*/
    private m_npcNavMap: any = {};

    /**怪物寻路表。*/
    private m_monsterNavMap: { [questIDKey: string]: GameConfig.NavigationConfigM[] } = {};

    /**挂机*/
    private m_gujiaNavMap: { [level: number]: GameConfig.NavigationCfg_OnHookM } = {};

    /**各种活动的寻路数据。*/
    private m_actNavMap: { [key: string]: GameConfig.NavigationConfigM } = {};

    /**临时缓存起来的活动寻路数据，因为这些数据需要通过角色的国家进行筛选。*/
    private m_tmpActNavData: GameConfig.NavigationConfigM[] = [];

    /**斩妖除魔的寻路数据。*/
    private m_zycmNavMap: { [questID: number]: GameConfig.NavigationConfigM };
    /**野外boss寻路*/
    private ywbossNavMap: { [bossid: number]: GameConfig.NavigationConfigM }

    /**
     *  记录[场景ID, [npcID, npc信息]]对
     */
    private m_npcSceneIDMap: { [sceneID: number]: { [npcID: number]: NPCInfo } };

    private sceneMonsterMap: { [sceneID: number]: number[] } = {};

    /**
     * 设置场景信息
     * [场景ID， SceneInfo]对,表格里面读出来的
     * 这里不直接使用表格的SceneConfig数据结构是因为场景信息还有一部分是从地编来的，比如长宽等
     * @param data
     *
    */
    onCfgReady(): void {
        this.setSceneConfig();
        this.setNavData();
        this.addClientMonsterNav();
    }

    cacheData(config: MapSceneConfig): void {
        this._updataTeleportPos(config); //更新传送点信息
        this._updateNpcInfo(config); //更新npc的信息
    }

    /**
     * 更新npc的信息
     *
     */
    private _updateNpcInfo(config: MapSceneConfig): void {
        let sceneID: number = config.sceneID;
        let info: NPCInfo = null;
        let npcInfos: NPCInfo[] = config.npcInfos;
        let len: number = npcInfos.length;
        for (let i: number = 0; i < len; ++i) {
            info = npcInfos[i];

            if (defines.has('_DEBUG')) {
                uts.assert(sceneID == info.sceneID, '艹，NPC' + info.npcID + '的场景ID为' + info.sceneID + '，跟实际场景ID' + sceneID + '不匹配！');
            }
            this._setNpcInfo(info);
        }
    }

    /**
     * 设置传送点的信息，这个是由地编里面配的，所以每次加载一个场景，就记录相关的传送点信息，越来越多
     *
     */
    private _updataTeleportPos(config: MapSceneConfig): void {
        let sceneID: number = config.sceneID;
        let info: GateInfo = null;
        let gateInfos: GateInfo[] = config.gateInfos;
        let len: number = gateInfos.length;
        for (let i: number = 0; i < len; ++i) {
            info = gateInfos[i];
            if (this.m_teleportPosMap[sceneID] == null) {
                this.m_teleportPosMap[sceneID] = {};
            }
            this.m_teleportPosMap[sceneID][info.gateID] = info;
        }

        if (sceneID == this.curSceneID) {
            G.Mapmgr.crossIsland.initCrossIslandData(this.getJumpTeleportConfigsInScene(sceneID));
        }
    }

    /**
     * 设置传送点特效数据,主要是传送点的偏移信息
     * @param list
     *
     */
    private setTeleportEffectData(list: GameConfig.TeleportEffectM[]): void {
        let len: number = list.length;

        for (let i: number = 0; i < len; ++i) {
            this.m_teleEffectMap[list[i].m_szTransportEffectID] = list[i];
        }
    }

    /**
     * 根据特效名字取得特效便宜
     * @param name
     * @return
     *
     */
    getTeleportEffectInfo(name: string): GameConfig.TeleportEffectM {
        return this.m_teleEffectMap[name];
    }

    private setSceneConfig() {
        let dataList: GameConfig.SceneConfigM[] = G.Cfgmgr.getCfg('data/SceneConfigM.json') as GameConfig.SceneConfigM[];
        this.m_sceneInfoMap = {};
        for (let sceneConfig of dataList) {
            if (sceneConfig != null && sceneConfig.m_iSceneID != 0) {
                //perry:2012-4-10 添加切场景时的等级限制数据
                this.m_sceneInfoMap[sceneConfig.m_iSceneID] = new SceneInfo(sceneConfig);
            }
        }

        let tpDataList: GameConfig.TeleportConfigM[] = G.Cfgmgr.getCfg('data/TeleportConfigM.json') as GameConfig.TeleportConfigM[];
        let tpList: GameConfig.TeleportConfigM[];
        let map: { [sceneId: number]: GameConfig.TeleportConfigM[] };
        for (let teleportConfig of tpDataList) {
            if (teleportConfig.m_iID <= 0) {
                continue;
            }
            this.m_teleportConfigMap[teleportConfig.m_iID] = teleportConfig;

            if (KeyWord.TRANS_SHOW_JUMP == teleportConfig.m_ucType || (KeyWord.TRANS_HIDE_JUMP == teleportConfig.m_ucType && teleportConfig.m_iTargetTransportID > 0)) {
                map = this.m_jumpTeleportMap;
            }
            else if (0 == teleportConfig.m_bNpcTransport && KeyWord.TRANS_NORMAL == teleportConfig.m_ucType) {
                // 不属于NPC传送点，种在地图里的，可以用来传送
                // 跳跃传送点不支持跨场景，故也剔除
                map = this.m_sceneTeleportMap;
            }
            else {
                continue;
            }
            tpList = map[teleportConfig.m_iSceneID];
            if (null == tpList) {
                map[teleportConfig.m_iSceneID] = tpList = new Array<GameConfig.TeleportConfigM>();
            }
            tpList.push(teleportConfig);
        }
    }

    /**
     * 取得场景名字。
     * @param sceneID 场景ID，可以是真正的场景ID，也可以是虚拟场景ID（结果是一样的）。
     * @return
     *
     */
    getSceneName(sceneID: number = 0): string {
        if (sceneID == 0) {
            sceneID = this.curSceneID;
        }

        if (this.m_sceneInfoMap[sceneID] != null) {
            return this.m_sceneInfoMap[sceneID].config.m_szSceneName;
        }

        return '';
    }

    /**
     * 通过场景id取得场景信息
     * @param sceneID
     * @return
     *
     */
    getSceneInfo(sceneID: number): SceneInfo {
        return this.m_sceneInfoMap[sceneID] as SceneInfo;
    }

    /**
     * 根据场景id取得该场景上所有的传送点数据
     * @param sceneID
     * @return
     *
     */
    getTeleportList(sceneID: number): { [gateId: number]: GateInfo } {
        return this.m_teleportPosMap[sceneID];
    }

    /**
     * 通过场景ID和传送点ID得到传送点信息，注意如果这个场景没有进去过则不会查找到结果。
     * @param sID
     * @param telePortId
     * @return
     *
     */
    getGateInfo(sID: number, telePortId: number): GateInfo {
        if (this.m_teleportPosMap[sID] == null) {
            return null;
        }

        return this.m_teleportPosMap[sID][telePortId];
    }

    /**
     * 通过传送点id取得某一个表格里的传送点配置
     * @param id
     * @return
     *
     */
    getTeleportConfig(id: number): GameConfig.TeleportConfigM {
        return this.m_teleportConfigMap[id];
    }

    /**
     * 初始化跨场景寻路数据。
     *
     */
    initCrossPathData(): void {
        G.Mapmgr.crossPath.initCrossPathData(this.m_sceneTeleportMap);
    }

    /**
     * 在指定的场景中查找普通传送点的配置。
     * @param sceneID 场景ID
     * @return 如果指定场景中没有指定ID的传送点则返回null。
     *
     */
    getTeleportConfigsInScene(sceneID: number): GameConfig.TeleportConfigM[] {
        return this.m_sceneTeleportMap[sceneID];
    }

    /**
     * 在指定的场景中查找跳跃传送点的配置。
     * @param sceneID 场景ID
     * @return 如果指定场景中没有指定ID的传送点则返回null。
     *
     */
    getJumpTeleportConfigsInScene(sceneID: number): GameConfig.TeleportConfigM[] {
        return this.m_jumpTeleportMap[sceneID];
    }

    /**
     *
     * 这些npc信息全部是从地编里面读出来的，也是加载一个场景就记录下来越来越多
     * @param info
     * @param sceneID
     *
     */
    private _setNpcInfo(info: NPCInfo): void {
        let npcId: number = info.npcID;

        if (this.m_npcSceneIDMap == null) {
            this.m_npcSceneIDMap = {};
        }
        let sID: number = info.sceneID;
        if (this.m_npcSceneIDMap[sID] == null) {
            this.m_npcSceneIDMap[sID] = {};
        }

        if (this.m_npcSceneIDMap[sID][npcId] == null) {
            this.m_npcSceneIDMap[sID][npcId] = info;
        }
    }

    /**
     * 取得npc的数据，这个数据是对应地编里面的
     * @param npcId
     * @return
     *
     */
    getSceneNpcInfo(sceneID: number, npcId: number): NPCInfo {
        if (null == this.m_npcSceneIDMap) {
            return null;
        }
        let sceneMap = this.m_npcSceneIDMap[sceneID];
        if (null == sceneMap) {
            return null;
        }
        return sceneMap[npcId];
    }

    /**
     * 取得某个场景下所有npc的信息
     * @param sceneID
     * @return
     *
     */
    getNpcInfoList(sceneID: number): { [npcId: number]: NPCInfo } {
        if (this.m_npcSceneIDMap != null) {
            return this.m_npcSceneIDMap[sceneID];
        }
        return null;
    }

    /**
     * 通过position的bin文件来建立一张 名字跟其信息的表
     * NavigationConfig_Flash是位置信息，如果里面用npc的id就不用position，如果用position就不用npc的id
     * @param data
     *
     */
    private setNavData(): void {
        let data: GameConfig.NavigationConfigM[] = G.Cfgmgr.getCfg('data/NavigationConfigM.json') as GameConfig.NavigationConfigM[];

        this.m_tmpActNavData = new Array<GameConfig.NavigationConfigM>();
        this.m_zycmNavMap = {};
        this.ywbossNavMap = {};
        let navList: GameConfig.NavigationConfigM[];
        let config: GameConfig.NavigationConfigM;
        for (let i: number = data.length - 1; i >= 0; i--) {
            config = data[i];
            if (0 == config.m_iNavigationType) {
                // 过滤无效行
                data.splice(i, 1);
                continue;
            }

            if (KeyWord.NAVIGATION_NPC_FIND_LOAD == config.m_iNavigationType) {
                // NPC寻路
                this._add2npcNav(config.m_iNPCID, config);
                continue;
            }

            if (KeyWord.NAVIGATION_MONSTER_FIND_LOAD == config.m_iNavigationType) {
                // 怪物寻路
                navList = this.m_monsterNavMap[config.m_iQuestID];
                if (null == navList) {
                    this.m_monsterNavMap[config.m_iQuestID] = navList = new Array<GameConfig.NavigationConfigM>();
                }
                navList.push(config);
                this.ywbossNavMap[config.m_iQuestID] = config
                continue;
            }

            if (KeyWord.NAVIGATION_NORMAL_TASK == config.m_iNavigationType) // 普通任务寻路
            {
                if (defines.has('_DEBUG')) {
                    uts.assert(config.m_iQuestID > 0, '寻路表没有配任务ID！');
                }
                // 任务寻路数据
                let keyStr = config.m_iQuestID + '_' + config.m_szPositionName;
                navList = this.m_questNavMap[keyStr];
                if (null == navList) {
                    this.m_questNavMap[keyStr] = navList = new Array<GameConfig.NavigationConfigM>();
                }
                navList.push(config);
                continue;
            }

            if (KeyWord.NAVIGATION_CLASS_WORLD_BOSS == config.m_iNavigationType) {
                this.m_zycmNavMap[config.m_iQuestID] = config;
            }

            this.m_tmpActNavData.push(config);
        }
    }

    /**
     * 增加前台怪的寻路。
     * @param configs
     *
     */
    private addClientMonsterNav(): void {
        let configs: GameConfig.ClientMonsterConfigM[] = G.Cfgmgr.getCfg('data/ClientMonsterConfigM.json') as GameConfig.ClientMonsterConfigM[];

        let keyStr: string;
        let navConfig: GameConfig.NavigationConfigM;
        let navList: GameConfig.NavigationConfigM[];
        for (let config of configs) {
            keyStr = config.m_iMonsterID + '';
            this.m_monsterNavMap[keyStr] = navList = new Array<GameConfig.NavigationConfigM>();
            navConfig = {} as GameConfig.NavigationConfigM;
            navConfig.m_iQuestID = config.m_iMonsterID;
            navConfig.m_iSceneID = config.m_iSceneID;
            navConfig.m_stPosition = {} as Protocol.UnitPosition;
            navConfig.m_stPosition.m_uiX = config.m_iPositionX;
            navConfig.m_stPosition.m_uiY = config.m_iPositionY;
            navList.push(navConfig);
        }
    }

    /**
     * 处理国运、师门等NPC在表格里不确定的寻路，过滤活动寻路数据并建表。
     * @param country
     *
     */
    processNav(): void {
        // 再处理其他寻路
        let keyStr: string;
        for (let config of this.m_tmpActNavData) {
            if (0 != config.m_iQuestID) {
                keyStr = config.m_iNavigationType + '_' + config.m_iQuestID;
            }
            else {
                keyStr = config.m_iNavigationType + '';
            }
            //				if(defines.has('_DEBUG')){ uts.assert(null == this.m_actNavMap[keyStr], '这表不是按照我的设想来配的呀！呜呜'); }
            this.m_actNavMap[keyStr] = config;
        }
        this.m_tmpActNavData = null;
    }

    private _add2npcNav(npcId: number, navConfig: GameConfig.NavigationConfigM): void {
        if (null == this.m_npcNavMap[npcId]) {
            this.m_npcNavMap[npcId] = navConfig;
        }
        else {
            let navList: GameConfig.NavigationConfigM[];
            if (this.m_npcNavMap[npcId] instanceof Array) {
                navList = this.m_npcNavMap[npcId];
                navList.push(navConfig);
            }
            else {
                // 需要扩充为数组
                navList = [this.m_npcNavMap[npcId], navConfig];
                this.m_npcNavMap[npcId] = navList;
            }
        }
    }

    /**当前场景ID*/
    get preSceneID(): number {
        return this.m_preSceneID;
    }

    /**当前场景ID*/
    get curSceneID(): number {
        return this.m_curSceneID;
    }

    /**@private*/
    set curSceneID(value: number) {
        this.m_preSceneID = this.m_curSceneID;

        this.m_curSceneID = value;
    }

    /**当前副本ID*/
    get curPinstanceID(): number {

        return this.m_curPinstanceID;
    }

    /**@private*/
    set curPinstanceID(value: number) {
        this.m_prePinstanceID = this.m_curPinstanceID;
        this.m_curPinstanceID = value;
        this.m_isInCrossTeamPinstance = PinstanceIDUtil.isCrossTeamPins(value);
        //限制首充的小面板，在副本里不显示
        let firstPanel = G.Uimgr.getForm<ShouChongTipView>(ShouChongTipView);
        if (firstPanel && firstPanel.isOpened) {
            if (this.m_curPinstanceID == 0)
                firstPanel.showContent();
            else
                firstPanel.hideContent();
        }
    }

    get prePinstanceID(): number {
        return this.m_prePinstanceID;
    }

    /**当前场景的后台唯一index, 一般请勿用*/
    get curSceneIndex(): number {
        return this.m_curSceneIdx;
    }

    /**@private*/
    set curSceneIndex(value: number) {
        this.m_preSceneIdx = this.m_curSceneIdx;
        this.m_curSceneIdx = value;
    }

    /**当前副本的后台唯一index， 一般请勿用*/
    get curPinstanceIndex(): number {
        return this.m_curPinstanceIdx;
    }

    /**@private*/
    set curPinstanceIndex(value: number) {
        this.m_prePinstanceIdx = this.m_curPinstanceIdx;
        this.m_curPinstanceIdx = value;
    }

    /**获得副本或者场景后台唯一index有没有变化，一般请勿用*/
    get isSceneOrPinstIndexChanged() {
        if (this.m_curPinstanceID > 0) {
            if (this.m_curPinstanceIdx != this.m_prePinstanceIdx) {
                return true;
            }
        } else {
            if (this.m_curSceneIdx != this.m_preSceneIdx) {
                return true;
            }
        }
        return false;
    }

    get isInCrossTeamPinstance(): boolean {
        return this.m_isInCrossTeamPinstance;
    }

    getSceneRescourceID(sceneID: number): number {
        if (this.m_sceneInfoMap[sceneID] != null) {
            return (<SceneInfo>this.m_sceneInfoMap[sceneID]).config.m_iResourceID;
        }
        return 0;
    }

    /**
     * 是否忽略定点挂机
     * @return 
     * 
     */
    isIngornFixedPoint(): boolean {
        return Macros.PINSTANCE_ID_DIGONG == this.curPinstanceID || Macros.PINSTANCE_ID_WORLDBOSS == this.curPinstanceID;
    }

    /**
     * 获取最近的任务寻路配置。
     * @param questID 任务ID。
     * @param nodeIndex 节点索引。
     * @param dstZoneID 目标zoneID，0表示当前zone。
     * @param countryID 如果指定，则需要匹配寻路配置中的countryID。
     * @return
     *
     */
    getQuestNav(questID: number, nodeIndex: number): GameConfig.NavigationConfigM {
        // 走到这里说明这个任务寻路是单独配置的
        let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(questID);
        let questNodeConfig: GameConfig.QuestNodeConfigCli = questConfig.m_astQuestNodeConfig[nodeIndex];
        let navList: GameConfig.NavigationConfigM[];

        if (KeyWord.QUEST_NODE_FMT_RANDOM == questNodeConfig.m_ucType) {
            navList = this.m_monsterNavMap[G.DataMgr.questData.getMonsterIDByQuestNode(questID, nodeIndex)];
        }
        else if (KeyWord.QUEST_NODE_MONSTER == questNodeConfig.m_ucType || KeyWord.QUEST_NODE_MONSTER_SHARE == questNodeConfig.m_ucType ||
            KeyWord.QUEST_NODE_ENMITY_MONSTER == questNodeConfig.m_ucType || KeyWord.QUEST_NODE_ENMITY_MONSTER_SHARE == questNodeConfig.m_ucType) {
            // 杀怪
            navList = this.m_monsterNavMap[questNodeConfig.m_iThingID];
        }
        else if (KeyWord.QUEST_NODE_COLLECT == questNodeConfig.m_ucType || KeyWord.QUEST_NODE_COLLECT_SHARE == questNodeConfig.m_ucType) {
            // 收集
            if (questNodeConfig.monsterDropIndex >= 0 && questNodeConfig.monsterDropIndex < questConfig.m_astMonsterDropConfig.length) {
                let monster: GameConfig.QuestMonsterDropConfigM = questConfig.m_astMonsterDropConfig[questNodeConfig.monsterDropIndex];
                navList = this.m_monsterNavMap[monster.m_iMonsterID];
            }
            else {
                navList = this.m_monsterNavMap[questNodeConfig.m_iThingID];
            }
        }

        if (null == navList) {
            return null;
        }

        return this._getNearestNav(navList);
    }

    /**
     * 获取指定NPC的寻路信息。
     * @param npcID
     * @return
     *
     */
    getNpcNav(npcID: number): GameConfig.NavigationConfigM {
        if (this.m_npcNavMap[npcID] instanceof Array) {
            return this._getNearestNav(this.m_npcNavMap[npcID]);
        }
        else {
            return this.m_npcNavMap[npcID];
        }
    }

    /**
     * 获取指定怪物的寻路信息。
     * @param monsterID
     * @param isNearest 是否寻找最近的寻路。如果只是为了确定是否可以寻路，传递false可以节省计算开销。
     * @return
     *
     */
    getMonsterNav(monsterID: number, isNearest: boolean = false): GameConfig.NavigationConfigM {
        let navList: GameConfig.NavigationConfigM[] = this.m_monsterNavMap[monsterID];
        if (null == navList) {
            return null;
        }

        if (!isNearest) {
            return navList[0];
        }
        return this._getNearestNav(navList);
    }

    /**
     * 从指定的寻路候选列表中查找最短的。
     * @param navList
     * @return
     *
     */
    private _getNearestNav(navList: GameConfig.NavigationConfigM[]): GameConfig.NavigationConfigM {
        let result: GameConfig.NavigationConfigM;
        let len: number = navList.length;
        if (len == 1) {
            result = navList[0];
        }
        else {
            let posConfig: GameConfig.NavigationConfigM;
            let minLen: number = int.MAX_VALUE;
            let tempIndex: number = 0;
            for (let i: number = 0; i < len; ++i) {
                posConfig = navList[i];

                if (this.canEnterScene(posConfig.m_iSceneID)) //首要需要可以进入场景
                {
                    if (posConfig.m_iSceneID == this.m_curSceneID) //就在本场
                    {
                        tempIndex = i;
                        break;
                    }
                    else {
                        let pathList: Teleport[] = G.Mapmgr.crossPath.findCrossPathByID(this.m_curSceneID, posConfig.m_iSceneID);

                        if (pathList != null && pathList.length < minLen) {
                            tempIndex = i;
                            minLen = pathList.length;
                        }
                    }
                }
            }
            result = navList[tempIndex];
        }

        return result;
    }

    /**
     * 判断能否进入指定的场景。
     * @param sceneID
     * @param needPrompt
     * @return
     *
     */
    canEnterScene(sceneID: number, needPrompt: boolean = false): boolean {
        let result: boolean = false;
        let sceneConfig: GameConfig.SceneConfigM = this.getSceneInfo(sceneID).config;

        if (defines.has('_DEBUG')) {
            uts.assert(sceneConfig != null, '找不到场景配置 id=' + sceneID);
        }

        if (G.DataMgr.heroData.level >= sceneConfig.m_ucRequiredLevel) {
            result = true;
        }
        else {
            if (needPrompt) {
                G.TipMgr.addMainFloatTip(uts.format('{0}级以后才能进入此场景。', sceneConfig.m_ucRequiredLevel));
            }
        }
        return result;
    }

    /**
     * 获取活动寻路配置。
     * @param type 寻路类型。
     * @param actID 活动ID。
     * @return
     *
     */
    getActNavigation(type: number, actID: number): GameConfig.NavigationConfigM {
        let nav: GameConfig.NavigationConfigM = this.m_actNavMap[type + '_' + actID];
        if (null == nav) {
            nav = this.m_actNavMap[type];
        }

        return nav;
    }

    /**
     * 获取活动所在的虚拟场景。
     * @param type
     * @param actID
     * @return
     *
     */
    getActVscene(type: number, actID: number): number {
        let nav: GameConfig.NavigationConfigM = this.getActNavigation(type, actID);
        if (null != nav) {
            return nav.m_iSceneID;

        }

        return 0;
    }

    /**
     * 获取斩妖除魔BOSS寻路表
     * @param	bossId
     * @return
     */
    getZycmNav(bossId: number): GameConfig.NavigationConfigM {
        return this.m_zycmNavMap[bossId];
    }

    private setGuajiNav(data: GameConfig.NavigationCfg_OnHookM[]): void {
        for (let config of data) {
            this.m_gujiaNavMap[config.m_iLevel] = config;
        }
    }

    /**
     *
     * @param level
     * @return
     *
     */
    getGuajiNav(level: number): GameConfig.NavigationCfg_OnHookM {
        return this.m_gujiaNavMap[level];
    }

    setSceneMonsters(sceneID: number, idList: number[]) {
        let savedList: number[] = this.sceneMonsterMap[sceneID];
        if (null == savedList) {
            this.sceneMonsterMap[sceneID] = savedList = [];
        } else {
            savedList.length = 0;
        }
        for (let id of idList) {
            if (id > 0) {
                savedList.push(id);
            }
        }
    }

    /**
     * 获取指定场景上的怪物id列表（缓存数据，不保证即时性）。
     * @param sceneID
     */
    getSceneMonsters(sceneID: number): number[] {
        return this.sceneMonsterMap[sceneID];
    }

    getywbossCfg(bossId: number) {
        return this.ywbossNavMap[bossId];
    }

}
export default SceneData;