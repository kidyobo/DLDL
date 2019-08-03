using System.Threading;
/**
 * 无锁无GC环形线程安全队列
 */
namespace Uts
{
    public class SafeRingQueue<T>
    {
        private T[] queue;
        private int size;
        private int readpos;
        private int writepos;
        private int valid;
        public SafeRingQueue(int size)
        {
            this.size = size;
            queue = new T[size];
            readpos = writepos = 0;
            valid = 1;
        }
        public void Add(T obj)
        {
            if (valid == 0) return;
            while (IsFull)
            {
                if (valid == 0) return;
                Thread.Sleep(1);
            }
            queue[writepos] = obj;
            int newpos = (writepos + 1) % size;
            Interlocked.Exchange(ref writepos, newpos); // 原子操作 writepos = newpos
        }
        public bool IsEmpty
        {
            get {return readpos == writepos; } // 32位机器上读取32位是原子操作
        }
        public T Pop()
        {
            T rt = queue[readpos];
            int newpos = (readpos + 1) % size;
            Interlocked.Exchange(ref readpos, newpos); // 原子操作 readpos = newpos
            return rt;
        }
        public void Reset()
        {
            Interlocked.Exchange(ref valid, 1);
            Interlocked.Exchange(ref readpos, 0);
            Interlocked.Exchange(ref writepos, 0);
        }
        public void Clear()
        {
            Interlocked.Exchange(ref valid, 0);
            Interlocked.Exchange(ref readpos, 0);
            Interlocked.Exchange(ref writepos, 0);
        }
        private bool IsFull
        {
            get
            {
                int usedSize = (writepos - readpos + size) % size;
                return (size - usedSize - 1) == 0;
            }
        }
    }
}
