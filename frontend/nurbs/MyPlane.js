/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param udivs - divs in u
 * @param vdivs - divs in v
 */
class MyPlane extends CGFobject {
    constructor(scene, udivs, vdivs) {
        super(scene);
        this.udivs = udivs;
        this.vdivs = vdivs;

        this.nurbsSurface = new CGFnurbsSurface(1, 1,
            [
                // U = 0
                [ // V = 0..1;
                    [-0.5, 0.0, 0.5, 1],
                    [-0.5, 0.0, -0.5, 1],
                ],
                // U = 1
                [ // V = 0..1
                    [0.5, 0.0, 0.5, 1],
                    [0.5, 0.0, -0.5, 1],
                ]
            ]
        );

        this.nurbsObject = new CGFnurbsObject(this.scene, this.udivs, this.vdivs, this.nurbsSurface);
        
    }

    display() {
        this.nurbsObject.display();
    }

}
