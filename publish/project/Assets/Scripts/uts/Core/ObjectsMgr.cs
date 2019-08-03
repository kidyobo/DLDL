using System;
using System.Collections.Generic;
using System.Text;

namespace Uts
{
    internal class CompareObject : IEqualityComparer<object>
    {
        public new bool Equals(object x, object y) { return x == y; }
        public int GetHashCode(object obj) { return obj != null ? obj.GetHashCode() : 0; }
    }

    public class ObjectsMgr
    {
        private static Dictionary<Type, IntPtr> jsClassDict = new Dictionary<Type, IntPtr>(512);
        private const int capacity = 4096;
        private static ContainerList jsFastMapCsList = new ContainerList(capacity);
        private static Dictionary<object, IntPtr> csMapJsDict = new Dictionary<object, IntPtr>(capacity, new CompareObject());
        private static Dictionary<object, IntPtr> csMapWeakJsDict = new Dictionary<object, IntPtr>(capacity, new CompareObject());
        private static Dictionary<IntPtr, object> jsMapCsDict = new Dictionary<IntPtr, object>(capacity);
        private static Dictionary<IntPtr, IntPtr> jsMapUdata = new Dictionary<IntPtr, IntPtr>(capacity);

        public static void Destroy()
        {
            jsClassDict.Clear();
            jsFastMapCsList.Clear();
            csMapJsDict.Clear();
            csMapWeakJsDict.Clear();
            jsMapCsDict.Clear();
            jsMapUdata.Clear();
        }

        public static void RegisterJsClass(Type type, IntPtr jsClass)
        {
            jsClassDict[type] = jsClass;
        }

        public static IntPtr GetJsClass(Type type)
        {
            IntPtr jsCls;
            if (jsClassDict.TryGetValue(type, out jsCls))
                return jsCls;
            else
                return IntPtr.Zero;
        }

        public static IntPtr GetJsObject(object csObj)
        {
            IntPtr jsObj = IntPtr.Zero;
            IntPtr weekPtr;
            if (csMapWeakJsDict.TryGetValue(csObj, out weekPtr))
            {
                jsObj = Native.jvm_get_weakobj(Core.env.ptr, weekPtr);
                if (jsObj == IntPtr.Zero)
                {
                    FreeCsObject(csObj);
                }
            }
            return jsObj;
        }

        public static object GetCsObject(IntPtr jsObject)
        {
            int refindex = Native.jvm_get_udata(jsObject).ToInt32();
            if (refindex > 0)
                return jsFastMapCsList.objs[refindex];
            return null;
        }

        public static IntPtr MakeJsObjectAndBind(IntPtr context, IntPtr jsCls, object csObj)
        {
            IntPtr udata = new IntPtr(jsFastMapCsList.Push(csObj));
            IntPtr jsObj = Native.jvm_make_object(context, jsCls, udata);
            csMapJsDict[csObj] = jsObj;
            csMapWeakJsDict[csObj] = Native.jvm_set_weakobj(Core.env.ptr, udata, jsObj);
            jsMapCsDict[jsObj] = csObj;
            jsMapUdata[jsObj] = udata;
            return jsObj;
        }

        public static bool ExistCsObject(IntPtr jsObj)
        {
            return jsMapCsDict.ContainsKey(jsObj);
        }

        public static string Dump()
        {
            int emptyCount = 0;

            StringBuilder dump = new StringBuilder();

            dump.Append("---------------------\n");
            dump.AppendFormat("csmapweakjs/jsmapcs/csmapjs count:{0}/{1}/{2}\n", csMapWeakJsDict.Count, jsMapCsDict.Count, csMapJsDict.Count);
            var collects = new Dictionary<string, int>();
            foreach (var pair in jsMapCsDict)
            {
                var typeName = pair.Value.GetType().Name;
                int count = 0;
                collects.TryGetValue(typeName, out count);
                collects[typeName] = count + 1;

                if (typeName == "GameObject")
                {
                    if (pair.Value.Equals(null))
                    {
                        emptyCount++;
                    }
                }
            }

            foreach (var pair in collects)
            {
                dump.AppendFormat("{0}:{1}\n", pair.Key, pair.Value);
            }

            dump.Append("---\n");
            dump.AppendFormat("empty objects count: {0}\n", emptyCount);

            dump.Append("---\n");
            dump.AppendFormat("objects container count/capacity: {0}/{1}\n", jsFastMapCsList.Count, jsFastMapCsList.Capacity);

            dump.Append("---\n");
            dump.AppendFormat("protect objects count: {0}\n", Native.jvm_protect_objects_count(Core.env.ptr));

            dump.Append("---\n");
            dump.AppendFormat("ios mvalues count/capacity: {0}/{1}\n", Native.jvm_get_ios_mvalues_count(), Native.jvm_get_ios_mvalues_capacity());

            return dump.ToString();
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_dtor_callback))]
        public static void dtor(IntPtr jsobj)
        {
            object obj;
            if (!jsMapCsDict.TryGetValue(jsobj, out obj))
                return;

            IntPtr udata;
            //IntPtr udata = Native.jvm_get_udata(jsobj); in ios will crash...
            if (!jsMapUdata.TryGetValue(jsobj, out udata))
            {
                UnityEngine.Debug.LogError("can't find udata in jsobject!");
                return;
            }
            jsFastMapCsList.Pop(udata.ToInt32());
            jsMapUdata.Remove(jsobj);

            IntPtr weakPtr;
            if (csMapWeakJsDict.TryGetValue(obj, out weakPtr))
            {
                Native.jvm_release_weakobj(Core.env.ptr, weakPtr);
                csMapWeakJsDict.Remove(obj);
            }
            jsMapCsDict.Remove(jsobj);
            csMapJsDict.Remove(obj);
        }

        private static void FreeCsObject(object csobj)
        {
            IntPtr jsobj;
            if (csMapJsDict.TryGetValue(csobj, out jsobj))
            {
                dtor(jsobj);
            }
        }
    }
}
