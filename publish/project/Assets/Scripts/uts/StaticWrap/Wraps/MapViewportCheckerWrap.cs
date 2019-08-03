using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class MapViewportCheckerWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new Assets.Scripts.game.camera.MapViewportChecker();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetCheckDis(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Assets.Scripts.game.camera.MapViewportChecker)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.SetCheckDis(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetListener(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Assets.Scripts.game.camera.MapViewportChecker)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.Action<float,float,float>)Uts.DelegateUtil.CreateDelegate<float, float, float, System.Action<float,float,float>>(context, Native.jvm_get_arg(args, 0));
				obj.SetListener(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Reset(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Assets.Scripts.game.camera.MapViewportChecker)ToCsObjects.ToCsObject(context, thisObj));
				obj.Reset();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(Assets.Scripts.game.camera.MapViewportChecker);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_function(env, "SetCheckDis", SetCheckDis);
			Native.jvm_reg_function(env, "SetListener", SetListener);
			Native.jvm_reg_function(env, "Reset", Reset);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "MapViewportChecker", MonoBehaviourWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(Assets.Scripts.game.camera.MapViewportChecker), jsClass);
		}
	}
}
