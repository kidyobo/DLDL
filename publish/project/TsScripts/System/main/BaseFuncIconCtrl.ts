import { Global as G } from 'System/global'
import { ScfItemData } from 'System/main/ctrls/ScfItemData'
import { FuncBtnState } from 'System/constants/GameEnum'
import { BtnGroupItem } from 'System/main/BtnGroupCtrl'

export abstract class BaseFuncIconCtrl {
    data: ScfItemData;
    item: BtnGroupItem;

    subCtrls: BaseFuncIconCtrl[];

    constructor(id: number) {
        this.data = new ScfItemData(id);
        this.data.tipCount = 0;
        this.data.state = FuncBtnState.Normal;
    }

     /**
     * 活动状态变化时，更新按钮状态。
     *
     */
    onStatusChange(): void {

    }

    get Useable(): boolean {
        return this.data.state != FuncBtnState.Invisible;
    }

    get IconId(): number {
        return this.data.id;
    }

    abstract handleClick(): void;
}
