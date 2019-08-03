using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class SceneManagerWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnityEngine.SceneManagement.SceneManager();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetActiveScene_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var ret = UnityEngine.SceneManagement.SceneManager.GetActiveScene();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetActiveScene_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.SceneManagement.Scene)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.SceneManagement.SceneManager.SetActiveScene(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetSceneByPath_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.SceneManagement.SceneManager.GetSceneByPath(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetSceneByName_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.SceneManagement.SceneManager.GetSceneByName(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetSceneByBuildIndex_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.SceneManagement.SceneManager.GetSceneByBuildIndex(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetSceneAt_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.SceneManagement.SceneManager.GetSceneAt(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LoadScene_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						UnityEngine.SceneManagement.SceneManager.LoadScene(p0);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int))) {
						var p0 = (int)(double)vp0;
						UnityEngine.SceneManagement.SceneManager.LoadScene(p0);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.SceneManagement.LoadSceneMode))) {
						var p0 = (string)vp0;
						var p1 = (UnityEngine.SceneManagement.LoadSceneMode)(double)vp1;
						UnityEngine.SceneManagement.SceneManager.LoadScene(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.SceneManagement.LoadSceneMode))) {
						var p0 = (int)(double)vp0;
						var p1 = (UnityEngine.SceneManagement.LoadSceneMode)(double)vp1;
						UnityEngine.SceneManagement.SceneManager.LoadScene(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LoadSceneAsync_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						var ret = UnityEngine.SceneManagement.SceneManager.LoadSceneAsync(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(int))) {
						var p0 = (int)(double)vp0;
						var ret = UnityEngine.SceneManagement.SceneManager.LoadSceneAsync(p0);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.SceneManagement.LoadSceneMode))) {
						var p0 = (string)vp0;
						var p1 = (UnityEngine.SceneManagement.LoadSceneMode)(double)vp1;
						var ret = UnityEngine.SceneManagement.SceneManager.LoadSceneAsync(p0, p1);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.SceneManagement.LoadSceneMode))) {
						var p0 = (int)(double)vp0;
						var p1 = (UnityEngine.SceneManagement.LoadSceneMode)(double)vp1;
						var ret = UnityEngine.SceneManagement.SceneManager.LoadSceneAsync(p0, p1);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CreateScene_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.SceneManagement.SceneManager.CreateScene(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr UnloadSceneAsync_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = UnityEngine.SceneManagement.SceneManager.UnloadSceneAsync(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = UnityEngine.SceneManagement.SceneManager.UnloadSceneAsync(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.SceneManagement.Scene))) {
					var p0 = (UnityEngine.SceneManagement.Scene)vp0;
					var ret = UnityEngine.SceneManagement.SceneManager.UnloadSceneAsync(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr MergeScenes_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.SceneManagement.Scene)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.SceneManagement.Scene)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				UnityEngine.SceneManagement.SceneManager.MergeScenes(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr MoveGameObjectToScene_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.GameObject)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.SceneManagement.Scene)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				UnityEngine.SceneManagement.SceneManager.MoveGameObjectToScene(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr sceneCountGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(UnityEngine.SceneManagement.SceneManager.sceneCount));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr sceneCountInBuildSettingsGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(UnityEngine.SceneManagement.SceneManager.sceneCountInBuildSettings));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.SceneManagement.SceneManager);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "sceneCount", sceneCountGetter_S, null);
			Native.jvm_reg_static_property(env, "sceneCountInBuildSettings", sceneCountInBuildSettingsGetter_S, null);
			Native.jvm_reg_static_function(env, "GetActiveScene", GetActiveScene_S);
			Native.jvm_reg_static_function(env, "SetActiveScene", SetActiveScene_S);
			Native.jvm_reg_static_function(env, "GetSceneByPath", GetSceneByPath_S);
			Native.jvm_reg_static_function(env, "GetSceneByName", GetSceneByName_S);
			Native.jvm_reg_static_function(env, "GetSceneByBuildIndex", GetSceneByBuildIndex_S);
			Native.jvm_reg_static_function(env, "GetSceneAt", GetSceneAt_S);
			Native.jvm_reg_static_function(env, "LoadScene", LoadScene_S);
			Native.jvm_reg_static_function(env, "LoadSceneAsync", LoadSceneAsync_S);
			Native.jvm_reg_static_function(env, "CreateScene", CreateScene_S);
			Native.jvm_reg_static_function(env, "UnloadSceneAsync", UnloadSceneAsync_S);
			Native.jvm_reg_static_function(env, "MergeScenes", MergeScenes_S);
			Native.jvm_reg_static_function(env, "MoveGameObjectToScene", MoveGameObjectToScene_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "SceneManager", IntPtr.Zero, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.SceneManagement.SceneManager), jsClass);
		}
	}
}
