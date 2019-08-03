// ----------------------------------------------------------------------------------
//
// FXMaker
// Created by ismoon - 2012 - ismoonto@gmail.com
//
// ----------------------------------------------------------------------------------


using UnityEngine;
using System.Collections;

public class FFAutoDeactiver : MonoBehaviour
{
    public float lifeTime = 1;
    private float startTime;
    void OnEnable()
    {
        startTime = Time.time;
    }
    void Update()
    {
        var time = Time.time - startTime;
        if (time >= lifeTime)
        {
            this.gameObject.SetActive(false);
        }
    }
}