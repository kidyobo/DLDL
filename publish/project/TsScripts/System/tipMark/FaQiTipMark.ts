import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { FaQiView } from 'System/faqi/FaQiiView'
import { FabaoData } from 'System/data/FabaoData'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
/**
 * 宝物。
 */
export class FaQiTipMark extends BaseTipMark {

    private funcId = 0;
    private isActive = false;
    private targetId = 0;

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_FAQI, KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE, KeyWord.OTHER_FUNCTION_SIXIANG_TUTENG];
        this.sensitiveToFaQi = true;
        this.sensitiveToSiXiang = true;
        this.activeByFunc = KeyWord.BAR_FUNCTION_FAQI;
    }

    protected doCheck(): boolean {
        let fabaoData = G.DataMgr.fabaoData;
        this.isActive = false;
        this.funcId = KeyWord.OTHER_FUNCTION_FAQIJINJIE;
        for (let i = 0; i < FabaoData.MAX_FaQiNum; i++) {
            let faqiId = fabaoData.faqiIdArr[i];
            if (faqiId > 0) {
                if (fabaoData.canFaqiActive(faqiId)) {
                    this.targetId = faqiId;
                    this.isActive = true;
                    return true;
                }
                if (fabaoData.canStrengthOneFaqi(faqiId)) {
                    this.targetId = faqiId;
                    return true;
                }
                if (fabaoData.canSkillLevelUpOneFaqi(faqiId)) {
                    this.targetId = faqiId;
                    return true;
                }
            }
        }

        // 检查斗兽进阶
        let siXiangData = G.DataMgr.siXiangData;
        this.targetId = siXiangData.getCanActivatedShenShouId();
        if (this.targetId > 0) {
            this.funcId = KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE;
            this.isActive = true;
            return true;
        }

        this.targetId = siXiangData.getCanJinJieShenShouId();
        if (this.targetId > 0) {
            this.funcId = KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE;
            return true;
        }

        // 检查斗兽图腾
        if (TipMarkUtil.siXiangTuTeng()) {
            this.funcId = KeyWord.OTHER_FUNCTION_SIXIANG_TUTENG;
            return true;
        }

        return false;
    }

    get TipName(): string {
        if (KeyWord.OTHER_FUNCTION_FAQIJINJIE == this.funcId) {
            return this.isActive ? '神盾激活' : '神盾提升';
        }

        if (KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE == this.funcId) {
            return this.isActive ? '斗兽激活' : '斗兽提升';
        }

        return '斗兽图腾';
    }

    action() {
        G.Uimgr.createForm<FaQiView>(FaQiView).open(this.funcId, this.targetId);
    }
}