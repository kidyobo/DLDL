import { VersionUtil } from "System/utils/VersionUtil";
import { GameIdDef } from "System/channel/GameIdDef";
import { FuncBtnState } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl';
import { JavaCaller } from "System/utils/JavaCaller";
import { Global as G } from "System/global";

export class VPlusPowerCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_VPLUSPOWER);
        this.data.setDisplayName('V+特权');
    }

    onStatusChange() {
        this.data.state = FuncBtnState.Invisible;
    }

    handleClick() {
        JavaCaller.callRetInt('VPlusPower');
    }
}