/**
 * MyNode
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id
 * @param transformations
 * @param materialID
 * @param textureID
 * @param afs
 * @param aft
 * @param descendants
 * @param primitives
 * @param sprites
 */
class MyNode extends CGFobject {
    constructor(scene, id, transformations, materialID, textureID, animationID, afs, aft, descendants, primitives, sprites) {
        super(scene);
        this.id = id;
        this.transformations = transformations;
        this.materialID = materialID;
        this.textureID = textureID;
        this.animationID = animationID;
        this.afs = afs;
        this.aft = aft;
        this.descendants = descendants;
        this.primitives = primitives;
        this.sprites = sprites;
    }

}
