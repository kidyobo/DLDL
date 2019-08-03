using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class TweenTargetWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new TweenTarget();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Begin_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 3) {
					var p0 = (UnityEngine.GameObject)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var ret = TweenTarget.Begin(p0, p1, p2);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 4) {
					var p0 = (UnityEngine.GameObject)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 3));
					var ret = TweenTarget.Begin(p0, p1, p2, p3);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetStartToCurrentValue(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((TweenTarget)ToCsObjects.ToCsObject(context, thisObj));
				obj.SetStartToCurrentValue();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetEndToCurrentValue(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((TweenTarget)ToCsObjects.ToCsObject(context, thisObj));
				obj.SetEndToCurrentValue();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr fromGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((TweenTarget)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.from);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool fromSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((TweenTarget)ToCsObjects.ToCsObject(context, thisObj));
				obj.from = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr targetTransGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((TweenTarget)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.targetTrans);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool targetTransSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((TweenTarget)ToCsObjects.ToCsObject(context, thisObj));
				obj.targetTrans = (UnityEngine.Transform)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr worldSpaceGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((TweenTarget)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.worldSpace);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool worldSpaceSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((TweenTarget)ToCsObjects.ToCsObject(context, thisObj));
				obj.worldSpace = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr cachedTransformGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((TweenTarget)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.cachedTransform);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr valueGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((TweenTarget)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.value);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool valueSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((TweenTarget)ToCsObjects.ToCsObject(context, thisObj));
				obj.value = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(TweenTarget);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "from", fromGetter, fromSetter);
			Native.jvm_reg_property(env, "targetTrans", targetTransGetter, targetTransSetter);
			Native.jvm_reg_property(env, "worldSpace", worldSpaceGetter, worldSpaceSetter);
			Native.jvm_reg_property(env, "cachedTransform", cachedTransformGetter, null);
			Native.jvm_reg_property(env, "value", valueGetter, valueSetter);
			Native.jvm_reg_static_function(env, "Begin", Begin_S);
			Native.jvm_reg_function(env, "SetStartToCurrentValue", SetStartToCurrentValue);
			Native.jvm_reg_function(env, "SetEndToCurrentValue", SetEndToCurrentValue);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "TweenTarget", UITweenerWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(TweenTarget), jsClass);
		}
	}
}
