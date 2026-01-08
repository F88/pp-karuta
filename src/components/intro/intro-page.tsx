/**
 * Intro page implementation.
 *
 * - Loads and renders `public/INTRO.txt` via fetch.
 * - Forces the intro-only theme by toggling `document.body` class
 *   (`pp-karuta-intro-theme`).
 *
 * This page intentionally does NOT use the shared shadcn/ui theme.
 */
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { logger } from '@/lib/logger';
import './IntroPage.css';

export function IntroPage({ onBack }: { onBack: () => void }) {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // Force intro page theme.
    // This page intentionally does NOT use the shared shadcn/ui theme.
    document.body.classList.add('pp-karuta-intro-theme');
    return () => {
      document.body.classList.remove('pp-karuta-intro-theme');
    };
  }, []);

  useEffect(() => {
    // Use relative path from public directory
    const basePath = import.meta.env.BASE_URL || '/';
    fetch(`${basePath}/data/INTRO.txt`)
      .then((response) => response.text())
      .then((text) => {
        // Remove front-matter (between --- and ---)
        const content = text.replace(/^---[\s\S]*?---\n\n/, '');
        setMarkdown(content);
      })
      .catch((error) => {
        logger.error('Failed to load INTRO.txt:', error);
        setMarkdown('# Error loading INTRO.txt');
      });
  }, []);

  return (
    <div className="intro-page">
      <div className="protopedia-readme">
        <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
      </div>
      <button onClick={onBack} className="back-button">
        【 帰還 】
      </button>
    </div>
  );
}
