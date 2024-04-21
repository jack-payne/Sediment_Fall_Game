import React, { useState, useRef, useEffect } from 'react';
import './Game.css';
import { useNavigate } from 'react-router-dom';
const sedimentTypes = ['Gravel', 'Coarse Sand', 'Fine Sand', 'Clay/Silt'];

class Sprite {
  constructor({position, width, height, imageSrc, scale = 1, framesMax = 1, imageOffset = {x:0, y:0}, c, onImageLoad}){
    this.position = position;
    this.image = new Image();
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.imageOffset = imageOffset;
    this.c = c;
    this.image.onload = () => {
      if (onImageLoad) onImageLoad();
    };
    this.image.src = imageSrc;
  }

  draw(){
    this.c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.imageOffset.x,
      this.position.y - this.imageOffset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames(){
    this.framesElapsed++;
    if(this.framesElapsed % this.framesHold === 0){
      if(this.framesCurrent < this.framesMax - 1){
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
  
  update(){
    this.draw();
    this.animateFrames();
  }
  setImageSrc(imageSrc) {
    this.image.src = imageSrc;
    this.image.onload = () => {
      if (this.onImageLoad) this.onImageLoad();
    };
  }
}

function Game() {
  const canvasRef = useRef(null);
  let navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const playerSprite = useRef(null);
  const squarePosition = useRef({ x: 150, y: 550, size: 50 });
  const [sedimentCounts, setSedimentCounts] = useState({ Gravel: 0, 'Coarse Sand': 0, 'Fine Sand': 0, 'Clay/Silt': 0 });
  const [lastKeyPressed, setLastKeyPressed] = useState('left');
  const moveLeft = useRef(false);
  const moveRight = useRef(false);

  const totalSedimentsCaught = Object.values(sedimentCounts).reduce((total, count) => total + count, 0);

  if (totalSedimentsCaught >= 25) {
    navigate('/partTwo', { state: { sedimentCounts } });
  }

  useEffect(() => {
    const loadImages = async () => {
      const srcs = ['./sprites/Dude_Monster_Idle_4.png', './sprites/science_idle.png', './sprites/sciencerun.png', './sprites/sciencerun2.png', './sprites/science_idle_2.png'];
      await Promise.all(srcs.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      }));
      setGameStarted(true);
    };
  
    loadImages();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !gameStarted) return;
    const canvas = canvasRef.current;
    const c = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 600;

    const backgroundImage = new Image();
    backgroundImage.src = './background.jpg';
    backgroundImage.onload = () => {
  
      c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    };

    canvas.style.border = '3px solid black';
    let particlesArray = [];
    const playerSprite = new Sprite({
      position: { x: 250, y: 500 },
      imageSrc: './sprites/Dude_Monster_Idle_4.png', 
      scale: 3,
      framesMax: 4,
      width: 50,
      imageOffset: { x: 25, y: 50 },
      c: c
    });


    const generateParticles = () => {
      particlesArray = [];
      for (let i = 0; i < 15; i++) {
        const typeIndex = Math.floor(Math.random() * sedimentTypes.length);
        const type = sedimentTypes[typeIndex];
        let size;
        switch (type) {
          case 'Gravel': size = Math.random() * 5 + 3; break;
          case 'Coarse Sand': size = Math.random() * 7 + 2; break;
          case 'Fine Sand': size = Math.random() * 9 + 1; break;
          case 'Clay/Silt': size = Math.random() * 7 + 3; break;
          default: size = Math.random() * 5 + 2;
        }
        particlesArray.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          speed: Math.random() * 1 + 0.5,
          type
        });
      }
    };

  const detectCollision = (particle) => {
   
    const playerSize = 50; 
  
    return particle.x < playerSprite.position.x + playerSize &&
           particle.x + particle.size > playerSprite.position.x &&
           particle.y < playerSprite.position.y + playerSize &&
           particle.y + particle.size > playerSprite.position.y;
  };

  const animate = () => {
    if (!gameStarted) return; 
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    playerSprite.update();
    updateMovement();

    
    particlesArray.forEach((particle, index) => {
      if (!detectCollision(particle)) {
        const colors = {
          'Gravel': 'rgba(255, 165, 0, 0.8)',
          'Coarse Sand': 'rgba(139, 69, 19, 0.8)',
          'Fine Sand': 'rgba(255, 255, 0, 0.8)',
          'Clay/Silt': 'rgba(173, 216, 230, 0.8)'
        };

        c.fillStyle = colors[particle.type] || 'rgba(255, 255, 255, 0.8)';
        c.beginPath();
        c.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        c.fill();
        particle.y += particle.speed;
        if (particle.y > canvas.height) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }
      } else {
        setSedimentCounts(prevCounts => ({
          ...prevCounts,
          [particle.type]: prevCounts[particle.type] + 1
        }));
        particle.y = -particle.size;
        particle.x = Math.random() * canvas.width;
      }
    });
  };
  
    const updateMovement = () => {
      if (!playerSprite || !canvasRef.current) return;
      let newImageSrc = './sprites/science_idle.png';
      let framesMax = 4; 
      
      if (moveLeft.current) {
      
        playerSprite.position.x -= 10; 
        newImageSrc = './sprites/sciencerun2.png'; 
        framesMax = 8; 

      } else if (moveRight.current) {
       
        playerSprite.position.x += 10; 
        newImageSrc = './sprites/sciencerun.png'; 
        framesMax = 8;
       
      } else {
       
        if (lastKeyPressed.current === 'left') {
          newImageSrc = './sprites/science_idle_2.png'; 
        } else if (lastKeyPressed.current === 'right') {
          
          newImageSrc = './sprites/science_idle.png';
        }
      }
      playerSprite.position.x = Math.max(0, Math.min(canvasRef.current.width - playerSprite.width, playerSprite.position.x));
    
      if (playerSprite.imageSrc !== newImageSrc) {
        playerSprite.setImageSrc(newImageSrc);
        playerSprite.framesMax = framesMax;
      }
    };


    const handleKeyDown = (e) => {
      if (e.key === 'a') {
        moveLeft.current = true;
        console.log(`Current Image: ${playerSprite.imageSrc}, Frame: ${playerSprite.framesCurrent}`);
      } else if (e.key === 'd') {
        moveRight.current = true;
        console.log(`Current Image: ${playerSprite.imageSrc}, Frame: ${playerSprite.framesCurrent}`);
        
      }
      
    };
  
    const handleKeyUp = (e) => {
      if (e.key === 'a') {
        setLastKeyPressed('right');
        moveLeft.current = false;
       
      } else if (e.key === 'd') {
        setLastKeyPressed('left');
        moveRight.current = false;
        
      }
      
    };    

    generateParticles();
    animate();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      
    };
  }, [gameStarted]);

  const handleStart = () => {
    setGameStarted(true);
  };


  return (
    <div className="App">
      {!gameStarted ? (
        <>
          <div className="instructions">
            <p>Welcome to Sediment Catcher!</p>
            <p>Move your character left or right using 'A' and 'D' keys to catch falling sediments. All sediments give you points. Collect 25 points to progress to the next part of the game.</p>
          </div>
          <button onClick={handleStart} className="start-button">Start Game</button>
        </>
      ) : (
        <div className="App-header">
          <h1 className="game-title">Sediment Catcher</h1>
          <div className="align">
            <canvas ref={canvasRef} className="Gamecanvas"></canvas>
            <div className="sediment-counts">
              {Object.entries(sedimentCounts).map(([type, count]) => (
                <p key={type}>{type}: {count}</p>
              ))}
              <p>Collect 300 to progress!!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default Game;
