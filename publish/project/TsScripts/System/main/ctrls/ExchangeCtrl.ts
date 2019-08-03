import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { ExchangeView } from 'System/business/view/ExchangeView'
import { Macros } from 'System/protocol/Macros'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { EnumStoreID, EnumMonsterID, EnumPinstanceRule, EnumGuide, EnumEffectRule } from 'System/constants/GameEnum'
import { FuncBtnState, PathingState, FindPosStrategy, NPCQuestState } from 'System/constants/GameEnum'
import { NPCData } from '../../data/NPCData';
import { TinyMapData } from '../../map/view/TinyMapData';
import { MapSignType } from '../../map/view/MapSignType';

export class ExchangeCtrl extends BaseFuncIconCtrl {

    private readonly NPC_ID: number = 100202;
    //private readonly SCENE_ID: number = 4;

    constructor() {
        super(KeyWord.BAR_FUNCTION_EXCHANGE);
        this.data.setDisplayName('兑换');
    }

    handleClick() {
        //改成寻路到NPC处...然后打开
        G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_EXCHANGE);

        //G.Mapmgr.findPath2Npc(this.NPC_ID, false, 0, true);

        //let config = NPCData.getNpcConfig(this.NPC_ID);
        //let npcName = config.m_szNPCName;
        //let npcInfo = G.DataMgr.sceneData.getSceneNpcInfo(this.SCENE_ID, this.NPC_ID);
        //let npcData = new TinyMapData(this.SCENE_ID, this.NPC_ID, npcName, config.m_szNPCDesignation, this._getMapNpcQuestType(this.NPC_ID), npcInfo.x, npcInfo.y);
        //this.handleItemClick(npcData, true);

        //G.Uimgr.createForm<ExchangeView>(ExchangeView).open(EnumStoreID.MALL_REPUTATION);
    }

    //private handleItemClick(data: TinyMapData, isTransport: boolean): PathingState {
    //    let state: PathingState = PathingState.CANNOT_REACH;
    //    if (data.mapType == MapSignType.Map_None) {
    //        return state;
    //    }

    //    if (data.mapType == MapSignType.Map_Monster) {
    //        state = G.Mapmgr.goToPos(data.sceneID, data.x, data.y, isTransport, true, FindPosStrategy.Specified, data.id, true);
    //    }
    //    else if (data.mapType == MapSignType.Map_Waypoint) {
    //        state = G.Mapmgr.goToPos(data.sceneID, data.x, data.y, isTransport, true);
    //    }
    //    else {
    //        state = G.Mapmgr.findPath2Npc(data.id, isTransport, 0, true);
    //    }
    //    return state;
    //}

    //private _getMapNpcQuestType(npcID: number): number {
    //    let state: number = G.DataMgr.questData.getStateByNPCID(npcID, G.DataMgr.heroData);
    //    let result: number = MapSignType.Map_Npc;
    //    switch (state) {
    //        case NPCQuestState.complete:
    //            result = MapSignType.Map_Npc_Get_Reward;
    //            break;
    //        case NPCQuestState.receive:
    //            result = MapSignType.Map_Npc_Accept_Quest;
    //            break;
    //        case NPCQuestState.doing:
    //            result = MapSignType.Map_Npc_Quest_Doing;
    //            break;
    //        default:
    //            break;
    //    }
    //    return result;
    //}
}