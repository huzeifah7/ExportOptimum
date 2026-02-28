'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AddCertificationPage() {
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!firestore || !user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to add a certification.' });
            return;
        }

        if (!imageFile) {
            toast({ variant: 'destructive', title: 'Logo Required', description: 'Please select a certification logo.' });
            return;
        }

        setIsSubmitting(true);

        try {
            const certsCollection = collection(firestore, 'qualityCertifications');
            const newCertRef = doc(certsCollection);
            const certId = newCertRef.id;

            const storage = getStorage();
            const path = `certifications/${certId}/${imageFile.name}`;
            const imageRef = storageRef(storage, path);

            // Storage upload is awaited to get the URL
            await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(imageRef);

            const newCertification = {
                id: certId,
                name: name,
                imageUrl: imageUrl,
                description: description || `${name} certification logo`,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Non-blocking Firestore write
            setDoc(newCertRef, newCertification)
                .catch(async (serverError) => {
                    const permissionError = new FirestorePermissionError({
                        path: newCertRef.path,
                        operation: 'create',
                        requestResourceData: newCertification,
                    });
                    errorEmitter.emit('permission-error', permissionError);
                });

            toast({
                title: "Certification Added",
                description: `${name} has been successfully added.`,
            });

            router.push('/admin/quality');
        } catch (error: any) {
            console.error("Error saving certification:", error);
            toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to save certification.' });
            setIsSubmitting(false);
        }
    };
    
    const isFormSubmittable = !isSubmitting && !isUserLoading && user && firestore && name && imageFile;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/quality">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold font-headline">Add New Certification</h1>
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
                                placeholder="Briefly describe the significance of this certification..." 
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
                                            <Image src={imagePreview} alt="Preview" fill className="rounded-xl object-contain p-2" />
                                            <Button 
                                                variant="destructive" 
                                                size="icon" 
                                                type="button"
                                                className="absolute -top-2 -right-2 rounded-full h-8 w-8 shadow-lg" 
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview(null);
                                                    if(fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                            >
                                                <X className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                                            <div className="mx-auto h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <UploadCloud className="h-8 w-8 text-primary" />
                                            </div>
                                            <div className="text-sm leading-6 text-gray-600">
                                                <span className="font-bold text-primary">Click to upload</span>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG up to 5MB</p>
                                            </div>
                                            <Input 
                                                id="cert-image" 
                                                type="file" 
                                                className="hidden" 
                                                onChange={handleImageChange} 
                                                required 
                                                ref={fileInputRef} 
                                                accept="image/*" 
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t bg-muted/10 p-6 rounded-b-2xl">
                        <Button variant="ghost" type="button" onClick={() => router.push('/admin/quality')} disabled={isSubmitting} className="rounded-xl">Cancel</Button>
                        <Button type="submit" disabled={!isFormSubmittable} className="rounded-xl px-8 shadow-md">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : "Save Certification"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}