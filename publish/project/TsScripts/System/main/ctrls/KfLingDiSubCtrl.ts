import { ActHomeView } from "System/activity/actHome/ActHomeView";
import { KeyWord } from "System/constants/KeyWord";
import { Global as G } from "System/global";
import { BaseFuncIconCtrl } from "System/main/BaseFuncIconCtrl";

/**
* 跨服3v3时段活动
*/
export class KfLingDiSubCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_ZZHC_WC);
        this.data.setDisplayName('领地战');
    }

    handleClick() {
        G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.ACT_FUNCTION_ZZHC);
    }
}
