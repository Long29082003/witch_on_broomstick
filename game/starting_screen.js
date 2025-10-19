export class StartingScreen {
    constructor (startingScreenCtx, canvasWidth, canvasHeight) {
        this.ctx = startingScreenCtx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        this.animations = [new ShootingAnimation(this.ctx, this.canvasWidth, this.canvasHeight), 
                new DashingAnimation(this.ctx, this.canvasWidth, this.canvasHeight), 
                new ChargingAnimation(this.ctx, this.canvasWidth, this.canvasHeight)
        ];

        this.wordDeltaFrameList = [0, 1, 2, 3, 2, 1, 0];
        this.wordDeltaFrameIndex = 0;
        this.timeFromLastWordFrameChange = 0;
        this.intervalToChangeWordFrame = 300;

        this.moveToGameScreen = false;

        this.startingScreenMusic = document.getElementById("starting-screen-sound");
        this.startingScreenMusic.volume = 0.05;
        this.startingScreenMusicStartLoop = 8.5;
        this.startingScreenMusicEndLoop = 32;
        this.startingScreenMusic.currentTime = this.startingScreenMusicStartLoop;
        this.startingScreenMusic.play();
    };

    update(deltaTime) {
        this.animations.forEach(animation => animation.update(deltaTime));

        if (this.timeFromLastWordFrameChange > this.intervalToChangeWordFrame) {
            this.wordDeltaFrameIndex++;
            if (this.wordDeltaFrameIndex > 6) this.wordDeltaFrameIndex = 0;
            this.timeFromLastWordFrameChange = 0;
        } else {
            this.timeFromLastWordFrameChange += deltaTime;
        };
    };

    draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.animations.forEach(animation => animation.draw());
        
        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "44px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Press Any Key to start", this.canvasWidth / 2 + 3, (180 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 5) + 3)
        this.ctx.fillStyle = "rgb(118, 39, 183)";
        this.ctx.fillText("Press Any Key to start", this.canvasWidth / 2, 180 + this.wordDeltaFrameList[this.wordDeltaFrameIndex] * 5);
        this.ctx.restore();
    };

    checkMusicLoop () {
        if (this.startingScreenMusic.currentTime >= this.startingScreenMusicEndLoop) this.startingScreenMusic.currentTime = this.startingScreenMusicStartLoop;
    };
};

class PlayerImage {
    constructor(ctx, canvasWidth, canvasHeight, x, y) {
        this.image = document.getElementById("player-image");
        this.spriteWidth = 46;
        this.spriteHeight = 68;
        this.scale = 3;
        this.ctx = ctx;

        this.x = x;
        this.y = y;
        this.width = this.spriteWidth * this.scale;
        this.height = this.spriteHeight * this.scale;

        this.frame = [0,1,2,1,0];
        this.frameIndex = 0;
        this.numberOfFrameIndex = 5;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;
        this.timeFromLastAttack = 0;
        this.intervalToAttack = 1000;
        this.timeFromLastDashAnimation = 0;
        this.intervalToSpawnDashAnimation = 100;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frameIndex++;
            if (this.frameIndex > this.numberOfFrameIndex - 1) this.frameIndex = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame[this.frameIndex] * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    };
};

class DashingPlayerImage {
    constructor(ctx, canvasWidth, canvasHeight, playerImage) {
        this.ctx = ctx;
        this.playerImage = playerImage;
        this.image = document.getElementById("player-image")
        this.spriteWidth = 46;
        this.spriteHeight = 68;
        this.scale = 3;
        this.width = this.spriteWidth * this.scale;
        this.height = this.spriteHeight * this.scale;
        this.x = this.playerImage.x;
        this.y = this.playerImage.y;
        this.frame = Math.floor(Math.random() * 3);

        this.timeFromCreated = 0;
        this.intervalBeforeDeletion = 400;
        this.markedForDeletion = false;
    }; 

    update(deltaTime) {
        if (this.timeFromCreated >= this.intervalBeforeDeletion) {
            this.markedForDeletion = true;
        } else {
            this.timeFromCreated += deltaTime;
        };
    };

    draw() {
        this.ctx.save();
        this.ctx.filter = `Brightness(${150 - (Math.floor(this.timeFromCreated / 100) * 30)}%)`;
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.ctx.restore();
    };
};

class ProjectileImage {
    constructor (ctx, canvasWidth, canvasHeight, playerImage) {
        this.playerImage = playerImage;
        this.ctx = ctx;
        this.image = document.getElementById("level1-attack-image");

        this.numberOfFrame = 6;
        this.spriteWidth = 154;
        this.spriteHeight = 59;
        this.width = this.spriteWidth * 1.5;
        this.height = this.spriteHeight * 1.5;
        //Hitbox x larger than x by 109
        this.x = this.playerImage.x - 50;
        this.speedX = 1;
        this.acceleration = 0.1;
        this.y = this.playerImage.y + 30;
        this.frame = 0;
        
        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;
        this.markedForDeletion = false;
    };
    
    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    };
};

export class LaserChargingEffectImage {
    constructor(ctx, canvasWidth, canvasHeight, playerImage) {
        this.ctx = ctx;
        this.playerImage = playerImage;
        this.image = document.getElementById("laser-charging-effect-image");
        this.numberOfFrameX = 2;
        this.numberOfFrameY = 7;
        this.spriteWidth = 125;
        this.spriteHeight = 107.14;
        this.width = this.playerImage.width * 1.2;
        this.height = this.playerImage.height * 1.2;
        this.x = this.playerImage.x + this.playerImage.width/2;
        this.y = this.playerImage.y + this.playerImage.height/2;
        this.frameX = 0;
        this.frameY = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 1100/14;
        this.markedForDeletion = false;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frameY++;
            if (this.frameY > this.numberOfFrameY - 1) {
                this.frameY = 0;
                this.frameX++;
                if (this.frameX > this.numberOfFrameX - 1) this.frameX = 0;
            };
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        this.x = this.playerImage.x + this.playerImage.width/2;
        this.y = this.playerImage.y + this.playerImage.height/2;
    };

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - this.width/2, 0 - this.height/2, this.width, this.height);
        this.ctx.restore();
    };
};

//? Combine different classes above for 3 different animations
class ShootingAnimation {
    constructor (ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.playerImage = new PlayerImage(this.ctx, this.canvasWidth, this.canvasHeight, this.canvasWidth * 0.11, 450);
        this.projectileImage = new ProjectileImage(this.ctx, this.canvasWidth, this.canvasHeight, this.playerImage);

        this.buttonImage = document.getElementById("z-key-image");
        this.buttonX = this.playerImage.x + 100;
        this.buttonY = this.playerImage.y + this.playerImage.height + 50;
        this.buttonSpriteWidth = 32;
        this.buttonSpriteHeight = 27;
        this.buttonWidth = 100;
        this.buttonHeight = (this.buttonSpriteHeight / this.buttonSpriteWidth) * this.buttonWidth;
        this.buttonFrame = 0;
        
        this.buttonTimeFromLastFrame = 0;
        this.intervalToChangeButtonFrame = 1000;
        this.pointToResetProjectile = 500;
        this.timeLeftToNotShowProjectileImage = 0;
    };

    update(deltaTime) {
        //? Update frames
        this.playerImage.update(deltaTime);
        this.projectileImage.update(deltaTime);
        if (this.buttonTimeFromLastFrame > this.intervalToChangeButtonFrame) {
            this.buttonFrame++;
            if (this.buttonFrame > 1) this.buttonFrame = 0;
            this.buttonTimeFromLastFrame = 0;
        } else {
            this.buttonTimeFromLastFrame += deltaTime;
        };

        //? Handle movement
        if (this.timeLeftToNotShowProjectileImage <= 0) {
            this.projectileImage.x += this.projectileImage.speedX;
            this.projectileImage.speedX += this.projectileImage.acceleration;
        };
        if (this.projectileImage.x >= this.pointToResetProjectile) {
            this.timeLeftToNotShowProjectileImage = 1000;
            this.projectileImage.x = 350;
            this.projectileImage.speedX = 1;
        };

        this.timeLeftToNotShowProjectileImage -= deltaTime;
    };

    draw() {
        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "30px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Press [Z] to Shoot", this.playerImage.x + 125, this.playerImage.y - 110);
        this.ctx.restore();
        //? Images
        this.playerImage.draw();
        if (this.timeLeftToNotShowProjectileImage <= 0) this.projectileImage.draw();  
        this.ctx.drawImage(this.buttonImage, this.buttonFrame * this.buttonSpriteWidth, 0, this.buttonSpriteWidth, this.buttonSpriteHeight, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
    };
};

class DashingAnimation {
    constructor (ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.playerImage = new PlayerImage(this.ctx, this.canvasWidth, this.canvasHeight, this.canvasWidth * 0.32, 450);
        this.dashingAnimationList = [];
        this.wordPosition = this.playerImage.x + 365;

        this.playerSpeed = 5;
        this.isGoingForward = true;
        this.pointOfGoingForward = 850;
        this.pointOfTurningBack = 1300;
        this.timeFromLastSpawnDashAnimation = 0;
        this.timeToSpawnDashAnimation = 150;

        this.buttonImage = document.getElementById("shift-key-image");
        this.buttonX = this.playerImage.x + 300;
        this.buttonY = this.playerImage.y + this.playerImage.height + 50;
        this.buttonSpriteWidth = 48;
        this.buttonSpriteHeight = 27;
        this.buttonWidth = 200;
        this.buttonHeight = 85;
        this.buttonFrame = 1;
        
        this.buttonTimeFromLastFrame = 0;
        this.intervalToChangeButtonFrame = 1000;
    };

    update(deltaTime) {
        //? Update frame
        this.playerImage.update(deltaTime);
        this.dashingAnimationList.forEach(dashAnimation => dashAnimation.update(deltaTime));
        if (this.buttonTimeFromLastFrame > this.intervalToChangeButtonFrame) {
            this.buttonFrame++;
            if (this.buttonFrame > 1) this.buttonFrame = 0;
            this.buttonTimeFromLastFrame = 0;
        } else {
            this.buttonTimeFromLastFrame += deltaTime;
        };

        //? Handle movement
        this.playerSpeed = this.isGoingForward ?  5 : -2.9;
        this.playerImage.x += this.playerSpeed;

        if (this.isGoingForward && this.playerImage.x >= this.pointOfTurningBack) {
            this.isGoingForward = false;
        } else if (!this.isGoingForward && this.playerImage.x <= this.pointOfGoingForward) {
            this.isGoingForward = true;
        };

        if (this.isGoingForward) {
            if (this.timeFromLastSpawnDashAnimation > this.timeToSpawnDashAnimation) {
                this.dashingAnimationList.push(new DashingPlayerImage(this.ctx, this.canvasWidth, this.canvasHeight, this.playerImage));
                this.timeFromLastSpawnDashAnimation = 0;
            } else {
                this.timeFromLastSpawnDashAnimation += deltaTime;
            };
        };

        //? Delete dashAnimation
        this.dashingAnimationList = this.dashingAnimationList.filter(dashingAnimation => !dashingAnimation.markedForDeletion);
    };

    draw() {
        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "30px PressStart2P";
        this.ctx.fillStyle = "white"
        this.ctx.fillText("Press [Shift] to Dash", this.wordPosition, 340);
        this.dashingAnimationList.forEach(dashAnimation => dashAnimation.draw());
        this.ctx.restore();

        this.ctx.save();
        this.ctx.globalAlpha = this.isGoingForward ? 0.5 : 1;
        this.playerImage.draw();
        this.ctx.restore();
        //Button
        this.ctx.drawImage(this.buttonImage, this.buttonFrame * this.buttonSpriteWidth, 0, this.buttonSpriteWidth, this.buttonSpriteHeight, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
    };
};

class ChargingAnimation {
    constructor (ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.playerImage = new PlayerImage(this.ctx, this.canvasWidth, this.canvasHeight, this.canvasWidth * 0.77, 450);
        this.laserCharingEffect = new LaserChargingEffectImage(this.ctx, this.canvasWidth, this.canvasHeight, this.playerImage);

        this.buttonImage = document.getElementById("space-key-image");
        this.buttonX = this.playerImage.x;
        this.buttonY = this.playerImage.y + this.playerImage.height + 50;
        this.buttonSpriteWidth = 64;
        this.buttonSpriteHeight = 27;
        this.buttonWidth = 200;
        this.buttonHeight = 85;
        this.buttonFrame = 0;
        
        this.buttonTimeFromLastFrame = 0;
        this.intervalToChangeButtonFrame = 1000;
    };

    update(deltaTime) {
        this.playerImage.update(deltaTime);
        this.laserCharingEffect.update(deltaTime);
        if (this.buttonTimeFromLastFrame > this.intervalToChangeButtonFrame) {
            this.buttonFrame++;
            if (this.buttonFrame > 1) this.buttonFrame = 0;
            this.buttonTimeFromLastFrame = 0;
        } else {
            this.buttonTimeFromLastFrame += deltaTime;
        };
    }

    draw() {
        //* Words
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.font = "30px PressStart2P";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Press [Space] for Laser", this.playerImage.x + 125, this.playerImage.y - 110);
        this.ctx.restore();

        this.playerImage.draw();
        this.laserCharingEffect.draw();
        //Button
        this.ctx.drawImage(this.buttonImage, this.buttonFrame * this.buttonSpriteWidth, 0, this.buttonSpriteWidth, this.buttonSpriteHeight, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
    };
};

