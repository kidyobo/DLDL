using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class InvokerWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new Invoker();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr BeginInvoke_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.GameObject)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var p3 = (System.Action)Uts.DelegateUtil.CreateDelegate<System.Action>(context, Native.jvm_get_arg(args, 3));
				Invoker.BeginInvoke(p0, p1, p2, p3);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr EndInvoke_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.GameObject)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				Invoker.EndInvoke(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsInvoking_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.GameObject)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				var ret = Invoker.IsInvoking(p0, p1);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr AddDestroyInvoke_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.GameObject)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (System.Action)Uts.DelegateUtil.CreateDelegate<System.Action>(context, Native.jvm_get_arg(args, 1));
				Invoker.AddDestroyInvoke(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(Invoker);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_function(env, "BeginInvoke", BeginInvoke_S);
			Native.jvm_reg_static_function(env, "EndInvoke", EndInvoke_S);
			Native.jvm_reg_static_function(env, "IsInvoking", IsInvoking_S);
			Native.jvm_reg_static_function(env, "AddDestroyInvoke", AddDestroyInvoke_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Invoker", MonoBehaviourWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(Invoker), jsClass);
		}
	}
}
