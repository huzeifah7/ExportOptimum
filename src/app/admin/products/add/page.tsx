
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function AddProductPage() {
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
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

    const slugify = (text: string) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w-]+/g, '')       // Remove all non-word chars
            .replace(/--+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const slug = slugify(productName);

        const newProduct = {
            name: productName,
            description,
            category,
            imageUrl: imagePreview,
            slug: slug,
            imageHint: `${category.toLowerCase()} ${productName.toLowerCase().split(' ')[0]}`
        };

        const productsCollection = collection(firestore, 'products');
        await addDocumentNonBlocking(productsCollection, newProduct);

        toast({
          title: "Product Added",
          description: `${productName} has been successfully added.`,
        });

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
                <h1 className="text-3xl font-bold font-headline">Add New Product</h1>
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
                                <Select onValueChange={setCategory} value={category} required>
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
                        <Button type="submit">Save Product</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
