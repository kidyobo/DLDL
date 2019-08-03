
class VersionComparer
{
    // 比较ver1和ver2大小，ver1<ver2 返回 -1 ver1 == ver2 返回 0， ver1>ver2 返回 1
    // ver的格式为 xxx.xxx.xxx.xxx
    public static long Compare(string ver1, string ver2)
    {
        return GetVersion(ver1) - GetVersion(ver2);
    }
    private static long GetVersion(string ver)
    {
        var arr = ver.Split('.');
        if (arr.Length != 4) return -1;

        long a0 = 0; long.TryParse(arr[0], out a0);
        long a1 = 0; long.TryParse(arr[1], out a1);
        long a2 = 0; long.TryParse(arr[2], out a2);
        long a3 = 0; long.TryParse(arr[3], out a3);
        return a0 * 100000 * 1000 * 1000 + a1 * 100000 * 1000 + a2 * 100000 + a3;
    }
}

class UrlUtil
{
    public static string Combineurl(params string[] parts)
    {
        string url = "";
        for (int i = 0; i < parts.Length - 1; i++)
        {
            string p = parts[i];
            url = url + p;
            if (!url.EndsWith("/"))
            {
                url = url + "/";
            }
        }
        url = url + parts[parts.Length - 1];
        return url;
    }
}