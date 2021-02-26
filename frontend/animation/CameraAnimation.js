/**
 * CameraAnimation class, representing an animated move from the initialCamera to the finalCamera.
 */
class CameraAnimation extends MyAnimation {
    constructor(scene, initialCamera, finalCamera) {
        super(scene, 0, 2000, null, null);

        this.initCameras(initialCamera, finalCamera);

        // Total time of the animation
        this.totalTime = this.finalTime - this.initialTime;

        // Total time passed
        this.sumT = 0;

        // Last t from update function arg
        this.lastT = 0;
    }

    initCameras(initialCamera, finalCamera) {

        this.initialCamera = initialCamera;

        this.initPosition = this.initialCamera.position.slice(0, 3);
        this.initTarget = this.initialCamera.target.slice(0, 3);
        this.initNear = this.initialCamera.near;
        this.initFar = this.initialCamera.far;
        this.initFov = this.initialCamera.fov;

        this.finalCamera = finalCamera;
        this.finalPosition = this.finalCamera.position.slice(0, 3);
        this.finalTarget = this.finalCamera.target.slice(0, 3);
        this.finalNear = this.finalCamera.near;
        this.finalFar = this.finalCamera.far;
        this.finalFov = this.finalCamera.fov;
    }

    update(t) {
        // If animation time has ended
        if (this.sumT > this.totalTime) {
            this.scene.camera = this.finalCamera;
            return false;
        }

        if (this.lastT == 0)
            this.lastT = t;

        var deltaT = t - this.lastT;
        this.lastT = t;

        this.sumT += deltaT;

        let elapsedPercentage = Math.max((this.totalTime - this.sumT) / this.totalTime, 0);

        let position = [0, 0, 0], target = [0, 0, 0];

        vec3.lerp(position, this.finalPosition, this.initPosition, elapsedPercentage);
        vec3.lerp(target, this.finalTarget, this.initTarget, elapsedPercentage);

        let near = this.finalNear + elapsedPercentage * (this.initNear - this.finalNear);
        let far = this.finalFar + elapsedPercentage * (this.initFar - this.finalFar);
        let fov = this.finalFov + elapsedPercentage * (this.initFov - this.finalFov);

        this.scene.camera = new CGFcamera(fov, near, far, position, target);

        return true;
    }

    // For the Animator calling
    animate(t) { return this.update(t); }
}