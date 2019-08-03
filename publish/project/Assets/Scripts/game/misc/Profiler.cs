using System;
using System.Collections.Generic;
using System.Text;

class ProfilerNode
{
    public string name = "";
    public int callTimes = 0;
    public int maxCallTimes = 0;
    public float lastTime = 0;
    public float timeConsuming = 0;
    public float maxTimeConsuming = 0;
    public ProfilerNode parent = null;
    public List<ProfilerNode> children = new List<ProfilerNode>();
}

public class Profiler : Singleton<Profiler>
{
    private bool first = true;
    private ProfilerNode root;
    private ProfilerNode curNode;
    private StringBuilder builder;
    private IntervalChecker intervalChecker;
    private int maxLevel = 10;

    //for ts wrap
    public static Profiler Ins
    {
        get { return ins; }
    }

    [DonotWrap]
    public Profiler()
    {
        this.root = new ProfilerNode();
        this.curNode = this.root;
        this.builder = new StringBuilder();
        this.intervalChecker = new IntervalChecker(1);
    }

    public void Push(string nodeName)
    {
        if (OutPutPanel.ins.canProfiler)
        {
            this.curNode = this.GetNode(nodeName);
            this.curNode.callTimes++;
            this.curNode.lastTime = UnityEngine.Time.realtimeSinceStartup;
        }
    }

    public void Pop()
    {
        if (OutPutPanel.ins.canProfiler)
        {
            if (this.curNode.parent == null)
            {
                Reset();
                return;
            }
            this.curNode.timeConsuming += (UnityEngine.Time.realtimeSinceStartup - this.curNode.lastTime);
            if (this.curNode.timeConsuming > this.curNode.maxTimeConsuming && !this.first)
                this.curNode.maxTimeConsuming = this.curNode.timeConsuming;
            if (this.curNode.callTimes > this.curNode.maxCallTimes && !this.first)
                this.curNode.maxCallTimes = this.curNode.callTimes;
            this.curNode = this.curNode.parent;
        }
    }

    [DonotWrap]
    public string Dump()
    {
        if (!intervalChecker.check())
            return null;

        this.builder.Length = 0;
        TravelNodes(this.root, builder, -1);
        string s = builder.ToString();
        ClearNodes(this.root);
        this.first = false;
        return s;
    }

    [DonotWrap]
    public void Reset()
    {
        this.root = new ProfilerNode();
        this.curNode = this.root;
    }

    [DonotWrap]
    public void SetLevel(int level)
    {
        maxLevel = level;
    }

    private ProfilerNode GetNode(string nodeName)
    {
        ProfilerNode child = null;
        for (int i = 0, n = this.curNode.children.Count; i < n; i++)
        {
            child = this.curNode.children[i];
            if (child.name == nodeName)
                return child;
        }
        child = new ProfilerNode();
        child.name = nodeName;
        child.parent = this.curNode;
        this.curNode.children.Add(child);
        return child;
    }

    private void TravelNodes(ProfilerNode node, StringBuilder builder, int level)
    {
        if (level >= maxLevel)
            return;

        for (int i = 0; i < level; i++)
            builder.Append(". ");
        if (level > -1)
            builder.AppendFormat("[{0}] cnt:{1}, time:{2:0.#}, maxc:{3}, maxt:{4:0.#}\n", node.name, node.callTimes, node.timeConsuming * 1000, node.maxCallTimes, node.maxTimeConsuming * 1000);

        for (int i = 0, n = node.children.Count; i < n; i++)
        {
            TravelNodes(node.children[i], builder, level + 1);
        }
    }

    private void ClearNodes(ProfilerNode node)
    {
        node.callTimes = 0;
        node.timeConsuming = 0;
        for (int i = 0, n = node.children.Count; i < n; i++)
        {
            ClearNodes(node.children[i]);
        }
    }

    private void ResetNodes(ProfilerNode node)
    {
        node.callTimes = 0;
        node.timeConsuming = 0;
        node.maxCallTimes = 0;
        node.maxTimeConsuming = 0;
        for (int i = 0, n = node.children.Count; i < n; i++)
        {
            ResetNodes(node.children[i]);
        }
    }
}