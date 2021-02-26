
/**
 * MySpriteSheet
 * @constructor
 * @param scene - Reference to MyScene object
 * @param texture - the texture to be applied
 * @param sizeM - the number of columns of the spritesheet
 * @param sizeN - the number of line of the spritesheet
 */

class MySpriteSheet extends CGFobject {
    constructor(scene, texture, sizeM, sizeN){
        super(scene);
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        // Create new shader object from .vert and .frag file
        this.spriteShader = new CGFshader(this.scene.gl, "shaders/spriteShader.vert", "shaders/spriteShader.frag");
    }

    activateCellMN(m,n){
        
        // Activate shader
        this.scene.setActiveShaderSimple(this.spriteShader);
        this.texture.bind();
        
        // Define shader variables
        this.spriteShader.setUniformsValues({ sizeM: this.sizeM, sizeN: this.sizeN, m: m, n: n});

    }

    activateCellP(p){
        // Get column and row assuming p = 0 at the top left cell and moving left to right and top to bottom
        var m = p % this.sizeM;
        var n = Math.floor(p / this.sizeM);
  
        this.activateCellMN(m,n);
    }
    
}

