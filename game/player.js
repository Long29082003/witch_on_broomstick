//? Really nice, now tie the Laser with energy
const playerImage = document.getElementById("player-image");
const playerHeart = document.getElementById("health-UI");
const playerManaOrb = document.getElementById("mana-UI");
const laserChargingSound = document.getElementById("laser-charging-sound");
const playerDeathSound = document.getElementById("player-death-sound");
const playerGettingHitSound = document.getElementById("player-getting-hit-sound");
import {Projectile1, Projectile2, Projectile3, Laser, LaserChargingEffect} from "./player_projectile.js";
import {PlayerExplosion} from "./explosion.js";
import {BlackBlockInverse} from "./transition_screen.js";

playerDeathSound.volume = 0.3;
playerGettingHitSound.volume = 0.3;

class Health {
    constructor (ctx) {
        this.ctx = ctx;
        this.image = playerHeart;
        this.spriteWidth = 675;
        this.spriteHeight = 603;
        this.width = 41.6;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.x = 52;
        this.xGap = 62.4;
        this.y = 62.4;
        this.maxHealth = 3;
        this.currentHealth = 3;
    }

    draw() {
        let count = this.currentHealth;
        for (let i = 0; i < this.maxHealth; i++) {
            this.ctx.drawImage(this.image, (count > 0 ? 0 : 1) * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x + i * this.xGap, this.y, this.width, this.height);
            count--;
        };
    };
};

class Energy {
    constructor (ctx) {
        this.ctx = ctx;
        this.image = playerManaOrb;
        this.spriteWidth = 16;
        this.spriteHeight = 14;
        this.width = 41.6;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.x = 52;
        this.y = 104;
        this.currentEnergy = 20;
    };

    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.ctx.save();
        this.ctx.font = "25px PressStart2P";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(`${this.currentEnergy}X`, this.x + 65, this.y + 33.8)
        this.ctx.fillStyle = "rgb(80, 164, 249)";
        this.ctx.fillText(`${this.currentEnergy}X`, this.x + 62.4, this.y + 31.2);
        this.ctx.restore();
    };
};

class DashingAnimation {
    constructor(player) {
        this.player = player;
        this.ctx = this.player.ctx;
        this.spriteWidth = this.player.spriteWidth;
        this.spriteHeight = this.player.spriteHeight;
        this.width = this.player.width;
        this.height = this.player.height;
        this.x = this.player.x;
        this.y = this.player.y;
        this.frame = this.player.frame;
        this.frameIndex = this.player.frameIndex;

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
        this.ctx.drawImage(this.player.image, this.frame[this.frameIndex] * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.ctx.restore();
    };
};

export default class PLayer {
    constructor(input, game) {
        this.game = game;

        this.input = input;
        this.image = playerImage;
        this.spriteWidth = 46;
        this.spriteHeight = 68;
        this.scale = 1.56;
    
        this.ctx = this.game.ctx;
        this.canvasWidth = this.game.canvasWidth;
        this.canvasHeight = this.game.canvasHeight;
        this.x = 104;
        this.y = 364;
        this.deltaXHitbox = 0.25;
        this.deltaYHitbox = 0.2; 
        this.width = this.spriteWidth * this.scale;
        this.height = this.spriteHeight * this.scale;
        this.deltaWidthHitbox = -0.35;
        this.deltaHeightHitbox = -0.47;
        this.speedX = 0;
        this.speedY = 0;
        this.frame = [0,1,2,1,0];
        this.frameIndex = 0;
        this.numberOfFrameIndex = 5;

        this.timeFromLastFrame = 0;
        this.intervalToChangeFrame = 100;
        this.timeFromLastAttack = 0;
        this.intervalToAttack = 1000;
        this.timeFromLastDashAnimation = 0;
        this.intervalToSpawnDashAnimation = 100;

        this.glowingTime = 0;

        this.health = new Health(this.ctx);
        this.energy = new Energy(this.ctx);
        this.stamina = 100;
        this.attackLevel = 1;
        this.attackPierce = 1;
        this.invincible = false;
        this.invincibleTime = 0;
        this.chargingLaser = false;
        this.yMovementRestriction = false;

        this.markedForDeletion = false;
    };

    update(deltaTime) {
        if (this.timeFromLastFrame >= this.intervalToChangeFrame) {
            this.frameIndex++;
            if (this.frameIndex > this.numberOfFrameIndex - 1) this.frameIndex = 0;
            this.timeFromLastFrame = 0;
        } else {
            this.timeFromLastFrame += deltaTime;
        };

        //? Check input handler for movement
        if (this.input.keyPressed["w"] && this.input.keyPressed["d"]) {
            this.speedX = 1.7;
            this.speedY = -1.7;
        } else if (this.input.keyPressed["s"] && this.input.keyPressed["d"]) {
            this.speedX = 1.7;
            this.speedY = 1.7;
        } else if (this.input.keyPressed["s"] && this.input.keyPressed["a"]) {
            this.speedX = -1.7;
            this.speedY = 1.7;
        } else if (this.input.keyPressed["w"] && this.input.keyPressed["a"]) {
            this.speedX = -1.7;
            this.speedY = -1.7;
        } else if (this.input.keyPressed["w"]) {
            this.speedY = -2.6;
            this.speedX = 0;
        } else if (this.input.keyPressed["s"]) {
            this.speedY = 2.6;
            this.speedX = 0;
        } else if (this.input.keyPressed["a"]) {
            this.speedX = -2.6;
            this.speedY = 0;
        } else if (this.input.keyPressed["d"]) {
            this.speedX = 2.6;
            this.speedY = 0;
        } else {
            this.speedX = 0;
            this.speedY = 0;
        };

        this.speedX = this.game.normalize(this.speedX);
        this.speedY = this.game.normalize(this.speedY);
        if (this.yMovementRestriction) this.speedY = this.speedY * this.game.normalize(0.5);

        //? Check input handler for laser
        if (this.input.keyPressed[" "]) {
            this.laserActivated = true;
        } else {
            this.laserActivated = false;
        };

        //? Check input handler for attack
        if (this.timeFromLastAttack >= this.intervalToAttack) {
            if (this.input.keyPressed["j"] && !this.input.keyPressed["shift"] && this.game.projectiles.length === 0) {
                if (this.attackLevel === 1) this.game.projectiles.push(new Projectile1(this.game, this));
                else if (this.attackLevel === 2) this.game.projectiles.push(new Projectile2(this.game, this));
                else if (this.attackLevel === 3) this.game.projectiles.push(new Projectile3(this.game, this));
                this.timeFromLastAttack = 0;
            } 
        } else {
            this.timeFromLastAttack += deltaTime;
        };

        if (this.energy.currentEnergy > 0 && this.input.keyPressed[" "] && !this.input.keyPressed["shift"] && !this.chargingLaser) {
            setTimeout(() => {
                this.game.projectiles.push(new Laser(this.game, this));
            }, 1000);
            this.timeFromLastAttack = -50;
            this.chargingLaser = true;
            laserChargingSound.currentTime = 0;
            laserChargingSound.volume = 0.8;
            laserChargingSound.play();
            this.game.effects.push(new LaserChargingEffect(this.game, this));
        };


        //? Check input handler to spawn dash animation
        //? Check input handler to set invincibility while dash
        this.invincible = false;
        if (this.input.keyPressed["shift"] || this.invincibleTime > 0) {
            this.invincible = true;
            this.speedX = this.speedX * 1.7;
            this.speedY = this.speedY * 1.7;
            if (this.timeFromLastDashAnimation >= this.intervalToSpawnDashAnimation) {
                this.game.effects.push(new DashingAnimation(this));
                this.timeFromLastDashAnimation = 0;
            } else {
                this.timeFromLastDashAnimation += deltaTime;
            };
            this.stamina = this.invincibleTime > 0 ? this.stamina - 0 : Number(this.stamina - this.game.normalize(0.5));
            if (this.stamina <= 0) this.input.keyPressed["shift"] = false;
        };
        //? If stamina is below 30, then lock the Shift keydown so that player cannot press it unless has more than 30 stamina
        if (this.stamina <= 50) this.input.shiftLock = true;
        else this.input.shiftLock = false;

        this.x += this.speedX;
        this.y += this.speedY;

        //? Check collision
        this.checkCollision([...this.game.enemies, ...this.game.enemyProjectiles]);

        //? Check healthbar below 0. Activate transition screen
        if (this.health.currentHealth <= 0) {
            for (let i = 0; i < 100; i++) {
                this.game.explosions.push(new PlayerExplosion(this.game, this));
            };
            this.markedForDeletion = true;
            for (let i = 0; i < 6; i++) {
                this.game.transitionScreen.blocks.push(new BlackBlockInverse(this.game, this.game.transitionScreen.blockWidth, this.game.transitionScreen.blockMoveDelay * i, this.game.transitionScreen.blockWidth * i))
            };
        };

        //? Movement restriction: out of bound
        if (this.x < 0) this.x = 0;
        else if (this.x > this.game.canvasWidth - this.width) this.x = this.game.canvasWidth - this.width;

        if (this.y < 0) this.y = 0;
        else if (this.y > this.game.canvasHeight - this.height) this.y = this.game.canvasHeight - this.height;

        this.stamina = Math.min(this.stamina + this.game.normalize(0.1), 100);
        this.invincibleTime -= deltaTime;
    };

    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.invincible ? 0.5 : 1;
        this.ctx.drawImage(this.image, this.frame[this.frameIndex] * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.ctx.restore();
        this.health.draw();
        this.energy.draw();
        //* Draw stamina manually
        this.ctx.save();
        this.ctx.fillStyle = this.stamina <= 50 ? "rgb(161, 197, 146)" : " rgb(36, 160, 43)";
        this.ctx.roundRect(62.4, 156, this.stamina * 5.2, 10.4, 5.4);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(324.5, 150.8);
        this.ctx.lineTo(324.5, 169);
        this.ctx.lineWidth = 5.4;
        this.ctx.stroke();
        this.ctx.restore();
    };

    checkCollision(instancesToCheck) {
        const playerX = this.x + this.width * this.deltaXHitbox;
        const playerY = this.y + this.height * this.deltaYHitbox;
        const playerWidth = this.width + this.width * this.deltaWidthHitbox;
        const playerHeight = this.height + this.height * this.deltaHeightHitbox;
        instancesToCheck.forEach((enemy) => {
            const enemyX = enemy.x + enemy.width * enemy.deltaXHitbox;
            const enemyY = enemy.y + enemy.height * enemy.deltaYHitbox;
            const enemyWidth = enemy.width + enemy.width * enemy.deltaWidthHitbox;
            const enemyHeight = enemy.height + enemy.height * enemy.deltaHeightHitbox;
            if (
                playerX < enemyX + enemyWidth 
                && playerX + playerWidth > enemyX
                && playerY < enemyY + enemyHeight
                && playerY + playerHeight > enemyY
                && !this.invincible
                && this.invincibleTime <= 0
            ) {
                this.invincibleTime = 3000;
                this.health.currentHealth--;
                playerGettingHitSound.play();
                if (this.health.currentHealth === 0) playerDeathSound.play();
                this.game.timeToDisplayDamageScreen = 100;
            };
        });
    };
};

