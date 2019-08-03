using System.Collections;
using System.Collections.Generic;
using UnityEngine;
//一些参数的设置修复类
public static class NsFixer {
    public static void EnableEmission(ParticleSystem ps, bool enable)
    {
        var emission = ps.emission;
        emission.enabled = enable;
    }
    public static void SetEmissionRateMul(ParticleSystem ps, float emissionRate)
    {
        var emission = ps.emission;
        emission.rateOverTime = emissionRate * emission.rateOverTime.constant;
    }
    public static void SetParticleMain(ParticleSystem ps, float startSize,float startLifeTime,float startSpeed)
    {
        var main = ps.main;
        main.startSize = startSize;
        main.startLifetime = startLifeTime;
        main.startSpeed = startSpeed;
    }
    public static void SetParticleMainMul(ParticleSystem ps, float startSize, float startLifeTime, float startSpeed)
    {
        var main = ps.main;
        main.startSize = startSize* main.startSize.constant;
        main.startLifetime = startLifeTime * main.startLifetime.constant;
        main.startSpeed = startSpeed * main.startSpeed.constant;
    }
}
