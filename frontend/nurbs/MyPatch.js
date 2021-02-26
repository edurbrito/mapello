/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param udivs - points in u
 * @param vdivs - points in v
 * @param udivs - divs in u
 * @param vdivs - divs in v
 * @param controlpoints - controlpoints array
 */
class MyPatch extends CGFobject {
    constructor(scene, upoints, vpoints, udivs, vdivs, controlpoints) {
        super(scene);
        this.udegree = upoints - 1;
        this.vdegree = vpoints - 1;
        this.udivs = udivs;
        this.vdivs = vdivs;

        this.controlpoints = [];
        let index = 0;

        for (let i = 0; i < upoints; i++) {
            let aux = [];
            for (let j = 0; j < vpoints; j++) {
                aux.push(controlpoints[index + j]);
            }
            index += vpoints;
            this.controlpoints.push(aux);
        }

        this.nurbsSurface = new CGFnurbsSurface(this.udegree, this.vdegree, this.controlpoints);
        this.nurbsObject = new CGFnurbsObject(this.scene, this.udivs, this.vdivs, this.nurbsSurface);
    }

    display() {
        this.nurbsObject.display();
    }
}