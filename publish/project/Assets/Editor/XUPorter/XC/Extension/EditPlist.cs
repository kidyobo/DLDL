namespace UnityEditor.XCodeEditor
{
    using Edit.Plist;
    public static class EditPlist
    {
        public static void Edit(XCPlist plist)
        {
            IEditPlist edit = System.Activator.CreateInstance(System.Type.GetType("UnityEditor.XCodeEditor.Edit.Plist." + GetPlistName())) as IEditPlist;
            edit.Edit(plist);
        }
        public static string GetPlistName()
        {
            string fileName = "editplist.txt";
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