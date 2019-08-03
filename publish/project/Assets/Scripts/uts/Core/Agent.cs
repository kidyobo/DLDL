namespace Uts
{
    public class Agent<T>
    {
        public T target = default(T);
        public Agent(T o)
        {
            target = o;
        }
        public override string ToString()
        {
            return target.ToString();
        }
    }
}
