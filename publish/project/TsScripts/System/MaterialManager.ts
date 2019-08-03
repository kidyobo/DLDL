export class MaterialManager {
    private _greyMat: UnityEngine.Material;
    public get greyMat() {
        return this._greyMat;
    }
    private _modelAddMaterial: UnityEngine.Material;
    public get modelAddMat() {
        return this._modelAddMaterial;
    }
    private _cameraEffectMaterial: UnityEngine.Material;
    public get cameraEffectMat() {
        return this._cameraEffectMaterial;
    }
    private _cameraDarkMaterial: UnityEngine.Material;
    public get cameraDarkMaterial() {
        return this._cameraDarkMaterial;
    }
    private _rainEffectMaterial: UnityEngine.Material;
    public get rainEffectMat() {
        return this._rainEffectMaterial;
    }
    private _blurMaterial: UnityEngine.Material;
    public get blurMaterial() {
        return this._blurMaterial;
    }
    private _shadow: UnityEngine.GameObject;
    public init() {
        let materialAsset = Game.ResLoader.LoadAsset('material/GreyMaterial.mat');
        materialAsset.autoCollect = false;
        this._greyMat = materialAsset.material;

        materialAsset = Game.ResLoader.LoadAsset('material/modeladd.mat');
        materialAsset.autoCollect = false;
        this._modelAddMaterial = new UnityEngine.Material(materialAsset.material);

        materialAsset = Game.ResLoader.LoadAsset('material/cameraEffect.mat');
        materialAsset.autoCollect = false;
        this._cameraEffectMaterial = new UnityEngine.Material(materialAsset.material);

        materialAsset = Game.ResLoader.LoadAsset('material/rainEffect.mat');
        materialAsset.autoCollect = false;
        this._rainEffectMaterial = new UnityEngine.Material(materialAsset.material);

        materialAsset = Game.ResLoader.LoadAsset('material/cameraDarkMaterial.mat');
        materialAsset.autoCollect = false;
        this._cameraDarkMaterial = new UnityEngine.Material(materialAsset.material);

        materialAsset = Game.ResLoader.LoadAsset('material/RadialBlur.mat');
        materialAsset.autoCollect = false;
        this._blurMaterial = new UnityEngine.Material(materialAsset.material);

        let asset = Game.ResLoader.LoadAsset('misc');
        asset.autoCollect = false;
        this._shadow = asset.Load("misc/shadow.prefab") as UnityEngine.GameObject;
    }
    public getNewShadow(parent: UnityEngine.Transform): UnityEngine.GameObject {
        let obj = UnityEngine.GameObject.Instantiate(this._shadow, parent, false) as UnityEngine.GameObject;
        return obj;
    }
}