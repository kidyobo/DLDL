using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ActiveToggleGroupWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr NotifyToggleOn(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.UI.ActiveToggle)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.NotifyToggleOn(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr UnregisterToggle(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.UI.ActiveToggle)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.UnregisterToggle(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RegisterToggle(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.UI.ActiveToggle)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.RegisterToggle(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr AnyTogglesOn(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.AnyTogglesOn();
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ActiveToggles(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ActiveToggles();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetAllTogglesOff(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				obj.SetAllTogglesOff();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetToggle(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetToggle(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr onValueChangedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.onValueChanged);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool onValueChangedSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				obj.onValueChanged = (System.Action<int>)Uts.DelegateUtil.CreateDelegate<int, System.Action<int>>(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr allowSwitchOffGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.allowSwitchOff);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool allowSwitchOffSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				obj.allowSwitchOff = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr SelectedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.Selected));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool SelectedSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.ActiveToggleGroup)ToCsObjects.ToCsObject(context, thisObj));
				obj.Selected = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.UI.ActiveToggleGroup);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "onValueChanged", onValueChangedGetter, onValueChangedSetter);
			Native.jvm_reg_property(env, "allowSwitchOff", allowSwitchOffGetter, allowSwitchOffSetter);
			Native.jvm_reg_property(env, "Selected", SelectedGetter, SelectedSetter);
			Native.jvm_reg_function(env, "NotifyToggleOn", NotifyToggleOn);
			Native.jvm_reg_function(env, "UnregisterToggle", UnregisterToggle);
			Native.jvm_reg_function(env, "RegisterToggle", RegisterToggle);
			Native.jvm_reg_function(env, "AnyTogglesOn", AnyTogglesOn);
			Native.jvm_reg_function(env, "ActiveToggles", ActiveToggles);
			Native.jvm_reg_function(env, "SetAllTogglesOff", SetAllTogglesOff);
			Native.jvm_reg_function(env, "GetToggle", GetToggle);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "ActiveToggleGroup", UIBehaviourWrap.jsClass, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.UI.ActiveToggleGroup), jsClass);
		}
	}
}
