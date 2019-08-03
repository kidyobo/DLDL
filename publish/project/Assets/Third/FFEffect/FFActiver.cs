using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFActiver : FFTweenBase
{
    public List<GameObject> opObjects = new List<GameObject>();
    private Vector3[] opVectors = null;
    public bool randomPositionX = false;
    public bool randomPositionY = false;
    public bool randomPositionZ = false;
    public float randomRange = 1;
    public float randomRangeOffset = 1;
    protected override void FFEnable()
    {
        bool copyPosition = false;
        if (opVectors == null)
        {
            opVectors = new Vector3[opObjects.Count];
            copyPosition = true;
        }
        for (int i = 0, len = opObjects.Count; i < len; i++)
        {
            var op = opObjects[i];
            if (op != null)
            {
                if (op.activeSelf)
                {
                    op.SetActive(false);
                }
                if (copyPosition)
                {
                    opVectors[i] = op.transform.localPosition;
                }
            }
        }
    }

    protected override void FFUpdate(float eval)
    {
        var index = Mathf.FloorToInt(eval * opObjects.Count);
        if (index >= opObjects.Count)
        {
            index = opObjects.Count - 1;
        }
        for (int i = 0; i <= index; i++)
        {
            var obj = opObjects[i];
            if (obj != null && !obj.activeSelf)
            {
                var xvalue = randomPositionX ? Random.Range(-randomRange, randomRange) : 0;
                var yvalue = randomPositionY ? Random.Range(-randomRange, randomRange) : 0;
                var zvalue = randomPositionZ ? Random.Range(-randomRange, randomRange) : 0;
                if (randomPositionX)
                {
                    if (xvalue > 0)
                    {
                        xvalue += randomRangeOffset;
                    }
                    else
                    {
                        xvalue -= randomRangeOffset;
                    }
                }
                if (randomPositionY)
                {
                    if (yvalue > 0)
                    {
                        yvalue += randomRangeOffset;
                    }
                    else
                    {
                        yvalue -= randomRangeOffset;
                    }
                }
                if (randomPositionZ)
                {
                    if (zvalue > 0)
                    {
                        zvalue += randomRangeOffset;
                    }
                    else
                    {
                        zvalue -= randomRangeOffset;
                    }
                }

                obj.transform.localPosition = opVectors[i] + new Vector3(xvalue
                    , yvalue
                    , zvalue
                   );
                obj.SetActive(true);
            }
        }
    }
}