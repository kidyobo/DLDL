namespace UnityEditor.XCodeEditor.Edit.Plist
{
    public class ShareSDKPlist : IEditPlist
    {
        public void Edit(XCPlist plist)
        {

            //-----这是试例代码------//

            string bundle = "com.blood.xup";

            string PlistAdd = @"  
                        <key>CFBundleURLTypes</key>
                        <array>
                        <dict>
                        <key>CFBundleTypeRole</key>
                        <string>Editor</string>
                        <key>CFBundleURLIconFile</key>
                        <string>Icon@2x</string>
                        <key>CFBundleURLName</key>
                        <string>" + bundle + @"</string>
                        <key>CFBundleURLSchemes</key>
                        <array>
                        <string>ww123456</string>
                        </array>
                        </dict>
                        </array>";

            //在plist里面增加一行
            plist.AddKey(PlistAdd);
            //在plist里面替换一行
            plist.ReplaceKey("<string>com.blood.${PRODUCT_NAME}</string>", "<string>" + bundle + "</string>");
        }
    }
}