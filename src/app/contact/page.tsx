
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' }),
});

export default function ContactPage() {
  const { toast } = useToast();
  const contactImage = PlaceHolderImages.find(p => p.id === 'about-us-hero');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Message Sent!',
      description:
        'Thank you for contacting us. We will get back to you shortly.',
    });
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center">
        <div className="grid lg:grid-cols-2 w-full h-full">
            <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center">
                <div className="max-w-lg mx-auto w-full">
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-headline font-bold">
                        Get in Touch
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                        We're here to help and answer any question you might have.
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                <Input placeholder="Inquiry about Hass avocados" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Message</FormLabel>
                                <FormControl>
                                <Textarea
                                    placeholder="Leave your message here..."
                                    className="min-h-[150px]"
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="text-right">
                            <Button type="submit" size="lg">
                            Send Message
                            </Button>
                        </div>
                        </form>
                    </Form>
                     <div className="mt-16 border-t pt-8 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-full">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold">Email</h4>
                                <a href="mailto:contact@exportoptimum.com" className="text-muted-foreground hover:text-primary transition-colors">contact@exportoptimum.com</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-full">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold">Phone</h4>
                                <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">+1 (234) 567-890</a>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-full">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold">Address</h4>
                                <p className="text-muted-foreground">123 Produce Lane, Fruit Valley, 90210</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block relative">
                 {contactImage && (
                    <Image
                        src={contactImage.imageUrl}
                        alt={contactImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={contactImage.imageHint}
                    />
                 )}
                 <div className="absolute inset-0 bg-black/30"></div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
