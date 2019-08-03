using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ObjectWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnityEngine.Object();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Destroy_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					UnityEngine.Object.Destroy(p0, p1);
					return IntPtr.Zero;
				} else if (argcnt == 1) {
					var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					UnityEngine.Object.Destroy(p0);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DestroyImmediate_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					UnityEngine.Object.DestroyImmediate(p0, p1);
					return IntPtr.Zero;
				} else if (argcnt == 1) {
					var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					UnityEngine.Object.DestroyImmediate(p0);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindObjectsOfType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.Object.FindObjectsOfType(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DontDestroyOnLoad_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				UnityEngine.Object.DontDestroyOnLoad(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DestroyObject_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					UnityEngine.Object.DestroyObject(p0, p1);
					return IntPtr.Zero;
				} else if (argcnt == 1) {
					var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					UnityEngine.Object.DestroyObject(p0);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ToString(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Object)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ToString();
				return Native.jvm_make_string(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetInstanceID(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Object)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetInstanceID();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetHashCode(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Object)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetHashCode();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Equals(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Object)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.Equals(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Implicit_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = (p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Instantiate_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 3) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Object)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>))) {
						var p0 = (UnityEngine.Object)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						var ret = UnityEngine.Object.Instantiate(p0, p1, p2.target);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Object)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Transform)) && Uts.Core.CompareType(vp2, typeof(bool))) {
						var p0 = (UnityEngine.Object)vp0;
						var p1 = (UnityEngine.Transform)vp1;
						var p2 = (bool)vp2;
						var ret = UnityEngine.Object.Instantiate(p0, p1, p2);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 4) {
					var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var ret = UnityEngine.Object.Instantiate(p0, p1, p2.target, p3);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 1) {
					var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var ret = UnityEngine.Object.Instantiate(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var ret = UnityEngine.Object.Instantiate(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindObjectOfType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.Object.FindObjectOfType(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Equality_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = (p0==p1);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Inequality_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Object)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = (p0!=p1);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr nameGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Object)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_string(context, obj.name);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool nameSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Object)ToCsObjects.ToCsObject(context, thisObj));
				obj.name = (string)Native.jvm_tostring(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr hideFlagsGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Object)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.hideFlags));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool hideFlagsSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Object)ToCsObjects.ToCsObject(context, thisObj));
				obj.hideFlags = (UnityEngine.HideFlags)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Object);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "name", nameGetter, nameSetter);
			Native.jvm_reg_property(env, "hideFlags", hideFlagsGetter, hideFlagsSetter);
			Native.jvm_reg_static_function(env, "Destroy", Destroy_S);
			Native.jvm_reg_static_function(env, "DestroyImmediate", DestroyImmediate_S);
			Native.jvm_reg_static_function(env, "FindObjectsOfType", FindObjectsOfType_S);
			Native.jvm_reg_static_function(env, "DontDestroyOnLoad", DontDestroyOnLoad_S);
			Native.jvm_reg_static_function(env, "DestroyObject", DestroyObject_S);
			Native.jvm_reg_function(env, "ToString", ToString);
			Native.jvm_reg_function(env, "GetInstanceID", GetInstanceID);
			Native.jvm_reg_function(env, "GetHashCode", GetHashCode);
			Native.jvm_reg_function(env, "Equals", Equals);
			Native.jvm_reg_static_function(env, "op_Implicit", op_Implicit_S);
			Native.jvm_reg_static_function(env, "Instantiate", Instantiate_S);
			Native.jvm_reg_static_function(env, "FindObjectOfType", FindObjectOfType_S);
			Native.jvm_reg_static_function(env, "op_Equality", op_Equality_S);
			Native.jvm_reg_static_function(env, "op_Inequality", op_Inequality_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "UnityObject", IntPtr.Zero, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Object), jsClass);
		}
	}
}
