using UnityEngine;

namespace UnityEditor.UI
{
    [CustomEditor(typeof(Game.UIFixedList), true)]
    public class FixedListEditor : CustomBehaviourEditor
    {
        SerializedProperty m_numbers;
        SerializedProperty m_objs;

        protected override void OnEnable()
        {
            m_numbers = serializedObject.FindProperty("numbers");
            m_objs = serializedObject.FindProperty("objs");

            m_numbers.arraySize = 1;
            var itemName = serializedObject.FindProperty("numbers.Array.data[0].Name");
            itemName.stringValue = "count";

            serializedObject.ApplyModifiedProperties();
        }

        protected override void CustomLayoutElementFields()
        {
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField("count", GUILayout.Width(100f));
            string scount = EditorGUILayout.TextField(m_objs.arraySize.ToString());
            int count = 0;
            if (!int.TryParse(scount, out count))
                count = 0;
            if (count >= 256)
            {
                UnityEngine.Debug.LogError("max item count is 256!");
                count = 256;
            }
            m_objs.arraySize = count;
            var countValue = serializedObject.FindProperty("numbers.Array.data[0].Value");
            countValue.floatValue = count;
            EditorGUILayout.EndHorizontal();

            for (int i = 0; i < count; i++)
            {
                EditorGUILayout.BeginHorizontal();
                var itemValue = serializedObject.FindProperty("objs.Array.data[" + i + "].Value");
                EditorGUILayout.LabelField("item" + i, GUILayout.Width(100f));
                EditorGUILayout.PropertyField(itemValue, GUIContent.none);
                EditorGUILayout.EndHorizontal();
            }
        }
    }
}