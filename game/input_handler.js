const playerEvents = () => {
    
};
export default class InputHandler {
    constructor() {
        this.keyPressed = {
            "w" : false,
            "s" : false,
            "a" : false,
            "d" : false,
            " " : false,
            "j" : false,
            "shift" : false,
        };
        
        this.shiftLock = false;
        this.gameStage = "";

        this.startingScreen;
        this.endingScreen;

        window.addEventListener("keydown", (event) => {
            if (this.gameStage === "gaming") {
                switch (event.key.toLowerCase()) {
                    case "w":
                        this.keyPressed["w"] = true;
                        break;
                    case "s":
                        this.keyPressed["s"] = true;
                        break;
                    case "a":
                        this.keyPressed["a"] = true;
                        break;
                    case "d":
                        this.keyPressed["d"] = true;
                        break;
                    case " ":
                        this.keyPressed[" "] = true;
                        break;
                    case "j":
                        this.keyPressed["j"] = true;
                        break;
                    case "shift":
                        if (!this.shiftLock) this.keyPressed["shift"] = true;
                        break;
                };    
            } else if (this.gameStage === "waiting input") {
                this.startingScreen.moveToGameScreen = true;
                this.endingScreen.moveToGameScreen = true;
            };
        });

        window.addEventListener("keyup", (event) => {
            if (this.gameStage === "gaming") {
                switch (event.key.toLowerCase()) {
                case "w":
                    this.keyPressed["w"] = false;
                    break;
                case "s":
                    this.keyPressed["s"] = false;
                    break;
                case "a":
                    this.keyPressed["a"] = false;
                    break;
                case "d":
                    this.keyPressed["d"] = false;
                    break;
                case " ":
                    this.keyPressed[" "] = false;
                    break;
                case "j":
                    this.keyPressed["j"] = false;
                    break;
                case "shift":
                    this.keyPressed["shift"] = false;
                    break;
                };
            };
        });
    };
};