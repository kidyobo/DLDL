using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ByteArrayWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = ToCsObjects.ToArray<byte>(context, Native.jvm_get_arg(args, 0));
				var p1 = ToCsObjects.ToArray<byte>(context, Native.jvm_get_arg(args, 1));
				var obj = new ByteArray(p0, p1);
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetWriteBytes(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.GetWriteBytes();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Dispose(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				obj.Dispose();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadBoolean(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ReadBoolean();
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadByte(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ReadByte();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadInt16(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ReadInt16();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadInt32(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ReadInt32();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadInt64(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ReadInt64();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadSingle(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ReadSingle();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadDouble(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ReadDouble();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadBytes(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = obj.ReadBytes(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadString(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ReadString();
				return Native.jvm_make_string(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteBoolean(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 0));
				obj.WriteBoolean(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteByte(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (byte)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.WriteByte(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteInt16(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (short)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.WriteInt16(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteInt32(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.WriteInt32(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteInt64(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (long)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.WriteInt64(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteSingle(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.WriteSingle(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteDouble(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				obj.WriteDouble(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteBytes(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = ToCsObjects.ToArray<byte>(context, Native.jvm_get_arg(args, 0));
				obj.WriteBytes(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteString(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				obj.WriteString(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteVector3(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 0));
				obj.WriteVector3(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadVector3(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ReadVector3();
				return JsStructs.vector3.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteVector4(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (Agent<UnityEngine.Vector4>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.WriteVector4(p0.target);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadVector4(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = new Agent<UnityEngine.Vector4>(obj.ReadVector4());
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Vector4>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteVector2(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (UnityEngine.Vector2)JsStructs.vector2.ToCsObject(context, Native.jvm_get_arg(args, 0));
				obj.WriteVector2(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadVector2(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = obj.ReadVector2();
				return JsStructs.vector2.ToJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr WriteColor(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var p0 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				obj.WriteColor(p0.target);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReadColor(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				var ret = new Agent<UnityEngine.Color>(obj.ReadColor());
				return MakeJsObjects.MakeJsObjectForAgent<UnityEngine.Color>(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr IsLittleEndianGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.IsLittleEndian);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr useLittleEndianGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_boolean(context, obj.useLittleEndian);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool useLittleEndianSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				obj.useLittleEndian = (bool)Native.jvm_toboolean(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr ReadLengthGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.ReadLength));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_get_callback))]
		public static IntPtr ReadPositionGetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				return Native.jvm_make_number(context, (double)(obj.ReadPosition));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_set_callback))]
		public static bool ReadPositionSetter(IntPtr context, IntPtr thisObj, IntPtr name, IntPtr arg, IntPtr exception) {
			try {
				var obj = ((ByteArray)ToCsObjects.ToCsObject(context, thisObj));
				obj.ReadPosition = (long)(double)Native.jvm_tonumber(context, arg);
				return true;
			} catch (Exception e) { Native.jvm_throwerr(context, exception, e.ToString()); return false;}
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(ByteArray);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_property(env, "IsLittleEndian", IsLittleEndianGetter, null);
			Native.jvm_reg_property(env, "useLittleEndian", useLittleEndianGetter, useLittleEndianSetter);
			Native.jvm_reg_property(env, "ReadLength", ReadLengthGetter, null);
			Native.jvm_reg_property(env, "ReadPosition", ReadPositionGetter, ReadPositionSetter);
			Native.jvm_reg_function(env, "GetWriteBytes", GetWriteBytes);
			Native.jvm_reg_function(env, "Dispose", Dispose);
			Native.jvm_reg_function(env, "ReadBoolean", ReadBoolean);
			Native.jvm_reg_function(env, "ReadByte", ReadByte);
			Native.jvm_reg_function(env, "ReadInt16", ReadInt16);
			Native.jvm_reg_function(env, "ReadInt32", ReadInt32);
			Native.jvm_reg_function(env, "ReadInt64", ReadInt64);
			Native.jvm_reg_function(env, "ReadSingle", ReadSingle);
			Native.jvm_reg_function(env, "ReadDouble", ReadDouble);
			Native.jvm_reg_function(env, "ReadBytes", ReadBytes);
			Native.jvm_reg_function(env, "ReadString", ReadString);
			Native.jvm_reg_function(env, "WriteBoolean", WriteBoolean);
			Native.jvm_reg_function(env, "WriteByte", WriteByte);
			Native.jvm_reg_function(env, "WriteInt16", WriteInt16);
			Native.jvm_reg_function(env, "WriteInt32", WriteInt32);
			Native.jvm_reg_function(env, "WriteInt64", WriteInt64);
			Native.jvm_reg_function(env, "WriteSingle", WriteSingle);
			Native.jvm_reg_function(env, "WriteDouble", WriteDouble);
			Native.jvm_reg_function(env, "WriteBytes", WriteBytes);
			Native.jvm_reg_function(env, "WriteString", WriteString);
			Native.jvm_reg_function(env, "WriteVector3", WriteVector3);
			Native.jvm_reg_function(env, "ReadVector3", ReadVector3);
			Native.jvm_reg_function(env, "WriteVector4", WriteVector4);
			Native.jvm_reg_function(env, "ReadVector4", ReadVector4);
			Native.jvm_reg_function(env, "WriteVector2", WriteVector2);
			Native.jvm_reg_function(env, "ReadVector2", ReadVector2);
			Native.jvm_reg_function(env, "WriteColor", WriteColor);
			Native.jvm_reg_function(env, "ReadColor", ReadColor);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "ByteArray", IntPtr.Zero, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(ByteArray), jsClass);
		}
	}
}
