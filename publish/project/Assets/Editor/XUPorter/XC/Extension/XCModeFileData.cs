using System.Collections;
namespace UnityEditor.XCodeEditor
{
    public class XCModFileData
    {
        /// <summary>
        /// 所有由该projmods添加的文件和文件夹所属的Xcode中的group名称
        /// </summary>
        public string group
        {
            get
            {
                if (data != null)
                    return data["group"] as string;
                return string.Empty;
            }
            set
            {
                if (data != null)
                    data["group"] = value;
            }
        }
        /// <summary>
        /// 在Xcode Build Phases中需要添加的动态链接库的名称，比如libz.dylib
        /// </summary>
        public ArrayList libs
        {
            get
            {
                if (data != null)
                    return data["libs"] as ArrayList;
                return null;
            }
        }
        /// <summary>
        /// 在Xcode Build Phases中需要添加的框架的名称，比如Security.framework
        /// </summary>
        public ArrayList frameworks
        {
            get
            {
                if (data != null)
                    return data["frameworks"] as ArrayList;
                return null;
            }
        }
        /// <summary>
        /// Xcode中编译设置中的Header Search Paths路径
        /// </summary>
        public ArrayList headerpaths
        {
            get
            {
                if (data != null)
                    return data["headerpaths"] as ArrayList;
                return null;
            }
        }
        /// <summary>
        /// 加入工程的文件名( 比如第三方frameworks)
        /// </summary>
        public ArrayList files
        {
            get
            {
                if (data != null)
                    return data["files"] as ArrayList;
                return null;
            }
        }
        /// <summary>
        /// 加入工程的文件夹，其中所有的文件和文件夹都将被加入工程中
        /// </summary>
        public ArrayList folders
        {
            get
            {
                if (data != null)
                    return data["folders"] as ArrayList;
                return null;
            }
        }
        /// <summary>
        /// 添加到工程linker flag中的链接配置(比如ObjC)
        /// </summary>
        public ArrayList linker_flags
        {
            get
            {
                if (data != null)
                    return data["linker_flags"] as ArrayList;
                return null;
            }
        }
        /// <summary>
        /// 忽略的文件的正则表达式，匹配的文件将不会被加入工程中
        /// </summary>
        public ArrayList excludes
        {
            get
            {
                if (data != null)
                    return data["excludes"] as ArrayList;
                return null;
            }
        }


        private Hashtable data;
        private string path;

        public string ToJson()
        {
            if (data != null)
                return XUPorterJSON.MiniJSON.jsonEncode(data);
            return string.Empty;
        }
        public override string ToString()
        {
            string json = ToJson();
            return string.IsNullOrEmpty(json) ? "Empty" : json;
        }

        public bool Save()
        {
            if (System.IO.Directory.Exists(System.IO.Path.GetDirectoryName(path)))
            {
                if (System.IO.Path.GetExtension(path) == ".projmods")
                {
                    System.IO.File.WriteAllText(path, ToJson(), System.Text.Encoding.UTF8);
                    return true;
                }
                else
                {
                    throw new System.IO.DirectoryNotFoundException(path + " extension is not \"projmods\" ! save fail");
                }
            }
            else
            {
                throw new System.IO.DirectoryNotFoundException(path + " is not found ! save fail");
            }
        }
        public bool Save(string path)
        {
            this.path = path;
            return Save();
        }

        public XCModFileData() { }
        public XCModFileData(Hashtable data)
        {
            this.data = data;
        }
        public XCModFileData(string json)
        {
            this.data = XUPorterJSON.MiniJSON.jsonDecode(json) as Hashtable;
        }
        public static XCModFileData Load(string filePath)
        {
            System.IO.FileInfo file = new System.IO.FileInfo(filePath);
            if (file.Exists)
            {
                var read = file.OpenText();
                string json = read.ReadToEnd();
                read.Close();
                XCModFileData data = new XCModFileData(json);
                data.path = filePath;
                return data;
            }
            return null;
        }
    }
}