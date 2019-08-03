using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
public class TestRunner : MonoBehaviour
{
#if UNITY_EDITOR

    /// <summary>
    /// 摄像机缓存对象
    /// </summary>
    Camera cacheCamera = null;
    Transform cacheTransform = null;
    /// <summary>
    /// 要跟随的目标
    /// </summary>
    [SerializeField]
    Transform _target = null;
    public Transform target
    {
        set
        {
            _target = value;
        }
        get
        {
            return _target;
        }
    }
    public float moveSpeed = 20;
    public string moveAni = "move";
    public string standAni = "stand";
    private Animator animator;
    private TweenPath cachePath = null;
    public GameObject testZhenFa;
    void Awake()
    {
        if (GameObject.Find("Root") != null)
        {
            return;
        }
        cacheTransform = this.transform;
        cacheCamera = Camera.main;
        var defaultPos = GameObject.Find("defaultPos");
        if (defaultPos == null)
        {
            Debug.LogError("找不到defaultPos，请先创建一个defaultPos");
            return;
        }
        if (_target == null)
        {
            Debug.LogWarning("由于没有指定模型，创建了一个空的runner，请指定target对象");
            _target = new GameObject("emptyRunner").transform;
        }
        else
        {
            var source = _target.gameObject;
            var copy = UnityEngine.Object.Instantiate<GameObject>(source);
            _target = copy.transform;
        }
        _target.position = defaultPos.transform.position;
        cachePath = _target.gameObject.AddComponent<TweenPath>();
        cachePath.enabled = false;
                animator = _target.GetComponent<Animator>();
        if (animator != null)
        {
            animator.Play(standAni);
        }
        //添加影子
        var shadow = UnityEditor.AssetDatabase.LoadAssetAtPath<GameObject>("Assets/AssetSources/misc/shadow.prefab");
        if (shadow != null)
        {
            GameObject.Instantiate(shadow, target, false);
        }
        if (testZhenFa != null)
        {
            GameObject.Instantiate(testZhenFa, target, false);
        }
        LateUpdate();
    }
    void OnDestroy()
    {
    }
    Vector2 vec = new Vector2();
    bool pressed = false;
    void LateUpdate()
    {
        if (_target == null)
        {
            return;
        }
        Vector3 position = _target.position;
        cacheTransform.position = position;

        if (Input.GetKeyUp(KeyCode.Mouse0))
        {
            this.cacheCamera.ScreenPointToRay(Input.mousePosition);
            RaycastHit hitInfo;
            if (Physics.Raycast(this.cacheCamera.ScreenPointToRay(Input.mousePosition), out hitInfo,100, 1 << 9))
            {
                var pos = hitInfo.point;
                var navPath = new NavMeshPath();
                UnityEngine.AI.NavMesh.CalculatePath(target.position, pos, -1, navPath);
                var corners = navPath.corners;
                if (corners.Length > 1)
                {
                    var newCorners = new Vector3[corners.Length - 1];
                    System.Array.Copy(corners, 1, newCorners, 0, corners.Length - 1);
                    TweenPath.Begin(target.gameObject, target.gameObject, moveSpeed, newCorners, 0, 0, 0);
                }
            }
        }


        vec.x = 0;
        vec.y = 0;
        if (Input.GetKey(KeyCode.W))
        {
            vec.y += 1000;
            pressed = true;
        }

        if (Input.GetKey(KeyCode.S))
        {
            vec.y -= 1000;
            pressed = true;
        }

        if (Input.GetKey(KeyCode.A))
        {
            vec.x -= 1000;
            pressed = true;
        }

        if (Input.GetKey(KeyCode.D))
        {
            vec.x += 1000;
            pressed = true;
        }
        if (vec == Vector2.zero)
        {
            if (pressed)
            {
                pressed = false;
                CheckEnd();
            }
        }
        else
        {
            CheckUpdate(vec);
        }

        if (cachePath.enabled)
        {
            if (animator != null)
            {
                animator.Play(moveAni);
            }
        }
        else
        {
            if (animator != null)
            {
                animator.Play(standAni);
            }
        }
    }
    private void CheckUpdate(Vector2 direction)
    {
        var normalized = direction.normalized * 2;
        var pos = this.cachePath.transform.position;
        var newPos = pos + new Vector3(normalized.x, 0, normalized.y);
        var navPath = new NavMeshPath();
        UnityEngine.AI.NavMesh.CalculatePath(pos, newPos, -1, navPath);
        if (navPath.corners.Length > 1)
        {
            var corners = navPath.corners;
            var newCorners = new Vector3[corners.Length - 1];
            System.Array.Copy(corners, 1, newCorners, 0, corners.Length - 1);
            TweenPath.Begin(target.gameObject, target.gameObject, moveSpeed, newCorners, 0, 0, 0);
        }
    }
    private void CheckEnd()
    {
        this.cachePath.enabled = false;
    }
#endif

}
