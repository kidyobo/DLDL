using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class InputListenerWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new InputListener();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr onClickGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((InputListener)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.onClick);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool onClickSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((InputListener)ToCsObjects.ToCsObject(context, thisObj));
				obj.onClick = (System.Action<UnityEngine.GameObject,float,float,float>)Uts.DelegateUtil.CreateDelegate<UnityEngine.GameObject, float, float, float, System.Action<UnityEngine.GameObject,float,float,float>>(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr onUIClickGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((InputListener)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.onUIClick);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool onUIClickSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((InputListener)ToCsObjects.ToCsObject(context, thisObj));
				obj.onUIClick = (System.Action)Uts.DelegateUtil.CreateDelegate<System.Action>(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr onGuestureGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((InputListener)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.onGuesture);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool onGuestureSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((InputListener)ToCsObjects.ToCsObject(context, thisObj));
				obj.onGuesture = (System.Action<int,int>)Uts.DelegateUtil.CreateDelegate<int, int, System.Action<int,int>>(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr fingerActionSensitivityGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((InputListener)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.fingerActionSensitivity));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool fingerActionSensitivitySetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((InputListener)ToCsObjects.ToCsObject(context, thisObj));
				obj.fingerActionSensitivity = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr maxCountGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((InputListener)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.maxCount));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool maxCountSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((InputListener)ToCsObjects.ToCsObject(context, thisObj));
				obj.maxCount = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(InputListener);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "onClick", onClickGetter, onClickSetter);
			Native.jvm_reg_property(env, "onUIClick", onUIClickGetter, onUIClickSetter);
			Native.jvm_reg_property(env, "onGuesture", onGuestureGetter, onGuestureSetter);
			Native.jvm_reg_property(env, "fingerActionSensitivity", fingerActionSensitivityGetter, fingerActionSensitivitySetter);
			Native.jvm_reg_property(env, "maxCount", maxCountGetter, maxCountSetter);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "InputListener", MonoBehaviourWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(InputListener), jsClass);
		}
	}
}
