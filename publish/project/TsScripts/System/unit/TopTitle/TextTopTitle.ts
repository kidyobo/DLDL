import { TypeCacher } from "System/TypeCacher"
import { Global as G } from "System/global";
import { TopTitleContainer } from "System/unit/TopTitle/TopTitleContainer"
export class TextTopTitle {
    public container: TopTitleContainer;
    public id: number;
    public cacheX: number;
    public cacheY: number;
    private gameObject: UnityEngine.GameObject;
    private textLabel: UnityEngine.UI.Text;
    private _width: number = 0;
    private _height: number = 0;
    get width(): number {
        return this._width;
    }
    get height(): number {
        return this._height;
    }
    private _text: string = null;
    set text(value: string) {
        if (value != this._text) {
            this._text = value;
            if (value) {
                this.textLabel.text = value;
                this._width = this.textLabel.preferredWidth;
                this._height = this.textLabel.preferredHeight;
            }
            else {
                this.textLabel.text = "";
                this._width = 0;
                this._height = 0;
            }
        }
    }
    get text(): string {
        return this._text;
    }
    init(container: TopTitleContainer) {
        this.container = container;
        this.gameObject = G.ViewCacher.worldUIElementView.createTextTopTitle(container);
        this.textLabel = this.gameObject.GetComponent(TypeCacher.Text) as UnityEngine.UI.Text;
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
export default TextTopTitle;