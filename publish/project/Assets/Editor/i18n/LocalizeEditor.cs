using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEngine;

class LocalConfig
{
    public static string languagemidPath = Application.dataPath + @"/../tools/i18n/dictionary/tw/languages_mid.txt"; // 本地化中间文件
    public static string langXlsPath = Application.dataPath + @"/../tools/i18n/dictionary/tw/language.xlsx"; // 提供给翻译的表格
    public static string langNewPath = Application.dataPath + @"/../tools/i18n/dictionary/tw/languages_new.txt"; // 转表工具提取的中文字符串
    public static string prefabPath = Application.dataPath + @"/AssetSources/ui";

    public static string jsonPath = Application.dataPath + @"/AssetSources/data";
}

class LocalNode
{
    public string key;
    public string cn;
    public string local;
}
class LanguageCfg
{
    private const string ID_TAG = "ID=";
    private const string CN_TAG = "CN=";
    private const string LOCAL_TAG = "LOCAL=";

    private Dictionary<string, LocalNode> nodes = new Dictionary<string, LocalNode>();
    private string path;
    public LanguageCfg(string path)
    {
        this.path = path;
        string[] lines = File.ReadAllLines(path);
        string key = "";
        LocalNode node = null;
        foreach (string line in lines)
        {
            if (line.StartsWith(ID_TAG))
            {
                node = new LocalNode();
                key = line.Substring(ID_TAG.Length, 32);
                node.key = key;
            }
            else if (line.StartsWith(CN_TAG))
            {
                node.cn = line.Substring(CN_TAG.Length);
            }
            else if (line.StartsWith(LOCAL_TAG))
            {
                node.local = line.Substring(LOCAL_TAG.Length);
                nodes[key] = node;
            }
        }
    }

    public void InsertString(string cn)
    {
        cn = formatString(cn);
        string key = GetStringMd5(cn);
        LocalNode node;
        if (nodes.TryGetValue(key, out node)) return;
        node = new LocalNode();
        node.key = key;
        node.cn = cn;
        node.local = "";
        nodes[key] = node;
    }

    public string getLocal(string cn)
    {
        string key = GetStringMd5(formatString(cn));
        LocalNode node;
        if (!nodes.TryGetValue(key, out node) || node.local == "")
        {
            Debug.LogWarning("not find Local:" + cn);
            return cn;
        }
        return node.local;
    }

    public void Save()
    {
        StringBuilder s = new StringBuilder();
        foreach (var p in nodes)
        {
            s.AppendFormat("{0}{1}\n", ID_TAG, p.Key);
            s.AppendFormat("{0}{1}\n", CN_TAG, p.Value.cn);
            s.AppendFormat("{0}{1}\n", LOCAL_TAG, p.Value.local);
            s.Append("\n");
        }
        File.WriteAllText(this.path, s.ToString(), Encoding.UTF8);
    }

    public void MergeFromXls()
    {
        if (!File.Exists(LocalConfig.langXlsPath)) return;

        var fs = new FileStream(LocalConfig.langXlsPath, FileMode.Open, FileAccess.Read, FileShare.Read);
        var excelReader = Excel.ExcelReaderFactory.CreateOpenXmlReader(fs);
        var rows = excelReader.AsDataSet().Tables[0].Rows;
        for (int i = 1; i < rows.Count; ++i)
        {
            var row = rows[i];
            if (row == null) break;

            string key = row[0].ToString();
            string cn = row[1].ToString();
            string local = row[2].ToString();
            if (key == null || key == "") break;

            LocalNode lnode = null;
            if (!nodes.TryGetValue(key, out lnode))
            {
                Debug.LogWarning("为发现：" + key + ":" + cn);
                continue;
            }
            if (key != GetStringMd5(cn))
            {
                lnode.local = "";
                Debug.LogWarning("被修改了：" + key + ":" + cn);
            }
            else
            {
                lnode.local = local;
            }            
        }
        fs.Close();
    }

    public void SaveXls()
    {
        FileInfo newFile = new FileInfo(LocalConfig.langXlsPath);
        if (newFile.Exists)
        {
            newFile.Delete();
            newFile = new FileInfo(LocalConfig.langXlsPath);
        }

        using (var package = new OfficeOpenXml.ExcelPackage(newFile))
        {
            var worksheet = package.Workbook.Worksheets.Add("Sheet1");
            worksheet.Cells[1, 1].Value = "ID";
            worksheet.Cells[1, 2].Value = "CN";
            worksheet.Cells[1, 3].Value = "LOCAL";

            var row = 2;
            var listnodes = sortNode();
            foreach (var node in listnodes)
            {
                worksheet.Cells[row, 1].Value = node.key;
                worksheet.Cells[row, 2].Value = node.cn;
                worksheet.Cells[row, 3].Value = node.local;
                row++;
            }

            worksheet.Column(1).Width = 20;
            worksheet.Column(2).Width = 110;
            worksheet.Column(3).Width = 110;
            package.Save();
        }
    }

    private List<LocalNode> sortNode()
    {
        var list = new List<LocalNode>();
        //将未翻译的放在开始
        foreach (var p in nodes) 
            if (p.Value.local == "")
                list.Add(p.Value);
        foreach (var p in nodes)
            if (p.Value.local != "")
                list.Add(p.Value);
        return list;
    }

    private static string formatString(string s)
    {
        return s.Replace("\r\n", "\n").Replace("\r", "\n").Replace("\n", "\\n");
    }

    private static string GetStringMd5(string str)
    {
        var md5 = System.Security.Cryptography.MD5.Create();
        var fileMD5Bytes = md5.ComputeHash(System.Text.UTF8Encoding.UTF8.GetBytes(str));
        return System.BitConverter.ToString(fileMD5Bytes).Replace("-", "").ToLower();
    }
}

class LocalizeEditor
{
    [MenuItem("FFTools/本地化/本地化替换")]
    public static void Localize()
    {
        LanguageCfg cfg = new LanguageCfg(LocalConfig.languagemidPath);
        new LocalizePrefabs().Localize(cfg, LocalConfig.prefabPath);
        new LocalizeJsons().Localize(cfg, LocalConfig.jsonPath);
        LocalizeCode();
        Debug.Log("complete!");
    }

    [MenuItem("FFTools/本地化/输出需要翻译的文件")]
    static void OutputLangXLS()
    {
        // get need localize from prefab
        LanguageCfg cfg = new LanguageCfg(LocalConfig.languagemidPath);
        new LocalizePrefabs().SearchCN(cfg, LocalConfig.prefabPath);
        new LocalizeJsons().SearchCN(cfg, LocalConfig.jsonPath);
        cfg.Save();

        // get need localize from code, call perl
        SearchCNFromCode();
        new LocalizeMergeNews().Merge(cfg, LocalConfig.langNewPath);

        // merge, save mid_txt, save xml
        cfg.MergeFromXls();
        cfg.Save();
        cfg.SaveXls();

        Debug.Log("complete!");
    }

    private static void SearchCNFromCode()
    {
        RunPerlScript("1_searchzhcn.pl");
    }

    private static void LocalizeCode()
    {
        RunPerlScript("2_replacezhcn.pl");
    }

    private static void RunPerlScript(string perlScriptName)
    {
        string perlscript = Path.Combine(Application.dataPath, "../tools/i18n/scripts/" + perlScriptName);
        string projdir = Path.Combine(Application.dataPath, "..");
        string launchercfg = Path.Combine(Application.dataPath, "../tools/i18n/config/tw.ini");
        string args = perlscript + " " + projdir + " " + launchercfg;
        string curdir = Directory.GetCurrentDirectory();
        Directory.SetCurrentDirectory(Path.Combine(Application.dataPath, "../tools/i18n/"));
        Debug.Log("RunPerlScript:" + args + ", curpath:" + Directory.GetCurrentDirectory());
        syscall("perl", args);
        Directory.SetCurrentDirectory(curdir);
    }

    private static void syscall(string cmdtool, string args)
    {
        var p = new System.Diagnostics.Process();
        p.StartInfo.FileName = cmdtool;
        p.StartInfo.Arguments = args;
        p.Start();
        p.WaitForExit();
        p.Close();
    }
}

class Localize
{
    protected static Regex hzPatt = new Regex(@"[\u4e00-\u9fa5]+");
}

class LocalizePrefabs : Localize
{
    public void SearchCN(LanguageCfg languageCfg, string prefabPath)
    {
        var files = Directory.GetFiles(prefabPath, "*.prefab", SearchOption.AllDirectories);
        foreach (string f in files)
        {
            string sf = f.Substring(f.IndexOf("Assets"));
            GameObject prefab = AssetDatabase.LoadAssetAtPath(sf, typeof(GameObject)) as GameObject;
            UnityEngine.UI.Text[] labels = prefab.GetComponentsInChildren<UnityEngine.UI.Text>(true);
            foreach (var label in labels)
            {
                if (!hzPatt.IsMatch(label.text)) continue;
                languageCfg.InsertString(label.text);
            }
        }
    }

    public void Localize(LanguageCfg languageCfg, string prefabPath)
    {
        var files = Directory.GetFiles(prefabPath, "*.prefab", SearchOption.AllDirectories);
        foreach (string f in files)
        {
            string sf = f.Substring(f.IndexOf("Assets"));
            GameObject prefab = AssetDatabase.LoadAssetAtPath(sf, typeof(GameObject)) as GameObject;
            UnityEngine.UI.Text[] labels = prefab.GetComponentsInChildren<UnityEngine.UI.Text>(true);
            bool dirty = false;
            foreach (var label in labels)
            {
                if (!hzPatt.IsMatch(label.text)) continue;
                languageCfg.InsertString(label.text);
                label.text = languageCfg.getLocal(label.text).Replace("\\n", "\n");
                dirty = true;
            }
            if (dirty)
            {
                EditorUtility.SetDirty(prefab);
            }
        }
        AssetDatabase.SaveAssets();
    }
}

class LocalizeMergeNews : Localize
{
    public void Merge(LanguageCfg languageCfg, string newHZPath)
    {
        string all = File.ReadAllText(newHZPath, Encoding.UTF8);
        string[] ss = all.Split('\n');
        var trimchars = new char[] { '\r', '\n', ' ' };
        foreach (string s in ss)
        {
            string ns = s.Trim(trimchars);
            if (ns == "") continue;
            languageCfg.InsertString(ns);
        }
    }
}

class LocalizeJsons : Localize
{
    static Regex mPatt = new Regex(@"""(\\\\|\\""|[^""])*""", RegexOptions.Singleline); // 双引号块
    public void SearchCN(LanguageCfg languageCfg, string jsonPath)
    {
        var files = Directory.GetFiles(jsonPath, "*.json", SearchOption.AllDirectories);
        foreach (string f in files)
        {
            string s = File.ReadAllText(f, Encoding.UTF8);
            MatchCollection mc = mPatt.Matches(s);
            foreach (Match m in mc)
            {
                var mg = m.Groups[0];
                string ms = mg.Value;
                if (!hzPatt.IsMatch(ms)) continue;
                string ss = ms.Substring(1, ms.Length - 2);
                languageCfg.InsertString(ss);
             }
        }
    }

    public void Localize(LanguageCfg languageCfg, string jsonPath)
    {
        var files = Directory.GetFiles(jsonPath, "*.json", SearchOption.AllDirectories);
        foreach (string f in files)
        {
            string s = File.ReadAllText(f, Encoding.UTF8);
            string ns = Replace(s.Replace("\r\n", "\n"), languageCfg).Replace("\n", "\r\n");
            if (s == ns) continue;
            File.WriteAllText(f, ns, Encoding.UTF8);
        }
    }

    private string Replace(string s, LanguageCfg languageCfg)
    {
        s = mPatt.Replace(s, new MatchEvaluator((Match m) =>
        {
            var mg = m.Groups[0];
            string ms = mg.Value;
            if (!hzPatt.IsMatch(ms)) return ms;
            string ss = ms.Substring(1, ms.Length - 2);
            return "\"" + languageCfg.getLocal(ss) + "\"";
        }));
        return s;
    }
}

//public static string languagePath = Application.dataPath + @"\AssetSources\languages.txt"; // 程序要的本地化文件（考虑按id拆分成多个文件）
//public static string csCodePath = Application.dataPath + @"\Scripts";
//public static string csCodeExt = "*.cs";
//public static string tsCodePath = Application.dataPath + @"\..\TsScripts";
//public static string tsCodeExt = "*.ts";
//class LocalizeCodes : Localize
//{
//    static Regex mPatt = new Regex(@"""(\\\\|\\""|[^""])*""|'(\\\\|\\'|[^'])*'|//[^\n]*|/\*.*?(?=\*/)\*/", RegexOptions.Singleline); // 双引号块 | 单引号块 | 单行注释 | 注释块
//    static Regex ingorePatt = new Regex(@"Debug.(Log|LogWarning|LogError)\s*\(\s*$|(Log|uts).(log|logWarning|logError|logs|assert|logSuccess|logFailure|assert)\s*\(\s*$"); // 忽略 log , assert

//    public void Localize(string languagePath, string codePath, string codeExt)
//    {
//        var languageCfg = new LanguageCfg(languagePath);
//        var files = Directory.GetFiles(codePath, codeExt, SearchOption.AllDirectories);
//        foreach (string f in files)
//        {
//            if (f.EndsWith("KeyWord.ts")) continue;
//            string s = File.ReadAllText(f, Encoding.UTF8);
//            string ns = Replace(s.Replace("\r\n", "\n"), languageCfg).Replace("\n", "\r\n");
//            if (s == ns) continue;
//            File.WriteAllText(f, ns, Encoding.UTF8);
//        }
//        languageCfg.Save();
//    }

//    private string Replace(string s, LanguageCfg languageCfg)
//    {
//        s = mPatt.Replace(s, new MatchEvaluator((Match m) =>
//        {
//            var mg = m.Groups[0];
//            string ms = mg.Value;
//            if (ms[0] == '/')
//                return ms;
//            int prefixStart = Math.Max(mg.Index - 128, 0);
//            string prefix = s.Substring(prefixStart, mg.Index - prefixStart);
//            if (hzPatt.IsMatch(ms) && !ingorePatt.IsMatch(prefix))
//            {
//                string ss = ms.Substring(1, ms.Length - 2);
//                ms = "Game.Locals.ins.GetStr(" + languageCfg.GetId(ss) + "/*" + ss + "*/)";
//            }
//            return ms;
//        }));
//        return s;
//    }
//}
