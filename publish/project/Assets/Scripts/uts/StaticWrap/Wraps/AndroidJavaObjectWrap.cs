using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class AndroidJavaObjectWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = ToCsObjects.ToArray<object>(context, Native.jvm_get_arg(args, 1));
				var obj = new UnityEngine.AndroidJavaObject(p0, p1);
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Dispose(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AndroidJavaObject)ToCsObjects.ToCsObject(context, thisObj));
				obj.Dispose();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Call(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AndroidJavaObject)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = ToCsObjects.ToArray<object>(context, Native.jvm_get_arg(args, 1));
				obj.Call(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CallStatic(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AndroidJavaObject)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = ToCsObjects.ToArray<object>(context, Native.jvm_get_arg(args, 1));
				obj.CallStatic(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetRawObject(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AndroidJavaObject)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetRawObject();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetRawClass(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AndroidJavaObject)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetRawClass();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.AndroidJavaObject);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_function(env, "Dispose", Dispose);
			Native.jvm_reg_function(env, "Call", Call);
			Native.jvm_reg_function(env, "CallStatic", CallStatic);
			Native.jvm_reg_function(env, "GetRawObject", GetRawObject);
			Native.jvm_reg_function(env, "GetRawClass", GetRawClass);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "AndroidJavaObject", IntPtr.Zero, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.AndroidJavaObject), jsClass);
		}
	}
}
