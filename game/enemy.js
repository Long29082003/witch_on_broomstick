import {Explosion} from "./explosion.js";
const enemiesType = [
            {
                name : "ghost",
                image : document.getElementById("ghost-image"),
                spriteWidth : 132,
                spriteHeight: 180,
                numberOfFrame : 8,
                deathImage : document.getElementById("ghost-death-image"),
                numberOfDeathFrame : 5,
                deathSpriteWidth: 200,
                deathSpriteHeight: 179,
                sound : document.getElementById("ghost-sound"),

                //THis hitbox is for cplayer ollision, not for projectile
                deltaXHitbox : 0.17,
                deltaYHitbox : 0.15,
                deltaWidthHitbox : -0.32,
                deltaHeightHitbox : -0.25,
            },
            {
                name : "demon",
                image : document.getElementById("demon-image"),
                spriteWidth : 267,
                spriteHeight: 161,
                numberOfFrame : 7,
                deathImage : document.getElementById("demon-death-image"),
                numberOfDeathFrame : 5,
                deathSpriteWidth: 200,
                deathSpriteHeight: 200,
                sound : document.getElementById("demon-sound"),

                //THis hitbox is for cplayer ollision, not for projectile
                deltaXHitbox : 0.25,
                deltaYHitbox : 0.2,
                deltaWidthHitbox : -0.45,
                deltaHeightHitbox : -0.4,
            },
            {
                name : "rocket",
                image : document.getElementById("rocket-image"),
                spriteWidth : 495,
                spriteHeight: 320,
                numberOfFrame : 2,
                deathImage : document.getElementById("rocket-death-image"),
                numberOfDeathFrame : 7,
                deathSpriteWidth: 48.25,
                deathSpriteHeight: 48,
                sound : document.getElementById("rocket-sound"),

                //THis hitbox is for cplayer ollision, not for projectile
                deltaXHitbox : 0.08,
                deltaYHitbox : 0.1,
                deltaWidthHitbox : -0.2,
                deltaHeightHitbox : -0.15,
            },
            {
                name : "bird",
                image : document.getElementById("bird-image"),
                spriteWidth : 133,
                spriteHeight: 86,
                numberOfFrame : 9,
                deathImage : document.getElementById("bird-death-image"),
                numberOfDeathFrame : 5,
                deathSpriteWidth: 150,
                deathSpriteHeight: 150,
                sound : document.getElementById("bird-sound"),

                //THis hitbox is for cplayer ollision, not for projectile
                deltaXHitbox : 0.18,
                deltaYHitbox : 0.15,
                deltaWidthHitbox : -0.3,
                deltaHeightHitbox : -0.28, 
            },
            {
                name : "bowling",
                image : document.getElementById("bowling-image"),
                spriteWidth : 205,
                spriteHeight: 261,
                numberOfFrame : 8,
                deathImage : document.getElementById("bowling-death-image"),
                numberOfDeathFrame : 5,
                deathSpriteWidth: 150,
                deathSpriteHeight: 150,
                sound : document.getElementById("bowling-sound"),

                //THis hitbox is for cplayer ollision, not for projectile
                deltaXHitbox : 0.1,
                deltaYHitbox : 0.12,
                deltaWidthHitbox : -0.12,
                deltaHeightHitbox : -0.14, 
            },
            {
                name : "bullet",
                image : document.getElementById("bullet-image"),
                spriteWidth : 422,
                spriteHeight: 224,
                numberOfFrame : 2,
                deathImage : document.getElementById("rocket-death-image"),
                numberOfDeathFrame : 7,
                deathSpriteWidth: 48.25,
                deathSpriteHeight: 48,
                sound : document.getElementById("rocket-sound"),

                //THis hitbox is for cplayer ollision, not for projectile
                deltaXHitbox : 0.08,
                deltaYHitbox : 0.1,
                deltaWidthHitbox : -0.2,
                deltaHeightHitbox : -0.15,
            },
        ];

class Enemy {
    constructor(enemyName, game) {
        //? This deals with monster animation sprite, dying sprite, sound
        this.game = game;
        this.ctx = this.game.ctx;
        this.canvasWidth = this.game.canvasWidth;
        this.canvasHeight = this.game.canvasHeight;
        const enemy = enemiesType.find(enemy => enemy.name === enemyName);
        this.imageLink = enemy.imageLink;
        this.image = enemy.image;
        this.spriteWidth = enemy.spriteWidth;
        this.spriteHeight = enemy.spriteHeight;
        this.numberOfFrame = enemy.numberOfFrame;

        this.deltaXHitbox = enemy.deltaXHitbox;
        this.deltaYHitbox = enemy.deltaYHitbox;
        this.deltaWidthHitbox = enemy.deltaWidthHitbox;
        this.deltaHeightHitbox = enemy.deltaHeightHitbox;

        this.deathImage = enemy.deathImage;
        this.numberOfDeathFrame = enemy.numberOfDeathFrame;
        this.deathSpriteWidth = enemy.deathSpriteWidth;
        this.deathSpriteHeight = enemy.deathSpriteHeight;

        this.sound = enemy.sound;
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};

export class Ghost extends Enemy{
    constructor(game, hp, xSpeedScale) {
        super("ghost", game) //? Super has to go before assign this. This is a general rule in JS
        this.name = "ghost";
        
        this.x = this.canvasWidth + 100;
        this.y = Math.random() * 800 + 100;
        this.scale = Math.random() * 0.9 + 0.6
        this.width = this.spriteWidth * this.scale;
        this.height = this.spriteHeight * this.scale;
        this.xSpeed = this.game.normalize(2) * xSpeedScale;
        this.angle = Math.random() * 360;
        this.angleSpeed = this.game.normalize(Math.random() + 0.5);
        this.wavyStrength = Math.random() + 1;
        this.frame = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 200;
        this.glowingTime = 0;
        
        this.point = 100;
        this.hp = hp;
        this.alreadyHit = false;
        this.markedForDeletion = false;
        this.markedForGoingOutOfBound = false;
    };

    update(deltaTime) {
        this.y += Math.sin(this.angle * Math.PI / 180) * this.wavyStrength;
        if (this.y <= 20) this.y = 20;
        if (this.y + this.height >= this.canvasHeight - 100) this.y = this.canvasHeight - 100 - this.height;
        this.x -= this.xSpeed;
        if (this.x < -this.width) this.markedForGoingOutOfBound = true;
        this.angle += this.angleSpeed;

        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > 7) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        if (this.hp <= 0) {
            this.game.killCount[this.name]++;
            this.markedForDeletion = true;
            this.game.explosions.push(new Explosion(this));
        };

        //? Reset alreadyHit status when there is no Player projectile on the screen
        if (this.game.projectiles.length === 0) this.alreadyHit = false;

        this.glowingTime -= deltaTime;
    };

    draw() {
        super.draw();
        this.ctx.save();
        if (this.glowingTime > 0) this.ctx.filter = "brightness(200%)";
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.ctx.restore();
    };
};

export class Demon extends Enemy {
    constructor(game, hp) {
        super("demon", game);
        this.name = "demon";
        
        this.x = this.canvasWidth + 100;
        this.y = Math.random() * 750 + 200;
        this.newX = this.x;
        this.newY = this.y;
        this.speed = 0.05;
        this.scale = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.scale;
        this.height = this.spriteHeight * this.scale;
        this.frame = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 150;
        this.timeFromLastPositionChange = 0;
        this.intervalToChangePosition = (Math.random(500) + 1200);
        this.glowingTime = 0;

        this.point = 500;
        this.hp = hp;
        this.alreadyHit = false;
        this.markedForDeletion = false;
        this.markedForGoingOutOfBound = false;
    };

    update(deltaTime) {
        if (this.timeFromLastPositionChange >= this.intervalToChangePosition) {
            this.newX = this.x - (Math.random() * 200 + 400);
            this.newY = Math.random() * 950 + 50;
            this.timeFromLastPositionChange = 0;
        };
        const dx = this.newX - this.x;
        const dy = this.newY - this.y;
        this.x += dx * this.speed;
        this.y += dy * this.speed;
        if (this.x < -this.width) this.markedForGoingOutOfBound = true;

        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > 6) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        if (this.hp <= 0) {
            this.game.killCount[this.name]++;
            this.markedForDeletion = true;
            this.game.explosions.push(new Explosion(this));
        };

        //? Reset alreadyHit status when there is no Player projectile on the screen
        if (this.game.projectiles.length === 0) this.alreadyHit = false;

        this.timeFromLastPositionChange += deltaTime;
        this.glowingTime -= deltaTime;
    };

    draw() {
        super.draw();
        this.ctx.save();
        if (this.glowingTime > 0) this.ctx.filter = "brightness(200%)";
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.ctx.restore();
    };
};

export class Rocket extends Enemy {
    constructor(game, hp, xSpeedScale) {
        super("rocket", game);
        this.name = "rocket";
        
        this.x = this.canvasWidth + 50;
        this.y = Math.random() * 700 + 100;
        this.speed = this.game.normalize(1) * xSpeedScale;
        this.scale = Math.random() * 0.2 + 0.55;
        this.width = this.spriteWidth * this.scale;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;     
        this.frame = 0;
        
        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 50;
        this.glowingTime = 0;

        this.point = 2000;
        this.hp = hp;
        this.alreadyHit = false;
        this.markedForDeletion = false;
        this.markedForGoingOutOfBound = false;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > 1) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        if (this.hp <= 0) {
            this.game.killCount[this.name]++;
            this.markedForDeletion = true;
            this.game.explosions.push(new Explosion(this));
        };

        if (this.x < -this.width) this.markedForGoingOutOfBound = true;
        this.x -= this.speed;

        //? Reset alreadyHit status when there is no Player projectile on the screen
        if (this.game.projectiles.length === 0) this.alreadyHit = false;

        this.glowingTime -= deltaTime;
    };

    draw() {
        super.draw();
        this.ctx.save();
        if (this.glowingTime > 0) this.ctx.filter = "brightness(200%)";
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.ctx.restore();
    };
};

export class Bird extends Enemy{
    constructor(y, loopXPosition, loopYPosition, scale, game, hp, xSpeedScale) {
        super("bird", game);
        this.name = "bird";
        
        this.x = this.canvasWidth + 100;
        this.y = y;
        this.speed = this.game.normalize(5) * xSpeedScale;
        this.scale = scale;
        this.width = this.spriteWidth * this.scale;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width; 
        this.frame = 0;

        this.loopXPosition = loopXPosition;
        this.loopYPosition = loopYPosition;
        this.angle = 270;
        this.angleSpeed = this.game.normalize(2);
        this.radius = this.y - this.loopYPosition;
        this.inLoop = false;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;
        this.glowingTime = 0;

        this.point = 200;
        this.hp = hp;
        this.alreadyHit = false;
        this.markedForDeletion = false;
        this.markedForGoingOutOfBound = false;
    }

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > 8) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Start looping
        if (!this.inLoop && this.angle < 600 && this.x <= this.loopXPosition) {
            this.inLoop = true;
        };

        if (this.x < -this.width) this.markedForGoingOutOfBound = true;
        if (this.inLoop) {
            const dx = this.radius * Math.cos(this.angle * Math.PI / 180);
            const dy = this.radius * Math.sin(this.angle * Math.PI / 180);
            this.x = this.loopXPosition - dx;
            this.y = this.loopYPosition - dy;
            this.angle += this.angleSpeed;
            if (this.angle >= 600) this.inLoop = false;
        } else {
            this.x -= this.speed;
        };

        if (this.hp <= 0) {
            this.game.killCount[this.name]++;
            this.markedForDeletion = true;
            this.game.explosions.push(new Explosion(this));
        };

        //? Reset alreadyHit status when there is no Player projectile on the screen
        if (this.game.projectiles.length === 0) this.alreadyHit = false;
        
        this.glowingTime -= deltaTime;
    };

    draw() {
        super.draw();
        this.ctx.save();
        this.ctx.translate(this.x + this.width * 0.5, this.y + this.height * 0.5);
        this.ctx.rotate(this.inLoop ? -180 + this.angle * Math.PI / 180 : 0);
        if (this.glowingTime > 0) this.ctx.filter = "brightness(200%)";
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 - this.width * 0.5, 0 - this.height * 0.5, this.width, this.height);
        this.ctx.restore();
    };
};

export class Bowling extends Enemy{
    constructor(y, xFluctuateRange, yFluctuateRange, game, hp) {
        super("bowling", game);
        this.name = "bowling";

        this.centerX = this.canvasWidth + 50;
        this.centerY = y;
        this.x = this.canvasWidth;
        this.y = 0;
        this.xFluctuateRange = xFluctuateRange;
        this.yFluctuateRange = yFluctuateRange;
        this.fluctuateSpeedX = game.normalize(Math.random() * 2 + 1);
        this.fluctuateSpeedY = game.normalize(Math.random() * 2 + 1); 
        this.speed = game.normalize(1);
        this.angle = 0;
        this.angleSpeed = game.normalize(1);
        this.scale = 0.7;
        this.width = this.spriteWidth * this.scale;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.frame = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;
        this.glowingTime = 0;

        this.point = 100;
        this.hp = hp;
        this.alreadyHit = false;
        this.markedForDeletion = false;
        this.markedForGoingOutOfBound = false;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > 7) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        const dx = Math.sin(this.angle * Math.PI / (180 * this.fluctuateSpeedX)) * this.xFluctuateRange;
        const dy = Math.cos(this.angle * Math.PI / (180 * this.fluctuateSpeedY)) * this.yFluctuateRange;
        this.x = this.centerX + dx - this.speed;
        this.y = this.centerY + dy;
        if (this.x < -this.width) this.markedForGoingOutOfBound = true;
        this.angle += this.angleSpeed;
        this.centerX -= this.speed;

        if (this.hp <= 0) {
            this.game.killCount[this.name]++;
            this.markedForDeletion = true;
            this.game.explosions.push(new Explosion(this));
        };

        //? Reset alreadyHit status when there is no Player projectile on the screen
        if (this.game.projectiles.length === 0) this.alreadyHit = false;

        this.glowingTime -= deltaTime;
    };

    draw() {
        super.draw();
        this.ctx.save();
        if (this.glowingTime > 0) this.ctx.filter = "brightness(200%)";
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.ctx.restore();
    };
};

export class Bullet extends Enemy {
    constructor(game, hp, xSpeedScale) {
        super("bullet", game);
        this.name = "bullet";
        this.x = this.game.canvasWidth + 10;
        this.y = Math.random() * 600 + 100;
        this.speedX = game.normalize(-1) * xSpeedScale;
        this.acceleration = game.normalize(0.05);
        this.pointOfDeceleration = 1900;
        this.isGoingBack = false;
        this.isBeforeGoingBack = true;
        this.width = 300;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.frame = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 80;
        this.glowingTime = 0;
        
        this.point = 100;
        this.hp = hp;
        this.alreadyHit = false;
        this.markedForDeletion = false;
        this.markedForGoingOutOfBound = false;
    };

    update(deltaTime) {
        //? Taking care of frames
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.frame = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Taking care of movement
        if (this.isBeforeGoingBack && this.x < this.pointOfDeceleration) {
            this.isGoingBack = true;
            this.isBeforeGoingBack = false;
        };

        if (this.isGoingBack) {
            this.speedX += this.acceleration * 0.15;
            if (this.speedX > 2) {
                this.isGoingBack = false;
            };
        };

        if (!this.isBeforeGoingBack && !this.isGoingBack) this.speedX -= this.acceleration * 0.4;
        this.x += this.speedX;

        if (this.hp <= 0) {
            this.game.killCount[this.name]++;
            this.markedForDeletion = true;
            this.game.explosions.push(new Explosion(this));
        };
        
        if (this.x < -this.width) this.markedForGoingOutOfBound = true;

        //? Reset alreadyHit status when there is no Player projectile on the screen
        if (this.game.projectiles.length === 0) this.alreadyHit = false;    
        this.glowingTime -= deltaTime;    
    };

    draw() {
        this.ctx.save();
        if (this.glowingTime > 0) this.ctx.filter = "brightness(200%)";
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.ctx.restore();
    };
};