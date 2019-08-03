using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;
using System;
public class UITextUrl : MonoBehaviour, IPointerClickHandler
{
    UIText target = null;
    public System.Action<string> onUrlClick = null;
    void Awake()
    {
        target = this.GetComponent<UIText>();
    }
    void IPointerClickHandler.OnPointerClick(PointerEventData eventData)
    {
        if (target == null)
            return;
        string result = target.GetUrlAtPosition(eventData.position);
        if (result != null && onUrlClick != null)
        {
            onUrlClick(result);
        }
    }
}