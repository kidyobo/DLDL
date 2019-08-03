// ----------------------------------------------------------------------------------
//
// FXMaker
// Created by ismoon - 2012 - ismoonto@gmail.com
//
// ----------------------------------------------------------------------------------


using UnityEngine;

using System.Collections.Generic;

public class NcDuplicator : NcEffectBehaviour
{
    // Attribute ------------------------------------------------------------------------
    public float m_fDuplicateTime = 0.1f;
    public int m_nDuplicateCount = 3;
    public Vector3 m_AddStartPos = Vector3.zero;
    public Vector3 m_AccumStartRot = Vector3.zero;
    public Vector3 m_RandomRange = Vector3.zero;

    protected int m_nCreateCount = 0;
    protected float m_fStartTime = 0;
    protected GameObject m_ClonObject;
    protected bool m_bInvoke = false;
    List<GameObject> goList;
    private Quaternion m_origionRot;
    // Property -------------------------------------------------------------------------
#if UNITY_EDITOR
    public override string CheckProperty()
    {
        if (1 < gameObject.GetComponents(GetType()).Length)
            return "SCRIPT_WARRING_DUPLICATE";

        // err check
        if (transform.parent != null && transform.parent.gameObject == FindRootEditorEffect())
            return "SCRIPT_ERROR_ROOT";
        return "";  // no error
    }
#endif

    public override int GetAnimationState()
    {
        if ((enabled && IsActive(gameObject)) && (m_nDuplicateCount == 0 || m_nDuplicateCount != 0 && m_nCreateCount < m_nDuplicateCount))
            return 1;
        return 0;
    }

    public GameObject GetCloneObject()
    {
        return m_ClonObject;
    }

    // Loop Function --------------------------------------------------------------------
    void Awake()
    {
        m_nCreateCount = 0;
        m_fStartTime = -m_fDuplicateTime;
        m_ClonObject = null;
        m_bInvoke = false;
        goList = new List<GameObject>(m_nDuplicateCount);

        if (enabled == false)
            return;
#if UNITY_EDITOR
        if (IsCreatingEditObject() == false)
#endif
            if (transform.parent != null && (enabled && IsActive(gameObject) && GetComponent<NcDontActive>() == null))
                InitCloneObject();
    }

    protected override void OnDestroy()
    {
        if (m_ClonObject != null)
            DestroyImmediate(m_ClonObject);
        base.OnDestroy();
    }

    void Start()
    {
        if (m_bInvoke)
        {
            m_fStartTime = GetEngineTime();
            CreateCloneObject();
            InvokeRepeating("CreateCloneObject", m_fDuplicateTime, m_fDuplicateTime);
        }
    }

    void OnDisable()
    {
        m_nCreateCount = 0;
        for (int i = 0; i < goList.Count; i++)
        {
            goList[i].SetActive(false);
        }
    }

    void Update()
    {
        // 		Debug.Log("Duration.Update");
        if (m_bInvoke)
            return;
        // Duration
        if (m_nDuplicateCount == 0 || m_nCreateCount < m_nDuplicateCount)
        {
            if (m_fStartTime + m_fDuplicateTime <= GetEngineTime())
            {
                m_fStartTime = GetEngineTime();
                CreateCloneObject();
            }
        }
    }
    // Control Function -----------------------------------------------------------------
    void InitCloneObject()
    {
        if (m_ClonObject == null)
        {
            m_origionRot = transform.localRotation;
            // clone ----------------
            m_ClonObject = (GameObject)CreateGameObject(gameObject);
            m_ClonObject.hideFlags = HideFlags.HideAndDontSave;
            // Cancel ActiveControl
            m_ClonObject.SetActive(false);

            // Remove Dup
            NcDuplicator durCom = m_ClonObject.GetComponent<NcDuplicator>();
            if (durCom != null)
                //				DestroyImmediate(durCom);
                Destroy(durCom);

            // this ----------------
            // remove OtherComponent
            Component[] coms = transform.GetComponents<Component>();
            for (int n = 0; n < coms.Length; n++)
                if ((coms[n] is Transform) == false && (coms[n] is NcDuplicator) == false)
                    Destroy(coms[n]);

            // removeChild
            RemoveAllChildObject(gameObject, false);
        }
        else return;
    }

    void CreateCloneObject()
    {
        if (m_ClonObject == null)
            return;
        GameObject createObj;

        if (goList.Count > m_nCreateCount)
        {
            createObj = goList[m_nCreateCount];
        }
        else
        {
            if (transform.parent == null)
                createObj = (GameObject)CreateGameObject(gameObject);
            else createObj = (GameObject)CreateGameObject(transform.parent.gameObject, m_ClonObject);
            goList.Add(createObj);
        }

        createObj.SetActive(true);

        var m_oldPosition = transform.position;
        // Random pos
        createObj.transform.position = new Vector3(Random.Range(-m_RandomRange.x, m_RandomRange.x) + m_oldPosition.x, Random.Range(-m_RandomRange.y, m_RandomRange.y) + m_oldPosition.y, Random.Range(-m_RandomRange.z, m_RandomRange.z) + m_oldPosition.z);

        // AddStartPos
        createObj.transform.position += m_AddStartPos;

        // m_AccumStartRot
        createObj.transform.localRotation = m_origionRot * Quaternion.Euler(m_AccumStartRot.x * m_nCreateCount, m_AccumStartRot.y * m_nCreateCount, m_AccumStartRot.z * m_nCreateCount);
        createObj.name = "clone " + m_nCreateCount;
        m_nCreateCount++;
        if (m_bInvoke)
        {
            if (m_nDuplicateCount <= m_nCreateCount)
                CancelInvoke("CreateCloneObject");
        }
    }

    // Event Function -------------------------------------------------------------------
    public override void OnUpdateEffectSpeed(float fSpeedRate, bool bRuntime)
    {
        m_fDuplicateTime /= fSpeedRate;

        if (bRuntime && m_ClonObject != null)
            NsEffectManager.AdjustSpeedRuntime(m_ClonObject, fSpeedRate);
    }
}