
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2, CheckCircle, Mail, Phone, MapPin, Building, Globe, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AnimatedGradientBackground } from '@/components/ui/animated-gradient-background';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

const faqItems = [
    {
        question: "What are your main export products?",
        answer: "We specialize in premium Moroccan Hass avocados, but also export a variety of other high-quality produce including berries and citrus fruits. Please contact us for a detailed product list."
    },
    {
        question: "Which countries do you export to?",
        answer: "We have a robust logistics network and primarily export to partners across Europe, including the Netherlands, France, Spain, and the UK. We are always open to exploring new markets."
    },
    {
        question: "What quality certifications do you have?",
        answer: "Export Optimum is fully certified with GlobalG.A.P., BRC, and SMETA. This ensures our produce meets the highest international standards for safety, quality, and ethical practices."
    },
    {
        question: "Can we visit your facilities?",
        answer: "Absolutely. We encourage our partners to visit our orchards and state-of-the-art packing station in Morocco. Please get in touch to arrange a visit."
    }
]

type ContactInformation = {
    address: string;
    phoneNumbers?: string[];
    emails?: string[];
    // For old data
    phoneNumber?: string;
    email?: string;
};


const ContactPage = () => {
  const firestore = useFirestore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    subject: '',
    message: '',
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const contactInfoRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'contactInformation', 'main');
  }, [firestore]);

  const { data: contactInfo, isLoading: isLoadingContact } = useDoc<ContactInformation>(contactInfoRef);

  const emails = contactInfo?.emails && contactInfo.emails.length > 0 
    ? contactInfo.emails 
    : (contactInfo?.email ? [contactInfo.email] : []);
    
  const phoneNumbers = contactInfo?.phoneNumbers && contactInfo.phoneNumbers.length > 0
    ? contactInfo.phoneNumbers
    : (contactInfo?.phoneNumber ? [contactInfo.phoneNumber] : []);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const { fullName, email, country, subject, message } = formData;
    if (!fullName || !email || !subject || !message) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!firestore) {
      setError('Message service is not available. Please try again later.');
      return;
    }
    
    setIsSubmitting(true);
    try {
        const messagesCollection = collection(firestore, 'messages');
        addDocumentNonBlocking(messagesCollection, { ...formData, createdAt: serverTimestamp() });
        setSuccessMessage('Your message has been sent successfully! Our team will get back to you shortly.');
        setFormData({ fullName: '', email: '', country: '', subject: '', message: '' });
    } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const PageContent = () => (
     <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
            {/* Hero Section */}
            <motion.section
                className="py-24 lg:py-32 text-center"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="container mx-auto px-4">
                  <div className="inline-block relative">
                    <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-headline font-bold text-foreground tracking-tight">
                        Let's <span className="text-primary">Connect</span>
                    </motion.h1>
                    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: "circOut" }} className="absolute -bottom-2 left-0 right-0 h-4 origin-left">
                        <svg viewBox="0 0 200 12" preserveAspectRatio="none" className="w-full h-full text-primary">
                            <path d="M 1 6 C 30 12, 170 0, 199 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                    </motion.div>
                  </div>

                  <motion.p variants={itemVariants} className="mt-8 max-w-2xl mx-auto text-lg text-muted-foreground">
                      We're ready to answer your questions and explore how we can meet your needs for premium Moroccan produce.
                  </motion.p>
                </div>
            </motion.section>

            {/* Main Content Section */}
            <motion.section
                 className="pb-24 lg:pb-32"
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, amount: 0.1 }}
                 variants={containerVariants}
            >
                <div className="container mx-auto px-4">
                    <div className="bg-background/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/20 overflow-hidden">
                        <div className="grid lg:grid-cols-2">
                            {/* Form Side */}
                            <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-border/10">
                                <motion.h2 variants={itemVariants} className="text-3xl font-bold font-headline mb-8 text-foreground">Send Us a Message</motion.h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && <motion.div variants={itemVariants} className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm shadow-inner">{error}</motion.div>}
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" disabled={isSubmitting} required />
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" disabled={isSubmitting} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="country">Country</Label>
                                            <Input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="e.g. Netherlands" disabled={isSubmitting} />
                                        </div>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Inquiry about Hass Avocados" disabled={isSubmitting} required />
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Please describe your requirements..." className="min-h-[140px]" disabled={isSubmitting} required />
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <Button type="submit" size="lg" className="w-full text-lg py-7 rounded-xl font-bold" disabled={isSubmitting}>
                                            {isSubmitting ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : 'Send Message'}
                                        </Button>
                                    </motion.div>
                                </form>
                            </div>
                            {/* Info Side */}
                            <div className="p-8 md:p-12">
                                <motion.h3 variants={itemVariants} className="text-2xl font-bold font-headline mb-8 text-foreground">Contact Information</motion.h3>
                                 {isLoadingContact ? (
                                    <motion.div variants={itemVariants} className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <Skeleton className="h-5 w-5 mt-1" />
                                            <div>
                                                <Skeleton className="h-5 w-20 mb-1" />
                                                <Skeleton className="h-4 w-40" />
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Skeleton className="h-5 w-5 mt-1" />
                                            <div>
                                                <Skeleton className="h-5 w-20 mb-1" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Skeleton className="h-5 w-5 mt-1" />
                                            <div>
                                                <Skeleton className="h-5 w-20 mb-1" />
                                                <Skeleton className="h-10 w-48" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                <motion.div variants={itemVariants} className="space-y-8 text-muted-foreground">
                                    <div className="flex items-start gap-4">
                                        <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                        <div className="space-y-1">
                                            <p className="font-semibold text-foreground">Email</p>
                                            {emails.map((email, idx) => (
                                                <a key={idx} href={`mailto:${email}`} className="block hover:text-primary transition-colors">{email}</a>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                        <div className="space-y-1">
                                            <p className="font-semibold text-foreground">Phone</p>
                                            {phoneNumbers.map((phone, idx) => (
                                                <span key={idx} className="block">{phone}</span>
                                            ))}
                                        </div>
                                    </div>
                                     <div className="flex items-start gap-4">
                                        <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-foreground">Office</p>
                                            <span>{contactInfo?.address}</span>
                                        </div>
                                    </div>
                                </motion.div>
                                )}

                                <motion.h3 variants={itemVariants} className="text-2xl font-bold font-headline mt-12 mb-6 text-foreground">Why Partner With Us?</motion.h3>
                                <motion.div variants={itemVariants} className="space-y-4">
                                     <div className="flex items-center gap-3"><Building className="h-5 w-5 text-primary" /><span className="text-foreground">Vertically Integrated Supply Chain</span></div>
                                     <div className="flex items-center gap-3"><Globe className="h-5 w-5 text-primary" /><span className="text-foreground">Global Export Expertise</span></div>
                                     <div className="flex items-center gap-3"><HelpCircle className="h-5 w-5 text-primary" /><span className="text-foreground">Dedicated Partner Support</span></div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>
            
            {/* FAQ and Map Section */}
            <motion.section 
                className="pb-24 lg:pb-32"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
            >
                <div className="container mx-auto px-4 grid grid-cols-1 gap-16 items-start">
                     {/* FAQ */}
                    <motion.div variants={itemVariants}>
                        <h2 className="text-3xl font-bold font-headline mb-8 text-foreground text-center">Frequently Asked Questions</h2>
                        <div className="w-full max-w-3xl mx-auto bg-background/50 backdrop-blur-xl rounded-3xl shadow-lg border border-border/10 p-4">
                            <Accordion type="single" collapsible className="w-full">
                                {faqItems.map((item, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">{item.question}</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                        {item.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </motion.div>
                    
                    {/* Map */}
                    <motion.div variants={itemVariants}>
                        <div className="bg-background/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/10 overflow-hidden p-2">
                             <div className="aspect-w-16 aspect-h-[12] md:aspect-h-9 lg:aspect-h-8 rounded-2xl overflow-hidden h-[500px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.7520424391584!2d-6.0869577!3d35.0590408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0a35c19587a823%3A0x2fcb600171fc75d9!2sExport%20Optimum%20SARL!5e0!3m2!1sen!2sma!4v1678997611642!5m2!1sen!2sma"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

             {/* Success Message */}
            {successMessage && !isSubmitting && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-background p-8 rounded-3xl max-w-sm w-full mx-auto shadow-2xl text-center border border-border/20"
                    >
                        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 mb-5 border-4 border-background shadow-md">
                            <CheckCircle className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold font-headline text-foreground">Success!</h2>
                        <p className="text-muted-foreground mt-2">{successMessage}</p>
                        <Button onClick={() => setSuccessMessage('')} className="mt-8 w-full rounded-lg py-3">Close</Button>
                    </motion.div>
                </div>
            )}
        </main>
        <Footer />
        </div>
  )

  return (
    <>
      {isClient ? (
        <AnimatedGradientBackground>
          <PageContent />
        </AnimatedGradientBackground>
      ) : (
        <PageContent />
      )}
    </>
  );
};

export default ContactPage;
