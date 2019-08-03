import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { WeiXinGiftView } from 'System/activity/view/WeiXinGiftView'
import { Macros } from 'System/protocol/Macros'

/**
* 微信礼包
* @author 
*/
export class WeiXinGiftCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_WXLB );
        this.data.setDisplayName('微信礼包');
    }

    handleClick() {
        G.Uimgr.createForm<WeiXinGiftView>(WeiXinGiftView).open();
    }
}