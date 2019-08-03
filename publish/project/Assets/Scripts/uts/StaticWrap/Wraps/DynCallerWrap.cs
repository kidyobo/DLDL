using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class DynCallerWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new DynCaller();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Invoke_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 2));
				var p3 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
				var p4 = ToCsObjects.ToArray<object>(context, Native.jvm_get_arg(args, 4));
				var ret = DynCaller.Invoke(p0, p1, p2, p3, p4);
				return MakeJsObjects.MakeVarJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr JavaInvoke_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 2));
				var p3 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
				var p4 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 4));
				var p5 = ToCsObjects.ToArray<object>(context, Native.jvm_get_arg(args, 5));
				var ret = DynCaller.JavaInvoke(p0, p1, p2, p3, p4, p5);
				return MakeJsObjects.MakeVarJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(DynCaller);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_function(env, "Invoke", Invoke_S);
			Native.jvm_reg_static_function(env, "JavaInvoke", JavaInvoke_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "DynCaller", IntPtr.Zero, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(DynCaller), jsClass);
		}
	}
}
