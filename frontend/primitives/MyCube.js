class MyCube extends CGFobject {
    constructor(scene) {
		super(scene);
        this.initBuffers();
        
        this.square = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);
	}
    
    display() {
      
        //front
        this.scene.pushMatrix();
        this.scene.translate(0.0, 0.0, 0.5); 
        this.square.display();
        this.scene.popMatrix();
  
        //back
        this.scene.pushMatrix();
        this.scene.translate(0.0, 0.0, -0.5); 
        this.scene.rotate(-Math.PI,0.0, 1.0,0.0);
        this.square.display();
        this.scene.popMatrix();
  
        //left
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0.0, 0.0); 
        this.scene.rotate(-Math.PI/2,0.0, 1.0,0.0);
        this.square.display();
        this.scene.popMatrix();
  
        //right
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0.0, 0.0); 
        this.scene.rotate(Math.PI/2,0.0, 1.0,0.0);
        this.square.display();
        this.scene.popMatrix();
  
        //bottom
        this.scene.pushMatrix();
        this.scene.translate(0.0, -0.5, 0.0); 
        this.scene.rotate(Math.PI/2,1.0, 0.0,0.0);
        this.square.display();
        this.scene.popMatrix();
  
        //top
        this.scene.pushMatrix();
        this.scene.translate(0.0, 0.5, 0.0); 
        this.scene.rotate(-Math.PI/2,1.0, 0.0,0.0);
        this.square.display();
        this.scene.popMatrix();
    }

}