import { IGuideExecutor } from 'System/guide/IGuideExecutor';
import { KeyWord } from '../../constants/KeyWord';
import UIPathData from '../../data/UIPathData';
import { PersonalBossBaseView } from './PersonalBossBaseView';

export class MultipleBossView extends PersonalBossBaseView implements IGuideExecutor {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_MULTIPLE_BOSS);
        this._cacheForm = true;
    }

    protected resPath(): string {
        return UIPathData.MultipleBossView;
    }

    protected onOpen() {
        this.isMultiBoss = true;
        super.onOpen();
    }
}