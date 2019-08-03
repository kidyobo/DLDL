using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class MaskableGraphicWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetModifiedMaterial(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.MaskableGraphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetModifiedMaterial(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Cull(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.MaskableGraphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
				obj.Cull(p0.target, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetClipRect(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.MaskableGraphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
				obj.SetClipRect(p0.target, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RecalculateClipping(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.MaskableGraphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.RecalculateClipping();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RecalculateMasking(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.MaskableGraphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.RecalculateMasking();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr onCullStateChangedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.MaskableGraphic)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.onCullStateChanged);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool onCullStateChangedSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.MaskableGraphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.onCullStateChanged = Uts.DelegateUtil.CreateUnityEvent<bool, UnityEngine.UI.MaskableGraphic.CullStateChangedEvent>(context, arg, new UnityEngine.UI.MaskableGraphic.CullStateChangedEvent());
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr maskableGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.MaskableGraphic)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.maskable);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool maskableSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.MaskableGraphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.maskable = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.UI.MaskableGraphic);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "onCullStateChanged", onCullStateChangedGetter, onCullStateChangedSetter);
			Native.jvm_reg_property(env, "maskable", maskableGetter, maskableSetter);
			Native.jvm_reg_function(env, "GetModifiedMaterial", GetModifiedMaterial);
			Native.jvm_reg_function(env, "Cull", Cull);
			Native.jvm_reg_function(env, "SetClipRect", SetClipRect);
			Native.jvm_reg_function(env, "RecalculateClipping", RecalculateClipping);
			Native.jvm_reg_function(env, "RecalculateMasking", RecalculateMasking);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "MaskableGraphic", GraphicWrap.jsClass, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.UI.MaskableGraphic), jsClass);
		}
	}
}
