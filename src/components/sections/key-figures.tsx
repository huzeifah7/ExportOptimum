
'use client';

import { Ship, Users, Globe } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type KeyFigureStats = {
  id: string;
  exportTons: number;
  employees: number;
  majorCustomers: number;
};

const StatCard = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
    <div className="flex flex-col items-center justify-center p-4">
        {icon}
        <div className='mt-2 text-center'>
            <p className="text-2xl md:text-4xl font-bold font-headline text-foreground">{value}</p>
            <p className="text-[16px] text-foreground text-shadow-lg">{label}</p>
        </div>
    </div>
);

const StatSkeleton = () => (
    <div className="flex flex-col items-center justify-center p-4">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className='mt-2 text-center w-full'>
            <Skeleton className="h-9 w-20 mx-auto" />
            <Skeleton className="h-5 w-40 mx-auto mt-1" />
        </div>
    </div>
);


export default function KeyFigures() {
    const firestore = useFirestore();

    const keyFiguresRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'keyFigures', 'main');
    }, [firestore]);

    const { data: keyFigures, isLoading } = useDoc<KeyFigureStats>(keyFiguresRef);

    const formatNumber = (num: number | undefined) => {
      if (num === undefined) return '0+';
      return num.toLocaleString() + '+';
    }

    const stats = [
      { icon: <Ship className="w-8 h-8 text-brand" />, value: formatNumber(keyFigures?.exportTons), label: 'Tons of yearly export' },
      { icon: <Users className="w-8 h-8 text-brand" />, value: formatNumber(keyFigures?.employees), label: 'Employees' },
      { icon: <Globe className="w-8 h-8 text-brand" />, value: formatNumber(keyFigures?.majorCustomers), label: 'Major Customers' },
    ];

    return (
        <div className="relative z-10 -mt-16 mb-16">
            <div className="container mx-auto px-4">
                <div className="w-full max-w-5xl mx-auto bg-background/80 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    {isLoading ? (
                        <>
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                        </>
                    ) : (
                        stats.map((stat, index) => (
                           <StatCard key={index} {...stat} />
                        ))
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}

    