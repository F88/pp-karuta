import { useEffect, useState, useMemo, useRef } from 'react';

export type UseYomibitoOptions = {
  text: string;
  speed?: number; // milliseconds per character
  rhythm?: number[]; // character count pattern, e.g., [5, 7, 5]
  rhythmPause?: number; // pause duration after each rhythm group (ms)
  remainingSpeed?: number; // speed for characters after rhythm pattern completes
  startDelay?: number;
};

export function useYomibito({
  text,
  speed = 100,
  rhythm = [5, 7, 5, 7, 7],
  rhythmPause = 300,
  remainingSpeed = 50,
  startDelay = 0,
}: UseYomibitoOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Split text into array of characters (handles emoji correctly)
  const chars = useMemo(() => Array.from(text), [text]);

  // Calculate rhythm breakpoints
  const breakpoints = useMemo(() => {
    const points: number[] = [];
    let sum = 0;
    for (const count of rhythm) {
      sum += count;
      points.push(sum);
    }
    return points;
  }, [rhythm]);

  // Calculate total rhythm length
  const totalRhythmLength = useMemo(() => {
    return rhythm.reduce((sum, count) => sum + count, 0);
  }, [rhythm]);

  // Use ref to store breakpoints to avoid unnecessary re-renders
  const breakpointsRef = useRef(breakpoints);
  useEffect(() => {
    breakpointsRef.current = breakpoints;
  }, [breakpoints]);

  // Start typing after initial delay
  useEffect(() => {
    if (currentIndex !== -1) return;

    const startTimer = setTimeout(() => {
      setCurrentIndex(0);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [startDelay, currentIndex]);

  // Type character by character with rhythm pauses
  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= chars.length) return;

    // Check if we're past the rhythm pattern
    const isPastRhythm = currentIndex >= totalRhythmLength;

    // Check if previous character completed a rhythm group
    const justCompletedGroup = breakpointsRef.current.includes(currentIndex);

    // Determine delay based on position
    let delay: number;
    if (justCompletedGroup) {
      delay = rhythmPause;
    } else if (isPastRhythm) {
      delay = remainingSpeed;
    } else {
      delay = speed;
    }

    const timer = setTimeout(() => {
      setDisplayedText(chars.slice(0, currentIndex + 1).join(''));
      setCurrentIndex(currentIndex + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [
    currentIndex,
    chars,
    speed,
    rhythmPause,
    remainingSpeed,
    totalRhythmLength,
  ]);

  return { displayedText, isComplete: currentIndex >= chars.length };
}
