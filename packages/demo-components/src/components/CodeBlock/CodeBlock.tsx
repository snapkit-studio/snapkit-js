'use client';

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

import type { CodeBlockProps } from '../../types';

let highlighterInstance: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ['github-dark'],
      langs: ['typescript', 'javascript', 'tsx', 'jsx', 'json', 'css', 'html'],
    });
  }
  return highlighterInstance;
}

export function CodeBlock({
  children,
  language = 'tsx',
  className = '',
}: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function highlightCode() {
      try {
        setIsLoading(true);
        const highlighter = await getHighlighter();

        // Map common language aliases
        const langMap: Record<string, string> = {
          tsx: 'tsx',
          jsx: 'jsx',
          typescript: 'typescript',
          ts: 'typescript',
          javascript: 'javascript',
          js: 'javascript',
          json: 'json',
          css: 'css',
          html: 'html',
        };

        const mappedLang = langMap[language] || 'typescript';

        const html = highlighter.codeToHtml(children, {
          lang: mappedLang,
          theme: 'github-dark',
        });

        setHighlightedCode(html);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        // Fallback to plain text with basic styling
        setHighlightedCode(
          `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>${children}</code></pre>`,
        );
      } finally {
        setIsLoading(false);
      }
    }

    highlightCode();
  }, [children, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (isLoading) {
    return (
      <pre
        className={clsx(
          'animate-pulse overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100',
          className,
        )}
      >
        <code>{children}</code>
      </pre>
    );
  }

  return (
    <div className="group relative">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-600"
        aria-label="Copy code"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>

      {/* Language label */}
      {language && (
        <div className="absolute top-2 left-4 z-10 text-xs text-gray-400 opacity-60">
          {language}
        </div>
      )}

      {/* Code block */}
      <div
        className={clsx('shiki-container', className)}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  );
}
