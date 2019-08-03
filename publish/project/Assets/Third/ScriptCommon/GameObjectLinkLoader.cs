using UnityEngine;
using System.Collections;
[DefaultExecutionOrder(1000)]
public class GameObjectLinkLoader : MonoBehaviour
{
    public GameObject source;
    public int layerAdd = -1;
    public float delayCreateTime = 0;

    private GameObject clonedObj = null;
    // Use this for initialization
    void Start()
    {
        if (delayCreateTime <= 0)
        {
            create();
        }
        else
        {
            this.Invoke("create", delayCreateTime);
        }
    }

    void create()
    {
        if (source != null)
        {
            clonedObj = GameObject.Instantiate(source);
            clonedObj.transform.SetParent(this.transform, false);
            clonedObj.transform.localPosition = Vector3.zero;
            clonedObj.transform.localScale = Vector3.one;
        }
        else
        {
            clonedObj = gameObject;
        }

        if (layerAdd >= 0)
        {
            var canvas = this.GetComponentInParent<Canvas>();
            if (canvas != null)
            {
                var layer = canvas.sortingOrder;
                var renderers = clonedObj.GetComponentsInChildren<Renderer>(true);
                var max = renderers == null ? 0 : renderers.Length;
                for (int idx = 0; idx < max; idx++)
                {
                    var renderer = renderers[idx];
                    if (renderer != null)
                    {
                        renderer.sortingOrder = layer + layerAdd;
                    }
                }
            }
        }
    }
}