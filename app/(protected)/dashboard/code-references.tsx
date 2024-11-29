import React, { useState } from "react";
import { Tabs, TabsContent } from "../../../components/ui/tabs.tsx";
import { cn } from "../../../lib/utils.ts";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type CodeReferencesProps = {
  filesReferences: {
    filename: string;
    sourceCode: string;
    summary: string;
  }[];
};

export default function CodeReferences({ filesReferences }: CodeReferencesProps) {
  const [tab, setTab] = useState(filesReferences[0]?.filename);
  if (filesReferences.length === 0) return null;

  return (
    <div className="max-w-[90vw] w-full">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-y-scroll   flex gap-2 bg-gray-200 p-2 rounded-md">
          {filesReferences.map((file) => (
            <button
              key={file.filename}
              onClick={() => setTab(file.filename)}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:text-muted-foreground/80",
                {
                  "bg-primary text-primary-foreground ": tab === file.filename,
                }
              )}
            >
              {file.filename}
            </button>
          ))}
        </div>
        {filesReferences.map((file) => (
          <TabsContent
            value={file.filename}
            key={file.filename}
            className="w-full  overflow-scroll   rounded-md"
          >
            <SyntaxHighlighter
              className="max-h-[40vh] overflow-scroll"
              language="typescript"
              style={oneDark}
            >
              {file.sourceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
