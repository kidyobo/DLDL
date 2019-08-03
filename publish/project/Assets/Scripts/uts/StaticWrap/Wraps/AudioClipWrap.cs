using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class AudioClipWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnityEngine.AudioClip();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LoadAudioData(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.LoadAudioData();
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr UnloadAudioData(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.UnloadAudioData();
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetData(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToArray<float>(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var ret = obj.GetData(p0, p1);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetData(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToArray<float>(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var ret = obj.SetData(p0, p1);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Create_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 5) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 4));
					var ret = UnityEngine.AudioClip.Create(p0, p1, p2, p3, p4);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 6) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 4));
					var p5 = (UnityEngine.AudioClip.PCMReaderCallback)Uts.DelegateUtil.CreateDelegate<float[], UnityEngine.AudioClip.PCMReaderCallback>(context, Native.jvm_get_arg(args, 5));
					var ret = UnityEngine.AudioClip.Create(p0, p1, p2, p3, p4, p5);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 7) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 4));
					var p5 = (UnityEngine.AudioClip.PCMReaderCallback)Uts.DelegateUtil.CreateDelegate<float[], UnityEngine.AudioClip.PCMReaderCallback>(context, Native.jvm_get_arg(args, 5));
					var p6 = (UnityEngine.AudioClip.PCMSetPositionCallback)Uts.DelegateUtil.CreateDelegate<int, UnityEngine.AudioClip.PCMSetPositionCallback>(context, Native.jvm_get_arg(args, 6));
					var ret = UnityEngine.AudioClip.Create(p0, p1, p2, p3, p4, p5, p6);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr lengthGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.length));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr samplesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.samples));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr channelsGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.channels));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr frequencyGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.frequency));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr loadTypeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.loadType));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr preloadAudioDataGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.preloadAudioData);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr loadStateGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.loadState));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr loadInBackgroundGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.AudioClip)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.loadInBackground);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.AudioClip);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "length", lengthGetter, null);
			Native.jvm_reg_property(env, "samples", samplesGetter, null);
			Native.jvm_reg_property(env, "channels", channelsGetter, null);
			Native.jvm_reg_property(env, "frequency", frequencyGetter, null);
			Native.jvm_reg_property(env, "loadType", loadTypeGetter, null);
			Native.jvm_reg_property(env, "preloadAudioData", preloadAudioDataGetter, null);
			Native.jvm_reg_property(env, "loadState", loadStateGetter, null);
			Native.jvm_reg_property(env, "loadInBackground", loadInBackgroundGetter, null);
			Native.jvm_reg_function(env, "LoadAudioData", LoadAudioData);
			Native.jvm_reg_function(env, "UnloadAudioData", UnloadAudioData);
			Native.jvm_reg_function(env, "GetData", GetData);
			Native.jvm_reg_function(env, "SetData", SetData);
			Native.jvm_reg_static_function(env, "Create", Create_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "AudioClip", ObjectWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.AudioClip), jsClass);
		}
	}
}
