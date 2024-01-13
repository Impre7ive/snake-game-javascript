const settings = {
    canvas: document.getElementById('game'),
    context: function () {
        return this.canvas.getContext('2d');
    },
    score: document.getElementById('score'),
    cellCount: 10,
    cellSize: 50,
    fr: 10,
    cellColor: '#3f5543',
    cellColorAlt: '#3b4f3f',
};

const snake = {
    tail: [],
    direction: 'right',
    color: '#4a78f0',
    initialSize: 3,
};

const game = {
    score: 0,
    isGameActive: false,
    init: function () {
        this.setCanvasSize();
        this.setBackground();
        this.setSnake();
        this.drawSnake();
    },
    clearCanvas: function() {
        const ctx = settings.context();
        ctx.clearRect(0, 0, settings.canvas.width, settings.canvas.height);
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
        snake.tail = [
            {x: 5, y: 3}, 
            {x: 4, y: 3}, 
            {x: 3, y: 3}
        ];
    },
    moveSnake: function () {     
        let head = {x: snake.tail[0].x, y: snake.tail[0].y};

        switch (snake.direction) {
            case 'down':
                head.y++;
                break;
            case 'up':
                head.y--;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;  
        }
        snake.tail.unshift(head);
        snake.tail.pop();
    }, 
    drawSnake: function () {
        const ctx = settings.context();
        ctx.fillStyle = snake.color;

        snake.tail.forEach(cell => {
            ctx.fillRect(
                cell.x * settings.cellSize, 
                cell.y * settings.cellSize,
                settings.cellSize, 
                settings.cellSize);
        });
    },  
    gameLoop: function() {
        console.log(1);
        this.clearCanvas()
        this.moveSnake();
        this.setBackground();
        this.drawSnake();
    }    
};

window.addEventListener("keydown", (event) => {
    if (event.key === 'ArrowLeft' && snake.direction !== 'right') {
        snake.direction = 'left';
    } else if (event.key === 'ArrowUp' && snake.direction !== 'down') {
        snake.direction = 'up';
    } else if (event.key === 'ArrowRight' && snake.direction !== 'left') {
        snake.direction = 'right';
    } else if (event.key === 'ArrowDown' && snake.direction !== 'up') {
        snake.direction = "down";
    }

    if (!game.isGameActive) {
        game.isGameActive = true;
        setInterval(() => {
            requestAnimationFrame(() => {
               game.gameLoop();
            });
        }, 1000 / settings.fr );
    }
});

game.init();

