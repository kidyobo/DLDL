import { Global as G } from "System/global"
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { MainView } from "System/main/view/MainView"
import { GameParas } from 'System/data/GameParas'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { Macros } from "System/protocol/Macros"
import { ErrorId } from "System/protocol/ErrorId"
import { KeyWord } from "System/constants/KeyWord"
import { LoginView } from "System/login/view/LoginView"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { UIPathData } from "System/data/UIPathData"
import { LoginTip } from 'System/login/view/LoginTip'
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { Color } from 'System/utils/ColorUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { ChannelClean } from 'System/chat/ChannelClean'
import { NoticeView } from 'System/login/view/NoticeView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ReportType } from 'System/channel/ChannelDef'
import { TimeoutFlag } from "../../System/utils/TimeoutUtil";

//创建角色窗口
export class CreateRoleView20 extends CommonForm {
    private qihun: UnityEngine.GameObject;
    private shouhun: UnityEngine.GameObject;
    private selectIndex: number = -1;
    private nameInputField: UnityEngine.UI.InputField;

    private profGroup: UnityEngine.UI.ActiveToggleGroup;

    private sz: UnityEngine.GameObject;
    private qz: UnityEngine.GameObject;

    private female: UnityEngine.GameObject;
    private male: UnityEngine.GameObject;

    private onDragListener: UnityEngine.GameObject;

    private creating: TimeoutFlag = new TimeoutFlag();

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.CreateRoleView;
    }

    protected initElements() {
        this.qihun = this.elems.getElement("qihun");
        this.shouhun = this.elems.getElement("shouhun");
        this.nameInputField = this.elems.getInputField("nameInputField");
        this.profGroup = this.elems.getToggleGroup('profGroup');
        this.onDragListener = this.elems.getElement("onDragListener");
        // ui锚点设置不当，为避免新包更新，此处暂时用代码修正
        //let rt = this.profGroup.transform as UnityEngine.RectTransform;
        //rt.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Left, 130, 0);
        //rt.SetInsetAndSizeFromParentEdge(UnityEngine.RectTransform.Edge.Bottom, 263, 0);
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement("BT_Return"), this.onClickReturnBt);
        this.addClickListener(this.elems.getElement("BT_Confirm"), this.onEnterClick);
        this.addClickListener(this.elems.getElement("BT_Random"), this.onClickRandomNameBt);
        this.addToggleGroupListener(this.profGroup, this.onSelectProf);
        Game.UIDragListener.Get(this.onDragListener).onDrag = delegate(this, this.onDrag);


    }


    protected onOpen() {
        G.MapCamera.setCameraEnable(false);
        this.sz = UnityEngine.GameObject.Find("hero_male");
        this.qz = UnityEngine.GameObject.Find("hero_female");
        this.female = UnityEngine.GameObject.Find("female");
        this.male = UnityEngine.GameObject.Find("male");
        this.male.SetActive(true);
        this.female.SetActive(false);
        //this.sz.SetActive(true);
        //this.qz.SetActive(false)
        let loginTipView = G.Uimgr.getForm<LoginTip>(LoginTip);
        if (loginTipView != null) {
            loginTipView.close();
        }
        G.ViewCacher.serverSelectView.close();
        let noticeView = G.Uimgr.getForm<NoticeView>(NoticeView);
        if (noticeView != null) {
            noticeView.close();
        }
        this.selectIndex = 0;
      
        G.ChannelSDK.report(ReportType.CREATINGROLE);
        
        this.profGroup.Selected = Math.floor(Math.random() * 2);
        this.onSelectProf(this.profGroup.Selected);
        this.randomName();
    }

    protected onClose() {
        G.MapCamera.setCameraEnable(true);
    }

    private onSelectProf(index: number) {
        if (this.selectIndex != index) {
            if (index == 0) {
                //this.qz.SetActive(false);
                //this.sz.SetActive(true);
                this.female.SetActive(false);
                this.male.SetActive(true);
                Game.Tools.SetGameObjectLocalRotation(this.sz, 0, 0, 0);
                this.qihun.SetActive(false);
                this.shouhun.SetActive(true);
            }
            else {
                //this.qz.SetActive(true);
                //this.sz.SetActive(false);
                this.female.SetActive(true);
                this.male.SetActive(false);
                Game.Tools.SetGameObjectLocalRotation(this.qz, 0, 0, 0);
                this.qihun.SetActive(true);
                this.shouhun.SetActive(false);
            }
            this.selectIndex = index;
            this.randomName();
        }
    }
    //返回按钮 
    private onClickReturnBt() {
        G.AudioMgr.playBtnClickSound();
        this.close();
        G.ModuleMgr.loginModule.setActive(true);
        G.comformcreaterole = false;
    }

    private onClickRandomNameBt() {
        //通过库来加载随机姓名
        G.AudioMgr.playBtnClickSound();
        this.randomName();
    }

    private randomName(): void {
        let name: string = null;
        let arr = G.DataMgr.modelData.m_nameMap;
        let length = arr.length;
        let r1 = Math.floor(Math.random() * length);
        let r2 = Math.floor(Math.random() * length);
        let r3 = Math.floor(Math.random() * length);
        if (this.selectIndex == 0) {
            //选择男姓名时
            name = arr[r1].m_name1 + arr[r2].m_name2 + arr[r3].m_name3;
        } else {
            //选择女姓名时
            name = arr[r1].m_name4 + arr[r2].m_name5 + arr[r3].m_name6;
        }
        //随机生成姓名,默认为女
        this.nameInputField.text = name;
    }

    /**
	*点击进入游戏的响应事件
	* @param e
	*
	*/
    private onEnterClick(): void {
        //点击进入游戏按钮，进行创建角色,对服务器发送创角请求
        G.AudioMgr.playBtnClickSound();
        let roleName: string = this.nameInputField.text;
        roleName = RegExpUtil.removeAllBlanks(roleName);

        let invalidTip: string;
        if (0 == roleName.length) {
            invalidTip = '请输入名字';
        } else {
            let resLen: number = this.getNameLength(roleName);  //取得输入名字的字节数，进行判断
            //超过6个中文或者12个英文
            if (resLen > 12) {
                invalidTip = '名字请勿超过6个字符';
            } else if (resLen <= 2) {
                invalidTip = '名字需包含至少2个字符';
            } else if (ChannelClean.isInvalidRoleName(roleName)) {
                invalidTip = '名字中包含非法字符';
            }
        }
        if (null != invalidTip) {
            G.TipMgr.showConfirm(invalidTip, ConfirmCheck.noCheck, '确定', null);
        } else {
            if (this.creating.value) {
                G.TipMgr.addMainFloatTip('正在创建角色中，请稍候！');
                return;
            }
            this.creating.start(1000);

            let gameParas: GameParas = G.DataMgr.gameParas;
            gameParas.prof = this.selectIndex == 0 ? KeyWord.PROFTYPE_WARRIOR : KeyWord.PROFTYPE_HUNTER;
            gameParas.gender = this.selectIndex == 0 ? KeyWord.GENDERTYPE_BOY : KeyWord.GENDERTYPE_GIRL;
            uts.log('创建角色：uin = ' + gameParas.uin + ', worldID = ' + gameParas.worldID);
            let cmd = ProtocolUtil.getCreateRole(gameParas.worldID, gameParas.uin,
                gameParas.prof, gameParas.gender, roleName, 0,
                gameParas.platformType, gameParas.clientType,
                gameParas.isAdult, gameParas.platTime, gameParas.serverID,
                gameParas.username, gameParas.sign, G.ChannelSDK.NewChannelId, UnityEngine.SystemInfo.deviceUniqueIdentifier);
            G.ModuleMgr.netModule.sendMsg(cmd);
            G.comformcreaterole = true;
        }
    }

    /**
    *获取名字的字节数
    * @param name
    * @return
    *
    */
    private getNameLength(name: string): number {
        //charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
        let len: number = 0;
        for (let i: number = 0; i < name.length; i++) {
            len += name.charCodeAt(i) > 255 ? 2 : 1;
        }
        return len;
    }

    /**
  * 滑动屏幕人物旋转
  * @param x
  * @param y
  */
    public onDrag() {
        let delta = Game.UIDragListener.eventData.delta;
        let roatespeed: number = 0.6;
        if (this.selectIndex == 0) {
            Game.Tools.SetGameObjectLocalRotation(this.sz, 0, -roatespeed * delta.x + this.sz.transform.localRotation.eulerAngles.y, 0);
        }
        else {
            Game.Tools.SetGameObjectLocalRotation(this.qz, 0, -roatespeed * delta.x + this.qz.transform.localRotation.eulerAngles.y, 0);
        }
    }
}