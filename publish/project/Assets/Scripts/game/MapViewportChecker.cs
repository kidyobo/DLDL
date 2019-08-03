using System;
using UnityEngine;

namespace Assets.Scripts.game.camera
{
    public class MapViewportChecker : MonoBehaviour
    {
        Action<float, float, float> onChange;

        private float checkDis = 1f;
        private Vector3 lastPosition = new Vector3(-10000f, 0, -10000f);

        public void SetCheckDis(float dis)
        {
            checkDis = dis;
        }

        public void SetListener(Action<float, float, float> listener)
        {
            onChange = listener;
            if (lastPosition != Vector3.zero)
                listener(lastPosition.x, lastPosition.y, lastPosition.z);
        }

        public void Reset()
        {
            lastPosition = new Vector3(-10000f, 0, -10000f);
        }

        void Update()
        {
            Check();
        }

        private void Check()
        {
            if (onChange == null)
                return;

            Vector3 curPosition = transform.position;
            Vector3 drt = lastPosition - curPosition;
            if (Mathf.Abs(drt.x) > checkDis || Mathf.Abs(drt.z) / 2 > checkDis)
            {
                onChange(curPosition.x, curPosition.y, curPosition.z);
                lastPosition = curPosition;
            }
        }
    }
}