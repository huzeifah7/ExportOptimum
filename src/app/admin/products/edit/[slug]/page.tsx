
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

type Product = {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl?: string;
    slug: string;
    period?: string;
    storage?: string;
    sizes?: string;
};

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.slug as string;
    const firestore = useFirestore();
    const { toast } = useToast();

    const productRef = useMemoFirebase(() => {
        if (!productId || !firestore) return null;
        return doc(firestore, 'products', productId);
    }, [firestore, productId]);

    const { data: product, isLoading } = useDoc<Product>(productRef);

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Export Features States
    const [showPeriod, setShowPeriod] = useState(false);
    const [period, setPeriod] = useState('');
    const [showStorage, setShowStorage] = useState(false);
    const [storageTemp, setStorageTemp] = useState('');
    const [showSizes, setShowSizes] = useState(false);
    const [sizes, setSizes] = useState('');

    useEffect(() => {
        if (product) {
            setProductName(product.name);
            setDescription(product.description);
            setCategory(product.category);
            if(product.imageUrl) {
                setImagePreview(product.imageUrl);
            }
            if (product.period) {
                setShowPeriod(true);
                setPeriod(product.period);
            }
            if (product.storage) {
                setShowStorage(true);
                setStorageTemp(product.storage);
            }
            if (product.sizes) {
                setShowSizes(true);
                setSizes(product.sizes);
            }
        }
    }, [product]);

    if (isLoading) {
        return (
            <div>
                 <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-9 w-48" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader><Skeleton className="h-8 w-40" /></CardHeader>
                            <CardContent className="space-y-6">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader><Skeleton className="h-8 w-40" /></CardHeader>
                        <CardContent><Skeleton className="aspect-square w-full" /></CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!product && !isLoading) {
        notFound();
    }
    
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
        
        if (!productRef || !firestore) return;
        setIsSubmitting(true);

        try {
            let finalImageUrl = product?.imageUrl;

            if (imageFile) {
                const storage = getStorage();
                const imagePath = `products/${productId}/${imageFile.name}`;
                const imageStorageRef = storageRef(storage, imagePath);
                
                await uploadBytes(imageStorageRef, imageFile);
                finalImageUrl = await getDownloadURL(imageStorageRef);
            }

            const slug = slugify(productName);

            const updatedProduct = {
                name: productName,
                description,
                category,
                imageUrl: finalImageUrl,
                slug: slug,
                imageHint: `${category.toLowerCase()} ${productName.toLowerCase().split(' ')[0]}`,
                period: showPeriod ? period : '',
                storage: showStorage ? storageTemp : '',
                sizes: showSizes ? sizes : '',
            };

            await setDoc(productRef, updatedProduct, { merge: true });

            toast({
                title: "Product Updated",
                description: `${productName} has been successfully updated.`,
            });

            router.push('/admin/products');
        } catch (error: any) {
             console.error("Error updating product: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: `There was a problem updating the product: ${error.message}`,
            });
        } finally {
            setIsSubmitting(false);
        }
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="product-name">Product Name</Label>
                                    <Input 
                                        id="product-name" 
                                        placeholder="e.g., Hass Avocado" 
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        required
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="product-category">Category</Label>
                                    <Select onValueChange={setCategory} value={category} required disabled={isSubmitting}>
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
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Export Features</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="show-period" 
                                            checked={showPeriod} 
                                            onCheckedChange={(checked) => setShowPeriod(!!checked)} 
                                        />
                                        <Label htmlFor="show-period" className="cursor-pointer">Specify Period</Label>
                                    </div>
                                    {showPeriod && (
                                        <div className="pl-6 space-y-2">
                                            <Label htmlFor="product-period">Period Details</Label>
                                            <Input 
                                                id="product-period" 
                                                placeholder="e.g. December to April" 
                                                value={period}
                                                onChange={(e) => setPeriod(e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="show-storage" 
                                            checked={showStorage} 
                                            onCheckedChange={(checked) => setShowStorage(!!checked)} 
                                        />
                                        <Label htmlFor="show-storage" className="cursor-pointer">Specify Storage</Label>
                                    </div>
                                    {showStorage && (
                                        <div className="pl-6 space-y-2">
                                            <Label htmlFor="product-storage">Storage Details</Label>
                                            <Input 
                                                id="product-storage" 
                                                placeholder="e.g. 6°C" 
                                                value={storageTemp}
                                                onChange={(e) => setStorageTemp(e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="show-sizes" 
                                            checked={showSizes} 
                                            onCheckedChange={(checked) => setShowSizes(!!checked)} 
                                        />
                                        <Label htmlFor="show-sizes" className="cursor-pointer">Specify Sizes</Label>
                                    </div>
                                    {showSizes && (
                                        <div className="pl-6 space-y-2">
                                            <Label htmlFor="product-sizes">Sizes Details</Label>
                                            <Input 
                                                id="product-sizes" 
                                                placeholder="e.g. C12-C28" 
                                                value={sizes}
                                                onChange={(e) => setSizes(e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Image</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Label htmlFor="product-image">Change File</Label>
                                <Input id="product-image" type="file" accept="image/*" onChange={handleImageChange} disabled={isSubmitting} />
                                {imagePreview && (
                                    <div className="mt-4 rounded-lg overflow-hidden border aspect-square w-full relative">
                                        <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-2 border-t pt-6">
                    <Button variant="outline" type="button" onClick={() => router.push('/admin/products')} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
