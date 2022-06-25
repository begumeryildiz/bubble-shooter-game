class Game {
    constructor(){
        this.bubble = null;
        this.bubbles = [];
    }
    start(){
        this.bubble = new Bubble(30,10);

        let x = 3;
        for (let i = 0; i < 10; i++) {
            this.bubbles.push(new Bubble(x, 87));
            x += 6;
        }
    }       
}


class Bubble {
    constructor(positionX, positionY){
        this.height = 6;
        this.width = 6;
        this.positionX = positionX;
        this.positionY = positionY;
        

        this.domElement = null;
        this.createDomElement();
    }

    createDomElement(){
        this.domElement = document.createElement("div");
        const bubbleColorArr = ['bubble-pink', 'bubble-green', 'bubble-yellow', 'bubble-blue'];


        this.domElement.className = bubbleColorArr[Math.floor(Math.random()*bubbleColorArr.length)];
        this.domElement.style.left = (this.positionX - (this.width / 2)) + "vh"
        this.domElement.style.bottom = (this.positionY - (this.height / 2))+ "vh"
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.width = this.width + "vh";

        const boardElm = document.getElementById("board");
        boardElm.appendChild(this.domElement);
    }
}

const game = new Game();
game.start();