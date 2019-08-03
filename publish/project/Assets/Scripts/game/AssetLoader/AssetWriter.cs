using UnityEngine;
using System.Collections;
using System.IO;
using System;
using System.Text;
using System.Threading;
/// <summary>
/// 异步从内存写文件到硬盘
/// </summary>
public class AssetWriter
{
    public bool isDone
    {
        get
        {
            return end;
        }
    }
    private string _error = null;
    public string error
    {
        get
        {
            if (!end)
            {
                return null;
            }
            return _error;
        }
    }
    private AssetDecompressType uncompressType = AssetDecompressType.None;
    private byte[] bytes = null;
    private string url = null;
    private bool end = false;
    public AssetWriter(AssetDecompressType uncompressType, byte[] bytes, string targetPath, bool async, AssetPriority priority)
    {
        this.uncompressType = uncompressType;
        this.bytes = bytes;
        var builder = new StringBuilder();
        builder.Append(AssetCaching.persistentDataPath);
        builder.Append("/");
        builder.Append(targetPath);
        this.url = builder.ToString();
        if (async)
        {
            AssetWriterThread.AddWriter(this);
        }
        else
        {
            ThreadDo();
        }
    }

    public void ThreadDo()
    {
        switch (uncompressType)
        {
            case AssetDecompressType.None:
                CopyFile(this.bytes, this.url);
                break;
            case AssetDecompressType.Lzma:
                DecompressFileLZMA(this.bytes, this.url);
                break;
            default:
                break;
        }
        end = true;
    }

    public void Close()
    {
        AssetWriterThread.RemoveWriter(this);
    }

    void DecompressFileLZMA(byte[] bytes, string url)
    {
        try
        {
            SevenZip.Compression.LZMA.Decoder coder = new SevenZip.Compression.LZMA.Decoder();
            MemoryStream input = new MemoryStream(bytes);
            ByteArray byteArray = new ByteArray(input, null);
            // Read the decoder properties
            byte[] properties = byteArray.ReadBytes(5);
            long fileLength = byteArray.ReadInt64();

            var path = Path.GetDirectoryName(url);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            FileStream output = new FileStream(url, FileMode.Create, FileAccess.Write);
            // Decompress the file.
            coder.SetDecoderProperties(properties);
            coder.Code(input, output, bytes.Length, fileLength, null);
            byteArray.Dispose();
            output.Close();
        }
        catch (Exception e)
        {
            _error = "AssetWriter " + e.Message;
        }
    }
    void CopyFile(byte[] bytes, string url)
    {
        try
        {
            // Read the decoder properties
            var path = Path.GetDirectoryName(url);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            FileStream output = new FileStream(url, FileMode.Create, FileAccess.Write);
            output.Write(bytes, 0, bytes.Length);
            output.Close();
        }
        catch (Exception e)
        {
            _error = "AssetWriter " + e.Message;
        }
    }
}