using System.IO;
using System.Text;
using System;
public class PCStreamingSetting
{
    private static bool init;
    private static string _channelID = "0";
    public static string channelID
    {
        get
        {
            if (!init)
            {
                Load();
            }
            return _channelID;
        }
    }
    static void Load()
    {
        init = true;
        try
        {
            if (File.Exists(AssetCaching.streamingAssetsPath + "/cconfig.txt"))
            {
                var str = File.ReadAllText(AssetCaching.streamingAssetsPath + "/cconfig.txt");
                if (str != null)
                {
                    _channelID = str.Trim();
                }
            }
        }
        catch (Exception e)
        {
            UnityEngine.Debug.LogWarning(e.Message);
        }
    }
}