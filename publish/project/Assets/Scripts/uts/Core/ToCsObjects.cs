using System;
using System.Collections.Generic;

namespace Uts
{
    public class ToCsObjects
    {
        public static object ToCsObject(IntPtr context, IntPtr jsObject)
        {
            if (Native.jvm_isnil(context, jsObject))
                return null;
            return ObjectsMgr.GetCsObject(jsObject);
        }

        public static object ToVarObject(IntPtr context, IntPtr val)
        {
            if (Native.jvm_isnil(context, val))
            {
                return null;
            }
            else if (Native.jvm_isnumber(context, val))
            {
                return Native.jvm_tonumber(context, val);
            }
            else if (Native.jvm_isstring(context, val))
            {
                return Native.jvm_tostring(context, val);
            }
            else if (Native.jvm_isboolean(context, val))
            {
                return Native.jvm_toboolean(context, val);
            }
            else if (Native.jvm_isobject(context, val))
            {
                object rt = ToObject(context, val);
                if (rt != null) return rt;
                return JsStructs.ToVarObject(context, val);
            }
            else
            {
                return null;
            }
        }

        public static object ToObject(IntPtr context, IntPtr val)
        {
            if (Native.jvm_isnil(context, val)) return null;
            IntPtr jsObj = Native.jvm_toobject(context, val);
            object obj = ToCsObject(context, val);
            if (obj != null) return obj;
            if (Native.jvm_isarray(Core.env.ptr, context, val, IntPtr.Zero))
            {
                var arrCnt = Native.jvm_get_arraylen(context, jsObj);
                object[] array = new object[arrCnt];
                for (int i = 0; i < arrCnt; i++)
                    array[i] = ToVarObject(context, Native.jvm_get_arrayvalue(context, jsObj, i));
                return array;
            }
            return null;
        }

        public static T[] ToArray<T>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg)) return null;
            if (Native.jvm_isarray(Core.env.ptr, context, arg, IntPtr.Zero))
            {
                return ToList<T>(context, arg).ToArray();
            }
            else
            {
                object obj = ToCsObject(context, arg);
                if (obj == null) return null;
                return (T[])obj;
            }
        }

        public static List<T> ToList<T>(IntPtr context, IntPtr arg)
        {
            if (Native.jvm_isnil(context, arg)) return null;
            if (Native.jvm_isarray(Core.env.ptr, context, arg, IntPtr.Zero))
            {
                var type = typeof(T);
                var count = Native.jvm_get_arraylen(context, arg);
                List<T> list = new List<T>(count);
                for (int i = 0; i < count; i++)
                {
                    IntPtr val = Native.jvm_get_arrayvalue(context, arg, i);
                    object valobj = ToVarObject(context, val);
                    if (valobj.GetType() == typeof(Agent<T>))
                    {
                        list.Add(((Agent<T>)valobj).target);
                    }
                    else
                    {
                        list.Add((T)Convert.ChangeType(valobj, type));
                    }
                }
                return list;
            }
            else
            {
                object obj = ToCsObject(context, arg);
                if (obj == null) return null;
                return (List<T>)obj;
            }
        }

        public static T[] ToArray<T>(object obj)
        {
            if (obj.GetType().IsArray)
            {
                return ToList<T>(obj).ToArray();
            }
            else
            {
                return (T[])obj;
            }
        }

        public static List<T> ToList<T>(object obj)
        {
            if (obj.GetType().IsArray)
            {
                var type = typeof(T);
                object[] objArray = obj as object[];
                var count = objArray.Length;
                List<T> list = new List<T>(count);
                for (int i = 0; i < count; i++)
                {
                    var cache = objArray[i];
                    if (cache.GetType() == typeof(Agent<T>))
                    {
                        list.Add(((Agent<T>)cache).target);
                    }
                    else
                    {
                        list.Add((T)Convert.ChangeType(cache, type));
                    }
                }
                return list;
            }
            else
            {
                return (List<T>)obj;
            }
        }
    }
}
