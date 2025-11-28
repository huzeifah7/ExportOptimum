
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { produce } from '@/lib/produce-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const product = produce.find((p) => p.slug === slug);
        if (product) {
            setProductName(product.name);
            setDescription(product.description);
            setCategory(product.category);
            const image = PlaceHolderImages.find((img) => img.id === product.id);
            if(image) {
                setImagePreview(image.imageUrl);
            }
        } else {
            // If the product is not found, you can redirect or show a 404 page
            notFound();
        }
    }, [slug]);

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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const updatedProduct = {
            slug,
            name: productName,
            description,
            category,
            image: imagePreview,
        };
        console.log("Updated Product Saved:", updatedProduct);
        // Here we would typically send the data to a server or database.
        // For now, we'll just log it and then redirect.
        alert('Product data logged to console. Check your browser developer tools.');
        router.push('/admin/products');
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/products">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold font-headline">Edit Product</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="product-name">Product Name</Label>
                                <Input 
                                    id="product-name" 
                                    placeholder="e.g., Hass Avocado" 
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="product-description">Description</Label>
                                <Textarea 
                                    id="product-description" 
                                    placeholder="A short description of the product..." 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="product-category">Category</Label>
                                <Select onValueChange={setCategory} value={category}>
                                    <SelectTrigger id="product-category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="avocado">Avocado</SelectItem>
                                        <SelectItem value="berries">Berries</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="product-image">Product Image</Label>
                            <Input id="product-image" type="file" accept="image/*" onChange={handleImageChange} />
                            {imagePreview && (
                                <div className="mt-4 rounded-lg overflow-hidden border aspect-square w-full relative">
                                    <img src={imagePreview} alt="Image preview" className="object-cover w-full h-full" />
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6">
                        <Button variant="outline" type="button" onClick={() => router.push('/admin/products')}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
