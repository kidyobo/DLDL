using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class RawImageWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetNativeSize(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.RawImage)ToCsObjects.ToCsObject(context, thisObj));
				obj.SetNativeSize();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr mainTextureGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.RawImage)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.mainTexture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr textureGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.RawImage)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.texture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool textureSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.RawImage)ToCsObjects.ToCsObject(context, thisObj));
				obj.texture = (UnityEngine.Texture)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr uvRectGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.RawImage)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Rect>(context, new Agent<UnityEngine.Rect>(obj.uvRect));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool uvRectSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.RawImage)ToCsObjects.ToCsObject(context, thisObj));
				obj.uvRect = ((Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, arg)).target;
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.UI.RawImage);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "mainTexture", mainTextureGetter, null);
			Native.jvm_reg_property(env, "texture", textureGetter, textureSetter);
			Native.jvm_reg_property(env, "uvRect", uvRectGetter, uvRectSetter);
			Native.jvm_reg_function(env, "SetNativeSize", SetNativeSize);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "RawImage", MaskableGraphicWrap.jsClass, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.UI.RawImage), jsClass);
		}
	}
}
