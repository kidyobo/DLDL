import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { DownloadView } from 'System/main/view/DownloadView'
import { Macros } from 'System/protocol/Macros'
/**
* 下载
*/
export class DownloadCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNC_DOWNLOAD);
        this.data.setDisplayName('下载');
    }

    onStatusChange() {
        if (G.DataMgr.heroData.level <= 85 || (G.DataMgr.systemData.onlyOneTimeAllLifeBits & Macros.FST_APP_DOWN_REWARD) || G.IsIosTiShenEnv) {
            this.data.state = FuncBtnState.Invisible;
        } else {
            this.data.state = FuncBtnState.Normal;
        }
        if (G.ViewCacher.mainView.autoDownloadRequest)
        this.data.tipCount = G.ViewCacher.mainView.autoDownloadRequest.isDone ? 1 : 0;
    }

    handleClick() {
        G.Uimgr.createForm<DownloadView>(DownloadView).open();
    }
}
