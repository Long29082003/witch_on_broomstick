//? This is just something extra, to transition from starting screen to game
export class BlackBlock {
    constructor (game, blockWidth, blockMoveDelay, x) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.width = blockWidth;
        this.height = this.game.canvasHeight;
        this.x = x;
        this.y = 0;

        this.speedY = game.normalize(2);
        this.acceleration = game.normalize(0.15);
        this.blockMoveDelay = blockMoveDelay;
        this.markedForDeletion = false;
    };

    update(deltaTime) {
        if (this.blockMoveDelay < 0) {
            this.y += this.speedY;
            this.speedY += this.acceleration;
        } else {
            this.blockMoveDelay -= deltaTime;
        };

        if (this.y > this.game.canvasHeight) this.markedForDeletion = true;
    };

    draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
};

export class BlackBlockInverse extends BlackBlock{
    constructor (game, blockWidth, blockMoveDelay, x) {
        super(game, blockWidth, blockMoveDelay, x);
        this.y = this.game.canvasHeight;
        this.speedY = game.normalize(-2);
        this.acceleration = game.normalize(-0.15);
        this.height = this.game.canvasHeight + 100;
        this.timeBeforeDeletion = 350 * 6 + 1000;
    };

    update(deltaTime) {
        if (this.blockMoveDelay < 0) {
            this.y += this.speedY;
            this.speedY += this.acceleration;
        } else {
            this.blockMoveDelay -= deltaTime;
        };

        if (this.y <= 0) {
            this.speedY = 0;
            this.acceleration = 0;
        };

        if (this.timeBeforeDeletion <= 0) {
            this.markedForDeletion = true;
        } else {
            this.timeBeforeDeletion -= deltaTime;
        };
    };
};

export class TransitionScreen {
    constructor (game) {
        this.game = game;

        this.blocks = [];
        this.blockWidth = this.game.canvasWidth / 6;
        this.blockMoveDelay = 350;
    };

    update(deltaTime) {
        this.blocks.forEach(block => block.update(deltaTime));

        this.blocks = this.blocks.filter(block => !block.markedForDeletion);
    };

    draw() {
        this.blocks.forEach(block => block.draw());
    };
};

