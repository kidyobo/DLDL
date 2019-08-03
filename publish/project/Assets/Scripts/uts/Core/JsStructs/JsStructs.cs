using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Uts
{
    class JsStructs
    {
        // 为了便捷访问
        public static JsVector2 vector2;
        public static JsVector3 vector3;

        private static List<JsStruct> objects;
        public static void Init(IntPtr env)
        {
            Uts.Native.jvm_evalstring_s(Core.env.ptr, Core.ReadScript("uts/innerobjects"), "uts/innerobjects");
            objects = new List<JsStruct>();

            vector2 = new JsVector2(env);
            objects.Add(vector2);
            vector3 = new JsVector3(env);
            objects.Add(vector3);
        }

        public static void Destroy(IntPtr env)
        {
            for (int i = 0; i < objects.Count; i++)
                objects[i].Destroy(env);
            objects.Clear();
        }

        public static object ToVarObject(IntPtr context, IntPtr val)
        {
            for (int i = 0, n = objects.Count; i < n; i++)
            {
                var o = objects[i];
                if (o.IsThisType(context, val)) return o.ToCsObject(context, val);
            }
            return null;
        }

        public static IntPtr ToJsObject(IntPtr context, object csobj)
        {
            Type type = csobj.GetType();
            for (int i = 0, n = objects.Count; i < n; i++)
            {
                var o = objects[i];
                if (o.type == type) return o.ToJsObject(context, csobj);
            }
            return IntPtr.Zero;
        }
    }
}
