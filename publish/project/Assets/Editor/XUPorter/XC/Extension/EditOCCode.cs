
namespace UnityEditor.XCodeEditor
{
    using Edit.OC;
    public static class EditOCCode
    {
        public static void Edit(XClass UnityAppController)
        {
            IEditOCCode edit = System.Activator.CreateInstance(System.Type.GetType("UnityEditor.XCodeEditor.Edit.OC." + GetOCName())) as IEditOCCode;
            edit.Edit(UnityAppController);
        }
        public static string GetOCName()
        {
            string fileName = "editoc.txt";
            string[] path = System.IO.Directory.GetFiles(UnityEngine.Application.dataPath, fileName, System.IO.SearchOption.AllDirectories);
            if (path.Length != 0)
            {
                var file = new System.IO.FileInfo(path[0]);
                var read = file.OpenText();
                string r = read.ReadToEnd();
                read.Close();
                return r;
            }
            return string.Empty;
        }
    }
}