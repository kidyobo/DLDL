using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class MonoBehaviourWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnityEngine.MonoBehaviour();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Invoke(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.MonoBehaviour)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				obj.Invoke(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr InvokeRepeating(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.MonoBehaviour)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				obj.InvokeRepeating(p0, p1, p2);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CancelInvoke(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.MonoBehaviour)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					obj.CancelInvoke();
					return IntPtr.Zero;
				} else if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					obj.CancelInvoke(p0);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsInvoking(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.MonoBehaviour)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var ret = obj.IsInvoking(p0);
					return Native.jvm_make_boolean(context, ret);
				} else if (argcnt == 0) {
					var ret = obj.IsInvoking();
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr StartCoroutine(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.MonoBehaviour)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(System.Collections.IEnumerator))) {
						var p0 = (System.Collections.IEnumerator)vp0;
						var ret = obj.StartCoroutine(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						var ret = obj.StartCoroutine(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 2) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var ret = obj.StartCoroutine(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr StopCoroutine(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.MonoBehaviour)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					obj.StopCoroutine(p0);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(System.Collections.IEnumerator))) {
					var p0 = (System.Collections.IEnumerator)vp0;
					obj.StopCoroutine(p0);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Coroutine))) {
					var p0 = (UnityEngine.Coroutine)vp0;
					obj.StopCoroutine(p0);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr StopAllCoroutines(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.MonoBehaviour)ToCsObjects.ToCsObject(context, thisObj));
				obj.StopAllCoroutines();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr print_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				UnityEngine.MonoBehaviour.print(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr useGUILayoutGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.MonoBehaviour)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.useGUILayout);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool useGUILayoutSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.MonoBehaviour)ToCsObjects.ToCsObject(context, thisObj));
				obj.useGUILayout = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.MonoBehaviour);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "useGUILayout", useGUILayoutGetter, useGUILayoutSetter);
			Native.jvm_reg_function(env, "Invoke", Invoke);
			Native.jvm_reg_function(env, "InvokeRepeating", InvokeRepeating);
			Native.jvm_reg_function(env, "CancelInvoke", CancelInvoke);
			Native.jvm_reg_function(env, "IsInvoking", IsInvoking);
			Native.jvm_reg_function(env, "StartCoroutine", StartCoroutine);
			Native.jvm_reg_function(env, "StopCoroutine", StopCoroutine);
			Native.jvm_reg_function(env, "StopAllCoroutines", StopAllCoroutines);
			Native.jvm_reg_static_function(env, "print", print_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "MonoBehaviour", BehaviourWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.MonoBehaviour), jsClass);
		}
	}
}
