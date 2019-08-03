import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ResUtil } from 'System/utils/ResUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { BossView } from 'System/pinstance/boss/BossView'
import { KeyWord } from 'System/constants/KeyWord'

export class ZhenLongQiJuCampView extends CommonForm {
    private AutoCloseKey: string = '1';

    private black: UnityEngine.GameObject;
    private white: UnityEngine.GameObject;

    /**1 - 黑子，2 - 白子*/
    private openCamp = 0;

    constructor() {
        super(0);
    }
    layer(): UILayer {
        return UILayer.OnlyTip;
    }
    protected resPath(): string {
        return UIPathData.ZhenLongQiJuCampView;
    }
    protected initElements(): void {
        this.black = this.elems.getElement('black');
        this.white = this.elems.getElement('white');
    }
    protected initListeners(): void {
        this.addClickListener(this.elems.getElement('mask'), this.onClickBtnClose);
    }

    protected onOpen() {
        if (1 == this.openCamp) {
            // 黑
            this.black.SetActive(true);
            this.white.SetActive(false);
        } else {
            // 白
            this.black.SetActive(false);
            this.white.SetActive(true);
        }

        this.addTimer(this.AutoCloseKey, 3000, 1, this.onAutoCloseTimer);
    }

    open(camp: number) {
        this.openCamp = camp;
        super.open();
    }

    private onAutoCloseTimer(timer: Game.Timer) {
        this.close();
    }

    private onClickBtnClose() {
        this.close();
    }
}