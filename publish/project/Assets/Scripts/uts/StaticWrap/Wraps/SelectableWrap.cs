using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class SelectableWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsInteractable(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.IsInteractable();
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindSelectable(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.FindSelectable(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindSelectableOnLeft(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.FindSelectableOnLeft();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindSelectableOnRight(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.FindSelectableOnRight();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindSelectableOnUp(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.FindSelectableOnUp();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindSelectableOnDown(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.FindSelectableOnDown();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnMove(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.AxisEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnMove(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnPointerDown(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.PointerEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnPointerDown(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnPointerUp(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.PointerEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnPointerUp(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnPointerEnter(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.PointerEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnPointerEnter(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnPointerExit(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.PointerEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnPointerExit(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnSelect(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.BaseEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnSelect(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr OnDeselect(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.EventSystems.BaseEventData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.OnDeselect(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Select(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				obj.Select();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr allSelectablesGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.UI.Selectable.allSelectables);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr navigationGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.navigation);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool navigationSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				obj.navigation = (UnityEngine.UI.Navigation)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr transitionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.transition));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool transitionSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				obj.transition = (UnityEngine.UI.Selectable.Transition)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr colorsGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.colors);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool colorsSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				obj.colors = (UnityEngine.UI.ColorBlock)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr spriteStateGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.spriteState);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool spriteStateSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				obj.spriteState = (UnityEngine.UI.SpriteState)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr animationTriggersGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.animationTriggers);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool animationTriggersSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				obj.animationTriggers = (UnityEngine.UI.AnimationTriggers)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr targetGraphicGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.targetGraphic);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool targetGraphicSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				obj.targetGraphic = (UnityEngine.UI.Graphic)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr interactableGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.interactable);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool interactableSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				obj.interactable = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr imageGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.image);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool imageSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				obj.image = (UnityEngine.UI.Image)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr animatorGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.UI.Selectable)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.animator);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.UI.Selectable);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "allSelectables", allSelectablesGetter_S, null);
			Native.jvm_reg_property(env, "navigation", navigationGetter, navigationSetter);
			Native.jvm_reg_property(env, "transition", transitionGetter, transitionSetter);
			Native.jvm_reg_property(env, "colors", colorsGetter, colorsSetter);
			Native.jvm_reg_property(env, "spriteState", spriteStateGetter, spriteStateSetter);
			Native.jvm_reg_property(env, "animationTriggers", animationTriggersGetter, animationTriggersSetter);
			Native.jvm_reg_property(env, "targetGraphic", targetGraphicGetter, targetGraphicSetter);
			Native.jvm_reg_property(env, "interactable", interactableGetter, interactableSetter);
			Native.jvm_reg_property(env, "image", imageGetter, imageSetter);
			Native.jvm_reg_property(env, "animator", animatorGetter, null);
			Native.jvm_reg_function(env, "IsInteractable", IsInteractable);
			Native.jvm_reg_function(env, "FindSelectable", FindSelectable);
			Native.jvm_reg_function(env, "FindSelectableOnLeft", FindSelectableOnLeft);
			Native.jvm_reg_function(env, "FindSelectableOnRight", FindSelectableOnRight);
			Native.jvm_reg_function(env, "FindSelectableOnUp", FindSelectableOnUp);
			Native.jvm_reg_function(env, "FindSelectableOnDown", FindSelectableOnDown);
			Native.jvm_reg_function(env, "OnMove", OnMove);
			Native.jvm_reg_function(env, "OnPointerDown", OnPointerDown);
			Native.jvm_reg_function(env, "OnPointerUp", OnPointerUp);
			Native.jvm_reg_function(env, "OnPointerEnter", OnPointerEnter);
			Native.jvm_reg_function(env, "OnPointerExit", OnPointerExit);
			Native.jvm_reg_function(env, "OnSelect", OnSelect);
			Native.jvm_reg_function(env, "OnDeselect", OnDeselect);
			Native.jvm_reg_function(env, "Select", Select);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Selectable", UIBehaviourWrap.jsClass, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.UI.Selectable), jsClass);
		}
	}
}
