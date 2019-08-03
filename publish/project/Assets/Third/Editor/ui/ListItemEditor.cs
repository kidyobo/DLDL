using UnityEngine;

namespace UnityEditor.UI
{
    [CustomEditor(typeof(Game.UIListItem), true)]
    class ListItemEditor : CustomBehaviourEditor
    {
        SerializedProperty m_objs;

        protected override void OnEnable()
        {
            m_objs = serializedObject.FindProperty("objs");

            m_objs.arraySize = 1;
            var itemName = serializedObject.FindProperty("objs.Array.data[0].Name");
            itemName.stringValue = "selectedState";

            serializedObject.ApplyModifiedProperties();
        }

        protected override string[] GetCommonFieldPaths()
        {
            return new string[] { "objs.Array.data[0]" };
        }
    }
}
