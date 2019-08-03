using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class Logo : MonoBehaviour {
	// Use this for initialization
	void Start () {
        float s = Time.realtimeSinceStartup;
        OutPutPanel.ins.PreLoadUIRes();
        OutPutPanel.ins.Register();
        BuildinAssetManager.Load();
        Debug.Log("ChangeScene to root:" + (Time.realtimeSinceStartup - s));
        ChangeScene();
        //this.Invoke("FadeOut", 10f);
        //this.Invoke("ChangeScene", 10f);
	}
    void FadeOut()
    {
        this.GetComponent<RawImage>().CrossFadeAlpha(0, 1, false);
    }

    void ChangeScene()
    {
        UnityEngine.SceneManagement.SceneManager.LoadScene("root");
    }
}
