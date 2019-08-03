using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
[CustomEditor(typeof(SmallmapCreater))]
public class SmallmapCreaterEditor : Editor
{
    public override void OnInspectorGUI()
    {
#if TEST
        base.OnInspectorGUI();
        if (GUILayout.Button("生成"))
        {
            var com = target as SmallmapCreater;
            if (com.imageScale * com.width > 10000 || com.height * com.imageScale > 10000)
            {
                UnityEngine.Debug.LogWarning("目标生成的图片超过了1W像素，请检查");
                return;
            }
            //camera
            var cameraObj = new GameObject("sc");
            cameraObj.transform.localRotation = Quaternion.Euler(90, 0, 0);
            cameraObj.transform.localPosition = new Vector3(com.cubeScale * com.height * com.width / (float)com.height, 500, com.cubeScale * com.height);
            var camera = cameraObj.AddComponent<Camera>();
            camera.orthographic = true;
            camera.orthographicSize = com.cubeScale * com.height;
            camera.depth = 2;
            camera.aspect= com.width/(float)com.height;
             RenderTexture rt = new RenderTexture((int)(com.width* com.imageScale),(int)(com.height* com.imageScale), 2);
            camera.targetTexture = rt;
            Texture2D screenShot = new Texture2D((int)(com.width* com.imageScale),(int)(com.height* com.imageScale), TextureFormat.RGB24, false);
            camera.Render();
            RenderTexture.active = rt;
            screenShot.ReadPixels(new Rect(0, 0, (int)(com.width* com.imageScale),(int)(com.height* com.imageScale)), 0, 0);
            camera.targetTexture = null;
            RenderTexture.active = null;
            UnityEngine.Object.DestroyImmediate(rt);
            byte[] bytes = screenShot.EncodeToPNG();
            var sceneName = System.IO.Path.GetFileNameWithoutExtension(UnityEngine.SceneManagement.SceneManager.GetActiveScene().name);
            string filename = Application.dataPath + "/" + com.targetPath + "/" + sceneName + ".png";
            var path = System.IO.Path.GetDirectoryName(filename);
            if (!System.IO.Directory.Exists(path))
            {
                System.IO.Directory.CreateDirectory(path);
            }
            System.IO.File.WriteAllBytes(filename, bytes);
            System.GC.Collect();
            GameObject.DestroyImmediate(cameraObj);
            AssetDatabase.Refresh(ImportAssetOptions.Default);
            AssetDatabase.SaveAssets();
        }
#endif
    }
}