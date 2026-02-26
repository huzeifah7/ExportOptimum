'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

type Certification = {
    id: string;
    name: string;
    imageUrl?: string;
};

export default function EditCertificationPage() {
    const router = useRouter();
    const params = useParams();
    const certId = params.id as string;
    const firestore = useFirestore();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const certRef = useMemoFirebase(() => {
        if (!certId || !firestore) return null;
        return doc(firestore, 'qualityCertifications', certId);
    }, [firestore, certId]);

    const { data: certification, isLoading, error } = useDoc<Certification>(certRef);

    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (certification) {
            setName(certification.name);
            if (certification.imageUrl) {
                setImagePreview(certification.imageUrl);
            }
        }
    }, [certification]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h1 className="text-2xl font-semibold mb-4">Failed to load certification</h1>
                <Button variant="outline" onClick={() => router.push("/admin/quality")}>
                    Go back
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-9 w-48" />
                </div>
                <Card>
                    <CardHeader><Skeleton className="h-8 w-40" /></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-28" />
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (!isLoading && !certification) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h1 className="text-2xl font-semibold mb-4">Certification Not Found</h1>
                <Button variant="outline" onClick={() => router.push("/admin/quality")}>
                    Go back
                </Button>
            </div>
        );
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!certRef || !firestore) return;

        setIsSubmitting(true);

        try {
            let finalImageUrl = certification?.imageUrl || '';

            if (imageFile) {
                const storage = getStorage();
                const path = `certifications/${certId}/${imageFile.name}`;
                const imageRef = storageRef(storage, path);
                await uploadBytes(imageRef, imageFile);
                finalImageUrl = await getDownloadURL(imageRef);
            }

            const updatedCertification = {
                name: name,
                imageUrl: finalImageUrl,
                description: `${name} certification logo`,
                updatedAt: serverTimestamp(),
            };

            await updateDoc(certRef, updatedCertification);

            toast({
                title: "Certification Updated",
                description: `${name} has been successfully updated.`,
            });

            router.push('/admin/quality');
        } catch (err: any) {
            console.error(err);
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || "Failed to update certification."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/quality">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold font-headline">Edit Certification</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Certification Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="cert-name">Certification Name</Label>
                            <Input
                                id="cert-name"
                                placeholder="e.g., Global G.A.P."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-4">
                            <Label>Certification Logo/Image</Label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                                <div className="text-center w-full">
                                    {imagePreview ? (
                                        <div className="relative mx-auto w-48 h-48 bg-muted rounded-md p-4">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-contain p-2"
                                            />
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                type="button"
                                                className="absolute -top-2 -right-2 bg-background rounded-full h-8 w-8 shadow-md" 
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview(certification?.imageUrl || null);
                                                    if(fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                            >
                                                <X className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                                <label
                                                    htmlFor="cert-image"
                                                    className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                                                >
                                                    <span>Change Logo</span>
                                                    <Input
                                                        id="cert-image"
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        className="sr-only"
                                                        onChange={handleImageChange}
                                                        disabled={isSubmitting}
                                                    />
                                                </label>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6">
                        <Button variant="outline" type="button" onClick={() => router.push('/admin/quality')} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
