import { Stage, Container, Sprite, Text } from "@pixi/react";
import { useEffect, useMemo, useState } from "react";

export const Game = () => {
  const [characterY, setCharacterY] = useState(270);
  const [characterX, setCharacterX] = useState(400);
  const [keysPressed, setKeysPressed] = useState({});
  const [velocityY, setVelocityY] = useState(0);
  
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingTop, setIsMovingTop] = useState(false);

  const animationFramesWalk = [
    '/assets/personagem/Orc_Berserk/walk/Walk1.png', 
    '/assets/personagem/Orc_Berserk/walk/Walk3.png',
    '/assets/personagem/Orc_Berserk/walk/Walk4.png',
    '/assets/personagem/Orc_Berserk/walk/Walk5.png',
    '/assets/personagem/Orc_Berserk/walk/Walk6.png',
    '/assets/personagem/Orc_Berserk/walk/Walk7.png',
    // Adicione os caminhos para os demais quadros da animação
  ];
  const animationFramesWalkBack = [
    '/assets/personagem/Orc_Berserk/walkBack/WalkBack1.png', 
    '/assets/personagem/Orc_Berserk/walkBack/WalkBack3.png',
    '/assets/personagem/Orc_Berserk/walkBack/WalkBack4.png',
    '/assets/personagem/Orc_Berserk/walkBack/WalkBack5.png',
    '/assets/personagem/Orc_Berserk/walkBack/WalkBack6.png',
    '/assets/personagem/Orc_Berserk/walkBack/WalkBack7.png',
    // Adicione os caminhos para os demais quadros da animação
  ];
  const animationFramesJump = [
    '/assets/personagem/Orc_Berserk/jump/Jump1.png', 
    '/assets/personagem/Orc_Berserk/jump/Jump2.png', 
    '/assets/personagem/Orc_Berserk/jump/Jump3.png', 
    '/assets/personagem/Orc_Berserk/jump/Jump4.png', 
    '/assets/personagem/Orc_Berserk/jump/Jump5.png', 
    
    // Adicione os caminhos para os demais quadros da animação
  ];


  useEffect(() => {
    const frameDuration = 100; // Duração de cada quadro em milissegundos
    let frameTimer = null;
  
    const updateAnimationFrame = () => {
      if(isMovingRight || isMovingLeft){
        setCurrentFrame((prevFrame) => (prevFrame + 1) % animationFramesWalk.length);
      }
      frameTimer = setTimeout(updateAnimationFrame, frameDuration);
    };
  
    frameTimer = setTimeout(updateAnimationFrame, frameDuration);
  
    return () => clearTimeout(frameTimer);
  }, [isMovingRight, isMovingLeft]);
  
  //GRAVIDADE (FALTA MEXER NO PULO E ARRUMAR A GRAVIDADE)
  useEffect(() => {
    const gravity = 0.5; // Ajuste o valor conforme necessário
    const updatePosition = () => {
      setVelocityY((prevVelocityY) => prevVelocityY + gravity);
      setCharacterY((prevCharacterY) => prevCharacterY + velocityY);
    };

    const animationId = requestAnimationFrame(updatePosition);

    return () => cancelAnimationFrame(animationId);
  }, []);

  // EVENT E LISTENERS DE MOVIMENTO AWSD
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "KeyD") {
        setIsMovingRight(true);
      }
      if (event.code === "KeyA") {
        setIsMovingLeft(true);
      }
      if (event.code === "KeyW") {
        setIsMovingTop(false);
        console.log(isMovingTop)
      }
      setKeysPressed((prevKeysPressed) => ({
        ...prevKeysPressed,
        [event.code]: true,
      }));
    };

    const handleKeyUp = (event) => {
      if (event.code === "KeyD") {
        setIsMovingRight(false);
      }
      if (event.code === "KeyA") {
        setIsMovingLeft(false);
      }
      if (event.code === "KeyW") {
        setIsMovingTop(true);
        setCharacterY(characterY - velocityY)
      }
      setKeysPressed((prevKeysPressed) => ({
        ...prevKeysPressed,
        [event.code]: false,
      }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isMovingTop]);

  useEffect(() => {
    const characterSpeed = 10 // Ajuste a velocidade conforme necessário
  
    const updateCharacterPosition = () => {
      setCharacterX((prevCharacterX) =>
        keysPressed["KeyA"] ? prevCharacterX - characterSpeed : prevCharacterX
      );
      setCharacterX((prevCharacterX) =>
        keysPressed["KeyD"] ? prevCharacterX + characterSpeed : prevCharacterX

      );
      setCharacterY((prevCharacterY) =>
        keysPressed["KeyW"] ? prevCharacterY - 50 : prevCharacterY
      );
      setCharacterY((prevCharacterY) =>
        keysPressed["KeyS"] ? prevCharacterY + characterSpeed : prevCharacterY
      );
    };
  
    const animationId = requestAnimationFrame(updateCharacterPosition);
  
    return () => cancelAnimationFrame(animationId);
  }, [keysPressed]);
  

  return (
    <Stage>
      <Sprite
        image={isMovingRight ? animationFramesWalk[currentFrame] : isMovingLeft ? animationFramesWalkBack[currentFrame] : isMovingTop ? animationFramesJump[currentFrame]  : '/assets/personagem/Orc_Berserk/Hurt.png' }
        x={characterX}
        y={characterY}
        anchor={{ x: 0.5, y: 0.5 }}
      />
    </Stage>
  );
};
