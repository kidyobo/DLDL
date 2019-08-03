using UnityEngine;
using System.Collections.Generic;

public class NiceInvoker : MonoBehaviour
{
    private List<NiceInvokerElement> elements = new List<NiceInvokerElement>();
    public static NiceInvoker Get(GameObject go)
    {
        var invoker = go.GetComponent<NiceInvoker>();
        if (invoker == null)
        {
            invoker = go.AddComponent<NiceInvoker>();
        }
        return invoker;
    }
    public void SetCall(int key, System.Action callback)
    {
        for (int i = 0, len = elements.Count; i < len; i++)
        {
            var e = elements[i];
            if (e.key == key)
            {
                elements.RemoveAt(i);
                break;
            }
        }
        var element = new NiceInvokerElement();
        element.callback = callback;
        element.key = key;
        elements.Add(element);
    }
    public void Call(int key, float time)
    {
        NiceInvokerElement element = null;
        for (int i = 0, len = elements.Count; i < len; i++)
        {
            var e = elements[i];
            if (e.key == key)
            {
                element = e;
                break;
            }
        }
        if (element != null)
        {
            element.time = Time.realtimeSinceStartup + time;
            element.isEnabled = true;
            if (!this.enabled)
            {
                this.enabled = true;
            }
        }
        else
        {
            Debug.LogWarning("不存在call：" + key);
        }
    }
    public void CancelCall(int key)
    {
        for (int i = 0, len = elements.Count; i < len; i++)
        {
            var e = elements[i];
            if (e.key == key)
            {
                elements.RemoveAt(i);
                break;
            }
        }
    }
    public void CancelAllCall()
    {
        for (int i = elements.Count - 1; i >= 0; i--)
        {
            var e = elements[i];
            e.isEnabled = false;
        }
    }
    public void Clear()
    {
        elements.Clear();
    }
    void Update()
    {
        if (elements.Count == 0)
        {
            this.enabled = false;
        }
        else
        {
            var now = Time.realtimeSinceStartup;
            for (int i = elements.Count - 1; i >= 0; i--)
            {
                var e = elements[i];
                if (e.isEnabled)
                {
                    if (now >= e.time)
                    {
                        e.isEnabled = false;
                        var callback = e.callback;
                        callback();
                    }
                }
            }
        }
    }
}
class NiceInvokerElement
{
    public bool isEnabled = false;
    public int key;
    public float time;
    public System.Action callback;
}