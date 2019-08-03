using System.Collections.Generic;

namespace Uts
{
    public class ContainerList
    {
        public List<object> objs = null;
        private int count = 0;
        public ContainerList(int cap) { objs = new List<object>(cap);  objs.Add(0); }
        public int Count { get { return count; } }
        public int Capacity { get { return objs.Count; } }
        public int Push(object obj)
        {
            count++;
            int freeidx = (int)objs[0];
            int index = freeidx;
            if (freeidx == 0)
            {
                objs.Add(obj);
                index = objs.Count - 1;
            }
            else
            {
                objs[0] = objs[freeidx];
                objs[freeidx] = obj;
            }
            return index;
        }
        public void Pop(int refidx)
        {
            count--;
            if (count < 0)
            {
                UnityEngine.Debug.LogError("count < 0;");
                return;
            }
            objs[refidx] = objs[0];
            objs[0] = refidx;
        }
        public void Clear()
        {
            objs.Clear();
            objs.Add(0);
            count = 0;
        }
    }
}