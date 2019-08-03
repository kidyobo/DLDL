#if TEST
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
public class TestRunnderEditor:Editor
{
    [MenuItem("FFTools/创建运动员观察器")]
    public static void CreateRunner()
    {
        var runner = new GameObject("looker");
        var camera = new GameObject("camera");
        camera.transform.SetParent(runner.transform, true);
        var cameraCom=camera.AddComponent<Camera>();
        cameraCom.tag = "MainCamera";
        cameraCom.fieldOfView = 35;
        cameraCom.transform.localPosition = new Vector3(0, 20.3f, -18.8f);
        cameraCom.transform.localRotation = Quaternion.Euler(45, 0, 0);
        cameraCom.allowHDR = false;
        cameraCom.allowMSAA = false;
        runner.AddComponent<TestRunner>();
    }
}
#endif