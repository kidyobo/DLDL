namespace WindowsFormsApplication1
{
    partial class Form1
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.ConvertBtn = new System.Windows.Forms.Button();
            this.progressBar = new System.Windows.Forms.ProgressBar();
            this.tip = new System.Windows.Forms.Label();
            this.BatchConvertBtn = new System.Windows.Forms.Button();
            this.TargetBtn = new System.Windows.Forms.Button();
            this.TargetFolder = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // ConvertBtn
            // 
            this.ConvertBtn.Location = new System.Drawing.Point(31, 50);
            this.ConvertBtn.Name = "ConvertBtn";
            this.ConvertBtn.Size = new System.Drawing.Size(134, 48);
            this.ConvertBtn.TabIndex = 0;
            this.ConvertBtn.Text = "打开图片并切片";
            this.ConvertBtn.UseVisualStyleBackColor = true;
            this.ConvertBtn.Click += new System.EventHandler(this.onConvert);
            // 
            // progressBar
            // 
            this.progressBar.Location = new System.Drawing.Point(32, 157);
            this.progressBar.Name = "progressBar";
            this.progressBar.Size = new System.Drawing.Size(382, 23);
            this.progressBar.TabIndex = 1;
            // 
            // tip
            // 
            this.tip.AutoSize = true;
            this.tip.Location = new System.Drawing.Point(33, 115);
            this.tip.Name = "tip";
            this.tip.Size = new System.Drawing.Size(0, 12);
            this.tip.TabIndex = 2;
            // 
            // BatchConvertBtn
            // 
            this.BatchConvertBtn.Location = new System.Drawing.Point(280, 50);
            this.BatchConvertBtn.Name = "BatchConvertBtn";
            this.BatchConvertBtn.Size = new System.Drawing.Size(134, 48);
            this.BatchConvertBtn.TabIndex = 3;
            this.BatchConvertBtn.Text = "批量切图";
            this.BatchConvertBtn.UseVisualStyleBackColor = true;
            this.BatchConvertBtn.Click += new System.EventHandler(this.onBatchConvert);
            // 
            // TargetBtn
            // 
            this.TargetBtn.Location = new System.Drawing.Point(31, 5);
            this.TargetBtn.Name = "TargetBtn";
            this.TargetBtn.Size = new System.Drawing.Size(134, 28);
            this.TargetBtn.TabIndex = 4;
            this.TargetBtn.Text = "选择输出路径";
            this.TargetBtn.UseVisualStyleBackColor = true;
            this.TargetBtn.Click += new System.EventHandler(this.onSelectTarget);
            // 
            // TargetFolder
            // 
            this.TargetFolder.AutoSize = true;
            this.TargetFolder.Location = new System.Drawing.Point(175, 12);
            this.TargetFolder.Name = "TargetFolder";
            this.TargetFolder.Size = new System.Drawing.Size(0, 12);
            this.TargetFolder.TabIndex = 5;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(451, 192);
            this.Controls.Add(this.BatchConvertBtn);
            this.Controls.Add(this.tip);
            this.Controls.Add(this.progressBar);
            this.Controls.Add(this.ConvertBtn);
            this.Controls.Add(this.TargetBtn);
            this.Controls.Add(this.TargetFolder);
            this.Name = "Form1";
            this.Text = "地图切图工具";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button ConvertBtn;
        private System.Windows.Forms.ProgressBar progressBar;
        private System.Windows.Forms.Label tip;
        private System.Windows.Forms.Button BatchConvertBtn;
        private System.Windows.Forms.Button TargetBtn;
        private System.Windows.Forms.Label TargetFolder;
    }
}

