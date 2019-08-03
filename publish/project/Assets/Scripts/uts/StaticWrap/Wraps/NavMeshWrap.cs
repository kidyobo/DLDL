using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class NavMeshWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Raycast_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
				var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
				if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.AI.NavMeshHit>)) && Uts.Core.CompareType(vp3, typeof(int))) {
					var p0 = (UnityEngine.Vector3)vp0;
					var p1 = (UnityEngine.Vector3)vp1;
					var p2 = (Agent<UnityEngine.AI.NavMeshHit>)vp2;
					var p3 = (int)(double)vp3;
					var ret = UnityEngine.AI.NavMesh.Raycast(p0, p1, out p2.target, p3);
					return Native.jvm_make_boolean(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.AI.NavMeshHit>)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.AI.NavMeshQueryFilter))) {
					var p0 = (UnityEngine.Vector3)vp0;
					var p1 = (UnityEngine.Vector3)vp1;
					var p2 = (Agent<UnityEngine.AI.NavMeshHit>)vp2;
					var p3 = (UnityEngine.AI.NavMeshQueryFilter)vp3;
					var ret = UnityEngine.AI.NavMesh.Raycast(p0, p1, out p2.target, p3);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CalculatePath_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
				var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
				if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(int)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.AI.NavMeshPath))) {
					var p0 = (UnityEngine.Vector3)vp0;
					var p1 = (UnityEngine.Vector3)vp1;
					var p2 = (int)(double)vp2;
					var p3 = (UnityEngine.AI.NavMeshPath)vp3;
					var ret = UnityEngine.AI.NavMesh.CalculatePath(p0, p1, p2, p3);
					return Native.jvm_make_boolean(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.AI.NavMeshQueryFilter)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.AI.NavMeshPath))) {
					var p0 = (UnityEngine.Vector3)vp0;
					var p1 = (UnityEngine.Vector3)vp1;
					var p2 = (UnityEngine.AI.NavMeshQueryFilter)vp2;
					var p3 = (UnityEngine.AI.NavMeshPath)vp3;
					var ret = UnityEngine.AI.NavMesh.CalculatePath(p0, p1, p2, p3);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr FindClosestEdge_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
				if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.AI.NavMeshHit>)) && Uts.Core.CompareType(vp2, typeof(int))) {
					var p0 = (UnityEngine.Vector3)vp0;
					var p1 = (Agent<UnityEngine.AI.NavMeshHit>)vp1;
					var p2 = (int)(double)vp2;
					var ret = UnityEngine.AI.NavMesh.FindClosestEdge(p0, out p1.target, p2);
					return Native.jvm_make_boolean(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.AI.NavMeshHit>)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.AI.NavMeshQueryFilter))) {
					var p0 = (UnityEngine.Vector3)vp0;
					var p1 = (Agent<UnityEngine.AI.NavMeshHit>)vp1;
					var p2 = (UnityEngine.AI.NavMeshQueryFilter)vp2;
					var ret = UnityEngine.AI.NavMesh.FindClosestEdge(p0, out p1.target, p2);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SamplePosition_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
				var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
				var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
				var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
				if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.AI.NavMeshHit>)) && Uts.Core.CompareType(vp2, typeof(float)) && Uts.Core.CompareType(vp3, typeof(int))) {
					var p0 = (UnityEngine.Vector3)vp0;
					var p1 = (Agent<UnityEngine.AI.NavMeshHit>)vp1;
					var p2 = (float)(double)vp2;
					var p3 = (int)(double)vp3;
					var ret = UnityEngine.AI.NavMesh.SamplePosition(p0, out p1.target, p2, p3);
					return Native.jvm_make_boolean(context, ret);
				} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp1, typeof(Agent<UnityEngine.AI.NavMeshHit>)) && Uts.Core.CompareType(vp2, typeof(float)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.AI.NavMeshQueryFilter))) {
					var p0 = (UnityEngine.Vector3)vp0;
					var p1 = (Agent<UnityEngine.AI.NavMeshHit>)vp1;
					var p2 = (float)(double)vp2;
					var p3 = (UnityEngine.AI.NavMeshQueryFilter)vp3;
					var ret = UnityEngine.AI.NavMesh.SamplePosition(p0, out p1.target, p2, p3);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetAreaCost_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var p1 = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
				UnityEngine.AI.NavMesh.SetAreaCost(p0, p1);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetAreaCost_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.AI.NavMesh.GetAreaCost(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetAreaFromName_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (string)Native.jvm_tostring(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.AI.NavMesh.GetAreaFromName(p0);
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CalculateTriangulation_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var ret = UnityEngine.AI.NavMesh.CalculateTriangulation();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr AddNavMeshData_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 1) {
					var p0 = (UnityEngine.AI.NavMeshData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var ret = UnityEngine.AI.NavMesh.AddNavMeshData(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (UnityEngine.AI.NavMeshData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var ret = UnityEngine.AI.NavMesh.AddNavMeshData(p0, p1, p2.target);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RemoveNavMeshData_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.AI.NavMeshDataInstance)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				UnityEngine.AI.NavMesh.RemoveNavMeshData(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr AddLink_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 1) {
					var p0 = (UnityEngine.AI.NavMeshLinkData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var ret = UnityEngine.AI.NavMesh.AddLink(p0);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else if (argcnt == 3) {
					var p0 = (UnityEngine.AI.NavMeshLinkData)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var ret = UnityEngine.AI.NavMesh.AddLink(p0, p1, p2.target);
					return MakeJsObjects.MakeJsObject(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RemoveLink_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.AI.NavMeshLinkInstance)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				UnityEngine.AI.NavMesh.RemoveLink(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CreateSettings_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var ret = UnityEngine.AI.NavMesh.CreateSettings();
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr RemoveSettings_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				UnityEngine.AI.NavMesh.RemoveSettings(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetSettingsByID_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.AI.NavMesh.GetSettingsByID(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetSettingsCount_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var ret = UnityEngine.AI.NavMesh.GetSettingsCount();
				return Native.jvm_make_number(context, (double)(ret));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetSettingsByIndex_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.AI.NavMesh.GetSettingsByIndex(p0);
				return MakeJsObjects.MakeJsObject(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetSettingsNameFromID_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				var ret = UnityEngine.AI.NavMesh.GetSettingsNameFromID(p0);
				return Native.jvm_make_string(context, ret);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onPreUpdateGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.AI.NavMesh.onPreUpdate);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr onPreUpdateSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.AI.NavMesh.onPreUpdate = (UnityEngine.AI.NavMesh.OnNavMeshPreUpdate)Uts.DelegateUtil.CreateDelegate<UnityEngine.AI.NavMesh.OnNavMeshPreUpdate>(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr AllAreasGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(UnityEngine.AI.NavMesh.AllAreas));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr avoidancePredictionTimeGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(UnityEngine.AI.NavMesh.avoidancePredictionTime));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr avoidancePredictionTimeSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.AI.NavMesh.avoidancePredictionTime = (float)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr pathfindingIterationsPerFrameGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(UnityEngine.AI.NavMesh.pathfindingIterationsPerFrame));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr pathfindingIterationsPerFrameSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.AI.NavMesh.pathfindingIterationsPerFrame = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.AI.NavMesh);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "onPreUpdate", onPreUpdateGetter_S, onPreUpdateSetter_S);
			Native.jvm_reg_static_property(env, "AllAreas", AllAreasGetter_S, null);
			Native.jvm_reg_static_property(env, "avoidancePredictionTime", avoidancePredictionTimeGetter_S, avoidancePredictionTimeSetter_S);
			Native.jvm_reg_static_property(env, "pathfindingIterationsPerFrame", pathfindingIterationsPerFrameGetter_S, pathfindingIterationsPerFrameSetter_S);
			Native.jvm_reg_static_function(env, "Raycast", Raycast_S);
			Native.jvm_reg_static_function(env, "CalculatePath", CalculatePath_S);
			Native.jvm_reg_static_function(env, "FindClosestEdge", FindClosestEdge_S);
			Native.jvm_reg_static_function(env, "SamplePosition", SamplePosition_S);
			Native.jvm_reg_static_function(env, "SetAreaCost", SetAreaCost_S);
			Native.jvm_reg_static_function(env, "GetAreaCost", GetAreaCost_S);
			Native.jvm_reg_static_function(env, "GetAreaFromName", GetAreaFromName_S);
			Native.jvm_reg_static_function(env, "CalculateTriangulation", CalculateTriangulation_S);
			Native.jvm_reg_static_function(env, "AddNavMeshData", AddNavMeshData_S);
			Native.jvm_reg_static_function(env, "RemoveNavMeshData", RemoveNavMeshData_S);
			Native.jvm_reg_static_function(env, "AddLink", AddLink_S);
			Native.jvm_reg_static_function(env, "RemoveLink", RemoveLink_S);
			Native.jvm_reg_static_function(env, "CreateSettings", CreateSettings_S);
			Native.jvm_reg_static_function(env, "RemoveSettings", RemoveSettings_S);
			Native.jvm_reg_static_function(env, "GetSettingsByID", GetSettingsByID_S);
			Native.jvm_reg_static_function(env, "GetSettingsCount", GetSettingsCount_S);
			Native.jvm_reg_static_function(env, "GetSettingsByIndex", GetSettingsByIndex_S);
			Native.jvm_reg_static_function(env, "GetSettingsNameFromID", GetSettingsNameFromID_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "NavMesh", IntPtr.Zero, null, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.AI.NavMesh), jsClass);
		}
	}
}
