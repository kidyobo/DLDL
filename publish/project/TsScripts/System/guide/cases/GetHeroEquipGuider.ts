import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { GuidUtil } from 'System/utils/GuidUtil'
import { Macros } from 'System/protocol/Macros'
import { GetEquipInfo } from 'System/guide/GetEquipInfo'

/**
 * 获得新装备的引导。
 * @author teppei
 * 
 */
export class GetHeroEquipGuider extends BaseGuider {
    private equipInfos: GetEquipInfo[] = [];

    constructor() {
        super(EnumGuide.GetHeroEquip, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return null;
    }

    processRequiredParams(equipData: Protocol.ContainerThingInfo) {
        for (let equipInfo of this.equipInfos) {
            if (GuidUtil.isGuidEqual(equipData.m_stThingProperty.m_stGUID, equipInfo.guid)) {
                return;
            }
        }
        let equipInfo: GetEquipInfo = new GetEquipInfo();
        equipInfo.id = equipData.m_iThingID;
        equipInfo.guid = uts.deepcopy(equipData.m_stThingProperty.m_stGUID, equipInfo.guid, true);
        this.equipInfos.push(equipInfo);
    }

    protected _initSteps(): void {
        this._addStep(EnumGuide.GetHeroEquip_OpenView, this._onStepOpenView);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.GetHeroEquip_OpenView;
    }

    private _onStepOpenView(step: EnumGuide): void {
        // 打开面板
        //G.ViewCacher.getHeroEquipView.open();
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        return true;
    }

    end(): void {
        //G.ViewCacher.getHeroEquipView.close();
        this.equipInfos.length = 0;
    }

    getNextEquip(): GetEquipInfo {
        let thingData = G.DataMgr.thingData;
        while (this.equipInfos.length > 0) {
            let equip = this.equipInfos.pop();
            let equipInfo = thingData.getBagItemByGuid(equip.id, equip.guid);

            if (null == equipInfo) {
                continue;
            }
            if (thingData.isBetterEquip(equipInfo)) {
                // 说明这个装备是最牛逼的
                return equip;
            }
        }

        return null;
    }
}
