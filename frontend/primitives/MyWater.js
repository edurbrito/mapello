class MyWater extends  CGFobject {
    constructor(scene, x1, y1, x2, y2, afs = 1, aft = 1) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.afs = afs;
		this.aft = aft;
		this.xLength = this.x2-this.x1;
		this.yLength = this.y2-this.y1;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		/*
		Texture coords (s,t)
		+----------> s
		|
		|
		|
		v
		t
		*/

		this.setTexCoords();

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * Calculates the new values for the TexCoords
	 */
	setTexCoords() {
		return (this.texCoords = [
			0, this.yLength / this.aft,
			this.xLength / this.afs, this.yLength / this.aft,
			0, 0,
			this.xLength / this.afs, 0
		]);
	}

	/**
	 * Sets the new values for afs and aft properties, updating the TexCoords
	 * @param afs
	 * @param aft
	 */
	setAmplification(afs, aft) {
		this.afs = afs;
		this.aft = aft;
		this.updateTexCoords(this.setTexCoords());
	}

	/**
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
    
    display(){
        this.scene.pushMatrix();
		this.scene.setActiveShader(this.scene.waterShader);
        this.scene.defaultAppearance.setTexture(this.scene.textures['waterTex']);
        this.scene.defaultAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.scene.textures['waterMap'].bind(1);
        super.display();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();
    }
}