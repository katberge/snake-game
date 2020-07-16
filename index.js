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

    // color palette
    const colors = ["#f969b2", "#dcc147", "#1cba6f", "#21d0aa", "#16498a", "#2f2489", "#ef8429", "#e66e70", "#b11620", "#933153", "#2a374a"];

    let r = 5;
    // add a circle constructor
    function Circle(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.r = r; // radius
        this.draw = () => {
            c.beginPath();
            c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            c.strokeStyle = this.color;
            c.stroke();
            c.fillStyle = this.color;
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

    // draw new circle in center of canvas
    let thisColor = Math.floor(Math.random() * colors.length);
    let controlCircle = new Circle(canvas.width / 2, canvas.height / 2, colors[thisColor]);

    // make new circle
    let newCircle;
    const makeCircle = () => {
        let x = (Math.random() * (canvas.width - 2 * r)) + r;
        let y = (Math.random() * (canvas.height - 2 * r)) + r;
        while (getDistance(x, y, controlCircle) <= 2 * r) { // don't allow new circle to overlap control circle
            x = (Math.random() * (canvas.width - 2 * r)) + r;
            y = (Math.random() * (canvas.height - 2 * r)) + r;
        }
        let index = Math.floor(Math.random() * colors.length);
        newCircle = new Circle(x, y, colors[index]);
    }
    makeCircle();
    newCircle.draw();

    // set interval for movement
    const animate = () => {
        requestAnimationFrame(animate);
        controlCircle.update();
    };
    animate();

});