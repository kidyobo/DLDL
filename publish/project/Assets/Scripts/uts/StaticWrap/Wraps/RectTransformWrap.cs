using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class RectTransformWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnityEngine.RectTransform();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetLocalCorners(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToArray<UnityEngine.Vector3>(context, Native.jvm_get_arg(args, 0));
				obj.GetLocalCorners(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetWorldCorners(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToArray<UnityEngine.Vector3>(context, Native.jvm_get_arg(args, 0));
				obj.GetWorldCorners(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetInsetAndSizeFromParentEdge(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.RectTransform.Edge)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				obj.SetInsetAndSizeFromParentEdge(p0, p1, p2);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetSizeWithCurrentAnchors(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.RectTransform.Axis)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				obj.SetSizeWithCurrentAnchors(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr rectGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Rect>(context, new Agent<UnityEngine.Rect>(obj.rect));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr anchorMinGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector2.ToJsObject(context, obj.anchorMin);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool anchorMinSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				obj.anchorMin = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr anchorMaxGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector2.ToJsObject(context, obj.anchorMax);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool anchorMaxSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				obj.anchorMax = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr anchoredPosition3DGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.anchoredPosition3D);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool anchoredPosition3DSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				obj.anchoredPosition3D = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr anchoredPositionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector2.ToJsObject(context, obj.anchoredPosition);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool anchoredPositionSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				obj.anchoredPosition = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr sizeDeltaGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector2.ToJsObject(context, obj.sizeDelta);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool sizeDeltaSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				obj.sizeDelta = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr pivotGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector2.ToJsObject(context, obj.pivot);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool pivotSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				obj.pivot = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr offsetMinGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector2.ToJsObject(context, obj.offsetMin);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool offsetMinSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				obj.offsetMin = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr offsetMaxGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector2.ToJsObject(context, obj.offsetMax);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool offsetMaxSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RectTransform)ToCsObjects.ToCsObject(context, thisObj));
				obj.offsetMax = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.RectTransform);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "rect", rectGetter, null);
			Native.jvm_reg_property(env, "anchorMin", anchorMinGetter, anchorMinSetter);
			Native.jvm_reg_property(env, "anchorMax", anchorMaxGetter, anchorMaxSetter);
			Native.jvm_reg_property(env, "anchoredPosition3D", anchoredPosition3DGetter, anchoredPosition3DSetter);
			Native.jvm_reg_property(env, "anchoredPosition", anchoredPositionGetter, anchoredPositionSetter);
			Native.jvm_reg_property(env, "sizeDelta", sizeDeltaGetter, sizeDeltaSetter);
			Native.jvm_reg_property(env, "pivot", pivotGetter, pivotSetter);
			Native.jvm_reg_property(env, "offsetMin", offsetMinGetter, offsetMinSetter);
			Native.jvm_reg_property(env, "offsetMax", offsetMaxGetter, offsetMaxSetter);
			Native.jvm_reg_function(env, "GetLocalCorners", GetLocalCorners);
			Native.jvm_reg_function(env, "GetWorldCorners", GetWorldCorners);
			Native.jvm_reg_function(env, "SetInsetAndSizeFromParentEdge", SetInsetAndSizeFromParentEdge);
			Native.jvm_reg_function(env, "SetSizeWithCurrentAnchors", SetSizeWithCurrentAnchors);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "RectTransform", TransformWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.RectTransform), jsClass);
		}
	}
}
