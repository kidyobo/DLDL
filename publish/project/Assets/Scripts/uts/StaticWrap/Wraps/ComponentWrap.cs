using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ComponentWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnityEngine.Component();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetComponent(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(System.Type))) {
					var p0 = (System.Type)vp0;
					var ret = obj.GetComponent(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.GetComponent(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetComponentInChildren(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 2) {
					var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					var ret = obj.GetComponentInChildren(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 1) {
					var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetComponentInChildren(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetComponentsInChildren(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetComponentsInChildren(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					var ret = obj.GetComponentsInChildren(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetComponentInParent(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetComponentInParent(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetComponentsInParent(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetComponentsInParent(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					var ret = obj.GetComponentsInParent(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetComponents(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetComponents(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = ToCsObjects.ToList<UnityEngine.Component>(context, Native.jvm_get_arg(args, 1));
					obj.GetComponents(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CompareTag(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = obj.CompareTag(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SendMessageUpwards(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 3) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.SendMessageOptions)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					obj.SendMessageUpwards(p0, p1, p2);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(object))) {
						var p0 = (string)vp0;
						var p1 = vp1;
						obj.SendMessageUpwards(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.SendMessageOptions))) {
						var p0 = (string)vp0;
						var p1 = (UnityEngine.SendMessageOptions)(double)vp1;
						obj.SendMessageUpwards(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					obj.SendMessageUpwards(p0);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SendMessage(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 3) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.SendMessageOptions)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					obj.SendMessage(p0, p1, p2);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(object))) {
						var p0 = (string)vp0;
						var p1 = vp1;
						obj.SendMessage(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.SendMessageOptions))) {
						var p0 = (string)vp0;
						var p1 = (UnityEngine.SendMessageOptions)(double)vp1;
						obj.SendMessage(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					obj.SendMessage(p0);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr BroadcastMessage(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 3) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.SendMessageOptions)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					obj.BroadcastMessage(p0, p1, p2);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(object))) {
						var p0 = (string)vp0;
						var p1 = vp1;
						obj.BroadcastMessage(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.SendMessageOptions))) {
						var p0 = (string)vp0;
						var p1 = (UnityEngine.SendMessageOptions)(double)vp1;
						obj.BroadcastMessage(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					obj.BroadcastMessage(p0);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr transformGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.transform);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr gameObjectGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.gameObject);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr tagGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_string(context, obj.tag);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool tagSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Component)ToCsObjects.ToCsObject(context, thisObj));
				obj.tag = (string)Native.jvm_tostring(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Component);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "transform", transformGetter, null);
			Native.jvm_reg_property(env, "gameObject", gameObjectGetter, null);
			Native.jvm_reg_property(env, "tag", tagGetter, tagSetter);
			Native.jvm_reg_function(env, "GetComponent", GetComponent);
			Native.jvm_reg_function(env, "GetComponentInChildren", GetComponentInChildren);
			Native.jvm_reg_function(env, "GetComponentsInChildren", GetComponentsInChildren);
			Native.jvm_reg_function(env, "GetComponentInParent", GetComponentInParent);
			Native.jvm_reg_function(env, "GetComponentsInParent", GetComponentsInParent);
			Native.jvm_reg_function(env, "GetComponents", GetComponents);
			Native.jvm_reg_function(env, "CompareTag", CompareTag);
			Native.jvm_reg_function(env, "SendMessageUpwards", SendMessageUpwards);
			Native.jvm_reg_function(env, "SendMessage", SendMessage);
			Native.jvm_reg_function(env, "BroadcastMessage", BroadcastMessage);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Component", ObjectWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Component), jsClass);
		}
	}
}
