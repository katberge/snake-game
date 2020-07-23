document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("#main-canvas");
    const c = canvas.getContext("2d");

    // set width of canvas to 300px
    canvas.width = 300;
    // set height of canavs to 400px
    canvas.height = 400;

    // add key interactivity
    let movement = "down";
    let control = (e) => {
        if (e.keyCode == 37) {
            if (player.length === 1 || player[0].direction !== "right") {
                movement = "left";
            }
        }
        if (e.keyCode === 38) {
            if (player.length === 1 || player[0].direction !== "down") {
                movement = "up";
            }
        }
        if (e.keyCode === 39) {
            if (player.length === 1 || player[0].direction !== "left") {
                movement = "right";
            }
        }
        if (e.keyCode === 40) {
            if (player.length === 1 || player[0].direction !== "up") {
                movement = "down";
            }
        }
    };

    // color palette
    const bopColors = ["#f969b2", "#e66e70", "#ef8429", "#dcc147", "#1cba6f", "#21d0aa", "#16498a", "#2f2489", "#2a374a", "#933153", "#b11620"];
    const ccColors = ["#ffafb8", "#ffafe0", "#f6afff", "#d0a4ff", "#c6b5ff", "#c3c7ff", "#c3e5ff", "#c3fffb"];
    const cottageColors = ["#ffc1b1", "#ffe8b1", "#c4f0d2", "#b1efff", "#d7def2", "#9bc99e", "#6b90b6", "#c99bc6", "#b6916b", "#b66c6b"];
    const rainbowColors = ["#ff0000", "#ff8000", "#f2f207", "#00ff00", "#00ffbf", "#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff"];
    const darkColors = ["#066832", "#3ba771", "#007883", "#142943", "#572e5b", "#68063c", "#830b00", "#a73b3b", "#a7713b"];
    let colors;

    // sets radius
    let r = 5;
    // add a circle constructor
    function Circle(x, y, color, context) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.r = r; // radius
        this.direction = movement;
        this.draw = () => {
            context.beginPath();
            context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            context.strokeStyle = this.color;
            context.stroke();
            context.fillStyle = this.color;
            context.fill();
        };
        this.update = () => {
            if (this.direction === "down") {
                this.y += 10;
            } else if (this.direction === "up") {
                this.y -= 10;
            } else if (this.direction === "left") {
                this.x -= 10;
            } else {
                this.x += 10;
            }
            this.draw();
        }
    };


    // color preview canvas set up
    const colorCanvas = document.querySelector("#color-canvas");
    const colorContext = colorCanvas.getContext("2d");

    // set width and height for color preview
    colorCanvas.width = 300;
    colorCanvas.height = 30;
    let colorPrevCircles = [];
    const drawPreview = () => {
        colorContext.clearRect(0, 0, colorCanvas.width, colorCanvas.height);
        for (let i = 0; i < colors.length; i++) {
        let x = (i * 15) + 7.5 + (colorCanvas.width / 2) - (colors.length * 7.5);
        colorPrevCircles.push(new Circle(x, colorCanvas.height / 2, colors[i], colorContext));
        colorPrevCircles[colorPrevCircles.length - 1].draw(); // draw newly pushed circle
        }
    }


    // get distance between circles
    const getDistance = (x, y, circle) => {
        let x1 = x;
        let x2 = circle.x;
        let xDiff = x2 - x1;
        let y1 = y;
        let y2 = circle.y;
        let yDiff = y2 - y1;
        return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    };

    // create player array to add circles to
    const player = [];
    // array for circles to hit
    const targetArr = [];

    // make new circle
    const makeCircle = () => {
        let x = Math.ceil(Math.random() * canvas.width / 10) * 10 - r;
        let y = Math.ceil(Math.random() * canvas.height / 10) * 10 - r;
        for (let i = 0; i < player.length; i++) { // don't allow new circle to overlap player
            if (getDistance(x, y, player[i]) < 2 * r) {
                x = Math.ceil(Math.random() * canvas.width / 10) * 10 - r;
                y = Math.ceil(Math.random() * canvas.height / 10) * 10 - r;
                i = -1;
            }
            if (targetArr.length > 0 && getDistance(x, y, targetArr[0]) < 2 * r) {
                x = Math.ceil(Math.random() * canvas.width / 10) * 10 - r;
                y = Math.ceil(Math.random() * canvas.height / 10) * 10 - r;
                i = -1;
            }
        }
        let index = Math.floor(Math.random() * colors.length);
        targetArr.push(new Circle(x, y, colors[index], c));
    }

    // starts the game by darwing the circles
    const init = () => {
        // draw player circle in center of canvas
        let thisColor = Math.floor(Math.random() * colors.length);
        player.push(new Circle(canvas.width / 2 + r, canvas.height / 2 + r, colors[thisColor], c));

        // draw two target circles
        for (let i = 0; i < 2; i++) {
            makeCircle();
            targetArr[targetArr.length - 1].draw();
        }

        // allow controls
        document.addEventListener("keyup", control);
    }

    // create function to attach circle to the player string
    const attatch = (circle) => {
        let previous = player[player.length - 1];
        if (previous.direction === "down") {
            circle.x = previous.x;
            circle.y = previous.y - 2 * r;
        } else if (previous.direction === "up") {
            circle.x = previous.x;
            circle.y = previous.y + 2 * r;
        } else if (previous.direction === "left") {
            circle.y = previous.y;
            circle.x = previous.x + 2 * r;
        } else {
            circle.y = previous.y;
            circle.x = previous.x - 2 * r;
        }
    };

    // score variable
    let score = 0;
    // check collision
    const collisionCheck = () => {
        targetArr.forEach(target => {
            if (getDistance(target.x, target.y, player[0]) < 2 * r) {
                attatch(target);
                player.push(target);
                makeCircle();
                score++;
                document.querySelector("#score").innerHTML = score;
            }
        }); 
    };

    // millisecond and interval variables
    let milliseconds;
    let interval;

    // assigns button to variables
    const startMenu = document.querySelector("#start-menu");
    const gameMenu = document.querySelector("#game-menu");
    const diffBtns = Array.from(document.querySelectorAll(".diff-button"));
    const colorBtns = Array.from(document.querySelectorAll(".color-button"));
    const beginBtn = document.querySelector("#begin");
    beginBtn.disabled = true;

    // adds start menu functionality with different speed for three difficulties
    document.querySelector("#start-menu").addEventListener("click", (e) =>{
        if (e.target.tagName === "BUTTON") {
            if (e.target.className === "diff-button") {
                diffBtns.forEach(btn => {
                    btn.classList.remove("selected");
                });
                if (e.target.id === "easy") {
                    milliseconds = 300;
                } else if (e.target.id === "medium") {
                    milliseconds = 150;
                } else if (e.target.id === "hard") {
                    milliseconds = 60;
                }
                e.target.classList.add("selected"); 
            } if (e.target.className === "color-button") {
                colorBtns.forEach(btn => {
                    btn.classList.remove("selected");
                });
                if (e.target.id === "bop") {
                    colors = bopColors;
                } else if (e.target.id === "cotton-candy") {
                    colors = ccColors;
                } else if (e.target.id === "cottage") {
                    colors = cottageColors;
                } else if (e.target.id === "rainbow") {
                    colors = rainbowColors;
                } else if (e.target.id === "dark") {
                    colors = darkColors;
                }
                e.target.classList.add("selected");
                drawPreview();
            } else if (e.target.id === "begin") {
                // get rid of start menu
                startMenu.style.display = "none";
                // show canvas, show game menu, draw circles, and start game
                canvas.style.display = "initial";
                gameMenu.style.display = "initial";
                init();
                interval = setInterval(animate, milliseconds);
            }
            let selectedArr = Array.from(document.querySelectorAll(".selected"));
            if (selectedArr.length > 1) {
                beginBtn.disabled = false;
            }
        }
    });

    // initializes paused variable
    let paused = false;

    // adds functionality to game menu buttons (pause/play and new game)
    document.querySelector("#game-menu").addEventListener("click", (e) =>{
        if (e.target.tagName === "BUTTON") {
            if (e.target.id === "restart") {
                location.reload(); // reloads page
            } else if (e.target.id === "pause") {
                if (paused === false) {
                    clearInterval(interval);
                    paused = true;
                    pauseBtn.innerHTML = "Start";
                } else {
                    interval = setInterval(animate, milliseconds);
                    paused = false;
                    pauseBtn.innerHTML = "Pause";
                }
            }
        }
    });

    // animate function for movement
    const animate = () => {
        c.clearRect(0, 0, canvas.width, canvas.height);
        for (i = player.length - 1; i > 0; i--) {
            player[i].direction = player[i - 1].direction;
        }
        player[0].direction = movement;
        player.forEach(circle => {
            circle.update();  
        })
        targetArr.forEach(target => {
            target.draw();
        });
        collisionCheck();
        gameOver();
    };


    // check game over function
    const gameOver = () => {
        // variable for if any of the tests are positive
        let answer;

        // if snake head hits wall
        if (movement === "down" && canvas.height - player[0].y < r) {
            answer = true;
        }
        if (movement === "up" && player[0].y < r) {
            answer = true;
        }
        if (movement === "left" && player[0].x < r) {
            answer = true;
        }
        if (movement === "right" && canvas.width - player[0].x < r) {
            answer = true;
        }

        // if snake head hits player/its tail
        for (i = 1; i < player.length; i++) {
            let distance = getDistance(player[i].x, player[i].y , player[0]);
            if (distance < 2 * r) {
                answer = true;
            }
        }
        if (answer === true) {
            stopGame();
        }

    };

    // stop game if game over is true
    const stopGame = () => {
        c.fillStyle = "rgb(0, 0, 0, 0.3)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        clearInterval(interval);
        document.querySelector("#game-over").style.display = "block";
        document.querySelector("#pause").style.display = "none";
    };

});