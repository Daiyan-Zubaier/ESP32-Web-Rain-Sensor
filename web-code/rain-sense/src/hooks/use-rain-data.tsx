import { useState, useEffect, useRef } from 'react';

interface RainData {
  rain: number;
}

interface HistoryPoint {
  time: string;
  value: number;
}

interface UseRainDataReturn {
  currentRain: number;
  history: HistoryPoint[];
  error: string | null;
  isLoading: boolean;
}


export function useRainData(): UseRainDataReturn {
  const [currentRain, setCurrentRain] = useState(0);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // pick base URL according to environment
  const BASE_URL = import.meta.env.PROD ? import.meta.env.VITE_API_BASE : '';

  // track consecutive failures so we can fall back to mock data
  const failureCount = useRef(0);
  const MAX_FAILURES = 3;

  useEffect(() => {
    const fetchRainData = async () => {
      try {
        let rainPct: number;
        let mockUsed = false;

        try {
          // abort if the tunnel/ESP32 takes >6 s
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 6000);

          const res = await fetch(`${BASE_URL}/api/rain`, {
            signal: controller.signal,
            credentials: 'omit', // avoid huge cookie header → 431
          });
          clearTimeout(timer);

          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const json = (await res.json()) as RainData;
          rainPct = Math.round(json.rain);

          // reset failure counter
          failureCount.current = 0;
          setError(null);
        } catch (apiErr) {
          failureCount.current += 1;
          console.warn(`API failure ${failureCount.current}/${MAX_FAILURES}`, apiErr);

          if (failureCount.current >= MAX_FAILURES) {
            mockUsed = true;
            rainPct = Math.floor(Math.random() * 100); // random fallback
            setError('Using simulated data (API offline)');
            // cap counter so it doesn't overflow
            failureCount.current = MAX_FAILURES;
          } else {
            throw apiErr;
          }
        }

        // update state
        setCurrentRain(rainPct);

        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setHistory(h => [...h.slice(-9), { time, value: rainPct }]);

        if (!mockUsed) setError(null);
      } catch (err) {
        console.error('Rain hook error', err);
        setError('Failed to fetch rain data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRainData();
    const id = setInterval(fetchRainData, 5000);
    return () => clearInterval(id);
  }, [BASE_URL]);

  return { currentRain, history, error, isLoading };
}