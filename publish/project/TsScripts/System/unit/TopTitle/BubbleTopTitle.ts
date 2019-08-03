import { TypeCacher } from "System/TypeCacher"
import { Global as G } from "System/global";
import { TopTitleContainer } from "System/unit/TopTitle/TopTitleContainer"
export class BubbleTopTitle {
    public container: TopTitleContainer;
    private gameObject: UnityEngine.GameObject;
    private textLabel: UnityEngine.UI.UIText;
    private _width: number = 0;
    private _height: number = 0;
    get width(): number {
        return this._width + 25;
    }
    get height(): number {
        return this._height + 15;
    }
    private _text: string = null;
    set text(value: string) {
        if (value != this._text) {
            this._text = value;
            if (value) {
                this.textLabel.text = value;
                this.textLabel.ProcessText();
                this._width = this.textLabel.renderWidth;
                this._height = this.textLabel.renderHeight;
                Game.Tools.SetGameObjectSizeDelta(this.gameObject, this.width, this.height);
                this.enabled = true;
            }
            else {
                this.textLabel.text = "";
                this._width = 0;
                this._height = 0;
                this.enabled = false;
            }
        }
    }
    get text(): string {
        return this._text;
    }
    private _enabled = false;
    public set enabled(value: boolean) {
        if (this._enabled != value) {
            this._enabled = value;
            this.gameObject.SetActive(value);
        }
    }
    public get enabled() {
        return this._enabled;
    }
    init(container: TopTitleContainer) {
        this.container = container;
        this.gameObject = G.ViewCacher.worldUIElementView.createBubble(container);
        this.textLabel = this.gameObject.GetComponentInChildren(TypeCacher.UIText) as UnityEngine.UI.UIText;
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
export default BubbleTopTitle;