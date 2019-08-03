using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class TypeWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Equals(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(object))) {
					var p0 = vp0;
					var ret = obj.Equals(p0);
					return Native.jvm_make_boolean(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(System.Type))) {
					var p0 = (System.Type)vp0;
					var ret = obj.Equals(p0);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var ret = System.Type.GetType(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					var ret = System.Type.GetType(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
					var ret = System.Type.GetType(p0, p1, p2);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetTypeArray_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = ToCsObjects.ToArray<object>(context, Native.jvm_get_arg(args, 0));
				var ret = System.Type.GetTypeArray(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetTypeCode_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = System.Type.GetTypeCode(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetTypeFromCLSID_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 1) {
					var p0 = (System.Guid)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var ret = System.Type.GetTypeFromCLSID(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(System.Guid)) && Uts.Core.CompareType(vp1, typeof(bool))) {
						var p0 = (System.Guid)vp0;
						var p1 = (bool)vp1;
						var ret = System.Type.GetTypeFromCLSID(p0, p1);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(System.Guid)) && Uts.Core.CompareType(vp1, typeof(string))) {
						var p0 = (System.Guid)vp0;
						var p1 = (string)vp1;
						var ret = System.Type.GetTypeFromCLSID(p0, p1);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 3) {
					var p0 = (System.Guid)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
					var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
					var ret = System.Type.GetTypeFromCLSID(p0, p1, p2);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetTypeFromHandle_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (System.RuntimeTypeHandle)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = System.Type.GetTypeFromHandle(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetTypeFromProgID_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var ret = System.Type.GetTypeFromProgID(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(bool))) {
						var p0 = (string)vp0;
						var p1 = (bool)vp1;
						var ret = System.Type.GetTypeFromProgID(p0, p1);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(string))) {
						var p0 = (string)vp0;
						var p1 = (string)vp1;
						var ret = System.Type.GetTypeFromProgID(p0, p1);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 3) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
					var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
					var ret = System.Type.GetTypeFromProgID(p0, p1, p2);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetTypeHandle_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var ret = System.Type.GetTypeHandle(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetType();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsSubclassOf(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.IsSubclassOf(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindInterfaces(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.Reflection.TypeFilter)Uts.DelegateUtil.CreateDelegateRt<System.Type, object, bool, System.Reflection.TypeFilter>(context, Native.jvm_get_arg(args, 0));
				var p1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				var ret = obj.FindInterfaces(p0, p1);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetInterface(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetInterface(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
					var ret = obj.GetInterface(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetInterfaceMap(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.GetInterfaceMap(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetInterfaces(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetInterfaces();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsAssignableFrom(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.IsAssignableFrom(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsInstanceOfType(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var ret = obj.IsInstanceOfType(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetArrayRank(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetArrayRank();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetElementType(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetElementType();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetEvent(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetEvent(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var ret = obj.GetEvent(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetEvents(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					var ret = obj.GetEvents();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 1) {
					var p0 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetEvents(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetField(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetField(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var ret = obj.GetField(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetFields(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					var ret = obj.GetFields();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 1) {
					var p0 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetFields(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetHashCode(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetHashCode();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetMember(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetMember(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var ret = obj.GetMember(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.MemberTypes)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var ret = obj.GetMember(p0, p1, p2);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetMembers(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					var ret = obj.GetMembers();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 1) {
					var p0 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetMembers(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetMethod(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetMethod(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(System.Reflection.BindingFlags))) {
						var p0 = (string)vp0;
						var p1 = (System.Reflection.BindingFlags)(double)vp1;
						var ret = obj.GetMethod(p0, p1);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(System.Type[]))) {
						var p0 = (string)vp0;
						var p1 = ToCsObjects.ToArray<System.Type>(vp1);
						var ret = obj.GetMethod(p0, p1);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 3) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = ToCsObjects.ToArray<System.Type>(context, Native.jvm_get_arg(args, 1));
					var p2 = ToCsObjects.ToArray<System.Reflection.ParameterModifier>(context, Native.jvm_get_arg(args, 2));
					var ret = obj.GetMethod(p0, p1, p2);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 5) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (System.Reflection.Binder)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = ToCsObjects.ToArray<System.Type>(context, Native.jvm_get_arg(args, 3));
					var p4 = ToCsObjects.ToArray<System.Reflection.ParameterModifier>(context, Native.jvm_get_arg(args, 4));
					var ret = obj.GetMethod(p0, p1, p2, p3, p4);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 6) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (System.Reflection.Binder)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (System.Reflection.CallingConventions)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = ToCsObjects.ToArray<System.Type>(context, Native.jvm_get_arg(args, 4));
					var p5 = ToCsObjects.ToArray<System.Reflection.ParameterModifier>(context, Native.jvm_get_arg(args, 5));
					var ret = obj.GetMethod(p0, p1, p2, p3, p4, p5);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetMethods(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					var ret = obj.GetMethods();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 1) {
					var p0 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetMethods(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetNestedType(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetNestedType(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var ret = obj.GetNestedType(p0, p1);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetNestedTypes(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					var ret = obj.GetNestedTypes();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 1) {
					var p0 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetNestedTypes(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetProperties(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					var ret = obj.GetProperties();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 1) {
					var p0 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetProperties(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetProperty(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetProperty(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(System.Reflection.BindingFlags))) {
						var p0 = (string)vp0;
						var p1 = (System.Reflection.BindingFlags)(double)vp1;
						var ret = obj.GetProperty(p0, p1);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(System.Type))) {
						var p0 = (string)vp0;
						var p1 = (System.Type)vp1;
						var ret = obj.GetProperty(p0, p1);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else if (Uts.Core.CompareType(vp0, typeof(string)) && Uts.Core.CompareType(vp1, typeof(System.Type[]))) {
						var p0 = (string)vp0;
						var p1 = ToCsObjects.ToArray<System.Type>(vp1);
						var ret = obj.GetProperty(p0, p1);
						return MakeJsObjects.MakeJsObject(context, ret);
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 3) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = ToCsObjects.ToArray<System.Type>(context, Native.jvm_get_arg(args, 2));
					var ret = obj.GetProperty(p0, p1, p2);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 4) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = ToCsObjects.ToArray<System.Type>(context, Native.jvm_get_arg(args, 2));
					var p3 = ToCsObjects.ToArray<System.Reflection.ParameterModifier>(context, Native.jvm_get_arg(args, 3));
					var ret = obj.GetProperty(p0, p1, p2, p3);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 6) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (System.Reflection.Binder)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (System.Type)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = ToCsObjects.ToArray<System.Type>(context, Native.jvm_get_arg(args, 4));
					var p5 = ToCsObjects.ToArray<System.Reflection.ParameterModifier>(context, Native.jvm_get_arg(args, 5));
					var ret = obj.GetProperty(p0, p1, p2, p3, p4, p5);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetConstructor(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 1) {
					var p0 = ToCsObjects.ToArray<System.Type>(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetConstructor(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 4) {
					var p0 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.Binder)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = ToCsObjects.ToArray<System.Type>(context, Native.jvm_get_arg(args, 2));
					var p3 = ToCsObjects.ToArray<System.Reflection.ParameterModifier>(context, Native.jvm_get_arg(args, 3));
					var ret = obj.GetConstructor(p0, p1, p2, p3);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 5) {
					var p0 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.Binder)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (System.Reflection.CallingConventions)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = ToCsObjects.ToArray<System.Type>(context, Native.jvm_get_arg(args, 3));
					var p4 = ToCsObjects.ToArray<System.Reflection.ParameterModifier>(context, Native.jvm_get_arg(args, 4));
					var ret = obj.GetConstructor(p0, p1, p2, p3, p4);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetConstructors(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					var ret = obj.GetConstructors();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 1) {
					var p0 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.GetConstructors(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetDefaultMembers(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetDefaultMembers();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindMembers(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (System.Reflection.MemberTypes)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				var p2 = (System.Reflection.MemberFilter)Uts.DelegateUtil.CreateDelegateRt<System.Reflection.MemberInfo, object, bool, System.Reflection.MemberFilter>(context, Native.jvm_get_arg(args, 2));
				var p3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
				var ret = obj.FindMembers(p0, p1, p2, p3);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr InvokeMember(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 5) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (System.Reflection.Binder)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var p4 = ToCsObjects.ToArray<object>(context, Native.jvm_get_arg(args, 4));
					var ret = obj.InvokeMember(p0, p1, p2, p3, p4);
					return MakeJsObjects.MakeVarJsObject(context, ret);
				} else if (argcnt == 6) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (System.Reflection.Binder)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var p4 = ToCsObjects.ToArray<object>(context, Native.jvm_get_arg(args, 4));
					var p5 = (System.Globalization.CultureInfo)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 5));
					var ret = obj.InvokeMember(p0, p1, p2, p3, p4, p5);
					return MakeJsObjects.MakeVarJsObject(context, ret);
				} else if (argcnt == 8) {
					var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
					var p1 = (System.Reflection.BindingFlags)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (System.Reflection.Binder)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var p4 = ToCsObjects.ToArray<object>(context, Native.jvm_get_arg(args, 4));
					var p5 = ToCsObjects.ToArray<System.Reflection.ParameterModifier>(context, Native.jvm_get_arg(args, 5));
					var p6 = (System.Globalization.CultureInfo)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 6));
					var p7 = ToCsObjects.ToArray<string>(context, Native.jvm_get_arg(args, 7));
					var ret = obj.InvokeMember(p0, p1, p2, p3, p4, p5, p6, p7);
					return MakeJsObjects.MakeVarJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ToString(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ToString();
				return Native.jvm_make_string(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGenericArguments(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetGenericArguments();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGenericTypeDefinition(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetGenericTypeDefinition();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr MakeGenericType(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToArray<System.Type>(context, Native.jvm_get_arg(args, 0));
				var ret = obj.MakeGenericType(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetGenericParameterConstraints(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetGenericParameterConstraints();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr MakeArrayType(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				if (argcnt == 0) {
					var ret = obj.MakeArrayType();
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 1) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var ret = obj.MakeArrayType(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr MakeByRefType(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.MakeByRefType();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr MakePointerType(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.MakePointerType();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReflectionOnlyGetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
				var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
				var ret = System.Type.ReflectionOnlyGetType(p0, p1, p2);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DelimiterGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(System.Type.Delimiter));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr EmptyTypesGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, System.Type.EmptyTypes);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FilterAttributeGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, System.Type.FilterAttribute);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FilterNameGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, System.Type.FilterName);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FilterNameIgnoreCaseGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, System.Type.FilterNameIgnoreCase);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr MissingGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeVarJsObject(context, System.Type.Missing);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr AssemblyGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.Assembly);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr AssemblyQualifiedNameGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_string(context, obj.AssemblyQualifiedName);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr AttributesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.Attributes));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr BaseTypeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.BaseType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr DeclaringTypeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.DeclaringType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DefaultBinderGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, System.Type.DefaultBinder);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr FullNameGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_string(context, obj.FullName);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr GUIDGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.GUID);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr HasElementTypeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.HasElementType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsAbstractGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsAbstract);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsAnsiClassGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsAnsiClass);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsArrayGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsArray);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsAutoClassGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsAutoClass);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsAutoLayoutGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsAutoLayout);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsByRefGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsByRef);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsClassGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsClass);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsCOMObjectGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsCOMObject);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsContextfulGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsContextful);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsEnumGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsEnum);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsExplicitLayoutGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsExplicitLayout);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsImportGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsImport);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsInterfaceGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsInterface);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsLayoutSequentialGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsLayoutSequential);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsMarshalByRefGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsMarshalByRef);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsNestedAssemblyGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsNestedAssembly);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsNestedFamANDAssemGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsNestedFamANDAssem);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsNestedFamilyGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsNestedFamily);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsNestedFamORAssemGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsNestedFamORAssem);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsNestedPrivateGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsNestedPrivate);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsNestedPublicGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsNestedPublic);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsNotPublicGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsNotPublic);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsPointerGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsPointer);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsPrimitiveGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsPrimitive);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsPublicGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsPublic);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsSealedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsSealed);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsSerializableGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsSerializable);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsSpecialNameGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsSpecialName);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsUnicodeClassGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsUnicodeClass);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsValueTypeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsValueType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr MemberTypeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.MemberType));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr ModuleGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.Module);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr NamespaceGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_string(context, obj.Namespace);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr ReflectedTypeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.ReflectedType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr TypeHandleGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.TypeHandle);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr TypeInitializerGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.TypeInitializer);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr UnderlyingSystemTypeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.UnderlyingSystemType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr ContainsGenericParametersGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.ContainsGenericParameters);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsGenericTypeDefinitionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsGenericTypeDefinition);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsGenericTypeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsGenericType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsGenericParameterGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsGenericParameter);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsNestedGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsNested);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsVisibleGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsVisible);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr GenericParameterPositionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.GenericParameterPosition));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr GenericParameterAttributesGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.GenericParameterAttributes));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr DeclaringMethodGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.DeclaringMethod);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr StructLayoutAttributeGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((System.Type)ToCsObjects.ToCsObject(context, thisObj));
				return MakeJsObjects.MakeJsObject(context, obj.StructLayoutAttribute);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "Delimiter", DelimiterGetter_S, null);
			Native.jvm_reg_static_property(env, "EmptyTypes", EmptyTypesGetter_S, null);
			Native.jvm_reg_static_property(env, "FilterAttribute", FilterAttributeGetter_S, null);
			Native.jvm_reg_static_property(env, "FilterName", FilterNameGetter_S, null);
			Native.jvm_reg_static_property(env, "FilterNameIgnoreCase", FilterNameIgnoreCaseGetter_S, null);
			Native.jvm_reg_static_property(env, "Missing", MissingGetter_S, null);
			Native.jvm_reg_property(env, "Assembly", AssemblyGetter, null);
			Native.jvm_reg_property(env, "AssemblyQualifiedName", AssemblyQualifiedNameGetter, null);
			Native.jvm_reg_property(env, "Attributes", AttributesGetter, null);
			Native.jvm_reg_property(env, "BaseType", BaseTypeGetter, null);
			Native.jvm_reg_property(env, "DeclaringType", DeclaringTypeGetter, null);
			Native.jvm_reg_static_property(env, "DefaultBinder", DefaultBinderGetter_S, null);
			Native.jvm_reg_property(env, "FullName", FullNameGetter, null);
			Native.jvm_reg_property(env, "GUID", GUIDGetter, null);
			Native.jvm_reg_property(env, "HasElementType", HasElementTypeGetter, null);
			Native.jvm_reg_property(env, "IsAbstract", IsAbstractGetter, null);
			Native.jvm_reg_property(env, "IsAnsiClass", IsAnsiClassGetter, null);
			Native.jvm_reg_property(env, "IsArray", IsArrayGetter, null);
			Native.jvm_reg_property(env, "IsAutoClass", IsAutoClassGetter, null);
			Native.jvm_reg_property(env, "IsAutoLayout", IsAutoLayoutGetter, null);
			Native.jvm_reg_property(env, "IsByRef", IsByRefGetter, null);
			Native.jvm_reg_property(env, "IsClass", IsClassGetter, null);
			Native.jvm_reg_property(env, "IsCOMObject", IsCOMObjectGetter, null);
			Native.jvm_reg_property(env, "IsContextful", IsContextfulGetter, null);
			Native.jvm_reg_property(env, "IsEnum", IsEnumGetter, null);
			Native.jvm_reg_property(env, "IsExplicitLayout", IsExplicitLayoutGetter, null);
			Native.jvm_reg_property(env, "IsImport", IsImportGetter, null);
			Native.jvm_reg_property(env, "IsInterface", IsInterfaceGetter, null);
			Native.jvm_reg_property(env, "IsLayoutSequential", IsLayoutSequentialGetter, null);
			Native.jvm_reg_property(env, "IsMarshalByRef", IsMarshalByRefGetter, null);
			Native.jvm_reg_property(env, "IsNestedAssembly", IsNestedAssemblyGetter, null);
			Native.jvm_reg_property(env, "IsNestedFamANDAssem", IsNestedFamANDAssemGetter, null);
			Native.jvm_reg_property(env, "IsNestedFamily", IsNestedFamilyGetter, null);
			Native.jvm_reg_property(env, "IsNestedFamORAssem", IsNestedFamORAssemGetter, null);
			Native.jvm_reg_property(env, "IsNestedPrivate", IsNestedPrivateGetter, null);
			Native.jvm_reg_property(env, "IsNestedPublic", IsNestedPublicGetter, null);
			Native.jvm_reg_property(env, "IsNotPublic", IsNotPublicGetter, null);
			Native.jvm_reg_property(env, "IsPointer", IsPointerGetter, null);
			Native.jvm_reg_property(env, "IsPrimitive", IsPrimitiveGetter, null);
			Native.jvm_reg_property(env, "IsPublic", IsPublicGetter, null);
			Native.jvm_reg_property(env, "IsSealed", IsSealedGetter, null);
			Native.jvm_reg_property(env, "IsSerializable", IsSerializableGetter, null);
			Native.jvm_reg_property(env, "IsSpecialName", IsSpecialNameGetter, null);
			Native.jvm_reg_property(env, "IsUnicodeClass", IsUnicodeClassGetter, null);
			Native.jvm_reg_property(env, "IsValueType", IsValueTypeGetter, null);
			Native.jvm_reg_property(env, "MemberType", MemberTypeGetter, null);
			Native.jvm_reg_property(env, "Module", ModuleGetter, null);
			Native.jvm_reg_property(env, "Namespace", NamespaceGetter, null);
			Native.jvm_reg_property(env, "ReflectedType", ReflectedTypeGetter, null);
			Native.jvm_reg_property(env, "TypeHandle", TypeHandleGetter, null);
			Native.jvm_reg_property(env, "TypeInitializer", TypeInitializerGetter, null);
			Native.jvm_reg_property(env, "UnderlyingSystemType", UnderlyingSystemTypeGetter, null);
			Native.jvm_reg_property(env, "ContainsGenericParameters", ContainsGenericParametersGetter, null);
			Native.jvm_reg_property(env, "IsGenericTypeDefinition", IsGenericTypeDefinitionGetter, null);
			Native.jvm_reg_property(env, "IsGenericType", IsGenericTypeGetter, null);
			Native.jvm_reg_property(env, "IsGenericParameter", IsGenericParameterGetter, null);
			Native.jvm_reg_property(env, "IsNested", IsNestedGetter, null);
			Native.jvm_reg_property(env, "IsVisible", IsVisibleGetter, null);
			Native.jvm_reg_property(env, "GenericParameterPosition", GenericParameterPositionGetter, null);
			Native.jvm_reg_property(env, "GenericParameterAttributes", GenericParameterAttributesGetter, null);
			Native.jvm_reg_property(env, "DeclaringMethod", DeclaringMethodGetter, null);
			Native.jvm_reg_property(env, "StructLayoutAttribute", StructLayoutAttributeGetter, null);
			Native.jvm_reg_function(env, "Equals", Equals);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			Native.jvm_reg_static_function(env, "GetTypeArray", GetTypeArray_S);
			Native.jvm_reg_static_function(env, "GetTypeCode", GetTypeCode_S);
			Native.jvm_reg_static_function(env, "GetTypeFromCLSID", GetTypeFromCLSID_S);
			Native.jvm_reg_static_function(env, "GetTypeFromHandle", GetTypeFromHandle_S);
			Native.jvm_reg_static_function(env, "GetTypeFromProgID", GetTypeFromProgID_S);
			Native.jvm_reg_static_function(env, "GetTypeHandle", GetTypeHandle_S);
			Native.jvm_reg_function(env, "GetType", GetType);
			Native.jvm_reg_function(env, "IsSubclassOf", IsSubclassOf);
			Native.jvm_reg_function(env, "FindInterfaces", FindInterfaces);
			Native.jvm_reg_function(env, "GetInterface", GetInterface);
			Native.jvm_reg_function(env, "GetInterfaceMap", GetInterfaceMap);
			Native.jvm_reg_function(env, "GetInterfaces", GetInterfaces);
			Native.jvm_reg_function(env, "IsAssignableFrom", IsAssignableFrom);
			Native.jvm_reg_function(env, "IsInstanceOfType", IsInstanceOfType);
			Native.jvm_reg_function(env, "GetArrayRank", GetArrayRank);
			Native.jvm_reg_function(env, "GetElementType", GetElementType);
			Native.jvm_reg_function(env, "GetEvent", GetEvent);
			Native.jvm_reg_function(env, "GetEvents", GetEvents);
			Native.jvm_reg_function(env, "GetField", GetField);
			Native.jvm_reg_function(env, "GetFields", GetFields);
			Native.jvm_reg_function(env, "GetHashCode", GetHashCode);
			Native.jvm_reg_function(env, "GetMember", GetMember);
			Native.jvm_reg_function(env, "GetMembers", GetMembers);
			Native.jvm_reg_function(env, "GetMethod", GetMethod);
			Native.jvm_reg_function(env, "GetMethods", GetMethods);
			Native.jvm_reg_function(env, "GetNestedType", GetNestedType);
			Native.jvm_reg_function(env, "GetNestedTypes", GetNestedTypes);
			Native.jvm_reg_function(env, "GetProperties", GetProperties);
			Native.jvm_reg_function(env, "GetProperty", GetProperty);
			Native.jvm_reg_function(env, "GetConstructor", GetConstructor);
			Native.jvm_reg_function(env, "GetConstructors", GetConstructors);
			Native.jvm_reg_function(env, "GetDefaultMembers", GetDefaultMembers);
			Native.jvm_reg_function(env, "FindMembers", FindMembers);
			Native.jvm_reg_function(env, "InvokeMember", InvokeMember);
			Native.jvm_reg_function(env, "ToString", ToString);
			Native.jvm_reg_function(env, "GetGenericArguments", GetGenericArguments);
			Native.jvm_reg_function(env, "GetGenericTypeDefinition", GetGenericTypeDefinition);
			Native.jvm_reg_function(env, "MakeGenericType", MakeGenericType);
			Native.jvm_reg_function(env, "GetGenericParameterConstraints", GetGenericParameterConstraints);
			Native.jvm_reg_function(env, "MakeArrayType", MakeArrayType);
			Native.jvm_reg_function(env, "MakeByRefType", MakeByRefType);
			Native.jvm_reg_function(env, "MakePointerType", MakePointerType);
			Native.jvm_reg_static_function(env, "ReflectionOnlyGetType", ReflectionOnlyGetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Type", IntPtr.Zero, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(System.Type), jsClass);
		}
	}
}
