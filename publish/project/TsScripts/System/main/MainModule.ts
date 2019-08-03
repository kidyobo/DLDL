import { Global as G } from "System/global";
import { EventDispatcher } from "System/EventDispatcher";
import { Events } from "System/Events";
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { Macros } from "System/protocol/Macros"
import { KeyWord } from "System/constants/KeyWord"
import { MapView } from 'System/map/view/MapView';

//主模块
export class MainModule extends EventDispatcher {
    private headContainerRoot: Game.TransformFollower;
    private unitBoardRoot: UnityEngine.Transform;
    private textTopTitle: UnityEngine.GameObject;
    private bloodTopTitle: UnityEngine.GameObject;
    constructor() {
        super()
        this.addEvent(Events.HeroDataChange, this.onHeroDataChange);
        this.addNetListener(Macros.MsgID_FirstOpenChange_Response, this.onFirstOpenChangeResponse);
        this.addNetListener(Macros.MsgID_FirstOpenChange_Notify, this.onFirstOpenChangeNotify);
        this.addNetListener(Macros.MsgID_GetIconMonster_Response, this._onGetIconMonsterReponse);
    }
    onEnterScene() {
        G.ViewCacher.mainView.open();
        let form = G.Uimgr.getForm<MapView>(MapView);
        if (form != null) {
            form.onSceneChange();
        }
    }
    private onHeroDataChange() {
        G.ViewCacher.mainView.needUpdateView = true;
    }

    private onFirstOpenChangeResponse() {

    }
    private onFirstOpenChangeNotify() {
    }
    private _onGetIconMonsterReponse(response: Protocol.CSGetIconMonsterResponse): void {
        let view = G.Uimgr.getForm<MapView>(MapView);
        if (view != null) {
            view.updateMapIcon(response.m_iSceneID,response.m_astList);
        }
    }
}
export default MainModule;