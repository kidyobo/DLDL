using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class Vector4Wrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 4) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var obj = new Agent<UnityEngine.Vector4>(new UnityEngine.Vector4(p0, p1, p2, p3));
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var obj = new Agent<UnityEngine.Vector4>(new UnityEngine.Vector4(p0, p1, p2));
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else if (argcnt == 2) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var obj = new Agent<UnityEngine.Vector4>(new UnityEngine.Vector4(p0, p1));
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Set(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
				obj.target.Set(p0, p1, p2, p3);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Lerp_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var ret = new Agent<UnityEngine.Vector4>(UnityEngine.Vector4.Lerp(p0.target, p1.target, p2));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LerpUnclamped_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var ret = new Agent<UnityEngine.Vector4>(UnityEngine.Vector4.LerpUnclamped(p0.target, p1.target, p2));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr MoveTowards_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var ret = new Agent<UnityEngine.Vector4>(UnityEngine.Vector4.MoveTowards(p0.target, p1.target, p2));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Scale_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Vector4>(UnityEngine.Vector4.Scale(p0.target, p1.target));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Scale(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.target.Scale(p0.target);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetHashCode(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.target.GetHashCode();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Equals(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.target.Equals(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Normalize_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = new Agent<UnityEngine.Vector4>(UnityEngine.Vector4.Normalize(p0.target));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Normalize(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.Normalize();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Dot_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = UnityEngine.Vector4.Dot(p0.target, p1.target);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Project_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Vector4>(UnityEngine.Vector4.Project(p0.target, p1.target));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Distance_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = UnityEngine.Vector4.Distance(p0.target, p1.target);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Magnitude_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.Vector4.Magnitude(p0.target);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Min_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Vector4>(UnityEngine.Vector4.Min(p0.target, p1.target));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Max_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Vector4>(UnityEngine.Vector4.Max(p0.target, p1.target));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Addition_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Vector4>((p0.target+p1.target));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Subtraction_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Vector4>((p0.target-p1.target));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_UnaryNegation_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = new Agent<UnityEngine.Vector4>((-p0.target));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Multiply_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Vector4>)) && Uts.Core.CompareType(vp1, typeof(float))) {
					var p0 = (Agent<UnityEngine.Vector4>)vp0;
					var p1 = (float)(double)vp1;
					var ret = new Agent<UnityEngine.Vector4>((p0.target*p1));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(float)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Vector4>))) {
					var p0 = (float)(double)vp0;
					var p1 = (Agent<UnityEngine.Vector4>)vp1;
					var ret = new Agent<UnityEngine.Vector4>((p0*p1.target));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Division_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Vector4>((p0.target/p1));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Equality_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = (p0.target==p1.target);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Inequality_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = (p0.target!=p1.target);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Implicit_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3))) {
					var p0 = (UnityEngine.Vector3)vp0;
					var ret = new Agent<UnityEngine.Vector4>((p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Vector4>))) {
					var p0 = (Agent<UnityEngine.Vector4>)vp0;
					var ret = (p0.target);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector2))) {
					var p0 = (UnityEngine.Vector2)vp0;
					var ret = new Agent<UnityEngine.Vector4>((p0));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Vector4>))) {
					var p0 = (Agent<UnityEngine.Vector4>)vp0;
					var ret = (p0.target);
					return JsStructs.vector2.ToJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ToString(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
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
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SqrMagnitude_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.Vector4.SqrMagnitude(p0.target);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SqrMagnitude(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.target.SqrMagnitude();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr kEpsilonGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(UnityEngine.Vector4.kEpsilon));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr xGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.x));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool xSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.x = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr yGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.y));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool ySetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.y = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr zGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.z));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool zSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.z = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr wGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.w));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool wSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.w = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr normalizedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, new Agent<UnityEngine.Vector4>(obj.target.normalized));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr magnitudeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.magnitude));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr sqrMagnitudeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Vector4>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.sqrMagnitude));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr zeroGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, new Agent<UnityEngine.Vector4>(UnityEngine.Vector4.zero));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr oneGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, new Agent<UnityEngine.Vector4>(UnityEngine.Vector4.one));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Vector4);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "kEpsilon", kEpsilonGetter_S, null);
			Native.jvm_reg_property(env, "x", xGetter, xSetter);
			Native.jvm_reg_property(env, "y", yGetter, ySetter);
			Native.jvm_reg_property(env, "z", zGetter, zSetter);
			Native.jvm_reg_property(env, "w", wGetter, wSetter);
			Native.jvm_reg_property(env, "normalized", normalizedGetter, null);
			Native.jvm_reg_property(env, "magnitude", magnitudeGetter, null);
			Native.jvm_reg_property(env, "sqrMagnitude", sqrMagnitudeGetter, null);
			Native.jvm_reg_static_property(env, "zero", zeroGetter_S, null);
			Native.jvm_reg_static_property(env, "one", oneGetter_S, null);
			Native.jvm_reg_function(env, "Set", Set);
			Native.jvm_reg_static_function(env, "Lerp", Lerp_S);
			Native.jvm_reg_static_function(env, "LerpUnclamped", LerpUnclamped_S);
			Native.jvm_reg_static_function(env, "MoveTowards", MoveTowards_S);
			Native.jvm_reg_static_function(env, "Scale", Scale_S);
			Native.jvm_reg_function(env, "Scale", Scale);
			Native.jvm_reg_function(env, "GetHashCode", GetHashCode);
			Native.jvm_reg_function(env, "Equals", Equals);
			Native.jvm_reg_static_function(env, "Normalize", Normalize_S);
			Native.jvm_reg_function(env, "Normalize", Normalize);
			Native.jvm_reg_static_function(env, "Dot", Dot_S);
			Native.jvm_reg_static_function(env, "Project", Project_S);
			Native.jvm_reg_static_function(env, "Distance", Distance_S);
			Native.jvm_reg_static_function(env, "Magnitude", Magnitude_S);
			Native.jvm_reg_static_function(env, "Min", Min_S);
			Native.jvm_reg_static_function(env, "Max", Max_S);
			Native.jvm_reg_static_function(env, "op_Addition", op_Addition_S);
			Native.jvm_reg_static_function(env, "op_Subtraction", op_Subtraction_S);
			Native.jvm_reg_static_function(env, "op_UnaryNegation", op_UnaryNegation_S);
			Native.jvm_reg_static_function(env, "op_Multiply", op_Multiply_S);
			Native.jvm_reg_static_function(env, "op_Division", op_Division_S);
			Native.jvm_reg_static_function(env, "op_Equality", op_Equality_S);
			Native.jvm_reg_static_function(env, "op_Inequality", op_Inequality_S);
			Native.jvm_reg_static_function(env, "op_Implicit", op_Implicit_S);
			Native.jvm_reg_function(env, "ToString", ToString);
			Native.jvm_reg_static_function(env, "SqrMagnitude", SqrMagnitude_S);
			Native.jvm_reg_function(env, "SqrMagnitude", SqrMagnitude);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Vector4", IntPtr.Zero, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Vector4), jsClass);
		}
	}
}
