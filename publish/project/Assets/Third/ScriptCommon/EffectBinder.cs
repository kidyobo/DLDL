using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public class EffectBinder : MonoBehaviour
{
    [SerializeField]
    public List<Transform> effectT = new List<Transform>();
    [SerializeField]
    public List<GameObject> effects = new List<GameObject>();
    void Awake()
    {
        //加载特效
        var length = effectT.Count;
        for (int i = 0; i < length; i++)
        {
            var asset = effects[i];
            var parent = effectT[i];
            if (asset != null)
            {
                GameObject.Instantiate<GameObject>(asset, parent);
            }
        }
    }
}