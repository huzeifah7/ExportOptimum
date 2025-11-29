
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, Timestamp } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Blogs</h1>
        <Button asChild>
          <Link href="/admin/blogs/add">Add New Blog Post</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden shadow-lg flex flex-col">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                  <CardFooter className="mt-auto flex justify-end gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <Card key={post.id} className="overflow-hidden shadow-lg flex flex-col">
                <div className="relative h-48 w-full">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      data-ai-hint={post.imageHint || 'blog post'}
                    />
                  ) : (
                    <div className="bg-secondary h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No Image</p>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{post.title}</CardTitle>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <Badge variant="secondary" className="w-fit">{post.category}</Badge>
                    <span>{formatDate(post.publishDate)}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="mt-auto flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/blogs/edit/${post.id}`}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {!isLoading && posts?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                <p>No blog posts found.</p>
                <Button variant="link" asChild className="mt-2">
                    <Link href="/admin/blogs/add">Add the first one!</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
