using System;
using System.Collections.Generic;
/// <summary>
/// 计时器对象类
/// </summary>
public sealed class Timer
{
    [DonotWrap]
    public TimerContainer container = null;
    /// <summary>
    /// 该计时器的名称
    /// </summary>
    public string Name
    {
        private set;
        get;
    }
    /// <summary>
    /// 该计时器是否已经死亡
    /// </summary>
    public bool Dead
    {
        private set;
        get;
    }

    /// <summary>
    /// 计时器的总时间，单位毫秒
    /// </summary>
    public int MaxTime
    {
        private set;
        get;
    }

    /// <summary>
    /// 计时器的剩余时间，单位毫秒
    /// </summary>
    public int LeftTime
    {
        private set;
        get;
    }

    /// <summary>
    /// 回调执行次数。
    /// </summary>
    public int CallCount
    {
        private set;
        get;
    }


    /// <summary>
    /// 回调执行次数。
    /// </summary>
    public int CallCountDelta
    {
        private set;
        get;
    }

    /// <summary>
    /// 计时器循环次数，0表示无限循环。
    /// </summary>
    private uint loop = 0;
    public uint Loop
    {
        get
        {
            return loop;
        }
    }

    private int lastUpdateInMs = 0;

    /// <summary>
    /// 计时器到期后的回调委托函数
    /// </summary>
    Action<Timer> callback = null;

    /// <summary>
    /// 计时器的目标间隔，单位毫秒
    /// </summary>
    public int TargetInterval
    {
        private set;
        get;
    }
    /// <summary>
    /// 计时器剩余间隔，单位毫秒
    /// </summary>
    int leftInterval = 0;
    /// <summary>
    /// 计时器指定间隔回调委托函数
    /// </summary>
    Action<Timer> intervalCallback = null;
    /// <summary>
    /// 初始化计时器
    /// </summary>
    /// <param name="time">计时器时间，单位毫秒</param>
    /// <param name="delay">计时器延时，单位毫秒</param>
    /// <param name="callback">回调函数，单位毫秒</param>
    public Timer(string name,int time, uint loop, Action<Timer> callback)
    {
        this.Name = name;
        this.LeftTime = time;
        this.MaxTime = time;

        this.callback = callback;
        this.loop = loop;
        this.lastUpdateInMs = (int)Math.Round(UnityEngine.Time.realtimeSinceStartup * 1000);
        root.timerContainer.Add(this);
    }
    /// <summary>
    /// 设置指定间隔回调
    /// </summary>
    /// <param name="interval">回调间隔，单位毫秒</param>
    /// <param name="intervalCallback">回调函数</param>
    public void SetIntervalCall(int interval, Action<Timer> intervalCallback)
    {
        if (interval > 0)
        {
            this.TargetInterval = interval;
            this.leftInterval = interval;
            this.intervalCallback = intervalCallback;
        }
        else
        {
            this.TargetInterval = 0;
            this.leftInterval = 0;
            this.intervalCallback = null;
        }
    }
    /// <summary>
    /// 重新设置计时器的时间
    /// </summary>
    /// <param name="time">时间</param>
    public void ResetTimer(int time, uint loop,System.Action<Timer> callback)
    {
        this.LeftTime = time;
        this.MaxTime = time;
        this.loop = loop;

        this.CallCount = 0;
        this.CallCountDelta = 0;

        this.Stop();
        this.callback = callback;
        this.Dead = false;
        this.lastUpdateInMs = (int)Math.Round(UnityEngine.Time.realtimeSinceStartup * 1000);
        if (container == null)
        {
            root.timerContainer.Add(this);
        }
    }

    /// <summary>
    /// 停止计时器
    /// </summary>
    public void Stop()
    {
        Dead = true;
        callback = null;
        intervalCallback = null;
    }

    /// <summary>
    ///更新计时器
    /// </summary>
    [DonotWrap]
    public void Update(int nowInMs)
    {
        int delta = nowInMs - this.lastUpdateInMs;
        this.lastUpdateInMs = nowInMs;

        if (!Dead)
        {
            //判断指定间隔回调是否已经开启
            if (intervalCallback != null)
            {
                if ((this.leftInterval -= delta) <= 0)
                {
                    this.leftInterval = (this.leftInterval % this.TargetInterval) + this.TargetInterval;
                    intervalCallback(this);
                }
            }

            //执行计时器
            if ((this.LeftTime -= delta) <= 0)
            {
                CallCountDelta = 1;
                if (this.MaxTime > 0)
                {
                    CallCountDelta = 1 + (-this.LeftTime) / this.MaxTime;
                }
                this.CallCount += CallCountDelta;

                if (0 == loop || this.CallCount < this.loop)
                {
                    if (this.MaxTime > 0)
                    {
                        this.LeftTime = (this.LeftTime % this.MaxTime) + this.MaxTime;
                    }
                    else
                    {
                        this.LeftTime = this.MaxTime;
                    }
                }
                else
                {
                    this.LeftTime = 0;
                    Dead = true;
                }
                //var time = UnityEngine.Time.realtimeSinceStartup;
                if (callback != null)
                {
                    Profiler.Ins.Push(this.Name);
                    callback(this);
                    Profiler.Ins.Pop();
                }
                //UnityEngine.Debug.Log("name:" + this.Name + "  time:" + (UnityEngine.Time.realtimeSinceStartup - time));
            }
        }
    }
}