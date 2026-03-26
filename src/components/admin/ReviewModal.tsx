
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { Loader2, Camera, X, UploadCloud } from 'lucide-react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Review } from '@/app/admin/reviews/page';
import Image from 'next/image';

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
  photoUrl: '',
  status: 'not active' as 'active' | 'not active',
};

export function ReviewModal({ isOpen, onClose, onSave, review }: ReviewModalProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (review) {
      setFormData({
        author: review.author,
        company: review.company,
        role: review.role,
        reviewText: review.reviewText,
        photoUrl: review.photoUrl || '',
        status: review.status,
      });
      setImagePreview(review.photoUrl || null);
    } else {
      setFormData(initialFormData);
      setImagePreview(null);
    }
    setImageFile(null);
  }, [review, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleStatusChange = (checked: boolean) => {
    setFormData(prev => ({...prev, status: checked ? 'active' : 'not active'}));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImageFile(null);
    setImagePreview(review?.photoUrl || null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

    try {
        const isEditing = !!review;
        const reviewId = isEditing ? review.id : doc(collection(firestore, 'clientTestimonials')).id;
        let photoUrl = formData.photoUrl;

        if (imageFile) {
            const storage = getStorage();
            const path = `testimonials/${reviewId}/${imageFile.name}`;
            const imgRef = storageRef(storage, path);
            await uploadBytes(imgRef, imageFile);
            photoUrl = await getDownloadURL(imgRef);
        }

        const reviewData = { 
            ...formData, 
            id: reviewId,
            photoUrl,
            updatedAt: serverTimestamp(),
            ...(isEditing ? {} : { createdAt: serverTimestamp() })
        };
        
        await setDoc(doc(firestore, 'clientTestimonials', reviewId), reviewData, { merge: true });
    
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
      <DialogContent className="sm:max-w-[500px] p-0 rounded-3xl overflow-hidden border-none shadow-2xl">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-black">{review ? 'Edit Review' : 'Add New Review'}</DialogTitle>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Author's Name</Label>
              <Input id="author" name="author" value={formData.author} onChange={handleChange} required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Company</Label>
              <Input id="company" name="company" value={formData.company} onChange={handleChange} required className="rounded-xl" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Author's Role</Label>
            <Input id="role" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. CEO, Head of Procurement" className="rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Author Photo</Label>
            <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-muted px-6 py-6 transition-colors hover:border-primary/30 group bg-muted/5 relative">
              <div className="text-center w-full">
                {imagePreview ? (
                  <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      type="button"
                      className="absolute top-0 right-0 rounded-full h-6 w-6 shadow-md translate-x-1 -translate-y-1" 
                      onClick={(e) => { e.preventDefault(); resetImage(); }}
                    >
                      <X className="h-3 w-3"/>
                    </Button>
                    <div 
                      className="absolute inset-0 cursor-pointer bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" 
                      onClick={() => fileInputRef.current?.click()} 
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                    <div className="mx-auto h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-[10px] font-bold text-primary uppercase">Upload Photo</p>
                    <Input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      onChange={handleImageChange} 
                      accept="image/*" 
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewText" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Review Text</Label>
            <Textarea id="reviewText" name="reviewText" value={formData.reviewText} onChange={handleChange} required className="min-h-[100px] rounded-xl resize-none" />
          </div>

          <div className="flex items-center space-x-2 bg-primary/5 p-4 rounded-2xl border border-primary/10">
            <Switch id="status" checked={formData.status === 'active'} onCheckedChange={handleStatusChange} />
            <div className="flex flex-col">
                <Label htmlFor="status" className="font-bold text-sm">Published Status</Label>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Visible on live site when active</span>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="rounded-xl">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8 shadow-md">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : 'Save Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
