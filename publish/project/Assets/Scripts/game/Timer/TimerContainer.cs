using System;
using System.Collections.Generic;
/// <summary>
/// 可整体运行的计时器容器类
/// </summary>
public class TimerContainer
{
    /// <summary>
    /// 计时器列表
    /// </summary>
    protected List<Timer> timerList = new List<Timer>(100);
    /// <summary>
    /// 计时器数量
    /// </summary>
    protected int count = 0;
    /// <summary>
    /// 计时器数量
    /// </summary>
    public int Count
    {
        get
        {
            return count;
        }
    }
    /// <summary>
    /// 更新计时器
    /// </summary>
    public virtual void Update()
    {
        if (count > 0)
        {
            int nowInMs = (int)Math.Round(UnityEngine.Time.realtimeSinceStartup * 1000);
            for (int i = count - 1; i >= 0; i--)
            {
                Timer timer = timerList[i];
                timer.Update(nowInMs);
                if (timer.Dead)
                {
                    timerList.RemoveAt(i);
                    timer.Stop();
                    timer.container = null;
                    count--;
                }
            }
        }
    }

    /// <summary>
    /// 加入一个新的计时器
    /// </summary>
    /// <param name="timer">要加入的计时器</param>
    public void Add(Timer timer)
    {
        timer.container = this;
        timerList.Add(timer);
        count++;
    }

    /// <summary>
    /// 清空顺序队列
    /// </summary>
    public void Clear()
    {
        for (int i = 0, length = timerList.Count; i < length; i++)
        {
            timerList[i].Stop();
        }
        timerList.Clear();
        count = 0;
    }
}