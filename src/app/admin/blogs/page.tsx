
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, Timestamp, doc } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  imageUrl?: string;
  imageHint?: string;
  publishDate: Timestamp;
};

export default function ManageBlogsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);

  const blogPostsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "blogPosts");
  }, [firestore]);

  const { data: posts, isLoading } = useCollection<BlogPost>(blogPostsQuery);
  
  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'No date';
    return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  }

  const handleDeleteClick = (postId: string, postTitle: string) => {
    setPostToDelete({ id: postId, title: postTitle });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!firestore || !postToDelete) return;
    
    const docRef = doc(firestore, "blogPosts", postToDelete.id);
    deleteDocumentNonBlocking(docRef);
    
    toast({
      title: "Blog Post Deleted",
      description: `"${postToDelete.title}" has been successfully removed.`,
    });
    
    setPostToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Manage Blogs</h1>
        <Button asChild>
          <Link href="/admin/blogs/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Blog Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden shadow-lg flex flex-col">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                  <CardFooter className="mt-auto flex justify-end gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts?.map((post) => (
                <Card key={post.id} className="overflow-hidden shadow-lg flex flex-col group border-border/50 hover:border-primary/20 transition-colors">
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        data-ai-hint={post.imageHint || 'blog post'}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground italic">No Image</p>
                      </div>
                    )}
                  </div>
                  <CardHeader className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="capitalize">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(post.publishDate)}</span>
                    </div>
                    <CardTitle className="font-headline text-xl line-clamp-1">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="mt-auto flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/blogs/edit/${post.id}`}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(post.id, post.title)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && posts?.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed rounded-xl">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <PlusCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No blog posts found</h3>
                <p className="text-muted-foreground mt-2">Start sharing insights with your audience today.</p>
                <Button variant="default" asChild className="mt-6">
                    <Link href="/admin/blogs/add">Create your first post</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-bold text-foreground">"{postToDelete?.title}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
