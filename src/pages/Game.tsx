import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { Typography, Box, LinearProgress } from "@mui/material";
import {
  Battery20,
  Battery50,
  Battery80,
  BatteryFull,
} from "@mui/icons-material";
import Typewriter from "typewriter-effect";

const GameContainer = styled(Box)({
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  background: "#191919",
  position: "relative",
});

const GameCanvas = styled("canvas")({
  background:
    'url("https://marclopezavila.github.io/planet-defense-game/img/space.jpg") no-repeat center center',
  backgroundSize: "cover",
  width: "100%",
  height: "100%",
  cursor: "default",
  "&.playing": {
    cursor:
      'url("https://marclopezavila.github.io/planet-defense-game/img/aim_red.png") 17.5 17.5, auto !important',
  },
});

const IntroOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f1624 0%, #1b2836 100%)",
  color: "white",
  padding: "10px",
  zIndex: 10,
});

const StartButton = styled(Typography)({
  cursor: "pointer",
  padding: "10px 20px",
  border: "2px solid white",
  borderRadius: "5px",
  transition: "all 0.3s",
  "&:hover": {
    background: "white",
    color: "black",
  },
});

const LifeBar = styled(Box)({
  position: "absolute",
  top: 20,
  left: 20,
  display: "flex",
  alignItems: "center",
  color: "white",
});

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [gameState, setGameState] = useState({
    playing: false,
    gameOver: false,
    destroyed: 0,
    record: 0,
    life: 100,
  });

  // Audio refs
  const shootSoundRef = useRef<HTMLAudioElement | null>(null);
  const explosionSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  const playerMovementRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    shootSoundRef.current = new Audio("/lazer.mp3");
    explosionSoundRef.current = new Audio("/explode.mp3");
    gameOverSoundRef.current = new Audio("/game-over.mp3");
    backgroundMusicRef.current = new Audio("/bg.mp3");

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.loop = true;
    }

    // Clean up function
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    };
  }, []);
  useEffect(() => {
    if (showIntro) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const sprite = new Image();
    const spriteExplosion = new Image();
    sprite.src =
      "https://marclopezavila.github.io/planet-defense-game/img/sprite.png";
    spriteExplosion.src =
      "https://marclopezavila.github.io/planet-defense-game/img/explosion.png";

    let bullets: any[] = [];
    let asteroids: any[] = [];
    let explosions: any[] = [];
    let destroyed = 0;
    let record = gameState.record;
    let life = 100;

    const planet = { deg: 0 };

    const player = {
      posX: -35,
      posY: -(100 + 82),
      width: 70,
      height: 79,
      deg: 0,
    };

    const random = (from: number, to: number) =>
      Math.floor(Math.random() * (to - from + 1)) + from;

    const action = (e: MouseEvent) => {
      e.preventDefault();
      if (gameState.playing) {
        const bullet = {
          x: -8,
          y: -179,
          sizeX: 2,
          sizeY: 10,
          realX: e.offsetX,
          realY: e.offsetY,
          dirX: e.offsetX,
          dirY: e.offsetY,
          deg: Math.atan2(
            e.offsetX - canvas.width / 2,
            -(e.offsetY - canvas.height / 2)
          ),
          destroyed: false,
        };
        bullets.push(bullet);
      }
    };

    const move = (e: MouseEvent) => {
      player.deg = Math.atan2(
        e.offsetX - canvas.width / 2,
        -(e.offsetY - canvas.height / 2)
      );
    };

    const fire = () => {
      let distance;

      for (let i = 0; i < bullets.length; i++) {
        if (!bullets[i].destroyed) {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(bullets[i].deg);

          ctx.drawImage(
            sprite,
            211,
            100,
            50,
            75,
            bullets[i].x,
            (bullets[i].y -= 20),
            19,
            30
          );

          ctx.restore();

          bullets[i].realX = 0 - (bullets[i].y + 10) * Math.sin(bullets[i].deg);
          bullets[i].realY = 0 + (bullets[i].y + 10) * Math.cos(bullets[i].deg);

          bullets[i].realX += canvas.width / 2;
          bullets[i].realY += canvas.height / 2;

          for (let j = 0; j < asteroids.length; j++) {
            if (!asteroids[j].destroyed) {
              distance = Math.sqrt(
                Math.pow(asteroids[j].realX - bullets[i].realX, 2) +
                  Math.pow(asteroids[j].realY - bullets[i].realY, 2)
              );

              if (
                distance <
                asteroids[j].width / asteroids[j].size / 2 - 4 + (19 / 2 - 4)
              ) {
                destroyed += 1;
                asteroids[j].destroyed = true;
                bullets[i].destroyed = true;
                explosions.push(asteroids[j]);
              }
            }
          }
        }
      }
    };

    const drawPlanet = () => {
      ctx.save();
      ctx.fillStyle = "white";
      ctx.shadowBlur = 100;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowColor = "#999";

      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
      ctx.fill();

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((planet.deg += 0.1) * (Math.PI / 180));
      ctx.drawImage(sprite, 0, 0, 200, 200, -100, -100, 200, 200);
      ctx.restore();
    };

    const drawPlayer = () => {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      ctx.rotate(player.deg);
      ctx.drawImage(
        sprite,
        200,
        0,
        player.width,
        player.height,
        player.posX,
        player.posY,
        player.width,
        player.height
      );

      ctx.restore();

      if (bullets.length - destroyed && gameState.playing) {
        fire();
      }
    };

    const newAsteroid = () => {
      const type = random(1, 4);
      let coordsX, coordsY;

      switch (type) {
        case 1:
          coordsX = random(0, canvas.width);
          coordsY = 0 - 150;
          break;
        case 2:
          coordsX = canvas.width + 150;
          coordsY = random(0, canvas.height);
          break;
        case 3:
          coordsX = random(0, canvas.width);
          coordsY = canvas.height + 150;
          break;
        case 4:
          coordsX = 0 - 150;
          coordsY = random(0, canvas.height);
          break;
        default:
          return;
      }

      const asteroid = {
        x: 278,
        y: 0,
        state: 0,
        stateX: 0,
        width: 134,
        height: 123,
        realX: coordsX,
        realY: coordsY,
        moveY: 0,
        coordsX: coordsX,
        coordsY: coordsY,
        size: random(1, 3),
        deg: Math.atan2(
          coordsX - canvas.width / 2,
          -(coordsY - canvas.height / 2)
        ),
        destroyed: false,
      };
      asteroids.push(asteroid);
    };

    const drawAsteroids = () => {
      let distance;

      for (let i = 0; i < asteroids.length; i++) {
        if (!asteroids[i].destroyed) {
          ctx.save();
          ctx.translate(asteroids[i].coordsX, asteroids[i].coordsY);
          ctx.rotate(asteroids[i].deg);

          ctx.drawImage(
            sprite,
            asteroids[i].x,
            asteroids[i].y,
            asteroids[i].width,
            asteroids[i].height,
            -(asteroids[i].width / asteroids[i].size) / 2,
            (asteroids[i].moveY += 1 / asteroids[i].size),
            asteroids[i].width / asteroids[i].size,
            asteroids[i].height / asteroids[i].size
          );

          ctx.restore();

          asteroids[i].realX =
            0 -
            (asteroids[i].moveY + asteroids[i].height / asteroids[i].size / 2) *
              Math.sin(asteroids[i].deg);
          asteroids[i].realY =
            0 +
            (asteroids[i].moveY + asteroids[i].height / asteroids[i].size / 2) *
              Math.cos(asteroids[i].deg);

          asteroids[i].realX += asteroids[i].coordsX;
          asteroids[i].realY += asteroids[i].coordsY;

          distance = Math.sqrt(
            Math.pow(asteroids[i].realX - canvas.width / 2, 2) +
              Math.pow(asteroids[i].realY - canvas.height / 2, 2)
          );

          if (distance < asteroids[i].width / asteroids[i].size / 2 - 4 + 100) {
            life -= 5;
            asteroids[i].destroyed = true;
            explosions.push(asteroids[i]);
            setGameState((prev) => ({ ...prev, life }));
          }
        } else if (!asteroids[i].extinct) {
          explosion(asteroids[i]);
        }
      }

      if (asteroids.length - destroyed < 10 + Math.floor(destroyed / 6)) {
        newAsteroid();
      }
    };

    const explosion = (asteroid: any) => {
      ctx.save();
      ctx.translate(asteroid.realX, asteroid.realY);
      ctx.rotate(asteroid.deg);

      let spriteY,
        spriteX = 256;
      if (asteroid.state === 0) {
        spriteY = 0;
        spriteX = 0;
      } else if (asteroid.state < 8) {
        spriteY = 0;
      } else if (asteroid.state < 16) {
        spriteY = 256;
      } else if (asteroid.state < 24) {
        spriteY = 512;
      } else {
        spriteY = 768;
      }

      if (
        asteroid.state === 8 ||
        asteroid.state === 16 ||
        asteroid.state === 24
      ) {
        asteroid.stateX = 0;
      }

      ctx.drawImage(
        spriteExplosion,
        (asteroid.stateX += spriteX),
        spriteY,
        256,
        256,
        -(asteroid.width / asteroid.size) / 2,
        -(asteroid.height / asteroid.size) / 2,
        asteroid.width / asteroid.size,
        asteroid.height / asteroid.size
      );
      asteroid.state += 1;
      if (asteroid.state === 1) {
        // Play explosion sound at the start of the explosion animation
        if (explosionSoundRef.current) {
          explosionSoundRef.current.currentTime = 0;
          explosionSoundRef.current.play();
        }
      }
      if (asteroid.state === 31) {
        asteroid.extinct = true;
      }

      ctx.restore();
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (life <= 0) {
        setGameState((prev) => ({
          ...prev,
          gameOver: true,
          playing: false,
          record: Math.max(destroyed, prev.record),
        }));
        return;
      }

      drawPlanet();
      drawPlayer();

      if (gameState.playing) {
        drawAsteroids();

        ctx.font = "20px Verdana";
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.fillText("Record: " + record + "", 20, 30);

        ctx.font = "40px Verdana";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeText(
          "" + destroyed + "",
          canvas.width / 2,
          canvas.height / 2
        );
        ctx.fillText("" + destroyed + "", canvas.width / 2, canvas.height / 2);
      } else {
        ctx.drawImage(
          sprite,
          428,
          12,
          70,
          70,
          canvas.width / 2 - 35,
          canvas.height / 2 - 35,
          70,
          70
        );
      }

      requestAnimationFrame(gameLoop);
    };

    canvas.addEventListener("click", action);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    setGameState((prev) => ({ ...prev, playing: true }));
    gameLoop();

    return () => {
      canvas.removeEventListener("click", action);
      canvas.removeEventListener("mousemove", move);
      window.removeEventListener("resize", () => {});
    };
  }, [showIntro, gameState.playing, gameState.gameOver]);

  const startGame = () => {
    setShowIntro(false);
    setGameState((prev) => ({
      ...prev,
      playing: true,
      gameOver: false,
      destroyed: 0,
      life: 100,
      planetInvasion: 0,
    }));

    // Start background music when the game starts
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.play();
    }
  };

  const restartGame = () => {
    setGameState((prev) => ({
      ...prev,
      playing: true,
      gameOver: false,
      destroyed: 0,
      life: 100,
      planetInvasion: 0,
    }));

    // Restart background music
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current.play();
    }
  };
  const getLifeIcon = (life: number) => {
    if (life > 75) return <BatteryFull />;
    if (life > 50) return <Battery80 />;
    if (life > 25) return <Battery50 />;
    return <Battery20 />;
  };

  return (
    <GameContainer>
      {showIntro ? (
        <IntroOverlay>
          <Typography variant="h2" gutterBottom>
            Cosmos Crusade
          </Typography>
          <Typewriter
            options={{
              strings: [
                "Defend your planet from incoming asteroids!",
                "Use your mouse to aim and click to shoot.",
                "How long can you protect Earth?",
              ],
              autoStart: true,
              loop: true,
            }}
          />
          <Box mt={4}>
            <StartButton variant="button" onClick={startGame}>
              Start Game
            </StartButton>
          </Box>
        </IntroOverlay>
      ) : (
        <>
          <GameCanvas
            ref={canvasRef}
            className={gameState.playing ? "playing" : ""}
          />
          <LifeBar>
            {getLifeIcon(gameState.life)}
            <LinearProgress
              variant="determinate"
              value={gameState.life}
              sx={{
                width: 100,
                ml: 1,
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
            />
          </LifeBar>
          {gameState.gameOver && (
            <IntroOverlay>
              <Typography variant="h2" gutterBottom>
                Game Over
              </Typography>
              <Typography variant="h4" gutterBottom>
                Asteroids Destroyed: {gameState.destroyed}
              </Typography>
              <Typography variant="h4" gutterBottom>
                Record: {gameState.record}
              </Typography>
              <Box mt={4}>
                <StartButton variant="button" onClick={restartGame}>
                  Play Again
                </StartButton>
              </Box>
            </IntroOverlay>
          )}
        </>
      )}
    </GameContainer>
  );
};

export default Game;
