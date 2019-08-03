#if UNITY_EDITOR
using System;
using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Reflection;
using System.Diagnostics;

public class GUIList
{
    private Vector2 scrollPos = Vector2.zero;
    private List<string> items = new List<string>();
    private int itemHeight = 22;
    private int selected = -1;

    public void Clear()
    {
        selected = -1;
        items.Clear();
    }

    public void AddItem(string item)
    {
        items.Add(item);
    }

    public void OnGUI(Event current)
    {
        if (current != null && current.type == EventType.MouseDown && current.button == 0 && current.clickCount == 1)
        {
            Vector2 pos = current.mousePosition + scrollPos;
            selected = (int)(pos.y / itemHeight);
        }

        int height = items.Count * itemHeight;
        scrollPos = GUI.BeginScrollView(new Rect(0, 0, Screen.width, Screen.height), scrollPos, new Rect(0, 0, Screen.width, height));
        for (int i = 0; i < items.Count; i++)
        {
            if (i == selected)
            {
                var back = GUI.color;
                GUI.color = Color.white;
                GUI.Box(new Rect(0, i * itemHeight, Screen.width, itemHeight), "");
                GUI.color = back;
            }
            GUI.Label(new Rect(2, i * itemHeight, Screen.width-2, itemHeight), items[i]);
        }
        GUI.EndScrollView();
    }

    public string GetRow(Vector2 pos)
    {
        pos = pos + scrollPos;
        int index = (int)(pos.y / itemHeight);
        if (index >= 0 && index < items.Count)
            return items[index];
        return null;
    }
}
public class TsStackWindow : EditorWindow
{
    private static TsStackWindow _wnd = null;

    private static TsStackWindow wnd
    {
        get
        {
            if (_wnd == null)
                _wnd = (TsStackWindow)EditorWindow.GetWindow(typeof(TsStackWindow), false, "TsStack");
            return _wnd;
        }
    }

    [MenuItem("Window/TsStack Window %#t", priority = 2198)]
    private static void ShowWindow()
    {
        wnd.Show();
        wnd.Focus();
    }

    public static void Log(string log)
    {
        string[] items = log.Split('\n');
        foreach (string item in items)
        {
            wnd.list.AddItem(item);
        }
    }

    public static void Clear()
    {
        wnd.list.Clear();
    }

    private GUIList list;

    private TsStackWindow()
    {
        list = new GUIList();
    }

    private void OnGUI()
    {
        Event current = Event.current;
        list.OnGUI(current);
        if (current.type == EventType.MouseDown && current.button == 0 && current.clickCount == 2)
        {
            string row = list.GetRow(current.mousePosition);
            if (!String.IsNullOrEmpty(row))
            {
                var regex = new Regex(@"([\w\/]+.ts):(\d+)");
                var m = regex.Match(row);
                if (m.Groups.Count == 3)
                {
                    OpenFileAtLine(m.Groups[1].Value, int.Parse(m.Groups[2].Value));
                }
            }
        }
    }
    private void OpenFileAtLine(string path, int line)
    {
        string tool = Application.dataPath + @"\Editor\tools\VisualStudioFileOpenTool.exe";
        Process p = new Process();
        p.StartInfo.FileName = tool;
        p.StartInfo.Arguments = Application.dataPath + @"\..\TsScripts\.tss.sln" + @" .tss " + Application.dataPath + "\\..\\"+ path + " " + line;
        p.Start();
    }
}
#endif
