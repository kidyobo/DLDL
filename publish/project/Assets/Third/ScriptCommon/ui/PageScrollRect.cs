using UnityEngine.EventSystems;

namespace UnityEngine.UI
{
    public class PageScrollRect : ScrollRect
    {
        [SerializeField]
        private Vector2 itemSize = new Vector2(420, 415.9f);
        [SerializeField]
        private Vector2 spacing = Vector2.zero;
        [SerializeField]
        private float maxScale = 1.1f;
        [SerializeField]
        private int scaleRange = 600;
        [SerializeField]
        private float moveVelocity = 10f;

        private bool dragging = false;
        private bool moving = false;
        private Vector2 moveTarget = Vector2.zero;
        private Vector2 lastContentPos = Vector2.zero;
        private Vector2 moveDir = Vector2.zero;

        protected override void LateUpdate()
        {
            base.LateUpdate();
            if (dragging || velocity != Vector2.zero)
            {
                ScaleItems();
                moving = false;
                return;
            }

            if (moving)
            {
                int axisPos = (int)Mathf.Lerp(this.content.anchoredPosition[curAxis], moveTarget[curAxis], moveVelocity * Time.deltaTime);
                Vector2 pos = this.content.anchoredPosition;
                pos[curAxis] = axisPos;
                this.content.anchoredPosition = pos;
                if (this.content.anchoredPosition == moveTarget)
                {
                    moving = false;
                }
                ScaleItems();
            }
            else if (moveDir != Vector2.zero)
            {
                var gridsize = itemSize + spacing;
                int offset = (int)scrollOffset;
                if (scrollToTopLeft)
                    offset = (int)(Mathf.Floor((offset + gridsize[curAxis] - 1) / gridsize[curAxis]) * gridsize[curAxis]);
                else
                    offset = (int)(Mathf.Floor(offset / gridsize[curAxis]) * gridsize[curAxis]);
                moveTarget = this.content.anchoredPosition;
                moveTarget[curAxis] = curAxis==0 ? -offset : offset;

                if (this.content.anchoredPosition != moveTarget)
                {
                    moving = true;
                }
            }
        }

        public override void OnBeginDrag(PointerEventData eventData)
        {
            base.OnBeginDrag(eventData);
            dragging = true;
            lastContentPos = this.content.anchoredPosition;
        }

        public override void OnDrag(PointerEventData eventData)
        {
            base.OnDrag(eventData);
            moveDir = this.content.anchoredPosition - lastContentPos;
            lastContentPos = this.content.anchoredPosition;
        }

        public override void OnEndDrag(PointerEventData eventData)
        {
            base.OnEndDrag(eventData);
            dragging = false;
        }

        private void ScaleItems()
        {
            var rect = this.transform as RectTransform;
            var centerPos = scrollOffset + rect.rect.size[curAxis] / 2;
            for (int i = 0; i < this.content.childCount; i++)
            {
                var crect = this.content.GetChild(i) as RectTransform;
                var cpos = (curAxis == 0) ? crect.anchoredPosition[curAxis] : -crect.anchoredPosition[curAxis];
                var dis = Mathf.Abs(cpos - centerPos);
                float scale = Mathf.Lerp(maxScale, 1f, dis * 2 / scaleRange);
                crect.localScale = Vector2.one * scale;
            }
        }

        private int curAxis
        {
            get { return this.horizontal ? 0 : 1; }
        }

        private float scrollOffset
        {
            get
            {
                if (curAxis == 0) return -this.content.anchoredPosition[curAxis];
                else return this.content.anchoredPosition[curAxis];
            }
        }

        private bool scrollToTopLeft
        {
            get { return (curAxis == 0 && moveDir[curAxis] < 0) || (curAxis == 1 && moveDir[curAxis] > 0); }
        }
    }
}