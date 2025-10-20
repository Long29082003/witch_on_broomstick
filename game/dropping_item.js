const manaPotion = document.getElementById("mana-potion-image");
const healthPotion = document.getElementById("health-potion-image");
const attackUpgrade = document.getElementById("attack-upgrade-image");
const pierceUpgrade = document.getElementById("pierce-upgrade-image");

const manaSound = document.getElementById("mana-sound");
const healthSound = document.getElementById("health-sound");
const attackUpgradeSound = document.getElementById("attack-upgrade-sound");
const attackPierceUpgradeSound = document.getElementById("pierce-upgrade-sound");

manaSound.volume = 0.3;
healthSound.volume = 0.3;
attackUpgradeSound.volume = 0.3;
attackPierceUpgradeSound.volume = 0.3;

class Drop {
    constructor (game, player, spriteWidth, spriteHeight) {
        this.game = game;
        this.player = player;
        this.ctx = this.game.ctx;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;

        this.width = 52;
        this.height = (this.spriteHeight / this.spriteWidth) * this.width;
        this.x = Math.random() * 416 + 208;
        this.y = -this.height;

        this.speed = this.game.normalize(1) * 0.52;
        this.markedForDeletion = false;
    };

    update(deltaTime) {
        this.y += this.speed;        
        //? Delete out of bound drop
        if (this.y > this.game.canvasHeight) this.markedForDeletion = true;
    };

    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    };
};

export class ManaDrop extends Drop {
    constructor(game, player) {
        super(game,player, 544, 609);
        this.image = manaPotion;
    };

    update(deltaTime) {
        super.update(deltaTime);
        //? Check collision with player
        const playerX = this.player.x + this.player.width * this.player.deltaXHitbox;
        const playerY = this.player.y + this.player.height * this.player.deltaYHitbox;
        const playerWidth = this.player.width + this.player.width * this.player.deltaWidthHitbox;
        const playerHeight = this.player.height + this.player.height * this.player.deltaHeightHitbox;
        if (playerX < this.x + this.width
            && playerX + playerWidth > this.x
            && playerY < this.y + this.height
            && playerY + playerHeight > this.y
        ) {
            this.game.currentItemDropStage[1].drop_left--;
            this.markedForDeletion = true;
            this.player.energy.currentEnergy += 10;
            manaSound.play();
        };
    };
};

export class HealthDrop extends Drop {
    constructor(game, player) {
        super(game, player, 544, 609);
        this.image = healthPotion;
    };

    update(deltaTime) {
        super.update(deltaTime);
        //? Check collision with player
        const playerX = this.player.x + this.player.width * this.player.deltaXHitbox;
        const playerY = this.player.y + this.player.height * this.player.deltaYHitbox;
        const playerWidth = this.player.width + this.player.width * this.player.deltaWidthHitbox;
        const playerHeight = this.player.height + this.player.height * this.player.deltaHeightHitbox;
        if (playerX < this.x + this.width
            && playerX + playerWidth > this.x
            && playerY < this.y + this.height
            && playerY + playerHeight > this.y
        ) {
            this.markedForDeletion = true;
            this.player.health.currentHealth = Math.min(this.player.health.maxHealth, this.player.health.currentHealth + 1);
            healthSound.play();
            this.game.currentItemDropStage[0].drop_left--;
        };
    };
};

export class AttackUpgrade extends Drop {
    constructor(game, player) {
        super(game, player, 149, 136);
        this.image = attackUpgrade;
        this.frame = this.player.attackLevel - 1;
    };

    update(deltaTime) {
        super.update(deltaTime);
        //? Check collision with player
        const playerX = this.player.x + this.player.width * this.player.deltaXHitbox;
        const playerY = this.player.y + this.player.height * this.player.deltaYHitbox;
        const playerWidth = this.player.width + this.player.width * this.player.deltaWidthHitbox;
        const playerHeight = this.player.height + this.player.height * this.player.deltaHeightHitbox;
        if (playerX < this.x + this.width
            && playerX + playerWidth > this.x
            && playerY < this.y + this.height
            && playerY + playerHeight > this.y
        ) {
            this.markedForDeletion = true;
            this.player.attackLevel = Math.min(this.player.attackLevel + 1, 3);
            attackUpgradeSound.play();
            this.game.currentItemDropStage[2].drop_left--;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    };
};

export class PierceUpgrade extends Drop {
    constructor(game, player) {
        super(game, player, 149, 139);
        this.image = pierceUpgrade;
        this.frame = this.player.attackPierce - 1;
    };

    update(deltaTime) {
        super.update(deltaTime);
        //? Check collision with player
        const playerX = this.player.x + this.player.width * this.player.deltaXHitbox;
        const playerY = this.player.y + this.player.height * this.player.deltaYHitbox;
        const playerWidth = this.player.width + this.player.width * this.player.deltaWidthHitbox;
        const playerHeight = this.player.height + this.player.height * this.player.deltaHeightHitbox;
        if (playerX < this.x + this.width
            && playerX + playerWidth > this.x
            && playerY < this.y + this.height
            && playerY + playerHeight > this.y
        ) {
            this.markedForDeletion = true;
            this.player.attackPierce = Math.min(this.player.attackPierce + 1, 4);
            attackPierceUpgradeSound.play();
            this.game.currentItemDropStage[3].drop_left--;
        };
    };

    draw() {
        this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    };
};