#if UNITY_IPHONE
using UnityEngine;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.XCodeEditor;
using System.Xml;
using System.IO;
using UnityEditor.iOS.Xcode;
using System.Collections;
using System.Collections.Generic;
//对应游戏的gameid
enum GameId
{
    //内网
    ossNeiWang = 1,
    publishTest = 3,
}

//对应游戏的平台id
enum GamePlat
{
    //内网
    develop = 0,
    //紫云
    douluo = 1,
}

public static class XCodePostProcess
{
    private static int gameId = IosCertificate.gameId;
    private static int gamePlat = IosCertificate.plat;
#if UNITY_EDITOR
    [PostProcessBuild(100)]
    public static void OnPostProcessBuild(BuildTarget target, string pathToBuiltProject)
    {
        if (target != BuildTarget.iOS)
        {
            Debug.LogWarning("Target is not iPhone. XCodePostProcess will not run");
            return;
        }
        Debug.Log("============================PostProcessBuild==============================");
        ////////////////////////////////////编辑plist,添加证书////////////////////////////////////////////
        //将Mod拷贝到IOS工程下
        string desPath = pathToBuiltProject + "/Libraries/Editor/XUPorter/Mods";
        copyDir(Application.dataPath + "/Editor/XUPorter/Mods", desPath);
        //生成1024Icon
        //ReplaceAppIcon(pathToBuiltProject);
        // Create a new project object from build target
        XCProject project = new XCProject(pathToBuiltProject);
        // Find and run through all projmods files to patch the project.
        // Please pay attention that ALL projmods files in your project folder will be excuted!
        string[] files = Directory.GetFiles(desPath, "*.projmods", SearchOption.AllDirectories);
        List<string> needAddList = new List<string>();
        foreach (string file in files)
        {
            string fileName = file.Substring(file.LastIndexOf("/") + 1);
            string fileNewName = fileName.Remove(fileName.LastIndexOf("."));
            if (fileNewName == "sdk")
            {
                //sdk目录做检查需要自动加入工程的framework文件
                needAddList = GetAllFrameworksFromSdk(pathToBuiltProject);
            }
            project.ApplyMod(file, needAddList);
        }
        //再次加上frameworkSearchPath，防止某些sdk没有配置files
        project.AddFrameworkSearchPaths("$(SRCROOT)/Libraries/Editor/XUPorter/Mods/sdk");
        //设置签名的证书， 第二个参数 你可以设置成你的证书
        string provisioningFile = IosCertificate.provisioningFile;
        string codeSignIdenTity = IosCertificate.codeSignIdenTity;
        string developTeam = IosCertificate.developTeam;
        string valid_archs = "arm64 armv7 armv7s";
        project.overwriteBuildSetting("VALID_ARCHS", valid_archs, "Release");
        project.overwriteBuildSetting("VALID_ARCHS", valid_archs, "Debug");
        project.overwriteBuildSetting("VALID_ARCHS", valid_archs, "ReleaseForProfiling");
        project.overwriteBuildSetting("VALID_ARCHS", valid_archs, "ReleaseForRunning");

        project.overwriteBuildSetting("ARCHS", "arm64", "Release");
        project.overwriteBuildSetting("ARCHS", "arm64", "Debug");
        project.overwriteBuildSetting("ARCHS", "arm64", "ReleaseForProfiling");
        project.overwriteBuildSetting("ARCHS", "arm64", "ReleaseForRunning");

        project.overwriteBuildSetting("ENABLE_BITCODE", "No", "Release");
        project.overwriteBuildSetting("ENABLE_BITCODE", "No", "Debug");
        project.overwriteBuildSetting("ENABLE_BITCODE", "No", "ReleaseForProfiling");
        project.overwriteBuildSetting("ENABLE_BITCODE", "No", "ReleaseForRunning");

        project.overwriteBuildSetting("CODE_SIGN_IDENTITY[sdk = Any iOS SDK]", codeSignIdenTity, "Release");
        project.overwriteBuildSetting("CODE_SIGN_IDENTITY[sdk = Any iOS SDK]", codeSignIdenTity, "Debug");
        project.overwriteBuildSetting("CODE_SIGN_IDENTITY[sdk = Any iOS SDK]", codeSignIdenTity, "ReleaseForProfiling");
        project.overwriteBuildSetting("CODE_SIGN_IDENTITY[sdk = Any iOS SDK]", codeSignIdenTity, "ReleaseForRunning");

        project.overwriteBuildSetting("PROVISIONING_PROFILE", provisioningFile, "Release");
        project.overwriteBuildSetting("PROVISIONING_PROFILE", provisioningFile, "Debug");
        project.overwriteBuildSetting("PROVISIONING_PROFILE", provisioningFile, "ReleaseForProfiling");
        project.overwriteBuildSetting("PROVISIONING_PROFILE", provisioningFile, "ReleaseForRunning");

        project.overwriteBuildSetting("PROVISIONING_PROFILE_SPECIFIER", provisioningFile, "Release");
        project.overwriteBuildSetting("PROVISIONING_PROFILE_SPECIFIER", provisioningFile, "Debug");
        project.overwriteBuildSetting("PROVISIONING_PROFILE_SPECIFIER", provisioningFile, "ReleaseForProfiling");
        project.overwriteBuildSetting("PROVISIONING_PROFILE_SPECIFIER", provisioningFile, "ReleaseForRunning");

        project.overwriteBuildSetting("DEVELOPMENT_TEAM", developTeam, "Release");
        project.overwriteBuildSetting("DEVELOPMENT_TEAM", developTeam, "Debug");
        project.overwriteBuildSetting("DEVELOPMENT_TEAM", developTeam, "ReleaseForProfiling");
        project.overwriteBuildSetting("DEVELOPMENT_TEAM", developTeam, "ReleaseForRunning");

        project.overwriteBuildSetting("GCC_ENABLE_OBJC_EXCEPTIONS", "YES", "Release");
        project.overwriteBuildSetting("GCC_ENABLE_OBJC_EXCEPTIONS", "YES", "Debug");
        project.overwriteBuildSetting("GCC_ENABLE_OBJC_EXCEPTIONS", "YES", "ReleaseForProfiling");
        project.overwriteBuildSetting("GCC_ENABLE_OBJC_EXCEPTIONS", "YES", "ReleaseForRunning");


        //project.overwriteBuildSetting("GCC_OPTIMIZATION_LEVEL", "None[-O0]", "Debug");
        //project.overwriteBuildSetting("GCC_OPTIMIZATION_LEVEL", "None[-O0]", "Release");
        // 编辑plist 文件
        string path = Path.GetFullPath(pathToBuiltProject);
        EditorPlist(path);
        //编辑代码文件

        EditorCode(path);

        // Finally save the xcode project

        project.Save();
        ///////////////////////////////////添加库文件////////////////////////////////////////////////////
        string projPath = PBXProject.GetPBXProjectPath(pathToBuiltProject);
        PBXProject a = new PBXProject();
        a.ReadFromString(File.ReadAllText(projPath));
        string targetPath = a.TargetGuidByName(PBXProject.GetUnityTargetName());
        a.AddFrameworkToProject(targetPath, "libz.1.2.5.tbd", false);
        a.AddFrameworkToProject(targetPath, "libc++.tbd", false);
        a.AddFrameworkToProject(targetPath, "libc++.1.tbd", false);
        a.AddFrameworkToProject(targetPath, "libsqlite3.tbd", false);
        a.AddFrameworkToProject(targetPath, "libresolv.9.tbd", false);
        a.AddFrameworkToProject(targetPath, "Security.framework", true);
        a.AddFrameworkToProject(targetPath, "SystemConfiguration.framework", true);
        a.AddFrameworkToProject(targetPath, "JavaScriptCore.framework", false);
        a.AddFrameworkToProject(targetPath, "UserNotifications.framework", false);
        a.AddFrameworkToProject(targetPath, "StoreKit.framework", false);
        /////////////////添加到Embed Frameworks///////////////////
        //AddBuildPuse(a);
        a.WriteToFile(projPath);
        ///////开启Caplicaties添加keysharing/////////////////
        //EditorCapability(pathToBuiltProject, a);
        //添加lib(此方法也可以,先保留)
        //AddLibToProject(a,targetPath, "libz.tbd");
        //AddLibToProject(a, targetPath, "libc++.tbd");
    }
    static List<string> GetAllFrameworksFromSdk(string pathToBuiltProject)
    {
        //挑选framework
        List<string> frameList = new List<string>();
        string framePath = pathToBuiltProject + "/Libraries/Editor/XUPorter/Mods/sdk";
        string[] newframeflies = null;
        if (Directory.Exists(framePath))
        {
            newframeflies = Directory.GetFiles(framePath);
        }
        if (newframeflies != null && newframeflies.Length > 0)
        {
            foreach (string file in newframeflies)
            {
                string fileName = file.Substring(file.LastIndexOf("/") + 1);
                if (fileName.EndsWith(".meta"))
                {
                    string newFileName = fileName.Remove(fileName.LastIndexOf("."));
                    if (newFileName.EndsWith(".framework"))
                    {
                        frameList.Add(newFileName);
                    }
                }
            }
        }
        return frameList;
    }


    //替换1024appIcon
    private static void ReplaceAppIcon(string pathToBuiltProject)
    {
        string srcPath = Application.dataPath + "/Editor/XUPorter/AppIcon/";
        string[] iconflies = null;
        if (Directory.Exists(srcPath))
        {
            iconflies = Directory.GetFiles(srcPath);
        }
        if (iconflies != null && iconflies.Length > 0)
        {
            string targetPath = pathToBuiltProject + "/Unity-iPhone/Images.xcassets/AppIcon.appiconset/";
            foreach (string file in iconflies)
            {
                string fileName = file.Substring(file.LastIndexOf("/") + 1);
                Debug.Log("Icon Name:" + fileName);
                File.Copy(file, Path.Combine(targetPath, fileName), true);
            }
        }
    }


    private static void copyDir(string srcPath, string desPath)
    {
        //Now Create all of the directories
        foreach (string dirPath in Directory.GetDirectories(srcPath, "*",
            SearchOption.AllDirectories))
            Directory.CreateDirectory(dirPath.Replace(srcPath, desPath));

        //Copy all the files & Replaces any files with the same name
        foreach (string newPath in Directory.GetFiles(srcPath, "*.*",
            SearchOption.AllDirectories))
            File.Copy(newPath, newPath.Replace(srcPath, desPath), true);
    }


    private static void EditorCode(string filePath)
    {
        //读取UnityAppController.mm文件
        XClass UnityAppController = new XClass(filePath + "/Classes/UnityAppController.mm");
        UnityAppController.WriteBelow("#include \"Unity/GlesHelper.h\"", "#import \"SDKConnector.h\"");
        UnityAppController.WriteBelow("[KeyboardDelegate Initialize];"
        , "  [[SDKConnector sharedInterce] replyPushNotificationAuthorization:application];\n   if(application.applicationIconBadgeNumber > 0) {\n  application.applicationIconBadgeNumber = 0;\n   }");
        //去掉竖屏支持
        UnityAppController.Replace("return (1 << UIInterfaceOrientationPortrait) | (1 << UIInterfaceOrientationPortraitUpsideDown)\n        | (1 << UIInterfaceOrientationLandscapeRight) | (1 << UIInterfaceOrientationLandscapeLeft);",
                "return (1 << UIInterfaceOrientationLandscapeRight) | (1 << UIInterfaceOrientationLandscapeLeft);");
        //bugly初始化
        UnityAppController.WriteBelow("#include \"Unity/GlesHelper.h\"", "#import<Bugly/Bugly.h>");
        UnityAppController.WriteBelow("[KeyboardDelegate Initialize];"
        , "     [Bugly startWithAppId:@\"6951e73d9a\"];");
        switch (gamePlat)
        {
            case (int)GamePlat.douluo:
                //斗罗
                //UnityAppController.WriteBelow("#include \"PluginBase/AppDelegateListener.h\"", "#import \"PulverizedHoleGame.h\"");
                break;
        }
    }


    private static void EditorCapability(string pathToBuildProject, PBXProject proj)
    {
        //string projPath = pathToBuildProject + "/Unity-iPhone.xcodeproj/project.pbxproj";
        //proj.ReadFromString(File.ReadAllText(projPath));
        //string target = proj.TargetGuidByName(PBXProject.GetUnityTargetName());
        //proj.AddCapability(target, PBXCapabilityType.KeychainSharing);
        //File.WriteAllText(projPath, proj.WriteToString());

        //string entitlements = "Unity-iPhone/fygame.entitlements";
        //XcodeUnityCapability projCapability = new XcodeUnityCapability(projPath, entitlements, PBXProject.GetUnityTargetName());
        //string[] keyGroups = { "com.lhh" };
        //projCapability.AddKeychainSharing(keyGroups);
        //projCapability.WriteToFile();
    }


    private static void AddBuildPuse(PBXProject project)
    {
        //string frameworkPath = project.AddFile("Frameworks/ZQSDK.framework", "Frameworks/ZQSDK.framework", PBXSourceTree.Source);
        //string target = project.TargetGuidByName(PBXProject.GetUnityTargetName());
        //string embedPhase = project.AddCopyFilesBuildPhase(target, "Embed Frameworks", "", "10");
        //project.AddFileToBuildSection(target, embedPhase, frameworkPath);
        //Debug.Log("AddBuildPuse  Embed Frameworks");
    }



    private static void EditorPlist(string filePath)
    {
        XCPlist list = new XCPlist(filePath);
        string bundle = PlayerSettings.applicationIdentifier;
        string companyName = PlayerSettings.companyName;
        //在plist里面增加一行
        string[] PlistAdd = getPlatFormPlist();
        for (int i = 0; i < PlistAdd.Length; i++)
        {
            list.AddKey(PlistAdd[i]);
        }
        //在plist里面替换一行
        string oldBundleName = "com." + companyName + ".${PRODUCT_NAME}";
        list.ReplaceKey("<string>" + oldBundleName + "</string>", "<string>" + bundle + "</string>");
        //保存
        list.Save();
    }


    //plist优先gameid去获取,没有gameid在用平台plat去获取
    static string[] getPlatFormPlist()
    {
        ///////////////////////////////////////通用的权限参数////////////////////////////////////
        string common = @"
	        <key>NSCameraUsageDescription</key>
	        <string>为了使用保存信息账号功能,请求相机的使用</string>
 	        <key>NSMicrophoneUsageDescription</key>
	        <string>为了使用语音功能,请求麦克风使用</string>
            <key>NSPhotoLibraryUsageDescription</key>
            <string>为保存图片到相册,获取系统相册权限</string>
            <key>NSPhotoLibraryAddUsageDescription</key>
            <string>请求添加图片到系统相册</string>";
        string[] commonPlistAdd = { common };
        ///////////////////先用gameid去获取plist,这些都是比较特殊的马甲包//////////////////////////
        switch (gameId)
        {
            case (int)GameId.ossNeiWang:
                break;
        }
        ////////////////////////////////gameid取完了在用通用的plat去获取////////////////////////////////////////////
        switch (gamePlat)
        {
            case (int)GamePlat.douluo:
                {
                    //西游
                    string appQuersis = @"
                <key>LSApplicationQueriesSchemes</key>
                <array>
                    <string>weixin</string>
                    <string>wechat</string>
                    <string>alipay</string>
                    <string>alipayshare</string>
                    <string>mqq</string>
                    <string>mqqwpa</string>
                </array>";
                    string xiYouURLType = @"
                <key>CFBundleURLTypes</key>
                <array>
                    <dict>
                        <key>CFBundleTypeRole</key>
                        <string>Editor</string>
                        <key>CFBundleURLName</key>
                        <string>pay</string>
                        <key>CFBundleURLSchemes</key>
                        <array>
                            <string>xy104836063562</string>
                        </array>
                    </dict>
                </array>";
                    string[] a = { appQuersis, xiYouURLType, common};
                    return a;
                }
        }
        return commonPlistAdd;
    }


    //添加lib方法
    static void AddLibToProject(PBXProject inst, string targetGuid, string lib)
    {
        string fileGuid = inst.AddFile("usr/lib/" + lib, "Frameworks/" + lib, PBXSourceTree.Sdk);
        inst.AddFileToBuild(targetGuid, fileGuid);
    }
#endif
}
#endif
