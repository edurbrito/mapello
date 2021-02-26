/**
 * MySphere
 * @constructor
 * @param scene - MyScene object
 * @param slices - number of slices around Y axis
 * @param stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
 */
class MySphere extends CGFobject {

  constructor(scene, radius, slices, stacks) {
    super(scene);
    this.radius = radius;
    this.latDivs = stacks * 2;
    this.longDivs = slices;

    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the sphere buffers
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var phi = 0;
    var theta = 0;
    var phiInc = Math.PI / this.latDivs;
    var thetaInc = (2 * Math.PI) / this.longDivs;
    var latVertices = this.longDivs + 1;
    var latFac = 1 / this.latDivs;
    var longFac = 1 / this.longDivs;

    // build an all-around stack at a time, starting on "north pole" and proceeding "south"
    for (let latitude = 0; latitude <= this.latDivs; latitude++) {
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      // in each stack, build all the slices around, starting on longitude 0
      theta = 0;
      for (let longitude = 0; longitude <= this.longDivs; longitude++) {
        //--- Vertices coordinates
        var x = Math.sin(-theta) * sinPhi;
        var y = Math.cos(theta) * sinPhi;
        var z = cosPhi;
        this.vertices.push(this.radius * x, this.radius * y, this.radius * z);

        //--- Indices
        if (latitude < this.latDivs && longitude < this.longDivs) {
          var current = latitude * latVertices + longitude;
          var next = current + latVertices;
          // pushing two triangles using indices from this round (current, current+1)
          // and the ones directly south (next, next+1)
          // (i.e. one full round of slices ahead)

          this.indices.push(current + 1, current, next);
          this.indices.push(current + 1, next, next + 1);
        }

        //--- Normals
        // at each vertex, the direction of the normal is equal to
        // the vector from the center of the sphere to the vertex.
        // in a sphere of radius equal to one, the vector length is one.
        // therefore, the value of the normal is equal to the position vector
        this.normals.push(x, y, z);
        theta += thetaInc;

        //--- Texture Coordinates
        var s = 0.6 + longFac * longitude;
        var t = latFac * latitude;
        this.texCoords.push(s, t);
      }
      phi += phiInc;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
