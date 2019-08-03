using System;
using System.Collections.Generic;
using UnityEngine;
namespace Uts {
	public class GraphicsWrap {
		public static IntPtr jsClass;
		[MonoPInvokeCallbackAttribute(typeof(jvm_ctor_callback))]
		public static IntPtr ctor(IntPtr context, IntPtr ctor, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var obj = new UnityEngine.Graphics();
				return MakeJsObjects.MakeJsCtorObject(context, jsClass, obj);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DrawMesh_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 10) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					var vp6 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 6));
					var vp7 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 7));
					var vp8 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 8));
					var vp9 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 9));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp6, typeof(int)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp8, typeof(bool)) && Uts.Core.CompareType(vp9, typeof(bool))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						var p3 = (UnityEngine.Material)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.Camera)vp5;
						var p6 = (int)(double)vp6;
						var p7 = (UnityEngine.MaterialPropertyBlock)vp7;
						var p8 = (bool)vp8;
						var p9 = (bool)vp9;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2.target, p3, p4, p5, p6, p7, p8, p9);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp6, typeof(int)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp8, typeof(UnityEngine.Rendering.ShadowCastingMode)) && Uts.Core.CompareType(vp9, typeof(bool))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						var p3 = (UnityEngine.Material)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.Camera)vp5;
						var p6 = (int)(double)vp6;
						var p7 = (UnityEngine.MaterialPropertyBlock)vp7;
						var p8 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp8;
						var p9 = (bool)vp9;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2.target, p3, p4, p5, p6, p7, p8, p9);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp7, typeof(bool)) && Uts.Core.CompareType(vp8, typeof(bool)) && Uts.Core.CompareType(vp9, typeof(bool))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Matrix4x4)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (UnityEngine.Camera)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (UnityEngine.MaterialPropertyBlock)vp6;
						var p7 = (bool)vp7;
						var p8 = (bool)vp8;
						var p9 = (bool)vp9;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.Rendering.ShadowCastingMode)) && Uts.Core.CompareType(vp8, typeof(bool)) && Uts.Core.CompareType(vp9, typeof(UnityEngine.Transform))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Matrix4x4)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (UnityEngine.Camera)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (UnityEngine.MaterialPropertyBlock)vp6;
						var p7 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp7;
						var p8 = (bool)vp8;
						var p9 = (UnityEngine.Transform)vp9;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 9) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					var vp6 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 6));
					var vp7 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 7));
					var vp8 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 8));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp6, typeof(int)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp8, typeof(bool))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						var p3 = (UnityEngine.Material)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.Camera)vp5;
						var p6 = (int)(double)vp6;
						var p7 = (UnityEngine.MaterialPropertyBlock)vp7;
						var p8 = (bool)vp8;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2.target, p3, p4, p5, p6, p7, p8);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp6, typeof(int)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp8, typeof(UnityEngine.Rendering.ShadowCastingMode))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						var p3 = (UnityEngine.Material)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.Camera)vp5;
						var p6 = (int)(double)vp6;
						var p7 = (UnityEngine.MaterialPropertyBlock)vp7;
						var p8 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp8;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2.target, p3, p4, p5, p6, p7, p8);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp7, typeof(bool)) && Uts.Core.CompareType(vp8, typeof(bool))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Matrix4x4)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (UnityEngine.Camera)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (UnityEngine.MaterialPropertyBlock)vp6;
						var p7 = (bool)vp7;
						var p8 = (bool)vp8;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2, p3, p4, p5, p6, p7, p8);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.Rendering.ShadowCastingMode)) && Uts.Core.CompareType(vp8, typeof(bool))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Matrix4x4)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (UnityEngine.Camera)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (UnityEngine.MaterialPropertyBlock)vp6;
						var p7 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp7;
						var p8 = (bool)vp8;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2, p3, p4, p5, p6, p7, p8);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 8) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					var vp6 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 6));
					var vp7 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 7));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp6, typeof(int)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.MaterialPropertyBlock))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						var p3 = (UnityEngine.Material)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.Camera)vp5;
						var p6 = (int)(double)vp6;
						var p7 = (UnityEngine.MaterialPropertyBlock)vp7;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2.target, p3, p4, p5, p6, p7);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp7, typeof(bool))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Matrix4x4)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (UnityEngine.Camera)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (UnityEngine.MaterialPropertyBlock)vp6;
						var p7 = (bool)vp7;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2, p3, p4, p5, p6, p7);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.Rendering.ShadowCastingMode))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Matrix4x4)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (UnityEngine.Camera)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (UnityEngine.MaterialPropertyBlock)vp6;
						var p7 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp7;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2, p3, p4, p5, p6, p7);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 7) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					var vp6 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 6));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp6, typeof(int))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						var p3 = (UnityEngine.Material)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.Camera)vp5;
						var p6 = (int)(double)vp6;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2.target, p3, p4, p5, p6);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.MaterialPropertyBlock))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Matrix4x4)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (UnityEngine.Camera)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (UnityEngine.MaterialPropertyBlock)vp6;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2, p3, p4, p5, p6);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 6) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Camera))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						var p3 = (UnityEngine.Material)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.Camera)vp5;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2.target, p3, p4, p5);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp5, typeof(int))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Matrix4x4)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (UnityEngine.Camera)vp4;
						var p5 = (int)(double)vp5;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2, p3, p4, p5);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 5) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp4, typeof(int))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						var p3 = (UnityEngine.Material)vp3;
						var p4 = (int)(double)vp4;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2.target, p3, p4);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(UnityEngine.Camera))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Matrix4x4)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (UnityEngine.Camera)vp4;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2, p3, p4);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 11) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					var vp6 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 6));
					var vp7 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 7));
					var vp8 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 8));
					var vp9 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 9));
					var vp10 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 10));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp6, typeof(int)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp8, typeof(bool)) && Uts.Core.CompareType(vp9, typeof(bool)) && Uts.Core.CompareType(vp10, typeof(bool))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						var p3 = (UnityEngine.Material)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.Camera)vp5;
						var p6 = (int)(double)vp6;
						var p7 = (UnityEngine.MaterialPropertyBlock)vp7;
						var p8 = (bool)vp8;
						var p9 = (bool)vp9;
						var p10 = (bool)vp10;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2.target, p3, p4, p5, p6, p7, p8, p9, p10);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp6, typeof(int)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp8, typeof(UnityEngine.Rendering.ShadowCastingMode)) && Uts.Core.CompareType(vp9, typeof(bool)) && Uts.Core.CompareType(vp10, typeof(UnityEngine.Transform))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						var p3 = (UnityEngine.Material)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.Camera)vp5;
						var p6 = (int)(double)vp6;
						var p7 = (UnityEngine.MaterialPropertyBlock)vp7;
						var p8 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp8;
						var p9 = (bool)vp9;
						var p10 = (UnityEngine.Transform)vp10;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2.target, p3, p4, p5, p6, p7, p8, p9, p10);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(UnityEngine.Camera)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.Rendering.ShadowCastingMode)) && Uts.Core.CompareType(vp8, typeof(bool)) && Uts.Core.CompareType(vp9, typeof(UnityEngine.Transform)) && Uts.Core.CompareType(vp10, typeof(bool))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Matrix4x4)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (UnityEngine.Camera)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (UnityEngine.MaterialPropertyBlock)vp6;
						var p7 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp7;
						var p8 = (bool)vp8;
						var p9 = (UnityEngine.Transform)vp9;
						var p10 = (bool)vp10;
						UnityEngine.Graphics.DrawMesh(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 12) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var p5 = (UnityEngine.Camera)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 5));
					var p6 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 6));
					var p7 = (UnityEngine.MaterialPropertyBlock)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 7));
					var p8 = (UnityEngine.Rendering.ShadowCastingMode)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 8));
					var p9 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 9));
					var p10 = (UnityEngine.Transform)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 10));
					var p11 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 11));
					UnityEngine.Graphics.DrawMesh(p0, p1, p2.target, p3, p4, p5, p6, p7, p8, p9, p10, p11);
					return IntPtr.Zero;
				} else if (argcnt == 4) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Matrix4x4)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					UnityEngine.Graphics.DrawMesh(p0, p1, p2, p3);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DrawProcedural_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 3) {
					var p0 = (UnityEngine.MeshTopology)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					UnityEngine.Graphics.DrawProcedural(p0, p1, p2);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = (UnityEngine.MeshTopology)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					UnityEngine.Graphics.DrawProcedural(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DrawProceduralIndirect_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 3) {
					var p0 = (UnityEngine.MeshTopology)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.ComputeBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					UnityEngine.Graphics.DrawProceduralIndirect(p0, p1, p2);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = (UnityEngine.MeshTopology)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.ComputeBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					UnityEngine.Graphics.DrawProceduralIndirect(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DrawMeshInstanced_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 9) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					var vp6 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 6));
					var vp7 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 7));
					var vp8 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 8));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[])) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.Rendering.ShadowCastingMode)) && Uts.Core.CompareType(vp7, typeof(bool)) && Uts.Core.CompareType(vp8, typeof(int))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToArray<UnityEngine.Matrix4x4>(vp3);
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.MaterialPropertyBlock)vp5;
						var p6 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp6;
						var p7 = (bool)vp7;
						var p8 = (int)(double)vp8;
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3, p4, p5, p6, p7, p8);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[])) && Uts.Core.CompareType(vp4, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Rendering.ShadowCastingMode)) && Uts.Core.CompareType(vp6, typeof(bool)) && Uts.Core.CompareType(vp7, typeof(int)) && Uts.Core.CompareType(vp8, typeof(UnityEngine.Camera))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp3);
						var p4 = (UnityEngine.MaterialPropertyBlock)vp4;
						var p5 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp5;
						var p6 = (bool)vp6;
						var p7 = (int)(double)vp7;
						var p8 = (UnityEngine.Camera)vp8;
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3, p4, p5, p6, p7, p8);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 8) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					var vp6 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 6));
					var vp7 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 7));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[])) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.Rendering.ShadowCastingMode)) && Uts.Core.CompareType(vp7, typeof(bool))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToArray<UnityEngine.Matrix4x4>(vp3);
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.MaterialPropertyBlock)vp5;
						var p6 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp6;
						var p7 = (bool)vp7;
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3, p4, p5, p6, p7);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[])) && Uts.Core.CompareType(vp4, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Rendering.ShadowCastingMode)) && Uts.Core.CompareType(vp6, typeof(bool)) && Uts.Core.CompareType(vp7, typeof(int))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp3);
						var p4 = (UnityEngine.MaterialPropertyBlock)vp4;
						var p5 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp5;
						var p6 = (bool)vp6;
						var p7 = (int)(double)vp7;
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3, p4, p5, p6, p7);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 7) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					var vp6 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 6));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[])) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.Rendering.ShadowCastingMode))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToArray<UnityEngine.Matrix4x4>(vp3);
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.MaterialPropertyBlock)vp5;
						var p6 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp6;
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3, p4, p5, p6);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[])) && Uts.Core.CompareType(vp4, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Rendering.ShadowCastingMode)) && Uts.Core.CompareType(vp6, typeof(bool))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp3);
						var p4 = (UnityEngine.MaterialPropertyBlock)vp4;
						var p5 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp5;
						var p6 = (bool)vp6;
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3, p4, p5, p6);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 6) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[])) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.MaterialPropertyBlock))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToArray<UnityEngine.Matrix4x4>(vp3);
						var p4 = (int)(double)vp4;
						var p5 = (UnityEngine.MaterialPropertyBlock)vp5;
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3, p4, p5);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[])) && Uts.Core.CompareType(vp4, typeof(UnityEngine.MaterialPropertyBlock)) && Uts.Core.CompareType(vp5, typeof(UnityEngine.Rendering.ShadowCastingMode))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp3);
						var p4 = (UnityEngine.MaterialPropertyBlock)vp4;
						var p5 = (UnityEngine.Rendering.ShadowCastingMode)(double)vp5;
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3, p4, p5);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 5) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[])) && Uts.Core.CompareType(vp4, typeof(int))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToArray<UnityEngine.Matrix4x4>(vp3);
						var p4 = (int)(double)vp4;
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3, p4);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[])) && Uts.Core.CompareType(vp4, typeof(UnityEngine.MaterialPropertyBlock))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp3);
						var p4 = (UnityEngine.MaterialPropertyBlock)vp4;
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3, p4);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 4) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[]))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToArray<UnityEngine.Matrix4x4>(vp3);
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.Matrix4x4[]))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.Material)vp2;
						var p3 = ToCsObjects.ToList<UnityEngine.Matrix4x4>(vp3);
						UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 10) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = ToCsObjects.ToArray<UnityEngine.Matrix4x4>(context, Native.jvm_get_arg(args, 3));
					var p4 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var p5 = (UnityEngine.MaterialPropertyBlock)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 5));
					var p6 = (UnityEngine.Rendering.ShadowCastingMode)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 6));
					var p7 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 7));
					var p8 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 8));
					var p9 = (UnityEngine.Camera)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 9));
					UnityEngine.Graphics.DrawMeshInstanced(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DrawMeshInstancedIndirect_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 10) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (Agent<UnityEngine.Bounds>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = (UnityEngine.ComputeBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					var p6 = (UnityEngine.MaterialPropertyBlock)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 6));
					var p7 = (UnityEngine.Rendering.ShadowCastingMode)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 7));
					var p8 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 8));
					var p9 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 9));
					UnityEngine.Graphics.DrawMeshInstancedIndirect(p0, p1, p2, p3.target, p4, p5, p6, p7, p8, p9);
					return IntPtr.Zero;
				} else if (argcnt == 9) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (Agent<UnityEngine.Bounds>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = (UnityEngine.ComputeBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					var p6 = (UnityEngine.MaterialPropertyBlock)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 6));
					var p7 = (UnityEngine.Rendering.ShadowCastingMode)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 7));
					var p8 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 8));
					UnityEngine.Graphics.DrawMeshInstancedIndirect(p0, p1, p2, p3.target, p4, p5, p6, p7, p8);
					return IntPtr.Zero;
				} else if (argcnt == 8) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (Agent<UnityEngine.Bounds>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = (UnityEngine.ComputeBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					var p6 = (UnityEngine.MaterialPropertyBlock)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 6));
					var p7 = (UnityEngine.Rendering.ShadowCastingMode)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 7));
					UnityEngine.Graphics.DrawMeshInstancedIndirect(p0, p1, p2, p3.target, p4, p5, p6, p7);
					return IntPtr.Zero;
				} else if (argcnt == 7) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (Agent<UnityEngine.Bounds>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = (UnityEngine.ComputeBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					var p6 = (UnityEngine.MaterialPropertyBlock)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 6));
					UnityEngine.Graphics.DrawMeshInstancedIndirect(p0, p1, p2, p3.target, p4, p5, p6);
					return IntPtr.Zero;
				} else if (argcnt == 6) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (Agent<UnityEngine.Bounds>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = (UnityEngine.ComputeBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					UnityEngine.Graphics.DrawMeshInstancedIndirect(p0, p1, p2, p3.target, p4, p5);
					return IntPtr.Zero;
				} else if (argcnt == 5) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (Agent<UnityEngine.Bounds>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = (UnityEngine.ComputeBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 4));
					UnityEngine.Graphics.DrawMeshInstancedIndirect(p0, p1, p2, p3.target, p4);
					return IntPtr.Zero;
				} else if (argcnt == 11) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (Agent<UnityEngine.Bounds>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = (UnityEngine.ComputeBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					var p6 = (UnityEngine.MaterialPropertyBlock)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 6));
					var p7 = (UnityEngine.Rendering.ShadowCastingMode)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 7));
					var p8 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 8));
					var p9 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 9));
					var p10 = (UnityEngine.Camera)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 10));
					UnityEngine.Graphics.DrawMeshInstancedIndirect(p0, p1, p2, p3.target, p4, p5, p6, p7, p8, p9, p10);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DrawTexture_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 3) {
					var p0 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					UnityEngine.Graphics.DrawTexture(p0.target, p1, p2);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					UnityEngine.Graphics.DrawTexture(p0.target, p1);
					return IntPtr.Zero;
				} else if (argcnt == 4) {
					var p0 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					UnityEngine.Graphics.DrawTexture(p0.target, p1, p2, p3);
					return IntPtr.Zero;
				} else if (argcnt == 7) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					var vp6 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 6));
					if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Texture)) && Uts.Core.CompareType(vp2, typeof(int)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.Material))) {
						var p0 = (Agent<UnityEngine.Rect>)vp0;
						var p1 = (UnityEngine.Texture)vp1;
						var p2 = (int)(double)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (UnityEngine.Material)vp6;
						UnityEngine.Graphics.DrawTexture(p0.target, p1, p2, p3, p4, p5, p6);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Texture)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(int))) {
						var p0 = (Agent<UnityEngine.Rect>)vp0;
						var p1 = (UnityEngine.Texture)vp1;
						var p2 = (Agent<UnityEngine.Rect>)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (int)(double)vp6;
						UnityEngine.Graphics.DrawTexture(p0.target, p1, p2.target, p3, p4, p5, p6);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 6) {
					var p0 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					UnityEngine.Graphics.DrawTexture(p0.target, p1, p2, p3, p4, p5);
					return IntPtr.Zero;
				} else if (argcnt == 8) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					var vp6 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 6));
					var vp7 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 7));
					if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Texture)) && Uts.Core.CompareType(vp2, typeof(int)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp7, typeof(int))) {
						var p0 = (Agent<UnityEngine.Rect>)vp0;
						var p1 = (UnityEngine.Texture)vp1;
						var p2 = (int)(double)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (UnityEngine.Material)vp6;
						var p7 = (int)(double)vp7;
						UnityEngine.Graphics.DrawTexture(p0.target, p1, p2, p3, p4, p5, p6, p7);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Texture)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(int)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.Material))) {
						var p0 = (Agent<UnityEngine.Rect>)vp0;
						var p1 = (UnityEngine.Texture)vp1;
						var p2 = (Agent<UnityEngine.Rect>)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (int)(double)vp6;
						var p7 = (UnityEngine.Material)vp7;
						UnityEngine.Graphics.DrawTexture(p0.target, p1, p2.target, p3, p4, p5, p6, p7);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Texture)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(int)) && Uts.Core.CompareType(vp7, typeof(Agent<UnityEngine.Color>))) {
						var p0 = (Agent<UnityEngine.Rect>)vp0;
						var p1 = (UnityEngine.Texture)vp1;
						var p2 = (Agent<UnityEngine.Rect>)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (int)(double)vp6;
						var p7 = (Agent<UnityEngine.Color>)vp7;
						UnityEngine.Graphics.DrawTexture(p0.target, p1, p2.target, p3, p4, p5, p6, p7.target);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 9) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					var vp4 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 4));
					var vp5 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 5));
					var vp6 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 6));
					var vp7 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 7));
					var vp8 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 8));
					if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Texture)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(int)) && Uts.Core.CompareType(vp7, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp8, typeof(int))) {
						var p0 = (Agent<UnityEngine.Rect>)vp0;
						var p1 = (UnityEngine.Texture)vp1;
						var p2 = (Agent<UnityEngine.Rect>)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (int)(double)vp6;
						var p7 = (UnityEngine.Material)vp7;
						var p8 = (int)(double)vp8;
						UnityEngine.Graphics.DrawTexture(p0.target, p1, p2.target, p3, p4, p5, p6, p7, p8);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Texture)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Rect>)) && Uts.Core.CompareType(vp3, typeof(int)) && Uts.Core.CompareType(vp4, typeof(int)) && Uts.Core.CompareType(vp5, typeof(int)) && Uts.Core.CompareType(vp6, typeof(int)) && Uts.Core.CompareType(vp7, typeof(Agent<UnityEngine.Color>)) && Uts.Core.CompareType(vp8, typeof(UnityEngine.Material))) {
						var p0 = (Agent<UnityEngine.Rect>)vp0;
						var p1 = (UnityEngine.Texture)vp1;
						var p2 = (Agent<UnityEngine.Rect>)vp2;
						var p3 = (int)(double)vp3;
						var p4 = (int)(double)vp4;
						var p5 = (int)(double)vp5;
						var p6 = (int)(double)vp6;
						var p7 = (Agent<UnityEngine.Color>)vp7;
						var p8 = (UnityEngine.Material)vp8;
						UnityEngine.Graphics.DrawTexture(p0.target, p1, p2.target, p3, p4, p5, p6, p7.target, p8);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 10) {
					var p0 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (Agent<UnityEngine.Rect>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					var p6 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 6));
					var p7 = (Agent<UnityEngine.Color>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 7));
					var p8 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 8));
					var p9 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 9));
					UnityEngine.Graphics.DrawTexture(p0.target, p1, p2.target, p3, p4, p5, p6, p7.target, p8, p9);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ExecuteCommandBuffer_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Rendering.CommandBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				UnityEngine.Graphics.ExecuteCommandBuffer(p0);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr Blit_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Texture)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.RenderTexture))) {
						var p0 = (UnityEngine.Texture)vp0;
						var p1 = (UnityEngine.RenderTexture)vp1;
						UnityEngine.Graphics.Blit(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Texture)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Material))) {
						var p0 = (UnityEngine.Texture)vp0;
						var p1 = (UnityEngine.Material)vp1;
						UnityEngine.Graphics.Blit(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 3) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Texture)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.RenderTexture)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.Material))) {
						var p0 = (UnityEngine.Texture)vp0;
						var p1 = (UnityEngine.RenderTexture)vp1;
						var p2 = (UnityEngine.Material)vp2;
						UnityEngine.Graphics.Blit(p0, p1, p2);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Texture)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Material)) && Uts.Core.CompareType(vp2, typeof(int))) {
						var p0 = (UnityEngine.Texture)vp0;
						var p1 = (UnityEngine.Material)vp1;
						var p2 = (int)(double)vp2;
						UnityEngine.Graphics.Blit(p0, p1, p2);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 4) {
					var p0 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.RenderTexture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					UnityEngine.Graphics.Blit(p0, p1, p2, p3);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr BlitMultiTap_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				var p0 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
				var p1 = (UnityEngine.RenderTexture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
				var p2 = (UnityEngine.Material)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
				var p3 = ToCsObjects.ToArray<UnityEngine.Vector2>(context, Native.jvm_get_arg(args, 3));
				UnityEngine.Graphics.BlitMultiTap(p0, p1, p2, p3);
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetRandomWriteTarget_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.RenderTexture))) {
						var p0 = (int)(double)vp0;
						var p1 = (UnityEngine.RenderTexture)vp1;
						UnityEngine.Graphics.SetRandomWriteTarget(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(int)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.ComputeBuffer))) {
						var p0 = (int)(double)vp0;
						var p1 = (UnityEngine.ComputeBuffer)vp1;
						UnityEngine.Graphics.SetRandomWriteTarget(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 3) {
					var p0 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.ComputeBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (bool)Native.jvm_toboolean(context, Native.jvm_get_arg(args, 2));
					UnityEngine.Graphics.SetRandomWriteTarget(p0, p1, p2);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ClearRandomWriteTargets_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.Graphics.ClearRandomWriteTargets();
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr SetRenderTarget_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 1) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderTexture))) {
						var p0 = (UnityEngine.RenderTexture)vp0;
						UnityEngine.Graphics.SetRenderTarget(p0);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderTargetSetup))) {
						var p0 = (UnityEngine.RenderTargetSetup)vp0;
						UnityEngine.Graphics.SetRenderTarget(p0);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 2) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderTexture)) && Uts.Core.CompareType(vp1, typeof(int))) {
						var p0 = (UnityEngine.RenderTexture)vp0;
						var p1 = (int)(double)vp1;
						UnityEngine.Graphics.SetRenderTarget(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderBuffer)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.RenderBuffer))) {
						var p0 = (UnityEngine.RenderBuffer)vp0;
						var p1 = (UnityEngine.RenderBuffer)vp1;
						UnityEngine.Graphics.SetRenderTarget(p0, p1);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderBuffer[])) && Uts.Core.CompareType(vp1, typeof(UnityEngine.RenderBuffer))) {
						var p0 = ToCsObjects.ToArray<UnityEngine.RenderBuffer>(vp0);
						var p1 = (UnityEngine.RenderBuffer)vp1;
						UnityEngine.Graphics.SetRenderTarget(p0, p1);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 3) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderTexture)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.CubemapFace))) {
						var p0 = (UnityEngine.RenderTexture)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.CubemapFace)(double)vp2;
						UnityEngine.Graphics.SetRenderTarget(p0, p1, p2);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderBuffer)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.RenderBuffer)) && Uts.Core.CompareType(vp2, typeof(int))) {
						var p0 = (UnityEngine.RenderBuffer)vp0;
						var p1 = (UnityEngine.RenderBuffer)vp1;
						var p2 = (int)(double)vp2;
						UnityEngine.Graphics.SetRenderTarget(p0, p1, p2);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 4) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					var vp3 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 3));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderTexture)) && Uts.Core.CompareType(vp1, typeof(int)) && Uts.Core.CompareType(vp2, typeof(UnityEngine.CubemapFace)) && Uts.Core.CompareType(vp3, typeof(int))) {
						var p0 = (UnityEngine.RenderTexture)vp0;
						var p1 = (int)(double)vp1;
						var p2 = (UnityEngine.CubemapFace)(double)vp2;
						var p3 = (int)(double)vp3;
						UnityEngine.Graphics.SetRenderTarget(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.RenderBuffer)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.RenderBuffer)) && Uts.Core.CompareType(vp2, typeof(int)) && Uts.Core.CompareType(vp3, typeof(UnityEngine.CubemapFace))) {
						var p0 = (UnityEngine.RenderBuffer)vp0;
						var p1 = (UnityEngine.RenderBuffer)vp1;
						var p2 = (int)(double)vp2;
						var p3 = (UnityEngine.CubemapFace)(double)vp3;
						UnityEngine.Graphics.SetRenderTarget(p0, p1, p2, p3);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 5) {
					var p0 = (UnityEngine.RenderBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.RenderBuffer)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.CubemapFace)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					UnityEngine.Graphics.SetRenderTarget(p0, p1, p2, p3, p4);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr CopyTexture_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var p0 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					UnityEngine.Graphics.CopyTexture(p0, p1);
					return IntPtr.Zero;
				} else if (argcnt == 4) {
					var p0 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					UnityEngine.Graphics.CopyTexture(p0, p1, p2, p3);
					return IntPtr.Zero;
				} else if (argcnt == 6) {
					var p0 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 3));
					var p4 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					UnityEngine.Graphics.CopyTexture(p0, p1, p2, p3, p4, p5);
					return IntPtr.Zero;
				} else if (argcnt == 12) {
					var p0 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var p4 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 4));
					var p5 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 5));
					var p6 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 6));
					var p7 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 7));
					var p8 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 8));
					var p9 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 9));
					var p10 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 10));
					var p11 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 11));
					UnityEngine.Graphics.CopyTexture(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr ConvertTexture_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 2) {
					var p0 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					var ret = UnityEngine.Graphics.ConvertTexture(p0, p1);
					return Native.jvm_make_boolean(context, ret);
				} else if (argcnt == 4) {
					var p0 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 1));
					var p2 = (UnityEngine.Texture)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					var ret = UnityEngine.Graphics.ConvertTexture(p0, p1, p2, p3);
					return Native.jvm_make_boolean(context, ret);
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr DrawMeshNow_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				if (argcnt == 3) {
					var vp0 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 0));
					var vp1 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 1));
					var vp2 = ToCsObjects.ToVarObject(context, Native.jvm_get_arg(args, 2));
					if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Vector3)) && Uts.Core.CompareType(vp2, typeof(Agent<UnityEngine.Quaternion>))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Vector3)vp1;
						var p2 = (Agent<UnityEngine.Quaternion>)vp2;
						UnityEngine.Graphics.DrawMeshNow(p0, p1, p2.target);
						return IntPtr.Zero;
					} else if (Uts.Core.CompareType(vp0, typeof(UnityEngine.Mesh)) && Uts.Core.CompareType(vp1, typeof(UnityEngine.Matrix4x4)) && Uts.Core.CompareType(vp2, typeof(int))) {
						var p0 = (UnityEngine.Mesh)vp0;
						var p1 = (UnityEngine.Matrix4x4)vp1;
						var p2 = (int)(double)vp2;
						UnityEngine.Graphics.DrawMeshNow(p0, p1, p2);
						return IntPtr.Zero;
					} else { return Native.jvm_throwerr(context, exception, "Parameter type mismatch"); }
				} else if (argcnt == 4) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Vector3)JsStructs.vector3.ToCsObject(context, Native.jvm_get_arg(args, 1));
					var p2 = (Agent<UnityEngine.Quaternion>)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 2));
					var p3 = (int)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 3));
					UnityEngine.Graphics.DrawMeshNow(p0, p1, p2.target, p3);
					return IntPtr.Zero;
				} else if (argcnt == 2) {
					var p0 = (UnityEngine.Mesh)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 0));
					var p1 = (UnityEngine.Matrix4x4)ToCsObjects.ToObject(context, Native.jvm_get_arg(args, 1));
					UnityEngine.Graphics.DrawMeshNow(p0, p1);
					return IntPtr.Zero;
				} else { return Native.jvm_throwerr(context, exception, "Parameter count mismatch"); }
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr activeColorBufferGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.Graphics.activeColorBuffer);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr activeDepthBufferGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return MakeJsObjects.MakeJsObject(context, UnityEngine.Graphics.activeDepthBuffer);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr activeTierGetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				return Native.jvm_make_number(context, (double)(UnityEngine.Graphics.activeTier));
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr activeTierSetter_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				UnityEngine.Graphics.activeTier = (UnityEngine.Rendering.GraphicsTier)(double)Native.jvm_tonumber(context, Native.jvm_get_arg(args, 0));
				return IntPtr.Zero;
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		[MonoPInvokeCallbackAttribute(typeof(jvm_callback))]
		public static IntPtr GetType_S(IntPtr context, IntPtr function, IntPtr thisObj, int argcnt, IntPtr args, IntPtr exception) {
			try {
				Type csType = typeof(UnityEngine.Graphics);
				return MakeJsObjects.MakeJsObject(context, csType);
			} catch (Exception e) { return Native.jvm_throwerr(context, exception, e.ToString()); }
		}
		
		static public void Register(IntPtr env) {
			Native.jvm_reg_class_start(env);
			Native.jvm_reg_static_property(env, "activeColorBuffer", activeColorBufferGetter_S, null);
			Native.jvm_reg_static_property(env, "activeDepthBuffer", activeDepthBufferGetter_S, null);
			Native.jvm_reg_static_property(env, "activeTier", activeTierGetter_S, activeTierSetter_S);
			Native.jvm_reg_static_function(env, "DrawMesh", DrawMesh_S);
			Native.jvm_reg_static_function(env, "DrawProcedural", DrawProcedural_S);
			Native.jvm_reg_static_function(env, "DrawProceduralIndirect", DrawProceduralIndirect_S);
			Native.jvm_reg_static_function(env, "DrawMeshInstanced", DrawMeshInstanced_S);
			Native.jvm_reg_static_function(env, "DrawMeshInstancedIndirect", DrawMeshInstancedIndirect_S);
			Native.jvm_reg_static_function(env, "DrawTexture", DrawTexture_S);
			Native.jvm_reg_static_function(env, "ExecuteCommandBuffer", ExecuteCommandBuffer_S);
			Native.jvm_reg_static_function(env, "Blit", Blit_S);
			Native.jvm_reg_static_function(env, "BlitMultiTap", BlitMultiTap_S);
			Native.jvm_reg_static_function(env, "SetRandomWriteTarget", SetRandomWriteTarget_S);
			Native.jvm_reg_static_function(env, "ClearRandomWriteTargets", ClearRandomWriteTargets_S);
			Native.jvm_reg_static_function(env, "SetRenderTarget", SetRenderTarget_S);
			Native.jvm_reg_static_function(env, "CopyTexture", CopyTexture_S);
			Native.jvm_reg_static_function(env, "ConvertTexture", ConvertTexture_S);
			Native.jvm_reg_static_function(env, "DrawMeshNow", DrawMeshNow_S);
			Native.jvm_reg_static_function(env, "GetType", GetType_S);
			jsClass = Native.jvm_reg_class_end(env, "Graphics", IntPtr.Zero, ctor, ObjectsMgr.dtor);
			RegHelper.RegisterJsClass(typeof(UnityEngine.Graphics), jsClass);
		}
	}
}
