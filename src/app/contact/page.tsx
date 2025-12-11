
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, duration: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};


const Contact = () => {
  const firestore = useFirestore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    subject: '',
    message: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const { fullName, email, country, subject, message } = formData;

    if (!fullName || !email || !country || !subject || !message) {
      setError('Please fill in all fields.');
      return;
    }

    if (!firestore) {
      setError('Message service is not available. Please try again later.');
      return;
    }
    
    setIsSubmitting(true);

    try {
        const messagesCollection = collection(firestore, 'messages');
        const newMessage = {
            ...formData,
            createdAt: serverTimestamp(),
        };
        addDocumentNonBlocking(messagesCollection, newMessage);

        setSuccessMessage('Your message has been sent successfully!');
        setFormData({
            fullName: '',
            email: '',
            country: '',
            subject: '',
            message: '',
        });
        setIsModalOpen(true);

    } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      <main className="flex-grow">
        <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-green-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={containerVariants}
            >
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-headline font-bold text-foreground">
                Get in <span className="text-primary">Touch</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                We’re here to answer your questions and explore partnership opportunities. Reach out to our team to discover how we can meet your needs.
              </motion.p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
               {/* Contact Form Section */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
                className="w-full"
              >
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
                  <h2 className="text-3xl font-bold font-headline mb-6 text-foreground">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                     {error && (
                      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full"
                          disabled={isSubmitting}
                          required
                        />
                    </div>
                     <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                             <Input
                              id="email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="you@company.com"
                              className="w-full"
                              disabled={isSubmitting}
                              required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleChange}
                              placeholder="e.g. Netherlands"
                              className="w-full"
                              disabled={isSubmitting}
                              required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Inquiry about Hass Avocados"
                          className="w-full"
                          disabled={isSubmitting}
                          required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Please describe your requirements..."
                          className="w-full min-h-[120px]"
                          rows={5}
                          disabled={isSubmitting}
                          required
                        />
                    </div>

                    <Button type="submit" className="w-full text-lg py-6 rounded-xl font-bold" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>

              {/* Map & Info Section */}
               <motion.div
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, amount: 0.3 }}
                 variants={containerVariants}
                 className="space-y-8"
               >
                 <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold font-headline mb-4">Contact Details</h3>
                     <div className="space-y-4 text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-primary"/>
                            <a href="mailto:contact@exportoptimum.com" className="hover:text-primary">contact@exportoptimum.com</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-primary"/>
                            <span>+212 5 39 39 39 39</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-1"/>
                            <span>Export Optimum SARL, Larache, Morocco</span>
                        </div>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold font-headline mb-4">Our Office</h3>
                     <div className="aspect-video overflow-hidden rounded-xl shadow-inner">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.7520424391584!2d-6.0869577!3d35.0590408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0a35c19587a823%3A0x2fcb600171fc75d9!2sExport%20Optimum%20SARL!5e0!3m2!1sen!2sma!4v1678997611642!5m2!1sen!2sma"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Success Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white p-8 rounded-2xl max-w-sm w-full mx-auto shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold font-headline text-foreground">Success!</h2>
            <p className="text-muted-foreground mt-2">{successMessage}</p>
            <Button
              onClick={closeModal}
              className="mt-6 w-full"
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Contact;
