import { ProcessStatus } from '../ProcessStatus';
import { Util } from '../Util';

enum ClassType {
    UNUSED = 0,
    ARGUMENTS = 1,
    ARRAY = 2,
    BOOLEAN = 3,
    DATE = 4,
    ERROR = 5,
    FUNCTION = 6,
    JSON = 7,
    MATH = 8,
    NUMBER = 9,
    OBJECT = 10,
    REGEXP = 11,
    STRING = 12,
    GLOBAL = 13,
    OBJENV = 14,  /* custom */
    DECENV = 15,  /* custom */
    BUFFER = 16,  /* custom; implies DUK_HOBJECT_IS_BUFFEROBJECT */
    POINTER = 17,  /* custom */
    THREAD = 18, /* custom; implies DUK_HOBJECT_IS_THREAD */
    ARRAYBUFFER = 19,  /* implies DUK_HOBJECT_IS_BUFFEROBJECT */
    DATAVIEW = 20,
    INT8ARRAY = 21,
    UINT8ARRAY = 22,
    UINT8CLAMPEDARRAY = 23,
    INT16ARRAY = 24,
    UINT16ARRAY = 25,
    INT32ARRAY = 26,
    UINT32ARRAY = 27,
    FLOAT32ARRAY = 28,
    FLOAT64ARRAY = 29,
}

interface V8Val {
    ref: number;
    name: string;
    type: string;
    value: number | string;
    text: string;
    className: string;
    propertyType: number;
    attributes: number;
}

export class WrapperUtil {
    // duk line from 1...n, v8 line from 0...n-1
    static v8LineToDukLine(v8line): number {
        return v8line + 1;
    }
    static dukLineToV8Line(dukline): number {
        return dukline - 1;
    }
    static makeV8LocalVar(v8frame: number, varname: string, fullvarname: string, varval) {
        let rtvar = this.makev8Var(v8frame, varname, fullvarname, varval);
        let v8var = null;
        if (rtvar.type === 'string') {
            v8var = { name: rtvar.name, value: { ref: rtvar.ref, type: rtvar.type, value: rtvar.value } };
        }
        else {
            v8var = { name: rtvar.name, value: { ref: rtvar.ref, type: rtvar.type, value: rtvar.value, className: rtvar.className, text: rtvar.text } };
        }
        return v8var;
    }
    static makeV8EvalVar(v8frame: number, varname: string, fullvarname: string, varval) {
        let rtvar = this.makev8Var(v8frame, varname, fullvarname, varval);
        let v8var = null;
        if (rtvar.type === 'string') {
            v8var = { handle: rtvar.ref, type: rtvar.type, value: rtvar.value };
        }
        else {
            v8var = { handle: rtvar.ref, type: rtvar.type, value: rtvar.value, text: rtvar.text, className: rtvar.className };
        }
        return v8var;
    }
    static makeV8LookupVar(v8frame: number, varname: string, fullvarname: string, varval) {
        return this.makev8Var(v8frame, varname, fullvarname, varval);
    }
    private static makev8Var(v8frame: number, varname: string, fullvarname: string, varval) {
        let vartype = typeof (varval);
        let varref = ProcessStatus.ins.toolClient.frameValueRefs.getRef(ProcessStatus.ins.breakPoint, v8frame, fullvarname, varval);
        let varobj: V8Val = { ref: varref, name: varname, type: "", value: NaN, text: "", className: "", propertyType: 0, attributes: 0 };
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
                if (!Util.isUndefined(varval.value)) {
                    varobj.value = varval.value;
                }
                else if (!Util.isUndefined(varval.data)) {
                    varobj.value = Util.toDouble(varval.data);
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
    }
    private static convertDukStringToUnicode(dukstring: string): string {
        let arr = [];
        for (let i = 0; i < dukstring.length; i++) {
            let code = dukstring.charCodeAt(i);
            arr.push(code);
        }
        return new Buffer(arr).toString('utf-8');
    }
}
