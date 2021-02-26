/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate vertex 1
 * @param y1 - y coordinate vertex 1
 * @param x2 - x coordinate vertex 2
 * @param y2 - y coordinate vertex 2
 * @param x3 - x coordinate vertex 3
 * @param y3 - y coordinate vertex 3
 * @param afs - afs texture coordinate
 * @param aft - aft texture coordinate
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3, afs = 1, aft = 1) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.afs = afs;
		this.aft = aft;

		this.a = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		this.b = Math.sqrt(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2));
		this.c = Math.sqrt(Math.pow(x1 - x3, 2) + Math.pow(y1 - y3, 2));

		this.cosa = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2 * this.a * this.c);
		this.sina = Math.sqrt(1 - Math.pow(this.cosa, 2));

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
			this.x3, this.y3, 0		//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		//Facing Z positive
		this.normals = [
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
			0,1,
			this.a / this.afs, 1,
			this.c*this.cosa / this.afs, 1 - this.c*this.sina / this.aft
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
}
