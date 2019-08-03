using UnityEngine;
using UnityEngine.UI;
using System;
using UnityEngine.Events;
using UnityEngine.EventSystems;
using UnityEngine.Serialization;

namespace UnityEngine.UI
{
    /// <summary>
    ///   <para>A standard toggle that has an on / off state.</para>
    /// </summary>
    [AddComponentMenu("Component/UI/ActiveToggle"), RequireComponent(typeof(RectTransform))]
    [ExecuteInEditMode]
    public class ActiveToggle : UIBehaviour, IEventSystemHandler, IPointerClickHandler, ISubmitHandler, ICanvasElement
    {
        public bool interactable = true;
        public Selectable normalState = null;
        public Selectable selectedState = null;

        public float delay = 0;
        /// <summary>
        ///   <para>UnityEvent callback for when a toggle is toggled.</para>
        /// </summary>
        [Serializable]
        public class ToggleEvent : UnityEvent<bool>
        {
        }
        [SerializeField]
        private ActiveToggleGroup m_Group;

        /// <summary>
        ///   <para>Callback executed when the value of the toggle is changed.</para>
        /// </summary>
        public Toggle.ToggleEvent onValueChanged = new Toggle.ToggleEvent();

        [FormerlySerializedAs("m_IsActive"), SerializeField, Tooltip("Is the toggle currently on or off?")]
        private bool m_IsOn;

        /// <summary>
        ///   <para>Group the toggle belongs to.</para>
        /// </summary>
        public ActiveToggleGroup group
        {
            get
            {
                return this.m_Group;
            }
            set
            {
                this.m_Group = value;
                if (Application.isPlaying)
                {
                    this.SetToggleGroup(this.m_Group, true);
                    this.PlayEffect();
                }
            }
        }

        /// <summary>
        ///   <para>Is the toggle on.</para>
        /// </summary>
        public bool isOn
        {
            get
            {
                return this.m_IsOn;
            }
            set
            {
                this.Set(value);
            }
        }

        protected ActiveToggle()
        {
        }
#if UNITY_EDITOR
        protected override void OnValidate()
        {
            base.OnValidate();
            this.Set(this.m_IsOn, false);
            this.PlayEffect();
            UnityEditor.PrefabType prefabType = UnityEditor.PrefabUtility.GetPrefabType(this);
            if ((int)prefabType != 1 && !Application.isPlaying)
            {
                CanvasUpdateRegistry.RegisterCanvasElementForLayoutRebuild(this);
            }
        }
#endif

        /// <summary>
        ///   <para>Handling for when the canvas is rebuilt.</para>
        /// </summary>
        /// <param name="executing"></param>
        public virtual void Rebuild(CanvasUpdate executing)
        {
            if (executing == CanvasUpdate.Prelayout)
            {
                this.onValueChanged.Invoke(this.m_IsOn);
            }
        }

        /// <summary>
        ///   <para>See ICanvasElement.LayoutComplete.</para>
        /// </summary>
        public virtual void LayoutComplete()
        {
        }

        /// <summary>
        ///   <para>See ICanvasElement.GraphicUpdateComplete.</para>
        /// </summary>
        public virtual void GraphicUpdateComplete()
        {
        }

        protected override void Awake()
        {
            base.Awake();
            this.SetToggleGroup(this.m_Group, false);
        }

        protected override void OnEnable()
        {
            base.OnEnable();
            this.PlayEffect();
        }

        /// <summary>
        ///   <para>See MonoBehaviour.OnDisable.</para>
        /// </summary>
        protected override void OnDisable()
        {
            base.OnDisable();
        }

        private void SetToggleGroup(ActiveToggleGroup newGroup, bool setMemberValue)
        {
            ActiveToggleGroup group = this.m_Group;
            if (this.m_Group != null)
            {
                this.m_Group.UnregisterToggle(this);
            }
            if (setMemberValue)
            {
                this.m_Group = newGroup;
            }
            if (this.m_Group != null && this.IsActive())
            {
                this.m_Group.RegisterToggle(this);
            }
            if (newGroup != null && newGroup != group && this.isOn && this.IsActive())
            {
                this.m_Group.NotifyToggleOn(this);
            }
        }

        private void Set(bool value)
        {
            this.Set(value, true);
        }

        public void SetOn()
        {
            this.Set(true, true);
        }

        private void Set(bool value, bool sendCallback)
        {
            if (this.m_IsOn == value)
            {
                return;
            }
            this.m_IsOn = value;
            if (this.m_Group != null && this.IsActive() && (this.m_IsOn || (!this.m_Group.AnyTogglesOn() && !this.m_Group.allowSwitchOff)))
            {
                this.m_IsOn = true;
                this.m_Group.NotifyToggleOn(this);
            }
            this.PlayEffect();
            if (sendCallback)
            {
                this.onValueChanged.Invoke(this.m_IsOn);
            }
        }

        private void PlayEffect()
        {

            if (this.m_IsOn)
            {
                if (this.normalState != null)
                {
                    this.normalState.gameObject.SetActive(false);
                }
                if (this.selectedState != null)
                {
                    this.selectedState.gameObject.SetActive(true);
                }
            }
            else
            {
                if (this.normalState != null)
                {
                    this.normalState.gameObject.SetActive(true);
                }
                if (this.selectedState != null)
                {
                    this.selectedState.gameObject.SetActive(false);
                }
            }

        }

        protected override void Start()
        {
            this.PlayEffect();
        }

        private void InternalToggle()
        {
            if (!this.IsActive()||!this.interactable)
            {
                return;
            }
            this.isOn = !this.isOn;
        }

        /// <summary>
        ///   <para>Handling for when the toggle is 'clicked'.</para>
        /// </summary>
        /// <param name="eventData">Current event.</param>
        public virtual void OnPointerClick(PointerEventData eventData)
        {
            if(this.delay > 0)
            {
                this.Invoke("InternalToggle", this.delay);
            }
            else
            {
                this.InternalToggle();
            }
        }

        /// <summary>
        ///   <para>Handling for when the submit key is pressed.</para>
        /// </summary>
        /// <param name="eventData">Current event.</param>
        public virtual void OnSubmit(BaseEventData eventData)
        {
            this.InternalToggle();
        }
    }
}