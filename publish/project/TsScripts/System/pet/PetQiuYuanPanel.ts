import { Global as G } from 'System/global'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { PetView } from 'System/pet/PetView'

export class PetQiuYuanPanel extends NestedSubForm {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_PET_QIUYUAN);
    }

    protected resPath(): string {
        return UIPathData.PetQiuyuanView;
    }

    protected initElements() {
    }

    protected initListeners() {
    }

    protected onOpen() {

    }

    protected onClose() {

    }

    open(petId: number = 0) {
        super.open(petId);
    }

    updateView() {

    }
}