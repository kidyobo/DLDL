using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections;
[ExecuteInEditMode]
[RequireComponent(typeof(RectTransform))]
public class UIBlack : UIBehaviour
{
    RectTransform rect = null;
    CanvasScaler canvasScaler = null;
    Canvas canvas = null;
    protected override void OnRectTransformDimensionsChange()
    {
        if (canvasScaler == null || canvas == null)
        {
            rect = GetComponent<RectTransform>();
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.sizeDelta = Vector2.zero;
            rect.anchoredPosition = Vector2.zero;
            canvasScaler = this.GetComponentInParent<CanvasScaler>();
            canvas = this.GetComponentInParent<Canvas>();
            if (canvasScaler == null || canvas == null)
            {
                return;
            }
        }
        float width = canvasScaler.referenceResolution.x;
        float realWidth = Screen.width / canvas.scaleFactor;
        if (width < realWidth)
        {
            rect.sizeDelta = new Vector2(width - realWidth, 0);
        }
        else
        {
            rect.sizeDelta = Vector2.zero;
        }
    }
}