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
            movement = "left";
        }
        if (e.keyCode == 38) {
            movement = "up";
        }
        if (e.keyCode == 39) {
            movement = "right";
        }
        if (e.keyCode == 40) {
            movement = "down";
        }
    };
    document.addEventListener("keyup", control);

    // add a circle constructor
    function Circle(x, y) {
        this.x = x;
        this.y = y;
        this.r = 5; // radius
        this.draw = () => {
            c.beginPath();
            c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            c.stroke();
            c.fill();
        };
        this.update = () => {
            c.clearRect(this.x - 2 * this.r, this.y - 2 * this.r, this.x, this.y);
            if (movement == "down") {
                this.y += 5;
            } else if (movement == "up") {
                this.y -= 5;
            } else if (movement == "left") {
                this.x -= 5;
            } else {
                this.x += 5;
            }
            this.draw();
        }
    };

    // draw new circle in center of canvas
    let circle = new Circle(canvas.width / 2, canvas.height / 2);
    circle.draw();

    // set interval for movement
    let interval = setInterval(() => {
        circle.update();
    }, 1000)

});