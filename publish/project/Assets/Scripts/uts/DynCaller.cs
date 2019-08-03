using System;
using System.Collections.Generic;
using System.Reflection;
using UnityEngine;

public class DynCaller
{
    [DonotWrap]
    public static object Invoke(Type objType, object obj, string methodName, Type[] genericTypes, object[] args)
    {
        objType = objType != null ? objType : obj.GetType();
        MethodInfo method = GetMethod(objType, methodName, genericTypes, args);
        if (IsGeneric(genericTypes))
            method = method.MakeGenericMethod(genericTypes);
        return method.Invoke(obj, args);
    }
    public static object Invoke(Type objType, object obj, string methodName, Type retGenericType, object[] args)
    {
        return Invoke(null, obj, methodName, new Type[] { retGenericType }, args);
    }
    public static object JavaInvoke(Type objType, object obj, string methodName, Type retGenericType, string javaMethod, object[] args)
    {
        return Invoke(null, obj, methodName, new Type[] { retGenericType }, new object[] { javaMethod, args });
    }
    private static MethodInfo GetMethod(Type objType, string methodName, Type[] genericTypes, object[] args)
    {
        bool isGeneric = IsGeneric(genericTypes);
        var ms = objType.GetMethods(BindingFlags.Instance | BindingFlags.Public | BindingFlags.Static);
        for (int i=0; i<ms.Length; i++)
        {
            var m = ms[i];
            if (m.Name.CompareTo(methodName) == 0 && m.IsGenericMethod == isGeneric)
            {
                return m;
            }
        }
        return null;
    }
    private static bool IsGeneric(Type[] genericTypes)
    {
        return genericTypes.Length > 0;
    }
}
