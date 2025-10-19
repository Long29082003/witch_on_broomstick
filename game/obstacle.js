//Add burn sound when taking damage and burn animation on the player
const fireWallSound = document.getElementById("fire-wall-sound");
const fireWallImage = document.getElementById("fire-wall-image");
const playerGettingHitSound = document.getElementById("player-getting-hit-sound");
const playerDeathSound = document.getElementById("player-death-sound");

export class FireWall {
    constructor(game, player, isFullScreenHeight, xSpeedScale) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.player = player;
        this.image = fireWallImage;
        this.numberOfFrame = 3;
        this.spriteWidth = 32;
        this.spriteHeight = 32;
        this.isFullScreenHeight = isFullScreenHeight;
        this.width = 100;
        this.numberOfFlame = isFullScreenHeight ? 16 : Math.floor(Math.random() * 6) + 6; 
        this.height = 100;
        this.x = this.game.canvasWidth + 50;
        this.y = isFullScreenHeight ? 20 : Math.random() * 500 + 50;
        this.frame = new Array(this.numberOfFlame).fill(0).map((position) => Math.floor(Math.random() * 3));
        this.speed = this.game.normalize(2) * xSpeedScale;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 50;

        fireWallSound.play();

        this.damage = 1;
        this.markedForDeletion = false;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame.forEach((frame, index) => {
                this.frame[index] = frame + 1;
                if (this.frame[index] === 3) this.frame[index] = 0; 
            });
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        // Collision detection wil player
        if (this.player.x < this.x + this.width
            && this.player.x + this.player.width > this.x
            && this.player.y < this.y + this.height * this.numberOfFlame
            && this.player.y + this.player.height > this.y
            && !this.player.invincible
            && this.player.invincibleTime <= 0
            && !this.player.markedForDeletion
        ) {
            this.player.health.currentHealth -= 1;
            this.player.invincibleTime = 5000;
            this.game.timeToDisplayDamageScreen = 100;
            if (this.player.health.currentHealth <= 0) playerDeathSound.play();
            else playerGettingHitSound.play();
        };

        this.x -= this.speed;
        if (this.x < -this.width) this.markedForDeletion = true;
        if (this.markedForDeletion) {
            fireWallSound.pause();
            fireWallSound.currentTime = 0;
        };
    };

    draw() {
        for (let i = 0; i < this.numberOfFlame; i++) {
            this.ctx.drawImage(this.image, this.frame[i] * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y + this.height * i, this.width, this.height);
        };
    };
};