
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Mail, MapPin, Phone } from 'lucide-react';

type ContactInformation = {
    address: string;
    phoneNumber: string;
    email: string;
};

export default function ManageContactPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const contactInfoRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'contactInformation', 'main');
    }, [firestore]);

    const { data: contactInfo, isLoading: isLoadingData } = useDoc<ContactInformation>(contactInfoRef);
    
    const { control, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<ContactInformation>();

    useEffect(() => {
        if (contactInfo) {
            reset(contactInfo);
        }
    }, [contactInfo, reset]);

    const onSubmit = (data: ContactInformation) => {
        if (!contactInfoRef) return;
        
        setDocumentNonBlocking(contactInfoRef, data, { merge: true });
        toast({
            title: "Contact Information Updated",
            description: "The details have been saved successfully.",
        });
    };

    if (isLoadingData) {
        return (
             <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-headline">Manage Contact Info</h1>
                    <Skeleton className="h-10 w-28" />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Website Contact Details</CardTitle>
                        <CardDescription>Edit the contact information displayed on your website.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-32" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-40" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-headline">Manage Contact Info</h1>
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
            <Card>
                <CardHeader>
                <CardTitle>Website Contact Details</CardTitle>
                <CardDescription>Edit the contact information that appears in the site's footer and contact page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Controller
                                name="address"
                                control={control}
                                defaultValue={contactInfo?.address || ''}
                                render={({ field }) => <Input id="address" type="text" {...field} className="pl-10" />}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Controller
                                name="phoneNumber"
                                control={control}
                                defaultValue={contactInfo?.phoneNumber || ''}
                                render={({ field }) => <Input id="phoneNumber" type="tel" {...field} className="pl-10" />}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Controller
                                name="email"
                                control={control}
                                defaultValue={contactInfo?.email || ''}
                                render={({ field }) => <Input id="email" type="email" {...field} className="pl-10" />}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
    </div>
  );
}
