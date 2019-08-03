using System.IO;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace Builder
{
    public class FileUtil
    {
        public static string[] GetFiles(string path, string regexPattern, RegexOptions regexOp = RegexOptions.None, SearchOption searchOption = SearchOption.AllDirectories)
        {
            Regex pattr = new Regex(regexPattern, regexOp);
            List<string> rt = new List<string>();
            var files = Directory.GetFiles(path, "*.*", searchOption);
            foreach (var file in files)
            {
                if (pattr.IsMatch(file))
                {
                    rt.Add(file);
                }
            }
            return rt.ToArray();
        }
        public static void CreateDirectory(string path)
        {
            string dir = Path.GetDirectoryName(path);
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
        }
    }
}
