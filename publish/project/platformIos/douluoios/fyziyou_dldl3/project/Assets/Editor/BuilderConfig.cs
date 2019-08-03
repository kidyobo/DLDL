using System.Collections.Generic;

public class BuilderConfig
{
    public static readonly string[] windowsBuildinList = new string[]
{
        "ui/FixedMessageBox.ab","ui/LoadingView.ab","tsbytes",
};
    /// <summary>
    /// 打到包内的文件夹名称，
    /// </summary>
    public static readonly string[] mobileBuildinList = new string[]
    {
        "ui",
	"tsbytes",
        "bjsondata:android", // 只在android有效
        "data:ios,windows", // 在ios，windows下有效
        "preload.ab",
        "effect",
        "net",
        "misc.ab" ,
        "shader.ab",
        "material" ,
        "camera",
        "txtdata",
        "map/data",
        "model/hero",
        "scene",
        "model/monster",
        "model/boss/410001/410001.ab",
        "model/boss/400012/400012.ab",
        "model/boss/410014/410014.ab",
        "model/boss/400010/400010.ab",
        "model/collection/290052/290052.ab",
        "model/collection/31020046/31020046.ab",
        "model/collection/32000004/32000004.ab",
        "model/npc",
        "model/ride",
        "model/weapon/10000000_1/10000000_1.ab",
        "model/weapon/10000000_1b/10000000_1b.ab",
        "model/weapon/10000000_2/10000000_2.ab",
        "model/hero/1501/zhua.ab",
        "model/pet/200011/200011.ab",
        "icon",
	"bubbleOne",
	"bubbleTwo",
    };
    public static readonly HashSet<string> searchPaternList = new HashSet<string>
{
        //图片格式
        "png","tga","jpg",
        //二进制格式
        "bytes",
        //声音格式
        "mp3","wav","ogg",
        //视频格式
        "mp4",
        //文档格式
        "json","xml",
        //assetbundle
		"prefab","mat","ttf","fontsettings","shader","anim"
        ,"unity","fbx"
};
    //目录名称为一个Bundle
    public static readonly HashSet<string> bundleTogetherList = new HashSet<string>
    {
        "shader","misc","preload"
    };

    //目录内的子目录都会是一个独立的Bundle
    public static readonly HashSet<string> togetherEachInputList = new HashSet<string>
    {
        "ui/altas","tsbytes"
    };
    //这些目录将不会被打包
    public static readonly List<string> ignoreSearchPaternList = new List<string>
    {
        "scene/",
    };
    //这些目录将不会被打包
    public static readonly List<string> ignoreSearchPaternKeyList = new List<string>
    {
        "unity",
    };
    public static bool WillIgnore(string name)
    {
        if (name.Contains("@"))
        {
            return true;
        }
        if (name.StartsWith("sceneAsset"))
        {
            return true;
        }
        for (int i = 0; i < ignoreSearchPaternList.Count; i++)
        {
            if (name.StartsWith(ignoreSearchPaternList[i]))
            {
                if (name.EndsWith(ignoreSearchPaternKeyList[i]))
                    return false;
                return true;
            }
        }
        return false;
    }
}