using UnityEngine.UI;
using UnityEngine;

namespace UnityEditor.UI
{
    [CustomEditor(typeof(Game.UIGroupListItem), true)]
    class GroupListItemEditor : ListItemEditor
    {
        SerializedProperty m_objs;

        protected override void OnEnable()
        {
            m_objs = serializedObject.FindProperty("objs");

            m_objs.arraySize = 3;
            var itemName = serializedObject.FindProperty("objs.Array.data[0].Name");
            itemName.stringValue = "selectedState";
            itemName = serializedObject.FindProperty("objs.Array.data[1].Name");
            itemName.stringValue = "catalogItem";
            itemName = serializedObject.FindProperty("objs.Array.data[2].Name");
            itemName.stringValue = "children";

            serializedObject.ApplyModifiedProperties();
        }

        protected override string[] GetCommonFieldPaths()
        {
            return new string[] { "objs.Array.data[0]", "objs.Array.data[1]", "objs.Array.data[2]" };
        }
    }
}