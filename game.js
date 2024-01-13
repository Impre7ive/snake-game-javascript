const settings = {
    canvas: document.getElementById('game'),
    context: function () {
        return this.canvas.getContext('2d');
    },
    score: document.getElementById('score'),
    cellCount: 10,
    cellSize: 50,
    fps: 75,
    cellColor: '#3f5543',
    cellColorAlt: '#3b4f3f',
};

const snake = {
    tail: [{x: 5, y: 3}, {x: 4, y: 3}, {x: 3, y: 3}],
    direction: 'right',
    color: '#4a78f0',
    initialSize: 3,

};

const game = {
    score: 0,
    init: function () {
        this.setCanvasSize();
        this.setBackground();
        this.setSnake();
        //window.requestAnimationFrame();
    },
    setCanvasSize: function () {
       settings.canvas.width = settings.cellCount * settings.cellSize;
       settings.canvas.height = settings.cellCount * settings.cellSize;
    },
    setBackground: function() {
        const ctx = settings.context();

        for (let row = 0; row < settings.cellCount; ++row) {
            for (let column = 0; column < settings.cellCount; ++column) {
                ctx.fillStyle =  (row + column) % 2 === 0 ? settings.cellColor : settings.cellColorAlt;
                ctx.fillRect(
                    column * settings.cellSize, 
                    row * settings.cellSize,
                    settings.cellSize, 
                    settings.cellSize);
            }
        }
    },
    setSnake: function () {
        const ctx = settings.context();
        ctx.fillStyle = snake.color;

        snake.tail.forEach(cell => {
            ctx.fillRect(
                cell.x * settings.cellSize, 
                cell.y * settings.cellSize,
                settings.cellSize, 
                settings.cellSize);
        });
    }    
};

game.init();