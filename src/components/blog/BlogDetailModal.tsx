
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { DialogTitle } from "@radix-ui/react-dialog";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  slug: string;
  imageUrl?: string;
  imageHint?: string;
  publishDate: Timestamp;
};

interface BlogDetailModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlogDetailModal({ post, isOpen, onClose }: BlogDetailModalProps) {
  if (!post) {
    return null;
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent valign="top" className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <article className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4">{post.category}</Badge>
              <DialogTitle className="text-4xl md:text-5xl font-headline font-bold">{post.title}</DialogTitle>
              <DialogDescription className="mt-4 text-lg text-muted-foreground">{post.excerpt}</DialogDescription>
               <div className="flex items-center justify-center mt-6 gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} min read</span>
                  </div>
              </div>
          </div>

          {post.imageUrl && (
            <div className="rounded-lg overflow-hidden shadow-lg mb-12">
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={1200}
                height={600}
                className="object-cover w-full max-h-[500px]"
                data-ai-hint={post.imageHint}
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none mx-auto text-foreground/90 dark:prose-invert prose-headings:font-headline">
            {post.content.split('\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                return <h3 key={index} className="font-bold text-2xl mt-8 mb-4">{trimmed.substring(2, trimmed.length-2)}</h3>
              }
              if(trimmed.length > 0){
                  return <p key={index} className="mb-4 leading-relaxed">{trimmed}</p>
              }
              return null;
            })}
          </div>
        </article>
      </DialogContent>
    </Dialog>
  );
}
