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
        <pre
          className="rounded-lg p-3 sm:p-4 text-xs sm:text-sm overflow-x-auto border border-gray-800 -mx-4 sm:mx-0 rounded-none sm:rounded-lg"
          style={{ ...style, backgroundColor: "#0d1117" }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className="hidden sm:inline-block w-8 text-right mr-4 text-gray-600 select-none text-xs">
                {i + 1}
              </span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
