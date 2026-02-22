import { useEffect, useRef, useState } from 'react';

interface PixelatedPortraitProps {
  src: string;
  guessCount: number;
  won: boolean;
}

const PIXEL_STEPS = [8, 16, 40, 80];
const DISPLAY_SIZE = 360;

export function PixelatedPortrait({ src, guessCount, won }: PixelatedPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const isFullRes = won || guessCount >= 4;
  const pixelSize = isFullRes ? DISPLAY_SIZE : (PIXEL_STEPS[guessCount] ?? PIXEL_STEPS[PIXEL_STEPS.length - 1]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
    img.src = src;
  }, [src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = DISPLAY_SIZE;
    canvas.height = DISPLAY_SIZE;

    ctx.imageSmoothingEnabled = false;

    if (isFullRes) {
      ctx.drawImage(img, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    } else {
      ctx.drawImage(img, 0, 0, pixelSize, pixelSize);
      ctx.drawImage(canvas, 0, 0, pixelSize, pixelSize, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    }
  }, [imgLoaded, pixelSize, isFullRes]);

  return (
    <div
      style={{
        width: `${DISPLAY_SIZE}px`,
        height: `${DISPLAY_SIZE}px`,
        borderRadius: '6px',
        border: '2px solid var(--color-gold)',
        overflow: 'hidden',
        background: 'var(--color-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        width={DISPLAY_SIZE}
        height={DISPLAY_SIZE}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: isFullRes ? 'auto' : 'pixelated',
        }}
      />
    </div>
  );
}
