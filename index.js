document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas");
    const c = canvas.getContext("2d");

    // set width of canvas to 300px
    canvas.width = 300;
    // set height of canavs to 400px
    canvas.height = 400;

    // add key interactivity
    let movement = "down";
    let control = (e) => {
        if (e.keyCode == 37) {
            if (player.length == 1 || controlCircle.direction !== "right") {
                movement = "left";
            }
        }
        if (e.keyCode == 38) {
            if (player.length == 1 || controlCircle.direction !== "down") {
                movement = "up";
            }
        }
        if (e.keyCode == 39) {
            if (player.length == 1 || controlCircle.direction !== "left") {
                movement = "right";
            }
        }
        if (e.keyCode == 40) {
            if (player.length == 1 || controlCircle.direction !== "up") {
                movement = "down";
            }
        }
    };
    document.addEventListener("keyup", control);

    // color palette
    const colors = ["#f969b2", "#dcc147", "#1cba6f", "#21d0aa", "#16498a", "#2f2489", "#ef8429", "#e66e70", "#b11620", "#933153", "#2a374a"];

    let r = 5;
    // add a circle constructor
    function Circle(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.r = r; // radius
        this.direction = movement;
        this.draw = () => {
            c.beginPath();
            c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            c.strokeStyle = this.color;
            c.stroke();
            c.fillStyle = this.color;
            c.fill();
        };
        this.update = () => {
            if (this.direction == "down") {
                this.y += 10;
            } else if (this.direction == "up") {
                this.y -= 10;
            } else if (this.direction == "left") {
                this.x -= 10;
            } else {
                this.x += 10;
            }
            this.draw();
        }
    };

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

    // draw new circle in center of canvas
    let thisColor = Math.floor(Math.random() * colors.length);
    let controlCircle = new Circle(canvas.width / 2 + r, canvas.height / 2 + r, colors[thisColor]);
    player.push(controlCircle);

    // make new circle
    let newCircle;
    const makeCircle = () => {
        let x = Math.ceil(Math.random() * canvas.width / 10) * 10 - r;
        let y = Math.ceil(Math.random() * canvas.height / 10) * 10 - r;
        for (let i = 0; i < player.length; i++) { // don't allow new circle to overlap player
            if (getDistance(x, y, player[i]) < 2 * r) {
                x = Math.ceil(Math.random() * canvas.width / 10) * 10 - r;
                y = Math.ceil(Math.random() * canvas.height / 10) * 10 - r;
                i = -1;
            }
        }
        let index = Math.floor(Math.random() * colors.length);
        newCircle = new Circle(x, y, colors[index]);
    }
    makeCircle();
    newCircle.draw();

    // create function to attach circle to the player string
    const attatch = (circle) => {
        let previous = player[player.length - 1];
        if (previous.direction == "down") {
            circle.x = previous.x;
            circle.y = previous.y - 2 * r;
        } else if (previous.direction == "up") {
            circle.x = previous.x;
            circle.y = previous.y + 2 * r;
        } else if (previous.direction == "left") {
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
        if (getDistance(newCircle.x, newCircle.y, controlCircle) < 2 * r) {
            attatch(newCircle);
            player.push(newCircle);
            makeCircle();
            score++;
            document.querySelector("#score").innerHTML = score;
        }
    };

    // millisecond and interval variables
    let milliseconds;
    let interval;

    // adds start menu functionality with different speed for three difficulties
    const startMenu = document.querySelector("#start-menu");
    const easyBtn = document.querySelector("#easy");
    const medBtn = document.querySelector("#medium");
    const hardBtn = document.querySelector("#hard");
    easyBtn.addEventListener("click", () => {
        // get rid of start menu
        startMenu.style.display = "none";
        // show canvas and start game
        canvas.style.display = "initial";
        milliseconds = 500;
        interval = setInterval(animate, milliseconds);
    });
    medBtn.addEventListener("click", () => {
        // get rid of start menu
        startMenu.style.display = "none";
        // show canvas and start game
        canvas.style.display = "initial";
        milliseconds = 300;
        interval = setInterval(animate, milliseconds);
    });
    hardBtn.addEventListener("click", () => {
        // get rid of start menu
        startMenu.style.display = "none";
        // show canvas and start game
        canvas.style.display = "initial";
        milliseconds = 100;
        interval = setInterval(animate, milliseconds);
    });

    // set interval for movement
    const animate = () => {
        c.clearRect(0, 0, canvas.width, canvas.height);
        for (i = player.length - 1; i > 0; i--) {
            player[i].direction = player[i - 1].direction;
        }
        controlCircle.direction = movement;
        player.map(circle => {
            circle.update();  
        })
        newCircle.draw();
        collisionCheck();
        gameOver();
    };


    // check game over function
    const gameOver = () => {
        // variable for if any of the tests are positive
        let answer;

        // if control circle hits wall
        if (movement == "down" && canvas.height - controlCircle.y < r) {
            answer = true;
        }
        if (movement == "up" && controlCircle.y < r) {
            answer = true;
        }
        if (movement == "left" && controlCircle.x < r) {
            answer = true;
        }
        if (movement == "right" && canvas.width - controlCircle.x < r) {
            answer = true;
        }

        // if control circle hits player/its tail
        for (i = 1; i < player.length; i++) {
            let distance = getDistance(player[i].x, player[i].y , controlCircle);
            if (distance < 2 * r) {
                answer = true;
            }
        }
        if (answer == true) {
            stopGame();
        }

    };

    // get new game button and add functionality
    let newGameBtn = document.querySelector("#restart");
    newGameBtn.addEventListener("click", () => {
        location.reload(); // reloads page
    });

    //add functionality to pause/start button
    let pauseBtn = document.querySelector("#pause");
    let paused = false;
    pauseBtn.addEventListener("click", () => {
        if (paused == false) {
            clearInterval(interval);
            paused = true;
        } else {
            interval = setInterval(animate, milliseconds);
            paused = false;
        }
    });

    // stop game if game over is true
    const stopGame = () => {
        c.fillStyle = "rgb(0, 0, 0, 0.3)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        clearInterval(interval);
        document.querySelector("#game-over").style.display = "block";
        pauseBtn.style.display = "none";
    };

});