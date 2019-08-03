using System;
using UnityEngine;

namespace Uts
{
    class JsVector3 : JsStruct
    {
        public JsVector3(IntPtr env)
            : base(env, typeof(Vector3), "UnityEngine.Vector3", "UnityEngine.Vector3.op_new", "UnityEngine.Vector3.op_set") { }

        public override object ToCsObject(IntPtr context, IntPtr jsval)
        {
            IntPtr jsobj = Native.jvm_toobject(context, jsval);
            return new Vector3((float)Native.jvm_tonumber(context, Native.jvm_get_prop(context, jsobj, "x"))
                , (float)Native.jvm_tonumber(context, Native.jvm_get_prop(context, jsobj, "y"))
                , (float)Native.jvm_tonumber(context, Native.jvm_get_prop(context, jsobj, "z")));
        }
        public override void SetJsObject(IntPtr context, IntPtr jsval, object csObj)
        {
            var v3 = (Vector3)csObj;
            Native.jvm_arg_pushobject(Core.env.ptr, jsval);
            Native.jvm_arg_pushnumber(Core.env.ptr, v3.x);
            Native.jvm_arg_pushnumber(Core.env.ptr, v3.y);
            Native.jvm_arg_pushnumber(Core.env.ptr, v3.z);
            Native.jvm_call_s(Core.env.ptr, setfun, 4);
        }
        public override IntPtr ToJsObject(IntPtr context, object csObj)
        {
            var v3 = (Vector3)csObj;
            Native.jvm_arg_pushnumber(Core.env.ptr, v3.x);
            Native.jvm_arg_pushnumber(Core.env.ptr, v3.y);
            Native.jvm_arg_pushnumber(Core.env.ptr, v3.z);
            return Native.jvm_call_s(Core.env.ptr, newfun, 3);
        }
    }
}
