using UnityEditor;
using UnityEngine;
using System.IO;
using System.Diagnostics;

namespace Builder
{

    class MakerResConfig
    {
        static public string tsbuildPyPath
        {
            get { return "/Editor/tools/tsbuild.py"; }
        }
    }

    public class BuildTsScript : EditorWindow
    {
        [@MenuItem("Build/Build ts script")]
        public static void Build()
        {
            BuildTs("");
        }

        public static void BuildTs(string args)
        {
            Process p = new Process();
            p.StartInfo.FileName = Platform.isEditorWin ? "python" : "python3.5";
            p.StartInfo.Arguments = Application.dataPath + MakerResConfig.tsbuildPyPath + args;
            p.Start();
            p.WaitForExit();
            p.Close();
            AssetDatabase.Refresh();
        }
    }
}