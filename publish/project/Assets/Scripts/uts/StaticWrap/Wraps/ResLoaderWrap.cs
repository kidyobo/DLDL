using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class ResLoaderWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new ResLoader();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Exist_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = ResLoader.Exist(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr IsDownloaded_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = ResLoader.IsDownloaded(p0);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr PrintAllAssets_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				ResLoader.PrintAllAssets();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CreateAssetsRequest_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (AssetPriority)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = ToCsObjects.ToArray<string>(context, Native.jvm_get_arg(args, 1));
				var ret = ResLoader.CreateAssetsRequest(p0, p1);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CreateDownloadRequest_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (AssetPriority)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = ToCsObjects.ToArray<string>(context, Native.jvm_get_arg(args, 1));
				var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
				var ret = ResLoader.CreateDownloadRequest(p0, p1, p2);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CreateAssetRequest_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (AssetPriority)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				var ret = ResLoader.CreateAssetRequest(p0, p1);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr BeginAssetRequest_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (AssetRequest)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (System.Action<AssetRequest>)Uts.DelegateUtil.CreateDelegate<AssetRequest, System.Action<AssetRequest>>(context, Native.jvm_get_arg(args, 1));
				var ret = ResLoader.BeginAssetRequest(p0, p1);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr BeginDownloadRequest_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (DownloadRequest)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (System.Action<DownloadRequest>)Uts.DelegateUtil.CreateDelegate<DownloadRequest, System.Action<DownloadRequest>>(context, Native.jvm_get_arg(args, 1));
				var ret = ResLoader.BeginDownloadRequest(p0, p1);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CreateUrlAssetRequest_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UrlAssetType)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
				var ret = ResLoader.CreateUrlAssetRequest(p0, p1, p2);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr BeginUrlAssetRequest_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UrlAssetRequest)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (System.Action<UrlAssetRequest>)Uts.DelegateUtil.CreateDelegate<UrlAssetRequest, System.Action<UrlAssetRequest>>(context, Native.jvm_get_arg(args, 1));
				var ret = ResLoader.BeginUrlAssetRequest(p0, p1);
				return Native.jvm_make_boolean(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetAssetLocalPath_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = ResLoader.GetAssetLocalPath(p0);
				return Native.jvm_make_string(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LoadAsset_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = ResLoader.LoadAsset(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LoadTextFromFullUrl_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (System.Action<string,string>)Uts.DelegateUtil.CreateDelegate<string, string, System.Action<string,string>>(context, Native.jvm_get_arg(args, 1));
				ResLoader.LoadTextFromFullUrl(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr LoadTextFromFullUrlByPost_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var p1 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 1));
				var p2 = (System.Action<string,string>)Uts.DelegateUtil.CreateDelegate<string, string, System.Action<string,string>>(context, Native.jvm_get_arg(args, 2));
				ResLoader.LoadTextFromFullUrlByPost(p0, p1, p2);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ReleaseAsset_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				if (Uts.Core.CompareType(vp0, typeof(string))) {
					var p0 = (string)vp0;
					var ret = ResLoader.ReleaseAsset(p0);
					return Native.jvm_make_boolean(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(Asset))) {
					var p0 = (Asset)vp0;
					var ret = ResLoader.ReleaseAsset(p0);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ClearMemoryInternal_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 0));
				ResLoader.ClearMemoryInternal(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ClearMemory_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 1));
				ResLoader.ClearMemory(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetAllAssetBundleNameList_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var ret = ResLoader.GetAllAssetBundleNameList();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetAssetBundleNameList_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = ToCsObjects.ToArray<string>(context, Native.jvm_get_arg(args, 0));
				var ret = ResLoader.GetAssetBundleNameList(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ValidStringList_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = ToCsObjects.ToArray<string>(context, Native.jvm_get_arg(args, 0));
				var ret = ResLoader.ValidStringList(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr isPublishGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_boolean(context, ResLoader.isPublish);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr assetbundlePathConfigNameGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_string(context, ResLoader.assetbundlePathConfigName);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr isRemoteGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_boolean(context, ResLoader.isRemote);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr isRemoteSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				ResLoader.isRemote = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr clearAllAssetsOnLoadGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_boolean(context, ResLoader.clearAllAssetsOnLoad);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr clearAllAssetsOnLoadSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				ResLoader.clearAllAssetsOnLoad = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr urlAssetsGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, ResLoader.urlAssets);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr urlAssetsNoCacheGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, ResLoader.urlAssetsNoCache);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr assetbundleVersionGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(ResLoader.assetbundleVersion));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr isCleaningGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_boolean(context, ResLoader.isCleaning);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(ResLoader);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "isPublish", isPublishGetter_S, null);
			Native.jvm_reg_static_property(env, "assetbundlePathConfigName", assetbundlePathConfigNameGetter_S, null);
			Native.jvm_reg_static_property(env, "isRemote", isRemoteGetter_S, isRemoteSetter_S);
			Native.jvm_reg_static_property(env, "clearAllAssetsOnLoad", clearAllAssetsOnLoadGetter_S, clearAllAssetsOnLoadSetter_S);
			Native.jvm_reg_static_property(env, "urlAssets", urlAssetsGetter_S, null);
			Native.jvm_reg_static_property(env, "urlAssetsNoCache", urlAssetsNoCacheGetter_S, null);
			Native.jvm_reg_static_property(env, "assetbundleVersion", assetbundleVersionGetter_S, null);
			Native.jvm_reg_static_property(env, "isCleaning", isCleaningGetter_S, null);
			Native.jvm_reg_static_function(env, "Exist", Exist_S);
			Native.jvm_reg_static_function(env, "IsDownloaded", IsDownloaded_S);
			Native.jvm_reg_static_function(env, "PrintAllAssets", PrintAllAssets_S);
			Native.jvm_reg_static_function(env, "CreateAssetsRequest", CreateAssetsRequest_S);
			Native.jvm_reg_static_function(env, "CreateDownloadRequest", CreateDownloadRequest_S);
			Native.jvm_reg_static_function(env, "CreateAssetRequest", CreateAssetRequest_S);
			Native.jvm_reg_static_function(env, "BeginAssetRequest", BeginAssetRequest_S);
			Native.jvm_reg_static_function(env, "BeginDownloadRequest", BeginDownloadRequest_S);
			Native.jvm_reg_static_function(env, "CreateUrlAssetRequest", CreateUrlAssetRequest_S);
			Native.jvm_reg_static_function(env, "BeginUrlAssetRequest", BeginUrlAssetRequest_S);
			Native.jvm_reg_static_function(env, "GetAssetLocalPath", GetAssetLocalPath_S);
			Native.jvm_reg_static_function(env, "LoadAsset", LoadAsset_S);
			Native.jvm_reg_static_function(env, "LoadTextFromFullUrl", LoadTextFromFullUrl_S);
			Native.jvm_reg_static_function(env, "LoadTextFromFullUrlByPost", LoadTextFromFullUrlByPost_S);
			Native.jvm_reg_static_function(env, "ReleaseAsset", ReleaseAsset_S);
			Native.jvm_reg_static_function(env, "ClearMemoryInternal", ClearMemoryInternal_S);
			Native.jvm_reg_static_function(env, "ClearMemory", ClearMemory_S);
			Native.jvm_reg_static_function(env, "GetAllAssetBundleNameList", GetAllAssetBundleNameList_S);
			Native.jvm_reg_static_function(env, "GetAssetBundleNameList", GetAssetBundleNameList_S);
			Native.jvm_reg_static_function(env, "ValidStringList", ValidStringList_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "ResLoader", MonoBehaviourWrap.jsClass, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(ResLoader), jsClass);
		}
	}
}
