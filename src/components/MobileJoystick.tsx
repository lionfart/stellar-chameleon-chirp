import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface MobileJoystickProps {
  onMove: (x: number, y: number) => void;
  onStop: () => stop;
}

const JOYSTICK_SIZE = 80; // Boyut küçültüldü
const KNOB_SIZE = 48; // Boyut küçültüldü
const MAX_DISTANCE = (JOYSTICK_SIZE - KNOB_SIZE) / 2;

const MobileJoystick: React.FC<MobileJoystickProps> = ({ onMove, onStop }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });
  const startTouch = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      setIsDragging(true);
      startTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !startTouch.current || !containerRef.current) return;
    e.preventDefault();

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    const dx = touchX - startTouch.current.x;
    const dy = touchY - startTouch.current.y;

    const distance = Math.min(MAX_DISTANCE, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);

    const newKnobX = distance * Math.cos(angle);
    const newKnobY = distance * Math.sin(angle);

    setKnobPosition({ x: newKnobX, y: newKnobY });

    const normalizedX = newKnobX / MAX_DISTANCE;
    const normalizedY = newKnobY / MAX_DISTANCE;
    onMove(normalizedX, normalizedY);
  }, [isDragging, onMove]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setKnobPosition({ x: 0, y: 0 });
    startTouch.current = null;
    onStop();
  }, [onStop]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute bottom-4 left-4 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center touch-none", // Konum güncellendi
        `w-[${JOYSTICK_SIZE}px] h-[${JOYSTICK_SIZE}px]`
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        ref={knobRef}
        className={cn(
          "rounded-full bg-blue-500/70 border border-blue-400 shadow-lg",
          `w-[${KNOB_SIZE}px] h-[${KNOB_SIZE}px]`,
          isDragging ? "opacity-100" : "opacity-70"
        )}
        style={{
          transform: `translate(${knobPosition.x}px, ${knobPosition.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      />
    </div>
  );
};

export default MobileJoystick;