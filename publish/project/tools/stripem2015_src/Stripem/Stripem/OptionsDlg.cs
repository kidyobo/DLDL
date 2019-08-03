using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace Stripem
{
    public partial class StripemOptions : Form
    {
        public enum EolStyle
        {
            Uinitialized, Disabled, Unix, Windows, Mac
        }

        public EolStyle Style;
        public bool EnableFilenameFilter;
        public string FilenameFilter;

        public StripemOptions(EolStyle eolStyle, bool enableFilenameFilter, string filenameFilter)
        {
            Style = eolStyle;
            if (Style == StripemOptions.EolStyle.Uinitialized)
                Style = StripemOptions.EolStyle.Disabled;
            EnableFilenameFilter = enableFilenameFilter;
            FilenameFilter = filenameFilter;
            InitializeComponent();
        }

        private void dlg_Load(object sender, EventArgs e)
        {
            optDisable.Checked = false;
            optUnix.Checked = false;
            optWindows.Checked = false;
            optMac.Checked = false;
            switch (Style)
            {
                case EolStyle.Disabled: optDisable.Checked = true;  break;
                case EolStyle.Unix:     optUnix.Checked = true;     break;
                case EolStyle.Windows:  optWindows.Checked = true;  break;
                case EolStyle.Mac:      optMac.Checked = true;      break;
            }

            chkEnableFilter.Checked = EnableFilenameFilter;
            editFilenameFilter.Enabled = EnableFilenameFilter;
            editFilenameFilter.Text = FilenameFilter;
        }

        private void btnOk_Click(object sender, EventArgs e)
        {
            if (optDisable.Checked)
                Style = EolStyle.Disabled;
            else if (optUnix.Checked)
                Style = EolStyle.Unix;
            else if (optWindows.Checked)
                Style = EolStyle.Windows;
            else if (optMac.Checked)
                Style = EolStyle.Mac;
            EnableFilenameFilter = chkEnableFilter.Checked;
            FilenameFilter = editFilenameFilter.Text;
            Close();
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void enableFilter_CheckedChanged(object sender, EventArgs e)
        {
            editFilenameFilter.Enabled = chkEnableFilter.Checked;
        }
    }
}
