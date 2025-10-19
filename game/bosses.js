//? If have time, fix spriteSheet
import {ReaperProjectile, ReaperProjectileSpecial, GrenadeGuyProjectile} from "./enemy_projectile.js";
import {BossExplosion} from "./explosion.js";
import {Bullet} from "./enemy.js";
const reaperImage = document.getElementById("reaper-image");
const grenadeGuyImage = document.getElementById("grenadeguy-image");
const reaperDeathSound = document.getElementById("reaper-death-sound");
const grenadeGuyDeathSound = document.getElementById("grenadeguy-death-sound");
const grenadeGuyLaunchSound = document.getElementById("grenadeguy-launch-sound");
const playerGettingHitSound = document.getElementById("player-getting-hit-sound");
const playerDeathSound = document.getElementById("player-death-sound");

reaperDeathSound.volume = 0.3;
grenadeGuyDeathSound.volume = 0.3;

export class Reaper {
    constructor(game, player, hp) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.player = player;
        this.image = reaperImage;
        this.spriteWidth = 42;
        this.spriteHeight = 44;
        this.animationWidth = 400;
        this.animationHeight = (this.spriteHeight / this.spriteWidth) * this.animationWidth;
        this.animationX = this.game.canvasWidth + 100;
        this.animationY = Math.random() * 100 + 300;
        this.upperY = this.animationY + 400;
        this.lowerY = Math.min(this.game.canvasHeight - this.animationWidth, this.animationY - 400);
        this.movingIn = true;
        this.isAttack = false;

        this.deltaXHitbox = 0.15;
        this.deltaYHitbox = 0.1;
        this.deltaWidthHitbox = -0.2;
        this.deltaHeightHitbox = -0.2;

        this.x = this.animationX + 80;
        this.y = this.animationY + 60;
        this.width = 120;
        this.height = 110;

        this.speedX = this.game.normalize(0.5);
        this.numberOfFrameX = 8;
        this.numberOfFrameY = 2;
        this.speedY = this.game.normalize(1);
        this.frameX = 0;
        this.frameY = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;
        this.timeFromLastAttack = 0;
        this.intervalToAttack = 12000;
        this.glowingTime = 0;
        this.alreadyHit = false;
        
        this.hp = hp;
        this.damage = 1;
        this.point = 10000;
        this.markedForDeletion = false;
    };

    update(deltaTime) {
        //? Handle boss moving in
        if (this.movingIn) {
            this.animationX -= this.speedX;
        };
        if (this.animationX <= this.game.canvasWidth - this.animationWidth) this.movingIn = false;

        //? Handle boss vertical movement
        if (!this.movingIn) {
            if (this.animationY <= this.lowerY || this.animationY >= this.upperY) this.speedY = -this.speedY;
            this.animationY += this.isAttack ? 0 : this.speedY;
        };

        //? Handle attack movement
        if (this.timeFromLastAttack > this.intervalToAttack) {
            this.isAttack = true;
            this.frameX = 0;
            this.frameY = 2;
            if (Math.random < 0.7) {
                this.game.enemyProjectiles.push(new ReaperProjectile(this.game, this.player, this));    
            } else {
                this.game.enemyProjectiles.push(new ReaperProjectileSpecial(this.game, this.player, this, "Up"));
                this.game.enemyProjectiles.push(new ReaperProjectileSpecial(this.game, this.player, this, "Down"));
            }
            this.timeFromLastAttack = 0;
        } else {
            this.timeFromLastAttack += deltaTime;
        };

        //? Handle frame
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frameX++;
            if (this.frameX > this.numberOfFrameX - 1) {
                this.frameX = 0;
                this.frameY++;
                if (this.frameY > this.numberOfFrameY - 2 && !this.isAttack) this.frameY = 0;
                else if (this.frameY > this.numberOfFrameY - 1 && this.isAttack) this.frameY = 2;
            };
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };
        
        //? Update hitbox position
        this.x = this.animationX + 80;
        this.y = this.animationY + 60;

        //? Check collision with player
        if (this.collideWithPlayer()) {
            this.player.invincibleTime = 3000;
            this.player.health.currentHealth--;
            playerGettingHitSound.play();
            if (this.player.health.currentHealth === 0) playerDeathSound.play();
            this.game.timeToDisplayDamageScreen = 100;
        };

        //? Reset alreadyHit status when there is no Player projectile on the screen
        if (this.game.projectiles.length === 0) this.alreadyHit = false;

        if (this.hp <= 0) {
            this.game.killCount["reaper"]++;
            this.markedForDeletion = true;
            this.deathAnimation();
        };
        this.glowingTime -= deltaTime;
    };

    draw() {
        this.ctx.save();
        if (this.glowingTime > 0) this.ctx.filter = "brightness(200%)";
        this.ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.animationX, this.animationY, this.animationWidth, this.animationHeight);
        this.ctx.restore();
    };

    async deathAnimation () {
        this.game.explosions.push(new BossExplosion(this));
        for (let i = 0; i < 10; i++) {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    reaperDeathSound.currentTime = 0;
                    resolve(reaperDeathSound.play());
                }, 150);
            });
        };  
    };

    collideWithPlayer() {
        const playerX = this.player.x + this.player.width * this.player.deltaXHitbox;
        const playerY = this.player.y + this.player.height * this.player.deltaYHitbox;
        const playerWidth = this.player.width + this.player.width * this.player.deltaWidthHitbox;
        const playerHeight = this.player.height + this.player.height * this.player.deltaHeightHitbox;
        
        const reaperX = this.animationX + this.animationWidth * this.deltaXHitbox;
        const reaperY = this.animationY + this.animationHeight * this.deltaYHitbox;
        const reaperWidth = this.animationWidth + this.animationWidth * this.deltaWidthHitbox;
        const reaperHeight = this.animationHeight + this.animationHeight * this.deltaHeightHitbox;

        return playerX < reaperX + reaperWidth 
            && playerX + playerWidth > reaperX
            && playerY < reaperY + reaperHeight
            && playerY + playerHeight > reaperY
            && !this.player.invincible
            && this.player.invincibleTime <= 0
    };
};

export class GrenadeGuy {
    constructor (game, player, hp, bulletXSpeedScale) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.player = player;
        this.image = grenadeGuyImage;
        this.spriteWidth = 35.75;
        this.spriteHeight = 32;
        this.animationWidth = 400;
        this.animationHeight = (this.spriteHeight / this.spriteWidth) * this.animationWidth;
        this.animationX = this.game.canvasWidth + 100;
        this.animationY = this.game.canvasHeight - this.animationHeight;
        this.upperX = this.game.canvasWidth - this.animationWidth;
        this.lowerX = Math.random() * 500 + 1300;
        this.movingIn = true;
        this.isAttack = false;

        this.x = this.animationX + 100;
        this.y = this.animationY + 40;
        this.width = 130;
        this.height = 120;
        this.numberOfFrameX = 8;
        this.numberOfFrameY = 2;
        this.frameX = 0;
        this.frameY = 0;
        this.speedX = this.game.normalize(-1);
        this.bulletXSpeedScale = bulletXSpeedScale;

        this.deltaXHitbox = 0.22;
        this.deltaYHitbox = 0.1;
        this.deltaWidthHitbox = -0.25;
        this.deltaHeightHitbox = -0.2;
        
        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 200;
        this.timeFromLastAttack = 0;
        this.intervalToAttack = 10000;
        this.timeFromLastBulletSpawn = 0;
        this.intervalToSpawnBullet = 15000;
        this.glowingTime = 0;
        this.alreadyHit = false;
        
        this.hp = hp;
        this.damage = 1;
        this.point = 20000;
        this.markedForDeletion = false;

        this.sound = grenadeGuyLaunchSound;
        this.sound.volume = 0.3;
    };

    update(deltaTime) {
        //? Handle movement
        if (this.animationX > this.upperX || this.animationX < this.lowerX) this.speedX = -this.speedX;
        if (this.movingIn) {
            this.speedX = this.game.normalize(-1);
            if (this.animationX < this.upperX) this.movingIn = false;
        };
        
        this.animationX += this.isAttack ? 0 : this.speedX;

        //? Update frame
        this.frameY = this.isAttack ? this.frameY = 1 : 0; 
        if (this.frameY === 0) this.numberOfFrameX = 8;
        else if (this.frameY === 1) this.numberOfFrameX = 5;
        
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frameX++;
            if (this.frameX > this.numberOfFrameX - 1) this.frameX = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Update attack
        if (this.timeFromLastAttack > this.intervalToAttack) {
            this.frameX = 0;
            this.frameY = 1;
            this.isAttack = true;
            setTimeout(() => {
                this.sound.currentTime = 0;
                this.sound.play();
                this.game.enemyProjectiles.push(new GrenadeGuyProjectile(this.game, this.player, this));
                this.game.enemyProjectiles.push(new GrenadeGuyProjectile(this.game, this.player, this));
                this.game.enemyProjectiles.push(new GrenadeGuyProjectile(this.game, this.player, this));
                this.game.enemyProjectiles.push(new GrenadeGuyProjectile(this.game, this.player, this));
                this.timeFromLastAttack = 0;
                this.isAttack = false;
            }, 1500)
            this.timeFromLastAttack = 0;
        } else {
            this.timeFromLastAttack += deltaTime;
        };

        if (this.timeFromLastBulletSpawn > this.intervalToSpawnBullet) {
            setTimeout(() => {
                this.game.enemies.push(new Bullet(this.game, this.hp * 0.3, this.bulletXSpeedScale));
            }, 700);
            this.game.enemies.push(new Bullet(this.game, this.hp * 0.3, this.bulletXSpeedScale));
            this.timeFromLastBulletSpawn = 0;
        } else {
            this.timeFromLastBulletSpawn += deltaTime;
        };

        //? Update hitbox animation
        this.x = this.animationX + 100;
        this.y = this.animationY + 40;

        //? Check collision with player
        if (this.collideWithPlayer()) {
            this.player.invincibleTime = 3000;
            this.player.health.currentHealth--;
            playerGettingHitSound.play();
            if (this.player.health.currentHealth === 0) playerDeathSound.play();
            this.game.timeToDisplayDamageScreen = 100;
        };
        
        //? Reset alreadyHit status when there is no Player projectile on the screen
        if (this.game.projectiles.length === 0) this.alreadyHit = false;

        if (this.hp <= 0) {
            this.game.killCount["grenadeGuy"]++;
            this.markedForDeletion = true;
            this.deathAnimation();
        };
        this.glowingTime -= deltaTime;
    };

    draw() {
        this.ctx.save();
        this.ctx.filter = `Brightness(${this.glowingTime > 0 ? "200%" : "100%"})`;
        this.ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteWidth, this.spriteWidth, this.spriteHeight, this.animationX, this.animationY, this.animationWidth, this.animationHeight);
        this.ctx.restore();
    };

    async deathAnimation () {
        this.game.explosions.push(new BossExplosion(this));
        for (let i = 0; i < 10; i++) {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    grenadeGuyDeathSound.currentTime = 0;
                    resolve(grenadeGuyDeathSound.play());
                }, 150);
            });
        };  
    };

    collideWithPlayer() {
        const playerX = this.player.x + this.player.width * this.player.deltaXHitbox;
        const playerY = this.player.y + this.player.height * this.player.deltaYHitbox;
        const playerWidth = this.player.width + this.player.width * this.player.deltaWidthHitbox;
        const playerHeight = this.player.height + this.player.height * this.player.deltaHeightHitbox;
        
        const reaperX = this.animationX + this.animationWidth * this.deltaXHitbox;
        const reaperY = this.animationY + this.animationHeight * this.deltaYHitbox;
        const reaperWidth = this.animationWidth + this.animationWidth * this.deltaWidthHitbox;
        const reaperHeight = this.animationHeight + this.animationHeight * this.deltaHeightHitbox;

        return playerX < reaperX + reaperWidth 
            && playerX + playerWidth > reaperX
            && playerY < reaperY + reaperHeight
            && playerY + playerHeight > reaperY
            && !this.player.invincible
            && this.player.invincibleTime <= 0
    };
};

