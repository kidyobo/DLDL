using System;
using System.Collections.Generic;
using System.Reflection;

namespace Uts
{
    class DelegateUtil
    {
        private static Dictionary<Type, MethodInfo> typeMethods = new Dictionary<Type, MethodInfo>(128);

        public static RT CreateUnityEvent<RT>(IntPtr context, IntPtr arg, RT evt) where RT : UnityEngine.Events.UnityEvent
        {
            if (!Native.jvm_isnil(context, arg))
            {
                JsDelegate d = new JsDelegate(Core.env, Native.jvm_toobject(context, arg));
                var act = CreateDelegate(typeof(UnityEngine.Events.UnityAction), d) as UnityEngine.Events.UnityAction;
                evt.AddListener(act);
            }
            return evt;
        }

        public static RT CreateUnityEvent<T1, RT>(IntPtr context, IntPtr arg, RT evt) where RT : UnityEngine.Events.UnityEvent<T1>
        {
            if (!Native.jvm_isnil(context, arg))
            {
                JsDelegate<T1> d = new JsDelegate<T1>(Core.env, Native.jvm_toobject(context, arg));
                var act = CreateDelegate(typeof(UnityEngine.Events.UnityAction<T1>), d) as UnityEngine.Events.UnityAction<T1>;
                evt.AddListener(act);
            }
            return evt;
        }

        public static RT CreateUnityEvent<T1, T2, RT>(IntPtr context, IntPtr arg, RT evt) where RT : UnityEngine.Events.UnityEvent<T1, T2>
        {
            if (!Native.jvm_isnil(context, arg))
            {
                JsDelegate<T1, T2> d = new JsDelegate<T1, T2>(Core.env, Native.jvm_toobject(context, arg));
                var act = CreateDelegate(typeof(UnityEngine.Events.UnityAction<T1, T2>), d) as UnityEngine.Events.UnityAction<T1, T2>;
                evt.AddListener(act);
            }
            return evt;
        }

        public static RT CreateUnityEvent<T1, T2, T3, RT>(IntPtr context, IntPtr arg, RT evt) where RT : UnityEngine.Events.UnityEvent<T1, T2, T3>
        {
            if (!Native.jvm_isnil(context, arg))
            {
                JsDelegate<T1, T2, T3> d = new JsDelegate<T1, T2, T3>(Core.env, Native.jvm_toobject(context, arg));
                var act = CreateDelegate(typeof(UnityEngine.Events.UnityAction<T1, T2, T3>), d) as UnityEngine.Events.UnityAction<T1, T2, T3>;
                evt.AddListener(act);
            }
            return evt;
        }

        public static RT CreateUnityEvent<T1, T2, T3, T4, RT>(IntPtr context, IntPtr arg, RT evt) where RT : UnityEngine.Events.UnityEvent<T1, T2, T3, T4>
        {
            if (!Native.jvm_isnil(context, arg))
            {
                JsDelegate<T1, T2, T3, T4> d = new JsDelegate<T1, T2, T3, T4>(Core.env, Native.jvm_toobject(context, arg));
                var act = CreateDelegate(typeof(UnityEngine.Events.UnityAction<T1, T2, T3, T4>), d) as UnityEngine.Events.UnityAction<T1, T2, T3, T4>;
                evt.AddListener(act);
            }
            return evt;
        }

        public static Delegate CreateDelegate<D>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg))
                return null;

            var d = new JsDelegate(Core.env, Native.jvm_toobject(context, arg));
            return CreateDelegate(typeof(D), d);
        }

        public static Delegate CreateDelegate<T1, D>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg))
                return null;

            var d = new JsDelegate<T1>(Core.env, Native.jvm_toobject(context, arg));
            return CreateDelegate(typeof(D), d);
        }

        public static Delegate CreateDelegate<T1, T2, D>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg))
                return null;

            var d = new JsDelegate<T1, T2>(Core.env, Native.jvm_toobject(context, arg));
            return CreateDelegate(typeof(D), d);
        }

        public static Delegate CreateDelegate<T1, T2, T3, D>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg))
                return null;

            var d = new JsDelegate<T1, T2, T3>(Core.env, Native.jvm_toobject(context, arg));
            return CreateDelegate(typeof(D), d);
        }

        public static Delegate CreateDelegate<T1, T2, T3, T4, D>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg))
                return null;

            var d = new JsDelegate<T1, T2, T3, T4>(Core.env, Native.jvm_toobject(context, arg));
            return CreateDelegate(typeof(D), d);
        }

        public static Delegate CreateDelegateRt<RT, D>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg))
                return null;

            var d = new JsDelegateRt<RT>(Core.env, Native.jvm_toobject(context, arg));
            return Delegate.CreateDelegate(typeof(D), d, GetCallMethodInfo(d));
        }

        public static Delegate CreateDelegateRt<T1, RT, D>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg))
                return null;

            var d = new JsDelegateRt<T1, RT>(Core.env, Native.jvm_toobject(context, arg));
            return CreateDelegate(typeof(D), d);
        }

        public static Delegate CreateDelegateRt<T1, T2, RT, D>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg))
                return null;

            var d = new JsDelegateRt<T1, T2, RT>(Core.env, Native.jvm_toobject(context, arg));
            return CreateDelegate(typeof(D), d);
        }

        public static Delegate CreateDelegateRt<T1, T2, T3, RT, D>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg))
                return null;

            var d = new JsDelegateRt<T1, T2, T3, RT>(Core.env, Native.jvm_toobject(context, arg));
            return CreateDelegate(typeof(D), d);
        }

        public static Delegate CreateDelegateRt<T1, T2, T3, T4, RT, D>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg))
                return null;

            var d = new JsDelegateRt<T1, T2, T3, T4, RT>(Core.env, Native.jvm_toobject(context, arg));
            return CreateDelegate(typeof(D), d);
        }

        private static Delegate CreateDelegate(Type t, object d)
        {
            return Delegate.CreateDelegate(t, d, GetCallMethodInfo(d));
        }

        private static MethodInfo GetCallMethodInfo(object o)
        {
            MethodInfo m;
            Type t = o.GetType();
            if (!typeMethods.TryGetValue(t, out m))
            {
                m = t.GetMethod("Call", BindingFlags.Public | BindingFlags.Static | BindingFlags.DeclaredOnly | BindingFlags.Instance);
                typeMethods[t] = m;
            }
            return m;
        }
    }
}
