import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './partTwo.css';
import Draggable from 'react-draggable';
function PartTwo() {
    const canvasRef = useRef(null);
    const [showCorrectPopup, setShowCorrectPopup] = useState(false);
    const location = useLocation();
    const [isRotated, setIsRotated] = useState(false);
    const imagePath = '/bucket.png';

    const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(new Image());
  const navigate = useNavigate();
  
    const { sedimentCounts } = location.state || { sedimentCounts: { Gravel: 0, 'Coarse Sand': 0, 'Fine Sand': 0, 'Clay/Silt': 0 } };
    
    const [shaken, setShaken] = useState(false);
    const sedimentTypes = ['Gravel', 'Coarse Sand', 'Fine Sand', 'Clay/Silt'];
    const [particles, setParticles] = useState([]);
   
    const [matched, setMatched] = useState({
      'Clay/Silt': false,
      'Fine Sand': false,
      'Gravel': false,
      'Coarse Sand': false
    });
    const [visibility, setVisibility] = useState({
      Gravel: true,
      'Coarse Sand': true,
      'Fine Sand': true,
      'Clay/Silt': true,
    });
    const sedimentSizeMapping = {
      Gravel: '2-4 mm',
      'Coarse Sand': '250μm – 2 mm',
      'Fine Sand': '63–150 μm',
      'Clay/Silt': 'Less than 63 μm',
    };
    const [attempted, setAttempted] = useState({
      'Clay/Silt': false,
      'Fine Sand': false,
      'Gravel': false,
      'Coarse Sand': false
    });
    const [currentDrag, setCurrentDrag] = useState(null);

    const targetRefs = useRef(Object.keys(matched).reduce((acc, type) => {
      acc[type] = React.createRef();
      return acc;
  }, {}));

  const sedimentColors = {
    'Gravel': 'rgba(255, 165, 0, 0.8)',      // Orange
    'Coarse Sand': 'rgba(139, 69, 19, 0.8)', // Brown
    'Fine Sand': 'rgba(255, 255, 0, 0.8)',   // Yellow
    'Clay/Silt': 'rgba(173, 216, 230, 0.8)'  // Light Blue
  };
  

 
const [showIncorrectPopup, setShowIncorrectPopup] = useState(false);
const [limitReachedMessage, setLimitReachedMessage] = useState('');
const [failedAttempts, setFailedAttempts] = useState({});
const [stars, setStars] = useState(1);


const handleRestart = () => {
  navigate('/game'); 
};


useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas || !imageLoaded) return;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  ctx.drawImage(imageRef.current, 0, 0); 
}, [imageLoaded]);


const handleFailure = (type) => {
  setFailedAttempts((prevAttempts) => {
    const newAttempts = (prevAttempts[type] || 0) + 1;
    if (newAttempts === 2) {
      setLimitReachedMessage(`The correct size for ${type} is ${sedimentSizeMapping[type]}.`);
      setTimeout(() => setLimitReachedMessage(''), 5000);
    }
    return { ...prevAttempts, [type]: newAttempts };
  });

  setStars((prevStars) => {
    const newStars = Math.max(prevStars, 0);
    if (newStars === 0) {
      
    }
    return newStars;
  });
   setAttempted((prevAttempted) => ({ ...prevAttempted, [type]: true }));
};

const handleSuccess = (type) => {
  if (!attempted[type]) {
    setStars((prevStars) => Math.min(prevStars + 1, 5));
    setAttempted((prevAttempted) => ({ ...prevAttempted, [type]: true }));

    setShowCorrectPopup(true); 
    setTimeout(() => setShowCorrectPopup(false), 2000); 
  }
};


const handleDragStart = (type, e) => {
  
  if (!shaken || !visibility[type]) {
    e.preventDefault();
    return; 
  }
  setCurrentDrag(type);
};

const handleDragEnd = (e, data, type) => {
  const { clientX, clientY } = e;

  let matchFound = false;
  let droppedOnAnyBox = false;

  Object.entries(targetRefs.current).forEach(([targetType, ref]) => {
    const target = ref.current;
    if (target) {
      const rect = target.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        droppedOnAnyBox = true;

        if (type === targetType) {
          setMatched((prev) => ({ ...prev, [type]: true }));
          setVisibility((prev) => ({ ...prev, [type]: false }));
          matchFound = true;
          handleSuccess(type);
        }
      }
    }
  });

  if (droppedOnAnyBox && !matchFound) {
    console.log('Incorrect match');
    handleFailure(type);
    setShowIncorrectPopup(true);
    setTimeout(() => setShowIncorrectPopup(false), 2000);
  }
};


    

    const handleShake = () => {
        setShaken(true);

        const canvas = canvasRef.current;
        const newParticles = [];
        for (let i = 0; i < 50; i++) {
            const typeIndex = Math.floor(Math.random() * sedimentTypes.length);
            const type = sedimentTypes[typeIndex];
            let size;
            switch (type) {
              case 'Gravel': size = Math.random() * 3 + 2; break;
              case 'Coarse Sand': size = Math.random() * 2 + 1.5; break;
              case 'Fine Sand': size = Math.random() * 1 + 1; break;
              case 'Clay/Silt': size = Math.random() * 0.5 + 0.5; break;
                default: size = Math.random() * 5 + 1;
            }
            newParticles.push({
                id: i,
                x: Math.random() * canvas.width,
                y: -10, 
                size,
                speed: Math.random() * 1 + 0.5,
                type,
                falling: true, 
                visible: true,
            });
        }
    
        setParticles(newParticles); 
       
        
    };
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!canvas) return;
      
        let animationFrameId;
        const canvasHeight = canvas.height;

        const fallLimits = {
          'Gravel': canvasHeight - 215,
          'Coarse Sand': canvasHeight - 145,
          'Fine Sand': canvasHeight - 75,
          'Clay/Silt': canvasHeight,
          };
      
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      
          particles.forEach(particle => {
            
            if (particle.y < fallLimits[particle.type] && particle.falling) {
              particle.y += particle.speed; 
            } else {
              
              particle.falling = false; 
              particle.visible = false;
            }
            if (particle.visible) {
              ctx.fillStyle = sedimentColors[particle.type];
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
            }
          });
      
          animationFrameId = requestAnimationFrame(animate);
        };
      
        animate();
      
        return () => cancelAnimationFrame(animationFrameId);
      }, [particles]);

      
      
      const allMatched = Object.values(matched).every(status => status === true);
    
    
      return (
        <div className="partTwo">
          <div className="sedimentCountsDisplay">
  {Object.entries(sedimentCounts).map(([type, count]) => (
    <p key={type}>{`${type}: ${count}`}</p>
  ))}
</div>
            <p className='textBox'>Press the Shake button to sort the sediments by size, then match them with the correct type. Get all four correct and you win! You lose one star per failed attempt.</p>
            {allMatched && <p className='textBox2'>You Win!</p>}
            {showIncorrectPopup && <div className="popup">Incorrect Match!</div>}
            {showCorrectPopup && <div className="popup correct-popup">Correct Match!</div>}
            {limitReachedMessage && <div className="limit-message">{limitReachedMessage}</div>}
            <div className="stars">Stars: {'★'.repeat(stars) + '☆'.repeat(5 - stars)}</div>
          <div className="gameContainer">
          
            <canvas ref={canvasRef} width="80" height="380" className='partTwoCanvas'></canvas>
            <div className={`storageContainer ${shaken ? 'shaken' : ''}`} 
     style={{
       backgroundImage: `url(${imagePath})`,
       backgroundSize: 'cover',
       backgroundRepeat: 'no-repeat',
       backgroundPosition: 'center',
       backgroundColor: 'transparent'
     }}>
</div>
          </div>
          <div className="contentContainer">
          <div className="sedimentContainer">
  {Object.entries(sedimentCounts).map(([type, count]) => (
    <Draggable
    key={type}
    axis="both"
    handle=".handle"
    defaultPosition={{x: 0, y: 0}}
    scale={0.9}
    onStart={(e) => handleDragStart(type, e)} 
    onStop={(e, data) => handleDragEnd(e, data, type)}
    disabled={!visibility[type] || !shaken}
  >
    <div
      className={`handle sedimentCount ${!visibility[type] ? 'invisible' : ''}`}
      style={{
        color: 'white',
        textAlign: 'center',
        width: '200px',
        height: '30px',
        opacity: visibility[type] ? 1 : 0, 
        pointerEvents: visibility[type] ? 'auto' : 'none'
      }}
    >
      {visibility[type] ? sedimentSizeMapping[type] : ''}
    </div>
  </Draggable>
  ))}
</div>
          </div>
          <button className="shakeButton" onClick={handleShake}>Shake</button>
          <div className='gravel-final'>
          {Object.keys(matched).map((type) => (
              <div
                  key={type}
                  ref={targetRefs.current[type]}
                  className={`gravel-names ${matched[type] ? 'matched' : ''}`}
                 style={{width: '200px', height: '50px', textAlign: 'center'}}
              >
                  {type}
              </div>
          ))}
      </div>
    
           
            <button className="restartButton" onClick={handleRestart}>Restart</button>  
            
        
        </div>
      );
      
}

export default PartTwo;
