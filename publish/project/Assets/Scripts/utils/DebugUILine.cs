﻿using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class DebugUILine : MonoBehaviour {

    // Use this for initialization
    static Vector3[] fourCorners = new Vector3[4];
    void OnDrawGizmos() {
        foreach (MaskableGraphic g in GameObject.FindObjectsOfType<MaskableGraphic>()) {
            if (g.raycastTarget) {
                RectTransform rectTransform = g.transform as RectTransform;
                rectTransform.GetWorldCorners(fourCorners);
                Gizmos.color = Color.yellow;
                for (int i = 0; i < 4; i++) {
                    Gizmos.DrawLine(fourCorners[i],fourCorners[(i+1)%4]);
                }
            }
        }
    }


	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
