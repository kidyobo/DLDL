using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class RectTransformUtilityWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RectangleContainsScreenPoint_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var p0 = (UnityEngine.RectTransform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 1));
					var ret = UnityEngine.RectTransformUtility.RectangleContainsScreenPoint(p0, p1);
					return Native.jvm_make_boolean(context, ret);
				} else if (argcnt == 3) {
					var p0 = (UnityEngine.RectTransform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Camera)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var ret = UnityEngine.RectTransformUtility.RectangleContainsScreenPoint(p0, p1, p2);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ScreenPointToWorldPointInRectangle_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.RectTransform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (UnityEngine.Camera)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
				var p3 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 3));
				var ret = UnityEngine.RectTransformUtility.ScreenPointToWorldPointInRectangle(p0, p1, p2, out p3);
				JsStructs.vector3.SetJsObject(context, Native.jvm_get_arg(args, 3), p3);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ScreenPointToLocalPointInRectangle_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.RectTransform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (UnityEngine.Camera)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
				var p3 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 3));
				var ret = UnityEngine.RectTransformUtility.ScreenPointToLocalPointInRectangle(p0, p1, p2, out p3);
				JsStructs.vector2.SetJsObject(context, Native.jvm_get_arg(args, 3), p3);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ScreenPointToRay_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Camera)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 1));
				var ret = UnityEngine.RectTransformUtility.ScreenPointToRay(p0, p1);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WorldToScreenPoint_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Camera)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
				var ret = UnityEngine.RectTransformUtility.WorldToScreenPoint(p0, p1);
				return JsStructs.vector2.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CalculateRelativeRectTransformBounds_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var p0 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var ret = new Agent<UnityEngine.Bounds>(UnityEngine.RectTransformUtility.CalculateRelativeRectTransformBounds(p0, p1));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Bounds>(context, ret);
				} else if (argcnt == 1) {
					var p0 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var ret = new Agent<UnityEngine.Bounds>(UnityEngine.RectTransformUtility.CalculateRelativeRectTransformBounds(p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Bounds>(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FlipLayoutOnAxis_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.RectTransform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
				var p3 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 3));
				UnityEngine.RectTransformUtility.FlipLayoutOnAxis(p0, p1, p2, p3);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FlipLayoutAxes_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.RectTransform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
				var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
				UnityEngine.RectTransformUtility.FlipLayoutAxes(p0, p1, p2);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr PixelAdjustPoint_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (UnityEngine.Canvas)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
				var ret = UnityEngine.RectTransformUtility.PixelAdjustPoint(p0, p1, p2);
				return JsStructs.vector2.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr PixelAdjustRect_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.RectTransform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Canvas)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Rect>(UnityEngine.RectTransformUtility.PixelAdjustRect(p0, p1));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Rect>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.RectTransformUtility);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_function(env, "RectangleContainsScreenPoint", RectangleContainsScreenPoint_S);
			Native.jvm_reg_static_function(env, "ScreenPointToWorldPointInRectangle", ScreenPointToWorldPointInRectangle_S);
			Native.jvm_reg_static_function(env, "ScreenPointToLocalPointInRectangle", ScreenPointToLocalPointInRectangle_S);
			Native.jvm_reg_static_function(env, "ScreenPointToRay", ScreenPointToRay_S);
			Native.jvm_reg_static_function(env, "WorldToScreenPoint", WorldToScreenPoint_S);
			Native.jvm_reg_static_function(env, "CalculateRelativeRectTransformBounds", CalculateRelativeRectTransformBounds_S);
			Native.jvm_reg_static_function(env, "FlipLayoutOnAxis", FlipLayoutOnAxis_S);
			Native.jvm_reg_static_function(env, "FlipLayoutAxes", FlipLayoutAxes_S);
			Native.jvm_reg_static_function(env, "PixelAdjustPoint", PixelAdjustPoint_S);
			Native.jvm_reg_static_function(env, "PixelAdjustRect", PixelAdjustRect_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "RectTransformUtility", IntPtr.Zero, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.RectTransformUtility), jsClass);
		}
	}
}
