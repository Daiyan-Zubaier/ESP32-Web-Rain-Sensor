import { useEffect, useState } from "react";

interface RainDrop {
  id: number;
  left: number;
  delay: number;
  size: number;
  opacity: number;
  duration: number;
}

export function RainDrops({ intensity = 0.5 }) {
  const [raindrops, setRaindrops] = useState<RainDrop[]>([]);
  
  useEffect(() => {
    // Adjust number of raindrops based on intensity
    const numberOfDrops = Math.floor(intensity * 20);
    
    if (numberOfDrops <= 0) return;
    
    const newDrops: RainDrop[] = [];
    
    for (let i = 0; i < numberOfDrops; i++) {
      newDrops.push({
        id: Math.random(),
        left: Math.random() * 100, // position across screen (%)
        delay: Math.random() * 2, // random delay
        size: Math.random() * 10 + 5, // random size between 5-15px
        opacity: Math.random() * 0.6 + 0.2, // random opacity
        duration: Math.random() * 3 + 1, // random animation duration
      });
    }
    
    setRaindrops(newDrops);
    
    const interval = setInterval(() => {
      setRaindrops(prev => {
        const updated = [...prev];
        
        // Replace a random raindrop
        const indexToReplace = Math.floor(Math.random() * updated.length);
        
        if (updated[indexToReplace]) {
          updated[indexToReplace] = {
            id: Math.random(),
            left: Math.random() * 100,
            delay: 0,
            size: Math.random() * 10 + 5,
            opacity: Math.random() * 0.6 + 0.2,
            duration: Math.random() * 3 + 1,
          };
        }
        
        return updated;
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [intensity]);
  
  if (intensity < 0.1) return null;
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {raindrops.map(drop => (
        <div
          key={drop.id}
          className="absolute animate-rain-drop"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            opacity: drop.opacity,
          }}
        >
          <svg 
            width={drop.size} 
            height={drop.size * 1.5} 
            viewBox="0 0 16 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M8 0C8 0 16 14.1176 16 17.6471C16 21.1765 12.4183 24 8 24C3.58172 24 0 21.1765 0 17.6471C0 14.1176 8 0 8 0Z" 
              fill="currentColor" 
              fillOpacity="0.6" 
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
