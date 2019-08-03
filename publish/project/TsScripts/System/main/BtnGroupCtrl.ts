import { Global as G } from 'System/global'
import { GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'

export class BtnGroupItem {
    goTrans: UnityEngine.Transform;
    goGetSet: GameObjectGetSet;
    private width = 0;
    private height = 0;

    private bgGetSet: GameObjectGetSet;
    private iconImage: UnityEngine.UI.Image;
    private iconGetSet: GameObjectGetSet;
    private iconTextGetSet: TextGetSet;
    private tipMarkGetSet: GameObjectGetSet;
    private textDescGetSet: TextGetSet;
    private timeTextBackground: GameObjectGetSet;

    private effect: UnityEngine.GameObject;

    private oldIconId = 0;
    private oldDesc: string;

    private isSpecial = false;

    private oldPosX: number;
    private oldPosY: number;

    setComponents(go: GameObjectGetSet) {
        this.setCommonGo(go);
        let wrapper = ElemFinder.findObject(go.gameObject, 'wrapper');
        let bg = ElemFinder.findObject(wrapper, 'bg');
        if (bg) {
            this.bgGetSet = new GameObjectGetSet(bg);
        }
        this.iconImage = ElemFinder.findImage(wrapper, 'icon');
        this.iconGetSet = new GameObjectGetSet(this.iconImage.gameObject);
        this.iconTextGetSet = new TextGetSet(ElemFinder.findText(wrapper, 'text'));
        let tipMark = ElemFinder.findObject(wrapper, 'tipMark');
        if (tipMark) {
            this.tipMarkGetSet = new GameObjectGetSet(tipMark);
        }
        let goTimeBg = ElemFinder.findObject(wrapper, "textBg");
        if (goTimeBg) {
            this.timeTextBackground = new GameObjectGetSet(goTimeBg);
            this.timeTextBackground.SetActive(false);
        }
        let textDesc = ElemFinder.findText(wrapper, 'textDesc');
        if (textDesc) {
            this.textDescGetSet = new TextGetSet(textDesc);
            this.textDescGetSet.gameObject.SetActive(false);
        }
    }

    setSpecial(go: GameObjectGetSet) {
        this.setCommonGo(go);
        this.isSpecial = true;
    }

    private setCommonGo(go: GameObjectGetSet) {
        this.goTrans = go.transform;
        this.goGetSet = go;
        let tipMark = ElemFinder.findObject(go.gameObject, 'tipMark');
        if (tipMark) {
            this.tipMarkGetSet = new GameObjectGetSet(tipMark);
        }
        let size = (go.transform as UnityEngine.RectTransform).sizeDelta;
        this.width = size.x;
        this.height = size.y;
    }

    update(ctrl: BaseFuncIconCtrl, effectPrefab: UnityEngine.GameObject) {
        ctrl.item = this;
        let ctrlData = ctrl.data;

        let iconId = ctrl.IconId;
        if (this.oldIconId != iconId) {
            this.oldIconId = iconId;
            if (null != this.bgGetSet) {
                this.bgGetSet.SetActive(ctrlData.needBg);
            }
            if (null != this.iconImage) {
                let sprite = G.AltasManager.getActIcon(iconId);
                if (null != sprite) {
                    this.iconImage.sprite = sprite;
                    this.iconGetSet.SetActive(true);
                    this.iconTextGetSet.text = ctrlData.getDisplayName();
                }
            }
        }

        if (null != this.tipMarkGetSet) {
            let t = ctrlData.tipCount > 0;
            this.tipMarkGetSet.SetActive(t);
        }

        // 说明
        if (this.oldDesc != ctrlData.desc) {
            if (null != ctrlData.desc) {
                this.textDescGetSet.text = ctrlData.desc;
                this.textDescGetSet.gameObject.SetActive(true);
                this.timeTextBackground.SetActive(true);
            } else {
                this.textDescGetSet.gameObject.SetActive(false);
                this.timeTextBackground.SetActive(false);
            }
            this.oldDesc = ctrlData.desc;
        }

        // 特效
        if (FuncBtnState.Shining == ctrl.data.state || ctrl.data.systemEffect) {
            if (null == this.effect && effectPrefab != null) {
                this.effect = UnityEngine.GameObject.Instantiate(effectPrefab) as UnityEngine.GameObject;
                this.effect.transform.SetParent(this.goTrans, false);
            }
        } else {
            if (null != this.effect) {
                UnityEngine.GameObject.Destroy(this.effect);
                this.effect = null;
            }
        }
    }

    setPosX(value: number) {
        if (this.oldPosX != value) {
            this.oldPosX = value;
            Game.Tools.SetLocalPosition(this.goTrans, value, 0, 0);
        }
    }
    setPosXY(x: number, y: number) {
        if (this.oldPosY != x || this.oldPosY != y) {
            this.oldPosY = x;
            this.oldPosY = y;
            Game.Tools.SetLocalPosition(this.goTrans, x, y, 0);
        }
    }

    get IsSpecial(): boolean {
        return this.isSpecial;
    }

    get Width(): number {
        return this.width;
    }

    get Height(): number {
        return this.height;
    }
}

export abstract class BtnGroupCtrl {
    protected gameObject: UnityEngine.GameObject;
    protected effectPrefab: UnityEngine.GameObject;

    /**折叠按钮*/
    switcher: UnityEngine.GameObject;
    protected switchTipGetSet: GameObjectGetSet;
    public openIcon: GameObjectGetSet;
    public closeIcon: GameObjectGetSet;

    protected itemTemp: UnityEngine.GameObject;
    protected id2item: { [id: number]: BtnGroupItem } = {};

    /**活动id - 控制器映射表*/
    protected id2ctrlMap: { [id: number]: BaseFuncIconCtrl } = {};
    /**是否展开*/
    protected isOpened: boolean = true;
    protected autoClosed: boolean = false;

    /**是否需要更新*/
    protected isDirty: boolean = false;

    get IsOpened(): boolean {
        return this.isOpened;
    }

    protected addCtrls(...ctrls: BaseFuncIconCtrl[]) {
        for (let ctrl of ctrls) {
            this.id2ctrlMap[ctrl.data.id] = ctrl;
        }
    }

    protected initSwitcher(uiElems: UiElements) {
        this.switcher = uiElems.getElement('switcher');
        let t = ElemFinder.findObject(this.switcher, 'tipMark');
        if (t) {
            this.switchTipGetSet = new GameObjectGetSet(t);
        }
        this.openIcon = new GameObjectGetSet(uiElems.getElement('openIcon'));
        this.closeIcon = new GameObjectGetSet(uiElems.getElement('closeIcon'));
        this.openIcon.SetActive(false);
        this.closeIcon.SetActive(true);
        Game.UIClickListener.Get(this.switcher).onClick = delegate(this, this._ononClickBtnSwitcher);
    }

    changeState(isOpen: boolean, needAnim: boolean) {
        this.isOpened = isOpen;
        this.openIcon.SetActive(!isOpen);
        this.closeIcon.SetActive(isOpen);
        this.update(true);
    }

    private _ononClickBtnSwitcher() {
        G.AudioMgr.playBtnClickSound();
        this.onClickBtnSwitcher();
    }

    onClickBtnSwitcher() {
        if (this.isOpened == true) {
            this.changeState(false, true);
            this.autoClosed = false;
        }
        else {
            this.changeState(true, true);
        }
    }
    private tipmarkarraybtn: UnityEngine.GameObject[] = [];
    private tipmarkarraytipmark: GameObjectGetSet[] = [];
    protected setTipMark(btn: UnityEngine.GameObject, isShow: boolean) {
        let index = this.tipmarkarraybtn.indexOf(btn);
        let tipMark: GameObjectGetSet = null;
        if (index > -1) {
            tipMark = this.tipmarkarraytipmark[index];
        }
        else {
            tipMark = new GameObjectGetSet(ElemFinder.findObject(btn, 'wrapper/tipMark'));
            if (tipMark) {
                this.tipmarkarraybtn.push(btn);
                this.tipmarkarraytipmark.push(tipMark);
            }
        }
        if (null != tipMark) {
            tipMark.SetActive(isShow);
        }
    }

    update(rightNow: boolean) {
        this.isDirty = true;
        if (rightNow) {
            this.checkUpdate();
        }
    }

    protected sortListCtrls(a: BaseFuncIconCtrl, b: BaseFuncIconCtrl): number {
        let aIconCfg: GameConfig.ActIconOrderM = G.DataMgr.funcLimitData.getActIconCfg(a.data.id);
        let bIconCfg: GameConfig.ActIconOrderM = G.DataMgr.funcLimitData.getActIconCfg(b.data.id);
        if (aIconCfg && bIconCfg) {
            if (aIconCfg.m_iArea == bIconCfg.m_iArea) {
                return aIconCfg.m_iOrder - bIconCfg.m_iOrder;
            }
            else {
                return aIconCfg.m_iArea - bIconCfg.m_iArea;
            }
        }
        return 0;
    }

    protected getBtnWrapper(itemGo: UnityEngine.GameObject): UnityEngine.GameObject {
        return ElemFinder.findObject(itemGo, 'wrapper');
    }

    protected getItemByIdInternal(id: number, parent: UnityEngine.Transform): BtnGroupItem {
        let item: BtnGroupItem = this.id2item[id];
        if (null == item) {
            this.id2item[id] = item = new BtnGroupItem();
            item.setComponents(new GameObjectGetSet(UnityEngine.GameObject.Instantiate(this.itemTemp, parent, true) as UnityEngine.GameObject));
        } else {
            item.goTrans.SetParent(parent);
        }
        return item;
    }

    protected showThisItems(showIds: number[]) {
        for (let idKey in this.id2ctrlMap) {
            let id = parseInt(idKey);
            let item = this.id2item[id];
            if (null != item) {
                item.goGetSet.SetActive(showIds.indexOf(id) >= 0);
            }
        }
    }

    protected addSpecialItem(id: number, itemGo: GameObjectGetSet) {
        let item = new BtnGroupItem();
        itemGo.SetActive(false);
        item.setSpecial(itemGo);
        this.id2item[id] = item;
    }

    abstract checkUpdate();
    abstract getFuncBtn(id: number): UnityEngine.GameObject;
}