using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ArrayHelperWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetArrayLength_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (System.Array)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = ArrayHelper.GetArrayLength(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetArrayValue_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (System.Array)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var ret = ArrayHelper.GetArrayValue(p0, p1);
				return MakeJsObjects.MakeVarJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetArrayValue_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (System.Array)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
				ArrayHelper.SetArrayValue(p0, p1, p2);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(ArrayHelper);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_function(env, "GetArrayLength", GetArrayLength_S);
			Native.jvm_reg_static_function(env, "GetArrayValue", GetArrayValue_S);
			Native.jvm_reg_static_function(env, "SetArrayValue", SetArrayValue_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "ArrayHelper", IntPtr.Zero, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(ArrayHelper), jsClass);
		}
	}
}
