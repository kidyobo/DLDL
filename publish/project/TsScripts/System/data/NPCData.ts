import { KeyWord } from "System/constants/KeyWord"
import { RegExpUtil } from "System/utils/RegExpUtil"
import { StringUtil } from "System/utils/StringUtil"
import { NpcOperMgr } from "System/Npc/NpcOperMgr"
import { Global as G } from 'System/global'

export enum NPCID {
    Wangrong = 100523,
    /**
    * 宗门任务使者。
    */
    guildQuestNpc = 100036,
}

/**
* npc配置和逻辑解析 
* @author fygame
* 
*/

export class NPCData {
    /**
    * [npcid, npcconfig]
    */
    private static m_dataMap: { [npcID: number]: GameConfig.NPCConfigM };

    /**
    * [npcid, NpcActorMonster config list]
    */
    private static m_npcActorMonsterMap: { [npcID: number]: GameConfig.ActorMonsterM[] };

    private static m_scene2npcActorList: { [sceneID: number]: number[] };

    /**
    * 通过副本ID找出对应的NPC。
    */
    private m_pid2npcMap: { [pinstanceID: number]: number };

    /**
    * 带有治疗功能的npcid 
    */
    private m_healNpcMap: number[];

    /**
    * 带有传送功能的npcid 
    */
    private m_transportNpcMap: number[];

    /**
    * 中立交易所 
    */
    private m_zljsNpcMap: number[];

    private m_dataOper: NpcOperMgr;

    /**
    * 构造函数 
    * @param dispatcher
    * 
    */
    constructor() {
        this.m_dataOper = new NpcOperMgr();
    }

    public get dataOper(): NpcOperMgr {
        return this.m_dataOper;
    }

    onCfgReady(): void {
        this.setData();
        this.setNPCActorMonsterConfig();
    }

    /**
    * 设置npc的表格配置数据 
    * @param data
    * 
    */
    private setData(): void {
        let data: GameConfig.NPCConfigM[] = G.Cfgmgr.getCfg('data/NPCConfigM.json') as GameConfig.NPCConfigM[];

        NPCData.m_dataMap = {};
        this.m_pid2npcMap = {};
        this.m_healNpcMap = new Array<number>();
        this.m_transportNpcMap = new Array<number>();
        this.m_zljsNpcMap = new Array<number>();
        var func: GameConfig.NPCFunction;

        let errMsg: string = '';

        for (let i: number = 0; i < data.length; i++) {
            let config = data[i];
            if (config.m_iNPCID != 0) {
                NPCData.m_dataMap[config.m_iNPCID] = config;
            }
            config.m_szTalking1 = RegExpUtil.replaceSign(config.m_szTalking1);
            config.m_szTalking2 = RegExpUtil.replaceSign(config.m_szTalking2);
            config.m_szTalking3 = RegExpUtil.replaceSign(config.m_szTalking3);

            // 解析出副本NPC
            if (config.m_ucFunctionNumber > 0) {
                for (var j: number = config.m_astNPCFunction.length - 1; j >= 0; j--) {
                    func = config.m_astNPCFunction[j];
                    if (0 == func.m_ucFunction) {
                        config.m_astNPCFunction.splice(j, 1);
                    }
                    else if (KeyWord.NPC_FUNCTION_PINSTANCE == func.m_ucFunction) {
                        if (0 != this.m_pid2npcMap[func.m_iParam]) {
                            errMsg += uts.format("NPC{0}和NPC{1}都能进入副本{2}；", config.m_iNPCID, this.m_pid2npcMap[func.m_iParam], func.m_iParam);
                        }
                        this.m_pid2npcMap[func.m_iParam] = config.m_iNPCID;
                    }
                    else if (KeyWord.NPC_FUNCTION_HEAL == func.m_ucFunction) //具备治疗功能的npc
                    {
                        this.m_healNpcMap.push(config.m_iNPCID);
                    }
                    else if (KeyWord.NPC_FUNCTION_TRANSPORT == func.m_ucFunction) //具备治疗功能的npc
                    {
                        this.m_transportNpcMap.push(config.m_iNPCID);
                    }
                    else if (KeyWord.NPC_FUNCTION_CONSIGNMENT == func.m_ucFunction) // 中立交易所
                    {
                        this.m_zljsNpcMap.push(config.m_iNPCID);
                    }
                }
            }
        }
        uts.assert("" == errMsg);
    }

    /**
    * 初始化NPC表演怪配置。
    * @param configs
    * 
    */
    private setNPCActorMonsterConfig(): void {
        let configs: GameConfig.ActorMonsterM[] = G.Cfgmgr.getCfg('data/ActorMonsterM.json') as GameConfig.ActorMonsterM[];

        NPCData.m_npcActorMonsterMap = {};
        NPCData.m_scene2npcActorList = {};
        let scene2idList: Array<number>;
        for (let config of configs) {
            let idList = NPCData.m_npcActorMonsterMap[config.m_iNpcID];
            if (null == idList) {
                NPCData.m_npcActorMonsterMap[config.m_iNpcID] = idList = new Array<GameConfig.ActorMonsterM>();
            }
            idList.push(config);
            scene2idList = NPCData.m_scene2npcActorList[config.m_iSceneID];
            if (null == scene2idList) {
                NPCData.m_scene2npcActorList[config.m_iSceneID] = scene2idList = new Array<number>();
            }
            if (scene2idList.indexOf(config.m_iNpcID) < 0) {
                scene2idList.push(config.m_iNpcID);
            }
        }
    }

    static getNpcActorMonsterListByScene(sceneID: number): Array<number> {
        return NPCData.m_scene2npcActorList[sceneID];
    }

    /**
    * 获取指定id的npc表演怪配置。
    * @param id
    * @return 
    * 
    */
    static getNpcActorMonsters(id: number): GameConfig.ActorMonsterM[] {
        return NPCData.m_npcActorMonsterMap[id];
    }
    

    /**
    * 根据副本ID查找关联的NPC的ID。
    * @param pid
    * @return 
    * 
    */
    public getNpcIdByPinstanceId(pid: number): number {
        let result: number = Number(this.m_pid2npcMap[pid]);
        //CONFIG::debug{ assert(result > 0, "副本" + pid + "无法确定关联的NPC！"); }
        return result;
    }

    /**
    * 根据npcid取得表格配置 
    * @param npcID
    * @return 
    * 
    */
    static getNpcConfig(npcID: number): GameConfig.NPCConfigM {
        // 由于NPC表演怪的ID自增1000，所以此处要除1000
        if (npcID > 999999) {
            // 普通NPC的id是6位数
            npcID = npcID / 1000;
        }
        return NPCData.m_dataMap[npcID];
    }

    static isDecorationNpc(npcID: number): boolean {
        let config = NPCData.getNpcConfig(npcID);
        return null != config && config.m_ucFunctionNumber > 0 && KeyWord.NPC_FUNCITON_ACTOR == config.m_astNPCFunction[0].m_ucFunction;
    }

    /**
    * 取得npc的广播喊话 
    * @param npcID
    * @return 
    * 
    */
    public getNPCSpeaking(npcID: number): string {
        let config: GameConfig.NPCConfigM = NPCData.m_dataMap[npcID] as GameConfig.NPCConfigM;
        if (config == null) {
            return "";
        }
        let speakingList: Array<string> = new Array<string>();
        if (config.m_szSpeaking1 != "")
            speakingList.push(config.m_szSpeaking1);
        if (config.m_szSpeaking2 != "")
            speakingList.push(config.m_szSpeaking2);
        if (config.m_szSpeaking3 != "")
            speakingList.push(config.m_szSpeaking3);
        if (speakingList.length == 0)
            return "";
        let random: number = Math.round(Number(Math.random() * speakingList.length));
        return RegExpUtil.replaceSign(speakingList[random]);
    }

    /**
    * 根据NPC功能和功能参数查找NPC的配置。
    * @param func 功能。
    * @param param 参数。
    * @return 
    * 
    */
    public getNPCConfigByFunctionAndParam(func: number, param: number): GameConfig.NPCConfigM {
        let npcFunc: GameConfig.NPCFunction;
        for (let idKey in NPCData.m_dataMap) {
            let config = NPCData.m_dataMap[idKey];
            for (npcFunc of config.m_astNPCFunction) {
                if (func == npcFunc.m_ucFunction && param == npcFunc.m_iParam) {
                    return config;
                }
            }
        }
        return null;
    }

    /**
    * 判断NPC能否交互。
    * @param id NPC的ID。
    * @return 
    * 
    */
    public canInterate(id: number): boolean {
        // npc表演怪不可交互
        if (id > KeyWord.NPC_CONFIG_MAX_ID) {
            return false;
        }
        return true;
    }


    /**
    * 装饰表演npc 
    * @param npcConfig
    * @return 
    * 
    */
    public isDecorationNpc(npcConfig: GameConfig.NPCConfigM): boolean {
        return npcConfig.m_ucFunctionNumber > 0 && KeyWord.NPC_FUNCITON_ACTOR == npcConfig.m_astNPCFunction[0].m_ucFunction;
    }

    /**
    * 雕像展示npc 
    * @param npcConfig
    * @return 
    * 
    */
    static isStatueNpc(npcConfig: GameConfig.NPCConfigM): boolean {
        return null != npcConfig && npcConfig.m_ucFunctionNumber > 0 && KeyWord.NPC_FUNCITON_CITYKING_STATUE == npcConfig.m_astNPCFunction[0].m_ucFunction;
    }
}