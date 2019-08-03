import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { SystemSettingView } from 'System/setting/SystemSettingView'

export class SettingCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_SETTING);
        this.data.setDisplayName('设置');
    }

    handleClick() {
        G.Uimgr.createForm<SystemSettingView>(SystemSettingView).open();
    }
}