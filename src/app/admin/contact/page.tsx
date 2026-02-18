
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Mail, MapPin, Phone, Plus, Trash2 } from 'lucide-react';

type ContactInformation = {
    address: string;
    phoneNumbers: string[];
    emails: string[];
    // Fallback for old data migration
    phoneNumber?: string;
    email?: string;
};

type ContactInformationForm = {
    address: string;
    phoneNumbers: { value: string }[];
    emails: { value: string }[];
};

export default function ManageContactPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const contactInfoRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'contactInformation', 'main');
    }, [firestore]);

    const { data: contactInfo, isLoading: isLoadingData } = useDoc<ContactInformation>(contactInfoRef);
    
    const { control, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<ContactInformationForm>({
        defaultValues: {
            address: '',
            phoneNumbers: [{ value: '' }],
            emails: [{ value: '' }],
        }
    });

    const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
        control,
        name: "phoneNumbers"
    });

    const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
        control,
        name: "emails"
    });

    useEffect(() => {
        if (contactInfo) {
            // Handle migration from old single-string structure to array-of-objects structure
            const initialEmails = (contactInfo.emails && contactInfo.emails.length > 0)
                ? contactInfo.emails.map(v => ({ value: v }))
                : (contactInfo.email ? [{ value: contactInfo.email }] : [{ value: '' }]);
                
            const initialPhones = (contactInfo.phoneNumbers && contactInfo.phoneNumbers.length > 0)
                ? contactInfo.phoneNumbers.map(v => ({ value: v }))
                : (contactInfo.phoneNumber ? [{ value: contactInfo.phoneNumber }] : [{ value: '' }]);

            reset({
                address: contactInfo.address || '',
                emails: initialEmails,
                phoneNumbers: initialPhones,
            });
        }
    }, [contactInfo, reset]);

    const onSubmit = (data: ContactInformationForm) => {
        if (!contactInfoRef) return;
        
        // Transform back to string arrays for Firestore
        const formattedData = {
            address: data.address,
            phoneNumbers: data.phoneNumbers.map(item => item.value).filter(v => !!v),
            emails: data.emails.map(item => item.value).filter(v => !!v),
        };
        
        setDocumentNonBlocking(contactInfoRef, formattedData, { merge: true });
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
                <CardContent className="space-y-8">
                    <div className="space-y-2">
                        <Label htmlFor="address">Physical Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => <Input id="address" type="text" {...field} className="pl-10" />}
                            />
                        </div>
                    </div>

                    {/* Emails Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-bold">Email Addresses</Label>
                            <Button type="button" variant="outline" size="sm" onClick={() => appendEmail({ value: '' })}>
                                <Plus className="h-4 w-4 mr-1" /> Add Email
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {emailFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Controller
                                            name={`emails.${index}.value` as const}
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="email@example.com" className="pl-10" />}
                                        />
                                    </div>
                                    {emailFields.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Phone Numbers Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-bold">Phone Numbers</Label>
                            <Button type="button" variant="outline" size="sm" onClick={() => appendPhone({ value: '' })}>
                                <Plus className="h-4 w-4 mr-1" /> Add Phone
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {phoneFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start">
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Controller
                                            name={`phoneNumbers.${index}.value` as const}
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="+212 600 000 000" className="pl-10" />}
                                        />
                                    </div>
                                    {phoneFields.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
    </div>
  );
}
