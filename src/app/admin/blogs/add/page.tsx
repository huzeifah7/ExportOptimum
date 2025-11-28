
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function AddBlogPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newPost = {
            title,
            excerpt,
            category,
            content,
            imageUrl: imagePreview,
        };
        
        // For now, we'll just log the data to the console.
        // We can wire this up to Firestore in the next step.
        console.log("New Blog Post:", newPost);

        toast({
          title: "Blog Post Ready",
          description: "Blog post data logged to console. Check your browser developer tools.",
        });

        // Uncomment the line below to redirect after submission
        // router.push('/admin/blogs');
    };

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
                                    <Select onValueChange={setCategory} value={category} required>
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
                                    <Input id="blog-image" type="file" accept="image/*" onChange={handleImageChange} />
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
                    <Button variant="outline" type="button" onClick={() => router.push('/admin/blogs')}>Cancel</Button>
                    <Button type="submit">Save Post</Button>
                </div>
            </form>
        </div>
    );
}
