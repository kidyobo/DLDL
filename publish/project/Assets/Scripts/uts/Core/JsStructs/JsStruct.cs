using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Uts
{
    class JsStruct
    {
        public Type type;
        protected IntPtr constructor;
        protected IntPtr newfun;
        protected IntPtr setfun;
        public JsStruct(IntPtr env, Type type, string constructorstr, string newfunstr, string setfunstr)
        {
            this.type = type;
            IntPtr ctx = Native.jvm_getctx(env);
            constructor = Native.jvm_toobject(ctx, Native.jvm_evalstring_s(env, constructorstr, ""));
            Native.jvm_protect(env, constructor);
            newfun = Native.jvm_toobject(ctx, Native.jvm_evalstring_s(env, newfunstr, ""));
            Native.jvm_protect(env, newfun);
            setfun = Native.jvm_toobject(ctx, Native.jvm_evalstring_s(env, setfunstr, ""));
            Native.jvm_protect(env, setfun);
        }

        public void Destroy(IntPtr env)
        {
            Native.jvm_unprotect(env, constructor);
            Native.jvm_unprotect(env, newfun);
            Native.jvm_unprotect(env, setfun);
        }

        public bool IsThisType(IntPtr context, IntPtr jsval)
        {
            return Native.jvm_instanceof(context, jsval, constructor);
        }

        public virtual object ToCsObject(IntPtr context, IntPtr jsval)
        {
            return null;
        }

        public virtual void SetJsObject(IntPtr context, IntPtr jsval, object csObj)
        {
        }

        public virtual IntPtr ToJsObject(IntPtr context, object csObj)
        {
            return IntPtr.Zero;
        }
    }
}
