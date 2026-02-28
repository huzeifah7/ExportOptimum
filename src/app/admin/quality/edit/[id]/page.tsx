'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type Certification = {
    id: string;
    name: string;
    imageUrl?: string;
    description?: string;
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
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (certification) {
            setName(certification.name || '');
            setDescription(certification.description || '');
            if (certification.imageUrl) {
                setImagePreview(certification.imageUrl);
            }
        }
    }, [certification]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Failed to load certification</h1>
                <Button variant="outline" onClick={() => router.push("/admin/quality")} className="rounded-xl">
                    Back to List
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-9 w-48 rounded-lg" />
                </div>
                <Card className="rounded-2xl overflow-hidden border-border/50">
                    <CardHeader><Skeleton className="h-8 w-40" /></CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-10 w-full rounded-xl" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                        <Skeleton className="h-40 w-full rounded-xl" />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6 bg-muted/5">
                        <Skeleton className="h-10 w-24 rounded-xl" />
                        <Skeleton className="h-10 w-28 rounded-xl" />
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (!isLoading && !certification) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Certification Not Found</h1>
                <Button variant="outline" onClick={() => router.push("/admin/quality")} className="rounded-xl">
                    Back to List
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
                description: description || `${name} certification logo`,
                updatedAt: serverTimestamp(),
            };

            // Non-blocking Firestore update
            updateDoc(certRef, updatedCertification)
                .catch(async (serverError) => {
                    const permissionError = new FirestorePermissionError({
                        path: certRef.path,
                        operation: 'update',
                        requestResourceData: updatedCertification,
                    });
                    errorEmitter.emit('permission-error', permissionError);
                });

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
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/quality">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold font-headline">Edit Certification</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <Card className="rounded-2xl shadow-lg border-border/50">
                    <CardHeader>
                        <CardTitle className="text-xl font-headline">Certification Details</CardTitle>
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
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cert-desc">Description (Optional)</Label>
                            <Textarea 
                                id="cert-desc" 
                                placeholder="Briefly describe the significance..." 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSubmitting}
                                className="rounded-xl min-h-[100px] resize-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <Label>Certification Logo</Label>
                            <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-muted px-6 py-10 transition-colors hover:border-primary/30 group">
                                <div className="text-center w-full">
                                    {imagePreview ? (
                                        <div className="relative mx-auto w-48 h-48 bg-muted/30 rounded-2xl p-4">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-contain p-2 rounded-xl"
                                            />
                                            <Button 
                                                variant="destructive" 
                                                size="icon" 
                                                type="button"
                                                className="absolute -top-2 -right-2 rounded-full h-8 w-8 shadow-lg" 
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
                                        <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:scale-110 transition-transform" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                                <span className="font-bold text-primary">Change Logo</span>
                                                <Input
                                                    id="cert-image"
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t bg-muted/10 p-6 rounded-b-2xl">
                        <Button variant="ghost" type="button" onClick={() => router.push('/admin/quality')} disabled={isSubmitting} className="rounded-xl">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8 shadow-md">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}