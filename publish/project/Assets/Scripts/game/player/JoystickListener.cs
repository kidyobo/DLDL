using UnityEngine;
using System.Collections;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using System;
/// <summary>
/// 处理摇杆输入的类型
/// </summary>

public class JoystickListener : MonoBehaviour, IPointerDownHandler, IPointerUpHandler, IDragHandler
{
    RectTransform touchRectTransform = null;
    Vector2 center = Vector2.zero;
    Vector2 point = Vector2.zero;
    public RectTransform arrow;
    public float distance = 0;
    public Action<Vector2> onJoystickUpdate = null;
    public Action onJoystickEnd = null;
    private Camera m_camera;
    public 
    void Awake()
    {
        m_camera = Camera.main;
        //检查rectTransform，如果没有则直接删除
        touchRectTransform = this.GetComponent<RectTransform>();
        if (touchRectTransform == null)
        {
            Log.logError("JoystickListener必须挂载到拥有RectTransform的节点");
            GameObject.DestroyImmediate(this);
            return;
        }
        //获取区域中点
        var rect = touchRectTransform.rect;
        center.x = rect.x + rect.width / 2;
        center.y = rect.y + rect.height / 2;
    }
#if UNITY_EDITOR || UNITY_STANDALONE
    Vector2 vec = new Vector2();
    Vector2 lastVec = new Vector2();
    bool pressed = false;
    void Update()
    {
        vec.x = 0;
        vec.y = 0;
        var cameraT = m_camera.transform;
        var camFoward = cameraT.forward;
        var camRight = cameraT.right;
        if (Input.GetKey(KeyCode.W))
        {
            vec.x += camFoward.x;
            vec.y += camFoward.z;
            pressed = true;
        }

        if (Input.GetKey(KeyCode.S))
        {
            vec.x -= camFoward.x;
            vec.y -= camFoward.z;
            pressed = true;
        }

        if (Input.GetKey(KeyCode.A))
        {
            vec.x -= camRight.x;
            vec.y -= camRight.z;
            pressed = true;
        }

        if (Input.GetKey(KeyCode.D))
        {
            vec.x += camRight.x;
            vec.y += camRight.z;
            pressed = true;
        }
        if (vec == Vector2.zero)
        {
            if (pressed)
            {
                pressed = false;
                if (onJoystickEnd != null)
                {
                    lastVec = Vector2.zero;
                    onJoystickEnd();
                }
            }
        }
        else
        {
            if (vec != lastVec)
            {
                lastVec = vec;
                CheckUpdate(vec);
            }
        }
    }
#endif

    /// <summary>
    /// 检查当前摇杆方向
    /// </summary>
    void CheckDirection()
    {
        Vector2 direction = point - center;
        CheckUpdate(direction);
    }

    public void OnPointerDown(PointerEventData eventData)
    {
        point = eventData.pressEventCamera.ScreenToWorldPoint(eventData.position);
        point = transform.InverseTransformPoint(point);
        CheckDirection();
    }

    public void OnPointerUp(PointerEventData eventData)
    {
        CheckEnd();
    }

    public void OnDrag(PointerEventData eventData)
    {
        point = eventData.pressEventCamera.ScreenToWorldPoint(eventData.position);
        point = transform.InverseTransformPoint(point);
        CheckDirection();
    }

    private void CheckUpdate(Vector2 direction)
    {
        var magnitude = direction.magnitude;
        var normalized = direction.normalized;
        if (this.arrow != null)
        {
            if (magnitude > distance)
            {
                this.arrow.anchoredPosition = normalized * distance;
            }
            else
            {
                this.arrow.anchoredPosition = direction;
            }
        }
        if (onJoystickUpdate != null && direction != Vector2.zero)
        {
            onJoystickUpdate(normalized);
        }
    }
    private void CheckEnd()
    {
        if (this.arrow != null)
            this.arrow.anchoredPosition = UnityEngine.Vector2.zero;
        if (onJoystickEnd != null)
        {
            onJoystickEnd();
        }
    }
}