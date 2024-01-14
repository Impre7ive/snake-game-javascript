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

const food = {
    position: {x: 0, y: 0},
    color: '#e7471d'
};

const game = {
    score: 0,
    isGameActive: false,
    init: function () {
        clearInterval(game.loop);
        this.score = 0;
        this.isGameActive = false;
        this.updateScore();
        this.setCanvasSize();
        this.drawBackground();
        this.setSnake();
        this.drawSnake();
        this.setFood();
        this.drawFood();
    },
    clearCanvas: function() {
        const ctx = settings.context();
        ctx.clearRect(0, 0, settings.canvas.width, settings.canvas.height);
    },    
    setCanvasSize: function () {
       settings.canvas.width = settings.cellCount * settings.cellSize;
       settings.canvas.height = settings.cellCount * settings.cellSize;
    },
    drawBackground: function() {
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
        let head = {
            x: snake.tail[0].x, 
            y: snake.tail[0].y
        };

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

        if (this.isSnakeCollision(head) || this.isOutOfField(head))
        {
            this.init();
            return;
        }

        snake.tail.unshift(head);
        snake.tail.pop();

        if (this.isSnakeCollision(food.position))
        {
            let newHead = {x: food.position.x, y: food.position.y};
            snake.tail.unshift(newHead);
            this.setFood();
            this.score++;
            this.updateScore();
        }
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
    setFood: function () {
        let result = {x: 0, y: 0};

        do {
            result.x = this.getRandomNumber(settings.cellCount);
            result.y = this.getRandomNumber(settings.cellCount);
        } while (this.isSnakeCollision(result));

        food.position.x = result.x;
        food.position.y = result.y;
    },
    getRandomNumber: function(max) {
        return Math.floor(Math.random() * (max)); //we need to add 1, but array starts with 0, so no need
    },
    isSnakeCollision: function(point) {
        return snake.tail.some(position => position.x === point.x && position.y === point.y); 
    },
    isOutOfField: function (point) {
        return point.x >= settings.cellCount || point.y >= settings.cellCount || point.x < 0 || point.y < 0;
    },
    updateScore: function() {
        settings.score.innerHTML = game.score;
    },
    drawFood: function() {
        const ctx = settings.context();
        ctx.fillStyle = food.color;

        ctx.fillRect(
            food.position.x * settings.cellSize, 
            food.position.y * settings.cellSize,
            settings.cellSize, 
            settings.cellSize);
    },
    gameLoop: function() {
        this.clearCanvas()
        this.moveSnake();
        this.drawBackground();
        this.drawSnake();
        this.drawFood();
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
        
        game.loop = setInterval(() => {
            requestAnimationFrame(() => {
               game.gameLoop();
            });
        }, 1000 / settings.fr );
    }
});

game.init();

