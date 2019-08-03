import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from "System/protocol/Macros";
export class wenjuanData {
    private datiConfig: { [id: string]: GameConfig.SurveyCfgM };
    private wenJuanConfigs: GameConfig.SurveyCfgM[] = [];
    private info: Protocol.Survey_Response;
    private answerList: Protocol.SurveyAnswer[] = [];
     maxNum: number = 12;
    private titles: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    isShow:boolean = true;
    answerId: number = 0;
    answerNum: string[] = [];
    onCfgReady() {
        let dataList: GameConfig.SurveyCfgM[] = G.Cfgmgr.getCfg('data/SurveyCfgM.json') as GameConfig.SurveyCfgM[];
        this.datiConfig = {};
        for (let config of dataList) {
            this.datiConfig[config.m_iID] = config;
            this.wenJuanConfigs.push(config);
        }
    }
    getDatiConfig(id: number) {
        return this.datiConfig[id];
    }
    /**判断是否是第一次参加调查问卷 */
    isFirstJoin(id: number): boolean {
       let show = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_WENJUAN);
       if(show){
           return (G.DataMgr.systemData.onlyOneTimeAllLifeBits & id) == 0;
       }else{
           return false;
       }
    }

    setAnswer(index: number, m_iID: number, m_ucCount: number, m_aiChooseID: Array<number>) {
        let answerList = {} as Protocol.SurveyAnswer;
        answerList.m_iID = m_iID;
        answerList.m_ucCount = m_ucCount;
        answerList.m_aiChooseID = m_aiChooseID;
        this.answerList[index] = answerList;
    }
    /**拿到已经回答的题目 */
    getAllAnswer(): Protocol.SurveyAnswer[] {
        return this.answerList;
    }
    /**是否回答了所有题目*/
    isSelectAllTitle(): boolean {
        return this.answerList != null && this.answerList.length == this.maxNum;
    }
    /**拿到没有回答的题目 */
    getNoSelectTitle(): number[] {
        let noSelectTitle: number[] = [];
        if (this.answerList != null && this.answerList.length > 0) {
            for (let i = 0; i < this.maxNum; i++) {
                let len = this.answerList.length;
                for (let j = 0; j < len; j++) {
                    if (this.answerList[i] == null) this.titles[i]=i+1;
                    if (this.answerList[j] && this.answerList[j].m_iID == this.titles[i]) {
                        this.titles[i]=0;
                    }
                }
            }
            for (let k = 0; k < this.maxNum; k++) {
                if (this.titles[k] > 0) {
                    noSelectTitle.push(this.titles[k]);
                }
            }
        }
        return noSelectTitle;
    }
    clearAllAnswer(){
        this.answerList.length = 0;
    }
}
