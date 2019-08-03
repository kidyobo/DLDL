export class ShaderManager {
    public standard: UnityEngine.Shader;
    public translucent: UnityEngine.Shader;
    public burn: UnityEngine.Shader;
    public init() {
        let asset = Game.ResLoader.LoadAsset("shader");
        asset.autoCollect = false;
        this.standard = asset.Load("shader/ModelStandard.shader") as UnityEngine.Shader;
        this.translucent = asset.Load("shader/ModelTranslucent.shader") as UnityEngine.Shader; 
        this.burn = asset.Load("shader/ModelBurn.shader") as UnityEngine.Shader;
    }
}