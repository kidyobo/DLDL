using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class TransformWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetParent(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					obj.SetParent(p0);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					obj.SetParent(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetPositionAndRotation(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				obj.SetPositionAndRotation(p0, p1.target);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Translate(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					obj.Translate(p0);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Space))) {
						var p0 = (UnityEngine.Vector3)vp0;
						var p1 = (UnityEngine.Space)(double)vp1;
						obj.Translate(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Transform))) {
						var p0 = (UnityEngine.Vector3)vp0;
						var p1 = (UnityEngine.Transform)vp1;
						obj.Translate(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					obj.Translate(p0, p1, p2);
					return IntPtr.Zero;
				} else if (argcnt == 4) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					if (Uts.Core.CompareType(vp0, typeof(float)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(float)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Space))) {
						var p0 = (float)(double)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (float)(double)vp2;
						var p3 = (UnityEngine.Space)(double)vp3;
						obj.Translate(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(float)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(float)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Transform))) {
						var p0 = (float)(double)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (float)(double)vp2;
						var p3 = (UnityEngine.Transform)vp3;
						obj.Translate(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Rotate(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					obj.Rotate(p0);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Space))) {
						var p0 = (UnityEngine.Vector3)vp0;
						var p1 = (UnityEngine.Space)(double)vp1;
						obj.Rotate(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(float))) {
						var p0 = (UnityEngine.Vector3)vp0;
						var p1 = (float)(double)vp1;
						obj.Rotate(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 3) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					if (Uts.Core.CompareType(vp0, typeof(float)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(float))) {
						var p0 = (float)(double)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (float)(double)vp2;
						obj.Rotate(p0, p1, p2);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(float)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Space))) {
						var p0 = (UnityEngine.Vector3)vp0;
						var p1 = (float)(double)vp1;
						var p2 = (UnityEngine.Space)(double)vp2;
						obj.Rotate(p0, p1, p2);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 4) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.Space)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					obj.Rotate(p0, p1, p2, p3);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RotateAround(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
				obj.RotateAround(p0, p1, p2);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LookAt(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Transform))) {
						var p0 = (UnityEngine.Transform)vp0;
						obj.LookAt(p0);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3))) {
						var p0 = (UnityEngine.Vector3)vp0;
						obj.LookAt(p0);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Transform)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3))) {
						var p0 = (UnityEngine.Transform)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						obj.LookAt(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3))) {
						var p0 = (UnityEngine.Vector3)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						obj.LookAt(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr TransformDirection(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var ret = obj.TransformDirection(p0);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var ret = obj.TransformDirection(p0, p1, p2);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr InverseTransformDirection(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var ret = obj.InverseTransformDirection(p0);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var ret = obj.InverseTransformDirection(p0, p1, p2);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr TransformVector(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var ret = obj.TransformVector(p0);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var ret = obj.TransformVector(p0, p1, p2);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr InverseTransformVector(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var ret = obj.InverseTransformVector(p0);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var ret = obj.InverseTransformVector(p0, p1, p2);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr TransformPoint(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var ret = obj.TransformPoint(p0);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var ret = obj.TransformPoint(p0, p1, p2);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr InverseTransformPoint(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
					var ret = obj.InverseTransformPoint(p0);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var ret = obj.InverseTransformPoint(p0, p1, p2);
					return JsStructs.vector3.ToJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DetachChildren(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.DetachChildren();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetAsFirstSibling(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.SetAsFirstSibling();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetAsLastSibling(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.SetAsLastSibling();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetSiblingIndex(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.SetSiblingIndex(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetSiblingIndex(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetSiblingIndex();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Find(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = obj.Find(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsChildOf(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.IsChildOf(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetEnumerator(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetEnumerator();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetChild(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetChild(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr positionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.position);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool positionSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.position = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr localPositionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.localPosition);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool localPositionSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.localPosition = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr eulerAnglesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.eulerAngles);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool eulerAnglesSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.eulerAngles = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr localEulerAnglesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.localEulerAngles);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool localEulerAnglesSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.localEulerAngles = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr rightGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.right);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool rightSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.right = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr upGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.up);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool upSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.up = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr forwardGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.forward);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool forwardSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.forward = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr rotationGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, new Agent<UnityEngine.Quaternion>(obj.rotation));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool rotationSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.rotation = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, arg)).target;
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr localRotationGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Quaternion>(context, new Agent<UnityEngine.Quaternion>(obj.localRotation));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool localRotationSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.localRotation = ((Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, arg)).target;
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr localScaleGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.localScale);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool localScaleSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.localScale = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr parentGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.parent);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool parentSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.parent = (UnityEngine.Transform)ToCsObjects.ToObject(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr worldToLocalMatrixGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.worldToLocalMatrix);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr localToWorldMatrixGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.localToWorldMatrix);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr rootGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.root);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr childCountGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.childCount));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr lossyScaleGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return JsStructs.vector3.ToJsObject(context, obj.lossyScale);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr hasChangedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.hasChanged);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool hasChangedSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.hasChanged = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr hierarchyCapacityGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.hierarchyCapacity));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool hierarchyCapacitySetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				obj.hierarchyCapacity = (int)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr hierarchyCountGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((UnityEngine.Transform)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.hierarchyCount));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Transform);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "position", positionGetter, positionSetter);
			Native.jvm_reg_property(env, "localPosition", localPositionGetter, localPositionSetter);
			Native.jvm_reg_property(env, "eulerAngles", eulerAnglesGetter, eulerAnglesSetter);
			Native.jvm_reg_property(env, "localEulerAngles", localEulerAnglesGetter, localEulerAnglesSetter);
			Native.jvm_reg_property(env, "right", rightGetter, rightSetter);
			Native.jvm_reg_property(env, "up", upGetter, upSetter);
			Native.jvm_reg_property(env, "forward", forwardGetter, forwardSetter);
			Native.jvm_reg_property(env, "rotation", rotationGetter, rotationSetter);
			Native.jvm_reg_property(env, "localRotation", localRotationGetter, localRotationSetter);
			Native.jvm_reg_property(env, "localScale", localScaleGetter, localScaleSetter);
			Native.jvm_reg_property(env, "parent", parentGetter, parentSetter);
			Native.jvm_reg_property(env, "worldToLocalMatrix", worldToLocalMatrixGetter, null);
			Native.jvm_reg_property(env, "localToWorldMatrix", localToWorldMatrixGetter, null);
			Native.jvm_reg_property(env, "root", rootGetter, null);
			Native.jvm_reg_property(env, "childCount", childCountGetter, null);
			Native.jvm_reg_property(env, "lossyScale", lossyScaleGetter, null);
			Native.jvm_reg_property(env, "hasChanged", hasChangedGetter, hasChangedSetter);
			Native.jvm_reg_property(env, "hierarchyCapacity", hierarchyCapacityGetter, hierarchyCapacitySetter);
			Native.jvm_reg_property(env, "hierarchyCount", hierarchyCountGetter, null);
			Native.jvm_reg_function(env, "SetParent", SetParent);
			Native.jvm_reg_function(env, "SetPositionAndRotation", SetPositionAndRotation);
			Native.jvm_reg_function(env, "Translate", Translate);
			Native.jvm_reg_function(env, "Rotate", Rotate);
			Native.jvm_reg_function(env, "RotateAround", RotateAround);
			Native.jvm_reg_function(env, "LookAt", LookAt);
			Native.jvm_reg_function(env, "TransformDirection", TransformDirection);
			Native.jvm_reg_function(env, "InverseTransformDirection", InverseTransformDirection);
			Native.jvm_reg_function(env, "TransformVector", TransformVector);
			Native.jvm_reg_function(env, "InverseTransformVector", InverseTransformVector);
			Native.jvm_reg_function(env, "TransformPoint", TransformPoint);
			Native.jvm_reg_function(env, "InverseTransformPoint", InverseTransformPoint);
			Native.jvm_reg_function(env, "DetachChildren", DetachChildren);
			Native.jvm_reg_function(env, "SetAsFirstSibling", SetAsFirstSibling);
			Native.jvm_reg_function(env, "SetAsLastSibling", SetAsLastSibling);
			Native.jvm_reg_function(env, "SetSiblingIndex", SetSiblingIndex);
			Native.jvm_reg_function(env, "GetSiblingIndex", GetSiblingIndex);
			Native.jvm_reg_function(env, "Find", Find);
			Native.jvm_reg_function(env, "IsChildOf", IsChildOf);
			Native.jvm_reg_function(env, "GetEnumerator", GetEnumerator);
			Native.jvm_reg_function(env, "GetChild", GetChild);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Transform", ComponentWrap.jsClass, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Transform), jsClass);
		}
	}
}
