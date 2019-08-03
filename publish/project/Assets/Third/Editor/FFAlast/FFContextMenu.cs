﻿using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

/// <summary>
/// This editor helper class makes it easy to create and show a context menu.
/// It ensures that it's possible to add multiple items with the same name.
/// </summary>

public static class FFContextMenu
{

    static List<string> mEntries = new List<string>();
    static GenericMenu mMenu;

    /// <summary>
    /// Clear the context menu list.
    /// </summary>

    static public void Clear()
    {
        mEntries.Clear();
        mMenu = null;
    }

    /// <summary>
    /// Add a new context menu entry.
    /// </summary>

    static public void AddItem(string item, bool isChecked, GenericMenu.MenuFunction2 callback, object param)
    {
        if (callback != null)
        {
            if (mMenu == null) mMenu = new GenericMenu();
            int count = 0;

            for (int i = 0; i < mEntries.Count; ++i)
            {
                string str = mEntries[i];
                if (str == item) ++count;
            }
            mEntries.Add(item);

            if (count > 0) item += " [" + count + "]";
            mMenu.AddItem(new GUIContent(item), isChecked, callback, param);
        }
        else AddDisabledItem(item);
    }
    
    /// <summary>
    /// Helper function that adds the specified type to all selected game objects. Used with the menu options above.
    /// </summary>

    static void Attach(object obj)
    {
        if (Selection.activeGameObject == null) return;
        System.Type type = (System.Type)obj;

        for (int i = 0; i < Selection.gameObjects.Length; ++i)
        {
            GameObject go = Selection.gameObjects[i];
            if (go.GetComponent(type) != null) continue;
#if !UNITY_3_5
            Component cmp = go.AddComponent(type);
            Undo.RegisterCreatedObjectUndo(cmp, "Attach " + type);
#endif
        }
    }

    /// <summary>
    /// Helper function.
    /// </summary>

    static void AddMissingItem<T>(GameObject target, string name) where T : MonoBehaviour
    {
        if (target.GetComponent<T>() == null)
            AddItem(name, false, Attach, typeof(T));
    }
    static void OnDelete(object obj)
    {
        GameObject go = obj as GameObject;
        Selection.activeGameObject = go.transform.parent.gameObject;
        Undo.DestroyObjectImmediate(go);
    }

    /// <summary>
    /// Add a new disabled context menu entry.
    /// </summary>

    static public void AddDisabledItem(string item)
    {
        if (mMenu == null) mMenu = new GenericMenu();
        mMenu.AddDisabledItem(new GUIContent(item));
    }

    /// <summary>
    /// Add a separator to the menu.
    /// </summary>

    static public void AddSeparator(string path)
    {
        if (mMenu == null) mMenu = new GenericMenu();

        // For some weird reason adding separators on OSX causes the entire menu to be disabled. Wtf?
        if (Application.platform != RuntimePlatform.OSXEditor)
            mMenu.AddSeparator(path);
    }

    /// <summary>
    /// Show the context menu with all the added items.
    /// </summary>

    static public void Show()
    {
        if (mMenu != null)
        {
            mMenu.ShowAsContext();
            mMenu = null;
            mEntries.Clear();
        }
    }
}
