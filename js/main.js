class Game {
    constructor(){
        this.bubble = null;
        this.bubbles = [];
    }
    start(){
        this.bubble = new Bubble(0,0);
        this.bubbles.push(new Bubble());
    }
}


class Bubble {
    constructor(positionX, positionY){
        this.height = 5;
        this.width = 5;
        this.positionX = positionX;
        this.positionY = positionY;
        

        this.domElement = null;
        this.createDomElement();
    }

    createDomElement(){
        this.domElement = document.createElement("div");
        const bubbleColorArr = ['bubble-pink', 'bubble-green', 'bubble-yellow', 'bubble-blue'];


        this.domElement.className = bubbleColorArr[Math.floor(Math.random()*bubbleColorArr.length)];
        this.domElement.style.left = this.positionX + "vmin"
        this.domElement.style.bottom = this.positionY + "vmin"
        this.domElement.style.height = this.height + "vmin";
        this.domElement.style.width = this.width + "vmin";

        const boardElm = document.getElementById("board");
        boardElm.appendChild(this.domElement);
    }
}

const game = new Game();
game.start();