import { Global as G } from 'System/global'
import { UILayer, CommonForm } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Color } from 'System/utils/ColorUtil'
import { Macros } from 'System/protocol/Macros'
import { GuildTools } from 'System/guild/GuildTools'

export class GuildSetPositionView extends CommonForm {

    private btnClose: UnityEngine.GameObject;

    private textInfo: UnityEngine.UI.Text;
    private optionGroup: UnityEngine.UI.ActiveToggleGroup;

    private btnOk: UnityEngine.GameObject;
    private btnCancel: UnityEngine.GameObject;

    private memberInfo: Protocol.GuildMemberInfo;
    private readonly options: number[] = [Macros.GUILD_GRADE_CHAIRMAN, Macros.GUILD_GRADE_VICE_CHAIRMAN, Macros.GUILD_GRADE_ELDER, Macros.GUILD_GRADE_MEMBER];

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GuildSetPositionView;
    }

    protected initElements() {
        this.btnClose = this.elems.getElement('btnClose');

        this.textInfo = this.elems.getText('textInfo');
        this.optionGroup = this.elems.getToggleGroup('optionGroup');

        this.btnOk = this.elems.getElement('btnOk');
        this.btnCancel = this.elems.getElement('btnCancel');
    }

    protected initListeners() {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.btnOk, this.onClickBtnOk);
        this.addClickListener(this.btnCancel, this.onClickBtnClose);
    }

    onOpen() {
        let defaultIdx = -1;
        let cnt = this.options.length;
        for (let i = 0; i < cnt; i++) {
            if (this.options[i] == this.memberInfo.m_ucGrade) {
                this.optionGroup.GetToggle(i).enabled = false;
            } else {
                this.optionGroup.GetToggle(i).enabled = true;
                if (defaultIdx < 0) {
                    defaultIdx = i;
                }
            }
        }
        if (defaultIdx < 0) {
            defaultIdx = 0;
        }
        this.optionGroup.Selected = defaultIdx;

        this.textInfo.text = uts.format('您要将{0}设置为哪个职位?',
            TextFieldUtil.getColorText(GuildTools.getMemberNameWithPosition(this.memberInfo.m_stBaseProfile.m_szNickName, this.memberInfo.m_ucGrade), Color.GREEN));
    }

    onClose() {
    }

    open(memberInfo: Protocol.GuildMemberInfo) {
        this.memberInfo = memberInfo;
        super.open();
    }

    private onClickBtnClose() {
        this.close();
    }

    private onClickBtnOk() {
        // 设置等级
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildGradeSetRequest(this.memberInfo.m_stRoleID, this.options[this.optionGroup.Selected]));
        this.close();
    }
}