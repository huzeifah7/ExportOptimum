
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, ImageIcon, Info, Layers, Sparkles, X } from 'lucide-react';
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
    subtitle?: string;
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const productRef = useMemoFirebase(() => {
        if (!productId || !firestore) return null;
        return doc(firestore, 'products', productId);
    }, [firestore, productId]);

    const { data: product, isLoading } = useDoc<Product>(productRef);

    const [productName, setProductName] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('avocado');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Export Features States
    const [enabledPeriod, setEnabledPeriod] = useState(false);
    const [period, setPeriod] = useState('');
    const [enabledStorage, setEnabledStorage] = useState(false);
    const [storageTemp, setStorageTemp] = useState('');
    const [enabledSizes, setEnabledSizes] = useState(false);
    const [sizes, setSizes] = useState('');

    useEffect(() => {
        if (product) {
            setProductName(product.name);
            setSubtitle(product.subtitle || '');
            setDescription(product.description);
            setCategory(product.category);
            if(product.imageUrl) {
                setImagePreview(product.imageUrl);
            }
            if (product.period) {
                setEnabledPeriod(true);
                setPeriod(product.period);
            }
            if (product.storage) {
                setEnabledStorage(true);
                setStorageTemp(product.storage);
            }
            if (product.sizes) {
                setEnabledSizes(true);
                setSizes(product.sizes);
            }
        }
    }, [product]);

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto">
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
                subtitle: subtitle,
                description,
                category,
                imageUrl: finalImageUrl,
                slug: slug,
                imageHint: `${category.toLowerCase()} ${productName.toLowerCase().split(' ')[0]}`,
                period: enabledPeriod ? period : '',
                storage: enabledStorage ? storageTemp : '',
                sizes: enabledSizes ? sizes : '',
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
        <div className="max-w-5xl mx-auto">
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
                            <CardHeader className="border-b bg-muted/10">
                                <div className="flex items-center gap-2 text-foreground font-bold">
                                    <Info className="h-5 w-5 text-primary" />
                                    General Information
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="product-name" className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Product Title</Label>
                                        <Input 
                                            id="product-name" 
                                            placeholder="e.g., Hass Avocado" 
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                            className="h-11 rounded-xl bg-muted/5 font-semibold text-base"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="product-subtitle" className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Catchphrase / Subtitle</Label>
                                        <Input 
                                            id="product-subtitle" 
                                            placeholder="e.g., Premium Selection" 
                                            value={subtitle}
                                            onChange={(e) => setSubtitle(e.target.value)}
                                            disabled={isSubmitting}
                                            className="h-11 rounded-xl bg-muted/5 font-semibold text-base"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="product-category" className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Classification</Label>
                                        <Select onValueChange={setCategory} value={category} required disabled={isSubmitting}>
                                            <SelectTrigger id="product-category" className="h-11 rounded-xl bg-muted/5">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="avocado" className="rounded-lg">Avocado Varieties</SelectItem>
                                                <SelectItem value="berries" className="rounded-lg">Fresh Berries</SelectItem>
                                                <SelectItem value="citrus" className="rounded-lg">Citrus Fruits</SelectItem>
                                                <SelectItem value="other" className="rounded-lg">Other Produce</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="product-description" className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Description</Label>
                                        <Textarea 
                                            id="product-description" 
                                            placeholder="Write a compelling description..." 
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                            className="min-h-[120px] rounded-xl bg-muted/5 resize-none focus:border-primary/50 p-3 leading-relaxed text-sm"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="border-b bg-muted/10">
                                <div className="flex items-center gap-2 text-foreground font-bold">
                                    <Layers className="h-5 w-5 text-primary" />
                                    Export Features
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-4 bg-muted/30 p-4 rounded-xl border border-muted-foreground/10 shadow-inner">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <Checkbox 
                                                id="enable-period" 
                                                checked={enabledPeriod} 
                                                onCheckedChange={(checked) => {
                                                    setEnabledPeriod(!!checked);
                                                    if(!checked) setPeriod('');
                                                }} 
                                            />
                                            <Label htmlFor="enable-period" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer">Periode</Label>
                                        </div>
                                        <Input id="period" name="period" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="e.g. December to April" className="h-10 rounded-xl bg-white border-muted-foreground/20 text-sm disabled:opacity-50 disabled:bg-gray-100" disabled={!enabledPeriod} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <Checkbox 
                                                id="enable-storage" 
                                                checked={enabledStorage} 
                                                onCheckedChange={(checked) => {
                                                    setEnabledStorage(!!checked);
                                                    if(!checked) setStorageTemp('');
                                                }} 
                                            />
                                            <Label htmlFor="enable-storage" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer">Storage Temp</Label>
                                        </div>
                                        <Input id="storage" name="storage" value={storageTemp} onChange={(e) => setStorageTemp(e.target.value)} placeholder="e.g. 6°C" className="h-10 rounded-xl bg-white border-muted-foreground/20 text-sm disabled:opacity-50 disabled:bg-gray-100" disabled={!enabledStorage} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <Checkbox 
                                                id="enable-sizes" 
                                                checked={enabledSizes} 
                                                onCheckedChange={(checked) => {
                                                    setEnabledSizes(!!checked);
                                                    if(!checked) setSizes('');
                                                }} 
                                            />
                                            <Label htmlFor="enable-sizes" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer">Available Sizes</Label>
                                        </div>
                                        <Input id="sizes" name="sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="e.g. C12 - C28" className="h-10 rounded-xl bg-white border-muted-foreground/20 text-sm disabled:opacity-50 disabled:bg-gray-100" disabled={!enabledSizes} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <Card className="sticky top-24">
                            <CardHeader className="border-b bg-muted/10">
                                <div className="flex items-center gap-2 text-foreground font-bold">
                                    <ImageIcon className="h-5 w-5 text-primary" />
                                    Product Imagery
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="w-full aspect-square border-2 border-dashed border-primary/20 rounded-xl flex items-center justify-center relative bg-primary/[0.02] group transition-all hover:bg-primary/[0.04] hover:border-primary/40 overflow-hidden">
                                    {imagePreview ? (
                                        <>
                                            <Image src={imagePreview} alt="Product preview" fill className="object-cover p-1" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                               <p className="text-white font-bold text-xs bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">Click to Replace</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="absolute top-2 right-2 h-8 w-8 rounded-lg shadow-lg z-10 bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImageFile(null);
                                                    setImagePreview(product?.imageUrl || null);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <div 
                                              className="absolute inset-0 cursor-pointer" 
                                              onClick={() => fileInputRef.current?.click()} 
                                            />
                                        </>
                                    ) : (
                                        <div
                                            className="text-center cursor-pointer p-4 w-full h-full flex flex-col items-center justify-center"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                                                <ImageIcon className="h-6 w-6 text-primary" />
                                            </div>
                                            <p className="text-sm font-bold text-foreground">Select Image</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">High-resolution JPG or PNG</p>
                                        </div>
                                    )}
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-8">
                    <Button variant="ghost" type="button" onClick={() => router.push('/admin/products')} disabled={isSubmitting} className="rounded-xl px-6 h-12 font-bold text-base">Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="rounded-xl px-10 h-12 font-black text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
