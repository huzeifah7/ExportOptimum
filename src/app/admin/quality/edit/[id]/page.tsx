
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    const storage = getStorage();
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
            } else {
                setImagePreview(null);
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
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="aspect-square w-48" />
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
        if (!certRef) return;

        setIsSubmitting(true);

        try {
            let finalImageUrl = certification?.imageUrl || '';

            if (imageFile) {
                const imageStorageRef = ref(storage, `certifications/${certId}/${imageFile.name}`);
                await uploadBytes(imageStorageRef, imageFile);
                finalImageUrl = await getDownloadURL(imageStorageRef);
            }

            const updatedCertification = {
                name: name,
                imageUrl: finalImageUrl,
                description: `${name} certification logo`,
            };

            setDocumentNonBlocking(certRef, updatedCertification, { merge: true });

            toast({
                title: "Certification Updated",
                description: `${name} has been successfully updated.`,
            });

            router.push('/admin/quality');
        } catch (err) {
            console.error(err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update certification."
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
                            <Label htmlFor="cert-image">Certification Logo/Image</Label>
                            <Input
                                id="cert-image"
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                disabled={isSubmitting}
                            />
                            {imagePreview && (
                                <div className="mt-4 rounded-lg overflow-hidden border aspect-square w-48 relative">
                                    <Image
                                        src={imagePreview}
                                        alt="Image preview"
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6">
                        <Button variant="outline" type="button" onClick={() => router.push('/admin/quality')} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
