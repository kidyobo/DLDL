using System;
using System.Reflection;

namespace Uts
{
    public class JsDelegateBase
    {
        private Environment env;
        private IntPtr jsCallback;
        public JsDelegateBase(Environment env, IntPtr jsCallback)
        {
            this.env = env;
            this.jsCallback = jsCallback;
            Native.jvm_protect(env.ptr, jsCallback);
        }

        ~JsDelegateBase()
        {
            if (env.ptr != IntPtr.Zero)
            {
                Core.UnprotectJsValue(env.ptr, jsCallback);
            }
        }

        public object Call(params object[] args) // 参数压入性能问题
        {
            var envPtr = env.ptr;
            if (envPtr == IntPtr.Zero)
                return null;

            for (int i = 0, n = args.Length; i < n; i++)
            {
                object arg = args[i];
                if (arg == null)
                {
                    Native.jvm_arg_pushnull(envPtr);
                    continue;
                }
                Type type = arg.GetType();
                if (type == typeof(int))
                {
                    Native.jvm_arg_pushnumber(envPtr, (int)arg);
                }
                else if (type == typeof(float))
                {
                    Native.jvm_arg_pushnumber(envPtr, (float)arg);
                }
                else if (type == typeof(string))
                {
                    Native.jvm_arg_pushstring(envPtr, (string)arg);
                }
                else if (type == typeof(bool))
                {
                    Native.jvm_arg_pushboolean(envPtr, (bool)arg);
                }
                else if (type == typeof(char))
                {
                    Native.jvm_arg_pushnumber(envPtr, (char)arg);
                }
                else if (type == typeof(short))
                {
                    Native.jvm_arg_pushnumber(envPtr, (short)arg);
                }
                else if (type == typeof(long))
                {
                    Native.jvm_arg_pushnumber(envPtr, (long)arg);
                }
                else if (type == typeof(double))
                {
                    Native.jvm_arg_pushnumber(envPtr, (double)arg);
                }
                else if (type == typeof(byte))
                {
                    Native.jvm_arg_pushnumber(envPtr, (byte)arg);
                }
                else if (type == typeof(sbyte))
                {
                    Native.jvm_arg_pushnumber(envPtr, (sbyte)arg);
                }
                else if (type == typeof(ushort))
                {
                    Native.jvm_arg_pushnumber(envPtr, (ushort)arg);
                }
                else if (type == typeof(uint))
                {
                    Native.jvm_arg_pushnumber(envPtr, (uint)arg);
                }
                else if (type == typeof(ulong))
                {
                    Native.jvm_arg_pushnumber(envPtr, (ulong)arg);
                }
                else if (type == typeof(decimal))
                {
                    Native.jvm_arg_pushnumber(envPtr, Convert.ToDouble(arg));
                }
                else if (type.IsEnum)
                {
                    Native.jvm_arg_pushnumber(envPtr, Convert.ToDouble(arg));
                }
                else
                {
                    if (type.IsValueType)
                    {
                        IntPtr jsobj = JsStructs.ToJsObject(Native.jvm_getctx(envPtr), arg);
                        if (jsobj != IntPtr.Zero)
                        {
                            Native.jvm_arg_pushobject(envPtr, jsobj);
                        }
                        else
                        {
                            Type newType = typeof(Agent<>);
                            newType = newType.MakeGenericType(type);
                            arg = Activator.CreateInstance(newType, arg);
                            Native.jvm_arg_pushobject(envPtr, MakeJsObjects.MakeJsObject(Native.jvm_getctx(envPtr), arg, type));
                        }
                    }
                    else
                    {
                        Native.jvm_arg_pushobject(envPtr, MakeJsObjects.MakeJsObject(Native.jvm_getctx(envPtr), arg, type));
                    }
                }
            }
            IntPtr rt = Native.jvm_call_s(envPtr, jsCallback, args.Length);
            return ToCsObjects.ToVarObject(Native.jvm_getctx(envPtr), rt);
        }
    }

    public class JsDelegate : JsDelegateBase
    {
        public JsDelegate(Environment env, IntPtr jsCallback) : base(env, jsCallback) { }

        public void Call() { base.Call(); }
    }

    public class JsDelegate<T1> : JsDelegateBase
    {
        public JsDelegate(Environment env, IntPtr jsCallback) : base(env, jsCallback) { }

        public void Call(T1 arg1) { base.Call(arg1); }
    }

    public class JsDelegate<T1, T2> : JsDelegateBase
    {
        public JsDelegate(Environment env, IntPtr jsCallback) : base(env, jsCallback) { }

        public void Call(T1 arg1, T2 arg2) { base.Call(arg1, arg2); }
    }

    public class JsDelegate<T1, T2, T3> : JsDelegateBase
    {
        public JsDelegate(Environment env, IntPtr jsCallback) : base(env, jsCallback) { }

        public void Call(T1 arg1, T2 arg2, T3 arg3) { base.Call(arg1, arg2, arg3); }
    }

    public class JsDelegate<T1, T2, T3, T4> : JsDelegateBase
    {
        public JsDelegate(Environment env, IntPtr jsCallback) : base(env, jsCallback) { }

        public void Call(T1 arg1, T2 arg2, T3 arg3, T4 arg4) { base.Call(arg1, arg2, arg3, arg4); }
    }


    public class JsDelegateRt<RT> : JsDelegateBase
    {
        public JsDelegateRt(Environment env, IntPtr jsCallback) : base(env, jsCallback) { }

        public RT Call() { return (RT)base.Call(); }
    }

    public class JsDelegateRt<T1, RT> : JsDelegateBase
    {
        public JsDelegateRt(Environment env, IntPtr jsCallback) : base(env, jsCallback) { }

        public RT Call(T1 arg1) { return (RT)base.Call(arg1); }
    }

    public class JsDelegateRt<T1, T2, RT> : JsDelegateBase
    {
        public JsDelegateRt(Environment env, IntPtr jsCallback) : base(env, jsCallback) { }

        public RT Call(T1 arg1, T2 arg2) { return (RT)base.Call(arg1, arg2); }
    }

    public class JsDelegateRt<T1, T2, T3, RT> : JsDelegateBase
    {
        public JsDelegateRt(Environment env, IntPtr jsCallback) : base(env, jsCallback) { }

        public RT Call(T1 arg1, T2 arg2, T3 arg3) { return (RT)base.Call(arg1, arg2, arg3); }
    }

    public class JsDelegateRt<T1, T2, T3, T4, RT> : JsDelegateBase
    {
        public JsDelegateRt(Environment env, IntPtr jsCallback) : base(env, jsCallback) { }

        public RT Call(T1 arg1, T2 arg2, T3 arg3, T4 arg4) { return (RT)base.Call(arg1, arg2, arg3, arg4); }
    }
}