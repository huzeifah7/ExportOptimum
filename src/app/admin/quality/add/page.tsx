
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function AddCertificationPage() {
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();

    const [name, setName] = useState('');
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!firestore || !user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to add a certification.' });
            return;
        }

        const newCertification = {
            name: name,
            imageUrl: imagePreview,
            description: `${name} certification logo`,
        };

        const certsCollection = collection(firestore, 'qualityCertifications');
        addDocumentNonBlocking(certsCollection, newCertification);

        toast({
          title: "Certification Added",
          description: `${name} has been successfully added.`,
        });

        router.push('/admin/quality');
    };
    
    const isFormSubmittable = !isUserLoading && user && firestore && name && imagePreview;


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
                            />
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="cert-image">Certification Logo/Image</Label>
                            <Input id="cert-image" type="file" accept="image/*" onChange={handleImageChange} required/>
                            {imagePreview && (
                                <div className="mt-4 rounded-lg overflow-hidden border aspect-square w-48 relative">
                                    <Image src={imagePreview} alt="Image preview" fill className="object-contain p-2" />
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6">
                        <Button variant="outline" type="button" onClick={() => router.push('/admin/quality')}>Cancel</Button>
                        <Button type="submit" disabled={!isFormSubmittable}>
                            {!isFormSubmittable && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Certification
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
