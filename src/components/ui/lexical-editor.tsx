'use client';

import React from 'react';
import LexkitEditor from '@lexkit/editor';
import { cn } from '@/lib/utils';

interface LexicalEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * A wrapper for the @lexkit/editor component to provide a consistent interface
 * for creating and editing rich text content in the admin panel.
 */
export function LexicalEditor({ value, onChange, placeholder, className }: LexicalEditorProps) {
  return (
    <div className={cn("relative min-h-[300px] border rounded-md overflow-hidden bg-white text-black", className)}>
      <LexkitEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
