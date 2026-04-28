'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="my-6 rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl">
              <div className="bg-white/5 px-4 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{match[1]}</span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
              </div>
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: '#0a0a0a',
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="bg-white/10 px-1.5 py-0.5 rounded-md text-[var(--accent)] font-mono" {...props}>
              {children}
            </code>
          );
        },
        // Styling headers
        h1: ({ children }) => <h1 className="text-3xl font-black font-outfit uppercase mt-12 mb-6 text-foreground">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-black font-outfit uppercase mt-10 mb-4 text-foreground">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-black font-outfit uppercase mt-8 mb-3 text-foreground">{children}</h3>,
        p: ({ children }) => <p className="mb-6 leading-relaxed text-gray-400">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-6 space-y-2 text-gray-400">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-400">{children}</ol>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-[var(--accent)] bg-white/5 p-6 rounded-r-2xl italic my-8 text-gray-300">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
