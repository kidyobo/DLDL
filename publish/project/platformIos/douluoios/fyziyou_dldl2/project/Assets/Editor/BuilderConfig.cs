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
        "ui/FixedMessageBox.ab","ui/LoadingView.ab","tsbytes",
        "bjsondata:android", // 只在android有效
        "data:ios,windows", // 在ios，windows下有效
        "ui/fading",
        "preload.ab",
        "effect/other",
        "ui/UiManager.ab",
        "ui/system",
	"ui/subitem",	    
        "ui/DownloadMessageBox.ab",
        "net",
        "misc.ab" ,
        "shader.ab",
        "material" ,
        "camera",
        "txtdata",
        "map/data",
        "model/hero/1501/1501.ab",
        "model/hero/2501/2501.ab",
        "scene/CreateCharacter.ab",
	"scene/1000.ab",
	"scene/1010.ab",
	"scene/1060.ab",
	"scene/2000.ab",
	"scene/2100.ab",
	"scene/2300.ab",
	"scene/2600.ab",
	"scene/2703.ab",
        "scene/2900.ab",
	"scene/2901.ab",
	"scene/3000.ab",
	"scene/3005.ab",
        "scene/3402.ab",
        "scene/3701.ab",
	"scene/3702.ab",
	"scene/3703.ab",
	"scene/3704.ab",
	"scene/3800.ab",
	"scene/3900.ab",
	"scene/3901.ab",
	"scene/4000.ab",
	"scene/4100.ab",
	"scene/4400.ab",
	"scene/4600.ab",
	"scene/5001.ab",
        "scene/5400.ab",
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
        "icon/11000261.ab",
        "icon/11000262.ab",
        "icon/11000263.ab",
        "icon/11000264.ab",
        "icon/11000265.ab",
        "icon/11000266.ab",
        "icon/11000267.ab",
        "icon/11000268.ab",
        "icon/11000269.ab",
        "icon/10050058.ab",
        "icon/10010011.ab",
        "icon/10010012.ab",
        "icon/10010310.ab",
        "icon/10010004.ab",
        "icon/10010005.ab",
        "icon/10010312.ab",
        "icon/10010007.ab",
        "icon/10010009.ab",
        "icon/10010010.ab",
        "icon/50005001.ab",
        "icon/50006001.ab",
        "icon/50007001.ab",
        "icon/50008001.ab",
        "icon/10040008.ab",
        "icon/10040009.ab",
        "icon/50001001.ab",
        "icon/50002001.ab",
        "icon/50003001.ab",
        "icon/50004001.ab",
        "icon/10040016.ab",
        "icon/50010001.ab",
        "icon/50010002.ab",
        "icon/50010003.ab",
        "icon/50010006.ab",
        "icon/50010007.ab",
        "effect/skill/71000001.ab",
        "effect/skill/70001003.ab",
        "effect/skill/71000004.ab",
        "effect/skill/71000005.ab",
        "effect/skill/71000010.ab",
        "effect/skill/70001007.ab",
        "effect/skill/70001011.ab",
        "effect/skill/70002020.ab",
        "effect/skill/70002021.ab",
        "effect/skill/70002022.ab",
        "effect/skill/70002024.ab",
        "effect/skill/70002027.ab",
        "ui/altas/specialize/actBtnIcon",
	"car",
	"ui/altasPrefab",
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