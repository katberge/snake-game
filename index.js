document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas");
    const c = canvas.getContext("2d");

    // set width of canvas to 300px
    canvas.width = 300;
    // set height of canavs to 400px
    canvas.height = 400;

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
    };

    // draw new circle in center of canvas
    let circle = new Circle(canvas.width / 2, canvas.height / 2);
    circle.draw();

});