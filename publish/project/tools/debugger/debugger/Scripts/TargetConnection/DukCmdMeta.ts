export class DukCmdMeta {
    public static debugCommandNames = [
        'Reserved_0',
        'Status',
        'Print',
        'Alert',
        'Log',
        'Throw',
        'Detaching',
        'AppNotify',
        'Reserved_8',
        'Reserved_9',
        'Reserved_10',
        'Reserved_11',
        'Reserved_12',
        'Reserved_13',
        'Reserved_14',
        'Reserved_15',
        'BasicInfo',
        'TriggerStatus',
        'Pause',
        'Resume',
        'StepInto',
        'StepOver',
        'StepOut',
        'ListBreak',
        'AddBreak',
        'DelBreak',
        'GetVar',
        'PutVar',
        'GetCallStack',
        'GetLocals',
        'Eval',
        'Detach',
        'DumpHeap',
        'GetBytecode',
        'AppRequest',
        'GetHeapObjInfo',
        'GetObjPropDesc',
        'GetObjPropDescRange'
    ]
    public static debugCommandNumbers = {};
    static init() {
        for (let i = 0, n = this.debugCommandNames.length; i < n; i++) {
            let name = this.debugCommandNames[i];
            this.debugCommandNumbers[name] = i;
        }
    }
    static commandIdToName(id: number): string {
        return this.debugCommandNames[id] || String(id);
    }
}