import { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface RainStatusProps {
  percentage: number;
  className?: string;
}

export function RainStatus({ percentage, className }: RainStatusProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [status, setStatus] = useState('Dry');
  const prevPercentage = useRef(0);
  
  // Status text based on percentage
  useEffect(() => {
    if (percentage < 25) {
      setStatus('Dry');
    } else if (percentage < 50) {
      setStatus('Slightly Wet');
    } else if (percentage < 75) {
      setStatus('Wet');
    } else {
      setStatus('Very Wet');
    }
    
    // Animate count up from previous value
    const duration = 500; // ms
    const startTime = Date.now();
    const startValue = prevPercentage.current;
    
    const animateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(startValue + (percentage - startValue) * progress);
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        prevPercentage.current = percentage;
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [percentage]);
  
  return (
    <div className={cn("text-center", className)}>
      <div className="overflow-hidden">
        <h1 
          aria-live="polite"
          aria-label={`Current rain level: ${displayValue}%`}
          className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold leading-none tracking-tighter text-gradient"
        >
          {displayValue}
          <span className="text-[4rem] md:text-[6rem] align-top">%</span>
        </h1>
      </div>
      <h2 
        className="text-4xl md:text-5xl font-medium animate-fade-in animate-stagger-1"
        aria-live="polite"
      >
        {status}
      </h2>
    </div>
  );
}