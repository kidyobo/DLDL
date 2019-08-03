import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';

/**
* 祈福
*/
export class KuaiSuShengJiCtrl extends BaseFuncIconCtrl {

    private readonly NPC_ID: number = 100203;
    //private readonly SCENE_ID: number = 4;

    constructor() {
        super(KeyWord.ACT_FUNCTION_QIFU);
        this.data.setDisplayName('祈福');
    }

    handleClick() {
        //改成寻路到NPC处...然后打开
        G.ActionHandler.executeFunction(KeyWord.ACT_FUNCTION_QIFU);
    }

    onStatusChange(): void {
        this.data.tipCount = TipMarkUtil.qiFu() ? 1 : 0;
    }

}