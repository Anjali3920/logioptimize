import { cn } from "@/lib/utils";
import hljs from "highlight.js/lib/core";
import cpp from "highlight.js/lib/languages/cpp";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

hljs.registerLanguage("python", python);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  language = "python",
  title,
  className,
  maxHeight = "400px",
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(codeRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden border border-border/40 bg-[oklch(0.10_0.008_262)]",
        className,
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-card">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-destructive/60" />
            <span className="w-3 h-3 rounded-full bg-accent/60" />
            <span className="w-3 h-3 rounded-full bg-[oklch(0.62_0.20_145)]/60" />
          </div>
          {title && (
            <span className="text-xs font-mono text-muted-foreground ml-1">
              {title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 border border-border/30 px-1.5 py-0.5 rounded">
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[oklch(0.62_0.20_145)]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Code area */}
      <div className="overflow-auto scrollbar-thin" style={{ maxHeight }}>
        <pre className="p-4 text-sm leading-relaxed m-0">
          <code
            ref={codeRef}
            className={`language-${language} font-mono !bg-transparent`}
          >
            {code}
          </code>
        </pre>
      </div>

      <style>{`
        .hljs { background: transparent !important; }
        .hljs-keyword { color: oklch(0.63 0.30 200); }
        .hljs-built_in { color: oklch(0.55 0.26 252); }
        .hljs-string { color: oklch(0.68 0.22 60); }
        .hljs-number { color: oklch(0.72 0.20 45); }
        .hljs-comment { color: oklch(0.50 0.018 262); font-style: italic; }
        .hljs-function .hljs-title, .hljs-title.function_ { color: oklch(0.62 0.20 145); }
        .hljs-params { color: oklch(0.75 0.012 262); }
        .hljs-variable { color: oklch(0.80 0.012 262); }
        .hljs-operator { color: oklch(0.63 0.30 200); }
        .hljs-class .hljs-title { color: oklch(0.72 0.20 45); }
        .hljs-attr { color: oklch(0.55 0.26 252); }
        .hljs-literal { color: oklch(0.56 0.24 22); }
      `}</style>
    </div>
  );
}
