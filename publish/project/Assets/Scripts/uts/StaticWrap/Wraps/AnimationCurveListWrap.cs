using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class AnimationCurveListWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new AnimationCurveList();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Init(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((AnimationCurveList)ToCsObjects.ToCsObject(context, thisObj));
				obj.Init();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetCurve_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = AnimationCurveList.GetCurve(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr NamesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((AnimationCurveList)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.Names);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr CurvesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((AnimationCurveList)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.Curves);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(AnimationCurveList);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "Names", NamesGetter, null);
			Native.jvm_reg_property(env, "Curves", CurvesGetter, null);
			Native.jvm_reg_function(env, "Init", Init);
			Native.jvm_reg_static_function(env, "GetCurve", GetCurve_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "AnimationCurveList", MonoBehaviourWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(AnimationCurveList), jsClass);
		}
	}
}
