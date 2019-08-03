using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class GraphicWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetAllDirty(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.SetAllDirty();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetLayoutDirty(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.SetLayoutDirty();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetVerticesDirty(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.SetVerticesDirty();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetMaterialDirty(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.SetMaterialDirty();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Rebuild(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.UI.CanvasUpdate)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.Rebuild(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LayoutComplete(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.LayoutComplete();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GraphicUpdateComplete(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.GraphicUpdateComplete();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetNativeSize(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.SetNativeSize();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Raycast(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Camera)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = obj.Raycast(p0, p1);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr PixelAdjustPoint(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.PixelAdjustPoint(p0);
				return JsStructs.vector2.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetPixelAdjustedRect(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				var ret = new Agent<UnityEngine.Rect>(obj.GetPixelAdjustedRect());
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Rect>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CrossFadeColor(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 4) {
					var p0 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
					var p3 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 3));
					obj.CrossFadeColor(p0.target, p1, p2, p3);
					return IntPtr.Zero;
				} else if (argcnt == 5) {
					var p0 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
					var p3 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 3));
					var p4 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 4));
					obj.CrossFadeColor(p0.target, p1, p2, p3, p4);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CrossFadeAlpha(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
				obj.CrossFadeAlpha(p0, p1, p2);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RegisterDirtyLayoutCallback(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Events.UnityAction)Uts.DelegateUtil.CreateDelegate<UnityEngine.Events.UnityAction>(context, Native.jvm_get_arg(args, 0));
				obj.RegisterDirtyLayoutCallback(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr UnregisterDirtyLayoutCallback(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Events.UnityAction)Uts.DelegateUtil.CreateDelegate<UnityEngine.Events.UnityAction>(context, Native.jvm_get_arg(args, 0));
				obj.UnregisterDirtyLayoutCallback(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RegisterDirtyVerticesCallback(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Events.UnityAction)Uts.DelegateUtil.CreateDelegate<UnityEngine.Events.UnityAction>(context, Native.jvm_get_arg(args, 0));
				obj.RegisterDirtyVerticesCallback(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr UnregisterDirtyVerticesCallback(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Events.UnityAction)Uts.DelegateUtil.CreateDelegate<UnityEngine.Events.UnityAction>(context, Native.jvm_get_arg(args, 0));
				obj.UnregisterDirtyVerticesCallback(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RegisterDirtyMaterialCallback(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Events.UnityAction)Uts.DelegateUtil.CreateDelegate<UnityEngine.Events.UnityAction>(context, Native.jvm_get_arg(args, 0));
				obj.RegisterDirtyMaterialCallback(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr UnregisterDirtyMaterialCallback(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Events.UnityAction)Uts.DelegateUtil.CreateDelegate<UnityEngine.Events.UnityAction>(context, Native.jvm_get_arg(args, 0));
				obj.UnregisterDirtyMaterialCallback(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr defaultGraphicMaterialGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.UI.Graphic.defaultGraphicMaterial);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr colorGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(obj.color));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool colorSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.color = ((Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, arg)).target;
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr raycastTargetGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.raycastTarget);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool raycastTargetSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.raycastTarget = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr depthGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.depth));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr rectTransformGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.rectTransform);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr canvasGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.canvas);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr canvasRendererGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.canvasRenderer);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr defaultMaterialGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.defaultMaterial);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr materialGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.material);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool materialSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				obj.material = (UnityEngine.Material)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr materialForRenderingGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.materialForRendering);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr mainTextureGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Graphic)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.mainTexture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.UI.Graphic);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "defaultGraphicMaterial", defaultGraphicMaterialGetter_S, null);
			Native.jvm_reg_property(env, "color", colorGetter, colorSetter);
			Native.jvm_reg_property(env, "raycastTarget", raycastTargetGetter, raycastTargetSetter);
			Native.jvm_reg_property(env, "depth", depthGetter, null);
			Native.jvm_reg_property(env, "rectTransform", rectTransformGetter, null);
			Native.jvm_reg_property(env, "canvas", canvasGetter, null);
			Native.jvm_reg_property(env, "canvasRenderer", canvasRendererGetter, null);
			Native.jvm_reg_property(env, "defaultMaterial", defaultMaterialGetter, null);
			Native.jvm_reg_property(env, "material", materialGetter, materialSetter);
			Native.jvm_reg_property(env, "materialForRendering", materialForRenderingGetter, null);
			Native.jvm_reg_property(env, "mainTexture", mainTextureGetter, null);
			Native.jvm_reg_function(env, "SetAllDirty", SetAllDirty);
			Native.jvm_reg_function(env, "SetLayoutDirty", SetLayoutDirty);
			Native.jvm_reg_function(env, "SetVerticesDirty", SetVerticesDirty);
			Native.jvm_reg_function(env, "SetMaterialDirty", SetMaterialDirty);
			Native.jvm_reg_function(env, "Rebuild", Rebuild);
			Native.jvm_reg_function(env, "LayoutComplete", LayoutComplete);
			Native.jvm_reg_function(env, "GraphicUpdateComplete", GraphicUpdateComplete);
			Native.jvm_reg_function(env, "SetNativeSize", SetNativeSize);
			Native.jvm_reg_function(env, "Raycast", Raycast);
			Native.jvm_reg_function(env, "PixelAdjustPoint", PixelAdjustPoint);
			Native.jvm_reg_function(env, "GetPixelAdjustedRect", GetPixelAdjustedRect);
			Native.jvm_reg_function(env, "CrossFadeColor", CrossFadeColor);
			Native.jvm_reg_function(env, "CrossFadeAlpha", CrossFadeAlpha);
			Native.jvm_reg_function(env, "RegisterDirtyLayoutCallback", RegisterDirtyLayoutCallback);
			Native.jvm_reg_function(env, "UnregisterDirtyLayoutCallback", UnregisterDirtyLayoutCallback);
			Native.jvm_reg_function(env, "RegisterDirtyVerticesCallback", RegisterDirtyVerticesCallback);
			Native.jvm_reg_function(env, "UnregisterDirtyVerticesCallback", UnregisterDirtyVerticesCallback);
			Native.jvm_reg_function(env, "RegisterDirtyMaterialCallback", RegisterDirtyMaterialCallback);
			Native.jvm_reg_function(env, "UnregisterDirtyMaterialCallback", UnregisterDirtyMaterialCallback);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Graphic", UIBehaviourWrap.jsClass, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.UI.Graphic), jsClass);
		}
	}
}
