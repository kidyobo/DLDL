import { UiElements } from 'System/uilib/UiElements'
import { WangHouJiangXiangView } from 'System/activity/whjx/WangHouJiangXiangView'

export abstract class WhjxBaseLogic {
    protected view: WangHouJiangXiangView;

    protected gameObject: UnityEngine.GameObject;
    private btnRule: UnityEngine.GameObject;

    private isOpened = false;

    constructor(view: WangHouJiangXiangView) {
        this.view = view;
    }

    initElements(go: UnityEngine.GameObject, elems: UiElements) {
        this.gameObject = go;
        this.btnRule = elems.getElement('btnRule');
    }

    initListeners() {
        Game.UIClickListener.Get(this.btnRule).onClick = delegate(this, this.onclickBtnRule);
    }

    open() {
        this.isOpened = true;
        this.gameObject.SetActive(true);
        this.onOpen();
    }

    close() {
        this.isOpened = false;
        this.gameObject.SetActive(false);
    }

    get IsOpened() {
        return this.isOpened;
    }

    private onclickBtnRule() {
        this.view.onclickBtnRule();
    }

    abstract onOpen();
    abstract onTickTimer(timer: Game.Timer);
    abstract onPanelResponse();
}