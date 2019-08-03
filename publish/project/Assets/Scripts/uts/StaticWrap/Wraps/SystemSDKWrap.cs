using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class SystemSDKWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new SystemSDK();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr JavaCaller_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				var p2 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 2));
				var p3 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 3));
				var p4 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 4));
				var p5 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 5));
				var p6 = ToCsObjects.ToArray<object>(context, Native.jvm_get_arg(args, 6));
				var ret = SystemSDK.JavaCaller(p0, p1, p2, p3, p4, p5, p6);
				return MakeJsObjects.MakeVarJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onDestroyGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, SystemSDK.onDestroy);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onDestroySetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				SystemSDK.onDestroy = (System.Action)Uts.DelegateUtil.CreateDelegate<System.Action>(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onMessageGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, SystemSDK.onMessage);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onMessageSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				SystemSDK.onMessage = (System.Action<string>)Uts.DelegateUtil.CreateDelegate<string, System.Action<string>>(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onApplicationPauseGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, SystemSDK.onApplicationPause);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onApplicationPauseSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				SystemSDK.onApplicationPause = (System.Action<bool>)Uts.DelegateUtil.CreateDelegate<bool, System.Action<bool>>(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onPressQuitKeyGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, SystemSDK.onPressQuitKey);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onPressQuitKeySetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				SystemSDK.onPressQuitKey = (System.Action)Uts.DelegateUtil.CreateDelegate<System.Action>(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onKeyDownGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, SystemSDK.onKeyDown);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onKeyDownSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				SystemSDK.onKeyDown = (System.Action<UnityEngine.KeyCode>)Uts.DelegateUtil.CreateDelegate<UnityEngine.KeyCode, System.Action<UnityEngine.KeyCode>>(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(SystemSDK);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "onDestroy", onDestroyGetter_S, onDestroySetter_S);
			Native.jvm_reg_static_property(env, "onMessage", onMessageGetter_S, onMessageSetter_S);
			Native.jvm_reg_static_property(env, "onApplicationPause", onApplicationPauseGetter_S, onApplicationPauseSetter_S);
			Native.jvm_reg_static_property(env, "onPressQuitKey", onPressQuitKeyGetter_S, onPressQuitKeySetter_S);
			Native.jvm_reg_static_property(env, "onKeyDown", onKeyDownGetter_S, onKeyDownSetter_S);
			Native.jvm_reg_static_function(env, "JavaCaller", JavaCaller_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "SystemSDK", MonoBehaviourWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(SystemSDK), jsClass);
		}
	}
}
