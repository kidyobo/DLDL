using UnityEngine;

public class SmallmapCreater : MonoBehaviour
{
#if UNITY_EDITOR
    public string targetPath = "AssetSources/map/smallMap";
    public int width = 639;
    public int height = 445;
    public float imageScale = 1;
    public float cubeScale = 0.2f;
    void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.yellow;
        var bounds = new Bounds();
        var width = this.width * cubeScale;
        var height = this.height * cubeScale;
        bounds.center = new Vector3(width, 0, height);
        bounds.size = new Vector3(width * 2, 0, height * 2);
        Gizmos.DrawWireCube(bounds.center, bounds.size);
    }
#endif
}