import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'

export class GuideArrowView extends CommonForm {
    private arrow: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private isRight: boolean;

    private openArrowTarget: UnityEngine.GameObject;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Guide;
    }

    protected resPath(): string {
        return UIPathData.GuideArrowView;
    }

    open(arrowTarget: UnityEngine.GameObject, isright: boolean = true) {
        this.openArrowTarget = arrowTarget;
        this.isRight = isright;
        super.open();
    }

    protected onOpen() {
        let targetRect = this.openArrowTarget.transform as UnityEngine.RectTransform;
        let arrowRect = this.arrow.transform as UnityEngine.RectTransform;

        let com = this.openArrowTarget.GetComponent(UnityEngine.Canvas.GetType()) as UnityEngine.Canvas;
        if (com == null) {
            com = this.openArrowTarget.AddComponent(UnityEngine.Canvas.GetType()) as UnityEngine.Canvas;
            Game.Tools.AddGraphicRaycaster(this.openArrowTarget);
        }
        com.overrideSorting = true;
        com.sortingOrder = this.sortingOrder + 1;

        arrowRect.anchorMax = targetRect.anchorMax;
        arrowRect.anchorMin = targetRect.anchorMin;
        arrowRect.anchoredPosition = targetRect.anchoredPosition;

    }

    protected onClose() {
        let com = Game.Tools.GetGraphicRaycaster(this.openArrowTarget);
        if (null != com) {
            UnityEngine.GameObject.DestroyImmediate(com);
        }
        com = this.openArrowTarget.GetComponent(UnityEngine.Canvas.GetType());
        if (null != com) {
            UnityEngine.GameObject.DestroyImmediate(com);
        }
    }

    protected initElements(): void {
        this.arrow = this.elems.getElement('arrow');
    }

    protected initListeners(): void {
    }
}