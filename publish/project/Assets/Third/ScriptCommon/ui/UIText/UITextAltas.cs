using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
[ExecuteInEditMode]
public class UITextAltas : MonoBehaviour
{
    public List<RectTransform> _altas = new List<RectTransform>();
    private Dictionary<string, RectTransform> altasDic = new Dictionary<string, RectTransform>();
    private string[] names = null;
    void GenerateDic()
    {
        altasDic.Clear();
        names = new string[_altas.Count];
        for (int i = 0; i < _altas.Count; i++)
        {
            names[i] = _altas[i].name;
            altasDic[names[i]] = _altas[i];
        }
    }

    public string[] GetMatchNames()
    {
        if (names == null)
        {
            GenerateDic();
        }
        return names;
    }

    [DonotWrap]
    public GameObject onMatch(string name)
    {
        RectTransform sprite = null;
        altasDic.TryGetValue(name, out sprite);
        if (sprite == null)
        {
            return null;
        }
        return sprite.gameObject;
    }
}