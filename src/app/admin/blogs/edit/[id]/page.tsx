
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, Timestamp, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  imageUrl?: string;
  slug: string;
  publishDate: Timestamp;
};

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const blogId = params?.id as string;
    const firestore = useFirestore();
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();

    const blogRef = useMemoFirebase(() => {
        if (!blogId || !firestore) return null;
        return doc(firestore, 'blogPosts', blogId);
    }, [firestore, blogId]);

    const { data: blog, isLoading: isLoadingBlog } = useDoc<BlogPost>(blogRef);

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (blog) {
            setTitle(blog.title);
            setExcerpt(blog.excerpt);
            setCategory(blog.category);
            setContent(blog.content);
            if (blog.imageUrl) {
                setImagePreview(blog.imageUrl);
            }
        }
    }, [blog]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const slugify = (text: string) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!blogRef || !firestore) return;
        setIsSubmitting(true);
        
        try {
            let finalImageUrl = blog?.imageUrl;

            if (imageFile) {
                const storage = getStorage();
                const imagePath = `blogs/${blogId}/${imageFile.name}`;
                const imageStorageRef = storageRef(storage, imagePath);
                
                await uploadBytes(imageStorageRef, imageFile);
                finalImageUrl = await getDownloadURL(imageStorageRef);
            }

            const slug = slugify(title);

            const updatedBlog = {
                ...blog,
                title,
                excerpt,
                category,
                content,
                slug,
                imageUrl: finalImageUrl,
                imageHint: `${category.toLowerCase()} ${title.toLowerCase().split(' ')[0]}`,
            };
            
            await setDoc(blogRef, updatedBlog, { merge: true });

            toast({
              title: "Blog Post Updated",
              description: `${title} has been successfully updated.`,
            });
    
            router.push('/admin/blogs');

        } catch (error: any) {
            console.error("Error updating blog post:", error);
            toast({ variant: "destructive", title: "Error", description: `There was a problem updating the blog post: ${error.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingBlog) {
       return (
            <div>
                 <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-9 w-48" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                        <div className='space-y-4'>
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="aspect-video w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!blog && !isLoadingBlog) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Blog Post Not Found</h1>
                <p className="text-muted-foreground">The post you are trying to edit does not exist.</p>
                <Button asChild variant="outline" className="mt-4">
                    <Link href="/admin/blogs">Back to Blogs</Link>
                </Button>
            </div>
        );
    }
    
    const isFormSubmittable = !isSubmitting && !isUserLoading && user && firestore;

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/blogs">
                        <ArrowLeft />
                        <span className="sr-only">Back to Blogs</span>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold font-headline">Edit Blog Post</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Blog Details</CardTitle>
                                <CardDescription>Update the content and details of your blog post.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="blog-title">Title</Label>
                                    <Input 
                                        id="blog-title" 
                                        placeholder="Your blog post title" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="blog-excerpt">Subtitle / Excerpt</Label>
                                    <Textarea 
                                        id="blog-excerpt" 
                                        placeholder="A short summary or subtitle for the post."
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="blog-content">Content</Label>
                                    <Textarea 
                                        id="blog-content" 
                                        placeholder="Write your blog post here." 
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        className="min-h-[300px]"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-8">
                       <Card>
                           <CardHeader>
                                <CardTitle>Post Settings</CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="blog-category">Category</Label>
                                    <Select onValueChange={setCategory} value={category} required disabled={isSubmitting}>
                                        <SelectTrigger id="blog-category">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nutrition">Nutrition</SelectItem>
                                            <SelectItem value="sustainability">Sustainability</SelectItem>
                                            <SelectItem value="food">Food</SelectItem>
                                            <SelectItem value="produce">Produce</SelectItem>
                                            <SelectItem value="logistics">Logistics</SelectItem>
                                            <SelectItem value="community">Community</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    <Label htmlFor="blog-image">Featured Image</Label>
                                    <Input id="blog-image" type="file" accept="image/*" onChange={handleImageChange} disabled={isSubmitting} />
                                    {imagePreview && (
                                        <div className="mt-4 rounded-lg overflow-hidden border aspect-video w-full relative">
                                            <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>
                           </CardContent>
                       </Card>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-2">
                    <Button variant="outline" type="button" onClick={() => router.push('/admin/blogs')} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={!isFormSubmittable}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
