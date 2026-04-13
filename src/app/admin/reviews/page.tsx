
'use client';

import React, { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Edit, Trash2, PlusCircle, AlertCircle, User } from 'lucide-react';
import { ReviewModal } from '@/components/admin/ReviewModal';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type Review = {
  id: string;
  author: string;
  company: string;
  role: string;
  reviewText: string;
  photoUrl?: string;
  status: 'active' | 'not active';
};

const ReviewCardSkeleton = () => (
  <Card className="flex flex-col rounded-2xl border-border/50">
    <CardHeader className="flex flex-row items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CardHeader>
    <CardContent className="flex-grow space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </CardContent>
    <CardFooter className="flex justify-between items-center pt-4 border-t">
      <Skeleton className="h-6 w-20 rounded-full" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </CardFooter>
  </Card>
);

export default function ManageReviewsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'clientTestimonials');
  }, [firestore]);

  const { data: reviews, isLoading } = useCollection<Review>(reviewsQuery);

  const handleAddNew = () => {
    setCurrentReview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (review: Review) => {
    setCurrentReview(review);
    setIsModalOpen(true);
  };

  const handleDelete = (reviewId: string, author: string) => {
    if (!firestore) return;
    if (window.confirm(`Are you sure you want to delete the review by "${author}"?`)) {
      const docRef = doc(firestore, 'clientTestimonials', reviewId);
      deleteDocumentNonBlocking(docRef);
      toast({
        title: 'Review Deleted',
        description: `The review by ${author} has been removed.`,
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentReview(null);
  };
  
  const handleSave = () => {
     // The list will auto-refresh due to the useCollection hook
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Manage Client Reviews</h1>
            <p className="text-sm text-muted-foreground mt-1">Moderate, publish, or edit client testimonials.</p>
        </div>
        <Button onClick={handleAddNew} className="rounded-xl shadow-md">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Review
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className={`flex flex-col transition-all duration-300 rounded-2xl border-border/50 group hover:shadow-lg ${review.status === 'not active' ? 'border-amber-200 bg-amber-50/30' : 'bg-white'}`}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-border/10">
                  <AvatarImage src={review.photoUrl} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary font-black">
                    {review.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <CardTitle className="font-headline text-lg truncate leading-tight">{review.author}</CardTitle>
                        {review.status === 'not active' && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight py-0">
                                <AlertCircle className="w-2.5 h-2.5" />
                                Pending
                            </Badge>
                        )}
                    </div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold truncate">{review.role}, {review.company}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-2">
                <blockquote className="italic text-muted-foreground text-sm leading-relaxed line-clamp-4 whitespace-pre-wrap">
                  "{review.reviewText}"
                </blockquote>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-4 border-t border-border/50">
                <Badge variant={review.status === 'active' ? 'default' : 'secondary'} className="text-[10px] uppercase font-black">
                  {review.status === 'active' ? 'Published' : 'Hidden'}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(review)} className="h-9 w-9 p-0 rounded-lg">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(review.id, review.author)}
                    className="h-9 w-9 p-0 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/5">
            <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No Reviews Found</h3>
            <p className="text-muted-foreground mt-2 mb-6">Start growing your reputation by adding client testimonials.</p>
            <Button onClick={handleAddNew} className="rounded-xl px-8 shadow-md">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Review
            </Button>
        </div>
      )}
      
      <ReviewModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        review={currentReview}
      />
    </div>
  );
}
