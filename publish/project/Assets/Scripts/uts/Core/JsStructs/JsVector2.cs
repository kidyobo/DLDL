using System;
using UnityEngine;

namespace Uts
{
    class JsVector2 : JsStruct
    {
        public JsVector2(IntPtr env) 
            : base(env, typeof(Vector2), "UnityEngine.Vector2", "UnityEngine.Vector2.op_new", "UnityEngine.Vector2.op_set") { }

        public override object ToCsObject(IntPtr context, IntPtr jsval)
        {
            IntPtr jsobj = Native.jvm_toobject(context, jsval);
            return new Vector2((float)Native.jvm_tonumber(context, Native.jvm_get_prop(context, jsobj, "x"))
                , (float)Native.jvm_tonumber(context, Native.jvm_get_prop(context, jsobj, "y")));
        }
        public override void SetJsObject(IntPtr context, IntPtr jsval, object csObj)
        {
            var v2 = (Vector2)csObj;
            Native.jvm_arg_pushobject(Core.env.ptr, jsval);
            Native.jvm_arg_pushnumber(Core.env.ptr, v2.x);
            Native.jvm_arg_pushnumber(Core.env.ptr, v2.y);
            Native.jvm_call_s(Core.env.ptr, setfun, 3);
        }
        public override IntPtr ToJsObject(IntPtr context, object csObj)
        {
            var v2 = (Vector2)csObj;
            Native.jvm_arg_pushnumber(Core.env.ptr, v2.x);
            Native.jvm_arg_pushnumber(Core.env.ptr, v2.y);
            return Native.jvm_call_s(Core.env.ptr, newfun, 2);
        }
    }   
}
