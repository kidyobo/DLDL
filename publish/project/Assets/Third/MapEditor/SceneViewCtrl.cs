#if UNITY_EDITOR
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SceneViewCtrl : MonoBehaviour
{
    public Button BT_Return;
    public Button BT_Create;

    public GameObject propertyPanel;
    public Button propertyPanel_close;
    public Dropdown type;
    public InputField id;
    public Dropdown direction;
    public Button move;
    public Button delete;
    public Button confirm;
    public Text pos;
    public Text mousePos;
    public Text sceneSize;
    public Toggle reborn = null;
    private UnitView selectView = null;
    private bool beginMove = false;
    // Use this for initialization
    void Start()
    {
        BT_Return.onClick.AddListener(OnClickReturn);
        BT_Create.onClick.AddListener(OnClickCreate);
        SceneEditor.instance.follower.onClick = OnClick;

        propertyPanel_close.onClick.AddListener(OnPropertyPanelCloseClick);
        propertyPanel.SetActive(false);

        move.onClick.AddListener(OnMove);
        delete.onClick.AddListener(OnDelete);
        confirm.onClick.AddListener(OnModify);
        id.onEndEdit.AddListener(OnEndEditID);
        sceneSize.text = SceneEditor.instance.data.width + "," + SceneEditor.instance.data.height;
    }
    void OnDestroy()
    {
        SceneEditor.instance.follower.onClick = null;
    }
    void OnClickReturn()
    {
        SceneEditor.instance.SaveScene();
        GameObject.Destroy(this.gameObject);
        SceneEditor.instance.LoadSelectView();
    }
    void OnClickCreate()
    {
        var unit = new UnitBase(this.selectView ? this.selectView.id : 0, this.selectView ? this.selectView.direction : (byte)0, 0, 0);
        var target = SceneEditor.instance.follower.target;
        var pos = target.position;
        unit.SetWorldPosition(pos);
        if (this.selectView != null)
        {
            UnitView v = null;
            switch (this.selectView.unitType)
            {
                case UnitType.monster:
                    v = SceneEditor.instance.CreateNewMonster(unit);
                    break;
                case UnitType.npc:
                    v = SceneEditor.instance.CreateNewNPC(unit);
                    break;
                case UnitType.transport:
                    v = SceneEditor.instance.CreateNewTransport(unit);
                    break;
            }
            this.selectView = v;
        }
        else
        {
            var v = SceneEditor.instance.CreateNewNPC(unit);
            this.selectView = v;
        }
        OnSelectTarget(selectView);
    }
    void OnClick()
    {
        //选择单位
        RaycastHit hit;
        if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit,1000,1<<8))
        {
            var com = hit.collider.gameObject.GetComponent<UnitView>();
            if (com != null)
            {
                OnSelectTarget(com);

            }
        }
    }

    void OnSelectTarget(UnitView com)
    {
        direction.onValueChanged.RemoveAllListeners();
        type.onValueChanged.RemoveAllListeners();
        if (com == null)
        {
            move.gameObject.SetActive(false);
            delete.gameObject.SetActive(false);
            confirm.gameObject.SetActive(true);
        }
        else
        {
            SceneEditor.instance.SelectTarget(com.gameObject);
            propertyPanel.SetActive(true);
            move.gameObject.SetActive(true);
            delete.gameObject.SetActive(true);
            confirm.gameObject.SetActive(false);
        }
        selectView = com;

        id.text = com.id.ToString();
        type.value = (int)com.unitType;
        switch (com.direction)
        {
            case 4:
                direction.value = 0;
                break;
            case 8:
                direction.value = 1;
                break;
            case 6:
                direction.value = 2;
                break;
            case 2:
                direction.value = 3;
                break;
            case 5:
                direction.value = 4;
                break;
            case 7:
                direction.value = 5;
                break;
            case 3:
                direction.value = 6;
                break;
            case 1:
                direction.value = 7;
                break;
        }

        direction.onValueChanged.AddListener(OnSelectDirection);
        type.onValueChanged.AddListener(OnSelectType);

        BT_Create.gameObject.SetActive(false);
        BT_Return.gameObject.SetActive(false);
        UpdatePos();
    }
    void OnPropertyPanelCloseClick()
    {
        //修改属性
        SceneEditor.instance.SelectTarget(null);
        propertyPanel.SetActive(false);
        BT_Create.gameObject.SetActive(true);
        BT_Return.gameObject.SetActive(true);
    }

    void Update()
    {
        RaycastHit hit;
        if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit, 100000, LayerMask.GetMask("Floor")))
        {
            var p = hit.point;
            mousePos.text = (short)(p.x * 20) + "," + (SceneEditor.instance.data.height-(short)(p.z * 20));
        }
        else
        {
            mousePos.text = "不在地面上";
        }

        if (beginMove)
        {
            if (Input.GetMouseButtonDown(0)&& hit.collider!=null)
            {
                selectView.transform.position = hit.point;
                SceneEditor.instance.SelectTarget(selectView.gameObject);
            }
        }

        if (Input.GetMouseButtonDown(1))
        {
            if (beginMove)
            {
                OnMoveEnd();
            }
            else if (selectView != null)
            {
                OnPropertyPanelCloseClick();
            }
        }
    }

    void OnMove()
    {
        beginMove = true;
        SceneEditor.instance.follower.lockWSAD = false;
        this.propertyPanel.SetActive(false);
    }
    void OnMoveEnd()
    {
        SceneEditor.instance.follower.LockTarget(selectView.gameObject);
        SceneEditor.instance.follower.lockWSAD = true;
        beginMove = false;
        this.propertyPanel.SetActive(true);
        UpdatePos();
        selectView.DirtyPosition();
    }
    void UpdatePos()
    {
        var p = selectView.transform.position;
        pos.text = (short)(p.x * 20) + "," + (short)(SceneEditor.instance.data.height-p.z * 20);
    }
    void OnDelete()
    {
        GameObject.Destroy(selectView.gameObject);
        OnPropertyPanelCloseClick();
    }
    void OnModify()
    {
        OnPropertyPanelCloseClick();
    }

    void OnSelectDirection(int d)
    {
        switch (d)
        {
            case 0:
                selectView.direction = 4;
                break;
            case 1:
                selectView.direction = 8;
                break;
            case 2:
                selectView.direction = 6;
                break;
            case 3:
                selectView.direction = 2;
                break;
            case 4:
                selectView.direction = 5;
                break;
            case 5:
                selectView.direction = 7;
                break;
            case 6:
                selectView.direction = 3;
                break;
            case 7:
                selectView.direction = 1;
                break;
        }
        SceneEditor.instance.RebuildUnit(selectView);
    }
    void OnSelectType(int d)
    {
        selectView.unitType = (UnitType)d;
        SceneEditor.instance.RebuildUnit(selectView);
    }

    void OnEndEditID(string idstr)
    {
        selectView.id = int.Parse(idstr);
        SceneEditor.instance.RebuildUnit(selectView);
    }
}
#endif