using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Uts
{
    public class RegHelper
    {
        public static void RegisteEnum(IntPtr env, Type type)
        {
            Native.jvm_reg_enum_start(env, type.Name);
            var members = type.GetFields(System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public);
            for (int i = 0, length = members.Length; i < length; i++)
            {
                var member = members[i];
                Native.jvm_reg_enum_field(env, member.Name, (int)member.GetRawConstantValue());
            }
            Native.jvm_reg_enum_end(env);
        }

        public static void RegisterJsClass(Type type, IntPtr jsClass)
        {
            ObjectsMgr.RegisterJsClass(type, jsClass);
        }
    }
}
