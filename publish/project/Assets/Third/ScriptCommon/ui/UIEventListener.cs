using UnityEngine;
using UnityEngine.EventSystems;
public class UIClickListener : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
{
    public static PointerEventData eventData;
    public static GameObject target;

    public float delay = 0;

    public System.Action onClick;
    private Rect rect;
    private bool init = false;
    static public UIClickListener Get(GameObject go)
    {
        if (go == null)
        {
            return null;
        }
        UIClickListener listener = go.GetComponent<UIClickListener>();
        if (listener == null)
            listener = go.AddComponent<UIClickListener>();
        return listener;
    }
    [DonotWrap]
    public void OnPointerDown(PointerEventData e)
    {
        if (!init)
        {
            var recrTransform = (this.transform as RectTransform);
            this.rect = recrTransform.rect;
        }
    }
    [DonotWrap]
    public void OnPointerUp(PointerEventData e)
    {
        eventData = e;
        target = gameObject;
        Vector2 newPoint;
        RectTransformUtility.ScreenPointToLocalPointInRectangle(this.transform as RectTransform, e.position, e.pressEventCamera, out newPoint);
        newPoint = newPoint * transform.localScale.x;
        if (e.eligibleForClick && !e.dragging)
        {
            if (rect.Contains(newPoint))
            {
                if(this.delay > 0)
                {
                    this.Invoke("CallOnClick", this.delay);
                }
                else
                {
                    this.CallOnClick();
                }
            }
        }
    }
    private void CallOnClick()
    {
        if (onClick != null)
            onClick();
    }
}
public class UITouchListener : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
{
    public static PointerEventData eventData;
    public static GameObject target;

    public float touchingDelta = 0;
    public float touchingBeginDelta = 0.5f;
    public bool pressed;
    public System.Action onTouchBegin;
    public System.Action onTouchEnd;
    public System.Action onTouching;
    static public UITouchListener Get(GameObject go)
    {
        if (go == null)
        {
            return null;
        }
        UITouchListener listener = go.GetComponent<UITouchListener>();
        if (listener == null)
            listener = go.AddComponent<UITouchListener>();
        return listener;
    }
    [DonotWrap]
    public void OnPointerDown(PointerEventData e)
    {
        eventData = e;
        target = gameObject;

        pressed = true;
        if (onTouchBegin != null)
            onTouchBegin();
        if (onTouching != null)
        {
            if (touchingBeginDelta >= 0)
            {
                this.Invoke("SendTouchingMessage", touchingBeginDelta);
            }
        }
    }
    void SendTouchingMessage()
    {
        if (onTouching != null)
        {
            target = gameObject;
            onTouching();
            if (touchingDelta > 0)
            {
                this.Invoke("SendTouchingMessage", touchingDelta);
            }
        }
    }
    [DonotWrap]
    public void OnPointerUp(PointerEventData e)
    {
        if (pressed && onTouchEnd != null)
        {
            eventData = e;
            target = gameObject;
            onTouchEnd();
        }
        if (onTouching != null)
        {
            this.CancelInvoke("SendTouchingMessage");
        }
        pressed = false;
    }
}
public class UIDragListener : MonoBehaviour, IDragHandler
{
    public static PointerEventData eventData;
    public static GameObject target;
    public System.Action onDrag;
    static public UIDragListener Get(GameObject go)
    {
        if (go == null)
        {
            return null;
        }
        UIDragListener listener = go.GetComponent<UIDragListener>();
        if (listener == null)
            listener = go.AddComponent<UIDragListener>();
        return listener;
    }
    [DonotWrap]
    public void OnDrag(PointerEventData e)
    {
        eventData = e;
        if (onDrag != null)
        {
            onDrag();
        }
    }
}

public class UIPointerDownListener : MonoBehaviour, IPointerDownHandler
{
    public static PointerEventData eventData;
    public static GameObject target;

    public System.Action onClick;
    private Rect rect;
    private bool init = false;
    static public UIPointerDownListener Get(GameObject go)
    {
        if (go == null)
        {
            return null;
        }
        UIPointerDownListener listener = go.GetComponent<UIPointerDownListener>();
        if (listener == null)
            listener = go.AddComponent<UIPointerDownListener>();
        return listener;
    }
    [DonotWrap]
    public void OnPointerDown(PointerEventData e)
    {
        if (!init)
        {
            var recrTransform = (this.transform as RectTransform);
            this.rect = recrTransform.rect;
        }

        eventData = e;
        target = gameObject;
        Vector2 newPoint;
        RectTransformUtility.ScreenPointToLocalPointInRectangle(this.transform as RectTransform, e.position, e.pressEventCamera, out newPoint);
        newPoint = newPoint * transform.localScale.x;
        if (e.eligibleForClick && !e.dragging)
        {
            if (rect.Contains(newPoint))
            {
                if (onClick != null)
                    onClick();
            }
        }
    }
}

public class UIPointerUpListener : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
{
    public static PointerEventData eventData;
    public static GameObject target;

    public System.Action onClick;
    private Rect rect;
    private bool init = false;
    static public UIPointerUpListener Get(GameObject go)
    {
        if (go == null)
        {
            return null;
        }
        UIPointerUpListener listener = go.GetComponent<UIPointerUpListener>();
        if (listener == null)
            listener = go.AddComponent<UIPointerUpListener>();
        return listener;
    }
    [DonotWrap]
    public void OnPointerDown(PointerEventData e)
    {
        if (!init)
        {
            var recrTransform = (this.transform as RectTransform);
            this.rect = recrTransform.rect;
        }
    }
    [DonotWrap]
    public void OnPointerUp(PointerEventData e)
    {
        eventData = e;
        target = gameObject;
        Vector2 newPoint;
        RectTransformUtility.ScreenPointToLocalPointInRectangle(this.transform as RectTransform, e.position, e.pressEventCamera, out newPoint);
        newPoint = newPoint * transform.localScale.x;
        if (e.eligibleForClick && !e.dragging)
        {
            if (rect.Contains(newPoint))
            {
                if (onClick != null)
                    onClick();
            }
        }
    }
}

public class UIPointerExitListener : MonoBehaviour, IPointerExitHandler
{
    public static PointerEventData eventData;
    public static GameObject target;

    public System.Action onClick;
    static public UIPointerExitListener Get(GameObject go)
    {
        if (go == null)
        {
            return null;
        }
        UIPointerExitListener listener = go.GetComponent<UIPointerExitListener>();
        if (listener == null)
            listener = go.AddComponent<UIPointerExitListener>();
        return listener;
    }
    
    [DonotWrap]
    public void OnPointerExit(PointerEventData e)
    {
        eventData = e;
       
        if (onClick != null)
            onClick();
    }
}