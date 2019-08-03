using UnityEngine;
using System.Collections.Generic;
[AddComponentMenu("UIExtend/UGUIAltas")]
public class UGUIAltas : MonoBehaviour
{
    [DonotWrap]
    public List<string> names = new List<string>();
    [DonotWrap]
    public List<Sprite> sprites = new List<Sprite>();
    Dictionary<string, Sprite> altas = null;

    public Sprite Get(string name)
    {
        if (altas == null)
        {
            altas = new Dictionary<string, Sprite>();
            for (int i = 0; i < names.Count; i++)
            {
                altas[names[i]] = sprites[i];
            }
        }
        Sprite sprite = null;
        altas.TryGetValue(name, out sprite);
        return sprite;
    }
}