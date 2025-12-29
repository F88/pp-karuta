import { useEffect, useState, useMemo } from 'react';

export type UseTypewriterOptions = {
  text: string;
  speed?: number; // milliseconds per character
  startDelay?: number;
};

export function useTypewriter({
  text,
  speed = 500,
  startDelay = 0,
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Split text into array of characters (handles emoji correctly)
  const chars = useMemo(() => Array.from(text), [text]);

  // Start typing after initial delay
  useEffect(() => {
    if (currentIndex !== -1) return;

    const startTimer = setTimeout(() => {
      setCurrentIndex(0);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [startDelay, currentIndex]);

  // Type character by character
  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= chars.length) return;

    const timer = setTimeout(() => {
      setDisplayedText(chars.slice(0, currentIndex + 1).join(''));
      setCurrentIndex(currentIndex + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, chars, speed]);

  return { displayedText, isComplete: currentIndex >= chars.length };
}
