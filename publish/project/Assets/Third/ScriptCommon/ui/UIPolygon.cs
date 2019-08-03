using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace Game
{
    [ExecuteInEditMode]
    public class UIPolygon : Graphic
    {
        [SerializeField]
        private int startAngle = 90;
        [SerializeField]
        private float[] percents = new float[5] { 1, 1, 1, 1, 1 };

        private Vector3[] vertexes = null;
        private bool isDirty = true;

        void Update()
        {
#if UNITY_EDITOR
            isDirty = true;
#endif
            if (isDirty)
            {
                isDirty = false;
                refresh();
            }
        }

        void refresh()
        {
            var rect = gameObject.transform as RectTransform;
            var r = Mathf.Min(rect.sizeDelta.x / 2, rect.sizeDelta.y / 2);
            vertexes = new Vector3[percents.Length + 1];
            vertexes[0] = Vector3.zero;
            for (int i = 0; i < percents.Length; i++)
            {
                float angle = (startAngle - i * 360 / percents.Length) * Mathf.PI / 180f;
                float x = Mathf.Cos(angle) * r * percents[i];
                float y = Mathf.Sin(angle) * r * percents[i];
                vertexes[i + 1] = new Vector3(x, y, 0);
            }
            SetAllDirty();
        }

        protected override void OnPopulateMesh(VertexHelper toFill)
        {
            if (vertexes == null) return;

            Color32 color32 = color;
            toFill.Clear();
            for (int i = 0, length = vertexes.Length; i < length; i++)
            {
                toFill.AddVert(vertexes[i], color32, Vector2.zero);
            }
            for (int i = 0; i < percents.Length; i++)
            {
                toFill.AddTriangle((i + 1) % percents.Length + 1, 0, i + 1);
            }
        }

        public float GetPercent(int index)
        {
            if (index < 0 || index >= percents.Length)
                return 0;
            return percents[index];
        }

        public void SetPercent(int index, float value)
        {
            if (index < 0 || index >= percents.Length) return;
            percents[index] = Mathf.Clamp01(value);
            isDirty = true;
        }
    }
}