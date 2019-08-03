import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { Macros } from 'System/protocol/Macros'
import { Events } from 'System/Events'

export class NewFunctionTrailerModule extends EventDispatcher {

    constructor() {
        super();
        //事件监听
        //this.addEvent(Events.updateJuYanInfo, this.updateNewFunctionTrailerPanel);
        //this.addNetListener(Macros.MsgID_FaZhen_PartActive_Notify, this.updateNewFunctionTrailerPanel);
        //this.addNetListener(Macros.MsgID_FaZhen_Response, this.updateNewFunctionTrailerPanel);

    }

    private updateNewFunctionTrailerPanel() {
       // G.ViewCacher.mainView.newFunctionTrailerCtrl.updateView();
    }
}
