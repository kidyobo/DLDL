using UnityEngine;
public class Log
{
    public static int svnver = 0;
    public static void log(object message)
    {
        Debug.Log(message.ToString());
    }

    public static void logWarning(object message)
    {
        Debug.LogWarning(message.ToString());
    }

    public static void logError(object message)
    {
        Debug.LogError(appendVerInfo(message));
    } 

    public static void logError(object message, Object context)
    {
        Debug.LogError(appendVerInfo(message), context);
    }

    private static object appendVerInfo(object message)
    {
#if PUBLISH // for bugly
        return string.Format("<svnver:{0}>{1}", svnver, message);
#else
        return message;
#endif
    }
}