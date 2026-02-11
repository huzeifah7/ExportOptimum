
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AddBlogPage() {
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(null);
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
        
        if (!firestore || !user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to create a post.' });
            return;
        }

        if (!imageFile) {
            toast({ variant: "destructive", title: "Image Required", description: "Please select a featured image." });
            return;
        }

        setIsSubmitting(true);
        
        try {
            const blogCollection = collection(firestore, 'blogPosts');
            const newPostRef = doc(blogCollection);
            const newPostId = newPostRef.id;

            const storage = getStorage();
            const imagePath = `blogs/${newPostId}/${imageFile.name}`;
            const imageStorageRef = storageRef(storage, imagePath);

            await uploadBytes(imageStorageRef, imageFile);
            const imageUrl = await getDownloadURL(imageStorageRef);

            const newPost = {
                title,
                excerpt,
                category,
                content,
                imageUrl: imageUrl,
                slug: slugify(title),
                imageHint: `${category.toLowerCase()} ${title.toLowerCase().split(' ')[0]}`,
                author: user.displayName || 'Admin',
                publishDate: serverTimestamp(),
                id: newPostId,
            };

            await setDoc(newPostRef, newPost);
            
            toast({
              title: "Blog Post Added",
              description: `${title} has been successfully added.`,
            });

            router.push('/admin/blogs');
        } catch (error: any) {
            console.error("Error adding blog post:", error);
            toast({ variant: "destructive", title: "Error", description: `There was a problem adding the blog post: ${error.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                <h1 className="text-3xl font-bold font-headline">Add New Blog Post</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Blog Details</CardTitle>
                                <CardDescription>Provide the main content and details for your new blog post.</CardDescription>
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
                                        placeholder="Write your blog post here. We can add rich text editing later." 
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
                                    <Input id="blog-image" type="file" accept="image/*" onChange={handleImageChange} required disabled={isSubmitting} />
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
                        {isSubmitting ? "Saving..." : "Save Post"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
