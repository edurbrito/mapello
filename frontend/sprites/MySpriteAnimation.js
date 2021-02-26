/**
 * MySpriteAnimation
 * @constructor
 * @param scene - Reference to MyScene object
 * @param spritesheetId - the id of the spritesheet
 * @param startCell - the cell where the animation starts
 * @param endCell - the cell where de animation ends
 * @param duration - the duration of the animation
 */

class MySpriteAnimation extends CGFobject {
    constructor(scene, spritesheetId, startCell, endCell, duration){
        super(scene);
        this.spritesheetId = spritesheetId;
        this.startCell = startCell;
        this.endCell = endCell;
        this.duration = duration;

        this.board = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);

        this.currentState = this.startCell;
        this.cellTimes = [];
        this.setCellTimes();

        // Total time passed
        this.sumT = 0;
        
        // Last t from update function arg
        this.lastT = 0;
    }

    update(t){
    
        // End animation
        if (this.sumT > this.duration){
            this.currentState = this.startCell;
            this.sumT = 0;
        }

        if(this.lastT == 0) 
            this.lastT = t;

        var deltaT = t - this.lastT;
        this.lastT = t;

        this.sumT += deltaT;
        
        // Get the index of the next cell time
        var nextCellTimeIdx = this.currentState - this.startCell + 1;

        // Check if the next cell time has started & if the cell should be changed
        if (this.nextCellTimeIdx > this.endCell || this.cellTimes[nextCellTimeIdx] > this.sumT)
            return;
        
        // Change currentState if time of the previous cell has ended
        if(this.currentState + 1 <= this.endCell)
            this.currentState++;
    }

    display(){
       // Activate current cell
        this.scene.spritesheets[this.spritesheetId].activateCellP(this.currentState);

        // Display the rectangle
        this.board.display();

        // Resume default shader
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    setCellTimes(){
        // Calculate the start time of each cell
        var ncells = this.endCell - this.startCell + 1;
        var cellTime = this.duration / ncells;

        for(var i = 0; i < ncells; i++)
            this.cellTimes[i] = i * cellTime;
        
    }

}