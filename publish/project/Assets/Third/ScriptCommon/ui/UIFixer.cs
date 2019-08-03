using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections;
[ExecuteInEditMode]
[RequireComponent(typeof(RectTransform))]
public class UIFixer : UIBehaviour
{
    CanvasScaler canvasScaler = null;
    protected override void OnRectTransformDimensionsChange()
    {
        if (canvasScaler == null)
        {
            canvasScaler = this.GetComponent<CanvasScaler>();
            if (canvasScaler == null)
            {
                return;
            }
        }
        var currentRadio = 1.0f * Screen.width / Screen.height;
        var targetRadio = canvasScaler.referenceResolution.x / canvasScaler.referenceResolution.y;
        if (currentRadio >= targetRadio)
        {
            canvasScaler.matchWidthOrHeight = 1;
        }
        else
        {
            canvasScaler.matchWidthOrHeight = 0;
        }
    }
}