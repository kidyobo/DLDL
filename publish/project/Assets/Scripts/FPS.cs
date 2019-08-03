using UnityEngine;
public class FPS : MonoBehaviour
{
    public float interval = 0.3f;
    public Rect guiRect = new Rect(200, 40, 100, 30);
    public int fontSize = 25;
    public string color = "FFFFFF";
    public bool showGUI = true;
    private float lastInterval;
    private int frames = 0;
    public int fps
    {
        private set;
        get;
    }
    GUIStyle style;
    void Start()
    {
        lastInterval = Time.realtimeSinceStartup;
        frames = 0;
        style = new GUIStyle();
        style.fontSize = fontSize;
    }
    void Update()
    {
        ++frames;
        float timeNow = Time.realtimeSinceStartup;
        if (timeNow >= lastInterval + interval)
        {
            fps = (int)(frames / (timeNow - lastInterval));
            frames = 0;
            lastInterval = timeNow;
        }
    }
    void OnGUI()
    {
        if (showGUI)
        {
            style.richText = true;
            GUI.Label(guiRect, string.Format("<color=#{0}>{1}</color>", color, fps), style);
        }
    }
}