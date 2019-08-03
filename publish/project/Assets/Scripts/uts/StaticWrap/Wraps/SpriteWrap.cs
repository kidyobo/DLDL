using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class SpriteWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnityEngine.Sprite();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Create_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 7) {
					var p0 = (UnityEngine.Texture2D)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (uint)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var p5 = (UnityEngine.SpriteMeshType)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					var p6 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 6));
					var ret = UnityEngine.Sprite.Create(p0, p1.target, p2, p3, p4, p5, p6.target);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 6) {
					var p0 = (UnityEngine.Texture2D)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (uint)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var p5 = (UnityEngine.SpriteMeshType)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					var ret = UnityEngine.Sprite.Create(p0, p1.target, p2, p3, p4, p5);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 5) {
					var p0 = (UnityEngine.Texture2D)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (uint)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var ret = UnityEngine.Sprite.Create(p0, p1.target, p2, p3, p4);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 4) {
					var p0 = (UnityEngine.Texture2D)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var ret = UnityEngine.Sprite.Create(p0, p1.target, p2, p3);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (UnityEngine.Texture2D)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 2));
					var ret = UnityEngine.Sprite.Create(p0, p1.target, p2);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OverrideGeometry(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToArray<UnityEngine.Vector2>(context, Native.jvm_get_arg(args, 0));
				var p1 = ToCsObjects.ToArray<ushort>(context, Native.jvm_get_arg(args, 1));
				obj.OverrideGeometry(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr boundsGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Bounds>(context, new Agent<UnityEngine.Bounds>(obj.bounds));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr rectGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Rect>(context, new Agent<UnityEngine.Rect>(obj.rect));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr pixelsPerUnitGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.pixelsPerUnit));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr textureGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.texture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr associatedAlphaSplitTextureGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.associatedAlphaSplitTexture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr textureRectGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Rect>(context, new Agent<UnityEngine.Rect>(obj.textureRect));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr textureRectOffsetGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector2.ToJsObject(context, obj.textureRectOffset);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr packedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.packed);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr packingModeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.packingMode));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr packingRotationGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.packingRotation));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr pivotGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector2.ToJsObject(context, obj.pivot);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr borderGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, new Agent<UnityEngine.Vector4>(obj.border));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr verticesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.vertices);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr trianglesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.triangles);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr uvGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Sprite)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.uv);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Sprite);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "bounds", boundsGetter, null);
			Native.jvm_reg_property(env, "rect", rectGetter, null);
			Native.jvm_reg_property(env, "pixelsPerUnit", pixelsPerUnitGetter, null);
			Native.jvm_reg_property(env, "texture", textureGetter, null);
			Native.jvm_reg_property(env, "associatedAlphaSplitTexture", associatedAlphaSplitTextureGetter, null);
			Native.jvm_reg_property(env, "textureRect", textureRectGetter, null);
			Native.jvm_reg_property(env, "textureRectOffset", textureRectOffsetGetter, null);
			Native.jvm_reg_property(env, "packed", packedGetter, null);
			Native.jvm_reg_property(env, "packingMode", packingModeGetter, null);
			Native.jvm_reg_property(env, "packingRotation", packingRotationGetter, null);
			Native.jvm_reg_property(env, "pivot", pivotGetter, null);
			Native.jvm_reg_property(env, "border", borderGetter, null);
			Native.jvm_reg_property(env, "vertices", verticesGetter, null);
			Native.jvm_reg_property(env, "triangles", trianglesGetter, null);
			Native.jvm_reg_property(env, "uv", uvGetter, null);
			Native.jvm_reg_static_function(env, "Create", Create_S);
			Native.jvm_reg_function(env, "OverrideGeometry", OverrideGeometry);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Sprite", ObjectWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Sprite), jsClass);
		}
	}
}
