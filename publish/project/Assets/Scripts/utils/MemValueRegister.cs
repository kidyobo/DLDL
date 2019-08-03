using System.Collections.Generic;


class MemValueRegister
{
    static private Dictionary<string, object> regs = new Dictionary<string, object>();
    public static string GetString(string key)
    {
        object val;
        if (regs.TryGetValue(key, out val)) return (string)val;
        return "";
    }
    public static void RegString(string key, string val)
    {
        regs[key] = val;
    }
    public static int GetInt(string key)
    {
        object val;
        if (regs.TryGetValue(key, out val)) return (int)val;
        return 0;
    }
    public static void RegInt(string key, int val)
    {
        regs[key] = val;
    }
    public static bool GetBool(string key)
    {
        object val;
        if (regs.TryGetValue(key, out val)) return (bool)val;
        return false;
    }
    public static void RegBool(string key, bool val)
    {
        regs[key] = val;
    }
}

