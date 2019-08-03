import { Global as G } from 'System/global'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { UIPathData } from 'System/data/UIPathData'
import { PetView } from 'System/pet/PetView'
import { KeyWord } from 'System/constants/KeyWord'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { PetData } from 'System/data/pet/PetData'
import { UIUtils } from 'System/utils/UIUtils'
import { Macros } from 'System/protocol/Macros'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { Color } from "System/utils/ColorUtil"
import { ThingData } from "System/data/thing/ThingData"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { DataFormatter } from "System/utils/DataFormatter"
import { PetExpeditionBaseLogic } from 'System/pet/expedition/PetExpeditionBaseLogic'
import { PetExpeditionFaceLogic } from 'System/pet/expedition/PetExpeditionFaceLogic'
import { PetExpeditionInfoLogic } from 'System/pet/expedition/PetExpeditionInfoLogic'
import { PetExpeditionChooseLogic } from 'System/pet/expedition/PetExpeditionChooseLogic'

export class PetExpeditionPanel extends NestedSubForm {
    static LastLogicId = 0;
    private readonly TickTimerKey = 'tick';

    bg: UnityEngine.GameObject;
    map: UnityEngine.GameObject;
    info: UnityEngine.GameObject;
    choose: UnityEngine.GameObject;
    bottom: UnityEngine.GameObject;
    mapBottom: UnityEngine.GameObject;
    infoBottom: UnityEngine.GameObject;

    private faceLogic: PetExpeditionFaceLogic;
    private infoLogic: PetExpeditionInfoLogic;
    private chooseLogic: PetExpeditionChooseLogic;

    private crtLogic: PetExpeditionBaseLogic;
    private id2logic: { [id: number]: PetExpeditionBaseLogic } = {};

    constructor() {
        super(KeyWord.OTHER_FUNCTION_PET_EXPEDITION);

        this.faceLogic = new PetExpeditionFaceLogic(1, this);
        this.infoLogic = new PetExpeditionInfoLogic(2, this);
        this.chooseLogic = new PetExpeditionChooseLogic(3, this);

        this.id2logic[this.faceLogic.Id] = this.faceLogic;
        this.id2logic[this.infoLogic.Id] = this.infoLogic;
        this.id2logic[this.chooseLogic.Id] = this.chooseLogic;
    }

    protected resPath(): string {
        return UIPathData.PetExpeditionView;
    }

    protected initElements() {
        this.bg = this.elems.getElement('bg');
        this.map = this.elems.getElement('map');
        this.info = this.elems.getElement('info');
        this.choose = this.elems.getElement('choose');

        this.bottom = this.elems.getElement('bottom');
        this.mapBottom = this.elems.getElement('mapBottom');
        this.infoBottom = this.elems.getElement('infoBottom');

        this.faceLogic.initElements(this.elems.getUiElements('map'));
        this.infoLogic.initElements(this.elems.getUiElements('info'));
        this.chooseLogic.initElements(this.elems.getUiElements('choose'));
    }

    protected initListeners() {
        this.faceLogic.initListeners();
        this.infoLogic.initListeners();
        this.chooseLogic.initListeners();
    }

    protected onOpen() {
        if (null == this.crtLogic) {
            let autoId = PetExpeditionPanel.LastLogicId;
            if (autoId <= 0) {
                autoId = 1;
            }
            this.setCrtLogic(this.id2logic[autoId]);
        }
    }

    protected onClose() {
        this.faceLogic.onPanelClosed();
        this.infoLogic.onPanelClosed();
        this.chooseLogic.onPanelClosed();
    }

    setCrtLogic(logic: PetExpeditionBaseLogic) {
        if (null != this.crtLogic) {
            this.crtLogic.close();
        }
        this.crtLogic = logic;
        PetExpeditionPanel.LastLogicId = logic.Id;
        logic.open();

        if (this.faceLogic == logic) {
            this.addTimer(this.TickTimerKey, 1000, 0, this.onTickTimer);
        } else {
            this.removeTimer(this.TickTimerKey);
        }
    }

    gotoFace() {
        this.setCrtLogic(this.faceLogic);
    }

    gotoInfo() {
        this.setCrtLogic(this.infoLogic);
    }

    gotoChoose() {
        this.setCrtLogic(this.chooseLogic);
    }

    onExpeditionChange() {
        if (null != this.crtLogic) {
            this.crtLogic.onExpeditionChange();
        }
    }

    onCurrencyChange(id: number) {
        if (null != this.crtLogic) {
            this.crtLogic.onCurrencyChange(id);
        }
    }

    private onTickTimer(timer: Game.Timer) {
        if (null != this.crtLogic) {
            this.crtLogic.onTickTimer(timer);
        }
    }
}