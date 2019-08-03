using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;

public class IosSdk : MonoBehaviour
{
#if UNITY_IOS
    //type表示功能分类(login,pay等),jsonpara为以json字串表示的一系列参数
    //ts调用ios_sdk全部通过该接口,具体实现全部通过通用SDK层去和各平台的SDK进行交互
    [DllImport("__Internal")]
    private static extern void CallSDKFunc(string type, string jsonpara);
#endif
    public static void IosCallSDkFunc(string type,string jsonpara) {
#if UNITY_IOS
        CallSDKFunc(type,jsonpara);
#endif
    }
#if UNITY_IOS
    [DllImport("__Internal")]
    private static extern void ActiveInitializeIosUI();
#endif
    public static void IosCallUIActiveInit() {
#if UNITY_IOS
       ActiveInitializeIosUI();
#endif
    }
#if UNITY_IOS
    //下面为到时人鱼用的调用c接口直接返回参数(同步操作),不需要unitySendMessage(异步操作)
    [DllImport("__Internal")]
    private static extern string GetValueBySdk(string type);
#endif
    public static string IosCallStringBySDK(string type)
    {
#if UNITY_IOS
        return GetValueBySdk(type);
#endif
        return "";
    }
    //统一ios消息回包机制
    static public System.Action<string> onIosSdkToTsMessage = null;
    [DonotWrap]
    void OcCallUnityBack(string jsonpara)
    {
        onIosSdkToTsMessage(jsonpara);
    }
}
