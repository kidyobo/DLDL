namespace UnityEditor.XCodeEditor.Edit.OC
{
    public class ShareSDKOC : IEditOCCode
    {
        public void Edit(XClass UnityAppController)
        {
            //-----这是试例代码------//

            //在指定代码后面增加一行代码
            UnityAppController.WriteBelow("#include \"PluginBase/AppDelegateListener.h\"", "#import <ShareSDK/ShareSDK.h>");

            //在指定代码中替换一行
            UnityAppController.Replace("return YES;", "return [ShareSDK handleOpenURL:url sourceApplication:sourceApplication annotation:annotation wxDelegate:nil];");

            //在指定代码后面增加一行
            UnityAppController.WriteBelow("UnityCleanup();\n}", "- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url\r{\r    return [ShareSDK handleOpenURL:url wxDelegate:nil];\r}");
        }
    }
}