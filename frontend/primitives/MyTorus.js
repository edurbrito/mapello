/**
 * MyTorus
 * @constructor
 * @param scene - MyScene object
 * @param inner
 * @param outer
 * @param slices - number of slices around Y axis
 * @param loops - number of loops in 1/4 of the torus
 */
class MyTorus extends CGFobject {

  constructor(scene, inner, outer, slices, loops) {
    super(scene);
    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = 4 * loops;

    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the torus buffers
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var phi = 0;
    var theta;
    var phiInc = (2 * Math.PI) / this.loops;
    var thetaInc = (2 * Math.PI) / this.slices;

    var x, y, z, nx, ny, nz;
    for (var i = 0; i <= this.loops; i++) {
      theta = 0;
      for (var j = 0; j <= this.slices; j++) {
        x = (this.outer + this.inner * Math.cos(theta)) * Math.cos(phi);
        y = (this.outer + this.inner * Math.cos(theta)) * Math.sin(phi);
        z = this.inner * Math.sin(theta);

        nx = Math.cos(theta) * Math.cos(phi);
        ny = Math.cos(theta) * Math.sin(phi);
        nz = Math.sin(theta);

        this.vertices.push(x, y, z);
        this.normals.push(nx, ny, nz);

        theta += thetaInc;
      }

      phi += phiInc;
    }

    var i = 0, inc = this.slices + 1, s = 0;
    for (var k = 0; k < this.loops; k++) {
      i = s;
      for (var j = 0; j < this.slices; j++) {
        this.indices.push(i + inc, i + 1, i);
        this.indices.push(i + inc + 1, i + 1, i + inc);
        i++;
      }
      s += inc;
    }

    var sliceTexInc = 1 / this.slices;
    var loopTexInc = 1 / this.loops;
    for (var k = 0; k <= this.loops; k++) {
      for (var j = 0; j <= this.slices; j++) {
        this.texCoords.push(k * loopTexInc, j * sliceTexInc);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
