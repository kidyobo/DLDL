using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Uts
{
    class MakeJsObjects
    {
        private static IntPtr jsDefaultCls = IntPtr.Zero;
        public static void Init(IntPtr env)
        {
            Native.jvm_reg_start(env);
            Native.jvm_reg_class_start(env);
            jsDefaultCls = Native.jvm_reg_class_end(env, "__default_class__", IntPtr.Zero, null, ObjectsMgr.dtor);
            Native.jvm_reg_end(env);
        }

        public static IntPtr MakeJsCtorObject(IntPtr context, IntPtr jsCls, object csObj)
        {
            return ObjectsMgr.MakeJsObjectAndBind(context, jsCls, csObj);
        }

        public static IntPtr MakeJsObjectForAgent<T>(IntPtr context, object csObj)
        {
            return MakeJsObject(context, csObj, typeof(T));
        }

        public static IntPtr MakeJsObject(IntPtr context, object csObj, Type objType = null)
        {
            if (csObj == null || csObj.Equals(null))
            {
                return IntPtr.Zero;
            }

            IntPtr jsObj = ObjectsMgr.GetJsObject(csObj);
            if (jsObj != IntPtr.Zero)
            {
                return jsObj;
            }

            IntPtr jsCls = ObjectsMgr.GetJsClass(objType ?? csObj.GetType());
            if (jsCls != IntPtr.Zero)
            {
                return MakeJsCtorObject(context, jsCls, csObj);
            }
            else
            {
                return MakeJsCtorObject(context, jsDefaultCls, csObj);
            }
        }

        public static IntPtr MakeVarJsObject(IntPtr context, object obj)
        {
            if (obj == null || obj.Equals(null))
            {
                return IntPtr.Zero;
            }

            var type = obj.GetType();
            if (type == typeof(bool))
            {
                return Native.jvm_make_boolean(context, Convert.ToBoolean(obj));
            }
            else if (type == typeof(char))
            {
                return Native.jvm_make_number(context, Convert.ToChar(obj));
            }
            else if (type.IsPrimitive)
            {
                return Native.jvm_make_number(context, Convert.ToDouble(obj));
            }
            else if (type.IsEnum)
            {
                return Native.jvm_make_number(context, Convert.ToInt32(obj));
            }
            else if (type == typeof(string))
            {
                return Native.jvm_make_string(context, Convert.ToString(obj));
            }
            else
            {
                if (type.IsValueType)
                {
                    Type newType = typeof(Agent<>);
                    newType = newType.MakeGenericType(type);
                    object o = Activator.CreateInstance(newType, obj);
                    return MakeJsObject(context, o, type);
                }
                else
                {
                    return MakeJsObject(context, obj);
                }
            }
        }

        /// <summary>
        /// 仅用于写入多返回值的情况（类型不确定），这里仅判断基础类型
        /// </summary>
        public static IntPtr MakeJsArray(IntPtr context, params object[] array)
        {
            IntPtr jsArray = Native.jvm_make_array(context);
            Native.jvm_set_array_length(context, jsArray, array.Length);
            for (int i = 0, length = array.Length; i < length; i++)
            {
                var obj = array[i];
                if (obj == null)
                {
                    Native.jvm_set_array_item(context, jsArray, i, Native.jvm_make_null(context));
                }
                else
                {
                    var type = obj.GetType();

                    if (type == typeof(bool))
                    {
                        Native.jvm_set_array_item(context, jsArray, i, Native.jvm_make_boolean(context, Convert.ToBoolean(obj)));
                    }
                    else if (type == typeof(char))
                    {
                        Native.jvm_set_array_item(context, jsArray, i, Native.jvm_make_number(context, Convert.ToChar(obj)));
                    }
                    else if (type.IsPrimitive)
                    {
                        Native.jvm_set_array_item(context, jsArray, i, Native.jvm_make_number(context, Convert.ToDouble(obj)));
                    }
                    else if (type.IsEnum)
                    {
                        Native.jvm_set_array_item(context, jsArray, i, Native.jvm_make_number(context, Convert.ToInt32(obj)));
                    }
                    else if (type == typeof(string))
                    {
                        Native.jvm_set_array_item(context, jsArray, i, Native.jvm_make_string(context, Convert.ToString(obj)));
                    }
                    else
                    {
                        if (type.IsValueType)
                        {
                            Type newType = typeof(Agent<>);
                            newType = newType.MakeGenericType(type);
                            object o = Activator.CreateInstance(newType, obj);
                            Native.jvm_set_array_item(context, jsArray, i, MakeJsObject(context, o, type));
                        }
                        else
                        {
                            Native.jvm_set_array_item(context, jsArray, i, MakeJsObject(context, obj));
                        }
                    }
                }
            }
            return jsArray;
        }
    }
}
