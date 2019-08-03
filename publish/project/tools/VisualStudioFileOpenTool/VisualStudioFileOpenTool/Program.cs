//Inspired by http://stackoverflow.com/questions/350323/open-a-file-in-visual-studio-at-a-specific-line-number

using EnvDTE;
using EnvDTE80;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.ComTypes;
using System.Windows.Forms;

namespace VisualStudioFileOpenTool
{
    public class EnvDTEHelper
    {
        public static DTE GetIntegrityServiceInstance(String projname)
        {
            List<string> projectNames = new List<string>();
            IEnumerable<DTE> dtes = GetAllInstances();
            foreach (DTE dte in GetAllInstances())
            {
                projectNames.Clear();
                foreach (Project project in dte.Solution.Projects)
                {
                    projectNames.Add(project.Name);
                }
                if (projectNames.Contains(projname))
                    return dte;
            }
            return null;
        }

        private static IEnumerable<DTE> GetAllInstances()
        {
            IRunningObjectTable rot;
            IEnumMoniker enumMoniker;
            int retVal = GetRunningObjectTable(0, out rot);

            if (retVal == 0)
            {
                rot.EnumRunning(out enumMoniker);

                IntPtr fetched = IntPtr.Zero;
                IMoniker[] moniker = new IMoniker[1];
                object punkObject = null;
                while (enumMoniker.Next(1, moniker, fetched) == 0)
                {
                    IBindCtx bindCtx;
                    CreateBindCtx(0, out bindCtx);
                    string displayName;
                    moniker[0].GetDisplayName(bindCtx, null, out displayName);
                    bool isVisualStudio = displayName.StartsWith("!VisualStudio");
                    if (isVisualStudio)
                    {
                        rot.GetObject(moniker[0], out punkObject);
                        var dte = (DTE)(punkObject);
                        yield return dte;
                    }
                }
            }
        }

        [DllImport("ole32.dll")]
        private static extern void CreateBindCtx(int reserved, out IBindCtx ppbc);

        [DllImport("ole32.dll")]
        private static extern int GetRunningObjectTable(int reserved, out IRunningObjectTable prot);
    }

    class Program
	{
		[STAThread]
		static void Main(string[] args)
		{
			try
			{
				if (args != null && args.Length == 4)
				{
                    String slnpath = args[0];
                    String projname = args[1];
                    String filename = args[2];
                    int fileline;
					int.TryParse(args[3], out fileline);

                    var dte = EnvDTEHelper.GetIntegrityServiceInstance(projname);
                    if (dte == null)
                    {
                        MessageBox.Show("请先打开项目文件：" + slnpath);
                    }
                    else
                    {
                        dte.MainWindow.Activate();
                        EnvDTE.Window w = dte.ItemOperations.OpenFile(filename, EnvDTE.Constants.vsViewKindTextView);
                        ((EnvDTE.TextSelection)dte.ActiveDocument.Selection).GotoLine(fileline, false);
                    }
                }
				else
				{
					MessageBox.Show(GetHelpMessage());
				}
			}
			catch (Exception e)
			{
                Console.Write(e.Message);
            }
		}

        private static void CreateObject(string v1, string v2)
        {
            throw new NotImplementedException();
        }

        public static string GetHelpMessage()
		{
			string s = "Trying to open specified file at spicified line in active Visual Studio \n\n";
			s += "usage: <slnpath> <project name> <file path> <line number> \n\n";
			return s;
		}
    }
}
