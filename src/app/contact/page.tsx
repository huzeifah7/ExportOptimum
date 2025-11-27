
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
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">
              Get in Touch
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              We're here to help and answer any question you might have. We look
              forward to hearing from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Send us a Message</CardTitle>
                        <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
