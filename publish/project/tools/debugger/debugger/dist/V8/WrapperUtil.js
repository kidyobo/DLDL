"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProcessStatus_1 = require("../ProcessStatus");
var Util_1 = require("../Util");
var ClassType;
(function (ClassType) {
    ClassType[ClassType["UNUSED"] = 0] = "UNUSED";
    ClassType[ClassType["ARGUMENTS"] = 1] = "ARGUMENTS";
    ClassType[ClassType["ARRAY"] = 2] = "ARRAY";
    ClassType[ClassType["BOOLEAN"] = 3] = "BOOLEAN";
    ClassType[ClassType["DATE"] = 4] = "DATE";
    ClassType[ClassType["ERROR"] = 5] = "ERROR";
    ClassType[ClassType["FUNCTION"] = 6] = "FUNCTION";
    ClassType[ClassType["JSON"] = 7] = "JSON";
    ClassType[ClassType["MATH"] = 8] = "MATH";
    ClassType[ClassType["NUMBER"] = 9] = "NUMBER";
    ClassType[ClassType["OBJECT"] = 10] = "OBJECT";
    ClassType[ClassType["REGEXP"] = 11] = "REGEXP";
    ClassType[ClassType["STRING"] = 12] = "STRING";
    ClassType[ClassType["GLOBAL"] = 13] = "GLOBAL";
    ClassType[ClassType["OBJENV"] = 14] = "OBJENV";
    ClassType[ClassType["DECENV"] = 15] = "DECENV";
    ClassType[ClassType["BUFFER"] = 16] = "BUFFER";
    ClassType[ClassType["POINTER"] = 17] = "POINTER";
    ClassType[ClassType["THREAD"] = 18] = "THREAD";
    ClassType[ClassType["ARRAYBUFFER"] = 19] = "ARRAYBUFFER";
    ClassType[ClassType["DATAVIEW"] = 20] = "DATAVIEW";
    ClassType[ClassType["INT8ARRAY"] = 21] = "INT8ARRAY";
    ClassType[ClassType["UINT8ARRAY"] = 22] = "UINT8ARRAY";
    ClassType[ClassType["UINT8CLAMPEDARRAY"] = 23] = "UINT8CLAMPEDARRAY";
    ClassType[ClassType["INT16ARRAY"] = 24] = "INT16ARRAY";
    ClassType[ClassType["UINT16ARRAY"] = 25] = "UINT16ARRAY";
    ClassType[ClassType["INT32ARRAY"] = 26] = "INT32ARRAY";
    ClassType[ClassType["UINT32ARRAY"] = 27] = "UINT32ARRAY";
    ClassType[ClassType["FLOAT32ARRAY"] = 28] = "FLOAT32ARRAY";
    ClassType[ClassType["FLOAT64ARRAY"] = 29] = "FLOAT64ARRAY";
})(ClassType || (ClassType = {}));
var WrapperUtil = (function () {
    function WrapperUtil() {
    }
    // duk line from 1...n, v8 line from 0...n-1
    WrapperUtil.v8LineToDukLine = function (v8line) {
        return v8line + 1;
    };
    WrapperUtil.dukLineToV8Line = function (dukline) {
        return dukline - 1;
    };
    WrapperUtil.makeV8LocalVar = function (v8frame, varname, fullvarname, varval) {
        var rtvar = this.makev8Var(v8frame, varname, fullvarname, varval);
        var v8var = null;
        if (rtvar.type === 'string') {
            v8var = { name: rtvar.name, value: { ref: rtvar.ref, type: rtvar.type, value: rtvar.value } };
        }
        else {
            v8var = { name: rtvar.name, value: { ref: rtvar.ref, type: rtvar.type, value: rtvar.value, className: rtvar.className, text: rtvar.text } };
        }
        return v8var;
    };
    WrapperUtil.makeV8EvalVar = function (v8frame, varname, fullvarname, varval) {
        var rtvar = this.makev8Var(v8frame, varname, fullvarname, varval);
        var v8var = null;
        if (rtvar.type === 'string') {
            v8var = { handle: rtvar.ref, type: rtvar.type, value: rtvar.value };
        }
        else {
            v8var = { handle: rtvar.ref, type: rtvar.type, value: rtvar.value, text: rtvar.text, className: rtvar.className };
        }
        return v8var;
    };
    WrapperUtil.makeV8LookupVar = function (v8frame, varname, fullvarname, varval) {
        return this.makev8Var(v8frame, varname, fullvarname, varval);
    };
    WrapperUtil.makev8Var = function (v8frame, varname, fullvarname, varval) {
        var vartype = typeof (varval);
        var varref = ProcessStatus_1.ProcessStatus.ins.toolClient.frameValueRefs.getRef(ProcessStatus_1.ProcessStatus.ins.breakPoint, v8frame, fullvarname, varval);
        var varobj = { ref: varref, name: varname, type: "", value: NaN, text: "", className: "", propertyType: 0, attributes: 0 };
        if (vartype === 'number' || vartype === 'string' || vartype === 'boolean') {
            varobj.type = vartype;
            if (vartype === 'string') {
                varobj.value = this.convertDukStringToUnicode(varval);
                delete varobj.text;
                delete varobj.className;
                delete varobj.propertyType;
                delete varobj.attributes;
            }
            else {
                varobj.value = varval;
            }
        }
        else if (vartype === 'object') {
            if (varval === null) {
                varobj.type = 'null';
                varobj.value = null;
            }
            else if (varval === undefined) {
                varobj.type = 'undefined';
                varobj.value = null;
            }
            else if (varval.type === 'object') {
                varobj.type = varval.type;
                if (varval.class === ClassType.ARRAY) {
                    varobj.type = 'object';
                    varobj.className = 'Array';
                }
                else if (varval.class === ClassType.FUNCTION) {
                    varobj.type = 'function';
                }
                else if (varval.class === ClassType.OBJECT) {
                    varobj.type = 'object';
                }
                else if (varval.class === ClassType.REGEXP) {
                    varobj.type = 'regexp';
                }
                varobj.value = varval.pointer;
            }
            else if (varval.type === 'number') {
                if (!Util_1.Util.isUndefined(varval.value)) {
                    varobj.value = varval.value;
                }
                else if (!Util_1.Util.isUndefined(varval.data)) {
                    varobj.value = Util_1.Util.toDouble(varval.data);
                }
                else {
                    console.log("makev8Var failed (varval.type==number) varval:", varval);
                }
            }
            else if (varval.type === 'undefined' || varval.type === 'null') {
                varobj.type = varval.type;
                varobj.value = null;
            }
            else if (varval.type === 'pointer' || varval.type === 'heapptr' || varval.type === 'lightfunc' || varval.type === 'buffer') {
                varobj.type = 'string';
                varobj.value = varval.pointer;
            }
            else {
                console.log("makev8Var failed (unknown varval.type) varobj:", varobj, varval);
            }
        }
        else {
            console.log("makev8Var failed (unknown vartype:" + vartype + "), varobj:", varobj, varval);
        }
        return varobj;
    };
    WrapperUtil.convertDukStringToUnicode = function (dukstring) {
        var arr = [];
        for (var i = 0; i < dukstring.length; i++) {
            var code = dukstring.charCodeAt(i);
            arr.push(code);
        }
        return new Buffer(arr).toString('utf-8');
    };
    return WrapperUtil;
}());
exports.WrapperUtil = WrapperUtil;
//# sourceMappingURL=WrapperUtil.js.map