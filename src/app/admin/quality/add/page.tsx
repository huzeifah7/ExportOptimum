'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function AddCertificationPage() {
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
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

            await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(imageRef);

            const newCertification = {
                id: certId,
                name: name,
                imageUrl: imageUrl,
                description: `${name} certification logo`,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await setDoc(newCertRef, newCertification);

            toast({
                title: "Certification Added",
                description: `${name} has been successfully added.`,
            });

            router.push('/admin/quality');
        } catch (error: any) {
            console.error("Error saving certification:", error);
            toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to save certification.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const isFormSubmittable = !isSubmitting && !isUserLoading && user && firestore && name && imageFile;

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/quality">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold font-headline">Add New Certification</h1>
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
                                <div className="text-center">
                                    {imagePreview ? (
                                        <div className="relative mx-auto w-48 h-48 bg-muted rounded-md p-4">
                                            <Image src={imagePreview} alt="Preview" fill className="rounded-md object-contain p-2" />
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                type="button"
                                                className="absolute -top-2 -right-2 bg-background rounded-full h-8 w-8 shadow-md" 
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
                                        <>
                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <label
                                                    htmlFor="cert-image"
                                                    className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                                                >
                                                    <span>Upload a file</span>
                                                    <Input 
                                                        id="cert-image" 
                                                        type="file" 
                                                        className="sr-only" 
                                                        onChange={handleImageChange} 
                                                        required 
                                                        ref={fileInputRef} 
                                                        accept="image/*" 
                                                        disabled={isSubmitting}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, SVG up to 5MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6">
                        <Button variant="outline" type="button" onClick={() => router.push('/admin/quality')} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={!isFormSubmittable}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Saving..." : "Save Certification"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
