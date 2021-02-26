/**
 * MyCircle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius
 * @param slices
 */
class MyCircle extends CGFobject {
    constructor(scene, radius, slices) {
        super(scene);
        this.slices = slices;
        this.radius = radius;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;

        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);


        var ca, sa, x, y, u, v;

        // Last vertices need to be repeated for the circle to close
        for (var i = 0; i <= this.slices; i++) {

            ca = Math.cos(ang);
            sa = Math.sin(ang);

            x = ca * this.radius;
            y = sa * this.radius;

            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, 1);

            u = 0.5 + x / (2 * this.radius);
            v = 0.5 + y / (2 * this.radius);

            this.texCoords.push(u, v);

            ang += alphaAng;
        }

        var i = 0;
        for (var j = 0; j < this.slices; j++) {
            this.indices.push(i, i + 1, 0);
            i++;
        }

        // For the circle to close
        this.indices.push(i, 1, 0);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}   