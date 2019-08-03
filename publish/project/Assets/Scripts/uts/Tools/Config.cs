#if UNITY_EDITOR
using UnityEngine;

namespace Uts
{
    public static class Config
    {
        public static readonly string utsPath = Application.dataPath + "/Scripts/Uts/StaticWrap/";
        public static readonly string wrapsPath = utsPath + "Wraps/";
        public static readonly string utsDeclarePath = Application.dataPath.Substring(0, Application.dataPath.Length - 6) + "TsScripts/uts/declare/";
    }
}
#endif //UNITY_EDITOR