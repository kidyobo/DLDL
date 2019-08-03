using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class BuildDefinesWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new BuildDefines();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr definesGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_string(context, BuildDefines.defines);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(BuildDefines);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "defines", definesGetter_S, null);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "BuildDefines", IntPtr.Zero, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(BuildDefines), jsClass);
		}
	}
}
