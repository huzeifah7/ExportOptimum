'use client';

import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2, CheckCircle, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useRef } from 'react';

const faqItems = [
    { question: "What are your main export products?", answer: "We specialize in premium Moroccan Hass avocados, but also export a variety of other high-quality produce including berries and citrus fruits. Please contact us for a detailed product list." },
    { question: "Which countries do you export to?", answer: "We have a robust logistics network and primarily export to partners across Europe, including the Netherlands, France, Spain, and the UK. We are always open to exploring new markets." },
    { question: "What quality certifications do you have?", answer: "Export Optimum is fully certified with GlobalG.A.P., BRC, and SMETA. This ensures our produce meets the highest international standards for safety, quality, and ethical practices." },
    { question: "Can we visit your facilities?", answer: "Absolutely. We encourage our partners to visit our orchards and state-of-the-art packing station in Morocco. Please get in touch to arrange a visit." }
];

type ContactInformation = {
    address: string;
    phoneNumber: string;
    email: string;
};

const ContactPage = () => {
  const firestore = useFirestore();
  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.2 });
  
  const [formData, setFormData] = useState({
    fullName: '', email: '', country: '', subject: '', message: '',
  });
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const contactInfoRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'contactInformation', 'main');
  }, [firestore]);

  const { data: contactInfo, isLoading: isLoadingContact } = useDoc<ContactInformation>(contactInfoRef);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const { fullName, email, subject, message } = formData;
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-white pt-32 pb-16">
          
          {/* Background glows */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, hsl(88,92%,40%,0.11) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'glow-soft 12s ease-in-out infinite' }} />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3 mb-10"
            >
              <span className="w-6 h-px bg-[hsl(88,92%,28%)]" />
              <span className="inline-flex items-center gap-2 text-md font-bold uppercase tracking-[0.25em] text-[hsl(88,92%,25%)]">
                <MessageSquare className="w-3.5 h-3.5" />
                Get in Touch
              </span>
              <span className="w-6 h-px bg-[hsl(88,92%,28%)]" />
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.95] tracking-[-0.04em] text-gray-900"
              >
                Let's{' '}
                <span style={{
                  color: 'transparent',
                  backgroundImage: 'linear-gradient(135deg, hsl(88,92%,30%) 0%, hsl(88,92%,18%) 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text'
                }}>Connect</span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto"
            >
              We're ready to answer your questions and explore how we can meet your needs for premium Moroccan produce.
            </motion.p>
          </div>
        </section>

        <style jsx global>{`
          @keyframes glow-soft {
            0%, 100% { transform: scale(1); opacity: 1; }
            50%       { transform: scale(1.08) translateY(-8px); opacity: 0.7; }
          }
        `}</style>

        {/* ══════════════════════════════════════
            FORM + CONTACT INFO
        ══════════════════════════════════════ */}
        <section ref={formRef} className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              
              {/* LEFT — Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isFormInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 tracking-tight">
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name *</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange} 
                      placeholder="John Doe" 
                      disabled={isSubmitting} 
                      required
                      className="h-12 rounded-xl border-gray-200 focus:border-[hsl(88,92%,28%)]/50 focus:ring-[hsl(88,92%,28%)]/20"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="you@company.com" 
                        disabled={isSubmitting} 
                        required
                        className="h-12 rounded-xl border-gray-200 focus:border-[hsl(88,92%,28%)]/50 focus:ring-[hsl(88,92%,28%)]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-semibold text-gray-700">Country</Label>
                      <Input 
                        id="country" 
                        name="country" 
                        value={formData.country} 
                        onChange={handleChange} 
                        placeholder="e.g. Netherlands" 
                        disabled={isSubmitting}
                        className="h-12 rounded-xl border-gray-200 focus:border-[hsl(88,92%,28%)]/50 focus:ring-[hsl(88,92%,28%)]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject *</Label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange} 
                      placeholder="Inquiry about Hass Avocados" 
                      disabled={isSubmitting} 
                      required
                      className="h-12 rounded-xl border-gray-200 focus:border-[hsl(88,92%,28%)]/50 focus:ring-[hsl(88,92%,28%)]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold text-gray-700">Message *</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      placeholder="Please describe your requirements..." 
                      className="min-h-[160px] rounded-xl border-gray-200 focus:border-[hsl(88,92%,28%)]/50 focus:ring-[hsl(88,92%,28%)]/20" 
                      disabled={isSubmitting} 
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 rounded-full bg-[hsl(88,92%,27%)] hover:bg-[hsl(88,92%,22%)] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* RIGHT — Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isFormInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="lg:pl-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
                  Contact Information
                </h3>

                {isLoadingContact ? (
                  <div className="space-y-6">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-start gap-4">
                        <Skeleton className="h-5 w-5 mt-1 bg-gray-100" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-20 mb-2 bg-gray-100" />
                          <Skeleton className="h-4 w-40 bg-gray-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 mb-12">
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-xl bg-[hsl(88,92%,28%)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(88,92%,28%)]/15 transition-colors">
                        <Mail className="h-5 w-5 text-[hsl(88,92%,25%)]" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Email</p>
                        <a href={`mailto:${contactInfo?.email}`} className="text-gray-600 hover:text-[hsl(88,92%,25%)] transition-colors font-light">
                          {contactInfo?.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-xl bg-[hsl(88,92%,28%)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(88,92%,28%)]/15 transition-colors">
                        <Phone className="h-5 w-5 text-[hsl(88,92%,25%)]" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Phone</p>
                        <span className="text-gray-600 font-light">{contactInfo?.phoneNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-xl bg-[hsl(88,92%,28%)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(88,92%,28%)]/15 transition-colors">
                        <MapPin className="h-5 w-5 text-[hsl(88,92%,25%)]" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Office</p>
                        <span className="text-gray-600 font-light leading-relaxed">{contactInfo?.address}</span>
                      </div>
                    </div>
                  </div>
                )}

                
              </motion.div>

            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
            MAP
        ══════════════════════════════════════ */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-100 h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.7520424391584!2d-6.0869577!3d35.0590408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0a35c19587a823%3A0x2fcb600171fc75d9!2sExport%20Optimum%20SARL!5e0!3m2!1sen!2sma!4v1678997611642!5m2!1sen!2sma"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </section>

        {/* Success Modal */}
        {successMessage && !isSubmitting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 rounded-3xl max-w-md w-full text-center shadow-2xl"
            >
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-[hsl(88,92%,28%)]/10 mb-6">
                <CheckCircle className="h-10 w-10 text-[hsl(88,92%,25%)]" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">Success!</h2>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">{successMessage}</p>
              <Button 
                onClick={() => setSuccessMessage('')} 
                className="w-full h-12 rounded-full bg-[hsl(88,92%,27%)] hover:bg-[hsl(88,92%,22%)] font-bold"
              >
                Close
              </Button>
            </motion.div>
          </div>
        )}

      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;