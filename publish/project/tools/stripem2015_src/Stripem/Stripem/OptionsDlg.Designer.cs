namespace Stripem
{
    partial class StripemOptions
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.GroupBox EolGroup;
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(StripemOptions));
            this.optDisable = new System.Windows.Forms.RadioButton();
            this.optMac = new System.Windows.Forms.RadioButton();
            this.optWindows = new System.Windows.Forms.RadioButton();
            this.optUnix = new System.Windows.Forms.RadioButton();
            this.btnOk = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.chkEnableFilter = new System.Windows.Forms.CheckBox();
            this.editFilenameFilter = new System.Windows.Forms.TextBox();
            EolGroup = new System.Windows.Forms.GroupBox();
            EolGroup.SuspendLayout();
            this.SuspendLayout();
            // 
            // EolGroup
            // 
            EolGroup.Controls.Add(this.optDisable);
            EolGroup.Controls.Add(this.optMac);
            EolGroup.Controls.Add(this.optWindows);
            EolGroup.Controls.Add(this.optUnix);
            EolGroup.Location = new System.Drawing.Point(12, 12);
            EolGroup.Name = "EolGroup";
            EolGroup.Size = new System.Drawing.Size(137, 118);
            EolGroup.TabIndex = 0;
            EolGroup.TabStop = false;
            EolGroup.Text = "End Of Line type";
            // 
            // optDisable
            // 
            this.optDisable.AutoSize = true;
            this.optDisable.Location = new System.Drawing.Point(9, 88);
            this.optDisable.Name = "optDisable";
            this.optDisable.Size = new System.Drawing.Size(66, 17);
            this.optDisable.TabIndex = 3;
            this.optDisable.TabStop = true;
            this.optDisable.Text = "Disabled";
            this.optDisable.UseVisualStyleBackColor = true;
            // 
            // optMac
            // 
            this.optMac.AutoSize = true;
            this.optMac.Location = new System.Drawing.Point(9, 65);
            this.optMac.Name = "optMac";
            this.optMac.Size = new System.Drawing.Size(70, 17);
            this.optMac.TabIndex = 2;
            this.optMac.TabStop = true;
            this.optMac.Text = "Mac (CR)";
            this.optMac.UseVisualStyleBackColor = true;
            // 
            // optWindows
            // 
            this.optWindows.AutoSize = true;
            this.optWindows.Location = new System.Drawing.Point(9, 42);
            this.optWindows.Name = "optWindows";
            this.optWindows.Size = new System.Drawing.Size(111, 17);
            this.optWindows.TabIndex = 1;
            this.optWindows.TabStop = true;
            this.optWindows.Text = "Windows (CR+LF)";
            this.optWindows.UseVisualStyleBackColor = true;
            // 
            // optUnix
            // 
            this.optUnix.AutoSize = true;
            this.optUnix.Location = new System.Drawing.Point(9, 19);
            this.optUnix.Name = "optUnix";
            this.optUnix.Size = new System.Drawing.Size(67, 17);
            this.optUnix.TabIndex = 0;
            this.optUnix.TabStop = true;
            this.optUnix.Text = "Unix (LF)";
            this.optUnix.UseVisualStyleBackColor = true;
            // 
            // btnOk
            // 
            this.btnOk.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.btnOk.Location = new System.Drawing.Point(182, 12);
            this.btnOk.Name = "btnOk";
            this.btnOk.Size = new System.Drawing.Size(75, 23);
            this.btnOk.TabIndex = 1;
            this.btnOk.Text = "OK";
            this.btnOk.UseVisualStyleBackColor = true;
            this.btnOk.Click += new System.EventHandler(this.btnOk_Click);
            // 
            // btnCancel
            // 
            this.btnCancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.btnCancel.Location = new System.Drawing.Point(182, 41);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(75, 23);
            this.btnCancel.TabIndex = 2;
            this.btnCancel.Text = "Cancel";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
            // 
            // textBox1
            // 
            this.textBox1.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.textBox1.Cursor = System.Windows.Forms.Cursors.Default;
            this.textBox1.Location = new System.Drawing.Point(12, 192);
            this.textBox1.Multiline = true;
            this.textBox1.Name = "textBox1";
            this.textBox1.ReadOnly = true;
            this.textBox1.Size = new System.Drawing.Size(245, 72);
            this.textBox1.TabIndex = 3;
            this.textBox1.Text = resources.GetString("textBox1.Text");
            // 
            // chkEnableFilter
            // 
            this.chkEnableFilter.AutoSize = true;
            this.chkEnableFilter.Location = new System.Drawing.Point(12, 136);
            this.chkEnableFilter.Name = "chkEnableFilter";
            this.chkEnableFilter.Size = new System.Drawing.Size(227, 17);
            this.chkEnableFilter.TabIndex = 4;
            this.chkEnableFilter.Text = "Convert files matching a regular expression";
            this.chkEnableFilter.UseVisualStyleBackColor = true;
            this.chkEnableFilter.CheckedChanged += new System.EventHandler(this.enableFilter_CheckedChanged);
            // 
            // editFilenameFilter
            // 
            this.editFilenameFilter.Enabled = false;
            this.editFilenameFilter.Location = new System.Drawing.Point(12, 160);
            this.editFilenameFilter.Name = "editFilenameFilter";
            this.editFilenameFilter.Size = new System.Drawing.Size(245, 20);
            this.editFilenameFilter.TabIndex = 5;
            this.editFilenameFilter.Text = ".*\\.(txt|cpp|c|h|hpp|msg|idl)$";
            // 
            // StripemOptions
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.btnCancel;
            this.ClientSize = new System.Drawing.Size(269, 276);
            this.Controls.Add(this.editFilenameFilter);
            this.Controls.Add(this.chkEnableFilter);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.btnOk);
            this.Controls.Add(EolGroup);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "StripemOptions";
            this.ShowInTaskbar = false;
            this.SizeGripStyle = System.Windows.Forms.SizeGripStyle.Hide;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Strip\'em Options";
            this.Load += new System.EventHandler(this.dlg_Load);
            EolGroup.ResumeLayout(false);
            EolGroup.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.RadioButton optDisable;
        private System.Windows.Forms.RadioButton optMac;
        private System.Windows.Forms.RadioButton optWindows;
        private System.Windows.Forms.RadioButton optUnix;
        private System.Windows.Forms.Button btnOk;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.CheckBox chkEnableFilter;
        private System.Windows.Forms.TextBox editFilenameFilter;
    }
}