using UnityEngine;
using System.Collections.Generic;
using UnityEngine.EventSystems;
using System;

public class InputListener : MonoBehaviour
{
    /// <summary>
    /// 这里返回的是屏幕的坐标位置
    /// </summary>
    public System.Action<GameObject, float, float, float> onClick = null;
    private Camera mainCamera = null;

    /// <summary>
    /// ui点击
    /// </summary>
    public System.Action onUIClick = null;

    /// <summary>
    /// 手势操作，返回水平和垂直方向的动作，0表示无动作，1表示向右/上，-1表示向左/下
    /// </summary>
    public System.Action<int, int> onGuesture = null;
    public float fingerActionSensitivity = Screen.width * 0.05f; //手指动作的敏感度，这里设定为 二十分之一的屏幕宽度.

    private float fingerBeginX;
    private float fingerBeginY;
    //
    private int fingerTouchState;
    //
    private int FINGER_STATE_NULL = 0;
    private int FINGER_STATE_TOUCH = 1;
    private int FINGER_STATE_ADD = 2;
    public int maxCount = 2;
    private int fingerID = -1000;
    void Start()
    {
        fingerActionSensitivity = Screen.width * 0.05f;

        fingerBeginX = 0;
        fingerBeginY = 0;

        fingerTouchState = FINGER_STATE_NULL;
        mainCamera = Camera.main;
    }

    // Update is called once per frame
    void Update()
    {
#if UNITY_EDITOR || UNITY_STANDALONE
        if (Input.GetKeyDown(KeyCode.Mouse0)&& fingerID==-1000)
        {
            //如果2D物体已经被点击这直接返回
            if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject())
            {
                onUIClick();
                fingerTouchState = FINGER_STATE_ADD;
                return;
            }
            var pos = Input.mousePosition;
            var mouseX = pos.x;
            var mouseY = pos.y;
            if (fingerTouchState == FINGER_STATE_NULL)
            {
                fingerTouchState = FINGER_STATE_TOUCH;
                fingerBeginX = mouseX;
                fingerBeginY = mouseY;
            }
        }

        if (fingerTouchState == FINGER_STATE_TOUCH)
        {
            var pos = Input.mousePosition;
            var mouseX = pos.x;
            var mouseY = pos.y;

            var fingerSegmentX = mouseX - fingerBeginX;
            var fingerSegmentY = mouseY - fingerBeginY;

            float fingerDistance = fingerSegmentX * fingerSegmentX + fingerSegmentY * fingerSegmentY;

            if (fingerDistance > (fingerActionSensitivity * fingerActionSensitivity))
            {
                fingerTouchState = FINGER_STATE_ADD;
                if (Mathf.Abs(fingerSegmentX) > Mathf.Abs(fingerSegmentY))
                {
                    fingerSegmentY = 0;
                }
                else
                {
                    fingerSegmentX = 0;
                }

                if (fingerSegmentX == 0)
                {
                    if (fingerSegmentY > 0)
                    {
                        onGuesture(0, 1);
                    }
                    else
                    {
                        onGuesture(0, -1);
                    }
                }
                else if (fingerSegmentY == 0)
                {
                    if (fingerSegmentX > 0)
                    {
                        onGuesture(1, 0);
                    }
                    else
                    {
                        onGuesture(-1, 0);
                    }
                }
            }
        }

        if (Input.GetKeyUp(KeyCode.Mouse0))
        {
            //如果2D物体已经被点击这直接返回
            if (fingerTouchState != FINGER_STATE_ADD)
            {
                this.mainCamera.ScreenPointToRay(Input.mousePosition);
                RaycastHit hitInfo;
                if (Physics.Raycast(this.mainCamera.ScreenPointToRay(Input.mousePosition), out hitInfo,1<<10))
                {
                    var pos = hitInfo.point;
                    onClick(hitInfo.collider.gameObject, pos.x, pos.y, pos.z);
                }
            }
            fingerTouchState = FINGER_STATE_NULL;
        }
#else
        var touchCount = Input.touchCount;
        if (touchCount > 0)
        {
            for (int i = 0; i < touchCount; i++)
            {
                if (i >= maxCount)
                {
                    continue;
                }
                var touch = Input.GetTouch(i);
                if (touch.phase == TouchPhase.Began)
                {
                    //如果2D物体已经被点击这直接返回
                    if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject(touch.fingerId))
                    {
                        onUIClick();
                        continue;
                    }
                    if (fingerID == -1000)
                    {
                        fingerID = touch.fingerId;
                        var pos = touch.position;
                        if (fingerTouchState == FINGER_STATE_NULL)
                        {
                            fingerTouchState = FINGER_STATE_TOUCH;
                            fingerBeginX = pos.x;
                            fingerBeginY = pos.y;
                        }
                    }
                    else
                    {
                        RaycastHit hitInfo;
                        if (Physics.Raycast(this.mainCamera.ScreenPointToRay(touch.position), out hitInfo))
                        {
                            var pos = hitInfo.point;
                            onClick(hitInfo.collider.gameObject, pos.x, pos.y, pos.z);
                        }
                    }
                }
                else if (touch.phase == TouchPhase.Moved)
                {
                    if (fingerID == touch.fingerId)
                    {
                        if (fingerTouchState == FINGER_STATE_TOUCH)
                        {
                            var pos = touch.position;
                            var mouseX = pos.x;
                            var mouseY = pos.y;

                            var fingerSegmentX = mouseX - fingerBeginX;
                            var fingerSegmentY = mouseY - fingerBeginY;

                            float fingerDistance = fingerSegmentX * fingerSegmentX + fingerSegmentY * fingerSegmentY;

                            if (fingerDistance > (fingerActionSensitivity * fingerActionSensitivity))
                            {
                                fingerTouchState = FINGER_STATE_ADD;
                                if (Mathf.Abs(fingerSegmentX) > Mathf.Abs(fingerSegmentY))
                                {
                                    fingerSegmentY = 0;
                                }
                                else
                                {
                                    fingerSegmentX = 0;
                                }

                                if (fingerSegmentX == 0)
                                {
                                    if (fingerSegmentY > 0)
                                    {
                                        onGuesture(0, 1);
                                    }
                                    else
                                    {
                                        onGuesture(0, -1);
                                    }
                                }
                                else if (fingerSegmentY == 0)
                                {
                                    if (fingerSegmentX > 0)
                                    {
                                        onGuesture(1, 0);
                                    }
                                    else
                                    {
                                        onGuesture(-1, 0);
                                    }
                                }
                            }
                        }
                    }
                }
                else if (touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled)
                {
                    if (fingerID == touch.fingerId)
                    {
                        //如果2D物体已经被点击这直接返回
                        if (fingerTouchState != FINGER_STATE_ADD)
                        {
                            RaycastHit hitInfo;
                            if (Physics.Raycast(this.mainCamera.ScreenPointToRay(touch.position), out hitInfo))
                            {
                                var pos = hitInfo.point;
                                onClick(hitInfo.collider.gameObject, pos.x, pos.y, pos.z);
                            }
                        }
                        fingerTouchState = FINGER_STATE_NULL;
                        fingerID = -1000;
                    }
                }
            }
        }
#endif
    }
}