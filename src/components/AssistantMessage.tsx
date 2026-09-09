import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { CopyButton } from "./CopyButton";
import { SQLBlock } from "./SQLBlock";
import { DataTable } from "./DataTable";
import { ChartBlock } from "./ChartBlock";
import { ThoughtBlock } from "./ThoughtBlock";
import { SuggestedQuestions } from "./SuggestedQuestions";

interface AssistantMessageProps {
  content: any;
  status?: "streaming" | "done";
  onSelectQuestion: (q: string) => void;
  isLoading?: boolean;
}

export const AssistantMessage = ({ content, status, onSelectQuestion, isLoading }: AssistantMessageProps) => {
  if (typeof content === 'string') {
    return (
      <div className="markdown-body text-sm leading-relaxed prose prose-sm max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="overflow-x-auto max-w-full rounded-md mt-2 mb-2 bg-[#282C34]">
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, background: 'transparent', padding: '1rem' }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  if (!Array.isArray(content)) {
    return <div className="text-xs font-mono text-red-500">Invalid response format</div>;
  }

  const thoughtParts = content
    .filter((item: any) => item.systemMessage?.text?.textType === "THOUGHT")
    .flatMap((item: any) => item.systemMessage.text.parts);

  let sqlShown = false;
  let summaryShown = false;

  return (
    <div className="space-y-4">
      {thoughtParts.length > 0 && (
        <ThoughtBlock parts={thoughtParts} isStreaming={status === "streaming"} />
      )}
      {content.map((item: any, idx: number) => {
        const sm = item.systemMessage;
        if (!sm) return null;

        if (sm.text) {
          if (sm.text.textType === "THOUGHT") return null;
          if (sm.text.textType === "FINAL_RESPONSE") {
            const rawText = sm.text.parts.join("\n");
            const isFirstSummary = !summaryShown;
            if (isFirstSummary) summaryShown = true;

            const finalText = isFirstSummary ? `### Summary\n\n${rawText}` : rawText;

            return (
              <div key={idx} className="relative group">
                <div className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-sm rounded-sm shadow-sm border border-[#141414]/5 dark:border-white/5">
                  <CopyButton text={finalText} />
                </div>
                <div className="markdown-body text-sm leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="overflow-x-auto max-w-full rounded-md mt-2 mb-2 bg-[#282C34]">
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, background: 'transparent', padding: '1rem' }}
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {finalText}
                  </ReactMarkdown>
                </div>
              </div>
            );
          }
          if (Array.isArray(sm.text.parts) && !sm.text.textType) {
            return <SuggestedQuestions key={idx} questions={sm.text.parts} onSelect={onSelectQuestion} disabled={isLoading} />;
          }
        }

        if (sm.data) {
          const showSql = sm.data.generatedSql && !sqlShown;
          if (showSql) sqlShown = true;
          return (
            <div key={idx} className="space-y-2">
              {showSql && <SQLBlock sql={sm.data.generatedSql} />}
              {sm.data.result && <DataTable data={sm.data.result.data} schema={sm.data.result.schema} />}
            </div>
          );
        }

        if (sm.chart && sm.chart.result && sm.chart.result.vegaConfig) {
          return <ChartBlock key={idx} vegaConfig={sm.chart.result.vegaConfig} />;
        }

        return null;
      })}
    </div>
  );
};
