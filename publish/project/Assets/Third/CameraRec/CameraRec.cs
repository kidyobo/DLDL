using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;

public class CameraRec : MonoBehaviour
{
    public System.Action onClick = null;
    public Transform target;
    public Transform cam;
    public Vector3 offset = Vector3.zero;
    public float sensitivity;
    public float wsadsensitivity;
    private float cameraRotSide;
    private float cameraRotUp;
    private float cameraRotSideCur;
    private float cameraRotUpCur;
    private float distance;

    private bool mouseDown = false;
    private float downTime = 0;

    private bool locked = false;
    public bool lockWSAD = true;
    public float yDelta = 0;
    public float hOffset = 0;
    public float vOffset = 0;
    void Start()
    {
        cameraRotSide = transform.eulerAngles.y;
        cameraRotSideCur = transform.eulerAngles.y;
        cameraRotUp = transform.eulerAngles.x;
        cameraRotUpCur = transform.eulerAngles.x;
        distance = -cam.localPosition.z;
    }
    public void LockTarget(GameObject target)
    {
        if (target == null)
        {
            locked = false;
        }
        else
        {
            locked = true;
            TweenPosition.Begin(this.target.gameObject, 0.5f, target.transform.position, true);
        }
    }
    void Update()
    {
        if (!locked || !lockWSAD)
        {
            Vector3 vec = Vector3.zero;
            var up = transform.up;
            up.y = 0;
            up.Normalize();
            var right = transform.right;
            right.y = 0;
            right.Normalize();
            if (Input.GetKey(KeyCode.UpArrow))
            {
                vec += up * wsadsensitivity;
            }

            if (Input.GetKey(KeyCode.DownArrow))
            {
                vec -= up * wsadsensitivity;
            }

            if (Input.GetKey(KeyCode.LeftArrow))
            {
                vec -= right * wsadsensitivity;
            }

            if (Input.GetKey(KeyCode.RightArrow))
            {
                vec += right * wsadsensitivity;
            }
            if (vec != Vector3.zero)
            {
                target.position += vec;
            }
        }
        bool valid = true;
        if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject())
        {
            valid = false;
        }
        else
        {
            if (Input.GetMouseButtonDown(0))
            {
                downTime = Time.realtimeSinceStartup;
                mouseDown = true;
            }
            if (Input.GetMouseButtonUp(0))
            {
                if (!locked)
                {
                    if (Time.realtimeSinceStartup - downTime < 0.22)
                    {
                        if (onClick != null)
                        {
                            onClick();
                        }
                    }
                }
                mouseDown = false;
            }
            if (mouseDown && Input.GetMouseButton(0))
            {
                cameraRotSide += Input.GetAxis("Mouse X") * sensitivity;
                cameraRotUp -= Input.GetAxis("Mouse Y") * sensitivity;
            }
        }


        if (Input.GetKey(KeyCode.Keypad8))
        {
            cameraRotUp += 0.1f * sensitivity;
        }
        if (Input.GetKey(KeyCode.Keypad5))
        {
            cameraRotUp -= 0.1f * sensitivity;
        }
        if (Input.GetKey(KeyCode.Keypad4))
        {
            cameraRotSide += 0.1f * sensitivity;
        }
        if (Input.GetKey(KeyCode.Keypad6))
        {
            cameraRotSide -= 0.1f * sensitivity;
        }
        if (Input.GetKey(KeyCode.Keypad7))
        {
            distance *= (1 - 0.001f * sensitivity);
        }
        if (Input.GetKey(KeyCode.Keypad9))
        {
            distance *= (1 + 0.001f * sensitivity);
        }
        if (Input.GetKey(KeyCode.Keypad1))
        {
            vOffset += sensitivity * 0.05f;
        }
        if (Input.GetKey(KeyCode.Keypad3))
        {
            vOffset -= sensitivity * 0.05f;
        }
        if (Input.GetKey(KeyCode.Keypad2))
        {
            hOffset += sensitivity * 0.05f;
        }
        if (Input.GetKey(KeyCode.Keypad0))
        {
            hOffset -= sensitivity * 0.05f;
        }

        if (Input.GetKey(KeyCode.KeypadPlus))
        {
            sensitivity += sensitivity * 0.01f;
        }
        if (Input.GetKey(KeyCode.KeypadMinus))
        {
            sensitivity -= sensitivity * 0.01f;
        }
        if (Input.GetKey(KeyCode.KeypadMultiply))
        {
            wsadsensitivity += wsadsensitivity * 0.01f;
        }
        if (Input.GetKey(KeyCode.KeypadDivide))
        {
            wsadsensitivity -= wsadsensitivity * 0.01f;
        }

        if (Input.GetKey(KeyCode.PageUp))
        {
            yDelta += wsadsensitivity;
        }
        if (Input.GetKey(KeyCode.PageDown))
        {
            yDelta -= wsadsensitivity;
        }
        if (Input.GetKey(KeyCode.Delete))
        {
            hOffset = 0;
            vOffset = 0;
            yDelta = 0;
        }

        cameraRotSideCur = Mathf.LerpAngle(cameraRotSideCur, cameraRotSide, Time.deltaTime * 5);
        cameraRotUpCur = Mathf.Lerp(cameraRotUpCur, cameraRotUp, Time.deltaTime * 5);

        if (valid)
        {
            distance *= (1 - 1 * Input.GetAxis("Mouse ScrollWheel"));
        }

        transform.position = new Vector3(target.position.x, target.position.y + 1.2f, target.position.z);
        transform.rotation = Quaternion.Euler(cameraRotUpCur, cameraRotSideCur, 0);

        float dist = Mathf.Lerp(-cam.transform.localPosition.z, distance, Time.deltaTime * 20);
        cam.localPosition = -Vector3.forward * dist;
        var old = cam.localPosition;
        old.y = yDelta;
        cam.localPosition = old;
        cam.rotation = Quaternion.Euler(cameraRotUpCur - hOffset, cameraRotSideCur - vOffset, 0);
    }
}