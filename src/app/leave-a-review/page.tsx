
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, CheckCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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

  const [formData, setFormData] = useState({
    author: '',
    company: '',
    role: '',
    reviewText: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not connect to the database.' });
      return;
    }
    
    setIsSubmitting(true);
    
    const newReview = {
      ...formData,
      status: 'active', // Set status to active to make it visible immediately
    };

    try {
      const testimonialsCollection = collection(firestore, 'clientTestimonials');
      addDocumentNonBlocking(testimonialsCollection, newReview);
      
      setIsSuccess(true);
      toast({
        title: 'Review Submitted!',
        description: 'Thank you for your feedback. Your review is now live.',
      });

    } catch (error) {
      console.error('Error submitting review:', error);
      toast({ variant: 'destructive', title: 'Submission Failed', description: 'Please try again later.' });
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
                        setIsSubmitting(false);
                    }} className="mt-8">
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
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Review</CardTitle>
                <CardDescription>Please fill out the form below. Your review will be submitted for approval.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="author">Your Full Name</Label>
                      <Input id="author" name="author" value={formData.author} onChange={handleChange} placeholder="e.g., Jane Doe" disabled={isSubmitting} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="e.g., Global Imports Inc." disabled={isSubmitting} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role / Title</Label>
                    <Input id="role" name="role" value={formData.role} onChange={handleChange} placeholder="e.g., Head of Procurement" disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reviewText">Your Review</Label>
                    <Textarea id="reviewText" name="reviewText" value={formData.reviewText} onChange={handleChange} placeholder="Share your thoughts on our partnership, product quality, and service..." className="min-h-[150px]" disabled={isSubmitting} required />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
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
