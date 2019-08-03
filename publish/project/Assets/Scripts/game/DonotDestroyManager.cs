using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//该类保存所有所有donotdestroy对象，并可以方便的管理这些对象
public static class DonotDestroyManager
{
    static HashSet<GameObject> list = new HashSet<GameObject>();
    public static void Add(GameObject go)
    {
        if (list.Add(go))
        {
            GameObject.DontDestroyOnLoad(go);
        }
    }
    public static void Remove(GameObject go)
    {
        if (list.Remove(go))
        {
            GameObject.Destroy(go);
        }
    }
    public static void Clear()
    {
        foreach (var go in list)
        {
            GameObject.Destroy(go);
        }
        list.Clear();
    }
    public static void Log()
    {
        Debug.Log("count:" + list.Count);
        foreach (var go in list)
        {
            Debug.Log(go.name);
        }
    }
}