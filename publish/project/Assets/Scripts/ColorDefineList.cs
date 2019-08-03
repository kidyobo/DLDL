using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ColorDefineList : MonoBehaviour
{
    [SerializeField]
    List<string> names = new List<string>();
    [SerializeField]
    List<Color> values = new List<Color>();
    public List<string> Names
    {
        get
        {
            return names;
        }
    }
    public List<Color> Values
    {
        get
        {
            return values;
        }
    }
    Dictionary<string, Color> dic = new Dictionary<string, Color>();
    private static ColorDefineList instance;
    public void Init()
    {
        if (names.Count != values.Count)
        {
            return;
        }
        for (int i = 0; i < names.Count; i++)
        {
            dic[names[i]] = values[i];
        }
        instance = this;
    }
    public static Color GetValue(string name)
    {
        if (instance == null)
        {
            return Color.white;
        }
        Color value = Color.white;
#if UNITY_EDITOR
        var index = instance.names.IndexOf(name);
        if (index >= 0)
        {
            value = instance.values[index];
        }
#else
        instance.dic.TryGetValue(name, out value);
#endif
        return value;
    }
}