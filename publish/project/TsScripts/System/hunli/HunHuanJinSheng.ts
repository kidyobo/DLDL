import { KeyWord } from './../constants/KeyWord';
import { PriceBar } from 'System/business/view/PriceBar';
import { UnitCtrlType } from './../constants/GameEnum';
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil';
import { Color } from 'System/utils/ColorUtil';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from './../protocol/ProtocolUtil';
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView';
import { Global as G } from "System/global"
import { ElemFinder} from 'System/uilib/UiUtility'
import { GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm'
export class HunHuanJinSheng  {
 private hunhuanCfg:GameConfig.HunHuanConfigM;
 private lastCfg:GameConfig.HunHuanConfigM;
 //获取海神魂力 
 private btnGet:GameObjectGetSet;
 //晋升
 private btnJinSheng:GameObjectGetSet;
 private jinshengEffect:GameObjectGetSet;
 private hunhuanLevelUpCfg:GameConfig.HunHuanLevelUpConfigM;
 private nameText:TextGetSet;
 private icon:GameObjectGetSet;
 //魂环等级
 private hunhuanLevels:GameObjectGetSet[]=[];
//是否可以晋升
 private canJinJie:GameObjectGetSet;
 private needProp:GameObjectGetSet;
 //之前的战力
 private beforeFight:TextGetSet;
 //之后的战力
 private afterFight:TextGetSet;
 private hunhuanLevel:number;
//达到最高级 
private maxFight:GameObjectGetSet;
private fightObj:GameObjectGetSet;

private costBar:PriceBar;
private hasBar:PriceBar;

 setComponents(go:UnityEngine.GameObject){
    this.jinshengEffect = new GameObjectGetSet(ElemFinder.findObject(go,'jinshengEffect'));
    this.jinshengEffect.SetActive(false);
    this.btnGet = new GameObjectGetSet(ElemFinder.findObject(go,'needProp/btnGet'));
    this.btnJinSheng = new GameObjectGetSet(ElemFinder.findObject(go,'needProp/btnJinSheng'));
    this.nameText = new TextGetSet(ElemFinder.findText(go,'level/nameText')); 
    this.icon = new GameObjectGetSet(ElemFinder.findObject(go,'level/icon')); 
    this.needProp = new GameObjectGetSet(ElemFinder.findObject(go,'needProp')); 
    this.fightObj = new GameObjectGetSet(ElemFinder.findObject(go,'level/fightObj')); 
    this.beforeFight = new TextGetSet(ElemFinder.findText(go,'level/fightObj/beforeFight')); 
    this.afterFight = new TextGetSet(ElemFinder.findText(go,'level/fightObj/afterFight')); 
    this.maxFight = new GameObjectGetSet(ElemFinder.findObject(go,'level/maxFight')); 
    this.canJinJie =  new GameObjectGetSet(ElemFinder.findObject(this.btnJinSheng.gameObject,'btnJinSheng')); 
    for (let i = 0; i < 4; i++) {
        let hunhuanLevel = new GameObjectGetSet(ElemFinder.findObject(this.icon.gameObject,(i+1).toString())); 
        this.hunhuanLevels.push(hunhuanLevel);
    }

    this.hasBar = new PriceBar();
    this.hasBar.setComponents(ElemFinder.findObject(go,'needProp/has/hasBar'));
    this.costBar = new PriceBar();
    this.costBar.setComponents(ElemFinder.findObject(go,'needProp/need/costBar'));

    Game.UIClickListener.Get(this.btnGet.gameObject).onClick = delegate(this, this.onClickGet);
    Game.UIClickListener.Get(this.btnJinSheng.gameObject).onClick = delegate(this, this.onClickJinSheng);
 }


 updateJinShengView(index:number){
     let hunliData = G.DataMgr.hunliData;
     this.hunhuanCfg = hunliData.getHunHuanConfigByIndex(index);
     this.hunhuanLevel = hunliData.hunhuanLevelInfoList[index].m_ucLevel;
     //当前晋升魂环是选中的魂环
     this.hunhuanLevelUpCfg = hunliData.getHunHuanLevelUpById(this.hunhuanCfg.m_iID, this.hunhuanLevel);
     if (hunliData.hunhuanLevelInfoList[index].m_ucLevel == 27) {
         this.needProp.gameObject.SetActive(false);
         this.maxFight.gameObject.SetActive(true);
         this.fightObj.SetActive(false);
     } else {
         let nextCfg = hunliData.getHunHuanLevelUpById(this.hunhuanCfg.m_iID, this.hunhuanLevel+1);
         this.canJinJie.SetActive(nextCfg.m_iCost <= G.DataMgr.heroData.haishenhunli);
         this.needProp.gameObject.SetActive(true);
         this.maxFight.gameObject.SetActive(false);
         this.fightObj.SetActive(true);
         this.hasBar.setCurrencyID(KeyWord.MONEY_ID_HUNLI, true);
         this.hasBar.setPrice(G.DataMgr.getOwnValueByID(KeyWord.MONEY_ID_HUNLI));
         this.costBar.setCurrencyID(KeyWord.MONEY_ID_HUNLI, true);
         this.costBar.setPrice(nextCfg.m_iCost,0 == G.ActionHandler.getLackNum(KeyWord.MONEY_ID_HUNLI, nextCfg.m_iCost, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH);
         this.updateFight(index)
     }
        this.nameText.text = this.hunhuanLevelUpCfg.m_szName;

        this.hunhuanLevels[0].SetActive(this.hunhuanCfg.m_iRequireHunLiLevel<3);
        this.hunhuanLevels[1].SetActive(this.hunhuanCfg.m_iRequireHunLiLevel>=3&& this.hunhuanCfg.m_iRequireHunLiLevel<5);
        this.hunhuanLevels[2].SetActive(this.hunhuanCfg.m_iRequireHunLiLevel>=5&& this.hunhuanCfg.m_iRequireHunLiLevel<9);
        this.hunhuanLevels[3].SetActive(this.hunhuanCfg.m_iRequireHunLiLevel==9);
        if(hunliData.canLevelUp()>0){
            this.jinshengEffect.SetActive(true);
            let sortingOrder = 313;
          
            this.jinshengEffect.SetActive(false);
        }
}
    /**更新战力 */
    updateFight(index:number) {
        let hunliData = G.DataMgr.hunliData;
        //当前激活的魂力等级
        let beforefight: number = 0;
        let afterfight: number = 0;
        let len = this.hunhuanCfg.m_astProp.length;
       
        let fightCount = 0;
        for (let i = 0; i < len; i++) {
            let prop = this.hunhuanCfg.m_astProp[i];
            if(index > 0){
                this.lastCfg = hunliData.getHunHuanConfigByIndex(index-1);
                let lastProp = this.lastCfg.m_astProp[i];
                fightCount += FightingStrengthUtil.calStrengthByOneProp(prop.m_ucPropId, prop.m_iPropValue-lastProp.m_iPropValue);
            }else{
                fightCount += FightingStrengthUtil.calStrengthByOneProp(prop.m_ucPropId, prop.m_iPropValue);
            }
        }
        beforefight = fightCount;
        afterfight = fightCount;
        let cfg = hunliData.getHunHuanConfigByIndex(index);
        let beforeCfg;
        let afterCfg;
        if(this.hunhuanLevel==27){
            beforeCfg = hunliData.getHunHuanLevelUpById(cfg.m_iID, this.hunhuanLevel);
            afterCfg = hunliData.getHunHuanLevelUpById(cfg.m_iID, this.hunhuanLevel);
        }else{
            beforeCfg = hunliData.getHunHuanLevelUpById(cfg.m_iID, this.hunhuanLevel);
            afterCfg = hunliData.getHunHuanLevelUpById(cfg.m_iID, this.hunhuanLevel+1);
        }
        for (let i = 0; i < len; i++) {
            beforefight += FightingStrengthUtil.calStrengthByOneProp(beforeCfg.m_astProp[i].m_ucPropId, beforeCfg.m_astProp[i].m_iPropValue);
            afterfight += FightingStrengthUtil.calStrengthByOneProp(afterCfg.m_astProp[i].m_ucPropId,afterCfg.m_astProp[i].m_iPropValue);
        }

        this.beforeFight.text = uts.format('战力 +{0}',beforefight.toString());
        this.afterFight.text = uts.format(' +{0}',afterfight.toString());
    }

 /**获取 */
private onClickGet(){
    G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(477), '玩法说明');
}


/**晋升 */
private onClickJinSheng(){
    if(G.DataMgr.hunliData.canLevelUp){
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunhuanWearRequest(Macros.HUNLI_HUNHUAN_LEVEL_UP, this.hunhuanCfg.m_iID));
    }else{
        G.TipMgr.addMainFloatTip("海神魂力不足!");
    }
}
  
}