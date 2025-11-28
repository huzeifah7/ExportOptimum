
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

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

    const certRef = useMemoFirebase(() => {
        if (!certId || !firestore) return null;
        return doc(firestore, 'qualityCertifications', certId);
    }, [firestore, certId]);

    const { data: certification, isLoading } = useDoc<Certification>(certRef);

    const [name, setName] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (certification) {
            setName(certification.name);
            if(certification.imageUrl) {
                setImagePreview(certification.imageUrl);
            }
        }
    }, [certification]);

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
        )
    }

    if (!certification && !isLoading) {
        notFound();
    }
    
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
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

        const updatedCertification = {
            name: name,
            imageUrl: imagePreview,
            description: `${name} certification logo`,
        };

        setDocumentNonBlocking(certRef, updatedCertification, { merge: true });

        toast({
            title: "Certification Updated",
            description: `${name} has been successfully updated.`,
        });

        router.push('/admin/quality');
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
                            />
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="cert-image">Certification Logo/Image</Label>
                            <Input id="cert-image" type="file" accept="image/*" onChange={handleImageChange} />
                            {imagePreview && (
                                <div className="mt-4 rounded-lg overflow-hidden border aspect-square w-48 relative">
                                    <Image src={imagePreview} alt="Image preview" fill className="object-contain p-2" />
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6">
                        <Button variant="outline" type="button" onClick={() => router.push('/admin/quality')}>Cancel</Button>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
