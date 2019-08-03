import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { UIPathData } from "System/data/UIPathData";


/**获得奖励 提示 */
export class ReceiveAwardTips extends CommonForm {
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.StarsTreasuryView;
        //钻石奖池
    }
}