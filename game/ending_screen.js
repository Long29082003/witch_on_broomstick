export class EndingScreen {
    constructor (game, endingScreenCtx, canvasWidth, canvasHeight) {
        this.game = game;

        //? This is the thing you have to updated when you show endingscreen
        this.killCounts;
        this.totalScore;
        this.savedTime = 0;
        this.surviveTime;

        this.ctx = endingScreenCtx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight; 

        this.images = [new GhostImage(this.ctx, this.canvasWidth, this.canvasHeight),
            new DemonImage(this.ctx, this.canvasWidth, this.canvasHeight),
            new RocketImage(this.ctx, this.canvasWidth, this.canvasHeight),
            new BirdImage(this.ctx, this.canvasWidth, this.canvasHeight),
            new BowlingImage(this.ctx, this.canvasWidth, this.canvasHeight),
            new BulletImage(this.ctx, this.canvasWidth, this.canvasHeight),
            new ReaperImage(this.ctx, this.canvasWidth, this.canvasHeight),
            new GrenadeGuyImage(this.ctx, this.canvasWidth, this.canvasHeight),
        ];

        this.wordDeltaFrameList = [0, 1, 2, 3, 2, 1, 0];
        this.wordDeltaFrameIndex = 0;
        this.timeFromLastWordFrameChange = 0;
        this.intervalToChangeWordFrame = 300;

        this.wordColorList = ["rgb(235, 208, 57)", "rgb(235, 208, 57)", "rgb(235, 208, 57)", "rgb(235, 208, 57)", "rgb(243, 224, 172)", "rgb(243, 224, 172)", "rgb(246, 240, 222)", "rgb(246, 240, 222)"];
        this.wordColorIndex = 0;
        this.timeFromLastColorChange = 0;
        this.intervalToChangeColor = 250;

        this.moveToGameScreen = false;

        this.endingScreenMusic = document.getElementById("ending-screen-sound");
        this.endingScreenMusic.volume = 0.15;
        this.endingScreenMusicStartLoop = 5.33;
        this.endingScreenMusicEndLoop = 114.67;
    };

    update(deltaTime) {
        this.images.forEach(image => image.update(deltaTime));

        if (this.timeFromLastWordFrameChange > this.intervalToChangeWordFrame) {
            this.wordDeltaFrameIndex++;
            if (this.wordDeltaFrameIndex > 6) this.wordDeltaFrameIndex = 0;
            this.timeFromLastWordFrameChange = 0;
        } else {
            this.timeFromLastWordFrameChange += deltaTime;
        };

        if (this.timeFromLastColorChange > this.intervalToChangeColor) {
            this.wordColorIndex++;
            if (this.wordColorIndex > 7) this.wordColorIndex = 0;
            this.timeFromLastColorChange = 0;
        } else {
            this.timeFromLastColorChange += deltaTime;
        };

        this.checkMusicLoop();
    };

    updateKillCount () {
        this.images.forEach(image => {
            image.killCount = this.game.killCount[image.name];
        });
    };

    draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.images.forEach(image => image.draw());
        
        //* Words [Later]
        const minute = Math.floor((this.surviveTime / 1000) / 60);
        const second = Math.round((this.surviveTime / 1000) % 60);
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "23.4px PressStart2P";
        this.ctx.fillStyle = "gray";
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5.2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvasWidth * 1.8 / 8, this.canvasHeight * 0.05);
        this.ctx.lineTo(this.canvasWidth * 6.2 / 8, this.canvasHeight * 0.05);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvasWidth * 2 / 8, this.canvasHeight * 0.15);
        this.ctx.lineTo(this.canvasWidth * 6 / 8, this.canvasHeight * 0.15);
        this.ctx.stroke();
        this.ctx.fillText(`${this.totalScore} pts |  ${minute} min :${second} sec`, (this.canvasWidth / 2) + 1, (this.canvasHeight * 0.12) + 1 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`${this.totalScore} pts |  ${minute} min :${second} sec`, this.canvasWidth / 2, this.canvasHeight * 0.12 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "26px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Press ANY KEY to restart", this.canvasWidth / 2 + 2, this.canvasHeight * 0.94 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 3 + 2);
        this.ctx.fillStyle = this.wordColorList[this.wordColorIndex];
        this.ctx.fillText("Press ANY KEY to restart", this.canvasWidth / 2, this.canvasHeight * 0.94 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 5) ;
        this.ctx.restore();
    };

    checkMusicLoop () {
        if (this.endingScreenMusic.currentTime >= this.endingScreenMusicEndLoop) this.endingScreenMusic.currentTime = this.endingScreenMusicStartLoop;
    };
};


class GhostImage {
    constructor (ctx, canvasWidth, canvasHeight) {
        this.name = "ghost";
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.image = document.getElementById("ghost-image");
        this.spriteWidth = 132;
        this.spriteHeight = 180;
        this.numberOfFrame = 8;
        this.width = 83;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.frame = 0;
        this.x = this.canvasWidth / 8;
        this.y = 109;
        this.killCount = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;
        
        this.wordDeltaFrameList = [0, 1, 2, 3, 2, 1, 0];
        this.wordDeltaFrameIndex = 0;
        this.timeFromLastWordFrameChange = 0;
        this.intervalToChangeWordFrame = 300;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Slightly changing word movement
        if (this.timeFromLastWordFrameChange > this.intervalToChangeWordFrame) {
            this.wordDeltaFrameIndex++;
            if (this.wordDeltaFrameIndex > 6) this.wordDeltaFrameIndex = 0;
            this.timeFromLastWordFrameChange = 0;
        } else {
            this.timeFromLastWordFrameChange += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "19.76px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`${this.killCount}`, this.x + 47.3, this.y + 156.5 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.fillStyle = "gray";
        this.ctx.fillText(`${this.killCount}`, this.x + 46.3, this.y + 155.5 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.restore();
    };
};

class DemonImage {
    constructor (ctx, canvasWidth, canvasHeight) {
        this.name = "demon";
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.image = document.getElementById("demon-image");
        this.spriteWidth = 267;
        this.spriteHeight = 161;
        this.numberOfFrame = 7;
        this.width = 130;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.frame = 0;
        this.x = this.canvasWidth * 2.2 / 8;
        this.y = 124.8;
        this.killCount = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;

        this.wordDeltaFrameList = [0, 1, 2, 3, 2, 1, 0];
        this.wordDeltaFrameIndex = 0;
        this.timeFromLastWordFrameChange = 0;
        this.intervalToChangeWordFrame = 300;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Slightly changing word movement
        if (this.timeFromLastWordFrameChange > this.intervalToChangeWordFrame) {
            this.wordDeltaFrameIndex++;
            if (this.wordDeltaFrameIndex > 6) this.wordDeltaFrameIndex = 0;
            this.timeFromLastWordFrameChange = 0;
        } else {
            this.timeFromLastWordFrameChange += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "19.76px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`${this.killCount}`, this.x + 68, this.y + 141 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText(`${this.killCount}`, this.x + 67, this.y + 140 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.restore();
    };
};

class RocketImage {
    constructor (ctx, canvasWidth, canvasHeight) {
        this.name = "rocket";
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.image = document.getElementById("rocket-image");
        this.spriteWidth = 495;
        this.spriteHeight = 320;
        this.numberOfFrame = 2;
        this.width = 146;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.frame = 0;
        this.x = this.canvasWidth * 3.7 / 8;
        this.y = 120;
        this.killCount = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;

        this.wordDeltaFrameList = [0, 1, 2, 3, 2, 1, 0];
        this.wordDeltaFrameIndex = 0;
        this.timeFromLastWordFrameChange = 0;
        this.intervalToChangeWordFrame = 300;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Slightly changing word movement
        if (this.timeFromLastWordFrameChange > this.intervalToChangeWordFrame) {
            this.wordDeltaFrameIndex++;
            if (this.wordDeltaFrameIndex > 6) this.wordDeltaFrameIndex = 0;
            this.timeFromLastWordFrameChange = 0;
        } else {
            this.timeFromLastWordFrameChange += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "19.76px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`${this.killCount}`, this.x + 68, this.y + 146 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.fillStyle = "red";
        this.ctx.fillText(`${this.killCount}`, this.x + 67, this.y + 145 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.restore();
    };
};

class BirdImage {
    constructor (ctx, canvasWidth, canvasHeight) {
        this.name = "bird";
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.image = document.getElementById("bird-image");
        this.spriteWidth = 133;
        this.spriteHeight = 86;
        this.numberOfFrame = 9;
        this.width = 130;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.frame = 0;
        this.x = this.canvasWidth * 5.12 / 8;
        this.y = 125;
        this.killCount = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;

        this.wordDeltaFrameList = [0, 1, 2, 3, 2, 1, 0];
        this.wordDeltaFrameIndex = 0;
        this.timeFromLastWordFrameChange = 0;
        this.intervalToChangeWordFrame = 300;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Slightly changing word movement
        if (this.timeFromLastWordFrameChange > this.intervalToChangeWordFrame) {
            this.wordDeltaFrameIndex++;
            if (this.wordDeltaFrameIndex > 6) this.wordDeltaFrameIndex = 0;
            this.timeFromLastWordFrameChange = 0;
        } else {
            this.timeFromLastWordFrameChange += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "19.76px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`${this.killCount}`, this.x + 75.4, this.y + 140.4 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.fillStyle = "purple";
        this.ctx.fillText(`${this.killCount}`, this.x + 74.4, this.y + 141.4 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.restore();
    };
};

class BowlingImage {
    constructor (ctx, canvasWidth, canvasHeight) {
        this.name = "bowling";
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.image = document.getElementById("bowling-image");
        this.spriteWidth = 205;
        this.spriteHeight = 261;
        this.numberOfFrame = 8;
        this.width = 75.4;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.frame = 0;
        this.x = this.canvasWidth * 6.55 / 8;
        this.y = 114.4;
        this.killCount = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;

        this.wordDeltaFrameList = [0, 1, 2, 3, 2, 1, 0];
        this.wordDeltaFrameIndex = 0;
        this.timeFromLastWordFrameChange = 0;
        this.intervalToChangeWordFrame = 300;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Slightly changing word movement
        if (this.timeFromLastWordFrameChange > this.intervalToChangeWordFrame) {
            this.wordDeltaFrameIndex++;
            if (this.wordDeltaFrameIndex > 6) this.wordDeltaFrameIndex = 0;
            this.timeFromLastWordFrameChange = 0;
        } else {
            this.timeFromLastWordFrameChange += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "19.76px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`${this.killCount}`, this.x + 39.5, this.y + 151 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.fillStyle = "rgb(80, 216, 25)";
        this.ctx.fillText(`${this.killCount}`, this.x + 38.5, this.y + 150 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.restore();
    };
};

class BulletImage {
    constructor (ctx, canvasWidth, canvasHeight) {
        this.name = "bullet";
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.image = document.getElementById("bullet-image");
        this.spriteWidth = 422;
        this.spriteHeight = 224;
        this.numberOfFrame = 2;
        this.width = 104;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.frame = 0;
        this.x = this.canvasWidth * 2 / 8;
        this.y = 322.4;
        this.killCount = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;

        this.wordDeltaFrameList = [0, 1, 2, 3, 2, 1, 0];
        this.wordDeltaFrameIndex = 0;
        this.timeFromLastWordFrameChange = 0;
        this.intervalToChangeWordFrame = 300;     
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Slightly changing word movement
        if (this.timeFromLastWordFrameChange > this.intervalToChangeWordFrame) {
            this.wordDeltaFrameIndex++;
            if (this.wordDeltaFrameIndex > 6) this.wordDeltaFrameIndex = 0;
            this.timeFromLastWordFrameChange = 0;
        } else {
            this.timeFromLastWordFrameChange += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "19.76px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`${this.killCount}`, this.x + 42, this.y + 112.3 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.fillStyle = "gray";
        this.ctx.fillText(`${this.killCount}`, this.x + 41, this.y + 111.3 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.restore();
    };
};

class ReaperImage {
    constructor (ctx, canvasWidth, canvasHeight) {
        this.name = "reaper";
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.image = document.getElementById("reaper-image");
        this.spriteWidth = 42.2;
        this.spriteHeight = 44;
        this.numberOfFrameX = 8;
        this.numberOfFrameY = 2;
        this.width = 156;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.frameX = 0;
        this.frameY = 0;
        this.x = this.canvasWidth * 3.6 / 8;
        this.y = 286;
        this.killCount = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;

        this.wordDeltaFrameList = [0, 1, 2, 3, 2, 1, 0];
        this.wordDeltaFrameIndex = 0;
        this.timeFromLastWordFrameChange = 0;
        this.intervalToChangeWordFrame = 300;     
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frameX++;
            if (this.frameX > this.numberOfFrameX - 1) {
                this.frameX = 0;
                this.frameY++;
                if (this.frameY > this.numberOfFrameY - 1) this.frameY = 0;
            };
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Slightly changing word movement
        if (this.timeFromLastWordFrameChange > this.intervalToChangeWordFrame) {
            this.wordDeltaFrameIndex++;
            if (this.wordDeltaFrameIndex > 6) this.wordDeltaFrameIndex = 0;
            this.timeFromLastWordFrameChange = 0;
        } else {
            this.timeFromLastWordFrameChange += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "23px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`${this.killCount}`, this.x + 89, this.y + 203.3 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.fillStyle = "rgb(229, 36, 149)";
        this.ctx.fillText(`${this.killCount}`, this.x + 88, this.y + 202.3 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.restore();
    };
};


class GrenadeGuyImage {
    constructor (ctx, canvasWidth, canvasHeight) {
        this.name = "grenadeGuy";
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.image = document.getElementById("grenadeguy-image");
        this.spriteWidth = 35.75;
        this.spriteHeight = 31.5;
        this.numberOfFrame = 8;

        this.width = 156;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.frame = 0;
        this.x = this.canvasWidth * 5.5 / 8;
        this.y = 286;
        this.killCount = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;

        this.wordDeltaFrameList = [0, 1, 2, 3, 2, 1, 0];
        this.wordDeltaFrameIndex = 0;
        this.timeFromLastWordFrameChange = 0;
        this.intervalToChangeWordFrame = 300;     
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Slightly changing word movement
        if (this.timeFromLastWordFrameChange > this.intervalToChangeWordFrame) {
            this.wordDeltaFrameIndex++;
            if (this.wordDeltaFrameIndex > 6) this.wordDeltaFrameIndex = 0;
            this.timeFromLastWordFrameChange = 0;
        } else {
            this.timeFromLastWordFrameChange += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "23px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`${this.killCount}`, this.x + 89, this.y + 203.3 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.fillStyle = "rgb(249, 228, 168)";
        this.ctx.fillText(`${this.killCount}`, this.x + 88, this.y + 202.3 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 2);
        this.ctx.restore();
    };
};

