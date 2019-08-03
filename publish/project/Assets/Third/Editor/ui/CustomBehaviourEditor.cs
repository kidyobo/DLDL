using UnityEngine;

namespace UnityEditor.UI
{
    public class CustomBehaviourEditor : Editor
    {
        protected virtual void OnEnable()
        {
        }

        public override void OnInspectorGUI()
        {
            serializedObject.Update();

            CustomLayoutElementFields();

            var fields = GetCommonFieldPaths();
            foreach (var fieldpath in fields)
            {
                CommonLayoutElementField(fieldpath);
            }

            serializedObject.ApplyModifiedProperties();
        }

        protected virtual void CustomLayoutElementFields()
        {
        }

        protected virtual string[] GetCommonFieldPaths()
        {
            return new string[] {};
        }

        protected void CommonLayoutElementField(string propertyPath)
        {
            EditorGUILayout.BeginHorizontal();
            var itemName = serializedObject.FindProperty(propertyPath + ".Name");
            var itemValue = serializedObject.FindProperty(propertyPath + ".Value");
            EditorGUILayout.LabelField(itemName.stringValue, GUILayout.Width(100f));
            EditorGUILayout.PropertyField(itemValue, GUIContent.none, true);
            EditorGUILayout.EndHorizontal();
        }
    }
}
