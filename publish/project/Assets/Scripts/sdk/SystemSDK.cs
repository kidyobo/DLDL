using System.Collections.Generic;
using UnityEngine;

class SdkMsgType
{
    public static readonly int INITSDK = 1;
    public static readonly int VERSIONUPDATE = 7;
    public static readonly int DESTROY = 13;
}

public class SystemSDK : MonoBehaviour
{
    static private Dictionary<string, AndroidJavaObject> javaobjects = null;
    static private AndroidJavaObject GetJavaObject(string className, string classField, string classMethod)
    {
        if (Application.platform != RuntimePlatform.Android)
            return null;

        if (javaobjects == null)
        {
            javaobjects = new Dictionary<string, AndroidJavaObject>();
        }

        AndroidJavaObject java = null;
        if (!javaobjects.TryGetValue(className, out java))
        {
            using (var javaClass = new AndroidJavaClass(className))
            {
                if (classField != null)
                {
                    java = javaClass.GetStatic<AndroidJavaObject>(classField);
                }
                else
                {
                    java = javaClass.CallStatic<AndroidJavaObject>(classMethod);
                }
            }
            javaobjects.Add(className, java);
        }
        return java;
    }

    /// <summary>
    /// 透传调用jar包的java对象，只对android下有效
    /// </summary>
    /// <param name="className"> java全路径类名 </param>
    /// <param name="classField"> java类的一个静态变量，用来获取该java对象实例 </param>
    /// <param name="classMethod"> java类的一个静态方法，用来获取该java对象实例 </param>
    /// <param name="methodName"> c#中java对象的静态方法或成员方法的调用函数 Call/CallStatic </param>
    /// <param name="javaMethod"> 将要调用的jar包中java对象的方法名 </param>
    /// <param name="genericType"> java方法的返回值类型 </param>
    /// <param name="args"> java方法的输入参数列表 </param>
    /// <returns></returns>
    public static object JavaCaller(string className, string classField, string classMethod, string methodName, string javaMethod, System.Type genericType, object[] args)
    {
        var java = GetJavaObject(className, classField, classMethod);
        if (java == null)
            return null;

        object[] nargs = new object[] { javaMethod, args };
        System.Type[] genericTypes = new System.Type[] { genericType };
        return DynCaller.Invoke(null, java, methodName, genericTypes, nargs);
    }

    [DonotWrap]
    static public System.Action<int, string> onCsMessage = null;

    static public System.Action onDestroy = null;
    static public System.Action<string> onMessage = null;
    static public System.Action<bool> onApplicationPause = null;
    static public System.Action onPressQuitKey = null;
    static public System.Action<KeyCode> onKeyDown = null;

    [DonotWrap]
    public static void Destroy()
    {
        if (onDestroy != null)
        {
            onDestroy();
        }

        if (javaobjects != null)
        {
            foreach (var value in javaobjects.Values)
            {
                if (value == null || value.Equals(null))
                    continue;
                value.Dispose();
            }
            javaobjects.Clear();
            javaobjects = null;
        }
        onMessage = null;
        onApplicationPause = null;
        onDestroy = null;
        onPressQuitKey = null;
        onCsMessage = null;
        onKeyDown = null;
    }
}
