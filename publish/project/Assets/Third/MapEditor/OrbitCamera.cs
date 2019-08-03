#if UNITY_EDITOR
using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;

public class OrbitCamera : MonoBehaviour {
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
    void Start () {
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
    void Update () {
        if (!locked||!lockWSAD)
        {
            Vector3 vec = Vector3.zero;
            var up = transform.up;
            up.y = 0;
            up.Normalize();
            var right = transform.right;
            right.y = 0;
            right.Normalize();
            if (Input.GetKey(KeyCode.W))
            {
                vec += up * wsadsensitivity;
            }

            if (Input.GetKey(KeyCode.S))
            {
                vec -= up * wsadsensitivity;
            }

            if (Input.GetKey(KeyCode.A))
            {
                vec -= right * wsadsensitivity;
            }

            if (Input.GetKey(KeyCode.D))
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
            if (mouseDown&&Input.GetMouseButton(0))
            {
                cameraRotSide += Input.GetAxis("Mouse X") * sensitivity;
                cameraRotUp -= Input.GetAxis("Mouse Y") * sensitivity;
            }
        }
		cameraRotSideCur = Mathf.LerpAngle(cameraRotSideCur, cameraRotSide, Time.deltaTime*5);
		cameraRotUpCur = Mathf.Lerp(cameraRotUpCur, cameraRotUp, Time.deltaTime*5);

        if (valid)
        {
            distance *= (1 - 1 * Input.GetAxis("Mouse ScrollWheel"));
        }

        transform.position = new Vector3(target.position.x, target.position.y+1.2f, target.position.z) ;
		transform.rotation = Quaternion.Euler(cameraRotUpCur, cameraRotSideCur, 0);
		
		float dist = Mathf.Lerp(-cam.transform.localPosition.z, distance, Time.deltaTime*20);
		cam.localPosition = -Vector3.forward * dist;
	}
}
#endif