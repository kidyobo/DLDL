using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class MaterialWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Shader))) {
					var p0 = (UnityEngine.Shader)vp0;
					var obj = new UnityEngine.Material(p0);
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Material))) {
					var p0 = (UnityEngine.Material)vp0;
					var obj = new UnityEngine.Material(p0);
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr HasProperty(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.HasProperty(p0);
					return Native.jvm_make_boolean(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = obj.HasProperty(p0);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetTag(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 3) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					var p2 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 2));
					var ret = obj.GetTag(p0, p1, p2);
					return Native.jvm_make_string(context, ret);
				} else if (argcnt == 2) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					var ret = obj.GetTag(p0, p1);
					return Native.jvm_make_string(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetOverrideTag(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				obj.SetOverrideTag(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetShaderPassEnabled(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
				obj.SetShaderPassEnabled(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetShaderPassEnabled(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetShaderPassEnabled(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Lerp(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				obj.Lerp(p0, p1, p2);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetPass(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.SetPass(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetPassName(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetPassName(p0);
				return Native.jvm_make_string(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindPass(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = obj.FindPass(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CopyPropertiesFromMaterial(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.CopyPropertiesFromMaterial(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr EnableKeyword(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				obj.EnableKeyword(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DisableKeyword(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				obj.DisableKeyword(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsKeywordEnabled(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = obj.IsKeywordEnabled(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetFloat(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float))) {
					var p0 = (string)vp0;
					var p1 = (float)(double)vp1;
					obj.SetFloat(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float))) {
					var p0 = (int)(double)vp0;
					var p1 = (float)(double)vp1;
					obj.SetFloat(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetInt(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(int))) {
					var p0 = (string)vp0;
					var p1 = (int)(double)vp1;
					obj.SetInt(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(int))) {
					var p0 = (int)(double)vp0;
					var p1 = (int)(double)vp1;
					obj.SetInt(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetColor(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Color>))) {
					var p0 = (string)vp0;
					var p1 = (Agent<UnityEngine.Color>)vp1;
					obj.SetColor(p0, p1.target);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Color>))) {
					var p0 = (int)(double)vp0;
					var p1 = (Agent<UnityEngine.Color>)vp1;
					obj.SetColor(p0, p1.target);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetVector(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Vector4>))) {
					var p0 = (string)vp0;
					var p1 = (Agent<UnityEngine.Vector4>)vp1;
					obj.SetVector(p0, p1.target);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Vector4>))) {
					var p0 = (int)(double)vp0;
					var p1 = (Agent<UnityEngine.Vector4>)vp1;
					obj.SetVector(p0, p1.target);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetMatrix(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4))) {
					var p0 = (string)vp0;
					var p1 = (UnityEngine.Matrix4x4)vp1;
					obj.SetMatrix(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4))) {
					var p0 = (int)(double)vp0;
					var p1 = (UnityEngine.Matrix4x4)vp1;
					obj.SetMatrix(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetTexture(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Texture))) {
					var p0 = (string)vp0;
					var p1 = (UnityEngine.Texture)vp1;
					obj.SetTexture(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Texture))) {
					var p0 = (int)(double)vp0;
					var p1 = (UnityEngine.Texture)vp1;
					obj.SetTexture(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetBuffer(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.ComputeBuffer))) {
					var p0 = (string)vp0;
					var p1 = (UnityEngine.ComputeBuffer)vp1;
					obj.SetBuffer(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.ComputeBuffer))) {
					var p0 = (int)(double)vp0;
					var p1 = (UnityEngine.ComputeBuffer)vp1;
					obj.SetBuffer(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetTextureOffset(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector2))) {
					var p0 = (string)vp0;
					var p1 = (UnityEngine.Vector2)vp1;
					obj.SetTextureOffset(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector2))) {
					var p0 = (int)(double)vp0;
					var p1 = (UnityEngine.Vector2)vp1;
					obj.SetTextureOffset(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetTextureScale(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector2))) {
					var p0 = (string)vp0;
					var p1 = (UnityEngine.Vector2)vp1;
					obj.SetTextureScale(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector2))) {
					var p0 = (int)(double)vp0;
					var p1 = (UnityEngine.Vector2)vp1;
					obj.SetTextureScale(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetFloatArray(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToList<float>(vp1);
					obj.SetFloatArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToList<float>(vp1);
					obj.SetFloatArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToArray<float>(vp1);
					obj.SetFloatArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToArray<float>(vp1);
					obj.SetFloatArray(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetColorArray(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Color[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToList<UnityEngine.Color>(vp1);
					obj.SetColorArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Color[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToList<UnityEngine.Color>(vp1);
					obj.SetColorArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Color>[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToArray<UnityEngine.Color>(vp1);
					obj.SetColorArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Color>[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToArray<UnityEngine.Color>(vp1);
					obj.SetColorArray(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetVectorArray(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector4[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToList<UnityEngine.Vector4>(vp1);
					obj.SetVectorArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector4[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToList<UnityEngine.Vector4>(vp1);
					obj.SetVectorArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Vector4>[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToArray<UnityEngine.Vector4>(vp1);
					obj.SetVectorArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Vector4>[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToArray<UnityEngine.Vector4>(vp1);
					obj.SetVectorArray(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetMatrixArray(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp1);
					obj.SetMatrixArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp1);
					obj.SetMatrixArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToArray<UnityEngine.Matrix4x4>(vp1);
					obj.SetMatrixArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToArray<UnityEngine.Matrix4x4>(vp1);
					obj.SetMatrixArray(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetFloat(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.GetFloat(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = obj.GetFloat(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetInt(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.GetInt(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = obj.GetInt(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetColor(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = new Agent<UnityEngine.Color>(obj.GetColor(p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = new Agent<UnityEngine.Color>(obj.GetColor(p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetVector(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = new Agent<UnityEngine.Vector4>(obj.GetVector(p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = new Agent<UnityEngine.Vector4>(obj.GetVector(p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetMatrix(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.GetMatrix(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = obj.GetMatrix(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetFloatArray(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
						var p0 = (string)vp0;
						var p1 = ToCsObjects.ToList<float>(vp1);
						obj.GetFloatArray(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
						var p0 = (int)(double)vp0;
						var p1 = ToCsObjects.ToList<float>(vp1);
						obj.GetFloatArray(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						var ret = obj.GetFloatArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(int))) {
						var p0 = (int)(double)vp0;
						var ret = obj.GetFloatArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetVectorArray(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector4[]))) {
						var p0 = (string)vp0;
						var p1 = ToCsObjects.ToList<UnityEngine.Vector4>(vp1);
						obj.GetVectorArray(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector4[]))) {
						var p0 = (int)(double)vp0;
						var p1 = ToCsObjects.ToList<UnityEngine.Vector4>(vp1);
						obj.GetVectorArray(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						var ret = obj.GetVectorArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(int))) {
						var p0 = (int)(double)vp0;
						var ret = obj.GetVectorArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetColorArray(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						var ret = obj.GetColorArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(int))) {
						var p0 = (int)(double)vp0;
						var ret = obj.GetColorArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Color[]))) {
						var p0 = (string)vp0;
						var p1 = ToCsObjects.ToList<UnityEngine.Color>(vp1);
						obj.GetColorArray(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Color[]))) {
						var p0 = (int)(double)vp0;
						var p1 = ToCsObjects.ToList<UnityEngine.Color>(vp1);
						obj.GetColorArray(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetMatrixArray(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
						var p0 = (string)vp0;
						var p1 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp1);
						obj.GetMatrixArray(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
						var p0 = (int)(double)vp0;
						var p1 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp1);
						obj.GetMatrixArray(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						var ret = obj.GetMatrixArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(int))) {
						var p0 = (int)(double)vp0;
						var ret = obj.GetMatrixArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetTexture(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.GetTexture(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = obj.GetTexture(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetTextureOffset(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.GetTextureOffset(p0);
					return JsStructs.vector2.ToJsObject(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = obj.GetTextureOffset(p0);
					return JsStructs.vector2.ToJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetTextureScale(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.GetTextureScale(p0);
					return JsStructs.vector2.ToJsObject(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = obj.GetTextureScale(p0);
					return JsStructs.vector2.ToJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr shaderGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.shader);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool shaderSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				obj.shader = (UnityEngine.Shader)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr colorGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(obj.color));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool colorSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				obj.color = ((Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, arg)).target;
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr mainTextureGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.mainTexture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool mainTextureSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				obj.mainTexture = (UnityEngine.Texture)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr mainTextureOffsetGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector2.ToJsObject(context, obj.mainTextureOffset);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool mainTextureOffsetSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				obj.mainTextureOffset = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr mainTextureScaleGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector2.ToJsObject(context, obj.mainTextureScale);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool mainTextureScaleSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				obj.mainTextureScale = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr passCountGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.passCount));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr renderQueueGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.renderQueue));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool renderQueueSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				obj.renderQueue = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr shaderKeywordsGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.shaderKeywords);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool shaderKeywordsSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				obj.shaderKeywords = ToCsObjects.ToArray<string>(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr globalIlluminationFlagsGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.globalIlluminationFlags));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool globalIlluminationFlagsSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				obj.globalIlluminationFlags = (UnityEngine.MaterialGlobalIlluminationFlags)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr enableInstancingGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.enableInstancing);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool enableInstancingSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				obj.enableInstancing = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr doubleSidedGIGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.doubleSidedGI);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool doubleSidedGISetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Material)ToCsObjects.ToCsObject(context, thisObj));
				obj.doubleSidedGI = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Material);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "shader", shaderGetter, shaderSetter);
			Native.jvm_reg_property(env, "color", colorGetter, colorSetter);
			Native.jvm_reg_property(env, "mainTexture", mainTextureGetter, mainTextureSetter);
			Native.jvm_reg_property(env, "mainTextureOffset", mainTextureOffsetGetter, mainTextureOffsetSetter);
			Native.jvm_reg_property(env, "mainTextureScale", mainTextureScaleGetter, mainTextureScaleSetter);
			Native.jvm_reg_property(env, "passCount", passCountGetter, null);
			Native.jvm_reg_property(env, "renderQueue", renderQueueGetter, renderQueueSetter);
			Native.jvm_reg_property(env, "shaderKeywords", shaderKeywordsGetter, shaderKeywordsSetter);
			Native.jvm_reg_property(env, "globalIlluminationFlags", globalIlluminationFlagsGetter, globalIlluminationFlagsSetter);
			Native.jvm_reg_property(env, "enableInstancing", enableInstancingGetter, enableInstancingSetter);
			Native.jvm_reg_property(env, "doubleSidedGI", doubleSidedGIGetter, doubleSidedGISetter);
			Native.jvm_reg_function(env, "HasProperty", HasProperty);
			Native.jvm_reg_function(env, "GetTag", GetTag);
			Native.jvm_reg_function(env, "SetOverrideTag", SetOverrideTag);
			Native.jvm_reg_function(env, "SetShaderPassEnabled", SetShaderPassEnabled);
			Native.jvm_reg_function(env, "GetShaderPassEnabled", GetShaderPassEnabled);
			Native.jvm_reg_function(env, "Lerp", Lerp);
			Native.jvm_reg_function(env, "SetPass", SetPass);
			Native.jvm_reg_function(env, "GetPassName", GetPassName);
			Native.jvm_reg_function(env, "FindPass", FindPass);
			Native.jvm_reg_function(env, "CopyPropertiesFromMaterial", CopyPropertiesFromMaterial);
			Native.jvm_reg_function(env, "EnableKeyword", EnableKeyword);
			Native.jvm_reg_function(env, "DisableKeyword", DisableKeyword);
			Native.jvm_reg_function(env, "IsKeywordEnabled", IsKeywordEnabled);
			Native.jvm_reg_function(env, "SetFloat", SetFloat);
			Native.jvm_reg_function(env, "SetInt", SetInt);
			Native.jvm_reg_function(env, "SetColor", SetColor);
			Native.jvm_reg_function(env, "SetVector", SetVector);
			Native.jvm_reg_function(env, "SetMatrix", SetMatrix);
			Native.jvm_reg_function(env, "SetTexture", SetTexture);
			Native.jvm_reg_function(env, "SetBuffer", SetBuffer);
			Native.jvm_reg_function(env, "SetTextureOffset", SetTextureOffset);
			Native.jvm_reg_function(env, "SetTextureScale", SetTextureScale);
			Native.jvm_reg_function(env, "SetFloatArray", SetFloatArray);
			Native.jvm_reg_function(env, "SetColorArray", SetColorArray);
			Native.jvm_reg_function(env, "SetVectorArray", SetVectorArray);
			Native.jvm_reg_function(env, "SetMatrixArray", SetMatrixArray);
			Native.jvm_reg_function(env, "GetFloat", GetFloat);
			Native.jvm_reg_function(env, "GetInt", GetInt);
			Native.jvm_reg_function(env, "GetColor", GetColor);
			Native.jvm_reg_function(env, "GetVector", GetVector);
			Native.jvm_reg_function(env, "GetMatrix", GetMatrix);
			Native.jvm_reg_function(env, "GetFloatArray", GetFloatArray);
			Native.jvm_reg_function(env, "GetVectorArray", GetVectorArray);
			Native.jvm_reg_function(env, "GetColorArray", GetColorArray);
			Native.jvm_reg_function(env, "GetMatrixArray", GetMatrixArray);
			Native.jvm_reg_function(env, "GetTexture", GetTexture);
			Native.jvm_reg_function(env, "GetTextureOffset", GetTextureOffset);
			Native.jvm_reg_function(env, "GetTextureScale", GetTextureScale);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Material", ObjectWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Material), jsClass);
		}
	}
}
