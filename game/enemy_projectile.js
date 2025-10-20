import {GrenadeExplosion} from "./explosion.js";
const reaperProjectile = document.getElementById("reaper-projectile-image");
const grenadeGuyProjectile = document.getElementById("grenadeguy-projectile-image");
const reaperProjectileSound = document.getElementById("reaperbot-projectile-sound");

export class ReaperProjectile {
    constructor(game, player, reaper) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.player = player;
        this.reaper = reaper;
        this.image = reaperProjectile;
        this.spriteWidth = 35.75;
        this.spriteHeight = 35;
        this.numberOfFrame = 4;
        this.width = 156;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.x = this.reaper.x - this.width;
        this.y = this.reaper.y + 26;
        this.deltaXHitbox = 0;
        this.deltaYHitbox = 0;
        this.deltaWidthHitbox = 0;
        this.deltaHeightHitbox = 0;
        this.speedX = this.game.normalize(-4.6) * 0.52;
        this.acceleration = 0;
        this.pointOfDeceleration = 260;
        this.frame = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 50;
        
        this.damage = 1;
        this.markedForDeletion = false;

        this.sound = reaperProjectileSound;
        this.sound.loop = true;
        this.sound.currentTime = 0;
        this.sound.volume = 0.1;
        this.sound.play();
    };

    update(deltaTime) {
        //? Update frame
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.frame = 0;
            this.timeFromLastFrame = 0;       
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Update movement
        if (this.x <= this.pointOfDeceleration) this.acceleration = this.game.normalize(0.025) * 0.52;
        else this.acceleration = 0;

        this.x += this.speedX;
        this.speedX += this.acceleration;

        if (this.x >= this.reaper.x) {
            this.markedForDeletion = true
            this.sound.pause();
            this.reaper.isAttack = false;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    };
};

export class ReaperProjectileSpecial extends ReaperProjectile {
    constructor (game, player, reaper, direction) {
        super(game, player, reaper);
        this.ySaved = this.y;
        this.angle = 270;
        this.direction = direction === "Up" ? 1 : -1;
    };

    update(deltaTime) {
        super.update(deltaTime);
        this.y = this.direction * 208 * Math.cos(this.angle * Math.PI / 180) + this.ySaved;
        this.angle += this.game.normalize(0.37);
    };
};

// Fix horizontal movement
export class GrenadeGuyProjectile {
    constructor (game, player, grenadeGuy) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.player = player;
        this.grenadeGuy = grenadeGuy;
        this.image = grenadeGuyProjectile;
        this.spriteWidth = 16;
        this.spriteHeight = 15.66;
        this.width = 78;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.x = this.grenadeGuy.animationX + 52;
        this.y = this.grenadeGuy.animationY + 36.5;
        this.xNaught = this.grenadeGuy.animationX + 52;
        this.yNaught = this.grenadeGuy.animationY + 36.5;
        this.numberOfFrameX = 5;
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 3);
        this.deltaXHitbox = 0;
        this.deltaYHitbox = 0;
        this.deltaWidthHitbox = 0;
        this.deltaHeightHitbox = 0;

        this.timeToGetToTarget = this.game.inverseNormalize(300); //Frame;
        this.targetX = Math.random() * 520 + 104;
        this.targetY = Math.random() * 416 + 104;
        this.speedX = ((this.targetX - this.xNaught) / this.timeToGetToTarget) * 0.52;
        this.speedY = -6.76;
        this.accelerationY = 0.052;

        this.timeFromLastSpawn = 0;
        this.intervalToExplosion = 4500;
        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 20;
        
        this.explosionRadius = 65;
        this.damage = 1;
        this.markedForDeletion = false;
    };

    update(deltaTime) {
        //? Update frame
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frameX++;
            if (this.frameX > this.numberOfFrameX - 1) this.frameX = 0;
            this.timeFromLastFrame = 0;       
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Update movement
        const dx = (this.targetX - this.x) / 230;
        const dy = (this.targetY - this.y) / 230; 
        this.x += Math.max(this.speedX, dx);
        this.y += this.speedY > this.game.inverseNormalize(0.2) * 0.52 ? dy : this.speedY;
        this.speedY += this.accelerationY;

        //? Update explosion
        if (this.timeFromLastSpawn > this.intervalToExplosion) {
            this.markedForDeletion = true;
            this.game.explosions.push(new GrenadeExplosion(this));
        } else {
            this.timeFromLastSpawn += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    };
};