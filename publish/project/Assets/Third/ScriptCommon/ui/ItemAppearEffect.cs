using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;


// 因为listitem的pivot都设置为（0, 1），所以不能使用UIButtonScale
class ItemScale
{
    private RectTransform rectTransform;
    private Vector3 minScale = new Vector3(0.93f, 0.93f, 0.93f);
    private float startTime = 0;

    public float speedDuration = 0.15f;

    public float needDuration = 0;
    private Vector3 fromScale = Vector3.one;
    private Vector3 toScale = Vector3.one;

    public ItemScale(GameObject gameObject)
    {
        rectTransform = gameObject.transform as RectTransform;
    }

    public void Update(Vector2 pos, Vector2 size)
    {
        if (FloatEquals(startTime, 0))
        {
            return;
        }

        float duration = Time.realtimeSinceStartup - startTime;
        float factor = Mathf.Clamp01(duration / needDuration);
        TweenScale(factor);
        var scale = rectTransform.localScale;
        var offset = new Vector2((1 - scale.x) * size.x / 2, (-1) * (1 - scale.y) * size.y / 2);
        rectTransform.anchoredPosition = pos + offset;

        if (FloatEquals(factor, 1))
        {
            startTime = 0;
        }
    }

    public void OnPointerDown()
    {
        startTime = Time.realtimeSinceStartup;
        fromScale = rectTransform.localScale;
        toScale = minScale;
        needDuration = CalcNeedDuration(toScale, fromScale, speedDuration);
    }

    public void OnPointerUp()
    {
        startTime = Time.realtimeSinceStartup;
        fromScale = rectTransform.localScale;
        toScale = Vector3.one;
        needDuration = CalcNeedDuration(fromScale, toScale, speedDuration);
    }

    public void TweenScale(float factor)
    {
        rectTransform.localScale = fromScale * (1f - factor) + toScale * factor;
    }

    private float CalcNeedDuration(Vector3 v1, Vector3 v2, float totalDuration)
    {
        var dir = v2 - v1;
        var total = Vector3.one - minScale;
        return dir.x / total.x * totalDuration;
    }

    private bool FloatEquals(float a, float b)
    {
        return Mathf.Abs(a - b) < Mathf.Epsilon;
    }
}

public class ItemAppearEffect : MonoBehaviour, IPointerUpHandler, IPointerDownHandler
{
    private float delayTime = 0;
    private float startTime = 0;
    private int axis = 1;
    private float elasticity = 1.2f;
    private float offset = 30f;

    private bool stop = true;
    private CanvasRenderer[] renderers = null;
    private Vector2 lastPos = Vector2.zero;
    private Vector2 toPos = Vector2.zero;
    private Vector2 curPos = Vector2.zero;
    private Vector2 size = Vector2.one;
    private float curSpeed = 0f;
    private float lastalpha = -1f;

    private ItemScale itemScale = null;

    public void Set(float delayTime, int axis, float elasticity, float offset, Vector2 offsetdir)
    {
        this.delayTime = delayTime;
        this.axis = axis;
        this.elasticity = elasticity;
        this.offset = offset;
        this.startTime = Time.realtimeSinceStartup;

        stop = false;
        var trans = gameObject.transform as RectTransform;
        toPos = trans.anchoredPosition;
        curPos[axis] = toPos[axis] - offset * offsetdir[axis];

        size = trans.sizeDelta;
        lastPos = trans.anchoredPosition;
        lastPos[axis] = curPos[axis];
        trans.anchoredPosition = lastPos;
        lastalpha = -1f;
        SetAlpha(0);

        if (gameObject.GetComponentInChildren<UIButtonScale>() == null)
        {
            itemScale = new ItemScale(gameObject);
        }
    }

    public void Stop()
    {
        stop = true;
        SetAlpha(1);
    }

    void Start()
    {
    }

    void Update()
    {
        if (!stop && (Time.realtimeSinceStartup - startTime) >= delayTime)
        {
            Slide();
            Appear();
        }

        if (itemScale != null) itemScale.Update(lastPos, size);
    }

    void Slide()
    {
        var trans = gameObject.transform as RectTransform;
        float speed = curSpeed;
        curPos[axis] = Mathf.SmoothDamp(curPos[axis], toPos[axis], ref speed, elasticity, Mathf.Infinity, Time.deltaTime);
        if (Mathf.Abs(speed) < 1)
            speed = 0;
        curSpeed = speed;

        float dis = Mathf.Abs(curPos[axis] - toPos[axis]);
        if (dis < 1f)
        {
            curPos[axis] = toPos[axis];
            stop = true;
        }
        lastPos[axis] = curPos[axis];
        trans.anchoredPosition = lastPos;
    }

    void Appear()
    {
        if (stop)
            SetAlpha(1);
        else
            SetAlpha(1 - Mathf.Abs(toPos[axis] - curPos[axis]) / offset);
    }

    void SetAlpha(float alpha)
    {
        if (Mathf.Abs(alpha - lastalpha) < 0.003f)
        {
            return;
        }
        lastalpha = alpha;
        renderers = gameObject.GetComponentsInChildren<CanvasRenderer>();
        for (int i = 0; i < renderers.Length; i++)
        {
            renderers[i].SetAlpha(alpha);
        }
    }

    [DonotWrap]
    public void OnPointerDown(PointerEventData eventData)
    {
        if (enabled && itemScale != null)
        {
            itemScale.OnPointerDown();
        }
    }

    [DonotWrap]
    public void OnPointerUp(PointerEventData eventData)
    {
        if (this.Equals(null))
            return;

        if (enabled && itemScale != null)
        {
            itemScale.OnPointerUp();
        }
    }
}
