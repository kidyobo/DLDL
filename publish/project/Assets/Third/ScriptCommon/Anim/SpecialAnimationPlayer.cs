using UnityEngine;
using System.Collections.Generic;

public class SpecialAnimationPlayer : MonoBehaviour
{
    public string functionName = null;
    public string[] funcParams = null;
#if PLAY_CS
    private System.Action lateCall = null;
    // Use this for initialization
    void Awake()
    {
        this.Invoke(functionName,0);
    }
    void ActiveChildren()
    {
        var count = transform.childCount;
        foreach (Transform t in transform)
        {
            t.gameObject.SetActive(false);
        }
        if (count == 0)
        {
            return;
        }
        this.Invoke("LateCall", 0);
        int index = 0;
        lateCall = () =>
        {
            transform.GetChild(index).gameObject.SetActive(true);
            index++;
            if (index < count)
            {
                this.Invoke("LateCall", GetFloat(0));
            }
            else
            {
                lateCall = null;
            }
        };
    }
    void RandomActiveChildren()
    {
        List<Transform> transformList = new List<Transform>();
        foreach (Transform t in transform)
        {
            t.gameObject.SetActive(false);
            transformList.Add(t);
        }
        if (transformList.Count == 0)
        {
            return;
        }
        this.Invoke("LateCall", 0);
        lateCall = () =>
        {
            var random = Random.Range(0, transformList.Count);

            transformList[random].gameObject.SetActive(true);
            transformList.RemoveAt(random);
            if (transformList.Count > 0)
            {
                this.Invoke("LateCall", GetFloat(0));
            }
            else
            {
                lateCall = null;
            }
        };
    }



    void LateCall()
    {
        if(lateCall!=null)
            lateCall();
    }
#endif


    public double GetDouble(int index)
    {
        if (funcParams == null || funcParams.Length <= index)
        {
            return 0;
        }
        double value = 0;
        double.TryParse(funcParams[index], out value);
        return value;
    }
    public float GetFloat(int index)
    {
        if (funcParams == null || funcParams.Length <= index)
        {
            return 0;
        }
        float value = 0;
        float.TryParse(funcParams[index], out value);
        return value;
    }

    public string GetString(int index)
    {
        if (funcParams == null || funcParams.Length <= index)
        {
            return "";
        }
        return funcParams[index];
    }
}