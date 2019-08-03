"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DukCmdMeta_1 = require("./DukCmdMeta");
/**
 * 简易的DukJson对象组合为可读的Json对象
 */
var DukMsgDecoder = (function () {
    function DukMsgDecoder() {
    }
    DukMsgDecoder.prototype.decode = function (msg) {
        var rt = {};
        if (typeof msg[0] !== 'object' || msg[0] === null) {
            rt.notify = '_Error';
            rt.args = ['unexpected initial dvalue: ' + msg[0]];
        }
        else if (msg[0].type === 'eom') {
            rt.notify = '_Error';
            rt.args = ['unexpected initial dvalue: ' + msg[0]];
        }
        else if (msg[0].type === 'req') {
            if (typeof msg[1] !== 'number') {
                rt.notify = '_Error';
                rt.args = ['unexpected request command number: ' + msg[1]];
            }
            else {
                rt.request = DukCmdMeta_1.DukCmdMeta.commandIdToName(msg[1]);
                rt.command = msg[1];
                rt.args = msg.slice(2, msg.length - 1);
            }
        }
        else if (msg[0].type === 'rep') {
            rt.reply = true;
            rt.args = msg.slice(1, msg.length - 1);
        }
        else if (msg[0].type === 'err') {
            rt.error = true;
            rt.args = msg.slice(1, msg.length - 1);
        }
        else if (msg[0].type === 'nfy') {
            if (typeof msg[1] !== 'number') {
                rt.notify = '_Error';
                rt.args = ['unexpected notify command number: ' + msg[1]];
            }
            else {
                rt.notify = DukCmdMeta_1.DukCmdMeta.commandIdToName(msg[1]);
                rt.command = msg[1];
                rt.args = msg.slice(2, msg.length - 1);
            }
        }
        else {
            rt.notify = '_Error';
            rt.args = ['unexpected initial dvalue: ' + msg[0]];
        }
        return rt;
    };
    return DukMsgDecoder;
}());
exports.DukMsgDecoder = DukMsgDecoder;
//# sourceMappingURL=DukMsgDecoder.js.map