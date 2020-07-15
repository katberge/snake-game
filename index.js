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
            c.clearRect(this.x - 1.5 * this.r, this.y - 1.5 * this.r, 15, 15);
            if (movement == "down") {
                this.y += 1;
            } else if (movement == "up") {
                this.y -= 1;
            } else if (movement == "left") {
                this.x -= 1;
            } else {
                this.x += 1;
            }
            this.draw();
        }
    };

    // draw new circle in center of canvas
    let circle = new Circle(canvas.width / 2, canvas.height / 2);
    circle.draw();

    // set interval for movement
    const animate = () => {
        requestAnimationFrame(animate);
        circle.update();
    };
    animate();

});