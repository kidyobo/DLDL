using UnityEngine;

namespace UnityEditor.UI
{
    class RectOffsetEx
    {
        public int left;
        public int top;
        public int right;
        public int bottom;
        public int this[int index]
        {
            get
            {
                if (index == 0) return left;
                else if (index == 1) return top;
                else if (index == 2) return right;
                else if (index == 3) return bottom;
                else return -1;
            }
        }
    }
    class ListProperty
    {
        public string name;
        public string dataPath;
        public string valuePath;
        public string namePath;
        public ListProperty(string name, string dataPath)
        {
            this.name = name;
            this.dataPath = dataPath;
            this.valuePath = dataPath + ".Value";
            this.namePath = dataPath + ".Name";
        }
        public void SetPropertyName(SerializedObject serializedObject)
        {
            serializedObject.FindProperty(namePath).stringValue = name;
        }
        public void SetValue(SerializedObject serializedObject, double val)
        {
            serializedObject.FindProperty(valuePath).doubleValue = val;
        }
        public void SetValue(SerializedObject serializedObject, bool val)
        {
            serializedObject.FindProperty(valuePath).boolValue = val;
        }
        public double GetDoubleValue(SerializedObject serializedObject)
        {
            return serializedObject.FindProperty(valuePath).doubleValue;
        }
        public bool GetBoolValue(SerializedObject serializedObject)
        {
            return serializedObject.FindProperty(valuePath).boolValue;
        }
        public RectOffsetEx GetRectOffsetValue(SerializedObject serializedObject)
        {
            var so = serializedObject.FindProperty(valuePath);
            var ro = new RectOffsetEx();
            ro.left = so.FindPropertyRelative("m_Left").intValue;
            ro.right = so.FindPropertyRelative("m_Right").intValue;
            ro.top = so.FindPropertyRelative("m_Top").intValue;
            ro.bottom = so.FindPropertyRelative("m_Bottom").intValue;
            return ro;
        }
        public Object GetObjectReferenceValue(SerializedObject serializedObject)
        {
            return serializedObject.FindProperty(valuePath).objectReferenceValue;
        }
        public Vector2 GetVector2Value(SerializedObject serializedObject)
        {
            return serializedObject.FindProperty(valuePath).vector2Value;
        }
    }
    class ListPropertyDefines
    {
        public static ListProperty type = new ListProperty("type", "numbers.Array.data[0]");
        public static ListProperty itemTempl = new ListProperty("itemTempl", "objs.Array.data[0]");
        public static ListProperty padding = new ListProperty("padding", "rectoffsets.Array.data[0]");
        public static ListProperty itemSize = new ListProperty("itemSize", "vector2s.Array.data[0]");
        public static ListProperty spacing = new ListProperty("spacing", "vector2s.Array.data[1]");
        public static ListProperty canScroll = new ListProperty("canScroll", "bools.Array.data[0]");
        public static ListProperty multipleChoice = new ListProperty("multipleChoice", "bools.Array.data[1]");
        public static ListProperty virtualItem = new ListProperty("virtualItem", "bools.Array.data[2]");
        public static ListProperty cannotSelect = new ListProperty("cannotSelect", "bools.Array.data[3]");
        public static ListProperty virtualSubList = new ListProperty("virtualSubList", "bools.Array.data[4]");
    }

    [CustomEditor(typeof(Game.UIList), true)]
    public class ListEditor : CustomBehaviourEditor
    {
        SerializedProperty m_numbers;
        SerializedProperty m_objs;
        SerializedProperty m_vector2s;
        SerializedProperty m_bools;
        SerializedProperty m_rectoffsets;
        ListPreViewEdtor m_preView = new ListPreViewEdtor();

        protected override void OnEnable()
        {
            m_numbers = serializedObject.FindProperty("numbers");
            m_objs = serializedObject.FindProperty("objs");
            m_vector2s = serializedObject.FindProperty("vector2s");
            m_bools = serializedObject.FindProperty("bools");
            m_rectoffsets = serializedObject.FindProperty("rectoffsets");

            var curnumberCnt = m_numbers.arraySize;
            m_numbers.arraySize = 1;
            ListPropertyDefines.type.SetPropertyName(serializedObject);
            if (curnumberCnt == 0)
            {
                ListPropertyDefines.type.SetValue(serializedObject, 1);
            }

            m_objs.arraySize = 1;
            ListPropertyDefines.itemTempl.SetPropertyName(serializedObject);

            m_rectoffsets.arraySize = 1;
            ListPropertyDefines.padding.SetPropertyName(serializedObject);

            m_vector2s.arraySize = 2;
            ListPropertyDefines.itemSize.SetPropertyName(serializedObject);
            ListPropertyDefines.spacing.SetPropertyName(serializedObject);

            m_bools.arraySize = 5;
            ListPropertyDefines.canScroll.SetPropertyName(serializedObject);
            ListPropertyDefines.multipleChoice.SetPropertyName(serializedObject);
            ListPropertyDefines.virtualItem.SetPropertyName(serializedObject);
            ListPropertyDefines.cannotSelect.SetPropertyName(serializedObject);
            ListPropertyDefines.virtualSubList.SetPropertyName(serializedObject);

            serializedObject.ApplyModifiedProperties();
        }

        protected override void CustomLayoutElementFields()
        {
            var options = new string[] { "水平滚动", "垂直滚动" };
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField(ListPropertyDefines.type.name, GUILayout.Width(100f));
            int type = (int)ListPropertyDefines.type.GetDoubleValue(serializedObject);
            ListPropertyDefines.type.SetValue(serializedObject, EditorGUILayout.Popup("", type, options));
            EditorGUILayout.EndHorizontal();
        }

        protected override string[] GetCommonFieldPaths()
        {
            if (ListPropertyDefines.virtualItem.GetBoolValue(serializedObject))
            {
                ListPropertyDefines.canScroll.SetValue(serializedObject, true);
                return new string[] { ListPropertyDefines.itemTempl.dataPath
                    , ListPropertyDefines.padding.dataPath
                    , ListPropertyDefines.itemSize.dataPath
                    , ListPropertyDefines.spacing.dataPath
                    , ListPropertyDefines.multipleChoice.dataPath
                    , ListPropertyDefines.virtualItem.dataPath
                    , ListPropertyDefines.cannotSelect.dataPath};
            }
            else
            {
                return new string[] { ListPropertyDefines.itemTempl.dataPath
                    , ListPropertyDefines.padding.dataPath
                    , ListPropertyDefines.itemSize.dataPath
                    , ListPropertyDefines.spacing.dataPath
                    , ListPropertyDefines.canScroll.dataPath
                    , ListPropertyDefines.multipleChoice.dataPath
                    , ListPropertyDefines.virtualItem.dataPath
                    , ListPropertyDefines.cannotSelect.dataPath};
            }
        }

        public override void OnInspectorGUI()
        {
            base.OnInspectorGUI();
            m_preView.OnInspectorGUI(serializedObject, target, m_rectoffsets);
        }
    }
}

namespace UnityEditor.UI
{
    class RemoveTestListItems
    {
        [UnityEditor.InitializeOnLoadMethod]
        static void StartInitializeOnLoadMethod()
        {
            UnityEditor.PrefabUtility.prefabInstanceUpdated = delegate (GameObject instance)
            {
                var prefab = UnityEditor.PrefabUtility.GetPrefabParent(instance) as GameObject;
                if (prefab == null)
                    return;

                Transform container;
                if (Find(prefab.transform, out container, ListPreViewEdtor.testContainer))
                {
                    EditorApplication.delayCall = delegate
                    {
                        GameObject.DestroyImmediate(container.gameObject, true);
                        EditorUtility.SetDirty(prefab);
                        AssetDatabase.SaveAssets();
                    };
                }
            };
        }

        static bool Find(Transform parent, out Transform find, string tag)
        {
            if (parent.name == tag)
            {
                find = parent;
                return true;
            }
            for (int i = 0, n = parent.childCount; i < n; i++)
            {
                if (Find(parent.GetChild(i), out find, tag))
                    return true;
            }
            find = null;
            return false;
        }
    }

    enum ListType
    {
        Horizontal = 0,
        Vertical,
    }

    class ListAxis
    {
        public ListType type = ListType.Horizontal;
        public ListAxis(ListType type) { this.type = type; }
        public int row { get { return (this.type == ListType.Vertical) ? 1 : 0; } }
        public int col { get { return this.row == 0 ? 1 : 0; } }
        public int scrollDir { get { return this.row == 0 ? -1 : 1; } }
        public int itemRowDir { get { return this.row == 0 ? 1 : -1; } }
        public int itemColDir { get { return this.row == 0 ? -1 : 1; } }
        public int left { get { return this.row == 0 ? 1 : 0; } }
        public int top { get { return this.row == 0 ? 0 : 1; } }
        public int right { get { return this.row == 0 ? 3 : 2; } }
        public int bottom { get { return this.row == 0 ? 2 : 3; } }
    }

    class ListPreViewEdtor
    {
        public const string testContainer = "$testContainer$";
        private ListAxis axis = new ListAxis(ListType.Horizontal);
        private int itemCount = 0;

        public void OnInspectorGUI(SerializedObject serializedObject, UnityEngine.Object target, SerializedProperty rectoffsets)
        {
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField("testItemCount", GUILayout.Width(100f));
            itemCount = Mathf.Min(EditorGUILayout.IntField(itemCount), 50);
            EditorGUILayout.EndHorizontal();

            var go = (target as Component).gameObject;
            var container = go.transform.Find(testContainer) as RectTransform;
            if (container == null && itemCount > 0)
            {
                // create container
                var c = new GameObject(testContainer);
                if (ListPropertyDefines.canScroll.GetBoolValue(serializedObject))
                {
                    c.AddComponent<UnityEngine.UI.RectMask2D>();
                    container = c.GetComponent<RectTransform>();
                }
                else
                {
                    container = c.AddComponent<RectTransform>();
                }
                container.SetParent(go.transform);
                initTransform(container);
                var sizeDelta = (go.transform as RectTransform).rect.size;
                container.sizeDelta = sizeDelta;
                container.transform.SetSiblingIndex(0);
            }

            if (container != null)
            {
                var sizeDelta = (go.transform as RectTransform).rect.size;
                container.sizeDelta = sizeDelta;
            }

            if (container != null && itemCount == 0)
            {
                GameObject.DestroyImmediate(container.gameObject);
            }

            if (container != null && container.childCount < itemCount)
            {
                for (int i = 0, n = itemCount - container.childCount; i < n; i++)
                {
                    var itemTempl = ListPropertyDefines.itemTempl.GetObjectReferenceValue(serializedObject) as GameObject;
                    var newItem = GameObject.Instantiate(itemTempl);
                    newItem.transform.SetParent(container);
                    var rect = newItem.GetComponent<RectTransform>();
                    initTransform(rect);
                }
            }

            if (container != null && container.childCount > itemCount)
            {
                for (int i = container.childCount - 1; i >= itemCount; i--)
                {
                    GameObject.DestroyImmediate(container.GetChild(i).gameObject);
                }
            }

            sortItems(serializedObject, container);
        }

        private void initTransform(RectTransform rect)
        {
            rect.pivot = new Vector2(0, 1);
            rect.anchorMin = new Vector2(0, 1);
            rect.anchorMax = new Vector2(0, 1);
            rect.localScale = Vector3.one;
            rect.anchoredPosition = Vector2.zero;
        }

        private void sortItems(SerializedObject serializedObject, RectTransform container)
        {
            if (container == null)
                return;

            var count = container.childCount;
            var padding = ListPropertyDefines.padding.GetRectOffsetValue(serializedObject);
            var itemSize = ListPropertyDefines.itemSize.GetVector2Value(serializedObject);
            var spacing = ListPropertyDefines.spacing.GetVector2Value(serializedObject);
            var type = (ListType)ListPropertyDefines.type.GetDoubleValue(serializedObject);
            if (axis.type != type)
            {
                axis = new ListAxis(type);
            }

            Vector2 gridSize = itemSize + spacing;
            int cols = (int)Mathf.Max(1, (int)((container.sizeDelta[axis.col] - padding[axis.left] - padding[axis.right]) / gridSize[axis.col]));
            int rows = (int)Mathf.Ceil((float)count / cols);

            var itemPos = Vector2.zero;
            for (int row = 0, r = 0; row < rows; row++)
            {
                int rindex = row * cols;
                var rrect = container.GetChild(rindex) as RectTransform;
                for (int col = 0, c = 0; col < cols; col++)
                {
                    int index = row * cols + col;
                    if (index >= count) break;

                    var itemRect = container.GetChild(index) as RectTransform;
                    itemPos[axis.col] = axis.itemColDir * (padding[axis.left] + c);
                    itemPos[axis.row] = axis.itemRowDir * (padding[axis.top] + r);
                    itemRect.anchoredPosition = itemPos;
                    c += (int)gridSize[axis.col];
                }
                r += (int)(rrect.sizeDelta[axis.row] + spacing[axis.row]);
            }
        }
    }
}
