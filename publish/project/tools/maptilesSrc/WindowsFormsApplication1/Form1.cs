using System;
using System.Drawing;
using System.Windows.Forms;
using System.Drawing.Imaging;
using System.IO;
using System.Drawing.Drawing2D;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;

namespace WindowsFormsApplication1
{
    public partial class Form1 : Form
    {
        private const string cfgfile = "cfg.txt";
        private const int tileJpegQty = 90;
        private const int mosaicJpegQty = 50;

        private const int tileW = 512;
        private const int tileH = 512;
        private const int mosaicW = 639;
        private const int mosaicH = 455;

        private SynchronizationContext syncContext = null;
        private string lastSrcPath = "";

        public Form1()
        {
            InitializeComponent();
            syncContext = SynchronizationContext.Current;
            if (File.Exists(cfgfile))
            {
                string [] paths = File.ReadAllText(cfgfile).Split(';');
                TargetFolder.Text = paths[0];
                lastSrcPath = paths[1];
            }
        }

        private void onSelectTarget(object sender, EventArgs e)
        {
            FolderBrowserDialog openFolderDlg = new FolderBrowserDialog();
            openFolderDlg.ShowNewFolderButton = true;
            openFolderDlg.Description = "请选择输出目录";
            if (openFolderDlg.ShowDialog() == DialogResult.OK)
            {
                TargetFolder.Text = openFolderDlg.SelectedPath;
                saveCfg();
            }
        }

        private void onConvert(object sender, EventArgs e)
        {
            if (TargetFolder.Text == "")
            {
                MessageBox.Show("请选择输出路径");
                return;
            }

            OpenFileDialog openFileDialog = new OpenFileDialog();
            openFileDialog.Filter = @"Bitmap文件(*.bmp)|*.bmp|Jpeg文件(*.jpg)|*.jpg|所有合适文件(*.bmp,*.jpg.*.png)|*.bmp;*.jpg;*.png";
            openFileDialog.FilterIndex = 3;
            openFileDialog.RestoreDirectory = true;
            if (DialogResult.OK == openFileDialog.ShowDialog())
            {
                syncContext.Post(showTip, "开始转换：" + openFileDialog.FileName);
                convertSrcImage(openFileDialog.FileName);
                syncContext.Post(showTip, "转换完毕！");
            }
        }

        private void onBatchConvert(object sender, EventArgs e)
        {
            if (TargetFolder.Text == "")
            {
                MessageBox.Show("请选择输出路径");
                return;
            }

            FolderBrowserDialog openFolderDlg = new FolderBrowserDialog();
            openFolderDlg.ShowNewFolderButton = true;
            openFolderDlg.Description = "请选择地图目录";
            openFolderDlg.SelectedPath = lastSrcPath;
            if (openFolderDlg.ShowDialog() == DialogResult.OK)
            {
                lastSrcPath = openFolderDlg.SelectedPath;
                saveCfg();
                new Thread(() => { convertSrcImages(openFolderDlg.SelectedPath); }).Start();
            }
        }

        private void saveCfg()
        {
            File.WriteAllText(cfgfile, TargetFolder.Text + ";" + lastSrcPath);
        }

        private void convertSrcImages(string path)
        {
            var srcFiles = Directory.GetFiles(path, "*.jpg", SearchOption.AllDirectories);
            syncContext.Post(setProgressMax, srcFiles.Length);
            syncContext.Post(setProgress, 0);
            foreach (string fileName in srcFiles)
            {
                syncContext.Post(showTip, "开始转换：" + fileName);
                convertSrcImage(fileName);
                syncContext.Post(addProgress, null);
            }
            syncContext.Post(showTip, "转换完毕！");
            syncContext.Post(hideProgress, null);
        }

        private void setProgressMax(object maxvalue)
        {
            progressBar.Visible = true;
            progressBar.Maximum = (int)maxvalue;
        }

        private void setProgress(object value)
        {
            progressBar.Value = (int)value;
        }

        private void addProgress(object value)
        {
            progressBar.Value++;
        }

        private void hideProgress(object value)
        {
            progressBar.Visible = false;
        }

        private void showTip(object text)
        {
            tip.Text = text.ToString();
        }

        private void convertSrcImage(string fileName)
        {
            string mapId = Directory.GetParent(fileName).Name;
            Bitmap bitmap = (Bitmap)Bitmap.FromFile(fileName, false);
            splitImageToTiles(mapId, bitmap);
            createMosaicImage(mapId, bitmap);
            bitmap.Dispose();
        }

        private void splitImageToTiles(string mapId, Bitmap bitmap)
        {
            string targetMapPath = TargetFolder.Text + "\\" + mapId + "\\";
            createDirectory(targetMapPath);
            int rows = (int)Math.Ceiling((double)bitmap.Height / tileH);
            int cols = (int)Math.Ceiling((double)bitmap.Width / tileW);
            Bitmap tileBmp = new Bitmap(tileW, tileH, bitmap.PixelFormat);
            for (int row = 0; row < rows; row++)
            {
                for (int col = 0; col < cols; col++)
                {
                    string tilePath = targetMapPath + col + "_" + row + ".jpg";
                    copyTileBmp(bitmap, col, row, tileBmp);
                    saveAsJPEG(tileBmp, tilePath, tileJpegQty);
                }
            }
            tileBmp.Dispose();
        }

        private void copyTileBmp(Bitmap srcBmp, int col, int row, Bitmap tileBmp)
        {
            Rectangle srcRect = new Rectangle(col * tileW, row * tileH, Math.Min(tileW, srcBmp.Width - col * tileW), Math.Min(tileH, srcBmp.Height - row * tileH));
            Rectangle desRect = new Rectangle(0, 0, tileW, tileH);
            BitmapData srcDatas = srcBmp.LockBits(srcRect, ImageLockMode.ReadOnly, srcBmp.PixelFormat);
            BitmapData desDatas = tileBmp.LockBits(desRect, ImageLockMode.ReadWrite, tileBmp.PixelFormat);

            int step = Bitmap.GetPixelFormatSize(srcBmp.PixelFormat) / 8;
            byte[] srcPixels = new byte[tileW * tileH * step];
            for (int h = 0; h < srcRect.Height; h++)
            {
                Marshal.Copy(srcDatas.Scan0 + h * srcDatas.Stride, srcPixels, h * desDatas.Stride, srcRect.Width * step);
            }
            Marshal.Copy(srcPixels, 0, desDatas.Scan0, srcPixels.Length);

            srcBmp.UnlockBits(srcDatas);
            tileBmp.UnlockBits(desDatas);
        }

        private void createMosaicImage(string mapId, Bitmap bitmap)
        {
            int fitMosaicW = mosaicW;
            int fitMosaicH = mosaicH;
            if (bitmap.Width / (float)bitmap.Height > mosaicW / (float)mosaicH)
                fitMosaicH = fitMosaicW * bitmap.Height / bitmap.Width;
            else
                fitMosaicW = fitMosaicH * bitmap.Width / bitmap.Height;
            Bitmap mosaicBmp = new Bitmap(fitMosaicW, fitMosaicH, PixelFormat.Format32bppRgb);

            Graphics g = Graphics.FromImage(mosaicBmp);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.DrawImage(bitmap, new Rectangle(0, 0, mosaicBmp.Width, mosaicBmp.Height), new Rectangle(0, 0, bitmap.Width, bitmap.Height), GraphicsUnit.Pixel);
            g.Dispose();

            string targetMapPath = TargetFolder.Text + "\\..\\SmallMaps\\";
            createDirectory(targetMapPath);
            string mosaicPath = targetMapPath + mapId + ".jpg";
            saveAsJPEG(mosaicBmp, mosaicPath, mosaicJpegQty);

            mosaicBmp.Dispose();
        }

        private void saveAsJPEG(Bitmap bmp, string FileName, int Qty)
        {
            EncoderParameters ps = new EncoderParameters(1);
            EncoderParameter p = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, Qty);
            ps.Param[0] = p;
            bmp.Save(FileName, getCodecInfo("image/jpeg"), ps);
        }

        private ImageCodecInfo getCodecInfo(string mimeType)
        {
            ImageCodecInfo[] CodecInfo = ImageCodecInfo.GetImageEncoders();
            foreach (ImageCodecInfo ici in CodecInfo)
            {
                if (ici.MimeType == mimeType) return ici;
            }
            return null;
        }

        private void createDirectory(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }
    }
}
