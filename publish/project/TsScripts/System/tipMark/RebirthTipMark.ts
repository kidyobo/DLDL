import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from './TipMarkUtil';

/**魂力进阶 
    1.魂力任务可做 魂力进阶
    2.获得新魂环 魂环幻化
    3.获得更强的魂骨 魂骨提升
 */
export class RebirthTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_HUNGU_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_REBIRTH];
        this.activeByFunc = KeyWord.BAR_FUNCTION_REBIRTH;
        this.sensitiveToRebirth = true;
    }

    protected doCheck(): boolean {
        return TipMarkUtil.isHunliShowTipMark();
        //return false /*G.DataMgr.rebirthData.canRebirth()*/;
    }

    get TipName(): string {
        return '魂力进阶';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_ZHUANSHENG);
    }
}