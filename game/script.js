//? Turn off the sound of reaper projectile after ending screen
//? Make the game sound fade out after you die
/** @type(HTMLCanvasElement)*/
import {Ghost, Demon, Rocket, Bird, Bowling} from "./enemy.js";
import {Reaper, GrenadeGuy} from "./bosses.js";
import InputHandler from "./input_handler.js";
import Player from "./player.js";
import {HealthDrop, ManaDrop, AttackUpgrade, PierceUpgrade} from "./dropping_item.js";
import {FireWall} from "./obstacle.js";
import {StartingScreen} from "./starting_screen.js";
import {EndingScreen} from "./ending_screen.js";
import {TransitionScreen, BlackBlock} from "./transition_screen.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startingScreenElement = document.getElementById("starting-screen");
const startingScreenCtx = startingScreenElement.getContext("2d");
const endingScreenElement = document.getElementById("ending-screen");
const endingScreenCtx = endingScreenElement.getContext("2d");

const canvasWidth = canvas.width = startingScreenElement.width = endingScreenElement.width = window.innerWidth;
const canvasHeight = canvas.height = startingScreenElement.height = endingScreenElement.height = window.innerHeight;

let savedTime = 0;

const layersLink = [
    {
        name: "layer1",
        image: document.getElementById("background-layer1"),
        width: 272,
        height: 160,
        speed: 0.1,
    },
    {
        name: "layer2",
        image: document.getElementById("background-layer2"),
        width: 272,
        height: 160,
        speed: 0.5,
    },
    {
        name: "layer3",
        image: document.getElementById("background-layer3"),
        width: 544,
        height: 160,
        speed: 0.7,
    },
    {
        name: "layer4",
        image: document.getElementById("background-layer4"),
        width: 544,
        height: 160,
        speed: 0.9,
    },
    {
        name: "layer5",
        image: document.getElementById("background-layer5"),
        width: 544,
        height: 160,
        speed: 1.1,
    },
];

class Game {
    constructor(canvasWidth, canvasHeight, ctx) {
        this.fps;
        this.fpsAlreadyChecked = false;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ctx = ctx;
        this.transitionScreen = "";
        this.score = 0;
        this.enemyStages = {
            "stage1": [
                {
                    name : "ghost",
                    enemy_left : 15,
                    intervalToAdd : 3000,
                    hp : 6, 
                },
                {
                    name : "demon", 
                    enemy_left : 5,
                    intervalToAdd : 6000,
                    hp : 3,
                },
                {
                    name : "rocket",
                    enemy_left : 1,
                    intervalToAdd : 28000,
                    hp : 15,
                },
                {
                    name : "bird",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "bowling",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "reaper",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                }
            ],
            "stage2": [
                { 
                    name : "ghost",
                    enemy_left : 20,
                    intervalToAdd : 2000,
                    hp : 6,
                },
                {
                    name : "demon",
                    enemy_left : 8,
                    intervalToAdd : 5000,
                    hp : 3,
                },
                {
                    name : "rocket",
                    enemy_left : 4,
                    intervalToAdd : 10000,
                    hp : 15,
                },
                {
                    name : "bird",
                    enemy_left : 2,
                    intervalToAdd : 22000,
                    number : 3,
                    hp : 3,
                },
                {
                    name : "bowling",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    number : 0,
                    hp : 0,
                },
                {
                    name : "reaper",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0
                }
            ],
            "boss1" : [
                {
                    name : "ghost", 
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "demon",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "rocket",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "bird",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    number : 0,
                    hp : 0,
                },
                {
                    name : "bowling",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    number : 0,
                    hp : 0,
                },
                {
                    name : "reaper",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 2,
                    intervalToAdd : 20000,
                    hp : 70,
                }
            ],
            "stage3": [
                {
                    name : "ghost", 
                    enemy_left : 54,
                    intervalToAdd : 1500,
                    hp : 6,
                },
                {
                    name : "demon",
                    enemy_left : 27,
                    intervalToAdd : 3000,
                    hp : 3,
                },
                {
                    name : "rocket",
                    enemy_left : 11,
                    intervalToAdd : 7000,
                    hp : 20,
                },
                {
                    name : "bird",
                    enemy_left : 5,
                    intervalToAdd : 15000,
                    number : 5,
                    hp : 5,
                },
                {
                    name : "bowling",
                    enemy_left : 2,
                    intervalToAdd : 40000,
                    number : 8,
                    hp : 15,
                },
                {
                    name : "reaper",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 2,
                    intervalToAdd : 30000,
                    hp : 50,
                },
            ],
            "boss2" : [
                {
                    name : "ghost", 
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "demon",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "rocket",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "bird",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    number : 0,
                    hp : 0,
                },
                {
                    name : "bowling",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    number : 0,
                    hp : 0,
                },
                {
                    name : "reaper",
                    enemy_left : 2,
                    intervalToAdd : 15000,
                    hp : 70,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 1,
                    intervalToAdd : 0,
                    hp : 60,
                }
            ],
            "freeplay" : [
                {
                    name : "ghost", 
                    enemy_left : 9999,
                    intervalToAdd : 1000,
                    hp : 9,
                },
                {
                    name : "demon",
                    enemy_left : 9999,
                    intervalToAdd : 2000,
                    hp : 5,
                },
                {
                    name : "rocket",
                    enemy_left : 9999,
                    intervalToAdd : 5000,
                    hp : 28,
                },
                {
                    name : "bird",
                    enemy_left : 9999,
                    intervalToAdd : 10000,
                    number : 8,
                    hp : 10,
                },
                {
                    name : "bowling",
                    enemy_left : 9999,
                    intervalToAdd : 15000,
                    number : 13,
                    hp : 16,
                },
                {
                    name : "reaper",
                    enemy_left : 9999,
                    intervalToAdd : 40000,
                    hp : 100,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 9999,
                    intervalToAdd : 35000,
                    hp : 80,
                }
            ],
        };

        this.itemDropStages = {
            "stage1": [
                {
                    name : "health",
                    drop_left : 1,
                    intervalToAdd : 50000,
                },
                {
                    name : "mana", 
                    drop_left : 0,
                    intervalToAdd : 0,
                },
                {
                    name : "attackUpgrade", 
                    drop_left : 0,
                    intervalToAdd : 0,
                },
                {
                    name : "pierceUpgrade", 
                    drop_left : 1,
                    intervalToAdd : 20000,
                },
            ],
            "stage2": [
                {
                    name : "health",
                    drop_left : 1,
                    intervalToAdd : 50000,
                },
                {
                    name : "mana", 
                    drop_left : 0,
                    intervalToAdd : 0,
                },
                {
                    name : "attackUpgrade", 
                    drop_left : 1,
                    intervalToAdd : 20000,
                },
                {
                    name : "pierceUpgrade", 
                    drop_left : 0,
                    intervalToAdd : 0,
                },
            ],
            "boss1" : [
                {
                    name : "health",
                    drop_left : 0,
                    intervalToAdd : 0,
                },
                {
                    name : "mana", 
                    drop_left : 3,
                    intervalToAdd : 15000,
                },
                {
                    name : "attackUpgrade", 
                    drop_left : 0,
                    intervalToAdd : 0,
                },
                {
                    name : "pierceUpgrade", 
                    drop_left : 0,
                    intervalToAdd : 0,
                },
            ],
            "stage3": [
                {
                    name : "health",
                    drop_left : 2,
                    intervalToAdd : 25000,
                },
                {
                    name : "mana", 
                    drop_left : 3,
                    intervalToAdd : 19000,
                },
                {
                    name : "attackUpgrade", 
                    drop_left : 0,
                    intervalToAdd : 0,
                },
                {
                    name : "pierceUpgrade", 
                    drop_left : 1,
                    intervalToAdd : 40000,
                },
            ],
            "boss2" : [
                {
                    name : "health",
                    drop_left : 1,
                    intervalToAdd : 40000,
                },
                {
                    name : "mana", 
                    drop_left : 1,
                    intervalToAdd : 10000,
                },
                {
                    name : "attackUpgrade", 
                    drop_left : 0,
                    intervalToAdd : 0,
                },
                {
                    name : "pierceUpgrade", 
                    drop_left : 0,
                    intervalToAdd : 0,
                },
            ],
            "freeplay" : [
                {
                    name : "health",
                    drop_left : 9999,
                    intervalToAdd : 50000,
                },
                {
                    name : "mana", 
                    drop_left : 9999,
                    intervalToAdd : 30000,
                },
                {
                    name : "attackUpgrade", 
                    drop_left : 1,
                    intervalToAdd : 10000,
                },
                {
                    name : "pierceUpgrade", 
                    drop_left : 1,
                    intervalToAdd : 5000,
                },
            ],
        };
        this.fireWallStages = {
            "stage1": {
                intervalToAdd : 999999,
                chance: 0,
            },
            "stage2": {
                intervalToAdd : 30000,
                chance: 0,
            },
            "boss1": {
                intervalToAdd : 15000,
                chance: 0,
            },
            "stage3": {
                intervalToAdd : 30000,
                chance: 0.99,
            },
            "boss2": {
                intervalToAdd : 15000,
                chance: 0.99,
            },
            "freeplay": {
                intervalToAdd : 15000,
                chance: 0.7,
            },
        };

        this.enemyXSpeedScale = {
            "stage1" : 0.8,
            "stage2" : 1,
            "boss1" : 1,
            "stage3" : 1.2,
            "boss2" : 1.2,
            "freeplay" : 1.4,
        };

        this.killCount = {
            "ghost": 0,
            "demon": 0,
            "rocket": 0,
            "bird": 0,
            "bowling": 0,
            "bullet": 0,
            "reaper": 0,
            "grenadeGuy": 0,
        };

        this.stagesList = ["stage1" , "stage2", "boss1", "stage3", "boss2", "freeplay"];
        this.stageIndex = 5;
        this.currentEnemyStage = this.enemyStages["stage1"];
        this.currentItemDropStage = this.itemDropStages["stage1"];
        this.currentFireWallStage = this.fireWallStages["stage1"];

        //* Refactor
        this.timeFromLastGhostAddition = 0;
        this.timeFromLastDemonAddition = 0;
        this.timeFromLastRocketAddition = 0;
        this.timeFromLastBirdAddition = 0;
        this.timeFromLastBowlingBallsAddition = 0;
        this.timeFromLastReaperAddition = 0;
        this.timeFromLastGrenadeGuyAddition = 0;
        this.timeFromLastManaDrop = 0;
        this.timeFromLastHealthDrop = 8000;
        this.timeFromLastAttackUpgradeDrop = 0;
        this.timeFromLastPierceUpgradeDrop = 3000;
        this.timeFromLastFireWallAddition = 0;
        this.intervalToSpeedUp = 20000;
        this.timeFromLastSpeedUp = 0;

        this.timeToDisplayDamageScreen = 0;
        this.timeBeforeTransitionScreen = 3000;

        this.layers = [];
        this.enemies = [];
        this.explosions = [];
        this.projectiles = [];
        this.droppingItems = [];
        this.obstacles = [];
        this.enemyProjectiles = [];
        //? These two are animation effects
        this.effects = [];

        this.ingameMusic = document.getElementById("ingame-sound");
        this.ingameMusic.playbackRate = 0.9;
        this.ingameMusic.volume = 0.05;
        this.ingameMusicLoopStart = 10.76;
        this.ingameMusicLoopEnd = 62.60;

        this.anyKeyPressedSound = document.getElementById("any-key-pressed-sound");
        this.anyKeyPressedSound.volume = 0.15;
    };

    addEnemies(deltaTime, player) {
        this.currentEnemyStage = this.enemyStages[this.stagesList[this.stageIndex]];
        //? Ghost
        if (this.timeFromLastGhostAddition > this.currentEnemyStage[0].intervalToAdd && this.currentEnemyStage[0].enemy_left > 0) {
            this.enemies.push(new Ghost(this, this.currentEnemyStage[0].hp, this.enemyXSpeedScale[this.stagesList[this.stageIndex]]));
            this.timeFromLastGhostAddition = 0;
            this.currentEnemyStage[0].enemy_left--;
        } else {
            this.timeFromLastGhostAddition += deltaTime;
        };

        //? Demon
        if (this.timeFromLastDemonAddition > this.currentEnemyStage[1].intervalToAdd && this.currentEnemyStage[1].enemy_left > 0) {
            this.enemies.push(new Demon(this, this.currentEnemyStage[1].hp));
            this.timeFromLastDemonAddition = 0;
            this.currentEnemyStage[1].enemy_left--;
        } else {
            this.timeFromLastDemonAddition += deltaTime;
        };

        //? Rocket
        if (this.timeFromLastRocketAddition > this.currentEnemyStage[2].intervalToAdd && this.currentEnemyStage[2].enemy_left > 0) {
            this.enemies.push(new Rocket(this, this.currentEnemyStage[2].hp, this.enemyXSpeedScale[this.stagesList[this.stageIndex]]));
            this.timeFromLastRocketAddition = 0;
            this.currentEnemyStage[2].enemy_left--;
        } else {
            this.timeFromLastRocketAddition += deltaTime;
        };

        //? Bird
        if (this.timeFromLastBirdAddition > this.currentEnemyStage[3].intervalToAdd && this.currentEnemyStage[3].enemy_left > 0) {
            const y = Math.random() * 900 + 100;
            const dy = Math.random() * 200 + 200;
            const loopYPosition = y - dy;
            const loopXPosition = Math.random() * 800 + 700;
            const scale = Math.random() * 0.5 + 1.5; 
            addBirds(this.currentEnemyStage[3].number, y, loopXPosition, loopYPosition, scale, 500, this, this.currentEnemyStage[3].hp, this.enemyXSpeedScale[this.stagesList[this.stageIndex]]);
            this.timeFromLastBirdAddition = 0;
            this.currentEnemyStage[3].enemy_left--;
        } else {
            this.timeFromLastBirdAddition += deltaTime;
        };

        //? Bowling
        if (this.timeFromLastBowlingBallsAddition > this.currentEnemyStage[4].intervalToAdd && this.currentEnemyStage[4].enemy_left > 0) {
            const y = Math.random() * 600 + 200;
            addBowlingBalls(10, y, Math.random()*100 + 150, Math.random()*150 + 150, this, this.currentEnemyStage[4].hp);
            this.timeFromLastBowlingBallsAddition = 0;
            this.currentEnemyStage[4].enemy_left--;
        } else {
            this.timeFromLastBowlingBallsAddition += deltaTime;
        };

        //? Reaper
        if (this.timeFromLastReaperAddition > this.currentEnemyStage[5].intervalToAdd && this.currentEnemyStage[5].enemy_left > 0) {
            this.enemies.push(new Reaper(this, player, this.currentEnemyStage[5].hp));
            this.timeFromLastReaperAddition = 0;
            this.currentEnemyStage[5].enemy_left--;
        } else {
            this.timeFromLastReaperAddition += deltaTime;
        };

        //? GrenadeGuy
        if (this.timeFromLastGrenadeGuyAddition > this.currentEnemyStage[6].intervalToAdd && this.currentEnemyStage[6].enemy_left > 0) {
            this.enemies.push(new GrenadeGuy(this, player, this.currentEnemyStage[6].hp, this.enemyXSpeedScale[this.stagesList[this.stageIndex]]));
            this.timeFromLastGrenadeGuyAddition = 0;
            this.currentEnemyStage[6].enemy_left--;
        } else {
            this.timeFromLastGrenadeGuyAddition += deltaTime;
        };
    };

    addItemDrop (deltaTime, player) {
        this.currentItemDropStage = this.itemDropStages[this.stagesList[this.stageIndex]];
        //? Health
        if (this.timeFromLastHealthDrop > this.currentItemDropStage[0].intervalToAdd && this.currentItemDropStage[0].drop_left > 0) {
            this.droppingItems.push(new HealthDrop(this, player));
            this.timeFromLastHealthDrop = 0;
        } else {
            this.timeFromLastHealthDrop += deltaTime;
        };

        //? Mana
        if (this.timeFromLastManaDrop > this.currentItemDropStage[1].intervalToAdd && this.currentItemDropStage[1].drop_left > 0) {
            this.droppingItems.push(new ManaDrop(this, player));
            this.timeFromLastManaDrop = 0;
        } else {
            this.timeFromLastManaDrop += deltaTime;
        };

        //? Attack upgrade
        if (this.timeFromLastAttackUpgradeDrop > this.currentItemDropStage[2].intervalToAdd && this.currentItemDropStage[2].drop_left > 0) {
            this.droppingItems.push(new AttackUpgrade(this, player));
            this.timeFromLastAttackUpgradeDrop = 0;
        } else {
            this.timeFromLastAttackUpgradeDrop += deltaTime;
        };

        //? Pierce upgrade
        if (this.timeFromLastPierceUpgradeDrop > this.currentItemDropStage[3].intervalToAdd && this.currentItemDropStage[3].drop_left > 0) {
            this.droppingItems.push(new PierceUpgrade(this, player));
            this.timeFromLastPierceUpgradeDrop = 0;
        } else {
            this.timeFromLastPierceUpgradeDrop += deltaTime;
        };
    };

    addFireWall (deltaTime, player) {
        this.currentFireWallStage = this.fireWallStages[this.stagesList[this.stageIndex]];
        if (this.timeFromLastFireWallAddition > this.currentFireWallStage.intervalToAdd) {
            this.obstacles.push(new FireWall(this, player, Math.random() < this.currentFireWallStage.chance ? true : false, this.enemyXSpeedScale[this.stagesList[this.stageIndex]]));
            this.timeFromLastFireWallAddition = 0;
        } else {
            this.timeFromLastFireWallAddition += deltaTime;
        };
    };

    checkToChangeState () {
        if (this.currentEnemyStage.every(enemy => enemy.enemy_left <= 0)) {
            this.stageIndex = Math.min(this.stageIndex + 1, 5);
            this.layers.forEach(layer => {
                const currentLayer = layersLink.find(eachLayer => eachLayer.name === layer.name);
                layer.xSpeed = currentLayer.speed * this.enemyXSpeedScale[this.stagesList[this.stageIndex]];
            });
        };
    };

    //? Check computer FPS
    checkFramePerSecond (deltaTime) {
        this.fps = Math.round(1000 / deltaTime);
        if (this.fps > 180) this.fps = 180;
        else if (this.fps < 60) this.fps = 60;
    };

    //? Normalize number based on FPS. My computer FPS is 164
    normalize(number) {
        return Number((number * 164) / this.fps);
    };

    inverseNormalize(number) {
        return Number((this.fps * number) / 164);
    };


    checkMusicLoop () {
        if (this.ingameMusic.currentTime >= this.ingameMusicLoopEnd) this.ingameMusic.currentTime = this.ingameMusicLoopStart;
    };

    increaseSpeedInFreePlay(deltaTime) {
        if (this.stageIndex === 5) {
            if (this.timeFromLastSpeedUp > this.intervalToSpeedUp) {
                this.enemyXSpeedScale["freeplay"] = Math.min(this.enemyXSpeedScale["freeplay"] + 0.1, 2.5);
                this.timeFromLastSpeedUp = 0;
            } else {
                this.timeFromLastSpeedUp += deltaTime;
            };
        };
    };
};

class Layer {
    constructor(image, spriteWidth, spriteHeight, speed, layerName, game) {
        this.game = game;
        this.name = layerName;
        this.x = 0;
        this.y = 0;
        this.spriteX = 0;
        this.spriteY = 0;
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.xSpeedSave = speed;
        this.xSpeed = this.xSpeedSave;
        this.image = image;
    };

    update() {
        //? Update layer speed based on game enemyXSpeedScale
        this.xSpeed = this.xSpeedSave * this.game.enemyXSpeedScale[this.game.stagesList[this.game.stageIndex]] * 1.7;

        this.x -= this.xSpeed;
        if (this.x <= -this.width) this.x = 0;
    };

    draw() {
        ctx.drawImage(this.image, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, this.x + this.width - this.xSpeed, this.y, this.width, this.height);
    };
};

const game = new Game(canvasWidth, canvasHeight, ctx);
const input = new InputHandler();
const player = new Player(input, game);
const startingScreen = new StartingScreen(startingScreenCtx, canvasWidth, canvasHeight);
const endingScreen = new EndingScreen(game, endingScreenCtx, canvasWidth, canvasHeight);

game.transitionScreen = new TransitionScreen(game);
input.startingScreen = startingScreen;
input.endingScreen = endingScreen;

const displayDamageScreen = (color) => {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
};

const scoreDisplay = () => {
    ctx.font = "bold 45px PressStart2P";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${game.score}`, 105, 105);
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${game.score}`, 100, 100);
};

const filterOutMarkedMonster = (monsterList) => {
    let points = 0;
    const filteredList =  monsterList.filter(monster => {
        if (!monster.markedForDeletion && !monster.markedForGoingOutOfBound) {
            return true;
        } else if (monster.markedForDeletion) {
            points += monster.point;
        };
    });
    return [filteredList, points];
}

const addBirds = async (numberOfBird, y, loopXPosition, loopYPosition, scale, delay, game, hp, xSpeedScale) => {
    for (let i = 0; i < numberOfBird; i++) {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(game.enemies.push(new Bird(y, loopXPosition, loopYPosition, scale, game, hp, xSpeedScale)));
            }, delay);
        });
    };
};

const addBowlingBalls = (numberOfBowlingBalls, y, xFluctuateRange, yFluctuateRange, game, hp) => {
    for (let i = 0; i < numberOfBowlingBalls; i++) {
        game.enemies.push(new Bowling(y, xFluctuateRange, yFluctuateRange, game, hp));
    };
};

//? WHen press add layers to game, turning off ending and starting screen, and 
const keyPressTransition = (timeStamp) => {
    reset();
    //? Layers
    for (const layer of layersLink) {
        game.layers.push(new Layer(layer.image, layer.width, layer.height, game.normalize(layer.speed), layer.name, game));
    };

    startingScreenElement.style.display = "none";
    endingScreenElement.style.display = "none";
    for (let i = 0; i < 6; i++) {
        game.transitionScreen.blocks.push(new BlackBlock(game, game.transitionScreen.blockWidth, i * game.transitionScreen.blockMoveDelay, game.transitionScreen.blockWidth * i));
    };
    startingScreen.moveToGameScreen = false;
    endingScreen.moveToGameScreen = false;
    input.gameStage = "gaming";

    //? Play key press sound
    game.anyKeyPressedSound.currentTime = 0;
    game.anyKeyPressedSound.play();

    //? Pause other music, play game music
    startingScreen.startingScreenMusic.pause();
    endingScreen.endingScreenMusic.pause();
    game.ingameMusic.currentTime = 0;
    game.ingameMusic.play();
    animate(timeStamp);
};

const animateStartingScreen = (timeStamp) => {
    startingScreen.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const deltaTime = timeStamp - savedTime;
    savedTime = timeStamp;

    startingScreen.update(deltaTime);
    startingScreen.draw();

    //? Check FPS 0.7 sec into browser
    if (timeStamp > 300 && !game.fpsAlreadyChecked) {
        game.fpsAlreadyChecked = true;
        game.checkFramePerSecond(deltaTime);
    };

    if (startingScreen.moveToGameScreen) {
        keyPressTransition(timeStamp + 1);
    } else {
        requestAnimationFrame(animateStartingScreen)
    };
};

const animateEndingScreen = (timeStamp) => {
    endingScreenCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    const deltaTime = timeStamp - savedTime;
    savedTime = timeStamp;

    endingScreen.draw();
    endingScreen.update(deltaTime);

    if (endingScreen.moveToGameScreen) keyPressTransition(timeStamp + 1);
    else if (!endingScreen.moveToGameScreen) requestAnimationFrame(animateEndingScreen);
};

const animate = (timeStamp) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const deltaTime = timeStamp - savedTime;
    savedTime = timeStamp;

    game.addEnemies(deltaTime, player);
    game.addItemDrop(deltaTime, player);
    game.addFireWall(deltaTime, player);
    game.checkToChangeState();   
    game.checkMusicLoop();
    game.increaseSpeedInFreePlay(deltaTime);

    //? Only render player when they are alive
    if (!player.markedForDeletion) {
        [...game.layers, ...game.obstacles, player, ...game.enemyProjectiles, ...game.projectiles, ...game.effects, ...game.explosions, ...game.droppingItems, ...game.enemies].forEach(object => object.draw());
        [...game.layers, ...game.obstacles, player, ...game.enemyProjectiles, ...game.projectiles, ...game.effects, ...game.explosions, ...game.droppingItems, ...game.enemies].forEach(object => object.update(deltaTime));
    } else {
        [...game.layers, ...game.obstacles, ...game.enemyProjectiles, ...game.projectiles, ...game.effects, ...game.explosions, ...game.droppingItems, ...game.enemies].forEach(object => object.draw());
        [...game.layers, ...game.obstacles, ...game.enemyProjectiles, ...game.projectiles, ...game.effects, ...game.explosions, ...game.droppingItems, ...game.enemies].forEach(object => object.update(deltaTime));
    };

    if (game.timeToDisplayDamageScreen > 50) {
        displayDamageScreen("white");
    } else if (game.timeToDisplayDamageScreen > 0) {
        displayDamageScreen("rgb(241, 80, 80)")
    };

    game.timeToDisplayDamageScreen -= deltaTime;

    scoreDisplay();

    //? Display transition screen last
    game.transitionScreen.update(deltaTime);
    game.transitionScreen.draw();
    
    //? Return enemy list after filtered and points
    const filteredEnemyList = filterOutMarkedMonster(game.enemies);
    
    game.enemies = filteredEnemyList[0];

    game.score += filteredEnemyList[1];
    
    game.explosions = game.explosions.filter(explosion => !explosion.markedForDeletion);
    game.projectiles = game.projectiles.filter(projectile => !projectile.markedForDeletion);
    game.droppingItems = game.droppingItems.filter(item => !item.markedForDeletion);
    game.obstacles = game.obstacles.filter(obstacle => !obstacle.markedForDeletion);
    game.enemyProjectiles = game.enemyProjectiles.filter(enemyProjectile => !enemyProjectile.markedForDeletion);
    game.effects = game.effects.filter(effect => !effect.markedForDeletion);
    
    if (player.markedForDeletion) game.timeBeforeTransitionScreen -= deltaTime;
    if (game.timeBeforeTransitionScreen <= 0) {
        endingScreenElement.style.display = "block";  
        input.gameStage = "waiting input";
        endingScreen.surviveTime = timeStamp - 3000 - endingScreen.savedTime;
        endingScreen.savedTime = timeStamp;
        endingScreen.killCounts = game.killCount;
        endingScreen.totalScore = game.score;
        endingScreen.updateKillCount();
        game.ingameMusic.pause();
        endingScreen.endingScreenMusic.currentTime = 0;
        endingScreen.endingScreenMusic.play();
        animateEndingScreen(timeStamp + 1); 
    } else {
        requestAnimationFrame(animate);
    };
};

animateStartingScreen(1);

//? Reset function
const reset = () => {
    //! RESET GAME
    //? Reset looping audio from reaper and firewall
    document.getElementById("fire-wall-sound").pause();
    document.getElementById("reaperbot-projectile-sound").pause();

    game.score = 0;
    game.enemyStages = {
            "stage1": [
                {
                    name : "ghost",
                    enemy_left : 15,
                    intervalToAdd : 3000,
                    hp : 6, 
                },
                {
                    name : "demon", 
                    enemy_left : 5,
                    intervalToAdd : 6000,
                    hp : 3,
                },
                {
                    name : "rocket",
                    enemy_left : 1,
                    intervalToAdd : 28000,
                    hp : 15,
                },
                {
                    name : "bird",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "bowling",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "reaper",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                }
            ],
            "stage2": [
                { 
                    name : "ghost",
                    enemy_left : 20,
                    intervalToAdd : 2000,
                    hp : 6,
                },
                {
                    name : "demon",
                    enemy_left : 8,
                    intervalToAdd : 5000,
                    hp : 3,
                },
                {
                    name : "rocket",
                    enemy_left : 4,
                    intervalToAdd : 10000,
                    hp : 15,
                },
                {
                    name : "bird",
                    enemy_left : 2,
                    intervalToAdd : 22000,
                    number : 3,
                    hp : 3,
                },
                {
                    name : "bowling",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    number : 0,
                    hp : 0,
                },
                {
                    name : "reaper",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0
                }
            ],
            "boss1" : [
                {
                    name : "ghost", 
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "demon",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "rocket",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "bird",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    number : 0,
                    hp : 0,
                },
                {
                    name : "bowling",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    number : 0,
                    hp : 0,
                },
                {
                    name : "reaper",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 2,
                    intervalToAdd : 20000,
                    hp : 70,
                }
            ],
            "stage3": [
                {
                    name : "ghost", 
                    enemy_left : 54,
                    intervalToAdd : 1500,
                    hp : 6,
                },
                {
                    name : "demon",
                    enemy_left : 27,
                    intervalToAdd : 3000,
                    hp : 3,
                },
                {
                    name : "rocket",
                    enemy_left : 11,
                    intervalToAdd : 7000,
                    hp : 20,
                },
                {
                    name : "bird",
                    enemy_left : 5,
                    intervalToAdd : 15000,
                    number : 5,
                    hp : 5,
                },
                {
                    name : "bowling",
                    enemy_left : 2,
                    intervalToAdd : 40000,
                    number : 8,
                    hp : 15,
                },
                {
                    name : "reaper",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 2,
                    intervalToAdd : 30000,
                    hp : 50,
                },
            ],
            "boss2" : [
                {
                    name : "ghost", 
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "demon",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "rocket",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    hp : 0,
                },
                {
                    name : "bird",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    number : 0,
                    hp : 0,
                },
                {
                    name : "bowling",
                    enemy_left : 0,
                    intervalToAdd : 0,
                    number : 0,
                    hp : 0,
                },
                {
                    name : "reaper",
                    enemy_left : 2,
                    intervalToAdd : 15000,
                    hp : 70,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 1,
                    intervalToAdd : 0,
                    hp : 60,
                }
            ],
            "freeplay" : [
                {
                    name : "ghost", 
                    enemy_left : 9999,
                    intervalToAdd : 1000,
                    hp : 9,
                },
                {
                    name : "demon",
                    enemy_left : 9999,
                    intervalToAdd : 2000,
                    hp : 5,
                },
                {
                    name : "rocket",
                    enemy_left : 9999,
                    intervalToAdd : 5000,
                    hp : 28,
                },
                {
                    name : "bird",
                    enemy_left : 9999,
                    intervalToAdd : 10000,
                    number : 8,
                    hp : 10,
                },
                {
                    name : "bowling",
                    enemy_left : 9999,
                    intervalToAdd : 15000,
                    number : 13,
                    hp : 16,
                },
                {
                    name : "reaper",
                    enemy_left : 9999,
                    intervalToAdd : 40000,
                    hp : 100,
                },
                {
                    name : "grenadeguy",
                    enemy_left : 9999,
                    intervalToAdd : 35000,
                    hp : 80,
                }
            ],
        };
    game.itemDropStages = {
        "stage1": [
            {
                name : "health",
                drop_left : 1,
                intervalToAdd : 50000,
            },
            {
                name : "mana", 
                drop_left : 0,
                intervalToAdd : 0,
            },
            {
                name : "attackUpgrade", 
                drop_left : 0,
                intervalToAdd : 0,
            },
            {
                name : "pierceUpgrade", 
                drop_left : 1,
                intervalToAdd : 20000,
            },
        ],
        "stage2": [
            {
                name : "health",
                drop_left : 1,
                intervalToAdd : 50000,
            },
            {
                name : "mana", 
                drop_left : 0,
                intervalToAdd : 0,
            },
            {
                name : "attackUpgrade", 
                drop_left : 1,
                intervalToAdd : 20000,
            },
            {
                name : "pierceUpgrade", 
                drop_left : 0,
                intervalToAdd : 0,
            },
        ],
        "boss1" : [
            {
                name : "health",
                drop_left : 0,
                intervalToAdd : 0,
            },
            {
                name : "mana", 
                drop_left : 3,
                intervalToAdd : 15000,
            },
            {
                name : "attackUpgrade", 
                drop_left : 0,
                intervalToAdd : 0,
            },
            {
                name : "pierceUpgrade", 
                drop_left : 0,
                intervalToAdd : 0,
            },
        ],
        "stage3": [
            {
                name : "health",
                drop_left : 2,
                intervalToAdd : 25000,
            },
            {
                name : "mana", 
                drop_left : 3,
                intervalToAdd : 19000,
            },
            {
                name : "attackUpgrade", 
                drop_left : 0,
                intervalToAdd : 0,
            },
            {
                name : "pierceUpgrade", 
                drop_left : 1,
                intervalToAdd : 40000,
            },
        ],
        "boss2" : [
            {
                name : "health",
                drop_left : 1,
                intervalToAdd : 40000,
            },
            {
                name : "mana", 
                drop_left : 1,
                intervalToAdd : 10000,
            },
            {
                name : "attackUpgrade", 
                drop_left : 0,
                intervalToAdd : 0,
            },
            {
                name : "pierceUpgrade", 
                drop_left : 0,
                intervalToAdd : 0,
            },
        ],
        "freeplay" : [
            {
                name : "health",
                drop_left : 9999,
                intervalToAdd : 50000,
            },
            {
                name : "mana", 
                drop_left : 9999,
                intervalToAdd : 30000,
            },
            {
                name : "attackUpgrade", 
                drop_left : 1,
                intervalToAdd : 10000,
            },
            {
                name : "pierceUpgrade", 
                drop_left : 1,
                intervalToAdd : 5000,
            },
        ],
    };
    game.fireWallStages = {
        "stage1": {
            intervalToAdd : 999999,
            chance: 0,
        },
        "stage2": {
            intervalToAdd : 30000,
            chance: 0,
        },
        "boss1": {
            intervalToAdd : 15000,
            chance: 0,
        },
        "stage3": {
            intervalToAdd : 30000,
            chance: 0.99,
        },
        "boss2": {
            intervalToAdd : 15000,
            chance: 0.99,
        },
        "freeplay": {
            intervalToAdd : 15000,
            chance: 0.7,
        },
    };

    game.killCount = {
        "ghost": 0,
        "demon": 0,
        "rocket": 0,
        "bird": 0,
        "bowling": 0,
        "bullet": 0,
        "reaper": 0,
        "grenadeGuy": 0,
    };

    game.stageIndex = 0;

    game.timeFromLastGhostAddition = 0;
    game.timeFromLastDemonAddition = 0;
    game.timeFromLastRocketAddition = 0;
    game.timeFromLastBirdAddition = 0;
    game.timeFromLastBowlingBallsAddition = 0;
    game.timeFromLastReaperAddition = 0;
    game.timeFromLastGrenadeGuyAddition = 0;
    game.timeFromLastManaDrop = 0;
    game.timeFromLastHealthDrop = 8000;
    game.timeFromLastAttackUpgradeDrop = 0;
    game.timeFromLastPierceUpgradeDrop = 3000;
    game.timeFromLastFireWallAddition = 0;
    game.intervalToSpeedUp = 20000;
    game.timeFromLastSpeedUp = 0;

    game.timeToDisplayDamageScreen = 0;
    game.timeBeforeTransitionScreen = 3000;

    game.layers = [];
    game.enemies = [];
    game.explosions = [];
    game.projectiles = [];
    game.droppingItems = [];
    game.obstacles = [];
    game.enemyProjectiles = [];
    game.effects = [];

    //? RESET PLAYER
    player.x = 200;
    player.y = 700;
    player.speedX = 0;
    player.speedY = 0;
    player.frameIndex = 0;
    player.timeFromLastAttack = 0;
    player.timeFromLastDashAnimation = 0;
    player.glowingTime = 0;
    player.health.currentHealth = 3;
    player.energy.currentEnergy = 50;
    player.stamina = 100;
    player.attackLevel = 1;
    player.attackPierce = 1;
    player.invincible = false;
    player.invincibleTime = 0;
    player.chargingLaser = false;
    player.yMovementRestriction = false;

    player.markedForDeletion = false;
};


