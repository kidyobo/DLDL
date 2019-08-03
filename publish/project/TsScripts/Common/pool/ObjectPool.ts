export interface IPool {
    //当该对象不再被缓存时，将会被调用
    onDestroy(): void;
}
export class ObjectPool {
    private _capacity: number = 0;
    private _freepos: number = -1;
    private _pools: Array<IPool> = [];
    private _tclass: any = null;
    constructor(capacity: number = 1024) {
        this._capacity = capacity;
    }
    pop(): IPool {
        let obj: IPool = null;
        if (this._freepos >= 0) {
            obj = this._pools[this._freepos];
            this._pools[this._freepos--] = null;
        }
        return obj;
    }
    push(obj: IPool) {
        if (obj == null)
            return;
        if (this._freepos >= this._capacity - 1) {
            obj.onDestroy();
            return;
        }
        this._pools[++this._freepos] = obj;
    }
}