/**
 * 通知VO
 * date:2013-10-25
 * author:lyl
 */
export class InformResponse {
    type: number = 0;
    targetId: number = 0;
    icon: number = 0;
    num: number = 0;
    tipMsg: string;
    data: any;
    clickMsg: string;
    private _repeat: boolean;
    private _isSameNotRepeatMove: boolean = false;

    /**是否重复飘入 */
    get repeat(): boolean {
        return this._repeat;
    }

    set repeat(value: boolean) {
        this._repeat = value;
        this._isSameNotRepeatMove = value;
    }

    clear(): void {
        this.icon = 0;
        this.type = -1;
        this.targetId = 0;
        this.data = null;
        this.num = 0;
        this.tipMsg = '';
        this.clickMsg = '';
        this._repeat = false;
        this._isSameNotRepeatMove = false;
    }
}
