
'use client';

import React, { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { $getRoot, $getSelection, FORMAT_TEXT_COMMAND, TextNode, ElementNode } from 'lexical';
import { $convertFromMarkdownString, $convertToMarkdownString } from '@lexical/markdown';
import { Button } from './button';
import { Bold, Italic, List, ListOrdered, Type, Redo, Undo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LexicalEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const theme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  list: {
    ul: 'list-disc ml-6 mb-4',
    ol: 'list-decimal ml-6 mb-4',
    listitem: 'mb-1',
  },
  heading: {
    h1: 'text-3xl font-bold mb-4',
    h2: 'text-2xl font-bold mb-3',
    h3: 'text-xl font-bold mb-2',
  },
  paragraph: 'mb-4',
};

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30 rounded-t-md">
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={cn(isBold && 'bg-muted')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={cn(isItalic && 'bg-muted')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <div className="w-px h-4 bg-border mx-1" />
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
      >
        <Type className="h-4 w-4" />
      </Button>
      <div className="flex-grow" />
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'undo' as any)}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'redo' as any)}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}

function LoadInitialValuePlugin({ initialValue }: { initialValue: string }) {
  const [editor] = useLexicalComposerContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && initialValue) {
      editor.update(() => {
        $convertFromMarkdownString(initialValue, TRANSFORMERS);
      });
      setIsInitialized(true);
    }
  }, [editor, initialValue, isInitialized]);

  return null;
}

export function LexicalEditor({ value, onChange, placeholder = "Start typing...", className }: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'BlogEditor',
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
  };

  const handleOnChange = (editorState: any) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      onChange(markdown);
    });
  };

  return (
    <div className={cn("relative border rounded-md focus-within:ring-2 focus-within:ring-primary/20", className)}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative min-h-[300px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[300px] outline-none p-4 prose prose-sm max-w-none" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={handleOnChange} />
          <LoadInitialValuePlugin initialValue={value} />
        </div>
      </LexicalComposer>
    </div>
  );
}
