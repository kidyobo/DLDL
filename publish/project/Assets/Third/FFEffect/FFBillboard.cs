// ----------------------------------------------------------------------------------
//
// FXMaker
// Created by ismoon - 2012 - ismoonto@gmail.com
//
// ----------------------------------------------------------------------------------


using UnityEngine;
using System.Collections;

public class FFBillboard : MonoBehaviour
{
    public Vector3 rotationOffset = new Vector3(-90, 0, 0);
    private Camera m_camera = null;
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

    void Update()
    {
        if (m_camera == null)
            return;
        var cameraT = m_camera.transform;
        transform.forward = m_camera.transform.forward;
        transform.rotation = Quaternion.Euler(transform.rotation.eulerAngles + rotationOffset);
    }
}