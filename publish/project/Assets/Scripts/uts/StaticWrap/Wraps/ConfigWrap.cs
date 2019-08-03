using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ConfigWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new game.Config();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr remoteResUrlGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_string(context, game.Config.remoteResUrl);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr platGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(game.Config.plat));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr gameidGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(game.Config.gameid));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr apkpathGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_string(context, game.Config.apkpath);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr bundleIdGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_string(context, game.Config.bundleId);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr productNameGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_string(context, game.Config.productName);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(game.Config);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "remoteResUrl", remoteResUrlGetter_S, null);
			Native.jvm_reg_static_property(env, "plat", platGetter_S, null);
			Native.jvm_reg_static_property(env, "gameid", gameidGetter_S, null);
			Native.jvm_reg_static_property(env, "apkpath", apkpathGetter_S, null);
			Native.jvm_reg_static_property(env, "bundleId", bundleIdGetter_S, null);
			Native.jvm_reg_static_property(env, "productName", productNameGetter_S, null);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Config", IntPtr.Zero, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(game.Config), jsClass);
		}
	}
}
