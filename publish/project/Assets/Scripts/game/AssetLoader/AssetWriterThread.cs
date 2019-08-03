using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Threading;
public static class AssetWriterThread
{
    private static object locker = new object();
    private static List<AssetWriter> writerList = new List<AssetWriter>(100);
    private static Thread thread = null;
    public static void Init()
    {
        if (thread == null)
        {
            thread = new Thread(ThreadDo);
            thread.Start();
        }
    }
    public static void AddWriter(AssetWriter writer)
    {
        lock (locker)
        {
            writerList.Add(writer);
        }
    }
    public static void RemoveWriter(AssetWriter writer)
    {
        lock (locker)
        {
            writerList.Remove(writer);
        }
    }
    public static void Destroy()
    {
        if (thread != null)
        {
            thread.Abort();
            thread = null;
        }
    }
    private static void ThreadDo()
    {
        while (true)
        {
            AssetWriter writer = null;
            lock (locker)
            {
                if (writerList.Count > 0)
                {
                    writer = writerList[0];
                    writerList.RemoveAt(0);
                }
            }
            if (writer != null)
            {
                writer.ThreadDo();
            }
            else
            {
                Thread.Sleep(30);
            }
        }
    }
}