import { Global as G } from 'System/global'
import { MapSceneConfig } from 'System/data/scene/MapSceneConfig'
import { GateInfo } from 'System/data/scene/GateInfo'
import { NPCInfo } from 'System/data/scene/NPCInfo'
import { NPCData } from 'System/data/NPCData'
import { Constants } from "System/constants/Constants"
import { JavaCaller } from 'System/utils/JavaCaller'
import { SafeJson } from './utils/SafeJson';

interface DeviceInfo {
    readonly id:string;
    readonly brand:string;
    readonly device:string;
    readonly idfa:string;
    readonly imei:string;
    readonly mac:string;
    readonly cpu_abi: string;
}

//该类中会存放一些效率问题改为cs方法，但是ts又要保留方法给老版本使用
export class Compatible {
    /**
     * 解析地编数据
     * 因为读取地编数据有两种不同的方式，所以会有一些不同
     * 在读取不是本场景的数据的时候只需要更新一些特有的数据就可以，比如npc数据，传送点数据等
     * @param ba
     * @return 
     * 
     */
    static loadMapData(loadConfig: MapSceneConfig, bytes: number[]): void {
        let byteArray: Game.ByteArray = new Game.ByteArray(bytes, null);
        byteArray.useLittleEndian = true;
        byteArray.ReadInt32();
        loadConfig.curMapWidth = byteArray.ReadInt16();//场景像素宽
        loadConfig.curMapHeight = byteArray.ReadInt16();//场景像素高
        loadConfig.gateInfos = [];
        //循环写入场景中传送点信息
        let length = byteArray.ReadInt16();
        for (let i = 0; i < length; i++) {
            let gate = new GateInfo();
            gate.gateID = byteArray.ReadInt32();
            gate.gateName = byteArray.ReadString();
            gate.direction = byteArray.ReadByte();
            gate.x = byteArray.ReadInt16();
            gate.y = byteArray.ReadInt16();
            gate.destSceneID = byteArray.ReadInt32();
            gate.destX = byteArray.ReadInt16();
            gate.destY = byteArray.ReadInt16();
            loadConfig.gateInfos.push(gate);
        }
        //循环写入场景中NPC信息
        loadConfig.npcInfos = [];
        length = byteArray.ReadInt16();
        for (let i = 0; i < length; i++) {
            let npc = new NPCInfo();
            npc.sceneID = loadConfig.sceneID;
            npc.npcID = byteArray.ReadInt32();
            npc.direction = byteArray.ReadByte();
            npc.x = byteArray.ReadInt16();
            npc.y = byteArray.ReadInt16();
            npc.config = NPCData.getNpcConfig(npc.npcID);
            loadConfig.npcInfos.push(npc);
        }

        if (loadConfig.sceneID == G.DataMgr.sceneData.curSceneID) {
            G.ModuleMgr.SceneModule.sceneLoadUtil.m_sceneData.curSceneConfig = loadConfig;
            let tileMap = G.Mapmgr.tileMap;
            tileMap.SetTileData(loadConfig.curMapWidth, loadConfig.curMapHeight, G.CameraSetting.xMeterScale, byteArray);
            // 传送点数据
            let tpPosList: UnityEngine.Vector2[] = [];
            let tpIdList: number[] = [];
            for (let gateInfo of loadConfig.gateInfos) {
                tpPosList.push(new UnityEngine.Vector2(gateInfo.x, gateInfo.y));
                tpIdList.push(gateInfo.gateID);
            }
            tileMap.SetTeleportInfos(Constants.TELEPORT_VALID_DISTANCE, tpPosList, tpIdList);
        }
        byteArray.Dispose();
    }

    static getCurScreenResolution(): { width: number, height: number } {
        let curres = UnityEngine.Screen.currentResolution;
        let size = { width: 0, height: 0 };
        size.width = curres.width;
        size.height = curres.height;
        return size;
    }

    static getSystemInfo(): { deviceModel: string, operatingSystem: string } {
        let sysinfo = UnityEngine.SystemInfo;
        let os = sysinfo.operatingSystem.split('/')[0];
        os = (os == null || os == undefined) ? sysinfo.operatingSystem : os.replace(/OS/g, '').replace(/\s/g, '');
        return {
            deviceModel: sysinfo.deviceModel.replace(/\s/g, '_').replace(/\r\n/g, '_').replace(/\n/g, '_')
            , operatingSystem: os
        };
    }

    static isEmulator(): boolean {
        let sysinfo = UnityEngine.SystemInfo;
        let processor = sysinfo.processorType;
        if (processor.search(/intel/i) >= 0 || processor.search(/amd/i) >= 0) {
            return true;
        }

        return false;
    }

    static getBatteryLevel(): number {
        let sysinfo = UnityEngine.SystemInfo;
        return sysinfo.batteryLevel;
    }

    static setBuglyUserId(userid: string) {
        if (Game.Tools.SetBuglyUserId) {
            Game.Tools.SetBuglyUserId(userid);
        }
    }

    static getDeviceInfo(): DeviceInfo {
        if (G.IsAndroidPlatForm) {
            let systemInfoObj = JavaCaller.getJavaObject('com.fy.utils.system.SystemInfo', null, 'getInstance');
            let infostring = JavaCaller.comCallRetString(systemInfoObj, 'getInfo'); 
            uts.log('getDeviceInfo:' + infostring);
            let info = SafeJson.parse(infostring);
            info.idfa = '';
            return info;
        } else if (G.IsIOSPlatForm) {
            return {
                id: '',
                brand: '',
                device: '',
                idfa: '',
                imei: '',
                mac: '',
                cpu_abi: 'arm64-v8a'
            };
        } else {
            return {
                id: '',
                brand: '',
                device: '',
                idfa: '',
                imei: '',
                mac: '',
                cpu_abi: 'pc'
            };
        }
    }
}