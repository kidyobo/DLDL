using UnityEditor;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using System.Reflection;
using UnityEditor.Callbacks;
using System;
using UnityEngine.Rendering;

class BuildCommand
{
    /// http://www.tuicool.com/articles/6nU7b2
    private static string[] GetBuildScenes()
    {
        List<string> names = new List<string>();
        foreach (EditorBuildSettingsScene e in EditorBuildSettings.scenes)
        {
            if (e == null)
            {
                continue;
            }
            if (e.enabled)
            {
                names.Add(e.path);
            }
        }
        return names.ToArray();
    }

    private static string GetCommandLineArg(string name)
    {
        string[] args = System.Environment.GetCommandLineArgs();
        for (int i = 0; i < args.Length; i++)
        {
            if (args[i].ToLower() == name.ToLower())
            {
                if (args.Length > i + 1)
                {
                    return args[i + 1];
                }
            }
        }
        return "";
    }

    private static void SetAndroidSign()
    {
        PlayerSettings.Android.keystoreName = "./wj.keystore";//"key.store"
        PlayerSettings.Android.keystorePass = "654321";//"key.store.password"
        PlayerSettings.Android.keyaliasName = "wj.keystore";//"key.alias"
        PlayerSettings.Android.keyaliasPass = "654321";//"key.alias.password"
    }

    private static BuildOptions GetBuildOptions(string defines)
    {
        BuildOptions ops = BuildOptions.None;
        if (defines.Contains("_DEBUG"))
        {
            ops |= BuildOptions.Development;
            ops |= BuildOptions.AllowDebugging;
            ops |= BuildOptions.ConnectWithProfiler;
        }
        else if (defines.Contains("EXPORT_PROJECT"))
        {
            ops |= BuildOptions.AcceptExternalModificationsToPlayer;
        }
        else
        {
            ops |= BuildOptions.None;
        }
        return ops;
    }

    private static int GetAndroidBundleVersionCode(string version)
    {
        int code = 1;
        string[] vers = version.Split('.');
        int.TryParse(vers[vers.Length - 1], out code);
        return code;
    }

    public static void ExportAndroidProj()
    {
        SetDefaultIcon(BuildTargetGroup.Android);
        string defines = GetCommandLineArg("-defines");
        if (defines != "")
        {
            PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.Android, defines.Replace('.', ';'));
        }

        SetAndroidSign();
        EditorPrefs.SetString("AndroidSdkRoot", GetCommandLineArg("-androidsdkroot"));
        string version = GetCommandLineArg("-numberversion");
        PlayerSettings.SplashScreen.showUnityLogo = false;
        PlayerSettings.SplashScreen.show = false;
        PlayerSettings.bundleVersion = version;
        PlayerSettings.Android.bundleVersionCode = GetAndroidBundleVersionCode(version);
        PlayerSettings.Android.targetDevice = defines.Contains("ARMX86") ? AndroidTargetDevice.FAT : AndroidTargetDevice.ARMv7;
        PlayerSettings.SetApplicationIdentifier(BuildTargetGroup.Android, GetCommandLineArg("-bundleId"));
        PlayerSettings.mobileMTRendering = defines.Contains("_MT_RENDERING");
        PlayerSettings.gpuSkinning = defines.Contains("_GPU_SKINNING");
        PlayerSettings.Android.targetSdkVersion = (AndroidSdkVersions)int.Parse(GetCommandLineArg("-targetSdkVersion"));
        PlayerSettings.SetScriptingBackend(BuildTargetGroup.Android, defines.Contains("_IL2CPP") ? ScriptingImplementation.IL2CPP : ScriptingImplementation.Mono2x);
        PlayerSettings.productName = "proj";
        Debug.Log("@@ EditorUserBuildSettings.exportAsGoogleAndroidProject:" + EditorUserBuildSettings.exportAsGoogleAndroidProject);
        EditorUserBuildSettings.exportAsGoogleAndroidProject = true;
        EditorUserBuildSettings.androidBuildSystem = AndroidBuildSystem.Gradle;
        string path = Application.dataPath.Replace("Assets", "");
        string exportPath = Path.Combine(path, "../export");
        if (Directory.Exists(exportPath)) Directory.Delete(exportPath, true);
        Debug.Log("@@ exportPath:" + exportPath);
        BuildPipeline.BuildPlayer(GetBuildScenes(), exportPath, BuildTarget.Android, BuildOptions.AcceptExternalModificationsToPlayer);

        if (defines.Contains("_IL2CPP"))
        {
            string apkPath = GetCommandLineArg("-apkPath");
            CopyARMSymbolsFromProj(Path.Combine(Application.dataPath, "../../Symbols/armeabi-v7a/" + Path.GetFileNameWithoutExtension(apkPath) + "/"));
        }
    }

    private static string ANDROID_PATH = "../../bin/wj_v{0}.apk";
    [MenuItem("Building/BuildForAndroid")]
    public static void BuildForAndroid()
    {
        SetDefaultIcon(BuildTargetGroup.Android);
        string defines = GetCommandLineArg("-defines");
        if (defines != "")
        {
            PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.Android, defines.Replace('.', ';'));
        }

        SetAndroidSign();
        EditorPrefs.SetString("AndroidSdkRoot", GetCommandLineArg("-androidsdkroot"));
        string version = GetCommandLineArg("-numberversion");
        PlayerSettings.bundleVersion = version;
        if (defines.Contains("ARMX86"))
            PlayerSettings.Android.targetDevice = AndroidTargetDevice.FAT;
        else
            PlayerSettings.Android.targetDevice = AndroidTargetDevice.ARMv7;
        PlayerSettings.Android.bundleVersionCode = GetAndroidBundleVersionCode(version);
        string bundleId = GetCommandLineArg("-bundleId");
        PlayerSettings.SetApplicationIdentifier(BuildTargetGroup.Android, bundleId);
        string productName = GetCommandLineArg("-productName");
        PlayerSettings.productName = productName;
        Debug.Log("@@@bundleId:" + bundleId + ", productName:" + productName);
        PlayerSettings.mobileMTRendering = defines.Contains("_MT_RENDERING");
        PlayerSettings.gpuSkinning = defines.Contains("_GPU_SKINNING");
        int targetSdkVersion = int.Parse(GetCommandLineArg("-targetSdkVersion"));
        PlayerSettings.Android.targetSdkVersion = (AndroidSdkVersions)targetSdkVersion;
        EditorUserBuildSettings.exportAsGoogleAndroidProject = false;
        EditorUserBuildSettings.androidBuildSystem = AndroidBuildSystem.Internal;
        if (defines.Contains("_IL2CPP"))
            PlayerSettings.SetScriptingBackend(BuildTargetGroup.Android, ScriptingImplementation.IL2CPP);
        else
            PlayerSettings.SetScriptingBackend(BuildTargetGroup.Android, ScriptingImplementation.Mono2x);
        string apkPath = GetCommandLineArg("-apkPath");
        if (apkPath == "")
            apkPath = Path.Combine(Application.dataPath, string.Format(ANDROID_PATH, version));
        Builder.FileUtil.CreateDirectory(apkPath);
        BuildPipeline.BuildPlayer(GetBuildScenes(), apkPath, BuildTarget.Android, GetBuildOptions(defines));

        if (defines.Contains("_IL2CPP"))
            CopyARMSymbols(Path.Combine(Application.dataPath, "../../Symbols/armeabi-v7a/" + Path.GetFileNameWithoutExtension(apkPath) + "/"));
    }
    static void SetDefaultIcon(BuildTargetGroup platForm)
    {
        string path = "Assets/Arts/platIcon/" + game.Config.gameid + ".png";
        Texture2D texture = AssetDatabase.LoadAssetAtPath(path, typeof(Texture2D)) as Texture2D;
        int[] iconSize = PlayerSettings.GetIconSizesForTargetGroup(platForm);
        Texture2D[] textureArray = new Texture2D[iconSize.Length];
        if (textureArray.Length > 0)
        {
            for (int i = 0; i < textureArray.Length; i++)
            {
                textureArray[i] = texture;
            }
            PlayerSettings.SetIconsForTargetGroup(platForm, textureArray);
            AssetDatabase.SaveAssets();
        }
        Debug.Log("iconSize:= " + textureArray.Length + " set icon path:" + path);
    }
    private static string PC_PATH = "../../bin/wj_v{0}";
    [MenuItem("Building/BuildForPC")]
    public static void BuildForPC()
    {
        SetDefaultIcon(BuildTargetGroup.Standalone);
        string defines = GetCommandLineArg("-defines");
        if (defines != "")
        {
            PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.Standalone, defines.Replace('.', ';'));
        }
        PlayerSettings.SplashScreen.showUnityLogo = false;
        PlayerSettings.SplashScreen.show = false;
        PlayerSettings.forceSingleInstance = true;
        string version = GetCommandLineArg("-numberversion");
        PlayerSettings.bundleVersion = version;
        string bundleId = GetCommandLineArg("-bundleId");
        PlayerSettings.SetApplicationIdentifier(BuildTargetGroup.Standalone, bundleId);
        string productName = GetCommandLineArg("-productName").Replace("%20", " ");
        PlayerSettings.productName = productName;
        Debug.Log("@@@bundleId:" + bundleId + ", productName:" + productName);
        PlayerSettings.gpuSkinning = defines.Contains("_GPU_SKINNING");
        PlayerSettings.usePlayerLog = true;
        string path = GetCommandLineArg("-path");
        if (path == "")
            path = Path.Combine(Application.dataPath, string.Format(PC_PATH, version));
        Builder.FileUtil.CreateDirectory(path);
        BuildPipeline.BuildPlayer(GetBuildScenes(), path, BuildTarget.StandaloneWindows, GetBuildOptions(defines));
    }

    public static void BuildForIOS()
    {
        SetDefaultIcon(BuildTargetGroup.iOS);
        string defines = GetCommandLineArg("-defines");
        string xcode_proj_path = GetCommandLineArg("-exportProjPath");
        if (defines != "")
        {
            PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.iOS, defines.Replace('.', ';'));
        }

        PlayerSettings.SplashScreen.show = false;

        GraphicsDeviceType[] apis = { GraphicsDeviceType.Metal, GraphicsDeviceType.OpenGLES2 };
        PlayerSettings.SetGraphicsAPIs(BuildTarget.iOS, apis);

        PlayerSettings.iOS.targetDevice = iOSTargetDevice.iPhoneAndiPad;
        PlayerSettings.iOS.allowHTTPDownload = true;
        PlayerSettings.iOS.appleEnableAutomaticSigning = false;
        PlayerSettings.iOS.targetOSVersionString = "9.0";
        //Sets an integer value associated with the architecture of a BuildTargetPlatformGroup. 0 - None, 1 - ARM64, 2 - Universal
        PlayerSettings.SetArchitecture(BuildTargetGroup.iOS, 1);
        PlayerSettings.SetScriptingBackend(BuildTargetGroup.iOS, ScriptingImplementation.IL2CPP);
        string version = GetCommandLineArg("-numberversion");
        PlayerSettings.bundleVersion = version;

        string iosBuildVersion = GetCommandLineArg("-iosBuildVersion");
        PlayerSettings.iOS.buildNumber = iosBuildVersion;

        string bundleId = GetCommandLineArg("-bundleId");
        PlayerSettings.SetApplicationIdentifier(BuildTargetGroup.iOS, bundleId);
        string comPanyName = GetCommandLineArg("-comPanyName");
        PlayerSettings.companyName = comPanyName;
        string productName = GetCommandLineArg("-productName");
        PlayerSettings.productName = productName;
        PlayerSettings.stripEngineCode = false;

        int randomSeed = 0;
        int.TryParse(GetCommandLineArg("-randomSeed"), out randomSeed);
        Uts.WrapperGenerator.Generate(randomSeed);

        //设置app图标
        Debug.Log("---------------------------------iosC#BuildSetting------------------------------------------------");
        Debug.Log("---iosBuildSetting----bundleId:" + bundleId + ", productName:" + productName + "comPanyName:= " + comPanyName + " iosBuildVersion:= " + iosBuildVersion);
        Debug.Log("optionsValueFelix:= "+ GetBuildOptions(defines));
        BuildPipeline.BuildPlayer(GetBuildScenes(), xcode_proj_path, BuildTarget.iOS, GetBuildOptions(defines));
    }

    public static void CreateAssetBundles()
    {
        string uploadResDir = GetCommandLineArg("-UploadResDir");
        string gameid = GetCommandLineArg("-gameid");
        Debug.Log("UploadResDir:" + uploadResDir);
        string defines = GetCommandLineArg("-defines");
        Builder.BuildPlatform platform = null;
        string platname = GetCommandLineArg("-platform");
        if (platname == "Android")
        {
            if (defines != "")
            {
                PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.Android, defines.Replace('.', ';'));
            }
            platform = new Builder.BuildPlatform(BuildTarget.Android);
        }
        else if (platname == "iOS")
        {
            if (defines != "")
            {
                PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.iOS, defines.Replace('.', ';'));
            }
            platform = new Builder.BuildPlatform(BuildTarget.iOS);
        }
        else if (platname == "Windows")
        {
            if (defines != "")
            {
                PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.Standalone, defines.Replace('.', ';'));
            }
            platform = new Builder.BuildPlatform(BuildTarget.StandaloneWindows);
        }
        Debug.Log("create asset bundles target:" + platform.name);
        Builder.AssetBundleEditor.GenerateAllAndUpload(uploadResDir, platform, gameid);
    }

    public static void CopyBuildinAssets()
    {
        string uploadResDir = GetCommandLineArg("-UploadResDir");
        Builder.BuildPlatform platform = null;
        string platname = GetCommandLineArg("-platform");
        string gameid = GetCommandLineArg("-gameid");
        if (platname == "Android")
        {
            platform = new Builder.BuildPlatform(BuildTarget.Android);
        }
        else if (platname == "iOS")
        {
            platform = new Builder.BuildPlatform(BuildTarget.iOS);
        }
        else if (platname == "Windows")
        {
            platform = new Builder.BuildPlatform(BuildTarget.StandaloneWindows);
        }
        Debug.Log("CopyBuildIn bundles target:" + platform.name);
        Builder.AssetBundleEditor.CopyAllBuildinAssets(uploadResDir, platform, gameid);
    }

    public static void Localize()
    {
        LocalizeEditor.Localize();
    }

    private static void CopyARMSymbols(string symbolsDir)
    {
        string sourcefileARM = Path.Combine(Application.dataPath, "../Temp/StagingArea/libs/armeabi-v7a/libil2cpp.so.debug");
        Builder.FileUtil.CreateDirectory(symbolsDir);
        File.Copy(sourcefileARM, Path.Combine(symbolsDir, "libil2cpp.debug.so"));
    }

    private static void CopyARMSymbolsFromProj(string symbolsDir)
    {
        string sourcefileARM = Path.Combine(Application.dataPath, "../../export/proj/src/main/jniLibs/armeabi-v7a/libil2cpp.so.debug");
        Builder.FileUtil.CreateDirectory(symbolsDir);
        File.Copy(sourcefileARM, Path.Combine(symbolsDir, "libil2cpp.debug.so"));

        string sourceCppBase = Path.Combine(Application.dataPath, "../Temp/StagingArea/Il2Cpp/il2cppOutput/");
        var files = Directory.GetFiles(sourceCppBase, "*.cpp", SearchOption.AllDirectories);
        string cutpath = "il2cppOutput/";
        foreach (string file in files)
        {
            string dstfile = Path.Combine(symbolsDir, file.Substring(file.IndexOf(cutpath)));
            string dstdir = Path.GetDirectoryName(dstfile);
            if ( !Directory.Exists(dstdir) )
            {
                Directory.CreateDirectory(dstdir);
            }
            File.Copy(file, dstfile);
        }
    }
}

