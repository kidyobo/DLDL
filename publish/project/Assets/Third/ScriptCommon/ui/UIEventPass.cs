//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2015 Tasharen Entertainment
//----------------------------------------------
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
[AddComponentMenu("Component/UI/Effect/UIEventPass"), DisallowMultipleComponent]
[RequireComponent(typeof(RectTransform))]
public class UIEventPass : MonoBehaviour, IPointerUpHandler, IPointerDownHandler
{
    [DonotWrap]
    public void OnPointerDown(PointerEventData eventData)
    {
        PassEvent(eventData, ExecuteEvents.pointerDownHandler);
    }
    [DonotWrap]
    public void OnPointerUp(PointerEventData eventData)
    {
        PassEvent(eventData, ExecuteEvents.pointerUpHandler);
    }
    //把事件透给父类
    private void PassEvent<T>(PointerEventData data, ExecuteEvents.EventFunction<T> function)
        where T : IEventSystemHandler
    {
        ExecuteEvents.Execute(transform.parent.gameObject, data, function);
    }
}