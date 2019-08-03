using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenAudioVolume : FFTweenBase
{
    public float from = 0;
    public float to = 1;
    private AudioSource audioSource;
    public string matName = "";
    protected override void FFEnable()
    {
        if (audioSource == null)
        {
            audioSource = GetComponent<AudioSource>();
        }
        audioSource.volume = from;
    }

    protected override void FFUpdate(float eval)
    {
        audioSource.volume = Mathf.LerpUnclamped(from, to, eval);
    }
}
