using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class UnitStateListenerWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnitStateListener();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetTileMap(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnitStateListener)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (TileMap)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.SetTileMap(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr BindVisibleChangeAction(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnitStateListener)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.Action<bool>)Uts.DelegateUtil.CreateDelegate<bool, System.Action<bool>>(context, Native.jvm_get_arg(args, 0));
				obj.BindVisibleChangeAction(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr BindSaftyChangeAction(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnitStateListener)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.Action<bool>)Uts.DelegateUtil.CreateDelegate<bool, System.Action<bool>>(context, Native.jvm_get_arg(args, 0));
				obj.BindSaftyChangeAction(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr BindTerrainTypeChangeAction(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnitStateListener)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.Action<int>)Uts.DelegateUtil.CreateDelegate<int, System.Action<int>>(context, Native.jvm_get_arg(args, 0));
				obj.BindTerrainTypeChangeAction(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr BindCheckTeleportAction(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnitStateListener)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.Action<int>)Uts.DelegateUtil.CreateDelegate<int, System.Action<int>>(context, Native.jvm_get_arg(args, 0));
				obj.BindCheckTeleportAction(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Reset(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnitStateListener)ToCsObjects.ToCsObject(context, thisObj));
				obj.Reset();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnitStateListener);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_function(env, "SetTileMap", SetTileMap);
			Native.jvm_reg_function(env, "BindVisibleChangeAction", BindVisibleChangeAction);
			Native.jvm_reg_function(env, "BindSaftyChangeAction", BindSaftyChangeAction);
			Native.jvm_reg_function(env, "BindTerrainTypeChangeAction", BindTerrainTypeChangeAction);
			Native.jvm_reg_function(env, "BindCheckTeleportAction", BindCheckTeleportAction);
			Native.jvm_reg_function(env, "Reset", Reset);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "UnitStateListener", MonoBehaviourWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnitStateListener), jsClass);
		}
	}
}
