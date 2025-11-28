
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

type KeyFigureStats = {
    exportTons: number;
    employees: number;
    majorCustomers: number;
};

export default function ManageKeyFiguresPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const keyFiguresRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'keyFigures', 'main');
    }, [firestore]);

    const { data: keyFigures, isLoading: isLoadingData } = useDoc<KeyFigureStats>(keyFiguresRef);
    
    const { control, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<KeyFigureStats>();

    useEffect(() => {
        if (keyFigures) {
            reset(keyFigures);
        }
    }, [keyFigures, reset]);

    const onSubmit = (data: KeyFigureStats) => {
        if (!keyFiguresRef) return;

        // Ensure values are numbers before sending to Firestore
        const numericData = {
            exportTons: Number(data.exportTons),
            employees: Number(data.employees),
            majorCustomers: Number(data.majorCustomers),
        };
        
        setDocumentNonBlocking(keyFiguresRef, numericData, { merge: true });
        toast({
            title: "Key Figures Updated",
            description: "The new figures have been saved successfully.",
        });
    };

    if (isLoadingData) {
        return (
             <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-headline">Manage Key Figures</h1>
                    <Skeleton className="h-10 w-28" />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Homepage Statistics</CardTitle>
                        <CardDescription>Edit the numbers that appear on the homepage.</CardDescription>
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
                <h1 className="text-3xl font-bold font-headline">Manage Key Figures</h1>
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Figures
                </Button>
            </div>
            <Card>
                <CardHeader>
                <CardTitle>Homepage Statistics</CardTitle>
                <CardDescription>Edit the numbers that appear in the key figures section on the homepage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="exportTons">Tons of Yearly Export</Label>
                        <Controller
                            name="exportTons"
                            control={control}
                            defaultValue={keyFigures?.exportTons || 0}
                            render={({ field }) => <Input id="exportTons" type="number" {...field} />}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="employees">Employees</Label>
                        <Controller
                            name="employees"
                            control={control}
                            defaultValue={keyFigures?.employees || 0}
                            render={({ field }) => <Input id="employees" type="number" {...field} />}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="majorCustomers">Major Customers</Label>
                        <Controller
                            name="majorCustomers"
                            control={control}
                            defaultValue={keyFigures?.majorCustomers || 0}
                            render={({ field }) => <Input id="majorCustomers" type="number" {...field} />}
                        />
                    </div>
                </CardContent>
            </Card>
        </form>
    </div>
  );
}

    