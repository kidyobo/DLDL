using UnityEngine;
using System;
using System.Collections;
using Uts;
using System.Runtime.InteropServices;
//用于在uts里简单的操作数组
public static class ArrayHelper
{
    public static int GetArrayLength(Array array)
    {
        if (array == null)
        {
            return 0;
        }
        return array.Length;
    }
    public static object GetArrayValue(Array array, int index)
    {
        return array.GetValue(index);
    }
    public static void SetArrayValue(Array array, int index, object obj)
    {
        array.SetValue(obj, index);
    }
}