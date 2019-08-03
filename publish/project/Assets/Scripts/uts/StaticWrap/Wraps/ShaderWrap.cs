using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ShaderWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnityEngine.Shader();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Find_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.Shader.Find(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr EnableKeyword_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				UnityEngine.Shader.EnableKeyword(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DisableKeyword_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				UnityEngine.Shader.DisableKeyword(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsKeywordEnabled_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.Shader.IsKeywordEnabled(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetGlobalBuffer_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.ComputeBuffer))) {
					var p0 = (int)(double)vp0;
					var p1 = (UnityEngine.ComputeBuffer)vp1;
					UnityEngine.Shader.SetGlobalBuffer(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.ComputeBuffer))) {
					var p0 = (string)vp0;
					var p1 = (UnityEngine.ComputeBuffer)vp1;
					UnityEngine.Shader.SetGlobalBuffer(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr PropertyToID_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.Shader.PropertyToID(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WarmupAllShaders_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.Shader.WarmupAllShaders();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetGlobalFloat_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float))) {
					var p0 = (string)vp0;
					var p1 = (float)(double)vp1;
					UnityEngine.Shader.SetGlobalFloat(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float))) {
					var p0 = (int)(double)vp0;
					var p1 = (float)(double)vp1;
					UnityEngine.Shader.SetGlobalFloat(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetGlobalInt_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(int))) {
					var p0 = (string)vp0;
					var p1 = (int)(double)vp1;
					UnityEngine.Shader.SetGlobalInt(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(int))) {
					var p0 = (int)(double)vp0;
					var p1 = (int)(double)vp1;
					UnityEngine.Shader.SetGlobalInt(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetGlobalVector_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Vector4>))) {
					var p0 = (string)vp0;
					var p1 = (Agent<UnityEngine.Vector4>)vp1;
					UnityEngine.Shader.SetGlobalVector(p0, p1.target);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Vector4>))) {
					var p0 = (int)(double)vp0;
					var p1 = (Agent<UnityEngine.Vector4>)vp1;
					UnityEngine.Shader.SetGlobalVector(p0, p1.target);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetGlobalColor_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Color>))) {
					var p0 = (string)vp0;
					var p1 = (Agent<UnityEngine.Color>)vp1;
					UnityEngine.Shader.SetGlobalColor(p0, p1.target);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Color>))) {
					var p0 = (int)(double)vp0;
					var p1 = (Agent<UnityEngine.Color>)vp1;
					UnityEngine.Shader.SetGlobalColor(p0, p1.target);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetGlobalMatrix_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4))) {
					var p0 = (string)vp0;
					var p1 = (UnityEngine.Matrix4x4)vp1;
					UnityEngine.Shader.SetGlobalMatrix(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4))) {
					var p0 = (int)(double)vp0;
					var p1 = (UnityEngine.Matrix4x4)vp1;
					UnityEngine.Shader.SetGlobalMatrix(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetGlobalTexture_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Texture))) {
					var p0 = (string)vp0;
					var p1 = (UnityEngine.Texture)vp1;
					UnityEngine.Shader.SetGlobalTexture(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Texture))) {
					var p0 = (int)(double)vp0;
					var p1 = (UnityEngine.Texture)vp1;
					UnityEngine.Shader.SetGlobalTexture(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetGlobalFloatArray_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToList<float>(vp1);
					UnityEngine.Shader.SetGlobalFloatArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToList<float>(vp1);
					UnityEngine.Shader.SetGlobalFloatArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToArray<float>(vp1);
					UnityEngine.Shader.SetGlobalFloatArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToArray<float>(vp1);
					UnityEngine.Shader.SetGlobalFloatArray(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetGlobalVectorArray_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector4[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToList<UnityEngine.Vector4>(vp1);
					UnityEngine.Shader.SetGlobalVectorArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector4[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToList<UnityEngine.Vector4>(vp1);
					UnityEngine.Shader.SetGlobalVectorArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Vector4>[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToArray<UnityEngine.Vector4>(vp1);
					UnityEngine.Shader.SetGlobalVectorArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Vector4>[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToArray<UnityEngine.Vector4>(vp1);
					UnityEngine.Shader.SetGlobalVectorArray(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetGlobalMatrixArray_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp1);
					UnityEngine.Shader.SetGlobalMatrixArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp1);
					UnityEngine.Shader.SetGlobalMatrixArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
					var p0 = (string)vp0;
					var p1 = ToCsObjects.ToArray<UnityEngine.Matrix4x4>(vp1);
					UnityEngine.Shader.SetGlobalMatrixArray(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
					var p0 = (int)(double)vp0;
					var p1 = ToCsObjects.ToArray<UnityEngine.Matrix4x4>(vp1);
					UnityEngine.Shader.SetGlobalMatrixArray(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGlobalFloat_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = UnityEngine.Shader.GetGlobalFloat(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = UnityEngine.Shader.GetGlobalFloat(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGlobalInt_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = UnityEngine.Shader.GetGlobalInt(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = UnityEngine.Shader.GetGlobalInt(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGlobalVector_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = new Agent<UnityEngine.Vector4>(UnityEngine.Shader.GetGlobalVector(p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = new Agent<UnityEngine.Vector4>(UnityEngine.Shader.GetGlobalVector(p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGlobalColor_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = new Agent<UnityEngine.Color>(UnityEngine.Shader.GetGlobalColor(p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = new Agent<UnityEngine.Color>(UnityEngine.Shader.GetGlobalColor(p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGlobalMatrix_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = UnityEngine.Shader.GetGlobalMatrix(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = UnityEngine.Shader.GetGlobalMatrix(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGlobalTexture_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = UnityEngine.Shader.GetGlobalTexture(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = UnityEngine.Shader.GetGlobalTexture(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGlobalFloatArray_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
						var p0 = (string)vp0;
						var p1 = ToCsObjects.ToList<float>(vp1);
						UnityEngine.Shader.GetGlobalFloatArray(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float[]))) {
						var p0 = (int)(double)vp0;
						var p1 = ToCsObjects.ToList<float>(vp1);
						UnityEngine.Shader.GetGlobalFloatArray(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						var ret = UnityEngine.Shader.GetGlobalFloatArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(int))) {
						var p0 = (int)(double)vp0;
						var ret = UnityEngine.Shader.GetGlobalFloatArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGlobalVectorArray_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector4[]))) {
						var p0 = (string)vp0;
						var p1 = ToCsObjects.ToList<UnityEngine.Vector4>(vp1);
						UnityEngine.Shader.GetGlobalVectorArray(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector4[]))) {
						var p0 = (int)(double)vp0;
						var p1 = ToCsObjects.ToList<UnityEngine.Vector4>(vp1);
						UnityEngine.Shader.GetGlobalVectorArray(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						var ret = UnityEngine.Shader.GetGlobalVectorArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(int))) {
						var p0 = (int)(double)vp0;
						var ret = UnityEngine.Shader.GetGlobalVectorArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGlobalMatrixArray_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
						var p0 = (string)vp0;
						var p1 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp1);
						UnityEngine.Shader.GetGlobalMatrixArray(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4[]))) {
						var p0 = (int)(double)vp0;
						var p1 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp1);
						UnityEngine.Shader.GetGlobalMatrixArray(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						var ret = UnityEngine.Shader.GetGlobalMatrixArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(int))) {
						var p0 = (int)(double)vp0;
						var ret = UnityEngine.Shader.GetGlobalMatrixArray(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr isSupportedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Shader)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.isSupported);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr maximumLODGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Shader)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.maximumLOD));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool maximumLODSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Shader)ToCsObjects.ToCsObject(context, thisObj));
				obj.maximumLOD = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr globalMaximumLODGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(UnityEngine.Shader.globalMaximumLOD));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr globalMaximumLODSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.Shader.globalMaximumLOD = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr globalRenderPipelineGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_string(context, UnityEngine.Shader.globalRenderPipeline);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr globalRenderPipelineSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.Shader.globalRenderPipeline = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr renderQueueGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Shader)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.renderQueue));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Shader);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "isSupported", isSupportedGetter, null);
			Native.jvm_reg_property(env, "maximumLOD", maximumLODGetter, maximumLODSetter);
			Native.jvm_reg_static_property(env, "globalMaximumLOD", globalMaximumLODGetter_S, globalMaximumLODSetter_S);
			Native.jvm_reg_static_property(env, "globalRenderPipeline", globalRenderPipelineGetter_S, globalRenderPipelineSetter_S);
			Native.jvm_reg_property(env, "renderQueue", renderQueueGetter, null);
			Native.jvm_reg_static_function(env, "Find", Find_S);
			Native.jvm_reg_static_function(env, "EnableKeyword", EnableKeyword_S);
			Native.jvm_reg_static_function(env, "DisableKeyword", DisableKeyword_S);
			Native.jvm_reg_static_function(env, "IsKeywordEnabled", IsKeywordEnabled_S);
			Native.jvm_reg_static_function(env, "SetGlobalBuffer", SetGlobalBuffer_S);
			Native.jvm_reg_static_function(env, "PropertyToID", PropertyToID_S);
			Native.jvm_reg_static_function(env, "WarmupAllShaders", WarmupAllShaders_S);
			Native.jvm_reg_static_function(env, "SetGlobalFloat", SetGlobalFloat_S);
			Native.jvm_reg_static_function(env, "SetGlobalInt", SetGlobalInt_S);
			Native.jvm_reg_static_function(env, "SetGlobalVector", SetGlobalVector_S);
			Native.jvm_reg_static_function(env, "SetGlobalColor", SetGlobalColor_S);
			Native.jvm_reg_static_function(env, "SetGlobalMatrix", SetGlobalMatrix_S);
			Native.jvm_reg_static_function(env, "SetGlobalTexture", SetGlobalTexture_S);
			Native.jvm_reg_static_function(env, "SetGlobalFloatArray", SetGlobalFloatArray_S);
			Native.jvm_reg_static_function(env, "SetGlobalVectorArray", SetGlobalVectorArray_S);
			Native.jvm_reg_static_function(env, "SetGlobalMatrixArray", SetGlobalMatrixArray_S);
			Native.jvm_reg_static_function(env, "GetGlobalFloat", GetGlobalFloat_S);
			Native.jvm_reg_static_function(env, "GetGlobalInt", GetGlobalInt_S);
			Native.jvm_reg_static_function(env, "GetGlobalVector", GetGlobalVector_S);
			Native.jvm_reg_static_function(env, "GetGlobalColor", GetGlobalColor_S);
			Native.jvm_reg_static_function(env, "GetGlobalMatrix", GetGlobalMatrix_S);
			Native.jvm_reg_static_function(env, "GetGlobalTexture", GetGlobalTexture_S);
			Native.jvm_reg_static_function(env, "GetGlobalFloatArray", GetGlobalFloatArray_S);
			Native.jvm_reg_static_function(env, "GetGlobalVectorArray", GetGlobalVectorArray_S);
			Native.jvm_reg_static_function(env, "GetGlobalMatrixArray", GetGlobalMatrixArray_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Shader", ObjectWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Shader), jsClass);
		}
	}
}
