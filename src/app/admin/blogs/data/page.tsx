'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, Timestamp } from 'firebase/firestore';

type BlogPost = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  slug: string;
  imageUrl?: string;
  imageHint?: string;
  publishDate: Timestamp;
};

export default function BlogDataPage() {
  const firestore = useFirestore();

  const blogPostsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "blogPosts");
  }, [firestore]);

  const { data: posts, isLoading } = useCollection<BlogPost>(blogPostsQuery);

  if (isLoading) {
    return <div>Loading blog data...</div>;
  }

  return (
    <div>
      <h1>Blog Posts Data</h1>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  );
}
