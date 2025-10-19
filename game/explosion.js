// Add sound to the two objects 
const bossMiniExplosionImage = document.getElementById("boss-mini-explosion-image")
const projectile1ExplosionSound = document.getElementById("projectile1-explosion-sound");
const projectile2ExplosionSound = document.getElementById("projectile2-explosion-sound");
const projectile3ExplosionSound = document.getElementById("projectile3-explosion-sound");
const grenadeExplosionImage = document.getElementById("grenade-explosion-image");
const grenadeGuyProjectileExplosionSound = document.getElementById("grenadeguy-projectile-explosion-sound");
export class Explosion {
    constructor(enemy) {
        this.enemy = enemy;
        this.ctx = this.enemy.ctx;
        this.name = this.enemy.name;
        this.image = this.enemy.deathImage;
        this.numberOfExplosionFrame = this.enemy.numberOfDeathFrame;
        this.x = this.enemy.x + this.enemy.width / 2;
        this.y = this.enemy.y + this.enemy.height / 2;
        this.spriteWidth = this.enemy.deathSpriteWidth;
        this.spriteHeight = this.enemy.deathSpriteHeight;
        this.width = this.enemy.width;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.rotateAngle = Math.random() * Math.PI * 2;
        this.frame = 0;
        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;
        this.markedForDeletion = false;
        this.point = this.enemy.point;

        this.sound = this.enemy.sound;
        this.sound.currentTime = 0.3;
        this.sound.volume = 0.3;
        this.sound.play();
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.timeFromLastFrame = 0;
            this.frame++;
            if (this.frame > this.numberOfExplosionFrame - 1) this.markedForDeletion = true;
        };
        
        this.timeFromLastFrame += deltaTime;
    };

    //? Remember that rotate means you have to scale the image to the middle, which means you have to use 0 - this.width / 2, 0 - this.height / 2
    //? Doing that will prevent the image to spin around the origin
    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotateAngle);
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
        this.ctx.restore();

        //? Draw point
        this.ctx.save();
        this.ctx.font = "35px PressStart2P";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.fillText("+" + this.point, this.x + 5, this.y + this.height + 10);
        if (this.name === "ghost" || "bullet") {
            this.ctx.fillStyle = "gray";
        } else if (this.name === "demon") {
            this.ctx.fillStyle = "yellow";
        } else if (this.name === "rocket") {
            this.ctx.fillStyle = "red";
        } else if (this.name === "bird") {
            this.ctx.fillStyle = "purple";
        } else if (this.name === "bowling") {
            this.ctx.fillStyle = "green";
        }
        ;
        this.ctx.textAlign = "center";
        this.ctx.fillText("+" + this.point, this.x, this.y + this.height + 5);
        this.ctx.restore();
    };
};

export class PlayerExplosion {
    constructor (game, player) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.player = player;
        this.radius = Math.random() * 20 + 15;
        this.x = this.player.x - this.radius +  Math.random() * this.player.width;
        this.y = this.player.y - this.radius + Math.random() * this.player.height;
        this.color = `rgb(${Math.random() * 9 + 236}, ${Math.random() * 34 + 203}, ${Math.random() * 80 + 142})`;
        this.transparent = Math.random() * 0.5 + 0.5;
        this.speed = -(Math.random() * 0.5 + 1);
        this.acceleration = -(Math.random() * 0.05);

        this.markedForDeletion = false;
    };

    update(deltaTime) {
        this.y += this.speed;
        this.speed += this.acceleration;

        if (this.y < - this.radius * 2) this.markedForDeletion = true;
    };

    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.transparent;
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
};

export class BossExplosion {
    constructor(boss) {
        this.boss = boss;
        this.game = this.boss.game;
        this.ctx = this.boss.ctx;
        this.image = this.boss.image;
        this.x = this.boss.animationX;
        this.y = this.boss.animationY;
        this.spriteWidth = this.boss.spriteWidth;
        this.spriteHeight = this.boss.spriteHeight;
        this.width = this.boss.animationWidth;
        this.height = this.boss.animationHeight;
        this.frameX = this.boss.frameX;
        this.frameY = this.boss.frameY;
        
        this.timeFromCreated = 0;
        this.timeFromLastMiniExplosionAddition = 0;
        this.intervalToAddMiniExplosion = 40;

        this.fonts = [
            {
                color: "rgb(207, 23, 23)",
                size: 40,
            },
            {
                color: "white",
                size: 40,
            },
            {
                color: "rgb(205, 58, 127)",
                size: 60,
            },
            {
                color: "blue",
                size: 60,
            },
            {
                color: "black",
                size: 80,
            },
            {
                color: "rgb(231, 205, 71)",
                size: 80,
            },
        ];
        this.fontIndex = 0;
        this.timeFromLastChangeFont = 0;
        this.intervalToChangeFont = 150;
        this.printText = true;

        this.markedForDeletion = false;
    };

    update(deltaTime) {
        if (this.timeFromLastMiniExplosionAddition > this.intervalToAddMiniExplosion){
            this.game.explosions.push(new BossMiniExplosion(this));
            this.timeFromLastMiniExplosionAddition = 0;
        } else {
            this.timeFromLastMiniExplosionAddition += deltaTime;
        };

        if (this.timeFromLastChangeFont > this.intervalToChangeFont) {
            this.fontIndex++;
            if (this.fontIndex > 5) this.printText = false;
            this.timeFromLastChangeFont = 0;
        } else {
            this.timeFromLastChangeFont += deltaTime;
        };

        if (this.timeFromCreated >= 2100) this.markedForDeletion = true;
        this.timeFromCreated += deltaTime;
    };

    draw() {
        //Draw brighten boss image
        this.ctx.save();
        this.ctx.filter = "Brightness(150%)";
        this.ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.ctx.restore();

        //Print points
        if (this.printText) {
            this.ctx.save();
            this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            this.ctx.font = `${this.fonts[this.fontIndex].size}px PressStart2P`;
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "black";
            this.ctx.fillText("20000!", 5, 5);
            this.ctx.fillStyle = this.fonts[this.fontIndex].color;
            this.ctx.fillText("20000!", 0, 0);
            this.ctx.restore();
        };
    };
};

class BossMiniExplosion {
    constructor (bossExplosion) {
        this.bossExplosion = bossExplosion;
        this.ctx = this.bossExplosion.ctx;
        this.image = bossMiniExplosionImage;
        this.spriteWidth = 34;
        this.spriteHeight = 35;
        this.numberOfFrame = 7;
        this.width = 150;
        this.height = 150
        this.x = Math.random() * 350 + (this.bossExplosion.x - 30);
        this.y = Math.random() * 350 + (this.bossExplosion.y - 20);
        this.frame = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 40;

        this.markedForDeletion = false;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.markedForDeletion = true;
        } else {
            this.timeFromLastFrame += deltaTime;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    };
};

export class GrenadeExplosion {
    constructor (grenade) {
        this.grenade = grenade;
        this.player = this.grenade.player;
        this.game = this.player.game;
        this.ctx = this.grenade.ctx;
        this.image = grenadeExplosionImage;
        this.spriteWidth = 34;
        this.spriteHeight = 35;
        this.width = 300;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.x = this.grenade.x + this.grenade.width / 2;
        this.y = this.grenade.y + this.grenade.height / 2;
        this.frameX = 0;
        this.numberOfFrameX = 7;
        this.frameY = Math.floor(Math.random() * 3);

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 60;
        this.markedForDeletion = false; 

        this.sound = grenadeGuyProjectileExplosionSound;
        this.sound.volume = 0.15;
        this.sound.currentTime = 0;
        this.sound.play();

        //? Inflict damage on player
        const playerX = this.player.x + (this.player.width / 2);
        const playerY = this.player.y + (this.player.height / 2);
        const distance = Math.sqrt((this.x - playerX)**2 + (this.y - playerY)**2);
        if (distance < Math.min(this.player.width, this.player.height) + this.grenade.explosionRadius 
        && !this.player.markedForDeletion
        && (!this.player.invincible || !this.player.invincibleTime > 0)) {
            this.player.health.currentHealth--;
            this.player.invincibleTime = 5000;
            this.game.timeToDisplayDamageScreen = 100;
            if (this.player.health.currentHealth <= 0) document.getElementById("player-death-sound").play();
            else if (this.player.health.currentHealth > 0) document.getElementById("player-getting-hit-sound").play();
        };
    };

    update(deltaTime) {
        //? Update frames
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frameX++;
            if (this.frameX > this.numberOfFrameX - 1) this.markedForDeletion = true; 
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };
    };

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
        this.ctx.restore();
    };
};

class HittingSlash {
    constructor(ctx, enemy) {
        this.ctx = ctx;
        this.slashes = [
            {
                name : "slash1",
                image : document.getElementById("slash1"),
                numberOfFrame : 4,
                spriteWidth : 134,
                spriteHeight: 149,
            },
            {
                name : "slash2",
                image : document.getElementById("slash2"),
                numberOfFrame : 3,
                spriteWidth : 232,
                spriteHeight: 228,
            },
            {
                name : "slash3",
                image : document.getElementById("slash3"),
                numberOfFrame : 4,
                spriteWidth : 97.5,
                spriteHeight: 165,
            },
        ];
        this.slashIndex = Math.floor(Math.random() * 3);
        this.image = this.slashes[this.slashIndex].image;
        this.numberOfFrame = this.slashes[this.slashIndex].numberOfFrame;
        this.spriteWidth = this.slashes[this.slashIndex].spriteWidth;
        this.spriteHeight = this.slashes[this.slashIndex].spriteHeight;
        this.frame = Math.floor(Math.random() * this.numberOfFrame);

        this.x = enemy.x + (enemy.width / 2);
        this.y = enemy.y + (enemy.height / 2);
        this.width = Math.max(enemy.width, enemy.height) / 2;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;

        this.timeFromLastHit = 0;
        this.intervalToDeleteSprite = 150;

        this.markedForDeletion = false;  
    };

    update(deltaTime) {
        if (this.timeFromLastHit >= this.intervalToDeleteSprite) {
            this.markedForDeletion = true;
        } else {
            this.timeFromLastHit += deltaTime;
        };
    };

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 - (this.width / 2), 0 - (this.height / 2), this.width, this.height);
        this.ctx.restore();
    };
};


//? This explosion is for Projectile
export class Projectile3Explosion {
    constructor(game, projectile, enemy) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.projectile = projectile;
        this.name = this.projectile.level.level;
        this.enemy = enemy;
        this.image = this.projectile.level.explosionImage;
        this.numberOfExplosionFrameX = 6;
        this.numberOfExplosionFrameY = 5;
        this.x = this.enemy.x + this.enemy.width / 2;
        this.y = this.enemy.y + this.enemy.height / 2;
        this.spriteWidth = 240;
        this.spriteHeight = 240;
        this.width = 500;
        this.height = 500;
        this.rotationAngle = Math.random() * Math.PI * 2;
        this.frameX = 0;
        this.frameY = 0;
    
        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 50;

        this.damagePerTick = 0.5;
        this.timeFromLastInflictAttack = 0;
        this.intervalToInflictAttack = 150;
        this.markedForDeletion = false;

        this.sound = projectile3ExplosionSound;
        this.sound.volume = 0.3;
        this.sound.currentTIme = 0;
        this.sound.play();
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frameX++;
            if (this.frameX > this.numberOfExplosionFrameX - 1) {
                this.frameX = 0;
                this.frameY++;
                if (this.frameY > this.numberOfExplosionFrameY - 1) this.markedForDeletion = true;
            };
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        if (this.timeFromLastInflictAttack > this.intervalToInflictAttack) {
            this.game.enemies.forEach((enemy) => {
                const dx = (enemy.x + enemy.width / 2) - this.x;
                const dy = (enemy.y + enemy.height / 2) - this.y;
                const distance = Math.sqrt(dx**2 + dy**2);
                if (distance < (this.projectile.explosionRadius + Math.max(enemy.width, enemy.height))) {
                    enemy.hp -= this.damagePerTick;
                    enemy.glowingTime = 100;
                    this.game.effects.push(new HittingSlash(this.ctx, enemy));
                };
            })
            this.timeFromLastInflictAttack = 0;
        } else {
            this.timeFromLastInflictAttack += deltaTime;
        }
    };

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotationAngle);
        this.ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteWidth, this.spriteWidth, this.spriteHeight, 0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
        this.ctx.restore();
    };
};

export class Projectile2Explosion {
    constructor(game, projectile) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.projectile = projectile;
        this.image = this.projectile.level.explosionImage;
        this.numberOfFrame = 11;
        this.spriteWidth = 127;
        this.spriteHeight = 87;
        this.width = 700;
        this.height = 700;
        this.x = this.projectile.x + this.projectile.width;
        this.y = this.projectile.y + this.projectile.height / 2;
        this.frame = 0;
        
        this.timeFromLastFrame = 0
        this.intervalToChangeFrame = 40;
        this.damage = 2;
        this.damageInflicted = false;
        this.markedForDeletion = false;

        this.sound = projectile2ExplosionSound;
        this.sound.currentTime = 0;
        this.sound.volume = 0.12;
        this.sound.play();
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.markedForDeletion = true;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        if (!this.damageInflicted) {
            this.game.enemies.forEach((enemy) => {
                const dx = (enemy.x + enemy.width / 2) - this.x;
                const dy = (enemy.y + enemy.height / 2) - this.y;
                const distance = Math.sqrt(dx**2 + dy**2);
                if (distance < this.projectile.explosionRadius + Math.max(enemy.width, enemy.height)) {
                    enemy.hp -= this.damage;
                    enemy.glowingTime = 100;
                    enemy.alreadyHit = true;
                };
            });
            this.damageInflicted = true;
        };
    };
    
    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
        this.ctx.restore();
    };
};

export class Projectile1Explosion {
    constructor(game, projectile) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.projectile = projectile;
        this.image = this.projectile.level.explosionImage;
        this.spriteWidth = 128;
        this.spriteHeight = 128;
        this.numberOfFrame = 11;
        this.x = this.projectile.x + this.projectile.width;
        this.y = this.projectile.y + this.projectile.height / 2;
        this.width = 300;
        this.height = 300;
        this.damage = 1;
        this.frame = 0;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 40;
        this.damageInflicted = false;
        this.markedForDeletion = false;

        this.sound = projectile1ExplosionSound;
        this.sound.currentTime = 0;
        this.sound.volume = 0.2;
        this.sound.play();
    };

    update(deltaTime) {
        if (this.timeFromLastFrame > this.intervalToChangeFrame) {
            this.frame++;
            if (this.frame > this.numberOfFrame - 1) this.markedForDeletion = true;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        if (!this.damageInflicted) {
            this.game.enemies.forEach((enemy) => {
                const dx = (enemy.x + enemy.width / 2) - this.x;
                const dy = (enemy.y + enemy.height / 2) - this.y;
                const distance = Math.sqrt(dx**2 + dy**2);
                if (distance < this.projectile.explosionRadius + Math.max(enemy.width, enemy.height)) {
                    enemy.hp -= this.damage;
                    enemy.glowingTime = 100;
                    enemy.alreadyHit = true;
                };
            });
            this.damageInflicted = true;
        };
    };

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
        this.ctx.restore();
    };
};
