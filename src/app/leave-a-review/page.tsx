
'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useFirestore } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, CheckCircle, Award, ImageIcon, X, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};

export default function LeaveReviewPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    author: '',
    company: '',
    role: '',
    reviewText: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: 'destructive', title: 'File too large', description: 'Please select an image smaller than 2MB.' });
        return;
      }
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
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not connect to the database.' });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const testimonialsCollection = collection(firestore, 'clientTestimonials');
      const newReviewRef = doc(testimonialsCollection);
      const reviewId = newReviewRef.id;
      
      let photoUrl = '';

      if (imageFile) {
        const storage = getStorage();
        const path = `testimonials/${reviewId}/${imageFile.name}`;
        const imgRef = storageRef(storage, path);
        await uploadBytes(imgRef, imageFile);
        photoUrl = await getDownloadURL(imgRef);
      }

      const newReview = {
        ...formData,
        id: reviewId,
        photoUrl,
        status: 'not active',
        createdAt: serverTimestamp(),
      };

      await setDoc(newReviewRef, newReview);
      
      setIsSuccess(true);
      toast({
        title: 'Review Submitted!',
        description: 'Thank you for your feedback. Your review has been submitted for approval.',
      });

    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({ variant: 'destructive', title: 'Submission Failed', description: error.message || 'Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSuccess) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow flex items-center justify-center py-20">
                 <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 max-w-lg mx-auto"
                >
                    <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-primary/10 mb-6 border-4 border-background shadow-lg">
                        <CheckCircle className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold font-headline text-foreground">Thank You!</h1>
                    <p className="text-muted-foreground mt-4 text-lg">
                        Your feedback is invaluable to us. We've received your review and our team will look it over shortly. We appreciate you taking the time to share your experience.
                    </p>
                    <Button onClick={() => {
                        setIsSuccess(false);
                        setFormData({ author: '', company: '', role: '', reviewText: '' });
                        setImageFile(null);
                        setImagePreview(null);
                        setIsSubmitting(false);
                    }} className="mt-8 rounded-xl px-8">
                        Submit Another Review
                    </Button>
                </motion.div>
            </main>
            <Footer />
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <motion.div
          className="container mx-auto px-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.div variants={itemVariants} className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                <Award className="h-10 w-10 text-primary" />
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-headline font-bold text-foreground">
              Share Your Experience
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-4 text-lg text-muted-foreground">
              Your feedback helps us grow and improve. If you've had a positive experience working with Export Optimum, we'd love to hear about it.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="mt-12 max-w-3xl mx-auto">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white">
              <CardHeader className="bg-primary/5 border-b border-primary/10 p-8">
                <CardTitle className="text-2xl font-headline font-bold">Submit Your Review</CardTitle>
                <CardDescription>Please fill out the form below. Your review will be submitted for approval.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Full Name</Label>
                      <Input id="author" name="author" value={formData.author} onChange={handleChange} placeholder="e.g., Jane Doe" disabled={isSubmitting} required className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Company Name</Label>
                      <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="e.g., Global Imports Inc." disabled={isSubmitting} required className="rounded-xl h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Role / Title</Label>
                    <Input id="role" name="role" value={formData.role} onChange={handleChange} placeholder="e.g., Head of Procurement" disabled={isSubmitting} className="rounded-xl h-12" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Profile Photo (Optional)</Label>
                    <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-muted px-6 py-8 transition-colors hover:border-primary/30 group bg-muted/5 relative">
                      <div className="text-center w-full">
                        {imagePreview ? (
                          <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white group">
                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                               <p className="text-white text-[10px] font-bold uppercase">Change</p>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              type="button"
                              className="absolute top-0 right-0 rounded-full h-7 w-7 shadow-lg translate-x-1 -translate-y-1" 
                              onClick={(e) => { e.preventDefault(); resetImage(); }}
                            >
                              <X className="h-3.5 w-3.5"/>
                            </Button>
                            <div 
                              className="absolute inset-0 cursor-pointer" 
                              onClick={() => fileInputRef.current?.click()} 
                            />
                          </div>
                        ) : (
                          <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                            <div className="mx-auto h-12 w-12 bg-primary/5 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <UploadCloud className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-xs leading-6 text-gray-600">
                              <span className="font-bold text-primary">Upload a photo</span>
                              <p className="text-muted-foreground mt-1">Professional portrait recommended</p>
                            </div>
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
                    <Label htmlFor="reviewText" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Review</Label>
                    <Textarea id="reviewText" name="reviewText" value={formData.reviewText} onChange={handleChange} placeholder="Share your thoughts on our partnership, product quality, and service..." className="min-h-[150px] rounded-2xl p-4 resize-none" disabled={isSubmitting} required />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" disabled={isSubmitting} className="rounded-full px-10 h-14 font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          Submit Review <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
