public class IntervalChecker
{
    private float lastTime = 0;
    private float interval = 0;
    public IntervalChecker(float intervalSecond)
    {
        interval = intervalSecond;
    }
    public bool check()
    {
        if (UnityEngine.Time.realtimeSinceStartup - lastTime < interval)
        {
            return false;
        }
        else
        {
            lastTime = UnityEngine.Time.realtimeSinceStartup;
            return true;
        }
    }
}