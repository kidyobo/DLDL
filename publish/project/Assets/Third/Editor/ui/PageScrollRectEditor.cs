using UnityEngine;
using UnityEngine.UI;
using UnityEditor.AnimatedValues;

namespace UnityEditor.UI
{
    [CustomEditor(typeof(PageScrollRect), true)]
    [CanEditMultipleObjects]
    public class PageScrollRectEditor : ScrollRectEditor
    {
        SerializedProperty m_itemSize;
        SerializedProperty m_spacing;
        SerializedProperty m_maxScale;
        SerializedProperty m_scaleRange;
        SerializedProperty m_moveVelocity;

        protected override void OnEnable()
        {
            m_itemSize = serializedObject.FindProperty("itemSize");
            m_spacing = serializedObject.FindProperty("spacing");
            m_maxScale = serializedObject.FindProperty("maxScale");
            m_scaleRange = serializedObject.FindProperty("scaleRange");
            m_moveVelocity = serializedObject.FindProperty("moveVelocity");
            base.OnEnable();
        }

        public override void OnInspectorGUI()
        {
            base.OnInspectorGUI();

            EditorGUILayout.Space();
            EditorGUILayout.PropertyField(m_itemSize);
            EditorGUILayout.PropertyField(m_spacing);
            EditorGUILayout.PropertyField(m_maxScale);
            EditorGUILayout.PropertyField(m_scaleRange);
            EditorGUILayout.PropertyField(m_moveVelocity);
            serializedObject.ApplyModifiedProperties();
        }
    }
}