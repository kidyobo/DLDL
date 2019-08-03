import { ElemFinder } from 'System/uilib/UiUtility'
import { NPCQuestState } from 'System/constants/GameEnum'
import { TopTitleContainer } from "System/unit/TopTitle/TopTitleContainer"
import { Global as G } from "System/global";
export class NpcQuestStateTopTitle {
    public container: TopTitleContainer;
    private gameObject: UnityEngine.GameObject;
    private complete: UnityEngine.GameObject;
    private receive: UnityEngine.GameObject;
    private doing: UnityEngine.GameObject;
    private limit: UnityEngine.GameObject;
    get width(): number {
        return 76;
    }
    get height(): number {
        return 50;
    }
    private _active: boolean = false;
    private _setActive(value: boolean) {
        if (value != this._active) {
            this._active = value;
            this.gameObject.SetActive(value);
        }
    }
    private _state: NPCQuestState = NPCQuestState.noQuest;
    set state(value: NPCQuestState) {
        if (this._state != value) {
            this._state = value;
            if (NPCQuestState.noQuest == value) {
                this._setActive(false);
            }
            else {
                if (NPCQuestState.complete == value) {
                    this.setImage(this.complete);
                } else if (NPCQuestState.receive == value) {
                    this.setImage(this.receive);
                } else if (NPCQuestState.doing == value) {
                    this.setImage(this.doing);
                } else {
                    this.setImage(this.limit);
                }
                this._setActive(true);
            }
        }
    }
    get state() {
        return this._state;
    }
    private setImage(which: UnityEngine.GameObject) {
        this.complete.SetActive(which == this.complete);
        this.receive.SetActive(which == this.receive);
        this.doing.SetActive(which == this.doing);
        this.limit.SetActive(which == this.limit);
    }
    init(container: TopTitleContainer) {
        this.container = container;
        this.gameObject = G.ViewCacher.worldUIElementView.createNpcQuestStateTopTitle(container);
        this.complete = ElemFinder.findObject(this.gameObject, 'complete');
        this.receive = ElemFinder.findObject(this.gameObject, 'receive');
        this.doing = ElemFinder.findObject(this.gameObject, 'doing');
        this.limit = ElemFinder.findObject(this.gameObject, 'limit');
    }
    private _cacheX: number = 0;
    private _cacheY: number = 0;
    setPosition(x: number, y: number) {
        if (this._cacheX != x || this._cacheY != y) {
            this._cacheX = x;
            this._cacheY = y;
            Game.Tools.SetGameObjectLocalPosition(this.gameObject, x, y, 0);
        }
    }
}
export default NpcQuestStateTopTitle;