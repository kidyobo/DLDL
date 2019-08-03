import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Color } from 'System/utils/ColorUtil'

export enum EnumGuideArrowRotation {
    right = 0,
    left = 180,
    top = 90,
    bottom = -90,
}

export class FunctionGuideView extends CommonForm {
    private arrow: UnityEngine.GameObject;
    private rotation2word: { [rotaion: number]: UnityEngine.GameObject } = {};

    private mask: UnityEngine.GameObject;
    private maskImage: UnityEngine.UI.Image;
    private arrowCanvas: UnityEngine.Canvas;

    private arrowTarget: UnityEngine.GameObject;
    private focusTargets: UnityEngine.GameObject[];
    private arrowRotation: EnumGuideArrowRotation = 0;
    private arrowOffset: Game.Vector2;
    private animGoOffset: Game.Vector2;
    private animGoSizeOffset: Game.Vector2;
    private clickMaskCnt = 0;

    private animGo: UnityEngine.GameObject;
    private animGoVec3: UnityEngine.Vector3;
    private animGoVec2: UnityEngine.Vector2;

    private desParent: UnityEngine.GameObject;
    private textDes: UnityEngine.UI.Text;
    private oldDes: string = "";
    private showDes: boolean = false;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Guide;
    }

    protected resPath(): string {
        return UIPathData.FunctionGuideView;
    }

    stopGuide(arrowTarget: UnityEngine.GameObject) {
        if (null == arrowTarget || this.arrowTarget == arrowTarget) {
            this.close();
        }
    }

    protected onOpen() {
        let guider = G.GuideMgr.getCurrentGuider(0) as FunctionGuider;
        if (null != guider) {
            guider.onGuideStepFinished(EnumGuide.FunctionGuide_OpenView);
        }
    }

    protected onClose() {
        this.setGuideDes(false);
        this.guideOffTarget(this.arrowTarget);
        if (this.hasTimer("updateTargetPos")) {
            this.removeTimer("updateTargetPos");
        }
    }

    protected initElements(): void {
        this.arrow = this.elems.getElement('arrow');
        this.animGo = this.elems.getElement('animGo');
        this.animGoVec3 = new UnityEngine.Vector3(0, 0, 0);
        this.animGoVec2 = new UnityEngine.Vector2(0, 0);
        this.arrow.SetActive(false);

        this.desParent = this.elems.getElement('desParent');
        this.textDes = this.elems.getText('textDes');
        this.desParent.SetActive(false);
        this.rotation2word[EnumGuideArrowRotation.right] = this.elems.getElement('right');
        this.rotation2word[EnumGuideArrowRotation.left] = this.elems.getElement('left');
        this.rotation2word[EnumGuideArrowRotation.top] = this.elems.getElement('top');
        this.rotation2word[EnumGuideArrowRotation.bottom] = this.elems.getElement('bottom');

        this.mask = this.elems.getElement('mask');
        this.maskImage = this.elems.getImage('mask');
        this.arrowCanvas = this.arrow.GetComponent(UnityEngine.Canvas.GetType()) as UnityEngine.Canvas;
        this.arrowCanvas.overrideSorting = true;
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickMask);
    }

    public setMaskImageColor(color: string ='00000087'): void {
        this.maskImage.color = Color.toUnityColor(color);
    }

    /**
     * 引导界面描述，用这个要记得隐藏掉
     * @param isShow
     * @param str
     */
    setGuideDes(isShow: boolean, str: string = ""): void {
        if (isShow) {
            if (!this.desParent.activeInHierarchy) {
                this.desParent.SetActive(isShow);
                if (this.oldDes != str) {
                    this.textDes.text = str;
                    this.oldDes = str;
                }
            }
        } else {
            if (this.desParent.activeInHierarchy) {
                this.desParent.SetActive(isShow);
            }
        }
    }

    guideOn(arrowTarget: UnityEngine.GameObject, rotation: EnumGuideArrowRotation, offset: Game.Vector2, focusTargets: UnityEngine.GameObject[] = null, showmask: boolean = true, animGoOffSet: Game.Vector2 = { x: 0, y: 0 }, animGoSizeOffSet: Game.Vector2 = { x: 0, y: 0 }, needUpdataPos: boolean = false) {
        this.mask.SetActive(showmask);
        if (null != arrowTarget) {
            if (this.arrowTarget != arrowTarget) {
                this.guideOffTarget(this.arrowTarget);
                if (null == focusTargets || 0 == focusTargets.length) {
                    focusTargets = [arrowTarget];
                } else if (focusTargets.indexOf(arrowTarget) < 0) {
                    focusTargets.splice(0, 0, arrowTarget);
                }
                this.arrowTarget = arrowTarget;
                this.focusTargets = focusTargets;
                this.arrowRotation = rotation;
                this.arrowOffset = offset;
                this.animGoOffset = animGoOffSet;
                this.animGoSizeOffset = animGoSizeOffSet;
                this.updateTarget(arrowTarget, needUpdataPos);
                this.clickMaskCnt = 0;
            } else {
                this.updateTarget(arrowTarget, needUpdataPos);
            }
        }
    }

    updateTarget(target: UnityEngine.GameObject, needUpdataPos: boolean = false) {
        if ((null == target || target == this.arrowTarget) && null != this.arrowTarget) {
            let cnt = this.focusTargets.length;
            let order = this.sortingOrder + 1;
            for (let i = 0; i < cnt; i++) {
                let focusTarget = this.focusTargets[i];
                if (focusTarget == null || focusTarget.Equals(null)) {
                    continue;
                }
                let com = focusTarget.GetComponent(UnityEngine.Canvas.GetType()) as UnityEngine.Canvas;
                if (com == null) {
                    com = focusTarget.AddComponent(UnityEngine.Canvas.GetType()) as UnityEngine.Canvas;
                    Game.Tools.AddGraphicRaycaster(focusTarget);
                }
                com.overrideSorting = true;
                com.sortingOrder = order;
                this.showCanvas(com, order, 0);
                order++;
            }

            this.arrowCanvas.sortingOrder = order;
            if (this.hasTimer("updateTargetPos")) {
                this.removeTimer("updateTargetPos");
            }
            if (needUpdataPos) {
                this.addTimer("updateTargetPos", 500, 0, this.updateTargetPos);
            } else {
                this.updateTargetPos();
            }


            for (let r in this.rotation2word) {
                this.rotation2word[r].SetActive((Number(r) == this.arrowRotation));
            }

            this.arrow.SetActive(true);
            this.animGo.SetActive(true);
        }
    }

    private updateTargetPos() {
        let targetPos = this.arrowTarget.transform.position;
        let arrowRect = this.arrow.transform as UnityEngine.RectTransform;
        targetPos = arrowRect.parent.InverseTransformPoint(targetPos);
        targetPos.x += this.arrowOffset.x;
        targetPos.y += this.arrowOffset.y;
        targetPos.z = 0;
        arrowRect.localPosition = targetPos;
        arrowRect.rotation = UnityEngine.Quaternion.Euler(0, 0, this.arrowRotation);

        let targetRect = this.arrowTarget.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
        let animGoRect = this.animGo.transform as UnityEngine.RectTransform;
        this.animGoVec2.Set(targetRect.sizeDelta.x + this.animGoSizeOffset.x, targetRect.sizeDelta.y + this.animGoSizeOffset.y);
        animGoRect.sizeDelta = this.animGoVec2;
        this.animGoVec3.Set(targetRect.position.x + this.animGoOffset.x, targetRect.position.y + this.animGoOffset.y, targetRect.position.z);
        animGoRect.position = this.animGoVec3;
    }



    guideOffTarget(target: UnityEngine.GameObject) {
        if ((null == target || target == this.arrowTarget) && null != this.arrowTarget) {
            let cnt = this.focusTargets.length;
            for (let i = 0; i < cnt; i++) {
                let focusTarget = this.focusTargets[i];
                if (undefined != focusTarget && !focusTarget.Equals(null)) {
                    let com = Game.Tools.GetGraphicRaycaster(focusTarget);
                    if (null != com) {
                        UnityEngine.GameObject.DestroyImmediate(com);
                    }
                    com = focusTarget.GetComponent(UnityEngine.Canvas.GetType());
                    if (null != com) {
                        UnityEngine.GameObject.DestroyImmediate(com);
                    }
                }
            }
            this.focusTargets = null;
            this.arrowTarget = null;
            this.arrow.SetActive(false);
            this.animGo.SetActive(false);
        }
    }

    private onClickMask() {
        if (++this.clickMaskCnt > 2) {
            this.clickMaskCnt = 0;
            let guider = G.GuideMgr.getCurrentGuider(0);
            if (null != guider) {
                this.setMaskImageColor();
                G.GuideMgr.cancelGuide(guider.type);
            }
        }
    }
    private showCanvas(com: UnityEngine.Canvas, order: number, num: number) {
        if (num >= 5)
            return;
        if (com == null) return;

        if (!com.overrideSorting) {
            let timer = new Game.Timer("showCanvas", 100, 1, delegate(this, this.callBack, com, order, num));
        } else {
            com.sortingOrder = order;
        }
    }
    private callBack(timer: Game.Timer, com: UnityEngine.Canvas, order: number, num: number) {
        
        if (com == undefined || com == null || !this.isOpened) return;
        com.overrideSorting = true;
        this.showCanvas(com, order, num++);
    }
    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    /**
     * 执行指定的引导步骤。
     * @param step
     *
     */
    executeGuide(type: EnumGuide, step: EnumGuide, ...args): void {
    }

    force(type: EnumGuide, step: EnumGuide, ...args): void {
    }
}