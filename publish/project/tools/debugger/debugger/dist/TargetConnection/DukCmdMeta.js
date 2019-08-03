"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DukCmdMeta = (function () {
    function DukCmdMeta() {
    }
    DukCmdMeta.init = function () {
        for (var i = 0, n = this.debugCommandNames.length; i < n; i++) {
            var name_1 = this.debugCommandNames[i];
            this.debugCommandNumbers[name_1] = i;
        }
    };
    DukCmdMeta.commandIdToName = function (id) {
        return this.debugCommandNames[id] || String(id);
    };
    return DukCmdMeta;
}());
DukCmdMeta.debugCommandNames = [
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
];
DukCmdMeta.debugCommandNumbers = {};
exports.DukCmdMeta = DukCmdMeta;
//# sourceMappingURL=DukCmdMeta.js.map