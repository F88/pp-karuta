import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './IntroPage.css';

export function IntroPage({ onBack }: { onBack: () => void }) {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // Use relative path from public directory
    const basePath = import.meta.env.BASE_URL || '/';
    fetch(`${basePath}INTRO.md`)
      .then((response) => response.text())
      .then((text) => {
        // Remove front-matter (between --- and ---)
        const content = text.replace(/^---[\s\S]*?---\n\n/, '');
        setMarkdown(content);
      })
      .catch((error) => {
        console.error('Failed to load INTRO.md:', error);
        setMarkdown('# Error loading INTRO.md');
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
