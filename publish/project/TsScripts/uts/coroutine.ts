enum CoroutineYieldType {
    STEP = 0,
    WAITSECOND = 1,
    WWW = 2,
}

export class coroutine {
    /*
    static start(foo, args): __coroutine {
        let t = new Duktape.Thread(foo);
        let co = new __coroutine(t);
        Duktape.Thread.resume(t, co, args);
        return co;
    }
    static stop(co: __coroutine) {
    }

    private t: Duktape.Thread = null;
    private constructor(t: Duktape.Thread) {
        this.t = t;
    }
    step(frame: number = 0) {
        __co_yield_reg(this, CoroutineYieldType.STEP, frame);
        Duktape.Thread.yield(0);
    }
    wait(second: number) {
        __co_yield_reg(this, CoroutineYieldType.WAITSECOND, second);
        Duktape.Thread.yield(0);
    }
    www(co, www) {
        __co_yield_reg(this, CoroutineYieldType.WWW, www);
        Duktape.Thread.yield(0);
    }
    resume() {
        Duktape.Thread.resume(this.t);
    }
    */
}

