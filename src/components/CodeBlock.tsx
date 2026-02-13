"use client";

import { Highlight, themes } from "prism-react-renderer";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = "python" }: CodeBlockProps) {
  return (
    <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <div className="relative overflow-hidden border border-white/[0.06] -mx-4 sm:mx-0">
          <div className="h-px bg-gradient-to-r from-accent/80 via-accent/20 to-transparent" />
          <pre
            className="p-3 sm:p-4 text-xs sm:text-sm overflow-x-auto"
            style={{ ...style, backgroundColor: "#050505" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="hidden sm:inline-block w-8 text-right mr-4 text-gray-700 select-none text-xs font-mono">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  );
}
