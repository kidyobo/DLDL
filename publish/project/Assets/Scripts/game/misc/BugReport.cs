using UnityEngine;
using System.IO;

public class BugReport {
    static bool happened = false;
    static public void Report(string error) {
        if (!happened)
        {
            Log.logError(error);
#if UNITY_EDITOR
            TsStackWindow.Log(error);
#endif
            happened = true;
        }
    }
}



