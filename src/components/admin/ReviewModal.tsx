
'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Review } from '@/app/admin/reviews/page';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  review: Review | null;
}

const initialFormData = {
  author: '',
  company: '',
  role: '',
  reviewText: '',
  status: 'not active' as 'active' | 'not active',
};

export function ReviewModal({ isOpen, onClose, onSave, review }: ReviewModalProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (review) {
      setFormData({
        author: review.author,
        company: review.company,
        role: review.role,
        reviewText: review.reviewText,
        status: review.status,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [review, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleStatusChange = (checked: boolean) => {
    setFormData(prev => ({...prev, status: checked ? 'active' : 'not active'}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Database not available.' });
      return;
    }
    
    if(!formData.author || !formData.company || !formData.reviewText){
        toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill out all required fields.' });
        return;
    }

    setIsSubmitting(true);

    const isEditing = !!review;
    const reviewData = { ...formData };
    
    try {
        if(isEditing) {
            const docRef = doc(firestore, 'clientTestimonials', review.id);
            setDocumentNonBlocking(docRef, reviewData, { merge: true });
        } else {
            const collectionRef = collection(firestore, 'clientTestimonials');
            addDocumentNonBlocking(collectionRef, reviewData);
        }
    
        toast({
            title: `Review ${isEditing ? 'Updated' : 'Added'}`,
            description: `The review by ${formData.author} has been saved.`,
        });

        onSave();
        onClose();

    } catch (error: any) {
        console.error("Failed to save review:", error);
        toast({ variant: 'destructive', title: 'Error saving review', description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{review ? 'Edit Review' : 'Add New Review'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author's Name</Label>
              <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="role">Author's Role</Label>
              <Input id="role" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. CEO, Head of Procurement" />
            </div>
          <div className="space-y-2">
            <Label htmlFor="reviewText">Review Text</Label>
            <Textarea id="reviewText" name="reviewText" value={formData.reviewText} onChange={handleChange} required className="min-h-[100px]" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="status" checked={formData.status === 'active'} onCheckedChange={handleStatusChange} />
            <Label htmlFor="status">Active</Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : 'Save Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
