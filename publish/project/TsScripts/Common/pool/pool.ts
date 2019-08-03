export class ObjectPool<T> {
    private _capacity: number = 0;
    private _freepos: number = -1;
    private _pools: Array<T> = [];
    private _tclass: any = null;
    constructor(tclass, capacity:number=1024) {
        this._tclass = tclass;
        this._capacity = capacity;
    }
    new(...args): T {
        let obj = null;
        if (this._freepos >= 0) {
            obj = this._pools[this._freepos];
            this._pools[this._freepos--] = null;
            if (obj.set != null)
                obj.set(...args);
        }
        else {
            obj = new this._tclass(...args);
        }
        return obj;
    }
    delete(obj1: T, obj2?: T, obj3?: T, obj4?: T) {
        this.deleteOne(obj1);
        this.deleteOne(obj2);
        this.deleteOne(obj3);
        this.deleteOne(obj4);
    }
    private deleteOne(obj: T) {
        if (obj == null)
            return;

        if (this._freepos >= this._capacity - 1) {
            let tobj: any = obj;
            if (tobj.release != null) {
                tobj.release();
            }
            return;
        }
        if (this._freepos == this._pools.length - 1) {
            let tobj: any = obj;
            if (tobj.reset != null) {
                tobj.reset();
            }
            this._pools.push(obj);
            this._freepos++;
        }
        else {
            this._pools[++this._freepos] = obj;
        }
    }

    /**
     * 格式化指定数组的长度，或者获取指定长度的数组。推荐使用本函数格式化。
     * @param length 数组格式化后的长度。
     * @param input 原数组，若长度太长需要截断，过长部分将会返回对象池。
     * @return 
     * 
     */
     formatArray(length: number, input: Array<T> = null): Array<T> {
        let i: number = 0;
        if (null == input) {
            input = new Array<T>();
        }
        else {
            for (i = input.length - 1; i >= length; i--) {
                this.deleteOne(input[i]);
            }
        }
        input.length = length;
        let itemData = null;
        for (i = 0; i < length; i++) {
            itemData = input[i];
            if (null == itemData) {
                input[i] = itemData = this.new();
            }
            else {
                if (itemData.reset != null) {
                    itemData.reset();
                }
            }
        }

        return input;
    }

    freeArray(input: Array<T>): void {
        if (null == input) {
            return;
        }
        for (let i: number = input.length - 1; i >= 0; i--) {
            this.deleteOne(input[i]);
        }
        input.length = 0;
    }
}

export class PoolArray<T> {
    private _arr: Array<T> = [];
    private _len: number = 0;
    get length(): number {
        return this._len;
    }
    set length(len) {
        this._len = len;
        if (this._len < 0) this._len = 0;
        if (this._len > this._arr.length) this._arr.length = this._len;
    }
    at(i: number): T {
        return this._arr[i];
    }
    set(i:number, item:T) {
        this._arr[i] = item;
    }
    push(item: T): number {
        this._arr[this._len++] = item;
        return this._len;
    }
    pop(): T {
        if (this._len == 0) return null;
        return this._arr[--this._len];
    }
    indexOf(item: T): number {
        for (let i = 0; i < this._len; i++) {
            if (this._arr[i] == item) return i;
        }
        return -1;
    }
}
