using System.Collections.Generic;
class SafeQueue<T>
{
    private Queue<T> queue = new Queue<T>();
    public void Enqueue(T item)
    {
        lock (queue) { queue.Enqueue(item); }
    }
    public int Count
    {
        get { lock (queue) { return queue.Count; } }
    }
    public T Dequeue()
    {
        lock (queue) { return queue.Dequeue(); }
    }
    public void Clear()
    {
        lock (queue) { queue.Clear(); }
    }
}