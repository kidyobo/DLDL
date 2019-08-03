// ----------------------------------------------------------------------------------
//
// FXMaker
// Created by ismoon - 2012 - ismoonto@gmail.com
//
// ----------------------------------------------------------------------------------


using UnityEngine;
using System.Collections;

public class NcBillboard : NcEffectBehaviour
{
    // Attribute ------------------------------------------------------------------------
    public bool m_bCameraLookAt;
    public bool m_bFixedObjectUp;
    public bool m_bFixedStand;
    public enum AXIS_TYPE { AXIS_FORWARD, AXIS_BACK, AXIS_RIGHT, AXIS_LEFT, AXIS_UP, AXIS_DOWN };
    public AXIS_TYPE m_FrontAxis;
    public enum ROTATION { NONE, RND, ROTATE }
    public ROTATION m_RatationMode;
    public enum AXIS { X = 0, Y, Z };
    public AXIS m_RatationAxis = AXIS.Z;
    public float m_fRotationValue = 180;

    protected float m_fRndValue;
    protected float m_fTotalRotationValue;
    protected Quaternion m_qOiginal;

    private Camera m_camera = null;

    // Property -------------------------------------------------------------------------
#if UNITY_EDITOR
    public override string CheckProperty()
    {
        if (1 < gameObject.GetComponents(GetType()).Length)
            return "SCRIPT_WARRING_DUPLICATE";

        return "";  // no error
    }
#endif

    void OnEnable()
    {
#if UNITY_EDITOR
        if (IsCreatingEditObject() == false)
            UpdateBillboard();
#else
 		UpdateBillboard();
#endif
    }

    public void UpdateBillboard()
    {
        m_fRndValue = Random.Range(0, 360.0f);
        if (enabled)
            Update();
    }

    void OnBecameVisible()
    {
        var current = Camera.current;
        if (current != null && current.hideFlags == HideFlags.None)
        {
            m_camera = Camera.current;
        }
    }

    void OnBecameInvisible()
    {
        var current = Camera.current;
        if (current == null || current.hideFlags == HideFlags.None)
        {
            m_camera = null;
        }
    }

    void Start()
    {
        m_qOiginal = transform.rotation;
    }

    void Update()
    {
        if (m_camera == null)
            return;
        if (m_bFixedStand)
        {
            var eulerAngles = transform.rotation.eulerAngles;
            transform.rotation = Quaternion.Euler(new Vector3(0, eulerAngles.y, eulerAngles.z));
        }
        else
        {
            var cameraT = m_camera.transform;
            Vector3 vecUp;
            if (m_bFixedObjectUp)
                vecUp = transform.up;
            else vecUp = cameraT.rotation * Vector3.up;
            if (m_bCameraLookAt)
                transform.LookAt(cameraT, vecUp);
            else transform.LookAt(transform.position + cameraT.rotation * Vector3.back, vecUp);
        }

        switch (m_FrontAxis)
        {
            case AXIS_TYPE.AXIS_FORWARD: break;
            case AXIS_TYPE.AXIS_BACK: transform.Rotate(transform.up, 180, Space.World); break;
            case AXIS_TYPE.AXIS_RIGHT: transform.Rotate(transform.up, 270, Space.World); break;
            case AXIS_TYPE.AXIS_LEFT: transform.Rotate(transform.up, 90, Space.World); break;
            case AXIS_TYPE.AXIS_UP: transform.Rotate(transform.right, 90, Space.World); break;
            case AXIS_TYPE.AXIS_DOWN: transform.Rotate(transform.right, 270, Space.World); break;
        }

        if (m_RatationMode == ROTATION.RND)
        {
            transform.localRotation *= Quaternion.Euler((m_RatationAxis == AXIS.X ? m_fRndValue : 0), (m_RatationAxis == AXIS.Y ? m_fRndValue : 0), (m_RatationAxis == AXIS.Z ? m_fRndValue : 0));
        }
        else if (m_RatationMode == ROTATION.ROTATE)
        {
            float fRotValue = GetEngineDeltaTime() * m_fRotationValue;
            transform.Rotate((m_RatationAxis == AXIS.X ? fRotValue : 0), (m_RatationAxis == AXIS.Y ? fRotValue : 0), (m_RatationAxis == AXIS.Z ? fRotValue : 0), Space.Self);
        }
    }
}