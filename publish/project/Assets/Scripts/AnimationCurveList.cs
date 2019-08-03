using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AnimationCurveList : MonoBehaviour
{
    [SerializeField]
    List<string> names = new List<string>();
    [SerializeField]
    List<AnimationCurve> curves = new List<AnimationCurve>();
    public List<string> Names
    {
        get
        {
            return names;
        }
    }
    public List<AnimationCurve> Curves
    {
        get
        {
            return curves;
        }
    }
    Dictionary<string, AnimationCurve> dic = new Dictionary<string, AnimationCurve>();
    private static AnimationCurveList instance;
    public void Init()
    {
        if (names.Count != curves.Count)
        {
            return;
        }
        for (int i = 0; i < names.Count; i++)
        {
            dic[names[i]] = curves[i];
        }
        instance = this;
    }
    public static AnimationCurve GetCurve(string name)
    {
        if (instance == null)
        {
            return null;
        }
        AnimationCurve curve = null;
        instance.dic.TryGetValue(name, out curve);
        return curve;
    }
}