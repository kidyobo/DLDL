using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class AnimatorWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnityEngine.Animator();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetFloat(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.GetFloat(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = obj.GetFloat(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetFloat(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float))) {
						var p0 = (string)vp0;
						var p1 = (float)(double)vp1;
						obj.SetFloat(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float))) {
						var p0 = (int)(double)vp0;
						var p1 = (float)(double)vp1;
						obj.SetFloat(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 4) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(float)) && Uts.Core.CompareType(vp3, typeof(float))) {
						var p0 = (string)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (float)(double)vp2;
						var p3 = (float)(double)vp3;
						obj.SetFloat(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(float)) && Uts.Core.CompareType(vp3, typeof(float))) {
						var p0 = (int)(double)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (float)(double)vp2;
						var p3 = (float)(double)vp3;
						obj.SetFloat(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetBool(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.GetBool(p0);
					return Native.jvm_make_boolean(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = obj.GetBool(p0);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetBool(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(bool))) {
					var p0 = (string)vp0;
					var p1 = (bool)vp1;
					obj.SetBool(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(bool))) {
					var p0 = (int)(double)vp0;
					var p1 = (bool)vp1;
					obj.SetBool(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetInteger(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.GetInteger(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = obj.GetInteger(p0);
					return Native.jvm_make_number(context, (double)(ret));
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetInteger(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(int))) {
					var p0 = (string)vp0;
					var p1 = (int)(double)vp1;
					obj.SetInteger(p0, p1);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(int))) {
					var p0 = (int)(double)vp0;
					var p1 = (int)(double)vp1;
					obj.SetInteger(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetTrigger(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					obj.SetTrigger(p0);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					obj.SetTrigger(p0);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ResetTrigger(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					obj.ResetTrigger(p0);
					return IntPtr.Zero;
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					obj.ResetTrigger(p0);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsParameterControlledByCurve(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = obj.IsParameterControlledByCurve(p0);
					return Native.jvm_make_boolean(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(int))) {
					var p0 = (int)(double)vp0;
					var ret = obj.IsParameterControlledByCurve(p0);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetIKPosition(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKGoal)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetIKPosition(p0);
				return JsStructs.vector3.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetIKPosition(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKGoal)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
				obj.SetIKPosition(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetIKRotation(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKGoal)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = new Agent<UnityEngine.Quaternion>(obj.GetIKRotation(p0));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetIKRotation(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKGoal)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				obj.SetIKRotation(p0, p1.target);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetIKPositionWeight(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKGoal)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetIKPositionWeight(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetIKPositionWeight(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKGoal)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				obj.SetIKPositionWeight(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetIKRotationWeight(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKGoal)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetIKRotationWeight(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetIKRotationWeight(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKGoal)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				obj.SetIKRotationWeight(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetIKHintPosition(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKHint)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetIKHintPosition(p0);
				return JsStructs.vector3.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetIKHintPosition(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKHint)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
				obj.SetIKHintPosition(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetIKHintPositionWeight(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKHint)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetIKHintPositionWeight(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetIKHintPositionWeight(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarIKHint)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				obj.SetIKHintPositionWeight(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetLookAtPosition(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				obj.SetLookAtPosition(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetLookAtWeight(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 4) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					obj.SetLookAtWeight(p0, p1, p2, p3);
					return IntPtr.Zero;
				} else if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					obj.SetLookAtWeight(p0, p1, p2);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					obj.SetLookAtWeight(p0, p1);
					return IntPtr.Zero;
				} else if (argcnt == 1) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					obj.SetLookAtWeight(p0);
					return IntPtr.Zero;
				} else if (argcnt == 5) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					obj.SetLookAtWeight(p0, p1, p2, p3, p4);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetBoneLocalRotation(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.HumanBodyBones)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				obj.SetBoneLocalRotation(p0, p1.target);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetLayerName(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetLayerName(p0);
				return Native.jvm_make_string(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetLayerIndex(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetLayerIndex(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetLayerWeight(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetLayerWeight(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetLayerWeight(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				obj.SetLayerWeight(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetCurrentAnimatorStateInfo(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetCurrentAnimatorStateInfo(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetNextAnimatorStateInfo(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetNextAnimatorStateInfo(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetAnimatorTransitionInfo(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetAnimatorTransitionInfo(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetCurrentAnimatorClipInfoCount(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetCurrentAnimatorClipInfoCount(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetCurrentAnimatorClipInfo(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetCurrentAnimatorClipInfo(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = ToCsObjects.ToList<UnityEngine.AnimatorClipInfo>(context, Native.jvm_get_arg(args, 1));
					obj.GetCurrentAnimatorClipInfo(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetNextAnimatorClipInfoCount(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetNextAnimatorClipInfoCount(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetNextAnimatorClipInfo(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetNextAnimatorClipInfo(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = ToCsObjects.ToList<UnityEngine.AnimatorClipInfo>(context, Native.jvm_get_arg(args, 1));
					obj.GetNextAnimatorClipInfo(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsInTransition(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.IsInTransition(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetParameter(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetParameter(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr MatchTarget(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 6) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.AvatarTarget)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.MatchTargetWeightMask)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var p5 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					obj.MatchTarget(p0, p1.target, p2, p3, p4, p5);
					return IntPtr.Zero;
				} else if (argcnt == 5) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.AvatarTarget)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.MatchTargetWeightMask)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					obj.MatchTarget(p0, p1.target, p2, p3, p4);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr InterruptMatchTarget(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 0));
					obj.InterruptMatchTarget(p0);
					return IntPtr.Zero;
				} else if (argcnt == 0) {
					obj.InterruptMatchTarget();
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CrossFadeInFixedTime(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 3) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(int))) {
						var p0 = (string)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (int)(double)vp2;
						obj.CrossFadeInFixedTime(p0, p1, p2);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(int))) {
						var p0 = (int)(double)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (int)(double)vp2;
						obj.CrossFadeInFixedTime(p0, p1, p2);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float))) {
						var p0 = (string)vp0;
						var p1 = (float)(double)vp1;
						obj.CrossFadeInFixedTime(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float))) {
						var p0 = (int)(double)vp0;
						var p1 = (float)(double)vp1;
						obj.CrossFadeInFixedTime(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 4) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(int)) && Uts.Core.CompareType(vp3, typeof(float))) {
						var p0 = (string)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (int)(double)vp2;
						var p3 = (float)(double)vp3;
						obj.CrossFadeInFixedTime(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(int)) && Uts.Core.CompareType(vp3, typeof(float))) {
						var p0 = (int)(double)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (int)(double)vp2;
						var p3 = (float)(double)vp3;
						obj.CrossFadeInFixedTime(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CrossFade(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 3) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(int))) {
						var p0 = (string)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (int)(double)vp2;
						obj.CrossFade(p0, p1, p2);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(int))) {
						var p0 = (int)(double)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (int)(double)vp2;
						obj.CrossFade(p0, p1, p2);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float))) {
						var p0 = (string)vp0;
						var p1 = (float)(double)vp1;
						obj.CrossFade(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float))) {
						var p0 = (int)(double)vp0;
						var p1 = (float)(double)vp1;
						obj.CrossFade(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 4) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(int)) && Uts.Core.CompareType(vp3, typeof(float))) {
						var p0 = (string)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (int)(double)vp2;
						var p3 = (float)(double)vp3;
						obj.CrossFade(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(int)) && Uts.Core.CompareType(vp3, typeof(float))) {
						var p0 = (int)(double)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (int)(double)vp2;
						var p3 = (float)(double)vp3;
						obj.CrossFade(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr PlayInFixedTime(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(int))) {
						var p0 = (string)vp0;
						var p1 = (int)(double)vp1;
						obj.PlayInFixedTime(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(int))) {
						var p0 = (int)(double)vp0;
						var p1 = (int)(double)vp1;
						obj.PlayInFixedTime(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						obj.PlayInFixedTime(p0);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int))) {
						var p0 = (int)(double)vp0;
						obj.PlayInFixedTime(p0);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 3) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(float))) {
						var p0 = (string)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (float)(double)vp2;
						obj.PlayInFixedTime(p0, p1, p2);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(float))) {
						var p0 = (int)(double)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (float)(double)vp2;
						obj.PlayInFixedTime(p0, p1, p2);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Play(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(int))) {
						var p0 = (string)vp0;
						var p1 = (int)(double)vp1;
						obj.Play(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(int))) {
						var p0 = (int)(double)vp0;
						var p1 = (int)(double)vp1;
						obj.Play(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(string))) {
						var p0 = (string)vp0;
						obj.Play(p0);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int))) {
						var p0 = (int)(double)vp0;
						obj.Play(p0);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 3) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(float))) {
						var p0 = (string)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (float)(double)vp2;
						obj.Play(p0, p1, p2);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(float))) {
						var p0 = (int)(double)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (float)(double)vp2;
						obj.Play(p0, p1, p2);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetTarget(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.AvatarTarget)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				obj.SetTarget(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetBoneTransform(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.HumanBodyBones)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetBoneTransform(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr StartPlayback(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.StartPlayback();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr StopPlayback(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.StopPlayback();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr StartRecording(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.StartRecording(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr StopRecording(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.StopRecording();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr HasState(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var ret = obj.HasState(p0, p1);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr StringToHash_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.Animator.StringToHash(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Update(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.Update(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Rebind(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.Rebind();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ApplyBuiltinRootMotion(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.ApplyBuiltinRootMotion();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr isOptimizableGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.isOptimizable);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr isHumanGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.isHuman);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr hasRootMotionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.hasRootMotion);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr humanScaleGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.humanScale));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr isInitializedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.isInitialized);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr deltaPositionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.deltaPosition);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr deltaRotationGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, new Agent<UnityEngine.Quaternion>(obj.deltaRotation));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr velocityGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.velocity);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr angularVelocityGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.angularVelocity);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr rootPositionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.rootPosition);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool rootPositionSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.rootPosition = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr rootRotationGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, new Agent<UnityEngine.Quaternion>(obj.rootRotation));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool rootRotationSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.rootRotation = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, arg)).target;
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr applyRootMotionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.applyRootMotion);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool applyRootMotionSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.applyRootMotion = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr linearVelocityBlendingGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.linearVelocityBlending);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool linearVelocityBlendingSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.linearVelocityBlending = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr updateModeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.updateMode));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool updateModeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.updateMode = (UnityEngine.AnimatorUpdateMode)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr hasTransformHierarchyGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.hasTransformHierarchy);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr gravityWeightGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.gravityWeight));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr bodyPositionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.bodyPosition);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool bodyPositionSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.bodyPosition = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr bodyRotationGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, new Agent<UnityEngine.Quaternion>(obj.bodyRotation));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool bodyRotationSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.bodyRotation = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, arg)).target;
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr stabilizeFeetGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.stabilizeFeet);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool stabilizeFeetSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.stabilizeFeet = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr layerCountGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.layerCount));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr parametersGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.parameters);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr parameterCountGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.parameterCount));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr feetPivotActiveGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.feetPivotActive));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool feetPivotActiveSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.feetPivotActive = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr pivotWeightGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.pivotWeight));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr pivotPositionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.pivotPosition);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr isMatchingTargetGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.isMatchingTarget);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr speedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.speed));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool speedSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.speed = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr targetPositionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.targetPosition);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr targetRotationGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, new Agent<UnityEngine.Quaternion>(obj.targetRotation));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr cullingModeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.cullingMode));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool cullingModeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.cullingMode = (UnityEngine.AnimatorCullingMode)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr playbackTimeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.playbackTime));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool playbackTimeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.playbackTime = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr recorderStartTimeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.recorderStartTime));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool recorderStartTimeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.recorderStartTime = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr recorderStopTimeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.recorderStopTime));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool recorderStopTimeSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.recorderStopTime = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr recorderModeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.recorderMode));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr runtimeAnimatorControllerGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.runtimeAnimatorController);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool runtimeAnimatorControllerSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.runtimeAnimatorController = (UnityEngine.RuntimeAnimatorController)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr hasBoundPlayablesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.hasBoundPlayables);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr avatarGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.avatar);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool avatarSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.avatar = (UnityEngine.Avatar)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr playableGraphGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.playableGraph);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr layersAffectMassCenterGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.layersAffectMassCenter);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool layersAffectMassCenterSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.layersAffectMassCenter = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr leftFeetBottomHeightGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.leftFeetBottomHeight));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr rightFeetBottomHeightGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.rightFeetBottomHeight));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr logWarningsGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.logWarnings);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool logWarningsSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.logWarnings = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr fireEventsGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.fireEvents);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool fireEventsSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Animator)ToCsObjects.ToCsObject(context, thisObj));
				obj.fireEvents = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Animator);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "isOptimizable", isOptimizableGetter, null);
			Native.jvm_reg_property(env, "isHuman", isHumanGetter, null);
			Native.jvm_reg_property(env, "hasRootMotion", hasRootMotionGetter, null);
			Native.jvm_reg_property(env, "humanScale", humanScaleGetter, null);
			Native.jvm_reg_property(env, "isInitialized", isInitializedGetter, null);
			Native.jvm_reg_property(env, "deltaPosition", deltaPositionGetter, null);
			Native.jvm_reg_property(env, "deltaRotation", deltaRotationGetter, null);
			Native.jvm_reg_property(env, "velocity", velocityGetter, null);
			Native.jvm_reg_property(env, "angularVelocity", angularVelocityGetter, null);
			Native.jvm_reg_property(env, "rootPosition", rootPositionGetter, rootPositionSetter);
			Native.jvm_reg_property(env, "rootRotation", rootRotationGetter, rootRotationSetter);
			Native.jvm_reg_property(env, "applyRootMotion", applyRootMotionGetter, applyRootMotionSetter);
			Native.jvm_reg_property(env, "linearVelocityBlending", linearVelocityBlendingGetter, linearVelocityBlendingSetter);
			Native.jvm_reg_property(env, "updateMode", updateModeGetter, updateModeSetter);
			Native.jvm_reg_property(env, "hasTransformHierarchy", hasTransformHierarchyGetter, null);
			Native.jvm_reg_property(env, "gravityWeight", gravityWeightGetter, null);
			Native.jvm_reg_property(env, "bodyPosition", bodyPositionGetter, bodyPositionSetter);
			Native.jvm_reg_property(env, "bodyRotation", bodyRotationGetter, bodyRotationSetter);
			Native.jvm_reg_property(env, "stabilizeFeet", stabilizeFeetGetter, stabilizeFeetSetter);
			Native.jvm_reg_property(env, "layerCount", layerCountGetter, null);
			Native.jvm_reg_property(env, "parameters", parametersGetter, null);
			Native.jvm_reg_property(env, "parameterCount", parameterCountGetter, null);
			Native.jvm_reg_property(env, "feetPivotActive", feetPivotActiveGetter, feetPivotActiveSetter);
			Native.jvm_reg_property(env, "pivotWeight", pivotWeightGetter, null);
			Native.jvm_reg_property(env, "pivotPosition", pivotPositionGetter, null);
			Native.jvm_reg_property(env, "isMatchingTarget", isMatchingTargetGetter, null);
			Native.jvm_reg_property(env, "speed", speedGetter, speedSetter);
			Native.jvm_reg_property(env, "targetPosition", targetPositionGetter, null);
			Native.jvm_reg_property(env, "targetRotation", targetRotationGetter, null);
			Native.jvm_reg_property(env, "cullingMode", cullingModeGetter, cullingModeSetter);
			Native.jvm_reg_property(env, "playbackTime", playbackTimeGetter, playbackTimeSetter);
			Native.jvm_reg_property(env, "recorderStartTime", recorderStartTimeGetter, recorderStartTimeSetter);
			Native.jvm_reg_property(env, "recorderStopTime", recorderStopTimeGetter, recorderStopTimeSetter);
			Native.jvm_reg_property(env, "recorderMode", recorderModeGetter, null);
			Native.jvm_reg_property(env, "runtimeAnimatorController", runtimeAnimatorControllerGetter, runtimeAnimatorControllerSetter);
			Native.jvm_reg_property(env, "hasBoundPlayables", hasBoundPlayablesGetter, null);
			Native.jvm_reg_property(env, "avatar", avatarGetter, avatarSetter);
			Native.jvm_reg_property(env, "playableGraph", playableGraphGetter, null);
			Native.jvm_reg_property(env, "layersAffectMassCenter", layersAffectMassCenterGetter, layersAffectMassCenterSetter);
			Native.jvm_reg_property(env, "leftFeetBottomHeight", leftFeetBottomHeightGetter, null);
			Native.jvm_reg_property(env, "rightFeetBottomHeight", rightFeetBottomHeightGetter, null);
			Native.jvm_reg_property(env, "logWarnings", logWarningsGetter, logWarningsSetter);
			Native.jvm_reg_property(env, "fireEvents", fireEventsGetter, fireEventsSetter);
			Native.jvm_reg_function(env, "GetFloat", GetFloat);
			Native.jvm_reg_function(env, "SetFloat", SetFloat);
			Native.jvm_reg_function(env, "GetBool", GetBool);
			Native.jvm_reg_function(env, "SetBool", SetBool);
			Native.jvm_reg_function(env, "GetInteger", GetInteger);
			Native.jvm_reg_function(env, "SetInteger", SetInteger);
			Native.jvm_reg_function(env, "SetTrigger", SetTrigger);
			Native.jvm_reg_function(env, "ResetTrigger", ResetTrigger);
			Native.jvm_reg_function(env, "IsParameterControlledByCurve", IsParameterControlledByCurve);
			Native.jvm_reg_function(env, "GetIKPosition", GetIKPosition);
			Native.jvm_reg_function(env, "SetIKPosition", SetIKPosition);
			Native.jvm_reg_function(env, "GetIKRotation", GetIKRotation);
			Native.jvm_reg_function(env, "SetIKRotation", SetIKRotation);
			Native.jvm_reg_function(env, "GetIKPositionWeight", GetIKPositionWeight);
			Native.jvm_reg_function(env, "SetIKPositionWeight", SetIKPositionWeight);
			Native.jvm_reg_function(env, "GetIKRotationWeight", GetIKRotationWeight);
			Native.jvm_reg_function(env, "SetIKRotationWeight", SetIKRotationWeight);
			Native.jvm_reg_function(env, "GetIKHintPosition", GetIKHintPosition);
			Native.jvm_reg_function(env, "SetIKHintPosition", SetIKHintPosition);
			Native.jvm_reg_function(env, "GetIKHintPositionWeight", GetIKHintPositionWeight);
			Native.jvm_reg_function(env, "SetIKHintPositionWeight", SetIKHintPositionWeight);
			Native.jvm_reg_function(env, "SetLookAtPosition", SetLookAtPosition);
			Native.jvm_reg_function(env, "SetLookAtWeight", SetLookAtWeight);
			Native.jvm_reg_function(env, "SetBoneLocalRotation", SetBoneLocalRotation);
			Native.jvm_reg_function(env, "GetLayerName", GetLayerName);
			Native.jvm_reg_function(env, "GetLayerIndex", GetLayerIndex);
			Native.jvm_reg_function(env, "GetLayerWeight", GetLayerWeight);
			Native.jvm_reg_function(env, "SetLayerWeight", SetLayerWeight);
			Native.jvm_reg_function(env, "GetCurrentAnimatorStateInfo", GetCurrentAnimatorStateInfo);
			Native.jvm_reg_function(env, "GetNextAnimatorStateInfo", GetNextAnimatorStateInfo);
			Native.jvm_reg_function(env, "GetAnimatorTransitionInfo", GetAnimatorTransitionInfo);
			Native.jvm_reg_function(env, "GetCurrentAnimatorClipInfoCount", GetCurrentAnimatorClipInfoCount);
			Native.jvm_reg_function(env, "GetCurrentAnimatorClipInfo", GetCurrentAnimatorClipInfo);
			Native.jvm_reg_function(env, "GetNextAnimatorClipInfoCount", GetNextAnimatorClipInfoCount);
			Native.jvm_reg_function(env, "GetNextAnimatorClipInfo", GetNextAnimatorClipInfo);
			Native.jvm_reg_function(env, "IsInTransition", IsInTransition);
			Native.jvm_reg_function(env, "GetParameter", GetParameter);
			Native.jvm_reg_function(env, "MatchTarget", MatchTarget);
			Native.jvm_reg_function(env, "InterruptMatchTarget", InterruptMatchTarget);
			Native.jvm_reg_function(env, "CrossFadeInFixedTime", CrossFadeInFixedTime);
			Native.jvm_reg_function(env, "CrossFade", CrossFade);
			Native.jvm_reg_function(env, "PlayInFixedTime", PlayInFixedTime);
			Native.jvm_reg_function(env, "Play", Play);
			Native.jvm_reg_function(env, "SetTarget", SetTarget);
			Native.jvm_reg_function(env, "GetBoneTransform", GetBoneTransform);
			Native.jvm_reg_function(env, "StartPlayback", StartPlayback);
			Native.jvm_reg_function(env, "StopPlayback", StopPlayback);
			Native.jvm_reg_function(env, "StartRecording", StartRecording);
			Native.jvm_reg_function(env, "StopRecording", StopRecording);
			Native.jvm_reg_function(env, "HasState", HasState);
			Native.jvm_reg_static_function(env, "StringToHash", StringToHash_S);
			Native.jvm_reg_function(env, "Update", Update);
			Native.jvm_reg_function(env, "Rebind", Rebind);
			Native.jvm_reg_function(env, "ApplyBuiltinRootMotion", ApplyBuiltinRootMotion);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Animator", BehaviourWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Animator), jsClass);
		}
	}
}
