using System;
using System.Diagnostics;
using System.Globalization;
using System.Runtime.InteropServices;
using System.ComponentModel.Design;
using Microsoft.Win32;
using Microsoft.VisualStudio;
using Microsoft.VisualStudio.Shell.Interop;
using Microsoft.VisualStudio.OLE.Interop;
using Microsoft.VisualStudio.Shell;
using EnvDTE;
using EnvDTE80;
using System.Windows.Forms;
using System.Resources;
using System.Reflection;
using Microsoft.VisualStudio.CommandBars;

namespace Stripem
{
	/// <summary>
	/// This is the class that implements the package exposed by this assembly.
	///
	/// The minimum requirement for a class to be considered a valid package for Visual Studio
	/// is to implement the IVsPackage interface and register itself with the shell.
	/// This package uses the helper classes defined inside the Managed Package Framework (MPF)
	/// to do it: it derives from the Package class that provides the implementation of the 
	/// IVsPackage interface and uses the registration attributes defined in the framework to 
	/// register itself and its components with the shell.
	/// </summary>
	// This attribute tells the PkgDef creation utility (CreatePkgDef.exe) that this class is
	// a package.
	[PackageRegistration(UseManagedResourcesOnly = true)]
	// This attribute is used to register the information needed to show this package
	// in the Help/About dialog of Visual Studio.
	[InstalledProductRegistration("#110", "#112", "1.0", IconResourceID = 400)]
	// This attribute is needed to let the shell know that this package exposes some menus.
	[ProvideMenuResource("Menus.ctmenu", 1)]
	[Guid(GuidList.guidStripemPkgString)]
  // Auto load this package for UICONTEXT_NoSolution; this loads it at startup.
  [ProvideAutoLoad("ADFC4E64-0397-11D1-9F4E-00A0C911004F")]
	public sealed partial class StripemPackage : Package
	{
		#region StripemPackage Fields

		private StripemOptions.EolStyle _style = StripemOptions.EolStyle.Uinitialized;
		private bool _enableFilenameFilter = false;
		private string _filenameFilter = ".*\\.(txt|cpp|c|h|hpp|msg|idl)$";

		private DTE2 _applicationObject;

		#endregion StripemPackage Fields

		/// <summary>
		/// Default constructor of the package.
		/// Inside this method you can place any initialization code that does not require 
		/// any Visual Studio service because at this point the package object is created but 
		/// not sited yet inside Visual Studio environment. The place to do all the other 
		/// initialization is the Initialize method.
		/// </summary>
		public StripemPackage()
		{
			Debug.WriteLine(string.Format(CultureInfo.CurrentCulture, "Entering constructor for: {0}", this.ToString()));
		}

		/////////////////////////////////////////////////////////////////////////////
		// Overridden Package Implementation
		#region Package Members

		/// <summary>
		/// Initialization of the package; this method is called right after the package is sited, so this is the place
		/// where you can put all the initialization code that rely on services provided by VisualStudio.
		/// </summary>
		protected override void Initialize()
		{
			Debug.WriteLine(string.Format(CultureInfo.CurrentCulture, "Entering Initialize() of: {0}", this.ToString()));
			base.Initialize();

			_applicationObject = (DTE2)GetService(typeof(DTE));

			//Register the handler for our command.
			RegisterCommandHandlers();

			//Load our settings from the registry.
			LoadSettings();

			// Begin catching document events
			TrackDocumentEvents();
		}
		#endregion

		/// <summary>
		/// This function is the callback used to execute a command when the a menu item is clicked.
		/// See the Initialize method to see how the menu item is associated to this function using
		/// the OleMenuCommandService service and the MenuCommand class.
		/// </summary>
		private void MenuItemCallback(object sender, EventArgs e)
		{
			StripemOptions optDlg = new StripemOptions(_style, _enableFilenameFilter, _filenameFilter);
			if (optDlg.ShowDialog() == DialogResult.OK)
			{
				SaveSettings(optDlg);
			}

		}

		private void RegisterCommandHandlers()
		{
			// Add our command handlers for menu (commands must exist in the .vsct file)
			OleMenuCommandService mcs = GetService(typeof(IMenuCommandService)) as OleMenuCommandService;
			if (null != mcs)
			{
				// Create the command for the menu item.
				CommandID menuCommandID = new CommandID(GuidList.guidStripemCmdSet, (int)PkgCmdIDList.cmdIdStripem);
				MenuCommand menuItem = new MenuCommand(MenuItemCallback, menuCommandID);
				mcs.AddCommand(menuItem);
			}
		}

		private void LoadSettings()
		{
			// Read the last used style from the registry
			if (_style == StripemOptions.EolStyle.Uinitialized)
			{
				// Attempt to open the setting key
				RegistryKey key = Registry.CurrentUser.OpenSubKey("Software\\Grebulon\\Stripem2008", false);
				// If the key doesn't exist, create it
				if (key == null)
				{
					//System.Windows.Forms.MessageBox.Show("Creating registry key \"Software\\Grebulon\\Stripem2008\"", "Strip'em", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Information);
					key = Registry.CurrentUser.CreateSubKey("Software\\Grebulon\\Stripem2008");
				}

				// Get the style setting
				if (key != null)
				{
					_style = (StripemOptions.EolStyle)(int)key.GetValue("EolStyle", StripemOptions.EolStyle.Disabled);
					_enableFilenameFilter = (int)key.GetValue("EnableFilter", 0) != 0;
					_filenameFilter = (string)key.GetValue("FilenameFilter", ".*\\.(txt|cpp|c|h|hpp|msg|idl)$");
					//System.Windows.Forms.MessageBox.Show("Got registry style: " + _style + "=" + (int)_style + "\nEnable=" + _enableFilenameFilter + ", Filter="+_filenameFilter, "Strip'em", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Information);
				}
				else
				{
					_style = StripemOptions.EolStyle.Disabled;
					System.Windows.Forms.MessageBox.Show("Failed to open registry key \"Software\\Grebulon\\Stripem2008\"", "Strip'em", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Error);
				}
			}
		}

		private void SaveSettings(StripemOptions stripemOptions)
		{
			if (_style != stripemOptions.Style || _enableFilenameFilter != stripemOptions.EnableFilenameFilter ||
				_filenameFilter != stripemOptions.FilenameFilter)
			{
				_style = stripemOptions.Style;
				_enableFilenameFilter = stripemOptions.EnableFilenameFilter;
				_filenameFilter = stripemOptions.FilenameFilter;

				// Write the style to the registry
				// Attempt to open the setting key
				RegistryKey key = Registry.CurrentUser.OpenSubKey("Software\\Grebulon\\Stripem2008", true);
				if (key != null)
				{
					key.SetValue("EolStyle", (int)_style, RegistryValueKind.DWord);
					key.SetValue("EnableFilter", _enableFilenameFilter ? 1 : 0);
					key.SetValue("FilenameFilter", _filenameFilter);
					//System.Windows.Forms.MessageBox.Show("save registry style: " + _style + "=" + (int)_style + "\nEnable=" + _enableFilenameFilter + ", Filter=" + _filenameFilter, "Strip'em", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Information);
				}
				else
					System.Windows.Forms.MessageBox.Show("Failed to open registry key \"Software\\Grebulon\\Stripem2008\"", "Strip'em", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Error);
			}
		}
	}
}
