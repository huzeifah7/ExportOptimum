
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
import { Edit, Trash2, PlusCircle, AlertCircle } from 'lucide-react';
import { ReviewModal } from '@/components/admin/ReviewModal';

export type Review = {
  id: string;
  author: string;
  company: string;
  role: string;
  reviewText: string;
  status: 'active' | 'not active';
};

const ReviewCardSkeleton = () => (
  <Card className="flex flex-col">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="flex-grow space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </CardContent>
    <CardFooter className="flex justify-between items-center">
      <Skeleton className="h-6 w-20" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
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
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Manage Client Reviews</h1>
            <p className="text-sm text-muted-foreground mt-1">Review, approve, or edit client testimonials.</p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Review
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && reviews && reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className={`flex flex-col transition-all duration-300 ${review.status === 'not active' ? 'border-amber-200 bg-amber-50/30' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="font-headline">{review.author}</CardTitle>
                    {review.status === 'not active' && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Pending
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">{review.role}, {review.company}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <blockquote className="italic text-muted-foreground text-sm">
                  "{review.reviewText}"
                </blockquote>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-4 border-t border-border/10">
                <Badge variant={review.status === 'active' ? 'default' : 'secondary'}>
                  {review.status === 'active' ? 'Published' : 'Hidden'}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(review)} className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(review.id, review.author)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
       {!isLoading && (!reviews || reviews.length === 0) && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold text-muted-foreground">No Reviews Found</h3>
            <p className="text-muted-foreground mt-2">Get started by adding a new client review.</p>
            <Button className="mt-4" onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Review
            </Button>
        </div>
      )}
      
      <ReviewModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        review={currentReview}
      />
    </>
  );
}
