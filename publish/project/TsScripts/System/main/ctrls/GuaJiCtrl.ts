import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FengMoTaView } from 'System/pinstance/fmt/FengMoTaView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

 /**
 * 挂机打宝
 */
export class GuaJiCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_FMT);
        this.data.setDisplayName('挂机打宝');
    }

    onStatusChange() {
        // 副本内不显示黑洞塔按钮
        //let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
        //if ((curPinstanceID == 0 || Macros.PINSTANCE_ID_FMT == curPinstanceID) && G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_FMT)) {
        //    this.btnFmt.SetActive(true);
        //} else {
        //    this.btnFmt.SetActive(false);
        //}
    }
    
    handleClick() {
        G.Uimgr.createForm<FengMoTaView>(FengMoTaView).open();
    }
}
