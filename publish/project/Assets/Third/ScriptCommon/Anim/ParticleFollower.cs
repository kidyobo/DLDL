using UnityEngine;
using System.Collections;

public class ParticleFollower : MonoBehaviour
{
    ParticleSystem.EmissionModule[] cacheParticleEmission;
    ParticleSystem.MainModule cacheParticleMain;
    public static bool onlyMove = true;
    Vector3 cachePos = Vector3.zero;
    bool playEffect = true;
    /// <summary>
    /// 要跟随的目标
    /// </summary>
    [SerializeField]
    Transform _target = null;
    public Transform target
    {
        set
        {
            _target = value;
        }
        get
        {
            return _target;
        }
    }

    void Awake()
    {
        UnityEngine.ParticleSystem[] particleSystem = this.GetComponentsInChildren<UnityEngine.ParticleSystem>();
        this.cacheParticleMain = particleSystem[0].main;
        this.cacheParticleMain.startRotation3D = true;
        var len = particleSystem.Length;
        this.cacheParticleEmission = new ParticleSystem.EmissionModule[len];
        for (int i = 0; i < len; i++)
        {
            this.cacheParticleEmission[i] = particleSystem[i].emission;
        }
    }

    // Update is called once per frame
    void Update()
    {
        if (_target)
        {
            UnityEngine.Vector3 angles = _target.localRotation.eulerAngles;
            this.cacheParticleMain.startRotationY = angles.y * Mathf.PI / 180;

            if (onlyMove)
            {
                var pos = _target.position;
                if (pos == cachePos)
                {
                    if (playEffect)
                    {
                        playEffect = false;
                        for (int i = 0; i < this.cacheParticleEmission.Length; i++)
                        {
                            this.cacheParticleEmission[i].enabled = false;
                        }
                    }
                }
                else
                {
                    if (!playEffect)
                    {
                        playEffect = true;
                        for (int i = 0; i < this.cacheParticleEmission.Length; i++)
                        {
                            this.cacheParticleEmission[i].enabled = true;
                        }
                    }
                }
                cachePos = pos;
            }
        }
    }
}