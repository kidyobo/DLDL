using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ScrollbarWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Rebuild(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.UI.CanvasUpdate)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.Rebuild(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LayoutComplete(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				obj.LayoutComplete();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GraphicUpdateComplete(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				obj.GraphicUpdateComplete();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnBeginDrag(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.PointerEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnBeginDrag(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnDrag(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.PointerEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnDrag(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnPointerDown(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.PointerEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnPointerDown(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnPointerUp(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.PointerEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnPointerUp(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnMove(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.AxisEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnMove(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindSelectableOnLeft(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.FindSelectableOnLeft();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindSelectableOnRight(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.FindSelectableOnRight();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindSelectableOnUp(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.FindSelectableOnUp();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindSelectableOnDown(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.FindSelectableOnDown();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnInitializePotentialDrag(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.PointerEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnInitializePotentialDrag(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetDirection(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.UI.Scrollbar.Direction)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
				obj.SetDirection(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr handleRectGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.handleRect);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool handleRectSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				obj.handleRect = (UnityEngine.RectTransform)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr directionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.direction));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool directionSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				obj.direction = (UnityEngine.UI.Scrollbar.Direction)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr valueGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.value));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool valueSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				obj.value = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr sizeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.size));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool sizeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				obj.size = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr numberOfStepsGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.numberOfSteps));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool numberOfStepsSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				obj.numberOfSteps = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr onValueChangedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.onValueChanged);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool onValueChangedSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Scrollbar)ToCsObjects.ToCsObject(context, thisObj));
				obj.onValueChanged = Uts.DelegateUtil.CreateUnityEvent<float, UnityEngine.UI.Scrollbar.ScrollEvent>(context, arg, new UnityEngine.UI.Scrollbar.ScrollEvent());
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.UI.Scrollbar);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "handleRect", handleRectGetter, handleRectSetter);
			Native.jvm_reg_property(env, "direction", directionGetter, directionSetter);
			Native.jvm_reg_property(env, "value", valueGetter, valueSetter);
			Native.jvm_reg_property(env, "size", sizeGetter, sizeSetter);
			Native.jvm_reg_property(env, "numberOfSteps", numberOfStepsGetter, numberOfStepsSetter);
			Native.jvm_reg_property(env, "onValueChanged", onValueChangedGetter, onValueChangedSetter);
			Native.jvm_reg_function(env, "Rebuild", Rebuild);
			Native.jvm_reg_function(env, "LayoutComplete", LayoutComplete);
			Native.jvm_reg_function(env, "GraphicUpdateComplete", GraphicUpdateComplete);
			Native.jvm_reg_function(env, "OnBeginDrag", OnBeginDrag);
			Native.jvm_reg_function(env, "OnDrag", OnDrag);
			Native.jvm_reg_function(env, "OnPointerDown", OnPointerDown);
			Native.jvm_reg_function(env, "OnPointerUp", OnPointerUp);
			Native.jvm_reg_function(env, "OnMove", OnMove);
			Native.jvm_reg_function(env, "FindSelectableOnLeft", FindSelectableOnLeft);
			Native.jvm_reg_function(env, "FindSelectableOnRight", FindSelectableOnRight);
			Native.jvm_reg_function(env, "FindSelectableOnUp", FindSelectableOnUp);
			Native.jvm_reg_function(env, "FindSelectableOnDown", FindSelectableOnDown);
			Native.jvm_reg_function(env, "OnInitializePotentialDrag", OnInitializePotentialDrag);
			Native.jvm_reg_function(env, "SetDirection", SetDirection);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Scrollbar", SelectableWrap.jsClass, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.UI.Scrollbar), jsClass);
		}
	}
}
