const verticalStep = Math.sqrt(27);

class Game {
    constructor(){
        this.bubble = null;
        this.bubbles = [];
        this.width = 60;
        this.height = 90;
        this.bubbleRadius = 3;
        this.velocity = 0.3;
        this.velocityX = 0;
        this.velocityY = 0;
        this.score = 0;   
    }

    start(){
        let y = this.height - this.bubbleRadius;
        for (let i = 0; i < 8; i++) {
            let a = 3;
            if (i % 2 !== 0) {
                a = 6;
            } 
            for (let x = a; x < 60; x += 6) {
                this.bubbles.push(new Bubble(x, y));
            }
            y -= verticalStep;
        }
        this.newActiveBubble();
    }


    moveBubble() {
        let stopped = false
        // border collusion
        if(this.bubble.positionX + this.velocityX > this.width - this.bubbleRadius
            || this.bubble.positionX + this.velocityX < this.bubbleRadius) {
            this.velocityX = -this.velocityX;
        }
        if(this.bubble.positionY + this.velocityY < this.bubbleRadius) {
            this.velocityY = -this.velocityY;
        }
        if (this.bubble.positionY + this.velocityY > this.height - this.bubbleRadius){
            this.velocityX = 0;
            this.velocityY = 0;
            this.bubble.positionY = this.height - this.bubbleRadius;
            stopped = true;
        }

        // bubble to bubble collusion
        const closestBubbles = [];
        for (let i = 0; i < this.bubbles.length; i++) {
            if ( this.bubbles[i].willCollide(this.bubble, this.velocityX, this.velocityY) !== false) {
                closestBubbles.push(this.bubbles[i]);
            }
        }

        if(closestBubbles.length > 0) {
            this.velocityX = 0;
            this.velocityY = 0;
            const locations = this.bubble.closestLocation(closestBubbles).getPossibleLocations();
            const bestLocation = this.bubble.closestLocation(locations);
            this.bubble.positionX = bestLocation.positionX;
            this.bubble.positionY = bestLocation.positionY;
            stopped = true;  
        }



        // move if no collusion
        this.bubble.moveBy(this.velocityX, this.velocityY);
        if (stopped) {
            this.bubbleStick();
        }
    }

    bubbleStick() {
        clearInterval(this.intervalId);

        this.bubbles.push(this.bubble);
        this.findClustersAndRemoveBubbles();
        
        setTimeout(() => {  
            this.newActiveBubble();
        }, 1000);   
    }

    newActiveBubble() {
        this.bubble = new Bubble(30,10);
        this.bubble.startShaking();
    }
    
    attachEventListeners(){
        document.addEventListener('click', (event) => {


            if(this.bubble.actionComplete === false) {
                this.bubble.actionComplete = true;
                const velocityPixelX = event.clientX - this.bubble.getCenterX();
                const velocityPixelY = -(event.clientY - this.bubble.getCenterY());
                
                const diagonalPixel = Math.sqrt(Math.pow(velocityPixelX, 2) + Math.pow(velocityPixelY, 2));
                const moveRatio = this.velocity / diagonalPixel;
                this.velocityX = velocityPixelX * moveRatio;
                this.velocityY = velocityPixelY * moveRatio;
                
                this.intervalId = setInterval(() => {
                    this.moveBubble();   
                }, 4);
        

                this.bubble.stopShaking();
            }   
        });
    }

    findClustersAndRemoveBubbles() {
        const clusterArr = [];
        const newMemberArr = [];
        
        clusterArr.push(this.bubble);
        newMemberArr.push(this.bubble);

        while (newMemberArr.length > 0) {
            const element = newMemberArr.shift();
            
            for (let i = 0; i < this.bubbles.length; i++) {
                if(element.isNeighbor(this.bubbles[i]) === true
                    && element.isSameColor(this.bubbles[i]) === true) {
                    if (clusterArr.indexOf(this.bubbles[i]) === -1) {
                        clusterArr.push(this.bubbles[i]);
                        newMemberArr.push(this.bubbles[i]);
                    }
                }
            }
        }

        if (clusterArr.length >= 3) {
            this.score += Math.pow(clusterArr.length, 2) * 10;
            console.log(this.score);
            for(let i = 0; i < clusterArr.length; i++) {
                this.removeBubble(clusterArr[i]);
            }
        }
    }

    removeBubble(aBubble){
        const index = this.bubbles.indexOf(aBubble);
        if (index > -1) {
            this.bubbles.splice(index, 1); 

            const board = document.getElementById("board");
            board.removeChild(aBubble.domElement);
        }
    }
}


class Bubble {
    constructor(positionX, positionY){
        this.height = 6;
        this.width = 6;
        this.positionX = positionX;
        this.positionY = positionY;
        this.actionComplete = false;

        const bubbleColorArr = ['bubble-pink', 'bubble-green', 'bubble-yellow', 'bubble-blue'];
        this.color = bubbleColorArr[Math.floor(Math.random()*bubbleColorArr.length)];

        this.domElement = null;
        this.createDomElement();
    }

    createDomElement(){
        this.domElement = document.createElement("div");

        this.domElement.className = this.color;

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

    getPossibleLocations() {
        const locationsArr = [];
        locationsArr.push({positionX:this.positionX + 3, positionY:this.positionY - verticalStep});
        locationsArr.push({positionX:this.positionX - 3, positionY:this.positionY - verticalStep});
        locationsArr.push({positionX:this.positionX + 6, positionY:this.positionY});
        locationsArr.push({positionX:this.positionX - 6, positionY:this.positionY});
        locationsArr.push({positionX:this.positionX + 3, positionY:this.positionY + verticalStep});
        locationsArr.push({positionX:this.positionX - 3, positionY:this.positionY + verticalStep});
        
        const locationsInBoard = locationsArr.filter(location =>
            0 < location.positionX && location.positionX < 60
            && 0 < location.positionY && location.positionY < 90)
        return locationsInBoard;
    }

    distanceTo(x, y) {
        const centerX = this.positionX - this.width/2;
        const centerY = this.positionY - this.height/2;
        const distance = Math.sqrt(Math.pow((centerX - x), 2) + Math.pow((centerY - y), 2));
        return distance;
    }

    closestLocation(locations) {
        let location = locations[0];
        let minDistance = this.distanceTo(locations[0].positionX, locations[0].positionY);
        for (let i = 0; i < locations.length; i++) {
            const distance =  this.distanceTo(locations[i].positionX, locations[i].positionY);
            
            if ( distance < minDistance) {
                minDistance = distance;
                location = locations[i];
            }
        }
        return location;
    }

    willCollide(otherBubble, velocityX, velocityY) {
        const centerX = this.positionX - this.width/2;
        const centerY = this.positionY - this.height/2;
        const otherCenterX = otherBubble.positionX - otherBubble.width/2 + velocityX; 
        const otherCenterY = otherBubble.positionY - otherBubble.height/2 + velocityY;
        const distance = Math.sqrt(Math.pow((centerX - otherCenterX), 2) + Math.pow((centerY - otherCenterY), 2));
        if (distance <= 6) {
            return true;
        }
        return false;
    }

    isNeighbor(otherBubble) {
        if (this.bubble === otherBubble) {
            return false;
        }
        return this.willCollide(otherBubble, 0, 0);   
    }

    isSameColor(otherBubble){
        if(this.color === otherBubble.color) {
            return true;
        }
        return false;
    }

    moveBy(velocityX, velocityY){
        this.positionX += velocityX;
        this.positionY += velocityY;
        this.domElement.style.left = (this.positionX - (this.width / 2)) + "vh"
        this.domElement.style.bottom = (this.positionY - (this.height / 2))+ "vh"
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.width = this.width + "vh";
    }

    startShaking() {
        this.domElement.style.animationName= 'shake';
        this.domElement.style.animationDuration= '0.3s';
        this.domElement.style.animationIterationCount = 'infinite';
    }

    stopShaking() {
        this.domElement.style.animationName= '';
    }

}

const game = new Game();
game.start();
game.attachEventListeners();