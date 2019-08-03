using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ThreeDToolsWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr PutOnNavMesh_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 4) {
					var p0 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					ThreeDTools.PutOnNavMesh(p0, p1, p2, p3);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
					ThreeDTools.PutOnNavMesh(p0, p1);
					return IntPtr.Zero;
				} else if (argcnt == 1) {
					var p0 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					ThreeDTools.PutOnNavMesh(p0);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetNavYValue_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var ret = ThreeDTools.GetNavYValue(p0, p1);
				return JsStructs.vector3.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetNavYValueBySample_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var ret = ThreeDTools.GetNavYValueBySample(p0, p1);
				return JsStructs.vector3.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetCacheNavYValueBySample_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 2));
				var ret = ThreeDTools.GetCacheNavYValueBySample(p0, p1, out p2);
				JsStructs.vector3.SetJsObject(context, Native.jvm_get_arg(args, 2), p2);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr rayDistanceGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(ThreeDTools.rayDistance));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr rayDistanceSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				ThreeDTools.rayDistance = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr boxRayDistanceGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(ThreeDTools.boxRayDistance));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr boxRayDistanceSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				ThreeDTools.boxRayDistance = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr sampleStepGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(ThreeDTools.sampleStep));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr sampleStepSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				ThreeDTools.sampleStep = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(ThreeDTools);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "rayDistance", rayDistanceGetter_S, rayDistanceSetter_S);
			Native.jvm_reg_static_property(env, "boxRayDistance", boxRayDistanceGetter_S, boxRayDistanceSetter_S);
			Native.jvm_reg_static_property(env, "sampleStep", sampleStepGetter_S, sampleStepSetter_S);
			Native.jvm_reg_static_function(env, "PutOnNavMesh", PutOnNavMesh_S);
			Native.jvm_reg_static_function(env, "GetNavYValue", GetNavYValue_S);
			Native.jvm_reg_static_function(env, "GetNavYValueBySample", GetNavYValueBySample_S);
			Native.jvm_reg_static_function(env, "GetCacheNavYValueBySample", GetCacheNavYValueBySample_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "ThreeDTools", IntPtr.Zero, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(ThreeDTools), jsClass);
		}
	}
}
