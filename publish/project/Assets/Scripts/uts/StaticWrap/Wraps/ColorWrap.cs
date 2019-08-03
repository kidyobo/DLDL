using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ColorWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 4) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var obj = new Agent<UnityEngine.Color>(new UnityEngine.Color(p0, p1, p2, p3));
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var obj = new Agent<UnityEngine.Color>(new UnityEngine.Color(p0, p1, p2));
					return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ToString(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
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
		public static IntPtr GetHashCode(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.target.GetHashCode();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Equals(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.target.Equals(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Addition_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Color>((p0.target+p1.target));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Subtraction_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Color>((p0.target-p1.target));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Multiply_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Color>)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Color>))) {
					var p0 = (Agent<UnityEngine.Color>)vp0;
					var p1 = (Agent<UnityEngine.Color>)vp1;
					var ret = new Agent<UnityEngine.Color>((p0.target*p1.target));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Color>)) && Uts.Core.CompareType(vp1, typeof(float))) {
					var p0 = (Agent<UnityEngine.Color>)vp0;
					var p1 = (float)(double)vp1;
					var ret = new Agent<UnityEngine.Color>((p0.target*p1));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(float)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.Color>))) {
					var p0 = (float)(double)vp0;
					var p1 = (Agent<UnityEngine.Color>)vp1;
					var ret = new Agent<UnityEngine.Color>((p0*p1.target));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Division_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var ret = new Agent<UnityEngine.Color>((p0.target/p1));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Equality_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = (p0.target==p1.target);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Inequality_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var ret = (p0.target!=p1.target);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Lerp_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var ret = new Agent<UnityEngine.Color>(UnityEngine.Color.Lerp(p0.target, p1.target, p2));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LerpUnclamped_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var ret = new Agent<UnityEngine.Color>(UnityEngine.Color.LerpUnclamped(p0.target, p1.target, p2));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr op_Implicit_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Color>))) {
					var p0 = (Agent<UnityEngine.Color>)vp0;
					var ret = new Agent<UnityEngine.Vector4>((p0.target));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Vector4>))) {
					var p0 = (Agent<UnityEngine.Vector4>)vp0;
					var ret = new Agent<UnityEngine.Color>((p0.target));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RGBToHSV_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				var p3 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
				UnityEngine.Color.RGBToHSV(p0.target, out p1, out p2, out p3);
				return MakeJsObjects.MakeJsArray(context, p1, p2, p3);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr HSVToRGB_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var ret = new Agent<UnityEngine.Color>(UnityEngine.Color.HSVToRGB(p0, p1, p2));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
				} else if (argcnt == 4) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 3));
					var ret = new Agent<UnityEngine.Color>(UnityEngine.Color.HSVToRGB(p0, p1, p2, p3));
					return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr rGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.r));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool rSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.r = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr gGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.g));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool gSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.g = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr bGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.b));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool bSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.b = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr aGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.a));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool aSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				obj.target.a = (float)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr redGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(UnityEngine.Color.red));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr greenGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(UnityEngine.Color.green));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr blueGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(UnityEngine.Color.blue));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr whiteGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(UnityEngine.Color.white));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr blackGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(UnityEngine.Color.black));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr yellowGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(UnityEngine.Color.yellow));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr cyanGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(UnityEngine.Color.cyan));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr magentaGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(UnityEngine.Color.magenta));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr grayGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(UnityEngine.Color.gray));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr greyGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(UnityEngine.Color.grey));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr clearGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(UnityEngine.Color.clear));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr grayscaleGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.grayscale));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr linearGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(obj.target.linear));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr gammaGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, new Agent<UnityEngine.Color>(obj.target.gamma));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr maxColorComponentGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((Agent<UnityEngine.Color>)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.target.maxColorComponent));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Color);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "r", rGetter, rSetter);
			Native.jvm_reg_property(env, "g", gGetter, gSetter);
			Native.jvm_reg_property(env, "b", bGetter, bSetter);
			Native.jvm_reg_property(env, "a", aGetter, aSetter);
			Native.jvm_reg_static_property(env, "red", redGetter_S, null);
			Native.jvm_reg_static_property(env, "green", greenGetter_S, null);
			Native.jvm_reg_static_property(env, "blue", blueGetter_S, null);
			Native.jvm_reg_static_property(env, "white", whiteGetter_S, null);
			Native.jvm_reg_static_property(env, "black", blackGetter_S, null);
			Native.jvm_reg_static_property(env, "yellow", yellowGetter_S, null);
			Native.jvm_reg_static_property(env, "cyan", cyanGetter_S, null);
			Native.jvm_reg_static_property(env, "magenta", magentaGetter_S, null);
			Native.jvm_reg_static_property(env, "gray", grayGetter_S, null);
			Native.jvm_reg_static_property(env, "grey", greyGetter_S, null);
			Native.jvm_reg_static_property(env, "clear", clearGetter_S, null);
			Native.jvm_reg_property(env, "grayscale", grayscaleGetter, null);
			Native.jvm_reg_property(env, "linear", linearGetter, null);
			Native.jvm_reg_property(env, "gamma", gammaGetter, null);
			Native.jvm_reg_property(env, "maxColorComponent", maxColorComponentGetter, null);
			Native.jvm_reg_function(env, "ToString", ToString);
			Native.jvm_reg_function(env, "GetHashCode", GetHashCode);
			Native.jvm_reg_function(env, "Equals", Equals);
			Native.jvm_reg_static_function(env, "op_Addition", op_Addition_S);
			Native.jvm_reg_static_function(env, "op_Subtraction", op_Subtraction_S);
			Native.jvm_reg_static_function(env, "op_Multiply", op_Multiply_S);
			Native.jvm_reg_static_function(env, "op_Division", op_Division_S);
			Native.jvm_reg_static_function(env, "op_Equality", op_Equality_S);
			Native.jvm_reg_static_function(env, "op_Inequality", op_Inequality_S);
			Native.jvm_reg_static_function(env, "Lerp", Lerp_S);
			Native.jvm_reg_static_function(env, "LerpUnclamped", LerpUnclamped_S);
			Native.jvm_reg_static_function(env, "op_Implicit", op_Implicit_S);
			Native.jvm_reg_static_function(env, "RGBToHSV", RGBToHSV_S);
			Native.jvm_reg_static_function(env, "HSVToRGB", HSVToRGB_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Color", IntPtr.Zero, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Color), jsClass);
		}
	}
}
