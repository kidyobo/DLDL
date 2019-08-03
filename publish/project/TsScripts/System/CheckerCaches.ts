export class CheckerCache {
    private dirty = true;
    private value = false;
    cache(value: boolean) {
        this.dirty = false;
        this.value = value;
    }
    clear() {
        this.dirty = true;
    }
    get Value(): boolean { return this.value; }
    get Has(): boolean { return !this.dirty; }
}

export class CheckerCaches {
    private caches: { [type: number]: CheckerCache } = {};
    get(type: number): CheckerCache {
        let cache = this.caches[type];
        if (!cache) {
            cache = new CheckerCache();
            this.caches[type] = cache;
        }
        return cache;
    }
    clear() {
        for (let key in this.caches) {
            this.caches[key].clear();
        }
    }
}

