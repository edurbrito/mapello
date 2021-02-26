/**
 * MySpriteText
 * @constructor
 * @param scene - Reference to MyScene object
 * @param text- the tex to be written
 */

class MySpriteText extends CGFobject {
    constructor(scene, text){
        super(scene);
        this.text = text;

        this.texture = this.scene.textures['mySpriteTextTexture'];
        
        this.spriteSheet = new MySpriteSheet(this.scene, this.texture, 16, 16);

        this.board = new MyRectangle(this.scene, -this.text.length/2 -1, -0.5, -this.text.length/2, 0.5);
    }

    getCharacterPosition(character){
        // Unicode
        // Supports all important characters: [a-z], [A-Z], [0-9], [!#$%/()=?.-,+-_;*^~\@'], [&lt;, &gt;, &quot;]
        return character.charCodeAt(0);
    }

    display(){
        
        var cell;
        
        // For each char in text
        for(var i = 0; i < this.text.length; i++){
           
            // Get c,l position for the given char
            cell = this.getCharacterPosition(this.text[i]);
    
            this.scene.translate(1,0,0);
            
            this.spriteSheet.activateCellP(cell);

            // Display the rectangle
            this.board.display();
 
        }

        // Resume default shader
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    setText(text) {
        this.text = text;
    }

}