import { useEffect, useState, useRef } from 'react';
import { cn } from '../../lib/utils';

interface RainGaugeProps {
  percentage: number;
  size?: number;
  className?: string;
}

export function RainGauge({ 
  percentage, 
  size = 300, 
  className 
}: RainGaugeProps) {
  const gaugeRef = useRef<HTMLDivElement>(null);
  const [fillHeight, setFillHeight] = useState("0%");
  
  useEffect(() => {
    const root = document.documentElement;
    const newHeight = `${percentage}%`;
    
    // Set CSS variable for animation
    root.style.setProperty('--fill-level', newHeight);
    
    // Smoothly transition to new height
    setTimeout(() => {
      setFillHeight(newHeight);
    }, 50);
  }, [percentage]);
  
  return (
    <div className={cn("relative mx-auto", className)} style={{ width: size, height: size }}>
      <div 
        className="absolute inset-0 rounded-full border-8 border-border overflow-hidden liquid-container"
        ref={gaugeRef}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        role="progressbar"
      >
        <div 
          className="liquid-fill" 
          style={{ height: fillHeight }}
        />
        
        {/* Percentage text in the middle */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
          {percentage}%
        </div>
        
        {/* Gauge markings */}
        <div className="absolute inset-0">
          {[0, 25, 50, 75].map((mark) => (
            <div 
              key={mark} 
              className="absolute w-full text-xs font-medium"
              style={{ 
                bottom: `${mark}%`, 
                left: 0, 
                transform: 'translateY(50%)' 
              }}
            >
              <span className="absolute left-4">{mark}%</span>
              <span className="absolute right-4">{mark}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}