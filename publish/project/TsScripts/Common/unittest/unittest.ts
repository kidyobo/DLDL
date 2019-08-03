
class ErrorHandler {
    private static ss_for_unity: boolean = true;
    private static assert_tag: string = '<<<unit_assert>>>';
    public static caseIndice: number = 0;
    public static getAssertTag(): string {
        return ErrorHandler.assert_tag;
    }
    public static handle(result: Result, err: string, stack: string) {
        let err_tag_pos = err.indexOf(ErrorHandler.assert_tag);
        /*
        stack = uts.handleStack(stack)
        if (err_tag_pos < 0) {
            result.log(stack);
            return;
        }
        let stacks = stack.split('\n');
        for (let frame of stacks) {
            frame = frame.trim();
            if (frame.match(/\/unittest\.ts:\d+/)) continue;
            if (frame.match(/\.ts:\d+/)) {
                result.log("(at " + frame.replace(/^anon /, '') + "): " + err.slice(err_tag_pos + ErrorHandler.assert_tag.length));
                return;
            }
        }
        */
        result.log(stack);
    }
}

export function areEqual(a: any, b: any, msg?: string) {
    if (a == b) return;
    if (ErrorHandler.caseIndice == 0) {
        try {
            if (!msg) msg = 'assertion failed!';
            throw new Error(msg);
        }
        catch (e) {
            uts.logError(e.stack || e);
        }
    }
    else {
        if (!msg) msg = 'assertion failed!';
        throw new Error(ErrorHandler.getAssertTag() + msg);
    }
}

export class Result {
    private _runCount: number = 0;
    private _failedCount: number = 0;
    private _log: string = '';
    public testStarted() {
        this._runCount++;
    }

    public testFailed() {
        this._failedCount++;
    }

    public summary(): string {
        let s = this._runCount + ' run, ';
        if (this._failedCount > 0)
            s += '<color=red>' + this._failedCount + ' failed</color>';
        else
            s += this._failedCount + ' failed';
        return s;
    }

    public getLog(): string {
        return this._log;
    }

    public log(s: string) {
        this._log += s;
        this._log += '\n';
    }
}

export class Case {
    public setUp() {
    }

    public run(result: Result) {
        result = result || new Result();
        for (let fieldName in this) {
            if (typeof fieldName != 'string') continue;
            let sname = <string>fieldName;
            if ((sname.indexOf('test_') == 0) && typeof this[sname] == 'function') {
                this.innerRun(result, sname);
            }
        }
    }

    private innerRun(result: Result, name: string) {
        result = result || new Result();
        this.setUpRun(result, name);
        this.testRun(result, name);
        this.tearDownRun(result, name);
    }

    private setUpRun(result: Result, name: string) {
        result.testStarted();
        try {
            ErrorHandler.caseIndice++;
            this.setUp();
        }
        catch (e) {
            ErrorHandler.handle(result, e.message, e.stack);
            result.testFailed();
            result.log('  [case]: ' + name);
        }
    }

    private testRun(result: Result, name: string) {
        try {
            this[name](this);
        }
        catch (e) {
            ErrorHandler.handle(result, e.message, e.stack);
            result.testFailed();
            result.log('  [case]: ' + name);
        }
    }

    private tearDownRun(result: Result, name: string) {
        try {
            ErrorHandler.caseIndice--;
            this.tearDown();
        }
        catch (e) {
            ErrorHandler.handle(result, e.message, e.stack);
            result.testFailed();
            result.log('  [case]: ' + name);
        }
    }

    public tearDown() {
    }
}

export class Suite {
    private _cases: Array<Case> = new Array<Case>();

    public addCase(caseObject: Case) {
        this._cases.push(caseObject);
    }

    public run(result?: Result, needcases?: Array<new (...args) => Case>): Result {
        result = result || new Result();
        for (let caseObject of this._cases) {
            if (this.isNeedRun(caseObject, needcases)) {
                caseObject.run(result);
            }
        }
        return result;
    }

    private isNeedRun(caseObject: Case, needcases?: Array<new (...args) => Case>) {
        if (needcases == null || needcases.length == 0) return true;

        for (let caseClass of needcases) {
            if (caseObject instanceof caseClass) {
                return true;
            }
        }
        return false;
    }
}
