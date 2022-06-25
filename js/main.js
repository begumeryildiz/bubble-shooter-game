
class Game {
    constructor(){
        this.bubble = null;
        this.bubbles = [];
        this.width = 60;
        this.height = 90;
        this.bubbleRadius = 3;
        
    }
    start(){
        this.bubble = new Bubble(30,10);
        let y = this.height - this.bubbleRadius;
        for (let i = 0; i < 8; i++) {
            let a = 3;
            if (i % 2 !== 0) {
                a = 6;
            } 
            for (let x = a; x < 60; x += 6) {
                this.bubbles.push(new Bubble(x, y));
            }
            y -= 5;
        }

        let velocityX = 0.5;
        let velocityY = 0.5;

        setInterval(() => {
            if(this.bubble.positionX + velocityX > this.width - this.bubbleRadius
                || this.bubble.positionX + velocityX < this.bubbleRadius) {
                velocityX = -velocityX;
            }
            if(this.bubble.positionY + velocityY > this.height - this.bubbleRadius
                || this.bubble.positionY + velocityY < this.bubbleRadius) {
                velocityY = -velocityY;
            }
            this.bubble.moveBy(velocityX,velocityY);
        }, 50);
    }

    // function printMousePos(event) {
    //     document.body.textContent =
    //       "clientX: " + event.clientX +
    //       " - clientY: " + event.clientY;
    //   }
      
    //   document.addEventListener("click", printMousePos);
    
    attachEventListeners(){
        document.addEventListener('click', (event) => {
            console.log( "clientX: " + event.clientX +
            " - clientY: " + event.clientY);
        });
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

    moveBy(velocityX, velocityY){
        this.positionX += velocityX;
        this.positionY += velocityY;
        this.domElement.style.left = (this.positionX - (this.width / 2)) + "vh"
        this.domElement.style.bottom = (this.positionY - (this.height / 2))+ "vh"
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.width = this.width + "vh";
    }
}

const game = new Game();
game.start();
game.attachEventListeners();