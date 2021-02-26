/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param bottomRadius
 * @param topRadius
 * @param height
 * @param slices
 * @param stacks
 */
class MyCylinder extends CGFobject {
    constructor(scene, bottomRadius, topRadius, height, slices, stacks) {
        super(scene);
        this.stacks = stacks;
        this.slices = slices;
        this.height = height;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;

        this.top = new MyCircle(scene, topRadius, slices);
        this.bottom = new MyCircle(scene, bottomRadius, slices);

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;
        var stackInc = this.height / this.stacks;
        var radiusInc = (this.topRadius - this.bottomRadius) / this.stacks;

        var ca, sa, x, y;
        var r = this.bottomRadius, h = 0;
        // Last vertices need to be repeated for the cylinder to close
        for (var j = 0; j <= this.stacks; j++) {

            ang = 0;

            for (var i = 0; i <= this.slices; i++) {

                ca = Math.cos(ang);
                sa = Math.sin(ang);

                x = ca * r;
                y = sa * r;

                this.vertices.push(x, y, h);
                this.normals.push(ca, sa, 0);

                ang += alphaAng;
            }
            r += radiusInc;
            h += stackInc;
        }

        /*
           (i+inc)_______(i+inc+1)
             |             |
             |             |
             i___________(i+1)
       */

        var i = 0, inc = this.slices + 1, s = 0;
        for (var k = 0; k < this.stacks; k++) {
            i = s;
            for (var j = 0; j < this.slices; j++) {
                this.indices.push(i, i + 1, i + inc);
                this.indices.push(i + inc, i + 1, i + 1 + inc);
                i++;
            }
            s += inc;
        }

        var sliceTexInc = 1 / this.slices;
        var stackTexInc = 1 / this.stacks;
        for (var k = this.stacks; k >= 0; k--) {
            for (var j = 0; j <= this.slices; j++)
                this.texCoords.push(j * sliceTexInc, k * stackTexInc);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        super.display();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.bottom.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.top.display();
        this.scene.popMatrix();
    }

    enableNormalViz() {
        super.enableNormalViz();
        this.top.enableNormalViz();
        this.bottom.enableNormalViz();
    }
}   