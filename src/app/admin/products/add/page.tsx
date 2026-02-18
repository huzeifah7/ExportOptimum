
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

export default function AddProductPage() {
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New Specification Fields
    const [showOrigin, setShowOrigin] = useState(false);
    const [origin, setOrigin] = useState('');
    const [showSeason, setShowSeason] = useState(false);
    const [season, setSeason] = useState('');
    const [showCharacteristics, setShowCharacteristics] = useState(false);
    const [characteristics, setCharacteristics] = useState('');

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
        
        if (!firestore) {
            toast({ variant: "destructive", title: "Error", description: "Firestore is not available." });
            return;
        }

        if (!imageFile) {
            toast({ variant: "destructive", title: "Image Required", description: "Please select a product image." });
            return;
        }

        setIsSubmitting(true);

        try {
            const productsCollection = collection(firestore, 'products');
            const newProductRef = doc(productsCollection); 
            const newProductId = newProductRef.id;

            const slug = slugify(productName);

            const storage = getStorage();
            const imagePath = `products/${newProductId}/${imageFile.name}`;
            const imageStorageRef = storageRef(storage, imagePath);
            
            await uploadBytes(imageStorageRef, imageFile);
            const imageUrl = await getDownloadURL(imageStorageRef);

            const newProduct = {
                id: newProductId,
                name: productName,
                description,
                category,
                imageUrl,
                slug,
                imageHint: `${category.toLowerCase()} ${productName.toLowerCase().split(' ')[0]}`,
                origin: showOrigin ? origin : '',
                season: showSeason ? season : '',
                characteristics: showCharacteristics ? characteristics : '',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await setDoc(newProductRef, newProduct);

            toast({
              title: "Product Added",
              description: `${productName} has been successfully added.`,
            });

            router.push('/admin/products');

        } catch (error: any) {
            console.error("Error adding product: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: `There was a problem adding the product: ${error.message}`,
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
                <h1 className="text-3xl font-bold font-headline">Add New Product</h1>
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
                                <CardTitle>Product Specifications</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="show-origin" 
                                            checked={showOrigin} 
                                            onCheckedChange={(checked) => setShowOrigin(!!checked)} 
                                        />
                                        <Label htmlFor="show-origin" className="cursor-pointer">Specify Origin</Label>
                                    </div>
                                    {showOrigin && (
                                        <div className="pl-6 space-y-2">
                                            <Label htmlFor="product-origin">Origin Details</Label>
                                            <Input 
                                                id="product-origin" 
                                                placeholder="e.g. Larache, Morocco" 
                                                value={origin}
                                                onChange={(e) => setOrigin(e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="show-season" 
                                            checked={showSeason} 
                                            onCheckedChange={(checked) => setShowSeason(!!checked)} 
                                        />
                                        <Label htmlFor="show-season" className="cursor-pointer">Specify Harvest Season</Label>
                                    </div>
                                    {showSeason && (
                                        <div className="pl-6 space-y-2">
                                            <Label htmlFor="product-season">Season Details</Label>
                                            <Input 
                                                id="product-season" 
                                                placeholder="e.g. October to April" 
                                                value={season}
                                                onChange={(e) => setSeason(e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="show-characteristics" 
                                            checked={showCharacteristics} 
                                            onCheckedChange={(checked) => setShowCharacteristics(!!checked)} 
                                        />
                                        <Label htmlFor="show-characteristics" className="cursor-pointer">Specify Key Characteristics</Label>
                                    </div>
                                    {showCharacteristics && (
                                        <div className="pl-6 space-y-2">
                                            <Label htmlFor="product-characteristics">Characteristics Details</Label>
                                            <Textarea 
                                                id="product-characteristics" 
                                                placeholder="e.g. Creamy texture, rich flavor, high oil content..." 
                                                value={characteristics}
                                                onChange={(e) => setCharacteristics(e.target.value)}
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
                                <Label htmlFor="product-image">Select File</Label>
                                <Input 
                                    id="product-image" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    required
                                    disabled={isSubmitting}
                                />
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
                    <Button type="submit" disabled={isSubmitting || !productName || !description || !category || !imageFile}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Saving...' : 'Save Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
