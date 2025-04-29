import React, { useState, useEffect } from 'react';
import './App.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;

function App() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // 生成新食物
  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    setFood(newFood);
  };

  // 游戏逻辑
  const moveSnake = () => {
    if (gameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // 碰撞检测
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // 吃食物检测
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        generateFood();
      } else {
        newSnake.pop();
      }

      newSnake.unshift(head);
      return newSnake;
    });
  };

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp': setDirection('UP'); break;
        case 'ArrowDown': setDirection('DOWN'); break;
        case 'ArrowLeft': setDirection('LEFT'); break;
        case 'ArrowRight': setDirection('RIGHT'); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // 游戏循环
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 200);
    return () => clearInterval(gameInterval);
  }, [direction, gameOver]);

  // 重新开始
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="game-container">
      <h1>贪吃蛇游戏 - 得分: {score}</h1>
      <div className="grid">
        {Array(GRID_SIZE).fill().map((_, y) => (
          <div key={y} className="row">
            {Array(GRID_SIZE).fill().map((_, x) => (
              <div 
                key={x}
                className={`cell ${snake.some(pos => pos.x === x && pos.y === y) ? 'snake' : ''} ${food.x === x && food.y === y ? 'food' : ''}`}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              />
            ))}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="game-over">
          <h2>游戏结束!</h2>
          <button onClick={resetGame}>重新开始</button>
        </div>
      )}
    </div>
  );
}

export default App;