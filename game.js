const settings = {
    canvas: document.getElementById('game'),
    context: function() {
        return this.canvas.getContext('2d');
    },
    score: document.getElementById('score'),
    cellCount: 10,
    cellSize: 50,
    fr: 10,
    cellColor: '#3f5543',
    cellColorAlt: '#3b4f3f',
    clearCanvas: function() {
        const ctx = this.context();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },    
    setCanvasSize: function() {
       this.canvas.width = this.cellCount * this.cellSize;
       this.canvas.height = this.cellCount * this.cellSize;
    },
    showScore: function(score) {
        this.score.innerHTML = score;
    },
    getRandomNumber: function() {
        return Math.floor(Math.random() * (this.cellCount));
    },
    drawBackground: function() {
        const ctx = this.context();

        for (let row = 0; row < this.cellCount; ++row) {
            for (let column = 0; column < this.cellCount; ++column) {
                ctx.fillStyle =  (row + column) % 2 === 0 ? this.cellColor : this.cellColorAlt;
                ctx.fillRect(
                    column * this.cellSize, 
                    row * this.cellSize,
                    this.cellSize, 
                    this.cellSize);
            }
        }
    }
};

const snake = {
    tail: [],
    direction: '',
    color: '#4a78f0',
    initialSize: 3,
    setSnake: function() {
        this.tail = [];
        this.direction = 'right';
        
        for (let i = 0; i < this.initialSize; i++)
        {
            this.tail.unshift({x: Math.ceil(settings.cellCount / 5) + i, y: Math.floor(settings.cellCount / 2)});
        }
    },
    drawSnake: function() {
        const ctx = settings.context();
        ctx.fillStyle = this.color;

        this.tail.forEach(cell => {
            ctx.fillRect(
                cell.x * settings.cellSize, 
                cell.y * settings.cellSize,
                settings.cellSize, 
                settings.cellSize);
        });
    }, 
    getNextPosition: function() {
        let head = {
            x: this.tail[0].x, 
            y: this.tail[0].y
        };

        switch (this.direction) {
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

        return head;
    },
    applyNextPosition: function(point, cutTail) {
       this.tail.unshift(point);

       if (cutTail === true)
       {
           this.tail.pop();
       }
    }
};

const food = {
    position: {x: 0, y: 0},
    color: '#e7471d',
    setFood: function (excludedCells) {
        let result = {x: 0, y: 0};

        do {
            result.x = settings.getRandomNumber();
            result.y = settings.getRandomNumber();
        } while (collisions.isSnakePointCollision(result, excludedCells));

        this.position.x = result.x;
        this.position.y = result.y;
    },
    drawFood: function() {
        const ctx = settings.context();
        ctx.fillStyle = this.color;

        ctx.fillRect(
            food.position.x * settings.cellSize, 
            food.position.y * settings.cellSize,
            settings.cellSize, 
            settings.cellSize);
    }
};

const game = {
    score: 0,
    isGameActive: false,
    init: function () {
        this.isGameActive = false;
        clearInterval(this.loop);
        this.score = 0;
        settings.showScore(this.score);
        settings.setCanvasSize();
        snake.setSnake();
        food.setFood(snake.tail);
        settings.clearCanvas();
        settings.drawBackground();
        snake.drawSnake();
        food.drawFood();
    },
    incrementScore: function() {
        this.score++;
    },
    moveSnake: function () {     
        let head = snake.getNextPosition();

        if (collisions.isSnakePointCollision(head, snake.tail) || collisions.isOutOfField(head, settings.cellCount))
        {
            this.init();
            return;
        }

        snake.applyNextPosition(head, true);

        if (collisions.isSnakePointCollision(food.position, snake.tail))
        {
            let head = {...food.position};
            snake.applyNextPosition(head, false);
            this.incrementScore();
            settings.showScore(this.score);
            food.setFood(snake.tail);
        }
    },  
    gameLoop: function() {
        settings.clearCanvas()
        this.moveSnake();
        settings.drawBackground();
        snake.drawSnake();
        food.drawFood();
    }    
};

const collisions = {
    isSnakePointCollision: function(point, tail) {
        return tail.some(position => position.x === point.x && position.y === point.y); 
    },
    isOutOfField: function (point, cellCount) {
        return point.x >= cellCount || point.y >= cellCount || point.x < 0 || point.y < 0;
    },
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

