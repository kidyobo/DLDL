import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { KeyWord } from '../../constants/KeyWord';
import UIPathData from '../../data/UIPathData';
import { PersonalBossBaseView } from './PersonalBossBaseView';

export class PersonalBossView extends PersonalBossBaseView implements IGuideExecutor {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS);
        this._cacheForm = true;
    }

    protected resPath(): string {
        return UIPathData.PersonalBossView;
    }

    protected onOpen() {
        this.isMultiBoss = false;
        super.onOpen();
    }
}