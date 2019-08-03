public class Singleton<T> where T : new()
{
    private static T _ins;
    private static readonly object sync = new object();
    protected Singleton() { }
    public static T ins
    {
        get
        {
            if (_ins != null)
                return _ins; 

            lock (sync)
            {
                if (_ins == null)
                {
                    _ins = new T();
                }
            }
            return _ins;
        }
    }
}