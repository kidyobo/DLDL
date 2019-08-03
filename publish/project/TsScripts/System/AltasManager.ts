export class AltasManager {
    public actIcons: Game.UGUIAltas;
    public iconColor: Game.UGUIAltas;
    public colorEffectAltas: Game.ElementsMapper;
    taskTypeAtlas: Game.UGUIAltas;
    roleHeadAltas: Game.UGUIAltas;
    professionAltas: Game.UGUIAltas;
    iconColorExhibitionAltas: Game.UGUIAltas;

    public richangIcons: Game.UGUIAltas;
    iconZiAtals: Game.UGUIAltas;
    public init() {
        let actIcons = Game.ResLoader.LoadAsset('ui/altasPrefab/actIcons.prefab');
        actIcons.autoCollect = false;
        this.actIcons = actIcons.gameObject.GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        let iconColor = Game.ResLoader.LoadAsset('ui/altasPrefab/iconColor.prefab');
        iconColor.autoCollect = false;
        this.iconColor = iconColor.gameObject.GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        let colorEffectAltas = Game.ResLoader.LoadAsset('ui/altasPrefab/colorEffectAltas.prefab');
        colorEffectAltas.autoCollect = false;
        this.colorEffectAltas = colorEffectAltas.gameObject.GetComponent(Game.ElementsMapper.GetType()) as Game.ElementsMapper;

        let roleHeadAltas = Game.ResLoader.LoadAsset('ui/altasPrefab/roleHeadAltas.prefab');
        roleHeadAltas.autoCollect = false;
        this.roleHeadAltas = roleHeadAltas.gameObject.GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        let professionAltas = Game.ResLoader.LoadAsset('ui/altasPrefab/professionAltas.prefab');
        professionAltas.autoCollect = false;
        this.professionAltas = professionAltas.gameObject.GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        let taskTypeAtlas = Game.ResLoader.LoadAsset('ui/altasPrefab/taskTypeAtlas.prefab');
        taskTypeAtlas.autoCollect = false;
        this.taskTypeAtlas = taskTypeAtlas.gameObject.GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        let iconColorExhibitionAltas = Game.ResLoader.LoadAsset('ui/altasPrefab/iconColorExhibitionAltas.prefab');
        iconColorExhibitionAltas.autoCollect = false;
        this.iconColorExhibitionAltas = iconColorExhibitionAltas.gameObject.GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        let iconZiAtals = Game.ResLoader.LoadAsset('ui/altasPrefab/iconZiAtals.prefab');
        iconZiAtals.autoCollect = false;
        this.iconZiAtals = iconZiAtals.gameObject.GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        let richangIcons = Game.ResLoader.LoadAsset('ui/altasPrefab/richangIcons.prefab');
        richangIcons.autoCollect = false;
        this.richangIcons = richangIcons.gameObject.GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
    }

    getActIcon(id: number): UnityEngine.Sprite {
        let s = this.actIcons.Get(id.toString());
        if (s == null) {
            uts.logError('no ACT icon: ' + id);
        }
        return s;
    }

    getActIconByName(name: string): UnityEngine.Sprite {
        let s = this.actIcons.Get(name);
        if (s == null) {
            uts.logError('no ACT icon: ' + name);
        }
        return s;
    }

    getColorIcon(id: number): UnityEngine.Sprite {
        let s = this.iconColor.Get(id.toString());
        if (s == null) {
            uts.logError('no color icon: ' + id);
        }
        return s;
    }
    getColorEffectAltasElement(id: string): UnityEngine.GameObject {
        let s = this.colorEffectAltas.GetElement(id);
        if (s == null) {
            uts.logError('no colorEffectAltas: ' + id);
        }
        return s;
    }
    getRichangIcon(id: string): UnityEngine.Sprite {
        let s = this.richangIcons.Get(id);
        if (s == null) {
            uts.logError('no richangAltas icon: ' + id);
        }
        return s;
    }
}