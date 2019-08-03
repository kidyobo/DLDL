using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;


namespace Uts
{
    public class Environment
    {
        public IntPtr ptr = IntPtr.Zero;
    }

    public class Core
    {
        public static Environment env;
        public static string workspace;
        public static string ext;
        private static SafeRingQueue<IntPtr> unprotectJsValueQueue = new SafeRingQueue<IntPtr>(1024);

        public static void Init(string workspace, string ext)
        {
            Core.workspace = workspace;
            Core.ext = ext;
            unprotectJsValueQueue.Reset();
            Debug.Log("start jvm_create");
            env = new Environment();
            env.ptr = Native.jvm_create(Log, LogErr);
            Debug.Log("jvm_create ok!");
            MakeJsObjects.Init(env.ptr);
            InnerFunWrap.Register(env.ptr);
            Native.uts_net_init(env.ptr);
            Registers.Register(env.ptr);
            JsStructs.Init(env.ptr);
        }

        public static void Update()
        {
            if (env == null || env.ptr == IntPtr.Zero) return;
            while (!unprotectJsValueQueue.IsEmpty)
            {
                IntPtr jsValue = unprotectJsValueQueue.Pop();
                Native.jvm_unprotect(env.ptr, jsValue);
            }
            Native.uts_net_update();
        }

        public static void OnApplicationPause(bool pause)
        {
            if (pause)
            {
                Uts.Native.uts_net_pause();
            }
            else
            {
                Uts.Native.uts_net_resume();
            }
        }

        public static void Destroy()
        {
            if (env != null && env.ptr != IntPtr.Zero)
            {
                unprotectJsValueQueue.Clear();
                JsStructs.Destroy(env.ptr);
                ObjectsMgr.Destroy();
                Native.uts_net_destroy(env.ptr);
                Native.jvm_destroy(env.ptr);
                env.ptr = IntPtr.Zero;
            }
        }

        public static void UnprotectJsValue(IntPtr env, IntPtr jsValue)
        {
            if (jsValue != IntPtr.Zero)
            {
                unprotectJsValueQueue.Add(jsValue);
            }
        }

        public static bool CompareType(object utsObject, Type paramType)
        {
            if (utsObject == null)
            {
                return paramType.IsClass;
            }
            Type utsType = utsObject.GetType();
            if (utsType.IsArray)
            {
                //取出array第一个元素
                Array array = utsObject as Array;
                if (array.Length == 0)
                {
                    return paramType.IsArray;
                }
                if (paramType.IsArray)
                {
                    utsType = array.GetValue(0).GetType();
                    paramType = paramType.GetElementType();
                }
                else
                {
                    return false;
                }
            }
            if (utsType == typeof(double))
            {
                if (paramType.IsEnum)
                {
                    return true;
                }
                return paramType.IsPrimitive;
            }
            else
            {
                if (utsType == paramType)
                {
                    return true;
                }
                return utsType.IsSubclassOf(paramType);
            }
        }

        public static string Dump()
        {
            return ObjectsMgr.Dump();
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_log))]
        static void Log(string msg)
        {
            Debug.Log(msg);
        }

        [MonoPInvokeCallbackAttribute(typeof(jvm_log))]
        static void LogErr(string msg)
        {
            Debug.LogError(msg);
        }

        public static string ReadScript(string path)
        {
#if PUBLISH
            path = GetScriptPath(path);
            var parent = Path.GetDirectoryName(path);
            if (parent == "tsbytes")
            {
                var asset = ResLoader.LoadAsset(path);
                return (asset.Load(path) as TextAsset).text;
            }
            else
            {
                var asset = ResLoader.LoadAsset(parent);
                return (asset.Load(path) as TextAsset).text;
            }
#else
            return File.ReadAllText(GetScriptPath(path));
#endif
        }

        static string GetScriptPath(string relPath)
        {
            return workspace + relPath + ext;
        }
    }
}