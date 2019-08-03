import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { PetExpeditionPanel } from 'System/pet/PetExpeditionPanel'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { DataFormatter } from 'System/utils/DataFormatter'
import { PetData } from 'System/data/pet/PetData'
import { ExpeditionPetOne, PetExpeditionData } from 'System/data/pet/PetExpeditionData'

export class PetExpeditionItem extends ListItemCtrl {
    private pet: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private head: UnityEngine.UI.RawImage;
    private hpBar: UnityEngine.GameObject;
    private hp: UnityEngine.GameObject;
    private stageBg: UnityEngine.GameObject;
    private textStage: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private dead: UnityEngine.GameObject;
    private none: UnityEngine.GameObject;
    private in: UnityEngine.GameObject;
    private type: UnityEngine.GameObject;
    private textType: UnityEngine.UI.Text;

    protected info: ExpeditionPetOne;

    gameObject: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.pet = ElemFinder.findObject(go, 'pet');
        this.mask = ElemFinder.findObject(this.pet, 'mask');
        this.head = ElemFinder.findRawImage(this.mask, 'head');
        this.hpBar = ElemFinder.findObject(this.pet, 'hpBar');
        this.hp = ElemFinder.findObject(this.hpBar, 'hp');
        this.stageBg = ElemFinder.findObject(this.pet, 'bg');
        if (this.stageBg) {
            this.textStage = ElemFinder.findText(this.stageBg, 'textStage');
        }
        this.dead = ElemFinder.findObject(go, 'dead');
        this.none = ElemFinder.findObject(go, 'none');
        this.in = ElemFinder.findObject(go, 'in');

        if (ElemFinder.findObject(this.pet, 'textName')) {
            this.textName = ElemFinder.findText(this.pet, 'textName');
        }

        this.type = ElemFinder.findObject(this.pet, 'type');
        if (null != this.type) {
            this.textType = ElemFinder.findText(this.type, 'textType');
        }
    }

    update(info: ExpeditionPetOne, isFighting: boolean) {
        this.info = info;

        let isNotNone = null != info && info.id > 0;
        if (isNotNone) {
            this.mask.SetActive(true);
            G.ResourceMgr.loadImage(this.head, uts.format('images/head/{0}.png', info.id));
            if (this.textStage) {
                let stage = PetData.getPetStage(info.stage, info.id);
                this.textStage.text = uts.format('{0}阶', DataFormatter.toHanNumStr(stage));
            }
            let petCfg = PetData.getPetConfigByPetID(info.id);
            if (null != this.type) {
                this.textType.text = PetData.LabelDesc[petCfg.m_uiLabelID - 1].substr(0, 1);
                this.type.SetActive(true);
            }
            if (null != this.textName) {
                let n = petCfg.m_szBeautyName;
                if (info.feiSheng > 0) {
                    n += uts.format("({0}转)", info.feiSheng);
                }
                this.textName.text = n;
                this.textName.gameObject.SetActive(true);
            }
            this.updateHp();
            this.hpBar.SetActive(true);
        } else {
            this.mask.SetActive(false);
            if (null != this.dead) {
                this.dead.SetActive(false);
            }
            if (null != this.type) {
                this.type.SetActive(false);
            }
            if (null != this.textName) {
                this.textName.gameObject.SetActive(false);
            }
            this.hpBar.SetActive(false);
        }

        if (this.stageBg) {
            this.stageBg.SetActive(isNotNone);
        }

        if (null != this.none) {
            this.none.SetActive(!isNotNone);
        }

        if (null != this.in) {
            this.in.SetActive(isFighting);
        }
    }

    updateHp() {
        let hpScale = this.info.hpPct / PetExpeditionData.FullHpPct;
        Game.Tools.SetGameObjectLocalScale(this.hp, hpScale, 1, 1);
        if (null != this.dead) {
            this.dead.SetActive(0 == hpScale);
        }
        UIUtils.setGrey(this.pet, 0 == hpScale);
    }

    get Info(): ExpeditionPetOne {
        return this.info;
    }
}

export abstract class PetExpeditionBaseLogic {
    protected panel: PetExpeditionPanel;
    protected id = 0;

    constructor(id: number, panel: PetExpeditionPanel) {
        this.id = id;
        this.panel = panel;
    }

    abstract initElements(elems: UiElements);

    abstract initListeners();

    open() {
        this.onOpen();
    }

    close() {
        this.onClose();
    }

    get Id(): number {
        return this.id;
    }

    abstract onPanelClosed();

    protected onOpen() {
        this.onExpeditionChange();
        this.onCurrencyChange(0);
    }

    protected abstract onClose();

    abstract onTickTimer(timer: Game.Timer);

    abstract onExpeditionChange();
    abstract onCurrencyChange(id: number);
}