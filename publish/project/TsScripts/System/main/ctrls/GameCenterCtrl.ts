import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'

export class GameCenterCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_GAMECENTER);
        this.data.setDisplayName("游戏中心");
    }

    onStatusChange() {
        if (G.IsAndroidPlatForm || G.IsIOSPlatForm) {
            if (G.SdkCaller.hasGameCenter()) {
                this.data.state = FuncBtnState.Normal;
            } else {
                this.data.state = FuncBtnState.Invisible;
            }
        } else {
            this.data.state = FuncBtnState.Invisible;
        }
    }

    handleClick() {
        if (G.SdkCaller.hasGameCenter()) {
            G.SdkCaller.showGameCenter();
        }
    }
}
