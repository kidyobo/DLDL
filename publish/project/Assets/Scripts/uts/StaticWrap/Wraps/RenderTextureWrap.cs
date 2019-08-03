using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class RenderTextureWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 5) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.RenderTextureFormat)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (UnityEngine.RenderTextureReadWrite)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var obj = new UnityEngine.RenderTexture(p0, p1, p2, p3, p4);
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else if (argcnt == 4) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.RenderTextureFormat)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var obj = new UnityEngine.RenderTexture(p0, p1, p2, p3);
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else if (argcnt == 3) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var obj = new UnityEngine.RenderTexture(p0, p1, p2);
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetTemporary_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 7) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.RenderTextureFormat)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (UnityEngine.RenderTextureReadWrite)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					var p6 = (UnityEngine.VRTextureUsage)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 6));
					var ret = UnityEngine.RenderTexture.GetTemporary(p0, p1, p2, p3, p4, p5, p6);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 6) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.RenderTextureFormat)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (UnityEngine.RenderTextureReadWrite)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					var ret = UnityEngine.RenderTexture.GetTemporary(p0, p1, p2, p3, p4, p5);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 5) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.RenderTextureFormat)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (UnityEngine.RenderTextureReadWrite)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var ret = UnityEngine.RenderTexture.GetTemporary(p0, p1, p2, p3, p4);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 4) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.RenderTextureFormat)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var ret = UnityEngine.RenderTexture.GetTemporary(p0, p1, p2, p3);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var ret = UnityEngine.RenderTexture.GetTemporary(p0, p1, p2);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var ret = UnityEngine.RenderTexture.GetTemporary(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReleaseTemporary_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.RenderTexture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				UnityEngine.RenderTexture.ReleaseTemporary(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Create(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.Create();
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Release(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.Release();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsCreated(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.IsCreated();
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DiscardContents(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					obj.DiscardContents();
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					obj.DiscardContents(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr MarkRestoreExpected(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.MarkRestoreExpected();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GenerateMips(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.GenerateMips();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetNativeDepthBufferPtr(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetNativeDepthBufferPtr();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetGlobalShaderProperty(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				obj.SetGlobalShaderProperty(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SupportsStencil_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.RenderTexture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.RenderTexture.SupportsStencil(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr widthGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.width));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool widthSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.width = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr heightGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.height));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool heightSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.height = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr depthGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.depth));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool depthSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.depth = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr isPowerOfTwoGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.isPowerOfTwo);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool isPowerOfTwoSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.isPowerOfTwo = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr sRGBGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.sRGB);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr formatGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.format));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool formatSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.format = (UnityEngine.RenderTextureFormat)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr useMipMapGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.useMipMap);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool useMipMapSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.useMipMap = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr autoGenerateMipsGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.autoGenerateMips);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool autoGenerateMipsSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.autoGenerateMips = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr dimensionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.dimension));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool dimensionSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.dimension = (UnityEngine.Rendering.TextureDimension)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr volumeDepthGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.volumeDepth));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool volumeDepthSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.volumeDepth = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr antiAliasingGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.antiAliasing));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool antiAliasingSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.antiAliasing = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr enableRandomWriteGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.enableRandomWrite);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool enableRandomWriteSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				obj.enableRandomWrite = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr colorBufferGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.colorBuffer);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr depthBufferGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.RenderTexture)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.depthBuffer);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr activeGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.RenderTexture.active);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr activeSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.RenderTexture.active = (UnityEngine.RenderTexture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.RenderTexture);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "width", widthGetter, widthSetter);
			Native.jvm_reg_property(env, "height", heightGetter, heightSetter);
			Native.jvm_reg_property(env, "depth", depthGetter, depthSetter);
			Native.jvm_reg_property(env, "isPowerOfTwo", isPowerOfTwoGetter, isPowerOfTwoSetter);
			Native.jvm_reg_property(env, "sRGB", sRGBGetter, null);
			Native.jvm_reg_property(env, "format", formatGetter, formatSetter);
			Native.jvm_reg_property(env, "useMipMap", useMipMapGetter, useMipMapSetter);
			Native.jvm_reg_property(env, "autoGenerateMips", autoGenerateMipsGetter, autoGenerateMipsSetter);
			Native.jvm_reg_property(env, "dimension", dimensionGetter, dimensionSetter);
			Native.jvm_reg_property(env, "volumeDepth", volumeDepthGetter, volumeDepthSetter);
			Native.jvm_reg_property(env, "antiAliasing", antiAliasingGetter, antiAliasingSetter);
			Native.jvm_reg_property(env, "enableRandomWrite", enableRandomWriteGetter, enableRandomWriteSetter);
			Native.jvm_reg_property(env, "colorBuffer", colorBufferGetter, null);
			Native.jvm_reg_property(env, "depthBuffer", depthBufferGetter, null);
			Native.jvm_reg_static_property(env, "active", activeGetter_S, activeSetter_S);
			Native.jvm_reg_static_function(env, "GetTemporary", GetTemporary_S);
			Native.jvm_reg_static_function(env, "ReleaseTemporary", ReleaseTemporary_S);
			Native.jvm_reg_function(env, "Create", Create);
			Native.jvm_reg_function(env, "Release", Release);
			Native.jvm_reg_function(env, "IsCreated", IsCreated);
			Native.jvm_reg_function(env, "DiscardContents", DiscardContents);
			Native.jvm_reg_function(env, "MarkRestoreExpected", MarkRestoreExpected);
			Native.jvm_reg_function(env, "GenerateMips", GenerateMips);
			Native.jvm_reg_function(env, "GetNativeDepthBufferPtr", GetNativeDepthBufferPtr);
			Native.jvm_reg_function(env, "SetGlobalShaderProperty", SetGlobalShaderProperty);
			Native.jvm_reg_static_function(env, "SupportsStencil", SupportsStencil_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "RenderTexture", TextureWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.RenderTexture), jsClass);
		}
	}
}
