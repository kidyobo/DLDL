using System;
using UnityEngine;

public class CustomBehaviour : MonoBehaviour
{
    public Action onAwake = null;
    public Action onStart = null;
    public Action onReset = null;
    public Action<bool> onApplicationFocus = null;
    public Action<bool> onApplicationPause = null;
    public Action onApplicationQuit = null;
    public Action<Collision> onCollisionEnter = null;
    public Action<Collision> onCollisionStay = null;
    public Action<Collision> onCollisionExit = null;
    public Action<Collision2D> onCollisionEnter2D = null;
    public Action<Collision2D> onCollisionStay2D = null;
    public Action<Collision2D> onCollisionExit2D = null;
    public Action<ControllerColliderHit> onControllerColliderHit = null;
    public Action onDestroy = null;
    public Action onDisable = null;
    public Action onEnable = null;
    public Action<GameObject> onParticleCollision = null;
    public Action<Collider> onTriggerEnter = null;
    public Action<Collider> onTriggerStay = null;
    public Action<Collider> onTriggerExit = null;
    public Action<Collider2D> onTriggerEnter2D = null;
    public Action<Collider2D> onTriggerStay2D = null;
    public Action<Collider2D> onTriggerExit2D = null;


    [DonotWrap]
    [System.Serializable]
    public struct GameObjectPair
    {
        public string Name;
        public GameObject Value;
    }
    [DonotWrap]
    [System.Serializable]
    public struct Vector2Pair
    {
        public string Name;
        public Vector2 Value;
    }
    [DonotWrap]
    [System.Serializable]
    public struct Vector3Pair
    {
        public string Name;
        public Vector3 Value;
    }
    [DonotWrap]
    [System.Serializable]
    public struct QuaternionPair
    {
        public string Name;
        public Quaternion Value;
    }
    [DonotWrap]
    [System.Serializable]
    public struct StringPair
    {
        public string Name;
        public string Value;
    }
    [DonotWrap]
    [System.Serializable]
    public struct BoolPair
    {
        public string Name;
        public bool Value;
    }
    [DonotWrap]
    [System.Serializable]
    public struct NumberPair
    {
        public string Name;
        public double Value;
    }
    [DonotWrap]
    [System.Serializable]
    public struct RectOffsetPair
    {
        public string Name;
        public RectOffset Value;
    }


    [SerializeField]
    protected GameObjectPair[] objs = null;
    [SerializeField]
    protected Vector2Pair[] vector2s = null;
    [SerializeField]
    protected Vector3Pair[] vector3s = null;
    [SerializeField]
    protected QuaternionPair[] quaternions = null;
    [SerializeField]
    protected StringPair[] strings = null;
    [SerializeField]
    protected BoolPair[] bools = null;
    [SerializeField]
    protected NumberPair[] numbers = null;
    [SerializeField]
    protected RectOffsetPair[] rectoffsets = null;

    public double GetNumber(int index)
    {
        if (numbers == null)
            return 0;
        if (index < 0 || index >= numbers.Length)
            return 0;
        return numbers[index].Value;
    }
    public double GetNumber(string name)
    {
        return GetNumber(Array.FindIndex(numbers, s => s.Name == name));
    }

    public bool GetBool(int index)
    {
        if (bools == null)
            return false;
        if (index < 0 || index >= bools.Length)
            return false;
        return bools[index].Value;
    }
    public bool GetBool(string name)
    {
        return GetBool(Array.FindIndex(bools, s => s.Name == name));
    }

    public string GetString(int index)
    {
        if (strings == null)
            return "";
        if (index < 0 || index >= strings.Length)
            return "";
        return strings[index].Value;
    }
    public string GetString(string name)
    {
        return GetString(Array.FindIndex(strings, s => s.Name == name));
    }

    public GameObject GetGameObject(int index)
    {
        if (objs == null)
            return null;
        if (index < 0 || index >= objs.Length)
            return null;
        return objs[index].Value;
    }
    public GameObject GetGameObject(string name)
    {
        return GetGameObject(Array.FindIndex(objs, s => s.Name == name));
    }

    public Vector2 GetVector2(int index)
    {
        if (vector2s == null)
            return Vector2.zero;
        if (index < 0 || index >= vector2s.Length)
            return Vector2.zero;
        return vector2s[index].Value;
    }
    public Vector2 GetVector2(string name)
    {
        return GetVector2(Array.FindIndex(vector2s, s => s.Name == name));
    }

    public Vector3 GetVector3(int index)
    {
        if (vector3s == null)
            return Vector3.zero;
        if (index < 0 || index >= vector3s.Length)
            return Vector3.zero;
        return vector3s[index].Value;
    }
    public Vector3 GetVector3(string name)
    {
        return GetVector3(Array.FindIndex(vector3s, s => s.Name == name));
    }

    public Quaternion GetQuaternion(int index)
    {
        if (quaternions == null)
            return Quaternion.identity;
        if (index < 0 || index >= quaternions.Length)
            return Quaternion.identity;
        return quaternions[index].Value;
    }
    public Quaternion GetQuaternion(string name)
    {
        return GetQuaternion(Array.FindIndex(quaternions, s => s.Name == name));
    }

    public RectOffset GetRectOffset(int index)
    {
        if (rectoffsets == null)
            return new RectOffset(0, 0, 0, 0);
        if (index < 0 || index >= rectoffsets.Length)
            return new RectOffset(0, 0, 0, 0);
        return rectoffsets[index].Value;
    }
    public RectOffset GetRectOffset(string name)
    {
        return GetRectOffset(Array.FindIndex(rectoffsets, s => s.Name == name));
    }

    void Awake()
    {
        if (this.onAwake != null) this.onAwake();
    }
    void Start()
    {
        if (this.onStart != null) this.onStart();
    }
    void Reset()
    {
        if (this.onReset != null) this.onReset();
    }
    void OnApplicationFocus(bool focus)
    {
        if (this.onApplicationFocus != null) this.onApplicationFocus(focus);
    }
    void OnApplicationPause(bool pause)
    {
        if (this.onApplicationPause != null) this.onApplicationPause(pause);
    }
    void OnApplicationQuit()
    {
        if (this.onApplicationQuit != null) this.onApplicationQuit();
    }
    void OnCollisionEnter(Collision other)
    {
        if (this.onCollisionEnter != null) this.onCollisionEnter(other);
    }
    void OnCollisionStay(Collision other)
    {
        if (this.onCollisionStay != null) this.onCollisionStay(other);
    }
    void OnCollisionExit(Collision other)
    {
        if (this.onCollisionExit != null) this.onCollisionExit(other);
    }
    void OnCollisionEnter2D(Collision2D other)
    {
        if (this.onCollisionEnter2D != null) this.onCollisionEnter2D(other);
    }
    void OnCollisionStay2D(Collision2D other)
    {
        if (this.onCollisionStay2D != null) this.onCollisionStay2D(other);
    }
    void OnCollisionExit2D(Collision2D other)
    {
        if (this.onCollisionExit2D != null) this.onCollisionExit2D(other);
    }
    void OnControllerColliderHit(ControllerColliderHit hit)
    {
        if (this.onControllerColliderHit != null) this.onControllerColliderHit(hit);
    }
    void OnDestroy()
    {
        if (this.onDestroy != null) this.onDestroy();
    }
    void OnDisable()
    {
        if (this.onDisable != null) this.onDisable();
    }
    void OnEnable()
    {
        if (this.onEnable != null) this.onEnable();
    }
    void OnParticleCollision(GameObject go)
    {
        if (this.onParticleCollision != null) this.onParticleCollision(go);
    }
    void OnTriggerEnter(Collider other)
    {
        if (this.onTriggerEnter != null) this.onTriggerEnter(other);
    }
    void OnTriggerStay(Collider other)
    {
        if (this.onTriggerStay != null) this.onTriggerStay(other);
    }
    void OnTriggerExit(Collider other)
    {
        if (this.onTriggerExit != null) this.onTriggerExit(other);
    }
    void OnTriggerEnter2D(Collider2D other)
    {
        if (this.onTriggerEnter2D != null) this.onTriggerEnter2D(other);
    }
    void OnTriggerStay2D(Collider2D other)
    {
        if (this.onTriggerStay2D != null) this.onTriggerStay2D(other);
    }
    void OnTriggerExit2D(Collider2D other)
    {
        if (this.onTriggerExit2D != null) this.onTriggerExit2D(other);
    }
}

