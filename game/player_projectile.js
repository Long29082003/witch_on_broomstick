const projectile1Sound = document.getElementById("projectile1-sound");
const projectile2Sound = document.getElementById("projectile2-sound");
const projectile3Sound = document.getElementById("projectile3-sound");
const projectile1Image = document.getElementById("level1-attack-image");
const projectile2Image = document.getElementById("level2-attack-image");
const projectile3Image = document.getElementById("level3-attack-image");
const laserSound = document.getElementById("laser-sound");
import {Projectile1Explosion, Projectile2Explosion, Projectile3Explosion} from "./explosion.js";
const projectiles = {
    1 : {
        level : 1, 
        image : projectile1Image,
        explosionImage : document.getElementById("level1-explosion-image"),
        damage : 10,
        scale : 1.5,
        acceleration : 0.12,
    },
    2 : {
        level : 2,
        image : projectile2Image,
        explosionImage : document.getElementById("level2-explosion-image"),
        damage : 10,
        scale: 2,
        acceleration : 0.15,
    },
    3 : {
        level : 3,
        image : projectile3Image,
        explosionImage : document.getElementById("level3-explosion-image"),
        damage : 10,
        scale: 2.5,
        acceleration : 0.3,
    },
};

class Projectile {
    constructor(game, player) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.player = player;
        this.level = projectiles[this.player.attackLevel];

        this.image = this.level.image;
        this.numberOfFrame = 6;
        this.spriteWidth = 154;
        this.spriteHeight = 59;
        this.width = this.spriteWidth * this.level.scale;
        this.height = this.spriteHeight * this.level.scale;
        //Hitbox x larger than x by 109
        this.x = this.player.x - 109;
        this.y = this.player.y + 10;
        this.speed = this.game.normalize(3);
        this.acceleration = this.game.normalize(this.level.acceleration);
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

//? This is for Projectile 1
export class Projectile1 extends Projectile {
    constructor(game, player) {
        super(game, player);
        this.x = this.player.x - 130;
        this.y = this.player.y + 25;
        this.penetrationCount = this.player.attackPierce;
        this.explosionRadius = 100;
        this.sound = projectile1Sound;
        this.sound.volume = 0.1;
        this.sound.currentTime = 0;
        this.sound.play();
    };

    update(deltaTime) {
        super.update(deltaTime);

        this.game.enemies.forEach((enemy) => {
            if (this.inContact(enemy) && !enemy.alreadyHit) {
                enemy.hp -= 2;
                enemy.glowingTime = 150;
                enemy.alreadyHit = true;
                this.game.explosions.push(new Projectile1Explosion(this.game, this));
                this.penetrationCount--;
            };
        });
        
        this.x += this.speed;
        this.speed += this.game.normalize(this.acceleration);
        if (this.x >= this.game.canvasWidth) this.markedForDeletion = true;
        if (this.penetrationCount <= 0) this.markedForDeletion = true;
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    };

    inContact(target) {
        return this.x + 160 < target.x + target.width 
            && this.x + 240 > target.x
            && this.y + 20 < target.y + target.height
            && this.y + 95 > target.y
    };
};

//? This is for level 2 projectile
export class Projectile2 extends Projectile {
    constructor (game, player) {
        super(game, player);
        this.x = this.player.x - 150;
        this.y = this.player.y + 20;
        this.penetrationCount = this.player.attackPierce;
        this.explosionRadius = 140;
        this.sound = projectile2Sound;
        this.sound.volume = 1;
        this.sound.currentTime = 0;
        this.sound.play();
    };

    update(deltaTime) {
        super.update(deltaTime);
        
        this.game.enemies.forEach((enemy) => {
            if (this.inContact(enemy) && !enemy.alreadyHit) {
                this.game.explosions.push(new Projectile2Explosion(this.game, this));
                enemy.hp -= 2;
                enemy.glowingTime = 150;
                enemy.alreadyHit = true;
                this.penetrationCount--;
            };
        });

        this.x += this.speed;
        this.speed += this.game.normalize(this.acceleration);

        if (this.x >= this.game.canvasWidth) this.markedForDeletion = true;
        if (this.penetrationCount <= 0) this.markedForDeletion = true;
    };

    inContact(target) {
        return this.x + 220 < target.x + target.width 
            && this.x + 320 > target.x
            && this.y + 35 < target.y + target.height
            && this.y + 125 > target.y
    };
};

//? This is for level 3 projectile
export class Projectile3 extends Projectile {
    constructor(game, player) {
        super(game, player);
        //Hitbox x larger than x by 109
        this.x = this.player.x - 200;
        this.y = this.player.y + 10;
        this.penetrationCount = this.player.attackPierce;
        this.explosionRadius = 170;
        this.sound = projectile3Sound;
        this.sound.volume = 0.5;
        this.sound.currentTime = 0;
        this.sound.play();
    };

    update(deltaTime) {
        super.update(deltaTime);

        this.game.enemies.forEach(enemy => {
            if (this.inContact(enemy) && !enemy.alreadyHit) {
                this.game.explosions.push(new Projectile3Explosion(this.game, this, enemy));
                enemy.hp -= 2;
                enemy.glowingTime = 150;
                enemy.alreadyHit = true;
                this.penetrationCount--;
            };
        });

        this.x += this.speed;
        this.speed += this.game.normalize(this.acceleration);

        if (this.penetrationCount <= 0) this.markedForDeletion = true;
        else if (this.x > this.game.canvasWidth) this.markedForDeletion = true;
    };

    inContact(target) {
        return this.x + 270 < target.x + target.width 
            && this.x + 390 > target.x
            && this.y + 50 < target.y + target.height
            && this.y + 160 > target.y
    };
};

//? Also have to check collision probably
export class Laser {
    constructor(game, player) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.player = player;
        this.energy = this.player.energy;
        this.input = this.player.input;
        this.x = this.player.x + this.player.width + 30;
        this.y = this.player.y;
        this.height = this.player.height;
        this.colorSet = {
            1 : [["rgb(45, 166, 232)", "rgb(108, 196, 244)", "rgb(186, 229, 253)"], ["rgb(116, 206, 254)", "rgb(171, 225, 254)", "rgb(226, 248, 255)"]],
            2 : [["rgba(158, 36, 229, 1)", "rgba(187, 96, 221, 1)", "rgba(187, 124, 206, 1)"], ["rgba(204, 87, 247, 1)", "rgba(245, 131, 245, 1)", "rgba(248, 211, 241, 1)"]],
            3 : [["rgba(245, 35, 35, 1)", "rgba(245, 93, 110, 1)", "rgba(241, 156, 172, 1)"], ["rgba(222, 61, 80, 1)", "rgba(249, 149, 149, 1)", "rgba(245, 231, 232, 1)"]],
        };
        this.frame = 0;

        this.timeBeforeDeletion = 300;
        this.timeFromLastInflictAttack = 0;
        this.intervalToInflictAttack = 100;
        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 120;
        this.timeFromLastEnergyDrain = 0;
        this.intervalToDrainEnergy = 200;

        this.currentLevel = this.player.attackLevel;
        this.damagePerTick = this.currentLevel * 1.5;
        this.markedForDeletion = false; 

        this.sound = laserSound;
        this.sound.loop = true;
        this.sound.volume = 1;
        this.sound.currentTime = 0;
        this.sound.play();
    };

    update(deltaTime) {
        //? Handling frame
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > 1) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Holding space will lengthen the time before deletion
        if (this.input.keyPressed[" "]) {
            this.timeBeforeDeletion += deltaTime;
        };

        //? Inflicting damage on enemies
        if (this.timeFromLastInflictAttack > this.intervalToInflictAttack) {
            this.game.enemies.forEach((enemy) => {
                if (this.inContact(enemy)) {
                    enemy.hp -= this.damagePerTick;
                    enemy.glowingTime = 75;
                };
            });
            this.timeFromLastInflictAttack = 0;
        } else {
            this.timeFromLastInflictAttack += deltaTime;
        };

        //? Energy drain
        if (this.timeFromLastEnergyDrain > this.intervalToDrainEnergy) {
            this.energy.currentEnergy--;
            this.timeFromLastEnergyDrain = 0;
        } else {
            this.timeFromLastEnergyDrain += deltaTime;
        };

        //? Update position
        this.x = this.player.x + this.player.width + 30;
        this.y = this.player.y;

        //? Reduce player movement
        this.player.x -= this.game.normalize(2);
        this.player.yMovementRestriction = true;

        //? Delete
        if (this.timeBeforeDeletion < 0 || this.energy.currentEnergy <= 0) {
            this.markedForDeletion = true;
            this.player.chargingLaser = false;
            this.player.yMovementRestriction = false;
            this.sound.pause();
        } else {
            this.timeBeforeDeletion -= deltaTime;
        };
    };

    draw() {
        const width = (this.game.canvasWidth - this.x) + 100;
        this.ctx.fillStyle = this.colorSet[this.currentLevel][this.frame][0];
        this.ctx.beginPath();
        this.ctx.roundRect(this.x, this.y, width, this.height, 100);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colorSet[this.currentLevel][this.frame][1];
        this.ctx.roundRect(this.x + 10, this.y + 5, width, this.height - 10, 100);
        this.ctx.fill();
        this.ctx.beginPath()
        this.ctx.fillStyle = this.colorSet[this.currentLevel][this.frame][2];
        this.ctx.roundRect(this.x + 20, this.y + 10, width, this.height - 20, 100);
        this.ctx.fill();
    };

    inContact(target) {
        const width = this.game.canvasWidth - this.x;
        return this.x < target.x + target.width 
        && this.x + width > target.x
        && this.y < target.y + target.height
        && this.y + this.height > target.y
    };
};

export class LaserChargingEffect {
    constructor(game, player) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.player = player;
        this.image = document.getElementById("laser-charging-effect-image");
        this.numberOfFrameX = 2;
        this.numberOfFrameY = 7;
        this.spriteWidth = 125;
        this.spriteHeight = 107.14;
        this.width = this.player.width * 1.5;
        this.height = this.player.height * 1.5;
        this.x = this.player.x + this.player.width/2;
        this.y = this.player.y + this.player.height/2;
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
                if (this.frameX > this.numberOfFrameX - 1) this.markedForDeletion = true;
            };
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        this.x = this.player.x + this.player.width/2;
        this.y = this.player.y + this.player.height/2;
    };

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - this.width/2, 0 - this.height/2, this.width, this.height);
        this.ctx.restore();
    };
};
