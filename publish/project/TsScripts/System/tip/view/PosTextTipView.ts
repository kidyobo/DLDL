import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { UIPathData } from "System/data/UIPathData"
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { Global as G } from 'System/global'

export class PosTextTipView extends CommonForm {
    private prefab: UnityEngine.GameObject;
    private text: UnityEngine.UI.Text;
    private m_textValue: string;
    private animator: UnityEngine.Animator;
    private set textValue(value: string) {
        if (this.m_textValue != value) {
            this.m_textValue = value;
            this.text.text = value;
        }
    }
    private m_color: string;
    private set color(value: string) {
        if (this.m_color != value) {
            this.m_color = value;
            this.text.color = Color.toUnityColor(value);
        }
    }
    private worldZ: number = 0;
    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Effect;
    }
    protected resPath(): string {
        return UIPathData.PosTextTipView;
    }

    protected initElements() {
        this.prefab = this.elems.getElement("prefab");
        this.text = this.elems.getText("text");
        this.animator = this.elems.getAnimator("text");
        this.worldZ = this.prefab.transform.position.z;
    }

    protected initListeners() {
    }

    protected onOpen() {
    }

    protected onClose() {

    }

    showTextAtPosition(text: string,color:string, target: UnityEngine.Transform, offsetX: number, offsetY: number) {
        Game.Invoker.EndInvoke(this.form, "lateClose");
        let obj = this.prefab;
        this.textValue = text;
        this.color = color;
        let v3 = G.cacheVec3;
        Game.Tools.GetPosition(target, v3);
        v3.z = this.worldZ;
        obj.transform.position = v3;

        this.animator.Play("up", 0, 0);
        Game.Invoker.BeginInvoke(this.form, "lateClose", 1.5, delegate(this, this.close));
    }
}