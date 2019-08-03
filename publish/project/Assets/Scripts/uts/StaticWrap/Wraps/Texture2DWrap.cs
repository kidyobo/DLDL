using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class Texture2DWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var obj = new UnityEngine.Texture2D(p0, p1);
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else if (argcnt == 4) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.TextureFormat)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 3));
					var obj = new UnityEngine.Texture2D(p0, p1, p2, p3);
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else if (argcnt == 5) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.TextureFormat)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 3));
					var p4 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 4));
					var obj = new UnityEngine.Texture2D(p0, p1, p2, p3, p4);
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CreateExternalTexture_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (UnityEngine.TextureFormat)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var p3 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 3));
				var p4 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 4));
				var p5 = (System.IntPtr)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 5));
				var ret = UnityEngine.Texture2D.CreateExternalTexture(p0, p1, p2, p3, p4, p5);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr UpdateExternalTexture(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.IntPtr)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.UpdateExternalTexture(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetPixel(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
				obj.SetPixel(p0, p1, p2.target);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetPixel(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Color>(obj.GetPixel(p0, p1));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetPixelBilinear(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Color>(obj.GetPixelBilinear(p0, p1));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetPixels(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = ToCsObjects.ToArray<UnityEngine.Color>(context, Native.jvm_get_arg(args, 0));
					obj.SetPixels(p0);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = ToCsObjects.ToArray<UnityEngine.Color>(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					obj.SetPixels(p0, p1);
					return IntPtr.Zero;
				} else if (argcnt == 6) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = ToCsObjects.ToArray<UnityEngine.Color>(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					obj.SetPixels(p0, p1, p2, p3, p4, p5);
					return IntPtr.Zero;
				} else if (argcnt == 5) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = ToCsObjects.ToArray<UnityEngine.Color>(context, Native.jvm_get_arg(args, 4));
					obj.SetPixels(p0, p1, p2, p3, p4);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetPixels32(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = ToCsObjects.ToArray<UnityEngine.Color32>(context, Native.jvm_get_arg(args, 0));
					obj.SetPixels32(p0);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = ToCsObjects.ToArray<UnityEngine.Color32>(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					obj.SetPixels32(p0, p1);
					return IntPtr.Zero;
				} else if (argcnt == 5) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = ToCsObjects.ToArray<UnityEngine.Color32>(context, Native.jvm_get_arg(args, 4));
					obj.SetPixels32(p0, p1, p2, p3, p4);
					return IntPtr.Zero;
				} else if (argcnt == 6) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = ToCsObjects.ToArray<UnityEngine.Color32>(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					obj.SetPixels32(p0, p1, p2, p3, p4, p5);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LoadImage(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 2) {
					var p0 = ToCsObjects.ToArray<byte>(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					var ret = obj.LoadImage(p0, p1);
					return Native.jvm_make_boolean(context, ret);
				} else if (argcnt == 1) {
					var p0 = ToCsObjects.ToArray<byte>(context, Native.jvm_get_arg(args, 0));
					var ret = obj.LoadImage(p0);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LoadRawTextureData(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = ToCsObjects.ToArray<byte>(context, Native.jvm_get_arg(args, 0));
					obj.LoadRawTextureData(p0);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = (System.IntPtr)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					obj.LoadRawTextureData(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetRawTextureData(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetRawTextureData();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetPixels(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					var ret = obj.GetPixels();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 1) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetPixels(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 5) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var ret = obj.GetPixels(p0, p1, p2, p3, p4);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 4) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var ret = obj.GetPixels(p0, p1, p2, p3);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetPixels32(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetPixels32(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 0) {
					var ret = obj.GetPixels32();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Apply(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 2) {
					var p0 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					obj.Apply(p0, p1);
					return IntPtr.Zero;
				} else if (argcnt == 1) {
					var p0 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 0));
					obj.Apply(p0);
					return IntPtr.Zero;
				} else if (argcnt == 0) {
					obj.Apply();
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Resize(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 4) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.TextureFormat)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 3));
					var ret = obj.Resize(p0, p1, p2, p3);
					return Native.jvm_make_boolean(context, ret);
				} else if (argcnt == 2) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var ret = obj.Resize(p0, p1);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Compress(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 0));
				obj.Compress(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr PackTextures(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 4) {
					var p0 = ToCsObjects.ToArray<UnityEngine.Texture2D>(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 3));
					var ret = obj.PackTextures(p0, p1, p2, p3);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = ToCsObjects.ToArray<UnityEngine.Texture2D>(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var ret = obj.PackTextures(p0, p1, p2);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = ToCsObjects.ToArray<UnityEngine.Texture2D>(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var ret = obj.PackTextures(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GenerateAtlas_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = ToCsObjects.ToArray<UnityEngine.Vector2>(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var p3 = ToCsObjects.ToList<UnityEngine.Rect>(context, Native.jvm_get_arg(args, 3));
				var ret = UnityEngine.Texture2D.GenerateAtlas(p0, p1, p2, p3);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadPixels(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 4) {
					var p0 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 3));
					obj.ReadPixels(p0.target, p1, p2, p3);
					return IntPtr.Zero;
				} else if (argcnt == 3) {
					var p0 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					obj.ReadPixels(p0.target, p1, p2);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr EncodeToPNG(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.EncodeToPNG();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr EncodeToJPG(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.EncodeToJPG(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 0) {
					var ret = obj.EncodeToJPG();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr EncodeToEXR(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (UnityEngine.Texture2D.EXRFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.EncodeToEXR(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 0) {
					var ret = obj.EncodeToEXR();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr mipmapCountGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.mipmapCount));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr formatGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Texture2D)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.format));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr whiteTextureGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.Texture2D.whiteTexture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr blackTextureGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.Texture2D.blackTexture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Texture2D);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "mipmapCount", mipmapCountGetter, null);
			Native.jvm_reg_property(env, "format", formatGetter, null);
			Native.jvm_reg_static_property(env, "whiteTexture", whiteTextureGetter_S, null);
			Native.jvm_reg_static_property(env, "blackTexture", blackTextureGetter_S, null);
			Native.jvm_reg_static_function(env, "CreateExternalTexture", CreateExternalTexture_S);
			Native.jvm_reg_function(env, "UpdateExternalTexture", UpdateExternalTexture);
			Native.jvm_reg_function(env, "SetPixel", SetPixel);
			Native.jvm_reg_function(env, "GetPixel", GetPixel);
			Native.jvm_reg_function(env, "GetPixelBilinear", GetPixelBilinear);
			Native.jvm_reg_function(env, "SetPixels", SetPixels);
			Native.jvm_reg_function(env, "SetPixels32", SetPixels32);
			Native.jvm_reg_function(env, "LoadImage", LoadImage);
			Native.jvm_reg_function(env, "LoadRawTextureData", LoadRawTextureData);
			Native.jvm_reg_function(env, "GetRawTextureData", GetRawTextureData);
			Native.jvm_reg_function(env, "GetPixels", GetPixels);
			Native.jvm_reg_function(env, "GetPixels32", GetPixels32);
			Native.jvm_reg_function(env, "Apply", Apply);
			Native.jvm_reg_function(env, "Resize", Resize);
			Native.jvm_reg_function(env, "Compress", Compress);
			Native.jvm_reg_function(env, "PackTextures", PackTextures);
			Native.jvm_reg_static_function(env, "GenerateAtlas", GenerateAtlas_S);
			Native.jvm_reg_function(env, "ReadPixels", ReadPixels);
			Native.jvm_reg_function(env, "EncodeToPNG", EncodeToPNG);
			Native.jvm_reg_function(env, "EncodeToJPG", EncodeToJPG);
			Native.jvm_reg_function(env, "EncodeToEXR", EncodeToEXR);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Texture2D", TextureWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Texture2D), jsClass);
		}
	}
}
