
class Game {
    constructor(){
        this.bubble = null;
        this.bubbles = [];
        this.width = 60;
        this.height = 90;
        this.bubbleRadius = 3;
        this.velocity = 1;
        this.velocityX = 0.0;
        this.velocityY = 0.0;
        
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

        

        setInterval(() => {
            if(this.bubble.positionX + this.velocityX > this.width - this.bubbleRadius
                || this.bubble.positionX + this.velocityX < this.bubbleRadius) {
                this.velocityX = -this.velocityX;
            }
            if(this.bubble.positionY + this.velocityY > this.height - this.bubbleRadius
                || this.bubble.positionY + this.velocityY < this.bubbleRadius) {
                this.velocityY = -this.velocityY;
            }
            this.bubble.moveBy(this.velocityX, this.velocityY);
        }, 50);
    }
    
    attachEventListeners(){
        document.addEventListener('click', (event) => {
            console.log( "clientX: " + event.clientX +
            " - clientY: " + event.clientY);

        const velocityPixelX = event.clientX - this.bubble.getCenterX();
        const velocityPixelY = -(event.clientY - this.bubble.getCenterY());
        console.log("getcenterX " + this.bubble.getCenterX())
        console.log("getcenterY " + this.bubble.getCenterY())
        const diagonalPixel = Math.sqrt(velocityPixelX ** 2 + velocityPixelY ** 2);
        const moveRatio = this.velocity / diagonalPixel;
        this.velocityX = velocityPixelX * moveRatio;
        this.velocityY = velocityPixelY * moveRatio;

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

    getCenterX() {
        let viewportOffset = this.domElement.getBoundingClientRect();
        let centerX = viewportOffset.left + viewportOffset.width / 2;
        return centerX;
        
    }

    getCenterY() {
        let viewportOffset = this.domElement.getBoundingClientRect();
        let centerY = viewportOffset.top + viewportOffset.height / 2;
        return centerY;
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