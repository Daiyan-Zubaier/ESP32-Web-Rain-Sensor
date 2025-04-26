import { ThemeProvider, useTheme } from "../components/theme/ThemeProvider";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import { RainStatus } from "../components/rain/RainStatus";
import { RainGauge } from "../components/rain/RainGauge";
 // import { RainHistory } from "../components/rain/RainHistory";
import { RainDrops } from "../components/rain/RainDrops";
import { Card } from "../components/ui/card";
import { useRainData } from "../hooks/use-rain-data";
import { toast } from "sonner";
import { useEffect } from "react";

// Create a wrapper component that uses the theme context
const RainDashboard = () => {
  const { currentRain, history, error, isLoading } = useRainData();
  const { theme } = useTheme();
  
  // Update background color based on rain percentage and theme
  useEffect(() => {
    let bgBaseColor, gradientColor, overlayColor;
    
    // Set colors based on rain percentage
    if (currentRain < 30) {
      bgBaseColor = theme === 'dark' ? '#0f0f12' : '#f5f5f5';
      gradientColor = theme === 'dark' ? 'rgba(249, 217, 35, 0.05)' : 'rgba(249, 217, 35, 0.15)';
      overlayColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.8)';
    } else if (currentRain < 70) {
      bgBaseColor = theme === 'dark' ? '#0d1219' : '#eef5ff';
      gradientColor = theme === 'dark' ? 'rgba(54, 162, 235, 0.08)' : 'rgba(54, 162, 235, 0.2)';
      overlayColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.75)';
    } else {
      bgBaseColor = theme === 'dark' ? '#090d18' : '#edf0ff';
      gradientColor = theme === 'dark' ? 'rgba(76, 81, 191, 0.12)' : 'rgba(76, 81, 191, 0.25)';
      overlayColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.7)';
    }
    
    document.body.style.backgroundColor = bgBaseColor;
    document.body.style.backgroundImage = `
      linear-gradient(to bottom, ${gradientColor}, ${overlayColor}),
      radial-gradient(circle at 50% 50%, ${gradientColor}, transparent 80%)
    `;
    
    document.body.classList.add('bg-transition');
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
    };
  }, [currentRain, theme]);
  
  // Show error toast if needed
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="scroll-snap-container">
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <RainDrops intensity={currentRain / 100} />
      
      {/* Hero Section */}
      <section className="rain-section">
        <div className="container max-w-5xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse flex flex-col items-center space-y-8">
              <div className="h-64 w-64 bg-muted rounded-full"></div>
              <div className="h-12 w-48 bg-muted rounded"></div>
            </div>
          ) : (
            <RainStatus percentage={currentRain} />
          )}
        </div>
      </section>
      
      {/* Gauge and History Section */}
      <section className="rain-section">
        <div className="container max-w-6xl mx-auto flex justify-center">
          <Card className="p-8 backdrop-blur-sm bg-card/90">
            <h2 className="text-3xl font-medium text-center mb-8">Current Reading</h2>
            {isLoading ? (
              <div className="animate-pulse h-64 w-64 bg-muted rounded-full mx-auto"></div>
            ) : (
              <RainGauge percentage={currentRain} />
            )}
          </Card>
          
        </div>
      </section>
    </div>
  );
};

// Main component that sets up the ThemeProvider
const Index = () => {
  return (
    <ThemeProvider defaultTheme="dark">
      <RainDashboard />
    </ThemeProvider>
  );
};

export default Index;