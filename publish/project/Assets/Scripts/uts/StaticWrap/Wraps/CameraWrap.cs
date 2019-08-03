using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class CameraWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnityEngine.Camera();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetTargetBuffers(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderBuffer)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.RenderBuffer))) {
					var p0 = (UnityEngine.RenderBuffer)vp0;
					var p1 = (UnityEngine.RenderBuffer)vp1;
					obj.SetTargetBuffers(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderBuffer[])) && Uts.Core.CompareType(vp1, typeof(UnityEngine.RenderBuffer))) {
					var p0 = ToCsObjects.ToArray<UnityEngine.RenderBuffer>(vp0);
					var p1 = (UnityEngine.RenderBuffer)vp1;
					obj.SetTargetBuffers(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ResetWorldToCameraMatrix(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.ResetWorldToCameraMatrix();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ResetProjectionMatrix(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.ResetProjectionMatrix();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ResetAspect(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.ResetAspect();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetStereoViewMatrix(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Camera.StereoscopicEye)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetStereoViewMatrix(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetStereoViewMatrix(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Camera.StereoscopicEye)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Matrix4x4)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				obj.SetStereoViewMatrix(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ResetStereoViewMatrices(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.ResetStereoViewMatrices();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetStereoProjectionMatrix(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Camera.StereoscopicEye)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetStereoProjectionMatrix(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetStereoProjectionMatrix(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Camera.StereoscopicEye)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Matrix4x4)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				obj.SetStereoProjectionMatrix(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CalculateFrustumCorners(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (UnityEngine.Camera.MonoOrStereoscopicEye)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var p3 = ToCsObjects.ToArray<UnityEngine.Vector3>(context, Native.jvm_get_arg(args, 3));
				obj.CalculateFrustumCorners(p0.target, p1, p2, p3);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ResetStereoProjectionMatrices(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.ResetStereoProjectionMatrices();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ResetTransparencySortSettings(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.ResetTransparencySortSettings();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WorldToScreenPoint(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.WorldToScreenPoint(p0);
				return JsStructs.vector3.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WorldToViewportPoint(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.WorldToViewportPoint(p0);
				return JsStructs.vector3.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ViewportToWorldPoint(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.ViewportToWorldPoint(p0);
				return JsStructs.vector3.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ScreenToWorldPoint(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.ScreenToWorldPoint(p0);
				return JsStructs.vector3.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ScreenToViewportPoint(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.ScreenToViewportPoint(p0);
				return JsStructs.vector3.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ViewportToScreenPoint(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.ViewportToScreenPoint(p0);
				return JsStructs.vector3.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ViewportPointToRay(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.ViewportPointToRay(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ScreenPointToRay(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.ScreenPointToRay(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetAllCameras_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = ToCsObjects.ToArray<UnityEngine.Camera>(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.Camera.GetAllCameras(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Render(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.Render();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RenderWithShader(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Shader)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				obj.RenderWithShader(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetReplacementShader(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Shader)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				obj.SetReplacementShader(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ResetReplacementShader(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.ResetReplacementShader();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ResetCullingMatrix(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.ResetCullingMatrix();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RenderDontRestore(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.RenderDontRestore();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetupCurrent_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Camera)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				UnityEngine.Camera.SetupCurrent(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RenderToCubemap(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Cubemap))) {
						var p0 = (UnityEngine.Cubemap)vp0;
						var ret = obj.RenderToCubemap(p0);
						return Native.jvm_make_boolean(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderTexture))) {
						var p0 = (UnityEngine.RenderTexture)vp0;
						var ret = obj.RenderToCubemap(p0);
						return Native.jvm_make_boolean(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Cubemap)) && Uts.Core.CompareType(vp1, typeof(int))) {
						var p0 = (UnityEngine.Cubemap)vp0;
						var p1 = (int)(double)vp1;
						var ret = obj.RenderToCubemap(p0, p1);
						return Native.jvm_make_boolean(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderTexture)) && Uts.Core.CompareType(vp1, typeof(int))) {
						var p0 = (UnityEngine.RenderTexture)vp0;
						var p1 = (int)(double)vp1;
						var ret = obj.RenderToCubemap(p0, p1);
						return Native.jvm_make_boolean(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CopyFrom(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Camera)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.CopyFrom(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr AddCommandBuffer(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Rendering.CameraEvent)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Rendering.CommandBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				obj.AddCommandBuffer(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RemoveCommandBuffer(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Rendering.CameraEvent)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Rendering.CommandBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				obj.RemoveCommandBuffer(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RemoveCommandBuffers(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Rendering.CameraEvent)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.RemoveCommandBuffers(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RemoveAllCommandBuffers(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.RemoveAllCommandBuffers();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetCommandBuffers(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Rendering.CameraEvent)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetCommandBuffers(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CalculateObliqueMatrix(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.CalculateObliqueMatrix(p0.target);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onPreCullGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.Camera.onPreCull);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onPreCullSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.Camera.onPreCull = (UnityEngine.Camera.CameraCallback)Uts.DelegateUtil.CreateDelegate<UnityEngine.Camera, UnityEngine.Camera.CameraCallback>(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onPreRenderGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.Camera.onPreRender);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onPreRenderSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.Camera.onPreRender = (UnityEngine.Camera.CameraCallback)Uts.DelegateUtil.CreateDelegate<UnityEngine.Camera, UnityEngine.Camera.CameraCallback>(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onPostRenderGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.Camera.onPostRender);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onPostRenderSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.Camera.onPostRender = (UnityEngine.Camera.CameraCallback)Uts.DelegateUtil.CreateDelegate<UnityEngine.Camera, UnityEngine.Camera.CameraCallback>(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr fieldOfViewGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.fieldOfView));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool fieldOfViewSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.fieldOfView = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr nearClipPlaneGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.nearClipPlane));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool nearClipPlaneSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.nearClipPlane = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr farClipPlaneGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.farClipPlane));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool farClipPlaneSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.farClipPlane = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr renderingPathGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.renderingPath));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool renderingPathSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.renderingPath = (UnityEngine.RenderingPath)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr actualRenderingPathGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.actualRenderingPath));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr allowHDRGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.allowHDR);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool allowHDRSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.allowHDR = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr forceIntoRenderTextureGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.forceIntoRenderTexture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool forceIntoRenderTextureSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.forceIntoRenderTexture = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr allowMSAAGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.allowMSAA);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool allowMSAASetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.allowMSAA = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr orthographicSizeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.orthographicSize));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool orthographicSizeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.orthographicSize = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr orthographicGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.orthographic);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool orthographicSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.orthographic = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr opaqueSortModeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.opaqueSortMode));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool opaqueSortModeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.opaqueSortMode = (UnityEngine.Rendering.OpaqueSortMode)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr transparencySortModeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.transparencySortMode));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool transparencySortModeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.transparencySortMode = (UnityEngine.TransparencySortMode)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr transparencySortAxisGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.transparencySortAxis);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool transparencySortAxisSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.transparencySortAxis = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr depthGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.depth));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool depthSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.depth = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr aspectGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.aspect));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool aspectSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.aspect = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr cullingMaskGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.cullingMask));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool cullingMaskSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.cullingMask = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr eventMaskGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.eventMask));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool eventMaskSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.eventMask = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr backgroundColorGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(obj.backgroundColor));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool backgroundColorSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.backgroundColor = ((Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, arg)).target;
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr rectGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Rect>(context, new Agent<UnityEngine.Rect>(obj.rect));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool rectSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.rect = ((Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, arg)).target;
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr pixelRectGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Rect>(context, new Agent<UnityEngine.Rect>(obj.pixelRect));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool pixelRectSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.pixelRect = ((Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, arg)).target;
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr targetTextureGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.targetTexture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool targetTextureSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.targetTexture = (UnityEngine.RenderTexture)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr activeTextureGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.activeTexture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr pixelWidthGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.pixelWidth));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr pixelHeightGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.pixelHeight));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr cameraToWorldMatrixGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.cameraToWorldMatrix);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr worldToCameraMatrixGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.worldToCameraMatrix);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool worldToCameraMatrixSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.worldToCameraMatrix = (UnityEngine.Matrix4x4)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr projectionMatrixGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.projectionMatrix);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool projectionMatrixSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.projectionMatrix = (UnityEngine.Matrix4x4)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr nonJitteredProjectionMatrixGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.nonJitteredProjectionMatrix);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool nonJitteredProjectionMatrixSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.nonJitteredProjectionMatrix = (UnityEngine.Matrix4x4)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr useJitteredProjectionMatrixForTransparentRenderingGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.useJitteredProjectionMatrixForTransparentRendering);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool useJitteredProjectionMatrixForTransparentRenderingSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.useJitteredProjectionMatrixForTransparentRendering = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr velocityGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.velocity);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr clearFlagsGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.clearFlags));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool clearFlagsSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.clearFlags = (UnityEngine.CameraClearFlags)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr stereoEnabledGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.stereoEnabled);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr stereoSeparationGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.stereoSeparation));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool stereoSeparationSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.stereoSeparation = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr stereoConvergenceGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.stereoConvergence));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool stereoConvergenceSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.stereoConvergence = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr cameraTypeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.cameraType));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool cameraTypeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.cameraType = (UnityEngine.CameraType)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr stereoMirrorModeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.stereoMirrorMode);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool stereoMirrorModeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.stereoMirrorMode = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr stereoTargetEyeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.stereoTargetEye));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool stereoTargetEyeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.stereoTargetEye = (UnityEngine.StereoTargetEyeMask)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr stereoActiveEyeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.stereoActiveEye));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr targetDisplayGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.targetDisplay));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool targetDisplaySetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.targetDisplay = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr mainGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.Camera.main);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr currentGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.Camera.current);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr allCamerasGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.Camera.allCameras);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr allCamerasCountGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(UnityEngine.Camera.allCamerasCount));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr useOcclusionCullingGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.useOcclusionCulling);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool useOcclusionCullingSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.useOcclusionCulling = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr cullingMatrixGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.cullingMatrix);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool cullingMatrixSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.cullingMatrix = (UnityEngine.Matrix4x4)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr layerCullDistancesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.layerCullDistances);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool layerCullDistancesSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.layerCullDistances = ToCsObjects.ToArray<float>(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr layerCullSphericalGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.layerCullSpherical);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool layerCullSphericalSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.layerCullSpherical = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr depthTextureModeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.depthTextureMode));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool depthTextureModeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.depthTextureMode = (UnityEngine.DepthTextureMode)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr clearStencilAfterLightingPassGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.clearStencilAfterLightingPass);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool clearStencilAfterLightingPassSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				obj.clearStencilAfterLightingPass = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr commandBufferCountGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Camera)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.commandBufferCount));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Camera);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "onPreCull", onPreCullGetter_S, onPreCullSetter_S);
			Native.jvm_reg_static_property(env, "onPreRender", onPreRenderGetter_S, onPreRenderSetter_S);
			Native.jvm_reg_static_property(env, "onPostRender", onPostRenderGetter_S, onPostRenderSetter_S);
			Native.jvm_reg_property(env, "fieldOfView", fieldOfViewGetter, fieldOfViewSetter);
			Native.jvm_reg_property(env, "nearClipPlane", nearClipPlaneGetter, nearClipPlaneSetter);
			Native.jvm_reg_property(env, "farClipPlane", farClipPlaneGetter, farClipPlaneSetter);
			Native.jvm_reg_property(env, "renderingPath", renderingPathGetter, renderingPathSetter);
			Native.jvm_reg_property(env, "actualRenderingPath", actualRenderingPathGetter, null);
			Native.jvm_reg_property(env, "allowHDR", allowHDRGetter, allowHDRSetter);
			Native.jvm_reg_property(env, "forceIntoRenderTexture", forceIntoRenderTextureGetter, forceIntoRenderTextureSetter);
			Native.jvm_reg_property(env, "allowMSAA", allowMSAAGetter, allowMSAASetter);
			Native.jvm_reg_property(env, "orthographicSize", orthographicSizeGetter, orthographicSizeSetter);
			Native.jvm_reg_property(env, "orthographic", orthographicGetter, orthographicSetter);
			Native.jvm_reg_property(env, "opaqueSortMode", opaqueSortModeGetter, opaqueSortModeSetter);
			Native.jvm_reg_property(env, "transparencySortMode", transparencySortModeGetter, transparencySortModeSetter);
			Native.jvm_reg_property(env, "transparencySortAxis", transparencySortAxisGetter, transparencySortAxisSetter);
			Native.jvm_reg_property(env, "depth", depthGetter, depthSetter);
			Native.jvm_reg_property(env, "aspect", aspectGetter, aspectSetter);
			Native.jvm_reg_property(env, "cullingMask", cullingMaskGetter, cullingMaskSetter);
			Native.jvm_reg_property(env, "eventMask", eventMaskGetter, eventMaskSetter);
			Native.jvm_reg_property(env, "backgroundColor", backgroundColorGetter, backgroundColorSetter);
			Native.jvm_reg_property(env, "rect", rectGetter, rectSetter);
			Native.jvm_reg_property(env, "pixelRect", pixelRectGetter, pixelRectSetter);
			Native.jvm_reg_property(env, "targetTexture", targetTextureGetter, targetTextureSetter);
			Native.jvm_reg_property(env, "activeTexture", activeTextureGetter, null);
			Native.jvm_reg_property(env, "pixelWidth", pixelWidthGetter, null);
			Native.jvm_reg_property(env, "pixelHeight", pixelHeightGetter, null);
			Native.jvm_reg_property(env, "cameraToWorldMatrix", cameraToWorldMatrixGetter, null);
			Native.jvm_reg_property(env, "worldToCameraMatrix", worldToCameraMatrixGetter, worldToCameraMatrixSetter);
			Native.jvm_reg_property(env, "projectionMatrix", projectionMatrixGetter, projectionMatrixSetter);
			Native.jvm_reg_property(env, "nonJitteredProjectionMatrix", nonJitteredProjectionMatrixGetter, nonJitteredProjectionMatrixSetter);
			Native.jvm_reg_property(env, "useJitteredProjectionMatrixForTransparentRendering", useJitteredProjectionMatrixForTransparentRenderingGetter, useJitteredProjectionMatrixForTransparentRenderingSetter);
			Native.jvm_reg_property(env, "velocity", velocityGetter, null);
			Native.jvm_reg_property(env, "clearFlags", clearFlagsGetter, clearFlagsSetter);
			Native.jvm_reg_property(env, "stereoEnabled", stereoEnabledGetter, null);
			Native.jvm_reg_property(env, "stereoSeparation", stereoSeparationGetter, stereoSeparationSetter);
			Native.jvm_reg_property(env, "stereoConvergence", stereoConvergenceGetter, stereoConvergenceSetter);
			Native.jvm_reg_property(env, "cameraType", cameraTypeGetter, cameraTypeSetter);
			Native.jvm_reg_property(env, "stereoMirrorMode", stereoMirrorModeGetter, stereoMirrorModeSetter);
			Native.jvm_reg_property(env, "stereoTargetEye", stereoTargetEyeGetter, stereoTargetEyeSetter);
			Native.jvm_reg_property(env, "stereoActiveEye", stereoActiveEyeGetter, null);
			Native.jvm_reg_property(env, "targetDisplay", targetDisplayGetter, targetDisplaySetter);
			Native.jvm_reg_static_property(env, "main", mainGetter_S, null);
			Native.jvm_reg_static_property(env, "current", currentGetter_S, null);
			Native.jvm_reg_static_property(env, "allCameras", allCamerasGetter_S, null);
			Native.jvm_reg_static_property(env, "allCamerasCount", allCamerasCountGetter_S, null);
			Native.jvm_reg_property(env, "useOcclusionCulling", useOcclusionCullingGetter, useOcclusionCullingSetter);
			Native.jvm_reg_property(env, "cullingMatrix", cullingMatrixGetter, cullingMatrixSetter);
			Native.jvm_reg_property(env, "layerCullDistances", layerCullDistancesGetter, layerCullDistancesSetter);
			Native.jvm_reg_property(env, "layerCullSpherical", layerCullSphericalGetter, layerCullSphericalSetter);
			Native.jvm_reg_property(env, "depthTextureMode", depthTextureModeGetter, depthTextureModeSetter);
			Native.jvm_reg_property(env, "clearStencilAfterLightingPass", clearStencilAfterLightingPassGetter, clearStencilAfterLightingPassSetter);
			Native.jvm_reg_property(env, "commandBufferCount", commandBufferCountGetter, null);
			Native.jvm_reg_function(env, "SetTargetBuffers", SetTargetBuffers);
			Native.jvm_reg_function(env, "ResetWorldToCameraMatrix", ResetWorldToCameraMatrix);
			Native.jvm_reg_function(env, "ResetProjectionMatrix", ResetProjectionMatrix);
			Native.jvm_reg_function(env, "ResetAspect", ResetAspect);
			Native.jvm_reg_function(env, "GetStereoViewMatrix", GetStereoViewMatrix);
			Native.jvm_reg_function(env, "SetStereoViewMatrix", SetStereoViewMatrix);
			Native.jvm_reg_function(env, "ResetStereoViewMatrices", ResetStereoViewMatrices);
			Native.jvm_reg_function(env, "GetStereoProjectionMatrix", GetStereoProjectionMatrix);
			Native.jvm_reg_function(env, "SetStereoProjectionMatrix", SetStereoProjectionMatrix);
			Native.jvm_reg_function(env, "CalculateFrustumCorners", CalculateFrustumCorners);
			Native.jvm_reg_function(env, "ResetStereoProjectionMatrices", ResetStereoProjectionMatrices);
			Native.jvm_reg_function(env, "ResetTransparencySortSettings", ResetTransparencySortSettings);
			Native.jvm_reg_function(env, "WorldToScreenPoint", WorldToScreenPoint);
			Native.jvm_reg_function(env, "WorldToViewportPoint", WorldToViewportPoint);
			Native.jvm_reg_function(env, "ViewportToWorldPoint", ViewportToWorldPoint);
			Native.jvm_reg_function(env, "ScreenToWorldPoint", ScreenToWorldPoint);
			Native.jvm_reg_function(env, "ScreenToViewportPoint", ScreenToViewportPoint);
			Native.jvm_reg_function(env, "ViewportToScreenPoint", ViewportToScreenPoint);
			Native.jvm_reg_function(env, "ViewportPointToRay", ViewportPointToRay);
			Native.jvm_reg_function(env, "ScreenPointToRay", ScreenPointToRay);
			Native.jvm_reg_static_function(env, "GetAllCameras", GetAllCameras_S);
			Native.jvm_reg_function(env, "Render", Render);
			Native.jvm_reg_function(env, "RenderWithShader", RenderWithShader);
			Native.jvm_reg_function(env, "SetReplacementShader", SetReplacementShader);
			Native.jvm_reg_function(env, "ResetReplacementShader", ResetReplacementShader);
			Native.jvm_reg_function(env, "ResetCullingMatrix", ResetCullingMatrix);
			Native.jvm_reg_function(env, "RenderDontRestore", RenderDontRestore);
			Native.jvm_reg_static_function(env, "SetupCurrent", SetupCurrent_S);
			Native.jvm_reg_function(env, "RenderToCubemap", RenderToCubemap);
			Native.jvm_reg_function(env, "CopyFrom", CopyFrom);
			Native.jvm_reg_function(env, "AddCommandBuffer", AddCommandBuffer);
			Native.jvm_reg_function(env, "RemoveCommandBuffer", RemoveCommandBuffer);
			Native.jvm_reg_function(env, "RemoveCommandBuffers", RemoveCommandBuffers);
			Native.jvm_reg_function(env, "RemoveAllCommandBuffers", RemoveAllCommandBuffers);
			Native.jvm_reg_function(env, "GetCommandBuffers", GetCommandBuffers);
			Native.jvm_reg_function(env, "CalculateObliqueMatrix", CalculateObliqueMatrix);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Camera", BehaviourWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Camera), jsClass);
		}
	}
}
