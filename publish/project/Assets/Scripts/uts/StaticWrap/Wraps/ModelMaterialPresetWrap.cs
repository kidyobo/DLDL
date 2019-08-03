using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ModelMaterialPresetWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr NewPreset_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				ModelMaterialPreset.NewPreset(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DeletePreset_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				ModelMaterialPreset.DeletePreset(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr UpdateMaterialByPreset_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				ModelMaterialPreset.UpdateMaterialByPreset(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr UpdateMaterialsByPreset_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = ToCsObjects.ToArray<UnityEngine.Material>(context, Native.jvm_get_arg(args, 1));
				ModelMaterialPreset.UpdateMaterialsByPreset(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetPresetFloat_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				ModelMaterialPreset.SetPresetFloat(p0, p1, p2);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetPresetColor_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				var p2 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
				ModelMaterialPreset.SetPresetColor(p0, p1, p2.target);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetPresetVector_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				var p2 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
				ModelMaterialPreset.SetPresetVector(p0, p1, p2.target);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetPresetTexture_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				var p2 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
				ModelMaterialPreset.SetPresetTexture(p0, p1, p2);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(ModelMaterialPreset);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_function(env, "NewPreset", NewPreset_S);
			Native.jvm_reg_static_function(env, "DeletePreset", DeletePreset_S);
			Native.jvm_reg_static_function(env, "UpdateMaterialByPreset", UpdateMaterialByPreset_S);
			Native.jvm_reg_static_function(env, "UpdateMaterialsByPreset", UpdateMaterialsByPreset_S);
			Native.jvm_reg_static_function(env, "SetPresetFloat", SetPresetFloat_S);
			Native.jvm_reg_static_function(env, "SetPresetColor", SetPresetColor_S);
			Native.jvm_reg_static_function(env, "SetPresetVector", SetPresetVector_S);
			Native.jvm_reg_static_function(env, "SetPresetTexture", SetPresetTexture_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "ModelMaterialPreset", IntPtr.Zero, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(ModelMaterialPreset), jsClass);
		}
	}
}
