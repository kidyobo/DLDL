using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class NiceInvokerWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new NiceInvoker();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Get_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.GameObject)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = NiceInvoker.Get(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetCall(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((NiceInvoker)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (System.Action)Uts.DelegateUtil.CreateDelegate<System.Action>(context, Native.jvm_get_arg(args, 1));
				obj.SetCall(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Call(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((NiceInvoker)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				obj.Call(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CancelCall(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((NiceInvoker)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.CancelCall(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CancelAllCall(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((NiceInvoker)ToCsObjects.ToCsObject(context, thisObj));
				obj.CancelAllCall();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Clear(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((NiceInvoker)ToCsObjects.ToCsObject(context, thisObj));
				obj.Clear();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(NiceInvoker);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_function(env, "Get", Get_S);
			Native.jvm_reg_function(env, "SetCall", SetCall);
			Native.jvm_reg_function(env, "Call", Call);
			Native.jvm_reg_function(env, "CancelCall", CancelCall);
			Native.jvm_reg_function(env, "CancelAllCall", CancelAllCall);
			Native.jvm_reg_function(env, "Clear", Clear);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "NiceInvoker", MonoBehaviourWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(NiceInvoker), jsClass);
		}
	}
}
