/**
 * MyBarrel
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - the radius in the xy plane
 * @param middle - the radius in the middle
 * @param height - the height of the barrel
 * @param alfa - the alfa angle
 * @param slices - number of divisions in u for each barrel surface
 * @param stacks - number of divisions in v
 */
class MyBarrel extends CGFobject {
    constructor(scene, base, middle, height, alfa, slices, stacks) {
        super(scene);
        this.r = base;
        this.R = middle;
        this.L = height;
        this.alfa = alfa;

        this.udegree = 3;
        this.vdegree = 3;

        this.udivs = slices;
        this.vdivs = stacks;

        this.h = this.r * 4/3;
        this.H = (this.R - this.r) * 4/3;
        this.tgAlfa = Math.tan(this.alfa);

        this.controlpointsTop = [
            // U = 0 
            // V =0..4 
            [   
                [this.r,          0, 0,                           1],
                [this.r + this.H, 0, this.H/this.tgAlfa,          1],
                [this.r + this.H, 0, this.L - this.H/this.tgAlfa, 1],
                [this.r,          0, this.L,                      1],
            ],

            // U = 1 
            // V =0..4 
            [
                [this.r,          this.h,                    0,                           1],
                [this.r + this.H, (4/3) * (this.r + this.H), this.H/this.tgAlfa,          1],
                [this.r + this.H, (4/3) * (this.r + this.H), this.L - this.H/this.tgAlfa, 1],
                [this.r,          this.h,                   this.L,                       1],
            ],

            // U = 2 
            // V = 0..4 
            [
                [-this.r,          this.h,                    0,                           1],
                [-this.r - this.H, (4/3) * (this.r + this.H), this.H/this.tgAlfa,          1],
                [-this.r - this.H, (4/3) * (this.r + this.H), this.L - this.H/this.tgAlfa, 1],
                [-this.r,          this.h,                    this.L,                      1],
            ],

            // U = 3
            // V =0..4 
            [   
                [-this.r,          0, 0,                           1],
                [-this.r - this.H, 0, this.H/this.tgAlfa,          1],
                [-this.r - this.H, 0, this.L - this.H/this.tgAlfa, 1],
                [-this.r,          0, this.L,                      1],
            ],

        ];
        

        this.barrelSurfaceTop = new CGFnurbsSurface(this.udegree, this.vdegree, this.controlpointsTop);
        this.barrelObjectTop = new CGFnurbsObject(this.scene, this.udivs, this.vdivs, this.barrelSurfaceTop);
    }

    display() {

        this.scene.pushMatrix();

        // Display Top Barrel
        this.barrelObjectTop.display();

        // Display Bottom Barrel
        this.scene.rotate(Math.PI, 0,0,1);
        this.barrelObjectTop.display();

        this.scene.popMatrix();
    }
}