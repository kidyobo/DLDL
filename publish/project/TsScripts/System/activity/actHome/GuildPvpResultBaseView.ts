import { Global as G } from 'System/global'
import { UILayer, CommonForm } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'

export class GuildPvpRankItem {
    /**排名*/
    private textRank: UnityEngine.UI.Text;
    /**名称*/
    private textName: UnityEngine.UI.Text;
    /**宗主名字*/
    private textMaster: UnityEngine.UI.Text;
    /**等级*/
    private textScore: UnityEngine.UI.Text;

    /**深浅交替背景*/
    private bg2: UnityEngine.GameObject;

    private textNone: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, hasNone: boolean, hasBg2: boolean) {
        this.textRank = ElemFinder.findText(go, 'textRank');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textMaster = ElemFinder.findText(go, 'textMaster');
        this.textScore = ElemFinder.findText(go, 'textScore');

        if (hasBg2) {
            this.bg2 = ElemFinder.findObject(go, 'bg2');
        }

        if (hasNone) {
            this.textNone = ElemFinder.findText(go, 'textNone');
        }
    }

    update(rank: number, name: string, master: string, score: number, showNone: boolean) {
        if (rank > 0) {
            this.textRank.text = rank.toString();
            this.textName.text = name;
            this.textMaster.text = master;
            this.textScore.text = score.toString();

            this.textRank.gameObject.SetActive(true);
            this.textName.gameObject.SetActive(true);
            this.textMaster.gameObject.SetActive(true);
            this.textScore.gameObject.SetActive(true);
            if (null != this.textNone) {
                this.textNone.gameObject.SetActive(false);
            }
        } else {
            this.textRank.gameObject.SetActive(false);
            this.textName.gameObject.SetActive(false);
            this.textMaster.gameObject.SetActive(false);
            this.textScore.gameObject.SetActive(false);
            if (null != this.textNone) {
                this.textNone.gameObject.SetActive(showNone);
            }
        }

        if (null != this.bg2) {
            this.bg2.SetActive(rank % 2 == 0);
        }
    }
}

export abstract class GuildPvpResultBaseView extends CommonForm {

    protected countDownSeconds = 0;
    private readonly CountDownTimerKey = '1';

    protected rankList: List;
    protected rankItems: GuildPvpRankItem[] = [];
    protected myItem: GuildPvpRankItem;

    protected rewardList: List;
    protected rewardItems: IconItem[] = [];

    protected goTextNoRewards: UnityEngine.GameObject;

    private btnGo: UnityEngine.GameObject;
    private textBtnGo: UnityEngine.UI.Text;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected initElements() {
        this.rankList = this.elems.getUIList('rankList');

        this.myItem = new GuildPvpRankItem();
        this.myItem.setComponents(this.elems.getElement('myRank'), true, false);

        this.rewardList = this.elems.getUIList('rewardList');

        this.goTextNoRewards = this.elems.getElement('textNoRewards');

        this.btnGo = this.elems.getElement('btnGo');
        this.textBtnGo = this.elems.getText('textBtnGo');
    }

    protected initListeners() {
        this.addClickListener(this.btnGo, this.onClickBtnGo);
    }

    onOpen() {
        if (this.countDownSeconds > 0) {
            this.addTimer(this.CountDownTimerKey, 1000, this.countDownSeconds, this.onCountDownTimer);
            this.textBtnGo.text = uts.format('退出({0})', this.countDownSeconds);
        } else {
            this.removeTimer(this.CountDownTimerKey);
            this.textBtnGo.text = '退出';
        }
    }

    onClose() {
    }

    private onCountDownTimer(timer: Game.Timer) {
        let leftSeconds = this.countDownSeconds - timer.CallCount;
        if (leftSeconds <= 0) {
            this.onClickBtnGo();
        } else {
            this.textBtnGo.text = uts.format('退出({0})', leftSeconds);
        }        
    }

    private onClickBtnGo() {
        this.close();
        G.ModuleMgr.pinstanceModule.onClickQuitPinstance(true);
    }
}