using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using System.Reflection;

[CustomEditor(typeof(Decal))]
public class DecalEditor : Editor {	
	private Matrix4x4 oldMatrix;
	public override void OnInspectorGUI() {
		Decal decal = (Decal)target;
		decal.material = AssetField<Material>("Material", decal.material);
		EditorGUILayout.Separator();

		decal.maxAngle = EditorGUILayout.FloatField("Max Angle", decal.maxAngle);
		decal.maxAngle = Mathf.Clamp(decal.maxAngle, 1, 180);

		decal.pushDistance = EditorGUILayout.FloatField("Push Distance", decal.pushDistance);
		decal.pushDistance = Mathf.Clamp( decal.pushDistance, 0.01f, 1 );
		EditorGUILayout.Separator();

		decal.affectedLayers = LayerMaskField("Affected Layers", decal.affectedLayers);

		EditorGUILayout.LabelField("Affected Objects");
		if(decal.affectedObjectsView != null) {
			GUILayout.BeginHorizontal();
			GUILayout.Space(15);
			GUILayout.BeginVertical();
			foreach(GameObject go in decal.affectedObjectsView) {
				EditorGUILayout.ObjectField( go, typeof(GameObject), true );
			}
			GUILayout.EndVertical();
			GUILayout.EndHorizontal();
		}
		EditorGUILayout.Separator();

		GUILayout.Box("Left Ctrl + Left Mouse Button - Set position and normal of decal", GUILayout.ExpandWidth(true));

		if(GUI.changed) {
            decal.Build();
		}
	}

	private static T AssetField<T>(string label, T obj) where T : Object {
		return (T) EditorGUILayout.ObjectField(label, (T)obj, typeof(T), false);
	}
	void OnSceneGUI() {
		Decal decal = (Decal)target;

		if(Event.current.control) {
			HandleUtility.AddDefaultControl(GUIUtility.GetControlID(FocusType.Passive));
		}

		if(Event.current.control && Event.current.type == EventType.MouseDown) {
			Ray ray = HandleUtility.GUIPointToWorldRay( Event.current.mousePosition );
			RaycastHit hit = new RaycastHit();
			if( Physics.Raycast( ray, out hit, 50 ) ) {
				decal.transform.position = hit.point;
				decal.transform.forward = -hit.normal;
			}
		}
		bool hasChanged = oldMatrix != decal.transform.localToWorldMatrix;
		oldMatrix = decal.transform.localToWorldMatrix;
		if(hasChanged) {
            decal.Build();
		}
	}
	private static LayerMask LayerMaskField(string label, LayerMask mask) {
		List<string> layers = new List<string>();
		for(int i=0; i<32; i++) {
			string name = LayerMask.LayerToName(i);
			if(name != "") layers.Add( name );
		}
		return EditorGUILayout.MaskField( label, mask, layers.ToArray() );
	}
}