using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine.EventSystems;

namespace UnityEngine.UI
{
    /// <summary>
    ///   <para>A component that represents a group of Toggles.</para>
    /// </summary>
    /// 
    [AddComponentMenu("Component/UI/ActiveToggleGroup"), DisallowMultipleComponent]
    public class ActiveToggleGroup : UIBehaviour
    {
        public Action<int> onValueChanged = null;

        [SerializeField]
        private bool m_AllowSwitchOff;

        private List<ActiveToggle> m_Toggles = new List<ActiveToggle>();
        private ActiveToggle m_lastToggle = null;

        /// <summary>
        ///   <para>Is it allowed that no toggle is switched on?</para>
        /// </summary>
        public bool allowSwitchOff
        {
            get
            {
                return this.m_AllowSwitchOff;
            }
            set
            {
                this.m_AllowSwitchOff = value;
            }
        }

        protected ActiveToggleGroup()
        {
        }

        private void ValidateToggleIsInGroup(ActiveToggle toggle)
        {
            if (toggle == null || !this.m_Toggles.Contains(toggle))
            {
                throw new ArgumentException(string.Format("Toggle {0} is not part of ToggleGroup {1}", new object[]
                {
                    toggle,
                    this
                }));
            }
        }

        /// <summary>
        ///   <para>Notify the group that the given toggle is enabled.</para>
        /// </summary>
        /// <param name="toggle"></param>
        public void NotifyToggleOn(ActiveToggle toggle)
        {
            this.ValidateToggleIsInGroup(toggle);
            for (int i = 0; i < this.m_Toggles.Count; i++)
            {
                if (!(this.m_Toggles[i] == toggle))
                {
                    this.m_Toggles[i].isOn = false;
                }
            }
            int index = m_Toggles.IndexOf(toggle);
            if (onValueChanged != null && m_lastToggle != toggle)
                onValueChanged(index);
            m_lastToggle = toggle;
        }

        public int Selected
        {
            set
            {
                if (value >=0 && value < this.m_Toggles.Count)
                {
                    this.m_Toggles[value].SetOn();
                }
                else
                {
                    var curSelected = Selected;
                    if(curSelected >= 0 && curSelected < this.m_Toggles.Count)
                    {
                        this.m_Toggles[curSelected].isOn = false;
                    }
                    m_lastToggle = null;
                }
            }
            get
            {
                return this.m_Toggles.FindIndex((ActiveToggle x) => x.isOn);
            }
        }

        /// <summary>
        ///   <para>Toggle to unregister.</para>
        /// </summary>
        /// <param name="toggle">Unregister toggle.</param>
        public void UnregisterToggle(ActiveToggle toggle)
        {
            if (this.m_Toggles.Contains(toggle))
            {
                this.m_Toggles.Remove(toggle);
            }
        }

        /// <summary>
        ///   <para>Register a toggle with the group.</para>
        /// </summary>
        /// <param name="toggle">To register.</param>
        public void RegisterToggle(ActiveToggle toggle)
        {
            if (!this.m_Toggles.Contains(toggle))
            {
                this.m_Toggles.Add(toggle);
            }
        }

        /// <summary>
        ///   <para>Are any of the toggles on?</para>
        /// </summary>
        public bool AnyTogglesOn()
        {
            return this.m_Toggles.Find((ActiveToggle x) => x.isOn) != null;
        }

        /// <summary>
        ///   <para>Returns the toggles in this group that are active.</para>
        /// </summary>
        /// <returns>
        ///   <para>The active toggles in the group.</para>
        /// </returns>
        public IEnumerable<ActiveToggle> ActiveToggles()
        {
            return from x in this.m_Toggles
                   where x.isOn
                   select x;
        }

        /// <summary>
        ///   <para>Switch all toggles off.</para>
        /// </summary>
        public void SetAllTogglesOff()
        {
            bool allowSwitchOff = this.m_AllowSwitchOff;
            this.m_AllowSwitchOff = true;
            for (int i = 0; i < this.m_Toggles.Count; i++)
            {
                this.m_Toggles[i].isOn = false;
            }
            this.m_AllowSwitchOff = allowSwitchOff;
        }

        public ActiveToggle GetToggle(int index)
        {
            if (isValidIndex(index))
            {
                return m_Toggles[index];
            }
            return null;
        }

        protected override void Start()
        {
            if (isValidIndex(Selected))
                m_lastToggle = this.m_Toggles[Selected];
        }

        private bool isValidIndex(int index)
        {
            return index >= 0 && index < m_Toggles.Count;
        }
    }
}
