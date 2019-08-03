using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class QuaternionWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
				var obj = new Agent<UnityEngine.Quaternion>(new UnityEngine.Quaternion(p0, p1, p2, p3));
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr AngleAxis_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.AngleAxis(p0, p1));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ToAngleAxis(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
				obj.target.ToAngleAxis(out p0, out p1);
				JsStructs.vector3.SetJsObject(context, Native.jvm_get_arg(args, 1), p1);
				return MakeJsObjects.MakeJsArray(context, p0);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FromToRotation_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.FromToRotation(p0, p1));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetFromToRotation(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
				obj.target.SetFromToRotation(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LookRotation_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
					var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.LookRotation(p0, p1));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
				} else if (argcnt == 1) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.LookRotation(p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Slerp_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.Slerp(p0.target, p1.target, p2));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SlerpUnclamped_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.SlerpUnclamped(p0.target, p1.target, p2));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Lerp_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.Lerp(p0.target, p1.target, p2));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LerpUnclamped_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.LerpUnclamped(p0.target, p1.target, p2));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RotateTowards_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.RotateTowards(p0.target, p1.target, p2));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Inverse_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.Inverse(p0.target));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Euler_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.Euler(p0, p1, p2));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
				} else if (argcnt == 1) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var ret = new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.Euler(p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Set(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
				obj.target.Set(p0, p1, p2, p3);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Multiply_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Quaternion>))) {
					var p0 = (Agent<UnityEngine.Quaternion>)vp0;
					var p1 = (Agent<UnityEngine.Quaternion>)vp1;
					var ret = new Agent<UnityEngine.Quaternion>((p0.target*p1.target));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3))) {
					var p0 = (Agent<UnityEngine.Quaternion>)vp0;
					var p1 = (UnityEngine.Vector3)vp1;
					var ret = (p0.target*p1);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Equality_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = (p0.target==p1.target);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Inequality_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = (p0.target!=p1.target);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Dot_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = UnityEngine.Quaternion.Dot(p0.target, p1.target);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetLookRotation(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					obj.target.SetLookRotation(p0);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
					obj.target.SetLookRotation(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Angle_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = UnityEngine.Quaternion.Angle(p0.target, p1.target);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetHashCode(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.target.GetHashCode();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Equals(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.target.Equals(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ToString(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					var ret = obj.target.ToString();
					return Native.jvm_make_string(context, ret);
				} else if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var ret = obj.target.ToString(p0);
					return Native.jvm_make_string(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr xGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.x));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool xSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.x = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr yGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.y));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool ySetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.y = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr zGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.z));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool zSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.z = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr wGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.w));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool wSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.w = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr kEpsilonGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(UnityEngine.Quaternion.kEpsilon));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr eulerAnglesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.target.eulerAngles);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool eulerAnglesSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.eulerAngles = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr identityGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, new Agent<UnityEngine.Quaternion>(UnityEngine.Quaternion.identity));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Quaternion);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "x", xGetter, xSetter);
			Native.jvm_reg_property(env, "y", yGetter, ySetter);
			Native.jvm_reg_property(env, "z", zGetter, zSetter);
			Native.jvm_reg_property(env, "w", wGetter, wSetter);
			Native.jvm_reg_static_property(env, "kEpsilon", kEpsilonGetter_S, null);
			Native.jvm_reg_property(env, "eulerAngles", eulerAnglesGetter, eulerAnglesSetter);
			Native.jvm_reg_static_property(env, "identity", identityGetter_S, null);
			Native.jvm_reg_static_function(env, "AngleAxis", AngleAxis_S);
			Native.jvm_reg_function(env, "ToAngleAxis", ToAngleAxis);
			Native.jvm_reg_static_function(env, "FromToRotation", FromToRotation_S);
			Native.jvm_reg_function(env, "SetFromToRotation", SetFromToRotation);
			Native.jvm_reg_static_function(env, "LookRotation", LookRotation_S);
			Native.jvm_reg_static_function(env, "Slerp", Slerp_S);
			Native.jvm_reg_static_function(env, "SlerpUnclamped", SlerpUnclamped_S);
			Native.jvm_reg_static_function(env, "Lerp", Lerp_S);
			Native.jvm_reg_static_function(env, "LerpUnclamped", LerpUnclamped_S);
			Native.jvm_reg_static_function(env, "RotateTowards", RotateTowards_S);
			Native.jvm_reg_static_function(env, "Inverse", Inverse_S);
			Native.jvm_reg_static_function(env, "Euler", Euler_S);
			Native.jvm_reg_function(env, "Set", Set);
			Native.jvm_reg_static_function(env, "op_Multiply", op_Multiply_S);
			Native.jvm_reg_static_function(env, "op_Equality", op_Equality_S);
			Native.jvm_reg_static_function(env, "op_Inequality", op_Inequality_S);
			Native.jvm_reg_static_function(env, "Dot", Dot_S);
			Native.jvm_reg_function(env, "SetLookRotation", SetLookRotation);
			Native.jvm_reg_static_function(env, "Angle", Angle_S);
			Native.jvm_reg_function(env, "GetHashCode", GetHashCode);
			Native.jvm_reg_function(env, "Equals", Equals);
			Native.jvm_reg_function(env, "ToString", ToString);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Quaternion", IntPtr.Zero, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Quaternion), jsClass);
		}
	}
}
