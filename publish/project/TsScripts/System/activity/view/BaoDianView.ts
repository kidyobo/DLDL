//import { Global as G } from 'System/global'
//import { CommonForm, UILayer } from 'System/uilib/CommonForm'
//import { UIPathData } from 'System/data/UIPathData'
//import { ResUtil } from 'System/utils/ResUtil'
//import { DataFormatter } from 'System/utils/DataFormatter'
//import { RegExpUtil } from 'System/utils/RegExpUtil'
//import { BossView } from 'System/pinstance/boss/BossView'
//import { KeyWord } from 'System/constants/KeyWord'
//import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
//import { KfhdData } from 'System/data/KfhdData'
//import { BaoDianItemView } from 'System/activity/view/BaoDianItemView'
//import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'

//enum TweenEndPos {
//    leftMost = 0,
//    left = 1,
//    middle = 2,
//    right = 3,
//    rightMost = 4,
//}


//export class BaoDianView extends CommonForm {

//    private readonly ShowCount = 3;
//    private btnClose: UnityEngine.GameObject;

//    /////////////滚动相关/////////////////
//    private items: UnityEngine.GameObject[] = [];
//    private textTitles: UnityEngine.UI.Text[] = [];
//    private btnGos: UnityEngine.GameObject[] = [];
//    private labelBtnGos: UnityEngine.UI.Text[] = [];

//    private poeml: UnityEngine.GameObject;
//    private poemr: UnityEngine.GameObject;

//    private tweenPos: UnityEngine.GameObject[] = [];
//    private tweenPosParent: UnityEngine.GameObject;

//    private uiDrag: Game.UIDragListener;
//    private max_TweenPosNum: number = 5;
//    private modelPos: { [key: number]: number } = {};
//    private endPointScaleBig: UnityEngine.Vector3 = new UnityEngine.Vector3(1, 1, 1);
//    private endPointScaleSmall: UnityEngine.Vector3 = new UnityEngine.Vector3(0.8, 0.8, 0.8);
//    private tweenNeedTime: number = 0.5;
//    private isTweening: boolean = false;

//    constructor() {
//        super(KeyWord.OTHER_FUNCTION_7GOAL_FENGYUEBAODIAN);
//    }
//    layer(): UILayer {
//        return UILayer.Normal;
//    }
//    protected resPath(): string {
//        return UIPathData.BaoDianView;
//    }
//    protected initElements(): void {
//        this.btnClose = this.elems.getElement('btnClose');
//        this.poeml = this.elems.getElement('poeml');
//        this.poemr = this.elems.getElement('poemr');
//        let itemParent = this.elems.getElement('items');
//        for (let i = 0; i < this.ShowCount; i++) {
//            let typeDesc = KeyWord.getDesc(KeyWord.BAODIAN_MAIN_TYPE, KfhdData.BaoDianBigTypes[i]);
//            let obj = ElemFinder.findObject(itemParent, i.toString());
//            this.items.push(obj);

//            let textTitle = ElemFinder.findText(obj, 'textTitle');
//            textTitle.text = typeDesc + '(0/0)';
//            this.textTitles.push(textTitle);

//            let btnGo = ElemFinder.findObject(obj, 'btnGo');
//            this.btnGos.push(btnGo);

//            let labelBtnGo = ElemFinder.findText(btnGo, 'Text');
//            labelBtnGo.text = typeDesc;
//            this.labelBtnGos.push(labelBtnGo);
//        }
//        ////////////滚动相关///////////////
//        this.tweenPosParent = this.elems.getElement('itemPos');
//        for (let i = 0; i < this.max_TweenPosNum; i++) {
//            let obj = ElemFinder.findObject(this.tweenPosParent, i.toString());
//            this.tweenPos.push(obj);
//        }
//        this.uiDrag = Game.UIDragListener.Get(this.elems.getElement('uiDrag'));
//        this.uiDrag.onDrag = delegate(this, this.onDrag);
//    }

//    protected initListeners(): void {
//        this.addClickListener(this.btnClose, this.onClickBtnClose);
//        for (let i = 0; i < this.ShowCount; i++) {
//            let btnGo = this.btnGos[i];
//            this.addClickListener(btnGo, delegate(this, this.onClickBtnGo, KfhdData.BaoDianBigTypes[i]));
//        }
//    }

//    protected onOpen() {
//        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getBaoDianRequest());
//    }

//    protected onClose() {
//    }

//    updateView() {
//        let kfhdData = G.DataMgr.kfhdData;
//        let typeCnt = KfhdData.BaoDianBigTypes.length;
//        let firstUnfinishedType = 0;
//        let cfgsArr: GameConfig.BaoDianCfgM[];
//        for (let i = 0; i < typeCnt; i++) {
//            let type = KfhdData.BaoDianBigTypes[i];
//            cfgsArr = kfhdData.getBaoDianConfigsByType(type);
//            let typeDesc = KeyWord.getDesc(KeyWord.BAODIAN_MAIN_TYPE, type);
//            let subStep = kfhdData.getBaoDianFinishCnt(type);
//            this.textTitles[i].text = typeDesc + '(' + subStep + '/' + cfgsArr.length + ')';
//            if (0 == firstUnfinishedType && subStep < cfgsArr.length) {
//                firstUnfinishedType = type;
//            }
//        }
//        let crtTypeIdx = typeCnt - 1;
//        if (firstUnfinishedType > 0) {
//            // 默认显示第一个没完成的类型
//            crtTypeIdx = KfhdData.BaoDianBigTypes.indexOf(firstUnfinishedType);
//        } 
//        if (0 == crtTypeIdx) {
//            this.initItemPos(TweenEndPos.middle, TweenEndPos.right, TweenEndPos.rightMost);
//        } else if (1 == crtTypeIdx) {
//            this.initItemPos(TweenEndPos.left, TweenEndPos.middle, TweenEndPos.right);
//        } else if (2 == crtTypeIdx) {
//            this.initItemPos(TweenEndPos.leftMost, TweenEndPos.left, TweenEndPos.middle);
//        }
//    }

//    private onClickBtnGo(type: number): void {
//        G.Uimgr.createForm<BaoDianItemView>(BaoDianItemView).open(type);
//    }

//    private onClickBtnClose() {
//        this.close();
//    }

//    private initItemPos(pos1: number, pos2: number, pos3: number) {
//        this.modelPos[0] = pos1;
//        this.modelPos[1] = pos2;
//        this.modelPos[2] = pos3;
//        for (let i = 0; i < this.ShowCount; i++) {
//            let objRect = ElemFinderMySelf.findRectTransForm(this.items[i]);
//            let objNowPos = this.modelPos[i];
//            let endPosRect = ElemFinderMySelf.findRectTransForm(this.tweenPos[objNowPos]);
//            objRect.anchoredPosition = new UnityEngine.Vector2(endPosRect.anchoredPosition.x, endPosRect.anchoredPosition.y);
//            if (this.modelPos[i] == TweenEndPos.middle) {
//                objRect.localScale = this.endPointScaleBig;
//            } else {
//                objRect.localScale = this.endPointScaleSmall;
//            }
//        }
//    }

//    private onDrag() {
//        let eventData = Game.UIDragListener.eventData;
//        if (this.isTweening) {
//            return;
//        }
//        if (eventData.delta.x > 5 && eventData.position.x - eventData.pressPosition.x > 90) {
//            //往右
//            if (this.modelPos[2] == TweenEndPos.rightMost) {
//                return;
//            }
//            for (let i = 0; i < this.ShowCount; i++) {
//                this.isTweening = true;
//                let obj = this.items[i];
//                let endObj = this.tweenPos[this.modelPos[i] + 1];
//                this.tweenObjPostion(obj, endObj, i);
//                this.judgeTweenScale(obj, endObj);
//            }
//        } else if (eventData.delta.x < -5 && eventData.position.x - eventData.pressPosition.x < -90) {
//            //往左
//            if (this.modelPos[0] == TweenEndPos.leftMost) {
//                return;
//            }
//            for (let i = 0; i < this.ShowCount; i++) {
//                this.isTweening = true;
//                let obj = this.items[i];
//                let endObj = this.tweenPos[this.modelPos[i] - 1];
//                this.tweenObjPostion(obj, endObj, i);
//                this.judgeTweenScale(obj, endObj);
//            }
//        }
//    }

//    /**变化位置*/
//    private tweenObjPostion(obj: UnityEngine.GameObject, endObj: UnityEngine.GameObject, i: number) {
//        let tween1 = Tween.TweenPosition.Begin(obj, this.tweenNeedTime, endObj.transform.position, true);
//        tween1.onFinished = delegate(this, this.onTweenOneOver, i, endObj);
//    }

//    /**判断tweenScale的大小*/
//    private judgeTweenScale(obj: UnityEngine.GameObject, endObj: UnityEngine.GameObject) {
//        let endPosIndex = this.tweenPos.indexOf(endObj);
//        if (endPosIndex == TweenEndPos.middle) {
//            let scaleAni = Tween.TweenScale.Begin(obj, this.tweenNeedTime, this.endPointScaleBig);
//        } else {
//            let scaleAni = Tween.TweenScale.Begin(obj, this.tweenNeedTime, this.endPointScaleSmall);
//        }
//    }


//    private onTweenOneOver(index: number, endPoint: UnityEngine.GameObject) {
//        this.modelPos[index] = this.tweenPos.indexOf(endPoint);
//        if (index + 1 == this.ShowCount) {
//            this.isTweening = false;
//        }
//    }
//}