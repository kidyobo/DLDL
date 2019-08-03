using UnityEngine;
using System.Collections.Generic;

public class Invoker : MonoBehaviour
{
    private List<System.Action> destroyCallback = null;
    private List<InvokerElement> elements = new List<InvokerElement>();

    public static void BeginInvoke(GameObject go, string key, float time, System.Action callback)
    {
        var invoker = go.GetComponent<Invoker>();
        if (invoker == null)
        {
            invoker = go.AddComponent<Invoker>();
        }
        var elements = invoker.elements;
        if (key != null)
        {
            for (int i = 0, len = elements.Count; i < len; i++)
            {
                var e = elements[i];
                if (e.key.Equals(key))
                {
                    elements.RemoveAt(i);
                    break;
                }
            }
        }
        var element = new InvokerElement();
        element.callback = callback;
        element.key = key;
        element.time = Time.realtimeSinceStartup + time;
        elements.Add(element);
        if (!invoker.enabled)
        {
            invoker.enabled = true;
        }
    }

    public static void EndInvoke(GameObject go, string key)
    {
        var invoker = go.GetComponent<Invoker>();
        if (invoker == null)
        {
            return;
        }
        if (key == null)
        {
            var elements = invoker.elements;
            elements.Clear();
        }
        else
        {
            var elements = invoker.elements;
            for (int i = 0, len = elements.Count; i < len; i++)
            {
                var e = elements[i];
                if (e.key.Equals(key))
                {
                    elements.RemoveAt(i);
                    break;
                }
            }
        }
    }

    public static bool IsInvoking(GameObject go, string key)
    {
        var invoker = go.GetComponent<Invoker>();
        if (invoker == null)
        {
            return false;
        }
        var elements = invoker.elements;
        if (key == null)
        {
            return elements.Count > 0;
        }
        else
        {
            for (int i = 0, len = elements.Count; i < len; i++)
            {
                var e = elements[i];
                if (e.key.Equals(key))
                {
                    return true;
                }
            }
        }
        return false;
    }

    public static void AddDestroyInvoke(GameObject go, System.Action callback)
    {
        var invoker = go.GetComponent<Invoker>();
        if (invoker == null)
        {
            invoker = go.AddComponent<Invoker>();
        }
        if (invoker.destroyCallback == null)
        {
            invoker.destroyCallback = new List<System.Action>();
        }
        invoker.destroyCallback.Add(callback);
    }

    void OnDestroy()
    {
        if (destroyCallback != null)
        {
            for(int i = 0, length = destroyCallback.Count; i < length; i++)
            {
                destroyCallback[i]();
            }
            destroyCallback.Clear();
            destroyCallback = null;
        }
    }

    void Update()
    {
        if (elements.Count == 0)
        {
            this.enabled = false;
        }
        else
        {
            for (int i = elements.Count - 1; i >= 0; i--)
            {
                var e = elements[i];
                if (Time.realtimeSinceStartup > e.time)
                {
                    var callback = e.callback;
                    e.callback = null;
                    elements.RemoveAt(i);

                    callback();
                }
            }
        }
    }
}
class InvokerElement
{
    public string key;
    public float time;
    public System.Action callback;
}