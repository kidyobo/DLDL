using System;
using System.Runtime.InteropServices;
using System.Security;
using System.Text;

namespace Uts
{
#pragma warning disable 414
    public class MonoPInvokeCallbackAttribute : System.Attribute
    {
        private Type type;
        public MonoPInvokeCallbackAttribute(Type t) { type = t; }
    }
#pragma warning restore 414

#if !UNITY_IPHONE
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
#endif
    public delegate void jvm_log(string msg);

#if !UNITY_IPHONE
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
#endif
    public delegate IntPtr jvm_ctor_callback(IntPtr ctx, IntPtr ctor, int argumentCount, IntPtr arguments, IntPtr exception);

#if !UNITY_IPHONE
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
#endif
    public delegate void jvm_dtor_callback(IntPtr obj);

#if !UNITY_IPHONE
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
#endif
    public delegate IntPtr jvm_callback(IntPtr ctx, IntPtr func, IntPtr thisObj, int argumentCount, IntPtr arguments, IntPtr exception);

#if !UNITY_IPHONE
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
#endif
    public delegate bool jvm_set_callback(IntPtr ctx, IntPtr thisObj, IntPtr name, IntPtr value, IntPtr exception);

#if !UNITY_IPHONE
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
#endif
    public delegate IntPtr jvm_get_callback(IntPtr ctx, IntPtr thisObj, IntPtr name, IntPtr exception);


#if !UNITY_IPHONE
    [SuppressUnmanagedCodeSecurity]
#endif
    public class Native
    {
#if UNITY_IPHONE && !UNITY_EDITOR
		 const string UTS_DLL = "__Internal";
#else
        const string UTS_DLL = "uts";
#endif
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_create(jvm_log log, jvm_log logerr);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_destroy(IntPtr env);



        /** register function */
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_start(IntPtr env);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_end(IntPtr env);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_mod_start(IntPtr env, string name);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_mod_end(IntPtr env);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_class_start(IntPtr env);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_function(IntPtr env, string name, jvm_callback func);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_property(IntPtr env, string name, jvm_get_callback getter, jvm_set_callback setter);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_static_function(IntPtr env, string name, jvm_callback func);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_static_property(IntPtr env, string name, jvm_callback getter, jvm_callback setter);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_reg_class_end(IntPtr env, string name, IntPtr jsbase, jvm_ctor_callback ctor, jvm_dtor_callback dtor);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_enum_start(IntPtr env, string name);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_enum_field(IntPtr env, string name, double value);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_reg_enum_end(IntPtr env);



        /** make value function */
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_make_number(IntPtr context, double value);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_make_null(IntPtr context);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_make_object(IntPtr context, IntPtr constructor, IntPtr udata);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_make_string(IntPtr context, string str);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_make_lstring(IntPtr context, byte[] str, int len);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_make_boolean(IntPtr context, bool value);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_get_udata(IntPtr obj);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_make_array(IntPtr context);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_set_array_length(IntPtr context, IntPtr array, int len);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_set_array_item(IntPtr context, IntPtr array, int index, IntPtr value);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_set_global_property(IntPtr env, string name, IntPtr value);



        /** misc functions */
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_evalstring(IntPtr env, string str, string source_url);

        public static IntPtr jvm_evalstring_s(IntPtr env, string str, string source_url)
        {
            IntPtr rt = jvm_evalstring(env, str, source_url);
            IntPtr e = jvm_getexception(env);
            if (e != IntPtr.Zero)
                jvm_print_exception(jvm_getctx(env), "eval error\n", e);
            return rt;
        }

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_getexception(IntPtr env);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_mark_gc(IntPtr context);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_immediate_gc(IntPtr context);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_protect(IntPtr env, IntPtr obj);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_unprotect(IntPtr env, IntPtr obj);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int jvm_protect_objects_count(IntPtr env);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr jvm_call(IntPtr env, IntPtr jsCallback, int argcnt);
        public static IntPtr jvm_call_s(IntPtr env, IntPtr jsCallback, int argcnt)
        {
            IntPtr rt = jvm_call(env, jsCallback, argcnt);
            IntPtr e = jvm_getexception(env);
            if (e != IntPtr.Zero)
                jvm_print_exception(jvm_getctx(env), "call error\n", e);
            return rt;
        }

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int jvm_arg_size(IntPtr env);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_getctx(IntPtr env);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_throwerr(IntPtr context, IntPtr expection, string msg);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_set_weakobj(IntPtr env, IntPtr key, IntPtr jsobj);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_get_weakobj(IntPtr env, IntPtr weakPtr);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_release_weakobj(IntPtr env, IntPtr weakPtr);

        //测试用，检查ios的mvalues的大小，是否有内存泄漏
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int jvm_get_ios_mvalues_capacity();
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int jvm_get_ios_mvalues_count();

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern bool jvm_instanceof(IntPtr context, IntPtr jsval, IntPtr constructorobj);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_get_prop(IntPtr context, IntPtr jsobj, string propname);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_bjson_parse(IntPtr context, byte[] str, int len);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_backtrace(IntPtr context);


        /** args value to xxx */
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_tostr(IntPtr context, IntPtr val, ref int strlen);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int jvm_towstr_and_release(IntPtr strref, byte[] outstr, int size);



        private static byte[] s_str = new byte[1024];
        private static byte[] AllocBytes(int byteslen)
        {
            if (byteslen > 1024*1024)
            {
                return new byte[byteslen];
            }

            if (byteslen > s_str.Length)
            {
                s_str = new byte[byteslen * 2];
            }
            return s_str;
        }

        public static string jvm_tostring(IntPtr context, IntPtr val)
        {
            int wstrlen = 0;
            IntPtr strref = jvm_tostr(context, val, ref wstrlen);

            if (wstrlen < 0 || wstrlen > 50 * 1024 * 1024) // 长度小于0，或大于 50M
            {
                UnityEngine.Debug.LogError("Error jvm_tostr string! strlen:" + wstrlen);
                wstrlen = 0;
            }

            byte[] bytes = AllocBytes(2 * (wstrlen + 1));
            jvm_towstr_and_release(strref, bytes, wstrlen + 1);
            return Encoding.Unicode.GetString(bytes, 0, wstrlen * 2);
        }

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern double jvm_tonumber(IntPtr context, IntPtr val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_toobject(IntPtr context, IntPtr val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern bool jvm_toboolean(IntPtr context, IntPtr val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int jvm_get_arraylen(IntPtr context, IntPtr obj);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_get_arrayvalue(IntPtr context, IntPtr obj, int index);



        /** args value to xxx */
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern bool jvm_isnumber(IntPtr context, IntPtr val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern bool jvm_isstring(IntPtr context, IntPtr val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern bool jvm_isboolean(IntPtr context, IntPtr val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern bool jvm_isobject(IntPtr context, IntPtr val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern bool jvm_isnil(IntPtr context, IntPtr val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern bool jvm_isarray(IntPtr env, IntPtr context, IntPtr val, IntPtr exception);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr jvm_get_arg(IntPtr args, int index);



        /** push arg for call */
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_arg_pushstring(IntPtr env, string str);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_arg_pushnumber(IntPtr env, double value);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_arg_pushboolean(IntPtr env, bool value);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_arg_pushnull(IntPtr env);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void jvm_arg_pushobject(IntPtr env, IntPtr obj);

        static public void jvm_print_exception(IntPtr context, string error, IntPtr exception)
        {
            StringBuilder builder = new StringBuilder(error);
            IntPtr message = jvm_get_prop(context, exception, "message");
            IntPtr line = jvm_get_prop(context, exception, "line");
            IntPtr column = jvm_get_prop(context, exception, "column");
            IntPtr stack = jvm_get_prop(context, exception, "stack");
            builder.AppendLine(jvm_tostring(context, message) + "  line:" + jvm_tonumber(context, line) + " column:" + jvm_tonumber(context, column));
            builder.AppendLine(jvm_tostring(context, stack));
            UnityEngine.Debug.LogError(builder.ToString());
        }


        /** uts net */
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uts_net_init(IntPtr env);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uts_net_destroy(IntPtr env);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uts_net_update();

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uts_net_resume();

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uts_net_pause();
    }
}
