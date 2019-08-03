import { Global as G } from "System/global"
import { EventDispatcher } from "System/EventDispatcher"
import { Macros } from 'System/protocol/Macros'
import { NetHandler } from "System/protocol/NetHandler"
import { RankView } from "System/rank/RankView"

/**
 *排行榜模块 
 * @author bondzheng
 * 
 */
export class RankModule extends EventDispatcher {
   
    constructor() {
        super();
        this.addNetListener(Macros.MsgID_RefreshRankInfo_Response, this.onWorldRankResponse);     
    }


    private onWorldRankResponse(msg: Protocol.RefreshRankInfo_Response) {
        let rankView = G.Uimgr.getForm<RankView>(RankView);
        if (rankView != null) {
            rankView.onWorldRankResponse(msg);
        }
    }
}
