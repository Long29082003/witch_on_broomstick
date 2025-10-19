const playerEvents = () => {
    
};
export default class InputHandler {
    constructor() {
        this.keyPressed = {
            "ArrowUp" : false,
            "ArrowDown" : false,
            "ArrowLeft" : false,
            "ArrowRight" : false,
            " " : false,
            "z" : false,
            "Shift" : false,
        };
        
        this.shiftLock = false;
        this.gameStage = "waiting input";

        this.startingScreen;
        this.endingScreen;

        window.addEventListener("keydown", (event) => {
            if (this.gameStage === "gaming") {
                switch (event.key) {
                case "ArrowUp":
                    this.keyPressed["ArrowUp"] = true;
                    break;
                case "ArrowDown":
                    this.keyPressed["ArrowDown"] = true;
                    break;
                case "ArrowLeft":
                    this.keyPressed["ArrowLeft"] = true;
                    break;
                case "ArrowRight":
                    this.keyPressed["ArrowRight"] = true;
                    break;
                case " ":
                    this.keyPressed[" "] = true;
                    break;
                case "z":
                    this.keyPressed["z"] = true;
                    break;
                case "Shift":
                    if (!this.shiftLock) this.keyPressed["Shift"] = true;
                    break;
                };    
            } else if (this.gameStage === "waiting input") {
                this.startingScreen.moveToGameScreen = true;
                this.endingScreen.moveToGameScreen = true;
            };
        });

        window.addEventListener("keyup", (event) => {
            if (this.gameStage === "gaming") {
                switch (event.key) {
                case "ArrowUp":
                    this.keyPressed["ArrowUp"] = false;
                    break;
                case "ArrowDown":
                    this.keyPressed["ArrowDown"] = false;
                    break;
                case "ArrowLeft":
                    this.keyPressed["ArrowLeft"] = false;
                    break;
                case "ArrowRight":
                    this.keyPressed["ArrowRight"] = false;
                    break;
                case " ":
                    this.keyPressed[" "] = false;
                    break;
                case "z":
                    this.keyPressed["z"] = false;
                    break;
                case "Shift":
                    this.keyPressed["Shift"] = false;
                    break;
                };
            };
        });
    };
};