using UnityEngine;
using System.Collections.Generic;
/// <summary>
/// 摄像机跟随，请将此对象挂到摄像机上使用
/// </summary>
public class UnitFollower : MonoBehaviour
{
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
    /// <summary>
    /// Y轴偏移
    /// </summary>
    public float yOffset = 0;
    List<Quake> quakes = new List<Quake>();
    void Awake()
    {
        cacheTransform = this.transform;
        LateUpdate();
    }
    void LateUpdate()
    {
        if (_target == null)
        {
            return;
        }

        Vector3 position = _target.position;
        position.z += yOffset;

        var quakeSize = quakes.Count;
        if (quakeSize > 0)
        {
            Vector3 offset = new Vector3();
            for (int i = quakeSize - 1; i >= 0; i--)
            {
                var quake = quakes[i];
                if (quake.curve != null)
                {
                    offset += quake.quakeSize * quake.curve.Evaluate(quake.timeline / quake.quakeTime) * quake.quakeV3;
                }
                quake.timeline += Time.deltaTime;
                if (quake.timeline > quake.quakeTime)
                {
                    quakes.RemoveAt(i);
                    Quake.quakeStack.Push(quake);
                }
            }
            position = position + offset;
        }
        cacheTransform.position = position;
    }
    public void Shake(QuakeDirection direction, float quakeTime, float quakeSize, AnimationCurve curve)
    {
        Quake quake = null;
        if (Quake.quakeStack.Count > 0)
        {
            quake = Quake.quakeStack.Pop();
        }
        else
        {
            quake = new Quake();
        }
        quake.timeline = 0;
        quake.quakeSize = quakeSize;
        quake.quakeTime = quakeTime;
        quake.curve = curve;
        switch (direction)
        {
            case QuakeDirection.Left:
                quake.quakeV3 = new Vector3(-1, 0, 0);
                break;
            case QuakeDirection.Right:
                quake.quakeV3 = new Vector3(1, 0, 0);
                break;
            case QuakeDirection.Up:
                quake.quakeV3 = new Vector3(0, 0, 1);
                break;
            case QuakeDirection.Down:
                quake.quakeV3 = new Vector3(0, 0, -1);
                break;
            case QuakeDirection.LeftUp:
                quake.quakeV3 = new Vector3(-1, 0, 1);
                break;
            case QuakeDirection.LeftDown:
                quake.quakeV3 = new Vector3(-1, 0, -1);
                break;
            case QuakeDirection.RightUp:
                quake.quakeV3 = new Vector3(1, 0, 1);
                break;
            case QuakeDirection.RightDown:
                quake.quakeV3 = new Vector3(1, 0, -1);
                break;
        }
        quakes.Add(quake);
    }
    public void ClearQuakes()
    {
        var quakeSize = quakes.Count;
        if (quakeSize > 0)
        {
            for (int i = quakeSize - 1; i >= 0; i--)
            {
                Quake.quakeStack.Push(quakes[i]);
            }
        }
        quakes.Clear();
    }
}
class Quake
{
    public static Stack<Quake> quakeStack = new Stack<Quake>();
    public float quakeSize;
    public float quakeTime;
    public AnimationCurve curve;
    public float timeline;
    public Vector3 quakeV3;
}
public enum QuakeDirection
{
    Left,
    Right,
    Up,
    Down,
    LeftUp,
    LeftDown,
    RightUp,
    RightDown,
}