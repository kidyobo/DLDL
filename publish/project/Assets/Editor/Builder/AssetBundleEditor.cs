using UnityEngine;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using System.Text.RegularExpressions;

namespace Builder
{
    struct FileUnit
    {
        public string name;
        public string originMD5;
        public string fileMD5;
        public int size;
        public void Fill(string str)
        {
            var pair = str.Split('|');
            name = pair[0];
            originMD5 = pair[1];
            fileMD5 = pair[2];
            size = int.Parse(pair[3]);
        }
        public override string ToString()
        {
            return name + "|" + originMD5 + "|" + fileMD5 + "|" + size;
        }
    }
    /// <summary>
    /// 一键打包工具
    /// </summary>
    public class AssetBundleEditor : Editor
    {
        public static bool forceRebuild = false;
        public static readonly string buildDic = "AssetSources";
        public static readonly string resourceRoot = Application.dataPath + "/"+ buildDic;
        public static int rootLength
        {
            get
            {
                return resourceRoot.Length + 1;
            }
        }
        public static readonly string projectRoot = Application.dataPath.Substring(0, Application.dataPath.Length - 6);
        public static readonly string publishName = "publish";

        public static string targetAssetsPathName = "assets";

        public static readonly string assetbundlePattern = ".ab";
        public static readonly string assetbundleMD5FileName = "assetbundleconfiglist.ab";

        [MenuItem("Build/AssetBundle/根据当前平台打包")]
        static void CreateAssetBundle()
        {
            CreateAssetBundleAssets();
        }
        static void FindAllAssets(HashSet<string> bundleTogetherList, HashSet<string> togetherEachInputList, string root, Dictionary<string, string[]> compressedTogetherDictionary, Dictionary<string, string[]> compressedTogetherEachOutputDictionary,
            List<string> compressedAssetBundleFiles, List<string> uncompressedAssetFiles)
        {
            var topDirList = Directory.GetDirectories(root);
            foreach (string path in topDirList)
            {
                var name = path.Substring(resourceRoot.Length + 1).Replace(Path.DirectorySeparatorChar, '/');
                //判断是否要打包在一起
                if (bundleTogetherList.Contains(name))
                {
                    //获取该目录下的所有文件
                    var allFiles = Directory.GetFiles(path, "*.*", SearchOption.AllDirectories);
                    if (allFiles.Length == 0)
                    {
                        continue;
                    }
                    List<string> checkedFiles = new List<string>(256);
                    foreach (string file in allFiles)
                    {
                        var newName = file.Substring(projectRoot.Length).Replace(Path.DirectorySeparatorChar, '/');
                        //过滤打包文件
                        var patern = newName.Substring(newName.LastIndexOf('.') + 1).ToLower();
                        if (BuilderConfig.searchPaternList.Contains(patern))
                        {
                            if (BuilderConfig.WillIgnore(newName))
                            {
                                continue;
                            }
                            checkedFiles.Add(newName);
                        }
                    }
                    if (checkedFiles.Count > 0)
                    {
                        compressedTogetherDictionary[name] = checkedFiles.ToArray();
                    }
                }
                else if (togetherEachInputList.Contains(name))
                {
                    CollectToghterEachList(path, path, compressedTogetherEachOutputDictionary, compressedAssetBundleFiles);
                }
                else
                {
                    if (name.Equals("raw"))
                    {
                        //获取该目录下的所有文件
                        var allFiles = Directory.GetFiles(path, "*.*", SearchOption.AllDirectories);
                        foreach (string file in allFiles)
                        {
                            //过滤打包文件
                            var newName = file.Substring(resourceRoot.Length + 1).Replace(Path.DirectorySeparatorChar, '/');
                            if (BuilderConfig.WillIgnore(newName))
                            {
                                continue;
                            }
                            var patern = newName.Substring(newName.LastIndexOf('.') + 1).ToLower();
                            if (BuilderConfig.searchPaternList.Contains(patern))
                            {
                                uncompressedAssetFiles.Add(newName.ToLower());
                            }
                        }
                    }
                    else
                    {
                        //获取该目录下的所有文件
                        var allFiles = Directory.GetFiles(path, "*.*", SearchOption.TopDirectoryOnly);
                        foreach (string file in allFiles)
                        {
                            //过滤打包文件
                            var newName = file.Substring(resourceRoot.Length + 1).Replace(Path.DirectorySeparatorChar, '/');
                            if (BuilderConfig.WillIgnore(newName))
                            {
                                continue;
                            }
                            var patern = newName.Substring(newName.LastIndexOf('.') + 1).ToLower();
                            if (BuilderConfig.searchPaternList.Contains(patern))
                            {
                                compressedAssetBundleFiles.Add(newName);
                            }
                        }
                        FindAllAssets(bundleTogetherList, togetherEachInputList, path, compressedTogetherDictionary, compressedTogetherEachOutputDictionary, compressedAssetBundleFiles, uncompressedAssetFiles);
                    }
                }
            }
        }
        static void CollectToghterEachList(string stillRoot, string root, Dictionary<string, string[]> compressedTogetherEachOutputDictionary, List<string> compressedAssetBundleFiles)
        {
            var name = root.Substring(resourceRoot.Length + 1).Replace(Path.DirectorySeparatorChar, '/');
            var stillName = stillRoot.Substring(resourceRoot.Length + 1).Replace(Path.DirectorySeparatorChar, '/');
            //获取该目录下的所有文件
            var allFiles = Directory.GetFiles(root, "*.*", SearchOption.TopDirectoryOnly);
            List<string> checkedFiles = new List<string>(256);
            foreach (string file in allFiles)
            {
                var newName = file.Substring(projectRoot.Length).Replace(Path.DirectorySeparatorChar, '/');
                if (BuilderConfig.WillIgnore(newName))
                {
                    continue;
                }
                //过滤打包文件
                var patern = newName.Substring(newName.LastIndexOf('.') + 1).ToLower();
                if (BuilderConfig.searchPaternList.Contains(patern))
                {
                    if (stillName == name)
                    {
                        var abName = file.Substring(resourceRoot.Length + 1).Replace(Path.DirectorySeparatorChar, '/');
                        compressedAssetBundleFiles.Add(abName);
                    }
                    else
                    {
                        checkedFiles.Add(newName);
                    }
                }
            }
            if (checkedFiles.Count > 0)
            {
                compressedTogetherEachOutputDictionary[name] = checkedFiles.ToArray();
            }
            var topDirList = Directory.GetDirectories(root);
            foreach (string path in topDirList)
            {
                CollectToghterEachList(stillRoot, path, compressedTogetherEachOutputDictionary, compressedAssetBundleFiles);
            }
        }
        static void CreateAssetBundleAssets(string uploadResDir = null, BuildPlatform buildPlatform = null,string gameid=null)
        {
            EditorBuildSettings.scenes = new EditorBuildSettingsScene[]
{
                    new EditorBuildSettingsScene("Assets/scenes/showLogo.unity",true),
                    new EditorBuildSettingsScene("Assets/scenes/root.unity",true),
};
            AssetDatabase.Refresh(ImportAssetOptions.ForceUpdate);
            uploadResDir = uploadResDir ?? defaultUploadResDir;
            buildPlatform = buildPlatform ?? BuildPlatform.current;
            EditorUtility.DisplayProgressBar("打包文件收集", "正在根据打包配置收集打包信息", 0);
            /*生成部分容器*/
            Dictionary<string, string[]> compressedTogetherDictionary = new Dictionary<string, string[]>(100);
            Dictionary<string, string[]> compressedTogetherEachOutputDictionary = new Dictionary<string, string[]>(100);
            List<string> compressedAssetBundleFiles = new List<string>(2048);
            List<string> uncompressedAssetFiles = new List<string>(2048);

            //获取顶级目录，根据bundleTogetherList判断是否要单独打包
            FindAllAssets(BuilderConfig.bundleTogetherList, BuilderConfig.togetherEachInputList, resourceRoot, compressedTogetherDictionary, compressedTogetherEachOutputDictionary, compressedAssetBundleFiles, uncompressedAssetFiles);
            EditorUtility.DisplayProgressBar("打包文件收集", "正在根据打包配置收集打包信息", 0.5f);
            var compressedBuilds = CollectBuilds(compressedTogetherDictionary, compressedTogetherEachOutputDictionary, compressedAssetBundleFiles);
            if (compressedBuilds == null)
            {
                Debug.LogWarning("没有任何要打包的文件");
                return;
            }
            //对当前平台进行打包
            string compressedTargetPath = publishName + "/" + targetAssetsPathName + "/" + buildPlatform.name.ToLower();
            if (!string.IsNullOrEmpty(gameid))
            {
                compressedTargetPath = publishName + "/" + gameid + "/" + targetAssetsPathName + "/" + buildPlatform.name.ToLower();
            }
            if (!Directory.Exists(projectRoot + compressedTargetPath))
            {
                Directory.CreateDirectory(projectRoot + compressedTargetPath);
            }
            Dictionary<string, FileUnit> rawDic = new Dictionary<string, FileUnit>(1024);
            if (Directory.Exists(resourceRoot + "/raw"))
            {
                EditorUtility.DisplayProgressBar("打包检查", "正在检查raw资源变化", 0f);
                //第一步确定raw是否存在
                int svnVersion = GetSvnVersion(resourceRoot + "/raw");
                bool needRebuildRawMD5 = false;
                if (File.Exists(compressedTargetPath + "/rawVersion.txt"))
                {
                    var str = int.Parse(File.ReadAllText(compressedTargetPath + "/rawVersion.txt"));
                    if (svnVersion != str)
                    {
                        needRebuildRawMD5 = true;
                    }
                }
                else
                {
                    needRebuildRawMD5 = true;
                }
                if (needRebuildRawMD5)
                {
                    EditorUtility.DisplayProgressBar("打包检查", "正在重新生成raw资源变化", 0.2f);
                    //对所有raw下面文件生成MD5
                    string[] newStrList = new string[uncompressedAssetFiles.Count];
                    for (int i = 0; i < uncompressedAssetFiles.Count; i++)
                    {
                        var str = uncompressedAssetFiles[i];
                        var bytes = File.ReadAllBytes(resourceRoot + "/" + str);
                        var unit = new FileUnit();
                        unit.name = str;
                        unit.fileMD5 = GenerateMd5(bytes);
                        unit.originMD5 = unit.fileMD5;
                        unit.size = bytes.Length;
                        rawDic[str] = unit;
                        newStrList[i] = unit.ToString();
                        var dir = Path.GetDirectoryName(compressedTargetPath + "/" + str);
                        if (!Directory.Exists(dir))
                        {
                            Directory.CreateDirectory(dir);
                        }
                        File.Copy(resourceRoot + "/" + str, compressedTargetPath + "/" + str, true);
                    }
                    File.WriteAllLines(compressedTargetPath + "/rawMD5.txt", newStrList);
                    File.WriteAllText(compressedTargetPath + "/rawVersion.txt", svnVersion.ToString());
                }
                else
                {
                    if (File.Exists(compressedTargetPath + "/rawMD5.txt"))
                    {
                        var strs = File.ReadAllLines(compressedTargetPath + "/rawMD5.txt");
                        foreach (var str in strs)
                        {
                            var unit = new FileUnit();
                            unit.Fill(str);
                            rawDic[unit.name] = unit;
                        }
                    }
                }
            }
            EditorUtility.DisplayProgressBar("打包检查", "正在检查资源变化", 0.5f);
            AssetBundleManifest compressedManifest = BuildPipeline.BuildAssetBundles(compressedTargetPath, compressedBuilds, BuildAssetBundleOptions.ChunkBasedCompression | BuildAssetBundleOptions.DisableWriteTypeTree | (forceRebuild ? BuildAssetBundleOptions.ForceRebuildAssetBundle : 0), buildPlatform.target);
            if (compressedManifest == null)
            {
                Debug.LogError("failed: AB files generate failed");
                return;
            }
            List<string> allABList = new List<string>(compressedManifest.GetAllAssetBundles());
            if (allABList.Count != compressedBuilds.Length)
            {
                Debug.LogError("failed: AB generated count != wanted ab count " + allABList.Count + " " + compressedBuilds.Length);
                var hashA = new HashSet<string>(allABList);
                var hashB = new HashSet<string>();
                foreach (var c in compressedBuilds)
                {
                    if (!hashB.Add(c.assetBundleName.ToLower()))
                    {
                        Debug.LogError("error: 已经存在:" + c.assetBundleName.ToLower());
                    }
                }
                //打印出具体多或者少的
                foreach (var a in hashA)
                {
                    if (!hashB.Contains(a))
                    {
                        Debug.LogError("error: 多余文件:"+a);
                    }
                }
                foreach (var a in hashB)
                {
                    if (!hashA.Contains(a))
                    {
                        Debug.LogError("error: 缺少文件:" + a);
                    }
                }
                return;
            }
            Dictionary<string, string> hashDic = new Dictionary<string, string>(1024);
            Dictionary<string, string[]> depenDic = new Dictionary<string, string[]>(1024);
            Hash128 empty = new Hash128();
            for (int i = 0; i < allABList.Count; i++)
            {
                var name = allABList[i];
                var hashMD5 = compressedManifest.GetAssetBundleHash(name);
                if (hashMD5 == empty)
                {
                    Debug.LogError("failed:存在hash为空的资源，请修改这个资源或者重新打包:" + name);
                    return;
                }
                var md5 = hashMD5.ToString();
                hashDic[name] = md5;
                depenDic[name] = compressedManifest.GetDirectDependencies(name);
            }
           
            EditorUtility.DisplayProgressBar("打包检查", "正在检查资源变化", 1f);
            Dictionary<string, FileUnit> newABDic = new Dictionary<string, FileUnit>(1024);
            //打包完成后，对比本地压缩文件MD5
            {
                Dictionary<string, FileUnit> abUMD5Dic = new Dictionary<string, FileUnit>(1024);
                if (File.Exists(compressedTargetPath + "/abMD5.txt"))
                {
                    var strs = File.ReadAllLines(compressedTargetPath + "/abMD5.txt");
                    foreach (var str in strs)
                    {
                        var unit = new FileUnit();
                        unit.Fill(str);
                        abUMD5Dic[unit.name] = unit;
                    }
                }
                //对不一样的文件进行压缩操作
                //对所有文件生成MD5
                var compressedFiles = allABList;
                int zipCount = 0;
                for (int i = 0; i < compressedFiles.Count; i++)
                {
                    var name = compressedFiles[i];
                    var md5 = hashDic[name];
                    FileUnit oldUnit;
                    abUMD5Dic.TryGetValue(name, out oldUnit);
                    if (md5 != oldUnit.originMD5)
                    {
                        //对该文件进行zip
                        zipCount++;
                        var bytes = CompressFileLZMA(compressedTargetPath + "/" + name, compressedTargetPath + "/" + name + "zip");
                        var newMD5 = GenerateMd5(bytes);
                        oldUnit.name = name;
                        oldUnit.originMD5 = md5;
                        oldUnit.fileMD5 = newMD5;
                        oldUnit.size = bytes.Length;
                    }
                    newABDic[name] = oldUnit;
                }
                //生成配置文件
                string[] newStrList = new string[newABDic.Count];
                int index = 0;
                foreach (var config in newABDic)
                {
                    newStrList[index] = config.Value.ToString();
                    index++;
                }
                if (zipCount > 0)
                {
                    File.WriteAllLines(compressedTargetPath + "/abMD5.txt", newStrList);
                    Debug.Log("因为AB包产生变化一共压缩了" + zipCount + "个文件。");
                }
            }
            string title = "配置文件生成";
            string detail = "正在生成配置文件。。。";
            Dictionary<string, ResInfo> buildFiles = new Dictionary<string, ResInfo>();
            EditorUtility.DisplayProgressBar(title, detail, 0);
            foreach (var config in newABDic)
            {
                var name = config.Key;
                ResInfo resInfo = new ResInfo();
                resInfo.hashCode = config.Value.originMD5;
                resInfo.url = name;
                var dependencies = depenDic[name];
                resInfo.dependencies = dependencies;
                resInfo.size = config.Value.size;
                resInfo.raw = false;
                buildFiles[name] = resInfo;
            }
            EditorUtility.DisplayProgressBar(title, detail, 0.5f);
            foreach (var config in rawDic)
            {
                var name = config.Key;
                ResInfo resInfo = new ResInfo();
                resInfo.hashCode = config.Value.originMD5;
                resInfo.url = name;
                resInfo.dependencies = null;
                resInfo.size = config.Value.size;
                resInfo.raw = true;
                buildFiles[name] = resInfo;
            }
            EditorUtility.DisplayProgressBar(title, detail, 1);
            string[] list = CopyAssetbundles(compressedTargetPath, buildFiles, buildPlatform);

            File.WriteAllLines(projectRoot + publishName + "/buildinAB.txt", list);
            //生成MD5配置文件并压缩
            WriteMD5ConfigFile(buildFiles, compressedTargetPath + "/" + assetbundleMD5FileName);
            EditorUtility.ClearProgressBar();
            System.GC.Collect();
            AssetDatabase.Refresh();
            Debug.Log("打包完毕，共生成了" + buildFiles.Count + "个ab文件");

            //上传资源
            UploadAllAssetBundles(uploadResDir, buildPlatform,gameid);
        }
        static AssetBundleBuild[] CollectBuilds(Dictionary<string, string[]> togetherDictionary, Dictionary<string, string[]> togetherEachOutputDictionary, List<string> assetBundleFiles)
        {
            List<AssetBundleBuild> builds = new List<AssetBundleBuild>();
            //构建打包设置项目
            foreach (KeyValuePair<string, string[]> pair in togetherDictionary)
            {
                AssetBundleBuild build = new AssetBundleBuild();
                var fileName = pair.Key + assetbundlePattern;
                build.assetBundleName = fileName;
                build.assetNames = pair.Value;
                builds.Add(build);
            }
            foreach (KeyValuePair<string, string[]> pair in togetherEachOutputDictionary)
            {
                AssetBundleBuild build = new AssetBundleBuild();
                var fileName = pair.Key + assetbundlePattern;
                build.assetBundleName = fileName;
                build.assetNames = pair.Value;
                builds.Add(build);
            }
            foreach (string file in assetBundleFiles)
            {
                AssetBundleBuild build = new AssetBundleBuild();
                var fileName = file.Substring(0, file.IndexOf('.')) + assetbundlePattern;
                build.assetBundleName = fileName;
                build.assetNames = new string[] { "Assets/"+ buildDic+"/" + file };
                builds.Add(build);
            }
            //实例化r，第二个参数为匹配的要求，这里为忽略大小写
            string pat = @"^[a-zA-Z0-9_\./-]+$";
            Regex r = new Regex(pat, RegexOptions.IgnoreCase);
            //对所有要打包的文件名进行检查
            foreach (AssetBundleBuild build in builds)
            {
                if (!r.IsMatch(build.assetBundleName))
                {
                    Debug.LogError("failed: 文件名不合法  path=" + build.assetBundleName);
                    return null;
                }
            }
            return builds.ToArray();
        }
        static void WriteMD5ConfigFile(Dictionary<string, ResInfo> buildFiles, string path)
        {
            byte[] writeArray = new byte[4024000];
            ByteArray byteArray = new ByteArray(null, writeArray);
            byteArray.useLittleEndian = true;
            byteArray.WriteInt32(AssetCaching.version);
            byteArray.WriteInt32(buildFiles.Count);
            foreach (KeyValuePair<string, ResInfo> pair in buildFiles)
            {
                var info = pair.Value;
                byteArray.WriteString(pair.Key);
                if (info.hashCode == null)
                {
                    Debug.LogWarning("failed:" + pair.Key);
                }
                byteArray.WriteString(info.hashCode.ToString());
                byteArray.WriteInt32(info.size);
                byteArray.WriteByte(info.GetNewTag());
                if (info.dependencies != null && info.dependencies.Length > 0)
                {
                    var length = info.dependencies.Length;
                    if (length > 255)
                    {
                        Debug.LogError("failed:配置表生成失败，资源关联过于严重，请优化代码:" + pair.Key);
                        length = 0;
                        byteArray.WriteByte(0);
                    }
                    else
                    {
                        byteArray.WriteByte((byte)length);
                        for (int i = 0; i < length; i++)
                        {
                            byteArray.WriteString(info.dependencies[i]);
                        }
                    }
                }
                else
                {
                    byteArray.WriteByte(0);
                }
            }
            File.WriteAllBytes(path, byteArray.GetWriteBytes());
            byteArray.Dispose();
        }

        static void CopyAssetbundleInternal(Dictionary<string, ResInfo> buildFiles, string name, List<string> copyList)
        {
            if (buildFiles.ContainsKey(name))
            {
                if (!copyList.Contains(name))
                {
                    var info = buildFiles[name];
                    var dependencies = info.dependencies;
                    if (dependencies != null && dependencies.Length > 0)
                    {
                        var length = dependencies.Length;
                        if (length > 255)
                        {
                            Debug.LogError("failed:配置表生成失败，资源关联过于严重，请优化代码:" + name);
                        }
                        else
                        {
                            for (int i = 0; i < length; i++)
                            {
                                var depenName = dependencies[i];
                                CopyAssetbundleInternal(buildFiles, depenName, copyList);
                            }
                        }
                    }
                    copyList.Add(name);
                }
            }
        }
        /// <summary>
        /// 拷贝资源到包内，并生成配置表
        /// </summary>
        static string[] CopyAssetbundles(string targetPath, Dictionary<string, ResInfo> buildFiles, BuildPlatform buildPlatform)
        {
            var checkList = BuildPlatform.current.name.ToLower() == "windows" ? BuilderConfig.windowsBuildinList : BuilderConfig.mobileBuildinList;
            List <string> copyList = new List<string>();
            //拷贝包内资源,优先处理固定包内资源
            foreach (string fileName in checkList)
            {
                var name = fileName.ToLower();

                // 根据平台类型，过滤对应的包内资源
                // 例如：
                // "bjsondata:android", // 只在android有效
                // "data:ios,windows", // 在ios，windows下有效
                var names = name.Split(':');
                if (names.Length > 1)
                {
                    name = names[0];
                    string targets = names[1];

                    if (!targets.Contains(buildPlatform.name))
                        continue;
                }

                if (name.IndexOf('.') >= 0)
                {
                    CopyAssetbundleInternal(buildFiles, name, copyList);
                }
                else
                {
                    if (Directory.Exists(targetPath + "/" + name))
                    {
                        //拷贝的是文件夹
                        var allFiles = Directory.GetFiles(targetPath + "/" + name, "*.*" , SearchOption.AllDirectories);
                        foreach (var subName in allFiles)
                        {
                            var newName = subName.Substring(targetPath.Length + 1).Replace(Path.DirectorySeparatorChar, '/').ToLower();
                            CopyAssetbundleInternal(buildFiles, newName, copyList);
                        }
                    }
                    else
                    {
                        Debug.LogError("failed:文件夹不存在，请检查打包配置 path:" + name);
                    }
                }
            }
            return copyList.ToArray();
        }

        static void UploadAllAssetBundles(string uploadResDir, BuildPlatform buildPlatform, string gameid)
        {
            Debug.Log("start upload all assetbundles to " + uploadResDir);

            string title = "AssetBundle资源上传";
            string detail = "正在上传资源文件到服务器" + uploadResDir;
            EditorUtility.DisplayProgressBar(title, detail, 0);

            //从服务器获取AB列表和Raw资源列表
            var localABPath = projectRoot + publishName + "/" + targetAssetsPathName + "/" + buildPlatform.name.ToLower() + "/";
            var serverABPath = uploadResDir + targetAssetsPathName + "/" + buildPlatform.name.ToLower() + "/";
            if (!string.IsNullOrEmpty(gameid))
            {
                localABPath = projectRoot + publishName + "/" + gameid+"/"+ targetAssetsPathName + "/" + buildPlatform.name.ToLower() + "/";
                serverABPath = uploadResDir+"/"+ gameid+"/" + targetAssetsPathName + "/" + buildPlatform.name.ToLower() + "/";
            }
            int version = 0;
            if (File.Exists(serverABPath + "version.txt"))
            {
                string text = File.ReadAllText(serverABPath + "version.txt");
                if (!int.TryParse(text, out version))
                {
                    Debug.LogError("failed:version 错误");
                }
            }
            int oldVersion = version;
            Dictionary<string, ResInfo> serverAssetBundleCheckDic = new Dictionary<string, ResInfo>(1024);
            Dictionary<string, ResInfo> localAssetBundleCheckDic = new Dictionary<string, ResInfo>(1024);
            List<string> uploadAssetsList = new List<string>(1024);
            var serverABMD5Path = serverABPath + AssetCaching.AppendHash(assetbundleMD5FileName, version.ToString());
            var localABMD5Path = localABPath + assetbundleMD5FileName;

            bool addVersion = false;
            //获取本地AB列表和资源列表并和服务器列表做对比
            serverAssetBundleCheckDic = LoadConfig(serverABMD5Path, true, true);
            localAssetBundleCheckDic = LoadConfig(localABMD5Path, false, false);
            foreach (var pair in localAssetBundleCheckDic)
            {
                var info = pair.Value;
                ResInfo resInfo;
                bool has = serverAssetBundleCheckDic.TryGetValue(info.url, out resInfo);
                if (has)
                {
                    if (resInfo.hashCode != info.hashCode || resInfo.size != info.size)
                    {
                        uploadAssetsList.Add(info.url);
                    }
                    else if (!ResInfo.IsSame(resInfo, info))
                    {
                        addVersion = true;
                    }
                }
                else
                {
                    uploadAssetsList.Add(info.url);
                }
            }
            EditorUtility.DisplayProgressBar(title, detail, 0.15f);
            var count = uploadAssetsList.Count;
            float currentCount = 0;
            foreach (string name in uploadAssetsList)
            {
                var info = localAssetBundleCheckDic[name];
                var local = localABPath + name;
                if (!info.raw)
                {
                    local += "zip";
                }
                var server = serverABPath + AssetCaching.AppendHash(name, info.hashCode);
                var dir = Path.GetDirectoryName(server);
                if (!Directory.Exists(dir))
                {
                    Directory.CreateDirectory(dir);
                }
                var sinfo = new FileInfo(server);
                if (!sinfo.Exists || sinfo.Length != info.size)
                {
                    int errorCount = 5;
                    while (errorCount > 0)
                    {
                        try
                        {
                            File.Copy(local, server, true);
                            break;
                        }
                        catch (System.Exception e)
                        {
                            errorCount--;
                            Debug.LogWarning("上传资源时发生错误，重试上传操作，剩余次数:" + errorCount + " 错误信息:" + e.Message);
                        }
                    }
                    if (errorCount == 0)
                    {
                        Debug.LogWarning("failed:上传错误次数超过上限，终止上传操作，请检查逻辑。");
                        return;
                    }
                }
                currentCount += 1;
                EditorUtility.DisplayProgressBar(title, detail, 0.15f + (currentCount / count) * 0.85f);
            }
            if (addVersion || currentCount > 0 || serverAssetBundleCheckDic.Count != localAssetBundleCheckDic.Count)
            {
                version = version + 1;
                serverABMD5Path = serverABPath + AssetCaching.AppendHash(assetbundleMD5FileName, version.ToString());

                int errorCount = 5;
                while (errorCount > 0)
                {
                    try
                    {
                        //上传配置文件
                        if (!Directory.Exists(Path.GetDirectoryName(serverABMD5Path)))
                        {
                            Directory.CreateDirectory(Path.GetDirectoryName(serverABMD5Path));
                        }
                        if (File.Exists(localABMD5Path))
                        {
                            CompressFileLZMA(localABMD5Path, serverABMD5Path);
                        }
                        //提取前面的10个版本进行差异比较，生成差异文件
                        GenerateDiff(serverABPath, version, 10, localAssetBundleCheckDic);
                        File.WriteAllText(serverABPath + "version.txt", version.ToString());
                        break;
                    }
                    catch (System.Exception e)
                    {
                        errorCount--;
                        Debug.LogWarning("上传资源配置时发生错误，重试上传操作，剩余次数:" + errorCount + " 错误信息:" + e.Message);
                    }
                }
                if (errorCount == 0)
                {
                    Debug.LogWarning("failed:上传配置文件错误次数超过上限，终止上传操作，请检查逻辑。");
                    return;
                }
            }
            Debug.Log("一共更新了:" + currentCount + "个AssetBundle文件，之前版本号为:" + oldVersion + " 当前版本号为:" + version);
            File.WriteAllLines(localABPath + "lastBuildUploadList.txt", uploadAssetsList.ToArray());
            EditorUtility.ClearProgressBar();
            System.GC.Collect();
        }

        static Dictionary<string, ResInfo> LoadConfig(string path, bool compressed, bool checkVerson)
        {
            Dictionary<string, ResInfo> config = new Dictionary<string, ResInfo>(1024);
            if (File.Exists(path))
            {
                byte[] bytes = null;
                if (compressed)
                {
                    bytes = DecompressFileLZMA(path);
                }
                else
                {
                    bytes = File.ReadAllBytes(path);
                }
                ByteArray byteArray = new ByteArray(bytes, null);
                byteArray.useLittleEndian = true;
                var version = byteArray.ReadInt32();
                if (checkVerson)
                {
                    if (version != AssetCaching.version)
                    {
                        Debug.LogWarning("服务器配置表版本号和本地版本号不一致-- local:" + AssetCaching.version + " server:" + version);
                        return config;
                    }
                }
                var length = byteArray.ReadInt32();
                for (int i = 0; i < length; i++)
                {
                    var info = new ResInfo();
                    info.url = byteArray.ReadString();
                    info.hashCode = byteArray.ReadString();
                    info.size = byteArray.ReadInt32();
                    info.UpdateTag(byteArray.ReadByte());
                    int denCount = byteArray.ReadByte();
                    var denList = new string[denCount];
                    for (int z = 0; z < denCount; z++)
                    {
                        var den = byteArray.ReadString();
                        denList[z] = den;
                    }
                    info.dependencies = denList;
                    config[info.url] = info;
                }
                byteArray.Dispose();
            }
            return config;
        }

        static void GenerateDiff(string serverABPath, int version, int width, Dictionary<string, ResInfo> currentConfig)
        {
            var newVersion = version;
            while (width-- > 0)
            {
                version = version - 1;
                var path = serverABPath + AssetCaching.AppendHash(assetbundleMD5FileName, version.ToString());
                var config = LoadConfig(path, true, true);
                if (config.Count == 0)
                {
                    break;
                }
                List<ResInfo> addList = new List<ResInfo>(100);
                List<ResInfo> modifyList = new List<ResInfo>(200);
                List<ResInfo> deleteList = new List<ResInfo>(50);
                //用最新版本和旧版本交叉对比，分别得出，新加的，修改的，删除的3个列表
                foreach (var newPair in currentConfig)
                {
                    var newInfo = newPair.Value;
                    ResInfo oldInfo = null;
                    if (config.TryGetValue(newPair.Key, out oldInfo))
                    {
                        if (!ResInfo.IsSame(newInfo, oldInfo))
                        {
                            modifyList.Add(newInfo);
                        }
                        config.Remove(newPair.Key);
                    }
                    else
                    {
                        addList.Add(newInfo);
                    }
                }
                foreach (var pair in config)
                {
                    deleteList.Add(pair.Value);
                }
                byte[] writeArray = new byte[4024000];
                ByteArray byteArray = new ByteArray(null, writeArray);
                byteArray.useLittleEndian = true;
                byteArray.WriteInt32(addList.Count);
                for (int i = 0; i < addList.Count; i++)
                {
                    var info = addList[i];
                    byteArray.WriteString(info.url);
                    byteArray.WriteString(info.hashCode);
                    byteArray.WriteInt32(info.size);
                    byteArray.WriteByte(info.GetNewTag());
                    var length = info.dependencies == null ? 0 : info.dependencies.Length;
                    if (length > 255)
                    {
                        length = 0;
                        byteArray.WriteByte(0);
                    }
                    else
                    {
                        byteArray.WriteByte((byte)length);
                        for (int j = 0; j < length; j++)
                        {
                            byteArray.WriteString(info.dependencies[j]);
                        }
                    }
                }
                byteArray.WriteInt32(modifyList.Count);
                for (int i = 0; i < modifyList.Count; i++)
                {
                    var info = modifyList[i];
                    byteArray.WriteString(info.url);
                    byteArray.WriteString(info.hashCode);
                    byteArray.WriteInt32(info.size);
                    byteArray.WriteByte(info.GetNewTag());
                    var length = info.dependencies == null ? 0 : info.dependencies.Length;
                    if (length > 255)
                    {
                        length = 0;
                        byteArray.WriteByte(0);
                    }
                    else
                    {
                        byteArray.WriteByte((byte)length);
                        for (int j = 0; j < length; j++)
                        {
                            byteArray.WriteString(info.dependencies[j]);
                        }
                    }
                }
                byteArray.WriteInt32(deleteList.Count);
                for (int i = 0; i < deleteList.Count; i++)
                {
                    var info = deleteList[i];
                    byteArray.WriteString(info.url);
                }
                var file = serverABPath + "vupdates/" + newVersion + "/" + version + ".ab";
                CompressBytesLZMA(byteArray.GetWriteBytes(), file);
                byteArray.Dispose();
            }
        }

        static string defaultUploadResDir
        {
            get
            {
                if (Platform.isEditorOsx)
                    return "/Users/felix/Library/Tomcat/webapps/mgameres/develop/";
                else
                    return @"\\192.168.8.48\mgameres\developtest\";
            }
        }

        [MenuItem("Build/AssetBundle/清理项目文件打包标记")]
        static void ClearAllBundleInfo()
        {
            string[] files = Directory.GetFiles(Application.dataPath, "*.*", SearchOption.AllDirectories);
            //清理
            foreach (string file in files)
            {
                AssetImporter importer = AssetImporter.GetAtPath(file.Substring(projectRoot.Length));
                if (importer != null)
                {
                    if (importer.assetBundleName != "")
                    {
                        importer.assetBundleName = "";
                        importer.SaveAndReimport();
                    }
                }
            }
            string[] dics = Directory.GetDirectories(Application.dataPath, "*.*", SearchOption.AllDirectories);
            //清理
            foreach (string dic in dics)
            {
                AssetImporter importer = AssetImporter.GetAtPath(dic.Substring(projectRoot.Length));
                if (importer != null)
                {
                    if (importer.assetBundleName != "")
                    {
                        importer.assetBundleName = "";
                        importer.SaveAndReimport();
                    }
                }
            }
            AssetDatabase.RemoveUnusedAssetBundleNames();
        }
        [MenuItem("Build/AssetBundle/删除用户数据")]
        static void ClearData()
        {
            PlayerPrefs.DeleteAll();
            Caching.CleanCache();
            AssetCaching.CleanCache();
            Resources.UnloadUnusedAssets();
            System.GC.Collect();
        }
        [MenuItem("Build/一键打包", false, 1)]
        static void GenerateAll()
        {
            BuildTsScript.Build();
            CreateAssetBundle();
            CopyAllBuildinAssets();
        }

        public static void GenerateAllAndUpload(string uploadResDir, BuildPlatform buildPlatform,string gameid)
        {
            BuildTsScript.Build();
            CreateAssetBundleAssets(uploadResDir, buildPlatform, gameid);
            //CopyAllBuildinAssets(uploadResDir, buildPlatform);
        }
        static SevenZip.CoderPropID[] ids = new SevenZip.CoderPropID[] {
            SevenZip.CoderPropID.DictionarySize,
            };
        static object[] values = new object[] {
            1<<12,
            };
        private static byte[] CompressFileLZMA(string inFile, string outFile)
        {
            SevenZip.Compression.LZMA.Encoder coder = new SevenZip.Compression.LZMA.Encoder();
            FileStream input = new FileStream(inFile, FileMode.Open);
            MemoryStream output = new MemoryStream((int)input.Length);
            // Write the encoder properties

            coder.SetCoderProperties(ids, values);
            coder.WriteCoderProperties(output);
            ByteArray byteArray = new ByteArray(input, output);
            long len = 0;
            try
            {
                byteArray.WriteInt64(input.Length);
                // Encode the file.
                coder.Code(input, output, input.Length, -1, null);
                len = output.Position;
                byteArray.Dispose();
            }
            catch (System.Exception e)
            {
                byteArray.Dispose();
                throw e;
            }
            var bytes = output.ToArray();
            var dir = Path.GetDirectoryName(outFile);
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            File.WriteAllBytes(outFile, bytes);
            return bytes;
        }
        private static void CompressBytesLZMA(byte[] inFile, string outFile)
        {
            SevenZip.Compression.LZMA.Encoder coder = new SevenZip.Compression.LZMA.Encoder();
            MemoryStream input = new MemoryStream(inFile);
            MemoryStream output = new MemoryStream((int)input.Length);
            // Write the encoder properties
            coder.SetCoderProperties(ids, values);
            coder.WriteCoderProperties(output);
            ByteArray byteArray = new ByteArray(input, output);
            long len = 0;
            try
            {
                byteArray.WriteInt64(input.Length);
                // Encode the file.
                coder.Code(input, output, input.Length, -1, null);
                len = output.Position;
                byteArray.Dispose();
            }
            catch (System.Exception e)
            {
                byteArray.Dispose();
                throw e;
            }
            var bytes = output.ToArray();
            var dir = Path.GetDirectoryName(outFile);
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            File.WriteAllBytes(outFile, bytes);
        }

        [MenuItem("Build/拷贝包内资源")]
        static void CopyAllBuildinAssetsUI()
        {
            CopyAllBuildinAssets();
        }
        public static void CopyAllBuildinAssets(string uploadResDir = null, BuildPlatform buildPlatform = null,string gameid=null)
        {
            string title = "包内文件拷贝";
            string detail = "正在拷贝包内资源。。。";
            EditorUtility.DisplayProgressBar(title, detail, 0);
            uploadResDir = uploadResDir ?? defaultUploadResDir;
            buildPlatform = buildPlatform ?? BuildPlatform.current;
            var serverABPath = uploadResDir + targetAssetsPathName + "/" + buildPlatform.name.ToLower() + "/";

            List<string> buildinAB = new List<string>();
            var abPath = projectRoot + publishName + "/" + targetAssetsPathName + "/" + buildPlatform.name.ToLower() + "/";

            if (!string.IsNullOrEmpty(gameid))
            {
                serverABPath = uploadResDir + gameid + "/" + targetAssetsPathName + "/" + buildPlatform.name.ToLower() + "/";
                abPath= projectRoot + publishName+"/"+ gameid + "/" + targetAssetsPathName + "/" + buildPlatform.name.ToLower() + "/";
            }
            var localABMD5Path = abPath + assetbundleMD5FileName;

            if (!File.Exists(serverABPath + "version.txt") ||
                !File.Exists(localABMD5Path))
            {
                Debug.LogError("failed:生成包内资源失败，服务器没有版本信息 serverPath:" + serverABPath);
                return;
            }
            buildinAB.Add(assetbundleMD5FileName);
            Dictionary<string, ResInfo> localABCheckDic = new Dictionary<string, ResInfo>(1024);
            localABCheckDic = LoadConfig(localABMD5Path, false, false);
            localABCheckDic[assetbundleMD5FileName] = new ResInfo(assetbundleMD5FileName, File.ReadAllText(serverABPath + "version.txt").Trim(), 0, null, 0, 2);
            if (File.Exists(projectRoot + publishName + "/buildinAB.txt"))
            {
                var lines = File.ReadAllLines(projectRoot + publishName + "/buildinAB.txt");
                foreach (var line in lines)
                {
                    if (line.Trim() == null)
                    {
                        Debug.Log("empty");
                        continue;
                    }
                    buildinAB.Add(line);
                }
            }
            EditorUtility.DisplayProgressBar(title, detail, 0.1f);

            var path = projectRoot + "Assets/StreamingAssets/";

            //清除已经删除的文件&对所有文件生成MD5

            Dictionary<string, bool> copyFiles = new Dictionary<string, bool>();
            foreach (var name in buildinAB)
            {
                copyFiles[name] = true;
            }

            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
            }
            Directory.CreateDirectory(path);
            if (copyFiles.Count > 0)
            {
                int count = 0;
                foreach (KeyValuePair<string, bool> pair in copyFiles)
                {
                    if (pair.Key == assetbundleMD5FileName)
                    {
                        CompressFileLZMA(abPath + pair.Key, path + pair.Key);
                    }
                    else
                    {
                        var name = path + pair.Key;
                        if (AssetCaching.buildinKey != null)
                        {
                            name = path + WWWCaching.GetNewFileName(pair.Key);
                        }
                        var dir = Path.GetDirectoryName(name);
                        if (!Directory.Exists(dir))
                        {
                            Directory.CreateDirectory(dir);
                        }
                        try
                        {
                            if (AssetCaching.buildinKey == null)
                            {
                                File.Copy(abPath + pair.Key, name, true);
                            }
                            else
                            {
                                Debug.Log("拷贝包内资源时赋值了一个key:" + AssetCaching.buildinKey);
                                var readBytes = File.ReadAllBytes(abPath + pair.Key);
                                //需要修改readBytes
                                EncryptAB.encrypt(readBytes, AssetCaching.buildinKey);
                                File.WriteAllBytes(name, readBytes);
                            }
                        }
                        catch (System.Exception e)
                        {
                            Debug.LogError("failed:" + e.Message);
                            return;
                        }
                    }
                    count++;
                    EditorUtility.DisplayProgressBar(title, detail, 0.15f + count / (float)copyFiles.Count);
                }
                var bytes = new byte[2000000];
                ByteArray byteArray = new ByteArray(null, bytes);
                byteArray.useLittleEndian = true;
                byteArray.WriteInt32(buildinAB.Count);
                for (int i = 0; i < buildinAB.Count; i++)
                {
                    byteArray.WriteString(buildinAB[i]);
                    byteArray.WriteString(localABCheckDic[buildinAB[i]].hashCode);
                }
                File.WriteAllBytes(path + "/buildin.bytes", byteArray.GetWriteBytes());
                byteArray.Dispose();

                AssetDatabase.Refresh();
                System.GC.Collect();
                Debug.Log("包内资源更新，一共有" + copyFiles.Count + "个包内资源");
            }
            else
            {
                AssetDatabase.Refresh();
            }
            EditorUtility.ClearProgressBar();
        }
        static int GetSvnVersion(string path)
        {
            string versionText = RunCommand("svn", "log " + path + " -l 1");
            if (versionText == null)
            {
                return 0;
            }
            var str = "0";
            int start = 0;
            for (int i = 0; i < versionText.Length; i++)
            {
                if (IsNumeric(versionText.Substring(i, 1)))
                {
                    if (start == 0)
                    {
                        start = i;
                    }
                }
                else
                {
                    if (start > 0)
                    {
                        str = versionText.Substring(start, i - start);
                        break;
                    }
                }
            }
            return int.Parse(str);
        }
        public static bool IsNumeric(string value)
        {
            int i;
            return int.TryParse(value, out i);
        }
        static string RunCommand(string command, string argument)
        {
            System.Diagnostics.ProcessStartInfo start = new System.Diagnostics.ProcessStartInfo(command);
            start.Arguments = argument;
            start.CreateNoWindow = false;
            start.ErrorDialog = true;
            start.UseShellExecute = false;

            if (start.UseShellExecute)
            {
                start.RedirectStandardOutput = false;
                start.RedirectStandardError = false;
                start.RedirectStandardInput = false;
            }
            else
            {
                start.RedirectStandardOutput = true;
                start.RedirectStandardError = true;
                start.RedirectStandardInput = true;
                start.StandardOutputEncoding = System.Text.UTF8Encoding.UTF8;
                start.StandardErrorEncoding = System.Text.UTF8Encoding.UTF8;
            }

            System.Diagnostics.Process p = System.Diagnostics.Process.Start(start);

            string text = null;
            string error = null;
            if (!start.UseShellExecute)
            {
                text = p.StandardOutput.ReadToEnd();
                error = p.StandardError.ReadToEnd();
            }
            p.WaitForExit();
            p.Close();
            if (!string.IsNullOrEmpty(error))
            {
                Debug.LogError("error:" + error);
                return null;
            }
            return text;
        }
        public static string GenerateMd5(string path)
        {
            string md5String = null;
            try
            {
                using (var fileStream = File.OpenRead(path))
                {
                    var md5 = System.Security.Cryptography.MD5.Create();
                    var fileMD5Bytes = md5.ComputeHash(fileStream);//计算指定Stream 对象的哈希值                                      
                    md5String = System.BitConverter.ToString(fileMD5Bytes).Replace("-", "").ToLower();
                }
            }
            catch (System.Exception ex)
            {
                Debug.LogError(ex);
            }
            return md5String;
        }
        public static string GenerateMd5(byte[] bytes)
        {
            string md5String = null;
            try
            {
                var md5 = System.Security.Cryptography.MD5.Create();
                var fileMD5Bytes = md5.ComputeHash(bytes);//计算指定Stream 对象的哈希值                                      
                md5String = System.BitConverter.ToString(fileMD5Bytes).Replace("-", "").ToLower();
            }
            catch (System.Exception ex)
            {
                Debug.LogError(ex);
            }
            return md5String;
        }
        private static byte[] DecompressFileLZMA(string inFile)
        {
            SevenZip.Compression.LZMA.Decoder coder = new SevenZip.Compression.LZMA.Decoder();
            FileStream input = new FileStream(inFile, FileMode.Open);
            ByteArray byteArray = new ByteArray(input, null);
            // Read the decoder properties
            byte[] properties = byteArray.ReadBytes(5);

            // Read in the decompress file size.
            long fileLength = byteArray.ReadInt64();

            byte[] outBytes = new byte[fileLength];
            MemoryStream output = new MemoryStream(outBytes);

            // Decompress the file.
            coder.SetDecoderProperties(properties);
            coder.Code(input, output, input.Length, fileLength, null);
            output.Close();
            byteArray.Dispose();
            return outBytes;
        }
    }
}