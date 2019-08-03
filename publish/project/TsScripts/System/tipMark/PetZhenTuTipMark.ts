import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { PetView } from 'System/pet/PetView'

export class PetZhenTuTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_PET_ZHENTU];
        this.sensitiveToPetZhenTu = true;
    }

    protected doCheck(): boolean {
        return G.DataMgr.petData.petZhenTuCanShowTipMark();
    }

    get TipName(): string {
        return '光印提升';
    }

    action() {
        //伙伴光印
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_PET_ZHENTU)) {
            G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_ZHENTU);
        } else {
            G.TipMgr.addMainFloatTip('本功能尚未开启！');
        }
    }
}