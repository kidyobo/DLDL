using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DoubleDefineList : MonoBehaviour
{
    [SerializeField]
    List<string> names = new List<string>();
    [SerializeField]
    List<double> values = new List<double>();
    public List<string> Names
    {
        get
        {
            return names;
        }
    }
    public List<double> Values
    {
        get
        {
            return values;
        }
    }
    Dictionary<string, double> dic = new Dictionary<string, double>();
    private static DoubleDefineList instance;
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
    public static double GetValue(string name)
    {
        if (instance == null)
        {
            return 0;
        }
        double value = 0;
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